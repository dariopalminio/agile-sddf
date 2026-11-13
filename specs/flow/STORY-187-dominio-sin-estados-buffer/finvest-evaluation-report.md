---
type: finvest-evaluation
story-id: STORY-187
finvest-score: 4.25
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.25 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que consulta `docs/domains/` para entender el ciclo de vida de historias y épicas
> **Quiero** que `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md` y `domain-epic-lifecycle.md` describan los workflows sin buffers del ADR, con el rework en `IMPLEMENT/TODO`, sin WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo
> **Para** que el ciclo de vida que aprendo en el dominio sea el mismo que escriben los skills en el frontmatter

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real (lector de `docs/domains/`), acción acotada a cuatro documentos y beneficio observable (lo que el dominio describe coincide con lo que escriben los skills). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal y AC-2 y AC-3 escenarios alternativos, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 y AC-3 usan `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-186, todavía sin entregar, pero de forma desacoplada: los workflows, el destino del rework y la consulta de la cola ya están en EPIC-029, y solo la cita del ADR (AC-1) espera a su número y a su `ACCEPTED`. No depende de STORY-195. |
| **N** – Negociable | 4 | Fija resultados observables (workflows, destino del rework, consulta de la cola) y deja abierta la reorganización de cada documento. CNF-1 remite las reglas nuevas al ADR en lugar de decidirlas aquí. |
| **V** – Valiosa | 3 | Valor claro para quien aprende el ciclo de vida en `docs/domains/`, pero cualitativo: no se mide más allá de que el texto deje de contradecir a los skills. |
| **E** – Estimable | 4 | Cuatro documentos Markdown con 30 menciones de buffers contadas por archivo en Notas, más las definiciones de «Buffer», WIP y BR-004. El contenido destino está en la épica. |
| **S** – Small | 3 | Tres escenarios (rango ideal); son 14 pasos, más de lo que corresponde a ese rango, porque AC-1 y AC-3 tienen dos `Y` y un `Pero`. |
| **T** – Testeable | 4 | Los workflows de AC-1 son cadenas exactas y CNF-2 se comprueba con `grep`. AC-2 y AC-3 se verifican leyendo una sección concreta, no con un comando. |

**INVEST_Score = (3 + 4 + 3 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (3):** al planificar, redactar primero los cambios que ya fija EPIC-029 y dejar la cita del ADR para cuando STORY-186 llegue a `ACCEPTED`.
- **V – Valiosa (3):** si se quiere un indicador, CNF-2 ya da uno: cero coincidencias de `READY-FOR-IMPLEMENT`/`READY-FOR-DEV` en los cuatro documentos. Mencionarlo en el `Para` lo haría medible.
- **S – Small (3):** para bajar pasos, AC-1 puede leer solo `domain-story-lifecycle.md` y `domain-epic-lifecycle.md` y pasar `domain.md` a CNF-2, que ya cubre su vocabulario.
