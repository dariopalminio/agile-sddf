---
type: fix-plan-report
id: STORY-170
slug: STORY-170-fix-plan-report
title: "Fix plan: Skill epic-ship"
story: STORY-170
analyze-updated: 2026-10-29
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "sin ERROR; WARNING de tipo C, D"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 2
findings-applied: 2
findings-resolved: 0
findings-out-of-scope: 1
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-170-skill-epic-ship
---

# Fix plan: Skill epic-ship

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · sin ERROR; WARNING de tipo C, D |
| Modo | corrige advertencias |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 2 (INC 2 · HAL 0 · REC 0 · DOD 0; REC-1 y REC-2 adjuntas a INC-001 e INC-002; REC-3 es una nota de coordinación sin hallazgo) |
| Aplicados | 2 (INC-002 parcialmente) |
| Ya resueltos | 0 |
| Fuera de alcance | 1 (la parte de INC-002 en `epic.md`) |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | Contrato 6 (UTF-8 sin BOM de los archivos que escribe el skill) sin tarea que lo ejecute | Aplicable — tasks.md, design.md | C-01, C-02 |
| INC-002 | WARNING | CS-20 no menciona `state-machine.md`; la corrección de `validate-report.md` en §9 no tiene historia dueña | Aplicable — design.md, tasks.md · Fuera de alcance — epic.md | C-03, C-04, C-05 |

## Plan de cambios aplicado

### C-01 — tasks.md › T032

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** recorrido SMOKE-7 que comprueba con `git log` y `git tag` que no hay commits ni tags // AC-1…AC-4
- **Después:** además comprueba con `head -c3` que `CHANGELOG.md`, `<EPIC_DIR>/release-notes.md` y `epic.md` no empiezan por `EF BB BF` (Contrato 6) // AC-1…AC-4, CNF-3
- **Referencias actualizadas:** ninguna

### C-02 — design.md › Contratos de verificación › Contrato 6

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «Archivos escritos en UTF-8 sin BOM» · «Revisión de evals (primer byte ≠ `EF BB BF`)»
- **Después:** «`CHANGELOG.md`, `release-notes.md` y `epic.md` escritos en UTF-8 sin BOM» · «Revisión manual en el recorrido SMOKE-7 (`head -c3` ≠ `EF BB BF`)», el método que ejecuta T032
- **Referencias actualizadas:** T032 cita el Contrato 6

### C-03 — design.md › Componentes › «Ciclo de vida de épica»

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** §9 (`release-notes.md`); AC: CS-20
- **Después:** §9 (`release-notes.md` y nombre del reporte de `VALIDATE`), con la responsabilidad de nombrar `epic-validate-report.md` (CR-001); AC: CS-20, AC-3
- **Referencias actualizadas:** CR-001 (acción requerida y documento afectado) y CR-002 (documento afectado y acción sobre CS-20)

### C-04 — design.md › Registro de Cambios › CR-001 y CR-002

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** CR-001 dejaba el nombre de §9 a STORY-127 («esta historia no lo toca»); CR-002 no citaba CS-20
- **Después:** CR-001: esta historia corrige `validate-report.md` → `epic-validate-report.md` al editar §9, y la épica lo registra en CS-20. CR-002: añade `state-machine.md` también al texto de CS-20
- **Referencias actualizadas:** T020 (C-05)

### C-05 — tasks.md › T020

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** «§9 `release-notes.md` → generado por `epic-ship` en `SHIP` (no tocar `validate-report.md`, CR-001)» // CS-20
- **Después:** «§9 `release-notes.md` → generado por `epic-ship` en `SHIP` y `validate-report.md` → `epic-validate-report.md` (CR-001)» // CS-20, AC-3
- **Referencias actualizadas:** ninguna

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Añadir una aserción de BOM a los evals (T017) | Los evals de este repo validan la salida del chat (`contains`/`not_contains`), no los bytes de los archivos escritos; la recomendación prefiere ampliar T032 |
| INC-002 | Asignar a STORY-127 la corrección de `validate-report.md` | T020 ya edita §9 de `domain-epic-lifecycle`: corregirlo aquí evita una segunda edición del mismo párrafo en otra historia y deja a STORY-127 sin trabajo ajeno a su alcance |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-002 | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` (CS-20 y nota de historias dueñas) | Añadir `docs/architecture/state-machine.md` y el nombre `epic-validate-report.md` a CS-20, y anotar en STORY-170 la parte nueva. **Aplicado a pedido del usuario fuera de este skill** (mismo turno) | PO |

## Siguiente paso

Ejecutar `/story-analyze STORY-170` para verificar la coherencia del plan corregido.
