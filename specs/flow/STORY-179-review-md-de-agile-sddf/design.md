---
alwaysApply: false
type: design
id: STORY-179
slug: STORY-179-review-md-de-agile-sddf-design
title: "Design: REVIEW.md de agile-sddf"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-179
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-179-review-md-de-agile-sddf
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
---

<!-- Referencias -->
[[STORY-179-review-md-de-agile-sddf]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-178-adr-guia-de-revision]] · [[gr-ai-security-checklist]]

# Diseño técnico: REVIEW.md de agile-sddf

## Context

La historia es un `chore` documental: crea `REVIEW.md` en la raíz desde `docs/templates/REVIEW-template.md`, con las reglas propias de este repo. No modifica los agentes de `story-code-review` ni hace que el skill lea el archivo (Non-Goals, STORY-180).

Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `REVIEW.md` | No existe. |
| `docs/templates/REVIEW-template.md` | Comentario de uso (líneas 1-17), H1 `# REVIEW.md — Guía de revisión de [nombre del proyecto]`, dos líneas de introducción (21-22, la segunda con el vocabulario) y cuatro secciones `##`: `Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM` (24), `Tope de Minor — 🟡 Minor · LOW` (38), `No reportar` (44) y `Verificar siempre` (55). Placeholders entre corchetes (`[ruta o glob del área]`, `[5]`…) y comentarios `<!-- instrucción: … -->`. «Verificar siempre» usa casillas `- [ ]`. |
| `specs/flow/STORY-178-adr-guia-de-revision/design.md` (D-6) | Vocabulario del futuro ADR-0021: 🔴 Important = `HIGH` o `MEDIUM` (bloquea), 🟡 Minor = `LOW`, 🟣 Pre-existing = `PREEXISTENTE` (categoría, no severidad). Coincide con la línea 22 de la plantilla. ADR-0021 aún no existe (STORY-178 en PLAN). |
| `.temp/propuestas-de-mejoras/mejora-015-REVIEW.md:60-90` | Borrador de `REVIEW.md` para este repo, fuente del contenido. |
| `skills/story-code-review/agents/integration-reviewer.agent.md:48-49` | «un solo nivel de delegación» y «Principio 6 de constitution.md» para la escritura en `.tmp/`: las reglas propias del repo que recoge AC-2. |
| `scripts/verify-repository.js:12-31` | Los 14 pasos del gate: `node --test test`, sintaxis Node, layout fijo, perfiles, runtimes documentados, configuración YAML, inventario de evals, contrato de validación, enlaces activos, cadena de suministro, workflow de seguridad de skills, release, `npm pack --dry-run` y smoke del tarball. |
| `scripts/` y `test/` | Ningún paso del gate busca caracteres invisibles: solo `test/epic-complete.test.js:31` comprueba U+FEFF, y solo en las fuentes de `epic-complete`. `verify-eval-inventory.js` comprueba que cada skill tenga evals o una excepción, no que se actualicen cuando cambia el comportamiento. Nada comprueba el idioma. |
| `scripts/verify-runtime-documentation.js:17-27` | Busca rutas de layout de runtime en `README.md`, `SECURITY.md`, `AGENTS.md`, `docs/index.md`, `docs/constitution.md`, `docs/policies`, `docs/guardrails`, `docs/guides` y `docs/runbooks`, y exige que esos archivos citen `config/runtimes.json`. No revisa `skills/` ni `scripts/`, ni tampoco `REVIEW.md`. El borrador de la mejora («el gate solo vigila el README») está desactualizado. |
| `scripts/verify-validation-contract.js:300-303` | Revisa **todos** los `*.md` de la raíz, así que también revisará `REVIEW.md`, y falla con `APROBADA`, `Aprobada`, `review-status` o `approved` en minúsculas (`findLegacyVariants`, líneas 189-208). |
| `scripts/check-doc-links.js:17-26` | Sus `ACTIVE_ROOTS` no incluyen `REVIEW.md`: el gate no comprueba sus enlaces ni sus rutas. |
| `.gitignore` | Ignora `.claude` (4), `.github/*` salvo `workflows/` (6), `.agents` (9), `.opencode` (11), `.tmp` (24), `node_modules` (36) y `graphify-out/` (62). `git ls-files` da 0 archivos versionados en `.claude/`, `.agents/`, `.github/skills/`, `graphify-out/` y `.tmp/`; `specs/flow/archive/` tiene 918. |
| Fixtures | `git ls-files 'skills/*/examples/*'` da 341 archivos y `'skills/*/evals/*'` da 45. |
| `config/runtimes.json` | Destinos `.claude`, `.opencode`, `.github`, `.agents` y `.config/opencode`. `.agents` es destino de skills de `codex`, nunca de los agentes Markdown (AGENTS.md). |
| `scripts/cli.js:18,53` | `--force` es el único modo de sobrescribir archivos existentes. |
| `package.json:22-29` | `files`: `skills/`, `config/`, `scripts/`, `sddf.config.yaml`, `README.md` y `LICENSE`. Ninguna entrada alcanza a `REVIEW.md`. |
| `docs/architecture/tech-stack.md:99` | `quality.yml` ejecuta `verify:repository` en Windows, macOS y Linux. |

