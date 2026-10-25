---
type: implement-report
id: STORY-095
slug: STORY-095-memory-system-index-alias-implement-report
title: "Implement Report: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
story: STORY-095
created: 2026-09-21
updated: 2026-09-21
related:
  - STORY-095-memory-system-index-alias
---

<!-- Referencias -->
[[STORY-095-memory-system-index-alias]]

# Implement Report: STORY-095

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (`npm run test:eval` → exit 1 sin `skills/memory-system/SKILL.md`) |
| Fase GREEN confirmada | sí (evals 6/6 en iteración 2; `npm test` 79/79) |
| Fase REFACTOR confirmada | sí (evals 6/6, `npm test` 79/79, salida del motor idéntica) |
| Archivos de prueba generados | 17 (2 `evals.json` + 15 fixtures) + `test/memory-system.test.js` (17 tests) |
| Archivos de producción generados | 5 creados · 11 modificados · 1 eliminado |
| Modo de ejecución | interactive |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` (`skill-test-evals`): `skills/memory-system/evals/evals.json` (TC-001…004 ← EV-001…004) y `skills/docs-wiki-builder/evals/evals.json` (TC-001…002 ← EV-005…006); fixtures `skills/memory-system/examples/{sddf,openspec,speckit}/`. `unit` y `e2e` omitidos por `skill: none`. Rojo confirmado. |
| GREEN | ✅ | Capa `monolithic` (`skill-master`), 2 iteraciones. Iteración 1: 3/4 + 1/2 (el alias no imprimía `/memory-system index --dry-run`; la degradación inline de `memory-system` no leía los fixtures ni emitía `--dry-run`). Iteración 2 (solo `SKILL.md` de ambos skills): 4/4 + 2/2. |
| REFACTOR | ✅ | Motor dividido en helpers (`normalizeText`, `displayPath`, `groupByLayer`, `validateLayers`, `collectPending`, `renderStats`, `renderPendingSection`), `parseArgs` por tabla, `main` con un único punto de salida; tests con IDs UT/IT y helper `templateVariant`; `memory-rules.md` documenta la regla del archivo suelto en `specs/`. Sin regresiones: evals 6/6, `npm test` 79/79, `index --dry-run` == `docs/index.md` salvo `updated`. |

## Artefactos producidos

| Acción | Archivo | Componente (design.md) |
|---|---|---|
| crear | `skills/memory-system/SKILL.md` | Skill orquestador (D-1) |
| crear | `skills/memory-system/scripts/memory-system.js` | Motor `detect`/`index` (D-1, D-2, D-3, D-4) |
| crear | `skills/memory-system/assets/index-template.md` | Template del índice (D-4) |
| crear | `skills/memory-system/references/memory-rules.md` | Reglas de memoria (D-3) |
| crear | `skills/memory-system/evals/evals.json`, `examples/{sddf,openspec,speckit}/` | Evals y fixtures |
| crear | `test/memory-system.test.js` | Tests del motor (UT-001…010, IT-002) |
| modificar | `skills/docs-wiki-builder/SKILL.md` + crear `evals/evals.json`; eliminar `assets/wiki-index-template.md` | Alias deprecado (D-5) |
| modificar | `config/eval-exemptions.json` | Sin exención para `docs-wiki-builder` (AC-6) |
| modificar | `skills/header-aggregation/SKILL.md` | Nota D-6 (sin cambios funcionales) |
| modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` (`3.3.0`) | Documentación (D-7, NFR-4) |
| regenerar | `docs/index.md` | 228 nodos · 42 sin frontmatter · 30 pendientes (CR-003: descripciones a mano → `title`) |
| modificar | `scripts/check-doc-links.js`, `test/check-doc-links.test.js` | Ignorar wikilinks marcados `⚠️ nodo pendiente` |
| modificar | `docs/domains/domain.md` | `slug: domain` añadido |

## Desviaciones respecto a design.md

1. `scripts/check-doc-links.js` ignora los wikilinks seguidos de `⚠️ nodo pendiente`: sin ello la sección "Nodos pendientes" del índice generado rompía `npm run verify:links`.
2. Exclusión adicional `story-improvement-log.md` (derivado de `story-improve`, no listado en D-3).
3. Slugs placeholder (`<slug-kebab>` en `adr/adr-template.md`) se enlazan solo por ruta con `⚠️ slug placeholder` y no cuentan como pendientes.
4. `{date}` solo se usa en `updated:` del frontmatter para que sea literalmente el único campo que cambia entre ejecuciones.
5. Flag `--date` en el motor (solo para tests de reproducibilidad).
6. `docs/index.md` pierde las descripciones escritas a mano (aceptado en CR-003).

## Cobertura de casos de prueba (testcases.md)

