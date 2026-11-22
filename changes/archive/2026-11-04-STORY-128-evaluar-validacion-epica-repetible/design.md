---
alwaysApply: false
type: design
id: STORY-128
slug: STORY-128-evaluar-validacion-epica-repetible-design
title: "Design: Evaluar la validación de épicas de forma repetible"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-128
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-128-evaluar-validacion-epica-repetible
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-138
---

<!-- Referencias -->
[[STORY-128-evaluar-validacion-epica-repetible]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-125-validar-evidencia-operativa-epica]] · [[STORY-126-operar-validacion-epica-segura]]

## Context

`/epic-validate` emite el veredicto `APPROVED`, `NEEDS-CHANGES` o `BLOCKED` de una épica en `<EPIC_DIR>/epic-validate-report.md`. Esta historia no cambia ese comportamiento. Su trabajo es dejar un conjunto de casos de evaluación que lo demuestre y que detecte regresiones antes de distribuir cambios del gateway (CS-9).

Estado verificado en el filesystem (2026-10-29):

- **Skill:** `skills/epic-validate/` todavía no existe (`ls skills/`). STORY-124, STORY-125 y STORY-126 están en `READY-FOR-IMPLEMENT/DONE` con `design.md` y `tasks.md`. Las tres agregan casos a `skills/epic-validate/evals/evals.json`:
  - STORY-124 crea el archivo con TC-001…TC-005: `APPROVED`, `NEEDS-CHANGES` por historia no terminal (SMOKE-3), `NEEDS-CHANGES` por análisis, `BLOCKED` por análisis ausente, y una épica inexistente.
  - STORY-125 agrega los casos V-1…V-6: smoke tests y `verify:release`, incluido `BLOCKED` en `--mode auto` sin `verify.e2e-smoke` declarado.
  - STORY-126 agrega los casos de modos, `--dry-run` y errores de invocación con «el siguiente `TC-NNN` libre».

  Ninguno cubre la tercera fila de AC-2 (precedencia `NEEDS-CHANGES` sobre `BLOCKED`, G-05) ni un bloqueo provocado por un comando controlado por el caso (CNF-2). Sus aserciones sobre el veredicto tampoco siguen una forma común: TC-002…TC-004 de STORY-124 solo exigen `verdict: <VALOR>`.
- **Mecanismo de evaluación:** `scripts/run-evals.js` (Paso E3a, `buildPrompt`) no ejecuta el skill de verdad. Le pide al runner (`claude` o `codex`, en solo lectura con `Read,Glob,Grep`) que **simule** el `SKILL.md` sobre el mundo descrito en `input`, incluidos «los resultados que devuelve cada subagente o comando» y «las respuestas del usuario a cada pausa». Después califica la salida con `expected.contains`, `expected.not_contains` y `threshold` mediante `String.prototype.includes` (`gradeOutput`). Ningún comando del escenario se ejecuta: su resultado lo fija el propio caso.
- **Formato de casos (P3):** `skills/epic-analyze/evals/evals.json` describe épica, historias y templates en línea dentro de `input` (`invocation`, `epic_md_lines`, `stories[]`, `templates`, `previous_report`, `today`). STORY-124 T017 adopta ese formato para `epic-validate`.
- **Inventario:** `scripts/verify-eval-inventory.js` (dentro de `npm run verify:repository`) solo valida que haya ≥ 1 caso y que los IDs `TC-NNN` sean únicos. No conoce los veredictos.
- **Prueba de contenido de evals (P3):** `test/sddf-init-layout.test.js` («CNF-2: los evals cubren AC-1 y AC-2») ya lee el `evals.json` de un skill desde `npm test` y afirma la cobertura de sus AC sin invocar ningún LLM. Es el precedente de una guardia determinista sobre casos de eval.
- **Contrato del reporte:** el frontmatter del template seed de STORY-124 (T016) tiene este orden: `type`, `id`, `slug`, `title`, `epic`, `verdict`, `created`, `updated`, `related`. `## Veredicto` es la primera sección y su primera línea es `` **Veredicto:** `<VALOR>` — <motivo> `` (G-01, G-02). Los motivos usan `M-NNN [<VALOR>] <comprobación> — <elemento>` en consola y `### M-NNN [<VALOR>] — …` en el reporte (STORY-124, STORY-125).
- **Comandos en `--mode auto`:** STORY-125 ejecuta `sddf.config.yaml › verify.e2e-smoke.command` y `npm run verify:release` mediante `check-command`. `check-command` devuelve `outcome: pass | fail | not-executable`, y un ejecutable inexistente (códigos 127/9009) da `not-executable` → `SMOKE-N` `no ejecutable` → `OPE-01 bloqueada`.
- **Cuota:** `AGENTS.md` reserva `npm run test:eval -- <skill>` al criterio humano.

