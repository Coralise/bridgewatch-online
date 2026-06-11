'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Shield, User } from 'lucide-react';
import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { signIn } from 'next-auth/react';

// 1. Define your props so the Server Layout can pass down the session data
interface HeaderProps {
  session: Session | null; // You can type this properly using your Session type from auth
  onSignOut: () => Promise<void>; // Pass the server action down as a prop
}

const navItems = [
  { to: '/', label: 'Servers', end: true },
  { to: '/builds', label: 'Builds' },
];

export function Header({ session, onSignOut }: HeaderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    function handleOpen() {
      setAuthModalOpen(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('open-auth-modal', handleOpen)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-auth-modal', handleOpen)
      }
    }
  }, [])

  return (
      <>
        <header className="z-20 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <div className="flex h-9 w-9 items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, .5))' }}>
                  <img src="/images/BWIcon.png" alt="Bridgewatch" className="h-9 w-9" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
                  Bridge<span className="text-orange-500">watch</span>
                </span>
              </Link>
              {/* Nav links */}
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.to || (!item.end && pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-orange-400 bg-orange-500/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/10">
                      <img src={session.user?.image ?? 'https://via.placeholder.com/150'} alt={session.user?.name ?? 'User'} className="h-6 w-6 rounded-full object-cover" />
                    </div>
                    <span className="text-neutral-300">
                      <span className="text-white font-bold">{session.user?.name}</span>
                    </span>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="cursor-pointer rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </header> 
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onDiscordLogin={() => signIn("discord")}
        />
      </>
  );
}
