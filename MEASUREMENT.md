# Google y medición: configuración preparada, todavía apagada

29/10/2026. Search Console no necesita un beacon de analítica. Su verificación HTML está preparada en Base y usa únicamente `PUBLIC_GOOGLE_SITE_VERIFICATION`. No se ha verificado una propiedad desde esta sesión. Ver [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md).

## Activación futura de GA4

No hay identificador real ni recopilación activa. Los valores de `.env.example` mantienen `PUBLIC_ANALYTICS_ENABLED=false`, `PUBLIC_ANALYTICS_POLICY_APPROVED=false` y `PUBLIC_GA4_MEASUREMENT_ID` vacío. `src/config/integrations.ts` es el punto de configuración; `src/lib/analytics.ts` valida y minimiza los datos.

Antes de activar:

1. Crear una propiedad GA4 y un stream web con el origen público real. Introducir su ID auténtico en Cloudflare Production; el código valida formato, no propiedad ni recepción.
2. Revisar/terminar Privacy con responsable, contacto, base aplicable, terceros, retención, transferencias y ejercicio de derechos. La variable de aprobación no sustituye esa revisión. Privacy permanece provisional en la edición actual.
3. En el stream, desactivar medición mejorada automática —incluidos clics salientes, formularios e historial— para utilizar únicamente los eventos explícitos de esta integración. No instalar GTM, otro gtag o un segundo beacon en paralelo. Mantener Google Signals y personalización desactivados, sin enlaces de publicidad ni User-ID, y elegir una retención mínima adecuada en la cuenta.
4. Solo cuando el punto 2 esté resuelto, establecer `PUBLIC_ANALYTICS_POLICY_APPROVED=true` y `PUBLIC_ANALYTICS_ENABLED=true`; recompilar. Activar sin ID o sin aprobación causa error de configuración. No cambia noindex.
5. Los controles opcionales se muestran al pie de la página; no hay carga de Google hasta que el lector acepta. Analytics preferences permite volver a abrirlos. Si se declina, las herramientas siguen funcionando. No se añadió un banner al diseño actual: con la integración apagada no aparece ningún control ni destino Google.

## Contrato de datos

| Evento                   | Datos explícitos                                                     | Exclusiones                                                                 |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `page_view`              | URL con origen/ruta y título público                                 | Query strings, fragmentos y referrer vacío; sin respuestas del Finder       |
| `product_outbound_click` | ID público de impresora, manufacturer/affiliate y hostname permitido | URL completa, tag, cotizaciones, presupuesto, pedidos, correos y respuestas |

Los enlaces medibles son los CTA externos identificados de las fichas, no todos los enlaces de fuentes. El código comprueba modelo y destino permitido. No se declara venta o ingreso a partir de un clic. No hay campos financieros ni resultados individuales de las herramientas en los eventos.

Omitir referrer y parámetros también limita la atribución: esta integración no promete identificar campañas UTM ni clasificar todas las visitas orgánicas en GA4. Search Console será la fuente para consultas y rendimiento de búsqueda. Los clics de producto sirven para estudiar páginas/modelos, no para atribuir por sí solos ingresos a una keyword.

El modo es de consentimiento básico: Google no se carga antes de aceptación, tampoco para enviar pings de consentimiento denegado. Después de aceptar, GA4 procesa peticiones técnicas y puede usar cookies; **no se afirma anonimato ni ausencia de cookies**. Consentimiento local y cookies de esta implementación se limitan a 30 días. Do Not Track y Global Privacy Control impiden iniciar medición. Revocar deshabilita el destino, limpia las cookies host `_ga`/`_ga_<stream>` de esta integración y recarga para descargar sus manejadores. No revierte solicitudes ya enviadas ni borra datos en Google; el operador necesita un procedimiento real de derechos.

Si localStorage falla, la decisión dura solo esa pestaña. Un bloqueo de Google no debe romper navegación, Finder, Compare o Calculator. Las métricas representan a lectores que permiten medición; no son un censo completo del tráfico. Los controles al pie requieren una elección explícita, por lo que no se presupone una tasa alta de consentimiento.

## Prueba obligatoria con la propiedad real

- Sin preferencia: no cargar gtag ni hacer solicitudes de colección. Rechazar: lo mismo, y sitio funcional.
- Aceptar: una vista de página en Realtime/DebugView y un clic a fabricante con el ID/host correctos. Inspeccionar la carga de red para comprobar que `page_location` no contiene parámetros y que no hay eventos duplicados de medición mejorada.
- Revocar y navegar: no más colección de esta integración; comprobar cookies y nueva carga. Verificar también otra pestaña, consentimiento expirado, DNT/GPC y almacenamiento bloqueado.
- Mantener todos los datos de prueba sin información privada; no configurar un ID inventado para aparentar recepción. La comprobación de recepción sigue pendiente porque no se proporcionó una propiedad real.

Fuentes: [consentimiento básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [privacidad y desactivación](https://developers.google.com/tag-platform/security/guides/privacy), [configuración GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config). Cloudflare Web Analytics puede medir visitas/rendimiento, pero sus [FAQ](https://developers.cloudflare.com/web-analytics/faq/) no ofrecen eventos personalizados; no se usa para simular clics afiliados.
