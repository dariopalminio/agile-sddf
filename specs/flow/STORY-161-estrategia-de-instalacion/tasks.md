---
alwaysApply: false
type: tasks
id: STORY-161
slug: STORY-161-estrategia-de-instalacion-tasks
title: "Tasks: Estrategia de instalación"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-161
design: STORY-161
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-161-estrategia-de-instalacion
  - STORY-161-estrategia-de-instalacion-design
---

<!-- Referencias -->
[[STORY-161-estrategia-de-instalacion]] · [[STORY-161-estrategia-de-instalacion-design]]

> Referencias D-N, F-N y «Contratos de verificación #N» remiten a `design.md`. Ciclo TDD: las pruebas del grupo 1 se escriben primero y deben fallar (RED) antes de los grupos 2–3.

## 1. Pruebas primero (RED) — `test/install.test.js`

- [ ] T001 Ampliar el `require('../scripts/install.js')` de `test/install.test.js` con `resolveInstallStrategy`, `promptStrategySelection` y `VALID_STRATEGIES`, y añadir el helper `epicSkillNames()` que lista los directorios `skills/epic-*` de la fuente (`REPO_ROOT/skills`) para no fijar el catálogo en la prueba // AC-1, CNF-4
- [ ] T002 [P] Prueba `resolveInstallStrategy`: `undefined` → `full`, `'story'` → `story`, `'full'` → `full`; `'epic'` y `''` lanzan con `/Invalid strategy "epic"\. Valid strategies: full, story/` (Contratos #7) // AC-2, AC-3
- [ ] T003 [P] Prueba `installSDDF({ strategy: 'story', target: 'claude-code' })` en fixture con `withInitCwd` + `withoutInstallLogs`: ninguna entrada `epic-*` en `.claude/skills`, todas las demás entradas de `skills/` presentes, `result.strategy === 'story'` y `result.skills.excluded === epicSkillNames().length` (Contratos #1) // AC-1
- [ ] T004 [P] Prueba `installSDDF({ strategy: 'full' })` y `installSDDF({})` sin estrategia: `topLevelEntries` del destino igual a la de `skills/`, `result.strategy === 'full'`, `result.skills.excluded === 0` (Contratos #3) // AC-2, CNF-2
- [ ] T005 [P] Prueba `--force` + `story`: crear en el destino un `epic-analyze/SKILL.md` con contenido centinela, instalar con `{ strategy: 'story', force: true }` y verificar que el contenido sigue intacto; repetir con `{ global: true, homeDir }` y verificar el destino global (Contratos #8) // CNF-2, D-9
- [ ] T006 [P] Prueba `promptStrategySelection({ input, output })` con `PassThrough` de `node:stream`: `'2\n'` → `story`, `'\n'` → `full`, `'9\n'` → `full`; la salida acumulada contiene `full` y `story` (Contratos #6) // AC-2
- [ ] T007 [P] Prueba CLI `install --strategy story --target claude-code` vía `runNode`: código 0, sin `epic-*` en `.claude/skills` y `stdout` con `strategy story` (Contratos #2) // AC-1
- [ ] T008 [P] Prueba CLI `install --target claude-code` sin `--strategy` (stdin de `spawnSync` sin TTY): catálogo completo y `stdout` con `strategy full` (Contratos #4) // AC-2, CNF-2
- [ ] T009 [P] Prueba CLI `install --strategy epic`, `install --strategy` y `install --strategy --force`: código ≠ 0, `stderr` con `Invalid --strategy` y `full, story` (en el primero también `"epic"`), y `assertNoRuntimeOutput(projectDir)` (Contratos #5) // AC-3, CNF-1
- [ ] T010 [P] Ampliar la prueba de ayuda del CLI: `--help` contiene `--strategy`, `full` y `story` (Contratos #9) // CNF-3
- [ ] T011 Ejecutar `npm run test:installer` y confirmar que T002–T010 fallan por la funcionalidad ausente y que las pruebas previas siguen pasando // CNF-4

## 2. Catálogo y filtro en `scripts/install.js` (GREEN)

- [ ] T012 Añadir `INSTALL_STRATEGIES` (congelado; `full` y `story` con `label` y `excludedSkillPrefixes` según el esquema de datos), `VALID_STRATEGIES = Object.keys(INSTALL_STRATEGIES)` y `DEFAULT_STRATEGY = 'full'` (D-2) // AC-1, AC-2, AC-3
- [ ] T013 Implementar `resolveInstallStrategy(strategy)`: `undefined` → `DEFAULT_STRATEGY`; coincidencia exacta en `VALID_STRATEGIES` → valor; si no, `throw new Error('Invalid strategy "<valor>". Valid strategies: full, story')` con la lista derivada de `VALID_STRATEGIES` (D-3) // AC-2, AC-3
- [ ] T014 Extender `copyDir` con la opción `shouldCopy` (por defecto siempre verdadero): las entradas rechazadas no tocan el destino, se registran como `  Excluded (strategy <id>): <nombre>` y suman a `excluded`; el retorno pasa a `{ installed, skipped, excluded }` y la rama de fuente ausente devuelve `excluded: 0`; la opción `strategyId` solo alimenta el log (D-6) // AC-1
- [ ] T015 Modificar `installSDDF`: resolver `strategy = resolveInstallStrategy(options.strategy)` antes de `resolveDestDir`; construir el predicado «no empieza por ningún `excludedSkillPrefixes`» y pasarlo solo a la copia de `skills/`; la copia de `agents/` queda sin cambios (D-1, D-7) // AC-1, CNF-2
- [ ] T016 Actualizar en `installSDDF` la línea de inicio (`(strategy <id>)`), la línea final (`(<mode>, <runtime.id>, strategy <id>)` y `, <n> excluded` solo si n > 0) y el objeto devuelto (`strategy`, `skills.excluded`) (D-8) // AC-1
- [ ] T017 Implementar `promptStrategySelection({ input = process.stdin, output = process.stdout } = {})` replicando `promptFolderSelection`: título `Which install strategy would you like to use?`, menú `  <n>) <id>  (<label>)` desde `INSTALL_STRATEGIES`, `Enter choice [1]: `, vacío o inválido → `full` (D-5) // AC-2
- [ ] T018 Exportar `resolveInstallStrategy`, `promptStrategySelection` y `VALID_STRATEGIES` en `module.exports` // CNF-4

## 3. CLI en `scripts/cli.js` (GREEN)

- [ ] T019 Importar `resolveInstallStrategy`, `promptStrategySelection` y `VALID_STRATEGIES`; parsear `strategyIdx`/`strategyValue` con el mismo patrón que `--target`; añadir `exitInvalidStrategy(provided)` que escribe `Invalid --strategy "<valor>". Valid strategies: full, story` en `stderr` y sale con 1 (D-4) // AC-3
- [ ] T020 En `command === 'install'`, validar `--strategy` tras `--target` y antes del bloque asíncrono: valor ausente o con prefijo `--` → `exitInvalidStrategy`; `resolveInstallStrategy` que lanza → `exitInvalidStrategy` (D-4, F-3) // AC-3, CNF-1
- [ ] T021 En el bloque asíncrono, tras el prompt de runtime: si `strategyValue === undefined` y `process.stdin.isTTY`, `strategy = await promptStrategySelection()`; pasar `strategy` a `installSDDF` junto a `global`, `target` y `force` (D-5, F-2) // AC-2, CNF-2
- [ ] T022 Actualizar `USAGE`: opción `--strategy <name>` en `Options:` con el texto de D-10 y el ejemplo `agile-sddf install --strategy story --target claude-code` // CNF-3
- [ ] T023 Ejecutar `npm run test:installer` y confirmar que todas las pruebas del grupo 1 pasan (GREEN); refactorizar duplicación entre `promptFolderSelection` y `promptStrategySelection` solo si las pruebas siguen en verde // AC-1, AC-2, AC-3

## 4. Documentación (D-10)

- [ ] T024 [P] `docs/architecture/tech-stack.md`: actualizar la fila del comando a `npx agile-sddf install [--global] [--target <runtime>] [--strategy full|story] [--force]` y mencionar que `story` excluye los skills `epic-*` // CNF-3
- [ ] T025 [P] `AGENTS.md`, tabla `## Comandos`: misma sintaxis que T024 (el archivo tiene cambios locales sin commit: editar solo esa fila) // CNF-3
- [ ] T026 [P] `README.md`, sección «Instalación en tu runtime»: párrafo con `--strategy full|story`, el default `full` sin TTY, la pregunta con TTY y la regla de exclusión `epic-*`, fuera de los marcadores de la tabla derivada de runtimes // CNF-3

## 5. Verificación final

- [ ] T027 Ejecutar `npm test` y `npm run verify:repository`; ambos deben pasar sin errores (Contratos #10) // CNF-4
- [ ] T028 Verificación manual de AC-2 fila «con TTY»: en una terminal interactiva sobre un directorio temporal, `node scripts/cli.js install --target claude-code` muestra el menú de estrategia; elegir `2` deja `.claude/skills` sin `epic-*` y el resumen dice `strategy story` // AC-2
- [ ] T029 Ejecutar `graphify update .` para mantener el grafo de conocimiento al día tras modificar código (`AGENTS.md`)
