---
alwaysApply: false
type: design
id: STORY-169
slug: STORY-169-suites-de-integracion-y-regresion-de-la-epica-design
title: "Design: Suites de integración y regresión de la épica"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-169
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-169-suites-de-integracion-y-regresion-de-la-epica
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-126-operar-validacion-epica-segura
---

<!-- Referencias -->
[[STORY-169-suites-de-integracion-y-regresion-de-la-epica]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-125-validar-evidencia-operativa-epica]] · [[STORY-126-operar-validacion-epica-segura]]

## Context

`/epic-validate` es el skill nuevo de la fase VALIDATE de EPIC-23. Hoy no existe: STORY-124 crea `skills/epic-validate/SKILL.md` y `skills/epic-validate/assets/epic-validate-report-template.md`, y STORY-126 define `--mode` y `--dry-run`. Esta historia agrega dos comprobaciones al veredicto (CS-11):

1. **Suites de nivel épica:** ejecuta los comandos de las claves `integration`, `e2e` y `e2e-regression` de `verify` en `sddf.config.yaml`, en ese orden, y clasifica cada resultado como `pasa`, `fallida`, `no ejecutable` u `omitida`.
2. **DoD de validación de épica:** evalúa criterio por criterio `docs/guardrails/dod-epic-validate.md` si existe.

Estado actual verificado en el filesystem (2026-10-29):

- `sddf.config.yaml › verify` declara `integration` (`node scripts/verify-fixed-layout.js`, `required: true`), `e2e` (`npm run test:e2e:smoke`, `required: false`) y `e2e-regression` (`npm run test:e2e:regression`, `required: false`).
- `package.json › scripts` no declara `test:e2e:smoke` ni `test:e2e:regression`, así que con la configuración actual `e2e` y `e2e-regression` se registran como omitidas.
- `docs/guardrails/` no contiene `dod-epic-validate.md`, así que el DoD se registra como omitido.
- Patrones reutilizables del proyecto:
  - `skills/story-complete/scripts/story-complete.js` es un motor Node determinista sin dependencias npm. Lo invoca el SKILL.md, devuelve un único objeto JSON por stdout y se prueba con `node --test` en `test/story-complete.test.js`.
  - `skills/story-delivery/SKILL.md` (Paso 4) clasifica cada criterio de un DoD como `comando`, `artefacto` o `confirmación`, y define un filtro de seguridad para no ejecutar comandos que escriben, publican o despliegan.
  - `skills/story-verify/SKILL.md` (Paso 4) registra una prueba no ejecutable como `BLOCKED` y no la cuenta como fallo.
  - `skills/memory-system/scripts/dod-story.js` (`readDodMapping`) lee una sección de `sddf.config.yaml` línea a línea, sin librería YAML.
- La regla G-05 de `docs/policies/validation-contract-policy.md` establece que, si en un reporte coexisten algo rechazado y algo bloqueado, gana `NEEDS-CHANGES`. La §4 de esa política fija el vocabulario de `epic-validate`: `APPROVED`, `NEEDS-CHANGES` y `BLOCKED`.

## Goals / Non-Goals

**Goals:**

- Ejecutar en `--mode auto` las tres suites de nivel épica con su comando de `verify`, en el entorno desde el que se invoca, y registrar el comando, el resultado y la duración en segundos con un decimal de cada una. // satisface: AC-1
- Clasificar cada suite de forma observable y determinista, y traducir su clasificación al veredicto según su `required`. // satisface: AC-2, CNF-2
- Componer el veredicto con la precedencia G-05. // satisface: AC-3
- Evaluar `docs/guardrails/dod-epic-validate.md`, si existe, criterio por criterio y con evidencia. // satisface: AC-4
- No hardcodear comandos ni criterios: leerlos en tiempo de ejecución. // satisface: CNF-1

**Non-Goals:**

- Reejecutar las pruebas unitarias o de componente de las historias, o ejecutar las claves de `verify` distintas de las tres de nivel épica.
- Seleccionar, preparar o comprobar un entorno (staging u otro) (CNF-3).
- Crear `docs/guardrails/dod-epic-validate.md` o definir su contenido.
- `--dry-run`, `--verbose` y la mecánica de `--mode`: pertenecen a STORY-126 y STORY-137. Este diseño solo fija qué muestran las dos secciones nuevas cuando no hay ejecución.
- Las comprobaciones estructurales (STORY-124) y la evidencia de smoke tests y `verify:release` (STORY-125).

