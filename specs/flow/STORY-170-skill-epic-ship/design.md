---
alwaysApply: false
type: design
id: STORY-170
slug: STORY-170-skill-epic-ship-design
title: "Design: Skill epic-ship"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-170
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-170-skill-epic-ship
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-171-completar-archivar-epica-liberada
  - STORY-175-admitir-epicas-archivadas-en-layout
---

<!-- Referencias -->
[[STORY-170-skill-epic-ship]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-171-completar-archivar-epica-liberada]] · [[STORY-175-admitir-epicas-archivadas-en-layout]]

## Context

`epic-ship` es el nodo de la fase `SHIP` en `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid` (`dec_val -->|APPROVED| epic-ship`, `epic-ship --> epic-complete`). Hoy el nodo no tiene skill: `ls skills/` no lista `epic-ship`.

Estado verificado del que parte el diseño:

- **Entrada del gate:** `epic-validate` todavía no existe (STORY-124 a STORY-128, STORY-137 y STORY-169 están en `SPECIFY/DONE`). Su contrato sí está fijado en `epic.md` (CS-2, CS-5): `<EPIC_DIR>/epic-validate-report.md` con el veredicto en el campo `verdict` del frontmatter (`APPROVED` · `NEEDS-CHANGES` · `BLOCKED`). `epic-ship` depende solo de ese contrato (CR-001).
- **Escritor de estado prohibido hoy:** la invariante 6 de `docs/domains/domain-state-management.md` y la línea «SHIP y COMPLETED son transiciones manuales» de `docs/architecture/state-machine.md` dicen que ningún skill escribe `SHIP` de épica. `domain-epic-lifecycle` §5 asigna `SHIP` a «DevOps / CI-CD», §7 invariante 5 lo define como «publicación o despliegue real», §8 tiene el «Gate de publicación» y §9 lista `release-notes.md` como «(opcional) — generado en `SHIP`». STORY-175 edita la misma invariante 6 para `COMPLETED` de épica: la coordinación se resuelve en D-9.
- **Patrón de confirmación reutilizable (P3):** `skills/story-delivery/SKILL.md` ya escribe un estado terminal de story (`DELIVER/DONE`) solo tras `s`/`si`/`sí`, declara que el modo automático no está disponible para la transición y nunca ejecuta, dispara ni verifica un despliegue. `epic-ship` adopta las mismas reglas de respuesta y de frontmatter (`status`, `substatus`, `updated`).
- **Pertenencia de historias (P3):** `skills/epic-analyze/SKILL.md` (Paso 4) fija el inventario `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md` con pertenencia por prefijo `EPIC-NN` de `parent` (activa antes que archivada). El diseño de STORY-168 copia esas reglas a una referencia propia (su D-2); `epic-ship` hace lo mismo, limitado al inventario.
- **Formato de `CHANGELOG.md`:** el `CHANGELOG.md` del repo sigue Keep a Changelog (`## [Unreleased]`, luego `## [x.y.z] — fecha`, con `### Added` / `### Changed` / `### Removed`). `.claude/skills/doc-release-notes/` documenta esas convenciones, pero **no** está en `skills/` ni se publica en npm: un proyecto consumidor no la tiene, así que `epic-ship` no puede invocarla (D-3).
- **Valores de `kind`:** el template de story declara `feat | fix | chore | hotfix`; en `specs/flow/` hoy se usan `feat` (145), `chore` (17) y `fix` (2).
- **Registro de un skill nuevo:** `package.json › files` ya publica `skills/` completo (CS-12 sin editar `package.json`); `scripts/verify-fixed-layout.js` exige `<!-- SDDF-FIXED-LAYOUT: v1 -->`; `scripts/verify-eval-inventory.js` exige `evals/evals.json` con casos `TC-NNN`; `docs/guardrails/gr-skill-creation-checklist.md` fija frontmatter (`name`, `description` con `>-`, ≤ 500 caracteres, objetivo 350) y `SKILL.md` < 500 líneas. `epic-ship` no emite `verdict`: no es fila de §4 de `docs/policies/validation-contract-policy.md`.

## Goals / Non-Goals

