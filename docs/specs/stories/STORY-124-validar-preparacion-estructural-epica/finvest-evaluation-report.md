---
type: finvest-evaluation
story-id: STORY-124
finvest-score: 4.27
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **STORY-124 — Validar la preparación estructural de una épica**
>
> **Como** Solo Builder y mantenedor de Agile-SDDF que prepara una épica para su liberación
> **Quiero** obtener un veredicto de preparación basado en el cierre de sus historias y en el análisis de la épica
> **Para** identificar de forma objetiva los impedimentos antes de que la épica avance en su ciclo de vida
>
> Criterios: AC-1 (validación aprobada), AC-2 (evidencia estructural incompleta → BLOCKED), AC-3 (épica inexistente).

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` como en el template; rol real y específico, acción concreta (veredicto de preparación) y beneficio observable (impedimentos objetivos antes de avanzar). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con subapartados `###` nombrados: principal (AC-1), alternativo (AC-2) y error (AC-3). |
| Escenarios Gherkin | 4 | Tres bloques ` ```gherkin ` bien formados con `Dado/Cuando/Entonces` e `Y`; no hay `Pero` ni Scenario Outline con `Ejemplos`, que el template propone para AC-2/AC-3. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se continúa con la evaluación INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Es la historia core del split: STORY-125…128 dependen de ella, no al revés. Su única dependencia (el reporte de `epic-analyze`) ya está entregada en `skills/epic-analyze/`. |
| **N** – Negociable | 4 | Los AC describen resultados (veredicto, hallazgos, error) y no el algoritmo. CNF-2 y las notas fijan nombre de archivo y estructura de la plantilla, pero vienen heredados de los criterios de salida de EPIC-23. |
| **V** – Valiosa | 4 | Valor claro para quien usa el framework: un gate binario (`APPROVED`/`BLOCKED`) con impedimentos identificados. Se puede comprobar de forma cualitativa; no tiene métrica cuantitativa. |
| **E** – Estimable | 4 | Ya existe un análogo (`epic-analyze`: skill Markdown con plantilla y reporte). Queda algo de incertidumbre porque no se define qué estados cuentan como «terminal» ni de dónde se toma el veredicto del análisis. |
| **S** – Small | 3 | 3 escenarios con 11 pasos en total. AC-2 junta dos casos de bloqueo con «o», y CNF-2 añade el trabajo de la plantilla. Está en el tamaño ideal, pero en el límite superior. |
| **T** – Testeable | 4 | Cubre el caso feliz, el alternativo y el de error, con resultados observables: archivo escrito, veredicto en la primera sección y en `verdict`, y ningún reporte en caso de error. El «o» de AC-2 deja dos ramas en un solo escenario y faltan datos concretos. |

**INVEST_Score = (4 + 4 + 4 + 4 + 3 + 4) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.27 / 5.0
**FINVEST Decisión:** ✅ **APROBADA**

---

## Comentarios y Recomendaciones

### S – Small (3) — recomendación obligatoria
- **Separar las dos ramas de AC-2.** «Una historia hija no terminal **o** un análisis sin APPROVED» son dos causas de bloqueo con evidencias distintas: historia + estado en un caso, análisis + veredicto en el otro. Conviene un Scenario Outline con tabla `Ejemplos`:
  ```gherkin
  Escenario: Evidencia estructural incompleta bloquea la épica
    Dado una épica cuya evidencia presenta "<condición>"
    Cuando el mantenedor solicita validar la épica
    Entonces el reporte declara BLOCKED
      Y identifica "<hallazgo>"
  Ejemplos:
    | condición                              | hallazgo                          |
    | una historia hija en IMPLEMENT         | la historia y su estado           |
    | análisis con veredicto distinto de APPROVED | el análisis y su veredicto   |
    | análisis inexistente                   | la ausencia del análisis          |
  ```
  El tamaño no cambia, pero cada causa de bloqueo pasa a ser un caso verificable por separado. Además, F3 y T subirían a 5.

### Mejoras opcionales (dimensiones con score 4)
- **E / T — definir «terminal».** Indica en Notas o como `Regla:` qué `status`/`substatus` de una historia cuentan como cierre (por ejemplo, el estado final del ciclo de vida del DoD) y qué pasa con historias canceladas o divididas. Así se evita que el diseño y el reporte lo interpreten de formas distintas.
- **E — origen del veredicto del análisis.** Aclara que el veredicto se toma de `epic-analyze-report.md` (su campo de frontmatter o su sección de veredicto) y qué se informa si ese reporte no existe. Hoy ese caso no está cubierto por ningún AC.
- **N — delegar detalle estructural al diseño.** La regla «la plantilla declara en cada sección su marcador y tiene `## Veredicto` como primera sección» (CNF-2) es un criterio de salida de la épica. Puede quedarse, pero el resto de la estructura de la plantilla debería decidirse en `design.md`.

### Observaciones de veracidad del documento
- **Nota desactualizada.** Las Notas dicen: «El informe FINVEST de la historia original decidió `DIVIDIR`; su evidencia se conserva en este directorio». Antes de esta evaluación el directorio solo contenía `story.md`: el reporte anterior se eliminó en el commit `9d991a6`, y este reporte lo reemplaza. Hay que corregir la nota (por ejemplo, remitir al commit `8f463ec` como evidencia histórica) o eliminarla.
- **Encabezado de Fuera de alcance.** La historia usa `## 🚫 Fuera de alcance` y el template, `## Fuera de alcance (Non-Goals)`. Es una diferencia menor que no afecta al score.