## Decisions

### Componentes

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Ejecutor de suites (`epic-suites`) | crear | `skills/epic-validate/scripts/epic-suites.js` | Ejecutar un comando de verificación y clasificar su resultado (`pasa`, `fallida`, `no ejecutable`) con su duración | AC-1, AC-2, AC-3, CNF-1 |
| C2 | Lector de suites de nivel épica | crear (módulo interno de C1) | `skills/epic-validate/scripts/epic-suites.js` (`readEpicSuites`) | Extraer de `sddf.config.yaml › verify` las claves `integration`, `e2e` y `e2e-regression` con su `command` y `required` | AC-1, AC-2, CNF-1 |
| C3 | Paso «Suites de nivel épica» del skill | modificar | `skills/epic-validate/SKILL.md` | Invocar C1, traducir cada suite a rechazo, bloqueo u omisión según `required`, y escribir la sección del reporte | AC-1, AC-2, AC-3, CNF-2 |
| C4 | Paso «DoD de validación de épica» del skill | modificar | `skills/epic-validate/SKILL.md` | Evaluar cada criterio `- [ ]` del DoD con evidencia y registrarlo como cumplido, incumplido o sin evidencia | AC-4, CNF-1 |
| C5 | Regla de decisión del veredicto | modificar | `skills/epic-validate/SKILL.md` (paso de veredicto de STORY-124) | Agregar rechazos y bloqueos de C3 y C4 a los existentes y aplicar G-05 | AC-1, AC-2, AC-3, AC-4 |
| C6 | Secciones del reporte | modificar | `skills/epic-validate/assets/epic-validate-report-template.md` | Declarar `## Suites de nivel épica` y `## DoD de validación de épica` con su marcador | AC-1, AC-2, AC-4 |
| C7 | Pruebas del ejecutor | crear | `test/epic-suites.test.js` | Probar C1 y C2 con fixtures temporales, sin consumir cuota de evals | AC-1, AC-2, AC-3 |
| C8 | Casos de eval del skill | modificar | `skills/epic-validate/evals/evals.json` | Cubrir la composición del veredicto y el DoD, que dependen del agente | AC-2, AC-3, AC-4 |

`package.json › files` ya incluye `skills/`, así que `epic-suites.js` se publica sin cambios (CS-8 es de STORY-127).

### Interfaces

**I1 — CLI de `epic-suites.js`** (contrato entre C3/C4 y C1) // satisface: AC-1, AC-2, AC-3, AC-4

| Subcomando | Uso | Entrada | Salida (stdout, un único JSON) |
|---|---|---|---|
| `run` | `node <CLI_ROOT>/skills/epic-validate/scripts/epic-suites.js run --repo-root <REPO_ROOT>` | `sddf.config.yaml` y `package.json` de `REPO_ROOT` | `SuitesResult` |
| `check-command` | `node <CLI_ROOT>/skills/epic-validate/scripts/epic-suites.js check-command --repo-root <REPO_ROOT> --command "<cmd>"` | un comando citado por un criterio del DoD | `CommandResult` |

- Código de salida del proceso: `0` si el motor pudo evaluar, aunque alguna suite falle; `1` ante un error interno (por ejemplo, un `sddf.config.yaml` ilegible); `2` ante argumentos inválidos, con el error en stderr. Mismo contrato que `story-complete.js`.
- El motor nunca lee stdin ni escribe archivos. Ejecuta los comandos con `cwd = REPO_ROOT`, de forma secuencial y en el orden fijo `integration` → `e2e` → `e2e-regression`.

**I2 — Sección `## Suites de nivel épica` del reporte** (contrato entre C3 y C6) // satisface: AC-1, AC-2, AC-3

Marcador: `<!-- sección obligatoria · clave: suites-epica · escritor: epic-validate -->`. Es una tabla con las columnas `Suite │ Required │ Comando │ Resultado │ Duración (s) │ Motivo`, con una fila por clave, en el orden fijo. Los valores de `Resultado` son `pasa`, `fallida`, `no ejecutable`, `omitida` y `no ejecutada`. `Duración (s)` usa un decimal (`12.3`) y `—` si la suite no se ejecutó. Las advertencias se listan bajo la tabla con el prefijo `⚠️`.

