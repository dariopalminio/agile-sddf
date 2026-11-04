---
alwaysApply: false
type: design
id: STORY-125
slug: STORY-125-validar-evidencia-operativa-epica-design
title: "Design: Validar la evidencia operativa de una épica"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-125
created: 2026-10-29
updated: 2026-10-30
related:
  - STORY-125-validar-evidencia-operativa-epica
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-128-evaluar-validacion-epica-repetible
  - STORY-169-suites-de-integracion-y-regresion-de-la-epica
---

<!-- Referencias -->
[[STORY-125-validar-evidencia-operativa-epica]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-169-suites-de-integracion-y-regresion-de-la-epica]]

## Context

STORY-124 crea `/epic-validate` con dos comprobaciones estructurales (`EST-01` cierre de historias, `EST-02` análisis de la épica). Su veredicto es una función pura de la tabla `comprobación → resultado`, y deja reservada la familia `OPE-` para esta historia. Esta historia agrega la **evidencia operativa** (CS-4, SMOKE-1): smoke tests `SMOKE-N` de `epic.md`, el comando `verify:release` y el DoD de épica cuando exista.

Estado verificado en el filesystem (2026-10-29):

- **Skill base:** `skills/epic-validate/` aún no existe. STORY-124 está en `READY-FOR-IMPLEMENT/DONE` con su `design.md` y `tasks.md`. Esta historia modifica el `SKILL.md`, el template seed y los evals que crea STORY-124 (CR-003).
- **Smoke tests:** la sección `clave: smoke-tests` de `docs/templates/epic-template.md` contiene escenarios `### SMOKE-N — <nombre>` en bloques `gherkin`, sin comando asociado. `skills/epic-analyze/SKILL.md` (Paso 5b) ya fija cómo se extraen los IDs (`SMOKE-<N>`, implícitos, duplicados) y cómo una historia los cubre por mención explícita (evidencia E1: el token `SMOKE-<N>` con límite de palabra, fuera de una sección `Fuera de alcance`).
- **Comando de smoke tests:** `sddf.config.yaml › verify` declara `e2e-smoke.command: "npm run test:e2e:smoke"` (`required: false`), y `package.json › scripts` no declara `test:e2e:smoke`. `e2e-file` ya usa un placeholder `{{test_file_path}}` en su comando: es el precedente de sustitución.
- **`verify:release`:** `package.json › scripts["verify:release"] = "node scripts/verify-release.js"`. Es offline, solo lee `package.json`, `package-lock.json` y `CHANGELOG.md`, y termina con código 0 o 1.
- **DoD de épica:** `docs/guardrails/` solo contiene `dod-story-*` y `gr-*`. STORY-169 (`READY-FOR-IMPLEMENT/DONE`) fijó la ruta `docs/guardrails/dod-epic-validate.md`, la sección `dod-epica` (I3), la tabla de evaluación de criterios y el respeto de `enforcement`. En su CR-002 propone que una sola historia sea dueña del DoD.
- **Motor de comandos:** el diseño de STORY-169 (D-1, D-2, D-3) define `skills/epic-validate/scripts/epic-suites.js` con el subcomando `check-command`. Devuelve `CommandResult { ok, command, outcome: pass | fail | not-executable, exitCode, durationSeconds, reason, outputTail }`. Distingue un script npm no declarado (que `npm run` devuelve como código 1) de un fallo real, y los códigos 127/9009 de «ejecutable no encontrado».
- **Reportes de historia con veredicto:** `verify-report.md` y `acceptance-report.md` declaran `verdict` en el frontmatter (`validation-contract-policy` §4, G-01). G-06 establece que solo `APPROVED` habilita.
- **Vocabulario (decisión del PO en EPIC-23, Notas, 2026-10-17):** `NEEDS-CHANGES` significa que la evidencia existe pero no cumple (smoke tests o `verify:release` fallidos, DoD incumplido). `BLOCKED` significa que no se puede obtener la evidencia. G-05 establece que gana `NEEDS-CHANGES`. El AC-2 de la historia todavía dice `BLOCKED` (CR-001).
- **Modos:** la tabla de flags de EPIC-23 dice: `--mode auto` fuerza la ejecución automática y falla si no hay tests configurados; `--mode manual` fuerza el modo interactivo; sin `--mode`, se usa auto si hay tests configurados. STORY-126 es dueña del mensaje para valores inválidos, de los códigos de salida y de `--dry-run`.

## Goals / Non-Goals

**Goals:**

