---
type: finvest-evaluation
story-id: STORY-177
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que ejecuta `/story-code-review` como gate tras implementar una historia
> **Quiero** que los cuatro revisores dejen sus informes en `.tmp/story-code-review/{story_id}/`, la ruta que lee el orquestador, y que el Security-Reviewer encuentre los checklists de seguridad en `docs/guardrails/`
> **Para** que el veredicto se base en los cuatro informes de la historia revisada y en las reglas de seguridad del proyecto, sin depender de que el agente concilie rutas contradictorias ni de los enlaces de `constitution.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente; rol concreto (Solo Builder que usa el gate), acción observable (ubicación de informes y descubrimiento de checklists) y beneficio claro (veredicto basado en los informes y reglas correctas). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con dos escenarios principales (AC-1, AC-2) y un escenario alternativo (AC-3) nombrados como `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`; AC-3 es alternativo y usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de otra historia sin entregar; la épica admite tramitarla aparte (como `BUG-NN`). Comparte archivos (`agents/*.agent.md`, `SKILL.md`) con otras historias de EPIC-28, lo que condiciona el orden de merge pero no bloquea. |
| **N** – Negociable | 3 | El qué y el por qué están claros, pero la solución queda prefijada: ruta exacta, nombres de archivo y prohibición literal de `docs/policies/*security-checklist*.md` (CNF-1). Es razonable en un fix, aunque deja poco espacio al cómo. |
| **V** – Valiosa | 4 | Corrige un defecto verificado del gate de calidad: hoy el orquestador lee un directorio distinto del que escriben los revisores y el Security-Reviewer busca checklists en una ruta inexistente. El valor es observable (informes en su sitio y fuente de reglas citada), aunque no cuantificado. |
| **E** – Estimable | 4 | Alcance acotado y verificado en el filesystem: 4 agentes + `SKILL.md` + evals nuevos. Sin incógnitas técnicas; el único costo variable es redactar los evals de CNF-2. |
| **S** – Small | 3 | 3 escenarios (rango ideal) pero 13 pasos en total y dos cambios de naturaleza distinta (ruta de informes parciales y descubrimiento de checklists). Cabe en una entrega, con margen ajustado. |
| **T** – Testeable | 4 | Postcondiciones verificables por existencia de archivos y contenido citado, con escenario alternativo y `Pero`. AC-3 no fija qué ocurre si existe el checklist del skill `security-audit` instalado (el agente lo usa antes que el baseline), lo que abre una ambigüedad en el eval. |

**INVEST_Score = (4 + 3 + 4 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**N – Negociable (3):**
- Expresar CNF-1 como resultado y no como texto prohibido: por ejemplo, «el `SKILL.md` y los cuatro agentes declaran una única ruta de informe parcial y una única ubicación de checklists, coherentes entre sí». La verificación de que no queda `docs/policies/` puede pasar a una nota o a un caso de eval.

**S – Small (3):**
- La historia agrupa dos defectos independientes (rutas de informes parciales → AC-1; descubrimiento de checklists → AC-2/AC-3). Si la implementación o los evals crecen, se pueden separar con `/story-split` por el patrón «reglas de negocio / variaciones», dejando AC-1 en una historia y AC-2/AC-3 en otra. Hoy no es necesario para aprobar.

**T – Testeable (4, sugerencia no bloqueante):**
- Precisar la precondición de AC-3: «Dado un proyecto sin archivos `docs/guardrails/gr-*security*` **ni el checklist del skill `security-audit` instalado**», o añadir una fila/escenario que fije la precedencia guardrails → `security-audit` → baseline.
- Detalle gramatical en AC-1: «Dado una historia» → «Dada una historia».
