---
alwaysApply: false
type: tasks
id: STORY-157
slug: STORY-157-reparar-enlaces-tras-migracion-tasks
title: "Tasks: Reparar enlaces y validar el gate tras la migración"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-157
design: STORY-157
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-157-reparar-enlaces-tras-migracion
---

<!-- Referencias -->
[[STORY-157-reparar-enlaces-tras-migracion]] · [[STORY-157-reparar-enlaces-tras-migracion-design]]

## 1. Puerta de entrada

- [ ] T001 Comprobar P1: `test ! -e docs/specs`, y existen `specs/flow/` y `specs/flow/archive/`. Si falla, detener e informar «STORY-153 no ejecutada» — D-1, AC-3
- [ ] T002 Comprobar P2: `git status --porcelain -- specs docs/specs` sin entradas `R`/`D` pendientes; obtener `MIGRATION_COMMIT` con `git log --diff-filter=R --format=%H -1 -- specs/flow` y guardarlo en `.tmp/story-implement/STORY-157/migration-commit.txt`. Si falla, detener y pedir al mantenedor el commit de STORY-153 — D-1, CR-003, AC-2
- [ ] T003 Comprobar P3 y P4: `node scripts/verify-fixed-layout.js --json` con `pending: []`; existe `docs/adr/ADR-0016-*.md`; `AGENTS.md` contiene la viñeta «Transición EPIC-26». Por cada skill pendiente, informar su historia dueña con la tabla de propiedad de D-1 y detener sin editar — D-1, AC-3
- [ ] T004 Guardar la línea base: salidas de `npm test`, `npm run verify:links` y `npm run verify:repository` en `.tmp/story-implement/STORY-157/baseline.txt` (se espera `enlaces activos` en rojo), y el inventario de D-2 (`git grep -nE "docs/specs|specs/(epics|stories)" -- . ':!specs' ':!skills' ':!CHANGELOG.md' ':!docs/adr' ':!.tmp'`) en `inventory.txt` — D-2, contrato #1

## 2. Checker de enlaces (RED → GREEN)

- [ ] T005 En `test/check-doc-links.test.js`: el fixture crea `specs/flow` en lugar de `docs/specs`; el caso de deduplicación de `slugIndex` usa `specs/flow/EPIC-01-a/epic.md` y `notes.md`; añadir el caso «wikilinks a work items en specs/flow y archive resuelven» (`docs/index.md` con `[[STORY-001-a]]` → `../specs/flow/STORY-001-a/story.md` y `[[STORY-000-z]]` con su `story.md` en `specs/flow/archive/2026-01-01-STORY-000-z/`, sin errores) y el caso `[[STORY-999-inexistente]]` → `Missing wikilink target`. Ejecutar `node --test test/check-doc-links.test.js` y confirmar que el caso de resolución falla (RED) — D-5, AC-1
- [ ] T006 En `scripts/check-doc-links.js`: en `checkDocumentation`, añadir al corpus de `slugIndex` los Markdown de `<repoRoot>/specs/` cuando exista (sin tocar `ACTIVE_ROOTS`); cambiar `HISTORICAL_EXCLUSIONS` a `['CHANGELOG.md', 'docs/adr', 'specs']`. Ejecutar `node --test test/check-doc-links.test.js` → verde (GREEN) — D-5, AC-1

## 3. Índice y referencias restantes

