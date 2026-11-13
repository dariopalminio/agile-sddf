---
type: finvest-evaluation
story-id: STORY-194
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que aprende agile-sddf con sus guías, su README y los ejemplos de los skills
> **Quiero** que las guías de `docs/guides/`, `docs/architecture/sdcl-sddf.md`, el diagrama de relaciones del flujo de story, `README.md`, el indicador de `docs/product/objectives.md` y los ejemplos y fixtures de `memory-system`, `story-design`, `story-tasking` y `story-fix-plan` (este último también en su `evals.json`) muestren los workflows sin buffers
> **Para** no aprender un estado que el framework ya no escribe

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas. El rol es real (quien aprende el framework con sus guías y ejemplos), el `Quiero` nombra los artefactos que lee y el `Para` dice el beneficio: no aprender un estado obsoleto. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 y AC-4 escenarios alternativos, como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Cuatro bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un Scenario Outline con tabla `Ejemplos`; AC-3 y AC-4 usan `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | AC-1 depende de que el resto de EPIC-029 esté completo, y las Notas lo declaran («va al final de la épica»). Las guías y los fixtures se pueden editar antes con lo que fija EPIC-029, así que la dependencia es parcial. Pero las referencias están desactualizadas tras los splits: AC-1 solo nombra STORY-186 a STORY-193 y omite STORY-195 a STORY-199; `related` apunta a `STORY-187-dominio-y-requisitos-sin-buffers`, que ya se llama `STORY-187-dominio-sin-estados-buffer`; y Fuera de alcance atribuye `state-machine.md` y los requisitos a STORY-187 cuando ahora son de STORY-195. |
| **N** – Negociable | 4 | Define el resultado (el `grep` limpio y qué flujo ve el lector en cada artefacto), no cómo redactarlo. AC-4 deja la redacción del indicador a la confirmación del PO. La lista de archivos va en Notas como inventario, no como solución. |
| **V** – Valiosa | 4 | El valor es claro para quien aprende el framework: que la documentación no enseñe estados que los skills ya no escriben. Se puede comprobar con el `grep` de AC-1, aunque el beneficio para el lector es cualitativo. |
| **E** – Estimable | 4 | El inventario de Notas coincide con el `grep` actual: 4 guías, `sdcl-sddf.md`, el `.mermaid`, `README.md`, `objectives.md`, `skills/story-specify/README.md`, los 11 fixtures de `memory-system`, los ejemplos de `story-design` y `story-tasking` y 3 archivos de `story-fix-plan`. Es reemplazo de texto con volumen conocido; la única incertidumbre es la redacción del indicador (AC-4). |
| **S** – Small | 2 | Ocho casos (AC-1, las 5 filas de AC-2, AC-3 y AC-4) y unos 20 pasos sobre unos 30 archivos. Por la señal primaria (≥ 6 casos) correspondería 1, pero el cambio es el mismo en todos los artefactos (quitar el estado intermedio y apuntar al workflow del ADR), y AC-1 es la verificación agregada de CS-6, que solo tiene sentido al final. Dividirla en guías por un lado y fixtures por otro es posible, pero el `grep` de cierre seguiría necesitando las dos partes. |
| **T** – Testeable | 3 | AC-1 y AC-3 son automatizables (`grep`, `npm test`, `npm run verify:repository`). AC-2 se verifica leyendo cada artefacto, y AC-4 requiere confirmación humana. La precondición de AC-1 («STORY-186 a STORY-193 están completadas») es incompleta: si STORY-195 a STORY-199 no están completas, el `grep` encuentra menciones que esta historia no debe tocar y el escenario falla por una causa ajena. |

**INVEST_Score = (2 + 4 + 4 + 4 + 2 + 3) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 3 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (2):** actualizar las referencias obsoletas tras los splits de la épica:
  - En AC-1, cambiar «STORY-186 a STORY-193 están completadas» por «las demás historias de EPIC-029 (STORY-186 a STORY-193 y STORY-195 a STORY-199) están completadas».
  - En `related`, reemplazar `STORY-187-dominio-y-requisitos-sin-buffers` por `STORY-187-dominio-sin-estados-buffer` y añadir `STORY-195-requisitos-sin-estados-buffer`.
  - En Fuera de alcance, separar la atribución: los documentos de dominio, de STORY-187; `state-machine.md`, `domain-skills-map.md` y los requisitos, de STORY-195.
- **S – Small (2):** se puede conservar como una sola entrega, porque el cambio es homogéneo. Si se prefiere reducirla, la división natural es por tipo de artefacto: guías, diagrama, README y `objectives.md` por un lado, y ejemplos, fixtures y `evals.json` de los skills por otro. En ese caso, AC-1 queda en la segunda historia, que es la de cierre.
- **T – Testeable (3):** con la precondición de AC-1 corregida (ver I), el escenario deja de fallar por trabajo ajeno. Además, `docs/product/objectives.md:108` describe OBJ-10 con «buffers con WIP limitado», y AC-4 solo cubre el indicador de la línea 112. Conviene que AC-4 o las Notas incluyan también esa descripción.
