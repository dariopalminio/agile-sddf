---
name: project-story-mapping
description: >-
  Produce story-map.md (backbone, walking skeleton, slices de épicas) via sesión interactiva de User Story Mapping.
  Usar para organizar requisitos en incrementos entregables o definir el MVP.
  Invocar para "story mapping", "user story map", "backbone",
  "walking skeleton", "slices de épicas" o "project-story-mapping".
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

**Cuándo usar este skill:**
Usar cuando el usuario quiere organizar requisitos en incrementos entregables, definir el
alcance del MVP desde un conjunto grande de requisitos, visualizar el journey del usuario
a través de las funcionalidades, planificar épicas con valor claro, dividirlas en
historias entregables, o comunicar la visión del producto a stakeholders.
Invocar también cuando el usuario mencione "story mapping", "user story map", "backbone",
"walking skeleton", "slices de épicas", "project-story-mapping" o equivalentes.

## Objetivo

Orquesta una sesión de User Story Mapping (técnica de Jeff Patton) para el proyecto activo
en SDDF: prepara el contexto desde los documentos del proyecto y delega la sesión completa
al agente `project-story-mapper`, produciendo
`$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`.

Se ubica entre la fase de discovery y la planificación del proyecto:
```
project-begin → project-discovery → [project-story-mapping] → project-planning
```

**Qué hace este skill:**
- Resuelve el proyecto activo y lee los documentos disponibles (`project-intent.md`, `project.md`)
- Delega la sesión interactiva completa al agente `project-story-mapper` con el contexto preparado
- Añade el frontmatter YAML al documento generado por el agente

**Qué NO hace este skill:**
- No conduce el story mapping directamente — esa responsabilidad es del agente `project-story-mapper`
- No modifica el contenido narrativo del `story-map.md` generado (solo añade frontmatter)

## Entrada

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` — contexto del proyecto (opcional)
- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` — especificación de requisitos (opcional)
- Si no hay documentos disponibles, el agente `project-story-mapper` recopila el contexto interactivamente

## Parámetros

- Ninguno — el skill opera de forma completamente interactiva mediante el agente `project-story-mapper`

## Precondiciones

- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.
- No hay precondición de estado: el skill puede ejecutarse con o sin documentos previos del proyecto

## Dependencias

- Agentes: [`project-story-mapper`]

## Modos de ejecución

- **Manual** (`/project-story-mapping`): siempre interactivo — el agente `project-story-mapper` conduce la sesión con el usuario.
- **Invocado desde `project-planning`**: el skill recibe contexto de los documentos del proyecto y lo pasa al agente automáticamente.

## Restricciones / Reglas

- **Solo frontmatter:** el skill no modifica el contenido del `story-map.md` generado; solo prepende el bloque de frontmatter YAML.
- **Contexto opcional:** si no se encuentran documentos del proyecto, el agente recopila el contexto interactivamente — la ausencia de documentos no es un error bloqueante.
- **Frontmatter derivado dinámicamente:** `title` se extrae del primer `#` heading del documento; `date` es la fecha actual; `substatus` por defecto es `IN-PROGRESS`.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de planeación y especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
  
## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 0b — Resolver directorio del proyecto activo (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/01-projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE`.
3. Si se encuentra exactamente uno con `substatus: DONE` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → proceder sin contexto de proyecto (el agente recopilará la información interactivamente).

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/01-projects/$PROJ_DIR/`

### Paso 1 — Leer documentos del proyecto

Antes de invocar al agente, lee los siguientes archivos si existen:

1. `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md`
2. `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`

Si existen, extrae y resume:
- Nombre del proyecto
- Problema que resuelve
- Usuarios/personas identificadas
- Funcionalidades clave

Este resumen será el contexto inicial que se pasará al agente.

### Paso 2 — Invocar al agente project-story-mapper

Delega la sesión completa al agente `project-story-mapper` con el siguiente briefing:

> Inicia una sesión de User Story Mapping para el proyecto [nombre del proyecto si se conoce].
> [Si hay documentos disponibles]: He leído los documentos del proyecto. El contexto es: [resumen].
> [Si no hay documentos]: No hay documentos de proyecto disponibles aún; recopila el contexto interactivamente.
> Produce el documento completo en `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`.

El agente conduce toda la sesión de forma interactiva con el usuario y escribe el documento de salida.

### Paso 3 — Añadir frontmatter al documento generado

Una vez que el agente `project-story-mapper` haya escrito `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`, antepón o completa si existe el siguiente bloque YAML al inicio del archivo (antes de cualquier otro contenido):

```yaml
---
type: spec
slug: <nombre-del-directorio-del-proyecto-story-map | story-map si es el primer documento>
title: "[primer # heading del documento generado]"
date: [YYYY-MM-DD]
status: BACKLOG
substatus: IN-PROGRESS
parent: null
related:
  - <slug de project.md o project-plan.md relacionado (si existe)>
---
<!-- Referencias -->
[[nombre-del-directorio-del-proyecto-project o slug de project-plan relacionado (si existe)]]
```

Reglas de derivación:
- `title`: extrae el primer `#` heading del documento
- `date`: fecha actual en formato YYYY-MM-DD
- `substatus`: `IN-PROGRESS` por defecto; `DONE` si el documento está completado

## Salida

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md` — mapa de historias con backbone,
  walking skeleton y slices de épicas, generado por `project-story-mapper` con frontmatter YAML añadido.
