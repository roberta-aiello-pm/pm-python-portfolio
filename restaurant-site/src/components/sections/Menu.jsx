import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'
import { ButtonPrimary } from '../ui/Button'
import menuData from '../../data/menu.json'

/* ─── Badge ──────────────────────────────────────────────────────── */
const BADGE_CONFIG = {
  veg:   { label: 'Vegetariano', color: '#3D6147', bg: 'rgba(44,74,53,0.10)' },
  vegan: { label: 'Vegano',      color: '#3D6147', bg: 'rgba(44,74,53,0.10)' },
  gf:    { label: 'Senza glutine', color: '#B8963E', bg: 'rgba(184,150,62,0.10)' },
}

function Badge({ type }) {
  const cfg = BADGE_CONFIG[type]
  if (!cfg) return null
  return (
    <span
      className="inline-block text-[9px] tracking-[0.18em] uppercase font-sans font-medium px-2 py-0.5"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.label}
    </span>
  )
}

/* ─── DishCard ───────────────────────────────────────────────────── */
const cardVariants = {
  hidden:   { opacity: 0, y: 28 },
  visible:  (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
  }),
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

function DishCard({ piatto, index }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      variants={cardVariants}
      custom={index}
      className="relative flex flex-col gap-4 p-7 md:p-8 transition-colors duration-400"
      style={{ backgroundColor: hovered ? '#F5F0E8' : '#EDE7D9' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: numero + prezzo */}
      <div className="flex items-start justify-between">
        <span
          className="text-xs font-sans font-light tabular-nums leading-none pt-1"
          style={{ color: '#B8963E' }}
        >
          {num}
        </span>
        <span
          className="text-base font-sans font-light tabular-nums"
          style={{ color: '#B8963E', fontVariantNumeric: 'lining-nums' }}
        >
          € {piatto.prezzo}
        </span>
      </div>

      {/* Nome + badge */}
      <div className="flex flex-wrap items-baseline gap-3">
        <h3
          className="text-[1.45rem] font-light italic leading-snug"
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            color: hovered ? '#2C4A35' : '#1A1A18',
            transition: 'color 0.35s ease',
          }}
        >
          {piatto.nome}
        </h3>
        {piatto.badge?.map((b) => <Badge key={b} type={b} />)}
      </div>

      {/* Descrizione */}
      <p
        className="text-[13px] leading-[1.8] font-light flex-1"
        style={{ color: '#4A4A46' }}
      >
        {piatto.descrizione}
      </p>

      {/* Allergeni */}
      {piatto.allergeni?.length > 0 && (
        <p
          className="text-[11px] font-sans font-light italic pt-1"
          style={{
            color: 'rgba(74,74,70,0.55)',
            borderTop: '1px solid rgba(184,150,62,0.15)',
            paddingTop: '12px',
          }}
        >
          Allergeni:&nbsp;{piatto.allergeni.join(' · ')}
        </p>
      )}

      {/* Linea oro al hover — bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ backgroundColor: '#B8963E' }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.article>
  )
}

/* ─── Tabs ───────────────────────────────────────────────────────── */
function CategoryTabs({ categorie, activeId, onChange }) {
  const tabsRef = useRef(null)

  return (
    <div
      ref={tabsRef}
      className="flex gap-0 overflow-x-auto scrollbar-none"
      style={{ borderBottom: '1px solid rgba(184,150,62,0.2)' }}
      role="tablist"
    >
      {categorie.map((cat) => {
        const isActive = cat.id === activeId
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className="relative shrink-0 px-6 md:px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-sans font-medium transition-colors duration-300"
            style={{ color: isActive ? '#1A1A18' : 'rgba(74,74,70,0.55)' }}
          >
            {cat.label}
            {/* Underline animato che scorre tra i tab */}
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: '#B8963E' }}
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Menu (sezione principale) ──────────────────────────────────── */
export default function Menu() {
  const { categorie, stagione, intro } = menuData
  const [activeId, setActiveId] = useState(categorie[0].id)
  const activeCategory = categorie.find((c) => c.id === activeId)

  return (
    <section
      id="menu"
      aria-label="Menu del ristorante"
      className="py-28 md:py-40 px-6"
      style={{ backgroundColor: '#EDE7D9' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-14 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">
          <div>
            <ScrollReveal>
              <SectionLabel>La carta</SectionLabel>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-[clamp(2.4rem,5vw,4rem)] font-light italic mt-4 leading-[1.05]"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1A1A18' }}
              >
                Cucina romana<br />d&rsquo;autore
              </h2>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 shrink-0" style={{ backgroundColor: '#B8963E' }} />
                <span className="text-[10px] tracking-[0.28em] uppercase font-sans" style={{ color: '#B8963E' }}>
                  {stagione}
                </span>
              </div>
              <p className="text-sm font-light leading-[1.85]" style={{ color: '#4A4A46' }}>
                {intro}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <CategoryTabs
            categorie={categorie}
            activeId={activeId}
            onChange={setActiveId}
          />
        </ScrollReveal>

        {/* Conta piatti della categoria attiva */}
        <ScrollReveal delay={0.05}>
          <div className="flex justify-end mt-3 mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans" style={{ color: 'rgba(74,74,70,0.45)' }}>
              {activeCategory.piatti.length} portate
            </span>
          </div>
        </ScrollReveal>

        {/* ── Griglia piatti ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ backgroundColor: 'rgba(184,150,62,0.15)' }}
          >
            {activeCategory.piatti.map((piatto, i) => (
              <DishCard key={piatto.nome} piatto={piatto} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Nota allergeni ────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <p
            className="mt-8 text-[11px] font-sans font-light italic leading-relaxed"
            style={{ color: 'rgba(74,74,70,0.5)' }}
          >
            I piatti con allergeni indicati possono contenere tracce. In caso di allergie o
            intolleranze severe, si prega di avvisare il personale prima di ordinare.
          </p>
        </ScrollReveal>

        {/* ── Legenda badge ─────────────────────────────────────── */}
        <ScrollReveal delay={0.12}>
          <div className="mt-5 flex flex-wrap gap-4">
            {Object.entries(BADGE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <Badge type={key} />
                <span className="text-[10px] font-sans font-light" style={{ color: 'rgba(74,74,70,0.55)' }}>
                  {cfg.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <ScrollReveal delay={0.15}>
          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ButtonPrimary href="#prenotazioni">Prenota il tuo tavolo</ButtonPrimary>
            <p className="text-xs font-light" style={{ color: 'rgba(74,74,70,0.6)' }}>
              Il menu cambia settimanalmente.<br />
              Disponibilità soggetta a stagionalità del mercato.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
