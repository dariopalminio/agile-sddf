---
type: implement-report
id: STORY-127
slug: STORY-127-implement-report
title: "Implement Report: Integrar y documentar el gateway de validación de épicas"
story: STORY-127
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Integrar y documentar el gateway de validación de épicas

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-127 |
| Total de tareas | 15 |
| Tareas completadas | 15 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición: STORY-124 y STORY-126 implementadas | ✓ completado | — (`skills/epic-validate/SKILL.md` tiene el Paso 5 de escritura, la «Política de efectos» y el Paso 6 con el bloque `RESULTADO`) |
| T002 | Precondición: CS-7 de EPIC-23 admite la excepción del gateway | ✓ completado | — (CS-7 admite la escritura de `status`, `substatus` y `updated` de `epic.md`) |
| T003 | Paso «Gateway de transición» (C5) | ✓ completado | `skills/epic-validate/SKILL.md` (Paso 5b, línea `Gateway:` en el Paso 6, fila `FALLO` del gateway, errores y verificación del flujo) |
| T004 | Excepción del gateway en «Política de efectos» (C6) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T005 | Fila de `epic-validate` en el mapa de skills (C7) | ✓ completado | `docs/domains/domain-skills-map.md` |
| T006 | Sección `### Gateway de validación de épicas` en la guía (C1) | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T007 | Línea canónica en «Nivel ÉPICA» (C2) | ✓ completado | `docs/architecture/state-machine.md` |
| T008 | Prueba de consistencia del gateway (C3) | ✓ completado | `test/epic-validate-gateway.test.js` |
| T009 | Prueba de distribución de `epic-validate` (C4) | ✓ completado | `test/install.test.js` |
| T010 | Recorrido de AC-1 | ✓ completado (recorrido acotado al Paso 5b) | — |
| T011 | Recorrido de AC-2 | ✓ completado (recorrido acotado al Paso 5b) | — |
| T012 | Recorrido sin efectos | ✓ completado (recorrido acotado al Paso 5b) | — |
| T013 | `npm pack --dry-run --json` incluye `skills/epic-validate/SKILL.md` | ✓ completado | — |
| T014 | UTF-8 sin BOM, sin cambios en destinos de runtime, `package.json` ni `config/runtimes.json`; ancla del enlace | ✓ completado | — |
| T015 | `verify:links`, pruebas nombradas, `npm test` y `verify:repository` | ✓ completado | — |

Cambio adicional no previsto en las tareas (registrado como CR-008 en `design.md`): la segunda línea fija de `## Veredicto` en `skills/epic-validate/assets/epic-validate-report-template.md` y en la clave `veredicto` de `SKILL.md` decía «Informativo: esta validación no cambia el estado de la épica.» y ahora enuncia la regla del gateway. También se agregó la entrada del gateway en `CHANGELOG.md › [Unreleased]`.

---

## Recorridos de verificación (T010–T012)

**Alcance:** los recorridos aplicaron el Paso 5b sobre épicas fixture en un `REPO_ROOT` temporal del scratchpad (fuera del repositorio), con `epic-validate-report.md` ya escrito y su `verdict` fijado, como establece la nota de dependencia de la historia. **No** se ejecutó `/epic-validate` completo de extremo a extremo (comprobaciones `EST-*`/`OPE-*` y escritura del reporte): esa cobertura corresponde a los evals de STORY-128.

| Fixture | Estado inicial | `verdict` | Resultado en `epic.md` | Línea `Gateway:` | Contrato |
|---|---|---|---|---|---|
| EPIC-01 | `VALIDATE/IN-PROGRESS` | `APPROVED` | `VALIDATE/DONE`, `updated: 2026-10-30`; el reporte permanece | `EPIC-01 VALIDATE/IN-PROGRESS → VALIDATE/DONE` | 2 (AC-1) ✓ |
| EPIC-02 | `VALIDATE/IN-PROGRESS` | `NEEDS-CHANGES` | `DEVELOP/IN-PROGRESS`, `updated: 2026-10-30` | `EPIC-02 VALIDATE/IN-PROGRESS → DEVELOP/IN-PROGRESS` + `Revisa ## Veredicto de …` | 3 (AC-2) ✓ |
| EPIC-03 | `VALIDATE/IN-PROGRESS` | `BLOCKED` | `DEVELOP/IN-PROGRESS`, `updated: 2026-10-30` | `EPIC-03 VALIDATE/IN-PROGRESS → DEVELOP/IN-PROGRESS` + `Revisa ## Veredicto de …` | 3 (AC-2) ✓ |
| EPIC-04 | `VALIDATE/IN-PROGRESS` | — (`--dry-run`, sin reporte) | idéntico byte a byte (sha256) | `sin cambio (--dry-run) — aplicaría VALIDATE/IN-PROGRESS → VALIDATE/DONE` | 4 ✓ |
| EPIC-05 | `DEVELOP/IN-PROGRESS` | `APPROVED` | idéntico byte a byte (sha256) | `sin cambio — la épica está en DEVELOP/IN-PROGRESS; el gateway solo transiciona desde VALIDATE` | 4 ✓ |