**Goals:**
- Rechazar sin escribir nada una épica sin `epic-validate-report.md` o con `verdict` distinto de `APPROVED`, remitiendo a `/epic-validate` // satisface: AC-3
- Escribir en `CHANGELOG.md` un bloque de la épica, delimitado e idempotente, con una línea por historia terminada // satisface: AC-1, AC-2, CNF-2
- Escribir `<EPIC_DIR>/release-notes.md` para stakeholders desde un template propio, con el valor declarado por cada historia // satisface: AC-1, AC-2
- Mostrar en el chat los pasos de liberación manuales (commit, tag, merge y despliegue) sin ejecutar ninguno // satisface: AC-1, AC-4
- Escribir `SHIP/DONE` en `epic.md` solo tras confirmación humana explícita; sin ella, el status no cambia // satisface: AC-1, AC-2, CNF-1
- Documentar en el dominio y en la máquina de estados que `epic-ship` escribe `SHIP` de épica con confirmación humana // satisface: CS-20 (parte de `SHIP`)
- `SKILL.md` compacto con el detalle en `references/` y `assets/`, cargado bajo demanda // satisface: CNF-5, CNF-6

**Non-Goals:**
- Ejecutar commit, tag, merge, push, release, publicación de paquetes ni despliegue (Non-Goals de la historia).
- Crear `epic-release-notes`: `epic-ship` absorbe ese trabajo.
- Archivar la épica o escribir `COMPLETED` (lo hacen STORY-171 y STORY-175).
- Validar evidencia, suites o el estado de las historias: lo garantiza el `APPROVED` de `epic-validate`.
- Elegir la versión SemVer: se sugiere en los pasos manuales; la decide el humano.

## Decisions

### Componentes

| Componente | Acción | Ubicación | Responsabilidad | AC que satisface |
|---|---|---|---|---|
| Skill `epic-ship` | crear | `skills/epic-ship/SKILL.md` | Orquestar: gate de validación, escritura de documentos, pasos manuales y confirmación de `SHIP/DONE` | AC-1, AC-2, AC-3, AC-4, CNF-1, CNF-4 |
| Reglas de contenido | crear | `skills/epic-ship/references/release-content.md` | Inventario de historias terminadas (reglas de `epic-analyze` Paso 4), mapeo `kind` → categoría, formato e idempotencia del bloque de `CHANGELOG.md` y extracción del valor | AC-1, CNF-2, CNF-5 |
| Template de notas | crear | `skills/epic-ship/assets/release-notes-template.md` | Estructura de `release-notes.md` (frontmatter + secciones) | AC-1 |
| Evals | crear | `skills/epic-ship/evals/evals.json` | Casos `TC-NNN` para AC-1…AC-4 y CNF-1, CNF-2 (SMOKE-7 = AC-1 + AC-4) | AC-1…AC-4, CS-12 |
| Invariante 6 | modificar | `docs/domains/domain-state-management.md` §4 | Cláusula de `SHIP` de épica: la escribe `epic-ship` con confirmación humana | CS-20 |
| Ciclo de vida de épica | modificar | `docs/domains/domain-epic-lifecycle.md` §5 (actor de `SHIP`), §7 invariante 5, §8 «Gate de publicación», §9 (`release-notes.md` y nombre del reporte de `VALIDATE`) | Reflejar que el humano libera y `epic-ship` documenta y registra; nombrar `epic-validate-report.md`, el reporte que lee el gate (CR-001) | CS-20, AC-3 |
| Máquina de estados | modificar | `docs/architecture/state-machine.md` (nota «SHIP y COMPLETED son transiciones manuales») | Evitar la contradicción con la invariante 6 (D-9) | CS-20 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (tabla `## Épica (L2)`) | Fila: momento `SHIP`, lee `epic-validate-report.md` + `story.md`, escribe `CHANGELOG.md`, `release-notes.md`, `epic.md`, cambia estado `SHIP/DONE` con confirmación | CS-17, CS-18 |
| Pipeline de comandos | modificar | `docs/guides/sddf-commands-pipeline.md` (tabla de épica) | Fila de `epic-ship` | CS-17 |

