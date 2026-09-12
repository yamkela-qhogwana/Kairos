import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AuthImagePanel } from './AuthImagePanel';
import { KairosWordmark } from './KairosWordmark';

type Props = {
  children: ReactNode;
  imageSrc?: string;
};

/**
 * Shared auth screen shell. Wide screens (1300px+): image and form sit side
 * by side. Narrower screens: the image drops to a full-bleed background
 * layer behind the form card, per brand direction ("image at the back").
 * The split needs real width to breathe, so it only kicks in at 1300px —
 * even Tailwind's lg (1024px) still left each half too cramped.
 */
export function AuthLayout({ children, imageSrc }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-brand-bg-top min-[1300px]:flex min-[1300px]:flex-row-reverse">
      <div className="absolute inset-0 min-[1300px]:relative min-[1300px]:w-1/2">
        <AuthImagePanel imageSrc={imageSrc} />
      </div>

      {/* Rendered after the image panel so the dot texture reads as an
          overlay on top of the photo, not a layer hidden behind it. */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="vendor-page-dot-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="1.2" fill="#ffffff" fillOpacity="0.16" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vendor-page-dot-grid)" />
      </svg>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-12 min-[1300px]:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-sm rounded-none border border-white/10 bg-brand-bg-bottom/90 p-8 pt-12 shadow-2xl backdrop-blur-xl sm:max-w-md md:max-w-xl md:p-12 md:pt-16 min-[1300px]:max-w-sm min-[1300px]:rounded-2xl min-[1300px]:border-none min-[1300px]:bg-transparent min-[1300px]:p-0 min-[1300px]:shadow-none min-[1300px]:backdrop-blur-none"
        >
          <KairosWordmark className="mb-8 text-center min-[1300px]:text-left" />
          {children}
        </motion.div>
      </div>
    </div>
  );
}