**I3 — Sección `## DoD de validación de épica` del reporte** (contrato entre C4 y C6) // satisface: AC-4

Marcador: `<!-- sección obligatoria · clave: dod-epica · escritor: epic-validate -->`. Si el DoD se evaluó, es una tabla con las columnas `# │ Criterio │ Estado │ Evidencia`, donde `Estado` es `cumplido`, `incumplido` o `sin evidencia`. Si no se evaluó, una sola línea: `Omitido — ⚠️ <motivo>`.

### Esquema de datos (modelo interno, no persistido)

**`SuitesResult`** (salida de `run`) // satisface: AC-1, AC-2

| Campo | Tipo | Descripción |
|---|---|---|
| `ok` | boolean | `true` si el motor evaluó las tres claves |
| `configPath` | string | ruta relativa leída (`sddf.config.yaml`) |
| `suites` | `Suite[]` | siempre 3 elementos, en el orden fijo |
| `warnings` | string[] | advertencias (clave ausente, `sddf.config.yaml` ausente) |

**`Suite`** // satisface: AC-1, AC-2, AC-3, CNF-2

| Campo | Tipo | Descripción |
|---|---|---|
| `key` | `integration` \| `e2e` \| `e2e-regression` | clave de `verify` |
| `declared` | boolean | `false` si la clave no está en `verify` |
| `command` | string \| null | comando leído tal cual, o `null` |
| `required` | boolean | `required` leído; `false` si falta |
| `outcome` | `pass` \| `fail` \| `not-executable` \| `absent` | clasificación del motor |
| `exitCode` | integer \| null | `null` si el comando no se lanzó |
| `durationSeconds` | number \| null | redondeado a un decimal; `null` si no se lanzó |
| `reason` | string \| null | motivo observable de `not-executable` o `absent` |
| `outputTail` | string \| null | últimas 20 líneas de stdout+stderr, solo si `outcome = fail` |

**`CommandResult`** (salida de `check-command`): `{ ok, command, outcome: pass | fail | not-executable, exitCode, durationSeconds, reason, outputTail }`.

**Clasificación de `outcome`** (regla única de C1, aplicada por `run` y `check-command`) // satisface: AC-2, CNF-2

| Orden | Condición observable | `outcome` | `reason` |
|---|---|---|---|
| 1 | La clave no está en `verify` | `absent` | `clave <key> no declarada en verify` |
| 2 | La clave no tiene `command` | `not-executable` | `<key> no declara command` |
| 3 | El comando es `npm run <s>`, `npm run-script <s>` o `npm test` y `package.json › scripts` no declara `<s>` (o `test`) | `not-executable` (sin lanzarlo) | `script npm <s> no declarado en package.json` |
| 4 | Se lanzó y el proceso no pudo iniciarse (`ENOENT`) o terminó con el código 127 (sh) o 9009 (cmd.exe) | `not-executable` | `ejecutable no encontrado (código <n>)` |
| 5 | Terminó con código 0 | `pass` | `null` |
| 6 | Terminó con cualquier otro código | `fail` | `null` |

**Traducción a efecto en el veredicto** (C3, en el SKILL.md) // satisface: AC-2, AC-3, CNF-2

| `outcome` | `required` | Registro en el reporte | Efecto |
|---|---|---|---|
| `pass` | cualquiera | `pasa` | ninguno |
| `fail` | cualquiera | `fallida` | rechazo |
| `not-executable` | `true` | `no ejecutable`, con el motivo | bloqueo |
| `not-executable` | `false` | `omitida`, con el motivo | ninguno |
| `absent` | — | `omitida` + advertencia `⚠️ clave <key> no declarada en verify` | ninguno |

**Evaluación de un criterio del DoD** (C4, primera fila que coincide; en `--mode auto` nunca se pregunta) // satisface: AC-4

