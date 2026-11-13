---
type: finvest-evaluation
story-id: STORY-195
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que sigue una transición de estado desde el skill hasta su requisito
> **Quiero** que `state-machine.md`, `domain-skills-map.md`, NFR-006 y FR-043/044/045 describan las transiciones sin buffers del ADR, con el `NEEDS-CHANGES` de los tres gates llevando a `IMPLEMENT/TODO`
> **Para** que la máquina de estados, el mapa de skills y el requisito que consulto digan lo mismo que el frontmatter que escribe el skill

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real con una tarea concreta (trazar una transición hasta su requisito), acción acotada a seis documentos y beneficio observable, distinto del de STORY-187. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 escenario alternativo, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-186 de forma desacoplada: `state-machine.md`, `domain-skills-map.md` y NFR-006 se redactan con lo que ya fija EPIC-029, y solo el texto de FR-043/044/045 sobre `fix-directives.md` espera al contrato del ADR. No depende de STORY-187. |
| **N** – Negociable | 4 | La tabla de AC-2 describe la transición que debe encontrarse, no la redacción, y CNF-2 aclara qué no debe entrar en los requisitos sin imponer cómo reescribirlos. |
| **V** – Valiosa | 3 | Valor claro para quien traza una transición hasta su requisito, pero cualitativo y dependiente de que STORY-188 a STORY-190 cambien los skills. |
| **E** – Estimable | 4 | Seis documentos con 17 menciones de buffers contadas por archivo en Notas. Las ediciones en FR-043/044/045 y NFR-006 son puntuales; `state-machine.md` concentra el trabajo. |
| **S** – Small | 2 | Cinco escenarios contando las filas de `Ejemplos` (AC-1, tres filas de AC-2 y AC-3) y 12 pasos. Por la rúbrica es grande, aunque se agruparon FR-043/044/045 en una fila. |
| **T** – Testeable | 4 | AC-3 se comprueba con `grep` y AC-1 tiene un destino exacto (`IMPLEMENT/TODO`). La columna `contenido` de AC-2 y la cita del ADR se verifican leyendo. |

**INVEST_Score = (3 + 4 + 3 + 4 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

- **S – Small (2):** no conviene seguir dividiendo, porque los seis documentos son cambios cortos sobre la misma transición. Para bajar escenarios, la fila de `domain-skills-map.md` puede ir a AC-1 («y el mapa de skills asigna esas transiciones a story-analyze y a los tres gates») y dejar AC-2 solo para requisitos.
- **I – Independencia (3):** planificar FR-043/044/045 después de que STORY-186 fije el contrato de `fix-directives.md`. El resto puede ir antes.
- **V – Valiosa (3):** el resultado de AC-3 (cero coincidencias en los seis documentos) puede citarse en el `Para` como indicador.