Stack: documentación Markdown en español y pruebas `node:test` (CommonJS) en `test/`.

## Goals / Non-Goals

**Goals:**

- `REVIEW.md` en la raíz con el H1, la introducción y las cuatro secciones de la plantilla, en su orden, sin comentarios ni placeholders, sin sección de formato y con tope de 5 LOW. // satisface: AC-1
- Cada regla de la tabla de AC-2 en una sola sección, la indicada. // satisface: AC-2
- «Verificar siempre» solo con comprobaciones que el gate no ejecuta; «No reportar» excluye lo que el gate ya comprueba; toda ruta citada existe o está ignorada por `.gitignore`. // satisface: AC-3
- Doble vocabulario en las cuatro secciones, con la traducción de ADR-0021 (STORY-178, D-6). // satisface: CNF-1
- Fijar la forma de `REVIEW.md` con una prueba unitaria que entra en `npm test`. // satisface: AC-1, AC-2, AC-3, CNF-2, CNF-3, CNF-4

**Non-Goals:**

- Modificar los agentes de `story-code-review` o hacer que el skill lea `REVIEW.md` (STORY-180).
- La mecánica de PREEXISTENTE, la verificación de evidencia, la deduplicación y la aplicación del tope (STORY-181, STORY-182, STORY-185). `REVIEW.md` solo declara las reglas.
- La semilla para consumidores y la copia de la plantilla en `skills/sddf-constitution/assets/` (STORY-184).
- Modificar `docs/templates/REVIEW-template.md`, `package.json`, `AGENTS.md`, `docs/index.md` o cualquier script del gate.
- Activar Claude Code Review en GitHub.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Guía de revisión de agile-sddf | crear | `REVIEW.md` (raíz) | AC-1, AC-2, AC-3, CNF-1, CNF-2, CNF-3 |
| C-2 | Prueba de forma de la guía | crear | `test/review-md.test.js` | AC-1, AC-2, AC-3, CNF-2, CNF-3, CNF-4 |

Sin cambios: la plantilla, los agentes, `package.json` (CNF-2 se cumple sin tocarlo), `.gitignore`, `docs/` y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — Estructura de `REVIEW.md` | En este orden: H1 `# REVIEW.md — Guía de revisión de agile-sddf`; las dos líneas de introducción de la plantilla (21-22) sin cambios; y exactamente cuatro encabezados `##`, con el texto literal de la plantilla: `Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM`, `Tope de Minor — 🟡 Minor · LOW`, `No reportar` y `Verificar siempre`. Sin `<!--`, sin placeholders entre corchetes y sin otros `##`. Las casillas `- [ ]` de «Verificar siempre» y los enlaces `[texto](url)` no cuentan como placeholders. | AC-1 |
| I-2 — Viñetas de «Qué es «Importante» aquí» | Seis viñetas de primer nivel, en este orden, que empiezan por `` `skills/` ``, `` `scripts/` ``, `` `docs/adr/` ``, `` `docs/templates/` ``, `` `docs/guardrails/` `` y `Cualquier archivo`. Cada defecto va en una subviñeta. | AC-1 |
| I-3 — Doble vocabulario | Cada sección contiene al menos un término de Claude Code Review seguido de su traducción, según ADR-0021: `🔴 Important` con `HIGH/MEDIUM`, `🟡 Minor` con `LOW` y `🟣 Pre-existing` con `PREEXISTENTE`. Ningún término aparece sin su traducción. | CNF-1 |
| I-4 — Marcadores de las reglas de AC-2 | Cada fila de AC-2 tiene un marcador literal que aparece en una sola sección de `REVIEW.md`, la indicada (tabla en D-3). C-2 comprueba los marcadores. | AC-2 |
| I-5 — Ruta citada | Un tramo entre comillas invertidas con `/` y sin espacios es una ruta de repositorio. Si contiene `*`, se comprueba el prefijo anterior al primer `*`. La ruta existe (`fs.existsSync`) o `git check-ignore -q` la reconoce como ignorada. | AC-3 |

