import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'

export default function Contact() {
  return (
    <section id="contatti" className="py-28 md:py-36 px-6" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <ScrollReveal>
            <SectionLabel>Dove siamo</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="text-[clamp(2.4rem,5vw,4rem)] font-light italic mt-4"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
            >
              Venite a trovarci.
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Map placeholder */}
          <ScrollReveal className="lg:col-span-3">
            <div
              className="w-full aspect-[4/3] relative overflow-hidden"
              style={{ backgroundColor: '#EDE7D9' }}
            >
              {/* Placeholder mappa – sostituire con embed Google Maps */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ color: '#4A4A46' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="#B8963E" strokeWidth="1" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p className="text-sm font-light tracking-wide">Via delle Querce 12, Milano</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-[0.2em] uppercase mt-2 transition-colors duration-300 hover:text-[#B8963E]"
                  style={{ color: '#4A4A46', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                >
                  Apri su Google Maps
                </a>
              </div>
              {/* Gold frame */}
              <div className="absolute inset-4 pointer-events-none"
                style={{ border: '1px solid rgba(184,150,62,0.2)' }} />
            </div>
          </ScrollReveal>

          {/* Info */}
          <div className="lg:col-span-2 space-y-10">
            <ScrollReveal delay={0.1}>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4 font-sans" style={{ color: '#B8963E' }}>
                  Indirizzo
                </p>
                <address className="not-italic text-sm font-light leading-relaxed" style={{ color: '#4A4A46' }}>
                  Via delle Querce, 12<br />
                  20121 Milano (MI)<br />
                  Zona Brera
                </address>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4 font-sans" style={{ color: '#B8963E' }}>
                  Orari di apertura
                </p>
                <table className="text-sm font-light w-full" style={{ color: '#4A4A46' }}>
                  <tbody className="[&_td]:py-1.5 [&_td:last-child]:text-right">
                    <tr><td>Mar – Ven</td><td>12:30–14:30 / 19:30–22:30</td></tr>
                    <tr><td>Sabato</td><td>19:30–23:00</td></tr>
                    <tr><td>Domenica</td><td>12:30–15:00</td></tr>
                    <tr style={{ color: '#B8963E' }}><td>Lunedì</td><td>Chiuso</td></tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4 font-sans" style={{ color: '#B8963E' }}>
                  Contatti diretti
                </p>
                <div className="text-sm font-light space-y-2" style={{ color: '#4A4A46' }}>
                  <p>
                    <a href="tel:+390212345678" className="hover:text-[#2C4A35] transition-colors">
                      +39 02 1234 5678
                    </a>
                  </p>
                  <p>
                    <a href="mailto:info@radici-ristorante.it" className="hover:text-[#2C4A35] transition-colors">
                      info@radici-ristorante.it
                    </a>
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="h-px w-full" style={{ backgroundColor: 'rgba(184,150,62,0.3)' }} />
              <div className="pt-8">
                <p className="text-xs tracking-[0.25em] uppercase mb-4 font-sans" style={{ color: '#B8963E' }}>
                  Come arrivare
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: '#4A4A46' }}>
                  MM2 Lanza (5 min a piedi) · MM1 Cairoli (8 min) ·
                  Parcheggio convenzionato in Via Pontaccio.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
