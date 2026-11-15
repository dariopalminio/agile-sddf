---
type: analyze
id: STORY-190
slug: STORY-190-analyze-report
title: "Analyze: Directivas de corrección desde verify y acceptance"
story: STORY-190
design: STORY-190
tasks: STORY-190
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
---

<!-- Referencias -->
[[STORY-190-directivas-de-correccion-desde-verify-y-acceptance]]

# Reporte de Coherencia: Directivas de corrección desde verify y acceptance

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-9) |
| Alineación tareas → diseño | ✓ | 18/18 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 17/17 componentes y 10/10 interfaces con tarea |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ✓ | Listada en el índice; cubre CS-3, SMOKE-4 y la parte de CS-7 de verify y acceptance |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️ por atomicidad de tareas) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Rechazo de verify (defectos o DoD) o acceptance escribe `fix-directives.md` con su `based-on`, filas y dimensión, y el ejecutor anuncia el gate y aplica o no la regla del test | ✓ | D-03 (tabla V: `verify-defect`, solo CRITICAL/HIGH y DoD `❌`), D-04 (tabla A: `requirements-coverage`), D-06 (origen desde `based-on`), D-08, C-13, C-14, C-16, C-17, F-1, F-2 |
| AC-2 | `round` continúa entre gates aunque `story-code-review` haya aprobado y borrado el archivo | ✓ | D-05 (máximo de `fix-directives.md` e `implement-report.md`, con traza del escenario), Interfaz «Regla de ronda», C-12 a C-14 |
| AC-3 | Los dos ejecutores avisan ante `IMPLEMENT/TODO` sin `fix-directives.md`, continúan sin modo rework y no deducen nada de los reportes | ✓ | D-07, Interfaz «Aviso de AC-3», F-3, C-16, C-17 |

