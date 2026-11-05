---
type: implement-report
id: STORY-164
slug: STORY-164-implement-report
title: "Implement Report: Skill story-complete: archivar historias canceladas"
story: STORY-164
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-164-archivar-historias-canceladas
---

<!-- Referencias -->
[[STORY-164-archivar-historias-canceladas]]

# Reporte de Implementación: Skill story-complete: archivar historias canceladas

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-164 |
| Total de tareas | 28 |
| Tareas completadas | 28 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-25 |

**Estado:** ✅ Implementación completa

Desviación respecto de design.md, registrada como **CR-004**: STORY-160 entregó un motor determinista (`skills/story-complete/scripts/story-complete.js`) que decide la admisión por estado y la fecha de archivo. D-1 y D-3 se aplicaron ahí (acción `archive-canceled`, código `CANCELED_NOT_DONE`, cadena `updated:` → `created:` → `date:`) y no solo en el texto del `SKILL.md`. **CR-005**: el contrato de verificación 6 encontró la regla vieja en `docs/guides/organization-of-artifacts.md`, que también se corrigió.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición CR-001 y anclas de los gates | ✓ completado | — (primer ID libre `TC-007`; gates en `planCompletion` del motor y `## Precondiciones` del SKILL.md; README y línea del pipeline existen) |
| T002 | Cinco evals nuevos de canceladas | ✓ completado | `skills/story-complete/evals/evals.json` (TC-007…TC-011) |
| T003 | Ajustar evals de STORY-160 | ✓ completado | `skills/story-complete/evals/evals.json` (TC-004 espera la confirmación de D-4 y excluye `ADR-0016`); el caso «`COMPLETED/DONE` sin fecha» solo existía en `test/story-complete.test.js` y se ajustó ahí (CR-004) |
| T004 | Prueba de `CANCELED` archivada en el índice | ✓ completado | `test/memory-system.test.js` (S164-UT-001) |
| T005 | Crear ADR-0017 | ✓ completado | `docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md` |
| T006 | ADR-0016: solo campos permitidos | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` (`status`, `superseded-by`, nota) |
| T007 | Índice de ADRs | ✓ completado | `docs/adr/README.md` |
| T008 | SKILL.md: frontmatter, precondiciones, reglas | ✓ completado | `skills/story-complete/SKILL.md` |
| T009 | Tabla de admisión por estado | ✓ completado | `skills/story-complete/SKILL.md`, `skills/story-complete/scripts/story-complete.js`, `test/story-complete.test.js` |
| T010 | Cadena de fecha | ✓ completado | `skills/story-complete/SKILL.md`, `skills/story-complete/scripts/story-complete.js`, `test/story-complete.test.js` |
| T011 | Confirmación, movimiento sin escritura, mensajes, salida | ✓ completado | `skills/story-complete/SKILL.md`, `skills/story-complete/scripts/story-complete.js` |
| T012 | README del skill | ✓ completado | `skills/story-complete/README.md` |
| T013 | `AGENTS.md` | ✓ completado | `AGENTS.md` (regla «Layout fijo (ADR-0017)» y entrada «Layout») |
| T014 | `docs/constitution.md` | ✓ completado | `docs/constitution.md` |
| T015 | `domain-state-management.md` invariante 6 | ✓ completado | `docs/domains/domain-state-management.md` |
| T016 | `domain-story-lifecycle.md` §5 y §9 | ✓ completado | `docs/domains/domain-story-lifecycle.md` |
| T017 | `domain-work-item-hierarchy.md` y `domain-knowledge-artifacts.md` | ✓ completado | ambos archivos de `docs/domains/` |
| T018 | `root-folder-practices.md` | ✓ completado | `docs/guides/root-folder-practices.md` |
| T019 | `sddf-architecture.md` | ✓ completado | `docs/architecture/sddf-architecture.md` |
| T020 | `sddf-commands-pipeline.md` | ✓ completado | `docs/guides/sddf-commands-pipeline.md` (no tiene una fila de tabla: se actualizó la frase de la sección «Configuración — Layout fijo») |
| T021 | Regenerar `docs/index.md` | ✓ completado | `docs/index.md` (vía `memory-system.js index`; solo añade ADR-0017) |
| T022 | `npm test` | ✓ completado | — (350/350) |
| T023 | `npm run verify:repository` | ✓ completado | — (`[OK] Verificación determinista del repositorio aprobada.`) |
| T024 | Verificación de ADR y documentos | ✓ completado | `docs/guides/organization-of-artifacts.md` (CR-005) |
| T025 | Prueba manual de AC-1 | ✓ completado | — (repo temporal en el scratchpad) |
| T026 | Prueba manual de AC-2 | ✓ completado | — (repo temporal en el scratchpad) |
| T027 | Evals a criterio humano | ✓ completado (no ejecutado) | — `npm run test:eval -- story-complete` queda a criterio humano (AGENTS.md, cuota) |
| T028 | `graphify update .` | ✓ completado | `graphify-out/` |

### Evidencia de las pruebas manuales (T025, T026)

Repo git temporal con cinco historias `CANCELED` versionadas, ejecutando el motor del skill (`plan` y luego `apply`):

| Caso | Resultado |
|---|---|
| AC-1 fila 1 (`updated: 2026-09-10`, `created: 2026-08-01`) | `specs/flow/archive/2026-09-10-STORY-301-uno/` · `R100` |
| AC-1 fila 2 (`created: 2026-08-01`) | `specs/flow/archive/2026-08-01-STORY-302-dos/` · `R100` |
| AC-1 fila 3 (`date: 2026-07-15`) | `specs/flow/archive/2026-07-15-STORY-303-tres/` · `R100` |
| AC-2 fila 1 (`CANCELED/IN-PROGRESS`) | `CANCELED_NOT_DONE`: «… estado actual CANCELED/IN-PROGRESS. Solo se archivan las historias CANCELED con substatus DONE.» |
| AC-2 fila 2 (`updated: pronto`, sin `created:`/`date:`) | `NO_ARCHIVE_DATE`: «… se buscó updated:, created: y date:.» |

`git diff --cached --stat -M` mostró solo renombres con 0 inserciones y 0 borrados (frontmatter idéntico, `status: CANCELED`); los orígenes dejaron de existir; el conteo activas + archivadas fue 5 antes y después; en AC-2, `git status --porcelain` y el conteo no cambiaron.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. Se ejecutaron en esta sesión: AC-1 y AC-2 pasan en `test/story-complete.test.js` y en las pruebas manuales T025/T026; AC-3 comprobado con T024. Los evals no se ejecutaron (T027) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. Ejecutado: CNF-1 (`git diff` de ADR-0016 muestra solo `status`, `superseded-by` y la nota), CNF-2 (§4 inv. 6 y §5/§9), CNF-3 (gate y `npm test` en verde, S164-UT-001), CNF-4 (conteo 5 → 5) |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | D-1…D-7 aplicados; desviaciones registradas en CR-004 (motor) y CR-005 (documento extra) |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. `npm test` 350/350 en esta sesión |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | CommonJS, `node:test`, mismo estilo que el motor de STORY-160; Markdown en español |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Sin `TODO` en el motor ni en las pruebas |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | `CANCELED_NOT_ADMITTED` eliminado sin restos; ningún import nuevo |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. `npm run verify:repository` en verde en local |
| 9 | No se introducen dependencias nuevas sin aprobación | ✓ | Sin cambios en `package.json` |
| 10 | Se usó `skill-master` para crear skills nuevos | ✓ | No se crea ningún skill (se modifica `story-complete`) |
| 11 | La ruta de un skill nuevo está en `files` de `package.json` | ✓ | Sin skill nuevo; `files` ya publica `skills/` completo |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | No hay superficie nueva de prompts ni de herramientas; no se revisó el checklist punto por punto |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Sin entradas nuevas: el motor sigue invocando `git` con argumentos en arreglo (`spawnSync`) y no escribe `story.md` para `CANCELED` |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica a la creación; el `SKILL.md` conserva `<!-- SDDF-FIXED-LAYOUT: v1 -->` y `verify-fixed-layout.js` pasa |
| 15 | Los skills críticos tienen pruebas `evals/evals.json` | ✓ | `skills/story-complete/evals/evals.json` con 11 casos; `verify-eval-inventory.js` acepta los IDs |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente (`skill-master`) | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. `npm run test:eval -- story-complete` queda a criterio humano (AGENTS.md) |
| 17 | `tasks.md` tiene todas las tareas marcadas `[x]` | ✓ | 28/28 `[x]` |
| 18 | README o docs relevantes actualizados si cambian contratos | ✓ | `skills/story-complete/README.md`, `SKILL.md`, ADR-0017, `AGENTS.md`, constitución, dominios y guías |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 y CR-005 |
| 20 | El CHANGELOG se actualiza si aplica | ⚠️ | `CHANGELOG.md › [Unreleased]` no se tocó (STORY-160 tampoco lo hizo); queda para `/doc-release-notes` al cerrar la épica |
| 21 | El build de CI pasa sin errores | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. El gate local equivalente (`verify:repository`, el de `quality.yml`) pasa |
| 22 | No hay secrets ni credenciales expuestos | ✓ | Ningún secreto en los cambios |
| 23 | Las variables de entorno necesarias están documentadas | ✓ | Sin variables nuevas |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambios versionados; ninguna historia del repositorio se movió |

**Resumen:** 16/24 criterios ✓ · 8 ⚠️ · 0 ❌

---

## Observaciones

- **INC-001 / CR-003 (sin aplicar):** la nota «Regla de archivo» de `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` sigue atribuyendo el ADR nuevo a STORY-160; se corrige fuera de esta historia, como indica design.md.
- **Checklist de la épica:** la línea de STORY-164 está anidada bajo «Skill nuevo `story-complete`» (sangría de dos espacios), igual que STORY-160, que se marcó en su cierre; se siguió ese precedente.
- **Cambios ajenos en el árbol de trabajo:** durante esta ejecución aparecieron modificaciones que no son de esta historia (`scripts/cli.js`, `scripts/install.js`, `test/install.test.js`, `README.md`, `docs/architecture/tech-stack.md`, `specs/flow/STORY-161-*`). No se tocaron; `npm test` y `verify:repository` se ejecutaron con ellas presentes.
- Las 11 historias `CANCELED` actuales del repositorio siguen en `specs/flow/` (Non-Goals).

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto (`npm test`; en esta sesión: 350/350)
2. Ejecutar a criterio humano `npm run test:eval -- story-complete` para los casos TC-004 y TC-007…TC-011
3. Consultar `design.md` (incluidos CR-004 y CR-005) para verificar que la implementación respeta las interfaces definidas
