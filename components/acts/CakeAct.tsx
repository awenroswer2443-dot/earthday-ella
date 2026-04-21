"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import ProgressBar from "@/components/ui/ProgressBar";
import { SparkleIcon, MusicIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play, stopBirthday } from "@/lib/sounds";

type MicState = "idle" | "listening" | "denied";

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

export default function CakeAct() {
  const { go } = useGame();
  const c = content.cake;
  const total = c.candles;
  const [lit, setLit] = useState<boolean[]>(() =>
    Array.from({ length: total }, () => true)
  );
  const [micState, setMicState] = useState<MicState>("idle");
  const [smokes, setSmokes] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const smokeIdRef = useRef(0);

  const blewCount = useMemo(() => lit.filter((v) => !v).length, [lit]);
  const allOut = blewCount === total;

  // Candle positions on the cake
  const positions = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    // Top row: 10 candles on the top ellipse
    const topRow = Math.min(10, total);
    for (let i = 0; i < topRow; i++) {
      const t = topRow === 1 ? 0.5 : i / (topRow - 1);
      arr.push({ x: 10 + t * 80, y: 18 });
    }
    // Bottom row: remaining candles on the middle tier
    const remaining = total - topRow;
    for (let i = 0; i < remaining; i++) {
      const t = remaining === 1 ? 0.5 : i / (remaining - 1);
      arr.push({ x: 16 + t * 68, y: 46 });
    }
    return arr;
  }, [total]);

  const blow = useCallback(
    (i: number) => {
      setLit((prev) => {
        if (!prev[i]) return prev;
        const next = [...prev];
        next[i] = false;
        return next;
      });
      const pos = positions[i];
      if (pos) {
        const sid = smokeIdRef.current++;
        setSmokes((s) => [...s, { id: sid, x: pos.x, y: pos.y }]);
        setTimeout(() => {
          setSmokes((s) => s.filter((sm) => sm.id !== sid));
        }, 1400);
      }
      play("pop");
      vibrate(20);
    },
    [positions]
  );

  const blowNearest = useCallback(() => {
    const firstLit = lit.findIndex((v) => v);
    if (firstLit !== -1) blow(firstLit);
  }, [lit, blow]);

  // Microphone detection
  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMicState("idle");
  }, []);

  const startMic = useCallback(async () => {
    if (micState === "listening") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      const Ctor =
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext || window.AudioContext;
      const ctx = new Ctor();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.fftSize);
      let lastBlow = 0;
      const loop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(data);
        // compute RMS
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const now = Date.now();
        // threshold tuned for gentle breath
        if (rms > 0.18 && now - lastBlow > 220) {
          lastBlow = now;
          // blow out multiple based on loudness
          const n = Math.min(3, Math.max(1, Math.floor(rms * 8)));
          setLit((prev) => {
            const next = [...prev];
            let blown = 0;
            for (let i = 0; i < next.length && blown < n; i++) {
              if (next[i]) {
                next[i] = false;
                const pos = positions[i];
                if (pos) {
                  const sid = smokeIdRef.current++;
                  setSmokes((s) => [...s, { id: sid, x: pos.x, y: pos.y }]);
                  setTimeout(() => {
                    setSmokes((s) => s.filter((sm) => sm.id !== sid));
                  }, 1400);
                }
                blown++;
              }
            }
            if (blown > 0) {
              play("pop");
              vibrate(30);
            }
            return next;
          });
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      setMicState("listening");
    } catch {
      setMicState("denied");
    }
  }, [micState, positions]);

  useEffect(() => {
    return () => stopMic();
  }, [stopMic]);

  // Auto-start the birthday song when the cake appears (browsers require a prior
  // user gesture, and blowing a candle or tapping gold button triggers audio).
  // We attempt it but guard against missing AudioContext.
  useEffect(() => {
    const t = setTimeout(() => play("birthday"), 400);
    return () => {
      clearTimeout(t);
      stopBirthday();
    };
  }, []);

  useEffect(() => {
    if (allOut) {
      stopMic();
      stopBirthday();
      play("success");
      vibrate([80, 40, 80, 40, 160]);
    }
  }, [allOut, stopMic]);

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={10} palette="ella" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-14 pb-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-[#3b1e3a] text-shadow-soft sm:text-6xl">
            {c.title}
          </h2>
          <p className="mt-2 text-base text-[#3b1e3a]/80 sm:text-lg">{c.sub}</p>
        </div>

        <div className="w-full max-w-md">
          <ProgressBar
            value={blewCount}
            max={total}
            label="candles out"
            accent="gold"
          />
        </div>

        {/* Cake */}
        <div className="relative w-full max-w-xl select-none">
          <svg
            viewBox="0 0 100 78"
            className="w-full drop-shadow-[0_30px_30px_rgba(199,98,176,0.25)]"
          >
            <defs>
              <linearGradient id="frostTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff0f5" />
                <stop offset="100%" stopColor="#ffc6d7" />
              </linearGradient>
              <linearGradient id="frostMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7aa0" />
                <stop offset="100%" stopColor="#ff5288" />
              </linearGradient>
              <linearGradient id="frostBottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a77dff" />
                <stop offset="100%" stopColor="#7a52d6" />
              </linearGradient>
              <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff3dc" />
                <stop offset="100%" stopColor="#ffe58a" />
              </linearGradient>
              <radialGradient id="flame" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fffde1" />
                <stop offset="60%" stopColor="#ffd35c" />
                <stop offset="100%" stopColor="#ff5288" />
              </radialGradient>
            </defs>

            {/* Plate */}
            <ellipse cx={50} cy={74} rx={46} ry={3.5} fill="url(#plate)" />
            {/* Bottom tier (purple) */}
            <rect
              x={8}
              y={56}
              width={84}
              height={16}
              rx={3}
              fill="url(#frostBottom)"
            />
            <path
              d="M8 58 Q 13 62 18 58 T 28 58 T 38 58 T 48 58 T 58 58 T 68 58 T 78 58 T 88 58 T 92 58"
              stroke="#fff"
              strokeWidth={1.2}
              fill="none"
              opacity={0.7}
            />
            {/* Middle tier (pink) */}
            <rect
              x={14}
              y={34}
              width={72}
              height={22}
              rx={3}
              fill="url(#frostMid)"
            />
            <path
              d="M14 36 Q 19 40 24 36 T 34 36 T 44 36 T 54 36 T 64 36 T 74 36 T 86 36"
              stroke="#fff"
              strokeWidth={1.2}
              fill="none"
              opacity={0.8}
            />
            {/* Top tier (cream) */}
            <rect
              x={22}
              y={10}
              width={56}
              height={24}
              rx={3}
              fill="url(#frostTop)"
            />
            <path
              d="M22 14 Q 28 18 34 14 T 48 14 T 62 14 T 78 14"
              stroke="#ff5288"
              strokeWidth={1.2}
              fill="none"
              opacity={0.7}
            />
            {/* Sprinkles */}
            {[...Array(14)].map((_, i) => (
              <rect
                key={i}
                x={18 + ((i * 7) % 64)}
                y={40 + ((i * 11) % 14)}
                width={2}
                height={1}
                rx={0.5}
                fill={
                  ["#ffd35c", "#a77dff", "#5fb553", "#fff"][i % 4]
                }
                transform={`rotate(${(i * 37) % 180} ${19 + ((i * 7) % 64)} ${
                  40 + ((i * 11) % 14)
                })`}
                opacity={0.9}
              />
            ))}
            {[...Array(14)].map((_, i) => (
              <rect
                key={`b-${i}`}
                x={12 + ((i * 9) % 76)}
                y={62 + ((i * 5) % 8)}
                width={2}
                height={1}
                rx={0.5}
                fill={
                  ["#ffd35c", "#fff", "#5fb553", "#ff7aa0"][i % 4]
                }
                transform={`rotate(${(i * 53) % 180} ${13 + ((i * 9) % 76)} ${
                  62 + ((i * 5) % 8)
                })`}
                opacity={0.9}
              />
            ))}

            {/* Candles */}
            {positions.map((p, i) => {
              const isLit = lit[i];
              return (
                <g key={i} transform={`translate(${p.x} ${p.y})`}>
                  {/* Candle body */}
                  <rect
                    x={-0.9}
                    y={0}
                    width={1.8}
                    height={8}
                    rx={0.3}
                    fill={
                      ["#ff5288", "#ffd35c", "#a77dff", "#5fb553", "#fff"][
                        i % 5
                      ]
                    }
                  />
                  <rect
                    x={-0.9}
                    y={2}
                    width={1.8}
                    height={0.6}
                    fill="rgba(255,255,255,0.5)"
                  />
                  {/* Wick */}
                  <rect x={-0.15} y={-1.2} width={0.3} height={1.2} fill="#3b1e3a" />
                  {/* Flame */}
                  {isLit && (
                    <ellipse
                      cx={0}
                      cy={-3}
                      rx={1.2}
                      ry={2.4}
                      fill="url(#flame)"
                      className="anim-flame"
                      style={
                        {
                          "--dur": `${0.5 + (i % 5) * 0.05}s`,
                          "--delay": `${(i % 7) * 0.05}s`,
                        } as React.CSSProperties
                      }
                    />
                  )}
                  {/* Clickable area */}
                  <circle
                    cx={0}
                    cy={-1}
                    r={3}
                    fill="transparent"
                    style={{ cursor: isLit ? "pointer" : "default" }}
                    onClick={() => isLit && blow(i)}
                  />
                </g>
              );
            })}

            {/* Smoke puffs */}
            {smokes.map((s) => (
              <motion.circle
                key={s.id}
                cx={s.x}
                cy={s.y - 3}
                r={1.2}
                fill="#cbbfc9"
                initial={{ opacity: 0.7, cy: s.y - 3, r: 1.2 }}
                animate={{
                  opacity: 0,
                  cy: s.y - 12,
                  r: 3,
                }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Tap entire cake helper */}
          {!allOut && (
            <button
              onClick={blowNearest}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Blow out the next candle"
            />
          )}
        </div>

        {/* Sing-along */}
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-blush-600 shadow-dreamy backdrop-blur">
          <motion.span
            animate={{ y: [0, -3, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <MusicIcon size={14} />
          </motion.span>
          <span className="font-display italic">♪ ♫ singing just for you</span>
          <button
            onClick={() => {
              stopBirthday();
              play("birthday");
            }}
            className="ml-1 rounded-full bg-blush-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
          >
            sing again
          </button>
        </div>

        {/* Mic row */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-md text-center text-xs font-semibold uppercase tracking-widest text-[#3b1e3a]/60">
            {c.micTitle}
          </div>
          <div className="flex items-center gap-2">
            {micState !== "listening" && !allOut && (
              <CandyButton
                variant="gold"
                size="sm"
                sound="whoosh"
                onClick={startMic}
              >
                🫁 {c.micButton}
              </CandyButton>
            )}
            {micState === "listening" && (
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blush-600 shadow-dreamy backdrop-blur">
                <motion.span
                  className="inline-block h-3 w-3 rounded-full bg-blush-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                {c.micActive}
                <button
                  onClick={stopMic}
                  className="ml-2 text-xs opacity-60 underline"
                >
                  stop
                </button>
              </div>
            )}
            {micState === "denied" && (
              <div className="rounded-full bg-white/70 px-3 py-1 text-xs text-[#3b1e3a]/70">
                {c.micDenied}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {allOut && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-3xl bg-white/85 px-6 py-5 text-center shadow-dreamy backdrop-blur"
            >
              <div className="flex items-center gap-2 font-display text-2xl font-black text-blush-600">
                <SparkleIcon size={22} /> {c.doneTitle} <SparkleIcon size={22} />
              </div>
              <div className="max-w-md text-sm text-[#3b1e3a]/80">
                {c.doneSub}
              </div>
              <CandyButton
                variant="pink"
                size="md"
                sound="chime"
                onClick={() => go("act7")}
              >
                {c.cta} →
              </CandyButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
