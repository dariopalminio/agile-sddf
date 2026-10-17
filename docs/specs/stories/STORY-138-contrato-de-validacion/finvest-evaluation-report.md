---
type: finvest-evaluation
story-id: STORY-138
finvest-score: 4.42
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que crea o modifica un skill de validación
> **Quiero** una política única que defina la estructura común del reporte y el vocabulario controlado de veredictos
> **Para** que agentes y pipelines CI lean el resultado de cualquier gate de la misma forma, sin conocer los detalles de cada skill

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que crea o modifica skills de validación), la acción es concreta (una política única) y el beneficio se puede observar (lectura uniforme por agentes y CI). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 y AC-3 como alternativos, todos con nombre. |
| Escenarios Gherkin | 5 | Tiene 3 bloques ` ```gherkin ` bien formados. Incluye un Esquema del escenario con `Ejemplos` y usa `Y` en el `Entonces`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de otras historias, pero sí de los tres flowcharts `*.mermaid` de AC-3, y esos archivos todavía no están versionados. |
| **N** – Negociable | 3 | Las Notas ya fijan casi todo el contenido de la política: las tablas de valores, las equivalencias, la semántica y las decisiones del PO. Queda poco por conversar sobre el cómo, aunque son decisiones de negocio explícitas y no de implementación. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: un solo vocabulario que agentes y CI pueden leer. Además, desbloquea 6 historias de alineación. |
| **E** – Estimable | 4 | Es un documento Markdown con tablas y 6 ejemplos, sin código. Cualquier miembro del equipo puede estimarlo con confianza. |
| **S** – Small | 3 | 3 escenarios distintos; las 7 filas de AC-2 son datos de una sola regla; el entregable es un documento de unas 50 líneas sin código ni evals. Contar cada fila del Outline como un escenario (9) sobrestimaría el tamaño. |
| **T** – Testeable | 5 | El Outline tiene datos concretos y AC-3 es una comparación determinista entre la tabla de la política y las ramas `verdict`. |

**INVEST_Score = (4 + 3 + 4 + 4 + 3 + 5) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.42 / 5.0
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**S – Small (3).** Para no pasar de unas 50 líneas, conviene presentar los ejemplos de los seis skills como una tabla compacta (skill · `verdict` · primera sección) y no como bloques de reporte completos.

**N – Negociable (3).** Las Notas funcionan casi como una especificación completa de la política. Conviene dejar en la historia solo los criterios de éxito y mover las tablas detalladas a un anexo o a la propia política cuando se redacte. Además, AC-1 pide ejemplos para "los seis skills", pero las Notas suman `epic-validate` como séptima fila. Hay que aclarar si `epic-validate` también lleva ejemplo.

**I – Independencia (4).** Hay que versionar los tres flowcharts (`flowchart-story-specify/plan/excecution-qa.mermaid`) antes de empezar, porque AC-3 se verifica contra ellos.

**Coordinación con el renombre pendiente:** si sigue adelante el plan de renombrar `epic-analyze` a `epic-evaluation`, la fila de AC-2 y las Notas de esta historia deberán usar el nombre nuevo.
