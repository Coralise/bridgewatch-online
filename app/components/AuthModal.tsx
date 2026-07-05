import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield } from 'lucide-react'
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onDiscordLogin: () => void
}
// Discord brand logo (lucide deprecated its Discord icon, so use an inline SVG)
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}
export function AuthModal({ isOpen, onClose, onDiscordLogin }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="relative w-full max-w-sm pointer-events-auto"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#12121a] border border-white/10 backdrop-blur-xl p-7 shadow-2xl">
                <div className="absolute -inset-px bg-linear-to-b from-orange-500/10 to-transparent rounded-2xl pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-11 cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Logo */}
                  <div className="flex h-9 w-9 mb-2 items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, .5))' }}>
                    <img src="/images/BWIcon.png" alt="Bridgewatch" className="h-9 w-9" />
                  </div>

                  <h2
                    id="auth-modal-title"
                    className="text-xl font-bold text-white mb-4"
                  >
                    Join Bridgewatch
                  </h2>

                  {/* Discord login */}
                  <button
                    onClick={onDiscordLogin}
                    className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-[#5865F2] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_25px_-5px_rgba(88,101,242,0.6)] cursor-pointer"
                  >
                    <DiscordIcon className="h-5 w-5" />
                    Continue with Discord
                  </button>

                  <p className="mt-5 text-[11px] text-neutral-500 leading-relaxed">
                    We only use your Discord ID, name, and profile picture to identify you. By continuing you agree to our community guidelines.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
