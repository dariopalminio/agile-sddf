---
type: fix-plan-report
id: STORY-175
slug: STORY-175-fix-plan-report
title: "Fix plan: Admitir épicas archivadas en el layout fijo con un ADR nuevo"
story: STORY-175
analyze-updated: 2026-10-29
analyze-verdict: NEEDS-CHANGES
mode: estándar
analyze-status: "ERROR de tipo B; WARNING de tipo D"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 3
findings-applied: 2
findings-resolved: 0
findings-out-of-scope: 1
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-175-admitir-epicas-archivadas-en-layout
---

# Fix plan: Admitir épicas archivadas en el layout fijo con un ADR nuevo

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `NEEDS-CHANGES` · ERROR de tipo B; WARNING de tipo D |
| Modo | estándar |
| Archivos del plan | design.md, tasks.md (`testcases.md` no existe) |
| Hallazgos extraídos | 3 (INC 2 · HAL 0 · REC 1 · DOD 0) |
| Aplicados | 2 |
| Ya resueltos | 0 |
| Fuera de alcance | 1 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | ERROR | T025 («Ejecutar `graphify update .`») no se traza a ningún elemento de design.md y la historia no modifica código | Aplicable — tasks.md | C-01 |
| INC-002 | WARNING | STORY-175 no figura en el índice de historias de EPIC-23; `epic.md` atribuye a STORY-171 el ADR nuevo y la parte de CS-20 sobre `COMPLETED` | Fuera de alcance | — |
| REC-3 | WARNING | T009 cambia el actor de la fila `COMPLETED` de la tabla de Epic de `state-machine.md`, pero C8 solo nombra la nota bajo la tabla | Aplicable — design.md | C-02 |

## Plan de cambios aplicado

### C-01 — tasks.md › 8. Verificación › T025

- **Origen:** INC-001 [ERROR]
- **Operación:** eliminar
- **Antes:** `- [ ] T025 Ejecutar \`graphify update .\` para mantener el grafo al día`
- **Después:** —
- **Referencias actualizadas:** ninguna (T025 no aparece en ningún otro lugar de design.md ni de tasks.md). El ID T025 no se reutiliza y T026 conserva el suyo

### C-02 — design.md › Decisions › Componentes › C8

- **Origen:** REC-3 [WARNING]
- **Operación:** modificar
- **Antes:** Ubicación «`docs/architecture/state-machine.md` (nota bajo la tabla de Epic, solo `COMPLETED`)»; Responsabilidad «Evitar que la fuente canónica de transiciones contradiga a C7»
- **Después:** Ubicación «`docs/architecture/state-machine.md` (nota bajo la tabla de Epic, solo `COMPLETED`; fila `COMPLETED` de la tabla de Epic)»; Responsabilidad «Evitar que la fuente canónica de transiciones contradiga a C7: nota con la regla de la invariante 6 y actor `Humano (vía epic-complete)` en la fila `COMPLETED`, coherente con C6»
- **Referencias actualizadas:** ninguna. T009 ya ejecuta los dos cambios y C8 queda ahora alineado con ella

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Declarar en design.md (Contratos de verificación o Decisiones de complejidad justificada) un elemento que justifique T025 | La Recomendación 1 prefiere retirar T025: ninguna tarea modifica código y la regla de `CLAUDE.md` aplica «después de modificar código» |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-002 | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` (índice de historias, línea 65; Notas, líneas 186 y 199) | Añadir STORY-175 al índice, reasignarle el ADR nuevo y la parte de CS-20 sobre `COMPLETED`, y ajustar la línea de STORY-171; después, `/epic-analyze EPIC-23` | PO / skills de épica (se puede resolver junto con STORY-174) |

## Siguiente paso

Ejecutar `/story-analyze STORY-175` para verificar la coherencia del plan corregido.
