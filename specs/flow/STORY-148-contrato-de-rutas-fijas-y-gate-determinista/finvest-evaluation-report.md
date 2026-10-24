---
type: finvest-evaluation
story-id: STORY-148
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que migra los skills al layout fijo
> **Quiero** que `verify:repository` detecte de forma determinista cualquier skill que no cumpla el contrato de layout fijo (que solo resuelve `REPO_ROOT`) o que conserve la resolución legada
> **Para** que el 100 % de las referencias legadas a `SDDF_ROOT`, `root` y `SPECS_BASE` en los skills quede detectado por el gate y se cumplan CS-2, CS-3 y CS-12 de la épica sin revisión manual

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` conforme al template; rol real, el `Quiero` expresa la capacidad (detección determinista) y el `Para` aporta una métrica (100 %). |
| Criterios de aceptación | 5 | Sección presente con AC-1 (principal) y AC-2 (alternativo/error) nombrados como subapartados `###`. |
| Escenarios Gherkin | 5 | 2 escenarios en bloques ```gherkin con Dado/Y/Cuando/Entonces y `Pero` en AC-2. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Precondición explícita: el ADR de STORY-147 debe estar `ACCEPTED`. Respecto de STORY-150/151/152 queda desacoplada mediante fixtures y una lista transitoria de skills pendientes. |
| **N** – Negociable | 3 | El qué y el porqué están claros y la redacción del mensaje y la estructura interna quedan abiertas, pero las notas fijan rutas literales, el reemplazo y eliminación de `scripts/audit-root-resolution.js` y los archivos a actualizar. |
| **V** – Valiosa | 3 | Beneficio con métrica (100 % de referencias legadas detectadas) y trazabilidad a CS-2, CS-3 y CS-12; el valor recae en el mantenedor, no en un usuario final. |
| **E** – Estimable | 4 | Alcance mínimo del contrato, rutas admitidas y archivos a tocar enumerados; solo el texto exacto del marcador depende del ADR de STORY-147. |
| **S** – Small | 3 | 2 escenarios y unos 10 pasos Gherkin; el trabajo incluye validador, pruebas, lista transitoria y sustitución del script legado, razonable para una sola entrega. |
| **T** – Testeable | 4 | Escenarios automatizables con caso feliz, caso de error y `Pero`; CNF-3 exige pruebas unitarias con fixtures. Sin `Scenario Outline` con tabla de ejemplos. |

**INVEST_Score = (3 + 3 + 3 + 4 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):** Antes de iniciar, confirma que el ADR de STORY-147 está `ACCEPTED`; el marcador del contrato que reconoce el validador sale de ese ADR. Mantén la lista transitoria como un arreglo con nombre dentro del validador para que STORY-150/151/152 retiren sus skills sin tocar la lógica.

**N – Negociable (3):** Considera mover a la conversación de diseño los detalles ya decididos en las notas (eliminar o renombrar el script legado, archivos concretos a actualizar) y conservar en la historia solo el comportamiento observable del gate.

**V – Valiosa (3):** Si es posible, enuncia el efecto para quien usa el framework (p. ej. menos regresiones de resolución de raíz en las instalaciones) además del beneficio del mantenedor.

**S – Small (3):** Mantén el alcance en dos escenarios. Si la lista transitoria o las excepciones de `skill-preflight` ganan lógica propia, sepárala en una historia aparte.
