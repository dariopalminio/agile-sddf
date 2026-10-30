---
type: epic-analyze
id: EPIC-30
slug: EPIC-30-ejemplo-analyze-report
title: "Epic analyze: Exportación de pedidos"
epic: EPIC-30
verdict: NEEDS-REFINEMENT
errors: 1
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
**Veredicto:** `NEEDS-REFINEMENT` — 1 hallazgo ERROR
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-30 (`specs/flow/EPIC-30-ejemplo/epic.md`) |
| Hallazgos ERROR | 1 |
| Hallazgos WARNING | 1 |
| Contrato de salida | Contrato de salida: 2/2 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 4/4 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-listar-pedidos-del-mes/story.md` | `EPIC-30-ejemplo` | MAD-02 |
| STORY-302 | 24 | sí | `specs/flow/STORY-302-filtrar-pedidos-por-vendedor/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-303 | 25 | sí | `specs/flow/STORY-303-totalizar-comisiones/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-304 | — | no | `specs/flow/STORY-304-exportar-pedidos-csv/story.md` | `EPIC-30-ejemplo` | INT-02 |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `El listado de pedidos del mes se exporta a CSV con una fila por pedido` | 28 | STORY-304 | mención · story.md:36 `- Cubre el criterio de salida: El listado de pedidos del mes se exporta a CSV con una fila por pedido.` | ✓ |
| SMOKE-1 | `Exportar los pedidos de octubre` | 31 | STORY-304 | mención · story.md:35 `- Cubre SMOKE-1 de la épica.` | ✓ |

## Hallazgos

### H-001 [ERROR] — INT-02: Historia huérfana

- **Elemento:** `STORY-304`
- **Evidencia:** `specs/flow/STORY-304-exportar-pedidos-csv/story.md`
- **Acción sugerida:** Añadir la línea F2/F3 al índice o corregir `parent`

### H-002 [WARNING] — MAD-02: Referencia related rota

- **Elemento:** `STORY-999`
- **Evidencia:** `STORY-301 › specs/flow/STORY-301-listar-pedidos-del-mes/story.md:15`
- **Acción sugerida:** `corregir o retirar la referencia`

## Notas del análisis

Sin notas.
