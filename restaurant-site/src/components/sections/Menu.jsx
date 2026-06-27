import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'
import { ButtonPrimary } from '../ui/Button'

const categories = ['Antipasti', 'Primi', 'Secondi', 'Dessert']

const dishes = {
  Antipasti: [
    { name: 'Vitello tonnato reinterpretato', desc: 'Fettine di vitello rosa, crema di tonno affumicato, capperi di Pantelleria, germogli', price: '18' },
    { name: 'Burrata di Andria e pomodori arrosto', desc: 'Burrata fresca, confit di datterini, origano selvatico, olio EVO del Garda', price: '16' },
    { name: 'Crudo di mare del giorno', desc: 'Selezione di crudità secondo mercato, emulsione agli agrumi, fiori eduli', price: '24' },
  ],
  Primi: [
    { name: 'Risotto al Parmigiano Reggiano 36 mesi', desc: 'Riso Carnaroli, brodo di gallina, Parmigiano mantecato, oro in polvere', price: '22' },
    { name: 'Tagliolini al tartufo nero', desc: 'Pasta all\'uovo fresca, crema di burro, tartufo nero di Norcia, nocciole tostate', price: '28' },
    { name: 'Minestra di legumi del podere', desc: 'Fagioli borlotti, cicerchie, lenticchie di Castelluccio, pane di segale croccante', price: '17' },
  ],
  Secondi: [
    { name: 'Piccione alle erbe del Ticino', desc: 'Piccione frollato, petto rosa, coscia brasata, salsa ai mirtilli, topinambur', price: '36' },
    { name: 'Branzino in crosta di sale', desc: 'Branzino selvatico, sale integrale alle erbe, emulsione al limone Meyer, spinaci saltati', price: '32' },
    { name: 'Costata di Angus maturata 45 giorni', desc: 'Taglio dry-aged, burro alle erbe, patate schiacciate, riduzione al Barolo', price: '42' },
  ],
  Dessert: [
    { name: 'Pannacotta alla vaniglia Bourbon', desc: 'Panna di alta qualità, bacca di vaniglia, coulis di lamponi selvatici', price: '12' },
    { name: 'Soufflé al cioccolato fondente 72%', desc: 'Soufflé caldo, gelato alla fior di sale, granella di cacao tostato', price: '14' },
    { name: 'Millefoglie della tradizione', desc: 'Pasta sfoglia burrosa, crema diplomatica, fragole di bosco, zucchero a velo', price: '13' },
  ],
}

export default function Menu() {
  const [active, setActive] = useState('Antipasti')

  return (
    <section id="menu" className="py-28 md:py-40 px-6" style={{ backgroundColor: '#EDE7D9' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <ScrollReveal>
            <SectionLabel>Carta</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="text-[clamp(2.4rem,5vw,4rem)] font-light italic mt-4 mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
            >
              Un menu che cambia con le stagioni
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-sm font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#4A4A46' }}>
              La nostra proposta settimanale rispecchia ciò che il mercato offre di meglio.
              Di seguito una selezione rappresentativa delle portate più richieste.
            </p>
          </ScrollReveal>
        </div>

        {/* Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center gap-1 mb-14 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="relative px-6 py-2 text-xs tracking-[0.2em] uppercase font-sans font-medium transition-colors duration-300"
                style={{ color: active === cat ? '#F5F0E8' : '#4A4A46' }}
              >
                {active === cat && (
                  <motion.span
                    layoutId="tab-bg"
                    className="absolute inset-0"
                    style={{ backgroundColor: '#2C4A35' }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Dishes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ backgroundColor: 'rgba(44,74,53,0.12)' }}
          >
            {dishes[active].map((dish) => (
              <div
                key={dish.name}
                className="p-8 group transition-colors duration-300"
                style={{ backgroundColor: '#EDE7D9' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F0E8'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EDE7D9'}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className="text-xl italic font-light leading-snug flex-1 pr-4 transition-colors duration-300 group-hover:text-[#2C4A35]"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A18' }}
                  >
                    {dish.name}
                  </h3>
                  <span className="text-sm font-sans font-light shrink-0 pt-1" style={{ color: '#B8963E' }}>
                    € {dish.price}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-light" style={{ color: '#4A4A46' }}>
                  {dish.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <ScrollReveal delay={0.2}>
          <div className="mt-12 text-center">
            <ButtonPrimary href="#prenotazioni">Prenota per vivere il menu</ButtonPrimary>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
