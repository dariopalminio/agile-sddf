---
type: testcases
id: STORY-096
slug: STORY-096-memory-system-scaffold-ensure-rebuild-testcases
title: "Test Cases: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
story: STORY-096
created: 2026-09-20
updated: 2026-09-22
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]

# Casos de Prueba: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 8 |
| CT   | 0 |
| IT   | 4 |
| API  | 0 |
| E2E  | 4 |
| EV   | 6 |

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
| E2E-001 | End-to-End | ensure deja la memoria consistente en un paso | Fixture `examples/sddf-partial/` (sin `product/` ni `requirements/README.md`, `constitution.md` editado a mano) | Se ejecuta `/memory-system` (default) dos veces | Primera corrida crea solo lo faltante, `constitution.md` conserva su hash, `docs/index.md` se regenera y el informe dice `creados 5 · preservados 14 · índice regenerado: sí`; segunda corrida `creados 0` sin errores | AC-1, AC-7, D-3, F-1 |
| E2E-002 | End-to-End | scaffold crea lo faltante y no indexa | Fixture `examples/empty/` (sin `docs/`) | Se ejecuta `/memory-system scaffold` | Existen `constitution.md`, `product/{vision,stakeholders,objectives}.md`, un `README.md` en cada una de las 11 capas y 6 plantillas en `templates/`; `index.md` no existe | AC-2, AC-5, AC-6, D-1, D-2, F-2 |
| E2E-003 | End-to-End | rebuild sin --force se detiene | Fixture `sddf-partial/` ya scaffoldeado | Se ejecuta `/memory-system rebuild` | Se muestra "❌ rebuild es destructivo. Añade --force para confirmar." y todos los hashes de `docs/` permanecen iguales | AC-3, D-4, F-3 |
| E2E-004 | End-to-End | rebuild --force regenera y conserva artefactos de autor | Fixture con `constitution.md` editado, `adr/ADR-0001-x.md` y `guides/sdd.md` | Se ejecuta `/memory-system rebuild --force` | Se muestra "⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán."; `constitution.md` y los README vuelven a la semilla; `ADR-0001-x.md` y `sdd.md` conservan su hash; `index.md` se regenera; ningún archivo desaparece | AC-4, AC-7, D-4, F-3 |
| UT-001 | Unit | scaffold: copia-si-falta | Fixture `empty/` | Se ejecuta `scaffold --root docs --cli-root <cli>` | Se crean todos los archivos del árbol semilla con `[CREADO]`; `{date}` sustituido por la fecha; directorios intermedios creados | AC-2, AC-5, D-1, T006 |
| UT-002 | Unit | scaffold: idempotencia | Fixture `sddf-partial/` | Se ejecuta `scaffold` dos veces | Segunda corrida: todos `[PRESERVADO]`, última línea `creados: 0 · sobrescritos: 0 · preservados: N · omitidos por harness: 0`, hashes iguales, exit 0 | AC-7, NFR-1, D-1, T006, T008 |
| UT-003 | Unit | scaffold --dry-run no escribe | Fixture `empty/` | Se ejecuta `scaffold --dry-run` | Imprime `[CREARÍA]` por archivo; `docs/` sigue sin existir | AC-2, D-1, T006 |
| UT-004 | Unit | scaffold: plantillas compartidas desde el dueño | `--cli-root` con `skills/story-creation/assets/story-template.md` presente | Se ejecuta `scaffold` | `templates/story-template.md` es copia byte a byte del origen; `adr-template.md` proviene de `assets/scaffold/` | AC-6, D-2, T007 |
| UT-005 | Unit | scaffold: dueño de plantilla ausente | `--cli-root` apuntando a un directorio sin skills | Se ejecuta `scaffold` | Emite `[WARNING] template no copiado: story-template.md (skill story-creation no instalado)` (y las otras cuatro), crea `adr-template.md`, exit 0 | AC-6, D-2, T007 |
| UT-006 | Unit | scaffold --force: alcance de sobrescritura | Fixture con `constitution.md` editado, `README.md` de `adr/` editado, `ADR-0001-x.md` y plantilla `story-template.md` editada | Se ejecuta `scaffold --force` | `constitution.md`, `adr/README.md` y `story-template.md` marcados `[SOBRESCRITO]` y restaurados; `ADR-0001-x.md` intacto; informe con `sobrescritos: 3` | AC-4, AC-7, D-4, T006, T007 |
| UT-007 | Unit | Ningún modo elimina archivos | Fixture con archivos extra en cada capa | Se ejecutan `scaffold`, `scaffold --force` y `scaffold --dry-run` | El conteo de archivos nunca disminuye | AC-7, NFR-2, D-4, T003 |
| UT-008 | Unit | scaffold: errores técnicos | Raíz inexistente sin ser bootstrap; `assets/scaffold/` ausente | Se ejecuta `scaffold` | Exit 2 con mensaje que nombra la ruta faltante; sin escrituras | D-1, T006 |
| IT-001 | Integration | ensure = detect → scaffold → index | Fixture `sddf-partial/` con motor completo (STORY-095) | SKILL.md ejecuta `ensure` | El informe combina el resumen de `scaffold` con `índice regenerado: sí`; `index.md` incluye `[[vision]]` y `[[requirements-index]]` recién creados | AC-1, D-3, F-1, T010 |
| IT-002 | Integration | ensure sin modo index disponible | Motor sin subcomando `index` (STORY-095 no implementada) | SKILL.md ejecuta `ensure` | Scaffold se ejecuta; se muestra `⚠️ modo index no disponible — índice no regenerado`; informe `índice regenerado: no`; sin error | D-3, T010 |
| IT-003 | Integration | ensure --fix-frontmatter invoca header-aggregation en batch | Fixture con dos archivos sin frontmatter y uno con frontmatter | Se ejecuta `/memory-system ensure --fix-frontmatter` | `header-aggregation` se invoca con `docs/` y estrategia "saltar todos los conflictos"; los dos archivos reciben frontmatter; el tercero no cambia; sin el flag no hay invocación | AC-8, D-3, D-6, F-4, T010, T014 |
| IT-004 | Integration | rebuild --force = scaffold --force + index | Fixture `sddf-partial/` scaffoldeado y editado | SKILL.md ejecuta `rebuild --force` | Advertencia literal, luego `scaffold --force`, luego `index`; informe con `sobrescritos:`; `index.md` regenerado | AC-4, D-4, F-3, T011 |
| EV-001 | Eval | memory-system ensure happy-path | Fixture `sddf-partial/` | Skill invocado sin modo | La salida contiene `creados:`, `preservados:` e `índice regenerado: sí` | AC-1, T001 |
| EV-002 | Eval | memory-system ensure idempotente | Fixture ya scaffoldeado | Skill invocado sin modo | La salida contiene `creados: 0` y no reporta errores | AC-7, T001 |
| EV-003 | Eval | memory-system scaffold | Fixture `empty/` | Skill invocado con `scaffold` | La salida lista `[CREADO]` para `constitution.md`, `product/vision.md` y `templates/adr-template.md`, y no menciona `index.md` | AC-2, AC-6, T001 |
| EV-004 | Eval | memory-system fail-fast rebuild | Memoria existente | Skill invocado con `rebuild` | La salida contiene "❌ rebuild es destructivo. Añade --force para confirmar." y no hay escrituras | AC-3, T001 |
| EV-005 | Eval | memory-system rebuild --force | Memoria existente | Skill invocado con `rebuild --force` | La salida contiene "⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán." y `sobrescritos:` | AC-4, T001 |
| EV-006 | Eval | memory-system ensure --fix-frontmatter | Fixture con archivos sin frontmatter | Skill invocado con `ensure --fix-frontmatter` | La salida menciona la invocación de `header-aggregation` con "saltar todos los conflictos" | AC-8, T001 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: `T-NNN` apunta al motor (T006–T008), al
  SKILL.md (T010, T011), a `header-aggregation` (T014) y a los evals (T001).
