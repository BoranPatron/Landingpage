const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS: Erlaube spezifische Origin per ENV, sonst alle (für schnelle Inbetriebnahme)
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin, credentials: false }));

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_BASE_URL = 'https://api.brevo.com/v3';
const BETA_LIST_ID = 3;
const BETA_TAG = 'Beta';

app.get('/healthz', (_, res) => res.status(200).send('ok'));

app.post('/beta-subscribe', async (req, res) => {
  try {
    if (!BREVO_API_KEY) {
      return res.status(500).json({ message: 'Missing BREVO_API_KEY' });
    }

    const email = (req.body?.email || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
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
    });
    if (!cuResp.ok) {
      const detail = await safeJson(cuResp);
      return res.status(502).json({ stage: 'create_or_update', detail });
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
    });
    if (!tagResp.ok) {
      const warn = await safeJson(tagResp);
      return res.status(200).json({ status: 'ok', email, warn });
    }

    return res.status(200).json({ status: 'ok', email });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Internal error' });
  }
});

function safeJson(resp) {
  return resp
    .json()
    .catch(async () => ({ text: await resp.text().catch(() => '') }));
}

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});


