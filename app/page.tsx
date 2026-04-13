"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Swords } from 'lucide-react';
import { servers, enrichServerData, ServerData } from './data/servers';
import { ServerCard } from './components/ServerCard';
import { SubmitSection } from './components/SubmitSection';
const regions = [
{
  key: 'Asia' as const,
  label: 'Asia',
  icon: Globe
},
{
  key: 'America' as const,
  label: 'America',
  icon: Globe
},
{
  key: 'Europe' as const,
  label: 'Europe',
  icon: Globe
}];

export default function App() {
  const [enrichedServers, setEnrichedServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServers() {
      try {
        const enriched = await Promise.all(servers.map(enrichServerData));
        setEnrichedServers(enriched);
      } catch (error) {
        console.error('Failed to fetch servers:', error);
        setEnrichedServers(servers);
      } finally {
        setLoading(false);
      }
    }
    fetchServers();
  }, []);

  const calculateActivityScore = (memberCount?: number, onlineCount?: number): number => {
    if (!memberCount || memberCount === 0) return 0;
    const onlineMembers = onlineCount ?? 0;
    const activityRatio = onlineMembers / memberCount;
    const sizeWeight = Math.log10(memberCount);
    return activityRatio * sizeWeight * 100;
  };

  const displayServers = loading ? servers : enrichedServers;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-200 selection:bg-orange-500/30 selection:text-orange-200 font-sans overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      {/* Hero background image */}
      <div className="absolute top-0 left-0 w-full h-150 z-0 pointer-events-none overflow-hidden">
        <img
          src="images/Bridgewatch.jpeg"
          alt=""
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f]/40 via-[#0a0a0f]/70 to-[#0a0a0f]" />
      </div>

      {/* Header */}
      <header className="z-10 border-b border-white/5 bg-black/20 backdrop-blur-md top-0">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, .5))' }}>
              <img src="images/BWIcon.png" alt="Bridgewatch" className="h-9 w-9" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Bridge<span className="text-orange-500">watch</span>
            </span>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:block">
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            
            Rally Under the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Bridgewatch
            </span>{' '}
            Banner
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="text-base text-neutral-400 leading-relaxed">
            
            Unite with Bridgewatch loyalists across the realm. Find your Discord
            server and stand with your faction in Albion.
          </motion.p>
        </div>

        {/* Servers by Region */}
        {regions.map((region, regionIndex) => {
          const regionServers = displayServers
            .filter((s) => s.region === region.key)
            .sort((a, b) => 
              calculateActivityScore(b.memberCount, b.onlineCount) - 
              calculateActivityScore(a.memberCount, a.onlineCount)
            );
          if (regionServers.length === 0) return null;
          return (
            <motion.section
              key={region.key}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.3 + regionIndex * 0.1
              }}
              className="mb-12">
              
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
                    opacity: 0
                  },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {regionServers.map((server) =>
                <ServerCard key={server.inviteLink} server={server} />
                )}
              </motion.div>
            </motion.section>);

        })}

        {/* Submit & Requirements */}
        <SubmitSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20 mt-8">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-white">
              Bridge<span className="text-orange-500">watch</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            © 2026 Coral Reef Studios. Not affiliated with Discord nor
            Sandbox Interactive.
          </p>
        </div>
      </footer>
    </div>
  );
}