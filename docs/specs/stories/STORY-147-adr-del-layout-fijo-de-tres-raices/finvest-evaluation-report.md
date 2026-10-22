---
type: finvest-evaluation
story-id: STORY-147
finvest-score: 4.07
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.07 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que va a migrar los skills a rutas fijas
> **Quiero** un ADR aceptado que fije `docs/`, `specs/` (`flow/`, `flow/archive/`, `living/`) y `workflow/` como raíces hermanas en la raíz del repo y retire `SDDF_ROOT`, la clave `root` y `SPECS_BASE`
> **Para** que las historias de migración de skills, de `sddf-init` y de la migración de work items partan de una decisión registrada e inmutable en lugar de reinterpretar la épica

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` del template presente; rol real (mantenedor), acción concreta (ADR aceptado con raíces y retiros definidos) y beneficio específico (decisión inmutable que evita reinterpretar la épica). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal y AC-2/AC-3 alternativos como subapartados `###`, igual que el template. |
| Escenarios Gherkin | 5 | 3 escenarios en bloques ` ```gherkin ` con Dado/Cuando/Entonces/Y; AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.80 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Solo depende de ADR-0010 (ya ACCEPTED) y de la épica ya especificada; no espera ninguna otra historia. Las demás historias de EPIC-26 dependen de esta, no al revés. |
| **N** – Negociable | 3 | El qué y el por qué son claros, pero la historia ya enumera las rutas y claves retiradas, dejando poco espacio de negociación; AC-3 deja abierta la decisión sobre el slug del directorio. |
| **V** – Valiosa | 2 | Valor indirecto: habilita y ordena las historias 148–153, pero no entrega beneficio visible al usuario final del framework por sí sola (historia `chore`). |
| **E** – Estimable | 4 | Redactar un ADR con plantilla existente, marcar ADR-0010 y actualizar el README es acotado y estimable por cualquiera del equipo; la decisión abierta de AC-3 añade poca incertidumbre. |
| **S** – Small | 3 | 3 escenarios; AC-1 concentra 8 pasos con varios `Y`, pero el trabajo real es un ADR, dos campos de metadatos y una línea de índice. |
| **T** – Testeable | 4 | Escenarios con alternativo y `Pero`; las condiciones son verificables por inspección de archivos (existencia, status, `superseded-by`, línea en el README). |

**INVEST_Score = (4 + 3 + 2 + 4 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 4.80 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 2 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.07 / 5.0

---

## Comentarios y Recomendaciones

Ninguna dimensión es crítica (score = 1). Recomendaciones no bloqueantes para las dimensiones con score ≤ 3:

- **N (3):** Reducir el listado de rutas en `Quiero` a la intención («fijar el layout de raíces y retirar la resolución configurable») y dejar el detalle de rutas en AC-1, de modo que la conversación sobre el ADR no quede pre-decidida en la formulación de la historia.
- **V (2):** Cuantificar el beneficio en `Para` o en una nota, por ejemplo, que las historias 148–153 citen un único ADR en lugar de reinterpretar la épica (0 contradicciones entre historias sobre el layout), o que el ADR deje de depender de `SDDF_ROOT` en el diagnóstico de skills.
- **S (3):** Para mantener la historia pequeña, considerar mover los pasos de `Y` de AC-1 que verifican el README y el `superseded-by` de ADR-0010 al AC-2, o fusionar los verificables mecánicos en un único criterio, de forma que AC-1 no supere unos 6 pasos.
