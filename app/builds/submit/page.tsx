"use client";

import React, { use, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Hammer,
  Swords,
  Shield,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link';
type FormState = 'idle' | 'submitting' | 'success'
const contentTypes = [
  'ZvZ',
  'Ganking',
  'Solo PvP',
  'Group Roaming',
  'Hellgates',
  'Faction Warfare',
  'Other',
]
const tips = [
  'Include all gear pieces, including food and potions',
  'Mention any key swaps for different fight scenarios',
  'Add a one-line summary of when this build shines',
]
export default function BuildSubmission() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [buildName, setBuildName] = useState('')
  const [contentType, setContentType] = useState('')
  const [mainWeapon, setMainWeapon] = useState('')
  const [loadout, setLoadout] = useState('')
  const [strategy, setStrategy] = useState('')
  const [ign, setIgn] = useState('')
  const [discord, setDiscord] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setTimeout(() => {
      setFormState('success')
    }, 1000)
  }
  const resetForm = () => {
    setFormState('idle')
    setBuildName('')
    setContentType('')
    setMainWeapon('')
    setLoadout('')
    setStrategy('')
    setIgn('')
    setDiscord('')
  }
  const inputClasses =
    'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20'
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-100 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/4 via-[#0a0a0f]/40 to-[#0a0a0f]" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Back link */}
        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mb-6"
        >
          <Link
            href="/builds"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builds
          </Link>
        </motion.div>

        {/* Hero */}
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
          }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 mb-4">
            <Hammer className="h-4 w-4" />
            Build Submission
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
            Share Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Build
            </span>{' '}
            with the Faction
          </h1>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            Submit a loadout you've tested in the field. Our team will review
            and add it to the public library.
          </p>
        </motion.div>

        {/* Submission tips */}
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
            delay: 0.1,
          }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 rounded-xl bg-orange-500/5 border border-orange-500/15 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 shrink-0 mt-0.5">
              <Lightbulb className="h-4.5 w-4.5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-400 mb-2">
                Tips for a Great Submission
              </h3>
              <ul className="space-y-1">
                {tips.map((tip) => (
                  <li
                    key={tip}
                    className="text-xs text-neutral-400 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-orange-500/60 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
          Under construction. Stay tuned!
        </p>
      </main>
    </>
  )
}