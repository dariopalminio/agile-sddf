---
type: implement-report
id: STORY-152
slug: STORY-152-implement-report
title: "Implement Report: Migrar los skills de proyecto y transversales"
story: STORY-152
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de proyecto y transversales

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-152 |
| Total de tareas | 41 |
| Tareas completadas | 41 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

**Decisiones del responsable antes de empezar:**

- **WIP = 1:** STORY-151 seguía en `CODE-REVIEW/IN-PROGRESS` (veredicto `NEEDS-CHANGES`). El responsable autorizó de forma explícita implementar STORY-152 en paralelo.
- **Tamaño:** 41 tareas, por encima del umbral de 20. El responsable eligió implementarlas en una sola sesión, en el orden de D-15.
- **T001 (CR-001):** ADR-0016 existe y `scripts/verify-fixed-layout.js` existe, con `PENDING_MIGRATION` y la región `SDDF-LEGACY-DIAGNOSTIC`. STORY-147 y STORY-148 están en `CODE-REVIEW/DONE`, con la implementación entregada. Por eso D-11 no se aplazó.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondiciones CR-001 | ✓ completado | — |
| T002 | Línea base e inventario | ✓ completado | `.tmp/story-implement/STORY-152/baseline.txt` |
| T003 | Eliminar `skills/docs-wiki-builder/` | ✓ completado | `skills/docs-wiki-builder/**` (eliminado) |
| T004 | Quitar el alias de `memory-system` | ✓ completado | `skills/memory-system/SKILL.md`, `evals/evals.json` |
| T005 | Menciones vigentes en la documentación | ✓ completado | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `docs/runbooks/actualizar-spec-de-proyecto.md`, `README.md` |
| T006 | CHANGELOG `### Removed` | ✓ completado | `CHANGELOG.md` |
| T007 | Retirar 12 entradas de `PENDING_MIGRATION` (RED) | ✓ completado | `scripts/verify-fixed-layout.js`, `.tmp/…/red.txt` |
| T008 | Migrar `project-begin` | ✓ completado | `skills/project-begin/{SKILL,README}.md` |
| T009 | Migrar `project-discovery` | ✓ completado | `skills/project-discovery/{SKILL,README}.md` |
| T010 | Migrar `project-planning` (D-8) | ✓ completado | `skills/project-planning/{SKILL,README}.md`, `assets/agents/planning.md` |
| T011 | Migrar `project-story-mapping` | ✓ completado | `skills/project-story-mapping/{SKILL,README}.md` |
| T012 | Migrar `project-context-diagram` | ✓ completado | `skills/project-context-diagram/{SKILL,README}.md`, `examples/test-0{1,2}-*.md` |
| T013 | Migrar `project-flow` | ✓ completado | `skills/project-flow/SKILL.md` |
| T014 | Migrar `header-aggregation` (D-7) | ✓ completado | `skills/header-aggregation/SKILL.md` |
| T015 | Migrar `reverse-engineering` | ✓ completado | `skills/reverse-engineering/{SKILL,README}.md` |
| T016 | Migrar `sddf-constitution` | ✓ completado | `skills/sddf-constitution/{SKILL,README}.md` |
| T017 | Mover los fixtures de `header-aggregation` | ✓ completado | `skills/header-aggregation/examples/*/specs/flow/**`, `examples/*/sddf.config.yaml` |
| T018 | Evals de `header-aggregation` | ✓ completado | `skills/header-aggregation/evals/evals.json` |
| T019 | Pruebas nuevas del origen flow (RED) | ✓ completado | `test/memory-system.test.js` (S152-UT-001…007) |
| T020 | Origen flow en el motor (D-4) | ✓ completado | `skills/memory-system/scripts/memory-system.js` |
| T021 | Catálogo de diez capas (D-5) | ✓ completado | `memory-system.js`, `assets/scaffold/specs/**` (eliminado) |
| T022 | `SPECS_BASE` → `DOCS_DIR` en scripts | ✓ completado | `memory-system.js`, `scripts/epic-template.js` |
| T023 | Template del índice | ✓ completado | `skills/memory-system/assets/index-template.md` |
| T024 | Mover los work items de los fixtures | ✓ completado | `skills/memory-system/examples/<8 fixtures>/specs/flow/**`, `examples/*/sddf.config.yaml` |
| T025 | Adaptar las pruebas existentes (GREEN) | ✓ completado | `test/memory-system.test.js`, `test/requirements.test.js` |
| T026 | Paso 0 y rutas de `memory-system/SKILL.md` | ✓ completado | `skills/memory-system/SKILL.md` |
| T041 | Comportamiento nuevo en `memory-system/SKILL.md` | ✓ completado | `skills/memory-system/SKILL.md` |
| T027 | README y references de `memory-system` | ✓ completado | `skills/memory-system/README.md`, `references/{memory,dod}-rules.md`, `examples/sane/docs/constitution.md` |
| T028 | Evals de `memory-system` | ✓ completado | `skills/memory-system/evals/evals.json` |
| T029 | Reescribir `skill-preflight/SKILL.md` | ✓ completado | `skills/skill-preflight/SKILL.md` |
| T030 | Verificación 3 en la región de diagnóstico | ✓ completado | `skills/skill-preflight/SKILL.md` |
| T031 | README de `skill-preflight` | ✓ completado | `skills/skill-preflight/README.md` |
| T032 | Evals de `skill-preflight` | ✓ completado | `skills/skill-preflight/evals/evals.json` (2.1.0) |
| T033 | Documentación del motor (D-14) | ✓ completado | `docs/architecture/memory-system.md`, `docs/architecture/README.md`, `README.md` |
| T034 | `verify:layout` en verde | ✓ completado | `.tmp/story-implement/STORY-152/green.txt` |
| T035 | Contratos 1, 2, 3, 5 y 8 | ✓ completado | — |
| T036 | Contratos 9, 10 y 11 | ✓ completado | — |
| T037 | Validación de evals (`--dry-run`) | ✓ completado | `.tmp/story-implement/STORY-152/evals-dry-run.txt` |
| T038 | `npm test` y `verify:repository` | ✓ completado | `.tmp/story-implement/STORY-152/final.txt` |
| T039 | Revisión de alcance (`git diff`) | ✓ completado | — |
| T040 | `graphify update .` e informe | ✓ completado | `graphify-out/**`, este reporte |

