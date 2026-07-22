export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A18', color: '#EDE7D9' }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {/* Brand */}
        <div>
          <p
            className="text-4xl italic mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Radici
          </p>
          <p className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#B8963E' }}>
            Ristorante
          </p>
          <p className="text-sm leading-relaxed opacity-60 font-light">
            Cucina stagionale radicata nel territorio, interpretata con rispetto e passione.
          </p>
        </div>

        {/* Orari */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#B8963E' }}>
            Orari
          </p>
          <ul className="space-y-2 text-sm opacity-70 font-light">
            <li className="flex justify-between gap-8">
              <span>Martedì – Venerdì</span>
              <span>12:30 – 14:30 / 19:30 – 22:30</span>
            </li>
            <li className="flex justify-between gap-8">
              <span>Sabato</span>
              <span>19:30 – 23:00</span>
            </li>
            <li className="flex justify-between gap-8">
              <span>Domenica</span>
              <span>12:30 – 15:00</span>
            </li>
            <li className="flex justify-between gap-8 pt-1" style={{ color: '#B8963E', opacity: 1 }}>
              <span>Lunedì</span>
              <span>Chiuso</span>
            </li>
          </ul>
        </div>

        {/* Contatti */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#B8963E' }}>
            Dove siamo
          </p>
          <address className="not-italic text-sm leading-relaxed opacity-70 font-light space-y-1">
            <p>Via delle Querce, 12</p>
            <p>20121 Milano (MI)</p>
            <p className="pt-3">
              <a href="tel:+390212345678" className="hover:text-[#B8963E] transition-colors">
                +39 02 1234 5678
              </a>
            </p>
            <p>
              <a href="mailto:info@radici-ristorante.it" className="hover:text-[#B8963E] transition-colors">
                info@radici-ristorante.it
              </a>
            </p>
          </address>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 font-light"
        style={{ borderTop: '1px solid rgba(237,231,217,0.15)' }}
      >
        <p>© {new Date().getFullYear()} Radici Ristorante. Tutti i diritti riservati.</p>
        <p>P.IVA 01234567890</p>
      </div>
    </footer>
  )
}
