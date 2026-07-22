/**
 * Netlify Function — /.netlify/functions/concierge
 *
 * Concierge AI per Sobrio al Pigneto: risponde su menu, orari,
 * allergeni, indicazioni, suggerisce piatti.
 * Chiama Anthropic (claude-haiku-4-5-20251001) con context-stuffing.
 *
 * Variabili d'ambiente:
 *   ANTHROPIC_API_KEY  → API key Anthropic
 *
 * Senza ANTHROPIC_API_KEY risponde con messaggio di fallback (no crash).
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

// ─── Menu completo embedded (aggiornato da menu.json al build) ────────────
const MENU = {
  stagione: 'Estate 2025',
  categorie: [
    {
      id: 'antipasti',
      label: 'Antipasti',
      piatti: [
        { nome: 'Supplì al telefono', descrizione: 'Riso mantecato, ragù di quinto quarto, fior di latte filante. Fritti al momento.', prezzo: '7', allergeni: ['glutine', 'latte', 'uova'] },
        { nome: 'Bruschette ai pomodorini', descrizione: 'Pane casereccio tostato, datterini di Pachino, basilico fresco, olio EVO del Sabino.', prezzo: '6', badge: ['veg'], allergeni: ['glutine'] },
        { nome: 'Fiori di zucca fritti', descrizione: 'Ripieni di ricotta fresca e alici di Cetara, pastella leggera alla birra artigianale.', prezzo: '9', allergeni: ['glutine', 'latte', 'uova', 'pesce'] },
        { nome: 'Alici marinate al limone', descrizione: 'Alici fresche di Anzio, limone di Amalfi, cipolla di Tropea, prezzemolo romano.', prezzo: '11', allergeni: ['pesce'] },
      ],
    },
    {
      id: 'primi',
      label: 'Primi',
      piatti: [
        { nome: 'Cacio e pepe', descrizione: 'Tonnarelli di Gragnano, pecorino romano DOP stagionato 18 mesi, pepe nero Tellicherry macinato al momento.', prezzo: '16', badge: ['veg'], allergeni: ['glutine', 'latte', 'uova'] },
        { nome: 'Rigatoni alla carbonara', descrizione: 'Guanciale di Amatrice, tuorli di uova di campagna, pecorino romano, pepe in abbondanza.', prezzo: '17', allergeni: ['glutine', 'latte', 'uova'] },
        { nome: 'Bucatini all\'amatriciana', descrizione: 'Guanciale di Amatrice, San Marzano dell\'Agro Sarnese-Nocerino, cipolla bianca, pecorino, peperoncino secco.', prezzo: '15', allergeni: ['glutine', 'latte'] },
        { nome: 'Gnocchi alla Romana al forno', descrizione: 'Semolino di grano duro, burro di malga, salvia fresca, Parmigiano Reggiano 24 mesi, gratinati al forno.', prezzo: '14', badge: ['veg'], allergeni: ['glutine', 'latte', 'uova'] },
      ],
    },
    {
      id: 'secondi',
      label: 'Secondi',
      piatti: [
        { nome: 'Coda alla Vaccinara', descrizione: 'Coda di bue brasata lentamente con vino rosso, pomodoro, cioccolato fondente, uvetta, pinoli e sedano.', prezzo: '24', allergeni: ['sedano', 'frutta a guscio', 'latte'] },
        { nome: 'Saltimbocca alla Romana', descrizione: 'Piccatine di vitello, prosciutto crudo di Norcia DOP, salvia fresca, sfumato al Frascati DOC.', prezzo: '22', allergeni: ['latte'] },
        { nome: 'Cicoria ripassata con uova in camicia', descrizione: 'Cicoria di campo raccolta a mano, aglio, peperoncino di Gaeta, uova di campagna, pane tostato.', prezzo: '14', badge: ['veg'], allergeni: ['glutine', 'uova'] },
        { nome: 'Baccalà in guazzetto', descrizione: 'Baccalà dissalato 48 ore, pomodorini del Piennolo, olive di Gaeta, capperi di Pantelleria, patate novelle.', prezzo: '21', allergeni: ['pesce'] },
      ],
    },
    {
      id: 'dolci',
      label: 'Dolci',
      piatti: [
        { nome: 'Tiramisù di Sobrio', descrizione: 'Savoiardi artigianali inzuppati nel caffè della Giamaica, crema di mascarpone, cacao amaro del Madagascar.', prezzo: '8', badge: ['veg'], allergeni: ['glutine', 'latte', 'uova'] },
        { nome: 'Torta di ricotta e visciole', descrizione: 'Ricotta di bufala campana DOP, visciole in sciroppo di Vignola, frolla al burro di malga.', prezzo: '7', badge: ['veg'], allergeni: ['glutine', 'latte', 'uova'] },
        { nome: 'Granita di caffè con panna', descrizione: 'Caffè espresso ristretto La Marzocco, panna fresca montata a mano, zucchero semolato.', prezzo: '6', badge: ['veg'], allergeni: ['latte'] },
        { nome: 'Semifreddo al torroncino', descrizione: 'Croccante di mandorle di Noto, zabaione al Marsala Superiore, fondente 72% grattugiato.', prezzo: '8', badge: ['veg'], allergeni: ['frutta a guscio', 'latte', 'uova'] },
      ],
    },
  ],
}

function buildMenuText() {
  return MENU.categorie.map((cat) => {
    const piatti = cat.piatti.map((p) => {
      const badges = p.badge?.length ? ` [${p.badge.join(', ')}]` : ''
      const allergeni = p.allergeni?.length ? ` — allergeni: ${p.allergeni.join(', ')}` : ''
      return `  • ${p.nome} €${p.prezzo}${badges}: ${p.descrizione}${allergeni}`
    }).join('\n')
    return `${cat.label}:\n${piatti}`
  }).join('\n\n')
}

const SYSTEM_PROMPT = `Sei il concierge digitale di Sobrio al Pigneto, un ristorante di cucina romana d'autore nel quartiere Pigneto a Roma.
Rispondi sempre in italiano, con tono caldo, elegante e conciso. Non usare elenchi puntati nelle risposte brevi.

═══ INFORMAZIONI RISTORANTE ═══
Nome: Sobrio al Pigneto
Cucina: Romana d'autore — ingredienti di mercato, tecnica rispettosa, nessuna sovrastruttura
Indirizzo: Via del Pigneto, Roma (quartiere Pigneto)
Telefono / WhatsApp: +39 335 316 854
Stagione menu: ${MENU.stagione}

Orari:
  Pranzo: giovedì–domenica, 12:30–14:30 (ultimo ingresso 14:00)
  Cena: martedì–domenica, 19:30–23:00 (ultimo ingresso 21:30)
  Chiuso: lunedì

Come arrivare:
  Metro: linea C, fermata Pigneto (5 minuti a piedi)
  Tram: linee 5, 14, 19 — fermata Pigneto
  Auto: ZTL non attiva nella zona; parcheggi in Via Prenestina e Via Casilina

═══ MENU ${MENU.stagione.toUpperCase()} ═══
${buildMenuText()}

═══ POLITICHE ═══
Prenotazioni: obbligatorie per cena, consigliate per pranzo
Allergie severe: segnalare al personale prima di ordinare — tracce possibili
Il menu varia settimanalmente con la stagionalità

═══ ISTRUZIONI COMPORTAMENTO ═══
Puoi aiutare con: informazioni sui piatti, allergeni, orari, indicazioni stradali, suggerimenti su cosa ordinare.
Se l'utente vuole PRENOTARE o chiede qualcosa fuori dal tuo ambito, rispondi con precisamente questa stringa speciale: ##WA_HANDOFF##
Esempio: se qualcuno dice "vorrei prenotare un tavolo" o "volete gestire catering privati" rispondi con ##WA_HANDOFF##.
Non aggiungere altro testo quando rispondi ##WA_HANDOFF##.
Non inventare informazioni non presenti sopra.`

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Metodo non consentito' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Payload non valido' })
  }

  const { messages } = payload
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'messages mancanti' })
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

  if (!ANTHROPIC_API_KEY) {
    console.log('[concierge] ANTHROPIC_API_KEY non configurata — risposta di fallback')
    return json(200, {
      content: 'Ciao! Sono il concierge di Sobrio al Pigneto. Al momento non riesco a connettermi, ma puoi scriverci su WhatsApp per qualsiasi domanda sul menu o per prenotare. ##WA_HANDOFF##',
    })
  }

  let anthropicRes
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
  } catch (err) {
    console.error('[concierge] Fetch verso Anthropic fallita:', err)
    return json(502, { error: 'Servizio AI non raggiungibile' })
  }

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.text()
    console.error('[concierge] Anthropic error:', anthropicRes.status, errBody)
    return json(502, { error: 'Errore API AI' })
  }

  const data = await anthropicRes.json()
  const content = data.content?.[0]?.text ?? ''

  return json(200, { content })
}
