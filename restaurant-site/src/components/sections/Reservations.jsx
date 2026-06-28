import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import SectionLabel from '../ui/SectionLabel'

/* ─── Costanti ───────────────────────────────────────────────────── */
const WA_NUMBER = '39335316854'

const ORARI = {
  Pranzo: ['12:30', '13:00', '13:30', '14:00'],
  Cena:   ['19:30', '20:00', '20:30', '21:00', '21:30'],
}

const INITIAL_FORM = {
  nome: '', email: '', telefono: '', data: '', orario: '', coperti: '', note: '',
}

/* ─── Validatori ─────────────────────────────────────────────────── */
const VALIDATORS = {
  nome:     (v) => v.trim().length >= 2 ? null : 'Inserisci nome e cognome',
  email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Indirizzo email non valido',
  telefono: (v) => !v.trim() || /^[\+]?[\d\s\-\(\)]{7,16}$/.test(v.trim()) ? null : 'Numero non valido',
  data: (v) => {
    if (!v) return 'Seleziona una data'
    const sel = new Date(v), oggi = new Date()
    oggi.setHours(0, 0, 0, 0)
    return sel >= oggi ? null : 'La data deve essere oggi o nel futuro'
  },
  orario:   (v) => v ? null : 'Seleziona un orario',
  coperti:  (v) => v && Number(v) >= 1 ? null : 'Seleziona il numero di coperti',
}

