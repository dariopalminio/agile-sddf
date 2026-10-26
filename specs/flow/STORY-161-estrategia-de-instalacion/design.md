---
alwaysApply: false
type: design
id: STORY-161
slug: STORY-161-estrategia-de-instalacion-design
title: "Design: Estrategia de instalación"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-161
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-161-estrategia-de-instalacion
  - EPIC-27-completar-flujo-de-story
---

<!-- Referencias -->
[[STORY-161-estrategia-de-instalacion]] · [[EPIC-27-completar-flujo-de-story]]

# Diseño técnico: Estrategia de instalación

## Context

`agile-sddf install` copia hoy el catálogo completo de `skills/` al destino del runtime. La historia añade una **estrategia de instalación** (`full` | `story`) que permite omitir los skills `epic-*`. La épica fija el contrato en CS-4 (`specs/flow/EPIC-27-completar-flujo-de-story/epic.md`): `story` no instala ningún `epic-*`; `full` y la invocación sin flag ni TTY instalan el catálogo completo; un valor inválido termina con código ≠ 0 sin copiar nada.

Estado verificado en el filesystem (2026-10-25):

- **`scripts/cli.js`**: parsea `args` con `indexOf` (`--target`, `--global`, `--force`), valida `--target` antes de cualquier escritura (`exitInvalidTarget` → `process.exit(1)`), y solo pregunta el runtime cuando falta `--target` y `process.stdin.isTTY` es verdadero. `USAGE` es una plantilla literal con la sección `Options:`.
- **`scripts/install.js`** (CommonJS, `fs-extra`): `installSDDF(options)` resuelve el destino (`resolveDestDir`), copia `SOURCE_DIR/skills` con `copyDir(srcDir, destDir, { force })` entrada por entrada de primer nivel, y luego `SOURCE_DIR/agents` si el runtime instala agentes. `promptFolderSelection()` usa `readline` sobre `process.stdin/stdout`, con menú numerado y opción por defecto ante respuesta vacía o inválida. Devuelve `{ runtime, destination, mode, skills: { installed, skipped }, agents: { installed, skipped } }`.
- **Agentes:** el directorio `agents/` en la raíz del paquete **no existe**; `copyDir` devuelve `{0, 0}` cuando la fuente falta. Los agentes locales viven en `skills/<skill>/assets/agents/` (ADR-0014) y viajan **dentro** del directorio del skill. Ningún runtime de `config/runtimes.json` copia agentes de skills a un destino aparte. Conclusión (responde la nota de la historia): excluir el directorio `skills/epic-*` excluye también sus agentes; no hace falta un segundo filtro.
- **Catálogo:** 35 directorios en `skills/`, 6 con prefijo `epic-` (`epic-analyze`, `epic-creation`, `epic-format-validation`, `epic-from-project-plan`, `epic-generate-all-stories`, `epic-generate-stories`).
- **Pruebas:** `test/install.test.js` (`node:test`) cubre `installSDDF` en fixtures temporales (`createFixture`, `withInitCwd`, `withoutInstallLogs`) y el CLI vía `spawnSync` (`runNode`, `childEnv`, `assertNoRuntimeOutput`, `topLevelEntries`). Un proceso hijo de `spawnSync` tiene `stdin` sin TTY: es el escenario «sin TTY» de AC-2.
- **Documentación del comando:** además de `USAGE`, la sintaxis `npx agile-sddf install [--global] [--target <runtime>] [--force]` aparece en `docs/architecture/tech-stack.md` (tabla de comandos) y en la tabla `## Comandos` de `AGENTS.md`; `README.md` documenta la instalación en la sección «Instalación en tu runtime». `scripts/verify-runtime-documentation.js` valida la tabla derivada de runtimes del README (entre marcadores), que esta historia no toca.
- **Referencias cruzadas:** 16 `SKILL.md` no-epic sugieren comandos `/epic-*` en mensajes (p. ej. `story-plan` → `/epic-generate-stories`, `project-flow` → `/epic-from-project-plan`). Son sugerencias de texto, no invocaciones (ver CR-001).

