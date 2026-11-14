---
alwaysApply: false
type: design
id: STORY-188
slug: STORY-188-la-planificacion-termina-en-plan-done-design
title: "Design: La planificación termina en PLAN/DONE"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-188
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-188-la-planificacion-termina-en-plan-done
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
---

<!-- Referencias -->
[[STORY-188-la-planificacion-termina-en-plan-done]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]]

## Context

EPIC-029 retira el estado buffer `READY-FOR-IMPLEMENT`. STORY-186 fija la decisión en ADR-0022 (D-02: `story-analyze` con `APPROVED` escribe `PLAN/DONE`, y los ejecutores aceptan `PLAN/DONE`). Esta historia implementa la parte de planificación: quién escribe `PLAN/DONE`, quién lo acepta y quién lo protege.

Estado actual verificado en el filesystem (2026-11-13):

- **Escritor.** `skills/story-analyze/SKILL.md` escribe `status: READY-FOR-IMPLEMENT` / `substatus: DONE` en el Paso 9a con `$VERDICT = APPROVED` y no toca `story.md` con `NEEDS-CHANGES`. El estado aparece en las líneas 36 (objetivo), 54 (posicionamiento), 62 (ciclo de vida), 123 (DoD), 139 (hallazgo ERROR), 500 (Paso 9a), 552 y 558 (Paso 10) y 583 (Salida).
- **Guardia.** `skills/story-plan/SKILL.md:319` restaura `PLAN/IN-PROGRESS` si el veredicto no es `APPROVED` y `story.md` quedó en `READY-FOR-IMPLEMENT`, con el aviso `⚠️ story.md estaba en READY-FOR-IMPLEMENT sin verdict APPROVED — restaurado a PLAN/IN-PROGRESS`. La guardia está al final del Paso 5, que se salta con `--skip-analyze`. El Paso 1e deja siempre `PLAN/IN-PROGRESS` al iniciar, y `story-plan` nunca escribe el estado de cierre. Los textos de cierre están en las líneas 47, 49, 63, 117, 379, 437 y 439.
- **Ejecutores.** `skills/story-implement/SKILL.md` (Paso 0c.2, líneas 268-289; 0c.4, líneas 320-334; resumen, línea 33; posicionamiento, línea 54) y `skills/story-implement-tasks/SKILL.md` (Paso 1d, líneas 233-267; Paso 2e, línea 370; precondiciones, línea 91; ciclo de vida, línea 139; posicionamiento, línea 42) admiten `READY-FOR-IMPLEMENT/DONE` e `IMPLEMENT/IN-PROGRESS` y registran `$ENTRADA_STATUS` con el `status` leído. El modo rework lo decide solo `fix-directives.md` (story-implement 0c.3; story-implement-tasks 2c/2f), no el estado.
- **DoD.** `docs/guardrails/dod-story-plan.md` declara `to: PLAN/DONE`. `skills/memory-system/scripts/dod-story.js` no nombra `READY-FOR-IMPLEMENT`. Ninguno cambia (CNF-2).
- **Pruebas.** Ningún archivo de `test/` ni de `scripts/` nombra `READY-FOR-IMPLEMENT` (grep). Las ocurrencias están en los `evals.json`: 6 en `story-analyze` (7 casos), 8 en `story-plan` (7 casos), 29 en `story-implement` (44 casos, hasta TC-044) y 12 en `story-implement-tasks` (6 casos).
- **README y ejemplos.** `skills/story-analyze/README.md:16`; `skills/story-analyze/examples/input/story.md:7-8` (`READY-FOR-IMPLEMENT/TODO`, un estado que ningún skill escribe); `skills/story-plan/README.md:17,18,65`; `skills/story-plan/assets/README.md:38`; `skills/story-plan/examples/output/plan-summary.md:43`; `skills/story-implement/README.md:8,13,39,97`; `skills/story-implement-tasks/README.md:16,17,26,33,35`.
- **Destinos de runtime.** `.claude/skills/` no está versionado (`git ls-files` vacío): es salida de `agile-sddf install` y no se edita.

Dependencias: ADR-0022 lo crea STORY-186 (hoy en `PLAN`). Esta historia lo cita como fuente de la decisión, así que se implementa después. STORY-189 edita los mismos gates de entrada para añadir `IMPLEMENT/TODO`.

## Goals / Non-Goals

**Goals:**

