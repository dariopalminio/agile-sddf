---
type: finvest-evaluation
story-id: STORY-142
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que usa `story-verify` como gate antes de ACCEPTANCE en un pipeline CI
> **Quiero** que `verify-report.md` declare un veredicto explícito (`APPROVED`, `NEEDS-CHANGES` o `BLOCKED`) en su frontmatter y en una sección `## Veredicto` al inicio
> **Para** que el pipeline lea el resultado de la verificación sin interpretar el resumen de pruebas ni los mensajes de consola

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que usa `story-verify` como gate en CI), la acción es concreta (veredicto en el frontmatter y en `## Veredicto`) y el beneficio se puede observar (el pipeline lee un campo en lugar de interpretar el resumen). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. AC-1 es un Esquema del escenario con `Ejemplos`, y AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-138, que está en `SPECIFY/DONE` pero no se entregó: `docs/policies/validation-contract-policy.md` todavía no existe. A diferencia de STORY-139, ningún `Dado` exige la política. Los tres valores y la regla de precedencia ya están fijados en las Notas, así que la historia se puede implementar sin esperar y alinear después. |
| **N** – Negociable | 4 | Fija el resultado (veredicto en frontmatter y en `## Veredicto`, sin vocabulario de rechazo) y deja abiertas decisiones de diseño, como la etiqueta `(REJECTED)` de la transición de story.md. Las referencias a líneas de `SKILL.md` describen el estado actual y no imponen una solución. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: CI lee `verdict` sin analizar texto libre. Cubre CS-8 y SMOKE-2 de EPIC-25. El consumidor dentro del framework (`story-implement`) todavía no lee el reporte, y la historia lo declara con honestidad. |
| **E** – Estimable | 3 | Hay que editar el template, el `SKILL.md`, el `README.md` y `evals/evals.json`, todos en texto. Pero `BLOCKED` es lógica nueva: hoy el skill no tiene una condición "pruebas no ejecutables". Un comando con código distinto de 0 se registra como fallido (`SKILL.md:316`) y los `⚠️` del DoD no afectan el resultado (l. 467–472). Tampoco está definida la transición de story.md con `BLOCKED`. Se puede hacer una estimación gruesa, con incertidumbre sobre esos dos puntos. |
| **S** – Small | 3 | Hay 2 escenarios distintos. Las 3 filas de AC-1 son datos de una sola regla de mapeo. El entregable se limita a un solo skill, pero suma la detección de `BLOCKED` y una regla de precedencia nueva. |
| **T** – Testeable | 4 | AC-1 se puede automatizar con aserciones sobre el frontmatter y la primera sección. AC-2 se puede verificar con `not_contains`. Hay tres puntos débiles: la condición de la fila 3 no es operativa, la regla de precedencia del PO no tiene escenario y el `Pero` de AC-2 choca con el historial de ejecuciones (ver Comentarios). |

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

**E – Estimable (3): definir de forma operativa "pruebas no ejecutables".** El skill actual no distingue un fallo de un bloqueo. En modo config-driven, un comando con código distinto de 0 se registra como fallido (`SKILL.md:316`). En modo manual, el agente `qa-engineer.agent.md` ya marca escenarios como `BLOCKED` (l. 49 y 104), pero el Paso 6e no usa ese estado. Conviene enumerar en las Notas qué cuenta como bloqueo, por ejemplo: runner o framework no instalado, comando no encontrado, `qa-output.json` con escenarios `BLOCKED` o ningún test ejecutado. Así la fila 3 de AC-1 es implementable y no depende de cómo se interprete.

**E – Estimable (3): transición de story.md con `BLOCKED`.** Hoy solo existen dos ramas: `VERIFY/DONE` y `READY-FOR-IMPLEMENT/DONE` (`SKILL.md:495–507`). La historia no dice qué estado toma story.md con `BLOCKED`. El flowchart dice que "detiene el flujo", y las Non-Goals no excluyen esta decisión. Hay que fijarla en las Notas, por ejemplo dejando story.md sin cambios, o declararla fuera de alcance.

**T – Testeable: el `Pero` de AC-2 choca con el historial de ejecuciones.** `verify-report.md` conserva la sección `## Historial de Ejecuciones Anteriores` de los reportes previos (Paso 6a, `SKILL.md:398–405`), y cada entrada registra `VERIFY-PASSED / VERIFY-REJECTED` (l. 480). Un reporte regenerado sobre una historia que ya fue rechazada contendría `REJECTED` en el historial, y la eval fallaría. SMOKE-2 de la épica exige que no aparezca "en ninguna parte del reporte". Hay que cambiar el formato de las entradas nuevas a `Veredicto: <verdict>` y decidir qué hacer con las entradas heredadas: normalizarlas al reescribir o excluir la sección de la aserción.

**T – Testeable: la regla de precedencia no tiene escenario.** La decisión del PO ("si hay fallos y bloqueos a la vez, gana `NEEDS-CHANGES`") solo está en las Notas. Se puede agregar como cuarta fila del Outline sin cambiar el tamaño, porque es la misma regla de mapeo:
```gherkin
  | defectos o criterios fallidos y pruebas no ejecutables | NEEDS-CHANGES |
```

**N – la nota sobre `(REJECTED)` ya está decidida por AC-2.** La nota dice "hay que revisar si la etiqueta `(REJECTED)` … también pasa a `NEEDS-CHANGES`". Pero el `Pero` de AC-2 prohíbe `REJECTED` en la salida de consola, y hoy el resumen imprime `READY-FOR-IMPLEMENT/DONE (REJECTED)` (`SKILL.md:530`). La revisión no es opcional, así que conviene reescribir la nota como decisión.

**E – inventario completo de los cambios.** La nota de estado actual solo cita el template y `SKILL.md:472`. También usan el vocabulario de rechazo:
- en `SKILL.md`, la entrada de historial (l. 480), los mensajes de consola (l. 511, 530 y 533) y la sección Salida (l. 541);
- `README.md`, que además declara `VERIFY/REJECTED` como transición (l. 8 y 56) y contradice a `SKILL.md`;
- `evals/evals.json`, donde TC-004 espera `VERIFY RECHAZADO` en `contains` (l. 119) y TC-001 lo usa en `not_contains` (l. 31).

Hay que conservar las menciones de `BLOCKED` en `agents/qa-engineer.agent.md`, porque son estados de escenario y no veredictos.

**I – Independencia (3).** Conviene implementar después de que se publique `docs/policies/validation-contract-policy.md` (STORY-138) para citarla desde `SKILL.md`. Si se adelanta, basta con los valores de las Notas y una tarea para alinear la referencia después.

**CNF-1 sin escenario que lo verifique.** "También cuando no se ejecutó ninguna prueba" coincide con la fila 3 de AC-1, pero solo si "no ejecutables" incluye "cero pruebas ejecutadas". Al definir la condición operativa de la primera recomendación, hay que asegurar que ese caso esté cubierto.
