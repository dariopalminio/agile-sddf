---
alwaysApply: false
type: design
id: STORY-160
slug: STORY-160-completar-y-archivar-historia-entregada-design
title: "Design: Skill story-complete: completar y archivar una historia entregada"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-160
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-160-completar-y-archivar-historia-entregada
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-164-archivar-historias-canceladas
---

<!-- Referencias -->
[[STORY-160-completar-y-archivar-historia-entregada]] · [[EPIC-27-completar-flujo-de-story]] · [[STORY-159-story-delivery-interactivo]] · [[STORY-164-archivar-historias-canceladas]]

# Diseño técnico: Skill story-complete — completar y archivar una historia entregada

## Context

El pipeline de story termina hoy en `ACCEPTANCE/DONE`; STORY-159 añade `story-delivery`, que lleva la historia a `DELIVER/DONE`. Después no hay ningún skill: el humano edita `status: COMPLETED` a mano y mueve el directorio a `specs/flow/archive/` sin regla aplicada. Esta historia crea `story-complete`, que con confirmación humana escribe `COMPLETED/DONE` desde `DELIVER/DONE` y archiva la historia en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` conservando el historial de git. También archiva, sin reescribir el frontmatter, las historias que ya están en `COMPLETED/DONE`. Las `CANCELED` quedan fuera (STORY-164).

Estado actual verificado en el filesystem (2026-10-25):

- `skills/story-complete/` **no existe**. El diagrama `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid` ya dibuja `story-delivery --> story-complete --> END` (líneas 75–79).
- ADR-0016 (aceptado, inmutable), § Decisión: `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` recibe **solo** historias `COMPLETED`; la fecha es `updated:` y, si falta, `created:`; las `CANCELED` quedan en `specs/flow/`.
- `scripts/migrate-specs-to-flow.js` (STORY-153) implementa `readFrontmatter`, `archiveDate`, el uso de `git mv`, el bloqueo por destino existente o por origen sin archivos versionados y la comprobación «activas + archivadas = total previo» (regex `^STORY-\d{3}-` y `^\d{4}-\d{2}-\d{2}-STORY-\d{3}-`). Su cabecera lo declara **de un solo uso** («no es un comando reutilizable ni archiva work items futuros (CS-11)»), su `archiveDate` acepta `date:` como tercer respaldo (fuera de alcance aquí: STORY-164) y vive en `scripts/`, que no se copia junto a los skills instalados.
- `scripts/install.js › copyDir` copia el directorio completo de cada skill (incluido `scripts/`): `.claude/skills/memory-system/` contiene `scripts/`. Precedente de motor Node propio de un skill: `skills/memory-system/scripts/memory-system.js`, invocado como `node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js …` y probado por `test/memory-system.test.js`.
- `package.json › files` ya contiene `skills/` completo (ver CR-001).
- `scripts/verify-eval-inventory.js` (parte de `verify:repository`) exige `skills/<skill>/evals/evals.json` con casos `TC-NNN` o una excepción en `config/eval-exemptions.json`. `scripts/verify-fixed-layout.js` exige el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` y los tokens `REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/` en el bloque del Paso 0.
- No existe `docs/guardrails/dod-story-complete.md` ni una etapa `complete` en `DOD_STAGES` (`skills/memory-system/scripts/dod-story.js`): el DoD de cierre es el de `deliver`, que verifica `story-delivery`.
- La prohibición de que un skill escriba `COMPLETED` aparece en: invariante 6 de §4 y §5.2 de `docs/domains/domain-state-management.md`; fila `COMPLETED` de §5 de `docs/domains/domain-story-lifecycle.md` (actor `—`); BR-006 de `docs/domains/domain.md`; y, como documentación derivada, `docs/architecture/state-machine.md` (líneas 72 y 108; la tabla de transiciones por skill no tiene fila de cierre). `README.md` (tabla de la línea 145) y `docs/guides/sddf-commands-pipeline.md` (línea 24) describen el archivado sin nombrar quién lo hace.
- Skill de referencia más cercano: `skills/story-acceptance/SKILL.md` (precondición de estado, resolución de historia con rechazo de `specs/flow/archive/` en el Paso 1b, mensajes de error sin modificar archivos). Diseño hermano: `specs/flow/STORY-159-story-delivery-interactivo/design.md` (D-9 coordina la edición del invariante 6).

Stack: el «código de producción» de este repo son skills en Markdown más scripts Node.js CommonJS sin dependencias (`'use strict'`, `fs`, `path`, `child_process.spawnSync`); los skills se prueban con evals (`skill-test-evals`) y los scripts con `node --test test`.

## Goals / Non-Goals

**Goals:**

- Skill `story-complete` que localiza la historia de forma determinista, valida admisión, fecha y destino **antes** de preguntar, pide confirmación y, solo con `s`, escribe `COMPLETED` (si venía de `DELIVER/DONE`) y archiva con `git mv`. // satisface: AC-1, CNF-1, CNF-3, CNF-5
- Rechazos y abortos sin efectos: ningún archivo modificado ni movido. // satisface: AC-2, AC-3, CNF-4
- Atomicidad: orden fijo «escribir → mover» con restauración byte a byte de `story.md` si el movimiento falla, e invariante de conteo comprobado. // satisface: CNF-4
- Documentos de dominio coherentes: `story-complete` escribe `COMPLETED` de story desde `DELIVER/DONE`, siempre con confirmación humana, y archiva sin cambiar el status las `COMPLETED/DONE`. // satisface: CNF-6
- Skill publicable y gate en verde. // satisface: CNF-2, CNF-7