- Agregar al veredicto de STORY-124 tres comprobaciones operativas: `OPE-01` smoke tests, `OPE-02` `verify:release` y `OPE-03` DoD de épica. // satisface: AC-1, AC-2, AC-3
- Tomar la evidencia de cada `SMOKE-N` según el modo. En `--mode auto`, de su ejecución, sin preguntar nada. En `--mode manual`, de un reporte aprobado de la historia dueña o, si no hay ninguno, de la confirmación del mantenedor. // satisface: AC-1, AC-2
- Ejecutar `verify:release` en ambos modos si está declarado, y omitirlo con una advertencia si no lo está. // satisface: AC-1, AC-2, AC-3, CNF-2
- Evaluar `docs/guardrails/dod-epic-validate.md` criterio por criterio si existe, y omitirlo con una advertencia si no existe. // satisface: AC-2, AC-3
- Registrar en el reporte cada resultado con el elemento evaluado (smoke test, comando o criterio), su resultado y la fuente de su evidencia. // satisface: CNF-1, AC-1, AC-2
- No volver a ejecutar las verificaciones de las historias hijas, ni ejecutar smoke tests fuera de `--mode auto`. // satisface: CNF-2
- Mantener `npm run verify:repository` y `npm test` en verde. // satisface: CS-21

**Non-Goals:**

- Las comprobaciones estructurales `EST-*` (STORY-124) y las suites de nivel épica `integration`, `e2e` y `e2e-regression` (STORY-169).
- La mecánica completa de `--mode` (mensaje para valores inválidos, códigos de salida), `--dry-run` y la idempotencia como contrato verificado (STORY-126), y `--verbose` (STORY-137).
- Definir smoke tests nuevos, cambiar el formato de `SMOKE-N` en `epic.md`, o crear o editar `docs/guardrails/dod-epic-validate.md`.
- Cambiar el `status` o el `substatus` de la épica o de sus historias.
- Los evals de cobertura CS-9 (STORY-128). Aquí solo se agregan los casos de los AC de esta historia.

## Decisions

### Componentes

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Paso «Modo de evidencia» | modificar | `skills/epic-validate/SKILL.md` | Resolver `MODO` (`auto` o `manual`) a partir de `--mode` | AC-1 |
| C2 | Paso «Smoke tests de la épica» (`OPE-01`) | modificar | `skills/epic-validate/SKILL.md` | Obtener la evidencia de cada `SMOKE-N` según `MODO` y clasificar su resultado | AC-1, AC-2, AC-3, CNF-1, CNF-2 |
| C3 | Paso «Verificación de release» (`OPE-02`) | modificar | `skills/epic-validate/SKILL.md` | Detectar el script `verify:release`, ejecutarlo con el motor y clasificar el resultado | AC-1, AC-2, AC-3, CNF-2 |
| C4 | Paso «DoD de validación de épica» (`OPE-03`) | modificar | `skills/epic-validate/SKILL.md` | Evaluar cada criterio `- [ ]` del DoD, si existe, con la tabla de evaluación de STORY-169 | AC-2, AC-3 |
| C5 | Regla del veredicto | modificar | `skills/epic-validate/SKILL.md` (paso de veredicto de STORY-124) | Agregar el resultado `omitida` (sin efecto) y las filas `OPE-*`. La función no cambia | AC-1, AC-2, AC-3 |
| C6 | Reglas de pertenencia de smoke tests | modificar | `skills/epic-validate/references/story-sources.md` | Extraer los `SMOKE-N` y resolver la historia dueña de cada uno (reglas del Paso 5b de `epic-analyze`, citando su origen) | AC-1, AC-2 |
| C7 | Motor de comandos (`check-command`) | crear o reutilizar | `skills/epic-validate/scripts/epic-suites.js` | Ejecutar un comando de verificación y clasificarlo (`pass`, `fail`, `not-executable`), según el contrato I1 de STORY-169 (D-1) | AC-1, AC-2 |
| C8 | Pruebas del motor | crear o reutilizar | `test/epic-suites.test.js` | Probar `check-command` con fixtures temporales (V-3, V-4 y V-6 de STORY-169) | AC-1, AC-2 |
| C9 | Secciones del reporte | modificar | `skills/epic-validate/assets/epic-validate-report-template.md` | Declarar `## Smoke tests de la épica` (`smoke-epica`) y `## DoD de validación de épica` (`dod-epica`) | AC-1, AC-2, AC-3, CNF-1 |
| C10 | Casos de eval | modificar | `skills/epic-validate/evals/evals.json` | Cubrir AC-1 (tres fuentes), AC-2 (tres comprobaciones) y AC-3 | AC-1, AC-2, AC-3 |
| C11 | Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (fila `epic-validate`) | Agregar a «lee» `sddf.config.yaml`, `package.json`, `docs/guardrails/dod-epic-validate.md` y los `verify-report.md`/`acceptance-report.md` de las historias dueñas | CNF-1 (veracidad documental, `AGENTS.md`) |

