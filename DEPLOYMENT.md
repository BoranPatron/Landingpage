# BuildWise Landingpage - Deployment Guide

Diese Anleitung erklärt, wie du zwischen lokalem Testing und Production-Deployment umschalten kannst.

## 📋 Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Production Deployment](#production-deployment)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Konfiguration](#konfiguration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Übersicht

Das Projekt verwendet ein **umgebungsbasiertes Konfigurationssystem**, das automatisch zwischen lokalen und Production-URLs umschaltet:

- **Lokal**: `http://localhost:10000` (API) und `http://localhost:5508` (Frontend)
- **Production**: `https://buildwise-api.onrender.com` (API) und `https://www.buildwise.ch` (Frontend)

Die Konfiguration wird automatisch durch die `DEPLOYMENT_MODE` Umgebungsvariable gesteuert.

---

## 🔧 Lokale Entwicklung

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install
```

### Lokalen Server starten

#### Option 1: Mit Netlify CLI (empfohlen für vollständige Features)

```bash
npm run dev
```

- Startet `netlify dev` auf Port 5508
- Unterstützt Netlify Functions
- Automatische SPA-Routing-Konfiguration
- **Generiert automatisch `config.js` mit localhost-URLs**

#### Option 2: Einfacher Static Server (schneller Start)

```bash
npm run dev:simple
```

- Startet einfachen `serve` Server auf Port 5508
- Keine Netlify-Features
- **Generiert automatisch `config.js` mit localhost-URLs**

### Browser öffnen

```
http://localhost:5508
```

### Manuelle Config-Generierung (optional)

Falls du nur die `config.js` für lokale Entwicklung generieren möchtest:

```bash
npm run config:local
```

---

## 🚀 Production Deployment

### Git Push Deployment (Automatisch)

Wenn du zu GitHub pusht, wird automatisch:

1. **Netlify** oder **Render.com** startet den Build-Prozess
2. `npm run build` wird ausgeführt
3. `config.js` wird automatisch mit Production-URLs generiert
4. Die Site wird deployed

### Manueller Production Build

Um lokal einen Production-Build zu testen:

```bash
npm run build
```

Dies führt folgende Schritte aus:
1. Generiert `config.js` mit Production-URLs
2. Generiert `sitemap.xml`
3. Erstellt Production-optimierte Dateien

### Production Config manuell generieren

```bash
npm run config
```

Generiert `config.js` mit Production-URLs:
- API: `https://buildwise-api.onrender.com`
- Frontend: `https://www.buildwise.ch`

---

## 🔐 Umgebungsvariablen

### Lokale Entwicklung

Erstelle eine `.env` Datei im Projekt-Root (wird nicht in Git committed):

```env
DEPLOYMENT_MODE=local
API_BASE_URL=http://localhost:10000
FRONTEND_URL=http://localhost:5508
BREVO_API_KEY=your_local_key
```

### Production Deployment

Für Netlify:
- Setze die Umgebungsvariablen im **Netlify Dashboard** unter Settings → Environment Variables:
  - `DEPLOYMENT_MODE` = `production`
  - `API_BASE_URL` = `https://buildwise-api.onrender.com`
  - `FRONTEND_URL` = `https://www.buildwise.ch`
  - `BREVO_API_KEY` = (dein API Key)

Für Render.com:
- Die Umgebungsvariablen sind bereits in `render.yaml` konfiguriert
- Für sensible Werte wie `BREVO_API_KEY`, setze sie im Render Dashboard

### .env Dateien

- `.env` - Lokale Entwicklung (wird von Git ignoriert)
- `.env.production` - Production-Fallback (optional, wird von Git ignoriert)
- `.env.example` - Template für Team-Mitglieder (sollte in Git sein)

**Wichtig**: `.env` Dateien werden nicht in Git committed (siehe `.gitignore`)

---

## ⚙️ Konfiguration

### Automatische Config-Generierung

Die `config.js` wird automatisch aus `config.js.template` generiert. Die Platzhalter werden durch Umgebungsvariablen ersetzt:

- `{{API_BASE_URL}}` → Wird durch API-URL ersetzt
- `{{FRONTEND_URL}}` → Wird durch Frontend-URL ersetzt

