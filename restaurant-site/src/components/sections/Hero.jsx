import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* ─── animation variants ─────────────────────────────────────────── */
const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
})

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
})

/* ─── scroll-to helper ───────────────────────────────────────────── */
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      aria-label="Hero Sobrio al Pigneto"
    >

      {/* ── BACKGROUND ─────────────────────────────────────────────── */}

      {/* Fallback gradient (visibile se video non carica) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(155deg, #1A1A18 0%, #2C4A35 45%, #1A1A18 100%)',
        }}
      />

      {/* Video in loop — muto, senza controlli, camera ferma */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          /* poster = fallback statico mostrato prima del play e se JS è off */
          poster="/img/hero-poster.jpg"
          onError={() => setVideoFailed(true)}
        >
          {/* Sostituire con i path reali dei file nella cartella public/ */}
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay scuro uniforme per leggibilità testo */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: 'rgba(18, 18, 16, 0.52)' }}
      />

      {/* Gradiente verticale: scuro in basso dove vive il testo */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[70%]"
        style={{
          background:
            'linear-gradient(to top, rgba(18,18,16,0.90) 0%, rgba(18,18,16,0.30) 60%, transparent 100%)',
        }}
      />

      {/* Linea oro verticale — dettaglio editoriale */}
      <motion.div
        className="absolute left-6 md:left-20 z-20 w-px"
        style={{ backgroundColor: '#B8963E', top: '28%', height: '96px' }}
        initial={{ scaleY: 0, originY: '0%' }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.0, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden
      />

      {/* ── CONTENUTO ──────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-20 pb-20 md:pb-28">

        {/* Eyebrow */}
        <motion.p
          className="text-[10px] tracking-[0.38em] uppercase mb-7 font-sans font-medium"
          style={{ color: '#B8963E' }}
          {...fade(0.25)}
        >
          Roma &middot; Pigneto
        </motion.p>

        {/* Titolo — nome ristorante */}
        <div className="overflow-hidden mb-1">
          <motion.h1
            className="font-light leading-[0.88]"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              color: '#F5F0E8',
              fontSize: 'clamp(3.8rem, 10vw, 8.5rem)',
              fontStyle: 'italic',
            }}
            {...rise(0.45)}
          >
            Sobrio
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.p
            className="font-light leading-[1]"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              color: '#F5F0E8',
              fontSize: 'clamp(3.8rem, 10vw, 8.5rem)',
              fontWeight: 300,
              letterSpacing: '0.01em',
            }}
            {...rise(0.55)}
          >
            al Pigneto
          </motion.p>
        </div>

        {/* Separatore oro */}
        <motion.div
          className="mb-6 flex items-center gap-4"
          {...fade(0.75)}
        >
          <div className="h-px w-10" style={{ backgroundColor: '#B8963E' }} />
          <p
            className="text-sm md:text-base font-light tracking-wide italic"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(245,240,232,0.78)' }}
          >
            Cucina romana d&rsquo;autore
          </p>
        </motion.div>

        {/* Sottotitolo descrittivo */}
        <motion.p
          className="max-w-sm text-sm leading-[1.85] font-light mb-11"
          style={{ color: 'rgba(245,240,232,0.58)' }}
          {...fade(0.85)}
        >
          Ingredienti di mercato, tecnica rispettosa, nessuna sovrastruttura.
          Una tavola dove il territorio si riconosce in ogni piatto.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          {...fade(1.0)}
        >
          {/* Primaria — piena */}
          <motion.a
            href="#prenotazioni"
            className="inline-flex items-center justify-center px-9 py-4 text-xs tracking-[0.22em] uppercase font-sans font-medium"
            style={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
            whileHover={{ backgroundColor: '#D4AF6A' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Prenota un tavolo
          </motion.a>

          {/* Secondaria — ghost, scroll al menu */}
          <motion.button
            type="button"
            onClick={() => scrollTo('menu')}
            className="inline-flex items-center justify-center gap-3 px-9 py-4 text-xs tracking-[0.22em] uppercase font-sans font-medium border"
            style={{ borderColor: 'rgba(245,240,232,0.45)', color: 'rgba(245,240,232,0.85)' }}
            whileHover={{
              borderColor: 'rgba(245,240,232,0.9)',
              color: '#F5F0E8',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Vedi il men&ugrave;
            {/* freccia scroll */}
            <motion.span
              aria-hidden
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M7 2v10M3 8l4 4 4-4" />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR (angolo destro) ───────────────────────── */}
      <motion.div
        className="absolute bottom-10 right-8 md:right-16 z-20
                   flex flex-col items-center gap-3"
        {...fade(1.3)}
      >
        <span
          className="text-[9px] tracking-[0.32em] uppercase font-sans"
          style={{
            color: 'rgba(245,240,232,0.45)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.3em',
          }}
        >
          Scorri
        </span>
        <motion.div
          className="w-px"
          style={{ backgroundColor: '#B8963E', height: '40px' }}
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
