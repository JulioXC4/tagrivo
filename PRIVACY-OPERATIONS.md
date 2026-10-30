# Procedimiento de privacidad de Tagrivo

Establecido el 29 de octubre de 2026 por indicación del responsable. Tagrivo y JC Labs son marcas; el proyecto lo administra una persona natural desde Perú, para una audiencia principalmente estadounidense. Contacto: hello.jclabs@gmail.com. No se publican nombre legal, DNI ni domicilio particular sin autorización. Este procedimiento no certifica cumplimiento legal ni una primera revisión ya realizada.

## Inventario real de esta implementación

| Tratamiento          | Datos y finalidad                                                                                          | Situación                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Astro estático       | HTML y assets; no endpoint propio de recepción, cuentas ni base de datos                                   | Finder y calculadora operan en el navegador; CSV local                                                                                                                 |
| URLs de herramientas | Plataforma y modelos elegidos pueden figurar en URL, historial y solicitudes                               | No introducir datos de clientes; no afirmar que una URL queda solo en memoria                                                                                          |
| Tema                 | `tagrivo-theme` en localStorage                                                                            | Preferencia funcional, sin identificador publicitario                                                                                                                  |
| Cloudflare Pages     | IP, URL, navegador y datos técnicos de entrega/seguridad; estadísticas/logs según servicio y configuración | Sin acceso a ajustes privados: retención, acceso y funcionalidades activadas deben verificarse en el dashboard. No asumir cero datos ni aplicarles el plazo del correo |
| Gmail                | Remitente, destinatarios, contenido y adjuntos de correspondencia                                          | Solo responder consultas, correcciones y comunicaciones de Tagrivo; no vender datos ni usar consultas para publicidad sin autorización                                 |
| Amazon               | Enlace normal con Store ID público; Amazon recibe la visita solo si el lector lo sigue                     | Sin widgets, píxeles, imágenes remotas, APIs ni scripts de Amazon; sus políticas rigen en destino                                                                      |
| Search Console       | Propiedad verificada según el titular; informes de búsqueda                                                | No instala por sí sola un tag de analítica en la web                                                                                                                   |
| GA4 opcional         | Integración preparada para páginas y clics limitados                                                       | Apagada; no habilitar antes de revisar política, destino y consentimiento. No equivale a afirmar ausencia de registros de Cloudflare                                   |

## Retención de correspondencia: ejecución por el responsable

Regla aprobada: **12 meses naturales desde la última comunicación**, con revisión anterior ante una petición de eliminación y excepciones limitadas por obligaciones legales aplicables. No existe borrado automático ni una conexión de este proyecto a Gmail.