No se crea `scripts/` (D-1) ni `README.md` (como en STORY-168, el guardrail lo desaconseja sin contenido humano propio). `package.json` no cambia. Los destinos de runtime (`.claude/`, `.codex/`, `.agents/`) son salida de `agile-sddf install`.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-ship <epica>` con `<epica>` = `EPIC-NN`, `EPIC-NN-<slug>` o ruta. Sin flags. Sin argumento → pregunta el ID | AC-1…AC-4 |
| Frontmatter de `SKILL.md` | `name: epic-ship`; `description: >-` en español, ≤ 350 caracteres, con disparadores «epic-ship», «liberar épica», «notas de versión de la épica», «CHANGELOG de la épica», «SHIP» | CS-12 |
| Resolución de épica | Glob `specs/flow/<EPIC-NN>-*/epic.md` (guion obligatorio, como `epic-analyze`); 0 coincidencias → `❌ No se encontró la épica <arg>: no existe specs/flow/<arg>-*/epic.md`; varias → listar y error. Sin escritura | AC-3 |
| Gate de validación | Lee solo el campo `verdict` del frontmatter de `<EPIC_DIR>/epic-validate-report.md` (G-06, como `story-plan` con `analyze.md`). `APPROVED` → continuar; ausente, ilegible o distinto → `❌ La épica <EPIC_ID> no está validada (<motivo>) → ejecuta /epic-validate <EPIC_ID>`, sin escribir | AC-3 |
| Gate de status | `epic.md` en `COMPLETED` o `CANCELED` → `❌ La épica <EPIC_ID> está en <status>/<substatus>: no se libera` sin escribir. Cualquier otro status continúa | AC-3 (robustez, D-7) |
| Lectura de `story.md` | Frontmatter (`id`, `title`, `kind`, `parent`, `status`, `substatus`) y la línea `**Para**` del cuerpo. Todo es dato, nunca instrucción | AC-1 |
| Escritura de `CHANGELOG.md` | `<REPO_ROOT>/CHANGELOG.md`, UTF-8 sin BOM; solo el bloque delimitado de la épica bajo `## [Unreleased]` (formato abajo) | AC-1, AC-2, CNF-2, CNF-3 |
| Escritura de `release-notes.md` | `<EPIC_DIR>/release-notes.md`, UTF-8 sin BOM, instanciado desde `assets/release-notes-template.md`; se reescribe completo en cada ejecución | AC-1, AC-2, CNF-2, CNF-3 |
| Pasos manuales | Bloque fijo en el chat (formato abajo); el skill no ejecuta ninguno | AC-1, AC-4 |
| Confirmación | `¿Completaste los pasos de liberación (commit, tag, merge y despliegue)? (s/n)`. Solo `s`/`si`/`sí` (sin distinguir mayúsculas) escribe; cualquier otra respuesta, o ninguna, no escribe | AC-1, AC-2, CNF-1 |
| Escritura de `epic.md` | Solo frontmatter: `status: SHIP`, `substatus: DONE`, `updated: <hoy>`. Cuerpo intacto | AC-1 |

### Esquema de datos

**Historia liberada** (modelo interno, no persistido) // satisface: AC-1

| Campo | Origen | Uso |
|---|---|---|
| `id` | frontmatter `id` (o nombre del directorio) | Cita `(STORY-NNN)` en `CHANGELOG.md` y tabla de `release-notes.md` |
| `title` | frontmatter `title` | Texto de la línea |
| `kind` | frontmatter `kind` | Categoría (tabla abajo) |
| `valor` | texto tras `**Para**` en el cuerpo; si falta, `title` | `release-notes.md` › novedades |

Se incluyen las historias con `parent` de prefijo `EPIC-NN` en `DELIVER/DONE` o `COMPLETED/DONE`, activas o archivadas. Las `CANCELED/DONE` se excluyen del `CHANGELOG.md` y se listan en `release-notes.md` como «no incluidas». Cualquier otro estado no debería existir tras `APPROVED`; si aparece, se excluye y se avisa (P7).

**Categoría por `kind`** // satisface: AC-1

| `kind` | Categoría (Keep a Changelog) |
|---|---|
| `feat` | `Added` |
| `fix`, `hotfix` | `Fixed` |
| `chore`, ausente u otro | `Changed` |

