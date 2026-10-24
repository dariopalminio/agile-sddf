---
alwaysApply: false
type: tasks
id: STORY-153
slug: STORY-153-migrar-work-items-specs-flow-tasks
title: "Tasks: Migrar y archivar los work items a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-153
design: STORY-153
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-153-migrar-work-items-specs-flow
---

<!-- Referencias -->
[[STORY-153-migrar-work-items-specs-flow]] · [[STORY-153-migrar-work-items-specs-flow-design]]

## 1. Preparación

- [ ] T001 Verificar las precondiciones de la historia: STORY-149, STORY-150, STORY-151, STORY-152, STORY-155, STORY-156 y STORY-158 implementadas (los `SKILL.md` de `skills/` ya resuelven `specs/flow/`: `grep -rlE "SDDF-ROOT-RESOLUTION: v1" skills/` vacío) y `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`. Si falta alguna, detener la implementación y anotar la causa en `.tmp/story-implement/STORY-153/preconditions.txt` — story Notas (Precondiciones), design D-11
- [ ] T002 [P] Guardar la línea base en `.tmp/story-implement/STORY-153/baseline.txt`: salida de `npm test` y `npm run verify:syntax` (en verde), recuento de `docs/specs/epics/*/` y `docs/specs/stories/*/`, recuento de `status:` por valor en los `story.md`, y `git status --porcelain --untracked-files=all -- docs/specs docs/requirements` — design Context, D-8, CNF-4
- [ ] T003 [P] Aplicar el CR-001 en la especificación: en `story.md` AC-1 cambiar «con la fecha de su "updated:" (o "created:" si falta)» por «con la fecha de su "updated:" (o "created:" si falta, o "date:" si faltan ambos)»; en la nota «Fecha del prefijo de archivo» de `epic.md` de EPIC-26 añadir el tercer nivel `date:`; si ADR-0016 no recoge el nivel `date:`, anotarlo como pendiente en `implement-report.md` (el ADR aceptado no se edita) — design D-4, CR-001

## 2. Prueba de la migración (RED)

- [ ] T004 Crear `test/migrate-specs-to-flow.test.js` con un helper de fixture: `fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-migrate-'))`, `git init`, `git config user.name/user.email` locales, escritura de `docs/specs/README.md`, `docs/specs/epics/<EPIC>/epic.md` y `docs/specs/stories/<STORY>/story.md` con frontmatter configurable, `git add -A` y `git commit`; limpieza con `t.after`; importar `runMigration` y `archiveDate` desde `../scripts/migrate-specs-to-flow` — design D-10
- [ ] T005 Añadir los casos de AC-1 al test: (a) 2 épicas, story `COMPLETED` con `updated: 2026-05-10` → `specs/flow/archive/2026-05-10-STORY-…/`, story `CANCELED` y story `IMPLEMENT` → `specs/flow/STORY-…/`, `README.md` → `specs/README.md`, `docs/specs/` inexistente, exit 0 y resumen con activas + archivadas = total previo; (b) `git status --porcelain` del fixture solo con entradas `R`; (c) tras migrar no existe ningún archivo fuera de los destinos del plan (sin logs ni eventos). Depende de T004 — design D-3, D-6, D-8, contratos 1, 3 y 8, AC-1, CNF-1, CNF-3
- [ ] T006 Añadir los casos de fecha al test: `archiveDate` devuelve `updated:` si existe, `created:` si falta `updated:`, `date:` si faltan ambos y `null` si no hay ninguno o el valor no cumple `YYYY-MM-DD`; fixture con story `COMPLETED` sin fechas → exit 1, línea `[BLOQUEO] … COMPLETED sin fecha válida (updated/created/date)` y `docs/specs/` intacto. Depende de T004 — design D-4, contrato 2, AC-1
- [ ] T007 Añadir los casos de AC-2 al test: (a) `dryRun: true` imprime un `[MOVERÍA] <origen> → <destino>` por movimiento y el resumen `(dry-run)`, y `git status --porcelain` más el listado recursivo del fixture son idénticos antes y después; (b) segunda ejecución sobre el fixture ya migrado → `[SIN CAMBIOS] docs/specs/ no existe: nada que migrar`, exit 0, árbol idéntico y sin `specs/flow/archive/` creado si no existía. Depende de T004 — design D-7, contratos 4 y 5, AC-2
- [ ] T008 Añadir los casos de guardias al test, uno por bloqueo, comprobando exit 1, la línea `[BLOQUEO]` correspondiente y `docs/specs/` intacto (sin movimientos parciales): destino `specs/flow/STORY-…/` preexistente; entrada no reconocida en `docs/specs/stories/` (archivo suelto); directorio de story sin archivos versionados; story sin `status:`. Añadir el caso de aviso: un archivo sin versionar dentro de una story se mueve con ella y genera `[AVISO]`. Depende de T004 — design D-2, D-5, contratos 6 y 7, AC-1
- [ ] T009 Ejecutar `node --test test/migrate-specs-to-flow.test.js` y confirmar que falla porque `scripts/migrate-specs-to-flow.js` no existe; guardar la salida en `.tmp/story-implement/STORY-153/red.txt`. Depende de T005–T008