| Orden | Señal en el texto del criterio | Evidencia | Estado |
|---|---|---|---|
| 1 | Cita entre backticks un comando que escribe, publica o despliega (`npm publish`, `git push`, `npm pack` sin `--dry-run`…), con el filtro del Paso 4b de `story-delivery` | `no ejecutado: <cmd> no es de verificación` | `sin evidencia` |
| 2 | Cita entre backticks un comando de verificación | `check-command` → `pass`: `cumplido`; `fail`: `incumplido` con `outputTail`; `not-executable`: `sin evidencia` con `reason` | según el resultado |
| 3 | Cita un archivo o campo del repositorio | la ruta leída y el dato observado | `cumplido` o `incumplido` (`<ruta> no existe` → `incumplido`) |
| 4 | Ninguna de las anteriores | `requiere confirmación humana; --mode auto no pregunta` | `sin evidencia` |

Resolución del DoD: ruta fija `docs/guardrails/dod-epic-validate.md` (CNF-1). Los criterios son todas sus líneas `- [ ]`. Si el archivo no existe → `Omitido — ⚠️ docs/guardrails/dod-epic-validate.md no existe`. Si existe sin líneas `- [ ]` → `Omitido — ⚠️ dod-epic-validate.md no tiene criterios`. Si su frontmatter declara `enforcement: warn`, los criterios se registran igual pero no producen rechazos ni bloqueos. Si `enforcement` falta o vale `error`, sí los producen.

Efecto en el veredicto: `incumplido` → rechazo; `sin evidencia` → bloqueo; `cumplido` u `Omitido` → ninguno. // satisface: AC-4

### Flujos clave

**F1 — `--mode auto`, todas las suites pasan y no hay DoD** // satisface: AC-1, AC-4 (fila «no existe»)

1. El skill completa las comprobaciones de STORY-124/125 (o su stub) y obtiene sus listas de rechazos y bloqueos.
2. C3 invoca `epic-suites.js run --repo-root <REPO_ROOT>`.
3. C1/C2 leen `verify`, ejecutan los tres comandos en orden y devuelven `SuitesResult` con `outcome: pass` y `durationSeconds` en cada suite.
4. C3 escribe la tabla I2 con tres filas `pasa` y no agrega rechazos ni bloqueos.
5. C4 no encuentra `docs/guardrails/dod-epic-validate.md` y escribe `Omitido — ⚠️ …`.
6. C5 aplica la regla de decisión: sin rechazos ni bloqueos → `APPROVED`.

**F2 — Una suite no pasa** // satisface: AC-2

Igual que F1 hasta el punto 3. C3 traduce cada suite con la tabla de efecto: `integration` con `fail` → rechazo; con `not-executable` y `required: true` → bloqueo; `e2e-regression` con `not-executable` y `required: false` → `omitida`, sin efecto; con `fail` → rechazo. C5 decide.

**F3 — Fallo y bloqueo a la vez** // satisface: AC-3

`integration` `fail` (rechazo) y `e2e` `not-executable` con `required: true` (bloqueo). C5 aplica G-05: hay al menos un rechazo → `NEEDS-CHANGES`.

**F4 — DoD presente** // satisface: AC-4

C4 lee el DoD, evalúa cada criterio con la tabla de evaluación (invocando `check-command` para los comandos de verificación) y escribe la tabla I3. Todos `cumplido` → sin efecto; uno `incumplido` → rechazo; uno `sin evidencia` y ninguno `incumplido` → bloqueo. C5 decide.

**F5 — Otros modos** (decisión de diseño, ver D-6)

- Con `--mode manual`, C3 y C4 no ejecutan nada. Cada suite se registra como `no ejecutada` con el motivo `solo en --mode auto`, y el DoD como `Omitido — ⚠️ solo en --mode auto`. No hay efecto en el veredicto.
- Con `--dry-run` (STORY-126), igual, con el motivo `--dry-run`.

**Regla de decisión de C5** (se aplica sobre la unión de los rechazos y bloqueos de todas las comprobaciones del skill) // satisface: AC-1, AC-2, AC-3, AC-4

