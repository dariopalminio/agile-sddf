---
type: finvest-evaluation
story-id: STORY-181
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que pasa sus historias por el gate `/story-code-review`
> **Quiero** que un defecto en líneas que la historia no tocó se informe como PREEXISTENTE, sin contar para `max-severity` ni entrar en `fix-directives.md`
> **Para** no pagar rondas de corrección por problemas que la historia no introdujo, sin perder la visibilidad de esos defectos

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol real, acción concreta y beneficio claro; sigue el encabezado `# 📖 Historia:` del template. |
| Criterios de aceptación | 5 | Sección presente con AC-1 (principal), AC-2 y AC-3 (alternativos) como subapartados `###`. |
| Escenarios Gherkin | 5 | 3 escenarios en bloques ` ```gherkin ` con Dado/Y/Cuando/Entonces; AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-178 (el ADR fija cómo identificar las líneas tocadas) y debe implementarse después de STORY-180; ambas siguen en SPECIFY/DONE, no entregadas. AC-3 es simulable, pero AC-1 y AC-2 requieren el método del ADR. |
| **N** – Negociable | 4 | Los criterios describen resultados observables (categoría, `max-severity`, veredicto, `fix-directives.md`) y delegan el cómo al ADR. Las notas citan pasos del SKILL.md como punto de inserción, sin cerrar la solución. |
| **V** – Valiosa | 4 | Evita rondas de corrección por defectos que la historia no introdujo, conservando su visibilidad. Valor cualitativo observable (menos rondas NEEDS-CHANGES); sin métrica cuantitativa. |
| **E** – Estimable | 3 | Los puntos de cambio están localizados (Pasos 4b, 4c, 4c.1, 4e-4f; plantilla del informe; evals), pero el esfuerzo depende del método de detección de líneas tocadas que decida STORY-178 (hoy el skill no usa `git diff`). |
| **S** – Small | 3 | 3 escenarios, uno principal y dos alternativos claros; pasos por escenario dentro de lo razonable. |
| **T** – Testeable | 4 | Gherkin con escenario principal, alternativo y de error (`Pero`); condiciones booleanas verificables en `code-review-report.md`. CNF-3 exige el caso en `evals.json` primero. |

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

**I – Independencia (2):**
- La dependencia de STORY-178 es real y está declarada en `related` y en las notas. Implementar solo cuando STORY-178 esté entregada (ADR aceptado), y después de STORY-180, tal como indican las notas.
- Para desacoplar, redactar AC-1 y AC-2 contra «el método que fija el ADR» (como ya hace AC-3) en lugar de presuponer un mecanismo concreto, de modo que la historia pueda planificarse y diseñarse mientras el ADR madura.

**E – Estimable (3):**
- Añadir en Notas una hipótesis de trabajo del método de detección (p. ej. `git diff` sobre `$IMPL_FILES` frente al commit base) marcada como «sujeta al ADR de STORY-178», para acotar el esfuerzo.
- Si el ADR elige un método costoso (parseo de hunks por archivo), reconsiderar un spike previo.

**S – Small (3):**
- Tamaño adecuado. Vigilar que el trabajo de evals + plantilla + Pasos 4b/4c/4c.1/4e-4f no crezca; si el cálculo de veredicto requiere cambios amplios, valorar un `/story-split` en el momento del diseño.
