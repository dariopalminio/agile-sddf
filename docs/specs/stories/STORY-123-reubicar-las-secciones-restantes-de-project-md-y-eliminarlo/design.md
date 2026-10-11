---
alwaysApply: false
type: design
id: STORY-123
slug: STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo-design
title: "Design: Reubicar las secciones restantes de project.md y eliminarlo"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-123
created: 2026-10-09
updated: 2026-10-09
related:
  - STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo
  - eliminar-specs-01-projects
  - vision
  - roadmap
  - tech-stack
  - domain
---

<!-- Referencias -->
[[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]] · [[eliminar-specs-01-projects]] · [[vision]] · [[tech-stack]] · [[domain]]

# Diseño técnico: reubicar las secciones restantes de `project.md` y eliminarlo

## Context

[[eliminar-specs-01-projects]] (ADR-0013) elimina `docs/specs/01-projects/` y asigna destino solo a `project-intent.md`
(STORY-104), a §1.8 y §2.1–2.2 de `project.md` (STORY-105), a `project-plan.md` (STORY-106) y a `story-map.md` y
`context-diagram.puml` (STORY-107). Esta historia trata **lo que queda**: las secciones de `project.md` sin destino
asignado. Después borra `project.md`, el runbook que solo servía para resincronizarlo y la carpeta `01-projects/`.

**Estado medido el 2026-10-09** (`ls`, `grep`, `git log`):

| Elemento | Estado actual | Estado que exige la precondición de AC-1 |
|---|---|---|
| `docs/specs/01-projects/PROJ-01-agile-sddf/` | 5 archivos: `project.md`, `project-intent.md`, `project-plan.md`, `story-map.md`, `context-diagram.puml` | Solo `project.md` (STORY-104…107 implementadas) |
| `project.md` §1.8, §2.1, §2.2 | Texto propio (77 requisitos, 6 perfiles) | Reemplazados por enlaces a `[[stakeholders]]` y `[[requirements-index]]` (STORY-105 AC-3) |
| `project.md` | 1264 líneas; frontmatter `type: project`, `slug: PROJ-01-agile-sddf`, `updated: 2026-08-30` | — |
| `docs/product/vision.md` | Semilla con marcadores; tras STORY-104 contendrá **el texto de `project-intent.md` (2026-04-20)** | — |
| `docs/product/roadmap.md` | No existe; STORY-106 lo crea con `## Épicas` (vigente) y `## Plan original (2026-04-20)` (histórico) | — |
| `docs/architecture/tech-stack.md` | Vigente, último cambio 2026-09-26 (v3.2.1, `config/`, sin `postinstall`) | — |
| `docs/domains/domain.md` | `## Project Overview` con `**Nombre:**` y `## Terminology Glossary` de 15 términos (2026-09-12) | — |
| `docs/runbooks/actualizar-spec-de-proyecto.md` | `slug: runbook-actualizar-spec-de-proyecto`; enlazado solo por `project.md` (×2) y `docs/index.md:361` | — |

**Hallazgo que corrige la nota de la historia.** La historia propone como candidato que "§1.2–1.7 ya están en
`product/vision.md` por STORY-104". **No es así:** STORY-104 traslada `project-intent.md` (2026-04-20), no `project.md`
§1.2–1.7 (reescritura del 2026-08-30). Los textos difieren en todas las secciones. Por ejemplo, `project-intent.md` tiene
3 criterios de éxito sin marcar y `project.md` §1.5 tiene 10, nueve marcados con evidencia. Las restricciones, los
non-goals y el problema también son distintos. Descartar §1.2–1.7 como duplicados perdería contenido y violaría CNF-1
(ver D-3 y CR-001).

**Secciones de `project.md` y su tratamiento** (unidad = encabezado `##` de §1–§12 y cada apéndice; líneas del 2026-10-09):

