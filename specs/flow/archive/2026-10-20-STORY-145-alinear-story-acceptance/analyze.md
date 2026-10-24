---
type: analyze
id: STORY-145
slug: STORY-145-analyze-report
title: "Analyze: Alinear story-acceptance"
story: STORY-145
design: STORY-145
tasks: STORY-145
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-145-alinear-story-acceptance
---

<!-- Referencias -->
[[STORY-145-alinear-story-acceptance]] · [[STORY-145-alinear-story-acceptance-design]] · [[STORY-145-alinear-story-acceptance-tasks]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Reporte de Coherencia: Alinear story-acceptance

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1; las cinco filas de los Ejemplos de AC-1 tienen regla en D-1 y flujo en F-1…F-4) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 35/35 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 16/16 elementos con tarea (10 componentes + 6 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ⚠️ | Listada en la épica y cubre CS-9. Depende de STORY-138, que está en `READY-FOR-IMPLEMENT/DONE`: la policy todavía no existe |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓, 1 ⚠️ (trazabilidad de F-6 y F-7) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 5 WARNING)

> Medición en el filesystem (2026-10-17): el «Estado medido» del diseño coincide con los archivos. Se comprobaron:
> - `skills/story-acceptance/SKILL.md` (532 líneas): `$FINAL_STATUS` en l.374-376, `{final_status}` en l.397, `{estado_final_texto}` en l.404, `ACCEPTANCE APROBADO/RECHAZADO/BLOQUEADO` en l.428, 436, 444 y 466-477, el aviso `{final-status}` en l.260, el camino `[Q]` en l.339-343 y 1d en l.156-180, que solo acepta `VERIFY/DONE` y `ACCEPTANCE/IN-PROGRESS`.
> - `acceptance-report-template.md` (42 líneas; `final-status` en l.9, `## Estado final` en l.36).
> - Los tres ejemplos: `example-rejected` dice «ACCEPTANCE BLOQUEADO» con `ACCEPTANCE-REJECTED`, y `example-partial` tiene `final-status: IN-PROGRESS` y el bloque `>` en l.14.
> - `evals/evals.json` (`version: 1.0.0`, 12 casos en `cases`).
> - Las líneas de `docs/guardrails/dod-story-acceptance.md` (l.12, l.26), de los tres fixtures de `memory-system`, de `docs/architecture/state-machine.md` (l.52-54, l.104) y de `docs/domains/domain-story-lifecycle.md` (l.101-103, l.118-119).
>
> Hay una diferencia menor: el bloque de Posicionamiento ocupa l.32-37, no l.33-36. `docs/policies/validation-contract-policy.md` todavía no existe; T001 detiene la historia hasta que STORY-138 lo publique.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Veredicto canónico (`APPROVED` / `NEEDS-CHANGES` / `BLOCKED` / `PENDING`) en `## Veredicto` como primera sección y en `verdict`, sin `final-status` ni `ACCEPTANCE-*` | ✓ | D-1 (regla ordenada con las cinco filas), D-2 (sección y motivo deterministas, sin `## Estado final`), D-4 (frontmatter), D-6 (consola), D-7 (transiciones), D-8 (textos fuera del skill), D-9 (TC-001, 002, 006, 009, 012), D-11; F-1…F-4; V-1…V-7 |
| AC-2 | El aviso de reporte existente lee `verdict` y no `final-status` | ✓ | D-5 (aviso con y sin `verdict`), D-9 (TC-013, TC-014), interfaz «Aviso de reporte existente», F-5, F-6; V-8 |
| CNF-1 | La validación criterio por criterio, `session-status` y la reanudación no cambian | ✓ | D-1 (filas 2-4 = regla actual), D-3 (resultados por criterio intactos), D-4 (`session-status` se mantiene), D-5 (Estados B y C), F-4; V-9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar la policy publicada y anotar diferencias C-1…C-9 | D-10 | ✓ |
| T002 | Confirmar el «Estado medido» | Context, D-11 | ✓ |
| T003 | Línea base del gate | V-12 | ✓ |
| T004 | Template: `verdict: {verdict}` en lugar de `final-status` | D-4 | ✓ |
| T005 | Template: `## Veredicto` primero, sin `## Estado final` | D-2 | ✓ |
| T006 | 7a-7b: `$N_EVALUADOS` y regla ordenada de `$VERDICT` | D-1 | ✓ |
| T007 | 7d: placeholders, `{verdict_reason}`, `{verdict_details}` | D-2, D-4 | ✓ |
| T008 | Camino `[Q]`: `partial` + `PENDING` + mensaje | D-4, D-6, F-4 | ✓ |
| T009 | Estado C: aviso leído de `verdict` | D-5, F-5, F-6 | ✓ |
| T010 | 8a: transiciones y mensajes por veredicto | D-6, D-7 | ✓ |
| T011 | 8b: resumen, `(verdict: …)`, mensajes | D-3, D-6 | ✓ |
| T012 | 1d y Restricciones: reentrada desde `ACCEPTANCE/BLOCKED` | D-7, CR-001 | ✓ |
| T013 | `description`, Objetivo, Posicionamiento, Salida | D-7, D-11 | ✓ |
| T014 | Sección Test Cases del `SKILL.md` | D-6, D-11 | ✓ |
| T015 | `example-approved` alineado | D-2, D-4, D-8 | ✓ |
| T016 | `example-rejected` alineado | D-2, D-3, D-4, D-8 | ✓ |
| T017 | `example-partial` alineado | D-1, D-2, D-4 | ✓ |
| T018 | DoD de ejemplo del skill | D-8 | ✓ |
| T019 | README del skill | D-1, D-7, D-11 | ✓ |
| T020 | `docs/guardrails/dod-story-acceptance.md` | D-8 | ✓ |
| T021 | Fixtures DoD de `memory-system` | D-8 | ✓ |
| T022 | `docs/architecture/state-machine.md` | D-7, D-11 | ✓ |
| T023 | `docs/domains/domain-story-lifecycle.md` | D-7, D-11 | ✓ |
| T024 | Evals: casos existentes | D-9 | ✓ |
| T025 | Evals: TC-013, TC-014, `version`, `description` | D-9 | ✓ |
| T026 | V-1 | Contratos de verificación | ✓ |
| T027 | V-2 | Contratos de verificación | ✓ (ver INC-002) |
| T028 | V-3, V-4, V-5 | Contratos de verificación | ✓ |
| T029 | V-6 | Contratos de verificación | ✓ |
| T030 | V-7 | Contratos de verificación | ✓ |
| T031 | V-8, V-10 | Contratos de verificación | ✓ |
| T032 | V-9 | Contratos de verificación | ✓ |
| T033 | V-11 | Contratos de verificación, D-10 | ✓ |
| T034 | V-12 | Contratos de verificación | ✓ |
| T035 | V-13 (manual) | Contratos de verificación | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Template del reporte de aceptación | Componentes afectados | T004, T005 | ✓ |
| Orquestador ACCEPTANCE (`SKILL.md`) | Componentes afectados | T006…T014 | ✓ |
| Reportes de ejemplo | Componentes afectados | T015, T016, T017 | ✓ |
| DoD de ejemplo del skill | Componentes afectados | T018 | ✓ |
| README del skill | Componentes afectados | T019 | ✓ |
| Evals del skill | Componentes afectados | T024, T025 | ✓ |
| DoD ACCEPTANCE del repositorio | Componentes afectados | T020 | ✓ |
| Fixtures DoD de `memory-system` | Componentes afectados | T021 | ✓ |
| Máquina de estados | Componentes afectados | T022 | ✓ |
| Dominio del ciclo de historia | Componentes afectados | T023 | ✓ |
| `verdict` en `acceptance-report.md` | Interfaces | T004, T007, T008, T015-T017 | ✓ |
| `session-status` | Interfaces | T004, T008 (se mantiene) | ✓ |
| Línea de veredicto | Interfaces | T005, T007 | ✓ |
| Estado de `story.md` | Interfaces | T010, T012 | ✓ |
| Aviso de reporte existente | Interfaces | T009 | ✓ |
| Confirmación de consola | Interfaces | T008, T010, T011 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.29: «**STORY-145** — Alinear story-acceptance». Es dueña de CS-9 (l.84) |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (mismo vocabulario que `story-code-review` y `story-verify`) coincide con el alcance (l.18), CS-9 (l.42) y las Notas sobre `BLOCKED`, `PENDING` y la precedencia (l.89-91). También contribuye a CS-2 y CS-3, cuya verificación pertenece a STORY-143 |
| Restricciones de la épica respetadas | ⚠️ | El bucle de `story-implement` queda fuera de alcance, como pide la épica (l.82), y los históricos de `docs/specs/` no se tocan. Queda una dependencia abierta: la épica (l.85) exige el contrato de STORY-138 antes de alinear. STORY-138 está en `READY-FOR-IMPLEMENT/DONE` y la policy no existe todavía. El gate de T001 la cubre (INC-005) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C (elemento de diseño implementado de forma incompleta)
- **Descripción:** D-1 coloca la fila `PENDING` en 7b, pero el camino `[Q]` del Paso 5 (`SKILL.md` l.339-343) termina el skill en el punto 4 («Terminar el skill») y nunca pasa por el Paso 7. D-4 y T008 dicen que `[Q]` usa «el mismo template y la misma tabla de 7d». No dicen que calcule antes los contadores de 7a. Sin ellos, el motivo de D-2 `Sesión parcial: {n_evaluados} de {total_criterios} criterios evaluados.` no tiene valores, y la fila 1 de 7b es inalcanzable en el flujo real.
- **Archivo afectado:** `tasks.md` — T008 (y `design.md` — D-4)
- **Acción requerida:** precisar en T008 que `[Q]` calcula `$TOTAL_CRITERIOS` y `$N_EVALUADOS` de 7a, fija `$VERDICT = PENDING` (fila 1 de 7b) y después aplica 7d.

