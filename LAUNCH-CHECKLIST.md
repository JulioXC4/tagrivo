# Tagrivo: checklist de lanzamiento SEO

**Estado autorizado (30/10/2026):** el titular aprobó el texto completo de Privacy y su publicación indexable, y confirmó las variables privadas en Cloudflare Production. Los datos personales se conservan fuera de Git y se muestran únicamente en Privacy. GA4 fue aplazado expresamente hasta disponer de Measurement ID; no bloquea SEO. Verificación local: 35 pruebas, TypeScript sin errores, 25 páginas estáticas y sitemap de 24 URLs. Publicar por main y comprobar la indexabilidad pública antes de comunicar el lanzamiento. Los apartados siguientes conservan el historial de preparación; sus antiguos pendientes de aprobación e identificación quedan sustituidos por esta autorización.

Preparado el 29 de octubre de 2026 (America/Lima). **Noindex se conserva.** Estas mejoras están preparadas en el proyecto; este trabajo no autoriza por sí mismo retirar noindex, activar medición ni presentar Privacy como definitiva. La marca pública es Tagrivo, proyecto editorial independiente; no se inventa una entidad legal.

**Actualización de afiliación:** el titular autorizó un lanzamiento indexable condicionado a no tener bloqueos importantes. Se integró su Store ID real `tagrivo-20` con tres ASIN verificados documentalmente y declaraciones visibles; el alta y las entrevistas fiscales fueron confirmadas por él. **El gate legal sigue abierto:** no se ha autorizado publicar identidad y dirección del responsable natural, exigidas por la normativa consultada. Por eso no se cambia `SITE_INDEXING=disabled`, no se genera sitemap público y Privacy sigue provisional. País, finalidad del correo y regla de 12 meses ya están definidos. Ver [PRIVACY-OPERATIONS.md](PRIVACY-OPERATIONS.md) y [MONETIZATION-PERU.md](MONETIZATION-PERU.md).

## 1. Completado automáticamente

Revisión del 30/10/2026: 30 pruebas aprobadas, TypeScript sin errores y 25 páginas estáticas compiladas. La comprobación pública cubre las 24 rutas editoriales y una URL de comparación con parámetros, contacto, política provisional, atributos y tag de los enlaces Amazon, archivo Google y noindex en HTML/HTTP. Se ensayó de forma aislada la salida con indexación habilitada: XML válido con 24 URLs canónicas, robots con sitemap, ausencia de noindex en páginas aprobadas y conservación exacta del archivo Google. El build desplegable y Cloudflare siguen noindex. La revisión visual/interactiva actual requiere habilitar el navegador en Work settings; no se da por realizada mediante pruebas HTTP.

Antes de la autorización final: resolver una forma admitida de identificación/dirección conforme a [PRIVACY-OPERATIONS.md](PRIVACY-OPERATIONS.md). El titular no dispone de local independiente y no autoriza publicar domicilio residencial ni DNI: no volver a solicitarlos ni contratar una oficina para resolverlo. Está preparada una consulta a la ANPD sobre dirección real de correspondencia autorizada gratuitamente, domicilio especial y datos mínimos públicos; no se ha enviado ni se declara ya válida esa alternativa. No retirar el gate de Privacy provisional para publicar el ensayo técnico. Una vez resuelto el aviso, presentar el texto final al titular, solicitar su autorización y cambiar `SITE_INDEXING=enabled` únicamente en Production; Preview debe seguir sin indexación. Después de recompilar, comprobar cabeceras/HTML, `/robots.txt`, `/sitemap-index.xml`, `/sitemap-0.xml` y el archivo Google desde el origen estable antes de enviar el sitemap a Search Console.

