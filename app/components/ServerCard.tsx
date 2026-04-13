import React from 'react';
import { motion } from 'framer-motion';
import { Users, Radio, ExternalLink } from 'lucide-react';
import { ServerData } from '../data/servers';
interface ServerCardProps {
  server: ServerData;
}
const formatNumber = (num: number) => {
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
};
export function ServerCard({ server }: ServerCardProps) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }}
      whileHover={{
        y: -4,
        scale: 1.02
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl transition-shadow duration-200 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)]">
      
      <div className="absolute -inset-px bg-linear-to-b from-orange-500/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 mb-2">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${server.iconColor ?? 'bg-gray-500'} shadow-lg shrink-0 overflow-hidden`}>
          
          {server.iconUrl ? (
            <img src={server.iconUrl} alt={server.name ?? 'Server'} className="w-full h-full object-cover" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          )}
        </div>
        {server.name ? (
          <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors truncate">
            {server.name}
          </h3>
        ) : (
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-5 w-32 rounded bg-white/10"
          />
        )}
      </div>

      {server.name ? (
        <p className="relative z-10 text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2 min-h-10">
          {server.description}
        </p>
      ) : (
        <div className="relative z-10 flex flex-col gap-2 mb-3 min-h-10 justify-center">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-3 w-full rounded bg-white/10"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            className="h-3 w-3/4 rounded bg-white/10"
          />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 mb-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>
            {server.memberCount !== undefined ? (
              `${formatNumber(server.memberCount)} Members`
            ) : (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                —— Members
              </motion.span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-green-500" />
          <span>
            {server.onlineCount !== undefined ? (
              `${formatNumber(server.onlineCount)} Online`
            ) : (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                —— Online
              </motion.span>
            )}
          </span>
        </div>
      </div>

      <button 
        onClick={() => window.open(server.inviteLink, '_blank')}
        className="cursor-pointer relative z-10 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2 text-sm font-semibold text-orange-500 transition-all hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]">
        Join Server
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </motion.div>);

}