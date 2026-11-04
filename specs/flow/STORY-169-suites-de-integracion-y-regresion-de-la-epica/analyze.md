---
type: analyze
id: STORY-169
slug: STORY-169-analyze-report
title: "Analyze: Suites de integración y regresión de la épica"
story: STORY-169
design: STORY-169
tasks: STORY-169
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-169-suites-de-integracion-y-regresion-de-la-epica
---

<!-- Referencias -->
[[STORY-169-suites-de-integracion-y-regresion-de-la-epica]]

# Reporte de Coherencia: Suites de integración y regresión de la épica

## Veredicto
<!-- Línea según la regla de Veredicto del Paso 6. -->

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 27/27 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (8 componentes C1–C8 y 3 interfaces I1–I3) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada y alineada con CS-11. Hay 3 desajustes de texto en `epic.md` (INC-001…INC-003) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: `testcases.md` no está presente (modo `--only-tasks`) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Todas las suites pasan → comando, resultado y duración con un decimal por suite; `APPROVED` | ✓ | C1 (`classifyCommand`, `durationSeconds`), C2, C3, I2, flujo F1, regla de decisión de C5, D-8 |
| AC-2 | Resultado de una suite según `required` (fallida → `NEEDS-CHANGES`; no ejecutable obligatoria → `BLOCKED`; no ejecutable opcional → omitida) | ✓ | Tabla de clasificación de `outcome` (filas 2–6), tabla de efecto en el veredicto, D-2, D-3, flujo F2 |
| AC-3 | Fallo y bloqueo a la vez → `NEEDS-CHANGES` | ✓ | Regla de decisión de C5 (G-05), flujo F3 |
| AC-4 | DoD de validación de épica: omitido / cumplido / incumplido / sin evidencia | ✓ | C4, I3, tabla de evaluación de criterios del DoD, D-5, D-7, flujo F4 |

Los CNF también están cubiertos: CNF-1 por C2, D-4 y la ruta fija del DoD; CNF-2 por la tabla de efecto (`required: false` → omitida); CNF-3 por los Non-Goals y la ausencia deliberada de un componente de entorno.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Cabecera y contrato CLI de `epic-suites.js` | C1, I1, D-1 | ✓ |
| T002 | Fixture y helper de `test/epic-suites.test.js` | C7 | ✓ |
| T003 | `readEpicSuites` | C2, D-4 | ✓ |
| T004 | Detección previa de script npm | Clasificación fila 3, D-2 | ✓ |
| T005 | `classifyCommand` (spawn, duración, 127/9009/ENOENT, `outputTail`) | C1, clasificación filas 4–6, D-3, D-9 | ✓ |
| T006 | Subcomando `run` | I1, `SuitesResult`, D-8, Degradación gradual | ✓ |
| T007 | Subcomando `check-command` | I1, `CommandResult`, D-5, V-6 | ✓ |
| T008 | Parseo de argumentos y código 2 | I1 | ✓ |
| T009 | Prueba de no escritura | V-9 | ✓ |
| T010 | Escenarios de AC-1 y AC-3 en el motor | V-1, flujos F1 y F3 | ✓ |
| T011 | Dependencias y restricciones en SKILL.md | C3, CNF-3, D-9, Riesgos | ✓ |
| T012 | Paso «Suites de nivel épica» | C3, tabla de efecto, D-6, F1–F3, F5 | ✓ |
| T013 | Paso «DoD de validación de épica» | C4, tabla de evaluación del DoD, D-5, D-7, F4, F5 | ✓ |
| T014 | Regla de decisión del veredicto | C5 | ✓ |
| T015 | Sección `## Suites de nivel épica` del template | C6, I2 | ✓ |
| T016 | Sección `## DoD de validación de épica` del template | C6, I3 | ✓ |
| T017 | Eval de AC-1 | C8, V-7 | ✓ |
| T018 | Evals de AC-2 (4 ejemplos) | C8, V-7 | ✓ |
| T019 | Eval de AC-3 | C8, V-7 | ✓ |
| T020 | Evals de AC-4 (3 ejemplos con DoD presente) | C8, V-7 | ✓ |
| T021 | Aplicar CR-005 en story.md | CR-005, D-3 | ✓ |
| T022 | Aplicar CR-004 en epic.md (línea del índice) | CR-004 | ✓ |
| T023 | Registrar CR-002 y CR-003 en epic.md | CR-002, CR-003 | ✓ |
| T024 | `node --test` y `npm test` | V-1…V-6, V-9 | ✓ |
| T025 | `npm run verify:repository` | V-8 | ✓ |
| T026 | Ejecutar el motor sobre este repositorio | Context (estado actual de `verify`), V-1, V-3 | ✓ |
| T027 | Evals manuales pendientes | V-7, regla de AGENTS.md sobre evals | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 — Ejecutor de suites | Decisions › Componentes | T001, T004, T005, T006, T007, T008 | ✓ |
| C2 — Lector de suites de nivel épica | Decisions › Componentes | T003 | ✓ |
| C3 — Paso «Suites de nivel épica» | Decisions › Componentes | T011, T012 | ✓ |
| C4 — Paso «DoD de validación de épica» | Decisions › Componentes | T013 | ✓ |
| C5 — Regla de decisión del veredicto | Decisions › Componentes / Flujos clave | T014 | ✓ |
| C6 — Secciones del reporte | Decisions › Componentes | T015, T016 | ✓ |
| C7 — Pruebas del ejecutor | Decisions › Componentes | T002–T010, T024 | ✓ |
| C8 — Casos de eval | Decisions › Componentes | T017–T020, T027 | ✓ |
| I1 — CLI de `epic-suites.js` | Decisions › Interfaces | T001, T006, T007, T008 | ✓ |
| I2 — Sección de suites del reporte | Decisions › Interfaces | T012, T015 | ✓ |
| I3 — Sección del DoD del reporte | Decisions › Interfaces | T013, T016 | ✓ |

