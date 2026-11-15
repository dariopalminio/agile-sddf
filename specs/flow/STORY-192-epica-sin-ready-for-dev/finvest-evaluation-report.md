---
type: finvest-evaluation
story-id: STORY-192
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que planifica, refina y analiza una épica antes de que el PO la apruebe
> **Quiero** que los skills de épica dejen de nombrar los estados buffer y que `/epic-analyze` acepte, con un aviso, una historia hija que conserva el valor legado `READY-FOR-IMPLEMENT`
> **Para** que `/epic-analyze` me indique el paso real de aprobación (`PLAN/DONE`, editado a mano) y no marque como no clasificables las historias planificadas antes de 6.0.0

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas. El rol es real, el `Quiero` expresa el resultado sin ubicaciones y el `Para` dice el beneficio que el usuario ve en el reporte. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario alternativo y AC-3 escenario con datos, como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`; AC-2 y AC-3 son Scenario Outline con tabla `Ejemplos` y AC-1 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Declara las dos dependencias y cómo se desacoplan. STORY-186 (`SPECIFY/DONE`) solo aporta la cita del ADR, y el trabajo puede empezar antes. STORY-187 comparte el orden de estados de `domain-story-lifecycle`, y las dos tienen que terminar con el mismo. No bloquea, pero hay que coordinarlas. |
| **N** – Negociable | 4 | El `Quiero` dice qué se quiere y para qué. Las líneas quedan en Notas como evidencia, y el diseño de `/epic-refine` ante el valor legado queda abierto. La nota sin peso está fijada por decisión del usuario, que queda registrada. |
| **V** – Valiosa | 4 | El beneficio se ve en el reporte: el paso de aprobación correcto y ninguna historia legada marcada como no clasificable. Es cualitativo, pero se puede comprobar en cada ejecución. |
| **E** – Estimable | 4 | Puntos de cambio localizados con líneas en los tres skills y en `README.md`, más un eval nuevo en `epic-analyze`. Queda una decisión de diseño acotada en `/epic-refine`. |
| **S** – Small | 2 | Cinco casos (AC-1 más 2 + 2 filas de Ejemplos) y unos 12 pasos sobre tres skills. Se quitaron las filas de regresión, pero el número sigue en el rango 4–5. El cambio es de texto y cohesivo (los mismos estados en los skills de épica), así que dividirla no aportaría valor por separado. |
| **T** – Testeable | 5 | Clasificaciones exactas (`lista`, `no-clasificable`), códigos MAD presentes o ausentes, la línea literal `Madurez de historias hijas: 3/3`, la nota que no cuenta para el veredicto y la línea `Replanifica:`. Todo se automatiza con evals. CNF-1 se comprueba con `grep`. |

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

- **I – Independencia (3):** al planificar, empezar por el eval del valor legado (CNF-3) y por el orden de madurez de `SKILL.md:236`. Comparar ese orden con el borrador de STORY-187 antes de dar por cerrado el diseño.
- **S – Small (2):** no hace falta dividirla: los cinco casos son la misma regla aplicada en dos skills. Si en `/story-plan` las tareas de `/epic-refine` y `/epic-generate-all-stories` crecen por la decisión del valor legado, separarlas en una historia propia.
- **T – Testeable (5), observación menor:** `epic-generate-all-stories` y `epic-analyze/README.md` solo los cubre CNF-1 (`grep`), no un AC. Alcanza para un cambio de texto. Conviene nombrarlos en el caso de prueba de CNF-1 en `testcases.md`.
