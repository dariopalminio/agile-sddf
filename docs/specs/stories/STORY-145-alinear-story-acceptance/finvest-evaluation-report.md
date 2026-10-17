---
type: finvest-evaluation
story-id: STORY-145
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que usa `story-acceptance` como último gate antes de DELIVER
> **Quiero** que `acceptance-report.md` declare un veredicto `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` o `PENDING` en una sección `## Veredicto` al inicio y en el campo `verdict`
> **Para** que el ciclo de ejecución y QA vuelva a implementar con el mismo vocabulario que `story-code-review` y `story-verify`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que usa `story-acceptance` como último gate), la acción es concreta (cuatro valores en `## Veredicto` y en `verdict`) y el beneficio se puede observar (mismo vocabulario que los otros gates). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. AC-1 es un Esquema del escenario con `Ejemplos`, `Y` y `Pero`; AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-138, que está en `SPECIFY/DONE` pero no se entregó: `docs/policies/validation-contract-policy.md` todavía no existe. Ningún `Dado` exige la política, y los cuatro valores y la regla de precedencia ya están fijados en las decisiones del PO, así que la dependencia está desacoplada. Hay una dependencia sin declarar: el DoD de la etapa (`docs/guardrails/dod-story-acceptance.md:26`) que el propio skill lee y copia al reporte (ver T). |
| **N** – Negociable | 4 | Fija el resultado (`## Veredicto` primero, `verdict` en el frontmatter, sin `final-status` ni `ACCEPTANCE-*`) y deja abierto el cómo: qué pasa con `## Estado final` y con los resultados por criterio, que las Notas delegan en la política. Las referencias a líneas describen el estado actual y no imponen una solución. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: el último gate habla el mismo idioma que `story-code-review` y `story-verify`, y queda alineado con el flowchart (`APPROVED` / `NEEDS-CHANGES`). Cubre CS-9 de EPIC-25. El `Para` ("vuelva a implementar") promete más de lo que entrega: `story-implement` ignora `acceptance-report.md` de forma explícita (`skills/story-implement/SKILL.md:46` y `:296`), y la historia lo declara con honestidad en Fuera de alcance. |
| **E** – Estimable | 3 | Es un cambio de texto: la regla de mapeo ya existe en el Paso 7b (`SKILL.md:374–376`) y solo se renombra, y se agrega `PENDING`. Pero el inventario de las Notas está incompleto: faltan `docs/guardrails/dod-story-acceptance.md:26`, `examples/example-partial/acceptance-report.md` (`final-status: IN-PROGRESS`, l. 9), `examples/example-approved/definition-of-done-story.md:20` y el alcance real de `evals/evals.json` (los 12 casos usan valores `ACCEPTANCE-*`). En `SKILL.md` cambian los Pasos 3 (l. 260), 5 (salida parcial), 7b, 7d (l. 397 y 404), 8a, 8b, la sección Salida y los Test Cases. Se puede estimar con talla de camiseta, pero el volumen no se ve desde la historia. |
| **S** – Small | 3 | Hay 2 escenarios distintos. Las 5 filas de AC-1 son datos de una sola regla de mapeo y no cuentan como escenarios separados. El entregable se limita a un solo skill y sus artefactos, aunque el volumen de evals y ejemplos lo deja en el límite superior de "pequeña". |
| **T** – Testeable | 4 | AC-1 se puede automatizar con aserciones sobre el frontmatter, la primera sección y `not_contains`. AC-2 se puede verificar sobre el mensaje del Estado C. Hay tres puntos débiles: el `Pero` de AC-1 falla en este repositorio por el DoD copiado al reporte y por el historial de sesiones; AC-2 no cubre el reporte `partial`; y CNF-1 no tiene escenario (ver Comentarios). |

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
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**T – Testeable: el `Pero` de AC-1 choca con el DoD que el skill copia al reporte.** El Paso 2b extrae cada línea `- [ ]` del DoD de la etapa como criterio (`SKILL.md:211`), y el Paso 7 la escribe en `## Detalle por criterio` y en `## Criterios DoD ACCEPTANCE` (l. 403). En este repositorio, `docs/guardrails/dod-story-acceptance.md:26` dice "`acceptance-report.md` generado con resultado final `ACCEPTANCE-APPROVED`". El reporte de STORY-072 conservado en `.tmp/03-stories.bak/` lo confirma (fila `DoD-5`). Así, cualquier `acceptance-report.md` generado aquí contiene `ACCEPTANCE-APPROVED` y el `Pero` falla. Hay que incluir esa línea del guardrail en el alcance (por ejemplo: "`acceptance-report.md` generado con `verdict: APPROVED`") o acotar el `Pero` al frontmatter y a `## Veredicto`. La semilla de `skills/sddf-constitution/assets/dod-story/dod-story-acceptance.md` no tiene esa línea, así que no hace falta cambiarla.

