---
name: epic-from-project-plan
description: >-
  Genera especificaciones EPIC-NN-nombre/epic.md desde la última propuesta de
  product/roadmap.md y valida cada épica con epic-format-validation.
triggers:
  - epic-from-project-plan
  - /epic-from-project-plan
  - generar épicas del roadmap
  - crear épicas planificadas
---

# Skill: `/epic-from-project-plan`

Lee la última propuesta de `docs/product/roadmap.md` y materializa una especificación `epic.md` por cada épica planificada. El skill no modifica el roadmap.

## Restricciones

- Las secciones de la épica se identifican por `clave:` en el template, no por título.
- Los formatos F1/F2/F3 y `SMOKE-N` siguen siendo el contrato de `domain-epic-lifecycle` §9.
- Todo `epic.md` nuevo se guarda UTF-8 sin BOM.

## Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

Resuelve `CLI_ROOT` (instalación del paquete) por separado y solo para leer los seeds de templates; nunca lo derives de `REPO_ROOT`.

## Fase 0 — Verificar roadmap

Fijar `$ROADMAP_PATH = docs/product/roadmap.md`. Si no existe, mostrar:

`❌ No se encontró docs/product/roadmap.md. Ejecuta /project-planning para planificar las épicas antes de usar este skill.`

Terminar sin crear directorios ni archivos.

## Fase 1 — Extraer la última propuesta

Leer `$ROADMAP_PATH` y seleccionar la última sección cuyo encabezado cumpla `## Propuesta (AAAA-MM-DD[ #n])`. Ignorar `## Épicas`, `## Plan original …` y cualquier otra sección. Si no existe una propuesta válida, mostrar:

`❌ docs/product/roadmap.md no contiene ninguna sección "## Propuesta (AAAA-MM-DD)". Ejecuta /project-planning.`

Cada bloque comienza con `### Épica <etiqueta><separador><Nombre>`, donde el separador es `:` o `—`; la etiqueta se ignora. Un bloque termina en el siguiente `###` o `##`; `### Resumen` no es una épica. Extraer `**Objetivo:**`, `**Historias:**`, `**Requisitos:**`, `**Dependencias:**`, `**Riesgos:**` y `**Criterios de éxito:**`. Las historias F1 son `- <Nombre>: <descripción>`; seguir aceptando historias con ID mediante el mapeo F2/F3 vigente.

Si no hay bloques, mostrar `No se encontraron épicas planificadas en la propuesta <encabezado>.` y terminar sin generar archivos.

## Fase 2 — Preparar destino e IDs

Las épicas se escriben en `specs/flow/`. Crearlo si no existe (nunca en el layout anterior).

Calcular `$MAX_EPIC` como el mayor `NN` de `specs/flow/EPIC-<NN>-*/`; si no existe ninguno, usar `-1`. Las épicas nuevas reciben `$MAX_EPIC + 1` en el orden de la propuesta, rellenado a dos dígitos hasta 99 y a tres desde 100. El número de su encabezado no determina su ID.

Convertir el nombre a kebab-case con las reglas vigentes. Si un slug se repite dentro de la propuesta, añadir `-bis` al segundo y sucesivos.

Si ya existe `EPIC-<cualquier NN>-<slug>`, preguntar si se sobrescribe; sin respuesta es `n`. Ante `n`, registrar `saltado (ya existía)` y continuar con la siguiente épica.

## Fase 3 — Generar y validar

Resolver el template central `docs/templates/epic-template.md`; si falta, usar `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` e informar el fallback. Si tampoco existe, informar `❌ Template epic-template.md no encontrado. Ejecuta sddf-init.` y detener.

Para cada épica nueva, crear `specs/flow/EPIC-NN-<slug>/epic.md` tomando títulos y orden del template. El mapeo por clave es:

| Clave | Contenido |
|---|---|
| `alcance` | Objetivo de la propuesta. |
| `historias` | Historias F1; una historia con ID mantiene su conversión F2/F3. |
| `criterios-salida` | Criterios de éxito como `- [ ]`. |
| `smoke-tests` | Un escenario Gherkin `SMOKE-N` por criterio. |
| `notas` | Subsecciones `### Requisitos`, `### Dependencias` y `### Riesgos` cuando haya datos. |

El frontmatter deriva las claves del template: `type: epic`, ID, slug, título, `status: DEFINE`, `substatus: IN-PROGRESS`, `parent: null`, fechas actuales y `related: []`. `DEFINE` es el estado inicial de toda épica generada desde el roadmap.

Invocar `epic-format-validation` automáticamente para cada archivo. Un resultado `REFINAR` se registra, pero no detiene el lote.

## Fase 4 — Resumen

Mostrar los archivos creados o saltados bajo `specs/flow/`, con el resultado de `epic-format-validation`. Si todos aprueban, sugerir `/epic-generate-stories`; si alguno requiere refinamiento, pedir corregirlo antes de generar sus historias.

## Notas

- El skill no modifica `roadmap.md`.
- La existencia se evalúa por slug, no por el número asignado en esta ejecución.
