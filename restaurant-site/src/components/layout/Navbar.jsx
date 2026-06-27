import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'La Cucina', href: '#filosofia' },
  { label: 'Menu', href: '#menu' },
  { label: 'Galleria', href: '#galleria' },
  { label: 'Contatti', href: '#contatti' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(245,240,232,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(184,150,62,0.15)' : '1px solid transparent',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#hero" className="flex flex-col leading-none select-none">
            <span
              className="text-2xl md:text-3xl tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: scrolled ? '#2C4A35' : '#F5F0E8', fontStyle: 'italic', fontWeight: 400 }}
            >
              Radici
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase mt-0.5"
              style={{ color: scrolled ? '#B8963E' : 'rgba(245,240,232,0.7)', fontFamily: 'Inter, sans-serif' }}
            >
              Ristorante
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="text-xs tracking-[0.2em] uppercase font-sans font-medium transition-colors duration-300"
                style={{ color: scrolled ? '#4A4A46' : 'rgba(245,240,232,0.85)' }}
                whileHover={{ color: '#B8963E' }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#prenotazioni"
              className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium border transition-colors duration-300"
              style={{ borderColor: '#B8963E', color: '#B8963E' }}
              whileHover={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
              transition={{ duration: 0.2 }}
            >
              Prenota
            </motion.a>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-px w-6"
                style={{ backgroundColor: scrolled ? '#2C4A35' : '#F5F0E8' }}
                animate={
                  open
                    ? i === 0
                      ? { rotate: 45, y: 8 }
                      : i === 2
                      ? { rotate: -45, y: -8 }
                      : { opacity: 0 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{ backgroundColor: '#2C4A35' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {[...links, { label: 'Prenota', href: '#prenotazioni' }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="text-2xl tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontStyle: 'italic' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
