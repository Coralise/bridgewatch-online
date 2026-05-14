'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  {
    to: '/',
    label: 'Servers',
  },
  {
    to: '/builds',
    label: 'Builds',
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-md top-0">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, .5))' }}>
            <img src="images/BWIcon.png" alt="Bridgewatch" className="h-9 w-9" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Bridge<span className="text-orange-500">watch</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${pathname === item.to ? 'text-orange-400 bg-orange-500/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}