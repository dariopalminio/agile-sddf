---
type: fix-plan-report
id: STORY-139
slug: STORY-139-fix-plan-report
title: "Fix plan: Alinear epic-analyze"
story: STORY-139
analyze-updated: 2026-10-17
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "⚠️ Advertencias (0 ERROR, 2 WARNING)"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 3
findings-applied: 2
findings-resolved: 1
findings-out-of-scope: 0
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-139-alinear-epic-analyze
---

# Fix plan: Alinear epic-analyze

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · ⚠️ Advertencias (0 ERROR, 2 WARNING) |
| Modo | corrige advertencias |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 3 (INC 2 · HAL 0 · REC 1 · DOD 0); REC-1 y REC-2 se adjuntan a INC-001 e INC-002 |
| Aplicados | 2 |
| Ya resueltos | 1 |
| Fuera de alcance | 0 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | El método de V-4 / T019 (`grep -i veredicto` solo en frontmatter y `## Veredicto`) no puede cumplirse: el frontmatter usa `verdict:` y el comentario de `## Notas del análisis` (template l.61) menciona «veredicto» | Aplicable — design.md, tasks.md | C-01, C-02 |
| INC-002 | WARNING | D-8, T014 y T016 no coinciden con `evals.json`: TC-006/TC-024 ya afirman `errors: 0`; solo 7 de los 11 casos con ERROR afirman `errors: 1`; TC-005/TC-013 usan `"BLOCKED"` a secas en `not_contains` | Aplicable — design.md, tasks.md | C-03, C-04, C-05, C-06, C-07, C-08 |
| REC-3 | — | Dependencia de `docs/policies/validation-contract-policy.md` (STORY-138) | Ya resuelto: T001 y D-10 detienen la implementación hasta que la policy exista | — |

## Plan de cambios aplicado

### C-01 — design.md › Contratos de verificación › V-4

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** `grep -n -i 'veredicto' …` solo aparece en el frontmatter y en la sección `## Veredicto`
- **Después:** `grep -n -i 'veredicto' …` solo coincide dentro de `## Veredicto` (encabezado, comentario guía y línea `**Veredicto:**`) y en el comentario guía de `## Notas del análisis`, que no declara un valor; `grep -n -F -e '| Veredicto |'` no devuelve nada
- **Referencias actualizadas:** T019 (C-02)

### C-02 — tasks.md › T019

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** la parte V-4 de T019 esperaba coincidencias solo en el frontmatter y en `## Veredicto`
- **Después:** el mismo criterio que C-01
- **Referencias actualizadas:** ninguna

### C-03 — design.md › D-8 › viñeta «11 casos con ERROR»

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** «Se conservan sus `errors: 1` (CNF-1)»
- **Después:** `"errors: 1"` se conserva en los 7 casos que ya lo afirman y no se añade a TC-003, TC-017, TC-026 ni TC-027 (TC-027 tiene dos ERROR: INT-06 e INT-02)
- **Referencias actualizadas:** T014 (C-06)

### C-04 — design.md › D-8 › viñeta «TC-006 y TC-024»

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** se añaden `**Veredicto:** NEEDS-REFINEMENT`, `"errors: 0"` y `"## Veredicto"`
- **Después:** ya afirman `"verdict: NEEDS-REFINEMENT"` y `"errors: 0"` y tienen `"verdict: BLOCKED"` en `not_contains`; solo se añaden `"## Veredicto"` y la línea `**Veredicto:**`
- **Referencias actualizadas:** T016 (C-07)

### C-05 — design.md › D-8 › viñeta nueva «TC-005 y TC-013»

- **Origen:** INC-002 [WARNING]
- **Operación:** añadir
- **Antes:** —
- **Después:** en TC-005 y TC-013, el `"BLOCKED"` a secas de `not_contains` se sustituye por `"verdict: BLOCKED"`, para aplicar D-6 de forma uniforme
- **Referencias actualizadas:** T026 (C-08)

### C-06 — tasks.md › T014

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** «conservar `errors: 1`»
- **Después:** conservar `"errors: 1"` en los 7 casos que ya lo afirman, sin añadirlo a TC-003, TC-017, TC-026 ni TC-027
- **Referencias actualizadas:** ninguna

### C-07 — tasks.md › T016

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** añadir `"## Veredicto"`, la línea `**Veredicto:**` y `"errors: 0"` a `contains`
- **Después:** añadir a `contains`, si faltan, `"## Veredicto"` y la línea `**Veredicto:**`; `"verdict: NEEDS-REFINEMENT"` y `"errors: 0"` ya existen y se conservan
- **Referencias actualizadas:** ninguna

### C-08 — tasks.md › 5. Evals del skill › T026 (nueva)

- **Origen:** INC-002 [WARNING]
- **Operación:** añadir
- **Antes:** —
- **Después:** `- [ ] T026 TC-005 y TC-013 (casos APPROVED): sustituir en not_contains el "BLOCKED" a secas por "verdict: BLOCKED" — D-6, D-8`. Va justo después de T016 y antes de T017, que valida el JSON al final del grupo. Toma el siguiente ID libre, sin renumerar
- **Referencias actualizadas:** ninguna; V-7 / T021 siguen siendo válidos (`"verdict: BLOCKED"` solo en `not_contains`)

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Patrón de expresión regular `'\| Veredicto \||\*\*Veredicto:\*\*'` | Dentro de una tabla Markdown los `\|` escapados resultan ambiguos. `grep -F` con `-i veredicto` expresa lo mismo y además comprueba que el comentario de `## Resumen` no mencione el veredicto |
| INC-002 | Conservar `"BLOCKED"` a secas en TC-005 y TC-013 | La recomendación prefiere `"verdict: BLOCKED"` para aplicar D-6 de forma uniforme |

## Fuera de alcance

Ninguno.

## Siguiente paso

Ejecutar `/story-analyze STORY-139` para verificar la coherencia del plan corregido.
