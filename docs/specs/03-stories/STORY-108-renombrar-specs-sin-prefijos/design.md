---
type: design
id: STORY-108
slug: STORY-108-renombrar-specs-sin-prefijos-design
title: "Design: Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-108
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-108-renombrar-specs-sin-prefijos
  - eliminar-specs-01-projects
  - EPIC-21-colapsar-specs-dos-niveles
---

<!-- Referencias -->
[[STORY-108-renombrar-specs-sin-prefijos]] · [[eliminar-specs-01-projects]] · [[EPIC-21-colapsar-specs-dos-niveles]]

# Diseño técnico: renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`

## Context

[[eliminar-specs-01-projects]] (ADR-0013, `status: PROPOSED`) decide `specs/epics/` + `specs/stories/` sin prefijos numéricos. La
historia hace el renombrado físico y actualiza en el mismo cambio toda referencia viva a las rutas viejas.

**Estado medido (2026-10-07):**

| Elemento | Valor |
|---|---|
| `docs/specs/02-epics/` | 22 directorios `EPIC-*`, 54 archivos versionados, sin archivos sueltos |
| `docs/specs/03-stories/` | 110 directorios `STORY-*` (STORY-001 … STORY-118 con huecos), 318 archivos versionados, sin archivos sueltos |
| `docs/specs/01-projects/PROJ-01-agile-sddf/` | 5 archivos: `project-intent.md`, `project.md`, `project-plan.md`, `story-map.md`, `context-diagram.puml`. STORY-104…107 (en PLAN, sin implementar) los migran o eliminan. |
| Copia de trabajo | `core.autocrlf=true`; hoy hay 13 entradas en `git status --porcelain` (artefactos de planning de STORY-105…107 sin commitear) |
| `npm test` (`node --test test`) | 219 pruebas, 219 pass, exit 0 |
| `memory-system.js check --root docs` | exit 1, `problemas: 55 (orphan 6 · broken-wikilink 49)` (línea base, ninguno por ruta) |
| `scripts/check-doc-links.js` | `[OK] Checked 46 active Markdown files`; excluye `docs/specs`, `docs/adr`, `CHANGELOG.md` |

**Referencias a `02-epics`/`03-stories` fuera de los registros históricos** (`grep -rlE "02-epics|03-stories"`):

| Zona | Archivos | Forma dominante |
|---|---|---|
| `skills/` | 68 archivos en 25 skills (`SKILL.md`, `README.md`, `evals/evals.json`, `examples/`, `assets/`, `references/`, `scripts/`) | `$SPECS_BASE/specs/03-stories` (138), `$SPECS_BASE/specs/02-epics` (83), `specs/0N-…` sin prefijo de raíz, `docs/specs/0N-…` |
| `agents/` | `story-product-owner.agent.md` | ruta `specs/03-stories` |
| `test/` | `epic-template.test.js` (11), `memory-system.test.js` (15) | literales `'02-epics'`/`'03-stories'` en `path.join`, rutas esperadas y nombres de fixture |
| `scripts/` | `migrate-finvest-field.js` (2) | valor por defecto de `--stories-dir` |
| raíz | `README.md` (4), `AGENTS.md` (1) | árbol de directorios, tabla de migración 1.x, `specs/{01-projects,02-epics,03-stories}/` |
| `docs/` vivos | `index.md` (169), `constitution.md` (5), `specs/README.md` (2), `adr/README.md` (1), `architecture/README.md` (1), `architecture/memory-system.md` (4), `domains/README.md` (2), `domains/domain-knowledge-artifacts.md` (5), `domains/domain-work-item-hierarchy.md` (10), `guardrails/gr-ai-security-checklist.md` (4), `guides/artifact-directory-migration.md` (6), `guides/flight-leves-model.md` (7), `guides/organization-of-artifacts.md` (11), `guides/sddf-commands-pipeline.md` (2), `guides/skill-structural-pattern.md` (2), `runbooks/actualizar-spec-de-proyecto.md` (12) | rutas, árboles ASCII, tablas de niveles |
| Excluidos (registro histórico) | `docs/adr/ADR-0004/0005/0007/0010/0011` (`ACCEPTED`), `docs/adr/ADR-0013` (`PROPOSED`, describe el propio renombrado), `docs/specs/01-projects/**` (`project.md` 6, `project-plan.md` 2), todo `EPIC-*/` y `STORY-*/`, `CHANGELOG.md` | — |

`.github/` y `config/` no contienen las cadenas. `sddf.config.yaml` tampoco.

**Directorios con nombre viejo dentro de `skills/`** (fixtures y semilla, no solo texto):

