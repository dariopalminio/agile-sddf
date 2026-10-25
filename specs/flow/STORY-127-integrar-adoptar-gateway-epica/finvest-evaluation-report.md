---
type: finvest-evaluation
story-id: STORY-127
finvest-score: 4.33
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Solo Builder y responsable del ciclo de vida de épicas en Agile-SDDF
> **Quiero** que la transición `DEVELOP → VALIDATE` de una épica exija un veredicto APPROVED de `/epic-validate` y que el gateway se distribuya y documente para los runtimes soportados
> **Para** que ninguna épica llegue a VALIDATE sin un veredicto APPROVED vigente y que todo runtime instalado aplique la misma regla de liberación

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente. El rol es real, la acción concreta (nombra la transición `DEVELOP → VALIDATE` y el comando `/epic-validate`) y el beneficio se puede verificar: ninguna épica llega a VALIDATE sin un veredicto APPROVED vigente. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), alternativo (AC-2) y de adopción (AC-3), cada uno como subapartado `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`. El escenario alternativo AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5: se continúa con la evaluación INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Sigue consumiendo el veredicto de STORY-124 a STORY-126, que aún no están entregadas. Ahora la dependencia está desacoplada: las notas declaran el contrato (`verdict` en el frontmatter y `## Veredicto` en `epic-validate-report.md`) y explican cómo probar AC-1 y AC-2 con un reporte de prueba de veredicto fijo. AC-3 solo requiere que exista `skills/epic-validate/SKILL.md`. |
| **N** – Negociable | 4 | Documenta resultados, no la implementación. El mecanismo de la transición queda acotado a una precondición documentada, sin prescribir cómo redactarla. Las rutas citadas en CNF-1 son los documentos canónicos existentes. |
| **V** – Valiosa | 4 | El valor es claro y se comprueba de forma observable: ninguna épica llega a VALIDATE sin un veredicto APPROVED, y todos los runtimes instalados aplican la misma regla. Cierra además el criterio de salida CS-8 de EPIC-23. |
| **E** – Estimable | 4 | La incertidumbre principal quedó resuelta. La transición sigue siendo manual con el gateway como precondición documentada, y la automatización queda fuera de alcance. Están identificados los documentos que se actualizan y los runtimes que se verifican (`support: supported` en `config/runtimes.json`). El trabajo es acotado: documentación, entrada en `files` y verificación de instalación. |
| **S** – Small | 3 | Tiene 3 escenarios, dentro del rango ideal, con un foco cada uno. Sin embargo, suma 13 pasos y el `Quiero` sigue uniendo con "y" dos entregables: la regla de transición y la distribución. |
| **T** – Testeable | 4 | Gherkin completo con camino feliz y bloqueo (`Pero el status permanece en DEVELOP`). AC-3 se puede automatizar (empaquetar, instalar y comprobar `SKILL.md` en el destino). AC-1 y AC-2 verifican una regla documentada que aplica el mantenedor, así que su comprobación es procedimental o documental, no ejecutable. |

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

### I – Independencia (3)
- Mantén el reporte de prueba descrito en las notas como fixture compartido con STORY-128. Así AC-1 y AC-2 se pueden verificar en `story-testcases` sin depender del avance de STORY-124 a STORY-126.

### S – Small (3)
- Durante el planning, revisa si las tareas se agrupan en dos bloques independientes: regla de transición (AC-1 y AC-2) y distribución (AC-3). Si `story-tasking` produce más de un día de trabajo por bloque, conviene dividir con `/story-split` antes de implementar.

### T – Testeable (observación, score 4)
- Al diseñar, define cómo se verifican AC-1 y AC-2, ya que la regla es documental. Por ejemplo, una prueba de contenido que compruebe que `docs/guides/sddf-commands-pipeline.md` y `docs/architecture/state-machine.md` nombran `/epic-validate <EPIC-ID>` como precondición de `DEVELOP → VALIDATE`.