## Goals / Non-Goals

**Goals:**
- Agregar a `skills/epic-validate/evals/evals.json` un conjunto de regresión de cuatro casos, uno por escenario de AC-1 y de AC-2, todos sobre el mismo mundo base. // satisface: AC-1, AC-2, CNF-1
- Provocar el `BLOCKED` con un comando de smoke tests inexistente que el propio caso declara y cuyo resultado fija. // satisface: AC-2, CNF-2
- Dar a todo caso que declare un veredicto la misma forma de aserción cerrada, que falla si `verdict` falta, si difiere de `## Veredicto` o si tiene un valor no permitido. // satisface: CNF-3
- Proteger desde `npm test`, sin consumir cuota de evals, que `evals.json` conserva al menos un caso de cada veredicto y que el conjunto de regresión no depende de intervención manual ni de servicios externos. // satisface: AC-3, CNF-1, CNF-2, CNF-3
- Mantener `npm run verify:repository` y `npm test` en verde. // satisface: CS-21

**Non-Goals:**
- Agregar o cambiar comprobaciones, modos, motivos o el template de `epic-validate` (STORY-124, STORY-125, STORY-126, STORY-169; «Fuera de alcance» de la historia).
- Integrar el veredicto en la transición de estados (STORY-127).
- Cambiar `scripts/run-evals.js`, `scripts/verify-eval-inventory.js`, la documentación o el empaquetado.
- Ejecutar `npm run test:eval` como parte de `npm test` o de `verify:repository`.

## Decisions

### Componentes

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Conjunto de regresión del veredicto | modificar (agregar 4 casos) | `skills/epic-validate/evals/evals.json` | Demostrar los cuatro escenarios de AC-1 y AC-2 sobre un mundo base común, en `--mode auto` | AC-1, AC-2, CNF-1, CNF-2 |
| C2 | Aserción cerrada del veredicto | modificar (casos existentes) | `skills/epic-validate/evals/evals.json` | Completar los casos de STORY-124/125/126 que declaran un veredicto con las cuatro aserciones de la forma cerrada | CNF-3 |
| C3 | Guardia de cobertura de evals | crear | `test/epic-validate-evals.test.js` | Afirmar en `npm test` la cobertura de los tres veredictos, la forma cerrada y el aislamiento del conjunto de regresión | AC-3, CNF-1, CNF-2, CNF-3 |

No se modifican `skills/epic-validate/SKILL.md`, el template, `scripts/`, `package.json` ni `docs/domains/domain-skills-map.md`. La fila de `epic-validate` no cambia: los evals no son algo que el skill lee o escribe.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Veredicto esperado de un caso | Un caso **declara** el veredicto `<V>` si `expected.contains` tiene la entrada `verdict: <V>⏎created:`, donde `⏎` es un salto de línea (`\n` en JSON). Es la única forma reconocida. Un caso sin esa entrada (p. ej. la épica inexistente de STORY-124 TC-005) no declara veredicto | CNF-3, AC-3 |
| Forma cerrada (C2), con `<V>` ∈ {`APPROVED`, `NEEDS-CHANGES`, `BLOCKED`} y `<O1>`, `<O2>` los otros dos valores | `contains`: `verdict: <V>⏎created:` y `` **Veredicto:** `<V>` ``. `not_contains`: `` **Veredicto:** `<O1>` `` y `` **Veredicto:** `<O2>` ``. `threshold` ausente o `1` | CNF-3 |
| Invocación del conjunto de regresión | `input.invocation` = `/epic-validate EPIC-90 --mode auto` en los cuatro casos. En auto el skill no pregunta (STORY-125 D-9, STORY-126) | AC-3, CNF-2 |
| Resultados de comandos simulados | `input.command_results` es un objeto `{ "<comando literal>": { "outcome": "pass" \| "fail" \| "not-executable", "exitCode": <n>, "reason": "<texto>" } }`. Tiene una entrada por cada comando que el caso configura en `input.sddf_config.verify["e2e-smoke"].command` y en `input.package_json.scripts["verify:release"]`. Su forma es la de `CommandResult` (I1 de STORY-169), reducida a los campos que deciden el resultado | CNF-2 |
| Nombres de los casos de regresión | `regresion-veredicto-approved`, `regresion-veredicto-historia-no-terminal`, `regresion-veredicto-smoke-no-ejecutable`, `regresion-veredicto-precedencia`. Sus IDs son los siguientes `TC-NNN` libres en el orden de esta tabla, porque la numeración depende del orden de implementación de STORY-124/125/126 | AC-1, AC-2, AC-3 |
| Mensajes de C3 | Cobertura: `evals.json no conserva ningún caso <V> (CS-9)`. Forma: `<TC-NNN>: falta <aserción> (CNF-3)` o `<TC-NNN>: veredicto no permitido <valor> (CNF-3)`. Regresión: `falta el caso de regresión <nombre> (AC-3)`, `<TC-NNN>: requiere intervención manual (<motivo>)` y `<TC-NNN>: comando sin resultado simulado: <cmd> (CNF-2)`. Precondición: `skills/epic-validate/evals/evals.json no existe (STORY-124 sin implementar)` | AC-3, CNF-1, CNF-2, CNF-3 |

