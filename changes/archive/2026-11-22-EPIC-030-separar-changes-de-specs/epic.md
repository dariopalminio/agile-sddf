---
type: epic
id: EPIC-030
slug: EPIC-030-separar-changes-de-specs
title: "Separar changes/ de la especificación viva"
status: COMPLETED
substatus: DONE
parent: null
created: 2026-11-18
updated: 2026-11-22
completed: 2026-11-22
version: 6.0.0
related: []
---

# Épica: Separar changes/ de la especificación viva

## Objetivo

Implementar ADR-0023 para que la ubicación distinga el trabajo de cambio de la especificación vigente: los work items y su archivo viven en `changes/` y `specs/` asume directamente la especificación viva, sin el nivel `living/`, conservando identificadores, estados, archivo y confirmaciones humanas.

## Alcance

- ADR-0023 aceptado y ADR-0019 marcado como `SUPERSEDED`.
- Contrato de layout fijo y gate determinista con `changes/`; las rutas `specs/flow` y `specs/living` solo se nombran en la región de diagnóstico de `skill-preflight` y `sddf-init`.
- Scripts (`story-complete`, `epic-complete`, `epic-improve`, `memory-system`, `check-doc-links`, `run-evals`) y sus pruebas sobre `changes/`; mudanza de `specs/flow/` a `changes/` con `git mv`; retiro de `scripts/migrate-specs-to-flow.js`.
- Skills, evals y fixtures sobre `changes/`; `sddf-init` crea el layout nuevo y `skill-preflight` detecta el de 5.x.
- Documentación vigente, guía de migración a 6.0.0 y entrada BREAKING en `CHANGELOG.md`.

## Historias

- [x] **STORY-194** — Aceptar ADR-0023: Como mantenedor de agile-sddf, quiero ADR-0023 aceptado y ADR-0019 reemplazado, para que las demás historias implementen una sola decisión de layout
- [x] **STORY-195** — Contrato de layout y gate determinista con changes/: Como mantenedor, quiero que el contrato `SDDF-FIXED-LAYOUT` de cada skill y `verify-fixed-layout.js` exijan `changes/` y rechacen las rutas retiradas, para que ningún skill vuelva a escribir en `specs/flow/`
- [x] **STORY-196** — Scripts deterministas y mudanza a changes/: Como mantenedor, quiero que los motores de archivo, índice, enlaces y evals usen `changes/` y que los work items de este repositorio se muevan con su historial, para que el gate siga verde tras la mudanza
- [x] **STORY-197** — Skills de especificación y épica sobre changes/: Como Solo Builder, quiero que los skills de especificación y de épica, sus evals y sus fixtures usen `changes/`, para crear, numerar y analizar work items en la raíz nueva
- [x] **STORY-198** — Skills de planning a entrega sobre changes/: Como Solo Builder, quiero que los skills de planning, implementación, revisión, verificación, aceptación, entrega y cierre usen `changes/`, para recorrer el pipeline de historia sin rutas viejas
- [x] **STORY-199** — sddf-init y skill-preflight con el layout de ADR-0023: Como Solo Builder que inicializa o diagnostica un proyecto, quiero que `/sddf-init` cree `changes/` y `specs/` y no escriba ante el layout de 5.x, y que `/skill-preflight` lo detecte, para migrar sin duplicar ubicaciones
- [x] **STORY-200** — Documentación y migración a 6.0.0: Como Solo Builder que actualiza agile-sddf, quiero la documentación vigente con el layout nuevo, una guía de migración a 6.0.0 y la entrada BREAKING del CHANGELOG, para migrar mi proyecto a mano sin perder work items

## Criterios de salida

