---
alwaysApply: false
type: analyze
id: STORY-071
slug: STORY-071-analyze
title: "Analyze: Skill story-verify — Orquestar la fase VERIFY de pruebas de una historia"
story: STORY-071
design: STORY-071
tasks: STORY-071
created: 2026-05-15
updated: 2026-05-15
related:
  - STORY-071-skill-story-verify
  - EPIC-13-quality-gates-con-dod-en-story-workflow
---

<!-- Referencias -->
[[STORY-071-skill-story-verify]]
[[STORY-071-skill-story-verify-design]]
[[STORY-071-skill-story-verify-tasks]]

# Reporte de Coherencia: Skill story-verify — Orquestar la fase VERIFY de pruebas de una historia

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 14/14 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 17/17 tareas con diseño asociado |
| Cobertura diseño → tareas | ✓ | Tarea 6.8 añadida para cubrir Risks/Trade-offs (INC-001 resuelto) |
| Alineación con release EPIC-13 | ✓ | Historia listada, objetivo alineado, restricción DoD runtime respetada |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ✓ Coherente — sin inconsistencias pendientes

---

## Cobertura de Criterios de Aceptación

| AC | Descripción (resumen) | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Verificación automática unit tests: CODE-REVIEW/DONE + tests → verify-report.md + VERIFY/DONE | ✓ | D-4 (`// satisface: AC-1, AC-4, AC-5`), D-5 (`// satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11`), Flujo 1 (`// satisface: AC-1, AC-6`) |
| AC-2 | E2E verification: playwright/cypress/cucumber → resultados por escenario Gherkin | ✓ | D-2 (`// satisface: AC-6, AC-10`), Interface SKILL→qa-engineer (`// satisface: AC-3, AC-2`), Flujo 2 (`// satisface: AC-2, AC-6`) |
| AC-3 | Modo manual: sin tests → qa-engineer guía escenario por escenario | ✓ | D-3 (`// satisface: AC-14, AC-3, NFR`), Interface SKILL→qa-engineer (`// satisface: AC-3, AC-2`), Flujo 3 (`// satisface: AC-3, AC-6`) |
| AC-4 | Estado incorrecto → mensaje de error, sin modificar archivos | ✓ | D-4 (`// satisface: AC-1, AC-4, AC-5`), Interface SKILL→story.md (`// satisface: AC-1, AC-4, AC-5`), Flujo 4 (`// satisface: AC-4, AC-14`) |
| AC-5 | DoD VERIFY no superado → verify-report.md con defectos + substatus BLOCKED | ✓ | D-4 (`// satisface: AC-1, AC-4, AC-5`), D-5 (`// satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11`), Flujo 5 (`// satisface: AC-5, AC-9`) |
| AC-6 | Detección automática del modo (pytest/playwright/cypress/cucumber/no-tests/delegado) | ✓ | D-2 (`// satisface: AC-6, AC-10`), Flujos 1-3 referencian AC-6 |
| AC-7 | Idempotencia: sobreescribir verify-report.md preservando historial | ✓ | D-5 (`// satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11`) |
| AC-8 | Lectura dinámica del DoD VERIFY en runtime | ✓ | D-6 (`// satisface: AC-8`) |
| AC-9 | Severity definitions (CRITICAL/HIGH/MEDIUM/LOW) con location/steps/expected/actual/fix | ✓ | D-5 (`// satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11`), Flujo 5 (`// satisface: AC-5, AC-9`) |
| AC-10 | Detección de frameworks de prueba + delegación a skill personalizado | ✓ | D-2 (`// satisface: AC-6, AC-10`) |
| AC-11 | Template del reporte leído de `$SPECS_BASE/specs/templates` | ✓ | D-5 (`// satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11`), Interface SKILL→template (`// satisface: AC-11, AC-5`) |
| AC-12 | Seguir patrones estructurales de skill-structural-pattern.md | ✓ | D-1 (`// satisface: AC-12, AC-13`) |
| AC-13 | Seguir lineamientos de skill-master | ✓ | D-1 (`// satisface: AC-12, AC-13`) |
| AC-14 | No modifica código fuente ni artefactos (solo verify-report.md y frontmatter) | ✓ | D-3 (`// satisface: AC-14, AC-3, NFR`), Flujo 4 (`// satisface: AC-4, AC-14`) |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 | Crear estructura de directorios | D-1 (directory structure) | ✓ |
| 2.1 | assets/verify-report-template.md | D-5 (reporte con template), Interface SKILL→template | ✓ |
| 2.2 | $SPECS_BASE/specs/templates/verify-report-template.md (canónica) | D-5 (fuente de verdad dinámica), D-6 (template location) | ✓ |
| 3.1 | agents/qa-engineer.agent.md | D-3 (separación SKILL/agente), Interface SKILL→qa-engineer | ✓ |
| 4.1 | SKILL.md (orquestador completo con 5 flujos) | D-2, D-3, D-4, D-5, D-6 + todas las interfaces y flujos | ✓ |
| 5.1 | examples/pytest-project/ | D-1 (examples), verificación AC-1/AC-5 | ✓ |
| 5.2 | examples/jest-project/ | D-1 (examples), verificación AC-6 stack Node.js | ✓ |
| 5.3 | examples/no-tests-project/ | D-1 (examples), verificación AC-3 modo manual | ✓ |
| 6.1 | Verificar AC-1 | Flujo 1, D-4/D-5 | ✓ |
| 6.2 | Verificar AC-2 | Flujo 2, D-2 | ✓ |
| 6.3 | Verificar AC-3 | Flujo 3, D-3/Interface qa-engineer | ✓ |
| 6.4 | Verificar AC-4 | Flujo 4, D-4 | ✓ |
| 6.5 | Verificar AC-5 | Flujo 5, D-4/D-5 | ✓ |
| 6.6 | Verificar AC-7 (idempotencia) | D-5 (idempotency con historial) | ✓ |
| 6.7 | Verificar AC-8 (DoD dinámico) | D-6 (dynamic DoD reading) | ✓ |
| 7.1 | README.md del skill | AC-13 (skill-master docs), D-2 (flags reference) | ✓ |
| 7.2 | evals/eval-mode-detection.md | D-2 (mode detection benchmarks), D-1 (evals dir) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| D-1: Estructura de directorios | Sección `Decisions > D-1` | 1.1 | ✓ |
| D-2: Modos de ejecución y detección | Sección `Decisions > D-2`, tabla de modos | 4.1, 7.2 | ✓ |
| D-3: Separación SKILL/Agente | Sección `Decisions > D-3` | 3.1, 4.1 | ✓ |
| D-4: Transiciones de estado | Sección `Decisions > D-4`, tabla | 4.1, 6.1, 6.4, 6.5 | ✓ |
| D-5: Generación de verify-report.md | Sección `Decisions > D-5` | 2.1, 2.2, 4.1 | ✓ |
| D-6: Lectura dinámica DoD | Sección `Decisions > D-6` | 4.1, 6.7 | ✓ |
| Interface SKILL→qa-engineer | Sección `Interfaces` | 3.1, 4.1 | ✓ |
| Interface SKILL→verify-report-template | Sección `Interfaces` | 2.1, 2.2, 4.1 | ✓ |
| Interface SKILL→story.md frontmatter | Sección `Interfaces` | 4.1, 6.1, 6.4, 6.5 | ✓ |
| Flujos 1-5 | Sección `Flujos Clave` | 6.1, 6.2, 6.3, 6.4, 6.5 | ✓ |
| Risks/Trade-offs (5 riesgos con mitigaciones) | Sección `Risks / Trade-offs` | — (mitigadas en cada componente) | ⚠️ |