---

## Resultados de verificación (T034–T039)

| Verificación | Resultado |
|---|---|
| `npm run verify:layout` (contrato 4) | exit 0: `[OK] Contrato de layout fijo verificado en 35 skill(s); 11 pendiente(s) de migración`. Los 11 pendientes son los `story-*` de otras historias de EPIC-26. |
| RED previo (T007) | exit 1, con errores en los 11 skills migrados y sin errores `PENDING_MIGRATION: … no existe` |
| Contrato 1 | `grep -rnE "SPECS_BASE\|SDDF_ROOT"` sobre los diez skills de AC-1: sin salida (CNF-3: 26 → 0 archivos) |
| Contrato 2 | `SPECS_BASE` no aparece en `skills/skill-preflight`. En `SKILL.md`, `SDDF_ROOT` solo aparece en la línea 100, dentro de la región. Fuera del `SKILL.md`, solo en la lista de señales del `README.md` y en los contextos de los evals que fijan L3. |
| Contrato 3 | `<!-- SDDF-FIXED-LAYOUT: v1 -->` aparece exactamente una vez en cada uno de los once `SKILL.md` |
| Contrato 5 | La única línea que combina `root` y `sddf.config.yaml` es la señal L2, dentro de la región de `skill-preflight` |
| Contrato 8 | `skills/docs-wiki-builder/` no existe. `docs-wiki-builder` no aparece en `skills/`, `docs/architecture/`, `docs/guides/`, `docs/runbooks/` ni `README.md`. |
| Contrato 9 | `## [Unreleased]` › `### Removed` con `BREAKING`, `docs-wiki-builder` y `/memory-system index` |
| Contratos 10 y 11 | La región contiene L1–L3 y la guía. TC-005–TC-007 están presentes. Se conserva «diagnóstico explícito» y no se cita `openspec/config.yaml`. Los verbos de escritura solo aparecen en «No hace». |
| Contrato 12 | Los tres `evals.json` parsean, y `npm run test:eval -- <skill> --dry-run` termina con exit 0 en `skill-preflight`, `memory-system` y `header-aggregation` |
| Contrato 13 | `npm test`: 290/290, exit 0. `npm run verify:repository`: exit 0. |
| Contrato 6/7 | S152-UT-001…007 en verde: origen flow, harness speckit, `Historias archivadas`, `check` sobre nodos flow, repo sin `specs/flow/`, transición `docs/specs/` y scaffold sin `docs/specs/` con `LAYERS.length === 10` |
| AC-1 a nivel motor | `memory-system index --dry-run` sobre `examples/sddf` lista `[[STORY-001-a]] — [story.md](../specs/flow/STORY-001-a/story.md)` bajo `## 🗂️ Work items (specs/flow/)` |
| Contrato 14 | El diff de la historia queda dentro de «Componentes afectados», más los artefactos de la historia y el fixture `examples/sane/docs/constitution.md` (texto «once» → «diez»). Ver la advertencia de cambios concurrentes. |

---

## Advertencias para la revisión

