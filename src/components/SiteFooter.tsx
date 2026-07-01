import { IconSpark } from "./icons";
import { WORLD_DOTS } from "./worldDots";

const columns = [
  {
    title: "Navigation",
    links: [
      { label: "Docs", href: "#" },
      { label: "Network", href: "#network" },
      { label: "Portal", href: "/dashboard" },
      { label: "GitHub", href: "https://github.com/0xward/Kait-Web" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "CLI Reference", href: "https://github.com/0xward/Kait-Web/tree/main/cli" },
      { label: "Deploy Guide", href: "https://github.com/0xward/Kait-Web/tree/main/contracts" },
      { label: "Smart Contract", href: "https://github.com/0xward/Kait-Web/blob/main/contracts/KaitGateway.sol" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "GitHub", href: "https://github.com/0xward/Kait-Web" },
      { label: "X (Twitter)", href: "#" },
      { label: "Discord", href: "#" },
    ],
  },
];

const nodes = [
  { code: "SF", x: 42, y: 49 },
  { code: "LON", x: 182, y: 42 },
  { code: "SGP", x: 266, y: 70 },
  { code: "TYO", x: 301, y: 49 },
];

export default function SiteFooter() {
  return (
    <footer className="relative b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr] gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <a href="#top" className="flex items-center gap-2 font-display font-extrabold text-lg">
              <IconSpark className="w-4 h-4 text-purple" />
              KAIT_
            </a>
            <p className="text-muted text-xs mt-3 max-w-[14rem] leading-relaxed">
              The gateway that pays you. Decentralized API monetization, deployed
              via CLI.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted mb-4">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm hover:text-purple transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted mb-4">
              Global Node
            </p>
            <div className="flex gap-3 font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
              {nodes.map((n, i) => (
                <span key={n.code} className="flex items-center gap-3">
                  {n.code}
                  {i < nodes.length - 1 && <span className="text-purple">+</span>}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 360 160" className="w-full">
              {WORLD_DOTS.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={1.1} fill="rgba(17,17,17,0.18)" />
              ))}
              {nodes.map((n) => (
                <circle key={n.code} cx={n.x} cy={n.y} r={2.4} fill="#8b4df5" />
              ))}
            </svg>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 pt-6 b-line-t font-mono text-[10px] tracking-widest2 uppercase text-muted">
          <span>© 2026 KAIT. ALL RIGHTS RESERVED.</span>
          <span>MIT LICENSE</span>
        </div>
      </div>
    </footer>
  );
}
