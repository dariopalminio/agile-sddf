# Tasks: BUG-002 — story-implement lee los comandos de prueba de `verify`

Checklist de progreso del plan. Fuente: `specs/flow/BUG-002-story-implement-omite-pruebas-tdd/plan.md`.

## Estado

| # | Tarea | Cubre | Depende de | Estado |
|---|---|---|---|---|
| 1 | `plan.md` y `tasks.md` escritos en el directorio del bug | — | — | ✅ DONE |
| 2 | Evals primero: TC-038 a TC-044 y migración de TC-004 y TC-006 | CR-4 (D-8) | 1 | ⬜ TODO |
| 3 | `SKILL.md`: subsección `Resolución del comando de prueba` | CR-1, CR-2 (D-1 a D-4) | 2 | ⬜ TODO |
| 4 | `SKILL.md`: Paso 5 (RED) usa la subsección | CR-1, CR-2 | 3 | ⬜ TODO |
| 5 | `SKILL.md`: Paso 9b (GREEN), casillas de `testcases.md` y Pause-2 | CR-1, CR-2 (D-6) | 3 | ⬜ TODO |
| 6 | `SKILL.md`: no-regresión de REFACTOR con rama explícita | CR-1, CR-2 (D-5) | 3 | ⬜ TODO |
| 7 | `SKILL.md`: plantilla de `implement-report.md`, 11a y tabla de errores | CR-2 (D-7) | 4, 5, 6 | ⬜ TODO |
| 8 | Guarda C1, pruebas primero en `test/maintenance-contracts.test.js` | CR-3 | 1 | ⬜ TODO |
| 9 | Guarda C1: `verifySkillConfigReferences` en `scripts/verify-config-contract.js` | CR-3 | 8 | ⬜ TODO |
| 10 | Verificación determinista: `npm test`, contrato de configuración, `verify:layout`, `verify:repository`, bytes, `graphify update` | — | 2–9 | ⬜ TODO |
| 11 | Verificación manual: evals seleccionados y `/story-implement` real, con evidencias en `bug.md` | — | 10 | ⏸ MANUAL (cuota) |

Las tareas 8 y 9 no dependen de 2–7 y pueden hacerse en paralelo. La 9 solo da 0 errores en el repo real después de la 4.

## Detalle de tareas

### 2. Evals (`skills/story-implement/evals/evals.json`)

En todos los casos nuevos, `defaults` solo contiene `delivery-model`, los comandos van **solo** en `verify` y los resultados se dan como `command_exit_codes`, no como `tests_pass_after_*`.

- [ ] TC-038: `verify.unit` con `required: true`, exit `{red: 1, green: 0, refactor: 0}` → ✅ RED, GREEN y REFACTOR, casillas UT en `[x]`; `not_contains`: «Sin comando configurado», «no ejecutado»
- [ ] TC-039: comandos solo en `defaults.unit.command` → `[WARN]` de clave legada y «no ejecutado — tipo sin configurar en verify»
- [ ] TC-040: `verify.eval` con `required: false` (configuración del repo) → «no ejecutado — required: false», sin ejecutar `npm run test:eval`, casillas EV en `[ ]`
- [ ] TC-041: `verify.e2e` con `command: manual` → «no ejecutado — command: manual»
- [ ] TC-042: generador `api` sin clave en `verify` → «no ejecutado — tipo sin configurar en verify»
- [ ] TC-043: `command_template` con `{{test_file_path}}`, sustituido por los archivos del tipo; variante sin archivos → «plantilla sin archivos de prueba»
- [ ] TC-044: exit `{red: 1, green: 0, refactor: 1}` → `⚠️ Fase REFACTOR introdujo regresiones`, `story.md` sin cambio
- [ ] Migrar TC-004: bloque `verify` (`unit` y `eval` con `required: true`)
- [ ] Migrar TC-006: bloque `verify` (`unit` con `required: true`)
- [ ] El paso de inventario de evals de `npm run verify:repository` sigue en verde

### 3. Subsección común en `SKILL.md`