**Non-Goals:**

- Archivar historias `CANCELED`, aceptar `date:` como fecha y el ADR que reemplaza a ADR-0016 (STORY-164).
- Marcar la historia en `epic.md` (`- [x]`), hacer commit, push o PR, reabrir historias archivadas, archivar épicas.
- Verificar el DoD de entrega: lo hace `story-delivery` (STORY-159). `story-complete` no tiene DoD propio (D-11).
- Modo automático o flag `--yes`: la confirmación humana es obligatoria (CNF-6).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Skill `story-complete` | crear | `skills/story-complete/SKILL.md` | AC-1, AC-2, AC-3, CNF-1, CNF-6 |
| C-2 | Motor de cierre y archivado | crear | `skills/story-complete/scripts/story-complete.js` | AC-1, AC-2, AC-3, CNF-3, CNF-4, CNF-5 |
| C-3 | README del skill | crear | `skills/story-complete/README.md` | CNF-7 (convención: todos los skills tienen README) |
| C-4 | Evals del skill | crear | `skills/story-complete/evals/evals.json` | AC-1, AC-2, AC-3, CNF-7 |
| C-5 | Pruebas del motor | crear | `test/story-complete.test.js` | AC-1, AC-2, AC-3, CNF-3, CNF-4, CNF-5, CNF-7 |
| C-6 | Invariante transversal | modificar | `docs/domains/domain-state-management.md` (§4 invariante 6, §5.2) | CNF-6 |
| C-7 | Ciclo de vida de story | modificar | `docs/domains/domain-story-lifecycle.md` (§5 fila `COMPLETED`) | CNF-6 |
| C-8 | Reglas de negocio | modificar | `docs/domains/domain.md` (BR-006) | CNF-6 (coherencia derivada) |
| C-9 | Máquina de estados | modificar | `docs/architecture/state-machine.md` (línea 72, párrafo de la línea 108, fila `story-complete` en la tabla de transiciones por skill) | CNF-6 (coherencia derivada) |
| C-10 | README raíz | modificar | `README.md` (fila «Completar y archivar · `/story-complete`» en la tabla de la línea 145; línea 134 del pipeline) | CNF-6 (coherencia derivada) |
| C-11 | Guía del pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` (línea 24: el archivado lo hace `/story-complete`) | CNF-6 (coherencia derivada) |

Sin cambios: `package.json` (CR-001), `scripts/migrate-specs-to-flow.js` (CR-004), `config/runtimes.json`, `config/profiles.json`, `sddf.config.yaml`, `skills/memory-system/scripts/dod-story.js` y `docs/guardrails/` (D-11), el diagrama Mermaid (ya incluye `story-complete`), `scripts/verify-validation-contract.js` (sin reporte ni `verdict`, D-11), ADR-0016 (se respeta tal cual, CNF-1).

## Decisions

### D-1 — Motor Node propio del skill + SKILL.md para la interacción // satisface: AC-1, AC-3, CNF-4, CNF-5

El skill se divide en dos piezas con una sola responsabilidad cada una:

- **C-2 `story-complete.js` (motor):** localizar, validar, calcular destino y fecha, escribir el frontmatter, mover y verificar el conteo. Determinista, sin interacción, salida JSON.
- **C-1 `SKILL.md` (orquestación):** resolver `REPO_ROOT`/`CLI_ROOT`, invocar `plan`, presentar el resultado, pedir la confirmación humana e invocar `apply` solo tras `s`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo Markdown: el agente ejecuta `git mv` y edita el frontmatter (como `story-delivery`) | La restauración ante fallo (CNF-4), la búsqueda que falla cerrada ante varias coincidencias (CNF-5) y el conteo dependerían de que el agente siga los pasos al pie de la letra; solo se probarían con evals manuales. Aquí la operación es irreversible y sobre el filesystem: requiere determinismo. |
| Reutilizar `scripts/migrate-specs-to-flow.js` (exportar o invocar) | Es de un solo uso por contrato (CS-11 de STORY-153), no se instala junto a los skills, exige `docs/specs/` y su `archiveDate` acepta `date:` (STORY-164). Ver CR-004. |
| Un subcomando nuevo de `agile-sddf` (`scripts/cli.js`) | Acopla un skill de flujo al instalador; la convención de motores de skill es `skills/<skill>/scripts/` (`memory-system`). |

### D-2 — Tabla de admisión por estado // satisface: AC-1, AC-2

El motor lee `status` y `substatus` del frontmatter de `story.md` y decide con esta tabla (primera coincidencia):

| `status` / `substatus` | Acción (`action`) | Código de rechazo | Mensaje (contenido obligatorio) |
|---|---|---|---|
| `DELIVER` / `DONE` | `complete` (escribe `COMPLETED`, actualiza `updated:` y archiva) | — | — |
| `COMPLETED` / `DONE` | `archive-only` (archiva sin escribir nada en `story.md`) | — | — |
| `CANCELED` / cualquiera | — | `CANCELED_NOT_ADMITTED` | estado actual + «ADR-0016 solo admite historias `COMPLETED` en `specs/flow/archive/`» |
| cualquier otro par (incluye `ACCEPTANCE/DONE`, `DELIVER/IN-PROGRESS`, `COMPLETED/IN-PROGRESS`) | — | `NOT_DELIVERED` | estado actual + «requiere `DELIVER/DONE` o `COMPLETED/DONE`» + «ejecuta antes `/story-delivery STORY-NNN`» |
| frontmatter ausente o sin `status`/`substatus` | — | `NO_STATUS` | campos buscados (`status`, `substatus`) |

La comparación es exacta y sensible a mayúsculas, como en el resto de skills. El rechazo ocurre en `plan`, antes de cualquier pregunta.

| Alternativa | Motivo del rechazo |
|---|---|
| Aceptar `ACCEPTANCE/DONE` y saltarse `DELIVER` | Omitiría el DoD de entrega que verifica `story-delivery`; AC-2 exige rechazarlo. |
| Archivar `CANCELED` conservando su status | Contradice ADR-0016 (aceptado, inmutable); es exactamente el alcance de STORY-164 con su ADR nuevo. |

### D-3 — Búsqueda determinista solo en el primer nivel de `specs/flow/` // satisface: AC-1, AC-2, CNF-5

- **Por ID** (`--id STORY-NNN`, regex `^STORY-\d{3}$`): se listan las entradas de `<REPO_ROOT>/specs/flow/` (sin recursión) que son directorios cuyo nombre empieza por `STORY-NNN-`. `specs/flow/archive/` nunca se consulta para resolver. 0 coincidencias → `NOT_FOUND` con la ruta buscada `specs/flow/STORY-NNN-*/`; si además existe `specs/flow/archive/*-STORY-NNN-*/`, el mensaje añade «ya archivada en <ruta>» como pista, sin cambiar el código. Más de una → `AMBIGUOUS` con la lista ordenada de coincidencias.
- **Por ruta** (`--path`): se acepta solo si, normalizada y relativa a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>` (un solo segmento bajo `specs/flow/`, nunca `specs/flow/archive/…`); si no → `INVALID_PATH` con la forma esperada. Mismo criterio que `story-acceptance` Paso 1b.
- En ambos casos, `story.md` ausente en el directorio → `NO_STORY_FILE` con la ruta.

