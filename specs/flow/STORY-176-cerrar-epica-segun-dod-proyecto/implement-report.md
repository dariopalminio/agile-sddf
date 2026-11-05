---
type: implement-report
id: STORY-176
slug: STORY-176-implement-report
title: "Implement Report: Cerrar una épica según el DoD del proyecto, sin asumir stack ni release"
story: STORY-176
created: 2026-11-04
updated: 2026-11-04
---

# Reporte de Implementación: Cerrar una épica según el DoD del proyecto, sin asumir stack ni release

> **Reporte retrospectivo.** El trabajo se hizo antes de especificar la historia, sin `design.md`, `tasks.md` ni `testcases.md`. Las tareas de este reporte son los pasos de [plan.md](plan.md). Este reporte no transiciona `story.md`. Al cerrarlo, la historia figura en `IMPLEMENT/DONE`, un estado escrito fuera de este reporte, aunque el DoD de `IMPLEMENT` (`enforcement: error`) sigue incompleto.

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-176 |
| Total de tareas | 9 |
| Tareas completadas | 9 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-04 |
| Pruebas unitarias | `npm test`: 486/486 |
| Evals | No ejecutados con un modelo; dry-run correcto |
| Commit | Solo `7be7fa7e`; el resto sigue sin commit |

**Estado:** ⚠️ Implementación aplicada, con el DoD de `IMPLEMENT` incompleto: 16 ✓ · 7 ⚠️ · 1 ❌

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| P1 | Definir el DoD de `SHIP` (commit `7be7fa7e`) | ✓ completado | `docs/guardrails/dod-epic-ship.md`, `skills/epic-ship/SKILL.md`, `CHANGELOG.md`, `specs/flow/EPIC-23-completar-flujo-de-epic/release-notes.md` |
| P2 | Implementar en el flujo los gates, `SHIP/IN-PROGRESS`, el DoD, `CHANGELOG.md` al día y el aviso de WIP | ✓ completado | `skills/epic-ship/SKILL.md`, `skills/epic-ship/references/release-content.md`, `skills/epic-ship/evals/evals.json`, `docs/architecture/state-machine.md`, `docs/guides/sddf-commands-pipeline.md` |
| P3 | Hacer autocontenidos los casos de `/epic-ship` | ✓ completado | `skills/epic-ship/evals/evals.json` |
| P4 | Quitar la dependencia de un stack | ✓ completado | `skills/epic-ship/SKILL.md`, `skills/epic-ship/evals/evals.json`, `docs/guardrails/dod-epic-ship.md` |
| P5 | Quitar la dependencia de un release | ✓ completado | `skills/epic-ship/SKILL.md`, `skills/epic-ship/references/release-content.md`, `skills/epic-ship/evals/evals.json`, `skills/epic-complete/SKILL.md`, `docs/architecture/state-machine.md`, `docs/guides/sddf-commands-pipeline.md` |
| P6 | Retirar `release-notes.md` de `/epic-ship` | ✓ completado | `skills/epic-ship/SKILL.md`, `skills/epic-ship/references/release-content.md`, `skills/epic-ship/evals/evals.json`, `skills/epic-ship/assets/release-notes-template.md` (eliminado), `docs/domains/domain-epic-lifecycle.md`, `docs/domains/domain-skills-map.md`, `docs/guides/sddf-commands-pipeline.md`, `docs/architecture/state-machine.md` |
| P7 | Hacer opcional la versión en `/epic-complete` (TDD: 7 pruebas en rojo primero) | ✓ completado | `test/epic-complete.test.js`, `skills/epic-complete/scripts/epic-complete.js`, `skills/epic-complete/SKILL.md`, `skills/epic-complete/README.md`, `skills/epic-complete/references/error-codes.md`, `skills/epic-complete/evals/evals.json`, `docs/guides/sddf-commands-pipeline.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/domains/domain-skills-map.md` |
| P8 | Sugerir `/epic-ship` desde `SHIP/IN-PROGRESS` (TDD: 1 prueba en rojo primero) | ✓ completado | `test/epic-complete.test.js`, `skills/epic-complete/scripts/epic-complete.js`, `skills/epic-complete/references/error-codes.md`, `skills/epic-complete/evals/evals.json` |
| P9 | Documentar retrospectivamente | ✓ completado | `specs/flow/STORY-176-cerrar-epica-segun-dod-proyecto/story.md`, `plan.md` e `implement-report.md` |

