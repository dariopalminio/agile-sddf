---
type: testcases
id: STORY-098
slug: STORY-098-memory-system-migrate-harness-testcases
title: "Test Cases: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate"
story: STORY-098
created: 2026-09-21
updated: 2026-09-21
related:
  - STORY-098-memory-system-migrate-harness
---

<!-- Referencias -->
[[STORY-098-memory-system-migrate-harness]]

# Casos de Prueba: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 9 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 2 |
| EV   | 4 |

## Tabla de casos

<!-- Reglas de columnas:
  ID      : prefijo-NNN donde prefijo ∈ {UT, CT, IT, API, E2E, EV, ST}; NNN secuencial desde 001
  Tipo    : Unit | Component | Integration | API | End-to-End | Eval | Store
  Escenario: descripción breve en lenguaje natural — no Gherkin estricto
  Dado    : precondición del escenario
  Cuando  : acción que dispara el comportamiento
  Entonces: resultado esperado verificable
  Ref     : AC-N (origen story.md) | D-N / sección X.Y (origen design.md) | T-NNN (origen tasks.md)
-->

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | migrate detecta Speckit y propone antes de escribir | Fixture `examples/speckit/` (`.specify/memory/constitution.md`, `specs/001-login/`, sin `sddf.config.yaml`) | Se ejecuta `/memory-system migrate`, se responde `sí` | Se reporta harness `speckit`; el plan muestra `[OMITIRÍA] specs/`, `[MAPEARÍA] constitution.md → .specify/memory/constitution.md` y `[CREARÍA]` × N; antes de confirmar ningún archivo existe bajo `docs/`; tras confirmar `docs/` tiene 10 capas sin `specs/`, no existe `docs/constitution.md`, y `.specify/` y `specs/` conservan sus hashes | AC-1, AC-3, AC-4, D-2, D-3, F-1 |
| E2E-002 | End-to-End | ensure --harness openspec respeta openspec/ e indexa sus artefactos | Fixture `examples/openspec/` (`openspec/specs/auth/spec.md`, `openspec/changes/add-login/proposal.md`) | Se ejecuta `/memory-system ensure --harness openspec --yes` | `docs/` sin `specs/`; ningún hash bajo `openspec/` cambia; `docs/index.md` contiene `### OpenSpec — specs` con `[[auth…]]` y `### OpenSpec — changes` con `[[add-login]]`; informe `omitidos por harness: 1` | AC-2, AC-3, D-1, D-4, F-2 |
| UT-001 | Unit | Perfiles de harness completos | Motor cargado | Se lee `HARNESS_PROFILES` | `speckit.skipLayers = ['specs']`, `speckit.mappings['constitution.md'] = '.specify/memory/constitution.md'`, `openspec.skipLayers = ['specs']`, `sddf`/`generic` con `skipLayers` y `mappings` vacíos; `externalRoots` sin cambios respecto a STORY-095 | AC-3, D-1, T004 |
| UT-002 | Unit | scaffold omite capas del perfil | Fixture `openspec/` | Se ejecuta `scaffold --harness openspec` | `docs/specs/` no se crea; línea `[OMITIDO] specs/ — gestionado por el harness openspec`; informe `omitidos por harness: 1` | AC-2, AC-3, D-2, T005 |
| UT-003 | Unit | scaffold mapea constitution.md si existe en el harness | Fixture `speckit/` | Se ejecuta `scaffold --harness speckit` | `docs/constitution.md` no se crea; línea `[MAPEADO] constitution.md → .specify/memory/constitution.md`; `.specify/memory/constitution.md` hash intacto; informe `mapeados: 1` | AC-1, AC-3, D-2, T005 |
| UT-004 | Unit | scaffold crea la semilla si el harness no tiene equivalente | Fixture `speckit-sin-constitution/` | Se ejecuta `scaffold --harness speckit` | `docs/constitution.md` creado con `[CREADO]`; informe `mapeados: 0` | AC-3, D-1, T005 |
| UT-005 | Unit | scaffold --dry-run produce el plan con las variantes condicionales | Fixture `speckit/` | Se ejecuta `scaffold --dry-run --harness speckit` | Salida con `[OMITIRÍA]`, `[MAPEARÍA]`, `[CREARÍA]`; nada escrito; misma última línea de resumen | AC-1, NFR-3, D-2, T005 |
| UT-006 | Unit | Idempotencia del scaffold adaptado | Fixture `speckit/` ya scaffoldeado | Se ejecuta `scaffold --harness speckit` de nuevo | `creados: 0`, todo `[PRESERVADO]`/`[MAPEADO]`/`[OMITIDO]`, hashes iguales | NFR-2, D-2, T005 |
| UT-007 | Unit | Guardia de escritura fuera de la raíz | Perfil de prueba cuyo mapping apunta a un destino bajo `openspec/` | Se ejecuta `scaffold` | Exit 2 con `destino fuera de la raíz: <ruta>`; ningún archivo escrito (hashes de todo el fixture iguales) | NFR-1, D-5, F-4, T006 |
| UT-008 | Unit | index agrupa nodos externos y mapeados | Fixtures `openspec/` y `speckit/` | Se ejecuta `index --harness <h>` | `externalGroup` asignado (`openspec-specs`, `openspec-changes`, `speckit-features`, `mapped`); `[[constitution]]` enlaza a `../.specify/memory/constitution.md`; capa `specs` muestra `_(gestionado por el harness)_` | AC-2, D-4, T007, T008 |
| UT-009 | Unit | Colisión de slug externo con nodo de docs/ | Fixture `openspec/` con `docs/guides/auth.md` (`slug: auth`) | Se ejecuta `index --harness openspec` | El nodo de `docs/` conserva `[[auth]]`; el externo aparece como `[[auth-external]]`; aviso en stderr; exit 0 | D-4, CR-002, T007 |
| IT-001 | Integration | migrate = detect → plan → confirmación → scaffold | Fixture `speckit/` | SKILL.md ejecuta `migrate --yes` | El plan mostrado es la salida de `scaffold --dry-run`; tras la confirmación asumida se ejecuta `scaffold --harness speckit` y se sugiere `/memory-system index`; `index` no se invoca | AC-1, AC-4, D-3, T010 |
| IT-002 | Integration | migrate cancelado no escribe | Fixture `speckit/` | SKILL.md ejecuta `migrate` y se responde `no` | Mensaje `Migración cancelada — no se escribió ningún archivo.`; `docs/` no existe | AC-1, AC-4, D-3, T010 |
| IT-003 | Integration | check respeta skipLayers del harness | Fixture `openspec/` scaffoldeado (STORY-097 implementada) | Se ejecuta `check --harness openspec` | No hay `missing-layer` para `specs/`; exit 0 sobre el fixture sano | AC-3, D-1, T003 |
| EV-001 | Eval | memory-system migrate propone sin escribir | Fixture `speckit/` | Skill invocado con `migrate` (sin `--yes`) | La salida contiene `📋 Plan de migración (speckit)`, `[OMITIRÍA] specs/`, `[MAPEARÍA] constitution.md → .specify/memory/constitution.md` y `¿Confirmas el plan de migración?`; sin escrituras | AC-1, AC-4, T001 |
| EV-002 | Eval | memory-system migrate --yes | Fixture `speckit/` | Skill invocado con `migrate --yes` | La salida contiene `mapeados: 1` y `omitidos por harness: 1` | AC-1, AC-3, T001 |
| EV-003 | Eval | memory-system migrate en proyecto SDDF | Fixture `sddf/` | Skill invocado con `migrate` | La salida contiene `El proyecto ya es SDDF`; sin escrituras | AC-4, D-3, F-3, CR-001, T001 |
| EV-004 | Eval | memory-system ensure --harness openspec | Fixture `openspec/` | Skill invocado con `ensure --harness openspec --yes` | La salida contiene `omitidos por harness: 1` y el índice contiene `[[auth` | AC-2, T001 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: `T-NNN` apunta al motor (T004–T008), al
  SKILL.md (T010), a los tests (T003) y a los evals (T001).
