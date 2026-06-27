import { motion } from 'framer-motion'
import { ButtonGhost } from '../ui/Button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Background gradient simulato (sostituire con img/video reali) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(160deg, #2C4A35 0%, #1A1A18 55%, #3D3020 100%)',
        }}
      />

      {/* Pattern texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F0E8' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient vignette bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-0"
        style={{ background: 'linear-gradient(to top, rgba(26,26,24,0.85) 0%, transparent 100%)' }}
      />

      {/* Decorative gold line */}
      <motion.div
        className="absolute top-1/3 left-6 md:left-20 w-px h-24 z-10"
        style={{ backgroundColor: '#B8963E' }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-20 pb-20 md:pb-28">
        <motion.p
          className="text-xs tracking-[0.35em] uppercase mb-6 font-sans"
          style={{ color: '#B8963E' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Milano · Dal 2018
        </motion.p>

        <motion.h1
          className="text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9] mb-8 font-light italic"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Radici<br />
          <span style={{ fontStyle: 'normal', fontWeight: 300, fontSize: '55%', letterSpacing: '0.05em' }}>
            nel gusto,
          </span>
          <br />
          <span style={{ fontStyle: 'normal', fontWeight: 300, fontSize: '55%', letterSpacing: '0.05em' }}>
            nel territorio.
          </span>
        </motion.h1>

        <motion.p
          className="max-w-md text-sm leading-relaxed mb-10 font-light"
          style={{ color: 'rgba(245,240,232,0.72)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
        >
          Una cucina stagionale che nasce dall'ascolto della terra, interpretata
          con tecnica e rispetto per le materie prime del nostro territorio.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <ButtonGhost href="#prenotazioni">Prenota un tavolo</ButtonGhost>
          <ButtonGhost href="#menu">Scopri il menu</ButtonGhost>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 md:right-20 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.4, duration: 0.7 }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 origin-center" style={{ color: '#F5F0E8' }}>
          Scorri
        </span>
        <motion.div
          className="w-px h-10"
          style={{ backgroundColor: '#B8963E' }}
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