| Sección de origen | Líneas | Ítems de origen | Tratamiento | Destino |
|---|---|---|---|---|
| Nota de vigencia (cita previa a §1) | 20–23 | 1 cita | Absorbida | Nota de origen fechada de cada destino (D-2) |
| §1.1 Nombre de Proyecto | 27–29 | 1 línea | **Descartada (duplicado)** | `domains/domain.md` › Project Overview › `**Nombre:**` |
| §1.2 Definición del Problema | 31–42 | 2 párrafos | Reubicada (vigente) | `product/vision.md` › Problema que resolvemos |
| §1.3 Visión (elevator pitch) | 44–52 | 7 ítems | Reubicada (vigente) | `product/vision.md` › Propuesta de valor › Visión (elevator pitch) |
| §1.4 Beneficios Clave | 54–71 | 6 ítems | Reubicada (vigente) | `product/vision.md` › Propuesta de valor › Beneficios clave |
| §1.5 Criterios de Éxito | 73–93 | 10 ítems | Reubicada (vigente) | `product/vision.md` › Criterios de éxito |
| §1.6 Restricciones | 95–107 | 3 ítems | Reubicada (vigente) | `product/vision.md` › Alcance y límites › Restricciones |
| §1.7 Fuera de alcance (Non-Goals) | 109–124 | 7 ítems | Reubicada (vigente) | `product/vision.md` › Alcance y límites › Fuera de alcance (Non-Goals) |
| §1.8, §2.1, §2.2 | 125–885 | — | Trasladadas por STORY-105 | `[[stakeholders]]`, `[[requirements-index]]` |
| §2.3 Experiencia de usuario (UX) y Diseño de Interfaz (UI) | 886–909 | 1 párrafo + 9 ítems | Reubicada (vigente) | `architecture/ux-ui.md` (nuevo) |
| §3.1 Design Vibe | 912–921 | 1 párrafo + 2 ejemplos | Reubicada (vigente) | `architecture/ux-ui.md` |
| §3.2 Visual Inspiration | 923–931 | 3 ítems | Reubicada (vigente) | `architecture/ux-ui.md` |
| §3.3 Mapas de Navegación | 933–1037 | 1 párrafo + 1 árbol | Reubicada (vigente) | `architecture/ux-ui.md` |
| §3.4 Wireframe ASCII (Box Drawing) | 1039–1043 | 1 párrafo | Reubicada (vigente) | `architecture/ux-ui.md` |
| §4.1 Stack tecnológico | 1047–1100 | tabla de 15 filas + 4 bloques (patrón, delegación con árbol, agentes, frontera) | Reubicada (histórica) | `architecture/tech-stack.md` › anexo histórico |
| §11 Referencias | 1102–1122 | 15 entradas | **Descartada (duplicado)** | `docs/index.md` (cada destino ya está indexado) |
| §12 Definiciones y Acrónimos | 1124–1168 | 39 términos | Reubicada (histórica) | `domains/domain.md` › Terminology Glossary › glosario detallado |
| Apéndice A — Estado de implementación (A.1–A.3) | 1170–1230 | 1 cita + 19 + 7 + 9 filas + 3 párrafos | Reubicada (histórica) | `product/roadmap.md` › Estado de implementación (2026-08-30) |
| Apéndice B — Brechas y deuda conocida | 1232–1264 | 1 cita + 9 ítems | Reubicada (histórica) | `product/roadmap.md` › Brechas y deuda conocida (2026-08-30) |

Los encabezados agrupadores `# 1.`, `# 2.`, `# 3.` y `# 4.` no tienen texto propio: el informe los registra como "sin contenido
propio". El frontmatter y la línea `<!-- Referencias -->` son metadatos: no se trasladan, y el slug pasa a la página de
redirección (D-6).

**Enlaces entrantes a `[[PROJ-01-agile-sddf]]` tras STORY-104…107:** `docs/index.md:77`, `docs/runbooks/actualizar-spec-de-proyecto.md:16`
(se borra), los 14 `epic.md` (EPIC-00…12 y EPIC-20), `docs/product/story-map.md` (STORY-107 lo traslada sin tocar ese
wikilink) y `docs/adr/ADR-0006-…md:141` ("apéndices A y B"). `project-plan.md:16` desaparece con STORY-106.
Al `[[runbook-actualizar-spec-de-proyecto]]` solo lo enlazan `project.md` (×2) y `docs/index.md:361`; la mención de
`CHANGELOG.md:230` es texto histórico.

**Menciones textuales de la ruta que deja de existir** (fuera de `02-epics/` y `03-stories/`): `AGENTS.md:13` (el paréntesis
"ver `docs/specs/01-projects/PROJ-01-agile-sddf/`"; STORY-104 D-5 solo corrige la primera mitad de la frase),
`docs/domains/domain.md:34` ("Fuentes de inicio") y `skills/project-context-diagram/examples/test-0{2,3}-*.md`.

**Línea base de `memory-system check`** (`node skills/memory-system/scripts/memory-system.js check --root docs`, 2026-10-09):
exit 1, `problemas: 56 (orphan 7 · broken-wikilink 49)`. Ninguno involucra a `PROJ-01-agile-sddf` ni al runbook: 32 son
`[[ADR-0013-eliminar-specs-01-projects]]` (el slug real es `eliminar-specs-01-projects`), incluido el `story.md` de esta
historia. AC-2 pide literalmente "no reporta `broken-wikilink`", lo que hoy es inalcanzable por causas ajenas (CR-002).

**Escaneo de `memory-system`** (`walk` + `isExcludedFile`): se excluyen `design.md`, `tasks.md`, `testcases.md`,
`analyze.md`, `*-report.md` y similares. Por eso `reubicacion-report.md` no se escanea y no necesita frontmatter válido para
`check`. Los wikilinks resuelven por el `slug` del frontmatter, no por el nombre de archivo, y `check` no detecta slugs
duplicados.

**Stack aplicable** (constitución, `package.json`, `tech-stack.md`): solo Markdown versionado. No se cambia código. Las
verificaciones usan scripts existentes (`memory-system.js check` / `index`, `grep`, `ls`).

## Goals / Non-Goals

**Goals:**

- Cada sección restante de `project.md` queda en un documento de `product/`, `architecture/` o `domains/`, o figura en
  `reubicacion-report.md` como descartada por duplicar contenido que ya vive en una capa. // satisface: AC-1
- `docs/specs/01-projects/` deja de existir. // satisface: AC-1
- Un único documento de `docs/product/` declara `slug: PROJ-01-agile-sddf` y su cuerpo es solo la tabla "sección antigua →
  hogar actual", con un enlace por fila. // satisface: AC-2
- `docs/runbooks/actualizar-spec-de-proyecto.md` se borra y ningún wikilink queda roto por los slugs retirados. // satisface: AC-2
- Si alguna sección no tiene hogar, `project.md` se conserva y el informe la lista. Las que sí tienen destino quedan
  reubicadas y registradas. // satisface: AC-3
