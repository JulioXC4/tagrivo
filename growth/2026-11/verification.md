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

El resultado de la comprobación pública posterior al push se documentará al terminar la entrega.