- Los tres escenarios Gherkin de `story.md` (cuatro bloques) tienen E2E 1-a-1: E2E-001
  (ensure), E2E-002 (scaffold), E2E-003 y E2E-004 (los dos bloques de rebuild).
- Los requerimientos sin Gherkin: AC-5 en E2E-002/UT-001; AC-6 en UT-004/UT-005/EV-003;
  AC-7 en UT-002/UT-006/UT-007/EV-002; AC-8 en IT-003/EV-006.
- No hay casos CT ni API. No aplica ST ni PT.
- UT con `node --test test/memory-system.test.js`; EV con `npm run test:eval`.
- IT-002 (motor sin `index`) solo tiene sentido si STORY-096 se implementa antes que
  STORY-095; en caso contrario se marca como no aplicable.
- NFR-6 (documentación) se verifica por revisión y `npm run verify:links` (T020).

## Test Cases Progress for STORY-096

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: ensure deja la memoria consistente en un paso
- [ ] E2E-002: scaffold crea lo faltante y no indexa
- [ ] E2E-003: rebuild sin --force se detiene
- [ ] E2E-004: rebuild --force regenera y conserva artefactos de autor
- [x] UT-001: scaffold: copia-si-falta
- [x] UT-002: scaffold: idempotencia
- [x] UT-003: scaffold --dry-run no escribe
- [x] UT-004: scaffold: plantillas compartidas desde el dueño
- [x] UT-005: scaffold: dueño de plantilla ausente
- [x] UT-006: scaffold --force: alcance de sobrescritura
- [x] UT-007: Ningún modo elimina archivos
- [x] UT-008: scaffold: errores técnicos
- [ ] IT-001: ensure = detect → scaffold → index
- [ ] IT-002: ensure sin modo index disponible
- [ ] IT-003: ensure --fix-frontmatter invoca header-aggregation en batch
- [ ] IT-004: rebuild --force = scaffold --force + index
- [x] EV-001: memory-system ensure happy-path
- [x] EV-002: memory-system ensure idempotente
- [x] EV-003: memory-system scaffold
- [x] EV-004: memory-system fail-fast rebuild
- [x] EV-005: memory-system rebuild --force
- [x] EV-006: memory-system ensure --fix-frontmatter
