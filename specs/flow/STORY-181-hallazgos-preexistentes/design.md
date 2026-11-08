---
alwaysApply: false
type: design
id: STORY-181
slug: STORY-181-hallazgos-preexistentes-design
title: "Design: Hallazgos preexistentes"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-181
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-181-hallazgos-preexistentes
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
  - STORY-185-tope-de-low-y-arrastres
---

<!-- Referencias -->
[[STORY-181-hallazgos-preexistentes]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-178-adr-guia-de-revision]] · [[STORY-180-story-code-review-lee-review-md]]

# Diseño técnico: Hallazgos preexistentes

## Context

`/story-code-review` bloquea con cualquier `HIGH` o `MEDIUM` de los revisores, aunque el defecto esté en líneas que la historia no tocó. Esta historia añade la categoría PREEXISTENTE: el defecto se informa, pero no cuenta para `max-severity`, para el veredicto ni para `fix-directives.md`. Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `skills/story-code-review/SKILL.md` | 2c (268-274): `$IMPL_FILES` sale de `implement-report.md`, solo con rutas de archivo y sin líneas. 4b (384-392): `$MAX_SEVERITY` = máximo de los `max-severity` del frontmatter de cada informe. 4c (394-408): bloqueante = `HIGH`/`MEDIUM`. 4c.1 (410-453): DoD sobre la tabla consolidada y recálculo. 4e (476-485): lista blanca de los `HIGH`/`MEDIUM`. 4f (487-515): `fix-directives.md`. 4c.2 (466): «No se invoca `git diff` […], manteniendo el orquestador sin lógica de Bash propia». |
| `skills/story-code-review/agents/*.agent.md` | Tabla `## Hallazgos` con columnas `Severidad \| Archivo:Línea \| Descripción \| Recomendación` (p. ej. `tech-lead-reviewer.agent.md:87`). `security-reviewer.agent.md:42`: el agente no ejecuta `git diff` para resolver el alcance. |
| `skills/story-code-review/assets/code-review-report-template.md` | Frontmatter con `verdict` y `max-severity`; `## Resumen` es una tabla de campos (fila `testcases.md`). |
| `skills/story-code-review/evals/evals.json` | 23 casos (TC-001 a TC-023). STORY-177 reserva TC-024 y TC-025, STORY-180 TC-026 a TC-029. |
| Diseño de STORY-178 (ADR-0021, aún no creado) | D-6: PREEXISTENTE es una categoría, no un valor de `max-severity`, y no entra en `fix-directives.md`. Asignación conservadora: solo con evidencia de que el hallazgo está en líneas no tocadas; sin evidencia, conserva su severidad y el informe dice por qué. **El método lo fija este `design.md`** (regla 16, decisión de un solo skill; CR-001 de STORY-178). |
| Diseño de STORY-180 | Paso 4a.1 nuevo (el árbitro excluye lo que pide «No reportar»), severidad efectiva por informe (I-6), fila `Guía de revisión` en `## Resumen`. Su prueba `test/story-code-review-review-md.test.js` fija que los encabezados `##`/`###` de la plantilla no cambian (aserción 4) y que `SKILL.md` no contiene `git show` ni `git diff --name-only` (aserción 5). |
| `skills/story-implement/SKILL.md:119-129` | Precedente de git en un skill: `git status --porcelain` con degradación «Sin control de versiones». |
| `skills/story-complete/scripts/story-complete.js`, `skills/epic-complete/SKILL.md:99-124` | Precedente de motor Node propio del skill (`<CLI_ROOT>/skills/<skill>/scripts/<motor>.js`), que llama a git con `spawnSync`, devuelve un objeto JSON y se prueba con `node:test` sobre repos temporales. |
| Flujo del repo | Las historias se implementan en una rama de épica (`epic/EPIC-28-…`); ningún skill de implementación hace commit; el humano hace commit en los cambios de fase. |

Stack: skills en Markdown, motores Node ≥ 18 sin dependencias, pruebas `node --test test`, evals de simulación (`contains`/`not_contains`) que se ejecutan a criterio humano.

## Goals / Non-Goals

**Goals:**
- Un motor determinista clasifica cada `Archivo:Línea` como `untouched`, `touched` o `unknown` respecto de la base de la rama, y nunca devuelve `untouched` sin evidencia de git. // satisface: AC-1, AC-2, AC-3
- El árbitro marca PREEXISTENTE los hallazgos en líneas `untouched` y los saca de `max-severity`, del veredicto, del DoD y de `fix-directives.md`. // satisface: AC-1, AC-2
- Si no se pueden determinar las líneas tocadas, ningún hallazgo es PREEXISTENTE, el informe dice por qué y el veredicto se calcula como hoy. // satisface: AC-3
- El informe muestra cada PREEXISTENTE en su dimensión y el estado de la clasificación en `## Resumen`, sin cambiar `verdict`, `max-severity` ni las secciones. // satisface: AC-1, AC-3, CNF-1, CNF-2
- Evals antes del skill y una prueba unitaria del motor. // satisface: CNF-3

