import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function verifyPwa() {
  console.log('Verifying PWA assets on live server...');

  // 1. Verify manifest.json
  const manifestRes = await fetch(`${BASE_URL}/manifest.json`);
  assert.strictEqual(manifestRes.status, 200, 'manifest.json must return 200');
  const manifest = await manifestRes.json();
  assert.strictEqual(manifest.display, 'standalone');
  assert.strictEqual(manifest.theme_color, '#174C45');
  console.log('✅ manifest.json: 200 OK (standalone, #174C45)');

  // 2. Verify sw.js
  const swRes = await fetch(`${BASE_URL}/sw.js`);
  assert.strictEqual(swRes.status, 200, 'sw.js must return 200');
  const swText = await swRes.text();
  assert(swText.includes('carepath-ng-v1'), 'sw.js must contain cache name');
  console.log('✅ sw.js (ServiceWorker): 200 OK');

  // 3. Verify Icons
  const icon192 = await fetch(`${BASE_URL}/icons/icon-192x192.png`);
  assert.strictEqual(icon192.status, 200, 'icon-192x192.png must return 200');
  console.log('✅ icon-192x192.png: 200 OK');

  const icon512 = await fetch(`${BASE_URL}/icons/icon-512x512.png`);
  assert.strictEqual(icon512.status, 200, 'icon-512x512.png must return 200');
  console.log('✅ icon-512x512.png: 200 OK');

  const iconSvg = await fetch(`${BASE_URL}/icons/icon.svg`);
  assert.strictEqual(iconSvg.status, 200, 'icon.svg must return 200');
  console.log('✅ icon.svg: 200 OK');

  console.log('\n🎉 ALL PWA ASSETS ARE VERIFIED AND PROPERLY SERVED!');
}

verifyPwa();
