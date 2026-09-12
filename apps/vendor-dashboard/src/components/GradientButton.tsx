import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function GradientButton({ className = '', children, ...props }: Props) {
  return (
    <button
      {...props}
      className={`w-full rounded-lg py-3 text-sm font-bold tracking-wide text-brand-bg-bottom uppercase transition-transform active:scale-[0.98] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #e8c9a0 0%, #ddaba8 35%, #c6a3c9 65%, #a3b9cf 100%)',
      }}
    >
      {children}
    </button>
  );
}
