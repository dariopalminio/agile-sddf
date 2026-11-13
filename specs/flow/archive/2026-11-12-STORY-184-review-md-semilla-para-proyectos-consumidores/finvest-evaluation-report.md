---
type: finvest-evaluation
story-id: STORY-184
finvest-score: 4.42
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.42 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que adopta agile-sddf en su proyecto
> **Quiero** que `/sddf-constitution` cree un `REVIEW.md` inicial desde una plantilla cuando el proyecto no tiene uno, sin sobrescribir uno existente
> **Para** calibrar `/story-code-review` desde el primer día sin tener que conocer la convención de Claude Code Review

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente. Rol real (Solo Builder consumidor), una sola acción concreta con su condición de borde («sin sobrescribir») y un `Para` ligado a un efecto observable en `/story-code-review`. |
| Criterios de aceptación | 5 | Sección presente con AC-1 principal y AC-2 y AC-3 alternativos, como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres escenarios en bloques `gherkin` con `Dado/Cuando/Entonces` e `Y`; AC-2 cierra con `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | La plantilla `docs/templates/REVIEW-template.md` ya existe con las cuatro secciones que pide AC-1, así que la historia arranca sin bloqueos. La nota «Implementar después de STORY-180» es una preferencia de orden para que la semilla tenga efecto, no una dependencia técnica: el skill puede crear el archivo aunque `/story-code-review` todavía no lo lea. |
| **N** – Negociable | 4 | Los AC describen comportamiento observable (crea, conserva, idempotente). CNF-1 fija la ubicación de la plantilla, pero es una convención del skill, no una solución técnica cerrada; el punto del flujo donde se inserta el paso queda para `story-design`. |
| **V** – Valiosa | 4 | Valor claro para el consumidor: calibrar la revisión sin conocer la convención de Claude Code Review. Es cualitativo; no hay métrica de adopción ni de reducción de ruido asociada. |
| **E** – Estimable | 4 | Alcance acotado y con precedente verificado: el skill ya siembra `dod-story-<etapa>.md` desde `assets/dod-story/` sin sobrescribir. Suma crear `skills/sddf-constitution/evals/` desde cero (CNF-3), que es la parte con más incertidumbre. |
| **S** – Small | 3 | Señal primaria: 3 escenarios de 4–5 pasos (≈14 pasos en total). AC-3 casi repite AC-1 + AC-2. Encima del comportamiento va el trabajo de crear la suite de evals del skill. |
| **T** – Testeable | 4 | AC-1 se comprueba con datos exactos (ruta, secciones, mensaje literal «✅ Creado: REVIEW.md») y AC-2 con una igualdad byte a byte. AC-2 no fija el texto del mensaje «lo conserva», así que esa aserción no es literal. |

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
- AC-3 casi repite AC-1 seguido de AC-2: la segunda ejecución es el caso «REVIEW.md ya existe». Se puede quitar AC-3 y dejar la idempotencia como `Regla:` o como un `Y` de AC-2 («y es el mismo archivo que creó una ejecución anterior»). Así quedan 2 escenarios.
- Si la suite de evals nueva (CNF-3) resulta más grande de lo esperado, puede ir en una historia `chore` previa («crear `evals/` de `sddf-constitution`»). Esta historia se quedaría solo con los dos casos de `REVIEW.md`.

**Observaciones adicionales (dimensiones con score 4):**
- **T:** fijar en AC-2 el mensaje literal, por ejemplo «ℹ️ Conservado: REVIEW.md (ya existe)», para que coincida con el «✅ Creado: REVIEW.md» de AC-1 y el eval pueda comprobarlo como cadena exacta.
- **T:** en AC-1, la plantilla titula las secciones con un sufijo («Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM», «Tope de nits — 🟡 Nit · LOW»). Conviene escribir «encabezados que empiezan por …» para que el eval no falle por comparar el título completo.
- **N / CNF-1:** «el mismo contenido que `docs/templates/REVIEW-template.md`» crea dos copias que pueden divergir. `story-design` debería decir cómo se detecta la divergencia (por ejemplo, un check en `verify:repository`) o cuál de las dos es la fuente.
- **I:** pasar la nota de orden con STORY-180 a `related` o a «Fuera de alcance». Así queda claro que no bloquea el arranque.
