---
alwaysApply: false
type: design
id: STORY-141
slug: STORY-141-alinear-story-code-review-design
title: "Design: Alinear story-code-review"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-141
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-141-alinear-story-code-review
  - STORY-138-contrato-de-validacion
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-141-alinear-story-code-review]] · [[STORY-138-contrato-de-validacion]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear story-code-review

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `story-code-review`, el gate de revisión de código, y
sus consumidores. Aplica el contrato tal como lo fija el diseño de STORY-138: reglas G-01…G-06, fila `story-code-review`
de §4 (`APPROVED`, `NEEDS-CHANGES`, sin valores sin rama), equivalencias de §5 (`approved` → `APPROVED`,
`needs-changes` → `NEEDS-CHANGES`), la regla D-7 sobre reportes heredados y el ejemplo 7.4 (`type: code-review-report`,
`# Code Review Report: …`, siguiente `##` = `## Resumen`).

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/story-code-review/assets/code-review-report-template.md` (87 líneas) | Frontmatter con `review-status: {{REVIEW_STATUS}}` (l.5) y `max-severity` (l.7). Tras `# Code Review Report: {{STORY_ID}}` (l.15), el primer `##` es `## Resumen` (l.17), con la fila `Review status` (l.22). La decisión está al final, en `## Decisión final` (l.68), como `**review-status: {{REVIEW_STATUS}}**` (l.70) seguido de `{{DECISION_RATIONALE}}` (l.72). Después vienen `## Siguiente acción` (l.76) y `## Cumplimiento DoD — Fase CODE-REVIEW` (l.82). |
| `skills/story-code-review/assets/fix-directives-template.md` (41 líneas) | `review-status: needs-changes` fijo en el frontmatter (l.5), `- **Review status:** needs-changes` (l.17) y el paso 4 del ciclo: «Si el resultado es `approved`…» (l.41). |
| `skills/story-code-review/SKILL.md` (670 líneas) | La regla vive en 4c (l.384-392) y se recalcula en 4c.1 (l.431-438): `approved` si `max_severity ∈ {LOW, ninguna}`, `needs-changes` si `∈ {HIGH, MEDIUM}`. La variable es `$REVIEW_STATUS`. Hay valores heredados en l.29-30, l.46-47, l.57-58, l.400, l.442, l.455-459, l.470, l.478, l.500, l.510, l.518, l.538, l.547, l.563, l.574, l.594, l.622 y l.661. El Paso 5b (l.542) inserta «contenido de cada informe parcial» en `## Hallazgos por dimensión`. |
| Subagentes (`skills/story-code-review/agents/*.agent.md`) | Cada informe parcial de `.tmp/` declara `status: approved \| needs-changes` y cierra con su propio `## Veredicto` `{approved \| needs-changes}: …`. El árbitro solo lee `max-severity` (4a-4b). |
| `skills/story-code-review/examples/` | `example-approved/code-review-report.md` (l.5, l.21, l.54-56), `example-needs-changes/fix-directives.md` y `example-needs-changes-medium/fix-directives.md` (l.5, l.17, l.40 y l.40-42). Los `*-report.md` de los ejemplos modelan informes de subagentes. |
| `skills/story-code-review/evals/evals.json` | `version: 1.0.0`, 16 casos. Todos afirman `approved` o `needs-changes` en minúsculas en `contains` o `not_contains`. Las `description` de TC-001, TC-006, TC-007, TC-011, TC-014 y TC-015 los citan. Los `name` de TC-006 y TC-011 contienen `approved`. |
| `skills/story-code-review/README.md` | l.16: «solo cuando la decisión es `needs-changes`». |
| `skills/story-implement-tasks/SKILL.md` | **No lee `review-status`.** El disparador del rework es la presencia de `fix-directives.md` (l.150, pre-paso 2f l.373-396). Lee `round`, la tabla «Instrucciones de corrección» y la «Lista blanca». Solo l.69 nombra `needs-changes` como texto (ver CR-001). |
| `skills/story-implement-tasks/evals/evals.json` | TC-001 modela un `fix-directives.md` sin `review-status`. La `description` de TC-004 dice «eliminado por un approved posterior». |
| `skills/story-implement/` | `SKILL.md` tampoco lee `review-status` (l.296: «la única señal» es la presencia). `README.md` l.21: `[approved: → CODE-REVIEW/DONE \| rechazo: …]`. `evals/evals.json` TC-016 (l.1143): fixture con `"review-status": "needs-changes"` en el frontmatter de `fix-directives.md`. |
| DoD CODE-REVIEW | `docs/guardrails/dod-story-code-review.md` l.25 y su semilla `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` l.25: «Revisión de código aprobada (Review status approved en `code-review-report.md`)». |
| Documentación vigente | `docs/guides/sddf-commands-pipeline.md` l.225, l.231, l.232 y l.234; `docs/architecture/state-machine.md` l.49 y l.102; `docs/domains/domain-story-lifecycle.md` l.98 y l.116. |
| Flowchart | `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid` ya usa `NEEDS-CHANGES` → `story-implement` (l.5). No cambia. |
| `scripts/run-evals.js` | Califica la salida de consola con subcadenas sensibles a mayúsculas. No inspecciona archivos. |
| `docs/policies/validation-contract-policy.md` | Todavía no existe. Lo crea STORY-138 (ver D-11). |

## Goals / Non-Goals

**Goals:**

- `code-review-report.md` declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras
  `# Code Review Report: …`, con el mismo valor. // satisface: AC-1
- La regla emite `APPROVED` sin hallazgos bloqueantes y `NEEDS-CHANGES` con al menos uno, con los mismos umbrales que
  hoy. // satisface: AC-1, CNF-1
- `code-review-report.md` y `fix-directives.md` no contienen `review-status` ni el valor `approved`. // satisface: AC-2
- El ciclo de corrección con `fix-directives.md` funciona igual: los consumidores leen las mismas secciones. // satisface: AC-2

**Non-Goals:**

- Cambiar los cuatro subagentes revisores, su formato de informe o sus dimensiones (Fuera de alcance de la historia).
  Sus informes de `.tmp/` conservan `status: approved | needs-changes` (ver D-4 y D-10).
- Reescribir los `code-review-report.md` y `fix-directives.md` históricos de `docs/specs/stories/` (Fuera de alcance; la
  policy los trata con D-7 de STORY-138).
- Cambiar la regla de severidad, los umbrales o la regla de hallazgo bloqueante (CNF-1).
- Reescribir los fixtures de migración de `skills/memory-system/examples/dod-*` (ver CR-002).
- Añadir una entrada al CHANGELOG: la escribe `/doc-release-notes` al publicar.

## Decisions

### D-1 — Regla de veredicto sin cambio de criterio // satisface: AC-1, CNF-1

La variable `$REVIEW_STATUS` se renombra `$VERDICT` en todo `SKILL.md`. El paso 4c se titula «4c. Derivar el veredicto».
Su regla, y la del recálculo de 4c.1, quedan así:

| Condición (`$MAX_SEVERITY`) | `$VERDICT` | Fila de AC-1 |
|---|---|---|
| `LOW` o `ninguna` | `APPROVED` | ningún hallazgo bloqueante |
| `HIGH` o `MEDIUM` | `NEEDS-CHANGES` | al menos uno bloqueante |

- **Hallazgo bloqueante** = severidad `HIGH` o `MEDIUM`. Es la misma definición que ya usa 4e para la lista blanca y que
  cuenta `{{TOTAL_BLOCKING}}`. 4c la enuncia en una línea, para que AC-1 y `fix-directives.md` usen el mismo término.
- **Sin cambios:** el orden `HIGH > MEDIUM > LOW > ninguna` (4b), el fail-safe de 4a (un informe ausente o con
  frontmatter inválido cuenta como `HIGH`) y la severidad de los criterios DoD (4c.1). Por eso un informe roto produce
  `NEEDS-CHANGES`, nunca `APPROVED`.
- Las ramas `[needs-changes]` y `[approved]` de los encabezados 4e-4h pasan a `[NEEDS-CHANGES]` y `[APPROVED]`.

| Alternativa | Motivo del rechazo |
|---|---|
| Emitir `BLOCKED` cuando falta un informe de subagente | Cambia el criterio vigente (CNF-1). Además, §4 de la policy no permite `BLOCKED` a `story-code-review` y el flowchart no tiene esa rama. |
| Conservar `$REVIEW_STATUS` con minúsculas y traducir solo al escribir | El mismo concepto tendría dos nombres y dos grafías dentro del skill (P4). Cada traducción es un punto donde se puede escapar `approved`. |

### D-2 — Frontmatter: `verdict` en lugar de `review-status` // satisface: AC-1, AC-2

En `code-review-report-template.md`, la l.5 pasa a `verdict: {{VERDICT}}`, en la misma posición. `max-severity`,
`reviewers`, `date`, `story` y `title` no cambian, porque no declaran el veredicto (G-04). El Paso 5b completa el
frontmatter con `story_id`, `$VERDICT`, la fecha y `$MAX_SEVERITY`.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener `review-status` junto a `verdict` durante una transición | Viola G-04 y el `Pero` de AC-2. La compatibilidad hacia atrás la da la tabla §5 de la policy. |
| Llamar al campo `review-verdict` | G-01 exige el nombre `verdict`, y CI lo leería igual en todos los reportes (Para de la historia). |

### D-3 — Sección `## Veredicto` al inicio; desaparece `## Decisión final` // satisface: AC-1

Estructura del template tras el cambio:

| Orden | Encabezado | Contenido |
|---|---|---|
| — | `# Code Review Report: {{STORY_ID}}` | Sin cambios |
| 1 | `## Veredicto` | `` **Veredicto:** `{{VERDICT}}` — {{VERDICT_REASON}} ``, una línea en blanco y `{{DECISION_RATIONALE}}` |
| 2 | `## Resumen` | Tabla actual **sin** la fila `Review status` (l.22). Se conserva `Severidad máxima detectada` |
| 3…  | `## Hallazgos por dimensión`, `## Siguiente acción`, `## Cumplimiento DoD — Fase CODE-REVIEW` | Sin cambios de nombre ni de orden |

`## Decisión final` (l.68-74) se elimina con su separador `---`. Su `{{DECISION_RATIONALE}}` pasa a `## Veredicto`,
porque G-02 admite motivos breves tras la línea de veredicto.

**`{{VERDICT_REASON}}`** es determinista, para que las evals puedan afirmarlo:

| `$VERDICT` | Motivo |
|---|---|
| `APPROVED` | `Sin hallazgos bloqueantes (severidad máxima: <LOW \| ninguna>).` |
| `NEEDS-CHANGES` | `<N> hallazgo(s) bloqueante(s) (severidad máxima: <HIGH \| MEDIUM>).` |

`<N>` es el mismo total de hallazgos `HIGH`/`MEDIUM` (agentes + DoD) que `{{TOTAL_BLOCKING}}` de `fix-directives.md`.
`{{DECISION_RATIONALE}}` sigue siendo la justificación libre de hoy, en una o dos frases.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar `## Decisión final` al final con el valor canónico | Dos lugares declararían el veredicto (G-04), y AC-1 exige que el veredicto sea la primera sección. |
| Mover `## Decisión final` al inicio con su nombre | G-02 fija el encabezado `## Veredicto`. Un nombre propio rompería SMOKE-1, que busca la misma sección en los seis reportes. |
| Motivo libre redactado por el agente | No se puede afirmar en evals, y dos ejecuciones iguales darían textos distintos. |

### D-4 — Los informes parciales se insertan sin su veredicto // satisface: AC-2

El Paso 5b cambia «Sección Hallazgos por dimensión: contenido de cada informe parcial» por esta regla: cada
`{{TECH_LEAD_FINDINGS}}`, `{{PRODUCT_OWNER_FINDINGS}}`, `{{INTEGRATION_FINDINGS}}` y `{{SECURITY_FINDINGS}}` recibe
**solo la tabla de la sección `## Hallazgos`** de su informe. Nunca recibe el frontmatter (`status`) ni la sección
`## Veredicto` del subagente. `{{TESTCASES_COVERAGE_SECTION}}` ya extrae secciones concretas («Hallazgos — Cobertura…» y
«Hallazgos — Trazabilidad…») y no cambia. El ejemplo `example-approved/code-review-report.md` ya sigue esta forma.

Por qué: los subagentes conservan `status: approved | needs-changes` y su propio `## Veredicto` (Non-Goals). Copiarlos
reintroduciría `approved` en el reporte (el `Pero` de AC-2) y un segundo `## Veredicto` (G-02).

| Alternativa | Motivo del rechazo |
|---|---|
| Alinear también los cuatro subagentes | Fuera de alcance según la historia. |
| Copiar el informe completo y reemplazar los valores al insertarlo | Es frágil: depende de que el agente escriba el valor con una grafía exacta, y aun así dejaría un `## Veredicto` duplicado. |

### D-5 — `fix-directives.md` sin campo de veredicto // satisface: AC-2

En `fix-directives-template.md`:

| Línea | Hoy | Tras el cambio |
|---|---|---|
| l.5 | `review-status: needs-changes` | se elimina; el frontmatter queda `type`, `story`, `title`, `date`, `max-severity`, `round`, `based-on` |
| l.17 | `- **Review status:** needs-changes` | `` - **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`) `` |
| l.41 | `4. Si el resultado es `approved`, este archivo se elimina…` | `` 4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`. `` |

El Paso 4f.2 deja de mencionar el campo. La señal de rework sigue siendo la **presencia** del archivo, y `based-on`
apunta al reporte, que es la fuente única del veredicto. `fix-directives.md` está fuera del alcance de la policy (§1 de
STORY-138: «artefacto de rework, no un reporte de veredicto»), así que no necesita `## Veredicto`.

| Alternativa | Motivo del rechazo |
|---|---|
| `verdict: NEEDS-CHANGES` en el frontmatter | Haría que `fix-directives.md` pareciera un reporte de validación. Un lector de CI que recorra `verdict:` vería dos fuentes por historia. El valor es constante, así que no aporta información. |
| Eliminar también la línea del cuerpo | Un lector humano perdería el porqué del archivo. La línea nombra el reporte de origen y no es leída por ningún consumidor. |

### D-6 — Salida de consola con el veredicto // satisface: AC-1, AC-2

El runner de evals solo ve la consola, así que el veredicto debe aparecer en ella. Se reutiliza la forma de STORY-140 D-5 (P3):

| Lugar en `SKILL.md` | Hoy | Tras el cambio |
|---|---|---|
| Paso 5b, confirmación | `📄 Reporte generado: <ruta>/code-review-report.md` | `📄 Reporte generado: <ruta>/code-review-report.md (verdict: <VERDICT>)` |
| Paso 4g | `⚠️  Review: needs-changes — story.md → READY-FOR-IMPLEMENT/DONE` | `⚠️  Veredicto: NEEDS-CHANGES — story.md → READY-FOR-IMPLEMENT/DONE` |
| Paso 7, bloque aprobado (l.594) | ` Review status:   <review_status>` | ` Veredicto:        APPROVED` |
| Paso 7, bloque con hallazgos (l.622) | ` Review status:   needs-changes` | ` Veredicto:        NEEDS-CHANGES` |

`✅ Revisión aprobada — historia lista para verificación final` y `⚠️  Revisión completada con hallazgos críticos`
se mantienen. Son prosa de cierre, no valores de veredicto.

| Alternativa | Motivo del rechazo |
|---|---|
| Imprimir el frontmatter completo | Ruido, y duplica `## Veredicto`. |
| No tocar la consola | Las evals no podrían distinguir un reporte alineado de uno heredado. |

### D-7 — Consumidores: solo cambios de texto // satisface: AC-2

`story-implement` y `story-implement-tasks` no leen `review-status` (verificado, ver Context y CR-001). Leen la
presencia de `fix-directives.md`, `round`, la tabla «Instrucciones de corrección» (columnas `#`, `Archivo:Línea`,
`Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`) y la «Lista blanca de archivos permitidos para modificar».
D-5 no toca ninguno de esos elementos. Por tanto, «la corrección se aplica igual» (AC-2) se garantiza porque el
contrato de lectura no cambia. No hay cambios de lógica en los consumidores.

| Alternativa | Motivo del rechazo |
|---|---|
| Hacer que los consumidores comprueben `verdict: NEEDS-CHANGES` en `code-review-report.md` antes de aplicar | Añade una segunda señal de rework y contradice ADR-0008 («la señal es la presencia»). Un reporte heredado bloquearía un rework legítimo. |
| Dejar el texto heredado en los consumidores | Incumple CS-10 de la épica, que STORY-143 verifica. |

### D-8 — Inventario de cambios en textos // satisface: AC-1, AC-2

| Archivo | Líneas | Cambio |
|---|---|---|
| `skills/story-code-review/SKILL.md` | l.22 | «con la decisión final» → «con el veredicto» |
| | l.29-30, l.46-47, l.58, l.661 | `approved` → `APPROVED`; `needs-changes` → `NEEDS-CHANGES` |
| | l.57 | «hallazgos por dimensión, decisión final» → «veredicto y hallazgos por dimensión» |
| | l.384-392, l.400, l.431-442, l.455-457, l.538, l.563, l.574 | D-1 (`$VERDICT`, valores canónicos) |
| | l.459, l.470, l.500, l.518 | Etiquetas de rama de D-1 |
| | l.478 | «cerradas en `needs-changes`» → «cerradas en `NEEDS-CHANGES`» |
| | l.510, l.594, l.622 y la confirmación del Paso 5b | D-6 |
| | l.542 | D-4 |
| | l.547 | «Sección Decisión final: `$REVIEW_STATUS` con justificación» → «Sección `## Veredicto`: línea de D-3 con `$VERDICT` y `{{VERDICT_REASON}}`, seguida de `{{DECISION_RATIONALE}}`» |
| `skills/story-code-review/assets/code-review-report-template.md` | l.5, l.17-26, l.68-74 | D-2 y D-3 |
| `skills/story-code-review/assets/fix-directives-template.md` | l.5, l.17, l.41 | D-5 |
| `skills/story-code-review/README.md` | l.11, l.16 | «deja una decisión consolidada» → «deja un veredicto consolidado (`APPROVED` \| `NEEDS-CHANGES`)»; «solo cuando la decisión es `needs-changes`» → «solo cuando el veredicto es `NEEDS-CHANGES`» |
| `skills/story-code-review/examples/example-approved/code-review-report.md` | l.5, l.21, l.54-61 | Mismo cambio que el template: `verdict: APPROVED`, `## Veredicto` tras el título con `` **Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: ninguna). ``, sin fila `Review status` y sin `## Decisión final` |
| `skills/story-code-review/examples/example-needs-changes/fix-directives.md` y `…-medium/fix-directives.md` | l.5, l.17, l.40 | D-5. En `…-medium` l.45, «→ needs-changes» → «→ `NEEDS-CHANGES`» |
| `skills/story-implement-tasks/SKILL.md` | l.69 | «(`needs-changes`)» → «(veredicto `NEEDS-CHANGES`)» |
| `skills/story-implement/README.md` | l.21 | `[approved: → CODE-REVIEW/DONE \| rechazo: …]` → `[APPROVED: → CODE-REVIEW/DONE \| NEEDS-CHANGES: …]` |
| `docs/guardrails/dod-story-code-review.md` y `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` | l.25 | «(Review status approved en `code-review-report.md`)» → «(`verdict: APPROVED` en `code-review-report.md`)» |
| `docs/guides/sddf-commands-pipeline.md` | l.225, l.231, l.232, l.234 | Valores canónicos en mayúsculas |
| `docs/architecture/state-machine.md` | l.49, l.102 | `needs-changes` → `NEEDS-CHANGES` |
| `docs/domains/domain-story-lifecycle.md` | l.98, l.116 | `needs-changes` → `NEEDS-CHANGES` |