- [ ] `### Resolución del comando de prueba`, antes del Paso 5
- [ ] Tabla de clasificación D-2: tipo sin configurar, `required: false`, `command: manual`, sin comando, plantilla sin archivos o ejecutable
- [ ] Marcador `{{test_file_path}}` buscado en `command` y en `command_template`, sustituido por `files_generated ∪ files_modified` del tipo
- [ ] Clave legada `defaults.{type}.command`: `[WARN]` una vez, sin ejecutarla (D-4)
- [ ] `[WARN] Tipo '{tipo}' no ejecutado en {fase} — {motivo}` y acumulación en `$TEST_RUNS` (D-3)

### 4. Paso 5 (RED)

- [ ] Sustituir la lectura de `defaults.{type}.command` (línea 533) por la invocación de la subsección
- [ ] Retirar el `[INFO] Sin comando configurado …`
- [ ] Mantener sin cambios los mensajes `✅`/`⚠️` por exit code y el párrafo de rework

### 5. Paso 9b (GREEN) y Pause-2

- [ ] Sustituir la lectura de la línea 834
- [ ] Casillas `[x]`/`[!]` en `testcases.md` solo para tipos ejecutados; un tipo no ejecutado deja `[ ]` y emite `⚠️` (D-6)
- [ ] Retirar el `[INFO] confirmación GREEN omitida …`
- [ ] Pause-2: «Tests:» muestra el resultado real, no «todos pasan ✅» sin condición

### 6. No-regresión de REFACTOR

- [ ] Sustituir la lectura de la línea 956
- [ ] Rama explícita para el tipo no ejecutable
- [ ] `$REFACTOR_VERIFICADO = true` solo si al menos un tipo se ejecutó; `$REFACTOR_REGRESIONES` ya no es `false` por vacuidad (D-5)

### 7. Informe y errores

- [ ] `## Resumen`: «Fase X confirmada» con `sí / no / no ejecutada`
- [ ] `## Ciclo TDD`, columna Detalle: resultado por tipo (exit code o «no ejecutado — motivo»)
- [ ] 11a: un criterio de pruebas con la fase no ejecutada se evalúa `⚠️`, nunca `✓`
- [ ] Filas nuevas en `## Manejo de errores`: tipo no ejecutado, clave legada y plantilla sin archivos
- [ ] Sin sección «Pruebas ejecutadas» (es de mejora-017)
- [ ] Conservar `<!-- SDDF-FIXED-LAYOUT: v1 -->`

### 8. Pruebas de la guarda C1 (`test/maintenance-contracts.test.js`)

- [ ] Referencia válida → sin errores
- [ ] `` `defaults.{type}.command` `` con `defaults` que solo tiene `delivery-model` → error con `SKILL.md`, línea y ruta
- [ ] `` `verify.{type}.command` `` con hijos que declaran `command` → sin errores
- [ ] Ruta concreta inexistente en la plantilla → error
- [ ] Sección desconocida (`` `foo.bar` ``) → ignorada

### 9. Guarda C1 (`scripts/verify-config-contract.js`)

- [ ] `verifySkillConfigReferences({ repoRoot, skillsDir, templatePath })`: parser de rutas por indentación, sin dependencias nuevas
- [ ] Integrada en `verifyConfigContract` y exportada
- [ ] Repo real: 0 errores después de la tarea 4 (comprobación negativa sobre el árbol actual, sin `git stash`)

### 10. Verificación determinista

- [ ] `npm test`
- [ ] `node scripts/verify-config-contract.js` → `[OK]`
- [ ] `grep -rn "defaults.{type}" skills/` → sin resultados
- [ ] `npm run verify:layout`
- [ ] `npm run verify:repository`
- [ ] Sin U+FEFF literal en `SKILL.md`, `evals.json` ni `verify-config-contract.js` (comprobado por bytes)
- [ ] `graphify update .`

### 11. Verificación manual (a criterio humano)

- [ ] `npm run test:eval -- story-implement --only TC-004,TC-006,TC-038,TC-039,TC-040,TC-041,TC-042,TC-043,TC-044`
- [ ] `/story-implement` sobre una historia de prueba con `verify.unit.required: true`: `implement-report.md` muestra los exit codes de RED, GREEN y REFACTOR
- [ ] Evidencias anotadas en `bug.md`
