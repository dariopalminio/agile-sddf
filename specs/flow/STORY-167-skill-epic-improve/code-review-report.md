---
type: code-review-report
story: STORY-167
title: "Code Review Report: Skill epic-improve"
verdict: APPROVED
date: 2026-10-30
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-167

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Ronda 2: las dos correcciones MEDIUM de `fix-directives.md` (ronda 1) son efectivas. Los evals ahora califican los bloques `=== FILE: … ===` y TC-008 revalida AC-1; el ancla de inserción de `correction-rules.md` §3 resuelve el caso de secciones contiguas ausentes. Los cuatro revisores aprueban y solo quedan mejoras LOW opcionales.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-167 — Skill epic-improve |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-improve/evals/evals.json:7 | Los efectos en disco solo se comprueban en la transcripción simulada (modo en seco). El runner ya tiene un modo `sandbox` (`scripts/run-evals.js:539-563`) que ejecuta sobre una copia desechable. Ese modo califica `expected.files.written` (lista exacta) y `backups` (`.bak` idéntico al original), y `epic-refine` lo usa en TC-023 y TC-024. Por eso no se verifica byte a byte que `epic.md.bak` sea igual al original, ni que no se escriba ningún otro archivo: solo se excluyen los prefijos de reporte y de `STORY-`. | Opcional: añadir casos `sandbox` con `fixture: skills/epic-improve/examples/sin-criterios-de-salida`. Para TC-001: `written: [epic.md, epic.md.bak]`, `backups` y `files.contains` de `## Criterios de salida`. Para TC-003 y TC-004: `written: []`. |
| LOW | skills/epic-improve/evals/evals.json:23 | Las aserciones de TC-001, TC-002 y TC-006 se aplican a toda la salida, no a cada archivo. `updated: 2026-10-20`, `status: DEFINE` y `substatus: IN-PROGRESS` se cumplen solo con el bloque `.bak`. Un `epic.md` que cambiara a otro estado no terminal (p. ej. `status: PLAN`) pasaría, porque `not_contains` solo excluye `COMPLETED` y `DONE`. | Usar literales multilínea anclados al bloque. Por ejemplo, `"=== FILE: specs/flow/EPIC-90-exportacion-de-reportes/epic.md ===\n---\ntype: epic"` seguido de `"status: DEFINE\nsubstatus: IN-PROGRESS"`. O bien `files.contains` por ruta en un caso `sandbox`. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-improve/evals/evals.json:7 | Los efectos en disco de AC-1, AC-3 y AC-4 solo se comprueban en la transcripción simulada. Son los bloques `=== FILE:` que un runner de solo lectura dice que escribiría. `scripts/run-evals.js` ya admite el modo `sandbox` (l. 11-13 y 160-163: ejecución real sobre una copia desechable, calificada con `expected.files.written` / `contains` / `backups`). `epic-refine` lo usa para lo mismo en TC-023…TC-025, pero `epic-improve` no tiene ningún caso `sandbox`. Además, `implement-report.md` dice que sigue el «patrón de `epic-refine`», y eso solo vale para los casos en seco. Es el mismo criterio que la revisión de STORY-165 usó para su AC-3: cada paso tiene aserción, así que no bloquea. | Opcional: añadir casos `sandbox` con `fixture: skills/epic-improve/examples/sin-criterios-de-salida`. Para AC-1, `files.written` exacto `[epic.md, epic.md.bak]`, `backups: { "epic.md.bak": "original" }` y `files.contains` de `status: DEFINE` / `## Criterios de salida` en `epic.md`. Para AC-3 (respuesta `n`) y AC-4 (fixture `aprobada`), `files.written: []`. Corregir la frase del implement-report. |
| LOW | skills/epic-improve/evals/evals.json:23-26 | Las aserciones de TC-001 sobre `status: DEFINE`, `substatus: IN-PROGRESS` y `updated: 2026-10-20` buscan en toda la salida. El bloque `epic.md.bak`, que tiene el contenido previo, ya las satisface, así que no prueban que el `epic.md` corregido conserve `status`/`substatus` («`status` y `substatus` de la épica no cambian»). Tampoco se verifica que el backup se cree **antes** de escribir. El `not_contains` de `status: COMPLETED` / `substatus: DONE` atenúa el hueco. | Con un caso `sandbox`, usar `expected.files.contains` por ruta (`epic.md` → `status: DEFINE`, `substatus: IN-PROGRESS`, `updated: 2026-10-30`). Así cada aserción se ata a su archivo. |
| LOW | skills/epic-improve/evals/evals.json:64-72 | AC-2 exige que los criterios que no se pueden inferir no se escriban en `epic.md`. TC-002 lo cubre de forma indirecta: no salen `CS-1` ni placeholders. Pero no comprueba que la sección `## Criterios de salida` no se inserte vacía en el bloque `epic.md` (`correction-rules.md` §3, paso 5). | Opcional: con `sandbox`, `files.not_contains` de `epic.md` → `## Criterios de salida`. En el modo en seco esta aserción sería frágil, porque el plan puede nombrar la sección en la lista de decisiones del PO. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-167-skill-epic-improve/design.md:168 | La regla del ancla (ronda 1) solo está en `correction-rules.md` §3 y en `implement-report.md`. `design.md` D-4 sigue diciendo «en la posición que indica `Ubicación`» y no tiene un CR que registre el ajuste (DoD IMPLEMENT #19 ⚠️, `design.md` fuera de la lista blanca). No tiene impacto funcional: el catálogo concreta la regla sin cambiar el contrato. | En un ciclo con permiso sobre `design.md`, añadir un CR-004 de «ajuste de implementación» que remita a `correction-rules.md` §3 (paso 3 a paso 6). |
| LOW | skills/epic-improve/references/correction-rules.md:53 | El paso 4 inserta «justo antes del siguiente encabezado `## ` posterior al ancla» y define `al inicio del cuerpo` como «antes del primer `## `», pero no excluye los encabezados de dentro de bloques de código. `SKILL.md:93` sí lo hace al extraer el template. Una línea `## ` dentro de un bloque cercado (por ejemplo, en `Notas`) desplazaría la inserción. | Precisar «siguiente encabezado `## ` fuera de bloques de código», en línea con el Paso 3.1 de `SKILL.md`. |
| LOW | skills/epic-improve/evals/evals.json:1 | Ningún caso ni fixture ejercita la resolución del ancla con secciones contiguas ausentes: todos los `seccion-faltante` de las fixtures tienen la predecesora (`Historias`) presente. La regla se verifica solo por revisión. | Opcional: añadir una fixture sin `Historias` ni `Criterios de salida` que compruebe que la sección se inserta tras `## Alcance` (ejecución a criterio humano). |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (40 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (18 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia lista para `/story-verify STORY-167`. Siguen pendientes, a criterio humano, `npm run test:eval -- epic-improve` (TC-001…TC-008) y SMOKE-4. Los hallazgos LOW pueden abordarse en una historia posterior (casos `sandbox` para `epic-improve`, CR-004 en `design.md`, encabezados dentro de bloques de código).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌; los ⚠️ requieren ejecución de evals/CI — no evaluable desde artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skill en español, en `skills/epic-improve/`, Markdown sin scripts nuevos; ningún revisor reporta desvíos |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1…AC-4 cubiertos por TC-001…TC-004 y TC-008 con aserciones sobre bloques FILE |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: coherente con D-4/D-5/D-7/D-9; template central = seed byte a byte |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW en los cuatro informes |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 30/30 tareas `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `status: CODE-REVIEW`, `substatus: DONE`, `updated: 2026-10-30` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
