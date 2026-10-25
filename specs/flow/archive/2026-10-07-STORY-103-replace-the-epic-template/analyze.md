---
type: analyze
id: STORY-103
slug: STORY-103-analyze-report
title: "Analyze: Reemplazar el template de Epic por la versión minimalista y output-oriented"
story: STORY-103
design: STORY-103
testcases: STORY-103
tasks: STORY-103
created: 2026-10-06
updated: 2026-10-06
related:
  - STORY-103-replace-the-epic-template
---

<!-- Referencias -->
[[STORY-103-replace-the-epic-template]]

# Reporte de Coherencia: Reemplazar el template de Epic por la versión minimalista y output-oriented

> Regenerado el 2026-10-06 tras tres cambios: el contrato por claves de sección (D-2b, CR-011), la
> retirada del formato v1 en 4.0.0 (CR-007) y la corrección de `parent` (CR-001).

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 11/11 criterios cubiertos (+ CNF-1…CNF-5) |
| Cobertura de ACs en testcases.md | ✓ | 11/11 ACs con caso de prueba (56 casos: 11 E2E, 22 UT, 4 IT, 19 EV) |
| Alineación tareas → diseño | ✓ | 35/35 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 17/18 elementos con tarea (falta verificación de `package.json › files`) |
| Alineación con la épica `EPIC-21-colapsar-specs-dos-niveles` | ✓ | Historia listada, objetivo alineado, restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ✓ | 6/7 criterios ✓, 1 ⚠️ (ninguno ❌) |

**Estado general:** ⚠️ Advertencias (sin inconsistencias bloqueantes)

> El DoD se cargó desde `docs/guardrails/dod-story-plan.md` (mapeo `sddf.config.yaml › guardrails.dod.story.plan`).
> `docs/policies/definition-of-done-story.md` no existe en este repo: STORY-101 dividió el DoD
> monolítico por etapa.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Template con exactamente 5 secciones, sin las 8 eliminadas | ✓ | D-1 (contrato v2 con `clave:`), D-2b, D-8 |
| AC-2 | `Alcance` primera sección, guía output-oriented | ✓ | D-1 |
| AC-3 | `Historias` con 3 formatos, ejemplo sin ID | ✓ | D-1, D-2, D-9 |
| AC-4 | `Criterios de salida` técnicos verificables | ✓ | D-1 |
| AC-5 | Smoke tests `SMOKE-N` + gherkin, no-renumerar, numeración opcional | ✓ | D-1, D-3 regla 4, CR-005 |
| AC-6 | `Notas` al final, opcional | ✓ | D-1, CR-004 |
| AC-7 | Frontmatter mínimo, `status: DEFINE`, sin `implements/deliveryModel/children` | ✓ | D-1, Esquema de datos, CR-008 |
| AC-8 | `epic-creation` y `epic-from-project-plan` usan el template; `## DoD aplicable`; las épicas generadas pasan la validación | ✓ | D-4 (preguntas y mapeo por clave), D-8, CR-002 |
| AC-9 | `epic-generate-stories` / `-all-stories` F1 → F2; `story-implement` F2 → F3 | ✓ | D-5, D-6 (sección localizada por clave `historias`), CR-009 |
| AC-10 | Migración sin pérdida e idempotente | ✓ | D-7 (destino leído del template por clave, R1–R11 + R8b), F-4 |
| AC-11 | Gate: 5 secciones, formatos, `SMOKE-N`, mensajes accionables | ✓ | D-3 (reglas por clave), D-2b |

