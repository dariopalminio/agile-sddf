---
alwaysApply: false
type: design
id: STORY-154
slug: STORY-154-documentar-el-nuevo-layout-design
title: "Design: Documentar el nuevo layout"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-154
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-154-documentar-el-nuevo-layout
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-154-documentar-el-nuevo-layout]] · [[EPIC-26-layout-y-flow-forward-mejorado]] · [[layout-fijo-de-tres-raices]]

## Context

La historia es un `chore` documental. Reescribe la documentación activa para que describa el layout fijo de ADR-0016 (STORY-147) y añade la guía de migración a la que remiten `/sddf-init` (STORY-149) y `skill-preflight` (STORY-152). No modifica skills, scripts de producción ni work items.

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `scripts/check-doc-links.js` | `ACTIVE_ROOTS` = `README.md`, `SECURITY.md`, `docs/index.md`, `docs/constitution.md`, `docs/policies`, `docs/guardrails`, `docs/guides`, `docs/runbooks`. `HISTORICAL_EXCLUSIONS` = `CHANGELOG.md`, `docs/adr`, `docs/specs`. **No valida** `AGENTS.md` ni `docs/architecture/`. Ignora el texto dentro de code spans y bloques de código (`visibleMarkdown`). Cada error empieza con `<archivo>:<línea>:` (`checkDocumentation`). `slugIndex` solo recorre `docs/`, `README.md` y `SECURITY.md`. |
| `test/check-doc-links.test.js` | El caso `reports missing local targets and anchors` comprueba `Missing local target` desde `README.md`, pero no que el error nombre el archivo ni que el origen sea una guía. |
| `githubAnchor('Migración a 5.0.0 — layout fijo de tres raíces')` | `migracion-a-500--layout-fijo-de-tres-raices` (calculado con la función exportada del checker). |
| `AGENTS.md` (52 líneas) | La línea 10 describe la precedencia `SDDF_ROOT` → `root` → `docs` y «Este repo declara `root: docs`». La línea 3 remite a `docs/specs/01-projects/PROJ-01-agile-sddf/`, **que no existe** (ADR-0013 lo eliminó). |
| `docs/architecture/sddf-architecture.md` | §5 «Lectura `specs/, requirements/, domains/`»; §6 principio 2 «Una raíz única para la memoria (`SDDF_ROOT`)»; §7 árbol con `sddf.config.yaml # raíz de artefactos (root)` y `docs/specs/{01-projects,epics,stories}/`; §8 fila `[[perfiles-runtimes-e-instalacion-explicita]]` descrita como «`specs/` dentro de `docs/`» (descripción equivocada: ese es ADR-0010, slug `specs-dentro-de-docs`). |
| `docs/architecture/memory-system.md` | Línea 145 («el nombre es configurable vía `root:`»), línea 191 (`specs/stories/STORY-042/story.md`) y línea 452 (`SPECS_BASE`). STORY-152 D-14 edita las capas y §10.6 de este archivo, pero no estas líneas. |
| `docs/architecture/README.md:51` | `docs/specs/stories/STORY-NNN-*/design.md`. |
| `docs/index.md` | Lo genera `memory-system index` («no edites las entradas a mano»). STORY-152 D-4 cambia `assets/index-template.md`: `## 🗂️ Especificaciones (specs/)` pasa a `## 🗂️ Work items (specs/flow/)` y añade el origen flow; un repo sin migrar sigue indexando `docs/specs/`. Las menciones de `SDDF_ROOT`/`$SPECS_BASE` del índice actual están en títulos de nodos históricos (STORY-049, ADR-0001, planes de EPIC-16/17/18, STORY-094) y en la entrada de `root-folder-practices`. |
| `docs/guides/` | Menciones del mecanismo legado o de `docs/specs/` como layout vigente: `artifact-directory-migration.md`, `root-folder-practices.md` (guía entera sobre la resolución de raíz), `sddf-commands-pipeline.md`, `skill-structural-pattern.md`, `organization-of-artifacts.md`, `harness-eng-agents-orchestration.md`, `best-practices-for-skills.md`, `flight-leves-model.md` (árbol de las líneas 55–63) y `README.md` (filas de las líneas 43–45). |
| `docs/guides/artifact-directory-migration.md` | Las secciones van de la más nueva a la más antigua: `## Migración a 4.0.0 — specs/ de dos niveles` y `## Migración histórica 1.x → 2.x`. La nota final indica «Resuelve `$SPECS_BASE` con la precedencia…» como instrucción vigente. |
| `CHANGELOG.md` | `## [Unreleased]` existe (`### Changed`, `### Deprecated`, `### Nota de actualización`). Precedentes: `### BREAKING — specs/ de dos niveles (requiere 4.0.0)` y `### BREAKING — agentes locales por skill (EPIC-24)`, con un párrafo **Guía:** que enlaza `docs/guides/artifact-directory-migration.md`. `### Deprecated` dice que `story-improve` «se eliminará en 5.0.0» (ver CR-003). |
| `package.json` | `version: 4.1.0`. `scripts/verify-release.js` exige una sección `## [<version>]` que coincida con `package.json`; `[Unreleased]` no rompe el gate. |
| Fuera de las raíces del AC con mención del mecanismo como vigente | `docs/constitution.md` (líneas 92–95, 136–137, 217–223, 237, 260), `README.md` (líneas 80–82, 156, 174, 214, 219–222, 344–347, 364), `docs/runbooks/actualizar-spec-de-proyecto.md` (desactualizado desde 4.0.0: trata `01-projects/project.md`), `docs/guardrails/gr-ai-security-checklist.md:170-173` (rutas concretas de work items), `docs/product/`, `docs/domains/`. |
| Layout objetivo | `specs/` y `workflow/` **no existen** en el repo hoy. El contrato lo fijan ADR-0016 (STORY-147) y el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` con `REQUIRED_BLOCK_TOKENS = ['REPO_ROOT', 'specs/flow/', 'docs/templates/', 'docs/guardrails/']` de `scripts/verify-fixed-layout.js` (STORY-148). |
| Hermanas que delegan en esta historia | STORY-152 CR-003: la guía debe indicar que se borren a mano las copias instaladas de `docs-wiki-builder` y que se retire `root`, y el CHANGELOG debe registrar como incompatible el cambio de capas de `memory-system`. STORY-152 D-10 añade su propio `### Removed` al `[Unreleased]`. STORY-157 repara los enlaces a rutas movidas tras STORY-153 y exige STORY-154 entregada. |

