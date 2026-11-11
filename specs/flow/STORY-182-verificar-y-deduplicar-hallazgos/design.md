---
alwaysApply: false
type: design
id: STORY-182
slug: STORY-182-verificar-y-deduplicar-hallazgos-design
title: "Design: Verificación y deduplicación de hallazgos del árbitro"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-182
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-182-verificar-y-deduplicar-hallazgos
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
  - STORY-185-tope-de-low-y-arrastres
---

<!-- Referencias -->
[[STORY-182-verificar-y-deduplicar-hallazgos]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-180-story-code-review-lee-review-md]] · [[STORY-181-hallazgos-preexistentes]] · [[STORY-185-tope-de-low-y-arrastres]]

# Diseño técnico: Verificación y deduplicación de hallazgos del árbitro

## Context

El árbitro de `/story-code-review` (Paso 4 de `skills/story-code-review/SKILL.md`) toma la severidad del frontmatter de cada informe parcial y copia sus tablas al informe sin examinar los hallazgos. Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `skills/story-code-review/SKILL.md:384-392` | Paso 4b: `max_severity` = máxima de los `max-severity` del frontmatter de los informes válidos. No mira las filas. |
| `skills/story-code-review/SKILL.md:396-402` | Paso 4c: «hallazgo bloqueante = severidad `HIGH` o `MEDIUM`». No se comprueba evidencia. |
| `skills/story-code-review/SKILL.md:419-421, 445-451` | Paso 4c.1 evalúa el DoD «contra los informes de los cuatro agentes» y recalcula `$MAX_SEVERITY`. El criterio 21 de `docs/guardrails/dod-story-code-review.md` («Sin hallazgo bloqueante de severidad HIGH o MEDIUM») se evalúa ahí. |
| `skills/story-code-review/SKILL.md:478-485, 679` | Paso 4e: un bloqueante sin `Archivo:Línea` se anota `[archivo no especificado]` y sigue siendo bloqueante. |
| `skills/story-code-review/SKILL.md:504-507` | Paso 4f.2: una fila de `fix-directives.md` por hallazgo bloqueante; `Dimensión` es la del agente. Si dos revisores reportan el mismo defecto, aparece dos veces. |
| `skills/story-code-review/SKILL.md:563` | Paso 5b: inserta **la tabla de `## Hallazgos` de cada informe parcial** tal cual en su dimensión. |
| `agents/tech-lead-reviewer.agent.md:87`, `agents/integration-reviewer.agent.md:100`, `agents/product-owner-reviewer.agent.md:92` | Tabla `Severidad \| Archivo:Línea \| Descripción \| Recomendación`. |
| `agents/security-reviewer.agent.md:158` | Tabla `Severidad \| Archivo:Línea \| Regla \| Descripción \| Recomendación`. |
| `agents/product-owner-reviewer.agent.md:94, 101-103` | El ejemplo de la tabla principal usa `test/file.ts:0` (línea 0) para un escenario sin test. La tabla de `testcases.md` tiene `AC / Escenario` en lugar de `Archivo:Línea`, y sus filas pueden ser `HIGH`/`MEDIUM` (líneas 70-71). |
| `agents/integration-reviewer.agent.md:104-109` | La tabla de trazabilidad en `testcases.md` tiene `Test Case ID` en lugar de `Archivo:Línea`; puede contener `MEDIUM` (línea 76). |
| Los cuatro agentes | Ninguno pide escenario de fallo. Cada uno define su sección `## Estándar de aprobación`, duplicada a propósito (`SKILL.md:339`). |
| `skills/story-code-review/evals/evals.json` | 23 casos. TC-002, TC-005, TC-007, TC-009, TC-010, TC-012, TC-013, TC-014, TC-015, TC-018 y TC-020 esperan `NEEDS-CHANGES` con un hallazgo `HIGH`/`MEDIUM` que trae `file_line` pero ningún escenario de fallo. STORY-177 reserva TC-024 y TC-025; STORY-180, TC-026 a TC-029. |
| `skills/story-code-review/examples/example-needs-changes/tech-lead-report.md:14-15`, `examples/example-needs-changes-medium/tech-lead-report.md:14` | Ejemplos de `HIGH`/`MEDIUM` que producen `NEEDS-CHANGES` sin escenario de fallo. |
| `docs/policies/validation-contract-policy.md:99` | El árbitro «consume severidad y hallazgos» de los informes parciales sin copiar su veredicto. No cambia. |
| Diseño de STORY-180 (D-4, I-6) | Añade el Paso 4a.1 («No reportar») y la **severidad efectiva por informe**: el `max-severity` del frontmatter si 4a.1 no tocó el informe; si no, la máxima de los hallazgos que conserva. |

Stack: skill en Markdown con agentes locales; pruebas deterministas con `node:test` en `test/`; evals de simulación (`contains`/`not_contains`) que se ejecutan a criterio humano.

## Goals / Non-Goals