### Esquema de datos

**Mundo base** (común a C1, en `input`, con el formato de `skills/epic-analyze/evals/evals.json`) // satisface: AC-1, CNF-2

| Clave de `input` | Valor |
|---|---|
| `invocation` | `/epic-validate EPIC-90 --mode auto` |
| `epic_md_path` | `specs/flow/EPIC-90-epica-de-evaluacion/epic.md` |
| `epic_md_lines` | Frontmatter (`id: EPIC-90`, `status: DEVELOP`). `## Historias` con `clave: historias` y dos líneas F2: `**STORY-901**` y `**STORY-902**`. `## Smoke tests` con `clave: smoke-tests` y `### SMOKE-1 — Validación visible`, con un bloque `gherkin` Dado/Cuando/Entonces |
| `stories[]` | `STORY-901` activa en `specs/flow/STORY-901-…/story.md`, `DELIVER/DONE`, con un cuerpo que cita `SMOKE-1` (historia dueña, E1). `STORY-902` archivada en `specs/flow/archive/2026-10-20-STORY-902-…/story.md`, `COMPLETED/DONE`. Ambas con `parent: EPIC-90-epica-de-evaluacion` |
| `epic_analyze_report` | `specs/flow/EPIC-90-…/epic-analyze-report.md` con `verdict: APPROVED` |
| `sddf_config` | `verify.e2e-smoke.command: node -e "process.exit(0)"` |
| `package_json` | `scripts["verify:release"]: node -e "process.exit(0)"` |
| `command_results` | Ambos comandos con `outcome: pass`, `exitCode: 0` |
| `dod_epic_validate` | `docs/guardrails/dod-epic-validate.md` no existe (`OPE-03` `omitida`, sin efecto) |
| `templates` | `docs/templates/epic-validate-report-template.md` no existe; existe el seed `skills/epic-validate/assets/epic-validate-report-template.md` |
| `previous_report` | `null` |
| `today` | `2026-10-29` |

El mundo se describe solo en `input`: no se crean directorios `EPIC-90-*` ni `STORY-90N-*` en el repositorio (los evals simulan, no ejecutan).

**Variaciones del conjunto de regresión** (C1) // satisface: AC-1, AC-2, CNF-1, CNF-2

| Caso | Fila | Variación sobre el mundo base | Veredicto esperado | Aserciones específicas (además de la forma cerrada) |
|---|---|---|---|---|
| `regresion-veredicto-approved` | AC-1 | ninguna | `APPROVED` | `contains`: `Sin motivos.`. `not_contains`: `[NEEDS-CHANGES]`, `[BLOCKED]`, `sección obligatoria ·` |
| `regresion-veredicto-historia-no-terminal` | AC-2, fila 1 | `STORY-902` activa en `specs/flow/STORY-902-…/story.md` con `IMPLEMENT/IN-PROGRESS` (no archivada) | `NEEDS-CHANGES` | `contains`: `EST-01`, `STORY-902`, `IMPLEMENT/IN-PROGRESS`. `not_contains`: `[BLOCKED]` |
| `regresion-veredicto-smoke-no-ejecutable` | AC-2, fila 2 | `verify.e2e-smoke.command: sddf-eval-smoke-inexistente`, con `command_results` → `outcome: not-executable`, `exitCode: 127`, `reason: ejecutable no encontrado` | `BLOCKED` | `contains`: `OPE-01`, `SMOKE-1`, `no ejecutable`, `[BLOCKED]`. `not_contains`: `[NEEDS-CHANGES]` |
| `regresion-veredicto-precedencia` | AC-2, fila 3 | Las variaciones de las filas 1 y 2 a la vez | `NEEDS-CHANGES` | `contains`: `STORY-902`, `IMPLEMENT/IN-PROGRESS`, `SMOKE-1`, `no ejecutable`, `[NEEDS-CHANGES]`, `[BLOCKED]` |

