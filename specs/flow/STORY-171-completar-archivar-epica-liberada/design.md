---
alwaysApply: false
type: design
id: STORY-171
slug: STORY-171-completar-archivar-epica-liberada-design
title: "Design: Skill epic-complete (Core) — completar y archivar una épica liberada"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-171
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-171-completar-archivar-epica-liberada
  - EPIC-23-completar-flujo-de-epic
  - STORY-170-skill-epic-ship
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
  - STORY-175-admitir-epicas-archivadas-en-layout
---

<!-- Referencias -->
[[STORY-171-completar-archivar-epica-liberada]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-170-skill-epic-ship]] · [[STORY-172-skill-epic-complete-archivar-epicas-canceladas]] · [[STORY-175-admitir-epicas-archivadas-en-layout]]

## Context

`/epic-complete EPIC-NN` cierra el último paso del flujo de épica (`SHIP → COMPLETED`, nodo `epic-complete` de `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid`). Lleva una épica `SHIP/DONE` a `COMPLETED/DONE`, deja en `epic.md` la fecha de cierre y la versión liberada y mueve su directorio a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`.

Estado actual verificado en el filesystem (2026-10-29):

- **Antecedente directo (P3):** `skills/story-complete/` (EPIC-27, STORY-160 y STORY-164) resuelve el mismo problema para historias: `SKILL.md` orquesta y el motor determinista `scripts/story-complete.js` (312 líneas, sin dependencias npm) localiza, valida, escribe el frontmatter, mueve con `git mv` o `rename`, restaura ante fallo y verifica el conteo. Expone `plan` (solo lectura) y `apply`, con un único objeto JSON en stdout y exit `0`/`1`/`2`. `test/story-complete.test.js` lo prueba con `node --test` sobre repos temporales. El diseño de esta historia replica ese contrato.
- **Entrada:** `epic-ship` (STORY-170, en `PLAN`) deja la épica en `SHIP/DONE` y escribe en `CHANGELOG.md` un bloque delimitado `<!-- epic-ship:EPIC-NN:start -->` … `<!-- epic-ship:EPIC-NN:end -->` bajo `## [Unreleased]`. La versión **no** la registra ningún archivo (D-6 de STORY-170): el humano promueve `[Unreleased]` a `## [x.y.z] — fecha` al liberar. `epic-complete` es quien deja la versión en `epic.md`.
- **Frontmatter de épica:** `docs/templates/epic-template.md` declara las claves `type`, `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related`, y `epic-format-validation` (Paso 3b) exige **toda** clave del frontmatter del template. Una clave nueva en el template volvería obligatorias la fecha de cierre y la versión en toda épica activa.
- **Layout:** ADR-0017 (aceptado) deja las épicas en `specs/flow/`. El ADR que admite épicas archivadas, el ajuste de `AGENTS.md`, `docs/constitution.md`, `domain-epic-lifecycle` y `domain-state-management`, y la numeración que cuenta épicas archivadas son de STORY-175, que se entrega antes. Esta historia no edita esos documentos.
- **Registro del skill:** `package.json › files` ya publica `skills/` completo (CS-12 sin editar `package.json`); `scripts/verify-fixed-layout.js` exige `<!-- SDDF-FIXED-LAYOUT: v1 -->`; `scripts/verify-eval-inventory.js` exige `evals/evals.json` con casos `TC-NNN`; `docs/guardrails/gr-skill-creation-checklist.md` fija el frontmatter de `SKILL.md` (`name`, `description: >-` ≤ 500 caracteres, objetivo 350) y `SKILL.md` < 500 líneas. El skill se crea con `skill-master` (nota de la historia y `implement.code_generators` de `sddf.config.yaml`).
- **Stack:** Node.js CommonJS sin dependencias (`'use strict'`, `fs`, `path`, `child_process.spawnSync`), pruebas con `node:test` y `node:assert/strict` en `test/`.

## Goals / Non-Goals

**Goals:**

