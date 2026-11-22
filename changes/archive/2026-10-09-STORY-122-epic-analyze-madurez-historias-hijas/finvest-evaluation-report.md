---
type: finvest-evaluation
story-id: STORY-122
finvest-score: 4.33
decision: APROBADA
evaluated: 2026-10-08
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`
> **Quiero** que `/epic-analyze <EPIC-ID>` me advierta de las historias hijas que aún no terminaron su especificación o que referencian historias inexistentes
> **Para** no comprometer capacidad de desarrollo con historias que todavía no están listas para planificarse

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol, acción y beneficio claros y diferenciados de STORY-120 y STORY-121. |
| Criterios de aceptación | 5 | Escenario principal (AC-1) y alternativo (AC-2) nombrados. |
| Escenarios Gherkin | 5 | 2 bloques ` ```gherkin ` con `Y`; AC-2 es Scenario Outline con `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✓ Gateway superado — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Amplía el skill `epic-analyze` de STORY-120; independiente de STORY-121. |
| **N** – Negociable | 4 | Define el umbral de madurez (CNF-1) sin prescribir la implementación. |
| **V** – Valiosa | 3 | Valor real pero modesto: los estados y `related` rotos son visibles con otros medios; aquí se consolidan en el reporte de la épica. |
| **E** – Estimable | 4 | Lectura de frontmatter y resolución de IDs; orden de estados ya documentado en `domain-story-lifecycle.md`. |
| **S** – Small | 4 | 2 escenarios; Outline de 2 filas. |
| **T** – Testeable | 5 | Hallazgos, elementos citados y acciones sugeridas son comprobables exactamente. |

**INVEST_Score = (2 + 4 + 3 + 4 + 4 + 5) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 4 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.33 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** planificarla después de STORY-120; puede ir antes o después de STORY-121.
- **V – Valiosa (3):** si al priorizar EPIC-19 compite con otras historias, es la candidata a posponer; su valor crece cuando la épica tiene muchas historias hijas.
