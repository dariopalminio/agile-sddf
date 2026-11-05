---
alwaysApply: false
type: design
id: STORY-091
slug: STORY-091-story-implement-modo-rework-design
title: "Design: story-implement toma de la cola una historia rechazada y corrige en modo rework"
date: 2026-09-11
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
related:
  - STORY-091-story-implement-modo-rework
  - STORY-089-rechazo-nombra-ejecutor-correcciones
  - STORY-092-reglas-robustez-modo-rework
  - STORY-067-story-implement-continuar-parcial
---

<!-- Referencias -->
[[STORY-091-story-implement-modo-rework]]
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]
[[STORY-092-reglas-robustez-modo-rework]]

## Context

**Historia origen:** [[STORY-091-story-implement-modo-rework]] (kind: `feat`, épica `EPIC-19-framework-consistency`). Segunda historia del split 089 → 091 → 092: STORY-089 define el emisor del rechazo y el contrato de `fix-directives.md` (`round`, señal por presencia); esta historia hace que `story-implement` sea el ejecutor de correcciones; STORY-092 endurece ese ejecutor (RED sin tests nuevos, archivos fuera de la lista blanca).

**Criterios de aceptación de referencia** (numeración usada en todo el diseño):

| AC | Escenario / requerimiento en `story.md` |
|---|---|
| AC-1 | Escenario principal — `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` (`round: N`) + sin `tasks.md`: `/story-implement` pasa `story.md` a `IMPLEMENT/IN-PROGRESS` al arrancar, anuncia `🔁 Modo rework (ronda N)` antes de RED, RED/GREEN/REFACTOR trabajan sobre los hallazgos y la lista blanca, `implement-report.md` incluye "Ciclo de corrección — ronda N", `story.md` termina en `IMPLEMENT/DONE` con la sugerencia `/story-code-review STORY-NNN` |
| AC-2 | Escenario alternativo — `READY-FOR-IMPLEMENT/DONE` sin `fix-directives.md`: ciclo TDD completo como hoy; sin anuncio de rework ni sección "Ciclo de corrección" |
| AC-3 | Escenario alternativo — estado no admitido (p. ej. `CODE-REVIEW/DONE`): el skill se detiene indicando estado actual y admitidos, sin modificar archivos |
| AC-4 | Requerimiento — precondición de estado: `READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS` (espejo del gate 1d de `story-implement-tasks`); en reanudación el modo lo decide solo la presencia de `fix-directives.md` |
| AC-5 | Requerimiento — ciclo `IMPLEMENT/DONE → needs-changes → READY-FOR-IMPLEMENT/DONE → /story-implement → IMPLEMENT/DONE → /story-code-review → approved → CODE-REVIEW/DONE` sin edición manual del frontmatter (Escenario 3 de EPIC-19) |
| AC-6 | Requerimiento — el modo rework reconoce **solo** `fix-directives.md`; no `verify-report.md` ni `acceptance-report.md` |
| NFR-1 | Coherencia documental: la línea del posicionamiento "IMPLEMENT/IN-PROGRESS ← viene de story-code-review needs-changes" se corrige |
| NFR-2 | Idempotencia: re-ejecutar `/story-implement` con correcciones ya aplicadas no cambia código ni `story.md` |
| NFR-3 | Compatibilidad: STORY-090 (`READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` sin `round`) entra en modo rework sin migración |
| NFR-4 | `tasks.md` sigue sin guiar el pipeline de `story-implement` |

**Estado actual medido sobre el repositorio (2026-09-11):**

