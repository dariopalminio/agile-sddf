---
type: finvest-evaluation
story-id: STORY-150
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** practitioner que especifica historias con SDDF
> **Quiero** que la fase de especificación de una historia lea y escriba sus artefactos en `specs/flow/STORY-NNN-<slug>/`
> **Para** que un repo recién inicializado complete la especificación de una historia sin `sddf.config.yaml` ni `SDDF_ROOT`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` del template; rol real, acción concreta y beneficio observable. |
| Criterios de aceptación | 5 | Sección presente con AC-1 (principal) y AC-2/AC-3 (alternativos/error) nombrados como `###`. |
| Escenarios Gherkin | 5 | 3 escenarios en bloques ` ```gherkin ` con `Dado/Cuando/Entonces`, `Y` y `Pero` (AC-2). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-148 (contrato de rutas fijas), declarada en `related` y Notas; la lectura de la épica padre se desacopla de STORY-151 con una épica fixture. Orden flexible con acoplamiento explícito. |
| **N** – Negociable | 4 | El `Quiero` expresa el resultado (artefactos en el layout fijo) y la lista de skills vive en las Notas; la ruta destino viene fijada por la épica, lo que limita algo el espacio sobre el cómo. |
| **V** – Valiosa | 4 | Señal observable y cualitativa: un repo recién inicializado completa la especificación sin `sddf.config.yaml` ni `SDDF_ROOT`; sin métrica cuantitativa. |
| **E** – Estimable | 4 | Alcance acotado a 6 skills (`story-creation`, `story-evaluation`, `story-refine`, `story-improve`, `story-split`, `story-specify`) con sus `assets/agents/` y evals; cambio mecánico y localizable. |
| **S** – Small | 3 | 3 escenarios con 4 pasos cada uno; el volumen de archivos (6 skills + agentes + evals) está en el límite superior de una entrega pequeña, tras el split de STORY-155 y STORY-156. |
| **T** – Testeable | 4 | AC-3 (grep + `verify:repository`) es automatizable; AC-1 y AC-2 verificables ejecutando los skills; cubre happy path, error y ausencia de referencias legadas. |

**INVEST_Score = (3 + 4 + 4 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):** la dependencia de STORY-148 es real pero está declarada. Antes de iniciar el desarrollo, confirmar que STORY-148 esté entregada (o al menos su contrato de rutas fijas acordado) y fijar la ubicación de la épica fixture `specs/flow/EPIC-NN-<slug>/epic.md` para que las pruebas de lectura de la épica padre no esperen a STORY-151.

**S – Small (3):** tamaño aceptable. Si durante el planning el volumen de `assets/agents/` o de evals resulta mayor al esperado, considerar acotar la actualización de `evals/evals.json` a una tarea separada dentro de la misma historia, sin dividirla.