Los `*-report.md` de `examples/` son informes de subagentes y no cambian (D-4, D-10).

| Alternativa | Motivo del rechazo |
|---|---|
| Limitar el cambio a los dos templates | El SKILL seguiría instruyendo `review-status`, y el agente lo escribiría pese al template. Los ejemplos y la guía contradirían el reporte. |
| Incluir también los fixtures `dod-*` de `memory-system` | Son entradas de migración que modelan proyectos heredados. Reescribirlos cambia lo que prueban (CR-002). |

### D-9 — Evals // satisface: AC-1, AC-2, CNF-1

**`skills/story-code-review/evals/evals.json`** (`version` → `1.1.0`; la `description` del skill cambia «happy path
aprobado, needs-changes» por «veredicto APPROVED, veredicto NEEDS-CHANGES»):

| Casos | Veredicto esperado | `contains` (se añade) | `not_contains` (sustituye a `approved` / `needs-changes`) |
|---|---|---|---|
| TC-001, TC-006, TC-008, TC-011 | `APPROVED` | `"(verdict: APPROVED)"`, `"Veredicto:"` | `"(verdict: NEEDS-CHANGES)"` |
| TC-002, TC-005, TC-007, TC-009, TC-010, TC-012…TC-015 | `NEEDS-CHANGES` | `"(verdict: NEEDS-CHANGES)"`, `"Veredicto:"` | `"(verdict: APPROVED)"` |
| TC-003, TC-004, TC-016 (fail-fast) | ninguno | — | `"(verdict: "` |

