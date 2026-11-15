---
type: finvest-evaluation
story-id: STORY-186
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de agile-sddf que va a implementar las historias de EPIC-029
> **Quiero** un ADR aceptado que reemplace a ADR-0006 y ADR-0008 y fije los workflows sin buffers, `PLAN/DONE` como salida aprobada de la planificación de historia y de épica, el rework en `IMPLEMENT/TODO` sin estado ni substatus propios, el contrato de `fix-directives.md` con tres escritores y la ventana de compatibilidad de `READY-FOR-IMPLEMENT/DONE`
> **Para** que las demás historias de la épica implementen una sola decisión y ninguna tenga que reabrir el destino del rework, el contrato de directivas o la regla del valor legado en su `design.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` del template y las tres cláusulas completas: rol real (mantenedor que implementa la épica), acción concreta (un ADR aceptado con contenido delimitado) y beneficio verificable (ninguna historia reabre las decisiones). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 escenario alternativo, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Es la primera historia de la épica y no depende de ninguna historia sin entregar: parte de ADR-0006, ADR-0008 y la propuesta, que ya existen. Las demás dependen de ella, no al revés. Solo comparte `docs/adr/README.md` con otros trabajos de ADR. |
| **N** – Negociable | 4 | Fija qué decisiones debe recoger el ADR (heredadas de la épica) y deja abiertas, a propósito, las cuatro «Decisiones para el ADR» (CNF-1): duración de la ventana, fuente de la ronda anterior, nombre de la dimensión de verify y lista blanca de acceptance. |
| **V** – Valiosa | 2 | Valor indirecto: es una historia habilitadora (`kind: chore`) cuyo beneficio es la coherencia de las otras ocho historias. Para el Solo Builder que usa el framework, el valor llega cuando esas historias se entregan. |
| **E** – Estimable | 4 | Un documento con estructura conocida (`docs/adr/adr-template.md`), dos cambios de frontmatter y una fila del índice. La propuesta y las notas de la épica dan el contenido; la incertidumbre se limita a las cuatro decisiones abiertas. |
| **S** – Small | 2 | Cinco escenarios contando las filas de `Ejemplos` (AC-1, tres filas de AC-2 y AC-3) y 18 pasos. Por la rúbrica es grande, aunque el entregable es un solo documento. |
| **T** – Testeable | 4 | Los resultados son observables: existencia del archivo, `status: ACCEPTED`, `SUPERSEDED` y `superseded-by` en dos ADR, la fila del índice y textos de workflow que se comprueban con `grep`. AC-2 y AC-3 («se consulta qué ocurre…») se verifican leyendo el ADR, no con un comando. |

**INVEST_Score = (4 + 4 + 2 + 4 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 2 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

- **V – Valiosa (2):** hacer explícito en el `Para` un resultado observable, por ejemplo: «para que los `design.md` de STORY-187 a STORY-194 citen el ADR en lugar de decidir el destino del rework, el contrato de directivas o la regla del valor legado». También se puede añadir en Notas el beneficio que llega a los proyectos consumidores: una regla documentada para migrar sus status legados.
- **S – Small (2):** el tamaño viene de la cantidad de pasos `Y` de AC-1 (cinco resultados) y de la tabla de AC-2. No conviene dividir: un ADR a medias no permite que las demás historias empiecen. Para reducir pasos, AC-1 puede agrupar los cambios de ADR-0006/ADR-0008 y del índice en un solo `Y` («y el índice y los ADR reemplazados reflejan el reemplazo»), y dejar el detalle en CNF-3.
- **T – Testeable (4):** para que AC-2 y AC-3 sean comprobables sin interpretar, el `Cuando` puede nombrar la sección del ADR que se lee (p. ej. «Cuando se lee la sección de decisión del ADR»).
