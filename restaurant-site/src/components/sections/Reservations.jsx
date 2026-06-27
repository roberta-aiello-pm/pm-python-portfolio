import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'

const inputCls = `
  w-full bg-transparent border-b border-[rgba(184,150,62,0.35)] py-3 px-0
  text-sm font-sans font-light text-[#1A1A18] placeholder-[#9A9A96]
  focus:outline-none focus:border-[#B8963E] transition-colors duration-300
`

export default function Reservations() {
  const [form, setForm] = useState({ nome: '', email: '', telefono: '', data: '', ospiti: '', note: '' })
  const [sent, setSent] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="prenotazioni" className="py-28 md:py-40 px-6" style={{ backgroundColor: '#2C4A35' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left */}
        <div>
          <ScrollReveal>
            <SectionLabel>Prenotazioni</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="text-[clamp(2.4rem,5vw,4rem)] font-light italic mt-5 mb-8 leading-[1.05]"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8' }}
            >
              Riservate
              <br />il vostro tavolo.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-10" style={{ color: 'rgba(245,240,232,0.65)' }}>
              Per prenotazioni di grandi gruppi o eventi privati vi invitiamo a
              contattarci direttamente. Vi risponderemo entro 24 ore per
              confermarne la disponibilità.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="space-y-6 text-sm font-light" style={{ color: 'rgba(245,240,232,0.7)' }}>
              <div className="flex items-start gap-4">
                <div className="w-px h-12 mt-1 shrink-0" style={{ backgroundColor: '#B8963E' }} />
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#B8963E' }}>Telefono</p>
                  <a href="tel:+390212345678" className="hover:text-[#F5F0E8] transition-colors">+39 02 1234 5678</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-px h-12 mt-1 shrink-0" style={{ backgroundColor: '#B8963E' }} />
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#B8963E' }}>Email</p>
                  <a href="mailto:info@radici-ristorante.it" className="hover:text-[#F5F0E8] transition-colors">info@radici-ristorante.it</a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right – form */}
        <ScrollReveal delay={0.15}>
          {sent ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ border: '1px solid #B8963E' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8963E" strokeWidth="1.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p
                className="text-2xl italic font-light mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8' }}
              >
                Richiesta inviata
              </p>
              <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.6)' }}>
                Vi contatteremo a breve per confermare la disponibilità.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                    Nome e Cognome
                  </label>
                  <input name="nome" required value={form.nome} onChange={handle}
                    placeholder="Mario Rossi" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                    Telefono
                  </label>
                  <input name="telefono" type="tel" value={form.telefono} onChange={handle}
                    placeholder="+39 333 0000000" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                  Email
                </label>
                <input name="email" required type="email" value={form.email} onChange={handle}
                  placeholder="mario@esempio.it" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                    Data preferita
                  </label>
                  <input name="data" required type="date" value={form.data} onChange={handle}
                    className={inputCls} style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                    Numero ospiti
                  </label>
                  <select name="ospiti" required value={form.ospiti} onChange={handle}
                    className={inputCls + ' cursor-pointer'}>
                    <option value="" disabled>Seleziona</option>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n} style={{ backgroundColor: '#2C4A35' }}>
                        {n} {n === 1 ? 'ospite' : 'ospiti'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-3 font-sans" style={{ color: '#B8963E' }}>
                  Note (allergie, occasioni speciali…)
                </label>
                <textarea name="note" value={form.note} onChange={handle} rows={3}
                  placeholder="Eventuali richieste particolari" className={inputCls + ' resize-none'} />
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 text-sm tracking-[0.2em] uppercase font-sans font-medium border transition-colors duration-300"
                style={{ borderColor: '#B8963E', color: '#B8963E' }}
                whileHover={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
                transition={{ duration: 0.22 }}
              >
                Invia richiesta
              </motion.button>

              <p className="text-xs text-center font-light" style={{ color: 'rgba(245,240,232,0.35)' }}>
                I dati forniti saranno trattati nel rispetto del GDPR e utilizzati
                esclusivamente per la gestione della prenotazione.
              </p>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
