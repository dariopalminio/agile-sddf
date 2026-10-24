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

Orquesta una sesión de User Story Mapping y materializa un mapa validado en `docs/product/story-map.md`. Prepara el contexto de `product/` y `requirements/`, conduce la conversación en esta sesión con el rol local `story-mapper` y solo escribe la capa de producto tras validar su staging.

## Entrada

| Insumo | Uso |
|---|---|
| `docs/product/vision.md` | Problema, propuesta de valor y alcance. |
| `docs/product/stakeholders.md` | Perfiles `US-NNN` para personas. |
| `docs/product/objectives.md` | Objetivos de negocio opcionales. |
| `docs/requirements/functional/FR-*.md` y `requirements/srs-*.md` | Inventario de requisitos funcionales. |
| `$STORY_MAP_PATH` existente | Solo si el usuario autoriza sobrescribirlo. |

## Precondiciones

No hay precondiciones bloqueantes de contenido: si las capas no aportan contexto, el rol `story-mapper` lo recopila de forma interactiva.

## Dependencias

- Rol local: `assets/agents/story-mapper.md` (entrevistador, lo lee esta sesión).

## Restricciones / Reglas

- El rol escribe únicamente en staging; nunca se escribe en `product/` sin staging validado.
- El rol recibe rutas ya resueltas; no resuelve la raíz ni lanza subagentes.
- Nunca se lee ni crea el nivel de proyectos retirado por ADR-0013.
- `$STORY_MAP_PATH` es la ruta fija `docs/product/story-map.md`.
- `story-map.md` se guarda en UTF-8 sin BOM.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

Con `REPO_ROOT` resuelto, comprueba que existe el rol local `assets/agents/story-mapper.md` (relativo al directorio de este skill). Si falta, muestra el siguiente mensaje y termina sin informar el destino, preguntar `Sobrescribir`/`Cancelar`, vaciar ni crear `.tmp/project-story-mapping/` ni escribir `product/story-map.md`; no se buscan roles fuera del directorio de este skill:

> ❌ Rol local no encontrado: assets/agents/story-mapper.md (skill project-story-mapping). Reinstala el skill; no se modificó ningún archivo.

### Paso 1 — Preparar destino y decisión de sobrescritura

Define `$STORY_MAP_PATH = docs/product/story-map.md` y `$STAGING_PATH = .tmp/project-story-mapping/story-map.md`. Informa siempre el destino:

```text
🗺️ Destino: docs/product/story-map.md
```

Si `$STORY_MAP_PATH` existe, pregunta: `Ya existe docs/product/story-map.md. ¿Rehacer el story map?` con `Sobrescribir` o `Cancelar`. `Cancelar` es el valor por defecto, también sin respuesta: `Story mapping cancelado: no se modificó docs/product/story-map.md.` y finaliza. Si se elige sobrescribir, conserva el campo `created` (o `date`) del archivo como `$CREATED_AT` e inclúyelo como insumo.

Si no existe, `$CREATED_AT` es la fecha actual. Vacía `.tmp/project-story-mapping/` antes de la sesión de mapeo.

### Paso 2 — Reunir insumos

Construye `$INPUT_PATHS` solo con documentos de `product/` que existan y tengan `substatus` distinto de `TODO`. Para cada documento ausente o semilla, emite `⚠️ <ruta> sin contenido (semilla o ausente); se omite como contexto.`

Construye `$REQUIREMENTS_INVENTORY` con líneas `FR-NNN — título — ruta` desde `docs/requirements/functional/FR-*.md` y encabezados `### FR-NNN` de `docs/requirements/srs-*.md`. No incluyas requisitos no funcionales. Si se autorizó sobrescribir, añade el mapa existente a `$INPUT_PATHS`.

Informa siempre el inventario, con una línea por requisito y la ruta relativa a `REPO_ROOT` del archivo de origen:

```text
📋 Inventario de requisitos: <n> FR
  - FR-NNN — <título> — <ruta>
```

Si el inventario está vacío, informa solo `📋 Inventario de requisitos: 0 FR`.

Aunque ambos resultados estén vacíos, continúa con la sesión de mapeo.

### Paso 3 — Sesión de mapeo con el rol `story-mapper`

Muestra:

> 📋 Rol local: assets/agents/story-mapper.md — conduce esta sesión, sin subagente.

Luego lee `assets/agents/story-mapper.md` (relativo al directorio de este skill) y sigue sus instrucciones con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH`. Esta sesión conduce la entrevista con el usuario y el rol escribe solo el cuerpo del mapa en staging. No lances un subagente para este paso. Las fases del rol son internas a este paso: al terminar la Fase 7, continúa con el Paso 4.

### Paso 4 — Validar staging

Verifica que `$STAGING_PATH` exista, que su primera línea empiece por `# `, no contenga frontmatter y tenga encabezados cuyo prefijo sea `## Personas`, `## Backbone`, `## Walking Skeleton` y `## Release slices`.

- Si no existe: `⚠️ La sesión terminó sin story map: no se modificó docs/product/story-map.md.` y finaliza.
- Si falta un encabezado: `❌ El story map generado no contiene <sección>; no se escribió docs/product/story-map.md.` y finaliza, conservando el staging para inspección.

### Paso 5 — Materializar

Crea `docs/product/` si falta. Escribe `$STORY_MAP_PATH` en UTF-8 sin BOM con:

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

Informa: `✅ Story map escrito en docs/product/story-map.md (<n> personas · <a> actividades · <s> release slices). Siguiente paso sugerido: /project-planning`.

## Salida

- `docs/product/story-map.md`: mapa de producto validado con personas, backbone, walking skeleton y release slices.