- `skills/story-implement/SKILL.md` (844 líneas) — **no tiene gate de estado** ni ningún paso que escriba `IMPLEMENT/IN-PROGRESS` al arrancar, aunque el Posicionamiento (l. 52) lo afirma; las únicas escrituras en `story.md` ocurren en 11c (`IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS` por DoD). La l. 49 declara la precondición de reanudación como "viene de story-code-review needs-changes" (falsa: `story-code-review` deja `READY-FOR-IMPLEMENT/DONE`). No lee `fix-directives.md` en ningún paso. Pasos relevantes: 0b (`$EXEC_MODE`), 3 (bundle base RED: `story_id`, `testcases_path`, `story_path`, `design_path`), 4 (invocación de test_generators con bloque "Contexto de invocación"), 5 (confirmación RED), 6 (`red-phase-status.json`), 9/10 (bundles GREEN/REFACTOR: `story_id`, `phase`, `layer`, `test_files`, `story_path`, `design_path`), 11a–11e (DoD, `implement-report.md`, `story.md`, `epic.md`, `cycle-status.json`, resumen final sin sugerencia de siguiente skill). Tabla "Manejo de errores" (l. 775–806) sin fila de estado inválido. Sección "Arquitectura de delegación" (l. 807) documenta los bundles.
- `skills/story-implement/evals/evals.json` — 9 casos; ninguno cubre gate de estado ni rework. `skills/story-implement/README.md` repite el posicionamiento.
- `skills/story-implement-tasks/SKILL.md` 1d (l. 197–230) — gate de referencia: acepta `READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`; ausencia de `status`/`substatus` ⇒ `SPECIFY/TODO` ⇒ error; mensaje con estado actual, estados admitidos y sugerencias. Este es el patrón a espejar (P3).
- `skills/story-code-review/assets/fix-directives-template.md` — secciones `## Resumen de bloqueantes`, `## Instrucciones de corrección` (tabla `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`), `## Lista blanca de archivos permitidos para modificar` (viñetas `- \`ruta\` — hallazgo #N`), `## Ciclo de corrección`. STORY-089 añade `round` al frontmatter (escritor único `story-code-review`) y la línea "Ronda".
- **Fixture real:** `docs/specs/03-stories/STORY-090-…/fix-directives.md` — sin `round`; su lista blanca tiene dos sublistas (archivos derivados de los hallazgos, con uno anotado "**solo lectura**", y "Destino de las acciones requeridas" con 5 rutas más). Cualquier parser de lista blanca debe aceptar viñetas con texto libre tras la ruta.
- `sddf.config.yaml` — `implement.test_generators`: `eval` → `skill-test-evals` (required); `implement.code_generators`: `monolithic` → `skill-master` (required). Ambos skills viven en `.claude/skills/` (instalados), **no** en `skills/` de este repo: no se pueden modificar desde esta historia. Los subagentes reciben el `SKILL.md` íntegro más un bloque de texto "Contexto de invocación"; cualquier campo adicional del bundle llega como texto y un generator que no lo conozca lo ignora.
- `docs/domains/domain-story-lifecycle.md` invariante 6, tabla 4.3 y `ReworkEvent` (origen + ronda) — sin cambios; ADR-0008 (creado por STORY-089) fija "señal = artefacto".
- `.claude/skills/` es copia instalada e ignorada por git; la fuente editable es `skills/story-implement/`.

**Restricciones que aplica este diseño:** constitución §6 (orquestador sin lógica de negocio: lee contexto → delega → escribe output), §10 (gates con precondiciones), §11 (idempotencia), principio 6 (no pasar contexto heredado a subagentes; los subagentes escriben en `.tmp/`), principio 11 (evals antes del `SKILL.md`), principio 13 (`round` no se escribe desde este skill), ADR-0002 (contrato de invocación de subagentes), ADR-0008 (sin estado de rework).

## Goals / Non-Goals

**Goals:**
- Gate de estado en `story-implement` espejo del 1d de `story-implement-tasks`, con escritura real de `IMPLEMENT/IN-PROGRESS` al arrancar. `// satisface: AC-1, AC-3, AC-4`
- Detección del modo rework por presencia de `fix-directives.md`, independiente del estado; lectura de `round` y lista blanca. `// satisface: AC-1, AC-4, AC-6, NFR-3`
- Contexto de rework (`fix_directives_path`, `whitelist`, `rework_round`) en los bundles RED/GREEN/REFACTOR, `null` fuera del modo rework. `// satisface: AC-1, AC-2`
- Sección "Ciclo de corrección — ronda N" en `implement-report.md`, `rework_round` en los JSON de estado y sugerencia de `/story-code-review` al cerrar. `// satisface: AC-1, AC-5`
- Documentación y evals del skill alineados (posicionamiento, README, tabla de errores, `evals.json`). `// satisface: NFR-1, NFR-2, NFR-4`

**Non-Goals:**
- Regla "RED sin tests nuevos" (error/advertencia por `Dimensión`) y control de archivos fuera de la lista blanca (confirmación interactiva / registro en `--auto`) → STORY-092. Este diseño solo **transporta** la lista blanca; no la aplica.
- Cambios en `story-code-review`, en `fix-directives-template.md` o en `story-implement-tasks` → STORY-089.
- Reconocer `verify-report.md` / `acceptance-report.md` como señales de rework.
- Modificar `skill-test-evals` o `skill-master` (fuera del repo).
- Reanudar un ciclo TDD a mitad (retomar en GREEN si `red-phase-status.json` existe): la reanudación desde `IMPLEMENT/IN-PROGRESS` re-ejecuta el ciclo completo, como hoy.

## Decisions

### D1 — Nuevo Paso 0c "Gate de estado, detección de modo y arranque", antes de leer `sddf.config.yaml`

`// satisface: AC-1, AC-3, AC-4`

**Elegida:** insertar el Paso 0c entre 0b (`$EXEC_MODE`) y el Paso 1. Secuencia: (1) resolver `$STORY_DIR` por glob `$SPECS_BASE/specs/03-stories/{story_id}*/` (hoy se resuelve tarde, en el Paso 3; se adelanta y el Paso 3 reutiliza la variable); (2) leer `status`/`substatus` de `story.md` — ausentes ⇒ `SPECIFY/TODO`; (3) precondición válida ⇔ `READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`; si no, detener con el mismo formato de mensaje del 1d de `story-implement-tasks` (estado actual, dos estados admitidos, sugerencia `/story-plan`), **sin escribir nada**; (4) detección de modo (D2); (5) escribir `status: IMPLEMENT`, `substatus: IN-PROGRESS`, `updated` en `story.md` (si ya está en `IMPLEMENT/IN-PROGRESS`, solo `updated`); (6) mostrar el bloque de inicio con estado de entrada y modo.

