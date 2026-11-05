---
type: finvest-evaluation
story-id: STORY-167
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder cuya épica no aprobó `/epic-format-validation`
> **Quiero** ejecutar `/epic-improve EPIC-NN` para que proponga y, con mi confirmación, aplique en `epic.md` las correcciones de frontmatter, secciones obligatorias, líneas F1/F2/F3 y smoke tests `SMOKE-N`, y el enriquecimiento de objetivos poco claros o criterios de salida faltantes, con backup previo
> **Para** cerrar el bucle de `DEFINE` y volver a validar la épica sin corregirla a mano

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` según el template; rol real y situado (Solo Builder con épica rechazada), acción concreta y beneficio observable (volver a validar sin edición manual). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 alternativo, AC-3 cancelación y AC-4 sin trabajo, todos como subapartados `###`. |
| Escenarios Gherkin | 5 | Cuatro bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`; AC-2 usa `Pero` para la excepción. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Consume el diagnóstico del veredicto canónico de STORY-166 (hoy `SPECIFY/DONE`, no entregada); AC-1 y AC-4 dependen de que `/epic-format-validation` emita `APPROVED`. La dependencia es desacoplable con un diagnóstico de ejemplo fijo, pero condiciona el orden. |
| **N** – Negociable | 4 | Describe el qué (corregir forma con confirmación y backup) y deja abierto el cómo; las categorías de corrección y el nombre `epic.md.bak` acotan algo la solución, razonable por coherencia con `story-refine`. |
| **V** – Valiosa | 4 | Valor claro y observable para el Solo Builder: la épica pasa de rechazada a `APPROVED` sin edición manual; cierra el bucle de `DEFINE`. Sin métrica cuantitativa. |
| **E** – Estimable | 3 | Skill nuevo completo (`SKILL.md`, marcador de layout, `files` de `package.json`, `evals/evals.json`) con varias categorías de corrección; el «enriquecimiento de objetivos poco claros» no tiene criterio que lo delimite, lo que introduce incertidumbre. |
| **S** – Small | 2 | 4 escenarios y ~21 pasos; el `Quiero` enumera cinco categorías de corrección más el enriquecimiento de contenido. Grande, aunque cohesionada. |
| **T** – Testeable | 4 | Happy path, alternativo con `Pero`, cancelación y no-op; condiciones observables (existencia de `epic.md.bak`, `status`/`substatus` sin cambios, veredicto `APPROVED`, ningún archivo modificado). Las correcciones de frontmatter, `SMOKE-N` y enriquecimiento de objetivos no tienen escenario propio. |

**INVEST_Score = (3 + 4 + 4 + 3 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):**
- Fijar en `📎 Notas` el contrato mínimo que consume de STORY-166 (campos del diagnóstico: veredicto y lista de defectos con sección/regla) y declarar que, hasta que STORY-166 se entregue, las pruebas usan un diagnóstico de ejemplo fijo. Así la historia puede iniciarse en paralelo.

**E – Estimable (3):**
- Acotar el «enriquecimiento de objetivos poco claros»: definir qué hace el skill (p. ej. solo lo lista como «requiere decisión del PO», igual que los criterios de salida no inferibles) o retirarlo del `Quiero`. Hoy es la principal fuente de incertidumbre.
- Enumerar en `📎 Notas` el catálogo cerrado de defectos que corrige (frontmatter, secciones obligatorias, líneas F1/F2/F3, `SMOKE-N`), tomado de las reglas de `/epic-format-validation`.

**S – Small (2):**
- La historia es aprobable, pero está en el límite. Si al planificar crece, el corte natural (patrón *reglas de negocio / variaciones de datos*) es: (a) correcciones estructurales deterministas (frontmatter, secciones, F1/F2/F3, `SMOKE-N`) y (b) enriquecimiento de contenido con decisión del PO (objetivos y criterios de salida).
- Alternativamente, simplificar el `Quiero` a «aplicar las correcciones que señala el diagnóstico de `/epic-format-validation`» y mover la enumeración a Notas.

**T – Testeable (4) — mejora opcional:**
- Añadir un Scenario Outline con `Ejemplos:` por tipo de defecto (frontmatter incompleto, sección faltante, línea fuera de F1/F2/F3, smoke test sin `SMOKE-N`) para que cada categoría del `Quiero` quede cubierta por un criterio automatizable. Hacerlo solo si se aplica la recomendación de S, para no aumentar el tamaño.
