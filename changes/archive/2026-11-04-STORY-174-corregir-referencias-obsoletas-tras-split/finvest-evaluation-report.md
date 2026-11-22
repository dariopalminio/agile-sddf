---
type: finvest-evaluation
story-id: STORY-174
finvest-score: 4.25
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.25 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder
> **Quiero** que `/epic-refine EPIC-NN` detecte y corrija las referencias a slugs de historias que dejaron de existir tras un `/story-split`, aunque `epic-analyze` no las reporte
> **Para** que el índice de la épica y los `related` de sus historias apunten a historias reales sin rastrearlas a mano después de cada split.

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | El encabezado `# 📖 Historia` coincide con el template. El rol es real (Solo Builder), la acción es concreta (detectar y corregir slugs obsoletos tras un split) y el beneficio se puede observar (referencias a historias reales sin rastreo manual). |
| Criterios de aceptación | 5 | La sección `## ✅ Criterios de aceptación` tiene `AC-1` (escenario principal) y `AC-2` (escenario alternativo), ambos nombrados como `###`. |
| Escenarios Gherkin | 5 | Dos bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`. El escenario alternativo (AC-2) usa `Pero` para afirmar que el archivo no se modifica. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | La historia amplía el skill `epic-refine`, que crea STORY-165. Esa historia está en `SPECIFY/DONE` y `skills/epic-refine/` todavía no existe en el repo. La nota «Contrato que se reutiliza de STORY-165» nombra los puntos de extensión (plan de cambios, tabla de hallazgos, `.bak`, modos), así que el diseño y las pruebas se pueden hacer con fixtures y un stub. Aun así, el orden de implementación es fijo («Se implementa después de STORY-165»): sigue siendo una dependencia de una historia no entregada que solo se simula parcialmente. Es independiente de STORY-173. |
| **N** – Negociable | 4 | Los AC describen resultados observables (referencias corregidas, backups, hallazgos en el reporte) sin fijar la implementación. La regla de reemplazo y el código `COH` están en Notas como reglas de negocio, no como diseño técnico. |
| **V** – Valiosa | 4 | El valor es claro y observable para quien mantiene la épica: ya no hace falta rastrear a mano los slugs después de cada split. No hay métrica cuantitativa. |
| **E** – Estimable | 4 | Se resolvieron los dos huecos anteriores. La regla de reemplazo ahora es determinista (un único `STORY-NNN-*` con el mismo ID en `specs/flow/` o `specs/flow/archive/`) y el disparo está definido: COH solo corre con `verdict: NEEDS-REFINEMENT` y el AC-2 de STORY-165 queda intacto. El alcance está acotado a `epic.md` y a los `story.md` de la épica. Se puede estimar con confianza, siempre que el contrato de STORY-165 se mantenga. |
| **S** – Small | 3 | Tiene dos escenarios (principal y alternativo), que es la señal primaria de tamaño pequeño. La suma de pasos subió a unos 13 (AC-1 tiene 8), porque varias precondiciones y aserciones se agruparon en los `Y`. Es aceptable, pero está en el límite superior. |
| **T** – Testeable | 4 | El AC-1 ahora afirma el resultado exacto: el reemplazo `STORY-301-exportar-informe-csv` en el plan, en `epic.md` y en el `related` de `STORY-302`, más los `.bak` y el estado `aplicado` en el reporte. Ya se corrigió la contradicción del AC-2, que además afirma el no-cambio con `Pero`. Todo se puede automatizar con fixtures. Lo único implícito es que el `Dado` del AC-2 no fija `verdict: NEEDS-REFINEMENT` en `epic-analyze-report.md`, que según Notas es la condición de disparo. |

**INVEST_Score = (2 + 4 + 4 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (2)
- La dependencia de STORY-165 viene del split (core → hermana) y la nota de puntos de extensión ya la acota lo más posible. No hay que cambiar la historia, pero sí la planificación: en `story-design`, tomar como entrada el `design.md` de STORY-165 (cuando exista) y no reinterpretar el contrato. Si STORY-165 cambia la estructura del plan de cambios o de `epic-refine-report.md` al diseñarse, hay que volver a revisar esta historia antes de implementarla.

### S – Small (3)
- No agregar más escenarios ni pasos. Si al planificar aparece otro caso (por ejemplo, más de un directorio `STORY-NNN-*` con el mismo ID), cubrirlo como caso de prueba en `testcases.md` en lugar de convertirlo en un AC nuevo. La regla ya está en Notas.

### T – Testeable (4, opcional)
- Para que la precondición del AC-2 sea explícita y coincida con la nota «Disparo con `verdict: APPROVED`», se puede agregar al `Dado`: `Y "epic-analyze-report.md" tiene "verdict: NEEDS-REFINEMENT" y no reporta esa referencia`.
