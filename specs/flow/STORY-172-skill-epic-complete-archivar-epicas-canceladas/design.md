---
alwaysApply: false
type: design
id: STORY-172
slug: STORY-172-skill-epic-complete-archivar-epicas-canceladas-design
title: "Design: Skill epic-complete — archivar épicas canceladas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-172
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
  - EPIC-23-completar-flujo-de-epic
  - STORY-171-completar-archivar-epica-liberada
  - STORY-164-archivar-historias-canceladas
---

<!-- Referencias -->
[[STORY-172-skill-epic-complete-archivar-epicas-canceladas]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-171-completar-archivar-epica-liberada]] · [[STORY-164-archivar-historias-canceladas]]

## Context

`/epic-complete EPIC-NN` (STORY-171) completa y archiva épicas `SHIP/DONE` y archiva sin reescribir las `COMPLETED/DONE`. Esta historia añade la tercera rama de CS-19: una épica `CANCELED/DONE` se archiva en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` **conservando** `status: CANCELED` / `substatus: DONE`, para que en el registro histórico no se confunda con una liberada.

Estado verificado en el filesystem (2026-10-29):

- **Dependencia directa:** `skills/epic-complete/` todavía no existe. STORY-171 está en `READY-FOR-IMPLEMENT/DONE` y su `design.md` fija el motor `skills/epic-complete/scripts/epic-complete.js` (contrato `plan`/`apply`, JSON único en stdout), `SKILL.md`, `references/error-codes.md`, `README.md`, `evals/evals.json` y `test/epic-complete.test.js`. Su tabla de admisión rechaza hoy `CANCELED/*` con `NOT_SHIPPED` (D-9) y deja la extensión a esta historia (CR-001 y «Puntos de variación» de STORY-171). Este diseño se aplica **sobre** esos artefactos una vez implementados.
- **Antecedente (P3):** STORY-164 resolvió lo mismo para historias en `skills/story-complete/scripts/story-complete.js` (líneas 158–166 y 267): `CANCELED/DONE` → `action: archive-canceled` sin escritura previa; `CANCELED/<otro>` → `CANCELED_NOT_DONE`; fecha de archivo con `archiveDateOf` (`updated:` → `created:`; `date:` solo si faltan ambas); mensaje `archivada como CANCELED (status sin cambios)`. `test/story-complete.test.js` (líneas 157–210) y `skills/story-complete/evals/evals.json` cubren esos casos. Esta historia replica ese patrón en el motor de épica.
- **Conflicto de destino (AC-3):** el `ARCHIVE_CONFLICT` de STORY-171 se evalúa en `planCompletion` tras resolver `archiveDate` para cualquier acción, así que la rama nueva lo hereda sin código propio.
- **Layout:** ADR-0017 y la habilitación de épicas archivadas (STORY-175) fijan el destino; esta historia no edita ADR ni documentos de dominio.
- **Stack:** Node.js CommonJS sin dependencias, `node:test` + `node:assert/strict` en `test/`.

## Goals / Non-Goals

**Goals:**

- Admitir `CANCELED/DONE` en la tabla de admisión con `action: archive-canceled`: mover el directorio a `specs/flow/archive/<archiveDate>-EPIC-NN-<slug>/` sin escribir `epic.md` // satisface: AC-1, CNF-1
- Rechazar `CANCELED/<substatus ≠ DONE>` con `CANCELED_NOT_DONE`, sin preguntar y sin cambios // satisface: AC-2
- Heredar el rechazo `ARCHIVE_CONFLICT` cuando el destino existe // satisface: AC-3
- Pedir confirmación explícita que nombra que el status no cambia // satisface: AC-1, CNF-2
- Mantener `SKILL.md` compacto: la rama nueva añade filas a tablas existentes y su detalle de error va a `references/error-codes.md` // satisface: CNF-3, CNF-4

**Non-Goals:**

- Cancelar una épica (escribir `status: CANCELED`).
- Archivar las historias hijas de la épica cancelada (lo hace `/story-complete`, que ya admite `CANCELED/DONE`).
- Resolver versión liberada o escribir `completed:`/`version:` para una cancelada.
- Cambiar el ADR, `AGENTS.md`, `docs/constitution.md` o los documentos de dominio (STORY-175).

## Decisions

### Componentes

| Componente | Acción | Ubicación | Responsabilidad del cambio | AC que satisface |
|---|---|---|---|---|
| Motor de cierre de épica | modificar | `skills/epic-complete/scripts/epic-complete.js` | Tabla de admisión de `planCompletion` con `archive-canceled` y `CANCELED_NOT_DONE`; `archiveDate` por `archiveDateOf`; mensaje de éxito de `applyCompletion`; cabecera de uso | AC-1, AC-2, AC-3, CNF-1 |
| Skill `epic-complete` | modificar | `skills/epic-complete/SKILL.md` | Fila `CANCELED/DONE` y fila de rechazo en Precondiciones; variante de pregunta y de línea `✅` para `archive-canceled`; `description` con el disparador «archivar épica cancelada» | AC-1, AC-2, CNF-2, CNF-3, CNF-4 |
| Catálogo de errores | modificar | `skills/epic-complete/references/error-codes.md` | Fila `CANCELED_NOT_DONE`; `NOT_SHIPPED` pasa a describir «estado distinto de `SHIP/DONE`, `COMPLETED/DONE` y `CANCELED/*`»; `NO_ARCHIVE_DATE` cubre también `CANCELED/DONE` | AC-2, CNF-3 |
| Ficha del skill | modificar | `skills/epic-complete/README.md` | Estados admitidos con `CANCELED/DONE`; retirar la exclusión «`CANCELED/DONE` hasta STORY-172» | CNF-4 |
| Evals | modificar | `skills/epic-complete/evals/evals.json` | Casos nuevos `TC-NNN` para AC-1, AC-2 y AC-3 de esta historia | AC-1, AC-2, AC-3 |
| Pruebas del motor | modificar | `test/epic-complete.test.js` | Sección «STORY-172»: el caso `CANCELED/DONE → NOT_SHIPPED` de STORY-171 se reemplaza por `archive-canceled`; casos nuevos (contratos 1–6) | AC-1, AC-2, AC-3, CNF-1 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (fila de `epic-complete`) | Añadir «o archiva una `CANCELED/DONE` sin cambiar su status» | CS-19 |
| `CHANGELOG.md` | modificar | `CHANGELOG.md › ## [Unreleased] › ### Added` (o `### Changed` si la entrada de STORY-171 ya está liberada) | Entrada: `epic-complete` archiva épicas `CANCELED/DONE` (STORY-172) | CS-19 |

No se crean archivos nuevos. `package.json` no cambia (`files` ya publica `skills/`). Las copias de runtime (`.claude/`, `.codex/`, `.agents/`) son salida de `agile-sddf install`.

### Interfaces

| Interfaz | Contrato (cambio) | AC que satisface |
|---|---|---|
| CLI del motor | Sin cambios de argumentos. `--version` se ignora con `archive-canceled` (no se valida contra `CHANGELOG.md` ni se escribe) | AC-1 |
| Salida del motor | `action` admite el valor nuevo `archive-canceled`; `code` admite `CANCELED_NOT_DONE`. Con `archive-canceled`: `version: null`, `versionSource: null` | AC-1, AC-2 |
| `planCompletion` | Tabla de admisión ampliada (ver Esquema); `CANCELED/DONE` sigue el camino de `archive-only` para fecha y destino | AC-1, AC-2, AC-3 |
| `applyCompletion` | `archive-canceled` no escribe `epic.md` (como `archive-only`); éxito → `message: "EPIC-NN archivada como CANCELED (status sin cambios): <to>/"`; `MOVE_FAILED` → «`epic.md` no se modificó» | AC-1, CNF-1 |
| Pregunta de confirmación (`SKILL.md`) | `¿Confirmas archivar <EPIC_ID> (CANCELED/DONE, el status no cambia) en <to>/? (s/n)` | AC-1, CNF-2 |
| Línea de éxito (`SKILL.md`) | `✅ <EPIC_ID> archivada como CANCELED (status sin cambios): <to>/` | AC-1 |

### Esquema de datos

**Tabla de admisión por estado** (reemplaza la de STORY-171; única fuente de decisión en `planCompletion`) // satisface: AC-1, AC-2

| `status` / `substatus` | `action` / `code` | Escribe `epic.md` | Versión | Fecha del directorio |
|---|---|---|---|---|
| `SHIP` / `DONE` | `complete` | sí | requerida | hoy |
| `COMPLETED` / `DONE` | `archive-only` | no | — | `updated:` → `created:`; `date:` solo si faltan ambas |
| `CANCELED` / `DONE` | `archive-canceled` | **no** | — | `updated:` → `created:`; `date:` solo si faltan ambas |
| `CANCELED` / otro substatus | `CANCELED_NOT_DONE` | no | — | — |
| cualquier otro par | `NOT_SHIPPED` | no | — | — |

El orden de evaluación es el de la tabla: `CANCELED/*` se evalúa antes del caso general, de modo que una cancelada nunca recibe `NOT_SHIPPED` ni la sugerencia `/epic-ship`.

**Mensaje de `CANCELED_NOT_DONE`** (AC-2): `La épica EPIC-NN no puede archivarse: estado actual CANCELED/<substatus>. Solo se archivan las épicas canceladas con substatus DONE.` Sin sugerencia de otro comando (una cancelada no se libera).

**Fecha de archivo** (`archive-canceled`): `archiveDateOf(frontmatter)` ya portada de `story-complete.js` en STORY-171. Sin fecha válida → `NO_ARCHIVE_DATE` nombrando `updated:`, `created:` y `date:` (mismo mensaje que `archive-only`). La fecha es la del último cambio registrado, no la de hoy, como fija ADR-0017 para las canceladas.

**Conflicto de destino** (AC-3): sin cambio respecto de STORY-171: si `specs/flow/archive/<archiveDate>-<basename>/` existe → `ARCHIVE_CONFLICT` con la ruta, antes de preguntar.

### Flujos clave

**F1 — Archivar una cancelada** // satisface: AC-1, CNF-1, CNF-2
1. `SKILL.md` resuelve `REPO_ROOT`, `CLI_ROOT` y el argumento; invoca `plan`.
2. `plan` → `ok: true`, `action: archive-canceled`, `archiveDate` del frontmatter, `version: null`, `to`, `moveMethod`.
3. El skill muestra el resumen con `Acción: sin cambio de status (CANCELED/DONE)` y pregunta `¿Confirmas archivar EPIC-NN (CANCELED/DONE, el status no cambia) en <to>/? (s/n)`.
4. `s`/`si`/`sí` → `apply`: re-planifica, no escribe `epic.md`, crea `specs/flow/archive/` si falta, mueve con `git mv` (o `rename` con aviso), verifica el conteo activas + archivadas.
5. `✅ EPIC-NN archivada como CANCELED (status sin cambios): <to>/` y recordatorio de que el commit queda a cargo del usuario. `epic.md` queda byte a byte igual en el destino.

**F2 — Cancelada sin cerrar** // satisface: AC-2
`plan` → `ok: false`, `code: CANCELED_NOT_DONE`. El skill carga `references/error-codes.md`, muestra `❌ <message>` y termina sin preguntar. Nada cambia ni se mueve.

**F3 — Destino existente** // satisface: AC-3
`plan` → `ok: false`, `code: ARCHIVE_CONFLICT` con `to`. Igual que F2: `❌ El destino <to>/ ya existe…` sin preguntar ni mover.

**F4 — Sin confirmación** // satisface: CNF-2
Pasos 1–3 de F1; cualquier respuesta distinta de `s`/`si`/`sí` → `Operación cancelada por el usuario: no hubo cambios.` sin invocar `apply`.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Dónde se implementa la rama | Extender la tabla de admisión de `planCompletion` en el motor de STORY-171 | (a) Skill aparte `epic-archive-canceled`; (b) instrucciones en `SKILL.md` que muevan sin pasar por el motor | (a) Duplica motor, evals y registro para una fila de tabla; la historia exige el mismo comando `/epic-complete`. (b) Rompe el contrato «toda escritura/movimiento la hace el motor» y pierde la restauración y el conteo | AC-1 |
| D-2 | Escritura de `epic.md` | Ninguna (`archive-canceled` solo mueve) | (a) Actualizar `updated:` a hoy; (b) añadir `archived:` | CNF-1 prohíbe escribir `status`/`substatus`; tocar `updated:` cambiaría además la fecha que define el directorio en futuras lecturas. Simetría con `story-complete` (STORY-164) | AC-1, CNF-1 |
| D-3 | Fecha del directorio | `archiveDateOf` (`updated:` → `created:` → `date:`) | (a) Hoy; (b) preguntar la fecha | ADR-0017 fija esa regla para archivar sin cambio de status; (a) haría que la fecha reflejara el archivado y no la cancelación; (b) añade un turno interactivo sin necesidad | AC-1 |
| D-4 | Código para `CANCELED/<≠DONE>` | Código propio `CANCELED_NOT_DONE` con mensaje sin sugerencia de comando | Reutilizar `NOT_SHIPPED` | `NOT_SHIPPED` sugiere `/epic-ship`, que no aplica a una cancelada; AC-2 exige un mensaje específico; mismo criterio que `story-complete` | AC-2 |
| D-5 | `--version` con una cancelada | Se ignora en silencio (no se valida ni se escribe) | (a) Error de argumentos; (b) aviso en `warnings` | Una cancelada no tiene versión; rechazar el flag no protege nada y un aviso añadiría ruido. La versión solo participa en `complete` | AC-1 |
| D-6 | Conflicto de destino | Reutilizar `ARCHIVE_CONFLICT` de STORY-171 sin cambios | Código específico para canceladas | El chequeo ya es independiente de la acción; AC-3 solo exige nombrar la ruta y no mover | AC-3 |
| D-7 | Confirmación | Variante de pregunta que nombra «el status no cambia»; sin `--yes` | Reutilizar la pregunta de `archive-only` | El humano debe ver explícitamente que la épica seguirá figurando como `CANCELED` (CNF-2, motivo de la historia) | AC-1, CNF-2 |

### Decisiones de complejidad justificada

- **Una acción nueva en lugar de reutilizar `archive-only`:** ambas solo mueven, pero distinguirlas permite la pregunta y el mensaje de éxito que declaran el status `CANCELED` y deja trazable en el JSON por qué se archivó. Es una cadena más en la tabla de admisión, no una función nueva.
- **Sin cambios de CLI ni flags:** el flujo cabe en el contrato existente (YAGNI).

### Puntos de variación (P6)

- **Estados admitidos:** siguen concentrados en la tabla de admisión de `planCompletion`.
- **Regla de fecha:** `archiveDateOf` es compartida por `archive-only` y `archive-canceled`; un cambio de ADR la ajusta en un solo lugar.

### Degradación gradual (P7)

| Dependencia o fallo | Comportamiento |
|---|---|
| Motor ausente (STORY-171 no entregada) | `❌ No se encontró el motor de epic-complete…` (heredado); esta historia no se entrega antes que STORY-171 |
| `CANCELED/DONE` sin fecha válida | `NO_ARCHIVE_DATE`; nada cambia |
| Falla el movimiento | `MOVE_FAILED` con «`epic.md` no se modificó»; no hay nada que restaurar |
| Conteo distinto tras mover | `COUNT_MISMATCH` (heredado) |
| Sin historial de git | `rename` con aviso (heredado) |

### Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `CANCELED/DONE` → `plan` con `action: archive-canceled` y `archiveDate` de `updated:`, de `created:` y de `date:` (solo sin las otras dos) | `test/epic-complete.test.js` | AC-1 |
| 2 | `CANCELED/DONE` + `apply` → directorio en `specs/flow/archive/<archiveDate>-EPIC-NN-<slug>/`, ausente de `specs/flow/`, `epic.md` byte a byte igual con `status: CANCELED` y `substatus: DONE`, `message` con `archivada como CANCELED (status sin cambios)` | `test/epic-complete.test.js` | AC-1, CNF-1 |
| 3 | Con historial: `git status --porcelain` muestra rename `R` y no hay commit nuevo | `test/epic-complete.test.js` | AC-1 |
| 4 | `CANCELED/IN-PROGRESS` → `CANCELED_NOT_DONE` con el estado y «solo se archivan las épicas canceladas con substatus DONE», sin `/epic-ship`; snapshot de archivos idéntico | `test/epic-complete.test.js` | AC-2 |
| 5 | `CANCELED/DONE` con destino existente → `ARCHIVE_CONFLICT` con la ruta; snapshot idéntico | `test/epic-complete.test.js` | AC-3 |
| 6 | `CANCELED/DONE` sin fecha válida → `NO_ARCHIVE_DATE`; `--version` presente no altera el resultado (`version: null`) | `test/epic-complete.test.js` | AC-1 |
| 7 | Eval: `CANCELED/DONE` + `s` → pregunta con «el status no cambia» y `✅ … archivada como CANCELED (status sin cambios)` | `evals.json` | AC-1, CNF-2 |
| 8 | Eval: `CANCELED/IN-PROGRESS` → mensaje de rechazo sin `¿Confirmas` | `evals.json` | AC-2 |
| 9 | Eval: `CANCELED/DONE` con destino existente → ruta en conflicto sin `¿Confirmas` ni `archivada` | `evals.json` | AC-3 |
| 10 | `SKILL.md` sigue < 200 líneas y con `<!-- SDDF-FIXED-LAYOUT: v1 -->`; `npm run verify:repository` y `npm test` pasan | Gate determinista | CNF-3, CNF-4, CS-21 |

### Autoevaluación (P9, P10, P11)

- **Omisiones:** AC-1 (contratos 1–3, 7), AC-2 (4, 8), AC-3 (5, 9), CNF-1 (2), CNF-2 (7, D-7), CNF-3/CNF-4 (10).
- **Ambigüedad:** la fecha `<YYYY-MM-DD>` de AC-1 se fija con D-3; el mensaje de AC-2 queda literal.
- **Nombres:** «archivar» para el movimiento; `archive-canceled` y `CANCELED_NOT_DONE` coinciden con `story-complete` para que ambos skills hablen igual.
- **Estructura:** sin dependencias nuevas; la rama reutiliza `archiveDateOf`, `ARCHIVE_CONFLICT`, `moveEpic` y el conteo sin acoplarse a `complete`.

## Risks / Trade-offs

- [STORY-171 no implementada: los nombres de funciones o el orden de chequeos pueden cambiar al implementarla] → este diseño solo depende de la tabla de admisión y de `archiveDateOf`, ambos fijados en el design de STORY-171; la tarea de implementación se verifica contra el código real antes de editar.
- [El caso `CANCELED/DONE → NOT_SHIPPED` de las pruebas y el `README.md` de STORY-171 queda obsoleto] → se reemplaza explícitamente en esta historia (Componentes).
- [Una épica cancelada archivada deja historias hijas activas] → fuera de alcance; `/story-complete` archiva las `CANCELED/DONE`.

## Open Questions

Ninguna: las decisiones quedan resueltas en D-1 a D-7 o registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: todos los componentes que esta historia modifica los crea STORY-171 (`READY-FOR-IMPLEMENT/DONE`, sin implementar). El orden de entrega obligatorio es STORY-175 → STORY-171 → STORY-172.
- **Documento afectado**: design.md · tasks.md
- **Acción requerida**: no iniciar la implementación de STORY-172 hasta que `skills/epic-complete/scripts/epic-complete.js` exista y `npm test` pase con `test/epic-complete.test.js`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: `story.md` declara en `related:` el slug obsoleto `STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada`; el directorio real es `STORY-171-completar-archivar-epica-liberada`.
- **Documento afectado**: story.md
- **Acción requerida**: corregir el slug en `related:` de `story.md` (o con `/epic-refine EPIC-23`). No bloquea el diseño.
