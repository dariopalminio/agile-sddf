---
type: finvest-evaluation
story-id: STORY-172
finvest-score: 4.10
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.10 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que canceló una épica
> **Quiero** archivarla con `/epic-complete EPIC-NN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`
> **Para** sacar de `specs/flow/` el trabajo que ya no se hará sin que una épica cancelada se confunda con una liberada en el registro histórico

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` como en el template; rol real (Solo Builder que canceló una épica), acción concreta (comando y destino) y beneficio observable (`specs/flow/` limpio y registro histórico sin ambigüedad CANCELED vs. liberada). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 alternativo y AC-3 de conflicto, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 4 | Tres bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`; no hay `Pero` ni Scenario Outline con `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Declara dependencia de STORY-171 («requiere el skill y el ADR»), que sigue en `SPECIFY/IN-PROGRESS`. Sin el skill `epic-complete` no hay dónde añadir la rama `CANCELED/DONE`; se puede simular parcialmente reutilizando el patrón de `/story-complete`. |
| **N** – Negociable | 4 | Describe el resultado esperado (destino, status conservado, sin sobreescritura), no la implementación; deja abierto cómo se mueve el directorio y cómo se pide la confirmación. |
| **V** – Valiosa | 4 | Valor claro y verificable para el Solo Builder: `specs/flow/` sin trabajo abandonado y épicas canceladas distinguibles de las liberadas en el archivo. Cierra CS-19 junto con STORY-171. |
| **E** – Estimable | 4 | Alcance acotado (una rama más del skill) con antecedente directo en `/story-complete`, que ya archiva historias `CANCELED/DONE` sin cambiar su status. La incertidumbre residual depende del diseño que fije STORY-171. |
| **S** – Small | 3 | 3 escenarios (principal, alternativo y conflicto), 15 pasos en total; tamaño ideal en número de escenarios, algo cargado en pasos (AC-1 tiene 3 `Y` en el `Entonces`). |
| **T** – Testeable | 4 | Resultados observables (ruta destino, `status`/`substatus` en `epic.md`, ausencia en `specs/flow/`, ningún archivo movido); cubre camino feliz, rechazo y conflicto. CNF-3 y CNF-4 no tienen umbral verificable. |

**INVEST_Score = (2 + 4 + 4 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.10 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (2)

- Secuenciar explícitamente: no activar STORY-172 hasta que STORY-171 esté al menos en `PLAN/DONE` con su ADR aceptado; dejarlo en las Notas como precondición de inicio, no solo como «Dependencia».
- Para reducir el acoplamiento, indicar en las Notas qué contrato de STORY-171 se reutiliza (resolución de `EPIC-NN`, cálculo de `<YYYY-MM-DD>`, paso de confirmación y detección de conflicto), de modo que esta historia solo añada la rama `CANCELED/DONE` y pueda probarse con un stub del skill si STORY-171 se retrasa.

### S – Small (3)

- El tamaño es adecuado; si se quiere aligerar, AC-1 puede verificar «conservando el historial de git» y «ya no aparece en specs/flow/» como un único resultado («el directorio se movió con `git mv`»), o dejar la verificación del historial de git a la suite de integración de STORY-169.
- AC-3 (conflicto de destino) probablemente ya lo cubra STORY-171 para las épicas `SHIP/DONE`; si comparten implementación, valorar referenciarlo en lugar de duplicarlo.

### Formato — Gherkin (4)

- Añadir un `Pero` en AC-1 para hacer explícita la invariante de CNF-1, por ejemplo: `Pero no escribe status: COMPLETED en epic.md`.
- Opcional: convertir AC-2 en Scenario Outline con `Ejemplos` para otros substatus no archivables de `CANCELED` (si existen), o para dejar claro que el rechazo de otros status (`PLAN`, `IN-PROGRESS`, etc.) es responsabilidad de STORY-171.

### T – Testeable (observación menor)

- CNF-3 y CNF-4 («progressive disclosure», «tamaño óptimo») no son verificables tal como están; darles un umbral (p. ej., límite de líneas de `SKILL.md` o detalle en `references/` cargado bajo demanda) o remitir al lint de skills existente.
- Añadir una aserción verificable para CNF-2: escenario o paso en el que, sin confirmación, ningún archivo se mueve.
