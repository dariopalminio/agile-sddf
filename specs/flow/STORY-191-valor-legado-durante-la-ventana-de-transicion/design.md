---
alwaysApply: false
type: design
id: STORY-191
slug: STORY-191-valor-legado-durante-la-ventana-de-transicion-design
title: "Design: Valor legado durante la ventana de transición"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-191
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
---

<!-- Referencias -->
[[STORY-191-valor-legado-durante-la-ventana-de-transicion]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-188-la-planificacion-termina-en-plan-done]] · [[STORY-189-el-rework-vuelve-a-implement-todo]] · [[STORY-190-directivas-de-correccion-desde-verify-y-acceptance]]

## Context

ADR-0022 (lo crea STORY-186, D-06 de su diseño) fija la regla del valor legado: en 6.x, una historia en `READY-FOR-IMPLEMENT/DONE` se trata como `IMPLEMENT/TODO` si existe `implement-report.md` en su directorio y como `PLAN/DONE` si no. Una épica con un `status` legado equivale a `PLAN/DONE`. La ventana se abre en 6.0.0 y **termina en 7.0.0**. La migración es una edición manual: no hay `memory-system migrate`. Esta historia implementa la regla en los dos ejecutores (alias con aviso) y en `skill-preflight` (señal `[WARNING]` de solo lectura).

Estado verificado en el filesystem (2026-11-13) y estado que dejan las historias anteriores de la cadena (STORY-188 → STORY-189 → STORY-190 → STORY-191):

- **`story-implement`** (Paso 0c.2, `SKILL.md:265-291`) admite hoy `READY-FOR-IMPLEMENT/DONE` e `IMPLEMENT/IN-PROGRESS` y registra `$ENTRADA_STATUS`. 0c.4 (`SKILL.md:319-335`) escribe `IMPLEMENT/IN-PROGRESS` según `$ENTRADA_STATUS` y muestra la línea `Estado`. `READY-FOR-IMPLEMENT` aparece también en las líneas 33 (resumen del Paso 0c), 54 (posicionamiento), 325 y 331-334 (0c.4).
- **`story-implement-tasks`** (Paso 1d, `SKILL.md:230-268`) tiene el mismo gate y `$ENTRADA_STATUS`. 2c (`SKILL.md:320-328`) tiene el gate de salida anticipada, y 2e (`SKILL.md:365-374`) la transición. `READY-FOR-IMPLEMENT` aparece también en las líneas 42, 91, 139, 266 y 370.
- **Tras STORY-188:** los ejecutores admiten `PLAN/DONE`; `PLAN` se trata como `READY-FOR-IMPLEMENT` en la transición de arranque, y el rechazo lista `READY-FOR-IMPLEMENT/DONE` al final, con la etiqueta «valor anterior a 6.0.0» (D-02 de STORY-188, que deja a esta historia el cambio de etiqueta).
- **Tras STORY-189:** los ejecutores admiten `IMPLEMENT/TODO`, registran `$ENTRADA_SUBSTATUS` y escriben `IMPLEMENT/IN-PROGRESS` por exclusión (toda entrada admitida salvo `IMPLEMENT/IN-PROGRESS`). El gate de salida anticipada de 2c no aplica a `IMPLEMENT/TODO`. `READY-FOR-IMPLEMENT/DONE` sigue sin aviso y con el gate anticipado (D-05 de STORY-189, que deja su clasificación a esta historia). Los casos de eval de rework migran a `IMPLEMENT/TODO`; quedan como legado `story-implement` TC-011, TC-022, TC-033 y el caso nuevo `rework-legado-ready-for-implement-con-fix-directives`, y `story-implement-tasks` TC-002, TC-003 y TC-004.
- **Tras STORY-190:** con entrada `IMPLEMENT/TODO` y sin `fix-directives.md`, los dos ejecutores emiten `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md — se continúa sin modo rework (la única señal de rework es fix-directives.md)` (`story-implement` 0c.3, `story-implement-tasks` 2c). La condición usa `$ENTRADA_STATUS = IMPLEMENT` y `$ENTRADA_SUBSTATUS = TODO` (D-07 de STORY-190). La fila 3 de AC-1 depende de ese aviso.
- **`skill-preflight`** (`SKILL.md`, 160 líneas) es de solo lectura y emite `[OK]`/`[WARNING]`. La Verificación 3 (`SKILL.md:90-112`) evalúa las señales L1-L3 de layout legado dentro de la región `<!-- SDDF-LEGACY-DIAGNOSTIC:start/end -->`. Esas señales controlan dos cosas: el sufijo `— ejecuta /sddf-init` de la Verificación 2 (solo sin señales) y la línea `ℹ️ Guía de migración: docs/guides/artifact-directory-migration.md`. `scripts/verify-fixed-layout.js` usa la región solo para eximir los tokens `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` y `SDDF_ROOT`; `READY-FOR-*` no es un token de ese validador. Sus evals (`2.1.0`) tienen 4 casos: TC-004 a TC-007. `README.md` (57 líneas) lista las señales en «Señales de layout legado».
- Ningún `story.md` ni `epic.md` de este repositorio tiene `READY-FOR-*` en el frontmatter (nota de la historia): el alias y la señal protegen a los proyectos consumidores.
- `.claude/skills/` y los demás destinos de runtime son salida de `agile-sddf install`: no se editan.

