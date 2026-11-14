---
alwaysApply: false
type: design
id: STORY-189
slug: STORY-189-el-rework-vuelve-a-implement-todo-design
title: "Design: El rework de los tres gates vuelve a IMPLEMENT/TODO"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-189
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-189-el-rework-vuelve-a-implement-todo
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---

<!-- Referencias -->
[[STORY-189-el-rework-vuelve-a-implement-todo]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-188-la-planificacion-termina-en-plan-done]]

## Context

EPIC-029 retira el estado buffer `READY-FOR-IMPLEMENT`. ADR-0022 (lo crea STORY-186, D-03) fija que los tres gates con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO` y que la única señal de rework sigue siendo `fix-directives.md`. Esta historia implementa ese destino en los tres gates y la entrada `IMPLEMENT/TODO` en los dos ejecutores.

Estado actual verificado en el filesystem (2026-11-13):

- **`story-code-review`** escribe `READY-FOR-IMPLEMENT/DONE` en el Paso 4g con `NEEDS-CHANGES` y nombra al ejecutor (`→ Ejecuta /story-implement`, con `/story-implement-tasks` como alternativa si `$TASKS_EXISTS = true`). El estado aparece en `SKILL.md` en las líneas 32 (objetivo), 51 (posicionamiento), 148 (ciclo de vida), 707, 714 y 720 (Paso 4g), 814 (Paso 6), 873 (Paso 7), 897 (error de entrada) y 934 (Salida). `BLOCKED` restaura `IMPLEMENT/DONE` sin `fix-directives.md` (líneas 33, 660, 816, 887, 910, 935). El README no nombra `READY-FOR-IMPLEMENT`.
- **`story-verify`** escribe `READY-FOR-IMPLEMENT/DONE` en el Paso 8 (7a) con `NEEDS-CHANGES`: líneas 31, 549, 588 y 601. El resumen de NEEDS-CHANGES (línea 556) no nombra al ejecutor. README, líneas 8 y 64.
- **`story-acceptance`** escribe `READY-FOR-IMPLEMENT/DONE` en el Paso 8a: líneas 35, 454, 458, 488, 495, 496, 512, y el Caso 2 de `## Test Cases` (533, 534). El resumen tampoco nombra al ejecutor. README, línea 29.
- **`story-implement`** (Paso 0c.2, líneas 265-291) admite `READY-FOR-IMPLEMENT/DONE` («ejecución inicial, o rework encolado por story-code-review») e `IMPLEMENT/IN-PROGRESS`, y registra `$ENTRADA_STATUS` con el `status` leído. 0c.4 (líneas 319-335) escribe `IMPLEMENT/IN-PROGRESS` si `$ENTRADA_STATUS = READY-FOR-IMPLEMENT` y solo `updated` si es `IMPLEMENT`. Otras líneas: 33, 54 y 325. El modo rework lo decide solo 0c.3 (`fix-directives.md`). README, líneas 13, 21, 39 y 97.
- **`story-implement-tasks`** (Paso 1d, líneas 230-268) tiene el mismo gate y `$ENTRADA_STATUS`. 2e (líneas 365-374) escribe `IMPLEMENT/IN-PROGRESS` si `$ENTRADA_STATUS = READY-FOR-IMPLEMENT`. Otras líneas: 42-43, 91 y 139. El **gate de salida anticipada** de 2c (líneas 320-328) termina sin escribir nada si no hay tareas pendientes, hay al menos una completada y no existe `fix-directives.md`. README, líneas 26, 33 y 35.
- **Problema de la entrada nueva:** `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS` tienen el mismo `status`. Con `$ENTRADA_STATUS` solo, 0c.4 y 2e no escribirían `IN-PROGRESS` para `IMPLEMENT/TODO`. Además, el gate de salida anticipada de 2c terminaría la ejecución sin pasar a `IN-PROGRESS` en la fila 2 de AC-3.
- **Evals.** `READY-FOR-IMPLEMENT` aparece en 20 casos de `story-code-review` (1.1.0, 46 casos), 2 de `story-verify` (1.1.0, 7 casos), 4 de `story-acceptance` (1.1.0, 15 casos), 22 de `story-implement` (1.3.1, 44 casos) y los 6 de `story-implement-tasks` (1.0.1). Ningún archivo de `test/` ni de `scripts/` lo nombra.
- **Destinos de runtime.** `.claude/skills/` no está versionado: es salida de `agile-sddf install` y no se edita.

Dependencias: ADR-0022 todavía no existe (`docs/adr/` llega a ADR-0021): STORY-186 se implementa antes. STORY-188 (añade `PLAN/DONE`) y STORY-191 (alias del valor legado) editan los mismos gates de entrada. Este diseño funciona con STORY-188 implementada o sin implementar (D-04).

## Goals / Non-Goals

**Goals:**

- `story-code-review`, `story-verify` y `story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO` y su resumen nombra a `/story-implement` como ejecutor, y a `/story-implement-tasks` como alternativa si existe `tasks.md`. // satisface: AC-1, AC-2
- `story-implement` y `story-implement-tasks` aceptan `IMPLEMENT/TODO`, pasan la historia a `IMPLEMENT/IN-PROGRESS` y deciden el modo rework solo por `fix-directives.md`. // satisface: AC-1, AC-3
- `story-implement-tasks` con `IMPLEMENT/TODO`, sin tareas pendientes y sin `fix-directives.md` no sale por el gate anticipado: cierra la implementación sin anunciar correcciones. // satisface: AC-3 (fila 2)
- Conservar los demás veredictos y `READY-FOR-IMPLEMENT/DONE` en los ejecutores. // satisface: CNF-2, CNF-3
- Escribir los evals antes de cambiar cada `SKILL.md`. // satisface: CNF-1
- No tocar el contenido de `fix-directives.md` ni el cálculo de `round`. // satisface: CNF-4
- Actualizar README y textos de estado de los cinco skills, y dejar el gate verde. // satisface: AC-1, AC-2, CNF-5

**Non-Goals:**

- `fix-directives.md` desde verify y acceptance, plantilla común, `round` entre gates, anuncio del origen del rework y aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- Aviso y clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191. Aquí se sigue aceptando sin aviso y con su comportamiento actual (incluido el gate anticipado de 2c).
- La entrada `PLAN/DONE` y el cierre de la planificación: STORY-188.
- Guías, dominio, `README.md` raíz, `skill-preflight`, `epic-track-progress` y ejemplos de otros skills: STORY-187 y STORY-193.
- Conservar las secciones de rondas anteriores de `implement-report.md` al regenerarlo (ver Risks).

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Evals de `story-implement` | modificar (migrar reworks, +1 caso) | `skills/story-implement/evals/evals.json` | CNF-1, AC-1, CNF-3 |
| C-2 | Evals de `story-implement-tasks` | modificar (migrar reworks, +1 caso) | `skills/story-implement-tasks/evals/evals.json` | CNF-1, AC-3, CNF-3 |
| C-3 | Evals de `story-code-review` | modificar (migrar expectativas) | `skills/story-code-review/evals/evals.json` | CNF-1, AC-1, CNF-2 |
| C-4 | Evals de `story-verify` | modificar (+1 caso) | `skills/story-verify/evals/evals.json` | CNF-1, AC-2, CNF-2 |
| C-5 | Evals de `story-acceptance` | modificar (+1 caso) | `skills/story-acceptance/evals/evals.json` | CNF-1, AC-2, CNF-2 |
| C-6 | Gate de entrada de `story-implement` (0c.2, 0c.4) | modificar | `skills/story-implement/SKILL.md` | AC-1, CNF-3 |
| C-7 | Gate de entrada de `story-implement-tasks` (1d, 2c, 2e, Paso 4) | modificar | `skills/story-implement-tasks/SKILL.md` | AC-3, CNF-3 |
| C-8 | Destino del rework de `story-code-review` (4g, 6, 7) | modificar | `skills/story-code-review/SKILL.md` | AC-1, CNF-2, CNF-4 |
| C-9 | Destino del rework de `story-verify` (Paso 8) | modificar | `skills/story-verify/SKILL.md` | AC-2, CNF-2 |
| C-10 | Destino del rework de `story-acceptance` (Paso 8) | modificar | `skills/story-acceptance/SKILL.md` | AC-2, CNF-2 |
| C-11 | README de los cinco skills | modificar | `skills/story-verify/README.md`, `skills/story-acceptance/README.md`, `skills/story-implement/README.md`, `skills/story-implement-tasks/README.md` | AC-1, AC-2 |

No se crea ningún componente. P3: se reutilizan el bloque de ejecutor del Paso 4g de `story-code-review` (`$TASKS_EXISTS` y sus dos líneas) en verify y acceptance, los gates 0c.2 y 1d de los ejecutores y la forma de los casos existentes para los casos nuevos. `skills/story-code-review/README.md` no nombra el estado y no cambia.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Escritura de los gates con `NEEDS-CHANGES` | `status: IMPLEMENT` / `substatus: TODO` (verify y acceptance también `updated`, como hoy). `APPROVED`, `BLOCKED` y `PENDING` sin cambio | AC-1, AC-2, CNF-2 |
| Bloque de ejecutor (los tres gates) | `→ Ejecuta /story-implement <story_id>` y, solo si `$TASKS_EXISTS = true`, `   Alternativa (tasks.md presente): /story-implement-tasks <story_id>`. `$TASKS_EXISTS` = existe `$STORY_DIR/tasks.md`. Ningún gate escribe en `tasks.md` ni invoca al ejecutor | AC-1, AC-2 |
| Línea de estado de los gates | code-review: `⚠️  Veredicto: NEEDS-CHANGES — story.md → IMPLEMENT/TODO` (4g) y `📋 Estado:         <story_id> → IMPLEMENT/TODO` (Paso 7). verify: `📋 Estado story.md: IMPLEMENT/TODO (NEEDS-CHANGES) ⚠️`. acceptance: `📋 Estado story.md: IMPLEMENT/TODO ⚠️` y `La historia regresa a IMPLEMENT/TODO.` | AC-1, AC-2 |
| Precondición de entrada de los ejecutores | válida si `IMPLEMENT/TODO` · `IMPLEMENT/IN-PROGRESS` · `READY-FOR-IMPLEMENT/DONE` (y `PLAN/DONE` si STORY-188 ya está). Campos ausentes ⇒ `SPECIFY/TODO` (sin cambio) | AC-1, AC-3, CNF-3 |
| Variables de entrada | `$ENTRADA_STATUS` (sin cambio: el `status` leído) y `$ENTRADA_SUBSTATUS` (nuevo: el `substatus` leído) | AC-1, AC-3 |
| Transición de arranque (0c.4, 2e) | si la entrada es `IMPLEMENT/IN-PROGRESS` → sin cambio de estado (story-implement solo `updated`); en cualquier otra entrada admitida → `status: IMPLEMENT` / `substatus: IN-PROGRESS` (story-implement también `updated`) | AC-1, AC-3 |
| Línea `Estado` del bloque de inicio con `IMPLEMENT/TODO` | story-implement: `Estado: IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS`. story-implement-tasks: `Estado: IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS`. Las demás líneas no cambian | AC-1, AC-3 |
| Mensaje de rechazo de los ejecutores | inserta `IMPLEMENT/TODO  (rework devuelto por story-code-review, story-verify o story-acceptance; señal de correcciones: fix-directives.md)` antes de `IMPLEMENT/IN-PROGRESS`. La etiqueta de `READY-FOR-IMPLEMENT/DONE` pierde «o rework encolado por story-code-review» | AC-1, CNF-3 |
| Gate de salida anticipada de 2c | termina sin escribir solo si `N_pendientes = 0` **y** `N_completadas > 0` **y** `fix_directives_existe = false` **y** la entrada no es `IMPLEMENT/TODO` | AC-3, CNF-3 |
| Señal del modo rework | sin cambio: solo `fix-directives.md` (story-implement 0c.3; story-implement-tasks 2c/2f) | AC-3, CNF-4 |