| Directorio | Uso |
|---|---|
| `skills/memory-system/assets/scaffold/specs/{01-projects,02-epics,03-stories}/.gitkeep` | Árbol semilla de `memory-system scaffold`; `test/memory-system.test.js:346` y `:564-566` lo esperan |
| `skills/memory-system/examples/{broken,sane,sddf,sddf-partial}/docs/specs/03-stories/` | Fixtures de `test/memory-system.test.js` |
| `skills/memory-system/examples/epic-template-v1/docs/specs/02-epics/` | Fixture de `test/epic-template.test.js:24` |
| `skills/header-aggregation/examples/{batch/…/02-epics, con-frontmatter/…/03-stories, sin-frontmatter/…/03-stories}` | Ejemplos documentados en el `SKILL.md` |

**Código que depende del nombre del nivel:**

- `skills/memory-system/scripts/memory-system.js:86` — `SPECS_LAYERS = { '01-projects': 'specs-projects', '02-epics': 'specs-epics', '03-stories': 'specs-stories' }`.
  `layerOf` (línea 350) traduce el segundo segmento de `specs/` a capa; un nombre desconocido cae al fallback `specs-<segmento>`.
- `skills/memory-system/assets/index-template.md:62,66` — encabezados `### L2 — Épicas (specs/02-epics/)` y
  `### L1 — Historias de usuario (specs/03-stories/)` del índice generado.
- `skills/memory-system/scripts/epic-template.js:398` — ya descubre `specs/*/EPIC-*/epic.md` sin nombre fijo; solo el comentario cita `02-epics`.
- `scripts/migrate-finvest-field.js:69` — `path.join('docs', 'specs', '03-stories')` como defecto.
- `skills/skill-preflight/SKILL.md:93-95` — exige `specs/01-projects/`, `specs/02-epics/`, `specs/03-stories/` (WARNING si faltan).

**`docs/index.md` regenerado hoy no es neutro:** `memory-system index --dry-run` difiere del índice versionado en más que las rutas
(cambia `updated`, la línea de Foam y agrega entradas de EPIC-21, STORY-102…118 y una entrada espuria por
`STORY-103-…/epic-template.md`).

**Runtimes instalados:** la sesión que ejecuta el pipeline usa skills instalados fuera del repo (`~/.claude/skills/`, `.claude/` local
no versionado). Esas copias siguen apuntando a `specs/03-stories/` hasta que se reinstalan.

Stack aplicable (constitución + `package.json`): Markdown versionado y Node.js ≥ 18 (`node --test`). No se agrega código nuevo; se
editan literales de ruta en código existente.

## Goals / Non-Goals

**Goals:**

- `docs/specs/epics/` y `docs/specs/stories/` contienen exactamente los directorios y archivos de las carpetas originales, que dejan de
  existir; git registra cada archivo como renombrado. // satisface: AC-1
- Ninguna referencia viva (alcance de D-6) contiene `02-epics` ni `03-stories`; `npm test` exit 0; el protocolo de `skill-preflight`
  devuelve OK. // satisface: AC-2
- `skill-preflight` deja de verificar `specs/01-projects/`; `docs/specs/01-projects/` se elimina si está vacía o se conserva intacta y se
  informa su contenido. // satisface: AC-3
- Renombrado y referencias viajan en un único commit. // satisface: CNF-1
- `memory-system check` no agrega wikilinks rotos y `docs/index.md` muestra las rutas nuevas. // satisface: CNF-2
- Todo archivo tocado queda en UTF-8 sin BOM y sin mojibake. // satisface: CNF-3

**Non-Goals:**

- Editar registros históricos: archivos dentro de `EPIC-*/` y `STORY-*/` (salvo las dos ediciones puntuales de D-8), ADRs (`ADR-*.md`),
  `CHANGELOG.md` ni `docs/specs/01-projects/**`.
- Reescribir el modelo de niveles en la documentación canónica (`domain-*`, `memory-system.md`, `docs/specs/README.md`, `README`):
  aquí solo se cambian rutas y la frase mínima que quedaría falsa (D-5). La reescritura es de STORY-116.
- Quitar `01-projects` de la semilla de `memory-system scaffold`, de `sddf-init` o de `SPECS_LAYERS` (STORY-113/115), y reconocer el
  layout viejo en repos ajenos (`migrate --from=specs-3-levels`, STORY-114).
- Cambiar qué escriben los skills `project-*` (STORY-109…112).
- Corregir los 55 problemas preexistentes de `check`.
- Editar `.claude/` (no versionado).

## Decisions

### D-1 — Renombrar cada nivel con un solo `git mv` de directorio // satisface: AC-1, CNF-1

- Operaciones: `git mv docs/specs/02-epics docs/specs/epics` y `git mv docs/specs/03-stories docs/specs/stories`.
- Precondiciones (si alguna falla, no se ejecuta nada — F-3):
  - `git status --porcelain` vacío salvo los artefactos de STORY-108; los planning de otras historias se commitean antes.
  - `docs/specs/epics` y `docs/specs/stories` no existen.
  - Conteos de línea base guardados en `.tmp/story-108/baseline.txt`: directorios `EPIC-*`/`STORY-*` y archivos
    (`git ls-files <dir> | wc -l` y `find <dir> -type f | wc -l`, para cubrir también archivos no versionados).
- Rename detection: los archivos movidos no cambian de contenido (salvo D-8), así que `git diff --cached -M --name-status` los reporta
  como `R100`; los editados por D-8 conservan similitud > 50 % y salen como `Rnnn`.

**Alternativas rechazadas:**

- *`git mv` archivo por archivo o `mkdir` + `git mv` por subdirectorio:* mismo resultado con 372 operaciones y más superficie de error;
  solo se usa como fallback ante un bloqueo de Windows (F-3).
- *Copiar a la ruta nueva y `git rm` la vieja:* git sigue detectando el renombrado al comparar, pero deja una ventana con el árbol
  duplicado y arrastra archivos no versionados sin control.
- *Dejar un enlace simbólico `02-epics → epics`:* contradice AC-1 ("no existen") y los symlinks no son portables en Windows.

### D-2 — Fixtures y semilla de `skills/` también se renombran // satisface: AC-2

Los directorios listados en *Context* se renombran con `git mv`, con estas reglas:

| Directorio actual | Directorio nuevo |
|---|---|
| `skills/memory-system/assets/scaffold/specs/02-epics/` | `…/scaffold/specs/epics/` |
| `skills/memory-system/assets/scaffold/specs/03-stories/` | `…/scaffold/specs/stories/` |
| `skills/memory-system/assets/scaffold/specs/01-projects/` | sin cambios (Non-Goal, STORY-115) |
| `skills/memory-system/examples/*/docs/specs/0N-…/` | `…/docs/specs/{epics,stories}/` |
| `skills/header-aggregation/examples/*/docs/specs/0N-…/` | `…/docs/specs/{epics,stories}/` |

Consecuencia: `memory-system scaffold` crea `specs/01-projects/`, `specs/epics/` y `specs/stories/` en proyectos nuevos. Es el
efecto mínimo de que AC-2 prohíba `02-epics` en `test/` (las aserciones de la semilla dejan de poder nombrarlo); quitar `01-projects`
sigue siendo de STORY-115 (CR-001).

**Alternativas rechazadas:**

- *Dejar la semilla con `02-epics/` y excluir esos tests del grep:* AC-2 nombra `test/` sin excepciones, y el repo quedaría sembrando
  una estructura que él mismo ya no usa.
- *Adelantar STORY-115 completa (quitar también `01-projects` de la semilla):* amplía el alcance y rompe el corte acordado en EPIC-21.

### D-3 — Código: mapa de capas, plantilla del índice y defectos // satisface: AC-2, CNF-2

| Archivo | Cambio |
|---|---|
| `skills/memory-system/scripts/memory-system.js:86` | Claves `'02-epics'`/`'03-stories'` → `epics`/`stories`; valores de capa (`specs-epics`, `specs-stories`) y clave `'01-projects'` sin cambios |
| `skills/memory-system/assets/index-template.md:62,66` | `specs/02-epics/` → `specs/epics/`, `specs/03-stories/` → `specs/stories/` en los encabezados |
| `skills/memory-system/scripts/epic-template.js:398` | Comentario: "sin hardcodear el nombre del nivel (sobrevive a renombrados del directorio de épicas)" |
| `scripts/migrate-finvest-field.js:29,69` | Defecto y ayuda de `--stories-dir` → `docs/specs/stories` |
| `test/epic-template.test.js` | `EPICS` y defaults de `docsWith`/`epicOf` → `'epics'`; aserciones `specs/02-epics/…` → `specs/epics/…`; UT-018 conserva su intención (descubrir `specs/*/EPIC-*/epic.md` con cualquier nombre de nivel) usando `'otro-nivel'` en lugar de `'02-epics'` y `'stories'` en lugar de `'03-stories'` |
| `test/memory-system.test.js` | Rutas `specs/03-stories/…`/`specs/02-epics/…` → `specs/stories/…`/`specs/epics/…`; lista de la semilla (líneas 346, 564-566) → `['01-projects', 'epics', 'stories']` |

Los identificadores de capa (`specs-epics`, `specs-stories`) no cambian: son la interfaz que consumen el índice y `check`, y ya no
llevaban número.