| Alternativa | Motivo del rechazo |
|---|---|
| Glob recursivo o tomar la primera coincidencia (como `story-acceptance` Paso 1b) | CNF-5 exige fallar cerrado con varias coincidencias; un glob recursivo encontraría la copia archivada. |
| Buscar por `id:` del frontmatter | Requiere leer todos los `story.md`; ADR-0016 hace del nombre de directorio la clave. |

### D-4 — Fecha de archivo y destino // satisface: AC-1, AC-3, CNF-1

- `action: complete` → la fecha es `today` (fecha local `YYYY-MM-DD` del sistema), que es también el nuevo `updated:`; así el destino cumple la regla `updated:` de ADR-0016.
- `action: archive-only` → primer valor válido de la cadena `updated:` → `created:` (regex `^\d{4}-\d{2}-\d{2}$` tras quitar comillas). Un `updated:` presente pero inválido pasa a `created:`. `date:` **no** se consulta (Non-Goals). Ninguno válido → `NO_ARCHIVE_DATE` con los campos buscados (`updated:`, `created:`).
- Destino: `specs/flow/archive/<fecha>-<nombre del directorio origen>` (el nombre conserva el slug, ADR-0016 § Nombre de directorio). Si ya existe → `ARCHIVE_CONFLICT` con la ruta (`git mv` anidaría el origen dentro del destino).

`today` se inyecta como parámetro de las funciones exportadas (D-9) para que las pruebas sean deterministas; la CLI usa la fecha local.

| Alternativa | Motivo del rechazo |
|---|---|
| Usar la fecha UTC | Entre las 21:00 y las 24:00 en UTC-3 el directorio llevaría la fecha de mañana y no coincidiría con el `updated:` escrito por un humano en su zona. |
| Para `complete`, conservar el `updated:` previo como fecha | AC-1 fija «se actualiza a la fecha de hoy» y la fecha del directorio debe ser la de `updated:`. |

### D-5 — Orden de escritura y movimiento, con restauración // satisface: AC-1, AC-3, CNF-4

`plan` es de solo lectura. `apply` ejecuta, en este orden:

1. Recalcular el plan completo (mismas validaciones de D-2…D-4) y abortar con su código si algo cambió desde `plan`. Contar `before = activas + archivadas` (regex `^STORY-\d{3}-` en `specs/flow/` y `^\d{4}-\d{2}-\d{2}-STORY-\d{3}-` en `specs/flow/archive/`, las mismas de `migrate-specs-to-flow.js`).
2. Leer `story.md` como bytes (`original`).
3. Solo si `action: complete`: escribir `story.md` con la edición mínima de D-7. Error de E/S → `WRITE_FAILED`, nada movido.
4. Crear `specs/flow/archive/` si no existe (`mkdir` recursivo).
5. Mover el directorio (D-6).
6. Si el movimiento falla → restaurar `original` en la ruta de origen (solo si hubo paso 3) y devolver `MOVE_FAILED` con el error de git; si la restauración también falla → `ROLLBACK_FAILED`, que nombra la ruta y el contenido a recuperar (`git checkout -- <ruta>/story.md`).
7. Contar `after`; si `after ≠ before` → `COUNT_MISMATCH` (no se intenta deshacer el movimiento; se informan ambas cifras y las rutas).
8. Éxito → `OK` con `to` (ruta final).

