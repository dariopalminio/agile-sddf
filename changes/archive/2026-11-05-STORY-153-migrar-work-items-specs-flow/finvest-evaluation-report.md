---
type: finvest-evaluation
story-id: STORY-153
finvest-score: 4.25
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.25 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que dogfoodea el framework
> **Quiero** migrar las épicas y stories de `docs/specs/` a `specs/flow/`, archivando las `COMPLETED`, de forma reproducible, segura de ensayar y conservando su historial git
> **Para** adoptar el layout fijo en este repo sin perder la trazabilidad de ningún work item

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección y cláusulas completas. El `Quiero` ahora expresa el resultado (migrar, archivar, reproducible, conservar historial) y el `Para` aporta un beneficio concreto: no perder trazabilidad. |
| Criterios de aceptación | 5 | Sección presente con AC-1 principal y AC-2 alternativo, ambos nombrados como subapartados `###`. Incluye CNF y Non-Goals. |
| Escenarios Gherkin | 5 | Dos escenarios en bloques `gherkin` con `Dado/Cuando/Entonces`, `Y` y `Pero` (AC-2). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Las precondiciones están explícitas (después de STORY-150 a 152, antes de STORY-157) y el alcance de enlaces se delegó a STORY-157. Aun así el orden de entrega es fijo, no flexible. |
| **N** – Negociable | 4 | El `Quiero` describe el resultado y deja el diseño del script abierto. Los criterios de éxito son verificables. Se conservan `--dry-run` e idempotencia (CS-7) y la fecha de archivo, que fijan parte del cómo. |
| **V** – Valiosa | 4 | Valor claro y observable para el mantenedor: ningún work item se pierde (conteo activas + archivadas igual al previo) y se cierra CS-4 a CS-7 del dogfooding de EPIC-26. Es una chore de habilitación sin métrica de negocio. |
| **E** – Estimable | 3 | Hay inventario aproximado (27 épicas, 147 stories, ~98 `COMPLETED`) y el alcance está acotado. Persiste incertidumbre: los casos límite (directorios sin versionar o con cambios locales, EPIC-26 moviéndose a sí misma) quedan «a definir en diseño». |
| **S** – Small | 3 | Dos escenarios; AC-1 tiene unos 7 pasos y la historia suma unos 12. Reparación de enlaces y verificación del historial ya se separaron a STORY-157. |
| **T** – Testeable | 4 | Gherkin con camino feliz y alternativo. Las condiciones son comprobables: existencia/inexistencia de rutas, conteos, salida de `--dry-run`, árbol de trabajo sin cambios. |

**INVEST_Score = (3 + 4 + 4 + 3 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3)**
- Convierte las precondiciones de las Notas en una verificación explícita al inicio de la fase de diseño o planning (STORY-150 a 152 en `COMPLETED`), para que el orden de entrega no dependa de memoria humana.

**E – Estimable (3)**
- Resuelve en `design.md` los casos límite antes de estimar tareas: política ante directorios sin versionar o con cambios locales (abortar o fallar cerrado antes de mover) y orden de movimiento de EPIC-26.
- Aclara si `docs/specs/` puede contener elementos distintos de `epics/` y `stories/` (por ejemplo `projects/`). AC-1 afirma que `docs/specs/` deja de existir y eso exige definir su destino.

**S – Small (3)**
- Sin acción requerida. Si el diseño suma escenarios (por ejemplo, uno por casos límite), mantén la historia en 3 escenarios o menos y deriva el resto a tasks.
