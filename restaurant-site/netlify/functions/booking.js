/**
 * Netlify Function — /.netlify/functions/booking
 *
 * Riceve i dati del form di prenotazione e invia un'email
 * al ristorante tramite Resend (https://resend.com).
 *
 * Variabili d'ambiente da configurare in Netlify → Site settings → Env vars:
 *   RESEND_API_KEY      → la tua API key Resend
 *   RESTAURANT_EMAIL    → email del ristorante (default: info@sobrio-alpigneto.it)
 *   FROM_EMAIL          → mittente verificato su Resend (default: prenotazioni@sobrio-alpigneto.it)
 *
 * Senza RESEND_API_KEY la function logga la prenotazione e risponde 200
 * così il sito funziona anche in sviluppo/staging.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

function buildHtml({ nome, email, telefono, data, orario, coperti, note, dataFormatted }) {
  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:10px 0;border-top:1px solid rgba(184,150,62,0.2);
                      font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
                      color:#B8963E;font-family:sans-serif;width:120px;vertical-align:top">${label}</td>
           <td style="padding:10px 0 10px 16px;border-top:1px solid rgba(184,150,62,0.2);
                      font-size:15px;color:#1A1A18">${value}</td>
         </tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><title>Prenotazione</title></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px">
    <p style="font-size:10px;letter-spacing:0.28em;text-transform:uppercase;
              color:#B8963E;font-family:sans-serif;margin:0 0 8px">Sobrio al Pigneto · Roma</p>
    <h1 style="font-size:32px;font-weight:300;font-style:italic;color:#2C4A35;margin:0 0 40px">
      Nuova prenotazione
    </h1>

    <table style="width:100%;border-collapse:collapse">
      ${row('Nome', nome)}
      ${row('Email', `<a href="mailto:${email}" style="color:#2C4A35">${email}</a>`)}
      ${row('Telefono', telefono || '—')}
      ${row('Data', dataFormatted)}
      ${row('Orario', orario)}
      ${row('Coperti', coperti)}
      ${row('Note', note || '—')}
    </table>

    <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(44,74,53,0.2)">
      <p style="font-size:12px;color:#4A4A46;font-family:sans-serif;margin:0 0 8px">
        Rispondete a questa email per confermare la prenotazione al cliente.
      </p>
      <p style="font-size:12px;color:#4A4A46;font-family:sans-serif;margin:0">
        Reply-To già impostato su <strong>${email}</strong>.
      </p>
    </div>
  </div>
</body>
</html>`
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Metodo non consentito' })
  }

  // Parse body
  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Payload non valido' })
  }

  const { nome, email, telefono, data, orario, coperti, note } = payload

  // Server-side validation (difesa in profondità)
  if (!nome?.trim() || !email?.trim() || !data || !orario || !coperti) {
    return json(400, { error: 'Campi obbligatori mancanti' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return json(400, { error: 'Email non valida' })
  }

  // Formatta data in italiano
  const dataFormatted = new Date(data).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Europe/Rome',
  })

  const RESEND_API_KEY    = process.env.RESEND_API_KEY
  const RESTAURANT_EMAIL  = process.env.RESTAURANT_EMAIL  || 'info@sobrio-alpigneto.it'
  const FROM_EMAIL        = process.env.FROM_EMAIL        || 'prenotazioni@sobrio-alpigneto.it'

  // Modalità degradata: logga e rispondi OK senza inviare email
  if (!RESEND_API_KEY) {
    console.log('[booking] RESEND_API_KEY non configurata — prenotazione ricevuta:', {
      nome, email, data, orario, coperti
    })
    return json(200, { ok: true, warn: 'email_non_inviata' })
  }

  const emailHtml = buildHtml({ nome, email, telefono, data, orario, coperti, note, dataFormatted })

  let resendRes
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [RESTAURANT_EMAIL],
        reply_to: email.trim(),
        subject: `Prenotazione — ${nome} — ${dataFormatted} ${orario} (${coperti} cop.)`,
        html: emailHtml,
      }),
    })
  } catch (err) {
    console.error('[booking] Fetch verso Resend fallita:', err)
    return json(502, { error: 'Servizio email non raggiungibile' })
  }

  if (!resendRes.ok) {
    const errBody = await resendRes.text()
    console.error('[booking] Resend error:', resendRes.status, errBody)
    return json(502, { error: 'Invio email fallito' })
  }

  return json(200, { ok: true })
}