- [ ] T007 Ejecutar `/memory-system index` y comprobar el contrato #2: `grep -cE "specs/(epics|stories)" docs/index.md` = 0, entradas `../specs/flow/…` para épicas, stories activas y archivadas, y `[[specs-index]]` → `../specs/README.md`. Si quedan rutas legadas o faltan las archivadas, detener y devolver el defecto del motor a STORY-152 sin editar el índice a mano — D-4, AC-1
- [ ] T008 [P] Reescribir `docs/guardrails/gr-ai-security-checklist.md:170–173` con la regla de D-3: `EPIC-17-…/plan-13-…md` → `specs/flow/EPIC-17-…/plan-13-…md`; `STORY-039`, `STORY-046` y `STORY-087` → su `specs/flow/archive/<fecha>-STORY-…/story.md` (o `specs/flow/STORY-…/` si siguen activas), resueltos con `ls` y conservando los sufijos `:línea`. Coincidencia ausente o múltiple → detener y registrar — D-2, D-3, AC-1
- [ ] T009 [P] Reescribir `docs/runbooks/actualizar-spec-de-proyecto.md`: los comandos de l. 85–99 sobre `specs/flow/EPIC-*/` y, para historias, sobre `specs/flow/STORY-*/` y `specs/flow/archive/*-STORY-*/` (conteos y `grep` de ambas ubicaciones); las filas de l. 118–119 → `specs/flow/` (épicas) y `specs/flow/` + `specs/flow/archive/` (historias) — D-2, D-3, AC-1
- [ ] T010 [P] Reescribir las ubicaciones vigentes de `docs/domains/domain-knowledge-artifacts.md` (l. 101–102, 244) y `docs/domains/domain-work-item-hierarchy.md` (l. 44–45, 67–68, 78) con los patrones `specs/flow/EPIC-NN-<slug>/`, `specs/flow/STORY-NNN-<slug>/` y `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` — D-2, AC-1
- [ ] T011 [P] Reescribir `docs/product/README.md:22` y `docs/product/stakeholders.md:41` a `specs/flow/`; no tocar `docs/product/roadmap.md` (append-only) — D-2, AC-1
- [ ] T012 Recalcular el inventario de T004 y clasificar cada coincidencia restante con las clases de D-2; reescribir las de clase «ruta concreta» o «descripción vigente» que queden en `ACTIVE_ROOTS` o `docs/architecture/` (residuales no cubiertos por STORY-154) y anotar en `implement-report.md` cada línea conservada con su clase — D-2, contrato #3, AC-1

## 4. Restos de la transición

- [ ] T013 [P] En `sddf.config.yaml`: eliminar el comentario «Raíz versionada…» y la línea `root: docs`; en el comentario de `guardrails` cambiar `$SPECS_BASE/guardrails/<slug>.md` por `docs/guardrails/<slug>.md`. Ejecutar `node scripts/verify-config-contract.js` → exit 0 — D-6, CR-002, AC-3
- [ ] T014 [P] En `AGENTS.md`: eliminar la viñeta «Transición EPIC-26» sin tocar el resto de reglas — D-6, CR-002, AC-3

## 5. Verificación

- [ ] T015 Ejecutar `npm run verify:links` → `[OK]` y el grep del contrato #3; guardar ambas salidas en `.tmp/story-implement/STORY-157/links.txt` — contratos #2, #3, #5, AC-1
- [ ] T016 [P] Verificar AC-2 con D-7: `git log --follow --format="%h %ad" --date=short` sobre la primera story archivada en orden alfabético y sobre una story con solo `date:` (STORY-001 a STORY-049) muestra commits anteriores a `MIGRATION_COMMIT`; `git show --stat -M --format= <MIGRATION_COMMIT> -- <ruta>` muestra `=>`; `git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements` exit 0 y `git status --porcelain -- docs/requirements` vacío — D-7, contratos #6, #7, AC-2
- [ ] T017 [P] Verificar CS-2, lista vacía y CS-3 con D-8: `node scripts/verify-fixed-layout.js --json` → `errors: []`, `pending: []`; `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/` solo en `skills/skill-preflight/SKILL.md` dentro de la región `SDDF-LEGACY-DIAGNOSTIC`; greps de `root` de D-8 vacíos. Cualquier hallazgo → devolver a la historia dueña (tabla de D-1) — D-8, contratos #8, #9, AC-3
- [ ] T018 Ejecutar `npm test` y `npm run verify:repository` → exit 0 (CS-12) — D-8, contrato #10, AC-3
- [ ] T019 Revisar `git diff --stat`: solo los archivos de «Componentes afectados» del diseño y los artefactos de la historia; ningún archivo nuevo versionado; `package.json`, `skills/`, `specs/**` ajenos, `docs/adr/`, `CHANGELOG.md`, `docs/product/roadmap.md` y `docs/requirements/` sin cambios — contratos #11, #12, CNF-1, CNF-2
- [ ] T020 Ejecutar `graphify update .` y registrar en `implement-report.md` (en `specs/flow/STORY-157-reparar-enlaces-tras-migracion/`): resultados de T001–T018, `MIGRATION_COMMIT`, las líneas conservadas por clase (T012) y cualquier defecto devuelto a otra historia — design Risks, F-4