**Bloque de `CHANGELOG.md`** (D-2, D-4) // satisface: AC-1, CNF-2

- Ubicación: dentro de `## [Unreleased]`, antes del primer `## [` siguiente. Si no existe `## [Unreleased]`, se crea tras la cabecera (antes del primer `## [`); si no existe `CHANGELOG.md`, se crea con la cabecera de Keep a Changelog y `## [Unreleased]`.
- Delimitadores: `<!-- epic-ship:EPIC-NN:start -->` y `<!-- epic-ship:EPIC-NN:end -->`.
- Contenido entre delimitadores: encabezado `### EPIC-NN — <title de epic.md>`, una línea de objetivo (primera frase de `## Objetivo` de `epic.md`) y una viñeta por historia `- **<Categoría>** — <title> (<STORY-NNN>)`, agrupadas en orden `Added`, `Changed`, `Fixed` y por ID.
- Idempotencia: si los delimitadores de la épica existen en cualquier lugar del archivo, se reemplaza solo lo que hay entre ellos; nunca se agrega un segundo bloque. El resto del archivo no se toca.

**`release-notes.md`** (template `assets/release-notes-template.md`) // satisface: AC-1

| Parte | Contenido |
|---|---|
| Frontmatter | `type: release-notes`, `id: <EPIC_ID>`, `epic: <EPIC_DIRNAME>`, `slug: <EPIC_DIRNAME>-release-notes`, `title: "Notas de versión: <title>"`, `created` (el del archivo previo si existe; si no, hoy), `updated: <hoy>`, `related: [<EPIC_DIRNAME>]` |
| `## Resumen` | Objetivo de la épica en lenguaje de stakeholder |
| `## Novedades` | Una viñeta por historia liberada: `**<title>** — <valor>` |
| `## Historias incluidas` | Tabla `ID │ Título │ Categoría │ Estado` |
| `## No incluidas` | Historias `CANCELED/DONE`, o `Ninguna.` |

**Pasos de liberación manuales** (salida de chat) // satisface: AC-1, AC-4

```
🧭 Pasos de liberación (los ejecutas tú; epic-ship no ejecuta ninguno):
  1. Revisa CHANGELOG.md y <EPIC_DIR>/release-notes.md.
  2. Commit de los cambios de la épica.
  3. Tag de la versión (sugerida: <versión> — <motivo>).
  4. Merge a la rama principal.
  5. Despliegue o publicación según tu proyecto.
```

La versión sugerida sale del último `## [x.y.z]` de `CHANGELOG.md`: con alguna historia `Added` → minor; solo `Fixed` → patch; sin versión previa → `sin versión previa: decide tú`. Es texto informativo; ningún archivo la registra (D-6).

### Flujos clave

**F1 — Preparar y confirmar** // satisface: AC-1, AC-4, SMOKE-7
1. Resolver `REPO_ROOT` y la épica (`EPIC_DIR`, `EPIC_ID`).
2. Gate de validación (`verdict: APPROVED`) y gate de status.
3. Cargar `references/release-content.md`; inventariar historias liberadas.
4. Escribir el bloque de `CHANGELOG.md` y luego `release-notes.md`.
5. Mostrar el resumen de lo escrito y los pasos de liberación manuales.
6. Preguntar la confirmación; con `s`/`si`/`sí` escribir `SHIP/DONE` + `updated` en `epic.md` y mostrar `✅ <EPIC_ID> liberada: SHIP/DONE. Siguiente paso: /epic-complete <EPIC_ID>`.

**F2 — Sin confirmación** // satisface: AC-2, CNF-1
Pasos 1–5 de F1; respuesta distinta de `s`/`si`/`sí` (o invocación por orquestador sin humano) → `ℹ️ CHANGELOG.md y release-notes.md quedaron escritos; la épica sigue en <status>/<substatus>. Vuelve a ejecutar /epic-ship <EPIC_ID> cuando completes la liberación.` `epic.md` no se escribe.

**F3 — Épica no validada** // satisface: AC-3
En el paso 2, reporte ausente o `verdict` ≠ `APPROVED` → mensaje de rechazo con `/epic-validate <EPIC_ID>` y fin. Ningún archivo se crea ni modifica (el gate precede a toda escritura).

