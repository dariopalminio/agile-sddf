---
type: analyze
id: STORY-122
slug: STORY-122-analyze-report
title: "Analyze: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
story: STORY-122
design: STORY-122
tasks: STORY-122
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-122-epic-analyze-madurez-historias-hijas
---

<!-- Referencias -->
[[STORY-122-epic-analyze-madurez-historias-hijas]] · [[EPIC-22-epic-analyze]]

# Reporte de Coherencia: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1…CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (5 componentes + 6 interfaces); los 9 contratos de verificación tienen tarea |
| Alineación con la épica EPIC-22-epic-analyze | ✓ | Listada, alineada en objetivo y con la dependencia 122 → 120, 121 aplicada en diseño y tareas (INC-001 resuelto) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 1 WARNING abierto; INC-001 resuelto): sin inconsistencias bloqueantes.

> Dependencia de orden (CR-001): `skills/epic-analyze/` **no existe** todavía; EPIC-22 › Notas fija STORY-120 → STORY-121 → STORY-122 y T001 se detiene si falta STORY-121.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Historias hijas en `SPECIFY/DONE` con `related` resolubles → sin hallazgos de madurez (story.md l. 28–34) | ✓ | D-1, D-2 (universo), D-3 (`SPECIFY/DONE` → lista), D-4 (resolución por ID), D-5 (l. 170–172: AC-1 → ningún `MAD-`), D-6 (conteo `Madurez de historias hijas: <l>/<t> listas`), I-1, I-2, I-5, F-1, TC-019 (D-8), contrato #1 |
| AC-2 | `SPECIFY/IN-PROGRESS` → WARNING citando `STORY-202` + `completar su especificación con /story-specify`; `related: STORY-999` inexistente → WARNING citando `STORY-999` + `corregir o retirar la referencia` (story.md l. 36–47) | ✓ | D-3, D-4, D-5 (`MAD-01`/`MAD-02` con las acciones literales de AC-2, mapeo fila → código l. 170–172), D-7, I-3, I-4, I-6, F-2, TC-020/TC-021 (D-8), contratos #2–#3, #5 |
| CNF-1 | Estado mínimo `SPECIFY/DONE` o posterior; `CANCELED` sin hallazgo (story.md l. 51) | ✓ | D-2 (exclusión de `CANCELED`), D-3 (tabla con el orden de `domain-story-lifecycle` §4.1/§5), CR-003/CR-004 confirmados (`MAD-03`), TC-022, TC-024, contrato #4 |
| CNF-2 | Mismo reporte y veredicto (regla de STORY-120); sin modificar `epic.md`/`story.md` (story.md l. 52) | ✓ | D-1, D-5 (todos WARNING), D-6, D-7, I-4, I-6, "No se modifica" (l. 255–256), contrato #6, `not_contains` de bloques `=== FILE:` (D-8) |
| CNF-3 | Idempotencia (story.md l. 53) | ✓ | D-2 (universo determinista), D-5 (orden integrado `INT-` < `MAD-` < `SAL-`), TC-025, contrato #7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar `skills/epic-analyze/`, línea base y STORY-121 implementada como precondición | CR-001; D-1, D-5, D-6, D-8 | ✓ |
| T002 | Línea base de `npm test`, `verify:eval-inventory`, `verify:links`, `test:eval` | Contratos #8, #9 | ✓ |
| T003 | Completar `input` de TC-001…TC-006, TC-008, TC-010, TC-011…TC-018, TC-026, TC-027 con `status`/`related` válidos | D-8, CR-002 | ✓ |
| T004 | Añadir TC-019…TC-021 con contrato de salida cubierto por E1 en sus mundos | D-8, CR-002; AC-1, AC-2 | ✓ |
| T005 | Añadir TC-022…TC-025, `not_contains` de bloques FILE y el mismo contrato de salida | D-8, D-3, D-4; CNF-1…CNF-3; CR-002…CR-004 | ✓ |
| T006 | Validar JSON, `--dry-run` y commit solo de `evals.json` | D-8 | ✓ |
| T007 | Campo de madurez en `resumen` del template seed | D-6, I-5 | ✓ |
| T008 | Vía B ampliada con `status`/`substatus`/`related` + universo | D-2, I-2; CR-001 | ✓ |
| T009 | Paso `MAD-` con lista ordenada de estados y regla de estado mínimo | D-1, D-3; CR-004 | ✓ |
| T010 | Regla de resolución de `related` | D-4, I-3, F-3 | ✓ |
| T011 | Catálogo `MAD-01…MAD-03`, orden integrado, veredicto sin cambio | D-5, I-4 | ✓ |
| T012 | Relleno de `hallazgos` y del campo de `resumen` | D-6, I-5 | ✓ |
| T013 | Cláusula `ai-untrusted-content-clause` ampliada | D-7 | ✓ |
| T014 | `description`, `Objetivo`; invocación y retorno sin cambio | D-1, I-1, I-6 | ✓ |
| T015 | Revisión de `SKILL.md` (< 500 líneas, sin `.tmp/`, sin leer cuerpo) | D-1, D-2; Risks | ✓ |
| T016 | `CHANGELOG.md` (STORY-122, EPIC-22) | D-9; componente "Changelog" | ✓ |
| T017 | `domain-epic-lifecycle.md` §8 | D-9; componente "Ciclo de vida de épica" | ✓ |
| T018 | Checklist de skills, inventario de evals, cláusula y orden de commits | Contrato #9; D-8 | ✓ |
| T019 | `npm run test:eval -- epic-analyze` con todos los TC | Contratos #1–#6, #8 | ✓ |
| T020 | Ejecución real `/epic-analyze EPIC-22 --auto` dos veces (`Madurez de historias hijas: 3/3 listas`) | Contrato #7; CNF-3 | ✓ |
| T021 | Regresión contra la línea base (enlaces: sin rotos nuevos) y encoding | Contratos #8, #9 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Casos de eval (`evals.json`) | Componentes afectados (l. 249); D-8 | T003–T006 (creación), T019 (ejecución) | ✓ |
| Template seed del reporte | Componentes afectados (l. 250); D-6 | T007 | ✓ |
| Contrato del skill (`SKILL.md`) | Componentes afectados (l. 251); D-1…D-7 | T008–T015 | ✓ |
| Changelog | Componentes afectados (l. 252); D-9 | T016 | ✓ |
| Ciclo de vida de épica (§8) | Componentes afectados (l. 253); D-9 | T017 | ✓ |
| I-1 Invocación | Interfaces (l. 262) | T014 | ✓ |
| I-2 Lectura de madurez | Interfaces (l. 263) | T008 | ✓ |
| I-3 Resolución de referencia | Interfaces (l. 264) | T010 | ✓ |
| I-4 Hallazgo | Interfaces (l. 265) | T011 | ✓ |
| I-5 Template del reporte | Interfaces (l. 266) | T007, T012 | ✓ |
| I-6 Retorno en modo Agent | Interfaces (l. 267) | T014 | ✓ |