## Goals / Non-Goals

**Goals:**

- Flag `--strategy full|story` en `agile-sddf install`, validado fail-closed antes de escribir. // satisface: AC-1, AC-3, CNF-1
- Estrategia `story`: copia todos los skills excepto los de prefijo `epic-`, y el resumen nombra la estrategia. // satisface: AC-1
- Sin flag: con TTY pregunta (full / story) igual que el runtime; sin TTY usa `full`. // satisface: AC-2, CNF-2
- `USAGE` y la documentación del comando reflejan el flag; pruebas unitarias para los cuatro casos de CNF-4. // satisface: CNF-3, CNF-4

**Non-Goals** (de la historia):

- Excluir otras familias (`project-*`, `memory-system`, …).
- Persistir la estrategia en `sddf.config.yaml` o desinstalar `epic-*` ya presentes en el destino.
- Estrategias distintas de `full` y `story`.
- Corregir las sugerencias `/epic-*` en skills no-epic (CR-001).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Catálogo de estrategias (`INSTALL_STRATEGIES`, `VALID_STRATEGIES`, `DEFAULT_STRATEGY`) | crear | `scripts/install.js` | AC-1, AC-2, AC-3 |
| `resolveInstallStrategy(strategy)` | crear | `scripts/install.js` | AC-2, AC-3 |
| `promptStrategySelection(streams?)` | crear | `scripts/install.js` | AC-2 (fila con TTY) |
| `copyDir(srcDir, destDir, { force, shouldCopy })` | modificar | `scripts/install.js` | AC-1 |
| `installSDDF(options)` — opción `strategy`, filtro de skills, resumen y resultado | modificar | `scripts/install.js` | AC-1, AC-2, CNF-2 |
| `module.exports` — exporta `resolveInstallStrategy`, `promptStrategySelection`, `VALID_STRATEGIES` | modificar | `scripts/install.js` | AC-3, CNF-4 |
| Parseo y validación de `--strategy`, prompt condicionado a TTY | modificar | `scripts/cli.js` | AC-2, AC-3, CNF-1 |
| `USAGE` — opción `--strategy` y ejemplo | modificar | `scripts/cli.js` | CNF-3 |
| Pruebas de estrategia (programáticas y CLI) | modificar | `test/install.test.js` | CNF-4 |
| Sintaxis del comando | modificar | `docs/architecture/tech-stack.md`, `AGENTS.md` (tabla `## Comandos`), `README.md` (sección «Instalación en tu runtime») | CNF-3 |

## Decisions

### D-1 — El filtro vive en `install.js`, no en `cli.js` // satisface: AC-1, CNF-2

**Elegida:** `installSDDF` recibe `options.strategy` y pasa a `copyDir` un predicado `shouldCopy(entryName)` derivado de la estrategia. La API programática y el CLI comparten la misma regla.

**Alternativas rechazadas:**

- *Filtrar en `cli.js` y pasar una lista de skills a `installSDDF`*: duplica la regla para consumidores programáticos y deja `installSDDF({ strategy })` sin significado.
- *Copiar todo y borrar después los `epic-*`*: escribe archivos que luego elimina; con `--force` borraría `epic-*` previos del usuario (contradice el non-goal de no desinstalar) y rompe el espíritu fail-closed.

### D-2 — Catálogo de estrategias como constante en `install.js` // satisface: AC-1, AC-2, AC-3

**Elegida:** objeto congelado `INSTALL_STRATEGIES` con dos entradas, cada una con `label` (texto del menú) y `excludedSkillPrefixes`:

| id | `excludedSkillPrefixes` | `label` |
|---|---|---|
| `full` | `[]` | `epic + story; full catalog` |
| `story` | `['epic-']` | `story flow only; excludes epic-* skills` |

`VALID_STRATEGIES = Object.keys(INSTALL_STRATEGIES)` (orden: `full`, `story`) y `DEFAULT_STRATEGY = 'full'`.