**Alternativas rechazadas:**
- *Colocar el gate en el Paso 3 (donde hoy se resuelve el directorio)* — los Pasos 1–2 ya habrían leído la configuración y podrían haber detenido la ejecución por errores de YAML antes de informar que la historia ni siquiera es implementable; el gate debe ser lo primero tras el preflight y los flags (constitución §10).
- *Gate sin escritura de `IMPLEMENT/IN-PROGRESS`* — mantiene la contradicción actual entre el Posicionamiento (l. 52) y el flujo, y deja la historia en la cola (`READY-FOR-IMPLEMENT`) mientras alguien la trabaja, rompiendo el WIP limit del buffer (invariante 7 de `domain-story-lifecycle.md`).
- *Aceptar también `CODE-REVIEW/DONE` "por conveniencia"* — es exactamente el caso que AC-3 prohíbe: una historia aprobada no se re-implementa sin pasar por un rechazo.

### D2 — Detección: `$REWORK_MODE = existe $STORY_DIR/fix-directives.md`; `round` ausente ⇒ 1, sin escribirlo

`// satisface: AC-1, AC-4, AC-6, NFR-3`

**Elegida:** en 0c.4, `$REWORK_MODE = true` si y solo si existe `$STORY_DIR/fix-directives.md` (ningún otro archivo se consulta). Si `true`: `$FIX_DIRECTIVES_PATH` = ruta absoluta del archivo; `$REWORK_ROUND` = valor entero de `round` en su frontmatter, o `1` si el campo falta o no es un entero ≥ 1 (caso STORY-090; nunca se escribe de vuelta — escritor único `story-code-review`); `$WHITELIST` = lista de rutas extraídas de la sección `## Lista blanca de archivos permitidos para modificar`: por cada línea que empiece por `- ` hasta el siguiente encabezado `##`, la primera ruta entre acentos graves; se conserva el texto libre posterior (p. ej. "solo lectura") como `note` de la entrada, sin interpretarlo. Si la sección no existe o queda vacía ⇒ `$WHITELIST = []` con `[WARN] fix-directives.md sin lista blanca — los generators recibirán whitelist vacía`. Si `false`: las tres variables son `null`. Anuncio antes de la Fase RED: `🔁 Modo rework (ronda {N}) — {H} hallazgo(s) bloqueante(s), {W} archivo(s) en lista blanca` (H = filas de la tabla "Instrucciones de corrección").

**Alternativas rechazadas:**
- *Decidir el modo por el estado (`IMPLEMENT/IN-PROGRESS` ⇒ rework)* — AC-4 lo prohíbe y `story-code-review` deja `READY-FOR-IMPLEMENT/DONE`; además `IMPLEMENT/IN-PROGRESS` también significa DoD pendiente o ciclo interrumpido.
- *Reconocer además `verify-report.md` con fallos y `acceptance-report.md` con `REJECTED`* — AC-6 lo excluye; sus formatos no tienen lista blanca ni hallazgos numerados y requerirían un contrato propio.
- *Derivar la lista blanca de la columna `Archivo:Línea` de la tabla* — duplica el 4e de `story-code-review` y pierde las rutas que el revisor añade a mano bajo la misma sección ("Destino de las acciones requeridas" en STORY-090).
- *Fallar si `round` no existe* — rompe NFR-3 (STORY-090 sin `round`) hasta que STORY-089 regenere el archivo.

### D3 — Campos de rework en los bundles: `rework_round`, `fix_directives_path`, `whitelist`; `null` fuera del modo rework

`// satisface: AC-1, AC-2`

**Elegida:** los tres campos se añaden al bundle base del Paso 3 (RED, todos los tipos, incluido `e2e`) y a los bundles de los Pasos 9 (GREEN) y 10 (REFACTOR), y al bloque "Contexto de invocación" de cada uno. Nombres definitivos (respuesta a la nota de `story.md`): `rework_round: <entero | null>`, `fix_directives_path: "<ruta> | null"`, `whitelist: [{path, note}] | null`. En modo rework el bloque de contexto lleva además un párrafo fijo **"Instrucción de rework"**: RED — "genera únicamente los tests que cubren los hallazgos de la tabla 'Instrucciones de corrección' de `fix_directives_path`; no regeneres tests existentes que ya pasan"; GREEN/REFACTOR — "aplica solo la 'Acción requerida' de cada hallazgo; limita los cambios a `whitelist`; reporta en `files_modified` todo archivo tocado". Fuera del modo rework el párrafo no se emite y los campos van como `null`.

