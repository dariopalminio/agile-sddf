---
type: analyze
id: STORY-167
slug: STORY-167-analyze-report
title: "Analyze: Skill epic-improve"
story: STORY-167
design: STORY-167
tasks: STORY-167
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
---

<!-- Referencias -->
[[STORY-167-skill-epic-improve]]

# Reporte de Coherencia: Skill epic-improve

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (y 6/6 CNF) |
| Alineación tareas → diseño | ✓ | 30/30 tareas con diseño (T029 justificada por AGENTS.md) |
| Cobertura diseño → tareas | ✓ | 14/14 elementos con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada como F2; dueña de CS-14, SMOKE-4 y su parte de CS-12 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

> ⚠️ testcases.md no presente — cobertura de pruebas no evaluada (modo `--only-tasks`). La verificación de comportamiento se especifica en D-11 (evals TC-001…TC-007).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Corregir (sección de criterios de salida faltante) con backup, sin tocar status/substatus, y volver a aprobar | ✓ | D-3, D-4 (`seccion-faltante`), D-5 (`M-criterios`), D-7 (plan, `.bak`, relectura), D-9; F-1; V-1 |
| AC-2 | Corregir línea de historias y listar criterios no inferibles como decisión del PO sin escribirlos | ✓ | D-4 (`formato-historias`), D-5 (regla de fuente citada, sin placeholder), D-9, CR-002; F-2; V-2 |
| AC-3 | Rechazo del plan: ningún archivo cambia ni se crea `.bak` | ✓ | D-7.3; F-3; V-3 |
| AC-4 | Épica ya `APPROVED`: informa y no modifica ni crea archivos | ✓ | D-2 (gate por `verdict`, rechazo de invocar la validación); F-4; V-4 |

CNF: CNF-1 (D-7, D-8, D-9), CNF-2 (D-8, TC-006), CNF-3 (D-8, V-10), CNF-4 (D-10, V-6), CNF-5 y CNF-6 (D-1, V-8).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-166 está implementada | CR-001; Risks | ✓ |
| T002 | Crear el skill con `skill-master` | D-1, D-10 | ✓ |
| T003 | Frontmatter y cuerpo inicial de `SKILL.md` | D-1 (presupuesto `description`), Non-Goals | ✓ |
| T004 | Restricciones / Reglas | D-4 (reglas comunes), D-8 | ✓ |
| T005 | Paso 0 (marcador) y Paso 1 (resolución) | D-2, D-10 | ✓ |
| T006 | Paso 2 — gate por `verdict` | D-2 | ✓ |
| T007 | Paso 3 — template, aviso de obsolescencia, clasificación | D-3, D-6 | ✓ |
| T008 | Paso 4 — catálogo, mejoras, regla de fuente | D-4, D-5 | ✓ |
| T009 | Paso 5 — plan y confirmación | D-7.1–D-7.3 | ✓ |
| T010 | Paso 6 — backup y escritura única | D-7.4 | ✓ |
| T011 | Paso 7 — relectura y restauración | D-7.5, F-5 | ✓ |
| T012 | Paso 8 — resumen y siguiente paso | D-9, CR-002 | ✓ |
| T013 | Salida y tabla de errores | D-2, F-5 | ✓ |
| T014 | `references/correction-rules.md` — tipos de defecto | D-4 | ✓ |
| T015 | `references/correction-rules.md` — mejoras, fuente, v1 | D-5, D-6 | ✓ |
| T016 | `README.md` | D-1 | ✓ |
| T017 | Fixture `sin-criterios-de-salida/` | D-11 | ✓ |
| T018 | Fixture `requiere-decision-po/` | D-11 | ✓ |
| T019 | Fixture `aprobada/` | D-11 | ✓ |
| T020 | Fixture `instruccion-incrustada/` | D-11 | ✓ |
| T021 | `evals/evals.json` TC-001…TC-007 | D-11 | ✓ |
| T022 | `escritor:` en template central + seed | D-10 | ✓ |
| T023 | `domain-epic-lifecycle` §8 | D-10 | ✓ |
| T024 | `sddf-commands-pipeline` §2 | D-10 | ✓ |
| T025 | Presupuesto de tamaño | V-8 | ✓ |
| T026 | UTF-8 sin BOM | V-10 | ✓ |
| T027 | `verify-fixed-layout` y `verify:eval-inventory` | V-6, V-7 | ✓ |
| T028 | `npm test` y `verify:repository` | V-9, V-11 | ✓ |
| T029 | `graphify update .` | Regla de AGENTS.md (no es elemento de design.md) | ✓ |
| T030 | Evals manuales y recorrido SMOKE-4 | V-1…V-5 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| `skills/epic-improve/SKILL.md` | Componentes afectados, D-1 | T002–T013 | ✓ |
| `references/correction-rules.md` | D-1, D-4, D-5, D-6 | T014, T015 | ✓ |
| `skills/epic-improve/README.md` | D-1 | T016 | ✓ |
| Evals y fixtures | D-11 | T017–T021 | ✓ |
| Template de épica (central + seed) | D-10 | T022 | ✓ |
| `domain-epic-lifecycle` §8 | D-10 | T023 | ✓ |
| `sddf-commands-pipeline` §2 | D-10 | T024 | ✓ |
| Interfaz Invocación | Interfaces y contratos | T005 | ✓ |
| Interfaz Reporte → `epic-improve` | Interfaces y contratos | T006, T007 | ✓ |
| Interfaz Template → `epic-improve` | Interfaces y contratos | T007 | ✓ |
| Interfaz `SKILL.md` → catálogo | Interfaces y contratos | T008, T025 | ✓ |
| Interfaz `epic-improve` → usuario | Interfaces y contratos | T009, T012 | ✓ |
| Interfaz `epic-improve` → disco | Interfaces y contratos | T010, T011, T013 | ✓ |
| Contratos de verificación V-1…V-11 | Contratos de verificación | T025–T030 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › Historias › «Fase DEFINE — skill nuevo `epic-improve`»: `- [ ] **STORY-167** — Skill epic-improve` (F2) |
| Objetivo de la historia alineado con la épica | ✓ | «cerrar el bucle de `DEFINE`» coincide con el Alcance (DEFINE: `epic-improve` corrige `epic.md` cuando `epic-format-validation` no lo aprueba) y con la nota «`epic-improve` no es alias de `epic-refine`» |
| Restricciones de la épica respetadas | ✓ | CS-14 (D-7, D-9), CS-12 (D-10, T027), SMOKE-4 (T030), CS-21 (T028); no escribe estado de épica (D-4, D-7.5), coherente con la invariante 6 de `domain-state-management` |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E: criterio DoD PLAN no cumplido (evidencia insuficiente — «No hay decisiones de arquitectura aplazadas»)
- **Descripción:** D-7.1 dice que el plan muestra siempre las listas «Requiere decisión del PO», «Ya resueltos» y «Fuera de alcance», pero no define qué se imprime cuando una lista está vacía. D-11 espera en TC-001 `not_contains: "requiere decisión del PO"` y en TC-006 `not_contains: "COMPLETED"`. Si la lista vacía imprime su encabezado, TC-001 falla aunque el skill se comporte bien; y TC-006 falla si el skill cita el texto de la nota incrustada (p. ej. al conservarlo o mencionarlo como instrucción ignorada).
- **Archivo afectado:** design.md — sección «D-7 — Plan único…» (paso 1) y «D-11 — Evals y fixtures» (filas TC-001 y TC-006); tasks.md — T009 y T021
- **Acción requerida:** fijar en D-7.1 que una lista vacía se omite (o se imprime como `Ninguno`) y alinear las expectativas: en TC-001 sustituir `not_contains: "requiere decisión del PO"` por una comprobación compatible; en TC-006 reemplazar `not_contains: "COMPLETED"` por `not_contains: ["status: COMPLETED", "story.md eliminado"]`.

