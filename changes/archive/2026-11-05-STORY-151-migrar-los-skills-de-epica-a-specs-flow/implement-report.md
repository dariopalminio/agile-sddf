---
type: implement-report
id: STORY-151
slug: STORY-151-implement-report
title: "Implement Report: Migrar los skills de épica a specs/flow"
story: STORY-151
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de épica a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-151 |
| Total de tareas | 24 |
| Tareas completadas | 23 |
| Tareas bloqueadas | 1 (T022) |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ⚠️ Implementación completada con una tarea bloqueada: T022 exige `npm test` y `npm run verify:repository` en exit 0, pero ambos fallan por 15 pruebas **preexistentes** ajenas a la historia (ver «Tareas Bloqueadas»). El resto de pasos de `verify:repository` se ejecutó por separado y está en verde. Esos errores no son de esta historia.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos |
|---|---|---|---|
| T001 | Precondiciones (ADR-0016 `ACCEPTED`; `verify-fixed-layout.js` con las seis entradas; STORY-147/148) | ✓ completado — STORY-147 y STORY-148 están en `CODE-REVIEW/DONE` (más allá de `IMPLEMENT/DONE`) | — |
| T002 | Alcance de `epic-refine` (CR-001) | ✓ completado — `skills/epic-refine/` **no existe**: fuera de alcance | `.tmp/story-implement/STORY-151/scope.txt` |
| T003 | Línea base y inventario | ✓ completado — `npm test`: 268/283 (15 fallos previos); inventario de 340 líneas | `.tmp/story-implement/STORY-151/baseline.txt`, `inventory.txt` |
| T004 | Gate RED: seis entradas fuera de `PENDING_MIGRATION` | ✓ completado — `verify:layout` falló con 139 errores (R1/R3/R4 en los seis skills) | `scripts/verify-fixed-layout.js`, `.tmp/…/red.txt` |
| T005 | Migrar `epic-creation/SKILL.md` | ✓ completado | `skills/epic-creation/SKILL.md` |
| T006 | Migrar `epic-format-validation/SKILL.md` | ✓ completado | `skills/epic-format-validation/SKILL.md` |
| T007 | Migrar `epic-from-project-plan/SKILL.md` | ✓ completado (`$EPICS_DIR` eliminado) | `skills/epic-from-project-plan/SKILL.md` |
| T008 | Migrar `epic-generate-stories/SKILL.md` | ✓ completado | `skills/epic-generate-stories/SKILL.md` |
| T009 | Regla de historias archivadas (D-6) en `epic-generate-stories` | ✓ completado | `skills/epic-generate-stories/SKILL.md` |
| T010 | Migrar `epic-generate-all-stories/SKILL.md` (incl. D-6) | ✓ completado | `skills/epic-generate-all-stories/SKILL.md` |
| T011 | Migrar `epic-analyze/SKILL.md` (Paso 0, entradas, resolución) | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T012 | `epic-analyze` Vía B y `related` con activas ∪ archivadas (D-4) | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T013 | README de los skills | ✓ completado | `skills/epic-creation/README.md`, `epic-from-project-plan/README.md`, `epic-generate-stories/README.md`, `epic-generate-all-stories/README.md` |
| T014 | Ejemplos de `epic-creation` | ✓ completado | `skills/epic-creation/examples/test-0{1,2,3}-*.md` |
| T015 | Evals de `epic-analyze` (+ TC-029, versión 1.4.0) | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T016 | Evals de `epic-creation` (+ TC-007, versión 1.2.0) | ✓ completado | `skills/epic-creation/evals/evals.json` |
| T017 | Evals de `epic-generate-stories` (+ TC-008, versión 1.2.0) | ✓ completado | `skills/epic-generate-stories/evals/evals.json` |
| T018 | Evals de batch, format-validation y revisión de from-project-plan | ✓ completado | `skills/epic-generate-all-stories/evals/evals.json`, `epic-format-validation/evals/evals.json`, `epic-from-project-plan/evals/evals.json` |
| T019 | Gate verde | ✓ completado — `verify:layout` exit 0, 36 skills, 23 pendientes | `.tmp/…/green.txt` |
| T020 | Greps de contratos #1–#3, #5–#8 | ✓ completado (ver «Verificación») | — |
| T021 | Evals válidos y `--dry-run` | ✓ completado | `.tmp/…/dry-*.txt` |
| T022 | `npm test` y `verify:repository` en exit 0 | ⚠️ requiere aclaración | — |
| T023 | Alcance acotado del diff | ✓ completado | — |
| T024 | `graphify update .` y este reporte | ✓ completado | `implement-report.md` |