## Goals / Non-Goals

**Goals:**

- `story-implement` y `story-implement-tasks` aceptan `READY-FOR-IMPLEMENT/DONE` con un aviso que cita ADR-0022, la versión que lo retira (7.0.0) y el equivalente, y lo clasifican por `implement-report.md`. // satisface: AC-1, CNF-1
- Tras la clasificación, el resto de cada ejecutor trabaja con el equivalente: transición a `IMPLEMENT/IN-PROGRESS`, modo rework por `fix-directives.md`, aviso de STORY-190 y gate anticipado de STORY-189. // satisface: AC-1, CNF-4
- El rechazo de los ejecutores lista los tres estados nuevos y el valor legado. // satisface: AC-3 (fila 1)
- `skill-preflight` emite un `[WARNING]` por cada `story.md` o `epic.md` activo de `specs/flow/` con `status` legado, con ruta, valor y destino, sin escribir ni interrumpirse, y omite `specs/flow/archive/`. // satisface: AC-2, AC-3 (fila 2), CNF-3
- `READY-FOR-IMPLEMENT` solo aparece en el gate de entrada de los ejecutores y en la señal de `skill-preflight`. // satisface: CNF-2
- Evals primero y gate verde. // satisface: CNF-5, CNF-6

**Non-Goals:**

- MAD-03 de `/epic-analyze` ante el valor legado: STORY-192.
- `memory-system migrate` o cualquier reescritura automática de `status` (CNF-4 y Non-Goals de la historia).
- Inspeccionar `specs/flow/archive/`.
- Un alias de ejecución para `READY-FOR-DEV`: ningún archivo lo usó nunca (ADR-0022), así que solo lo informa `skill-preflight`, y los ejecutores lo rechazan (AC-3).
- Guías, `README.md` raíz, dominio y ejemplos de otros skills: STORY-187 y STORY-193.
- Cambiar el contrato de `fix-directives.md`, la regla de `round` o el gate anticipado para `PLAN/DONE`.

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Evals de `story-implement` | modificar (+2 casos, 1 caso ajustado, migración por la regla) | `skills/story-implement/evals/evals.json` | CNF-5, AC-1, AC-3 |
| C-2 | Evals de `story-implement-tasks` | modificar (+2 casos, migración por la regla) | `skills/story-implement-tasks/evals/evals.json` | CNF-5, AC-1 |
| C-3 | Evals de `skill-preflight` | modificar (+5 casos) | `skills/skill-preflight/evals/evals.json` | CNF-5, AC-2, AC-3, CNF-3 |
| C-4 | Clasificador del valor legado de `story-implement` | modificar (0c.2; textos de 0c.4 y del resto del skill) | `skills/story-implement/SKILL.md` | AC-1, AC-3, CNF-1, CNF-2, CNF-4 |
| C-5 | Clasificador del valor legado de `story-implement-tasks` | modificar (1d; textos de 2e, posicionamiento y tablas de estado) | `skills/story-implement-tasks/SKILL.md` | AC-1, AC-3, CNF-1, CNF-2, CNF-4 |
| C-6 | Señal de status legado de `skill-preflight` | modificar (Verificación 3b nueva, «Usar cuando», «No hace», «Informe final») | `skills/skill-preflight/SKILL.md` | AC-2, AC-3, CNF-1, CNF-2, CNF-3 |
| C-7 | README de los tres skills | modificar | `skills/story-implement/README.md`, `skills/story-implement-tasks/README.md`, `skills/skill-preflight/README.md` | AC-1, AC-2, CNF-2 |