No se edita `package.json`: `files` ya publica `skills/`. No se crea un script en `scripts/`.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-validate <epica> [--mode auto\|manual]`. Sin `--mode`, `MODO = auto` si `verify.e2e-smoke.command` está declarado y `MODO = manual` en caso contrario (tabla de flags de EPIC-23). Un valor distinto de `auto` o `manual` produce el error genérico de STORY-124 (D-7), sin escribir. STORY-126 lo amplía (D-6) | AC-1 |
| Comando de smoke tests | `sddf.config.yaml › verify.e2e-smoke.command`, leído en tiempo de ejecución. Si contiene `{{smoke_id}}`, se ejecuta una vez por `SMOKE-N` con el ID sustituido. Si no lo contiene, se ejecuta una sola vez y su resultado se asigna a cada `SMOKE-N` (D-2) | AC-1, AC-2 |
| Comando de release | `npm run verify:release`, solo si `package.json › scripts` declara `verify:release` (D-3) | AC-1, AC-2, AC-3 |
| Motor (I1 de STORY-169) | `node <CLI_ROOT>/skills/epic-validate/scripts/epic-suites.js check-command --repo-root <REPO_ROOT> --command "<cmd>"` devuelve un único JSON `CommandResult` por stdout. El proceso sale con 0 si pudo evaluar, con 1 ante un error interno y con 2 ante argumentos inválidos. No escribe archivos ni lee stdin | AC-1, AC-2 |
| Lectura de reportes de la historia dueña | Solo el campo `verdict` del frontmatter de `<STORY_DIR>/acceptance-report.md` y de `<STORY_DIR>/verify-report.md`, en historias activas o archivadas (G-06). El cuerpo nunca se lee | AC-1 |
| Confirmación manual | Por cada `SMOKE-N` sin reporte aprobado: `` ¿Se cumple `SMOKE-N` — `<nombre>`? Resultado esperado: `<paso Entonces>` (s = sí · n = no · o = omitir) ``. El agente pregunta una vez y no infiere la respuesta | AC-1, AC-2 |
| Lectura del DoD | `docs/guardrails/dod-epic-validate.md` (ruta fija): sus líneas `- [ ]` y el campo `enforcement` del frontmatter (I3 de STORY-169) | AC-2, AC-3 |
| Salida en consola | La de STORY-124. Los motivos `OPE-*` usan el mismo formato (`M-NNN [<VALOR>] <comprobación> — <elemento>`), y cada comprobación omitida agrega una línea `⚠️ <OPE-NN> omitida — <motivo>` | AC-2, AC-3 |

### Esquema de datos

**Smoke tests de la épica** (C6, reglas de `epic-analyze` Paso 5b) // satisface: AC-1, AC-2, CNF-1

Cada `### SMOKE-<N> — <nombre>` de la sección `clave: smoke-tests` de `epic.md` da una fila con estos campos:

- `id` y `nombre`.
- `resultado_esperado`: el paso `Entonces` y los `Y`/`Pero` que lo siguen, citado literalmente en la pregunta de confirmación.
- `dueñas`: las historias del universo de STORY-124 cuyo `story.md` menciona `SMOKE-<N>` con evidencia E1.

Los encabezados sin ID siguen la regla de IDs implícitos de `epic-analyze`.

**Fuente de evidencia de un `SMOKE-N`** (C2, D-1, D-4) // satisface: AC-1, AC-2, CNF-2

| `MODO` | Orden | Condición | Resultado del smoke | Fuente registrada |
|---|---|---|---|---|
| `auto` | 1 | `verify.e2e-smoke.command` no está declarado | `no ejecutable` | `` `verify.e2e-smoke` no declarado en sddf.config.yaml `` |
| `auto` | 2 | `check-command` → `pass` | `aprobado` | `` ejecución: `<cmd>` (<duración> s) `` |
| `auto` | 3 | `check-command` → `fail` | `fallido` | `` ejecución: `<cmd>` (código <n>) `` + `outputTail` |
| `auto` | 4 | `check-command` → `not-executable` | `no ejecutable` | `` ejecución: `<cmd>` — <reason> `` |
| `manual` | 1 | Una historia dueña tiene `acceptance-report.md` con `verdict: APPROVED` (si no, se busca `verify-report.md` con `verdict: APPROVED`) | `aprobado` | `` reporte: `<ruta>` (verdict: APPROVED) `` |
| `manual` | 2 | Sin reporte aprobado, y el mantenedor responde `s` | `aprobado` | `confirmación manual del mantenedor` |
| `manual` | 3 | Sin reporte aprobado, y el mantenedor responde `n` | `fallido` | `confirmación manual del mantenedor (negativa)` |
| `manual` | 4 | Sin reporte aprobado, y el mantenedor responde `o`, otra cosa, o no se le puede preguntar | `sin evidencia` | `sin reporte aprobado ni confirmación` |

En `--mode auto` nunca se pregunta. En `--mode manual` nunca se ejecuta un smoke test. Si hay varias dueñas, se toma la de menor `STORY-NNN` que tenga un reporte aprobado. Un reporte con otro `verdict` no es evidencia aprobatoria y se cita como nota en la fuente.

**Comprobaciones operativas** (resultados con el vocabulario de STORY-124 más `omitida`) // satisface: AC-1, AC-2, AC-3

