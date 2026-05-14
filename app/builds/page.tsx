"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { Swords, Sparkles, Hammer, Construction, Plus } from 'lucide-react'
import Link from 'next/link';
const previewCategories = [
  {
    label: 'ZvZ',
    description: 'Large-scale faction warfare',
  },
  {
    label: 'Ganking',
    description: 'Solo & duo pursuit kits',
  },
  {
    label: 'Solo Roaming',
    description: 'Open world red zone faction-flagged roaming',
  },
  {
    label: 'Group Roaming',
    description: '5–10 man compositions',
  },
]
export default function Builds() {
  return (
    <>
      {/* Hero background tint */}
      <div className="absolute top-0 left-0 w-full h-150 z-0 pointer-events-none overflow-hidden">
        <img
          src="images/BWP.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-40"
          style={{ objectPosition: 'top', maskImage: 'linear-gradient(to top, transparent, black)', WebkitMaskImage: 'linear-gradient(to top, transparent, black)' }} />
        
        <div className="absolute inset-0" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight"
          >
            Battle-Tested{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Builds
            </span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="text-base text-neutral-400 leading-relaxed"
          >
            Loadouts handpicked by Bridgewatch veterans. Gear, spells, and
            tactics for every type of content.
          </motion.p>

          {/* Submit a Build CTA (disabled) */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
            className="mt-6 flex justify-center"
          >
            <div className="relative group">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500/40 px-5 py-2.5 text-sm font-semibold text-white/70 cursor-not-allowed select-none"
              >
                <Plus className="h-4 w-4" />
                Submit a Build
              </button>

              {/* Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20"
              >
                <div className="relative whitespace-nowrap rounded-md bg-[#15151c] border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 shadow-lg">
                  <span className="text-orange-400">●</span> Coming Soon
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#15151c] border-l border-t border-white/10"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coming soon empty state */}
        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-12 text-center">
            <div className="absolute -inset-px bg-linear-to-b from-orange-500/10 to-transparent rounded-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 mb-5">
                <Construction className="h-7 w-7 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Builds Library Coming Soon
              </h2>
              <p className="text-sm md:text-base text-neutral-400 max-w-md mb-8 leading-relaxed">
                We're assembling a curated library of Bridgewatch builds. Each
                one will include gear, swaps, food, and a short tactical
                breakdown.
              </p>

              {/* Category preview */}
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Planned Categories
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {previewCategories.map((cat, i) => (
                    <motion.div
                      key={cat.label}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 0.4 + i * 0.05,
                      }}
                      className="flex flex-col items-start text-left rounded-lg bg-white/3 border border-white/10 px-3 py-2.5 hover:bg-white/5 hover:border-orange-500/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <Swords className="h-3 w-3 text-orange-500" />
                        <span className="text-sm font-semibold text-white">
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 leading-relaxed">
                        {cat.description}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  )
}