**Alternativas rechazadas:**
- *Archivo `.tmp/story-implement/{id}/rework-context.json` que los generators leen* — añade una indirección y un formato más; los generators ya reciben todo por el bloque de contexto (ADR-0002) y `fix-directives.md` es en sí mismo el archivo compartido.
- *Pasar solo `fix_directives_path` y que cada generator parsee la lista blanca* — cuatro parsers (uno por generator) del mismo texto; la lista blanca la parsea una vez el orquestador (§6: lee contexto → delega).
- *Omitir los campos fuera del modo rework en lugar de pasarlos como `null`* — un bundle de forma variable obliga a cada generator a tratar "campo ausente" y "campo null" como casos distintos; la nota de `story.md` ya fija "ambos `null` fuera del modo rework".

### D4 — `testcases.md` sigue siendo la fuente de RED también en rework; el acotamiento se expresa en la instrucción, no en el bundle

`// satisface: AC-1, AC-2, NFR-4`

**Elegida:** el Paso 3 no cambia su resolución de artefactos (`testcases_path` o fallback); en rework, el acotamiento a los hallazgos lo aporta la "Instrucción de rework" de D3. La confirmación RED (Paso 5) no cambia: exit ≠ 0 ⇒ rojo confirmado; exit = 0 ⇒ la advertencia existente. `red-phase-status.json` añade `rework_round` (`null` fuera de rework). `tasks.md` sigue sin leerse.

**Alternativas rechazadas:**
- *Pasar `testcases_path: null` en rework para forzar que RED se base solo en los hallazgos* — los hallazgos de `requirements-coverage` señalan ACs sin cubrir cuyos casos ya están tipificados en `testcases.md`; quitarle la fuente canónica al generator empeora los tests.
- *Filtrar `testcases.md` en el orquestador a los casos citados por los hallazgos* — exige correlacionar texto libre de hallazgos con IDs de casos; lógica de negocio en el orquestador (§6) y frágil.
- *Tratar "RED sin archivos nuevos" en esta historia* — es STORY-092 (regla por `Dimensión`).

### D5 — `implement-report.md` gana la sección condicional "Ciclo de corrección — ronda N"; `cycle-status.json` gana `rework_round`

`// satisface: AC-1, AC-2, NFR-2`

**Elegida:** en 11b, solo si `$REWORK_MODE = true`, insertar después de "## Ciclo TDD" la sección `## Ciclo de corrección — ronda {N}` con: origen (`fix-directives.md`, `max-severity`, total de hallazgos), tabla `# | Archivo:Línea | Dimensión | Acción requerida | Archivos tocados (según results.json) | Estado (✓ aplicado / ⚠️ sin evidencia)`, y la lista blanca recibida. "Estado" se calcula por intersección entre el archivo del hallazgo y `files_generated`/`files_modified` consolidados de GREEN/REFACTOR — sin evidencia ⇒ `⚠️`, nunca `❌` (el juicio es del siguiente `story-code-review`). `cycle-status.json` y el resumen final (11e) incluyen `rework_round` y la línea `🔁 Modo rework (ronda N)`. El reporte se sobreescribe completo en cada ejecución, como hoy (NFR-2: una re-ejecución sin cambios reales produce el mismo reporte salvo fechas).

**Alternativas rechazadas:**
- *Reporte separado `rework-report.md`* — un artefacto más que `story-code-review` tendría que descubrir; el reporte de implementación ya es la evidencia que lee el revisor (`implement-report.md` opcional en su Entrada).
- *Acumular rondas en el reporte (histórico)* — la historia deja el archivado de rondas fuera de alcance; el histórico vive en git.

### D6 — El resumen final sugiere siempre `→ Ejecuta /story-code-review {story_id}` cuando `story.md` queda en `IMPLEMENT/DONE`

`// satisface: AC-1, AC-5`

**Elegida:** en 11e, ambos formatos (`auto` e `interactive`) terminan con `→ Ejecuta /story-code-review {story_id}` si `$DOD_BLOQUEADO = false`, en modo rework y en modo normal. Si `$DOD_BLOQUEADO = true`, la línea es `→ Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}`.

**Alternativas rechazadas:**
- *Sugerir solo en modo rework* — AC-1 lo exige en rework, pero el siguiente paso del pipeline es el mismo en ambos modos; dos mensajes distintos para el mismo siguiente paso son ruido. AC-2 ("tal como lo hace hoy") se refiere al ciclo TDD y a la ausencia de anuncio/sección de rework, no al pie del resumen.
- *Invocar `story-code-review` automáticamente al terminar* — colisiona con la separación de gates (§10) y con el modo interactivo; el usuario decide cuándo revisar.

### D7 — Evals primero; posicionamiento, README y tabla de errores alineados

`// satisface: AC-2, AC-3, NFR-1, NFR-2`