En los fixtures transicionados, el cuerpo y el resto de los campos del frontmatter quedaron intactos.

## Verificaciones automáticas (T013–T015)

| Comando | Resultado |
|---|---|
| `npm pack --dry-run --json` | incluye `skills/epic-validate/SKILL.md`, `assets/`, `evals/`, `references/` y `scripts/` |
| `node --test test/epic-validate-gateway.test.js test/install.test.js` | 21/21 pass |
| `npm run verify:links` | OK (50 archivos activos) |
| `npm test` | 368/368 pass |
| `npm run verify:repository` | aprobado (incluye el smoke del tarball en 4 runtimes) |

Fragmento del enlace de `state-machine.md` (`#gateway-de-validación-de-épicas`) verificado contra el ancla de GitHub del encabezado `### Gateway de validación de épicas`. Los archivos editados son UTF-8 sin BOM con LF; `git status` no muestra cambios en `.claude/`, `.opencode/`, `.github/`, `.agents/`, `package.json` ni `config/runtimes.json`, y la guía no enumera runtimes.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-3 cubierto por la prueba C4 y el smoke del tarball. AC-1 y AC-2 se verificaron con el recorrido del Paso 5b sobre fixtures, no con una ejecución completa de `/epic-validate` (evals de STORY-128) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: `test/epic-validate-gateway.test.js`; CNF-2: prueba C4 por cada runtime `supported` y smoke del tarball |
| 3 | El comportamiento coincide con `design.md` | ✓ | C1–C7 implementados según el diseño; desviaciones registradas en CR-008 |
| 4 | Sin regresiones | ✓ | `npm test` 368/368 y `verify:repository` aprobado |
| 5 | Convenciones de `constitution.md` | ✓ | Español, estilo `node:test` del repo, rutas fijas desde `REPO_ROOT` |
| 6 | Sin código comentado ni `TODO` | ✓ | Ninguno en los archivos editados |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisión de `test/epic-validate-gateway.test.js` y de la prueba nueva de `test/install.test.js` |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica a un skill nuevo; `"skills/"` cubre `skills/epic-validate/` (prueba C4) |
| 12 | Se cumple `gr-ai-security-checklist` | ⚠️ | La cláusula de contenido untrusted se amplió solo a los escalares `status`/`substatus` de `epic.md`; el checklist no se recorrió ítem por ítem |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Las pruebas solo leen archivos del repo y escriben en directorios temporales; sin secretos |
| 14 | Se cumple `gr-skill-creation-checklist` | ⚠️ | Se modificó un skill existente sin recorrer el checklist completo; `verify:repository` (frontmatter, layout fijo, contrato de validación) aprobado |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/epic-validate/evals/evals.json` existe; los casos del gateway son de STORY-128 |
| 16 | Evals ejecutados automáticamente | ⚠️ | Requiere ejecución de `npm run test:eval -- epic-validate`, que `AGENTS.md` reserva a criterio humano |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 15/15 |
| 18 | Docs de contratos actualizadas | ✓ | `SKILL.md`, guía, `state-machine.md`, mapa de skills y template seed |
| 19 | Decisiones no previstas en `design.md` | ✓ | CR-008 |
| 20 | CHANGELOG actualizado si aplica | ✓ | Entrada en `CHANGELOG.md › [Unreleased]` |
| 21 | CI pasa (build + tests + lint) | ⚠️ | Requiere ejecución de CI; localmente `verify:repository` y `npm test` aprobados |
| 22 | Sin secretos ni credenciales | ✓ | Ninguno en los cambios |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios de documentación y pruebas; reversibles con git |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto. En esta ejecución ya se corrieron `npm test` y `npm run verify:repository`, ambos en verde.

Pendientes recomendados:
1. Ejecutar `npm run test:eval -- epic-validate` a criterio humano (los evals existentes no cubren el gateway; STORY-128 los agrega).
2. Recorrido de extremo a extremo de `/epic-validate` sobre una épica real en `VALIDATE` cuando exista una.
