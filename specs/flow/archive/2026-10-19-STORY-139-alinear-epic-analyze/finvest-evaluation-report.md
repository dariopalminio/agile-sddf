---
type: finvest-evaluation
story-id: STORY-139
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que consume `epic-analyze-report.md` desde agentes o desde CI
> **Quiero** que el reporte de análisis de épica declare su veredicto en una sección `## Veredicto` al inicio, de acuerdo con el contrato de validación
> **Para** leer el resultado de una épica igual que el de cualquier otro gate del framework

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que consume el reporte desde agentes o CI), la acción es concreta (sección `## Veredicto` al inicio) y el beneficio se puede observar (lectura uniforme entre gates). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. AC-1 es un Esquema del escenario con `Ejemplos`, y los dos escenarios usan `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-138, que está en `SPECIFY/DONE` pero no se entregó: `docs/policies/validation-contract-policy.md` todavía no existe. AC-1 se puede implementar sin la política, porque las Notas ya fijan los valores. AC-2 no se puede verificar hasta que la política esté publicada. |
| **N** – Negociable | 4 | La historia fija el resultado (`## Veredicto` primero, sin `BLOCKED`) y deja abierta una decisión de diseño: conservar o eliminar la fila del veredicto en `## Resumen`. Las Notas listan los archivos que cambian, pero eso describe el alcance y no impone una solución. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: un consumidor lee la épica con el mismo contrato que el resto de los gates. El consumidor real (`epic-validate`) está identificado y la historia confirma que no se rompe. |
| **E** – Estimable | 4 | El alcance es conocido: el template, el `SKILL.md`, el `README.md` y `evals/evals.json`, todos en texto y sin lógica nueva. La única incertidumbre es cuántos casos de eval hay que actualizar; hoy hay al menos 8 referencias a `BLOCKED`. |
| **S** – Small | 3 | Hay 2 escenarios distintos. Las 3 filas de AC-1 son datos de una sola regla de mapeo. El entregable es una edición acotada de un solo skill. |
| **T** – Testeable | 4 | AC-1 se puede automatizar con aserciones `contains`/`not_contains` sobre el reporte. Hay dos puntos débiles: el `Pero` de AC-1 es ambiguo (ver Comentarios) y AC-2 no enumera las "diferencias", así que su verificación depende de una comparación manual. |

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
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**I – Independencia (2).** Hay que implementar STORY-138 antes de empezar esta historia, o al menos publicar `docs/policies/validation-contract-policy.md`, porque el `Dado` de AC-2 la exige. Si hace falta adelantar trabajo, AC-1 se puede implementar primero: las Notas ya fijan los valores `APPROVED` / `NEEDS-REFINEMENT` y no hace falta la política para eso.

**S – Small (3).** El tamaño es adecuado y no hace falta dividirla. Para que no crezca, conviene acotar en las Notas la decisión de diseño pendiente (la fila del veredicto en `## Resumen`). También está la línea informativa `**Veredicto:** …` que el comentario de la sección `## Resumen` del template pide debajo de la tabla. Hay que decidir las dos cosas juntas para no dejar el veredicto declarado tres veces.

**T – Testeable: ambigüedad del `Pero` en AC-1.** "el reporte no declara el valor BLOCKED" puede leerse como "el texto `BLOCKED` no aparece en el reporte". Pero `BLOCKED` es un estado válido de historia (`SKILL.md:235`), y un hallazgo MAD-01 puede citarlo legítimamente como evidencia. Una eval con `not_contains: ["BLOCKED"]` fallaría con una historia hija en ese estado. Se propone precisarlo así:
```gherkin
  Pero ni la sección "## Veredicto" ni el campo "verdict" declaran el valor BLOCKED
```

**T – Testeable: AC-2.** "cada diferencia" no está enumerada. Conviene que el `Entonces` nombre los puntos que se comparan, como la posición de `## Veredicto`, el campo `verdict` del frontmatter y el vocabulario de valores, para que la verificación sea una lista de chequeo y no un juicio abierto.

**CNF-1 sin escenario que lo verifique.** El CNF exige conservar `errors` y `warnings` en el frontmatter, pero ningún AC lo comprueba. Se puede agregar `Y los campos "errors" y "warnings" del frontmatter conservan los conteos de hallazgos` al `Entonces` de AC-1, que ya distingue las filas 2 y 3 por esos conteos.

**E – Estimable: inventario completo de `BLOCKED`.** La nota "Cambian el Paso 6 de `SKILL.md`…" se queda corta. `BLOCKED` también aparece como veredicto en `SKILL.md` en la descripción (l. 19), en el catálogo MAD (l. 255), en las dos salidas de ejemplo (l. 306 y 318) y en la guía de uso (l. 335), en `README.md:11` y en al menos 6 casos de `evals/evals.json`. Hay que conservar la mención de `SKILL.md:235`, que es un estado de historia y no un veredicto.
