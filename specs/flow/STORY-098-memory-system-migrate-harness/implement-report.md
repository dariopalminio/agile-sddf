---
type: implement-report
id: STORY-098
story: STORY-098
created: 2026-09-23
updated: 2026-09-23
---

<!-- Referencias -->
[[STORY-098-memory-system-migrate-harness]]

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (estática: no hay `defaults.eval.command`; `migrate` no existía y `skipLayers`/`mappings` estaban vacíos) |
| Fase GREEN confirmada | sí |
| Fase REFACTOR confirmada | sí |
| Archivos de prueba generados | 6 en RED (`evals.json` + 5 fixtures) + 12 tests `S098-*` en `test/memory-system.test.js` durante GREEN |
| Archivos de producción generados | 10 modificados (motor, `SKILL.md`, template, `memory-rules.md` y documentación) |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | `eval` → `skill-test-evals`: TC-015..TC-018 (EV-001..EV-004) y fixtures `examples/speckit/{.specify/memory/constitution.md, specs/001-login/}` y `examples/speckit-sin-constitution/`. `unit`/`e2e` omitidos (`skill: none`). |
| GREEN | ✅ | `monolithic` → `skill-master`: primero tests S098-* (16 fallos), luego motor (perfiles D-1, scaffold D-2, guardia D-5, index D-4), `SKILL.md` §3.6 `migrate`, `memory-rules.md` §8, `index-template.md`, documentación (arquitectura §10.5, README, guía de pipeline §0, CHANGELOG 3.3.0). |
| REFACTOR | ✅ | Helper `under()` reutilizado en `scanExternalNodes`/`missingLayers`; sin regresiones (`npm test` 132/132). |
| Cierre (orquestador) | ✅ | Índice de contenidos en `memory-rules.md` (320 líneas > 300); `migrate` paso 1 usa `scaffold --dry-run` en lugar de `detect` (CR-005); paso 3 reordenado para que con `--yes` no aparezca la pregunta (TC-016 fallaba). |

## Verificación

| Comando | Resultado |
|---|---|
| `npm test` | 132/132 ✅ |
| `node --test test/memory-system.test.js` | 53/53 ✅ |
| `npm run test:eval -- memory-system --only TC-015..TC-018` (LLM real, sonnet) | 4/4 ✅ (TC-016 tras el ajuste del paso 3; TC-018 en la primera corrida) |
| `npm run verify:links` · `verify:eval-inventory` · `verify:syntax` | OK ✅ |
| Guardrail `gr-skill-creation-checklist` (deterministas) | 0 incumplimientos de frontmatter; URL `foambubble.github.io` fuera del allow-list **preexistente** en `index-template.md` (ya estaba en HEAD) |
| Verificación sugerida (T017) en tmp, motor | speckit: plan sin escribir, `mapeados: 1 · omitidos por harness: 1`, sin `docs/specs/` ni `docs/constitution.md`, 2.ª corrida `creados: 0`, hashes de `.specify/` y `specs/` intactos · openspec: sin `docs/specs/`, `index.md` con `### OpenSpec — specs` `[[auth]]` y `### OpenSpec — changes` `[[add-login]]`, hashes de `openspec/` intactos |

## Desviaciones y decisiones registradas

- **CR-004 (design.md):** `check` no aplica `orphan`/`invalid-frontmatter`/`broken-wikilink` a nodos externos y no exige `constitution.md` si está mapeada. Amplía el contrato de STORY-097 solo para perfiles con harness externo.
- **CR-005 (design.md):** `migrate` detecta el harness con `scaffold --dry-run` porque `detect` sale con exit 2 si `SPECS_BASE` no existe. `ensure` (STORY-096) tiene la misma limitación en proyectos sin `docs/`; queda fuera del alcance de esta historia.
- Descripción de `SKILL.md` recortada a 484 caracteres; `--yes` aceptado en todos los modos (solo `migrate` lo usa).
- IT-001 e IT-002 (secuencia `migrate` e interrupción por `no`) no tienen test automático propio: IT-001 lo cubre en parte TC-016 y IT-002 queda para revisión manual.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Escenarios Gherkin de `story.md` pasan | ✓ | E2E-001/E2E-002 en el motor + TC-015/TC-016/TC-018 con LLM real |
| Criterios no funcionales verificados | ✓ | Seguridad (hashes, UT-007), idempotencia (UT-006), trazabilidad (UT-005), documentación (NFR-4) |
| Comportamiento coincide con `design.md` | ✓ | Con las desviaciones CR-004 y CR-005 registradas |
| Sin regresiones | ✓ | `npm test` 132/132 (antes 121/121) |
| Convenciones de `constitution.md` | ⚠️ | Sin revisión formal; queda para story-code-review |
| Sin código comentado ni `TODO` | ✓ | grep sobre el diff sin resultados |
| Sin variables/imports/funciones sin usar | ⚠️ | No hay linter en el repo; `verify:syntax` OK |
| Linter/formateador | ⚠️ | No hay linter configurado |
| Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| Uso de `skill-master` | ✓ | Code generator GREEN/REFACTOR |
| Skill nuevo en `files` de `package.json` | ✓ | N/A: no se crea skill nuevo |
| Checklist de Seguridad de IA / de Código | ⚠️ | Sin ejecución formal; queda para story-code-review (auditor de seguridad) |
| Checklist de Creación de Skills | ✓ | Reglas deterministas en verde; aviso de URL preexistente |
| Skills críticos con `evals/evals.json` | ✓ | 18 casos (TC-001..TC-018) |
| Casos ejecutados automáticamente | ✓ | TC-015..TC-018 4/4 con LLM real |
| `tasks.md` con todas las tareas `[x]` | ✓ | 18/18 |
| README/docs actualizados | ✓ | README, arquitectura, guía de pipeline, `memory-rules.md` |
| Decisiones no previstas en `design.md` | ✓ | CR-004, CR-005 |
| CHANGELOG actualizado | ✓ | 3.3.0 |
| CI pasa | ⚠️ | Comandos locales de `quality.yml` en verde; CI remoto no ejecutado (sin commit) |
| Sin secrets | ✓ | grep de credenciales del guardrail sin resultados |
| Variables de entorno documentadas | ✓ | No hay variables nuevas |
| Despliegue reversible | ✓ | Solo cambios de archivos versionados |

> Los tests deben ejecutarse manualmente para confirmar el resultado final.