## Decisions

### D-01 — Los tres gates escriben `IMPLEMENT/TODO` en el mismo punto // satisface: AC-1, AC-2, CNF-2

- **Elegida:** cambiar el valor en el sitio donde cada gate ya escribe el rechazo (code-review 4g, verify Paso 8 / 7a, acceptance 8a) y en todos sus textos de estado. Los demás veredictos no se tocan. `BLOCKED` de code-review sigue restaurando `IMPLEMENT/DONE` sin `fix-directives.md` (CNF-2).
- **Rechazadas:** (a) `PLAN/DONE` como destino: la épica lo descarta porque sugiere replanificar. (b) Un paso nuevo común a los tres gates (p. ej. un script): los tres son Markdown que escriben dos campos del frontmatter. Un script compartido añade una dependencia sin reducir el riesgo.

### D-02 — Verify y acceptance nombran al ejecutor como code-review // satisface: AC-2

- **Elegida:** copiar en verify y acceptance el bloque de ejecutor del Paso 4g de code-review: calcular `$TASKS_EXISTS` y mostrar las dos líneas en la transición y en el resumen final, tras la línea de estado. No se muestra `🔁 Ronda de corrección` (no escriben `fix-directives.md` hasta STORY-190).
- **Rechazadas:** (a) Nombrar solo `/story-implement`: AC-2 exige la alternativa si existe `tasks.md`. (b) Extraer el bloque a una plantilla compartida: son dos líneas, y STORY-190 introduce la plantilla común de `fix-directives.md`, no de mensajes.

### D-03 — Una variable de entrada más: `$ENTRADA_SUBSTATUS` // satisface: AC-1, AC-3

- **Elegida:** registrar también `$ENTRADA_SUBSTATUS` y expresar la transición de arranque por exclusión: escribir `IMPLEMENT/IN-PROGRESS` salvo que la entrada ya sea `IMPLEMENT/IN-PROGRESS`.
- **Rechazadas:** (a) Comparar solo `$ENTRADA_STATUS`: `IMPLEMENT/TODO` quedaría sin transición. (b) Sustituir `$ENTRADA_STATUS` por un par `<status>/<substatus>`: rompe la regla que STORY-188 añade con `$ENTRADA_STATUS = PLAN` y las referencias del Paso 0c.
- **Consecuencia:** la regla por exclusión cubre `PLAN/DONE` (STORY-188) sin enumerarlo, de modo que las dos historias no se pisan en 0c.4 ni en 2e.

### D-04 — Lista de estados admitidos y coordinación con STORY-188 y STORY-191 // satisface: AC-1, CNF-3

- **Elegida:** añadir `IMPLEMENT/TODO` como condición del gate y como línea del mensaje de rechazo, antes de `IMPLEMENT/IN-PROGRESS`. `READY-FOR-IMPLEMENT/DONE` se conserva con su comportamiento y pierde solo la parte «rework encolado por story-code-review» de su etiqueta. Si STORY-188 ya está implementada, la lista queda `PLAN/DONE`, `IMPLEMENT/TODO`, `IMPLEMENT/IN-PROGRESS`, `READY-FOR-IMPLEMENT/DONE`. Si no, `IMPLEMENT/TODO`, `IMPLEMENT/IN-PROGRESS`, `READY-FOR-IMPLEMENT/DONE`.
- **Rechazadas:** (a) Retirar `READY-FOR-IMPLEMENT/DONE`: CNF-3 lo prohíbe, y STORY-191 lo convierte en alias. (b) Admitir `IMPLEMENT/*`: `IMPLEMENT/DONE` es una implementación terminada que debe ir a revisión, no reimplementarse.
- **Orden de commits:** los ejecutores aceptan `IMPLEMENT/TODO` antes de que los gates lo escriban (nota de la historia). F-4 lo fija.

### D-05 — `IMPLEMENT/TODO` no sale por el gate anticipado de `story-implement-tasks` // satisface: AC-3, CNF-3

