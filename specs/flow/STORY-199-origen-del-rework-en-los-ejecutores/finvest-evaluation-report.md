---
type: finvest-evaluation
story-id: STORY-199
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que retoma una historia rechazada
> **Quiero** que `/story-implement` y `/story-implement-tasks` anuncien qué gate abrió el rework según `based-on` de `fix-directives.md` y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`
> **Para** saber qué gate tengo que volver a pasar y detectar un rework que perdió sus directivas antes de implementar sin ellas

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas; el `Para` nombra dos beneficios concretos, uno por cada comportamiento del `Quiero`. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 escenario alternativo/error como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Dos Scenario Outline en bloques `gherkin` con tabla `Ejemplos`; AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Solo necesita el gate de entrada `IMPLEMENT/TODO` de STORY-189; la lógica del anuncio y del aviso no depende de STORY-190, STORY-198 ni del ADR, y los orígenes se prueban con un `fix-directives.md` de ejemplo. |
| **N** – Negociable | 4 | Fija qué se anuncia y cuándo se avisa, no el texto exacto del mensaje ni dónde se calcula. |
| **V** – Valiosa | 4 | El Solo Builder sabe qué gate volver a pasar y detecta un rework sin directivas antes de implementar a ciegas. |
| **E** – Estimable | 4 | Dos skills con el mismo cambio acotado en su paso de detección de rework, más sus evals. |
| **S** – Small | 2 | Cuatro escenarios contando filas de `Ejemplos` (2 + 2), aunque cada uno es corto (unos 4 pasos). |
| **T** – Testeable | 5 | Ambos escenarios son Scenario Outline con datos concretos (ejecutor, reporte, gate) y resultados booleanos, directamente automatizables en `evals.json`. |

**INVEST_Score = (3 + 4 + 4 + 4 + 2 + 5) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

- **S – Small (2):** las cuatro filas son la misma regla aplicada a los dos ejecutores; no conviene dividir más, porque separar `/story-implement` de `/story-implement-tasks` daría dos historias con el mismo `Para`. Mantener el alcance y no añadir más orígenes a la tabla.
- **I – Independencia (3):** planificar después de STORY-189; anotar en `design.md` el `fix-directives.md` de ejemplo que sustituye a STORY-190 y STORY-198 en las pruebas.