### Scripts im Detail

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet Netlify Dev Server (localhost URLs) |
| `npm run dev:simple` | Startet einfachen Static Server (localhost URLs) |
| `npm run build` | Production Build (production URLs) |
| `npm run config` | Generiert config.js mit production URLs |
| `npm run config:local` | Generiert config.js mit localhost URLs |
| `npm run serve` | Einfacher Static Server auf Port 5508 |

### Config-Werte

#### Lokal (DEPLOYMENT_MODE=local)
```javascript
API_BASE: 'http://localhost:10000'
FRONTEND_URL: 'http://localhost:5508'
```

#### Production (DEPLOYMENT_MODE=production)
```javascript
API_BASE: 'https://buildwise-api.onrender.com'
FRONTEND_URL: 'https://www.buildwise.ch'
```

---

## 🐛 Troubleshooting

### Problem: "404 Not Found" beim lokalen Testen

**Lösung 1**: Verwende `npm run dev:simple` statt `npm run dev`

**Lösung 2**: Prüfe, ob `index.html` im Root-Verzeichnis existiert

**Lösung 3**: Starte den Server neu:
```bash
npm run config:local
npm run serve
```

### Problem: Falsche URLs in Production

**Lösung**: Prüfe Umgebungsvariablen im Deployment-Dashboard:
- Netlify: Settings → Environment Variables
- Render: Environment Variables in Service-Konfiguration

Stelle sicher, dass `DEPLOYMENT_MODE=production` gesetzt ist.

### Problem: Config.js wird nicht generiert

**Lösung**: Führe manuell aus:
```bash
# Für lokal
npm run config:local

# Für production
npm run config
```

### Problem: Netlify CLI nicht gefunden

**Lösung**: Installiere es als devDependency:
```bash
npm install netlify-cli --save-dev
```

Oder verwende `npm run dev:simple` für lokale Entwicklung.

### Problem: CORS-Fehler in der Browser-Konsole

**Lösung**: Stelle sicher, dass:
1. Die lokale API läuft (`npm run api` in separatem Terminal)
2. `config.js` die richtige localhost-URL verwendet
3. Die API CORS für localhost konfiguriert ist

---

## 📝 Best Practices

### Vor dem Deployment

1. ✅ `npm run build` lokal testen
2. ✅ Prüfen, dass `config.js` Production-URLs enthält
3. ✅ `sitemap.xml` validieren
4. ✅ Browser DevTools auf Fehler prüfen

### Während der Entwicklung

1. ✅ Verwende `npm run dev` für vollständige Netlify-Features
2. ✅ Verwende `npm run dev:simple` für schnelles Testing
3. ✅ Ändere **nie** `config.js` manuell - verwende immer die Scripts
4. ✅ Ändere stattdessen `config.js.template` und führe `npm run config:local` aus

### Nach dem Deployment

1. ✅ Teste die Production-URL im Browser
2. ✅ Prüfe Browser-Konsole auf Fehler
3. ✅ Validiere, dass API-Calls zu Production-URL gehen
4. ✅ Teste Netlify Functions (falls verwendet)

---

## 🔗 Weitere Ressourcen

- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs
- **Env Setup**: Siehe `env-setup.txt` für detaillierte .env Konfiguration

---

## ❓ FAQ

**Q: Muss ich jedes Mal `npm run config:local` ausführen?**  
A: Nein, `npm run dev` führt das automatisch aus.

**Q: Kann ich beide Modi gleichzeitig testen?**  
A: Ja, starte zwei Server auf verschiedenen Ports:
```bash
# Terminal 1: Production Build
npm run build && npm run serve

# Terminal 2: Lokale Entwicklung
npm run dev:simple
```

**Q: Wo werden die Production-URLs gespeichert?**  
A: Sie werden zur Build-Zeit aus Umgebungsvariablen generiert und in `config.js` geschrieben.

**Q: Kann ich die URLs im Code ändern?**  
A: Nein, ändere `config.js.template` und generiere die config neu. Niemals `config.js` manuell editieren - sie wird bei jedem Build überschrieben.

---

**Letzte Aktualisierung**: 2025-10-29
