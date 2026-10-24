---
type: code-review-report
story: STORY-149
title: "Code Review Report: sddf-init crea el nuevo layout"
verdict: APPROVED
date: 2026-10-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-149

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos y aprobaron. Solo hay 10 hallazgos `LOW` no bloqueantes (4 de calidad, 3 de cobertura, 3 de integración) y ninguno de seguridad. Los más relevantes son que los evals de `sddf-init` no se han ejecutado todavía (queda a criterio humano) y que el estado mixto con `--level full` depende de la migración de `memory-system` (STORY-152, CR-002).

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-149 — sddf-init crea el nuevo layout |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-23 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/sddf-init/SKILL.md:Paso 1 | El Paso 1 ya no explica cómo se determina `REPO_ROOT` ni `CLI_ROOT`, solo que "se resuelve". La versión anterior tampoco lo detallaba para `CLI_ROOT`, por lo que no es una regresión. | Confirmar con el autor si basta con la convención del resto de skills. Una línea que defina `REPO_ROOT` (por ejemplo, el directorio de trabajo con `.git`) evitaría ambigüedad entre runtimes. |
| LOW | skills/sddf-init/SKILL.md:Paso 5b | En estado mixto con nivel `full`, `memory-system scaffold` aún crea `docs/specs/epics/` y `docs/specs/stories/` (CR-002, documentado en `implement-report.md` y diferido a STORY-152). Eso contradice "`docs/specs/` no se modifica" del Paso 1b. | Sin acción en esta historia. Verificar que STORY-152 retire esa creación. Si se prefiere, añadir una nota explícita en el Paso 5b para el estado mixto. |
| LOW | skills/sddf-init/evals/evals.json | Al reescribirse con `JSON.stringify` los arreglos `contains`/`not_contains`/`flags` pasaron de inline a multilínea, y `1.0` pasó a `1`. El diff queda inflado (reconocido en `implement-report.md`). Solo afecta al formato. | Opcional: restaurar el formato inline original para facilitar futuras revisiones. No bloquea. |
| LOW | test/sddf-init-layout.test.js:14-24 | `listFiles` reimplementa un recorrido recursivo de directorios similar a `collectSupportFiles` en `scripts/verify-fixed-layout.js`. Es duplicación menor y tolerable en una prueba autocontenida. | Opcional: exportar y reutilizar el helper si aparece una tercera copia. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/sddf-init/evals/evals.json:17 | AC-1 exige `.gitkeep` en cada uno de los cuatro directorios, pero el caso TC-001 no lo incluye en `expected.contains`; el eval no verificaría que el informe/ejecución cree los `.gitkeep`. La prueba determinista solo comprueba que `SKILL.md` nombra `.gitkeep` (test/sddf-init-layout.test.js:75). | Añadir `.gitkeep` (o la línea correspondiente) a `contains` de TC-001. |
| LOW | test/sddf-init-layout.test.js:69 | AC-1, AC-2 y AC-3 (comportamiento observable de `sddf-init`) se verifican solo mediante presencia de tokens literales en `SKILL.md` y por evals de un LLM aún no ejecutados (`implement-report.md`, Registro T027); el sandbox manual fue evidencia no automatizada. Es inherente a que el skill es Markdown ejecutado por un LLM, y AC-4/CNF-2/CNF-3 sí tienen cobertura determinista sólida. | Ejecutar `npm run test:eval -- sddf-init` manualmente (criterio humano, regla del proyecto) antes de DONE para confirmar TC-001 a TC-004. |
| LOW | skills/sddf-init/evals/evals.json:44 | AC-3 pide que no se sobrescriban archivos existentes en `specs/` ni `workflow/`; TC-002 solo asserta ausencia de `[CREADO]` e informe de "ya existe", sin un chequeo explícito de no-modificación del contenido. | Opcional: agregar a `contains` el `[YA EXISTÍA]  specs/flow/` y similares para trazar el no-overwrite por directorio. |

