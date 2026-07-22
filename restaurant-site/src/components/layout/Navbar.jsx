import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'La cucina', href: '#filosofia' },
  { label: 'Menù', href: '#menu' },
  { label: 'Galleria', href: '#galleria' },
  { label: 'Contatti', href: '#contatti' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* blocca scroll body quando mobile menu è aperto */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  /* colori che cambiano con lo scroll */
  const logoColor  = scrolled ? '#2C4A35' : '#F5F0E8'
  const labelColor = scrolled ? '#B8963E' : 'rgba(245,240,232,0.55)'
  const linkColor  = scrolled ? '#4A4A46' : 'rgba(245,240,232,0.80)'

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          backgroundColor: scrolled ? 'rgba(245,240,232,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(184,150,62,0.18)'
            : '1px solid transparent',
          transition: 'background-color 0.45s ease, border-color 0.45s ease',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20
                        flex items-center justify-between">

          {/* Logo */}
          <a href="#hero" className="flex flex-col select-none" onClick={close}>
            <span
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                color: logoColor,
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                lineHeight: 1,
                transition: 'color 0.4s ease',
                letterSpacing: '0.01em',
              }}
            >
              Sobrio al Pigneto
            </span>
            <span
              style={{
                color: labelColor,
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '3px',
                transition: 'color 0.4s ease',
              }}
            >
              Ristorante &middot; Roma
            </span>
          </a>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium"
                style={{ color: linkColor, transition: 'color 0.3s ease' }}
                whileHover={{ color: '#B8963E' }}
              >
                {l.label}
              </motion.a>
            ))}

            {/* CTA prenota */}
            <motion.a
              href="#prenotazioni"
              className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium
                         px-5 py-2.5 border"
              style={{ borderColor: '#B8963E', color: '#B8963E' }}
              whileHover={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
              transition={{ duration: 0.2 }}
            >
              Prenota
            </motion.a>
          </nav>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-px w-[22px]"
                style={{
                  backgroundColor: open ? '#F5F0E8' : (scrolled ? '#2C4A35' : '#F5F0E8'),
                }}
                animate={
                  open
                    ? i === 0 ? { rotate: 45,  y: 7 }
                    : i === 2 ? { rotate: -45, y: -7 }
                    : { opacity: 0, scaleX: 0 }
                    : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.28 }}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{ backgroundColor: '#1A1A18' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Linea oro decorativa */}
            <div
              className="absolute left-6 top-1/4"
              style={{ width: '1px', height: '80px', backgroundColor: '#B8963E', opacity: 0.5 }}
            />

            <nav className="flex flex-col items-center gap-9">
              {[...NAV_LINKS, { label: 'Prenota', href: '#prenotazioni' }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="text-[2rem] font-light italic"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    color: i === NAV_LINKS.length ? '#B8963E' : '#F5F0E8',
                  }}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.45 }}
                  onClick={close}
                  whileHover={{ color: '#B8963E', x: 6 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <motion.p
              className="absolute bottom-10 text-[9px] tracking-[0.3em] uppercase font-sans"
              style={{ color: 'rgba(245,240,232,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Roma &middot; Pigneto
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
