---
type: epic-analyze
id: EPIC-30
slug: EPIC-30-ejemplo-analyze-report
title: "Epic analyze: Exportación de pedidos"
epic: EPIC-30
verdict: NEEDS-REFINEMENT
errors: 2
warnings: 1
created: 2026-10-26
updated: 2026-10-28
related:
  - EPIC-30-ejemplo
---
<!-- Referencias -->
[[EPIC-30-ejemplo]]

# Análisis de épica: Exportación de pedidos

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 2 hallazgos ERROR
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-30 (`specs/flow/EPIC-30-ejemplo/epic.md`) |
| Hallazgos ERROR | 2 |
| Hallazgos WARNING | 1 |
| Contrato de salida | Contrato de salida: 1/1 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 4/4 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-listar-pedidos-del-mes/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-302 | 24 | sí | `specs/flow/STORY-302-filtrar-pedidos-por-vendedor/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-303 | 25 | sí | `specs/flow/STORY-303-totalizar-comisiones/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-304 | 26 | sí | `specs/flow/STORY-304-exportar-pedidos-csv/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-305 | 27 | sí | — | — | INT-01 |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| — | `Criterios de salida` | — | — | — | SAL-03 |
| SMOKE-1 | `Exportar los pedidos de octubre` | 33 | STORY-304 | mención · story.md:35 `- Cubre SMOKE-1 de la épica.` | ✓ |

## Hallazgos

### H-001 [ERROR] — INT-01: Historia listada sin story.md

- **Elemento:** `STORY-305`
- **Evidencia:** `epic.md:27`
- **Acción sugerida:** Crear la historia con `/epic-generate-stories` o quitar la línea del índice

### H-002 [WARNING] — INT-05: Historia planificada sin ID

- **Elemento:** `Exportar a Excel`
- **Evidencia:** `epic.md:28`
- **Acción sugerida:** Generar la historia con `/epic-generate-stories`

### H-003 [ERROR] — SAL-03: Criterios de salida vacíos

- **Elemento:** `Criterios de salida`
- **Evidencia:** `specs/flow/EPIC-30-ejemplo/epic.md`
- **Acción sugerida:** Definir los criterios de salida en `epic.md` (`/epic-format-validation EPIC-30` para revisar la estructura)

## Notas del análisis

Sin notas.