1. Al comenzar, separar la correspondencia de Tagrivo con una etiqueta Gmail `Tagrivo`, incluyendo recibidos, enviados y adjuntos. Este buzón también usa la marca JC Labs: no aplicar borrados a otros proyectos ni etiquetar todo el buzón indiscriminadamente.
2. Reservar una revisión el primer día hábil de cada mes mediante un recordatorio personal gratuito. Este documento establece el procedimiento; el responsable debe crear el recordatorio y ejecutar la primera revisión. No se ha programado ni enviado nada desde Codex.
3. Calcular la fecha de corte restando 12 meses a la fecha de revisión. Buscar candidatos dentro de la etiqueta, por ejemplo `in:anywhere label:Tagrivo before:AAAA/MM/DD`, sustituyendo la fecha. La búsqueda identifica mensajes antiguos, **no demuestra por sí sola que todo el hilo esté vencido**.
4. Abrir cada conversación candidata, incluidos los mensajes enviados, y comprobar la última comunicación. Si existe una respuesta posterior al corte, conservar el hilo. Revisar archivos adjuntos descargados y copias externas asociadas: borrar solo el correo no borra esas copias.
5. Revisar primero solicitudes de eliminación. Si no procede una excepción legal, retirar mensajes/adjuntos vencidos del buzón y sus copias controladas. Vaciar únicamente los elementos pertinentes de la papelera de Gmail cuando corresponda; no vaciar todo el buzón ni borrar en bloque sin revisar. No prometer borrado inmediato de respaldos del proveedor.
6. Si una obligación exige conservar información, registrar privadamente su fundamento, los elementos estrictamente necesarios y la siguiente revisión. No usar una excepción indefinida para retener toda la correspondencia.
7. Mantener un registro privado mínimo de fecha de revisión, fecha de corte, cantidad eliminada y excepciones/solicitudes atendidas. No guardar aquí cuerpos de correos, nombres de remitentes ni datos identificativos. **No subir ese registro a Git ni a public/**. No se ha creado un registro ficticio de ejecución.

## Solicitudes de derechos

- Canal: hello.jclabs@gmail.com; asunto sugerido `Tagrivo privacy request`. Revisar el buzón con frecuencia suficiente para cumplir los plazos, sin esperar la revisión mensual de retención.
- Registrar privadamente la recepción y el plazo legal; identificar la correspondencia y el derecho solicitado. Verificar identidad de forma proporcionada antes de revelar/borrar datos. No pedir documentos en público ni añadir un formulario de DNI al sitio.
- Tramitar información, acceso, rectificación, cancelación/supresión, oposición y portabilidad cuando corresponda; documentar la respuesta y las excepciones. No se cobra una tasa propia por atender solicitudes.
- Artículo 69 del reglamento: máximos de 8 días para información, 20 para acceso y 10 para otros derechos como rectificación, cancelación u oposición; aplicar las reglas legales de cómputo y de subsanación que correspondan, no prometer un plazo automático desde un script.

## Qué falta antes de finalizar Privacy y retirar noindex

1. **Identificar al responsable y una dirección válida de atención.** Artículo 18 de la Ley 29733 y artículo 6.1.1 del DS 016-2024-JUS exigen identidad y domicilio o dirección del responsable. Para una persona natural, una marca por sí sola no identifica a la persona. No he encontrado en estas disposiciones una dispensa general para un proyecto editorial de afiliados. No se exige publicar el DNI en la política por esos preceptos. Resolver si puede utilizarse una dirección de atención distinta del domicilio particular; no inventarla ni asumir que Gmail lo sustituye. Si no se desea publicar nombre legal, consultar a la ANPD cómo cumplir en este caso antes de declarar definitiva la política.
2. Verificar con la ANPD si el archivo organizado de correspondencia constituye un banco sujeto a inscripción y, si corresponde, inscribirlo. La ANPD informa que la inscripción es gratuita; no hace falta constituir una empresa para cumplir una obligación de persona natural. No se declara una exención por ser un sitio estático.
3. Revisar fundamento jurídico, deber de información/consentimiento aplicable a la correspondencia, proveedores e intercambios internacionales. Auditar ajustes reales de Cloudflare y Gmail (accesos, retención, respaldos y funcionalidades de medición); documentar lo que efectivamente se usa. El código no permite certificar configuraciones privadas.
4. Ejecutar la primera revisión del buzón y adoptar el control mensual. Finalizar el aviso con datos autorizados, conservar derechos/contacto accesibles y comprobar el resultado publicado. Noindex reduce indexación; **no sustituye el cumplimiento de privacidad de una web ya pública**.

No se recomienda comprar servicios ni contratar un delegado por defecto. Los pendientes deben resolverse según el tratamiento concreto; la ANPD tiene canales públicos de orientación.

## Fuentes oficiales consultadas

- [Ley 29733, artículo 18](https://www2.congreso.gob.pe/sicr/RedacActas/Actas.nsf/actas/05256D7B00750443052578C40066AB80).
- [DS 016-2024-JUS: artículos 6, 43 y 69](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf).
- [ANPD: inscripción gratuita de bancos de datos](https://www.gob.pe/institucion/anpd/pages/8060-inscribir-banco-de-datos-en-el-registro-nacional-de-proteccion-de-datos-personales).
- [Cloudflare: privacidad y tratamiento de usuarios finales](https://www.cloudflare.com/privacypolicy/).
- [Google: privacidad, incluidas comunicaciones y servicios](https://policies.google.com/privacy).
