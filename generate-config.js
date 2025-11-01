const fs = require('fs');
const path = require('path');

// Lese .env Datei
function loadEnvFile(envFile) {
    const envPath = path.join(__dirname, envFile);
    
    if (!fs.existsSync(envPath)) {
        console.warn(`⚠️  ${envFile} not found. Using default values.`);
        return {};
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
        // Ignoriere Kommentare und leere Zeilen
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    });
    
    return env;
}

// Lade .env basierend auf DEPLOYMENT_MODE
const deploymentMode = process.env.DEPLOYMENT_MODE || 'local';

let envVars = {};
if (deploymentMode === 'production') {
    console.log('📦 Using production configuration');
    envVars = loadEnvFile('.env.production');
    
    // Netlify/Render Umgebungsvariablen haben Priorität
    envVars.API_BASE_URL = process.env.API_BASE_URL || envVars.API_BASE_URL;
    envVars.FRONTEND_URL = process.env.FRONTEND_URL || envVars.FRONTEND_URL;
} else {
    console.log('🔧 Using local development configuration');
    envVars = loadEnvFile('.env');
}

// Setze Default-Werte basierend auf Deployment Mode
const config = {
    API_BASE_URL: envVars.API_BASE_URL || (deploymentMode === 'production' 
        ? 'https://buildwise-api.onrender.com' 
        : 'http://localhost:10000'),
    FRONTEND_URL: envVars.FRONTEND_URL || (deploymentMode === 'production'
        ? 'https://www.buildwise.ch'
        : 'http://localhost:5508')
};

console.log('📝 Configuration:');
console.log(`   API_BASE_URL: ${config.API_BASE_URL}`);
console.log(`   FRONTEND_URL: ${config.FRONTEND_URL}`);

// Lese Template
const templatePath = path.join(__dirname, 'config.js.template');
const template = fs.readFileSync(templatePath, 'utf8');

// Ersetze Platzhalter
const configJs = template
    .replace(/\{\{API_BASE_URL\}\}/g, config.API_BASE_URL)
    .replace(/\{\{FRONTEND_URL\}\}/g, config.FRONTEND_URL);

// Schreibe config.js
const outputPath = path.join(__dirname, 'config.js');
fs.writeFileSync(outputPath, configJs, 'utf8');

console.log('✅ config.js generated successfully');
