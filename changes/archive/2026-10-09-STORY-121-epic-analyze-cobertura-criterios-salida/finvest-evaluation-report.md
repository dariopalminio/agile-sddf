---
type: finvest-evaluation
story-id: STORY-121
finvest-score: 4.17
decision: APROBADA
evaluated: 2026-10-08
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`
> **Quiero** que `/epic-analyze <EPIC-ID>` muestre qué historia cubre cada criterio de salida y cada smoke test de la épica, y señale los que nadie cubre
> **Para** saber antes de desarrollar si terminar todas las historias realmente cumple el contrato de "épica terminada", en lugar de descubrir el hueco en `VALIDATE`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Beneficio diferenciado del de STORY-120: anticipa en `PLAN` un hueco que si no aparecería en `VALIDATE`. |
| Criterios de aceptación | 5 | Escenario principal (AC-1) y alternativo/error (AC-2) nombrados. |
| Escenarios Gherkin | 5 | 2 bloques ` ```gherkin ` con `Y`; AC-2 es Scenario Outline con `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✓ Gateway superado — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Amplía el skill `epic-analyze` que crea STORY-120; puede especificarse y diseñarse en paralelo, pero no implementarse antes. |
| **N** – Negociable | 4 | Exige evidencia de cobertura (CNF-1) sin prescribir cómo se determina. |
| **V** – Valiosa | 4 | Detecta en `PLAN` criterios de salida que ninguna historia cumplirá: evita rework en `VALIDATE`. |
| **E** – Estimable | 3 | La cobertura de criterios en lenguaje natural es un juicio; CNF-1 lo acota, pero deja incertidumbre sobre falsos positivos. |
| **S** – Small | 3 | 2 escenarios; el Outline tiene 4 filas de una sola regla (contrato de salida). |
| **T** – Testeable | 4 | Los casos sin cobertura y las secciones ausentes son verificables; la asociación correcta en AC-1 depende de fixtures bien construidos. |

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
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** planificarla después de STORY-120 y declarar esa secuencia al ubicarla en la sección "Historias" de EPIC-19.
- **E – Estimable (3):** en `story-design`, fijar la regla de evidencia (mención explícita vs. AC que verifica) con un ejemplo positivo y uno negativo para acotar el juicio.
- **S – Small (3):** sin acción; la tabla agrupa variaciones de una misma regla.
