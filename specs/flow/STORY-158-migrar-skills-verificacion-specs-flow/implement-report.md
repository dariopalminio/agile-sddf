---
type: implement-report
id: STORY-158
slug: STORY-158-implement-report
title: "Implement Report: Migrar los skills de revisión, verificación y aceptación a specs/flow"
story: STORY-158
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de revisión, verificación y aceptación a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-158 |
| Total de tareas | 19 |
| Tareas completadas | 19 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js`, STORY-147/148) | ✓ completado | — |
| T002 | Línea base (`npm test`, `verify:repository`) e inventario de rutas legadas | ✓ completado | `.tmp/story-implement/STORY-158/baseline.txt` |
| T003 | Comprobar E2E-002 en `test/dod-story.test.js` (CR-001) | ✓ completado | — (ya aplicado por una historia hermana; sin cambios) |
| T004 | Retirar los tres skills de `PENDING_MIGRATION` (RED) | ✓ completado | `scripts/verify-fixed-layout.js`, `.tmp/story-implement/STORY-158/red.txt` |
| T005 | Migrar `story-code-review/SKILL.md` | ✓ completado | `skills/story-code-review/SKILL.md` |
| T006 | Migrar `story-verify/SKILL.md` | ✓ completado | `skills/story-verify/SKILL.md` |
| T007 | Migrar `story-acceptance/SKILL.md` | ✓ completado | `skills/story-acceptance/SKILL.md` |
| T008 | Ejemplo de `$STORY_DIR` en el agente Tech Lead | ✓ completado | `skills/story-code-review/agents/tech-lead-reviewer.agent.md` |
| T009 | Rutas de los ejemplos de `story-code-review` | ✓ completado | `skills/story-code-review/examples/example-all-artifacts-present/README.md`, `skills/story-code-review/examples/example-missing-artifacts/expected-output.md` |
| T010 | README de `story-verify` (salida, template, DoD) | ✓ completado | `skills/story-verify/README.md` |
| T011 | Evals de `story-acceptance` (TC-004, TC-010, TC-015) | ✓ completado | `skills/story-acceptance/evals/evals.json` |
| T012 | Eval TC-023 de `story-code-review` | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T013 | Eval TC-007 de `story-verify` | ✓ completado | `skills/story-verify/evals/evals.json` |
| T014 | `npm run verify:layout` en verde (GREEN) | ✓ completado | `.tmp/story-implement/STORY-158/green.txt` |
| T015 | Greps de los contratos #1–#4 y #7–#10 | ✓ completado | — |
| T016 | Validar los evals (JSON, ids, `--dry-run`) | ✓ completado | — |
| T017 | `npm test` y `npm run verify:repository` | ✓ completado | `.tmp/story-implement/STORY-158/final.txt` |
| T018 | Revisar el alcance del diff | ✓ completado | — |
| T019 | `graphify update .` y registro en este reporte | ✓ completado | `graphify-out/` (no versionado por esta historia) |

---

## Evidencia de verificación

**T001 — precondiciones.** `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` tiene `status: ACCEPTED`. `scripts/verify-fixed-layout.js` existe, y su `PENDING_MIGRATION` contenía exactamente `story-acceptance`, `story-code-review` y `story-verify`. STORY-147 y STORY-148 están en `CODE-REVIEW/DONE`. Se aplicó el mismo criterio que en STORY-156: basta con que los dos entregables de los que depende esta historia (el ADR y el gate) existan y funcionen.

**T002 — línea base.** `npm test`: 290/290 ✓. `verify:repository`: exit 0. El inventario por grep coincide con la tabla de Context del diseño: no se desplazó ninguna línea y no aparecieron rutas nuevas.

**T003 — E2E-002 (CR-001).** `expectedPath` ya es `` `docs/guardrails/${slug}.md` ``, con el patrón `/guardrails\/(dod-story-[a-z-]+)\.md/g`. No se tocó `test/dod-story.test.js`.

**T004 — RED.** `npm run verify:layout` terminó con exit 1. Los tres skills dieron R1 (falta el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`), R3 (`SPECS_BASE`, `SDDF_ROOT`, `SDDF-ROOT-RESOLUTION: v1`, con su línea) y R4 (lectura de la clave `root`). La lista transitoria quedó vacía.

