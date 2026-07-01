"use client";
import { useState } from "react";
import { IconSpark } from "./icons";
import ConnectWalletButton from "./ConnectWalletButton";

const navLinks = ["DOCS", "PRICING", "NETWORK", "PORTAL", "GITHUB"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-20 b-line-b bg-bg">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 md:px-10 py-4 md:py-5">
        <a href="#top" className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight">
          <IconSpark className="w-4 h-4 text-purple" />
          KAIT_
        </a>

        <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] tracking-widest2 uppercase text-muted">
          {navLinks.map((link, i) => (
            <span key={link} className="flex items-center gap-4">
              <a href={`#${link.toLowerCase()}`} className="hover:text-ink transition-colors">
                {link}
              </a>
              {i < navLinks.length - 1 && <span className="text-line">/</span>}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="/dashboard"
            className="hidden md:inline font-mono text-[11px] tracking-widest2 uppercase text-muted hover:text-ink transition-colors"
          >
            Dashboard
          </a>

          <ConnectWalletButton />

          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex flex-col gap-1 p-2 -mr-2"
          >
            <span className={`w-4 h-[1.5px] bg-ink transition-transform ${open ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`w-4 h-[1.5px] bg-ink transition-transform ${open ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden b-line-t bg-bg px-5 py-4 flex flex-col gap-3 font-mono text-xs tracking-widest2 uppercase text-muted">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="hover:text-ink transition-colors"
            >
              {link}
            </a>
          ))}
          <a href="/dashboard" onClick={() => setOpen(false)} className="hover:text-ink transition-colors">
            DASHBOARD
          </a>
        </div>
      )}
    </nav>
  );
}
