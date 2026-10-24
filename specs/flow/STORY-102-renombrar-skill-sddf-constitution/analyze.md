---
type: analyze
id: STORY-102
slug: STORY-102-analyze-report
title: "Analyze: Renombrar el skill project-policies-generation como sddf-constitution"
story: STORY-102
design: STORY-102
testcases: STORY-102
tasks: STORY-102
created: 2026-09-26
updated: 2026-09-26
related:
  - STORY-102-renombrar-skill-sddf-constitution
  - EPIC-12-story-sdd-workflow
  - STORY-056-project-policies
---

<!-- Referencias -->
[[STORY-102-renombrar-skill-sddf-constitution]]
[[EPIC-12-story-sdd-workflow]]
[[STORY-056-project-policies]]

# Reporte de Coherencia: Renombrar el skill project-policies-generation como sddf-constitution

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✅ | 2/2 criterios cubiertos por D-01 a D-04 en `design.md:62-130`. |
| Cobertura de ACs en testcases.md | ✅ | 2/2 ACs tienen E2E uno a uno en `testcases.md:33-34`. |
| Alineación tareas → diseño | ✅ | 9/9 tareas se trazan a D-01 a D-04 en `tasks.md:30-69`. |
| Cobertura diseño → tareas | ✅ | 4/4 decisiones de diseño tienen una o más tareas de implementación o verificación. |
| Alineación con la épica EPIC-12-story-sdd-workflow | ⚠️ | Objetivo alineado con la evolución de STORY-056; la épica está cerrada y no lista STORY-102. |
| Cumplimiento DoD — Fase PLAN | ✅ | 7/7 criterios satisfechos; `enforcement: error`, sin hallazgos TIPO E. |

**Estado general:** ⚠️ Advertencias no bloqueantes. No hay inconsistencias ERROR de tipo A, B o E.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Única fuente `skills/sddf-constitution/`, identidad pública nueva y comportamiento preservado | ✅ | D-01 (`design.md:62-80`) define traslado íntegro, identidad, ausencia de alias y conservación funcional; D-04 (`design.md:113-129`) cubre distribución. |
| AC-2 | Las integraciones recomiendan el nombre nuevo y la historia permanece preservada | ✅ | D-02 (`design.md:82-98`) enumera consumidores operativos; D-03 (`design.md:100-111`) define allowlist histórica; D-04 cubre la validación. |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Inventario y allowlist histórica | D-03 — `design.md:100-111` | ✅ |
| T002 | Traslado íntegro del árbol fuente | D-01 — `design.md:62-80` | ✅ |
| T003 | Identidad, metadatos y README del skill | D-01 — `design.md:62-80` | ✅ |
| T004 | Exención de evals renombrada | D-02 y D-04 — `design.md:82-98,113-129` | ✅ |
| T005 | Contrato, README y eval de sddf-init | D-02 — `design.md:82-98` | ✅ |
| T006 | Avisos de story-design | D-02 — `design.md:82-98` | ✅ |
| T007 | Ayuda y documentación operativa | D-02 y D-03 — `design.md:82-111` | ✅ |
| T008 | Identidad, preservación y allowlist | D-01 y D-03 — `design.md:62-80,100-111` | ✅ |
| T009 | Validación de inventario, eval e instalación | D-04 — `design.md:113-129` | ✅ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Árbol fuente y contrato público del skill | D-01, `design.md:62-80` | T002, T003, T008 | ✅ |
| Consumidores de identidad operativa | D-02, `design.md:82-98` | T004, T005, T006, T007 | ✅ |
| Clasificación de superficies activas e históricas | D-03, `design.md:100-111` | T001, T007, T008 | ✅ |
| Distribución dinámica y verificación limpia | D-04, `design.md:113-129` | T009 | ✅ |

---

## Alineación con la Épica

**Épica padre:** EPIC-12-story-sdd-workflow

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ⚠️ | `EPIC-12-story-sdd-workflow/epic.md` está cerrada y enumera la STORY-056 original, no la historia de mantenimiento STORY-102. |
| Objetivo de la historia alineado con la épica | ✅ | El renombre evoluciona el skill de políticas y constitución creado por STORY-056, sin restaurar su contrato legado. |
| Restricciones de la épica respetadas | ✅ | No se reabre ni reescribe la épica completada; se conserva la trazabilidad mediante `parent` y `related` en `story.md:10-16`. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — alineación con la épica.
- **Descripción:** STORY-102 es una evolución de mantenimiento de STORY-056, pero no está listada en
  la épica EPIC-12, que ya está completada y congelada.
- **Archivo afectado:** `docs/specs/03-stories/STORY-102-renombrar-skill-sddf-constitution/story.md` —
  frontmatter `parent` y referencias, líneas 10-16.
- **Acción requerida:** No editar la épica cerrada. Si se necesita un backlog formal para mantenimiento,
  crear una épica sucesora en una historia independiente; esta advertencia no bloquea el renombre.

### Nota de contexto — CR-001

`design.md:149-156` documenta la discrepancia preexistente entre la transición `PLAN/DONE` declarada
por el DoD y la salida `READY-FOR-IMPLEMENT/DONE` del orquestador. No afecta la coherencia interna de
este plan ni se corrige dentro de STORY-102.

---

## Recomendaciones

1. Implementar T001–T009 en orden, manteniendo el inventario de referencias históricas como allowlist
   explícita en las revisiones de salida.
2. No sustituir globalmente el identificador anterior: validar solo las superficies operativas de D-02
   y conservar la evidencia de migración heredada.
3. Abrir una historia independiente para decidir la discrepancia de estados registrada como CR-001 si
   el equipo necesita que el guardrail y el orquestador declaren la misma transición literal.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Fuente única e identidad nueva con capacidades preservadas | ✅ | E2E-001, EV-001, EV-003 e IT-001 en `testcases.md:33,35,37,39`. |
| AC-2 | Referencias operativas nuevas e historial preservado | ✅ | E2E-002 y EV-002 a EV-004 en `testcases.md:34,36-38`. |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✅ | `/story-implement STORY-102` |
| tasks.md | ✅ | `/story-implement-tasks STORY-102` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| `story.md` tiene Gherkin para escenarios principales | ✅ | — | AC-1 y AC-2 están en bloques Gherkin en `story.md:29-49`; AC-1 es el escenario principal. |
| design.md existe y cubre todos los ACs | ✅ | — | D-01/D-04 cubren AC-1 y D-02/D-03/D-04 cubren AC-2, según la tabla de cobertura. |
| Todo elemento de diseño tiene trazabilidad explícita | ✅ | — | D-01 a D-04 incluyen `// satisface: AC-N` en `design.md:62,84,102,115`. |
| No hay decisiones de arquitectura aplazadas | ✅ | — | D-01 a D-04 resuelven identidad, integraciones, historial y distribución; CR-001 queda registrado fuera de alcance. |
| Existe tasks.md o testcases.md | ✅ | — | Ambos artefactos existen en el directorio de STORY-102. |
| tasks.md contiene tareas atómicas para los escenarios principales | ✅ | — | T001–T009 cubren traslado, integraciones, documentación y verificación de AC-1/AC-2 en `tasks.md:30-69`. |
| testcases.md define pruebas para los escenarios principales | ✅ | — | E2E-001 y E2E-002 cubren AC-1 y AC-2 uno a uno en `testcases.md:33-34`. |