El único estado intermedio posible es «`story.md` en `COMPLETED` todavía en `specs/flow/`» durante el paso 5, y el paso 6 lo revierte. Ningún camino deja una historia no `COMPLETED` dentro de `specs/flow/archive/`.

| Alternativa | Motivo del rechazo |
|---|---|
| Mover primero y escribir `COMPLETED` en el destino | Un fallo de escritura dejaría una historia `DELIVER` dentro de `specs/flow/archive/`, prohibido por ADR-0016; revertir exigiría otro `git mv`. |
| Copiar al destino y borrar el origen | Duplica la historia de forma transitoria (rompe el conteo de CNF-4) y git lo ve como borrado + alta, no como renombre. |

### D-6 — Mecanismo de movimiento: `git mv`, con movimiento simple solo sin historial // satisface: AC-1, CNF-3

- Si `REPO_ROOT` es la raíz de un work tree de git (`git rev-parse --show-toplevel`, comparación normalizada como `isRepoRoot` de `migrate-specs-to-flow.js`) **y** el directorio tiene al menos un archivo versionado (`git ls-files -- <origen>` no vacío) → `git mv <origen> <destino>` (`moveMethod: git-mv`). `git mv` de un directorio renombra el directorio entero, de modo que los archivos sin versionar que contiene (p. ej. reportes recién generados) viajan con él; el renombre queda en el índice y el commit lo hace el usuario.
- Si no hay repositorio o el directorio no tiene archivos versionados → `fs.renameSync` (`moveMethod: rename`) y aviso `⚠️ <origen> no tiene historial de git: se movió sin git mv`. No hay historial que conservar, así que CNF-3 se cumple trivialmente.

Esto resuelve la nota «Pendiente de refinar» de la historia (CR-002).

| Alternativa | Motivo del rechazo |
|---|---|
| Fallar cerrado si el directorio no está versionado (como `migrate-specs-to-flow.js`) | Bloquearía a quien no usa git o no ha hecho commit de la historia, sin proteger nada: no hay historial que perder. La migración bloqueaba porque movía cientos de directorios en lote; aquí es uno. |
| Siempre `fs.renameSync` y luego `git add -A` | Depende de la heurística de detección de renombres de git (umbral de similitud) y, con `story.md` modificado, podría registrarse como borrado + alta; además añadiría al índice archivos que el usuario no pidió versionar. |

### D-7 — Edición mínima del frontmatter // satisface: AC-1, AC-3

Solo para `action: complete`: se reemplaza la primera línea `status: DELIVER` del bloque de frontmatter por `status: COMPLETED` y la línea `updated: …` por `updated: <today>`; si `updated:` no existe se inserta inmediatamente después de `created:` o, si tampoco existe, antes del `---` de cierre. `substatus: DONE` ya es el valor final y no se toca. Se preservan los finales de línea detectados (`\r\n` o `\n`) y el resto de bytes; se escribe UTF-8 sin BOM. Con `action: archive-only`, `story.md` no se abre en escritura.

| Alternativa | Motivo del rechazo |
|---|---|
| Parsear y reserializar el YAML | Reordena claves y cambia comillas: modifica bytes ajenos a la transición y ensucia el diff del archivo archivado. |
| Escribir también `substatus: DONE` | Redundante: la precondición garantiza `DONE`. |

### D-8 — Confirmación humana y mensajes en el SKILL.md // satisface: AC-1, AC-2, AC-3, CNF-6

1. El SKILL.md invoca `plan`. Si `ok: false`, muestra `❌ <message>` y termina **sin preguntar** (AC-2, filas 2 y 3 de AC-3).
2. Si `ok: true`, muestra el resumen: historia, estado actual, acción (`COMPLETED/DONE` con `updated: <today>` o «sin cambio de status»), origen, destino y método de movimiento.
3. Pregunta `¿Confirmas completar y archivar STORY-NNN en <destino>? (s/n)`. Solo `s`/`si`/`sí` (sin distinguir mayúsculas) confirma. Cualquier otra respuesta → `Operación cancelada por el usuario: no hubo cambios.` y termina sin invocar `apply` (fila 1 de AC-3).
4. Tras `s`, invoca `apply` y muestra `✅ STORY-NNN archivada en <to>` (más `status: COMPLETED/DONE · updated: <today>` si fue `complete`, y el aviso de D-6 si fue `rename`), recordando que el commit queda a cargo del usuario. Si `apply` devuelve `ok: false`, muestra `❌ <message>` y lo que quedó (D-5 pasos 6–7).

No hay modo automático ni `--yes`: `story-complete` es el escritor humano-confirmado de un estado terminal (CNF-6).

| Alternativa | Motivo del rechazo |
|---|---|
| Preguntar antes de validar fecha y destino | Haría confirmar una operación que luego aborta; AC-3 pide nombrar el conflicto sin efectos, y validar primero lo hace sin preguntar. |
| Confirmación dentro del motor (lectura de stdin) | Mezcla interacción y lógica de filesystem; impide probar el motor sin TTY. |

### D-9 — Contrato de la CLI del motor // satisface: AC-1, AC-2, AC-3, CNF-5

Invocación desde `REPO_ROOT`:

`node <CLI_ROOT>/skills/story-complete/scripts/story-complete.js <plan|apply> --repo-root <REPO_ROOT> (--id STORY-NNN | --path <ruta>)`

- Salida: un único objeto JSON en stdout (esquema en § Esquema de datos). Código de salida `0` si `ok: true`, `1` si `ok: false`, `2` ante argumentos inválidos (subcomando desconocido, `--id` y `--path` a la vez o ninguno, `--id` mal formado), con el error en stderr.
- Funciones exportadas (`module.exports`), usadas por C-5: `locateStory({ repoRoot, id, storyPath })`, `archiveDateOf(frontmatter)`, `planCompletion({ repoRoot, id, storyPath, today })`, `applyCompletion({ repoRoot, id, storyPath, today })`. `readFrontmatter` y `countStories` son internas.

`CLI_ROOT` se resuelve como en `memory-system` (instalación del paquete, nunca derivado de `REPO_ROOT`). Si el motor no se encuentra o `node` no está en PATH, el SKILL.md termina con `❌ No se encontró el motor de story-complete (<ruta probada>) o node no está en PATH` sin tocar nada.

| Alternativa | Motivo del rechazo |
|---|---|
| Salida en texto para humanos | El SKILL.md tendría que parsear texto; el JSON separa datos (motor) de presentación (skill). |
| Un único subcomando con `--dry-run` | `plan`/`apply` hace explícito que la confirmación ocurre entre ambos y que `plan` nunca escribe. |

### D-10 — Redacción de dominio y coordinación con STORY-159 // satisface: CNF-6

Texto objetivo (la implementación puede ajustar la prosa, no el contenido). `COMPLETED` de **épica** sigue siendo manual.

- `domain-state-management.md` §4 invariante 6: retirar `COMPLETED` de story de la prohibición y añadir «`COMPLETED` de story la escribe `story-complete` desde `DELIVER/DONE`, siempre con confirmación humana explícita; además archiva sin cambiar el status las historias que ya están en `COMPLETED/DONE`.» §5.2: añadir `story-complete` como caso de transición terminal escrita por un skill tras confirmación humana.
- `domain-story-lifecycle.md` §5 fila `COMPLETED`: descripción «… La escribe `story-complete` desde `DELIVER/DONE` con confirmación humana y archiva la historia en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`; las historias ya `COMPLETED/DONE` se archivan sin cambiar su status.»; actor «Humano (vía `story-complete`)».
- `domain.md` BR-006: `COMPLETED` de story sale de la lista de no escritos por skills, con la misma salvedad de confirmación humana.
- `state-machine.md`: línea 72 y párrafo de la línea 108 dejan de decir que ningún skill escribe `COMPLETED`; nueva fila en la tabla de transiciones por skill: `story-complete` · precondición `DELIVER/DONE` o `COMPLETED/DONE` · inicio — · éxito `COMPLETED/DONE` + archivado · fallo — (sin cambios).

Coordinación: STORY-159 retira `DELIVER` de las mismas frases (su D-9). Esta historia edita **solo** la parte de `COMPLETED`, sobre el texto que encuentre en el momento de implementar: si STORY-159 ya se implementó, la frase sigue sin `DELIVER`; si no, `DELIVER` permanece en la prohibición. No se reescribe el invariante entero ni se crea ADR (los documentos de dominio no son ADR inmutables).

| Alternativa | Motivo del rechazo |
|---|---|
| Reescribir el invariante para `DELIVER` y `COMPLETED` a la vez | Invade STORY-159 y declararía un escritor de `DELIVER` que puede no existir aún (regla de Veracidad). |
| Nota al pie con la excepción | Deja el invariante literal falso; CNF-6 exige que lo declare. |

### D-11 — Estructura del SKILL.md, sin DoD propio ni reporte // satisface: CNF-1, AC-1, AC-2, AC-3

Secciones en el orden de `story-acceptance`: frontmatter (`name`, `description`, `triggers`, `outputs`), `## Objetivo`, `## Posicionamiento` (después de `story-delivery`), `## Entrada`, `## Parámetros`, `## Precondiciones`, `## Dependencias`, `## DoD aplicable`, `## Modos de ejecución` (solo manual), `## Restricciones / Reglas`, `## Flujo de ejecución` (Paso 0 con el bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->` idéntico al de los demás skills; Paso 1 resolver argumentos; Paso 2 localizar el motor; Paso 3 `plan`; Paso 4 confirmación; Paso 5 `apply`; Paso 6 resultado), `## Manejo de errores` (tabla código → mensaje de D-2…D-5) y `## Salida`.

`## DoD aplicable` declara «N/A — el cierre no tiene DoD propio: el DoD de entrega lo verifica `story-delivery` antes de `DELIVER/DONE`». No se crea `dod-story-complete.md` ni etapa en `DOD_STAGES`, y el skill no emite reporte ni `verdict` (no es un gate de validación).

