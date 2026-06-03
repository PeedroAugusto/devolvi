interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <div className="flex items-center gap-2"  >
      <img
        src="/logo.png"
        alt="Devolvi"
        className={className ? `site-logo ${className}` : "site-logo"}
      />
      <p className="page-title">Devolvi</p>
    </div>
  );
}
