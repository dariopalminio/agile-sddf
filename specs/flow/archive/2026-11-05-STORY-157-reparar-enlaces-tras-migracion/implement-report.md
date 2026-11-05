---
type: implement-report
id: STORY-157
slug: STORY-157-implement-report
title: "Implement Report: Reparar enlaces y validar el gate tras la migración"
story: STORY-157
created: 2026-10-24
updated: 2026-10-24
---

# Reporte de Implementación: Reparar enlaces y validar el gate tras la migración

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-157 |
| Total de tareas | 20 |
| Tareas completadas | 20 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-24 |

**Estado:** ✅ Implementación completa

`MIGRATION_COMMIT` = `8df4b118b0a948439c03907c5537bd21d24a2c87` (`feat: implement story STORY-153`).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | P1: `docs/specs` ausente; `specs/flow/` y `specs/flow/archive/` presentes | ✓ completado | — |
| T002 | P2: árbol limpio en `specs`/`docs/specs`; `MIGRATION_COMMIT` resuelto | ✓ completado | `.tmp/story-implement/STORY-157/migration-commit.txt` |
| T003 | P3/P4: `pending: []`; ADR-0016 existe; viñeta «Transición EPIC-26» presente | ✓ completado | — |
| T004 | Línea base (`npm test`, `verify:links`, `verify:repository`) e inventario D-2 | ✓ completado | `.tmp/…/baseline.txt`, `.tmp/…/inventory.txt` |
| T005 | Pruebas del checker (RED) | ✓ completado | `test/check-doc-links.test.js` |
| T006 | `HISTORICAL_EXCLUSIONS` → `specs` (GREEN) | ✓ completado | `scripts/check-doc-links.js` |
| T007 | `/memory-system index` y contrato #2 | ✓ completado | — (`docs/index.md` sin cambios: ya regenerado) |
| T008 | Rutas del checklist de seguridad | ✓ completado | `docs/guardrails/gr-ai-security-checklist.md` |
| T009 | Runbook: comandos y tabla de fuentes | ✓ completado | `docs/runbooks/actualizar-spec-de-proyecto.md` |
| T010 | Dominios: ubicaciones vigentes | ✓ completado | `docs/domains/domain-knowledge-artifacts.md`, `docs/domains/domain-work-item-hierarchy.md` |
| T011 | Producto: 1 línea cada uno | ✓ completado | `docs/product/README.md`, `docs/product/stakeholders.md` |
| T012 | Inventario recalculado y clasificado | ✓ completado | — (ver «Líneas conservadas») |
| T013 | `sddf.config.yaml` sin `root` ni `$SPECS_BASE` | ✓ completado | `sddf.config.yaml` |
| T014 | `AGENTS.md` sin la viñeta de transición | ✓ completado | `AGENTS.md` |
| T015 | `verify:links` y grep del contrato #3 | ✓ completado | `.tmp/…/links.txt` |
| T016 | AC-2: historial y `docs/requirements/` | ✓ completado | — (ver «Verificación AC-2») |
| T017 | CS-2, lista vacía y CS-3 | ✓ completado | — |
| T018 | `npm test` y `npm run verify:repository` | ✓ completado | `.tmp/…/final-test.txt`, `.tmp/…/final-repo.txt` |
| T019 | Alcance del diff | ✓ completado | — |
| T020 | `graphify update .` y este reporte | ✓ completado | `implement-report.md` |

---

## Detalle por fase

### Puerta de entrada (D-1)

| # | Resultado |
|---|---|
| P1 | ✓ `docs/specs` no existe; `specs/flow/` (27 épicas, 51 stories activas) y `specs/flow/archive/` (98 stories) existen |
| P2 | ✓ `git status --porcelain -- specs docs/specs` vacío. El comando literal del diseño (`git log --diff-filter=R -1 -- specs/flow`) no devuelve nada: con el pathspec limitado a `specs/flow`, git no ve el origen del renombre. Se obtuvo con `git log --diff-filter=R -M` sin pathspec → `8df4b11` |
| P3 | ✓ `node scripts/verify-fixed-layout.js --json` → `errors: []`, `pending: []` (35 skills) |
| P4 | ✓ `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` existe; `AGENTS.md` l. 11 tenía la viñeta |

Línea base: `npm test` 306/306, `verify:links` `[OK]` y `verify:repository` exit 0. Contra lo previsto en T004, `enlaces activos` ya estaba en verde: STORY-153 dejó `docs/index.md` regenerado con rutas `../specs/flow/…` y el corpus de slugs de `check-doc-links.js` ya incluía `specs/`.

### Checker de enlaces (D-5)