CNF-1 (D-1: 40 líneas, claves en la misma línea del marcador) · CNF-2 (D-9) · CNF-3 (D-9) ·
CNF-4 (D-3, D-5, D-6: v1 retirado en 4.0.0, CR-007) · CNF-5 (D-1): todos cubiertos.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001–T002 | Fixtures v1, template personalizado (f), template sin claves (g) y `expected.md` | D-2b, D-7, D-10 | ✓ |
| T003 | Reescribir el template central con `clave:` | D-1, D-2b | ✓ |
| T004 | Copiar al seed + `diff` | D-8 | ✓ |
| T005 | `readTemplateContract` + `planEpicMigration` (R1/R3/R5/R11 por clave) | D-2b, D-7 | ✓ |
| T006–T008 | R7, R2/R4, R6/R8/R8b/R9, punto fijo | D-7 | ✓ |
| T009 | `migrateEpics` (contrato central → seed, aviso de template sin claves) | D-7, D-8 | ✓ |
| T010–T011 | Motor y `memory-system/SKILL.md` | D-7 | ✓ |
| T012–T013 | Gate: contrato por claves, reglas por clave, sin detección de títulos v1 | D-2b, D-3 | ✓ |
| T014 | README del gate | D-9 | ✓ |
| T015–T017 | `epic-creation`: preguntas desde el template, manejo especial por clave, `## DoD aplicable`, README/examples | D-4 | ✓ |
| T018–T019 | `epic-from-project-plan`: mapeo plan → clave, Fase 3e | D-4 | ✓ |
| T020–T021 | `epic-generate-stories` / `-all-stories`: sección por clave, solo F1–F3 | D-5 | ✓ |
| T022–T023 | `story-implement` 11d / `story-implement-tasks` 4c por clave | D-6 | ✓ |
| T024 | Dominio: contrato por claves, F1–F3, SMOKE-N | D-2b, D-9 | ✓ |
| T025–T026 | Guía de pipeline, CHANGELOG (BREAKING + `clave:`) | D-9 | ✓ |
| T027–T028 | `test/epic-template.test.js` | D-10 | ✓ |
| T029–T030 | `evals.json` (incluye títulos renombrados y template sin `smoke-tests`) | D-2b, D-10 | ✓ |
| T031–T033 | Migración del repo + gate | D-7, F-4 | ✓ |
| T034–T035 | `npm test`, `verify:links`, evals | Contratos de verificación 14–22 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Template central | D-1 | T003 | ✓ |
| Template seed | D-8 | T004 | ✓ |
| Contrato por claves (vocabulario, lectura, validez) | D-2b | T003, T005, T012, T024, T028 | ✓ |
| `readTemplateContract` | D-2b, Interfaces | T005, T027 | ✓ |
| Gate de formato (+ README, evals) | D-3 | T012, T013, T014, T029 | ✓ |
| Creación interactiva | D-4 | T015, T016, T017, T030 | ✓ |
| Generación desde plan | D-4 | T018, T019, T030 | ✓ |
| Asignación de IDs | D-5 | T020, T030 | ✓ |
| Asignación batch | D-5 | T021 | ✓ |
| Marcado de completada | D-6 | T022, T023 | ✓ |
| Migrador `epic-template.js` | D-7 | T005–T009 | ✓ |
| Motor de memoria | D-7 | T010 | ✓ |
| Skill de memoria | D-7 | T011 | ✓ |
| Fixtures de migración | D-10 | T001, T002 | ✓ |
| Tests | D-10 | T027, T028 | ✓ |
| Épicas del repo | D-7, F-4 | T031–T033 | ✓ |
| Dominio Epic + CHANGELOG | D-9 | T024, T026 | ✓ |
| Verificación `package.json › files` | Componentes afectados (párrafo final) | — | ⚠️ |

---

## Alineación con la Épica