| Alternativa | Motivo del rechazo |
|---|---|
| Crear `dod-story-complete.md` y una etapa `complete` | Duplica el DoD de entrega sin un criterio nuevo que verificar; ningún AC lo pide. |
| `complete-report.md` en el directorio archivado | Artefacto sin consumidor; la trazabilidad la dan el renombre en git y `updated:`. |

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| Invocación del skill | `/story-complete {STORY-NNN \| ruta}`. Sin argumento → pregunta el ID. Sin flags. | AC-1 |
| CLI del motor | `story-complete.js <plan\|apply> --repo-root <dir> (--id STORY-NNN \| --path <ruta>)` → JSON en stdout; exit `0`/`1`/`2` (D-9). | AC-1…AC-3 |
| `planCompletion(opts)` | Solo lectura. Devuelve `CompletionResult` (D-2…D-4, D-6 para `moveMethod`). | AC-1, AC-2, AC-3, CNF-5 |
| `applyCompletion(opts)` | Re-planifica, escribe (D-7), mueve (D-6), verifica conteo (D-5). Devuelve `CompletionResult`. | AC-1, CNF-3, CNF-4 |
| `locateStory(opts)` | `{ ok, dir, code?, matches? }` (D-3). | CNF-5, AC-2 |
| `archiveDateOf(frontmatter)` | `YYYY-MM-DD` de `updated:` → `created:`, o `null` (D-4). | AC-1, AC-3 |
| Confirmación | `¿Confirmas completar y archivar STORY-NNN en <destino>? (s/n)` — se omite si `plan` falla. | AC-1, AC-3, CNF-6 |
| Escritura | `story.md`: `status: COMPLETED`, `updated: <today>`; solo con `action: complete` y tras `s`. | AC-1 |
| Movimiento | `specs/flow/STORY-NNN-<slug>/` → `specs/flow/archive/<fecha>-STORY-NNN-<slug>/` vía `git mv` o `rename` (D-6). | AC-1, CNF-3 |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

`CompletionResult` (JSON del motor):

| Campo | Tipo | Valores / significado |
|---|---|---|
| `ok` | booleano | `true` solo en `plan` admitido o `apply` completado |
| `code` | enum | `OK` · `NOT_FOUND` · `AMBIGUOUS` · `INVALID_PATH` · `NO_STORY_FILE` · `NO_STATUS` · `NOT_DELIVERED` · `CANCELED_NOT_ADMITTED` · `NO_ARCHIVE_DATE` · `ARCHIVE_CONFLICT` · `WRITE_FAILED` · `MOVE_FAILED` · `ROLLBACK_FAILED` · `COUNT_MISMATCH` |
| `message` | texto | mensaje en español con el contenido obligatorio de D-2…D-5 |
| `story` | objeto | `{ id, dir, status, substatus }` (relativo a `REPO_ROOT`); ausente si no se localizó |
| `matches` | lista | rutas coincidentes (solo `AMBIGUOUS`) |
| `action` | enum | `complete` · `archive-only` |
| `archiveDate` | texto | `YYYY-MM-DD` |
| `from` / `to` | texto | rutas relativas a `REPO_ROOT` con `/` |
| `moveMethod` | enum | `git-mv` · `rename` |
| `warnings` | lista | p. ej. aviso de D-6 |
| `counts` | objeto | `{ before, after }` (solo `apply`) |

Casos de `evals.json` (C-4), con el formato de `skills/story-acceptance/evals/evals.json` (`skill`, `version`, `description`, `cases[]` con `id: TC-NNN`, `name`, `type`, `description`, `input`, `expected.contains`/`not_contains`): TC-001 `DELIVER/DONE` confirmado (AC-1 fila 1), TC-002 `COMPLETED/DONE` sin reescritura (AC-1 fila 2), TC-003 `ACCEPTANCE/DONE` rechazado con sugerencia de `/story-delivery` y sin pregunta (AC-2), TC-004 `CANCELED/DONE` rechazado citando ADR-0016 (AC-2), TC-005 rechazo de la confirmación sin cambios (AC-3 fila 1), TC-006 destino existente nombrado sin pregunta (AC-3 fila 2). El fixture `DELIVER/DONE` se fija a mano, sin depender de STORY-159 (recomendación I del FINVEST).

Pruebas del motor (C-5, `node --test`, repositorios git temporales con `git init`): todas las filas de AC-1, AC-2 y AC-3 sobre `planCompletion`/`applyCompletion`, más: `AMBIGUOUS` con dos directorios `STORY-NNN-*` (CNF-5); historia solo en `archive/` → `NOT_FOUND` con pista (CNF-5); `git log --follow` muestra el commit previo tras `apply` (CNF-3); un archivo sin versionar dentro del directorio viaja con él (D-6); directorio sin archivos versionados → `rename` + aviso (D-6); fallo forzado del movimiento → `story.md` restaurado byte a byte y conteo igual (CNF-4); `\r\n` preservados (D-7).

## Flujos clave

### F-1 — Completar una historia `DELIVER/DONE` // AC-1 fila 1

1. Paso 0: resolver `REPO_ROOT` (layout fijo) y `CLI_ROOT`.
2. Paso 3: `plan --id STORY-NNN` → `ok`, `action: complete`, `archiveDate: <today>`, `to: specs/flow/archive/<today>-STORY-NNN-<slug>`, `moveMethod: git-mv`.
3. Paso 4: resumen + confirmación → `s`.
4. Paso 5: `apply` → recalcula plan → escribe `status: COMPLETED` / `updated: <today>` → `git mv` → conteo igual → `OK`.
5. Paso 6: `✅ STORY-NNN archivada en <to>` · `COMPLETED/DONE` · commit a cargo del usuario.