- El corpus `specs/` del índice de slugs ya existía (`checkDocumentation`, l. 246–247, aportado por STORY-153), al igual que un caso `resolves wikilinks to work items under specs/flow/`. Lo pendiente de D-5 era `HISTORICAL_EXCLUSIONS` y las pruebas.
- RED: de los tres casos nuevos, fallaba `HISTORICAL_EXCLUSIONS informa specs/ como raíz histórica de work items`; los de resolución en `archive/` y de `[[STORY-999-inexistente]]` pasaban porque el corpus ya existía.
- GREEN: `HISTORICAL_EXCLUSIONS = ['CHANGELOG.md', 'docs/adr', 'specs']` → 10/10. El fixture crea `specs/flow`; el caso de deduplicación usa `specs/flow/EPIC-01-a/`.

### Índice (D-4)

`node skills/memory-system/scripts/memory-system.js index --root docs` → 403 nodos, sin diff en `docs/index.md`. Contrato #2: 235 entradas `../specs/flow/…` (117 en `archive/`). `grep -cE "specs/(epics|stories)" docs/index.md` = 1: es el **título** de STORY-108 («Renombrar specs/02-epics/ → specs/epics/…», l. 380), tomado de su frontmatter; no es una ruta (registro histórico).

---

## Líneas conservadas (T012, contrato #3)