**Épica padre:** `EPIC-21-colapsar-specs-dos-niveles`

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias`, primera línea: `**STORY-103 — Reemplazar el template de Epic…**` |
| Objetivo alineado | ✓ | Épicas output-oriented cuyo valor de negocio vive en `product/vision.md`/`requirements/`, coherente con el colapso de `01-projects/` en `product/` |
| Restricciones respetadas | ✓ | Breaking change en 4.0.0 con migración automática, como el resto de EPIC-21 (CR-007). El migrador descubre las épicas por patrón `specs/*/EPIC-*/epic.md` y no añade rutas `02-epics/` (STORY-108) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C
- **Descripción:** `design.md` › "Componentes afectados" pide verificar que `package.json › files` incluye `scripts/epic-template.js` y `examples/`, pero ninguna tarea lo cubre. Durante el análisis se comprobó que `files` incluye `"skills/"` completo, así que el riesgo es nulo.
- **Archivo afectado:** `tasks.md` — grupo 9.
- **Acción requerida:** ninguna obligatoria; opcionalmente añadir la comprobación a T034.

### INC-002 [WARNING]

- **Tipo:** E (⚠️, no bloqueante)
- **Descripción:** criterio DoD de tareas atómicas. Tres tareas agrupan varias piezas y pueden exceder una sesión de ≤ 2 h:
  - T005: `readTemplateContract` + base de `planEpicMigration`.
  - T008: R6, R8, R8b, R9 y punto fijo.
  - T013: dos reglas de forma más el bloque de salida.
- **Archivo afectado:** `tasks.md` — T005, T008 (grupo 3), T013 (grupo 4).
- **Acción requerida:** dividirlas al implementar si no caben en una sesión (p. ej. T005a `readTemplateContract` / T005b renombres).

### INC-003 [WARNING]

- **Tipo:** D
- **Descripción:** queda abierta una decisión del PO que no bloquea el diseño: CR-002 (AC-8 cita un guardrail de Epic que no existe; el diseño remite al Gate de formato `DEFINE → PLAN`). CR-001, CR-006, CR-007 y CR-011 ya están resueltos.
- **Archivo afectado:** `design.md` — "Registro de Cambios (CR)"; `story.md` — AC-8.
- **Acción requerida:** confirmar la resolución de D-4 o ajustar el texto de AC-8.

---

## Recomendaciones

1. **INC-001:** añadir a T034 "confirmar que `package.json › files` publica `skills/memory-system/scripts/epic-template.js`" (hoy cubierto por `"skills/"`).
2. **INC-002:** al empezar T005, T008 y T013, dividirlas si no caben en una sesión, manteniendo el orden del grupo.
3. **INC-003:** el PO valida CR-002.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | 5 secciones | ✓ | E2E-001, UT-003, UT-020 |
| AC-2 | Alcance | ✓ | E2E-002 |
| AC-3 | 3 formatos de Historias | ✓ | E2E-003, UT-006 |
| AC-4 | Criterios de salida | ✓ | E2E-004 |
| AC-5 | SMOKE-N gherkin | ✓ | E2E-005, EV-005, EV-006, EV-007 |
| AC-6 | Notas | ✓ | E2E-006, EV-003 |
| AC-7 | Frontmatter | ✓ | E2E-007 |
| AC-8 | Skills de creación | ✓ | E2E-008, EV-008, EV-009, EV-010, IT-004 |
| AC-9 | Skills que editan el Epic | ✓ | E2E-009, EV-011…EV-015, EV-017 |
| AC-10 | Migración | ✓ | E2E-010, UT-005…UT-019, UT-022, IT-001, IT-002 |
| AC-11 | Gate actualizado | ✓ | E2E-011, EV-001…EV-007, EV-016, EV-018, EV-019 |

La flexibilidad del template (D-2b) queda cubierta por UT-020…UT-022 y EV-015…EV-019.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-103` |
| tasks.md | ✓ | `/story-implement-tasks STORY-103` |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs Gherkin que cubren los escenarios principales | ✓ | — | AC-1…AC-11 en bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs | ✓ | — | 11/11 (tabla de cobertura) |
| Trazabilidad explícita `// satisface: AC-N` | ✓ | — | D-1…D-10 y D-2b llevan `// satisface:`; las tablas de componentes e interfaces tienen columna AC |
| Sin decisiones de arquitectura aplazadas | ✓ | — | Ambigüedades resueltas en el diseño o registradas como CR-001…CR-011; solo CR-002 espera confirmación del PO y tiene resolución propuesta |
| Existe tasks.md o testcases.md | ✓ | — | Ambos presentes |
| tasks.md con tareas atómicas para todos los escenarios | ⚠️ | WARNING | Cubre los 11 ACs; T005, T008 y T013 podrían exceder una sesión (INC-002) |
| testcases.md con pruebas para todos los escenarios | ✓ | — | 11 E2E 1-a-1 + 45 UT/IT/EV |
