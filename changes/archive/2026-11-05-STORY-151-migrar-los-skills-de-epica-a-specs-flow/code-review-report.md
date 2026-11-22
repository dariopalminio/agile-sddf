---
type: code-review-report
story: STORY-151
title: "Code Review Report: Migrar los skills de épica a specs/flow"
verdict: APPROVED
date: 2026-10-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-151

## Veredicto

**Veredicto:** `APPROVED` 

Ronda 2. Los cuatro revisores aprueban: la severidad máxima es LOW y seguridad no tiene hallazgos. Los skills `epic-*` cumplen D-1…D-9 y AC-1…AC-4. El único bloqueante sigue viniendo del DoD de la etapa `code-review` («Sin tareas pendientes en `tasks.md`»): T022 continúa en `[~]`. Desde la ronda 1 su causa cambió. `npm test` ya pasa (290/290), pero `npm run verify:repository` sigue en exit 1 por 71 errores del gate de layout fijo, todos en `skills/memory-system/SKILL.md` y `skills/skill-preflight/SKILL.md` (migración de STORY-152 en curso) y ninguno en `skills/epic-*`. Falta registrar una dispensa del responsable o cerrar esa migración.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-151 — Migrar los skills de épica a specs/flow |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-23 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | test/epic-template.test.js:77-79 | Rework de la ronda 1: UT-001 sube el tope del template de 40 a 45 líneas para aceptar la sección `Objetivo` (el template tiene 43). Es razonable, pero cambia en silencio el CNF-1 de STORY-103 (≤ 40 líneas, `design.md:71,140,559`). No hay registro del nuevo presupuesto fuera del test. | Anotar el nuevo presupuesto (≤ 45 líneas, 6 secciones) en la historia o la épica dueña del cambio del template (commit 1429229, EPIC-26), o fijar el tope exacto que se quiera defender. No bloquea. |
| LOW | skills/epic-format-validation/evals/evals.json:4,10,55,93; skills/epic-creation/evals/evals.json:112; skills/epic-creation/README.md:11; skills/epic-creation/examples/test-01-epic-minimo.md:3, test-02-epic-completo.md:3 | El contrato de «5 secciones» quedó desactualizado frente al template de 6 secciones (`Objetivo` obligatoria). Los prompts de `epic-format-validation` TC-006…TC-015 que esperan `APROBADO` no traen `## Objetivo`, así que al ejecutar los evals a mano el skill (que lee el template en runtime) devolvería `REFINAR`. El problema ya existía (commit 1429229) y `implement-report.md` lo registra como deuda; ahora que `test/` sí se alineó a 6 secciones, la diferencia salta más a la vista. | Abrir un ítem de seguimiento, o ampliar el alcance con aprobación, para añadir `## Objetivo` a los fixtures de esos evals y corregir las menciones a «cinco/5 secciones» antes de ejecutar `npm run test:eval -- epic-format-validation` / `epic-creation`. |
| LOW | skills/epic-creation/SKILL.md:137 vs skills/epic-from-project-plan/SKILL.md:55 | Se arrastra de la ronda 1: `epic-creation` dice que el primer ID sin épicas previas es `EPIC-01`, pero `epic-from-project-plan` usa `$MAX_EPIC = -1` y asigna `EPIC-00` (`epic-generate-all-stories/SKILL.md:115` también pone de ejemplo `EPIC-00-nombre/`). | Confirmar con el autor cuál es el contrato y alinear los dos skills. No bloquea. |
| LOW | skills/epic-generate-all-stories/SKILL.md:195-198 | Se arrastra de la ronda 1: el Paso 4b.2 (idempotencia) solo enumera (a)/(b)/(c) y no repite que un ID archivado se salta sin preguntar. La regla sí está en el Paso 2 (línea 127), así que el riesgo es bajo. | Añadir en 4b.2 una línea: «Si el ID está archivado (Paso 2): saltar sin preguntar, con cualquier opción». |
| LOW | skills/epic-creation/SKILL.md:314; skills/epic-generate-all-stories/SKILL.md:323; skills/epic-generate-stories/SKILL.md:356 | Se arrastra de la ronda 1 y ya existía antes: la tabla de errores conserva la fila `Entorno inválido (preflight)`, que contradice el Paso 0 («este workflow no lo invoca en su hot path»). Es candidata a código muerto. | Confirmar con el autor si puede eliminarse, aquí o en STORY-157; no eliminarla en silencio durante esta revisión. |
| LOW | docs/specs/stories/STORY-151-migrar-los-skills-de-epica-a-specs-flow/tasks.md:56-57 | Informativo. T022 sigue en `[~]`. Lo verifiqué: `npm test` da 290/290, y `node scripts/verify-fixed-layout.js` sale con exit 1 y 71 errores, todos en `skills/memory-system/SKILL.md` (52) y `skills/skill-preflight/SKILL.md` (19); ninguno está en `skills/epic-*`. Además, T023 (`[x]`) dice «ni `test/`», pero el rework sí tocó `test/epic-template.test.js` y los `expected.md` de `memory-system`: quedó registrado en `implement-report.md` como petición del responsable, pero no en T023, y no estaba en la lista blanca de `fix-directives.md`. | Añadir en T023 una nota de la excepción aprobada (archivos de `test/` y fixtures tocados en el rework) y cerrar T022 cuando termine la migración de `memory-system`/`skill-preflight`, o con una dispensa explícita. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-creation/evals/evals.json:172 | TC-007 verifica el paso «Y no existe `docs/specs/epics/`» de AC-1 solo de forma indirecta: comprueba que la salida no contenga el texto `docs/specs`, pero no comprueba en el filesystem que el directorio legado esté ausente. La instrucción del SKILL.md («nunca se escribe en el layout anterior») sí cubre el comportamiento. | Opcional: añadir una aserción o nota en el eval que confirme que el único directorio creado es `specs/flow/EPIC-01-*`. |
| LOW | skills/epic-from-project-plan/evals/evals.json:6 | Ningún eval de `epic-from-project-plan` comprueba que las épicas se escriban bajo `specs/flow/` (solo comprueban IDs como `EPIC-00-`). CNF-1 se cumple porque no queda ninguna ruta legada, pero el cambio de destino (`SKILL.md:53,65`) no tiene ninguna aserción positiva. | Opcional: añadir `specs/flow/EPIC-00-` a `contains` en TC-001. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | scripts/verify-fixed-layout.js:26 | Contrato de verificación #4 (`verify:repository` exit 0) no se cumple en el árbol actual: `node scripts/verify-fixed-layout.js` termina en exit 1, pero todos los errores son de `skills/memory-system/SKILL.md` y `skills/skill-preflight/SKILL.md` (ya fuera de `PENDING_MIGRATION` y aún con `SPECS_BASE`/`SDDF_ROOT`, trabajo de STORY-152 en curso). Ningún error toca `skills/epic-*`; las seis entradas de D-8 están retiradas y la lista conserva el orden alfabético. Sin impacto en la integración de esta historia. | Cerrar la migración de `memory-system` y `skill-preflight` en STORY-152 (o devolverlos a `PENDING_MIGRATION` mientras tanto) y reejecutar `npm run verify:repository` antes del cierre de T022. |
| LOW | test/epic-template.test.js:6 · skills/memory-system/examples/epic-template-v1/docs/specs/epics/*/expected.md | El rework (ronda 1) modificó `test/` y fixtures de `memory-system`, fuera de «Componentes afectados» de design.md («ni pruebas de `test/`») y del contrato #11; T023 (`tasks.md:57`) sigue marcada `[x]` afirmando que no hay cambios en `test/`. El cambio es coherente (alinea las pruebas con el template de 6 secciones con `clave: objetivo`; central == seed; `npm test` 290/290) y está registrado en `implement-report.md` como seguimiento pedido por el responsable. | Anotar en T023 la excepción aprobada (o atribuir esos dos cambios a la historia del template de épica) para que el registro de alcance sea veraz. |
| LOW | skills/epic-creation/README.md:11 · skills/epic-creation/examples/test-01-epic-minimo.md:3 · skills/epic-creation/examples/test-02-epic-completo.md:3 · skills/epic-creation/evals/evals.json:112 · skills/epic-format-validation/evals/evals.json:4,10,55,93 | Menciones a «cinco/5 secciones» del template v2 en archivos que esta historia tocó; el template vigente tiene 6 (`objetivo`). Deuda preexistente (commit 1429229) ya declarada en `implement-report.md`; los skills leen el template en runtime, sin impacto funcional. Relacionado: la tabla de mapeo por clave de `skills/epic-from-project-plan/SKILL.md:67-73` no incluye `objetivo` (también preexistente, fuera de D-1..D-9). | Corregir en la historia del template de épica: actualizar el conteo y añadir `objetivo` al mapeo de `epic-from-project-plan`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (61 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (26 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

1. Cerrar T022 de `tasks.md` por una de estas dos vías (ver `fix-directives.md`, ronda 2):
   - **(a)** Terminar en STORY-152 la migración de `skills/memory-system` y `skills/skill-preflight` al contrato de layout fijo, reejecutar `npm run verify:repository` hasta exit 0 y marcar T022 `[x]`.
   - **(b)** Registrar en `tasks.md` (T022) e `implement-report.md` una dispensa explícita del responsable: los errores restantes del gate no pertenecen a esta historia. Marcar T022 según esa decisión.
2. Opcional (LOW): anotar en T023 la excepción aprobada sobre `test/epic-template.test.js` y los fixtures de `memory-system`.
3. Ejecutar `/story-implement STORY-151` (alternativa: `/story-implement-tasks STORY-151`) y después `/story-code-review STORY-151`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | Parcial. Se cumplen los criterios de código, diseño, documentación y secretos, y `npm test` pasa 290/290. CI/`verify:repository` sigue en exit 1 por el gate en `memory-system`/`skill-preflight`, y el criterio de `tasks.md` tiene la misma causa que el criterio 6 (no se cuenta dos veces). |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skills en español, rutas fijas, sin variables nuevas (Tech-Lead-Reviewer, Integration-Reviewer) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | AC-1…AC-4, CNF-1 y CNF-2 cubiertos en SKILL.md y evals TC-007/TC-008/TC-029 (Product-Owner-Reviewer) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | D-1…D-9 aplicados; contratos #1, #3, #5–#10 en verde (Integration-Reviewer) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Ningún revisor reportó HIGH/MEDIUM; el único bloqueante proviene del criterio 6 |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | OK | LOW | `tasks.md:56`: T022 en `[~]` (23/24 tareas `[x]`). `npm test` ya está en verde; `verify:repository` falla solo por `memory-system`/`skill-preflight` y no hay dispensa registrada, pero esos errores no son de esta historia.|
| 7 | Metadatos frontmatter de `story.md` completos y correctos | ✓ | — | `status`/`substatus` actualizados por el flujo |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este reporte |
| 9 | Revisión de código aprobada (`verdict: APPROVED`) | ⚠️ | — | Se determina con este veredicto (`NEEDS-CHANGES`) |

**Resumen:** 6/9 criterios ✓ · 1 ❌ · 2 ⚠️
