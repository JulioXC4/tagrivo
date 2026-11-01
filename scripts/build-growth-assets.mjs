import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const folder = new URL('growth/2026-11/', root);
const temp = new URL('release-artifacts/growth/', root);
await mkdir(temp, { recursive: true });
await mkdir(new URL('pinterest/', folder), { recursive: true });
const pins = JSON.parse(await readFile(new URL('pins.json', folder), 'utf8'));
const display = (
  await readFile(
    new URL(
      'node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2',
      root,
    ),
  )
).toString('base64');
const body = (
  await readFile(
    new URL('node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2', root),
  )
).toString('base64');
const wifi =
  '<path d="M20 65 Q90 -3 160 65 M47 92 Q90 50 133 92 M73 118 Q90 101 107 118"/><circle cx="90" cy="142" r="7" fill="currentColor" stroke="none"/>';
const usb =
  '<path d="M90 150 V22 M90 83 L45 55 V28 M90 112 L135 85 V56 M76 40 L90 20 L104 40"/><circle cx="45" cy="20" r="8"/><rect x="127" y="39" width="16" height="16"/>';
const icon = (v) =>
  `<svg viewBox="0 0 180 180" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${v}</svg>`;
const art = {
  compare: `<div class="split"><div>${icon(wifi)}<h3>Wi-Fi + USB</h3><p>Rollo Wireless<br><b>X1040</b></p></div><div>${icon(usb)}<h3>Desktop USB</h3><p>MUNBYN ITPP941<br><b>USB · 203 dpi</b></p></div></div><div class="caption">Different connections. Different setup checks.</div>`,
  compat: `<div class="list">${[
    ['01', 'OS release', 'Check the current downloads.'],
    ['02', 'Processor', 'Intel / AMD / Apple silicon / ARM?'],
    ['03', 'Connection', 'USB or a documented network route?'],
    ['04', 'Print app', 'Can it send your shipping PDF?'],
  ]
    .map(
      ([n, t, s]) =>
        `<div><i>${n}</i><section><h3>${t}</h3><p>${s}</p></section><span>↗</span></div>`,
    )
    .join('')}</div>`,
  label: `<div class="pages"><div class="paper letter"><span>Letter page</span><div class="tiny">LABEL</div><small>8.5 × 11 in</small></div><div class="arrow">→</div><div class="paper proper"><span>4 × 6 page</span><div class="label-lines"><b>SHIP TO</b><hr/><hr/><hr/></div><small>Match PDF, settings & stock.</small></div></div><div class="caption">A page-size diagram — not a usable shipping label.</div>`,
  connect: `<div class="routes"><div><b>01</b><h3>USB</h3><p>Computer ─── Printer</p><small>One confirmed driver route.</small></div><div><b>02</b><h3>Wi-Fi</h3><p>Device ─── Network ─── Printer</p><small>Check the app and shared network.</small></div><div><b>03</b><h3>Bluetooth</h3><p>Setup ≠ printing</p><small>Confirm the exact protocol.</small></div></div>`,
  cost: `<div class="cost"><div><span>01</span><h3>Equipment</h3><i>+</i></div><div><span>02</span><h3>Label stock</h3><i>+</i></div><div><span>03</span><h3>Waste allowance</h3><i>=</i></div><strong>Your printing estimate</strong><p>Postage is a separate expense.</p></div>`,
  finder: `<div class="finder">${['Sales platform', 'Operating system', 'Order volume', 'Connection', 'Budget'].map((t, i) => `<div><i>0${i + 1}</i><h3>${t}</h3><span>${i === 4 ? '↗' : '↓'}</span></div>`).join('')}</div><div class="caption">Three researched models. Reasons you can review.</div>`,
};
for (const pin of pins) {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><style>
@font-face{font-family:Editorial;src:url(data:font/woff2;base64,${display})} @font-face{font-family:Body;src:url(data:font/woff2;base64,${body})}
*{box-sizing:border-box}html,body{margin:0;width:1000px;height:1500px;background:#f6f4ec;color:#173e31;font-family:Body}main{position:relative;padding:66px 72px;height:1500px;overflow:hidden}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b7c1b4;padding-bottom:28px}.brand{font-family:Editorial;font-size:56px;letter-spacing:-2px}.edition{font-size:19px;letter-spacing:3px}.category{font-size:20px;letter-spacing:3px;margin:48px 0 24px;color:#4e6357}h1{font:102px/.98 Editorial;letter-spacing:-3px;margin:0 0 30px;max-width:850px}.dek{font-size:30px;line-height:1.4;color:#4d6056;margin:0}.art{position:absolute;left:72px;right:72px;top:720px;height:500px;border-top:1px solid #b7c1b4;padding-top:36px}.caption{font-size:20px;color:#4d6056;margin-top:28px;text-align:center}h3,p{margin:0}h3{font-weight:400}footer{position:absolute;left:72px;right:72px;bottom:55px}.cta{background:#185642;color:#fff;padding:24px 28px;display:flex;justify-content:space-between;font-size:25px}.bottom{display:flex;justify-content:space-between;margin-top:28px;font-size:19px;color:#4d6056}.split{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:26px 0}.split>div{text-align:center;padding:0 20px}.split>div+div{border-left:1px solid #b7c1b4}.split svg{width:170px;height:170px;margin-bottom:20px}.split h3{font:38px Editorial;margin-bottom:18px}.split p{font-size:25px;line-height:1.5}.split b{font-weight:400;color:#4d6056}.list>div{display:flex;gap:26px;padding:23px 0;border-bottom:1px solid #cad0c5;align-items:center}.list i,.finder i{font-style:normal;font-size:20px;color:#64816d}.list h3{font:37px Editorial}.list p{font-size:23px;color:#4d6056;margin-top:5px}.list span{margin-left:auto;font-size:32px}.pages{display:flex;align-items:center;gap:25px;padding-top:22px}.paper{border:2px solid #78917d;background:#fffefa;position:relative;text-align:center}.letter{width:325px;height:385px}.paper>span{position:absolute;top:20px;left:0;right:0;font-size:23px}.paper small{position:absolute;bottom:18px;left:12px;right:12px;font-size:18px;color:#4d6056}.tiny{border:2px solid #185642;width:120px;height:78px;margin:118px auto;font-size:19px;padding-top:23px}.arrow{font-size:48px}.proper{width:365px;height:300px}.label-lines{text-align:left;padding:84px 40px 0;font-size:19px}.label-lines hr{border:0;border-top:3px solid #8b9f8c;margin:17px 0;width:80%}.label-lines hr:nth-child(3){width:55%}.routes>div{position:relative;padding:12px 0 20px 70px;margin-bottom:16px;border-bottom:1px solid #cad0c5}.routes b{position:absolute;left:0;top:18px;font-size:20px;font-weight:400;color:#64816d}.routes h3{font:37px Editorial;margin-bottom:6px}.routes p{font-size:25px;margin-bottom:6px}.routes small{font-size:20px;color:#4d6056}.cost>div{display:flex;align-items:center;padding:20px 0;gap:28px;border-bottom:1px solid #cad0c5}.cost span{font-size:20px;color:#64816d}.cost h3{font:42px Editorial}.cost i{font-style:normal;font-size:40px;margin-left:auto}.cost strong{display:block;font:43px Editorial;margin-top:28px}.cost p{font-size:24px;margin-top:12px;color:#4d6056}.finder>div{display:flex;align-items:center;gap:28px;padding:19px 0;border-bottom:1px solid #cad0c5}.finder h3{font:35px Editorial}.finder span{margin-left:auto;font-size:27px}
</style><main><header><span class="brand">tagrivo</span><span class="edition">FIELD NOTES / ${pin.id}</span></header><p class="category">${pin.category}</p><h1>${pin.headline}</h1><p class="dek">${pin.dek}</p><div class="art">${art[pin.type]}</div><footer><div class="cta"><span>${pin.cta}</span><span>↗</span></div><div class="bottom"><span>tagrivo.pages.dev</span><span>Print smarter. Ship better.</span></div></footer></main></html>`;
  await writeFile(new URL(`pin-${pin.id}.html`, temp), html);
}
const link = (pin) =>
  `https://tagrivo.pages.dev${pin.path}?utm_source=pinterest&utm_medium=social&utm_campaign=organic_2026_11&utm_content=pin_${pin.id}`;
await writeFile(
  new URL('pinterest.md', folder),
  '# Seis Pines listos para publicación manual\n\nPNG originales, 1000 × 1500, relación 2:3. Sin fotografías comerciales ni representaciones de impresoras reales. Todos los enlaces llevan a Tagrivo, donde se explica la afiliación. No publicados.\n\n' +
    pins
      .map(
        (p) =>
          `## ${p.id} · ${p.title}\n\n[Descargar PNG](pinterest/pin-${p.id}.png)\n\n**Título:** ${p.title}\n\n**Descripción:** ${p.description}\n\n**Destino:** ${link(p)}\n\n**Texto alternativo:** ${p.alt}\n\n`,
      )
      .join('') +
    'Crear tableros útiles como Shipping workflows, Label printer compatibility y Small-business shipping costs. No publicar las seis piezas de golpe. Revisar la vista previa móvil, mantener el destino correspondiente y evitar promesas de ahorro, estrellas o pruebas inexistentes.\n',
);
const tasks = [
  [
    'Medición',
    'Importar Tagrivo desde GSC a Bing; comprobar sitemap',
    'Bing',
    'Propiedad y sitemap aceptados, si el servicio los procesa',
  ],
  [
    'Distribución',
    'Publicar Pin 01: comparación exacta',
    'Pinterest',
    'Registrar URL del Pin, no estimar visitas',
  ],
  [
    'Calidad',
    'Revisar dudas/comentarios sin promocionar en comunidades',
    'Investigación',
    'Anotar una duda concreta y su fuente',
  ],
  [
    'Distribución',
    'Publicar Pin 02: Mac y Windows',
    'Pinterest',
    'Comprobar destino y texto alternativo',
  ],
  [
    'Video',
    'Grabar Short 01 con Finder y datos de ejemplo',
    'Producción local',
    'No mostrar paneles privados',
  ],
  [
    'Medición',
    'Registrar GSC, GA4 y Amazon con sus zonas horarias',
    'Tracker',
    'Usar datos disponibles; dejar el resto vacío',
  ],
  [
    'Revisión',
    'Revisar qué páginas reciben impresiones US',
    'GSC',
    'No interpretar un día como tendencia',
  ],
  [
    'Distribución',
    'Publicar Pin 03: tamaño Etsy 4 × 6',
    'Pinterest',
    'No prometer compatibilidad de todos los carriers',
  ],
  [
    'Distribución',
    'Publicar Short 01 si está revisado',
    'YouTube / Pinterest',
    'Usar campaña short_01',
  ],
  [
    'Comunidad',
    'Leer hilo semanal vigente de r/Etsy y reglas',
    'Reddit',
    'Publicar presentación solo si está permitida',
  ],
  [
    'Calidad',
    'Revisar consultas reales de ARM y Mac',
    'GSC / fuentes',
    'Anotar necesidades; no crear artículos por rutina',
  ],
  [
    'Distribución',
    'Publicar Pin 04: conexiones',
    'Pinterest',
    'Comprobar UTMs y página de llegada',
  ],
  [
    'Video',
    'Grabar Short 02: comparación de variantes',
    'Producción local',
    'Identificar renders editoriales en pantalla',
  ],
  [
    'Revisión',
    'Registrar semana 2 y errores de rastreo',
    'Tracker / Bing / GSC',
    'Comparar periodos completos si existen',
  ],
  [
    'Distribución',
    'Publicar Pin 05: costes',
    'Pinterest',
    'Valores de calculadora solo ilustrativos',
  ],
  [
    'Distribución',
    'Publicar Short 02 si está revisado',
    'YouTube / Pinterest',
    'Usar campaña short_02',
  ],
  [
    'Calidad',
    'Revisar clics y entradas a la comparación exacta',
    'GA4',
    'Solo medición consentida; no inferir ventas individuales',
  ],
  ['Distribución', 'Publicar Pin 06: Finder', 'Pinterest', 'No prometer un ganador universal'],
  [
    'Comunidad',
    'Ayudar con una respuesta propia si las reglas lo permiten',
    'Comunidad',
    'Sin enlaces de Tagrivo donde estén prohibidos',
  ],
  [
    'Video',
    'Grabar Short 03: calculadora',
    'Producción local',
    'Mostrar cotizaciones de ejemplo identificadas',
  ],
  [
    'Revisión',
    'Registrar semana 3 y preguntas de compra',
    'Tracker',
    'Distinguir clics GA4 y clics Amazon',
  ],
  [
    'Distribución',
    'Publicar Short 03 si está revisado',
    'YouTube / Pinterest',
    'Usar campaña short_03',
  ],
  [
    'Medición',
    'Comparar fuentes / páginas de entrada consentidas',
    'GA4',
    'No sumar usuarios y sesiones',
  ],
  [
    'SEO',
    'Revisar canonical y sitemap en Bing / GSC',
    'Search',
    'No repetir IndexNow para páginas sin cambios',
  ],
  [
    'Investigación',
    'Revisar Trends US con los mismos filtros',
    'Trends',
    'Registrar fecha y ventana; no inventar volumen',
  ],
  [
    'Conversión',
    'Revisar qué guías generan clics Amazon',
    'GA4 / Amazon',
    'No atribuir pedidos a un usuario individual',
  ],
  [
    'Calidad',
    'Volver a comprobar rutas y límites de compatibilidad prioritarios',
    'Fabricantes',
    'Cambiar contenido solo con evidencia nueva',
  ],
  [
    'Revisión',
    'Registrar semana 4 y ajustes de comisiones',
    'Tracker',
    'Conservar devoluciones y ajustes de Amazon',
  ],
  [
    'Decisión',
    'Elegir 2 páginas para siguiente iteración según datos',
    'GSC / GA4',
    'No decidir solo por posición o una visita',
  ],
  [
    'Cierre',
    'Consolidar 30 días y decidir el siguiente ciclo',
    'Tracker',
    'Sin objetivos inventados ni promesa de ingresos',
  ],
];
const rows = tasks.map((t, i) => ({
  day: i + 1,
  date: new Date(Date.UTC(2026, 10, 2 + i)).toISOString().slice(0, 10),
  category: t[0],
  action: t[1],
  channel: t[2],
  check: t[3],
}));
await writeFile(new URL('calendar.json', folder), JSON.stringify(rows, null, 2) + '\n');
const csv = [
  ['Dia', 'Fecha propuesta', 'Tipo', 'Accion', 'Canal', 'Comprobacion'],
  ...rows.map((r) => [r.day, r.date, r.category, r.action, r.channel, r.check]),
]
  .map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(','))
  .join('\r\n');
await writeFile(new URL('calendar.csv', folder), '\ufeff' + csv + '\r\n');
console.log('Six pin source files, copy and 30-day calendar prepared; no external publication.');
