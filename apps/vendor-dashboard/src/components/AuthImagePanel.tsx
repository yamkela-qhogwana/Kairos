type Props = {
  imageSrc?: string;
  className?: string;
};

/**
 * The decorative half of the auth screens. Pass `imageSrc` once the brand
 * photography is ready; until then it falls back to a dot-grid + gradient
 * treatment that matches the mobile apps' splash screens.
 */
export function AuthImagePanel({ imageSrc, className = '' }: Props) {
  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden bg-brand-bg-bottom ${className}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
          <defs>
            <pattern id="vendor-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="#f0f0f2" fillOpacity="0.18" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vendor-dot-grid)" />
        </svg>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(23,24,28,0) 0%, rgba(8,9,11,0.55) 55%, rgba(8,9,11,0.92) 100%)',
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'linear-gradient(135deg, #e8c9a0 0%, #ddaba8 35%, #c6a3c9 65%, #a3b9cf 100%)',
        }}
      />
    </div>
  );
}