**Non-Goals:**
- Corregir los defectos preexistentes (historia nueva o `BUG-NNN`).
- Verificación de evidencia y deduplicación (STORY-182); tope de LOW y arrastres entre rondas (STORY-185).
- Cambiar los agentes revisores, su formato de informe o la regla 4 de la sección «Guía de revisión» de STORY-180: los revisores siguen reportando con severidad; el árbitro clasifica.
- Cambiar `story-implement` o `story-implement-tasks` (por ejemplo, para registrar una base o rangos de línea en `implement-report.md`).
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Motor de líneas tocadas | crear | `skills/story-code-review/scripts/touched-lines.js` | AC-1, AC-2, AC-3 |
| C-2 | Orquestador | modificar | `skills/story-code-review/SKILL.md`: «Qué hace», `## Dependencias`, Paso 0 (`CLI_ROOT`), Paso 4a.2 nuevo, Pasos 4b, 4c, 4c.1, 4c.2 (frase sobre git), 4e, 5b (`{{PREEXISTING_STATUS}}`, celda de severidad, `{{DECISION_RATIONALE}}`), Paso 7 (línea de resumen) y manejo de errores | AC-1, AC-2, AC-3, CNF-2 |
| C-3 | Plantilla del informe | modificar (una fila en `## Resumen`) | `skills/story-code-review/assets/code-review-report-template.md` | AC-1, AC-3, CNF-2 |
| C-4 | Evals del skill | modificar (cuatro casos nuevos) | `skills/story-code-review/evals/evals.json` | AC-1, AC-2, AC-3, CNF-3 |
| C-5 | Prueba del motor y del contrato | crear | `test/story-code-review-preexisting.test.js` | AC-1, AC-2, AC-3, CNF-2 |
| C-6 | README del skill | modificar (una frase en «What it does») | `skills/story-code-review/README.md` | AC-1 |

Sin cambios: `agents/*.agent.md`, `assets/fix-directives-template.md` (las filas siguen siendo solo bloqueantes), `docs/guardrails/`, `docs/adr/`, `package.json` (`files` ya publica `skills/`) y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — CLI del motor | `node <CLI_ROOT>/skills/story-code-review/scripts/touched-lines.js classify --repo-root <REPO_ROOT> --locations <archivo.json>`. `<archivo.json>`: arreglo JSON de cadenas `Archivo:Línea`. Exit `0` con un único objeto JSON en stdout (también si la clasificación no se aplica); exit `2` ante argumentos inválidos o JSON ilegible, con el error en stderr. No escribe archivos ni lee stdin. | AC-1 a AC-3 |
| I-2 — Salida del motor | `{ ok: true, applied: <bool>, reason: <código> \| null, message: <texto> \| null, baseRef: <ref> \| null, base: <sha> \| null, locations: [ { location, file, start, end, status, why } ] }`. `status ∈ {untouched, touched, unknown}`. Con `applied: false`, `locations` es `[]`. | AC-1 a AC-3 |
| I-3 — Códigos de `reason` | `git-unavailable`, `not-a-repo`, `detached-head`, `no-main-branch`, `on-main-branch`, `no-merge-base`. El orquestador añade `engine-unavailable` (motor o `node` no encontrados). Cada uno tiene un `message` fijo (Esquema de datos). | AC-3 |
| I-4 — Funciones exportadas | `parseLocation(text)`, `touchedLines(diffText)`, `resolveBase(repoRoot)`, `classifyLocations({ repoRoot, locations })`, para las pruebas (patrón de `story-complete.js`). | CNF-3 |
| I-5 — `$PREEXISTING_CHECK`, `$PREEXISTING_REASON`, `$PREEXISTING_BASE` (Paso 4a.2) | `applied` \| `unavailable`; el `message` del motor (o del orquestador) si `unavailable`; `<baseRef>@<sha de 7 caracteres>` si `applied`. | AC-1, AC-3 |
| I-6 — `$PREEXISTING` (Paso 4a.2) | Lista de `(revisor, Archivo:Línea, severidad original, descripción)` de los hallazgos clasificados PREEXISTENTE. Vacía si `$PREEXISTING_CHECK = unavailable`. | AC-1, AC-2 |
| I-7 — Severidad efectiva por informe (Paso 4b) | Amplía la I-6 de STORY-180: si 4a.1 y 4a.2 no apartaron ningún hallazgo de un informe, su severidad es su `max-severity`; si apartaron alguno, es la máxima de los que conserva, o `ninguna`. | AC-1, AC-2, AC-3 |
| I-8 — `{{PREEXISTING_STATUS}}` y celda de severidad (Paso 5b) | Valor de la fila `Hallazgos preexistentes` de `## Resumen` y celda `Severidad` reescrita como `🟣 PREEXISTENTE (<severidad original>)` en la tabla de la dimensión (Esquema de datos). | AC-1, AC-3, CNF-2 |