| ID | Comprobación | `cumple` | `no cumple` | `bloqueada` | `omitida` |
|---|---|---|---|---|---|
| `OPE-01` | Smoke tests de la épica | Todos los `SMOKE-N` `aprobado` | ≥ 1 `fallido`, o la épica no declara ningún `SMOKE-N` | 0 `fallido` y ≥ 1 `no ejecutable` o `sin evidencia` | nunca (AC-3: se evalúan siempre) |
| `OPE-02` | `verify:release` | `check-command` → `pass` | `check-command` → `fail` | `check-command` → `not-executable`, o el motor no está disponible | `package.json` ausente o sin `scripts["verify:release"]`, con `⚠️` |
| `OPE-03` | DoD de validación de épica | Todos los criterios `cumplido`, o `enforcement: warn` | ≥ 1 `incumplido` con `enforcement: error` o sin ese campo | 0 `incumplido` y ≥ 1 `sin evidencia` | El archivo no existe o no tiene líneas `- [ ]`, con `⚠️` |

**Evaluación de un criterio del DoD** (C4): se reutiliza la tabla de STORY-169 (orden 1 a 4: comando de escritura → `sin evidencia`; comando de verificación → `check-command`; archivo o campo → lectura; otro → sin evidencia). La única diferencia es el orden 4 en `MODO = manual`: se pide confirmación (`s` → `cumplido`, `n` → `incumplido`, otra respuesta → `sin evidencia`) (D-5). // satisface: AC-2, AC-3

**Veredicto** (C5, la función de STORY-124 sin cambios) // satisface: AC-1, AC-2, AC-3

`omitida` cuenta como `cumple` para el veredicto. Con ≥ 1 `no cumple`, el veredicto es `NEEDS-CHANGES` (G-05). Con 0 `no cumple` y ≥ 1 `bloqueada`, es `BLOCKED`. En cualquier otro caso, es `APPROVED`. El veredicto final es `BLOCKED` o `NEEDS-CHANGES` si lo es cualquier comprobación `EST-*` u `OPE-*`, como pide la nota de la historia.

**Motivos `OPE-*`**: el formato `M-NNN` de STORY-124. Se ordenan por comprobación (`EST-01` < `EST-02` < `OPE-01` < `OPE-02` < `OPE-03`), dentro de `OPE-01` por `N` numérico, y dentro de `OPE-03` por número de criterio. Hay un motivo por cada smoke test o criterio que no aprueba, y uno para `OPE-02`. Acciones sugeridas: // satisface: AC-2, CNF-1

| Elemento | Veredicto del motivo | Acción sugerida |
|---|---|---|
| `SMOKE-N` `fallido` | `NEEDS-CHANGES` | `corregir el comportamiento en la historia dueña (<STORY-NNN> o «sin dueña») y volver a validar` |
| `SMOKE-N` `no ejecutable` | `BLOCKED` | `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual` |
| `SMOKE-N` `sin evidencia` | `BLOCKED` | `aprobar la historia dueña con /story-acceptance o confirmar el smoke test en una sesión interactiva` |
| `OPE-02` `no cumple` | `NEEDS-CHANGES` | `corregir lo que reporta npm run verify:release` |
| `OPE-02` `bloqueada` | `BLOCKED` | `revisar el motivo de no ejecución de verify:release` |
| Criterio del DoD `incumplido` o `sin evidencia` | `NEEDS-CHANGES` o `BLOCKED` | `cumplir el criterio <n> de dod-epic-validate.md` o `aportar evidencia del criterio <n>` |

**Template seed, secciones nuevas** (insertadas entre `historias-epica` y `motivos`, con el marcador `<!-- sección obligatoria · clave: <clave> · escritor: epic-validate -->`) // satisface: AC-1, AC-2, AC-3, CNF-1

| Título | Clave | Contenido que escribe el skill |
|---|---|---|
| `## Smoke tests de la épica` | `smoke-epica` | Primera línea: `` Modo: `<MODO>` ``. Luego, una tabla `SMOKE │ Nombre │ Resultado │ Fuente de evidencia │ Historia dueña`, con una fila por `SMOKE-N` y los valores en código en línea, o la línea `Sin smoke tests declarados en epic.md`. |
| `## DoD de validación de épica` | `dod-epica` | La tabla I3 de STORY-169 (`# │ Criterio │ Estado │ Evidencia`), o la línea `Omitido — ⚠️ <motivo>` |

`OPE-02` no tiene sección propia: su fila de `## Comprobaciones` registra `` `npm run verify:release` ``, el resultado, la duración y, si falla, `outputTail` en `## Motivos`. Las filas `OPE-01…03` se agregan a `## Comprobaciones` después de las `EST-*`, y `## Resumen` suma una fila `Smoke tests: <aprobados>/<total> (modo <MODO>)`.

### Flujos clave

**F1 — `--mode auto`, todo aprobado** // satisface: AC-1 (fila auto), SMOKE-1