## Decisions

### D-1 — Copia literal de la estructura de la plantilla // satisface: AC-1, CNF-1

`REVIEW.md` conserva el H1 (con `agile-sddf` en lugar del placeholder), las dos líneas de introducción y los cuatro encabezados de la plantilla sin cambiar ni un carácter. Borra el comentario de uso y los `<!-- instrucción -->`. El tope es `Máximo **5** 🟡 Minor (LOW) por revisor`.

| Alternativa | Motivo del rechazo |
|---|---|
| Encabezados propios (p. ej. «Áreas críticas») | Rompe la convención de Claude Code Review y el contrato que STORY-180 va a leer. La plantilla ya los fija. |
| Conservar los comentarios de la plantilla como ayuda | AC-1 los prohíbe, y la plantilla pide borrarlos (línea 16). |

### D-2 — «Qué es «Importante» aquí»: qué candidatos entran // satisface: AC-1, AC-2

| Viñeta | Subviñetas (defectos 🔴 Important) | Fuente |
|---|---|---|
| `` `skills/` `` (`SKILL.md`, `agents/*.agent.md`, `assets/agents/`) | contrato roto entre un skill y su subagente: variables del bloque de contexto o frontmatter del informe parcial; **un subagente escribe su informe fuera de la ruta de `.tmp/` que lee su skill**; **un subagente delega en otro subagente o invoca un skill orquestador**; una transición de `status`/`substatus` que el ciclo de vida del skill no declara | borrador L63-65; AGENTS.md; `integration-reviewer.agent.md:48-49` |
| `` `scripts/` `` | escribe fuera de `REPO_ROOT` o de los destinos de `config/runtimes.json`; instala agentes Markdown en `.agents`; sobrescribe un archivo existente sin `--force` | borrador L66-67; AGENTS.md; `cli.js:53` |
| `` `docs/adr/` `` | **un ADR aceptado se edita in place** en lugar de reemplazarse con un ADR nuevo (`superseded-by`) | AGENTS.md; borrador L68 |
| `` `docs/templates/` `` | un cambio de forma (sección, clave de frontmatter, placeholder) que rompe al skill que lee o copia la plantilla | borrador L69 |
| `` `docs/guardrails/` `` | un cambio de forma (líneas de criterio `- [ ]`, `enforcement` del frontmatter, `rule-id`) que rompe a los skills que lo resuelven | borrador L69; `dod-story-plan.md` |
| Cualquier archivo | un secreto o credencial real versionado; documentación que describe algo que no existe en el filesystem | borrador L70; AGENTS.md (Veracidad) |

Cierra con las dos líneas de la plantilla (35-36): un 🔴 Important exige `archivo:línea` y un escenario de fallo concreto; estilo, nombres y refactors, 🟡 Minor (LOW) como máximo.

Se excluyen del borrador:
- **«carácter invisible»** en «Cualquier archivo»: AC-2 lo pone solo en «Verificar siempre».
- **«rutas no portables a Windows»**: `quality.yml` ya ejecuta el gate en Windows (`tech-stack.md:99`). Lo que las pruebas no ejercitan tampoco lo detecta un revisor sin evidencia.

| Alternativa | Motivo del rechazo |
|---|---|
| Copiar el borrador tal cual | Duplica el carácter invisible en dos secciones (contradice AC-2) y une `docs/templates/` y `docs/guardrails/` en una viñeta (AC-1 pide una por área). |
| Una sola viñeta por área con los defectos separados por `;` | En `skills/` quedan cuatro defectos en una línea, y C-2 no podría situar los marcadores de AC-2. Las subviñetas mantienen «una viñeta por área» y dejan cada regla aislada. |

### D-3 — Una regla, una sección, un marcador // satisface: AC-2