No se crea ningún archivo ni script. P3: se reutilizan el gate de entrada y las variables `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` de STORY-188 y STORY-189, el aviso de STORY-190, el formato `[WARNING]` de las señales L1-L3 y la forma `context` + `contains`/`not_contains` de los casos de `skill-preflight`.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Regla del valor legado (texto idéntico en los tres skills) | historia: `IMPLEMENT/TODO` si existe `implement-report.md` en su directorio, `PLAN/DONE` si no; épica: `PLAN/DONE`. Valores legados: `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`. Fuente: ADR-0022; la ventana termina en 7.0.0 | CNF-1 |
| Precondición de entrada de los ejecutores | válida si `PLAN/DONE` · `IMPLEMENT/TODO` · `IMPLEMENT/IN-PROGRESS` · `READY-FOR-IMPLEMENT/DONE` (valor legado). Cualquier otro par, `READY-FOR-DEV/*` y `READY-FOR-IMPLEMENT` con otro `substatus` incluidos, se rechaza sin escribir. Campos ausentes ⇒ `SPECIFY/TODO` (sin cambio) | AC-1, AC-3 |
| Variables del clasificador | `$ENTRADA_LEGADO` ∈ {`true`, `false`}: `true` solo si se leyó `READY-FOR-IMPLEMENT/DONE`. Con `true`, `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` se sustituyen **en memoria** por el equivalente (`IMPLEMENT`/`TODO` o `PLAN`/`DONE`) antes de cualquier otra regla. `story.md` no se escribe en este punto | AC-1, CNF-4 |
| Aviso del valor legado (los dos ejecutores) | `[WARN] Valor legado READY-FOR-IMPLEMENT/DONE (ADR-0022): se acepta durante la ventana de transición y se retira en 7.0.0 — se trata como <equivalente>`, con `<equivalente>` ∈ {`PLAN/DONE`, `IMPLEMENT/TODO`}. Se emite una vez, justo después de pasar el gate y antes de la detección de rework (story-implement 0c.3) o de la carga de contexto (story-implement-tasks, Paso 2). No detiene | AC-1, CNF-1 |
| Línea `Estado` del bloque de inicio | muestra el equivalente, como si se hubiera leído: `Estado: PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS` o `Estado: IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS` (formatos de STORY-188 y STORY-189). El valor leído solo aparece en el aviso | AC-1, CNF-2 |
| Línea del valor legado en el rechazo | última línea de `Estados admitidos`: `· READY-FOR-IMPLEMENT/DONE  (valor legado, se acepta con aviso hasta 7.0.0 — ADR-0022)`. Sustituye la etiqueta «valor anterior a 6.0.0» de STORY-188. El orden queda `PLAN/DONE`, `IMPLEMENT/TODO`, `IMPLEMENT/IN-PROGRESS`, `READY-FOR-IMPLEMENT/DONE` | AC-3 (fila 1) |
| Señal de status legado de `skill-preflight` | por cada archivo con `status` legado: `[WARNING] Status legado: <ruta relativa a REPO_ROOT> tiene status <valor> — edítalo a mano a <destino> (ADR-0022, la ventana termina en 7.0.0)`, con `<destino>` ∈ {`PLAN/DONE`, `IMPLEMENT/TODO`} | AC-2, CNF-1 |
| Frontmatter ilegible en `skill-preflight` | `[WARNING] <ruta relativa>: frontmatter ilegible — status legado no evaluado`, y el diagnóstico continúa | CNF-3 |
| Alcance del escaneo de `skill-preflight` | `specs/flow/*/story.md` y `specs/flow/*/epic.md`, solo hijos directos de `specs/flow/` y excluido el directorio `archive/`. Sin `specs/flow/`, la verificación no emite nada (la Verificación 2 ya avisa) | AC-2, AC-3 (fila 2) |

## Decisions

### D-01 — Normalizar la entrada en memoria // satisface: AC-1, CNF-4