Contratos de verificación (l. 320–330): #1–#6 y #8 → T019; #7 → T020; #9 → T018. Obligación cruzada con STORY-121 (mundos TC-019…TC-025 con contrato de salida) → T004/T005.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Referencia: design.md › D-8 define TC-019…TC-025 en `skills/epic-analyze/evals/evals.json` (AC-1 → TC-019; AC-2 → TC-020/TC-021; CNF-1 → TC-022/TC-024; CNF-3 → TC-025) y tasks.md › T004–T005 los crea.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-122` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-122` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-22-epic-analyze (`docs/specs/02-epics/EPIC-22-epic-analyze/epic.md`, `status: DEFINE`, `substatus: TODO`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias` l. 28: `- [ ] **STORY-122** — Madurez de historias hijas …` (F2 canónico) |
| Objetivo de la historia alineado con la épica | ✓ | El Alcance cubre "la madurez de las historias hijas"; el criterio de salida l. 34 cita STORY-122 |
| Restricciones de la épica respetadas | ✓ | EPIC-22 › Notas fija que STORY-122 depende de STORY-120 y STORY-121; CR-001, T001, D-1, D-2, D-8, Context y T008/T009 lo aplican sin ramas condicionales |

---

## Inconsistencias Detectadas

### INC-001 [WARNING] RESUELTO