- [x] Desarrolladas las cinco guías del plan: Mac/Windows/ARM, iPhone/Android, tamaño de etiquetas Etsy, modelos Shopify y Rollo Wireless frente a ITPP941 USB.
- [x] Revisadas las cinco guías existentes. Ampliadas Rollo/Brother y la diferencia entre consumo de etiquetas y compra de paquetes; enlaces recíprocos a las nuevas guías.
- [x] Metadatos individuales, fecha real de publicación/modificación, autor editorial público y fuentes oficiales. Los artículos nuevos no llevan fechas antiguas ni pruebas físicas ficticias.
- [x] Catálogo común para fichas/Finder/Compare. Brother incorpora el límite Windows de Automatic Crop y su referencia fechada indica que el fabricante marcó falta de stock en la consulta.
- [x] Revisión en navegador de los tres enlaces que daban 403: Rollo producto, MUNBYN drivers y Shopify modelos cargaron el contenido esperado. El cliente automático puede seguir recibiendo protección anti-bots.
- [x] Origen canónico `https://tagrivo.pages.dev/`, sin canonical por combinación del comparador. Controles contra canonical duplicado, artículo duplicado exacto, anclas y enlaces locales rotos en el build.
- [x] Sitemap condicionado a indexación explícita y exclusión de 404; durante noindex no se genera ni se anuncia.
- [x] Meta opcional de Search Console preparada para un token auténtico.
- [x] Integrado el correo real facilitado por el responsable, `hello.jclabs@gmail.com`, en Contact, About, Privacy, metodología y disclosure. JC Labs figura como marca personal detrás del proyecto, sin presentarla como sociedad constituida.
- [x] Integración GA4 opcional preparada, apagada por defecto y con consentimiento previo. No se ha conectado una propiedad real ni se ha activado seguimiento. Ver [MEASUREMENT.md](MEASUREMENT.md).
- [x] Amazon centralizado en `src/data/amazon.ts` y `src/config/integrations.ts`: tag real y tres identidades verificadas, gate por producto y CTA común en Astro/React. Enlaces visibles con Paid link y atributos de patrocinio. Precios, disponibilidad y reseñas Amazon no se muestran ni se consultan mediante scraping.
- [x] Fotografías oficiales y serie abstracta retiradas del build. La shortlist usa renders editoriales generados desde referencias de los modelos, con aviso de IA y posibles diferencias. Procedencia documentada en [ASSET-SOURCES.md](ASSET-SOURCES.md).

El build y las pruebas se ejecutan antes de la entrega; su resultado concreto se indica en el resumen de QA. Un JSON-LD válido no garantiza resultados enriquecidos, ni una detección de duplicados exactos certifica originalidad en toda la web.

Verificación de esta edición: **25 pruebas aprobadas, TypeScript/Astro sin errores, advertencias ni hints en 46 archivos y 25 páginas estáticas compiladas**. Se comprobaron las cinco guías nuevas en móvil, una en escritorio, la búsqueda de diez guías y flujos de Finder, Compare y Calculator. La edición se consolida para publicación en Cloudflare manteniendo noindex; esta revisión no autoriza indexación.

## 2. Tareas personales del responsable

### A. Resolver los bloqueos de contenido y confianza

- [ ] Definir el responsable legal/del tratamiento y revisar qué información corresponde publicar según las prácticas y jurisdicción aplicables. No presentar Tagrivo como empresa registrada ni rellenar identidad/dirección ficticias.
- [ ] Revisar Privacy y declaraciones comerciales; sustituir el aviso provisional por el texto aprobado únicamente cuando los datos estén disponibles. Revisar también About y Contact.
- [ ] Revisar los derechos de las referencias y las variaciones editoriales generadas antes de autorizar el lanzamiento indexable. Generar una versión de estudio no acredita por sí solo licencia o autorización. Las fotos originales permanecen fuera del build; no se han solicitado permisos.
- [ ] Aprobar las diez guías y las limitaciones de producto. Confirmar precio/SKU exacto de MUNBYN USB y los flujos que se quieran describir como probados; de lo contrario conservar las cautelas documentales.

### B. Search Console ya verificado por el titular; conservar prueba y noindex

