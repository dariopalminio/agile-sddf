---
type: finvest-evaluation
story-id: STORY-166
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que define una épica
> **Quiero** que `/epic-format-validation EPIC-NN` declare un veredicto canónico (`APPROVED` o `NEEDS-REFINEMENT`) en lugar de `APROBADO` / `REFINAR` / `RECHAZADO`, con el diagnóstico de cada defecto
> **Para** que el bucle de `DEFINE` decida si avanza a `PLAN` o pasa por `/epic-improve` sin interpretar texto libre

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` según el template; rol real (Solo Builder), acción concreta y beneficio verificable (decisión del bucle `DEFINE` sin interpretar texto libre). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 alternativo y AC-3 de error nombrados como `###`, más AC-4 de coherencia. |
| Escenarios Gherkin | 5 | 4 bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`; AC-3 usa `Pero` en el escenario de error. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | El núcleo es autónomo, pero el último paso de AC-2 depende de `/epic-improve` (STORY-167), que aún no existe en `skills/`. Las demás dependencias (`validation-contract-policy.md`, `flowchart-skill-epic-flow-relationship.mermaid`) ya existen. |
| **N** – Negociable | 3 | Qué y por qué claros, pero AC-4 fija secciones concretas de la política (§1, §4) y nombres de archivo; queda poco margen para negociar el cómo. |
| **V** – Valiosa | 4 | Valor claro y observable: el gate de `DEFINE` se vuelve determinista y alineado con el contrato de validación. |
| **E** – Estimable | 3 | Alcance de forma claro, pero el impacto en consumidores es amplio (98 apariciones de `APROBADO`/`REFINAR`/`RECHAZADO` en 13 archivos de `skills/`, incluidos `epic-creation` y varios `evals.json`) y queda abierta la decisión sobre `BLOCKED` para el caso «no encontrado». |
| **S** – Small | 2 | 4 escenarios con unos 19 pasos, más el trabajo de CNF-2 (actualizar consumidores y evals). Está en el límite de una historia grande. |
| **T** – Testeable | 4 | AC-1, AC-3 y AC-4 son verificables de forma objetiva; AC-2 tiene un paso subjetivo («el diagnóstico es suficiente para que /epic-improve aplique…») que hoy no se puede verificar sin STORY-167. |

**INVEST_Score = (3 + 3 + 4 + 3 + 2 + 4) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):** reemplaza el paso «el diagnóstico es suficiente para que /epic-improve aplique las correcciones sin volver a analizar la épica» por un contrato verificable sin STORY-167. Por ejemplo: «Y cada defecto indica la sección o línea afectada, la regla incumplida y el texto esperado». Así STORY-167 consume ese contrato en lugar de condicionar esta historia.

**N – Negociable (3):** deja en AC-4 el resultado esperado («la política registra a epic-format-validation con sus valores permitidos y el flowchart es coherente») y pasa la ubicación exacta (§1, §4) a `## 📎 Notas`. Así hay margen para reorganizar la política sin invalidar el criterio.

**E – Estimable (3):**
- Cierra antes del planning la decisión pendiente en Notas: ¿«épica inexistente» emite `BLOCKED` o termina con error sin veredicto? AC-3 ya asume lo segundo; registra la decisión y elimina la pregunta abierta.
- Amplía CNF-2 con la lista real de consumidores. Además de `epic-from-project-plan`, usan los valores heredados `epic-creation` (SKILL.md, examples y evals.json) y los `evals.json` de `epic-format-validation`, `epic-generate-stories`, `story-verify` y `story-evaluation`.

**S – Small (2):** la historia está cerca del límite. Si al planificar el impacto en consumidores resulta grande, considera dividirla con `/story-split` (patrón «operaciones/variaciones de interfaz»):
1. **Core:** `epic-format-validation` emite `APPROVED` / `NEEDS-REFINEMENT` con diagnóstico (AC-1, AC-2, AC-3) y la política se actualiza (AC-4).
2. **Hermana:** migrar los consumidores (`epic-creation`, `epic-from-project-plan`) y sus evals al vocabulario canónico (CNF-2).

Si se mantiene unida, `/story-plan` debería reflejarlo en `tasks.md` como bloques separados.

**T – Testeable (4):** ver la recomendación de I: con el diagnóstico estructurado (ubicación + regla + corrección), AC-2 queda verificable sin STORY-167.
