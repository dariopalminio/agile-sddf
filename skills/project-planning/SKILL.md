---
name: project-planning
description: >-
  Propone épicas a partir de requisitos funcionales y agrega, tras confirmación,
  una propuesta fechada append-only en product/roadmap.md con su rol local planning.
triggers:
  - project-planning
  - /project-planning
  - planificación del proyecto
  - plan del proyecto
---

# Skill: `/project-planning`

## Objetivo

Convierte los requisitos funcionales disponibles en una propuesta incremental de épicas. La sesión del skill prepara la propuesta en staging siguiendo el rol local `assets/agents/planning.md`; después la valida, la presenta para confirmación y recién entonces la agrega a `docs/product/roadmap.md`.

## Entrada

- Requisitos funcionales en `docs/requirements/functional/FR-*.md` y encabezados `### FR-NNN` en `docs/requirements/srs-*.md`.
- Insumos existentes de `docs/`: requisitos no funcionales, `product/vision.md`, `product/stakeholders.md`, `product/story-map.md` y `product/roadmap.md`.
- Template de solo lectura `docs/templates/roadmap-template.md`, con fallback `assets/roadmap-template.md`.

## Precondiciones

- Debe existir al menos un requisito funcional. Si no existe, mostrar:

  `❌ No hay requisitos funcionales en docs/requirements/. Ejecuta /project-discovery (o /reverse-engineering) antes de planificar.`

  y terminar sin escribir, incluido `.tmp/`.

## Dependencias

- Rol local `assets/agents/planning.md` (lo lee esta sesión).
- `/project-story-mapping`, solo si el usuario elige generarlo.

## Restricciones

- El template es de solo lectura y el rol `planning` nunca escribe en `docs/` ni en `specs/`; solo el Paso 7 escribe, tras `Confirmar`.
- No se escribe en el roadmap antes del gate `Confirmar`.
- Cada propuesta es append-only: no se reescriben `## Épicas`, `## Plan original (...)` ni propuestas anteriores.
- Todo `roadmap.md` se escribe como UTF-8 sin BOM.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

Con `REPO_ROOT` resuelto, comprobar que existe el rol local `assets/agents/planning.md` (ruta relativa al directorio del skill). Si falta, mostrar el siguiente mensaje y terminar sin inventariar requisitos, vaciar ni crear `.tmp/project-planning/`, preguntar por el story map ni tocar `product/roadmap.md`; no se buscan roles fuera del directorio de este skill:

> ❌ Rol local no encontrado: assets/agents/planning.md (skill project-planning). Reinstala el skill; no se modificó ningún archivo.

### Paso 1 — Inventario y precondición

Construir `$FR_INVENTORY` con los archivos `requirements/functional/FR-*.md` y los encabezados `### FR-NNN` de `requirements/srs-*.md`. Aplicar la precondición antes de crear staging.

Si `product/vision.md` no existe o no tiene `substatus: DONE`, informar:

`⚠️ La visión del producto no está terminada; la propuesta se basará solo en los requisitos.`

Recopilar en `$INPUT_PATHS` los insumos existentes: inventario FR y NFR, visión, stakeholders, story map y roadmap.

### Paso 2 — Resolver template

Resolver `roadmap-template.md` en este orden:

1. `docs/templates/roadmap-template.md`.
2. `assets/roadmap-template.md`, mostrando `⚠️ Usando template seed del skill (assets/roadmap-template.md). Ejecuta sddf-init para centralizarlo en docs/templates/.`
3. Si ninguno existe, mostrar `❌ Template roadmap-template.md no encontrado. Ejecuta sddf-init.` y terminar sin escribir.

Guardar la ruta como `$TEMPLATE_PATH`.

### Paso 3 — Contexto para la propuesta

Construir `$EPICS_INVENTORY` como `EPIC-NN — <title> — <slug>` desde cada archivo que case con el patrón `specs/flow/EPIC-*/epic.md` (las historias comparten el directorio plano y no casan; `specs/flow/archive/` no se consulta). Sin coincidencias, el inventario queda vacío y la propuesta continúa; si falta frontmatter, usar el nombre del directorio e informar `⚠️ <ruta>: frontmatter incompleto`.

Calcular `$PROPOSAL_HEADING` como `Propuesta (<hoy>)`; si ya existe, usar consecutivamente `Propuesta (<hoy> #2)`, `#3`, etc. Vaciar `.tmp/project-planning/` y fijar `$STAGING_PATH = .tmp/project-planning/proposal.md`.

### Paso 4 — Story map opcional

Si existe `docs/product/story-map.md`, informar `✅ Se usará docs/product/story-map.md como guía estructural.`

Si no existe, ofrecer:

1. Sí, hacer Story Mapping ahora.
2. No, continuar sin Story Mapping.

Sin respuesta, elegir 2. Con 1, componer `/project-story-mapping` inline; si al volver sigue ausente, informar `⚠️ /project-story-mapping no dejó docs/product/story-map.md; se continúa sin story map.`

### Paso 5 — Propuesta con el rol `planning` y validación del staging

Mostrar:

> 📋 Rol local: assets/agents/planning.md — conduce esta sesión, sin subagente.

Luego leer `assets/agents/planning.md` y seguir su `## Estado Planning` con `$INPUT_PATHS`, `$EPICS_INVENTORY`, `$TEMPLATE_PATH`, `$PROPOSAL_HEADING` y `$STAGING_PATH` ya resueltos, escribiendo solamente el staging. Esta sesión redacta la propuesta; no lances un subagente para este paso.

Validar que el staging:

- Empieza con `## <$PROPOSAL_HEADING>` y termina con `### Resumen`.
- Tiene al menos un bloque `### Épica`.
- En cada bloque tiene `**Objetivo:**`, una historia, `**Requisitos:**` con al menos un `FR-NNN` de `$FR_INVENTORY` y un criterio de éxito.
- No contiene `STORY-NNN`.

Si falta el staging o incumple el contrato, mostrar `❌ La propuesta generada no cumple el contrato del template: <motivo>.` y terminar sin escribir el roadmap, conservando staging para diagnóstico.

### Paso 6 — Gate humano

Mostrar `<k> épicas · <h> historias` y una línea `Épica N: <Nombre> — <h> historias — <FR…>` por épica. Si ya hay roadmap, agregar `Se agregará como "<heading>" sin modificar el resto del roadmap.` y `Secciones existentes que se preservan: <encabezados ## del roadmap, en orden>.`

Preguntar mediante `AskUserQuestion`: `Confirmar` o `Cancelar`; sin respuesta equivale a `Cancelar`. Al cancelar, informar `Planificación cancelada: no se modificó docs/product/roadmap.md.` y terminar.

### Paso 7 — Materializar

Si no existe roadmap, crear `product/` y escribirlo desde el template: frontmatter sin comentarios de escritor, `created` y `updated` con la fecha actual, título, cita, sección `## Épicas` con la foto de `$EPICS_INVENTORY` (o `Sin épicas creadas al <fecha>.`), staging y pie.

Si existe, insertar el staging precedido de una línea en blanco inmediatamente antes de la última línea `Volver al mapa: [[index]].`; sin ese pie, agregarlo al final. Cambiar solo `updated:` y no reordenar, reformatear ni normalizar ninguna otra línea, incluidos sus finales de línea.

Guardar UTF-8 sin BOM e informar:

`✅ Propuesta (<fecha>) agregada a docs/product/roadmap.md: <k> épicas, <h> historias. Siguiente comando: /epic-from-project-plan`

## Salida

- `docs/product/roadmap.md`, con una propuesta fechada, validada y append-only.
