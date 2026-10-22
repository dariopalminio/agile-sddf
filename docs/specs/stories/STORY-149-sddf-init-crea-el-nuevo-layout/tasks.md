---
alwaysApply: false
type: tasks
id: STORY-149
slug: STORY-149-sddf-init-crea-el-nuevo-layout-tasks
title: "Tasks: sddf-init crea el nuevo layout"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-149
design: STORY-149
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-149-sddf-init-crea-el-nuevo-layout
---

<!-- Referencias -->
[[STORY-149-sddf-init-crea-el-nuevo-layout]] · [[STORY-149-sddf-init-crea-el-nuevo-layout-design]]

## 1. Preparación

- [ ] T001 Verificar la precondición de CR-001: `scripts/audit-root-resolution.js` ya no existe, `scripts/verify-fixed-layout.js` existe y exporta `checkSkillLayout` y `PENDING_MIGRATION` (con `sddf-init` incluido) y `scripts/verify-repository.js` declara el paso `contrato de layout fijo`. Si STORY-148 no está integrada, detener la implementación — design CR-001, Risks
- [ ] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-149/baseline.txt` (línea base en verde); guardar también la salida de `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/sddf-init/` (5 archivos esperados) y de `grep -nE "^root:" skills/sddf-init/assets/*` (2 coincidencias esperadas) — design Context, contratos #5, #6

## 2. Prueba determinista (RED)

- [ ] T003 Crear `test/sddf-init-layout.test.js` con `node:test` y `node:assert/strict`, helper `read(relativePath)` sobre `REPO_ROOT` (patrón de `test/sddf-constitution.test.js`) y helper que lista recursivamente los archivos de `skills/sddf-init/` — D-9
- [ ] T004 Añadir los casos de AC-4: «Sin resolución legada» (ningún archivo de `skills/sddf-init/` contiene `SPECS_BASE` ni `SDDF_ROOT`; el mensaje nombra archivo y línea), «Assets sin `root`» (ni `sddf.config.yaml.template` ni `.example` tienen una línea `root:` de primer nivel) y «`.env.template` neutral» (el bloque de contenido del Paso 4 de `SKILL.md` existe, contiene `ADR-0016` y no nombra variables `SDDF_`) — D-4, D-6, D-9, AC-4
- [ ] T005 Añadir los casos de contrato y cobertura: «Contrato de layout» (`checkSkillLayout('sddf-init', SKILL.md)` de `scripts/verify-fixed-layout.js` → `[]`; `PENDING_MIGRATION` no incluye `sddf-init`), «Layout declarado» (`SKILL.md` nombra `specs/flow/archive/`, `specs/living/`, `workflow/`, `.gitkeep`, `Layout legado detectado` y `docs/guides/artifact-directory-migration.md`) y «Evals cubren AC-1 y AC-2» (`evals.json` en `version: "3.0.0"`, un caso con `specs/flow/archive/` en `contains` y otro con `docs/guides/artifact-directory-migration.md`) — D-9, D-10, AC-1, AC-2, CNF-2, CNF-3
- [ ] T006 Ejecutar `node --test test/sddf-init-layout.test.js` y confirmar que falla en todos los casos por el estado actual del skill (RED); registrar la salida en `.tmp/story-implement/STORY-149/red.txt` — CNF-3

## 3. Protocolo de `sddf-init` (GREEN)

- [ ] T007 Editar `skills/sddf-init/SKILL.md` — Paso 1 y reglas: sustituir el bloque `SDDF-ROOT-RESOLUTION: v1` por `### Paso 1 — Resolver contexto local` con `<!-- SDDF-FIXED-LAYOUT: v1 -->` y el texto canónico de STORY-148 D-1 (nombra `REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/`; layout no configurable, ADR-0016); conservar el párrafo de `CLI_ROOT` sin derivarlo del layout; retirar de `## Restricciones / Reglas` «Una fuente de raíz explícita inválida detiene el bootstrap…»; actualizar la `description` del frontmatter («crea el layout fijo specs/flow/, specs/living/ y workflow/») y «Usar cuando» (sin «raíz de artefactos declarada») — D-1, AC-4
- [ ] T008 Añadir `### Paso 1b — Detectar el layout` tras el Paso 1 (la validación de `--level` sigue antes del Paso 1): tabla de cuatro estados `docs/specs/` × `specs/flow/` → limpio / layout fijo / legado / mixto con la acción de D-2, aclarando que solo comprueba existencia de directorios — D-2, AC-1, AC-2, AC-3, CNF-1
- [ ] T009 En el Paso 1b, redactar el aviso de deprecación literal de D-5 (`⚠️ Layout legado detectado: docs/specs/ está deprecado (ADR-0016).` + `   Guía de migración: docs/guides/artifact-directory-migration.md (paquete agile-sddf)`) con la línea de estado legado (`No se crea specs/flow/ ni se modifica docs/specs/. Migra y vuelve a ejecutar /sddf-init.` y fin sin escrituras ni Pasos 2–5b) y la de estado mixto (`Se continúa con el layout fijo existente; docs/specs/ no se modifica.`) — D-5, AC-2, CNF-1
- [ ] T010 Reescribir el Paso 2 como «Crear el layout fijo»: tabla de D-3 (`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` con `.gitkeep` solo al crear; `docs/templates/` sin `.gitkeep`), reglas `[CREADO]`/`[YA EXISTÍA]`, línea `[INFO] El layout fijo ya existe — sin cambios en specs/ ni workflow/` cuando existían los cuatro, «nunca se crea `docs/specs/`», aplicación en los tres niveles y fallo al crear un directorio (ruta + motivo, detener) de F-5; conservar la nota de ADR-0007 con `docs/templates/` literal — D-3, AC-1, AC-3
- [ ] T011 Actualizar los Pasos 2b, 3 y 4: destino de templates `docs/templates/`; Paso 3 sin «ni reemplazar una clave `root` existente»; Paso 4 con el contenido exacto de D-6 para `.env.template` — D-4, D-6, AC-1, AC-4
- [ ] T012 Actualizar los Pasos 5 y 5b: pregunta con `docs/constitution.md` y `docs/guardrails/dod-story-<etapa>.md`; 5b sin `SPECS_BASE` («memory-system usa `docs/` por defecto»; anteponer `docs/` a sus rutas), sin una línea que combine `root` y `sddf.config.yaml` (R4), y nota de que no se alcanza en estado legado — D-7, AC-4
- [ ] T013 Reescribir el Paso 6: ejemplos de informe (`standard`, `minimal`, `full`) con `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`, `docs/templates/…` y sin `specs/epics/`/`specs/stories/` ni `{SPECS_BASE}`; tabla de cierres de D-7 (`✓ Entorno SDDF inicializado correctamente con el layout fijo` [+ ` (nivel <n>)`], `✓ Entorno ya inicializado — sin cambios necesarios`, `⚠️ Entorno no inicializado: migra el layout legado antes de continuar`); ejemplo del informe de estado legado (encabezado, aviso y cierre, sin `[CREADO]`) — D-5, D-7, AC-1, AC-2, AC-3
- [ ] T014 Revisar `skills/sddf-init/SKILL.md` completo: `grep -nE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION"` vacío, ninguna línea con `root` y `sddf.config.yaml` a la vez, `sddf-constitution` sigue mencionado (E2E-002) — D-1, AC-4

## 4. Assets, README, evals y gate

- [ ] T015 [P] Editar `skills/sddf-init/assets/sddf.config.yaml.template`: eliminar la línea de comentario `# Raíz versionada…SDDF_ROOT…` y `root: docs`; cambiar `$SPECS_BASE/guardrails/<slug>.md` por `docs/guardrails/<slug>.md`; nada más — D-4, AC-1, AC-4
- [ ] T016 [P] Editar `skills/sddf-init/assets/sddf.config.yaml.example` con los mismos tres cambios de T015 — D-4, AC-4
- [ ] T017 [P] Editar `skills/sddf-init/README.md` según D-11: retirar las filas `SDDF_ROOT` y `sddf.config.yaml.root` de `## Input`; «bootstrapear una raíz de artefactos declarada» → «crear el layout fijo»; `## Output` con `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` (con `.gitkeep`) y `docs/templates/`; línea del aviso de layout legado; conservar `sddf-constitution` — D-11, AC-4
- [ ] T018 Reescribir `skills/sddf-init/evals/evals.json` (vía `skill-test-evals`, generador de tipo `eval` de `sddf.config.yaml`) según la tabla de D-8: `version: "3.0.0"`, `story: "STORY-149"`, descripción nueva; TC-001 `bootstrap-limpio-crea-layout-fijo`, TC-002 `reejecucion-layout-fijo-idempotente`, TC-003 `layout-legado-avisa-sin-escribir`, TC-004 `layout-mixto-avisa-y-completa`; TC-005–TC-010 con contextos sin `SDDF_ROOT` ni «no existen docs», TC-006 con `specs/flow/` en `contains` y su literal `[OMITIDO] sddf-constitution (nivel minimal)`, TC-010 con layout fijo existente y sin `docs/specs/`; ningún campo con `SPECS_BASE` ni `SDDF_ROOT` — D-8, CNF-2, AC-1, AC-2, AC-3
- [ ] T019 Editar `scripts/verify-fixed-layout.js`: retirar `'sddf-init'` de `PENDING_MIGRATION` sin alterar el orden alfabético del resto — D-10, CNF-3
- [ ] T020 Ejecutar `node --test test/sddf-init-layout.test.js` (GREEN) y `node scripts/verify-fixed-layout.js` → exit 0, sin `sddf-init` entre los pendientes y sin error de higiene — contratos #5, #6, #7, #8

## 5. Verificación

- [ ] T021 Verificar AC-4 con el comando literal: `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/sddf-init/` sin coincidencias; `grep -nE "^root:" skills/sddf-init/assets/*` sin coincidencias; el bloque `.env.template` del Paso 4 sin `SDDF_ROOT` — AC-4, contratos #5, #6
- [ ] T022 Verificar AC-1 en un sandbox (`.tmp/story-implement/STORY-149/ac1/`, repo vacío): seguir el protocolo de `SKILL.md` en nivel `standard` y comprobar que existen `specs/flow/.gitkeep`, `specs/flow/archive/.gitkeep`, `specs/living/.gitkeep`, `workflow/.gitkeep` y `docs/templates/`, que `sddf.config.yaml` no tiene línea `root:` y que no existe `docs/specs/`; registrar el árbol resultante — AC-1, contrato #1
- [ ] T023 Verificar AC-3 sobre el mismo sandbox de T022: segunda ejecución → `[YA EXISTÍA]` en los cuatro directorios, línea `[INFO] El layout fijo ya existe…`, cierre `✓ Entorno ya inicializado — sin cambios necesarios`, y sin cambios de contenido ni de fecha de modificación en `specs/` ni `workflow/` (comparar listados antes/después) — AC-3, contrato #3
- [ ] T024 [P] Verificar AC-2 y CNF-1 en un sandbox (`.tmp/story-implement/STORY-149/ac2/`) con `docs/specs/epics/EPIC-01-x/epic.md`: el protocolo emite el aviso con `docs/guides/artifact-directory-migration.md`, no crea `specs/flow/` ni ningún otro archivo, y `docs/specs/` queda idéntico (hash/listado antes y después); repetir con `specs/flow/` presente (estado mixto) y comprobar aviso + creación solo de lo faltante — AC-2, CNF-1, contratos #2, #4
- [ ] T025 Ejecutar `npm test` → exit 0 (incluye `test/sddf-init-layout.test.js`, E2E-002 y EV-002 de `test/sddf-constitution.test.js` y `test/profile-contract.test.js`) y `npm run verify:repository` → exit 0 — AC-1–AC-4, CNF-3, contratos #7, #9
- [ ] T026 [P] Verificar alcance y encoding: `git diff --stat` solo muestra los 7 archivos de «Componentes afectados» (más artefactos de la historia); los archivos tocados son UTF-8 sin BOM (sin `EF BB BF` inicial; sin `Ã`/`ðŸ`); ejecutar `graphify update .` — contrato #10, AGENTS.md
- [ ] T027 Registrar en `implement-report.md` el resultado de T001 (CR-001), el estado de CR-002 (scaffold de `memory-system` aún crea `docs/specs/` en `--level full` hasta STORY-152) y que la ejecución de `npm run test:eval -- sddf-init` queda a criterio humano (TC-001–TC-004 cubren AC-1–AC-3) — CR-001, CR-002, CNF-2