| Condición | `verdict` |
|---|---|
| Hay al menos un rechazo | `NEEDS-CHANGES` (G-05) |
| No hay rechazos y hay al menos un bloqueo | `BLOCKED` |
| No hay rechazos ni bloqueos | `APPROVED` |

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Dónde vive la ejecución y la clasificación de suites | Motor Node `skills/epic-validate/scripts/epic-suites.js`, invocado desde el SKILL.md | (a) Instrucciones en Markdown que el agente sigue, como en `story-verify`; (b) un script global en `scripts/` | La clasificación (script npm no declarado, códigos 127/9009, duración con un decimal) es determinista y se prueba con `node --test` sin cuota de evals (AGENTS.md). (a) depende de que el agente mida tiempos y lea códigos de salida con exactitud. (b) rompe la regla de fuente única: lo que usa un skill vive en el propio skill y se instala con él, como `story-complete.js` | AC-1, AC-2 |
| D-2 | Cómo se detecta «script npm no declarado» | Comprobarlo antes de lanzar, leyendo `package.json › scripts` | (a) Lanzar y leer el código de salida; (b) buscar «Missing script» en la salida | `npm run <x>` sin script termina con código 1, que es indistinguible de una suite fallida (la regla de la historia trata todo código ≠ 0 que no sea 127 como fallo). (b) depende del idioma y de la versión de npm | AC-2 |
| D-3 | Qué cuenta como «ejecutable no encontrado» | `ENOENT` al lanzar, código 127 (sh) o 9009 (cmd.exe) | Solo el código 127, como dice la historia | El repositorio se usa en Windows, donde el shell por defecto de Node (`cmd.exe`) devuelve 9009. Con solo 127, una suite `required: false` con un binario ausente se registraría como `fallida` y produciría `NEEDS-CHANGES` (ver CR-005) | AC-2, CNF-2 |
| D-4 | Cómo se lee `verify` sin dependencias | Lector línea a línea limitado a `verify.<key>.command` y `verify.<key>.required`, que quita las comillas y los comentarios `#` fuera de comillas | (a) Agregar `yaml` a `dependencies`; (b) reutilizar el parser de `memory-system.js` | (a) agrega una dependencia de runtime para leer dos campos. (b) acopla dos skills que se instalan por separado. Hay precedente: `readDodMapping` de `dod-story.js` | CNF-1 |
| D-5 | Dónde se evalúa el DoD | En el SKILL.md (C4); solo los comandos pasan por `check-command` | (a) Todo el DoD en el motor; (b) delegar en `story-delivery` | Clasificar un criterio por su texto requiere interpretación, como en `story-delivery`. Que los comandos pasen por `check-command` hace que una suite y un criterio usen la misma regla de «no ejecutable». (b) es un skill de historia con otro estado y otro reporte, y un skill no delega en otro skill dentro de su hot path | AC-4 |
| D-6 | Comportamiento fuera de `--mode auto` | No se ejecuta nada; se registra `no ejecutada` / `Omitido`, sin efecto en el veredicto | (a) Ejecutar las suites en todos los modos; (b) bloquear el veredicto en `--mode manual` | La historia y CS-11 acotan la ejecución a `--mode auto`. (a) contradice `--dry-run` (STORY-126: no ejecuta tests). (b) haría que `--mode manual` nunca aprobara. Queda registrado como CR-003 para confirmarlo al refinar la épica | AC-1 |
| D-7 | Respetar `enforcement` del DoD | Sí: con `warn` los criterios no afectan al veredicto; por defecto, `error` | Ignorar `enforcement` | Todos los guardrails de `docs/guardrails/` declaran `enforcement`, y los skills que los consumen lo respetan (`## DoD aplicable`). Ignorarlo sorprendería a quien escriba un DoD informativo | AC-4 |
| D-8 | Orden y concurrencia de las suites | Secuencial y en el orden fijo `integration` → `e2e` → `e2e-regression` | En paralelo | Las suites de integración y E2E pueden compartir recursos del entorno. El orden fijo da reportes deterministas (CNF-1 de STORY-126) | AC-1 |
| D-9 | Evidencia de una suite fallida | Últimas 20 líneas de stdout+stderr en `outputTail`, tratadas como dato | (a) La salida completa; (b) solo el código | (a) infla el reporte en suites de regresión. (b) no permite diagnosticar. La salida nunca se interpreta como instrucción (regla de `story-delivery` Paso 4b) | AC-2 |

### Decisiones de complejidad justificada

