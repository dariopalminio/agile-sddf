---
alwaysApply: false
type: design
id: STORY-185
slug: STORY-185-tope-de-low-y-arrastres-design
title: "Design: Tope de LOW por revisor y sin arrastres entre rondas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-185
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-185-tope-de-low-y-arrastres
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
  - STORY-182-verificar-y-deduplicar-hallazgos
---

<!-- Referencias -->
[[STORY-185-tope-de-low-y-arrastres]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-180-story-code-review-lee-review-md]] · [[STORY-181-hallazgos-preexistentes]] · [[STORY-182-verificar-y-deduplicar-hallazgos]]

# Diseño técnico: Tope de LOW por revisor y sin arrastres entre rondas

## Context

El árbitro de `/story-code-review` (Paso 4) copia en `code-review-report.md` todas las filas `LOW` de los cuatro revisores, sin límite, y en cada ronda vuelve a copiar las que ya mostró. Esta historia limita los `LOW` visibles por revisor y, cuando la revisión anterior guardó `code-review-lows.json`, omite los que se repiten sobre líneas que no cambiaron. Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `skills/story-code-review/SKILL.md` | 4a (372-382): lee los cuatro informes. 4b (384-392): `$MAX_SEVERITY` sale del `max-severity` de cada informe. 4c (394-408): bloqueante = `HIGH`/`MEDIUM`; los `LOW` nunca bloquean. 4f (487-515): `fix-directives.md` lleva solo bloqueantes. 5b (563): `{{TECH_LEAD_FINDINGS}}` y demás reciben «solo la tabla de `## Hallazgos`» de cada informe. 3a (320-324): `.tmp/story-code-review/{story_id}/` se vacía en cada ejecución, así que no conserva nada entre rondas. 5 (546-579): `code-review-report.md` se reescribe entero en cada ronda. |
| `skills/story-code-review/agents/*.agent.md` | Tabla `## Hallazgos` con columnas `Severidad \| Archivo:Línea \| Descripción \| Recomendación` (p. ej. `tech-lead-reviewer.agent.md:87`) y lista «Reglas» de salida (`tech-lead-reviewer.agent.md:93-97`). No fijan el orden de las filas. |
| `skills/story-code-review/assets/code-review-report-template.md` | `## Resumen` es una tabla de campos (fila `testcases.md`). Sin campo para LOW omitidos. |
| `docs/templates/REVIEW-template.md:38-42` | Sección `## Tope de Minor — 🟡 Minor · LOW`: «Máximo **[5]** 🟡 Minor por revisor» y «No repitas un 🟡 Minor de una ronda anterior si el rework no tocó esas líneas». `REVIEW.md` aún no existe (STORY-179). |
| Diseño de STORY-180 | `$REVIEW_PATH` (I-1, Paso 2d.1) llega al árbitro; los revisores ya aplican el tope a sus propios `LOW` (D-3), pero el árbitro no lo hace cumplir («es STORY-185»). Paso 4a.1 («No reportar»). Su prueba fija que los encabezados `##`/`###` de la plantilla no cambian (aserción 4). |
| Diseño de STORY-181 | Paso 4a.2 (PREEXISTENTE) con el motor `skills/story-code-review/scripts/touched-lines.js`, `CLI_ROOT` en el Paso 0 y `parseLocation(text)` exportada. Compara contra la base de la rama con git; no sirve para «ronda anterior», que no tiene commit propio. |
| Diseño de STORY-182 | Pasos 4a.2 y 4a.3 (verificación y fusión) y `$FINDINGS` (I-4), la tabla consolidada con `revisor` y `severidad` por fila. También numera su primer paso 4a.2: ver CR-001. |
| `skills/story-implement/SKILL.md:295-311` | El rework solo lee `fix-directives.md` (bloqueantes y lista blanca) y nunca registra líneas modificadas. Un archivo de la lista blanca puede tener `LOW` en líneas que el rework no tocó. |
| `skills/story-complete/scripts/story-complete.js` | Precedente de motor Node propio del skill: `<CLI_ROOT>/skills/<skill>/scripts/<motor>.js`, salida JSON, funciones exportadas probadas con `node:test`. |
| `skills/story-code-review/evals/evals.json` | 23 casos (TC-001 a TC-023). Reservas de las historias hermanas: TC-024 a TC-041 (STORY-177, 180, 181, 182 y 183). |

Stack: skill en Markdown con agentes locales, motores Node ≥ 18 sin dependencias (`crypto`, `fs`, `path` del runtime), pruebas `node --test test` y evals de simulación (`contains`/`not_contains`) que se ejecutan a criterio humano.

## Goals / Non-Goals

**Goals:**
- El árbitro muestra como máximo `$LOW_CAP` filas `LOW` por revisor: el «Tope de Minor» de `REVIEW.md`, o 5 si `REVIEW.md` no existe o no lo declara, y dice cuántas omitió. // satisface: AC-1
- Con un registro guardado en la revisión anterior, el árbitro omite los `LOW` que repiten uno de esa ronda sobre líneas cuyo contenido no cambió; los `HIGH`/`MEDIUM` se repiten siempre. // satisface: AC-2
- Sin registro previo, los `LOW` de un informe legado se muestran sujetos al tope y el informe avisa «arrastre no comprobado». Al cerrar cada ronda, un motor determinista guarda las huellas de los `LOW` visibles y omitidos por arrastre para compararlos en la siguiente. // satisface: AC-2
- `verdict`, `max-severity`, el frontmatter y las secciones del informe no cambian. // satisface: CNF-1
- Evals del tope y del arrastre escritos antes de cambiar el skill, y una prueba unitaria del motor. // satisface: CNF-2

**Non-Goals:**
- Verificación de evidencia de `HIGH`/`MEDIUM` y deduplicación entre revisores (STORY-182). PREEXISTENTE (STORY-181). Filas `DoD-CODE-REVIEW` (STORY-183): no son de un revisor y no pasan por el tope ni por el arrastre.
- Omitir `HIGH` o `MEDIUM` repetidos, aunque sus líneas no cambien (AC-2, «Pero»).
- Leer `REVIEW.md` o pasarlo a los revisores (STORY-180); este diseño solo lee su sección «Tope de Minor».
- Cambiar `story-implement` o `story-implement-tasks` para registrar las líneas del rework.
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Motor de huellas de LOW | crear | `skills/story-code-review/scripts/low-ledger.js` | AC-2 |
| C-2 | Orquestador (árbitro) | modificar | `skills/story-code-review/SKILL.md`: «Qué hace», `## Entrada` (registro previo opcional e informe legado), `## Dependencias`, Paso 0 (`CLI_ROOT`, si STORY-181 no lo añadió), Paso 4a.N nuevo (comparación o aviso de arrastre no comprobado), Paso 5b (tablas de hallazgos y `{{LOW_NOISE_STATUS}}`), Paso 5c nuevo, Paso 7, `## Salida` y manejo de errores | AC-1, AC-2, CNF-1 |
| C-3 | Plantilla del informe | modificar (una fila en `## Resumen`) | `skills/story-code-review/assets/code-review-report-template.md` | AC-1, AC-2, CNF-1 |
| C-4 | Agentes revisores | modificar (una regla de orden en «Reglas» de salida) | `skills/story-code-review/agents/{tech-lead,product-owner,integration,security}-reviewer.agent.md` | AC-1 |
| C-5 | Evals del skill | modificar (cinco casos nuevos) | `skills/story-code-review/evals/evals.json` | AC-1, AC-2, CNF-2 |
| C-6 | Prueba del motor y del contrato | crear | `test/story-code-review-low-noise.test.js` | AC-1, AC-2, CNF-1 |
| C-7 | README del skill | modificar (una frase en «What it does») | `skills/story-code-review/README.md` | AC-1, AC-2 |

Sin cambios: `assets/fix-directives-template.md` (los `LOW` nunca entran), `docs/templates/REVIEW-template.md` (ya declara el tope y la regla de arrastre), `docs/guardrails/`, `docs/adr/`, `package.json` (`files` ya publica `skills/story-code-review`, incluido `scripts/`) y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — `$LOW_CAP` y `$LOW_CAP_SOURCE` (Paso 4a.N, fase 1) | Si `$REVIEW_PATH` no está vacío y la sección cuyo encabezado `##` empieza por «Tope de Minor» tiene una línea con «Máximo» seguida de un entero `N ≥ 0` (admite `**`, `[` y `]` alrededor), `$LOW_CAP = N` y `$LOW_CAP_SOURCE = REVIEW.md`. En cualquier otro caso, `$LOW_CAP = 5` y `$LOW_CAP_SOURCE` = `por defecto (REVIEW.md sin tope declarado)` o `por defecto (sin REVIEW.md)`. Si `$REVIEW_PATH` no existe como variable (STORY-180 sin implementar), se trata como vacía. | AC-1 |
| I-2 — Registro de huellas `code-review-lows.json` | Archivo JSON en `$STORY_DIR/`, versionado con la historia y archivado con ella. Lo escribe solo el motor (I-4); el árbitro solo lo pasa por ruta. Esquema en `## Esquema de datos`. | AC-2 |
| I-3 — CLI `compare` | `node <CLI_ROOT>/skills/story-code-review/scripts/low-ledger.js compare --repo-root <REPO_ROOT> --ledger <$STORY_DIR/code-review-lows.json> --locations <archivo.json>`. `<archivo.json>`: arreglo JSON de cadenas `Archivo:Línea` de los `LOW` de esta ronda. Exit `0` con un único objeto JSON en stdout, también si no hay registro; exit `2` ante argumentos inválidos o un `--locations` ilegible, con el error en stderr. No escribe archivos. | AC-2 |
| I-4 — CLI `record` | `node <CLI_ROOT>/skills/story-code-review/scripts/low-ledger.js record --repo-root <REPO_ROOT> --lows <archivo.json> --out <$STORY_DIR/code-review-lows.json>`. `<archivo.json>`: arreglo de `{ reviewer, location, description }`. Calcula la huella de cada ubicación y escribe `--out` completo (reemplaza el anterior). Exit `0` con `{ ok: true, written: <n>, skipped: [ { location, why } ] }`; exit `2` si faltan argumentos, el JSON es ilegible o `--out` queda fuera de `--repo-root`. | AC-2 |
| I-5 — Salida de `compare` | `{ ok: true, applied: <bool>, reason: <código> \| null, message: <texto> \| null, entries: [ { id, reviewer, location, description, status, current } ], locations: [ { location, overlaps: [ <id> ] } ] }`. `status ∈ {unchanged, moved, changed, unknown}`; `current` = `<ruta>:<inicio>-<fin>` actual si `unchanged` o `moved`, `null` en otro caso. `overlaps` lista los `id` cuyo `current` se solapa con la ubicación. Con `applied: false`, `entries` y `locations` son `[]`. | AC-2 |
| I-6 — Códigos de `reason` | `no-ledger` (no existe `code-review-lows.json`, tanto en primera revisión como con informe legado) e `invalid-ledger` (JSON ilegible o `version` desconocida). El orquestador añade `engine-unavailable` (motor o `node` no encontrados, exit distinto de `0` o salida que no es I-5). La presencia del informe anterior distingue `none` de «arrastre no comprobado». Mensajes en `## Esquema de datos`. | AC-2 |
| I-7 — Funciones exportadas | `parseLocation(text)`, `fingerprint(lines)`, `locateEntry(fileLines, entry)`, `compareLedger({ repoRoot, ledger, locations })`, `recordLedger({ repoRoot, lows })`, para las pruebas (patrón de `story-complete.js`). | AC-2, CNF-1 |
| I-8 — Marcas internas del árbitro | Cada fila `LOW` de la tabla consolidada recibe `visible`, `omitido-por-tope` u `omitido-por-arrastre`. Las filas omitidas siguen en la tabla interna: cuentan para la severidad efectiva (4b) y para el DoD (4c.1), y solo desaparecen del informe. | AC-1, AC-2, CNF-1 |
| I-9 — `{{LOW_NOISE_STATUS}}` y nota por dimensión (Paso 5b) | Valor de la fila `Control de LOW` de `## Resumen` y línea `ℹ️` tras la tabla de la dimensión de un revisor con filas omitidas. Textos en `## Esquema de datos`. | AC-1, AC-2, CNF-1 |

## Decisions

### D-1 — Mecanismo de «línea no tocada»: huella de contenido guardada al cerrar cada ronda // satisface: AC-2

La historia fija el criterio (el contenido de la línea no cambió respecto de la ronda anterior) y deja el mecanismo a este diseño. Se elige una **huella de contenido**: al cerrar cada revisión, el motor C-1 guarda, por cada `LOW` mostrado u omitido por arrastre, el revisor, la ubicación, la descripción y el SHA-256 (16 primeros caracteres hex) de las líneas citadas. En la ronda siguiente compara esa huella con el working tree. La huella no depende de git ni de que el humano haga commit entre rondas.

La normalización solo convierte CRLF en LF y quita el espacio en blanco final de cada línea: un cambio de sangría es un cambio de contenido.

| Alternativa | Motivo del rechazo |
|---|---|
| `git diff` contra el estado de la ronda anterior | La ronda anterior no tiene commit: el flujo no hace commit entre `NEEDS-CHANGES` y el rework. Fijarlo con `git stash create` o un índice temporal deja objetos sueltos que `git gc` puede borrar y añade git a la lectura de `REVIEW.md`, contra ADR-0021 (D-4). |
| Motor de STORY-181 (`touched-lines.js`) | Compara contra la base de la rama: marca como tocadas todas las líneas de la historia, así que no distingue lo que cambió el rework. |
| Por archivo: arrastre si el archivo no está en la lista blanca de `fix-directives.md` | Los `LOW` de los archivos de la lista blanca, que son los que más se repiten, se repetirían siempre: no cumple AC-2 «en una línea que el rework no tocó». |
| Guardar el texto de la línea en el informe y que el LLM lo compare | El LLM no puede seguir una línea desplazada por el rework ni comparar texto byte a byte de forma fiable. Además, un `-->` del código rompería un comentario HTML. |

### D-2 — El registro vive en un archivo propio, escrito solo por el motor // satisface: AC-2, CNF-1

`code-review-lows.json` (I-2) se escribe en `$STORY_DIR/` en el nuevo Paso 5c, después de `code-review-report.md`, con cualquier veredicto. Nunca se borra: la historia lo archiva con el resto de sus artefactos. La «ronda anterior» es la última revisión de la historia, cualquiera que haya sido su veredicto. El árbitro lee sus `LOW` del registro de esa revisión: contiene los `LOW` visibles y los omitidos por arrastre, con su huella; los omitidos solo por el tope no cuentan como ya vistos.

Si existe un informe anterior pero falta el registro, el árbitro reconoce el caso legado antes de sobrescribir el informe. No extrae código histórico ni calcula huellas retroactivas: muestra los `LOW` actuales sujetos al tope, avisa «arrastre no comprobado» y en 5c crea el registro para la próxima ronda. Sin informe ni registro, es la primera revisión y no hay arrastre que comprobar. El alcance acotado de AC-2 resuelve INC-001 sin atribuir verificación al pasado.

| Alternativa | Motivo del rechazo |
|---|---|
| Bloque de comentario HTML al final de `code-review-report.md` | El LLM que rellena la plantilla tendría que copiar huellas hex sin error, y el informe pasaría a llevar datos de máquina. CNF-1 pide no tocar su formato. |
| `.tmp/story-code-review/{story_id}/` | El Paso 3a lo vacía en cada ejecución (NF-2), y `.tmp/` no se versiona ni es un canal entre ejecuciones. |
| Dentro de `fix-directives.md` | Su contrato es «solo bloqueantes» (STORY-181) y lo consumen los ejecutores del rework, que empezarían a corregir Minor. Además, `APPROVED` lo borra. |
| Borrarlo con `APPROVED` (como `fix-directives.md`) | No es una señal de flujo: conservarlo evita un caso aparte y sirve si la historia vuelve a revisión después de `/story-acceptance`. |

### D-3 — Comparación: misma posición, posición desplazada o cambiada // satisface: AC-2

Para cada entrada del registro, `locateEntry` calcula el `status`:

| Situación | `status` |
|---|---|
| El archivo existe, un único bloque tiene la misma huella y está en `inicio..fin` | `unchanged` (`current` = misma ubicación) |
| No coinciden en su posición, pero un único bloque de `fin-inicio+1` líneas del archivo tiene la misma huella | `moved` (`current` = nueva ubicación) |
| Ningún bloque coincide, o coinciden dos o más | `changed` |
| El archivo no existe, la ubicación no se puede leer como `<ruta>:<N>` o `<ruta>:<N>-<M>`, o la ruta es absoluta o tiene `..` | `unknown` |

`moved` cubre el caso típico del rework: unas líneas añadidas encima desplazan el `LOW` sin cambiar su contenido. Se cuentan todas las coincidencias antes de decidir el estado. Una coincidencia múltiple, como una línea `}`, da `changed` incluso si una está en la posición original o si otro bloque idéntico reemplazó al registrado. El motor nunca afirma `unchanged` ni `moved` sin una única coincidencia exacta.

**Invariante:** ante cualquier duda, el motor no da `unchanged` ni `moved`, y el `LOW` se muestra. El error posible es repetir un Minor, nunca ocultar uno de una línea cambiada.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo la misma posición, sin desplazamiento | Un rework que añade una línea al principio del archivo haría repetir todos sus `LOW`. |
| Coincidencia aproximada (distancia de edición) | Si el rework cambió una línea, aunque sea poco, el Minor puede ser otro; la historia pide «el contenido no cambió». |

### D-4 — El árbitro aplica arrastre y tope en un último sub-paso antes de 4b // satisface: AC-1, AC-2, CNF-1

Nuevo **Paso 4a.N — Control de ruido de LOW**, el último sub-paso de 4a y anterior a 4b. Va después de 4a.1 (STORY-180), de PREEXISTENTE (STORY-181) y de la verificación y fusión (STORY-182), para que una fila fusionada cuente una vez. Toma el número siguiente libre al implementarse: nominalmente 4a.4 con las tres historias implementadas y 4a.1 si se implementa antes que ellas (CR-001). Trabaja sobre las filas `LOW` de informes válidos, incluidas las `🟣 PREEXISTENTE (LOW)`; nunca sobre `HIGH`, `MEDIUM`, filas `no verificado` ni filas `DoD-CODE-REVIEW`. Tiene tres fases:

1. **Tope:** resolver `$LOW_CAP` y `$LOW_CAP_SOURCE` (I-1).
2. **Arrastre:** antes de sobrescribir el informe, comprobar si hay `code-review-report.md` anterior y `code-review-lows.json`. Sin registro ni informe anterior, `$CARRYOVER_CHECK = none` y no se omite nada. Con informe anterior pero sin registro, `$CARRYOVER_CHECK = unavailable`, motivo `no-ledger` (I-6), y ningún `LOW` se omite por arrastre; no se extrae código histórico del informe ni se infiere del working tree actual. Con registro, escribir en `.tmp/story-code-review/{story_id}/low-locations.json` las ubicaciones de los `LOW` e invocar `compare` (I-3). El árbitro valida el objeto completo I-5, incluidos `ok`, `applied`, `reason`, `message`, `entries[].current` y `locations[].overlaps`; una salida incompleta degrada a `engine-unavailable` y no autoriza omisiones. Una fila `LOW` es `omitido-por-arrastre` si su ubicación tiene en `overlaps` una entrada `unchanged` o `moved` y la descripción de esa entrada designa el mismo defecto. Un `LOW` sin `Archivo:Línea` válido nunca se omite por arrastre. Ante duda de si es el mismo defecto, se muestra: la regla de duda de 4c.1. Si el motor da `applied: false` o no responde, `$CARRYOVER_CHECK = unavailable` con su motivo y no se omite nada.
3. **Corte:** para cada revisor, recorrer sus filas `LOW` en el orden de su informe (tabla principal y, después, las de `testcases.md`) sin contar las omitidas por arrastre. Las primeras `$LOW_CAP` quedan `visible` y el resto, `omitido-por-tope`. Una fila fusionada (STORY-182) cuenta para el revisor que la representa.

El arrastre va antes del corte para que el tope reparta su cupo entre `LOW` nuevos: en una segunda ronda con los mismos 12 Minor, se ven los 5 que no se vieron en la primera, no los mismos 5.

Las filas omitidas no cambian `$MAX_SEVERITY` ni `$VERDICT` (I-8): un `LOW` omitido sigue existiendo en el código, y `max-severity` conserva su significado, la máxima severidad detectada (CNF-1). Como los `LOW` nunca bloquean, el veredicto tampoco cambia.

| Alternativa | Motivo del rechazo |
|---|---|
| Tope antes del arrastre | En la segunda ronda, el cupo lo llenarían Minor ya vistos, que luego se omitirían: el informe mostraría menos de los que caben y nunca los nuevos. |
| Que el árbitro elija los `LOW` «más relevantes» | Criterio de LLM no reproducible ni comprobable en un eval. El revisor ya ordena por relevancia (D-5) y el corte es un conteo. |
| Restar los omitidos de `max-severity` | Cambia el significado de `max-severity` (CNF-1) y haría `ninguna` una revisión con Minor reales. |
| Hacerlo en el Paso 5b, al renderizar | La historia fija el punto de inserción en el árbitro, entre 4a y 4b, y el recuento de omitidos debe existir antes del informe y del resumen de consola. |

### D-5 — Los revisores ordenan sus filas por severidad y relevancia // satisface: AC-1

El corte conserva las primeras `$LOW_CAP` filas. Para que sean las más útiles, cada agente gana en su lista «Reglas» de salida: «Ordena las filas de cada tabla de hallazgos por severidad (`HIGH`, `MEDIUM`, `LOW`) y, dentro de una misma severidad, de más a menos relevante: el árbitro conserva los primeros `LOW` hasta el tope». El texto es idéntico en los cuatro agentes y no cambia columnas ni frontmatter. Va en «Reglas» y no en la sección «Guía de revisión (REVIEW.md)» de STORY-180, porque el corte se aplica también sin `REVIEW.md` (tope 5).

| Alternativa | Motivo del rechazo |
|---|---|
| Sin regla de orden | El corte dejaría los primeros `LOW` en el orden en que el revisor los escribió, que puede ser el del archivo. |
| Columna de prioridad en la tabla | Cambia el formato del informe parcial y de `code-review-report.md` (CNF-1). |

### D-6 — En el informe: una línea por dimensión y una fila en `## Resumen` // satisface: AC-1, AC-2, CNF-1

- En `{{TECH_LEAD_FINDINGS}}` y los demás marcadores, el árbitro inserta la tabla del revisor **sin** las filas omitidas. Si omitió alguna, añade tras la tabla la línea `ℹ️` de I-9 con los recuentos («indica cuántos LOW se omitieron», AC-1). Si todas las filas de una tabla quedan omitidas, la tabla conserva una fila `| — | — | Sin hallazgos visibles (ver nota) | — |`.
- La plantilla gana la fila `| Control de LOW | {{LOW_NOISE_STATUS}} |` al final de las filas añadidas por las historias hermanas (tras `Hallazgos preexistentes` de STORY-181, o tras `Guía de revisión` de STORY-180, o tras `testcases.md` si ninguna está implementada) y antes de `Fecha`.
- Frontmatter, encabezados `##`/`###`, valores de `verdict` y significado de `max-severity` no cambian: la aserción 4 de la prueba de STORY-180 sigue en verde.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección nueva `### LOW omitidos` | Cambia las secciones del informe (CNF-1, CS-2). |
| Listar los `LOW` omitidos en el informe | Es el ruido que la historia quita. El revisor los conserva en `.tmp/` durante la ejecución y el recuento basta para AC-1. |
| Solo la fila de `## Resumen` | El lector ve los `LOW` en la dimensión del revisor y ahí necesita saber que faltan algunos. |

### D-7 — Evals primero: cinco casos // satisface: AC-1, AC-2, CNF-2

Se escriben en `evals.json` antes de modificar el skill (principio 11, CS-8), con el formato de simulación de TC-002. Los casos simulan en `input` los informes de los revisores, el `REVIEW.md` y la salida del motor, como STORY-181 simula `touched_lines_engine`. La numeración va tras las reservas de las historias hermanas (TC-024 a TC-041): nominalmente TC-042 a TC-046, o los siguientes libres al implementar.

- **TC-042 `tope-de-low-desde-review-md`** (AC-1, ejemplo 1): `review_md_present: true`, `review_md_low_cap: 3`; Tech-Lead con 12 `LOW` en `src/a.js:1` a `src/a.js:12`; demás sin hallazgos; sin registro previo. `contains`: `src/a.js:3`, `9 LOW omitidos por el tope`, `tope 3`, `REVIEW.md`, `(verdict: APPROVED)`, `max-severity: LOW`. `not_contains`: `src/a.js:4 |`, `src/a.js:12`, `(verdict: NEEDS-CHANGES)`.
- **TC-043 `tope-por-defecto-review-md-sin-tope`** (AC-1, ejemplo 2): igual, con `review_md_present: true` y `review_md_low_cap: null`. `contains`: `src/a.js:5`, `7 LOW omitidos por el tope`, `tope 5`, `REVIEW.md sin tope declarado`. `not_contains`: `src/a.js:6 |`, `src/a.js:12`.
- **TC-044 `tope-por-defecto-sin-review-md`** (AC-1, ejemplo 3, SMOKE-3): igual, con `review_md_present: false`. `contains`: `src/a.js:5`, `7 LOW omitidos por el tope`, `sin REVIEW.md`, `(verdict: APPROVED)`. `not_contains`: `src/a.js:6 |`, `(verdict: BLOCKED)`.
- **TC-045 `low-arrastrado-no-se-repite-high-si`** (AC-2): `existing_fix_directives: { round: 1 }`; `low_ledger_engine: { ok: true, applied: true, reason: null, message: null, entries: [ { id: "L1", reviewer: "tech-lead-reviewer", location: "src/calc.js:10", description: "nombre de variable poco descriptivo", status: "unchanged", current: "src/calc.js:10" } ], locations: [ { location: "src/calc.js:10", overlaps: ["L1"] } ] }`; Tech-Lead: `LOW` en `src/calc.js:10` con la misma descripción, `HIGH` en `src/calc.js:20` y `MEDIUM` en `src/calc.js:30`, ambos con escenario de fallo y pendientes de la ronda anterior. `contains`: `src/calc.js:20`, `HIGH`, `src/calc.js:30`, `MEDIUM`, `1 LOW arrastrado`, `(verdict: NEEDS-CHANGES)`, `round: 2`. `not_contains`: `nombre de variable poco descriptivo`, `(verdict: APPROVED)`.
- **TC-046 `low-en-linea-cambiada-se-muestra`** (D-3, invariante): igual que TC-045, sin el `HIGH` ni el `MEDIUM`; objeto completo `low_ledger_engine: { ok: true, applied: true, reason: null, message: null, entries: [ { id: "L1", reviewer: "tech-lead-reviewer", location: "src/calc.js:10", description: "nombre de variable poco descriptivo", status: "changed", current: null } ], locations: [ { location: "src/calc.js:10", overlaps: [] } ] }`. `contains`: `src/calc.js:10`, `nombre de variable poco descriptivo`, `(verdict: APPROVED)`. `not_contains`: `1 LOW arrastrado`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo los dos casos de CNF-2 | Los ejemplos 2 y 3 de AC-1 (tope por defecto) quedarían sin eval, y TC-046 protege contra ocultar un Minor de una línea cambiada. Cada caso es un objeto JSON. |
| Casos `sandbox` con dos rondas reales | Exigen un fixture de repositorio y dos ejecuciones con cuatro subagentes reales: caro. La mecánica de huellas la cubre C-6 en cada `npm test`. |

### D-8 — Prueba unitaria del motor y del contrato // satisface: AC-1, AC-2, CNF-1

`test/story-code-review-low-noise.test.js` (`node:test`, directorios temporales con `fs.mkdtempSync`, sin git y sin tocar el repositorio real):

1. `record` y luego `compare` sin cambios → `unchanged` con la misma ubicación (AC-2).
2. Dos líneas insertadas encima de la línea registrada → `moved` con `current` desplazado dos líneas (D-3).
3. La línea registrada editada → `changed`; una línea `}` registrada y repetida en el archivo, tras insertar otra línea encima → `changed`. Un bloque en la posición original y otro idéntico en otra posición → `changed`, con `current: null`; también si se reemplaza el bloque original por otro idéntico y quedan varias coincidencias. Una única coincidencia en la posición original → `unchanged`; una única desplazada → `moved` (D-3, invariante).
4. Cambio de CRLF a LF o espacio final añadido → `unchanged`; cambio de sangría → `changed` (D-1).
5. Archivo borrado, ruta con `..` o absoluta, `Archivo` sin línea → `unknown`; `record` las lista en `skipped` (D-3).
6. `overlaps`: una ubicación de la ronda nueva dentro del rango `current` de una entrada la lista; una fuera, no (I-5).
7. Sin `--ledger` existente → `applied: false, reason: no-ledger`; JSON ilegible o `version: 2` → `invalid-ledger` (I-6).
8. CLI: exit `0` con JSON de I-5; exit `2` sin `--locations`, con JSON ilegible o con `--out` fuera de `--repo-root` (I-3, I-4).
9. Contrato: `SKILL.md` contiene `low-ledger.js`, `code-review-lows.json`, `{{LOW_NOISE_STATUS}}`, `Tope de Minor` y el aviso literal `arrastre no comprobado` para informe legado sin registro; además ordena crear el registro al cerrar esa ronda. La plantilla contiene `{{LOW_NOISE_STATUS}}` fuera del frontmatter y su frontmatter no cambia de claves (CNF-1); los cuatro agentes contienen la regla de orden de D-5 con el mismo texto; `SKILL.md` no contiene `git show` ni `git diff --name-only` (compatibilidad con la aserción 5 de STORY-180).