1. Se ejecutan los pasos de STORY-124 (`EST-01`, `EST-02` → `cumple`). C1 fija `MODO = auto`.
2. C2 extrae los `SMOKE-N`, lee `verify.e2e-smoke.command` e invoca `check-command` (una vez por smoke si el comando tiene `{{smoke_id}}`). Todos dan `pass`, y cada smoke queda `aprobado` con la fuente `ejecución: …`.
3. C3 detecta `scripts["verify:release"]` e invoca `check-command --command "npm run verify:release"`. El resultado es `pass`.
4. C4 no encuentra `dod-epic-validate.md`, así que `OPE-03` queda `omitida` con `⚠️`.
5. C5 da `APPROVED`, y `## Motivos` dice `Sin motivos.`

**F2 — `--mode manual` con reporte aprobado o confirmación** // satisface: AC-1 (filas manual), CNF-2

Son los mismos pasos de F1, salvo el 2. C2 no ejecuta nada: por cada `SMOKE-N` busca la historia dueña y su `acceptance-report.md` o `verify-report.md` con `verdict: APPROVED`. Si lo encuentra, el smoke queda `aprobado` con `reporte: <ruta>`. Si no, se pregunta al mantenedor: `s` → `aprobado` con `confirmación manual del mantenedor`. `verify:release` se ejecuta igual (CNF-2).

**F3 — Una comprobación configurada falla** // satisface: AC-2

Hay tres casos:

- Un smoke test sale con `fail` (en auto) o recibe `n` (en manual): `OPE-01 no cumple`.
- `verify:release` sale con `fail`: `OPE-02 no cumple` con `outputTail`.
- Un criterio del DoD queda `incumplido`: `OPE-03 no cumple`.

En los tres casos el veredicto es `NEEDS-CHANGES` (D-7, CR-001), y el motivo identifica la comprobación, el elemento, el resultado y la fuente. Si la evidencia no se puede obtener (`no ejecutable`, `sin evidencia`) y nada falla, el veredicto es `BLOCKED`.

**F4 — Controles opcionales no configurados** // satisface: AC-3

