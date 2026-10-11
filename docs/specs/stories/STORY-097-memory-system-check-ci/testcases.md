---
type: testcases
id: STORY-097
slug: STORY-097-memory-system-check-ci-testcases
title: "Test Cases: Verificar la consistencia de la memoria con un modo check apto para CI"
story: STORY-097
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-097-memory-system-check-ci
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]

# Casos de Prueba: Verificar la consistencia de la memoria con un modo check apto para CI

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 12 |
| CT   | 0 |
| IT   | 2 |
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
| E2E-001 | End-to-End | check determinista reporta los problemas sin escribir | Fixture `examples/broken/` (sin `product/`, guía sin frontmatter, ADR sin `title`, guía con `[[no-existe]]`) | Se ejecuta `/memory-system check`; luego sobre `examples/sane/` sano (CR-004) | Sobre broken: informe con las cuatro familias, `problemas: 4`, exit 1 y todos los hashes intactos; sobre sano: `problemas: 0` y exit 0 | AC-1, AC-4, D-1, D-4, F-1 |
| E2E-002 | End-to-End | Salida JSON para CI y re-chequeo tras corregir | Copia temporal de `broken/` con solo el wikilink `[[no-existe]]` roto | Se ejecuta `check --json`, se corrige el wikilink y se vuelve a ejecutar | Primera salida: un único objeto con `harness`, `root`, `ok: false`, `summary` con `broken-wikilink: 1` y `problems[0]` con kind/path/detail; exit 1. Segunda: `ok: true`, `problems: []`, exit 0 | AC-2, D-4, F-2 |
| UT-001 | Unit | Evaluador missingLayers | `docs/` sin `product/` ni `constitution.md`, perfil sin `skipLayers` | Se ejecuta `missingLayers(ctx)` | Dos problemas `missing-layer` con `path` `product/` y `constitution.md`, `detail: "capa ausente"` | AC-3, D-1, T005 |
| UT-002 | Unit | missingLayers respeta skipLayers del harness | Perfil con `skipLayers: ['specs']` y `docs/` sin `specs/` | Se ejecuta `missingLayers(ctx)` | No se reporta `specs/` | AC-3, D-1, T005 |
| UT-003 | Unit | Evaluador orphans | Nodos con y sin frontmatter | Se ejecuta `orphans(ctx)` | Un `orphan` por nodo con `hasFrontmatter=false`, `detail: "sin frontmatter"` | AC-3, D-1, T005 |
| UT-004 | Unit | Evaluador invalidFrontmatter: campos por tipo | Guía con `type/slug/title` sin `id`; historia con `type: story` sin `status`; ADR sin `title` | Se ejecuta `invalidFrontmatter(ctx)` | La guía no genera problema; la historia genera `falta status`; el ADR genera `falta title` (un problema por campo) | AC-3, D-3, T005 |
| UT-005 | Unit | Evaluador brokenWikilinks contra slugSet con raíces externas | Fixture `openspec/`: nodos con `[[intro]]` (existe), `[[no-existe]]` y `[[auth]]` (existe en raíz externa openspec) | Se ejecuta `brokenWikilinks(ctx)` | Un único `broken-wikilink` para `[[no-existe]]`, `detail: "[[no-existe]] no resuelve"` | AC-3, D-1, D-2, T005 |
| UT-006 | Unit | Extracción de wikilinks: código, alias, anclas y placeholders | Guía con `` `[[en-codigo]]` ``, fence con `[[en-fence]]`, `[[sdd|Alias]]`, `[[sdd#sec]]`, `[[<slug>]]` | Se extraen `node.wikilinks` | Resultado `['sdd', 'sdd']`; nada de código, ni vacíos, ni `<slug>` | AC-3, D-2, T004 |
| UT-007 | Unit | templates/ y excluidos no se evalúan | Fixture `broken/`: `templates/story-template.md` con `[[<slug>]]` y `STORY-001-a/design.md` con `[[x]]` | Se ejecuta `check` | El único `broken-wikilink` es el `[[no-existe]]` deliberado del fixture (`summary['broken-wikilink'] === 1`); ningún problema procede de `templates/` ni de un derivado, y ninguno cita `en-codigo`, `en-fence`, `<slug>`, `[[x]]` ni `[[real]]` | AC-3, D-2, T004 |
| UT-008 | Unit | Salida JSON estable y ordenada | Fixture `broken/` | Se ejecuta `check --json` dos veces | stdout parseable, claves en orden `harness, root, ok, summary, problems`; `problems` ordenado por (kind, path, detail); las dos salidas son byte a byte idénticas | AC-2, NFR-1, D-4, T006 |
| UT-009 | Unit | Solo lectura | Fixture `broken/` con hashes registrados | Se ejecuta `check` y `check --json` | Ningún hash cambia; no aparecen archivos nuevos | AC-4, D-1, T006 |
| UT-010 | Unit | Errores técnicos → exit 2 | `--root no-existe`; `--harness foo` | Se ejecuta `check` con y sin `--json` | Exit 2; stderr con `raíz inexistente` / `harness no admitido`; con `--json` stdout es `{ "ok": false, "error": "…" }` y nada más | AC-4, D-4, F-3, T006 |
| UT-011 | Unit | Rendimiento sobre este repositorio | `docs/` del repositorio (~300 `.md`) | Se ejecuta `check --root docs --json` con temporizador | Termina en menos de 5 s | NFR-2, D-1, T007 |
| UT-012 | Unit | Sobre JSON en error de parseo y exit 2 ante error inesperado | `check --json` sin `--root`; y un fallo de lectura simulado durante el escaneo | Se ejecuta `check` con y sin `--json`, y `main` con `fs.readdirSync` lanzando | Con `--json` stdout lleva `{ "ok": false, "error": "falta --root…" }` en una sola línea y exit 2; sin `--json` stdout vacío y exit 2; el error inesperado dentro de `check` termina con exit 2, no con 1 | AC-2, AC-4, D-4, CR-008 |
| IT-001 | Integration | SKILL.md propaga stdout y exit code | Fixture `broken/`, `node` en PATH | Se ejecuta `/memory-system check --json` | El skill reenvía el JSON sin añadir texto y termina con exit 1; sobre el fixture sano, exit 0 | AC-1, AC-2, D-5, T008 |
| IT-002 | Integration | Degradación sin node en PATH | Entorno sin `node` | Se ejecuta `/memory-system check` | Informe textual generado inline con las cuatro reglas y aviso "⚠️ node no disponible — sin exit code; no usar en CI" | NFR-3, D-5, F-4, T008 |
| EV-001 | Eval | memory-system check con problemas | Fixture `broken/` | Skill invocado con `check` | La salida contiene `[missing-layer]`, `[orphan]`, `[invalid-frontmatter]`, `[broken-wikilink]` y `problemas: 4`; exit 1 | AC-1, T001 |
| EV-002 | Eval | memory-system check --json | Fixture `broken/` | Skill invocado con `check --json` | La salida contiene `"ok": false` y `"broken-wikilink"` | AC-2, T001 |
| EV-003 | Eval | memory-system check sano | Fixture `sane/` (CR-004) | Skill invocado con `check` | La salida contiene `problemas: 0`; exit 0 | AC-1, T001 |
| EV-004 | Eval | memory-system check fail-fast raíz inexistente | Sin `docs/` | Skill invocado con `check --root no-existe` | stderr contiene `raíz inexistente`; exit 2; sin escrituras | AC-4, T001 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: `T-NNN` apunta al motor (T004–T007), al
  SKILL.md (T008) y a los evals (T001).
