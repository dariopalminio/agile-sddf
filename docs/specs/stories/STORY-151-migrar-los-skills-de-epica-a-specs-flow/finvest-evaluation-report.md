---
type: finvest-evaluation
story-id: STORY-151
finvest-score: 4.00
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.00 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** practitioner que crea y analiza épicas con SDDF
> **Quiero** que `epic-creation`, `epic-format-validation`, `epic-from-project-plan`, `epic-generate-stories`, `epic-generate-all-stories` y `epic-analyze` lean y escriban en `specs/flow/EPIC-NN-<slug>/` sin usar `SPECS_BASE`
> **Para** gestionar épicas en el layout fijo y que el análisis de una épica encuentre también sus historias archivadas

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente (igual que el template) con las tres cláusulas completas; rol real, acción concreta y beneficio verificable. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 y AC-2 principales y AC-3 y AC-4 alternativo/error, como subapartados nombrados. |
| Escenarios Gherkin | 5 | 4 escenarios en bloques ` ```gherkin ` con Dado/Cuando/Entonces/Y y `Pero` en AC-3. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Declara dependencia de STORY-148 (contrato de rutas fijas), aún sin entregar; AC-1 además presupone que `/sddf-init` ya crea el layout nuevo (STORY-149). Es simulable con un repo fixture, pero no es independiente. |
| **N** – Negociable | 3 | Tiene el qué y el por qué, pero fija rutas y nombra los seis skills; el cómo de la migración queda abierto. |
| **V** – Valiosa | 3 | Valor claro para quien gestiona épicas (layout único, historias archivadas contadas), pero cualitativo y sin métrica. |
| **E** – Estimable | 4 | Migración acotada a seis skills con patrón repetible y verificación por grep (AC-4); estimable por quien conozca el repo. |
| **S** – Small | 2 | 4 escenarios Gherkin y seis skills con sus evals: tamaño «Grande» en la rúbrica, aunque sin llegar a ≥ 6 escenarios. |
| **T** – Testeable | 4 | Escenario principal y alternativos bien formados; AC-4 es un grep booleano automatizable, AC-1 a AC-3 verificables con repos fixture. |

**INVEST_Score = (2 + 3 + 3 + 4 + 2 + 4) / 6 = 3.00 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.00 / 5.0

---

## Comentarios y Recomendaciones

- **I (2):** documenta explícitamente en «Notas» que STORY-148 (y la parte de `/sddf-init` de STORY-149 que usa AC-1) deben entregarse antes, o reescribe AC-1 para partir de un repo fixture con `specs/flow/` ya creado, de modo que la historia pueda probarse sin STORY-149.
- **N (3):** formula las rutas por referencia al contrato de STORY-148 (no repetirlas literalmente en cada AC) para dejar abierto el cómo se resuelven internamente.
- **V (3):** añade una señal observable del beneficio, p. ej. «0 coincidencias de `SPECS_BASE|SDDF_ROOT` en `skills/epic-*` y 0 historias archivadas reportadas como huérfanas».
- **S (2):** es aprobable, pero conviene vigilar el tamaño en PLAN: seis skills y cuatro escenarios. Si el plan supera lo manejable en una iteración, separar `epic-analyze` (AC-3, lógica de archivo) del resto de los skills.
