---
type: testcases
id: STORY-095
slug: STORY-095-memory-system-index-alias-testcases
title: "Test Cases: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
story: STORY-095
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-095-memory-system-index-alias
---

<!-- Referencias -->
[[STORY-095-memory-system-index-alias]]

# Casos de Prueba: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 10 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 3 |
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
| E2E-001 | End-to-End | memory-system index regenera el índice con wikilinks | Fixture `examples/sddf/` con `constitution.md`, `adr/ADR-0001-x.md`, `guides/sdd.md`, `specs/03-stories/STORY-001-a/{story.md,design.md}` y `templates/` | Se ejecuta `/memory-system index` dos veces | `docs/index.md` contiene `[[constitution]]`, `[[ADR-0001-x]]` (slug del frontmatter), `[[sdd]]` y `[[STORY-001-a]]` agrupados por capa; no contiene `design.md` ni nada de `templates/`; los dos archivos son idénticos salvo `updated` | AC-1, AC-5, D-3, D-4, F-1 |
| E2E-002 | End-to-End | docs-wiki-builder es un alias deprecado | Proyecto con `docs-wiki-builder` instalado y `docs/` con artefactos | Se ejecuta `/docs-wiki-builder --update` | Se muestra "⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.", se invoca `/memory-system index` y el `index.md` resultante es idéntico (salvo `updated`) al de ejecutar `/memory-system index` directamente | AC-2, AC-6, D-5, F-2 |
| E2E-003 | End-to-End | header-aggregation sigue siendo independiente | Framework SDDF instalado; `memory-system` no invocado | Se ejecuta `/header-aggregation docs/specs/03-stories/STORY-001-a/story.md` | El frontmatter estandarizado se aplica con el flujo original del skill, sin referencia ni dependencia de `memory-system` | AC-3, D-6 |
| UT-001 | Unit | detect: precedencia de detección | Fixture con `sddf.config.yaml`, `.specify/` y `openspec/` simultáneos | Se ejecuta `memory-system.js detect --root docs` | Imprime `sddf` | AC-4, D-2, T006 |
| UT-002 | Unit | detect: marcadores de directorio y generic | Fixtures `speckit/`, `openspec/` y uno sin marcadores | Se ejecuta `detect` en cada uno | Imprime `speckit`, `openspec` y `generic` respectivamente | AC-4, D-2, T006 |
| UT-003 | Unit | detect: override y valor no admitido | Fixture `sddf/` | Se ejecuta `detect --harness openspec` y luego `detect --harness foo` | Imprime `openspec`; la segunda orden devuelve exit 2 con mensaje de valor no admitido | AC-4, D-2, T006 |
| UT-004 | Unit | Parser de frontmatter: subconjunto YAML | Archivo con escalar, cadena entre comillas que contiene `:` y lista `- item` | Se parsea el bloque `---` | Devuelve `slug` y `title` correctos y `related` como array; el cuerpo queda intacto | D-3, T007 |
| UT-005 | Unit | Parser de frontmatter: ausente o malformado | Archivo sin `---` inicial y otro con `---` sin cierre | Se parsea | Ambos devuelven `hasFrontmatter=false` sin lanzar excepción | D-3, T007 |
| UT-006 | Unit | Derivación de slug, título y capa | `adr/ADR-0001-x.md` (slug en frontmatter), `guides/sdd.md` (sin slug), `specs/03-stories/STORY-001-a/story.md`, `policies/README.md`, `constitution.md` | Se derivan los nodos | Slugs `ADR-0001-x`, `sdd`, `STORY-001-a`, `policies-index`, `constitution`; capas `adr`, `guides`, `specs-stories`, `policies`, `root`; título del frontmatter o del primer `#` | AC-1, D-3, T007 |
| UT-007 | Unit | Exclusiones del escáner | `docs/` con `index.md`, `specs/.cache/index.json`, `templates/story-template.md`, `STORY-001-a/design.md`, `STORY-001-a/pre-split/story.md` | Se escanean los nodos | Ninguno de esos archivos es nodo; `STORY-001-a/story.md` sí | AC-1, D-3, T007 |
| UT-008 | Unit | index: reproducibilidad, orden y formato | Fixture `sddf/` con nombres en mayúsculas y minúsculas mezcladas | Se ejecuta `index` dos veces | Archivos idénticos salvo `updated`; cada entrada sigue `- [[slug]] — [archivo](ruta) — título`; entradas ordenadas por ruta normalizada con `/` | AC-1, NFR-1, D-4, T008 |
| UT-009 | Unit | index: nodos pendientes, sin frontmatter y dry-run | Fixture con guía que contiene `[[no-existe]]`, `` `[[en-codigo]]` `` inline y `[[sdd|Alias]]`; otra guía sin frontmatter | Se ejecuta `index --dry-run` | La salida incluye `- [[no-existe]] ⚠️ nodo pendiente`, no incluye `en-codigo`, marca la guía sin frontmatter con `⚠️ sin frontmatter`, exit 0 y `index.md` no se escribe | AC-5, D-4, T008 |
| UT-010 | Unit | index: template desalineado | Template sin `{layer:adr}` y fixture con un ADR | Se ejecuta `index` | Exit 2 con mensaje que nombra la capa sin placeholder; `index.md` previo intacto | D-4, T008 |
| IT-001 | Integration | SKILL.md invoca el motor y resume | Fixture `sddf/`, `node` en PATH | Se ejecuta `/memory-system index` | El skill resuelve `SPECS_BASE` por el contrato v1, invoca `scripts/memory-system.js index --root docs` y muestra `nodos indexados N · sin frontmatter M · nodos pendientes K` con los valores del motor | AC-1, D-1, F-1, T012 |
| IT-002 | Integration | Índice de proyecto OpenSpec con raíces externas | Fixture `examples/openspec/` | Se ejecuta `/memory-system index` | `detect` devuelve `openspec`; `docs/index.md` contiene `[[auth]]` y `[[add-login]]` en la sección de artefactos externos; ningún hash bajo `openspec/` cambia | AC-4, AC-5, D-2, F-4, T007 |
| IT-003 | Integration | Degradación sin node en PATH | Entorno sin `node` | Se ejecuta `/memory-system index` | El skill genera el índice inline siguiendo `references/memory-rules.md` y avisa que la reproducibilidad byte a byte no está garantizada | D-1, NFR-2, T012 |
| EV-001 | Eval | memory-system index happy-path | Fixture `sddf/` | Skill invocado con `index` | La salida contiene `nodos indexados:` y el índice contiene `[[STORY-001-a]]` y `[[sdd]]` | AC-1, T001 |
| EV-002 | Eval | memory-system index --dry-run | Fixture `sddf/` | Skill invocado con `index --dry-run` | La salida muestra el índice y `index.md` no se escribe | AC-1, T001 |
| EV-003 | Eval | memory-system sin modo | Cualquier proyecto | Skill invocado sin argumentos | La salida contiene "Modo ensure aún no disponible" y "Modos disponibles: index"; no hay error ni escrituras | AC-7, D-1, F-3, T001 |
| EV-004 | Eval | memory-system fail-fast harness no admitido | Fixture `sddf/` | Skill invocado con `index --harness foo` | La salida contiene el mensaje de valor no admitido y no se escribe `index.md` | AC-4, T001 |
| EV-005 | Eval | docs-wiki-builder alias sin argumentos | `docs/` con artefactos | Skill invocado sin argumentos | La salida contiene el aviso literal de deprecación y la invocación de `memory-system index` | AC-2, AC-6, T003 |
| EV-006 | Eval | docs-wiki-builder alias --dry-run | `docs/` con artefactos | Skill invocado con `--dry-run` | La salida contiene el aviso literal y delega en `memory-system index --dry-run` sin escribir | AC-2, T003 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: las referencias `T-NNN` apuntan al motor
  (T006–T008), al SKILL.md (T012) y a los evals (T001, T003).
- Los tres escenarios Gherkin de `story.md` tienen un E2E 1-a-1 (E2E-001…E2E-003).
- Los requerimientos sin Gherkin se cubren así: AC-4 (harness) en UT-001…UT-003, IT-002 y
  EV-004; AC-5 (nodos pendientes) en UT-009; AC-6 (alias con eval y sin exención) en EV-005,
  EV-006 y el contrato V-9 de `design.md` (comando `verify:eval-inventory`, sin caso propio);
  AC-7 (modo por defecto reservado) en EV-003.
- No hay casos CT ni API: no hay UI ni endpoints. No aplica ST ni PT.
- Los UT se ejecutan con `node --test test/memory-system.test.js` sobre
  `skills/memory-system/examples/`; los EV con `npm run test:eval`.
- Gap aceptado: IT-003 (sin `node`) es de verificación manual; no se automatiza en CI.
- NFR-4 (documentación) y NFR-5 (retirada en 4.0.0) se verifican por revisión y por
  `npm run verify:links` (T026), no con casos de prueba.

## Test Cases Progress for STORY-095

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: memory-system index regenera el índice con wikilinks
- [ ] E2E-002: docs-wiki-builder es un alias deprecado
- [ ] E2E-003: header-aggregation sigue siendo independiente
- [ ] UT-001: detect: precedencia de detección
- [ ] UT-002: detect: marcadores de directorio y generic
- [ ] UT-003: detect: override y valor no admitido
- [ ] UT-004: Parser de frontmatter: subconjunto YAML
- [ ] UT-005: Parser de frontmatter: ausente o malformado
- [ ] UT-006: Derivación de slug, título y capa
- [ ] UT-007: Exclusiones del escáner
- [ ] UT-008: index: reproducibilidad, orden y formato
- [ ] UT-009: index: nodos pendientes, sin frontmatter y dry-run
- [ ] UT-010: index: template desalineado
- [ ] IT-001: SKILL.md invoca el motor y resume
- [ ] IT-002: Índice de proyecto OpenSpec con raíces externas
- [ ] IT-003: Degradación sin node en PATH
- [ ] EV-001: memory-system index happy-path
- [ ] EV-002: memory-system index --dry-run
- [ ] EV-003: memory-system sin modo
- [ ] EV-004: memory-system fail-fast harness no admitido
- [ ] EV-005: docs-wiki-builder alias sin argumentos
- [ ] EV-006: docs-wiki-builder alias --dry-run
