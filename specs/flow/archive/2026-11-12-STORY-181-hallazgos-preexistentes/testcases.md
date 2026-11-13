---
type: testcases
id: STORY-181
slug: STORY-181-hallazgos-preexistentes-testcases
title: "Test Cases: Hallazgos preexistentes"
story: STORY-181
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-181-hallazgos-preexistentes
---

<!-- Referencias -->
[[STORY-181-hallazgos-preexistentes]]

# Casos de Prueba: Hallazgos preexistentes

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 14 |
| CT   | 0 |
| IT   | 2 |
| API  | 0 |
| E2E  | 3 |
| EV   | 4 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Un defecto preexistente no bloquea | una historia en `IMPLEMENT/DONE` en una rama `epic/…`, sin defectos propios, cuyo alcance incluye un archivo con un defecto `MEDIUM` en una línea que la historia no tocó | se ejecuta `/story-code-review STORY-NNN` | `code-review-report.md` muestra el hallazgo con `🟣 PREEXISTENTE (MEDIUM)` en su dimensión y la fila `Hallazgos preexistentes` con N = 1; `max-severity: ninguna`; `verdict: APPROVED`; no existe `fix-directives.md`; `story.md` en `CODE-REVIEW/DONE` | AC-1, SMOKE-2, F-1, D-4, D-5, D-6 |
| E2E-002 | End-to-End | El mismo defecto en línea tocada sí bloquea | una historia en `IMPLEMENT/DONE` en una rama `epic/…` con un defecto `MEDIUM` en una línea que la historia añadió o modificó | se ejecuta `/story-code-review STORY-NNN` | el hallazgo conserva `MEDIUM` sin la marca `🟣 PREEXISTENTE`; `verdict: NEEDS-CHANGES`; el hallazgo aparece en `fix-directives.md` y en su lista blanca; `story.md` en `READY-FOR-IMPLEMENT/DONE` | AC-2, F-2, D-5 |
| E2E-003 | End-to-End | No se pueden determinar las líneas tocadas | una historia en `IMPLEMENT/DONE` revisada en la rama principal (o sin git, o sin rama principal) con un defecto `MEDIUM` en una línea no tocada | se ejecuta `/story-code-review STORY-NNN` | ningún hallazgo lleva `🟣 PREEXISTENTE`; la fila `Hallazgos preexistentes` dice `⚠️ clasificación PREEXISTENTE no aplicada: <motivo>`; el hallazgo conserva `MEDIUM` y el veredicto es `NEEDS-CHANGES`, el mismo que sin esta historia; no es `BLOCKED` | AC-3, F-3, D-2, I-3 |
| UT-001 | Unit | `parseLocation` acepta línea y rango | las cadenas `src/calc.js:10`, `src/calc.js:40-45`, `` `./src/calc.js:10` `` y `src\calc.js:10` | se llama a `parseLocation` | devuelve `{ file: "src/calc.js", start, end }` con `start = end = 10` o `40-45`; quita comillas invertidas y `./`, y normaliza `\` a `/` | D-3, I-4, T006 |
| UT-002 | Unit | `parseLocation` rechaza ubicaciones sin evidencia | las cadenas `src/calc.js`, `varios archivos`, `src/calc.js:45-40`, `/abs/calc.js:3` y `../fuera.js:3` | se llama a `parseLocation` | devuelve `null` en todos los casos | D-3, I-4, T006 |
| UT-003 | Unit | `touchedLines` con modificación y añadido | un diff `-U0` con hunks `@@ -10,1 +10,1 @@` y `@@ -20,0 +21,3 @@` | se llama a `touchedLines` | el conjunto es `{10, 21, 22, 23}` | D-3, T007 |
| UT-004 | Unit | `touchedLines` con borrado puro y `d` ausente | un diff con `@@ -41,2 +40,0 @@` y `@@ -5 +5 @@` | se llama a `touchedLines` | contiene `40` y `41` (vecinas del borrado) y `5` (`d` ausente equivale a 1) | D-3, T007 |
| UT-005 | Unit | Línea sin tocar en rama de épica | repo temporal con `main` y rama `epic/x`; `src/calc.js` existe en `main`; la rama cambia solo la línea 42 | `classifyLocations` con `src/calc.js:10` | `applied: true`, `baseRef: main`, `status: untouched` | AC-1, D-1, D-3, T009 |
| UT-006 | Unit | Línea modificada, añadida y vecina de borrado | el mismo repo con la línea 42 modificada, una línea añadida y un borrado | `classifyLocations` con `src/calc.js:42`, la línea añadida y la vecina del borrado | las tres ubicaciones son `touched` | AC-2, D-3, T009 |
| UT-007 | Unit | Commit de la rama y cambio sin commit | la rama tiene un commit que cambia la línea 30 y un cambio sin commit en la línea 50 | `classifyLocations` con `src/calc.js:30` y `src/calc.js:50` | ambas son `touched`: el diff contra la base incluye commits y working tree | AC-2, D-1, T009 |
| UT-008 | Unit | Archivo nuevo, con y sin seguimiento | `src/nuevo.js` añadido en un commit de la rama y `src/suelto.js` sin seguimiento | `classifyLocations` con una línea de cada uno | ambas son `touched` (no existen en la base) | D-3, invariante, T009 |
| UT-009 | Unit | Rango parcialmente tocado | la línea 42 está tocada y la 40 no | `classifyLocations` con `src/calc.js:40-45` | `status: touched` | D-3, invariante, T009 |
| UT-010 | Unit | Ubicaciones sin evidencia son `unknown` | `applied: true` | `classifyLocations` con `src/calc.js` (sin línea), `../x.js:1` y `src/borrado.js:3` (no existe en el working tree) | las tres son `unknown` y llevan `why` | D-3, F-4, T009 |
| UT-011 | Unit | `resolveBase` en la rama principal | repo temporal en `main` | se llama a `resolveBase` | `applied: false`, `reason: on-main-branch` y el `message` fijo del Esquema de datos | AC-3, D-2, T008 |
| UT-012 | Unit | `resolveBase` sin repo y con HEAD separado | un directorio sin `.git`; un repo con `git checkout --detach` | se llama a `resolveBase` | `reason: not-a-repo` y `reason: detached-head`, respectivamente | AC-3, D-2, T008 |
| UT-013 | Unit | `resolveBase` sin rama principal | repo cuya única rama es `trabajo` (sin `main`, `master` ni `origin/HEAD`) | se llama a `resolveBase` | `reason: no-main-branch`; con `applied: false`, `classifyLocations` devuelve `locations: []` | AC-3, D-2, I-2, T008 |
| UT-014 | Unit | Contrato de `SKILL.md` y plantilla | `SKILL.md` y la plantilla modificados | aserción 7 de `test/story-code-review-preexisting.test.js` | `SKILL.md` contiene `PREEXISTENTE`, `touched-lines.js` y `{{PREEXISTING_STATUS}}` y no contiene `git show` ni `git diff --name-only`; la plantilla contiene `{{PREEXISTING_STATUS}}` y su frontmatter no contiene `PREEXISTENTE` | CNF-2, D-6, D-8, T020 |
| IT-001 | Integration | CLI del motor: éxito y degradación | un repo temporal en rama `epic/x` y un `locations.json` válido; el mismo repo en `main` | `node touched-lines.js classify --repo-root <dir> --locations <archivo>` | exit `0` y un único objeto JSON con las claves de I-2 en ambos casos (`applied: true` y `applied: false`); no escribe archivos | I-1, I-2, D-8, T010 |
| IT-002 | Integration | CLI del motor: argumentos inválidos | sin `--locations`; con un `locations.json` que no es un arreglo de cadenas; con un subcomando desconocido | se invoca el motor | exit `2` y el error en stderr; stdout vacío | I-1, T010 |
| EV-001 | Eval | TC-030 `hallazgo-preexistente-no-bloquea` | `touched_lines_engine: { applied: true }`, `MEDIUM` en `src/calc.js:10` con `line_status: untouched` | se ejecuta el eval | contiene `🟣 PREEXISTENTE (MEDIUM)`, `src/calc.js:10`, `Hallazgos preexistentes`, `(verdict: APPROVED)`, `CODE-REVIEW/DONE`; no contiene `(verdict: NEEDS-CHANGES)`, `📋 Fix directives:`, `READY-FOR-IMPLEMENT` | AC-1, CNF-3, D-7, T004 |
| EV-002 | Eval | TC-031 `defecto-en-linea-tocada-bloquea` | `MEDIUM` en `src/calc.js:42` con `line_status: touched` | se ejecuta el eval | contiene `MEDIUM`, `src/calc.js:42`, `(verdict: NEEDS-CHANGES)`, `📋 Fix directives:`; no contiene `🟣 PREEXISTENTE` | AC-2, CNF-3, D-7, T004 |
| EV-003 | Eval | TC-032 `lineas-tocadas-no-determinables` (fail-safe) | `touched_lines_engine: { applied: false, reason: on-main-branch }`, `MEDIUM` en `src/calc.js:10` | se ejecuta el eval | contiene `clasificación PREEXISTENTE no aplicada`, `rama principal`, `(verdict: NEEDS-CHANGES)`; no contiene `🟣 PREEXISTENTE` ni `(verdict: BLOCKED)` | AC-3, CNF-3, D-7, T004 |
| EV-004 | Eval | TC-033 `linea-no-tocada-causada-por-la-historia` | `HIGH` en `src/calc.js:10` con `line_status: untouched` y descripción que atribuye el defecto al cambio de firma de `src/calc.js:42` | se ejecuta el eval | contiene `HIGH` y `(verdict: NEEDS-CHANGES)`; no contiene `🟣 PREEXISTENTE` | AC-2, D-4, D-7, T004 |

## Notas de cobertura

- **Se usó `tasks.md`:** los UT e IT se derivan de T006 a T010 y T020; los EV, de T004.
- **E2E:** uno por escenario Gherkin (AC-1, AC-2, AC-3). En este repo un E2E de `/story-code-review` necesita un runtime de IA y cuatro subagentes reales; se verifica manualmente con el flujo F-1 a F-3, y los EV-001 a EV-003 son su versión de simulación (`npm run test:eval`, a criterio humano).
- **Invariante «nunca `untouched` sin evidencia»** (D-3): la cubren UT-008, UT-009, UT-010 y UT-011 a UT-013, que corren en cada `npm test`. Es la propiedad que protege contra ocultar defectos propios.
- **Sin casos CT, API ni ST:** el cambio no tiene interfaz de usuario, endpoints ni estado global.
- **Gaps conocidos:** `git-unavailable` y `no-merge-base` no tienen UT propio (exigen quitar git del PATH o un historial sin ancestro común); su `message` lo fija el Esquema de datos de design.md y su tratamiento es el mismo que el de UT-011. `engine-unavailable` lo decide el orquestador (Paso 4a.2) y solo se cubre por lectura del `SKILL.md` en la verificación de T021.
- **Compatibilidad con STORY-180:** UT-014 comprueba que `SKILL.md` sigue sin `git show` ni `git diff --name-only`; la prueba de STORY-180 (encabezados de la plantilla sin cambios) se ejecuta en T022.

## Test Cases Progress for STORY-181

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: Un defecto preexistente no bloquea
- [ ] E2E-002: El mismo defecto en línea tocada sí bloquea
- [ ] E2E-003: No se pueden determinar las líneas tocadas
- [ ] UT-001: `parseLocation` acepta línea y rango
- [ ] UT-002: `parseLocation` rechaza ubicaciones sin evidencia
- [ ] UT-003: `touchedLines` con modificación y añadido
- [ ] UT-004: `touchedLines` con borrado puro y `d` ausente
- [ ] UT-005: Línea sin tocar en rama de épica
- [ ] UT-006: Línea modificada, añadida y vecina de borrado
- [ ] UT-007: Commit de la rama y cambio sin commit
- [ ] UT-008: Archivo nuevo, con y sin seguimiento
- [ ] UT-009: Rango parcialmente tocado
- [ ] UT-010: Ubicaciones sin evidencia son `unknown`
- [ ] UT-011: `resolveBase` en la rama principal
- [ ] UT-012: `resolveBase` sin repo y con HEAD separado
- [ ] UT-013: `resolveBase` sin rama principal
- [ ] UT-014: Contrato de `SKILL.md` y plantilla
- [ ] IT-001: CLI del motor: éxito y degradación
- [ ] IT-002: CLI del motor: argumentos inválidos
- [ ] EV-001: TC-030 `hallazgo-preexistente-no-bloquea`
- [ ] EV-002: TC-031 `defecto-en-linea-tocada-bloquea`
- [ ] EV-003: TC-032 `lineas-tocadas-no-determinables` (fail-safe)
- [ ] EV-004: TC-033 `linea-no-tocada-causada-por-la-historia`