Stakeholders: practitioners con `root: docs` o `docs/specs/` que actualizan a la versión mayor, y el mantenedor que sigue `AGENTS.md` en las historias restantes de EPIC-26.

## Goals / Non-Goals

**Goals:**
- `AGENTS.md` documenta las tres raíces, la convención de `specs/flow/archive/` y el destino de `docs/requirements/` // satisface: AC-1, CNF-1
- `docs/architecture/` y `docs/index.md` reflejan el layout fijo y dejan de presentar `SDDF_ROOT`/`root`/`SPECS_BASE` como mecanismo vigente // satisface: AC-1
- Las guías afectadas dejan de describir el mecanismo legado como vigente // satisface: AC-1, AC-3
- Sección nueva de migración a 5.0.0 en `docs/guides/artifact-directory-migration.md` // satisface: AC-2
- Entrada `BREAKING` en el `[Unreleased]` del CHANGELOG que enlaza esa sección // satisface: AC-2
- Prueba de regresión que fija el comportamiento del gate ante una guía con una ruta de `docs/specs/` inexistente // satisface: AC-3
- `npm run verify:repository` en verde al cerrar // satisface: AC-3

**Non-Goals:**
- Documentar el archivado, el workflow o la Living Spec más allá de su destino (Non-Goals de la historia)
- Mover work items o reescribir los enlaces a rutas movidas (STORY-153, STORY-157)
- Modificar skills, `sddf.config.yaml`, ADRs (inmutables; ADR-0016 D-8) o `docs/requirements/` (CS-10)
- Ampliar `ACTIVE_ROOTS` del checker (D-7)
- Publicar la versión: subir `package.json` a 5.0.0 o crear `## [5.0.0]` en el CHANGELOG (CR-003)
- Actualizar `docs/runbooks/`, `docs/guardrails/`, `docs/product/` y `docs/domains/` (CR-001)

## Decisions

### D-1 — Momento de implementación: después de las migraciones de skills y antes de STORY-153 // satisface: AC-3, CNF-1

Precondiciones de implementación:
- **Entregadas:** STORY-147 (ADR-0016 existe y se puede enlazar), STORY-148 (`scripts/verify-fixed-layout.js` y `PENDING_MIGRATION`) y STORY-152 (template de índice con `specs/flow/`, diagnóstico legado de `skill-preflight`, `docs-wiki-builder` eliminado). Se recomienda también tener entregadas STORY-149 a STORY-151, STORY-155, STORY-156 y STORY-158, para que «los skills usan rutas fijas» sea cierto en todo el catálogo.
- **No ejecutada:** STORY-153. Entre STORY-153 y STORY-157, `docs/index.md` enlaza rutas `docs/specs/…` que ya no existen y el gate está en rojo por diseño de esas historias. AC-3 exige el gate en verde.

Orden resultante en EPIC-26: 147 → 148 → {149–152, 155, 156, 158} → **154** → 153 → 157.

Si al empezar falta una precondición, `story-implement-tasks` se detiene en la primera tarea y lo informa en `implement-report.md`, sin escribir documentación a medias.

**Alternativas rechazadas:**
- **Implementar después de STORY-153:** el gate queda en rojo hasta STORY-157 y AC-3 no puede cumplirse.
- **Implementar junto con STORY-157:** STORY-157 exige STORY-154 entregada (su precondición); fusionarlas rompe la división de la épica.
- **Implementar antes de las migraciones de skills:** `AGENTS.md` afirmaría que los skills usan rutas fijas cuando casi todos siguen resolviendo la raíz, y los agentes de las historias restantes recibirían instrucciones falsas (CNF-1).

### D-2 — Regla de clasificación de cada mención // satisface: AC-1, CNF-1

Cada aparición de `SPECS_BASE`, `$SPECS_BASE`, `SDDF_ROOT`, la clave `root`, `docs/specs/`, `specs/epics/` o `specs/stories/` en un archivo del alcance (D-3) se clasifica en una de tres clases:

| Clase | Criterio | Acción |
|---|---|---|
| **Mecanismo o layout vigente** | Describe cómo se resuelven las rutas hoy o dónde viven los work items | Reescribir: `docs/<capa>/` para conocimiento, `specs/flow/EPIC-NN-<slug>/` y `specs/flow/STORY-NNN-<slug>/` para work items, `docs/templates/` y `docs/guardrails/`; sin variable de raíz |
| **Registro histórico** | Describe una versión o migración pasada (secciones 4.0.0 y 1.x→2.x de la guía, notas de terminología v1.x, títulos de nodos históricos del índice) | Conservar. Si contiene una instrucción imperativa vigente (nota final de la guía 1.x→2.x), se reformula en pasado y remite a la sección 5.0.0 |
| **Ruta concreta de un work item existente** | Enlaza o cita un archivo real de `docs/specs/` (entradas del índice, excepciones de `gr-ai-security-checklist.md`) | Conservar: el archivo sigue ahí hasta STORY-153; lo reescribe STORY-157 |

Convención de escritura para los textos nuevos: un archivo que existe se cita con **enlace Markdown**, para que el gate lo valide (AC-3); un patrón o una ruta del layout objetivo que aún no existe (`specs/flow/STORY-NNN-<slug>/`) va en **code span**. Así ningún enlace apunta a un destino inexistente y ningún patrón se presenta como archivo real (CNF-1).

**Alternativas rechazadas:**
- **Reemplazo global `$SPECS_BASE/specs/stories/` → `specs/flow/`:** reescribe registros históricos. Ya ocurrió con el barrido `release → épica` (CHANGELOG, «Defectos introducidos por el barrido»).
- **Borrar toda mención de `SDDF_ROOT`:** la guía de migración y la nota de transición necesitan nombrarla para explicar su retiro (AC-2).

### D-3 — Alcance: archivos que se modifican // satisface: AC-1, AC-2, CNF-1

| Grupo | Archivos | Origen |
|---|---|---|
| Entrada IA | `AGENTS.md` | AC-1 |
| Arquitectura | `docs/architecture/sddf-architecture.md`, `docs/architecture/memory-system.md` (solo las líneas 145, 191 y 452, si siguen tras STORY-152), `docs/architecture/README.md:51` | AC-1 («la arquitectura») |
| Índice | `docs/index.md` (regenerado, D-6) | AC-1 |
| Guías | `docs/guides/artifact-directory-migration.md`, `root-folder-practices.md`, `sddf-commands-pipeline.md`, `skill-structural-pattern.md`, `organization-of-artifacts.md`, `harness-eng-agents-orchestration.md`, `best-practices-for-skills.md`, `flight-leves-model.md`, `README.md` | AC-1, AC-2 («las guías afectadas») |
| Registro | `CHANGELOG.md` | AC-2 |
| Gobernanza y portada | `docs/constitution.md`, `README.md` | AC-1 por intención y CNF-1 (ver justificación y CR-001) |
| Prueba | `test/check-doc-links.test.js` (un caso nuevo) | AC-3 |

**Por qué `docs/constitution.md` y `README.md` aunque el AC no los nombra:** `AGENTS.md` fija «ante conflicto, prevalece la constitución». Si la constitución siguiera prescribiendo «todo skill resuelve `SPECS_BASE`…» (líneas 136–137), anularía el cambio de `AGENTS.md`. `README.md` es la portada del paquete npm y la primera lectura del practitioner de la historia: con `root: docs` como configuración recomendada (líneas 344–347), el practitioner no podría «entender el cambio incompatible». En los dos archivos solo se tocan las líneas de clase «mecanismo o layout vigente» (D-2). La tabla «Upgrading desde 1.x» de `README.md` (líneas 411–413) es registro histórico y no se toca.

**Alternativas rechazadas:**
- **Ceñirse a la lista literal del AC:** deja la constitución en contradicción con `AGENTS.md`, y gana la constitución.
- **Barrer toda la documentación de `docs/` (runbooks, guardrails, product, domains):** amplía la historia sin AC. El runbook arrastra deuda de 4.0.0 que no es de esta épica (CR-001).

### D-4 — `AGENTS.md`: layout fijo y nota de transición // satisface: AC-1, CNF-1, CNF-2

Cambios, manteniendo el formato de reglas en viñetas y la brevedad del archivo:

| Ubicación | Cambio |
|---|---|
| Línea 3 | `(ver docs/specs/01-projects/PROJ-01-agile-sddf/)` → remitir a `docs/product/vision.md` (que ya cita la frase siguiente) y a EPIC-26 por su ruta actual. Corrige una ruta inexistente (CNF-1). |
| Viñeta «Resolución de raíz» | Se reemplaza por **«Layout fijo (ADR-0016)»**: tres raíces hermanas en `REPO_ROOT`: `docs/` (conocimiento), `specs/` (estado: `specs/flow/` plano con `EPIC-NN-<slug>/` y `STORY-NNN-<slug>/`, `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` para stories `COMPLETED` con la fecha de `updated:` o, si falta, `created:`, y `specs/living/` reservado) y `workflow/` (proceso, reservado). Se retiran `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y `SPECS_BASE`: los skills solo resuelven `REPO_ROOT` y declaran `<!-- SDDF-FIXED-LAYOUT: v1 -->`. `docs/requirements/` no se mueve: migrará a `specs/living/` en la épica de Living Spec. `skill-preflight` diagnostica el layout legado y remite a la guía de migración. |
| Viñeta nueva **«Transición EPIC-26»** | «Mientras exista `docs/specs/`, los work items de este repo siguen ahí y `sddf.config.yaml` conserva `root: docs`; STORY-153 los migra y STORY-157 retira esta viñeta. Los skills pendientes del contrato son los de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js`.» No enumera skills ni estados: remite a fuentes verificables que cambian solas (P6). |
| Viñeta «WIP = 1» | Sin cambios de regla. |
| «Dónde está el detalle» | Añadir «**Layout:** ADR-0016 (`docs/adr/ADR-0016-layout-fijo-de-tres-raices.md`) y `docs/guides/root-folder-practices.md`». |

Las rutas de `AGENTS.md` van en code spans, como hoy. El checker no lo valida (D-7), así que se comprueban con el contrato 2.

**Alternativas rechazadas:**
- **Enumerar en `AGENTS.md` las historias o skills pendientes:** se desactualiza en cada entrega. Duplica `PENDING_MIGRATION`.
- **No poner nota de transición:** entre STORY-154 y STORY-157, un agente que lea `AGENTS.md` buscaría los work items en `specs/flow/` y no encontraría nada (CNF-1).
- **Mover el árbol completo del layout a `AGENTS.md`:** ADR-0016 y `sddf-architecture.md` ya lo tienen. `AGENTS.md` es un punto de entrada breve (convención del propio archivo: «Dónde está el detalle»).

### D-5 — Arquitectura // satisface: AC-1

`docs/architecture/sddf-architecture.md`:
- §5, paso 3: `specs/, requirements/, domains/` → `specs/flow/, docs/requirements/, docs/domains/`.
- §6, principio 2: «Una raíz única para la memoria (`SDDF_ROOT`)» → «**Layout fijo de tres raíces**: `docs/` (conocimiento), `specs/` (estado) y `workflow/` (proceso), sin configuración de raíz (ADR-0016)».
- §7, árbol: `sddf.config.yaml` pasa a comentarse «perfil, stack y skills activos por fase del pipeline TDD»; se quita `docs/specs/…`; se añaden como hermanas de `docs/` `specs/flow/` (con `archive/`), `specs/living/` (reservado) y `workflow/` (reservado), con un comentario de una línea cada una.
- §8: la fila `[[perfiles-runtimes-e-instalacion-explicita]] | specs/ dentro de docs/` tiene la descripción equivocada. Se corrige la descripción (perfiles, runtimes e instalación explícita) y se añade la fila `[[layout-fijo-de-tres-raices]] | Layout fijo de tres raíces; reemplaza a ADR-0010`.

`docs/architecture/memory-system.md`, solo si siguen tras STORY-152: la línea 145 pasa a «Todo el conocimiento bajo `docs/`; los work items en `specs/flow/` (ADR-0016)»; la línea 191 pasa a `specs/flow/STORY-042-<slug>/story.md`; la línea 452 cambia `SPECS_BASE` por «la raíz de conocimiento `docs/`», con el vocabulario de STORY-152 D-3.

`docs/architecture/README.md:51`: `docs/specs/stories/STORY-NNN-*/design.md` → `specs/flow/STORY-NNN-*/design.md`.

**Alternativas rechazadas:**
- **Reescribir `sddf-architecture.md` completo:** el resto sigue siendo cierto. Un diff amplio dificulta la revisión.
- **Delegar `memory-system.md` entero a STORY-152:** su D-14 limita el alcance a las capas y deja explícitamente el resto a esta historia.

### D-6 — `docs/index.md`: se regenera, no se edita a mano // satisface: AC-1

Tras editar las guías (D-8, D-9), ejecutar `/memory-system index`, con el motor y el template que deja STORY-152. Resultado esperado:
- La sección de work items se titula `## 🗂️ Work items (specs/flow/)` (template de STORY-152 D-4). Las entradas de `docs/specs/` siguen enlazando sus rutas actuales (modo de transición de D-4 de STORY-152).
- La entrada de `root-folder-practices` toma el título nuevo de D-9.
- Las únicas menciones de `SDDF_ROOT`/`$SPECS_BASE` que quedan son títulos de nodos históricos (clase «registro histórico» de D-2).

Si el índice regenerado no contiene `## 🗂️ Work items (specs/flow/)`, falta la precondición STORY-152 (D-1): se detiene y se informa.

**Alternativas rechazadas:**
- **Editar a mano encabezados y entradas:** el propio índice lo prohíbe y la siguiente regeneración lo deshace.
- **Cambiar los títulos de nodos históricos (p. ej. STORY-049):** son el `title:` de work items cerrados. Editarlos falsea su registro.

### D-7 — AC-3 sin cambiar el contrato del checker; prueba de regresión nueva // satisface: AC-3

El comportamiento que pide AC-3 ya existe para los enlaces Markdown de `docs/guides/` (raíz activa): un destino inexistente produce `docs/guides/<archivo>.md:<línea>: Missing local target: <ruta>` y `verify:links` termina con exit 1. La historia lo fija con una prueba de regresión en `test/check-doc-links.test.js`, usando el `fixture(t, readme)` existente:

| Campo | Valor |
|---|---|
| Nombre | `reports a guide linking to a removed docs/specs path, naming the guide` (idioma y estilo de los casos vecinos) |
| Preparación | escribe `docs/guides/legacy.md` en el fixture con `[story](../specs/stories/STORY-001-x/story.md)`, sin crear el destino |
| Acción | `checkDocumentation({ repoRoot: root, files: [<ruta de legacy.md>] })` |
| Aserción | un error que casa con `^docs/guides/legacy\.md:\d+: Missing local target: docs/specs/stories/STORY-001-x/story\.md$` |

La regla de D-2 (enlace Markdown para archivos reales) hace que esta garantía cubra todo texto nuevo de las guías.

**Alternativas rechazadas:**
- **Añadir `AGENTS.md` y `docs/architecture` a `ACTIVE_ROOTS`:** verificado: `docs/architecture/README.md:25` tiene dos enlaces rotos previos (`c4/context-diagram.puml` y `.png`). El cambio rompería el gate por deuda ajena y cambiaría su contrato sin AC que lo pida.
- **Detectar también rutas en code spans:** cualquier ejemplo o patrón (`STORY-NNN-<slug>/`) daría falsos positivos; el checker los ignora a propósito.
- **No añadir prueba (confiar en el caso existente):** ese caso no prueba que el error nombre el archivo ni que la fuente sea una guía, que es la cláusula «Pero» de AC-3.

### D-8 — Sección de migración a 5.0.0 en `artifact-directory-migration.md` // satisface: AC-2, CNF-1, CNF-2

Sección nueva **antes** de `## Migración a 4.0.0 — specs/ de dos niveles` (orden de la más nueva a la más antigua), con el encabezado exacto `## Migración a 5.0.0 — layout fijo de tres raíces` (ancla `migracion-a-500--layout-fijo-de-tres-raices`). Contenido:

1. **A quién aplica:** proyectos con `root: docs` (o cualquier `root`) en `sddf.config.yaml`, con `docs/specs/` o con `SDDF_ROOT` definida. Cambio incompatible: los skills de 5.0.0 ya no leen `root` ni `SDDF_ROOT` y escriben en `specs/flow/`. Enlace a [ADR-0016](../adr/ADR-0016-layout-fijo-de-tres-raices.md), que el gate valida.
2. **Tabla origen 4.x → destino 5.0.0:**

   | Origen 4.x | Destino 5.0.0 |
   |---|---|
   | `docs/specs/epics/EPIC-NN-<slug>/` | `specs/flow/EPIC-NN-<slug>/` |
   | `docs/specs/stories/STORY-NNN-<slug>/` (no `COMPLETED`) | `specs/flow/STORY-NNN-<slug>/` |
   | `docs/specs/stories/STORY-NNN-<slug>/` (`COMPLETED`) | `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (fecha de `updated:` o, si falta, `created:`) |
   | `root:` en `sddf.config.yaml` | se elimina |
   | `SDDF_ROOT` | se elimina; ya no se lee |
   | `docs/templates/`, `docs/guardrails/`, `docs/requirements/` y demás capas de `docs/` | sin cambios |
   | — | `specs/living/` y `workflow/` (reservados, con `.gitkeep`) |

3. **Pasos numerados**, en el estilo imperativo de la sección 4.0.0:
   1. Crea un commit de respaldo con el árbol limpio.
   2. Ejecuta `npx agile-sddf install --force`. Borra a mano las copias instaladas de `docs-wiki-builder` en el directorio de skills de cada runtime; el instalador no las elimina (STORY-152 CR-003).
   3. Ejecuta `/skill-preflight` y anota las señales de layout legado que informa.
   4. Crea `specs/flow/archive/`, `specs/living/` y `workflow/`, cada uno con un `.gitkeep`. `/sddf-init` no los crea mientras exista `docs/specs/`: avisa y remite a esta sección (CS-13).
   5. Mueve cada épica con `git mv docs/specs/epics/EPIC-NN-<slug> specs/flow/`.
   6. Mueve cada historia que no esté `COMPLETED` con `git mv docs/specs/stories/STORY-NNN-<slug> specs/flow/`.
   7. Mueve cada historia `COMPLETED` con `git mv docs/specs/stories/STORY-NNN-<slug> specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>`, con la fecha de su `updated:` (o `created:`). Las `CANCELED` y los demás estados quedan en `specs/flow/`; las épicas no se archivan.
   8. Elimina lo que quede en `docs/specs/` (por ejemplo, su `README.md`) y el directorio.
   9. Quita la clave `root` de `sddf.config.yaml` y retira `SDDF_ROOT` del entorno, de los scripts y de la CI.
   10. Regenera el índice con `/memory-system index` y busca enlaces que aún apunten a `docs/specs/` (`git grep -n "docs/specs/"`).
   11. Verifica: `/skill-preflight` sin señales de layout legado, `/memory-system check` sin errores y `git log --follow` sobre un `story.md` movido, que debe mostrar su historial.
4. **Notas:** `git mv` conserva el historial (CS-6). No hay migrador automático distribuido: el script de STORY-153 es solo de este repositorio (CS-11). Si el proyecto usa Spec Kit, su `specs/` puede convivir con el de SDDF, que solo usa `specs/flow/` y `specs/living/` (ADR-0016, consecuencias).

Además, en la misma guía:
- La nota final de `## Migración histórica 1.x → 2.x` («Resuelve `$SPECS_BASE` con la precedencia…») se reformula en pasado: «En 1.x–4.x `$SPECS_BASE` se resolvía con… Desde 5.0.0 no hay raíz configurable: aplica después la sección de 5.0.0».
- La línea introductoria de la sección 4.0.0 recibe una cita como la que ya tiene la sección 1.x: «> Su destino `specs/epics/` y `specs/stories/` bajo `docs/` quedó reemplazado en 5.0.0; continúa con la sección anterior».
- Frontmatter: `title` y `slug` sin cambios (enlaces de `README.md`, CHANGELOG e índice).

Antes de escribir cada comando, comprobar que existe en el skill entregado: el diagnóstico legado de `skill-preflight`, el aviso de `/sddf-init` y `.gitkeep` (CNF-1).

**Alternativas rechazadas:**
- **Guía nueva independiente (`layout-migration.md`):** `/sddf-init` y `skill-preflight` (STORY-149 D-5, STORY-152) ya remiten a `artifact-directory-migration.md`, y la épica la nombra (CS-14).
- **Script de migración para practitioners:** contradice CS-11 (sin script reutilizable de movimiento).
- **Sección al final del archivo:** rompe el orden cronológico inverso vigente de la guía.

### D-9 — Resto de guías // satisface: AC-1, CNF-1, CNF-2

| Guía | Cambio |
|---|---|
| `root-folder-practices.md` | Se reescribe con el mismo `slug` y un `title` nuevo: «Raíces del repositorio y layout fijo SDDF». Secciones: raíces no intercambiables (`REPO_ROOT`, layout fijo `docs/`·`specs/`·`workflow/`, `CLI_ROOT` con destinos en `config/runtimes.json`); contrato de los skills (marcador `SDDF-FIXED-LAYOUT: v1` y rutas fijas); diagnóstico (`/skill-preflight`, layout legado); checklist de revisión. Se retiran «Precedencia canónica», «Configuración versionada» y «Override temporal», con una línea que remite a [la sección de migración](artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices). |
| `sddf-commands-pipeline.md` | Se reemplaza la sección de las líneas 21–32 (tabla de precedencia y `export SDDF_ROOT`) por un párrafo de layout fijo. `$SPECS_BASE/` pasa a `docs/` (líneas 69–75, 136, 157, 178–180), a `specs/flow/EPIC-NN-<slug>/epic.md` (199) y a `specs/flow/STORY-NNN-<slug>/story.md` (200). Se quita la nota de la línea 183. |
| `skill-structural-pattern.md` | §3 «Resolución local de contexto» → «Layout fijo»; línea 60 → `docs/templates/`; el árbol de las líneas 126–132 pasa a `docs/…` y `specs/flow/…`. |
| `organization-of-artifacts.md` | Las líneas 27–30 (árbol `docs/specs/` y «Puedes cambiarlo…») pasan al layout fijo sin configurabilidad; las líneas 57–58 pasan a `specs/flow/EPIC-001-…/epic.md` y `specs/flow/STORY-001-…/story.md`. |
| `harness-eng-agents-orchestration.md` | Línea 36 → «cada workflow resuelve `REPO_ROOT` y usa rutas fijas»; en el prompt de ejemplo de la línea 170 se quita `SPECS_BASE=docs`; línea 180 → «pasarle `REPO_ROOT` y las rutas ya resueltas». |
| `best-practices-for-skills.md` | Líneas 160 y 223: los «valores ya resueltos» pasan a ser `REPO_ROOT` y las rutas fijas, sin `SPECS_BASE`. |
| `flight-leves-model.md` | Árbol de las líneas 55–63 → `specs/flow/` plano (épicas e historias hermanas) y `archive/`. La nota de terminología v1.x (línea 25) es registro histórico y se conserva. |
| `README.md` (guías) | Filas de las líneas 43–45 con descripciones nuevas. La fila de `artifact-directory-migration.md` enlaza además [la sección 5.0.0](artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices): el gate valida esa ancla, que es la misma que usa el CHANGELOG (D-10). |

`docs/constitution.md` (D-3): las líneas 136–137 pasan a «Todo skill resuelve una vez `REPO_ROOT` y usa el layout fijo de ADR-0016». Las rutas `$SPECS_BASE/…` de las líneas 92–95, 217–223, 237 y 260 pasan a `docs/…` y `specs/flow/…`. Se actualiza `updated:`.

`README.md` raíz (D-3): las tablas de las líneas 80–82 y 174 pasan a `docs/` y `specs/flow/`. La fila de diagnóstico de la línea 156 pasa a «Ejecuta `/skill-preflight`: diagnostica el layout legado y remite a la guía de migración». Las líneas 214–222 pasan al árbol de tres raíces. En el ejemplo de configuración (344–347) se quita `root: docs` y se añade la indicación de que `/sddf-init` ya no la escribe. La fila de la línea 364 pasa a «Layout fijo (ADR-0016); ver guía de migración». Las líneas 411–413 no se tocan (registro histórico).

**Alternativas rechazadas:**
- **Eliminar `root-folder-practices.md`:** rompe los enlaces de `docs/guides/README.md`, del índice y de los ADR que la citan. La guía sigue haciendo falta para `REPO_ROOT` y `CLI_ROOT`.
- **Marcarla como deprecada y apuntar a ADR-0016:** deja en una guía activa la descripción completa de un mecanismo retirado.

### D-10 — CHANGELOG: `### BREAKING` en `[Unreleased]` // satisface: AC-2

Se añade como **primera** subsección de `## [Unreleased]` (precedente 4.1.0: BREAKING primero) el encabezado `### BREAKING — layout fijo de tres raíces (EPIC-26, requiere 5.0.0)`, con párrafos en el estilo de la entrada 4.0.0:
- Frase de apertura: ADR-0016 y EPIC-26 fijan `docs/`, `specs/` y `workflow/` como raíces hermanas y retiran `SDDF_ROOT`, la clave `root` y `SPECS_BASE`. «Este cambio requiere la versión major **5.0.0**.»
- **Rutas:** `docs/specs/epics/` y `docs/specs/stories/` → `specs/flow/` plano; stories `COMPLETED` → `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`.
- **Skills cuyo comportamiento cambió:** `/sddf-init` (crea las tres raíces, no escribe `root` y avisa sin escribir ante `docs/specs/`), `/skill-preflight` (diagnóstico del layout legado), `/memory-system` (diez capas e índice con `## 🗂️ Work items (specs/flow/)`, STORY-152 CR-003) y el resto de skills (rutas fijas). La lista se verifica contra lo entregado antes de escribirla.
- **Guía:** `migra con la [guía de migración a 5.0.0](docs/guides/artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices)`.

No se duplica el `### Removed` de `docs-wiki-builder` que añade STORY-152 D-10; si existe, la entrada BREAKING lo cita en una frase. No se crea `## [5.0.0]` ni se toca `package.json` (Non-Goals; CR-003).

**Alternativas rechazadas:**
- **Crear ya `## [5.0.0] — <fecha>`:** `verify-release.js` exige que coincida con `package.json`. Publicar no forma parte de la historia.
- **Repartir el cambio en `### Changed` y `### Removed`:** oculta la incompatibilidad. El precedente del repo usa `### BREAKING — … (requiere X.0.0)`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Entrada IA | modificar | `AGENTS.md` | AC-1, CNF-1 |
| Arquitectura del framework | modificar | `docs/architecture/sddf-architecture.md` | AC-1 |
| Arquitectura de memoria | modificar (3 líneas, condicional) | `docs/architecture/memory-system.md` | AC-1 |
| Índice de arquitectura | modificar (1 línea) | `docs/architecture/README.md` | AC-1 |
| Índice wiki | regenerar | `docs/index.md` | AC-1 |
| Guía de migración | modificar (sección nueva y dos notas) | `docs/guides/artifact-directory-migration.md` | AC-2 |
| Guía de raíces | reescribir (mismo slug) | `docs/guides/root-folder-practices.md` | AC-1 |
| Guías afectadas | modificar | `docs/guides/{sddf-commands-pipeline,skill-structural-pattern,organization-of-artifacts,harness-eng-agents-orchestration,best-practices-for-skills,flight-leves-model,README}.md` | AC-1, AC-2 |
| Constitución | modificar | `docs/constitution.md` | AC-1, CNF-1 |
| Portada del paquete | modificar | `README.md` | AC-1, CNF-1 |
| Registro de cambios | modificar | `CHANGELOG.md` | AC-2 |
| Prueba del checker | modificar (1 caso) | `test/check-doc-links.test.js` | AC-3 |

Sin cambios: `scripts/check-doc-links.js`, skills, `sddf.config.yaml`, `docs/adr/`, `docs/specs/`, `docs/requirements/`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Ancla de la sección de migración | `docs/guides/artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices`, calculada con `githubAnchor` del checker; la usan `docs/guides/README.md`, `root-folder-practices.md` y `CHANGELOG.md` | AC-2 |
| Destino de los avisos | `/sddf-init` (STORY-149) y `skill-preflight` (STORY-152) nombran `docs/guides/artifact-directory-migration.md`: la ruta del archivo no cambia | AC-2 |
| Error del gate | `<archivo>:<línea>: Missing local target: <ruta>` desde `checkDocumentation`; exit 1 en `verify:links` | AC-3 |
| Generación del índice | `/memory-system index` con el template de STORY-152; sin edición manual | AC-1 |
| Fuente de skills pendientes | `PENDING_MIGRATION` de `scripts/verify-fixed-layout.js`, citada por la nota de transición de `AGENTS.md` | AC-1, CNF-1 |
| Convención de citas | enlace Markdown = archivo existente; code span = patrón o ruta objetivo (D-2) | AC-3, CNF-1 |

## Esquema de datos

N/A: no hay datos estructurados nuevos. Frontmatter: `docs/constitution.md` actualiza `updated:`; `root-folder-practices.md` cambia `title:` y conserva `slug: root-folder-practices`; `artifact-directory-migration.md` conserva `slug` y `title`. // satisface: AC-1, AC-2

## Flujos clave

### F-1 — Documentación del layout (escenario principal) // AC-1, AC-2
1. Comprobar las precondiciones de D-1: existen `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md`, `scripts/verify-fixed-layout.js`, el diagnóstico legado de `skill-preflight` y `docs/specs/`.
2. Inventario: `git grep -nE "SPECS_BASE|SDDF_ROOT|root: docs|docs/specs|specs/(epics|stories)"` sobre los archivos de D-3, clasificando cada línea con D-2.
3. Guía de migración (D-8). Va primero porque las demás guías y el CHANGELOG enlazan su ancla.
4. `AGENTS.md` (D-4), arquitectura (D-5), guías (D-9), constitución y `README.md` (D-9).
5. CHANGELOG (D-10).
6. Regenerar `docs/index.md` (D-6).

### F-2 — Gate y regresión (escenario alternativo) // AC-3
1. Añadir el caso de D-7 y ejecutar `npm test`.
2. Ejecutar `npm run verify:repository`. Ante un enlace roto se corrige la ruta, nunca el checker ni la prueba.

### F-3 — Degradación // P7
- **Falta una precondición de D-1:** detener antes de editar e informar en `implement-report.md`.
- **STORY-153 ya se ejecutó:** el gate está en rojo por enlaces ajenos. Informar y no forzar el verde editando entradas del índice: esa reparación es de STORY-157.
- **Un comando documentado no existe en el skill entregado** (p. ej. el diagnóstico legado de `skill-preflight`): no se documenta. Se registra como defecto de la historia dueña (CNF-1).
- **`docs/architecture/memory-system.md` ya no tiene las líneas de D-5:** se omiten; STORY-152 las resolvió.

### F-4 — Puntos de cambio // P6
- Al cerrar EPIC-26, STORY-157 retira la viñeta «Transición EPIC-26» de `AGENTS.md` (CR-002).
- La épica de Living Spec moverá `docs/requirements/` a `specs/living/` y actualizará la frase de `AGENTS.md` y el árbol de `sddf-architecture.md`, sin tocar la guía 5.0.0.
- La épica de Workflow puede archivar épicas o `CANCELED`: cambia la tabla de D-8 con una sección de migración nueva, sin reescribir la de 5.0.0.

## Decisiones de complejidad justificada

- **Prueba nueva en un `chore` documental (D-7):** es la única forma determinista de sostener la cláusula «Pero» de AC-3. Cuesta un caso de unas diez líneas sobre el fixture existente.
- **Constitución y `README.md` fuera de la lista literal (D-3):** sin ellos, el flujo de autoridad invalidaría `AGENTS.md`. Solo se tocan las líneas de clase «mecanismo vigente».
- **Nota de transición en `AGENTS.md` (D-4):** añade una viñeta, pero evita que los agentes busquen work items donde todavía no están. Remite a fuentes verificables para no desactualizarse.
- **Sin cambios en el checker (D-7):** ampliar `ACTIVE_ROOTS` arrastra deuda ajena.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `AGENTS.md` documenta el layout | `grep -F` en `AGENTS.md` de `specs/flow/`, `specs/flow/archive/`, `<YYYY-MM-DD>-STORY-NNN-<slug>/`, `specs/living/`, `workflow/`, `docs/requirements/` y `ADR-0016` | AC-1 |
| 2 | Rutas de `AGENTS.md` verdaderas | Cada ruta de archivo citada como existente (`docs/product/vision.md`, ADR-0016, `scripts/verify-fixed-layout.js`, `docs/guides/root-folder-practices.md`) existe (`test -e`); `docs/specs/01-projects` ya no aparece | AC-1, CNF-1 |
| 3 | Mecanismo legado no vigente | `git grep -nE "SPECS_BASE\|SDDF_ROOT\|root: docs"` sobre los archivos de D-3: cada coincidencia restante es registro histórico, un título de nodo del índice, la guía de migración o una frase de retiro o transición. Listado y clasificación en `implement-report.md` | AC-1 |
| 4 | Arquitectura e índice reflejan el layout | `sddf-architecture.md` contiene `specs/flow/` y `workflow/` en §7 y no contiene `docs/specs/`; `docs/index.md` contiene `## 🗂️ Work items (specs/flow/)` | AC-1 |
| 5 | Sección de migración | `grep -F '## Migración a 5.0.0 — layout fijo de tres raíces'` en la guía; la sección contiene `docs/specs/`, `specs/flow/`, `root` y `SDDF_ROOT` | AC-2 |
| 6 | CHANGELOG incompatible y enlazado | `## [Unreleased]` contiene `### BREAKING — layout fijo de tres raíces` con `5.0.0` y `artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices` | AC-2 |
| 7 | Ancla real | `docs/guides/README.md` enlaza la misma ancla y `npm run verify:links` termina en verde (el CHANGELOG no se valida, pero comparte la cadena) | AC-2, AC-3 |
| 8 | Regresión del gate | El caso de D-7 pasa en `npm test` | AC-3 |
| 9 | Gate verde | `npm run verify:repository` con código 0 | AC-3 |
| 10 | Alcance | `git diff --stat` solo muestra los archivos de «Componentes afectados»; `git diff --quiet -- docs/requirements docs/adr docs/specs skills` | Non-Goals, CS-10 |
| 11 | Idioma | Revisión del texto nuevo: en español (CNF-2) | CNF-2 |