- **Elegida:** el gate admite `READY-FOR-IMPLEMENT/DONE`, emite el aviso y sustituye `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` por el equivalente. Todas las reglas posteriores, ya escritas por STORY-188 a STORY-190, se aplican sin cambios: la transición por exclusión pasa la historia a `IMPLEMENT/IN-PROGRESS`, `fix-directives.md` decide el modo rework (fila 2), el aviso de STORY-190 salta con `IMPLEMENT/TODO` sin directivas (fila 3) y el gate anticipado de 2c no aplica a `IMPLEMENT/TODO`.
- **Rechazadas:** (a) Ramas propias de `READY-FOR-IMPLEMENT` en 0c.3, 0c.4, 2c y 2e: repite la regla en cuatro sitios y deja el valor legado fuera del gate, en contra de CNF-2. (b) Reescribir `status` al equivalente antes de seguir: CNF-4 lo prohíbe, y deja una escritura extra que no se distingue de la transición normal. (c) Clasificar por `fix-directives.md`: ADR-0022 lo descarta, porque clasifica como `PLAN/DONE` los rechazos legados de verify y acceptance, que no escribían directivas (nota de la historia).
- **Consecuencia:** la fila 3 de AC-1 (`/story-implement-tasks`, con `implement-report.md` y sin `fix-directives.md`) cambia de comportamiento respecto a STORY-189: deja de salir por el gate anticipado y emite el aviso de STORY-190. Es el resultado esperado de la regla.

### D-02 — Qué se comprueba para clasificar // satisface: AC-1, CNF-1

- **Elegida:** existencia de `$STORY_DIR/implement-report.md` (story-implement) o de `<ruta_directorio>/implement-report.md` (story-implement-tasks), sin leer su contenido. Un archivo vacío cuenta como existente.
- **Rechazadas:** (a) Validar el contenido del reporte (veredicto o secciones de ronda): la regla del ADR es de presencia, y leer el reporte vuelve a acoplar el ejecutor a un formato. (b) Mirar también `verify-report.md` o `acceptance-report.md`: STORY-190 (CNF-5) prohíbe usar los reportes de los gates como señal.

### D-03 — `skill-preflight`: verificación propia, fuera de la región de layout // satisface: AC-2, CNF-2, CNF-3

- **Elegida:** una «Verificación 3b — Status legado de work items» entre la Verificación 3 y la 4, fuera de la región `SDDF-LEGACY-DIAGNOSTIC`, con su propia tabla de señal (S1) y el mismo formato de línea que L1-L3. No numera de nuevo las Verificaciones 4 y 5, que ADR-0001 y ADR-0007 citan (aunque por un número antiguo).
- **Rechazadas:** (a) Añadir filas L4/L5 a la tabla L1-L3: activarían la línea `ℹ️ Guía de migración` del layout y quitarían el sufijo `— ejecuta /sddf-init` de la Verificación 2 a un proyecto con el layout fijo y una historia legada, que no necesita migrar el layout. (b) Renumerar a Verificación 4: cambia la referencia de las Verificaciones 4 y 5 sin necesidad. (c) Meterla en la región `SDDF-LEGACY-DIAGNOSTIC`: la región exime tokens de layout en `verify-fixed-layout.js`, y `READY-FOR-*` no es uno de ellos.
- La verificación no tiene línea de cierre `ℹ️`: cada `[WARNING]` ya dice qué editar, a qué valor y hasta cuándo.

### D-04 — Regla de destino en `skill-preflight` // satisface: AC-2, CNF-1

| Archivo | `status` leído | `implement-report.md` en el mismo directorio | Destino |
|---|---|---|---|
| `story.md` | `READY-FOR-IMPLEMENT` o `READY-FOR-DEV` | existe | `IMPLEMENT/TODO` |
| `story.md` | `READY-FOR-IMPLEMENT` o `READY-FOR-DEV` | no existe | `PLAN/DONE` |
| `epic.md` | `READY-FOR-IMPLEMENT` o `READY-FOR-DEV` | no se consulta | `PLAN/DONE` |

- La detección mira solo `status`, sea cual sea `substatus` (AC-2 habla de `status: <status legado>`). Una historia en `READY-FOR-DEV` recibe la misma regla que una en `READY-FOR-IMPLEMENT` (CNF-1, «una sola regla»): la fila 3 de AC-2 es el caso sin reporte.
- **Rechazadas:** (a) Avisar solo `READY-FOR-IMPLEMENT/DONE`, como el alias de los ejecutores: dejaría sin aviso `READY-FOR-DEV` y los pares con otro `substatus`, que también hay que editar a mano. (b) Destino fijo `PLAN/DONE` para toda historia: contradice la regla del ADR y la fila 2 de AC-2.

