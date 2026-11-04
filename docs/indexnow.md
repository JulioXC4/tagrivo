# IndexNow de producción

Implementación: 3 de noviembre de 2026. Dominio único: `https://tagrivo.pages.dev`. No cambia páginas, artículos, diseño, imágenes, GA4, consentimiento, enlaces Amazon, robots ni sitemap.

## Auditoría previa y proveedor

Ya existían una clave pública válida y un script manual. El 1 de noviembre se notificaron diez guías con HTTP 202. No había workflow automático, plugin SEO, CMS, Worker ni otro envío IndexNow en el repositorio. GitHub tampoco tenía ejecuciones de notificación.

[Cloudflare Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/) admite IndexNow, pero se habilita por separado; alojar el proyecto en Pages no acredita que esa función esté activa. No se tiene acceso a la configuración privada de Cloudflare ni a los informes privados de Bing desde el conector. El propietario informa que Bing solo muestra Get Started. Por tanto, no se ha identificado otro emisor automático operativo; no se afirma haber inspeccionado una configuración privada inaccesible.

Se reutiliza la clave, sin rotación ni segundo endpoint. El único emisor de este proyecto es `.github/workflows/indexnow.yml`. Si en el futuro se activa Crawler Hints u otro proveedor, establecer la variable de repositorio `INDEXNOW_EXTERNAL_PROVIDER=true` desactiva este emisor antes de enviar. El archivo de la clave es deliberadamente público; no es una credencial de Cloudflare, GitHub ni Amazon.

## Funcionamiento

1. Un push a `main` inicia GitHub Actions. No se ejecuta en pull requests, previews, forks ni staging. Un run manual permite un dry run.
2. Cloudflare compila y publica mediante su integración existente. La compilación añade `indexnow-manifest.json`: commit, hostname y hashes de las páginas indexables; nunca contiene sus textos ni los datos personales de Privacy. No envía solicitudes durante el build. Los builds no indexables/preview no generan el manifiesto.
3. El workflow espera como máximo unos ocho minutos al check **Cloudflare Pages**, emitido por la aplicación real `cloudflare-workers-and-pages`, y a que el manifiesto público corresponda exactamente al SHA de ese run. Si main avanzó o Cloudflare falla, omite el envío.
4. Compara el manifiesto publicado con el último estado guardado. Los hashes incluyen contenido de `<main>`, metadatos relevantes, datos estructurados, imágenes y destinos de enlaces. Ignoran CSS, clases y nombres de bundles JavaScript para evitar notificar cambios cosméticos. Una modificación exclusivamente del algoritmo de una herramienta sin cambiar su HTML no se detecta como actualización editorial; no se envían las 24 páginas por cambiar un bundle.
5. Verifica nuevamente las URL candidatas: HTML/canonical/hash correcto para altas y cambios; 404/410 o redirección interna para bajas. Una baja que todavía devuelve HTTP 200 se rechaza. Comprueba también el archivo de la clave y que main no haya avanzado durante esas verificaciones.
6. Envía un POST UTF-8 a `https://api.indexnow.org/indexnow` con `host=tagrivo.pages.dev`, `key`, `keyLocation` y solo `urlList` diferencial. No incluye parámetros, fragmentos, entradas de herramientas ni URL externas. Una notificación al endpoint global se comparte entre participantes; no se repite contra el endpoint Bing.
7. HTTP **200**: recibido correctamente. **202**: recibido, validación de la clave pendiente. Ninguno demuestra indexación. 400/403/422/429/5xx y fallos de red aparecen en el informe y no avanzan el estado de las URL. No hay reintentos POST en bucle ni tarea cron.
8. Conserva el nuevo estado solo tras aceptación y evita repetir contenido sin cambios. Aplica un mínimo de cinco minutos entre notificaciones de una misma URL, incluidos intentos fallidos o ambiguos; respeta un Retry-After mayor. Cambios posteriores dentro de ese intervalo quedan pendientes para la próxima ejecución; no se programa un envío artificial para mantener actividad.

Los errores IndexNow no bloquean el despliegue de Cloudflare: son procesos independientes y el paso de notificación registra una advertencia. Un error de los tests/infraestructura del workflow puede marcar su propia ejecución como fallida; tampoco cancela Cloudflare.

## Estado y primer envío controlado

`scripts/indexnow-baseline.json` conserva únicamente hashes de las 24 URL públicas observadas antes de la integración. Son una línea base para detectar cambios, no una afirmación de que todas se hayan enviado o indexado.

