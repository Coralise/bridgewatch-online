import React, { Children } from 'react'
import { motion } from 'framer-motion'
import { Globe, Swords, Lightbulb } from 'lucide-react'
import { servers } from '../data/servers'
import { ServerCard } from '../components/ServerCard'
import { SubmitSection } from '../components/SubmitSection'
const regions = [
  {
    key: 'Asia' as const,
    label: 'Asia',
    icon: Globe,
  },
  {
    key: 'America' as const,
    label: 'America',
    icon: Globe,
  },
  {
    key: 'Europe' as const,
    label: 'Europe',
    icon: Globe,
  },
]
export function Home() {
  return (
    <>
      {/* Hero background image */}
      <div className="absolute top-0 left-0 w-full h-150 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f]/40 via-[#0a0a0f]/70 to-[#0a0a0f]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
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
            className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 mb-5"
          >
            <Swords className="h-4 w-4" />
            Albion Online · Bridgewatch Faction
          </motion.div>
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
            Rally Under the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Bridgewatch
            </span>{' '}
            Banner
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
            Unite with Bridgewatch loyalists across the realm. Find your Discord
            server and stand with your faction in Albion.
          </motion.p>
        </div>

        {/* Servers by Region */}
        {regions.map((region, regionIndex) => {
          const regionServers = servers.filter((s) => s.region === region.key)
          if (regionServers.length === 0) return null
          return (
            <motion.section
              key={region.key}
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
                delay: 0.3 + regionIndex * 0.1,
              }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-5">
                <region.icon className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold text-white">{region.label}</h2>
                <span className="text-xs text-neutral-500 ml-1">
                  {regionServers.length} server
                  {regionServers.length !== 1 ? 's' : ''}
                </span>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {
                    opacity: 0,
                  },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {regionServers.map((server) => (
                  <ServerCard key={server.inviteLink} server={server} />
                ))}
              </motion.div>
            </motion.section>
          )
        })}

        {/* Faction Tip */}
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
            delay: 0.55,
          }}
          className="mb-12"
        >
          <div className="flex items-start gap-4 rounded-xl bg-orange-500/5 border border-orange-500/15 p-4 md:p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 shrink-0 mt-0.5">
              <Lightbulb className="h-4.5 w-4.5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-400 mb-1">
                Did You Know?
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Using{' '}
                <span className="text-white font-medium">
                  faction transport
                </span>{' '}
                with a <span className="text-white font-medium">party</span>?
                You'll be teleported to the zone where the{' '}
                <span className="text-orange-400 font-medium">
                  majority of your party members
                </span>{' '}
                are — not necessarily your own destination.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit & Requirements */}
        <SubmitSection />
      </main>
    </>
  )
}
