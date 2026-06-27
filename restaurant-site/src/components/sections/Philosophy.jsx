import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'

const pillars = [
  {
    num: '01',
    title: 'Stagionalità',
    body: 'Il menu cambia ogni settimana seguendo il ritmo naturale delle stagioni. Lavoriamo solo con ciò che la terra offre nel suo momento migliore.',
  },
  {
    num: '02',
    title: 'Km Zero',
    body: 'Ogni ingrediente proviene da produttori locali selezionati personalmente. Conosciamo i volti e le storie dietro ogni prodotto.',
  },
  {
    num: '03',
    title: 'Tecnica sobria',
    body: 'La cucina non sovrasta il prodotto, lo esalta. Cotture lente, fermentazioni naturali, equilibrio tra tradizione e creatività.',
  },
]

export default function Philosophy() {
  return (
    <section id="filosofia" className="py-28 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div>
            <ScrollReveal>
              <SectionLabel>La nostra filosofia</SectionLabel>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2
                className="text-[clamp(2.4rem,5vw,4rem)] font-light italic leading-[1.1] mt-5 mb-8"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
              >
                Cucina che
                <br />
                racconta un luogo.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-sm leading-[1.9] font-light" style={{ color: '#4A4A46' }}>
                Radici nasce dall'amore per il territorio lombardo e dall'ambizione di
                offrire un'esperienza gastronomica che va oltre il semplice pasto.
                Ogni portata è un invito a riconnettersi con la terra, con i sapori
                della memoria e con il lavoro di chi produce con cura.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-sm leading-[1.9] font-light mt-5" style={{ color: '#4A4A46' }}>
                Lo chef Marco Ferretti porta con sé anni di formazione nelle grandi cucine
                d'Europa, tradotti in un linguaggio personale fatto di rispetto, misura
                e profonda conoscenza della materia prima.
              </p>
            </ScrollReveal>

            {/* Gold divider */}
            <ScrollReveal delay={0.4}>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: '#B8963E' }} />
                <span className="text-xs tracking-[0.2em] uppercase font-sans" style={{ color: '#B8963E' }}>
                  Marco Ferretti, Chef
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column – pillars */}
          <div className="space-y-10">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.num} delay={0.15 * i}>
                <div className="flex gap-6 group">
                  <span
                    className="text-xs font-sans font-light pt-1 shrink-0 w-6"
                    style={{ color: '#B8963E' }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <h3
                      className="text-xl italic font-light mb-2 transition-colors duration-300 group-hover:text-[#2C4A35]"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed font-light" style={{ color: '#4A4A46' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
