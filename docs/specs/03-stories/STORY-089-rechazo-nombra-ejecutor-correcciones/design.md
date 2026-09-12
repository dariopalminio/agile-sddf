---
alwaysApply: false
type: design
id: STORY-089
slug: STORY-089-rechazo-nombra-ejecutor-correcciones-design
title: "Design: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md"
date: 2026-09-11
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
related:
  - STORY-089-rechazo-nombra-ejecutor-correcciones
  - STORY-091-story-implement-modo-rework
  - STORY-092-reglas-robustez-modo-rework
  - STORY-090-campos-declarados-nombran-su-escritor
  - STORY-067-story-implement-continuar-parcial
---

<!-- Referencias -->
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]
[[STORY-091-story-implement-modo-rework]]
[[STORY-092-reglas-robustez-modo-rework]]

## Context

**Historia origen:** [[STORY-089-rechazo-nombra-ejecutor-correcciones]] (kind: `feat`, épica `EPIC-19-framework-consistency`). Es la historia *core* de un split por pasos del flujo post-review: emisor del rechazo (esta) → ejecutor de correcciones (STORY-091) → endurecimiento del ejecutor (STORY-092).

**Criterios de aceptación de referencia** (numeración usada en todo el diseño):

| AC | Escenario / requerimiento en `story.md` |
|---|---|
| AC-1 | Escenario principal — con `story.md` en `IMPLEMENT/DONE` y ≥1 hallazgo HIGH/MEDIUM, `needs-changes` deja `story.md` en `READY-FOR-IMPLEMENT/DONE`, crea `fix-directives.md` con `round: 1`, **no** añade ninguna tarea a `tasks.md` y el mensaje final dice `→ Ejecuta /story-implement STORY-NNN` |
| AC-2 | Escenario alternativo — segunda ronda: `fix-directives.md` existente con `round: 1` se sobreescribe con `round: 2`; el mensaje menciona `/story-implement-tasks STORY-NNN` como alternativa **solo si existe `tasks.md`** |
| AC-3 | Escenario alternativo — `approved` con `fix-directives.md` previo: el archivo se elimina y `story.md` queda en `CODE-REVIEW/DONE` |
| AC-4 | Requerimiento — la señal de rework es el artefacto, no el estado: ningún estado/substatus nuevo ni campo `rework:` en `story.md`; el destino del rechazo sigue siendo `READY-FOR-IMPLEMENT/DONE` (invariante 6 de `domain-story-lifecycle.md`) |
| AC-5 | Requerimiento — `round` = ejecuciones de `story-code-review` cerradas en `needs-changes`: ronda previa + 1 si el archivo existe, `1` si no; escritor único `story-code-review` |
| AC-6 | Requerimiento — `story-implement-tasks` aplica las correcciones cuando `fix-directives.md` está presente, sin depender del literal de tarea `"Implementar fix-directives.md"` |
| NFR-1 | Documentación: `fix-directives-template.md` (ejecutor + corregir `READY-FOR-VERIFY`), `domain-story-lifecycle.md` (glosario "Rework"), `domain-state-management.md` §5.3 (retirar substatus `REWORK`), `sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` |
| NFR-2 | ADR nuevo `ADR-0008-rework-sin-estado-propio.md`: cita que `NEEDS-CHANGES` era la propuesta de EPIC-19 (Escenario 3) y queda descartada; no supersede ADR-0003 |
| NFR-3 | `epic.md` de EPIC-19 deja de citar `NEEDS-CHANGES` y la ruta inexistente `docs/knowledge/guides/state-machine.md` |
| NFR-4 | Idempotencia: re-ejecutar `/story-code-review` en `needs-changes` sobreescribe `fix-directives.md` e incrementa `round`; ninguna otra escritura se repite |

**Estado actual medido sobre el repositorio (2026-09-11):**