### INC-002 [WARNING]

- **Tipo:** C (contrato de verificación inejecutable)
- **Descripción:** V-2 (T027) exige que `grep -rn -E "ACCEPTANCE-(APPROVED|REJECTED|BLOCKED)" docs skills --exclude-dir=specs --exclude=evals.json` no devuelva nada. Pero la tabla §5 de `docs/policies/validation-contract-policy.md` listará esos literales como valores heredados (diseño de STORY-138, l.214-215). T001 exige que ese archivo exista. Con la policy publicada, T027 siempre fallará.
- **Archivo afectado:** `design.md` — «Contratos de verificación» V-2; `tasks.md` — T027
- **Acción requerida:** excluir `docs/policies/validation-contract-policy.md` del grep de V-2/T027, o filtrar sus líneas.

### INC-003 [WARNING]

- **Tipo:** C (tarea imprecisa frente al archivo real)
- **Descripción:** T019 pide cambiar «tras la aceptación, rechazo o bloqueo» por «según el veredicto» en `README.md` l.11 y l.16. Esa frase solo aparece en l.16; l.11 dice «actualiza el estado de la historia según el resultado». Además, «Produces» es una etiqueta en negrita dentro de `## What it does`, no un encabezado. Si se inserta `## Veredicto` justo después, la lista **Does not do:** queda dentro de `## Veredicto`.
- **Archivo afectado:** `tasks.md` — T019 (y `design.md` — D-11, fila de README)
- **Acción requerida:** en T019, l.11 «según el resultado» → «según el veredicto»; l.16 con el reemplazo indicado. Ubicar `## Veredicto` tras el final de `## What it does` (antes de `## When to use`).

