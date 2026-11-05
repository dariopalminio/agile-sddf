---
type: finvest-evaluation
story-id: STORY-152
finvest-score: 4.05
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.05 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** practitioner que usa los skills de proyecto y de mantenimiento de la memoria
> **Quiero** que `project-*`, `memory-system`, `header-aggregation`, `reverse-engineering`, `sddf-constitution` y `skill-preflight` usen rutas fijas, que `skill-preflight` diagnostique el layout legado y que el alias deprecado `docs-wiki-builder` se elimine en lugar de migrarse
> **Para** que esos skills funcionen en un repo recién inicializado sin `sddf.config.yaml` ni `SDDF_ROOT`, que un proyecto con layout legado reciba al ejecutar `/skill-preflight` un diagnóstico que nombra cada señal detectada y la guía de migración, y que no se invierta esfuerzo en migrar un alias cuya eliminación ya estaba anunciada

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Sección y cláusulas completas. `Para` ahora expresa beneficios observables para el practitioner. `Quiero` sigue agrupando tres cambios distintos en una sola cláusula. |
| Criterios de aceptación | 5 | Sección presente con AC-1…AC-4: escenarios principales y alternativos nombrados como subapartados `###`. |
| Escenarios Gherkin | 5 | 4 escenarios en bloques ` ```gherkin ` con Dado/Cuando/Entonces/Y/Pero (AC-2 y AC-4 usan `Pero`). |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | El desacople de STORY-148 (verificación por `grep` mientras el gate no exista) y de STORY-154 (solo se exige la ruta de la guía) está declarado. Aun así, el `Dado` de AC-1 presupone la lista transitoria del gate, y AC-1/AC-3 presuponen el layout `specs/flow/` de STORY-147/149. Las dependencias son reales, aunque mockeables. |
| **N** – Negociable | 4 | Ahora documenta criterios de éxito: AC-1 se apoya en un resultado observable (el gate o su equivalente) y AC-4 acota directorios, no archivos a editar. El inventario y las referencias quedan en Notas «a revisar en el diseño». La eliminación de `docs-wiki-builder` es una decisión de producto justificada, no una imposición técnica. |
| **V** – Valiosa | 4 | `Para` describe beneficios observables: skills operativos sin configuración y un diagnóstico que nombra cada señal legada. CNF-3 aporta una métrica de cierre verificable (0 coincidencias; hoy 26 archivos, cifra confirmada en el repo). |
| **E** – Estimable | 4 | El inventario por skill (26 archivos en 10 skills más 3 en `skill-preflight`) y las referencias de `docs-wiki-builder` permiten una estimación confiable. El orden sugerido 3 → 1 → 2 reduce incertidumbre. |
| **S** – Small | 2 | 4 escenarios y unos 19 pasos Gherkin. La propia historia reconoce tres entregas independientes (rutas fijas, diagnóstico de preflight, eliminación del alias). |
| **T** – Testeable | 4 | AC-2 ya enumera las tres señales legadas y AC-4 usa una aserción objetiva (la cadena no aparece en los directorios listados). Falta un `Scenario Outline` para AC-2. AC-1 (segundo paso) y AC-2/AC-3 se verifican vía evals de skill, no con un comando determinista. |

**INVEST_Score = (3 + 4 + 4 + 4 + 2 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.05 / 5.0

---

## Comentarios y Recomendaciones

La historia aplicó las recomendaciones de la evaluación anterior (3.80) en I, N, V, E y T. Queda aprobada por poco margen (4.05) y con S = 2, así que conviene revisar estos puntos durante el planning:

**I – Independencia (3):**
- Añadir STORY-148 y STORY-154 a `related` del frontmatter. Hoy solo figuran en Notas.
- En AC-1, cubrir explícitamente en el diseño el caso «gate aún no entregado» (la verificación alternativa por `grep` ya está en Notas) y preparar un fixture con `specs/flow/` para el segundo paso, por si STORY-149 no está entregada.

**S – Small (2):** la recomendación de dividir sigue vigente. Si se mantiene unida, implementar en el orden 3 → 1 → 2 que propone la historia y cerrar cada bloque con su propio commit verificable:
1. Eliminación de `docs-wiki-builder` (AC-4).
2. Migración a rutas fijas (AC-1, CNF-3).
3. Diagnóstico en `skill-preflight` (AC-2, AC-3, CNF-1).

Si el planning revela más esfuerzo del estimado, dividir con `/story-split` usando ese mismo corte.

**Formato – `Quiero` (4):** separar mentalmente los tres objetivos ayudaría al split. Si no se divide, basta con dejarlo como está.

**T – Testeable (4):** convertir AC-2 en `Scenario Outline` con una fila de `Ejemplos` por señal (`docs/specs/`, clave `root`, `SDDF_ROOT`) para llegar a 5.
