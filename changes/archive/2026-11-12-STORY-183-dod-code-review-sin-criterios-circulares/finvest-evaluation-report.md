---
type: finvest-evaluation
story-id: STORY-183
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que corrige lo que pide `fix-directives.md`
> **Quiero** que el DoD de CODE-REVIEW solo exija lo que la revisión puede comprobar y no repita lo que ya reporta un revisor
> **Para** que el DoD no se apruebe con el veredicto que ayuda a calcular (cero criterios autorreferentes) y cada defecto tenga una sola entrada en `fix-directives.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente. Rol real, un solo pedido en el `Quiero` y un `Para` con indicadores observables (cero criterios autorreferentes, una entrada por defecto). |
| Criterios de aceptación | 5 | Sección presente con AC-1 y AC-2 principales y AC-3 alternativo, como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres escenarios en bloques `gherkin`. AC-2 cierra con `Pero` y AC-3 es un `Esquema del escenario` con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Solo toma la precedencia DoD vs `REVIEW.md` del ADR de STORY-178, sin bloquear el arranque. La deduplicación entre revisores queda en STORY-182. AC-2 trata otro par (DoD vs revisor), pero la frontera con STORY-182 es estrecha. |
| **N** – Negociable | 4 | Los AC describen comportamiento observable y la nota «Mecanismo abierto» deja a `story-design` elegir entre mapeo criterio → revisor y deduplicación. |
| **V** – Valiosa | 4 | El valor para el Solo Builder es claro y tiene indicadores contables. Aun así es un valor de calidad de proceso, no una métrica de negocio. |
| **E** – Estimable | 4 | Alcance acotado y verificado: dos archivos de DoD (L21, L24, L25; la diferencia de L22) y el Paso 4c.1 de `story-code-review`. El mecanismo abierto de AC-2 deja algo de incertidumbre. |
| **S** – Small | 2 | Señal primaria: 4 escenarios (AC-1, AC-2 y 2 filas de `Ejemplos` en AC-3), de 6 o 7 pasos cada uno, con muchos `Y`. Cubre dos cambios distintos: limpiar el DoD y cambiar la regla del árbitro. |
| **T** – Testeable | 4 | AC-2 y AC-3 se comprueban sobre artefactos (`fix-directives.md`, `code-review-report.md`) con datos concretos. AC-1 pide juzgar si un criterio «se cumple por el solo hecho de generar el reporte», lo que no es una comprobación booleana directa. AC-2 y AC-3 requieren ejecutar una revisión LLM. |

**INVEST_Score = (4 + 4 + 4 + 4 + 2 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**S – Small (2):**
- La nota «Posible división» ya fija la frontera de corte: AC-1 + CNF-1 (limpiar el DoD) frente a AC-2 + AC-3 (regla del árbitro en `story-code-review`). Conviene decidir el corte al inicio de `story-design` y no a mitad del diseño. Si se divide, la historia del DoD queda trivial y la del árbitro arrastra el mecanismo abierto.
- Si no se divide, reducir pasos: el `Y "memory-system check" pasa` de AC-1 ya está en CNF-2 y puede salir del escenario.

**Observaciones adicionales (dimensiones con score 4):**
- **T:** en AC-1, cambiar el juicio por una comprobación sobre el texto, por ejemplo «ningún criterio menciona `code-review-report.md`, su `verdict` ni la severidad de los hallazgos de la misma revisión».
- **T / alcance:** el criterio «Metadatos frontmatter de `story.md` … con status y substatus actualizados» (L23), que AC-3 usa como ejemplo, puede ser circular en parte: la propia revisión escribe la transición de `status`. Conviene que `story-design` aclare si se conserva entero o solo la parte de completitud.
- **I:** dejar explícito en «Fuera de alcance» que AC-2 trata la duplicación DoD ↔ revisor y STORY-182 la duplicación revisor ↔ revisor. Así se evita que el diseño de las dos historias se pise.
