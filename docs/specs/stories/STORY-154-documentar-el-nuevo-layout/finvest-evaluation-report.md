---
type: finvest-evaluation
story-id: STORY-154
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** practitioner con un proyecto que usa `root: docs` o `docs/specs/`
> **Quiero** que `AGENTS.md`, la arquitectura, el índice, las guías y el CHANGELOG describan el layout fijo, y una sección de migración en `docs/guides/artifact-directory-migration.md`
> **Para** entender el cambio incompatible y migrar mi proyecto a `specs/flow/` sin adivinar los pasos

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol concreto (practitioner con `root: docs`/`docs/specs/`), acción verificable y beneficio claro. Coincide con el encabezado `# 📖 Historia` del template. |
| Criterios de aceptación | 5 | Sección presente con AC-1 y AC-2 (principales) y AC-3 (alternativo/error) como subapartados nombrados. |
| Escenarios Gherkin | 5 | 3 escenarios en bloques ` ```gherkin ` con Dado/Cuando/Entonces, `Y` y `Pero` en el escenario de error. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Requiere el ADR de STORY-147 aceptado y que el layout exista en el filesystem (CNF-1); además es el destino de enlaces de STORY-149 y STORY-152. El orden es flexible, pero hay acoplamiento. |
| **N** – Negociable | 3 | Fija qué documentos tocar y la ruta exacta de la guía, pero no el texto. Hay margen sobre redacción y estructura, poco sobre el alcance. |
| **V** – Valiosa | 4 | Valor claro y cualitativo: el practitioner migra sin adivinar. No hay métrica (p. ej. migraciones sin consulta). |
| **E** – Estimable | 3 | Tocar AGENTS.md, arquitectura, índice, guías, CHANGELOG y la guía de migración es estimable en bruto. "las guías" no acota cuántas ni cuáles, y AC-3 puede destapar enlaces rotos adicionales. |
| **S** – Small | 3 | 3 escenarios, el mayor con 6 pasos. Es el tamaño ideal en Gherkin, pero la superficie de archivos es amplia. |
| **T** – Testeable | 4 | AC-3 se automatiza con `npm run verify:repository`. Las ausencias de "SDDF_ROOT", "root" y "SPECS_BASE" y la presencia de rutas en AC-1 y AC-2 se comprueban con búsquedas de texto. |

**INVEST_Score = (3 + 3 + 4 + 3 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

Ninguna dimensión es crítica. Recomendaciones no bloqueantes para las dimensiones con score ≤ 3:

- **I (3):** declarar la dependencia explícita en `## 📎 Notas / contexto adicional`: "requiere ADR de STORY-147 aceptado y el layout de STORY-148/149 presente". Así el orden de planificación queda claro.
- **N (3):** dejar abierto el formato de la sección de migración (tabla de equivalencias o pasos numerados), de modo que el equipo decida el cómo al planificar.
- **E (3):** enumerar en Notas qué guías de `docs/guides/` se actualizan, o acotar a "las que referencian `docs/specs/`, `root` o `SDDF_ROOT`" y verificarlo con una búsqueda en el repo. Eso reduce la incertidumbre de AC-3.
- **S (3):** si al planificar el barrido de guías resulta grande, separar la guía de migración y el CHANGELOG (AC-2) del resto de la documentación (AC-1).