- **Tipo:** D — desalineación con la épica (restricción de dependencias)
- **Descripción:** EPIC-22 › Notas declara que STORY-122 depende de STORY-120 y STORY-121. `design.md` › CR-001 y `tasks.md` › T001 lo aplican (T001 se detiene si falta STORY-121), pero quedan restos de la regla anterior "válido en cualquier orden respecto a STORY-121" que la contradicen:
  - `design.md` l. 48 (Context, fila FINVEST): "universo y rango de evals válidos en cualquier orden respecto a STORY-121"; además cita D-3 cuando el universo está en D-2.
  - `design.md` l. 69–70 (D-1): "si STORY-121 ya está implementada, el paso va después del de la familia `SAL-`".
  - `design.md` l. 86–87 (D-2): "Si STORY-122 se implementa antes, introduce ella el cálculo del universo … y STORY-121 lo reutilizará (ver CR-001)", que contradice el propio CR-001.
  - `design.md` l. 207–208 (D-8): "para que ambos órdenes de implementación eviten colisiones de ID".
  - `tasks.md` l. 25 (preámbulo): "determina si STORY-121 ya está implementada".
  - `tasks.md` l. 54 (T008): "si STORY-121 está implementada, reutilizar su universo; si no, introducir el cálculo del universo …". Esa rama es inalcanzable tras T001.
  - `tasks.md` l. 55 (T009): "entre la Vía B (o el paso `SAL-`, si existe)".
- **Archivo afectado:** `design.md` — Context, D-1, D-2, D-8; `tasks.md` — preámbulo, T008, T009
- **Acción requerida:** Reescribir esos puntos sin condicional: el paso `MAD-` va después del paso `SAL-`; el universo es el de STORY-121 › D-3 y se reutiliza; el rango TC-019…TC-025 se mantiene solo para no colisionar con los IDs existentes.
- **Resolución (2026-10-08):** aplicada en `design.md` (Context, D-1, D-2, D-8) y `tasks.md` (preámbulo, T008, T009).

### INC-002 [WARNING]

- **Tipo:** E — criterio DoD PLAN no evaluable con certeza (regla de duda → ⚠️)
- **Descripción:** D-9 (`// satisface: CNF-2`, l. 233) y las filas "Changelog" y "Ciclo de vida de épica" de "Componentes afectados" (l. 252–253) trazan solo a CNF-2. Son elementos documentales; el resto de decisiones, componentes e interfaces citan un `AC-N`. Es el residual que aceptó el PO el 2026-10-08.
- **Archivo afectado:** `design.md` — D-9 y tabla "Componentes afectados"
- **Acción requerida:** Ninguna (decisión del PO).

---

## Recomendaciones

1. **INC-001:** RESUELTO: ramas condicionales eliminadas; T008 reutiliza el universo de STORY-121 › D-3 y T009 inserta el paso `MAD-` después del paso `SAL-`.
2. **INC-002:** sin acción; residual aceptado.

**Observaciones (no tipificadas, no cuentan como hallazgo):**

- `tasks.md` › T021 (l. 73) pide "comparar con la línea base de T002 (exit 0 sin regresiones)" para `npm run verify:links`, que hoy no termina en exit 0 por 2 enlaces rotos ajenos a la historia (`docs/guides/orchestrator-subagent-pattern.md:148` y `docs/index.md:262`). Resuelto (2026-10-08): T021 exige ahora "sin enlaces rotos nuevos respecto a la línea base", igual que STORY-120 › T026 y STORY-121 › T021.
- `design.md` › Context l. 42–43 cuenta 117 `story.md`; hoy hay 114. Es una foto informativa y no afecta al diseño.

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan = dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (l. 29–34) y AC-2 con `Ejemplos` (l. 37–47) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-2…D-6, F-1; AC-2 → D-3…D-5, D-7, F-2 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-9 y dos filas documentales trazan solo a CNF-2 (INC-002, residual aceptado) |
| No hay decisiones de arquitectura aplazadas; toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: Ninguna" (l. 344–346); CR-003/CR-004 confirmados por el PO (2026-10-08). Las ramas de INC-001 son texto residual, no decisiones abiertas: CR-001 fija el orden |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T021) |
| Si tasks.md existe, contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T004 (TC-019), T007, T012, T019; AC-2 → T004 (TC-020/TC-021), T009–T011, T019 |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente |
