---
type: finvest-evaluation
story-id: {story_id}
finvest-score: {FINVEST_score}
verdict: {APPROVED | NEEDS-REFINEMENT | SPLIT}
evaluated: {YYYY-MM-DD}
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `{verdict}` — {motivo}
<!-- Usar la línea de la primera fila coincidente del Paso 4; retirar este comentario al generar el reporte. -->

## Historia evaluada

> {historia_de_usuario}

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | {F1} | {obs_F1} |
| Criterios de aceptación | {F2} | {obs_F2} |
| Escenarios Gherkin | {F3} | {obs_F3} |

**F_score = ({F1} × 0.4) + ({F2} × 0.3) + ({F3} × 0.3) = {F_score} / 5.0**

{gateway_resultado}

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | {I} | {obs_I} |
| **N** – Negociable | {N} | {obs_N} |
| **V** – Valiosa | {V} | {obs_V} |
| **E** – Estimable | {E} | {obs_E} |
| **S** – Small | {S} | {obs_S} |
| **T** – Testeable | {T} | {obs_T} |

**INVEST_Score = ({I} + {N} + {V} + {E} + {S} + {T}) / 6 = {INVEST_score} / 5.0**

---

## Resultado Final

**F – Formato:** {F_score} / 5.0
**I – Independencia:** {I} / 5
**N – Negociable:** {N} / 5
**V – Valiosa:** {V} / 5
**E – Estimable:** {E} / 5
**S – Small:** {S} / 5
**T – Testeable:** {T} / 5

**FINVEST Score:** {FINVEST_score} / 5.0

---

## Comentarios y Recomendaciones

{comentarios_por_dimension}
