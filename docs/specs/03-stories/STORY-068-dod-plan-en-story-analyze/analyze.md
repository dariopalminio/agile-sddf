---
type: analyze
id: STORY-068
slug: STORY-068-analyze-report
title: "Analyze: DoD PLAN en story-analyze"
story: STORY-068
design: STORY-068
tasks: STORY-068
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-plan-en-story-analyze
---

<!-- Referencias -->
[[dod-plan-en-story-analyze]]

# Reporte de Coherencia: DoD PLAN en story-analyze

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 5/5 criterios cubiertos (Req4 explicitado en Goals, Req5 implícito) |
| Alineación tareas → diseño | ⚠️ | 12/13 tareas con diseño; 1 con cobertura implícita |
| Cobertura diseño → tareas | ⚠️ | 2 riesgos del diseño sin tarea de verificación dedicada |
| Alineación con release EPIC-13 | ✓ | Historia listada, objetivo alineado, restricciones respetadas |

**Estado general:** ⚠️ Advertencias — sin inconsistencias bloqueantes

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | story-analyze valida criterios DoD PLAN y los reporta en analyze.md con tabla ✓/❌ | ✓ | D4 (Step 8 sección DoD), D5 (template), D2 (Correlación 5 evaluación semántica) |
| AC-2 | Criterios DoD PLAN con severidad ERROR bloquean transición a READY-FOR-IMPLEMENT | ✓ | D3 (❌ → ERROR bloquea), D4 (Step 9 guardia de transición DoD) |
| AC-3 | DoD no encontrado o sección PLAN ausente → ⚠️ warning, continúa sin error fatal | ✓ | D1 (flexible matching + ⚠️ con lista vacía), D4 (sub-paso 1g fallback) |
| Req4 | Seguir lineamientos skill-structural-pattern.md | ⚠️ | Sin sección explícita en design.md — cambios son consistentes con estructura existente pero no verificados formalmente |
| Req5 | Seguir lineamientos skill-master | ⚠️ | Sin sección explícita en design.md — Task 7.1 cubre la actualización de examples/ pero no fue documentada como decisión de diseño |
| NFR-1 | Lectura runtime: skill se adapta si DoD cambia sin modificar su código | ✓ | D1 (dynamic section search, non-goals "no hardcodear"), D2 (evaluación semántica sin reglas hardcodeadas) |
| NFR-2 | Degradación elegante: ausencia DoD/sección es ⚠️ WARNING, no ❌ ERROR | ✓ | D1 (⚠️ cuando no hay sección), D3 (⚠️ para indeterminable), Risks/Trade-offs, CR-001 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción resumida | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 [P] | Fila DoD en Resumen Ejecutivo del template | D5 "Nueva fila en tabla Resumen Ejecutivo" | ✓ |
| 1.2 [P] | Sección "Cumplimiento DoD — Fase PLAN" en template | D5 "Nueva sección al final con tabla criterio/estado" | ✓ |
| 2.1 | Sub-paso 1g (localizar DoD, extraer sección PLAN, ⚠️ si no encontrado) | D4 "Sub-paso 1g", D1 (flexible matching) | ✓ |
| 3.1 | Correlación 5 — evaluación semántica criterios DoD | D4 "Correlación 5", D2 (evaluación semántica) | ✓ |
| 3.2 | Actualizar tabla de severidad Step 6 (nuevo tipo E) | D3 (severidad ❌ → ERROR), D4 (implícito en Correlación 5) | ✓ |
| 4.1 | Step 8 — completar sección DoD en reporte | D4 "Step 8", D5 (nueva sección template) | ✓ |
| 5.1 | Step 9a — guardia: DoD-ERRORs bloquean transición | D4 "Step 9", D3 (❌ → ERROR bloquea) | ✓ |
| 6.1 | Step 10 — línea `DoD PLAN: N/Total ✓` en resumen | D4 "Step 10 — Línea de resumen DoD" | ✓ |
| 7.1 | Actualizar examples/output/analyze.md con sección DoD | Implícito en Req5 (skill-master guidelines) + D5 (cambios en template y output) — no listado explícitamente en "Artefactos afectados" del design.md | ⚠️ |
| 8.1 | Agregar sección PLAN a definition-of-done-story.md | CR-001 "Acción requerida: Agregar sección PLAN" | ✓ |
| 9.1 [P] | Verificar AC-1 (sección DoD en analyze.md) | AC-1 story.md + D4 Step 8 | ✓ |
| 9.2 [P] | Verificar AC-2 (bloqueo transición ante ❌) | AC-2 story.md + D4 Step 9 | ✓ |
| 9.3 | Verificar AC-3 (degradación elegante DoD ausente) | AC-3 story.md + D1 | ✓ |

---

## Cobertura Diseño → Tareas

| Elemento del diseño | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| D1 — Flexible matching para sección PLAN | Decisions/D1 | Task 2.1 (sub-paso 1g) | ✓ |
| D2 — Evaluación semántica LLM | Decisions/D2 | Task 3.1 (Correlación 5) | ✓ |
| D3 — Severidad ❌ → ERROR, ⚠️ → WARNING | Decisions/D3 | Tasks 3.1, 3.2, 5.1 | ✓ |
| D4 — Sub-paso 1g | Decisions/D4 tabla | Task 2.1 | ✓ |
| D4 — Correlación 5 | Decisions/D4 tabla | Tasks 3.1, 3.2 | ✓ |
| D4 — Step 8 sección DoD | Decisions/D4 tabla | Task 4.1 | ✓ |
| D4 — Step 9 guardia transición | Decisions/D4 tabla | Task 5.1 | ✓ |
| D4 — Step 10 resumen DoD | Decisions/D4 tabla | Task 6.1 | ✓ |
| D5 — Fila Resumen Ejecutivo template | Decisions/D5 | Task 1.1 | ✓ |
| D5 — Sección "Cumplimiento DoD" template | Decisions/D5 | Task 1.2 | ✓ |
| CR-001 — Agregar sección PLAN al DoD | Registro de Cambios | Task 8.1 | ✓ |
| Riesgo "evaluación semántica inconsistente" | Risks/Trade-offs | Sin tarea de verificación dedicada | ⚠️ |
| Riesgo "solapamiento Correlación 5 / 1–4" | Risks/Trade-offs | Sin tarea de documentación ni verificación | ⚠️ |

