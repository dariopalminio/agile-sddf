---
type: fix-plan-report
id: STORY-165
slug: STORY-165-fix-plan-report
title: "Fix plan: Skill epic-refine (Core): corregir índice y enlaces de una épica"
story: STORY-165
analyze-updated: 2026-10-29
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "sin ERROR; WARNING de tipo C, D"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 2
findings-applied: 1
findings-resolved: 0
findings-out-of-scope: 1
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-165-corregir-indice-y-enlaces-epica
---

# Fix plan: Skill epic-refine (Core): corregir índice y enlaces de una épica

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · sin ERROR; WARNING de tipo C, D |
| Modo | corrige advertencias |
| Archivos del plan | design.md, tasks.md (testcases.md no existe: modo `--only-tasks`) |
| Hallazgos extraídos | 2 (INC 2 · HAL 0 · REC 0 · DOD 0); REC-1 y REC-2 se adjuntaron a INC-001 e INC-002 |
| Aplicados | 1 |
| Ya resueltos | 0 |
| Fuera de alcance | 1 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | TC-005 depende del resultado de TC-001; no hay fixture ni tarea para su estado de partida | Aplicable — design.md, tasks.md | C-01, C-02, C-03, C-04 |
| INC-002 | WARNING | El índice de EPIC-23 describe STORY-165 con el alcance previo al split y no lista STORY-173 ni STORY-174 | Fuera de alcance — epic.md | — |

## Plan de cambios aplicado

### C-01 — design.md › D-11 › tabla de fixtures

- **Origen:** INC-001 [WARNING]
- **Operación:** añadir
- **Antes:** —
- **Después:** fila `reejecucion-parcial/`: estado tras un fallo parcial, con `**STORY-304**` ya en el índice, `epic.md.bak` presente y el `related` de STORY-301 aún con `STORY-999`; mismo `epic-analyze-report.md` que `huerfana-y-related-roto/`
- **Referencias actualizadas:** ninguna (la fila «Evals y fixtures» de Componentes afectados ya cubre `examples/*/`)

### C-02 — design.md › D-11 › tabla de evals › TC-005

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** `--auto`, re-ejecución sobre el resultado de TC-001 · `ya resuelto` / `C-01`
- **Después:** `--auto` sobre `reejecucion-parcial/` · `ya resuelto`, `INT-02`, `MAD-02`, `aplicado`, `story.md.bak` / `**STORY-304**` añadido de nuevo, `epic.md` en archivos modificados
- **Referencias actualizadas:** V-5 sigue citando TC-005 sin cambios

### C-03 — tasks.md › 4. Fixtures y evals › T035

- **Origen:** INC-001 [WARNING]
- **Operación:** añadir
- **Antes:** —
- **Después:** `T035 [P]` crea `skills/epic-refine/examples/reejecucion-parcial/` (D-11, F-4) // AC-1, situada antes de T024 por dependencia
- **Referencias actualizadas:** T024 (C-04)

### C-04 — tasks.md › T024

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «TC-005 re-ejecuta sobre el resultado de TC-001 y espera `ya resuelto`»
- **Después:** «TC-005 usa el fixture `reejecucion-parcial/` de T035 y espera INT-02 `ya resuelto` y MAD-02 `aplicado` sin modificar `epic.md`» y `(requiere T019–T023, T035)`
- **Referencias actualizadas:** dependencia explícita de T035

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Describir el estado de partida en el `context` de TC-005 | Los casos de `evals.json` se ejecutan de forma independiente; un fixture real hace reproducible el estado parcial (`epic.md.bak` ya presente) y la recomendación lo cita primero |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-002 | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` | Reescribir la línea F2 de STORY-165 con su título actual, añadir F2 para STORY-173 y STORY-174 y citar a STORY-173 en el reparto de CS-15 de las Notas | PO — **resuelto a mano el 2026-10-29 a pedido del usuario, fuera de este skill** (backup `epic.md.bak`): línea F2 de STORY-165 reescrita, F2 de STORY-173 y STORY-174 añadidas y Notas actualizadas |

## Siguiente paso

Ejecutar `/story-analyze STORY-165` para verificar la coherencia del plan corregido.