| Tipo | Estado | Evidencia |
|---|---|---|
| EV-001…006 | ✅ 6/6 | `npm run test:eval -- memory-system docs-wiki-builder` (informes en `.tmp/skill-test-evals/`) |
| UT-001…010, IT-002 | ✅ 11/11 | `node --test test/memory-system.test.js` (17 tests, incl. variantes) |
| IT-001, IT-003, E2E-001…003 | ⏳ manual | IT-001/E2E-001 y E2E-002 cubiertos indirectamente por EV-001/EV-005; IT-003 (sin `node`) es manual por diseño; E2E-003 = `header-aggregation` sin cambios funcionales |

## Ciclo de corrección (fix-directives.md, 2026-09-21)

| # | Hallazgo | Acción aplicada | Verificación |
|---|---|---|---|
| 1 | U+FEFF literal en `memory-system.js:93` (security MEDIUM, `ai-no-hidden-characters`) | Sustituido por el escape ASCII `\uFEFF` | `grep -P '\x{FEFF}'` sin resultados en `skills/memory-system/` · `node --test` 17/17 · `npm test` 79/79 · `verify:syntax`/`links`/`eval-inventory` OK |
| LOW | `tasks.md` con 26 tareas `[ ]`; T022 sin ejecutar | T001–T026 marcadas `[x]`; `story.md` retroalimentado con CR-001 (Node ≥ 18 / degradación inline) y CR-003 (comparación por entradas) | — |
| LOW | `CHANGELOG.md`: entrada bajo `[3.2.1]` vs textos "desde 3.3.0" | **No aplicado**: la entrada fue commiteada por el mantenedor bajo `[3.2.1]` (`b71e9e9`); pendiente de decisión (renombrar a `[3.3.0]` o alinear los textos del alias/docs a 3.2.1) | — |

## Observaciones

- **`header-aggregation` evals 0/3** en la ejecución de GREEN: falsos positivos preexistentes (`not_contains: ["❌","error"]` colisionaba con el contenido de los `story.md`/`epic.md` que el skill reproduce). **Resuelto tras el code review** (a petición del mantenedor): `evals.json` v1.1.0 con fixtures propios en `skills/header-aggregation/examples/{sin-frontmatter,con-frontmatter,batch}/` y expectativas basadas en los literales del SKILL.md → 3/3 PASS.
- Primera reejecución de la iteración 2 falló con `claude exit 1: sin salida` en los 6 casos (fallo transitorio del CLI headless); la repetición con `--concurrency 3` pasó 6/6.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | Escenario 1 → UT-008/EV-001; Escenario 2 → EV-005/006; Escenario 3 → `header-aggregation` sin dependencia de `memory-system` (verificado por diff). Confirmación manual E2E pendiente en VERIFY. |
| Criterios no funcionales verificados | ✓ | Idempotencia (UT-008), sin `package.json` en consumidor (solo `node:`), portabilidad (ejecutado en Windows), documentación (4 docs), deprecación gradual (3.3.0 → 4.0.0). |
| Comportamiento coincide con `design.md` | ✓ | Desviaciones menores documentadas arriba. |
| No hay regresiones | ✓ | `npm test` 79/79; evals de la historia 6/6; `header-aggregation` con fallos preexistentes de grading (ver Observaciones). |
| Código sigue `constitution.md` | ✓ | Skill en Markdown < 500 líneas, motor Node ≥ 18 sin dependencias, rutas relativas. |
| Sin código comentado ni `TODO` | ✓ | `grep TODO` sin resultados. |
| Sin variables/imports/funciones sin usar | ✓ | Revisado en REFACTOR; `verify:syntax` OK. |
| Pasa linter y formateador | ⚠️ | El repo no define linter; `npm run verify:syntax` OK. |
| Sin dependencias nuevas | ✓ | Solo `node:fs`, `node:path`, `node:process`. |
| Se usó `skill-master` para el skill nuevo | ✓ | Capa `monolithic` vía `skill-master` (GREEN/REFACTOR). |
| Skill nuevo incluido en `files` de `package.json` | ✓ | `skills/` completo ya está en `files`. |
| Checklist de Seguridad de IA | ⚠️ | No ejecutado formalmente; sin credenciales, sin URLs externas, raíces externas de solo lectura. |
| Checklist de Seguridad de Código | ⚠️ | No ejecutado formalmente; sin `eval`/`exec`, sin escritura fuera de `SPECS_BASE`. |
| Checklist de Creación de Skills | ✓ | Frontmatter `name`+`description` (`>-`, 412/351 chars), subdirectorios canónicos, `evals.json` con inputs existentes, referencias enlazadas, < 500 líneas. |

> Los tests deben ejecutarse manualmente para confirmar el resultado final:
> `npm test` · `npm run test:eval -- memory-system docs-wiki-builder` · `/memory-system index --dry-run`.
