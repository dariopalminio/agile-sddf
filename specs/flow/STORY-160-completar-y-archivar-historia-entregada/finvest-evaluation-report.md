---
type: finvest-evaluation
story-id: STORY-160
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que entregó una historia con SDD flow-forward
> **Quiero** completarla y archivarla con `/story-complete STORY-NNN` para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/`
> **Para** dejar `specs/flow/` solo con el trabajo activo y conservar la historia entregada como registro histórico, con su historial de git intacto

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente; rol real (Solo Builder que entregó una historia), acción concreta y beneficio observable (`specs/flow/` solo con trabajo activo, historial de git conservado). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1) y dos escenarios de error nombrados como `###` (AC-2 rechazo, AC-3 aborto sin efectos). |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin `, los tres con tabla `Ejemplos`; AC-1 usa `Y` en el `Entonces`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-159 para que una historia llegue a `DELIVER/DONE` por un skill, pero la nota indica cómo simularlo con un fixture; la fila `COMPLETED` no depende de STORY-159. STORY-164 depende de esta historia, no al revés. |
| **N** – Negociable | 4 | Tras el refinamiento, el Gherkin describe resultados observables y los mensajes por su contenido («nombra la ruta buscada»), no por su texto literal. `git mv` quedó como ejemplo en CNF-3 y la estrategia de atomicidad (CNF-4) se decide en `/story-design`. CNF-6 sí fija los dos documentos de dominio a tocar. |
| **V** – Valiosa | 4 | Valor claro y observable para el Solo Builder: `specs/flow/` muestra solo trabajo activo y el archivo conserva el registro con su historial. |
| **E** – Estimable | 4 | Con el split desaparecieron el ADR y los cambios en `AGENTS.md` y `docs/constitution.md`; queda un skill nuevo, dos documentos de dominio y la reutilización de `archiveDate` de `scripts/migrate-specs-to-flow.js`. Sigue abierta la pregunta sobre directorios no versionados, de alcance acotado. |
| **S** – Small | 2 | El conteo mecánico da 9 filas de `Ejemplos` (2 + 4 + 3) y 11 pasos, que caerían en la banda 1. Se puntúa 2 por criterio: las 7 filas de AC-2 y AC-3 son guardas de un mismo comando, con la misma forma de 3 pasos, y las filas salieron de separar los casos con `O` que pedía la evaluación anterior (T). Hay cuatro comportamientos distintos: archivar con transición, archivar sin transición, rechazar y abortar. Es un solo skill, no una épica. |
| **T** – Testeable | 5 | Cada caso es una fila de un Outline con su resultado esperado; el invariante de conteo (CNF-4), `git log --follow` y la ausencia del directorio origen son verificables de forma automática. |

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

### S – Small (2)

La historia está en el límite superior de tamaño. No bloquea la aprobación, pero conviene vigilarla en `/story-tasking`. Si la estimación supera una entrega, la candidata natural a separar es la fila `COMPLETED` de AC-1 (archivar historias que ya están en `COMPLETED/DONE` sin cambiar su status) junto con la fila `COMPLETED/DONE` de AC-3 (fecha ausente). Con el patrón **variaciones de regla de negocio**, la core quedaría en el camino `DELIVER/DONE → COMPLETED/DONE`, que es el que añade valor nuevo al flujo.

### I – Independencia (3)

La dependencia de STORY-159 ya está desacoplada con el fixture descrito en las notas. Para subir a 4, en `/story-testcases` incluir un caso que construya ese fixture (`status: DELIVER` / `substatus: DONE` fijados a mano), así la historia puede implementarse y verificarse antes que STORY-159.

### E – Estimable (4) — nota

Resolver antes de `/story-design` la nota «Pendiente de refinar» sobre directorios no versionados (fallar cerrado o hacer un movimiento simple). Si se decide fallar cerrado, agregarlo como una fila más de AC-3; si se decide hacer el movimiento simple, documentarlo en CNF-3.

### T – Testeable (5) — nota menor

Los Outlines usan `Escenario:` con `Ejemplos`, igual que `story-template.md`. Un parser Gherkin estricto exige `Esquema del escenario:`; tenerlo en cuenta si estos escenarios se automatizan tal cual.
