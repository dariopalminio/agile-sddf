---
alwaysApply: false
type: design
id: STORY-137
slug: STORY-137-controlar-detalle-ejecucion-validacion-epica-design
title: "Design: Controlar el detalle y los límites de la ejecución de la validación de épicas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-137
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-137-controlar-detalle-ejecucion-validacion-epica
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-169-suites-de-integracion-y-regresion-de-la-epica
---

<!-- Referencias -->
[[STORY-137-controlar-detalle-ejecucion-validacion-epica]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-125-validar-evidencia-operativa-epica]] · [[STORY-126-operar-validacion-epica-segura]] · [[STORY-169-suites-de-integracion-y-regresion-de-la-epica]]

## Context

`/epic-validate` es el gate de la fase `VALIDATE` de EPIC-23. Esta historia completa CS-10 con dos cosas: el flag `--verbose` (salida completa de los comandos de prueba) y el rechazo de `--mode auto` cuando no hay pruebas configuradas. STORY-126 cubre el resto de CS-10 (`--mode manual`, `--mode auto`, `--dry-run`).

Estado verificado en el filesystem (2026-10-29):

- **Skill base:** `skills/epic-validate/` aún no existe (`ls skills/`). Lo crea STORY-124 (`READY-FOR-IMPLEMENT/DONE`). STORY-125, STORY-126 y STORY-169 lo amplían; las cuatro tienen `design.md` y `tasks.md`.
- **Parseo de argumentos (STORY-126 C1):** produce `{ epica, modoFlag, dryRun }` sin leer archivos. Su error 1 rechaza todo `--…` no reconocido «incluye `--verbose` hasta STORY-137». Su T012 documenta los parámetros «sin `--verbose`». Su sección «Puntos de variación» ya prevé cómo entra esta historia: `--verbose` se suma a los tokens reconocidos, y el rechazo de `--mode auto` sin pruebas es un error de invocación posterior a la resolución del modo, con el mismo bloque `FALLO`.
- **Regla del modo por defecto (STORY-125 C1, STORY-126 C2):** sin `--mode`, `MODO = auto` si `sddf.config.yaml › verify.e2e-smoke.command` está declarado; si no, `manual`. `sddf.config.yaml` ausente o ilegible → `manual`.
- **Auto sin smoke tests configurados (STORY-125):** su tabla de evidencia (fila `auto`/1) da `no ejecutable` a cada `SMOKE-N` y el veredicto `BLOCKED` **con** reporte. STORY-126 (Risks) registró que esto choca con el AC-2 de esta historia (error **sin** reporte) y dejó la resolución a este diseño.
- **Motor de comandos (STORY-169 I1, reutilizado por STORY-125 D-8):** `skills/epic-validate/scripts/epic-suites.js` tiene dos subcomandos, `run` (suites → `SuitesResult`) y `check-command` (un comando → `CommandResult { ok, command, outcome, exitCode, durationSeconds, reason, outputTail }`). Ejecuta con `spawnSync(command, { cwd, shell: true, encoding: 'utf8' })`. `outputTail` son las últimas 20 líneas de stdout+stderr, solo si `outcome = fail` (STORY-169 D-9). **No hay forma de obtener la salida completa.** Las pruebas viven en `test/epic-suites.test.js` (aún no existe).
- **Salida en consola (STORY-124):** `📄 Reporte escrito: <ruta>` · `Veredicto:` · una línea por motivo. Hoy no hay ninguna línea por comando ejecutado. STORY-126 C7 agrega el bloque `RESULTADO:` … como últimas líneas de toda ejecución.
- **`sddf.config.yaml` de este repositorio:** declara `verify.e2e-smoke.command: "npm run test:e2e:smoke"`, y `package.json` no declara ese script.
- **Contenido no confiable:** STORY-125 D-10 trata como dato toda salida de comando (`outputTail`), escrita en código y nunca seguida como instrucción.

## Goals / Non-Goals

**Goals:**

