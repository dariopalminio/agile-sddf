---
type: finvest-evaluation
story-id: STORY-168
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder con una épica en `DEVELOP`
> **Quiero** ejecutar `/epic-track-progress EPIC-NN` para ver el status y substatus de cada historia hija, incluidas las archivadas, y saber si todas están terminadas
> **Para** pasar a `/epic-validate` solo cuando no queda ninguna historia pendiente, sin que se modifique ningún archivo

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente; rol real (Solo Builder con épica en `DEVELOP`), acción concreta y beneficio observable (no avanzar a `/epic-validate` con historias pendientes). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 alternativo, AC-3 de inconsistencia y AC-4 de error, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Cuatro bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`; AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Solo lee `epic.md` y `story.md`; `/epic-validate` (aún no existe en `skills/`) aparece solo como texto sugerido, no como dependencia de ejecución. Puede reutilizar el cruce índice ↔ `parent` que ya hace `epic-analyze`. |
| **N** – Negociable | 4 | Describe el qué (semáforo de solo lectura) y deja abierto el cómo: formato de la salida, estrategia de lectura y estructura del skill. CNF-2 fija las fuentes, lo que es razonable. |
| **V** – Valiosa | 4 | Valor claro y observable: resuelve el gate «all stories done?» de `DEVELOP → VALIDATE` y evita validar una épica incompleta. Sin métrica cuantitativa. |
| **E** – Estimable | 4 | Alcance acotado y con precedente (`epic-analyze`). Queda abierta una regla de negocio: «el tratamiento de las `CANCELED/DONE` se decide al refinar esta historia». |
| **S** – Small | 2 | 4 escenarios y ~19 pasos en total: la tabla de la rúbrica los clasifica como «Grande» (4–5 escenarios). AC-4 es una guarda trivial, así que la carga real es menor de lo que indica el conteo. |
| **T** – Testeable | 4 | Happy path, alternativo, inconsistencia y error con resultados observables («ningún archivo cambia», «no encontrada»). CNF-4 y CNF-5 no tienen umbral verificable y la regla `CANCELED/DONE` no tiene escenario. |

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

**S – Small (2):** el tamaño es aceptable para un skill de solo lectura, pero conviene compactarlo:
- Unificar la clasificación de estados en un solo **Scenario Outline** (AC-1 + AC-2) con una tabla `status/substatus/ubicación → ¿terminada?` (`DELIVER/DONE`, `COMPLETED/DONE` archivada, `IMPLEMENT/IN-PROGRESS`, `CANCELED/DONE`). Así baja el número de escenarios y sube la dimensión T.
- AC-4 (épica inexistente) puede quedar como regla de manejo de errores si se busca reducir escenarios; mantenerlo es razonable porque es barato.

**Observaciones no bloqueantes (E/T):**
- **Decisión pendiente `CANCELED/DONE`:** la nota dice que se decide «al refinar esta historia», pero la historia ya está en evaluación. Conviene registrar la decisión (por ejemplo, «cuentan como terminadas y se muestran como canceladas») y cubrirla con una fila del Scenario Outline antes de `story-plan`.
- **Cita de invariante:** la nota atribuye a la invariante 3 de `domain-epic-lifecycle` que cuentan `DELIVER/DONE` y `COMPLETED/DONE`, pero la invariante 3 solo dice «todas las historias de la épica estén en `DELIVER`». Hay que alinear el texto o aclarar que `COMPLETED` es una extensión (una historia completada ya pasó por `DELIVER`).
- **CNF-2 sin escenario:** el principio de unir el índice con los `story.md` que declaran `parent` no tiene un AC para el caso inverso de AC-3: una historia con `parent` a la épica que no figura en el índice. Conviene decidir si se lista y cómo se marca.
- **CNF-4 / CNF-5 no verificables:** falta un umbral objetivo (por ejemplo, «`SKILL.md` ≤ N líneas; el detalle va en `references/`»), o hay que remitirlos a la guía `docs/guides/best-practices-for-skills.md` como criterio de revisión.
- **AC-4:** «finaliza con error» puede concretarse indicando que no se muestra tabla parcial.
