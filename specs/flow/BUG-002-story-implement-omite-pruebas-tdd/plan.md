---
type: plan
id: plan-02
slug: plan-02-story-implement-lee-comandos-de-verify
title: "Reparación BUG-002 — story-implement lee los comandos de prueba de verify y registra los tipos no ejecutados"
status: DRAFT
substatus: DRAFT
parent: BUG-002
created: 2026-11-08
updated: 2026-11-08
related:
  - BUG-002-story-implement-omite-pruebas-tdd
  - FR-040-implementacion-guiada-por-tdd
  - NFR-018-verificacion-demostrada-no-declarada
---

# Plan: Reparación BUG-002 — story-implement lee los comandos de prueba de `verify` y registra los tipos no ejecutados

## Contexto

`skills/story-implement/SKILL.md` lee `defaults.{type}.command` en tres puntos: Paso 5 (confirmar RED, línea 533), Paso 9b (confirmar GREEN, línea 834) y la no-regresión de REFACTOR (línea 956). Desde `805a17af` (2026-06-07) los comandos viven en `verify.{type}` y `defaults` solo contiene `delivery-model`, así que el skill no ejecuta ninguna prueba y aun así deja la historia en `IMPLEMENT/DONE`. El RCA de `bug.md` identifica cuatro causas raíz:

| Causa | Qué es | Cubierta por |
|---|---|---|
| CR-1 (directa) | Clave obsoleta `defaults.{type}.command` en las tres lecturas | D-1 |
| CR-2 (de diseño) | Falla abierto y en silencio; REFACTOR sin rama «sin comando»; ignora `required` | D-2, D-3, D-4, D-5 |
| CR-3 (sistémica) | `sddf.config.yaml` sin contrato de claves con sus lectores | D-7 |
| CR-4 (de detección) | Los evals simulan el resultado de las pruebas en vez de la configuración | D-8 |

Verificado en el filesystem el 2026-11-08:

- `grep` de `defaults.{type}.command` fuera de `specs/flow/archive/`: solo `skills/story-implement/SKILL.md` (y el propio `bug.md`).
- Los `SKILL.md` citan entre backticks 13 rutas de clave de `sddf.config.yaml` (`defaults.delivery-model`, `verify.e2e-smoke.command`, `implement.code_generators`, `guardrails.dod.story`, …). Todas, salvo `defaults.{type}.command`, existen en `skills/sddf-init/assets/sddf.config.yaml.template`.
- `skills/story-implement/evals/evals.json`: 37 casos, ninguno con bloque `verify`. Solo TC-004 (camino feliz GREEN/REFACTOR) y TC-006 (regresiones en REFACTOR) dependen del resultado de ejecutar las pruebas.
- `test/maintenance-contracts.test.js` ya cubre `scripts/verify-config-contract.js`, que corre en el paso «configuración YAML» de `verify-repository.js`.
- EPIC-29 está en `TODO`. Tocará el mismo `SKILL.md` (gates de entrada y rework) y el mismo `evals.json` (CS-7).

## Alternativas evaluadas

### A. Qué tipos ejecuta `story-implement`

| Opción | Descripción | Pros | Contras | Decisión |
|---|---|---|---|---|
| **A1** | Regla de `story-verify`: solo tipos con `required: true` y un comando ejecutable | Una sola regla para los dos lectores del bloque `verify` (cierra la divergencia de CR-2). En este repo, `eval` (`required: false`) sigue sin ejecutarse, así que no consume cuota de LLM (constitución, principio 14) | Con la plantilla de `sddf-init` (todo `required: false`) un proyecto nuevo no ejecuta nada hasta que lo activa | **Elegida** |
| A2 | Ejecutar cualquier tipo con comando real, salvo `eval` | Ejecuta pruebas sin configurar `required` | Excepción ad hoc para `eval`; mantiene dos reglas distintas sobre el mismo bloque, que es parte de la causa | Descartada |
| A3 | Clave nueva por generador (`implement.test_generators[].command` o `run_tests`) | Desacopla TDD de VERIFY | Cambio de esquema, más superficie de contrato (justo lo que CR-3 señala como frágil), choca con EPIC-29 | Descartada (si se quiere, mejora aparte) |

