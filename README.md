# BuildWise Landingpage

Eine moderne, responsive Landingpage für die BuildWise-Plattform, die Bauträger und Dienstleister im Baugewerbe verbindet.

## 🚀 Features

- **Modernes Design**: Clean und professionell mit Fokus auf Benutzerfreundlichkeit
- **Responsive**: Optimiert für alle Geräte (Desktop, Tablet, Mobile)
- **Performance**: Schnelle Ladezeiten und optimierte Performance
- **Accessibility**: Barrierefreiheit und SEO-optimiert
- **Animationen**: Smooth Scroll-Animationen mit AOS (Animate On Scroll)
- **Interaktivität**: JavaScript-basierte Interaktionen und Formulare

## 🛠️ Technologie-Stack

- **HTML5**: Semantische Struktur
- **CSS3**: Moderne Styling-Techniken
- **Tailwind CSS**: Utility-First CSS Framework
- **JavaScript (ES6+)**: Vanilla JavaScript für Interaktivität
- **AOS**: Animate On Scroll Library
- **Google Fonts**: Inter Font Family

## 📁 Projektstruktur

```
Landingpage/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # Custom CSS-Styles
├── script.js           # JavaScript-Funktionalität
├── assets/
│   └── favicon.svg     # BuildWise Favicon
└── README.md           # Diese Datei
```

## 🎨 Design-System

### Farben
- **Primär**: Orange (#f97316, #ea580c)
- **Sekundär**: Grau (#6b7280, #9ca3af)
- **Hintergrund**: Weiß (#ffffff) und Grau (#f8fafc)

### Typografie
- **Font**: Inter (Google Fonts)
- **Gewicht**: 300, 400, 500, 600, 700

### Komponenten
- **Navigation**: Fixed Header mit Scroll-Effekt
- **Hero Section**: Große Headline mit CTA-Buttons
- **Features**: 6 Feature-Cards mit Icons
- **Pricing**: 3 Pricing-Tiers (Basic, Pro, Enterprise)
- **About**: Über uns mit Statistiken
- **Contact**: Kontaktformular und Informationen
- **Footer**: Links und rechtliche Informationen

## 🚀 Deployment

### Render.com Deployment

1. **Repository verbinden**:
   - Verbinden Sie das GitHub-Repository mit Render.com
   - Wählen Sie "Static Site" als Service-Typ

2. **Build-Konfiguration**:
   ```
   Build Command: (leer lassen)
   Publish Directory: ./
   ```

3. **Umgebungsvariablen** (optional):
   - `NODE_ENV=production`

4. **Domain-Konfiguration**:
   - Automatische SSL-Zertifikate
   - Custom Domain möglich

### Lokale Entwicklung

1. **Repository klonen**:
   ```bash
   git clone <repository-url>
   cd Landingpage
   ```

2. **Lokalen Server starten**:
   ```bash
   # Mit Python
   python -m http.server 8000
   
   # Mit Node.js
   npx serve .
   
   # Mit PHP
   php -S localhost:8000
   ```

3. **Browser öffnen**:
   ```
   http://localhost:8000
   ```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Optimierungen
- **Mobile-First**: Design beginnt mit Mobile
- **Touch-Friendly**: Große Touch-Targets
- **Performance**: Optimierte Bilder und Assets

## 🔧 Anpassungen

### Farben ändern
Bearbeiten Sie die CSS-Variablen in `styles.css`:
```css
:root {
  --primary-color: #f97316;
  --primary-dark: #ea580c;
  --secondary-color: #6b7280;
}
```

### Inhalte anpassen
- **Texte**: Bearbeiten Sie die HTML-Datei
- **Bilder**: Ersetzen Sie die Bildpfade
- **Links**: Aktualisieren Sie die href-Attribute

### Neue Sektionen hinzufügen
1. HTML-Struktur in `index.html` hinzufügen
2. CSS-Styles in `styles.css` definieren
3. JavaScript-Funktionalität in `script.js` implementieren

## 📊 Performance

### Optimierungen
- **Lazy Loading**: Bilder werden erst geladen, wenn sichtbar
- **Minifizierung**: CSS und JS werden komprimiert
- **Caching**: Browser-Caching für statische Assets
- **CDN**: Externe Libraries über CDN

### Lighthouse Score
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## 🔍 SEO

### Meta-Tags
- Title: "BuildWise - Die intelligente Plattform für Bauprojekte"
- Description: Optimiert für Suchmaschinen
- Keywords: Bauprojekte, Bauträger, Dienstleister, Schweiz

### Strukturierte Daten
- Organization Schema
- Contact Schema
- Service Schema

## 🛡️ Sicherheit

- **HTTPS**: Erzwungen über Render.com
- **CSP**: Content Security Policy
- **XSS-Schutz**: Sanitized Inputs
- **CSRF-Schutz**: Token-basierte Authentifizierung

## 📈 Analytics

### Tracking
- **Page Views**: Automatisches Tracking
- **Button Clicks**: Event-basiertes Tracking
- **Form Submissions**: Conversion Tracking
- **Scroll Depth**: Engagement Tracking

### Integration
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel (optional)

## 🧪 Testing

### Browser-Tests
- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

### Device-Tests
- iPhone (iOS 14+)
- Android (Android 10+)
- iPad (iOS 14+)
- Desktop (Windows, macOS, Linux)

## 📝 Changelog

### Version 1.0.0 (2024-01-XX)
- Initiale Version der Landingpage
- Responsive Design
- AOS Animationen
- Kontaktformular
- SEO-Optimierung
- Repository-Synchronisation abgeschlossen (2024-12-19)

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Pushen Sie den Branch
5. Erstellen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 📞 Support

Bei Fragen oder Problemen:
- **E-Mail**: info@buildwise.ch
- **Telefon**: +41 44 123 45 67
- **Website**: https://buildwise.ch

---

**BuildWise** - Die intelligente Plattform für Bauprojekte 🏗️ 