La única URL pendiente de arranque es `/privacy/`: su información de adquisición limitada y uso de calculadora cambió en el commit real `ba58ac7` del 1 de noviembre, y no figuraba en las diez guías notificadas. Esta prueba no modifica el texto legal ni fabrica una actualización. Se espera un único envío si producción conserva el contenido de la línea base; cualquier diferencia adicional debe verificarse antes de asumir que es cosmética. Después de aceptar ese envío, una ejecución sin cambios debe enviar cero URL.

## Historial técnico en GitHub

[Actions → IndexNow production](https://github.com/JulioXC4/tagrivo/actions/workflows/indexnow.yml). Abrir una ejecución y consultar su resumen: commit, URL y tipo de cambio, resultado HTTP o motivo de omisión. Los artifacts incluyen:

- `indexnow-state-v1`: `state.json`, utilizado para deduplicar el próximo deploy.
- `indexnow-report-RUN-ATTEMPT`: `report.json`, resultados y errores de esa ejecución.

Permisos del token efímero de GitHub: contents/checks/actions **read**. No se necesitan secretos ni tokens de Cloudflare. El workflow no hace commits de estado ni genera bucles de despliegue.

Los artifacts tienen retención de 90 días y se renuevan en cada ejecución. No borrarlos como limpieza rutinaria. Si expiran tras una inactividad prolongada, el workflow detecta ejecuciones anteriores y **se detiene sin reenviar todo**. Restaurar una copia del último state o preparar una nueva línea base revisada antes de reactivarlo. No se promete deduplicación exactamente una vez ante una caída entre recepción HTTP y guardado del artifact; no forzar reruns repetidos ante un timeout ambiguo.

Para un dry run local, usar `INDEXNOW_EXPECTED_COMMIT` con el SHA real de producción y ejecutar `npm run indexnow -- --dry-run`; no se permite `--submit` local porque el estado compartido se restaura en Actions. El antiguo envío manual de listas arbitrarias queda sustituido por este flujo para evitar un segundo emisor sin estado compartido.

## Historial en Bing Webmaster Tools

1. Abrir [Bing Webmaster Tools](https://www.bing.com/webmasters/) y seleccionar `https://tagrivo.pages.dev/`.
2. Abrir **IndexNow** en el menú. Si aparece Get Started, usarlo para entrar al proceso de configuración; conservar la clave ya publicada, no instalar otro plugin ni generar otra integración.
3. Cuando Bing haya procesado los envíos, consultar **IndexNow Insights → View Complete Report** (el nombre puede variar con el idioma). Revisar URL, hora, origen del envío y estados de rastreo/indexación. Ese informe puede tardar en reflejar una recepción HTTP.
4. Contrastar con **URL Inspection** para una URL concreta. No interpretar el historial de envíos ni un HTTP 200/202 como prueba de que Bing la indexó.

[Descripción oficial de IndexNow Insights](https://blogs.bing.com/webmaster/2024/3/Optimize-your-Impact-with-IndexNow-Insights/) · [Protocolo y respuestas](https://www.indexnow.org/documentation) · [Preguntas sobre bajas y cambios reales](https://www.indexnow.org/faq) · [Artifacts de Actions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts).

## Verificación real de la integración

- Commit funcional: `02f70b4`. Cloudflare publicó correctamente su manifiesto de producción con ese SHA, 24 fingerprints y `Cache-Control: no-store`.
- [Primera ejecución automática](https://github.com/JulioXC4/tagrivo/actions/runs/41768848742): pasó los 12 tests específicos, esperó producción, notificó **solo `https://tagrivo.pages.dev/privacy/`** y recibió **HTTP 200**. Hora registrada: 3 de noviembre de 2026, 22:44 (Perú). No se notificaron las 24 URL ni se fabricó contenido para probar.
- Estado y reporte guardados correctamente en artifacts. La aceptación HTTP no acredita que Bing haya rastreado o indexado Privacy.
- Verificación local completa: **49 pruebas aprobadas**, TypeScript sin errores/advertencias y **25 páginas compiladas**, incluida 404. `verify-build` valida inventario del manifiesto, canonical, clave pública, exclusión de previews y ausencia de valores legales en el JSON.
- Comprobación pública: 25 solicitudes de páginas, 9 recursos y 25 apariciones de enlaces comerciales verificados, junto con Google verification, robots, sitemap, consentimiento/configuración GA4 y rutas privadas 404. No se solicitaron enlaces de Amazon para inflar clics.
- No se alteraron archivos de `src/`, artículos, imágenes ni enlaces Amazon durante esta integración. Solo herramientas de build/notificación, configuración de cabecera del manifiesto, pruebas y documentación.
- Una segunda publicación exclusivamente documental sirve para verificar restauración de artifacts y cero notificaciones cuando el contenido público no cambió. Su ejecución queda visible en el historial de Actions.