- Ningún ítem de una sección reubicada se resume ni se omite, y el informe enumera cada sección con su destino o motivo. // satisface: CNF-1

**Non-Goals:**

- Migrar §1.8 y §2.1–2.2 (STORY-105). Renombrar `02-epics/` y `03-stories/` (STORY-108).
- Reescribir `[[PROJ-01-agile-sddf]]` en ADR-0006, en los `epic.md` o en el story map: lo resuelve la redirección.
- Cambiar `memory-system` (tolerar slugs retirados, sección `### L3 — Proyecto` del template del índice) o la inmutabilidad
  de los ADR.
- Actualizar al estado actual los datos desfasados del contenido trasladado (34 skills, `sddf-init`, `postinstall.js`,
  `.agents/` para OpenCode, "Paso 0 de todo skill"): se trasladan literalmente y se registran en CR-003 para "Actualizar
  documentación canónica" (STORY-116).
- Corregir los 56 problemas preexistentes de `memory-system check`.
- Cambiar `skill-preflight` (STORY-108 AC-3) o los ejemplos de `project-context-diagram` (historia de skills de EPIC-21).

## Decisions

### D-1 — Unidad de reubicación y regla de copia literal // satisface: AC-1, CNF-1

- **Unidad:** cada encabezado `##` de §1–§12 de `project.md` y cada apéndice (`# Apéndice A` con A.1–A.3, `# Apéndice B`).
  Es la granularidad con la que AC-1 dice "cada sección restante" y con la que el informe la registra.
- **Copia:** el cuerpo de cada sección se traslada **sin parafrasear, resumir, reordenar ni corregir**. Solo cambian:
  (a) el encabezado, que pierde el prefijo numérico (`## 3.1. Design Vibe` → `## Design Vibe`) o se adapta al título de
  destino definido en D-3…D-5; (b) el nivel de encabezado, para encajar en el destino. Los wikilinks del cuerpo se
  conservan: todos resuelven hoy (`flight-leves-model`, `migracion-retroactiva-de-estados-de-epica`, `state-machine`,
  `best-practices-for-skills`, `branching-strategy-sddf-git-flow`, verificado con `grep "^slug:"`).
- **Descarte:** una sección solo se descarta si **todo** su contenido informativo ya vive en una capa. El informe cita
  el documento y la sección que lo contiene. Hay dos casos: §1.1 y §11.

**Alternativas rechazadas:**

- *Granularidad por párrafo o ítem* (descartar solo los ítems duplicados de una sección): permitiría que una sección
  quedara a medias. CNF-1 lo prohíbe para las secciones reubicadas, y el informe crecería sin aportar decisiones nuevas.
- *Actualizar los datos desfasados al trasladar* (p. ej. "34 skills" → recuento actual): es reescritura. Mezcla
  migración con mantenimiento y CNF-1 no lo permite. Se registra como CR-003.

### D-2 — Regla vigente/histórico y nota de origen // satisface: AC-1, CNF-1

La documentación del destino no debe quedar con dos versiones vigentes contradictorias:

| Situación del destino | Cómo entra lo trasladado |
|---|---|
| No tiene versión equivalente, o la que tiene es **anterior** al 2026-08-30 | Como contenido **vigente** de la sección |
| Tiene una versión equivalente **posterior** al 2026-08-30 | Como sección **histórica** fechada, separada de la vigente |
| El contenido es una foto fechada por naturaleza (recuentos, deuda verificada) | Como sección **histórica** fechada |

Cada bloque trasladado empieza con una nota de cita de una línea:
`> Trasladado desde project.md §<n> (revisión 2026-08-30, PROJ-01, eliminado) por STORY-123 — [[eliminar-specs-01-projects]].`
Las secciones históricas añaden: `Registro histórico: no describe el estado actual.` El nombre `project.md` va como
texto, no como wikilink. Esta nota absorbe la "Nota de vigencia" del origen: fecha de revisión y procedencia.

**Alternativas rechazadas:**

- *Todo como vigente:* `tech-stack.md` diría a la vez v2.0.0 y v3.2.1, y `.agents/` para OpenCode y para Codex. Serían
  dos fuentes de verdad contradictorias en la misma capa, el anti-patrón que ADR-0013 elimina.
- *Todo como histórico:* `vision.md` dejaría como vigente la intención de abril (deadline "mayo 2026", criterios sin
  marcar) aunque existe una versión posterior verificada contra el repositorio.
- *Nota de origen en el frontmatter* (`source:`): ningún consumidor la lee, y el lector humano no la ve en el cuerpo.

### D-3 — `product/vision.md`: §1.2–1.7 como vigente y la intención de abril como histórica // satisface: AC-1, CNF-1

`vision.md` mantiene la estructura que fija STORY-104 D-1. En cada sección se sustituye el texto de `project-intent.md` por
el de `project.md`, con la misma correspondencia de secciones. El texto de `project-intent.md` pasa íntegro a una sección
histórica al final:

