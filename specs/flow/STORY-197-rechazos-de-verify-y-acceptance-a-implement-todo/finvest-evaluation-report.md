---
type: finvest-evaluation
story-id: STORY-197
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que corrige una historia rechazada por la verificación o la aceptación
> **Quiero** que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma
> **Para** que un rechazo después de implementar no sugiera replanificar la historia y sepa con qué comando seguir

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol acotado a los gates posteriores a la revisión, resultado concreto (estado destino y ejecutor nombrado) y beneficio diferenciado del de STORY-189 (no sugerir replanificar y saber cómo seguir). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 escenario alternativo como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Dos bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-1 es Scenario Outline con tabla `Ejemplos` y AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-189, que abre la entrada `IMPLEMENT/TODO` en los ejecutores, y de STORY-186. La escritura de los gates puede desarrollarse y probarse por separado, pero entregarla antes de STORY-189 dejaría historias rechazadas sin ejecutor. |
| **N** – Negociable | 4 | Fija el resultado (estado destino y ejecutor nombrado), no la redacción del resumen ni el cambio por paso. Los puntos de cambio por línea quedan en Notas. |
| **V** – Valiosa | 3 | Valor claro y distinto del de la core (el resumen dice con qué comando seguir), pero cualitativo y sin indicador. |
| **E** – Estimable | 4 | Dos `SKILL.md` con puntos de cambio por línea, más sus README y tres `evals.json`. El cambio es mecánico. |
| **S** – Small | 3 | Tres escenarios contando las dos filas de Ejemplos (rango ideal) y 9 pasos, dos más que el rango. |
| **T** – Testeable | 4 | Estados exactos y Scenario Outline por gate, automatizables con evals. El `Pero` de AC-2 se observa en el resumen del ejecutor. |

**INVEST_Score = (2 + 4 + 3 + 4 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** la dependencia de STORY-189 es de orden, no de diseño. Para que no bloquee, basta con mantener a STORY-197 detrás de STORY-189 en el índice de EPIC-029 y antes de STORY-190, como dicen las Notas.
- **V – Valiosa (3):** para que sea medible, se puede citar el indicador en el `Para`: cero escrituras de `READY-FOR-IMPLEMENT` como destino de `NEEDS-CHANGES` en `skills/story-verify/SKILL.md` y `skills/story-acceptance/SKILL.md`.
- **S – Small (3):** los 9 pasos superan el rango por dos. No conviene recortar más: AC-2 es el caso de transición que STORY-190 retoma después.
- **T – Testeable (4):** en AC-1 se puede fijar el texto exacto de la línea del ejecutor, el mismo formato que `/story-code-review`, para que el eval compare una cadena y no una paráfrasis.