| Alternativa | Motivo del rechazo |
|---|---|
| Añadir las aserciones a la prueba de STORY-180 o STORY-181 | Acopla esta historia al orden de implementación de las hermanas. Las historias hermanas usan un archivo de prueba por contrato. |
| Solo evals | Se ejecutan a criterio humano; la invariante de D-3 es lo que más importa proteger y debe correr en cada gate. |

### D-9 — `parseLocation` compartida con el motor de STORY-181 // satisface: AC-2

Las dos historias leen `Archivo:Línea` con las mismas reglas (D-3 de STORY-181): `<ruta>:<N>` o `<ruta>:<N>-<M>`, rutas relativas a `--repo-root`, separador `/`, sin `./` ni comillas invertidas, y `unknown` para rutas absolutas, con `..` o rangos inversos. Si al implementar existe `skills/story-code-review/scripts/touched-lines.js` y exporta `parseLocation`, `low-ledger.js` la importa (`require('./touched-lines.js')`). Si no existe, `low-ledger.js` la define y la exporta, y STORY-181 la importa de `low-ledger.js`. La historia que se implemente en segundo lugar la importa.

| Alternativa | Motivo del rechazo |
|---|---|
| Un módulo `scripts/location.js` nuevo | Una tercera pieza para una sola función de unas 20 líneas, que además obliga a la historia que ya esté implementada a cambiar sus importaciones. |
| Dos copias independientes | Dos lecturas de la misma sintaxis divergen, y un hallazgo sería PREEXISTENTE con una y `unknown` con otra. |

## Esquema de datos // satisface: AC-1, AC-2

**`code-review-lows.json` (I-2):**

| Campo | Tipo | Contenido |
|---|---|---|
| `version` | entero | `1` |
| `generated` | cadena | fecha `YYYY-MM-DD` de la revisión |
| `entries` | arreglo | una entrada por `LOW` registrado |
| `entries[].id` | cadena | `L1`, `L2`… en el orden de `--lows` |
| `entries[].reviewer` | cadena | `tech-lead-reviewer` \| `product-owner-reviewer` \| `integration-reviewer` \| `security-reviewer` |
| `entries[].location` | cadena | `<ruta>:<inicio>-<fin>` normalizada |
| `entries[].description` | cadena | columna `Descripción` de la fila |
| `entries[].hash` | cadena | 16 hex del SHA-256 de las líneas normalizadas, unidas con `\n` |

**`--lows` del Paso 5c:** las filas `visible` y las `omitido-por-arrastre` de esta ronda, estas últimas con la ubicación `current` que dio `compare`. Las `omitido-por-tope` no se registran: el informe no las mostró, así que no cuentan como ya vistas y pueden aparecer en la ronda siguiente.

**`message` por `reason` (I-6):**

| `reason` | `message` |
|---|---|
| `no-ledger` | `no existe code-review-lows.json de la revisión anterior` |
| `invalid-ledger` | `code-review-lows.json ilegible o de una versión desconocida` |
| `engine-unavailable` | `no se encontró el motor low-ledger.js o node` |

**Variables nuevas del orquestador (Paso 4a.N):**

| Variable | Valores |
|---|---|
| `$LOW_CAP` | entero ≥ 0 |
| `$LOW_CAP_SOURCE` | `REVIEW.md` \| `por defecto (REVIEW.md sin tope declarado)` \| `por defecto (sin REVIEW.md)` |
| `$CARRYOVER_CHECK` | `applied` \| `none` \| `unavailable` |
| `$CARRYOVER_REASON` | `""` \| `message` de I-6 |
| `$LOW_OMITTED` | lista de `(revisor, omitidos por tope, omitidos por arrastre)` |

**Nota por dimensión (I-9), solo si el revisor tiene filas omitidas:**

`ℹ️ <K> LOW omitidos por el tope (tope <$LOW_CAP>, <$LOW_CAP_SOURCE>) · <M> LOW arrastrados de la ronda anterior (líneas sin cambios), omitidos.`

Se omite la parte cuyo recuento es 0.

**`{{LOW_NOISE_STATUS}}`** = tope + arrastre, separados por ` · `:

| Parte | Condición | Texto |
|---|---|---|
| Tope | siempre | `tope <$LOW_CAP> LOW por revisor (<$LOW_CAP_SOURCE>)`, seguido de `: <K> omitidos (<revisor> <k>, …)` si alguno se omitió |
| Arrastre | `none` | `sin ronda anterior registrada` |
| Arrastre | `applied` | `<M> LOW arrastrados de la ronda anterior omitidos (líneas sin cambios)` |
| Arrastre | `unavailable` | `⚠️ arrastre no comprobado: <$CARRYOVER_REASON> — no se omiten LOW por arrastre; se aplica el tope` |

**Consola, Paso 7** (línea nueva tras `Severidad máxima:`): ` LOW omitidos:     <K> por tope · <M> arrastrados`.

## Flujos clave

### F-1 — Tope de LOW (escenario principal) // AC-1

1. Pasos 1-4a sin cambios. Los sub-pasos de 4a de STORY-180, 181 y 182, si existen, actúan primero.
2. 4a.N, fase 1: `REVIEW.md` declara «Máximo **3**» → `$LOW_CAP = 3`, `$LOW_CAP_SOURCE = REVIEW.md`. Sin `REVIEW.md` o sin número, 5.
3. Fase 2: no hay `code-review-lows.json` ni informe anterior → `$CARRYOVER_CHECK = none`.
4. Fase 3: las 3 primeras filas `LOW` del Tech-Lead quedan `visible` y las 9 restantes, `omitido-por-tope`.
5. 4b: la severidad efectiva no cambia (`LOW`); 4c → `APPROVED` si no hay bloqueantes.
6. 5b: la tabla del Tech-Lead muestra 3 `LOW` y la nota `ℹ️ 9 LOW omitidos por el tope (tope 3, REVIEW.md)`; `Control de LOW: tope 3 LOW por revisor (REVIEW.md): 9 omitidos (Tech-Lead-Reviewer 9) · sin ronda anterior registrada`.
7. 5c: `record` registra los 3 `LOW` visibles.