### F-2 — Archivar una historia `COMPLETED/DONE` // AC-1 fila 2

Igual que F-1, con `action: archive-only` y `archiveDate` de `updated:` → `created:`; en `apply` se omite el paso 3 de D-5: `story.md` no cambia ni un byte.

### F-3 — Rechazos y abortos sin efectos // AC-2, AC-3, CNF-4

- Historia no encontrada, ambigua, ruta inválida, estado no admitido, `CANCELED`, sin fecha o destino existente → `plan` devuelve `ok: false`; el skill muestra el mensaje y termina sin preguntar. `plan` no escribe.
- Respuesta ≠ `s` → el skill termina sin invocar `apply`.
- Fallo en `apply` antes del movimiento → nada movido; fallo del movimiento → restauración (D-5).

### F-4 — Degradación // P7

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| `node` o el motor | ausente | fail-closed en el Paso 2 del skill, sin cambios (D-9) |
| git | no instalado, sin repositorio o directorio sin versionar | movimiento `rename` con aviso (D-6) |
| `git mv` | error (p. ej. `index.lock` presente) | `MOVE_FAILED` + restauración de `story.md` (D-5) |
| Restauración | error de E/S | `ROLLBACK_FAILED` con instrucciones de recuperación (D-5) |
| Escritura de `story.md` | error de E/S | `WRITE_FAILED`, nada movido |
| Estado del filesystem cambió entre `plan` y `apply` | p. ej. destino creado | `apply` re-planifica y aborta con el código correspondiente (D-5 paso 1) |

### F-5 — Puntos de cambio // P6

- Admisión (D-2): STORY-164 añade la fila `CANCELED/DONE` → `archive-only` y el respaldo `date:` en `archiveDateOf` (D-4); ambos cambios quedan aislados en una tabla y una función.
- Mecanismo de movimiento (D-6): aislado en una función interna; cambiarlo no afecta a la validación ni a la escritura.
- Presentación: los mensajes se construyen en el motor por código; el SKILL.md solo los muestra.

## Decisiones de complejidad justificada

- **Motor Node además del SKILL.md (D-1):** un skill solo en Markdown sería más simple, pero CNF-4 (restaurar ante fallo), CNF-5 (fallar cerrado ante ambigüedad) y el conteo necesitan un comportamiento determinista y probable con `node --test` sin consumir cuota de evals. El motor tiene dos subcomandos y no añade dependencias.
- **`plan`/`apply` separados (D-9):** la mínima separación que permite validar todo antes de la confirmación (AC-3) sin que el motor lea stdin.
- **Restauración solo de `story.md` (D-5):** es lo único que se escribe antes del movimiento; no se necesita un registro de transacciones.
- **Sin DoD, reporte ni etapa nueva (D-11):** la opción más simple; ningún AC los requiere.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| 1 | `DELIVER/DONE` → `COMPLETED/DONE`, `updated:` de hoy, destino con esa fecha, origen inexistente, ruta final informada | `test/story-complete.test.js` + eval TC-001 | AC-1 fila 1 |
| 2 | `COMPLETED/DONE` → archivado con la fecha de `updated:`/`created:` y `story.md` byte a byte igual | test + eval TC-002 | AC-1 fila 2 |
| 3 | `git log --follow` sobre el `story.md` archivado muestra el commit previo | test (repo temporal) | AC-1, CNF-3 |
| 4 | Cuatro filas de AC-2 → código y mensaje esperados, sin cambios en el árbol ni pregunta | test + evals TC-003, TC-004 | AC-2 |
| 5 | Tres filas de AC-3 → sin cambios de status, `updated:` ni directorio | test (filas 2 y 3) + eval TC-005, TC-006 | AC-3 |
| 6 | Fallo forzado del movimiento → `story.md` restaurado y activas + archivadas = previo | test | CNF-4 |
| 7 | Dos directorios `STORY-NNN-*` → `AMBIGUOUS`; historia solo archivada → `NOT_FOUND` | test | CNF-5 |
| 8 | Marcador de layout y resolución solo de `REPO_ROOT` | `node scripts/verify-fixed-layout.js` | CNF-1 |
| 9 | Skill incluido en el paquete | `npm pack --dry-run` lista `skills/story-complete/SKILL.md` y `scripts/story-complete.js` | CNF-2 |
| 10 | Documentos de dominio declaran `story-complete` como escritor de `COMPLETED` de story con confirmación humana; `COMPLETED` de épica sigue manual | revisión por búsqueda (`grep -n "story-complete"` en C-6…C-11) | CNF-6 |
| 11 | Gate completo | `npm run verify:repository` y `npm test` en verde (incluye `verify-eval-inventory` con C-4) | CNF-7 |

## Risks / Trade-offs