### INC-004 [WARNING]

- **Tipo:** C (texto que quedaría desactualizado)
- **Descripción:** D-7 y T012 sostienen que el Paso 4 no cambia porque su condición «NO es `ACCEPTANCE/IN-PROGRESS`» ya cubre la reentrada. La condición sí la cubre, pero l.275 la glosa como «(es decir, es `VERIFY/DONE`)». Con la reentrada desde `ACCEPTANCE/BLOCKED`, esa aclaración deja de ser cierta.
- **Archivo afectado:** `tasks.md` — T012 («No tocar el Paso 4»); `SKILL.md` l.275
- **Acción requerida:** ampliar T012 para que la aclaración diga «(es decir, es `VERIFY/DONE` o `ACCEPTANCE/BLOCKED`)». La condición no cambia; V-9 no se ve afectado porque mira el Paso 5 y los Estados B y C.

### INC-005 [WARNING]

- **Tipo:** D (dependencia con la épica) y decisión pendiente del PO
- **Descripción:**
  - **STORY-138 sin implementar:** STORY-138 está en `READY-FOR-IMPLEMENT/DONE` y `docs/policies/validation-contract-policy.md` no existe. La épica (l.85) exige el contrato antes de alinear.
  - **CR-001 abierto:** amplía el alcance a la reentrada desde `ACCEPTANCE/BLOCKED` en 1d. La épica lo respalda («`BLOCKED` … detiene el flujo hasta que se resuelva el bloqueo», l.79-81), pero la historia no lo pide.