```
# Visión del producto
> Consolidada desde project-intent.md … (nota de STORY-104, se conserva)
> Trasladado desde project.md §1.2–1.7 (revisión 2026-08-30 …) por STORY-123 …   ← nota D-2
## Problema que resolvemos            ← project.md §1.2 (2 párrafos)
## Propuesta de valor
### Visión (elevator pitch)           ← §1.3 (7 ítems)
### Beneficios clave                  ← §1.4 (6 ítems)
## Criterios de éxito                 ← §1.5 (10 ítems, casillas [x]/[ ] y evidencias tal cual)
## Alcance y límites
### Restricciones                     ← §1.6 (3 ítems)
### Fuera de alcance (Non-Goals)      ← §1.7 (7 ítems)
## Intención original (2026-04-20)    ← histórico: el contenido que STORY-104 trasladó de project-intent.md
### Definición del Problema · ### Visión (elevator pitch) · ### Beneficios Clave
### Criterios de Éxito · ### Restricciones · ### Fuera de alcance (Non-Goals)
Volver al mapa: [[index]].
```

El frontmatter no cambia, salvo `updated`. Se conservan `type: product` y `slug: vision`.

**Alternativas rechazadas:**

- *Descartar §1.2–1.7 como duplicados* (candidato de la historia): es falso, porque los textos difieren (ver Context), y
  perdería, entre otros, 7 criterios de éxito y la restricción sobre `agile-sddf-extension` (CR-001).
- *Añadir §1.2–1.7 como subsecciones "revisión 2026-08-30" junto a las de abril:* deja dos versiones sin indicar cuál rige.
- *Llevar §1.5 a `objectives.md › Métricas de éxito`:* separa los criterios de la visión que los define. Además, STORY-104
  ya fijó `## Criterios de éxito` en `vision.md`, y STORY-106 deja `Métricas de éxito` con marcador como Non-Goal.

### D-4 — `architecture/ux-ui.md` (nuevo): §2.3 y §3 // satisface: AC-1, CNF-1

Documento nuevo `docs/architecture/ux-ui.md`, vigente porque no existe un equivalente. Frontmatter según la convención de
`architecture/README.md`: `type: architecture`, `id: ARCH-UX-UI`, `slug: ux-ui`, `title: "Experiencia de usuario e
interfaz del framework SDDF"`, `status: active`, `created`/`updated`. Cuerpo:

```
# Experiencia de usuario e interfaz del framework SDDF
> nota de origen D-2 (§2.3 y §3.1–3.4)
## Experiencia de usuario (UX) y Diseño de Interfaz (UI)   ← §2.3 (párrafo + 9 ítems)
## Design Vibe                                             ← §3.1
## Visual Inspiration                                      ← §3.2
## Mapas de Navegación                                     ← §3.3 (párrafo + árbol en bloque ``` literal)
## Wireframe ASCII (Box Drawing)                           ← §3.4
## Referencias
[[sddf-architecture]] · [[state-machine]] · [[tech-stack]]
```

En `docs/architecture/README.md` se añade una fila a la tabla "Índice de documentos" (`[[ux-ui]] — [ux-ui.md](ux-ui.md)`,
`ARCH-UX-UI`, alcance "Interacción conversacional, patrones de UX y mapa de invocación de skills") y una línea
`├── ux-ui.md ← cómo se usa` en el árbol "Cómo se relacionan".

**Alternativas rechazadas:**

- *`product/`:* su README limita la capa al *por qué* y al *para quién*, y deja el comportamiento fuera.
  Los patrones de §2.3 y el mapa de §3.3 describen cómo funciona la interacción, no por qué existe el producto.
- *`requirements/`:* la capa admite FR/NFR con ID. Convertir §2.3 en NFR-025… exigiría inventar IDs y reformular el texto
  como requisitos SHALL, lo que es reescritura. Parte de §2.3 ya existe como NFR-021/NFR-022 (STORY-105).
- *Partir §3 entre `product/` (vibe, inspiración) y `architecture/` (mapa):* dos documentos para 160 líneas sin un
  consumidor que lo necesite (YAGNI). §3.2 y §3.4 remiten al diagrama C4 y al mapa, que viven en `architecture/`.
- *Añadir §3.3 a `sddf-architecture.md`:* mezclaría el mapa del sistema (vigente, compacto) con un árbol de 100 líneas
  fechado en 2026-08-30.

### D-5 — `tech-stack.md`, `domain.md` y `roadmap.md`: anexos históricos // satisface: AC-1, CNF-1

| Origen | Destino | Ubicación y título | Motivo de "histórico" (D-2) |
|---|---|---|---|
| §4.1 | `docs/architecture/tech-stack.md` | Nueva `## Anexo — Stack según project.md (2026-08-30)` **después** de `## 8. Referencias`. Las subpartes son la tabla y los cuatro bloques en negrita (`**Patrón arquitectónico.**`, `**Modelo de delegación.**` con su árbol, `**Agentes.**`, `**Frontera core / extensión.**`), literales | `tech-stack.md` es posterior (2026-09-26) y contradice versión, `files` y runtimes |
| §12 | `docs/domains/domain.md` | Nueva `### Glosario detallado (project.md, 2026-08-30)` al final de `## Terminology Glossary`, con la tabla de 39 términos literal | El glosario compacto de `domain.md` (2026-09-12) es posterior y rige |
| Apéndice A | `docs/product/roadmap.md` | Nueva `## Estado de implementación (2026-08-30)` después de `## Plan original (2026-04-20)`, con `### Épicas (19)`, `### Historias (77 con story.md, en 79 directorios)` y `### Superficie del framework` | Es una foto fechada; `## Épicas` de STORY-106 es la lista vigente |
| Apéndice B | `docs/product/roadmap.md` | Nueva `## Brechas y deuda conocida (2026-08-30)` a continuación, con los 9 ítems numerados | Hallazgos fechados; el roadmap es donde se prioriza qué atacar |