| Regla de AC-2 | Sección | Marcador literal (I-4) |
|---|---|---|
| un subagente delega en otro subagente o invoca un skill orquestador | Qué es «Importante» aquí | `delega en otro subagente` |
| un subagente escribe su informe fuera de la ruta de `.tmp/` que lee su skill | Qué es «Importante» aquí | `fuera de la ruta de` |
| un ADR aceptado se edita in place | Qué es «Importante» aquí | `in place` |
| secretos falsos intencionados en `skills/*/examples/` y `skills/*/evals/` | No reportar | `skills/*/examples/` |
| copias de instalación `.claude/`, `.github/skills/`, `.agents/` usadas como fuente de reglas | No reportar | `fuente de reglas` |
| caracteres invisibles por bytes (`ai-no-hidden-characters`) | Verificar siempre | `ai-no-hidden-characters` |
| `evals/evals.json` actualizado cuando cambia el comportamiento de un skill | Verificar siempre | `evals/evals.json` |

El secreto real (🔴 Important, «Cualquier archivo») y el secreto falso de los fixtures («No reportar») son reglas distintas. La subviñeta del secreto real dice «real» y no cita `skills/*/examples/`, para que el marcador aparezca una sola vez. `.agents` aparece en `scripts/` como destino prohibido de agentes y en «No reportar» como copia de instalación. Tampoco es la misma regla, y el marcador de la fila de copias es `fuente de reglas`, no la ruta.

| Alternativa | Motivo del rechazo |
|---|---|
| Comprobar AC-2 solo a mano | La tabla de AC-2 es la parte del archivo que STORY-180 quitará de los agentes. Si se pierde una regla al editar `REVIEW.md`, nadie lo vería. |
| Usar como marcador la ruta (`.claude/`, `.tmp/`) | La misma ruta aparece legítimamente en más de una regla, y la prueba daría falsos positivos. |

### D-4 — «No reportar»: el gate, por categorías; los destinos, como ejemplos de `config/runtimes.json` // satisface: AC-2, AC-3

Viñetas, en este orden:

1. Lo que ya comprueba `npm run verify:repository`, con sus 14 pasos nombrados en una línea (pruebas `node --test test`, sintaxis Node, layout fijo, perfiles, runtimes documentados, configuración YAML, inventario de evals, contrato de validación, enlaces de la documentación activa, cadena de suministro, workflow de seguridad de skills, release, contenido de `npm pack` y smoke del tarball).
2. Copias de instalación: los destinos que declara `config/runtimes.json` (p. ej. `.claude/`, `.github/skills/`, `.agents/`). No se revisan ni sirven como **fuente de reglas**.
3. Artefactos generados e históricos: `.tmp/`, `graphify-out/` y `specs/flow/archive/`. No se revisan ni sirven como fuente de criterio.
4. Datos falsos intencionados en `skills/*/examples/` y `skills/*/evals/`.
5. Código de terceros: `node_modules/`.
6. Líneas que la historia no tocó → 🟣 Pre-existing (PREEXISTENTE): se informa, no bloquea.

| Alternativa | Motivo del rechazo |
|---|---|
| Listar todos los destinos de instalación (`.opencode/`, `.github/agents/`, `.config/opencode/`…) | Duplica la lista de `config/runtimes.json`, que AGENTS.md prohíbe y que «Verificar siempre» pide vigilar. Los tres ejemplos de AC-2 más la referencia a la fuente cubren el resto. |
| Una sola línea «lo que comprueba `verify:repository`», sin pasos | AC-3 pide que «No reportar» excluya lo que el gate comprueba. Sin los pasos, el revisor no sabe qué excluye y no se puede contrastar con «Verificar siempre». |
| Dejar fuera `specs/flow/archive/` | Los 71 `code-review-report.md` archivados son el origen del ruido (línea base de EPIC-28). Un revisor que los usara como criterio arrastraría sus hallazgos. |

### D-5 — «Verificar siempre»: solo lo que el gate no ejecuta // satisface: AC-2, AC-3, CNF-1

Introducción: `Un incumplimiento es 🔴 Important (HIGH/MEDIUM).` Luego cuatro casillas:

| Casilla | Por qué el gate no la ejecuta |
|---|---|
| `ai-no-hidden-characters` por bytes en los archivos del alcance (comando de `docs/guardrails/gr-ai-security-checklist.md`) | Ningún paso de `verify-repository.js` busca esos code points. En STORY-125 costaron una ronda. |
| Si cambia el comportamiento de un skill, su `evals/evals.json` se actualiza en la misma historia (principio 11) | `verify-eval-inventory.js` solo exige que existan evals o una excepción. |
| La lista de runtimes no se duplica en `skills/` ni en `scripts/`: se deriva de `config/runtimes.json` | `verify-runtime-documentation.js:17-27` no revisa esas carpetas. |
| Skills, agentes y documentos en español, salvo los skills heredados en inglés | Ningún paso comprueba el idioma. |