---

## Alineación con Release

**Release padre:** EPIC-13-quality-gates-con-dod-en-story-workflow

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ | STORY-068 listada como "DoD PLAN en story-analyze" en sección Features |
| Objetivo alineado | ✓ | Objetivo historia ("no avanzar sin cumplir DoD PLAN") es subconjunto directo del objetivo del release ("Convierte el DoD en un quality gate ejecutable") |
| Restricción "lectura runtime" respetada | ✓ | D1 y D2 garantizan lectura dinámica sin hardcode — alineado con "DoD debe leerse en runtime desde el archivo real" (release.md §Requerimiento) |
| Restricción "degradación elegante" respetada | ✓ | D1 (⚠️ si no hay sección), D3 (⚠️ para indeterminable), AC-3 en story — alineado con "si la sección no existe, el skill emite ⚠️ y continúa sin bloquear" (release.md §Riesgos) |
| Dependencia crítica del release reconocida | ✓ | CR-001 en design.md reconoce la dependencia del DoD y la Task 8.1 en tasks.md la resuelve |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** B (tarea sin elemento explícito de diseño)
- **Descripción:** Task 7.1 (actualizar `story-analyze/examples/output/analyze.md`) no figura en la lista "Artefactos afectados" de `design.md`. El diseño lista solo `story-analyze/SKILL.md` y `analyze-report-template.md`. La tarea es correcta y está justificada por Req5 (lineamientos skill-master incluyen mantener ejemplos actualizados), pero el design.md no la documenta.
- **Archivo afectado:** `design.md` — sección "Context / Artefactos afectados"
- **Acción requerida:** Agregar `story-analyze/examples/output/analyze.md` a la lista de "Artefactos afectados" en `design.md`, o aceptar la cobertura implícita y proceder sin modificar el diseño.

### INC-002 [RESUELTO]

- **Tipo:** C (criterio sin tarea dedicada)
- **Resolución:** Agregado Goal explícito en `design.md` § Goals indicando conformidad con `skill-structural-pattern.md` (sub-paso 1g numerado alfabéticamente, Correlación 5 numerada secuencialmente, fallback chain sin hardcode). Agregada tarea 2.2 en `tasks.md` con verificación concreta de los tres puntos de conformidad.

### INC-003 [WARNING]

- **Tipo:** C (criterio con cobertura solo implícita)
- **Descripción:** `Req5` ("Seguir lineamientos del skill-master") tiene Task 7.1 en `tasks.md` (actualización de examples), pero `design.md` no documenta esta decisión ni evalúa si hay otros lineamientos skill-master pendientes (p. ej. evals, descripción del skill).
- **Archivo afectado:** `design.md` — sección "Goals / Non-Goals"
- **Acción requerida:** Revisar en implementación si se requieren evals o actualización de descripción del skill además de los examples.

### INC-004 [WARNING]

- **Tipo:** C (riesgo de diseño sin verificación dedicada)
- **Descripción:** El riesgo "evaluación semántica produce resultado inconsistente en re-ejecuciones" en `design.md` no tiene tarea de verificación. `tasks.md` no cubre este caso edge.
- **Archivo afectado:** `tasks.md` — podría agregarse en Grupo 9 como tarea opcional
- **Acción requerida:** Considerar agregar tarea de verificación manual: re-ejecutar story-analyze sobre la misma historia dos veces y confirmar que el resultado DoD es consistente; o documentar que es aceptado como riesgo residual.

### INC-005 [RESUELTO]

- **Tipo:** C (riesgo de diseño sin cobertura de comportamiento)
- **Resolución:** Extendida tarea 9.1 en `tasks.md` con escenario de solapamiento explícito: preparar historia donde mismo AC falla en Correlación 1 y Correlación 5, confirmar que analyze.md muestra ambas secciones independientemente con conteos separados sin deduplicar.

---

## Recomendaciones

1. **INC-001 (baja prioridad):** Actualizar "Artefactos afectados" en `design.md` para incluir `examples/output/analyze.md`. No bloquea la implementación.

2. **INC-002 (media prioridad):** Agregar en la implementación (Task 2.1 o como tarea nueva) una verificación rápida: confirmar que el sub-paso 1g añadido sigue la numeración y estilo de los pasos existentes del SKILL.md (línea de verificación en la guía de skill-structural-pattern.md §3 Preflight, §2 frontmatter).

3. **INC-003 (baja prioridad):** Durante Task 7.1, revisar si skill-master guidelines requieren actualizar también `evals/` o la `description` del SKILL.md de story-analyze (el trigger no menciona la nueva sección DoD).

4. **INC-004 (baja prioridad):** Documentar en la tarea 9.1 que se ejecute story-analyze dos veces sobre la misma historia y se compare la sección DoD de ambos resultados para detectar flakiness en la evaluación semántica.

5. **INC-005 (media prioridad):** En la tarea 9.1 incluir un escenario donde un AC también falla la Correlación 1 y verificar que el analyze.md muestra las dos secciones independientes (Correlación 1 → INC-XXX TIPO A, Correlación 5 → criterio DoD ❌) sin deduplicar ni confundir los conteos.