`package.json` no declara `verify:release` y `dod-epic-validate.md` no existe. `OPE-02` y `OPE-03` quedan `omitida`, cada una con `⚠️` en la consola, en `## Comprobaciones` y en `## Notas de la validación`, y el veredicto no cambia por eso. C2 evalúa los `SMOKE-N` de todos modos.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Qué significa «ejecutar» un `SMOKE-N` en `--mode auto` | Ejecutar `verify.e2e-smoke.command` de `sddf.config.yaml` con el motor `check-command` | (a) Que el agente reproduzca el escenario Gherkin; (b) ejecutar los evals que citan el smoke; (c) un comando por smoke declarado dentro de `epic.md` | (a) No es determinista, y un smoke como SMOKE-8 (archivar una épica) escribiría fuera del reporte (CS-7). (b) Consume cuota de evals, que `AGENTS.md` reserva al criterio humano. (c) Cambia el formato de `SMOKE-N`, que está fuera de alcance y es dueño de `epic-format-validation`. `verify` ya es la fuente única de comandos (CNF-1 de STORY-169) | AC-1, AC-2 |
| D-2 | Correspondencia entre la ejecución y cada `SMOKE-N` | El placeholder `{{smoke_id}}` da una ejecución por smoke. Sin él, una sola ejecución cuyo resultado se asigna a todos | (a) Exigir siempre el placeholder; (b) parsear la salida del runner | Sigue el precedente de `{{test_file_path}}` en `verify.e2e-file`. (a) Bloquearía a los proyectos cuyo runner ejecuta todos los smoke tests a la vez. (b) Depende del formato de cada runner. El ID se valida contra `^SMOKE-\d+$` antes de sustituirlo, así que nada que no sea un ID entra al comando | AC-1, CNF-1 |
| D-3 | Qué es «el comando verify:release» | El script npm `verify:release` de `package.json`, ejecutado como `npm run verify:release` en ambos modos | (a) Una clave nueva `verify.release` en `sddf.config.yaml`; (b) ejecutarlo solo en auto | Es el nombre que usan la historia y CS-4. (a) Agrega configuración y un contrato nuevo para `verify:config` sin una necesidad actual (YAGNI; ver P6). (b) Contradice CNF-2: solo los smoke tests están limitados a auto. Es offline y de solo lectura | AC-1, AC-3, CNF-2 |
| D-4 | Qué reporte cuenta como evidencia en `--mode manual` | El `acceptance-report.md` de una historia dueña, con prioridad, o si no su `verify-report.md`, siempre con `verdict: APPROVED` | (a) Exigir que el reporte mencione `SMOKE-N`; (b) usar `epic-analyze-report.md`; (c) aceptar cualquier `verdict` | La historia dueña verifica el smoke por un AC suyo (E1). Su aceptación es la evidencia más cercana al comportamiento. (a) Esos reportes listan AC, no smoke tests, así que habría que cambiar formatos de otros skills. (b) Ese reporte prueba la cobertura, no la operación. (c) Viola G-06 | AC-1 |
| D-5 | DoD de épica: dueña y modos | Esta historia implementa `OPE-03` con la ruta, la sección I3 y la tabla de evaluación de STORY-169, en ambos modos. En manual, un criterio sin evidencia automática se confirma | (a) Dejarle el DoD a STORY-169 (su CR-002); (b) una tabla propia | Los AC-2 y AC-3 de esta historia exigen el DoD, y esta historia se implementa antes. (a) Dejaría esos AC sin diseño. (b) Evaluaría el mismo DoD dos veces con reglas distintas. CR-002 ajusta STORY-169 para que lo reutilice | AC-2, AC-3 |
| D-6 | Modo antes de STORY-126 | Reconocer `--mode auto` y `--mode manual`. Sin flag, aplicar la regla de la tabla de flags de EPIC-23 | (a) Un modo fijo, sin flag; (b) implementar ya la validación completa de `--mode` | La nota de la historia permite simular el modo como un parámetro. Tomar la regla de la épica evita rehacerla. (b) Es el AC-3 de STORY-126 | AC-1 |
| D-7 | Vocabulario ante una comprobación fallida | `NEEDS-CHANGES`. `BLOCKED` solo cuando no se puede obtener la evidencia | `BLOCKED` (el texto actual de AC-2) | Lo decidió el PO en EPIC-23 (2026-10-17), lo exige G-05, y es igual que STORY-124 D-6 y STORY-169. Ver CR-001 | AC-2 |
| D-8 | Motor de comandos | Reutilizar `epic-suites.js check-command` (I1 de STORY-169). La historia que se implemente primero lo crea, con sus pruebas | (a) Que el agente lea los códigos de salida; (b) un motor propio, por ejemplo `epic-commands.js` | (a) `npm run` sin el script devuelve 1, igual que un fallo real, así que el agente no puede distinguir `NEEDS-CHANGES` de `BLOCKED` (STORY-169 D-2). (b) Daría dos definiciones de «no ejecutable» (P10). El nombre del archivo se conserva para no replanificar STORY-169 | AC-1, AC-2 |
| D-9 | Confirmación cuando no se puede preguntar | `sin evidencia` → `bloqueada` | Tomarla como aprobada | Fail-closed (G-06): una confirmación que nadie dio no es evidencia. Así, una invocación no interactiva de `--mode manual` termina en `BLOCKED` y no en un falso `APPROVED` | AC-1, AC-2 |
| D-10 | Contenido untrusted | Se leen solo los escalares del frontmatter (`verdict`, `enforcement`), los encabezados y pasos de los smoke tests, y las líneas `- [ ]` del DoD. `outputTail` y los textos citados se escriben en código en línea, y un texto con forma de orden va a `notas-validacion` sin seguirse | Leer los cuerpos de los reportes | Es la misma cláusula que `epic-analyze` y STORY-124 D-10. La salida de un comando es un dato | CNF-1 |
| D-11 | Ejecutable inexistente en Windows (decisión de implementación, 2026-10-30) | Antes de lanzar, comprobar que el primer token del comando resuelve a un archivo (ruta relativa a `REPO_ROOT` o nombre en el PATH, con `PATHEXT` en Windows); si no, `not-executable` con `ejecutable no encontrado (no está en el PATH)`. Los builtins de sh y `cmd.exe` (`echo`, `exit`…) y un primer token `VAR=valor` no se comprueban. Se mantienen `ENOENT`, 127 y 9009 | Confiar solo en 127/9009 (STORY-169 D-3) | Verificado en este repositorio: con `shell: true`, Node lanza `cmd.exe /d /s /c`, que ante un comando desconocido sale con **1**, no con 9009. Sin la comprobación previa, un binario ausente se clasificaría `fail` → `NEEDS-CHANGES` en lugar de `BLOCKED`. Leer el mensaje de stderr depende del idioma del sistema | AC-2 |
| D-12 | Excepción a `sec-no-shell-injection` de `gr-code-security-checklist` (decisión de implementación, 2026-10-30; **pendiente de ratificación humana**) | `check-command` lanza el comando con `spawnSync(command, { shell: true })`, como fija T004 | Partir la cadena en argv y lanzar sin shell | Los comandos son cadenas de shell que declara el propio proyecto (`npm run <s>`, `node -e "…"`), y en Windows `npm.cmd` no se puede lanzar sin shell (Node ≥ 18.20 / 20.12, CVE-2024-27980). Controles compensatorios: los comandos solo provienen de archivos versionados del proyecto (`sddf.config.yaml › verify`, `package.json › scripts`, `docs/guardrails/dod-epic-validate.md`), nunca de reportes, cuerpos de historias ni salida de comandos; el único valor que se interpola es el ID `SMOKE-N`, validado contra `^SMOKE-\d+$`; los criterios del DoD que citan comandos de escritura, publicación o despliegue no se ejecutan (Paso 3d, orden 1); el motor no lee stdin ni escribe archivos, y su salida se trata como dato | AC-1, AC-2 |

