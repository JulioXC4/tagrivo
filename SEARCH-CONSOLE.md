# Verificar Tagrivo en Google Search Console

Propiedad: **https://tagrivo.pages.dev/**. Método preparado: **etiqueta HTML**. La verificación de propiedad no activa la indexación. Mantener `SITE_INDEXING=disabled` y Privacy provisional durante este procedimiento.

## Pasos que realizas en tu cuenta

1. Abre [Google Search Console](https://search.google.com/search-console/welcome) e inicia sesión personalmente. Añade una propiedad de **prefijo de URL** con `https://tagrivo.pages.dev/`, incluido HTTPS. No elijas la propiedad de dominio `pages.dev`.
2. En los métodos disponibles, abre **Etiqueta HTML**. Google mostrará una etiqueta con `name="google-site-verification"` y un valor `content` específico de tu cuenta/propiedad.
3. Copia **solo el valor de content**, sin comillas ni el resto de la etiqueta. No se necesita contraseña, código de acceso, cookie de sesión ni credencial de API. El token de verificación aún no se ha proporcionado; no se ha inventado uno.
4. En Cloudflare, abre el proyecto Pages **tagrivo**, entra en su configuración de variables y selecciona el entorno **Production**. Añade `PUBLIC_GOOGLE_SITE_VERIFICATION` con ese valor auténtico como texto. Conserva `PUBLIC_SITE_URL=https://tagrivo.pages.dev` y `SITE_INDEXING=disabled`. No actives analítica para completar esta verificación.
5. Vuelve a desplegar Production mediante el flujo actual. Astro genera el meta tag en el head del HTML; la variable sin recompilar no modifica la página publicada.
6. Abre `https://tagrivo.pages.dev/` y consulta el código fuente. Busca `google-site-verification` y confirma que content coincide con el token de Google. No basta con introducirlo en un archivo local.
7. Regresa a Search Console y pulsa **Verificar**. Si Google no encuentra el token, comprueba URL/entorno, despliegue terminado y valor exacto. No retires noindex para intentar resolverlo.
8. Conserva la variable y la etiqueta en los siguientes despliegues: Google puede volver a comprobarlas. No sobrescribas tokens de otros propietarios sin revisar su acceso.

## Qué está implementado

`src/layouts/Base.astro` genera la etiqueta únicamente si recibe un token no vacío y con formato válido. `.env.example` documenta la variable, vacía por defecto. El código comprueba el formato, no acredita propiedad ni sustituye la confirmación en tu cuenta.

No se solicitó acceso a Google ni se configuró una cuenta de servicio. La web sigue sin sitemap durante esta fase de noindex. Después de completar derechos fotográficos e información legal y de autorizar explícitamente la indexación, se podrá habilitar el sitemap y enviarlo a Google siguiendo [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md).

Fuentes consultadas el 29/10/2026: [verificación de propiedad de Google](https://support.google.com/webmasters/answer/9008080?hl=en), [configuración de build de Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/). Verificar la propiedad no garantiza indexación, posición ni tráfico.
