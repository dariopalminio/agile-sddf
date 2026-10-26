---
type: code-review-report
story: STORY-160
title: "Code Review Report: Skill story-complete: completar y archivar una historia entregada"
verdict: APPROVED
date: 2026-10-26
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-160

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Ronda 2 de revisión: los tres hallazgos MEDIUM de la ronda 1 (EOL mixtos en `completeFrontmatter`, desajuste lector/escritor de `status`, U+FEFF literal) están corregidos y probados (`node --test test/story-complete.test.js` 34/34), y los cuatro revisores entregaron informe válido con severidad máxima LOW. Los 10 hallazgos LOW restantes son deriva documental y mejoras opcionales que no bloquean la aprobación.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-160 — Skill story-complete: completar y archivar una historia entregada |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-26 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW       | skills/story-complete/scripts/story-complete.js:197 | `completeFrontmatter` reescribe la **última** línea `status:` del frontmatter, igual que `readFrontmatter`, que se queda con el último valor. La corrección del #2 es coherente, pero `design.md` D-7 sigue diciendo «se reemplaza la **primera** línea `status: DELIVER`», e `implement-report.md` afirma que no hubo decisiones nuevas. Solo cambia algo cuando la clave está duplicada, un caso degenerado | Alinear la redacción de D-7 en `design.md` con el criterio de «última clave», o documentar la desviación en el informe de implementación |
| LOW       | skills/story-complete/scripts/story-complete.js:192 | Las dos ramas `throw` de `completeFrontmatter` (sin `---` de cierre; `status` ausente o distinto de `DELIVER`) que llevan a `WRITE_FAILED` sin mover nada no tienen caso de prueba. Hoy son defensivas: `planCompletion` valida antes con el mismo lector, así que no se alcanzan por `applyCompletion` | Opcional: añadir un caso que fuerce `WRITE_FAILED`, por ejemplo modificando `story.md` entre `plan` y la escritura, o exportando `completeFrontmatter` para probarla aislada. Si no, dejar un comentario que explique que son defensivas |
| LOW       | test/story-complete.test.js:6 | El comentario de cabecera de las pruebas todavía cita ADR-0016 como fuente del layout de archivo; el ADR vigente es ADR-0017 (el motor ya lo cita bien en la línea 12) | Actualizar la referencia a ADR-0017 en el comentario |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