- `story-analyze` con `APPROVED` escribe `PLAN/DONE`. Con `NEEDS-CHANGES` no cambia `story.md`, como hoy. // satisface: AC-1, AC-2, CNF-3
- `story-implement` y `story-implement-tasks` aceptan `PLAN/DONE` y pasan la historia a `IMPLEMENT/IN-PROGRESS`. Siguen aceptando `READY-FOR-IMPLEMENT/DONE` e `IMPLEMENT/IN-PROGRESS`, y rechazan cualquier otro estado listando los que aceptan. // satisface: AC-1, AC-2, CNF-4
- La guardia de `story-plan` también restaura `PLAN/DONE` sin un `verdict: APPROVED`, y conserva la restauración de `READY-FOR-IMPLEMENT`. // satisface: AC-3, CNF-3, CNF-4
- Escribir los evals de los cuatro skills antes de cambiar sus `SKILL.md`. // satisface: CNF-1
- Actualizar el README, los ejemplos y los textos de estado de los cuatro skills. // satisface: AC-1 (coherencia; notas de la historia)
- Dejar el gate verde. // satisface: CNF-5

**Non-Goals:**

- El destino del rework de los tres gates y la entrada `IMPLEMENT/TODO` en los ejecutores: STORY-189. Las líneas que describen el rework encolado en `READY-FOR-IMPLEMENT/DONE` (p. ej. `skills/story-implement/README.md:21`) no cambian aquí.
- El aviso y la clasificación del valor legado `READY-FOR-IMPLEMENT/DONE` (alias con aviso, regla de `implement-report.md`): STORY-191. Aquí ese valor se sigue aceptando sin aviso.
- Guías, `README.md` raíz, documentos de dominio y ejemplos de otros skills: STORY-187 y STORY-193.
- El estado legado `READY-FOR-PLAN` que todavía muestran `skills/story-plan/README.md:8,12` y `skills/story-implement-tasks/README.md:8,12`: no es un buffer de EPIC-029 y no entra en el `grep` de CS-6.
- Modificar `dod-story-plan.md` o `dod-story.js` (CNF-2).
- Que `story-analyze` restaure por sí mismo una historia en `PLAN/DONE` cuando emite `NEEDS-CHANGES` (ver CR-001).

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Evals de `story-analyze` | modificar | `skills/story-analyze/evals/evals.json` | CNF-1, AC-1, AC-2 |
| C-2 | Evals de `story-plan` | modificar (+3 casos) | `skills/story-plan/evals/evals.json` | CNF-1, AC-3, CNF-4 |
| C-3 | Evals de `story-implement` | modificar (+2 casos, TC-012) | `skills/story-implement/evals/evals.json` | CNF-1, AC-1, AC-2, CNF-4 |
| C-4 | Evals de `story-implement-tasks` | modificar (+2 casos) | `skills/story-implement-tasks/evals/evals.json` | CNF-1, AC-1, CNF-4 |
| C-5 | Escritor del cierre de la planificación | modificar | `skills/story-analyze/SKILL.md` | AC-1, AC-2, CNF-3 |
| C-6 | Guardia de cierre de `story-plan` y sus textos de estado | modificar | `skills/story-plan/SKILL.md` | AC-3, CNF-3, CNF-4 |
| C-7 | Gate de entrada de `story-implement` (0c.2, 0c.4) | modificar | `skills/story-implement/SKILL.md` | AC-1, AC-2, CNF-4 |
| C-8 | Gate de entrada de `story-implement-tasks` (1d, 2e) | modificar | `skills/story-implement-tasks/SKILL.md` | AC-1, CNF-4 |
| C-9 | README y ejemplos de `story-analyze` | modificar | `skills/story-analyze/README.md`, `skills/story-analyze/examples/input/story.md` | AC-1 |
| C-10 | README y ejemplos de `story-plan` | modificar | `skills/story-plan/README.md`, `skills/story-plan/assets/README.md`, `skills/story-plan/examples/output/plan-summary.md` | AC-1, AC-3 |
| C-11 | README de los ejecutores (estado de entrada) | modificar | `skills/story-implement/README.md`, `skills/story-implement-tasks/README.md` | AC-1, AC-2 |

