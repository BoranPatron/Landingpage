const express = require('express');
const path = require('path');

const app = express();

// Content Security Policy Header für Google Ads & Analytics
// Identisch mit netlify.toml Zeile 31
const cspHeader = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.google.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://cdn.tailwindcss.com https://unpkg.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.google.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://cdn.tailwindcss.com https://unpkg.com; connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.google.com https://*.analytics.google.com https://*.gstatic.com https://*.onrender.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://www.google.com/pagead/ https://*.google.com/pagead/; img-src 'self' data: blob: https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.google.com https://*.gstatic.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://*.gstatic.com; frame-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net;";

// Setze CSP-Header mit höchster Priorität
// Wichtig: Diese Middleware muss VOR express.static() kommen
app.use((req, res, next) => {
  // Setze CSP-Header - Render.com sollte diese weiterleiten
  res.setHeader('Content-Security-Policy', cspHeader);
  // Zusätzliche Header für bessere Kompatibilität
  res.setHeader('X-Content-Security-Policy', cspHeader);
  // Verhindere Caching der Header
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Test-Route: Zeige die aktuelle CSP-Konfiguration
app.get('/test-csp', (req, res) => {
  res.json({
    cspHeader: cspHeader,
    cspLength: cspHeader.length,
    hasGoogleAds: cspHeader.includes('googleadservices'),
    timestamp: new Date().toISOString()
  });
});

// Redirect für favicon.png (Browser sucht automatisch nach /favicon.png)
app.get('/favicon.png', (req, res) => {
  res.redirect('/assets/favicon.png');
});

// Statische Dateien ausliefern
app.use(express.static(path.join(__dirname), {
  dotfiles: 'ignore',
  index: false
}));

// SPA Routing: Alle nicht-existierenden Pfade zu index.html weiterleiten
// Wie in netlify.toml Zeile 15-18
// express.static hat bereits alle existierenden Dateien ausgeliefert,
// daher liefern wir hier nur noch index.html für alle anderen Routen
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Static server listening on port ${port}`);
});

