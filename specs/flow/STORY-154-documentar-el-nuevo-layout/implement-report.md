---
type: implement-report
id: STORY-154
slug: STORY-154-implement-report
title: "Implement Report: Documentar el nuevo layout"
story: STORY-154
created: 2026-10-24
updated: 2026-10-24
---

# Reporte de Implementación: Documentar el nuevo layout

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-154 |
| Total de tareas | 32 |
| Tareas completadas | 31 (ronda inicial) + T030 (ronda 1 de correcciones) |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 31 en la ronda 1 de correcciones |
| Fecha de implementación | 2026-10-24 |

**Estado:** ✅ Implementación completa

La documentación describe el layout fijo. Tras la ronda 1 de `fix-directives.md`, `npm run verify:repository` termina con código 0: el checker indexa los slugs de `specs/` y los 233 wikilinks de `docs/index.md` resuelven.

---

## Desvío de la secuencia de D-1

D-1 pedía implementar STORY-154 **antes** de STORY-153. El orden real fue el inverso: STORY-153 ya había movido los work items (commits `8df4b11` y `8891cab`, `CODE-REVIEW/DONE`) y `docs/specs/` ya no existía. La precondición «existe `docs/specs/`» de T001 no se cumplía. Se continuó en lugar de detenerse, porque el cambio de orden fue deliberado (`ca0e7d4` actualizó las precondiciones de STORY-153). El diseño se adaptó al estado real:

| Decisión del diseño | Adaptación |
|---|---|
| D-4, viñeta «Transición EPIC-26»: «los work items siguen en `docs/specs/` hasta STORY-153» | Ahora dice que `sddf.config.yaml` conserva `root: docs` (traspaso CR-003 de STORY-153), que ningún skill la lee, y que STORY-157 la retira junto con la viñeta. Sigue remitiendo a `PENDING_MIGRATION`, que hoy está vacía. |
| D-2, clase «ruta concreta de un work item existente» en `docs/specs/` | Ya no aplica: esas rutas no existen. Las rutas de work items que aparecen en el texto reescrito usan `specs/flow/`. |
| D-6, el índice se regenera con enlaces a `docs/specs/` | El índice regenerado enlaza `specs/flow/` y `specs/flow/archive/`, y los enlaces Markdown resuelven. Los wikilinks no resuelven en el checker (ver más abajo). |
| D-1 y F-3, «STORY-153 ya ejecutada: informar y no forzar el verde» | En la ronda inicial el checker no se modificó, por decisión del usuario (2026-10-24). En la ronda 1 de correcciones el usuario eligió la vía (a) del hallazgo #2: se adelantó a esta historia la corrección del índice de slugs, que era de STORY-157. Para esta historia, eso anula la cláusula «nunca el checker» de T030 y D-7. |

Otros cambios no previstos en el diseño:

- **`specs/README.md`** se reescribió al layout fijo. Era el traspaso CR-002 de STORY-153: el archivo se movió desde `docs/specs/README.md` y seguía describiendo `epics/` y `stories/`.
- **`docs/guides/organization-of-artifacts.md`**: D-9 solo nombraba las líneas 27–30 y 57–58, pero §2, §7, §8, §10 y §11 también describían carpetas `epics/` y `stories/` como layout vigente. Se reescribieron para cumplir CNF-1.
- **`docs/architecture/sddf-architecture.md` §2**: «12 capas» pasa a «10 capas», que es lo que declara `LAYERS` del motor, y el diagrama nombra `docs/ + specs/`.
- **`docs/architecture/memory-system.md`**: la línea 191 ya estaba resuelta por STORY-152. Se actualizaron la regla «Raíz única» (línea 145), la regla «Sin anidamiento profundo» (`specs/` con `epics/` y `stories/`) y la línea de `SPECS_BASE` (ahora 455).
- **`docs/guides/sddf-commands-pipeline.md`**: «once capas» pasa a «diez capas», el número que declara el motor.
- **`README.md`** recibe un bloque `<details>` de migración a 5.0.0. En el bloque de 4.0.0, «viven en `specs/epics/`…» pasa a pretérito y remite a 5.0.0.
- **Redacción ajustada por el gate:** `verify-fixed-layout.js` (`findStalePreflightClaim`) interpreta «Ejecuta `/skill-preflight`» como si el preflight fuera automático. En `README.md:156` y en el paso 3 de la guía se escribe «Pide el diagnóstico explícito `/skill-preflight`».
- **`docs/requirements/index.md`**: `memory-system index` reescribió su `updated:`. Se restauró con `git checkout` para cumplir CS-10.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondiciones de D-1 | ✓ completado | — (ADR-0016 ✓, `PENDING_MIGRATION = []` ✓, región legada de `skill-preflight` ✓, template de índice ✓; `docs/specs/` ✗: ver desvío) |
| T002 | Línea base del gate | ✓ completado | Gate en rojo antes de empezar: 444 enlaces rotos, todos en `docs/index.md` (STORY-153). Tests 304/304 |
| T003 | Inventario clasificado | ✓ completado | `.tmp/story-implement/STORY-154/inventario.md` (no versionado), 124 líneas en 16 archivos |
| T004 | Ancla con `githubAnchor` | ✓ completado | `migracion-a-500--layout-fijo-de-tres-raices` |
| T005 | Hechos verificados contra los skills | ✓ completado | `sddf-init` Pasos 1b/2, `skill-preflight` L1–L3, `### Removed` de `docs-wiki-builder`, `LAYERS` (10), sin `root` en `sddf.config.yaml.template`, el instalador no borra `docs-wiki-builder` |
| T006 | Sección 5.0.0: «A quién aplica» y ADR-0016 | ✓ completado | `docs/guides/artifact-directory-migration.md` |
| T007 | Tabla 4.x → 5.0.0 | ✓ completado | ídem (fecha `updated:` → `created:` → `date:`, según la nota de EPIC-26) |
| T008 | Once pasos y notas | ✓ completado | ídem |
| T009 | Notas 1.x→2.x en pasado y cita en la sección 4.0.0 | ✓ completado | ídem |
| T010 | `AGENTS.md`: línea 3 y viñeta «Layout fijo» | ✓ completado | `AGENTS.md` |
| T011 | `AGENTS.md`: «Transición EPIC-26» y entrada «Layout» | ✓ completado | `AGENTS.md` (texto adaptado, ver desvío) |
| T012 | `sddf-architecture.md` §5–§8 | ✓ completado | `docs/architecture/sddf-architecture.md` |
| T013 | `memory-system.md` y `architecture/README.md` | ✓ completado | `docs/architecture/memory-system.md`, `docs/architecture/README.md` |
| T014 | Reescritura de `root-folder-practices.md` | ✓ completado | `docs/guides/root-folder-practices.md` (mismo `slug`, `title` nuevo) |
| T015 | `sddf-commands-pipeline.md` | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T016 | `skill-structural-pattern.md` y `organization-of-artifacts.md` | ✓ completado | ambos archivos |
| T017 | `harness-eng-agents-orchestration.md` y `best-practices-for-skills.md` | ✓ completado | ambos archivos |
| T018 | Árbol de `flight-leves-model.md` | ✓ completado | `docs/guides/flight-leves-model.md` (se conserva la nota v1.x) |
| T019 | Filas de `docs/guides/README.md` con el ancla | ✓ completado | `docs/guides/README.md` |
| T020 | `docs/constitution.md` | ✓ completado | `docs/constitution.md` (`updated: 2026-10-24`) |
| T021 | `README.md` raíz | ✓ completado | `README.md` (tabla «Upgrading desde 1.x» intacta) |
| T022 | `### BREAKING` en `[Unreleased]` | ✓ completado | `CHANGELOG.md` (cita el `### Removed` de `docs-wiki-builder` sin duplicarlo; `package.json` sin cambios) |
| T023 | Regenerar `docs/index.md` | ✓ completado | `docs/index.md` (`node skills/memory-system/scripts/memory-system.js index --root docs`: 403 nodos, 1 sin frontmatter, 1 pendiente) |
| T024 | Caso de regresión del checker | ✓ completado | `test/check-doc-links.test.js`. Es una prueba de caracterización: el comportamiento ya existía (D-7), así que pasó a la primera, sin fase RED |
| T025 | Contratos 1 y 2 | ✓ completado | — |
| T026 | Contrato 3 | ✓ completado | — (ver clasificación abajo) |
| T027 | Contrato 4 | ✓ completado | — |
| T028 | Contratos 5 y 6 | ✓ completado | — |
| T029 | Contratos 7 y 8 | ✓ completado | `npm test` 305/305. Ningún error de enlaces procede de `docs/guides/README.md` ni de otra guía: el ancla resuelve |
| T030 | Contrato 9: `verify:repository` con código 0 | ✓ completado (ronda 1 de correcciones) | `scripts/check-doc-links.js`, `test/check-doc-links.test.js` |
| T031 | Contratos 10 y 11 | ✓ completado | — |
| T032 | Informe y `graphify update .` | ✓ completado | este reporte; grafo regenerado (12191 nodos) |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | docs/guides/artifact-directory-migration.md:44 | MEDIUM | 💻 corregido: `docs/guides/artifact-directory-migration.md`. La nota ahora dice que el paquete incluye `scripts/migrate-specs-to-flow.js`, pero que es un script de un solo uso para este repositorio y no un comando soportado de `agile-sddf` |
| 2 | docs/index.md:158; scripts/check-doc-links.js:244-249 | MEDIUM | 💻 corregido: `scripts/check-doc-links.js`, por la vía (a) que eligió el usuario. `checkDocumentation` también recorre `specs/` cuando existe. Primero se escribió la prueba `resolves wikilinks to work items under specs/flow/` en `test/check-doc-links.test.js`, que falló (RED: `Missing wikilink target: [[STORY-001-x]]`) y pasa tras el cambio. `docs/index.md` no necesitó regenerarse |
| 3 | docs/guardrails/dod-story-code-review.md:17 | HIGH | Resuelto con el #2; la tabla DoD IMPLEMENT de abajo tiene evidencia nueva |
| 4 | docs/guardrails/dod-story-code-review.md:21 | MEDIUM | Resuelto al cerrar los hallazgos #1 a #3; se reevalúa en la próxima revisión |
| 5 | docs/guardrails/dod-story-code-review.md:22 | MEDIUM | 💻 corregido: `tasks.md`. T030 pasa a `[x]` porque el gate quedó en verde |
| 6 | docs/guardrails/dod-story-code-review.md:25 | MEDIUM | Queda pendiente de una nueva ejecución de `/story-code-review STORY-154` |

