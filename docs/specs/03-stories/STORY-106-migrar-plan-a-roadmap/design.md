---
type: design
id: STORY-106
slug: STORY-106-migrar-plan-a-roadmap-design
title: "Design: Migrar project-plan.md a product/roadmap.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-106
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-106-migrar-plan-a-roadmap
  - eliminar-specs-01-projects
  - objectives
---

<!-- Referencias -->
[[STORY-106-migrar-plan-a-roadmap]] · [[eliminar-specs-01-projects]] · [[objectives]]

# Diseño técnico: migrar `project-plan.md` a `product/roadmap.md`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) decide que `project-plan.md` (epic slicing) pasa a
`docs/product/roadmap.md`, un archivo nuevo de la capa `product/`, y que "el roadmap lista los Epics planificados".
La historia pide además que el roadmap refleje las épicas **reales**, porque el plan está desfasado.

| Documento | Estado actual (2026-10-07) |
|---|---|
| `docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md` | 284 líneas. Frontmatter `type: project`, `slug: project-plan`, `date: 2026-04-20`. Secciones: `## Objetivo` (1 párrafo), `## Backlog de Historias` (56 ítems `- [ ] **…**`: 47 con `STORY-NNN` y 9 sin ID), `## Propuesta de Épicas` (9 bloques `### Épica 00…08`), `## Resumen` (tabla de 11 métricas, "Total Features: 29"). |
| `docs/product/roadmap.md` | No existe. |
| `docs/product/objectives.md` | Semilla del scaffold: `## Objetivos de negocio`, `## Métricas de éxito`, `## Prioridades`, las tres con marcador `[Por completar: …]`. Frontmatter `type: product`, `slug: objectives`. |
| `docs/product/README.md` | Fija `vision.md`, `stakeholders.md`, `objectives.md` y admite "cualquier otro documento de contexto en kebab-case". `roadmap.md` entra sin cambiar el README. |
| `docs/specs/02-epics/` | 22 directorios `EPIC-00…EPIC-21`, cada uno con `epic.md`. |

**Slugs de épica.** `memory-system.js` resuelve un wikilink por el `slug` **declarado** en el frontmatter
(`deriveSlug`, línea 354). 17 épicas declaran `slug: EPIC-NN-<nombre>`, pero cinco no llevan prefijo:

| Épica | `slug` declarado |
|---|---|
| EPIC-13 | `quality-gates-con-dod-en-story-workflow` |
| EPIC-14 | `fabrica-de-skills` |
| EPIC-15 | `e2e-capability` |
| EPIC-17 | `remediating-and-improvement` |
| EPIC-18 | `workflow-hardening` |

`docs/index.md` ya las enlaza por ese slug real (p. ej. línea 95, `[[quality-gates-con-dod-en-story-workflow]]`).
Un wikilink `[[EPIC-13-quality-gates-con-dod-en-story-workflow]]` no resolvería (ver D-2 y CR-001).

Referencias vivas al nodo que desaparece (`grep -rn "\[\[project-plan\]\]" docs`, excluido `03-stories/`):

| Archivo | Línea | Forma |
|---|---|---|
| `docs/index.md` | 76 | Entrada del índice bajo `### L3 — Proyecto (specs/01-projects/)` |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 13 | Slug `project-plan` en `related:` (no es wikilink) |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 18 | Wikilink en la línea `<!-- Referencias -->`, compartida con `[[PROJ-01-agile-sddf-project-intent]]` (STORY-104) |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 1106 | Wikilink en `## 11. Referencias` |

Las demás menciones a `project-plan.md` en `docs/` (`adr/`, `architecture/`, `domains/`, `guides/`, `project.md` en prosa)
y en `README.md` son texto plano que describe el pipeline genérico o el historial; no son wikilinks.

**Línea base de `memory-system check`** (`node skills/memory-system/scripts/memory-system.js check --root docs`, 2026-10-07):
exit 1, `problemas: 55 (orphan 6 · broken-wikilink 49)`. Ninguno involucra `project-plan`, `roadmap`, `objectives`,
`index.md` ni `project.md`; la mayoría son `[[ADR-0013-eliminar-specs-01-projects]]` (el slug real del ADR es
`eliminar-specs-01-projects`). `node scripts/check-doc-links.js` → `[OK]` (46 archivos activos).