- **Archivo afectado:** `design.md` — D-10, CR-001; `tasks.md` — T001, T012
- **Acción requerida:**
  - **STORY-138:** implementarla antes de iniciar esta historia; T001 lo comprueba.
  - **CR-001:** confirmar con el PO. Si se rechaza, retirar T012 y el «vuelve a ejecutar» de T010, como prevé el CR.

---

## Recomendaciones

1. **INC-001 —** en `tasks.md`, T008, añadir: «Antes de escribir, calcular `$TOTAL_CRITERIOS` y `$N_EVALUADOS` como en 7a y fijar `$VERDICT = PENDING` (fila 1 de 7b)». Opcionalmente, reflejarlo en `design.md` D-4.
2. **INC-002 —** en `design.md` V-2 y `tasks.md` T027, añadir `--exclude=validation-contract-policy.md` (o `| grep -v docs/policies/validation-contract-policy.md`) al grep.
3. **INC-003 —** en `tasks.md`, T019:
   - corregir la frase de l.11 («según el resultado» → «según el veredicto»);
   - situar `## Veredicto` antes de `## When to use`.
4. **INC-004 —** en `tasks.md`, T012, sustituir «No tocar el Paso 4» por «En el Paso 4 (l.275), la aclaración pasa a «(es decir, es `VERIFY/DONE` o `ACCEPTANCE/BLOCKED`)»; la condición no cambia».
5. **INC-005 —**
   - implementar STORY-138 antes de activar esta historia (WIP = 1);
   - registrar la decisión del PO sobre CR-001 en `story.md` › Notas.
6. **DoD (trazabilidad) —** en `design.md`, anotar F-6 con `// AC-2, CNF-1` junto a `// P7`. F-7 son puntos de cambio sin AC: anotar `// sin AC (mantenibilidad)` o moverlos a «Risks / Trade-offs».

> `/story-fix-plan STORY-145` puede aplicar las recomendaciones 1-4 y 6 sobre `design.md` y `tasks.md`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-145` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-145` |

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (`sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (Esquema del escenario con 5 ejemplos) y AC-2, en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1, D-2, D-4, D-6…D-9; AC-2: D-5, D-9; CNF-1: D-1, D-3, D-4, D-5 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ⚠️ | WARNING | D-1…D-11, Goals, Componentes, Interfaces, Esquema y F-1…F-5 citan AC. F-6 se anota `// P7` y F-7 `// P6`, sin AC (F-6 cubre AC-2/CNF-1 en la práctica). Regla de duda: no bloquea |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; CR-001 (alcance de la reentrada) y CR-002 (DoD circular) registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (35 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Las 5 filas de AC-1 → T006, T010, T030; AC-2 → T009, T025, T031; CNF-1 → T032. Cada tarea toca un archivo o una sección |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