Las aserciones específicas usan solo tokens que fijan los diseños de STORY-124 y STORY-125: IDs de comprobación, el resultado `no ejecutable` y el marcador `[<VALOR>]` del motivo. Así el reporte identifica, para cada fila, «la historia y su estado», «la comprobación que no se pudo ejecutar» o ambas (columna `motivo` de AC-2). No se afirma el bloque `RESULTADO:` de STORY-126, así que el conjunto no depende de esa historia (D-6).

**Reglas de la guardia C3** // satisface: AC-3, CNF-1, CNF-2, CNF-3

| # | Regla | Alcance |
|---|---|---|
| G-A | `evals.json` existe, es JSON válido y `cases[]` no está vacío | archivo |
| G-B | Entre los veredictos declarados hay al menos un `APPROVED`, un `NEEDS-CHANGES` y un `BLOCKED` | todos los casos |
| G-C | Todo caso con una entrada de `contains` que empieza por `verdict: ` o por `` **Veredicto:** ` `` declara exactamente un veredicto válido y cumple la forma cerrada completa | todos los casos |
| G-D | Existen los cuatro casos de regresión por `name`, con el veredicto declarado de la tabla de variaciones | conjunto de regresión |
| G-E | Su `input.invocation` contiene `--mode auto`; su `input` no tiene la clave `user_answers` ni ninguna cadena que empiece por `> ` (respuesta simulada a una pausa) | conjunto de regresión |
| G-F | Cada comando configurado en `sddf_config.verify["e2e-smoke"].command` y `package_json.scripts["verify:release"]` tiene su entrada en `command_results`, con `outcome` ∈ {`pass`, `fail`, `not-executable`}; ninguna cadena de `input` contiene `http://` ni `https://` | conjunto de regresión |

G-C se aplica a todos los casos, no solo a los de esta historia: un caso con el veredicto mal afirmado puede aprobar en falso cualquier regresión. G-E y G-F se limitan al conjunto de regresión porque los casos de `--mode manual` de STORY-125/126 fijan respuestas simuladas a propósito.

### Flujos clave

**F1 — Ejecución de los casos (manual, criterio humano)** // satisface: AC-1, AC-2, AC-3
1. El mantenedor ejecuta `npm run test:eval -- epic-validate --only <los cuatro TC-NNN>`.
2. Por cada caso, `run-evals.js` construye el prompt con `input`; el runner simula `SKILL.md` y emite `=== CONSOLE ===` y `=== FILE: specs/flow/EPIC-90-…/epic-validate-report.md ===`.
3. `gradeOutput` aplica la forma cerrada y las aserciones específicas. Si se repite la ejecución con los mismos artefactos, cada caso obtiene el mismo veredicto esperado, sin preguntas (auto) y sin ejecutar comandos reales (resultados fijados en `command_results`).

**F2 — Guardia continua** // satisface: AC-3, CNF-1, CNF-3
1. `npm test` ejecuta `test/epic-validate-evals.test.js`.
2. C3 lee `evals.json`, extrae el veredicto declarado de cada caso y aplica G-A…G-F.
3. Si alguien borra el último caso `BLOCKED`, deja un caso con solo `verdict: <V>` o agrega una pregunta al conjunto de regresión, la prueba falla con el mensaje de la tabla de Interfaces, sin consumir cuota.