### D-05 — Lectura del frontmatter en `skill-preflight` // satisface: CNF-3

- **Elegida:** leer solo el bloque YAML entre la primera línea `---` y la siguiente, y de él la clave superior `status`. Sin bloque, sin cierre, YAML no legible o archivo no legible ⇒ la línea «frontmatter ilegible» y se sigue con el archivo siguiente. Un frontmatter legible sin `status`, o con un valor no legado, no emite nada. Las líneas se emiten en orden de ruta, para que la salida sea determinista.
- **Rechazadas:** (a) Detener el diagnóstico ante un archivo ilegible: CNF-3 lo prohíbe. (b) Callar los ilegibles: el usuario creería que no hay nada que migrar en un archivo que no se pudo evaluar. (c) Buscar `READY-FOR-` por texto en todo el archivo: daría falsos positivos con el cuerpo del documento (por ejemplo, una nota que nombre el estado).

### D-06 — Menciones de `READY-FOR-IMPLEMENT` tras la historia // satisface: CNF-2

- **`SKILL.md` de los ejecutores:** solo en el gate de entrada (story-implement 0c.2; story-implement-tasks 1d): condición del gate, aviso, regla de clasificación y línea del rechazo. Las menciones restantes (resumen del Paso 0c, posicionamiento, 0c.4, tablas de estado de las líneas 91 y 139, bloque de inicio y 2e de story-implement-tasks), las queden o no tras STORY-188 y STORY-189, se reescriben con `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`.
- **`SKILL.md` de `skill-preflight`:** solo en la Verificación 3b.
- **README:** el de cada ejecutor nombra el valor legado una sola vez, en la línea de estados de entrada admitidos, que describe el gate (CS-6). El de `skill-preflight`, en la viñeta nueva de señales.
- **Rechazada:** quitar el valor legado de los README de los ejecutores: el usuario que actualiza a 6.0.0 no sabría que su historia sigue siendo ejecutable.

### D-07 — Evals: la regla migra los casos que no son de legado // satisface: CNF-5

- **Regla:** todo caso de los ejecutores que todavía tenga `READY-FOR-IMPLEMENT/DONE` y no pruebe el valor legado (su nombre no empieza por `legado-`) pasa al equivalente según la regla: `IMPLEMENT/TODO` si su entrada incluye `implement-report.md`, `PLAN/DONE` si no. Sus expectativas no cambian, porque el equivalente produce el mismo comportamiento (D-01). Los casos de legado se nombran `legado-*`.
- La `version` de cada `evals.json` sube su número menor sobre el valor que encuentre al implementar (p. ej. `2.1.0 → 2.2.0` en `skill-preflight`). Los ID nuevos son el siguiente libre de cada archivo.
- **Rechazadas:** (a) Conservar los casos sin migrar: emitirían el aviso sin esperarlo y no dirían qué prueban. (b) Migrarlos todos a `PLAN/DONE`: un caso con `implement-report.md` cambiaría de rama.

## Esquema de datos // satisface: AC-1, AC-2, AC-3, CNF-3, CNF-5

Clasificación en los ejecutores:

| Leído en `story.md` | `implement-report.md` | `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` | Aviso | Escritura de arranque |
|---|---|---|---|---|
| `READY-FOR-IMPLEMENT/DONE` | no existe | `PLAN`/`DONE` | `… se trata como PLAN/DONE` | `IMPLEMENT/IN-PROGRESS` |
| `READY-FOR-IMPLEMENT/DONE` | existe | `IMPLEMENT`/`TODO` | `… se trata como IMPLEMENT/TODO` | `IMPLEMENT/IN-PROGRESS` |
| `READY-FOR-IMPLEMENT/<otro>` o `READY-FOR-DEV/*` | — | — | — | ninguna: rechazo |

Casos de eval (la forma `input`/`expected` copia la del caso de referencia):

