---
alwaysApply: false
type: tasks
id: STORY-154
slug: STORY-154-documentar-el-nuevo-layout-tasks
title: "Tasks: Documentar el nuevo layout"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-154
design: STORY-154
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-154-documentar-el-nuevo-layout
---

<!-- Referencias -->
[[STORY-154-documentar-el-nuevo-layout]] · [[STORY-154-documentar-el-nuevo-layout-design]]

## 1. Precondiciones e inventario

- [ ] T001 Comprobar las precondiciones de D-1: existen `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` (STORY-147), `scripts/verify-fixed-layout.js` con `PENDING_MIGRATION` exportada (STORY-148), la región de diagnóstico legado de `skills/skill-preflight/SKILL.md` que nombra `docs/guides/artifact-directory-migration.md` y el template de `memory-system` con `## 🗂️ Work items (specs/flow/)` (STORY-152); y existe `docs/specs/` (STORY-153 sin ejecutar). Si algo falla, detener sin editar y registrarlo en `implement-report.md` (F-3) — D-1, AC-3
- [ ] T002 Comprobar que `npm run verify:repository` está en verde antes de empezar; si no, anotar los errores previos en `implement-report.md` para no atribuirlos a esta historia — D-1, AC-3
- [ ] T003 Generar el inventario con `git grep -nE "SPECS_BASE|SDDF_ROOT|root: docs|docs/specs|specs/(epics|stories)"` sobre los archivos de D-3 y clasificar cada línea según D-2 (mecanismo vigente / registro histórico / ruta concreta de work item); guardar la tabla en `.tmp/story-implement/STORY-154/inventario.md` (no versionado) — D-2, D-3, CNF-1
- [ ] T004 [P] Confirmar con `githubAnchor` de `scripts/check-doc-links.js` que `## Migración a 5.0.0 — layout fijo de tres raíces` produce `migracion-a-500--layout-fijo-de-tres-raices` — D-8, Interfaces
- [ ] T005 [P] Verificar contra los skills entregados los hechos que se van a documentar: aviso de `/sddf-init` ante `docs/specs/` y `.gitkeep` en `specs/flow/archive/`, `specs/living/` y `workflow/` (STORY-149); señales L1–L3 de `skill-preflight`; eliminación de `docs-wiki-builder` y `### Removed` en `CHANGELOG.md` (STORY-152); número de capas de `memory-system`. Lo que no exista no se documenta (F-3) — D-8, D-10, CNF-1

## 2. Guía de migración (componente central)

- [ ] T006 Insertar en `docs/guides/artifact-directory-migration.md`, antes de `## Migración a 4.0.0 — specs/ de dos niveles`, la sección `## Migración a 5.0.0 — layout fijo de tres raíces` con el párrafo «A quién aplica» (`root`, `docs/specs/`, `SDDF_ROOT`; cambio incompatible) y el enlace Markdown [ADR-0016](../adr/ADR-0016-layout-fijo-de-tres-raices.md) — D-8, AC-2
- [ ] T007 Añadir a esa sección la tabla origen 4.x → destino 5.0.0 de D-8 (épicas, stories no `COMPLETED`, stories `COMPLETED` → `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` con fecha de `updated:` o `created:`, `root` eliminado, `SDDF_ROOT` eliminado, capas de `docs/` sin cambios, `specs/living/` y `workflow/` reservados) con las rutas objetivo en code spans — D-2, D-8, AC-2
- [ ] T008 Añadir los once pasos numerados de D-8 (respaldo; `npx agile-sddf install --force` y borrado manual de `docs-wiki-builder`; `/skill-preflight`; crear directorios con `.gitkeep`; `git mv` de épicas, stories activas y `COMPLETED`; vaciar `docs/specs/`; quitar `root` y `SDDF_ROOT`; `/memory-system index` y `git grep -n "docs/specs/"`; verificación con `/skill-preflight`, `/memory-system check` y `git log --follow`) y las notas (historial, sin migrador distribuido, convivencia con Spec Kit, `CANCELED` y épicas no se archivan) — D-8, AC-2, CNF-2
- [ ] T009 En la misma guía: reformular en pasado la nota final de `## Migración histórica 1.x → 2.x` («Resuelve `$SPECS_BASE`…») remitiendo a la sección 5.0.0, y añadir bajo `## Migración a 4.0.0 — specs/ de dos niveles` la cita de reemplazo de D-8; no tocar `slug` ni `title` del frontmatter — D-2, D-8, AC-1

