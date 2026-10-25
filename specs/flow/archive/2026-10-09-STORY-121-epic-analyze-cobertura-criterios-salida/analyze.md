---
type: analyze
id: STORY-121
slug: STORY-121-analyze-report
title: "Analyze: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias"
story: STORY-121
design: STORY-121
tasks: STORY-121
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-121-epic-analyze-cobertura-criterios-salida
---

<!-- Referencias -->
[[STORY-121-epic-analyze-cobertura-criterios-salida]] · [[EPIC-22-epic-analyze]]

# Reporte de Coherencia: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1…CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (5 componentes + 6 interfaces); los 8 contratos de verificación tienen tarea |
| Alineación con la épica EPIC-22-epic-analyze | ✓ | Listada en el índice (F2 canónico), con objetivo y criterio de salida propios |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ✓ Coherente (0 ERROR, 0 WARNING)

> Dependencia de orden (CR-001): `skills/epic-analyze/` **no existe** todavía y EPIC-22 › Notas fija STORY-120 → STORY-121. No es una inconsistencia de los artefactos (T001 la comprueba y se detiene), pero STORY-121 no puede implementarse antes que STORY-120.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Contrato de salida cubierto: tabla que asocia cada criterio y `SMOKE-1` con su historia, sin hallazgos de cobertura (story.md l. 28–36) | ✓ | D-1, D-2, D-3, D-4 (E1/E2 + 5 ejemplos), D-6 (sección `cobertura-salida`), D-7, I-2, I-3, I-5, F-1, componentes "Template seed del reporte" y "Contrato del skill", TC-011 (D-8), contrato #1 |
| AC-2 | Huecos: criterio sin historia → ERROR; `SMOKE-2` sin historia → WARNING; "Criterios de salida" vacía/ausente → ERROR; "Smoke tests" vacía/ausente → ERROR (story.md l. 38–50) | ✓ | D-5 (`SAL-01`…`SAL-04`, mapeo fila → código en l. 183–184), D-2 (placeholder = sección vacía, CR-003 confirmado), I-4, I-6, F-2, TC-012…TC-015, contrato #2 |
| CNF-1 | Evidencia citable por asociación | ✓ | D-4 (cita `mención · story.md:<línea>` / `AC-<n> · story.md:<línea>`), D-6, contratos #3–#4, TC-016 |
| CNF-2 | Mismo reporte y veredicto; sin modificar `epic.md`/`story.md` | ✓ | D-1, D-5, D-7, D-9, I-6, "No se modifica" (l. 261–262), contrato #5, `not_contains` de bloques `=== FILE:` (D-8) |
| CNF-3 | Idempotencia | ✓ | D-2 (`CS-n` posicional), D-4 (orden E1 → E2, AC de menor número, orden por `STORY-NNN`), D-6, TC-018, contrato #6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar `skills/epic-analyze/` y registrar línea base (incluye TC-026/TC-027) | CR-001; D-1, D-5, D-6 | ✓ |
| T002 | Línea base de `npm test`, `verify:eval-inventory`, `verify:links`, `test:eval -- epic-analyze` | Contratos #7, #8 | ✓ |
| T003 | Completar `input` de TC-001…TC-006, TC-008, TC-010, TC-026, TC-027 con contrato de salida cubierto por E1 | D-8, CR-002 | ✓ |
| T004 | Añadir TC-011…TC-015 | D-8; AC-1, AC-2; CR-003 | ✓ |
| T005 | Añadir TC-016…TC-018 y `not_contains` de bloques FILE | D-8, D-3, D-4; CNF-1…CNF-3; CR-004 | ✓ |
| T006 | Validar JSON, `--dry-run` (20 casos) y commit solo de `evals.json` | D-8 | ✓ |
| T007 | Sección `cobertura-salida` y conteo en `resumen` del template seed | D-6, I-5 | ✓ |
| T008 | Vía B ampliada con `status` y cuerpo para el universo | D-3, F-3 | ✓ |
| T009 | Ampliar cláusula `ai-untrusted-content-clause` | D-7 | ✓ |
| T010 | Paso nuevo de la familia `SAL-`: extracción del contrato | D-1, D-2, I-2 | ✓ |
| T011 | Regla de evidencia E1 → E2 con los cinco ejemplos | D-4, I-3 | ✓ |
| T012 | Catálogo `SAL-01…SAL-04`, supresiones, regla desactivada y orden | D-5, I-4, CR-003 | ✓ |
| T013 | Escritura de la clave `cobertura-salida` y conteo en `resumen` | D-6, I-5 | ✓ |
| T014 | Disparadores en `description` y `Objetivo`; D-7, I-1 e I-3 de STORY-120 sin cambio | D-1, I-1, I-6 | ✓ |
| T015 | Revisión de `SKILL.md` (< 500 líneas, sin encabezados de reporte, sin escrituras) | D-1, D-6; Risks (límite de 500 líneas) | ✓ |
| T016 | `CHANGELOG.md` (STORY-121, EPIC-22) | D-9; componente "Changelog" | ✓ |
| T017 | `domain-epic-lifecycle.md` §8 | D-9; componente "Ciclo de vida de épica" | ✓ |
| T018 | Contrato #8 y orden de commits evals → `SKILL.md` | Contrato #8, D-8 | ✓ |
| T019 | `npm run test:eval -- epic-analyze` con TC-001…TC-018, TC-026 y TC-027 | Contratos #1–#5, #7 | ✓ |
| T020 | Ejecución real `/epic-analyze EPIC-22 --auto` dos veces | Contrato #6; Risks (posibles `SAL-01` en EPIC-22) | ✓ |
| T021 | Regresión contra la línea base (enlaces: sin rotos nuevos) y encoding | Contratos #7, #8 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Casos de eval (`skills/epic-analyze/evals/evals.json`) | Componentes afectados l. 255; D-8 | T003–T006 (creación), T019 (ejecución) | ✓ |
| Template seed del reporte | Componentes afectados l. 256; D-6 | T007 | ✓ |
| Contrato del skill (`skills/epic-analyze/SKILL.md`) | Componentes afectados l. 257; D-1…D-7 | T008–T015 | ✓ |
| Changelog | Componentes afectados l. 258; D-9 | T016 | ✓ |
| Ciclo de vida de épica (§8) | Componentes afectados l. 259; D-9 | T017 | ✓ |
| I-1 Invocación (sin cambio) | Interfaces l. 268 | T014 | ✓ |
| I-2 Extracción del contrato | Interfaces l. 269 | T010 | ✓ |
| I-3 Evaluación de cobertura | Interfaces l. 270 | T011 | ✓ |
| I-4 Hallazgo | Interfaces l. 271 | T012 | ✓ |
| I-5 Template del reporte | Interfaces l. 272 | T007, T013 | ✓ |
| I-6 Retorno en modo Agent (sin cambio) | Interfaces l. 273 | T014, T020 | ✓ |

