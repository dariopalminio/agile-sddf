---
type: implement-report
id: STORY-165
slug: STORY-165-implement-report
title: "Implement Report: Skill epic-refine (Core): corregir índice y enlaces de una épica"
story: STORY-165
created: 2026-10-29
updated: 2026-10-30
---

# Reporte de Implementación: Skill epic-refine (Core): corregir índice y enlaces de una épica

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-165 |
| Total de tareas | 35 |
| Tareas completadas | 0 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 35 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

Ejecución de rework (ronda 3): `tasks.md` no tenía tareas pendientes y `fix-directives.md` estaba presente; el trabajo de esta ejecución son las correcciones del pre-paso 2f. Las correcciones de las rondas 1 y 2 siguen en el árbol de trabajo.

---

## Tabla de Estado por Tarea

Skill de instrucciones (solo Markdown + JSON): la verificación de comportamiento son los evals de `skills/epic-refine/evals/evals.json` (D-11), con casos sandbox que ejecutan el skill sobre copias de los fixtures; la verificación estructural la hacen `npm test` y `npm run verify:repository`.

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Crear el skill con `skill-master` | ✓ completado (ejecución anterior) | `skills/epic-refine/` |
| T002 | Frontmatter, Objetivo, Qué hace / Qué NO hace | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T003 | Entrada, Parámetros, Modos, Restricciones | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T004 | Cláusula de contenido no confiable | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T005 | Paso 0 (layout fijo) y Paso 1 (épica + template del reporte) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T006 | Paso 2 (gate por `verdict`) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T007 | Paso 3 (extracción, identidad por glob) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T008 | Tabla de enrutamiento D-4 | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T009 | Paso 4 (revalidación, carga condicional de catálogos) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T010 | Paso 5 (plan consolidado y confirmación) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T011 | Paso 6 (backup y escritura) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T012 | Paso 7 (relectura y restauración global) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T013 | Paso 8 (reporte por clave, sin `verdict`) | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T014 | Paso 9 (salida por modo), errores y Salida | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T015 | Catálogo INT-02 / INT-03 | ✓ completado (ejecución anterior) | `skills/epic-refine/references/int-corrections.md` |
| T016 | Catálogo MAD-02 | ✓ completado (ejecución anterior) | `skills/epic-refine/references/mad-corrections.md` |
| T017 | Template del reporte | ✓ completado (ejecución anterior) | `skills/epic-refine/assets/epic-refine-report-template.md` |
| T018 | Ficha del skill | ✓ completado (ejecución anterior) | `skills/epic-refine/README.md` |
| T019 | Fixture `huerfana-y-related-roto/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/huerfana-y-related-roto/` |
| T020 | Fixture `aprobada/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/aprobada/` |
| T021 | Fixture `solo-decisiones-po/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/solo-decisiones-po/` |
| T022 | Fixture `duplicada/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/duplicada/` |
| T023 | Fixture `instruccion-incrustada/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/instruccion-incrustada/` |
| T035 | Fixture `reejecucion-parcial/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/reejecucion-parcial/` |
| T024 | Evals TC-001…TC-008 | ✓ completado (ejecución anterior) | `skills/epic-refine/evals/evals.json` |
| T025 | `epic-refine` en `escritor:` de `historias` (central + seed) | ✓ completado (ejecución anterior) | `docs/templates/epic-template.md`, `skills/epic-creation/assets/epic-template.md` |
| T026 | `epic-refine` en `escritor:` de `related:` (central + seed) | ✓ completado (ejecución anterior) | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` |
| T027 | Ciclo de vida de épica §8 y §9 | ✓ completado (ejecución anterior) | `docs/domains/domain-epic-lifecycle.md` |
| T028 | Guía de pipeline §2 (TODO descomentados) | ✓ completado (ejecución anterior) | `docs/guides/sddf-commands-pipeline.md` |
| T029 | Presupuesto de `SKILL.md`, `description` y catálogos | ✓ completado (ejecución anterior) | — |
| T030 | UTF-8 sin BOM; `cmp` template de historia central = seed | ✓ completado (ejecución anterior) | — |
| T031 | `verify-fixed-layout` e inventario de evals | ✓ completado (ejecución anterior) | — |
| T032 | `npm test` y `npm run verify:repository` aprobados | ✓ completado (ejecución anterior) | — |
| T033 | `graphify update .` | ✓ completado (ejecución anterior) | `graphify-out/` |
| T034 | Registrar evals y SMOKE-5 como pendientes de ejecución manual | ✓ completado (ejecución anterior) | este reporte (ver «Pendiente de ejecución manual») |

---

## Correcciones de fix-directives.md (ronda 3)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | scripts/run-evals.js:688 | MEDIUM | 💻 corregido: `scripts/run-evals.js` — en modo sandbox, `buildClaudeArgs` ya no concede `Write` ni `Edit` en `--allowedTools` (queda `Read,Glob,Grep`, igual que el modo normal): `acceptEdits` aprueba solo las ediciones dentro del cwd, que es el sandbox, y en `-p` el resto se deniega. Se aplicó además el endurecimiento opcional de la directiva: `--disallowedTools Bash,PowerShell,WebFetch,WebSearch` y `--strict-mcp-config`, para que reglas de shell, web o MCP heredadas de la configuración del usuario no abran otra vía de escritura. El comentario engañoso de la l. 685 se reemplazó por uno que describe el mecanismo real. Prueba (TDD): `test/run-evals.test.js:778` exige los argumentos nuevos y que `--allowedTools` no contenga ninguna regla `Write`/`Edit`; rojo antes del cambio y verde después. El modo normal (`plan`) no cambia (prueba de la l. 167) |
| 2 | docs/guardrails/dod-story-code-review.md:21 | MEDIUM | ✓ sin cambios en el guardrail, como indica la directiva: se satisface con el #1 y la nueva revisión |

**Archivos corregidos:** `scripts/run-evals.js`, `test/run-evals.test.js`
**Hallazgos omitidos por archivo inexistente:** ninguno

Con el #1, la cabecera del runner, el USAGE y `docs/architecture/tech-stack.md:88` («escritura confinada a ese directorio») vuelven a describir el comportamiento real; no requieren cambios. El flag `--restricted` del CLI de Claude confina más (ignora la configuración del usuario), pero se descartó porque es reciente y el runner se publica en el paquete: rompería a quien tenga otra versión del CLI.

Hallazgos LOW de la revisión que siguen abiertos (no bloqueantes; casi todos fuera de la lista blanca):
- `scripts/run-evals.js:901` y `:652`: el sandbox vive dentro del repositorio y su prompt no repite «no mires `expected`», así que el agente evaluado aún puede leer `evals.json`. Es una fuga de expectativas, no de escritura. Corrige la afirmación de la ronda 2 «el sandbox no expone `evals/`»: la copia excluye `evals/`, pero el original sigue al alcance de lectura.
- `scripts/run-evals.js:600`: `snapshotTree` y `cpSync` siguen los enlaces simbólicos (hoy ningún fixture los tiene).
- `README.md:538` («solo lectura»), `CHANGELOG.md` (sin entrada del modo sandbox), `design.md` (sin CR del sandbox ni de la ruta confinada), `skills/epic-refine/references/sal-corrections.md:20` («Paso 3.5») y AC-3 sin caso sandbox.

---

## Pendiente de ejecución manual

Por AGENTS.md los evals se ejecutan a criterio humano para economizar cuota; no se ejecutaron en esta sesión. Tampoco se probó en vivo con `claude -p` que el agente evaluado no pueda escribir fuera del sandbox: la prueba determinista fija los argumentos, no el comportamiento del CLI.

1. `npm run test:eval -- epic-refine --only TC-023,TC-024,TC-025`: los casos sandbox, ahora con los permisos nuevos. Un fallo por escritura denegada dentro del sandbox indicaría que `acceptEdits` no cubre el cwd en la versión del CLI usada.
2. `npm run test:eval -- epic-refine`: los 25 casos.
3. SMOKE-5 de EPIC-23 sobre `skills/epic-refine/examples/huerfana-y-related-roto/`: `/epic-refine EPIC-30` respondiendo `s` → `/epic-analyze EPIC-30` debe declarar `APPROVED`.

---

## Cumplimiento DoD — Fase IMPLEMENT

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (TC-023…TC-025 verifican AC-1 y AC-2 en disco) |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-3 (sin BOM), CNF-4 y CNF-5 (`SKILL.md` 265 líneas) verificados; CNF-1 y CNF-2 requieren ejecutar los evals |
| 3 | El comportamiento coincide con `design.md` | ✓ | Esta ronda solo cambia el runner de evals; el skill sigue D-1…D-11 |
| 4 | Sin regresiones | ✓ | `npm test` 438/438, `node --test test/run-evals.test.js` 41/41 y `npm run verify:repository` aprobados |
| 5 | Convenciones de `constitution.md` | ✓ | Comentarios en español con la densidad del archivo; cambio acotado a la lista blanca |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Ninguno introducido |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `buildClaudeArgs` conserva su firma y sus llamadas |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` aprobado (sintaxis incluida) |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para el skill nuevo | ✓ | T001 (ejecución anterior); esta ronda no crea skills |
| 11 | Ruta del skill en `files` de `package.json` | ✓ | `skills/` publicado; smoke del tarball aprobado |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | El agente evaluado ya no recibe `Write`/`Edit` sin ruta; shell, web y MCP heredados quedan denegados en sandbox. Queda un LOW conocido: lectura de `evals.json` desde el sandbox (`scripts/run-evals.js:901`) |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Procesos con arreglos de argumentos, sin shell; rutas del manifest contenidas. Queda un LOW conocido: enlaces simbólicos (`scripts/run-evals.js:600`) |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | `SKILL.md` 265 líneas (< 500); `references/` < 300 líneas |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 25 casos TC-NNN (3 sandbox); inventario de evals aprobado |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; pendiente a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 35/35 |
| 18 | README o docs actualizados si cambian contratos | ⚠️ | La cabecera, el USAGE y `tech-stack.md:88` vuelven a ser exactos con el #1; `README.md:538` («solo lectura») sigue desalineado (LOW, fuera de la lista blanca) |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ⚠️ | El modo sandbox y la ruta confinada no tienen CR en `design.md` (LOW, fuera de la lista blanca) |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | La entrada `/epic-refine` de `[Unreleased]` cubre la historia; el modo sandbox del runner aún no tiene entrada (LOW, fuera de la lista blanca) |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el mismo gate (`verify:repository`) y `npm test` pasan en local |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ⚠️ | No aplica: no se añaden variables de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ⚠️ | El skill crea `<archivo>.bak` y restaura ante fallo; el sandbox es desechable y se recrea en cada ejecución |

**Resumen:** 15/24 criterios ✓ · 9 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-refine` (incluye los casos sandbox TC-023…TC-025)
2. Si algún caso falla, revisar `skills/epic-refine/SKILL.md`, el catálogo o el caso correspondiente, y `.tmp/skill-test-evals/epic-refine/runs/<TC>.files.txt` para los casos sandbox
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