Con A1, lo que la plantilla deja apagado deja de pasar en silencio: se informa en consola y en `implement-report.md` (D-3).

### B. Qué hacer con un tipo no ejecutable

| Opción | Descripción | Decisión |
|---|---|---|
| B1 | Bloquear la fase | Descartada: rompería todos los proyectos con la plantilla por defecto |
| **B2** | No bloquear, pero emitir `[WARN]` y registrar «no ejecutado — <motivo>» | **Elegida**: cumple el «Resultado esperado» del bug y NFR-018 (lo no ejecutado se declara como no ejecutado) |
| B3 | Mantener el `[INFO]` actual | Descartada: es el fallo abierto de CR-2 |

### C. Guarda determinista para CR-3

| Opción | Decisión |
|---|---|
| **C1** | Extender `scripts/verify-config-contract.js` para que toda ruta de clave citada entre backticks en `skills/*/SKILL.md` (`` `defaults.…` ``, `` `verify.…` ``, `` `implement.…` ``, `` `guardrails.…` ``) exista en `sddf.config.yaml.template`. `{type}` es un comodín para cualquier hijo de `verify`. Corre en el gate (`verify:repository`), con pruebas en `test/maintenance-contracts.test.js`. **Elegida** |
| C2 | Solo una prueba unitaria aislada | Descartada: el gate ya tiene un paso de contrato de configuración y es el lugar natural |
| C3 | Registrarla como mejora aparte | Descartada: el RCA pide decidir, y la guarda es pequeña (13 referencias conocidas, todas válidas salvo la del bug) |

Documentar en `docs/architecture/tech-stack.md` qué skill lee cada clave queda **fuera de alcance**, como mejora aparte: la guarda C1 ya convierte una clave huérfana en un error del gate.

## Decisiones de diseño

- **D-1 — Fuente del comando:** las tres lecturas pasan a `verify.{type}`. Se define **una sola vez** una subsección `### Resolución del comando de prueba` (antes del Paso 5), y el Paso 5, el Paso 9b y la no-regresión de REFACTOR la invocan. Así no hay tres copias que puedan divergir.
- **D-2 — Clasificación de un tipo** (salida de la subsección de D-1):

  | Condición (en orden) | Resultado | Motivo registrado |
  |---|---|---|
  | No existe `verify.{type}` | no ejecutado | `tipo sin configurar en verify` |
  | `required` ≠ `true` | no ejecutado | `required: false` |
  | `command: manual` | no ejecutado | `command: manual` |
  | Ni `command` ni `command_template` | no ejecutado | `sin command ni command_template` |
  | El comando o la plantilla contiene `{{test_file_path}}` y el tipo no generó ni modificó archivos de prueba en RED | no ejecutado | `plantilla sin archivos de prueba` |
  | El comando o la plantilla contiene `{{test_file_path}}` y hay archivos | ejecutable: se sustituye el marcador por esos archivos (`files_generated ∪ files_modified` del `results.json` del tipo, separados por espacio) | — |
  | Otro caso | ejecutable tal cual | — |

  El marcador se busca tanto en `command_template` como en `command`, porque este repo declara `verify.e2e-file.command` con `{{test_file_path}}`. Los tipos de generador sin clave equivalente en `verify` (`api`, `store`) caen en la primera fila.
