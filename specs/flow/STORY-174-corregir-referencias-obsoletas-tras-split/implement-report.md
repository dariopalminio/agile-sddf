---
type: implement-report
id: STORY-174
slug: STORY-174-implement-report
title: "Implement Report: Skill epic-refine: corregir referencias obsoletas tras un split"
story: STORY-174
created: 2026-10-29
updated: 2026-10-29
---

# Reporte de Implementación: Skill epic-refine: corregir referencias obsoletas tras un split

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-174 |
| Total de tareas | 24 |
| Tareas completadas | 24 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-29 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar que STORY-165 está implementada | ✓ completado | — (existen `SKILL.md` con Paso 3, tabla de enrutamiento y plan `C-NN │ Origen │ …`, `references/mad-corrections.md`, el template del reporte y `evals.json` `1.1.0` con último caso `TC-013`) |
| T002 | Invocar `skill-master` para modificar `skills/epic-refine/` | ✓ completado | — |
| T003 | Sub-sección «Detección COH» en el Paso 3 | ✓ completado | `skills/epic-refine/SKILL.md` |
| T004 | Fila COH en la tabla de enrutamiento y «Qué NO hace» (`/story-split`) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T005 | `description` con COH y disparador, ≤ 500 caracteres | ✓ completado | `skills/epic-refine/SKILL.md` (490 caracteres) |
| T006 | Catálogo COH: ámbito, forma del slug y existencia | ✓ completado | `skills/epic-refine/references/coh-corrections.md` |
| T007 | Catálogo COH: exclusión MAD-02, «ya resuelto» por INT-03, agrupación y numeración | ✓ completado | `skills/epic-refine/references/coh-corrections.md` |
| T008 | Catálogo COH: regla de reemplazo, forma del cambio, relectura y contenido no confiable | ✓ completado | `skills/epic-refine/references/coh-corrections.md` |
| T009 | Comentario guía de `hallazgos` con las filas COH | ✓ completado | `skills/epic-refine/assets/epic-refine-report-template.md` |
| T010 | Capacidades COH en la ficha del skill | ✓ completado | `skills/epic-refine/README.md` |
| T011 | Fixture `split-slug-obsoleto/` | ✓ completado | `skills/epic-refine/examples/split-slug-obsoleto/` |
| T012 | Fixture `split-sin-reemplazo/` | ✓ completado | `skills/epic-refine/examples/split-sin-reemplazo/` |
| T013 | Fixture `split-ambiguo/` | ✓ completado | `skills/epic-refine/examples/split-ambiguo/` |
| T014 | Fixture `split-reportado/` | ✓ completado | `skills/epic-refine/examples/split-reportado/` |
| T015 | Fixture `split-aprobada/` | ✓ completado | `skills/epic-refine/examples/split-aprobada/` |
| T016 | Evals TC-014…TC-018 y versión `1.2.0` | ✓ completado | `skills/epic-refine/evals/evals.json` |
| T017 | Escritor COH en la sección `historias` del template de épica (central + seed) | ✓ completado | `docs/templates/epic-template.md`, `skills/epic-creation/assets/epic-template.md` |
| T018 | Escritor COH en `related:` del template de historia (central + seed) | ✓ completado | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` |
| T019 | Fila y párrafo de `epic-refine` en la guía de pipeline | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T020 | Verificar tamaño del `SKILL.md` y de la `description` | ✓ completado | — (263 líneas; 490 caracteres) |
| T021 | Verificar UTF-8 sin BOM e igualdad central = seed | ✓ completado | — (ningún archivo con `EF BB BF`; `cmp` sin diferencias en ambos templates) |
| T022 | `npm test` y `npm run verify:repository` | ✓ completado | — (353/353 tests; gate determinista aprobado) |
| T023 | `graphify update .` | ✓ completado | `graphify-out/` |
| T024 | Registrar `npm run test:eval -- epic-refine` como pendiente manual | ✓ completado | — (ver «Nota sobre los Tests Generados») |

Cambios adicionales, coherentes con el diseño:

- `skills/epic-refine/references/mad-corrections.md`: la nota final remite a la familia COH (`coh-corrections.md`) en lugar de «otra familia (STORY-174)».
- `skills/epic-refine/SKILL.md`: además de T003–T005, se ajustaron los puntos que la familia COH toca en los Pasos existentes: la tabla de Entrada (catálogo COH leído en el Paso 3; nombres de directorio de `specs/flow/`), la regla «No inventar» (el reemplazo COH sale del nombre de un directorio), el Paso 3.4 (sin `H-NNN` ya no salta al Paso 8 antes de la detección COH), la carga de catálogos del Paso 4, la columna **Origen** del Paso 5 (`COH-<n>`) y el orden de las filas del Paso 8 (los COH tras los `H-NNN`).
- `CHANGELOG.md`: la entrada de `/epic-refine` añade la corrección de referencias obsoletas (STORY-174).
- `design.md`: CR-005 documenta el ajuste de los fixtures y de TC-014 (ver abajo).

### Desvío documentado (CR-005)

D-8 describía los reportes de los fixtures como `NEEDS-REFINEMENT` con un único INT-05, pero `epic-analyze` declara `APPROVED` con 0 ERROR y ≤ 3 WARNING. Los fixtures `split-slug-obsoleto/`, `split-sin-reemplazo/`, `split-ambiguo/` y `split-reportado/` añaden una línea `**STORY-307**` sin `story.md` (H-001 INT-01, ERROR) antes de la línea F1 (H-002 INT-05); en `split-reportado/` el MAD-02 es H-003. `split-aprobada/` no lleva esas dos líneas, así que su `Sin hallazgos.` es veraz. TC-014 comprueba el reemplazo por `contains` porque el slug obsoleto aparece por diseño en **Antes** del plan y del reporte.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Requiere ejecución de tests: AC-1 → TC-014 y AC-2 → TC-015/TC-016 se ejecutan con `npm run test:eval -- epic-refine` a criterio humano (AGENTS.md) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1: `.bak` antes de cada escritura (Pasos 6–7 del `SKILL.md`, sección 4 de `coh-corrections.md`); CNF-2: ningún archivo creado o modificado empieza por `EF BB BF`; CNF-3: el detalle COH vive en `references/coh-corrections.md` y el `SKILL.md` tiene 263 líneas |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | D-1…D-8 implementados; el único desvío (fixtures y TC-014) está documentado en CR-005 |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test`: 353/353; `npm run verify:repository` aprobado; TC-001…TC-013 sin cambios |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | Markdown en español, layout fijo (`<!-- SDDF-FIXED-LAYOUT: v1 -->` intacto), fuente única en `skills/epic-refine/` |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Sin código ejecutable nuevo; ningún `TODO` en los archivos modificados |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | No se añadió código ejecutable al paquete |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ✓ | `npm run verify:repository` aprobado |
| 9 | No se introducen dependencias nuevas sin aprobación | ✓ | `package.json` sin cambios |
| 10 | Se usó el skill `skill-master` | ✓ | Invocado (T002) antes de editar el `SKILL.md` y crear el catálogo (presupuesto de `description`, conservación de disparadores, detalle en `references/`) |
| 11 | Un skill nuevo está en `files` de `package.json` | ✓ | No hay skill nuevo; `skills/` completo ya está en `files` |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | El reemplazo COH sale solo del nombre de un directorio, nunca del texto de la fuente; texto con forma de orden → `notas` (sección «Contenido no confiable» del catálogo) |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Sin código ejecutable, credenciales ni rutas absolutas |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | `description` con `>-` en 490 caracteres; `SKILL.md` < 500 líneas; `coh-corrections.md` < 300 líneas y enlazado desde el `SKILL.md` en el punto de uso (Paso 3 y tabla del Paso 4); inputs de los evals existen |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | `skills/epic-refine/evals/evals.json` `1.2.0` con 18 casos |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; AGENTS.md reserva `npm run test:eval` a criterio humano |
| 17 | `tasks.md` tiene todas las tareas `[x]` | ✓ | 24/24 |
| 18 | README o docs actualizados si cambian contratos | ✓ | `README.md` del skill, templates de épica e historia, `sddf-commands-pipeline.md` §2, `CHANGELOG.md` |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-005 |
| 20 | CHANGELOG actualizado si aplica | ✓ | Entrada `/epic-refine` de `[Unreleased]` ampliada con STORY-174 |
| 21 | El build de CI pasa sin errores | ✓ | `npm run verify:repository` (el mismo gate que `quality.yml`) aprobado en local |
| 22 | No hay secrets ni credenciales expuestos | ✓ | Fixtures y documentos sin credenciales |
| 23 | Variables de entorno documentadas | ✓ | No se añaden variables de entorno |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambios solo en Markdown/JSON versionados; el skill crea `.bak` antes de escribir y restaura si falla la relectura |

**Resumen:** 22/24 criterios ✓ · 2 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

Pendiente de ejecución manual (criterio humano, AGENTS.md): `npm run test:eval -- epic-refine` para TC-014…TC-018 (V-1…V-4 de `design.md`).

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
