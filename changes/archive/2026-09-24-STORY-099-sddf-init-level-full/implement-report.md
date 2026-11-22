---
type: implement-report
id: STORY-099
story: STORY-099
created: 2026-09-24
updated: 2026-09-24
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (estática: no hay `defaults.eval.command`; `skills/sddf-init/SKILL.md` no admitía `--level`, así que TC-006..TC-010 estaban en rojo; dry-run del runner OK) |
| Fase GREEN confirmada | sí (`npm run test:eval -- sddf-init`: 10/10 con LLM real) |
| Fase REFACTOR confirmada | sí (`npm run test:eval -- sddf-init`: 10/10 tras el refactor; `npm test` 132/132) |
| Archivos de prueba generados | 1 (`skills/sddf-init/evals/evals.json`: TC-005..TC-010 añadidos; TC-001..TC-004 intactos) |
| Archivos de producción generados | 0 nuevos · 4 modificados (`skills/sddf-init/SKILL.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md`) |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | `eval` → `skill-test-evals`: TC-005 (EV-001, regresión sin flags), TC-006 (EV-002 minimal), TC-007 (EV-003 full), TC-008 (EV-004 full sin memory-system), TC-009 (EV-005 `--level foo`), TC-010 (EV-006 full idempotente). `unit`/`e2e` omitidos (`skill: none`). |
| GREEN | ✅ | `monolithic` → `skill-master`: sección "Parámetros" con la tabla de niveles y la validación previa al Paso 1, nota de `minimal` en el Paso 5, Paso 5b nuevo y ejemplos de informe en el Paso 6. Documentación en la guía, README y CHANGELOG 3.3.0. Frase de CR-002 en `story.md`. |
| REFACTOR | ✅ | Tres cambios, sin regresiones. (1) Sin `--level`, el informe y el cierre vuelven a ser idénticos a HEAD (NFR-1). (2) El ejemplo `full` ahora coincide con la salida real del motor de `memory-system` (antes usaba cifras inventadas). (3) Menos redundancia en el texto (SKILL.md: 293 → 273 líneas). Los Pasos 1, 2, 2b, 3 y 4 no cambian respecto a HEAD (AC-4). Ver CR-004 en `design.md`. |

## Verificación

| Comando / prueba | Resultado |
|---|---|
| `npm run test:eval -- sddf-init --report` (GREEN y REFACTOR, sonnet) | 10/10 ✅ en ambas corridas |
| `npm test` | 132/132 ✅ |
| `npm run verify:links` · `verify:syntax` · `verify:eval-inventory` | OK ✅ |
| Guardrail `gr-skill-creation-checklist` sobre `skills/sddf-init` | ✅ 273 líneas, frontmatter válido (`name`, `description` de 364 caracteres), greps sin salida |
| **E2E-001** (real, `claude -p` en directorios temporales con `agile-sddf install`) | ✅ A (`--level full`) y B (`/sddf-init` + `memory-system scaffold`) dan el mismo listado de directorios y archivos, con contenido idéntico byte a byte. El informe de A incluye el bloque `── memory-system scaffold (nivel full) ──` con los cinco templates `[PRESERVADO]` y cierra con `(nivel full)`. |
| **E2E-002** (real) | ✅ Sin argumentos: informe igual al de antes y sin mención a `memory-system`. `--level minimal`: sin `templates/*.md`, sin la pregunta de políticas y con `[OMITIDO] project-policies-generation (nivel minimal)`. |
| NFR-2 (real, `--level full` ×2) | ✅ Segunda corrida: todo `[YA EXISTÍA]`, `creados: 0 · … · preservados: 24`, `✓ Entorno ya inicializado`; los md5 de disco no cambian. |
| IT-003 (motor determinista) | ✅ Un `docs/constitution.md` previo queda `[PRESERVADO]` sin modificar |
| IT-002 (degradación sin `memory-system`) | ⚠️ Solo cubierto por el eval TC-008, que simula la ejecución con el LLM; no se ejecutó de verdad en un directorio sin el skill |

**Hallazgos del E2E real:**

1. El `~/.claude/skills/sddf-init` global de esta máquina es una versión antigua: no admite `--level` y usa la ruta legada `docs/specs/templates`. En Claude Code ese skill global tiene precedencia sobre el `.claude/skills/` del proyecto, así que la primera corrida E2E ejecutó el skill viejo. Al pedirle que leyera el `SKILL.md` del proyecto, todo pasó. Para usar `--level` hay que reinstalar el global (`npx agile-sddf install --global --force`). No es un defecto de la historia.
2. `scripts/memory-system.js` no acepta `--yes`, que solo se interpreta a nivel de `SKILL.md`. Tampoco admite invocarse sin `--root`. El Paso 5b invoca el *skill* (`scaffold --yes`), no el script, así que es correcto. Anotado por si alguien llama al script directamente.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Escenarios Gherkin de `story.md` pasan | ✓ | Escenario principal = E2E-001 real; escenario alternativo = E2E-002 real |
| Criterios no funcionales verificados | ✓ | Compatibilidad (E2E-002, TC-001..TC-005), idempotencia (full ×2 real), trazabilidad (bloques separados en el informe), documentación (guía, README y CHANGELOG) |
| Comportamiento coincide con `design.md` | ✓ | Con la desviación CR-004 registrada |
| Sin regresiones | ✓ | `npm test` 132/132; TC-001..TC-004 en verde |
| Convenciones de `constitution.md` | ⚠️ | Sin revisión formal; queda para story-code-review |
| Sin código comentado ni `TODO` | ✓ | grep sobre `skills/sddf-init/` sin resultados |
| Sin variables/imports/funciones sin usar | ✓ | N/A: solo cambia Markdown/JSON |
| Linter/formateador | ⚠️ | No hay linter configurado; `verify:syntax` OK |
| Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| Uso de `skill-master` | ✓ | Code generator en GREEN y REFACTOR |
| Skill nuevo en `files` de `package.json` | ✓ | N/A: no se crea ningún skill |
| Checklist de Seguridad de IA / de Código | ⚠️ | Sin ejecución formal; queda para story-code-review (auditor de seguridad) |
| Checklist de Creación de Skills | ✓ | Reglas deterministas en verde |
| Skills críticos con `evals/evals.json` | ✓ | `sddf-init`: 10 casos |
| Casos de prueba ejecutados automáticamente | ✓ | Runner `test:eval` con informe en `.tmp/skill-test-evals/sddf-init/` |
| `tasks.md` con todas las tareas `[x]` | ✓ | T001..T013 |
| README/docs actualizados | ✓ | README, `sddf-commands-pipeline.md` (ancla `#niveles-de-sddf-init`) |
| Decisiones no previstas en `design.md` | ✓ | CR-004 |
| CHANGELOG actualizado | ✓ | 3.3.0 · Added `--level` en `sddf-init` |
| CI pasa | ⚠️ | Comandos locales del gate en verde; CI remoto no ejecutado (sin commit) |
| Sin secrets | ✓ | Grep de credenciales del guardrail sin resultados |
| Variables de entorno documentadas | ✓ | Sin variables nuevas |
| Despliegue reversible | ✓ | Cambios solo en Markdown/JSON; el default `standard` conserva el comportamiento previo |

> Los tests deben ejecutarse manualmente para confirmar el resultado final.
