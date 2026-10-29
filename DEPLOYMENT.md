# Primer despliegue gratuito de Tagrivo

Estado preparado el 29 de octubre de 2026. Astro estático + Tailwind + React Islands; se conserva la implementación y la identidad aprobadas. Repositorio: https://github.com/JulioXC4/tagrivo.

Primera URL asignada y publicada: **https://tagrivo.pages.dev/**. El proyecto Pages se llama `tagrivo`, conectado a `main`. La prueba permanece sin indexación. No se ha comprado ni configurado un dominio propio.

## Configuración de Cloudflare Pages

En Cloudflare, abre **Workers & Pages → Create application → Continue to Pages → Import an existing Git repository**. Usa la integración Git desde el inicio; no elijas Direct Upload, Workers, una plantilla ni un servicio de pago.

1. Conecta GitHub. Si aparece la autorización, complétala personalmente, eligiendo **Only select repositories → JulioXC4/tagrivo**. No compartas contraseñas, códigos ni tokens con el chat.
2. Selecciona `tagrivo` y entra en la configuración del build.
3. Configura lo siguiente:

| Campo                | Valor                                                 |
| -------------------- | ----------------------------------------------------- |
| Rama de producción   | `main`                                                |
| Framework            | Astro                                                 |
| Directorio raíz      | raíz del repositorio; déjalo vacío                    |
| Comando de build     | `npm run verify`                                      |
| Directorio de salida | `dist`                                                |
| Node                 | `NODE_VERSION=24` (también está en `.nvmrc`)          |
| Indexación           | `SITE_INDEXING=disabled`                              |
| Dominio inicial      | deja `PUBLIC_SITE_URL` sin definir en el primer build |
| Amazon               | deja `PUBLIC_AMAZON_ASSOCIATE_TAG` sin definir        |

4. Usa esos valores tanto en **Production** como en **Preview**. No definas manualmente `CF_PAGES`, `CF_PAGES_URL`, `CF_PAGES_BRANCH` ni `CF_PAGES_COMMIT_SHA`: los proporciona Cloudflare.
5. Guarda y despliega usando el plan gratuito. Pages instala las dependencias del lockfile, ejecuta la auditoría, pruebas, TypeScript, build y verificación de salida. Un fallo detiene la publicación.
6. Copia la URL real que muestre Cloudflare. El nombre del proyecto determina el subdominio `pages.dev`; no se ha reservado una URL por anticipado. No hace falta comprar un dominio.
7. Después del primer despliegue, configura en **Production** `PUBLIC_SITE_URL` con el origen HTTPS estable que Cloudflare haya asignado, sin ruta ni parámetros. Vuelve a desplegar para que los canonical usen ese origen estable. Mantén `SITE_INDEXING=disabled`.

## URLs y protección frente a indexación

- La primera compilación en Pages toma su origen real de `CF_PAGES_URL`.
- En la rama `main`, `PUBLIC_SITE_URL` permite fijar el origen estable confirmado. No hay una suposición de propiedad sobre `tagrivo.com`.
- Las ramas distintas de `main` usan su propio `CF_PAGES_URL`, aunque hereden una URL de producción. Siempre son noindex, incluso si la indexación de producción se activa más adelante.
- Por defecto **todas las páginas** incluyen `noindex, nofollow` y el build genera la misma política como `X-Robots-Tag` en `_headers`. No se publica sitemap en esta etapa.
- `robots.txt` permite leer las páginas para que el robot pueda ver el noindex. Bloquearlas con `Disallow: /` impediría leer esa directiva. No se anuncia un sitemap en vistas previas.
- Noindex no es autenticación: la URL de prueba seguirá siendo pública. No alojes secretos ni documentos privados en `public/`.
- Cuando el contenido, permisos y dominio estén listos para producción, cambia solo **Production** a `SITE_INDEXING=enabled`, con `PUBLIC_SITE_URL` confirmado, y vuelve a compilar. Se generan sitemap y robots con ese origen y se retira la cabecera global noindex. Preview permanece sin indexación.

## Actualizaciones automáticas

Trabaja en una rama, ejecuta `npm run verify` y sube los cambios a GitHub. Cloudflare crea una vista previa para la rama. Revisa esa URL y fusiona a `main` para actualizar la URL estable. Cada push a `main` vuelve a verificar y publicar automáticamente.

```powershell
git switch -c codex/descripcion-del-cambio
npm ci
npm run verify
git add src tests scripts astro.config.mjs package.json package-lock.json
git commit -m "Describe el cambio"
git push -u origin codex/descripcion-del-cambio
```

Selecciona solo los archivos que correspondan al cambio. Para documentación o assets añade explícitamente sus rutas. En GitHub abre un pull request y fusiónalo después de revisar el despliegue de Cloudflare. Si una publicación falla, la anterior permanece activa. Puedes volver a un despliegue correcto desde el historial de Pages.

