# Materialización de capas de producto y requisitos

Este procedimiento lo aplican `project-discovery` y `reverse-engineering` después de que su agente sintetizador deje una propuesta en `$STAGING_DIR`. El staging permanece en `.tmp/<skill>/` y no se versiona.

## Inventario y asignación de IDs

1. Reunir `requirements/functional/FR-*.md` y `requirements/non-functional/NFR-*.md`. El ID es el prefijo del nombre y el título es `title` del frontmatter.
2. Incluir cada encabezado `### FR-NNN` o `### NFR-NNN` de `requirements/srs-*.md`. Por cada SRS, emitir: `⚠️ Existe <srs> y se escribirán requisitos fragmentados; revisa la disposición (STORY-118)`.
3. Construir `$REQUIREMENTS_INVENTORY` como `ID — título — ruta`.
4. Calcular `$NEXT_FR` y `$NEXT_NFR` como máximo numérico + 1; si no existe ninguno, `001`. Usar tres dígitos hasta 999 y cuatro desde 1000. Los huecos no se reutilizan.
5. Calcular `$NEXT_US` como máximo + 1 entre `- **US-NNN**:` de `$STAKEHOLDERS_PATH`; si no existe ninguno, `001`.

## Validar y clasificar la propuesta

`$STAGING_DIR/manifest.md` contiene una tabla con: `archivo`, `destino`, `operación`, `id`, `título`, `notas`.

1. Validar cada fila. El destino solo puede ser `product/stakeholders.md` o `requirements/{functional,non-functional}/<ID>-<slug>.md`. Para requisitos, el nombre debe coincidir con el `id` del frontmatter y del encabezado `#`; `kind` debe corresponder a la carpeta. Descartar cada fila inválida con su motivo y continuar con las demás.
2. Reclasificar contra el disco, sin confiar en `operación`: un destino existente, o `stakeholders.md` con `substatus: DONE`, es `modify`; otro destino es `create`. Rechazar un `create` de ID menor que el correspondiente `$NEXT_*` que no exista en disco: es un hueco no reutilizable.
3. Si el skill llamador declara un gate global, mostrar el resumen antes de escribir y detenerse al cancelar. `project-discovery` lo declara; `reverse-engineering` no.
4. Pedir confirmación individual para cada `modify`: `Sobrescribir <ID>` o `Conservar`. Sin respuesta se interpreta como `Conservar`.
5. Escribir solo los destinos aprobados en UTF-8 sin BOM. Crear `requirements/functional/` y `requirements/non-functional/` si faltan. Al actualizar stakeholders, conservar `type`, `slug`, `status`, `parent` y `created`, y actualizar `updated`.
6. Informar creados, sobrescritos, conservados y descartados. No borrar ni mover el staging.
