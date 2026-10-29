---
type: epic-format-validation
id: EPIC-05
slug: EPIC-05-pagos-format-validation-report
title: "Epic format validation: Pagos"
epic: EPIC-05
verdict: NEEDS-REFINEMENT
defects: 2
created: 2026-10-29
updated: 2026-10-29
---
# Validación de formato de épica: Pagos

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 2 defectos de estructura o formato.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-05 (`specs/flow/EPIC-05-pagos/epic.md`) |
| Template de épica | `docs/templates/epic-template.md` |
| Defectos | 2 |
| Fecha | 2026-10-29 |

## Defectos

| ID | Tipo | Ubicación | Encontrado | Corrección esperada |
|---|---|---|---|---|
| D-1 | seccion-faltante | tras ## Historias | — | añadir ## Criterios de salida según docs/templates/epic-template.md |
| D-2 | formato-historias | línea 23 (## Historias) | `- [ ] Exportar CSV: descarga del historial` | F1 `- <Nombre>: <descripción>`, F2 `- [ ] **STORY-NNN** — <Nombre>: <descripción>` o F3 `- [x] **STORY-NNN** — <Nombre>: <descripción>` |

## Migración
Si la épica se creó con una versión anterior del template → `/memory-system migrate --from=epic-template-v1`