### Notas de implementación

- **`/epic-ship`:** el flujo queda en gates → inventario → análisis de `CHANGELOG.md` → `SHIP/IN-PROGRESS` → escritura de `CHANGELOG.md` → DoD → confirmación → `SHIP/DONE`. `SHIP/IN-PROGRESS` se escribe tras el análisis para que un rechazo no modifique nada.
- **Cobertura manual de `CHANGELOG.md`:** la regla se contrastó con EPIC-23: sus 17 historias aparecen en `[5.1.0]` en líneas que también citan la épica.
- **Motor de `epic-complete`:** `resolveVersion` devuelve `version: null` con un aviso si no conoce la versión, y `completeEpicFrontmatter` no escribe `version:` en ese caso. Un `version:` previo se conserva.
- **Pruebas:** `test/epic-complete.test.js` pasa de 38 a 43 casos.
- **Evals:** `epic-ship` pasa de 8 a 21 casos (se añaden TC-009 a TC-022 y se retira TC-007) y `epic-complete`, de 7 a 8.
- **`same_world_as`:** se retiró de los casos de `epic-ship` porque `scripts/run-evals.js` no lo resuelve. Otros skills no se revisaron.
- **Prueba manual del motor:** en un repositorio temporal con la entrada bajo `[Unreleased]`, `plan` y `apply` terminan en `OK` y `epic.md` queda en `COMPLETED/DONE`, sin `version:`.

### Decisiones tomadas durante la implementación

Sin `design.md`, las decisiones quedan aquí y en [plan.md](plan.md):

| Decisión | Motivo |
|---|---|
| `SHIP/DONE` significa que se cumple el DoD del proyecto | Una épica puede no coincidir con un release; el skill solo lee y valida los criterios |
| El DoD se evalúa antes de la confirmación final | Mismo orden que `story-delivery`; si el DoD bloquea, no se pregunta nada |
| Un DoD ausente avisa y continúa | Así lo pidió el mantenedor: «si existe» |
| Un bloque publicado que cubre todas las historias cuenta como al día | Si no, una épica ya liberada nunca llegaría a `SHIP/DONE` |
| El aviso de WIP no bloquea | El mantenedor pidió escribir `SHIP/IN-PROGRESS` con un estado válido. **Sigue abierta:** hoy hay varias épicas en `IN-PROGRESS` |
| STORY-176 sin épica madre (`parent: null`) | Una hija en curso haría figurar a EPIC-23 con trabajo pendiente |

### Relajación de un control de seguridad

Los checklists de `docs/guardrails/` exigen declarar este punto.