- Los dos escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001 migrate/Speckit,
  E2E-002 ensure/OpenSpec).
- Requerimientos sin Gherkin: AC-3 (perfiles) en UT-001…UT-004, IT-003; AC-4 (`migrate` no
  convierte; `--yes`; proyecto SDDF) en IT-001, IT-002, EV-003.
- NFR-1 (seguridad) en UT-007 y por hashes en E2E-001/E2E-002; NFR-2 en UT-006; NFR-3 en
  UT-005; NFR-4 por revisión y `verify:links` (T018).
- IT-003 solo aplica si STORY-097 está implementada; si no, se marca no aplicable.
- No hay casos CT ni API. No aplica ST ni PT.
- UT con `node --test test/memory-system.test.js`; EV con `npm run test:eval`.

## Test Cases Progress for STORY-098

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: migrate detecta Speckit y propone antes de escribir
- [ ] E2E-002: ensure --harness openspec respeta openspec/ e indexa sus artefactos
- [ ] UT-001: Perfiles de harness completos
- [ ] UT-002: scaffold omite capas del perfil
- [ ] UT-003: scaffold mapea constitution.md si existe en el harness
- [ ] UT-004: scaffold crea la semilla si el harness no tiene equivalente
- [ ] UT-005: scaffold --dry-run produce el plan con las variantes condicionales
- [ ] UT-006: Idempotencia del scaffold adaptado
- [ ] UT-007: Guardia de escritura fuera de la raíz
- [ ] UT-008: index agrupa nodos externos y mapeados
- [ ] UT-009: Colisión de slug externo con nodo de docs/
- [ ] IT-001: migrate = detect → plan → confirmación → scaffold
- [ ] IT-002: migrate cancelado no escribe
- [ ] IT-003: check respeta skipLayers del harness
- [ ] EV-001: memory-system migrate propone sin escribir
- [ ] EV-002: memory-system migrate --yes
- [ ] EV-003: memory-system migrate en proyecto SDDF
- [ ] EV-004: memory-system ensure --harness openspec
