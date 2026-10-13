---
name: project-story-mapping
description: >-
  Produce product/story-map.md desde product/ y requirements/ mediante una sesión
  interactiva de User Story Mapping. Úsalo para organizar requisitos en incrementos
  entregables o definir el MVP.
triggers:
  - project-story-mapping
  - /project-story-mapping
  - story mapping
  - user story map
  - backbone
  - walking skeleton
  - slices de épicas
---

# Skill: `/project-story-mapping`

## Objetivo

Orquesta una sesión de User Story Mapping y materializa un mapa validado en `$SPECS_BASE/product/story-map.md`. Prepara el contexto de `product/` y `requirements/`, delega la conversación al agente `project-story-mapper` y solo escribe la capa de producto tras validar su staging.

## Entrada

| Insumo | Uso |
|---|---|
| `$SPECS_BASE/product/vision.md` | Problema, propuesta de valor y alcance. |
| `$SPECS_BASE/product/stakeholders.md` | Perfiles `US-NNN` para personas. |
| `$SPECS_BASE/product/objectives.md` | Objetivos de negocio opcionales. |
| `$SPECS_BASE/requirements/functional/FR-*.md` y `requirements/srs-*.md` | Inventario de requisitos funcionales. |
| `$STORY_MAP_PATH` existente | Solo si el usuario autoriza sobrescribirlo. |

## Precondiciones

No hay precondiciones bloqueantes de contenido: si las capas no aportan contexto, el agente lo recopila de forma interactiva.

## Dependencias

- Agente: `project-story-mapper`.

## Restricciones / Reglas

- El agente escribe únicamente en staging; nunca se escribe en `product/` sin staging validado.
- Nunca se lee ni crea el nivel de proyectos retirado por ADR-0013.
- `$STORY_MAP_PATH` se deriva de `SPECS_BASE`, no de una ruta literal.
- `story-map.md` se guarda en UTF-8 sin BOM.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Preparar destino y decisión de sobrescritura

Define `$STORY_MAP_PATH = $SPECS_BASE/product/story-map.md` y `$STAGING_PATH = .tmp/project-story-mapping/story-map.md`. Informa siempre el destino:

```text
🗺️ Destino: $SPECS_BASE/product/story-map.md
```

Si `$STORY_MAP_PATH` existe, pregunta: `Ya existe $SPECS_BASE/product/story-map.md. ¿Rehacer el story map?` con `Sobrescribir` o `Cancelar`. `Cancelar` es el valor por defecto, también sin respuesta: `Story mapping cancelado: no se modificó $SPECS_BASE/product/story-map.md.` y finaliza. Si se elige sobrescribir, conserva el campo `created` (o `date`) del archivo como `$CREATED_AT` e inclúyelo como insumo.

Si no existe, `$CREATED_AT` es la fecha actual. Vacía `.tmp/project-story-mapping/` antes de delegar.

### Paso 2 — Reunir insumos

Construye `$INPUT_PATHS` solo con documentos de `product/` que existan y tengan `substatus` distinto de `TODO`. Para cada documento ausente o semilla, emite `⚠️ <ruta> sin contenido (semilla o ausente); se omite como contexto.`

Construye `$REQUIREMENTS_INVENTORY` con líneas `FR-NNN — título — ruta` desde `requirements/functional/FR-*.md` y encabezados `### FR-NNN` de `requirements/srs-*.md`. No incluyas requisitos no funcionales. Si se autorizó sobrescribir, añade el mapa existente a `$INPUT_PATHS`.

Informa siempre el inventario, con una línea por requisito y la ruta relativa a `$SPECS_BASE` del archivo de origen:

```text
📋 Inventario de requisitos: <n> FR
  - FR-NNN — <título> — <ruta>
```

Si el inventario está vacío, informa solo `📋 Inventario de requisitos: 0 FR`.

Aunque ambos resultados estén vacíos, continúa con la delegación.

### Paso 3 — Delegar la sesión

Lee las instrucciones de `project-story-mapper` y ejecútalo con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH`. El agente conduce la sesión y escribe solo el cuerpo del mapa en staging.

### Paso 4 — Validar staging

Verifica que `$STAGING_PATH` exista, que su primera línea empiece por `# `, no contenga frontmatter y tenga encabezados cuyo prefijo sea `## Personas`, `## Backbone`, `## Walking Skeleton` y `## Release slices`.

- Si no existe: `⚠️ La sesión terminó sin story map: no se modificó $SPECS_BASE/product/story-map.md.` y finaliza.
- Si falta un encabezado: `❌ El story map generado no contiene <sección>; no se escribió $SPECS_BASE/product/story-map.md.` y finaliza, conservando el staging para inspección.

### Paso 5 — Materializar

Crea `$SPECS_BASE/product/` si falta. Escribe `$STORY_MAP_PATH` en UTF-8 sin BOM con:

```yaml
---
type: product
slug: story-map
title: <primer encabezado # del cuerpo>
status: IN-PROGRESS
substatus: DONE
parent: null
created: <CREATED_AT>
updated: <fecha actual>
related:
  - <slug de cada documento product leído>
---
```

Omite `related` si no hubo documentos leídos. Tras el frontmatter, agrega `<!-- Referencias -->` con wikilinks de los documentos leídos, el cuerpo del staging y `Volver al mapa: [[index]].` si el cuerpo no incluye ya ese pie.

### Paso 6 — Confirmar resultado

Informa: `✅ Story map escrito en $SPECS_BASE/product/story-map.md (<n> personas · <a> actividades · <s> release slices). Siguiente paso sugerido: /project-planning`.

## Salida

- `$SPECS_BASE/product/story-map.md`: mapa de producto validado con personas, backbone, walking skeleton y release slices.
