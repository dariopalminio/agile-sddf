---
type: finvest-evaluation
story-id: STORY-089
finvest-score: 4.17
decision: DIVIDIR
evaluated: 2026-09-11
---

# Evaluación FINVEST

## Historia evaluada

> **Como** desarrollador que recibe un veredicto `needs-changes` de `/story-code-review`
> **Quiero** que el rechazo devuelva la historia a la cola `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` como única señal de rework, y que el propio mensaje me remita a `/story-implement` para que, al tomarla de la cola, aplique las correcciones en un ciclo TDD acotado a los hallazgos
> **Para** volver a revisión sin crear un estado nuevo, sin editar el frontmatter a mano y sin depender de que la historia tenga `tasks.md`

Fuente: `docs/specs/03-stories/STORY-089-story-fix-post-code-review/story.md` (9 escenarios Gherkin, 55 pasos).

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `## 📖 Historia` presente. Rol real (desarrollador que recibe `needs-changes`), acción concreta, beneficio verificable (sin estado nuevo, sin edición manual del frontmatter, sin `tasks.md`). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con 2 escenarios principales y 6 alternativos nombrados como `###`, más 7 subapartados `### Requerimiento`. |
| Escenarios Gherkin | 5 | 9 bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces/Pero`; 4 escenarios usan `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — continúa a INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de historias sin entregar: `fix-directives.md` (STORY-065), reanudación (STORY-067) y `kind: fix` (STORY-086) ya están en `main`. Comparte `story-implement` con STORY-090 en curso, pero sin bloqueo real. |
| **N** – Negociable | 3 | El qué y el por qué están claros y las alternativas descartadas quedan documentadas. Sin embargo, los siete `### Requerimiento` fijan el cómo (nombres de campos del bundle, textos de mensajes, regla por columna `Dimensión`, comportamiento por `$EXEC_MODE`): queda poco margen para negociar la solución en PLAN. |
| **V** – Valiosa | 4 | Valor claro para el usuario del framework (el desarrollador): cierra un hueco real que hoy bloquea a STORY-090. Medible cualitativamente: ciclo completo `needs-changes → approved` sin edición manual del frontmatter. |
| **E** – Estimable | 4 | Impacto delimitado en una tabla explícita (dos skills, un template, tres documentos de dominio/guía, un ADR). Cualquier miembro con experiencia en skills SDDF puede estimarla; la parte mayor (modo rework de `story-implement`) está acotada por reglas deterministas. |
| **S** – Small | 1 ⚠️ | **9 escenarios Gherkin y 55 pasos** (umbral de la rúbrica: ≥ 6 escenarios o ≥ 11 pasos → 1). La historia cubre dos frentes distintos: el lado emisor (`story-code-review`: `round`, mensaje, sin escritura en `tasks.md`, template) y el lado ejecutor (`story-implement`: gate, detección, bundle, reglas de RED y de lista blanca, reporte), más documentación y ADR. |
| **T** – Testeable | 4 | Cada escenario verifica estados de frontmatter, existencia de archivos y textos de mensaje concretos; cubre happy path y errores con `Pero`. No usa Scenario Outline con tabla de datos. |

**INVEST_Score = (4 + 3 + 4 + 4 + 1 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 1 / 5 ⚠️
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0
**FINVEST Decisión:** **DIVIDIR** — Tamaño muy grande (regla crítica: S = 1 prevalece sobre el score global ≥ 4.0)

---

## Comentarios y Recomendaciones

### S – Small (1) ⚠️ — Dividir por pasos del flujo

La historia describe un flujo con dos dueños distintos y dos artefactos de salida distintos. Split sugerido (patrón *workflow steps* de `/story-split`):

| Historia | Alcance | Escenarios que hereda |
|---|---|---|
| **Core (STORY-089)** — `story-code-review` nombra al ejecutor y deja de depender de `tasks.md` | 4g.1 sin escritura en `tasks.md`; `round` en `fix-directives.md`; mensaje final con `→ Ejecuta /story-implement`; corrección de `fix-directives-template.md` (`READY-FOR-VERIFY`); ADR-0008 y notas de dominio (§5.3 `REWORK`); realineación de `epic.md`. | "El rechazo encola la historia y nombra al ejecutor", "La aprobación limpia la señal de rework". |
| **Hermana A** — `story-implement` en modo rework | Gate de estado; detección por `fix-directives.md`; `IMPLEMENT/IN-PROGRESS` al arrancar; bundle con `fix_directives_path` y `whitelist`; sección "Ciclo de corrección — ronda N" en `implement-report.md`; corrección de la l. 49. | "story-implement toma la historia de la cola en modo rework", "Ejecución inicial sin fix-directives.md", "Reanudación desde IMPLEMENT/IN-PROGRESS", "Estado no admitido", "Ciclo completo sin edición manual". |
| **Hermana B** — Reglas de robustez del modo rework | RED con 0 archivos por `Dimensión`; archivos fuera de la lista blanca por `$EXEC_MODE`; `story-implement-tasks` disparado por presencia del archivo. | "RED en rework sin tests nuevos", "Corrección fuera de la lista blanca". |

Con este reparto cada historia queda en 2–5 escenarios (S = 3–4) y el ciclo completo sin edición manual sigue siendo verificable en la Hermana A, que depende de la Core (I = 3, aceptable).

### N – Negociable (3)

Al dividir, mover el detalle de implementación de los `### Requerimiento` (nombres de campos del bundle, textos exactos de mensajes, mecanismo de cálculo de `round`) a `design.md` durante PLAN. En `story.md` conservar solo las reglas de negocio observables: "la señal de rework es la presencia del artefacto", "el rechazo vuelve a la cola", "RED sin tests es error solo cuando falta cobertura de un AC", "fuera de lista blanca: confirmar en interactivo, registrar en `--auto`".

### Observaciones sin impacto en el score

- Las Notas (argumentos contra un estado de corrección, fixture STORY-090, desalineaciones detectadas, tabla de impacto) son valiosas para PLAN; al dividir, la Core debe conservarlas y las hermanas referenciarlas.
- El skill `story-evaluation` busca el template en `$SPECS_BASE/specs/templates/story-template.md`; el repo lo movió a `docs/templates/story-template.md` (commit `7793b30`). Esta evaluación usó la ruta vigente. Conviene actualizar la ruta en el skill.