---

## Tareas Bloqueadas

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T022 | **Causa raíz verificada en el rework (ronda 1):** el template de épica ganó la sección obligatoria `Objetivo` (clave `objetivo`, commit 1429229, anterior a esta historia); pasa a 6 secciones y 43 líneas, mientras las pruebas siguen asumiendo 5 secciones y ≤ 40 líneas. `npm test` termina con 15 fallos que ya existían en la línea base (T003) y siguen siendo exactamente los mismos tras la migración y tras el rework: `epic-template.test.js` (UT-001, UT-003, UT-020) y `memory-system` `migrate --from epic-template-v1` (UT-005…UT-019, IT-001). No tocan los skills de épica; `verify:repository` se detiene en ese paso. | Actualizar `test/epic-template.test.js` y los fixtures/expected de `migrate --from epic-template-v1` al template de 6 secciones en la historia que corresponda (template de épica / memory-system) y reejecutar `npm test` y `npm run verify:repository`; o registrar aquí la dispensa explícita del responsable. **Sin dispensa registrada**, T022 permanece en `[~]`. |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | docs/guardrails/dod-story-code-review.md:22 | MEDIUM | ⚠️ sin cambio de código: T022 no puede cerrarse dentro de la lista blanca (ni exit 0 ni dispensa del responsable); se documentó la causa raíz en `tasks.md` (T022) y en «Tareas Bloqueadas». `npm test` re-ejecutado: 268/283, mismos 15 fallos; `verify:layout` en verde |

**Archivos corregidos:** `tasks.md` (nota de T022), `implement-report.md`
**Hallazgos omitidos por archivo inexistente:** ninguno
**Seguimiento (a petición del responsable):** se actualizaron `test/epic-template.test.js` y los cinco `expected.md` de `skills/memory-system/examples/epic-template-v1/` al template de 6 secciones; `npm test` pasa 283/283. `npm run verify:repository` sigue en exit 1 únicamente por el gate de layout fijo en `skills/memory-system/SKILL.md` y `skills/skill-preflight/SKILL.md` (migración ajena en curso, fuera de esta historia); T022 queda `[~]` hasta que esa migración termine.
**Deuda menor detectada (no tocada, fuera de la lista blanca):** menciones a «cinco/5 secciones» en `skills/epic-creation/README.md:11`, `examples/test-01/02` y descripciones de `evals.json` de `epic-creation` y `epic-format-validation`; los skills leen el template en runtime, por lo que no hay impacto funcional.

---

## Verificación

