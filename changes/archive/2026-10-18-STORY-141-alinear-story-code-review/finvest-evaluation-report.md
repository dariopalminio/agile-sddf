---
type: finvest-evaluation
story-id: STORY-141
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que automatiza el ciclo implementar → revisar → corregir
> **Quiero** que el reporte de code review declare `verdict` y una sección `## Veredicto` al inicio, con `APPROVED` o `NEEDS-CHANGES`
> **Para** que `story-implement-tasks` y CI decidan si corregir o avanzar sin depender del campo `review-status`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que automatiza el ciclo implementar → revisar → corregir), la acción es concreta (`verdict` y `## Veredicto` al inicio con dos valores) y el beneficio se puede observar (decidir si corregir o avanzar). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. AC-1 es un Esquema del escenario con `Ejemplos` y `Y` en el `Entonces`; AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Declara que depende de STORY-138, que está en `SPECIFY/DONE` pero no se entregó: `docs/policies/validation-contract-policy.md` todavía no existe. A diferencia de STORY-139, ningún AC exige la política: los valores `APPROVED` / `NEEDS-CHANGES` ya están fijados en la propia historia, así que la dependencia está desacoplada. Hay una segunda dependencia sin declarar: el criterio DoD `docs/guardrails/dod-story-code-review.md:25` ("Review status approved en `code-review-report.md`") lo evalúa el propio skill en el Paso 4c.1. |
| **N** – Negociable | 4 | Fija el resultado (`## Veredicto` primero, `verdict` en el frontmatter, sin `review-status`) y deja abierto el cómo: qué hacer con la fila `Review status` de `## Resumen` y con la sección final `## Decisión final`. Las Notas describen el estado actual y no imponen una solución. |
| **V** – Valiosa | 4 | El valor es claro: CI y los agentes leen el resultado de code review con el mismo contrato que el resto de los gates. La premisa del `Para` es parcialmente inexacta (ver E): hoy ningún consumidor decide por `review-status`, porque `story-implement` y `story-implement-tasks` activan el rework solo por la presencia de `fix-directives.md`. El valor real es la uniformidad y la legibilidad para CI. |
| **E** – Estimable | 3 | Es un cambio de texto sin lógica nueva, pero el inventario de las Notas es incompleto y tiene un error. `skills/story-implement-tasks/SKILL.md` no lee `review-status` (su única mención es `needs-changes` en prosa, l. 69). Faltan en el inventario: 23 menciones en `SKILL.md` (Pasos 4c, 4c.1, 4d, 4h, 5, 6 y la salida de ejemplo de la l. 622), la fila `Review status` de `## Resumen` del template (l. 22), `README.md:16`, los tres directorios de `examples/`, los 16 casos de `evals/evals.json` (todos mencionan el vocabulario antiguo), `skills/story-implement/README.md:21`, el fixture de `skills/story-implement/evals/evals.json:1143` y el criterio DoD de `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md:25` y `docs/guardrails/dod-story-code-review.md:25`. Se puede estimar con talla de camiseta, pero el volumen no se ve desde la historia. |
| **S** – Small | 3 | Hay 2 escenarios distintos. Las 2 filas de AC-1 son datos de una sola regla de mapeo. El entregable es el reemplazo de un vocabulario en un skill y sus consumidores directos, aunque el volumen de evals y ejemplos lo deja en el límite superior de "pequeña". |
| **T** – Testeable | 4 | AC-1 se puede automatizar con aserciones `contains` sobre el reporte y el frontmatter. Hay tres puntos débiles: "se aplica igual que con el antiguo needs-changes" (AC-2) es una comparación abierta; la fila `APPROVED` de AC-1 no comprueba la ausencia de `review-status`; y `not_contains: ["approved"]` falla si la comparación no distingue mayúsculas, porque `APPROVED` lo contiene. |

**INVEST_Score = (3 + 4 + 4 + 3 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**E – Estimable (3): corregir el inventario de consumidores.** Hay que quitar la afirmación "`skills/story-implement-tasks/SKILL.md` lee `review-status`", porque es falsa: los dos ejecutores de rework (`story-implement`, que es el principal según `SKILL.md:30`, y `story-implement-tasks`) detectan el modo rework solo por la presencia de `fix-directives.md`. Conviene listar los puntos que sí cambian: los pasos de `SKILL.md` que usan `$REVIEW_STATUS`, la fila `Review status` de `## Resumen` en el template, `README.md:16`, `examples/example-approved/` y los dos `examples/example-needs-changes*/`, los 16 casos de `evals/evals.json`, `skills/story-implement/README.md:21` y el fixture `review-status: needs-changes` de `skills/story-implement/evals/evals.json:1143`.

**I – Independencia (3): coordinar el criterio DoD.** El Paso 4c.1 evalúa `docs/guardrails/dod-story-code-review.md`, cuya l. 25 exige "Review status approved en `code-review-report.md`". La semilla está en `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md:25`. Si el reporte deja de declarar `review-status`, ese criterio puede marcarse como no cumplido. Hay que incluir los dos archivos en el alcance o asignarlos explícitamente a STORY-143, que es dueña de CS-10. Además, hay que publicar `docs/policies/validation-contract-policy.md` (STORY-138) antes o en paralelo, para que el veredicto cite la política.

**T – Testeable (4): precisar AC-2 y la fila APPROVED.** Se propone que AC-2 nombre lo que debe mantenerse, y no "igual que con el antiguo needs-changes". Por ejemplo: `Entonces story.md retrocede a READY-FOR-IMPLEMENT/DONE Y fix-directives.md conserva round, la tabla de hallazgos y la lista blanca`. También conviene mover la negación al `Entonces` de AC-1 para cubrir las dos filas: `Y el frontmatter no declara "review-status"`. Para el valor `approved`, hay que indicar que la comparación distingue mayúsculas, o expresarla como "ningún campo ni sección de veredicto toma el valor `approved`".

**Alcance: subagentes revisores.** Los cuatro `agents/*.agent.md` emiten `status: approved | needs-changes` en sus reportes parciales, y los Non-Goals excluyen cambiarlos. CS-10 exige que no quede el valor de veredicto `approved` "en skills". Hay que aclarar en Fuera de alcance si ese `status` de los reportes parciales queda como vocabulario interno o si lo resuelve STORY-143.

**CNF-1 sin escenario que lo verifique.** Ningún AC comprueba que `$MAX_SEVERITY` y la regla de bloqueo no cambien. Las filas de AC-1 pueden expresar los hallazgos por severidad (`ninguno o solo LOW` → `APPROVED`; `al menos uno HIGH o MEDIUM` → `NEEDS-CHANGES`) para que la regla quede fijada en el propio escenario. También conviene reformular el `Para` en torno a la lectura uniforme por CI y agentes, porque hoy ningún consumidor depende de `review-status`.