**Elegida:**
- `skills/story-implement/evals/evals.json`: casos nuevos `rework-desde-cola-con-fix-directives-anuncia-ronda-y-reporta` (AC-1), `ejecucion-inicial-sin-fix-directives-sin-anuncio-rework` (AC-2, `not_contains: ["Modo rework", "Ciclo de corrección"]`), `estado-no-admitido-detiene-sin-modificar` (AC-3, `CODE-REVIEW/DONE`), `reanudacion-in-progress-modo-por-presencia-de-fix-directives` (AC-4, dos variantes en un caso: con y sin archivo), `fix-directives-sin-round-usa-ronda-1` (NFR-3), `reejecucion-con-correcciones-aplicadas-no-cambia-story` (NFR-2). Los 9 casos existentes se mantienen; los de happy-path añaden `"Ejecuta /story-code-review"` a `contains`.
- Posicionamiento (l. 48–56): `READY-FOR-IMPLEMENT/DONE ← ejecución inicial, o rework encolado por story-code-review (señal: fix-directives.md)`; `IMPLEMENT/IN-PROGRESS ← reanudación (ciclo interrumpido o DoD con ❌)`; añadir `fix-directives.md → Rework: hallazgos, lista blanca y ronda (solo si existe)` a la leyenda. README del skill: misma corrección y fila `fix-directives.md` (opcional) en Precondiciones.
- "Manejo de errores": filas `Estado de story.md no admitido` (`❌ La historia <id> no está en un estado válido para implementar` → detener sin modificar) y `fix-directives.md sin sección de lista blanca` (`[WARN] … whitelist vacía` → continuar). "Arquitectura de delegación": bundles con los tres campos nuevos.
- Sección "Qué NO hace": añadir "Aplicar reglas sobre RED sin tests nuevos ni sobre archivos fuera de la lista blanca — STORY-092".

**Alternativas rechazadas:**
- *Reescribir los 9 evals existentes con los campos nuevos* — solo cambia el pie del resumen; el resto de expectativas siguen válidas.
- *Documentar el modo rework en `docs/guides/sddf-commands-pipeline.md`* — STORY-089 crea la sección 4 con el flujo completo y ya nombra a `/story-implement` como ejecutor; esta historia no toca docs fuera del skill (evita ediciones concurrentes sobre el mismo archivo).

### D8 — Reanudación desde `IMPLEMENT/IN-PROGRESS` re-ejecuta el ciclo completo; el modo solo depende de `fix-directives.md`

`// satisface: AC-4, NFR-2`

**Elegida:** 0c trata `IMPLEMENT/IN-PROGRESS` igual que `READY-FOR-IMPLEMENT/DONE` salvo por la escritura (solo `updated`). No se consulta `red-phase-status.json` ni `cycle-status.json` para saltar fases. La idempotencia (NFR-2) descansa en los generators: con las correcciones ya aplicadas, GREEN/REFACTOR no tienen nada que cambiar y reportan `files_modified: []`; `story.md` vuelve a `IMPLEMENT/DONE` con la misma fecha.

**Alternativas rechazadas:**
- *Retomar en GREEN si existe `red-phase-status.json` reciente* — introduce una tercera dimensión (fase alcanzada) en el gate; la historia solo pide gate + modo. Candidato a historia posterior si el coste de re-ejecutar RED resulta alto.
- *Bloquear la reanudación si `fix-directives.md` existe y `story.md` está en `IMPLEMENT/IN-PROGRESS`* — es el caso legítimo "empecé el rework y se interrumpió"; AC-4 lo admite explícitamente.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `story-implement` — Objetivo, Qué NO hace, Posicionamiento | modificar | `skills/story-implement/SKILL.md` (l. 22–56) | AC-6, NFR-1 |
| Skill `story-implement` — Paso 0c (gate, detección, arranque) | crear (sección nueva entre 0b y Paso 1) | `skills/story-implement/SKILL.md` | AC-1, AC-3, AC-4, NFR-3 |
| Skill `story-implement` — Paso 3 (bundle base) y Paso 4 (contexto RED) | modificar | `skills/story-implement/SKILL.md` (l. 176–283) | AC-1, AC-2, NFR-4 |
| Skill `story-implement` — Paso 6 (`red-phase-status.json`) | modificar | `skills/story-implement/SKILL.md` (l. 299–314) | AC-1 |
| Skill `story-implement` — Pasos 9 y 10 (bundles GREEN/REFACTOR + contexto) | modificar | `skills/story-implement/SKILL.md` (l. 444–600) | AC-1, AC-2 |
| Skill `story-implement` — 11b, 11e (sección de rework, `rework_round`, sugerencia) | modificar | `skills/story-implement/SKILL.md` (l. 652–770) | AC-1, AC-5 |
| Skill `story-implement` — Manejo de errores, Arquitectura de delegación, Salida | modificar | `skills/story-implement/SKILL.md` (l. 773–844) | AC-3 |
| Evals de `story-implement` | modificar | `skills/story-implement/evals/evals.json` | AC-1…AC-4, NFR-2, NFR-3 |
| README de `story-implement` | modificar | `skills/story-implement/README.md` | NFR-1 |
| Copia instalada de skills | refrescar (`scripts/install.js`) | `.claude/skills/story-implement/` | — (operativo) |

