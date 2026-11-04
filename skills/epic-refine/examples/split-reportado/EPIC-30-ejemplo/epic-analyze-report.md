---
type: epic-analyze
id: EPIC-30
slug: EPIC-30-ejemplo-analyze-report
title: "Epic analyze: Exportación de informes"
epic: EPIC-30
verdict: NEEDS-REFINEMENT
errors: 1
warnings: 2
created: 2026-10-26
updated: 2026-10-28
related:
  - EPIC-30-ejemplo
---
<!-- Referencias -->
[[EPIC-30-ejemplo]]

# Análisis de épica: Exportación de informes

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 1 hallazgo ERROR
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-30 (`specs/flow/EPIC-30-ejemplo/epic.md`) |
| Hallazgos ERROR | 1 |
| Hallazgos WARNING | 2 |
| Contrato de salida | Contrato de salida: 2/2 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 3/4 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-exportar-informe-csv/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-302 | 24 | sí | `specs/flow/STORY-302-programar-envio-informe/story.md` | `EPIC-30-ejemplo` | MAD-02 |
| STORY-305 | 25 | sí | `specs/flow/STORY-305-exportar-informe-xlsx/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-306 | 26 | sí | `specs/flow/STORY-306-exportar-informe-json/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-307 | 27 | sí | — | — | INT-01 |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `El informe mensual se exporta a CSV con una fila por venta` | 31 | STORY-301 | mención · story.md:35 `- Cubre el criterio de salida: El informe mensual se exporta a CSV con una fila por venta.` | ✓ |
| SMOKE-1 | `Exportar el informe de octubre` | 34 | STORY-301 | mención · story.md:36 `- Cubre SMOKE-1 de la épica.` | ✓ |

## Hallazgos

### H-001 [ERROR] — INT-01: Historia listada sin story.md

- **Elemento:** `STORY-307`
- **Evidencia:** `epic.md:27`
- **Acción sugerida:** Crear la historia con `/epic-generate-stories` o quitar la línea del índice

### H-002 [WARNING] — INT-05: Historia planificada sin ID

- **Elemento:** `Exportar a PDF con gráficos`
- **Evidencia:** `epic.md:28`
- **Acción sugerida:** Generar la historia con `/epic-generate-stories`

### H-003 [WARNING] — MAD-02: Referencia related rota

- **Elemento:** `STORY-310-importar-datos`
- **Evidencia:** `STORY-302 › specs/flow/STORY-302-programar-envio-informe/story.md:15`
- **Acción sugerida:** `corregir o retirar la referencia`

## Notas del análisis

Sin notas.
