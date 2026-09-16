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

      <div className="relative z-10 flex min-h-screen w-full px-6 py-8 [@media(max-height:640px)]:py-4! min-[1300px]:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="m-auto flex min-h-[65vh] max-h-[90vh] w-full max-w-sm flex-col overflow-x-visible overflow-y-auto rounded-none border border-white/10 bg-brand-bg-bottom/90 p-8 pt-10 shadow-2xl backdrop-blur-xl [scrollbar-gutter:stable] sm:max-w-md md:max-w-lg md:p-10 [@media(max-height:640px)]:min-h-0! [@media(max-height:640px)]:p-5! [@media(max-height:640px)]:pt-5! min-[1300px]:min-h-0! min-[1300px]:block! min-[1300px]:rounded-2xl! min-[1300px]:border-none! min-[1300px]:bg-transparent! min-[1300px]:p-0! min-[1300px]:shadow-none! min-[1300px]:backdrop-blur-none! min-[1300px]:max-w-md!"
        >
          {/* my-auto (not justify-center on the scroll container) so this
              safely centers when content is shorter than min-h, but never
              pushes content above the reachable scroll position when it's
              taller than max-h — margin can't go negative, so it degrades
              to top-aligned instead of clipping. */}
          <div className="my-auto">
            <KairosWordmark className="mb-6 text-center min-[1300px]:text-left [@media(max-height:640px)]:mb-3!" />
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
