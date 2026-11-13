---
type: finvest-evaluation
story-id: STORY-190
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que corrige una historia rechazada en ACCEPTANCE
> **Quiero** que `/story-acceptance` con `NEEDS-CHANGES` escriba `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on: acceptance-report.md`, una fila por criterio rechazado y un `round` que continúe las rondas de rework de la historia
> **Para** que un criterio rechazado por el validador llegue al ejecutor como una corrección que exige su test, y se cierre la deuda que registró ADR-0008

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas: rol real, un resultado de un solo gate y un beneficio observable (el criterio rechazado llega al ejecutor y exige su test). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 escenario alternativo como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Dos bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-186, aún sin entregar (ADR-0022 no existe), para la fuente de la ronda anterior y la lista blanca. AC-1 necesita además STORY-197 y STORY-189 para el estado `IMPLEMENT/TODO`. Las dependencias están declaradas en Notas y `related` ya apunta a los slugs vigentes. |
| **N** – Negociable | 4 | Fija los resultados observables (`based-on`, filas, `round`) y deja al ADR y a la planificación la fuente de la ronda y la lista blanca. |
| **V** – Valiosa | 4 | Un rechazo de aceptación deja de perderse: llega al ejecutor con la corrección y el test exigido. Es el SMOKE-4 de la épica. |
| **E** – Estimable | 3 | El contrato actual de `story-code-review` sirve de base, pero toca dos skills, una plantilla nueva con su registro y los evals de ambos skills, y la fuente de la ronda sigue abierta hasta el ADR. |
| **S** – Small | 3 | Dos escenarios con unos 12 pasos y siete CNF; cabe en una entrega, aunque es la parte más grande del split. |
| **T** – Testeable | 4 | AC-1 y AC-2 tienen resultados exactos (`based-on`, `round: 2`, dimensión). AC-2 remite a «la fuente versionada que fija el ADR», que solo es comprobable cuando el ADR exista. |

**INVEST_Score = (2 + 4 + 4 + 3 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** no empezar la planificación hasta que ADR-0022 esté aceptado; en ese momento, sustituir en AC-2 y CNF-2/CNF-3 «la fuente que fija el ADR» por el valor concreto.
- **E – Estimable (3):** al planificar, separar en `tasks.md` la plantilla común (con la no-regresión de `story-code-review`, CNF-5) del escritor de `story-acceptance`, para estimar cada bloque por su cuenta.
- **S – Small (3):** si la planificación muestra que el `round` con varios escritores (CNF-2) pesa más de lo previsto, se puede mover a una historia propia sin romper AC-1.