- [`git mv` de un directorio con archivos sin versionar se comporta distinto según la versión de git] → contrato 3 y la prueba de D-6 lo fijan; si falla, `MOVE_FAILED` restaura `story.md` (nunca un estado a medias).
- [Windows: rutas sin distinguir mayúsculas y `\`] → las rutas se normalizan a `/` relativas a `REPO_ROOT`; la comparación de raíz de repo replica `isRepoRoot` (minúsculas en `win32`).
- [Fecha local vs. `updated:` escrito por otra herramienta en UTC] → se acepta: la regla de ADR-0016 es la fecha del frontmatter, y en `complete` ambos valores salen del mismo `today`.
- [Conflicto de edición con STORY-159 en el invariante 6] → D-10 limita la edición a la parte de `COMPLETED`; orden recomendado: STORY-159 antes que STORY-160.
- [Duplicación de `readFrontmatter` con `migrate-specs-to-flow.js`] → se acepta (CR-004): el script de migración es de un solo uso y no se instala con los skills.
- [Trade-off: sin `--yes`, el skill no se puede encadenar en CI] → deliberado por CNF-6.

## Open Questions

Ninguna bloqueante. La nota «Pendiente de refinar» de la historia se resuelve en D-6 (CR-002).

## Autoevaluación (P9, P10)

- **Cobertura:** AC-1 → D-2, D-4, D-5, D-6, D-7, F-1, F-2; AC-2 → D-2, D-3, D-8, F-3; AC-3 → D-4, D-5, D-8, F-3; CNF-1 → D-4, D-11; CNF-2 → CR-001; CNF-3 → D-6; CNF-4 → D-5; CNF-5 → D-3; CNF-6 → D-8, D-10; CNF-7 → C-4, C-5.
- **Omisiones:** `CANCELED`, `date:` y épicas son Non-Goals explícitos. La interacción con `epic.md` queda fuera según la historia.
- **Ambigüedad:** directorio sin versionar → D-6; estados no listados en AC-2 → fila genérica `NOT_DELIVERED` de D-2.
- **Nombres:** un solo término por concepto: «completar» (escribir `COMPLETED`), «archivar» (mover a `specs/flow/archive/`), «fecha de archivo», «motor», «confirmación».
- **Estructura:** sin ciclos (SKILL.md → motor → filesystem/git; las pruebas → motor). El motor no conoce la interacción y el SKILL.md no conoce el filesystem. Interfaces estrechas: dos subcomandos y cuatro funciones exportadas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: reutilización
- **Descripción**: CNF-2 pide agregar `skills/story-complete` al arreglo `files` de `package.json`, pero `files` ya incluye `skills/` completo (`["skills/", "config/", "scripts/", "sddf.config.yaml", "README.md", "LICENSE"]`). Añadir la entrada sería redundante. Mismo hallazgo que CR-001 de STORY-159.
- **Documento afectado**: story.md (CNF-2)
- **Acción requerida**: no modificar `package.json`; CNF-2 se verifica con `npm pack --dry-run` (contrato 9). Opcional: reformular CNF-2 como «`skills/story-complete` se incluye en el paquete publicado».

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la historia deja «Pendiente de refinar» qué hacer si el directorio no está versionado.
- **Documento afectado**: story.md (Notas, CNF-3)
- **Acción requerida**: resuelto en D-6 (movimiento simple con aviso; no hay historial que perder). Opcional: documentarlo en CNF-3, como sugiere la nota E del FINVEST.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la historia no menciona que el gate exige evals o una excepción por skill (`verify-eval-inventory`), ni que el motor necesita pruebas unitarias, ni que la prohibición de que un skill escriba `COMPLETED` también aparece en `docs/domains/domain.md` (BR-006) y `docs/architecture/state-machine.md`, ni que `README.md` y `docs/guides/sddf-commands-pipeline.md` describen el archivado sin nombrar quién lo hace (regla de Veracidad de `AGENTS.md`).
- **Documento afectado**: design.md
- **Acción requerida**: incluidos como C-4, C-5 y C-8…C-11; sin cambio en story.md.

### CR-004
- **Tipo**: reutilización
- **Descripción**: la historia sugiere reutilizar `archiveDate` de `scripts/migrate-specs-to-flow.js`. No es reutilizable directamente: el script es de un solo uso (CS-11 de STORY-153), no se instala con los skills y su `archiveDate` acepta `date:`, que es alcance de STORY-164.
- **Documento afectado**: design.md
- **Acción requerida**: el motor (C-2) replica la regla `updated:` → `created:` y las regex de conteo, citando el origen; `migrate-specs-to-flow.js` no se modifica.

### CR-005
- **Tipo**: desviación (implementación)
- **Descripción**: D-11 y T014 piden un frontmatter con `triggers` y `outputs`, como `story-acceptance`. `docs/guardrails/gr-skill-creation-checklist.md` (regla `skill-frontmatter-keys`, error) solo admite `name`, `description`, `allowed-tools` y `license`, y `skills/story-delivery/SKILL.md` ya sigue esa regla.
- **Documento afectado**: design.md (D-11), tasks.md (T014)
- **Acción requerida**: `skills/story-complete/SKILL.md` declara solo `name` y `description`; los disparadores viven en `description` y las salidas en `## Salida`.

### CR-006
- **Tipo**: dependencia (implementación)
- **Descripción**: `docs/requirements/functional/FR-046-gestion-de-estados-a-lo-largo-del-workflow.md` también afirmaba que la transición a `COMPLETED` nunca la escribe un skill (regla de Veracidad de `AGENTS.md`); no figuraba entre C-6…C-11.
- **Documento afectado**: design.md (Componentes afectados)
- **Acción requerida**: FR-046 declara que `COMPLETED` de story la escribe solo `story-complete` desde `DELIVER/DONE`, con confirmación humana; se conserva la frase de `DELIVER` que dejó STORY-159.
