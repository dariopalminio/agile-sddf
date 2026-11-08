---
type: analyze
id: STORY-183
slug: STORY-183-analyze-report
title: "Analyze: DoD CODE-REVIEW sin criterios circulares"
story: STORY-183
design: STORY-183
testcases: STORY-183
tasks: STORY-183
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-183-dod-code-review-sin-criterios-circulares
---

<!-- Referencias -->
[[STORY-183-dod-code-review-sin-criterios-circulares]]

# Reporte de Coherencia: DoD CODE-REVIEW sin criterios circulares

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo F

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | 3/3 ACs con caso de prueba; la fila 2 de los `Ejemplos:` de AC-3 se prueba con `created` y no con `substatus` (INC-001) |
| Alineación tareas → diseño | ✓ | 19/19 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 12/12 elementos con tarea (C-1 a C-5, I-1 a I-7) |
| Alineación con la épica EPIC-28-calibrar-story-code-review-con-review-md | ✓ | Historia listada; cubre CS-5 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Ningún criterio del DoD se cumple por generar el informe, depende del veredicto o de la ausencia de HIGH/MEDIUM; `memory-system check` pasa | ✓ | D-1 (quita los tres circulares), D-2 (quita «Se cumple [[dod-story-implement]]» y la cola «status y substatus actualizados»), I-1, C-1, C-2, D-7 aserción 2, contrato 1-2 |
| AC-2 | Un criterio cubierto por un revisor toma su resultado; una sola entrada en `fix-directives.md` y en el informe; el DoD no añade hallazgo | ✓ | D-3 (tabla «Criterios conocidos»), D-4 (entrada única), I-3, I-4, I-5, F-2, contrato 3 |
| AC-3 | Un criterio sin revisor produce su hallazgo con archivo y línea del DoD y una sola entrada en `fix-directives.md` | ✓ | D-5 (evidencia y severidad `MEDIUM` de los dos criterios propios), I-6, I-7, F-3, contratos 4-5; la fila 2 de `Ejemplos:` queda sujeta a CR-001 |
| CNF-1 | Guardrail y plantilla con los mismos criterios | ✓ | C-2 («(si existe el archivo)»), D-7 aserción 1, contrato 6 |
| CNF-2 | `verify:repository`, `npm test` y `memory-system check` pasan | ✓ | D-7, contrato 8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Resolver CR-001 y CR-002 en `story.md` con decisión humana | Registro de Cambios CR-001, CR-002 | ✓ |
| T002 | Estado de STORY-180/181/182 en el Paso 4a y fijar IDs de eval | I-4, D-6, F-5, Risks (conflictos de edición y numeración) | ✓ |
| T003 | Eval `dod-sin-criterios-autorreferentes` | D-6 (TC-038), C-4 | ✓ |
| T004 | Eval `criterio-cubierto-por-revisor-no-duplica` | D-6 (TC-039), C-4 | ✓ |
| T005 | Eval `criterio-propio-tasks-pendiente` | D-6 (TC-040), C-4 | ✓ |
| T006 | Eval `criterio-propio-frontmatter-incompleto` | D-6 (TC-041), C-4, CR-001 | ✓ |
| T007 | Prueba `test/dod-story-code-review.test.js` (RED) | D-7, C-5, I-2 | ✓ |
| T008 | Modificar el guardrail | D-1, D-2, C-1, I-1 | ✓ |
| T009 | Modificar la plantilla de `sddf-constitution` | D-1, D-2, C-2, CNF-1 | ✓ |
| T010 | Tabla «Criterios conocidos» en el Paso 4c.1 | D-3, I-2, I-3, C-3 | ✓ |
| T011 | Regla de criterios cubiertos | D-3, I-4, I-5, C-3 | ✓ |
| T012 | Evidencia y severidad de los criterios propios | D-5, I-6, C-3 | ✓ |
| T013 | Regla de entrada única | D-4, C-3 | ✓ |
| T014 | Evidencia en el Paso 5b y fila de manejo de errores | I-5, F-4, C-3 | ✓ |
| T015 | Ejecutar la prueba de contrato (GREEN) | D-7, contratos 1, 6, 7 | ✓ |
| T016 | Grep de AC-1 sobre los dos DoD | D-1, contrato 1 | ✓ |
| T017 | Recorrido manual de F-1 a F-3 contra los evals | F-1, F-2, F-3, D-6 | ✓ |
| T018 | `npm run verify:repository` y `npm test` | CNF-2, contratos 2 y 8 | ✓ |
| T019 | UTF-8 sin BOM y `graphify update .` | Restricciones del repositorio (AGENTS.md, encoding) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 — DoD CODE-REVIEW del repo | Componentes afectados | T008 | ✓ |
| C-2 — Plantilla del DoD | Componentes afectados | T009 | ✓ |
| C-3 — Árbitro de `story-code-review` | Componentes afectados | T010, T011, T012, T013, T014 | ✓ |
| C-4 — Evals del skill | Componentes afectados | T003, T004, T005, T006 | ✓ |
| C-5 — Prueba de contrato del DoD | Componentes afectados | T007, T015 | ✓ |
| I-1 — Lista de criterios del DoD | Interfaces | T008, T009 | ✓ |
| I-2 — Texto normalizado | Interfaces | T007, T010 | ✓ |
| I-3 — Tabla «Criterios conocidos» | Interfaces | T010 | ✓ |
| I-4 — Hallazgos que cuentan de un revisor | Interfaces | T002, T011 | ✓ |
| I-5 — Resultado de un criterio cubierto | Interfaces | T011, T014 | ✓ |
| I-6 — Resultado de un criterio propio | Interfaces | T012, T013 | ✓ |
| I-7 — Fila DoD en `fix-directives.md` | Interfaces (sin cambios) | T014 (comprueba plantillas intactas) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, línea 35 (STORY-183) |
| Objetivo de la historia alineado con la épica | ✓ | Alcance (línea 24): «`dod-story-code-review.md` (guardrail y plantilla de `sddf-constitution`) sin criterios circulares ni duplicados con los revisores»; CS-5 (línea 45) lo cubren D-1, D-7 y el contrato 2 |
| Restricciones de la épica respetadas | ✓ | La historia modifica el DoD y recibe la advertencia de D-5 del ADR de STORY-178 sin cambiar `verdict` (F-4); evals primero (Notas de la épica, principio 11: T003-T006 antes de T010-T014); `npm run test:eval` a criterio humano (T017) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** F: AC sin caso de prueba
- **Descripción:** La fila 2 de `Ejemplos:` de AC-3 dice `"story.md" no tiene el campo "substatus"`. Ningún caso la prueba tal cual: E2E-004 y EV-004 usan `created`. design.md CR-001 explica por qué: sin `substatus` el Paso 1d de `story-code-review` se detiene antes del DoD (`SKILL.md:214-233`), y el Paso 1e escribe `substatus` antes del Paso 4c.1. Mientras `story.md` no cambie, la historia y los casos de prueba no coinciden en esa fila.
- **Archivo afectado:** `story.md` — sección «AC-3 — Escenario alternativo», `Ejemplos:` (línea 61); `testcases.md` — E2E-004, EV-004
- **Acción requerida:** aplicar CR-001 (T001): cambiar `substatus` por `created` en esa fila de `Ejemplos:` antes de implementar. Si el humano rechaza el cambio, volver a `/story-design` para buscar otro mecanismo para esa fila.

