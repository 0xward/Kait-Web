const stack = [
  { name: "Base", file: "base.png" },
  { name: "Next.js", file: "nextjs.png" },
  { name: "Wagmi", file: "wagmi.png" },
  { name: "Viem", file: "viem.png" },
  { name: "IPFS", file: "ipfs.png" },
  { name: "Tailwind CSS", file: "tailwind.png" },
];

export default function LogoBar() {
  return (
    <section className="relative b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-10">
        <p className="font-mono text-xs tracking-widest2 text-muted mb-6 md:mb-8 text-center md:text-left">
          /07&nbsp;&nbsp;POWERED BY
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-center gap-x-9 sm:gap-x-12 gap-y-6">
          {stack.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.name}
              src={`/logos/${logo.file}`}
              alt={logo.name}
              title={logo.name}
              className="h-8 md:h-10 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