- **Motor Node en lugar de solo Markdown (D-1):** una solución más simple, con instrucciones al agente, no garantiza la duración con un decimal ni la distinción entre 127/9009 y otros códigos, que la historia exige de forma observable. El motor es un único archivo sin dependencias, con dos subcomandos que comparten una sola regla de clasificación.
- **Subcomando `check-command`:** sin él, un criterio del DoD que cita `npm run x` sin script se evaluaría como `incumplido` (código 1), mientras que la misma situación en una suite es `no ejecutable`. Reutilizar la regla evita dos definiciones del mismo concepto (P10).
- **Comprobación previa del script npm (D-2):** es la única forma observable de cumplir la definición de «no ejecutable» de la historia con npm.
- No se crean abstracciones de «proveedor de evidencia» ni jerarquías: C3 y C4 son pasos del SKILL.md y C5 es una tabla de decisión.

### Puntos de variación (P6)

- **Lista de suites de nivel épica:** una constante `EPIC_SUITE_KEYS` en `epic-suites.js`. Cambiar la lista es un cambio de una línea y de sus pruebas.
- **Ruta del DoD:** fija en el SKILL.md. Si se necesita un override por proyecto, se agregaría `guardrails.dod.epic.validate` en `sddf.config.yaml` siguiendo el patrón de `## DoD aplicable`; hoy no hace falta (YAGNI).
- **Shell de ejecución:** el de Node por defecto (`sh` o `cmd.exe`). La tabla de códigos de «no ejecutable» concentra la dependencia de plataforma.

### Degradación gradual (P7)

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| `sddf.config.yaml` ausente | no se puede leer `verify` | Las tres suites quedan `absent` con la advertencia `⚠️ sddf.config.yaml no existe`. No bloquea (como una clave ausente) |
| `sddf.config.yaml` ilegible | error de lectura | El motor sale con código 1. El SKILL.md registra las tres suites como `no ejecutable`, con el motivo y `required` desconocido tratado como `true` → bloqueo (fail-closed, G-06) |
| `package.json` ausente | no se pueden comprobar scripts npm | Un comando `npm run <s>` se registra como `not-executable`, con el motivo `package.json no existe` |
| `node` o el motor ausentes | no se puede invocar C1 | El SKILL.md registra las suites como `no ejecutable` (`motor epic-suites.js no disponible`) → bloqueo. No hay ejecución sin el motor |
| Suite que no termina | el comando no devuelve control | El motor no impone timeout (CNF-3: el entorno es del Solo Builder). El SKILL.md indica invocar el motor en segundo plano cuando el runtime limite la duración de los comandos (ver Riesgos) |
| Salida de un comando con texto que pide acciones al agente | inyección | Se registra como dato en `outputTail` y nunca se sigue |

### Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| V-1 | Con las tres suites que terminan con código 0, `run` devuelve 3 `pass` con `durationSeconds` de un decimal | `node --test test/epic-suites.test.js` (fixture con `node -e "process.exit(0)"`) | AC-1 |
| V-2 | Un comando con código 1 → `fail` con `outputTail` | `node --test` | AC-2 |
| V-3 | `npm run x` sin `scripts.x` → `not-executable` sin lanzar el proceso, con el motivo | `node --test` (fixture `package.json` sin el script) | AC-2 |
| V-4 | Un ejecutable inexistente → `not-executable` en Windows y en POSIX | `node --test` | AC-2 |
| V-5 | Una clave ausente → `absent` con advertencia; el orden de `suites` es fijo | `node --test` | AC-2, CNF-1 |
| V-6 | `check-command` aplica la misma clasificación que `run` | `node --test` | AC-4 |
| V-7 | La tabla de efecto y la regla de decisión producen `APPROVED`, `NEEDS-CHANGES` y `BLOCKED` según las tablas de AC-2, AC-3 y AC-4 | eval en `skills/epic-validate/evals/evals.json` (ejecución manual) | AC-2, AC-3, AC-4 |
| V-8 | El template declara las dos secciones con su marcador y `verify:repository` sigue en verde | `npm run verify:repository` | AC-1, AC-4 |
| V-9 | El motor no escribe archivos | `node --test` (compara el árbol del fixture antes y después) | CNF-1 (CS-7) |

### Autoevaluación (P9, P10, P11)

