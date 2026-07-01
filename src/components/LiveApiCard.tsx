"use client";
import { useRef, useState } from "react";
import { IconDoc, IconCloud, IconAperture, IconChat, IconArrowUpRight } from "./icons";
import type { ApiSimSpec } from "./apiSimulations";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  vision_ocr: IconDoc,
  weathermesh: IconCloud,
  img_forge: IconAperture,
  lingo_net: IconChat,
};

type Phase = "idle" | "paying" | "calling" | "streaming" | "done";

export default function LiveApiCard({ spec }: { spec: ApiSimSpec }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const Icon = ICONS[spec.key] ?? IconDoc;

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run() {
    if (phase !== "idle" && phase !== "done") return;
    clearTimers();
    setVisibleLines(0);
    setLatency(null);
    setPhase("paying");

    const [minMs, maxMs] = spec.latencyMs;
    const callLatency = Math.round(minMs + Math.random() * (maxMs - minMs));

    timers.current.push(
      setTimeout(() => setPhase("calling"), 550), // simulated on-chain payment confirm
      setTimeout(() => {
        setLatency(callLatency);
        setPhase("streaming");
      }, 550 + 400)
    );

    spec.responseLines.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setVisibleLines(i + 1), 550 + 400 + 90 * (i + 1))
      );
    });

    timers.current.push(
      setTimeout(() => setPhase("done"), 550 + 400 + 90 * spec.responseLines.length + 300)
    );
  }

  const isBusy = phase === "paying" || phase === "calling";
  const isStreamingOrDone = phase === "streaming" || phase === "done";

  return (
    <div className="group">
      <button
        onClick={run}
        disabled={isBusy}
        className="relative aspect-[4/3] w-full bg-ink overflow-hidden text-left disabled:cursor-wait"
      >
        {/* idle / icon state */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isStreamingOrDone ? "opacity-0" : "opacity-100"
          }`}
        >
          <Icon
            className={`w-10 h-10 md:w-14 md:h-14 text-white/70 transition-all duration-300 ${
              isBusy ? "scale-90 text-purple animate-pulse" : "group-hover:text-lime group-hover:scale-105"
            }`}
          />
        </div>

        {/* terminal / response state */}
        <div
          className={`absolute inset-0 p-3 font-mono text-[9px] md:text-[10px] leading-relaxed overflow-hidden transition-opacity duration-300 ${
            isStreamingOrDone ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <p className="text-white/40 mb-1.5 truncate">{spec.requestBody}</p>
          {spec.responseLines.slice(0, visibleLines).map((line, i) => (
            <p key={i} className="text-lime whitespace-pre">
              {line}
            </p>
          ))}
          {phase === "streaming" && (
            <span className="inline-block w-1.5 h-3 bg-lime align-text-bottom animate-pulse" />
          )}
        </div>

        {/* price tag, top-left, always visible */}
        <span className="absolute top-2 left-2 md:top-3 md:left-3 font-mono text-[8px] md:text-[9px] tracking-widest2 text-white/40 z-10">
          {spec.price}/CALL
        </span>

        {/* phase badge, top-right */}
        <span className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          {phase === "paying" && (
            <span className="font-mono text-[8px] tracking-widest2 uppercase text-purple bg-ink/80 px-1.5 py-0.5">
              PAYING…
            </span>
          )}
          {phase === "calling" && (
            <span className="font-mono text-[8px] tracking-widest2 uppercase text-lime bg-ink/80 px-1.5 py-0.5">
              CALLING…
            </span>
          )}
          {phase === "done" && latency !== null && (
            <span className="font-mono text-[8px] tracking-widest2 uppercase text-white/50 bg-ink/80 px-1.5 py-0.5">
              {latency}MS
            </span>
          )}
        </span>

        {/* call-to-action hint, bottom, idle only */}
        {phase === "idle" && (
          <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 font-mono text-[8px] tracking-widest2 uppercase text-white/30 group-hover:text-white/60 transition-colors z-10">
            TAP TO SIMULATE CALL
          </span>
        )}
        {phase === "done" && (
          <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 font-mono text-[8px] tracking-widest2 uppercase text-white/30 z-10">
            TAP TO RUN AGAIN
          </span>
        )}
      </button>

      <div className="flex items-start justify-between mt-2.5">
        <div>
          <p className="font-mono font-semibold text-[11px] md:text-xs uppercase tracking-wide">{spec.name}</p>
          <p className="font-mono text-[9px] uppercase tracking-widest2 text-muted mt-1">{spec.tag}</p>
        </div>
        <IconArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-purple transition-colors shrink-0 mt-1" />
      </div>
    </div>
  );
}