## 3. Script de migración (GREEN)

- [ ] T010 Crear `scripts/migrate-specs-to-flow.js` con el esqueleto de D-1: shebang, `'use strict'`, JSDoc de cabecera (propósito, «un solo uso — STORY-153», reglas de destino y fecha, uso `node scripts/migrate-specs-to-flow.js [--dry-run]`, exit codes), `REPO_ROOT = path.resolve(__dirname, '..')`, solo `fs`, `path` y `child_process`; helper `git(repoRoot, args)` con `spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' })` sin shell; exportaciones `planMigration`, `runMigration`, `archiveDate`; `main()` bajo `require.main === module` que rechaza argumentos distintos de `--dry-run` con `[ERROR] argumento no reconocido: <arg>` y exit 1 — design D-1, Interfaces, CNF-1, CNF-2
- [ ] T011 Implementar la lectura de frontmatter y `archiveDate`: bloque entre la primera línea `---` y la siguiente, pares `clave: valor`, tolerancia a BOM, CRLF y comillas; `archiveDate` con la precedencia `updated:` → `created:` → `date:` y validación `^\d{4}-\d{2}-\d{2}$`. Depende de T010 — design D-3, D-4, AC-1
- [ ] T012 Implementar `planMigration({ repoRoot })` (solo lectura): `docsSpecsExists`; guardia `git rev-parse --show-toplevel` = `repoRoot`; inventario de D-2 con bloqueo `entrada no reconocida`; destino por tipo de D-3 (`epic`, `story-active`, `story-archived`, `index` → `specs/README.md`); bloqueos de status ausente, fecha inválida, origen sin archivos versionados (`git ls-files -- <origen>`), destino existente y destino duplicado; avisos desde `git status --porcelain --untracked-files=all -- docs/specs`; totales `epics`, `active`, `archived`, `previous`, `preexisting`; orden alfabético por origen y rutas relativas con `/`. Depende de T011 — design D-2, D-3, D-5, D-8, Esquema de datos, AC-1
- [ ] T013 Implementar `runMigration({ repoRoot, dryRun })`: sin `docs/specs/` → `[SIN CAMBIOS]` y exit 0 sin escrituras; con `dryRun` o con bloqueos → líneas `[MOVERÍA]`, `[BLOQUEO]`, `[AVISO]` y resumen sin escribir; en ejecución real → `mkdirSync('specs/flow/archive', { recursive: true })`, `git mv` por movimiento con `[MOVIDO]`, parada en el primer fallo con `[ERROR] git mv <from> → <to>: <stderr>` y recuento de movidos, `rmdirSync` no recursivo de `docs/specs/epics`, `docs/specs/stories` y `docs/specs` (`[ERROR] <dir> no quedó vacío` si falla), post-condición activas + archivadas = previous + preexisting; resumen de D-9; devuelve `{ lines, exitCode, plan }`. Depende de T012 — design D-6, D-7, D-8, D-9, Flujos clave, AC-1, AC-2
- [ ] T014 Ejecutar `node --test test/migrate-specs-to-flow.test.js` hasta verde y guardar la salida en `.tmp/story-implement/STORY-153/green.txt`; si un caso falla por comportamiento de `git mv` distinto del documentado en el design, corregir el script, no la prueba. Depende de T013 — contratos 1–8

