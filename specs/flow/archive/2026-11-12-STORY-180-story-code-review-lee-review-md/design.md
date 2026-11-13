---
alwaysApply: false
type: design
id: STORY-180
slug: STORY-180-story-code-review-lee-review-md-design
title: "Design: story-code-review lee REVIEW.md"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-180
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-180-story-code-review-lee-review-md
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-179-review-md-de-agile-sddf
---

<!-- Referencias -->
[[STORY-180-story-code-review-lee-review-md]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-178-adr-guia-de-revision]] · [[STORY-179-review-md-de-agile-sddf]]

# Diseño técnico: story-code-review lee REVIEW.md

## Context

`/story-code-review` lanza cuatro revisores en paralelo y un árbitro (Pasos 4a-4c del orquestador) consolida sus informes. Hoy no conoce `REVIEW.md` y uno de sus agentes juzga con reglas propias de agile-sddf. Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `skills/story-code-review/SKILL.md` | El Paso 2d (líneas 276-293) resuelve `$CONSTITUTION_PATH` y `$DOD_PATH`. El Paso 2c (268-274) ya extrae `$IMPL_FILES` de `implement-report.md`. El bloque de contexto del Paso 3b (330-337) no incluye `REVIEW.md`. El árbitro calcula `$MAX_SEVERITY` leyendo el `max-severity` del frontmatter de cada informe (4b, 386-392). El resumen «Contexto cargado» está en 305-314. `## Entrada` (68-80) lista los artefactos opcionales. |
| `skills/story-code-review/agents/integration-reviewer.agent.md:48-49` | «un solo nivel de delegación» y «teléfono descompuesto» (Principio 6 de constitution.md): reglas de agile-sddf. Las líneas 53-54 (kebab-case, frontmatter YAML) son convenciones de este repo, no genéricas. |
| `skills/story-code-review/agents/tech-lead-reviewer.agent.md:35` | Nombra «kebab-case para archivos» como convención por defecto. |
| `skills/story-code-review/agents/security-reviewer.agent.md:83` | «Un subagente no invoca skills orquestadores»: restringe la conducta del propio agente, no es un criterio de revisión. Se conserva. |
| `docs/constitution.md` | Declara kebab-case (líneas 76, 101), «un solo salto de delegación» (144-153) y el principio 6 «teléfono descompuesto» (256). Esas reglas siguen aplicándose a este repo por `$CONSTITUTION_PATH`. |
| `skills/story-code-review/assets/code-review-report-template.md` | Contrato del informe (ADR-0015): frontmatter, `## Veredicto`, `## Resumen` (tabla de campos, con la fila `testcases.md`), hallazgos por dimensión, DoD. |
| `skills/story-code-review/evals/evals.json` | 23 casos (TC-001 a TC-023). STORY-177 reserva TC-024 y TC-025. |
| ADR de la guía de revisión (STORY-178, `docs/adr/ADR-0021-guia-de-revision-review-md.md`, aún no creado) | D-2: un solo `<REPO_ROOT>/REVIEW.md`. D-3: precedencia constitución > DoD > `REVIEW.md` > criterios genéricos de los revisores; `REVIEW.md` no cambia el formato. D-4: se lee del working tree, sin git. D-5: la detección de una historia que modifica la guía o el DoD compara con `$IMPL_FILES`, advierte en el informe y no cambia `verdict`; el texto y la sección los fija esta historia. D-6: vocabulario y PREEXISTENTE como categoría (STORY-181). |
| `REVIEW.md` (STORY-179) | No existe todavía. Tendrá cuatro secciones: «Qué es «Importante» aquí», «Tope de Minor», «No reportar», «Verificar siempre» (`docs/templates/REVIEW-template.md`). |
| `docs/guardrails/dod-story-code-review.md:21` | «Sin hallazgo bloqueante de severidad HIGH o MEDIUM»: el árbitro lo evalúa con la tabla consolidada. |

Stack: skill en Markdown más agentes locales; pruebas deterministas con `node:test` en `test/`; evals de simulación en `evals.json` (`contains`/`not_contains`), ejecutados a criterio humano.

## Goals / Non-Goals

**Goals:**
- El orquestador localiza `<REPO_ROOT>/REVIEW.md` en el working tree, lo muestra en «Contexto cargado» y pasa `$REVIEW_PATH` a los cuatro revisores. // satisface: AC-1, AC-4
- Los cuatro revisores aplican `REVIEW.md` con la precedencia del ADR, sin cambiar el formato de su informe. // satisface: AC-1, AC-2
- El árbitro aplica «No reportar» a los hallazgos consolidados antes de calcular la severidad. // satisface: AC-1, AC-2
- Sin `REVIEW.md`: advertencia no bloqueante y mismo frontmatter, secciones y veredicto que hoy. // satisface: AC-3, CNF-1
- Advertencia cuando `$IMPL_FILES` incluye `REVIEW.md` o `$DOD_PATH`. // satisface: AC-4
- Los agentes dejan de contener reglas propias de agile-sddf. // satisface: AC-5
- Evals primero y una prueba unitaria que fija el contrato. // satisface: CNF-2, CNF-3