### Decisiones de complejidad justificada

- **Motor Node en lugar de solo Markdown:** STORY-124 D-1 dejó prevista esta revisión «si STORY-125/169 necesitan ejecutar comandos de forma determinista». Esta historia lo necesita, porque `BLOCKED` frente a `NEEDS-CHANGES` depende de distinguir «no ejecutable» de «fallido». Se reutiliza un único subcomando, sin crear otro motor.
- **Placeholder `{{smoke_id}}` opcional:** es una regla de dos ramas basada en una convención que ya existe. Una solución sin placeholder no permitiría registrar resultados por smoke test (CNF-1) en proyectos que sí pueden ejecutarlos por separado.
- **Resultado `omitida`:** es lo único que se agrega a la función del veredicto de STORY-124. Hace falta porque AC-3 exige distinguir «no configurado» (advertencia) de «configurado y fallido» (rechazo).
- No se crean abstracciones de «proveedor de evidencia». Cada fuente es una fila de la tabla de evidencia.

### Puntos de variación (P6)

- **Fuente del comando de smoke tests:** si un proyecto necesita un comando por smoke test que no se pueda expresar con `{{smoke_id}}`, se agregaría una clave en `verify` (por ejemplo, `e2e-smoke-<N>`) sin tocar la tabla de evidencia.
- **Comando de release:** si se requiere un proyecto que no use npm, `verify.release` en `sddf.config.yaml` reemplazaría la detección por script (D-3). Solo cambia C3.
- **Reportes aceptados como evidencia manual:** la lista `acceptance-report.md` → `verify-report.md` está en una sola fila de la tabla de evidencia.
- **Nuevas comprobaciones** (STORY-169): nuevas filas en `## Comprobaciones`. La regla del veredicto no cambia.

### Degradación gradual (P7)

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| `sddf.config.yaml` ausente o sin `verify.e2e-smoke` | No hay comando de smoke tests | En auto, cada `SMOKE-N` queda `no ejecutable` y el veredicto es `BLOCKED` («`--mode auto` falla si no hay tests configurados»). Sin `--mode`, D-6 elige manual |
| Motor `epic-suites.js` o `node` no disponibles | No se puede invocar `check-command` | Los smoke tests en auto y `OPE-02` quedan `no ejecutable` o `bloqueada` con el motivo `motor epic-suites.js no disponible`. Nunca se cuenta como un `pass` |
| `package.json` ilegible | No se puede detectar `verify:release` | `OPE-02` queda `bloqueada` con el motivo (fail-closed). Solo la ausencia del archivo o del script da `omitida` |
| Reporte de la historia dueña ilegible | No se puede leer su `verdict` | No cuenta como evidencia aprobatoria. Se pasa a la confirmación y se agrega una nota con la ruta |
| Historia dueña archivada | Su directorio está en `specs/flow/archive/` | Se busca su reporte allí (universo de STORY-124) |
| Comando que no termina | `check-command` no devuelve control | El motor no impone timeout (STORY-169). El `SKILL.md` indica lanzarlo en segundo plano si el runtime limita la duración |
| Salida de un comando con texto que pide acciones | Inyección | Se trata como dato en `outputTail` (D-10) |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| V-1 | En auto, con un `e2e-smoke.command` que termina con 0 y un `verify:release` que termina con 0, el veredicto es `APPROVED` y cada `SMOKE-N` figura `aprobado` con la fuente `ejecución: …` | Eval TC (fixture con `node -e "process.exit(0)"`) | AC-1 |
| V-2 | En manual, una historia dueña con `acceptance-report.md` `APPROVED` da `aprobado` con `reporte: <ruta>`, y no se ejecuta ningún smoke test | Eval TC | AC-1, CNF-2 |
| V-3 | En manual, sin reporte y con respuesta `s`, da `aprobado` con `confirmación manual del mantenedor` | Eval TC | AC-1 |
| V-4 | Un smoke test que falla, un `verify:release` que termina con 1, o un criterio del DoD incumplido dan `NEEDS-CHANGES`, y el motivo cita el elemento, el resultado y la fuente | Eval TC (tres casos) | AC-2, CNF-1 |
| V-5 | Sin `verify:release` y sin DoD, `OPE-02` y `OPE-03` quedan `omitida` con `⚠️`, el veredicto sigue siendo `APPROVED`, y los `SMOKE-N` aparecen evaluados en `## Smoke tests de la épica` | Eval TC | AC-3 |
| V-6 | En auto, sin `verify.e2e-smoke` declarado, el veredicto es `BLOCKED` | Eval TC | AC-2 (D-7) |
| V-7 | `check-command` distingue `pass`, `fail` y `not-executable` (script npm no declarado; códigos 127/9009) | `node --test test/epic-suites.test.js` | AC-1, AC-2 |
| V-8 | El template declara `smoke-epica` y `dod-epica` con su marcador, `## Veredicto` sigue siendo la primera sección y se cumplen G-01…G-04 | `npm run verify:validation-contract` | CNF-1, CS-5 |
| V-9 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (F1, F2, D-1, D-2, D-4, D-6), AC-2 (F3, D-7, D-9), AC-3 (F4, D-3, D-5), CNF-1 (tabla de evidencia, D-10, sección `smoke-epica`), CNF-2 (tabla de evidencia por modo, D-3). No hay omisiones.
- **Ambigüedad:** el significado de ejecutar un smoke test (D-1, D-2), el reporte válido en manual (D-4), quién es dueño del DoD (D-5, CR-002) y el vocabulario (D-7, CR-001) quedan decididos.
- **Nombres:** se usan `aprobado`, `fallido`, `no ejecutable` y `sin evidencia` para los smoke tests; `cumple`, `no cumple`, `bloqueada` y `omitida` para las comprobaciones (los de STORY-124 más uno); y `cumplido`, `incumplido` y `sin evidencia` para el DoD (los de STORY-169). Cada nivel tiene su propio vocabulario, sin sinónimos.
- **Estructura:** C2, C3 y C4 dependen de I1 (C7) y de C6. C5 consume resultados, no el motor. No hay ciclos. Cada paso tiene una sola razón de cambio.

