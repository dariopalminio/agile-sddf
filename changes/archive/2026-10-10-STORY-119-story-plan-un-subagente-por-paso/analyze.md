---
type: analyze
id: STORY-119
slug: STORY-119-analyze-report
title: "Analyze: Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
story: STORY-119
design: STORY-119
tasks: STORY-119
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-119-story-plan-un-subagente-por-paso
---

<!-- Referencias -->
[[STORY-119-story-plan-un-subagente-por-paso]]

# Reporte de Coherencia: Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 5/5 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 34/34 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 13/14 elementos con tarea completa (ver INC-002, INC-003) |
| Alineación con la épica EPIC-17-remediating-and-improvement | ⚠️ | Objetivo alineado; la historia no figura en la épica, que está en `DEVELOP/DONE` |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Pipeline completo con un subagente por paso y archivos `<paso>.result.md` | ✓ | D-1 (modo subagentes), D-4 (contrato de resultado), D-5 (prompt), D-7 (Pasos 2-6), F-1 |
| AC-2 | Una sola pregunta inicial sobre artefactos existentes (regenerar / faltantes / cancelar) | ✓ | D-2 (Paso 1e, tabla `$OVERWRITE` → flag, cancelación antes de escribir), D-3, F-2 |
| AC-3 | Un `STATUS: FAIL` corta la cadena | ✓ | D-4 (fail-fast leyendo la línea 1), F-3 |
| AC-4 | Runtime sin subagentes → inline, mismos artefactos y misma pregunta | ✓ | D-1 (detección por herramienta disponible), D-6 (fallback inline), F-4, CR-003 |
| AC-5 | `story-design`, `story-tasking`, `story-analyze` aceptan `--force` / `--skip-existing` | ✓ | D-3 (tabla de comportamiento por skill y paso de idempotencia) |

CNF-1…CNF-6 también tienen elemento de diseño: D-8 y contratos de verificación 7-11 (CNF-1, CNF-2, CNF-6), D-5 (CNF-3, CNF-5), D-6/D-7 (CNF-4).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base: `npm test`, inventario de evals, dry-run | Contrato de verificación 11 (CNF-6) | ✓ |
| T002 | Último `TC-NNN` de cada `evals.json` | D-8 | ✓ |
| T003 | TC-006 pipeline con subagentes | D-8, D-1, D-4, D-5 | ✓ |
| T004 | TC-007 "solo los que faltan" | D-8, D-2, D-3 | ✓ |
| T005 | TC-008 cancelar | D-8, D-2 | ✓ |
| T006 | TC-009 FAIL en design | D-8, D-4 | ✓ |
| T007 | TC-010 inline | D-8, D-1, D-6 | ✓ |
| T008 | Compatibilidad de TC-001…TC-005 | D-6, CNF-4 | ✓ |
| T009 | Eval `story-design --force` | D-8, D-3 | ✓ |
| T010 | Eval `story-tasking --skip-existing` | D-8, D-3 | ✓ |
| T011 | Eval `story-analyze --force` | D-8, D-3 | ✓ |
| T012 | Inventario y dry-run con casos nuevos | Contrato de verificación 11 | ✓ |
| T013 | Flags en `story-design` (Paso 1d) | D-3, componente "Worker story-design" | ✓ |
| T014 | Flags en `story-tasking` (Paso 1f) | D-3, componente "Worker story-tasking" | ✓ |
| T015 | Flags en `story-analyze` (Paso 1c, sin tocar `story.md` al saltar) | D-3, D-4 | ✓ |
| T016 | `--skip-existing` en `story-testcases` | D-3, CR-001 | ✓ |
| T017 | `--inline`, reglas y objetivo de `story-plan` | D-1, D-2, D-7, CNF-5 | ✓ |
| T018 | Paso 1e: workers presentes + pregunta única | D-2, D-5 | ✓ |
| T019 | Paso 1f: modo de ejecución | D-1 | ✓ |
| T020 | Paso 1g: estado, limpieza de `.tmp`, banners | D-2, D-4, D-7 | ✓ |
| T021 | Sección "Contrato de delegación por paso" | D-4, D-5, D-6 | ✓ |
| T022 | Pasos 2-5 con lectura del resultado | D-4, D-6, D-7 | ✓ |
| T023 | Paso 6 desde archivos de resultado | D-4, D-7 | ✓ |
| T024 | Manejo de errores y Salida | D-4, D-5, F-5 | ✓ |
| T025 | README de `story-plan` | Componente "Documentación de story-plan" | ✓ |
| T026 | Evals de `story-plan` reales | Contratos de verificación 1-4, 6 | ✓ |
| T027 | Evals de los workers | Contrato de verificación 5 | ✓ |
| T028 | Revisión CNF-3 / CNF-5 | Contratos de verificación 9-10 | ✓ |
| T029 | Suite determinista | Contrato de verificación 11 | ✓ |
| T030 | Reinstalar skills y copiar STORY-107 | D-8 (medición CNF-1) | ✓ |
| T031 | Corrida `--inline` | D-8, contratos 7-8 | ✓ |
| T032 | Corrida con subagentes | D-8, contratos 7-8 | ✓ |
| T033 | Comparación CNF-1 / CNF-2 | Contratos de verificación 7-8 | ✓ |
| T034 | Registro en `implement-report.md` | D-8 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Orquestador `story-plan` | Componentes afectados, D-7 | T017-T024 | ✓ |
| Documentación de `story-plan` | Componentes afectados | T025 | ✓ |
| Evals de `story-plan` | D-8 | T003-T008 | ⚠️ falta la fila "regenerar todos" de AC-2 (INC-002) |
| Worker `story-design` | D-3 | T013 | ✓ |
| Worker `story-tasking` | D-3 | T014 | ✓ |
| Worker `story-analyze` | D-3 | T015 | ✓ |
| Worker `story-testcases` | D-3, CR-001 | T016 | ✓ |
| Evals de los workers | D-8, CR-002 | T009-T011 | ✓ |
| Resultados por paso (`.tmp/story-plan/<ID>/`) | D-4 | T020-T023 | ✓ |
| CLI de `story-plan` (`--inline`) | Interfaces, D-1 | T017, T019 | ✓ |
| CLI de los workers | Interfaces, D-3 | T013-T016 | ✓ |
| Pregunta inicial `(t)/(f)/(c)` | Interfaces, D-2 | T018 | ✓ |
| Prompt del subagente | Interfaces, D-5 | T021 | ✓ |
| Archivo de resultado | Interfaces, D-4 | T021-T023 | ⚠️ qué parte se imprime en consola no está definido (INC-003) |