**Non-Goals:**
- Redactar `REVIEW.md` (STORY-179) ni su semilla para consumidores (STORY-184).
- La categoría PREEXISTENTE (STORY-181), la verificación de evidencia y la deduplicación (STORY-182), el tope de LOW aplicado por el árbitro y los arrastres entre rondas (STORY-185). Ver CR-001.
- Cambiar las rutas de los informes parciales o el descubrimiento de checklists (STORY-177).
- Leer `REVIEW.md` de subdirectorios o de la rama base (ADR, D-2 y D-4).
- Actualizar `skills/story-code-review/examples/`: `example-approved/code-review-report.md` ya no sigue la plantilla actual (no tiene sección de Seguridad); alinearlo no es parte de esta historia.
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes (salida de `agile-sddf install`).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Orquestador | modificar | `skills/story-code-review/SKILL.md`: `## Entrada` (fila `REVIEW.md`), Paso 2d.1 y 2d.2 nuevos, resumen «Contexto cargado», bloque de contexto y principio compartido del Paso 3b, Paso 4a.1 nuevo, Paso 4b, Paso 4c.1 (fuente de evaluación), Paso 5b (`{{REVIEW_STATUS}}`), tabla de manejo de errores | AC-1 a AC-4, CNF-1 |
| C-2 | Plantilla del informe | modificar (una fila en `## Resumen`) | `skills/story-code-review/assets/code-review-report-template.md` | AC-1, AC-3, AC-4, CNF-1 |
| C-3 | Tech-Lead-Reviewer | modificar | `skills/story-code-review/agents/tech-lead-reviewer.agent.md`: contexto recibido, sección «Guía de revisión (REVIEW.md)», convención de nombres de la línea 35 | AC-1, AC-2, AC-5 |
| C-4 | Product-Owner-Reviewer | modificar | `skills/story-code-review/agents/product-owner-reviewer.agent.md`: contexto recibido, sección «Guía de revisión (REVIEW.md)» | AC-1, AC-2 |
| C-5 | Integration-Reviewer | modificar | `skills/story-code-review/agents/integration-reviewer.agent.md`: contexto recibido, sección «Guía de revisión (REVIEW.md)», «Principios arquitectónicos» y «Convenciones del proyecto» (líneas 47-54) | AC-1, AC-2, AC-5 |
| C-6 | Security-Reviewer | modificar | `skills/story-code-review/agents/security-reviewer.agent.md`: contexto recibido, sección «Guía de revisión (REVIEW.md)» | AC-1, AC-2 |
| C-7 | Evals del skill | modificar (cuatro casos nuevos) | `skills/story-code-review/evals/evals.json` | AC-1 a AC-4, CNF-2 |
| C-8 | Prueba de contrato de la guía | crear | `test/story-code-review-review-md.test.js` | AC-1, AC-3, AC-5, CNF-1, CNF-3 |
| C-9 | README del skill | modificar (una frase en «What it does») | `skills/story-code-review/README.md` | AC-1 |

Sin cambios: `assets/fix-directives-template.md`, `docs/guardrails/`, `docs/constitution.md`, `docs/adr/` (lo crea STORY-178), `package.json` (`files` ya publica `skills/story-code-review`) y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — `$REVIEW_PATH` (Paso 2d.1) | `REVIEW.md` (ruta relativa a `$REPO_ROOT`) si `<REPO_ROOT>/REVIEW.md` existe como archivo legible en el working tree; cadena vacía si no. Sin git. Solo la raíz. | AC-1, AC-3, AC-4 |
| I-2 — `$RULES_CHANGED` y `$RULES_CHANGE_CHECK` (Paso 2d.2) | `$RULES_CHANGE_CHECK = unverifiable` si `$IMPL_FILES` está vacío; si no, `checked`. `$RULES_CHANGED` = subconjunto ordenado de [`REVIEW.md`, `$DOD_PATH`] cuyas rutas, normalizadas relativas a `$REPO_ROOT` (separador `/`, sin `./`), figuran en `$IMPL_FILES`. Con `$DOD_PATH` vacío solo se compara `REVIEW.md`. Se compara aunque `REVIEW.md` no exista (una historia que lo borra también modifica las reglas). | AC-4 |
| I-3 — Bloque de contexto del Paso 3b | Se añade `$REVIEW_PATH`. El resto de variables no cambia. Los cuatro revisores lo reciben; en `--single-agent`, el Tech-Lead-Reviewer. | AC-1 |
| I-4 — Sección «Guía de revisión (REVIEW.md)» de cada agente | `## Guía de revisión (REVIEW.md)` con cuerpo idéntico en los cuatro agentes (ver Esquema de datos). Se ubica tras `## Estándar de aprobación`. | AC-1, AC-2 |
| I-5 — `$REVIEW_EXCLUDED` (Paso 4a.1) | Lista de `(revisor, Archivo:Línea, severidad original, línea de «No reportar» aplicada)` de los hallazgos de informes válidos que el árbitro excluye. Vacía si `$REVIEW_PATH` está vacío. | AC-1, AC-2 |
| I-6 — Severidad efectiva por informe (Paso 4b) | Si 4a.1 no excluyó hallazgos de un informe, su severidad es su `max-severity`. Si excluyó alguno, es la máxima de los hallazgos que conserva, o `ninguna`. | AC-2, AC-3 |
| I-7 — `{{REVIEW_STATUS}}` (Paso 5b) | Valor de la fila `Guía de revisión` de `## Resumen`, compuesto por una base y sufijos (ver Esquema de datos). | AC-1, AC-3, AC-4 |
| I-8 — Mensajes de consola (Paso 2) | Línea `REVIEW.md:` en «Contexto cargado» y advertencias `⚠️` de I-1 e I-2, con los textos del Esquema de datos. Solo consola. | AC-1, AC-3, AC-4 |

