---
type: finvest-evaluation
story-id: STORY-175
finvest-score: 4.13
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.13 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que mantiene Agile-SDDF
> **Quiero** que un ADR nuevo admita épicas cerradas en `specs/flow/archive/` y que los documentos de autoridad reconozcan a `epic-complete` como escritor de `COMPLETED` de épica
> **Para** que `/epic-complete` pueda archivar una épica sin contradecir una regla aceptada, y que los skills de épica sigan numerando y resolviendo épicas sin reutilizar números de épicas archivadas

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Encabezado `# 📖 Historia` presente y rol real. El `Quiero` agrupa dos entregables (ADR nuevo + reconocimiento de `epic-complete` como escritor) y el `Para` agrupa dos beneficios: la cláusula es correcta pero compuesta. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 y AC-2 como escenarios principales y AC-3 como escenario alternativo, todos nombrados con `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`; AC-3 es un Scenario Outline con tabla `Ejemplos`. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de historias pendientes: es prerrequisito de STORY-171 y STORY-172, no al revés. La única coordinación es con STORY-170 por el orden de edición de `domain-epic-lifecycle` y `domain-state-management`, y no la bloquea. |
| **N** – Negociable | 4 | Los AC describen resultados (ADR reemplazado, documentos coherentes, numeración sin reutilizar) y dejan abierta la redacción del ADR. La tabla de notas con líneas exactas es prescriptiva, pero sirve para acotar el alcance, no para imponer una solución. |
| **V** – Valiosa | 4 | El valor es claro y observable: desbloquea `/epic-complete` sin violar un ADR aceptado y evita colisiones de ID de épica para cualquier usuario del framework. No tiene una métrica cuantitativa. |
| **E** – Estimable | 4 | El alcance está cerrado y verificado: la búsqueda de «no se archivan» confirma las cinco ocurrencias activas citadas (`epic-analyze:103`, `epic-creation:136`, `root-folder-practices.md:34`, `organization-of-artifacts.md:53` y ADR-0016, que es inmutable). El procedimiento de reemplazo de ADR ya está documentado en `docs/adr/README.md`. |
| **S** – Small | 2 | Cuatro escenarios contando las filas del Outline (AC-1, AC-2 y AC-3 ×2) y unos 14 pasos. Toca alrededor de diez documentos de gobierno, además del comportamiento de dos skills (`epic-creation` y `epic-from-project-plan`) y la resolución de `epic-analyze`. |
| **T** – Testeable | 4 | AC-1 se puede verificar de forma exacta (status, `superseded-by`, fila del índice). AC-3 tiene datos concretos y se puede automatizar con evals. AC-2 combina una comprobación por búsqueda con una afirmación semántica («documentan que…»), y por eso necesita revisión humana. |

**INVEST_Score = (4 + 4 + 4 + 4 + 2 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.13 / 5.0

---

## Comentarios y Recomendaciones

**S – Small (2):** la historia mezcla dos tipos de cambio: gobierno documental (AC-1 y AC-2) y comportamiento de skills (AC-3, más la resolución de `epic-analyze`). No hace falta dividirla, porque el veredicto es `APPROVED` y STORY-175 ya surgió de un split. Aun así, conviene tener en cuenta lo siguiente:
- Si al planificarla el esfuerzo crece, el corte natural es separar AC-3 (numeración que cuenta las archivadas, con sus evals) en una historia hermana que dependa del ADR.
- Hoy el comportamiento de `epic-analyze` ante una épica archivada («fijar el comportamiento», según la tabla de notas) no tiene un escenario que lo verifique. Agrega un caso a AC-2 o a AC-3, o declara explícitamente que queda a criterio del diseño. Así el alcance no crece sin un AC que lo respalde.

**Observaciones menores (dimensiones > 3):**
- **F1:** si prefieres un `Quiero` de una sola acción, puedes reformularlo como «Quiero que el layout fijo admita épicas archivadas, con `epic-complete` como su escritor de `COMPLETED`», y dejar el mecanismo (ADR nuevo) en los AC.
- **T:** en AC-2 conviene fijar la comprobación de «ningún documento activo afirma…» con una búsqueda concreta (p. ej. `grep -r "no se archivan" AGENTS.md docs/ skills/` excluyendo `docs/adr/`), para que el escenario se pueda verificar sin interpretación.
- **Notas:** la tabla cita `skills/epic-from-project-plan/SKILL.md:55` por `$MAX_EPIC`, no por la frase «no se archivan». Es correcto, pero conviene mantenerlo explícito para que la búsqueda de AC-2 no parezca la única fuente de alcance.