**T014 — GREEN.** `[OK] Contrato de layout fijo verificado en 35 skill(s); 0 pendiente(s) de migración.`

**T015 — contratos por grep** (sobre `skills/story-code-review`, `skills/story-verify` y `skills/story-acceptance`):

| Contrato | Resultado |
|---|---|
| #1 `SPECS_BASE\|SDDF_ROOT\|SDDF-ROOT-RESOLUTION` | sin salida ✓ |
| #2 `docs/specs\|specs/stories\|specs/epics` | solo en `not_contains` de TC-023, TC-007 y TC-015, y en `input.context`/`not_contains` de TC-010 de acceptance ✓ |
| #3 marcador | 1 en cada `SKILL.md` ✓ |
| #4 `root` + `sddf.config.yaml` | 0 en los tres ✓ |
| #7 Glob y mensaje nuevos | `specs/flow/{story_id}-*/` y `No se encontró la historia {story_id} en specs/flow/` en los tres ✓ |
| #8 ruta explícita | `no es una historia de specs/flow/` en los tres ✓ |
| #9 salida | code-review: `code-review-report.md` y `fix-directives.md` bajo `specs/flow/<STORY-NNN>-<slug>/`; verify: `verify-report.md`; acceptance: `acceptance-report.md` ✓ |
| #10 `CLI_ROOT` | code-review 0, acceptance 0, verify 3 (Paso 0 y modo delegado) ✓ |

**T016 — evals.** Los tres `evals.json` son JSON válido y no repiten ids. code-review tiene 23 casos (incluye TC-023), verify 7 (incluye TC-007) y acceptance 15 (incluye TC-015). TC-010 de acceptance pasa a ser `historia-no-encontrada-en-specs-flow` y ya no contiene `SDDF_ROOT`. `npm run test:eval -- <skill> --dry-run` termina con exit 0 en los tres.

**T017 — pruebas y gate.** `npm test`: 290/290 ✓ (incluye E2E-002 y `verify-validation-contract`). `npm run verify:repository`: `[OK] Verificación determinista del repositorio aprobada.`, exit 0.

**T018 — alcance.** Los archivos que esta historia modifica son exactamente los de «Componentes afectados», más `story.md`, `tasks.md` y este reporte. `test/dod-story.test.js` no cambia. No se tocó ningún otro `SKILL.md`, ni ADRs, CHANGELOG, guías u otras historias. Nota: el árbol de trabajo ya tenía cambios sin commitear de STORY-155 y STORY-156. Entre ellos están las entradas de `PENDING_MIGRATION` que STORY-156 había retirado, y por eso `git diff scripts/verify-fixed-layout.js` contra HEAD también muestra esas retiradas.

**T019.** `graphify update .` terminó con exit 0 (12184 nodos, 13886 aristas).

---

## Decisiones de implementación

- **Mensaje de historia no encontrada en `story-verify`.** Antes solo mostraba el error. Ahora incluye también la sugerencia `/epic-generate-stories` y «Detener la ejecución.», como pide D-3: el mismo contrato en los tres skills.
- **Tabla de errores.** `story-verify` y `story-acceptance` no tienen una sección «Manejo de errores», así que el mensaje nuevo y el de ruta explícita quedan en su Paso 1b. Solo `story-code-review` recibe las dos filas de la tabla (D-2: «su fila en la tabla de errores si existe»).
- **README de `story-verify`, línea 79.** Estaba truncada en `(ver \``. Se completó como `(ver \`## DoD aplicable\` en \`SKILL.md\`)` al reescribir la ruta del DoD.
- **Descripciones de los evals nuevos.** Se refieren al «layout legado» en lugar de nombrar `docs/specs`. Así el contrato #2 encuentra `docs/specs` solo como ruta prohibida (`not_contains`/`input.context`).