- Se retiran de `contains` los literales `approved` y `needs-changes`. Se conservan `Revision aprobada` y su ausencia en
  los casos de rechazo, porque es la prosa de cierre de D-6.
- TC-001 añade `"Sin hallazgos bloqueantes"` (AC-1, fila 1). TC-002 añade `"hallazgo(s) bloqueante(s)"` (AC-1, fila 2).
- `name`: TC-006 → `advertencia-tamano-cambio-no-afecta-veredicto`; TC-011 → `aprobacion-elimina-fix-directives-previo`.
  Los `name` con `needs-changes` se mantienen: son identificadores kebab-case y CS-10 no lista esa grafía.
- Las `description` de TC-001, TC-006, TC-007, TC-011, TC-014 y TC-015 pasan a «veredicto `APPROVED`» o «veredicto
  `NEEDS-CHANGES`».

**`skills/story-implement-tasks/evals/evals.json`** (`version` → `1.0.1`): la `description` de TC-004 cambia «eliminado
por un approved posterior» por «eliminado tras un veredicto APPROVED posterior». TC-001 ya modela un `fix-directives.md`
sin `review-status` y cubre «la corrección se aplica igual» (AC-2). No necesita cambios.

**`skills/story-implement/evals/evals.json`** (`version` → `1.3.1`): en TC-016 se elimina la clave `"review-status"`
del fixture `fix_directives.frontmatter`. El caso prueba la ausencia de `round`, no el campo retirado.

