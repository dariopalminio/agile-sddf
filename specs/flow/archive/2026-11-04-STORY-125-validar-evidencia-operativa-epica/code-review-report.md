---
type: code-review-report
story: STORY-125
title: "Code Review Report: Validar la evidencia operativa de una épica"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-125

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro informes son válidos y aprueban. El único bloqueante de la ronda 2 (dos U+FEFF literales en `implement-report.md`) está resuelto: no quedan caracteres invisibles, ni por PCRE ni por bytes, en los 12 archivos del alcance ni en el directorio de la historia. Quedan 20 hallazgos LOW, uno de ellos reportado por dos revisores, que no bloquean, y el DoD CODE-REVIEW no tiene criterios incumplidos (7 ✓ · 2 ⚠️).

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-125 — Validar la evidencia operativa de una épica |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

Alcance: ronda 3. Es la reanudación de una revisión interrumpida, que se repitió completa. Se revisaron la implementación de STORY-125 (commit `c8aedc3`) y el rework de las rondas 1 y 2, que sigue sin commit en el working tree. Los cambios posteriores de otras historias de EPIC-23 en `skills/epic-validate/` (STORY-126, 127, 128, 137, 169, 170, 171, 172 y 175) se tomaron como contexto y no se atribuyen a esta historia. La revisión fue estática: los revisores no ejecutaron pruebas ni evals. Según `implement-report.md`, `node --test test/epic-suites.test.js` da 31/31 y `npm test`, 439/439.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:49 | (Persiste de la ronda 2.) `NPM_SCRIPT_RE` toma como nombre del script el primer token que sigue a `run`/`run-script`. Por análisis estático de la regex, `npmScriptOf('npm run --silent verify:release')` devuelve `--silent` (igual con `-s`), y `npm run "verify:release"` devuelve el nombre con las comillas. `precheckCommand` (línea 94) responde entonces «script npm --silent no declarado en package.json»: un falso `not-executable` (`BLOCKED`) para un comando válido. | Saltar los tokens que empiezan por `-` y quitar las comillas del nombre antes de buscarlo en `scripts`, o documentar en el JSDoc y en el Paso 3b de `SKILL.md` que no se admiten flags de npm antes del nombre del script. |
| LOW | skills/epic-validate/scripts/epic-suites.js:70 | (Persiste de la ronda 2.) En `executableOf`, si el comando empieza por una comilla que no se cierra, `trimmed.indexOf('"', 1)` devuelve -1 y `slice(1, -1)` recorta el último carácter: `"C:/Program Files/nodejs/node.exe -v` da el token `C:/Program Files/nodejs/node.exe -`, y la línea 97 responde «ejecutable no encontrado (no está en el PATH)», un motivo que no describe la causa real (un comando mal formado). | Si `indexOf` devuelve -1, devolver `null` (sin comprobación del PATH: decide el shell) o tomar el resto de la cadena sin la comilla inicial. |
| LOW | test/epic-suites.test.js:113 | (Persiste de la ronda 2.) Las ramas de respaldo de `classifyCommand` (`ENOENT` y los códigos 127/9009 de `NOT_FOUND_CODES`, `epic-suites.js:119` y `:121`) siguen sin prueba directa: el caso «ejecutable inexistente» se resuelve antes, en la comprobación previa del PATH (`epic-suites.js:97`). En el archivo, «127», «9009» y «ENOENT» solo aparecen en la cabecera (línea 7), que declara esa cobertura. V-7 (`design.md:236`) pide que `check-command` distinga los códigos 127/9009. | Agregar casos con el builtin `exit`, que no pasa por la comprobación del PATH: `exit 127` debe dar `not-executable` con `exitCode: 127` en sh y en `cmd.exe`, y `exit 9009` solo en Windows (en sh el código se trunca a 8 bits). Si `ENOENT` queda sin cubrir, ajustar la cabecera de la línea 7 para que no declare esa cobertura. |
| LOW | skills/epic-validate/SKILL.md:210 | (Persiste de la ronda 2.) Con salida 1 de `check-command`, el motivo es siempre `motor epic-suites.js no disponible`, aunque el motor imprime `{ ok: false, command, error }` con la causa real (`epic-suites.js:260`). Las reglas equivalentes de `run` sí citan el `error` del JSON (`SKILL.md:289` y `:449`). La frase es de STORY-125 (`c8aedc3`); STORY-137 solo reescribió la línea para agregar `--full-output`. | Alinear la regla: si stdout trae `{ ok: false, error }`, citar ese `error` como motivo, y reservar `motor epic-suites.js no disponible` para cuando no hay JSON (`node` o el motor ausentes). |
| LOW | skills/epic-validate/scripts/epic-suites.js:79 | La comprobación previa del PATH (D-11) no reproduce la resolución del shell, así que deja en `not-executable` (falso `BLOCKED`) comandos que el shell sí ejecuta. (1) En Windows, `cmd.exe` busca por defecto un nombre sin ruta primero en el directorio actual (`cwd = REPO_ROOT`, línea 116) y después en el PATH, pero `isOnPath` solo recorre el PATH: `gradlew test`, con `gradlew.bat` en la raíz, da «ejecutable no encontrado (no está en el PATH)». (2) `SHELL_BUILTINS` (líneas 53-57) omite builtins de `cmd.exe` como `pushd`, `popd` y `for`, aunque D-11 (`design.md:197`) dice que los builtins de sh y `cmd.exe` no se comprueban. Tampoco contempla agrupadores: en el subshell `(cd e2e && npm test)` el primer token es `(cd`. En todos los casos falla cerrado: nunca da un falso `pass`. | En `win32`, probar `REPO_ROOT` (con `PATHEXT`) antes del PATH. Completar `SHELL_BUILTINS` y omitir la comprobación previa cuando el primer token no es un nombre simple (p. ej., si empieza por `(`), para que decidan los respaldos. Como alternativa, documentar la restricción en D-11 y en el Paso 3b de `SKILL.md`. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 7. AC-1 `auto` → TC-006, AC-1 `manual` con reporte → TC-007, AC-1 `manual` con confirmación → TC-008, AC-2 con smoke fallido → TC-009, AC-2 con `verify:release` fallido → TC-010, AC-2 con criterio del DoD de épica incumplido → TC-011, y AC-3 → TC-013. TC-012 cubre la regla de las Notas «evidencia no obtenible → `BLOCKED`». STORY-137 lo redefinió para un comando declarado pero no ejecutable. SMOKE-1 de EPIC-23 queda cubierto por AC-1. Los evals siguen presentes y son coherentes con el `SKILL.md` actual: STORY-128 los pasó a la forma cerrada del veredicto. Las pruebas del motor (`test/epic-suites.test.js`) respaldan la clasificación `pass`/`fail`/`not-executable`. La prueba nueva del rework (`:120`) evita un falso `BLOCKED` ante una salida grande.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json:353 | (Persiste de la ronda 1.) La cobertura de AC-1…AC-3 depende de los evals TC-006…TC-013, que siguen sin ejecutarse. `implement-report.md:162` los deja para ejecución humana (regla 14 de la constitución), y `.tmp/skill-test-evals/` no tiene un directorio `epic-validate`. `node --test` cubre la clasificación del motor, pero no el veredicto ni el reporte. | Ejecutar `npm run test:eval -- epic-validate`, al menos TC-006…TC-013, antes de ACCEPTANCE o en `story-verify`, y adjuntar el informe como evidencia. |
| LOW | skills/epic-validate/evals/evals.json:1088 | (Persiste de la ronda 1.) Con la forma cerrada del veredicto de STORY-128, TC-006 y TC-007 ya ligan la fuente de cada smoke test y el resultado de `OPE-02`, así que el hueco se reduce a TC-013 (AC-3). Allí, `omitida` (`:1088`) y `⚠️` (`:1089`) son subcadenas que aparecen aunque `OPE-02` y `OPE-03` no se omitan. `OPE-04` queda `omitida` en `--mode auto` cuando `verify` no declara suites (`SKILL.md:290`, STORY-169). La fixture no declara un template central, así que el aviso del template seed (`SKILL.md:331`) ya aporta un `⚠️`. Si el skill dejara de advertir sobre `OPE-02` u `OPE-03`, TC-013 seguiría pasando, aunque el Entonces de AC-3 pide «omitidas con una advertencia». La regla 3 de `.claude/skills/skill-master/references/skill-evals-format.md:145` exige que cada `contains` sea específico. | Sustituir esas dos subcadenas por otras que unan cada comprobación con su advertencia. Por ejemplo, `⚠️ OPE-02 omitida` y `⚠️ OPE-03 omitida`, que aparecen en `notas-validacion` y en consola. O bien, `⚠️ verify:release no declarado en package.json` y `Omitido — ⚠️ docs/guardrails/dod-epic-validate.md no existe`. |
| LOW | skills/epic-validate/evals/evals.json:547 | (Persiste de la ronda 1.) Ningún eval cubre esta regla de las Notas: «una confirmación negativa cuenta como comprobación fallida (AC-2)». Con la respuesta `n` en `--mode manual`, `SMOKE-1` debe quedar `fallido` y el reporte `NEEDS-CHANGES` (`SKILL.md:231`). TC-008 solo responde `s` (`:605`), y TC-015, de STORY-126, responde `o`. Tampoco hay un caso con un `verify-report.md` `APPROVED` como evidencia, la otra fuente que citan las Notas (`SKILL.md:229`). | Agregar un eval en `manual` con `maintainer_answers: { "SMOKE-1": "n" }` que espere `NEEDS-CHANGES`, `fallido` y `confirmación manual del mantenedor (negativa)`. Opcional: otro con solo un `verify-report.md` `APPROVED`, que espere `reporte:` y `verify-report.md`. |
| LOW | skills/epic-validate/evals/evals.json:540 | En TC-007, la parte de CNF-2 que dice «`verify:release` sí se ejecuta en `--mode manual`» solo está en `expected.commands_executed`. Ningún runner ni protocolo califica esa clave: `scripts/run-evals.js:851-852` y el protocolo E3c/E3d solo leen `contains`, `output_contains` y `not_contains`, y ningún script ni documento del repositorio la usa. Ningún eval en `manual` exige la fila de `OPE-02` ni la línea `▶ OPE-02`. Por eso, si `verify:release` dejara de ejecutarse en `manual`, ni TC-007 ni TC-008 fallarían. | Pasar la aserción a claves que el runner califica. En `contains`, agregar `▶ OPE-02` (`SKILL.md:125`) o `` `npm run verify:release` · pasa `` (`SKILL.md:251`). En `not_contains`, agregar `▶ OPE-01`, que solo aparece si se lanzó un comando de smoke tests. |
| LOW | skills/epic-validate/evals/evals.json:359 | Los casos de la historia que se invocan con `--mode auto` declaran `"mode": "manual"` en la entrada: TC-006 (`:359`) y TC-009…TC-013 (`:639`, `:730`, `:819`, `:917` y `:1025`). El runner pasa la entrada completa como «Condiciones de entrada» (`scripts/run-evals.js:479`), y `manual` es justamente el `MODO` del modo interactivo del skill. Ese dato contradice la invocación y puede producir falsos FAIL, por ejemplo `` Modo: `manual` `` en TC-006. El campo viene de los evals de `epic-analyze` y de STORY-124, y STORY-125 lo mantuvo en sus casos `--mode auto` (`git show c8aedc3`). | Quitar `input.mode` de esos casos, porque el `MODO` ya lo fija `--mode` (Paso 1.2), como hacen TC-023…TC-026, o cambiar su valor a `auto`. Conviene corregir a la vez los casos de otras historias que repiten el patrón: TC-014, TC-027…TC-029 y TC-031…TC-039. |
| LOW | skills/epic-validate/evals/evals.json:374 | Opcional. Todas las fixtures declaran un único `SMOKE-1` y un `verify.e2e-smoke.command` sin `{{smoke_id}}` (por ejemplo, `:401`). Así no se ponen a prueba el «cada `SMOKE-N`» del Entonces de AC-1 ni la rama de una ejecución por smoke test (`SKILL.md:234`, D-2), que da el resultado por smoke test que pide CNF-1. La única prueba con el ID sustituido es del motor (`test/epic-suites.test.js:215`): no cubre la sustitución ni las filas del reporte. | Agregar un caso `auto` con `SMOKE-1` y `SMOKE-2` y un comando con `{{smoke_id}}` que falle solo con `SMOKE-2`. Debe esperar dos filas en `smoke-epica`, `SMOKE-1` `aprobado`, `SMOKE-2` `fallido` y un único motivo de `OPE-01`, el de `SMOKE-2`. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:260 | (Persiste de la ronda 1.) Ante un error interno (salida 1), `check-command` imprime `{ ok: false, command, error }`, que no tiene la forma `CommandResult` que declara I1 (`design.md:88`). La cabecera del motor (`epic-suites.js:30-37`) solo dice «1 ante un error interno» y no describe ese JSON. Sin impacto funcional: `SKILL.md:210` trata toda salida distinta de 0 como `motor epic-suites.js no disponible`. | Documentar en la cabecera del motor (y en I1 al refinar la épica) que con salida 1 el JSON es `{ ok: false, command, error }` y no un `CommandResult`, como hace la cabecera de `skills/story-complete/scripts/story-complete.js:22` («1 si `ok: false`»). |
| LOW | test/epic-suites.test.js:113 | (Persiste de la ronda 1.) V-7 (`design.md:236`) pide que `check-command` distinga los códigos 127 y 9009. Las ramas `ENOENT` y `NOT_FOUND_CODES` (`epic-suites.js:119` y `:121`) siguen sin prueba directa: el único caso de ejecutable inexistente (`test/epic-suites.test.js:113-118`) lo resuelve la comprobación previa del PATH (D-11). Además, la cabecera del archivo (`test/epic-suites.test.js:7`) declara una cobertura de «ENOENT, 127, 9009» que no existe. | Agregar un caso con un builtin que salga con 127 (p. ej. `exit 127`, que no pasa por la comprobación del PATH) y verificar `not-executable` con `exitCode: 127`, o ajustar la cabecera a lo que realmente se prueba. |
| LOW | specs/flow/STORY-125-validar-evidencia-operativa-epica/design.md:256 | (Persiste de la ronda 1.) «Open Questions» dice que no queda ninguna abierta y cita el rango «D-1…D-10», pero existen D-11 y D-12 (`design.md:197-198`), y D-12 sigue marcada como «pendiente de ratificación humana». | Ampliar el rango a D-1…D-12 y registrar D-12 como pendiente de ratificación, o anotar la ratificación cuando ocurra. |
| LOW | skills/epic-validate/SKILL.md:140 | El Paso 0 (texto de STORY-124, `a65291b`) resuelve `CLI_ROOT` «solo para leer los seeds de templates», pero la sección «Cómo invocar el motor» que agregó esta historia (`c8aedc3`) lo usa para localizar y ejecutar el motor: `node <CLI_ROOT>/skills/epic-validate/scripts/epic-suites.js …` (`SKILL.md:201` y `:207`). Los skills del framework que tienen motor declaran ese uso en su Paso 0 (`skills/story-complete/SKILL.md:102` y `skills/epic-complete/SKILL.md:96`: «solo para localizar el motor»). Sin impacto funcional: la ruta de invocación es explícita. | Cambiar la frase del Paso 0 por «para leer los seeds de templates y localizar el motor `scripts/epic-suites.js`». |
| LOW | specs/flow/STORY-125-validar-evidencia-operativa-epica/design.md:235 | V-6 («En auto, sin `verify.e2e-smoke` declarado, el veredicto es `BLOCKED`») y la fila de degradación de `design.md:218` ya no describen el comportamiento implementado. La guardia del Paso 1.2 (`SKILL.md:158`, de STORY-137, `9336641`) convierte ese caso en un error de invocación sin reporte (TC-029), y TC-012 se reescribió para un `verify.e2e-smoke.command` declarado pero no ejecutable (`skills/epic-validate/evals/evals.json:911-914`). STORY-137 CR-001 (`specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/design.md:228`) pide «reemplazar su V-6» y dice «Anotar la remisión al refinar la épica», pero la remisión no está anotada en `design.md` ni en `epic.md`; además, `implement-report.md:52` y `:162` siguen trazando TC-012 a ese V-6. No es atribuible a la implementación de esta historia, y la tabla de evidencia sigue siendo compatible: la fila `auto`/1 se conserva como defensa (`SKILL.md:225` y `:446`). | Al refinar la épica, anotar en V-6 y en la fila de degradación la remisión a STORY-137 CR-001 (guardia del Paso 1.2 y TC-029), y actualizar la trazabilidad de TC-012. No requiere cambios de código en esta historia. |
| LOW | skills/epic-validate/assets/epic-validate-report-template.md:52 | El comentario guía de `smoke-epica` (agregado en `c8aedc3`) lista el resultado `no ejecutable`, pero para el modo auto solo enumera las fuentes `ejecución: <cmd> (<duración> s)` y `(código <n>)`. Faltan las fuentes `` ejecución: `<cmd>` — <reason> `` y `` `verify.e2e-smoke` no declarado en sddf.config.yaml `` de la tabla de evidencia (`design.md:110` y `:113`; `SKILL.md:225` y `:228`), y la marca `ejecución conjunta` (`SKILL.md:234`). Sin impacto funcional: el contenido lo fija el Paso 3b y el comentario no se copia al reporte. | Completar la enumeración del comentario con las fuentes de `no ejecutable` y la marca `ejecución conjunta`, o remitir al Paso 3b de `SKILL.md`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (65 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:116 | `sec-no-shell-injection` (intención) · semántica «A change that relaxes any control … states why, who decided it, and what compensating control applies» · SEC-063 | (Persiste de la ronda 2.) `spawnSync(command, { cwd: repoRoot, shell: true, … })` equivale semánticamente a `shell=True`, y el grep determinista de la regla no lo detecta. D-12 (`design.md:198` de la historia) documenta el porqué y los controles compensatorios, pero sigue «pendiente de ratificación humana», igual que en `implement-report.md:106` y `:163`: falta «who decided it». No hay exposición explotable con evidencia. Los comandos salen de archivos versionados del proyecto (`sddf.config.yaml › verify`, `package.json › scripts`, el DoD de épica) y tienen la misma confianza que un `npm run` que el proyecto ya ejecuta. `shell: true` viene de `c8aedc3`; el rework de la ronda 1 solo agregó `maxBuffer: Infinity` en esta línea. D-12 tampoco cita un precedente del propio repositorio: `scripts/npm-invocation.js` (commit `a7de1a8`, «Close out outstanding audit findings») lanza npm en Windows con `process.execPath` y `npm-cli.js` «en vez de habilitar un shell». | Que el mantenedor ratifique o rechace D-12 y que quede registrado quién decidió, en `design.md` (o en un ADR si se quiere como excepción reutilizable). Conviene sopesar ese precedente, al menos para los comandos `npm run <s>`. No bloquea. |
| LOW | skills/epic-validate/SKILL.md:234 (y :267, orden 1) | Controles compensatorios de D-12 · SEC-063 · SEC-070 | (Persiste de la ronda 2; ya venía de la ronda 1.) Dos de los controles compensatorios de D-12 solo existen como instrucciones al agente. El primero valida cada ID contra `^SMOKE-\d+$` antes de sustituir `{{smoke_id}}` (:234). El segundo impide ejecutar los comandos del DoD que escriben, publican o despliegan (:267), pero es una lista de exclusión por ejemplos (`npm publish`, `git push`, `npm pack` sin `--dry-run`…) que se resuelve con el criterio del agente, no una lista blanca. `parseArgs` solo exige que `--command` no esté vacío (`epic-suites.js:242`), y el motor lanza el comando tal cual. Un agente que no cumpla el SKILL.md no encuentra ninguna barrera determinista. Hoy `docs/guardrails/dod-epic-validate.md` no existe, así que el control del DoD está latente. Las dos líneas son de `c8aedc3`, y el rework no tocó esta parte. | Opcional (endurecimiento): mover la sustitución y validación de `{{smoke_id}}` al motor, o rechazar en `check-command` los comandos de una lista de exclusión (`npm publish`, `git push`…). No bloquea. |
| LOW | skills/epic-validate/scripts/epic-suites.js:244 | Semántica de `gr-code-security-checklist` «Script output and error messages diagnose the problem without echoing a token, a full environment, or an absolute host path» | Nuevo en esta ronda: la línea es de `c8aedc3` y no cambió desde entonces. `parseArgs` resuelve `--repo-root` con `path.resolve` (:243), y el error `--repo-root no es un directorio: ${repoRoot}` lo imprime en stderr (:251) como ruta absoluta del host. El impacto es mínimo: solo ocurre ante un argumento inválido, y `SKILL.md:210` traduce la salida 2 a `motor epic-suites.js no disponible` sin copiar stderr al reporte, así que la ruta no llega a ningún archivo versionado. El repositorio ya sigue la convención contraria: `skills/memory-system/scripts/memory-system.js:263` repite el valor tal como se recibió y `:177` (`displayPath`) relativiza la ruta. Hay una variante con más alcance: el `error: err.message` de `run` (`epic-suites.js:260`), que `SKILL.md:289` y `:449` copian al reporte. Esas líneas son de STORY-169 (`c328ae7`) y no se atribuyen a esta historia. | Repetir el valor recibido (`opts['--repo-root']`) en lugar de la ruta resuelta. No bloquea. |

**Verificación del hallazgo bloqueante de la ronda 2** (MEDIUM, `ai-no-hidden-characters`, `implement-report.md:69` y `:120`): **resuelto.**

- Primero se comprobaron los detectores, sin escribir archivos. Con `LC_ALL=C.UTF-8`, el grep PCRE de la regla (`gr-ai-security-checklist.md:113`) da 1 sobre U+FEFF, U+200B, U+202E, U+E0041 y ESC enviados por tubería, y 0 sobre texto plano. Los patrones por bytes se validaron igual, con controles positivos y negativos.
- Los 12 archivos del alcance dan 0 con el grep PCRE de la regla y 0 por bytes: U+FEFF, U+200B a U+200F, U+202A a U+202E, U+2060 a U+2064, U+2066 a U+2069, bloque Tag y ESC. Tampoco hay controles C0, NUL ni homoglifos griegos, cirílicos o de ancho completo. Los 60 U+FE0F del alcance son selectores de presentación de emoji, tras U+26A0, U+2139, U+2699, U+1F5C2 y U+1F5FA, y no están en el conjunto de la regla.
- Al regenerar el reporte, las dos posiciones de la ronda 2 pasaron a `implement-report.md:91` y `:142`. Ahí solo hay texto ASCII: `U+FEFF` y «barra invertida + `uFEFF`». Durante la revisión, la secuencia de bytes EF BB BF dio 0 en los diez archivos del directorio de la historia, incluidos los no versionados (`code-review-report.md` y `fix-directives.md`), y ninguno empezaba con BOM.
- Salvedad: la corrección de la ronda 1 en `epic-suites.js` solo existe en el working tree. HEAD y el índice conservan los dos U+FEFF literales de `c8aedc3` (2 en `git show HEAD:` y 0 en el working tree). Si el commit que cierre la historia no incluye ese archivo, el incumplimiento sigue versionado.

**Evaluado sin hallazgo:** `maxBuffer: Infinity` (`epic-suites.js:116`, rework de la ronda 1) quita el límite de 1 MiB de la salida que el motor guarda en memoria. No es una exposición: los comandos los declara el proyecto y el motor ya no tenía timeout. Si el proceso cae por falta de memoria, su salida distinta de 0 da `motor epic-suites.js no disponible`, que nunca cuenta como `pass` (`SKILL.md:210`). La prueba nueva (`test/epic-suites.test.js:120`) usa un comando fijo y opera sobre un directorio temporal.

**Fuera del alcance, no atribuible a STORY-125:** a nivel de repositorio falla `sec-gitignore-coverage`, porque `.gitignore` no cubre `__pycache__`. Su último cambio es de STORY-145, no hay ningún `__pycache__/` versionado y el archivo no figura entre los archivos de la historia.

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (12 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

1. Ejecuta `/story-verify STORY-125`: la historia queda en `CODE-REVIEW/DONE`, lista para la verificación final.
2. En el commit que cierre esta revisión, incluye el rework que sigue sin commit: `skills/epic-validate/scripts/epic-suites.js` y `test/epic-suites.test.js` (ronda 1), e `implement-report.md` (ronda 2). Mientras `epic-suites.js` no entre en un commit, `HEAD` conserva los dos U+FEFF literales de `c8aedc3`.
3. Pendiente fuera del gate: ratificar o rechazar D-12 y registrar quién decidió, y ejecutar `npm run test:eval -- epic-validate` (TC-006…TC-013 como mínimo) antes de ACCEPTANCE. Los hallazgos LOW no bloquean y se pueden atender en una historia de seguimiento.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | Ningún criterio IMPLEMENT queda ❌. Ya se cumple el criterio 12 («Se cumple [[gr-ai-security-checklist]]»), que bloqueó la ronda 2: el Security-Reviewer no encontró caracteres invisibles en el alcance ni en el directorio de la historia. Siguen ⚠️ seis criterios, como en `implement-report.md` (18 ✓ · 6 ⚠️): el 1, el 2, el 16 y el 21 requieren ejecutar los evals o CI; el 13 espera la ratificación de D-12, y el 14 no se puede comprobar en el historial de git |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ⚠️ | — | Se cumplen las convenciones de código: CommonJS sin dependencias nuevas, `node:test`, documentos en español, y nada de código comentado, `TODO` ni símbolos sin usar (Tech-Lead-Reviewer). La regla de caracteres ocultos que enlaza `constitution.md:64` ya se cumple. Queda abierta la excepción D-12 a `sec-no-shell-injection` (checklist que enlaza `constitution.md:65`): documenta el porqué y los controles compensatorios, pero no quién decidió (LOW, espera una decisión humana) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer aprobado: 7/7 escenarios con un paso explícito en `SKILL.md` y un eval vigente (TC-006…TC-013) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer aprobado: C1–C11, I1, la tabla de evidencia por modo, `OPE-01`…`OPE-03`, D-11 y D-12 son conformes, y el rework no altera ningún contrato |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | 0 HIGH · 0 MEDIUM · 20 LOW en los cuatro informes |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 29/29 `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo (`type`, `id`, `kind`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related`); pasa a `CODE-REVIEW/DONE` con este veredicto |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este reporte (ronda 3) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 7/9 criterios ✓ · 2 ⚠️ · 0 ❌