Componentes **no** tocados: `skills/story-code-review/**` y `skills/story-implement-tasks/**` (STORY-089), `skill-test-evals` / `skill-master` (fuera del repo), `docs/domains/**`, `docs/guides/**`, `sddf.config.yaml` (los campos nuevos viajan en el bundle, no en la configuración).

## Interfaces / contratos

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| **Gate de estado (Paso 0c)** | Entrada: `story.md` frontmatter. Válido ⇔ (`READY-FOR-IMPLEMENT`,`DONE`) ∨ (`IMPLEMENT`,`IN-PROGRESS`); ausentes ⇒ (`SPECIFY`,`TODO`). Inválido ⇒ mensaje con estado actual + admitidos + `/story-plan`, exit sin escrituras. Válido ⇒ `story.md` → `IMPLEMENT/IN-PROGRESS` + `updated`. Registra `$ENTRADA_STATUS`. | AC-1, AC-3, AC-4 |
| **Señal de rework** (consumida; definida por STORY-089) | `$REWORK_MODE ⇔ existe $STORY_DIR/fix-directives.md`. Este skill nunca crea, modifica ni elimina el archivo. | AC-1, AC-4, AC-6 |
| **Lectura de `fix-directives.md`** | Frontmatter: `round` (entero ≥ 1; ausente/ilegible ⇒ 1, sin escribir). Cuerpo: tabla `## Instrucciones de corrección` (conteo de hallazgos = filas con `#` numérico); sección `## Lista blanca de archivos permitidos para modificar` ⇒ `[{path, note}]` (una entrada por viñeta con ruta entre acentos graves). Fallos de parseo ⇒ `[WARN]` y valores vacíos, nunca detención. | AC-1, NFR-3 |
| **Bundle RED (Paso 3/4)** | `{story_id, testcases_path, story_path, design_path, [e2e_context], rework_round, fix_directives_path, whitelist}`; bloque "Contexto de invocación" con las mismas claves + párrafo "Instrucción de rework" solo si `$REWORK_MODE`. | AC-1, AC-2 |
| **Bundle GREEN/REFACTOR (Pasos 9/10)** | `{story_id, phase, layer, test_files, story_path, design_path, rework_round, fix_directives_path, whitelist}`; mismo bloque y párrafo condicional. Los generators reportan `files_generated`/`files_modified` en `results.json` (contrato existente; STORY-092 lo cruzará con `whitelist`). | AC-1, AC-2 |
| **`red-phase-status.json` / `cycle-status.json`** | Campo nuevo `rework_round: <entero | null>` en ambos. Resto sin cambios. | AC-1 |
| **`implement-report.md`** | Sección `## Ciclo de corrección — ronda {N}` presente ⇔ `$REWORK_MODE`; tabla hallazgo → archivos tocados → estado (`✓`/`⚠️`); lista blanca recibida. Ubicación: tras "## Ciclo TDD", antes de "## DoD IMPLEMENT". | AC-1, AC-2 |
| **Resumen final (11e)** | Línea `🔁 Modo rework (ronda N)` solo en rework; pie `→ Ejecuta /story-code-review {story_id}` cuando `IMPLEMENT/DONE`; `→ Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}` cuando `IMPLEMENT/IN-PROGRESS`. | AC-1, AC-5 |
| **Contrato hacia STORY-092** | STORY-092 recibe listos: `$WHITELIST` (con `note`), `$REWORK_MODE`, el conteo de hallazgos por `Dimensión` (disponible en la tabla parseada), `files_generated`/`files_modified` consolidados por fase. Esta historia no aplica ninguna regla sobre ellos. | AC-1 |
| **Coexistencia con `story-implement-tasks` (STORY-089 D5)** | Ambos ejecutores aceptan el mismo estado de entrada y la misma señal; ninguno invoca al otro; el segundo en ejecutarse encuentra las correcciones aplicadas (idempotencia); solo `story-code-review` retira la señal. | AC-5, NFR-2 |

## Flujos clave