Ningún `not_contains` usa `approved` ni `review-status`: SMOKE-3 busca esos literales en `skills/` (mismo criterio que
STORY-140 D-10). Su ausencia en el reporte y en `fix-directives.md` se verifica en la fuente (V-1, V-2, V-5).

| Alternativa | Motivo del rechazo |
|---|---|
| `not_contains: "approved"` para probar el `Pero` de AC-2 | Introduce en `skills/` el literal que prohíbe CS-10, y con mayúsculas sensibles no detecta nada útil. |
| Afirmar solo `"APPROVED"` / `"NEEDS-CHANGES"` | `APPROVED` aparece en otras frases posibles. La forma `(verdict: X)` es única y la produce solo el Paso 5b. |
| Añadir un caso nuevo por fila de AC-1 | TC-001 y TC-002 ya cubren las dos filas con los mismos datos de entrada. Bastan las aserciones nuevas. |

### D-10 — Excepción registrada para los informes de subagentes // satisface: AC-2

Los cuatro `*.agent.md` y los `*-report.md` de `examples/` conservan `status: approved | needs-changes` y su
`## Veredicto` propio (Non-Goals). No son reportes del contrato y ningún consumidor los lee, pero CS-10 los encontraría
en `skills/`. Por eso se añade una fila a §6 «Excepciones» de la policy:

| Skill | Elemento conservado | Motivo | Historia |
|---|---|---|---|
| `story-code-review` | `status: approved \| needs-changes` y `## Veredicto` en los informes parciales de los subagentes (`agents/*.agent.md`, `examples/*/*-report.md`) | Son intermedios de `.tmp/`. El árbitro solo lee `max-severity` y no los copia al reporte (D-4). Alinear los subagentes queda fuera del alcance de STORY-141 | STORY-141 |

La fila reemplaza `Sin excepciones vigentes.` si sigue siendo la única. La policy sube a la siguiente versión menor y
añade una fila en «Historial de cambios». Así se sigue F-1, paso 4, del diseño de STORY-138.

| Alternativa | Motivo del rechazo |
|---|---|
| No registrar nada | STORY-143 encontraría `approved` en `skills/` sin saber si es un defecto o una decisión. |
| Registrar la excepción en el README del skill | Dispersa el contrato (CNF-1 de STORY-138). |

### D-11 — Conformidad con la policy y secuencia // satisface: AC-1

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | D-2 |
| C-2 | G-02: `## Veredicto` es el primer `##` tras el `#`, con `` **Veredicto:** `<VALOR>` — <motivo> `` | D-3 |
| C-3 | G-03 y §4: solo `APPROVED`, `NEEDS-CHANGES` | D-1 |
| C-4 | G-04: ningún otro campo o línea del reporte declara el veredicto | D-2 (`review-status`), D-3 (fila `Review status`, `## Decisión final`) y D-4 (informes parciales) |
| C-5 | G-06: lectura cerrada ante fallo | D-1 (fail-safe a `NEEDS-CHANGES`) y D-7 (señal por presencia, sin cambios) |
| C-6 | §7.4: `type: code-review-report`, `# Code Review Report: …`, siguiente `##` = `## Resumen` | D-3 |
| C-7 | §6: divergencias registradas | D-10 |