---

## Recomendaciones

1. **INC-001:** T001 bloquea la implementación hasta aplicar CR-001 en `story.md` (`Ejemplos:` de AC-3, línea 61). No hace falta tocar el plan: design.md, tasks.md y testcases.md ya usan `created`.
2. **CR-002 (sin inconsistencia, conviene confirmarlo):** el diseño amplía lo que dicen las Notas de la historia. (a) Retira «Se cumple [[dod-story-implement]]» (D-2). (b) Quita «con status y substatus actualizados» del criterio de metadatos. (c) Asigna el criterio de `constitution.md` al Tech-Lead-Reviewer (D-3), además de los dos criterios que nombra la historia. Las tres cosas encajan con el alcance de la épica («sin criterios circulares ni duplicados con los revisores»). Conviene que T001 las registre en las Notas de `story.md` para que `/story-acceptance` no las tome como cambios fuera de alcance.
3. **Cobertura de D-4 y F-4:** la regla de entrada única para criterios no conocidos y la degradación con un revisor sin informe o en `--single-agent` no tienen eval (`testcases.md`, Notas de cobertura). El recorrido manual de T017 las cubre. Si se quiere fijarlas, conviene añadir un quinto eval con `dod_criteria` que incluya «Se cumple [[dod-story-implement]]».
4. **Numeración de evals:** STORY-181 y STORY-182 reservan los mismos TC-030 a TC-033. T002 fija los IDs libres al implementar; los IDs nominales TC-038 a TC-041 de design.md D-6 pueden cambiar sin afectar al plan.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Sin criterios autorreferentes; `memory-system check` pasa | ✓ | E2E-001, UT-002, IT-001, EV-001 |
| AC-2 | Criterio cubierto por revisor sin hallazgo duplicado | ✓ | E2E-002, UT-003, UT-004, EV-002 |
| AC-3 | Criterio sin revisor produce su hallazgo (dos filas de `Ejemplos:`) | ⚠️ | E2E-003 y EV-003 (fila 1, `tasks.md`); E2E-004 y EV-004 (fila 2, con `created` en lugar de `substatus`, INC-001) |
| CNF-1 | Guardrail y plantilla alineados | ✓ | UT-001 |
| CNF-2 | Gate verde | ✓ | IT-001, IT-002 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-183` |
| tasks.md | ✓ | `/story-implement-tasks STORY-183` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | `story.md` AC-1 a AC-3 en bloques `gherkin`; AC-3 como `Esquema del escenario` con `Ejemplos:` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1, D-2; AC-2: D-3, D-4; AC-3: D-5, I-6 (tabla de cobertura arriba) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1 a D-7 y el Esquema de datos llevan `// satisface:`; las tablas de componentes e interfaces tienen columna `AC / CNF` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | El mecanismo que la historia dejaba abierto lo fija D-3; `## Open Questions`: «Ninguna»; la inviabilidad y la ampliación de alcance quedan en CR-001 y CR-002 |
| DEBE existir tasks.md o testcases.md o ambos (serán input para la planificación) | ✓ | — | Ambos presentes |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 19 tareas con criterio «Hecho:» y dependencias; AC-1: T003, T008, T009, T016; AC-2: T004, T010, T011, T013; AC-3: T005, T006, T012, T013 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | E2E-001 a E2E-004 trazados 1-a-1 a AC-1, AC-2 y las dos filas de AC-3 |