## Risks / Trade-offs

- [En este repositorio, `test:e2e:smoke` no está declarado, así que `--mode auto` sobre EPIC-23 da `BLOCKED`] → Es el comportamiento que exige la épica («falla si no hay tests configurados»). La validación del propio repositorio se hace con `--mode manual` hasta que exista un runner de smoke tests.
- [Sin `{{smoke_id}}`, un solo fallo marca todos los `SMOKE-N` como `fallido`] → La fuente registra «ejecución conjunta», y el detalle está en `outputTail`. Se documenta el placeholder para que cada proyecto pueda separar los resultados.
- [Un `acceptance-report.md` `APPROVED` puede ser anterior a un cambio que rompió el smoke test] → Es la evidencia que la historia permite en manual. La fuente cita la ruta para que el humano la juzgue. `--mode auto` es la vía para tener evidencia fresca.
- [Orden de implementación con STORY-124 y STORY-169] → Ver CR-003. Las tareas que tocan el skill dependen de STORY-124, y el motor lo crea la primera historia que se implemente.

## Open Questions

No queda ninguna abierta: las decisiones se resuelven en D-1…D-10, y las que afectan a otros documentos están registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: el AC-2 dice que una comprobación configurada que falla deja el reporte en `BLOCKED`. La decisión del PO en `epic.md` (Notas, 2026-10-17) y G-05 exigen `NEEDS-CHANGES` para la evidencia fallida (smoke test, `verify:release` o DoD), y reservan `BLOCKED` para la evidencia que no se puede obtener. `epic.md` lo lista como «alineación pendiente» de STORY-124 a STORY-128. El diseño aplica `NEEDS-CHANGES` (D-7).
- **Documento afectado**: story.md
- **Acción requerida**: en AC-2, cambiar «el reporte queda BLOCKED» por «el reporte queda NEEDS-CHANGES», y agregar un escenario o una nota para la evidencia que no se puede obtener (`BLOCKED`). La nota «El veredicto final es BLOCKED si …» de la historia debe decir «`NEEDS-CHANGES` o `BLOCKED` según G-05».

### CR-002
- **Tipo**: dependencia (entre historias)
- **Descripción**: STORY-169 (diseñada) también evalúa el DoD de épica (C4, C6 `dod-epica`) solo en `--mode auto`, y su CR-002 propone quitar el DoD de STORY-125. Esta historia lo necesita para AC-2 y AC-3 y lo implementa con el mismo contrato (D-5), en ambos modos.
- **Documento afectado**: STORY-169 design.md y tasks.md, y `epic.md` (reparto de CS-4 y CS-11)
- **Acción requerida**: al refinar la épica, dejar a STORY-125 como dueña de `OPE-03`. STORY-169 debe retirar su C4 y la sección `dod-epica` (o reutilizarlas sin cambios), y su CR-003 queda resuelto con D-5.

### CR-003
- **Tipo**: dependencia
- **Descripción**: `skills/epic-validate/SKILL.md`, `references/story-sources.md`, `assets/epic-validate-report-template.md` y `evals/evals.json` los crea STORY-124, que está en `READY-FOR-IMPLEMENT/DONE`. El motor `epic-suites.js` (`check-command`) y `test/epic-suites.test.js` están diseñados en STORY-169, que también está en `READY-FOR-IMPLEMENT/DONE`.
- **Documento afectado**: tasks.md
- **Acción requerida**: ordenar las tareas así: primero el motor y sus pruebas (o verificar que ya existen con el contrato I1), y después los pasos del skill. Las tareas sobre el `SKILL.md`, el template y los evals requieren STORY-124 entregada, o al menos implementada.