CNF: CNF-1 → D-01, D-02, C-1 a C-6 · CNF-2 → D-05, C-15 · CNF-3 → D-03 · CNF-4 → D-04, D-08 · CNF-5 → D-06, D-07 · CNF-6 → D-09 · CNF-7 → D-01, V-6 · CNF-8 → V-4 · CNF-9 → V-10, V-11.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondición: ADR-0022, STORY-189 implementada, línea base | Context › Dependencias; Risks (STORY-189) | ✓ |
| T002 | Test de contrato de la plantilla (rojo) | C-6, D-02, V-1 | ✓ |
| T003 | Plantilla común central | C-1, D-01, tabla «Plantilla C-1» | ✓ |
| T004 | Tres semillas idénticas (verde) | C-3, C-4, C-5, D-02 | ✓ |
| T005 | Registro en `docs/templates/README.md` | C-2, V-2 | ✓ |
| T006 | Evals de `story-code-review` | C-9, «Casos de eval» | ✓ |
| T007 | `story-code-review`: resolución de la plantilla, regla de ronda y nota | C-12, D-05, Interfaz «Resolución de la plantilla» | ✓ |
| T008 | Evals de `story-verify` | C-7, «Casos de eval» | ✓ |
| T009 | `story-verify` paso 6h | C-13, D-03, tabla V | ✓ |
| T010 | Evals de `story-acceptance` | C-8, «Casos de eval» | ✓ |
| T011 | `story-acceptance` paso 7f | C-14, D-04, tabla A | ✓ |
| T012 | Evals de `story-implement` | C-10, «Casos de eval» | ✓ |
| T013 | `story-implement`: origen, aviso, lista blanca vacía, instrucción GREEN/REFACTOR | C-16, D-06, D-07, D-08 | ✓ |
| T014 | Evals de `story-implement-tasks` | C-11, «Casos de eval» | ✓ |
| T015 | `story-implement-tasks`: aviso, origen, filas sin archivo destino | C-17, D-06, D-07, D-08 | ✓ |
| T016 | Frase del escritor de `round` en la guía | C-15 | ✓ |
| T017 | Coherencia entre archivos | V-4 a V-7 | ✓ |
| T018 | Gate, BOM, graphify y notas | V-10, V-11 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Plantilla común | Componentes afectados | T003 | ✓ |
| C-2 Registro de la plantilla | Componentes afectados | T005 | ✓ |
| C-3 / C-4 / C-5 Semillas | Componentes afectados | T004 | ✓ |
| C-6 Test de contrato | Componentes afectados | T002 | ✓ |
| C-7 Evals verify | Componentes afectados | T008 | ✓ |
| C-8 Evals acceptance | Componentes afectados | T010 | ✓ |
| C-9 Evals code-review | Componentes afectados | T006 | ✓ |
| C-10 Evals story-implement | Componentes afectados | T012 | ✓ |
| C-11 Evals story-implement-tasks | Componentes afectados | T014 | ✓ |
| C-12 `story-code-review` SKILL.md | Componentes afectados | T007 | ✓ |
| C-13 `story-verify` SKILL.md + README | Componentes afectados | T009 | ✓ |
| C-14 `story-acceptance` SKILL.md + README | Componentes afectados | T011 | ✓ |
| C-15 Guía del pipeline | Componentes afectados | T016 | ✓ |
| C-16 `story-implement` SKILL.md + README | Componentes afectados | T013 | ✓ |
| C-17 `story-implement-tasks` SKILL.md + README | Componentes afectados | T015 | ✓ |
| Resolución de la plantilla | Interfaces | T007, T009, T011 | ✓ |
| Placeholders de C-1 | Interfaces | T002, T003 | ✓ |
| Regla de ronda | Interfaces | T007, T009, T011, T017 | ✓ |
| Filas de verify / de acceptance | Interfaces | T009 / T011 | ✓ |
| Mensaje de los gates | Interfaces | T009, T011 | ✓ |
| `$REWORK_ORIGIN` y línea de origen | Interfaces | T013, T015 | ✓ |
| Aviso de AC-3 | Interfaces | T013, T015 | ✓ |
| Lista blanca vacía | Interfaces | T013, T015 | ✓ |
| Filas sin archivo destino | Interfaces | T013 (e), T015 (c) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md`, índice de historias: «STORY-190 — Directivas de corrección desde verify y acceptance» |
| Objetivo alineado | ✓ | Cierra la deuda de ADR-0008 y cubre CS-3 (plantilla común, `round` continuo, `requirements-coverage` en aceptación, aviso de los ejecutores) y SMOKE-4 (acceptance → `IMPLEMENT/TODO` con `based-on: acceptance-report.md` y test exigido) |
| Restricciones respetadas | ✓ | La señal de rework sigue siendo solo `fix-directives.md`. Los reportes no se leen como señal. `story-code-review` sigue borrando al aprobar. La plantilla recoge EPIC-28 (D-01). Se respeta la cadena STORY-188 → 189 → 190 → 191 (T001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E
- **Descripción:** el criterio DoD «Si tasks.md existe DEBE contener únicamente tareas atómicas» no se puede afirmar con certeza para T013 y T015. Agrupan de cinco a siete ediciones de un mismo `SKILL.md` (origen, aviso, lista blanca vacía, instrucción GREEN/REFACTOR, restricciones, errores y README). Todas tocan un archivo y tienen un único criterio de «Hecho», pero pueden superar una sesión de 2 h.
- **Archivo afectado:** `tasks.md` — sección «6. Ejecutores: origen, aviso y lista blanca vacía», T013 y T015
- **Acción requerida:** opcional. Dividir cada una en dos tareas: (a) 0c.3/0c.4 o 2c/2f, y (b) textos de restricciones, errores y README. Se puede hacer con `/story-fix-plan`.

---

## Recomendaciones

1. **INC-001:** si se quiere atomicidad estricta, dividir T013 y T015 como se indica arriba. No bloquea: las sub-ediciones (a)–(g) están enumeradas y el «Hecho» es verificable.

**Observaciones de calidad** (fuera de la taxonomía A–F; no afectan el veredicto; conviene aplicarlas al implementar):

2. **Regla de ronda y casos existentes de `story-code-review`.** TC-009, TC-011, TC-012, TC-013, TC-015, TC-016 y TC-034 tienen `implement-report.md` en `artifacts_present` sin describir su contenido, y esperan valores de `round` (p. ej. TC-012: `round: 1`, `not_contains` `round: 2`). Con la regla nueva de D-05, el resultado depende de si ese informe tiene un encabezado de ronda. En T006, declarar en esos casos que `implement-report.md` no tiene encabezados de ronda (o el que corresponda) para que sigan siendo deterministas y se cumpla CNF-7.
3. **Caso de verify con MEDIUM excluidos** (`design.md` › Casos de eval; T008). `verify-report.md` sí contiene los títulos de los MEDIUM, así que un `not_contains` del título falla. Usar una cadena propia de una fila de directivas, p. ej. `| verify-defect | MEDIUM |`, y un `contains` de `2 hallazgo(s) bloqueante(s)`.
4. **Caso `rework-desde-acceptance-no-edita-story-md`** (T014). `files_unchanged` no puede expresar «salvo el frontmatter», porque el ejecutor escribe `IMPLEMENT/IN-PROGRESS` en `story.md`. Usar `not_contains` `💻 corregido: story.md` y `not_contains` `archivo no encontrado: story.md`.
5. **Frases de escritor único que no se enumeran.** `skills/story-implement/SKILL.md:295` (0c.3) y `skills/story-implement-tasks/SKILL.md:381` (2f.1) también dicen «su escritor único es `story-code-review`». T013 y T015 las alcanzan por su criterio de «Hecho» (`grep "escritor único"` vacío), pero conviene citarlas en (f) y (d).
6. **Desfase de estados con STORY-188.** `docs/guardrails/dod-story-plan.md` declara `to: PLAN/DONE`, pero `story-analyze` todavía escribe `READY-FOR-IMPLEMENT/DONE` porque STORY-188 no está implementada. Es esperado durante la épica y no afecta a esta historia.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (modo `--only-tasks`). Los casos de eval por AC están especificados en `design.md` › «Casos de eval» y en T006, T008, T010, T012 y T014.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-190` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-190` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (Escenario con Ejemplos de 3 filas), AC-2 y AC-3 (Escenario con Ejemplos) en Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC | ✓ | — | Columna «Satisface» en componentes e interfaces, `// satisface:` en D-01 a D-09 y en «Esquema de datos», columna «Cubre» en los casos de eval |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: ninguna bloqueante». La ambigüedad de los criterios DoD de aceptación queda registrada como CR-001 con una decisión tomada |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (18 tareas) |
| Si tasks.md existe, solo tareas atómicas para todos los escenarios principales | ⚠️ | WARNING | Todos los escenarios tienen tareas (AC-1: T008-T015; AC-2: T006-T011; AC-3: T012-T015), pero T013 y T015 agrupan varias ediciones (INC-001) |
| Si testcases.md existe, pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