- [ ] **CS-1** — ADR-0023 tiene `status: ACCEPTED`; ADR-0019 tiene `status: SUPERSEDED`, `superseded-by: ADR-0023` y una nota de reemplazo bajo el título; `docs/decisions/README.md` refleja ambos estados.
- [ ] **CS-2** — `git grep -n -e "specs/flow" -e "specs/living" -- skills scripts test config` solo devuelve líneas de las regiones `SDDF-LEGACY-DIAGNOSTIC` de `skill-preflight` y `sddf-init`, sus evals de layout legado y el propio gate que las prohíbe.
- [ ] **CS-3** — El número de épicas, historias y bugs (activos más archivados) es el mismo antes y después de la mudanza (30 épicas, 183 historias y 3 bugs archivados antes de EPIC-030).
- [ ] **CS-4** — `git log --follow` conserva el historial de un work item archivado movido a `changes/archive/`.
- [ ] **CS-5** — `story-complete` y `epic-complete` archivan en `changes/archive/` y reescriben las referencias de la documentación activa; lo cubren `test/story-complete.test.js` y `test/epic-complete.test.js`.
- [ ] **CS-6** — `/sddf-init` crea `changes/`, `changes/archive/`, `specs/` y `workflow/` y no escribe ante `specs/flow/`; `/skill-preflight` emite las señales L4 y L5.
- [ ] **CS-7** — `docs/index.md` se regeneró con la sección `changes/` y las capas `changes-*`.
- [ ] **CS-8** — La guía de migración tiene la sección «Migración a 6.0.0» y `CHANGELOG.md` la enlaza desde la entrada BREAKING; `npm test` y `npm run verify:repository` pasan.

## Smoke tests

### SMOKE-1 — Archivar una historia en changes/archive/
```gherkin
Escenario: Archivar una historia en changes/archive/
  Dado una historia STORY-NNN en DELIVER/DONE en changes/STORY-NNN-<slug>/
  Cuando el usuario ejecuta /story-complete STORY-NNN y confirma
  Entonces la historia queda en changes/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/ con status COMPLETED y las referencias de docs/index.md apuntan a la ruta archivada
```

### SMOKE-2 — Inicializar un proyecto con el layout nuevo
```gherkin
Escenario: Inicializar un proyecto con el layout nuevo
  Dado un repositorio sin estructura SDDF
  Cuando el usuario ejecuta /sddf-init
  Entonces existen changes/, changes/archive/, specs/ y workflow/ con su .gitkeep y no existe specs/flow/
```

### SMOKE-3 — Diagnosticar un proyecto con el layout de 5.x
```gherkin
Escenario: Diagnosticar un proyecto con el layout de 5.x
  Dado un repositorio con specs/flow/ y specs/living/ y sin changes/
  Cuando el usuario ejecuta /skill-preflight
  Entonces el diagnóstico informa las señales L4 y L5 como [WARNING], remite a la guía de migración y no modifica ningún archivo
```

## Notas

- **Fuente:** [ADR-0023](../../docs/decisions/ADR-0023-separar-changes-de-specs.md) y el plan de implementación de 2026-11-18. Precedente: EPIC-26, que implementó ADR-0016 (`changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/`).
- **Decisiones tomadas (2026-11-18):** se ejecuta como épica propia; las capas de `memory-system` se renombran a `changes-*` (los subdirectorios `epics/` y `stories/` del layout legado `docs/specs/` también usan `changes-epics` y `changes-stories`, para convivir); `scripts/migrate-specs-to-flow.js` se retira y la migración de este repositorio se hace con `git mv specs/flow changes`; los proyectos consumidores migran a mano con la guía y las señales de `skill-preflight`.
- **Región de diagnóstico:** `sddf-init` también detecta el layout legado, así que `verify-fixed-layout.js` admite la región `SDDF-LEGACY-DIAGNOSTIC` en `skill-preflight` y en `sddf-init`.
- **Cómo se implementó:** las siete historias se implementaron en una sola sesión siguiendo el plan, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate. Quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance` de cada historia (o una revisión equivalente que decida el PO) antes de `/epic-validate`.
- **Registros históricos que no se editan:** ADR-0011, ADR-0016, ADR-0017, ADR-0019 (salvo `status`, `superseded-by` y la nota), ADR-0022, las entradas anteriores de `CHANGELOG.md` y el contenido de `changes/archive/`, que conserva las rutas `specs/flow/` con las que se escribió.
- **Release:** cambio BREAKING que lleva a 6.0.0 (hoy 5.3.0); `/epic-ship` completa el bloque de `CHANGELOG.md` y el bump de versión es un paso humano.
- **Fuera de alcance:** el formato de la especificación viva y la consolidación de historias en `specs/` (ADR-0018 y ADR-0020 siguen PROPOSED, solo con las rutas alineadas) y la migración de `docs/requirements/`.
