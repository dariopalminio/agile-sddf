---
type: analyze
id: STORY-189
slug: STORY-189-analyze-report
title: "Analyze: El rework de los tres gates vuelve a IMPLEMENT/TODO"
story: STORY-189
design: STORY-189
tasks: STORY-189
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-189-el-rework-vuelve-a-implement-todo
---

<!-- Referencias -->
[[STORY-189-el-rework-vuelve-a-implement-todo]]

# Reporte de Coherencia: El rework de los tres gates vuelve a IMPLEMENT/TODO

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo C

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 a CNF-5) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada: testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 19/19 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 11/11 componentes con tarea; 10/10 interfaces con tarea; un texto del gate 0c.2 de C-6 sin tarea (INC-001) |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ✓ | listada; cubre CS-2 (rework), SMOKE-2 y la parte de CS-7 de los tres gates y de los ejecutores |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (uno no aplica: testcases.md no existe) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Rework por revisión: `/story-code-review` deja `IMPLEMENT/TODO` + `fix-directives.md` y nombra al ejecutor; `/story-implement` acepta `IMPLEMENT/TODO`, entra en modo rework y pasa a `IMPLEMENT/IN-PROGRESS` | ✓ | C-6, C-8; Interfaces «Escritura de los gates», «Bloque de ejecutor», «Precondición de entrada», «Transición de arranque», «Señal del modo rework»; D-01, D-03, D-04; F-1; evals TC-002 (code-review) y TC-010 migrado (story-implement) |
| AC-2 | Rechazo de verify (desde `CODE-REVIEW/DONE`) y de acceptance (desde `VERIFY/DONE`): `IMPLEMENT/TODO` y resumen con ejecutor y alternativa si existe `tasks.md` | ✓ | C-9, C-10; Interfaces «Escritura de los gates», «Bloque de ejecutor», «Línea de estado»; D-01, D-02; F-2; evals TC-004 + caso nuevo con `tasks.md` (verify), TC-002/TC-009 + caso nuevo con `tasks.md` (acceptance) |
| AC-3 | Solo `fix-directives.md` activa el rework en `/story-implement-tasks` con `IMPLEMENT/TODO` y todas las tareas completadas: fila 1 aplica la ronda 1; fila 2 (sin directivas, `verify-report.md` NEEDS-CHANGES) no anuncia correcciones ni ronda | ✓ | C-7; Interfaces «Transición de arranque», «Gate de salida anticipada de 2c», «Señal del modo rework»; D-03, D-05 (descarta explícitamente las dos alternativas que dejarían la historia sin salida); F-3; evals TC-001 migrado (fila 1) y caso nuevo `implement-todo-sin-fix-directives-no-anuncia-rework` (fila 2) |