## Decisions

### D-1 — El orquestador localiza `REVIEW.md` en el Paso 2d, del working tree // satisface: AC-1, AC-3, AC-4

Nuevo Paso 2d.1 tras resolver `$CONSTITUTION_PATH` y `$DOD_PATH`: comprobar `<REPO_ROOT>/REVIEW.md` y registrar `$REVIEW_PATH` (I-1). Se lee el archivo tal como está en el working tree al ejecutarse la revisión, sin git, como fija el ADR (D-4). Si no existe, se emite la advertencia de AC-3 y la revisión sigue con los criterios genéricos de los revisores: ni `BLOCKED` ni `NEEDS-CHANGES` (CS-2). `## Entrada` gana la fila `REVIEW.md` como opcional («calibra qué se reporta y con qué severidad; si no existe, el skill advierte y revisa como antes»).

| Alternativa | Motivo del rechazo |
|---|---|
| Leer de la rama base (`git show <base>:REVIEW.md`) | Lo descarta el ADR (D-4): el skill no usa git y el flujo local no define rama base. |
| Buscar también `docs/REVIEW.md` o `REVIEW.md` en subdirectorios | El ADR fija un solo archivo en la raíz (D-2). Una segunda ubicación pide una regla de fusión que nadie necesita. |
| Que cada agente busque `REVIEW.md` por su cuenta | Cuatro resoluciones independientes de la misma ruta, sin un punto que muestre al usuario qué guía rige. El orquestador ya resuelve así `$CONSTITUTION_PATH` y `$DOD_PATH` (P3, P5). |

### D-2 — Detección por `$IMPL_FILES` en el Paso 2d.2 // satisface: AC-4

Nuevo Paso 2d.2: calcular `$RULES_CHANGED` y `$RULES_CHANGE_CHECK` (I-2) comparando rutas normalizadas con `$IMPL_FILES`, ya extraído en el Paso 2c. Si `$RULES_CHANGED` no está vacío, emitir la advertencia de AC-4; si `$RULES_CHANGE_CHECK = unverifiable`, emitir la nota de que no pudo comprobarse. Ninguna de las dos toca `$VERDICT` ni `$MAX_SEVERITY` (ADR, D-5). Rige la versión del working tree, que ya incluye el cambio de la historia (consecuencia de D-1).

| Alternativa | Motivo del rechazo |
|---|---|
| `git diff --name-only` | El ADR (D-5) lo descarta y el Paso 4c.2 declara que el orquestador no invoca `git diff`. |
| `BLOCKED` para toda historia que modifique la guía o el DoD | Bloquearía a STORY-179 y STORY-183. El ADR deja la decisión al humano en `/story-acceptance`. |
| Advertir solo por `REVIEW.md` | AC-4 nombra también el DoD CODE-REVIEW, y `$DOD_PATH` ya está resuelto. |

### D-3 — Una sección idéntica en los cuatro agentes con la precedencia del ADR // satisface: AC-1, AC-2

Los subagentes no heredan el contexto de `SKILL.md`, así que cada agente necesita la regla completa. Se sigue el patrón existente del «Estándar de aprobación» (`SKILL.md:339`): el Paso 3b gana un «Principio compartido — Guía de revisión» que remite a la sección `## Guía de revisión (REVIEW.md)`, duplicada con el mismo texto en los cuatro agentes (I-4). C-8 comprueba que los cuatro cuerpos son idénticos. Cada revisor aplica las cuatro secciones de `REVIEW.md` solo en su dimensión y conserva el formato de su informe:

- **Qué es «Importante» aquí:** decide qué es `HIGH`/`MEDIUM` en cada área; elegir entre `HIGH` y `MEDIUM` sigue el criterio actual del revisor (ADR, D-6).
- **Tope de Minor:** el revisor no reporta más `LOW` de los que fija. Que el árbitro lo haga cumplir es STORY-185.
- **No reportar:** el revisor no reporta lo que excluye, con ninguna severidad.
- **Verificar siempre:** cada ítem lo comprueba el revisor de la dimensión a la que pertenece; si no pertenece claramente a ninguna, lo comprueba el Tech-Lead-Reviewer.
- **Precedencia:** `$CONSTITUTION_PATH` y `$DOD_PATH` prevalecen sobre `REVIEW.md`; `REVIEW.md` prevalece sobre los criterios genéricos del agente. Una línea de `REVIEW.md` que contradice una fuente superior no se aplica.
- **Formato:** los valores de severidad siguen siendo `HIGH`, `MEDIUM`, `LOW`, `ninguna`. Una regla de `REVIEW.md` que pida otra categoría (p. ej. 🟣 Pre-existing) no se aplica: el hallazgo conserva su severidad.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo el árbitro lee `REVIEW.md` | AC-1 exige que llegue a los cuatro revisores; y «Qué es «Importante» aquí» o «Verificar siempre» cambian lo que el revisor busca, algo que un filtro posterior no puede añadir. |
| Pasar el contenido de `REVIEW.md` en el bloque de contexto | Ensancha la interfaz y reintroduce el «teléfono descompuesto» que el patrón `.tmp/` evita; una ruta basta, como con `$CONSTITUTION_PATH`. |
| Texto distinto por agente, adaptado a su dimensión | Cuatro versiones de la misma regla se desalinean; la cláusula «solo en tu dimensión» da la adaptación con un solo texto. |

### D-4 — El árbitro aplica «No reportar» antes de calcular la severidad // satisface: AC-1, AC-2

Nuevo Paso 4a.1: si `$REVIEW_PATH` no está vacío, el árbitro lee `REVIEW.md` y excluye de la tabla consolidada los hallazgos de informes válidos cuya `Archivo:Línea` o descripción coincide con una línea de «No reportar». Los registra en `$REVIEW_EXCLUDED` (I-5). El Paso 4b usa la severidad efectiva por informe (I-6) y el Paso 4c.1 evalúa el DoD sobre la tabla consolidada tras 4a.1. Las exclusiones no se aplican a hallazgos `DoD-CODE-REVIEW` (el DoD está por encima de `REVIEW.md`, ADR D-3) ni convierten en válido un informe inválido. Sin `REVIEW.md`, 4a.1 no hace nada y la severidad efectiva es el `max-severity` de cada informe: el cálculo es el de hoy (AC-3).

Es la salvaguarda de AC-2: si un revisor reporta el secreto falso de `skills/<skill>/examples/` pese a la guía, el árbitro lo excluye y el veredicto no es `NEEDS-CHANGES`. El árbitro no aplica en esta historia las otras secciones: el tope de LOW es STORY-185, y la verificación de evidencia y la deduplicación son STORY-182.

| Alternativa | Motivo del rechazo |
|---|---|
| Confiar solo en los revisores | Un revisor que ignore la guía haría fallar SMOKE-1 sin que nada lo corrija. |
| Bajar a `LOW` en vez de excluir | «No reportar» pide no reportar. Un `LOW` añadiría el ruido que la épica quiere quitar. |
| Recalcular siempre la severidad desde las tablas, ignorando `max-severity` | Cambia el cálculo también sin `REVIEW.md` y rompe la equivalencia que pide AC-3. I-6 solo recalcula cuando hubo exclusiones. |

### D-5 — Una fila `Guía de revisión` en `## Resumen` lleva el estado y las advertencias // satisface: AC-1, AC-3, AC-4, CNF-1

El ADR (D-5) exige la advertencia en `code-review-report.md`, en una sección existente. La plantilla gana, tras la fila `testcases.md`, la fila `| Guía de revisión | {{REVIEW_STATUS}} |` (I-7), igual que `{{TESTCASES_STATUS}}`. El frontmatter, las secciones (`##` y `###`), los valores de `verdict` y `max-severity` no cambian. La fila aparece con y sin `REVIEW.md`, así que la estructura es la misma en los dos casos de AC-3.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección nueva `### Guía de revisión` | Cambia las secciones del informe: lo prohíben CNF-1 y AC-3. |
| Escribirlo en `{{DECISION_RATIONALE}}` | Es el porqué del veredicto. Mezclarlo con el estado de la guía confunde un `APPROVED` con advertencia y deja el dato en texto libre, difícil de comprobar en un eval. |
| Solo en consola | El ADR exige que quede en el informe, que es lo que lee `/story-acceptance`. |

### D-6 — Los agentes remiten a `$CONSTITUTION_PATH` y `REVIEW.md` en lugar de reglas propias // satisface: AC-5

