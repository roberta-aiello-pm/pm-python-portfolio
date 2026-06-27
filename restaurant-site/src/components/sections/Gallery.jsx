import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'

// Palette-based placeholder colors che simulano foto food/ambiente
const placeholders = [
  { bg: '#2C4A35', label: 'Sala principale', aspect: 'aspect-[4/5]' },
  { bg: '#3D3020', label: 'Il nostro tartufo', aspect: 'aspect-square' },
  { bg: '#4A4A46', label: 'Chef al lavoro', aspect: 'aspect-square' },
  { bg: '#1A1A18', label: 'Cantina vini', aspect: 'aspect-[4/5]' },
  { bg: '#2C4A35', label: 'Risotto al Parmigiano', aspect: 'aspect-[3/2]' },
  { bg: '#3D3020', label: 'Dettaglio piatto', aspect: 'aspect-[3/2]' },
]

export default function Gallery() {
  return (
    <section id="galleria" className="py-28 md:py-40 px-6" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <ScrollReveal>
              <SectionLabel>Galleria</SectionLabel>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-[clamp(2.4rem,5vw,4rem)] font-light italic mt-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
              >
                Immagini che
                <br />raccontano Radici.
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2}>
            <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: '#4A4A46' }}>
              Sala, cucina, piatti. Un luogo pensato per chi ama mangiare bene
              in un ambiente dove ogni dettaglio è curato.
            </p>
          </ScrollReveal>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {placeholders.map((item, i) => (
            <ScrollReveal key={item.label} delay={0.08 * i}>
              <motion.div
                className={`${item.aspect} overflow-hidden relative group cursor-pointer`}
                whileHover="hover"
              >
                {/* Placeholder – sostituire con <img> reale */}
                <motion.div
                  className="absolute inset-0 transition-transform duration-700"
                  style={{ backgroundColor: item.bg }}
                  variants={{ hover: { scale: 1.04 } }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Grain texture */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Gold accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] w-0"
                  style={{ backgroundColor: '#B8963E' }}
                  variants={{ hover: { width: '100%' } }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Label */}
                <motion.div
                  className="absolute inset-0 flex items-end p-4 md:p-5"
                  style={{
                    background: 'linear-gradient(to top, rgba(26,26,24,0.6) 0%, transparent 60%)',
                  }}
                  initial={{ opacity: 0 }}
                  variants={{ hover: { opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-xs tracking-[0.2em] uppercase font-sans"
                    style={{ color: '#F5F0E8' }}
                  >
                    {item.label}
                  </p>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Gold separator */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 flex items-center gap-6">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(184,150,62,0.25)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-sans" style={{ color: '#B8963E' }}>
              Seguici su Instagram @radici.ristorante
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(184,150,62,0.25)' }} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
