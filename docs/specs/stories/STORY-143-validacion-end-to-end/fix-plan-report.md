---
type: fix-plan-report
id: STORY-143
slug: STORY-143-fix-plan-report
title: "Fix plan: Validación end-to-end"
story: STORY-143
analyze-updated: 2026-10-17
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "⚠️ Advertencias (0 ERRORES, 4 WARNINGS)"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 4
findings-applied: 2
findings-resolved: 0
findings-out-of-scope: 2
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-143-validacion-end-to-end
---

# Fix plan: Validación end-to-end

> **Nota de ejecución.** `analyze.md` no declara `verdict` en su frontmatter, porque `story-analyze` aún no emite ese campo (lo añade STORY-144). Por eso el Paso 2 del skill habría terminado sin cambios. El mantenedor decidió aplicar igualmente las advertencias INC-001 e INC-002. `analyze-verdict: APPROVED` se infiere de que no hay ERRORES y de que `story-analyze` dejó `story.md` en `READY-FOR-IMPLEMENT/DONE`.

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` (inferido; campo ausente) · ⚠️ Advertencias (0 ERRORES, 4 WARNINGS) |
| Modo | corrige advertencias (solo INC-001 e INC-002, a petición del mantenedor) |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 4 (INC 4 · HAL 0 · REC 4, adjuntas a su INC · DOD 1, adjunto a INC-001) |
| Aplicados | 2 |
| Ya resueltos | 0 |
| Fuera de alcance | 2 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 (+ REC-1, DOD-1) | WARNING | T005/V-1 exigían que `parsePolicyContract` omitiera filas sin `SKILL.md`, mientras que T013 y su firma pura lo impiden | Aplicable: design.md, tasks.md | C-01, C-02, C-03, C-04 |
| INC-002 (+ REC-2) | WARNING | La firma `verifyValidationContract(repoRoot)` del diseño no recogía `options.legacyExceptions` de T010/T018 | Aplicable: design.md | C-05 |
| INC-003 (+ REC-3) | WARNING | CR-001 amplía las exclusiones de CS-10/SMOKE-3/AC-2 | Fuera de alcance (no solicitado; exige story.md y epic.md) | — |
| INC-004 (+ REC-4) | WARNING | Dependencia con STORY-144/145, todavía sin diseño (CR-002) | Fuera de alcance (no solicitado; exige otras historias) | — |

## Plan de cambios aplicado

### C-01 — design.md › D-2 › «Filas sin skill instalado»

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «… (`epic-validate`, previsto en EPIC-23) se omite. Si el skill existe y no tiene template registrado (D-3), es un error.»
- **Después:** «… se omite. `parsePolicyContract` la devuelve como las demás, porque solo lee texto; la omite `verifyValidationContract`, que consulta el filesystem. Si el skill existe …»
- **Referencias actualizadas:** ninguna. Coincide con T013 («El filtrado … lo hace el orquestador») y T018 («filtrar las filas de §4 sin `skills/<skill>/SKILL.md`»).

### C-02 — design.md › Contratos de verificación › V-1

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «…; omite una fila sin skill instalado»
- **Después:** «…; devuelve también las filas de skills no instalados (las omite `verifyValidationContract`, D-2)»
- **Referencias actualizadas:** T005 (C-03) y T011 (C-04).

### C-03 — tasks.md › T005

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «…; omite la fila de un skill sin `SKILL.md` en el fixture (`epic-validate`); …»
- **Después:** «…; devuelve también la fila de un skill no instalado (`epic-validate`), porque el filtrado por `SKILL.md` no es suyo (T011); …»
- **Referencias actualizadas:** T013 («Hace pasar V-1 (T005)») ahora puede cumplirse sin contradecir la firma pura.

### C-04 — tasks.md › T011 (degradación F-4)

- **Origen:** INC-001 [WARNING]
- **Operación:** añadir (cláusula dentro de la tarea existente)
- **Antes:** «… template ausente → `G-01` «template no encontrado» sin cortar la validación de los demás; skill de §4 con `SKILL.md` …»
- **Después:** «…; fila de §4 sin `skills/<skill>/SKILL.md` en el fixture (`epic-validate`) → se omite sin error; skill de §4 con `SKILL.md` …»
- **Referencias actualizadas:** T018 («Hace pasar V-7 y la degradación de T011») cubre la nueva prueba con su paso de filtrado.

### C-05 — design.md › Interfaces › `verifyValidationContract`

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** «`verifyValidationContract(repoRoot)` | → `{ errors: string[], counts: { templates, examples, files } }`»
- **Después:** «`verifyValidationContract(repoRoot, options?)` | `options.legacyExceptions` (opcional; por defecto `LEGACY_EXCEPTIONS`, para inyectar excepciones en las pruebas) → `{ errors: string[], counts: { templates, examples, files } }`»
- **Referencias actualizadas:** ninguna. T010 y T018 ya usaban la firma ampliada.

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Pasar a `parsePolicyContract` un conjunto de skills instalados para que filtre ella misma | Cambia la firma pura de Interfaces y contradice T013. La recomendación prefiere mover la prueba al orquestador. |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-003 | story.md (AC-2), epic.md (CS-10, SMOKE-3) | Confirmar CR-001 y ampliar el `Pero` de AC-2 y el texto de CS-10/SMOKE-3 | PO (`/story-improve` para story.md) |
| INC-004 | STORY-144, STORY-145 | Incluir en sus inventarios los ejemplos de CR-002 al planificarlas | `/story-plan STORY-144`, `/story-plan STORY-145` |

## Siguiente paso

Ejecutar `/story-analyze STORY-143` para verificar la coherencia del plan corregido.