- **D-3 — Visibilidad:** cada tipo no ejecutado emite `[WARN] Tipo '{tipo}' no ejecutado en {fase} — {motivo}` (en lugar del `[INFO]` actual) y se acumula en `$TEST_RUNS` (`{fase, tipo, resultado, motivo|exit}`), que alimenta el informe. Las fases no se bloquean (B2).
- **D-4 — Clave legada:** si `verify.{type}` no existe pero `defaults.{type}.command` sí (configuración anterior a `805a17af`), el skill **no** la ejecuta y emite una sola vez `[WARN] sddf.config.yaml declara defaults.{type}.command (esquema anterior): muévelo a verify.{type}`. Así se distingue «el proyecto no configuró este tipo» de «busco en el lugar equivocado» (CR-2, porqué 5).
- **D-5 — REFACTOR con rama explícita:** la no-regresión usa la misma clasificación. `$REFACTOR_REGRESIONES = false` deja de ser cierto por vacuidad: se registra `$REFACTOR_VERIFICADO = true` solo si al menos un tipo se ejecutó. La transición a `IMPLEMENT/DONE` no cambia de condición (sin errores ni regresiones), pero el informe distingue «sin regresiones» de «no ejecutada».
- **D-6 — `testcases.md` y Pause-2:** las casillas `## Test Cases Progress for` solo se marcan `[x]` o `[!]` para tipos **ejecutados**. Un tipo no ejecutado deja sus casillas en `[ ]` y emite `⚠️ testcases.md — casos de tipo {PREFIX} sin marcar: tipo no ejecutado`. Pause-2 deja de afirmar «Tests: todos pasan ✅» sin condición: muestra el resultado real (`pasan` / `no ejecutadas — {tipos}`).
- **D-7 — Informe:** sin sección nueva (la sección «Pruebas ejecutadas» es de mejora-017 y queda fuera de alcance):
  - `## Resumen`: «Fase {RED|GREEN|REFACTOR} confirmada» admite `sí / no / no ejecutada`.
  - `## Ciclo TDD`, columna Detalle: un fragmento por tipo, `{tipo}: rojo (exit N)` / `pasan (exit 0)` / `no ejecutado — {motivo}`.
  - 11a (DoD IMPLEMENT): un criterio sobre pruebas cuya fase no se ejecutó se evalúa `⚠️`, nunca `✓`.
- **D-8 — Evals (CR-4):** los casos nuevos declaran los comandos **solo** en `verify` (y `defaults` solo con `delivery-model`) y dan los resultados como exit codes del comando configurado (`command_exit_codes: {red, green, refactor}`), no como `tests_pass_after_*`. Un skill que lea `defaults` emite «no ejecutado — tipo sin configurar» y falla el caso. Se migran solo TC-004 y TC-006, los únicos cuyo oráculo depende del resultado de las pruebas: se les añade un bloque `verify` con `required: true` y sus `tests_pass_after_*` pasan a significar el resultado del comando. Los otros 35 no se tocan, para minimizar el conflicto con EPIC-29 (CS-7).
- **Sin cambios:** la semántica de `red_confirmed` (un exit 0 en RED sigue siendo `⚠️`, no `false`), los estados de entrada y el modo rework (son de EPIC-29), y `story-implement-tasks` (mejora-017).

## Archivos que se modifican

| Archivo | Cambio |
|---|---|
| `skills/story-implement/evals/evals.json` | Casos nuevos TC-038 a TC-044 (D-8) y migración de TC-004 y TC-006 |
| `skills/story-implement/SKILL.md` | Subsección `Resolución del comando de prueba` (D-1, D-2, D-4); Paso 5 (líneas 529-541), Paso 9b (830-858), Pause-2 (862-875), no-regresión de REFACTOR (953-968), plantilla de `implement-report.md` (1002-1018) y 11a (976-987); filas nuevas en la tabla de errores (1170-1208); conservar `<!-- SDDF-FIXED-LAYOUT: v1 -->` |
| `scripts/verify-config-contract.js` | Nueva función `verifySkillConfigReferences` (C1), llamada desde `verifyConfigContract` y exportada |
| `test/maintenance-contracts.test.js` | Casos de la guarda C1 sobre directorios temporales |
| `specs/flow/BUG-02-story-implement-omite-pruebas-tdd/bug.md` | Estado del work item según avance y evidencias de verificación (paso 6 del proceso) |

No cambia: `sddf.config.yaml`, la plantilla y el ejemplo de `sddf-init`, `skills/story-verify/`, `skills/story-implement/README.md` (no menciona los comandos) ni `.claude/skills/` (es salida de `agile-sddf install`).

## Orden de trabajo