## Decisions

### D-1 — Método: diff de git contra la base de la rama, en un motor Node // satisface: AC-1, AC-2, AC-3

Una línea la tocó la historia si cambió entre la **base de la rama** y el **working tree**. La base es `git merge-base HEAD <rama principal>`; el diff `git diff -U0 <base> -- <archivo>` incluye a la vez los commits de la rama y los cambios sin commit (staged y unstaged). Lo calcula el motor C-1 (patrón de `story-complete.js`), no el LLM.

El método da un **superconjunto** de las líneas de la historia: en una rama de épica incluye también las líneas que tocaron sus historias hermanas. Ese error va en el sentido seguro: una línea de una historia hermana cuenta como tocada, el hallazgo conserva su severidad y el veredicto es el de hoy. Nunca hace pasar una línea de la historia por no tocada mientras la historia se implemente fuera de la rama principal.

| Alternativa | Motivo del rechazo |
|---|---|
| `git diff HEAD` (solo cambios sin commit) | Si el humano hace commit entre `IMPLEMENT` y `CODE-REVIEW` (cambio de fase), las líneas de la historia desaparecen del diff y sus defectos pasarían por PREEXISTENTE: oculta defectos propios, contra la asignación conservadora de ADR-0021 (D-6). |
| Rangos de línea declarados en `implement-report.md` | Cambia el contrato de `story-implement` y `story-implement-tasks` (Non-Goal) y depende de que un LLM informe bien sus propios rangos: no es evidencia. |
| Solo por archivo (PREEXISTENTE si el archivo no está en `$IMPL_FILES`) | No cumple AC-1 ni AC-2, que hablan de líneas dentro de un archivo del alcance; y un `implement-report.md` incompleto marcaría como preexistente un archivo que la historia sí cambió. |
| Que el LLM ejecute git y lea los hunks en prosa (sin motor) | La aritmética de hunks, rangos y rutas de Windows es donde un error convierte una línea tocada en no tocada; en prosa no se puede probar con `npm test`. |

### D-2 — Resolución de la base y casos sin evidencia // satisface: AC-3

El motor resuelve la base en este orden y devuelve `applied: false` con el primer `reason` que aplique:

1. `git --version` falla → `git-unavailable`; `git rev-parse --show-toplevel` falla en `--repo-root` → `not-a-repo`.
2. Rama actual: `git symbolic-ref --short -q HEAD`; vacía → `detached-head`.
3. Rama principal: destino de `refs/remotes/origin/HEAD` si existe (p. ej. `origin/main`); si no, `main` local; si no, `master` local. Ninguna → `no-main-branch`.
4. Si la rama actual es la rama principal (mismo nombre corto, p. ej. `main` frente a `origin/main`) → `on-main-branch`: en la rama principal no hay base que separe los cambios de la historia de los ya integrados.
5. `git merge-base HEAD <rama principal>` falla → `no-merge-base`.

| Alternativa | Motivo del rechazo |
|---|---|
| En la rama principal, usar `git diff HEAD` | Mismo defecto que `git diff HEAD` en D-1: si la historia ya tiene commits, sus líneas pasan por no tocadas. AC-3 pide no clasificar cuando no hay evidencia. |
| Clave nueva `review.base-branch` en `sddf.config.yaml` | Ninguna historia la necesita hoy (YAGNI) y añade un contrato de configuración (`verify:config`). Es el punto de cambio natural si un proyecto usa otra rama principal (F-5). |
| Pedir la base al usuario | El skill corre también en modo Agent, sin interacción. |

### D-3 — Reglas de clasificación por `Archivo:Línea` // satisface: AC-1, AC-2

Con `applied: true`, para cada ubicación:

| Situación | `status` |
|---|---|
| No se puede leer como `<ruta>:<N>` o `<ruta>:<N>-<M>` (sin línea, «varios archivos», rango inverso), ruta absoluta o con `..` | `unknown` |
| El archivo no existe en el working tree | `unknown` |
| El archivo no existe en la base (`git cat-file -e <base>:<ruta>` falla): archivo nuevo, renombrado o sin seguimiento | `touched` |
| Alguna línea del rango está entre las líneas tocadas del archivo | `touched` |
| El archivo existe en la base y ninguna línea del rango está tocada | `untouched` |

Líneas tocadas de un archivo: para cada hunk `@@ -a,b +c,d @@` de `git diff -U0 --no-color --no-ext-diff <base> -- <ruta>`, las líneas `c` a `c+d-1` si `d > 0`; si `d = 0` (solo borrado), las líneas `c` y `c+1`, vecinas del punto de borrado, porque un defecto creado al borrar código se cita en la línea contigua. Las rutas se normalizan (relativas a `--repo-root`, separador `/`, sin `./` ni comillas invertidas). Si `git diff` falla para un archivo, sus ubicaciones son `unknown`. Si el archivo difiere entero (p. ej. por finales de línea), todas sus líneas son tocadas: el error vuelve a ir en el sentido seguro.

**Invariante:** `untouched` exige que git pruebe que el archivo existía en la base y que el rango no cambió. Cualquier fallo o duda da `touched` o `unknown`, y ambos conservan la severidad.

| Alternativa | Motivo del rechazo |
|---|---|
| Contar como no tocado el vecino de un borrado | Oculta el caso típico «se borró la validación de la línea 41»: el revisor cita la 41 o la 42. |
| Rango parcialmente tocado → PREEXISTENTE | El defecto puede estar justo en la parte tocada; ADR-0021 exige evidencia de todo el hallazgo. |

### D-4 — El árbitro clasifica en un Paso 4a.2, con una regla de causa // satisface: AC-1, AC-2, AC-3

Nuevo Paso 4a.2, tras 4a.1 de STORY-180 (exclusiones de «No reportar») y antes de 4b:

1. Reunir el `Archivo:Línea` de cada hallazgo (`HIGH`, `MEDIUM` o `LOW`) de los informes válidos que 4a.1 no excluyó. Los hallazgos `DoD-CODE-REVIEW` nunca se clasifican: citan el DoD, no el código.
2. Escribir esas ubicaciones en `.tmp/story-code-review/{story_id}/locations.json` e invocar el motor (I-1).
3. Si el motor o `node` no se encuentran, el exit no es `0` o la salida no es el JSON de I-2: `$PREEXISTING_CHECK = unavailable` con `engine-unavailable`. Si `applied: false`: `unavailable` con el `message` del motor. En ambos casos, ningún hallazgo es PREEXISTENTE y la revisión sigue sin bloquear.
4. Si `applied: true`: un hallazgo es PREEXISTENTE solo si su ubicación es `untouched` **y** su descripción no atribuye el defecto a un cambio de la historia (p. ej. «la llamada de la línea 10 usa la firma que la historia cambió en la línea 42»). Ante duda, no es PREEXISTENTE (la misma regla de duda de 4c.1). Se registra en `$PREEXISTING` (I-6) con su severidad original.

| Alternativa | Motivo del rechazo |
|---|---|
| Que cada revisor clasifique sus hallazgos | Cuatro resoluciones de la misma base, el revisor no tiene el diff y `security-reviewer.agent.md:42` le prohíbe ejecutar `git diff`. El árbitro ya concentra los filtros (patrón 4a.1 de STORY-180). |
| Solo la regla de línea, sin la regla de causa | Un caller sin tocar que rompe porque la historia cambió una firma quedaría como PREEXISTENTE: es un defecto que la historia introdujo. |
| Clasificar solo `HIGH`/`MEDIUM` | Un `LOW` preexistente también es ruido que la historia no introdujo; la categoría de Claude Code Review no depende de la severidad. |

### D-5 — PREEXISTENTE no cuenta: severidad, veredicto, DoD y `fix-directives.md` // satisface: AC-1, AC-2, CNF-2

- **4b:** severidad efectiva por informe según I-7. Sin hallazgos apartados (por ejemplo, con `$PREEXISTING_CHECK = unavailable` y sin `REVIEW.md`), el cálculo es el de hoy (AC-3).
- **4c:** bloqueante = `HIGH`/`MEDIUM` que no es PREEXISTENTE.
- **4c.1:** los criterios del DoD se evalúan sobre la tabla consolidada sin los PREEXISTENTE; un PREEXISTENTE nunca es evidencia de `❌`. Así, «Sin hallazgo bloqueante de severidad HIGH o MEDIUM» (`docs/guardrails/dod-story-code-review.md:21`) no reintroduce el defecto.
- **4e y 4f:** la lista blanca y la tabla de `fix-directives.md` iteran solo los bloqueantes de 4c, así que un PREEXISTENTE no entra.
- `verdict` conserva sus valores y `max-severity` sigue siendo `HIGH`, `MEDIUM`, `LOW` o `ninguna` (ADR-0021 D-6): PREEXISTENTE es una categoría, no un valor.

| Alternativa | Motivo del rechazo |
|---|---|
| Bajar el PREEXISTENTE a `LOW` | Seguiría contando para `max-severity` y mezclaría la categoría con la severidad, contra ADR-0021 D-6 y CNF-2. |
| Excluirlo del informe | AC-1 y el «Para» piden conservar su visibilidad. |

