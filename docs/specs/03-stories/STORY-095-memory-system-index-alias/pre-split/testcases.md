---
type: testcases
id: STORY-095
slug: STORY-095-memory-system-unificado-testcases
title: "Test Cases: Unificar la gestión de memoria en un skill memory-system con modos"
story: STORY-095
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-095-memory-system-unificado
---

<!-- Referencias -->
[[STORY-095-memory-system-unificado]]

# Casos de Prueba: Unificar la gestión de memoria en un skill memory-system con modos

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 14 |
| CT   | 0 |
| IT   | 5 |
| API  | 0 |
| E2E  | 10 |
| EV   | 9 |

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
| E2E-001 | End-to-End | Alias deprecado delega en memory-system index | Proyecto con `docs-wiki-builder` instalado y `docs/` con artefactos | Se ejecuta `/docs-wiki-builder` | Se muestra "⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.", se invoca `/memory-system index` y el `docs/index.md` resultante es idéntico (salvo `updated`) al de `/memory-system index` directo | AC-1, D-7, F-4 |
| E2E-002 | End-to-End | ensure deja la memoria consistente en un paso | Fixture `examples/sddf-partial/` (sin `product/` ni `requirements/README.md`) | Se ejecuta `/memory-system` (modo `ensure` default) | Se crean solo las capas/archivos faltantes, no se sobrescribe ningún archivo existente, se regenera `docs/index.md` y el informe final dice `creados N · preservados M · índice regenerado: sí` | AC-2, D-6, F-1 |
| E2E-003 | End-to-End | scaffold crea lo faltante y no indexa | Proyecto sin `docs/constitution.md` ni `docs/product/`, con `index.md` previo | Se ejecuta `/memory-system scaffold` | Existen `constitution.md`, `product/{vision,stakeholders,objectives}.md`, un `README.md` por capa faltante y 6 plantillas en `docs/templates/`; `docs/index.md` conserva su hash previo | AC-3, D-3 |
| E2E-004 | End-to-End | check determinista apto para CI | Fixture con una capa faltante, un archivo sin frontmatter, un wikilink roto y un frontmatter sin `title` | Se ejecuta `/memory-system check` | No se escribe ningún archivo (hashes intactos), el informe lista las cuatro familias y el exit code es 1; sobre un fixture sano el exit code es 0 | AC-4, D-5, F-2 |
| E2E-005 | End-to-End | migrate detecta Speckit y propone antes de escribir | Fixture `examples/speckit/` con `.specify/` y sin `sddf.config.yaml` | Se ejecuta `/memory-system migrate` | Se reporta harness `speckit`, se muestra el plan (capas a crear, archivos a preservar, `constitution.md` mapeado a `.specify/memory/constitution.md`), no se escribe nada antes de la confirmación; al confirmar se ejecuta `scaffold` adaptado sin crear `docs/specs/` | AC-5, D-2, F-3 |
| E2E-006 | End-to-End | rebuild sin --force se detiene | Proyecto con memoria existente | Se ejecuta `/memory-system rebuild` | Se muestra "❌ rebuild es destructivo. Añade --force para confirmar." y ningún archivo cambia (hashes intactos) | AC-6, D-6, F-5 |
| E2E-007 | End-to-End | rebuild --force regenera y advierte | Proyecto con `constitution.md` editado a mano y un `ADR-0001-*.md` | Se ejecuta `/memory-system rebuild --force` | Se emite la advertencia de pérdida de cambios manuales, `constitution.md` y los README semilla vuelven al contenido plantilla, `ADR-0001-*.md` se conserva intacto y `docs/index.md` se regenera | AC-7, D-6, F-5 |
| E2E-008 | End-to-End | sddf-init --level full invoca scaffold | Directorio temporal sin `sddf.config.yaml` | Se ejecuta `/sddf-init --level full` | Se crean `sddf.config.yaml`, `.env.template`, `specs/01..03`, `templates/`; al final se invoca `memory-system scaffold` y el listado de archivos resultante es idéntico al de `/sddf-init` seguido de `/memory-system scaffold` | AC-8, AC-16, D-8 |
| E2E-009 | End-to-End | ensure --harness openspec respeta openspec/ | Fixture `examples/openspec/` con `openspec/specs/auth/spec.md` y `openspec/changes/add-login/proposal.md` | Se ejecuta `/memory-system ensure --harness openspec` | Se crean las capas bajo `docs/` sin `docs/specs/`, nada cambia bajo `openspec/` (hashes intactos) y `docs/index.md` contiene wikilinks `[[auth]]` y `[[add-login]]` en la sección de artefactos externos | AC-9, AC-13, D-2, D-4 |
| E2E-010 | End-to-End | header-aggregation sigue siendo independiente | Framework SDDF instalado; `memory-system` no invocado | Se ejecuta `/header-aggregation --file docs/specs/03-stories/STORY-001/story.md` | El frontmatter estandarizado se aplica sin referencia ni dependencia de `memory-system`; el skill conserva su flujo original | AC-10, D-9 |
| UT-001 | Unit | detect: precedencia de detección | Fixture con `sddf.config.yaml`, `.specify/` y `openspec/` simultáneos | Se ejecuta `memory-system.js detect --root docs` | Imprime `sddf` (config gana sobre marcadores de directorio) | AC-13, D-2, T007 |
| UT-002 | Unit | detect: override y generic | Fixture sin marcadores | Se ejecuta `detect` sin flag y luego con `--harness openspec` | Imprime `generic` y luego `openspec`; un valor no admitido (`--harness foo`) devuelve exit 2 | AC-13, D-2, T007 |
| UT-003 | Unit | Parser de frontmatter: subconjunto YAML | Archivo con escalares, cadena entre comillas con `:` y lista `- item` | Se parsea el bloque `---` | Devuelve `type`, `slug`, `title` correctos y la lista `related` como array; contenido debajo del bloque queda intacto | D-4, D-5, T008 |
| UT-004 | Unit | Parser de frontmatter: sin bloque o bloque malformado | Archivo sin `---` inicial y otro con `---` sin cierre | Se parsea | El primero devuelve `hasFrontmatter=false`; el segundo se trata como sin frontmatter (no lanza excepción) | D-5, T008 |
| UT-005 | Unit | Derivación de slug | Archivos `docs/adr/ADR-0001-x.md` (con `slug` en frontmatter), `docs/guides/sdd.md` (sin slug), `docs/specs/03-stories/STORY-001-a/story.md`, `docs/policies/README.md` | Se deriva el slug de cada uno | Devuelve el slug del frontmatter, `sdd`, `STORY-001-a` y `policies-index` respectivamente | D-4, T008 |
| UT-006 | Unit | Exclusiones del escáner | `docs/` con `specs/.cache/index.json`, `templates/story-template.md`, `index.md` y `STORY-001-a/design.md` | Se escanean los nodos indexables | Ninguno de esos archivos aparece como nodo; `story.md` sí | D-4, T008 |
| UT-007 | Unit | scaffold copia-si-falta e idempotencia | Fixture `sddf-partial/` | Se ejecuta `scaffold --root docs` dos veces | Primera corrida: `creados: N>0`; segunda: `creados: 0 · preservados: N+M`, mismos hashes y exit 0 | AC-3, AC-12, NFR-1, NFR-2, D-3, T009 |
| UT-008 | Unit | scaffold --dry-run no escribe | Fixture `generic/` vacío | Se ejecuta `scaffold --dry-run` | Imprime el plan `[CREADO]` por archivo y ningún archivo aparece en disco | AC-5, D-6, T009 |
| UT-009 | Unit | scaffold: template compartido sin dueño instalado | `CLI_ROOT/skills/` sin `story-creation/` | Se ejecuta `scaffold` | Emite `[WARNING] template no copiado: story-template.md (skill story-creation no instalado)`, continúa y exit 0 | D-3, T009 |
| UT-010 | Unit | index: reproducibilidad y formato de entrada | Fixture sano con nodos en varias capas | Se ejecuta `index` dos veces | Ambos `index.md` son idénticos salvo `updated`; cada entrada sigue `- [[slug]] — [archivo](ruta) — título`, ordenadas por ruta | AC-1, AC-15, NFR-1, D-4, T010 |
| UT-011 | Unit | index: marcadores de advertencia y placeholder faltante | Nodo sin frontmatter y template sin `{layer:adr}` | Se ejecuta `index` | El nodo aparece con `⚠️ sin frontmatter`; con el template incompleto devuelve exit 2 sin escribir | AC-15, D-4, T010 |
| UT-012 | Unit | check: cuatro familias en JSON | Fixture con un problema de cada familia | Se ejecuta `check --json` | El JSON tiene `ok:false`, `summary` con 1 por familia, un `problem` por cada uno con `kind`, `path`, `detail`; exit 1 | AC-4, AC-18, D-5, T011 |
| UT-013 | Unit | check: fixture sano y solo lectura | Fixture sano | Se ejecuta `check` y `check --json` | Exit 0, `ok:true`, `problems: []`; los hashes de todos los archivos permanecen iguales | AC-4, AC-18, D-5, T011 |
| UT-014 | Unit | check: wikilinks en código y alias se ignoran | Guía con `` `[[slug]]` `` inline, fence con `[[otro]]`, y `[[real|Alias]]` / `[[real#sec]]` con `real` existente | Se ejecuta `check` | No se reporta ningún `broken-wikilink` | AC-4, D-5, T011 |
| IT-001 | Integration | ensure = scaffold + index | Fixture `sddf-partial/` | SKILL.md ejecuta la secuencia `detect → scaffold → index` | El informe final combina el resumen de `scaffold` con `índice regenerado: sí` y `docs/index.md` incluye los archivos recién creados | AC-2, D-6, F-1, T018 |
| IT-002 | Integration | ensure --fix-frontmatter invoca header-aggregation en batch | Fixture con dos archivos sin frontmatter y uno con frontmatter | Se ejecuta `/memory-system ensure --fix-frontmatter --yes` | `header-aggregation` procesa solo los dos archivos sin frontmatter con la estrategia "saltar conflictos"; el archivo con frontmatter no cambia; sin el flag no se invoca | AC-17, D-6, D-9, T018 |
| IT-003 | Integration | sddf-init full concatena el informe de scaffold | Directorio temporal vacío | Se ejecuta `/sddf-init --level full` | El informe de `sddf-init` termina con las líneas `[CREADO]/[PRESERVADO]` del scaffold y los cinco templates compartidos aparecen como `[PRESERVADO]` (ya copiados por sddf-init) | AC-8, D-8, T022 |
| IT-004 | Integration | Alias mapea argumentos al modo index | `docs/` con índice existente | Se ejecuta `/docs-wiki-builder --dry-run` | Se muestra el aviso de deprecación y se invoca `memory-system index --dry-run`: plan mostrado, `index.md` sin cambios | AC-1, D-7, T020 |
| IT-005 | Integration | Degradación sin node en PATH | Entorno donde `node` no está disponible | Se ejecuta `/memory-system ensure` y `/memory-system check` | `ensure` completa inline con las mismas reglas y lo indica; `check` emite el informe textual y avisa que no hay exit code | D-1, NFR-3, T017 |
| EV-001 | Eval | memory-system happy-path ensure | Fixture `sddf-partial/` | Skill invocado con `ensure` | La salida contiene `creados:`, `preservados:` e `índice regenerado: sí` | AC-2, D-6, T001 |
| EV-002 | Eval | memory-system fail-fast rebuild | Memoria existente | Skill invocado con `rebuild` sin `--force` | La salida contiene "❌ rebuild es destructivo. Añade --force para confirmar." y no hay escrituras | AC-6, D-6, T001 |
| EV-003 | Eval | memory-system check con exit code | Fixture con wikilink roto | Skill invocado con `check --json` | La salida contiene `"ok": false` y `broken-wikilink`; exit 1 | AC-4, AC-18, T001 |
| EV-004 | Eval | memory-system migrate sin escritura | Fixture `speckit/` | Skill invocado con `migrate` (sin `--yes`) | La salida contiene `speckit`, el plan y la pregunta de confirmación; sin escrituras | AC-5, T001 |
| EV-005 | Eval | memory-system harness openspec | Fixture `openspec/` | Skill invocado con `ensure --harness openspec --yes` | La salida contiene `omitidos por harness: 1` (capa `specs/`) y `docs/index.md` enlaza `[[auth]]` | AC-9, AC-13, T001 |
| EV-006 | Eval | docs-wiki-builder alias happy-path | `docs/` con artefactos | Skill invocado sin argumentos | La salida contiene el aviso literal de deprecación y la invocación de `memory-system index` | AC-1, AC-11, T003 |
| EV-007 | Eval | sddf-init --level minimal | Directorio vacío | Skill invocado con `--level minimal` | El informe no contiene `templates/*.md` ni la pregunta de políticas; contiene `sddf.config.yaml` y `.env.template` | AC-16, D-8, T004 |
| EV-008 | Eval | sddf-init default = standard | Directorio vacío | Skill invocado sin `--level` | El informe coincide con el comportamiento previo (templates copiados, pregunta de políticas) y no invoca `memory-system` | AC-16, D-8, T004 |
| EV-009 | Eval | sddf-init --level full | Directorio vacío | Skill invocado con `--level full` | El informe contiene la invocación a `memory-system scaffold` y su resumen `creados:` | AC-8, AC-16, D-8, T004 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: las referencias `T-NNN` apuntan a las tareas del
  motor (T007–T011), del SKILL.md (T017–T018), de integraciones (T020, T022) y de evals
  (T001, T003, T004).
