---
type: finvest-evaluation
story-id: STORY-193
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que actualiza agile-sddf a 6.0.0
> **Quiero** que `/skill-preflight` informe con un `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` (fuera de `archive/`) con `status` `READY-FOR-IMPLEMENT` o `READY-FOR-DEV`, junto con el estado al que editarlo a mano, sin modificar ningún archivo
> **Para** cerrar la ventana de transición sabiendo qué falta migrar

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas. El rol es real (quien actualiza a 6.0.0), el `Quiero` describe lo que el usuario ve (un `[WARNING]` por archivo con su destino) y el `Para` dice el beneficio: saber qué falta migrar antes de que termine la ventana. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 escenario alternativo, como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Declara una sola dependencia: STORY-186 (`SPECIFY/DONE`, ADR aún no escrito). El mensaje cita el ADR y la versión en la que termina la ventana, y las dos cosas las fija ese ADR. La regla de destino ya está en la épica, así que el trabajo puede empezar con marcadores para el número de ADR y la versión. No bloquea, pero el texto final depende de STORY-186. |
| **N** – Negociable | 4 | Dice qué se informa y con qué destino, sin fijar el texto literal del `[WARNING]` ni cómo se detecta. El punto de inserción y el formato de las señales L1-L3 quedan en Notas como referencia, no como diseño impuesto. |
| **V** – Valiosa | 4 | El beneficio se ve en cada ejecución: la lista de archivos que hay que editar y a qué estado. Es cualitativo pero comprobable, y cubre la parte de preflight de CS-4, SMOKE-3 y CS-7 de EPIC-029. |
| **E** – Estimable | 4 | Cambio localizado en una verificación de `skills/skill-preflight/SKILL.md` (bloque `SDDF-LEGACY-DIAGNOSTIC`, verificado en el archivo), su `README.md` y `evals/evals.json`, que ya existe. Lo único abierto es el texto del mensaje. |
| **S** – Small | 2 | Siete casos: AC-1, las 5 filas de AC-2 y AC-3, con unos 12 pasos. Por la señal primaria (≥ 6 casos) correspondería 1, pero AC-1 repite la fila 1 de AC-2 y las cinco filas son una sola regla de destino sobre una sola verificación. Dividirla no daría partes con valor propio. |
| **T** – Testeable | 5 | Salidas exactas: ruta, status legado y destino por archivo, ningún `[WARNING]` en el caso migrado y ningún archivo modificado. Todo se automatiza con evals sobre fixtures. CNF-1 y CNF-2 se comprueban con la salida y con `git status`. |

**INVEST_Score = (3 + 4 + 4 + 4 + 2 + 5) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):** planificar STORY-193 después de que el ADR de STORY-186 esté aceptado, o diseñar el mensaje con dos marcadores (`<ADR>` y `<versión>`) y cerrarlos al implementar. Basta con anotarlo en Notas; no hace falta cambiar los criterios.

**S – Small (2):** la historia es cohesiva, pero conviene quitar redundancia:
- AC-1 repite la fila 1 de AC-2. Se puede dejar AC-1 como escenario principal y quitar esa fila, o dejar AC-1 solo para afirmar «ningún archivo cambia».
- La fila `epic.md · READY-FOR-IMPLEMENT` cubre un caso que el framework nunca escribió en una épica. Si se conserva, que sea como prueba de robustez de la regla («toda épica legada → `PLAN/DONE`»). Si no, se puede quitar.

**Observaciones menores (sin efecto en el score):**
- La tabla de AC-2 no tiene la combinación `story.md · READY-FOR-DEV · existe`. La regla general la cubre (`IMPLEMENT/TODO`), pero conviene decir en Notas que el destino de una historia depende solo de `implement-report.md`, sea cual sea el status legado.
- CNF-1 dice que un frontmatter ilegible no interrumpe el diagnóstico, pero ningún escenario lo cubre. Conviene que CNF-3 lo incluya entre los casos de evals.