| Alternativa | Motivo del rechazo |
|---|---|
| La casilla de runtimes del borrador sin acotar | Su premisa («el gate solo vigila el README») es falsa: `AGENTS.md` y `docs/` ya están cubiertos. Sin acotar, AC-3 no se cumple. |
| Una severidad por casilla | Las cuatro son reglas no negociables de AGENTS.md o de la constitución. Una sola línea basta, es más corta y no deja severidades sin traducir. |

### D-6 — Restricciones de redacción impuestas por el gate // satisface: CNF-3, CNF-4

- `verify-validation-contract.js` revisa los `*.md` de la raíz, así que `REVIEW.md` no contiene `APROBADA`, `Aprobada`, `review-status` ni `approved` en minúsculas.
- UTF-8 sin BOM. Ningún code point de `ai-no-hidden-characters` va como carácter literal. Los emoji 🔴, 🟡 y 🟣 no están en esa lista.
- Las rutas van entre comillas invertidas, no como enlaces Markdown: `check-doc-links.js` no revisa `REVIEW.md`, y la existencia de las rutas la fija C-2 (I-5).

### D-7 — Prueba unitaria `test/review-md.test.js` // satisface: AC-1, AC-2, AC-3, CNF-2, CNF-3, CNF-4

Con `node:test` y `node:assert`, lee `REVIEW.md` desde la raíz como hacen `test/verify-fixed-layout.test.js` y `test/epic-complete.test.js`. Aserciones:

1. Estructura (I-1): H1 exacto, cuatro `##` con su texto literal y en orden, sin `<!--` y sin placeholders.
2. Áreas (I-2): seis viñetas de primer nivel en «Qué es «Importante» aquí», con sus prefijos y en orden.
3. Tope: «Tope de Minor» contiene `Máximo **5**`.
4. Reglas de AC-2 (I-4): cada marcador de D-3 aparece en su sección y en ninguna otra.
5. Vocabulario (I-3): cada sección contiene al menos un par término-traducción y ningún término sin su traducción.
6. Rutas (I-5): toda ruta citada existe o está ignorada por git.
7. Publicación (CNF-2): ninguna entrada de `package.json › files` es `REVIEW.md` ni un patrón que la alcance (`*.md`, `/`, `.`).
8. Codificación (CNF-3): los bytes iniciales no son `EF BB BF` y el texto no contiene ningún code point de `ai-no-hidden-characters`. La prueba escribe esos code points como escapes `\u`, nunca como literales.

Entra en `npm test` y, por tanto, en `npm run verify:repository` (CNF-4).

| Alternativa | Motivo del rechazo |
|---|---|
| Solo verificación manual al implementar | Las rutas citadas y las reglas se pierden con las ediciones posteriores de `REVIEW.md`, y el gate no lo vería: ningún verificador lee el archivo, salvo el de vocabulario. |
| Añadir `REVIEW.md` a `ACTIVE_ROOTS` de `check-doc-links.js` | Solo valida enlaces Markdown, no rutas entre comillas invertidas. Además cambia un script del gate por un único archivo. |
| Generalizar en `scripts/` un validador de guías de revisión | Hoy solo hay una guía. La semilla de STORY-184 tendrá su propia prueba (P12). |

### D-8 — Existencia de rutas: versionada o ignorada // satisface: AC-3

AC-2 exige citar `.claude/`, `.github/skills/` y `.agents/`, y «No reportar» cita `.tmp/`, `graphify-out/` y `node_modules/`. Ninguna está versionada, y en un clon limpio de CI no existen. «Existe en el repositorio» se interpreta como «existe en el working tree o está declarada en `.gitignore`», y se comprueba con `git check-ignore -q`. Así la prueba pasa en CI y detecta una ruta mal escrita o retirada, que no existe ni está ignorada. Ver CR-002.

| Alternativa | Motivo del rechazo |
|---|---|
| Lista fija en la prueba de rutas no versionadas permitidas | Duplica `.gitignore`, y una ruta nueva en `REVIEW.md` obligaría a editar la prueba. |
| Exigir que la ruta exista en disco | Falla en CI para las seis rutas ignoradas. |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