- Los dos escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001, E2E-002).
- Requerimientos sin Gherkin: AC-3 (familias y exclusiones) en UT-001…UT-007; AC-4 (solo
  lectura, exit 2) en UT-009, UT-010, UT-012 y EV-004.
- NFR-1 en UT-008; NFR-2 en UT-011; NFR-3 en IT-002 (verificación manual, no automatizada en
  CI); NFR-4 implícito en UT-008 (`path` con `/`); NFR-5 por revisión y `verify:links` (T016).
- No hay casos CT ni API. No aplica ST; PT se cubre con UT-011 sin prefijo propio.
- UT con `node --test test/memory-system.test.js`; EV con `npm run test:eval`.
- **IT-001** no tiene test propio: está cubierto de facto por EV-001…EV-004 (que ejercitan el
  skill completo y su exit code) y por E2E-001/E2E-002 en la capa del motor. Se deja sin marcar
  para no declarar una ejecución que no ocurrió.
- **IT-002** es **verificación manual no automatizable en CI**: exige un entorno sin `node` en
  PATH, que el runner no puede producir. La degradación está escrita en `SKILL.md` §3.5.
- **Hueco conocido en UT-010**: AC-4 enumera tres causas de exit 2, pero UT-010 solo ejercita
  `raíz inexistente` y `--harness` no admitido. La guarda `runtime incompatible` de
  `assertRuntime()` no tiene aserción — no se puede bajar la versión de Node del runner —, así
  que es verificación manual. UT-012 cubre las dos causas añadidas por CR-008.

## Test Cases Progress for STORY-097

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [x] E2E-001: check determinista reporta los problemas sin escribir
- [x] E2E-002: Salida JSON para CI y re-chequeo tras corregir
- [x] UT-001: Evaluador missingLayers
- [x] UT-002: missingLayers respeta skipLayers del harness
- [x] UT-003: Evaluador orphans
- [x] UT-004: Evaluador invalidFrontmatter: campos por tipo
- [x] UT-005: Evaluador brokenWikilinks contra slugSet con raíces externas
- [x] UT-006: Extracción de wikilinks: código, alias, anclas y placeholders
- [x] UT-007: templates/ y excluidos no se evalúan
- [x] UT-008: Salida JSON estable y ordenada
- [x] UT-009: Solo lectura
- [x] UT-010: Errores técnicos → exit 2
- [x] UT-011: Rendimiento sobre este repositorio
- [x] UT-012: Sobre JSON en error de parseo y exit 2 ante error inesperado
- [ ] IT-001: SKILL.md propaga stdout y exit code — sin test propio; cubierto de facto por EV-001…EV-004 y por E2E-001/E2E-002
- [ ] IT-002: Degradación sin node en PATH — verificación manual, no automatizable en CI
- [x] EV-001: memory-system check con problemas
- [x] EV-002: memory-system check --json
- [x] EV-003: memory-system check sano
- [x] EV-004: memory-system check fail-fast raíz inexistente