3 escenarios Gherkin y sus 9 filas de Ejemplos verificados; 8/9 filas con prueba observable del motor.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-160-completar-y-archivar-historia-entregada/story.md:64 | Persiste el hallazgo de la ronda 1. Dos pasos solo los cubren los evals, que no se han ejecutado (T028 `[~]`): AC-3 fila 1 (el usuario rechaza la confirmación y no hay cambios) y «confirma la acción» de AC-1. Están en `skills/story-complete/SKILL.md:162` y los cubren TC-005 y TC-001. El riesgo es bajo porque las pruebas demuestran que `plan` no escribe (snapshots en test:220 y test:159) y el SKILL.md no invoca `apply` sin `s`. La regla de AGENTS.md reserva la ejecución de evals al criterio humano, así que no bloquea. | Ejecutar `npm run test:eval -- story-complete` a criterio humano (al menos TC-001 y TC-005) y cerrar T028 antes de ACCEPTANCE. |
| LOW | specs/flow/STORY-160-completar-y-archivar-historia-entregada/story.md:53 | Persiste el hallazgo de la ronda 1. AC-2 fila 4 y CNF-1 (`story.md:71`) siguen exigiendo rechazar `CANCELED/DONE` por ADR-0016. El motor ya la archiva (`archive-canceled`, motor:161; test:159 y test:177) porque STORY-164/ADR-0017 la reemplazaron. Es intencional y está previsto en Non-Goals (`story.md:81`), pero `story.md` no lo anota y su texto ya no describe el comportamiento vigente. Además, `skills/story-complete/SKILL.md:100` sigue citando ADR-0016 en el Paso 0, aunque el Objetivo cita ADR-0017. | Añadir una nota en `story.md` («AC-2 fila 4 y la referencia a ADR-0016 de CNF-1 quedaron reemplazadas por STORY-164/ADR-0017») y citar ADR-0017 en `SKILL.md:100`. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-160-completar-y-archivar-historia-entregada/design.md:101 | D-2, D-4 (`date:` «no se consulta»), el enum `code` del Esquema de datos y Non-Goals siguen describiendo `CANCELED_NOT_ADMITTED` y la regla de ADR-0016. El motor implementa el contrato evolucionado por STORY-164 y ADR-0017 (`archive-canceled`, `CANCELED_NOT_DONE`, `updated:` → `created:` → `date:`). El cambio está trazado solo en el CR de STORY-164; el design de STORY-160 no remite a él. No afecta la integración: el SKILL.md, el README, los evals y las pruebas siguen el contrato vigente | Añadir a `design.md` de STORY-160 un CR que remita al CR de STORY-164 (design.md:324) y a ADR-0017 como contrato vigente de D-2/D-4 |
| LOW | skills/story-complete/scripts/story-complete.js:197 | D-7 dice «se reemplaza la **primera** línea `status: DELIVER`». Tras la corrección #2, `completeFrontmatter` toma la **última** clave `status` (`lastKeyAt`) para coincidir con `readFrontmatter`, donde gana la última. La decisión es correcta y coherente, pero `implement-report.md` (DoD #19) afirma que no hubo ninguna decisión nueva y no está documentada en `design.md` | Registrar un CR en `design.md` (D-7: lector y escritor comparten el parser; con claves duplicadas se usa la última ocurrencia) |
| LOW | docs/architecture/state-machine.md:108 | En la tabla de transiciones por skill, la fila `story-complete` declara como precondición `DELIVER/DONE` o `COMPLETED/DONE` y omite `CANCELED/DONE`. El párrafo de la línea 110 atribuye la regla de archivo a ADR-0016, ya reemplazado por ADR-0017. Es documentación derivada (C-9) desalineada con `domain-story-lifecycle.md:142`, `domain-state-management.md:90` y el SKILL.md | Añadir `CANCELED/DONE` (solo archivar, sin cambiar el status) a la fila y citar ADR-0017 en la línea 110 |
| LOW | docs/guides/best-practices-for-testing.md:112 | El commit de STORY-160 (20878f9) reescribe la tipología de regresión (sanity/core/full). Esa guía no está entre los componentes C-1…C-11 ni en ningún CR, y no tiene relación funcional con `story-complete` | Sacarla del alcance de STORY-160 (si es cambio humano independiente) o documentarla con un CR |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (71 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/story-complete/scripts/story-complete.js:240 | gr-code-security (semántica): los mensajes no muestran rutas absolutas del host · SEC-078 | En `WRITE_FAILED` (:240), `ROLLBACK_FAILED` (:253) y `MOVE_FAILED` (:258, vía `moved.error`, que sale de `fs.renameSync` en :221), el `error.message` de `fs` puede incluir la ruta absoluta del host y llegar al JSON de stdout. Es un CLI local que solo invoca el usuario, así que no hay exposición real. Este LOW ya se reportó en la ronda 1 y sigue abierto. | Opcional: reportar `error.code` (p. ej. `ENOENT`, `EPERM`) junto con la ruta relativa en lugar de `error.message`. |

**Corrección de la ronda 1 (`ai-no-hidden-characters` / SEC-056):** verificada. El grep PCRE del guardrail y un escaneo con Node no devuelven caracteres invisibles, bidi ni zero-width en los 13 archivos; ninguno empieza con BOM, y la regex usa el escape `/^﻿/` (`story-complete.js:59`), compartida como `BOM_RE`.

**Resto de la auditoría (sin hallazgos):** `spawnSync` solo con lista de argumentos y sin shell; `--path` confinado por `STORY_PATH_RE` tras `path.relative`; `--id` validado con `ID_RE` antes del `RegExp`; sin `eval` ni deserializadores; sin secretos, rutas absolutas ni `allowed-tools`; la confirmación humana falla cerrada (solo `s`/`si`/`sí`), sin flag `--yes`; las pruebas usan directorios temporales y no tocan el repo real.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (13 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-160`. Antes de ACCEPTANCE, ejecuta a criterio humano `npm run test:eval -- story-complete` (cierra T028 y cubre la confirmación interactiva de AC-1/AC-3). Los hallazgos LOW se pueden atender de forma opcional, sobre todo la deriva documental ADR-0016 → ADR-0017 en `story.md`, `design.md` (D-2, D-4, D-7), `SKILL.md:100` y `docs/architecture/state-machine.md:108-110`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] (línea 17) | ⚠️ | — | `implement-report.md`: 17/24 ✓ · 7 ⚠️ · 0 ❌. El ❌ de la ronda 1 («Se cumple [[gr-ai-security-checklist]]») quedó resuelto, como confirma el Security-Reviewer. Los ⚠️ restantes requieren CI, ejecutar los evals (T028) o juicio humano (`skill-master`) |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) (línea 18) | ✓ | — | Ningún revisor reporta violaciones: CommonJS `'use strict'` sin dependencias, documentos en español y layout fijo (`verify-fixed-layout` OK) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código (línea 19) | ✓ | — | Product-Owner-Reviewer: las 9 filas de AC-1…AC-3 tienen correspondencia en el motor, el SKILL.md y TC-001…TC-006; 8/9 con prueba del motor |
| 4 | Los componentes respetan la arquitectura de `design.md` (línea 20) | ⚠️ | — | La estructura y los contratos D-1, D-3, D-5, D-6 y D-9 son conformes (Integration-Reviewer). Queda deriva documental LOW en D-2, D-4 y D-7 respecto del comportamiento vigente (ADR-0017 y la regla de «última clave») |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM (línea 21) | ✓ | — | Los cuatro informes tienen `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) (línea 22) | ⚠️ | — | T028 `[~]` (27/28): la ejecución de evals se deja a criterio humano (regla de `AGENTS.md`). Requiere ejecutar los tests: esta revisión no lo puede evaluar |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados (línea 23) | ✓ | — | Campos completos; `status`/`substatus` pasan a `CODE-REVIEW/DONE` (Paso 6) |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado (línea 24) | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) (línea 25) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 6/9 criterios ✓ · 3 ⚠️ · 0 ❌