**T – Testeable: el historial de sesiones arrastra el vocabulario antiguo.** El Paso 7c copia la sección `## Detalle por criterio` del reporte previo a `## Historial de sesiones anteriores`. Si esa sesión incluía la fila del DoD anterior, el reporte regenerado contendrá `ACCEPTANCE-APPROVED` aunque el guardrail ya se haya corregido. Hay que decidir si las entradas heredadas se normalizan al reescribir o si la aserción excluye esa sección. Es el mismo problema que señaló la evaluación de STORY-142 para el historial de `verify-report.md`.

**E – Estimable (3): completar el inventario de cambios.** La nota de estado actual cita el template, `SKILL.md:397`, dos ejemplos y `evals/evals.json`. También usan el vocabulario antiguo:
- `docs/guardrails/dod-story-acceptance.md:26` (ver la primera recomendación);
- `examples/example-partial/acceptance-report.md:9`, con `final-status: IN-PROGRESS`, que pasa a `verdict: PENDING`;
- `examples/example-approved/definition-of-done-story.md:20`;
- los 12 casos de `evals/evals.json`, no solo algunos: todos mencionan valores `ACCEPTANCE-*`, en `description`, `contains` o `not_contains`;
- en `SKILL.md`, el mensaje del Estado C (l. 260), la salida parcial del Paso 5 (hoy no define el valor de `final-status`), el Paso 7b (l. 374–376), las filas de 7d (l. 397 y 404), el Paso 8a (l. 422, 430 y 438), los mensajes de 8b (l. 462–474), la sección Salida (l. 486–488) y los Test Cases (l. 497 y 506).

**N – decidir qué pasa con `## Estado final`.** El template termina con `## Estado final` (l. 36), que repite el resultado en texto (`ACCEPTANCE APROBADO`, `EN PROGRESO`). Con `## Veredicto` al inicio, quedan dos fuentes del mismo dato. Conviene fijar en las Notas si la sección se elimina o se reduce a una explicación que no repita el valor.

**T – Testeable: AC-2 solo cubre el reporte completo.** El Estado B (sesión `partial`, `SKILL.md:235–249`) no muestra el resultado, así que hoy no lee `final-status`. Si la implementación empieza a leer `verdict` para detectar `PENDING`, conviene cubrirlo con un escenario o dejar escrito que el Estado B sigue usando solo `session-status`, como ya dice CNF-1.

**I – Independencia (3).** Conviene implementar después de que se publique `docs/policies/validation-contract-policy.md` (STORY-138) para citarla desde `SKILL.md` y resolver el renombrado de los resultados por criterio. Si se adelanta, basta con los valores de las decisiones del PO y una tarea para alinear la referencia después.

**V – ajustar el `Para`.** Hoy ningún consumidor reacciona al veredicto de `acceptance-report.md`. Conviene expresar el beneficio en términos de lectura uniforme ("para que el último gate use el mismo vocabulario y lo pueda leer CI o un orquestador") y no como un retorno a implementar que queda fuera de alcance.

**CNF-1 sin escenario que lo verifique.** Ningún AC comprueba que la validación criterio por criterio, `session-status` y la reanudación no cambien. La fila `partial` de AC-1 puede agregar `Y el frontmatter declara "session-status: partial"` para fijar la convivencia de los dos campos.
