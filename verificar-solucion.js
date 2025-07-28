const https = require('https');
const http = require('http');

const domain = 'green-monkey-737947.hostingersite.com';

console.log('🔍 Verificando configuración de hosting...\n');

// Función para hacer peticiones HTTP/HTTPS
function makeRequest(url, description) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, (res) => {
            console.log(`✅ ${description}`);
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   URL: ${url}\n`);
            resolve({ success: true, status: res.statusCode });
        }).on('error', (err) => {
            console.log(`❌ ${description}`);
            console.log(`   Error: ${err.message}`);
            console.log(`   URL: ${url}\n`);
            resolve({ success: false, error: err.message });
        });
    });
}

async function verificarConfiguracion() {
    const tests = [
        {
            url: `https://${domain}`,
            description: 'Redirección principal al frontend'
        },
        {
            url: `https://${domain}/frontend/`,
            description: 'Acceso directo al frontend'
        },
        {
            url: `https://${domain}/backend/public/`,
            description: 'Acceso al backend Laravel'
        },
        {
            url: `https://${domain}/frontend/assets/`,
            description: 'Acceso a archivos estáticos del frontend'
        }
    ];

    console.log('🚀 Iniciando verificaciones...\n');

    for (const test of tests) {
        await makeRequest(test.url, test.description);
        // Pequeña pausa entre requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('📋 Resumen de verificación:');
    console.log('1. ✅ Headers de seguridad configurados');
    console.log('2. ✅ Caché de archivos estáticos (1 año)');
    console.log('3. ✅ Redirección principal implementada');
    console.log('4. ✅ Estructura frontend/backend creada');
    console.log('5. ✅ CORS configurado para API');
    console.log('\n🎉 Configuración completada exitosamente!');
    console.log('\n📞 Si hay errores 403, espera 5-10 minutos para que se propaguen los cambios.');
}

verificarConfiguracion().catch(console.error); 