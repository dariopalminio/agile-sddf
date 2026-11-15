---
type: implement-report
id: STORY-192
slug: STORY-192-implement-report
title: "Implement Report: Épica sin READY-FOR-DEV"
story: STORY-192
created: 2026-11-14
updated: 2026-11-14
---

# Reporte de Implementación: Épica sin READY-FOR-DEV

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-192 |
| Total de tareas | 24 |
| Tareas completadas | 24 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa

Los skills de épica ya no nombran los estados buffer. `/epic-analyze` declara el orden de madurez sin buffers y clasifica `lista` una historia con el valor legado `READY-FOR-IMPLEMENT`, con una nota que no cuenta para el veredicto. En modo manual cierra con `Siguiente paso:`, que con `APPROVED` remite a la aprobación manual del PO (`PLAN/DONE`). `/epic-refine` replanifica solo las historias de cierre en `PLAN` y deja para el PO cualquier `status` fuera del workflow de historia, sin nombrar el valor legado. Los evals se escribieron antes que los `SKILL.md` (CNF-3).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | TC-035 `epica-sin-buffers-madurez-y-aprobacion-manual` (AC-1) | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T002 | TC-036 `historia-legada-ready-for-implement-nota-sin-mad-03` (AC-2, fila 1) | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T003 | TC-037 `status-ready-for-verify-no-clasificable-mad-03` (AC-2, fila 2); `version` 1.6.0; 37 casos | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T004 | Fixture `cobertura-cierre-planificada/` (STORY-302 en `PLAN/DONE`) | ✓ completado | `skills/epic-refine/examples/cobertura-cierre-planificada/` |
| T005 | Fixture `cobertura-cierre-status-desconocido/` (STORY-302 en `BACKLOG`) | ✓ completado | `skills/epic-refine/examples/cobertura-cierre-status-desconocido/` |
| T006 | TC-027 `historia-de-cierre-planificada-replanifica` (AC-3, fila `PLAN`) | ✓ completado | `skills/epic-refine/evals/evals.json` |
| T007 | TC-028 `historia-de-cierre-con-status-desconocido-al-po` (D-4) | ✓ completado | `skills/epic-refine/evals/evals.json` |
| T008 | `Replanifica:` en `not_contains` de TC-009; `version` 1.6.0; 28 casos | ✓ completado | `skills/epic-refine/evals/evals.json` |
| T009 | Comprobar ADR-0022 (D-6) | ✓ completado | — (existe con `status: ACCEPTED` → se cita) |
| T010 | Líneas 5, 12 y «Momento de uso» de `epic-analyze` | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T011 | Regla «Sin cambio de estado» con cita a ADR-0022 | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T012 | Orden de madurez sin buffers, fila y nota del valor legado (Paso 5c.1) | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T013 | Línea `Siguiente paso:` en el resumen manual del Paso 9 | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T014 | Líneas 20 y 30 del README | ✓ completado | `skills/epic-analyze/README.md` |
| T015 | §«Estados admitidos»: `PLAN` solo y fila «Cualquier otro valor» | ✓ completado | `skills/epic-refine/references/sal-corrections.md` |
| T016 | §3: caso `status` fuera del workflow de historia con su nota | ✓ completado | `skills/epic-refine/references/sal-corrections.md` |
| T017 | §6 de `sal-corrections.md` y `SKILL.md:227` → «en `PLAN`» | ✓ completado | `skills/epic-refine/references/sal-corrections.md`, `skills/epic-refine/SKILL.md` |
| T018 | `epic-generate-all-stories:227` sin buffer | ✓ completado | `skills/epic-generate-all-stories/SKILL.md` |
| T019 | V-3/V-4: grep de buffers | ✓ completado | — |
| T020 | V-5: grep de `PLAN/DONE` | ✓ completado | — |
| T021 | V-6: orden contra `domain-story-lifecycle` §4.1 | ✓ completado | — |
| T022 | Verificación de BOM/U+FEFF por bytes | ✓ completado | — |
| T023 | V-7: `npm run verify:repository` y `npm test` | ✓ completado | — |
| T024 | V-8: evals a criterio humano (anotado abajo) | ✓ completado | — |

### Notas de implementación

- **T004:** el `substatus` de STORY-302 en `cobertura-cierre/` ya era `DONE`, así que `diff -r` muestra una sola línea (`status: SPECIFY` → `status: PLAN`), no dos.
- **TC-035:** las líneas de `epic.md` del caso incluyen `status: PLAN` y `substatus: IN-PROGRESS` en el frontmatter, para reflejar el «Dado» de AC-1 (épica en `PLAN/IN-PROGRESS`).
- **T009 / D-6:** `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED`. La regla «Sin cambio de estado» y la nota del valor legado citan `ADR-0022`. No queda ninguna cita pendiente.
- **T021 / V-6:** STORY-187 ya está en `VERIFY`. `docs/domains/domain-story-lifecycle.md` (líneas 38, 84 y 116) tiene el mismo literal que la línea 236 de `epic-analyze`: `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`.