**Flujo 1 — Rework desde la cola (AC-1, AC-5):**
```
/story-implement STORY-NNN  (story.md READY-FOR-IMPLEMENT/DONE, fix-directives.md round: N, sin tasks.md)
  0   preflight · 0b $EXEC_MODE
  0c  $STORY_DIR · gate OK ($ENTRADA_STATUS = READY-FOR-IMPLEMENT)
      $REWORK_MODE = true · $REWORK_ROUND = N · $FIX_DIRECTIVES_PATH · $WHITELIST (W rutas) · H hallazgos
      story.md → IMPLEMENT/IN-PROGRESS (+ updated)
      🚀 Iniciando implementación … 🔁 Modo rework (ronda N) — H hallazgo(s), W archivo(s) en lista blanca
  1–2 config y validación de generators (sin cambios)
  3–6 RED: bundle + rework fields + "Instrucción de rework" → tests para los hallazgos → red-phase-status.json {rework_round: N}
  7–9b GREEN: bundle + rework fields → correcciones dentro de whitelist → tests en verde
  10  REFACTOR: idem, sin regresiones
  11  DoD → implement-report.md (+ "## Ciclo de corrección — ronda N") → story.md IMPLEMENT/DONE
      → cycle-status.json {rework_round: N} → resumen con 🔁 y "→ Ejecuta /story-code-review STORY-NNN"
```

**Flujo 2 — Ejecución inicial (AC-2):** idéntico al actual; 0c añade solo el gate y la escritura `IMPLEMENT/IN-PROGRESS`; `$REWORK_MODE = false` ⇒ campos `null`, sin párrafo de instrucción, sin sección de rework, `rework_round: null`; pie `→ Ejecuta /story-code-review`.

**Flujo 3 — Estado no admitido (AC-3):** `0c` lee `CODE-REVIEW/DONE` ⇒ `❌ La historia STORY-NNN no está en un estado válido para implementar … Estado actual: CODE-REVIEW/DONE … admitidos: READY-FOR-IMPLEMENT/DONE · IMPLEMENT/IN-PROGRESS` ⇒ fin; `git status` limpio.

**Flujo 4 — Reanudación (AC-4):** `IMPLEMENT/IN-PROGRESS` (DoD ❌ de una ejecución previa o ciclo interrumpido) ⇒ gate OK; `$REWORK_MODE` por presencia del archivo; solo `updated` en 0c; ciclo completo (D8).

**Flujo 5 — Ciclo de la épica (AC-5, fixture STORY-090):** `/story-implement STORY-090` → `🔁 Modo rework (ronda 1)` (archivo sin `round`) → `IMPLEMENT/DONE` → `/story-code-review STORY-090` → `approved` elimina `fix-directives.md` y deja `CODE-REVIEW/DONE`; o `needs-changes` escribe `round: 1` (STORY-089) y vuelve a la cola. Sin ediciones manuales.

## Decisiones de complejidad justificada

- **Parser de lista blanca en el orquestador (D2):** lo más simple sería no parsear y pasar solo la ruta del archivo, pero STORY-092 necesita la lista estructurada y cuatro generators la reparsearían; el parser es una regla de una línea (viñeta + primera ruta entre acentos graves) que tolera texto libre.
- **Tres campos siempre presentes, `null` fuera de rework (D3):** un bundle de forma fija cuesta tres claves más por invocación y evita que cada generator distinga "ausente" de "null".
- **Escribir `IMPLEMENT/IN-PROGRESS` en 0c (D1):** parece añadir una escritura a un skill que hoy no la hace, pero corrige una contradicción documentada (l. 52) y es requisito de AC-1; sin ella la historia sigue contando como "en cola" mientras se implementa.
- **Sugerencia de `/story-code-review` también en modo normal (D6):** una sola línea de mensaje frente a dos variantes del resumen; el siguiente paso es el mismo.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Con `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` (`round: 2`) y sin `tasks.md`: `story.md` pasa a `IMPLEMENT/IN-PROGRESS` antes de RED, se anuncia `🔁 Modo rework (ronda 2)`, los bundles llevan `rework_round: 2`, `fix_directives_path` y `whitelist` no nulos, `implement-report.md` tiene "## Ciclo de corrección — ronda 2", `story.md` termina `IMPLEMENT/DONE`, resumen con `→ Ejecuta /story-code-review` | Eval `rework-desde-cola-con-fix-directives-anuncia-ronda-y-reporta` | AC-1 |
| 2 | Sin `fix-directives.md`: sin `Modo rework`, sin "Ciclo de corrección", campos `null`, `rework_round: null` en ambos JSON; resto del ciclo como los evals existentes | Eval `ejecucion-inicial-sin-fix-directives-sin-anuncio-rework` + evals previos en verde | AC-2 |
| 3 | `CODE-REVIEW/DONE` ⇒ mensaje con estado actual y admitidos; `story.md`, `.tmp/` y código sin cambios | Eval `estado-no-admitido-detiene-sin-modificar` + `git status` | AC-3 |
| 4 | `IMPLEMENT/IN-PROGRESS` con y sin `fix-directives.md` ⇒ gate OK; modo según presencia; solo `updated` cambia en 0c | Eval `reanudacion-in-progress-modo-por-presencia-de-fix-directives` | AC-4 |
| 5 | `fix-directives.md` sin `round` ⇒ `🔁 Modo rework (ronda 1)`; el archivo no se modifica (`git diff` vacío) | Eval `fix-directives-sin-round-usa-ronda-1` + fixture STORY-090 | NFR-3, AC-6 |
| 6 | Segunda ejecución con correcciones ya aplicadas ⇒ `files_modified: []` en GREEN/REFACTOR, `story.md` idéntico salvo `updated` | Eval `reejecucion-con-correcciones-aplicadas-no-cambia-story` | NFR-2 |
| 7 | Historia con `verify-report.md` fallido y sin `fix-directives.md` ⇒ modo normal (sin anuncio) | Inspección del 0c (solo consulta `fix-directives.md`) + variante del eval 2 | AC-6 |
| 8 | Posicionamiento y README ya no dicen "viene de story-code-review needs-changes" para `IMPLEMENT/IN-PROGRESS`; `grep -n "needs-changes" skills/story-implement/SKILL.md skills/story-implement/README.md` solo devuelve la línea de la señal de rework | Inspección (`grep`) | NFR-1 |
| 9 | `grep -n "tasks.md" skills/story-implement/SKILL.md` sigue devolviendo únicamente las notas "no guía el pipeline" | Inspección (`grep`) | NFR-4 |
| 10 | Ciclo completo sobre STORY-090: `/story-implement` → `IMPLEMENT/DONE` → `/story-code-review` → `approved`/`needs-changes` sin editar `story.md` a mano | Ejecución sobre el fixture (tras STORY-089 en DELIVER) | AC-5 |
| 11 | `/skill-test-evals story-implement` en verde (15 casos) tras refrescar `.claude/skills/` | `npm run test:eval` / `/skill-test-evals` | AC-1…AC-4 |