Inventario inicial: 119 líneas; final: 89 (75 tras las exclusiones del contrato #3). Ninguna está en clase «ruta concreta» ni «descripción vigente».

| Archivo | Líneas | Clase | Justificación |
|---|---|---|---|
| `README.md` | 156 | descripción del layout legado | señales que detecta `/skill-preflight` |
| `README.md` | 214, 221, 419–421 | registro histórico | notas y tabla de migración de versiones anteriores |
| `SECURITY.md` | 30 | registro histórico | cambios de la 2.0.0 |
| `docs/architecture/memory-system.md` | 238, 286, 314, 324 | descripción del layout legado | soporte del motor para repos sin migrar |
| `docs/guides/artifact-directory-migration.md` | 29 líneas | descripción del layout legado | guía de migración: `docs/specs/` es el origen |
| `docs/guides/root-folder-practices.md` | 69, 74, 81 | descripción del layout legado | diagnóstico de `skill-preflight` |
| `docs/guides/flight-leves-model.md` | 25 | registro histórico | nota de terminología de la v1.x |
| `docs/guides/sdd.md` | 64 | genérico | convenciones de carpetas de distintas herramientas SDD |
| `docs/index.md` | 350, 380 | registro histórico | títulos de work items generados por el motor |
| `docs/domains/domain.md` | 34 | deuda previa, fuera de alcance | cita `docs/specs/01-projects/…/project.md`, que eliminó ADR-0013; no es una ruta movida por STORY-153 |
| `docs/runbooks/actualizar-spec-de-proyecto.md` | 45, 199 (y 27, 67 con `$SPECS_BASE/specs/01-projects/`) | deuda previa, fuera de alcance | el runbook resincroniza `project.md` (nivel 01-projects retirado por ADR-0013); no son rutas movidas por STORY-153 |
| `scripts/check-doc-links.js` | 30 → `specs` | — | reescrito (T006) |
| `scripts/migrate-specs-to-flow.js`, `test/migrate-specs-to-flow.test.js` | 8 + 8 | fixture/default histórico | migración única de STORY-153: `docs/specs/` es su origen |
| `test/check-doc-links.test.js` | 51, 54 | fixture | caso que prueba un enlace roto a la ruta retirada |
| `test/sddf-constitution.test.js`, `test/verify-fixed-layout.test.js`, `test/verify-validation-contract.test.js` | 1 cada uno | fixture | rutas legadas usadas como entrada negativa |

---

## Verificación AC-2 (D-7)

| Verificación | Resultado |
|---|---|
| `git log --follow` sobre `specs/flow/archive/2026-04-22-STORY-001-project-begin/story.md` (primera archivada en orden alfabético y story con solo `date:`) | ✓ 13 commits; 12 anteriores a `8df4b11`, el más antiguo `8635beb 2026-04-22` |
| `git log --follow` sobre `specs/flow/archive/2026-04-23-STORY-039-publicar-framework-en-npm/story.md` | ✓ 9 commits; 8 anteriores a `8df4b11` |
| Renombre detectado en `8df4b11` | ✓ `{docs/specs/stories/STORY-001-project-begin => specs/flow/archive/2026-04-22-STORY-001-project-begin}/story.md` y lo mismo para STORY-039; el commit tiene 717 `R` y 3 `A`. Requiere `git show -M -l0` sin pathspec: con pathspec (comando literal de D-7) o con el `diff.renameLimit` por defecto aparece como alta |
| `docs/requirements/` en `8df4b11` | ✓ el commit de migración no lo toca |
| `git status --porcelain -- docs/requirements` | ✓ vacío |
| `git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements` | ⚠️ exit 1: `docs/requirements/README.md` cambia un wikilink (`[[eliminar-specs-01-projects]]` → `[[asegurar-dos-niveles-de-flujo-epics-stories]]`) en `85d9229`, el renombre de ADR-0013, anterior a STORY-147. Ubicación sin cambios; ninguna historia de migración modificó el contenido |

**Incidente controlado:** `memory-system index` regenera también `docs/requirements/index.md` y le sube `updated:` aunque el contenido no cambie. Se revirtió (`git checkout -- docs/requirements/index.md`), así que esta historia no deja cambios en `docs/requirements/`.

---

## Cierre del contrato de salida global (D-8)

| Criterio | Resultado |
|---|---|
| CS-2 | ✓ `grep -rlE "SPECS_BASE|SDDF_ROOT" skills/` → solo `skills/skill-preflight/` (`SKILL.md`, `README.md`, `evals/evals.json`), todas menciones de diagnóstico del layout legado; `verify-fixed-layout --json` → `errors: []` |
| Lista transitoria | ✓ `pending: []` |
| CS-3 | ✓ la única coincidencia en `skills/*/SKILL.md` es la señal L2 de `skill-preflight` (detecta la clave, no la lee como configuración); `skills/sddf-init/assets/` sin `^root:` (su eval tiene `root: docs` como `not_contains`); `sddf.config.yaml` sin `^root:` |
| CS-12 | ✓ `npm test` 309/309 exit 0; `npm run verify:repository` exit 0, `enlaces activos` incluido |

---

## Alcance del diff (T019)

12 archivos modificados, 0 nuevos versionados: `AGENTS.md`, `sddf.config.yaml`, `scripts/check-doc-links.js`, `test/check-doc-links.test.js`, `docs/guardrails/gr-ai-security-checklist.md`, `docs/runbooks/actualizar-spec-de-proyecto.md`, los 2 de `docs/domains/` y los 2 de `docs/product/`, más `story.md` y `tasks.md` de esta historia. `package.json`, `skills/`, `docs/adr/`, `CHANGELOG.md`, `docs/product/roadmap.md`, `docs/requirements/` y `docs/index.md` sin cambios.

---

## Defectos y observaciones devueltos a otras historias

| Historia | Observación | ¿Bloquea? |
|---|---|---|
| STORY-151 | Está en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (rework encolado por code review). El contrato de layout de sus skills `epic-*` está en verde (`pending: []`), así que P3 pasa, pero la historia no está entregada | No para esta historia; sí para cerrar la épica |
| STORY-152 | El motor de `memory-system index` no indexa `specs/README.md` (`[[specs-index]]`), contra lo esperado en D-4. No es un enlace roto: ningún documento activo enlaza `[[specs-index]]` | No |
| STORY-152 | `memory-system index` sube `updated:` de `docs/requirements/index.md` sin cambios de contenido (no es idempotente sobre ese archivo) | No |
| — (deuda previa) | `docs/domains/domain.md:34` y `docs/runbooks/actualizar-spec-de-proyecto.md` (l. 27, 45, 67, 199) citan el nivel `01-projects`, retirado por ADR-0013; el runbook entero describe un procedimiento obsoleto | No; candidato a una historia propia |

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin pasan | ⚠️ | AC-1 y AC-3 verificados; AC-2 verificado salvo el diff estricto de `docs/requirements/` contra `main`, explicado por `85d9229` (ajeno a la migración) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: sin scripts ni skills nuevos; CNF-2: sin dependencias nuevas |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1 a D-8 aplicados; los ajustes de comandos de git (pathspec y `-l0`) quedan registrados arriba |
| 4 | Sin regresiones | ✓ | `npm test` 309/309; `verify:repository` exit 0 |
| 5 | Convenciones de `constitution.md` | ✓ | Cambio mínimo en el estilo del archivo; pruebas con `node:test` |
| 6 | Sin código comentado ni `TODO` | ✓ | — |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `HISTORICAL_EXCLUSIONS` importado y usado en la prueba |
| 8 | Linter y formateador sin errores | ⚠️ | No hay linter configurado; el paso «sintaxis Node» del gate pasa |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nueva en `files` | ✓ | No aplica |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | Tabla de excepciones actualizada conservando archivo y línea; las líneas citadas siguen conteniendo el comando de cada regla |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Cambio de una constante informativa; sin entradas nuevas |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: no se tocan skills |
| 15 | Skills críticos con evals | ✓ | No aplica |
| 16 | Evals ejecutados | ✓ | No aplica: ningún skill modificado |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 20/20 |
| 18 | README/docs actualizados si cambian contratos | ✓ | `AGENTS.md` y `sddf.config.yaml` reflejan el retiro de `root` |
| 19 | Decisiones no previstas documentadas | ✓ | Sin decisiones nuevas; desviaciones operativas registradas en este reporte |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica: `CHANGELOG.md` es Non-Goal del diseño |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el gate local `verify:repository` (el mismo de `quality.yml`) pasa |
| 22 | Sin secrets | ✓ | — |
| 23 | Variables de entorno documentadas | ✓ | Ninguna nueva |
| 24 | Despliegue reversible | ✓ | Cambios de documentación, configuración y una constante; reversibles con git |

**Resumen:** 21/24 criterios ✓

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
En esta ejecución ya se corrieron `node --test test/check-doc-links.test.js` (10/10), `npm test` (309/309) y `npm run verify:repository` (exit 0).