TDD según el principio 11 de la constitución: los evals se escriben antes del `SKILL.md`, y las pruebas de la guarda antes de la guarda.

1. **Evals primero (`evals.json`):**
   - TC-038: `verify.unit` con `command` y `required: true`, exit codes `{red: 1, green: 0, refactor: 0}` → `✅ Tests en estado rojo`, `✅ Fase GREEN exitosa`, `✅ Fase REFACTOR sin regresiones`, casillas UT en `[x]`; `not_contains`: «Sin comando configurado», «no ejecutado».
   - TC-039: comandos solo en `defaults.unit.command` (esquema anterior), sin `verify` → `[WARN]` de clave legada, «no ejecutado — tipo sin configurar en verify», el comando no se ejecuta.
   - TC-040: configuración de este repo (`eval` con `required: false`) → «no ejecutado — required: false», no se ejecuta `npm run test:eval` y las casillas EV quedan en `[ ]`.
   - TC-041: `verify.e2e` con `command: manual` y `required: true` → «no ejecutado — command: manual».
   - TC-042: generador `api` sin clave en `verify` → «no ejecutado — tipo sin configurar en verify».
   - TC-043: `command_template` con `{{test_file_path}}` y `files_generated` del tipo → el comando ejecutado contiene la ruta sustituida; variante sin archivos → «plantilla sin archivos de prueba».
   - TC-044: `verify.unit` con `required: true`, exit codes `{red: 1, green: 0, refactor: 1}` → `⚠️ Fase REFACTOR introdujo regresiones`, `story.md` sin cambio.
   - Migrar TC-004 y TC-006 (bloque `verify`).
   - `npm run verify:repository` (paso de inventario de evals) debe seguir en verde. Los evals **no** se ejecutan aquí: es decisión humana por cuota (principio 14).
2. **`SKILL.md`, subsección común:** `### Resolución del comando de prueba`, con la tabla D-2, la regla de la clave legada (D-4), el formato de `[WARN]` (D-3) y la variable `$TEST_RUNS`.
3. **`SKILL.md`, Paso 5 (RED):** sustituir los puntos 1-3 por la invocación de la subsección; mantener `✅`/`⚠️` según el exit code y el párrafo de rework sin cambios.
4. **`SKILL.md`, Paso 9b (GREEN) y Pause-2:** invocar la subsección; las casillas de `testcases.md` solo para tipos ejecutados (D-6); el resumen de Pause-2 muestra el resultado real.
5. **`SKILL.md`, no-regresión de REFACTOR:** rama explícita para el tipo no ejecutable, `$REFACTOR_VERIFICADO` (D-5).
6. **`SKILL.md`, Paso 11:** plantilla de `implement-report.md` y 11a (D-7); filas nuevas en la tabla de errores: tipo no ejecutado (`[WARN]`, continuar), clave legada (`[WARN]`, continuar) y plantilla sin archivos (`[WARN]`, continuar); la fila «Tests pasan sin implementación» no cambia.
7. **Guarda C1, pruebas primero:** en `test/maintenance-contracts.test.js`, sobre un directorio temporal con un `SKILL.md` y una plantilla mínimos:
   - Referencia válida (`` `defaults.delivery-model` ``) → sin errores.
   - `` `defaults.{type}.command` `` con `defaults` que solo tiene `delivery-model` → error que nombra el `SKILL.md`, la línea y la ruta.
   - `` `verify.{type}.command` `` con hijos de `verify` que declaran `command` → sin errores.
   - `` `verify.e2e-smoke.command` `` inexistente en la plantilla → error.
   - Sección fuera del conjunto conocido (`` `foo.bar` ``) → ignorada, sin falsos positivos.
8. **Guarda C1, implementación:** `verifySkillConfigReferences({ repoRoot, skillsDir, templatePath })` con un parser de rutas por indentación, sin dependencias nuevas y con el mismo estilo de `verifyConfigFile`. Se integra en `verifyConfigContract`. Comprobar que con el repo real devuelve 0 errores después del paso 3 y 1 error antes, contra el árbol actual (sin `git stash`, porque hay sesiones concurrentes).
9. **Verificación** (sección siguiente) y actualización de `tasks.md` y `bug.md`.

