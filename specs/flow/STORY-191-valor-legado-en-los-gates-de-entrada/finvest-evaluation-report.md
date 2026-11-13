---
type: finvest-evaluation
story-id: STORY-191
finvest-score: 4.00
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.00 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que actualiza agile-sddf a 6.0.0 con historias ya planificadas
> **Quiero** que `/story-implement` y `/story-implement-tasks` acepten `READY-FOR-IMPLEMENT/DONE` durante la ventana de transición, con un aviso, y la traten como `IMPLEMENT/TODO` si existe `implement-report.md` (ya se implementó y un gate la rechazó) o como `PLAN/DONE` si no
> **Para** no bloquear el trabajo planificado antes de actualizar

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real (quien actualiza con trabajo planificado), comportamiento observable (aceptar con aviso y clasificar) y beneficio concreto (no bloquear el trabajo previo a la actualización). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 escenario alternativo/error, como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`; AC-2 es Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. Solo AC-2 lleva la línea `Escenario:`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de cuatro historias sin entregar: STORY-186 (versión de cierre de la ventana, que el aviso de AC-1 debe indicar), STORY-188 (entrada `PLAN/DONE`), STORY-189 (entrada `IMPLEMENT/TODO`) y STORY-199 (el aviso «`IMPLEMENT/TODO` sin `fix-directives.md`» que exige la fila 3 de AC-2). STORY-199 no está declarada ni en `related` ni en Notas. Los evals se pueden escribir antes (CNF-2), así que la dependencia se simula en parte. |
| **N** – Negociable | 3 | El `Quiero` fija la regla de clasificación (`implement-report.md`), pero es una decisión de producto tomada en la épica, no una solución técnica. CNF-1 acota dónde puede aparecer el texto legado, y eso deja poco margen al cómo. |
| **V** – Valiosa | 3 | El valor es claro para los proyectos consumidores que actualizan con historias planificadas, pero es cualitativo. Las Notas reconocen que en este repo no hay ninguna historia en el valor legado. |
| **E** – Estimable | 4 | Dos gates de entrada (los mismos que tocan STORY-188 y STORY-189, con sus líneas ya localizadas) más dos `evals.json`. Faltan los puntos de cambio propios, pero el alcance está acotado. |
| **S** – Small | 2 | Seis escenarios contando las filas de Ejemplos y unos 16 pasos, con una tabla de 4 filas. AC-1 repite la fila 1 de AC-2 (mismo ejecutor, mismos artefactos, mismo resultado), así que hay cinco casos distintos: rango 4–5. |
| **T** – Testeable | 4 | Estados exactos, artefactos presentes o ausentes por fila y lista literal de estados aceptados en AC-3: se automatizan con evals. «Indica hasta qué versión se acepta» depende de un valor que fija el ADR de STORY-186 y que la historia no nombra. |

**INVEST_Score = (2 + 3 + 3 + 4 + 2 + 4) / 6 = 3.00 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.00 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (2):**
  - Corregir `related`: `STORY-189-el-rework-vuelve-a-implement-todo` ya no existe. Tras el split, el slug es `STORY-189-rework-de-revision-a-implement-todo`.
  - Agregar `STORY-199-origen-del-rework-en-los-ejecutores` a `related` y a la nota de dependencias. La fila 3 de AC-2 («emite el aviso de IMPLEMENT/TODO sin fix-directives.md») es el comportamiento que crea STORY-199.
  - Actualizar la tercera nota: tras el split de STORY-190, las directivas de verify las escribe STORY-198 y las de acceptance, STORY-190. Lo correcto es «antes de STORY-198 y STORY-190».
- **N – Negociable (3):** mover a Notas el paréntesis explicativo del `Quiero` («ya se implementó y un gate la rechazó»). Así el `Quiero` queda en el resultado y la justificación de la regla, en el contexto.
- **V – Valiosa (3):** dar una señal observable del valor, por ejemplo «ninguna historia planificada antes de 6.0.0 queda rechazada por el gate de entrada mientras dure la ventana».
- **S – Small (2):** quitar AC-1, que repite la fila 1 de AC-2, o convertirlo en el caso de SMOKE-3 de punta a punta y quitar esa fila de la tabla. Cualquiera de las dos opciones deja la historia en el rango ideal sin dividirla.
- **T – Testeable (4):** que AC-1 diga que el aviso indica «la versión en la que termina la ventana, según el ADR de STORY-186». Así el eval sabe de dónde sale el valor esperado.
