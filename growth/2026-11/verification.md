# Verificación de la entrega de crecimiento

Fecha: 1 de noviembre de 2026. Sin rediseño, sin nuevos artículos, sin cambios del catálogo ni de los renders aprobados. Sin dependencias añadidas.

## Comprobaciones locales terminadas

- `npm run verify`: auditoría de archivos elegibles para Git, **39 pruebas aprobadas**, TypeScript sin errores/advertencias, **25 rutas HTML compiladas** (incluye 404), sitemap de producción generado y verificación de HTML/recursos/enlaces.
- `npm run check:deployment -- http://localhost:4322`: 25 solicitudes de páginas, 9 recursos y 25 apariciones de enlaces pagados. Archivos privados de prueba devuelven 404. No se solicitaron URLs de Amazon ni se hicieron compras/clics de afiliación reales para inflar métricas.
- Navegador: 18 rutas en móvil 390 px, claro y oscuro; comparador adicional en 820 y 1440 px. 38 comprobaciones sin desbordamiento del documento, imágenes rotas, H1 duplicado ni errores JavaScript observados. El comparador conserva su contenedor de desplazamiento horizontal.
- Flujos: validación del Finder sin elegir opción; cinco pasos y resultados; selección de tres modelos en Compare; entradas válidas/negativas de calculadora. Sin modificar la lógica de recomendación o cálculo.
- Analítica con biblioteca externa sustituida por un stub de QA local: antes de aceptar, cero etiquetas/eventos; rechazar no carga Google; aceptar crea una etiqueta y un page_view. Calculadora, comparación y Finder generan una señal por documento. Campaña pública permitida preservada; query de prueba y fragmento excluidos. Las acciones anteriores al consentimiento no se reproducen. Esto comprueba la aplicación, no un informe privado de GA4.
- Pruebas de adquisición rechazan campañas arbitrarias y referidores con credenciales; solo aceptan origen HTTPS externo y las etiquetas públicas incluidas en el paquete. DNT/GPC y expiración siguen cubiertos por pruebas.
- Clic comercial probado con navegación a Amazon cancelada: solo `printer_id`, `link_kind` y `destination_host` en el evento. Revocar consentimiento recarga el documento y deja cero etiquetas Google.
- XLSX: CTR diario y total ponderado comprobados con datos sintéticos; también se comprobó el caso de un informe incompleto. Datos sintéticos eliminados, métricas reales vacías; cero errores de fórmula encontrados por el motor de generación. Ambas hojas renderizadas e inspeccionadas. No se afirma validación con el motor de Microsoft Excel.
- Seis Pines PNG 1000 × 1500 revisados visualmente, con textos de destino/alt y enlaces correspondientes. No publicados externamente.

## Inventario auditado

| Grupo | Resultado y alcance |
|---|---|
| Diez guías | Una H1 por documento, subtítulos pertinentes, respuestas directas y enlaces contextuales. Publicaciones originales conservadas; actualización 1-nov solo tras editar. No páginas duplicadas creadas. |
| Tres fichas | Títulos precisan variante; especificaciones, ventajas/limitaciones, fuentes y avisos de renders preservados. No precios, puntuaciones ni ofertas nuevos. |
| Finder | Cinco pasos, validaciones y enlaces pagados preservados. Categorías amplias de OS no certifican CPU/versión. |
| Compare | Selección de 2–3 modelos, duplicados excluidos y costes por cotizaciones propias preservados. |
| Cost Calculator | Fórmula y límites preservados; se añade únicamente señal de uso válida, sin valores enviados. |
| SEO | Canonical limpio, metadatos únicos y OG preservados. Article/Product más BreadcrumbList de guías/fichas; no Review/Offer/FAQ ficticios. |
| Afiliación | `tagrivo-20`, ASIN documentados, etiqueta Paid link y `sponsored nofollow noopener noreferrer` preservados. Sin redirecciones comerciales nuevas. |
| Privacidad | Fecha y descripción de adquisición limitada/calculadora actualizadas. Datos legales continúan entrando por entorno de compilación, sin añadirse al repositorio. |

## Alcances que requieren datos externos

GSC/Bing/GA4/Amazon no están autenticados en esta sesión. No se afirma recepción en Realtime/DebugView ni se rellenan métricas privadas. El propietario debe comprobar los informes y la importación en Bing. La indexación y el posicionamiento no están garantizados por sitemap ni IndexNow.

## Producción comprobada

- Commit funcional `ba58ac7` publicado en main; GitHub informa **Cloudflare Pages / Deployed successfully**. La documentación de comprobación se consolida en un commit posterior sin cambios de aplicación.
- `npm run check:deployment -- https://tagrivo.pages.dev/`: las 25 solicitudes de páginas y los 9 recursos pasan. Canonical de producción, robots, sitemap, archivo Google, política de indexación, contacto y enlaces pagados preservados. Noindex ausente en páginas indexables y cabeceras; 404 conserva su tratamiento propio.
- Navegador público: Finder completado, comparación con tres modelos y calculadora funcionando. Señales sin respuestas/valores; enlaces pagados conservan `tagrivo-20`.
- GA4 real: cero etiquetas antes de consentir; tras aceptar se cargó una etiqueta y el endpoint `www.google-analytics.com/g/collect` respondió **HTTP 204** a `page_view`. Esto acredita envío/recepción HTTP, no inspección de Realtime privado. Los eventos de herramientas posteriores se interceptaron en QA para no introducir actividad sintética en los informes de Google. Se verificaron sus nombres y payloads en producción.
- Comprobación visual pública a 390 px, sin limitación de CPU/red y con caché del navegador: home LCP observado 188 ms / CLS 0,0012; comparación editorial 148 ms / 0,000023; guía Mac/Windows 132 ms / 0,000023; costes 204 ms / 0,000023. Son muestras de laboratorio de esta sesión, **no Core Web Vitals de campo, percentil 75 ni una puntuación Lighthouse**, y no representan conexiones móviles lentas. Sin desbordamiento ni imágenes rotas en esas visitas.
- IndexNow: archivo de verificación publicado y comprobado HTTP 200; una sola solicitud de las diez guías realmente modificadas recibió **HTTP 202** (recibida, validación de clave pendiente). No se afirma indexación ni validación definitiva. Estado de hashes conservado localmente; no hay reenvíos programados.
- Fuentes externas: 21 destinos solicitados y 5 URLs Amazon deliberadamente excluidas. Tres devuelven 403 y muestran desafío de seguridad también en navegador: [tabla Shopify](https://help.shopify.com/en/manual/fulfillment/fulfilling-orders/shipping-labels/label-printers/supported-printers), [drivers MUNBYN](https://support.munbyn.com/hc/en-us/articles/6092502480787-Printer-Drivers-SDK-Download), [producto Rollo](https://www.rollo.com/product/rollo-wireless-printer/). No son 404 comprobados ni se presentan como enlaces rotos. Revisar en navegador humano si es necesario; no se intentó evadir el desafío. El contenido de la tabla Shopify también fue accesible mediante la fuente oficial recuperada por búsqueda.

Bing sigue pendiente de importación autenticada por el propietario. No se necesita cambiar variables de producción ni retirar protecciones globales de Cloudflare para aplicar esta entrega.