- `skills/story-code-review/SKILL.md` — Paso 4g.1 escribe `- [ ] Implementar fix-directives.md` al final de `tasks.md` *si existe*; 4g.2 retrocede `story.md` a `READY-FOR-IMPLEMENT/DONE`; Paso 7 cierra con `Ejecuta /story-code-review {story_id} nuevamente tras corregir los hallazgos` (no nombra ejecutor). El Paso 4f ya sobreescribe `fix-directives.md` si existe; el Paso 4h ya lo elimina en `approved`. Objetivo (l. 29–30) y Posicionamiento (l. 37–54) describen la escritura en `tasks.md`.
- `skills/story-code-review/assets/fix-directives-template.md` — frontmatter sin `round`; "Ciclo de corrección" paso 4 cita `READY-FOR-VERIFY` (estado inexistente) y no nombra ejecutor. Los dos ejemplos `examples/example-needs-changes*/fix-directives.md` replican el mismo texto (l. 38 y l. 40).
- `skills/story-code-review/evals/evals.json` — el caso `needs-changes-hallazgo-high-genera-fix-directives` espera el literal `"Implementar fix-directives.md"` en `contains`.
- `skills/story-implement-tasks/SKILL.md` — 2c calcula `fix_directives_existe` pero solo lo muestra en el resumen; el sub-flujo de correcciones (Paso 3c) se dispara únicamente por el literal `"implementar fix-directives.md"` (nota D-3 de STORY-067). El gate de salida anticipada de 2c (`N_pendientes = 0 AND N_completadas > 0`) termina **sin modificar nada**, lo que hoy impediría aplicar correcciones cuando todas las tareas ya están `[x]`. No existe `evals/evals.json` en este skill (solo `examples/input` y `examples/output`).
- `docs/domains/domain-story-lifecycle.md` — glosario l. 34 "Rework: Retorno a `READY-FOR-IMPLEMENT` tras un rechazo…"; invariante 6 (l. 157) "todos los retrocesos apuntan a `READY-FOR-IMPLEMENT/DONE`"; tabla 4.3 (l. 110–112) y `ReworkEvent` (l. 54) ya modelan origen + ronda. Todo se mantiene.
- `docs/domains/domain-state-management.md` §5.3 l. 113 — "detecta el rework por el subestado `REWORK` o por la existencia de un reporte de fallo" (`REWORK` no pertenece al conjunto cerrado de substatus).
- `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — l. 26 (bullet STORY-089, "estado propio", wikilink al slug antiguo `STORY-089-story-fix-post-code-review`), l. 45 (Escenario 3, `NEEDS-CHANGES`), l. 96 y l. 104 (`docs/knowledge/guides/state-machine.md`, `NEEDS-CHANGES`).
- `docs/adr/` — último ADR es `ADR-0007` (2026-09-11, ACCEPTED); `docs/adr/README.md` mantiene la tabla índice; `adr-template.md` define la estructura.
- `docs/guides/sddf-commands-pipeline.md` — no menciona `story-code-review` ni el flujo post-review (secciones 1–3 solo cubren proyecto, épicas y refinamiento de historias).
- `README.md` l. 406 lista `fix-directives.md` como artefacto; l. 412 referencia `docs/guides/state-machine.md` (inexistente). `docs/domains/README.md` l. 64 referencia `docs/wiki/state-machine.md` (inexistente).
- **Fixture real:** `STORY-090` está en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (5 hallazgos MEDIUM, **sin** `round`) y con `tasks.md` que ya contiene la línea `- [ ] Implementar fix-directives.md` (l. 85) escrita por el 4g.1 actual.
- `.claude/skills/` es copia instalada e ignorada por git; la fuente editable es `skills/` en la raíz (principio 12 de la constitución). Este repo no tiene capas de código: el "código de producción" son los `SKILL.md`, sus `assets/`, `examples/` y `evals/` (`sddf.config.yaml` → `code_generators.layer: monolithic`, skill `skill-master`).

**Restricciones que aplica este diseño:** constitución §5 (template como fuente de verdad dinámica), §10 (gates con precondiciones), §11 (idempotencia declarada), §16 (ADR obligatorio cuando la decisión afecta a más de un skill — aquí afecta a `story-code-review`, `story-implement-tasks` y, vía STORY-091, `story-implement`), principio 11 (evals antes del `SKILL.md`), principio 13 (todo campo declarado nombra a su escritor).

## Goals / Non-Goals

**Goals:**
- `story-code-review` deja de escribir en `tasks.md` y nombra al ejecutor de correcciones en su mensaje final. `// satisface: AC-1, AC-2`
- `fix-directives.md` lleva `round: N` en su frontmatter, con `story-code-review` como escritor único, calculado a partir del archivo previo. `// satisface: AC-1, AC-2, AC-5, NFR-4`
- La presencia de `fix-directives.md` es la única señal de rework; `approved` la retira. `// satisface: AC-3, AC-4`
- `story-implement-tasks` aplica `fix-directives.md` por presencia del archivo, no por literal de tarea. `// satisface: AC-6`
- Documentación, épica y ADR alineados con la decisión "rework sin estado propio". `// satisface: NFR-1, NFR-2, NFR-3`

**Non-Goals:**
- Modo rework de `story-implement` (gate de estado, detección, bundle con `fix_directives_path`/`whitelist`, sección en `implement-report.md`) → STORY-091. Este diseño solo fija el **contrato** que STORY-091 consume (ver "Interfaces / contratos").
- Reglas de RED sin tests nuevos y de archivos fuera de la lista blanca → STORY-092.
- Señal de rework para rechazos de `story-verify` y `story-acceptance`.
- Archivar rondas anteriores de `fix-directives.md` / `code-review-report.md`.
- Añadir `evals/evals.json` completo a `story-implement-tasks` (solo se añade el caso que cubre AC-6; ver D7).