No se crea ningún componente nuevo. P3: se reutilizan el Paso 9a de `story-analyze`, la guardia del Paso 5 de `story-plan`, los gates 0c.2 y 1d de los ejecutores y la forma de los casos TC-011 y TC-012 de `story-implement` y TC-003 de `story-implement-tasks` para los casos nuevos.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Salida de `story-analyze` (Paso 9a) | `$VERDICT = APPROVED` → `status: PLAN` / `substatus: DONE`. `$VERDICT = NEEDS-CHANGES` → `story.md` sin cambio | AC-1, AC-2, CNF-3 |
| Mensajes del Paso 10 de `story-analyze` | APPROVED: `Estado story.md: PLAN/DONE ✓`. NEEDS-CHANGES: `Estado story.md: PLAN/IN-PROGRESS (no se actualizó a PLAN/DONE — veredicto NEEDS-CHANGES)` | AC-1, AC-2 |
| Precondición de entrada de los ejecutores | válida si `PLAN/DONE` · `IMPLEMENT/IN-PROGRESS` · `READY-FOR-IMPLEMENT/DONE`. Campos ausentes ⇒ `SPECIFY/TODO` (sin cambio) | AC-1, AC-2, CNF-4 |
| `$ENTRADA_STATUS` | ∈ {`PLAN`, `READY-FOR-IMPLEMENT`, `IMPLEMENT`} (el `status` leído) | AC-1 |
| Transición de arranque (story-implement 0c.4, story-implement-tasks 2e) | `$ENTRADA_STATUS` ∈ {`PLAN`, `READY-FOR-IMPLEMENT`} → `status: IMPLEMENT` / `substatus: IN-PROGRESS` (story-implement también `updated`). `IMPLEMENT` → sin cambio de estado (story-implement solo `updated`) | AC-1 |
| Mensaje de rechazo de los ejecutores | lista, en este orden: `PLAN/DONE` (planificación aprobada por story-analyze), `IMPLEMENT/IN-PROGRESS` (reanudación) y `READY-FOR-IMPLEMENT/DONE` (valor anterior a 6.0.0: ejecución inicial o rework encolado por story-code-review). El resto del mensaje no cambia | AC-2, CNF-4 |
| Línea `Estado` del bloque de inicio | `Estado: PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS` (story-implement) y `Estado: PLAN/DONE ✓` (story-implement-tasks) cuando `$ENTRADA_STATUS = PLAN`. Las líneas de `READY-FOR-IMPLEMENT` e `IMPLEMENT` se conservan | AC-1 |
| Condición de la guardia de `story-plan` | `verdict` de `analyze.md` ≠ `APPROVED` (incluye archivo ausente y verdict inválido) **y** (`status: PLAN` + `substatus: DONE` **o** `status: READY-FOR-IMPLEMENT`) | AC-3, CNF-4 |
| Efecto y aviso de la guardia | escribe `status: PLAN` / `substatus: IN-PROGRESS` y emite `⚠️ story.md estaba en <status>/<substatus> sin verdict APPROVED — restaurado a PLAN/IN-PROGRESS`, con el estado leído (p. ej. `PLAN/DONE`). Con `APPROVED` no hace nada ni emite el aviso | AC-3 |

## Decisions

### D-01 — Valor de cierre: `PLAN/DONE` // satisface: AC-1, CNF-2, CNF-3

- **Elegida:** `story-analyze` escribe `status: PLAN` / `substatus: DONE`, el mismo estado `to:` de `dod-story-plan.md` (ADR-0022, D-02).
- **Rechazadas:** (a) Escribir los dos valores durante la ventana (p. ej. `PLAN/DONE` y una nota de compatibilidad): el frontmatter tiene un solo `status`. (b) Mantener `READY-FOR-IMPLEMENT` hasta STORY-191: dejaría el escritor con el estado retirado, y SMOKE-1 exige `PLAN/DONE`.
- **Consecuencia:** desde esta historia ningún skill escribe `READY-FOR-IMPLEMENT/DONE` al cerrar la planificación. Sí lo escribe todavía `story-code-review` con `NEEDS-CHANGES` hasta STORY-189, por eso los ejecutores lo siguen aceptando.

### D-02 — Ejecutores: una entrada más, ninguna menos // satisface: AC-1, AC-2, CNF-4

