---
type: analyze
id: STORY-140
slug: STORY-140-analyze-report
title: "Analyze: Alinear story-evaluation"
story: STORY-140
design: STORY-140
tasks: STORY-140
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-140-alinear-story-evaluation
---

<!-- Referencias -->
[[STORY-140-alinear-story-evaluation]] · [[STORY-140-alinear-story-evaluation-design]] · [[STORY-140-alinear-story-evaluation-tasks]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Reporte de Coherencia: Alinear story-evaluation

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 42/42 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (9 componentes + 6 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ✓ | Listada en la épica; cubre CS-5; respeta la secuencia tras STORY-138 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 3 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Veredicto canónico (`APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`) en `## Veredicto` como primera sección y en `verdict`, sin `decision` ni valores heredados | ✓ | D-1 (tabla de primera coincidencia), D-2 (frontmatter con `verdict`), D-3 (`## Veredicto` y motivo determinista), D-4 (sin `**FINVEST Decisión:**` ni `{gateway_decision}`), D-5, D-9, D-10 (TC-001…TC-008), D-11, D-12; «Esquema de datos»; interfaces «Frontmatter del reporte» y «Sección `## Veredicto`»; V-1…V-5, V-9 |
| AC-2 | `story-specify` enruta: `NEEDS-REFINEMENT` → `story-improve` con gate anti-bucle; `SPLIT` → `story-split`; `APPROVED` → `SPECIFY/DONE` | ✓ | D-6 (tabla de enrutamiento), D-7 (gate de `story-improve` y reportes sin `verdict`), D-8 (plan FINVEST en `story-split`), D-10 (evals de `story-specify` y `story-improve`); flujos F-2 y F-3; interfaces «Gate de `story-improve`» y «Plan de `story-split`»; V-6, V-7 |
| CNF-1 | Rúbricas, pesos y umbrales FINVEST sin cambio | ✓ | D-1 (mismos umbrales y precedencia efectiva de hoy, Caso B de `example-rechazar.md`), D-10 (TC-008), V-5 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar que la policy existe y leer G-01…G-06, §4, §5, §6 y §7.2 | D-11, D-12 | ✓ |
| T002 | Confirmar el «Estado medido» por `grep` | Context, D-9 | ✓ |
| T003 | Línea base de `verify:repository` y `npm test` | V-10 | ✓ |
| T004 | Frontmatter del template con `verdict` | D-2, Componente «Template del reporte FINVEST» | ✓ |
| T005 | Sección `## Veredicto` en el template | D-3, Esquema de datos | ✓ |
| T006 | `{gateway_resultado}` y eliminar `**FINVEST Decisión:**` | D-4 | ✓ |
| T007 | Paso 4: tabla de primera coincidencia | D-1, D-9 | ✓ |
| T008 | Paso 3: reglas críticas como remisión; l.73 y l.123 | D-1 | ✓ |
| T009 | Paso 5: escribir `## Veredicto` y `{gateway_resultado}` | D-3, D-4 | ✓ |
| T010 | Paso 6: frontmatter por remisión y confirmación `(verdict: …)` | D-2, D-5 | ✓ |
| T011 | Paso 7, errores y salida con `verdict = APPROVED` | D-9 | ✓ |
| T012 | `description`, Objetivo y Modo Agent | D-9 | ✓ |
| T013 | Ejemplos de referencia (l.350-354) | D-1, D-9 | ✓ |
| T014 | README de story-evaluation | D-9 | ✓ |
| T015 | `example-ready.md` | D-3, D-4, D-9 | ✓ |
| T016 | `example-refinar.md` | D-3, D-4, D-9 | ✓ |
| T017 | `example-rechazar.md` (casos A y B) | D-1, D-3, D-4, D-9 | ✓ |
| T018 | `story-specify` Paso 3 y columna `Veredicto FINVEST` | D-6 | ✓ |
| T019 | `story-specify` Paso 4 con la señal S = 1 | D-6 | ✓ |
| T020 | `story-specify` Pasos 5A, 5B, 6 y reglas | D-6 | ✓ |
| T021 | README de `story-specify` | D-6, D-9 | ✓ |
| T022 | `product-owner.md` | D-9 | ✓ |
| T023 | Gate de `story-improve` y `⚠️` sin `verdict` | D-7 | ✓ |
| T024 | Resto de `story-improve/SKILL.md` | D-7, D-9 | ✓ |
| T025 | README e `improvement-log-template.md` de `story-improve` | D-9 | ✓ |
| T026 | Ejemplos de `story-improve` (reportes y `story.md`) | D-7, D-9 | ✓ |
| T027 | `story-split` Paso 3b | D-8 | ✓ |
| T028 | Ejemplos de `story-split` | D-9 | ✓ |
| T029 | Las dos copias de `story-template.md` | D-9 | ✓ |
| T030 | `sddf-commands-pipeline.md` | D-9 | ✓ |
| T031 | FR-031 | D-1, D-9 | ✓ |
| T032 | Evals de story-evaluation (TC-001…TC-008) | D-10 | ✓ |
| T033 | Evals de story-specify (incluido TC-009) | D-6, D-10 | ✓ |
| T034 | Evals de story-improve (incluido TC-006) | D-7, D-10 | ✓ |
| T035 | V-1 | Contratos de verificación V-1 | ✓ |
| T036 | V-2, V-3, V-4 | Contratos de verificación V-2…V-4 | ✓ |
| T037 | V-5 | Contratos de verificación V-5 | ✓ |
| T038 | V-6, V-7 | Contratos de verificación V-6, V-7 | ✓ |
| T039 | V-8 | Contratos de verificación V-8 | ✓ |
| T040 | V-9 | D-11, V-9 | ✓ |
| T041 | V-10 | V-10 | ✓ |
| T042 | V-11 (manual) | V-11 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Regla de veredicto y escritura del reporte FINVEST (`story-evaluation/SKILL.md`) | Componentes afectados | T007–T013 | ✓ |
| Template del reporte FINVEST | Componentes afectados | T004–T006 | ✓ |
| Ficha y ejemplos de `story-evaluation` | Componentes afectados | T014–T017 | ✓ |
| Evals de `story-evaluation` | Componentes afectados | T032 | ✓ |
| Enrutamiento del ciclo de especificación (`story-specify`) | Componentes afectados | T018–T022, T033 | ✓ |
| Gate de mejora automática (`story-improve`) | Componentes afectados | T023–T026, T034 | ✓ |
| Lectura del plan FINVEST en el split (`story-split`) | Componentes afectados | T027, T028 | ✓ |
| Comentario de escritor de `status` (dos copias del template de historia) | Componentes afectados | T029, T039 | ✓ |
| Documentación vigente (guía de comandos, FR-031) | Componentes afectados | T030, T031 | ✓ |
| Frontmatter del reporte | Interfaces | T004, T010 | ✓ |
| Sección `## Veredicto` | Interfaces | T005, T009 | ✓ |
| Línea de score S (`**S – Small:** <n> / 5`) | Interfaces | T019 (consumo; la forma no cambia y T006 la conserva) | ✓ |
| Confirmación de guardado | Interfaces | T010 | ✓ |
| Gate de `story-improve` | Interfaces | T023 | ✓ |
| Plan de `story-split` | Interfaces | T027 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada.

Las evals de D-10 (T032–T034) cubren AC-1 (cuatro filas y precedencia) y AC-2 (tres filas y la señal S = 1), pero no sustituyen a `testcases.md` como vía para `/story-implement`.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-140`: no disponible (ejecuta `/story-testcases STORY-140` para habilitarlo) |
| tasks.md | ✓ | `/story-implement-tasks STORY-140`: disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › Historias: «STORY-140 — Alinear story-evaluation: Mover el veredicto al inicio, declarar `verdict` y normalizar los valores a `APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (decidir el siguiente paso sin interpretar valores en español) es el gate homogéneo del Alcance. La historia es dueña de CS-5 (`RECHAZAR` → `NEEDS-REFINEMENT`), contribuye a CS-2, CS-3 y CS-10, y sigue la rama `verdict` de `flowchart-story-specify.mermaid` |
| Restricciones de la épica respetadas | ✓ | Habilitación secuencial: D-12 y T001 detienen la implementación si `docs/policies/validation-contract-policy.md` no existe (hoy no existe; STORY-138 está en `READY-FOR-IMPLEMENT/DONE`). No renombra `story-improve` a `story-refine` (Non-Goal). `SPLIT` es una extensión local permitida. Ningún archivo editado contendrá `APROBADA` (CS-10, SMOKE-3; D-7, D-10, V-1). CR-002 traslada `docs/product/` a STORY-143, que es la dueña de CS-10 |

> Nota informativa: el frontmatter de `epic.md` declara `status: DEFINE` / `substatus: TODO`, mientras que el commit `283bb1f` la anuncia como `READY-FOR-DEV`. No afecta a la coherencia de esta historia, pero conviene revisar el estado de la épica antes de iniciar la implementación.

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** — (trazabilidad AC ↔ diseño: comportamiento del diseño sin fila de AC; no bloqueante)
- **Descripción:** D-6 añade la fila «`NEEDS-REFINEMENT` con `**S – Small:** 1 / 5` → Paso 4 (`story-split`); si no aplica, Paso 5A», y D-10 añade a las evals de `story-specify` el caso TC-009 que la verifica. Los Ejemplos de AC-2 solo tienen la fila «`NEEDS-REFINEMENT` → invoca story-improve», así que, leído literalmente, AC-2 contradice ese camino. El diseño lo justifica en las Notas de la historia («Ese camino debe conservarse»), pero el comportamiento queda fuera de los criterios de aceptación.
- **Archivo afectado:** `story.md`, sección «AC-2 — Escenario alternativo», tabla `Ejemplos` (l.49-53); `design.md`, sección «D-6 — Enrutamiento en `story-specify`» (l.254-259).
- **Acción requerida:** añadir a los Ejemplos de AC-2 la fila `NEEDS-REFINEMENT` con S – Small = 1 → «invoca story-split; si no produce historias derivadas, invoca story-improve», o aceptar de forma explícita que las Notas gobiernan ese caso.

### INC-002 [WARNING]

- **Tipo:** — (ambigüedad en los Ejemplos del AC resuelta en el diseño; no bloqueante)
- **Descripción:** en AC-1 se solapan dos filas de Ejemplos para el caso S = 1 con otra dimensión INVEST = 1: la fila 3 («una dimensión INVEST distinta de S = 1» → `NEEDS-REFINEMENT`) y la fila 4 («S – Small = 1» → `SPLIT`). D-1 fija que gane la fila 2 de su tabla (`NEEDS-REFINEMENT`), con lo que conserva la precedencia efectiva de hoy (CNF-1). Sin embargo, la fila 4 de AC-1, leída sola, promete `SPLIT` para cualquier S = 1.
- **Archivo afectado:** `story.md`, sección «AC-1 — Escenario principal», tabla `Ejemplos` (l.39-40); `design.md`, sección «D-1 — Tabla de decisión con precedencia explícita» (l.167-170).
- **Acción requerida:** precisar la fila 4 de AC-1 como «S – Small = 1 y ninguna otra dimensión INVEST = 1» para que el AC coincida con D-1 y con TC-008.

### INC-003 [WARNING]

- **Tipo:** E (criterio DoD PLAN no evaluable con certeza; regla de duda → `⚠️`)
- **Descripción:** criterio DoD «tasks.md DEBE contener únicamente tareas atómicas». Casi todas las tareas son atómicas, pero T026 agrupa cuatro archivos en dos directorios con dos propósitos distintos: alinear los `finvest-evaluation-report.md` de ejemplo con D-3 y D-7, y retirar de los `story.md` de ejemplo el bloque FINVEST que eliminó STORY-090. T020 y T024 también abarcan muchas líneas, aunque cada una edita un solo archivo con un solo propósito.
- **Archivo afectado:** `tasks.md`, sección «6. Consumidor `story-improve`», tarea T026 (l.642).
- **Acción requerida:** dividir T026 en dos tareas: (a) reportes de ejemplo (`verdict`, `## Veredicto` y retirada de la fila «Decisión») y (b) `story.md` de ejemplo (retirada del bloque FINVEST).

---

## Recomendaciones

1. **INC-001:** en `story.md` › AC-2 › Ejemplos, añadir la fila del caso `NEEDS-REFINEMENT` con S – Small = 1 → `story-split` y, como respaldo, `story-improve`. Así AC-2 cubre D-6 fila 3 y TC-009 de las evals de `story-specify`. `/story-fix-plan` no edita `story.md`: este cambio es manual o se hace con `/story-improve`.
2. **INC-002:** en `story.md` › AC-1 › Ejemplos, reescribir la fila 4 como `S – Small = 1 sin otra dimensión INVEST = 1 | SPLIT`. Es manual por el mismo motivo.
3. **INC-003:** en `tasks.md` › grupo 6, dividir T026 en T026a (reportes de ejemplo) y T026b (`story.md` de ejemplo), ambas `[P]`. Se puede aplicar con `/story-fix-plan STORY-140`.
4. **Opcional:** ejecutar `/story-testcases STORY-140` para habilitar también `/story-implement` y evaluar la Correlación 6.
5. **Antes de implementar:** confirmar que STORY-138 está implementada, porque T001 se detiene si `docs/policies/validation-contract-policy.md` no existe. Revisar también el estado del frontmatter de EPIC-25.

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 y AC-2 son `Esquema del escenario` con Dado/Cuando/Entonces/Pero y tablas de Ejemplos (story.md l.27-54) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-5, D-9…D-12; AC-2: D-5…D-8, D-10; CNF-1: D-1, D-10 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-12, Goals y «Esquema de datos» llevan `// satisface: AC-N`; las tablas de Componentes, Interfaces y Complejidad tienen la columna «Satisface»; F-1…F-4 llevan `// AC-N` |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | Open Questions: «Ninguna». Precedencia (D-1), señal de split (D-6), reportes heredados (D-7) y división (D-12) resueltas. `migrate-finvest-field.js` en CR-001 y `docs/product/` en CR-002. La dependencia con la policy publicada tiene un procedimiento fijado (D-11, T001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (42 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | AC-1 (T004–T017, T029–T032, T035–T037, T039–T040) y AC-2 (T018–T028, T033–T034, T038) cubiertos. T026 agrupa cuatro archivos con dos propósitos (INC-003) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no está presente |
