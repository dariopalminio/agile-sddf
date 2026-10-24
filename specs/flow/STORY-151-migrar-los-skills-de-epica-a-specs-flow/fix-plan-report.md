---
type: fix-plan-report
id: STORY-151
slug: STORY-151-fix-plan-report
title: "Fix plan: Migrar los skills de épica a specs/flow"
story: STORY-151
analyze-updated: 2026-10-22
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "sin ERROR; WARNING de tipo C, D"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 4
findings-applied: 2
findings-resolved: 1
findings-out-of-scope: 1
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-151-migrar-los-skills-de-epica-a-specs-flow
---

# Fix plan: Migrar los skills de épica a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · sin ERROR; WARNING de tipo C, D |
| Modo | corrige advertencias |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 4 (INC 2 · HAL 0 · REC 2 · DOD 0) |
| Aplicados | 2 |
| Ya resueltos | 1 |
| Fuera de alcance | 1 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | T007 solo sustituye `$EPICS_DIR` en la Fase 2; la variable reaparece en la Fase 4 (l. 80) | Aplicable — tasks.md, design.md | C-01, C-02 |
| INC-002 | WARNING | El alcance y las dependencias de story.md no coinciden con el diseño (`epic-refine`, STORY-147, CNF-2) | Fuera de alcance — story.md | — |
| REC-3 | WARNING | El RED esperado de T004 cita R4 solo en `epic-from-project-plan`, pero aparece en los seis skills | Aplicable — tasks.md | C-03 |
| REC-4 | WARNING | Respetar las precondiciones (STORY-147 y STORY-148) | Ya resuelto: T001 ya las comprueba | — |

## Plan de cambios aplicado

### C-01 — tasks.md › T007

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «Fase 2 usa el literal `specs/flow/` en lugar de `$EPICS_DIR`, calcula `$MAX_EPIC`…»
- **Después:** «toda aparición de `$EPICS_DIR` pasa al literal `specs/flow/` (Fase 2, l. 52 y 54, y Fase 4, l. 80), sin dejar la variable definida ni usada; Fase 2 calcula `$MAX_EPIC`…»
- **Referencias actualizadas:** espejo en design.md (C-02)

### C-02 — design.md › D-2 › Alternativas rechazadas › «Variable nueva…»

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «`$EPICS_DIR` de `epic-from-project-plan` se sustituye por el literal `specs/flow/`.»
- **Después:** se añade «en todas sus apariciones (Fase 2, l. 52 y 54; Fase 4, l. 80)»
- **Referencias actualizadas:** ninguna

### C-03 — tasks.md › T004

- **Origen:** REC-3 [WARNING]
- **Operación:** modificar
- **Antes:** «falla con errores R1, R3 y R4 (este último en `epic-from-project-plan`)»
- **Después:** «falla con errores R1, R3 y R4 en los seis skills (el paso 2 del bloque v1 combina `root` y `sddf.config.yaml` en una línea)»
- **Referencias actualizadas:** ninguna

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Aplicar la sustitución durante la implementación de T007, sin tocar el plan | El modo advertencias pide resolverla en el plan; así T007 queda verificable tal como está escrita |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-002 | story.md › «📎 Notas / contexto adicional» y «⚙️ Criterios no funcionales» › CNF-2 | Reformular como condicional la ampliación a `epic-refine` (CR-001); declarar «Depende de STORY-147 y STORY-148» y el retiro de los seis skills de `PENDING_MIGRATION` (CR-002); añadir a CNF-2 «ni se recrea una historia archivada» (CR-003). No cambia los ACs | `/story-refine` o PO |

## Siguiente paso

Ejecutar `/story-analyze STORY-151` para verificar la coherencia del plan corregido.