---

## Alineación con la Épica

**Épica padre:** EPIC-17-remediating-and-improvement

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `## Historias` dice que la épica "se completó sin IDs de historia"; la épica está en `DEVELOP/DONE` desde 2026-08-30 |
| Objetivo de la historia alineado con la épica | ✓ | El alcance de EPIC-17 cita "el modelo de un solo nivel de delegación incumplido en la práctica" y el principio de gestión estricta del contexto; la historia aplica ese modelo a `story-plan` |
| Restricciones de la épica respetadas | ✓ | Un solo salto de delegación (CNF-5), `.tmp/<skill>/` (D-4), evals antes del skill (D-8) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** STORY-119 declara `parent: EPIC-17-remediating-and-improvement`, pero esa épica está cerrada (`DEVELOP/DONE`) y no lista historias.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-17-remediating-and-improvement/epic.md` — sección "Historias"
- **Acción requerida:** decidir si la historia se anexa a EPIC-17 (reabriéndola o anotándola en "Historias") o se reasigna a una épica abierta (p. ej. EPIC-12-story-sdd-workflow, ya en `related`).

### INC-002 [WARNING]

- **Tipo:** C: diseño sin tarea
- **Descripción:** D-8 afirma que la fila "regenerar todos" de AC-2 queda cubierta por TC-006, pero TC-006 parte de una historia sin artefactos: la pregunta inicial no se muestra y la opción `(t)` nunca se ejerce. Ninguna tarea verifica que `(t)` pase `--force` a todos los workers.
- **Archivo afectado:** `design.md` — "D-8"; `tasks.md` — grupo 2
- **Acción requerida:** agregar un caso (TC-011, `existing_artifacts: ["design.md","tasks.md"]`, `user_answer: "t"`, `contains: "sobreescrito con --force"`/`--force` para design y tasking) o ampliar T004 con ese escenario.

### INC-003 [WARNING]

- **Tipo:** C: diseño sin tarea
- **Descripción:** T003 y T004 esperan en la consola cadenas que el diseño no obliga a imprimir: la ruta `.tmp/story-plan/STORY-099/<paso>.result.md` y `sin cambios (--skip-existing)` (línea 2 del archivo de resultado). D-4/D-7 solo dicen que el resumen se arma desde los archivos, no qué se muestra de ellos. Con la simulación del runner, esos `contains` pueden fallar aunque el skill sea correcto.
- **Archivo afectado:** `design.md` — "D-7" (fila Paso 6); `tasks.md` — T003, T004, T023
- **Acción requerida:** fijar en T023 que la columna "Artefacto" del resumen muestra la línea 2 de cada `<paso>.result.md` y que el banner (T020) imprime la ruta `.tmp/story-plan/<ID>/`; o quitar esas cadenas de los `contains` de T003/T004.

---

## Recomendaciones

1. INC-001: resolver la épica padre antes de implementar (anotar la historia en EPIC-17 o mover `parent` a EPIC-12); no bloquea el plan.
2. INC-002: agregar el caso "regenerar todos" a `skills/story-plan/evals/evals.json` en el grupo 2 de `tasks.md`.
3. INC-003: precisar en T023 (y T020) qué se imprime de cada archivo de resultado, de forma que los `contains` de T003/T004 sean verificables.
4. Observación: el pipeline arrancó con `story.md` en `SPECIFY/IN-PROGRESS` (no `SPECIFY/DONE`), y la propia historia advierte que está en el límite de INVEST-S. Si `/story-evaluation` no se ejecutó, conviene correrla; el corte sugerido (AC-5 como historia habilitadora) coincide con el grupo 4 de `tasks.md`, que puede implementarse primero sin cambios de diseño.

---

## Vía de implementación disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| `tasks.md` | ✓ | `/story-implement-tasks STORY-119` |
| `testcases.md` | ✗ | `/story-implement` no disponible (ejecutar `/story-testcases STORY-119` si se quiere esa vía) |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1…AC-5 en bloques `gherkin` con Dado/Cuando/Entonces; AC-2 y AC-5 con tablas de ejemplos |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | 5/5 ACs cubiertos (tabla de cobertura) |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | D-1…D-8 llevan `// satisface:`; componentes e interfaces tienen columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: ninguna bloqueante"; ambigüedades registradas como CR-001…CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (modo `--only-tasks`) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 34 tareas de un solo archivo o comando; AC-1…AC-5 con tareas de implementación y verificación (salvo la fila de INC-002, WARNING) |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` no existe |