## 3. Entrada IA y arquitectura

- [ ] T010 Editar `AGENTS.md` según D-4: en la línea 3, sustituir la referencia inexistente `docs/specs/01-projects/PROJ-01-agile-sddf/` por `docs/product/vision.md` y EPIC-26; reemplazar la viñeta «Resolución de raíz» por «Layout fijo (ADR-0016)» con las tres raíces, `specs/flow/` plano, `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`, `specs/living/`, `workflow/`, el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE`, el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, el destino de `docs/requirements/` en `specs/living/` y el diagnóstico de `skill-preflight` — D-4, AC-1, CNF-1
- [ ] T011 Añadir a `AGENTS.md` la viñeta «Transición EPIC-26» con el texto de D-4 (work items aún en `docs/specs/` y `root: docs` hasta STORY-153; STORY-157 retira la viñeta; skills pendientes = `PENDING_MIGRATION` de `scripts/verify-fixed-layout.js`) y la entrada «Layout» en «Dónde está el detalle» — D-4, AC-1, CNF-1
- [ ] T012 [P] Editar `docs/architecture/sddf-architecture.md` según D-5: §5 paso 3, §6 principio 2, §7 árbol (comentario de `sddf.config.yaml` sin `root`; quitar `docs/specs/…`; añadir `specs/flow/` con `archive/`, `specs/living/` y `workflow/` como hermanas de `docs/`) y §8 (corregir la descripción de `[[perfiles-runtimes-e-instalacion-explicita]]` y añadir `[[layout-fijo-de-tres-raices]]`) — D-5, AC-1
- [ ] T013 [P] Editar `docs/architecture/memory-system.md` (líneas 145, 191 y 452, solo las que sigan tras STORY-152) y `docs/architecture/README.md:51` (`specs/flow/STORY-NNN-*/design.md`) según D-5 — D-5, AC-1

## 4. Guías afectadas

- [ ] T014 Reescribir `docs/guides/root-folder-practices.md` conservando `slug: root-folder-practices`, con `title: "Raíces del repositorio y layout fijo SDDF"` y las secciones de D-9 (raíces no intercambiables `REPO_ROOT` / layout fijo / `CLI_ROOT` con destinos en `config/runtimes.json`; contrato `SDDF-FIXED-LAYOUT: v1`; diagnóstico con `/skill-preflight`; checklist), retirando «Precedencia canónica», «Configuración versionada» y «Override temporal» y enlazando `artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices` — D-9, AC-1
- [ ] T015 [P] Editar `docs/guides/sddf-commands-pipeline.md` según D-9: reemplazar la sección de las líneas 21–32 por el párrafo de layout fijo; `$SPECS_BASE/` → `docs/` (69–75, 136, 157, 178–180) y → `specs/flow/EPIC-NN-<slug>/epic.md` / `specs/flow/STORY-NNN-<slug>/story.md` (199–200); quitar la nota de la línea 183 — D-9, AC-1
- [ ] T016 [P] Editar `docs/guides/skill-structural-pattern.md` (§3 → «Layout fijo», línea 60 → `docs/templates/`, árbol 126–132) y `docs/guides/organization-of-artifacts.md` (líneas 27–30 y 57–58 al layout fijo sin configurabilidad) según D-9 — D-9, AC-1
- [ ] T017 [P] Editar `docs/guides/harness-eng-agents-orchestration.md` (líneas 36, 170 y 180) y `docs/guides/best-practices-for-skills.md` (líneas 160 y 223) para que los valores resueltos sean `REPO_ROOT` y rutas fijas, sin `SPECS_BASE` — D-9, AC-1
- [ ] T018 [P] Editar el árbol de `docs/guides/flight-leves-model.md` (líneas 55–63) a `specs/flow/` plano con `archive/`, conservando la nota de terminología v1.x de la línea 25 — D-2, D-9, AC-1
- [ ] T019 Editar las filas 43–45 de `docs/guides/README.md` con las descripciones nuevas; la fila de `artifact-directory-migration.md` enlaza además `artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices` (depende de T006 y T014) — D-9, AC-2, AC-3

## 5. Gobernanza, portada y CHANGELOG

- [ ] T020 [P] Editar `docs/constitution.md` según D-9: líneas 136–137 → «Todo skill resuelve una vez `REPO_ROOT` y usa el layout fijo de ADR-0016»; rutas `$SPECS_BASE/…` de las líneas 92–95, 217–223, 237 y 260 → `docs/…` / `specs/flow/…`; actualizar `updated:` — D-3, D-9, AC-1, CNF-1
- [ ] T021 [P] Editar `README.md` raíz según D-9: tablas de las líneas 80–82 y 174, diagnóstico de la línea 156, árbol de las líneas 214–222, ejemplo de configuración 344–347 sin `root: docs` y fila de la línea 364; no tocar las líneas 411–413 (registro histórico) — D-3, D-9, AC-1
- [ ] T022 Añadir como primera subsección de `## [Unreleased]` en `CHANGELOG.md` el encabezado `### BREAKING — layout fijo de tres raíces (EPIC-26, requiere 5.0.0)` con apertura, **Rutas**, **Skills cuyo comportamiento cambió** (solo lo verificado en T005) y **Guía** que enlaza `docs/guides/artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices`; citar sin duplicar el `### Removed` de `docs-wiki-builder`; no tocar `package.json` ni crear `## [5.0.0]` — D-10, AC-2