**F3 — Regresión del gateway detectada** // satisface: AC-3
1. Un cambio en `SKILL.md` invierte la precedencia de G-05.
2. En F1, `regresion-veredicto-precedencia` obtiene `` **Veredicto:** `BLOCKED` ``, que viola su `not_contains` → `❌ FAIL`, y `run-evals.js` sale con código 1.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Conjunto propio o reutilizar los casos de las hermanas | Cuatro casos propios sobre un mundo base común, y la forma cerrada aplicada también a los casos existentes | (a) Solo reutilizar TC-001/TC-002/TC-004 de STORY-124 y V-6 de STORY-125; (b) duplicar todos los casos con otra forma | (a) Ninguno cubre la fila 3 de AC-2 ni el comando controlado de CNF-2, y sus mundos difieren entre sí, así que un fallo no aísla qué variación lo produjo. Además, las historias que los crean pueden cambiarlos. (b) Duplica sin aportar cobertura. Un mundo base con una variación por caso hace que cada fallo apunte a una sola causa | AC-1, AC-2, CNF-1 |
| D-2 | Cómo provocar `BLOCKED` | Comando de smoke tests inexistente (`sddf-eval-smoke-inexistente`) con `command_results` → `not-executable` | (a) Sin `verify.e2e-smoke` declarado (V-6 de STORY-125); (b) `epic-analyze-report.md` ausente (TC-004 de STORY-124) | Es el ejemplo literal de CNF-2 y el escenario «smoke tests que no se pueden ejecutar» de AC-2. (a) y (b) ya están cubiertos por sus historias y prueban otras ramas de `bloqueada` | AC-2, CNF-2 |
| D-3 | Forma de afirmar el veredicto | `verdict: <V>⏎created:` + `` **Veredicto:** `<V>` `` + `not_contains` de los otros dos valores en `## Veredicto` | (a) Solo `verdict: <V>`; (b) cambiar `gradeOutput` para parsear el frontmatter; (c) un campo nuevo `expected_verdict` en el caso | (a) Una evidencia de `EST-02` que cite `verdict: APPROVED` del análisis satisface la subcadena aunque el reporte no tenga `verdict`, y eso viola CNF-3. El salto de línea seguido de `created:` solo ocurre en el frontmatter, por el orden del template seed. (b) Cambia el runner de todos los skills, fuera de alcance. (c) El runner lo ignoraría; sería una segunda fuente del veredicto esperado que puede divergir de las aserciones (P10) | CNF-3 |
| D-4 | Verificación de AC-3 | Guardia determinista en `npm test` (C3) más la ejecución manual de los evals | (a) Ejecutar `test:eval` en `verify:repository`; (b) solo ejecución manual | (a) Consume cuota en cada verificación, contra `AGENTS.md`. (b) Nada impediría borrar el último caso de un veredicto. C3 sigue el precedente de `test/sddf-init-layout.test.js` | AC-3, CNF-1 |
| D-5 | Dónde vive la guardia | Archivo nuevo `test/epic-validate-evals.test.js` | (a) Ampliar `scripts/verify-eval-inventory.js`; (b) agregar la prueba a otro archivo | (a) El inventario es genérico para todos los skills; conocer los veredictos de uno solo le daría dos razones de cambio (P11). (b) Ningún archivo de prueba existente trata `epic-validate` | AC-3 |
| D-6 | Dependencia de STORY-126 | Los casos no afirman `RESULTADO:` ni mensajes de `--dry-run`; usan `--mode auto`, que ya reconoce STORY-125 (D-6) | Afirmar el bloque `RESULTADO:` | El veredicto se lee del reporte (CNF-3, G-06), no de la consola. Así el conjunto funciona con STORY-124 y STORY-125 implementadas, esté o no STORY-126 | AC-1, AC-2 |
| D-7 | Determinismo frente a un runner LLM | El mundo y los resultados de comandos se fijan en `input`; las aserciones solo usan tokens contractuales (IDs, valores, marcadores) | Afirmar frases completas del motivo o de la consola | La redacción libre puede variar entre ejecuciones del runner; los tokens contractuales no. Es lo que permite que «se ejecutan nuevamente» dé el mismo resultado | AC-3, CNF-2 |
| D-8 | Numeración de los casos | Siguientes `TC-NNN` libres al implementar, en el orden de la tabla de Interfaces; C3 los identifica por `name` | IDs fijos (p. ej. TC-030…TC-033) | La numeración depende del orden de implementación de STORY-124/125/126 (STORY-126 ya usa «siguiente libre»). Identificarlos por `name` hace la guardia independiente del número | AC-3 |

### Decisiones de complejidad justificada