Esqueleto de `REVIEW.md` (el contenido de cada viñeta está en D-2, D-4 y D-5):

```
# REVIEW.md — Guía de revisión de agile-sddf
<línea 21 de la plantilla>
<línea 22 de la plantilla: vocabulario>

## Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM
<línea 29 de la plantilla>
- `skills/` …            ← 4 subviñetas (D-2)
- `scripts/` …           ← 3 subviñetas
- `docs/adr/` …          ← 1
- `docs/templates/` …    ← 1
- `docs/guardrails/` …   ← 1
- Cualquier archivo …    ← 2
<líneas 35-36 de la plantilla>

## Tope de Minor — 🟡 Minor · LOW
- Máximo **5** 🟡 Minor (LOW) por revisor …
- <líneas 41-42 de la plantilla>

## No reportar
- 6 viñetas (D-4)

## Verificar siempre
Un incumplimiento es 🔴 Important (HIGH/MEDIUM).
- [ ] 4 casillas (D-5)
```

## Flujos clave

### F-1 — Creación (escenario principal) // AC-1, AC-2, AC-3

1. Confirmar que existe ADR-0021 (STORY-178) y que su tabla de vocabulario coincide con la línea 22 de la plantilla (F-3 si no).
2. Escribir C-2 y ejecutarla: falla porque `REVIEW.md` no existe (RED).
3. Copiar la plantilla a `REVIEW.md`, borrar los comentarios y escribir las secciones según D-1 a D-5 y las restricciones de D-6.
4. Ejecutar C-2 (GREEN), `npm test` y `npm run verify:repository`. Comprobar `npm pack --dry-run` (CNF-2) y los bytes (CNF-3).

### F-2 — Consulta de una regla // AC-2

El revisor (o STORY-180, al leerlo) busca la regla y la encuentra en una sola sección. La sección decide su efecto: reportar como 🔴 Important, no reportar o verificar siempre.

### F-3 — Degradación // P7

- **ADR-0021 no existe al implementar:** se usa la traducción de la línea 22 de la plantilla, que coincide con STORY-178 D-6, y se deja constancia en `implement-report.md`. Si después el ADR ajusta el vocabulario, `REVIEW.md` lo adopta en la historia que lo cambie (Notas de la historia).
- **Una ruta citada desaparece después:** C-2 falla en `npm test` y nombra la ruta. Se corrige `REVIEW.md`, nunca la prueba.
- **`git` no disponible al ejecutar la prueba:** `git check-ignore` falla, y la aserción 6 informa la ruta que no pudo resolver en vez de darla por buena (fallo visible, no aprobación silenciosa).
- **`verify-validation-contract` falla por una palabra de D-6:** se reescribe la frase. El verificador no se relaja.

### F-4 — Puntos de cambio // P6

- Reglas nuevas del repo: se añaden en `REVIEW.md` como subviñeta del área o como casilla. Si es una regla de AC-2, también su marcador en C-2.
- El vocabulario vive en la línea de introducción y en los encabezados. Si ADR-0021 lo cambia, se tocan esas líneas y la aserción 5.
- Si el gate empieza a ejecutar una comprobación de «Verificar siempre» (p. ej. `ai-no-hidden-characters` en CI, fuera de alcance de EPIC-28), la casilla pasa a «No reportar» (AC-3).

## Decisiones de complejidad justificada

