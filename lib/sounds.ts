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
  | "win"
  | "kiss"
  | "birthday";

let ctx: AudioContext | null = null;
let muted = false;
let birthdayStopId = 0;

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
  osc.onended = () => {
    try {
      osc.disconnect();
      gain.disconnect();
    } catch {
      /* ignore */
    }
  };
}

function chord(freqs: number[], opts?: Parameters<typeof tone>[1]) {
  freqs.forEach((f, i) => tone(f, { ...opts, delay: (opts?.delay ?? 0) + i * 0.05 }));
}

// Happy Birthday melody — classic tune in C major.
// Each row: [frequency, beats]
// 1 beat ≈ 0.35s for a gentle singalong tempo.
const NOTES = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};
const BIRTHDAY_MELODY: Array<[number, number]> = [
  // Happy birth-day to you
  [NOTES.G4, 0.75], [NOTES.G4, 0.25], [NOTES.A4, 1], [NOTES.G4, 1], [NOTES.C5, 1], [NOTES.B4, 2],
  // Happy birth-day to you
  [NOTES.G4, 0.75], [NOTES.G4, 0.25], [NOTES.A4, 1], [NOTES.G4, 1], [NOTES.D5, 1], [NOTES.C5, 2],
  // Happy birth-day dear El-la
  [NOTES.G4, 0.75], [NOTES.G4, 0.25], [NOTES.G5, 1], [NOTES.E5, 1], [NOTES.C5, 1], [NOTES.B4, 1], [NOTES.A4, 1.5],
  // Happy birth-day to you
  [NOTES.F5, 0.75], [NOTES.F5, 0.25], [NOTES.E5, 1], [NOTES.C5, 1], [NOTES.D5, 1], [NOTES.C5, 2],
];

function playBirthday(startOffset = 0) {
  const c = getCtx();
  if (!c) return () => {};
  const beat = 0.36; // seconds per beat
  let t = startOffset;
  const sources: OscillatorNode[] = [];
  const cleanup = (osc: OscillatorNode, gain: GainNode) => {
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        /* ignore */
      }
    };
  };
  for (const [freq, beats] of BIRTHDAY_MELODY) {
    const dur = beats * beat;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, c.currentTime + t);
    osc.connect(gain).connect(c.destination);
    const start = c.currentTime + t;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.13, start + 0.04);
    gain.gain.setValueAtTime(0.13, start + Math.max(0.04, dur * 0.7));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    cleanup(osc, gain);
    sources.push(osc);
    t += dur;
  }
  const flourishAt = t + 0.1;
  [NOTES.C5, NOTES.E5, NOTES.G5].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, c.currentTime + flourishAt + i * 0.06);
    osc.connect(gain).connect(c.destination);
    const start = c.currentTime + flourishAt + i * 0.06;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
    osc.start(start);
    osc.stop(start + 0.85);
    cleanup(osc, gain);
    sources.push(osc);
  });
  return () => {
    sources.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* ignore */
      }
    });
  };
}

let stopBirthdayFn: (() => void) | null = null;
export function stopBirthday() {
  if (stopBirthdayFn) {
    try {
      stopBirthdayFn();
    } catch {
      /* ignore */
    }
    stopBirthdayFn = null;
  }
  birthdayStopId++;
}

export function setMuted(next: boolean) {
  muted = next;
  if (muted) stopBirthday();
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
      o.onended = () => {
        try {
          o.disconnect();
          g.disconnect();
        } catch {
          /* ignore */
        }
      };
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
    case "kiss":
      tone(880, { type: "sine", attack: 0.01, decay: 0.08, peak: 0.1 });
      tone(1320, { type: "sine", attack: 0.01, decay: 0.12, peak: 0.08, delay: 0.05 });
      tone(1760, { type: "sine", attack: 0.005, decay: 0.18, peak: 0.06, delay: 0.12 });
      break;
    case "birthday":
      stopBirthday();
      stopBirthdayFn = playBirthday(0);
      break;
  }
}
