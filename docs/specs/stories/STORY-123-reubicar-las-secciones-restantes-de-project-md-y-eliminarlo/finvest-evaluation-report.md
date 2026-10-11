---
type: finvest-evaluation
story-id: STORY-123
finvest-score: 4.33
decision: APROBADA
evaluated: 2026-10-09
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de SDDF que colapsa `specs/` a dos niveles
> **Quiero** trasladar a su capa las secciones de `project.md` que ADR-0013 no asigna y después eliminar `project.md` y `docs/specs/01-projects/`
> **Para** que el repositorio del framework cumpla el criterio de salida de EPIC-21 (`docs/specs/01-projects/` no existe), sin una segunda fuente de verdad del proyecto, y STORY-108 encuentre `01-projects/` vacía al renombrar `specs/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol real, acción concreta y beneficio anclado a un criterio de salida observable. |
| Criterios de aceptación | 5 | Escenario principal (AC-1), de cierre (AC-2) y de error (AC-3) nombrados como `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` bien formados con `Y`; AC-3 incluye `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Gateway superado: se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | La precondición de AC-1 es un estado verificable, no una historia nombrada, y la reubicación de §1.1–1.7, §2.3, §3, §4.1, §11, §12 y apéndices no depende de STORY-104 a 107. Solo la eliminación final del directorio exige que estén implementadas. El orden queda documentado. |
| **N** – Negociable | 4 | Los destinos de cada sección quedan para el diseño; las decisiones del PO (redirección y retiro del runbook) fijan resultados, no la implementación. |
| **V** – Valiosa | 4 | El beneficio es el criterio de salida de EPIC-21, binario y observable, y desbloquea STORY-108. |
| **E** – Estimable | 4 | Inventario de secciones y de enlaces entrantes exacto (14 `epic.md`, story map, ADR-0006, runbook, índice); ya no quedan decisiones abiertas. |
| **S** – Small | 3 | Tres escenarios; AC-2 suma seis pasos. Tamaño adecuado para una historia. |
| **T** – Testeable | 4 | Todo es verificable en el sistema de archivos o con `memory-system check`; el informe tiene nombre y ubicación (`reubicacion-report.md`); AC-3 cubre el error con `Pero`. |

**INVEST_Score = (3 + 4 + 4 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

- **I (3) — Opcional para planning:** si se quiere adelantar trabajo, `story-plan` puede separar las tareas de reubicación (que no tienen dependencias) del borrado final, que espera a STORY-104…107.
- **S (3) — Opcional:** AC-2 concentra la redirección y el retiro del runbook. Si el diseño crece, el retiro del runbook puede pasar a un escenario propio sin dividir la historia.