La implementación empieza cuando `docs/policies/validation-contract-policy.md` existe (lo comprueba la primera tarea),
como en STORY-140 D-12. STORY-141 depende de STORY-138. C-1…C-7 se comparan con el texto publicado. Si difiere del
diseño de STORY-138, se aplica la versión publicada y la diferencia se anota en `implement-report.md`.

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Template del reporte de revisión | modificar | `skills/story-code-review/assets/code-review-report-template.md` | AC-1, AC-2 |
| Template de directivas de corrección | modificar | `skills/story-code-review/assets/fix-directives-template.md` | AC-2 |
| Árbitro y salida del skill | modificar | `skills/story-code-review/SKILL.md` (4c, 4c.1, 4d-4h, 5b, 6, 7, Salida) | AC-1, AC-2, CNF-1 |
| README del skill | modificar | `skills/story-code-review/README.md` | AC-1 |
| Ejemplos del skill | modificar | `skills/story-code-review/examples/example-approved/code-review-report.md`, `example-needs-changes*/fix-directives.md` | AC-1, AC-2 |
| Evals del skill | modificar | `skills/story-code-review/evals/evals.json` | AC-1, AC-2, CNF-1 |
| Consumidor `story-implement-tasks` | modificar (texto) | `skills/story-implement-tasks/SKILL.md` l.69, `evals/evals.json` TC-004 | AC-2 |
| Consumidor `story-implement` | modificar (texto) | `skills/story-implement/README.md` l.21, `evals/evals.json` TC-016 | AC-2 |
| DoD CODE-REVIEW y su semilla | modificar | `docs/guardrails/dod-story-code-review.md`, `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` | AC-1 |
| Documentación del ciclo | modificar | `docs/guides/sddf-commands-pipeline.md`, `docs/architecture/state-machine.md`, `docs/domains/domain-story-lifecycle.md` | AC-1, AC-2 |
| Excepciones de la policy | modificar | `docs/policies/validation-contract-policy.md` §6 e «Historial de cambios» | AC-2 |

No se tocan: `skills/story-code-review/agents/*.agent.md`, los `*-report.md` de `examples/`, la lógica de
`story-implement` y `story-implement-tasks`, los flowcharts, `docs/specs/**` ni `skills/memory-system/examples/**`.

## Interfaces

| Interfaz | Contrato | Productor → consumidor | Satisface |
|---|---|---|---|
| `verdict` en `code-review-report.md` | Clave YAML de primer nivel. Valor `APPROVED` \| `NEEDS-CHANGES` | `story-code-review` → CI, orquestadores, `epic-validate` | AC-1 |
| Línea de veredicto | Primera línea de `## Veredicto`: `` **Veredicto:** `<VALOR>` — <motivo de D-3> `` | `story-code-review` → lectores humanos | AC-1 |
| Presencia de `fix-directives.md` | Existe ⇔ el último veredicto fue `NEEDS-CHANGES`. Sin campo de veredicto | `story-code-review` → `story-implement`, `story-implement-tasks` | AC-2 |
| Contenido leído de `fix-directives.md` | `round`, tabla «Instrucciones de corrección» (6 columnas), «Lista blanca de archivos permitidos para modificar». **Sin cambios** | `story-code-review` → `story-implement`, `story-implement-tasks` | AC-2 |
| Informe parcial de subagente | Frontmatter con `max-severity` y sección `## Hallazgos`. **Sin cambios**. El árbitro solo lee esos dos elementos | subagentes → árbitro | AC-2, CNF-1 |
| Confirmación de consola | `📄 Reporte generado: <ruta>/code-review-report.md (verdict: <VALOR>)` | `story-code-review` → evals, orquestador | AC-1 |

## Esquema de datos // satisface: AC-1, AC-2

Cabecera de `code-review-report.md` (forma abstracta):

```markdown
---
type: code-review-report
story: <STORY-NNN>
title: "Code Review Report: <título>"
verdict: <APPROVED | NEEDS-CHANGES>
date: <YYYY-MM-DD>
max-severity: <HIGH | MEDIUM | LOW | ninguna>
reviewers: [tech-lead-reviewer, product-owner-reviewer, integration-reviewer, security-reviewer]
---

# Code Review Report: <STORY-NNN>

## Veredicto

**Veredicto:** `<VALOR>` — <motivo de D-3>

<justificación breve>

## Resumen
…
```

