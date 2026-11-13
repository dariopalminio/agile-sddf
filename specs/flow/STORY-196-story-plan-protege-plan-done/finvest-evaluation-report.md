---
type: finvest-evaluation
story-id: STORY-196
finvest-score: 4.42
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.42 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que planifica una historia con `/story-plan`
> **Quiero** que `/story-plan`, al llegar al resumen, devuelva a `PLAN/IN-PROGRESS` una historia que encuentre en `PLAN/DONE` sin un `analyze.md` con `verdict: APPROVED`, y me avise
> **Para** que ninguna historia llegue a los ejecutores con la planificación cerrada sin un análisis aprobado

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real, comportamiento observable de la guardia y beneficio distinto del de STORY-188 (proteger la entrada de los ejecutores). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 escenario de error como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Dos bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 es Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | La guardia no depende de STORY-188, porque `PLAN/DONE` ya lo declara el DoD de PLAN. Solo el orden de los textos descriptivos de `story-plan` sugiere ir después de STORY-188, y las Notas lo dicen. |
| **N** – Negociable | 4 | Fija el resultado (estado final y aviso) sin decidir el texto del aviso ni cómo se lee `analyze.md`. |
| **V** – Valiosa | 3 | Valor claro (impide que una historia mal cerrada llegue a los ejecutores), pero defensivo y cualitativo. |
| **E** – Estimable | 4 | Un solo `SKILL.md` con puntos de cambio por línea, más su README, `assets/README.md`, un ejemplo y su `evals.json`. |
| **S** – Small | 3 | Tres escenarios contando las filas de Ejemplos (rango ideal) y 9 pasos, dos más de lo que corresponde a ese rango. |
| **T** – Testeable | 5 | Estados exactos, presencia o ausencia del aviso y Scenario Outline con los dos casos de fallo, todo automatizable con evals. |

**INVEST_Score = (4 + 4 + 3 + 4 + 3 + 5) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.42 / 5.0

---

## Comentarios y Recomendaciones

- **V – Valiosa (3):** el valor se puede hacer visible en el resumen de `/story-plan`: el aviso de restauración dice al usuario qué falta (un `analyze.md` con `APPROVED`) y qué ejecutar después (`/story-analyze`).
- **S – Small (3):** AC-2 tiene dos `Y`. Si se quiere bajar pasos, la condición sobre `analyze.md` puede ir en el mismo `Dado`, sin perder el Outline.
