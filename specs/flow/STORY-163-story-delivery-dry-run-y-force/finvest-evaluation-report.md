---
type: finvest-evaluation
story-id: STORY-163
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que usa `/story-delivery` en el flujo SDD flow-forward
> **Quiero** previsualizar la entrega con `--dry-run` y forzarla con `--force` cuando el estado previo o el DoD la bloquean
> **Para** decidir la entrega sabiendo qué pasaría antes de escribir nada y, si la fuerzo, dejar trazado qué se omitió

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` igual al template. Rol real (Solo Builder que usa `/story-delivery`), acciones concretas (previsualizar con `--dry-run`, forzar con `--force`) y beneficio observable (decidir antes de escribir y dejar trazado qué se omitió). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), escenario alternativo (AC-2) y escenario de error (AC-3), todos como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`. AC-1 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Extiende el skill `story-delivery` que crea STORY-159, que está en `SPECIFY/DONE` y todavía no se implementó; las Notas piden implementar esta después. No es una dependencia crítica: el orden es lineal y explícito, y los flags son ramas acotadas sobre el gate de STORY-159 (saltear el gate o no escribir). Aun así, no se puede codificar sin el skill base, y AC-3 cambia el mensaje de bloqueo que define STORY-159 AC-2. |
| **N** – Negociable | 4 | Fija resultados, no soluciones: no dice cómo se presenta la previsualización ni qué estructura tiene `delivery-report.md` más allá de su contenido mínimo. Los nombres de los flags vienen de la épica, y la única decisión cerrada (registrar el override en `delivery-report.md` y no en `story.md`) está justificada en las Notas. |
| **V** – Valiosa | 4 | Valor claro y observable: `--dry-run` permite decidir sin riesgo y `--force` deja una traza auditable de lo que se omitió, en línea con el patrón de reportes de los demás gates. Es un valor cualitativo, sin métrica cuantitativa. |
| **E** – Estimable | 3 | Se puede estimar en grueso (talla S) y lo que cita existe (`docs/guardrails/dod-story-deliver.md`, el plan de la épica, CS-2 y SMOKE-2). La incertidumbre está en casos límite que la historia no aclara: (1) si `--force` genera `delivery-report.md` cuando no hay nada que saltear (historia en `ACCEPTANCE/DONE` con el DoD cumplido); (2) qué pasa si con `--force` el usuario rechaza la confirmación (se supone que no se escribe nada, pero no está dicho); (3) si `--dry-run` muestra o se saltea la pregunta de confirmación; (4) desde qué estados se permite `--force` (p. ej. una historia ya en `DELIVER/DONE` o archivada); (5) cómo se cumple CNF-1 si la evaluación del DoD corre comandos (`npm run verify:repository`, `npm pack --dry-run`) que podrían escribir archivos. |
| **S** – Small | 2 | 3 escenarios más una fila adicional de `Ejemplos`: 4 casos en total, en la banda 4–5, con unos 12 pasos. El cambio real es chico (dos flags sobre un skill que ya existe más un reporte), pero la señal primaria lo ubica en «Grande». No llega al umbral de split (≥ 6 casos). Mismo criterio que se aplicó a STORY-159 y STORY-162. |
| **T** – Testeable | 4 | Happy path, alternativo y error bien formados. Los resultados se comprueban con exactitud: el frontmatter de `story.md`, la existencia de `delivery-report.md` y «ningún archivo del repositorio cambia» (verificable con `git status --porcelain` antes y después). AC-1 es un Outline con datos concretos. Una limitación: los mensajes («muestra la evaluación del DoD», «sugiere --force») describen el contenido, no son textos exactos. |

**INVEST_Score = (2 + 4 + 4 + 3 + 2 + 4) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (2)

- **Asegurar el orden y desacoplar el diseño:** activar esta historia solo cuando STORY-159 esté implementada (WIP = 1 lo obliga de todos modos). Para bajar el acoplamiento, pedir en el `design.md` de STORY-159 que el gate (estado previo + DoD) devuelva un resultado estructurado (bloqueado / motivo / criterios incumplidos) que `--dry-run` muestre y `--force` ignore, sin reescribir el flujo base.
- **Coordinar AC-3 con STORY-159 AC-2:** dejar dicho en las Notas que esta historia agrega la sugerencia de `--force` a los mensajes de bloqueo de STORY-159, y que la fila «rechaza» de STORY-159 AC-2 es justamente la excepción del `Pero`.

### E – Estimable (3)

- **Fijar cuándo se genera el reporte:** aclarar si `--force` crea `delivery-report.md` siempre o solo cuando realmente omitió algo (estado previo distinto de `ACCEPTANCE/DONE` o criterios incumplidos). Lo coherente con «dejar trazado qué se omitió» es crearlo siempre que se use `--force` y, si no se omitió nada, registrarlo explícitamente.
- **Cubrir el rechazo bajo `--force`:** agregar en las Notas (o como fila de un Outline en AC-2) que si el usuario rechaza la confirmación con `--force`, `story.md` no cambia y no se crea `delivery-report.md`, igual que CNF-3 de STORY-159.
- **Definir la confirmación en `--dry-run`:** decir que `--dry-run` no pide confirmación y que la previsualización indica que se pediría.
- **Acotar los estados desde los que se fuerza:** indicar si `--force` sobre una historia ya en `DELIVER/DONE` o archivada (`COMPLETED`) se rechaza o es idempotente; la épica dice «sin importar el estado previo», pero escribir `DELIVER` sobre `COMPLETED` retrocedería el ciclo de vida.
- **Precisar CNF-1 frente a los comandos del DoD:** aclarar que en `--dry-run` se ejecutan solo comandos sin efectos (o se verifica con `git status` que no dejaron cambios), para que «ningún archivo cambia» sea alcanzable y comprobable.

### S – Small (2)

- **No hace falta otro split:** S = 2 no es crítico y la historia ya es una hermana del split de STORY-159. Separar `--dry-run` de `--force` dejaría AC-1 fila 2 y AC-3 (que sugieren `--force`) sin el flag que mencionan.
- **Controlar el tamaño en `story-tasking`:** dos bloques (`--dry-run` con su verificación de CNF-1; `--force` con `delivery-report.md` y CNF-2) más el ajuste de mensajes de AC-3.

### Otras observaciones (score > 3)

- **T / AC-1 y AC-3:** en el diseño, fijar el texto o el patrón de la línea de acción del dry-run (p. ej. «dry-run: escribiría DELIVER/DONE») y de la sugerencia («use --force para entregar igualmente») para que los escenarios se puedan automatizar con comparación exacta.
- **T / AC-2:** definir el formato mínimo de `delivery-report.md` (frontmatter con `type`, `story-id`, estado previo y fecha; lista de criterios incumplidos) para que la prueba compare campos y no texto libre.