### INC-002 [WARNING]

- **Tipo:** E: criterio DoD PLAN no cumplido (evidencia insuficiente — misma regla de ambigüedad técnica)
- **Descripción:** T017 especifica que el reporte del fixture `sin-criterios-de-salida/` incluye `## Migración` (porque hay un `seccion-faltante`). D-6 manda clasificar los `seccion-faltante` como fuera de alcance si hay `## Migración` **y** el `epic.md` tiene encabezados `##` fuera del template. Ni T017 ni T020 exigen que el fixture tenga solo encabezados del template; un encabezado extra haría que TC-001 no inserte la sección y falle.
- **Archivo afectado:** tasks.md — T017 y T020; design.md — «D-11», tabla de fixtures
- **Acción requerida:** añadir a T017 (y por herencia T020) y a la tabla de fixtures de D-11 que el `epic.md` usa solo encabezados `##` del template (salvo la sección faltante).

---

## Recomendaciones

1. INC-001 → En design.md › D-7 paso 1, añadir «las listas vacías se omiten»; en D-11 y T021, cambiar en TC-006 `not_contains: "COMPLETED"` por `"status: COMPLETED"` y revisar TC-001 para que no dependa del encabezado de una lista vacía. Aplicable con `/story-fix-plan STORY-167 corrige advertencias`.
2. INC-002 → En tasks.md › T017 y design.md › D-11 (fila `sin-criterios-de-salida/`), añadir «solo encabezados `##` del template, salvo `## Criterios de salida`, que falta».

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-167` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-167` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin` (principal, alternativo, cancelación, sin trabajo) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 4/4 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-11 con `// satisface:`; tablas de componentes e interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad resuelta o registrada como CR | ⚠️ | WARNING | Open Questions «Ninguna» y CR-001/CR-002 registrados; quedan sin precisar la impresión de listas vacías y la restricción de encabezados del fixture (INC-001, INC-002) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (30 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | Una tarea por paso del skill (T005–T013), por fixture (T017–T020) y por verificación; AC-1…AC-4 trazados |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente (`--only-tasks`) |
