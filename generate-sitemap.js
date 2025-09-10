#!/usr/bin/env node

/**
 * BuildWise Sitemap Generator
 * Automatische Generierung der sitemap.xml basierend auf verfügbaren HTML-Dateien
 * 
 * Verwendung:
 * node generate-sitemap.js
 * 
 * Oder in package.json als Script:
 * "scripts": { "sitemap": "node generate-sitemap.js" }
 */

const fs = require('fs');
const path = require('path');

// Konfiguration
const CONFIG = {
    baseUrl: 'https://www.buildwise.ch',
    outputFile: 'sitemap.xml',
    defaultChangefreq: 'monthly',
    defaultPriority: 0.5,
    timezone: '+01:00' // Schweizer Zeit
};

// Seiten-spezifische Konfiguration
const PAGE_CONFIG = {
    'index.html': {
        priority: 1.0,
        changefreq: 'weekly',
        hreflang: true,
        images: [
            {
                loc: '/logo.png',
                title: 'BuildWise Logo - Bauträger & Dienstleister Plattform',
                caption: 'BuildWise - Die führende Plattform für Bauträger und Dienstleister in der Schweiz'
            },
            {
                loc: '/assets/aboutus.jpeg',
                title: 'BuildWise Team - Über uns',
                caption: 'Das BuildWise Team - Experten für digitale Bauprozesse'
            }
        ]
    },
    'demo.html': {
        priority: 0.9,
        changefreq: 'monthly',
        hreflang: true
    },
    'demo-new.html': {
        priority: 0.9,
        changefreq: 'monthly',
        hreflang: true
    },
    'thanks.html': {
        priority: 0.6,
        changefreq: 'monthly'
    },
    'datenschutz.html': {
        priority: 0.3,
        changefreq: 'yearly'
    },
    'agb.html': {
        priority: 0.3,
        changefreq: 'yearly'
    },
    'impressum.html': {
        priority: 0.3,
        changefreq: 'yearly'
    }
};

// Zusätzliche URLs (nicht HTML-Dateien)
const ADDITIONAL_URLS = [
    {
        loc: '/manifest.json',
        priority: 0.2,
        changefreq: 'yearly'
    }
];

/**
 * Findet alle HTML-Dateien im aktuellen Verzeichnis
 */
function findHtmlFiles() {
    const files = fs.readdirSync('.');
    return files.filter(file => 
        file.endsWith('.html') && 
        fs.statSync(file).isFile()
    );
}

/**
 * Generiert den aktuellen Timestamp im ISO-Format
 */
function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString().split('.')[0] + CONFIG.timezone;
}

/**
 * Generiert hreflang-Links für eine URL
 */
function generateHreflangLinks(url) {
    if (!url.endsWith('/')) {
        url = url.replace('.html', '');
    }
    
    return `
    <xhtml:link rel="alternate" hreflang="de-ch" href="${CONFIG.baseUrl}${url}" />
    <xhtml:link rel="alternate" hreflang="de" href="${CONFIG.baseUrl}${url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${CONFIG.baseUrl}${url}" />`;
}

/**
 * Generiert Bild-Markup für eine URL
 */
function generateImageMarkup(images) {
    return images.map(img => `
    <image:image>
      <image:loc>${CONFIG.baseUrl}${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('');
}

/**
 * Generiert URL-Eintrag für die Sitemap
 */
function generateUrlEntry(filename) {
    const config = PAGE_CONFIG[filename] || {};
    const url = filename === 'index.html' ? '/' : `/${filename}`;
    const lastmod = getCurrentTimestamp();
    
    let entry = `
  <url>
    <loc>${CONFIG.baseUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq || CONFIG.defaultChangefreq}</changefreq>
    <priority>${config.priority || CONFIG.defaultPriority}</priority>`;

    // Hreflang-Links hinzufügen
    if (config.hreflang) {
        entry += generateHreflangLinks(url);
    }

    // Bilder hinzufügen
    if (config.images) {
        entry += generateImageMarkup(config.images);
    }

    entry += `
  </url>`;

    return entry;
}

/**
 * Generiert zusätzliche URL-Einträge
 */
function generateAdditionalUrlEntry(urlConfig) {
    const lastmod = getCurrentTimestamp();
    
    return `
  <url>
    <loc>${CONFIG.baseUrl}${urlConfig.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${urlConfig.changefreq || CONFIG.defaultChangefreq}</changefreq>
    <priority>${urlConfig.priority || CONFIG.defaultPriority}</priority>
  </url>`;
}

/**
 * Generiert die komplette Sitemap
 */
function generateSitemap() {
    const htmlFiles = findHtmlFiles();
    const timestamp = getCurrentTimestamp();
    
    console.log(`🔍 Gefundene HTML-Dateien: ${htmlFiles.join(', ')}`);
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">

  <!-- Automatisch generiert am ${timestamp} -->`;

    // HTML-Dateien hinzufügen
    htmlFiles.forEach(file => {
        const config = PAGE_CONFIG[file];
        const comment = config ? 
            `\n  <!-- ${file} - ${config.priority >= 0.8 ? 'Hohe Priorität' : config.priority >= 0.5 ? 'Mittlere Priorität' : 'Niedrige Priorität'} -->` :
            `\n  <!-- ${file} -->`;
        
        sitemap += comment;
        sitemap += generateUrlEntry(file);
    });

    // Zusätzliche URLs hinzufügen
    if (ADDITIONAL_URLS.length > 0) {
        sitemap += `\n\n  <!-- Zusätzliche wichtige Ressourcen -->`;
        ADDITIONAL_URLS.forEach(urlConfig => {
            sitemap += generateAdditionalUrlEntry(urlConfig);
        });
    }

    sitemap += `\n\n</urlset>`;
    
    return sitemap;
}

/**
 * Hauptfunktion
 */
function main() {
    try {
        console.log('🚀 BuildWise Sitemap Generator gestartet...');
        
        const sitemap = generateSitemap();
        
        // Backup der alten Sitemap erstellen
        if (fs.existsSync(CONFIG.outputFile)) {
            const backupFile = `${CONFIG.outputFile}.backup`;
            fs.copyFileSync(CONFIG.outputFile, backupFile);
            console.log(`📋 Backup erstellt: ${backupFile}`);
        }
        
        // Neue Sitemap schreiben
        fs.writeFileSync(CONFIG.outputFile, sitemap);
        
        console.log(`✅ Sitemap erfolgreich generiert: ${CONFIG.outputFile}`);
        console.log(`📊 Anzahl URLs: ${(sitemap.match(/<url>/g) || []).length}`);
        console.log(`🌐 Base URL: ${CONFIG.baseUrl}`);
        console.log(`⏰ Letzte Aktualisierung: ${getCurrentTimestamp()}`);
        
        // Validierung
        if (sitemap.includes('<loc></loc>')) {
            console.warn('⚠️  Warnung: Leere URLs gefunden!');
        }
        
        console.log('\n📋 Nächste Schritte:');
        console.log('1. Sitemap in Google Search Console einreichen');
        console.log('2. robots.txt überprüfen');
        console.log('3. Sitemap-URL testen: https://www.buildwise.ch/sitemap.xml');
        
    } catch (error) {
        console.error('❌ Fehler beim Generieren der Sitemap:', error.message);
        process.exit(1);
    }
}

// Script ausführen, wenn direkt aufgerufen
if (require.main === module) {
    main();
}

module.exports = {
    generateSitemap,
    CONFIG,
    PAGE_CONFIG
};
