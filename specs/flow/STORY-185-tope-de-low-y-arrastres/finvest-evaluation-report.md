---
type: finvest-evaluation
story-id: STORY-185
finvest-score: 4.02
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.02 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que lee `code-review-report.md` para decidir si corrige o avanza
> **Quiero** que el árbitro de `/story-code-review` limite los LOW por revisor y no repita en una nueva ronda los LOW de la anterior que están en líneas que el rework no tocó
> **Para** que el informe conserve señal y no me obligue a releer los mismos nits en cada ronda

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | El encabezado `# 📖 Historia:` coincide con el template. El rol es real (Solo Builder que decide si corrige o avanza), las dos acciones son concretas y el beneficio se puede observar: menos LOW repetidos en el informe. |
| Criterios de aceptación | 4 | La sección `## ✅ Criterios de aceptación` tiene dos subapartados nombrados: AC-1 con datos y AC-2 alternativo. Ninguno se llama «Escenario principal». AC-1 hace ese papel, pero la rúbrica pide que esté nombrado así para el 5. |
| Escenarios Gherkin | 5 | Hay dos bloques ` ```gherkin ` bien formados. AC-1 es un Scenario Outline con una tabla `Ejemplos` de tres filas, y AC-2 usa `Y` y `Pero`. |

**F_score = (5 × 0.4) + (4 × 0.3) + (5 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Las Notas piden implementarla después de STORY-180, que está en `SPECIFY/DONE` y todavía no se entregó. Solo la fila «REVIEW.md con "Tope de nits" de 3 LOW» de AC-1 depende de verdad de STORY-180. Las filas «sin tope declarado» y «sin REVIEW.md», y también AC-2, funcionan con el tope por defecto, y la fila restante se puede simular con un `REVIEW.md` de fixture. Es independiente de STORY-182, pero las tres historias editan el mismo Paso 4 de `skills/story-code-review/SKILL.md`. |
| **N** – Negociable | 4 | Define criterios de éxito: el tope por defecto, y que la línea no tocada se mide por su contenido. El mecanismo de detección queda para `/story-design`. Fija el punto de inserción (entre 4a y 4b) y el valor por defecto (5), y eso acota un poco la negociación. |
| **V** – Valiosa | 4 | Tiene una línea base cuantitativa: ≈580 LOW en 55 informes, con una media de ≈10 y un máximo de 21, y 20 LOW arrastrados en STORY-125. El objetivo también es medible (≤ 5 LOW por revisor por defecto). Pero el beneficio que se declara, «conservar señal», es cualitativo. Además, el tope se cumple por construcción, así que no prueba que el informe sea más útil. |
| **E** – Estimable | 3 | La ronda ya se puede detectar con `round` de `fix-directives.md` (Paso 4f.1). Quedan tres incógnitas que afectan al esfuerzo. Primero, cómo emparejar un LOW de la ronda anterior con su línea si el rework desplazó las líneas. Segundo, qué LOW se conservan cuando se aplica el tope. Tercero, cómo se combinan el tope y la omisión de arrastres: ¿el tope se aplica antes o después de quitar los arrastrados? También falta decidir qué pasa con un LOW anterior que no tiene `Archivo:Línea`. |
| **S** – Small | 2 | Tiene 4 escenarios o filas: las 3 de `Ejemplos` de AC-1 más AC-2. Suman unos 10 pasos escritos. El alcance cubre dos mecanismos distintos (el tope y los arrastres), la lectura del informe de la ronda anterior y dos evals (CNF-2). No llega a 1: hay menos de 6 escenarios y la tabla tiene menos de 4 filas. |
| **T** – Testeable | 4 | AC-1 se puede automatizar con datos concretos: 12 LOW, el tope de cada fila y el número de omitidos. AC-2 tiene resultados observables: el LOW no aparece y el HIGH o MEDIUM sí. Le falta el contraejemplo: un LOW de la ronda anterior en una línea que el rework sí tocó, que debería volver a evaluarse. Sin ese caso, un eval que omita todos los LOW anteriores también pasaría. |

**INVEST_Score = (3 + 4 + 4 + 3 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.02 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3).**
- Cambiar «implementar después de STORY-180» por «orden recomendado, no precondición», como en STORY-182. El motivo: solo la primera fila de AC-1 necesita que `REVIEW.md` llegue al árbitro, y esa fila se puede probar con un `REVIEW.md` de fixture.
- Indicar en Notas el orden de edición del Paso 4 entre STORY-180, STORY-182 y STORY-185, para que no haya conflictos en `skills/story-code-review/SKILL.md`.

**E – Estimable (3).**
- Agregar a Notas qué LOW se muestran al aplicar el tope, por ejemplo «los primeros <tope> en el orden del informe del revisor». Si no, cada implementación puede elegir uno distinto.
- Fijar el orden de las dos operaciones: primero se omiten los LOW arrastrados y después se aplica el tope a los que quedan, o al revés. Indicar también si los arrastrados cuentan en el número de «LOW omitidos».
- Indicar qué pasa con un LOW de la ronda anterior sin `Archivo:Línea`: no se puede decidir si su línea cambió. Lo más prudente es mostrarlo de nuevo.
- Dejar escrito que la ronda se detecta con `round` de `fix-directives.md` y que el informe anterior es el `code-review-report.md` vigente, que se lee antes de sobrescribirlo. Así el mecanismo de lectura deja de ser una incógnita.

**S – Small (2).**
- No hace falta otro split: S ≠ 1 y las dos reglas actúan sobre los mismos LOW en el mismo punto del árbitro. Para acotar sin dividir, en `/story-tasking` separar en tareas distintas el tope (AC-1), la omisión de arrastres (AC-2) y los evals (CNF-2).
- Si el emparejamiento de líneas desplazadas resulta costoso en `/story-design`, AC-2 se puede pasar a una historia aparte. El tope de AC-1 ya entrega valor por sí solo.

**T – Testeable (mejora no crítica).**
- Agregar a AC-2 el contraejemplo: «Y un LOW de la ronda anterior en una línea que el rework modificó» → «Entonces ese LOW se vuelve a evaluar». Así el eval distingue entre omitir solo los arrastrados y omitir todos los LOW anteriores.
