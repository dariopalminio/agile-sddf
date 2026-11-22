---
alwaysApply: false
type: design
id: STORY-145
slug: STORY-145-alinear-story-acceptance-design
title: "Design: Alinear story-acceptance"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-145
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-145-alinear-story-acceptance
  - STORY-138-contrato-de-validacion
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-145-alinear-story-acceptance]] · [[STORY-138-contrato-de-validacion]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear story-acceptance

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `story-acceptance`, el último gate antes de DELIVER.
Aplica el contrato tal como lo fija el diseño de STORY-138: reglas G-01…G-06, fila `story-acceptance` de §4
(`APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, `PENDING`; valores sin rama: `BLOCKED`, `PENDING`), equivalencias de §5
(`ACCEPTANCE-APPROVED` → `APPROVED`; `ACCEPTANCE-REJECTED` → `NEEDS-CHANGES`; `ACCEPTANCE-BLOCKED` → `BLOCKED`;
`session-status: partial` → `PENDING`), la precedencia G-05 (con rechazo y bloqueo gana `NEEDS-CHANGES`; con sesión
`partial`, `PENDING`), la regla D-7 sobre reportes heredados y el ejemplo 7.6 (`type: acceptance-report`,
`# Acceptance Report: …`, siguiente `##` = `## Resumen ejecutivo`).

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/story-acceptance/assets/acceptance-report-template.md` (42 líneas) | Frontmatter con `session-status: {session_status}` (l.8) y `final-status: {final_status}` (l.9). Tras `# Acceptance Report: {story_id} — {story_title}` (l.12) viene `## Resumen ejecutivo` (l.14). El resultado está al final, en `## Estado final` (l.36) con `{estado_final_texto}`. Última sección: `## Historial de sesiones anteriores` (l.40). |
| `skills/story-acceptance/SKILL.md` (532 líneas) | La regla vive en 7b (l.371-377) y produce `$FINAL_STATUS` = `ACCEPTANCE-APPROVED` / `-REJECTED` / `-BLOCKED`, ya con la precedencia del rechazo sobre el bloqueo. 7d (l.385-407) fija `{session_status}` = `complete` y define `{final_status}` (l.397) y `{estado_final_texto}` (l.404, con «ACCEPTANCE RECHAZADO» y «ACCEPTANCE BLOQUEADO»). 8a (l.420-444) transiciona `story.md` e imprime `ACCEPTANCE APROBADO/RECHAZADO/BLOQUEADO`. 8b (l.446-478) repite esos textos. El aviso de reporte completo (Paso 3 › Estado C, l.260) muestra `{final-status}`. El camino `[Q]` (l.339-343) escribe el reporte con `session-status: partial` sin decir qué resultado declara. Posicionamiento (l.33-36), Salida (l.484-488) y Test Cases (l.497, l.506) usan los valores heredados. |
| Precondición 1d (l.156-180) y Restricciones (l.92) | Solo `VERIFY/DONE` o `ACCEPTANCE/IN-PROGRESS`. El mensaje de `ACCEPTANCE-BLOCKED` (l.444) pide «re-ejecuta /story-acceptance», pero la historia queda en `ACCEPTANCE/BLOCKED` y 1d la rechaza (ver D-7 y CR-001). |
| Resultados por criterio | `APPROVED` / `REJECTED` / `BLOCKED` en la tabla `## Detalle por criterio`, en el resumen ejecutivo y en 8b. `PENDIENTE` para los criterios sin evaluar del reporte parcial (`example-partial`). No son el veredicto del reporte (Notas de la historia). |
| `skills/story-acceptance/examples/*/acceptance-report.md` | `example-approved` (`final-status: ACCEPTANCE-APPROVED`), `example-rejected` (`ACCEPTANCE-REJECTED`, y su `## Estado final` dice por error «ACCEPTANCE BLOQUEADO»), `example-partial` (`final-status: IN-PROGRESS`, valor que ni el SKILL.md define, y un bloque `> **Sesión parcial** …` entre el título y el primer `##`). Los tres incumplen G-01, G-02 y G-04 (CR-002 de STORY-143). |
| `skills/story-acceptance/examples/example-approved/definition-of-done-story.md` | l.20: «`acceptance-report.md` generado con resultado final `ACCEPTANCE-APPROVED`». Las filas DoD de los reportes de ejemplo repiten ese texto. |
| `skills/story-acceptance/evals/evals.json` | `version: 1.0.0`, 12 casos. 11 afirman `ACCEPTANCE-APPROVED`, `-REJECTED` o `-BLOCKED` en `contains` o `not_contains`. TC-001 tiene `not_contains: "REJECTED", "BLOCKED"`, que la línea de totales de 8b (`│ 0 REJECTED │ 0 BLOCKED`) ya contradice. Ningún caso cubre la lectura de un reporte completo existente (AC-2). |
| `skills/story-acceptance/README.md` | Sin vocabulario de veredicto. l.16: «actualizado de forma condicional tras la aceptación, rechazo o bloqueo». |
| DoD ACCEPTANCE del repositorio | `docs/guardrails/dod-story-acceptance.md` l.26: «generado con resultado final `ACCEPTANCE-APPROVED`» (`enforcement: error`). La semilla `skills/sddf-constitution/assets/dod-story/dod-story-acceptance.md` no menciona el resultado. |
| Ejemplos de `memory-system` | `skills/memory-system/examples/dod-custom/docs/guardrails/dod-story-checklist.md` l.119, `dod-legacy/docs/policies/dod-story.md` l.132 y `dod-monolithic/docs/guardrails/dod-story-checklist.md` l.132: el mismo criterio con `ACCEPTANCE-APPROVED`. `test/dod-story.test.js` compara cantidades de criterios derivadas del propio fixture (l.168, l.272), no su texto. |
| Consumidores | `story-implement` (`SKILL.md` l.46, l.296; `README.md` l.51) declara que `acceptance-report.md` **no** es señal de rework. Ningún script de `scripts/` ni prueba de `test/` lee `final-status`. Ningún skill lee el resultado de `acceptance-report.md`. |
| Documentación vigente | `docs/architecture/state-machine.md` l.52-54 (`all APPROVED`, `≥1 REJECTED`, `≥1 BLOCKED`) y l.104 (tabla de skills); `docs/domains/domain-story-lifecycle.md` l.101-103 y l.118-119. |
| Flowchart | `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid` l.12-15: `J[story-acceptance] --> K{verdict}` con `NEEDS-CHANGES → B`, `BLOCKED → J` y `APPROVED → L(END)`. No cambia. |
| `scripts/run-evals.js` | Inserta `input` como JSON en el prompt y califica la consola con subcadenas sensibles a mayúsculas. No inspecciona archivos. |
| `docs/policies/validation-contract-policy.md` | Todavía no existe. Lo crea STORY-138 (ver D-10). |

## Goals / Non-Goals

**Goals:**

- `acceptance-report.md` declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras
  `# Acceptance Report: …`, con el mismo valor. // satisface: AC-1
- La regla emite `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` o `PENDING` según las cinco filas de AC-1. // satisface: AC-1
- Ni el reporte ni la consola contienen `final-status` ni `ACCEPTANCE-APPROVED`, `ACCEPTANCE-REJECTED` o
  `ACCEPTANCE-BLOCKED`. // satisface: AC-1
- El aviso de reporte completo existente muestra el valor leído de `verdict`, nunca de `final-status`. // satisface: AC-2
- La validación criterio por criterio, `session-status` y la reanudación no cambian. // satisface: CNF-1

**Non-Goals:**

- Hacer que `story-implement` reconozca `acceptance-report.md` como señal de rework (Fuera de alcance de la historia).
- Reescribir los `acceptance-report.md` históricos de `docs/specs/stories/` (Fuera de alcance; D-7 de STORY-138).
- Renombrar los resultados por criterio `APPROVED` / `REJECTED` / `BLOCKED` / `PENDIENTE` (D-3).
- Cambiar los criterios del DoD ACCEPTANCE más allá del texto que nombra el valor heredado (D-8).
- Corregir derivas previas ajenas al veredicto: TC-010 prueba un `skill-preflight` que el skill ya no invoca, y el
  criterio DoD sobre el propio reporte es circular (CR-002).
- Añadir una entrada al CHANGELOG: la escribe `/doc-release-notes` al publicar.

## Decisions

### D-1 — Regla de veredicto con G-05 // satisface: AC-1, CNF-1

`$FINAL_STATUS` desaparece. 7b se titula «7b. Determinar el veredicto» y deriva `$VERDICT` con esta tabla, evaluada
**en orden** (primera fila que se cumple):

| # | Condición | `$VERDICT` | Fila de AC-1 |
|---|---|---|---|
| 1 | La sesión termina con `[Q]` (`session-status: partial`) | `PENDING` | sesión interrumpida con criterios sin evaluar |
| 2 | `$TOTAL_REJECTED > 0` | `NEEDS-CHANGES` | al menos un criterio rechazado (con o sin bloqueados) |
| 3 | `$TOTAL_BLOCKED > 0` | `BLOCKED` | al menos un criterio bloqueado y ninguno rechazado |
| 4 | En otro caso | `APPROVED` | todos los criterios aprobados |

- Las filas 2-4 son la regla actual de 7b, con otro nombre: la decisión de cada criterio no cambia (CNF-1). El orden
  de las filas 2 y 3 **es** G-05 y la Decisión del PO (con rechazo y bloqueo, `NEEDS-CHANGES`).
- La fila 1 también es G-05. Al completar una sesión reanudada, 7a ya suma las filas de la sesión anterior
  («+ ejecuciones anteriores (si reanudación)», l.365), así que el veredicto se recalcula con ellas (Decisión del PO).
- `$TOTAL_CRITERIOS`, `$TOTAL_APPROVED`, `$TOTAL_REJECTED` y `$TOTAL_BLOCKED` no cambian. Para el reporte parcial se
  añade `$N_EVALUADOS` = suma de los tres últimos, y `$TOTAL_CRITERIOS` cuenta todos los criterios a validar.

| Alternativa | Motivo del rechazo |
|---|---|
| `BLOCKED` gana a `NEEDS-CHANGES` | Contradice la Decisión del PO del 2026-10-17 y G-05. |
| Sesión parcial sin `verdict` | Viola G-01 (todo reporte declara `verdict`) y deja a CI sin valor que leer. G-06 lo trataría igual como no aprobado, pero sin explicar por qué. |
| Calcular el veredicto parcial con los criterios ya evaluados (ej. `NEEDS-CHANGES` si hay un rechazo) | Contradice G-05 («mientras la sesión sea `partial`, el veredicto es `PENDING`») y la fila 5 de AC-1. |
| Conservar `$FINAL_STATUS` y traducir al escribir | Dos nombres para el mismo concepto (P4) y literales `ACCEPTANCE-*` dentro del skill, que es lo que CS-9 retira. |

### D-2 — Sección `## Veredicto` al inicio con motivo determinista; desaparece `## Estado final` // satisface: AC-1

Estructura del template tras el cambio:

| Orden | Encabezado | Contenido |
|---|---|---|
| — | `# Acceptance Report: {story_id} — {story_title}` | Sin cambios |
| 1 | `## Veredicto` | `` **Veredicto:** `{verdict}` — {verdict_reason} ``, y debajo `{verdict_details}` |
| 2 | `## Resumen ejecutivo` | Sin cambios |
| 3… | `## Detalle por criterio`, `## Criterios DoD ACCEPTANCE`, `## Historial de sesiones anteriores` | Sin cambios de nombre ni de orden |
| — | `## Estado final` | **Se elimina** con `{estado_final_texto}`: declaraba el veredicto en otra línea (G-04) |

**`{verdict_reason}`** es determinista, para que las evals puedan afirmarlo:

| `$VERDICT` | Motivo |
|---|---|
| `APPROVED` | `{total_approved} de {total_criterios} criterios aprobados.` |
| `NEEDS-CHANGES` | `{total_rejected} criterio(s) rechazado(s) y {total_blocked} bloqueado(s).` |
| `BLOCKED` | `{total_blocked} criterio(s) bloqueado(s) sin evaluar; ninguno rechazado.` |
| `PENDING` | `Sesión parcial: {n_evaluados} de {total_criterios} criterios evaluados.` |

**`{verdict_details}`** son los «motivos breves» que admite G-02:

| `$VERDICT` | Contenido |
|---|---|
| `APPROVED` | Cadena vacía |
| `NEEDS-CHANGES`, `BLOCKED` | Una línea por criterio `REJECTED` o `BLOCKED`, en orden: `- Criterio {N} — {RESULTADO}: {título del criterio}`. La observación sigue en `## Detalle por criterio` |
| `PENDING` | `Ejecuta /story-acceptance {story_id} para reanudar.` |

El bloque `> **Sesión parcial** …` de `example-partial` (entre el título y el primer `##`) desaparece: G-02 solo admite
líneas en blanco o comentarios HTML en ese hueco. Su información pasa al motivo y a `{verdict_details}` de `PENDING`.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar `## Estado final` con texto sin valor de veredicto | Repite la decisión en otra línea (G-04) y es justo la sección que hoy diverge del frontmatter (`example-rejected` dice «BLOQUEADO» con `ACCEPTANCE-REJECTED`). |
| Motivo libre redactado por el agente | No se puede afirmar en evals, y dos sesiones iguales darían textos distintos. |
| Repetir las observaciones en `{verdict_details}` | Pueden ser largas. G-02 pide motivos breves y el detalle ya vive en `## Detalle por criterio`. |

### D-3 — Los resultados por criterio no cambian // satisface: AC-1, CNF-1

`APPROVED` / `REJECTED` / `BLOCKED` por criterio (y `PENDIENTE` en el reporte parcial) se mantienen en
`## Detalle por criterio`, en `## Resumen ejecutivo` y en la tabla de 8b. Son resultados de un criterio, no el veredicto
del reporte: G-04 solo prohíbe otro campo o línea que declare **el veredicto**, y §5 de la policy no los lista como
heredados. CS-9 y el `Pero` de AC-1 retiran `ACCEPTANCE-REJECTED`, no `REJECTED`.

| Alternativa | Motivo del rechazo |
|---|---|
| Renombrar `REJECTED` → `NEEDS-CHANGES` por criterio | Mezcla el resultado de un criterio con el veredicto del reporte, cambia la sesión de validación (CNF-1) y no lo pide ningún criterio de salida. |
| Renombrar a `PASS` / `FAIL` / `BLOCKED` (las teclas de la sesión) | Mismo cambio de salida de la validación (CNF-1) sin beneficio para el contrato. |

Si la policy publicada decide renombrarlos (Notas de la historia: «La política decide si se renombran»), se aplica la
versión publicada según D-10.

### D-4 — Frontmatter: `verdict` en lugar de `final-status` // satisface: AC-1, AC-2

En `acceptance-report-template.md`, l.9 `final-status: {final_status}` pasa a `verdict: {verdict}`. `session-status`
(l.8) se mantiene: G-04 lo nombra como campo que no es veredicto, y el Paso 3 lo usa para detectar la sesión parcial
(CNF-1). La tabla de placeholders de 7d:

| Placeholder | Cambio |
|---|---|
| `{final_status}` | Se elimina |
| `{estado_final_texto}` | Se elimina (D-2) |
| `{verdict}` | Nuevo: `$VERDICT` |
| `{verdict_reason}` | Nuevo: D-2 |
| `{verdict_details}` | Nuevo: D-2 |
| `{session_status}` | `complete` al terminar la sesión; `partial` en el camino `[Q]` (hoy fijo en `complete`) |

El camino `[Q]` del Paso 5 escribe el reporte con el mismo template y la misma tabla de 7d, con
`{session_status}` = `partial` y `{verdict}` = `PENDING`. La forma de la tabla de detalle del reporte parcial no cambia.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener `final-status` junto a `verdict` | Dos campos para el mismo veredicto (G-04) y el `Pero` de AC-1 lo prohíbe. |
| Fusionar `session-status` en `verdict` | El Paso 3 dejaría de distinguir una sesión parcial heredada sin `verdict`; la reanudación cambiaría (CNF-1). |

### D-5 — Aviso de reporte existente leído de `verdict` // satisface: AC-2, CNF-1

El Paso 3 › Estado C (l.260) lee `verdict` del frontmatter del reporte existente:

| Reporte existente | Primera línea del aviso |
|---|---|
| Con `verdict` | `Se encontró un acceptance-report.md completo con veredicto {verdict}.` |
| Sin `verdict` (heredado) | `Se encontró un acceptance-report.md completo sin veredicto (reporte anterior al contrato de validación).` |

- El skill no lee `final-status` en ningún paso (el `Pero` de AC-2). Un reporte heredado se identifica por la ausencia
  de `verdict`.
- Las opciones `(r)` / `(v)` y la detección por `session-status` (Estados B y C) no cambian (CNF-1). Una sesión parcial
  heredada se reanuda igual, porque conserva `session-status: partial`.
- El valor mostrado es informativo: ninguna opción depende de él.

| Alternativa | Motivo del rechazo |
|---|---|
| Traducir `final-status` con §5 cuando falta `verdict` (D-7 de STORY-138) | El aviso no decide nada, y leer `final-status` contradice el `Pero` de AC-2. D-7 aplica a consumidores que necesitan el valor para decidir. |
| Mostrar `desconocido` sin explicación | El mantenedor no sabría si el reporte está roto o es heredado. |

### D-6 — Salida de consola con el veredicto // satisface: AC-1, AC-2

El runner de evals solo ve la consola. Se reutiliza la forma `(verdict: <VALOR>)` de STORY-140 D-5, STORY-141 D-6 y
STORY-142 D-8 (P3):

| Lugar en `SKILL.md` | Hoy | Tras el cambio |
|---|---|---|
| Paso 5 `[Q]`, punto 3 (l.342) | `💾 Sesión guardada. Ejecuta /story-acceptance {story_id} para reanudar.` | `💾 Sesión guardada (verdict: PENDING). Ejecuta /story-acceptance {story_id} para reanudar.` |
| 8a, `APPROVED` (l.428) | `✅ ACCEPTANCE APROBADO: historia {story_id} lista para DELIVER` | `✅ Veredicto: APPROVED — historia {story_id} lista para DELIVER` |
| 8a, `NEEDS-CHANGES` (l.436) | `⚠️ ACCEPTANCE RECHAZADO: {N} criterio(s) … regresa a READY-FOR-IMPLEMENT/DONE.` | `⚠️ Veredicto: NEEDS-CHANGES — {verdict_reason} La historia regresa a READY-FOR-IMPLEMENT/DONE.` |
| 8a, `BLOCKED` (l.444) | `⚠️ ACCEPTANCE BLOQUEADO: … Resuelve el impedimento y re-ejecuta /story-acceptance.` | `⛔ Veredicto: BLOCKED — {verdict_reason} La historia permanece en ACCEPTANCE/BLOCKED. Resuelve el impedimento y vuelve a ejecutar /story-acceptance.` |
| 8b, bloque de resumen (l.458) | — | Línea nueva tras `Total: …`: ` Veredicto: {verdict}` |
| 8b, l.461 | `📄 Reporte generado: {$STORY_DIR}/acceptance-report.md` | `📄 Reporte generado: {$STORY_DIR}/acceptance-report.md (verdict: {verdict})` |
| 8b, l.462-464 | `(si ACCEPTANCE-APPROVED)` / `(si ACCEPTANCE-REJECTED)` / `(si ACCEPTANCE-BLOCKED)` | `(si APPROVED)` / `(si NEEDS-CHANGES)` / `(si BLOCKED)` |
| 8b, l.466-478 | Tres bloques con `ACCEPTANCE APROBADO` / `RECHAZADO` / `BLOQUEADO` | Los tres mensajes de 8a de esta tabla, con la segunda y tercera línea actuales |

Los fail-fast (historia no encontrada, `story.md` ausente, precondición inválida), `--dry-run` y la opción `(v)` no
escriben reporte ni imprimen `(verdict: `. Se conservan las subcadenas que las evals vigentes afirman: «lista para
DELIVER», «regresa a READY-FOR-IMPLEMENT», «Resuelve el impedimento» y «Sesión guardada».

| Alternativa | Motivo del rechazo |
|---|---|
| No tocar la consola | Los mensajes actuales contienen `ACCEPTANCE RECHAZADO` y las evals no podrían distinguir un reporte alineado de uno heredado. |
| Afirmar solo `"NEEDS-CHANGES"` en las evals | `(verdict: X)` es único y lo producen solo `[Q]` y 8b; el valor suelto puede aparecer en otros textos. |

### D-7 — Transición de `story.md` por veredicto y reentrada desde `ACCEPTANCE/BLOCKED` // satisface: AC-1, CNF-1

| `$VERDICT` | `story.md` | Cambio respecto de hoy |
|---|---|---|
| `APPROVED` | `ACCEPTANCE/DONE` | Ninguno |
| `NEEDS-CHANGES` | `READY-FOR-IMPLEMENT/DONE` | Ninguno |
| `BLOCKED` | `ACCEPTANCE/BLOCKED` | Ninguno |
| `PENDING` | `ACCEPTANCE/IN-PROGRESS` (se mantiene) | Ninguno |

La precondición 1d (y Restricciones, l.92) acepta además `ACCEPTANCE/BLOCKED` como **reentrada** tras resolver el
impedimento. Es la rama `BLOCKED → story-acceptance` del flowchart (l.14) y lo que el mensaje de 8a ya pide. El mensaje
de error de 1d añade `· ACCEPTANCE/BLOCKED → reintento tras resolver el impedimento`. En la reentrada, el Paso 3 encuentra
el reporte completo con `verdict: BLOCKED` (Estado C, D-5) y, con `(r)`, el Paso 4 pasa la historia a
`ACCEPTANCE/IN-PROGRESS` (su condición «NO es `ACCEPTANCE/IN-PROGRESS`» ya la cubre). La sesión de validación y la
reanudación de sesiones parciales no cambian (CNF-1). `ACCEPTANCE/BLOCKED` no es `IN-PROGRESS`, así que no ocupa WIP.

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar 1d sin cambios | El veredicto `BLOCKED` sería un callejón sin salida: el mensaje del skill pediría volver a ejecutarlo y 1d lo rechazaría (CR-001). |
| Volver a `VERIFY/DONE` ante `BLOCKED` | Retrocede el status, contra la definición del substatus `BLOCKED` («no retrocede el status», `domain-story-lifecycle.md` l.148). |

### D-8 — Textos con `ACCEPTANCE-*` fuera del skill // satisface: AC-1

El criterio «`acceptance-report.md` generado con resultado final `ACCEPTANCE-APPROVED`» pasa a
«`acceptance-report.md` generado con `verdict: APPROVED`» en:

- `docs/guardrails/dod-story-acceptance.md` l.26 (y `updated: 2026-10-17` en su frontmatter).
- `skills/story-acceptance/examples/example-approved/definition-of-done-story.md` l.20.
- `skills/memory-system/examples/dod-custom/docs/guardrails/dod-story-checklist.md` l.119,
  `skills/memory-system/examples/dod-legacy/docs/policies/dod-story.md` l.132 y
  `skills/memory-system/examples/dod-monolithic/docs/guardrails/dod-story-checklist.md` l.132.

Es un cambio de texto de una línea, sin alterar la cantidad de criterios, así que `test/dod-story.test.js` no cambia.
El DoD de este repositorio se presenta al validador como criterio de la sesión (Paso 2b): con el texto heredado le
pediría comprobar un valor que el skill ya no emite.

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar los fixtures de `memory-system` como «legado» | `migrate --from=dod-monolithic` copia esos criterios a `dod-story-acceptance.md` del proyecto destino, donde son criterios activos. |
| Eliminar el criterio | Cambia los criterios del DoD (Non-Goals). |

### D-9 — Evals // satisface: AC-1, AC-2, CNF-1

**`skills/story-acceptance/evals/evals.json`** (`version` → `1.1.0`; la `description` añade «veredicto APPROVED /
NEEDS-CHANGES / BLOCKED / PENDING»). En todas las `description`, `final-status ACCEPTANCE-X` pasa a `verdict X`.

| Caso | Veredicto | `contains` | `not_contains` |
|---|---|---|---|
| TC-001 | `APPROVED` | `"ACCEPTANCE-APPROVED"` → `"(verdict: APPROVED)"`; se añade `"Veredicto: APPROVED"` | `"ACCEPTANCE-REJECTED"`, `"ACCEPTANCE-BLOCKED"`, `"REJECTED"`, `"BLOCKED"` → `"(verdict: NEEDS-CHANGES)"`, `"(verdict: BLOCKED)"`, `"(verdict: PENDING)"`; se añaden `"ACCEPTANCE-APPROVED"`, `"final-status"` |
| TC-002 | `NEEDS-CHANGES` | `"ACCEPTANCE-REJECTED"` → `"(verdict: NEEDS-CHANGES)"`; se añade `"Veredicto: NEEDS-CHANGES"` | `"ACCEPTANCE-APPROVED"`, `"ACCEPTANCE-BLOCKED"` → `"(verdict: APPROVED)"`, `"(verdict: BLOCKED)"`; se añaden `"ACCEPTANCE-REJECTED"`, `"final-status"` |
| TC-003, TC-007, TC-010 | ninguno | sin cambios | los `"ACCEPTANCE-APPROVED"` / `"ACCEPTANCE-REJECTED"` → `"(verdict: "` |
| TC-004, TC-005, TC-008 | `APPROVED` | `"ACCEPTANCE-APPROVED"` → `"(verdict: APPROVED)"` | `"ACCEPTANCE-REJECTED"` → `"(verdict: NEEDS-CHANGES)"` (TC-004, TC-005) |
| TC-006 | `BLOCKED` | `"ACCEPTANCE-BLOCKED"` → `"(verdict: BLOCKED)"`; se añade `"Veredicto: BLOCKED"` | `"ACCEPTANCE-APPROVED"`, `"ACCEPTANCE-REJECTED"` → `"(verdict: APPROVED)"`, `"(verdict: NEEDS-CHANGES)"`; se añade `"ACCEPTANCE-BLOCKED"` |
| TC-009 | `NEEDS-CHANGES` (G-05) | `"ACCEPTANCE-REJECTED"` → `"(verdict: NEEDS-CHANGES)"`; se añade `"Veredicto: NEEDS-CHANGES"` | `"ACCEPTANCE-APPROVED"`, `"ACCEPTANCE-BLOCKED"` → `"(verdict: APPROVED)"`, `"(verdict: BLOCKED)"` |
| TC-011 | ninguno exigido | sin cambios | `"ACCEPTANCE-APPROVED"` → `"(verdict: APPROVED)"` |
| TC-012 | `PENDING` | se añade `"(verdict: PENDING)"` | `"ACCEPTANCE-APPROVED"`, `"ACCEPTANCE-REJECTED"` → `"(verdict: APPROVED)"`, `"(verdict: NEEDS-CHANGES)"` |
| TC-013 (nuevo) | lectura | `"acceptance-report.md completo con veredicto NEEDS-CHANGES"` | `"final-status"`, `"ACCEPTANCE-REJECTED"`, `"(verdict: "` |
| TC-014 (nuevo) | lectura heredada | `"sin veredicto (reporte anterior al contrato de validación)"` | `"con veredicto"`, `"(verdict: "` |

- **TC-001:** `"REJECTED"` y `"BLOCKED"` se sustituyen porque la línea de totales de 8b (`│ 0 REJECTED │ 0 BLOCKED`)
  los contiene siempre. Los marcadores `(verdict: …)` expresan la misma intención sin ese falso negativo.
- **TC-013** (`type: edge-case`, `name: reporte-completo-existente-leido-por-verdict`): `story_id: STORY-060`,
  `VERIFY/DONE`, `existing_report: {"session-status": "complete", "verdict": "NEEDS-CHANGES"}`, `responses: ["v"]`.
  Cubre AC-2. `(v)` no escribe reporte, así que `"(verdict: "` no aparece.
- **TC-014** (`type: edge-case`, `name: reporte-completo-heredado-sin-verdict`): igual que TC-013 con
  `existing_report: {"session-status": "complete", "final-status": "ACCEPTANCE-REJECTED"}`. Cubre la degradación de D-5.
  No afirma la ausencia de `ACCEPTANCE-REJECTED`: `(v)` muestra el reporte heredado tal cual.
- Los literales `ACCEPTANCE-*` y `final-status` en `not_contains` son la prueba de AC-1 y AC-2, no vocabulario emitido.
  V-1 excluye `evals.json`.

| Alternativa | Motivo del rechazo |
|---|---|
| No añadir casos para AC-2 | Ningún caso actual ejercita el Estado C: el `Pero` de AC-2 quedaría sin prueba. |
| Probar AC-2 con `(r)` y una sesión nueva | Mezcla la lectura con una validación completa; `(v)` aísla el aviso. |

### D-10 — Conformidad con la policy y secuencia // satisface: AC-1

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | D-4 |
| C-2 | G-02: `## Veredicto` es el primer `##` tras el `#`, con `` **Veredicto:** `<VALOR>` — <motivo> `` | D-2 |
| C-3 | G-03 y §4: solo `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, `PENDING` | D-1 |
| C-4 | G-04: ningún otro campo o línea declara el veredicto; `session-status` se mantiene | D-2 (sin `## Estado final`), D-4 |
| C-5 | G-05: con rechazo y bloqueo, `NEEDS-CHANGES`; con sesión `partial`, `PENDING` | D-1, TC-009, TC-012 |
| C-6 | G-06: `BLOCKED` y `PENDING` no habilitan el avance | D-7 (`ACCEPTANCE/BLOCKED`, `ACCEPTANCE/IN-PROGRESS`) |
| C-7 | D-7 de STORY-138: reportes heredados no se reescriben | D-5 (aviso sin leer `final-status`); `docs/specs/**` intacto |
| C-8 | §7.6: `type: acceptance-report`, `# Acceptance Report: …`, siguiente `##` = `## Resumen ejecutivo` | D-2 |
| C-9 | §6: divergencias registradas | Ninguna: los resultados por criterio no son veredicto (D-3) |

La implementación empieza cuando `docs/policies/validation-contract-policy.md` existe (lo comprueba la primera tarea),
como en STORY-140 D-12, STORY-141 D-11 y STORY-142 D-11. C-1…C-9 se comparan con el texto publicado. Si difiere del
diseño de STORY-138, se aplica la versión publicada y la diferencia se anota en `implement-report.md`.

### D-11 — Inventario de cambios en textos // satisface: AC-1, AC-2, CNF-1

| Archivo | Líneas | Cambio |
|---|---|---|
| `skills/story-acceptance/SKILL.md` | l.3-7 | `description`: «Genera acceptance-report.md con un veredicto (APPROVED / NEEDS-CHANGES / BLOCKED / PENDING) guiando …» |
| | l.24 | Objetivo: «genera `acceptance-report.md` con un veredicto» |
| | l.33-36 | Posicionamiento: una línea por veredicto con su transición (D-7) y `ACCEPTANCE/BLOCKED` como entrada válida |
| | l.92, l.156-180 | Precondición con `ACCEPTANCE/BLOCKED` (D-7) |
| | l.260 | Aviso leído de `verdict` (D-5) |
| | l.339-343 | `[Q]`: reporte con `session-status: partial` y `verdict: PENDING` (D-4) y mensaje (D-6) |
| | l.362-377 | `$N_EVALUADOS` y regla de veredicto (D-1) |
| | l.385-407 | Placeholders (D-4) |
| | l.418-478 | Transiciones (D-7) y consola (D-6) |
| | l.482-488 | Salida: transición por veredicto, sin `ACCEPTANCE-*` |
| | l.490-532 | Test Cases: `verdict: APPROVED` / `NEEDS-CHANGES` y mensajes de D-6 |
| `skills/story-acceptance/assets/acceptance-report-template.md` | l.9, l.12-14, l.36-38 | D-2 y D-4 |
| `skills/story-acceptance/examples/example-approved/acceptance-report.md` | todo el contrato | `verdict: APPROVED`, `## Veredicto` con `6 de 6 criterios aprobados.`, sin `## Estado final`; fila DoD con el texto de D-8 |
| `skills/story-acceptance/examples/example-rejected/acceptance-report.md` | ídem | `verdict: NEEDS-CHANGES`, motivo `1 criterio(s) rechazado(s) y 0 bloqueado(s).`, detalle `- Criterio 2 — REJECTED: Escenario alternativo – Email no registrado`; sin `## Estado final`; fila DoD con el texto de D-8 |
| `skills/story-acceptance/examples/example-partial/acceptance-report.md` | ídem | `verdict: PENDING`, motivo `Sesión parcial: 1 de 2 criterios evaluados.`, detalle de reanudación; sin el bloque `>` ni `## Estado final` |
| `skills/story-acceptance/examples/example-approved/definition-of-done-story.md` | l.20 | D-8 |
| `skills/story-acceptance/README.md` | l.11, l.16 | «según el veredicto» en lugar de «tras la aceptación, rechazo o bloqueo» |
| | tras «Produces» | Sección breve `## Veredicto` con la tabla de D-1 y D-7, y la remisión a la policy |
| `skills/story-acceptance/evals/evals.json` | todo | D-9 |
| `docs/guardrails/dod-story-acceptance.md` | l.12, l.26 | D-8 |
| `skills/memory-system/examples/*` | 3 archivos | D-8 |
| `docs/architecture/state-machine.md` | l.52-54, l.104 | `all APPROVED` → `APPROVED`; `≥1 REJECTED` → `NEEDS-CHANGES`; `≥1 BLOCKED` → `BLOCKED`; en la tabla, «Retroceso» = `READY-FOR-IMPLEMENT/DONE (NEEDS-CHANGES)` o `ACCEPTANCE/BLOCKED (BLOCKED)` y precondición con `ACCEPTANCE/BLOCKED (reintento)` |
| `docs/domains/domain-story-lifecycle.md` | l.101-103, l.118-119 | Mismas etiquetas; «Rework por aceptación» = `ACCEPTANCE → READY-FOR-IMPLEMENT (NEEDS-CHANGES)`; «Bloqueo en aceptación» = `ACCEPTANCE → ACCEPTANCE (BLOCKED)` |

| Alternativa | Motivo del rechazo |
|---|---|
| Limitar el cambio al template | El `SKILL.md` seguiría calculando `$FINAL_STATUS` e imprimiendo `ACCEPTANCE RECHAZADO`, y el agente lo escribiría pese al template. |
| No tocar los ejemplos | Incumplen G-01, G-02 y G-04, y el gate de STORY-143 los valida (su CR-002). |

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Template del reporte de aceptación | modificar | `skills/story-acceptance/assets/acceptance-report-template.md` | AC-1 |
| Orquestador ACCEPTANCE (regla, aviso, transición, consola) | modificar | `skills/story-acceptance/SKILL.md` | AC-1, AC-2, CNF-1 |
| Reportes de ejemplo | modificar | `skills/story-acceptance/examples/{example-approved,example-rejected,example-partial}/acceptance-report.md` | AC-1 |
| DoD de ejemplo del skill | modificar | `skills/story-acceptance/examples/example-approved/definition-of-done-story.md` | AC-1 |
| README del skill | modificar | `skills/story-acceptance/README.md` | AC-1 |
| Evals del skill | modificar | `skills/story-acceptance/evals/evals.json` | AC-1, AC-2, CNF-1 |
| DoD ACCEPTANCE del repositorio | modificar | `docs/guardrails/dod-story-acceptance.md` | AC-1 |
| Fixtures DoD de `memory-system` | modificar | `skills/memory-system/examples/{dod-custom,dod-legacy,dod-monolithic}/…` | AC-1 |
| Máquina de estados | modificar | `docs/architecture/state-machine.md` | AC-1 |
| Dominio del ciclo de historia | modificar | `docs/domains/domain-story-lifecycle.md` | AC-1 |

No se tocan: la sesión interactiva del Paso 5 (salvo el mensaje de `[Q]`), el Paso 2, 7c, 7e, el flowchart, la policy,
`story-implement`, `sddf-constitution`, `test/` ni `docs/specs/**`.

## Interfaces

| Interfaz | Contrato | Productor → consumidor | Satisface |
|---|---|---|---|
| `verdict` en `acceptance-report.md` | Clave YAML de primer nivel. Valor `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED` \| `PENDING`. Presente en todo reporte escrito, también en el parcial | `story-acceptance` → CI, orquestadores, el propio skill (Paso 3) | AC-1, AC-2 |
| `session-status` | `partial` \| `complete`. Sin cambios; no es veredicto | `story-acceptance` → Paso 3 (Estados B y C) | CNF-1 |
| Línea de veredicto | Primera línea de `## Veredicto`: `` **Veredicto:** `<VALOR>` — <motivo de D-2> ``, seguida de `{verdict_details}` | `story-acceptance` → lectores humanos | AC-1 |
| Estado de `story.md` | `ACCEPTANCE/DONE` \| `READY-FOR-IMPLEMENT/DONE` \| `ACCEPTANCE/BLOCKED` \| `ACCEPTANCE/IN-PROGRESS` según D-7 | `story-acceptance` → humano/CI (DELIVER), `story-implement`, `story-acceptance` (reentrada) | AC-1 |
| Aviso de reporte existente | `… completo con veredicto <VALOR>.` o `… completo sin veredicto (reporte anterior al contrato de validación).` | Paso 3 → mantenedor | AC-2 |
| Confirmación de consola | `📄 Reporte generado: <ruta>/acceptance-report.md (verdict: <VALOR>)`, `<icono> Veredicto: <VALOR> — <motivo>` y `💾 Sesión guardada (verdict: PENDING). …` | `story-acceptance` → evals, mantenedor | AC-1 |

## Esquema de datos // satisface: AC-1, CNF-1

Cabecera de `acceptance-report.md` (forma abstracta):

```markdown
---
type: acceptance-report
story: <STORY-NNN>
title: "Acceptance Report: <STORY-NNN> — <título>"
date: <YYYY-MM-DD>
validator: <nombre>
dod-version: <YYYY-MM-DD | no disponible>
session-status: <partial | complete>
verdict: <APPROVED | NEEDS-CHANGES | BLOCKED | PENDING>
---

# Acceptance Report: <STORY-NNN> — <título>

## Veredicto

**Veredicto:** `<VALOR>` — <motivo de D-2>

- Criterio <N> — <REJECTED | BLOCKED>: <título>     ← solo NEEDS-CHANGES / BLOCKED
Ejecuta /story-acceptance <STORY-NNN> para reanudar.  ← solo PENDING

## Resumen ejecutivo
…
## Detalle por criterio
…
## Criterios DoD ACCEPTANCE
…
## Historial de sesiones anteriores
…
```

## Flujos clave

### F-1 — Aceptación aprobada // AC-1 fila 1

Todos los criterios `[P]` → fila 4 de D-1: `APPROVED` → 7d escribe `verdict: APPROVED` y `## Veredicto` primero, sin
`## Estado final` → `story.md` pasa a `ACCEPTANCE/DONE` → la consola muestra `(verdict: APPROVED)` y
`✅ Veredicto: APPROVED — historia … lista para DELIVER`.

### F-2 — Criterio rechazado, con o sin bloqueados // AC-1 filas 2 y 4

Un criterio `[F]` (y quizá otro `[B]`) → fila 2 de D-1: `NEEDS-CHANGES` → `{verdict_details}` lista los criterios
`REJECTED` y `BLOCKED` → `story.md` pasa a `READY-FOR-IMPLEMENT/DONE` → la consola muestra
`⚠️ Veredicto: NEEDS-CHANGES — …`. El regreso a implementar sigue siendo manual (Non-Goals).

### F-3 — Criterio bloqueado y reentrada // AC-1 fila 3, D-7

Un criterio `[B]` y ninguno `[F]` → fila 3: `BLOCKED` → `story.md` pasa a `ACCEPTANCE/BLOCKED` → la consola pide
resolver el impedimento. Resuelto, el mantenedor vuelve a ejecutar `/story-acceptance`: 1d acepta `ACCEPTANCE/BLOCKED`,
el Estado C muestra `… con veredicto BLOCKED.`, `(r)` reinicia la sesión (el historial se preserva) y el Paso 4 pasa la
historia a `ACCEPTANCE/IN-PROGRESS`.

### F-4 — Sesión interrumpida y completada // AC-1 fila 5, CNF-1

`[Q]` tras 1 de 2 criterios → fila 1: `PENDING` → reporte con `session-status: partial`, `verdict: PENDING` y motivo
`Sesión parcial: 1 de 2 criterios evaluados.` → `story.md` sigue en `ACCEPTANCE/IN-PROGRESS`. Al reanudar con `(c)`
(Estado B, detectado por `session-status`), 7a suma la fila anterior y D-1 recalcula el veredicto sobre los 2 criterios.

### F-5 — Reporte existente // AC-2

La historia vuelve a `VERIFY/DONE` tras un rework con un `acceptance-report.md` completo con `verdict: NEEDS-CHANGES` →
el Estado C muestra `Se encontró un acceptance-report.md completo con veredicto NEEDS-CHANGES.` sin leer `final-status`.

### F-6 — Degradación // P7

- **Reporte previo heredado completo (sin `verdict`):** aviso `sin veredicto (reporte anterior al contrato de
  validación)`; `(r)` y `(v)` funcionan igual (D-5).
- **Reporte previo heredado parcial:** se reanuda por `session-status: partial` (CNF-1); al completarse, el reporte nuevo
  declara `verdict` y no conserva `final-status`.
- **Historial heredado:** 7c solo arrastra `## Detalle por criterio`, que nunca contuvo `ACCEPTANCE-*`; el reporte nuevo
  queda libre de valores heredados sin traducir nada.
- **Valor de `verdict` no permitido en un reporte existente:** el aviso lo muestra tal cual; ninguna decisión depende de
  él, y cualquier consumidor externo aplica G-06.

### F-7 — Puntos de cambio // P6

- Si cambia la regla o la precedencia, solo cambia la tabla de D-1 en 7b.
- Si la policy decide renombrar los resultados por criterio, el cambio se limita a 5 (procesamiento de respuestas),
  7e y la plantilla de detalle, sin tocar el veredicto (D-3).
- Si otra historia construye el bucle `NEEDS-CHANGES` → implementar, leerá `verdict` (G-06) sin cambios en este skill.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Fila `PENDING` en la regla y `verdict` en el reporte parcial (D-1, D-4) | Sin ella, el reporte parcial no tendría `verdict` (G-01) o tendría un valor no permitido como el `IN-PROGRESS` de `example-partial` | AC-1 |
| Motivo y detalle deterministas (D-2) | Las evals solo ven la consola; un motivo libre no se puede afirmar | AC-1 |
| Reentrada desde `ACCEPTANCE/BLOCKED` (D-7) | Sin ella, `BLOCKED` es un callejón sin salida pese a que el propio skill pide reintentar | AC-1 |
| Dos casos de eval nuevos (D-9) | Ningún caso actual ejercita el aviso de reporte existente (AC-2) ni su degradación | AC-2 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Ningún literal heredado en el skill, salvo los `not_contains` de las evals | `grep -rn -E "ACCEPTANCE-(APPROVED\|REJECTED\|BLOCKED)\|final-status\|final_status\|FINAL_STATUS\|estado_final\|Estado final\|ACCEPTANCE (APROBADO\|RECHAZADO\|BLOQUEADO)" skills/story-acceptance --exclude=evals.json` vacío | AC-1, AC-2 |
| V-2 | Ningún literal `ACCEPTANCE-*` en documentación vigente ni en otros skills | `grep -rn -E "ACCEPTANCE-(APPROVED\|REJECTED\|BLOCKED)" docs skills --exclude-dir=specs --exclude=evals.json` vacío | AC-1 |
| V-3 | El template declara `verdict` y no `final-status` | `grep -n '^verdict: {verdict}$' skills/story-acceptance/assets/acceptance-report-template.md` → 1 línea; `grep -c final-status …` = 0 | AC-1 |
| V-4 | El primer `##` tras el `#` es `## Veredicto` y le sigue `## Resumen ejecutivo`, sin texto intermedio | `grep -n '^#' …/acceptance-report-template.md` y de cada ejemplo, y lectura de las líneas intermedias | AC-1 |
| V-5 | Solo el frontmatter y `## Veredicto` declaran el valor | `grep -c '{verdict}' …/acceptance-report-template.md` = 2 | AC-1 |
| V-6 | Los tres ejemplos declaran `APPROVED`, `NEEDS-CHANGES` y `PENDING`, coherentes con su línea `**Veredicto:**` | `grep -n -E '^verdict:\|^\*\*Veredicto:\*\*' skills/story-acceptance/examples/*/acceptance-report.md` | AC-1 |
| V-7 | 7b aplica D-1 en orden; `[Q]` escribe `PENDING` | Lectura de 7b y del Paso 5 | AC-1 |
| V-8 | El Estado C lee `verdict` y ningún paso lee `final-status` | Lectura del Paso 3 y V-1 | AC-2 |
| V-9 | La sesión, `session-status` y la reanudación no cambian | `git diff` del Paso 5 (solo el mensaje de `[Q]`) y de los Estados B y C (solo la línea del aviso) | CNF-1 |
| V-10 | 1d acepta `ACCEPTANCE/BLOCKED` | Lectura de 1d | AC-1 |
| V-11 | C-1…C-9 de D-10 se cumplen frente a la policy publicada | Lectura comparada; resultado anotado en `implement-report.md` | AC-1 |
| V-12 | El gate determinista pasa (incluido el validador de STORY-143 si ya existe) | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-13 | Las evals pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- story-acceptance` | AC-1, AC-2, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que lee `final-status` o busca `ACCEPTANCE APROBADO`]** → se rompe, como prevé la épica. La
  traducción está en §5 de la policy.
- **[Reportes heredados en proyectos de usuarios]** → no se reescriben; el aviso los identifica (D-5) y la reanudación
  sigue funcionando por `session-status`.
- **[`REJECTED` sigue apareciendo como resultado por criterio]** → es intencional (D-3); CS-9 solo retira
  `ACCEPTANCE-REJECTED`. Si STORY-143 o la policy publicada lo prohíben, D-10 aplica la versión publicada.
- **[La policy publicada difiere del diseño de STORY-138]** → D-10 aplica la versión publicada y registra la diferencia.
- **[Conflicto en `state-machine.md` y `domain-story-lifecycle.md` con STORY-141 y STORY-142]** → tocan líneas
  distintas (CODE-REVIEW y VERIFY). WIP = 1 serializa las historias.
- **[Copias de runtime desactualizadas (`.agents/`, `.claude/`)]** → se regeneran con `npx agile-sddf install --force`.

## Open Questions

Ninguna. La regla con `PENDING` (D-1), la estructura (D-2), los resultados por criterio (D-3), la lectura de reportes
heredados (D-5) y la reentrada desde `BLOCKED` (D-7) quedan resueltas. Las observaciones están en CR-001 y CR-002.

## Autoevaluación (P9, P10)

- **Omisiones:** las cinco filas de AC-1, AC-2 y CNF-1 tienen decisión, flujo y verificación. Las Notas de la historia
  están cubiertas: template y SKILL.md (D-2, D-4, D-11), ejemplos y evals (D-9, D-11), flowchart (D-7, sin cambios),
  Decisiones del PO (D-1), resultados por criterio (D-3) y textos de `memory-system` (D-8). También el DoD del
  repositorio, que la historia no nombra.
- **Ambigüedad:** la precedencia es el orden de D-1; el motivo y el detalle de D-2 son deterministas; la detección de
  reporte heredado es «sin `verdict`» (D-5).
- **Nombres:** «veredicto» designa el valor, `verdict` el campo, `$VERDICT` la variable y `## Veredicto` la sección.
  «Resultado» designa solo el de un criterio. `final-status`, `$FINAL_STATUS` y «Estado final» desaparecen.
- **Estructura:** sin dependencias cíclicas. El Paso 5 produce resultados por criterio, 7a cuenta, 7b decide, 7d
  escribe y el Paso 8 transiciona. El Paso 3 solo lee `verdict` para informar. Ninguna decisión depende de otro
  consumidor de `acceptance-report.md`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la precondición 1d no acepta `ACCEPTANCE/BLOCKED`, aunque el skill deja la historia en ese estado y
  pide «re-ejecuta /story-acceptance», y el flowchart dibuja `BLOCKED → story-acceptance`. Es una deriva previa. La
  historia no la menciona y CNF-1 solo fija la sesión, `session-status` y la reanudación de sesiones parciales. El diseño
  la corrige (D-7), porque sin ello el veredicto `BLOCKED` no tiene salida.
- **Documento afectado**: story.md (alcance)
- **Acción requerida**: opcional. Si el PO prefiere no ampliar el alcance, se elimina el cambio de 1d de D-7 y el mensaje
  de `BLOCKED` de D-6 deja de pedir la reejecución. El resto del diseño no cambia.

### CR-002
- **Tipo**: dependencia
- **Descripción**: el DoD ACCEPTANCE incluye «`acceptance-report.md` generado con `verdict: APPROVED`» y «`story.md`
  actualizado con `ACCEPTANCE/DONE`», que el validador evalúa dentro de la misma sesión que produce ese reporte y ese
  estado. El criterio es circular desde antes de esta historia; D-8 solo cambia el valor que nombra.
- **Documento afectado**: `docs/guardrails/dod-story-acceptance.md` (historia futura)
- **Acción requerida**: registrar una historia que decida si esos criterios se evalúan automáticamente tras 7b o se
  retiran del DoD.