El titular confirma la propiedad verificada. El archivo original `google7bb345f95d638147.html` se conserva byte por byte en la raíz; no hace falta repetir el alta ni compartir credenciales. Los pasos siguientes se conservan como alternativa de recuperación; no ejecutarlos si la propiedad ya está verificada.

1. En tu cuenta de Google, abre [Search Console](https://search.google.com/search-console/welcome) y crea una propiedad de **prefijo de URL** `https://tagrivo.pages.dev/`. No uses una propiedad DNS para el dominio padre `pages.dev`, que no controlas.
2. Elige verificación por etiqueta HTML. Copia únicamente el token real a `PUBLIC_GOOGLE_SITE_VERIFICATION` de Cloudflare Pages **Production**; no una contraseña, JSON de cuenta de servicio ni el meta tag completo.
3. Publica el build con esa variable. Comprueba el meta tag en la URL estable y pulsa Verificar en Search Console. Mantén `SITE_INDEXING=disabled` durante este proceso.
4. Revisa una guía y una ficha con [Rich Results Test](https://search.google.com/test/rich-results). No inventes reviews, ratings u ofertas para conseguir elegibilidad de Product. La propiedad de Google y la indexación son pasos distintos.

Fuente: [verificación de propiedad](https://support.google.com/webmasters/answer/9008080?hl=en). Ningún token fue proporcionado o inventado aquí.

Procedimiento paso a paso y comprobación del HTML publicado: [SEARCH-CONSOLE.md](SEARCH-CONSOLE.md).

### C. Retirar noindex solo después de A y de tu autorización expresa

1. Publicar la versión aprobada desde el flujo GitHub habitual y comprobar las diez guías, políticas finales y fotos autorizadas en el origen canónico elegido. Pages.dev sirve; no necesitas comprar dominio.
2. En Cloudflare Pages, cambiar **solo Production** a `SITE_INDEXING=enabled`, conservando `PUBLIC_SITE_URL=https://tagrivo.pages.dev`, y volver a desplegar. No cambiar Preview. Las ramas de vista previa seguirán noindex por código.
3. Confirmar en páginas representativas que han desaparecido tanto el meta robots noindex como la cabecera global X-Robots-Tag noindex. Un cambio de variable sin recompilar no cambia las páginas estáticas ya servidas.
4. Comprobar robots, sitemap-index.xml y sitemap-0.xml: solo URLs 200/canónicas y ninguna 404. El build comprueba canonical/origen y exclusión de errores. No introducir `Disallow: /`: Google debe poder leer las directivas.
5. Enviar `https://tagrivo.pages.dev/sitemap-index.xml` a Search Console. Inspeccionar home, guía pilar, una guía de compatibilidad y comparaciones; solicitar indexación de esas páginas prioritarias.
6. Revisar estado de indexación y datos de rendimiento filtrados por Estados Unidos. Resolver exclusiones o errores reales antes de añadir más artículos. No existe garantía de plazo, posición o tráfico.

**No se ejecutó ninguno de estos cambios de indexación.** La documentación de [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) y [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) explica sus límites.

### D. Medición y monetización, cuando proceda

- [ ] Crear una propiedad/stream GA4 real, revisar privacidad y seguir [MEASUREMENT.md](MEASUREMENT.md), incluidos consentimiento, rechazo, revocación, DNT/GPC y recepción efectiva de eventos. Se puede lanzar SEO sin activar GA4; no es requisito para que Google indexe.
- [x] Alta y entrevistas fiscales confirmadas por el titular; tag auténtico y tres ASIN verificados documentalmente integrados, con avisos y atributos seguros. No se afirma aprobación final de Amazon.
- [ ] Completar método de cobro, confirmar el sitio declarado y seguir el plazo de revisión desde la cuenta, según [MONETIZATION-PERU.md](MONETIZATION-PERU.md). No compartir datos privados en el chat ni en el repositorio.

Ni GA4 ni la afiliación son condiciones técnicas para recibir tráfico orgánico. Primero derechos, información real y contenido aprobado; después indexación autorizada y seguimiento con datos reales.
