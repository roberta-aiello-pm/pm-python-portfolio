import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WA_NUMBER = '39335316854'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Ciao! Vorrei contattarvi per una prenotazione o per avere maggiori informazioni.')}`

const GREETING = {
  role: 'assistant',
  content: 'Benvenuto da Sobrio al Pigneto. Sono il tuo concierge digitale: posso aiutarti con il menu, gli orari, le indicazioni e i suggerimenti sui piatti. Come posso esserti utile?',
}

const QUICK_REPLIES = [
  'Cosa consigliates stasera?',
  'Avete piatti senza glutine?',
  'Quali sono gli orari?',
  'Come si arriva?',
]

/* ─── Typing indicator ──────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: '#B8963E' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Single message bubble ─────────────────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const isWaHandoff = msg.content?.includes('##WA_HANDOFF##')
  const text = msg.content?.replace('##WA_HANDOFF##', '').trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[82%] ${isUser ? 'order-2' : ''}`}>
        {text && (
          <div
            className="px-4 py-3 text-[13px] leading-[1.7] font-light"
            style={{
              backgroundColor: isUser ? '#2C4A35' : '#EDE7D9',
              color: isUser ? '#F5F0E8' : '#1A1A18',
              borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            }}
          >
            {text}
          </div>
        )}
        {isWaHandoff && (
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-2 px-4 py-2.5 text-[12px] font-sans font-medium tracking-wide transition-opacity duration-200 hover:opacity-80"
            style={{
              backgroundColor: '#25D366',
              color: '#fff',
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            {/* WhatsApp icon inline SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Scrivici su WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Main widget ────────────────────────────────────────────────────── */
export default function ConciergeWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320)
  }, [open])

  async function sendMessage(text) {
    const userMsg = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setShowQuickReplies(false)

    // Exclude the initial greeting from the API call
    const apiMessages = next
      .slice(1)
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/.netlify/functions/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error('API error')
      const { content } = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Mi dispiace, si è verificato un problema tecnico. ##WA_HANDOFF##',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    sendMessage(trimmed)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Chat panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-[340px] sm:w-[380px] flex flex-col overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#F5F0E8',
              borderRadius: '20px',
              border: '1px solid rgba(184,150,62,0.2)',
              maxHeight: '520px',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                backgroundColor: '#2C4A35',
                borderBottom: '1px solid rgba(184,150,62,0.25)',
              }}
            >
              <div>
                <p
                  className="text-[10px] tracking-[0.22em] uppercase font-sans"
                  style={{ color: '#B8963E' }}
                >
                  Concierge
                </p>
                <p
                  className="text-sm font-light italic mt-0.5"
                  style={{
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                    color: '#F5F0E8',
                    fontSize: '17px',
                  }}
                >
                  Sobrio al Pigneto
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi chat"
                className="p-1.5 rounded-full transition-colors duration-200"
                style={{ color: 'rgba(245,240,232,0.6)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ minHeight: 0 }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {loading && (
                <div
                  className="self-start"
                  style={{
                    backgroundColor: '#EDE7D9',
                    borderRadius: '16px 16px 16px 4px',
                  }}
                >
                  <TypingDots />
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <AnimatePresence>
              {showQuickReplies && !loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="px-4 pb-2 flex flex-wrap gap-2"
                >
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => sendMessage(qr)}
                      className="text-[11px] font-sans px-3 py-1.5 transition-colors duration-200"
                      style={{
                        border: '1px solid rgba(184,150,62,0.4)',
                        color: '#4A4A46',
                        borderRadius: '20px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(184,150,62,0.1)'
                        e.currentTarget.style.borderColor = '#B8963E'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = 'rgba(184,150,62,0.4)'
                      }}
                    >
                      {qr}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: '1px solid rgba(184,150,62,0.15)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi un messaggio…"
                disabled={loading}
                className="flex-1 bg-transparent text-[13px] font-light outline-none placeholder:opacity-40"
                style={{ color: '#1A1A18' }}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                aria-label="Invia"
                className="p-2 rounded-full transition-all duration-200 disabled:opacity-30"
                style={{ backgroundColor: '#2C4A35', color: '#F5F0E8' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bubble toggle button ────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Chiudi chat concierge' : 'Apri chat concierge'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: open ? '#1A1A18' : '#B8963E', color: '#F5F0E8' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