Frontmatter de `fix-directives.md`: `type: fix-directives`, `story`, `title`, `date`, `max-severity`, `round`,
`based-on: code-review-report.md`.

## Flujos clave

### F-1 — Revisión sin hallazgos bloqueantes // AC-1 fila 1

Los cuatro informes dan `max-severity ∈ {LOW, ninguna}` y el DoD no añade `HIGH`/`MEDIUM` → `$VERDICT = APPROVED` (4c,
4c.1) → 4h elimina el `fix-directives.md` residual → el Paso 5 escribe el reporte con `verdict: APPROVED` y
`## Veredicto` primero → el Paso 6 pasa `story.md` a `CODE-REVIEW/DONE` → la consola muestra `(verdict: APPROVED)`.

### F-2 — Revisión con al menos un hallazgo bloqueante y ciclo de corrección // AC-1 fila 2, AC-2

`max-severity ∈ {HIGH, MEDIUM}` → `$VERDICT = NEEDS-CHANGES` → 4e construye la lista blanca → 4f escribe
`fix-directives.md` (D-5, sin `review-status`) con `round: N` → 4g retrocede `story.md` a `READY-FOR-IMPLEMENT/DONE` →
el Paso 5 escribe el reporte con `verdict: NEEDS-CHANGES`. Después, `story-implement-tasks` detecta la presencia del
archivo (2c), lee `round`, la tabla y la lista blanca (2f) y aplica las correcciones como hoy. `story-implement` hace lo
mismo en su Paso 0c. Al volver a `/story-code-review`, F-1 elimina el archivo.

### F-3 — Degradación // P7

- **Falta un informe de subagente o tiene frontmatter inválido:** cuenta como `HIGH` (4a) → `NEEDS-CHANGES`. Nunca se
  aprueba en silencio.
- **Un subagente escribe su veredicto con otra grafía:** no importa, porque el árbitro no lo lee ni lo copia (D-4).
- **`fix-directives.md` heredado con `review-status`:** los consumidores lo ignoran como hoy. La siguiente ronda lo
  sobrescribe con la forma de D-5.
- **`code-review-report.md` heredado con `review-status`:** se lee con la tabla §5 de la policy (D-7 de STORY-138). Ningún
  skill del repositorio lo lee.

### F-4 — Puntos de cambio // P6

- Si cambia el umbral de bloqueo, solo cambia la tabla de D-1 en 4c y 4c.1. `{{VERDICT_REASON}}` y la lista blanca
  derivan de la misma definición de bloqueante.
- Si se alinean los subagentes en otra historia, se retira la fila de D-10 de §6 sin tocar el árbitro.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Motivo determinista `{{VERDICT_REASON}}` | Con motivo libre, AC-1 no se podría afirmar en evals, que solo comparan subcadenas | AC-1 |
| Regla de inserción de solo `## Hallazgos` (D-4) | Copiar el informe completo reintroduce `approved` y duplica `## Veredicto`. La regla es una línea en 5b | AC-2 |
| Fila de excepción en la policy (D-10) | Es una fila. Sin ella, CS-10 fallaría sin explicación y STORY-143 tendría que investigar | AC-2 |
| Cambios en DoD, guía, máquina de estados y dominio | Son reemplazos textuales. Sin ellos, la documentación vigente contradice el reporte y CS-10 falla | AC-1, AC-2 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Ningún valor heredado en los archivos alcanzados, salvo la excepción de D-10 | `grep -rn -E "review-status\|Review status\|REVIEW_STATUS\|\bapproved\b\|needs-changes\|Decisión final" skills/story-code-review skills/story-implement skills/story-implement-tasks skills/sddf-constitution/assets/dod-story docs/guardrails/dod-story-code-review.md docs/guides/sddf-commands-pipeline.md docs/architecture/state-machine.md docs/domains/domain-story-lifecycle.md` solo devuelve líneas de `agents/*.agent.md`, `examples/*/*-report.md` y los `name` de evals con `needs-changes` | AC-1, AC-2 |
| V-2 | El template declara `verdict` y no `review-status` | `grep -n -E '^(verdict\|review-status):' skills/story-code-review/assets/code-review-report-template.md` → solo `verdict` | AC-1, AC-2 |
| V-3 | El primer `##` tras el `#` es `## Veredicto` y le sigue `## Resumen` | `grep -n '^#' skills/story-code-review/assets/code-review-report-template.md` (orden `#`, `## Veredicto`, `## Resumen`) | AC-1 |
| V-4 | Solo `## Veredicto` declara el valor en el reporte | `grep -c '{{VERDICT}}' …/code-review-report-template.md` = 2 (frontmatter y línea de veredicto) | AC-1 |
| V-5 | `fix-directives-template.md` no tiene `review-status` ni `approved` y conserva `round`, la tabla y la lista blanca | `grep -n -E 'review-status\|approved' …/fix-directives-template.md` vacío; lectura de las secciones | AC-2 |
| V-6 | 4c y 4c.1 emiten `APPROVED` con `{LOW, ninguna}` y `NEEDS-CHANGES` con `{HIGH, MEDIUM}`; 4a, 4b y la severidad del DoD no cambian | `git diff` de `SKILL.md` limitado a nombres y valores en esos pasos | AC-1, CNF-1 |
| V-7 | El Paso 5b inserta solo la tabla `## Hallazgos` de cada informe | Lectura del Paso 5b | AC-2 |
| V-8 | `story-implement` y `story-implement-tasks` no cambian su lógica de rework | `git diff --stat` de los dos `SKILL.md`: solo l.69 de `story-implement-tasks` | AC-2 |
| V-9 | La fila de D-10 figura en §6 y la versión de la policy subió | Lectura de la policy | AC-2 |
| V-10 | C-1…C-7 de D-11 se cumplen frente a la policy publicada | Lectura comparada; resultado anotado en `implement-report.md` | AC-1 |
| V-11 | El gate determinista pasa | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-12 | Las evals pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- story-code-review`, `story-implement-tasks`, `story-implement` | AC-1, AC-2, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que lee `review-status`]** → se rompe, como prevé la épica. La traducción está en §5 de la policy.
- **[Criterio DoD autorreferente]** → «Revisión de código aprobada (`verdict: APPROVED`…)» se evalúa en 4c.1, antes de
  que exista el veredicto. Ya ocurre hoy con `review-status`. No se cambia, para respetar CNF-1.
- **[El agente copia el `## Veredicto` de un subagente pese a D-4]** → V-7 lo cubre en la fuente. Las evals lo detectan
  si aparece un segundo `Veredicto:` con otro valor.
