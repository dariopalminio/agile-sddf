# Revisión de STORY-086 — hallazgos y plan de remediación

## Contexto

La rama `feat/epic-refactoring` ejecutó una migración de cuatro pasos (`2b02009`, `472d4ae`,
`a63be8a`, `0bf07ea`) que renombró el nivel L2 de `release` a `epic`, renumeró los directorios
de specs a `01-projects` / `02-epics` / `03-stories`, cambió el prefijo `FEAT-` por `STORY-`,
introdujo el campo `kind` y realineó el gate `epic-format-validation` con el template canónico.
392 archivos tocados, ADR-0004 y ADR-0005 creados, `package.json` a 2.0.0.

Esta revisión audita el resultado contra los planes, la constitución, la máquina de estados y el
filesystem real. **El núcleo de la migración está bien hecho** (ver "Lo que sí quedó correcto").
Lo que sigue son los defectos que el barrido no cubrió y las inconsistencias que la migración
dejó visibles al alinear el contrato de frontmatter.

La última tarea de `tasks.md` — "Validar implementación, analizar, detectar y documentar
hallazgos" — es lo que este documento cierra.

---

## Hallazgos: 

### F-0 · ALTO — La historia que migró el contrato no cumple el contrato

`docs/specs/03-stories/STORY-086-refactor-release-to-epic/story.md` son 6 líneas sin
frontmatter: sin `id`, `kind`, `slug`, `status`, `substatus`, `created`, `updated`; el título es
el placeholder `[Título de la historia o nombre de historia]`; no hay criterios Gherkin.

Es la **única** de las 77 historias con `story.md` que carece de `kind` e `id` (verificado sobre
las 79 carpetas de `03-stories/`). Incumple la DoD de SPECIFY completa y el `story-template.md`
que esta misma historia modificó. `tasks.md` tampoco tiene frontmatter.

**Fix:** poblar el frontmatter (`type: story`, `id: STORY-086`, `kind: chore`,
`slug: STORY-086-refactor-release-to-epic`, `status: IMPLEMENT`, `substatus: DONE`,
`parent: null`, fechas), el título real y al menos un escenario Gherkin que exprese el criterio
de la migración (la estructura `02-epics/` existe y los skills L2 la resuelven).

---

### F-1 · ALTO — Guion no-rompible (U+2011) en `IN‑PROGRESS`, en todos los templates

Los 5 templates canónicos (`docs/specs/templates/*.md`, línea 8-9), los 5 assets de skill que
`sddf-init` copia, y ~35 `SKILL.md` escriben `IN‑PROGRESS` con **U+2011** en lugar del ASCII
`-` (U+002D). En el corpus real: 18 artefactos con ASCII, 6 con U+2011, y `62 substatus: READY`.

