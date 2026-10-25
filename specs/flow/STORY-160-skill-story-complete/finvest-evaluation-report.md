---
type: finvest-evaluation
story-id: STORY-160
finvest-score: 4.25
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.25 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que terminó de desarrollar una historia con SDD flow-forward
> **Quiero** archivarla con `/story-complete STORY-NNN` para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/`
> **Para** dejar `specs/flow/` solo con el trabajo activo y conservar la historia como registro histórico, con su historial de git intacto

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` idéntico al template; rol real, acción concreta y beneficio claro (carpeta de trabajo activo limpia + historial git intacto). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 y AC-3 de error y AC-4 de dominio, todos como subapartados `###`. |
| Escenarios Gherkin | 5 | 4 escenarios en bloques ` ```gherkin ` con Dado/Y/Cuando/Entonces; AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Declara dependencia de STORY-159 (`story-delivery`) y AC-2 remite a `/story-delivery`; es desacoplable con fixtures en `DELIVER/DONE`. |
| **N** – Negociable | 4 | Describe resultados y deja abierto el diseño (CNF-3, pendiente sobre historia no versionada); fija `git mv` y rutas, que provienen de ADR-0016. |
| **V** – Valiosa | 4 | Valor cualitativo claro para el Solo Builder (workspace limpio, trazabilidad histórica); sin métrica cuantitativa. |
| **E** – Estimable | 4 | Existe `scripts/migrate-specs-to-flow.js` como referencia; solo la decisión pendiente sobre directorio no versionado agrega incertidumbre menor. |
| **S** – Small | 2 | 4 escenarios y ~25 pasos entre skill, errores y documentación de dos dominios; al límite superior de lo manejable en una sola entrega. |
| **T** – Testeable | 4 | Gherkin con camino feliz y dos errores, resultados verificables en filesystem y frontmatter; AC-4 verificable por inspección/grep de docs. |

**INVEST_Score = (3 + 4 + 4 + 4 + 2 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (3)
- Fijar en `## 📎 Notas` que STORY-160 se prueba con historias fixture en `DELIVER/DONE` (sin requerir que STORY-159 esté entregada), y que la única referencia a `/story-delivery` es el texto del mensaje de AC-2.

### S – Small (2)
- Evaluar mover AC-4 (documentación de `domain-state-management.md` y `domain-story-lifecycle.md`) a una tarea del plan o a una historia hermana de documentación, dejando AC-1..AC-3 como núcleo del skill (3 escenarios, dimensión S = 3).
- Si se mantiene junta, vigilar en `/story-design` que las tareas del skill y de documentación sean independientes para poder entregarlas por separado.

### Observaciones adicionales (dimensiones > 3)
- Resolver la nota «Pendiente de refinar» (directorio no versionado → fallar cerrado o movimiento simple) antes de `/story-plan`; mi recomendación es fallar cerrado y cubrirlo con un escenario de error, lo que reforzaría E y T.
- AC-1 y CNF-3 conviene coordinarlos: definir si `story.md` se escribe antes o después de `git mv` para que la atomicidad sea verificable por un caso de prueba.