### D-6 — En el informe: celda de severidad y una fila en `## Resumen` // satisface: AC-1, AC-3, CNF-2

- En la tabla de su dimensión, la celda `Severidad` del hallazgo se reescribe como `🟣 PREEXISTENTE (<severidad original>)`. El hallazgo sigue donde lo reportó el revisor (AC-1: «figura en `code-review-report.md` con la categoría PREEXISTENTE»).
- La plantilla gana la fila `| Hallazgos preexistentes | {{PREEXISTING_STATUS}} |` tras `| Guía de revisión | {{REVIEW_STATUS}} |` (STORY-180); si esa fila no existe al implementar, tras `| testcases.md | {{TESTCASES_STATUS}} |`. Lleva el recuento, la base y, en AC-3, el motivo de no aplicar.
- `{{DECISION_RATIONALE}}` añade, si `$PREEXISTING` no está vacío: «<N> hallazgo(s) PREEXISTENTE en líneas que la historia no tocó no cuentan para el veredicto».
- Frontmatter, encabezados `##`/`###`, valores de `verdict` y significado de `max-severity` no cambian: la aserción 4 de la prueba de STORY-180 sigue en verde.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección nueva `### Hallazgos preexistentes` | Cambia las secciones del informe (CS-2) y rompe la aserción 4 de `test/story-code-review-review-md.test.js`. |
| Mover los PREEXISTENTE a una tabla aparte dentro de `## Resumen` | Separa el hallazgo de la dimensión que lo reportó y del revisor que lo puede explicar. |
| Solo en consola | AC-3 exige que lo diga el informe, que es lo que lee `/story-acceptance`. |

### D-7 — Evals primero: cuatro casos // satisface: AC-1, AC-2, AC-3, CNF-3

Se escriben en `evals.json` antes de modificar el skill (principio 11, CS-8), con el formato de simulación de TC-001 a TC-023 y numeración tras STORY-180 (TC-030 a TC-033; si ya están ocupados, los siguientes libres). Los casos simulan la salida del motor en `input`, como TC-017 simula informes de revisores.

- **TC-030 `hallazgo-preexistente-no-bloquea`** (AC-1, SMOKE-2): `impl_files: ["src/calc.js"]`; `touched_lines_engine: { applied: true, baseRef: "main", base: "abc1234" }`; Tech-Lead: `MEDIUM` en `src/calc.js:10`, `line_status: untouched`; demás revisores sin hallazgos. `contains`: `🟣 PREEXISTENTE (MEDIUM)`, `src/calc.js:10`, `Hallazgos preexistentes`, `(verdict: APPROVED)`, `CODE-REVIEW/DONE`. `not_contains`: `(verdict: NEEDS-CHANGES)`, `📋 Fix directives:`, `READY-FOR-IMPLEMENT`.
- **TC-031 `defecto-en-linea-tocada-bloquea`** (AC-2): igual, con el `MEDIUM` en `src/calc.js:42`, `line_status: touched`. `contains`: `MEDIUM`, `src/calc.js:42`, `(verdict: NEEDS-CHANGES)`, `📋 Fix directives:`. `not_contains`: `🟣 PREEXISTENTE`.
- **TC-032 `lineas-tocadas-no-determinables`** (AC-3): `touched_lines_engine: { applied: false, reason: "on-main-branch" }`; mismo `MEDIUM` en `src/calc.js:10`. `contains`: `clasificación PREEXISTENTE no aplicada`, `rama principal`, `(verdict: NEEDS-CHANGES)`. `not_contains`: `🟣 PREEXISTENTE`, `(verdict: BLOCKED)`.
- **TC-033 `linea-no-tocada-causada-por-la-historia`** (D-4, regla de causa): `HIGH` en `src/calc.js:10`, `line_status: untouched`, descripción «la llamada usa la firma de `sumar` que la historia cambió en `src/calc.js:42`». `contains`: `HIGH`, `(verdict: NEEDS-CHANGES)`. `not_contains`: `🟣 PREEXISTENTE`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo el caso «hallazgo preexistente» de CNF-3 | AC-2 y AC-3 quedarían sin eval, y son los que protegen contra ocultar defectos propios. |
| Casos `sandbox` con un repo git real | Exigen fixture de repo y cuatro subagentes reales: caro. La mecánica de git la cubre C-5 en cada `npm test`. |

### D-8 — Prueba unitaria del motor y del contrato // satisface: AC-1, AC-2, AC-3, CNF-2

`test/story-code-review-preexisting.test.js` (`node:test`, repos git temporales como `test/story-complete.test.js`, nunca el repo real):