- **Elegida:** con entrada `IMPLEMENT/TODO` el gate de 2c no aplica, aunque no haya tareas pendientes ni `fix-directives.md`. El flujo es el mismo que ya sigue un rework sin tareas pendientes: 2d → 2e (`IMPLEMENT/IN-PROGRESS`) → 2f solo si existe `fix-directives.md` → Paso 3 solo si `N_pendientes > 0` → Paso 4 (DoD IMPLEMENT, `implement-report.md`, `IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`). Sin `fix-directives.md`, `$FIX_DIRECTIVES_APPLIED = false`: el resumen y el reporte no muestran `Correcciones de fix-directives.md` ni ronda.
- **Rechazadas:** (a) Mantener el gate anticipado para `IMPLEMENT/TODO`: AC-3 exige pasar a `IMPLEMENT/IN-PROGRESS`, y la historia quedaría en `IMPLEMENT/TODO` sin forma de volver a revisión. (b) Pasar a `IMPLEMENT/IN-PROGRESS` y terminar: la siguiente ejecución, ya en `IMPLEMENT/IN-PROGRESS` sin tareas pendientes, saldría por el gate y la historia no llegaría a `IMPLEMENT/DONE`, el estado que exige `/story-code-review`.
- **Legado:** `READY-FOR-IMPLEMENT/DONE` conserva el gate anticipado (TC-003 sin cambio). STORY-191 decide su clasificación.
- **`story-implement`** no tiene gate anticipado: con `IMPLEMENT/TODO` sin `fix-directives.md` ejecuta el ciclo TDD completo, como hoy con `READY-FOR-IMPLEMENT/DONE` (TC-021).

### D-06 — Evals: migrar los reworks, conservar el legado // satisface: CNF-1, CNF-3

- **Regla de migración en los ejecutores:** un caso cuya entrada representa un rework (existe `fix-directives.md` o un informe de rechazo) pasa de `READY-FOR-IMPLEMENT/DONE` a `IMPLEMENT/TODO`. Un caso de entrada inicial sin rework se conserva como cobertura de CNF-3. En los gates, las expectativas `READY-FOR-IMPLEMENT` del rechazo pasan a `IMPLEMENT/TODO`, y las `not_contains` de `APPROVED` y `BLOCKED` pasan a `IMPLEMENT/TODO`.
- **Rechazadas:** (a) Migrar todos los casos de los ejecutores: se pierde la evidencia de CNF-3. (b) Solo añadir casos nuevos: los casos de los gates fallarían con el skill nuevo.
- La `version` de cada `evals.json` sube su número menor (`1.1.0 → 1.2.0`; `1.3.1 → 1.4.0`; `1.0.1 → 1.1.0`). Si STORY-188 ya la subió, se sube de nuevo. Los ID nuevos son el siguiente libre de cada archivo, para no chocar con los de STORY-188.

## Esquema de datos // satisface: AC-1, AC-2, AC-3, CNF-1, CNF-2, CNF-3

Frontmatter de `story.md` que escribe cada paso:

| Paso | Entrada | Salida |
|---|---|---|
| `story-code-review` 4g, `NEEDS-CHANGES` | `IMPLEMENT/DONE` o `CODE-REVIEW/IN-PROGRESS` | `IMPLEMENT/TODO` + `fix-directives.md` |
| `story-code-review` Paso 6, `BLOCKED` | igual | `IMPLEMENT/DONE`, sin `fix-directives.md` |
| `story-verify` Paso 8, `NEEDS-CHANGES` | `VERIFY/IN-PROGRESS` (desde `CODE-REVIEW/DONE`) | `IMPLEMENT/TODO` |
| `story-acceptance` 8a, `NEEDS-CHANGES` | `ACCEPTANCE/IN-PROGRESS` (desde `VERIFY/DONE`) | `IMPLEMENT/TODO` |
| ejecutor, arranque | `IMPLEMENT/TODO`, `READY-FOR-IMPLEMENT/DONE` (o `PLAN/DONE`) | `IMPLEMENT/IN-PROGRESS` |
| ejecutor, arranque | `IMPLEMENT/IN-PROGRESS` | sin cambio de estado |
| `story-implement-tasks` 2c, legado | `READY-FOR-IMPLEMENT/DONE`, 0 pendientes, sin `fix-directives.md` | sin cambio (salida anticipada) |

