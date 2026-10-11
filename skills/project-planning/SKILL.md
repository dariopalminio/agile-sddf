---
name: project-planning
description: >-
  Propone épicas a partir de requisitos funcionales y agrega, tras confirmación,
  una propuesta fechada append-only en product/roadmap.md mediante project-architect.
triggers:
  - project-planning
  - /project-planning
  - planificación del proyecto
  - plan del proyecto
---

# Skill: `/project-planning`

## Objetivo

Convierte los requisitos funcionales disponibles en una propuesta incremental de épicas. El agente `project-architect` prepara la propuesta en staging y este skill la valida, la presenta para confirmación y recién entonces la agrega a `$SPECS_BASE/product/roadmap.md`.

## Entrada

- Requisitos funcionales en `$SPECS_BASE/requirements/functional/FR-*.md` y encabezados `### FR-NNN` en `$SPECS_BASE/requirements/srs-*.md`.
- Insumos existentes de `$SPECS_BASE`: requisitos no funcionales, `product/vision.md`, `product/stakeholders.md`, `product/story-map.md` y `product/roadmap.md`.
- Template de solo lectura `$SPECS_BASE/templates/roadmap-template.md`, con fallback `assets/roadmap-template.md`.

## Precondiciones

- Debe existir al menos un requisito funcional. Si no existe, mostrar:

  `❌ No hay requisitos funcionales en $SPECS_BASE/requirements/. Ejecuta /project-discovery (o /reverse-engineering) antes de planificar.`

  y terminar sin escribir, incluido `.tmp/`.

## Dependencias

- Agente `project-architect` en estado *Planning*.
- `/project-story-mapping`, solo si el usuario elige generarlo.

## Restricciones

- El template es de solo lectura y el agente nunca escribe en `$SPECS_BASE`.
- No se escribe en el roadmap antes del gate `Confirmar`.
- Cada propuesta es append-only: no se reescriben `## Épicas`, `## Plan original (...)` ni propuestas anteriores.
- Todo `roadmap.md` se escribe como UTF-8 sin BOM.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

1. Si `SDDF_ROOT` está definida, debe ser un directorio accesible y será `SPECS_BASE`; si es inválida, detener antes de escribir.
2. Si no está definida, leer `sddf.config.yaml`; una clave `root` explícita debe resolver a un directorio accesible o detener el flujo.
3. Sin fuente explícita, usar `docs` relativo a `REPO_ROOT`.
4. Resolver `CLI_ROOT` por separado únicamente para skills o agentes.

### Paso 1 — Inventario y precondición

Construir `$FR_INVENTORY` con los archivos `requirements/functional/FR-*.md` y los encabezados `### FR-NNN` de `requirements/srs-*.md`. Aplicar la precondición antes de crear staging.

Si `product/vision.md` no existe o no tiene `substatus: DONE`, informar:

`⚠️ La visión del producto no está terminada; la propuesta se basará solo en los requisitos.`

Recopilar en `$INPUT_PATHS` los insumos existentes: inventario FR y NFR, visión, stakeholders, story map y roadmap.

### Paso 2 — Resolver template

Resolver `roadmap-template.md` en este orden:

1. `$SPECS_BASE/templates/roadmap-template.md`.
2. `assets/roadmap-template.md`, mostrando `⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.`
3. Si ninguno existe, mostrar `❌ Template roadmap-template.md no encontrado. Ejecuta sddf-init.` y terminar sin escribir.

Guardar la ruta como `$TEMPLATE_PATH`.

### Paso 3 — Contexto para la propuesta

Usar `$EPICS_DIR = $SPECS_BASE/specs/epics/` si existe; de lo contrario, usar la ruta vigente `$SPECS_BASE/specs/02-epics/`. Construir `$EPICS_INVENTORY` como `EPIC-NN — <title> — <slug>` desde cada `EPIC-*/epic.md`; si falta frontmatter, usar el nombre del directorio e informar `⚠️ <ruta>: frontmatter incompleto`.

Calcular `$PROPOSAL_HEADING` como `Propuesta (<hoy>)`; si ya existe, usar consecutivamente `Propuesta (<hoy> #2)`, `#3`, etc. Vaciar `.tmp/project-planning/` y fijar `$STAGING_PATH = .tmp/project-planning/proposal.md`.

### Paso 4 — Story map opcional

Si existe `$SPECS_BASE/product/story-map.md`, informar `✅ Se usará $SPECS_BASE/product/story-map.md como guía estructural.`

Si no existe, ofrecer:

1. Sí, hacer Story Mapping ahora.
2. No, continuar sin Story Mapping.

Sin respuesta, elegir 2. Con 1, componer `/project-story-mapping` inline; si al volver sigue ausente, informar `⚠️ /project-story-mapping no dejó $SPECS_BASE/product/story-map.md; se continúa sin story map.`

### Paso 5 — Delegar y validar staging

Invocar `project-architect` con `$INPUT_PATHS`, `$EPICS_INVENTORY`, `$TEMPLATE_PATH`, `$PROPOSAL_HEADING` y `$STAGING_PATH` ya resueltos. El agente escribe solamente el staging.

Validar que el staging:

- Empieza con `## <$PROPOSAL_HEADING>` y termina con `### Resumen`.
- Tiene al menos un bloque `### Épica`.
- En cada bloque tiene `**Objetivo:**`, una historia, `**Requisitos:**` con al menos un `FR-NNN` de `$FR_INVENTORY` y un criterio de éxito.
- No contiene `STORY-NNN`.

Si falta el staging o incumple el contrato, mostrar `❌ La propuesta generada no cumple el contrato del template: <motivo>.` y terminar sin escribir el roadmap, conservando staging para diagnóstico.

### Paso 6 — Gate humano

Mostrar `<k> épicas · <h> historias` y una línea `Épica N: <Nombre> — <h> historias — <FR…>` por épica. Si ya hay roadmap, agregar `Se agregará como "<heading>" sin modificar el resto del roadmap.`

Preguntar mediante `AskUserQuestion`: `Confirmar` o `Cancelar`; sin respuesta equivale a `Cancelar`. Al cancelar, informar `Planificación cancelada: no se modificó $SPECS_BASE/product/roadmap.md.` y terminar.

### Paso 7 — Materializar

Si no existe roadmap, crear `product/` y escribirlo desde el template: frontmatter sin comentarios de escritor, `created` y `updated` con la fecha actual, título, cita, sección `## Épicas` con la foto de `$EPICS_INVENTORY` (o `Sin épicas creadas al <fecha>.`), staging y pie.

Si existe, insertar el staging precedido de una línea en blanco inmediatamente antes de la última línea `Volver al mapa: [[index]].`; sin ese pie, agregarlo al final. Cambiar solo `updated:` y no reordenar, reformatear ni normalizar ninguna otra línea, incluidos sus finales de línea.

Guardar UTF-8 sin BOM e informar:

`✅ Propuesta (<fecha>) agregada a $SPECS_BASE/product/roadmap.md: <k> épicas, <h> historias. Siguiente comando: /epic-from-project-plan`

## Salida

- `$SPECS_BASE/product/roadmap.md`, con una propuesta fechada, validada y append-only.
