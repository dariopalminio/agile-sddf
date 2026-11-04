---
type: epic-analyze
id: EPIC-30
slug: EPIC-30-ejemplo-analyze-report
title: "Epic analyze: Exportación de informes"
epic: EPIC-30
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-26
updated: 2026-10-28
related:
  - EPIC-30-ejemplo
---
<!-- Referencias -->
[[EPIC-30-ejemplo]]

# Análisis de épica: Exportación de informes

## Veredicto
**Veredicto:** `APPROVED` — sin hallazgos ERROR y 0 WARNING (umbral: 3)
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-30 (`specs/flow/EPIC-30-ejemplo/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 2/2 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 4/4 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-exportar-informe-csv/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-302 | 24 | sí | `specs/flow/STORY-302-programar-envio-informe/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-305 | 25 | sí | `specs/flow/STORY-305-exportar-informe-xlsx/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-306 | 26 | sí | `specs/flow/STORY-306-exportar-informe-json/story.md` | `EPIC-30-ejemplo` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `El informe mensual se exporta a CSV con una fila por venta` | 29 | STORY-301 | mención · story.md:35 `- Cubre el criterio de salida: El informe mensual se exporta a CSV con una fila por venta.` | ✓ |
| SMOKE-1 | `Exportar el informe de octubre` | 32 | STORY-301 | mención · story.md:36 `- Cubre SMOKE-1 de la épica.` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

Sin notas.
