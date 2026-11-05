---
type: implement-report
id: STORY-175
slug: STORY-175-implement-report
title: "Implement Report: Admitir épicas archivadas en el layout fijo con un ADR nuevo"
story: STORY-175
created: 2026-10-30
updated: 2026-10-30
---

<!-- Referencias -->
[[STORY-175-admitir-epicas-archivadas-en-layout]]

# Reporte de Implementación: Admitir épicas archivadas en el layout fijo con un ADR nuevo

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-175 |
| Total de tareas | 25 (T001–T024, T026; T025 se retiró en planning) |
| Tareas completadas | 25 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

La historia es documental y de contrato de skills: no crea ni modifica scripts. El ciclo TDD se aplica con los casos de
eval (`TC-008`, `TC-012`, `TC-030`) como especificación ejecutable y los contratos de verificación de `design.md`
como comprobaciones deterministas.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar número libre ADR-0019 y estado de ADR-0017 | ✓ completado | — (sin `ADR-0019-*`; ADR-0017 `ACCEPTED`, `superseded-by: null`) |
| T002 | Comprobar cambios previos de STORY-170 | ✓ completado | — (STORY-170 ya reescribió la cláusula de `SHIP`; se conservó) |
| T003 | Crear ADR-0019 | ✓ completado | `docs/adr/ADR-0019-layout-fijo-con-archivo-de-epicas.md` |
| T004 | ADR-0017 → `SUPERSEDED` con tres cambios | ✓ completado | `docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md` |
| T005 | Índice de ADRs | ✓ completado | `docs/adr/README.md` |
| T006 | `AGENTS.md` | ✓ completado | `AGENTS.md` |
| T007 | Constitución | ✓ completado | `docs/constitution.md` |
| T008 | Invariante 6 (`COMPLETED` de épica) | ✓ completado | `docs/domains/domain-state-management.md` |
| T009 | Máquina de estados (nota y fila `COMPLETED`) | ✓ completado | `docs/architecture/state-machine.md` |
| T010 | Ciclo de vida de épica §5 y §9 | ✓ completado | `docs/domains/domain-epic-lifecycle.md` |
| T011 | Guía de organización | ✓ completado | `docs/guides/organization-of-artifacts.md` |
| T012 | Guía de raíces | ✓ completado | `docs/guides/root-folder-practices.md` |
| T013 | Guía de migración | ✓ completado | `docs/guides/artifact-directory-migration.md` |
| T014 | `epic-analyze`: rechazar épica archivada | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T015 | `epic-creation`: numeración activas ∪ archivadas | ✓ completado | `skills/epic-creation/SKILL.md` |
| T016 | `epic-from-project-plan`: `$MAX_EPIC` activas ∪ archivadas | ✓ completado | `skills/epic-from-project-plan/SKILL.md`, `skills/epic-from-project-plan/README.md` |
| T017 | Eval `TC-008` | ✓ completado | `skills/epic-creation/evals/evals.json` |
| T018 | Eval `TC-012` | ✓ completado | `skills/epic-from-project-plan/evals/evals.json` |
| T019 | Eval `TC-030` | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T020 | Regenerar `docs/index.md` | ✓ completado | `docs/index.md`, `docs/requirements/index.md` (solo `updated:`) |
| T021 | Tabla «Alcance cerrado» de `story.md` | ✓ completado | `story.md` |
| T022 | Contratos 1–3 | ✓ completado | — (`git diff` de ADR-0017: solo `status`, `superseded-by` y la nota) |
| T023 | Contratos 4–5 | ✓ completado | `skills/epic-track-progress/SKILL.md`, `skills/epic-track-progress/references/story-sources.md`, `skills/epic-validate/references/story-sources.md` (CR-003) |
| T024 | Gate determinista | ✓ completado | — (`npm run verify:repository` aprobado; `npm test` 394/394) |
| T026 | Registrar evals pendientes de ejecución humana | ✓ completado | este reporte |

---

## Decisiones no previstas en el planning