Mapeo de escenarios:
- AC-1 (repo limpio): Paso 2 de `SKILL.md`, Paso 2b, Paso 3 (config sin `root`); eval TC-001. Cubierto.
- AC-2 (layout legado): Paso 1b; evals TC-003 y TC-004; prueba determinista del literal de deprecación y de la ruta de la guía. Cubierto.
- AC-3 (re-ejecución): Paso 2 (`[YA EXISTÍA]`, `[INFO] El layout fijo ya existe`); eval TC-002. Cubierto.
- AC-4 (sin resolución legada): pruebas deterministas en test/sddf-init-layout.test.js:39, :49 y :57. Cubierto.
- CNF-1 a CNF-3: cubiertos (Paso 1b + TC-003; test/sddf-init-layout.test.js:83 y :64).

---

### Integración y Arquitectura (Integration-Reviewer)

Verificado contra `design.md` (D-1 a D-11): los 7 componentes declarados existen, no hay componentes sin documentar, `grep` de AC-4 sin coincidencias y las pruebas relacionadas pasan (`sddf-init-layout` 6/6, `sddf-constitution` + `profile-contract` 11/11, `verify-fixed-layout.js` exit 0 con `sddf-init` fuera de `PENDING_MIGRATION`).

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/sddf-init/SKILL.md:183-205 (Paso 5b) | El Paso 5b afirma que `memory-system` "usa `docs/` como base de sus capas", pero `memory-system` aún no está migrado (STORY-152) y su scaffold crea `docs/specs/epics/` y `docs/specs/stories/` (`skills/memory-system/SKILL.md:503`). En `--level full` sobre un repo limpio queda el estado mixto previsto por CR-002. Es un acoplamiento transitorio documentado en design.md, sin impacto sobre AC-1 (nivel por defecto). | Mantener CR-002 como dependencia explícita de STORY-152; opcionalmente anotar en el Paso 5b que el scaffold aún puede crear `docs/specs/` hasta esa migración. |
| LOW | skills/sddf-init/evals/evals.json (TC-010) | TC-010 (`--level full` idempotente) declara en su contexto que "No existe docs/specs/", pero con `memory-system` sin migrar, una primera ejecución `full` sí crea `docs/specs/`, por lo que la segunda ejecución real caería en estado mixto (aviso de deprecación). El eval describe el estado objetivo, no el actual. | Revisar el contexto de TC-010 cuando se migre `memory-system` (STORY-152); hasta entonces el eval puede divergir del comportamiento real. |
| LOW | skills/sddf-init/SKILL.md:260-295 (Paso 6) | El ejemplo `full` y el cierre de segunda ejecución (`preservados: 24`) muestran rutas del scaffold de `memory-system` sin el caso mixto (aviso de D-5 más scaffold). Sin impacto funcional; el diseño lo cubre en F-4. | Sin acción obligatoria; considerar un ejemplo del estado mixto al migrar `memory-system`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (25 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

Nota del revisor: no ejecutó los checks basados en `git ls-files` (archivos con credenciales, artefactos binarios o generados, cobertura de `.gitignore`).

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (7 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

La historia queda en `CODE-REVIEW/DONE`, lista para `/story-verify STORY-149`. Antes de cerrar, a criterio humano: ejecutar `npm run test:eval -- sddf-init` (TC-001 a TC-004) y revisar los 15 fallos preexistentes de `npm test` (epic-template / migración de épicas), ajenos a esta historia.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-code-review.md` (enforcement: `error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 15/24 ✓, 9 ⚠️, 0 ❌. Los ⚠️ requieren evals, CI o linter externos y no son evaluables desde los artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer: respeta las convenciones de `constitution.md` |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 a AC-4 cubiertos |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: consistente con D-1 a D-11 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima: LOW |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | 27/27 tareas `[x]`, 0 pendientes |
| 7 | Metadatos frontmatter de `story.md` completos y correctos | ✓ | — | Frontmatter completo; estado actualizado a `CODE-REVIEW/DONE` en este paso |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión aprobada (`verdict: APPROVED`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️ sin evidencia suficiente, no bloqueante)