La verificación automática se ejecuta en Cloudflare para evitar builds duplicados en GitHub Actions. El workflow de GitHub queda disponible manualmente (`workflow_dispatch`, permiso de lectura y timeout de diez minutos); no es necesario ejecutarlo para desplegar. No incluye credenciales ni una segunda ruta de publicación. No se han contratado servicios ni activado recursos de pago. El plan Free documenta 500 builds/mes: consulta sus límites antes de aumentar frecuencia o alcance.

## Verificación de la primera URL

Con el origen estable real configurado y el build publicado, ejecuta `npm run check:deployment -- URL_REAL` desde el proyecto. Comprueba páginas principales, assets, canonical, noindex en HTML/cabeceras, robots y que las rutas privadas y el sitemap de prueba devuelvan 404. Esta comprobación no sustituye los flujos interactivos en navegador.

1. Abre home, Finder, comparación, calculadora, una guía y una ficha de producto.
2. Completa el Finder; prueba un caso sin coincidencias. Verifica cálculo y descarga CSV.
3. Cambia de tema, navega y comprueba móvil.
4. Inspecciona el HTML: canonical y Open Graph deben apuntar al origen real, nunca a un dominio supuesto. El HTML debe contener noindex.
5. Comprueba cabeceras y rutas con una petición real:

```powershell
# Sustituye el marcador por la URL REAL mostrada en Cloudflare.
$testOrigin = 'https://<nombre-real-del-proyecto>.pages.dev'
(Invoke-WebRequest -Uri $testOrigin).Headers['X-Robots-Tag']
Invoke-WebRequest -Uri ($testOrigin + '/robots.txt')
# Esta ruta debe responder 404 con la página personalizada, no con la home.
Invoke-WebRequest -Uri ($testOrigin + '/missing-page-for-test/') -SkipHttpErrorCheck
```

Las páginas se generan como `ruta/index.html`, con enlaces internos terminados en `/`. Pages normaliza las URLs HTML e índices; `404.html` evita el fallback SPA. No hay `_redirects` comodín ni redirecciones de dominio que puedan producir bucles. Las selecciones del comparador siguen en query strings.

## Qué se publica y qué se conserva localmente

Cloudflare publica **solo `dist`**, no la raíz ni `public` directamente. La salida contiene HTML, assets compilados, imágenes optimizadas, favicon, robots y `_headers`. El código fuente, tests, documentación, archivos de entorno y credenciales no se suben como assets del sitio. El repositorio GitHub es público por elección de su creador; sus archivos fuente y documentación sí son visibles allí.

`.gitignore` excluye `.env*` salvo el ejemplo vacío, `.dev.vars*`, `.wrangler`, claves, logs, dependencias, builds y capturas. Los originales/proveniencia de `design-assets/` y el informe local `design-qa.md` se conservan en el equipo, fuera de Git. Las fuentes e iconos se sirven localmente. No hay formularios de envío, base de datos ni credenciales de backend.

`npm run audit:release` revisa archivos elegibles para Git sin imprimir posibles secretos; `verify-build.mjs` revisa la salida. Son verificaciones acotadas, no una garantía universal contra cualquier secreto. Nunca añadas tokens a variables `PUBLIC_*`: sus valores pueden aparecer en el sitio.

## Revisión comercial pendiente

- Confirma derechos de publicación de las tres fotografías comerciales; sus enlaces de origen y créditos no constituyen una licencia. Se conserva la fotografía aprobada, pero el permiso sigue pendiente.
- Las especificaciones tienen fuentes y fecha; no se presentan como pruebas físicas. El detalle exacto de variante y versión del sistema operativo debe confirmarse antes de comprar. La documentación de Rollo indica una limitación de su driver para Windows ARM.
- Los precios no son ofertas en vivo. Brother conserva su referencia fechada; Rollo/MUNBYN siguen marcados sin precio actual verificado en el catálogo. Una cifra vista en una web no se convierte automáticamente en una oferta actual del recomendador.
- No hay enlaces de compra Amazon activos. Solo se activarán tras afiliación real, tag auténtico y ASIN verificado por variante. La declaración y `rel="sponsored nofollow noopener noreferrer"` ya están preparados.
- Antes de indexar, añade dominio y contacto reales, revisa prácticas de privacidad y resuelve los permisos editoriales. No actives analítica, píxeles ni formularios sin revisar de nuevo esa declaración.

## Fuentes oficiales de despliegue

- [Astro en Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Integración Git y despliegues automáticos](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Variables del build y CF_PAGES_URL](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Previews y noindex](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Rutas y 404](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Límites del plan gratuito](https://developers.cloudflare.com/pages/platform/limits/)