## 4. Verificación del código

- [ ] T015 [P] Revisar (REFACTOR) el script: sin dependencias nuevas (`git diff package.json` vacío, `require` solo de módulos de Node), sin escrituras fuera de `mkdirSync`/`git mv`/`rmdirSync`, sin `process.cwd()` ni `process.env`, sin `rm -r`; ejecutar de nuevo el test — design D-1, D-6, contratos 8 y 9, CNF-1, CNF-2
- [ ] T016 [P] Ejecutar `npm test` y `npm run verify:syntax` y confirmar que terminan en verde con el test nuevo incluido — contrato 12

## 5. Migración del repositorio (corte, D-11)

- [ ] T017 Ejecutar `node scripts/migrate-specs-to-flow.js --dry-run` sobre el repo: exit 0 sin bloqueos; comparar épicas, activas, archivadas y total previo con la línea base de T002 (al 2026-10-22: 27, 51, 98, 149); confirmar que `git status --porcelain` no cambió; guardar la salida en `.tmp/story-implement/STORY-153/dry-run.txt`. Si hay bloqueos, resolverlos (sin editar frontmatter de work items cerrados salvo decisión del mantenedor) y repetir — design D-11 paso 1, contrato 10, AC-2
- [ ] T018 Ejecutar `node scripts/migrate-specs-to-flow.js` sobre el repo y verificar: exit 0; `test ! -e docs/specs`; `ls specs/flow | grep -c '^EPIC-'` = épicas del dry-run; `ls specs/flow/archive | wc -l` = archivadas del dry-run; activas + archivadas = total previo; `specs/README.md` existe; EPIC-26 y STORY-153 en `specs/flow/`; `git status` muestra los movimientos como renombres; `git status --porcelain -- docs/requirements` vacío. Guardar la salida en `.tmp/story-implement/STORY-153/run.txt`. Depende de T017 — design D-6, D-8, D-11 paso 2, contratos 10 y 11, AC-1, CNF-3, CNF-4
- [ ] T019 Ejecutar el script por segunda vez: `[SIN CAMBIOS]`, exit 0 y `git status --porcelain` idéntico antes y después (guardar ambas salidas en `.tmp/story-implement/STORY-153/second-run.txt`). Depende de T018 — design D-7, D-11 paso 3, contrato 10, AC-2
- [ ] T020 Reinstalar las copias de runtime desde las fuentes migradas con `node scripts/cli.js install --force` y confirmar que el `SKILL.md` instalado de `story-implement-tasks` ya no contiene `SDDF-ROOT-RESOLUTION: v1`. Depende de T019 — design D-11 paso 4, Risks
- [ ] T021 Escribir los artefactos posteriores de la historia en `specs/flow/STORY-153-migrar-work-items-specs-flow/` (marcar este `tasks.md` y crear `implement-report.md` ahí) y comprobar que `docs/specs/` no se recreó (`test ! -e docs/specs`). Registrar en `implement-report.md`: los totales del dry-run y de la ejecución, que `verify:links`/`verify:repository` fallan por los enlaces de `docs/index.md` y otras rutas movidas hasta STORY-157 (conocido), y los CR-002 (contenido de `specs/README.md` → STORY-154) y CR-003 (retiro de `root: docs` → STORY-157) para traspaso. Depende de T020 — design D-11 paso 5, Risks, CR-002, CR-003
