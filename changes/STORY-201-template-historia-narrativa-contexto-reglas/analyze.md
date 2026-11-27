---
type: analyze
id: STORY-201
slug: STORY-201-analyze-report
title: "Analyze: Template de historia con narrativa, contexto y reglas de negocio"
story: STORY-201
design: STORY-201
testcases: STORY-201
tasks: STORY-201
verdict: APPROVED
created: 2026-11-27
updated: 2026-11-27
related:
  - STORY-201-template-historia-narrativa-contexto-reglas
---

<!-- Referencias -->
[[STORY-201-template-historia-narrativa-contexto-reglas]]

# Reporte de Coherencia: Template de historia con narrativa, contexto y reglas de negocio

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (11 componentes + 4 interfaces) |
| Alineación con la épica — | ⚠️ | Sin `parent`: no se verificó (aviso de cobertura, no es un hallazgo) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El template expone la estructura nueva (orden de títulos, AC con guion, reglas trazadas, seed idéntico) | ✓ | D-1, D-2, D-3, D-6, D-8; componentes «Seed» y «Template del proyecto»; interfaz «Seed ↔ `docs/templates/`»; F-1; contratos 1–4 |
| AC-2 | Una historia nueva sin contexto ni reglas omite esas secciones | ✓ | D-4; componente «Regla de secciones opcionales y ejemplo de output»; interfaz «Template → `story-creation`»; F-2; contrato 5 |
| AC-3 | Las historias con títulos anteriores siguen siendo compatibles; el gate pasa; el AC de cierre de epic-refine usa guion | ✓ | D-5, D-6, D-7, D-8; seis componentes consumidores; interfaces «`story.md` → consumidores» y «→ story-refine · epic-refine»; F-3, F-4; contratos 6–8 |
| CNF-1 | UTF-8 sin BOM en los dos templates | ✓ | D-3; F-1; contrato 9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Reescribir el seed desde `story-new-template.md` con los comentarios de D-2 | D-1, D-2 · Seed del template | ✓ |
| T002 | Copiar por bytes el seed a `docs/templates/` y verificar con `cmp` | D-3 · Template del proyecto | ✓ |
| T003 | Verificar BOM, orden de títulos, guion y reglas en el seed | Contratos 1–4 y 9 | ✓ |
| T004 | Regla de omisión de `*(si aplica)*` en `story-creation/SKILL.md` | D-4 | ✓ |
| T005 | Ejemplo de output de `story-creation` con la estructura nueva | D-4 | ✓ |
| T006 | Comienzo común en `story-acceptance/SKILL.md:203` | D-5 | ✓ |
| T007 | Comienzo común en `story-verify/SKILL.md:397` | D-5 | ✓ |
| T008 | Componentes 1 y 2 de `story-evaluation` sin cambiar scores | D-5, CR-001 | ✓ |
| T009 | Dos formas del título de notas en `story-refine/SKILL.md:244,247` | D-5 | ✓ |
| T010 | Prefijos y AC de cierre con guion en `sal-corrections.md` | D-5, D-6 | ✓ |
| T011 | Ejemplos inline de `epic-generate-stories` y `epic-generate-all-stories` | D-7, CR-002 | ✓ |
| T012 | `### Changed` en `[Unreleased]` de `CHANGELOG.md` | D-8 | ✓ |
| T013 | `npm test` y `npm run verify:repository` | Contrato 6 · F-3 | ✓ |
| T014 | `grep` de consumidores y del AC de cierre | Contratos 7–8 · Risks (segundo riesgo) | ✓ |
| T015 | Encoding de todos los `.md` modificados | Contrato 9 · CNF-1 | ✓ |
| T016 | Reinstalación local y validación manual de `/story-creation` | Contrato 5 · Risks (primer riesgo) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Seed del template de historia | Componentes afectados | T001, T003 | ✓ |
| Template del proyecto | Componentes afectados | T002 | ✓ |
| Regla de secciones opcionales y ejemplo de output | Componentes afectados | T004, T005 | ✓ |
| Lectura de AC en acceptance | Componentes afectados | T006 | ✓ |
| Lectura de AC en verify | Componentes afectados | T007 | ✓ |
| Rúbrica F (componentes 1 y 2) | Componentes afectados | T008 | ✓ |
| Mapa dimensión → sección (story-refine) | Componentes afectados | T009 | ✓ |
| Correcciones SAL (epic-refine) | Componentes afectados | T010 | ✓ |
| Ejemplos inline de generación desde épica | Componentes afectados | T011 | ✓ |
| Changelog | Componentes afectados | T012 | ✓ |
| Propuesta del Solo Builder (solo lectura) | Componentes afectados | T001 (fuente) | ✓ |
| Template → `story-creation` | Interfaces | T004, T016 | ✓ |
| `story.md` → consumidores | Interfaces | T006–T008, T010, T014 | ✓ |
| `story.md` → story-refine · epic-refine | Interfaces | T009, T010 | ✓ |
| Seed ↔ `docs/templates/` | Interfaces | T002, T013 | ✓ |

---

## Alineación con la Épica

**Épica padre:** — (`parent:` vacío en `story.md:10`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ⚠️ | No aplica: la historia es independiente |
| Objetivo de la historia alineado con la épica | ⚠️ | No verificado |
| Restricciones de la épica respetadas | ⚠️ | No verificado |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

Observaciones (no son hallazgos):
- `testcases.md`: E2E-002 y EV-001…EV-006 dependen de ejecutar skills con LLM. El gate automático solo cubre E2E-001, E2E-003, UT-001…UT-004, IT-001 e IT-002. La validación de AC-2 queda en manos de T016 (manual), de forma coherente con `AGENTS.md` (evals a criterio humano).
- `design.md` CR-001 y CR-002 amplían el alcance a lo que la historia ya anticipa en sus Notas («Riesgo de compatibilidad»). No contradicen los Non-Goals: T008 cambia el reconocimiento de títulos, no los scores.

---

## Recomendaciones

1. En `implement-report.md`, registrar la evidencia de T016 (el `story.md` de prueba generado y su eliminación), porque es la única prueba de AC-2.
2. Después de T013, reinstalar los destinos de runtime (`npx agile-sddf install --force`) antes de usar los skills modificados en este repositorio (design.md, «Risks / Trade-offs»).

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Estructura nueva del template | ✓ | E2E-001, UT-001, UT-002 |
| AC-2 | Historia nueva sin contexto ni reglas | ✓ | E2E-002, EV-001, EV-002 |
| AC-3 | Compatibilidad con títulos anteriores | ✓ | E2E-003, UT-004, IT-001, IT-002, EV-003…EV-006 |
| CNF-1 | Encoding | ✓ | UT-003 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-201` |
| tasks.md | ✓ | `/story-implement-tasks STORY-201` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` · `enforcement: error` · 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | `story.md`: AC-1, AC-2 y AC-3 en bloques `gherkin` con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-8 con `// satisface:`; las tablas de componentes e interfaces tienen la columna «AC que satisface» |
| No hay decisiones de arquitectura aplazadas | ✓ | — | `design.md` «Open Questions»: ninguna; CR-001 y CR-002 registrados |
| Existe tasks.md o testcases.md o ambos | ✓ | — | Existen ambos |
| tasks.md contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 16 tareas, cada una sobre un archivo o una verificación; AC-1 (T001–T003), AC-2 (T004, T005, T016), AC-3 (T006–T014) |
| testcases.md contiene pruebas para todos los escenarios principales | ✓ | — | E2E-001…E2E-003, trazados 1 a 1 a AC-1…AC-3 |