---

## Advertencias

- **Dogfooding en transición (Risks del diseño).** Los skills fuente ya apuntan a `specs/flow/`, pero los work items de este repo siguen en `docs/specs/` hasta STORY-153. **No reinstales las copias de runtime con `agile-sddf install` hasta STORY-153.** Esta historia se revisa, verifica y acepta con las copias instaladas, que aún usan el contrato v1.
- **CR-003.** Las rutas legadas que el inventario de la historia omitía se migraron dentro del alcance declarado: el agente `tech-lead-reviewer`, los dos ejemplos de `story-code-review`, el template del README de `story-verify` y TC-010 de `story-acceptance`.
- **Evals reales (contrato #13).** No se ejecutaron; quedan a criterio humano: `npm run test:eval -- story-code-review`, `-- story-verify` y `-- story-acceptance`.
- **Lista transitoria vacía.** Con esta historia, `PENDING_MIGRATION` queda en `[]`. STORY-157 lo verifica al cerrar la épica.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-2 queda verificado por el gate (T014, T017). AC-1 exige ejecutar los skills sobre una historia en `specs/flow/`, es decir, ejecutar los evals (TC-023, TC-007, TC-015): no evaluable por story-implement |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: los tres `evals.json` usan `specs/flow/` (T011–T013, contrato #2); la ejecución queda a criterio humano. CNF-2: marcador presente en los tres `SKILL.md` (contrato #3) |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1 a D-7 aplicados; contratos #1–#12 verificados (T014–T018) |
| 4 | No hay regresiones | ✓ | `npm test` 290/290, igual que la línea base; `verify:repository` OK |
| 5 | Convenciones de `constitution.md` | ✓ | Cambios en Markdown/JSON en español, con el mismo texto canónico que STORY-150/155/156 |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No se añadieron comentarios ni `TODO` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `SPECS_BASE` y `ROOT_SOURCE` eliminados; `CLI_ROOT` retirado de code-review y acceptance, que no lo usaban (contratos #1, #10) |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` (gate determinista de CI, incluye sintaxis JS) aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crea ningún skill |
| 12 | [[gr-ai-security-checklist]] | ⚠️ | Sin revisión formal ítem por ítem. El cambio restringe `{story_path}` a `specs/flow/STORY-NNN-<slug>/`, lo que reduce la escritura fuera de la carpeta. Queda para `story-code-review` |
| 13 | [[gr-code-security-checklist]] | ⚠️ | El único código ejecutable que cambia es una constante, que queda vacía; sin revisión formal. Queda para `story-code-review` |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crea ningún skill |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los tres skills tienen un `evals.json` válido (T016) |
| 16 | Casos de prueba ejecutados y evaluados | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; los evals reales quedan a criterio humano (contrato #13) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 19/19 tareas `[x]` |
| 18 | README/docs actualizados si cambian contratos | ✓ | README de `story-verify` actualizado (T010); los README de code-review y acceptance no tenían rutas legadas |
| 19 | Decisiones no previstas documentadas | ✓ | Las decisiones menores caen dentro de D-2/D-3/D-5; registradas en «Decisiones de implementación» |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica por alcance (Non-Goals y T018): el CHANGELOG se actualiza a nivel de épica |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el mismo gate (`verify:repository`) y `npm test` pasan en local |
| 22 | Sin secrets ni credenciales | ✓ | Diff sin secretos |
| 23 | Variables de entorno documentadas | ✓ | No se añaden variables; se retira la dependencia de `SDDF_ROOT` |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Solo cambian la documentación de los skills, los evals y una constante; todo es reversible con git |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no añade pruebas unitarias: su verificación ejecutable es el gate `verify:layout` (RED → GREEN) y los tres casos de eval nuevos.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- story-code-review`, `-- story-verify` y `-- story-acceptance` (a criterio humano)
2. Si algún caso falla, revisar el `SKILL.md` correspondiente frente a D-3 de `design.md`
3. Continuar con `/story-code-review STORY-158`