Contratos de verificación (l. 327–336): #1–#5 y #7 → T019; #6 → T020; #8 → T018. Todos con tarea.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. (Los casos se especifican como evals TC-011…TC-018 en design.md › D-8 y tasks.md › T004–T005: AC-1 → TC-011; AC-2 → TC-012…TC-015.)

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-121` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-121` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-22-epic-analyze (`docs/specs/02-epics/EPIC-22-epic-analyze/epic.md`, `status: DEFINE`, `substatus: TODO`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias` l. 27: `- [ ] **STORY-121** — Cobertura de criterios de salida …` (F2 canónico) |
| Objetivo de la historia alineado con la épica | ✓ | El Alcance cubre "la cobertura del contrato de salida (criterios de salida y smoke tests)"; el criterio de salida l. 33 cita STORY-121 |
| Restricciones de la épica respetadas | ✓ | La tabla de dependencias de EPIC-22 › Notas (121 depende de 120) está recogida en CR-001 y T001; no modifica templates de épica ni de historia y declara el escritor de la sección nueva (`escritor: epic-analyze`, D-6) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. **Orden de implementación (CR-001):** implementar STORY-120 primero; T001 se detiene si `skills/epic-analyze/` no existe.
2. **CR-002:** STORY-122, posterior, completa sus mundos TC-019…TC-025 con un contrato de salida cubierto por E1; ya está recogido en STORY-122 › D-8 y T004/T005.

**Observaciones (no tipificadas, no cuentan como hallazgo):**

- `tasks.md` › T021 (l. 70) pide "comparar con la línea base de T002 (exit 0 sin regresiones)" para `npm run verify:links`, pero hoy el repositorio ya tiene 2 enlaces rotos ajenos a esta historia (`docs/guides/orchestrator-subagent-pattern.md:148` y `docs/index.md:262`), así que `verify:links` no termina en exit 0 ni siquiera en la línea base. Resuelto (2026-10-08): T021 exige ahora "sin enlaces rotos nuevos respecto a la línea base" (mismo ajuste en STORY-120 › T026).
- D-8 afirma que el contrato de salida añadido a TC-026/TC-027 "evita hallazgos `SAL-` ajenos". En TC-027 (épica sin sección de historias) solo es cierto si su mundo incluye al menos una historia con `parent` → la épica que aporte la evidencia E1. Si no, aparecerán `SAL-01`/`SAL-02`. Es inocuo para sus aserciones (`INT-06`, `BLOCKED`). Resuelto (2026-10-08): D-8 y T003 exigen esa historia en el mundo de TC-027.

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (resuelto por `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (l. 29–36) y AC-2 como esquema con 4 ejemplos (l. 39–50) |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | AC-1 → D-1/D-2/D-3/D-4/D-6; AC-2 → D-5 (mapeo explícito l. 183–184) |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | D-1…D-9 con `// satisface: AC-N` (l. 66–239); las 5 filas de "Componentes afectados" con `// satisface: AC-N` (l. 255–259); I-1…I-6 con AC en la columna "AC / CNF" (l. 268–273) |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna" (l. 353–355); CR-003/CR-004 confirmados por el PO (2026-10-08); CR-001/CR-002 con acción definida |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T021) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T004 (TC-011), T007, T010, T011, T013, T019; AC-2 → T004 (TC-012…TC-015), T012, T019; cada tarea toca un solo archivo o una sola verificación |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente (pruebas especificadas como evals en D-8 / T004–T005) |
