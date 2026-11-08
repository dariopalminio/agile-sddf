---
type: finvest-evaluation
story-id: STORY-180
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que revisa sus historias con `/story-code-review`
> **Quiero** que el skill lea `REVIEW.md` cuando existe, lo pase a los cuatro revisores y al árbitro y me avise si la historia modifica `REVIEW.md` o el DoD CODE-REVIEW
> **Para** calibrar la revisión de cada proyecto sin editar los agentes del skill, y que los agentes dejen de juzgar con reglas propias de agile-sddf en proyectos que no son agile-sddf

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol real (Solo Builder), acción concreta y beneficio claro; sigue el encabezado `# 📖 Historia` del template. |
| Criterios de aceptación | 5 | Sección presente con AC-1..AC-5 como subapartados `###`; dos escenarios principales y tres alternativos nombrados. |
| Escenarios Gherkin | 5 | Cinco escenarios en bloques ` ```gherkin ` con Dado/Y/Cuando/Entonces y `Pero` en AC-3 y AC-5. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | AC-1, AC-2 y AC-3 se pueden construir solos. AC-4 depende de la fuente de lectura que fija el ADR de STORY-178, y AC-5 depende de que el `REVIEW.md` de STORY-179 conserve las reglas. El orden está declarado en las notas. |
| **N** – Negociable | 3 | Define el qué y el por qué. Fija algunos detalles de solución (grep exacto, `evals.json`, rutas de agentes), aunque deja libre el diseño del paso 2d/3b. |
| **V** – Valiosa | 4 | Valor cualitativo observable: menos falsos bloqueantes y agentes sin reglas ajenas en otros proyectos. No trae métrica cuantitativa. |
| **E** – Estimable | 3 | Toca el SKILL.md, los cuatro agentes y los evals. Los puntos de inserción están localizados (Paso 2d, Paso 3b, `integration-reviewer.agent.md:48-49`, verificados), pero la incertidumbre sobre cómo el árbitro aplica `REVIEW.md` y la fuente que fije el ADR es media. |
| **S** – Small | 2 | Cinco escenarios y unos 25 pasos entre todos, sobre el skill y los cuatro agentes. La propia historia admite que AC-5 es el corte natural. |
| **T** – Testeable | 4 | Gherkin completo con escenarios alternativos y `Pero`. AC-5 es un grep automatizable y AC-2/AC-3 son comparables en el informe. «El árbitro aplica `REVIEW.md`» (AC-1) es menos observable. |

**INVEST_Score = (3 + 3 + 4 + 3 + 2 + 4) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

- **I (3):** implementar después de STORY-178 y STORY-179, como ya dicen las notas. Para desacoplar AC-4, el AC puede decir «la fuente que fija el ADR vigente» sin asumir cuál es. Conviene confirmar que STORY-178 esté al menos en SPECIFY/DONE antes de planificar esta historia.
- **N (3):** AC-5 prescribe el comando `grep -rE` y la lista exacta de frases. Se puede expresar como «ningún archivo de `skills/story-code-review/agents/` contiene reglas propias de agile-sddf» y dejar el grep como verificación sugerida.
- **E (3):** en el diseño, decidir pronto cómo se entrega `REVIEW.md` al árbitro (ruta en el bloque de contexto o contenido), porque eso mueve la estimación del Paso 3b.
- **S (2):** está en el límite. Si al planificar la historia resulta grande, separar AC-5 (limpieza de los agentes) en una historia propia, como sugieren las notas. No dispara `SPLIT` porque S ≠ 1.
- **T (4):** reformular en AC-1 la última línea para que sea observable, por ejemplo «el informe cita las secciones de `REVIEW.md` que aplicó» o «el bloque de contexto del árbitro incluye la ruta de `REVIEW.md`».