## Decisions

### D1 — La ronda vive en el frontmatter de `fix-directives.md` (`round: N`), no en `story.md` ni en un artefacto nuevo

`// satisface: AC-4, AC-5`

**Elegida:** campo `round: {{ROUND}}` en el frontmatter de `fix-directives-template.md`, escrito exclusivamente por `story-code-review` en el Paso 4f.

**Alternativas rechazadas:**
- *Campo `rework:`/`round:` en `story.md`* — cambia el esquema del frontmatter de historia (principio 8 de la constitución), obliga a anotar un escritor nuevo en `story-template.md` (principio 13) y viola AC-4 ("ningún campo `rework:` en `story.md`").
- *Contar rondas desde el historial git (`git log -- fix-directives.md`)* — depende de que el usuario haya commiteado cada ronda y de que git esté disponible; el framework no exige commits entre rondas.
- *Artefacto `rework-log.md` acumulativo* — introduce un artefacto más que mantener y solapa con `ReworkEvent`, que ya modela origen + ronda en el dominio; el histórico de rondas vive en git (el repositorio como sistema, principio 1).

### D2 — `round` = ronda previa leída del `fix-directives.md` existente + 1; ausente o ilegible ⇒ se trata como 0

`// satisface: AC-1, AC-2, AC-5, NFR-4`

**Elegida:** antes de sobreescribir en el Paso 4f, `story-code-review` lee el frontmatter del `fix-directives.md` existente y extrae `round`. Si el archivo no existe, o existe sin `round`, o el valor no es un entero ≥ 1 → `$PREV_ROUND = 0`. `$ROUND = $PREV_ROUND + 1`.

**Alternativas rechazadas:**
- *Detener con error si `fix-directives.md` existe sin `round`* — rompe el fixture real STORY-090 (archivo legado sin `round`) y cualquier historia generada antes de esta versión. La tolerancia es una degradación controlada (P7).
- *Detectar "sin cambios reales" para no incrementar la ronda* — exigiría diffear hallazgos entre reportes; la historia lo descarta explícitamente. `round` cuenta ejecuciones cerradas en `needs-changes`, sin más semántica.

### D3 — El ejecutor nombrado es siempre `/story-implement`; `/story-implement-tasks` se menciona solo si existe `tasks.md`

`// satisface: AC-1, AC-2`

**Elegida:** `story-code-review` calcula `$TASKS_EXISTS` en el Paso 4g y emite, tanto en la confirmación de 4g como en el resumen del Paso 7, la línea `→ Ejecuta /story-implement <story_id>` y, condicionalmente, `   Alternativa (tasks.md presente): /story-implement-tasks <story_id>`. Ningún ejecutor se invoca automáticamente.

**Alternativas rechazadas:**
- *Mencionar siempre ambos ejecutores* — con historias sin `tasks.md` remite a un skill que fallaría en su gate 2c; contradice AC-2.
- *Invocar automáticamente al ejecutor* — el rechazo devuelve la historia a una cola (`READY-FOR-IMPLEMENT`) precisamente porque nadie la está trabajando; arrancar el rework rompe el WIP limit del buffer y la medición del tiempo de cola (AC-4).
- *Skill `story-fix` dedicado* — duplicaría `story-implement`; descartado en la historia y en el ADR (NFR-2).

### D4 — `story-code-review` no escribe en `tasks.md`: se elimina el sub-paso 4g.1 completo

`// satisface: AC-1, AC-6, NFR-4`

**Elegida:** el Paso 4g pasa a contener únicamente el retroceso de `story.md` (antiguo 4g.2) y el cálculo de `$TASKS_EXISTS` para el mensaje. `tasks.md` vuelve a ser propiedad exclusiva de `story-tasking` (generación) y de los skills de implementación (marcado `[x]`).

**Alternativas rechazadas:**
- *Mantener la escritura solo cuando `tasks.md` existe* — es el as-is; deja dos caminos de corrección divergentes según exista o no el archivo, y la escritura no es idempotente (cada ronda añade una línea más).
- *Escribir la tarea con un ID sintético (`T-FIX-N`)* — sigue acoplando el rework a `tasks.md` y obliga a `story-tasking` a conocer IDs que no generó.

### D5 — `story-implement-tasks` aplica `fix-directives.md` como pre-paso por presencia del archivo; el literal de tarea queda como compatibilidad hacia atrás sin re-aplicación

`// satisface: AC-6`