- Reconocer `--verbose` en cualquier posición y combinable con `--mode` y `--dry-run`. // satisface: AC-1, AC-3, CNF-2, CS-10
- Mostrar en consola una línea de resumen por cada comando de prueba ejecutado y, solo con `--verbose`, su salida completa debajo. // satisface: AC-1
- Garantizar que `--verbose` no cambia el veredicto, los hallazgos ni el contenido de `epic-validate-report.md`. // satisface: AC-1, CNF-1
- Con `--dry-run --verbose`, informar en consola que no se ejecutó ningún comando de prueba. // satisface: AC-3
- Rechazar `--mode auto` como error de invocación, sin escribir nada, cuando no hay pruebas configuradas, con un criterio de «pruebas configuradas» único y compartido con la regla del modo por defecto. // satisface: AC-2
- Mantener `npm run verify:repository` y `npm test` en verde. // satisface: CS-21

**Non-Goals:**

- La fuente de evidencia de cada modo, los smoke tests y las suites (STORY-125, STORY-169).
- Los errores de invocación de `--mode`, `--dry-run`, el bloque `RESULTADO` y la idempotencia (STORY-126).
- Comprobaciones estructurales u operativas nuevas.
- Guardar la salida completa en el reporte, en `.tmp/` o en un archivo de log.
- Cambiar el template del reporte.

## Decisions

### Componentes

Todos modifican artefactos que crean STORY-124 (skill), STORY-126 (parseo y política de efectos) y STORY-125/169 (motor). No se crean archivos nuevos (CR-002, CR-003).

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Paso 1 «Argumentos» | modificar | `skills/epic-validate/SKILL.md` (C1 de STORY-126) | Reconocer `--verbose` y agregar `verbose` a la invocación parseada | AC-1, AC-3, CNF-2, CS-10 |
| C2 | Predicado «pruebas configuradas» | crear (regla) | `skills/epic-validate/SKILL.md` (paso «Modo de evidencia», C2 de STORY-126) | Definir una sola vez cuándo hay pruebas configuradas, para la regla por defecto y para la guardia C3 | AC-2 |
| C3 | Guardia «`--mode auto` sin pruebas» | crear (regla) | `skills/epic-validate/SKILL.md` (al final del paso «Modo de evidencia») | Rechazar `--mode auto` explícito cuando C2 es falso, antes de resolver la épica | AC-2 |
| C4 | Regla «Presentación de comandos» | crear (sección) | `skills/epic-validate/SKILL.md` (`## Restricciones / Reglas`) | Fijar qué se muestra en consola por cada comando de prueba ejecutado, según `verbose` | AC-1, AC-3, CNF-1 |
| C5 | Opción `--full-output` del motor | modificar | `skills/epic-validate/scripts/epic-suites.js` (`check-command` y `run`) | Devolver la salida completa del comando en el campo `output`, sin cambiar ningún otro campo | AC-1, CNF-1 |
| C6 | Pruebas del motor | modificar | `test/epic-suites.test.js` | Probar `--full-output` y que los demás campos no cambian | AC-1, CNF-1 |
| C7 | Política de efectos | modificar | `skills/epic-validate/SKILL.md` (C3 de STORY-126) | Declarar que `--verbose` no cambia ninguna columna y agregar la fila del rechazo de C3 | AC-2, AC-3, CNF-1 |
| C8 | Documentación del skill | modificar | `skills/epic-validate/SKILL.md` (`## Parámetros`, `## Modos de ejecución`, `## Salida`) | Documentar `--verbose` y el rechazo de C3 | CS-10 |
| C9 | Casos de eval | modificar | `skills/epic-validate/evals/evals.json` | Cubrir AC-1 (dos filas), AC-2, AC-3, CNF-1 y CNF-2 | AC-1, AC-2, AC-3, CNF-1, CNF-2 |

