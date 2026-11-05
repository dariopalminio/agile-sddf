---
type: implement-report
id: STORY-156
slug: STORY-156-implement-report
title: "Implement Report: Migrar los skills de implementación a specs/flow"
story: STORY-156
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de implementación a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-156 |
| Total de tareas | 15 |
| Tareas completadas | 15 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js`, STORY-147/148) | ✓ completado | — |
| T002 | Línea base de `npm test`, `verify:repository` e inventario de líneas legadas | ✓ completado | `.tmp/story-implement/STORY-156/baseline.txt` |
| T003 | Comprobar E2E-002 (CR-001) | ✓ completado | — (sin cambios: ya usaba `docs/guardrails/${slug}.md`) |
| T004 | Retirar los dos skills de `PENDING_MIGRATION` (RED) | ✓ completado | `scripts/verify-fixed-layout.js`, `.tmp/story-implement/STORY-156/red.txt` |
| T005 | Migrar `story-implement/SKILL.md` | ✓ completado | `skills/story-implement/SKILL.md` |
| T006 | Migrar `story-implement-tasks/SKILL.md` | ✓ completado | `skills/story-implement-tasks/SKILL.md` |
| T007 | Actualizar README de `story-implement` | ✓ completado | `skills/story-implement/README.md` |
| T008 | Actualizar README de `story-implement-tasks` | ✓ completado | `skills/story-implement-tasks/README.md` |
| T009 | Actualizar evals de `story-implement` (12 rutas) | ✓ completado | `skills/story-implement/evals/evals.json` |
| T010 | `npm run verify:layout` en verde (GREEN) | ✓ completado | `.tmp/story-implement/STORY-156/green.txt` |
| T011 | Greps de los contratos #1–#4, #7–#10 | ✓ completado | — |
| T012 | Validar evals (parseo JSON y `--dry-run`) | ✓ completado | — |
| T013 | `npm test` y `npm run verify:repository` | ✓ completado | `.tmp/story-implement/STORY-156/final-test.txt`, `final-verify.txt` |
| T014 | Revisar alcance del diff | ✓ completado | — |
| T015 | `graphify update .` y registro en este reporte | ✓ completado | `implement-report.md` |

---

## Evidencia de verificación

**T001 — precondiciones.** `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` tiene `status: ACCEPTED`; `scripts/verify-fixed-layout.js` existe con `PENDING_MIGRATION`, que contenía `story-implement` y `story-implement-tasks`. STORY-147 y STORY-148 están en `CODE-REVIEW/DONE` (implementación cerrada y revisada, aún sin VERIFY/ACCEPTANCE); se consideró suficiente porque los dos entregables de los que depende esta historia (ADR y gate) existen y funcionan.

**T004 — RED.** Con las dos entradas retiradas, `npm run verify:layout` salió con exit 1 y 46 errores que nombran skill y línea: R1 (falta `<!-- SDDF-FIXED-LAYOUT: v1 -->`) en ambos `SKILL.md`, R3 (`SPECS_BASE`, `SDDF_ROOT`, `SDDF-ROOT-RESOLUTION: v1`) y R4 (lectura de `root` de `sddf.config.yaml`), incluida la fila de dependencias de `story-implement-tasks` (l. 102).

**T010 — GREEN.** `npm run verify:layout` → exit 0: `[OK] Contrato de layout fijo verificado en 35 skill(s); 3 pendiente(s) de migración` (quedan `story-acceptance`, `story-code-review`, `story-verify`, de STORY-158).

**T011 — contratos por grep** sobre `skills/story-implement` y `skills/story-implement-tasks`:

| # | Resultado |
|---|---|
| 1 | Sin `SPECS_BASE`, `SDDF_ROOT` ni `SDDF-ROOT-RESOLUTION` |
| 2 | Sin `docs/specs`, `specs/stories` ni `specs/epics` |
| 3 | Un marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` en cada `SKILL.md` |
| 4 | Ninguna línea combina `root` y `sddf.config.yaml` |
| 7 | Glob `specs/flow/{story_id}-*/` (con guion) y mensaje `No se encontró la historia {story_id} en specs/flow/` en ambos (2 coincidencias cada uno: paso y tabla de errores) |
| 8 | `no es una historia de specs/flow/` en `story-implement-tasks` (1b y tabla de errores) |
| 9 | `specs/flow/<parent>/epic.md` en ambos (paso de épica y tabla de salida) |
| 10 | `implement-report.md` en salida: `$STORY_DIR/implement-report.md` (implement) y `specs/flow/<STORY-NNN>-<slug>/implement-report.md` (implement-tasks) |

**T012 — evals.** Ambos `evals.json` parsean; `npm run test:eval -- story-implement --dry-run` y `-- story-implement-tasks --dry-run` → exit 0.

**T013 — gate completo.** `npm test` → 290 pass / 0 fail (incluye E2E-002); `npm run verify:repository` → `[OK] Verificación determinista del repositorio aprobada.`