**Historias hermanas que tocan los mismos archivos:** STORY-104 (línea 75 de `index.md` y línea 18 de `project.md`) y
STORY-105 (regenera `index.md` con `memory-system index` y reescribe secciones de `project.md` sin borrarlo). Ninguna está
implementada aún; el orden entre las tres no está fijado.

**Consumidor futuro:** STORY-111 hará que `project-planning` escriba en `roadmap.md` y "agregue una propuesta nueva sin tocar la
lista de épicas reales ni el plan original". Las dos secciones `##` de este diseño son el contrato que esa historia respetará.

Stack aplicable (constitución + `package.json`): solo Markdown versionado. No hay código que cambiar; las verificaciones usan
scripts existentes (`memory-system.js check`, `scripts/check-doc-links.js`, `grep`, `git show`) y un comparador efímero en `.tmp/`.

## Goals / Non-Goals

**Goals:**

- `docs/product/roadmap.md` lista las 22 épicas reales ordenadas por ID, con wikilink resoluble, título y `status`/`substatus`
  tomados de su frontmatter; el frontmatter del roadmap declara `type: product` y `slug: roadmap`. // satisface: AC-1
- El roadmap conserva íntegro el plan del 2026-04-20 (backlog, 9 épicas propuestas con objetivo, historias, ítems de soporte y
  criterios de éxito, y tabla de resumen) en una sección histórica separada de la lista de épicas reales. // satisface: AC-2, CNF-1
- El objetivo del plan pasa literal a `objectives.md › Objetivos de negocio`; `project-plan.md` se elimina y ninguna referencia
  `[[project-plan]]` queda en `docs/` fuera de `03-stories/`; las que existían apuntan a `[[roadmap]]`, sin wikilinks rotos
  nuevos. // satisface: AC-3, CNF-1
- `roadmap.md` declara su origen y la decisión ADR-0013, enlaza a `[[objectives]]`; todos los archivos tocados quedan en
  UTF-8 sin BOM. // satisface: CNF-2, CNF-3

**Non-Goals:**

- Sincronizar automáticamente el roadmap con los cambios de `status` de las épicas (es una foto a la fecha de migración).
- Hacer que `memory-system scaffold`, `project-planning`, `project-architect`, `epic-creation` o `epic-from-project-plan`
  creen, lean o escriban `roadmap.md` (historias de skills y de scaffold de EPIC-21, entre ellas STORY-111 y STORY-115).
- Completar `Métricas de éxito` y `Prioridades` de `objectives.md` (sin contenido de origen).
- Migrar `story-map.md` (aunque `project-plan.md` lo cite en `related:`), `project.md` o `context-diagram.puml`, o borrar
  `01-projects/`.
- Reescribir menciones en prosa a `project-plan.md` en `adr/`, `architecture/`, `domains/`, `guides/`, `README.md`,
  `CHANGELOG.md` o en la prosa de `project.md` (líneas 75–77, 259, 392, 954–974, 1245, 1252).
- Corregir los defectos de redacción del plan original (p. ej. negrita sin cerrar en STORY-030, `_(deps: …)` sin cerrar en
  STORY-034, STORY-037 que depende de sí misma): se conservan tal cual por CNF-1.
- Corregir los 55 problemas preexistentes de `check` ni regenerar `docs/index.md` completo.
- Normalizar los slugs de EPIC-13/14/15/17/18.

## Decisions

### D-1 — Estructura de `roadmap.md`: dos secciones `##` disjuntas // satisface: AC-1, AC-2, CNF-2

```
# Roadmap del producto
> nota de origen y de vigencia (D-4)
## Épicas                         ← AC-1: lista viva de las 22 épicas reales
## Plan original (2026-04-20)     ← AC-2: histórico, contenido literal de project-plan.md
### Backlog de historias
### Propuesta de épicas
#### Épica 00 — … (× 9)
### Resumen
Volver al mapa: [[index]].
```

- `## Épicas` va primero porque es lo que el mantenedor consulta para priorizar (propósito de la historia).
- `## Plan original (2026-04-20)` lleva como primera línea un aviso de cita:
  `> Histórico. Plan de épicas aprobado el 2026-04-20; no refleja el estado actual. Las épicas vigentes están en [Épicas](#épicas).`
  Ese aviso y el título con fecha son lo que "identifica la sección como histórica" (AC-2).