- `integration-reviewer.agent.md:48-49` se sustituye por: «La implementación respeta los principios arquitectónicos de `$CONSTITUTION_PATH` y, si `$REVIEW_PATH` no está vacío, los de «Qué es «Importante» aquí» de `REVIEW.md`». La línea 50 (acoplamiento frente a `design.md`) se conserva: es genérica.
- `integration-reviewer.agent.md:53-54` (kebab-case, frontmatter YAML) se sustituye por: «Los nombres y formatos siguen las convenciones que declara `$CONSTITUTION_PATH`».
- `tech-lead-reviewer.agent.md:35` deja de nombrar kebab-case por defecto: «…siguen las convenciones de nombres de `$CONSTITUTION_PATH` o, si no declara ninguna, las detectadas en el código del módulo».
- `security-reviewer.agent.md:83` se conserva: regula la conducta del agente, no lo que juzga.

En este repo las reglas siguen aplicándose: `docs/constitution.md` las declara (líneas 76, 144-153, 256) y STORY-179 las copia en `REVIEW.md` (AC-5, «Pero»).

| Alternativa | Motivo del rechazo |
|---|---|
| Borrar las líneas 48-49 sin reemplazo | El revisor dejaría de mirar los principios de arquitectura del proyecto; el reemplazo los toma de la fuente correcta. |
| Quitar solo las tres frases del grep y conservar kebab-case | Cumple AC-5 al pie de la letra, pero mantiene convenciones de agile-sddf en proyectos que no las usan, contra el «Para» de la historia. |

### D-7 — Evals primero: cuatro casos nuevos // satisface: AC-1 a AC-4, CNF-2

Se escriben antes de modificar el skill (principio 11, CS-8), con el formato de simulación de TC-001 a TC-023 y numeración tras los casos de STORY-177 (TC-026 a TC-029; si ya están ocupados, los siguientes libres, F-3):

- **TC-026 `review-md-presente-llega-a-revisores-y-arbitro`** (AC-1): `review_md_present: true`, cuatro revisores sin hallazgos. `contains`: `REVIEW.md`, `Guía de revisión`, `$REVIEW_PATH`, `(verdict: APPROVED)`. `not_contains`: `sin guía de revisión`, `(verdict: NEEDS-CHANGES)`.
- **TC-027 `secreto-falso-en-examples-excluido-por-review-md`** (AC-2): `review_md_present: true`, `review_md_no_reportar: ["secretos falsos de skills/*/examples/"]`, `impl_files` con `skills/demo/examples/config.md`, `security_findings: [{severity: HIGH, file: "skills/demo/examples/config.md:3", rule: "BASE-01"}]`, demás revisores sin hallazgos. `contains`: `excluido`, `No reportar`, `(verdict: APPROVED)`. `not_contains`: `(verdict: NEEDS-CHANGES)`, `fix-directives.md`, `READY-FOR-IMPLEMENT`.
- **TC-028 `sin-review-md-advierte-y-conserva-contrato`** (AC-3, SMOKE-3): `review_md_present: false`, cuatro revisores sin hallazgos. `contains`: `sin guía de revisión`, `## Veredicto`, `## Resumen`, `## Hallazgos por dimensión`, `## Cumplimiento DoD`, `(verdict: APPROVED)`, `CODE-REVIEW`. `not_contains`: `(verdict: BLOCKED)`, `(verdict: NEEDS-CHANGES)`.
- **TC-029 `historia-modifica-review-md-advierte`** (AC-4): `review_md_present: true`, `impl_files` con `REVIEW.md` y `docs/guardrails/dod-story-code-review.md`. `contains`: `modifica las reglas con las que se la revisa`, `REVIEW.md`, `dod-story-code-review.md`, `working tree`, `(verdict: APPROVED)`. `not_contains`: `git diff`, `git show`, `(verdict: BLOCKED)`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo los tres casos de CNF-2 | AC-4 quedaría sin eval; el caso cuesta poco y fija la advertencia. |
| Caso `sandbox` con un `REVIEW.md` real en disco | Exige fixture de repo y cuatro subagentes reales: caro. La propiedad estática la fija C-8 y los casos de simulación cubren el comportamiento observable. |

### D-8 — Prueba unitaria del contrato de la guía // satisface: AC-1, AC-3, AC-5, CNF-1, CNF-3

`test/story-code-review-review-md.test.js` (`node:test`, lectura de archivos como `test/verify-fixed-layout.test.js`) fija:

1. Ningún archivo de `skills/story-code-review/agents/` coincide con `/Principio 6|teléfono descompuesto|un solo nivel de delegación/` (AC-5, CS-3).
2. `SKILL.md` y los cuatro agentes contienen `$REVIEW_PATH` (AC-1).
3. Los cuatro agentes tienen `## Guía de revisión (REVIEW.md)` y el cuerpo de esa sección es idéntico en los cuatro (D-3).
4. La plantilla del informe contiene `{{REVIEW_STATUS}}` y sus encabezados `##`/`###` son exactamente los actuales, en el mismo orden (CNF-1).
5. `SKILL.md` no contiene `git show` ni `git diff --name-only` (lectura y detección sin git, ADR D-4 y D-5).