- **[La policy publicada difiere del diseño de STORY-138]** → D-11 aplica la versión publicada y registra la diferencia.
- **[Conflicto de versión de la policy con otras historias de alineación]** → WIP = 1 serializa las historias. Cada una
  toma la versión vigente al implementar.
- **[Copias de runtime desactualizadas]** → `.claude/skills/` se regenera con `npx agile-sddf install --force`. No está
  versionado.

## Open Questions

Ninguna. La señal de rework (D-7), el formato de `fix-directives.md` (D-5) y el trato de los subagentes (D-4, D-10) quedan
resueltos.

## Autoevaluación (P9, P10)

- **Omisiones:** las dos filas de AC-1, AC-2 y CNF-1 tienen decisión y verificación. Los consumidores de las Notas
  (`story-implement-tasks` y los evals de los dos skills) están en D-7 y D-9, más `story-implement`, el DoD, la guía, la
  máquina de estados y el dominio.
- **Ambigüedad:** «bloqueante» queda definido en D-1. El motivo de D-3 es determinista. La regla de inserción (D-4) y el
  formato de `fix-directives.md` (D-5) son explícitos.
- **Nombres:** «veredicto» designa el valor, `verdict` el campo, `$VERDICT` la variable y `## Veredicto` la sección.
  «Review status» y «Decisión final» desaparecen del reporte y de `fix-directives.md`.
- **Estructura:** sin dependencias cíclicas. Los subagentes producen, el árbitro decide, y los consumidores leen solo
  `fix-directives.md`. Ningún consumidor depende del reporte. Cada decisión tiene una sola responsabilidad: regla (D-1),
  estructura (D-2, D-3), aislamiento de subagentes (D-4), rework (D-5, D-7), salida (D-6) y conformidad (D-10, D-11).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: reutilización
- **Descripción**: las Notas de la historia dicen que `skills/story-implement-tasks/SKILL.md` «lee `review-status`».
  No es así: el skill dispara el rework por la presencia de `fix-directives.md` (l.150, pre-paso 2f) y solo nombra
  `needs-changes` como texto en l.69. `story-implement` tampoco lo lee (l.296). Por eso el cambio en los consumidores es
  solo textual (D-7), y AC-2 se cumple sin tocar su lógica.
- **Documento afectado**: story.md (nota informativa, no un AC)
- **Acción requerida**: ninguna en el código. `story.md` no necesita cambios, porque ningún AC depende de la nota.

### CR-002
- **Tipo**: dependencia
- **Descripción**: CS-10 y SMOKE-3 (de STORY-143) buscan `review-status` y `approved` en `skills/`. Quedan dos grupos
  fuera del alcance de esta historia: (1) los subagentes de `story-code-review` y sus informes de ejemplo, por los
  Non-Goals, que se registran como excepción en D-10; (2) los fixtures de migración
  `skills/memory-system/examples/dod-{custom,legacy,monolithic,template}/`, que contienen «Review status approved» porque
  modelan DoD heredados de proyectos consumidores.
- **Documento afectado**: STORY-143 (dueña de CS-10 y SMOKE-3)
- **Acción requerida**: que STORY-143 excluya la excepción de §6 y fije si los fixtures de migración cuentan como
  documentación vigente o como entradas heredadas. Es el mismo criterio que STORY-140 CR-002 pide para `docs/product/`.