/* ─── Helper: URL WhatsApp con messaggio precompilato ────────────── */
function buildWaUrl(form) {
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  const dataStr = form.data
    ? new Date(form.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' })
    : null

  const lines = [
    'Ciao! Vorrei prenotare un tavolo al ristorante Sobrio al Pigneto 🍽️',
    form.nome     && `• Nome: ${form.nome}`,
    dataStr       && `• Data: ${dataStr}`,
    form.orario   && `• Orario: ${form.orario}`,
    form.coperti  && `• Coperti: ${form.coperti}`,
    form.telefono && `• Telefono: ${form.telefono}`,
    form.note     && `• Note: ${form.note}`,
  ].filter(Boolean)

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

/* ─── Componente Field ───────────────────────────────────────────── */
function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] tracking-[0.24em] uppercase font-sans"
        style={{ color: error ? 'rgba(232,168,100,0.9)' : '#B8963E' }}
      >
        {label}{required && <span aria-hidden> *</span>}
      </label>

      {children}

      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            className="text-[11px] font-sans font-light"
            style={{ color: 'rgba(232,168,100,0.85)' }}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Sezione Prenotazioni ───────────────────────────────────────── */
export default function Reservations() {
  const [form, setForm]     = useState(INITIAL_FORM)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  /* data minima = oggi */
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], [])

  /* validazione reattiva solo sui campi toccati */
  const errors = useMemo(
    () => Object.fromEntries(
      Object.entries(VALIDATORS).map(([k, fn]) => [k, touched[k] ? fn(form[k]) : null])
    ),
    [form, touched]
  )
  const hasAnyError = Object.values(errors).some(Boolean)

  /* onChange / onBlur */
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const touch = (field) => () => setTouched(t => ({ ...t, [field]: true }))

  /* stile comune degli input */
  const inputStyle = (field) => ({
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${errors[field] ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}`,
    padding: '10px 0',
    fontSize: '14px',
    fontWeight: 300,
    color: '#F5F0E8',
    width: '100%',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.3s',
  })

  /* submit → POST Netlify Function */
  const handleSubmit = async () => {
    // Segna tutti come toccati per far apparire eventuali errori
    setTouched(Object.fromEntries(Object.keys(VALIDATORS).map(k => [k, true])))

    // Valida tutto
    const allErrors = Object.fromEntries(
      Object.entries(VALIDATORS).map(([k, fn]) => [k, fn(form[k])])
    )
    if (Object.values(allErrors).some(Boolean)) return

    setStatus('loading')
    try {
      const res = await fetch('/.netlify/functions/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(res.status)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const waUrl = buildWaUrl(form)

  /* ── Render: Success ─────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <section id="prenotazioni" className="py-28 md:py-40 px-6" style={{ backgroundColor: '#2C4A35' }}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ border: '1px solid #B8963E' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#B8963E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <p
              className="text-4xl italic font-light mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8' }}
            >
              Richiesta inviata
            </p>
            <p className="text-sm font-light mb-10" style={{ color: 'rgba(245,240,232,0.6)' }}>
              Vi risponderemo entro 24 ore per confermare la disponibilità.
            </p>
            <motion.button
              onClick={() => { setStatus('idle'); setForm(INITIAL_FORM); setTouched({}) }}
              className="text-xs tracking-[0.22em] uppercase font-sans font-medium px-6 py-3 border transition-colors duration-300"
              style={{ borderColor: 'rgba(245,240,232,0.3)', color: 'rgba(245,240,232,0.6)' }}
              whileHover={{ borderColor: '#B8963E', color: '#B8963E' }}
            >
              Nuova prenotazione
            </motion.button>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ── Render: Form ────────────────────────────────────────────── */
  return (
    <section id="prenotazioni" className="py-28 md:py-40 px-6" style={{ backgroundColor: '#2C4A35' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

        {/* ── Colonna sinistra ─────────────────────────────────── */}
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
            <p className="text-sm font-light leading-[1.9] mb-10" style={{ color: 'rgba(245,240,232,0.60)' }}>
              Per gruppi oltre 8 persone o eventi privati, contattateci
              direttamente. Risponderemo entro 24 ore per confermare la disponibilità.
            </p>
          </ScrollReveal>

          {/* Contatti */}
          <ScrollReveal delay={0.25}>
            <div className="space-y-7 mb-12">
              {[
                { label: 'Telefono', value: '+39 335 316854', href: 'tel:+39335316854' },
                { label: 'Email',    value: 'info@sobrio-alpigneto.it', href: 'mailto:info@sobrio-alpigneto.it' },
                { label: 'Dove',     value: 'Via del Pigneto, 12 — Roma', href: null },
              ].map(({ label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-px h-10 mt-0.5 shrink-0" style={{ backgroundColor: '#B8963E' }} />
                  <div>
                    <p className="text-[10px] tracking-[0.24em] uppercase mb-1 font-sans" style={{ color: '#B8963E' }}>
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="text-sm font-light transition-colors duration-300"
                        style={{ color: 'rgba(245,240,232,0.7)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.7)'}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.7)' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* WhatsApp CTA */}
          <ScrollReveal delay={0.3}>
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 text-xs tracking-[0.2em] uppercase font-sans font-medium border transition-colors duration-300"
              style={{ borderColor: 'rgba(245,240,232,0.25)', color: '#F5F0E8' }}
              whileHover={{ borderColor: '#25D366', color: '#25D366' }}
              transition={{ duration: 0.2 }}
            >
              {/* WhatsApp icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Prenota su WhatsApp
            </motion.a>
            <p className="mt-3 text-[11px] font-sans font-light italic" style={{ color: 'rgba(245,240,232,0.3)' }}>
              Il messaggio si precompila con i dati del form.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Colonna destra — Form ─────────────────────────────── */}
        <ScrollReveal delay={0.1}>

          {/* Banner errore submit */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                className="mb-8 p-4 flex items-start gap-3"
                style={{ backgroundColor: 'rgba(232,168,100,0.1)', border: '1px solid rgba(232,168,100,0.3)' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(232,168,100,0.9)" strokeWidth="1.5" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p className="text-xs font-sans font-medium mb-1" style={{ color: 'rgba(232,168,100,0.9)' }}>
                    Invio non riuscito
                  </p>
                  <p className="text-xs font-sans font-light" style={{ color: 'rgba(245,240,232,0.55)' }}>
                    Si è verificato un errore. Prova a{' '}
                    <a href={waUrl} target="_blank" rel="noopener noreferrer"
                      className="underline underline-offset-2" style={{ color: 'rgba(232,168,100,0.8)' }}>
                      prenotare via WhatsApp
                    </a>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form fields — div-based, no <form> nativo */}
          <div className="space-y-8">

            {/* Nome */}
            <Field label="Nome e Cognome" error={errors.nome} required>
              <input
                type="text"
                value={form.nome}
                onChange={set('nome')}
                onBlur={touch('nome')}
                placeholder="Mario Rossi"
                autoComplete="name"
                style={inputStyle('nome')}
                onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                onBlurCapture={e => e.target.style.borderBottomColor = errors.nome
                  ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
              />
            </Field>

            {/* Email + Telefono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label="Email" error={errors.email} required>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  onBlur={touch('email')}
                  placeholder="mario@esempio.it"
                  autoComplete="email"
                  style={inputStyle('email')}
                  onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                  onBlurCapture={e => e.target.style.borderBottomColor = errors.email
                    ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
                />
              </Field>
              <Field label="Telefono" error={errors.telefono}>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={set('telefono')}
                  onBlur={touch('telefono')}
                  placeholder="+39 335 316854"
                  autoComplete="tel"
                  style={inputStyle('telefono')}
                  onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                  onBlurCapture={e => e.target.style.borderBottomColor = errors.telefono
                    ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
                />
              </Field>
            </div>

            {/* Data + Orario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label="Data" error={errors.data} required>
                <input
                  type="date"
                  value={form.data}
                  onChange={set('data')}
                  onBlur={touch('data')}
                  min={todayISO}
                  style={{ ...inputStyle('data'), colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                  onBlurCapture={e => e.target.style.borderBottomColor = errors.data
                    ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
                />
              </Field>
              <Field label="Orario" error={errors.orario} required>
                <select
                  value={form.orario}
                  onChange={set('orario')}
                  onBlur={touch('orario')}
                  style={{ ...inputStyle('orario'), cursor: 'pointer', colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                  onBlurCapture={e => e.target.style.borderBottomColor = errors.orario
                    ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
                >
                  <option value="" disabled style={{ backgroundColor: '#2C4A35' }}>Seleziona</option>
                  {Object.entries(ORARI).map(([gruppo, ore]) => (
                    <optgroup key={gruppo} label={gruppo} style={{ backgroundColor: '#1A1A18' }}>
                      {ore.map(o => (
                        <option key={o} value={o} style={{ backgroundColor: '#2C4A35' }}>{o}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
            </div>

            {/* Numero coperti */}
            <Field label="Numero coperti" error={errors.coperti} required>
              <select
                value={form.coperti}
                onChange={set('coperti')}
                onBlur={touch('coperti')}
                style={{ ...inputStyle('coperti'), cursor: 'pointer', colorScheme: 'dark', maxWidth: '200px' }}
                onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                onBlurCapture={e => e.target.style.borderBottomColor = errors.coperti
                  ? 'rgba(232,168,100,0.5)' : 'rgba(245,240,232,0.18)'}
              >
                <option value="" disabled style={{ backgroundColor: '#2C4A35' }}>Seleziona</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n} style={{ backgroundColor: '#2C4A35' }}>
                    {n} {n === 1 ? 'coperto' : 'coperti'}
                  </option>
                ))}
                <option value="11+" style={{ backgroundColor: '#2C4A35' }}>Più di 10 — ci scrivete</option>
              </select>
            </Field>

            {/* Note */}
            <Field label="Note (allergie, occasioni speciali…)" error={null}>
              <textarea
                value={form.note}
                onChange={set('note')}
                rows={3}
                placeholder="Eventuali richieste particolari"
                style={{ ...inputStyle('note'), resize: 'none', lineHeight: '1.7' }}
                onFocus={e => e.target.style.borderBottomColor = '#B8963E'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(245,240,232,0.18)'}
              />
            </Field>

            {/* Submit */}
            <div className="pt-2 space-y-5">
              <motion.button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-3 py-4
                           text-xs tracking-[0.22em] uppercase font-sans font-medium
                           border transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ borderColor: '#B8963E', color: '#B8963E' }}
                whileHover={status !== 'loading' ? { backgroundColor: '#B8963E', color: '#F5F0E8' } : {}}
                transition={{ duration: 0.22 }}
              >
                {status === 'loading' ? (
                  <>
                    <motion.span
                      className="block w-4 h-4 rounded-full border border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Invio in corso…
                  </>
                ) : (
                  'Invia richiesta'
                )}
              </motion.button>

              {hasAnyError && (
                <p className="text-[11px] text-center font-sans font-light" style={{ color: 'rgba(232,168,100,0.7)' }}>
                  Correggi i campi evidenziati prima di procedere.
                </p>
              )}

              <p className="text-[11px] text-center font-sans font-light" style={{ color: 'rgba(245,240,232,0.28)' }}>
                I dati saranno trattati nel rispetto del GDPR ed utilizzati
                esclusivamente per la gestione della prenotazione.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