Es independiente de `test/story-code-review-paths.test.js` (STORY-177) para que cada historia se implemente sin depender del orden.

| Alternativa | Motivo del rechazo |
|---|---|
| Añadir las aserciones a `test/story-code-review-paths.test.js` | Acopla esta historia a que STORY-177 esté implementada; un archivo por contrato se lee y se mantiene mejor. |
| Solo evals | Se ejecutan a criterio humano: la regla de AC-5 podría volver a un agente sin que el gate lo vea. |

## Esquema de datos // satisface: AC-1 a AC-4

**Variables nuevas del orquestador:**

| Variable | Paso | Valores |
|---|---|---|
| `$REVIEW_PATH` | 2d.1 | `REVIEW.md` \| `""` |
| `$RULES_CHANGE_CHECK` | 2d.2 | `checked` \| `unverifiable` |
| `$RULES_CHANGED` | 2d.2 | `[]` \| `[REVIEW.md]` \| `[<$DOD_PATH>]` \| `[REVIEW.md, <$DOD_PATH>]` |
| `$REVIEW_EXCLUDED` | 4a.1 | lista de `(revisor, Archivo:Línea, severidad, regla de «No reportar»)` |

**Resumen «Contexto cargado»** (línea nueva tras `DoD CODE-REVIEW:`):

- `   REVIEW.md:                REVIEW.md ✓` | `   REVIEW.md:                ⚠️ no encontrado — revisión sin guía de revisión`

**Advertencias de consola (Paso 2d):**

- Sin `REVIEW.md` (AC-3): `⚠️ REVIEW.md no encontrado en la raíz del repositorio — revisión sin guía de revisión, con los criterios genéricos de los revisores. Para calibrarla, crea REVIEW.md desde docs/templates/REVIEW-template.md.`
- Reglas modificadas (AC-4): `⚠️ La historia modifica las reglas con las que se la revisa: <lista de $RULES_CHANGED>. Rige la versión del working tree, que incluye el cambio; revísalo en /story-acceptance.`
- No comprobable: `⚠️ No se pudo comprobar si la historia modifica REVIEW.md o el DoD CODE-REVIEW (implement-report.md sin archivos).`

**`{{REVIEW_STATUS}}`** = base + sufijos, separados por ` · `:

| Condición | Texto |
|---|---|
| Base, `$REVIEW_PATH` no vacío | `✓ REVIEW.md` |
| Base, `$REVIEW_PATH` vacío | `⏭️ no encontrado — revisión sin guía de revisión (criterios genéricos de los revisores)` |
| Sufijo, `$REVIEW_EXCLUDED` no vacío | `<N> hallazgo(s) excluido(s) por «No reportar»: <Archivo:Línea (revisor)>, …` |
| Sufijo, `$RULES_CHANGED` no vacío | `⚠️ la historia modifica las reglas con las que se la revisa: <archivos>` |
| Sufijo, `$RULES_CHANGE_CHECK = unverifiable` | `⚠️ no se pudo comprobar si la historia modifica REVIEW.md o el DoD` |

**Cuerpo de `## Guía de revisión (REVIEW.md)`** (idéntico en los cuatro agentes; contenido normativo, no literal):

1. Si `$REVIEW_PATH` está vacío, revisa con tus criterios de siempre.
2. Si no, lee `$REVIEW_PATH` y aplícalo solo en tu dimensión: «Qué es «Importante» aquí» decide qué reportas como `HIGH`/`MEDIUM`; «Tope de Minor» limita tus `LOW`; no reportes lo que excluye «No reportar»; comprueba los ítems de «Verificar siempre» que pertenecen a tu dimensión (los que no pertenecen claramente a ninguna, el Tech-Lead-Reviewer).
3. Precedencia: `$CONSTITUTION_PATH` y `$DOD_PATH` prevalecen sobre `REVIEW.md`, y `REVIEW.md` sobre los criterios de este archivo. Una línea que contradice una fuente superior no se aplica.
4. `REVIEW.md` cambia qué reportas y con qué severidad, nunca el formato: los valores de severidad siguen siendo `HIGH`, `MEDIUM`, `LOW`, `ninguna`. Si una regla pide otra categoría, conserva la severidad del hallazgo.

**Plantilla** — `## Resumen`, fila nueva tras `| testcases.md | {{TESTCASES_STATUS}} |`:

`| Guía de revisión | {{REVIEW_STATUS}} |`

## Flujos clave

### F-1 — Revisión con `REVIEW.md` // AC-1, AC-2

