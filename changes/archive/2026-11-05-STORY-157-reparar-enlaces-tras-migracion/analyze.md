---
type: analyze
id: STORY-157
slug: STORY-157-analyze-report
title: "Analyze: Reparar enlaces y validar el gate tras la migración"
story: STORY-157
design: STORY-157
tasks: STORY-157
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-157-reparar-enlaces-tras-migracion
---

<!-- Referencias -->
[[STORY-157-reparar-enlaces-tras-migracion]]

# Reporte de Coherencia: Reparar enlaces y validar el gate tras la migración

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Alineación tareas → diseño | ✓ | 20/20 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (10 componentes, 5 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | listada en `epic.md` l. 32; cubre CS-6, CS-10, CS-11, CS-2, CS-3, CS-12 y SMOKE-5 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

Aviso de cobertura (no es hallazgo): `testcases.md` no presente → cobertura de pruebas no evaluada (planificación en modo `--only-tasks`).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Enlaces relativos y wikilinks hacia `docs/specs/` reescritos a la ruta nueva; `verify:repository` sin enlaces rotos | ✓ | D-2 (clasificación), D-3 (regla de ruta nueva), D-4 (índice regenerado), D-5 (corpus de slugs del checker); F-1; contratos #2–#5 |
| AC-2 | `git log --follow` sobre un `story.md` archivado muestra historial previo; `docs/requirements/` intacto | ✓ | D-1 (P2, commit de migración), D-7; F-2; contratos #6, #7 |
| AC-3 | CS-2 (solo diagnóstico en `skill-preflight`), lista transitoria vacía, CS-3, CS-12 en verde | ✓ | D-1 (puerta y devolución de defectos), D-6 (restos de transición), D-8; F-3; contratos #1, #8–#10 |
| CNF-1 | Sin skill ni script reutilizable | ✓ | D-3 (edición manual guiada por regla), D-5 (solo se modifica el checker existente); contrato #11 |
| CNF-2 | Node.js, sin dependencias nuevas | ✓ | D-5; contrato #11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | P1: `docs/specs/` ausente, `specs/flow/` y `archive/` presentes | D-1 | ✓ |
| T002 | P2: migración commiteada; `MIGRATION_COMMIT` | D-1, CR-003 | ✓ |
| T003 | P3/P4: `PENDING_MIGRATION` vacía, ADR-0016, viñeta de transición | D-1 | ✓ |
| T004 | Línea base e inventario | D-2, contrato #1 | ✓ |
| T005 | Pruebas del checker (RED) | D-5 | ✓ |
| T006 | Corpus de slugs y `HISTORICAL_EXCLUSIONS` (GREEN) | D-5 | ✓ |
| T007 | Regenerar `docs/index.md` | D-4 | ✓ |
| T008 | Rutas concretas de `gr-ai-security-checklist.md` | D-2, D-3 | ✓ |
| T009 | Comandos del runbook | D-2, D-3 | ✓ |
| T010 | Ubicaciones en `docs/domains/` | D-2 | ✓ |
| T011 | Ubicaciones en `docs/product/` | D-2 | ✓ |
| T012 | Inventario residual y clasificación | D-2, contrato #3 | ✓ |
| T013 | `sddf.config.yaml` sin `root` | D-6 | ✓ |
| T014 | Viñeta de transición de `AGENTS.md` | D-6 | ✓ |
| T015 | `verify:links` y grep del contrato #3 | contratos #2, #3, #5 | ✓ |
| T016 | Historial y `docs/requirements/` | D-7 | ✓ |
| T017 | CS-2, lista vacía, CS-3 | D-8 | ✓ |
| T018 | `npm test` y `verify:repository` | D-8, contrato #10 | ✓ |
| T019 | Alcance del diff | contratos #11, #12 | ✓ |
| T020 | `graphify update .` e `implement-report.md` | Risks, F-4 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Índice wiki (`docs/index.md`) | Componentes afectados | T007 | ✓ |
| Checker de enlaces (`scripts/check-doc-links.js`) | Componentes afectados | T006 | ✓ |
| Prueba del checker | Componentes afectados | T005 | ✓ |
| Checklist de seguridad | Componentes afectados | T008 | ✓ |
| Runbook de spec | Componentes afectados | T009 | ✓ |
| Dominios | Componentes afectados | T010 | ✓ |
| Producto | Componentes afectados | T011 | ✓ |
| Configuración del repo | Componentes afectados | T013 | ✓ |
| Instrucciones de agentes | Componentes afectados | T014 | ✓ |
| Residuales del inventario | Componentes afectados | T012 | ✓ |
| Ruta nueva de un work item | Interfaces | T008, T009, T012 | ✓ |
| `checkDocumentation` | Interfaces | T005, T006 | ✓ |
| `HISTORICAL_EXCLUSIONS` | Interfaces | T006 | ✓ |
| Gate | Interfaces | T015, T018 | ✓ |
| Contrato de layout | Interfaces | T003, T017 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado (`docs/specs/epics/EPIC-26-layout-y-flow-forward-mejorado/epic.md`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 32 |
| Objetivo de la historia alineado con la épica | ✓ | CS-6 (l. 42, `git log --follow`) → D-7; CS-10 (l. 46, `docs/requirements/`) → D-7; CS-11 (l. 47, sin script reutilizable) → D-3/CNF-1; CS-2, CS-3, CS-12 y SMOKE-5 (l. 91) → D-8 |
| Restricciones de la épica respetadas | ✓ | No mueve work items ni migra skills; no edita ADRs ni `docs/requirements/`; devuelve defectos a su historia dueña (D-1) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E: criterio DoD PLAN «No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR» evaluado ⚠️ (evidencia insuficiente)
- **Descripción:** dos comandos de verificación de git limitan el pathspec a la ruta **nueva**, y git aplica el filtro de rutas antes de detectar renombres, así que el par `docs/specs/… → specs/flow/…` aparece como alta (`A`), no como renombre (`R`):
  - design.md D-1 (fila P2) y tasks.md T002: `git log --diff-filter=R --format=%H -1 -- specs/flow` puede no devolver ningún commit aunque la migración esté commiteada, y la puerta de entrada se detendría con un falso negativo.
  - design.md D-7 (fila «Renombre detectado») y tasks.md T016: `git show --stat -M --format= MIGRATION_COMMIT -- specs/flow/archive/<…>/story.md` mostraría el archivo como nuevo, sin `=>`.
  - `git log --follow` (D-7, primera fila) **no** tiene el problema: `--follow` sigue el renombre con una sola ruta.
- **Archivo afectado:** design.md — secciones "D-1" (tabla, P2) y "D-7" (tabla); tasks.md — tareas T002 y T016
- **Acción requerida:** incluir ambos lados en el pathspec (`-- docs/specs specs/flow` en P2/T002; `-- docs/specs/stories/<STORY-…>/story.md specs/flow/archive/<…>/story.md` en D-7/T016), o quitar el pathspec y filtrar la salida de `git show -M --name-status MIGRATION_COMMIT` por la ruta nueva.

---

## Recomendaciones

1. **INC-001:** en design.md D-1 (P2) y D-7, y en tasks.md T002 y T016, sustituir los pathspec de una sola ruta por pathspec con origen y destino (o `--name-status` sin pathspec filtrado después). Se aplica con `/story-fix-plan STORY-157` en modo advertencias; no bloquea, pero sin el cambio T002 puede detener la implementación por error.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-157` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-157` |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan` = `dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 y los dos CNF (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-8 con `// satisface:`; componentes e interfaces con columna «AC que satisface»; flujos con `// AC-N` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ⚠️ | WARNING | Open Questions: ninguna; CR-001 a CR-003 registrados; pero los comandos de verificación de renombres de D-1/D-7 tienen un defecto técnico sin resolver — INC-001 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (20 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1 (T005–T012, T015), AC-2 (T002, T016), AC-3 (T001, T003, T013, T014, T017, T018); cada tarea, un archivo o una verificación |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (condición no activada) |
