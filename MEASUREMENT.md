# Google Analytics y Search Console

Actualización: 30/10/2026. El titular facilitó el flujo real **Tagrivo Website**, ID público **G-H0LNBZ0ZJ8**, y autorizó activar GA4 con consentimiento previo. Search Console ya está verificado. Esta edición mantiene una única integración central en `src/config/integrations.ts`; no se instala GTM ni otro tag paralelo.

## Configuración de Production

- `PUBLIC_GA4_MEASUREMENT_ID=G-H0LNBZ0ZJ8`
- `PUBLIC_ANALYTICS_ENABLED=true`
- `PUBLIC_ANALYTICS_POLICY_APPROVED=true`

Mantener estos flags desactivados y sin destino en Preview. Los datos legales auténticos permanecen en las variables privadas de Cloudflare; no están en este documento ni en Git. La aprobación de analítica no sustituye el consentimiento del lector.

En la propiedad GA4, desactivar Medición mejorada, Google Signals y personalización publicitaria; no conectar audiencias publicitarias ni User-ID. Establecer la conservación de eventos en 2 meses. Estos ajustes de la cuenta requieren confirmación del titular y no pueden verificarse solo desde el código.

## Consentimiento

El panel existente al pie de la página ofrece Allow analytics y Decline analytics. El enlace Analytics preferences permite revisar la elección. No hay solicitud a Google, cookies GA ni pings de consentimiento denegado antes de aceptar. El tema y todas las herramientas funcionan si se rechaza. Consentimiento básico conforme a la documentación de Google, sin nuevas dependencias.

La elección versionada y las cookies de esta integración duran hasta 30 días. No confundir su duración con la conservación de eventos en Google. Do Not Track y Global Privacy Control impiden iniciar medición. Revocar deshabilita el destino, elimina las cookies host de esta integración y recarga para retirar sus manejadores. Las solicitudes ya enviadas no pueden retractarse desde la web. El procedimiento de derechos del titular sigue siendo aplicable.

## Eventos y datos

| Evento | Momento | Parámetros propios |
| --- | --- | --- |
| `page_view` | Una vez al cargar cada documento, solo tras aceptar o con permiso vigente | Ruta canónica sin query ni fragmento y título público; referrer vacío |
| `amazon_affiliate_click` | Clic real en CTA Amazon validado | ID público de impresora, tipo affiliate y hostname Amazon; nunca URL completa |
| `product_outbound_click` | Clic en CTA de fabricante validado | ID público de impresora, tipo manufacturer y hostname permitido |
| `printer_finder_complete` | Envío válido del quinto paso | Solo ruta de página; sin respuestas, presupuesto, volumen ni resultados |
| `comparison_used` | Cambiar modelos/controles o compartir/imprimir comparación | Solo ruta de página; sin selecciones ni cotizaciones |

El uso de herramientas se cuenta una vez por documento y tipo de evento. Las acciones anteriores al consentimiento no se guardan ni se reenvían posteriormente. No se interpreta un clic como venta o comisión. GA4 puede añadir eventos técnicos propios como session_start o user_engagement después del consentimiento; no se afirma medición anónima ni ausencia de cookies tras aceptarlo.

Se omiten referrer, query strings y fragmentos; por tanto esta integración no promete atribución completa de campañas ni fuentes orgánicas. Search Console proporciona consultas y rendimiento de Google sin instalar un beacon en el sitio.

## Verificación

- Pruebas unitarias: permisos, rechazo, caducidad, señales de privacidad, destinos permitidos y eventos sin datos de herramientas.
- Build: un solo panel/destino auténtico, aceptar/rechazar disponibles y ningún script externo Google en el HTML inicial.
- Navegador: comprobar ausencia de solicitudes GA antes de aceptar y después de rechazar, una etiqueta tras aceptar, los eventos solicitados y revocación.
- En producción, una respuesta satisfactoria de collect verifica transporte, no demuestra por sí sola que el evento aparezca en un informe. El titular debe confirmar Realtime/DebugView en su cuenta; no se solicitan contraseñas ni se simulan compras o clics facturables de afiliados.
- En Search Console, enviar `https://tagrivo.pages.dev/sitemap-index.xml` cuando la comprobación pública confirme HTTP 200 y ausencia de noindex. La recepción del sitemap no garantiza indexación inmediata.

Fuentes oficiales: [consentimiento básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [eventos GA4](https://developers.google.com/analytics/devguides/collection/ga4/events), [configuración](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