- **Omisiones:** los 4 ACs y los 3 CNF tienen al menos un elemento. CNF-3 se cumple por omisión deliberada: no hay componente de entorno.
- **Ambigüedad:** «no ejecutable» queda definida por la tabla de clasificación. Las diferencias con la historia se registran en CR-005.
- **Nombres:** se usan «suite», «fallida», «no ejecutable», «omitida», «DoD de validación de épica», «rechazo» y «bloqueo», con un solo nombre por concepto. Los valores en inglés de `outcome` son internos del motor y se traducen en C3.
- **Dependencias:** C3/C4 → I1 → C1 → C2. C5 consume listas, no C1. No hay ciclos.
- **Cohesión:** C1 ejecuta y clasifica; C2 lee la configuración; C3 traduce; C4 evalúa el DoD; C5 decide. Ninguno necesita una «y» para describirse.

## Risks / Trade-offs

- [Suites largas superan el límite de duración de los comandos del runtime del agente] → El SKILL.md indica lanzar `epic-suites.js run` en segundo plano y leer su JSON al terminar. El motor no impone timeout.
- [Un comando de `verify` modifica archivos (por ejemplo, genera un reporte de cobertura)] → CS-7 limita al skill, no a los comandos del proyecto. Se documenta en el SKILL.md que las suites se ejecutan tal cual las declara el proyecto.
- [El lector de `verify` sin librería YAML no soporta sintaxis avanzada (anclas, flujo `{}`)] → Solo lee dos campos escalares. Si `verify` usa esa sintaxis, `command` queda `null` → `not-executable` con motivo explícito; nunca un falso `pass`.
- [Solapamiento del DoD con STORY-125] → Puede evaluarse dos veces con efectos distintos. Ver CR-002.
- [Integración con un skill aún inexistente] → C3–C6 y C8 modifican archivos que crea STORY-124. Ver CR-001.

## Open Questions

Ninguna abierta en el diseño: las decisiones pendientes se resolvieron en D-1…D-9, y las que afectan a otros documentos están registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `skills/epic-validate/SKILL.md`, `assets/epic-validate-report-template.md` y `evals/evals.json` no existen; los crea STORY-124 (en `SPECIFY/DONE`). C1, C2 y C7 no dependen de ellos. C3–C6 y C8 sí.
- **Documento afectado**: tasks.md / story.md (notas de prerrequisitos)
- **Acción requerida**: ordenar las tareas para implementar primero el motor y sus pruebas. Las tareas sobre el SKILL.md, el template y los evals requieren STORY-124 entregada; si no lo está al implementar, quedan bloqueadas por esa dependencia.

### CR-002
- **Tipo**: inconsistencia entre historias
- **Descripción**: STORY-125 (CS-4, AC-2) evalúa «el DoD de épica existente» y trata un criterio fallido como `BLOCKED`. Esta historia fija `docs/guardrails/dod-epic-validate.md` y trata un criterio incumplido como `NEEDS-CHANGES` y uno sin evidencia como `BLOCKED`.
- **Documento afectado**: STORY-125 story.md / epic.md (CS-4)
- **Acción requerida**: al refinar la épica, quitar el DoD de STORY-125 (CS-4) y dejar a STORY-169 como única dueña de la evaluación del DoD de épica, como propone la nota de solapamiento de la historia.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: la historia no define qué registran las suites y el DoD fuera de `--mode auto`. D-6 decide registrarlos como `no ejecutada` / `Omitido`, sin efecto en el veredicto.
- **Documento afectado**: story.md / epic.md
- **Acción requerida**: confirmar D-6 al refinar la épica, o pedir otra semántica para `--mode manual` (por ejemplo, tomar como evidencia un reporte existente, como hace STORY-125 con los smoke tests).

### CR-004
- **Tipo**: inconsistencia
- **Descripción**: el índice de `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` (línea de STORY-169) aún dice que las suites se ejecutan «sobre el entorno de staging». Eso contradice CNF-3 y el Non-Goal de la historia refinada.
- **Documento afectado**: epic.md
- **Acción requerida**: actualizar la línea del índice con el texto vigente de la historia (`/epic-format-validation` o `/epic-improve`).

### CR-005
- **Tipo**: ambigüedad
- **Descripción**: la historia define «ejecutable no encontrado» como código de salida 127. En Windows (`cmd.exe`) el código equivalente es 9009, y Node puede fallar al lanzar con `ENOENT`. D-3 trata los tres casos como `no ejecutable`.
- **Documento afectado**: story.md (nota «Definición observable de no ejecutable»)
- **Acción requerida**: ampliar la nota de la historia con «código 127, o 9009 en Windows».
