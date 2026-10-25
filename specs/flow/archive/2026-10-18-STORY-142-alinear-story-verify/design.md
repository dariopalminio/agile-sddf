---
alwaysApply: false
type: design
id: STORY-142
slug: STORY-142-alinear-story-verify-design
title: "Design: Alinear story-verify"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-142
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-142-alinear-story-verify
  - STORY-138-contrato-de-validacion
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-142-alinear-story-verify]] · [[STORY-138-contrato-de-validacion]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear story-verify

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `story-verify`, el gate de ejecución de pruebas
antes de ACCEPTANCE. Aplica el contrato tal como lo fija el diseño de STORY-138: reglas G-01…G-06, fila `story-verify`
de §4 (`APPROVED`, `NEEDS-CHANGES`, `BLOCKED`; valor sin rama: `BLOCKED`), equivalencias de §5 (`VERIFY-PASSED` →
`APPROVED`; `VERIFY-REJECTED`, `RECHAZADO` y `REJECTED` → `NEEDS-CHANGES`), la precedencia G-05 (si hay fallos y
bloqueos, gana `NEEDS-CHANGES`), la regla D-7 sobre reportes heredados y el ejemplo 7.5 (`type: verify-report`,
`# Test Report: …`, siguiente `##` = `## Summary`).

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/story-verify/assets/verify-report-template.md` (76 líneas) | Frontmatter sin campo de veredicto (l.1-12: `type`, `id`, `slug`, `title`, `story`, `date`, `mode`, `dod_version`, `created`, `updated`). Tras `# Test Report: {story_title}` (l.14) hay cuatro líneas en negrita (`**Date**`, `**Story**`, `**Mode**`, `**DoD Version**`, l.16-19) y luego `## Summary` (l.21). Placeholders en formato `{snake_case}`. Última sección: `## Historial de Ejecuciones Anteriores` (l.74) con `{history}`. |
| `skills/story-verify/SKILL.md` (541 líneas) | La decisión vive en el Paso 7 › 6e (l.462-472): `$VERIFY_RECHAZADO = true` si `$DOD_ERROR > 0` o hay defectos CRITICAL/HIGH sin resolver. No existe estado de bloqueo. 6f (l.474-483) añade al historial la entrada **de la ejecución actual** con `- **Resultado**: VERIFY-PASSED / VERIFY-REJECTED`. El Paso 8 › 7a (l.493-512) transiciona `story.md` y muestra `⚠️ VERIFY RECHAZADO: …`. 7b (l.514-534) imprime `📄 Reporte: …`, `READY-FOR-IMPLEMENT/DONE (REJECTED)` y `⚠️ VERIFY RECHAZADO: N defectos`. Salida (l.541): «(REJECTED)». Precondición 1d (l.150-175) y Restricciones (l.97): solo `CODE-REVIEW/DONE` o `IMPLEMENT/DONE`. Posicionamiento (l.24-34): sin rama de bloqueo. 6b (l.411): «estructura mínima integrada» sin definir. La numeración interna de sub-pasos (6a-6g dentro del Paso 7, 7a-7b dentro del Paso 8) está desfasada; este diseño cita los rótulos tal como están. |
| Modo manual y `--mode auto` | Si `.tmp/story-verify/{story_id}/` no puede crearse, el Paso 6 «aborta» sin reporte (l.369-373) y deja `story.md` en `VERIFY/IN-PROGRESS` (el Paso 2 ya la movió). `--mode auto` «falla si no hay tests configurados» (l.49) sin reporte. |
| `skills/story-verify/agents/qa-engineer.agent.md` | Ya ofrece el estado de escenario `BLOCKED` (l.49, l.67). Para `FAIL` **y** `BLOCKED` pide severidad y crea un finding (l.54-58). Regla de oro: «si no puedes verificar un comportamiento, márcalo como BLOCKED» (l.104). |
| `skills/story-verify/README.md` | l.8: `story-verify → [VERIFY/DONE \| VERIFY/REJECTED]`; l.17: precondición `READY-FOR-VERIFY/DONE` (no coincide con `SKILL.md`, que exige `CODE-REVIEW/DONE`); l.56: `substatus: DONE \| REJECTED`. |
| `skills/story-verify/evals/evals.json` | `version: 1.0.0`, 4 casos. TC-001 `not_contains: "VERIFY RECHAZADO"`; TC-004 `contains: "VERIFY RECHAZADO"`, `name: happy-path-automatico-e2e-pytest-verify-rechazado` (prueba pytest, es decir modo unit, no e2e), `description` con «(REJECTED)». Ningún caso cubre bloqueo ni precedencia. |
| `skills/story-verify/evals/eval-mode-detection.md`, `examples/*` | Solo detección de modo. Sin vocabulario de veredicto. No cambian. |
| Consumidores | `skills/story-implement/SKILL.md` l.296 y su eval EV-012 (TC de l.1654): `verify-report.md` **no** es señal de rework; solo `fix-directives.md` lo es (ADR-0008, deuda registrada en l.76). `story-acceptance` exige `VERIFY/DONE` y no lee `verify-report.md`. Ningún skill lee el resultado de `verify-report.md`. |
| DoD VERIFY | `docs/guardrails/dod-story-verify.md` (`enforcement: error`, 5 criterios). El criterio 3 (`test:eval`) lo ejecuta solo un humano, así que el skill lo evalúa `⚠️`. No cambia (Fuera de alcance). |
| Documentación vigente | `docs/architecture/state-machine.md` l.50-51 (`VERIFY --> ACCEPTANCE : DoD ✓`, `VERIFY --> RFI : DoD ✗`) y l.103 (tabla de skills); `docs/domains/domain-story-lifecycle.md` l.99-100 y l.117. Ninguno contempla un bloqueo en VERIFY. El substatus `BLOCKED` ya está definido para «cualquier estado activo» y «no retrocede el status» (`state-machine.md` l.29-31, `domain-story-lifecycle.md` l.148). |
| Flowchart | `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid` l.8-11: `H[story-verify] --> I{verdict}` con `NEEDS-CHANGES → B` (implementar), `BLOCKED → H` (el propio `story-verify`) y `APPROVED → J` (`story-acceptance`). No cambia (ver CR-003). |
| `scripts/run-evals.js` | Inserta `input` como JSON en el prompt y califica la consola con subcadenas sensibles a mayúsculas (l.654-656). No inspecciona archivos. |
| `docs/policies/validation-contract-policy.md` | Todavía no existe. Lo crea STORY-138 (ver D-11). |

## Goals / Non-Goals

**Goals:**

- `verify-report.md` declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras
  `# Test Report: …`, con el mismo valor. // satisface: AC-1
- La regla emite `APPROVED`, `NEEDS-CHANGES` o `BLOCKED` según las tres filas de AC-1, con la precedencia G-05.
  // satisface: AC-1
- Ni el reporte ni la consola contienen `RECHAZAR`, `RECHAZADO` ni `REJECTED`, tampoco en el historial heredado.
  // satisface: AC-2
- `verdict` está siempre presente en todo `verify-report.md` que el skill escribe, también cuando no se ejecutó
  ninguna prueba. // satisface: CNF-1

**Non-Goals:**

- Cambiar la detección de modo (Paso 5) o los comandos de `sddf.config.yaml` (Fuera de alcance de la historia).
- Cambiar los criterios del DoD VERIFY ni la evaluación `✓`/`❌`/`⚠️` de un criterio con evidencia de prueba
  (Fuera de alcance). Ver CR-001 y CR-002.
- Construir el bucle `NEEDS-CHANGES` → implementar: `story-implement` sigue sin leer `verify-report.md` (Notas de la
  historia, ADR-0008).
- Reescribir los `verify-report.md` históricos de `docs/specs/stories/` (D-7 de STORY-138).
- Corregir otras derivas del README (orden de templates, l.61-62; referencia rota, l.68) o renumerar los sub-pasos del
  `SKILL.md`. No afectan al veredicto.
- Añadir una entrada al CHANGELOG: la escribe `/doc-release-notes` al publicar.

## Decisions

### D-1 — Regla de veredicto con precedencia G-05 // satisface: AC-1, AC-2

`$VERIFY_RECHAZADO` desaparece. El Paso 7 › 6e se titula «6e. Evaluación de criterios DoD VERIFY y veredicto» y, tras
calcular `$DOD_OK` y `$DOD_ERROR`, deriva `$VERDICT` con esta tabla, evaluada **en orden** (primera fila que se cumple):

| # | Condición | `$VERDICT` | Fila de AC-1 |
|---|---|---|---|
| 1 | `$DOD_ERROR > 0` **o** `$N_CRITICAL_HIGH > 0` | `NEEDS-CHANGES` | defectos CRITICAL o HIGH, o algún criterio fallido |
| 2 | `$BLOCKED_EXECUTIONS` no vacía | `BLOCKED` | pruebas no ejecutables en el entorno |
| 3 | En otro caso | `APPROVED` | todos los criterios DoD VERIFY aprobados |

- `$N_CRITICAL_HIGH` = número de findings `CRITICAL` o `HIGH` de esta ejecución. Es el término que ya usa 6e
  («defectos CRITICAL o HIGH sin resolver»), ahora con nombre propio para reutilizarlo en el motivo (D-3).
- `$BLOCKED_EXECUTIONS` es la lista nueva de D-2.
- El orden de la tabla **es** G-05: con fallos y bloqueos a la vez, gana `NEEDS-CHANGES` (Decisión del PO).
- Un criterio `⚠️` no cambia el veredicto, como hoy (ver CR-001).

| Alternativa | Motivo del rechazo |
|---|---|
| `BLOCKED` gana a `NEEDS-CHANGES` | Contradice la Decisión del PO del 2026-10-17 y G-05. |
| Un criterio `⚠️` produce `BLOCKED` | El criterio 3 del DoD de este repo (`test:eval`, solo humano) es siempre `⚠️`: ninguna historia llegaría a `APPROVED`. Además, cambia la evaluación vigente (Fuera de alcance). |
| Conservar `$VERIFY_RECHAZADO` y traducir al escribir | Dos nombres para el mismo concepto (P4) y un literal `RECHAZADO` dentro del skill, que es justo lo que CS-8 retira. |

### D-2 — Qué es una ejecución bloqueada // satisface: AC-1, CNF-1

Una **ejecución bloqueada** es una prueba que no pudo ejecutarse en el entorno; no es un defecto del código. Se
registra en `$BLOCKED_EXECUTIONS` como par `{origen, motivo}`. Las condiciones son cerradas, una por modo:

| Modo / momento | Condición de bloqueo | `origen` | `motivo` (ejemplo) |
|---|---|---|---|
| `config-driven`, `automatico-unit`, `automatico-e2e` | El comando no puede iniciarse (ejecutable, intérprete o dependencia no disponible) **o** termina con código ≠ 0 sin reportar ningún resultado de prueba (ninguna prueba ejecutada) | tipo de prueba (`unit`, `e2e-sanity`…) o framework | `pytest no está disponible en el entorno` |
| `delegado` | El skill de testing invocado falla sin producir resultados | nombre del skill | `el skill <x> terminó sin resultados` |
| `manual` | Un escenario vuelve de `qa-engineer` con `status: BLOCKED` | `AC-N` | `observations` del escenario |
| `manual` | `.tmp/story-verify/{story_id}/` no puede crearse | `modo manual` | `no se pudo crear .tmp/story-verify/{story_id}/` |
| `--mode auto` | No hay pruebas configuradas ni detectadas | `--mode auto` | `sin pruebas configuradas` |

- Una ejecución que reporta resultados con fallos **no** es bloqueada: sus fallos suman en `$FAILED` como hoy.
- Los dos casos que hoy abortan sin reporte (directorio `.tmp/` y `--mode auto`) pasan a continuar hasta el Paso 7 con
  un bloqueo registrado. Así se cumple CNF-1: hay reporte con `verdict` aunque no se haya ejecutado ninguna prueba. El
  Paso 2 ya movió la historia a `VERIFY/IN-PROGRESS`, así que hoy esos casos la dejan en un estado huérfano.
- En config-driven se mantiene «registrar ese tipo como fallido pero continuar» (l.316) solo para tipos con resultados;
  un tipo sin resultados se registra como bloqueado y también se continúa con los restantes.

**Efecto en la evaluación DoD (6e):** un criterio cuya evidencia depende de una ejecución bloqueada se marca `⚠️` con
evidencia `Bloqueado: <origen> — <motivo>`. Se marca `❌` solo si existe evidencia de fallo (ej. un tipo falló y otro
quedó bloqueado → `❌`, y gana `NEEDS-CHANGES` por D-1). Sin esta regla, «Todas las pruebas `required: true` pasan»
sería `❌` ante cualquier bloqueo y `BLOCKED` nunca se emitiría.

| Alternativa | Motivo del rechazo |
|---|---|
| Decidir el bloqueo por código de salida (127, 9009…) | Depende del shell y del sistema operativo (Windows, Git Bash, POSIX). «Sin resultados de prueba» es observable en todos. |
| Mantener el aborto sin reporte en `.tmp/` y `--mode auto` | Deja la historia en `VERIFY/IN-PROGRESS` sin veredicto, contra CNF-1, y un CI no tendría qué leer. |
| Tratar «0 pruebas encontradas» con código 0 como bloqueo | Los runners que no encuentran pruebas terminan con código ≠ 0 (jest 1, pytest 5) y ya caen en la regla. Un código 0 sin pruebas lo trata el DoD (`⚠️`), como hoy. |

### D-3 — Sección `## Veredicto` al inicio con motivo determinista // satisface: AC-1, CNF-1

Estructura del template tras el cambio:

| Orden | Encabezado | Contenido |
|---|---|---|
| — | `# Test Report: {story_title}` | Sin cambios |
| 1 | `## Veredicto` | `` **Veredicto:** `{verdict}` — {verdict_reason} ``, y debajo `{verdict_details}` |
| 2 | `## Summary` | Tabla actual con cuatro filas nuevas al inicio: `Story`, `Date`, `Mode`, `DoD Version` |
| 3… | `## Test Scope`, `## Findings`, `## Coverage Analysis`, `## DoD VERIFY Criteria`, `## Recommendations`, `## Sign-off`, `## Severity Definitions`, `## Historial de Ejecuciones Anteriores` | Sin cambios de nombre ni de orden |

Las cuatro líneas en negrita de l.16-19 se mueven a filas de `## Summary`, porque G-02 solo admite líneas en blanco o
comentarios HTML entre el `#` y `## Veredicto`.

**`{verdict_reason}`** es determinista, para que las evals puedan afirmarlo:

| `$VERDICT` | Motivo |
|---|---|
| `APPROVED` | `Sin criterios DoD VERIFY fallidos ni defectos CRITICAL o HIGH abiertos ({dod_passed}/{dod_total} criterios ✓).` |
| `NEEDS-CHANGES` | `{dod_error} criterio(s) DoD VERIFY fallido(s) y {n_critical_high} defecto(s) CRITICAL o HIGH abierto(s).` |
| `BLOCKED` | `{n_blocked} ejecución(es) de prueba no ejecutable(s) en el entorno.` |

**`{verdict_details}`**: si `$BLOCKED_EXECUTIONS` no está vacía, una lista `- {origen}: {motivo}` (en `BLOCKED` y
también en `NEEDS-CHANGES` por precedencia, para no perder el bloqueo); si está vacía, cadena vacía. Son los «motivos
breves» que G-02 admite tras la línea. Es el único lugar del reporte donde constan las ejecuciones bloqueadas, porque no
son defectos y no van a `## Findings`.

**Estructura mínima integrada (6b):** si el template no existe, el skill escribe frontmatter con `type: verify-report`,
`story` y `verdict`; el título; `## Veredicto`; `## Summary`; `## Findings`; `## DoD VERIFY Criteria` y
`## Historial de Ejecuciones Anteriores`. Así `verdict` está presente también sin template (CNF-1).

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar las líneas en negrita entre el título y `## Veredicto` | Viola G-02 y SMOKE-1 (`## Veredicto` como primera sección tras el título). |
| Eliminar las líneas en negrita | `Date`, `Story` y `Mode` siguen siendo útiles para un lector humano. En `## Summary` no estorban. |
| Motivo libre redactado por el agente | No se puede afirmar en evals, y dos ejecuciones iguales darían textos distintos. |

### D-4 — Frontmatter con `verdict` // satisface: AC-1, CNF-1

En `verify-report-template.md` se añade `verdict: {verdict}` tras `story: {story_id}` (l.6). Los demás campos no
cambian: no declaran el veredicto (G-04). La tabla de placeholders de 6c añade cuatro filas: `{verdict}` (`$VERDICT`),
`{verdict_reason}` (D-3), `{verdict_details}` (D-3) y las filas `Story`/`Date`/`Mode`/`DoD Version` reutilizan
`{story_id}`, `{date}`, `{mode}` y `{dod_version}`.

| Alternativa | Motivo del rechazo |
|---|---|
| Campo `verify-verdict` o `result` | G-01 exige el nombre `verdict`. CI lo lee igual en los seis reportes (Para de la historia). |
| Campo `blocked: true` aparte | Un segundo campo que declara parte del veredicto (G-04). El detalle va en `{verdict_details}`. |

### D-5 — Historial sin la ejecución actual y con valores traducidos // satisface: AC-2, AC-1

Hoy 6f añade al historial la entrada de la ejecución en curso con `- **Resultado**: VERIFY-PASSED / VERIFY-REJECTED`.
Eso repite el veredicto en otra línea (G-04 nombra expresamente la «línea Resultado») y escribe `REJECTED` (el `Pero`
de AC-2). El historial pasa a contener **solo ejecuciones anteriores**, como dice su título:

1. **6a** lee el `verify-report.md` previo, si existe, y toma su `## Historial de Ejecuciones Anteriores` como
   `$HISTORY_CONTENT`.
2. **Traducción (D-7 de STORY-138):** cada línea `- **Resultado**: <valor>` de `$HISTORY_CONTENT` se reescribe como
   `` - **Veredicto emitido**: `<canónico>` `` con §5: `VERIFY-PASSED` → `APPROVED`; `VERIFY-REJECTED`, `RECHAZADO` y
   `REJECTED` → `NEEDS-CHANGES`. Un valor que no esté en §5 se escribe `` `desconocido` `` (G-06: no aprobado).
3. **Entrada de la ejecución previa:** si el reporte previo **tiene** `verdict` en su frontmatter (ya alineado), se
   añade una entrada construida desde él. Si **no** lo tiene (heredado), no se añade, porque el 6f antiguo ya incluyó su
   propia ejecución en el historial.
4. **6f** deja de añadir la ejecución actual. El veredicto actual vive solo en `verdict` y `## Veredicto`.

Formato de la entrada de la ejecución previa (todos los datos salen del reporte previo):

| Línea | Fuente en el reporte previo |
|---|---|
| `### Ejecución {N} — {date}` | `N` = número de `### Ejecución` en `$HISTORY_CONTENT` + 1; `date` del frontmatter |
| `- **Modo**: {mode}` | `mode` del frontmatter |
| `` - **Veredicto emitido**: `{verdict}` `` | `verdict` del frontmatter |
| `- **Tests**: {passed}/{total} pasados, {failed} fallados` | Filas `Passed`, `Total Tests`, `Failed` de `## Summary` |
| `- **Findings**: {N} defectos ({CRITICAL} CRITICAL, {HIGH} HIGH)` | Encabezados `### [CRITICAL]`, `### [HIGH]` y total de `### [` en `## Findings` |

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener la entrada actual con `Veredicto` en lugar de `Resultado` | El reporte declararía su veredicto dos veces (G-04). |
| Eliminar el resultado del historial | Se pierde la trazabilidad entre ejecuciones, que es la razón de ser de la sección (idempotencia, AC-7 de STORY-071). |
| Copiar el historial heredado sin traducir | El reporte nuevo contendría `VERIFY-REJECTED` y fallaría el `Pero` de AC-2 y SMOKE-2. |

### D-6 — Un escenario `BLOCKED` no es un defecto // satisface: AC-1

En `qa-engineer.agent.md`, el paso 4 del Modo Manual (l.54-58) se divide:

| Resultado | Qué pide el agente | Qué escribe en `qa-output.json` |
|---|---|---|
| `FAIL` | Descripción, pasos, esperado vs. actual, severidad (sin cambios) | `scenario_results[]` con `status: FAIL` y un elemento en `findings[]` |
| `BLOCKED` | Solo el motivo del bloqueo (obligatorio) | `scenario_results[]` con `status: BLOCKED` y el motivo en `observations`; **sin** finding |

El `SKILL.md` (Paso 6, modo manual, punto 4) mapea cada `status: BLOCKED` a `$BLOCKED_EXECUTIONS` (D-2). La regla de oro
(l.104) no cambia.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener el finding para `BLOCKED` e ignorarlo en el `SKILL.md` | El reporte mostraría un finding HIGH que no cuenta, y el criterio DoD «Sin defectos CRITICAL o HIGH abiertos» lo vería y daría `❌`: un bloqueo se convertiría en `NEEDS-CHANGES`. |
| No tocar el agente | Igual que la anterior: cada escenario bloqueado con severidad alta colapsaría `BLOCKED` en `NEEDS-CHANGES`. |

### D-7 — Transición de `story.md` por veredicto // satisface: AC-1

| `$VERDICT` | `story.md` | Cambio respecto de hoy |
|---|---|---|
| `APPROVED` | `VERIFY/DONE` | Ninguno |
| `NEEDS-CHANGES` | `READY-FOR-IMPLEMENT/DONE` | Ninguno en la transición; la etiqueta de consola `(REJECTED)` pasa a `(NEEDS-CHANGES)` (Notas de la historia) |
| `BLOCKED` | `VERIFY/BLOCKED` | Nuevo |

- `VERIFY/BLOCKED` usa el substatus `BLOCKED` ya definido para cualquier estado activo, que «no retrocede el status».
  Es el mismo patrón que `ACCEPTANCE/BLOCKED` en `story-acceptance`.
- La precondición 1d (y Restricciones, l.97) acepta además `VERIFY/BLOCKED` como **reentrada** tras resolver el
  bloqueo. Es la rama `BLOCKED → story-verify` del flowchart (l.10). El mensaje de error de 1d añade la línea
  `· VERIFY/BLOCKED → reintento tras resolver el bloqueo`.
- `VERIFY/BLOCKED` no es `IN-PROGRESS`, así que no ocupa WIP.

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar `VERIFY/IN-PROGRESS` | Un estado activo sin trabajo en curso: bloquea WIP = 1 y no comunica el impedimento. |
| Volver a `CODE-REVIEW/DONE` para permitir el reintento sin tocar 1d | Retrocede el status, contra la definición de `BLOCKED`, y oculta que VERIFY se intentó. |
| `READY-FOR-IMPLEMENT/DONE` | Trata el bloqueo como defecto del código: es la confusión que la épica corrige («lo que no se pudo evaluar es `BLOCKED`»). |

### D-8 — Salida de consola con el veredicto // satisface: AC-1, AC-2

El runner de evals solo ve la consola. Se reutiliza la forma `(verdict: <VALOR>)` de STORY-140 D-5 y STORY-141 D-6 (P3):

| Lugar en `SKILL.md` | Hoy | Tras el cambio |
|---|---|---|
| Paso 8 › 7a, `NEEDS-CHANGES` (l.509-512) | `⚠️ VERIFY RECHAZADO: se encontraron {N} defectos. Revisa verify-report.md para detalles.` | `⚠️ Veredicto: NEEDS-CHANGES — {verdict_reason} Revisa verify-report.md para detalles.` |
| Paso 8 › 7a, `BLOCKED` (nuevo) | — | `⛔ Veredicto: BLOCKED — {verdict_reason} Resuelve el bloqueo y vuelve a ejecutar /story-verify.` |
| 7b, bloque de resumen | — | Línea nueva tras `DoD VERIFY`: ` Veredicto: {verdict}` |
| 7b, l.528 | `📄 Reporte: {$STORY_DIR}/verify-report.md` | `📄 Reporte: {$STORY_DIR}/verify-report.md (verdict: {verdict})` |
| 7b, l.529-530 | `VERIFY/DONE ✓` · `READY-FOR-IMPLEMENT/DONE (REJECTED) ⚠️` | `VERIFY/DONE ✓` · `READY-FOR-IMPLEMENT/DONE (NEEDS-CHANGES) ⚠️` · `VERIFY/BLOCKED ⛔` |
| 7b, l.532-533 | `✅ Verificación completa` · `⚠️ VERIFY RECHAZADO: N defectos` | `✅ Verificación completa` · `⚠️ Verificación con cambios requeridos` · `⛔ Verificación bloqueada` |

Los fail-fast previos al Paso 2 (historia no encontrada, `story.md` ausente, precondición inválida) no escriben reporte
ni imprimen `(verdict: `: no hay verificación que juzgar. `--dry-run` tampoco escribe reporte (sin cambios).

| Alternativa | Motivo del rechazo |
|---|---|
| No tocar la consola | Las evals no podrían distinguir un reporte alineado de uno heredado, y el `Pero` de AC-2 incluye «la salida en consola». |
| Imprimir el frontmatter completo | Ruido, y duplica `## Veredicto`. |

### D-9 — Evals // satisface: AC-1, AC-2, CNF-1

**`skills/story-verify/evals/evals.json`** (`version` → `1.1.0`; la `description` del skill añade «veredicto
APPROVED / NEEDS-CHANGES / BLOCKED»):

| Caso | Veredicto | `contains` | `not_contains` |
|---|---|---|---|
| TC-001 | `APPROVED` | se añaden `"(verdict: APPROVED)"`, `"Veredicto: APPROVED"` | `"VERIFY RECHAZADO"` → `"(verdict: NEEDS-CHANGES)"`, `"(verdict: BLOCKED)"` |
| TC-002 (fail-fast) | ninguno | sin cambios | se añade `"(verdict: "` |
| TC-003 (manual) | el que resulte | se añade `"(verdict: "` (CNF-1) | sin cambios |
| TC-004 | `NEEDS-CHANGES` | `"VERIFY RECHAZADO"` → `"(verdict: NEEDS-CHANGES)"`, `"Veredicto: NEEDS-CHANGES"`, `"defecto(s) CRITICAL o HIGH"` | se añaden `"RECHAZADO"`, `"REJECTED"`, `"RECHAZAR"`, `"(verdict: APPROVED)"` |
| TC-005 (nuevo) | `BLOCKED` | `"automatico-unit"`, `"pytest"`, `"(verdict: BLOCKED)"`, `"Veredicto: BLOCKED"`, `"no ejecutable(s) en el entorno"`, `"VERIFY/BLOCKED"` | `"(verdict: NEEDS-CHANGES)"`, `"(verdict: APPROVED)"`, `"READY-FOR-IMPLEMENT"`, `"VERIFY/DONE"` |
| TC-006 (nuevo) | `NEEDS-CHANGES` por G-05 | `"manual"`, `"(verdict: NEEDS-CHANGES)"`, `"Veredicto: NEEDS-CHANGES"` | `"(verdict: BLOCKED)"`, `"RECHAZADO"`, `"REJECTED"` |

- **TC-004:** `name` → `verify-needs-changes-automatico-unit-pytest`; la `description` cambia «READY-FOR-IMPLEMENT/DONE
  (REJECTED)» por «READY-FOR-IMPLEMENT/DONE con veredicto NEEDS-CHANGES». Sus `not_contains` prueban el `Pero` de AC-2
  en la consola. La ausencia en el reporte se verifica en la fuente (V-1, V-6).
- **TC-005** (`type: edge-case`, `name: verify-blocked-runner-no-disponible`): `input_path: examples/pytest-project`,
  `story_id: STORY-054`, `"simulate_runner_unavailable": true` (pytest no instalado). Cubre AC-1 fila 3 y CNF-1.
- **TC-006** (`type: edge-case`, `name: verify-precedencia-fallo-y-bloqueo`): `input_path: examples/no-tests-project`,
  `story_id: STORY-055`, `"simulate_qa_results"` con un escenario `FAIL` de severidad `HIGH` y otro `BLOCKED`. Cubre G-05
  y el camino de D-6.
- Los campos `simulate_*` siguen la convención de TC-004 (`simulate_test_failure`): el runner los pasa en el JSON del
  prompt.

Los literales `RECHAZADO`, `REJECTED` y `RECHAZAR` en `not_contains` son la prueba de AC-2, no vocabulario emitido.
CS-10 y SMOKE-3 no buscan esos literales, y V-1 excluye `evals.json`.

| Alternativa | Motivo del rechazo |
|---|---|
| Afirmar solo `"NEEDS-CHANGES"` | Aparece también en `READY-FOR-IMPLEMENT/DONE (NEEDS-CHANGES)`. `(verdict: X)` es único y lo produce solo 7b. |
| No añadir casos para `BLOCKED` y precedencia | Ningún caso actual los cubre: AC-1 fila 3 y la Decisión del PO quedarían sin prueba. |
| Probar la precedencia en config-driven con dos tipos | Exige un fixture `sddf.config.yaml` nuevo. El modo manual reutiliza `no-tests-project` y prueba además D-6. |

### D-10 — Inventario de cambios en textos // satisface: AC-1, AC-2, CNF-1

| Archivo | Líneas | Cambio |
|---|---|---|
| `skills/story-verify/SKILL.md` | l.20 | «genera `verify-report.md`» → «genera `verify-report.md` con un veredicto (`APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`)» |
| | l.24-34 | Posicionamiento: `Si criterios DoD fallan: → READY-FOR-IMPLEMENT/DONE` pasa a tres líneas por veredicto (D-7), y se añade `VERIFY/BLOCKED` como entrada válida |
| | l.97, l.150-175 | Precondición con `VERIFY/BLOCKED` (D-7) |
| | l.297-394 | Registro de `$BLOCKED_EXECUTIONS` por modo; continuación en lugar de aborto en l.369-373 y en `--mode auto` (D-2); mapeo de escenarios `BLOCKED` (D-6) |
| | l.398-404 | 6a con lectura y traducción del historial (D-5) |
| | l.411 | Estructura mínima integrada (D-3) |
| | l.415-443 | Placeholders nuevos (D-4) |
| | l.462-472 | Regla de veredicto (D-1) y regla `⚠️` por bloqueo (D-2) |
| | l.474-483 | 6f deja de añadir la ejecución actual (D-5) |
| | l.493-534 | Transiciones (D-7) y consola (D-8) |
| | l.536-541 | Salida: tres transiciones por veredicto, sin «(REJECTED)» |
| `skills/story-verify/assets/verify-report-template.md` | l.6, l.14-21 | D-3 y D-4 |
| `skills/story-verify/agents/qa-engineer.agent.md` | l.54-58, l.59 | D-6 |
| `skills/story-verify/README.md` | l.8 | `[VERIFY/DONE \| VERIFY/REJECTED]` → `[APPROVED → VERIFY/DONE \| NEEDS-CHANGES → READY-FOR-IMPLEMENT/DONE \| BLOCKED → VERIFY/BLOCKED]` |
| | l.15-18 | Precondiciones: `READY-FOR-VERIFY/DONE` → `CODE-REVIEW/DONE` y fila nueva `VERIFY/BLOCKED` (reintento) |
| | l.56 | `substatus: DONE \| REJECTED` → «`verdict` y estado según el veredicto (ver Posición en el pipeline)» |
| | tras «Output generado» | Sección breve `## Veredicto` con la tabla de D-1 y la remisión a la policy |
| `skills/story-verify/evals/evals.json` | todo | D-9 |
| `docs/architecture/state-machine.md` | l.50-51, l.103 | `DoD ✓` → `APPROVED`; `DoD ✗` → `NEEDS-CHANGES`; transición nueva `VERIFY --> VERIFY : BLOCKED`; en la tabla, «Retroceso» de `story-verify` = `READY-FOR-IMPLEMENT/DONE (NEEDS-CHANGES)` o `VERIFY/BLOCKED (BLOCKED)` y precondición con `VERIFY/BLOCKED` |
| `docs/domains/domain-story-lifecycle.md` | l.99-100, l.117, tras l.119 | Mismas etiquetas; «Rework por verificación» = `VERIFY → READY-FOR-IMPLEMENT (NEEDS-CHANGES)`; fila nueva «Bloqueo en verificación» = `VERIFY → VERIFY (BLOCKED)` |

| Alternativa | Motivo del rechazo |
|---|---|
| Limitar el cambio al template | El `SKILL.md` seguiría calculando `$VERIFY_RECHAZADO` e imprimiendo `VERIFY RECHAZADO`, y el agente lo escribiría pese al template. |
| No documentar `VERIFY/BLOCKED` en la máquina de estados | La documentación vigente describiría un ciclo que el skill ya no sigue (veracidad, AGENTS.md). |

### D-11 — Conformidad con la policy y secuencia // satisface: AC-1

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | D-4 |
| C-2 | G-02: `## Veredicto` es el primer `##` tras el `#`, con `` **Veredicto:** `<VALOR>` — <motivo> `` | D-3 |
| C-3 | G-03 y §4: solo `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | D-1 |
| C-4 | G-04: ningún otro campo o línea declara el veredicto | D-4 (sin campo extra) y D-5 (historial sin la ejecución actual) |
| C-5 | G-05: con fallo y bloqueo, `NEEDS-CHANGES` | D-1 (orden de la tabla), TC-006 |
| C-6 | G-06: `BLOCKED` no habilita el avance | D-7 (`VERIFY/BLOCKED`, no `VERIFY/DONE`) |
| C-7 | D-7 de STORY-138: reportes heredados se traducen al leerlos | D-5 (traducción del historial con §5) |
| C-8 | §7.5: `type: verify-report`, `# Test Report: …`, siguiente `##` = `## Summary` | D-3 |
| C-9 | §6: divergencias registradas | Ninguna: no se conserva vocabulario heredado (V-1) |

La implementación empieza cuando `docs/policies/validation-contract-policy.md` existe (lo comprueba la primera tarea),
como en STORY-140 D-12 y STORY-141 D-11. STORY-142 depende de STORY-138. C-1…C-9 se comparan con el texto publicado. Si
difiere del diseño de STORY-138, se aplica la versión publicada y la diferencia se anota en `implement-report.md`.

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Template del reporte de verificación | modificar | `skills/story-verify/assets/verify-report-template.md` | AC-1, CNF-1 |
| Orquestador VERIFY (regla, bloqueos, historial, transición, consola) | modificar | `skills/story-verify/SKILL.md` | AC-1, AC-2, CNF-1 |
| Agente QA (escenario `BLOCKED`) | modificar | `skills/story-verify/agents/qa-engineer.agent.md` | AC-1 |
| README del skill | modificar | `skills/story-verify/README.md` | AC-1, AC-2 |
| Evals del skill | modificar | `skills/story-verify/evals/evals.json` | AC-1, AC-2, CNF-1 |
| Máquina de estados | modificar | `docs/architecture/state-machine.md` | AC-1 |
| Dominio del ciclo de historia | modificar | `docs/domains/domain-story-lifecycle.md` | AC-1 |

No se tocan: `eval-mode-detection.md`, `examples/**`, el Paso 5 (detección de modo), `sddf.config.yaml`,
`docs/guardrails/dod-story-verify.md`, el flowchart, la policy, `story-implement`, `story-acceptance` ni `docs/specs/**`.

## Interfaces

| Interfaz | Contrato | Productor → consumidor | Satisface |
|---|---|---|---|
| `verdict` en `verify-report.md` | Clave YAML de primer nivel. Valor `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`. Presente en todo reporte escrito | `story-verify` → CI, orquestadores, `epic-validate` | AC-1, CNF-1 |
| Línea de veredicto | Primera línea de `## Veredicto`: `` **Veredicto:** `<VALOR>` — <motivo de D-3> ``, seguida de `{verdict_details}` | `story-verify` → lectores humanos | AC-1 |
| Estado de `story.md` | `VERIFY/DONE` \| `READY-FOR-IMPLEMENT/DONE` \| `VERIFY/BLOCKED` según D-7 | `story-verify` → `story-acceptance` (exige `VERIFY/DONE`), `story-implement`, `story-verify` (reentrada) | AC-1 |
| `qa-output.json` › `scenario_results[].status` | `PASS \| FAIL \| SKIP \| BLOCKED`. `BLOCKED` lleva el motivo en `observations` y no genera finding | `qa-engineer` → `SKILL.md` Paso 6 | AC-1 |
| `$BLOCKED_EXECUTIONS` (interna) | Lista de `{origen, motivo}` según D-2 | Paso 6 → 6e, 6c | AC-1, CNF-1 |
| Historial | Solo ejecuciones anteriores; cada entrada con `` - **Veredicto emitido**: `<canónico>` `` | reporte previo → reporte actual | AC-2 |
| Confirmación de consola | `📄 Reporte: <ruta>/verify-report.md (verdict: <VALOR>)` y `<icono> Veredicto: <VALOR> — <motivo>` | `story-verify` → evals, orquestador | AC-1, AC-2 |

## Esquema de datos // satisface: AC-1, CNF-1

Cabecera de `verify-report.md` (forma abstracta):

```markdown
---
type: verify-report
id: <STORY-NNN>
slug: <STORY-NNN>-verify-report
title: "Verify Report: <título>"
story: <STORY-NNN>
verdict: <APPROVED | NEEDS-CHANGES | BLOCKED>
date: <YYYY-MM-DD>
mode: <config-driven | delegado | automatico-e2e | automatico-unit | manual>
dod_version: <YYYY-MM-DD>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Test Report: <título>

## Veredicto

**Veredicto:** `<VALOR>` — <motivo de D-3>

- <origen>: <motivo>        ← solo si hay ejecuciones bloqueadas

## Summary

| Metric | Value |
|--------|-------|
| Story | <STORY-NNN> |
| Date | <YYYY-MM-DD> |
| Mode | <modo> |
| DoD Version | <YYYY-MM-DD> |
| Total Tests | … |
…
```

## Flujos clave

### F-1 — Verificación aprobada // AC-1 fila 1

Las pruebas se ejecutan con resultados, no hay findings `CRITICAL`/`HIGH`, ningún criterio DoD es `❌` y
`$BLOCKED_EXECUTIONS` está vacía → fila 3 de D-1: `APPROVED` → 6a arrastra y traduce el historial previo → 6g escribe el
reporte con `verdict: APPROVED` y `## Veredicto` primero → `story.md` pasa a `VERIFY/DONE` → la consola muestra
`(verdict: APPROVED)` → `story-acceptance` puede empezar.

### F-2 — Verificación con defectos o criterios fallidos // AC-1 fila 2, AC-2

Un test falla (o el agente QA reporta un defecto `HIGH`) → un criterio DoD queda `❌` o `$N_CRITICAL_HIGH > 0` → fila 1
de D-1: `NEEDS-CHANGES` → reporte con `verdict: NEEDS-CHANGES` y motivo con los dos conteos → `story.md` pasa a
`READY-FOR-IMPLEMENT/DONE` → la consola muestra `⚠️ Veredicto: NEEDS-CHANGES — …` y
`READY-FOR-IMPLEMENT/DONE (NEEDS-CHANGES)`. Ni el reporte ni la consola contienen `RECHAZ…` ni `REJECTED`. El regreso
a implementar sigue siendo manual (Non-Goals).

### F-3 — Verificación bloqueada y reintento // AC-1 fila 3, CNF-1

`pytest` no está instalado → el comando no inicia → `$BLOCKED_EXECUTIONS = [{pytest, «pytest no está disponible en el
entorno»}]` → el criterio «Todas las pruebas pasan» queda `⚠️ Bloqueado: …` (D-2) → fila 2 de D-1: `BLOCKED` → reporte
con `verdict: BLOCKED`, motivo y lista de bloqueos, aunque `Total Tests = 0` (CNF-1) → `story.md` pasa a
`VERIFY/BLOCKED` → la consola muestra `⛔ Veredicto: BLOCKED — …`. Tras instalar `pytest`, el mantenedor vuelve a
ejecutar `/story-verify`: 1d acepta `VERIFY/BLOCKED`, el Paso 2 la pasa a `VERIFY/IN-PROGRESS` y el historial registra
la ejecución bloqueada como `Ejecución 1` con `` `BLOCKED` ``.

### F-4 — Fallo y bloqueo a la vez // G-05

En modo manual, AC-1 vuelve `FAIL` con un defecto `HIGH` y AC-2 vuelve `BLOCKED` → `$N_CRITICAL_HIGH = 1` y
`$BLOCKED_EXECUTIONS` con un elemento → la fila 1 de D-1 gana: `NEEDS-CHANGES` → `{verdict_details}` conserva el bloqueo
de AC-2 en `## Veredicto`.

### F-5 — Degradación // P7

- **Reporte previo heredado (sin `verdict`):** su historial se arrastra traducido con §5 y no se añade entrada extra
  (D-5). Un valor desconocido queda como `desconocido`, nunca como aprobado (G-06).
- **Reporte previo ilegible o sin `## Summary`:** la entrada de la ejecución previa se escribe con `N/A` en los datos que
  falten. El veredicto actual no depende del historial.
- **Template ausente:** la estructura mínima integrada conserva `verdict` y `## Veredicto` (D-3, CNF-1).
- **Agente QA que devuelve `BLOCKED` sin motivo:** el motivo se registra como `sin motivo informado`; el bloqueo cuenta
  igual.
- **`.tmp/` no creable o `--mode auto` sin pruebas:** `BLOCKED` con reporte, en lugar del aborto actual (D-2).

### F-6 — Puntos de cambio // P6

- Si cambia la regla de decisión o la precedencia, solo cambia la tabla de D-1 en 6e.
- Si aparece un modo de ejecución nuevo, se añade su fila de bloqueo a D-2 sin tocar la regla.
- Si otra historia construye el bucle `NEEDS-CHANGES` → implementar, leerá `verdict` (G-06) sin cambios en este skill.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Lista `$BLOCKED_EXECUTIONS` con condiciones por modo (D-2) | Sin una definición cerrada, «pruebas no ejecutables» lo interpretaría el agente en cada ejecución, y una prueba fallida podría acabar como `BLOCKED` o al revés | AC-1, CNF-1 |
| Regla `⚠️` por bloqueo en la evaluación DoD (D-2) | Sin ella, el criterio de pruebas sería `❌` ante cualquier bloqueo y la fila 3 de AC-1 sería inalcanzable | AC-1 |
| Historial reconstruido desde el reporte previo (D-5) | La entrada de la ejecución actual repetía el veredicto (G-04). Eliminar el resultado perdería la trazabilidad. La traducción con §5 es obligatoria para el `Pero` de AC-2 | AC-2 |
| Estado `VERIFY/BLOCKED` y reentrada (D-7) | Sin un estado propio, `BLOCKED` dejaría la historia en `IN-PROGRESS` (bloquea WIP) o la haría retroceder | AC-1 |
| Dos casos de eval nuevos (D-9) | Ningún caso actual cubre `BLOCKED` ni la precedencia de la Decisión del PO | AC-1, CNF-1 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Ningún literal heredado en el skill, salvo los `not_contains` de las evals | `grep -rn -E "RECHAZ\|REJECTED\|VERIFY-PASSED\|VERIFY_RECHAZADO" skills/story-verify --exclude=evals.json` vacío | AC-2 |
| V-2 | La documentación de estados de VERIFY no usa vocabulario heredado | `grep -n -i "verify" docs/architecture/state-machine.md docs/domains/domain-story-lifecycle.md \| grep -E "REJECTED\|RECHAZ\|DoD [✓✗]"` vacío | AC-2 |
| V-3 | El template declara `verdict` | `grep -n '^verdict: {verdict}$' skills/story-verify/assets/verify-report-template.md` → 1 línea | AC-1, CNF-1 |
| V-4 | El primer `##` tras el `#` es `## Veredicto` y le sigue `## Summary`, sin texto entre el `#` y `## Veredicto` | `grep -n '^#' …/verify-report-template.md` (orden `#`, `## Veredicto`, `## Summary`) y lectura de las líneas intermedias | AC-1 |
| V-5 | Solo el frontmatter y `## Veredicto` declaran el valor | `grep -c '{verdict}' …/verify-report-template.md` = 2 | AC-1 |
| V-6 | 6f no añade la ejecución actual y 6a traduce `Resultado` con §5 | Lectura de 6a y 6f | AC-2 |
| V-7 | 6e aplica D-1 en orden y la regla `⚠️` por bloqueo | Lectura de 6e | AC-1 |
| V-8 | Las cinco condiciones de bloqueo de D-2 figuran en el Paso 6 y ningún camino tras el Paso 2 termina sin reporte | Lectura del Paso 6 (incluidos l.369-373 y `--mode auto`) | AC-1, CNF-1 |
| V-9 | La estructura mínima integrada incluye `verdict` y `## Veredicto` | Lectura de 6b | CNF-1 |
| V-10 | 1d acepta `VERIFY/BLOCKED` y 7a escribe `VERIFY/BLOCKED` con `BLOCKED` | Lectura de 1d y 7a | AC-1 |
| V-11 | `qa-engineer` no pide severidad ni crea finding para `BLOCKED` | Lectura del Modo Manual | AC-1 |
| V-12 | C-1…C-9 de D-11 se cumplen frente a la policy publicada | Lectura comparada; resultado anotado en `implement-report.md` | AC-1 |
| V-13 | El gate determinista pasa | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-14 | Las evals pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- story-verify` | AC-1, AC-2, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que busca `VERIFY RECHAZADO` o `(REJECTED)`]** → se rompe, como prevé la épica. La traducción
  está en §5 de la policy.
- **[Un runner con fallos que no imprime resultados se clasifica como bloqueado]** → la regla de D-2 exige «sin ningún
  resultado de prueba». Un runner que falla antes de ejecutar pruebas es, en efecto, un bloqueo del entorno. El motivo
  queda en `{verdict_details}` para que el mantenedor lo revise.
- **[`APPROVED` con criterios `⚠️`]** → es el comportamiento vigente y la historia no cambia la evaluación DoD
  (CR-001). El motivo de `APPROVED` muestra `{dod_passed}/{dod_total}`, así que la diferencia es visible.
- **[`enforcement: warn` ignorado en 6e]** → comportamiento vigente, registrado en CR-002.
- **[La policy publicada difiere del diseño de STORY-138]** → D-11 aplica la versión publicada y registra la diferencia.
- **[Conflicto en `state-machine.md` y `domain-story-lifecycle.md` con STORY-141 y STORY-145]** → tocan líneas
  distintas (CODE-REVIEW y ACCEPTANCE). WIP = 1 serializa las historias.
- **[Copias de runtime desactualizadas]** → `.claude/skills/` se regenera con `npx agile-sddf install --force`.

## Open Questions

Ninguna. La definición de bloqueo (D-2), el estado de la historia ante `BLOCKED` (D-7), el historial (D-5) y la
precedencia (D-1) quedan resueltos. Las observaciones sobre AC-1, el `enforcement` y el flowchart están en CR-001…CR-003.

## Autoevaluación (P9, P10)

- **Omisiones:** las tres filas de AC-1, AC-2 y CNF-1 tienen decisión, flujo y verificación. Las notas de la historia
  están cubiertas: `$VERIFY_RECHAZADO` (D-1), la etiqueta `(REJECTED)` (D-7, D-8), la rama `BLOCKED` del flowchart
  (D-7), la Decisión del PO (D-1, D-2) y los consumidores (Context, Non-Goals).
- **Ambigüedad:** «pruebas no ejecutables» queda definido en D-2; la precedencia, en el orden de D-1; el motivo de D-3 es
  determinista; el historial tiene una regla para reportes alineados y otra para heredados (D-5).
- **Nombres:** «veredicto» designa el valor, `verdict` el campo, `$VERDICT` la variable y `## Veredicto` la sección.
  «Ejecución bloqueada» designa siempre un elemento de `$BLOCKED_EXECUTIONS`; «defecto», un finding. «Resultado» y
  «RECHAZADO» desaparecen.
- **Estructura:** sin dependencias cíclicas. El agente QA produce resultados de escenario, el Paso 6 construye
  resultados y bloqueos, 6e decide, 6c-6g escriben y el Paso 8 transiciona. Ningún consumidor depende de
  `verify-report.md`. Cada decisión tiene una sola responsabilidad: regla (D-1), bloqueo (D-2, D-6), estructura (D-3,
  D-4), historial (D-5), estado (D-7), salida (D-8) y conformidad (D-11).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 fila 1 dice «todos los criterios DoD VERIFY aprobados» → `APPROVED`. El skill evalúa cada
  criterio como `✓`, `❌` o `⚠️` (no evaluable o verificación manual), y hoy un `⚠️` no impide `VERIFY/DONE`. El DoD de
  este repositorio tiene un criterio que solo ejecuta un humano (`test:eval`), así que siempre es `⚠️`. Si «aprobado»
  exigiera `✓`, ninguna historia llegaría a `APPROVED`, y cambiar esa evaluación está fuera de alcance. El diseño
  interpreta la fila como «ningún criterio DoD VERIFY fallido» (D-1).
- **Documento afectado**: story.md (redacción de AC-1, fila 1)
- **Acción requerida**: opcional. Si el PO lo confirma, reformular la fila como «ningún criterio DoD VERIFY fallido ni
  ejecución bloqueada». El diseño no cambia.

### CR-002
- **Tipo**: dependencia
- **Descripción**: el Paso 3 y `## DoD aplicable` declaran que `enforcement: warn` «solo informa», pero 6e cuenta los
  criterios `❌` sin mirar `enforcement`. Es una divergencia previa. Esta historia la conserva, porque AC-1 fila 2 exige
  `NEEDS-CHANGES` ante «algún criterio fallido» sin distinguir `enforcement` y porque cambiarla altera el gate.
- **Documento afectado**: `skills/story-verify/SKILL.md` (historia futura)
- **Acción requerida**: registrar una historia que decida si un criterio `❌` con `enforcement: warn` produce
  `NEEDS-CHANGES` o se informa con `APPROVED`. Afecta igual a los demás gates con DoD por etapa.

### CR-003
- **Tipo**: dependencia
- **Descripción**: el flowchart `flowchart-story-excecution-qa.mermaid` dibuja `BLOCKED` como arista: `I -->|BLOCKED| H`
  (`story-verify` vuelve a sí mismo, l.10) y `E -->|BLOCKED| C` en `story-code-review` (l.6). El diseño de STORY-138
  declara `BLOCKED` como «valor sin rama» en §4, y las Notas de esta historia dicen que «`BLOCKED` no es una rama». Para
  `story-verify` no hay conflicto de comportamiento: el autolazo coincide con `VERIFY/BLOCKED` y la reentrada de D-7. Sí
  afecta a la invariante de AC-3 de STORY-138 (valores permitidos − valores sin rama = ramas del diagrama) y a
  `story-code-review`, que según §4 no emite `BLOCKED`.
- **Documento afectado**: STORY-138 (§4 y V-7) y STORY-143 (verificación end-to-end)
- **Acción requerida**: que STORY-138 fije si un autolazo `BLOCKED` cuenta como rama al comprobar AC-3, o que se retiren
  del flowchart las aristas `BLOCKED`. Esta historia no modifica el flowchart.
