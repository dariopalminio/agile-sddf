---
type: analyze
id: STORY-181
slug: STORY-181-analyze-report
title: "Analyze: Hallazgos preexistentes"
story: STORY-181
design: STORY-181
testcases: STORY-181
tasks: STORY-181
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-181-hallazgos-preexistentes
---

<!-- Referencias -->
[[STORY-181-hallazgos-preexistentes]]

# Reporte de Coherencia: Hallazgos preexistentes

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-3) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (E2E, EV y UT) |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 14/14 elementos con tarea (C-1 a C-6, I-1 a I-8) |
| Alineación con la épica EPIC-28-calibrar-story-code-review-con-review-md | ✓ | Listada en `## Historias`; cubre la parte PREEXISTENTE de CS-4, SMOKE-2 y su parte de CS-8 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Un defecto en líneas no tocadas figura como PREEXISTENTE, no cuenta para `max-severity`, `APPROVED`, sin `fix-directives.md` | ✓ | D-1, D-3 (`untouched`), D-4 (Paso 4a.2), D-5 (4b, 4c, 4c.1, 4e), D-6 (celda `🟣 PREEXISTENTE` y fila de `## Resumen`), F-1 (design.md:249) |
| AC-2 | El mismo defecto en línea añadida o modificada conserva `MEDIUM`, `NEEDS-CHANGES` y entra en `fix-directives.md` | ✓ | D-1 (base de la rama: commits más working tree), D-3 (`touched`, vecinas de borrado, rango parcial), D-4 (regla de causa), D-5, F-2 (design.md:258) |
| AC-3 | Sin líneas determinables: ningún PREEXISTENTE, el informe dice por qué, veredicto como hoy | ✓ | D-2 (seis `reason` + `engine-unavailable`, I-3), D-4 paso 3, D-6 (texto `⚠️ clasificación PREEXISTENTE no aplicada`), I-7 (cálculo idéntico sin apartados), F-3 (design.md:262) |
| CNF-1 | Vocabulario 🟣 Pre-existing → PREEXISTENTE según ADR | ✓ | D-6, contrato de verificación 8 |
| CNF-2 | Categoría en la plantilla sin cambiar `verdict` ni `max-severity` | ✓ | D-5 (último punto), D-6 (fila nueva sin encabezados), D-8 aserción 7 |
| CNF-3 | Evals antes del skill | ✓ | D-7 (TC-030 a TC-033), grupo 2 de tasks.md antes del grupo 4 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Puntos de inserción según STORY-180 y cita del ADR | D-6, Risks «Conflicto de edición» | ✓ |
| T002 | IDs libres de evals | D-7 | ✓ |
| T003 | Estado de CR-001 | CR-001 | ✓ |
| T004 | Cuatro evals TC-030 a TC-033 | C-4, D-7 | ✓ |
| T005 | Prueba del motor (RED), aserciones 1-6 | C-5, D-8 | ✓ |
| T006 | `parseLocation` | C-1, I-4, D-3 | ✓ |
| T007 | `touchedLines` | C-1, I-4, D-3 | ✓ |
| T008 | `resolveBase` | C-1, I-3, D-2 | ✓ |
| T009 | `classifyLocations` | C-1, I-2, D-3 | ✓ |
| T010 | CLI `classify` | C-1, I-1, I-4 | ✓ |
| T011 | Refactor del motor | C-1 (P11) | ✓ |
| T012 | «Qué hace», `## Dependencias`, `CLI_ROOT` en Paso 0 | C-2 | ✓ |
| T013 | Paso 4a.2 | C-2, D-4, I-5, I-6 | ✓ |
| T014 | Pasos 4b, 4c, 4c.1, 4e | C-2, D-5, I-7 | ✓ |
| T015 | Frase de 4c.2 | C-2, CR-002 | ✓ |
| T016 | Paso 5b | C-2, D-6, I-8 | ✓ |
| T017 | Paso 7 y manejo de errores | C-2, Esquema de datos (consola), F-4 | ✓ |
| T018 | Fila de la plantilla | C-3, D-6 | ✓ |
| T019 | README | C-6 | ✓ |
| T020 | Aserción 7 de contrato | C-5, D-8 | ✓ |
| T021 | Contratos 1-6 | Contratos de verificación | ✓ |
| T022 | Contratos 7-8 | Contratos de verificación | ✓ |
| T023 | Codificación | Restricción de encoding (C-1 a C-6) | ✓ |
| T024 | Gate `verify:repository` y `npm test` | Contrato 10 | ✓ |
| T025 | `graphify update .` y alcance | Componentes afectados (alcance); AGENTS.md | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Motor de líneas tocadas | Componentes afectados | T006-T011 | ✓ |
| C-2 Orquestador | Componentes afectados | T012-T017 | ✓ |
| C-3 Plantilla del informe | Componentes afectados | T018 | ✓ |
| C-4 Evals del skill | Componentes afectados | T004 | ✓ |
| C-5 Prueba del motor y del contrato | Componentes afectados | T005, T020 | ✓ |
| C-6 README | Componentes afectados | T019 | ✓ |
| I-1 CLI del motor | Interfaces | T010 | ✓ |
| I-2 Salida del motor | Interfaces | T009, T010 | ✓ |
| I-3 Códigos de `reason` | Interfaces | T008, T013 | ✓ |
| I-4 Funciones exportadas | Interfaces | T006-T010 | ✓ |
| I-5 Variables de estado de la clasificación | Interfaces | T013 | ✓ |
| I-6 `$PREEXISTING` | Interfaces | T013 | ✓ |
| I-7 Severidad efectiva por informe | Interfaces | T014 | ✓ |
| I-8 `{{PREEXISTING_STATUS}}` y celda | Interfaces | T016, T018 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` `## Historias`, línea de STORY-181 |
| Objetivo de la historia alineado con la épica | ✓ | «no bloquee por ruido» (Objetivo) y la categoría PREEXISTENTE del Alcance; CS-4 («Un hallazgo PREEXISTENTE […] no cambia el veredicto ni entra en `fix-directives.md`») y SMOKE-2 los recorren E2E-001 y EV-001 |
| Restricciones de la épica respetadas | ✓ | CS-2: el contrato del informe no cambia (D-6, sin encabezados nuevos). CS-8: caso «hallazgo preexistente» en `evals.json` (T004) y gate verde (T024). Nota (b) de la épica: la cuestión de cómo identificar líneas no tocadas sin `git diff` se resuelve con un motor que sí usa git, dentro de la regla conservadora del ADR (D-1, CR-002) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Observaciones que no son inconsistencias ni bloquean:

1. **CR-001 pendiente en `story.md`** (design.md:326): AC-3 (`story.md:49-56`) y las Notas siguen diciendo que el ADR fija el método de líneas tocadas, pero el diseño de STORY-178 (D-6, CR-001) lo delega en este `design.md`, que lo fija en D-1 a D-3. Antes o durante la implementación, actualizar el texto de AC-3 y de la nota «Depende de STORY-178» como indica CR-001; T003 lo deja registrado.
2. **Dependencia de STORY-180** (en `PLAN/IN-PROGRESS`): los Pasos 4a.1, la severidad efectiva I-6 y la fila `Guía de revisión` que este diseño amplía aún no existen en `SKILL.md`. T001 fija el punto de inserción en ambos casos; las Notas de la historia piden implementar después de STORY-180, así que conviene respetar ese orden y evitar las dos ramas de T001.
3. **Gaps declarados en testcases.md** (Notas de cobertura): `git-unavailable`, `no-merge-base` y `engine-unavailable` no tienen UT propio. Si al implementar resulta barato simular `git` ausente (p. ej. un `PATH` vacío en `spawnSync`), añadir un UT para `git-unavailable`.
4. **Introducción de git en el skill** (D-1, CR-002): es una decisión de un solo skill delegada por ADR-0021 (D-6), por eso queda en `design.md` según la regla 16 de la constitución. Si STORY-185 reutiliza el motor con otra base (F-5), valorar entonces si la decisión pasa a afectar a más de una historia lo bastante como para un ADR.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Defecto preexistente no bloquea | ✓ | E2E-001, EV-001 (TC-030), UT-005 |
| AC-2 | Defecto en línea tocada bloquea | ✓ | E2E-002, EV-002 (TC-031), EV-004 (TC-033), UT-006, UT-007 |
| AC-3 | Líneas no determinables | ✓ | E2E-003, EV-003 (TC-032), UT-011 a UT-013 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-181` |
| tasks.md | ✓ | `/story-implement-tasks STORY-181` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 en bloques `gherkin` con Dado/Cuando/Entonces (`story.md:28-56`) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación» y la Autoevaluación (design.md:317) |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1 a D-8 y Esquema de datos llevan `// satisface:`; componentes e interfaces con columna `AC / CNF`; flujos con `// AC-N` o `// P6`/`// P7` |
| No hay decisiones de arquitectura aplazadas | ✓ | — | `## Open Questions`: ninguna; CR-001 y CR-002 registrados (design.md:324) |
| Existe tasks.md o testcases.md o ambos | ✓ | — | Ambos presentes |
| tasks.md contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 25 tareas con criterio «Hecho:» y dependencias; F-1 (T013-T016), F-2 (T014), F-3 (T008, T013, T017) |
| testcases.md contiene pruebas para todos los escenarios principales | ✓ | — | E2E-001 a E2E-003 uno a uno con AC-1 a AC-3, más EV y UT |