Las 6 filas de Degradación gradual (P7) tienen tarea: T006 (`sddf.config.yaml` ausente o ilegible), T004 (`package.json` ausente), T012 (motor o `node` ausentes, ejecución en segundo plano) y T005/T011 (salida tratada como dato). Los 5 CR también: CR-001 en la nota de orden de tasks.md, CR-002/CR-003 en T023, CR-004 en T022 y CR-005 en T021.

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 59, Fase VALIDATE; dueña de CS-11 (línea 199) |
| Objetivo de la historia alineado con la épica | ✓ | «Certificar que el conjunto de historias funciona como un release unificado» coincide con la fase VALIDATE (línea 29) y con CS-11 (línea 81) |
| Restricciones de la épica respetadas | ⚠️ | El diseño respeta CS-7 (el motor no escribe; V-9), ADR-0017 (sin `SDDF_ROOT`), la fuente única (motor dentro del skill) y el vocabulario `APPROVED`/`NEEDS-CHANGES`/`BLOCKED`. El texto de `epic.md` no refleja la historia refinada en tres puntos (INC-001…INC-003) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** la nota «Suites de staging» de `epic.md` dice «STORY-169 decide cómo se declara el entorno de staging». La historia refinada (CNF-3, Non-Goals, nota «Decisión — Entorno») decide que el skill no controla el entorno. CR-004 de design.md y T022 solo corrigen la línea 59 del índice; esta segunda mención no tiene tarea.
- **Archivo afectado:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` — sección de Notas, línea 184 («Suites de staging»); `tasks.md` — T022
- **Acción requerida:** ampliar CR-004 y T022 para reemplazar también la nota de la línea 184 con la decisión vigente: el skill ejecuta las suites en el entorno desde el que se invoca y no declara entornos.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** CS-11 dice que «una que no se puede ejecutar [produce] `BLOCKED`» sin distinguir `required`. La historia (AC-2, CNF-2) y el diseño (tabla de efecto) registran como `omitida` una suite `required: false` no ejecutable, sin efecto en el veredicto. Con la configuración actual (`e2e` y `e2e-regression` opcionales y sin script), CS-11 al pie de la letra daría `BLOCKED`, y la historia, `APPROVED`.
- **Archivo afectado:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` — Criterios de salida, CS-11 (línea 81)
- **Acción requerida:** al refinar la épica, precisar CS-11: «una suite obligatoria (`required: true`) que no se puede ejecutar, `BLOCKED`; una opcional se registra como omitida». Se puede agregar como tarea junto a T022.

### INC-003 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** CS-4 (STORY-125) también cubre «el DoD de épica cuando exista» y trata su fallo como `BLOCKED`. STORY-169 trata un criterio incumplido como `NEEDS-CHANGES` y uno sin evidencia como `BLOCKED`. Si ambas historias se implementan tal cual, el DoD se evalúa dos veces con efectos distintos. design.md lo registra como CR-002, y T023 solo lo anota en `epic.md` sin resolverlo.
- **Archivo afectado:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` — CS-4 (línea 74 aprox.); `specs/flow/STORY-125-validar-evidencia-operativa-epica/story.md` — AC-2, AC-3 y nota «Regla — DoD de épica»
- **Acción requerida:** resolver CR-002 antes de planificar STORY-125: quitar el DoD de CS-4 y de STORY-125 y dejar a STORY-169 como única dueña.

---

## Recomendaciones

1. **INC-001:** en `tasks.md`, ampliar T022 para corregir también la nota «Suites de staging» de `epic.md` (línea 184). En `design.md`, agregar esa línea a la descripción de CR-004.
2. **INC-002:** precisar CS-11 de `epic.md` para que distinga las suites `required: true` de las `required: false`. Puede hacerse en la misma tarea T022 o al refinar la épica con `/epic-improve`.
3. **INC-003:** resolver CR-002 en la épica antes de ejecutar `/story-plan STORY-125`, para que el DoD de validación de épica tenga una sola dueña (STORY-169).
4. **Observación (no es inconsistencia de coherencia):** la historia llegó al pipeline en `SPECIFY/IN-PROGRESS`. Su `finvest-evaluation-report.md` tiene el veredicto `SPLIT` y `story-refinement-log.md` registra el refinamiento, pero no hay una evaluación FINVEST posterior. La nota «Tamaño» sigue proponiendo un posible split entre la ejecución de suites y la comprobación del DoD. tasks.md mantiene ambas partes separadas (motor y C3 frente a C4/T013), así que el split sigue siendo viable sin rehacer el plan. Conviene ejecutar `/story-evaluation STORY-169` para dejar el veredicto FINVEST al día.
5. **Dependencia (CR-001):** T011–T020 requieren que STORY-124 (hoy `SPECIFY/DONE`) entregue `skills/epic-validate/`. Mientras tanto, `/story-implement-tasks STORY-169` solo puede completar los grupos 1–2, 6 y parte del 7.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-169` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-169` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin`; AC-2 y AC-4 como `Esquema del escenario` con `Ejemplos` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: 4/4 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals, Interfaces, Esquema de datos y Flujos con `// satisface: AC-N`; Componentes y Decisiones técnicas con columna `AC` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1…D-9 resueltas; «Open Questions: ninguna»; las ambigüedades que afectan a otros documentos están en CR-001…CR-005 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (27 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo o un paso, con criterio de hecho explícito; AC-1 (T010, T017), AC-2 (T004, T005, T018), AC-3 (T010, T014, T019), AC-4 (T013, T020) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |
