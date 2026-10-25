---
alwaysApply: false
type: design
id: STORY-157
slug: STORY-157-reparar-enlaces-tras-migracion-design
title: "Design: Reparar enlaces y validar el gate tras la migración"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-157
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-157-reparar-enlaces-tras-migracion
  - STORY-153-migrar-work-items-specs-flow
  - STORY-154-documentar-el-nuevo-layout
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-157-reparar-enlaces-tras-migracion]] · [[STORY-153-migrar-work-items-specs-flow]] · [[STORY-154-documentar-el-nuevo-layout]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

Es la última historia de EPIC-26 (`chore` de un solo uso). Parte del árbol que deja STORY-153 (work items movidos con `git mv` a `specs/flow/` y `specs/flow/archive/`, `docs/specs/README.md` → `specs/README.md`), repara las referencias que quedaron apuntando a `docs/specs/` y comprueba el contrato de salida global (CS-2, CS-3, CS-12). No mueve work items, no documenta el layout (STORY-154) y no migra skills.

Estado verificado en el filesystem (2026-10-22, antes de STORY-153):

| Fuente | Hallazgo |
|---|---|
| `git grep -lE "specs/(epics\|stories)"` | 226 archivos: 128 en `docs/specs/` (work items), 72 en `skills/`, 1 `docs/index.md` (224 líneas), 5 `docs/guides/`, 4 `docs/adr/`, 3 `test/`, 3 `docs/product/`, 2 `docs/domains/`, 2 `docs/architecture/`, 1 cada uno en `scripts/`, `docs/runbooks/`, `docs/guardrails/`, `docs/constitution.md`, `README.md`, `CHANGELOG.md`. |
| Enlaces entre work items | Un solo enlace Markdown en `docs/specs/` apunta a otro work item, y es absoluto (`D:/code/…`, `STORY-130/story-improvement-log.md:13`, registro histórico). Los work items se relacionan por **wikilinks de slug** (`[[STORY-…]]`), que no dependen de la ruta. |
| `scripts/check-doc-links.js` | Solo valida los archivos de `ACTIVE_ROOTS` (`README.md`, `SECURITY.md`, `docs/index.md`, `docs/constitution.md`, `docs/policies`, `docs/guardrails`, `docs/guides`, `docs/runbooks`). El **índice de slugs** para resolver wikilinks recorre solo `docs/` más `README.md`/`SECURITY.md` (`checkDocumentation`, l. 244–250). `HISTORICAL_EXCLUSIONS` (`CHANGELOG.md`, `docs/adr`, `docs/specs`) solo se imprime en el `[INFO]` final; no filtra nada. |
| `docs/index.md` | Lo genera `/memory-system index`. 224 líneas con `[[<slug>]] — [epic.md](specs/epics/…)` o `(specs/stories/…)`, y l. 154 `[[specs-index]] — [README.md](specs/README.md)`. Tras STORY-153 fallan los enlaces Markdown **y** los wikilinks (los slugs de los work items ya no están bajo `docs/`). STORY-152 D-4 cambia el motor para indexar `specs/flow/` con rutas `../specs/flow/…`. |
| `docs/guardrails/gr-ai-security-checklist.md:170–173` | Cuatro rutas concretas de work items (`EPIC-17/plan-13-…md`, `STORY-039`, `STORY-046`, `STORY-087`) en code spans; STORY-154 D-2 las deja «para STORY-157». |
| `docs/runbooks/actualizar-spec-de-proyecto.md:85–99, 118–119` | Comandos `ls`/`grep` sobre `docs/specs/epics/` y `docs/specs/stories/`. STORY-154 CR-001 los dejó sin dueño. |
| `docs/domains/domain-knowledge-artifacts.md` (l. 101–102, 244), `docs/domains/domain-work-item-hierarchy.md` (l. 44–45, 67–68, 78), `docs/product/README.md:22`, `docs/product/stakeholders.md:41` | Describen como vigente la ubicación `specs/epics/`/`specs/stories/`. STORY-154 CR-001 los dejó sin dueño. `docs/product/roadmap.md` (l. 66, 87) cita rutas dentro de propuestas fechadas: el roadmap es append-only (`project-planning`). |
| `sddf.config.yaml` | l. 4–5: comentario «Raíz versionada… SDDF_ROOT…» y `root: docs`; l. 72: comentario `$SPECS_BASE/guardrails/<slug>.md`. STORY-153 CR-003 asigna su retiro a esta historia. Ningún script ni el contrato de configuración (`verify-config-contract.js`) exige la clave. |
| `AGENTS.md` | STORY-154 D-4 añade la viñeta «Transición EPIC-26» y su CR-002 asigna su retiro a esta historia. |
| `test/check-doc-links.test.js` | El fixture crea `docs/specs` (l. 19) y un caso de deduplicación de slugs usa `docs/specs/epics/EPIC-01-a/` (l. 73–74). Ningún caso cubre un wikilink cuyo slug vive fuera de `docs/`. |
| `scripts/verify-repository.js` | Paso `enlaces activos` (`check-doc-links.js`) y paso del contrato de layout fijo (STORY-148 lo cambia a `verify-fixed-layout.js`); `PENDING_MIGRATION` y la región `SDDF-LEGACY-DIAGNOSTIC` de `skill-preflight` los define STORY-148 D-3/D-4. |
| `scripts/migrate-finvest-field.js:29`, `test/memory-system.test.js`, `test/epic-template.test.js` | Default histórico de una migración de un solo uso (STORY-090) y fixtures del soporte de layout legado de `memory-system` (alcance de STORY-152). No son referencias del repo a rutas movidas. |

Stakeholders: el mantenedor que cierra EPIC-26 (AC-3) y el lector de la wiki (`AGENTS.md → docs/index.md`) que navega a los work items.

## Goals / Non-Goals

**Goals:**
- Verificar las precondiciones de cierre antes de editar nada y devolver los defectos a su historia dueña // satisface: AC-3
- Regenerar `docs/index.md` sobre el árbol migrado // satisface: AC-1
- Resolver wikilinks a work items en el checker de enlaces, cuyo índice de slugs no ve `specs/` // satisface: AC-1
- Reescribir las referencias concretas y descriptivas que quedan hacia `docs/specs/`, `specs/epics/` y `specs/stories/` en la documentación vigente, con una regla de clasificación explícita // satisface: AC-1
- Retirar los restos de la transición que otras historias asignaron aquí: `root: docs` del `sddf.config.yaml` del repo y la viñeta «Transición EPIC-26» de `AGENTS.md` // satisface: AC-3
- Verificar `git log --follow`, `docs/requirements/` intacto y el contrato de salida global // satisface: AC-2, AC-3

**Non-Goals:**
- Mover o archivar work items, o editar su contenido (STORY-153; los work items son registro histórico)
- Documentar el layout o reescribir guías, constitución, `README.md` y arquitectura (STORY-154)
- Migrar skills o editar sus fixtures (STORY-149 a STORY-152, STORY-155, STORY-156, STORY-158)
- Crear un skill o un script reutilizable de reparación (CNF-1)
- Editar ADRs, `CHANGELOG.md` o propuestas fechadas de `docs/product/roadmap.md`
- Migrar proyectos instalados; retirar `PENDING_MIGRATION` del validador
- Hacer commit, push o PR

## Decisions

### D-1 — Puerta de entrada y devolución de defectos // satisface: AC-3

Antes de cualquier edición se comprueban, en orden, las precondiciones de la historia; si una falla, se detiene sin editar y se informa la historia dueña:

| # | Comprobación | Si falla |
|---|---|---|
| P1 | `test ! -e docs/specs` y existen `specs/flow/` y `specs/flow/archive/` | STORY-153 no ejecutada → detener |
| P2 | La migración está **commiteada**: `git status --porcelain -- specs docs/specs` sin entradas `R`/`D` pendientes y `git log --diff-filter=R --format=%H -1 -- specs/flow` devuelve el commit de migración (`MIGRATION_COMMIT`) | `git log --follow` no puede ver el renombre → pedir al mantenedor el commit de STORY-153 (CR-003) |
| P3 | `PENDING_MIGRATION` de `scripts/verify-fixed-layout.js` es `[]` | devolver cada skill listado a su historia (tabla siguiente) |
| P4 | `docs/adr/ADR-0016-*.md` existe; `AGENTS.md` contiene la viñeta «Transición EPIC-26» (STORY-154 entregada) | STORY-147 / STORY-154 → detener |

Propiedad de los skills para la devolución (D-8 la usa también): `sddf-init` → STORY-149; skills de especificación → STORY-150; `epic-*` → STORY-151; skills de proyecto y transversales (`memory-system`, `skill-preflight`, `project-*`, `sddf-constitution`, …) → STORY-152; planning → STORY-155; implementación → STORY-156; revisión, verificación y aceptación → STORY-158. La fuente de verdad es la tabla «Componentes afectados» del `design.md` de cada historia.

**Alternativas rechazadas:**
- **Reparar en esta historia el skill pendiente que se encuentre:** la historia lo prohíbe («esta historia no migra skills») y mezcla alcances revisados por separado.
- **Empezar por los enlaces y verificar al final:** con STORY-153 sin commitear, AC-2 no es verificable y el trabajo de enlaces se haría sobre un árbol que aún puede cambiar.

### D-2 — Clasificación de las referencias restantes // satisface: AC-1

Tras P1–P4, el inventario se recalcula sobre el árbol real (los números de Context son previos a STORY-153 y STORY-154):

`git grep -nE "docs/specs|specs/(epics|stories)" -- . ':!specs' ':!skills' ':!CHANGELOG.md' ':!docs/adr' ':!.tmp'`

Cada coincidencia se clasifica con las tres clases de STORY-154 D-2, más una de fixture:

| Clase | Criterio | Acción |
|---|---|---|
| **Ruta concreta de un work item** | Enlaza o cita un archivo real que se movió | Reescribir a su ruta nueva con D-3 |
| **Descripción del layout como vigente** | Dice dónde viven hoy las épicas o historias | Reescribir: `specs/flow/EPIC-NN-<slug>/`, `specs/flow/STORY-NNN-<slug>/`, `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` |
| **Registro histórico** | Versión, migración o propuesta pasada (CHANGELOG, ADRs, `roadmap.md`, tablas de migración de versiones anteriores en `README.md`, work items) | Conservar |
| **Fixture o default de código histórico** | Ruta dentro de una prueba de soporte legado o el default de una migración ya ejecutada (`test/memory-system.test.js`, `test/epic-template.test.js`, `scripts/migrate-finvest-field.js`) | Conservar (alcance de STORY-152 o histórico) |

Archivos a reescribir con lo que muestra el inventario a 2026-10-22 (se confirman con el inventario recalculado; lo que STORY-154 ya reescribió no se vuelve a tocar):

| Archivo | Clase | Cambio |
|---|---|---|
| `docs/index.md` | concreta | regeneración (D-4), no edición manual |
| `docs/guardrails/gr-ai-security-checklist.md:170–173` | concreta | las cuatro rutas → su destino según D-3 (épica en `specs/flow/EPIC-17-…/`, stories `COMPLETED` en `specs/flow/archive/<fecha>-STORY-…/`), conservando sufijos `:línea` |
| `docs/runbooks/actualizar-spec-de-proyecto.md:85–99, 118–119` | concreta (comandos) | `docs/specs/epics/*/` → `specs/flow/EPIC-*/`; `docs/specs/stories/*/` → `specs/flow/STORY-*/` **y** `specs/flow/archive/*-STORY-*/` (conteo y `grep` sobre ambas), filas de la tabla de fuentes a `specs/flow/` |
| `docs/domains/domain-knowledge-artifacts.md`, `docs/domains/domain-work-item-hierarchy.md` | descripción | ubicaciones `specs/epics/`, `specs/stories/` → patrones de `specs/flow/` (incluida la nota de archivo en la jerarquía) |
| `docs/product/README.md:22`, `docs/product/stakeholders.md:41` | descripción | `specs/epics/` / `docs/specs/stories/` → `specs/flow/` |
| cualquier otra coincidencia en `ACTIVE_ROOTS` o `docs/architecture/` que siga tras STORY-154 | según clase | aplicar la regla; registrar cada archivo tocado en `implement-report.md` |

**Alternativas rechazadas:**
- **Reemplazo global `docs/specs/stories/` → `specs/flow/`:** reescribe registros históricos (precedente del barrido `release → épica`, CHANGELOG) y produce rutas falsas para las stories archivadas, que llevan prefijo de fecha.
- **Limitarse a lo que valida el checker (`ACTIVE_ROOTS`):** dejaría `docs/domains/` y `docs/product/` describiendo directorios inexistentes, contra la regla de veracidad de `AGENTS.md`.
- **Reescribir también los work items:** sus referencias internas son wikilinks de slug (Context); editarlos sin necesidad altera su historial y debilita la detección de renombres de AC-2.

### D-3 — Ruta nueva de un work item movido // satisface: AC-1

Regla determinista, derivada del árbol migrado (no de un mapa guardado):

| Ruta antigua | Ruta nueva |
|---|---|
| `docs/specs/epics/EPIC-NN-<slug>/<archivo>` | `specs/flow/EPIC-NN-<slug>/<archivo>` |
| `docs/specs/stories/STORY-NNN-<slug>/<archivo>` | `specs/flow/STORY-NNN-<slug>/<archivo>` si existe; si no, la **única** coincidencia de `specs/flow/archive/*-STORY-NNN-<slug>/<archivo>` |
| `docs/specs/README.md` | `specs/README.md` |
| `specs/epics/…` / `specs/stories/…` relativos a `docs/` (enlaces del índice) | la ruta nueva anterior, expresada relativa al archivo origen (desde `docs/`: `../specs/flow/…`) |

Cero o más de una coincidencia → no se adivina: se detiene y se registra el caso. La regla se aplica a mano en los pocos archivos de D-2 (el índice se regenera); la única ayuda es el `git grep` de D-2 y `ls`, sin scripts versionados (CNF-1).

**Alternativas rechazadas:**
- **Mapa antiguo→nuevo extraído de `git diff -M` del commit de migración:** exacto, pero exige un script para leerlo; para menos de diez rutas concretas fuera del índice basta la regla y el `ls`.
- **Script de reescritura en `scripts/`:** reutilizable y publicable en npm (`files` incluye `scripts/`); lo prohíben CNF-1 y CS-11.

### D-4 — `docs/index.md` se regenera // satisface: AC-1

Ejecutar `/memory-system index` (motor de STORY-152 D-4) sobre el árbol migrado. Resultado esperado: sección `## 🗂️ Work items (specs/flow/)` con entradas `[[<slug>]] — [epic.md](../specs/flow/EPIC-…/epic.md)`, `[[<slug>]] — [story.md](../specs/flow/STORY-…/story.md)` y `(../specs/flow/archive/<fecha>-STORY-…/story.md)`, y la entrada de `specs-index` → `../specs/README.md`. Ninguna línea del índice contiene `specs/epics/` ni `specs/stories/`.

Si el índice regenerado conserva rutas `specs/epics/`/`specs/stories/` o no indexa `specs/flow/archive/`, el defecto es del motor (STORY-152): se devuelve según D-1 y no se edita el índice a mano.

**Alternativas rechazadas:**
- **Editar las 224 líneas a mano o con `sed`:** el índice prohíbe la edición manual y la siguiente regeneración la deshace (STORY-154 D-6).

### D-5 — El checker resuelve wikilinks a work items // satisface: AC-1

En `scripts/check-doc-links.js`:

| Elemento | Antes | Después |
|---|---|---|
| Corpus del índice de slugs en `checkDocumentation` | `docs/` + `README.md` + `SECURITY.md` | lo mismo **más** `specs/` si existe (incluye `specs/flow/`, `specs/flow/archive/` y `specs/README.md`) |
| `HISTORICAL_EXCLUSIONS` | `['CHANGELOG.md', 'docs/adr', 'docs/specs']` | `['CHANGELOG.md', 'docs/adr', 'specs']` (solo informativo; refleja dónde viven ahora los work items) |
| `ACTIVE_ROOTS` | sin cambios | sin cambios: los work items siguen sin validarse como documentación activa |

El corpus amplía **qué slugs existen**, no **qué archivos se validan**: los enlaces dentro de `specs/` siguen fuera del gate (registro histórico), y la regla de deduplicación de `slugIndex` (preferir `story.md`/`epic.md`) se mantiene.

Pruebas en `test/check-doc-links.test.js`:
- El fixture crea `specs/flow` en lugar de `docs/specs`; el caso de deduplicación de slugs usa `specs/flow/EPIC-01-a/` en lugar de `docs/specs/epics/EPIC-01-a/`.
- Caso nuevo: `docs/index.md` con `[[STORY-001-a]] — [story.md](../specs/flow/STORY-001-a/story.md)` y `[[STORY-000-z]]` con su `story.md` en `specs/flow/archive/2026-01-01-STORY-000-z/` → sin errores.
- Caso nuevo: `[[STORY-999-inexistente]]` → `Missing wikilink target`.

**Alternativas rechazadas:**
- **Añadir `specs/` a `ACTIVE_ROOTS`:** validaría ~150 work items históricos con enlaces que nunca se mantuvieron (rompe el gate por deuda ajena; mismo motivo que STORY-154 D-7).
- **Quitar los wikilinks del índice:** cambia el formato del motor de `memory-system` y la navegación de la wiki (`[[slug]]`).
- **Recorrer todo `REPO_ROOT` para slugs:** arrastra `skills/`, `node_modules/` y `.tmp/`, con slugs ambiguos.

### D-6 — Restos de la transición // satisface: AC-3

| Archivo | Cambio | Origen |
|---|---|---|
| `sddf.config.yaml` | eliminar l. 4 (comentario «Raíz versionada… SDDF_ROOT…») y l. 5 `root: docs`; l. 72: `$SPECS_BASE/guardrails/<slug>.md` → `docs/guardrails/<slug>.md` | STORY-153 CR-003; CS-3 |
| `AGENTS.md` | eliminar la viñeta «Transición EPIC-26» | STORY-154 CR-002 |

La configuración resultante debe seguir pasando `verify-config-contract.js` y `npm test` (ninguno exige `root`, verificado en Context).

**Alternativas rechazadas:**
- **Conservar `root: docs` como clave inerte:** contradice ADR-0016 y deja a un lector creyendo que la raíz es configurable.
- **Dejar la viñeta de transición:** describe un estado que ya no existe (CNF-1 de STORY-154; regla de veracidad).

### D-7 — Verificación del historial y de `docs/requirements/` // satisface: AC-2

| Verificación | Comando | Criterio |
|---|---|---|
| Historial de una story archivada | `git log --follow --format="%h %ad" --date=short -- specs/flow/archive/<fecha>-STORY-NNN-<slug>/story.md`, sobre la primera story archivada en orden alfabético y sobre una de las de solo `date:` (STORY-001 a STORY-049) | lista commits anteriores a `MIGRATION_COMMIT` (al menos el de creación de la story) |
| Renombre detectado | `git show --stat -M --format= MIGRATION_COMMIT -- specs/flow/archive/<…>/story.md` | la entrada aparece como renombre (`=>`), no como alta |
| `docs/requirements/` sin cambios de ubicación ni contenido | `git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements` y `git status --porcelain -- docs/requirements` vacío | exit 0 y salida vacía |

Las salidas se guardan en `implement-report.md`.

**Alternativas rechazadas:**
- **Comprobar solo que el archivo existe en `archive/`:** AC-2 exige historial previo; un alta nueva (renombre no detectado) pasaría.
- **Comparar contra el commit anterior a la migración en lugar de `main`:** `main` cubre toda la épica, incluido cualquier cambio de STORY-147 a STORY-156 en `docs/requirements/`.

### D-8 — Cierre del contrato de salida global // satisface: AC-3

Tras D-2 a D-6:

| Criterio | Comprobación | Si falla |
|---|---|---|
| CS-2 | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` → solo líneas de `skills/skill-preflight/SKILL.md`, todas dentro de la región `SDDF-LEGACY-DIAGNOSTIC` (lo confirma `node scripts/verify-fixed-layout.js --json` con `errors: []`) | devolver el skill a su historia (D-1) |
| Lista transitoria vacía | `--json` → `pending: []` | ídem |
| CS-3 | `grep -rnE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b" skills/*/SKILL.md` vacío; `grep -rnE "^root:" skills/sddf-init/assets/` vacío; `grep -n "^root:" sddf.config.yaml` vacío (D-6) | sddf-init → STORY-149; skill → su historia; config → D-6 |
| CS-12 | `npm test` y `npm run verify:repository` → exit 0 (incluye `enlaces activos`) | según el paso que falle: enlaces → D-2/D-5; contrato → D-1 |

**Alternativas rechazadas:**
- **Retirar `PENDING_MIGRATION` y sus reglas del validador:** STORY-148 F-6 lo permite, pero la historia solo pide verificarla vacía; con la lista vacía las reglas de higiene no actúan (YAGNI).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Índice wiki | regenerar | `docs/index.md` | AC-1 |
| Checker de enlaces | modificar (corpus de slugs, `HISTORICAL_EXCLUSIONS`) | `scripts/check-doc-links.js` | AC-1, AC-3 |
| Prueba del checker | modificar fixture + 2 casos | `test/check-doc-links.test.js` | AC-1 |
| Checklist de seguridad | modificar (4 rutas) | `docs/guardrails/gr-ai-security-checklist.md` | AC-1 |
| Runbook de spec | modificar (comandos y tabla) | `docs/runbooks/actualizar-spec-de-proyecto.md` | AC-1 |
| Dominios | modificar (ubicaciones) | `docs/domains/domain-knowledge-artifacts.md`, `docs/domains/domain-work-item-hierarchy.md` | AC-1 |
| Producto | modificar (1 línea cada uno) | `docs/product/README.md`, `docs/product/stakeholders.md` | AC-1 |
| Configuración del repo | modificar (retirar `root`, comentario DoD) | `sddf.config.yaml` | AC-3 |
| Instrucciones de agentes | modificar (retirar viñeta) | `AGENTS.md` | AC-3 |
| Residuales del inventario | modificar si aparecen (D-2, última fila) | `ACTIVE_ROOTS`, `docs/architecture/` | AC-1 |

No se crea ningún archivo versionado. No se tocan `specs/**` (salvo los artefactos de esta historia), `skills/`, `docs/adr/`, `CHANGELOG.md`, `docs/product/roadmap.md` ni `docs/requirements/`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Ruta nueva de un work item | regla de D-3; ambigüedad o ausencia → detener | AC-1 |
| `checkDocumentation({ repoRoot, files })` | misma firma y salida; el índice de slugs incluye `specs/` si existe | AC-1 |
| `HISTORICAL_EXCLUSIONS` | constante exportada `['CHANGELOG.md', 'docs/adr', 'specs']` | AC-1 |
| Gate | `npm run verify:repository` → exit 0 | AC-1, AC-3 |
| Contrato de layout | `node scripts/verify-fixed-layout.js --json` → `{ errors: [], pending: [] }` | AC-3 |

## Esquema de datos

N/A — no hay datos nuevos. El formato de las entradas del índice lo fija el motor de `memory-system` (STORY-152 D-4).

## Flujos clave

### F-1 — Reparación // AC-1
1. D-1: P1–P4 en verde; registrar `MIGRATION_COMMIT`.
2. D-4: `/memory-system index` → `docs/index.md` con rutas `../specs/flow/…`.
3. D-5: corpus de slugs con `specs/` y pruebas → `node --test test/check-doc-links.test.js` verde.
4. D-2/D-3: inventario recalculado, clasificación y reescritura de los archivos restantes.
5. `npm run verify:links` → `[OK]`.

### F-2 — Historial // AC-2
1. D-7 sobre dos stories archivadas y `docs/requirements/` → salidas a `implement-report.md`.

### F-3 — Cierre // AC-3
1. D-6: `sddf.config.yaml` y `AGENTS.md`.
2. D-8: CS-2, lista vacía, CS-3, CS-12.

### F-4 — Degradación // P7
- Precondición fallida (D-1): se detiene sin editar; el informe nombra la historia dueña.
- Ruta ambigua (D-3): se detiene en esa referencia; no se escribe una ruta adivinada.
- Índice con rutas legadas (D-4): defecto del motor → STORY-152; no se parchea el índice.
- Enlace roto ajeno a la migración (deuda previa): se registra en `implement-report.md`; si rompe el gate, se repara solo si es una ruta movida, si no se informa como bloqueo.

### F-5 — Puntos de cambio // P6
- **Living Spec (`specs/living/`):** el corpus `specs/` de D-5 ya lo incluye sin cambios.
- **Workflow (`workflow/`):** fuera del corpus; si aloja Markdown con slugs, se añade como `specs/` en D-5.

## Decisiones de complejidad justificada

- **Corpus de slugs ampliado (D-5):** sin él, todos los wikilinks del índice a work items fallan tras STORY-153 aunque las rutas Markdown sean correctas; es añadir un directorio a un recorrido existente, no un mecanismo nuevo.
- **Puerta de entrada (D-1):** la historia depende de ocho entregas previas; verificar antes de editar evita reparar sobre un árbol incompleto y deja la devolución de defectos trazable.
- **Edición manual guiada por regla (D-3) en lugar de script:** CNF-1 lo exige y el volumen fuera del índice es pequeño.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Precondiciones P1–P4 | comandos de D-1; salida en `implement-report.md` | AC-3 |
| 2 | Índice sin rutas legadas | `grep -cE "specs/(epics\|stories)" docs/index.md` = 0; `grep -c "\.\./specs/flow/" docs/index.md` > 0 | AC-1 |
| 3 | Sin referencias vigentes a rutas movidas | `git grep -nE "docs/specs\|specs/(epics\|stories)" -- . ':!specs' ':!skills' ':!CHANGELOG.md' ':!docs/adr' ':!.tmp' ':!docs/product/roadmap.md' ':!test/memory-system.test.js' ':!test/epic-template.test.js' ':!scripts/migrate-finvest-field.js'` → solo líneas de clase «registro histórico» justificadas en `implement-report.md` | AC-1 |
| 4 | Wikilinks a work items resuelven | `node --test test/check-doc-links.test.js` (casos nuevos de D-5) | AC-1 |
| 5 | Gate sin enlaces rotos | `npm run verify:links` → `[OK]` | AC-1 |
| 6 | Historial previo | D-7: `git log --follow` muestra commits anteriores a `MIGRATION_COMMIT`; renombre con `=>` | AC-2 |
| 7 | `docs/requirements/` intacto | D-7: `git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements` exit 0 | AC-2 |
| 8 | CS-2 y lista vacía | `node scripts/verify-fixed-layout.js --json` → `errors: []`, `pending: []`; grep de D-8 solo en `skill-preflight` | AC-3 |
| 9 | CS-3 | greps de D-8 vacíos | AC-3 |
| 10 | CS-12 | `npm test` y `npm run verify:repository` → exit 0 | AC-3 |
| 11 | Sin script ni dependencia nuevos | `git diff --stat` sin archivos nuevos versionados; `package.json` sin cambios | CNF-1, CNF-2 |
| 12 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» y los artefactos de la historia | Non-Goals |

## Risks / Trade-offs

- **[Riesgo] Precondiciones abiertas:** la historia depende de STORY-147 a STORY-156 y STORY-158; a 2026-10-22 ninguna está implementada → D-1 se detiene sin editar. Es la última historia de la épica por diseño.
- **[Riesgo] Migración sin commitear:** STORY-153 deja los movimientos en el índice de git (su Non-Goal) → `git log --follow` no ve el renombre (P2, CR-003).
- **[Riesgo] Solapamiento con STORY-154:** ambas tocan documentación → D-2 recalcula el inventario y no vuelve a tocar lo que STORY-154 ya reescribió; la frontera es la clase de la referencia (concreta o sin dueño vs. documentación del layout).
- **[Trade-off] Work items con referencias textuales obsoletas:** sus menciones de `docs/specs/…` en prosa quedan como registro histórico; la navegación entre ellos usa wikilinks de slug, que resuelven con D-5.
- **[Limitación] El checker no valida `docs/domains/` ni `docs/product/`:** no están en `ACTIVE_ROOTS`; el contrato 3 los cubre por grep.

## Open Questions

Ninguna: el dueño de runbook, dominios y producto queda decidido en D-2 (CR-001), los restos de transición en D-6 (CR-002) y el commit de la migración como precondición en D-1 (CR-003).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3, D-4, D-5; F-1; contratos 2–5), AC-2 (D-7; F-2; contratos 6–7), AC-3 (D-1, D-6, D-8; F-3; contratos 1, 8–10), CNF-1 (D-3; contrato 11), CNF-2 (D-5 sin dependencias; contrato 11).
- **Ambigüedad:** «cada referencia apunta a la ruta nueva» operacionalizado con las clases de D-2 (las históricas se conservan) y la regla de D-3; «sin enlaces rotos» como `verify:links` en verde más el grep del contrato 3 fuera de `ACTIVE_ROOTS`.
- **Nombres:** «ruta movida», «registro histórico», «lista transitoria» / `PENDING_MIGRATION`, «contrato de salida global» como en la historia, la épica y STORY-154.
- **Estructura:** un solo componente de código (`check-doc-links.js`) con un cambio acotado; el resto son ediciones de documentación y verificaciones. Sin ciclos; sin código de implementación en este documento.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: STORY-154 CR-001 dejó sin dueño el runbook `actualizar-spec-de-proyecto.md` y las capas `docs/product/` y `docs/domains/`, que citan `docs/specs/…` o describen `specs/epics/`/`specs/stories/` como vigentes; y su D-2 delega aquí las rutas concretas de `gr-ai-security-checklist.md`. La historia solo habla de «enlaces relativos y wikilinks».
- **Documento afectado**: story.md (AC-1, Notas), design.md (D-2)
- **Acción requerida**: el diseño los incluye como rutas movidas (D-2), excepto `roadmap.md` (append-only). Opcional: añadir a las Notas de story.md «incluye las referencias textuales vigentes a rutas movidas en `docs/runbooks/`, `docs/domains/`, `docs/product/` y `docs/guardrails/`».

### CR-002
- **Tipo**: dependencia
- **Descripción**: STORY-153 CR-003 asigna a esta historia el retiro de `root: docs` (y su comentario) del `sddf.config.yaml` del repo, y STORY-154 CR-002 el retiro de la viñeta «Transición EPIC-26» de `AGENTS.md`. AC-3 no los nombra.
- **Documento afectado**: story.md (AC-3)
- **Acción requerida**: añadir a AC-3 «el `sddf.config.yaml` del repo no declara `root` y `AGENTS.md` no conserva la viñeta de transición». El diseño los incluye (D-6).

### CR-003
- **Tipo**: dependencia
- **Descripción**: STORY-153 deja los movimientos en el índice de git sin commitear (su Non-Goal). `git log --follow` (AC-2) solo ve el renombre cuando está commiteado.
- **Documento afectado**: story.md (Precondición)
- **Acción requerida**: añadir a la precondición «la migración de STORY-153 está commiteada». D-1 (P2) lo comprueba.