1. Rama `epic/x` desde `main`: línea sin tocar → `untouched`; línea modificada, línea añadida y vecina de un borrado → `touched` (AC-1, AC-2).
2. Una línea cambiada en un commit de la rama y otra sin commit → ambas `touched` (D-1).
3. Archivo nuevo, con y sin seguimiento → `touched`; rango parcialmente tocado → `touched` (D-3).
4. `Archivo` sin línea, ruta con `..`, archivo inexistente → `unknown`; ruta con `\` → se normaliza (D-3).
5. En `main` → `applied: false, reason: on-main-branch`; sin repo → `not-a-repo`; HEAD separado → `detached-head`; sin `main`, `master` ni `origin/HEAD` → `no-main-branch` (AC-3).
6. CLI: exit `0` con JSON de I-2; exit `2` sin `--locations` o con JSON ilegible (I-1).
7. Contrato: `SKILL.md` contiene `PREEXISTENTE`, `touched-lines.js` y `{{PREEXISTING_STATUS}}`, y no contiene `git show` ni `git diff --name-only` (compatibilidad con la aserción 5 de STORY-180); la plantilla contiene `{{PREEXISTING_STATUS}}` y no contiene `PREEXISTENTE` en el frontmatter (CNF-2).

| Alternativa | Motivo del rechazo |
|---|---|
| Añadir las aserciones a `test/story-code-review-review-md.test.js` | Acopla esta historia a la de STORY-180; un archivo por contrato, como decidió STORY-180 frente a STORY-177. |
| Solo evals | Se ejecutan a criterio humano; la invariante de D-3 es lo que más importa proteger y debe correr en cada gate. |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

**Variables nuevas del orquestador (Paso 4a.2):**

| Variable | Valores |
|---|---|
| `$PREEXISTING_CHECK` | `applied` \| `unavailable` |
| `$PREEXISTING_REASON` | `""` \| `message` de I-3 |
| `$PREEXISTING_BASE` | `""` \| `<baseRef>@<sha7>` |
| `$PREEXISTING` | lista de `(revisor, Archivo:Línea, severidad original, descripción)` |

**`message` por `reason` (I-3):**

| `reason` | `message` |
|---|---|
| `git-unavailable` | `git no está disponible` |
| `not-a-repo` | `el directorio no es un repositorio git` |
| `detached-head` | `HEAD separado: no hay rama que comparar con la rama principal` |
| `no-main-branch` | `no se encontró la rama principal (origin/HEAD, main o master)` |
| `on-main-branch` | `la revisión corre en la rama principal: no hay base que separe los cambios de la historia` |
| `no-merge-base` | `no hay ancestro común con la rama principal` |
| `engine-unavailable` | `no se encontró el motor touched-lines.js o node` |

**`{{PREEXISTING_STATUS}}`:**

| Condición | Texto |
|---|---|
| `applied`, `$PREEXISTING` vacío | `✓ clasificación aplicada (base: <$PREEXISTING_BASE>) — sin hallazgos PREEXISTENTE` |
| `applied`, `$PREEXISTING` con N | `🟣 <N> hallazgo(s) PREEXISTENTE (base: <$PREEXISTING_BASE>): <Archivo:Línea (revisor, severidad)>, … — no cuentan para max-severity ni para fix-directives.md` |
| `unavailable` | `⚠️ clasificación PREEXISTENTE no aplicada: <$PREEXISTING_REASON> — los hallazgos conservan su severidad` |

**Celda `Severidad` de un PREEXISTENTE en su dimensión:** `🟣 PREEXISTENTE (<HIGH | MEDIUM | LOW>)`.

**Consola, Paso 7** (línea nueva tras `Severidad máxima:`): ` Preexistentes:    <N> (no cuentan)` o ` Preexistentes:    ⚠️ no aplicado — <$PREEXISTING_REASON>`.

**`locations.json`:** arreglo JSON de cadenas, p. ej. `["src/calc.js:10", "src/calc.js:40-45"]`. Vive en `.tmp/story-code-review/{story_id}/` y se borra con el resto en el Paso 3a de la siguiente ejecución.

## Flujos clave

### F-1 — Defecto preexistente (escenario principal) // AC-1

1. Pasos 1-4a sin cambio; 4a.1 (STORY-180) no excluye nada.
2. 4a.2 escribe `locations.json` con `src/calc.js:10` e invoca el motor en la rama `epic/…`.
3. El motor resuelve la base (D-2), lee el diff de `src/calc.js` y devuelve `untouched` para la línea 10.
4. La descripción no atribuye el defecto a la historia → PREEXISTENTE; `$PREEXISTING` = 1.
5. 4b: el informe del Tech-Lead tiene severidad efectiva `ninguna`; 4c: sin bloqueantes → `APPROVED`; 4c.1 no usa el PREEXISTENTE como evidencia; 4h borra un `fix-directives.md` residual si lo hay.
6. 5b: celda `🟣 PREEXISTENTE (MEDIUM)`, fila `Hallazgos preexistentes` con N = 1, `max-severity: ninguna`; Paso 6: `CODE-REVIEW/DONE`.

### F-2 — Defecto en una línea tocada // AC-2

Igual hasta el paso 3: el motor devuelve `touched` para la línea 42. El hallazgo conserva `MEDIUM`; 4c → `NEEDS-CHANGES`; 4e-4f lo incluyen en `fix-directives.md`; 4g → `READY-FOR-IMPLEMENT/DONE`.

### F-3 — Líneas tocadas no determinables // AC-3

El motor devuelve `applied: false` (p. ej. `on-main-branch`), o no se encuentra. `$PREEXISTING_CHECK = unavailable`, ningún hallazgo es PREEXISTENTE, 4b usa los `max-severity` de los informes (igual que hoy) y la fila `Hallazgos preexistentes` dice el motivo. El veredicto es el que daría el skill sin esta historia.

### F-4 — Degradación // P7

- **git ausente, no es repo, HEAD separado, sin rama principal, sin ancestro común:** F-3 con su `reason`.
- **Motor ausente en una copia instalada desactualizada, o `node` ausente:** F-3 con `engine-unavailable`; se corrige reinstalando.
- **`git diff` falla para un archivo:** sus ubicaciones son `unknown`; el resto se clasifica.
- **Un revisor no da línea:** `unknown`, conserva la severidad. Exigir `Archivo:Línea` a los revisores es STORY-182 (CNF-3).
- **Revisión `BLOCKED`:** 4a.2 corre igual sobre los informes válidos; la precedencia de G-05 no cambia.

### F-5 — Puntos de cambio // P6

- **Otra rama principal o una base explícita:** solo cambia `resolveBase` (D-2); una opción `--base <ref>` del motor o una clave de configuración no tocan al árbitro.
- **STORY-185 (LOW sin tocar por el rework):** puede reutilizar `touchedLines` y `classifyLocations` con otra base (la de la ronda anterior), sin cambiar la interfaz I-2.
- **STORY-182 (verificación y deduplicación):** se inserta en el mismo tramo, entre 4a y 4b; el orden recomendado es 4a.1 → 4a.2 → verificación y deduplicación, para que un hallazgo fusionado herede la clasificación más severa (si una de sus ubicaciones es `touched`, no es PREEXISTENTE).

## Decisiones de complejidad justificada

- **Motor Node en vez de prosa (D-1):** la seguridad de la historia depende de una invariante (nunca `untouched` sin evidencia) que solo se puede probar si el cálculo es código; hay precedente (`story-complete.js`, `epic-complete.js`) y cabe en un archivo con cuatro funciones.
- **Base de la rama en vez de `git diff HEAD` (D-1, D-2):** el método más simple oculta defectos propios en cuanto hay un commit; el superconjunto de la rama solo cuesta clasificar menos PREEXISTENTE, nunca un defecto oculto.
- **Regla de causa en el árbitro (D-4):** una línea no tocada no basta para decir que la historia no introdujo el defecto; la regla cabe en una frase y usa la regla de duda que el árbitro ya aplica en 4c.1.
- **`on-main-branch` desactiva la clasificación (D-2):** pierde la categoría en flujos trunk-based, pero aplicarla allí exige una base que el skill no tiene; el aviso del informe lo hace visible.
- **Fila en `## Resumen` y celda reescrita (D-6):** el cambio mínimo que muestra la categoría sin tocar secciones ni frontmatter; sigue el patrón de STORY-180.
- **Cuatro evals en vez de uno (D-7):** TC-031 a TC-033 protegen contra el riesgo principal (ocultar un defecto propio).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Un defecto en línea no tocada es PREEXISTENTE, `APPROVED`, sin `fix-directives.md` | TC-030; C-5 aserción 1 (`untouched`) | AC-1 |
| 2 | `max-severity` excluye los PREEXISTENTE | TC-030 (`max-severity: ninguna` con un único `MEDIUM` PREEXISTENTE); `SKILL.md` 4b remite a I-7 | AC-1 |
| 3 | El mismo defecto en línea tocada conserva `MEDIUM`, `NEEDS-CHANGES` y entra en `fix-directives.md` | TC-031; C-5 aserciones 1 y 2 (`touched`) | AC-2 |
| 4 | Sin base determinable: ningún PREEXISTENTE, motivo en el informe, veredicto de hoy | TC-032; C-5 aserción 5 | AC-3 |
| 5 | El motor nunca devuelve `untouched` sin evidencia | C-5 aserciones 3 y 4 (archivo nuevo, rango parcial, sin línea, fallo de diff) | AC-1, AC-2 |
| 6 | Una línea no tocada cuyo defecto causó la historia no es PREEXISTENTE | TC-033 | AC-2 |
| 7 | Categoría en la plantilla sin cambiar `verdict`, `max-severity` ni secciones | C-5 aserción 7; prueba de STORY-180 (aserción 4) en verde; `git diff` de la plantilla muestra solo la fila nueva | CNF-2 |
| 8 | Vocabulario de ADR-0021 | `🟣 PREEXISTENTE` en `SKILL.md` y en la fila de la plantilla, igual que la tabla D-6 de ADR-0021 | CNF-1 |
| 9 | Evals escritos antes del skill | Orden de tareas en `tasks.md`; TC-030 a TC-033 existen antes de editar `SKILL.md` | CNF-3 |
| 10 | Gate verde | `npm run verify:repository` y `npm test` con código 0 | CS-8 |