### F-2 — Segunda ronda con un LOW arrastrado // AC-2

1. La ronda 1 terminó en `NEEDS-CHANGES` (un `HIGH`, un `MEDIUM` y un `LOW` en `src/calc.js`); 5c registró el `LOW`. El rework corrige otra parte del archivo y la historia vuelve a `IMPLEMENT/DONE`.
2. La ronda 2 llega a 4a.N. Fase 2: existe el registro; `compare` devuelve `L1` `moved` (dos líneas añadidas encima) y el `LOW` nuevo en `src/calc.js:12` tiene `overlaps: [L1]`.
3. Misma descripción → `omitido-por-arrastre`. El `HIGH` y el `MEDIUM` pendientes no pasan por 4a.N: ambos se muestran, cuentan en 4c y entran en `fix-directives.md` con `round: 2`.
4. 5b: el `LOW` no aparece; nota `ℹ️ 1 LOW arrastrado de la ronda anterior (líneas sin cambios), omitido.`
5. 5c: el registro nuevo conserva `L1` con su ubicación actual, así que tampoco se repite en la ronda 3.

### F-3 — LOW en una línea que el rework cambió // AC-2, invariante de D-3

`compare` da `changed` para la entrada; el `LOW` nuevo no tiene `overlaps` válidos y se muestra (con el tope de la fase 3).

### F-4 — Degradación // P7

- **Primera revisión:** sin registro ni informe anterior → `none`; todos los `LOW` pasan al tope.
- **Segunda ronda con informe anterior pero sin registro:** `unavailable` con `no-ledger`; aviso `⚠️ arrastre no comprobado: no existe code-review-lows.json de la revisión anterior — no se omiten LOW por arrastre; se aplica el tope`. No se considera primera revisión ni se reconstruye el pasado desde el informe o el contenido actual. En 5c se registra la ronda actual para poder comparar en la siguiente.
- **Registro ilegible o de otra versión:** `unavailable` con `invalid-ledger`; se muestran todos los `LOW` (con tope). 5c lo reemplaza por uno válido.
- **Motor o `node` ausentes** (copia instalada desactualizada): `unavailable` con `engine-unavailable` en 4a.N, y 5c no escribe el registro, con un aviso en consola. El tope sigue funcionando: no depende del motor. Se corrige reinstalando.
- **`record` falla** (exit distinto de `0`): aviso `⚠️ No se pudo escribir code-review-lows.json — la próxima ronda mostrará de nuevo estos LOW`. El informe y el veredicto ya están escritos y no cambian.
- **`REVIEW.md` con un tope ilegible** (p. ej. «Máximo **cinco**»): 5 por defecto con `REVIEW.md sin tope declarado`.
- **Revisión `BLOCKED`:** 4a.N actúa sobre los informes válidos; 5c registra sus `LOW` visibles.
- **`--single-agent`:** un solo revisor; el tope y el arrastre se aplican igual.

### F-5 — Puntos de cambio // P6

- Otro tope por defecto o un tope por dimensión: solo cambia I-1.
- Otro criterio de «línea no tocada» (p. ej. git, si un ADR posterior lo admite para la ronda anterior): solo cambia `compareLedger`; el árbitro sigue leyendo `status` y `overlaps`.
- Un esquema nuevo del registro: `version: 2` y `invalid-ledger` para la anterior, que degrada a «se muestran todos».

### F-6 — Informe legado sin registro // AC-2

1. Antes de sobrescribir `code-review-report.md`, 4a.N detecta que existe un informe anterior pero no `code-review-lows.json`.
2. Ningún `LOW` de esta ronda se clasifica como arrastre comprobado. El corte por revisor aplica el tope; `HIGH`/`MEDIUM` pendientes se conservan y, si bloquean, `fix-directives.md` aumenta a `round: 2`.
3. 5b escribe el informe con `⚠️ arrastre no comprobado` en `Control de LOW` y sin declarar que una línea anterior siguió igual.
4. 5c escribe `code-review-lows.json` con las huellas de los `LOW` visibles de esta ronda. En la próxima revisión, el registro ya permite comparar y aplicar F-2.

## Decisiones de complejidad justificada

- **Motor Node en vez de prosa (D-1, D-3):** la huella exige un hash y la búsqueda de un bloque desplazado es aritmética de líneas; ninguna de las dos es fiable en un LLM ni se puede probar con `npm test`. Sigue el patrón de `story-complete.js` y del motor de STORY-181.
- **Archivo de registro propio (D-2):** es la única forma de conservar datos entre rondas sin tocar el formato del informe ni depender de git. Lo escribe solo el motor, así que el LLM nunca copia huellas.
- **Detección de desplazamiento (`moved`):** sin ella, AC-2 fallaría en los archivos de la lista blanca, que son justo los que el rework edita. Su coste es una búsqueda lineal por archivo.
- **Regla de orden en los agentes (D-5):** una frase en cuatro archivos que hace útil un corte determinista, en vez de una selección por LLM.
- **Cinco evals (D-7):** tres para los ejemplos de AC-1, uno para AC-2 con registro y uno para la invariante que impide ocultar Minor de líneas cambiadas. El caso legado se comprueba con F-6 y el contrato de D-8, sin simular evidencia histórica inexistente.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Con «Tope de Minor» de 3, el informe muestra 3 `LOW` del revisor y dice que omitió 9 | TC-042 | AC-1 |
| 2 | Con `REVIEW.md` sin tope o sin `REVIEW.md`, el tope es 5 y se omiten 7 | TC-043, TC-044 | AC-1 |
| 3 | Con registro previo, un `LOW` sobre líneas sin cambios no se repite y `HIGH`/`MEDIUM` pendientes sí; sin registro previo, el informe legado produce aviso y tope | Con registro: TC-045, F-2 y C-6 aserciones 1, 2 y 6. Sin registro: F-6, `compare` sin registro de C-6 aserción 7 y contrato estático de la aserción 9; el registro actual queda para la próxima ronda | AC-2 |
| 4 | Un `LOW` sobre una línea cambiada se muestra | TC-046; C-6 aserción 3 | AC-2 |
| 5 | La huella ignora finales de línea y espacio final, y respeta la sangría | C-6 aserción 4 | AC-2 |
| 6 | `verdict`, `max-severity`, frontmatter y encabezados de la plantilla sin cambios | C-6 aserción 9; aserción 4 de la prueba de STORY-180; TC-042 (`max-severity: LOW` con 9 `LOW` omitidos) | CNF-1 |
| 7 | Evals escritos antes del skill | Orden de tareas en `tasks.md`; TC-042 a TC-046 existen antes de editar `SKILL.md` | CNF-2 |
| 8 | Gate verde | `npm run verify:repository` y `npm test` con código 0 | CNF-1, CNF-2 |