## Riesgos

- **Proyectos que «funcionaban» por el agente:** con A1, un proyecto con la plantilla por defecto (`required: false`) sigue sin ejecutar pruebas en `story-implement`, ahora con `[WARN]`. Hasta ahora el agente compensaba ejecutando `npm test` por iniciativa propia (STORY-097 a 102). Mitigación: el `[WARN]` nombra el motivo y la clave a cambiar (`required: true`). Conviene mencionarlo en la entrada de `CHANGELOG.md` en el despliegue (paso 7 del proceso, fuera de este plan).
- **Acoplamiento TDD↔VERIFY:** `required: true` pasa a significar «se ejecuta en `story-implement` y bloquea en `story-verify`». Un proyecto que quiera TDD sin gate en VERIFY no puede expresarlo. Se acepta. A3 queda como posible mejora.
- **Coste en este repo:** si alguien pone `verify.eval.required: true`, `story-implement` ejecutaría `npm run test:eval` (evals de **todos** los skills) tres veces. Mitigación: la configuración actual lo deja en `false` y TC-040 lo fija. No se cambia `sddf.config.yaml`.
- **Comandos de suite completa:** en RED, `verify.unit.command` puede ejecutar toda la suite. Un exit ≠ 0 confirma el rojo aunque lo cause un fallo ajeno. Es la semántica actual y no se cambia aquí.
- **Conflicto con EPIC-29:** toca el mismo `SKILL.md` y el mismo `evals.json`. Mitigación: cambios acotados a las tres lecturas, Pause-2, el informe y la tabla de errores. Los IDs nuevos (TC-038 en adelante) van al final, y solo se migran 2 casos. Conviene integrar BUG-02 antes de que EPIC-29 pase a `IN-PROGRESS`.
- **Falsos positivos de la guarda C1:** una cita en prosa como `` `verify.e2e` `` dentro de un ejemplo podría no existir en la plantilla de un tercero. Mitigación: el conjunto de secciones está cerrado (`defaults`, `verify`, `implement`, `guardrails`), solo se valida contra la plantilla de `sddf-init` y las 13 referencias actuales son válidas.
- **Literales en los evals:** TC-004 tiene `not_contains: "REFACTOR no ejecutado"`. El formato de D-3 (`Tipo '{tipo}' no ejecutado en REFACTOR`) no produce ese literal, y TC-004 queda migrado con `required: true`, así que no lo emite.
- **Unicode:** al editar `SKILL.md` y `evals.json`, verificar por bytes que no aparezca un U+FEFF literal (incidencia recurrente; el gate no la detecta).
- **WIP:** el bug está en `PLAN`. Este plan no consume el WIP-Limit de épicas (1) ni el de historias (2).

## Verificación

1. `npm test`: pruebas nuevas de la guarda C1 y regresión de las existentes.
2. `node scripts/verify-config-contract.js`: `[OK]` con el `SKILL.md` corregido. Comprobación negativa: el árbol anterior a la corrección habría dado error en las líneas 533, 834 y 956.
3. `grep -rn "defaults.{type}" skills/`: sin resultados.
4. `npm run verify:layout`: el marcador `SDDF-FIXED-LAYOUT: v1` sigue intacto.
5. `npm run verify:repository`: gate completo (incluye el inventario de evals y el contrato de configuración).
6. Bytes: ningún U+FEFF en `SKILL.md`, `evals.json` ni `verify-config-contract.js` (`grep -c $'\xEF\xBB\xBF'`).
7. Manual, a criterio humano por cuota: `npm run test:eval -- story-implement --only TC-004,TC-006,TC-038,TC-039,TC-040,TC-041,TC-042,TC-043,TC-044`.
8. Manual, verificación del proceso (paso 6): `/story-implement` sobre una historia de prueba con `verify.unit.required: true`. `implement-report.md` debe mostrar el exit code de RED, GREEN y REFACTOR sin que el agente ejecute nada por su cuenta. Las evidencias se anotan en `bug.md`.
9. `graphify update .`