## Risks / Trade-offs

- **[Riesgo] Un revisor cita la línea equivocada** (la línea sin tocar en vez de la tocada) → el defecto pasaría por PREEXISTENTE. Mitigación: la regla de causa de D-4 y la lista de PREEXISTENTE en `## Resumen`, que `/story-acceptance` revisa; exigir evidencia precisa es STORY-182.
- **[Riesgo] La historia se implementa directamente en la rama principal** → `on-main-branch`, sin clasificación: más rondas, nunca defectos ocultos. Documentado en el informe.
- **[Trade-off] En una rama de épica, las líneas de las historias hermanas cuentan como tocadas** → un defecto de una historia hermana bloquea, como hoy. Es el precio del superconjunto (D-1).
- **[Trade-off] El skill pasa a ejecutar git** a través del motor → contradice la frase de 4c.2 («sin lógica de Bash propia»), que se reescribe para decir que el único uso de git es el motor del Paso 4a.2. La lectura de `REVIEW.md` y la detección de reglas modificadas siguen sin git (ADR-0021 D-4 y D-5).
- **[Limitación] Copias instaladas sin el motor** → `engine-unavailable` hasta reinstalar.
- **[Conflicto de edición] STORY-180 edita los mismos Pasos 4a-4b, 5b y la plantilla** → esta historia se implementa después (Notas de la historia); si STORY-180 no está implementada, 4a.2 se inserta tras 4a y la fila tras `testcases.md`.