---

## Pruebas ejecutadas

| Comando / comprobación | Resultado |
|---|---|
| `node -e "require('./skills/epic-analyze/evals/evals.json')"` | ✓ JSON válido, `version` 1.6.0, 37 casos |
| `node -e "require('./skills/epic-refine/evals/evals.json')"` | ✓ JSON válido, `version` 1.6.0, 28 casos |
| `diff -r cobertura-cierre <fixture>` (los dos fixtures nuevos) | ✓ solo difiere la línea `status` de STORY-302 |
| V-3: `grep -nE "READY-FOR-(IMPLEMENT\|DEV)" skills/epic-analyze/SKILL.md skills/epic-analyze/README.md` | ✓ solo las líneas 243 (fila) y 246 (nota) del valor legado |
| V-4: `grep -rnE "READY-FOR-(IMPLEMENT\|DEV)" skills/epic-refine skills/epic-generate-all-stories` | ✓ sin resultados |
| V-5: `grep -rn "PLAN/DONE" skills/epic-analyze skills/epic-refine skills/epic-generate-all-stories` | ✓ todas las apariciones describen una aprobación manual del PO o son datos de eval; ninguna indica a un skill que la escriba |
| T022: búsqueda de bytes `EF BB BF` en los 9 archivos editados o creados | ✓ 0 apariciones |
| `npm run verify:repository` (incluye `node --test test`) | ✓ 592/592 pruebas y todas las verificaciones en `[OK]` |

La primera ejecución de `verify:repository` falló en `S097-UT-011` (`memory-system check` tardó 6206 ms con un límite de 5 s). Es una prueba de tiempo, ajena a esta historia. Sola pasa en 742 ms, y la segunda ejecución completa del gate pasó entera.

**Pendiente a criterio humano (V-8, AGENTS.md):**

```bash
npm run test:eval -- epic-analyze   # TC-035, TC-036, TC-037
npm run test:eval -- epic-refine    # TC-009, TC-027, TC-028
```

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1…AC-3 tienen evals (TC-035…TC-037, TC-009, TC-027, TC-028). Requiere ejecución de tests: los evals se corren a criterio humano |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: V-3/V-4. CNF-2: V-5. CNF-3: grupos 1–2 antes que 3–5. CNF-4: gate verde |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-7 aplicados literalmente; D-6 resuelto con ADR-0022 aceptado |
| 4 | Sin regresiones | ✓ | `verify:repository` 592/592; los casos existentes de los evals no cambian salvo `Replanifica:` en TC-009 (D-5) |
| 5 | Convenciones de `constitution.md` | ✓ | Texto en español, evals antes que el `SKILL.md` (principio 11), fuente única en `skills/` |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Solo cambia Markdown y JSON, sin `TODO` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No cambia código JavaScript |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository`: sintaxis JS, contratos, enlaces y layout en `[OK]` |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Ruta del skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crea ningún skill |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | La regla de contenido untrusted de `epic-analyze` no cambia. La nota legada copia el `status` como literal y no lo interpreta |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Sin código ejecutable, secretos ni entradas nuevas |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | La `description` de `epic-analyze` conserva la oración de uso y los disparadores; el inventario de evals y el contrato de layout pasan |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `epic-analyze` 1.6.0 (37 casos), `epic-refine` 1.6.0 (28 casos) |
| 16 | Casos de prueba ejecutados y evaluados según `skill-master` | ⚠️ | Requiere ejecución de tests: `npm run test:eval` queda a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 24/24 |
| 18 | README o docs actualizados si cambian contratos | ✓ | `skills/epic-analyze/README.md` (líneas 20 y 30) |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | No hubo decisiones nuevas; las notas de implementación solo aclaran T004 y TC-035 |
| 20 | CHANGELOG si aplica | ✓ | No aplica a la historia: el bloque de la épica lo escribe `/epic-ship` |
| 21 | Build de CI pasa | ✓ | `npm run verify:repository` (el mismo gate de `quality.yml`) pasa en local |
| 22 | Sin secrets ni credenciales | ✓ | Solo cambian Markdown, JSON y fixtures de ejemplo |
| 23 | Variables de entorno documentadas | ✓ | No aplica: no hay variables nuevas |
| 24 | Despliegue reversible | ✓ | Cambios de texto y fixtures; se revierten con git |

**Resumen:** 22/24 criterios ✓ · 2 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-analyze` y `npm run test:eval -- epic-refine`
2. Si algún caso falla, revisar el texto del `SKILL.md` o del catálogo SAL y ajustarlo
3. Consultar `design.md` (D-1…D-7) para verificar que la implementación respeta las reglas definidas