---

## Alineación con Release

**Release padre:** EPIC-13-quality-gates-con-dod-en-story-workflow

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ | `- [ ] STORY-071 - **VERIFY con story-verify:**` en `release.md` línea 24 |
| Objetivo alineado | ✓ | El objetivo de la historia (quality gate VERIFY con DoD) está directamente en la descripción del release: "Convierte el DoD en un quality gate ejecutable dentro del flujo automatizado" |
| Restricción DoD runtime respetada | ✓ | Requerimiento del release: "El DoD debe leerse en runtime". Design D-6 (`// satisface: AC-8`) lo implementa explícitamente con fallback y advertencia |

---

## Inconsistencias Detectadas

### INC-001 [WARNING — TIPO C — RESUELTO ✓]

- **Tipo:** C — Elemento de diseño sin tarea dedicada
- **Descripción:** La sección "Risks / Trade-offs" de `design.md` documentaba 5 riesgos con mitigaciones sin tarea explícita de verificación.
- **Archivo afectado:** `design.md` — sección "Risks / Trade-offs"
- **Resolución:** Añadida tarea `6.8` en `tasks.md` con checklist explícito de los 5 comportamientos de mitigación a verificar al implementar la tarea 4.1 (SKILL.md).

---

## Recomendaciones

1. **INC-001 — RESUELTO ✓** — Tarea `6.8` añadida en `tasks.md` con checklist explícito de los 5 comportamientos de mitigación a verificar al completar la tarea 4.1.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | 5 escenarios Gherkin completos (AC-1 a AC-5) + 1 Scenario Outline (AC-6) con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 14/14 ACs cubiertos con anotaciones `// satisface: AC-N` en D-1 a D-6, interfaces y flujos |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 8 grupos: scaffolding → templates → agente → orchestrator → examples → verification → docs/evals |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1 a D-6, todas las interfaces y todos los flujos tienen anotación canónica `// satisface: AC-N` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | design.md declara "Open Questions: Ninguna" y "Registro de Cambios (CR): Sin CRs detectados." |