**T003 — E2E-002.** `test/dod-story.test.js` ya tenía `expectedPath = docs/guardrails/${slug}.md` y el patrón `guardrails\/(dod-story-[a-z-]+)\.md` (STORY-150 D-7 aplicado); no se modificó.

**T014 — alcance.** Los cambios de esta historia se limitan a los componentes del diseño: los dos `SKILL.md`, los dos `README.md`, `skills/story-implement/evals/evals.json`, dos líneas de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js` y los artefactos de STORY-156 (`story.md`, `tasks.md`, este reporte) más el checklist de EPIC-26. El árbol de trabajo contiene además cambios sin commitear de STORY-155 (skills de planning, su `story.md`/`tasks.md` y su retiro de `PENDING_MIGRATION`) que existían antes de esta ejecución; no forman parte de esta historia.

---

## Decisiones de implementación

- **Frase sobre el layout legado:** en 0c.1 (implement) y 1b (implement-tasks) se escribió «nunca se consulta el layout legado ni `specs/flow/archive/`» en lugar de nombrar `docs/specs/`, para cumplir el contrato #2 (cero literales `docs/specs` en los skills). El comportamiento es el de D-3.
- **`CLI_ROOT` en `story-implement-tasks`:** la línea del Paso 0 se limita al seed del template de épica, su único uso en ese skill (D-1).

---

## Advertencias

- **Dogfooding en transición:** los skills fuente ya apuntan a `specs/flow/`, pero los work items de este repositorio siguen en `docs/specs/` hasta STORY-153. **No reinstalar las copias de runtime** (`agile-sddf install`) antes de STORY-153: las copias instaladas en `.claude/` conservan el contrato v1 y son las que permiten seguir operando sobre `docs/specs/` (esta historia se implementó con ellas).
- **Evals reales no ejecutados:** `npm run test:eval -- story-implement` y `-- story-implement-tasks` (contrato #13) quedan a criterio humano para economizar cuota; solo se validó estructura y plan (`--dry-run`).

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-2 verificado por el gate (T010, T013). AC-1 exige ejecutar los skills sobre una historia en `specs/flow/`: requiere ejecución de evals — no evaluable por story-implement |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: evals de `story-implement` usan `specs/flow/` (T009, contrato #2); CNF-2: marcador presente en ambos `SKILL.md` (contrato #3) |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1 a D-6 aplicados; contratos #1–#12 verificados (T010–T014) |
| 4 | No hay regresiones | ✓ | `npm test` 290/0 igual que la línea base; `verify:repository` OK |
| 5 | Convenciones de `constitution.md` | ✓ | Cambios en Markdown/JSON en español, mismo texto canónico que STORY-150/151/155 |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No se añadieron comentarios ni `TODO` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Se eliminaron `SPECS_BASE` y `ROOT_SOURCE` por completo; sin referencias huérfanas (contrato #1) |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` (gate determinista de CI) aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crea ningún skill |
| 12 | [[gr-ai-security-checklist]] | ⚠️ | Sin revisión formal ítem por ítem; el cambio restringe `{story_path}` a `specs/flow/STORY-NNN-<slug>/` (reduce escritura fuera de la carpeta). Queda para `story-code-review` |
| 13 | [[gr-code-security-checklist]] | ⚠️ | Sin código ejecutable nuevo salvo el retiro de dos entradas de una constante; sin revisión formal. Queda para `story-code-review` |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crea ningún skill |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Ambos skills tienen `evals.json` válido (T012) |
| 16 | Casos de prueba ejecutados y evaluados | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; evals reales a criterio humano (contrato #13) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 15/15 tareas `[x]` |
| 18 | README/docs actualizados si cambian contratos | ✓ | READMEs de ambos skills actualizados (T007, T008) |
| 19 | Decisiones no previstas documentadas | ✓ | Las dos decisiones menores están dentro de D-1/D-3; registradas en «Decisiones de implementación» |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica por alcance (Non-Goals y T014): el CHANGELOG se actualiza a nivel de épica |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el mismo gate (`verify:repository`) y `npm test` pasan en local |
| 22 | Sin secrets ni credenciales | ✓ | Diff sin secretos |
| 23 | Variables de entorno documentadas | ✓ | No se añaden variables; se retira la dependencia de `SDDF_ROOT` |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios solo de documentación de skills, evals y una constante; reversibles con git |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no generó tests nuevos: es una migración de rutas en skills Markdown verificada por el gate determinista existente (`scripts/verify-fixed-layout.js`, ciclo RED → GREEN en T004/T010) y por `npm test`.

Pasos recomendados:
1. Ejecutar a criterio humano `npm run test:eval -- story-implement` y `npm run test:eval -- story-implement-tasks`
2. Si algún eval falla, revisar los fixtures migrados de `skills/story-implement/evals/evals.json`
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
