---
type: plan
slug: plan
title: STORY-089 — Análisis y propuesta de cambio
---

# STORY-089 — Análisis y propuesta de cambio

## Contexto

STORY-089 está en `SPECIFY/IN-PROGRESS` con solo el Como/Quiero/Para escrito. Tal como está redactada (y como la describe EPIC-19 en Escenario 3, dependencias y riesgos) pide **un estado propio de corrección (`NEEDS-CHANGES`)**. Los argumentos aportados por el usuario (FIX no es una actividad distinta de IMPLEMENT; duplica `story-implement`; fragmenta métricas; colisiona con "bug fix"; en TBD el rework se queda en la misma rama; complejidad extra en el state machine) llevan a la conclusión contraria: **no crear estado nuevo; el rework vive dentro de `IMPLEMENT`**.

### Diagnóstico del as-is (verificado en el repo)

| Pieza | Comportamiento actual | Problema |
|---|---|---|
| [skills/story-code-review/SKILL.md](skills/story-code-review/SKILL.md) 4g.2 / Paso 7 | `needs-changes` → genera `fix-directives.md`, añade `- [ ] Implementar fix-directives.md` a `tasks.md` **solo si existe**, y retrocede `story.md` a `READY-FOR-IMPLEMENT/DONE`. El mensaje final dice "Ejecuta /story-code-review nuevamente tras corregir" | No nombra ejecutor de correcciones. Devuelve la historia al **buffer** (WIP, "esperando capacidad") cuando en realidad es trabajo activo. |
| [skills/story-implement/SKILL.md](skills/story-implement/SKILL.md) | Línea 49 declara precondición de reanudación `IMPLEMENT/IN-PROGRESS ← viene de story-code-review needs-changes`, pero **no hay gate de estado**, **no lee `fix-directives.md`** y siempre ejecuta RED→GREEN→REFACTOR completo desde `testcases.md` | Contradice lo que escribe `story-code-review` (`READY-FOR-IMPLEMENT/DONE`). Sin `tasks.md` no existe ningún camino de corrección → esto es el "sin depender de tasks.md" de la historia. Caso vivo: STORY-090 está hoy en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md`. |
| [skills/story-implement-tasks/SKILL.md](skills/story-implement-tasks/SKILL.md) 2c / sub-flujo | Detecta `fix_directives_existe` pero el sub-flujo se dispara **por el literal de tarea** `"implementar fix-directives.md"` en `tasks.md` (D-3 de STORY-067) | Acoplado a `tasks.md`. |
| [skills/story-code-review/assets/fix-directives-template.md](skills/story-code-review/assets/fix-directives-template.md) | "Ciclo de corrección" no nombra ejecutor y cita un estado inexistente (`READY-FOR-VERIFY`) | Vocabulario desalineado. |
| [docs/domains/domain-story-lifecycle.md](docs/domains/domain-story-lifecycle.md) inv. 6 / [docs/domains/domain-state-management.md](docs/domains/domain-state-management.md) §5.3 | Inv. 6: "todos los retrocesos apuntan a `READY-FOR-IMPLEMENT/DONE`". §5.3: "el skill detecta el rework por el subestado `REWORK` o por la existencia de un reporte de fallo" — pero `REWORK` no está en el conjunto cerrado de substatus (inv. 2) | Los propios dominios ya son inconsistentes entre sí. |
| [docs/specs/02-epics/EPIC-19-framework-consistency/epic.md](docs/specs/02-epics/EPIC-19-framework-consistency/epic.md) | Escenario 3, dependencia y riesgo hablan de `NEEDS-CHANGES` y de `docs/knowledge/guides/state-machine.md` (ruta que no existe; `docs/index.md` apunta a `guides/state-machine.md`, que tampoco existe) | Hay que realinear la épica con la decisión. |

### Decisiones tomadas (con el usuario)

1. **Sin estado nuevo y sin cambiar el destino del rechazo.** `needs-changes` sigue dejando `story.md` en `READY-FOR-IMPLEMENT/DONE`: es una cola de espera real (nadie está trabajando tras el rechazo; humano o agente pueden estar en otra cosa), respeta el WIP limit del buffer, mide el tiempo de espera del rework como tiempo de cola, y mantiene coherentes los tres gates (`story-code-review`, `story-verify`, `story-acceptance`) y la invariante 6 de `domain-story-lifecycle.md`. El argumento TBD (arg. 5) rechaza un estado `FIX`, no el paso por el buffer. `IMPLEMENT/IN-PROGRESS` lo sigue escribiendo `story-implement` al arrancar — el momento real en que alguien toma la historia.
2. **Señal de rework = presencia de `fix-directives.md`** (estrategia 3), independiente del estado. Sin cambios de esquema en `story.md`. La ronda se registra en el frontmatter de `fix-directives.md` (`round: N`, escritor: `story-code-review`), cumpliendo el principio 13 de la constitución.
3. **Ejecutor de correcciones = `story-implement`** (en modo rework), y `story-implement-tasks` como alternativa si hay `tasks.md`. No se crea skill `story-fix`.
4. **Corrección colateral:** la línea 49 de `story-implement` ("IMPLEMENT/IN-PROGRESS ← viene de story-code-review needs-changes") es falsa hoy y se corrige: la reanudación desde `IMPLEMENT/IN-PROGRESS` corresponde a DoD-ERRORs o ciclo interrumpido; el rework llega desde `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md`.

## Cambios a realizar (esta historia está en SPECIFY: el entregable es la especificación)

### 1. Reescribir [docs/specs/03-stories/STORY-089-story-fix-post-code-review/story.md](docs/specs/03-stories/STORY-089-story-fix-post-code-review/story.md)

Seguir [docs/templates/story-template.md](docs/templates/story-template.md). Mantener frontmatter (`status: SPECIFY`, `substatus: IN-PROGRESS`, `kind: feat`), actualizar `updated`, añadir `STORY-090-campos-declarados-nombran-su-escritor` y `STORY-067-story-implement-continuar-parcial` a `related`.

**Título:** "Ciclo de corrección con dueño tras un code review rechazado" (sin "estado propio").

**Como/Quiero/Para:**
- Como desarrollador que recibe `needs-changes` de `/story-code-review`
- Quiero que el rechazo devuelva la historia a la cola `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` como única señal de rework, y que el propio mensaje me remita a `/story-implement` para que, al tomarla de la cola, aplique las correcciones en un ciclo TDD acotado a los hallazgos
- Para volver a revisión sin estado nuevo, sin editar el frontmatter a mano y sin depender de `tasks.md`

**Criterios de aceptación (Gherkin):**
- *Escenario principal – Rechazo encola la historia y nombra al ejecutor:* Dado `story.md` en `IMPLEMENT/DONE`, cuando `/story-code-review` cierra en `needs-changes`, entonces `story.md` queda en `READY-FOR-IMPLEMENT/DONE`, existe `fix-directives.md` con `round: N` en su frontmatter, no se escribe ninguna tarea en `tasks.md`, y el mensaje final indica `→ Ejecuta /story-implement <id>` (y `/story-implement-tasks` como alternativa si existe `tasks.md`).
- *Escenario principal – story-implement en modo rework:* Dado `story.md` en `READY-FOR-IMPLEMENT/DONE` y `fix-directives.md` presente (sin `tasks.md`), cuando ejecuto `/story-implement`, entonces el skill pasa `story.md` a `IMPLEMENT/IN-PROGRESS`, anuncia `🔁 Modo rework (ronda N)`, pasa `fix_directives_path` a los test/code generators en RED/GREEN/REFACTOR, restringe los cambios a la lista blanca de `fix-directives.md`, añade una sección "Ciclo de corrección — ronda N" a `implement-report.md`, deja `story.md` en `IMPLEMENT/DONE` y sugiere `/story-code-review`.
- *Escenario alternativo – Ejecución inicial sin fix-directives.md:* Dado `READY-FOR-IMPLEMENT/DONE` y sin `fix-directives.md`, cuando ejecuto `/story-implement`, entonces el ciclo TDD es el de hoy (sin cambios de comportamiento).
- *Escenario alternativo – Reanudación desde IMPLEMENT/IN-PROGRESS:* Dado `story.md` en `IMPLEMENT/IN-PROGRESS` (DoD-ERRORs o ciclo interrumpido) con o sin `fix-directives.md`, cuando ejecuto `/story-implement`, entonces se acepta la precondición y el modo (rework o normal) lo decide únicamente la presencia de `fix-directives.md`.
- *Escenario alternativo – Estado inválido:* Dado `story.md` en `CODE-REVIEW/DONE` (u otro estado no admitido), cuando ejecuto `/story-implement`, entonces se detiene con error descriptivo sin modificar archivos (gate espejo del 1d de `story-implement-tasks`).
- *Escenario alternativo – Aprobación limpia la señal:* Dado `fix-directives.md` de una ronda anterior, cuando `/story-code-review` cierra en `approved`, entonces `fix-directives.md` se elimina (comportamiento 4h existente) y `story.md` queda en `CODE-REVIEW/DONE`.
- *Escenario – Ciclo completo sin edición manual (smoke de la épica):* `IMPLEMENT/DONE` → `needs-changes` → `READY-FOR-IMPLEMENT/DONE` → `/story-implement` → `IMPLEMENT/DONE` → `/story-code-review` → `approved`, sin tocar el frontmatter a mano.

**Requerimientos:**
- *Modo rework en story-implement:* detección = `fix-directives.md` existe en `$STORY_DIR`, independiente del estado. Precondición de estado: `READY-FOR-IMPLEMENT/DONE` (inicial o rework encolado) o `IMPLEMENT/IN-PROGRESS` (reanudación). GREEN/REFACTOR reciben `fix_directives_path` y `whitelist` en el bundle de contexto.
- *RED en rework con 0 archivos:* es **error** si algún hallazgo bloqueante tiene `Dimensión = requirements-coverage` (un AC no cubierto siempre es testeable); es **advertencia** en el resto de dimensiones (code-quality, integration-architecture, security, DoD-CODE-REVIEW). La regla usa la columna `Dimensión` que ya existe en la tabla — no interpreta el texto del hallazgo.
- *Archivos fuera de la lista blanca:* si un generator reporta en `files_generated`/`files_modified` un archivo ausente de la lista blanca: en `$EXEC_MODE = interactive` → mostrar la lista y pedir confirmación (`n` detiene sin modificar `story.md`); en `--auto` → permitir y registrar en `implement-report.md` una subsección "Archivos fuera de lista blanca" para que la siguiente ronda de `story-code-review` los vea. Coherente con el uso real: el `fix-directives.md` de STORY-090 ya añade "Destino de las acciones requeridas" fuera de la lista derivada.
- *`story-implement-tasks`:* el sub-flujo de fix-directives se dispara por la presencia del archivo (ya calcula `fix_directives_existe`), no por el literal de tarea; `story-code-review` deja de escribir la tarea en `tasks.md`.
- *Precedencia entre ejecutores:* ninguno se ejecuta automáticamente. El mensaje de `story-code-review` recomienda `/story-implement`; menciona `/story-implement-tasks` solo si existe `tasks.md`. Si el usuario ejecuta ambos, el segundo encuentra las correcciones ya aplicadas (idempotencia); solo `story-code-review` elimina la señal.
- *`round`:* = número de ejecuciones de `story-code-review` que cierran en `needs-changes` para la historia (ronda previa + 1, leída del `fix-directives.md` existente; 1 si no existe). No se intenta detectar "sin cambios reales" — exigiría diffear hallazgos.
- *Sin estado nuevo:* ni `NEEDS-CHANGES`, ni `FIX`, ni substatus `REWORK`, ni campo `rework:` en `story.md`. El destino del rechazo (`READY-FOR-IMPLEMENT/DONE`) no cambia.

**Criterios no funcionales:**
- Documentación: `domain-story-lifecycle.md` (glosario "Rework": añadir que la señal es el artefacto de fallo; inv. 6 y diagrama se mantienen), `domain-state-management.md` §5.3 (quitar mención a substatus `REWORK`; señal = artefacto), `sddf-commands-pipeline.md`, README/CHANGELOG.
- ADR nuevo (`ADR-0008-rework-sin-estado-propio.md`): cita explícitamente que `NEEDS-CHANGES` era la propuesta de EPIC-19 (Escenario 3) y queda descartada; registra por qué el rechazo vuelve al buffer y por qué `fix-directives.md` es la señal. No supersede ADR-0003.
- Idempotencia: re-ejecutar `/story-code-review` en `needs-changes` sobreescribe `fix-directives.md` e incrementa `round`; re-ejecutar `/story-implement` con correcciones ya aplicadas no produce cambios.
- Trazabilidad: el tiempo en cola tras un rechazo queda medible como tiempo en `READY-FOR-IMPLEMENT`; el histórico de rondas vive en git (el repo es la fuente de verdad) y en `round`.

**Fuera de alcance:**
- `story-verify` y `story-acceptance`: ya retroceden a `READY-FOR-IMPLEMENT/DONE`, pero `story-implement` **no** reconoce sus reportes de fallo (`verify-report.md` con criterios fallidos, `acceptance-report.md` con `REJECTED`). El modo rework de esta historia cubre **solo** rechazos de `story-code-review`; la señal para los otros dos gates se define en una historia posterior.
- Archivar rondas anteriores (`fix-directives.md` y `code-review-report.md`, que hoy también se sobreescribe) en lugar de sobreescribir — seguimiento aplicable a ambos reportes, no solo a uno.
- Skill `story-fix`; cambios en el conjunto de substatus o en el destino de los rechazos.

**Notas:** mapa de archivos a tocar en implementación (ver §3 abajo); el caso vivo STORY-090 como fixture de verificación; aviso explícito de que el modo rework cubre solo code review.

### 2. Alinear [epic.md](docs/specs/02-epics/EPIC-19-framework-consistency/epic.md)

- Descripción y bullet STORY-089: quitar "estado propio" → "sin estado nuevo: el rechazo vuelve a la cola `READY-FOR-IMPLEMENT/DONE` y `fix-directives.md` es la señal de rework que `story-implement` reconoce".
- Escenario 3: `NEEDS-CHANGES` → `READY-FOR-IMPLEMENT/DONE`; ejecutor `/story-implement`.
- Dependencia crítica: reemplazar `docs/knowledge/guides/state-machine.md` (no existe) por `docs/domains/domain-story-lifecycle.md` + `docs/guides/sddf-commands-pipeline.md`; ya no hay estado nuevo que reflejar, solo la señal de rework.
- Riesgo "El estado NEEDS-CHANGES desalinea state-machine.md" → "`story-implement` solo reconoce `fix-directives.md`; los rechazos de `story-verify`/`story-acceptance` siguen sin ejecutor automático" — mitigación: deuda registrada en Notas adicionales para una historia posterior.
- Criterio de éxito 4 se mantiene (ya está formulado sin estado).
- `updated: 2026-09-11`.

### 3. Mapa de implementación (queda en las Notas de la historia; se ejecuta en IMPLEMENT, no ahora)

| Archivo | Cambio |
|---|---|
| `skills/story-code-review/SKILL.md` | 4g.1: eliminar escritura en `tasks.md`. 4g.2: sin cambio de estado (`READY-FOR-IMPLEMENT/DONE`). 4f: `round` = ronda previa + 1 (leer `fix-directives.md` existente). Paso 7 y "Salida": línea `→ Ejecuta /story-implement <id>` (o `/story-implement-tasks` si hay `tasks.md`). Posicionamiento (l. 29–45). |
| `skills/story-code-review/assets/fix-directives-template.md` | Frontmatter `round: {{ROUND}}`; "Ciclo de corrección" nombra `/story-implement` y corrige `READY-FOR-VERIFY` → `CODE-REVIEW/DONE`. |
| `skills/story-code-review/examples/*/fix-directives.md`, `evals/evals.json` | Reflejar `round` y el ejecutor. |
| `skills/story-implement/SKILL.md` | Corregir l. 49 (reanudación ≠ rework). Nuevo Paso 0c (gate de estado + detección rework por `fix-directives.md`; escribe `IMPLEMENT/IN-PROGRESS` al arrancar, como ya hace); bundles RED/GREEN/REFACTOR con `fix_directives_path` y `whitelist`; sección rework en `implement-report.md`; mensaje final; tabla de errores. La nota "tasks.md es del desarrollador" se mantiene. |
| `skills/story-implement-tasks/SKILL.md` | Sub-flujo fix-directives disparado por `fix_directives_existe` en lugar del literal de tarea (D-3 de STORY-067 queda superada). 1d sin cambios. |
| `docs/domains/domain-story-lifecycle.md` | Glosario "Rework" (señal = artefacto). Inv. 6, diagrama y tabla 4.3 sin cambios. |
| `docs/domains/domain-state-management.md` | §5.3: quitar `REWORK`; señal = artefacto de fallo. |
| `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | Flujo post-review. |
| `docs/adr/ADR-0008-rework-sin-estado-propio.md` | Nuevo. |
| `docs/domains/README.md` | Enlace preexistente roto a `docs/wiki/state-machine.md` → apuntar a `domain-story-lifecycle.md` (drive-by en el mismo pase de docs). |
| `docs/templates/story-template.md` l. 8 | Sin cambio (story-code-review ya figura como escritor de `status`). |

## Verificación

1. `story.md` de STORY-089 cumple el template (secciones obligatorias, Gherkin en cada escenario) → ejecutar `/story-evaluation STORY-089` y obtener APROBADA (`SPECIFY/DONE`).
2. `grep -n "NEEDS-CHANGES" docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` devuelve 0 resultados; en `story.md` el término aparece únicamente en "Fuera de alcance"/Notas como opción descartada.
3. `epic.md` sigue referenciando STORY-089 con `[ ]` y el criterio de éxito 4 intacto.
4. (Al implementar) fixture real: STORY-090 ya está en `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` — exactamente el estado de entrada del modo rework; `/story-implement STORY-090` debe anunciar `🔁 Modo rework` sin ningún paso previo.