## Risks / Trade-offs

- **[Riesgo] El árbitro (LLM) juzga si dos descripciones son el mismo defecto** → solo omite cuando hay una entrada `unchanged`/`moved` que se solapa (evidencia del motor) y, ante duda, muestra. El error posible es repetir un Minor, no ocultar un bloqueante: los `HIGH`/`MEDIUM` nunca pasan por 4a.N.
- **[Riesgo] Un `LOW` omitido por arrastre deja de verse aunque siga sin corregir** → es lo que pide la historia; la nota por dimensión lo cuenta y el informe de la ronda anterior lo conserva en el historial de git.
- **[Trade-off] `code-review-lows.json` es un artefacto nuevo en el directorio de la historia** → es JSON y no lleva frontmatter. `memory-system` y `header-aggregation` procesan solo `.md`, y `story-complete` archiva el directorio entero. Se documenta en `## Salida` de `SKILL.md`.
- **[Limitación] Informe legado sin registro** → no permite comprobar el arrastre de esa ronda: F-4/F-6 muestran sus `LOW` sujetos al tope, avisan «arrastre no comprobado» y registran las huellas actuales. La omisión comprobada empieza en la revisión siguiente.
- **[Limitación] Las copias instaladas** (`.claude/skills/story-code-review/`…) no tienen el motor hasta reinstalar → F-4, `engine-unavailable`.
- **[Conflicto de edición] STORY-180, 181 y 182 editan los mismos Pasos 4a-4b, 5b, la plantilla y los agentes** → 4a.N se define como el último sub-paso de 4a, sea cual sea su número (CR-001), y la fila de la plantilla va tras las de las hermanas que existan. La regla de orden de D-5 va en «Reglas», que ninguna hermana toca.
- **[Conflicto de numeración] Los TC reservados por las hermanas pueden correrse** → regla de «siguientes libres» (D-7).

## Open Questions

Ninguna decisión de diseño pendiente para AC-2: el criterio explícito de `story.md` limita la comparación a registros creados por una revisión anterior. Un informe legado solo activa el aviso y la creación del registro actual (F-6).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → I-1, D-4 (fases 1 y 3), D-5, D-6, TC-042 a TC-044; AC-2 con registro → I-2 a I-7, D-1 a D-4 (fase 2), D-9, TC-045, TC-046, C-6; AC-2 legado sin registro → D-2, D-4, F-4/F-6 y C-6 aserciones 7 y 9; CNF-1 → I-8, D-4, D-6, C-6 aserción 9; CNF-2 → D-7, contrato 7. Son contratos de pruebas pendientes de materializar, no evidencia de ejecución ni un nuevo veredicto del gate.
- **Ambigüedad:** con registro previo, los `LOW` de esa revisión se leen de `code-review-lows.json`, que conserva las filas visibles y las omitidas por arrastre con sus huellas (D-2); sin registro, el informe anterior solo identifica el caso legado y no aporta huellas. «Línea no tocada» = huella igual en una única coincidencia, original o desplazada (D-3). «Por revisor» = las filas `LOW` de todas las tablas de ese revisor (D-4).
- **Nombres:** «tope» (`$LOW_CAP`, «Tope de Minor» de `REVIEW.md`), «arrastre» (`$CARRYOVER_CHECK`, `omitido-por-arrastre`), «ronda» (como en `fix-directives.md`), «registro de huellas» (`code-review-lows.json`), «árbitro» y «revisor» se usan igual en la historia, la épica y `SKILL.md`. `{{LOW_NOISE_STATUS}}` sigue el estilo de `{{TESTCASES_STATUS}}`.
- **Estructura:** sin dependencias cíclicas. El motor lee las líneas actuales y escribe el registro; el árbitro lo invoca y decide; los revisores no conocen el motor. Cada componente tiene una responsabilidad: motor = huellas y comparación, árbitro = selección de filas y detección del caso legado, plantilla = presentación. Las interfaces son `compare` y `record`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: los diseños de STORY-181 (PREEXISTENTE) y STORY-182 (verificación) numeran los dos su nuevo sub-paso como «Paso 4a.2», y STORY-181 y STORY-182 reservan los mismos TC-030 a TC-033. Este diseño no usa un número fijo: define 4a.N como el último sub-paso de 4a, antes de 4b, y toma los TC siguientes libres.
- **Documento afectado**: `design.md` de STORY-181 y de STORY-182 (no esta historia)
- **Acción requerida**: al implementar la segunda de STORY-181 o STORY-182, renumerar sus sub-pasos (orden recomendado por STORY-181: 4a.1 «No reportar» → PREEXISTENTE → verificación y fusión). STORY-185 va siempre al final.

### CR-002
- **Tipo**: cambio de alcance solicitado para resolver INC-001
- **Descripción**: la decisión anterior de adoptar código histórico desde el informe queda retirada. AC-2 ahora exige omisión por arrastre solo si la revisión anterior guardó `code-review-lows.json`; con informe legado sin registro, se aplica el tope, se avisa «arrastre no comprobado» y se registra la ronda actual para la próxima.
- **Documento afectado**: `story.md` (AC-2 y Notas), `design.md` (interfaces, decisiones, flujos y contratos) y `tasks.md` (tareas y verificación).
- **Acción requerida**: implementar solo `compare`/`record` y comprobar los dos recorridos de AC-2. Reanalizar el plan con `/story-analyze STORY-185`; el reporte previo sigue siendo histórico hasta esa evaluación. // satisface: AC-2