- Completar una épica `SHIP/DONE`: `status: COMPLETED`, `updated:` y `completed:` de hoy, `version:` de la versión liberada, y archivarla con la fecha de hoy // satisface: AC-1, CNF-2
- Archivar sin reescribir `epic.md` una épica que ya está en `COMPLETED/DONE`, con la fecha de `updated:` → `created:` → `date:` // satisface: CNF-2
- Mover con `git mv` cuando el directorio tiene historial y no hacer commit // satisface: AC-1, CNF-1
- Rechazar sin escribir ni mover cualquier otro estado // satisface: AC-2
- No escribir ni mover nada sin `s`/`si`/`sí` explícito // satisface: AC-3, CNF-3
- `SKILL.md` compacto que delega el trabajo determinista al motor y el detalle de errores a un recurso bajo demanda // satisface: CNF-4, CNF-5, CNF-6

**Non-Goals:**

- Archivar épicas `CANCELED/DONE` y el rechazo `CANCELED_NOT_DONE` (STORY-172; ver CR-001).
- Archivar las historias hijas (lo hace `/story-complete`) o verificar su estado: `SHIP/DONE` ya implica `epic-validate` `APPROVED`.
- El ADR nuevo, `AGENTS.md`, `docs/constitution.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/domains/domain-state-management.md`, `docs/architecture/state-machine.md` y la numeración de épicas (STORY-175).
- Añadir `completed`/`version` a `docs/templates/epic-template.md` (D-5).
- Tableros de métricas; promover `[Unreleased]` en `CHANGELOG.md`; commit, tag, push o despliegue.

## Decisions

### Componentes

| Componente | Acción | Ubicación | Responsabilidad | AC que satisface |
|---|---|---|---|---|
| Skill `epic-complete` | crear | `skills/epic-complete/SKILL.md` | Orquestar: resolver argumento, pedir el plan al motor, mostrarlo, preguntar y aplicar | AC-1, AC-2, AC-3, CNF-3, CNF-4, CNF-5, CNF-6 |
| Motor de cierre de épica | crear | `skills/epic-complete/scripts/epic-complete.js` | Localizar, validar estado, resolver versión y fecha, escribir el frontmatter, mover y verificar el conteo | AC-1, AC-2, CNF-1, CNF-2 |
| Catálogo de errores | crear | `skills/epic-complete/references/error-codes.md` | Tabla código → cuándo → mensaje → estado resultante; se carga solo ante `ok: false` | AC-2, CNF-5 |
| Ficha del skill | crear | `skills/epic-complete/README.md` | Qué hace, estados admitidos, qué produce y qué no (formato de `skills/story-complete/README.md`) | CNF-6 |
| Evals | crear | `skills/epic-complete/evals/evals.json` | Casos `TC-NNN` de AC-1 (= SMOKE-8), AC-2 y AC-3 sobre fixtures | AC-1, AC-2, AC-3 |
| Pruebas del motor | crear | `test/epic-complete.test.js` | `node --test` sobre repos temporales (contratos de verificación 1–9) | AC-1, AC-2, CNF-1, CNF-2 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (tabla `## Épica (L2)`) | Fila: momento `SHIP/DONE → COMPLETED`, lee `epic.md` y `CHANGELOG.md`, escribe `epic.md` y mueve el directorio, cambia estado `COMPLETED/DONE` con confirmación | CS-12, CS-19 |
| Guía de comandos | modificar | `docs/guides/sddf-commands-pipeline.md` (sección de épica) | Fila de `epic-complete` con entrada y salida | CS-12 |
| README del repo | modificar | `README.md` (tabla de comandos de épica, si existe; si no, junto a la de `/story-complete`) | Fila «Completar y archivar épica» | CS-12 |
| `CHANGELOG.md` | modificar | `CHANGELOG.md › ## [Unreleased] › ### Added` | Entrada del skill nuevo | CS-12 |