**Elegida:**
1. Nuevo sub-paso **2f "Aplicar correcciones de fix-directives.md"** (después de 2e, que ya pone `story.md` en `IMPLEMENT/IN-PROGRESS`), ejecutado una sola vez si `fix_directives_existe = true`. Reutiliza sin cambios el sub-paso 2 ("Leer y aplicar correcciones") del sub-flujo actual. Registra `$FIX_DIRECTIVES_APPLIED = true`.
2. El **gate de salida anticipada de 2c** se condiciona: solo termina sin modificar archivos si `N_pendientes = 0 AND N_completadas > 0 AND fix_directives_existe = false`. Con `fix_directives_existe = true` y sin tareas pendientes, el flujo ejecuta 2e → 2f → Paso 4 (reporte y `IMPLEMENT/DONE`), sin entrar al bucle de tareas.
3. En el Paso 3c, la detección del literal `"implementar fix-directives.md"` se conserva **solo** para `tasks.md` legados que ya contienen la línea (caso STORY-090): la tarea se marca `[x]` en 3d con la nota `aplicado en pre-paso 2f`, sin volver a aplicar correcciones. La nota D-3 de STORY-067 se reescribe para reflejar que el literal ya no es el disparador.
4. El sub-flujo deja de tener el "Sub-paso 1 — Verificar existencia" (la existencia es la condición de entrada de 2f).

**Alternativas rechazadas:**
- *Insertar una tarea sintética en memoria al inicio del bucle* — reintroduce el concepto de "tarea de corrección" que AC-6 y D4 eliminan y complica el cálculo de `N_pendientes`/progreso.
- *Eliminar por completo la rama del literal* — dejaría la línea legada de STORY-090 (y de cualquier `tasks.md` generado por la versión anterior) como tarea TDD estándar, que intentaría generar un test para "Implementar fix-directives.md". La rama de compatibilidad cuesta tres líneas y desaparece cuando no queden `tasks.md` legados.
- *Aplicar las correcciones dentro del Paso 4 (tras las tareas)* — las correcciones de un review deben aplicarse antes de completar tareas pendientes que podrían depender de ellas; y en el caso típico (todas las tareas `[x]`) el Paso 3 ni se ejecuta.

### D6 — El template `fix-directives-template.md` nombra al ejecutor y describe el estado de salida real; sin anotación `escritor:` en el asset del skill

`// satisface: AC-1, AC-3, NFR-1`

