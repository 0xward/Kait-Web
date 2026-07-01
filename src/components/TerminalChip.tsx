"use client";
import { useState } from "react";
import { IconCopy } from "./icons";

interface TerminalChipProps {
  command: string;
}

export default function TerminalChip({ command }: TerminalChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="inline-flex items-center gap-3 bg-ink px-4 py-3 font-mono text-xs md:text-sm max-w-full">
      <span className="text-purple shrink-0">$</span>
      <span className="text-white/90 truncate">{command}</span>
      <button
        onClick={handleCopy}
        aria-label="Copy command"
        className="shrink-0 text-white/50 hover:text-lime transition-colors"
      >
        {copied ? (
          <span className="text-[10px] tracking-widest2 uppercase text-lime">OK</span>
        ) : (
          <IconCopy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