`package.json` no cambia: `files` ya incluye `skills/`. Las copias en `.claude/`, `.agents/` y `.codex/` son salida de `agile-sddf install` y no se editan.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Frontmatter de `SKILL.md` | `name: epic-complete`; `description: >-` en español, ≤ 350 caracteres, con disparadores «epic-complete», «completar épica», «archivar épica», «cerrar épica», «COMPLETED» | CS-12 |
| Invocación del skill | `/epic-complete EPIC-NN [--version x.y.z]` o `/epic-complete specs/flow/EPIC-NN-<slug>/ [--version x.y.z]`. Sin modo automático ni `--yes` | AC-1, CNF-3 |
| CLI del motor | `node <CLI_ROOT>/skills/epic-complete/scripts/epic-complete.js <plan\|apply> --repo-root <REPO_ROOT> (--id EPIC-NN \| --path <ruta>) [--version <x.y.z>]` | AC-1, AC-2 |
| Salida del motor | Un único objeto JSON en stdout: `ok`, `code`, `message`, `epic {id, dir, status, substatus}`, `action`, `archiveDate`, `version`, `versionSource`, `from`, `to`, `moveMethod`, `warnings[]`, `counts {before, after}` (solo `apply`). Exit `0` si `ok: true`, `1` si `ok: false`, `2` ante argumentos inválidos (error en stderr) | AC-1, AC-2 |
| API del módulo (para `test/`) | `module.exports = { locateEpic, archiveDateOf, releasedVersionOf, planCompletion, applyCompletion }`; las funciones reciben `{ repoRoot, id, epicPath, version, today }` y devuelven el mismo objeto que la CLI | AC-1, AC-2, CNF-1, CNF-2 |
| `releasedVersionOf(changelogText, epicId)` | Devuelve `{ version, reason }`: la versión del encabezado `## [x.y.z]` más cercano por encima de `<!-- epic-ship:EPIC-NN:start -->`; `reason` ∈ `found`, `unreleased`, `no-block`, `no-changelog` | AC-1 |
| Escritura de `epic.md` | Solo frontmatter (action `complete`): `status: COMPLETED`, `updated: <hoy>`, `completed: <hoy>`, `version: <x.y.z>`. `substatus: DONE` y el cuerpo quedan intactos; UTF-8 sin BOM y finales de línea conservados | AC-1 |
| Lectura de `CHANGELOG.md` | `<REPO_ROOT>/CHANGELOG.md`, solo lectura, solo para resolver la versión cuando no hay `--version` | AC-1 |

### Esquema de datos

**Tabla de admisión por estado** (única fuente de decisión; la aplica `planCompletion`) // satisface: AC-1, AC-2

| `status` / `substatus` de `epic.md` | `action` | Escribe `epic.md` | Fecha del directorio |
|---|---|---|---|
| `SHIP` / `DONE` | `complete` | sí (4 claves) | hoy |
| `COMPLETED` / `DONE` | `archive-only` | no | `updated:` → `created:`; `date:` solo si faltan ambas claves |
| cualquier otro par (incluido `CANCELED/*` hasta STORY-172) | — (`NOT_SHIPPED`) | no | — |

Mensaje de `NOT_SHIPPED` (AC-2): `La épica EPIC-NN está en <status>/<substatus>: solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE.` Si el estado es `VALIDATE/DONE`, añade `Ejecuta antes /epic-ship EPIC-NN`.

**Frontmatter de `epic.md` tras `complete`** // satisface: AC-1, CNF-2

| Clave | Valor | Regla de escritura |
|---|---|---|
| `status` | `COMPLETED` | Reemplaza la línea `status: SHIP` (última ocurrencia de nivel superior) |
| `substatus` | `DONE` | Sin cambio |
| `updated` | `<hoy>` | Reemplaza; si falta, se inserta tras `created:` (o antes del cierre) |
| `completed` | `<hoy>` | Reemplaza si existe; si no, se inserta tras `updated:` |
| `version` | `<x.y.z>` | Reemplaza si existe; si no, se inserta tras `completed:` |

`created:` (inicio) y `completed:` (cierre) permiten medir el tiempo de ciclo; `version:` enlaza la épica con su entrada de `CHANGELOG.md` (nota «Métricas» de EPIC-23).

**Resolución de la versión liberada** (solo action `complete`, primera coincidencia) // satisface: AC-1

