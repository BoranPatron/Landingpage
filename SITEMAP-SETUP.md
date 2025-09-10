# BuildWise Sitemap Setup - Google Search Console

## 📋 Übersicht

Diese Anleitung erklärt die optimierte Sitemap-Einrichtung für BuildWise in der Google Search Console nach Best Practices 2025.

## 🎯 Was wurde implementiert

### 1. Optimierte XML-Sitemap (`sitemap.xml`)

**Neue Features:**
- ✅ **Image Sitemap Integration** - Bilder werden direkt in der Sitemap referenziert
- ✅ **Erweiterte Hreflang-Unterstützung** - DE-CH, DE und x-default
- ✅ **ISO 8601 Timestamps** - Präzise Zeitangaben mit Timezone
- ✅ **Prioritäten-Optimierung** - Demo-Seiten höher priorisiert (0.9)
- ✅ **Strukturierte Kommentare** - Bessere Übersichtlichkeit

**URL-Struktur:**
```
Priorität 1.0: Hauptseite (/)
Priorität 0.9: Demo-Seiten (wichtig für Conversion)
Priorität 0.6: Thanks-Seite (Conversion-Tracking)
Priorität 0.3: Rechtliche Seiten (Compliance)
Priorität 0.2: Statische Ressourcen
```

### 2. Erweiterte robots.txt

**Neue Funktionen:**
- ✅ **Erweiterte Crawler-Unterstützung** (Google, Bing, DuckDuckGo)
- ✅ **Performance-Optimierung** - Request-rate Limiting
- ✅ **Umfassende Blockierung** - Entwicklungsdateien ausgeschlossen
- ✅ **Explizite Erlaubnisse** - Wichtige SEO-Ressourcen freigegeben

### 3. Automatische Sitemap-Generierung

**Script: `generate-sitemap.js`**
- ✅ **Automatische HTML-Erkennung** - Scannt Verzeichnis nach .html Dateien
- ✅ **Konfigurierbare Prioritäten** - Pro Seite anpassbar
- ✅ **Backup-Funktion** - Alte Sitemap wird gesichert
- ✅ **Validierung** - Prüft auf häufige Fehler

## 🚀 Verwendung

### Manuelle Sitemap-Generierung
```bash
npm run sitemap
```

### Automatische Generierung beim Build
```bash
npm run build
```

### Sitemap validieren
```bash
npm run sitemap:validate
```

## 📊 Google Search Console Setup

### 1. Sitemap einreichen

1. **Google Search Console öffnen:** https://search.google.com/search-console/
2. **Property auswählen:** `buildwise.ch`
3. **Sitemaps-Bereich:** Linke Navigation → "Sitemaps"
4. **Neue Sitemap hinzufügen:**
   ```
   https://www.buildwise.ch/sitemap.xml
   ```

### 2. Validierung prüfen

**Erwartete Ergebnisse:**
- ✅ Status: "Erfolgreich"
- ✅ Entdeckte URLs: ~8-10 URLs
- ✅ Indexierte URLs: Sollte schrittweise steigen

### 3. Monitoring

**Wichtige Metriken:**
- **Abdeckung:** Alle URLs sollten indexierbar sein
- **Verbesserungen:** Core Web Vitals überwachen
- **Leistung:** Klicks und Impressionen verfolgen

## 🔧 Konfiguration anpassen

### Neue Seite hinzufügen

1. **HTML-Datei erstellen** (wird automatisch erkannt)
2. **Konfiguration in `generate-sitemap.js` anpassen:**

```javascript
const PAGE_CONFIG = {
    'neue-seite.html': {
        priority: 0.8,
        changefreq: 'weekly',
        hreflang: true
    }
};
```

3. **Sitemap neu generieren:**
```bash
npm run sitemap
```

### Prioritäten anpassen

**Empfohlene Prioritäten:**
- `1.0` - Hauptseite
- `0.9` - Wichtige Landing Pages, Demo
- `0.8` - Produktseiten, Services
- `0.6` - Blog, News
- `0.5` - Standard-Seiten
- `0.3` - Rechtliches, Footer-Links
- `0.2` - Statische Ressourcen

## 🎯 SEO Best Practices implementiert

### 1. Technische Optimierung
- ✅ **XML Schema Validation** - Korrekte Namespace-Deklarationen
- ✅ **Gzip-Komprimierung** - Automatisch durch Server
- ✅ **UTF-8 Encoding** - Internationale Zeichen unterstützt
- ✅ **Responsive Design** - Mobile-First Indexing bereit

### 2. Content-Optimierung
- ✅ **Hreflang-Implementierung** - Schweizer Zielgruppe
- ✅ **Image SEO** - Bilder in Sitemap integriert
- ✅ **Structured Data** - JSON-LD bereits implementiert
- ✅ **Meta Tags** - Vollständig optimiert

### 3. Performance-Optimierung
- ✅ **Crawl Budget** - Unwichtige Dateien blockiert
- ✅ **Server Response** - Optimierte robots.txt
- ✅ **Caching Strategy** - Appropriate Cache-Control Headers

## 🔍 Troubleshooting

### Häufige Probleme

**1. Sitemap nicht gefunden (404)**
```bash
# Prüfen ob Datei existiert
curl -I https://www.buildwise.ch/sitemap.xml

# robots.txt prüfen
curl https://www.buildwise.ch/robots.txt
```

**2. URLs nicht indexiert**
- Prüfen: robots.txt blockiert URLs nicht
- Prüfen: Canonical Tags korrekt gesetzt
- Prüfen: Meta robots nicht auf "noindex"

**3. Sitemap-Fehler in GSC**
```bash
# XML-Validierung lokal
xmllint --noout sitemap.xml

# Online-Validierung
# https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

## 📈 Monitoring & Wartung

### Wöchentliche Aufgaben
- [ ] Google Search Console Abdeckung prüfen
- [ ] Neue 404-Fehler identifizieren
- [ ] Core Web Vitals überwachen

### Monatliche Aufgaben
- [ ] Sitemap bei neuen Seiten aktualisieren
- [ ] Prioritäten basierend auf Analytics anpassen
- [ ] Konkurrenanalyse durchführen

### Quartalsweise Aufgaben
- [ ] Vollständige SEO-Audit
- [ ] Keyword-Rankings analysieren
- [ ] Technical SEO Review

## 🎉 Nächste Schritte

1. **Sitemap in Google Search Console einreichen**
2. **Bing Webmaster Tools konfigurieren**
3. **Analytics-Tracking einrichten**
4. **Schema.org Markup erweitern**
5. **Performance-Monitoring implementieren**

## 📞 Support

Bei Fragen zur Sitemap-Konfiguration:
- Dokumentation: Diese Datei
- Script-Hilfe: `node generate-sitemap.js --help`
- Google Docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

---

**Letzte Aktualisierung:** 10.09.2025  
**Version:** 1.0  
**Autor:** BuildWise Development Team