## 6. Índice y prueba de regresión

- [ ] T023 Regenerar `docs/index.md` con `/memory-system index` (después de T006–T021); comprobar que contiene `## 🗂️ Work items (specs/flow/)` y el título nuevo de `root-folder-practices`; si falta la sección, detener (precondición STORY-152, F-3) — D-6, AC-1
- [ ] T024 [P] Añadir a `test/check-doc-links.test.js` el caso `reports a guide linking to a removed docs/specs path, naming the guide` con el `fixture(t, readme)` existente: crear `docs/guides/legacy.md` con `[story](../specs/stories/STORY-001-x/story.md)` sin destino, ejecutar `checkDocumentation({ repoRoot: root, files: [<legacy.md>] })` y comprobar que hay un error que casa con `^docs/guides/legacy\.md:\d+: Missing local target: docs/specs/stories/STORY-001-x/story\.md$` — D-7, AC-3

## 7. Verificación

- [ ] T025 Contratos 1 y 2: `grep -F` en `AGENTS.md` de `specs/flow/`, `specs/flow/archive/`, `<YYYY-MM-DD>-STORY-NNN-<slug>/`, `specs/living/`, `workflow/`, `docs/requirements/` y `ADR-0016`; `test -e` de cada ruta citada como existente; `docs/specs/01-projects` ausente — AC-1, CNF-1
- [ ] T026 Contrato 3: repetir el `git grep` de T003 y clasificar en `implement-report.md` cada coincidencia restante (registro histórico, título de nodo del índice, guía de migración o frase de retiro/transición); ninguna presenta el mecanismo como vigente — AC-1
- [ ] T027 [P] Contrato 4: `sddf-architecture.md` contiene `specs/flow/` y `workflow/` en §7 y no contiene `docs/specs/`; `docs/index.md` contiene `## 🗂️ Work items (specs/flow/)` — AC-1
- [ ] T028 [P] Contratos 5 y 6: la guía contiene `## Migración a 5.0.0 — layout fijo de tres raíces` y la sección menciona `docs/specs/`, `specs/flow/`, `root` y `SDDF_ROOT`; `## [Unreleased]` contiene `### BREAKING — layout fijo de tres raíces`, `5.0.0` y el enlace con el ancla — AC-2
- [ ] T029 Contratos 7 y 8: `npm test` en verde (incluido el caso de T024) y `npm run verify:links` en verde con la fila de `docs/guides/README.md` validando el ancla — AC-2, AC-3
- [ ] T030 Contrato 9: `npm run verify:repository` termina con código 0; ante un enlace roto, corregir la ruta, nunca el checker ni la prueba (F-2) — AC-3
- [ ] T031 [P] Contratos 10 y 11: `git diff --stat` limitado a los archivos de «Componentes afectados»; `git diff --quiet -- docs/requirements docs/adr docs/specs skills`; revisión de idioma (español) del texto nuevo — Non-Goals, CS-10, CNF-2
- [ ] T032 Registrar en `implement-report.md` el resultado de cada contrato y los CR-001 a CR-003 de `design.md` pendientes de retroalimentar (story.md de STORY-153/154/157, publicación de la versión), y ejecutar `graphify update .` — CNF-1