**Goals:**
- Los cuatro revisores escriben `Archivo:Línea` válido y escenario de fallo concreto en cada `HIGH`/`MEDIUM`. // satisface: CNF-3
- El árbitro marca cada `HIGH`/`MEDIUM` de los revisores como `bloqueante` o `no verificado` antes de calcular la severidad; un `no verificado` no cuenta para `max-severity`, el veredicto ni `fix-directives.md`. // satisface: AC-1
- El árbitro fusiona los hallazgos que son el mismo defecto: aparecen una vez, con la severidad mayor, citando a los revisores y sus dimensiones. // satisface: AC-2
- Los hallazgos distintos quedan separados. // satisface: AC-3
- `verdict`, `max-severity` y las secciones del informe no cambian de forma. // satisface: CNF-1
- Evals primero y una prueba unitaria que fija el contrato. // satisface: CNF-2

**Non-Goals:**
- Tope de LOW y LOW arrastrados entre rondas (STORY-185). PREEXISTENTE (STORY-181). Hallazgos que crea el DoD CODE-REVIEW (STORY-183): las filas `DoD-CODE-REVIEW` no pasan por la verificación ni por la fusión.
- `REVIEW.md` y su Paso 4a.1 (STORY-180).
- Rutas de `.tmp/` y descubrimiento de checklists (STORY-177).
- Cambiar los niveles de severidad de los agentes (`## Formato de severidad`).
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes (salida de `agile-sddf install`).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Orquestador (árbitro) | modificar | `skills/story-code-review/SKILL.md`: principio compartido del Paso 3b; Pasos 4a.2 y 4a.3 nuevos; Paso 4b (severidad efectiva); Paso 4c (definición de bloqueante); Paso 4c.1 (fuente de evaluación); Paso 4e (rama `[archivo no especificado]`); Paso 4f.2 (filas fusionadas); Paso 5b (tablas consolidadas, `{{DECISION_RATIONALE}}`); tabla de manejo de errores | AC-1, AC-2, AC-3, CNF-1 |
| C-2 | Tech-Lead-Reviewer | modificar | `skills/story-code-review/agents/tech-lead-reviewer.agent.md`: sección `## Evidencia de hallazgos bloqueantes`; fila de ejemplo de la tabla | CNF-3 |
| C-3 | Product-Owner-Reviewer | modificar | `skills/story-code-review/agents/product-owner-reviewer.agent.md`: sección compartida; ejemplos de las dos tablas (sin `:0`) | CNF-3 |
| C-4 | Integration-Reviewer | modificar | `skills/story-code-review/agents/integration-reviewer.agent.md`: sección compartida; ejemplos de las dos tablas | CNF-3 |
| C-5 | Security-Reviewer | modificar | `skills/story-code-review/agents/security-reviewer.agent.md`: sección compartida; fila de ejemplo | CNF-3 |
| C-6 | Evals del skill | modificar | `skills/story-code-review/evals/evals.json`: TC-030 a TC-033 nuevos; `failure_scenario` en los hallazgos bloqueantes de los 11 casos existentes | AC-1, AC-2, AC-3, CNF-2 |
| C-7 | Ejemplos del skill | modificar | `skills/story-code-review/examples/example-needs-changes/{tech-lead-report,fix-directives}.md` y `examples/example-needs-changes-medium/{tech-lead-report,fix-directives}.md`: `Fallo:` en las filas `HIGH`/`MEDIUM` | CNF-3 |
| C-8 | Prueba de contrato | crear | `test/story-code-review-evidence-dedup.test.js` | AC-1, AC-2, CNF-1, CNF-2, CNF-3 |
| C-9 | README del skill | modificar (una frase en «What it does») | `skills/story-code-review/README.md` | AC-1, AC-2 |

