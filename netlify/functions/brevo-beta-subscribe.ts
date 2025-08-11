// Netlify Function: Brevo Beta Subscribe
import type { Handler } from '@netlify/functions'

// API-Key MUSS aus der Umgebung kommen; kein Fallback im Code
const BREVO_API_KEY = process.env.BREVO_API_KEY as string
const BREVO_BASE_URL = 'https://api.brevo.com/v3'
const BETA_LIST_ID = 3
const BETA_TAG = 'Beta'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) }
  }

  if (!BREVO_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Missing BREVO_API_KEY' }) }
  }

  try {
    const body = JSON.parse(event.body || '{}') as { email?: string }
    const email = (body.email || '').trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid email' }) }
    }

    // Create/Update contact and add to list
    const cuResp = await fetch(`${BREVO_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({ email, listIds: [BETA_LIST_ID], updateEnabled: true }),
    })
    if (!cuResp.ok) {
      const detail = await safeJson(cuResp)
      return { statusCode: 502, body: JSON.stringify({ stage: 'create_or_update', detail }) }
    }

    // Tag set (idempotent)
    const tagResp = await fetch(`${BREVO_BASE_URL}/contacts/${encodeURIComponent(email)}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({ tags: [BETA_TAG] }),
    })
    // Ignore tag errors; return success with warning
    if (!tagResp.ok) {
      const warn = await safeJson(tagResp)
      return { statusCode: 200, body: JSON.stringify({ status: 'ok', email, warn }) }
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'ok', email }) }
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err?.message || 'Internal error' }) }
  }
}

async function safeJson(resp: Response) {
  try { return await resp.json() } catch { return { text: await resp.text() } }
}


