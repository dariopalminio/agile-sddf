---
alwaysApply: false
type: tasks
id: STORY-098
slug: STORY-098-memory-system-migrate-harness-tasks
title: "Tasks: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate"
date: 2026-09-21
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-098
design: STORY-098
related:
  - STORY-098-memory-system-migrate-harness
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - memory-system
---

<!-- Referencias -->
[[STORY-098-memory-system-migrate-harness]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (4 ACs, 4 NFRs);
> D-n a las decisiones; F-n a los flujos; V-n a los contratos de verificación; CR-n a los
> cambios registrados. Orden: evals y fixtures (RED) → perfiles y scaffold en el motor →
> índice externo → modo migrate en SKILL.md → documentación → verificación.
> Precondición dura: STORY-095 (detect, index, externalRoots) y STORY-096 (scaffold) ya
> implementadas; esta historia no define degradación (CR-003).

## 1. Evals y fixtures (fase RED)

- [ ] T001 Añadir a skills/memory-system/evals/evals.json los casos: `migrate` sobre
  examples/speckit sin `--yes` (salida contiene `📋 Plan de migración (speckit)`,
  `[OMITIRÍA] specs/`, `[MAPEARÍA] constitution.md → .specify/memory/constitution.md` y la
  pregunta `¿Confirmas el plan de migración?`; sin escrituras); `migrate --yes` (contiene
  `mapeados: 1` y `omitidos por harness: 1`); `migrate` sobre examples/sddf (contiene `El
  proyecto ya es SDDF`); `ensure --harness openspec --yes` sobre examples/openspec (contiene
  `omitidos por harness: 1` y el índice contiene `[[auth]]`) — AC-1, AC-2, AC-4, D-2, D-3,
  V-1, V-2, V-9.
- [ ] T002 [P] Completar los fixtures: examples/speckit/ con `.specify/memory/constitution.md`
  y `specs/001-login/{spec.md,plan.md}`; examples/speckit-sin-constitution/ (solo `.specify/`
  y `specs/`); examples/openspec/ con `openspec/specs/auth/spec.md`,
  `openspec/changes/add-login/proposal.md` y un `docs/guides/auth.md` con `slug: auth` para
  la colisión de CR-002 — AC-1, AC-2, AC-3, D-1, D-4.
- [ ] T003 [P] Añadir a test/memory-system.test.js los casos: `scaffold --harness speckit`
  omite `specs/`, mapea `constitution.md`, hashes de `.specify/` y `specs/` intactos, informe
  con `mapeados: 1 · omitidos por harness: 1`; ×2 → `creados: 0`; speckit sin constitución
  del harness → crea la semilla; `scaffold --harness openspec` + `index` → sin `docs/specs/`,
  hashes de `openspec/` intactos, `index.md` con `[[auth-external]]`/`[[add-login]]` bajo
  subtítulos OpenSpec y aviso de colisión; `check --harness openspec` no reporta `specs/`;
  perfil de prueba con destino fuera de la raíz → exit 2 sin escrituras — AC-2, AC-3,
  NFR-1, NFR-2, NFR-3, V-2…V-8.

## 2. Motor: perfiles de harness y scaffold adaptado

- [ ] T004 Rellenar en skills/memory-system/scripts/memory-system.js las claves
  `skipLayers` y `mappings` de HARNESS_PROFILES según la tabla de D-1 (`speckit`:
  `['specs']` + `constitution.md → .specify/memory/constitution.md`; `openspec`:
  `['specs']`; `sddf`/`generic` vacíos) sin cambiar la forma de la tabla — AC-3, D-1.
- [ ] T005 Modificar el subcomando `scaffold` para aplicar el perfil: filtrar entradas del
  árbol semilla por `skipLayers` (acción `skipped`, `[OMITIDO] <capa>/ — gestionado por el
  harness <h>`), resolver `mappings` con equivalente existente (acción `mapped`, `[MAPEADO]
  <semilla> → <ruta>`, sin crear ni tocar), y las variantes `[OMITIRÍA]`/`[MAPEARÍA]` con
  `--dry-run`; última línea `creados: N · sobrescritos: S · preservados: M · mapeados: X ·
  omitidos por harness: K` — AC-2, AC-3, NFR-3, D-2.
- [ ] T006 Añadir la guardia de escritura: antes de cada escritura de `scaffold` e `index`,
  normalizar el destino y abortar con exit 2 y `destino fuera de la raíz: <ruta>` si no está
  bajo `SPECS_BASE`; verificar que `externalRoots` y `mappings` nunca reciben destino — AC-2,
  AC-3, NFR-1, D-5, F-4.
- [ ] T007 Modificar el subcomando `index`: anotar `node.externalGroup` según el patrón de
  `externalRoots` que originó el nodo (`openspec-specs`, `openspec-changes`,
  `speckit-features`) o `mapped` para archivos de `mappings` existentes (slug de la semilla,
  enlace relativo `../…`); resolver colisiones de slug con el nodo de `docs/` (gana `docs/`,
  el externo recibe sufijo `-external` y aviso en stderr) — AC-2, D-4, CR-002.
- [ ] T008 [P] Actualizar skills/memory-system/assets/index-template.md: la sección
  "Artefactos externos" se rellena con subtítulos por `externalGroup` (`### OpenSpec —
  specs`, `### OpenSpec — changes`, `### Speckit — features`, `### Mapeados desde el
  harness`) y `_(sin artefactos externos)_` si vacío; las capas en `skipLayers` muestran
  `_(gestionado por el harness)_` — AC-2, D-1, D-4.
- [ ] T009 Ejecutar `node --test test/memory-system.test.js` hasta verde (GREEN) y
  refactorizar sin cambiar contratos — V-2…V-8.

## 3. Modo migrate en SKILL.md y referencias

- [ ] T010 Añadir a skills/memory-system/SKILL.md el modo `migrate [--harness h] [--yes]`
  con la secuencia de D-3: detect (si `sddf` → `ℹ️ El proyecto ya es SDDF; usa
  /memory-system ensure.` y fin); `scaffold --dry-run --harness <h>` mostrado bajo `📋 Plan de
  migración (<h>)`; pregunta `¿Confirmas el plan de migración? (sí/no)` asumida con `--yes`;
  `no` → `Migración cancelada — no se escribió ningún archivo.`; `sí` → `scaffold --harness
  <h>` y sugerencia de `/memory-system index`; sin invocar `index` — AC-1, AC-4, NFR-2, D-3,
  F-1, F-3, CR-001.
- [ ] T011 [P] Ampliar skills/memory-system/references/memory-rules.md con la sección
  "Harness" (tabla de perfiles de D-1, semántica de `skipLayers`/`mappings`/`externalRoots`,
  regla de solo lectura, regla de colisión de slug de CR-002) — AC-3, D-1, D-4, D-5.
- [ ] T012 Ejecutar `npm run test:eval -- memory-system` y ajustar SKILL.md hasta que los
  casos de T001 pasen; comprobar que SKILL.md sigue < 500 líneas — V-1, V-2, V-9.

## 4. Documentación y trazabilidad

- [ ] T013 Actualizar docs/architecture/memory-system.md §10 con la tabla de perfiles de
  harness, la semántica de sus claves, el modo `migrate`, la regla "los directorios del
  harness son de solo lectura" y la regla de colisión de slug — NFR-4, D-6, CR-002.
- [ ] T014 [P] Actualizar README.md (párrafo "Compatibilidad con OpenSpec y Speckit" con los
  dos comandos de la verificación sugerida), docs/guides/sddf-commands-pipeline.md §0
  (`migrate` como entrada para proyectos no SDDF) y CHANGELOG.md 3.3.0 (Added `migrate`,
  perfiles de harness) — NFR-4, D-6.
- [ ] T015 Retroalimentar story.md con CR-001 (`migrate` en proyecto `sddf` informa y remite
  a `ensure`) y anotar la dependencia dura de CR-003 en las notas — CR-001, CR-003.

## 5. Verificación de extremo a extremo

- [ ] T016 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system
  (bloques Python en 0, greps sin salida) — V-10.
- [ ] T017 Ejecutar la verificación sugerida de story.md en directorios temporales:
  `/memory-system migrate --harness speckit` en un proyecto con `.specify/` propone un plan
  sin escribir y, confirmado, no crea `docs/specs/`; `/memory-system ensure --harness
  openspec` no cambia ningún hash bajo `openspec/` y el índice enlaza specs y changes —
  AC-1, AC-2, AC-3, V-1, V-2, V-4.
- [ ] T018 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-4, V-10.
