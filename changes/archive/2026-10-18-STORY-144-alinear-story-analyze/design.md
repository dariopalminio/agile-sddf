---
alwaysApply: false
type: design
id: STORY-144
slug: STORY-144-alinear-story-analyze-design
title: "Design: Alinear story-analyze"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-144
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-144-alinear-story-analyze
  - STORY-138-contrato-de-validacion
  - STORY-143-validacion-end-to-end
  - STORY-146-skill-story-fix-plan
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-144-alinear-story-analyze]] · [[STORY-138-contrato-de-validacion]] · [[STORY-143-validacion-end-to-end]] · [[STORY-146-skill-story-fix-plan]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear story-analyze

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `story-analyze`, el gate de planificación, y sus dos
consumidores: `story-plan`, que lo orquesta, y `story-fix-plan` (STORY-146), que ya lee `verdict` de `analyze.md`. Se
aplica el contrato que fija el diseño de STORY-138: reglas G-01…G-06, fila `story-analyze` de §4 (`APPROVED`,
`NEEDS-CHANGES`), equivalencias de §5 (`✓ Coherente` y `⚠️ Advertencias` → `APPROVED`;
`❌ Inconsistencias bloqueantes` → `NEEDS-CHANGES`), la regla D-7 sobre reportes heredados y el ejemplo 7.3.

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/story-analyze/assets/analyze-report-template.md` | 103 líneas. El frontmatter (l.1-11) no tiene `verdict`. Tras `# Reporte de Coherencia` (l.16), el primer `##` es `## Resumen Ejecutivo` (l.18). El resultado aparece solo como `**Estado general:** {overall_status}` (l.28) con el comentario `✓ Coherente \| ⚠️ Advertencias \| ❌ Inconsistencias bloqueantes` (l.29). El comentario de tipos de INC (l.81) lista solo A-D. |
| `skills/story-analyze/SKILL.md` (685 líneas) | Regla de bloqueo: «hallazgos ERROR (TIPO A, B o E)» (l.138, l.480-489). Frontmatter del reporte transcrito en el Paso 8 (l.441-455). «Estado general» en el Paso 8 (l.459) y en el template de fallback (l.597). Ciclo de vida por ERROR (l.36, l.54, l.59-62, l.563-565). El Paso 10 (l.493-539) solo se muestra en modo manual: en modo Agent el skill no informa su resultado en consola. |
| Clasificación de severidad | Tabla del Paso 6 (l.411-420): A, B y E son ERROR; C, D y F son WARNING. Con `enforcement: warn`, un criterio DoD `❌` es WARNING (l.205). Es lo que CNF-1 congela. |
| `skills/story-analyze/examples/output/analyze.md` | Sin `verdict`. `**Estado general:** ❌ Inconsistencias bloqueantes…` (l.29). Su único hallazgo es INC-001 [ERROR] tipo E (DoD). |
| `skills/story-analyze/evals/evals.json` | 5 casos (`version: 1.0.0`). Ninguno afirma `verdict` ni `## Veredicto`. TC-001 (coherente) y TC-004 (AC sin cobertura) cubren dos filas de AC-1; ninguno cubre «solo WARNING». |
| `skills/story-plan/SKILL.md` (431 líneas) | El Paso 5 (l.313-325) decide por «inconsistencias (ERRORs **o** WARNINGs)» → `⚠️`. El resumen de esa rama (l.383-393) dice «PLAN/IN-PROGRESS (no actualizado — hay ERROREs pendientes)», aunque con solo WARNING `story-analyze` ya escribió `READY-FOR-IMPLEMENT/DONE`. El resumen no nombra ningún veredicto. La rama «todos completaron» (l.375-381) afirma `READY-FOR-IMPLEMENT/DONE ✓` también con `--skip-analyze`, que TC-005 prohíbe. |
| `skills/story-plan/` (resto) | `README.md` l.17 y l.66, `assets/README.md` l.38 («sin ERROREs»); `examples/output/plan-summary.md` l.23, l.39-64; `evals/evals.json` (5 casos, `version: 1.0.0`). |
| `skills/story-fix-plan/` | Ya implementado (STORY-146). Su gate lee `verdict` del frontmatter (SKILL.md l.136-148) y registra además la línea `**Estado general:**` (l.138) para el resumen de consola (l.253) y para `assets/fix-plan-report-template.md` l.29. Sus tres fixtures `examples/*/analyze.md` declaran `verdict` con `**Estado general:**` (l.26) y sin `## Veredicto`. `evals/evals.json` TC-002, TC-004 y TC-012 describen el cuerpo con «Estado general»; TC-011 describe un reporte heredado sin `verdict`. |
| Flowchart | `docs/architecture/diagrams/flowchart-story-plan.mermaid`: `story-analyze` → `{verdict}` → `NEEDS-CHANGES` → `story-fix-plan` → `story-analyze`; `APPROVED` → END. El nodo ya se llama `story-fix-plan`, no `story-fix-changes` (ver CR-001). |
| Documentación vigente | `docs/architecture/state-machine.md` l.100 («(sin ERRORs)»); `docs/requirements/functional/FR-038-analisis-transversal-de-coherencia-gate-del-dod.md` l.17-20. |
| Pedido de STORY-143 | Su CR-002 pide que esta historia incluya `skills/story-analyze/examples/output/analyze.md` y los fixtures `analyze.md` de `story-fix-plan` en su inventario, porque su gate determinista los valida. Se acepta (D-8). |
| `scripts/run-evals.js` | Califica con subcadenas sensibles a mayúsculas y acentos (`includes`, l.655-657) sobre la salida de consola. No lee archivos generados. |
| `docs/policies/validation-contract-policy.md` | Todavía no existe: lo crea STORY-138 (ver D-11). |

## Goals / Non-Goals

**Goals:**

- `analyze.md` declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras `# Reporte de Coherencia`,
  con el mismo valor. // satisface: AC-1
- El veredicto se deriva de la severidad que ya existe: `NEEDS-CHANGES` con al menos un hallazgo ERROR; `APPROVED` en
  el resto. // satisface: AC-1, CNF-1
- `story.md` pasa a `READY-FOR-IMPLEMENT/DONE` solo con `verdict: APPROVED`, y `story-plan` informa el veredicto en su
  resumen. // satisface: AC-2
- Correlaciones, tipos A-F y severidades no cambian. // satisface: CNF-1

**Non-Goals:**

- Crear `story-fix-changes` o automatizar el bucle `NEEDS-CHANGES` del flowchart (Fuera de alcance de la historia).
  `story-plan` solo **sugiere** `/story-fix-plan`, que ya existe (CR-001).
- Reescribir los `analyze.md` históricos de `docs/specs/stories/` (Fuera de alcance; STORY-138 D-7).
- Cambiar el gate de `story-fix-plan`, incluido su alias `veredict` (STORY-146). Solo se ajusta lo que leía de
  `**Estado general:**` (D-7).
- Corregir desajustes ajenos al veredicto: la ruta canónica que cita `skills/story-analyze/assets/README.md`, el campo
  `testcases` que falta en el frontmatter del template o el `to: PLAN/DONE` de `dod-story-plan.md`.
- Editar la policy o `CHANGELOG.md` (el registro se hace en la release con `/doc-release-notes`).

## Decisions

### D-1 — Regla de veredicto sobre la severidad existente // satisface: AC-1, CNF-1

El Paso 6 de `SKILL.md` añade, tras la tabla «Clasificación de severidad» (que no cambia), la subsección
`#### Veredicto`, con una regla de dos filas que se evalúa en orden:

| # | Condición | Veredicto | Fila de AC-1 |
|---|---|---|---|
| 1 | Existe al menos un hallazgo de severidad ERROR (tipo A, B o E con `enforcement: error`) | `NEEDS-CHANGES` | 3 |
| 2 | En otro caso (ningún hallazgo, o solo WARNING) | `APPROVED` | 1 y 2 |

El resultado se registra una sola vez como `$VERDICT`. Los Pasos 8, 9 y 10 lo leen de ahí y no lo recalculan. Es
exactamente la condición de bloqueo actual (l.138 y l.480-489), así que CNF-1 se cumple: ninguna historia cambia de
resultado. `⚠️ Advertencias` → `APPROVED` coincide con §5 de la policy y con STORY-138 D-5.

**Qué no es un hallazgo:** una correlación omitida porque falta `tasks.md` o `testcases.md`, la épica no encontrada o
el DoD no disponible. Hoy se informan con `⚠️` de aviso y no bloquean. Siguen igual y no cuentan para el veredicto.

| Alternativa | Motivo del rechazo |
|---|---|
| `NEEDS-CHANGES` también con WARNING | Las advertencias pasarían a bloquear. Viola CNF-1, AC-1 (fila 2) y STORY-138 D-5. |
| Un tercer valor (`APPROVED-WITH-WARNINGS`) | §4 de la policy no lo permite (G-03), y el flowchart solo tiene dos ramas. El motivo de D-3 conserva la distinción. |
| Calcular el veredicto en el Paso 9, al escribir el estado | El Paso 8 escribe el reporte antes. Calcularlo dos veces permitiría que reporte y estado diverjan. |

### D-2 — Campo `verdict` en el frontmatter // satisface: AC-1

Se añade `verdict` después de `tasks` y antes de `created` en los tres lugares donde hoy se transcribe el frontmatter:
el template (`assets/analyze-report-template.md`), el bloque del Paso 8 y el template de fallback de `## Salida`.

| Lugar | Valor |
|---|---|
| `assets/analyze-report-template.md` | `verdict: {APPROVED \| NEEDS-CHANGES}` |
| Paso 8 de `SKILL.md` | `verdict: <$VERDICT>` con el comentario `# APPROVED \| NEEDS-CHANGES (Paso 6, Veredicto)` |
| Template de fallback | `verdict: {verdict}` |

El resto de campos no cambia. No se añaden `errors` ni `warnings`: G-04 los admite, pero ningún consumidor los necesita
y el motivo de D-3 ya resume los hallazgos (P12).

| Alternativa | Motivo del rechazo |
|---|---|
| Mover el frontmatter solo al template y remitir a él desde el Paso 8 (como STORY-140 D-2) | Deduplicaría el frontmatter, pero el Paso 8 tiene reglas propias (`testcases` y `tasks` condicionales) que el template no expresa. Es un refactor que ningún AC pide. |
| Campo `veredict` (forma que `story-fix-plan` acepta como alias) | G-01 fija `verdict`. El alias es tolerancia del consumidor, no forma de emisión. |

### D-3 — Sección `## Veredicto` con motivo determinista // satisface: AC-1

En el template y en el fallback, entre `# Reporte de Coherencia: {story_title}` y `## Resumen Ejecutivo`, se añade:
`## Veredicto`, un comentario guía de una línea y la línea `` **Veredicto:** `{verdict}` — {motivo} `` (G-02). El
motivo se deriva de los hallazgos de D-1 con tres formas fijas:

| Caso | Línea escrita |
|---|---|
| Ningún hallazgo | `` **Veredicto:** `APPROVED` — sin inconsistencias `` |
| Solo WARNING | `` **Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo <tipos> `` |
| Al menos un ERROR | `` **Veredicto:** `NEEDS-CHANGES` — ERROR de tipo <tipos ERROR> `` y, si hay WARNING, `` ; WARNING de tipo <tipos> `` |

`<tipos>` es el **conjunto** de tipos presentes en esa severidad, en orden A-F y separados por `, ` (ej.
`ERROR de tipo A, E; WARNING de tipo C`). Un criterio DoD `❌` o `⚠️` aporta el tipo E a su severidad. Se usan
conjuntos y no recuentos porque un mismo criterio DoD aparece a la vez en `## Inconsistencias Detectadas` y en la tabla
DoD (ejemplo propio, INC-001 tipo E). Contar entradas lo duplicaría, y contar solo entradas lo omitiría cuando el
criterio no tiene INC (fixture `example-solo-testcases`). El detalle de cada hallazgo sigue en sus secciones.

| Alternativa | Motivo del rechazo |
|---|---|
| Recuentos («2 ERROR; 1 WARNING», como el ejemplo 7.3 de la policy) | Ambiguos por la doble aparición de los criterios DoD. El ejemplo 7.3 es ilustrativo: G-02 solo exige «motivo en una frase». |
| Listar los IDs `INC-NNN` | Los criterios DoD sin entrada INC quedarían fuera, y la línea crece con cada hallazgo. |
| Motivo libre redactado por el agente | No sería repetible y las evals no podrían afirmarlo. |

### D-4 — Se elimina `**Estado general:**` // satisface: AC-1 · resuelve la «Decisión de diseño» de las Notas

Se eliminan la línea `**Estado general:** {overall_status}` y su comentario (template l.28-29, fallback l.597). En el
Paso 8, el punto «Resumen ejecutivo» deja de pedir el estado general. La tabla de métricas del Resumen Ejecutivo se
conserva entera: sus celdas `✓ / ⚠️ / ❌` califican cada correlación, no el reporte.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar «Estado general» como detalle | G-04 lo nombra expresamente: ningún otro campo ni línea declara el veredicto. Duplicaría `## Veredicto` y podría contradecirlo. |
| Convertirlo en una fila más de la tabla de métricas | Sigue declarando el resultado global fuera de `## Veredicto` (G-04). |

### D-5 — Transición de `story.md` y confirmación ligadas al veredicto // satisface: AC-1, AC-2

- **Paso 9a** pasa a decidir por `$VERDICT`: `APPROVED` → `status: READY-FOR-IMPLEMENT` / `substatus: DONE`;
  `NEEDS-CHANGES` → sin cambio. Las condiciones no varían (D-1); solo cambia la fuente de la decisión.
- **Paso 9b (nuevo), en ambos modos:** tras guardar, emitir
  `✓ Análisis guardado: <ruta>/analyze.md (verdict: <VALOR>)`. En modo Agent, `story-analyze` informa así su resultado
  a `story-plan`, que hoy no recibe nada (el Paso 10 es solo manual). Las evals ven la línea en consola (`run-evals.js`).
- **Paso 10:** su primera línea `✅ Análisis guardado: …` se sustituye por la de 9b (que ya se mostró), y el bloque
  `📊 Resumen de coherencia` añade `Veredicto: <VALOR> — <motivo>` antes de `Estado story.md`. El cierre `⛔` añade
  `Veredicto NEEDS-CHANGES — corrige el plan con /story-fix-plan <STORY-NNN> y vuelve a ejecutar /story-analyze <STORY-NNN>`.
  El cierre `✅ Sin inconsistencias bloqueantes…` se conserva para `APPROVED`.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener la condición «sin ERRORes» en el Paso 9a | Dos reglas paralelas (reporte y estado) que podrían divergir. Con `$VERDICT`, el estado y el reporte salen del mismo valor. |
| Mostrar el resumen del Paso 10 también en modo Agent | El orquestador solo necesita el valor. El resumen duplicaría el de `story-plan`. |

### D-6 — `story-plan` lee y reporta el veredicto // satisface: AC-2

`story-plan` sigue siendo orquestador puro y no recalcula nada. Tras invocar `story-analyze`, el Paso 5 lee `verdict`
del frontmatter de `<directorio>/analyze.md` (G-06). La línea `**Veredicto:**` la lee solo para mostrar el motivo:

| Resultado | Estado del paso | Línea de progreso |
|---|---|---|
| `verdict: APPROVED` | `✓` | `[n/N] ✓ story-analyze — analyze.md generado (verdict: APPROVED)` |
| `verdict: NEEDS-CHANGES` | `⚠️` | `[n/N] ⚠️ story-analyze — analyze.md generado (verdict: NEEDS-CHANGES)` |
| `verdict` ausente o fuera de `APPROVED \| NEEDS-CHANGES` | `✗` | `[n/N] ✗ story-analyze — analyze.md sin verdict válido` |
| `story-analyze` no genera `analyze.md` (error técnico o análisis rechazado) | `✗` | Sin cambio (`✗ story-analyze — error técnico`) |

**Guardia de cierre ante fallo (G-06):** si el veredicto no es `APPROVED` y `story.md` quedó en `READY-FOR-IMPLEMENT`,
`story-plan` restaura `PLAN/IN-PROGRESS` y emite
`⚠️ story.md estaba en READY-FOR-IMPLEMENT sin verdict APPROVED — restaurado a PLAN/IN-PROGRESS`. `story-plan` ya es el
escritor de `PLAN/IN-PROGRESS` (Paso 1e), y nunca escribe `READY-FOR-IMPLEMENT`. Así AC-2 se cumple aunque
`story-analyze` falle a medias.

**Resumen final (Paso 6):** la rama se elige por el veredicto, no por la presencia de inconsistencias. La línea
`Estado de story.md` muestra el `status`/`substatus` leído de `story.md` tras el Paso 5, no un texto fijo:

| Rama | Cabecera | Líneas que cambian |
|---|---|---|
| `APPROVED` | `✅ Planning completo` (sin cambio) | `Veredicto de story-analyze: APPROVED — <motivo>` · `Estado de story.md: READY-FOR-IMPLEMENT/DONE ✓` |
| `NEEDS-CHANGES` | `⚠️ Planning completado — requiere revisión` (sin cambio) | `Veredicto de story-analyze: NEEDS-CHANGES — <motivo>` · `→ <ruta>/analyze.md` · `Estado de story.md: PLAN/IN-PROGRESS (veredicto NEEDS-CHANGES)` · `Corrige el plan con /story-fix-plan <story_id> y vuelve a ejecutar /story-analyze <story_id>.` |
| Algún paso `✗` | `✗ Pipeline interrumpido en: <paso>` (sin cambio) | Sin cambio |
| `--skip-analyze` sin fallos | `✅ Planning completo (sin gate de coherencia)` | `ℹ️ Sin veredicto: se omitió el gate con --skip-analyze` · `Estado de story.md: PLAN/IN-PROGRESS` |

La leyenda pasa a `✓ completado (APPROVED) · ⚠️ veredicto NEEDS-CHANGES · ✗ fallido · — no ejecutado`. La rama
`--skip-analyze` es necesaria porque hoy esa ejecución cae en «todos completaron» y afirma `READY-FOR-IMPLEMENT/DONE ✓`,
que es falso y que TC-005 prohíbe. Su texto evita `story-analyze` y `analyze.md`, como exige TC-005.

| Alternativa | Motivo del rechazo |
|---|---|
| Decidir por la línea de consola de `story-analyze` (D-5) | La consola es para humanos y evals. G-06 fija el frontmatter como fuente, y CI hará lo mismo. |
| Que `story-plan` escriba `READY-FOR-IMPLEMENT` | Habría dos escritores del estado de salida. `story-analyze` sigue siendo el único (`state-machine.md` l.100). |
| Sin guardia, confiando en `story-analyze` | Un `analyze.md` sin `verdict` con `story.md` en `READY-FOR-IMPLEMENT` pasaría el gate en silencio, lo que G-06 prohíbe. |
| Invocar `story-fix-plan` automáticamente con `NEEDS-CHANGES` | Es el bucle que la historia deja fuera de alcance. |

### D-7 — `story-fix-plan` deja de leer `**Estado general:**` // satisface: AC-1

D-4 elimina una línea que `story-fix-plan` lee (Context). Sin este ajuste, su resumen y su reporte mostrarían un campo
vacío:

- **SKILL.md l.138:** registrar el motivo de la línea `**Veredicto:**` (el texto tras `— `) en lugar de la línea
  `**Estado general:**`. Si la línea no existe (reporte heredado), registrar `—`.
- **SKILL.md l.148:** «El veredicto se lee solo del frontmatter: no se infiere del cuerpo del reporte.» La regla no
  cambia; solo deja de nombrar una línea retirada.
- **SKILL.md l.253 y `assets/fix-plan-report-template.md` l.29:** `<estado general>` → `<motivo del veredicto>`.

El gate (l.140-146) y el alias `veredict` no cambian (Non-Goals).

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar `story-fix-plan` como está | Mostraría `· ` sin valor en cada ejecución sobre un `analyze.md` nuevo. |
| Quitar el dato del resumen | Pierde información útil (qué tipos bloquean) que el motivo da en una línea. |

### D-8 — Inventario de cambios en textos // satisface: AC-1, AC-2

| Archivo | Línea | Cambio |
|---|---|---|
| `skills/story-analyze/SKILL.md` | l.35-36 | «Genera `analyze.md` con un veredicto `APPROVED` o `NEEDS-CHANGES` en `## Veredicto` y en `verdict`» · «Actualiza `story.md` a `READY-FOR-IMPLEMENT/DONE` con veredicto `APPROVED`» |
| `skills/story-analyze/SKILL.md` | l.52-54, l.59-62 | Posicionamiento y ciclo de vida: condición `verdict: APPROVED` / `verdict: NEEDS-CHANGES` |
| `skills/story-analyze/SKILL.md` | l.138 | «Un hallazgo ERROR (tipo A, B o E) determina el veredicto `NEEDS-CHANGES` (Paso 6), que bloquea la transición a `READY-FOR-IMPLEMENT`», más una línea que remite a `docs/policies/validation-contract-policy.md` de Agile-SDDF, en código en línea y sin enlace |
| `skills/story-analyze/SKILL.md` | Paso 6, tras l.420 | Subsección `#### Veredicto` (D-1) |
| `skills/story-analyze/SKILL.md` | l.441-459 | `verdict` en el frontmatter (D-2); punto nuevo «Veredicto: sección `## Veredicto` con la línea de D-3»; el punto «Resumen ejecutivo» pierde el estado general (D-4) |
| `skills/story-analyze/SKILL.md` | l.478-539 | D-5 |
| `skills/story-analyze/SKILL.md` | l.563-565 | Salida: `READY-FOR-IMPLEMENT / DONE` con `verdict: APPROVED`; sin cambio con `NEEDS-CHANGES` |
| `skills/story-analyze/SKILL.md` | l.571-597 | Fallback: D-2, D-3 y D-4 |
| `skills/story-analyze/assets/analyze-report-template.md` | l.1-29, l.81 | D-2, D-3 y D-4; el comentario de tipos de INC lista A-F, como la tabla del Paso 6 |
| `skills/story-analyze/README.md` | l.15-16 | «`analyze.md` con veredicto `APPROVED` o `NEEDS-CHANGES`, cobertura, inconsistencias y recomendaciones» · «solo con veredicto `APPROVED`» |
| `skills/story-analyze/examples/output/analyze.md` | frontmatter, l.29 | `verdict: NEEDS-CHANGES`; `## Veredicto` con `` **Veredicto:** `NEEDS-CHANGES` — ERROR de tipo E `` tras el título; se elimina l.29 |
| `skills/story-plan/SKILL.md` | l.47, l.63 | «→ READY-FOR-IMPLEMENT/DONE con verdict APPROVED» |
| `skills/story-plan/SKILL.md` | l.313-325, l.373-393 | D-6 |
| `skills/story-plan/SKILL.md` | l.419, l.429-431 | Fila nueva en Manejo de errores para `verdict` ausente o no permitido (D-6, con la guardia); Salida por veredicto |
| `skills/story-plan/README.md` | l.17, l.66 | «si verdict APPROVED» en lugar de «si sin ERROREs» |
| `skills/story-plan/assets/README.md` | l.38 | Ídem |
| `skills/story-plan/examples/output/plan-summary.md` | l.23, l.39-64 | Líneas de progreso y resúmenes de D-6, con la línea `Veredicto de story-analyze:` en ambos casos |
| `skills/story-fix-plan/SKILL.md` | l.138, l.148, l.253 | D-7 |
| `skills/story-fix-plan/assets/fix-plan-report-template.md` | l.29 | D-7 |
| `skills/story-fix-plan/examples/example-coherente/analyze.md` | l.14-26 | `## Veredicto` tras el título con `` `APPROVED` — sin inconsistencias ``; se elimina l.26 |
| `skills/story-fix-plan/examples/example-con-hallazgos/analyze.md` | l.14-26 | `` `NEEDS-CHANGES` — ERROR de tipo A, B; WARNING de tipo D, E ``; se elimina l.26 |
| `skills/story-fix-plan/examples/example-solo-testcases/analyze.md` | l.14-26 | `` `NEEDS-CHANGES` — ERROR de tipo E; WARNING de tipo F ``; se elimina l.26 |
| `docs/architecture/state-machine.md` | l.100 | `READY-FOR-IMPLEMENT/DONE` (`verdict: APPROVED`) |
| `docs/requirements/functional/FR-038-…md` | l.17-20, `updated` | «Declara el veredicto `APPROVED` o `NEEDS-CHANGES` en `verdict` y en `## Veredicto`. Con `APPROVED` (sin hallazgos `ERROR`) SHALL promover…» |

Los fixtures de `story-fix-plan` conservan sus hallazgos, su `verdict` y el resto del cuerpo, porque sus evals dependen
de ellos. El motivo de cada uno se deriva de sus propios hallazgos con D-3. Las INC tipadas como «coherencia interna»
no tienen tipo A-F y no figuran en el motivo, que es fiel a lo que la regla de D-3 puede leer.

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar los fixtures de `story-fix-plan` para STORY-143 | STORY-143 no cambia skills (su Non-Goal) y pidió expresamente esta inclusión (su CR-002). |
| Renumerar o tipar las INC de los fixtures | Cambia la entrada de las evals de `story-fix-plan` sin que un AC lo pida. |

### D-9 — Evals // satisface: AC-1, AC-2, CNF-1

**`skills/story-analyze/evals/evals.json`** (`version` → `1.1.0`):

| Caso | Cambio |
|---|---|
| TC-001 | `contains`: `"## Veredicto"`, `"(verdict: APPROVED)"`. `not_contains`: `"Estado general"`, `"NEEDS-CHANGES"` (AC-1 fila 1) |
| TC-002, TC-003 | `not_contains`: se añade `"## Veredicto"` (no se genera reporte) |
| TC-004 | `contains`: `"(verdict: NEEDS-CHANGES)"`, `` "**Veredicto:** `NEEDS-CHANGES`" ``, `"ERROR de tipo A"`. `not_contains`: `"(verdict: APPROVED)"`, `"Estado general"` (AC-1 fila 3, AC-2) |
| TC-005 | `contains`: `"(verdict: APPROVED)"`. Las omisiones por `tasks.md` ausente no son hallazgos (D-1) |
| TC-006 (nuevo) | Artefactos completos; un componente de `design.md` sin tarea (tipo C) y ningún ERROR → `"(verdict: APPROVED)"`, `"WARNING de tipo C"`, `"READY-FOR-IMPLEMENT"`; `not_contains`: `"NEEDS-CHANGES"`, `"Estado general"` (AC-1 fila 2, CNF-1) |

**`skills/story-plan/evals/evals.json`** (`version` → `1.1.0`):

| Caso | Cambio |
|---|---|
| TC-001 | `contains`: `"(verdict: APPROVED)"`, `"Veredicto de story-analyze: APPROVED"` |
| TC-005 | `contains`: `"Sin veredicto"`. Sus `not_contains` actuales se mantienen (rama `--skip-analyze` de D-6) |
| TC-006 (nuevo) | `story-analyze` deja `analyze.md` con `verdict: NEEDS-CHANGES` (INC-001 tipo A) → `"(verdict: NEEDS-CHANGES)"`, `"Veredicto de story-analyze: NEEDS-CHANGES"`, `"PLAN/IN-PROGRESS"`, `"/story-fix-plan"`; `not_contains`: `"READY-FOR-IMPLEMENT"`, `"Planning completo"` (AC-2) |
| TC-007 (nuevo) | `story-analyze` deja `verdict: APPROVED` con un WARNING tipo C → `"(verdict: APPROVED)"`, `"READY-FOR-IMPLEMENT/DONE"`; `not_contains`: `"requiere revisión"`, `"hay ERROREs pendientes"` (`Pero` de AC-2; corrige la rama actual de solo WARNING) |

**`skills/story-fix-plan/evals/evals.json`** (`version` → `1.0.1`): en `description` y `context` de TC-002, TC-004 y
TC-012, «'✓ Coherente'», «Estado general ❌» y «Estado general ⚠️ Advertencias» pasan a la línea `**Veredicto:**` de
cada caso. Las aserciones no cambian. TC-011 conserva «Estado general» porque describe un reporte heredado: prueba
justamente que el gate no infiere el veredicto del cuerpo.

Las posiciones (`## Veredicto` primero) se verifican en el template y en los ejemplos (V-2, V-6), no en evals. Todas
las cadenas nuevas son ASCII o literales del template, porque el runner no normaliza acentos.

| Alternativa | Motivo del rechazo |
|---|---|
| Afirmar el frontmatter del archivo generado | El runner solo califica la salida de consola. Por eso existe la línea `(verdict: <VALOR>)` de D-5. |
| No añadir el caso «solo WARNING» | Es la fila de AC-1 que más arriesga CNF-1, y hoy ningún caso la cubre. |

### D-10 — Conformidad con la policy // satisface: AC-1

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | D-2 |
| C-2 | G-02: `## Veredicto` primer `##` tras el `#`, con `` **Veredicto:** `<VALOR>` — <motivo> `` | D-3. El bloque `<!-- Referencias -->` + wikilink va **antes** del `#`, así que no se interpone |
| C-3 | G-03 y §4: `APPROVED`, `NEEDS-CHANGES` | D-1 |
| C-4 | G-04: ninguna otra línea declara el veredicto | D-4 (`**Estado general:**`) |
| C-5 | G-06: consumidores cerrados ante fallo | D-6 (`✗` y guardia) y D-7 (sin inferencia desde el cuerpo) |
| C-6 | §7.3: `type: analyze`, `# Reporte de Coherencia: …`, siguiente `##` = `## Resumen Ejecutivo` | D-2 y D-3 |

No se conserva ninguna divergencia: §6 sigue con `Sin excepciones vigentes.`. Si la policy publicada difiere del diseño
de STORY-138, se aplica la versión publicada y la diferencia se anota en `implement-report.md`.

### D-11 — Secuencia respecto a STORY-138 // satisface: AC-1

La implementación empieza cuando existe `docs/policies/validation-contract-policy.md` (lo comprueba la primera tarea).
C-1…C-6 se comparan contra el texto publicado. WIP = 1 por nivel ya serializa las historias. STORY-146 está implementada,
así que `story-fix-plan` existe y D-7 es aplicable.

| Alternativa | Motivo del rechazo |
|---|---|
| Implementar antes de que exista la policy | Si cambia la redacción de §4 o de G-02, habría que rehacer template, ejemplos y evals. |
| Dejar `story-plan` para otra historia | AC-2 es parte de esta historia, y su resumen actual ya es incorrecto con solo WARNING. |

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Regla de veredicto, escritura del reporte y transición | modificar | `skills/story-analyze/SKILL.md` | AC-1, AC-2, CNF-1 |
| Template del reporte de coherencia | modificar | `skills/story-analyze/assets/analyze-report-template.md` | AC-1 |
| Ficha y ejemplo de `story-analyze` | modificar | `skills/story-analyze/README.md`, `examples/output/analyze.md` | AC-1 |
| Evals de `story-analyze` | modificar | `skills/story-analyze/evals/evals.json` | AC-1, CNF-1 |
| Lectura del veredicto en el pipeline de planning | modificar | `skills/story-plan/SKILL.md`, `README.md`, `assets/README.md`, `examples/output/plan-summary.md`, `evals/evals.json` | AC-2 |
| Resumen y fixtures de la corrección del plan | modificar | `skills/story-fix-plan/SKILL.md`, `assets/fix-plan-report-template.md`, `examples/*/analyze.md`, `evals/evals.json` | AC-1 |
| Documentación vigente | modificar | `docs/architecture/state-machine.md`, `docs/requirements/functional/FR-038-analisis-transversal-de-coherencia-gate-del-dod.md` | AC-1, AC-2 |

No se tocan: la policy, `docs/architecture/diagrams/flowchart-story-plan.mermaid` (ya tiene las dos ramas), los
`analyze.md` de `docs/specs/`, `CHANGELOG.md`, `package.json` (no hay archivos nuevos) ni las copias de runtime.

## Interfaces

| Interfaz | Contrato | Consumidor | Satisface |
|---|---|---|---|
| Frontmatter de `analyze.md` | Campos actuales más `verdict: APPROVED \| NEEDS-CHANGES` | `story-plan`, `story-fix-plan`, CI (gate de STORY-143) | AC-1, AC-2 |
| Sección `## Veredicto` | Primer `##` tras `# Reporte de Coherencia: …`; una línea según D-3 | Lectores humanos, `story-plan` y `story-fix-plan` (solo el motivo), evals | AC-1 |
| Confirmación de guardado | `✓ Análisis guardado: <ruta>/analyze.md (verdict: <VALOR>)`, en ambos modos | `story-plan` (informativa), evals | AC-1, AC-2 |
| Transición de `story.md` | `READY-FOR-IMPLEMENT/DONE` solo con `verdict: APPROVED`; único escritor: `story-analyze` | `story-implement`, `story-implement-tasks` | AC-2 |
| Resumen de `story-plan` | Línea `Veredicto de story-analyze: <VALOR> — <motivo>` y rama elegida por el veredicto (D-6) | Mantenedor | AC-2 |
| Guardia de `story-plan` | Veredicto distinto de `APPROVED` + `story.md` en `READY-FOR-IMPLEMENT` → restaura `PLAN/IN-PROGRESS` y emite `⚠️` | Mantenedor, CI | AC-2 |

## Esquema de datos // satisface: AC-1

Cabecera del template tras el cambio (forma abstracta):

```markdown
---
type: analyze
id: {story_id}
slug: {story_id}-analyze-report
title: "Analyze: {story_title}"
story: {story_id}
design: {story_id}
tasks: {story_id}
verdict: {APPROVED | NEEDS-CHANGES}
created: {date}
updated: {date}
---

<!-- Referencias -->
[[{story_id}]]

# Reporte de Coherencia: {story_title}

## Veredicto
<!-- comentario guía: línea según la regla de Veredicto del Paso 6 -->

**Veredicto:** `{verdict}` — {motivo}

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
…tabla de métricas sin cambios, sin línea «Estado general»…
```

## Flujos clave

### F-1 — Análisis con veredicto // AC-1

Pasos 2-5 (lectura) → Paso 6: correlaciones y severidad (sin cambio) → regla de Veredicto → `$VERDICT` → Paso 8:
reporte con `verdict` y `## Veredicto` → Paso 9a: `APPROVED` → `READY-FOR-IMPLEMENT/DONE`; `NEEDS-CHANGES` → sin
cambio → Paso 9b: `✓ Análisis guardado: … (verdict: <VALOR>)` → Paso 10 (solo manual).

### F-2 — `story-plan` respeta el veredicto // AC-2

Paso 5 invoca `story-analyze` → lee `verdict` de `analyze.md` → `APPROVED`: `✓` y resumen «Planning completo».
`NEEDS-CHANGES`: `⚠️`, resumen «requiere revisión» con el veredicto y la sugerencia `/story-fix-plan` →
`/story-analyze` (el bucle del flowchart, ejecutado por el mantenedor). En ambos casos se aplica la guardia antes del
resumen.

### F-3 — Reporte sin `verdict` válido // AC-2 (degradación, P7)

`story-analyze` deja un `analyze.md` sin `verdict` (fallo del agente) → `story-plan` marca `✗ … sin verdict válido`,
aplica la guardia si `story.md` quedó en `READY-FOR-IMPLEMENT` y cae en la rama «Pipeline interrumpido».
`story-fix-plan`, ante el mismo archivo, termina sin cambios como hoy (su fila «Campo ausente»). Un `analyze.md`
heredado de `docs/specs/` se trata igual: no aprobado, sin inferir nada del cuerpo.

### F-4 — Cambio de contrato o de severidad (P6) // AC-1

- Si la policy cambia los valores de `story-analyze`, cambian la columna «Veredicto» de D-1, las líneas de D-3, la
  tabla de D-6 y las evals de D-9. La estructura (D-2, D-4) no depende de los valores.
- Si una historia futura cambia la severidad de un tipo, la regla de D-1 no cambia: lee la severidad, no los tipos.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Motivo por conjunto de tipos (D-3) | Un criterio DoD aparece en dos secciones. Los recuentos lo duplican u omiten, y sin motivo se pierde la diferencia entre las filas 1 y 2 de AC-1. | AC-1 |
| Línea de confirmación en ambos modos (D-5) | En modo Agent `story-analyze` no informa nada hoy, y las evals solo ven la consola. | AC-1, AC-2 |
| Guardia de `story-plan` (D-6) | Sin ella, un reporte roto con `story.md` en `READY-FOR-IMPLEMENT` incumpliría AC-2 y G-06 sin aviso. Es un condicional, y `story-plan` ya escribe ese estado. | AC-2 |
| Rama `--skip-analyze` (D-6) | El resumen se elige ahora por el veredicto, y sin veredicto no hay rama. La actual afirma un estado falso. | AC-2 |
| Ajuste de `story-fix-plan` (D-7) | D-4 retira la línea que lee. No ajustarlo deja un hueco visible en su salida. | AC-1 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | El template, el Paso 8 y el fallback declaran `verdict` | `grep -n "verdict" skills/story-analyze/assets/analyze-report-template.md skills/story-analyze/SKILL.md` muestra las tres apariciones de D-2 | AC-1 |
| V-2 | El primer `##` tras `# Reporte de Coherencia` es `## Veredicto`, seguido de `## Resumen Ejecutivo` | `grep -n '^#' skills/story-analyze/assets/analyze-report-template.md`; lo mismo en el bloque de fallback de `SKILL.md` | AC-1 |
| V-3 | Ninguna línea declara «Estado general» | `grep -rn -E "Estado general\|overall_status\|estado general" skills/story-analyze skills/story-plan skills/story-fix-plan` solo devuelve el `context` de TC-011 y los `not_contains` de `skills/story-analyze/evals/evals.json` | AC-1 |
| V-4 | La regla de Veredicto reproduce la condición de bloqueo actual y la tabla de severidad no cambia | `git diff` de `skills/story-analyze/SKILL.md`: la tabla «Clasificación de severidad» y las Correlaciones 1-6 no tienen líneas modificadas; la regla de D-1 cita «A, B o E» como l.138 | AC-1, CNF-1 |
| V-5 | El Paso 9a decide por `$VERDICT` | Lectura del Paso 9a | AC-2 |
| V-6 | En el ejemplo propio y en los tres fixtures, `verdict` coincide con el valor de `**Veredicto:**`, que es el primer `##` tras el `#`, y no queda `**Estado general:**` | `npm run verify:validation-contract -- --report <ruta>` si STORY-143 ya está implementada; si no, lectura | AC-1 |
| V-7 | `story-plan` lee `verdict` del frontmatter y elige la rama del resumen por él, con la guardia | Lectura de los Pasos 5 y 6 de `skills/story-plan/SKILL.md` | AC-2 |
| V-8 | Los literales de veredicto de los archivos alcanzados son solo `APPROVED` y `NEEDS-CHANGES` | `grep -rn -E "Coherente\|Inconsistencias bloqueantes\|sin ERROREs" skills/story-analyze skills/story-plan skills/story-fix-plan docs/architecture/state-machine.md docs/requirements/functional/FR-038-*.md` solo devuelve el `context` de TC-011 | AC-1, AC-2 |
| V-9 | C-1…C-6 de D-10 se cumplen frente a la policy publicada | Lectura comparada; resultado anotado en `implement-report.md` | AC-1 |
| V-10 | El gate determinista pasa | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-11 | Las evals pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- story-analyze`, `story-plan`, `story-fix-plan` | AC-1, AC-2, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que interpreta «Estado general»]** → deja de encontrarlo, como prevé la épica. La traducción
  vive en §5 de la policy y G-06 lo trata como no aprobado.
- **[El agente escribe la línea de motivo con otra forma]** → las evals afirman los literales de D-3 (`ERROR de tipo A`,
  `WARNING de tipo C`). El valor de `verdict` no depende del motivo.
- **[Fixtures de `story-fix-plan` con INC sin tipo A-F]** → el motivo las omite (D-8). Las evals de `story-fix-plan`
  no afirman el motivo, así que no fallan.
- **[Evals heredadas con cadenas sin acentos («Aceptacion»)]** → ya fallan parcialmente y dependen del `threshold`. Las
  cadenas nuevas no añaden ese problema (D-9). Corregirlas queda fuera de alcance.
- **[La policy publicada difiere del diseño de STORY-138]** → D-10 aplica la versión publicada y registra la
  diferencia.
- **[Copias de runtime desactualizadas]** → `.claude/skills/` se regenera con `npx agile-sddf install --force`.

## Open Questions

Ninguna. El destino del «Estado general» se resuelve en D-4, la regla en D-1, la forma del motivo en D-3 y la
inconsistencia de nombre `story-fix-changes` / `story-fix-plan` en CR-001.

## Autoevaluación (P9, P10)

- **Omisiones:** las tres filas de AC-1, el `Entonces`, el `Y` y el `Pero` de AC-2 y CNF-1 tienen decisión y
  verificación. Los consumidores de `analyze.md` están cubiertos: `story-plan` (D-6), `story-fix-plan` (D-7) y la
  documentación (D-8). La petición de STORY-143 CR-002 queda incluida en D-8.
- **Ambigüedad:** la regla de veredicto (D-1), qué cuenta como hallazgo (D-1), la forma del motivo (D-3), la fuente de
  lectura de `story-plan` (D-6) y la rama `--skip-analyze` (D-6) quedan fijadas.
- **Nombres:** «veredicto» designa el valor, `verdict` el campo y `## Veredicto` la sección. «Estado general»
  desaparece. «Hallazgo» designa una entrada INC o un criterio DoD con severidad.
- **Estructura:** sin dependencias cíclicas. `story-analyze` escribe `verdict` y el estado de salida; `story-plan` y
  `story-fix-plan` solo leen `verdict` (y el motivo, para mostrarlo). Ningún consumidor conoce la tabla de severidad.
  Cada decisión tiene una responsabilidad: regla (D-1), estructura (D-2, D-4), texto (D-3), estado (D-5) y consumo
  (D-6, D-7).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: el Non-Goal y las Notas de la historia nombran `story-fix-changes` como el paso del bucle
  `NEEDS-CHANGES`. Ese skill no existe. El flowchart actual (`flowchart-story-plan.mermaid`) nombra `story-fix-plan`,
  que STORY-146 ya implementó en `skills/story-fix-plan/`. El diseño no crea ni automatiza el bucle: `story-plan` y
  `story-analyze` solo sugieren `/story-fix-plan` en su salida (D-5, D-6), que es el skill que el flowchart nombra.
- **Documento afectado**: story.md (Non-Goal y Notas)
- **Acción requerida**: opcional. Sustituir `story-fix-changes` por `story-fix-plan` en `story.md`. Ningún AC depende de
  ese nombre, así que el diseño no cambia.