También en `domain.md:34` ("Fuentes de inicio") se sustituye `` `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` ``
por `` `docs/product/`, `docs/requirements/` `` (consecuencia directa del borrado; no cambia nada más de la frase).

**Alternativas rechazadas:**

- *§4.1 en `sddf-architecture.md`:* el bloque central de §4.1 es la tabla de stack. Su hogar por convención es
  `tech-stack.md`, como la historia ya proponía.
- *§12 fusionado término a término con el glosario de `domain.md`:* hay 15 términos que se solapan con definiciones
  distintas. Fusionarlos obliga a elegir o reescribir. Un subapartado literal conserva los 39 sin pérdida.
- *§12 en `docs/knowledge/`:* `domain-knowledge-artifacts` admite glosarios allí, pero AC-1 limita los destinos a
  `product/`, `requirements/`, `architecture/` y `domains/`, y `knowledge/` está vacío.
- *Descartar el Apéndice A porque "lo sustituye `docs/index.md`"* (candidato de la historia): `index.md` lista nodos, no
  `status`, recuentos ni la columna "Capacidad aportada". El descarte perdería datos. ADR-0006 enlaza además esos
  apéndices como evidencia de su decisión.
- *Apéndices en un documento nuevo `product/estado-2026-08-30.md`:* sería un documento más para dos secciones que ya
  encajan en el roadmap, el documento de "qué se planificó y en qué estado está".

### D-6 — Página de redirección `docs/product/proj-01-agile-sddf.md` // satisface: AC-2

Contrato del documento (único en `docs/` con ese slug):

| Parte | Contenido |
|---|---|
| Nombre de archivo | `docs/product/proj-01-agile-sddf.md` (kebab-case según `product/README.md`; facilita `grep` del slug) |
| Frontmatter | `type: product` · `slug: PROJ-01-agile-sddf` · `title: "Redirección: especificación de proyecto PROJ-01 (project.md, retirado)"` · `created` / `updated` |
| Cuerpo | **Solo** una tabla Markdown de dos columnas `Sección antigua` \| `Hogar actual`, sin encabezado `#`, sin párrafos, sin pie |
| Filas | Una por sección de origen de la tabla del Context, en orden: §1.1 … §12, Apéndice A, Apéndice B. §1.8, §2.1 y §2.2 van como filas propias |
| Celda "Hogar actual" | **Exactamente un** wikilink `[[slug]]` seguido de `›` y el título de la sección de destino en texto. P. ej.: `[[vision]] › Criterios de éxito` · `[[ux-ui]] › Mapas de Navegación` · `[[tech-stack]] › Anexo — Stack según project.md (2026-08-30)` · `[[domain]] › Glosario detallado (project.md, 2026-08-30)` · `[[roadmap]] › Brechas y deuda conocida (2026-08-30)` · `[[stakeholders]] › Usuarios y roles` · `[[requirements-index]]` · §1.1 → `[[domain]] › Project Overview` · §11 → `[[index]]` |

Los wikilinks no llevan ancla (`[[vision#…]]`) porque el resolver de `memory-system` compararía `vision#…` con el slug y lo
reportaría como roto. Se crea **en el mismo cambio** que borra `project.md` (D-8). Si existieran a la vez, dos documentos
declararían el slug y `check` no lo detectaría.

**Alternativas rechazadas:**

- *`type: project`:* `SPEC_TYPES` exigiría `id`/`status`, y los skills que buscan proyectos activos (WIP, `project-flow`) la
  tomarían por un work item.
- *Reescribir los 17 enlaces entrantes:* ADR-0006 es inmutable (decisión del PO) y la historia lo excluye.
- *Cuerpo con un párrafo explicativo:* AC-2 exige "solo la tabla". La explicación vive en el `title` y en este diseño.

### D-7 — Retiro del runbook e índice // satisface: AC-2

- Se borra `docs/runbooks/actualizar-spec-de-proyecto.md` (decisión del PO). Su único enlace vivo restante, `docs/index.md:361`,
  desaparece al regenerar. `runbooks/README.md` no lo lista. `CHANGELOG.md:230` es historial y no se toca.
- `docs/index.md` se **regenera** con `node skills/memory-system/scripts/memory-system.js index --root docs`, como pide la nota
  del PO. Así se retiran las entradas de `project.md` y del runbook, y se dan de alta `[[PROJ-01-agile-sddf]]` (en
  `product/`) y `[[ux-ui]]` (en `architecture/`).
