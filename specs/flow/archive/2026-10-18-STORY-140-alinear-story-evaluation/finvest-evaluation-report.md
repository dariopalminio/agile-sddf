---
type: finvest-evaluation
story-id: STORY-140
finvest-score: 4.17
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que encadena `story-evaluation` con `story-specify`, `story-improve`, `story-split` o un pipeline
> **Quiero** que el reporte FINVEST declare su veredicto al inicio y en el campo `verdict`, con el vocabulario canónico
> **Para** decidir el siguiente paso de una historia sin interpretar valores en español propios de este skill

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que encadena el skill con otros consumidores), la acción es concreta (veredicto al inicio y en `verdict`) y el beneficio se puede observar (enrutar sin interpretar valores propios del skill). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. Los dos son Esquemas del escenario con `Ejemplos`, y AC-1 usa `Y` y `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Según la épica, STORY-138 bloquea esta historia, y `docs/policies/validation-contract-policy.md` todavía no existe. Ningún AC exige la política: los valores ya están fijados en la épica (CS-5) y en AC-1. La dependencia real que queda es la decisión sobre los reportes heredados, que las Notas delegan en «la política». |
| **N** – Negociable | 4 | Fija el resultado (veredicto primero, campo `verdict`, valores canónicos) y deja abierto cómo se adapta cada consumidor. Las Notas listan archivos, pero eso describe el alcance y no impone una solución. Queda abierta una decisión de diseño: seguir leyendo `decision:` o migrar los reportes heredados. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: los orquestadores (`story-specify`, `story-improve`, `story-split`) leen el gate igual que los demás. Cubre CS-5 de EPIC-25. |
| **E** – Estimable | 3 | Se puede estimar a grandes rasgos, pero el inventario de consumidores está incompleto y tiene un elemento de más (ver Comentarios). Además, la compatibilidad con reportes heredados está sin decidir, y eso cambia el esfuerzo en `story-improve` y `story-split`. |
| **S** – Small | 2 | Hay 2 escenarios distintos; las filas de cada Outline son datos de una misma regla. El tamaño lo dan los consumidores: 4 skills (`story-evaluation`, `story-specify`, `story-improve`, `story-split`) con SKILL, README, templates, ejemplos y evals (32 apariciones de los valores antiguos solo en los `evals.json` de tres de ellos), más la compatibilidad con reportes heredados. La propia historia anticipa que puede dividirse. |
| **T** – Testeable | 4 | AC-1 tiene datos concretos y se puede automatizar con aserciones sobre el frontmatter y la primera sección. Hay tres puntos débiles: el `Pero` de AC-1 es demasiado amplio, AC-2 no cubre el camino `RECHAZAR`→`story-split` que las Notas piden conservar, y las filas 3 y 4 de AC-1 se solapan cuando S = 1 y otra dimensión también es 1. |

**INVEST_Score = (3 + 4 + 4 + 3 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**S – Small (2).** Conviene dividir la historia como sugieren las propias Notas, en la frontera natural entre los dos AC:
- **«reporte»**: AC-1. Cubre el template, el `SKILL.md` (Paso 6, l. 184, y la nota de l. 210), el README y los evals de `story-evaluation`.
- **«consumidores»**: AC-2. Cubre `story-specify`, `story-improve` y `story-split`, más la compatibilidad con reportes heredados.

Así cada parte queda acotada a un frente y se puede verificar por separado. Si no se divide, al menos hay que fijar la compatibilidad con reportes heredados antes de planificar, para que el alcance no crezca durante la implementación.

**E – Estimable (3): corregir el inventario de consumidores.**
- **Sobra `scripts/migrate-finvest-field.js`.** No consume la decisión del reporte. Solo detecta el literal heredado `**FINVEST Decisión:**` en el cuerpo de `story.md` (STORY-090) y comprueba si existe `finvest-evaluation-report.md`, sin leer su valor. No tiene ningún literal `APROBADA` que cambiar.
- **Faltan:**
  - `skills/story-evaluation/evals/evals.json` (10 apariciones) y el README del skill.
  - `skills/story-specify/evals/evals.json` (16).
  - `skills/story-improve/evals/evals.json` (6), `assets/improvement-log-template.md` y los ejemplos `example-aprobada-input/` y `example-refinar-input/`, que incluyen `finvest-evaluation-report.md` con `decision:`.
  - Los ejemplos de `skills/story-split/examples/`.
  - La copia central `docs/templates/story-template.md`. Su comentario de escritor de `status` (l. 8) también dice «decisión APROBADA», igual que la de `skills/story-creation/assets/story-template.md`.
- **Precisar el «Estado actual».** El campo `decision:` del frontmatter no está en `evaluation-output-template.md`, que no tiene frontmatter. Está definido en el Paso 6 de `skills/story-evaluation/SKILL.md` (l. 184).

**I – Independencia (3).** Hay que cerrar en la propia historia la opción de las Notas «los consumidores siguen leyendo `decision:` o la política define una migración», en vez de delegarla en STORY-138. Así la historia no queda bloqueada por una política que todavía no existe. Una opción concreta es que `story-improve` y `story-split` acepten `verdict` y, si falta, usen `decision` con un mapeo fijo (`APROBADA`→`APPROVED`, `REFINAR`/`RECHAZAR`→`NEEDS-REFINEMENT`, `DIVIDIR`→`SPLIT`). Conviene expresarlo como un escenario.

**T – Testeable: el `Pero` de AC-1 es demasiado amplio.** «el reporte no contiene … los valores APROBADA, REFINAR, RECHAZAR o DIVIDIR» se traduce en un `not_contains` sobre todo el archivo. Esa aserción falla en dos casos:
- Cuando las observaciones o recomendaciones citan la historia evaluada. Por ejemplo, al evaluar esta misma historia o cualquier hermana de EPIC-25, que mencionan esos valores.
- Cuando el texto del gateway explica la regla de decisión.

Se propone limitarlo a lo que es contrato:
```gherkin
  Pero el frontmatter no declara el campo "decision"
    Y ni la sección "## Veredicto" ni el campo "verdict" usan los valores APROBADA, REFINAR, RECHAZAR o DIVIDIR
```

**T – Testeable: precedencia entre las filas 3 y 4 de AC-1.** Si S = 1 y otra dimensión también vale 1, las dos filas aplican. El `SKILL.md` actual ya es ambiguo en este punto: la regla crítica 1 (l. 139) dice que S = 1 da `DIVIDIR` «independientemente del score», pero el ejemplo de l. 354 resuelve `RECHAZAR` con I, E y S = 1. Hay que declarar qué gana, `SPLIT` o `NEEDS-REFINEMENT`, y agregar una fila al Outline. Esto no cambia la rúbrica ni los umbrales (CNF-1): solo explicita una precedencia.

**T – Testeable: AC-2 no cubre el camino que las Notas piden conservar.** Hoy `story-specify` (SKILL.md l. 212) invoca `story-split` cuando la decisión es `RECHAZAR` y la evaluación recomienda dividir. En AC-2, la fila `NEEDS-REFINEMENT` solo lleva a `story-improve`. Conviene agregar una fila, por ejemplo `NEEDS-REFINEMENT con recomendación de división | invoca story-split`, o declarar explícitamente que ese camino se abandona.