- **Elegida:** añadir `PLAN/DONE` al gate como tercera condición y conservar `READY-FOR-IMPLEMENT/DONE` con su significado actual, sin aviso. `PLAN` se trata igual que `READY-FOR-IMPLEMENT` en la transición de arranque. El modo rework sigue dependiendo solo de `fix-directives.md`.
- **Rechazadas:** (a) Sustituir `READY-FOR-IMPLEMENT/DONE` por `PLAN/DONE`: dejaría sin ejecutor las historias que `story-code-review` devuelve a ese estado hasta STORY-189 (CNF-4). (b) Añadir ya el aviso de valor legado: es STORY-191, y el valor todavía tiene un escritor activo. (c) Admitir `PLAN/*` (cualquier substatus): `PLAN/IN-PROGRESS` es una planificación sin aprobar y AC-2 exige rechazarla.
- **Orden de la lista del rechazo:** primero el estado nuevo y al final el anterior, con la etiqueta «valor anterior a 6.0.0», para que el usuario vea cuál es el canónico. STORY-189 inserta `IMPLEMENT/TODO` en la misma lista, y STORY-191 cambia la etiqueta del valor anterior.

### D-03 — La guardia de `story-plan` se amplía en su sitio // satisface: AC-3, CNF-3, CNF-4

- **Elegida:** la guardia sigue al final del Paso 5, se ejecuta en todas las filas de la tabla del Paso 5 (APPROVED, NEEDS-CHANGES, verdict inválido y `analyze.md` no generado) y amplía la condición a `PLAN/DONE`. El aviso nombra el estado leído, de modo que la cadena `PLAN/DONE sin verdict APPROVED` aparece cuando la historia estaba en `PLAN/DONE`. La frase «`story-plan` nunca escribe `READY-FOR-IMPLEMENT`» pasa a «`story-plan` nunca escribe `PLAN/DONE` ni `READY-FOR-IMPLEMENT`».
- **Filas de AC-3:** `APPROVED` → no hace nada. `NEEDS-CHANGES` → restaura y avisa. `analyze.md` no existe → la fila «`analyze.md` no generado» del Paso 5 (`✗ error técnico`) ya llega a la guardia, que restaura y avisa, y el resumen muestra «Pipeline interrumpido».
- **Rechazadas:** (a) Mover la guardia a un paso propio que también corra con `--skip-analyze`: con ese flag el Paso 1e deja `PLAN/IN-PROGRESS` y ningún paso posterior escribe el cierre, así que la guardia no tendría nada que restaurar. (b) Una guardia que restaure solo `PLAN/DONE` y deje de vigilar `READY-FOR-IMPLEMENT`: CNF-4 pide conservarla. (c) Dos avisos con textos fijos, uno por estado: el texto con el estado leído cubre ambos con una sola regla.

### D-04 — Evals primero, migrados en su sitio // satisface: CNF-1, CNF-4

- **Elegida:** en `story-analyze` y `story-plan` se cambian las expectativas existentes a `PLAN/DONE` (estos skills ya no producen `READY-FOR-IMPLEMENT`) y se añaden casos para la guardia. En los ejecutores se **añaden** casos de `PLAN/DONE` y los casos actuales con `READY-FOR-IMPLEMENT/DONE` se mantienen sin cambios como evidencia de CNF-4 (TC-011 de `story-implement` y TC-003 de `story-implement-tasks` son entradas iniciales sin `fix-directives.md`; el resto son reworks que migra STORY-189).
- **Rechazadas:** (a) Migrar a `PLAN/DONE` todos los casos de los ejecutores: los reworks llegan hoy en `READY-FOR-IMPLEMENT/DONE` y su destino lo fija STORY-189, y se perdería el caso de CNF-4. (b) Crear solo casos nuevos en `story-analyze` y `story-plan` y dejar los viejos con `READY-FOR-IMPLEMENT`: esos casos fallarían con el skill nuevo.
- `version` de cada `evals.json` sube su número menor (p. ej. `1.1.0 → 1.2.0`) porque cambian las expectativas.

### D-05 — README y ejemplos en la misma historia // satisface: AC-1

- **Elegida:** actualizar en esta historia las líneas de estado de cierre de la planificación y de estado de entrada de los ejecutores de los cuatro README, `assets/README.md` y los dos ejemplos (C-9 a C-11). El ejemplo de entrada de `story-analyze` pasa de `READY-FOR-IMPLEMENT/TODO` a `PLAN/IN-PROGRESS`, que es el estado con el que `story-plan` invoca a `story-analyze`.
- **Rechazada:** dejarlo para STORY-193: la épica asigna a cada historia el README y los ejemplos de los skills que toca, y STORY-193 solo cubre el resto.