1. Pasos 1-2c sin cambio; 2c extrae `$IMPL_FILES`.
2. 2d resuelve `$CONSTITUTION_PATH` y `$DOD_PATH`; 2d.1 encuentra `REVIEW.md` → `$REVIEW_PATH = REVIEW.md`; 2d.2 compara con `$IMPL_FILES` → `$RULES_CHANGED = []`.
3. «Contexto cargado» muestra `REVIEW.md: REVIEW.md ✓`.
4. 3b lanza los cuatro revisores con `$REVIEW_PATH`; cada uno aplica la guía en su dimensión (D-3). El Security-Reviewer no reporta el secreto falso de `skills/<skill>/examples/`.
5. 4a lee los informes; 4a.1 excluye cualquier hallazgo que coincida con «No reportar» y lo registra en `$REVIEW_EXCLUDED`.
6. 4b calcula la severidad con I-6; 4c y 4c.1 siguen sin cambio sobre la tabla consolidada.
7. 5b escribe `Guía de revisión: ✓ REVIEW.md` (más el sufijo de exclusiones si lo hay).

### F-2 — Proyecto sin `REVIEW.md` // AC-3

Igual que F-1 hasta 2d.1: `$REVIEW_PATH = ""`, advertencia de consola y `REVIEW.md: ⚠️ no encontrado`. Los revisores reciben `$REVIEW_PATH` vacío y revisan como hoy. 4a.1 no hace nada; 4b usa los `max-severity` de los informes. El informe tiene el mismo frontmatter, secciones y veredicto que antes, con `Guía de revisión: ⏭️ no encontrado — revisión sin guía de revisión…`.

### F-3 — La historia modifica la guía o el DoD // AC-4

En 2d.2, `$IMPL_FILES` contiene `REVIEW.md` y/o `docs/guardrails/dod-story-code-review.md` → advertencia de consola y sufijo en `{{REVIEW_STATUS}}`. `REVIEW.md` y el DoD se leen del working tree, con el cambio incluido. El veredicto se calcula como en F-1.

### F-4 — Degradación // P7

- **`REVIEW.md` ilegible, vacío o sin ninguna de las cuatro secciones:** se trata como presente (`$REVIEW_PATH = REVIEW.md`); los revisores y el árbitro no aplican nada que no encuentren. No bloquea. La forma de `REVIEW.md` la valida STORY-179, no este skill.
- **`$IMPL_FILES` vacío:** `$RULES_CHANGE_CHECK = unverifiable`, nota en consola y en el informe; la revisión continúa.
- **Un revisor ignora la guía:** 4a.1 excluye lo que «No reportar» excluye (D-4). Lo que el revisor no buscó por «Verificar siempre» no se recupera: queda como riesgo.
- **Línea de «No reportar» ambigua:** el árbitro solo excluye cuando la coincidencia es clara con la ruta o el tipo de hallazgo; ante duda conserva el hallazgo, la misma regla de duda del Paso 4c.1.
- **Copia instalada desactualizada de un agente (sin la sección):** el revisor ignora `$REVIEW_PATH`; 4a.1 sigue aplicando «No reportar». Se corrige reinstalando.

### F-5 — Puntos de cambio // P6

- Si un ADR posterior cambia la fuente (rama base) o admite subdirectorios, solo cambia el Paso 2d.1 (I-1).
- PREEXISTENTE (STORY-181) cambia la regla 4 de la sección compartida y el Paso 4a.1; el tope de LOW (STORY-185) añade una regla al árbitro junto a 4a.1. Ninguno toca la interfaz `$REVIEW_PATH`.
- El texto de las advertencias vive en un solo lugar (Paso 2d de `SKILL.md`) y se refleja en `{{REVIEW_STATUS}}`.

## Decisiones de complejidad justificada