1. `--version <x.y.z>` → `versionSource: argument`. Se acepta `^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$` y se guarda sin la `v` inicial. Si `CHANGELOG.md` resuelve otra versión, se añade el aviso `⚠️ CHANGELOG.md ubica EPIC-NN en <x>; se usará --version <y>`.
2. `CHANGELOG.md` con el bloque de la épica bajo `## [x.y.z]` → `versionSource: changelog`.
3. Ninguna → `NO_VERSION`: el mensaje nombra el motivo (`unreleased`: «la entrada de EPIC-NN sigue en [Unreleased]: promuévela a ## [x.y.z] al liberar»; `no-block` / `no-changelog`: «no se encontró la entrada de EPIC-NN en CHANGELOG.md») y pide reejecutar con `--version x.y.z`.

**Destino** // satisface: AC-1, CNF-2

`specs/flow/archive/<archiveDate>-<basename del directorio de la épica>/`. Regex de conteo: activas `^EPIC-\d{2,}-` en `specs/flow/`, archivadas `^\d{4}-\d{2}-\d{2}-EPIC-\d{2,}-` en `specs/flow/archive/`; `--id` acepta `^EPIC-\d{2,}$`; `--path` solo `^specs/flow/EPIC-\d{2,}-[^/]+$`.

### Flujos clave

**F1 — Cierre confirmado** // satisface: AC-1, CNF-1, CNF-3, SMOKE-8
1. `SKILL.md` resuelve `REPO_ROOT`, `CLI_ROOT` y el argumento; comprueba el motor y `node`.
2. `plan` → `ok: true`, `action: complete`, `version`, `to`, `moveMethod: git-mv`.
3. El skill muestra el resumen (estado, acción, versión y su fuente, origen, destino, método, avisos) y pregunta: `¿Confirmas que la versión <version> de <EPIC_ID> opera correctamente tras el despliegue y quieres completarla y archivarla en <to>/? (s/n)`.
4. `s`/`si`/`sí` → `apply` re-planifica, escribe el frontmatter, crea `specs/flow/archive/` si falta, mueve con `git mv`, verifica que activas + archivadas no cambió.
5. El skill muestra `✅ <EPIC_ID> archivada en <to>/ · COMPLETED/DONE · versión <version> · completed: <hoy>` y recuerda que el commit queda a cargo del usuario.

**F2 — Épica no liberada** // satisface: AC-2
`plan` → `ok: false`, `code: NOT_SHIPPED`. El skill carga `references/error-codes.md`, muestra `❌ <message>` y termina **sin preguntar**. Ningún archivo cambia ni se mueve.

**F3 — Sin confirmación** // satisface: AC-3, CNF-3
Pasos 1–3 de F1; cualquier respuesta distinta de `s`/`si`/`sí`, o ninguna → `Operación cancelada por el usuario: no hubo cambios.` y fin **sin invocar `apply`**. La épica sigue en `SHIP/DONE` dentro de `specs/flow/`.

**F4 — Épica ya completada** // satisface: CNF-2
`plan` → `action: archive-only`, `archiveDate` del frontmatter, sin versión. La pregunta y el resultado indican «sin cambio de status (ya COMPLETED/DONE)»; `apply` solo mueve.

**F5 — Movimiento fallido** // satisface: AC-1, CNF-1
`git mv` o `rename` fallan → `apply` restaura `epic.md` a su contenido previo (bytes originales) y devuelve `MOVE_FAILED`; si la restauración también falla, `ROLLBACK_FAILED` con `git checkout -- <from>/epic.md`.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Dónde vive el trabajo determinista | Motor propio `skills/epic-complete/scripts/epic-complete.js` con el contrato `plan`/`apply` de `story-complete.js` | (a) Pasos manuales en `SKILL.md`; (b) generalizar `story-complete.js` con un `--kind epic`; (c) módulo compartido en `scripts/` | (a) La operación es irreversible y no debe depender de que el agente siga pasos al pie de la letra; además infla `SKILL.md` (CNF-6). (b) Modifica un skill ya entregado y archivado, con riesgo de regresión, y acopla dos skills de niveles distintos. (c) Los skills se instalan desde `skills/<skill>/`; un `require` fuera del skill rompe su autonomía. La duplicación (~250 líneas) queda acotada y probada por separado | AC-1, CNF-6 |
| D-2 | Confirmación | Una sola pregunta `s/n` que nombra la versión y la verificación post-despliegue; sin modo automático ni `--yes` | (a) Dos preguntas (operatividad y cierre); (b) `--yes` para orquestadores | (a) Dos preguntas para una sola decisión no añaden control. (b) CNF-3 prohíbe archivar sin confirmación explícita; mismo criterio que `story-complete` | AC-1, AC-3, CNF-3 |
| D-3 | Todas las validaciones antes de preguntar | `plan` falla cerrado y el skill no pregunta ante `ok: false` | Preguntar y validar al aplicar | Confirmar una operación que luego aborta no aporta nada; AC-2 exige que nada cambie | AC-2 |
| D-4 | Fuente de la versión liberada | `--version` → sección de `CHANGELOG.md` que contiene el bloque de `epic-ship` → `NO_VERSION` | (a) Preguntar la versión en el chat; (b) leer `package.json › version`; (c) `git describe --tags` | (a) Añade un segundo turno interactivo y una entrada libre sin validar en el motor. (b) Solo vale para proyectos npm. (c) Depende de tags locales que el humano puede no haber traído; el `CHANGELOG.md` es el artefacto que `epic-ship` ya escribe y el humano promueve al liberar | AC-1 |
| D-5 | Dónde quedan fecha de cierre y versión | Claves opcionales `completed:` y `version:` en el frontmatter de `epic.md`, fuera del template | (a) Añadirlas a `docs/templates/epic-template.md`; (b) sección `## Cierre` en el cuerpo | (a) `epic-format-validation` exige toda clave del template: toda épica activa fallaría la validación. (b) El cuerpo lo gobiernan las secciones del template; el frontmatter es legible por máquina para medir el tiempo de ciclo | AC-1 |
| D-6 | Fecha del directorio | `complete` → hoy; `archive-only` → `updated:` → `created:`; `date:` solo si faltan ambas claves | Siempre hoy | CNF-2 y ADR-0017: una épica ya cerrada conserva la fecha de su cierre; regla idéntica a `archiveDateOf` de `story-complete.js` | CNF-2 |
| D-7 | Método de movimiento | `git mv` si `REPO_ROOT` es raíz del work tree y el directorio tiene archivos versionados; si no, `fs.renameSync` con aviso | Siempre `fs.renameSync` + `git add` | `git mv` deja el rename en el índice sin commit (CNF-1); el renombre simple cubre repos sin historial sin fallar | AC-1, CNF-1 |
| D-8 | Orden de `apply` | Re-planificar → escribir `epic.md` → mover → restaurar si el movimiento falla → verificar conteo | Mover y después escribir en el destino | Escribir primero permite restaurar en la ubicación original; mismo orden que D-5 de STORY-160 | AC-1 |
| D-9 | Estados `CANCELED/*` en esta historia | Rechazo `NOT_SHIPPED` con el mensaje literal de AC-2 | Implementar ya `archive-canceled` | Fuera de alcance (STORY-172); la tabla de admisión es el punto de extensión (CR-001) | AC-2 |
| D-10 | Detalle de errores | `references/error-codes.md` cargado solo ante `ok: false` | Tabla completa en `SKILL.md` | CNF-5 y CNF-6: el camino feliz no paga el catálogo de errores (en `story-complete` son 15 filas) | CNF-5, CNF-6 |

### Decisiones de complejidad justificada

- **Motor JS en lugar de instrucciones:** un cambio de status terminal más un `git mv` con restauración no es delegable a texto sin perder determinismo ni testabilidad (`node --test` no consume cuota de evals). Es la misma justificación que dio origen a `story-complete.js`.
- **`--version` opcional:** existe porque la fuente principal (`CHANGELOG.md`) puede no estar promovida o el proyecto no usar el bloque de `epic-ship`; sin él, la única salida sería editar `CHANGELOG.md` para poder cerrar.
- **Sin flags adicionales (`--dry-run`, `--yes`):** `plan` ya es el dry-run y la confirmación es obligatoria (YAGNI).

### Puntos de variación (P6)

- **Estados admitidos:** la tabla de admisión de `planCompletion` es el único lugar que decide por estado; STORY-172 añade `CANCELED/DONE → archive-canceled` y `CANCELED/* → CANCELED_NOT_DONE` sin tocar el resto.
- **Fuente de la versión:** encapsulada en `releasedVersionOf`; otra convención de `CHANGELOG.md` solo cambia esa función.
- **Layout del archivo:** constantes `FLOW`/`ARCHIVE` y regex al inicio del motor, como en `story-complete.js`.

### Degradación gradual (P7)

| Dependencia o fallo | Comportamiento |
|---|---|
| `node` ausente o motor no encontrado | `❌ No se encontró el motor de epic-complete (<ruta probada>) o node no está en PATH`; nada cambia |
| `git` ausente, sin repo o directorio sin historial | Movimiento con `rename` y aviso `⚠️ <dir> no tiene historial de git: se moverá sin git mv` |
| `CHANGELOG.md` ausente o sin el bloque | `NO_VERSION` con instrucción de `--version`; nada cambia |
| Error de E/S al escribir `epic.md` | `WRITE_FAILED`; nada movido |
| Falla el movimiento | `MOVE_FAILED` con `epic.md` restaurado; si la restauración falla, `ROLLBACK_FAILED` con el comando de recuperación |
| Conteo distinto tras mover | `COUNT_MISMATCH` con ambas cifras; el directorio queda movido para revisión manual |
| El filesystem cambió entre `plan` y `apply` | `apply` re-planifica y falla cerrado con el código correspondiente |

### Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `SHIP/DONE` + `apply`: `epic.md` con `status: COMPLETED`, `substatus: DONE`, `updated`/`completed` de hoy y `version`; directorio en `specs/flow/archive/<hoy>-EPIC-NN-<slug>/`; ausente de `specs/flow/` | `test/epic-complete.test.js` (repo temporal) | AC-1 |
| 2 | Con historial, `git status --porcelain` muestra el rename `R` y no hay commit nuevo | `test/epic-complete.test.js` | AC-1, CNF-1 |
| 3 | Versión: `--version` gana; bloque bajo `## [x.y.z]` la resuelve; bajo `[Unreleased]` o sin bloque → `NO_VERSION` sin cambios; `--version` distinta de `CHANGELOG.md` → aviso | `test/epic-complete.test.js` (`releasedVersionOf` y `planCompletion`) | AC-1 |
| 4 | `VALIDATE/DONE`, `DEVELOP/IN-PROGRESS` y `CANCELED/DONE` → `NOT_SHIPPED` con el mensaje de AC-2; árbol de archivos idéntico antes y después | `test/epic-complete.test.js` | AC-2 |
| 5 | `COMPLETED/DONE` → `archive-only` con la fecha de `updated:`/`created:`/`date:`; `epic.md` byte a byte igual; sin fecha válida → `NO_ARCHIVE_DATE` | `test/epic-complete.test.js` | CNF-2 |
| 6 | `NOT_FOUND` (con pista si ya está archivada), `AMBIGUOUS`, `INVALID_PATH`, `NO_EPIC_FILE`, `NO_STATUS`, `ARCHIVE_CONFLICT` sin cambios | `test/epic-complete.test.js` | AC-2 |
| 7 | Movimiento forzado a fallar → `MOVE_FAILED` y `epic.md` restaurado; finales de línea CRLF conservados al escribir | `test/epic-complete.test.js` | AC-1 |
| 8 | CLI: exit `0`/`1`/`2` y un único JSON en stdout | `test/epic-complete.test.js` (`spawnSync`) | AC-1, AC-2 |
| 9 | `SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, tiene `evals/evals.json` con `TC-NNN` y < 200 líneas | `npm run verify:repository` + revisión | CNF-4, CNF-6 |
| 10 | Con `s`: resumen, pregunta y `✅` con la ruta final (= SMOKE-8) | Eval TC-001 | AC-1 |
| 11 | `VALIDATE/DONE`: mensaje de rechazo y ninguna pregunta | Eval TC-002 | AC-2 |
| 12 | Respuesta `n`: `Operación cancelada…`; la épica sigue en `SHIP/DONE` en `specs/flow/` | Eval TC-003 | AC-3 |
| 13 | `npm run verify:repository` y `npm test` pasan | Gate determinista | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Omisiones:** cada AC y CNF tiene al menos un componente y un contrato de verificación. CNF-4 (layout fijo) lo cubre el `SKILL.md` y lo verifica `verify-fixed-layout.js`.
- **Ambigüedad:** «fechas de cierre y versión liberada» se concreta en `completed:` y `version:` (D-5), con la fuente de versión fijada (D-4).
- **Nombres:** se usa «completar» para `SHIP → COMPLETED` y «archivar» para el movimiento, como `story-complete`; `action` conserva `complete` / `archive-only`.
- **Estructura:** sin ciclos (`SKILL.md` → motor → filesystem/git); el motor no conoce al skill y el skill solo lee el JSON del motor. Cada función del motor tiene una responsabilidad (`locateEpic`, `releasedVersionOf`, `archiveDateOf`, `planCompletion`, `applyCompletion`).

## Risks / Trade-offs

- [Duplicación con `story-complete.js`] → acotada a utilidades de frontmatter, movimiento y conteo; ambas copias tienen pruebas propias. Si aparece un tercer motor de archivo, extraer un módulo común es una decisión nueva (ADR o historia propia).
- [STORY-170 aún no implementado: el formato del bloque de `CHANGELOG.md` puede cambiar] → `releasedVersionOf` solo depende del delimitador `<!-- epic-ship:EPIC-NN:start -->` fijado en el diseño de STORY-170; `--version` cubre cualquier desviación. Las pruebas usan fixtures propios.
- [STORY-175 no entregado: archivar épicas contradice ADR-0017] → la historia exige el orden de entrega STORY-175 → STORY-171; el skill se desarrolla y prueba sobre fixtures.
- [Épicas archivadas no visibles para otros skills] → `epic-generate-stories` ya excluye `specs/flow/archive/`; la numeración y `epic-analyze` los ajusta STORY-175.

## Open Questions

Ninguna: las decisiones abiertas quedan resueltas en D-1 a D-10 o registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-2 exige el mensaje «solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE», pero la rama `CANCELED/DONE` es de STORY-172. Mientras STORY-172 no se entregue, una épica `CANCELED/DONE` recibe ese mismo rechazo pese a que el mensaje la nombra.
- **Documento afectado**: design.md (D-9) · STORY-172
- **Acción requerida**: entregar STORY-172 en la misma versión que STORY-171; STORY-172 extiende la tabla de admisión con `archive-canceled` y `CANCELED_NOT_DONE`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `epic-complete` escribe las claves opcionales `completed:` y `version:` en `epic.md` (D-5), que no figuran en `docs/templates/epic-template.md` ni en `domain-epic-lifecycle`.
- **Documento afectado**: STORY-175 (`docs/domains/domain-epic-lifecycle.md`)
- **Acción requerida**: al documentar a `epic-complete` como escritor de `COMPLETED` de épica, STORY-175 nombra también esas dos claves y su escritor.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: la línea F2 de STORY-171 en `epic.md` todavía dice «Incluye el ADR nuevo que reemplaza a ADR-0017 y el ajuste de los documentos de dominio», alcance que el split del 2026-10-29 movió a STORY-175, y STORY-175 no figura en el índice de historias de la épica. `docs/index.md` enlaza STORY-171 con el slug anterior (`STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada`).
- **Documento afectado**: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` · `docs/index.md`
- **Acción requerida**: corregir el índice de la épica con `/epic-refine EPIC-23` (o a mano) y regenerar el índice con `/memory-system index`. No bloquea esta historia.