## Esquema de datos // satisface: AC-1, AC-2, AC-3, CNF-1, CNF-4

Frontmatter de `story.md` que escribe cada paso:

| Paso | Entrada | Salida |
|---|---|---|
| `story-plan` 1e | cualquiera | `PLAN/IN-PROGRESS` |
| `story-analyze` 9a, `APPROVED` | `PLAN/IN-PROGRESS` | `PLAN/DONE` |
| `story-analyze` 9a, `NEEDS-CHANGES` | X | X (sin cambio) |
| `story-plan` guardia, verdict ≠ `APPROVED` | `PLAN/DONE` o `READY-FOR-IMPLEMENT/*` | `PLAN/IN-PROGRESS` + aviso |
| ejecutor, arranque | `PLAN/DONE` o `READY-FOR-IMPLEMENT/DONE` | `IMPLEMENT/IN-PROGRESS` |
| ejecutor, arranque | `IMPLEMENT/IN-PROGRESS` | sin cambio de estado |
| ejecutor, rechazo | cualquier otro | sin cambio, sin escritura |

Casos de eval (los ID nuevos son el siguiente libre de cada archivo; la forma `input`/`expected` copia la del caso de referencia):

| Skill | Caso | Cambio | Expectativas clave |
|---|---|---|---|
| `story-analyze` | TC-001, TC-006 (APPROVED) | migrar | `contains` `PLAN/DONE`; `not_contains` `READY-FOR-IMPLEMENT` |
| `story-analyze` | TC-003, TC-004 (NEEDS-CHANGES / rechazo) | migrar | `not_contains` `PLAN/DONE` en lugar de `READY-FOR-IMPLEMENT`; `contains` `PLAN/IN-PROGRESS` cuando ya lo tenía |
| `story-plan` | TC-001, TC-007 (APPROVED) | migrar | `contains` `PLAN/DONE`; `not_contains` `READY-FOR-IMPLEMENT` y `restaurado a PLAN/IN-PROGRESS` (fila 1 de AC-3) |
| `story-plan` | TC-002, TC-005, TC-006 | migrar | `not_contains` `PLAN/DONE` en lugar de `READY-FOR-IMPLEMENT` |
| `story-plan` | TC-008 `guardia-plan-done-needs-changes` | nuevo | contexto: story-analyze deja `PLAN/DONE` con `verdict: NEEDS-CHANGES`; `contains` `PLAN/DONE sin verdict APPROVED`, `restaurado a PLAN/IN-PROGRESS`; `story_status_after` `PLAN/IN-PROGRESS` (fila 2) |
| `story-plan` | TC-009 `guardia-plan-done-sin-analyze` | nuevo | contexto: `PLAN/DONE` y `analyze.md` no generado; `contains` `error técnico`, `PLAN/DONE sin verdict APPROVED`, `Pipeline interrumpido` (fila 3) |
| `story-plan` | TC-010 `guardia-ready-for-implement-se-conserva` | nuevo | contexto: `READY-FOR-IMPLEMENT/DONE` con `NEEDS-CHANGES`; `contains` `READY-FOR-IMPLEMENT/DONE sin verdict APPROVED`, `restaurado a PLAN/IN-PROGRESS` (CNF-4) |
| `story-implement` | TC-045 `entrada-plan-done-ciclo-completo` | nuevo, desde TC-011 | `story_status` `PLAN/DONE`, sin `fix-directives.md`; `contains` `PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS`, `ciclo TDD completo`; `not_contains` `Modo rework`, `no está en un estado válido` (AC-1) |
| `story-implement` | TC-046 `plan-in-progress-rechazado` | nuevo, desde TC-012 | `story_status` `PLAN/IN-PROGRESS`; `contains` `no está en un estado válido para implementar`, `PLAN / substatus: IN-PROGRESS`, `PLAN/DONE`, `IMPLEMENT/IN-PROGRESS`, `READY-FOR-IMPLEMENT/DONE`; `files_unchanged` `story.md` (AC-2) |
| `story-implement` | TC-012 | migrar | añadir `PLAN/DONE` a `contains` |
| `story-implement` | TC-011 | sin cambio | caso CNF-4 (`READY-FOR-IMPLEMENT/DONE` sin `fix-directives.md`) |
| `story-implement-tasks` | TC-007 `entrada-plan-done-arranca` | nuevo, desde TC-003 | `story_status` `PLAN/DONE`, tareas pendientes, sin `fix-directives.md`; `contains` `PLAN/DONE ✓`; la historia pasa a `IMPLEMENT/IN-PROGRESS` antes de la primera tarea (AC-1) |
| `story-implement-tasks` | TC-008 `plan-in-progress-rechazado` | nuevo | `story_status` `PLAN/IN-PROGRESS`; `contains` `no está en un estado válido para implementar`, `PLAN/DONE`, `READY-FOR-IMPLEMENT/DONE`, `/story-plan`; ninguna tarea implementada (AC-2, también para este ejecutor) |
| `story-implement-tasks` | TC-003 | sin cambio | caso CNF-4 |

