---
type: finvest-evaluation
story-id: STORY-120
finvest-score: 4.58
decision: APROBADA
evaluated: 2026-10-08
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`
> **Quiero** ejecutar `/epic-analyze <EPIC-ID>` y obtener un reporte con los desajustes entre la sección "Historias" de `epic.md` y los `story.md` que la declaran como `parent`, junto con un veredicto
> **Para** no aprobar una épica cuyo índice de historias no coincide con lo que realmente existe, sin cruzar a mano cada `story.md` con la épica

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol concreto ante una decisión real (PLAN → READY-FOR-DEV), acción observable y beneficio diferenciado. |
| Criterios de aceptación | 5 | Escenario principal (AC-1), alternativo (AC-2) y de error (AC-3) nombrados como `###`. |
| Escenarios Gherkin | 5 | 3 bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero` y un Scenario Outline con `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✓ Gateway superado — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 5 | Base del split: solo usa artefactos existentes (template de épica v2, `story.md`); STORY-121 y STORY-122 dependen de ella, no al revés. |
| **N** – Negociable | 4 | Fija qué detectar, la severidad y el umbral del veredicto; deja abierto cómo se implementa el análisis. |
| **V** – Valiosa | 4 | Por sí sola ya evita aprobar épicas con historias inexistentes, huérfanas o duplicadas; valor cualitativo, no cuantificado. |
| **E** – Estimable | 4 | Comprobaciones deterministas sobre IDs y `parent`; patrón conocido (`story-analyze`). |
| **S** – Small | 3 | 3 escenarios; el Outline de AC-2 tiene 5 filas, pero son variaciones de la misma regla de integridad más los umbrales del veredicto. Misma banda que STORY-090. |
| **T** – Testeable | 5 | Entonces booleanos: severidad, ID citado, veredicto, archivo escrito o no; datos concretos en `Ejemplos`. |

**INVEST_Score = (5 + 4 + 4 + 4 + 3 + 5) / 6 = 4.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 5 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.58 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

- **S – Small (3):** si en planning el skill base (autoría con `skill-master`, template del reporte y documentación de CNF-8) resulta pesado, la fila de "ID duplicado" es la candidata natural para moverse a una historia aparte; no se recomienda dividir ahora.
