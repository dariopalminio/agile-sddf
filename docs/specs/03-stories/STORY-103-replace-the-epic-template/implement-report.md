---
type: implement-report
id: STORY-103
story: STORY-103
created: 2026-10-06
updated: 2026-10-06
---

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (generación); ejecución en rojo no confirmada: `defaults.eval.command` no declarado |
| Fase GREEN confirmada | sí (verificación determinista: `npm test` 218/218) |
| Fase REFACTOR confirmada | sí (sin regresiones) |
| Archivos de prueba generados | 2 nuevos (`test/epic-template.test.js` + fixtures) · 6 `evals.json` modificados |
| Archivos de producción generados | 15 nuevos · 42 modificados en GREEN · 4 refactorizados |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | `eval` → `skill-test-evals`: EV-001…EV-019 en 6 `evals.json` (epic-format-validation, epic-creation, epic-from-project-plan, epic-generate-stories, epic-generate-all-stories, story-implement). `unit`/`e2e` omitidos (`skill: none`). Rojo de evals no ejecutado (sin comando en `defaults`; los evals con LLM no se corrieron). Por decisión del usuario, GREEN escribió primero `test/epic-template.test.js` (UT-001…UT-022, IT-001) y confirmó rojo (`MODULE_NOT_FOUND` de `epic-template.js`) antes del código de producción. |
| GREEN | ✅ | `monolithic` → `skill-master`: template v2 (central == seed, 40 líneas), `skills/memory-system/scripts/epic-template.js` + motor (`migrate --from epic-template-v1`), gate, productores, editores (`story-implement` 11d, `story-implement-tasks` 4c), `domain-epic-lifecycle` §9, CHANGELOG. 22 épicas migradas con el motor; 70 `[REVISAR]` resueltos a mano; `--dry-run` final: `cambios pendientes: 0`, exit 0. |
| REFACTOR | ✅ | `epic-template.js` (helpers `stripComments`/`uncommentedLines`, `SECTION_MIGRATIONS` como `Map`), helpers en el test, `memory-system/SKILL.md` 509 → 499 líneas, §9 del dominio completado. Sin regresiones: `npm test` 218/218, `verify:links`, `test:eval:runner` 35/35, `verify-eval-inventory`, `test:eval --dry-run` (106 casos), migración en seco con 0 pendientes. |

### Decisiones no previstas en `design.md`

- **Frontmatter de EPIC-00…EPIC-09:** la clave `date:` se reemplazó a mano por `created`/`updated` (mismo valor) para que el gate las apruebe. El motor no toca el frontmatter (D-7). Registrado como CR-013.
- **Ítems `[x]` sin ID:** los 56 ítems se movieron sin cambios a `Notas › Ítems completados sin ID de historia`, y 14 líneas irreconocibles se reescribieron como F3. Registrado como CR-014.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1…AC-7 y AC-10 están cubiertos por los tests deterministas, que pasan. AC-8, AC-9 y AC-11 dependen de evals con LLM que no se ejecutaron. |
| Criterios no funcionales verificados | ✓ | CNF-1 (40 líneas), CNF-3 (CHANGELOG), CNF-4 (migración + nota), CNF-5 (UT-004) |
| Comportamiento coincide con `design.md` | ⚠️ | Hay dos desviaciones sin registrar (ver arriba) |
| Sin regresiones | ✓ | `npm test` 218/218 |
| Convenciones de `constitution.md` | ✓ | Principio 13 resuelto (CR-012): todos los campos y las 5 secciones del template anotan su `escritor:`; el template sigue en 40 líneas y es idéntico en central, seed y borrador |
| Sin código comentado ni `TODO` | ✓ | — |
| Sin variables, imports ni funciones sin usar | ⚠️ | Solo revisado en el refactor; no hay linter configurado |
| Linter/formateador | ⚠️ | No hay linter en el repo; `verify-syntax` OK |
| Sin dependencias nuevas | ✓ | — |
| `skill-master` para skills nuevos | ✓ | No se crearon skills nuevos; la edición la hizo `skill-master` |
| `package.json › files` | ✓ | Ya publica `skills/` completo |
| `gr-ai-security-checklist` | ⚠️ | No auditado (pendiente de `story-code-review`) |
| `gr-code-security-checklist` | ⚠️ | El motor usa `assertInsideRoot` por archivo; auditoría pendiente |
| `gr-skill-creation-checklist` | ⚠️ | `story-implement` y `story-implement-tasks` siguen por encima de 500 líneas (ya lo estaban antes de la historia) |
| Skills críticos con `evals.json` | ✓ | Los 6 skills afectados tienen casos v2 |
| Casos ejecutados y evaluados automáticamente | ❌ | `npm run test:eval` no se ejecutó (solo `--dry-run`) |
| `tasks.md` con todas las tareas en `[x]` | ❌ | 34/35: T035 está a medias (dry-run OK; faltan los evals reales con LLM) |
| README/docs de contratos actualizados | ✓ | `domain-epic-lifecycle` §9, README de memory-system, epic-format-validation y epic-creation |
| Decisiones nuevas en `design.md` | ✓ | CR-012 (escritores del template), CR-013 (`date:` → `created`/`updated` en EPIC-00…09) y CR-014 (resolución de los 70 `[REVISAR]` de la migración) |
| CHANGELOG | ✓ | `[Unreleased]`: Changed (BREAKING), Added y guía de actualización a 4.0.0 |
| CI pasa | ⚠️ | El gate local pasa; CI no se ha ejecutado |
| Sin secrets | ✓ | — |
| Variables de entorno documentadas | ✓ | No se añaden |
| Despliegue reversible | ✓ | Breaking change con migración automática; git permite revertir |

> Los tests deben ejecutarse manualmente para confirmar el resultado final (en particular `npm run test:eval` de los 6 skills).