- Ninguna línea de una sección aparece en la otra: la lista real no menciona las "Épica NN" propuestas y el histórico no contiene
  wikilinks a épicas reales (contrato #6).

**Alternativas rechazadas:**

- *Dos archivos (`roadmap.md` + `roadmap-plan-original.md`):* AC-2 exige que el plan esté **en** `roadmap.md`; además duplicaría
  nodos en `product/` sin necesidad.
- *Tabla única que fusione épicas reales y propuestas (columna "épica del plan"):* el plan no coincide en nombre ni número a partir
  de la 07 (dato de la historia); cualquier fusión inventaría una correspondencia que no existe y mezclaría ambas listas, lo que
  AC-2 prohíbe.
- *Histórico primero, épicas reales después (orden cronológico):* obliga a desplazarse por ~250 líneas antes de llegar a lo vigente.

### D-2 — Formato de la lista de épicas reales // satisface: AC-1

Tabla de cinco columnas, una fila por `docs/specs/02-epics/EPIC-*/epic.md`, ordenada por el `id` del frontmatter (`EPIC-00`…`EPIC-21`):

| Columna | Origen | Regla |
|---|---|---|
| `ID` | `id` | Literal (`EPIC-NN`). |
| `Épica` | `slug` | `[[<slug declarado>]]`, exactamente el valor del frontmatter, para que resuelva en `memory-system`. |
| `Título` | `title` | Literal, sin comillas; un `|` en el título se escaparía como `\|` (hoy no hay ninguno). |
| `Status` | `status` | Literal. |
| `Substatus` | `substatus` | Literal. |

La tabla se precede de la línea `Foto del <YYYY-MM-DD de implementación>: 22 épicas. Valores copiados del frontmatter de cada epic.md.`

Los valores se leen **en el momento de la implementación**, no de este diseño: si una épica cambió de estado (p. ej. EPIC-21), vale
el frontmatter vigente. El contrato #3 los compara contra los `epic.md` del mismo commit.

**Alternativas rechazadas:**

- *Wikilink `[[EPIC-NN-<nombre de directorio>]]` para las 22:* coincide con la letra de AC-1, pero produce 5 `broken-wikilink`
  nuevos (EPIC-13/14/15/17/18) y viola el `Entonces` final de AC-3. Ver CR-001.
- *Lista con viñetas (`- [[slug]] — título — status/substatus`):* más difícil de escanear por estado y de comparar columna a columna.
- *Generar la tabla con un script versionado:* la sincronización automática es Non-Goal; un script permanente sería YAGNI. El
  comparador del contrato #3 vive en `.tmp/` y no se versiona.

### D-3 — Traslado literal del plan original // satisface: AC-2, CNF-1

| Origen (`project-plan.md`) | Destino (`roadmap.md`) | Transformación |
|---|---|---|
| `## Objetivo` | — (va a `objectives.md`, D-5) | — |
| `## Backlog de Historias` | `### Backlog de historias` | Los 56 ítems, literales y en el mismo orden. |
| `## Propuesta de Épicas` | `### Propuesta de épicas` | — |
| `### Épica NN — …` (× 9) | `#### Épica NN — …` | Encabezado +1 nivel; cuerpo literal: líneas `**Estado:** …`, `**Objetivo:** …`, historias `- [ ] STORY-…`, `**Ítems de soporte (sin historia propia):**`, `**Mejoras sobre features existentes:**`, `**Criterios de éxito:**` con sus ítems. |
| `## Resumen` | `### Resumen` | Tabla literal (11 filas). |
| Separadores `---` entre bloques | — | Se omiten: la jerarquía de encabezados los reemplaza; no son contenido. |
| Frontmatter, `<!-- Referencias -->`, `[[PROJ-01-agile-sddf]]` | — | No se copian (metadatos del nodo eliminado; D-4 declara el origen). |

Regla de copia: **sin parafrasear, resumir, reordenar ni corregir** — las casillas `- [ ]`, las marcas `(Planificado)`, los defectos
de formato y las cifras ("Total Features: 29") se conservan. La única transformación permitida es anteponer un `#` a cada encabezado.

**Alternativas rechazadas:**

- *Resumir el plan en una tabla "épica propuesta → historias":* pierde objetivos, ítems de soporte y criterios de éxito; viola CNF-1.
- *Convertir las casillas `- [ ]` en viñetas simples para que no parezcan tareas pendientes:* cambia el contenido; el aviso de
  histórico ya evita la lectura como pendiente.
- *Mantener los encabezados en su nivel original (`##`/`###`):* `## Backlog de Historias` quedaría al mismo nivel que `## Épicas` y
  rompería la separación de AC-2.

### D-4 — Frontmatter y nota de origen de `roadmap.md` // satisface: AC-1, CNF-2

Frontmatter (misma convención que las semillas de `product/`):

| Clave | Valor |
|---|---|
| `type` | `product` |
| `slug` | `roadmap` |
| `title` | `"Roadmap del producto"` |
| `status` | `IN-PROGRESS` |
| `substatus` | `TODO` |
| `parent` | `null` |
| `created` | fecha de implementación |
| `updated` | fecha de implementación |

Debajo de `# Roadmap del producto` va un bloque de cita de dos líneas:

1. `> Origen: plan de épicas de \`project-plan.md\` (PROJ-01, eliminado), migrado por [[eliminar-specs-01-projects]]. El objetivo de negocio vive en [[objectives]].`
2. `> La lista de épicas es una foto a la fecha de migración; no se sincroniza sola con el estado de cada épica.`

- El wikilink al ADR usa el slug real `eliminar-specs-01-projects`, no `[[ADR-0013-eliminar-specs-01-projects]]` (forma de la
  historia, que hoy no resuelve).
- `project-plan.md` se nombra como código, no como wikilink, porque su slug deja de existir.
- El archivo termina con `Volver al mapa: [[index]].`, como los demás documentos de `product/`.

**Alternativas rechazadas:**

- *Declarar el origen con claves `source:` o `related:` en el frontmatter:* CNF-2 pide que el documento lo **declare** a un lector;
  ninguna herramienta consume esas claves en `product/`.
- *`substatus: DONE`:* la capa `product/` no tiene transiciones gobernadas; cambiar la convención de las semillas no lo pide la historia.

### D-5 — `objectives.md`: reubicar el objetivo // satisface: AC-3, CNF-1

- En `## Objetivos de negocio` se reemplaza la línea `[Por completar: resultados medibles que el producto debe conseguir]` por el
  párrafo literal de `## Objetivo` de `project-plan.md` ("Automatizar el ciclo completo de especificación de proyectos software — …
  compatibilidad con múltiples runtimes de IA."), seguido de la línea
  `Origen: \`project-plan.md\` (eliminado); su plan de épicas está en [[roadmap]].`
- `## Métricas de éxito` y `## Prioridades` conservan su marcador (Non-Goal).
- Del frontmatter solo cambia `updated`.

**Alternativas rechazadas:**

- *Dejar el objetivo también en `roadmap.md`:* duplicaría la fuente de verdad; el roadmap lo enlaza vía `[[objectives]]`.
- *Reformular el objetivo como resultado medible (lo que pide el marcador):* reescribe contenido; viola CNF-1.

### D-6 — `docs/index.md`: retirar `[[project-plan]]` y dar de alta `[[roadmap]]` a mano // satisface: AC-3

- Se elimina la línea `- [[project-plan]] — [project-plan.md](specs/01-projects/PROJ-01-agile-sddf/project-plan.md) — Project Plan`
  (hoy línea 76, bajo `### L3 — Proyecto`).
- En `### Producto (product/)` se inserta `- [[roadmap]] — [roadmap.md](product/roadmap.md) — Roadmap del producto` entre la entrada
  `[[objectives]]` y la entrada `[[stakeholders]]` (orden alfabético que ya siguen las entradas de esa sección tras el README).
- Ambas ediciones se localizan **por contenido**, no por número de línea, para ser independientes del orden con STORY-104/105.
- Si STORY-105 ya regeneró el índice después de crear `roadmap.md`, la entrada `[[roadmap]]` puede existir: no se duplica.
- No se toca ninguna otra línea (ni `updated` ni la tabla `Estado del grafo`).

**Alternativas rechazadas:**

- *Regenerar con `memory-system index`:* arrastra decenas de líneas ajenas (ya documentado en el diseño de STORY-104) y dejaría la
  revisión de esta historia mezclada con otras.
- *Reescribir la línea 76 como `[[roadmap]]` bajo `L3 — Proyecto`:* mentiría sobre su ubicación (`product/`, no `specs/01-projects/`).

### D-7 — `project.md`: redirigir las tres referencias // satisface: AC-3

En `docs/specs/01-projects/PROJ-01-agile-sddf/project.md`, sustitución **de subcadena** (no de línea completa), porque la línea 18
también la edita STORY-104:

| Ubicación | Subcadena antes | Subcadena después |
|---|---|---|
| `related:` (línea 13) | `  - project-plan` | `  - roadmap` |
| `<!-- Referencias -->` (línea 18) | `[[project-plan]]` | `[[roadmap]]` |
| `## 11. Referencias` (línea 1106) | `[[project-plan]] — plan de épicas y backlog` | `[[roadmap]] — roadmap de épicas y plan original (antes project-plan.md)` |

El resto de `project.md`, incluidas las menciones en prosa a `project-plan.md`, no cambia.

**Alternativas rechazadas:**

- *Cambiar solo los dos wikilinks:* `related:` quedaría apuntando a un slug inexistente.
- *Eliminar las referencias:* AC-3 exige que "esas referencias apunten a `[[roadmap]]`".

### D-8 — Orden de la operación y criterio de "sin wikilinks rotos" // satisface: AC-3

Orden obligatorio: (1) crear `roadmap.md` → (2) completar `objectives.md` → (3) redirigir `index.md` y `project.md` →
(4) `git rm` de `project-plan.md` → (5) verificar. Borrar al final garantiza que no exista un estado intermedio con wikilinks
colgantes ni contenido que solo viva en una copia sin versionar.

"`memory-system check` no reporta wikilinks rotos" se verifica como **delta** respecto de la línea base (ver CR-002):

- ninguna línea `[broken-wikilink]` ni `[orphan]` menciona `project-plan`, `roadmap`, `product/objectives.md`, `index.md` ni
  `01-projects/PROJ-01-agile-sddf/project.md`;
- `problemas` y `broken-wikilink` no superan los valores de `check-before.txt` (hoy 55 y 49).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Roadmap del producto | crear | `docs/product/roadmap.md` | AC-1, AC-2, CNF-1, CNF-2, CNF-3 |
| Objetivos del producto | modificar (1 sección) | `docs/product/objectives.md` | AC-3, CNF-1, CNF-3 |
| Índice de documentación | modificar (−1 / +1 línea) | `docs/index.md` | AC-3 |
| Especificación de requisitos PROJ-01 | modificar (3 subcadenas) | `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | AC-3 |
| Plan del proyecto PROJ-01 | eliminar | `docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md` | AC-3 |

No se crean componentes ejecutables versionados. Se reutilizan `memory-system.js check`, `scripts/check-doc-links.js` y la
convención de las semillas de `product/` (P3). `docs/product/README.md` no cambia.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Slug `roadmap` | Único slug por el que otros nodos referencian el roadmap: `[[roadmap]]`. | AC-1, AC-3 |
| Sección `## Épicas` | Tabla `ID │ Épica │ Título │ Status │ Substatus`, una fila por épica real, orden por ID. Contrato para STORY-111. | AC-1 |
| Sección `## Plan original (2026-04-20)` | Histórico inmutable: ningún escritor futuro la modifica. Contrato para STORY-111. | AC-2 |
| Wikilink de épica | `[[<slug declarado en epic.md>]]`. | AC-1, AC-3 |
| Wikilinks de trazabilidad | `[[eliminar-specs-01-projects]]` y `[[objectives]]` en `roadmap.md`; `[[roadmap]]` en `objectives.md`. | CNF-2, AC-3 |
| `memory-system check --root docs` | Verificador de solo lectura; criterio por delta (D-8). | AC-3 |

## Esquema de datos

Fila de la tabla `## Épicas` (fuente: frontmatter YAML de cada `epic.md`):

| Campo | Tipo | Origen |
|---|---|---|
| `ID` | `EPIC-NN` | `id` |
| `Épica` | wikilink | `slug` |
| `Título` | texto | `title` |
| `Status` | enumerado del ciclo de épica | `status` |
| `Substatus` | enumerado | `substatus` |

Frontmatter de `roadmap.md`: ver D-4. Frontmatter de `objectives.md`: sin cambios salvo `updated`.

## Flujos clave

### F-1 — Migración (AC-1, AC-2, AC-3)

1. Guardar la línea base de `check` en `.tmp/story-implement/STORY-106/check-before.txt`.
2. Leer el frontmatter de los 22 `epic.md` y escribir `## Épicas` (D-2).
3. Copiar el plan original bajo `## Plan original (2026-04-20)` (D-3) y completar frontmatter y notas (D-4).
4. Escribir el objetivo en `objectives.md` (D-5).
5. Redirigir `index.md` (D-6) y `project.md` (D-7).
6. `git rm docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md`.
7. Verificar los contratos #1–#13; el contenido se compara contra `git show HEAD:<ruta de project-plan.md>`.

### F-2 — Consulta posterior

El mantenedor llega a `roadmap.md` desde `docs/index.md` (`### Producto`), desde `objectives.md` o desde `project.md`; lee primero las
22 épicas con su estado y, si necesita el contexto original, baja a `## Plan original (2026-04-20)`.

### F-3 — Degradación (P7)

- `project-planning` y `epic-from-project-plan` dejan de encontrar `project-plan.md` en este repo. Aceptado: PROJ-01 no se replanifica
  aquí y la ruta la corrige STORY-111. No se deja stub ni enlace simbólico (reintroduciría la doble fuente que ADR-0013 elimina).
- Si un `epic.md` no tuviera `slug`, `title`, `status` o `substatus`, la implementación se detiene y lo registra en
  `implement-report.md` en vez de inventar un valor (hoy los 22 los tienen).
- Si STORY-104 o STORY-105 se implementan antes, las ediciones por contenido (D-6, D-7) siguen aplicando; si alguna subcadena ya no
  existe porque otra historia la cambió, se aplica la sustitución equivalente sobre el texto vigente y se anota.

## Decisiones de complejidad justificada

- **Encabezados de cuatro niveles en el histórico.** Lo más simple sería pegar el plan con sus niveles originales, pero quedaría al
  mismo nivel que `## Épicas` y AC-2 exige que no se mezclen. Bajar un nivel es la transformación mínima que lo subordina.
- **Tabla en lugar de lista.** La lista sería más corta, pero AC-1 pide cinco datos por épica y la tabla los alinea para comparar
  estados; el comparador del contrato #3 la parsea por columnas.
- **Edición manual de un índice generado.** Contradice la nota de cabecera de `index.md`, pero la regeneración arrastra cambios
  ajenos; las dos líneas tocadas son exactamente las que el motor emitiría (alta de `roadmap`, baja de `project-plan`), así que la
  próxima regeneración no las revierte.
- **Comparador efímero en `.tmp/`.** Verificar a mano 22 filas × 5 campos y ~200 líneas literales es propenso a errores; un script
  desechable (no versionado, `.tmp/` está en `.gitignore`) es más barato que un verificador permanente que nadie volvería a usar.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Frontmatter del roadmap | `grep -E "^(type: product\|slug: roadmap)$" docs/product/roadmap.md` → 2 líneas | AC-1 |
| 2 | 22 filas ordenadas | En `## Épicas`, las filas de tabla cuyo primer campo es `EPIC-NN` son 22 y van de `EPIC-00` a `EPIC-21` en orden ascendente | AC-1 |
| 3 | Datos fieles al frontmatter | Comparador `.tmp/story-implement/STORY-106/compare-epics.js`: para cada `docs/specs/02-epics/EPIC-*/epic.md`, la fila con su `id` tiene `[[slug]]`, `title`, `status` y `substatus` idénticos → 22/22 coincidencias, exit 0 | AC-1 |
| 4 | Wikilinks de épica resuelven | `memory-system check` sin `[broken-wikilink]` con path `product/roadmap.md` | AC-1, AC-3 |
| 5 | Plan original íntegro | Comparador `.tmp/story-implement/STORY-106/compare-plan.js`: cada línea no vacía de `git show HEAD:…/project-plan.md` desde `## Backlog de Historias` hasta el final, salvo `---`, aparece en `roadmap.md` (los encabezados con un `#` extra); conteos: 56 ítems de backlog, 9 `#### Épica`, 11 filas de resumen | AC-2, CNF-1 |
| 6 | Secciones disjuntas | `## Plan original (2026-04-20)` existe, empieza con el aviso `> Histórico.` y no contiene `[[`; `## Épicas` no contiene `Épica 0` | AC-2 |
| 7 | Objetivo reubicado | `## Objetivos de negocio` de `objectives.md` contiene la línea literal de `## Objetivo` del original y no contiene `[Por completar`; `grep -c "\[Por completar" docs/product/objectives.md` → `2` | AC-3, CNF-1 |
| 8 | Original eliminado | `test ! -e docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md` | AC-3 |
| 9 | Sin `[[project-plan]]` fuera de `03-stories/` | `grep -rn "\[\[project-plan\]\]" docs \| grep -v "docs/specs/03-stories/"` → vacío | AC-3 |
| 10 | Referencias redirigidas | `index.md` contiene `[[roadmap]]` bajo `### Producto (product/)` una vez; `project.md` contiene `[[roadmap]]` dos veces y `  - roadmap` en `related:` | AC-3 |
| 11 | Sin wikilinks rotos nuevos | `memory-system check --root docs` cumple D-8 frente a `check-before.txt`; `node scripts/check-doc-links.js` → `[OK]` | AC-3 |
| 12 | Trazabilidad | `roadmap.md` contiene `project-plan.md`, `[[eliminar-specs-01-projects]]` y `[[objectives]]` en la nota de origen | CNF-2 |
| 13 | Encoding | Los primeros 3 bytes de `roadmap.md`, `objectives.md`, `index.md` y `project.md` ≠ `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre ellos → vacío | CNF-3 |

## Risks / Trade-offs

- [El roadmap envejece en cuanto una épica cambia de estado] → Aceptado por la historia (Non-Goal); la nota de vigencia (D-4) lo
  avisa y STORY-111 asume la escritura.
- [Conflicto de edición con STORY-104 en `project.md:18` y en `index.md`] → Sustituciones por subcadena y por contenido (D-6, D-7);
  quien implemente segundo reaplica sobre el texto vigente.
- [STORY-105 regenera `index.md`] → Si ocurre después de esta historia, el motor emitirá las mismas dos entradas (alta de
  `roadmap`, sin `project-plan`); si ocurre antes, D-6 evita duplicar.
- [Las casillas `- [ ]` del histórico parecen trabajo pendiente] → Aviso `> Histórico.` al inicio de la sección.
- [Error de copia] → Mitigado por los comparadores de los contratos #3 y #5 contra `git show HEAD:`.
- [La prosa de `project.md:1252` sigue diciendo que `project-plan.md` está desfasado] → Texto plano histórico de `project.md`; su
  migración es de otra historia.

## Open Questions

Ninguna. Las ambigüedades detectadas se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 pide para cada épica "su wikilink `[[EPIC-NN-<slug>]]`", pero cinco épicas (EPIC-13, 14, 15, 17, 18) declaran
  un `slug` sin prefijo `EPIC-NN-`. Aplicar la forma literal a esas cinco crearía 5 wikilinks rotos y contradiría AC-3 ("`check` no
  reporta wikilinks rotos").
- **Documento afectado**: story.md
- **Acción requerida**: el diseño usa `[[<slug declarado>]]` (D-2), que coincide con `EPIC-NN-<slug>` en 17 de 22 casos y resuelve
  en los 22. Opcional: precisar AC-1 como "su wikilink `[[<slug>]]` según su frontmatter".

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: "`memory-system check` no reporta wikilinks rotos" no es alcanzable en absoluto: la línea base tiene 49
  `broken-wikilink` ajenos, incluidos tres en la propia `story.md` (`[[ADR-0013-eliminar-specs-01-projects]]`).
- **Documento afectado**: story.md / design.md
- **Acción requerida**: verificación por delta (D-8, contrato #11) y uso del slug real del ADR en `roadmap.md` (D-4). Recomendado:
  corregir el wikilink al ADR en las historias de EPIC-21 en una historia aparte.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: CNF-1 habla de "las 29 features del backlog", pero el backlog tiene 56 ítems (47 `STORY-NNN` y 9 sin ID); 29 es la
  cifra "Total Features" de `## Resumen`, que cuenta solo las historias asignadas a las 9 épicas propuestas.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño traslada los 56 ítems (D-3, contrato #5), lo que cumple CNF-1 con holgura. Opcional: corregir la
  cifra en CNF-1.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: AC-3 pide que las referencias de `docs/index.md` "apunten a `[[roadmap]]`", pero la entrada vive bajo
  `### L3 — Proyecto (specs/01-projects/)` y `roadmap.md` está en `product/`.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño retira la entrada de `L3` y da de alta `[[roadmap]]` en `### Producto (product/)` (D-6). Sin cambio
  necesario en la historia.