| Skill | Caso | Referencia | Entrada | Expectativas clave | Origen |
|---|---|---|---|---|---|
| `story-implement` | nuevo `legado-sin-implement-report-se-trata-como-plan-done` | TC-011 | `READY-FOR-IMPLEMENT/DONE`, sin `implement-report.md` ni `fix-directives.md` | `contains` `Valor legado READY-FOR-IMPLEMENT/DONE`, `7.0.0`, `se trata como PLAN/DONE`, `PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS`, `ciclo TDD completo`. `not_contains` `Modo rework`, `no está en un estado válido` | AC-1 fila 1, SMOKE-3 |
| `story-implement` | `rework-legado-ready-for-implement-con-fix-directives` (de STORY-189), renombrado a `legado-con-implement-report-y-fix-directives-entra-en-rework` | el mismo | añade `implement-report.md` a la entrada | `contains` `se trata como IMPLEMENT/TODO`, `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS`, `🔁 Modo rework (ronda 1)`. `not_contains` `no está en un estado válido` | AC-1 fila 2 |
| `story-implement` | nuevo `ready-for-dev-rechazado-lista-estados-admitidos` | caso de rechazo de estado existente | `READY-FOR-DEV/DONE` | `contains` `no está en un estado válido para implementar`, `PLAN/DONE`, `IMPLEMENT/TODO`, `IMPLEMENT/IN-PROGRESS`, `READY-FOR-IMPLEMENT/DONE  (valor legado`. `not_contains` `Iniciando implementación`, `Valor legado READY-FOR-IMPLEMENT/DONE (ADR-0022)` | AC-3 fila 1 |
| `story-implement` | TC-011, TC-022, TC-033 y cualquier otro con el valor legado | — | regla D-07 | sin cambios en `expected` | CNF-5 |
| `story-implement-tasks` | nuevo `legado-con-implement-report-sin-fix-directives-avisa-implement-todo` | TC-003 | `READY-FOR-IMPLEMENT/DONE`, `implement-report.md`, 6/6 tareas, sin `fix-directives.md` | `contains` `se trata como IMPLEMENT/TODO`, `story.md está en IMPLEMENT/TODO sin fix-directives.md`, `Reporte generado`. `not_contains` `No hay tareas pendientes en tasks.md`, `Correcciones de fix-directives.md` | AC-1 fila 3 |
| `story-implement-tasks` | nuevo `legado-sin-implement-report-se-trata-como-plan-done` | TC-003 | `READY-FOR-IMPLEMENT/DONE`, sin `implement-report.md`, 0/6 tareas, sin `fix-directives.md` | `contains` `Valor legado READY-FOR-IMPLEMENT/DONE`, `7.0.0`, `se trata como PLAN/DONE`, `Estado: PLAN/DONE ✓`. `not_contains` `Correcciones de fix-directives.md`, `no está en un estado válido` | AC-1 fila 4 |
| `story-implement-tasks` | TC-002, TC-003, TC-004 | — | regla D-07 (TC-003 queda en `PLAN/DONE` y conserva la salida anticipada) | sin cambios en `expected` | CNF-5 |
| `skill-preflight` | nuevo `status-legado-historias-sin-implement-report` | TC-005 | layout fijo; `specs/flow/STORY-201-x/story.md` en `READY-FOR-IMPLEMENT/DONE` y `specs/flow/STORY-202-y/story.md` en `READY-FOR-DEV/TODO`, ninguno con `implement-report.md` | `contains` `Status legado: specs/flow/STORY-201-x/story.md tiene status READY-FOR-IMPLEMENT`, `Status legado: specs/flow/STORY-202-y/story.md tiene status READY-FOR-DEV`, `edítalo a mano a PLAN/DONE`, `ADR-0022`, `7.0.0`, `sin cambios`. `not_contains` `IMPLEMENT/TODO`, `[ERROR]`, `Guía de migración` | AC-2 filas 1 y 3 |
| `skill-preflight` | nuevo `status-legado-historia-con-implement-report` | TC-005 | `story.md` en `READY-FOR-IMPLEMENT/DONE` con `implement-report.md` | `contains` `tiene status READY-FOR-IMPLEMENT`, `edítalo a mano a IMPLEMENT/TODO`, `sin cambios`. `not_contains` `[ERROR]` | AC-2 fila 2 |
| `skill-preflight` | nuevo `status-legado-epicas` | TC-005 | `specs/flow/EPIC-010-a/epic.md` en `READY-FOR-DEV` y `specs/flow/EPIC-011-b/epic.md` en `READY-FOR-IMPLEMENT` | `contains` las dos rutas, `edítalo a mano a PLAN/DONE`, `sin cambios`. `not_contains` `IMPLEMENT/TODO`, `[ERROR]` | AC-2 filas 4 y 5 |
| `skill-preflight` | nuevo `status-legado-solo-en-archivo-no-avisa` | TC-005 | ningún work item activo con status legado; `specs/flow/archive/2026-05-01-STORY-150-z/story.md` en `READY-FOR-IMPLEMENT/DONE` | `contains` `sin cambios`. `not_contains` `Status legado`, `[ERROR]` | AC-3 fila 2 |
| `skill-preflight` | nuevo `frontmatter-ilegible-no-interrumpe` | TC-005 | un `story.md` sin cierre de frontmatter y otro en `READY-FOR-IMPLEMENT/DONE` sin reporte | `contains` `frontmatter ilegible`, `Status legado:`, `Template presente`, `sin cambios`. `not_contains` `[ERROR]` | CNF-3 |

