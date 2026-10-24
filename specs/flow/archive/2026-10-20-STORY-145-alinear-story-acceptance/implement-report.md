---
type: implement-report
id: STORY-145
slug: STORY-145-alinear-story-acceptance-implement-report
title: "Implement Report: Alinear story-acceptance"
story: STORY-145
created: 2026-10-19
updated: 2026-10-20
---

# Reporte de implementación: Alinear story-acceptance

## Resumen

Las 35 tareas de `tasks.md` quedaron atendidas. `story-acceptance` emite `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` o `PENDING` en el campo `verdict` del frontmatter y en `## Veredicto`, la primera sección de `acceptance-report.md`. El camino `[Q]` escribe `verdict: PENDING` con `session-status: partial`, y el skill admite `ACCEPTANCE/BLOCKED` como reentrada tras resolver el impedimento.

Se actualizaron el template, `SKILL.md` (7a, 7b, 7d, `[Q]`, 8a, 8b, precondiciones, Salida y Test Cases), los tres ejemplos, el DoD de ejemplo, el README, `evals.json` (14 casos, versión 1.1.0), el guardrail `dod-story-acceptance.md`, los tres fixtures de `memory-system`, la máquina de estados y el dominio de historia. La validación criterio por criterio, `session-status` y la reanudación quedaron sin cambios; los reportes históricos de `docs/specs/**` no se reescribieron.

## Correcciones de fix-directives.md (ronda 1)

Rework tras `story-code-review` (veredicto `NEEDS-CHANGES`, severidad máxima MEDIUM). No quedaban tareas pendientes en `tasks.md` (35/35 `[x]`); las correcciones se aplicaron en el pre-paso 2f sin tocar `tasks.md` ni `fix-directives.md`.

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | `skills/story-acceptance/SKILL.md:378` | MEDIUM | 💻 corregido: `skills/story-acceptance/SKILL.md` — 7a: `$TOTAL_CRITERIOS` cuenta todos los criterios a validar sin sumar filas previas; `$TOTAL_APPROVED`, `$TOTAL_REJECTED` y `$TOTAL_BLOCKED` suman los resultados de la sesión actual y los de la sesión parcial reanudada. La frase de 7b (l.396) remite ahora a esos tres totales. |
| 2 | `docs/guardrails/dod-story-code-review.md:21` | MEDIUM | Sin edición (solo lectura): se cumple al resolver el #1; se confirma en la próxima `/story-code-review`. |
| 3 | `docs/guardrails/dod-story-code-review.md:25` | MEDIUM | Sin edición (solo lectura): se cumple cuando la próxima `/story-code-review` cierre en `APPROVED`. |

Acciones complementarias de la lista blanca:

- `skills/story-acceptance/examples/example-partial/acceptance-report.md:25`: `**Total criterios:** 2 (1 evaluado, 1 pendiente)` → `**Total criterios:** 2`, alineado con `{total_criterios}` del template (LOW relacionado con #1).
- `skills/story-acceptance/evals/evals.json:85`: la descripción de TC-003 incluye `ACCEPTANCE/BLOCKED en reintento` entre los estados válidos (LOW). No se añadió un caso nuevo de reentrada; el archivo sigue siendo JSON válido con 14 casos.

Comprobación del #1: `example-partial` → `$N_EVALUADOS` = 1, `$TOTAL_CRITERIOS` = 2 → «Sesión parcial: 1 de 2 criterios evaluados.»; reanudación 1+1 sobre 2 criterios → `$TOTAL_APPROVED` = 2, `$TOTAL_CRITERIOS` = 2 → «2 de 2 criterios aprobados.».

Gates tras la corrección: `npm run verify:repository` aprobado (exit 0) y `npm test` 259/259 aprobadas, 0 fallidas.

**Archivos corregidos:** `skills/story-acceptance/SKILL.md`, `skills/story-acceptance/examples/example-partial/acceptance-report.md`, `skills/story-acceptance/evals/evals.json`
**Hallazgos omitidos por archivo inexistente:** ninguno

Los hallazgos LOW restantes de `code-review-report.md` (`SKILL.md` l.288, l.353, l.488, l.494-501, l.32-38) no forman parte de la tabla de correcciones y quedan sin aplicar en esta ronda.

## Diferencias entre el diseño y la policy publicada (D-10)

| # | Diferencia | Resolución |
|---|---|---|
| 1 | El diseño y `tasks.md` describían `BLOCKED` y `PENDING` como «valores sin rama»; la policy publicada (§4) lista solo `PENDING` como valor sin rama para `story-acceptance`. El flowchart `flowchart-story-excecution-qa.mermaid` tiene rama `BLOCKED` (autobucle `ACCEPTANCE → ACCEPTANCE`). | Se aplica la versión publicada: `BLOCKED` es una rama real del flowchart y `PENDING` el único valor sin rama. La implementación es coherente con ambas. |
| 2 | El diseño (D-2) ubicaba `## Resumen ejecutivo` como segunda sección sin mencionar explícitamente el orden del ejemplo §7.6. La policy publicada fija `type: acceptance-report`, `# Acceptance Report: …`, primer `##` = `## Veredicto` (G-02) y luego `## Resumen ejecutivo`. | El template sigue exactamente el orden publicado; verificado en V-5. |
| 3 | El diseño (D-3) esperaba una excepción en §6 para los resultados por criterio. La §6 publicada solo contiene la excepción de `story-code-review`. | No se requiere excepción: los resultados por criterio (`APPROVED`/`REJECTED`/`BLOCKED`/`PENDIENTE`) son datos de las tablas de detalle, no declaraciones del veredicto del reporte; se conservan sin renombrar. |

## Conformidad con la policy publicada

| Punto | Resultado |
|---|---|
| C-1 / G-01 | Un único `verdict: {verdict}` en el frontmatter del template (l.9); 7b deriva un único `$VERDICT`. |
| C-2 / G-02 | `## Veredicto` es el primer encabezado `##` tras el título, con solo líneas en blanco entre ambos; su primera línea es `` **Veredicto:** `{verdict}` — {verdict_reason} `` y repite el valor del frontmatter. |
| C-3 / G-03, §4 | Solo `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` y `PENDING`, los cuatro permitidos por §4; `PENDING` es el único valor sin rama. |
| C-4 / G-04 | `## Estado final` y `{estado_final_texto}` eliminados; `final-status` ausente del skill; `session-status` se mantiene; las columnas `Resultado`/`Estado` de las tablas de detalle son datos por criterio, no veredicto. |
| C-5 / G-05 | Tabla 7b evaluada en orden: sesión `partial` → `PENDING`; `$TOTAL_REJECTED > 0` → `NEEDS-CHANGES` (gana sobre bloqueados); `$TOTAL_BLOCKED > 0` → `BLOCKED`; en otro caso → `APPROVED`. |
| C-6 / G-06 | Solo `APPROVED` avanza (`ACCEPTANCE/DONE`); `NEEDS-CHANGES` → `READY-FOR-IMPLEMENT/DONE`; `BLOCKED` → `ACCEPTANCE/BLOCKED`; `PENDING` se mantiene en `ACCEPTANCE/IN-PROGRESS`. |
| C-7 / §5 | Los reportes heredados no se reescriben: el Estado C del Paso 3 lee `verdict` y, si no existe, avisa «sin veredicto (reporte anterior al contrato de validación)» sin leer `final-status`; `docs/specs/**` intacto. |
| C-8 / §7.6 | Se conserva `type: acceptance-report` (template l.2), `# Acceptance Report: …` y `## Resumen ejecutivo` como segundo `##`, tras `## Veredicto`. |
| C-9 / §6 | Sin excepción requerida para `story-acceptance` en la §6 publicada; los resultados por criterio se conservan como datos (diferencia 3). |

## Verificación

| Comprobación | Resultado |
|---|---|
| V-1 (T026) | `grep -rn -E "ACCEPTANCE-(APPROVED\|REJECTED\|BLOCKED)\|final-status\|final_status\|FINAL_STATUS\|estado_final\|Estado final\|ACCEPTANCE (APROBADO\|RECHAZADO\|BLOQUEADO)" skills/story-acceptance --exclude=evals.json` no devuelve nada (exit 1). |
| V-2 (T027) | 4 positivos, todos intencionales y ajenos al skill: la tabla de equivalencias heredadas de la policy (§5, l.85-87) y el ADR-0015 (l.22), que documentan el vocabulario anterior como registro histórico. Sin coincidencias en `skills/**`. |
| V-3/V-4/V-5 (T028) | Template: `verdict: {verdict}` en l.9; `grep -c final-status` = 0; `{verdict}` aparece 2 veces; orden de encabezados `# Acceptance Report: …`, `## Veredicto`, `## Resumen ejecutivo` idéntico en el template y en los tres ejemplos, con solo líneas en blanco entre el título y `## Veredicto`. |
| V-6 (T029) | `example-approved`: `verdict: APPROVED` / `**Veredicto:** \`APPROVED\` — 6 de 6 criterios aprobados.` · `example-rejected`: `verdict: NEEDS-CHANGES` / `**Veredicto:** \`NEEDS-CHANGES\` — 1 criterio(s) rechazado(s) y 0 bloqueado(s).` · `example-partial`: `verdict: PENDING` / `**Veredicto:** \`PENDING\` — Sesión parcial: 1 de 2 criterios evaluados.` Cada motivo coincide con el literal de D-2. |
| V-7 (T030) | 7a define `$N_EVALUADOS`; 7b aplica la precedencia G-05; 7d documenta `{verdict}`, `{verdict_reason}`, `{verdict_details}` y `{n_evaluados}`; el camino `[Q]` escribe `{verdict}` = `PENDING` con `{session_status}` = `partial`, mantiene `story.md` en `ACCEPTANCE/IN-PROGRESS` y muestra el mensaje de D-6; 8a no se alcanza con `PENDING`. |
| V-8/V-10 (T031) | El Estado C del Paso 3 lee `verdict` del frontmatter y muestra el aviso heredado cuando falta; 1d y Restricciones aceptan `ACCEPTANCE/BLOCKED` como reentrada; ningún paso del skill lee `final-status` (apoyado en V-1). |
| V-9 (T032) | `git diff skills/story-acceptance/SKILL.md` confirma que el cambio se limita a descripción/Objetivo/Posicionamiento, precondiciones, aviso del Estado C, el camino `[Q]`, 7a-7d, 8a-8b, Salida y Test Cases; la validación criterio por criterio, el manejo `[P]`/`[F]`/`[B]`, `session-status` y la reanudación quedan intactos. |
| V-11 (T033) | C-1…C-9 conformes frente al texto publicado (tabla anterior), con las 3 diferencias de D-10 registradas. |
| V-12 (T034) | `npm test`: 235 pruebas, 233 aprobadas, 2 fallidas — idénticas a la línea base de T003 (`test/install.test.js`, `test/sddf-constitution.test.js`); sin fallos nuevos. `npm run verify:repository` falla en «pruebas deterministas» por esos mismos 2 tests preexistentes (la línea base de T003 ya lo registraba). `git status` muestra únicamente los componentes afectados del diseño más los artefactos de la historia; el flowchart, `skills/story-implement/**`, `skills/sddf-constitution/**`, `test/` y `docs/specs/**` (salvo esta historia) no cambian. |
| V-13 (T035) | Pendiente de criterio humano; ver «Evals manuales pendientes». |

Cambios preexistentes ajenos a la historia, conservados tal cual: `.gitignore` (línea `.opencode`), `AGENTS.md` (regla de no push) y el archivo sin versionar `opencode.json`.

## Cumplimiento DoD — Fase IMPLEMENT (ronda 1)

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (evals de V-13 pendientes de criterio humano). |
| 2 | Los criterios no funcionales de `story.md` están verificados | ⚠️ | CNF-1 verificado por lectura (V-9); la corrección de 7a no altera la validación criterio por criterio, `session-status` ni la reanudación. Sin evidencia conductual. |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | 7a queda alineado con D-1 («`$TOTAL_CRITERIOS` cuenta todos los criterios a validar») y con los motivos deterministas de D-2. |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test` 259/259 y `npm run verify:repository` aprobado. |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | Cambios en Markdown/JSON en español, UTF-8, mismo estilo de la sección. |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Ninguno introducido. |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | No aplica a cambios de Markdown/JSON; ningún placeholder huérfano. |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ✓ | `npm run verify:repository` aprobado. |
| 9 | No se introducen dependencias nuevas sin aprobación | ✓ | `package.json` sin cambios. |

**Resumen:** 7/9 criterios ✓ · 2 ⚠️ · 0 ❌

## Evals manuales pendientes

No se ejecutó `npm run test:eval -- story-acceptance`: `AGENTS.md` reserva las pruebas de regresión de skills al criterio humano para economizar cuota, y el mantenedor decidió registrarlo como pendiente (V-13, T035). El runner puede ejecutar los 14 casos (TC-001…TC-014, versión 1.1.0) cuando lo decida; los gates deterministas no sustituyen esa validación conductual.