**Alternativas rechazadas:**

- *Declararlas en `config/runtimes.json`*: ese archivo es el contrato de runtimes (IDs, destinos, layout; `AGENTS.md`), y la estrategia es independiente del runtime.
- *Archivo nuevo `config/strategies.json` o lista explícita de skills por estrategia*: dos valores fijos y una regla de prefijo no justifican un contrato nuevo ni su verificador (YAGNI). Queda como punto de cambio (F-5).

### D-3 — `resolveInstallStrategy`: estricta, `undefined` → `full` // satisface: AC-2, AC-3

Contrato: `resolveInstallStrategy(strategy: string | undefined) → 'full' | 'story'`.

- `undefined` → `DEFAULT_STRATEGY`.
- Valor presente en `VALID_STRATEGIES` (comparación exacta, minúsculas) → ese valor.
- Cualquier otro valor (incluido `''`) → lanza `Error` con mensaje `Invalid strategy "<valor>". Valid strategies: full, story`.

`installSDDF` la invoca **antes** de `resolveDestDir`/`copyDir`, de modo que la API programática también falla sin escribir.

**Alternativas rechazadas:** *normalizar mayúsculas (`Story` → `story`)*: `--target` no lo hace y aceptar variantes amplía la superficie sin pedido. *Caer a `full` ante un valor inválido*: contradice AC-3.

### D-4 — CLI: validación temprana con el mismo patrón que `--target` // satisface: AC-3, CNF-1

`cli.js` agrega `strategyIdx = args.indexOf('--strategy')` y `strategyValue = args[strategyIdx + 1]`. Dentro de `command === 'install'`, tras validar `--target` y **antes** del bloque asíncrono (prompts e instalación):

- Si `strategyIdx !== -1` y el valor falta o empieza por `--` → `exitInvalidStrategy(value)`.
- Si `resolveInstallStrategy(value)` lanza → `exitInvalidStrategy(value)`.

`exitInvalidStrategy(provided)` escribe en `stderr` `Invalid --strategy "<valor>". Valid strategies: full, story` (lista derivada de `VALID_STRATEGIES`) y termina con `process.exit(1)`. Al ocurrir antes de cualquier llamada a `installSDDF`, no se crea ningún directorio.

**Alternativa rechazada:** *validar solo dentro de `installSDDF`*: ya lo hace (D-3), pero el error llegaría por la rama `SDDF install failed:` después de un posible prompt de runtime; preguntar algo para luego fallar por otro flag es peor UX y no replica el patrón de `--target` que CNF-1 exige.

### D-5 — Prompt de estrategia independiente del de runtime // satisface: AC-2

En el bloque asíncrono de `cli.js`, después de resolver el runtime:

- `strategy = strategyValue`; si `strategyValue === undefined` y `process.stdin.isTTY` → `strategy = await promptStrategySelection()`.
- Sin TTY y sin flag → `strategy` queda `undefined` y `installSDDF` aplica `full` (D-3).

Las dos preguntas son independientes: `--target opencode` sin `--strategy` en TTY pregunta solo la estrategia; `--strategy story` sin `--target` en TTY pregunta solo el runtime.

`promptStrategySelection({ input = process.stdin, output = process.stdout } = {}) → Promise<'full' | 'story'>` replica `promptFolderSelection`: título `Which install strategy would you like to use?`, menú `  1) full  (<label>)` / `  2) story  (<label>)`, `Enter choice [1]: `; respuesta vacía o inválida → `full`.

**Alternativas rechazadas:** *un único prompt combinado runtime × estrategia*: acopla dos decisiones ortogonales y rompe el menú de runtime existente. *No preguntar en TTY y usar siempre `full`*: contradice AC-2 fila 3.