## Risks / Trade-offs

- **[Los generators instalados (`skill-test-evals`, `skill-master`) ignoran los campos de rework]** → el acotamiento viaja también como prosa ("Instrucción de rework") en el bloque de contexto, que cualquier subagente `general-purpose` lee; el reporte marca `⚠️ sin evidencia` cuando un hallazgo no aparece en `files_modified`, y `story-code-review` juzga. STORY-092 añade la verificación dura.
- **[Lista blanca con formato libre (STORY-090 tiene dos sublistas y una entrada "solo lectura")]** → el parser toma toda viñeta con ruta y conserva la nota; nunca falla, a lo sumo `[WARN]` con lista vacía.
- **[STORY-089 aún no entregada: `fix-directives.md` sin `round` y `story-code-review` sin nombrar al ejecutor]** → D2 asume ronda 1; el skill funciona con los archivos existentes (NFR-3). El orden 089 → 091 → 092 está declarado; si se implementa 091 antes, el único efecto es que la ronda anunciada es siempre 1.
- **[Re-ejecutar RED completo en reanudación]** → coste de tiempo, no de corrección; D8 deja la reanudación por fase como historia posterior.
- **[Escritura de `IMPLEMENT/IN-PROGRESS` en 0c y detención posterior por config inválida (Pasos 1–2)]** → la historia queda en `IMPLEMENT/IN-PROGRESS`, que el gate admite en la siguiente ejecución; equivale a un ciclo interrumpido (AC-4). Se documenta en la tabla de errores.
- **[Edición concurrente de `skills/story-implement/SKILL.md` con STORY-092]** → STORY-092 depende de esta historia y se implementa después; ambos diseños nombran los mismos pasos (0c, 4, 9, 10, 11b) para minimizar conflictos.

## Open Questions

Ninguna. Los nombres de los campos del bundle (pendientes según la nota de `story.md`) quedan fijados en D3: `rework_round`, `fix_directives_path`, `whitelist`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `story-implement` no tiene hoy ningún paso que escriba `IMPLEMENT/IN-PROGRESS` al arrancar, aunque su Posicionamiento (l. 52) y su README lo afirman. AC-1 lo exige ("pasa a IMPLEMENT/IN-PROGRESS al arrancar") pero `story.md` lo presenta como comportamiento existente. No hay historia previa que lo haya implementado (STORY-067 lo hizo en `story-implement-tasks`, no aquí).
- **Documento afectado**: design.md (D1) / story.md (sin cambio de texto necesario: el AC ya lo cubre)
- **Acción requerida**: implementar la escritura en el Paso 0c (D1) y cubrirla en el eval de AC-1; mencionar en el CHANGELOG (vía STORY-089 o release) que es comportamiento nuevo, no restaurado.

### CR-002
- **Tipo**: dependencia
- **Descripción**: los generators declarados en `sddf.config.yaml` (`skill-test-evals`, `skill-master`) no viven en `skills/` de este repo, así que no pueden actualizarse para consumir `rework_round`/`fix_directives_path`/`whitelist`. La historia asume ("contexto ya acordado para PLAN") que los generators reciben esos campos, no que los interpreten.
- **Documento afectado**: design.md (D3, riesgo 1)
- **Acción requerida**: ninguna en esta historia — D3 transporta los campos y añade la "Instrucción de rework" en prosa. Registrar como nota en `implement-report.md` que la interpretación por los generators se verifica manualmente en el fixture STORY-090 (contrato 10).