- **Prueba unitaria para un archivo de documentación (D-7):** ningún verificador del gate lee `REVIEW.md` salvo el de vocabulario, y las rutas y las reglas de AC-2 son justo lo que se rompe al editarlo. Ocho aserciones sobre un solo archivo son más baratas que una ronda de revisión.
- **`git check-ignore` en la prueba (D-8):** es la forma más simple de aceptar las rutas que AC-2 obliga a citar y que no existen en CI, sin duplicar `.gitignore`.
- **Marcadores literales (D-3):** un marcador por regla, en vez de una búsqueda semántica, hace determinista la aserción 4.
- No se crea script ni eval: no cambia el comportamiento de ningún skill (principio 11 no aplica).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Cuatro secciones en orden, sin placeholders ni comentarios, sin sección de formato | C-2, aserción 1 (`node --test test/review-md.test.js`) | AC-1 |
| 2 | Una viñeta por área y otra para cualquier archivo | C-2, aserción 2 | AC-1 |
| 3 | Tope de 5 LOW por revisor | C-2, aserción 3 | AC-1 |
| 4 | Cada regla de AC-2 en una sola sección, la indicada | C-2, aserción 4 | AC-2 |
| 5 | «Verificar siempre» solo con comprobaciones que el gate no ejecuta | Revisión manual de las cuatro casillas contra `scripts/verify-repository.js:12-31` (D-5) | AC-3 |
| 6 | «No reportar» excluye lo que el gate comprueba | La viñeta 1 de D-4 nombra los 14 pasos de `verify-repository.js` | AC-3 |
| 7 | Toda ruta citada existe o está ignorada | C-2, aserción 6 | AC-3 |
| 8 | Doble vocabulario en cada sección | C-2, aserción 5 | CNF-1 |
| 9 | No se publica | C-2, aserción 7; `npm pack --dry-run --json` no lista `REVIEW.md` | CNF-2 |
| 10 | UTF-8 sin BOM y sin caracteres invisibles | C-2, aserción 8; comando `ai-no-hidden-characters` de `gr-ai-security-checklist.md:113` sobre `REVIEW.md` | CNF-3 |
| 11 | Gate verde | `npm test` y `npm run verify:repository` | CNF-4 |
| 12 | Alcance acotado | `git diff --stat` solo muestra `REVIEW.md` y `test/review-md.test.js` (más artefactos de la historia) | Non-Goals |

## Risks / Trade-offs

- **[Dependencia] ADR-0021 no está implementado** → F-3: la traducción de la plantilla coincide con STORY-178 D-6. La historia recomienda implementar después de STORY-178 (CR-001).
- **[Riesgo] Las reglas viven en dos sitios hasta STORY-180** (los agentes y `REVIEW.md`) → es transitorio y declarado en Non-Goals. STORY-180 retira las de los agentes (CS-3).
- **[Riesgo] Los marcadores de D-3 hacen frágil la prueba ante una reescritura de estilo** → los marcadores son frases cortas del propio texto de AC-2. Si se cambia la redacción, se cambian en el mismo commit.
- **[Trade-off] La viñeta del gate en «No reportar» se desactualiza si `verify-repository.js` añade un paso** → el efecto es que se reporte de más, no de menos. F-4 indica dónde actualizarla.
- **[Limitación] Hasta STORY-180, `/story-code-review` no lee `REVIEW.md`** → la revisión de esta misma historia sigue con las reglas de los agentes.

## Open Questions

Ninguna. Los candidatos del borrador que quedaban abiertos (Notas de la historia) se deciden en D-2 y D-4.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → D-1, D-2, I-1, I-2; AC-2 → D-3, I-4; AC-3 → D-4, D-5, D-8, I-5; CNF-1 → I-3, D-5; CNF-2 → D-7 (aserción 7); CNF-3 → D-6, D-7 (aserción 8); CNF-4 → D-7, F-1. Todos con contrato de verificación.
- **Ambigüedad:** «ruta que existe en el repositorio» de AC-3 se fija en D-8 (CR-002), y «cada sección usa los dos vocabularios» de CNF-1 en I-3.
- **Nombres:** las secciones se nombran como en la plantilla y en la historia. «Guía de revisión», «copia de instalación» y «fuente de reglas» se usan como en EPIC-28 y STORY-178.
- **Estructura:** dos componentes sin dependencias cíclicas: la prueba lee el archivo y el archivo no conoce la prueba. Cada uno tiene una sola razón de cambio. Sin código en el diseño.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: CNF-1 exige la traducción que fije ADR-0021, y ADR-0021 no existe (STORY-178 en PLAN). El vocabulario de su diseño (D-6) coincide con la línea 22 de la plantilla.
- **Documento afectado**: design.md
- **Acción requerida**: implementar después de STORY-178. Si no es posible, aplicar F-3 y registrarlo en `implement-report.md`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-3 («ninguna ruta citada deja de existir en el repositorio») choca con AC-2, que obliga a citar `.claude/`, `.github/skills/` y `.agents/`. Están ignoradas por `.gitignore` y no existen en un clon limpio.
- **Documento afectado**: story.md
- **Acción requerida**: ninguna para implementar: D-8 interpreta «existe» como «existe o está declarada en `.gitignore`». Opcionalmente, precisar AC-3 en `story.md` con esa redacción.