| Aspecto | Detalle |
|---|---|
| Control relajado | Lista de comandos permitidos del DoD de `SHIP`, que existió solo durante esta implementación y no llegó a publicarse |
| Por qué | Ataba `/epic-ship` a un stack concreto |
| Quién lo decidió | El mantenedor del proyecto, durante la implementación |
| Control compensatorio | Los comandos encadenados o que crean commits o tags, fusionan, empujan, publican o despliegan no se ejecutan; el DoD es un archivo versionado y revisable; `/epic-validate` ya sigue este modelo |

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-10 y AC-12, y el aviso de AC-11, pasan a nivel motor en `test/epic-complete.test.js`. El resto depende de la conducta de los skills: requiere `npm run test:eval`, que se ejecuta a criterio humano |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1: búsqueda de `npm`, `node_modules`, `package.json`, `cargo` y `git` sin resultados en `SKILL.md` y `release-content.md` de `epic-ship`. CNF-5: ningún caso usa `same_world_as`. CNF-2 a CNF-4 están en el contrato de `SKILL.md`, pero sin ejecución con un modelo |
| 3 | Comportamiento coincide con `design.md` | ⚠️ | No existe `design.md`: el trabajo es retrospectivo. La referencia es [plan.md](plan.md) |
| 4 | Sin regresiones | ✓ | `npm test` 486/486 |
| 5 | Convenciones de `constitution.md` | ✓ | CommonJS sin dependencias, idioma español, mismo estilo del motor y de los skills existentes |
| 6 | Sin código comentado ni `TODO` | ✓ | Búsqueda en el diff de `skills/` y `test/` sin resultados |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisión del diff; `resolveVersion` deja de devolver `ok` y `reason`, y nadie los lee |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` y `package-lock.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | N/A: no se crea ningún skill |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | N/A: no se crea ningún skill |
| 12 | Se cumple `gr-ai-security-checklist` | ⚠️ | Ver «Hallazgos abiertos» 1 y 2. La relajación del control está declarada arriba |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin secretos ni dependencias nuevas; `spawnSync` con argumentos en arreglo sin cambios; fixtures sintéticos. La relajación del control está declarada arriba |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | `epic-ship`: 186 líneas y `description` de 317 caracteres. `epic-complete`: 193 líneas y `description` de 358, dentro del presupuesto de 500 pero sobre el objetivo de 350 |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `epic-ship` con 21 casos y `epic-complete` con 8 |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Solo dry-run: genera 21 y 8 prompts. `AGENTS.md` reserva `npm run test:eval` a criterio humano |
| 17 | `tasks.md` con todas las tareas `[x]` | ⚠️ | No existe `tasks.md`. Los 9 pasos de [plan.md](plan.md) están completados |
| 18 | README o docs actualizados si cambian contratos | ✓ | `skills/epic-complete/README.md`, `error-codes.md`, `state-machine.md`, `sddf-commands-pipeline.md`, `domain-epic-lifecycle.md` y `domain-skills-map.md` |
| 19 | Decisiones de diseño no previstas documentadas | ⚠️ | Documentadas en este reporte y en [plan.md](plan.md), no en `design.md`, que no existe |
| 20 | CHANGELOG actualizado | ❌ | `## [Unreleased]` no registra estos cambios, y el contrato de ambos skills cambió. Las 3 entradas del commit `7be7fa7e` son de `[5.1.0]` y no los cubren |
| 21 | Build de CI pasa | ✓ | `npm run verify:repository` y `npm test` aprobados en local. CI remota no ejecutada |
| 22 | Sin secretos expuestos | ✓ | Revisión del diff; fixtures sintéticos |
| 23 | Variables de entorno documentadas | ✓ | N/A: no se añaden |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios sin commit; el template eliminado sigue en el historial de git |

**Resumen:** 16/24 criterios ✓ · 7 ⚠️ · 1 ❌

---

## Hallazgos abiertos

| # | Severidad | Hallazgo | Acción propuesta |
|---|---|---|---|
| 1 | Media | `/epic-ship` ejecuta los comandos del DoD sin mostrarlos antes, y solo aparecen en la tabla de resultados. `gr-ai-security-checklist` pide que cada comando se explique de forma que el lector pueda rechazarlo. `npm ci`, citado en el DoD de este repositorio, además recrea `node_modules` | Listar los comandos y pedir confirmación antes de ejecutarlos |
| 2 | Baja | `test/epic-complete.test.js` y `skills/epic-complete/scripts/epic-complete.js` contienen un U+FEFF literal, que el mismo checklist prohíbe. Ya estaba en `v5.1.0`; estos cambios no lo introducen | Sustituirlo por su secuencia de escape Unicode |
| 3 | Baja | La `description` de `epic-complete` tiene 358 caracteres, sobre el objetivo de 350 | Acortarla |
| 4 | Baja | `/epic-complete` no reconoce entradas manuales de `CHANGELOG.md`, por lo que EPIC-23 se cerraría sin versión | Usar `--version 5.1.0`; declarado fuera de alcance en `story.md` |
| 5 | Baja | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` tiene sin commit una línea `release: v5.1.0` ajena a este trabajo | Revisarla antes de hacer el commit |

---

## Nota sobre los Tests Generados

En esta ejecución se corrieron `npm test` (486/486), `npm run verify:repository` (aprobado) y el dry-run de los evals. Ningún eval se ejecutó con un modelo, por lo que la conducta de los skills sigue sin verificarse de punta a punta.

Pasos recomendados:

1. Ejecutar `npm run test:eval -- epic-ship` y `npm run test:eval -- epic-complete`.
2. Si algún caso falla, ajustar el `SKILL.md` o el caso y registrar el resultado aquí.
3. Añadir la entrada en `CHANGELOG.md › [Unreleased]` para cerrar el criterio 20.
4. Decidir los hallazgos 1 y 2 antes de `/story-code-review`.
5. Ejecutar `npx agile-sddf install --force` para actualizar las copias instaladas.