- **Guardia en Node (C3) en lugar de solo casos:** AC-3 pide que los casos se conserven. Sin una prueba que corra en `npm test`, eso depende de la memoria del mantenedor. La prueba lee un JSON y aplica seis reglas; no ejecuta el skill ni el runner.
- **`command_results` en `input`:** es la forma explícita de lo que el prompt del runner ya permite («resultados que devuelve cada … comando»). Sin ella, el runner podría inferir el resultado de `node -e "process.exit(0)"` o de un comando inexistente a su criterio. G-F la exige solo en el conjunto de regresión.
- **Mundo base común:** cuatro casos con una variación cada uno, en lugar de cuatro fixtures independientes. Se descarta una abstracción de «fixture compartida» en el JSON: `evals.json` no admite referencias, así que el mundo se repite literalmente en cada caso y la tabla de variaciones documenta la diferencia.

### Puntos de variación (P6)

- **Orden del frontmatter del template:** si STORY-124 (u otra historia) reordena los campos del template seed y `created` deja de seguir a `verdict`, cambia solo la entrada `verdict: <V>⏎created:` (y su regla en C3). La alternativa de cambiar el runner (D-3 b) sigue disponible si se necesita una lectura más robusta para varios skills.
- **Nuevos veredictos o comprobaciones:** si la política agrega un valor, se agrega a la lista de G-B/G-C y, si corresponde, un caso de regresión.
- **Nuevos comandos configurables** (STORY-169, suites): G-F amplía la lista de claves de `input` que deben tener `command_results`.

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `skills/epic-validate/evals/evals.json` no existe (STORY-124 sin implementar) | C3 falla con `… no existe (STORY-124 sin implementar)`; señala la dependencia en lugar de pasar en falso |
| `OPE-01` no existe en `SKILL.md` (STORY-125 sin implementar) | Los casos `smoke-no-ejecutable` y `precedencia` fallan en F1; C3 no lo detecta (no ejecuta el skill). Las tareas ordenan esta historia detrás de STORY-125 (CR-001) |
| El runner no termina o no emite `=== END ===` | `run-evals.js` registra el caso como error (comportamiento existente); no se cuenta como pase |
| El runner omite el frontmatter en el bloque `FILE` | Falla la aserción `verdict: <V>⏎created:` → el caso falla cerrado (CNF-3) |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| V-1 | `regresion-veredicto-approved` → reporte con `verdict: APPROVED` en el frontmatter y `` **Veredicto:** `APPROVED` ``, `Sin motivos.` | `npm run test:eval -- epic-validate --only <TC>` (manual) | AC-1 |
| V-2 | `regresion-veredicto-historia-no-terminal` → `NEEDS-CHANGES` y motivo con `STORY-902` e `IMPLEMENT/IN-PROGRESS` | Eval (manual) | AC-2 |
| V-3 | `regresion-veredicto-smoke-no-ejecutable` → `BLOCKED` y motivo `[BLOCKED]` con `OPE-01`, `SMOKE-1` y `no ejecutable`, sin ningún `[NEEDS-CHANGES]` | Eval (manual) | AC-2, CNF-2 |
| V-4 | `regresion-veredicto-precedencia` → `NEEDS-CHANGES`, con ambos motivos y sin `` **Veredicto:** `BLOCKED` `` | Eval (manual) | AC-2 |
| V-5 | Una segunda ejecución de los cuatro casos da los mismos veredictos sin preguntas | Eval repetido (manual) | AC-3 |
| V-6 | G-A…G-F se cumplen sobre el `evals.json` real | `node --test test/epic-validate-evals.test.js` | AC-3, CNF-1, CNF-2, CNF-3 |
| V-7 | La guardia falla si se elimina el único caso `BLOCKED`, si un caso conserva solo `verdict: <V>`, o si un caso de regresión agrega `user_answers` | `node --test test/epic-validate-evals.test.js` con manifiestos en memoria | AC-3, CNF-3 |
| V-8 | `npm run verify:repository` (incluye `verify:eval-inventory`: IDs únicos) y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (C1 `approved`, V-1), AC-2 (C1 tres variaciones, V-2…V-4), AC-3 (C3 G-B, G-D, G-E; F2; V-5…V-7), CNF-1 (G-B), CNF-2 (D-2, `command_results`, G-F), CNF-3 (D-3, C2, G-C). No hay omisiones.
- **Ambigüedad:** cómo se ejecuta «nuevamente» sin gastar cuota (D-4), cómo se provoca `BLOCKED` (D-2) y cómo se afirma un `verdict` ausente o distinto con un calificador por subcadenas (D-3) quedan decididos. La lectura de «servicios externos» frente al runner LLM se registra en CR-002.
- **Nombres:** «veredicto declarado», «forma cerrada», «mundo base», «conjunto de regresión» y `command_results` se usan con un único significado. Los resultados (`no ejecutable`, `bloqueada`) son los de STORY-125, sin sinónimos.
- **Estructura:** C3 lee C1 y C2; ninguno lee a C3. No hay ciclos. C3 tiene una sola razón de cambio: el contrato de cobertura de `evals.json`.