Sin cambios: `assets/code-review-report-template.md` y `assets/fix-directives-template.md` (los placeholders ya admiten el contenido nuevo), `docs/guardrails/`, `docs/policies/`, `package.json` (`files` ya publica `skills/story-code-review`) y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — Sección `## Evidencia de hallazgos bloqueantes` de cada agente | Cuerpo idéntico en los cuatro agentes (ver Esquema de datos), situado tras `## Formato de severidad`. Fija el `Archivo:Línea` válido, el marcador `Fallo:` en la columna `Descripción` y la ubicación en las tablas sin columna `Archivo:Línea`. | CNF-3 |
| I-2 — `Archivo:Línea` válido | Ruta de archivo relativa a `$REPO_ROOT`, sin espacios, seguida de `:<n>` o `:<n>-<m>`, con `n ≥ 1` y `m ≥ n`. No son válidos: ruta sin línea, línea `0`, «varios archivos», `—`. | AC-1 |
| I-3 — Escenario de fallo concreto | Texto que sigue a `Fallo:` en `Descripción` y nombra (a) una entrada o un estado de partida y (b) el resultado erróneo observable que produce. Sin `Fallo:`, o con un texto sin (a) o sin (b) («podría fallar», «puede ser inseguro», «riesgo de»), no hay escenario. | AC-1 |
| I-4 — `$FINDINGS` (tabla consolidada) | Lista de hallazgos de los informes válidos, tras 4a.1 (STORY-180) si existe. Cada fila: `revisor`, `dimensión`, `tabla de origen`, `severidad`, `archivo_línea`, `descripción`, `recomendación`, `estado` y, si es fusionada, `reportado_por` (lista de `(revisor, dimensión, severidad)`). | AC-1, AC-2, AC-3 |
| I-5 — `estado` (Paso 4a.2) | `bloqueante`: `HIGH`/`MEDIUM` con I-2 e I-3. `no verificado`: `HIGH`/`MEDIUM` sin I-2 o sin I-3, con el motivo `falta Archivo:Línea`, `falta escenario de fallo` o ambos. `LOW`: sin estado. | AC-1 |
| I-6 — Fusión (Paso 4a.3) | Dos hallazgos son el mismo defecto si su ruta normalizada coincide, sus rangos de línea se solapan (una línea `n` es el rango `n-n`) y la misma corrección los resuelve. Solo se comparan hallazgos de revisores distintos con `Archivo:Línea` válido. No se compara `Dimensión`. | AC-2, AC-3 |
| I-7 — Hallazgo fusionado | Severidad: la mayor de los miembros que cuentan. Representante: el miembro `bloqueante` de mayor severidad; empate → orden Tech-Lead, Product-Owner, Integration, Security. Lleva `Archivo:Línea`, descripción y recomendación del representante, más `Reportado por: <Revisor> (<dimensión>, <severidad>), …` al final de la descripción. `estado`: `bloqueante` si algún miembro lo es; si no, `no verificado`. | AC-2 |
| I-8 — Severidad efectiva por informe (Paso 4b) | Extiende I-6 de STORY-180: si 4a.1-4a.3 no cambiaron ningún hallazgo del informe, es su `max-severity`; si cambiaron alguno, es la máxima de sus hallazgos que cuentan (`bloqueante` y `LOW`; un fusionado cuenta en el informe de su representante), o `ninguna`. `$MAX_SEVERITY` es la máxima de las severidades efectivas. | AC-1, AC-2, CNF-1 |
| I-9 — Tablas por dimensión (Paso 5b) | `{{TECH_LEAD_FINDINGS}}`, `{{PRODUCT_OWNER_FINDINGS}}`, `{{INTEGRATION_FINDINGS}}` y `{{SECURITY_FINDINGS}}` reciben las filas consolidadas de su dimensión, con las columnas del informe parcial. El estado va como prefijo de `Descripción`. | AC-1, AC-2, AC-3 |

## Decisions

### D-1 — Evidencia en `Descripción` con el marcador `Fallo:`, sin columna nueva // satisface: AC-1, CNF-1, CNF-3

Los revisores escriben el escenario dentro de `Descripción`: `<defecto>. Fallo: <entrada o estado> → <resultado erróneo observable>`. Las tablas de los cuatro informes, y por tanto las del informe consolidado y `fix-directives.md`, conservan sus columnas. El marcador hace que el árbitro y los evals encuentren el escenario sin interpretar prosa libre.

| Alternativa | Motivo del rechazo |
|---|---|
| Columna nueva `Escenario de fallo` en las tablas de los revisores | Cambia las tablas que el Paso 5b copia al informe y las de `fix-directives.md`, contra CNF-1, y obliga a tocar los ejemplos de las seis tablas distintas. |
| Que el árbitro busque el escenario en la prosa, sin marcador | Un LLM decidiría si hay escenario en cada redacción; el resultado varía entre ejecuciones y ningún eval o prueba puede fijarlo. |
| Campo YAML por hallazgo en el frontmatter del informe parcial | Duplica la tabla en otro formato y hay que mantener los dos sincronizados. |

### D-2 — Ubicación en las tablas sin columna `Archivo:Línea` // satisface: AC-1, CNF-3

Las tablas de `testcases.md` del Product-Owner-Reviewer (`AC / Escenario`) y del Integration-Reviewer (`Test Case ID`) pueden tener `HIGH`/`MEDIUM`. Sin una ubicación, la verificación los degradaría siempre y un AC sin cobertura dejaría de bloquear. La celda de identificación lleva el `Archivo:Línea` entre paréntesis: `AC-1 (specs/flow/STORY-NNN-<slug>/story.md:30)`, `TC-003 (specs/flow/STORY-NNN-<slug>/testcases.md:12)`. El árbitro toma el `Archivo:Línea` de esa celda. Para un escenario sin test (tabla principal del Product-Owner-Reviewer) la ubicación es la del escenario en `story.md`; `test/file.ts:0` desaparece del ejemplo.

| Alternativa | Motivo del rechazo |
|---|---|
| Añadir la columna `Archivo:Línea` a las dos tablas | Cambia el formato de dos tablas que el informe copia en `{{TESTCASES_COVERAGE_SECTION}}` (CNF-1). |
| Eximir de verificación a las tablas de `testcases.md` | AC-1 no distingue tablas; un `HIGH` de cobertura sin escenario bloquearía igual que hoy y dejaría un camino de falsos positivos. |

### D-3 — Verificación en el Paso 4a.2, antes de la fusión // satisface: AC-1

