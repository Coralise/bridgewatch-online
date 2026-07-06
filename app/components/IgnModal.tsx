import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gamepad2, Check } from 'lucide-react'
interface IgnModalProps {
  isOpen: boolean
  onClose: () => void
  currentIgn: string | null
  onSave: (ign: string) => void
}
export function IgnModal({
  isOpen,
  onClose,
  currentIgn,
  onSave,
}: IgnModalProps) {
  const [ign, setIgn] = useState(currentIgn || '')
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    if (isOpen) {
      setIgn(currentIgn || '')
      setIsSaving(false)
    }
  }, [isOpen, currentIgn])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      onSave(ign)
      setIsSaving(false)
      onClose()
    }, 600)
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
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

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 mb-5">
                    <Gamepad2 className="h-6 w-6 text-orange-500" />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1.5">
                    Set In-Game Name
                  </h2>
                  <p className="text-sm text-neutral-400 mb-6">
                    Link your Albion Online character name to your profile.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Character Name
                      </label>
                      <input
                        type="text"
                        required
                        value={ign}
                        onChange={(e) => setIgn(e.target.value)}
                        placeholder="e.g. Ela"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving || !ign.trim()}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Save IGN
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