## Flujos clave

**F-1 — Ejecutor ante el valor legado (AC-1, SMOKE-3):** lee `READY-FOR-IMPLEMENT/DONE` → gate admite → ¿existe `implement-report.md`? → aviso con el equivalente → sustituye `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` → reglas de STORY-188 a STORY-190 sin cambios: rework si existe `fix-directives.md`; aviso de STORY-190 si es `IMPLEMENT/TODO` sin directivas; transición a `IMPLEMENT/IN-PROGRESS` → bloque de inicio con el equivalente → implementación.

**F-2 — Rechazo (AC-3 fila 1):** lee `READY-FOR-DEV/*` (o cualquier par no admitido) → mensaje con los cuatro estados admitidos → termina sin escribir nada.

**F-3 — `skill-preflight` (AC-2, AC-3 fila 2):** Verificaciones 1-3 → 3b: lista los hijos directos de `specs/flow/` salvo `archive/` → por cada `story.md`/`epic.md` en orden de ruta: lee el frontmatter (ilegible ⇒ aviso y siguiente) → si `status` es legado, aplica D-04 y emite el `[WARNING]` → Verificaciones 4-5 → `✓ Diagnóstico completado — sin cambios`.

**F-4 — Orden de implementación (CNF-5):** C-3 (evals de `skill-preflight`) → C-6 → C-7 (README de `skill-preflight`). Esta parte solo depende de STORY-186 y puede ir primero. Después C-1, C-2 (evals de ejecutores) → C-4, C-5 → C-7 (README de ejecutores), con STORY-188, STORY-189 y STORY-190 ya implementadas. Al final, el gate (CNF-6). `npm run test:eval` de los tres skills lo ejecuta una persona.

## Decisiones de complejidad justificada

- **`$ENTRADA_LEGADO`:** una variable booleana más. La lectura posterior de `$ENTRADA_STATUS` ya no ve el valor leído, y el aviso necesita saber que hubo sustitución sin volver a leer `story.md`. Ninguna regla posterior la usa para cambiar de rama.
- **Una verificación nueva en `skill-preflight` en lugar de dos filas:** separar la señal de status de las de layout evita tocar la lógica del sufijo `/sddf-init` y de la guía de migración, que solo tiene sentido para el layout (D-03).
- **Línea de frontmatter ilegible:** una línea más en un caso raro. Sin ella, un archivo no evaluado parecería migrado.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Los dos ejecutores admiten `READY-FOR-IMPLEMENT/DONE`, emiten el aviso con ADR-0022, 7.0.0 y el equivalente, y clasifican por `implement-report.md` | lectura de 0c.2 y 1d | AC-1, CNF-1 |
| V-2 | Tras el aviso, las reglas de rework, aviso de STORY-190, gate anticipado y transición leen el equivalente; ninguna rama propia del valor legado fuera del gate | lectura de 0c.3, 0c.4, 2c y 2e | AC-1, CNF-4 |
| V-3 | El rechazo lista `PLAN/DONE`, `IMPLEMENT/TODO`, `IMPLEMENT/IN-PROGRESS` y `READY-FOR-IMPLEMENT/DONE (valor legado…)` | lectura del mensaje en los dos ejecutores | AC-3 |
| V-4 | `grep -n READY-FOR-IMPLEMENT` en el `SKILL.md` de cada ejecutor solo devuelve líneas de 0c.2 / 1d | `grep -n` y comparación con el rango de líneas del paso | CNF-2 |
| V-5 | `grep -nE "READY-FOR-(IMPLEMENT\|DEV)" skills/skill-preflight/SKILL.md` solo devuelve líneas de la Verificación 3b | `grep -n` | CNF-2 |
| V-6 | La Verificación 3b es de solo lectura, emite `[WARNING]` (nunca `[ERROR]`), cubre `story.md` y `epic.md`, excluye `archive/` y continúa ante un frontmatter ilegible | lectura de la verificación | AC-2, AC-3, CNF-3 |
| V-7 | La lógica del sufijo `/sddf-init` y de la línea `ℹ️ Guía de migración` solo depende de L1-L3 | `git diff` sin cambios en la Verificación 2 ni dentro de la región `SDDF-LEGACY-DIAGNOSTIC` | D-03 |
| V-8 | Los evals tienen los casos de «Esquema de datos», son JSON válido y sus `TC-NNN` son únicos | `node -e "JSON.parse(...)"` y `npm run verify:eval-inventory` | CNF-5 |
| V-9 | Evals antes de `SKILL.md` en cada skill | orden de `tasks.md` (y de los commits) | CNF-5 |
| V-10 | `scripts/verify-fixed-layout.js` sigue pasando (`skill-preflight` conserva el marcador y la región) | `npm run verify:repository` | CNF-6 |
| V-11 | Gate verde | `npm run verify:repository` y `npm test`, con salida 0 | CNF-6 |
| V-12 | Archivos sin BOM ni U+FEFF | comprobación de bytes de los archivos tocados | CNF-6 (memoria del proyecto) |

