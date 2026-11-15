---
type: epic-analyze
id: EPIC-30
slug: EPIC-30-ejemplo-analyze-report
title: "Epic analyze: Exportación de pedidos"
epic: EPIC-30
verdict: NEEDS-REFINEMENT
errors: 1
warnings: 0
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
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 1/2 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 2/2 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `docs/templates/epic-analyze-report-template.md` |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-301 | 23 | sí | `specs/flow/STORY-301-exportar-pedidos-csv/story.md` | `EPIC-30-ejemplo` | ✓ |
| STORY-302 | 24 | sí | `specs/flow/STORY-302-enviar-csv-por-correo/story.md` | `EPIC-30-ejemplo` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `El listado de pedidos del mes se exporta a CSV y se envía por correo al responsable de ventas` | 27 | — | STORY-301 · AC-1 · story.md:30 `Entonces se descarga "pedidos-2026-10.csv" con una fila por pedido` — parcial: solo la exportación<br>STORY-302 · AC-1 · story.md:30 `Entonces el responsable de ventas recibe un correo con "pedidos-2026-10.csv" adjunto` — parcial: solo el envío | SAL-01 |
| SMOKE-1 | `Exportar los pedidos de octubre` | 30 | STORY-301 | mención · story.md:35 `- Cubre SMOKE-1 de la épica.` | ✓ |

## Hallazgos

### H-001 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `El listado de pedidos del mes se exporta a CSV y se envía por correo al responsable de ventas`
- **Evidencia:** `epic.md:27` · `parcial: STORY-301 › AC-1 · story.md:30` · `parcial: STORY-302 › AC-1 · story.md:30`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

## Notas del análisis

Sin notas.