Los nombres de los casos (`name`) siguen el estilo kebab-case de cada archivo. El campo `description` de nivel superior de `story-implement/evals/evals.json` (línea 4) añade `PLAN/DONE` a la lista de estados del gate.

## Flujos clave

**F-1 — Planificación aprobada sin buffer (AC-1, SMOKE-1):** `story.md` en `PLAN/IN-PROGRESS` → `/story-analyze` → `verdict: APPROVED` → Paso 9a escribe `PLAN/DONE` → `/story-implement` (0c.2 admite `PLAN/DONE`, `$ENTRADA_STATUS = PLAN`) o `/story-implement-tasks` (1d admite, 2e escribe) → `IMPLEMENT/IN-PROGRESS`.

**F-2 — Análisis con NEEDS-CHANGES (AC-2):** `PLAN/IN-PROGRESS` → `/story-analyze` → `verdict: NEEDS-CHANGES` → `story.md` sin cambio → `/story-implement` → 0c.2 no admite `PLAN/IN-PROGRESS` → mensaje con los tres estados admitidos, sin escribir nada.

**F-3 — Guardia de `/story-plan` (AC-3):** Paso 5 lee `verdict` de `analyze.md` → registra la fila de la tabla → guardia: si verdict ≠ `APPROVED` y `story.md` está en `PLAN/DONE` o en `READY-FOR-IMPLEMENT` → escribe `PLAN/IN-PROGRESS` y emite el aviso con el estado leído → Paso 6 muestra el estado leído tras la guardia.

**F-4 — Orden de implementación (CNF-1):** C-1 a C-4 (evals) → C-5 a C-8 (`SKILL.md`) → C-9 a C-11 (README y ejemplos) → gate (CNF-5). `npm run test:eval` de los cuatro skills lo ejecuta una persona.

## Decisiones de complejidad justificada

- **Tres entradas en el gate durante la transición:** una sola entrada (`PLAN/DONE`) sería más simple, pero `story-code-review` sigue escribiendo `READY-FOR-IMPLEMENT/DONE` hasta STORY-189. Una entrada más es la forma más barata de no dejar historias sin ejecutor (CNF-4).
- **Aviso con el estado leído en lugar de un texto fijo:** evita duplicar la guardia por cada estado y nombra exactamente lo que se restauró. Es una interpolación, no una abstracción nueva.
- **Tres casos nuevos en `story-plan`:** uno por fila de AC-3 que no cubre un caso existente (filas 2 y 3) y uno para la guardia anterior (CNF-4). La fila 1 la cubren TC-001 y TC-007 con un `not_contains`.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | `story-analyze` 9a escribe `status: PLAN` / `substatus: DONE` con APPROVED y no cambia nada con NEEDS-CHANGES | lectura del Paso 9a | AC-1, AC-2 |
| V-2 | `skills/story-analyze/SKILL.md` no contiene `READY-FOR-IMPLEMENT` | `grep -c READY-FOR-IMPLEMENT` = 0 | AC-1, CNF-3 |
| V-3 | La guardia de `story-plan` cubre `PLAN/DONE` y `READY-FOR-IMPLEMENT`, el aviso usa el estado leído y `story-plan` no escribe `PLAN/DONE` | lectura del Paso 5; `grep -n "PLAN/DONE"` solo en textos de estado, guardia y «nunca escribe» | AC-3, CNF-3, CNF-4 |
| V-4 | En `story-plan/SKILL.md`, `READY-FOR-IMPLEMENT` solo aparece en la guardia | `grep -n READY-FOR-IMPLEMENT` | AC-3, CNF-4 |
| V-5 | Los dos ejecutores admiten `PLAN/DONE`, `IMPLEMENT/IN-PROGRESS` y `READY-FOR-IMPLEMENT/DONE`, y el rechazo lista los tres | lectura de 0c.2 y 1d | AC-1, AC-2, CNF-4 |
| V-6 | La transición de arranque trata `PLAN` como `READY-FOR-IMPLEMENT` | lectura de 0c.4 y 2e | AC-1 |
| V-7 | Los evals tienen los casos de «Esquema de datos» y siguen siendo JSON válido con ID `TC-NNN` únicos | `node -e "JSON.parse(...)"` y `npm run verify:eval-inventory` | CNF-1, CNF-4 |
| V-8 | Los evals se escribieron antes que los `SKILL.md` | orden de las tareas en `tasks.md` (y de los commits, si se commitea por tarea) | CNF-1 |
| V-9 | `dod-story-plan.md` y `dod-story.js` sin cambios | `git diff --quiet -- docs/guardrails/dod-story-plan.md skills/memory-system/scripts/dod-story.js` | CNF-2 |
| V-10 | README y ejemplos de los cuatro skills sin `READY-FOR-IMPLEMENT` como cierre de la planificación; solo quedan las menciones de rework (STORY-189) y del valor anterior admitido | `grep -n READY-FOR-IMPLEMENT` sobre C-9 a C-11 y revisión de cada línea | AC-1 |
| V-11 | Gate verde | `npm run verify:repository` y `npm test` con salida 0 | CNF-5 |
| V-12 | Archivos sin BOM ni U+FEFF | comprobación de bytes de los archivos tocados | CNF-5 (memoria del proyecto: U+FEFF recurrente) |