**Complejidad justificada:** los streams inyectables con valores por defecto son la única diferencia con `promptFolderSelection`; existen para poder probar el menú con `PassThrough` sin TTY real (Contratos de verificación #6).

### D-6 — Filtro por entrada de primer nivel en `copyDir` // satisface: AC-1

`copyDir(srcDir, destDir, { force = false, shouldCopy = () => true } = {}) → { installed, skipped, excluded }`.

- Por cada entrada de `srcDir`, si `shouldCopy(entry.name)` es falso: no se lee ni se escribe nada en el destino; se registra `  Excluded (strategy <id>): <nombre>` y se incrementa `excluded`.
- El resto conserva el comportamiento actual (`Skipped`/`Installed`/`Updated`).
- Solo la copia de `skills/` recibe `shouldCopy`; la copia de `agents/` usa el predicado por defecto (D-7).

El predicado de `installSDDF` es: excluir la entrada si su nombre empieza por algún prefijo de `excludedSkillPrefixes` de la estrategia. Con `full`, `excluded = 0` y la salida es idéntica a la actual salvo el resumen (D-8). // satisface: CNF-2

**Alternativa rechazada:** *usar el `filter` de `fse.copy` sobre todo `skills/`*: cambiaría la copia por entrada que sostiene el conteo y la semántica de `--force` por skill.

### D-7 — Agentes: sin filtro adicional // satisface: AC-1

Los agentes de cada skill viajan dentro de `skills/<skill>/assets/agents/` (verificado; ADR-0014), así que excluir el directorio del skill excluye sus agentes. La rama `SOURCE_DIR/agents` no cambia. Si en el futuro reaparece un `agents/` raíz con agentes de épica, el filtro tendrá que extenderse (F-5).

### D-8 — Resumen y resultado nombran la estrategia // satisface: AC-1, CNF-2

- Línea de inicio: `SDDF install: copying skills[ and agents] for <runtime.name> to <destDir> (strategy <id>)`.
- Línea final: `SDDF installed (<mode>, <runtime.id>, strategy <id>): <si> skills[, <ai> agents] (<skipped> skipped[, <excluded> excluded])`; el segmento `excluded` solo aparece si es > 0.
- El objeto devuelto agrega `strategy: '<id>'` y `skills.excluded: <n>`; el resto de campos no cambia.

Se muestra también con `full` para que el resumen siempre diga qué estrategia se aplicó. CNF-2 («resultado idéntico») se interpreta sobre los archivos instalados, no sobre el texto del resumen, que AC-1 obliga a cambiar.

### D-9 — `--force` con `story` no toca `epic-*` existentes // satisface: AC-1, CNF-2

Resuelve el «pendiente de refinar» de la historia según su propuesta: las entradas excluidas no se evalúan (D-6), así que un `epic-*` previo en el destino queda intacto con o sin `--force`. Coherente con el non-goal «no desinstalar».

### D-10 — Documentación del flag // satisface: CNF-3

- `USAGE` (`cli.js`): línea `  --strategy <name>    Install strategy: full (default; all skills) or story (excludes epic-* skills)` en `Options:` y el ejemplo `  agile-sddf install --strategy story --target claude-code`.
- `docs/architecture/tech-stack.md` y la tabla `## Comandos` de `AGENTS.md`: la sintaxis pasa a `npx agile-sddf install [--global] [--target <runtime>] [--strategy full|story] [--force]`.
- `README.md`, sección «Instalación en tu runtime»: párrafo breve con el flag, el default y la regla de exclusión. Fuera de los marcadores de la tabla derivada.

**Alternativa rechazada:** *solo `USAGE`* (mínimo de CNF-3): dejaría la sintaxis desactualizada en tres documentos, contra la regla de Veracidad de `AGENTS.md`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `resolveInstallStrategy(strategy)` | `string \| undefined → 'full' \| 'story'`; lanza `Error('Invalid strategy "<v>". Valid strategies: full, story')` | AC-2, AC-3 |
| `promptStrategySelection({ input, output } = {})` | `→ Promise<'full' \| 'story'>`; vacío o inválido → `'full'` | AC-2 |
| `copyDir(srcDir, destDir, { force, shouldCopy })` | `→ Promise<{ installed, skipped, excluded }>`; `shouldCopy: (name: string) → boolean`, por defecto siempre verdadero | AC-1 |
| `installSDDF(options)` | `options.strategy?: 'full' \| 'story'` además de las actuales; `→ Promise<{ runtime, destination, mode, strategy, skills: { installed, skipped, excluded }, agents: { installed, skipped } }>` | AC-1, AC-2 |
| CLI `agile-sddf install --strategy <name>` | `full \| story`; inválido o sin valor → `stderr` `Invalid --strategy "<v>". Valid strategies: full, story`, código 1, sin escritura | AC-1, AC-2, AC-3 |
| Exportaciones de `install.js` | agrega `resolveInstallStrategy`, `promptStrategySelection`, `VALID_STRATEGIES` | CNF-4 |

## Esquema de datos

Catálogo de estrategias (constante, sin persistencia): // satisface: AC-1, AC-2

| Campo | Tipo | `full` | `story` |
|---|---|---|---|
| clave | `string` | `full` | `story` |
| `label` | `string` | `epic + story; full catalog` | `story flow only; excludes epic-* skills` |
| `excludedSkillPrefixes` | `string[]` | `[]` | `['epic-']` |

## Flujos clave

### F-1 — `install --strategy story --target claude-code` // AC-1

`cli.js` valida `--target` → valida `--strategy` → (sin prompts: ambos flags presentes) → `installSDDF({ target, strategy: 'story', … })` → `resolveInstallStrategy` → `resolveDestDir` → `copyDir(skills, …, shouldCopy = no empieza por 'epic-')` → 29 skills copiados, 6 `Excluded` → resumen con `strategy story` y `6 excluded`.

### F-2 — Sin flag // AC-2, CNF-2

- Sin TTY: no hay prompt → `installSDDF({ strategy: undefined })` → `full` → catálogo completo, `excluded = 0`.
- Con TTY: tras el runtime (si faltaba `--target`), `promptStrategySelection()` → elección → `installSDDF`.

### F-3 — Valor inválido // AC-3, CNF-1

`--strategy epic` (o `--strategy` sin valor, o seguido de `--force`) → `exitInvalidStrategy` → `stderr` con el valor y `full, story` → `exit(1)` antes de cualquier prompt o escritura.

### F-4 — Degradación // P7

- Error de E/S durante la copia: sin cambio; `installSDDF` rechaza y `cli.js` emite `SDDF install failed:` con código 1.
- Prompt interrumpido o respuesta no reconocida: cae a `full`, igual que `promptFolderSelection` cae al runtime por defecto.
- La API programática con estrategia inválida lanza antes de escribir (D-3), aunque el CLI ya la haya filtrado.

### F-5 — Puntos de cambio // P6

- Nueva estrategia o nueva familia excluida: una entrada más en `INSTALL_STRATEGIES`; si crecen, migrar a `config/strategies.json` con verificador propio.
- Persistir la estrategia en `sddf.config.yaml` (non-goal actual): se resolvería antes de `resolveInstallStrategy`, sin tocar `copyDir`.
- Reaparición de un `agents/` raíz con agentes de épica: aplicar el mismo predicado a esa copia (D-7).

## Decisiones de complejidad justificada

- **Predicado `shouldCopy` en lugar de una lista de nombres:** la regla de la historia es un prefijo; un predicado la expresa sin enumerar skills que cambian con el catálogo.
- **Catálogo con `label` y `excludedSkillPrefixes` en vez de un `if (strategy === 'story')`:** el menú del prompt, la validación, el mensaje de error y el filtro leen la misma fuente; con un condicional, los valores válidos quedarían repetidos en cuatro sitios.
- **Streams inyectables en `promptStrategySelection`:** ver D-5; sin ellos, la fila «con TTY» de AC-2 solo sería verificable a mano.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `installSDDF({ strategy: 'story' })` no deja ningún directorio `epic-*` en el destino de skills, copia todos los demás y devuelve `strategy: 'story'` y `skills.excluded` igual al número de `skills/epic-*` de la fuente | UT en `test/install.test.js` (fixture + `topLevelEntries`) | AC-1 |
| 2 | CLI `install --strategy story --target claude-code`: código 0, sin `epic-*` en `.claude/skills`, `stdout` contiene `strategy story` | UT CLI (`runNode`) | AC-1 |
| 3 | `installSDDF({ strategy: 'full' })` instala exactamente las entradas de primer nivel de `skills/` | UT | AC-2 |
| 4 | CLI sin `--strategy` y sin TTY (`spawnSync`): catálogo completo y `stdout` contiene `strategy full` | UT CLI | AC-2, CNF-2 |
| 5 | CLI `--strategy epic` y `--strategy` sin valor: código ≠ 0, `stderr` contiene `Invalid --strategy "epic"` y `full, story`, `assertNoRuntimeOutput` | UT CLI | AC-3, CNF-1 |
| 6 | `promptStrategySelection` con `PassThrough`: `2\n` → `story`; `\n` → `full`; `9\n` → `full`; el menú lista `full` y `story` | UT | AC-2 |
| 7 | `resolveInstallStrategy`: `undefined` → `full`; `'story'` → `story`; `'epic'` y `''` lanzan con el mensaje de D-3 | UT | AC-2, AC-3 |
| 8 | `--strategy story --force` sobre un destino con un `epic-*` previo lo deja intacto; `--global` combinado escribe en el destino global | UT | CNF-2, D-9 |
| 9 | `--help` contiene `--strategy` y `full`/`story` | UT CLI | CNF-3 |
| 10 | `npm test` y `npm run verify:repository` pasan | Comando | CNF-4 |

## Risks / Trade-offs

- [Con `story`, 16 skills no-epic sugieren comandos `/epic-*` que no estarán instalados] → Mitigación: fuera del alcance de la historia; se registra CR-001. El instalador no se rompe, solo el texto de la sugerencia queda sin destino.
- [El resumen cambia también con `full` (agrega `strategy full`)] → Mitigación: ninguna prueba ni script del repo parsea esa línea (verificado con búsqueda en `scripts/` y `test/`, incluido `scripts/smoke-package-install.js`); CNF-2 aplica a los archivos instalados.
- [`--strategy` sin valor seguido de otro flag (`--strategy --force`)] → Mitigación: tratado como inválido, igual que `--target` (D-4).

## Open Questions

Ninguna. El «pendiente de refinar» de la historia (`--force` con `story` sobre `epic-*` previos) se resuelve en D-9 según la propuesta de la propia historia.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1, D-2, D-6, D-8), AC-2 (D-3, D-5), AC-3 (D-3, D-4), CNF-1 (D-4), CNF-2 (D-6, D-8, D-9), CNF-3 (D-10), CNF-4 (Contratos de verificación). La nota sobre agentes se responde en D-7.
- **Ambigüedad:** «resultado idéntico» de CNF-2 acotado a archivos instalados (D-8); `--force` + `story` resuelto en D-9.
- **Nombres:** «estrategia» / `strategy` de forma uniforme; `full` y `story` como únicos IDs.
- **Estructura:** `cli.js → install.js` en una sola dirección; `copyDir` no conoce estrategias (solo un predicado); el catálogo no depende de ningún componente. Sin ciclos.

## Registro de Cambios (CR)

### CR-001

- **Tipo**: dependencia
- **Descripción**: 16 `SKILL.md` no-epic (p. ej. `story-plan`, `story-design`, `project-flow`, `project-planning`, `memory-system`) sugieren comandos `/epic-*` en mensajes de error o de siguiente paso. Con `--strategy story` esos comandos no estarán instalados. No son invocaciones: el flujo story no falla, pero la sugerencia queda sin destino.
- **Documento afectado**: story.md (non-goals) / épica EPIC-27
- **Acción requerida**: decidir en una historia posterior si los mensajes deben condicionarse a la presencia del skill sugerido o ofrecer la alternativa story (p. ej. `/story-creation`). No bloquea esta historia.
