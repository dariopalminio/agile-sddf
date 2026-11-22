---
type: analyze
id: STORY-182
slug: STORY-182-analyze-report
title: "Analyze: Verificación y deduplicación de hallazgos del árbitro"
story: STORY-182
design: STORY-182
testcases: STORY-182
tasks: STORY-182
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-182-verificar-y-deduplicar-hallazgos
---

<!-- Referencias -->
[[STORY-182-verificar-y-deduplicar-hallazgos]]

# Reporte de Coherencia: Verificación y deduplicación de hallazgos del árbitro

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-3) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 componentes y 9/9 interfaces con tarea |
| Alineación con la épica EPIC-28-calibrar-story-code-review-con-review-md | ✓ | Listada como STORY-182; cubre la parte de verificación y deduplicación de CS-4 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Un `HIGH`/`MEDIUM` sin `Archivo:Línea` o sin escenario de fallo figura como «no verificado» y no cuenta para `max-severity`, el veredicto ni `fix-directives.md`; con los dos, es «bloqueante» | ✓ | I-2, I-3, I-5, I-8; D-1, D-2, D-3, D-6; F-1; C-1 (Pasos 4a.2, 4b, 4c, 4c.1, 4e-4f) |
| AC-2 | El mismo defecto de dos revisores aparece una vez, como `HIGH` y citando a los dos, en el informe y en `fix-directives.md` | ✓ | I-6, I-7, I-9; D-4, D-5, D-6; F-2; C-1 (Paso 4a.3, 4f.2, 5b) |
| AC-3 | Hallazgos distintos (otra línea, o la misma línea con otra corrección) no se fusionan y no citan a más de un revisor | ✓ | I-6; D-4 (fase 2 y ejemplos de la historia), D-5; F-3 |
| CNF-1 | `verdict` y `max-severity` sin cambios de valores ni significado | ✓ | D-1, D-5, D-6 (plantillas sin cambios; I-8 equivalente al cálculo actual sin cambios en los hallazgos) |
| CNF-2 | Evals primero | ✓ | D-8 (TC-030 a TC-033 y migración de 11 casos), D-9 aserción 4 |
| CNF-3 | Los cuatro agentes piden `Archivo:Línea` y escenario | ✓ | D-2, D-7, I-1; C-2 a C-5 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Versión de partida frente a STORY-180 y STORY-177 | F-5, Risks (conflicto de edición) | ✓ |
| T002 | Fijar IDs de eval y casos a migrar | D-8 | ✓ |
| T003 | Migrar los 11 casos `NEEDS-CHANGES` con `failure_scenario` | D-8, C-6 | ✓ |
| T004 | Caso `bloqueantes-sin-evidencia-no-cuentan` | D-8, AC-1 | ✓ |
| T005 | Caso `bloqueante-verificado-junto-a-no-verificado` | D-8, AC-1 | ✓ |
| T006 | Caso `hallazgo-duplicado-entre-revisores-se-fusiona` | D-8, AC-2 | ✓ |
| T007 | Caso `hallazgos-distintos-no-se-fusionan` | D-8, AC-3 | ✓ |
| T008 | Prueba `test/story-code-review-evidence-dedup.test.js` (RED) | D-9, C-8 | ✓ |
| T009 | Principio compartido del Paso 3b | D-7, C-1 | ✓ |
| T010 | Paso 4a.2 (verificación) | D-2, D-3, I-2 a I-5 | ✓ |
| T011 | Paso 4a.3 (fusión) | D-4, I-6, I-7 | ✓ |
| T012 | Paso 4b (severidad efectiva) | D-6, I-8 | ✓ |
| T013 | Pasos 4c y 4c.1 | D-6 | ✓ |
| T014 | Pasos 4e y 4f.2 | D-5, D-6 | ✓ |
| T015 | Paso 5b (tablas consolidadas, justificación) | D-5, D-6, I-9 | ✓ |
| T016 | Manejo de errores | F-4 | ✓ |
| T017 | Sección de evidencia en Tech-Lead-Reviewer | D-7, I-1, C-2 | ✓ |
| T018 | Sección y ejemplos en los otros tres agentes | D-2, D-7, C-3 a C-5 | ✓ |
| T019 | Ejemplos del skill con `Fallo:` | C-7 | ✓ |
| T020 | Frase en el README | C-9 | ✓ |
| T021 | Prueba unitaria en GREEN | D-9 | ✓ |
| T022 | Verificación manual de AC-1 a AC-3, CNF-1, CNF-3 | Contratos de verificación 1-8 | ✓ |
| T023 | Encoding y JSON válido | Restricción de encoding de skills | ✓ |
| T024 | `npm test` y `npm run verify:repository` | Contrato de verificación 9 | ✓ |
| T025 | `graphify update .` e `implement-report.md` | AGENTS.md (graphify), CR-001 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Orquestador (árbitro) | Componentes afectados | T009-T016 | ✓ |
| C-2 Tech-Lead-Reviewer | Componentes afectados | T017 | ✓ |
| C-3 Product-Owner-Reviewer | Componentes afectados | T018 | ✓ |
| C-4 Integration-Reviewer | Componentes afectados | T018 | ✓ |
| C-5 Security-Reviewer | Componentes afectados | T018 | ✓ |
| C-6 Evals del skill | Componentes afectados | T003-T007 | ✓ |
| C-7 Ejemplos del skill | Componentes afectados | T019 | ✓ |
| C-8 Prueba de contrato | Componentes afectados | T008, T021 | ✓ |
| C-9 README del skill | Componentes afectados | T020 | ✓ |
| I-1 Sección de evidencia | Interfaces | T017, T018 | ✓ |
| I-2 `Archivo:Línea` válido | Interfaces | T008, T010 | ✓ |
| I-3 Escenario de fallo concreto | Interfaces | T010 | ✓ |
| I-4 `$FINDINGS` | Interfaces | T010 | ✓ |
| I-5 `estado` | Interfaces | T010 | ✓ |
| I-6 Fusión | Interfaces | T011 | ✓ |
| I-7 Hallazgo fusionado | Interfaces | T011, T014 | ✓ |
| I-8 Severidad efectiva | Interfaces | T012 | ✓ |
| I-9 Tablas por dimensión | Interfaces | T015 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:34` (STORY-182 — Verificación, deduplicación hallazgos) |
| Objetivo de la historia alineado con la épica | ✓ | «que un falso positivo no me cueste una ronda» coincide con el objetivo («no bloquee por ruido») y con la nota de vocabulario de `epic.md:88` («un falso MEDIUM cuesta una ronda completa») |
| Restricciones de la épica respetadas | ✓ | CS-4 (parte de verificación y deduplicación; tope de LOW en STORY-185); CS-2 (contrato del informe sin cambios: D-1, D-5); evals primero (`epic.md:92`, D-8); sin cambios en `docs/guardrails/` (STORY-183) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E — criterio DoD PLAN «No hay decisiones de arquitectura aplazadas» evaluado como ⚠️
- **Descripción:** I-7 define la severidad del hallazgo fusionado como «la mayor de los miembros que cuentan» y el representante como «el miembro `bloqueante` de mayor severidad». Para un grupo en el que ningún miembro es `bloqueante` (dos `HIGH` con `Archivo:Línea` válido y sin escenario, en la misma línea y con la misma corrección), ninguna de las dos reglas da resultado: no hay miembros que cuenten ni representante `bloqueante`. El estado (`no verificado`) sí está definido.
- **Archivo afectado:** design.md — sección "Interfaces", fila I-7 (y D-4 paso 3)
- **Acción requerida:** completar I-7: si ningún miembro es `bloqueante`, la severidad mostrada es la mayor de todos los miembros y el representante se elige con la misma regla de severidad y desempate entre todos los miembros; el grupo sigue `no verificado` y no cuenta.

---

## Recomendaciones

1. **INC-001:** añadir en design.md, fila I-7, la regla del grupo sin miembros `bloqueante` (ver acción requerida) y reflejarla en la descripción de T011 en tasks.md.
2. **Observación (no bloquea) — alcance de la aserción 2 de D-9 / UT-002:** `security-reviewer.agent.md` tiene dos tablas que no son de hallazgos y contienen `HIGH`/`MEDIUM`: el baseline embebido (líneas 95-104, filas que empiezan por `` `BASE-NN` ``) y la normalización de severidad (líneas 114-118, filas que empiezan por `` `CRITICAL` ``). Precisar en design.md (D-9, aserción 2), en T008 y en UT-002 que la aserción recorre solo las filas cuya **primera celda** es exactamente `HIGH` o `MEDIUM`, para que la prueba no exija `Fallo:` en esas tablas.
3. **Observación (no bloquea) — `not_contains` inefectivo en TC-031 / EV-002:** la lista blanca de `fix-directives.md` escribe las rutas entre backticks (`` - `src/users.ts` (hallazgo #1) ``, `examples/example-needs-changes-medium/fix-directives.md:31`), así que la cadena `src/db.js (hallazgo` nunca aparece y la aserción no detecta nada. Cambiarla en design.md (D-8), T005 y EV-002 por `` src/db.js` (hallazgo `` o por `src/db.js` a secas si el caso no nombra ese archivo en otro lugar de la salida esperada (lo nombra: el `no verificado` figura en el informe, así que la primera opción es la correcta).
4. **CR-001 de design.md** (los `MEDIUM` de mantenibilidad y de dependencias necesitan escenario para bloquear): no es una inconsistencia del plan, pero cambia el comportamiento del gate; T025 ya la lleva a `implement-report.md` para que se confirme en `/story-acceptance`.
5. **Orden de implementación:** STORY-180 y STORY-185 editan el Paso 4 y STORY-177/STORY-180 los mismos agentes; T001 y F-5 lo resuelven. Implementar después de STORY-180, como recomiendan las Notas de la historia.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Un bloqueante sin evidencia no bloquea (tres ejemplos) | ✓ | E2E-001, EV-001 (filas 1-2), EV-002 (fila 3), UT-003, UT-004, IT-001, IT-002, IT-003, IT-004 |
| AC-2 | Deduplicación | ✓ | E2E-002, EV-003, UT-003, IT-001, IT-003, IT-004 |
| AC-3 | Hallazgos distintos no se fusionan | ✓ | E2E-003, EV-004, IT-004 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-182` |
| tasks.md | ✓ | `/story-implement-tasks STORY-182` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | `story.md:30-58`: AC-1 (Scenario Outline con tres ejemplos), AC-2 y AC-3 en Gherkin |
| design.md existe y cubre todos los ACs de story.md | ✓ | — | Tabla «Cobertura de Criterios de Aceptación» de este reporte; «Autoevaluación» de design.md |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Goals, D-1 a D-9 y Esquema de datos con `// satisface:`; tablas de Componentes e Interfaces con columna `AC / CNF` |
| No hay decisiones de arquitectura aplazadas | ⚠️ | WARNING | Open Questions: «Ninguna»; CR-001 registrado; queda sin regla el grupo fusionado sin miembros `bloqueante` (INC-001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existen los dos |
| Si tasks.md existe, contiene tareas atómicas para todos los escenarios principales | ✓ | — | T004-T007 (evals por AC), T010-T015 (pasos del árbitro), T022 (verificación de AC-1 a AC-3); cada tarea tiene criterio «Hecho» |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | E2E-001 a E2E-003 trazables 1-a-1 a AC-1 a AC-3, más EV-001 a EV-004 |