## Risks / Trade-offs

- [El runner es un LLM: dos ejecuciones pueden redactar distinto] → Las aserciones solo usan tokens contractuales (D-7). Un fallo intermitente se trata como una ambigüedad del `SKILL.md`, no se relaja la aserción.
- [Acoplamiento al orden `verdict` → `created` del template seed] → Es el contrato que fija STORY-124 T016. Si cambia, falla C3 y el cambio se ve en la misma revisión (punto de variación).
- [C2 modifica casos que crearon STORY-124/125/126] → Solo se agregan aserciones de la forma cerrada; no cambia su `input` ni su intención. Si una de esas historias se implementa después que esta, su caso nuevo tiene que cumplir G-C, y C3 lo exige.
- [Los evals no se ejecutan en CI] → Es una decisión de `AGENTS.md`. C3 garantiza que la red de casos exista; su ejecución (V-1…V-5) queda como verificación manual registrada en `implement-report.md`.

## Open Questions

Ninguna: las decisiones abiertas se resuelven en D-1…D-8, y las que afectan a otros documentos se registran como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `skills/epic-validate/evals/evals.json` y el `SKILL.md` que simulan los casos los crea STORY-124. Las comprobaciones `OPE-01` (smoke tests vía `check-command`) y `--mode auto` los agrega STORY-125. Ambas están en `READY-FOR-IMPLEMENT/DONE`, sin implementar. STORY-126 no es requisito (D-6).
- **Documento afectado**: tasks.md
- **Acción requerida**: ordenar las tareas detrás de STORY-124 y STORY-125 implementadas, con una tarea inicial que lo verifique. C3 puede escribirse antes, pero falla por diseño hasta que exista `evals.json`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: CNF-2 dice que los resultados «no dependen de servicios externos no controlados por el caso». `run-evals.js` siempre usa un runner LLM (`claude` o `codex`), que es un servicio externo. El diseño interpreta que el runner es el mecanismo de evaluación, y que el caso controla todo lo demás: artefactos, configuración y resultado de cada comando (`command_results`).
- **Documento afectado**: story.md
- **Acción requerida**: opcionalmente, precisar CNF-2 como «… no dependen de servicios externos, salvo el runner de evals, ni de comandos reales: el resultado de cada comando lo fija el propio caso».

### CR-003
- **Tipo**: ambigüedad (documento de la épica)
- **Descripción**: `epic.md` (Notas, «Alineación pendiente de historias existentes») dice que «STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED`». STORY-128 ya usa los tres valores y la precedencia de G-05 (AC-2, CNF-3, Notas).
- **Documento afectado**: epic.md
- **Acción requerida**: al refinar la épica, quitar STORY-128 de esa línea.

### CR-004
- **Tipo**: decisión de implementación (2026-10-30)
- **Descripción**: al implementar C2 y C3 aparecieron cuatro detalles que el diseño no fijaba:
  - `threshold` vive en el caso (`testCase.threshold`, lo lee `gradeOutput`), no en `expected`. La forma cerrada lo exige ausente o `1` en ambos lugares; los casos existentes pasan de `0.95` a `1`.
  - Los casos de STORY-125/126 fijan las respuestas simuladas en `maintainer_answers`, no en `user_answers`. G-E rechaza ambas claves en el conjunto de regresión.
  - `command_results` tiene además la entrada `npm run verify:release`, porque es lo que ejecuta el Paso 3c, aunque G-F solo exige las cadenas configuradas.
  - Mensajes de C3 sin fila en la tabla de Interfaces: `<TC-NNN>: el caso de regresión <nombre> no declara <V> (AC-3)` (G-D), `<TC-NNN>: depende de un servicio externo: <cadena> (CNF-2)` (G-F) y `evals.json no tiene casos en cases[] (CS-9)` (G-A).
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; queda registrado para la revisión.