## Risks / Trade-offs

- [STORY-188, STORY-189 o STORY-190 sin implementar al empezar la parte de los ejecutores] → D-01 depende de sus variables (`$ENTRADA_SUBSTATUS`), de la entrada `PLAN/DONE`, de la excepción del gate anticipado para `IMPLEMENT/TODO` y del aviso de STORY-190 (fila 3 de AC-1). F-4 los fija como precondición. La parte de `skill-preflight` no depende de ellas.
- [Las historias anteriores dejan nombres o textos distintos a los de sus diseños] → V-2 y V-4 se comprueban sobre el texto real. Si cambia un nombre de variable, solo cambia la sustitución de D-01.
- [La fila 3 de AC-1 regenera `implement-report.md` sin encabezado de ronda] → es el comportamiento de un `IMPLEMENT/TODO` sin directivas que STORY-190 ya acepta (su riesgo de numeración de `round`). Nunca es un error.
- [Un proyecto consumidor con muchas historias legadas recibe muchas líneas `[WARNING]`] → es la información que pide la historia («sabiendo qué falta migrar»). Las líneas van ordenadas por ruta.
- [Un `story.md` de consumidor con `READY-FOR-IMPLEMENT/DONE` también lo detecta `/epic-analyze` como MAD-03 hasta STORY-192] → fuera de alcance (Non-Goals).
- [Los destinos de runtime (`.claude/skills/`) siguen con la versión anterior] → tras implementar, una persona ejecuta `npx agile-sddf install` para el dogfooding.

## Open Questions

Ninguna. La regla, la ventana (7.0.0) y la decisión de edición manual vienen de ADR-0022 y de la épica.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → D-01, D-02, Interfaces del clasificador y del aviso, casos de eval de las cuatro filas. AC-2 → D-03, D-04, casos de las cinco filas. AC-3 → línea del rechazo (fila 1) y alcance del escaneo (fila 2). CNF-1 → regla con texto idéntico. CNF-2 → D-06, V-4, V-5. CNF-3 → D-05, V-6. CNF-4 → D-01. CNF-5 → D-07, F-4. CNF-6 → V-10, V-11.
- **Ambigüedad:** AC-2 no fija el destino de una historia `READY-FOR-DEV` con `implement-report.md`; D-04 le aplica la regla única (`IMPLEMENT/TODO`). AC-1 no dice qué muestra la línea `Estado`; la Interfaz fija el equivalente.
- **Nombres:** «valor legado», «ventana de transición», «equivalente» y «destino» se usan como en la historia: el ejecutor «trata como» (equivalente) y `skill-preflight` indica a qué «editarlo a mano» (destino). `S1` no choca con L1-L3.
- **Estructura:** sin dependencias cíclicas. C-4 y C-5 dependen del texto de STORY-188 a STORY-190 y no entre sí; C-6 es independiente. Cada componente tiene una sola razón de cambio: la regla del valor legado en su skill.

## Registro de Cambios (CR)

Sin CRs detectados.