**F4 — Reejecución** // satisface: CNF-2
El bloque de `CHANGELOG.md` se reemplaza entre sus delimitadores y `release-notes.md` se reescribe conservando su `created`. Si `epic.md` ya está en `SHIP/DONE`, no se pregunta la confirmación y se informa `ℹ️ <EPIC_ID> ya está en SHIP/DONE`.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo | Instrucciones Markdown en `SKILL.md` ejecutadas por el agente | (a) Motor Node `scripts/epic-ship.js` como `story-complete`; (b) delegar en `/epic-analyze` el inventario | (a) `story-complete` usa motor porque mueve directorios con `git mv` (irreversible); aquí las escrituras son ediciones de texto revisables en el diff y un motor añadiría código, pruebas y resolución de rutas en runtimes instalados (P12). (b) `epic-analyze` escribe su reporte y carga 336 líneas | CNF-5, CNF-6 |
| D-2 | Ubicación de la entrada en `CHANGELOG.md` | Bloque de la épica dentro de `## [Unreleased]` | (a) Crear `## [x.y.z] — fecha`; (b) repartir las viñetas en los `### Added`/`### Changed` existentes | (a) Exige fijar la versión, que el humano decide al taggear; promover `[Unreleased]` es parte de la liberación manual. (b) Mezclar líneas con las de otras épicas impide reemplazarlas de forma idempotente (CNF-2) | AC-1, CNF-2 |
| D-3 | Origen del formato | Reglas propias en `references/release-content.md`, compatibles con Keep a Changelog | (a) Invocar `/doc-release-notes`; (b) cargar sus referencias | `doc-release-notes` vive solo en `.claude/skills/` de este repo, no en `skills/` ni en el paquete npm: en un proyecto consumidor no existe. Además pide la entrada como lista de commits y escribe `RELEASE_NOTES.md` en la raíz, no en la épica | AC-1, CNF-5 |
| D-4 | Idempotencia | Delimitadores HTML `epic-ship:EPIC-NN:start/end` | (a) Detectar el encabezado `### EPIC-NN`; (b) no reescribir si ya existe | (a) Un encabezado editado a mano deja de coincidir y se duplicaría. (b) Una historia entregada tras la primera ejecución no entraría nunca | CNF-2 |
| D-5 | Escritura de documentos antes de la confirmación | Sin confirmación previa; la confirmación solo gobierna `SHIP/DONE` | Pedir confirmación también antes de escribir `CHANGELOG.md` | AC-2 exige que los documentos queden escritos aunque el humano no confirme la liberación; además el paso 1 de la liberación es revisarlos en el diff | AC-2 |
| D-6 | Versión | Sugerida en el chat, nunca escrita | (a) Escribirla en `release-notes.md` o `epic.md`; (b) no sugerir nada | (a) SemVer no se verifica automáticamente (lo advierte `doc-release-notes`): registrarla fijaría un valor que el humano puede cambiar al taggear. (b) El paso «tag» queda sin orientación | AC-1 |
| D-7 | Precondición de status | Solo se rechazan `COMPLETED` y `CANCELED`; el gate real es `verdict: APPROVED` | Exigir `status: VALIDATE` | `epic-validate` emite veredicto sin escribir estado (CS-7): una épica validada puede seguir en `DEVELOP` o `VALIDATE`. Exigir `VALIDATE` bloquearía el caso normal | AC-1, AC-3 |
| D-8 | Modo automático | No disponible para `SHIP/DONE`: sin humano, se escriben los documentos y el status no cambia | Escribir `SHIP/DONE` en automático | CNF-1 y CS-18; mismo criterio que `story-delivery` para `DELIVER` | CNF-1 |
| D-9 | Documentos de dominio | Editar solo la cláusula de `SHIP` de la invariante 6 y las secciones de `SHIP` de `domain-epic-lifecycle`; actualizar también la nota de `state-machine.md` | (a) Editar solo los dos documentos de dominio que cita la historia; (b) reescribir la invariante 6 completa | (a) `state-machine.md` es la fuente canónica de transiciones y seguiría diciendo que ningún skill escribe `SHIP`. (b) STORY-175 edita la cláusula de `COMPLETED` de la misma invariante: tocar solo `SHIP` reduce el conflicto (CR-002) | CS-20 |
| D-10 | Contenido untrusted | Solo escalares del frontmatter y la línea `**Para**`; el texto se copia como dato y se escapa `<!--` | Leer y resumir el cuerpo completo de cada historia | Misma regla que `epic-analyze` (`gr-ai-security-checklist`); un `**Para**` con `<!-- epic-ship:… -->` rompería los delimitadores | AC-1, CNF-2 |