Casos de eval (la forma `input`/`expected` copia la del caso de referencia):

| Skill | Caso | Cambio | Expectativas clave |
|---|---|---|---|
| `story-implement` | TC-010, TC-016 a TC-019, TC-021, TC-023 a TC-027, TC-029 a TC-032, TC-034, TC-035 | migrar `story_status` a `IMPLEMENT/TODO` | TC-010 añade `contains` `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS` (AC-1); TC-021 conserva `not_contains` `Modo rework` (AC-3 en este ejecutor) |
| `story-implement` | TC-011, TC-022, TC-033 | sin cambio | entradas iniciales `READY-FOR-IMPLEMENT/DONE` (CNF-3) |
| `story-implement` | TC-012, TC-013 | migrar | añadir `IMPLEMENT/TODO` a `contains` |
| `story-implement` | nuevo `rework-legado-ready-for-implement-con-fix-directives` | desde TC-010 | `story_status` `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (round 1); `contains` `🔁 Modo rework (ronda 1)`, `IMPLEMENT/DONE`; `not_contains` `no está en un estado válido` (CNF-3) |
| `story-implement-tasks` | TC-001, TC-005, TC-006 | migrar a `IMPLEMENT/TODO` | TC-001 añade `contains` `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS` (fila 1 de AC-3) |
| `story-implement-tasks` | TC-002, TC-003, TC-004 | sin cambio | legado (CNF-3); TC-003 conserva la salida anticipada |
| `story-implement-tasks` | nuevo `implement-todo-sin-fix-directives-no-anuncia-rework` | desde TC-003 | `IMPLEMENT/TODO`, 6/6 tareas, sin `fix-directives.md`, `verify-report.md` con `verdict: NEEDS-CHANGES`; `contains` `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS`, `Reporte generado`; `not_contains` `No hay tareas pendientes en tasks.md`, `Correcciones de fix-directives.md`, `ronda`, `💻 corregido:` (fila 2 de AC-3) |
| `story-code-review` | TC-002, TC-005, TC-009, TC-010, TC-012 a TC-015, TC-018, TC-020 | migrar | `contains` `IMPLEMENT/TODO` en lugar de `READY-FOR-IMPLEMENT` / `READY-FOR-IMPLEMENT/DONE`. TC-010 conserva `not_contains` `/story-implement-tasks` (sin `tasks.md`) |
| `story-code-review` | TC-001, TC-006, TC-008, TC-011, TC-017, TC-021, TC-027, TC-030, TC-034 | migrar | `not_contains` `IMPLEMENT/TODO` en lugar de `READY-FOR-IMPLEMENT`. TC-017 y TC-021 (`BLOCKED`) son la evidencia de CNF-2 |
| `story-code-review` | TC-016 | migrar y renombrar a `precondicion-implement-todo-con-fix-directives-detiene` | `story_status` `IMPLEMENT/TODO`; `contains` `no está en un estado válido para revisar`, `IMPLEMENT / substatus: TODO`, `Estados admitidos` |
| `story-verify` | TC-004 | migrar | `contains` `IMPLEMENT/TODO`, `→ Ejecuta /story-implement STORY-053`; `not_contains` `/story-implement-tasks` (sin `tasks.md`) |
| `story-verify` | TC-005 (`BLOCKED`) | migrar | `not_contains` `IMPLEMENT/TODO` (CNF-2) |
| `story-verify` | nuevo `needs-changes-con-tasks-md-nombra-alternativa` | desde TC-004 | `artifacts_present` con `tasks.md`; `contains` `IMPLEMENT/TODO`, `→ Ejecuta /story-implement`, `Alternativa (tasks.md presente): /story-implement-tasks` (AC-2, fila verify) |
| `story-acceptance` | TC-002, TC-009 | migrar | `contains` `IMPLEMENT/TODO`, `regresa a IMPLEMENT/TODO`, `→ Ejecuta /story-implement` |
| `story-acceptance` | TC-001, TC-006 | migrar | `not_contains` `IMPLEMENT/TODO` (CNF-2: `APPROVED`, `BLOCKED`) |
| `story-acceptance` | nuevo `needs-changes-con-tasks-md-nombra-alternativa` | desde TC-002 | `artifacts_present` con `tasks.md`; `contains` `IMPLEMENT/TODO`, `Alternativa (tasks.md presente): /story-implement-tasks` (AC-2, fila acceptance) |

Las `description` de los casos migrados se reescriben con el estado nuevo. La `description` de nivel superior de cada archivo que enumera estados se actualiza.

## Flujos clave

**F-1 — Rework por revisión (AC-1, SMOKE-2):** `IMPLEMENT/DONE` → `/story-code-review` con un HIGH → 4f escribe `fix-directives.md` (sin cambios, CNF-4) → 4g escribe `IMPLEMENT/TODO` y muestra el bloque de ejecutor → `/story-implement` → 0c.2 admite `IMPLEMENT/TODO` → 0c.3 detecta `fix-directives.md` (modo rework) → 0c.4 escribe `IMPLEMENT/IN-PROGRESS` → ciclo TDD → `IMPLEMENT/DONE`.

**F-2 — Rechazo de verify o acceptance (AC-2):** `CODE-REVIEW/DONE` → `/story-verify` (o `VERIFY/DONE` → `/story-acceptance`) → `NEEDS-CHANGES` → `IMPLEMENT/TODO`, sin `fix-directives.md` → resumen con el bloque de ejecutor según `$TASKS_EXISTS`.

**F-3 — Ejecutor por tareas sin directivas (AC-3, fila 2):** `IMPLEMENT/TODO`, 0 pendientes, sin `fix-directives.md` → 1d admite → 2c: el gate anticipado no aplica (entrada `IMPLEMENT/TODO`) → 2e escribe `IMPLEMENT/IN-PROGRESS` → 2f omitido → Paso 4: DoD, `implement-report.md` sin sección de correcciones → `IMPLEMENT/DONE` → `/story-code-review`.

**F-4 — Orden de implementación (CNF-1, nota de orden interno):** C-1, C-2 (evals de ejecutores) → C-6, C-7 (ejecutores aceptan `IMPLEMENT/TODO`) → C-3 a C-5 (evals de gates) → C-8 a C-10 (gates escriben `IMPLEMENT/TODO`) → C-11 (README) → gate (CNF-5). `npm run test:eval` de los cinco skills lo ejecuta una persona.

## Decisiones de complejidad justificada

- **`$ENTRADA_SUBSTATUS`:** una variable más es lo mínimo para distinguir `IMPLEMENT/TODO` de `IMPLEMENT/IN-PROGRESS`. La regla por exclusión evita enumerar las entradas en la transición.
- **Excepción en el gate anticipado:** una condición más en un gate que ya tiene una excepción equivalente (`fix_directives_existe = true`). Reutiliza el camino «rework sin tareas pendientes» del Paso 4 sin un camino nuevo.
- **Un caso nuevo de legado en `story-implement`:** al migrar los reworks, ningún caso cubriría `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md`, que CNF-3 conserva.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Los tres gates escriben `status: IMPLEMENT` / `substatus: TODO` con `NEEDS-CHANGES` | lectura de code-review 4g, verify Paso 8 y acceptance 8a | AC-1, AC-2 |
| V-2 | `SKILL.md`, README y `evals.json` de los tres gates no contienen `READY-FOR-IMPLEMENT` | `grep -rc READY-FOR-IMPLEMENT skills/story-code-review skills/story-verify skills/story-acceptance` = 0 | AC-1, AC-2 |
| V-3 | Los resúmenes de NEEDS-CHANGES de los tres gates muestran `→ Ejecuta /story-implement` y la alternativa condicionada a `$TASKS_EXISTS` | lectura de los tres pasos de resumen | AC-1, AC-2 |
| V-4 | `BLOCKED` y `PENDING` conservan su destino; `BLOCKED` de code-review sin `fix-directives.md` | lectura y `git diff` de esas líneas (sin cambios) | CNF-2 |
| V-5 | 4f de code-review (ronda y contenido de `fix-directives.md`) sin cambios | `git diff` sin líneas tocadas en el Paso 4f ni en `assets/fix-directives-template.md` | CNF-4 |
| V-6 | Los dos ejecutores admiten `IMPLEMENT/TODO` sin retirar `READY-FOR-IMPLEMENT/DONE`, y el rechazo lista `IMPLEMENT/TODO` | lectura de 0c.2 y 1d | AC-1, CNF-3 |
| V-7 | 0c.4 y 2e escriben `IMPLEMENT/IN-PROGRESS` para `IMPLEMENT/TODO` | lectura de la regla por exclusión | AC-1, AC-3 |
| V-8 | El gate anticipado de 2c no aplica a `IMPLEMENT/TODO` y sí a `READY-FOR-IMPLEMENT/DONE` | lectura de 2c y de la fila de «Manejo de errores» | AC-3, CNF-3 |
| V-9 | El modo rework sigue dependiendo solo de `fix-directives.md` | 0c.3 y 2c/2f sin cambios en la condición | AC-3 |
| V-10 | Los evals tienen los casos de «Esquema de datos», son JSON válido y sus `TC-NNN` son únicos | `node -e "JSON.parse(...)"` y `npm run verify:eval-inventory` | CNF-1 |
| V-11 | Evals antes de `SKILL.md` y ejecutores antes de gates | orden de `tasks.md` (y de los commits) | CNF-1, nota de orden |
| V-12 | Gate verde | `npm run verify:repository` y `npm test` con salida 0 | CNF-5 |
| V-13 | Archivos sin BOM ni U+FEFF | comprobación de bytes de los archivos tocados | CNF-5 (memoria del proyecto) |

## Risks / Trade-offs

- [STORY-188 edita los mismos gates de entrada] → D-03 y D-04 funcionan en los dos órdenes. Si se implementan seguidas, integrar las dos entradas en la misma edición del mensaje de rechazo.
- [Un `contains` `IMPLEMENT/DONE` de un caso de rechazo también coincide con otros textos] → los casos migrados usan la cadena `IMPLEMENT/TODO` o la línea completa (`→ IMPLEMENT/TODO`). `IMPLEMENT/TODO` no es subcadena de ningún otro estado.
- [En la fila 2 de AC-3 `story-implement-tasks` regenera `implement-report.md` y pierde las secciones de rondas anteriores] → es el comportamiento actual de un rework sin tareas pendientes. STORY-190 usa esas secciones para numerar `round` entre gates (ADR-0022, D-05): lo registra CR-001.
- [Verify o acceptance rechazan sin `fix-directives.md` y el ejecutor no sabe qué corregir] → aceptado hasta STORY-190 (nota de la historia). El resumen del gate remite a su informe.
- [Los destinos de runtime (`.claude/skills/`) siguen con la versión anterior] → tras implementar, una persona ejecuta `npx agile-sddf install` para usar los skills nuevos en el dogfooding.

## Open Questions

Ninguna bloqueante. CR-001 queda para STORY-190.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `story-implement-tasks` regenera `implement-report.md` completo en el Paso 4 (4a: «no se actualiza incrementalmente») y solo incluye la sección `## Correcciones de fix-directives.md (ronda N)` de la ronda actual. La regla de `round` de ADR-0022 (D-05) lee esos encabezados para continuar la numeración entre gates. Un rework sin directivas (fila 2 de AC-3) o una ronda nueva borra la sección de la ronda anterior.
- **Documento afectado**: STORY-190 (`story.md` / `design.md`); `skills/story-implement-tasks/SKILL.md` Paso 4.
- **Acción requerida**: que STORY-190 decida si el ejecutor conserva las secciones de rondas anteriores al regenerar el reporte o si la regla de `round` usa otra fuente. No bloquea esta historia (CNF-4).