**Alternativas rechazadas:**

- *Mapear claves viejas y nuevas a la misma capa (compatibilidad):* reintroduce `'02-epics'` en `skills/` (viola AC-2) y adelanta la
  responsabilidad de STORY-114. Un repo ajeno con layout viejo degrada a la capa `specs-02-epics` por el fallback existente (F-3), sin
  error.
- *Renombrar también los identificadores de capa:* cambio de interfaz sin necesidad.

### D-4 — Sustitución textual en un conjunto cerrado de archivos // satisface: AC-2, CNF-3

1. **Conjunto objetivo:** `git grep -lE "02-epics|03-stories"` sobre el alcance de D-6, después de D-1/D-2 (las rutas nuevas ya
   existen). Se guarda en `.tmp/story-108/targets.txt`, junto con el listado de líneas con token "desnudo" (no precedido por
   `specs/` ni `specs\`) en `.tmp/story-108/bare-lines.txt`.
2. **Reglas, en orden**, aplicadas solo a esos archivos:

   | # | Patrón | Reemplazo |
   |---|---|---|
   | R1 | `specs/02-epics` | `specs/epics` |
   | R2 | `specs/03-stories` | `specs/stories` |
   | R3 | `specs\02-epics` · `specs\03-stories` (rutas Windows en guías) | `specs\epics` · `specs\stories` |
   | R4 | `02-epics` (resto) | `epics` |
   | R5 | `03-stories` (resto) | `stories` |

3. **Herramienta:** `sed -i -E` de Git Bash sobre la lista explícita. Opera por bytes: conserva UTF-8, la ausencia de BOM y los fines
   de línea CRLF/LF de cada archivo (ningún patrón incluye `\r` ni bytes no ASCII).
4. **Revisión manual obligatoria** de cada línea de `bare-lines.txt` y de los archivos de D-5: R4/R5 pueden producir frases correctas en
   ruta pero falsas en significado.

**Alternativas rechazadas:**

- *Editar a mano los ~100 archivos:* lento y con alto riesgo de omisiones; el grep de AC-2 lo detectaría pero tarde.
- *Script Node versionado en `scripts/`:* herramienta de un solo uso; la migración para repos ajenos es STORY-114.
- *Reemplazo global sin lista cerrada (`git grep` + `sed` sobre todo el repo):* reescribiría registros históricos (Non-Goal).

### D-5 — Documentos donde el prefijo tenía significado // satisface: AC-2

Tras R4/R5 se ajusta a mano solo la frase que quedaría falsa; no se reescribe el modelo (STORY-116):

| Archivo | Ajuste mínimo |
|---|---|
| `docs/domains/domain-work-item-hierarchy.md` | Frase "carpetas ordenadas por nivel, con un prefijo numérico que preserva el orden lógico" → el orden lo da el nivel, no el nombre de carpeta; tabla `Segmento de carpeta \| Orden` conserva la columna `Orden` como orden lógico; `FolderSegment` lista `01-projects`, `epics`, `stories` |
| `docs/guides/flight-leves-model.md` | Nota de terminología: `specs/epics/`; árbol y rutas `docs\specs\epics` / `docs\specs\stories`; texto `(Entregables - L2)` intacto |
| `docs/guides/organization-of-artifacts.md` | Árboles y búsqueda por ID con `epics/`, `stories/`; se mantiene `01-projects/` donde aparezca |
| `README.md` (tabla "Migración histórica desde 1.x") | Encabezado `Después (2.x+)` → `Ruta actual`; filas `docs/specs/releases/` → `docs/specs/epics/` y `docs/specs/stories/` → `docs/specs/stories/` (directorio por historia `STORY-NNN-<slug>/`). La fila de `projects` no cambia |
| `docs/guides/artifact-directory-migration.md` | La columna destino y los comandos `mkdir -p`/`git mv` apuntan a `epics/`/`stories/` (la guía describe dónde va hoy cada artefacto) |
| `AGENTS.md:30` | `specs/{01-projects,epics,stories}/` si `01-projects/` sigue existiendo; `specs/{epics,stories}/` si se eliminó (regla de veracidad de AGENTS.md) |
| `skills/header-aggregation/SKILL.md:165-166` | "Para `stories/`: busca `story.md`" / "Para `epics/`: busca `epic.md`" |

**Alternativas rechazadas:**

- *Reescribir ya estos documentos al modelo de dos niveles:* es el alcance de STORY-116 y mezclaría dos revisiones en un diff de
  cientos de archivos.
- *Excluir del grep los documentos con prefijo semántico:* AC-2 los incluye y seguirían enseñando rutas inexistentes.

### D-6 — Alcance de "referencia viva" y comando de verificación de AC-2 // satisface: AC-2

Alcance = `skills/`, `agents/`, `test/`, `scripts/`, `README.md`, `AGENTS.md` y `docs/`, **excluyendo**:

- `docs/specs/epics/*/**` y `docs/specs/stories/*/**` (registros por work item — Non-Goal de la historia);
- `docs/adr/ADR-*.md` (decisiones; los `ACCEPTED` son inmutables y ADR-0013 describe el propio renombrado — CR-002);
- `docs/specs/01-projects/**` (AC-3: si sobrevive, se conserva intacta — CR-002).

`docs/adr/README.md`, `docs/specs/README.md` e `index.md` sí están en el alcance. Verificación (exit 1 de `git grep` = sin
coincidencias):

`git grep -nE "02-epics|03-stories" -- skills agents test scripts README.md AGENTS.md docs ':(exclude,glob)docs/specs/epics/*/**' ':(exclude,glob)docs/specs/stories/*/**' ':(exclude,glob)docs/adr/ADR-*' ':(exclude,glob)docs/specs/01-projects/**'`

**Alternativas rechazadas:**

- *Grep sin exclusiones:* incumplible sin violar el Non-Goal de registros históricos y la inmutabilidad de ADRs.
- *Excluir solo los cuatro ADRs que nombra la historia:* ADR-0007 (`ACCEPTED`) también menciona las rutas y AGENTS.md prohíbe editarlo.

### D-7 — `docs/index.md`: sustitución en el lugar, no regeneración // satisface: CNF-2

- `docs/index.md` entra en el conjunto de D-4 (R1/R2 sobre sus 169 menciones: enlaces `](specs/0N-…)` y encabezados de sección).
- Se verifica que la regeneración también mostraría rutas nuevas:
  `node skills/memory-system/scripts/memory-system.js index --root docs --dry-run` no contiene `02-epics` ni `03-stories`.
- Ninguna otra línea del índice cambia (ni `updated`, ni entradas nuevas).

**Alternativas rechazadas:**

- *Regenerar con `memory-system index`:* arrastra cambios ajenos (entradas de STORY-102…118, entrada espuria de `epic-template.md`,
  línea de Foam), igual que en STORY-104…107.
- *No tocar el índice:* rompería `scripts/check-doc-links.js` (incluye `docs/index.md` en `ACTIVE_ROOTS`) al apuntar a carpetas
  inexistentes.

### D-8 — `skill-preflight`, `01-projects/` y EPIC-21 // satisface: AC-2, AC-3

- `skills/skill-preflight/SKILL.md`, Verificación 2: la lista pasa a `specs/epics/` y `specs/stories/`; `specs/01-projects/` se quita
  (también del ejemplo del informe). `evals/evals.json`: contextos y `contains` con `specs/epics`/`specs/stories`; el contexto del caso
  de raíz personalizada deja de mencionar `specs/01-projects`.
- `docs/specs/01-projects/`, al final de la implementación (D-9 paso 7):
  - si no contiene archivos → se elimina el directorio residual (git no versiona directorios vacíos);
  - si contiene archivos → no se toca y `implement-report.md` de STORY-108 lista cada archivo restante (`find docs/specs/01-projects -type f`).
- EPIC-21 (`docs/specs/epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, ya movido), sustitución de subcadenas:

  | Ubicación | Antes | Después |
  |---|---|---|
  | Línea de STORY-108 en `## Historias` | `` dejando `01-projects/` eliminado. `` | `` eliminando `01-projects/` solo si quedó vacía. `` |
  | Nota "Actualizar skills que referencian rutas de `specs/`" | `` que use rutas de `01-projects/`, `02-epics/` o `03-stories/`. `` | `` que use rutas de `01-projects/` (las rutas de `02-epics/`/`03-stories/` las actualiza STORY-108 junto con el renombrado). `` |

  El texto de la épica conserva los nombres viejos porque describe el cambio (está fuera del alcance de D-6).

**Alternativas rechazadas:**

- *Mantener `01-projects/` en preflight como WARNING:* AC-3 pide explícitamente que no se exija.
- *Borrar `01-projects/` aunque tenga archivos:* perdería contenido que STORY-104…107 aún no migraron.

### D-9 — Orden de la operación y commit único // satisface: CNF-1, CNF-2, CNF-3

1. Línea base: `npm test`, `memory-system check` (`.tmp/story-108/check-before.txt`), conteos de D-1.
2. `git mv` de los dos niveles (D-1) y de fixtures/semilla (D-2).
3. Cambios de código (D-3).
4. Sustitución textual (D-4) + revisión manual (D-4.4, D-5).
5. `docs/index.md` (D-7), `skill-preflight` y EPIC-21 (D-8).
6. Verificaciones (Contratos de verificación).
7. Tratamiento de `01-projects/` (D-8).
8. Un único `git commit` con todo lo anterior en la rama `epic/EPIC-21-colapsar-specs-dos-niveles`.
9. Reinstalar los runtimes (`node scripts/cli.js install --force` y, si el mantenedor usa la instalación global, `--global`), para que
   las fases siguientes de STORY-108 y del resto de EPIC-21 usen las rutas nuevas (F-2).

"Sin wikilinks rotos nuevos" se mide como delta contra `check-before.txt`: `problemas` y `broken-wikilink` no aumentan y ninguna línea
nueva menciona `specs/epics/` ni `specs/stories/` más allá de las que ya existían con la ruta vieja.

**Alternativas rechazadas:**

- *Dos commits (renombrado y luego referencias):* el primero deja skills apuntando a carpetas inexistentes (viola CNF-1).
- *Partir la historia por área (`skills/` vs `docs/`):* sigue exigiendo integración conjunta y duplica la verificación.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Nivel de épicas | renombrar | `docs/specs/02-epics/` → `docs/specs/epics/` | AC-1, CNF-1 |
| Nivel de historias | renombrar | `docs/specs/03-stories/` → `docs/specs/stories/` | AC-1, CNF-1 |
| Semilla y fixtures | renombrar directorios | `skills/memory-system/assets/scaffold/specs/`, `skills/memory-system/examples/*/`, `skills/header-aggregation/examples/*/` | AC-2 |
| Mapa de capas de specs | modificar 1 línea | `skills/memory-system/scripts/memory-system.js` | AC-2, CNF-2 |
| Plantilla del índice | modificar 2 líneas | `skills/memory-system/assets/index-template.md` | AC-2, CNF-2 |
| Migrador FINVEST | modificar defecto | `scripts/migrate-finvest-field.js` | AC-2 |
| Pruebas | modificar literales | `test/epic-template.test.js`, `test/memory-system.test.js` | AC-2 |
| Verificación de entorno | modificar | `skills/skill-preflight/SKILL.md`, `skills/skill-preflight/evals/evals.json` | AC-2, AC-3 |
| Skills, agentes y evals restantes | modificar rutas | 68 archivos de `skills/`, `agents/story-product-owner.agent.md` | AC-2 |
| Documentación viva | modificar rutas | `README.md`, `AGENTS.md`, `docs/` vivos (16 archivos de *Context*) | AC-2 |
| Índice de documentación | modificar rutas | `docs/index.md` | AC-2, CNF-2 |
| Épica EPIC-21 | modificar 2 subcadenas | `docs/specs/epics/EPIC-21-colapsar-specs-dos-niveles/epic.md` | AC-3 |
| Directorio de proyecto | eliminar si vacío / conservar | `docs/specs/01-projects/` | AC-3 |

No se crean componentes ejecutables. Se reutilizan `git mv`, `git grep`, `sed`, `memory-system.js check|index --dry-run`,
`scripts/check-doc-links.js` y `npm test` (P3).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Ruta de épicas | `$SPECS_BASE/specs/epics/EPIC-NN-<slug>/epic.md` | AC-1, AC-2 |
| Ruta de historias | `$SPECS_BASE/specs/stories/STORY-NNN-<slug>/story.md` (+ artefactos de la historia) | AC-1, AC-2 |
| Capa de `memory-system` | `layerOf('specs/epics/…') = 'specs-epics'`, `layerOf('specs/stories/…') = 'specs-stories'`; segmento desconocido → `specs-<segmento>` | AC-2, CNF-2 |
| Semilla de `scaffold` | `specs/01-projects/.gitkeep`, `specs/epics/.gitkeep`, `specs/stories/.gitkeep`, `specs/README.md` | AC-2 |
| `migrate-finvest-field.js --stories-dir` | Defecto `docs/specs/stories` | AC-2 |
| Informe de `skill-preflight` | Verificación 2 emite `[OK]`/`[WARNING]` solo para `specs/epics/` y `specs/stories/` | AC-2, AC-3 |
| Wikilinks `[[slug]]` | Resuelven por slug (`slugSetOf`), independientes de la ruta; ningún slug cambia | CNF-2 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni formato. Los `slug`, `id`, `parent` y `related` de épicas e historias quedan intactos (por eso los
wikilinks sobreviven al movimiento). Artefactos auxiliares no versionados en `.tmp/story-108/`: `baseline.txt`, `check-before.txt`,
`targets.txt`, `bare-lines.txt`.

## Flujos clave

### F-1 — Renombrado (AC-1, AC-2, AC-3)

`precondiciones (D-1)` → `línea base` → `git mv` niveles + fixtures → código (D-3) → `sed` R1…R5 → revisión manual →
índice/preflight/épica → verificaciones → `01-projects/` → commit único → reinstalar runtimes.

### F-2 — Uso posterior

Un skill resuelve `$SPECS_BASE` y busca `specs/stories/{story_id}-*/`; `memory-system index` agrupa por `specs-epics`/`specs-stories`
bajo encabezados con las rutas nuevas; `skill-preflight` informa OK con los dos directorios. Un runtime instalado **antes** del commit
sigue buscando `specs/03-stories/` y no encuentra la historia: por eso D-9 paso 9. Mientras no se reinstale, los skills aceptan
`{story_path}` explícito como vía de escape.

### F-3 — Degradación (P7)

| Fallo | Comportamiento |
|---|---|
| Precondición de D-1 incumplida (árbol sucio, destino existente) | No se ejecuta ningún `git mv`; se informa qué falta |
| `git mv` de directorio falla en Windows (`Permission denied` por archivo abierto) | Cerrar editores/visores sobre `docs/specs/` y reintentar; fallback: `git mv` por subdirectorio `EPIC-*`/`STORY-*` |
| Una verificación falla tras la sustitución | No se commitea; se corrige y se repite la verificación. Revertir todo: `git reset --hard` + `git clean` solo sobre lo creado por la historia, previa confirmación del mantenedor |
| Repo ajeno con layout viejo usa `memory-system` nuevo | `layerOf` cae al fallback `specs-02-epics`; el índice lo agrupa bajo una capa sin encabezado propio, sin error. Se resuelve con STORY-114 |
| Runtime instalado desactualizado | Los skills no encuentran la historia; reinstalar (D-9.9) o pasar `{story_path}` |

## Decisiones de complejidad justificada

- **Conjunto cerrado de archivos + `sed` en lugar de edición manual:** son ~340 menciones en `skills/`/`test/`/`scripts/` y ~250 en
  `docs/`; la lista cerrada evita tocar registros históricos y el `sed` por bytes garantiza CNF-3 sin herramientas nuevas.
- **Revisión manual de líneas "desnudas":** el reemplazo mecánico es correcto para rutas, no para frases que describen el prefijo
  (D-5). Limitar la revisión a esas líneas mantiene el esfuerzo acotado.
- **Renombrar la semilla y los fixtures:** consecuencia directa de AC-2 sobre `test/`; se limita a `02-epics`/`03-stories` y deja
  `01-projects` para STORY-115.
- No hay abstracciones nuevas: ni compatibilidad dual, ni script versionado, ni regeneración del índice.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Mismos directorios y archivos | `ls -d docs/specs/epics/EPIC-* \| wc -l` = 22 (o la línea base), `ls -d docs/specs/stories/STORY-* \| wc -l` = línea base; `find … -type f \| wc -l` y `git ls-files … \| wc -l` iguales a `baseline.txt` | AC-1 |
| 2 | Carpetas viejas inexistentes | `test ! -e docs/specs/02-epics && test ! -e docs/specs/03-stories` | AC-1 |
| 3 | Renombrado con historial | `git diff --cached -M --name-status -- docs/specs` solo contiene líneas `R…` para los archivos movidos (sin pares `D`+`A`); `git log --follow --oneline docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/story.md` muestra commits previos | AC-1 |
| 4 | Sin referencias vivas | Comando de D-6 → sin coincidencias (exit 1) | AC-2 |
| 5 | Pruebas | `npm test` → exit 0, mismo número de pruebas que la línea base (219) | AC-2 |
| 6 | Preflight OK | Protocolo de `skill-preflight` sobre el repo: `specs/epics/` y `specs/stories/` → `[OK]`, sin `[ERROR]`; el informe no menciona `specs/01-projects/` | AC-2, AC-3 |
| 7 | `01-projects/` | `find docs/specs/01-projects -type f` vacío ⇒ `test ! -e docs/specs/01-projects`; no vacío ⇒ `git diff --cached --quiet -- docs/specs/01-projects` y cada archivo listado en `implement-report.md` | AC-3 |
| 8 | Commit único | `git show --stat HEAD` contiene renombrados y cambios de referencias; ningún commit anterior de la rama mueve `docs/specs/0N-…` | CNF-1 |
| 9 | Wikilinks y enlaces | `memory-system check` sin aumento respecto de `check-before.txt` (D-9); `node scripts/check-doc-links.js` → `[OK]` | CNF-2 |
| 10 | Índice | `grep -cE "02-epics\|03-stories" docs/index.md` = 0 y `index --root docs --dry-run` sin coincidencias | CNF-2 |
| 11 | Encoding | Ningún archivo modificado empieza con `EF BB BF`; `git diff --cached` sin `Ã` ni `ðŸ` nuevos; `file` reporta UTF-8/ASCII | CNF-3 |
| 12 | Raíz y scripts | `node scripts/audit-root-resolution.js` y `npm run verify:eval-inventory` → exit 0 | AC-2 |

## Risks / Trade-offs

- **[Riesgo] Diff enorme (372 renombrados + ~100 archivos editados) difícil de revisar** → la revisión se hace con
  `git diff --cached -M --stat` (renombrados `R100` se ignoran) y `git diff --cached -M --diff-filter=M` para ver solo las ediciones.
- **[Riesgo] Planes de STORY-104…107 y 109…118 citan rutas `02-epics/…`/`03-stories/…`** (p. ej. D-4 de STORY-107 edita
  `docs/specs/02-epics/EPIC-21-…/epic.md`) → son registros históricos (no se reescriben); quien las implemente después traduce la ruta.
  Mitigación preferida: implementar STORY-104…107 antes (CR-003).
- **[Riesgo] R4/R5 producen frases incorrectas** → revisión manual obligatoria de `bare-lines.txt` (D-4.4).
- **[Trade-off] La semilla queda con `01-projects/` + `epics/` + `stories/`** (layout mixto) hasta STORY-115.
- **[Trade-off] El texto de ADRs y registros sigue citando rutas viejas** → aceptado por la historia; ADR-0013 documenta el cambio.
- **[Riesgo] Runtimes instalados desactualizados rompen el resto del pipeline** → reinstalación en D-9.9.

## Open Questions

Ninguna bloqueante. El orden respecto de STORY-104…107 (CR-003) solo cambia qué fila de AC-3 se cumple.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-2 prohíbe `02-epics`/`03-stories` en `test/` y `skills/`, lo que obliga a renombrar el árbol semilla de
  `memory-system scaffold` y los fixtures (D-2). La historia lo pone fuera de alcance ("scaffolding … tiene su propia historia"). Se
  resuelve renombrando solo los dos niveles y dejando `01-projects/` en la semilla. STORY-114 tendrá que reintroducir los nombres viejos
  en la lógica de migración: AC-2 es una foto al cierre de esta historia.
- **Documento afectado**: story.md · EPIC-21 (línea de STORY-115)
- **Acción requerida**: al especificar STORY-115, partir de una semilla `01-projects/` + `epics/` + `stories/`; al cerrar STORY-114,
  aceptar `02-epics`/`03-stories` dentro de la lógica de `migrate`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la definición de "documentos vivos de `docs/`" de la historia (todo fuera de los work items y de los ADRs aceptados)
  incluye `docs/specs/01-projects/**` (`project.md`, `project-plan.md`) y ADR-0013 (`PROPOSED`), y omite ADR-0007 (`ACCEPTED`) de la
  lista de excepciones. Editar `01-projects/` contradice la fila 2 de AC-3 ("se conserva intacta") y editar ADR-0013 borraría el
  "antes/después" que documenta. D-6 excluye `docs/adr/ADR-*.md` y `docs/specs/01-projects/**`.
- **Documento afectado**: story.md
- **Acción requerida**: alinear el Non-Goal de registros históricos con D-6 (todos los `ADR-*.md` y `01-projects/**`).

### CR-003
- **Tipo**: dependencia
- **Descripción**: hoy `docs/specs/01-projects/` tiene 5 archivos y STORY-104…107 están en PLAN. Si STORY-108 se implementa antes, se
  cumple la fila 2 de AC-3 y los planes de esas historias quedan con rutas `02-epics/…` desactualizadas. Implementarlas antes permite la
  fila 1 (eliminar `01-projects/`) y deja intactos sus planes.
- **Documento afectado**: EPIC-21 (orden de implementación)
- **Acción requerida**: implementar STORY-104…107 antes de STORY-108 cuando sea posible; si no, traducir rutas al implementarlas.

### CR-004
- **Tipo**: dependencia
- **Descripción**: los skills que ejecutan el resto del pipeline de esta historia (`story-implement-tasks`, `story-code-review`,
  `story-verify`, `story-acceptance`) corren desde runtimes instalados que buscan `specs/03-stories/`. Tras el commit no encuentran
  STORY-108 hasta reinstalar.
- **Documento afectado**: tasks.md
- **Acción requerida**: incluir la reinstalación de runtimes como último paso de la implementación (D-9.9) y escribir
  `implement-report.md` directamente en `docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/`.