- **Línea base y cambios concurrentes:** la línea base (`baseline.txt`, 21:12) tenía 15 fallos preexistentes en `test/epic-template.test.js`, ajenos a esta historia. Durante la sesión alguien más modificó, fuera de esta implementación, `test/epic-template.test.js` y `skills/memory-system/examples/epic-template-v1/**/expected.md` (21:16–21:17), y también `docs/specs/epics/EPIC-1{3..9}-*/epic.md` (21:20–21:29). Después de esos cambios, `npm test` quedó en 290/290. Esos archivos no son parte de este diff y no se tocaron.
- **Dogfooding en transición:** no reinstales las copias de runtime (`.claude/skills/`) antes de STORY-153. En este repositorio, `/skill-preflight` informará las señales L1 (`docs/specs/`) y L2 (`root: docs` en `sddf.config.yaml`): es lo esperado hasta migrar los work items.
- **TC-010 de `memory-system` (preexistente):** el caso espera que `ensure --fix-frontmatter` normalice `docs/guides/a.md` y `b.md`, pero el batch de `header-aggregation` nunca incluyó `guides/`, ni antes ni con D-7. La historia solo cambió el input a `REPO_ROOT`. Conviene revisar esa tensión cuando se ejecuten los evals reales.
- **Pendiente para STORY-154 (CR-002 y CR-003):** la guía `artifact-directory-migration.md` todavía no indica que se borren a mano las copias instaladas de `docs-wiki-builder` ni que se elimine `root` de `sddf.config.yaml`. El CHANGELOG aún no registra como incompatible el cambio a diez capas, con índice que incluye `specs/flow/`. La regla «Raíz única … configurable» de `docs/architecture/memory-system.md` §3 y otras guías con `$SPECS_BASE` quedan para su alcance documental.
- **Desviaciones menores:** se registran en `design.md` › CR-004.

---

## Cumplimiento DoD — Fase IMPLEMENT

DoD cargado desde `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1 y AC-4 quedan verificados con el gate, las pruebas y los greps. AC-2 y AC-3 dependen de evals que no se ejecutaron (CNF-2): requiere ejecución de tests, no evaluable por story-implement. |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: contratos 2 y 5. CNF-2: los evals usan rutas fijas y validan con `--dry-run`. CNF-3: 0 coincidencias. |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1 a D-14 implementados. Las desviaciones menores están en CR-004. |
| 4 | Sin regresiones | ✓ | `npm test` 290/290 y `verify:repository` con exit 0 |
| 5 | Convenciones de `constitution.md` | ✓ | Markdown y JS nativo en el estilo del código existente, documentación en español |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No se añadió ninguno |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `FLOW_DIR`, `FLOW_ARCHIVE`, `deriveFlowLayer` y `scanFlowNodes` se usan. `specs3Levels` sigue en uso en las pruebas. |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` (incluye `verify-syntax`) con exit 0. El repo no define otro linter. |
| 9 | Sin dependencias nuevas | ✓ | Sin cambios en `dependencies` |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se creó ningún skill |
| 11 | Skill nuevo en `package.json › files` | ✓ | No aplica. `skills/` se publica completo y se eliminó un skill. |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | No se recorrió formalmente. Los cambios son de solo lectura (origen flow) o documentales. |
| 13 | Se cumple [[gr-code-security-checklist]] | ⚠️ | No se recorrió formalmente. El motor no escribe fuera de `docs/` (guardia `assertInsideRoot` sin cambios). |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: no se creó ningún skill |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | `memory-system`, `header-aggregation` y `skill-preflight` tienen evals actualizados |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests, no evaluable por story-implement. Los evals reales quedan a criterio humano (contrato 15). |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 41/41 |
| 18 | README y docs actualizados si cambian contratos | ✓ | READMEs de los skills, `docs/architecture/memory-system.md`, `docs/architecture/README.md`, `README.md` |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 |
| 20 | CHANGELOG actualizado si aplica | ✓ | `### Removed` (BREAKING) de `docs-wiki-builder`. El cambio de capas queda para STORY-154 (CR-003). |
| 21 | El build de CI pasa | ⚠️ | Requiere ejecución de CI. El gate local equivalente (`verify:repository`) pasa. |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno añadido |
| 23 | Variables de entorno documentadas | ✓ | `SDDF_ROOT` queda documentada como señal legada (L3) en `skill-preflight` |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambios de fuente versionados, sin migración de datos |

**Resumen:** 19/24 criterios ✓ · 5 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.
(En esta ejecución `npm test` se corrió como parte de T025 y T038: 290/290.)

Pasos recomendados:
1. Ejecutar los evals reales a criterio humano (contrato 15): `npm run test:eval -- skill-preflight`, `-- memory-system` y `-- header-aggregation`.
2. Si algún eval falla, revisar el SKILL.md correspondiente y ajustar.
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas.