## Risks / Trade-offs

- **[Riesgo] La secuencia de D-1 no se respeta y STORY-153 corre antes** → el gate queda en rojo por enlaces del índice. F-3 lo detecta y no se fuerza; lo resuelve STORY-157.
- **[Riesgo] Transición incoherente:** desde STORY-154 hasta STORY-153, la documentación describe `specs/flow/` y el repo aún usa `docs/specs/` → lo cubre la viñeta «Transición EPIC-26» (D-4).
- **[Riesgo] Conflicto de versión en `[Unreleased]`:** `### Deprecated` promete eliminar `story-improve` en 5.0.0 «desde 4.2.0». Si EPIC-26 sale como 5.0.0 sin publicar antes 4.2.0, la promesa no se cumple → CR-003 para quien publique.
- **[Trade-off] `AGENTS.md` y `docs/architecture/` no tienen validación automática de enlaces** → contratos 2 y 4 manuales; la ampliación del checker queda fuera (D-7).
- **[Limitación] Deuda fuera de alcance:** el runbook `actualizar-spec-de-proyecto.md`, `docs/product/` y `docs/domains/` siguen citando `$SPECS_BASE`/`docs/specs` → CR-001.
- **[Riesgo] Conflicto de edición con STORY-152 en `CHANGELOG.md` y `memory-system.md`** → D-5 y D-10 tocan solo lo que STORY-152 no toca, y se verifica sobre el estado entregado.

## Open Questions

Ninguna. El momento de implementación se resuelve en D-1, el alcance en D-3 y la verificabilidad de AC-3 en D-7. Las ampliaciones y dependencias quedan como CR.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2–D-6, D-9; contratos 1–4), AC-2 (D-8, D-10; contratos 5–7), AC-3 (D-1, D-2, D-7; contratos 7–9), CNF-1 (D-1, D-2, D-4, D-8; contratos 2–3), CNF-2 (D-4, D-8, D-9; contrato 11).
- **Ambigüedad:** «las guías afectadas» se fija con el inventario de D-3 y la regla de D-2; «el gate falla nombrando el archivo» se fija en D-7.
- **Nombres:** «layout fijo», «tres raíces hermanas», «layout legado» y «guía de migración» se usan igual que en la historia, la épica y ADR-0016.
- **Estructura:** sin dependencias cíclicas. La guía de migración es la hoja que enlazan el CHANGELOG y las demás guías. Cada archivo cambia por una sola razón (describir el layout); sin código de implementación.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 nombra `AGENTS.md`, la arquitectura, el índice, las guías y el CHANGELOG, pero `docs/constitution.md` (que prevalece sobre `AGENTS.md`) y `README.md` (portada del practitioner) describen el mecanismo legado como vigente. Fuera de ambos quedan con menciones legadas `docs/runbooks/actualizar-spec-de-proyecto.md` (desactualizado desde 4.0.0), `docs/product/roadmap.md`, `docs/product/stakeholders.md`, `docs/domains/domain.md` y `docs/domains/domain-epic-lifecycle.md`.
- **Documento afectado**: story.md
- **Acción requerida**: añadir a AC-1 o a las Notas «incluye `docs/constitution.md` y `README.md`» (el diseño los incluye, D-3). Decidir si el runbook y las capas `product/`/`domains/` van a STORY-157 o a una historia de deuda.

### CR-002
- **Tipo**: dependencia
- **Descripción**: la viñeta «Transición EPIC-26» de `AGENTS.md` (D-4) debe retirarse al cerrar la épica, y STORY-154 debe implementarse antes de STORY-153 (D-1). Ninguna de las dos cosas está en las historias.
- **Documento afectado**: story.md de STORY-153 y STORY-157; Notas de EPIC-26
- **Acción requerida**: añadir a STORY-153 la precondición «STORY-154 entregada» y a AC-3 de STORY-157 «se retira la viñeta de transición de `AGENTS.md`». Opcional: en story.md de STORY-154, aclarar que CNF-1 verifica las rutas del layout objetivo contra ADR-0016 y `verify-fixed-layout.js`, no contra el filesystem del repo, donde `specs/` aún no existe.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la entrada BREAKING declara «requiere 5.0.0», mientras `[Unreleased] › Deprecated` dice que `story-improve` es alias «desde 4.2.0» y «se eliminará en 5.0.0». Si no se publica antes una 4.2.0, la versión que retira el alias coincide con la que lo deprecó.
- **Documento afectado**: CHANGELOG.md (al publicar)
- **Acción requerida**: quien publique decide entre publicar 4.2.0 antes de EPIC-26, eliminar `story-improve` en 5.0.0 o reescribir la promesa. Esta historia no lo resuelve (publicar no forma parte de su alcance).
