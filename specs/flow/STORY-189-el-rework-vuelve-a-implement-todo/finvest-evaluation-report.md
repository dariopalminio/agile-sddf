---
type: finvest-evaluation
story-id: STORY-189
finvest-score: 4.02
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.02 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que corrige una historia rechazada por la revisión de código, la verificación o la aceptación
> **Quiero** que `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma, y que `/story-implement` y `/story-implement-tasks` acepten ese estado, con el modo rework activado, como hoy, solo por `fix-directives.md`
> **Para** que el rework se vea en el frontmatter, que un rechazo después de implementar no sugiera replanificar la historia y que sepa con qué comando seguir

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real (quien corrige un rechazo), resultado acotado (destino del rechazo, ejecutor nombrado y entrada aceptada) y beneficio observable (rework visible, sin sugerir replanificar, siguiente comando conocido). |
| Criterios de aceptación | 4 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 y AC-3 como escenarios con datos, en subapartados `###`. Ninguno se nombra como escenario alternativo o de error, aunque la fila 2 de AC-3 (sin `fix-directives.md`) cumple ese papel. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 y AC-3 son Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (4 × 0.3) + (5 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-186 (ADR), aún sin entregar, aunque `IMPLEMENT/TODO` ya está fijado en EPIC-029. Comparte los gates de entrada de los ejecutores con STORY-188 y STORY-191, y la frontera con STORY-190 está trazada (fila 2 de AC-3 vale antes y después de ella). Las Notas fijan el orden interno para no dejar historias rechazadas sin ejecutor. Al absorber STORY-197 (`CANCELED/DONE`, `parent: null`) desaparece esa dependencia. |
| **N** – Negociable | 4 | El `Quiero` fija resultados (estado destino, ejecutor nombrado, entrada aceptada y disparador del modo rework), no el cambio por skill. Los puntos de cambio por línea quedan en Notas; CNF-2 y CNF-4 acotan lo que no cambia en lugar de prescribir cómo hacerlo. |
| **V** – Valiosa | 3 | Valor claro para quien corrige un rechazo (el estado dice «implementar», no «planificar», y el resumen dice qué ejecutar), pero cualitativo y sin indicador. |
| **E** – Estimable | 4 | Cinco `SKILL.md` con puntos de cambio por línea (comprobados: todas las líneas citadas de `story-code-review`, `story-verify`, `story-acceptance`, `story-implement` y `story-implement-tasks` mencionan `READY-FOR-IMPLEMENT` o el destino del rechazo), más sus README y cinco `evals.json`. |
| **S** – Small | 2 | Cinco casos (AC-1, 2 filas de AC-2 y 2 de AC-3) y unos 15 pasos sobre cinco skills. Las filas de AC-2 son la misma regla en dos gates, lo que contiene el tamaño, pero el número de casos queda en el rango 4–5 y los pasos lo superan. |
| **T** – Testeable | 4 | Estados exactos, ejecutores nombrados y dos Scenario Outline con datos, automatizables con evals (CNF-1). El `Cuando` de AC-1 encadena dos comandos (code-review y luego implement), lo que obliga a un eval de dos invocaciones, y la fila 2 de AC-3 es una aserción negativa sobre el texto del resumen. |

**INVEST_Score = (3 + 4 + 3 + 4 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.02 / 5.0

---

## Comentarios y Recomendaciones

- **Margen del veredicto:** la aprobación queda 0.02 por encima del umbral. El cambio de formato más barato es renombrar AC-3 como «Escenario alternativo – Solo fix-directives.md activa el modo rework», que sube el componente de criterios a 5 y el FINVEST a 4.17.
- **I – Independencia (3):** implementar seguidas STORY-188 y STORY-189 para editar una sola vez la lista de entradas de los ejecutores (`PLAN/DONE`, `IMPLEMENT/TODO` y `READY-FOR-IMPLEMENT/DONE` durante la ventana de STORY-191), respetando el orden interno de las Notas: primero los ejecutores aceptan `IMPLEMENT/TODO`, después los gates lo escriben.
- **V – Valiosa (3):** el `Para` podría citar un indicador observable, por ejemplo «los tres resúmenes de `NEEDS-CHANGES` nombran el ejecutor» (hoy verify y acceptance no lo hacen, según las Notas).
- **S – Small (2):** para bajar pasos sin añadir casos, AC-1 puede terminar en el resumen de `/story-code-review` y AC-3 puede llevar el ejecutor como columna: la fila 1 con `/story-implement` y `fix-directives.md`, la fila 2 con `/story-implement-tasks` sin él. Así se mantiene la cobertura de los dos ejecutores con cinco casos y unos 12 pasos. Si en planning crece el volumen, el corte natural vuelve a ser verify y acceptance (la antigua STORY-197).
- **Higiene del directorio:** queda `story.md.bak` junto a `story.md`. Conviene retirarlo antes del planning si ya no hace falta.
