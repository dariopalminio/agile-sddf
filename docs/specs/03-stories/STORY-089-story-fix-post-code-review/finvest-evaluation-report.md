---
type: finvest-evaluation
story-id: STORY-089
finvest-score: 4.42
decision: APROBADA
evaluated: 2026-09-10
---

> **Nota:** este reporte refleja la historia **después** de aplicar la recomendación de la dimensión `S`
> (extracción del requerimiento "Un solo dueño del sub-flujo" a una historia hermana). La evaluación
> previa a ese refinamiento arrojaba `S = 3` y `FINVEST = 4.33`, también APROBADA.

# Evaluación FINVEST

## Historia evaluada

> **Como** desarrollador que recibe un veredicto `needs-changes` de `/story-code-review`
> **Quiero** que el rechazo deje la historia en un estado propio y con un ejecutor de correcciones al que el propio mensaje me remita
> **Para** aplicar los hallazgos y volver a revisión sin editar el frontmatter a mano ni depender de que la historia tenga `tasks.md`

Archivo: `docs/specs/03-stories/STORY-089-story-fix-post-code-review/story.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` presente según el template del proyecto. Rol específico y contextualizado (no "usuario" genérico), acción concreta y `Para` con beneficio observable y no redundante respecto al `Quiero` |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` presente con tres subapartados `###` nombrados: escenario principal, alternativo y de error |
| Escenarios Gherkin | 5 | Tres bloques ```` ```gherkin ```` bien formados con `Dado/Y/Cuando/Entonces`; el escenario de error usa `Pero`, satisfaciendo la condición alternativa del nivel 5 |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ **Gateway superado** (F_score ≥ 2.5) — se evalúan las dimensiones INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de ninguna historia no entregada. Las cuatro incoherencias relacionadas quedaron declaradas fuera de alcance y ninguna la bloquea. No llega a 5 porque toca dos skills existentes (`story-code-review`, `story-implement-tasks`) y el documento de máquina de estados |
| **N** – Negociable | 3 | Pre-decide el cómo: nombra el skill (`/story-fix`), el estado (`CODE-REVIEW/NEEDS-CHANGES`) y un artefacto (`fix-report.md`). Es una consecuencia deliberada de haber elegido el enfoque A + D en un documento de alternativas previo, pero deja poco margen de conversación técnica |
| **V** – Valiosa | 4 | El beneficio es observable sin instrumentación: hoy el desarrollador debe mover el estado a mano y el ciclo no tiene ejecutor alcanzable; tras la historia el ciclo se cierra solo. Valor cualitativo claro, no cuantificado con métrica |
| **E** – Estimable | 4 | Alcance acotado y con precedentes directos en el repo (32 skills con la misma estructura). La incertidumbre que quedaba —el impacto del requerimiento "un solo dueño" sobre `story-implement-tasks`— desapareció al extraerlo a una historia hermana |
| **S** – Small | 4 | Tres escenarios y tres requerimientos, todos cubiertos por los escenarios o por convenciones del repo. El único elemento sin acotar (retirar el sub-flujo de `story-implement-tasks`) quedó fuera de alcance. La historia entrega ahora una sola cosa: el ejecutor y el estado |
| **T** – Testeable | 4 | Los `Entonces` son objetivamente verificables (estado del frontmatter, existencia de archivos, contenido del mensaje final). No alcanza 5 por ausencia de `Scenario Outline` con tabla `Ejemplos` |

**INVEST_Score = (4 + 3 + 4 + 4 + 4 + 4) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 4 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.42 / 5.0
**FINVEST Decisión:** APROBADA

Ninguna dimensión obtuvo score 1; `S` no es 1, por lo que no aplica DIVIDIR.

---

## Comentarios y Recomendaciones

### N – Negociable (3) — recomendación accionable

La historia nombra la solución, no solo el problema. Dos matices distintos conviven aquí:

1. `/story-fix` y `CODE-REVIEW/NEEDS-CHANGES` **son** la decisión de producto (enfoque A + D, elegido tras evaluar cuatro alternativas). Que aparezcan en la historia es correcto: son el qué, no el cómo.
2. `fix-report.md` es distinto: nadie lo decidió, aparece por analogía con los demás skills del pipeline. **Recomendación:** degradarlo en el escenario 2 a "se registra el resultado por hallazgo (aplicado / omitido y motivo)" sin fijar el nombre del archivo, y dejar la elección del artefacto para `/story-design`.

### S – Small (4) — ✅ recomendación aplicada

El riesgo de tamaño no estaba en los tres escenarios, sino en el **Requerimiento "Un solo dueño del sub-flujo"**: retirar o redirigir el sub-flujo de corrección alojado en `story-implement-tasks:421-442` es un refactor de un skill existente que ningún escenario cubría y cuyo alcance no estaba acotado en la historia.

**Resuelto:** el requerimiento se extrajo a una historia hermana y quedó declarado en la sección "Fuera de alcance" de STORY-089, que ahora entrega una sola cosa —el ejecutor y el estado—. `S` sube de 3 a 4 y `E` se consolida en 4 al desaparecer la incertidumbre no dimensionada.

El fundamento de la separación: `/story-fix` puede convivir con el sub-flujo antiguo sin romper nada, porque el estado `CODE-REVIEW/NEEDS-CHANGES` hace que `story-implement-tasks` deje de ser alcanzable por esa vía de forma natural. La deduplicación es deseable, pero no es un prerrequisito para cerrar el ciclo.

### Observación transversal — cobertura de los requerimientos no funcionales

Dos criterios declarados no tienen escenario que los verifique:
- **Idempotencia** ("reejecutar `/story-fix` sobre una historia ya corregida no debe reaplicar cambios")
- **Trazabilidad** (registro del estado nuevo en `docs/knowledge/guides/state-machine.md`)

No bajan el score —los criterios no funcionales no requieren Gherkin propio— pero deben aparecer como casos en `testcases.md` durante la planificación, o se perderán igual que se perdió la lista blanca de archivos permitidos: declarada como vinculante y nunca aplicada. Es exactamente el patrón de fallo que esta historia viene a corregir.

### Nota sobre la dimensión V

La historia es de tooling interno, categoría que la rúbrica penalizaría con un 2 ("valor indirecto, difícil de explicar al usuario final"). No aplica aquí: en un framework de desarrollo el desarrollador **es** el usuario final, y el beneficio —dejar de parchear frontmatter a mano— es directamente perceptible para él.