Consecuencia: **todo artefacto generado desde un template nace con U+2011**, y cualquier
comparación o `grep` de `substatus: IN-PROGRESS` (ASCII) — el control WIP=1 de
`project-begin:97,107`, `project-flow:62-74`, `project-discovery:106`, y la regla de CLAUDE.md —
no lo encuentra. El caso más claro de la inconsistencia está dentro de un solo skill:
[docs-wiki-builder/SKILL.md:248](skills/docs-wiki-builder/SKILL.md#L248) normaliza a ASCII y la
línea 249 lo conserva como U+2011.

Es **preexistente** a STORY-086 (ya estaba en `main:docs/specs/templates/release-spec-template.md`)
y ya fue diagnosticado y nunca aplicado en
[EPIC-17/plan-03-clean.md:53-54](docs/specs/02-epics/EPIC-17-remediating-and-improvement/plan-03-clean.md#L53-L54).
Entra aquí porque STORY-086 reescribió precisamente el contrato de frontmatter que lo propaga.

**Fix:** sustituir U+2011 → `-` en los 5 templates centrales, los 5 assets, y los SKILL.md/agentes
que declaran el valor (no en CHANGELOG ni en los 17 archivos históricos CP-1252). Añadir el
chequeo a la verificación.

---

### F-2 · ALTO — `epic-creation` produce substatus fuera de la máquina de estados

[epic-creation/SKILL.md:158](skills/epic-creation/SKILL.md#L158):

```
| `substatus` | "¿Subestado? (IN‑PROGRESS / REVIEW / READY)" | `IN‑PROGRESS` |
```

El conjunto canónico es `TODO | IN-PROGRESS | DONE | BLOCKED`
([state-machine.md:29-32](docs/guides/state-machine.md#L29-L32), ADR-0003, constitución regla 8).
`REVIEW` y `READY` no existen. Esto no es deuda histórica: es un skill vivo que ofrece valores
inválidos al usuario, y explica los 62 `substatus: READY` del corpus.

Añadido: el default `IN‑PROGRESS` al crear una épica activa el ítem sin comprobar WIP=1
(constitución regla 9); `TODO` es el default correcto para un artefacto recién creado.

**Fix:** derivar las opciones de `state-machine.md` o enumerar el conjunto canónico; default `TODO`.

---

### F-3 · ALTO — `epic-generate-stories` y `epic-generate-all-stories` discrepan en el estado inicial

Mismo artefacto, dos contratos:

| Skill | Línea | `status` inicial |
|---|---|---|
| `epic-generate-stories` | [240, 252](skills/epic-generate-stories/SKILL.md#L240) | `SPECIFY` |
| `epic-generate-all-stories` | [218, 230](skills/epic-generate-all-stories/SKILL.md#L218) | `READY-FOR-IMPLEMENT` |

La variante batch nace saltándose SPECIFY y PLAN, es decir los gates que
[state-machine.md:90-93](docs/guides/state-machine.md#L90-L93) y la constitución regla 10
declaran secuenciales: `story-implement` aceptaría esas historias sin `design.md` ni `tasks.md`.
El comentario de ambas líneas es idéntico ("pendiente de refinamiento"), lo que confirma que
`READY-FOR-IMPLEMENT` es un error de copia, no una decisión.

**Fix:** `status: SPECIFY` en `epic-generate-all-stories` (líneas 218 y 230).

---

### F-4 · ALTO — El README publicado en npm sigue documentando la estructura vieja

[README.md:283-296](README.md#L283-L296) muestra el árbol con `projects/`, `releases/`,
`stories/` y `requirement-spec.md`. Es el primer documento que ve quien instala `agile-sddf@2.0.0`
—la versión cuyo *breaking change* es exactamente ese renombre— y contradice ADR-0004,
CLAUDE.md y `sddf-init`. La línea 148 del mismo README ya dice `docs/specs/02-epics/`, así que el
archivo se contradice a sí mismo.

**Fix:** actualizar el árbol a `01-projects/` / `02-epics/` / `03-stories/`, `project.md` en vez
de `requirement-spec.md`, y añadir `kind` a la lista de campos de frontmatter de la línea 307.
De paso, "backlog de features" (línea 178) → "backlog de historias".

---

### F-5 · MEDIO — `type: release` sobrevive en 6 planes de EPIC-16

`docs/specs/02-epics/EPIC-16-enhancement-and-security/plan-0{1..6}-*.md` declaran `type: release`
en su frontmatter; los otros 25 planes del repo usan `type: plan`.
[header-aggregation/SKILL.md:23](skills/header-aggregation/SKILL.md#L23) declara el conjunto
`project | epic | story | wiki` — `release` ya no es un valor válido en ninguna parte.

La verificación del implement-report ("0 `type: release`") solo barrió los `epic.md`.

**Fix:** `type: plan` en los 6 (su `id:` ya es `plan-NN-*`, coherente con los otros 25).

---

### F-6 · MEDIO — `epic-from-project-plan` es el único skill L2 sin evals

De los 5 skills L2, cuatro tienen `evals/evals.json`; `epic-from-project-plan` no. Y es
justamente aquel cuyo **parser cambió en plan-04**: aceptar em-dash y dos puntos como separador,
y mapear el bloque `### Épica Walking Skeleton: MVP` (sin número) al ID `00`
([SKILL.md:66-72](skills/epic-from-project-plan/SKILL.md#L66-L72)).

Ese cambio se verificó a mano contra el `project-plan.md` vivo. La DoD de IMPLEMENT exige evals
para skills críticos, y sin un caso de regresión el soporte de los dos separadores se puede
perder en la próxima edición sin que nada lo note.

**Fix:** crear `skills/epic-from-project-plan/evals/evals.json` con, como mínimo: separador `—`,
separador `:`, bloque Walking Skeleton → `EPIC-00`, sección `## Propuesta de Épicas` ausente
(fail-fast), y directorio de épica ya existente.

---

### F-7 · MEDIO — El template central y el asset de `epic-creation` declaran contratos distintos

Único diff entre los dos (los otros 4 pares asset↔central son idénticos byte a byte):

```
asset:   - [ ] **[Nombre feature 1]:** …
central: - [ ] STORY-[INDEX] - **[Nombre feature 1]:** …
```

Como `sddf-init` copia **asset → central**
([sddf-init/SKILL.md:70](skills/sddf-init/SKILL.md#L70)), un proyecto nuevo obtiene el template
sin `STORY-[INDEX]` mientras este repo tiene el otro. Peor: `STORY-[INDEX]` no es un ID válido y
el Paso 2a de `epic-generate-stories` (Formato A con ID / Formato B sin ID) no contempla el
placeholder literal — una épica escrita copiando el template central cae en un tercer caso no
definido.

El plan-04 revisó este par y decidió no tocarlo ("idéntico salvo el prefijo"), pero la
diferencia es de contrato: `epic-creation` documenta explícitamente la asignación *lazy* de IDs
(SKILL.md:186-189).

**Fix:** alinear el central con el asset (quitar `STORY-[INDEX]`), que es la forma coherente con
el flujo lazy. Alternativa: documentar el placeholder como Formato C en `epic-generate-stories`.

---

### F-8 · MEDIO — `## Backlog de Features` sobrevive al barrido FEAT→STORY

En `docs/specs/templates/project-plan-template.md:24`, su asset gemelo
(`skills/project-planning/assets/`) y el `project-plan.md` vivo (línea 24). La sección lista
ítems `STORY-NNN` bajo un encabezado que dice "Features", y es la que alimenta
`## Propuesta de Épicas`. Verificado que **ningún skill la parsea** por nombre, así que el
cambio es seguro; es puro vocabulario, pero es el último residuo estructural del paso 3.

**Fix:** `## Backlog de Historias` en los tres archivos, coordinado (template central + asset +
artefacto vivo).

---

### F-9 · MEDIO — Rutas obsoletas en documentación normativa

- [docs/adr/README.md:15](docs/adr/README.md#L15) → `docs/specs/stories/STORY-NNN/design.md`;
  el directorio es `03-stories/`. La regla 16 de la constitución (línea 186) sí quedó bien, así
  que las dos fuentes normativas de la misma convención se contradicen.

**Fix:** `docs/specs/03-stories/STORY-NNN/design.md`.

---

### F-10 · MEDIO — Placeholders sin resolver y contrato de `parent` ambiguo

Cinco historias vivas conservan el placeholder del template en su frontmatter:
`parent: <nombre-del-directorio-de-release>` (STORY-053) y `parent: <nombre-del-release-padre>`
(STORY-074, 075, 076, 077). Nunca se poblaron, y el barrido `release → épica` no los tocó porque
están dentro de un placeholder.

Además, el contrato de `parent` no es único:

| Fuente | Forma |
|---|---|
| `story-template.md` | `<nombre-del-directorio-de-la-epica>` |
| [header-aggregation:88](skills/header-aggregation/SKILL.md#L88) | nombre de directorio (`EPIC-01-nombre`) |
| Las 36 historias con `parent` poblado | `EPIC-NN-slug` |
| Ambos generadores L2 | `parent: <EPIC-NN>` (ID desnudo) |

**Fix:** poblar los 5 `parent` con el directorio de su épica; alinear los dos generadores a la
forma `EPIC-NN-slug`.

---

### F-11 · BAJO — `epic-creation` hardcodea las claves de frontmatter que el gate deriva

[epic-creation/SKILL.md:139](skills/epic-creation/SKILL.md#L139) enumera
`type, id, slug, title, status, substatus, created, updated` tres líneas después de decir
"Nunca hardcodear nombres de secciones", mientras `epic-format-validation` Paso 3b las deriva del
bloque `---` del template en runtime. Si el template gana una clave obligatoria, el gate la
exigirá y el productor no la escribirá — el mismo bucle productor↔gate que plan-04 acaba de
cerrar, reabierto por el otro lado.

**Fix:** derivarlas del template menos la allowlist (`alwaysApply`, `parent`, `related`),
citando la tabla de `epic-format-validation` como fuente.

---

### F-12 · BAJO — `status: RELEASED` en 13 de 19 épicas

Valores en el corpus: `RELEASED` (13), `COMPLETED` (4), `DEFINITION` (1), `IMPLEMENT` (1). El
conjunto canónico L2 es `DEFINE | PLAN | READY-FOR-DEV | DEVELOP | VALIDATE | SHIP | COMPLETED`.

ADR-0003 declara explícitamente esta deuda como aceptable ("no se migran retroactivamente"), así
que **no es un defecto de esta historia**. Se anota porque tras ADR-0004 "RELEASED" es
exactamente el vocabulario retirado, y porque el gate no valida *valores* (solo presencia de
claves), de modo que nada lo detectará nunca. Decisión del usuario si se migra a `SHIP`.

---

### F-13 · BAJO — Vocabulario "feature" en los skills L2

~20 ocurrencias en `epic-creation`, `epic-generate-stories`, `epic-generate-all-stories` y
`epic-from-project-plan` que describen lo que ahora son historias ("extraer features de la
épica", "un story.md por cada feature"). No rompe nada — los encabezados parseados ya son
`## Historias`. Cosmético; se puede hacer en la misma pasada que F-8 o dejarlo.

---

### F-14 · MEDIO — `PLANNING` no es un estado canónico (hallazgo aparecido durante la corrección)

Detectado al corregir el ciclo de vida en el README. `state-machine.md:77` define el estado de
historia como **`PLAN`**, y `state-machine.md:106` declara que **a nivel de proyecto el campo
`status` no se usa** (solo `substatus`). Sin embargo `PLANNING` aparece en 13 puntos vivos:

| Archivo | Problema |
|---|---|
| `skills/story-plan/README.md` (3×) | El README dice `PLANNING`; su propio `SKILL.md` dice `PLAN` |
| `skills/story-implement/README.md`, `story-specify/README.md` | Diagramas de pipeline con `PLANNING` |
| `skills/story-analyze/SKILL.md:62` | Tabla de transición con `PLANNING` |
| `skills/project-planning/assets/project-plan-template.md:7` | `status: PLANNING` a nivel proyecto, donde `status` no aplica |
| `agents/project-architect.agent.md:210` | Escribe `status: PLANNING` |
| `header-aggregation`, `skill-structural-pattern`, `constitution.md:145` | Enumeran `PLANNING` como valor admitido |

Un skill cuyo README contradice a su propio SKILL.md sobre el estado que escribe es el mismo
tipo de desincronización que F-3. **Fuera del alcance aprobado (F-0 a F-11)**; se corrigió solo
la línea del `README.md` publicado, por ser parte de F-4. Queda a decisión del usuario.

---

## Lo que sí quedó correcto (verificado)

- **0** referencias a los 5 nombres de skill viejos en `skills/`, `agents/`, `scripts/`,
  `package.json`, `sddf.config.yaml`. **0** ocurrencias de `FEAT-` fuera de CHANGELOG y ADR-0005.
- 19 `epic.md`, 79 directorios `STORY-*` sin números duplicados, 77 con `story.md`,
  76 con `kind` (75 `feat` + 1 `fix`), `id` coherente con el nombre de directorio en todos.
- `docs/index.md`: **0 links markdown rotos**. Los 24 wikilinks huérfanos ya existían en `main`
  (convención de slug sin prefijo `ADR-NNNN`/`EPIC-NN`) — preexistentes, no regresión.
- Los 21 `evals.json` parsean. Nota: el implement-report dice "34" en los planes 01-03 y se
  autocorrige a 21 en el plan-04; **21 es el número real** (13 skills no tienen evals).
- `package.json.files` lista directorios (`skills/`, `agents/`), no rutas por skill — los
  renombres no lo rompen y el criterio de DoD "agregar la ruta del nuevo skill a `files`" no
  aplica en este caso.
- El árbol de `CLAUDE.md` es veraz: las 13 rutas existen. Constitución reglas 7, 13 y 16, ok.
- `epic-format-validation` deriva ahora ambas mitades del contrato en runtime y su eval TC-005
  cubre la regresión. Los 5 `name:` de frontmatter coinciden con su directorio.
- WIP=1 a nivel épica se respeta: solo EPIC-13 en `IN-PROGRESS`.

## Deuda declarada y confirmada como pendiente (fuera de alcance salvo indicación)

Coincide con lo que el propio implement-report señala; verificada, no ampliada:
`story-map.md` (82 referencias a "release" y "Release Slices"), 17 archivos históricos en
CP-1252, 17 épicas sin "Flujos Críticos / Smoke Tests", 10 épicas sin `created`/`updated`,
EPIC-00 sin ninguna sección `##`.

---

## Alcance confirmado

**Se corrigen F-0 a F-11** (defectos activos). **F-1 se corrige en esta rama**, no en una historia
aparte: aunque es preexistente, STORY-086 reescribió el contrato de frontmatter que lo propaga y
todo artefacto generado desde template nace roto.

**No se tocan:** F-12 (`RELEASED` → `SHIP` en 13 épicas; ADR-0003 acepta explícitamente esa deuda)
ni la deuda declarada del implement-report (story-map.md, CP-1252, "Flujos Críticos" faltantes).
Ambos quedan documentados como hallazgos, no aplicados. F-13 (vocabulario "feature" en prosa) es
cosmético: se arrastra solo donde caiga en la misma línea que F-8, sin barrido propio.

## Plan de corrección

Orden por dependencia; cada bloque es independiente y commiteable por separado.

1. **F-1** — barrido U+2011 → ASCII en los 5 templates centrales, los 5 assets y los SKILL.md /
   agentes que declaran el valor. Es el que más archivos toca y el que más silenciosamente rompe;
   va primero para que el resto se escriba ya con ASCII. Excluir `CHANGELOG.md` y los 17 archivos
   históricos en CP-1252.
2. **F-2, F-3, F-11** — contrato de estados en los skills productores L2
   (`epic-creation`, `epic-generate-all-stories`).
3. **F-5, F-9, F-10** — corrección de datos: 6 frontmatter `type: plan`, ruta de `adr/README.md`,
   5 `parent` sin resolver + forma `EPIC-NN-slug` en los generadores.
4. **F-7, F-8** — alineación de templates (central ↔ asset de `epic-creation`) y
   `## Backlog de Features` → `## Backlog de Historias` en los tres archivos coordinados.
5. **F-4** — README publicado en npm.
6. **F-0** — completar `story.md` y `tasks.md` de STORY-086, y registrar este informe como
   artefacto de la historia (`analyze.md`), que es lo que cierra la última tarea pendiente
   de `tasks.md`.
7. **F-6** — `evals.json` de `epic-from-project-plan` (TDD: escribir los casos antes de tocar el
   SKILL.md, según constitución regla 11).
8. **CHANGELOG** — entrada bajo `[Unreleased]` describiendo las correcciones de contrato
   (F-1 a F-3 son observables para quien ya instaló 2.0.0).

## Verificación

Sin build ni test runner (`package.json` solo declara `postinstall`): verificación textual y por
ejecución de la lógica de los skills.

1. `grep -rn $'‑' skills/ agents/ docs/specs/templates/` → 0 resultados (F-1).
2. `grep -rh "^substatus:" docs/specs/` → solo `TODO | IN-PROGRESS | DONE | BLOCKED` en artefactos
   nuevos; los `READY` históricos siguen (no se migran) pero ningún skill los ofrece ya (F-2).
3. `grep -rh "^type:" docs/specs/02-epics/*/plan-*.md` → 31 × `type: plan`, 0 × `release` (F-5).
4. `diff skills/epic-creation/assets/epic-template.md docs/specs/templates/epic-template.md`
   → sin diferencias (F-7).
5. **Gate sobre el corpus real** — ejecutar `epic-format-validation` sobre los 19 `epic.md`:
   debe seguir dando **2 APROBADO / 17 REFINAR** (baseline), sin nuevos motivos de REFINAR.
6. **Contrato productor→gate** — generar una épica con `/epic-from-project-plan` desde
   `PROJ-01-agile-sddf/project-plan.md` y pasarla por el gate: **APROBADO** sin retoques.
   Repetir con `/epic-creation` para cubrir F-2 y F-11.
7. **F-3** — generar una historia con `/epic-generate-all-stories` y otra con
   `/epic-generate-stories` desde la misma épica: ambos `story.md` deben nacer con
   `status: SPECIFY` y `parent: EPIC-NN-slug`.
8. Los `evals.json` (22 tras F-6) parsean; los casos nuevos de `epic-from-project-plan` cubren
   ambos separadores y el bloque Walking Skeleton.
9. `docs/index.md` sin links markdown rotos; árbol de `README.md` y `CLAUDE.md` verificado contra
   `find docs -maxdepth 2 -type d`.
10. Archivos tocados en UTF-8 sin BOM (los 17 CP-1252 históricos quedan fuera).
11. `npm pack --dry-run` sin entradas inesperadas; instalación en sandbox → 34 skills + 10
    agentes, con los templates ya en ASCII.

---

## Resultado de la ejecución

Aplicado el alcance aprobado (F-0 a F-11). 66 archivos tocados, todos en UTF-8 sin BOM.

| Hallazgo | Estado | Evidencia |
|---|---|---|
| F-0 | Corregido | `story.md` con frontmatter canónico (`kind: chore`), título real y 4 escenarios Gherkin; `tasks.md` actualizado |
| F-1 | Corregido | 156 reemplazos U+2011 → ASCII en 48 archivos; 0 ocurrencias en `skills/`, `agents/`, `docs/specs/templates/` |
| F-2 | Corregido | `epic-creation` ofrece el conjunto canónico y usa `TODO` por defecto |
| F-3 | Corregido | Ambos generadores declaran `status: SPECIFY` |
| F-4 | Corregido | Árbol de `README.md` a `01-projects`/`02-epics`/`03-stories`, `kind` documentado, ciclo de vida con `PLAN` |
| F-5 | Corregido | 31 × `type: plan`, 0 × `type: release` en los planes de épica |
| F-6 | Corregido | `skills/epic-from-project-plan/evals/evals.json` con 7 casos; 22 evals en el repo, todos parsean |
| F-7 | Corregido | `diff` entre seed y central de `epic-template.md` sin diferencias |
| F-8 | Corregido | `## Backlog de Historias` en los 3 archivos coordinados |
| F-9 | Corregido | `docs/adr/README.md` apunta a `03-stories/STORY-NNN-<slug>/design.md` |
| F-10 | Corregido | 0 `parent` con placeholder; generadores alineados a `EPIC-NN-<slug>` |
| F-11 | Corregido | `epic-creation` deriva las claves del template menos la allowlist |
| F-12, F-13, F-14 | Documentados, no aplicados | Fuera del alcance aprobado |

### Verificación ejecutada

1. **U+2011** — 0 archivos en `skills/`, `agents/`, `docs/specs/templates/`. Quedan 4 guiones
   tipográficos en prosa (`release‑based`, `Spec‑Driven`) en `docs/guides/`, que no son valores
   de frontmatter, y uno en el cuerpo histórico de `STORY-043`.
2. **Gate sobre el corpus real** — **2 APROBADO / 17 REFINAR**, idéntico a la baseline. Ningún
   REFINAR menciona `Features`, `Versión`, `Título`, `Estado` ni `Fecha`: los 17 fallan por
   "Flujos Críticos / Smoke Tests" y 10 además por `created`/`updated`, carencias de contenido
   preexistentes en épicas históricas.
3. **Contrato productor→gate** — generada una épica desde `PROJ-01-agile-sddf/project-plan.md`
   (los 9 bloques `### Épica` parsean) y validada con el contrato derivado del template:
   **APROBADO** sin retoques. Verificado además que las tres formas de encabezado parsean:
   `01 — Nombre`, `1: Nombre` y `Walking Skeleton: MVP` → `EPIC-00`.
4. **WIP = 1** respetado en los tres niveles: `STORY-086` (story), `EPIC-13` (épica),
   `project-plan.md` (proyecto).
5. **`docs/index.md`** — 0 links markdown rotos. Las 11 rutas del árbol de `CLAUDE.md` existen.
6. **`npm pack --dry-run`** — 181 archivos, 308.3 kB; 14 entradas `skills/epic-*` (una más por
   los evals nuevos), 0 entradas `skills/release`.
7. **Barrido de nombres retirados** — 0 referencias a los 5 skills `release-*` y 0 `FEAT-` en
   `skills/` y `agents/`. Los 3 `## Features` restantes son falsos positivos conocidos
   (README de producto de `readme-builder`, dominio del agente de reverse-engineering, y la
   aserción `not_contains` de los evals nuevos).

### Deuda que sigue abierta

`story-map.md` (82 referencias a "release"), 17 archivos históricos en CP-1252, 17 épicas sin
"Flujos Críticos / Smoke Tests", 10 sin `created`/`updated`, 62 `substatus: READY` y 13
`status: RELEASED` históricos (F-12), el vocabulario "feature" en prosa de los skills L2 (F-13)
y los 13 `PLANNING` no canónicos (F-14).