Criterios no funcionales: CNF-1 → D-06, F-4, C-1 a C-5, V-10, V-11; CNF-2 → D-01, V-4, `not_contains` de TC-017/TC-021 (code-review), TC-005 (verify), TC-001/TC-006 (acceptance); CNF-3 → D-04, D-05 («Legado»), D-06, casos conservados y caso nuevo de legado en `story-implement`; CNF-4 → Non-Goals, V-5, CR-001; CNF-5 → V-12, V-13.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Estado de partida, ADR-0022, estado de STORY-188 y línea base del gate | Context, dependencias, D-04 | ✓ |
| T002 | Migrar reworks y caso de legado en evals de `story-implement` | C-1, D-06, Esquema de datos | ✓ |
| T003 | Migrar reworks y caso de la fila 2 de AC-3 en evals de `story-implement-tasks` | C-2, D-05, D-06, Esquema de datos | ✓ |
| T004 | Gate 0c.2/0c.4 de `story-implement/SKILL.md` | C-6, D-03, D-04, Interfaces de entrada | ✓ |
| T005 | Gate 1d, 2c, 2e y Paso 4 de `story-implement-tasks/SKILL.md` | C-7, D-03, D-04, D-05 | ✓ |
| T006 | Migrar evals de `story-code-review` | C-3, D-06, Esquema de datos | ✓ |
| T007 | Migrar y ampliar evals de `story-verify` | C-4, D-02, D-06 | ✓ |
| T008 | Migrar y ampliar evals de `story-acceptance` | C-5, D-02, D-06 | ✓ |
| T009 | Destino del rework en `story-code-review/SKILL.md` | C-8, D-01, Interfaces de escritura y línea de estado | ✓ |
| T010 | Destino y bloque de ejecutor en `story-verify/SKILL.md` | C-9, D-01, D-02 | ✓ |
| T011 | Destino y bloque de ejecutor en `story-acceptance/SKILL.md` | C-10, D-01, D-02 | ✓ |
| T012 | README de verify y acceptance | C-11 | ✓ |
| T013 | README de los ejecutores | C-11, D-04 | ✓ |
| T014 | Grep de los gates y clasificación en los ejecutores; 4f, plantilla y `BLOCKED` intactos | V-2, V-4, V-5 | ✓ |
| T015 | Recorrer F-1 a F-3 y las filas de los AC | Flujos clave, V-1, V-3, V-6 a V-9 | ✓ |
| T016 | JSON válido e inventario de evals | V-10 | ✓ |
| T017 | UTF-8 sin BOM ni U+FEFF | V-13 | ✓ |
| T018 | `verify:repository` y `npm test` | V-12 | ✓ |
| T019 | Pendientes manuales y orden de commits en `implement-report.md` | F-4, V-11, Risks (runtime) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Evals de `story-implement` | Componentes afectados | T002 | ✓ |
| C-2 Evals de `story-implement-tasks` | Componentes afectados | T003 | ✓ |
| C-3 Evals de `story-code-review` | Componentes afectados | T006 | ✓ |
| C-4 Evals de `story-verify` | Componentes afectados | T007 | ✓ |
| C-5 Evals de `story-acceptance` | Componentes afectados | T008 | ✓ |
| C-6 Gate de `story-implement` | Componentes afectados | T004 | ⚠️ (INC-001) |
| C-7 Gate de `story-implement-tasks` | Componentes afectados | T005 | ✓ |
| C-8 Destino del rework en code-review | Componentes afectados | T009 | ✓ |
| C-9 Destino del rework en verify | Componentes afectados | T010 | ✓ |
| C-10 Destino del rework en acceptance | Componentes afectados | T011 | ✓ |
| C-11 README | Componentes afectados | T012, T013 | ✓ |
| Escritura de los gates, bloque de ejecutor, línea de estado | Interfaces | T009, T010, T011 | ✓ |
| Precondición de entrada, variables de entrada, transición de arranque, línea `Estado`, mensaje de rechazo | Interfaces | T004, T005 | ✓ |
| Gate de salida anticipada de 2c | Interfaces | T005 | ✓ |
| Señal del modo rework (sin cambio) | Interfaces | T004, T005 (no tocan 0c.3 ni 2c/2f), T015 | ✓ |
| Contratos V-1 a V-13 | Contratos de verificación | T014 a T019 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, viñeta STORY-189, con el mismo Como/Quiero/Para |
| Objetivo de la historia alineado con la épica | ✓ | CS-2 («`/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO`; los ejecutores aceptan … `IMPLEMENT/TODO` … y solo `fix-directives.md` activa el modo rework»), SMOKE-2 (mismo escenario que AC-1) y CS-7 (evals de los tres gates en los estados nuevos; casos de legado en los ejecutores) |
| Restricciones de la épica respetadas | ✓ | «Orden y coordinación»: cadena STORY-188 → STORY-189 (D-03 y D-04 funcionan en los dos órdenes); añade la entrada nueva sin retirar `READY-FOR-IMPLEMENT/DONE` (CNF-3, D-04); ejecutores antes que gates (F-4); EPIC-28 intacto (CNF-4, V-5) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C: elemento de diseño sin tarea
- **Descripción:** `skills/story-implement/SKILL.md:287` (párrafo de ejemplos del gate 0c.2, parte de C-6) dice: «Una historia aprobada no se re-implementa sin pasar por un rechazo de `story-code-review`». Con esta historia, `story-verify` y `story-acceptance` también devuelven la historia a implementación, así que la frase queda incompleta. design.md no la incluye en el inventario de Context y T004 no la nombra. Las líneas que T004 sí cita (33, 54, 249, 289, 322, 325, 331, 334) no la cubren.
- **Archivo afectado:** design.md, sección «Context» (viñeta `story-implement`); tasks.md, T004.
- **Acción requerida:** añadir a T004 la línea 287: «… sin pasar por un rechazo de `story-code-review`, `story-verify` o `story-acceptance`».

---

## Recomendaciones

1. **INC-001:** con `/story-fix-plan STORY-189`, o a mano, añadir la línea 287 de `skills/story-implement/SKILL.md` a la lista de T004 en tasks.md y a la viñeta `story-implement` de «Context» en design.md.
2. **Robustez del eval nuevo (no es un hallazgo):** el `not_contains` `ronda` del caso `implement-todo-sin-fix-directives-no-anuncia-rework` (design.md «Esquema de datos»; T003) es una subcadena amplia. Al implementar T003, se puede usar `(ronda` para que coincida solo con el anuncio de la ronda.
3. **Dependencia (no es un hallazgo):** T001 exige ADR-0022, que todavía no existe (`docs/adr/` llega a ADR-0021). Implementar STORY-186 antes que esta historia. La épica también ordena STORY-188 antes. Si se respeta ese orden, T001 encontrará `PLAN/DONE` en los gates y los ID TC-045/TC-046 y TC-007/TC-008 ocupados.
4. **CR-001 de design.md:** pasa a STORY-190 (conservar las secciones de rondas anteriores de `implement-report.md` o usar otra fuente para `round`). No bloquea.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (planificación en modo `--only-tasks`). Las pruebas de la historia son los casos de eval de C-1 a C-5, trazados a AC-1, AC-2 y AC-3 en «Esquema de datos» de design.md.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-189` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-189` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 en Gherkin; AC-2 y AC-3 con tabla `Ejemplos` |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (tabla de cobertura) |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | `// satisface:` en Goals, D-01 a D-06 y «Esquema de datos»; columna «Satisface» en Componentes e Interfaces |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad está resuelta o registrada como CR | ✓ | — | D-01 a D-06 cerradas, incluido el orden con STORY-188 (D-04) y la salida de la fila 2 de AC-3 (D-05); CR-001 registrado |
| Existe tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | 19 tareas con criterio «Hecho» y dependencias; AC-1 → T002, T004, T006, T009; AC-2 → T007, T008, T010, T011; AC-3 → T003, T005 |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
