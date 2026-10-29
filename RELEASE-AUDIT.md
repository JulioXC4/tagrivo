# Auditoría previa al primer despliegue

Fecha de revisión: 29 de octubre de 2026. Alcance: preparación de Astro estático para Cloudflare Pages con GitHub; sin cambios visuales ni reconstrucción de funcionalidades.

## Primera publicación realizada

Repositorio `JulioXC4/tagrivo`, rama `main`, proyecto Pages `tagrivo`. Primera publicación completada con confirmación expresa del usuario: **https://tagrivo.pages.dev/**. Astro, `npm run verify`, salida `dist`, Node 24 y `SITE_INDEXING=disabled`. Acceso GitHub autorizado personalmente por el usuario. El origen estable `PUBLIC_SITE_URL=https://tagrivo.pages.dev` se configuró después de que Cloudflare asignara la URL.

Verificación local final: **17 pruebas, 0 errores/advertencias/hints de Astro/TypeScript, 19 páginas**. Se probaron también los builds simulados de Preview (siempre noindex) y de producción con indexación explícita (sitemap correcto); la salida final local vuelve a noindex. La respuesta pública inicial confirmó 9 páginas HTTP 200, 7 recursos accesibles, noindex en HTML y HTTP y 404 para rutas privadas/sitemap. El primer canonical apuntaba al hash del despliegue: se fijó la variable estable para corregirlo en la actualización automática. El comando `npm run check:deployment -- https://tagrivo.pages.dev` permite repetir esa comprobación completa tras cada publicación de prueba.

## Configuración y publicación

- Se mantiene `output: static`, rutas con `/` final, contenido prerenderizado y React Islands solo para herramientas.
- `dist` es la única carpeta de publicación. No hay adapter SSR, Functions, base de datos ni servicio de pago.
- Node 24 en `.nvmrc` y engines. Lockfile preservado sin cambios de dependencias.
- Origen calculado con las variables reales del build; eliminado el dominio de marca supuesto. Preview usa su propia URL; producción admite el origen estable confirmado después del primer despliegue.
- Noindex por defecto en HTML y HTTP, sitemap omitido hasta activación explícita. `robots.txt` deja leer el noindex. Noindex no protege datos privados.
- Cabeceras de seguridad conservadas y assets compilados con caché immutable. Se mantiene el 404 estático; no hay fallback SPA ni redirects de dominio. Los redirects normales de HTML e índices los sirve Pages.
- Validación automática mediante el comando `npm run verify` de Cloudflare. Workflow de GitHub manual, lectura únicamente, para evitar ejecuciones duplicadas.

## Contenido y enlaces externos

Se revisaron las páginas oficiales de los tres fabricantes, documentación de configuración de Rollo, tabla de drivers de MUNBYN y guía de AirPrint de Brother. Los datos siguen diferenciando variantes USB/Bluetooth/AirPrint; las cifras de velocidad son del fabricante, no pruebas físicas. Brother conserva un precio fechado, no una oferta actual. No se actualizaron indiscriminadamente fechas de investigación ni se inventaron nuevas compatibilidades.

- [Rollo X1040](https://www.rollo.com/product/rollo-wireless-printer/): documentación de 203 dpi, Wi-Fi/AirPrint, USB y 150 mm/s disponible. El precio observado en esta revisión no se añadió como oferta en vivo al catálogo.
- [Configuración de Rollo](https://support.rollo.com/support/solutions/articles/29000039959): Bluetooth para configuración; Android 4×6 en el flujo estándar. El driver de Windows ARM tiene restricciones: confirmar el equipo exacto antes de comprar.
- [MUNBYN ITPP941](https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/): tabla específica USB de 203 dpi, 150 mm/s y 108 mm de ancho de impresión. No mezclar con variantes Bluetooth/AirPrint.
- [Drivers MUNBYN](https://support.munbyn.com/hc/en-us/articles/6092502480787-Printer-Drivers-SDK-Download): tabla Windows/Mac/Chrome disponible; requiere verificar versión y variante.
- [Brother QL-1110NWB](https://www.brother-usa.com/p/desktop-label-printers/QL1110NWB): la URL antigua redirige correctamente a esta página oficial; 300 dpi, cutter, DK y conexiones documentadas. Referencia de $334.99 visible; sigue siendo una referencia fechada.
- [AirPrint de Brother](https://help.brother-usa.com/app/answers/detail/a_id/155109/~/airprint-driver-and-cups-driver-compatibility): el driver y protocolo no son equivalentes; el protocolo usa red cableada/inalámbrica.

El comprobador automático hizo peticiones a los **12 enlaces externos únicos** publicados: **10 respondieron 200** (uno tras redirección) y **2 respondieron 403 al cliente automatizado**: página comercial de Rollo y drivers MUNBYN. Su contenido fue accesible mediante la herramienta web; quedan identificados para revisión humana en navegador, no se declaran enlaces rotos ni se eluden sus protecciones. Los enlaces a Amazon/FTC/Cloudflare son informativos, no compras afiliadas.

## Imágenes y afiliación

- Cuatro imágenes locales optimizadas: un hero editorial original y tres fotografías reales de fabricantes; sin hotlinking ni imágenes extraídas de Amazon. Los archivos locales y referencias de HTML se verifican en el build.
- Los derechos de republicación de las fotografías comerciales siguen pendientes de confirmación del operador. Un crédito o una URL accesible no constituye licencia. Esto requiere resolución antes de dar por validado el lanzamiento comercial.
- Se incorporan avisos de licencia reales de fuentes, iconos y runtime en `public/third-party-notices.txt`; no otorgan derechos sobre fotos comerciales.
- No hay ASIN ni tag de Amazon configurados. No se emiten enlaces Amazon de compra ni se afirma afiliación activa. La activación futura exige datos auténticos y mantiene etiquetas/disclosure.

## Privacidad y archivos

- El repositorio proporcionado por el usuario es público. No se modificó su visibilidad.
- La auditoría revisa archivos elegibles para Git, claves conocidas, nombres sensibles y rutas personales; no imprime posibles secretos. Se revisa también la salida estática para excluir archivos de entorno, código fuente, source maps, claves y capturas.
- Eliminadas referencias a rutas personales del material que se subirá a Git. Se mantienen localmente, fuera de Git, las capturas e imágenes originales de diseño. `.env`, `.dev.vars`, `.wrangler`, claves, logs, dependencias y builds están ignorados.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilidades conocidas** en la consulta realizada. No se actualizaron paquetes para este despliegue.
- Este análisis de patrones es acotado; no garantiza detectar cualquier clase de secreto. No hay credenciales de Cloudflare/GitHub guardadas por el proyecto.

## Pendientes para validar producción

Resolver derechos fotográficos, contacto del operador, precios actuales y soporte de versiones exactas; registrar afiliación real antes de activar Amazon. Mantener noindex hasta completar esa validación. No se certifican Core Web Vitals de campo ni conformidad WCAG completa a partir de un build local.

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para los pasos, variables, despliegues automáticos y rollback.
