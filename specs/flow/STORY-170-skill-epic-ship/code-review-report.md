---
type: code-review-report
story: STORY-170
title: "Code Review Report: Skill epic-ship"
verdict: NEEDS-CHANGES
date: 2026-10-30
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-170

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 8 hallazgo(s) bloqueante(s) (severidad máxima: MEDIUM).

Los cuatro revisores entregaron informes válidos. Los hallazgos afectan la preservación del historial publicado, la comprobación de SMOKE-7, la transición de estado y la seguridad del frontmatter generado; dos criterios DoD reflejan que la revisión aún no puede aprobarse.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-170 — Skill epic-ship |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-ship/references/release-content.md:73 | La búsqueda de delimitadores abarca todo `CHANGELOG.md` y reemplaza el bloque donde se encuentre. Tras promover `[Unreleased]` a una versión publicada, reejecutar `/epic-ship` puede reescribir una entrada histórica. | Exigir que ambos delimitadores estén en `[Unreleased]` antes de reemplazar; si ya están en una versión publicada, detenerse sin escritura y añadir un caso de evaluación. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-ship/evals/evals.json:71 | AC-4/SMOKE-7 comprueba cadenas ausentes en la salida, pero no observa si la ejecución creó commits, tags, merges o push, ni si publicó o desplegó. | Añadir una comprobación observable de los efectos prohibidos; la ausencia de cadenas en la salida no prueba la ausencia de operaciones. |
| MEDIUM | specs/flow/STORY-170-skill-epic-ship/implement-report.md:74 | El recorrido manual SMOKE-7 está expresamente pendiente; aún no hay evidencia de ejecución que confirme la ausencia de commits y tags ni el encoding de los archivos generados. | Cuando un humano ejecute SMOKE-7, registrar fecha, fixture, comprobaciones y resultado; mantenerlo pendiente hasta entonces. |
| LOW | skills/epic-ship/evals/evals.json:64 | TC-001 exige el encabezado de los pasos de liberación y una versión, pero no afirma cada acción manual requerida por AC-1. | Afirmar las acciones de commit, tag, merge y despliegue en el resultado esperado. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-ship/SKILL.md:99 | El gate acepta `DEVELOP` con reporte `APPROVED` y permite escribir `SHIP/DONE`, mientras el gateway de `docs/architecture/state-machine.md:182` y `docs/guides/sddf-commands-pipeline.md:215` exige `VALIDATE/DONE`. D-7 conserva una justificación ya obsoleta según `design.md:249`. | Alinear el gate con `VALIDATE/DONE` y actualizar D-7, o modificar el gateway canónico y justificar explícitamente la excepción. |
| MEDIUM | specs/flow/STORY-170-skill-epic-ship/design.md:249 | Las notas reconocen que `epic-validate` deja la épica en `VALIDATE/DONE`, pero D-7 conserva la premisa de que ese skill no escribe estado. | Actualizar D-7 y sus notas para alinearlas con `VALIDATE/DONE`, o propagar explícitamente una excepción aprobada en arquitectura y guías. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `.claude/skills/security-audit/assets/security-checklist.md` (9 reglas evaluadas).

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| MEDIUM | skills/epic-ship/assets/release-notes-template.md:6 | SEC-051 | El `title` de `epic.md` se copia en una cadena YAML entre comillas sin escape. Un título con comillas y salto de línea puede cerrar el escalar e inyectar claves en el frontmatter de `release-notes.md`. | Serializar el título como escalar YAML seguro o escapar comillas, barras inversas y saltos de línea antes de sustituir `{title}`; añadir un caso adversarial. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (12 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Consulta `fix-directives.md` (ronda 1) y ejecuta `/story-implement STORY-170`; como existe `tasks.md`, también puedes usar `/story-implement-tasks STORY-170`. Tras las correcciones, repite `/story-code-review STORY-170`. La ejecución de `npm run test:eval -- epic-ship` queda a criterio humano según `AGENTS.md`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|----------|
| 1 | Se cumple `dod-story-implement` | ⚠️ | — | `implement-report.md` registra 20/24 criterios cumplidos y cuatro no verificables; los evals y CI requieren ejecución fuera de esta revisión estática. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skill en español, fuente en `skills/`, layout fijo y sin dependencias nuevas. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | El flujo de `skills/epic-ship/SKILL.md` contempla AC-1…AC-4; la ejecución de SMOKE-7 sigue pendiente. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Los componentes previstos existen; la contradicción del gateway canónico se registra como hallazgo de integración. |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | Los cuatro informes parciales contienen un hallazgo MEDIUM cada uno. |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | `implement-report.md` registra 32/32 tareas completadas y `tasks.md` no contiene casillas pendientes. |
| 7 | Metadatos de `story.md` completos y correctos | ✓ | — | Frontmatter con `id`, `status` y `substatus`; el cierre de esta revisión lo deja en `READY-FOR-IMPLEMENT/DONE`. |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este reporte se generó el 2026-10-30. |
| 9 | Revisión aprobada (`verdict: APPROVED`) | ❌ | MEDIUM | El veredicto de este reporte es `NEEDS-CHANGES`. |

**Resumen:** 6/9 criterios ✓ · 1 ⚠️ · 2 ❌.