**Elegida:** frontmatter con `round: {{ROUND}}`; sección "Ciclo de corrección" reescrita: (1) ejecuta `/story-implement {{STORY_ID}}` (o `/story-implement-tasks {{STORY_ID}}` si hay `tasks.md`); (2) los cambios se limitan a la lista blanca; (3) re-ejecuta `/story-code-review {{STORY_ID}}`; (4) si `approved`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`. Se añade una línea "Ronda: {{ROUND}}" al "Resumen de bloqueantes". Los dos `examples/*/fix-directives.md` se regeneran con la misma estructura (`round: 1`).

**Alternativas rechazadas:**
- *Anotar `# escritor: story-code-review` junto a `round` en el asset* — el principio 13 aplica a `$SPECS_BASE/templates/`; este template es un asset de skill que se instancia sustituyendo placeholders y copiaría el comentario al documento generado, salvo que el skill añadiera lógica de limpieza. El escritor queda declarado en el `SKILL.md` (Paso 4f y sección "Salida") y en la historia.
- *Mantener el paso "avanza a READY-FOR-VERIFY"* — estado inexistente; el estado real tras `approved` es `CODE-REVIEW/DONE` (Paso 6 del skill).

### D7 — Evals primero (principio 11): `story-code-review/evals/evals.json` se actualiza y amplía; `story-implement-tasks` recibe un `evals/evals.json` mínimo con el caso AC-6

`// satisface: AC-1, AC-2, AC-3, AC-6`

**Elegida:**
- `story-code-review`: en `needs-changes-hallazgo-high-genera-fix-directives` mover `"Implementar fix-directives.md"` de `contains` a `not_contains` y añadir `"round: 1"`, `"→ Ejecuta /story-implement"` a `contains`; nuevo caso `needs-changes-segunda-ronda-incrementa-round` (input con `fix-directives.md` previo `round: 1` y `tasks.md`; expected `round: 2`, `/story-implement-tasks`); nuevo caso `needs-changes-sin-tasks-md-no-menciona-implement-tasks` (sin `tasks.md`; `not_contains: "/story-implement-tasks"`); nuevo caso `approved-elimina-fix-directives-previo` (AC-3). Los casos existentes de `approved` mantienen `fix-directives.md` en `not_contains`.
- `story-implement-tasks`: crear `evals/evals.json` con el caso `fix-directives-presente-sin-literal-aplica-correcciones` (input: `READY-FOR-IMPLEMENT/DONE`, `tasks.md` todo `[x]` sin el literal, `fix-directives.md` con 1 hallazgo; expected: correcciones aplicadas, `IMPLEMENT/DONE`, `tasks.md` sin líneas nuevas) y el caso `tasks-md-legado-con-literal-no-reaplica` (compatibilidad D5.3).

**Alternativas rechazadas:**
- *Verificar solo con los `examples/`* — los examples no son ejecutables por `skill-test-evals` (`verify.eval.required: true` en `sddf.config.yaml`).
- *Crear el `evals.json` completo de `story-implement-tasks`* — fuera de alcance; se añaden solo los casos que esta historia introduce.

### D8 — Documentación y decisión transversal: ADR-0008 `ACCEPTED`, dominios sin `REWORK`, épica realineada, guía de pipeline con sección post-review

`// satisface: NFR-1, NFR-2, NFR-3`

**Elegida:**
- `docs/adr/ADR-0008-rework-sin-estado-propio.md` según `adr-template.md`, `status: ACCEPTED`, `supersedes: null`, `superseded-by: null`; registra el descarte de `NEEDS-CHANGES` (propuesta de EPIC-19 Escenario 3), el descarte de substatus `REWORK` y de campo `rework:`, y la elección "señal = artefacto". Fila nueva en la tabla de `docs/adr/README.md`.
- `domain-story-lifecycle.md`: solo el glosario "Rework" (l. 34) añade "la señal de que una historia está en rework es la presencia del artefacto de fallo en su directorio (`fix-directives.md` para `CODE-REVIEW`); no existe estado ni substatus de rework". Invariante 6, diagrama y tabla 4.3 intactos.
- `domain-state-management.md` §5.3: la viñeta l. 113 pasa a "El skill de implementación detecta el rework por la existencia del artefacto de fallo en el directorio del work item, no por un subestado".
- `epic.md` EPIC-19: bullet STORY-089 (texto y wikilink al slug nuevo), Escenario 3 (`NEEDS-CHANGES` → `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md`; ejecutor `/story-implement`), dependencia crítica y riesgo (rutas `docs/domains/domain-story-lifecycle.md` + `docs/guides/sddf-commands-pipeline.md`; riesgo reformulado: "`story-implement` solo reconoce `fix-directives.md`; los rechazos de `story-verify`/`story-acceptance` siguen sin ejecutor automático"), `updated: 2026-09-11`. Criterio de éxito 4 (l. 110) sin cambios.
- `sddf-commands-pipeline.md`: nueva sección "4. Pipeline de implementación y ciclo de corrección post-review" con la secuencia `story-implement → story-code-review → (needs-changes) → story-implement → story-code-review → approved`.
- `README.md`: la línea 406 añade "(round N; señal de rework)" y la l. 412 apunta a `docs/domains/domain-story-lifecycle.md` en lugar de `docs/guides/state-machine.md` (ver CR-001). `docs/domains/README.md` l. 64 idem (drive-by ya decidido en `plan.md`).
- `CHANGELOG.md`: entrada `[Unreleased]` → "Changed: `story-code-review` deja de escribir en `tasks.md`, nombra al ejecutor y numera rondas (`round`); `story-implement-tasks` aplica `fix-directives.md` por presencia; nuevo ADR-0008".

**Alternativas rechazadas:**
- *ADR en `PROPOSED`* — la decisión ya está tomada con el usuario y esta historia la implementa; un ADR `PROPOSED` no sería vinculante para STORY-091/092, que dependen de él.
- *Superseder ADR-0003/ADR-0006* — el workflow canónico de story no cambia (mismos estados, mismas transiciones); ADR-0008 solo restringe cómo se señala el rework.
- *Actualizar `story-implement/SKILL.md` l. 49 en esta historia* — es parte del gate de estado de STORY-091; tocarlo aquí dejaría el skill describiendo un modo rework que aún no existe.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `story-code-review` — Objetivo, Posicionamiento, tabla de estados, Pasos 4f, 4g, 7 y sección "Salida" | modificar | `skills/story-code-review/SKILL.md` | AC-1, AC-2, AC-3, AC-5, NFR-4 |
| Template `fix-directives-template.md` — `round`, "Ronda", "Ciclo de corrección" | modificar | `skills/story-code-review/assets/fix-directives-template.md` | AC-1, AC-3, AC-5, NFR-1 |
| Ejemplos `fix-directives.md` (2) | modificar | `skills/story-code-review/examples/example-needs-changes/fix-directives.md`, `skills/story-code-review/examples/example-needs-changes-medium/fix-directives.md` | NFR-1 |
| Evals de `story-code-review` | modificar | `skills/story-code-review/evals/evals.json` | AC-1, AC-2, AC-3 |
| Skill `story-implement-tasks` — 2c (gate), nuevo 2f, 3c (literal legado), nota D-3, Posicionamiento l. 42 | modificar | `skills/story-implement-tasks/SKILL.md` | AC-6 |
| Evals de `story-implement-tasks` | crear | `skills/story-implement-tasks/evals/evals.json` | AC-6 |
| ADR-0008 | crear | `docs/adr/ADR-0008-rework-sin-estado-propio.md` | NFR-2 |
| Índice de ADRs | modificar | `docs/adr/README.md` | NFR-2 |
| Dominio ciclo de vida — glosario "Rework" | modificar | `docs/domains/domain-story-lifecycle.md` | AC-4, NFR-1 |
| Dominio gestión de estados — §5.3 | modificar | `docs/domains/domain-state-management.md` | AC-4, NFR-1 |
| Épica EPIC-19 | modificar | `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` | NFR-3 |
| Guía de pipeline — sección 4 | modificar | `docs/guides/sddf-commands-pipeline.md` | NFR-1 |
| README raíz (l. 406, 412) y README de dominios (l. 64) | modificar | `README.md`, `docs/domains/README.md` | NFR-1, CR-001 |
| CHANGELOG | modificar | `CHANGELOG.md` | NFR-1 |
| Copia instalada de skills | refrescar (`scripts/install.js`) | `.claude/skills/` (ignorado por git) | — (operativo) |

Componentes **no** tocados por esta historia: `skills/story-implement/SKILL.md` (STORY-091), `docs/templates/story-template.md` (el escritor `story-code-review` ya figura en `status`), `skills/story-tasking/`.

## Interfaces / contratos

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| **Señal de rework** (`story-code-review` → `story-implement`, `story-implement-tasks`) | Existe `$STORY_DIR/fix-directives.md` ⇔ la historia tiene correcciones pendientes de un `needs-changes`. Creado/sobreescrito solo en `needs-changes`; eliminado solo en `approved`. Ningún otro skill lo crea ni lo borra. | AC-3, AC-4 |
| **Frontmatter de `fix-directives.md`** | `type: fix-directives`, `story`, `title`, `review-status: needs-changes`, `date`, `max-severity`, `based-on`, **`round: <entero ≥ 1>`**. Escritor único de todos los campos: `story-code-review` (Paso 4f). | AC-5 |
| **Cálculo de ronda** (`story-code-review` Paso 4f) | Entrada: `$STORY_DIR/fix-directives.md` (opcional). Salida: `$ROUND = (round del archivo existente si es entero ≥ 1, si no 0) + 1`. | AC-2, AC-5 |
| **Mensaje de cierre en `needs-changes`** (`story-code-review` Pasos 4g y 7) | Líneas obligatorias: `📋 Estado: <id> → READY-FOR-IMPLEMENT/DONE`, `🔁 Ronda de corrección: <N>`, `→ Ejecuta /story-implement <id>`. Línea condicional (`$TASKS_EXISTS = true`): `   Alternativa (tasks.md presente): /story-implement-tasks <id>`. Se retira `Ejecuta /story-code-review <id> nuevamente tras corregir los hallazgos`. | AC-1, AC-2 |
| **Escritura en `tasks.md`** | `story-code-review` no escribe en `tasks.md` bajo ninguna condición. Escritores de `tasks.md`: `story-tasking` (contenido), `story-implement-tasks` (marcas `[x]`/`[~]`). | AC-1, AC-6 |
| **Pre-paso 2f de `story-implement-tasks`** | Entrada: `fix_directives_existe = true`. Lee la tabla "Instrucciones de corrección" (`#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`) y "Lista blanca de archivos permitidos para modificar". Salida: correcciones aplicadas, `$FIX_DIRECTIVES_APPLIED = true`, sección "Correcciones de fix-directives.md (ronda N)" en `implement-report.md`. No modifica `tasks.md` ni `fix-directives.md`. | AC-6 |
| **Gate 2c de `story-implement-tasks`** | Termina sin modificar archivos solo si `N_pendientes = 0 AND N_completadas > 0 AND fix_directives_existe = false`. | AC-6 |
| **Contrato hacia STORY-091** (`story-implement`) | STORY-091 detecta el rework exclusivamente por la existencia de `fix-directives.md`, lee `round` para anunciar `🔁 Modo rework (ronda N)` y consume la lista blanca. Precondición de estado que debe aceptar: `READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`. Esta historia no añade campos adicionales al artefacto. | AC-4, AC-5 |

## Flujos clave

**Flujo 1 — Rechazo (AC-1, AC-2, AC-5):**
```
story-code-review (story.md IMPLEMENT/DONE)
  4d  $REVIEW_STATUS = needs-changes
  4e  $WHITELIST
  4f  $PREV_ROUND ← leer round de $STORY_DIR/fix-directives.md (0 si no existe/ilegible)
      $ROUND = $PREV_ROUND + 1
      instanciar fix-directives-template.md con round: $ROUND → sobreescribir fix-directives.md
  4g  story.md → READY-FOR-IMPLEMENT/DONE
      $TASKS_EXISTS ← existe $STORY_DIR/tasks.md
      (sin escritura en tasks.md)
  5   code-review-report.md
  7   resumen: ronda $ROUND, "→ Ejecuta /story-implement <id>" [+ alternativa si $TASKS_EXISTS]
```

**Flujo 2 — Aprobación tras rework (AC-3):**
```
story-code-review (story.md IMPLEMENT/DONE, fix-directives.md round: N presente)
  4d  $REVIEW_STATUS = approved
  4h  eliminar fix-directives.md  → "🗑️ fix-directives.md eliminado (revisión anterior superada)"
  5–6 code-review-report.md; story.md → CODE-REVIEW/DONE
```
(Sin cambios respecto al as-is; se documenta como contrato y se cubre con un eval nuevo.)

**Flujo 3 — Corrección con `story-implement-tasks` (AC-6):**
```
story-implement-tasks (story.md READY-FOR-IMPLEMENT/DONE, fix-directives.md presente)
  1d  gate de estado OK
  2c  N_pendientes, N_completadas, fix_directives_existe = true → NO salida anticipada
  2e  story.md → IMPLEMENT/IN-PROGRESS
  2f  aplicar correcciones de fix-directives.md (una vez) → $FIX_DIRECTIVES_APPLIED
  3   bucle de tareas pendientes (si las hay); literal legado → marcar [x] sin re-aplicar
  4   implement-report.md (+ sección "Correcciones de fix-directives.md (ronda N)"); story.md → IMPLEMENT/DONE
  →   sugerir /story-code-review <id>
```

**Flujo 4 — Ciclo completo sin edición manual (smoke de la épica):**
`IMPLEMENT/DONE → needs-changes (round 1) → READY-FOR-IMPLEMENT/DONE → /story-implement[-tasks] → IMPLEMENT/DONE → /story-code-review → approved → CODE-REVIEW/DONE` (fix-directives.md eliminado).

## Decisiones de complejidad justificada

- **Rama de compatibilidad para el literal de tarea (D5.3):** una solución más simple (borrar la rama) rompería los `tasks.md` ya generados con la línea `- [ ] Implementar fix-directives.md` (STORY-090 hoy). Coste: tres líneas en el Paso 3c; se retira cuando no queden `tasks.md` legados.
- **Tolerancia a `fix-directives.md` sin `round` (D2):** fallar sería más simple, pero el fixture real STORY-090 es un archivo legado; tratar el valor ausente como 0 hace el cambio retrocompatible sin migración.
- **Condicionar el gate 2c (D5.2):** sin esta condición el caso más frecuente de rework con `tasks.md` (todas las tareas `[x]`) nunca aplicaría las correcciones. Es un `AND` adicional, no un modo nuevo.
- **ADR nuevo en lugar de una nota en la épica (D8):** la decisión afecta a tres skills y restringe STORY-091/092; la constitución §16 exige ADR en ese caso.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `needs-changes` sin `fix-directives.md` previo genera `round: 1`, no toca `tasks.md`, mensaje `→ Ejecuta /story-implement <id>` | Eval `needs-changes-hallazgo-high-genera-fix-directives` (modificado) | AC-1, AC-5 |
| 2 | `needs-changes` con `round: 1` previo genera `round: 2`; con `tasks.md` presente menciona `/story-implement-tasks` | Eval `needs-changes-segunda-ronda-incrementa-round` (nuevo) | AC-2 |
| 3 | `needs-changes` sin `tasks.md` no menciona `/story-implement-tasks` | Eval `needs-changes-sin-tasks-md-no-menciona-implement-tasks` (nuevo) | AC-2 |
| 4 | `approved` con `fix-directives.md` previo lo elimina y deja `CODE-REVIEW/DONE` | Eval `approved-elimina-fix-directives-previo` (nuevo) | AC-3 |
| 5 | `fix-directives.md` legado sin `round` produce `round: 1` (no error) | Fixture STORY-090: `/story-code-review STORY-090` tras un `/story-implement-tasks STORY-090` | AC-5, D2 |
| 6 | `story-implement-tasks` aplica correcciones con `tasks.md` todo `[x]` y sin literal | Eval `fix-directives-presente-sin-literal-aplica-correcciones` (nuevo) | AC-6 |
| 7 | `tasks.md` legado con el literal no re-aplica correcciones y marca `[x]` | Eval `tasks-md-legado-con-literal-no-reaplica` (nuevo) + fixture STORY-090 | AC-6, D5 |
| 8 | `grep -rn "Implementar fix-directives.md" skills/story-code-review/` devuelve 0 resultados; `grep -rn "READY-FOR-VERIFY" skills/story-code-review/` devuelve 0 | Inspección (`grep`) | AC-1, NFR-1 |
| 9 | `grep -n "NEEDS-CHANGES\|knowledge/guides/state-machine" docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` devuelve 0; `grep -n "REWORK" docs/domains/domain-state-management.md` devuelve 0 | Inspección (`grep`) | NFR-1, NFR-3 |
| 10 | `docs/adr/ADR-0008-rework-sin-estado-propio.md` existe, `status: ACCEPTED`, cita EPIC-19 Escenario 3 y `NEEDS-CHANGES`; fila en `docs/adr/README.md` | Inspección | NFR-2 |
| 11 | Re-ejecutar `/story-code-review` en `needs-changes` solo cambia `fix-directives.md` (`round`+1), `code-review-report.md` y `story.md`; `git status` no muestra `tasks.md` | Fixture STORY-090 + `git status` | NFR-4 |
| 12 | `skill-test-evals` sobre `story-code-review` y `story-implement-tasks` pasa (`verify.eval.required: true`) | `npm run test:eval` / `/skill-test-evals` | AC-1..AC-6 |

## Risks / Trade-offs

- **[`tasks.md` legados con la línea de corrección en otras historias]** → la rama de compatibilidad D5.3 los procesa sin re-aplicar; el contrato 7 lo verifica. Si aparece una grafía distinta del literal, cae al TDD estándar (degradación ya existente de D-3/STORY-067).
- **[Historias en rework de `story-verify`/`story-acceptance` sin señal reconocible]** → fuera de alcance declarado; el ADR-0008 y el riesgo reformulado de la épica lo dejan registrado como deuda para una historia posterior.
- **[`round` parseado de un frontmatter editado a mano]** → D2 trata cualquier valor no entero como 0 y reinicia en 1; se pierde la cuenta pero no se bloquea el pipeline. El histórico completo vive en git.
- **[STORY-091 aún no existe cuando esta historia entra en DELIVER]** → el mensaje `→ Ejecuta /story-implement <id>` remite a un skill que todavía ejecuta el ciclo TDD completo (sin modo rework). Mitigación: el mensaje es correcto (el skill existe y acepta `READY-FOR-IMPLEMENT/DONE`); la historia declara el orden 089 → 091 → 092 y `story-implement-tasks` ya cubre el rework con `tasks.md` desde esta historia.
- **[Cadena de documentación larga (9 archivos de docs)]** → cada cambio es de una a tres líneas salvo el ADR y la sección nueva de la guía; el contrato 9 los verifica con `grep`.
- **[Copia instalada `.claude/skills/` desactualizada tras el cambio]** → refrescar con `scripts/install.js`; sin ello los evals ejecutarían la versión anterior del skill.

## Open Questions

Ninguna. Las decisiones pendientes se resolvieron en `plan.md` con el usuario (sin estado nuevo, destino `READY-FOR-IMPLEMENT/DONE`, señal por artefacto, ejecutor `story-implement`).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `README.md` l. 412 referencia `docs/guides/state-machine.md` y `docs/domains/README.md` l. 64 referencia `docs/wiki/state-machine.md`; ninguna de las dos rutas existe (el mismo enlace roto que la historia detecta en `epic.md`). Ambas referencias describen el ciclo de vida que esta historia documenta.
- **Documento afectado**: design.md (componentes afectados) / story.md (no requiere cambio: el NFR "README.md refleja el flujo post-review" lo cubre)
- **Acción requerida**: en el mismo pase de documentación, apuntar ambas referencias a `docs/domains/domain-story-lifecycle.md` (drive-by ya acordado en `plan.md` §3 para `docs/domains/README.md`; se extiende a `README.md`).

### CR-002
- **Tipo**: dependencia
- **Descripción**: `skills/story-implement-tasks/` no tiene `evals/evals.json`, por lo que AC-6 no puede verificarse con `skill-test-evals` sin crearlo. La historia no lo menciona.
- **Documento afectado**: design.md (D7) / tasks.md
- **Acción requerida**: crear `skills/story-implement-tasks/evals/evals.json` con los dos casos de D7 (evals antes del `SKILL.md`, principio 11). No se cubre el resto del skill.
