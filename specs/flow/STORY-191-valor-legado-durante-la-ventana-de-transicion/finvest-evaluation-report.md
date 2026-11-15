---
type: finvest-evaluation
story-id: STORY-191
finvest-score: 4.00
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** APPROVED

## Historia evaluada

> **Como** Solo Builder que actualiza agile-sddf a 6.0.0 con historias ya planificadas
> **Quiero** que `/story-implement` y `/story-implement-tasks` acepten `READY-FOR-IMPLEMENT/DONE` durante la ventana de transición, con un aviso, y la traten como `IMPLEMENT/TODO` si existe `implement-report.md` o como `PLAN/DONE` si no, y que `/skill-preflight` informe con un `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` (fuera de `archive/`) con un `status` legado, junto con el estado al que editarlo a mano, sin modificar ningún archivo
> **Para** no bloquear el trabajo planificado antes de actualizar y cerrar la ventana de transición sabiendo qué falta migrar

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real con contexto (actualiza a 6.0.0 con trabajo planificado), acciones concretas y beneficio observable. El `Quiero` junta dos pedidos (ejecutores y `skill-preflight`); eso pesa en S, no en el formato. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 con datos y AC-3 alternativo/error como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`, todos Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-186 (regla y duración de la ventana; ADR-0022 aún no existe), STORY-188 y STORY-189 (estados de entrada) y STORY-190 (aviso de `IMPLEMENT/TODO` sin `fix-directives.md`, fila 3 de AC-1), y STORY-190 acaba de recibir `SPLIT`. La parte de `skill-preflight` solo depende de STORY-186, como dicen las Notas. |
| **N** – Negociable | 3 | El `Quiero` fija la regla de clasificación completa y el formato del mensaje, así que queda poco que negociar sobre el cómo. Es coherente con la regla que fijará el ADR (CNF-1), pero la historia la repite en vez de remitir a ella. |
| **V** – Valiosa | 4 | Los proyectos consumidores no se bloquean al actualizar y saben qué editar a mano. Cubre SMOKE-3 y parte de CS-4. Ningún work item de este repo tiene hoy `READY-FOR-*`, así que el valor se ve solo en los consumidores. |
| **E** – Estimable | 3 | La regla es clara y el punto de inserción en `skill-preflight` está localizado (tabla L1-L3), pero toca tres `SKILL.md`, sus evals y un README, y la versión en la que termina la ventana depende del ADR. |
| **S** – Small | 1 ⚠️ | 11 escenarios contando las filas de Ejemplos (AC-1: 4, AC-2: 5, AC-3: 2), unos 16 pasos y dos tablas de ≥ 4 filas. Supera de lejos el umbral de épica de la rúbrica (≥ 6 escenarios, ≥ 11 pasos). Se aprueba de todos modos. |
| **T** – Testeable | 5 | Los tres Outline tienen datos concretos y resultados exactos (equivalente, destino, `[WARNING]`, lista de estados aceptados, «ningún archivo cambia»), y se pueden automatizar directamente en los evals. |

**INVEST_Score = (2 + 3 + 4 + 3 + 1 + 5) / 6 = 3.00 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 1 / 5 ⚠️ --> Se aprueba de todos modos (Decisión del Product Owner). 
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.00 / 5.0

---

## Comentarios y Recomendaciones

- **S – Small (1) ⚠️:** la reagrupación con STORY-193 se justificó para no diseñar la regla dos veces, pero la regla la diseña el ADR de STORY-186 (CNF-1): cada parte solo la aplica. Propuesta de `/story-split` por la costura que ya marcan las Notas:
  - **Core (ejecutores):** AC-1 y la fila 1 de AC-3, con CNF-2 (parte de ejecutores), CNF-4 y CNF-5 (parte de ejecutores). Quedan 5 escenarios.
  - **Hermana (`skill-preflight`):** AC-2 y la fila 2 de AC-3, con CNF-3. Solo depende de STORY-186 y puede ir primero. Para dejarla en 5 escenarios o menos, fusionar las dos filas de `epic.md` de AC-2 en una («`epic.md` con cualquier status legado → `PLAN/DONE`»), que comparten destino y regla.
  - En la core, las filas 1 y 4 de AC-1 prueban el mismo camino (sin `implement-report.md` → `PLAN/DONE`) con distinto ejecutor. Si hace falta achicar más, dejar una y cubrir el otro ejecutor en los evals.
Se aprueba de todos modos (Decisión del Product Owner). 
- **I – Independencia (2):** con el split, la hermana de `skill-preflight` solo depende de STORY-186, y la core sigue esperando a STORY-188, STORY-189 y STORY-190. La fila 3 de AC-1 (aviso de `IMPLEMENT/TODO` sin `fix-directives.md`) depende de la parte de ejecutores de STORY-190: si STORY-190 se divide, actualizar esta referencia al slug de la hermana que se lleve ese aviso.
- **N – Negociable (3):** en el `Quiero`, remitir a «la regla del ADR de la ventana de transición» en vez de repetir la clasificación entera. El detalle ya está en CNF-1 y en las tablas de Ejemplos.
- **E – Estimable (3):** cuando ADR-0022 esté aceptado, escribir en CNF-1 la versión concreta en la que termina la ventana, para que los mensajes y los evals tengan un valor fijo.
- **Trazabilidad (fuera de FINVEST):** `related` incluye `STORY-193-aviso-de-estados-legados-en-skill-preflight`, que ya no existe: esta historia la absorbió y el ID STORY-193 lo usa ahora `STORY-193-guias-readme-y-ejemplos-sin-buffers`. Conviene retirar la referencia o dejar que `/epic-refine` la marque como rota (MAD-02).