- **Paso 4a.1 en el árbitro (D-4):** AC-1 pide que el árbitro aplique la guía y SMOKE-1 no puede depender de que un LLM revisor obedezca. Es un filtro de una sola sección, no un motor de reglas.
- **Severidad efectiva solo cuando hay exclusiones (I-6):** la forma más simple de garantizar que sin `REVIEW.md` el cálculo es idéntico al de hoy (AC-3).
- **Fila en `## Resumen` (D-5):** el ADR exige la advertencia en el informe; una fila es el cambio mínimo que no toca secciones ni frontmatter.
- **Prueba unitaria nueva (D-8):** cinco aserciones baratas que el gate ejecuta siempre; los evals dependen de una ejecución manual.
- **Limpieza de kebab-case (D-6):** no la exige el grep de AC-5, pero sin ella los agentes seguirían juzgando con convenciones de agile-sddf en otros proyectos, que es el «Para» de la historia. Son dos líneas.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Con `REVIEW.md`, «Contexto cargado» y el bloque de contexto de los cuatro revisores lo nombran | TC-026; C-8 aserción 2 | AC-1 |
| 2 | El árbitro aplica «No reportar»: un HIGH en `skills/demo/examples/` excluido no produce `NEEDS-CHANGES` | TC-027 | AC-1, AC-2 |
| 3 | Sin `REVIEW.md`: advertencia, mismas secciones, `APPROVED` sin `BLOCKED` | TC-028; C-8 aserción 4 | AC-3, CNF-1 |
| 4 | Historia que modifica `REVIEW.md` y el DoD: advertencia, lectura del working tree, sin git | TC-029; C-8 aserción 5 | AC-4 |
| 5 | `grep -rE "Principio 6\|teléfono descompuesto\|un solo nivel de delegación" skills/story-code-review/agents/` vacío | C-8 aserción 1; comando de AC-5 | AC-5 |
| 6 | Las reglas siguen aplicándose en este repo | `docs/constitution.md` las declara (líneas 144-153, 256) y `REVIEW.md` las recoge (STORY-179, AC-2) | AC-5 |
| 7 | Frontmatter, secciones y `verdict` de la plantilla sin cambios | C-8 aserción 4; `git diff` de la plantilla muestra solo la fila nueva | CNF-1 |
| 8 | Evals escritos antes del skill | Orden de tareas en `tasks.md`; `git log` de `evals.json` anterior al de `SKILL.md` | CNF-2 |
| 9 | Gate verde | `npm run verify:repository` y `npm test` con código 0 | CNF-3 |

## Risks / Trade-offs

- **[Riesgo] STORY-178 y STORY-179 no implementadas al empezar esta** → la historia depende de ellas (Notas). La implementación cita ADR-0021 por número solo si existe; si no, por su título. Los evals no necesitan el `REVIEW.md` real (simulación).
- **[Riesgo] Una historia rebaja su propio listón editando `REVIEW.md`** → advertencia de D-2 en consola y en el informe; decide el humano en `/story-acceptance` (ADR, D-5).
- **[Riesgo] Coincidencia semántica de «No reportar» por el árbitro (LLM)** → solo excluye ante coincidencia clara y lista cada exclusión en `{{REVIEW_STATUS}}`, así que un exceso es visible y reversible.
- **[Trade-off] El DoD puede contradecir una exclusión** (p. ej. un criterio de `dod-story-implement` sobre secretos) → por precedencia rige el DoD (ADR, D-3). En este repo, el criterio 21 del DoD se evalúa sobre la tabla tras 4a.1, así que no reintroduce el hallazgo excluido.
- **[Trade-off] Sección duplicada en cuatro agentes** → misma decisión que el «Estándar de aprobación»; C-8 detecta cualquier desalineación.
- **[Limitación] Las copias instaladas** (`.claude/skills/story-code-review/`…) no tienen los cambios hasta reinstalar → F-4.
- **[Conflicto de edición] STORY-177 modifica los mismos cinco archivos** (bloque de contexto del Paso 3b y «Contexto recibido» de los agentes) → se implementa después de STORY-177 o se fusionan las dos líneas del bloque de contexto; ninguna decisión choca.

## Open Questions

Ninguna. La fuente de lectura y la precedencia las fija el ADR (STORY-178); el resto lo resuelven D-1 a D-8.

## Autoevaluación (P9, P10)

- **Omisiones:** los cinco AC y los tres CNF tienen componente y contrato de verificación (AC-1: D-1, D-3, D-4, D-5; AC-2: D-3, D-4; AC-3: D-1, D-5, I-6; AC-4: D-2, D-5; AC-5: D-6; CNF-1: D-5, D-8; CNF-2: D-7; CNF-3: D-8).
- **Ambigüedad:** «el árbitro aplica `REVIEW.md`» se acota a «No reportar» (D-4) y el resto se asigna a STORY-181, STORY-182 y STORY-185 (CR-001). «Advertencia» tiene texto fijo (Esquema de datos).
- **Nombres:** «guía de revisión», «árbitro», «revisor», «working tree», `$REVIEW_PATH` (estilo `$DOD_PATH`) y `{{REVIEW_STATUS}}` (estilo `{{TESTCASES_STATUS}}`) se usan igual en la historia, el ADR y `SKILL.md`.
- **Estructura:** sin dependencias cíclicas: el orquestador resuelve rutas, los revisores leen archivos y escriben informes, el árbitro lee informes y `REVIEW.md`. Cada agente conserva una sola dimensión; las interfaces nuevas son una ruta y dos variables derivadas de `$IMPL_FILES`. El documento no contiene código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: los Non-Goals de `story.md` atribuyen «el tope de LOW» a STORY-181 y STORY-182, pero la épica lo asigna a STORY-185 («Tope de LOW y arrastres entre rondas»). El diseño sigue a la épica: esta historia no hace que el árbitro aplique el tope; los revisores lo aplican a sus propios `LOW` como parte de la guía (D-3).
- **Documento afectado**: story.md
- **Acción requerida**: en «Fuera de alcance», cambiar «son STORY-181 y STORY-182» por «son STORY-181, STORY-182 y STORY-185».
