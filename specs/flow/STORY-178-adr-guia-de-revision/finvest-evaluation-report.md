---
type: finvest-evaluation
story-id: STORY-178
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de agile-sddf que va a implementar las historias de EPIC-28 sobre `REVIEW.md`
> **Quiero** un ADR aceptado que fije dónde vive `REVIEW.md`, qué decide frente a `constitution.md`, el DoD CODE-REVIEW y la plantilla del informe, de dónde se lee y cómo se traducen las severidades de Claude Code Review (Important, Nit, Pre-existing)
> **Para** que las demás historias de la épica implementen una sola decisión y ninguna tenga que reabrir la ubicación, la precedencia, la fuente de lectura o el vocabulario en su `design.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente; rol concreto (mantenedor que implementa EPIC-28), acción concreta (ADR aceptado con cuatro decisiones) y beneficio explícito (una sola decisión, sin reabrirla en cada `design.md`). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 con datos y AC-3 alternativo, todos como subapartados `###` nombrados según el template. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin `, con `Dado/Cuando/Entonces/Y`, un Scenario Outline con tabla `Ejemplos` (AC-2) y un escenario alternativo con `Pero` (AC-3). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de ninguna historia sin entregar: puede empezarse ya. Las demás historias de EPIC-28 dependen de ella, así que el orden no es libre: debe ir primero. |
| **N** – Negociable | 4 | Fija qué debe decidir el ADR, no qué decide: deja abierta la fuente (working tree o rama base) y permite ajustar el vocabulario de AC-2 si se documenta el motivo. |
| **V** – Valiosa | 3 | El valor es real pero interno: evita retrabajo y decisiones contradictorias entre las historias de la épica. No hay un resultado observable para quien usa el framework ni una señal medible. |
| **E** – Estimable | 4 | Entregable acotado (un ADR más una fila en el índice) y las decisiones (a) y (c) ya vienen de la épica. Queda algo de incertidumbre porque la decisión (b) (líneas no tocadas sin `git diff`) puede entrar o no. |
| **S** – Small | 3 | Si se cuentan las filas del Outline, hay 5 instancias y unos 13 pasos, lo que daría S = 2. Pero las tres filas de AC-2 se comprueban en una sola tabla del mismo documento, y todo el trabajo es un archivo más una línea en el índice. En la práctica, la historia es pequeña. |
| **T** – Testeable | 4 | AC-1 se puede comprobar por existencia, estado, secciones y fila en el índice, y AC-2 con una tabla concreta. AC-3 y parte de AC-1 («su decisión fija…») piden revisar el contenido a mano. «HIGH o MEDIUM» no dice qué distingue un caso del otro. |

**INVEST_Score = (4 + 4 + 3 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**V – Valiosa (3):** hacer el beneficio observable. Por ejemplo, cambiar el `Para` por «…para que ningún `design.md` de EPIC-28 vuelva a decidir la ubicación, la precedencia, la fuente de lectura ni el vocabulario: cada uno remite al ADR». También se puede nombrar el valor final para el usuario del framework: un `/story-code-review` cuyo informe usa un solo vocabulario de severidades, sea cual sea el origen del hallazgo.

**S – Small (3):** no hace falta dividirla. Para que no crezca, se puede decidir explícitamente que la decisión (b) (identificar líneas no tocadas sin `git diff`) queda fuera de esta historia y pasarla a «Fuera de alcance», remitiendo a «Hallazgos preexistentes». Así el número de escenarios y el esfuerzo quedan cerrados.

**T – Testeable (4, sugerencia menor):** en AC-2, la fila `🔴 Important → HIGH o MEDIUM` plantea una duda: ¿«una sola traducción» admite dos categorías? Conviene añadir un `Y` que exija que el ADR diga qué criterio separa HIGH de MEDIUM, o bien llevar a una sola categoría.

**E – Estimable (4, sugerencia menor):** la nota sobre la decisión (b) dice «puede incorporarse al ADR o resolverse en el `design.md`». Decidirlo ahora quita la última incertidumbre de la estimación (ver la recomendación de S).

Verificado en el filesystem: `docs/adr/adr-template.md` (estado inicial `PROPOSED`) y `docs/adr/README.md` existen, así que AC-1 se refiere a artefactos reales.