- **CR-003 (registrado en `design.md`):** el contrato 4 detectó la regla obsoleta «las épicas no se archivan» en tres
  documentos de skills creados después del planning (`epic-track-progress` y `epic-validate`). Se sustituyó por la
  regla de ADR-0019 que ya aplicaban (solo resuelven épicas activas; una épica archivada es terminal), sin cambio de
  comportamiento. Por coherencia también se ajustaron el paso 2 de búsqueda (§7) y la regla de la checklist (§10) de
  `docs/guides/organization-of-artifacts.md`.
- **AC-4 sin componente propio en `design.md`:** AC-4 se añadió a `story.md` después de `analyze.md` (que reporta 3/3
  ACs). Queda satisfecho: la cláusula de `SHIP` de `state-machine.md` (escrita por STORY-170) y la de `COMPLETED`
  (T009) nombran a `epic-ship` y `epic-complete` con confirmación humana, y `domain-epic-lifecycle` §9 ya nombra
  `epic-validate-report.md` como reporte de `VALIDATE`.

---

## Verificación de contratos

| # | Contrato | Resultado |
|---|---|---|
| 1 | ADR-0019 `ACCEPTED`, `supersedes: ADR-0017`, archivo de épicas y cadena de fecha | ✓ |
| 2 | `git diff` de ADR-0017 solo en `status`, `superseded-by` y nota | ✓ |
| 3 | Filas de ADR-0017 (`SUPERSEDED → ADR-0019`) y ADR-0019 en el índice; `verify:links` | ✓ |
| 4 | `git grep` de la regla obsoleta sin resultados | ✓ (tras CR-003) |
| 5 | `epic-complete` en los cinco documentos de autoridad | ✓ |
| 6 | `TC-008`, `TC-012` | ⚠️ pendiente: `npm run test:eval -- epic-creation` y `npm run test:eval -- epic-from-project-plan` a criterio humano |
| 7 | `TC-030` | ⚠️ pendiente: `npm run test:eval -- epic-analyze` a criterio humano |
| 8 | `npm run verify:repository` y `npm test` | ✓ |

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1, AC-2 y AC-4 verificados por los contratos 1–5; AC-3 requiere ejecutar los evals (contratos 6–7) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (diff de ADR-0017), CNF-2 (cadena de fecha en ADR-0019), CNF-3 (gate en verde) |
| 3 | El comportamiento coincide con `design.md` | ✓ | C1–C15 implementados; desviación registrada en CR-003 |
| 4 | Sin regresiones | ✓ | `npm test` 394/394 y `npm run verify:repository` aprobado |
| 5 | Convenciones de `constitution.md` | ✓ | Documentos en español; `SDDF-FIXED-LAYOUT: v1` conservado en los skills editados |
| 6 | Sin código comentado ni `TODO` | ✓ | No se añadió código |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No se añadió código |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` aprobado; los tres `evals.json` parsean como JSON válido |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crean skills |
| 12 | [[gr-ai-security-checklist]] | ✓ | Sin instrucciones ejecutables nuevas; `epic-analyze` sigue tratando el contenido como datos |
| 13 | [[gr-code-security-checklist]] | ✓ | Sin código |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crean skills |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Un caso nuevo por skill modificado con comportamiento nuevo |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; AGENTS.md reserva `test:eval` al criterio humano |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 25/25 |
| 18 | README o docs actualizados si cambian contratos | ✓ | `skills/epic-from-project-plan/README.md`, guías y documentos de autoridad |
| 19 | Decisiones no previstas en `design.md` | ✓ | CR-003 |
| 20 | CHANGELOG si aplica | ⚠️ | Lo escribe `epic-ship` al liberar EPIC-23 |
| 21 | Build de CI pasa | ✓ | `npm run verify:repository` (mismo gate que `quality.yml`) |
| 22 | Sin secrets ni credenciales | ✓ | Solo Markdown y JSON documentales |
| 23 | Variables de entorno documentadas | ✓ | No se añaden variables |
| 24 | Despliegue reversible | ✓ | Cambios documentales revertibles con git |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-creation`, `npm run test:eval -- epic-from-project-plan` y
   `npm run test:eval -- epic-analyze` para los casos `TC-008`, `TC-012` y `TC-030`
2. Si algún caso falla, revisar el `SKILL.md` correspondiente y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
