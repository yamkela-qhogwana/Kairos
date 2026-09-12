type Props = {
  tagline?: string;
  className?: string;
};

const gradientStyle = {
  backgroundImage: 'linear-gradient(90deg, #e8c9a0 0%, #ddaba8 35%, #c6a3c9 65%, #a3b9cf 100%)',
};

export function KairosWordmark({ tagline = 'FOR VENDORS', className = '' }: Props) {
  return (
    <div className={className}>
      <h1 className="inline-flex items-end text-4xl font-bold tracking-[0.13em] sm:text-5xl md:text-6xl min-[1300px]:text-5xl">
        <span className="bg-clip-text text-transparent" style={gradientStyle}>
          KAIR
        </span>
        <span className="relative inline-block">
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            O
          </span>
          <span className="absolute inset-x-0 -top-[0.5em] flex justify-center gap-[0.16em]">
            <span className="h-[0.16em] w-[0.16em] rounded-full bg-brand-gold" />
            <span className="h-[0.16em] w-[0.16em] rounded-full bg-brand-blue" />
          </span>
        </span>
        <span className="bg-clip-text text-transparent" style={gradientStyle}>
          S
        </span>
      </h1>
      {tagline ? (
        <p className="mt-2 text-xs font-semibold tracking-[0.35em] text-brand-muted uppercase">
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
