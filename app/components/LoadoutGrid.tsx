import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HardHat,
  Wind,
  Swords,
  Shirt,
  Shield,
  Apple,
  Footprints,
  FlaskConical,
  Rabbit,
  Zap,
  ShieldAlert,
  Crosshair,
  Flame,
  Info,
  Gauge,
} from 'lucide-react'
import { Build } from '../data/build'
import { Weapon } from '../data/weapon'
import { Item, Slot, Spell } from '../data/structures'

interface LoadoutGridProps {
  build?: Build
}

export function LoadoutGrid({ build }: LoadoutGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [hoveredSwap, setHoveredSwap] = useState<string | null>(null)
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null)
  const activeId = selectedSlot || selectedSwap || hoveredSlot || hoveredSwap

  const idItemMap = (() => {
    const m = new Map<string, Item>();
    build?.getAllItems().forEach((i) => {
      if (i && i.identifier) m.set(i.identifier, i);
    });
    return m;
  })();

  function getActiveItem(): Item | undefined {
    if (!activeId) return undefined;
    return idItemMap.get(activeId) ?? undefined;
  }

  const activeItem = getActiveItem();
  const handleSlotClick = (id: string) => {
    setSelectedSwap(null)
    setSelectedSlot(selectedSlot === id ? null : id)
  }
  const handleSwapClick = (id: string) => {
    setSelectedSlot(null)
    setSelectedSwap(selectedSwap === id ? null : id)
  }
  // Spell tooltip state
  const [hoveredSpell, setHoveredSpell] = useState<Spell | null>(null)
  const [tipPos, setTipPos] = useState({
    x: 0,
    y: 0,
  })
  const tipRef = useRef<HTMLDivElement>(null)
  const positionTip = (clientX: number, clientY: number) => {
    const margin = 12
    const offset = 16
    const w = tipRef.current?.offsetWidth ?? 288
    const h = tipRef.current?.offsetHeight ?? 300
    let x = clientX + offset
    if (x + w + margin > window.innerWidth) {
      x = clientX - w - offset
    }
    x = Math.max(margin, Math.min(x, window.innerWidth - w - margin))
    let y = clientY - h / 2
    y = Math.max(margin, Math.min(y, window.innerHeight - h - margin))
    setTipPos({
      x,
      y,
    })
  }
  const handleSpellEnter = (spell: Spell, e: React.MouseEvent) => {
    setHoveredSpell(spell)
    positionTip(e.clientX, e.clientY)
  }
  const handleSpellMove = (e: React.MouseEvent) => {
    positionTip(e.clientX, e.clientY)
  }
  const handleSpellLeave = () => {
    setHoveredSpell(null)
  }
  // Helper for rendering slot buttons
  const renderSlot = (item?: Item) => {

    if (!item) {
      return (
        <button
          className={`relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl border transition-all duration-200 group bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20`}
        >
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-b-full transition-colors bg-neutral-600 group-hover:bg-neutral-400`}
          />
        </button>
      )
    }

    const id = item.identifier
    const isSelected = selectedSlot === id
    const isHovered = hoveredSlot === id && !selectedSlot
    const isActive = isSelected || isHovered
    return (
      <button
        key={id}
        onClick={() => handleSlotClick(id)}
        onMouseEnter={() => setHoveredSlot(id)}
        onMouseLeave={() => setHoveredSlot(null)}
        className={`relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl border transition-all duration-200 group ${isSelected ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
        aria-label={`Inspect ${id}`}
        aria-pressed={isSelected}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-b-full transition-colors ${isActive ? 'bg-orange-400' : 'bg-neutral-600 group-hover:bg-neutral-400'}`}
        />
          
        <img src={item.icon} className='w-10/12' />

        {isSelected && (
          <motion.div
            layoutId="selection-ring"
            className="absolute -inset-1 rounded-2xl border border-orange-500/50 pointer-events-none"
            initial={false}
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
            }}
          />
        )}
      </button>
    )
  }
  // Helper for rendering swap buttons
  const renderSwap = (item: Item) => {
    const id = item.identifier;
    const isSelected = selectedSwap === id
    const isHovered = hoveredSwap === id && selectedSwap === null
    const isActive = isSelected || isHovered
    return (
      <button
        key={id}
        onClick={() => handleSwapClick(id)}
        onMouseEnter={() => setHoveredSwap(id)}
        onMouseLeave={() => setHoveredSwap(null)}
        className={`relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200 group ${isSelected ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
        aria-label={`Inspect ${name}`}
        aria-pressed={isSelected}
      >
        
        <img src={item.icon} />

        {isSelected && (
          <motion.div
            layoutId="swap-selection-ring"
            className="absolute -inset-1 rounded-xl border border-orange-500/50 pointer-events-none"
            initial={false}
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
            }}
          />
        )}
      </button>
    )
  }
  // Helper for rendering spell list items
  const renderSpellItem = (
    spell: Spell,
  ) => (
    <li
      key={spell.id}
      className="flex items-center gap-3"
      onMouseEnter={(e) => handleSpellEnter(spell, e)}
      onMouseMove={handleSpellMove}
      onMouseLeave={handleSpellLeave}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center border shrink-0 ${spell.type === 'Active' ? 'bg-white/5 border-white/10 rounded-lg' : 'bg-transparent border-dashed border-neutral-600 rounded-full'}`}
      >
        <img src={spell.icon} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-neutral-200 truncate">
          {spell.name}
        </div>
      </div>
      <div
        className={`ml-auto flex h-6 min-w-6 items-center justify-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${spell.type === 'Passive' ? 'bg-white/5 text-neutral-400 border border-white/10' : 'bg-orange-500/15 text-orange-300 border border-orange-500/25'}`}
      >
        {spell.type === 'Passive' ? 'Passive' : spell.keybind}
      </div>
    </li>
  )
  // Helper for rendering persistent active spell buttons
  // Accepts only a Spell (or undefined) and renders a blank slot when missing
  const renderActiveSpellButton = (spell?: Spell) => {
    if (!spell) {
      return (
        <button
          key={Math.random().toString(36).slice(2)}
          className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-transparent"
          aria-hidden
        />
      )
    }

    return (
      <button
        key={spell.id}
        onMouseEnter={(e) => handleSpellEnter(spell, e)}
        onMouseMove={handleSpellMove}
        onMouseLeave={handleSpellLeave}
        className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-orange-500/15 hover:border-orange-500/40 transition-colors"
        aria-label={`${spell.name} (${spell.keybind})`}
      >
        <img src={spell.icon} />
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded bg-orange-500/20 px-1 text-[9px] font-bold text-orange-300 border border-orange-500/30">
          {spell.keybind}
        </span>
      </button>
    )
  }

  // Helper for rendering persistent passive spell buttons
  const renderPassiveSpellButton = (spell?: Spell) => {
    if (!spell) {
      return (
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-neutral-600 bg-transparent" aria-hidden />
      )
    }

    return (
      <button
        key={spell.id}
        onMouseEnter={(e) => handleSpellEnter(spell, e)}
        onMouseMove={handleSpellMove}
        onMouseLeave={handleSpellLeave}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-neutral-600 bg-transparent hover:border-orange-500/40 hover:bg-orange-500/10 transition-colors"
        aria-label={`${spell.name} (passive)`}
      >
        <img src={spell.icon} />
      </button>
    )
  }
  // Show a loader / skeleton when build data isn't available yet
  if (build === undefined) {
    return (
      <div className="relative z-30 mb-12">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl flex flex-col gap-4 items-center">
          <svg className="animate-spin h-8 w-8 text-orange-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <div className="text-sm font-medium text-neutral-300">Loading build…</div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="relative z-30 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-white">Loadout</h2>
          <div className="flex items-center gap-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1.5">
            <Gauge className="h-4 w-4 text-orange-400 shrink-0" />
            <span className="text-xs text-neutral-400">Base Average IP</span>
            <span className="text-base font-black text-orange-400 leading-none">
              {build.getBaseAverageIp()}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Equipment Grid */}
            <div className="shrink-0 flex justify-center md:justify-start">
              <div className="grid grid-cols-3 gap-3 w-fit h-fit place-items-start justify-items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 pointer-events-none relative" />
                {renderSlot(build.helmet)}
                {renderSlot(build.cape)}
                {renderSlot(build.weapon)}
                {renderSlot(build.armor)}
                {renderSlot(build.weapon?.isOneHanded() ? build.offhand : build.weapon)}
                {renderSlot(build.food)}
                {renderSlot(build.boots)}
                {renderSlot(build.potion)}
              </div>
            </div>

            {/* Right: Details Panel */}
            <div className="flex-1 min-w-0 flex flex-col">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div
                    key={activeId}
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="flex flex-col h-full"
                  >
                    <DetailsPanel
                      tier={activeItem.tier + "." + activeItem.enchantment}
                      id={activeId!}
                      name={activeItem.name}
                      ip={activeItem.item_power}
                      twoHanded={activeItem instanceof Weapon ? !activeItem.isOneHanded() : undefined}
                      stats={activeItem.stats}
                      spells={
                        <>
                          {activeItem.getSpells().map((spell) =>
                            renderSpellItem(
                              spell
                            ),
                          )}
                        </>
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-white/5 rounded-xl bg-white/2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
                      <Info className="h-5 w-5 text-neutral-500" />
                    </div>
                    <p className="text-sm font-medium text-neutral-300 mb-1">
                      Inspect Loadout
                    </p>
                    <p className="text-xs text-neutral-500 max-w-50">
                      Hover over any item slot to view its stats. Click a slot
                      to pin it.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Swaps: full-width row spanning grid + details, icon-only, inspectable */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Swaps / Alternatives
            </h3>
            <div className="flex flex-wrap gap-2">
              {build.swaps.map((swap) => renderSwap(swap))}
            </div>
          </div>
        </div>

        {/* Persistent ability bars: actives (game order) + passives */}
        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
          <div className="mb-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Spells
            </h3>
            <div className="flex flex-wrap gap-2">
              {renderActiveSpellButton(
                build.weapon?.getSpell(Slot.FIRST_SLOT, build.weapon?.firstSpell || 0)
              )}
              {renderActiveSpellButton(
                build.weapon?.getSpell(Slot.SECOND_SLOT, build.weapon?.secondSpell || 0)
              )}
              {renderActiveSpellButton(
                build.weapon?.getSpellsBySlot(Slot.THIRD_SLOT)?.[0]
              )}
              {renderActiveSpellButton(
                build.armor?.getSelectedActiveSpell()
              )}
              {renderActiveSpellButton(
                build.helmet?.getSelectedActiveSpell()
              )}
              {renderActiveSpellButton(
                build.boots?.getSelectedActiveSpell()
              )}
              {renderActiveSpellButton(
                build.potion?.getSpells()[0]
              )}
              {renderActiveSpellButton(
                build.food?.getSpells()[0]
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Passives
            </h3>
            <div className="flex flex-wrap gap-2">
              {renderPassiveSpellButton(
                build.weapon?.getSpell(Slot.PASSIVE, build.weapon?.passive || 0)
              )}
              {renderPassiveSpellButton(
                build.armor?.getSelectedPassiveSpell()
              )}
              {renderPassiveSpellButton(
                build.helmet?.getSelectedPassiveSpell()
              )}
              {renderPassiveSpellButton(
                build.boots?.getSelectedPassiveSpell()
              )}
              {renderPassiveSpellButton(
                build.cape?.getSpells()[0]
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spell tooltip (portaled to body, clamped to viewport) */}
      {hoveredSpell &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              left: tipPos.x,
              top: tipPos.y,
              zIndex: 9999,
            }}
            className="pointer-events-none w-72 max-w-[18rem]"
          >
            <div className="overflow-hidden rounded-xl bg-[#15151c] border border-white/10 shadow-2xl">
              <SpellTooltipContent spell={hoveredSpell} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
// --- Helper Components for Layout Boilerplate ---
function DetailsPanel({
  tier,
  id,
  name,
  ip,
  twoHanded,
  stats,
  spells,
}: {
  tier: string
  id: string
  name: string
  ip: number
  twoHanded?: boolean
  stats: {
    name: string
    value: string | number
  }[]
  spells?: React.ReactNode
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
              Tier {tier}
            </span>
            <span className="text-xs text-neutral-400 capitalize">
              {id}
              {twoHanded ? ' · 2H' : ''}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
            Base Item Power
          </div>
          <div className="text-2xl font-black text-orange-400">{ip}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {spells && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-neutral-400" />
              Spells &amp; Passives
            </h4>
            <ul className="space-y-3">{spells}</ul>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-neutral-400" />
            Stats
          </h4>
          <ul className="space-y-2">
            {stats.map((detail, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{detail.name}</span>
                <span className="font-medium text-neutral-200">
                  {detail.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
function SpellTooltipContent({
  spell
}: {
  spell: Spell
}) {
  return (
    <>
      {spell.preview && (
        <div className="aspect-video w-full bg-black/40 overflow-hidden">
          <img
            src={spell.preview}
            alt={`${name} preview`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h5 className="text-sm font-bold text-white leading-tight">{spell.name}</h5>
          <span
            className={`shrink-0 flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wider ${spell.type === 'Passive' ? 'bg-white/5 text-neutral-400 border border-white/10' : 'bg-orange-500/15 text-orange-300 border border-orange-500/25'}`}
          >
            {spell.type === 'Passive' ? 'Passive' : spell.keybind}
          </span>
        </div>
        {spell.type === 'Active' && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3 pb-3 border-b border-white/10">
            {spell.attributes.map(attr => <SpellAttr label={attr.name} value={attr.value} key={attr.name} />)}
          </div>
        )}
        <div
          className="text-xs leading-relaxed text-neutral-300 [&_b]:text-orange-300 [&_b]:font-semibold"
          dangerouslySetInnerHTML={{
            __html: spell.description_html,
          }}
        />
      </div>
    </>
  )
}
function SpellAttr({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <span className="text-xs font-medium text-neutral-200">{value}</span>
    </div>
  )
}
