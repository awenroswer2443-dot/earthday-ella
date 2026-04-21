"use client";

/**
 * Generated sound effects using the Web Audio API.
 * No audio files required — everything is synthesised on the fly.
 * Sounds are gated through a mute flag so the user can toggle audio anywhere.
 */

type SoundName =
  | "tap"
  | "pop"
  | "chime"
  | "sparkle"
  | "success"
  | "unlock"
  | "whoosh"
  | "win";

let ctx: AudioContext | null = null;
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext || window.AudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function envelope(
  gain: GainNode,
  now: number,
  attack: number,
  decay: number,
  peak = 0.3
) {
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
}

function tone(
  freq: number,
  {
    type = "sine",
    attack = 0.01,
    decay = 0.15,
    peak = 0.18,
    delay = 0,
  }: {
    type?: OscillatorType;
    attack?: number;
    decay?: number;
    peak?: number;
    delay?: number;
  } = {}
) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + delay);
  osc.connect(gain).connect(c.destination);
  const now = c.currentTime + delay;
  envelope(gain, now, attack, decay, peak);
  osc.start(now);
  osc.stop(now + attack + decay + 0.02);
}

function chord(freqs: number[], opts?: Parameters<typeof tone>[1]) {
  freqs.forEach((f, i) => tone(f, { ...opts, delay: (opts?.delay ?? 0) + i * 0.05 }));
}

export function setMuted(next: boolean) {
  muted = next;
}

export function isMuted() {
  return muted;
}

export function play(name: SoundName) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  switch (name) {
    case "tap":
      tone(780, { type: "triangle", attack: 0.002, decay: 0.07, peak: 0.12 });
      break;
    case "pop":
      tone(880, { type: "sine", attack: 0.002, decay: 0.1, peak: 0.16 });
      tone(1320, { type: "sine", attack: 0.002, decay: 0.1, peak: 0.1, delay: 0.02 });
      break;
    case "chime":
      chord([880, 1174.66, 1318.51], { type: "sine", decay: 0.25, peak: 0.1 });
      break;
    case "sparkle":
      tone(1568, { type: "sine", attack: 0.005, decay: 0.15, peak: 0.09 });
      tone(2093, { type: "triangle", attack: 0.005, decay: 0.2, peak: 0.06, delay: 0.05 });
      break;
    case "success":
      chord([523.25, 659.25, 783.99, 1046.5], { type: "sine", decay: 0.35, peak: 0.11 });
      break;
    case "unlock":
      chord([440, 554.37, 659.25, 880], { type: "triangle", decay: 0.45, peak: 0.12 });
      break;
    case "whoosh": {
      const c2 = getCtx();
      if (!c2) return;
      const o = c2.createOscillator();
      const g = c2.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(200, c2.currentTime);
      o.frequency.exponentialRampToValueAtTime(60, c2.currentTime + 0.25);
      o.connect(g).connect(c2.destination);
      envelope(g, c2.currentTime, 0.01, 0.25, 0.08);
      o.start();
      o.stop(c2.currentTime + 0.3);
      break;
    }
    case "win":
      chord([523.25, 659.25, 783.99], { type: "triangle", decay: 0.4, peak: 0.12 });
      chord([1046.5, 1318.51, 1567.98], {
        type: "sine",
        decay: 0.5,
        peak: 0.12,
        delay: 0.25,
      });
      break;
  }
}