Nuevo Paso 4a.2: el árbitro reúne en `$FINDINGS` (I-4) las filas de todas las tablas de hallazgos de los informes válidos y asigna `estado` (I-5) a cada `HIGH`/`MEDIUM`. Un `no verificado` sigue en el informe, con su severidad original en la columna `Severidad` y el prefijo de estado en `Descripción`, pero no cuenta para la severidad efectiva (I-8), para el veredicto (4c) ni para `fix-directives.md` (4e-4f). Ante la duda de si un escenario es concreto, el árbitro lo marca `no verificado`: es la misma regla de duda del Paso 4c.1 (la duda no bloquea), y el hallazgo queda visible para el humano. Los hallazgos `LOW` no se verifican.

Verificar antes de fusionar evita que un miembro sin evidencia eleve la severidad de un defecto fusionado: la severidad de I-7 sale solo de los miembros que cuentan.

| Alternativa | Motivo del rechazo |
|---|---|
| Degradar el `no verificado` a `LOW` | Lo confunde con un nit real, lo mezclaría con el tope de STORY-185 y oculta que un revisor lo consideró grave. AC-1 pide el estado `no verificado`. |
| Excluirlo del informe | AC-1 exige que figure. Se perdería un defecto quizá real, mal redactado. |
| Fusionar primero y verificar el fusionado | Un `HIGH` sin escenario de un revisor y un `MEDIUM` con escenario de otro darían un `HIGH` bloqueante que nadie probó. |

### D-4 — Fusión en dos fases en el Paso 4a.3 // satisface: AC-2, AC-3

Nuevo Paso 4a.3. El mecanismo de comparación (pedido por la historia a este diseño):

1. **Candidatos (determinista):** pares de hallazgos de revisores distintos, ambos con `Archivo:Línea` válido, con la misma ruta normalizada (separador `/`, sin `./`, relativa a `$REPO_ROOT`) y rangos de línea solapados.
2. **Misma corrección (juicio del árbitro):** de cada par candidato, el árbitro compara `Recomendación` y `Descripción`. Se fusionan solo si una misma corrección resuelve los dos. Ante la duda, no se fusionan: un duplicado visible cuesta menos que perder un defecto.
3. **Grupos:** la relación es transitiva dentro de un archivo; un grupo produce un solo hallazgo (I-7).

No se fusionan hallazgos del mismo revisor (si un revisor repite un defecto, es su informe el que está mal, y el tope de LOW es STORY-185) ni filas `DoD-CODE-REVIEW` (STORY-183). Un hallazgo sin `Archivo:Línea` válido nunca es candidato.

Ejemplos de la historia: `src/auth.js:42` y `src/auth.js:40-45` «falta validar el token» → candidatos y misma corrección → se fusionan. `src/auth.js:42` y `src/auth.js:90` → no son candidatos. `src/auth.js:42` «falta validar el token» y `src/auth.js:42` «nombre de variable engañoso» → candidatos, correcciones distintas → no se fusionan (AC-3).

| Alternativa | Motivo del rechazo |
|---|---|
| Solo la fase 1 (misma ruta y línea) | Fusionaría el defecto de seguridad y el de nombres de AC-3, que piden correcciones distintas. |
| Solo juicio semántico sobre todas las parejas | Compara cada hallazgo con todos los demás y fusionaría defectos parecidos en archivos distintos; la fase 1 acota el juicio a lo que la historia define como «mismo defecto». |
| Comparar también `Dimensión` | Cada revisor escribe la suya; nunca se fusionaría entre revisores (nota de la historia). |

### D-5 — El hallazgo fusionado vive en la dimensión de su representante // satisface: AC-2, AC-3

