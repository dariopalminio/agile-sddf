---
type: epic-format-validation
id: EPIC-91
slug: EPIC-91-gestion-de-datos-format-validation-report
title: "Epic format validation: Gestión de datos"
epic: EPIC-91
verdict: NEEDS-REFINEMENT
defects: 2
created: 2026-10-21
updated: 2026-10-21
---
# Validación de formato de épica: Gestión de datos

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 2 defectos de estructura o formato.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-91 (`skills/epic-improve/examples/requiere-decision-po/epic.md`) |
| Template de épica | `docs/templates/epic-template.md` |
| Defectos | 2 |
| Fecha | 2026-10-21 |

## Defectos

| ID | Tipo | Ubicación | Encontrado | Corrección esperada |
|---|---|---|---|---|
| D-1 | seccion-faltante | tras ## Historias | — | añadir ## Criterios de salida según docs/templates/epic-template.md |
| D-2 | formato-historias | línea 23 (## Historias) | `- [ ] Exportar CSV — permite exportar datos` | F1 `- <Nombre>: <descripción>`, F2 `- [ ] **STORY-NNN** — <Nombre>: <descripción>` o F3 `- [x] **STORY-NNN** — <Nombre>: <descripción>` |

## Migración
Si la épica se creó con una versión anterior del template → `/memory-system migrate --from=epic-template-v1`
