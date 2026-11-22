---
type: finvest-evaluation
story-id: STORY-165
finvest-score: 4.42
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.42 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder y Product Owner
> **Quiero** que `/epic-refine EPIC-NN` corrija en `epic.md` y en los `story.md` los hallazgos de índice de historias y de enlaces `related` que reporta `epic-analyze-report.md`, mostrando antes el plan de cambios
> **Para** no corregir a mano el índice ni los enlaces rotos de una épica cada vez que `epic-analyze` los detecta, y poder volver a analizarla sin esos hallazgos.

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` como en el template; rol real, acción concreta y acotada (índice y `related`) y beneficio observable (re-analizar sin esos hallazgos). El `Para` ya no mezcla restricciones. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 de cierre y AC-3 alternativo como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`; AC-3 usa `Pero`. Cada bloque contiene un solo escenario. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Consume `epic-analyze-report.md`, producido por `epic-analyze`, que ya existe. STORY-173 y STORY-174 dependen de esta historia, no al revés. |
| **N** – Negociable | 4 | Los AC describen resultados observables (línea en el índice, `related` sin la entrada rota, backups, estados intactos); la ejecución secuencial sin subagentes quedó como propuesta no vinculante en `📎 Notas`. |
| **V** – Valiosa | 4 | Valor claro y observable: elimina la corrección manual del índice y de `related`, y cierra el bucle `epic-analyze` → corrección → re-análisis. Sin métrica cuantitativa. |
| **E** – Estimable | 4 | Catálogo cerrado de hallazgos (INT-02, INT-03, MAD-02 automáticos; el resto al PO) verificado contra `skills/epic-analyze/SKILL.md`; existe un patrón análogo (`story-fix-plan`). Queda algo de incertidumbre por la idempotencia y los dos modos. |
| **S** – Small | 3 | 3 escenarios (señal primaria: pequeña), pero 16 pasos en total y AC-1 concentra 7, con cinco `Y`. Además entrega un skill nuevo con `evals/evals.json` y su alta en `package.json`. |
| **T** – Testeable | 4 | AC-1 y AC-3 tienen aserciones concretas sobre archivos y contenido; AC-2 verifica que no se crea ni modifica ningún archivo. El mensaje de AC-2 no es literal y no hay Scenario Outline. |

**INVEST_Score = (4 + 4 + 4 + 4 + 3 + 4) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.42 / 5.0

---

## Comentarios y Recomendaciones

**S – Small (3):**
- No requiere un nuevo split: tras `/story-split` la historia quedó en 3 escenarios y un catálogo acotado. Para reducir la densidad de AC-1, se puede mover la aserción de backups (`epic.md.bak`, `story.md.bak`) a un escenario propio o dejarla cubierta solo por CNF-1 y un caso de prueba en `story-testcases`.
- Mantener INT-03 (dejar una sola línea) fuera de los AC no impide implementarlo, pero conviene que `story-testcases` le asigne un caso explícito, ya que figura como corrección automática en `📎 Notas` y ningún escenario lo ejercita.

**Mejoras opcionales (dimensiones con score 4):**
- **T:** fijar en AC-2 el texto literal del mensaje (p. ej. «La épica EPIC-30 no necesita refinamiento») para que la aserción sea exacta.
- **E:** precisar en `📎 Notas` cómo decide el skill entre línea F2 y F3 al añadir una huérfana (INT-02), ya que AC-1 asume F2.