- `AGENTS.md:13`: se sustituye solo el paréntesis `` (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`) `` por
  `` (ver `docs/specs/02-epics/` y `docs/specs/03-stories/`) ``. STORY-104 D-5 ya cambió la primera mitad de la frase y
  STORY-108 renombrará estas rutas.

**Alternativas rechazadas:**

- *Editar el índice a mano* (como STORY-104 D-3): tres altas y dos bajas en secciones distintas. La regeneración es el
  mecanismo canónico y la nota del PO la fija. El diff ajeno que arrastre se acepta y se documenta en el informe (Risks).
- *Conservar el runbook adaptado a `product/`:* su procedimiento existe para resincronizar un documento monolítico que deja
  de existir. Cada capa es ahora un documento vivo que se edita en su lugar.

### D-8 — Orden de la operación y gate de "sección sin hogar" // satisface: AC-1, AC-2, AC-3, CNF-1

1. **Precondición (AC-1):** `ls docs/specs/01-projects/PROJ-01-agile-sddf/` devuelve solo `project.md` y `project.md`
   no contiene `**FR-`, `**NFR-` ni `**US-0` como texto propio. Si falla, la historia se **detiene sin escribir** e informa
   qué historia de STORY-104…107 falta.
2. **Línea base:** se guarda la salida de `memory-system check` (total y `broken-wikilink` por destino) en el informe.
3. **Inventario:** se crea `reubicacion-report.md` con una fila por sección según la tabla del Context, recalculando las líneas
   y los ítems sobre el `project.md` vigente en ese momento. Si aparece una sección nueva que no figura en la tabla, se le
   busca destino con D-2…D-5. Si no lo tiene, se marca `SIN HOGAR`.
4. **Traslado:** D-3, D-4 y D-5, sección por sección, cada una con su nota de origen (D-2). Se anota en el informe el recuento
   de ítems en destino.
5. **Gate (AC-3):** si alguna fila es `SIN HOGAR`, en `project.md` se reemplaza el texto de cada sección **ya trasladada**
   por una línea de enlace a su destino (patrón de STORY-105 AC-3), para no dejar contenido duplicado. Las secciones
   `SIN HOGAR` quedan intactas, se omiten los pasos 6–8 y el informe cierra con "Pendiente de decisión del PO: <secciones>".
6. **Cierre (sin `SIN HOGAR`):** en un mismo cambio, (a) borrar `project.md`, `PROJ-01-agile-sddf/` y `01-projects/`;
   (b) crear la redirección (D-6); (c) borrar el runbook (D-7); (d) editar `AGENTS.md:13`, `domain.md:34` y
   `architecture/README.md`.
7. **Índice:** regenerar `docs/index.md` (D-7).
8. **Verificación:** contratos V-1…V-8. El informe registra el resultado final de `check` frente a la línea base.

**Alternativas rechazadas:**

- *Borrar primero y reubicar después:* durante el intervalo, el contenido sin hogar se perdería, lo contrario de lo que pide AC-3.
- *Ante una sección sin hogar, abortar sin reubicar nada:* AC-3 exige que las secciones con destino queden reubicadas y
  registradas.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Informe de reubicación | crear | `docs/specs/03-stories/STORY-123-…/reubicacion-report.md` | AC-1, AC-3, CNF-1 |
| Visión del producto | modificar | `docs/product/vision.md` | AC-1, CNF-1 |
| UX/UI del framework | crear | `docs/architecture/ux-ui.md` | AC-1, CNF-1 |
| Índice de arquitectura | modificar (1 fila + 1 línea de árbol) | `docs/architecture/README.md` | AC-1 |
| Stack tecnológico | modificar (anexo) | `docs/architecture/tech-stack.md` | AC-1, CNF-1 |
| Contexto de dominio | modificar (glosario detallado + línea 34) | `docs/domains/domain.md` | AC-1, CNF-1 |
| Roadmap | modificar (2 secciones históricas) | `docs/product/roadmap.md` | AC-1, CNF-1 |
| Redirección `PROJ-01-agile-sddf` | crear | `docs/product/proj-01-agile-sddf.md` | AC-2 |
| Especificación de proyecto | eliminar | `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` (+ carpetas) | AC-1, AC-3 |
| Runbook de resincronización | eliminar | `docs/runbooks/actualizar-spec-de-proyecto.md` | AC-2 |
| Índice de la memoria | regenerar | `docs/index.md` | AC-2 |
| Instrucciones raíz | modificar (paréntesis de la línea 13) | `AGENTS.md` | AC-1 (consecuencia) |

Ningún componente reutilizable existente sustituye a estos. El precedente reutilizado es el patrón "lista vigente + sección
histórica fechada" de STORY-106 D-1 (P3).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Wikilink → slug | `[[slug]]` resuelve contra el `slug` del frontmatter de cualquier nodo escaneado. Sin anclas | AC-2 |
| Redirección | Ver D-6: `type: product`, `slug: PROJ-01-agile-sddf`, cuerpo = una tabla de 2 columnas con un wikilink por fila | AC-2 |
| Nota de origen | Ver D-2: una línea de cita al inicio de cada bloque trasladado; las históricas añaden "Registro histórico: no describe el estado actual." | CNF-1 |
| `memory-system check` | Comando de solo lectura. La salida lista `[broken-wikilink] <ruta> — [[slug]] no resuelve` | AC-2 |
| `memory-system index` | Regenera `docs/index.md` desde los nodos escaneados | AC-2 |

## Esquema de datos

**`reubicacion-report.md`** (derivado de historia, no escaneado):

```
---
type: report
id: STORY-123
slug: STORY-123-reubicacion-report
title: "Informe de reubicación de project.md"
created / updated
---
# Informe de reubicación de project.md
## Línea base            ← salida de check antes del cambio (total y broken-wikilink por destino)
## Secciones             ← tabla, una fila por sección de origen
## Pendiente de decisión del PO   ← solo en la rama AC-3: lista de secciones SIN HOGAR
## Verificación final    ← resultado de V-1…V-8 y check frente a la línea base; diff ajeno de index.md
```

Columnas de `## Secciones`: `Sección de origen` · `Líneas` · `Ítems origen` · `Decisión`
(`reubicada-vigente` | `reubicada-histórica` | `descartada-duplicado` | `trasladada-STORY-105` | `absorbida` |
`sin-contenido-propio` | `SIN HOGAR`) · `Destino (ruta › sección)` · `Ítems destino` · `Motivo`. `Motivo` es obligatorio
en `descartada-duplicado` y `SIN HOGAR`, y en los descartes cita dónde vive el contenido.

## Flujos clave

### F-1 — Camino principal (AC-1, AC-2, CNF-1)

Precondición OK → línea base → inventario → traslados D-3/D-4/D-5 con recuentos → gate sin `SIN HOGAR` → cierre atómico
(borrado + redirección + runbook + punteros) → regenerar índice → V-1…V-8.

### F-2 — Sección sin hogar (AC-3)

Inventario con ≥ 1 `SIN HOGAR` → se trasladan las demás → en `project.md` se reemplazan las trasladadas por enlaces → no se
borra nada, no se crea la redirección y no se regenera el índice → el informe lista lo pendiente para el PO. Con la tabla
del Context no se espera esta rama: todas las secciones conocidas tienen destino. El gate protege ante secciones nuevas o
cambios de STORY-104…107.

### F-3 — Lectura posterior por un enlace antiguo (P7)

Un lector abre `[[PROJ-01-agile-sddf]]` desde un `epic.md` o desde ADR-0006 → llega a la redirección → la fila "Apéndice A" o
"Apéndice B" lleva a `[[roadmap]]`, donde la sección conserva su título y su fecha. Si un enlace falla porque se renombró
un destino, `memory-system check` lo detecta como `broken-wikilink` en la redirección: un único punto de mantenimiento.

### F-4 — Degradación: herramientas que aún esperan `01-projects/` (P7)

Tras el borrado, `skill-preflight` emite `[WARNING] specs/01-projects/ no encontrado`. Es una advertencia, no un error, y
STORY-108 AC-3 la elimina. Los skills `project-*` que leen `project.md` no lo encuentran en este repositorio. Se acepta
porque PROJ-01 está `COMPLETED` y la historia de skills de EPIC-21 corrige sus rutas.

## Decisiones de complejidad justificada

- **Regla vigente/histórico (D-2):** sería más simple copiar todo como vigente, pero eso crea contradicciones en
  `tech-stack.md` y en `vision.md`. Con tres casos se evita la doble fuente sin reescribir texto.
- **Gate con reemplazo por enlaces (D-8 paso 5):** sería más simple abortar sin más, pero AC-3 exige reubicar y registrar lo
  que tiene destino. Los enlaces evitan que esa rama deje contenido duplicado.
- **Documento nuevo `ux-ui.md`:** es el único documento nuevo de contenido. Ningún documento existente admite §2.3 y §3
  sin mezclar vigente con fechado (ver D-4).
- Ni scripts nuevos ni cambios en `memory-system`. Se verifica con `grep`, `ls` y los comandos existentes.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| V-1 | `docs/specs/01-projects/` no existe | `test ! -e docs/specs/01-projects` | AC-1 |
| V-2 | Cada sección de origen tiene fila en el informe con decisión y destino o motivo. Ninguna fila es `SIN HOGAR` en el camino principal | Revisión de `reubicacion-report.md` contra la tabla del Context | AC-1, CNF-1 |
| V-3 | Ítems origen = ítems destino en cada sección reubicada | Recuento (`grep -c` de ítems `- `, filas `\| ` y párrafos) en origen (`git show HEAD:…/project.md`) y destino. Los números quedan en el informe | CNF-1 |
| V-4 | Exactamente un documento declara `slug: PROJ-01-agile-sddf` y está en `docs/product/` | `grep -rl "^slug: PROJ-01-agile-sddf$" docs` → solo `docs/product/proj-01-agile-sddf.md` | AC-2 |
| V-5 | El cuerpo de la redirección es solo la tabla, con un wikilink por fila | Fuera del frontmatter, toda línea no vacía empieza por `\|`. Cada fila de datos tiene `grep -o "\[\[" \| wc -l` = 1 | AC-2 |
| V-6 | El runbook no existe | `test ! -e docs/runbooks/actualizar-spec-de-proyecto.md` | AC-2 |
| V-7 | Ningún `broken-wikilink` apunta a un slug retirado ni a los documentos tocados, y el total de `broken-wikilink` no supera la línea base | `memory-system check`: 0 líneas `broken-wikilink` con destino `[[PROJ-01-agile-sddf]]` o `[[runbook-actualizar-spec-de-proyecto]]`, ni con ruta `product/vision.md`, `product/roadmap.md`, `product/proj-01-agile-sddf.md`, `architecture/ux-ui.md`, `architecture/tech-stack.md` o `domains/domain.md`; recuento ≤ 49 (ver CR-002) | AC-2 |
| V-8 | Rama AC-3: con una sección `SIN HOGAR` simulada, `project.md` sigue existiendo y el informe la lista | Revisión del procedimiento D-8 paso 5 (escenario de error; no se fuerza en el repo real) | AC-3 |
| V-9 | Archivos creados o modificados en UTF-8 sin BOM, sin `Ã³` ni `ðŸ“–` | `head -c3` ≠ `EF BB BF`; `grep -l "Ã\|ðŸ"` vacío | CNF-1 |

## Risks / Trade-offs

- [La precondición no se cumple hoy: STORY-104…107 están en `READY-FOR-IMPLEMENT/DONE`, no implementadas] → D-8 paso 1
  detiene la historia sin escribir. Las líneas de la tabla del Context se recalculan en el paso 3.
- [STORY-104…107 pueden dejar `vision.md` o `roadmap.md` con una forma distinta de la de sus diseños] → D-3 y D-5 nombran
  secciones, no líneas. Si un encabezado esperado no existe, se crea con el título de su diseño y se anota en el informe.
- [Regenerar `docs/index.md` arrastra un diff ajeno (44 líneas medidas por STORY-104, entre ellas una entrada inválida de
  `STORY-103-…/epic-template.md`)] → se acepta por la decisión del PO. El informe lo documenta y no se corrige aquí.
- [El template del índice conserva `### L3 — Proyecto (specs/01-projects/)` vacío tras regenerar] → es un defecto del
  template, que corresponde a "Actualizar scaffolding de `memory-system`" (STORY-115). Se registra en el informe.
- [El contenido trasladado como vigente (§1.2–1.7, §2.3, §3) contiene datos desfasados] → nota de origen fechada (D-2) y
  CR-003 para STORY-116.
- [`check` no detecta slugs duplicados] → la redirección solo se crea junto con el borrado (D-8 paso 6), y V-4 lo verifica
  con `grep`.
- [Se pierde el procedimiento del runbook] → decisión explícita del PO. El historial de Git y `CHANGELOG.md:230` lo conservan.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en D-1…D-8 o quedan como CR.

## Autoevaluación (P9, P10)

- **Omisiones:** los tres AC y CNF-1 están cubiertos (Goals, D-1…D-8 y V-1…V-9). Se cubren las 19 filas de la tabla del Context (incluida la nota de
  vigencia; §1.8, §2.1 y §2.2 comparten fila) y los encabezados agrupadores.
- **Ambigüedad:** "sección" se define en D-1; "duplicado" en D-1 (todo el contenido en una capa); "vigente/histórico" en D-2.
  El "sin `broken-wikilink`" de AC-2 se concreta en V-7 y en CR-002.
- **Nombres:** se usan "redirección", "informe de reubicación", "sección de origen" y "hogar actual" en todo el documento,
  igual que en la historia.
- **Estructura:** no hay dependencias cíclicas. La redirección depende de los destinos, y los destinos no dependen de ella.
  Cada documento de destino recibe una sola responsabilidad nueva.
  El acoplamiento de los enlaces antiguos se concentra en un único punto (la redirección).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: La nota de la historia supone que §1.2–1.7 de `project.md` "ya están en `product/vision.md` por STORY-104".
  STORY-104 traslada `project-intent.md` (2026-04-20), cuyo texto difiere del de §1.2–1.7 (2026-08-30) en todas las secciones,
  con 3 criterios de éxito frente a 10. La historia también propone que `docs/index.md` sustituye al Apéndice A, pero el índice
  no contiene ni estados ni recuentos.
- **Documento afectado**: story.md (Notas › "Secciones a reubicar")
- **Acción requerida**: ninguna en el diseño, que traslada §1.2–1.7 a `vision.md` como vigente (D-3) y el Apéndice A a
  `roadmap.md` (D-5). Conviene corregir la nota para que no induzca un descarte con pérdida.

### CR-002
- **Tipo**: inviabilidad
- **Descripción**: AC-2 exige que `memory-system check` "no reporte `broken-wikilink`", pero la línea base del 2026-10-09
  ya tiene 49, ajenos a esta historia. 32 son `[[ADR-0013-eliminar-specs-01-projects]]` (el slug real es
  `eliminar-specs-01-projects`), incluido el propio `story.md` de STORY-123. Tomado literalmente, el AC no puede cumplirse
  sin salirse del alcance.
- **Documento afectado**: story.md (AC-2)
- **Acción requerida**: el diseño lo verifica como V-7: cero `broken-wikilink` hacia slugs retirados o documentos tocados, y
  un total ≤ línea base. El PO debe reformular AC-2 en ese sentido o decidir que la corrección de los wikilinks a ADR-0013
  (épica/STORY-117) preceda a esta historia.

### CR-003
- **Tipo**: dependencia
- **Descripción**: El contenido trasladado literalmente contiene datos desfasados respecto del repositorio actual: "34 skills
  · 10 agentes" (§3.3), `sddf-init`, `docs-wiki-builder` y `postinstall.js` en el mapa de navegación, "skill-preflight… Paso 0
  de todo skill" y "`SDDF_ROOT` default `docs/`" en §12, `.agents/` para OpenCode en §4.1, y "tres niveles de vuelo" en §1.3.
  Las menciones textuales a `01-projects` de `skills/project-context-diagram/examples/test-0{2,3}-*.md` también quedan obsoletas.
- **Documento afectado**: design.md (destinos D-3…D-5); documentación de EPIC-21
- **Acción requerida**: actualizar el contenido vigente de `vision.md` y `ux-ui.md` en "Actualizar documentación canónica"
  (STORY-116), y los ejemplos en la historia de skills de EPIC-21. Esta historia no reescribe (CNF-1).