| Contrato | Resultado |
|---|---|
| #1 `grep SPECS_BASE\|SDDF_ROOT skills/epic-*` | ✓ sin coincidencias |
| #2 `grep docs/specs\|specs/epics\|specs/stories\|sddf_config_root skills/epic-*` | ⚠️ solo 3 coincidencias, todas `"docs/specs"` en `not_contains` de los casos nuevos TC-029 (`epic-analyze`), TC-007 (`epic-creation`) y TC-008 (`epic-generate-stories`), exigidos por D-9 como aserción negativa; ninguna en SKILL.md, README ni ejemplos |
| #3 marcador `SDDF-FIXED-LAYOUT: v1` | ✓ 1 por cada uno de los seis `SKILL.md` |
| #4 gate | ✓ `verify:layout` exit 0 con las seis entradas fuera de `PENDING_MIGRATION` |
| #5 sin lectura de `root` | ✓ |
| #6 `specs/flow/EPIC-*/epic.md` | ✓ en los cinco skills que resuelven épicas |
| #7 archivadas en `epic-analyze` | ✓ ambos patrones (inventario y ID listado) |
| #8 numeración con archivadas | ✓ `specs/flow/archive/` y «saltada (archivada)» en los dos generadores |
| #9 evals | ✓ seis JSON válidos; `test:eval --dry-run` exit 0 para `epic-analyze`, `epic-creation` y `epic-generate-stories`; los tres casos nuevos presentes en los prompts |
| #10 `npm test` | ❌ 268/283 — mismos 15 fallos que la línea base (ver T022) |
| Otros pasos de `verify:repository` | ✓ ejecutados por separado: sintaxis, layout, inventario de evals, contrato de validación y enlaces activos |
| #11 alcance | ✓ los cambios de esta historia son `skills/epic-*` y `scripts/verify-fixed-layout.js`; el resto del diff de `git status` pertenece a STORY-148/149/150 |
| #12 evals reales | pendiente — a criterio humano: `npm run test:eval -- epic-analyze`, `-- epic-creation`, `-- epic-generate-stories` |

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de evals reales — no evaluable por story-implement |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (evals con rutas `specs/flow/`) y CNF-2 (numeración y salto de archivadas) cubiertos por contratos #8 y #9 |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1…D-9 aplicados; contratos #1, #3–#9 en verde |
| 4 | Sin regresiones | ⚠️ | `npm test` conserva los mismos 15 fallos de la línea base; no se introdujo ninguno nuevo |
| 5 | Convenciones de `constitution.md` | ✓ | Skills en español, rutas relativas a `REPO_ROOT`, sin variables nuevas |
| 6 | Sin código comentado ni `TODO` | ✓ | Cambios solo en Markdown/JSON y una lista en `verify-fixed-layout.js` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `$EPICS_DIR` eliminado de `epic-from-project-plan` |
| 8 | Linter y formateador | ⚠️ | Requiere ejecución externa; `verify-syntax` ✓ |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios en esta historia |
| 10 | Uso de `skill-master` para skills nuevos | ✓ | N/A: no se crea ningún skill |
| 11 | Ruta de skill nuevo en `files` | ✓ | N/A: no hay skills nuevos |
| 12 | `gr-ai-security-checklist` | ⚠️ | No evaluable desde los artefactos |
| 13 | `gr-code-security-checklist` | ⚠️ | No evaluable desde los artefactos |
| 14 | `gr-skill-creation-checklist` | ⚠️ | No evaluable desde los artefactos |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los seis skills tienen evals; tres casos nuevos |
| 16 | Casos de prueba ejecutados | ⚠️ | Requiere ejecución de tests — a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ⚠️ | 23/24; T022 en `[~]` por fallos preexistentes |
| 18 | README/docs de contratos actualizados | ✓ | Cuatro README y tres ejemplos actualizados |
| 19 | Decisiones de diseño no previstas documentadas | ✓ | La única divergencia (3 `docs/specs` en `not_contains`) está en «Verificación» |
| 20 | CHANGELOG | ⚠️ | No actualizado: fuera de alcance de la historia (Non-Goals) |
| 21 | CI sin errores | ⚠️ | Requiere ejecución de tests — falla por los 15 fallos preexistentes |
| 22 | Sin secretos expuestos | ✓ | Ninguno en los archivos modificados |
| 23 | Variables de entorno documentadas | ✓ | La historia elimina referencias a `SDDF_ROOT`; no añade variables |
| 24 | Despliegue reversible | ✓ | Cambios de contenido versionados en git |

**Resumen:** 13/24 criterios ✓ · 0 ❌

---

## Advertencias

- **Dogfooding en transición:** los skills fuente apuntan a `specs/flow/` mientras los work items de este repositorio siguen en `docs/specs/` hasta STORY-153. No reinstalar las copias de runtime (`.claude/skills/`) con `agile-sddf install` antes de esa historia.
- **`epic-refine`:** no existe en `skills/` (solo la propuesta sin versionar en `.temp/`); cuando se cree, debe nacer con el contrato de layout fijo (el gate lo exige).
- **Evals reales:** no se ejecutaron (a criterio humano).

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no genera código de producción nuevo: la verificación es el gate `verify:layout`, los greps de contrato y los evals.