## Open Questions

Ninguna. El método que ADR-0021 (D-6) delega en este diseño queda fijado en D-1 a D-3.

## Autoevaluación (P9, P10)

- **Omisiones:** los tres AC y los tres CNF tienen decisión y contrato de verificación (AC-1: D-1, D-3 a D-6; AC-2: D-3 a D-5; AC-3: D-2, D-4, D-6; CNF-1: D-6; CNF-2: D-5, D-6, D-8; CNF-3: D-7).
- **Ambigüedad:** «líneas que la historia no tocó» se fija como «sin cambio entre la base de la rama y el working tree» (D-1), con el superconjunto declarado; «no se pueden identificar» se fija como los siete `reason` de I-3.
- **Nombres:** «PREEXISTENTE», «árbitro», «revisor», «base», «working tree», «líneas tocadas» (`touched-lines.js`, `touched`/`untouched`) se usan igual en la historia, ADR-0021 y el diseño de STORY-180; las variables siguen el estilo `$REVIEW_PATH`/`{{REVIEW_STATUS}}`.
- **Estructura:** sin ciclos: el árbitro invoca al motor y lee su JSON; el motor solo lee git y el working tree. El motor tiene una responsabilidad (clasificar ubicaciones) y el árbitro conserva la decisión de veredicto. El documento no contiene código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-3 de `story.md` remite al «método que fija el ADR de la guía de revisión», y las Notas dicen que el ADR decide cómo identificar las líneas no tocadas. El diseño de STORY-178 (D-6 y su CR-001) delega ese método en este `design.md`, que lo fija en D-1 a D-3 dentro de la regla conservadora del ADR.
- **Documento afectado**: `specs/flow/STORY-181-hallazgos-preexistentes/story.md`
- **Acción requerida**: en AC-3, cambiar «con el método que fija el ADR de la guía de revisión» por «con el método que fija el `design.md` de STORY-181 conforme a ADR-0021»; en Notas, cambiar «el ADR decide cómo identificar las líneas no tocadas» por «ADR-0021 fija la regla conservadora y este diseño, el método».

### CR-002
- **Tipo**: dependencia
- **Descripción**: el diseño introduce git en `story-code-review` (motor del Paso 4a.2). La frase del Paso 4c.2 «manteniendo el orquestador sin lógica de Bash propia» y la nota (b) de la épica («hoy el skill no usa `git diff`») dejan de describir el skill tal cual.
- **Documento afectado**: `skills/story-code-review/SKILL.md` (al implementar)
- **Acción requerida**: reescribir la frase de 4c.2 como parte de C-2; la épica no se edita (su nota describe el estado de partida).
