---
type: finvest-evaluation
story-id: STORY-198
finvest-score: 4.25
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.25 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que corrige una historia rechazada en VERIFY
> **Quiero** que `/story-verify` con `NEEDS-CHANGES` escriba `fix-directives.md` desde la plantilla común, con `based-on: verify-report.md` y una fila por cada defecto CRITICAL o HIGH abierto y por cada criterio del DoD VERIFY fallido
> **Para** que el ejecutor reciba qué tests o criterios fallaron y los corrija sin tener que leer `verify-report.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas con rol real, resultado concreto de un solo gate y beneficio distinto del `Quiero`. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 escenario con datos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Dos bloques `gherkin`; AC-1 usa `Y` y `Pero`, y AC-2 es Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | El nombre de la dimensión de verify (AC-2) y la fuente de la ronda (CNF-2) los fija STORY-186, aún no entregada. AC-1 necesita además STORY-197 y STORY-189. La dependencia de STORY-190 por la plantilla es blanda: la nota permite crearla si se implementa antes. |
| **N** – Negociable | 4 | Define qué hallazgos entran y su efecto en el ejecutor, sin fijar cómo los extrae `story-verify` de su reporte. |
| **V** – Valiosa | 4 | El ejecutor sabe qué falló en VERIFY sin interpretar un formato de reporte distinto. |
| **E** – Estimable | 4 | Un solo skill y su `evals.json`, con la plantilla y la regla de `round` ya resueltas en STORY-190; la única incógnita es un nombre de dimensión. |
| **S** – Small | 3 | Tres escenarios (AC-1 + dos filas de `Ejemplos`) y unos 9 pasos. |
| **T** – Testeable | 4 | Filas contables por caso y un `Pero` comprobable (no se exige un test nuevo). La dimensión exacta solo es verificable cuando exista el ADR. |

**INVEST_Score = (2 + 4 + 4 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** planificar después de que ADR-0022 esté aceptado y sustituir en AC-2 «la dimensión de verify que nombra el ADR» por su nombre concreto. Si STORY-190 aún no está entregada, `design.md` debe decidir explícitamente si esta historia crea la plantilla común.
- **S – Small (3):** sin acción; tamaño adecuado.