- Los diez escenarios Gherkin de `story.md` tienen un E2E 1-a-1 (E2E-001…E2E-010). AC-6 y
  AC-7 provienen de los dos bloques del escenario `rebuild`.
- Los requerimientos sin escenario Gherkin (AC-11…AC-18) se cubren por UT/IT/EV: AC-11 en
  EV-006 e IT-004; AC-12 en UT-007 y UT-010; AC-13 en UT-001/UT-002; AC-14 en E2E-003;
  AC-15 en UT-010/UT-011; AC-16 en EV-007…EV-009; AC-17 en IT-002; AC-18 en UT-012/UT-013.
- No hay casos CT ni API: el sistema no tiene UI ni endpoints. No aplica ST ni PT.
- Los UT del motor se ejecutan con `node --test test/memory-system.test.js` (T005) sobre los
  fixtures de `skills/memory-system/examples/`; los EV con `npm run test:eval`.
- Gap aceptado: IT-005 (degradación sin `node`) es de verificación manual; requiere un
  entorno sin Node y no se automatiza en CI.
- NFR-5 (documentación) y NFR-6 (retirada en `4.0.0`) se verifican por revisión (T027,
  T033 con `npm run verify:links`), no con casos de prueba.

## Test Cases Progress for STORY-095

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: Alias deprecado delega en memory-system index
- [ ] E2E-002: ensure deja la memoria consistente en un paso
- [ ] E2E-003: scaffold crea lo faltante y no indexa
- [ ] E2E-004: check determinista apto para CI
- [ ] E2E-005: migrate detecta Speckit y propone antes de escribir
- [ ] E2E-006: rebuild sin --force se detiene
- [ ] E2E-007: rebuild --force regenera y advierte
- [ ] E2E-008: sddf-init --level full invoca scaffold
- [ ] E2E-009: ensure --harness openspec respeta openspec/
- [ ] E2E-010: header-aggregation sigue siendo independiente
- [ ] UT-001: detect: precedencia de detección
- [ ] UT-002: detect: override y generic
- [ ] UT-003: Parser de frontmatter: subconjunto YAML
- [ ] UT-004: Parser de frontmatter: sin bloque o bloque malformado
- [ ] UT-005: Derivación de slug
- [ ] UT-006: Exclusiones del escáner
- [ ] UT-007: scaffold copia-si-falta e idempotencia
- [ ] UT-008: scaffold --dry-run no escribe
- [ ] UT-009: scaffold: template compartido sin dueño instalado
- [ ] UT-010: index: reproducibilidad y formato de entrada
- [ ] UT-011: index: marcadores de advertencia y placeholder faltante
- [ ] UT-012: check: cuatro familias en JSON
- [ ] UT-013: check: fixture sano y solo lectura
- [ ] UT-014: check: wikilinks en código y alias se ignoran
- [ ] IT-001: ensure = scaffold + index
- [ ] IT-002: ensure --fix-frontmatter invoca header-aggregation en batch
- [ ] IT-003: sddf-init full concatena el informe de scaffold
- [ ] IT-004: Alias mapea argumentos al modo index
- [ ] IT-005: Degradación sin node en PATH
- [ ] EV-001: memory-system happy-path ensure
- [ ] EV-002: memory-system fail-fast rebuild
- [ ] EV-003: memory-system check con exit code
- [ ] EV-004: memory-system migrate sin escritura
- [ ] EV-005: memory-system harness openspec
- [ ] EV-006: docs-wiki-builder alias happy-path
- [ ] EV-007: sddf-init --level minimal
- [ ] EV-008: sddf-init default = standard
- [ ] EV-009: sddf-init --level full
