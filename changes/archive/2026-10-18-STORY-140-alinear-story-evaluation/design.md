---
alwaysApply: false
type: design
id: STORY-140
slug: STORY-140-alinear-story-evaluation-design
title: "Design: Alinear story-evaluation"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-140
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-140-alinear-story-evaluation
  - STORY-138-contrato-de-validacion
  - STORY-139-alinear-epic-analyze
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-140-alinear-story-evaluation]] · [[STORY-138-contrato-de-validacion]] · [[STORY-139-alinear-epic-analyze]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear story-evaluation

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `story-evaluation`, el gate de especificación de
historias, y sus consumidores. Se aplica el contrato que fija el diseño de STORY-138 (`READY-FOR-IMPLEMENT/DONE`):
reglas G-01…G-06, fila `story-evaluation` de §4 (`APPROVED`, `NEEDS-REFINEMENT`, `SPLIT`), equivalencias de §5
(`APROBADA` → `APPROVED`, `REFINAR` y `RECHAZAR` → `NEEDS-REFINEMENT`, `DIVIDIR` → `SPLIT`), la regla D-7 sobre reportes
heredados y el ejemplo 7.2. STORY-138 D-6 deja expresamente a esta historia la precedencia entre `SPLIT` y
`NEEDS-REFINEMENT` (D-1).

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/story-evaluation/assets/evaluation-output-template.md` | 57 líneas, **sin frontmatter**. Tras `# Evaluación FINVEST` (l.1), el primer `##` es `## Historia evaluada` (l.3). Fase 1 cierra con `{gateway_decision}` (l.19). La decisión aparece al final, en `## Resultado Final` (l.40), como `**FINVEST Decisión:** {decision}` (l.51). |
| `skills/story-evaluation/SKILL.md` | El frontmatter del reporte vive en el Paso 6 (l.178-187): `type`, `story-id`, `finvest-score`, `decision: <APROBADA\|REFINAR\|RECHAZAR\|DIVIDIR>`, `evaluated`. Valores heredados en l.3, l.17, l.23, l.25, l.65, l.73, l.123, l.139-140, l.146-153 (tabla del Paso 4), l.196-210 (Paso 7), l.336, l.344 y l.350-354. |
| Reglas de decisión vigentes | Regla 1 (l.139): S = 1 → `DIVIDIR` «independientemente del score total». Regla 2 (l.140): otra dimensión INVEST = 1 → `RECHAZAR` «independientemente del score total». Ambas reclaman el caso S = 1 con otra dimensión = 1. El ejemplo `examples/example-rechazar.md` Caso B (I, E, S = 1) lo resuelve como `RECHAZAR`: hoy gana la regla 2. |
| `skills/story-evaluation/README.md` | l.11, l.17 y l.30 nombran los cuatro valores heredados. |
| `skills/story-evaluation/examples/` | `example-ready.md`, `example-refinar.md`, `example-rechazar.md` (casos A y B). Cada uno cierra con `**FINVEST Decisión:** …` (l.88, l.68, l.48 y l.170); el caso A además escribe `RECHAZADA` en la línea del gateway (l.35). |
| `skills/story-evaluation/evals/evals.json` | 5 casos (`version: 1.0.0`). TC-002…TC-005 afirman valores heredados; ninguno afirma `## Veredicto` ni `verdict`. TC-001 afirma `"Decisión"`, y TC-005, `"Decision"`. |
| `skills/story-specify/` | `SKILL.md` l.43, l.105-106, l.155, l.189-197, l.212, l.228, l.234-236, l.252, l.269-275 y l.314; `README.md` l.12, l.45-50, l.69-70 y l.77; `assets/agents/product-owner.md` l.28; `evals/evals.json` (TC-001, TC-004…TC-007). El Paso 4 (l.212) invoca `story-split` con `DIVIDIR` **o** con «`RECHAZAR` con recomendación de división», una señal que no está definida. |
| `skills/story-improve/` | `SKILL.md` l.5, l.26, l.35-36, l.88, l.165, l.178-186 (gate), l.302, l.311 y l.330-334; `README.md` l.16 y l.28; `assets/improvement-log-template.md` l.16; `examples/example-aprobada-input/` y `examples/example-refinar-input/` (reporte y `story.md`); `evals/evals.json` (TC-001, TC-002, TC-005). |
| `skills/story-split/` | `SKILL.md` l.172 y l.178 (Paso 3b: usa el plan FINVEST solo con `decision: DIVIDIR`); `examples/input/epic-story.md` l.12-13 y `examples/output/split-result.md` l.5. |
| Template de historia | `skills/story-creation/assets/story-template.md` l.8 y su copia idéntica `docs/templates/story-template.md` l.8 («solo con decisión APROBADA»). |
| Documentación vigente | `docs/guides/sddf-commands-pipeline.md` l.214; `docs/requirements/functional/FR-031-evaluacion-de-calidad-con-rubrica-finvest.md` l.18-21. |
| `scripts/migrate-finvest-field.js` | Migración de STORY-090: detecta el bloque retirado `**FINVEST Decisión:**` en el cuerpo de `story.md` y copia su valor tal cual a la tabla de consola. No lee `decision:` del reporte ni contiene valores heredados (ver CR-001). |
| `scripts/run-evals.js` | Califica con subcadenas sensibles a mayúsculas (`includes`, l.655-657). |
| `docs/policies/validation-contract-policy.md` | Todavía no existe: lo crea STORY-138 (ver D-10). |

## Goals / Non-Goals

**Goals:**

- `finvest-evaluation-report.md` declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras
  `# Evaluación FINVEST`, con el mismo valor. // satisface: AC-1
- La regla de decisión emite solo `APPROVED`, `NEEDS-REFINEMENT` o `SPLIT`, y el reporte no contiene `decision` ni los
  valores heredados. // satisface: AC-1
- `story-specify`, `story-improve` y `story-split` enrutan por `verdict` sin perder ningún camino actual. // satisface: AC-2
- Rúbricas, pesos, umbrales y precedencia efectiva no cambian. // satisface: CNF-1

**Non-Goals:**

- Reescribir los `finvest-evaluation-report.md` de `docs/specs/stories/` (Fuera de alcance de la historia; STORY-138 D-7).
- Cambiar la escala Likert o las reglas de decisión FINVEST (Fuera de alcance; CNF-1).
- Renombrar `story-improve` a `story-refine` (Notas de la historia; Non-Goal de EPIC-25).
- Alinear `epic-format-validation` y `epic-creation`, que usan `APROBADO` / `REFINAR` / `RECHAZADO`: STORY-138 los excluye
  del alcance del contrato.
- Editar `docs/product/roadmap.md` y `docs/product/story-map.md` (ver CR-002).
- Editar la policy o `CHANGELOG.md` (el registro se hace en la release con `/doc-release-notes`).

## Decisions

### D-1 — Tabla de decisión con precedencia explícita // satisface: AC-1, CNF-1

El Paso 4 de `SKILL.md` pasa a una tabla de **primera coincidencia**. Las condiciones y los umbrales son los de hoy; solo
cambian los valores (§5) y se explicita el orden:

| # | Condición (se evalúa en orden; gana la primera) | Veredicto | Fila de AC-1 |
|---|---|---|---|
| 1 | `F_score < 2.5` (INVEST no se evalúa) | `NEEDS-REFINEMENT` | 3 |
| 2 | Alguna dimensión INVEST distinta de S = 1 | `NEEDS-REFINEMENT` | 3 |
| 3 | S – Small = 1 | `SPLIT` | 4 |
| 4 | `FINVEST_Score ≥ 4.0` | `APPROVED` | 1 |
| 5 | `3.0 ≤ FINVEST_Score < 4.0` | `NEEDS-REFINEMENT` | 2 |
| 6 | `FINVEST_Score < 3.0` | `NEEDS-REFINEMENT` | 3 |

Las «Reglas críticas» del Paso 3 (l.138-140) se reescriben como remisión a las filas 2 y 3, sin repetir los valores.

**Precedencia entre `SPLIT` y `NEEDS-REFINEMENT`** (delegada por STORY-138 D-6): con S = 1 y otra dimensión = 1 gana la
fila 2. Es la precedencia efectiva de hoy (Caso B de `example-rechazar.md`, I, E, S = 1 → `RECHAZAR`), así que CNF-1 se
cumple. El camino a `story-split` que hoy toma `story-specify` en ese caso se conserva en D-6. La fila 3 sigue ganando
a las filas 4-6 («independientemente del score total», l.139).

| Alternativa | Motivo del rechazo |
|---|---|
| `SPLIT` gana siempre que S = 1 | Cambia el resultado del Caso B y viola CNF-1 y el Non-Goal «cambiar las reglas de decisión». |
| Dejar las dos reglas críticas sin orden | El agente resolvería el caso S = 1 + otra = 1 de forma no determinista, y STORY-138 D-6 exige fijarlo aquí. |
| Un cuarto valor para «dimensión crítica» | §4 no lo permite. El motivo de D-3 conserva la distinción que hoy daba `RECHAZAR`. |

### D-2 — Frontmatter en el template, con `verdict` en lugar de `decision` // satisface: AC-1

El frontmatter se mueve del Paso 6 de `SKILL.md` (l.178-187) al inicio de `evaluation-output-template.md`, con el
mismo orden de campos y `verdict` en la posición de `decision`:

| Campo | Valor | Cambio |
|---|---|---|
| `type` | `finvest-evaluation` | Sin cambio (ejemplo 7.2 de la policy) |
| `story-id` | `{story_id}` | Sin cambio |
| `finvest-score` | `{FINVEST_score}` | Sin cambio |
| `verdict` | `{APPROVED \| NEEDS-REFINEMENT \| SPLIT}` | Reemplaza a `decision` (G-01, G-04) |
| `evaluated` | `{YYYY-MM-DD}` | Sin cambio |

El Paso 5 muestra en la conversación el cuerpo desde `# Evaluación FINVEST`, como hoy. El Paso 6 escribe el frontmatter y
el cuerpo; su punto 3 remite al frontmatter del template en lugar de transcribirlo. Con texto libre no se escribe
archivo ni frontmatter, como hoy, y el veredicto sigue visible en `## Veredicto`.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener el frontmatter solo en el Paso 6 | CS-3 de la épica exige que el template de reporte declare `verdict`. Además, la estructura quedaría repartida entre dos archivos. |
| Mostrar también el frontmatter en la conversación | Con texto libre no hay `story-id` que escribir, y cambia la salida conversacional sin que ningún AC lo pida. |

### D-3 — Sección `## Veredicto` con motivo determinista // satisface: AC-1

En el template, entre `# Evaluación FINVEST` y `## Historia evaluada`, se añade `## Veredicto` con un comentario guía
de una línea y la línea `` **Veredicto:** `{verdict}` — {motivo} `` (G-02). El motivo sale de la misma fila de D-1 que
da el valor:

| Fila de D-1 | Línea escrita |
|---|---|
| 1 | `` **Veredicto:** `NEEDS-REFINEMENT` — formato insuficiente: F_score <f> < 2.5; no se evalúa INVEST `` |
| 2 | `` **Veredicto:** `NEEDS-REFINEMENT` — dimensión crítica: <dims> = 1 `` |
| 3 | `` **Veredicto:** `SPLIT` — S – Small = 1: historia demasiado grande para una sola entrega `` |
| 4 | `` **Veredicto:** `APPROVED` — FINVEST <x> ≥ 4.0, sin dimensiones críticas `` |
| 5 | `` **Veredicto:** `NEEDS-REFINEMENT` — FINVEST <x> entre 3.0 y 4.0 `` |
| 6 | `` **Veredicto:** `NEEDS-REFINEMENT` — FINVEST <x> < 3.0 `` |

`<dims>` lista **todas** las dimensiones con score 1 en el orden I, N, V, E, S, T (ej. `I, E, S = 1`), de modo que un S = 1
de la fila 2 queda visible. `<f>` y `<x>` usan los dos decimales del Paso 5. Con una sola dimensión se escribe
«dimensión crítica: I = 1».

| Alternativa | Motivo del rechazo |
|---|---|
| Motivo libre redactado por el agente | Dos ejecuciones sobre la misma historia darían líneas distintas, y las evals no podrían afirmarlas. |
| Repetir los seis scores en la línea | Duplica `## Resultado Final`. G-02 pide una frase, y el detalle vive en las secciones propias. |

### D-4 — Ninguna otra línea declara el veredicto // satisface: AC-1

- `## Resultado Final` conserva F, I, N, V, E, S, T y `**FINVEST Score:**`, y **pierde** `**FINVEST Decisión:** {decision}`
  (l.51), según G-04.
- `{gateway_decision}` (l.19) pasa a `{gateway_resultado}`, con dos textos fijos que no son veredicto:
  `✅ F_score ≥ 2.5 — se evalúa INVEST.` y `❌ F_score < 2.5 — no se evalúa INVEST.`.
- Se conservan los nombres de sección. `story-improve` busca la tabla de scores y `## Comentarios y Recomendaciones`, y
  los ejemplos usan esos encabezados.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar `**FINVEST Decisión:**` con el valor canónico | Viola G-04, y el `Pero` de AC-1 prohíbe el campo `decision`. |
| Renombrar `## Resultado Final` | Ninguna regla lo exige: el encabezado sin valor no declara el veredicto. Rompería referencias de ejemplos sin beneficio. |

### D-5 — Confirmación de guardado con el veredicto // satisface: AC-1, AC-2

La línea del Paso 6.5 pasa a `✓ Reporte guardado: <ruta>/finvest-evaluation-report.md (verdict: <VALOR>)`. El
orquestador y las evals leen el valor en la salida de consola sin abrir el archivo. El runner solo ve esa salida
(`run-evals.js`). En modo Agent, `story-evaluation` retorna el veredicto en esa línea y en el archivo.

| Alternativa | Motivo del rechazo |
|---|---|
| Mostrar el frontmatter completo en consola | Ruido y duplicación: el valor ya está en `## Veredicto`. |
| Que las evals lean el archivo generado | El runner no inspecciona archivos (califica la salida, l.648-664). |

### D-6 — Enrutamiento en `story-specify` // satisface: AC-2

`story-specify` lee `verdict` del frontmatter del reporte recién generado en su Paso 3. Siempre invoca `story-evaluation`
sobre el archivo antes de leer, así que nunca lee un reporte heredado. La tabla de enrutamiento queda:

| Veredicto | Paso | Cambio respecto a hoy |
|---|---|---|
| `APPROVED` | Paso 3: DoD SPECIFY → `status: SPECIFY` / `substatus: DONE` | Solo el nombre del valor (`APROBADA`) |
| `SPLIT` | Paso 4: `story-split` | Antes `DIVIDIR` |
| `NEEDS-REFINEMENT` con `**S – Small:** 1 / 5` en `## Resultado Final` | Paso 4: `story-split`; si no aplica, Paso 5A | Sustituye a «`RECHAZAR` con recomendación de división» (l.212) con una señal determinista |
| `NEEDS-REFINEMENT` (resto) | Pasos 5A (`story-improve`) → 5B → Paso 6 (gate anti-bucle) | Antes `REFINAR` o `RECHAZAR`. El gate no cambia |

La fila 3 solo se da con la fila 2 de D-1 (S = 1 y otra dimensión = 1), que es exactamente el caso en que hoy se emite
`RECHAZAR` y se recomienda dividir. Con `F_score < 2.5` no hay score S, así que no se activa. La columna del backlog
`Decision FINVEST` (l.155, l.236, l.314) pasa a `Veredicto FINVEST` (valores del §4 o `Pendiente`). El mensaje de l.235
pasa a `ℹ️ <STORY-NNN> ya tiene veredicto APPROVED — avanzando al gate`.

| Alternativa | Motivo del rechazo |
|---|---|
| Invocar `story-split` solo con `SPLIT` | Pierde el camino actual de la fila 2 con S = 1, que las Notas de la historia piden conservar. |
| Mantener «recomendación de división» como texto interpretable | No es determinista. S = 1 es la única condición en que la rúbrica S («Épica / Demasiado grande») exige dividir. |
| Un campo nuevo `split-recommended` en el frontmatter | YAGNI: el score S ya está en el reporte. Además, sería un segundo campo con sabor a veredicto (G-04). |

### D-7 — Gate de `story-improve` y reportes sin `verdict` // satisface: AC-2

- **Gate:** `story-improve` lee `verdict:` del frontmatter (l.165). Con `APPROVED` emite
  `ℹ️ <STORY-NNN> ya tiene veredicto APPROVED — no se realizan cambios` y termina sin escribir (l.178-184). Con
  `NEEDS-REFINEMENT` o `SPLIT` continúa al Paso 3, como hoy con `REFINAR`, `RECHAZAR` y `DIVIDIR` (l.186).
- **Reporte sin `verdict`** (generado antes de esta historia, o roto): emite
  `⚠️ finvest-evaluation-report.md sin campo verdict (formato anterior al contrato de validación) — ejecuta /story-evaluation <STORY-NNN> para regenerarlo`
  y termina **sin escribir**. Así aplica G-06 (un valor ausente no es aprobado) sin mejorar a ciegas una historia que
  podría estar aprobada.
- **Valor no permitido** (`verdict` presente pero fuera de §4): mismo `⚠️`, con «valor no permitido» en lugar de «sin campo
  verdict».

Esto resuelve la nota «Reportes heredados» de la historia sin nombrar los valores heredados en ningún skill: CS-10 y
SMOKE-3 prohíben `APROBADA` en `skills/`. Una historia ya aprobada sigue reconociéndose por su `status: SPECIFY` /
`substatus: DONE`, que es la huella de aprobación en `story.md` (SKILL.md l.210). El reporte heredado se regenera con
una sola evaluación, porque el Paso 6.4 ya sobrescribe el reporte. STORY-138 D-7 pide traducir con §5 al consumidor que
**necesite** leer un reporte heredado. Ninguno lo necesita: `story-specify` siempre lee un reporte recién generado, y
`story-improve` y `story-split` pueden pedir una regeneración o degradar.

| Alternativa | Motivo del rechazo |
|---|---|
| Traducir `decision:` con los pares de §5 dentro de cada consumidor | Exige escribir `APROBADA` en `skills/` (viola CS-10 y SMOKE-3) y copia la tabla de §5 en tres skills (STORY-138 CNF-1). |
| Leer la policy en tiempo de ejecución | La policy no existe en los proyectos que instalan el skill (ADR-0014, Regla 1; STORY-139 D-7). |
| Tratar el reporte sin `verdict` como no aprobado y mejorar | Una historia aprobada con reporte heredado se reescribiría sin necesidad. |

### D-8 — Plan FINVEST en `story-split` // satisface: AC-2

El Paso 3b (l.172, l.178) usa el plan del reporte solo si `verdict: SPLIT`. Sin `verdict`, o con otro valor, `plan_finvest`
queda vacío y el Paso 4 sigue con la detección de patrones: es la degradación que ya existe hoy cuando `decision ≠ DIVIDIR`.
Con la fila 3 de D-6 (`NEEDS-REFINEMENT` + S = 1) el plan tampoco se usa, como hoy con `RECHAZAR`.

| Alternativa | Motivo del rechazo |
|---|---|
| Usar el plan también con `NEEDS-REFINEMENT` y S = 1 | Cambia el comportamiento actual sin que un AC lo pida. Además, el template de `story-evaluation` no emite esa sección. |
| Detener `story-split` si falta `verdict` | El reporte es opcional para el split (l.169). Detenerlo bloquearía un camino que hoy funciona sin reporte. |

### D-9 — Inventario de cambios en textos // satisface: AC-1, AC-2

Los reemplazos siguen §5. «Decisión» pasa a «veredicto» cuando designa el resultado del gate.

| Archivo | Línea | Cambio |
|---|---|---|
| `skills/story-evaluation/SKILL.md` | l.3, l.17, l.23 | «veredicto (`APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`), declarado en `## Veredicto` y en `verdict`» |
| `skills/story-evaluation/SKILL.md` | l.25, l.65, l.196-210, l.336, l.344 | `APROBADA` → `APPROVED`; «decisión» → «veredicto». l.210: «el score y el veredicto viven en `finvest-score` y `verdict`» |
| `skills/story-evaluation/SKILL.md` | l.73, l.123 | «emitir `NEEDS-REFINEMENT` (fila 1 del Paso 4)» |
| `skills/story-evaluation/SKILL.md` | l.138-153 | Tabla de D-1 y reglas críticas como remisión, más una línea que remite al contrato de validación (`docs/policies/validation-contract-policy.md` de Agile-SDDF, en código en línea y sin enlace) |
| `skills/story-evaluation/SKILL.md` | Paso 5 | Nuevo punto: escribir `## Veredicto` con la línea de D-3 |
| `skills/story-evaluation/SKILL.md` | l.178-190 | Frontmatter por remisión al template (D-2) y confirmación de D-5 |
| `skills/story-evaluation/SKILL.md` | l.350-354 | Ejemplos con su veredicto: ready → `APPROVED`; refinar → `NEEDS-REFINEMENT` (fila 5); rechazar A → `NEEDS-REFINEMENT` (fila 1); rechazar B → `NEEDS-REFINEMENT` (fila 2) |
| `skills/story-evaluation/assets/evaluation-output-template.md` | l.1-51 | D-2, D-3 y D-4 |
| `skills/story-evaluation/README.md` | l.11, l.17, l.30 | Veredicto `APPROVED`, `NEEDS-REFINEMENT` o `SPLIT`; l.30: «aprobarse, refinarse o dividirse» |
| `skills/story-evaluation/examples/*.md` | títulos, gateway, cierre | Título `# Ejemplo: veredicto <VALOR>`; `### Veredicto` como primera subsección del bloque de evaluación, con la línea de D-3; sin `**FINVEST Decisión:**`; l.35 de `example-rechazar.md` → texto del gateway de D-4. Los nombres de archivo se conservan |
| `skills/story-specify/SKILL.md` | l.43, l.105-106, l.155, l.189-197, l.212, l.228, l.234-236, l.252, l.269-275, l.314 | D-6. El Paso 3 extrae `verdict` en lugar de `Decision` |
| `skills/story-specify/README.md` | l.12, l.45-50, l.69-70, l.77 | Diagrama del ciclo con `APPROVED` / `SPLIT` / `NEEDS-REFINEMENT` (incluida la fila S = 1 de D-6) |
| `skills/story-specify/assets/agents/product-owner.md` | l.28 | «después de un veredicto FINVEST `SPLIT` o `NEEDS-REFINEMENT`» |
| `skills/story-improve/SKILL.md` | l.5, l.26, l.35-36, l.88, l.165, l.178-186, l.302, l.311, l.330-334 | D-7. l.302: `Veredicto previo: NEEDS-REFINEMENT (FINVEST <score>)`; l.311: «supera el umbral de `APPROVED`» |
| `skills/story-improve/README.md` | l.16, l.28 | `APPROVED`; «veredicto `NEEDS-REFINEMENT` o `SPLIT`» |
| `skills/story-improve/assets/improvement-log-template.md` | l.16 | `- **Veredicto previo:** <NEEDS-REFINEMENT \| SPLIT>` |
| `skills/story-improve/examples/*/finvest-evaluation-report.md` | frontmatter, recuadro, `## Decisión` | `verdict: APPROVED` / `verdict: NEEDS-REFINEMENT`; se elimina la fila «Decisión» del recuadro (G-04); `## Decisión` pasa a `## Veredicto` como primer `##` tras el título, con la línea de D-3 (filas 4 y 5); «umbral APROBADA» → «umbral de `APPROVED` (4.0)» |
| `skills/story-improve/examples/*/story.md` | l.16-18 | Se elimina el bloque `**FINVEST Score:**` / `**FINVEST Decisión:**` / `---`, retirado del cuerpo de `story.md` por STORY-090 |
| `skills/story-split/SKILL.md` | l.172, l.178 | D-8 |
| `skills/story-split/examples/input/epic-story.md` | l.12-13 | Se elimina el bloque FINVEST retirado por STORY-090 |
| `skills/story-split/examples/output/split-result.md` | l.5 | `` — Veredicto FINVEST: `SPLIT` (S=1, …) `` |
| `skills/story-creation/assets/story-template.md` y `docs/templates/story-template.md` | l.8 | «solo con veredicto APPROVED». Ambos archivos siguen idénticos |
| `docs/guides/sddf-commands-pipeline.md` | l.214 | `` → `APPROVED / NEEDS-REFINEMENT / SPLIT` `` |
| `docs/requirements/functional/FR-031-…md` | l.18-21, `updated` | Veredicto en `verdict` y `## Veredicto`; valores y condiciones de D-1, con los mismos umbrales |

Ningún skill repite la tabla de vocabulario de la policy (STORY-138 CNF-1): cada uno declara solo los valores que emite
o lee. El skill nombra la policy en código en línea, sin enlace, porque se instala en proyectos sin `docs/policies/`.

| Alternativa | Motivo del rechazo |
|---|---|
| Renombrar `example-refinar.md` y `example-rechazar.md` | Los nombres son identificadores, no veredictos, y CS-10 no los prohíbe. Renombrarlos rompe enlaces externos sin ganar conformidad. |
| Conservar el bloque FINVEST en los `story.md` de ejemplo con valores canónicos | Ese bloque ya no existe en `story.md` (STORY-090). Los ejemplos mostrarían un formato retirado. |

### D-10 — Evals // satisface: AC-1, AC-2, CNF-1

**`skills/story-evaluation/evals/evals.json`** (`version` → `1.1.0`, `description` sin cambios de alcance):

| Caso | Cambio |
|---|---|
| TC-001 | `contains`: `"## Veredicto"`, `"**Veredicto:**"`, `"(verdict: "`, `"F –"`, `"✓ Reporte guardado"`; se retira `"Decisión"`. `not_contains`: se añaden `"decision:"` y `"FINVEST Decisión"` |
| TC-002 | `not_contains`: `"APROBADA"` y `"REFINAR"` → `"**Veredicto:**"` y `"(verdict: "` |
| TC-003 | `contains`: `` "**Veredicto:** `NEEDS-REFINEMENT`" ``, `"formato insuficiente"`, `"F_score"`. `not_contains`: `"INVEST_Score ="`, `"RECHAZAR"`, `"DIVIDIR"`, `"SPLIT"` |
| TC-004 | `contains`: `` "**Veredicto:** `SPLIT`" ``, `"S – Small = 1"`. `not_contains`: `"DIVIDIR"`, `` "`APPROVED`" `` |
| TC-005 | `contains`: `"FINVEST"`, `"## Veredicto"`; se retira `"Decision"` |
| TC-006 (nuevo) | Texto libre de `examples/example-ready.md` → `` "**Veredicto:** `APPROVED`" `` (AC-1 fila 1) |
| TC-007 (nuevo) | Texto libre de `examples/example-refinar.md` → `` "**Veredicto:** `NEEDS-REFINEMENT`" ``, `"entre 3.0 y 4.0"`; `not_contains`: `"REFINAR"` (AC-1 fila 2) |
| TC-008 (nuevo) | Texto libre del Caso B de `examples/example-rechazar.md` → `` "**Veredicto:** `NEEDS-REFINEMENT`" ``, `"dimensión crítica"`; `not_contains`: `` "`SPLIT`" ``, `"RECHAZAR"` (AC-1 fila 3 y precedencia de D-1, CNF-1) |

Los casos nuevos usan **texto libre** para no escribir reportes dentro de `examples/` ni tocar frontmatter (Pasos 6 y 7).
`APROBADA` no figura en ningún `not_contains`: SMOKE-3 lo busca en `skills/`. Su ausencia queda garantizada en la fuente
(V-1), porque ni el template ni `SKILL.md` lo contienen. `REFINAR`, `RECHAZAR` y `DIVIDIR` no están en la lista de CS-10 y
sí se afirman como ausentes (`Pero` de AC-1).

**`skills/story-specify/evals/evals.json`** (`version` → `1.1.0`): TC-001, TC-006 y TC-007 cambian `APROBADA` por `APPROVED`;
TC-004 cambia `DIVIDIR` por `SPLIT` y TC-005, `REFINAR` por `NEEDS-REFINEMENT`, en `description`, `context` y aserciones.
Se sustituyen `"Decision FINVEST = APROBADA"` → `"Veredicto FINVEST = APPROVED"` y `"ya tiene decisión APROBADA"` →
`"ya tiene veredicto APPROVED"`. Los `not_contains` de TC-001 pasan a `"NEEDS-REFINEMENT"` y `"SPLIT"`. Los `name` de
TC-004 y TC-005 pasan a `split-automatico-tras-verdict-split` y `gate-antibucle-verdict-needs-refinement`. Se añade TC-009:
veredicto `NEEDS-REFINEMENT` con I = 1 y S = 1 → `story-split` se invoca (fila 3 de D-6).

**`skills/story-improve/evals/evals.json`** (`version` → `1.1.0`): TC-001 y TC-005 pasan a `verdict: NEEDS-REFINEMENT`
(`name`: `happy-path-needs-refinement-applies-improvements` y `edge-case-needs-refinement-multiple-low-dimensions`). TC-002
pasa a `verdict: APPROVED` (`name`: `gate-approved-no-files-written`) y afirma `"ya tiene veredicto APPROVED"`. Se añade
TC-006: reporte sin `verdict` → `"sin campo verdict"`, `"/story-evaluation"`, y `not_contains` de `"story.md.bak"` (D-7).

Las posiciones (`## Veredicto` primero) se verifican en el template (V-3), no en evals. El runner solo compara subcadenas,
como en STORY-139 D-8.

| Alternativa | Motivo del rechazo |
|---|---|
| Afirmar `"APROBADA"` en `not_contains` | Introduce el literal que SMOKE-3 prohíbe en `skills/`. |
| Pasar las rutas de los ejemplos como input | El Paso 6 escribiría `finvest-evaluation-report.md` en `examples/`, y el Paso 7 tocaría su frontmatter. |
| No añadir casos por fila de AC-1 | Hoy ningún caso cubre `APPROVED` ni la banda 3.0-4.0. AC-1 tiene cuatro filas y todas deben poder fallar. |

### D-11 — Conformidad con la policy // satisface: AC-1

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | D-2 |
| C-2 | G-02: `## Veredicto` primer `##` tras el `#`, con `` **Veredicto:** `<VALOR>` — <motivo> `` | D-3 |
| C-3 | G-03 y §4: `APPROVED`, `NEEDS-REFINEMENT`, `SPLIT` | D-1 |
| C-4 | G-04: ningún otro campo o línea declara el veredicto | D-4 (`decision`, `**FINVEST Decisión:**` y gateway) |
| C-5 | G-06: consumidores cerrados ante fallo | D-6 (reporte recién generado), D-7 (`⚠️` y sin escritura) y D-8 (degradación sin plan) |
| C-6 | §7.2: `type: finvest-evaluation`, `# Evaluación FINVEST`, siguiente `##` = `## Historia evaluada` | D-2 y D-3 |

No se conserva ninguna divergencia. §6 sigue con `Sin excepciones vigentes.`. Si la policy publicada difiere del diseño de
STORY-138, se aplica la versión publicada y la diferencia se anota en `implement-report.md`.

### D-12 — Secuencia respecto a STORY-138 // satisface: AC-1

La implementación empieza cuando `docs/policies/validation-contract-policy.md` existe (lo comprueba la primera tarea).
C-1…C-6 se comparan contra el texto publicado. WIP = 1 por nivel ya serializa las historias.

| Alternativa | Motivo del rechazo |
|---|---|
| Implementar antes de que exista la policy | Si la redacción de §4, §5 o G-02 cambia, habría que rehacer el template, las líneas de D-3 y las evals. |
| Dividir en «reporte» y «consumidores» (Notas de la historia) | Entre las dos mitades, `story-specify` y `story-improve` leerían `decision` de un reporte que ya no lo trae y romperían el flujo SPECIFY. Los cambios en consumidores son textuales y caben en la historia. |

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Regla de veredicto y escritura del reporte FINVEST | modificar | `skills/story-evaluation/SKILL.md` | AC-1, CNF-1 |
| Template del reporte FINVEST | modificar | `skills/story-evaluation/assets/evaluation-output-template.md` | AC-1 |
| Ficha y ejemplos de `story-evaluation` | modificar | `skills/story-evaluation/README.md`, `skills/story-evaluation/examples/*.md` | AC-1 |
| Evals de `story-evaluation` | modificar | `skills/story-evaluation/evals/evals.json` | AC-1, CNF-1 |
| Enrutamiento del ciclo de especificación | modificar | `skills/story-specify/SKILL.md`, `README.md`, `assets/agents/product-owner.md`, `evals/evals.json` | AC-2 |
| Gate de mejora automática | modificar | `skills/story-improve/SKILL.md`, `README.md`, `assets/improvement-log-template.md`, `examples/`, `evals/evals.json` | AC-2 |
| Lectura del plan FINVEST en el split | modificar | `skills/story-split/SKILL.md`, `examples/` | AC-2 |
| Comentario de escritor de `status` | modificar | `skills/story-creation/assets/story-template.md`, `docs/templates/story-template.md` | AC-1 |
| Documentación vigente | modificar | `docs/guides/sddf-commands-pipeline.md`, `docs/requirements/functional/FR-031-evaluacion-de-calidad-con-rubrica-finvest.md` | AC-1 |

No se tocan: la policy, `scripts/migrate-finvest-field.js` (CR-001), `docs/product/` (CR-002), los reportes de
`docs/specs/`, `CHANGELOG.md`, `package.json` (no hay archivos nuevos; `skills/story-*` ya se publica) ni las copias de
runtime de `.claude/`.

## Interfaces

| Interfaz | Contrato | Consumidor | Satisface |
|---|---|---|---|
| Frontmatter del reporte | `type: finvest-evaluation`, `story-id`, `finvest-score`, `verdict: APPROVED \| NEEDS-REFINEMENT \| SPLIT`, `evaluated`. Sin `decision` | `story-specify`, `story-improve`, `story-split`, CI | AC-1, AC-2 |
| Sección `## Veredicto` | Primer `##` tras `# Evaluación FINVEST`; una línea según D-3 | Lectores humanos, evals | AC-1 |
| Línea de score S | `**S – Small:** <n> / 5` en `## Resultado Final` (sin cambio de forma) | `story-specify` (fila 3 de D-6) | AC-2 |
| Confirmación de guardado | `✓ Reporte guardado: <ruta>/finvest-evaluation-report.md (verdict: <VALOR>)` | `story-specify` (modo Agent), evals | AC-1, AC-2 |
| Gate de `story-improve` | `APPROVED` → `ℹ️ … ya tiene veredicto APPROVED …`, sin escritura; `NEEDS-REFINEMENT` \| `SPLIT` → mejora; ausente o no permitido → `⚠️ … /story-evaluation …`, sin escritura | `story-specify` Paso 5A, usuario | AC-2 |
| Plan de `story-split` | Se usa solo con `verdict: SPLIT` | `story-split` Paso 4 | AC-2 |

## Esquema de datos // satisface: AC-1

Cabecera del template tras el cambio (forma abstracta; los placeholders se reemplazan en los Pasos 5 y 6):

```markdown
---
type: finvest-evaluation
story-id: {story_id}
finvest-score: {FINVEST_score}
verdict: {APPROVED | NEEDS-REFINEMENT | SPLIT}
evaluated: {YYYY-MM-DD}
---

# Evaluación FINVEST

## Veredicto
<!-- comentario guía: línea según la fila del Paso 4 que dio el valor -->

**Veredicto:** `{verdict}` — {motivo}

## Historia evaluada
…
## Fase 1: Evaluación de Formato (F — Gateway)
…
{gateway_resultado}
…
## Resultado Final
…F, I, N, V, E, S, T y FINVEST Score, sin línea de decisión…
```

## Flujos clave

### F-1 — Evaluación con escritura de reporte // AC-1

Paso 2 (F) → Paso 3 (INVEST, si F ≥ 2.5) → Paso 4: primera fila de D-1 → Paso 5: cuerpo con `## Veredicto` (D-3) →
Paso 6: frontmatter con `verdict` + cuerpo, confirmación con `(verdict: <VALOR>)` → Paso 7 solo con `APPROVED`.

### F-2 — `story-specify` enruta // AC-2

Paso 3 lee `verdict` → `APPROVED`: DoD → `SPECIFY/DONE`. `SPLIT`, o `NEEDS-REFINEMENT` con S = 1: Paso 4 (`story-split`) →
si no aplica, 5A. `NEEDS-REFINEMENT`: 5A (`story-improve`) → 5B (`product-owner`) → Paso 6 (gate anti-bucle) → vuelta a
`story-evaluation` solo con confirmación. Es el bucle `NEEDS-REFINEMENT` → `story-refine` → `story-evaluation` del
flowchart.

### F-3 — `story-improve` ante un reporte heredado // AC-2 (degradación)

El frontmatter no tiene `verdict` → `⚠️ … ejecuta /story-evaluation <STORY-NNN> …` → termina sin escribir. Dentro de
`story-specify` no ocurre porque el reporte es nuevo. Si ocurriera, el manejador existente («`story-improve` falla»,
l.244) registra `⚠️` y sigue a 5B.

### F-4 — Cambio de contrato (P6) // AC-1

Si la policy cambia los valores de `story-evaluation`, cambian la columna «Veredicto» de D-1, las líneas de D-3, el
enrutamiento de D-6 y las evals de D-10. La estructura (D-2, D-4) no depende de los valores, y las condiciones FINVEST
tampoco.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Tabla de primera coincidencia (D-1) | Dos reglas «independientemente del score» se solapan. Sin orden, el caso S = 1 + otra = 1 queda indeterminado. | AC-1, CNF-1 |
| Seis formas de motivo (D-3) | `NEEDS-REFINEMENT` agrupa cuatro condiciones distintas. Sin el motivo se pierde la diferencia que hoy daba `RECHAZAR`. | AC-1 |
| Señal S = 1 en `story-specify` (D-6) | Sin ella, la fila 2 de D-1 con S = 1 deja de llegar a `story-split`, un camino que hoy existe. | AC-2 |
| `⚠️` para reportes sin `verdict` (D-7) | Leer `decision` exigiría escribir valores prohibidos por CS-10. Ignorarlo mejoraría historias ya aprobadas. | AC-2 |
| Tres casos de eval nuevos (D-10) | Ninguno de los cinco actuales cubre `APPROVED`, la banda 3.0-4.0 ni la precedencia. | AC-1, CNF-1 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Ningún valor heredado en los archivos alcanzados, salvo los `not_contains` de `skills/story-evaluation/evals/evals.json` | `grep -rn -E "APROBADA\|Aprobada\|REFINAR\|RECHAZAR\|DIVIDIR" skills/story-evaluation skills/story-specify skills/story-improve skills/story-split skills/story-creation docs/templates/story-template.md docs/guides/sddf-commands-pipeline.md docs/requirements/functional/FR-031-*.md` solo devuelve líneas de `not_contains` de ese archivo, y ninguna con `APROBADA` | AC-1, AC-2 |
| V-2 | El template declara `verdict` y no `decision` | `grep -n -E '^(type\|verdict\|decision):' skills/story-evaluation/assets/evaluation-output-template.md` → `type` y `verdict` | AC-1 |
| V-3 | El primer `##` tras `# Evaluación FINVEST` es `## Veredicto`, y le sigue `## Historia evaluada` | `grep -n '^#' skills/story-evaluation/assets/evaluation-output-template.md` (orden `#`, `## Veredicto`, `## Historia evaluada`, sin otro `##` entre ellos) | AC-1 |
| V-4 | Solo `## Veredicto` declara el valor | `grep -n -E 'FINVEST Decisi\|gateway_decision\|\{decision\}' skills/story-evaluation/assets/evaluation-output-template.md` no devuelve nada | AC-1 |
| V-5 | El Paso 4 coincide con D-1 (orden y umbrales) y el Paso 5 escribe la línea de D-3 | Lectura de `SKILL.md`, comparada con la tabla del SKILL vigente (l.146-153) para confirmar umbrales idénticos | AC-1, CNF-1 |
| V-6 | Los consumidores no leen `decision` | `grep -rn "decision:" skills/story-specify skills/story-improve skills/story-split` no devuelve nada (salvo ejemplos de entrada que lo citen como heredado: ninguno tras D-9) | AC-2 |
| V-7 | `story-specify` enruta según D-6, incluida la fila S = 1, y conserva el gate anti-bucle | Lectura de los Pasos 3-6 de `skills/story-specify/SKILL.md` | AC-2 |
| V-8 | Las dos copias del template de historia siguen idénticas | `diff -q docs/templates/story-template.md skills/story-creation/assets/story-template.md` | AC-1 |
| V-9 | C-1…C-6 de D-11 se cumplen frente a la policy publicada | Lectura comparada; resultado anotado en `implement-report.md` | AC-1 |
| V-10 | El gate determinista pasa | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-11 | Las evals pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- story-evaluation`, `story-specify`, `story-improve` | AC-1, AC-2, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que lee `decision:`]** → rompe, como prevé la épica. La traducción vive en §5 de la policy, y
  `story-improve` lo hace visible con `⚠️` (D-7).
- **[El agente escribe prosa con «refinar» o «dividir»]** → las evals afirman solo mayúsculas (`REFINAR`, `RECHAZAR`,
  `DIVIDIR`), que es la forma de los valores. La prosa en minúsculas no es un veredicto.
- **[Template central desactualizado en un proyecto consumidor]** → `story-evaluation` lee su propio
  `assets/evaluation-output-template.md`, no uno central, así que no hay deriva posible.
- **[Muchos archivos tocados]** → son reemplazos textuales guiados por D-9. V-1 y V-6 los cierran con `grep`.
- **[La policy publicada difiere del diseño de STORY-138]** → D-11 aplica la versión publicada y registra la diferencia.
- **[Copias de runtime desactualizadas]** → `.claude/skills/` se regenera con `npx agile-sddf install --force`. No está
  versionado.

## Open Questions

Ninguna. La precedencia entre `SPLIT` y `NEEDS-REFINEMENT` se resuelve en D-1. El camino «`RECHAZAR` con recomendación de
división» se resuelve en D-6, los reportes heredados en D-7 y la posible división de la historia en D-12.

## Autoevaluación (P9, P10)

- **Omisiones:** las cuatro filas de AC-1, las tres de AC-2 y CNF-1 tienen decisión y verificación. Todos los consumidores
  de las Notas están en D-9, más `docs/templates/story-template.md`, la guía de comandos, FR-031 y los ejemplos de
  `story-split`. `migrate-finvest-field.js` queda fuera con justificación (CR-001).
- **Ambigüedad:** precedencia (D-1), motivo (D-3), señal de split (D-6) y reportes sin `verdict` (D-7) quedan fijados.
- **Nombres:** «veredicto» designa el valor, `verdict` el campo y `## Veredicto` la sección. «Decisión» desaparece como
  nombre del resultado del gate. La columna del backlog de `story-specify` pasa a `Veredicto FINVEST`.
- **Estructura:** sin dependencias cíclicas. `story-evaluation` escribe y los consumidores leen solo `verdict` (y S, en
  `story-specify`). Ningún consumidor conoce la tabla de D-1. La policy es una referencia, no una dependencia de runtime.
  Cada decisión tiene una sola responsabilidad: regla (D-1), estructura (D-2, D-4), texto (D-3), consumo (D-6…D-8).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: reutilización
- **Descripción**: las Notas de la historia listan `scripts/migrate-finvest-field.js` entre los consumidores que hay que
  actualizar. El script es la migración de STORY-090: detecta el bloque retirado `**FINVEST Decisión:**` en el cuerpo
  de `story.md` y copia su valor, sin interpretarlo, a la tabla de consola. No lee `decision:` de
  `finvest-evaluation-report.md` ni contiene `APROBADA`, `REFINAR`, `RECHAZAR` o `DIVIDIR`. Cambiarlo rompería su propósito,
  que es reconocer el formato heredado.
- **Documento afectado**: story.md (nota informativa, no un AC)
- **Acción requerida**: ninguna en el código. `story.md` no necesita cambios porque ningún AC depende de la nota.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `docs/product/roadmap.md` (l.59, l.145, l.248) y `docs/product/story-map.md` (l.43-46, l.107) nombran
  `APROBADA` / `REFINAR` / `RECHAZAR` / `DIVIDIR` como decisiones de `story-evaluation`. `product/` es documentación
  estratégica, y el roadmap es append-only (propuestas fechadas), así que no se edita en una historia de alineación de
  skill. SMOKE-3 y CS-10 buscan `APROBADA` en la «documentación vigente».
- **Documento afectado**: STORY-143 (dueña de CS-10 y SMOKE-3)
- **Acción requerida**: que STORY-143 fije si `docs/product/` cuenta como documentación vigente o como registro
  histórico, igual que `docs/specs/` y las versiones publicadas del CHANGELOG.