En el informe, el hallazgo fusionado aparece una vez, en la tabla de la dimensión de su representante (I-7), con `Reportado por: …` al final de `Descripción`. En las tablas de los demás miembros, su fila se quita; si una tabla queda sin filas, lleva la fila de vacío del agente con el texto `Sin hallazgos propios: <N> fusionado(s) en <dimensión del representante>`. Un hallazgo no fusionado no lleva `Reportado por:`: su revisor es el de la sección. En `fix-directives.md` la fila fusionada aparece una vez, con `Dimensión` = las dimensiones de los miembros separadas por `, ` (representante primero) y `Hallazgo` = descripción consolidada.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección nueva `### Hallazgos compartidos` | Cambia las secciones del informe (CNF-1) y rompe la prueba de encabezados de STORY-180. |
| Fila de referencia («ver Seguridad #2») en cada miembro | El defecto aparecería varias veces, que es lo que AC-2 quiere evitar. |
| Representante por orden de revisor, sin mirar severidad | AC-2 pide mostrarlo como `HIGH`; el representante `MEDIUM` haría que la fila dijera una cosa y la severidad otra. |

### D-6 — Severidad y veredicto sobre la tabla consolidada // satisface: AC-1, AC-2, CNF-1

- **Paso 4b:** usa la severidad efectiva por informe (I-8). Sin `no verificado` ni fusiones, el cálculo es el de hoy. `max-severity` sigue significando «la mayor severidad de los hallazgos que cuentan» y sus valores siguen siendo `HIGH`, `MEDIUM`, `LOW`, `ninguna`.
- **Paso 4c:** hallazgo bloqueante = hallazgo con `estado: bloqueante` (fusionados incluidos, una vez), o fila `DoD-CODE-REVIEW` `HIGH`/`MEDIUM`. `{{TOTAL_BLOCKING}}` y el `<N>` de `{{VERDICT_REASON}}` cuentan esos hallazgos.
- **Paso 4c.1:** el DoD se evalúa contra `$FINDINGS`, no contra las tablas crudas de los informes. Así el criterio 21 («Sin hallazgo bloqueante de severidad HIGH o MEDIUM») ve un `no verificado` como no bloqueante y no lo reintroduce como hallazgo DoD.
- **Paso 4e:** la lista blanca sale de los hallazgos bloqueantes. Un hallazgo de revisor sin `Archivo:Línea` ya no puede ser bloqueante; la rama `[archivo no especificado]` queda solo como degradación y la fila de manejo de errores se reescribe.
- **Paso 5b:** `{{DECISION_RATIONALE}}` añade, si hay `no verificado`: `<N> hallazgo(s) HIGH/MEDIUM no verificado(s): no cuentan para el veredicto (falta Archivo:Línea o escenario de fallo).` Si hay fusiones: `<M> hallazgo(s) reportado(s) por más de un revisor se fusionaron.` Es el porqué del veredicto, así que va ahí y no en una fila nueva.

| Alternativa | Motivo del rechazo |
|---|---|
| Recalcular siempre `max-severity` desde las filas | Cambiaría el resultado de informes cuya tabla y frontmatter no coinciden aunque no haya nada que verificar ni fusionar; I-8 solo recalcula cuando algo cambió, como STORY-180. |
| Exigir al revisor que corrija su `max-severity` | El árbitro no puede devolver el informe al revisor (un subagente no delega en otro, y repetir la revisión cuesta cuota). |
| Fila `Consolidación` en `## Resumen` | Repite lo que dicen el prefijo de cada fila y la justificación del veredicto; una fila más que mantener. |

### D-7 — Sección compartida en los cuatro agentes // satisface: CNF-3

Los subagentes no heredan el contexto de `SKILL.md`. Se sigue el patrón de `## Estándar de aprobación` (`SKILL.md:339`): el Paso 3b gana un «Principio compartido — Evidencia de hallazgos bloqueantes» que remite a la sección `## Evidencia de hallazgos bloqueantes`, con el mismo cuerpo en los cuatro agentes (I-1). Las filas de ejemplo de cada tabla `HIGH`/`MEDIUM` muestran el formato (`Fallo:` y ubicación). C-8 comprueba que los cuatro cuerpos son idénticos.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo el árbitro conoce la regla | Los hallazgos válidos mal redactados se degradarían siempre (CNF-3). |
| Texto distinto por agente | Cuatro versiones de una regla se desalinean; las diferencias por tabla las da D-2 dentro del mismo texto. |

### D-8 — Evals primero: cuatro casos nuevos y once migrados // satisface: AC-1, AC-2, AC-3, CNF-2

Se escriben antes de modificar el skill (principio 11, CS-8), con el formato de simulación existente. Los hallazgos ganan el campo `failure_scenario` (cadena; ausente = sin escenario).

- **Migración:** los 11 casos que esperan `NEEDS-CHANGES` (TC-002, TC-005, TC-007, TC-009, TC-010, TC-012, TC-013, TC-014, TC-015, TC-018, TC-020) reciben `failure_scenario` en su hallazgo bloqueante y `Fallo:` en `finding`. Sin esto, la nueva regla los llevaría a `APPROVED` y fallarían por una causa ajena a lo que prueban.
- **TC-030 `bloqueantes-sin-evidencia-no-cuentan`** (AC-1, filas 1 y 2): Tech-Lead `MEDIUM` sin `file_line`, con `failure_scenario`; Security `HIGH` en `src/auth.js:42` sin `failure_scenario`; los demás sin hallazgos. `contains`: `no verificado`, `falta Archivo:Línea`, `falta escenario de fallo`, `(verdict: APPROVED)`. `not_contains`: `(verdict: NEEDS-CHANGES)`, `round: 1`, `READY-FOR-IMPLEMENT`.
- **TC-031 `bloqueante-verificado-junto-a-no-verificado`** (AC-1, fila 3): Tech-Lead `HIGH` en `src/auth.js:42` con escenario; Integration `MEDIUM` en `src/db.js:10` sin escenario. `contains`: `(verdict: NEEDS-CHANGES)`, `1 hallazgo(s) bloqueante(s)`, `bloqueante`, `no verificado`, `fix-directives.md`, `src/auth.js`. `not_contains`: `src/db.js (hallazgo`, `(verdict: APPROVED)`.
- **TC-032 `hallazgo-duplicado-entre-revisores-se-fusiona`** (AC-2): Tech-Lead `MEDIUM` y Security `HIGH`, ambos en `src/auth.js:42`, misma recomendación, con escenario. `contains`: `Reportado por:`, `Tech-Lead-Reviewer`, `Security-Reviewer`, `1 hallazgo(s) bloqueante(s)`, `max-severity: HIGH`, `(verdict: NEEDS-CHANGES)`. `not_contains`: `2 hallazgo(s) bloqueante(s)`.
- **TC-033 `hallazgos-distintos-no-se-fusionan`** (AC-3): Tech-Lead `MEDIUM` en `src/auth.js:42` («falta validar el token»), Security `MEDIUM` en `src/auth.js:90`, Integration `MEDIUM` en `src/auth.js:42` («nombre de variable engañoso», otra corrección); todos con escenario. `contains`: `3 hallazgo(s) bloqueante(s)`, `(verdict: NEEDS-CHANGES)`. `not_contains`: `Reportado por:`, `fusionado`.

Numeración tras las reservas de STORY-177 (TC-024, TC-025) y STORY-180 (TC-026 a TC-029); si ya están ocupados al implementar, los siguientes libres.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo los tres casos de CNF-2 | La fila 3 de AC-1 (un bloqueante verificado sigue bloqueando) quedaría cubierta solo por casos migrados que no la nombran; TC-031 la fija junto a un `no verificado`. |
| No migrar los casos existentes y tratar `failure_scenario` ausente como presente en la simulación | Los evals dejarían de reflejar la regla que la historia introduce. |

### D-9 — Prueba unitaria del contrato // satisface: AC-1, AC-2, CNF-1, CNF-2, CNF-3

`test/story-code-review-evidence-dedup.test.js` (`node:test`, lectura de archivos como `test/verify-fixed-layout.test.js`) fija:

1. Los cuatro agentes tienen `## Evidencia de hallazgos bloqueantes` y el cuerpo es idéntico en los cuatro.
2. Ninguna fila de ejemplo `HIGH`/`MEDIUM` de las tablas de los agentes carece de `Fallo:`, y ninguna usa una línea `:0`.
3. `SKILL.md` contiene los encabezados de los Pasos 4a.2 y 4a.3 y las cadenas `no verificado` y `Reportado por:`.
4. Todo caso de `evals.json` cuyo `expected.contains` incluye `(verdict: NEEDS-CHANGES)` tiene al menos un hallazgo `HIGH`/`MEDIUM` con `file_line` válido (I-2) y `failure_scenario` no vacío.
5. Toda fila `HIGH`/`MEDIUM` de `examples/*/{tech-lead,product-owner,integration,security}-report.md` tiene `Fallo:`.

Es independiente de las pruebas de STORY-177 y STORY-180, para que cada historia se implemente sin depender del orden.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo evals | Se ejecutan a criterio humano: un caso nuevo sin `failure_scenario` o un agente sin la sección pasaría el gate. |
| Añadir las aserciones a la prueba de STORY-180 | Acopla esta historia a que STORY-180 esté implementada (sus Notas la declaran independiente). |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

**Variables nuevas del orquestador:**

| Variable | Paso | Valores |
|---|---|---|
| `$FINDINGS` | 4a.2 | lista de I-4 |
| `$UNVERIFIED_COUNT` | 4a.2 | entero ≥ 0 |
| `$MERGED_COUNT` | 4a.3 | entero ≥ 0 (grupos fusionados) |

**Prefijo de estado en `Descripción`** (I-9):

| Estado | Prefijo |
|---|---|
| `bloqueante` | `**[bloqueante]** ` |
| `no verificado` | `**[no verificado — falta Archivo:Línea]** ` · `**[no verificado — falta escenario de fallo]** ` · `**[no verificado — falta Archivo:Línea y escenario de fallo]** ` |
| `LOW` | sin prefijo |

**Cita del hallazgo fusionado:** al final de `Descripción`, `Reportado por: Security-Reviewer (security, HIGH), Tech-Lead-Reviewer (code-quality, MEDIUM).`

**Hallazgo de eval** (`agent_results.<revisor>_findings[]`): campos actuales `file_line`, `dimension`, `severity`, `finding`, `action`, más `failure_scenario` (opcional).

**Cuerpo de `## Evidencia de hallazgos bloqueantes`** (idéntico en los cuatro agentes; contenido normativo, no literal):

1. Todo `HIGH` o `MEDIUM` lleva `Archivo:Línea` válido: ruta relativa a la raíz del repositorio y línea o rango (`src/auth.js:42`, `src/auth.js:40-45`). No valen una ruta sin línea, la línea `0` ni «varios archivos».
2. En las tablas sin columna `Archivo:Línea` (`AC / Escenario`, `Test Case ID`), escribe la ubicación entre paréntesis en la primera celda: `AC-1 (specs/flow/STORY-NNN-<slug>/story.md:30)`. Un escenario sin test se ubica en su línea de `story.md`.
3. Todo `HIGH` o `MEDIUM` termina su `Descripción` con `Fallo: <entrada o estado de partida> → <resultado erróneo observable>`. «Podría fallar» o «puede ser inseguro» no son un escenario.
4. Si no puedes escribir los dos, el árbitro marcará el hallazgo como `no verificado` y no bloqueará: decide si es un `LOW`.
5. Los `LOW` no necesitan escenario.

## Flujos clave

### F-1 — Bloqueante sin evidencia // AC-1

1. 4a lee los cuatro informes; 4a.1 (STORY-180), si existe, aplica «No reportar».
2. 4a.2 construye `$FINDINGS`: el `MEDIUM` sin ubicación y el `HIGH` sin `Fallo:` quedan `no verificado`; un `HIGH` con los dos, `bloqueante`.
3. 4a.3 no fusiona nada: el `MEDIUM` sin ubicación no es candidato.
4. 4b calcula la severidad efectiva: los informes con `no verificado` se recalculan sin ellos.
5. 4c: sin bloqueantes → `APPROVED` (o `BLOCKED` si falta un informe); con el `HIGH` verificado → `NEEDS-CHANGES`.
6. 4e-4f: solo el bloqueante entra en la lista blanca y en `fix-directives.md`.
7. 5b: las filas llevan su prefijo; la justificación cuenta los `no verificado`.

### F-2 — Hallazgo duplicado // AC-2

1. 4a.2: el `MEDIUM` del Tech-Lead y el `HIGH` del Security en `src/auth.js:42`, ambos `bloqueante`.
2. 4a.3: misma ruta, misma línea → candidatos; misma corrección → un grupo. Representante: Security (`HIGH`). Severidad `HIGH`; `Reportado por: Security-Reviewer (security, HIGH), Tech-Lead-Reviewer (code-quality, MEDIUM).`
3. 4b: la severidad efectiva del Tech-Lead se recalcula sin la fila fusionada; `$MAX_SEVERITY = HIGH`.
4. 4c: un bloqueante → `NEEDS-CHANGES`, `1 hallazgo(s) bloqueante(s)`.
5. 4f: una fila en `fix-directives.md`, `Dimensión: security, code-quality`.
6. 5b: la fila va en `### Seguridad`; `### Calidad de Código` muestra `Sin hallazgos propios: 1 fusionado(s) en security`.

### F-3 — Hallazgos distintos // AC-3

4a.3: `src/auth.js:42` y `src/auth.js:90` no son candidatos. Los dos de `src/auth.js:42` sí, pero sus recomendaciones piden correcciones distintas → no se fusionan. Tres bloqueantes, ninguno con `Reportado por:`.

### F-4 — Degradación // P7

- **Informe parcial escrito por un agente instalado sin la sección (copia desactualizada):** sus `HIGH`/`MEDIUM` sin `Fallo:` quedan `no verificado`; el veredicto puede pasar a `APPROVED` con los hallazgos visibles y contados en la justificación. Se corrige reinstalando; `SKILL.md` y los agentes se instalan juntos.
- **Celda de ubicación con formato inesperado** (`AC-1` sin paréntesis): `falta Archivo:Línea`; no se aborta.
- **Duda sobre si dos hallazgos piden la misma corrección:** no se fusionan.
- **Duda sobre si un escenario es concreto:** `no verificado` (regla de duda del Paso 4c.1).
- **Revisor bloqueado:** sus hallazgos no entran en `$FINDINGS` (igual que hoy no aportan severidad).
- **`--single-agent`:** solo hay un revisor; 4a.2 se aplica y 4a.3 no encuentra candidatos.

### F-5 — Puntos de cambio // P6

- El orden del Paso 4 queda: 4a lectura → 4a.1 «No reportar» (STORY-180) → 4a.2 verificación → 4a.3 fusión → pasos de STORY-181 (PREEXISTENTE) y STORY-185 (tope de LOW, arrastres), que toman los números siguientes → 4b. Si esta historia se implementa antes que STORY-180, 4a.1 queda reservado y los números no cambian.
- STORY-185 aplica el tope sobre `$FINDINGS` tras la fusión, así que un LOW repetido entre revisores cuenta una vez.
- STORY-181 añade a I-5 un estado PREEXISTENTE; `$FINDINGS` y el prefijo de estado ya tienen dónde alojarlo.
- STORY-183 puede decidir que los criterios DoD cubiertos por un revisor no creen filas nuevas: 4c.1 ya trabaja sobre `$FINDINGS`.

## Decisiones de complejidad justificada

- **Tabla consolidada `$FINDINGS` (D-3, I-4):** hoy el árbitro solo lee frontmatter. Verificar y fusionar exige filas; es la estructura mínima para las dos cosas y la que reutilizan STORY-181 y STORY-185.
- **Fusión en dos fases (D-4):** la fase determinista sola fusiona de más (AC-3) y el juicio solo compara todo con todo; la combinación es lo mínimo que cumple el criterio de igualdad de la historia.
- **Migración de 11 evals (D-8):** sin ella los evals dejan de medir lo que miden hoy. Es añadir un campo por caso.
- **Prueba de contrato (D-9):** cinco aserciones baratas que el gate ejecuta siempre; los evals dependen de una ejecución manual.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `MEDIUM` sin ubicación y `HIGH` sin escenario figuran como `no verificado` y no producen `NEEDS-CHANGES` | TC-030 | AC-1 |
| 2 | Un `HIGH` con los dos sigue bloqueando y es el único en `fix-directives.md` | TC-031 | AC-1 |
| 3 | El mismo defecto de dos revisores aparece una vez como `HIGH`, citando a los dos, en el informe y en `fix-directives.md` | TC-032 | AC-2 |
| 4 | Tres hallazgos distintos quedan separados y ninguno cita a más de un revisor | TC-033 | AC-3 |
| 5 | `verdict` y `max-severity` conservan valores y significado; secciones del informe y de `fix-directives.md` sin cambios | `git diff` de los dos templates vacío; C-8 aserción 3 | CNF-1 |
| 6 | Evals escritos antes del skill | Orden de tareas en `tasks.md`; `git log` de `evals.json` anterior al de `SKILL.md` | CNF-2 |
| 7 | Los cuatro agentes piden `Archivo:Línea` y escenario | C-8 aserciones 1, 2 y 5 | CNF-3 |
| 8 | Los casos existentes que esperan `NEEDS-CHANGES` siguen siendo coherentes con la regla | C-8 aserción 4 | CNF-2 |
| 9 | Gate verde | `npm run verify:repository` y `npm test` con código 0 | CNF-1, CNF-3 |

## Risks / Trade-offs

- **[Riesgo] Un defecto real mal redactado deja de bloquear** → la sección compartida de los agentes (D-7) y el ejemplo de cada tabla piden el escenario; el hallazgo queda visible con su prefijo y contado en la justificación del veredicto, y el humano lo ve en `/story-acceptance`.
- **[Trade-off] Los `MEDIUM` de mantenibilidad y de dependencias** (Tech-Lead, `## Formato de severidad`) rara vez tienen un «resultado erróneo observable». Con la regla de la historia, solo bloquean si el revisor concreta uno; si no, quedan `no verificado`. Ver CR-001.
- **[Riesgo] El juicio del árbitro (LLM) sobre la misma corrección varía** → la fase 1 lo acota a ruta y líneas solapadas, la duda no fusiona y cada fusión se cita con `Reportado por:`, así que un exceso es visible.
- **[Riesgo] El criterio 21 del DoD reintroduce un `no verificado`** → 4c.1 evalúa sobre `$FINDINGS` (D-6).
- **[Conflicto de edición] STORY-180 y STORY-185 editan el Paso 4 y STORY-177 y STORY-180 los mismos agentes** → orden recomendado: después de STORY-180 (Notas de la historia); F-5 fija la numeración para que los pasos no choquen.
- **[Limitación] Las copias instaladas** (`.claude/skills/story-code-review/`…) no tienen los cambios hasta reinstalar → F-4.

## Open Questions

Ninguna. El mecanismo de comparación lo fija D-4; la ubicación en tablas sin columna, D-2; el resto, D-1 a D-9.

## Autoevaluación (P9, P10)

- **Omisiones:** los tres AC y los tres CNF tienen componente y contrato de verificación (AC-1: D-1, D-2, D-3, D-6, TC-030, TC-031; AC-2: D-4, D-5, D-6, TC-032; AC-3: D-4, D-5, TC-033; CNF-1: D-1, D-5, D-6; CNF-2: D-8, D-9; CNF-3: D-2, D-7, D-9). La consecuencia sobre los evals existentes está cubierta por D-8.
- **Ambigüedad:** «escenario de fallo concreto» y «`Archivo:Línea` válido» tienen definición operable (I-2, I-3); «mismo defecto», mecanismo en dos fases (D-4); la duda se resuelve sin bloquear y sin fusionar.
- **Nombres:** «árbitro», «revisor», «bloqueante», «no verificado», «fusionado», `Fallo:` y `Reportado por:` se usan igual en la historia, `SKILL.md` y los agentes; `$FINDINGS` sigue el estilo `$IMPL_FILES`.
- **Estructura:** sin dependencias cíclicas: los revisores escriben informes; el árbitro los lee, verifica, fusiona y calcula. 4a.2 y 4a.3 tienen una sola responsabilidad cada uno y la interfaz entre ellos es `$FINDINGS`. El documento no contiene código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 exige escenario de fallo concreto para todo `HIGH`/`MEDIUM`, pero `tech-lead-reviewer.agent.md` define `MEDIUM` también como «impacta mantenibilidad» o «dependencia nueva sin justificación», que rara vez producen un resultado erróneo observable. El diseño aplica la regla sin excepciones, como dice la historia: esos `MEDIUM` solo bloquean si el revisor concreta un fallo; si no, quedan `no verificado` y visibles.
- **Documento afectado**: story.md
- **Acción requerida**: confirmar en `/story-acceptance` que es el comportamiento deseado; si no, añadir a la historia una excepción explícita para esos tipos de `MEDIUM`.

### CR-002
- **Tipo**: desviación de implementación
- **Descripción**: STORY-181 se implementó a la vez que esta historia y ocupó el Paso 4a.2 (clasificación PREEXISTENTE, el orden que recomienda su diseño) y los evals TC-030 a TC-033. Por eso la verificación es el Paso **4a.3** y la fusión el **4a.4** (no 4a.2 y 4a.3 como dicen D-3, D-4, F-5 y D-9), y los casos nuevos son **TC-034 a TC-037** (D-8 ya preveía «los siguientes libres»). Los hallazgos PREEXISTENTE no se verifican ni se fusionan: ya no cuentan. Los tres casos de STORY-181 que esperan `NEEDS-CHANGES` (TC-031, TC-032, TC-033) recibieron `failure_scenario` y `Fallo:` igual que los once de D-8, sin cambiar su `expected`.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; la prueba de contrato (D-9) fija la numeración final.
