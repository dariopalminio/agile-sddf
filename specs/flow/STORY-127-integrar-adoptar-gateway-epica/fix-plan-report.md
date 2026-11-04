---
type: fix-plan-report
id: STORY-127
slug: STORY-127-fix-plan-report
title: "Fix plan: Integrar y documentar el gateway de validación de épicas"
story: STORY-127
analyze-updated: 2026-10-29
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "sin ERROR; WARNING de tipo C, D, E"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 3
findings-applied: 2
findings-resolved: 0
findings-out-of-scope: 1
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-127-integrar-adoptar-gateway-epica
---

# Fix plan: Integrar y documentar el gateway de validación de épicas

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · sin ERROR; WARNING de tipo C, D, E |
| Modo | corrige advertencias (restringido por el usuario a INC-001 e INC-003) |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 3 (INC 3 · HAL 0 · REC 0 · DOD 0); REC-1, REC-2 y REC-3 se adjuntan a INC-001, INC-002 e INC-003; la fila `⚠️` del DoD («decisiones aplazadas») remite a INC-003 |
| Aplicados | 2 |
| Ya resueltos | 0 |
| Fuera de alcance | 1 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | La ruta de degradación de T001/T002 nombra T005 y T006 en lugar de T006 y T007 (C1 y C2) | Aplicable — tasks.md | C-01, C-02 |
| INC-002 | WARNING | Dos textos de epic.md desactualizados respecto de STORY-127 | Fuera de alcance (epic.md; además, no seleccionado por el usuario) | — |
| INC-003 | WARNING | Premisa falsa: `verify:links` no valida el enlace de C2 en `state-machine.md` | Aplicable — design.md, tasks.md | C-03, C-04, C-05, C-06 |

## Plan de cambios aplicado

### C-01 — tasks.md › T001

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «Si falta alguno, ejecutar solo T005 y T006, dejar el resto pendiente…»
- **Después:** «Si falta alguno, ejecutar solo T006 y T007 (C1 y C2, que no dependen del skill) y T005 si la fila de `epic-validate` ya existe, dejar el resto pendiente…»
- **Referencias actualizadas:** ninguna (coincide con design.md › Risks, segundo riesgo, y con la condición propia de T005)

### C-02 — tasks.md › T002

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «…y continuar solo con T005 y T006»
- **Después:** «…y continuar solo con T006 y T007»
- **Referencias actualizadas:** ninguna

### C-03 — design.md › Interfaces › «Remisión desde C2»

- **Origen:** INC-003 [WARNING]
- **Operación:** modificar
- **Antes:** el enlace «…que `npm run verify:links` valida con el algoritmo de anclas de GitHub de `scripts/check-doc-links.js`»
- **Después:** `verify:links` no lo valida (`ACTIVE_ROOTS` no incluye `docs/architecture/` y el tratamiento de diacríticos difiere entre encabezado y fragmento); la coincidencia del fragmento con el ancla de GitHub del encabezado de C1 se comprueba en la revisión documental (contrato de verificación 1)
- **Referencias actualizadas:** contrato de verificación 1 (C-04), T014 (C-05)

### C-04 — design.md › Contratos de verificación #1 y #8

- **Origen:** INC-003 [WARNING]
- **Operación:** modificar
- **Antes:** #1 no incluía C2; #8 decía «`npm run verify:repository` (incluye `verify:links` sobre el enlace de C2) y `npm test` pasan»
- **Después:** #1 agrega «el enlace de C2 apunta al ancla del encabezado de C1» y suma CNF-1 a su columna AC; #8 queda «`npm run verify:repository` y `npm test` pasan»
- **Referencias actualizadas:** T014 (contrato 1), T015 (contrato 8)

### C-05 — tasks.md › T014

- **Origen:** INC-003 [WARNING]
- **Operación:** modificar
- **Antes:** «Revisar que C5, C6, C1 y C7 quedaron como describe design.md (contrato de verificación 1)»
- **Después:** «Revisar que C5, C6, C1, C2 y C7 quedaron como describe design.md y que el fragmento del enlace de T007 (`#gateway-de-validación-de-épicas`) coincide con el ancla de GitHub del encabezado de T006 (contrato de verificación 1)»
- **Referencias actualizadas:** ninguna

### C-06 — tasks.md › T015

- **Origen:** INC-003 [WARNING]
- **Operación:** modificar
- **Antes:** «Ejecutar `npm run verify:links` (valida el ancla de T007), …»
- **Después:** «Ejecutar `npm run verify:links`, …» (se mantiene porque sí revisa los enlaces de C1 en `docs/guides/`)
- **Referencias actualizadas:** ninguna

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Reemplazar en T001 solo por «T006 y T007», sin T005 | La recomendación lo deja opcional; se incluye T005 de forma condicional porque solo depende de la fila de STORY-124 y la propia T005 ya prevé quedar pendiente |
| INC-003 | (a) Ampliar C3/T008 para comparar el fragmento del enlace de `state-machine.md` con el slug del encabezado de C1 | La recomendación no indica preferencia; (b), la revisión manual en T014, es el cambio más pequeño y deja coherentes los archivos del plan |
| INC-003 | Agregar `docs/architecture/` a `ACTIVE_ROOTS` o corregir los diacríticos en `check-doc-links.js` | Fuera del alcance de la historia según analyze.md; no se registró CR |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-002 | specs/flow/EPIC-23-completar-flujo-de-epic/epic.md | Reescribir la línea de STORY-127 en «Historias» › Fase VALIDATE y sacar STORY-127 de «STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED`» en «Notas» › «Alineación pendiente» | PO o skills de épica |

## Siguiente paso

Ejecutar `/story-analyze STORY-127` para verificar la coherencia del plan corregido.