## Risks / Trade-offs

- [STORY-189 edita los mismos gates de entrada] → la lista del rechazo deja el estado anterior al final (D-02) para que STORY-189 inserte `IMPLEMENT/TODO` sin reordenar. Si se implementan seguidas, integrar las dos entradas en la misma edición (nota de la historia).
- [`/story-analyze` manual sobre una historia ya en `PLAN/DONE` con un plan editado que ahora da `NEEDS-CHANGES` la deja en `PLAN/DONE`, y los ejecutores la aceptan] → el hueco existe hoy con `READY-FOR-IMPLEMENT` y AC-2 parte de `PLAN/IN-PROGRESS`. Solo `story-plan` lo cubre (vía 1e y la guardia). Se registra como CR-001.
- [Un eval de los ejecutores queda con `READY-FOR-IMPLEMENT/DONE` en una entrada inicial y se lee como deuda] → es intencional (CNF-4). La `description` de TC-011 y TC-003 añade «entrada anterior a 6.0.0, se conserva por CNF-4».
- [El `not_contains` `PLAN/DONE` de un caso NEEDS-CHANGES choca con un mensaje que nombra el estado] → los mensajes de NEEDS-CHANGES de `story-analyze` sí nombran `PLAN/DONE` («no se actualizó a PLAN/DONE»). En esos casos el `not_contains` usa `Estado story.md: PLAN/DONE ✓` en lugar de la cadena desnuda. Para `story-plan` TC-006, `not_contains` `PLAN/DONE ✓`.
- [Los destinos de runtime (`.claude/skills/`) siguen con la versión anterior hasta reinstalar] → no se versionan. Tras implementar, una persona ejecuta `npx agile-sddf install` si quiere usar los skills nuevos en esta sesión de dogfooding.

## Open Questions

Ninguna bloqueante. CR-001 queda como propuesta fuera de alcance.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `story-analyze` no cambia `story.md` con `NEEDS-CHANGES`. Si se ejecuta a mano sobre una historia ya en `PLAN/DONE` (p. ej. tras editar `design.md`), la historia queda en `PLAN/DONE` con un `analyze.md` que no la aprueba, y los ejecutores la aceptan. La guardia solo existe en `story-plan`. El mismo hueco existe hoy con `READY-FOR-IMPLEMENT/DONE`.
- **Documento afectado**: story.md (fuera de alcance de STORY-188); `skills/story-analyze/SKILL.md` en una historia futura.
- **Acción requerida**: decidir en una propuesta aparte si `story-analyze` con `NEEDS-CHANGES` debe restaurar `PLAN/IN-PROGRESS` cuando encuentra `PLAN/DONE`. No bloquea esta historia.
