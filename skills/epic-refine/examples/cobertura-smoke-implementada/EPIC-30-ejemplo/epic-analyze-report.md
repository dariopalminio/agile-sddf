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
**Veredicto:** `NEEDS-REFINEMENT` — 1 hallazgo ERROR, 1 WARNING
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-30 (`specs/flow/EPIC-30-ejemplo/epic.md`) |
| Hallazgos ERROR | 1 |
| Hallazgos WARNING | 1 |
| Contrato de salida | Contrato de salida: 1/3 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 2/2 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-exportar-pedidos-csv/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-303 | 24 | sí | `specs/flow/STORY-303-totalizar-comisiones/story.md` | `EPIC-30-ejemplo` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `El total de comisiones por vendedor se muestra y se descarga en CSV` | 27 | — | STORY-303 · AC-1 · story.md:30 `Entonces se muestra el total de comisiones por vendedor` — parcial: falta la descarga en CSV | SAL-01 |
| SMOKE-1 | `Exportar los pedidos de octubre` | 30 | STORY-301 | mención · story.md:35 `- Cubre SMOKE-1 de la épica.` | ✓ |
| SMOKE-2 | `Totalizar comisiones de octubre` | 38 | — | STORY-303 · AC-1 · story.md:30 `Entonces se muestra el total de comisiones por vendedor` — parcial: falta la descarga | SAL-02 |

## Hallazgos

### H-001 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `El total de comisiones por vendedor se muestra y se descarga en CSV`
- **Evidencia:** `epic.md:27` · `parcial: STORY-303 › AC-1 · story.md:30`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-002 [WARNING] — SAL-02: Smoke test sin evidencia que lo cubra

- **Elemento:** `SMOKE-2 — Totalizar comisiones de octubre`
- **Evidencia:** `epic.md:38` · `parcial: STORY-303 › AC-1 · story.md:30`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar `SMOKE-<N>` en su `story.md`; o retirar el smoke test si es obsoleto

## Notas del análisis

Sin notas.