No cambian: el template `assets/epic-validate-report-template.md` (CNF-1), la función del veredicto, el bloque `RESULTADO` de STORY-126 (solo se usa), `package.json` y `docs/domains/domain-skills-map.md` (`sddf.config.yaml` ya figura como lectura por STORY-125 C11).

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-validate <epica> [--mode auto\|manual] [--dry-run] [--verbose]`, en cualquier orden | AC-1, AC-3, CNF-2, CS-10 |
| Reconocimiento de `--verbose` (C1) | `--verbose` deja de ser `Argumento no reconocido`. Repetido no es error (como `--dry-run`). `--verbose=<algo>` sigue siendo `❌ Argumento no reconocido: --verbose=<algo>`. Los otros cinco errores de STORY-126 y su orden no cambian | AC-1, CNF-2 |
| Predicado «pruebas configuradas» (C2) | Verdadero si y solo si `sddf.config.yaml` existe, se puede leer y `verify.e2e-smoke.command` es un texto no vacío. No comprueba que el comando sea ejecutable | AC-2 |
| Regla del modo por defecto | Sin cambios de comportamiento: sin `--mode`, `MODO = auto` si C2 es verdadero y `manual` si no. Se reescribe para citar C2 en lugar de repetir la condición | AC-2 |
| Guardia C3 | Solo si `modoFlag = auto` y C2 es falso. Se evalúa también con `--dry-run`. Mensaje: `❌ --mode auto sin pruebas configuradas: <causa>. Declara verify.e2e-smoke.command en sddf.config.yaml o usa --mode manual`. `<causa>` ∈ `sddf.config.yaml no existe` · `sddf.config.yaml no se pudo leer` · `verify.e2e-smoke.command no está declarado`. Fin inmediato: no se resuelve la épica, no se ejecuta nada y no se escribe nada | AC-2 |
| Bloque de resultado ante C3 | El de STORY-126 C7: `RESULTADO: FALLO` · `VEREDICTO: —` · `MODO: auto` · `REPORTE: —` · `MOTIVO: <mensaje ❌ de C3>` | AC-2 |
| Línea de resumen de comando (C4) | Una por cada comando lanzado o clasificado por el motor, en el orden en que se ejecuta, con o sin `--verbose`: `` ▶ <comprobación> — <elemento> · `<cmd>` → <outcome> (<duración> s) ``. `<outcome>` es el del motor (`pass`, `fail`, `not-executable`). `<duración>` es `durationSeconds`, o `—` si el comando no se lanzó. `<elemento>` usa el mismo valor que los motivos `M-NNN` de STORY-125 (`SMOKE-N` o `ejecución conjunta`, `verify:release`, `criterio <n>`, la clave de la suite) | AC-1 |
| Salida completa (C4, solo con `verbose`) | Inmediatamente después de cada línea de resumen de un comando lanzado: un bloque de código con la etiqueta `text` y el contenido de `output` tal cual, o `(sin salida)` si está vacío. La valla del bloque es más larga que la secuencia de comillas invertidas más larga de `output`. No se muestra para un comando no lanzado (`<duración>` = `—`) | AC-1 |
| Aviso sin comandos (C4, solo con `verbose`) | Si al terminar las comprobaciones no se lanzó ningún comando de prueba: `ℹ️ --verbose: no se ejecutó ningún comando de prueba (<causa>)`, con `<causa>` = `--dry-run` o `ningún comando configurado para este modo`. Se imprime antes del bloque de resultado | AC-3 |
| Motor, opción `--full-output` (C5) | `check-command --repo-root <dir> --command "<cmd>" [--full-output]` y `run --repo-root <dir> [--full-output]`. Con la opción, `CommandResult` y cada `Suite` lanzada agregan `output: string`: el stdout completo seguido del stderr completo, con la misma composición que `outputTail` y sin truncar, para cualquier `outcome`. Un comando no lanzado tiene `output: null`. Sin la opción, el campo `output` no aparece. El resto de los campos es idéntico con y sin la opción. Códigos de salida del proceso sin cambios (0, 1, 2); una opción desconocida sigue siendo 2 | AC-1, CNF-1 |
| Invocación del motor desde el skill | Con `verbose`, cada invocación de `check-command` y `run` agrega `--full-output`. Sin `verbose`, nunca | AC-1 |

### Esquema de datos

**Invocación parseada** (C1) // satisface: AC-1, AC-3, CNF-2

`{ epica: string | null, modoFlag: "auto" | "manual" | null, dryRun: boolean, verbose: boolean }`. `verbose` solo lo leen C4 y la invocación del motor. Ningún paso de comprobación, el veredicto ni la escritura del reporte lo leen.

**Campo `output`** (C5) // satisface: AC-1, CNF-1

| Campo | Tipo | Presente | Descripción |
|---|---|---|---|
| `output` | string \| null | solo con `--full-output` | stdout completo + stderr completo del comando; `null` si no se lanzó (filas 1–3 de la clasificación de STORY-169) |

**Política de efectos** (C7, ampliación de la tabla de STORY-126) // satisface: AC-2, AC-3, CNF-1

| Ejecución | Archivos escritos | Comandos ejecutados | Preguntas al mantenedor |
|---|---|---|---|
| Rechazo de C3 (`--mode auto` sin pruebas, con o sin `--dry-run`) | ninguno | ninguno | ninguna |

Nota que se agrega a la tabla: `--verbose` no cambia ninguna columna de ninguna fila. Solo agrega texto a la consola.

**Orden de evaluación de la invocación** // satisface: AC-2, CNF-2

1. C1: los cinco errores de STORY-126 (no lee archivos).
2. C2 de STORY-126: resolver `MODO` (lee `sddf.config.yaml` solo si no hay `--mode`, o si `--mode auto` para C3).
3. C3: guardia de `--mode auto` sin pruebas.
4. `<epica>` ausente (STORY-126 D-8) y resolución de la épica (STORY-124).

El primer error gana. Ninguno escribe archivos.

### Flujos clave

**F1 — `--mode auto --verbose`** // satisface: AC-1 (fila `--verbose`), CNF-1

1. C1 → `{ epica: "EPIC-NN", modoFlag: "auto", dryRun: false, verbose: true }`. C2 es verdadero, C3 no actúa.
2. Cada paso operativo invoca el motor con `--full-output`. Por cada comando, C4 imprime la línea `▶ …` y debajo el bloque `text` con `output`.
3. El veredicto, los motivos (con `outputTail` si hay `fail`) y el reporte se calculan solo con los campos de siempre. `output` no llega al reporte.
4. El bloque `RESULTADO` de STORY-126 cierra la salida.

**F2 — `--mode auto` sin `--verbose`** // satisface: AC-1 (fila «ninguno»), CNF-1

Iguales pasos que F1, sin `--full-output`. C4 imprime solo las líneas `▶ …`. El reporte es idéntico al de F1 salvo los campos volátiles de STORY-126 (fecha y duraciones).

**F3 — `--mode auto` sin pruebas configuradas** // satisface: AC-2

1. C1 → `modoFlag: "auto"`. C2 lee `sddf.config.yaml` y no encuentra `verify.e2e-smoke.command` → falso.
2. C3 imprime `❌ --mode auto sin pruebas configuradas: verify.e2e-smoke.command no está declarado. Declara verify.e2e-smoke.command en sddf.config.yaml o usa --mode manual`.
3. No se lee la épica, no se invoca el motor, no se escribe nada. El bloque de resultado termina con `RESULTADO: FALLO` y `MOTIVO:`.

**F4 — `--dry-run --verbose`** // satisface: AC-3

1. C1 → `dryRun: true, verbose: true`. Si `modoFlag = auto`, C3 se evalúa igual que sin `--dry-run`.
2. La guardia de previsualización de STORY-126 marca toda comprobación operativa como `no ejecutada`; no se invoca el motor.
3. C4 no imprime ninguna línea `▶ …` y, al terminar las comprobaciones, imprime `ℹ️ --verbose: no se ejecutó ningún comando de prueba (--dry-run)`.
4. Previsualización y bloque `RESULTADO: SIMULACIÓN` de STORY-126. No se escribe nada.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Qué son «pruebas configuradas» (decisión abierta de la historia) | `sddf.config.yaml › verify.e2e-smoke.command` declarado y no vacío (C2), el mismo criterio de la regla del modo por defecto | (a) Cualquier clave que ejecuta el skill (`e2e-smoke`, `integration`, `e2e`, `e2e-regression`); (b) presencia de `SMOKE-N` en `epic.md`; (c) además, que el script npm exista | Con un único predicado, la tabla de flags de EPIC-23 queda simétrica: sin `--mode` se elige auto si hay pruebas, y `--mode auto` falla si no las hay. (a) En este repositorio `integration` está declarado, así que auto se aceptaría y los smoke tests igual quedarían `no ejecutable` → `BLOCKED`: el rechazo nunca actuaría. (b) Un `SMOKE-N` es un escenario, no un comando (STORY-125 D-1), y una épica sin smoke tests es un problema de contenido (`OPE-01 no cumple`), no de invocación. (c) Que un comando declarado no se pueda ejecutar es evidencia que no se puede obtener: va al reporte como `BLOCKED` (STORY-169, fila 3), no a un error de invocación | AC-2 |
| D-2 | Momento del rechazo | Después de resolver el modo y antes de resolver la épica | (a) Al final del parseo (C1); (b) al ejecutar `OPE-01` | (a) C1 no lee archivos (STORY-126 D-3), y C3 necesita `sddf.config.yaml`. (b) Para entonces ya se leyó la épica y el error dependería de su estado; además se llegaría a escribir el reporte. Así, el mensaje es el mismo exista o no la épica, como en STORY-126 D-3 | AC-2 |
| D-3 | Rechazo con `--dry-run` | Se aplica igual | Omitirlo en `--dry-run` | Una previsualización debe mostrar lo que pasaría; la ejecución real fallaría. Así, el orden y la combinación de flags no cambian el resultado (CNF-2) | AC-2, CNF-2 |
| D-4 | De dónde sale la salida completa | Opción `--full-output` del motor, que agrega `output` | (a) Devolver siempre `output`; (b) que el agente vuelva a lanzar el comando para ver la salida; (c) que el motor escriba la salida en `.tmp/` o en un log | (a) Haría que cada ejecución sin `--verbose` cargue en el contexto la salida de las suites de regresión, que STORY-169 D-9 evitó. (b) Duplica ejecuciones y puede dar una salida distinta de la evaluada. (c) Viola CS-7 (único archivo escrito: el reporte) | AC-1, CNF-1 |
| D-5 | Forma del campo nuevo | `output` solo presente con la opción; `null` si el comando no se lanzó | `output: null` siempre presente | Un campo que aparece solo con la opción no cambia el JSON que ya prueban STORY-125/169 (comparaciones exactas). Dentro de la opción se sigue la convención `null` del motor | AC-1 |
| D-6 | Qué muestra la consola sin `--verbose` | Una línea `▶ …` por comando con su `outcome` y duración | (a) Nada por comando (solo veredicto y motivos); (b) `outputTail` de los fallidos | AC-1 pide «el resumen con su resultado» de cada comando ejecutado, y hoy la consola no lo tiene. (b) Ya está en los motivos; repetirlo duplicaría el mismo dato | AC-1 |
| D-7 | Cómo `--verbose` no afecta al resultado | `verbose` solo lo leen C4 y la invocación del motor. `output` nunca se escribe en el reporte; `outputTail` no cambia | Usar la salida completa en los motivos con `--verbose` | CNF-1 exige que el reporte sea el mismo. Separar el dato de presentación (`output`) del dato de evidencia (`outputTail`) lo garantiza sin reglas adicionales | CNF-1 |
| D-8 | `--dry-run --verbose` | Una línea `ℹ️` que dice que no se ejecutó ningún comando y su causa | (a) Silencio; (b) mostrar los comandos que se ejecutarían | (a) No cumple AC-3 («la salida indica…»). (b) Exigiría resolver comandos (`{{smoke_id}}`, scripts) y mezclar la simulación con la previsualización de STORY-126. La misma línea cubre el modo manual sin comandos | AC-3 |
| D-9 | Dónde vive el reconocimiento de `--verbose` y C2/C3 | Instrucciones del `SKILL.md` | Subcomandos nuevos del motor (`parse-args`, `has-tests`) | Un token más y una lectura de clave YAML no justifican código (STORY-126 D-2, P12). La regla por defecto de STORY-125 ya lee esa clave desde el `SKILL.md` | AC-1, AC-2 |
| D-10 | Contenido de `output` | Dato no confiable: se muestra en un bloque de código con valla segura y nunca se sigue como instrucción | Mostrarlo como texto libre | Es la regla de STORY-125 D-10 para `outputTail`; la salida de un comando puede contener Markdown o texto con forma de orden | AC-1 |

### Decisiones de complejidad justificada

- **Opción del motor en lugar de pedirle al agente que lea la salida:** el motor es el único punto de ejecución (STORY-126). Sin la opción, el agente tendría que volver a ejecutar el comando (D-4).
- **Predicado C2 como regla con nombre:** se usa en dos sitios (modo por defecto y guardia C3). Con una sola definición, las dos reglas no pueden divergir (P10).
- **Línea de resumen nueva:** es el único texto que agrega la historia fuera de `--verbose`, y es lo que AC-1 pide en la fila «ninguno».
- No se agrega ningún campo al bloque `RESULTADO` ni al reporte: `--verbose` es solo de consola.

### Puntos de variación (P6)

- **Criterio de «pruebas configuradas»:** vive solo en C2. Si una historia futura agrega otra fuente de pruebas en auto, se amplía C2 y cambian a la vez el modo por defecto y C3.
- **Tamaño de la salida:** si hiciera falta truncar `output`, se agregaría un límite en C5 sin tocar el `SKILL.md`.
- **Comprobaciones nuevas que ejecutan comandos:** si pasan por el motor, C4 las cubre (la regla es genérica).

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `sddf.config.yaml` ausente o ilegible con `--mode auto` | C2 falso → rechazo de C3 con su causa (fail-closed) |
| `sddf.config.yaml` ausente o ilegible sin `--mode` | `MODO = manual` (STORY-126), sin rechazo |
| `verify.e2e-smoke.command` declarado pero no ejecutable | No es rechazo: el motor da `not-executable`, la línea `▶ …` lo muestra y el reporte queda `BLOCKED` (STORY-125/169) |
| Motor sin la opción `--full-output` (versión anterior) | Sale con 2 (opción desconocida) → la comprobación queda como «motor no disponible» de STORY-125 (`bloqueada`). Las tareas exigen implementar C5 antes de usar `--verbose` |
| Salida muy grande | Se muestra completa; es opt-in. Ver Risks |
| `output` con secuencias de comillas invertidas o texto con forma de orden | Valla más larga y tratamiento como dato (D-10) |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| V-1 | `check-command --full-output` con `node -e "console.log('SDDF-MARCA-1'); console.error('SDDF-MARCA-2')"` → `output` contiene ambas marcas y `outcome: pass`; sin la opción, el JSON no tiene la clave `output` y los demás campos coinciden (salvo `durationSeconds`) | `node --test test/epic-suites.test.js` | AC-1, CNF-1 |
| V-2 | Un comando con 30 líneas y código 1 → con `--full-output`, `output` tiene las 30 líneas y `outputTail` las mismas 20 que sin la opción; un comando no lanzado (script npm no declarado) → `output: null` | `node --test` | AC-1, CNF-1 |
| V-3 | `run --full-output` agrega `output` a cada `Suite` lanzada | `node --test` | AC-1 |
| V-4 | `--mode auto --verbose` con un comando de prueba falso que imprime `SDDF-MARCA-1` → la consola contiene `▶` y `SDDF-MARCA-1`; el reporte no contiene `SDDF-MARCA-1` | Eval TC | AC-1, CNF-1 |
| V-5 | El mismo fixture sin `--verbose` → contiene `▶` y no contiene `SDDF-MARCA-1`; mismo `verdict` que V-4 | Eval TC | AC-1, CNF-1 |
| V-6 | `--mode auto` con `sddf.config.yaml` sin `verify.e2e-smoke` → contiene `❌ --mode auto sin pruebas configuradas`, `RESULTADO: FALLO`, `MOTIVO:`; ningún archivo escrito | Eval TC | AC-2 |
| V-7 | `--dry-run --verbose` → contiene `ℹ️ --verbose: no se ejecutó ningún comando de prueba (--dry-run)` y `RESULTADO: SIMULACIÓN`; no contiene `▶` ni escrituras | Eval TC | AC-3 |
| V-8 | `--verbose --mode auto` y `--mode auto --verbose` sobre el mismo fixture → mismo `expected` | Eval TC | CNF-2 |
| V-9 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (C1, C4, C5; F1, F2; D-4…D-7), AC-2 (C2, C3, C7; F3; D-1…D-3), AC-3 (C4, C7; F4; D-8), CNF-1 (C4, C5; D-7), CNF-2 (C1; D-3; V-8). Sin omisiones.
- **Ambigüedad:** la decisión abierta de la historia queda resuelta en D-1. El conflicto con STORY-125 (auto sin smoke → `BLOCKED` con reporte) queda resuelto en D-1/D-2 y en CR-001.
- **Nombres:** «pruebas configuradas» (C2), `output` (presentación) y `outputTail` (evidencia), «línea de resumen» y «salida completa» se usan con un único significado.
- **Estructura:** C1 → C2 → C3 → pasos de comprobación → motor (C5) → C4. C4 consume los resultados del motor y no los modifica; el veredicto no depende de C4 ni de `output`. No hay ciclos. Cada componente tiene una sola razón de cambio.
- **Sin código:** el documento solo define contratos, mensajes y reglas.

## Risks / Trade-offs

- [En este repositorio `verify.e2e-smoke.command` está declarado pero `test:e2e:smoke` no existe en `package.json`, así que `--mode auto` se acepta y el reporte queda `BLOCKED`] → Es la distinción de D-1: configurado pero no ejecutable es evidencia, no un error de invocación. La línea `▶ … → not-executable` lo hace visible.
- [Con `--verbose`, la salida de una suite de regresión puede ser muy grande y consumir contexto del agente] → Es opt-in y es lo que pide la tabla de flags. Si hace falta, se agrega un límite en C5 (punto de variación).
- [La salida completa puede contener datos sensibles que el proyecto imprime en sus pruebas] → Solo va a la consola, nunca a un archivo versionado (D-4, D-7).
- [Dependencia de tres historias no entregadas (STORY-124/125/126) y del motor de STORY-169] → La nota de la historia permite un validador stub de veredicto fijo y un comando de prueba falso con salida conocida. Ver CR-002 y CR-003.

## Open Questions

Ninguna: la decisión abierta de la historia se resuelve en D-1, y las que afectan a otras historias están registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: STORY-125 (tabla de evidencia, fila `auto`/1; tabla de degradación, fila `sddf.config.yaml ausente o sin verify.e2e-smoke`; contrato V-6) define que `--mode auto` sin `verify.e2e-smoke` da cada `SMOKE-N` `no ejecutable` y el veredicto `BLOCKED` con reporte. Con C3 ese caso se rechaza antes como error de invocación, sin reporte (AC-2), y sin `--mode` el modo por defecto nunca elige auto en ese caso.
- **Documento afectado**: STORY-125 design.md y tasks.md
- **Acción requerida**: conservar la fila `auto`/1 de STORY-125 solo como defensa (fail-closed, inalcanzable por invocación) y reemplazar su V-6 por el V-6 de esta historia. Anotar la remisión al refinar la épica. Este diseño resuelve el riesgo que STORY-126 dejó abierto en su sección Risks.

### CR-002
- **Tipo**: dependencia
- **Descripción**: C1, C2, C3, C7 y C8 modifican el Paso 1, el paso «Modo de evidencia», la Política de efectos y la documentación que crean STORY-124 y STORY-126 (`READY-FOR-IMPLEMENT/DONE`). STORY-126 rechaza hoy `--verbose` (error 1) y documenta los parámetros «sin `--verbose`» (T012).
- **Documento afectado**: tasks.md
- **Acción requerida**: ordenar las tareas del `SKILL.md` detrás de STORY-124 y STORY-126 implementadas. Si aún no lo están, aplicar los cambios sobre lo que exista y usar un validador stub de veredicto fijo para los evals (nota de la historia), con una verificación posterior registrada.

### CR-003
- **Tipo**: dependencia
- **Descripción**: C5 amplía el contrato I1 del motor `epic-suites.js` (STORY-169, reutilizado por STORY-125 D-8) con la opción `--full-output` y el campo `output`. El motor y `test/epic-suites.test.js` aún no existen.
- **Documento afectado**: tasks.md; STORY-169 y STORY-125 design.md (contrato I1)
- **Acción requerida**: implementar C5 y C6 después de que exista el motor (STORY-125 T001 o STORY-169 T001). Si se implementa antes, crear solo `check-command` con el contrato I1 completo más `--full-output`, y dejar `run` para STORY-169 con la obligación de aceptar la opción. Anotar `--full-output` en el contrato I1 al refinar la épica.

### CR-004
- **Tipo**: ajuste de implementación
- **Descripción**: el runner de evals (`scripts/run-evals.js`) califica `contains`/`not_contains` sobre la respuesta completa, que siempre empieza con `=== CONSOLE ===`, y no permite asertar sobre un solo archivo. Por eso: (a) V-6 y V-7 usan `not_contains` `=== FILE:` (ningún archivo escrito) en lugar de `===`; (b) V-4 no puede asertar que el reporte no contiene `SDDF-MARCA-1` porque la consola sí lo contiene. Para que V-5 sea concluyente, el comando del fixture (`node -e "console.log(['SDDF','MARCA','1'].join('-'))"`) no contiene la marca literal: solo su salida la contiene, así que la marca solo puede aparecer vía `output`. Los casos que afirman un veredicto usan la forma cerrada de STORY-128 (`verdict: <V>\ncreated:`, `**Veredicto:**` y `threshold` 1) en lugar de `verdict:`.
- **Documento afectado**: `skills/epic-validate/evals/evals.json` (TC-027…TC-031)
- **Acción requerida**: ninguna; CNF-1 en el reporte queda cubierto por las pruebas del motor (V-1, V-2: los campos de evidencia no cambian con `--full-output`) y por el recorrido manual de T024.