### Decisiones de complejidad justificada

- **Una referencia y un template en vez de todo en `SKILL.md`:** el inventario, el mapeo de categorías y el formato del bloque solo se necesitan tras pasar el gate; separarlos permite que un rechazo (AC-3) no los cargue (CNF-5). Una sola referencia agrupa todo lo que define *qué* se escribe; el template fija *cómo* se ve `release-notes.md`.
- **Delimitadores HTML:** son la forma más simple de reemplazo idempotente sin parsear Markdown; son invisibles al renderizar.
- **Sin flags (`--dry-run`, `--version`):** ningún AC los pide (YAGNI). `--dry-run` no aporta: la única escritura irreversible (el status) ya exige confirmación.

### Puntos de variación (P6)

- **Formato del `CHANGELOG.md`:** si un proyecto usa otro formato, solo cambia `references/release-content.md`.
- **Estructura de las notas:** se ajusta en `assets/release-notes-template.md` sin tocar el flujo.
- **Pasos de liberación:** si en el futuro un skill hace tags o despliegues (decisión del PO del 2026-10-27, revocable), solo cambia el bloque de pasos y la invariante 6.
- **Épicas archivadas:** tras STORY-171, una épica `COMPLETED` deja `specs/flow/`; la resolución de épica no cambia porque `epic-ship` actúa antes.

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `epic-validate-report.md` ausente o con frontmatter ilegible | Rechazo de F3; ningún archivo escrito |
| `CHANGELOG.md` ausente | Se crea con cabecera Keep a Changelog y `## [Unreleased]` |
| Solo existe un delimitador de la épica (el otro fue borrado a mano) | No se escribe `CHANGELOG.md`; `❌ CHANGELOG.md tiene el bloque de <EPIC_ID> incompleto: corrige los delimitadores`; se detiene antes de `release-notes.md` y de la confirmación |
| `assets/release-notes-template.md` ausente | `❌` y fin tras escribir `CHANGELOG.md`; se informa qué quedó escrito; no se pregunta la confirmación |
| `story.md` sin `**Para**` | `valor` = `title` |
| Historia hija en estado no terminal pese a `APPROVED` | Se excluye y se avisa `⚠️ <ID> en <status>/<substatus> no se incluye`; no detiene |
| Ninguna historia liberada | `❌ <EPIC_ID> no tiene historias en DELIVER/DONE ni COMPLETED/DONE` sin escribir nada |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| 1 | Con reporte `APPROVED` y confirmación `s`: bloque en `CHANGELOG.md` con cada historia, `release-notes.md` existe, salida con los cinco pasos y `epic.md` en `SHIP/DONE` | Eval TC-001 (= SMOKE-7) | AC-1 |
| 2 | Con respuesta `n`: `CHANGELOG.md` y `release-notes.md` escritos, `status`/`substatus` de `epic.md` sin cambio | Eval TC-002 | AC-2, CNF-1 |
| 3 | Sin reporte y con `verdict: NEEDS-CHANGES`: mensaje con `/epic-validate` y ningún archivo nuevo o modificado | Eval TC-003, TC-004 | AC-3 |
| 4 | La salida no contiene ejecución de `git commit`, `git tag`, `git merge`, `git push`, `npm publish` | Eval (aserción `not_contains` sobre comandos ejecutados) + revisión de `SKILL.md` | AC-4 |
| 5 | Dos ejecuciones seguidas dejan un solo bloque `epic-ship:EPIC-NN:start` | Eval TC-005 | CNF-2 |
| 6 | `CHANGELOG.md`, `release-notes.md` y `epic.md` escritos en UTF-8 sin BOM | Revisión manual en el recorrido SMOKE-7 (`head -c3` ≠ `EF BB BF`) | CNF-3 |
| 7 | `SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y no menciona `SDDF_ROOT` ni `SPECS_BASE` | `node scripts/verify-fixed-layout.js` | CNF-4 |
| 8 | `SKILL.md` < 500 líneas (objetivo ≤ 200) y `description` ≤ 350 caracteres | `wc -l` + `gr-skill-creation-checklist` | CNF-5, CNF-6 |
| 9 | Invariante 6, `domain-epic-lifecycle` y `state-machine.md` nombran a `epic-ship` como escritor de `SHIP` con confirmación humana | Revisión + `npm run verify:links` | CS-20 |
| 10 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (F1, D-2, D-5), AC-2 (F2, D-5), AC-3 (F3, gates), AC-4 (pasos manuales, Contrato 4); CNF-1 (D-8), CNF-2 (D-4, F4), CNF-3 (Interfaces, Contrato 6), CNF-4 (Contrato 7), CNF-5/CNF-6 (D-1, D-3, complejidad justificada). CS-20 parte `SHIP` (D-9). Sin omisiones.
- **Ambigüedad:** la ubicación del `CHANGELOG.md` y la versión, no fijadas en la historia, se deciden en D-2 y D-6.
- **Nombres:** «historia liberada», «pasos de liberación», «bloque de la épica» se usan de forma única en flujo, referencia y evals.
- **Estructura:** sin ciclos (`SKILL.md → references/release-content.md`, `SKILL.md → assets/release-notes-template.md`); cada componente tiene una razón de cambio (flujo · contenido · forma de las notas · pruebas).

## Risks / Trade-offs

- [El contrato de `epic-validate-report.md` cambia al implementar STORY-124] → `epic-ship` solo lee `verdict` del frontmatter, fijado por CS-5 y por `validation-contract-policy`; los evals usan un fixture mínimo (CR-001).
- [Conflicto de edición en la invariante 6 con STORY-175] → D-9 limita el cambio a la cláusula de `SHIP`; la historia que se implemente segunda rebasa sobre la primera (CR-002).
- [El agente reescribe más de lo delimitado en `CHANGELOG.md`] → el contrato es «solo entre delimitadores»; el eval TC-005 compara el resto del archivo antes y después.
- [Un humano confirma sin haber liberado] → es responsabilidad humana declarada (igual que `story-delivery` en `continuous`); el skill nunca verifica despliegues por diseño.

## Open Questions

Ninguna: las decisiones abiertas se resuelven en D-1…D-10; las dependencias con otras historias se registran como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-1 y AC-3 dependen de `epic-validate-report.md`, que produce `epic-validate` (STORY-124 y siguientes), todavía sin implementar. `docs/domains/domain-epic-lifecycle.md` §9 lo llama `validate-report.md`, distinto del nombre fijado en CS-2 de la épica.
- **Documento afectado**: story.md (Notas) · `domain-epic-lifecycle` §9 · epic.md (CS-20)
- **Acción requerida**: declarar en las Notas de la historia la dependencia del contrato (`<EPIC_DIR>/epic-validate-report.md`, campo `verdict`). `epic-ship` puede implementarse y probarse con fixtures antes que `epic-validate`. Esta historia corrige el nombre en §9 (`validate-report.md` → `epic-validate-report.md`) al editar esa sección, y la épica lo registra en CS-20.

### CR-002
- **Tipo**: dependencia
- **Descripción**: la invariante 6 de `domain-state-management` la editan esta historia (`SHIP` de épica) y STORY-175 (`COMPLETED` de épica). Además, `docs/architecture/state-machine.md` repite la regla y no figura en la historia.
- **Documento afectado**: story.md (Notas «Tamaño» y criterios de salida) · epic.md (CS-20)
- **Acción requerida**: añadir `docs/architecture/state-machine.md` a los documentos que ajusta la historia y al texto de CS-20, y acordar con STORY-175 que la segunda en implementarse rebasa la invariante 6 conservando la cláusula de la otra.
