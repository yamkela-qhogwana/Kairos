import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { KairosWordmark } from './KairosWordmark';

type Props = {
  children: ReactNode;
};

/**
 * Full-width, no-split auth shell for longer forms (signup) where a vendor
 * fills in several fields once — a wide centered form beats splitting the
 * screen with decorative image real estate they won't look at twice.
 */
export function CenteredAuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-brand-bg-top">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="vendor-page-dot-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="1.2" fill="#ffffff" fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vendor-page-dot-grid)" />
      </svg>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-brand-bg-bottom/70 p-10 shadow-2xl backdrop-blur-xl sm:max-w-xl lg:max-w-3xl lg:p-12"
        >
          <KairosWordmark className="mb-8 text-center" />
          {children}
        </motion.div>
      </div>
    </div>
  );
}