**Archivos corregidos:** `docs/guides/artifact-directory-migration.md`, `scripts/check-doc-links.js`, `test/check-doc-links.test.js`, `specs/flow/STORY-154-documentar-el-nuevo-layout/tasks.md` y este reporte
**Hallazgos omitidos por archivo inexistente:** ninguno

---

## Resultado de los contratos de verificación

| # | Contrato | Resultado |
|---|---|---|
| 1 | `AGENTS.md` documenta el layout | ✓ `specs/flow/` (2), `specs/flow/archive/` (1), `<YYYY-MM-DD>-STORY-NNN-<slug>/` (1), `specs/living/` (1), `workflow/` (1), `docs/requirements/` (1), `ADR-0016` (2) |
| 2 | Rutas de `AGENTS.md` verdaderas | ✓ `docs/product/vision.md`, ADR-0016, `scripts/verify-fixed-layout.js`, `docs/guides/root-folder-practices.md`, `docs/guides/artifact-directory-migration.md` y `specs/flow/EPIC-26-…/` existen; `docs/specs/01-projects` aparece 0 veces |
| 3 | Mecanismo legado no vigente | ✓ ver la clasificación siguiente |
| 4 | Arquitectura e índice | ✓ `sddf-architecture.md` contiene `specs/flow/` y `workflow/` en §7 y `docs/specs/` 0 veces; `docs/index.md` contiene `## 🗂️ Work items (specs/flow/)` |
| 5 | Sección de migración | ✓ encabezado exacto; la sección menciona `docs/specs/`, `specs/flow/`, `root` y `SDDF_ROOT` |
| 6 | CHANGELOG | ✓ `### BREAKING — layout fijo de tres raíces (EPIC-26, requiere 5.0.0)`, con `5.0.0` y el enlace con el ancla dentro de `[Unreleased]` |
| 7 | Ancla real | ✓ `node scripts/check-doc-links.js`: `[OK] Checked 49 active Markdown files; local links and anchors resolve.` |
| 8 | Regresión del gate | ✓ `node --test test/check-doc-links.test.js` 7/7; `npm test` 306/306 |
| 9 | Gate verde | ✓ `npm run verify:repository` termina con código 0 (`[OK] Verificación determinista del repositorio aprobada.`, con el smoke del tarball en 4 runtimes) |
| 10 | Alcance | ✓ `git diff --quiet -- docs/requirements docs/adr skills` y `docs/specs/` inexistente. Fuera de «Componentes afectados» solo cambian `specs/README.md` (traspaso CR-002 de STORY-153), los artefactos de esta historia, la casilla de `epic.md` y `scripts/check-doc-links.js` (ronda 1, hallazgo #2, vía (a), en la lista blanca) |
| 11 | Idioma | ✓ todo el texto nuevo está en español |

### Contrato 3: coincidencias restantes de `SPECS_BASE|SDDF_ROOT|root: docs`

| Archivo | Clase |
|---|---|
| `AGENTS.md:10-11` | Frase de retiro (viñeta «Layout fijo») y de transición (`root: docs` del repo) |
| `README.md:156, 214, 372` | Diagnóstico del layout legado, bloque de migración a 5.0.0 y frase de retiro |
| `docs/constitution.md:138` | Frase de retiro |
| `docs/guides/artifact-directory-migration.md` | Sección 5.0.0 (cuándo aplica y pasos 3 y 9) y registro histórico 1.x→2.x, con la nota final en pasado |
| `docs/guides/root-folder-practices.md:17-18, 49, 74, 82` | Retiro, regla del gate, diagnóstico y checklist (que exige que no estén) |
| `docs/guides/sddf-commands-pipeline.md:25` | Frase de retiro |
| `docs/guides/skill-structural-pattern.md:45-46, 65` | Retiro y regla R3 del gate |
| `docs/index.md` (3 títulos) | Títulos de nodos históricos: STORY-049, ADR-0001 y el plan 6 de EPIC-17 |

Ninguna coincidencia presenta el mecanismo como vigente.

---

## Estado del gate y traspaso

- **STORY-157:** la reparación del índice de slugs del checker se adelantó a esta historia (ronda 1, vía (a)), así que ya no le corresponde. Sigue teniendo que retirar `root: docs` de `sddf.config.yaml` y la viñeta «Transición EPIC-26» de `AGENTS.md`.
- **`.env.template`** sigue documentando `SDDF_ROOT` como override opcional, comentado; el gate solo prohíbe asignarla. No estaba en el alcance de D-3. Conviene retirarla en STORY-157 con el resto de CS-3.
- **CR-001 de design.md (pendiente):** `docs/runbooks/actualizar-spec-de-proyecto.md`, `docs/product/` y `docs/domains/` siguen citando `$SPECS_BASE` o `docs/specs`; `docs/guardrails/gr-ai-security-checklist.md:170-173` cita rutas de work items movidos. Hay que decidir si los asume STORY-157 o una historia de deuda.
- **CR-002 de design.md:** el orden quedó 153 → 154 → 157. STORY-157 debe retirar la viñeta de transición; su AC-3 aún no lo dice.
- **CR-003 de design.md (al publicar):** `[Unreleased] › Deprecated` promete eliminar `story-improve` en 5.0.0 «desde 4.2.0», y la entrada BREAKING declara 5.0.0. Quien publique decide.
- **ADR-0016 y `date:`:** ADR-0016 solo fija `updated:` → `created:`. La guía 5.0.0 incluye el tercer nivel `date:` que usó la migración (nota de EPIC-26, CR-001 de STORY-153). `AGENTS.md` y `root-folder-practices.md` citan solo los dos niveles del ADR.

---

## Cumplimiento DoD — Fase IMPLEMENT

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`), 24 criterios.

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | Se cumplen AC-1 (contratos 1–4), AC-2 (contratos 5–7) y AC-3 (contratos 8–9): el chequeo de enlaces termina sin errores y `verify:repository` sale con código 0 |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: rutas y capacidades verificadas (T005, contrato 2). CNF-2: texto en español (contrato 11) |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-2 a D-10 aplicados; los desvíos por el orden 153 → 154 están en «Desvío de la secuencia de D-1» |
| 4 | No hay regresiones | ✓ | `npm test` 306/306 y `npm run verify:repository` con código 0; los enlaces rotos bajan de 444 a 0 |
| 5 | Convenciones de `constitution.md` | ✓ | La prueba sigue el estilo de los casos vecinos (`fixture`, `assert.match`); la documentación está en español |
| 6 | Sin código comentado ni `TODO` | ✓ | No se añadió ninguno; el `<!-- TODO: … -->` de `sddf-commands-pipeline.md` ya existía |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | El caso nuevo usa solo `fs`, `path`, `checkDocumentation` y `fixture`, ya importados |
| 8 | Linter y formateador sin errores | ✓ | El repo no define linter; `verify:syntax` OK (44 archivos) |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Uso de `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Skill nuevo incluido en `files` | ✓ | No aplica |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Solo documentación y un test; sin prompts, datos sensibles ni caracteres ocultos |
| 13 | Se cumple gr-code-security-checklist | ✓ | El test escribe solo en un `mkdtemp` que se limpia con `t.after` |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | No aplica: no se tocan skills (`git diff --quiet -- skills`) |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica |
| 16 | Casos de prueba ejecutados según skill-master | ✓ | No aplica a skills; se ejecutaron las pruebas del checker (7/7) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 32/32 `[x]`; T030 se cerró en la ronda 1 de correcciones |
| 18 | README/docs actualizados si cambian contratos | ✓ | `README.md`, `AGENTS.md`, constitución, arquitectura, guías e índice |
| 19 | Decisiones no previstas documentadas en `design.md` | ⚠️ | Están en este reporte («Desvío de la secuencia de D-1»), no en `design.md`: este skill no reescribe artefactos de planning |
| 20 | CHANGELOG actualizado si aplica | ✓ | `### BREAKING — layout fijo de tres raíces (EPIC-26, requiere 5.0.0)` |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI. Localmente, `npm run verify:repository` (el mismo gate de `quality.yml`) termina con código 0 |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ⚠️ | `SDDF_ROOT` se documenta como retirada, pero `.env.template` aún la describe como override opcional comentado (fuera del alcance de D-3; traspaso a STORY-157) |
| 24 | Despliegue reversible sin pérdida | ✓ | Solo cambios de texto y un caso de test, revertibles con `git revert` |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

Pasos recomendados:
1. Ejecutar `npm test` (306/306 tras la ronda 1 de correcciones).
2. Ejecutar `npm run verify:repository` (código 0 tras la ronda 1).
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas.
