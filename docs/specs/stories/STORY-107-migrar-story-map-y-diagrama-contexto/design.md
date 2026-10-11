---
type: design
id: STORY-107
slug: STORY-107-migrar-story-map-y-diagrama-contexto-design
title: "Design: Migrar story-map.md y context-diagram.puml"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-107
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-107-migrar-story-map-y-diagrama-contexto
  - eliminar-specs-01-projects
  - story-map
---

<!-- Referencias -->
[[STORY-107-migrar-story-map-y-diagrama-contexto]] · [[eliminar-specs-01-projects]] · [[story-map]]

# Diseño técnico: migrar `story-map.md` y `context-diagram.puml`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) elimina `specs/01-projects/` sin asignar destino a `story-map.md` ni a
`context-diagram.puml`. EPIC-21 fija los destinos: story map → `docs/product/`, diagrama → `docs/architecture/`. La historia
corrige el segundo a `docs/architecture/c4/`, donde `docs/architecture/README.md` (línea 57) ubica la fuente PlantUML junto a su
render.

| Documento | Estado actual (2026-10-07) |
|---|---|
| `docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md` | 235 líneas. Frontmatter: `type: wiki`, `slug: story-map`, `title: "Story Map — Agile SDDF (Spec-Driven Development Framework)"`, `date: 2026-04-20`, `status: COMPLETED`, `substatus: READY`, `parent: null`, `related: [project-plan]`. Cuerpo: línea `<!-- Referencias -->` + `[[PROJ-01-agile-sddf]]`, título, `## Contexto del Proyecto`, `## Personas`, mapa ASCII, backbone, walking skeleton, user tasks, release slices y notas (dependencias, riesgos). Sin enlaces Markdown `](…)`. Copia de trabajo CRLF; índice de git LF (`core.autocrlf=true`). |
| `docs/product/story-map.md` | No existe. |
| `docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml` | 22 líneas. `diff -q` contra `docs/architecture/c4/context-diagram.puml` → idénticos (2026-10-07). |
| `docs/architecture/c4/context-diagram.puml` · `context-diagram.png` | Vigentes; enlazados desde `docs/architecture/README.md:25`. |
| `docs/architecture/context-diagram.puml` | No existe (y no debe existir, AC-2). |
| `docs/product/README.md` | Admite "cualquier otro documento de contexto en kebab-case": `story-map.md` entra sin cambiar el README. |

**Resolución de wikilinks.** `memory-system.js` resuelve `[[slug]]` contra el conjunto de slugs declarados (`slugSetOf`, línea 542),
sin mirar la ruta. `slug: story-map` solo lo declara hoy el archivo de origen, así que conservar el slug basta para que
`[[story-map]]` resuelva al nuevo archivo. `check` exige en todo nodo `type`, `slug` y `title`, y `id`/`status` solo a los tipos de
spec (`project`, `epic`, `story`, línea 608); `type: product` no exige más campos.

Referencias vivas (`grep -rn "\[\[story-map\]\]"`, excluido `03-stories/`):

| Archivo | Línea | Forma | ¿Cambia? |
|---|---|---|---|
| `docs/index.md` | 78 | Entrada bajo `### L3 — Proyecto (specs/01-projects/)` con enlace `[story-map.md](specs/01-projects/PROJ-01-agile-sddf/story-map.md)` | Sí (D-3) |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 18 | Wikilink en `<!-- Referencias -->` | No (el slug no cambia) |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 1106 | Wikilink en `## 11. Referencias` | No |

`context-diagram.puml` no tiene ninguna referencia por ruta a la copia de `PROJ-01`: las menciones en `project.md` (líneas 291, 926,
959, 1042) son texto plano sin ruta (Non-Goal) y las de `docs/guides/` hablan de rutas genéricas del pipeline.

**Verificadores.** `scripts/check-doc-links.js` incluye `docs/index.md` entre sus `ACTIVE_ROOTS` (línea 19): si el enlace de la línea
78 queda apuntando a `specs/01-projects/…/story-map.md` tras borrar el original, el script falla. `docs/product/` y
`docs/architecture/` no son raíces activas de ese script.

**Línea base de `memory-system check`** (`node skills/memory-system/scripts/memory-system.js check --root docs`, 2026-10-07):
exit 1, `problemas: 55 (orphan 6 · broken-wikilink 49)`. Ninguno involucra `story-map`, `product/`, `architecture/`, `index.md` ni
`project.md`; tres son `[[ADR-0013-eliminar-specs-01-projects]]` en `story.md` de STORY-107 (×2) y STORY-112 (el slug real del ADR es
`eliminar-specs-01-projects`). `node scripts/check-doc-links.js` → `[OK] Checked 46 active Markdown files`.

**EPIC-21 desalineado.** `epic.md` declara el destino `docs/architecture/context-diagram.puml` en la línea de STORY-107 (línea 30) y en
el criterio de salida "`docs/architecture/` contiene `context-diagram.puml`." (línea 47). Las notas de la historia piden alinear ambos
con `c4/` (D-4).

**Historias hermanas.** STORY-104, 105 y 106 también editan `docs/index.md` (líneas distintas) y STORY-105 puede regenerarlo con
`memory-system index`. Ninguna toca `story-map.md` ni `c4/`. STORY-112 hará después que `project-story-mapping` y
`project-context-diagram` escriban en los destinos nuevos.

Stack aplicable (constitución + `package.json`): solo Markdown y PlantUML versionados. No hay código que cambiar; las verificaciones
usan `git`, `grep`, `diff`, `memory-system.js check` y `scripts/check-doc-links.js`.

## Goals / Non-Goals

**Goals:**

- `docs/product/story-map.md` existe con el cuerpo literal del original, frontmatter `type: product` y `slug: story-map`; el original ya
  no existe. // satisface: AC-1, CNF-1
- La copia de `context-diagram.puml` en `PROJ-01` se elimina; `c4/context-diagram.puml` y `c4/context-diagram.png` no cambian y no se
  crea `docs/architecture/context-diagram.puml`. // satisface: AC-2
- `[[story-map]]` resuelve a `docs/product/story-map.md`, la entrada de `docs/index.md` apunta a `product/story-map.md` y no aparecen
  wikilinks rotos nuevos. // satisface: AC-3
- EPIC-21 nombra `docs/architecture/c4/context-diagram.puml` como destino. // satisface: AC-2 (nota de la historia)
- Todo archivo tocado queda en UTF-8 sin BOM y sin mojibake. // satisface: CNF-2

**Non-Goals:**

- Actualizar el contenido del story map (personas, actividades, release slices, fecha `2026-04-20`).
- Cambiar `project-story-mapping`, `project-story-mapper` o `project-context-diagram` (STORY-112).
- Reemplazar `related: project-plan` ni `[[PROJ-01-agile-sddf]]` del story map (dependen de STORY-106 y de la eliminación de
  `project.md`).
- Reescribir las menciones a `context-diagram.puml` o `story-map.md` en la prosa de `project.md`, `docs/guides/` o `CHANGELOG.md`.
- Corregir los 55 problemas preexistentes de `check`, incluido `[[ADR-0013-eliminar-specs-01-projects]]` en `story.md`.
- Regenerar `docs/index.md` completo o tocar otras secciones (p. ej. `Estado del grafo`).
- Borrar `docs/specs/01-projects/PROJ-01-agile-sddf/` (sigue conteniendo `project-intent.md`, `project.md` y `project-plan.md`).

## Decisions

### D-1 — Mover el story map con `git mv` y cambiar solo `type` // satisface: AC-1, CNF-1, CNF-2

- Operación: `git mv docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md docs/product/story-map.md`, y luego reemplazar la línea
  `type: wiki` por `type: product`. Ninguna otra línea cambia.
- Frontmatter resultante: `type: product` · `slug: story-map` · `title`, `date`, `status`, `substatus`, `parent` y `related` sin
  cambios.
- El cuerpo (desde `<!-- Referencias -->` hasta el final) no se toca: conserva `[[PROJ-01-agile-sddf]]`, el mapa ASCII y la fecha
  original (Non-Goals).
- Codificación y fin de línea: la edición conserva UTF-8 sin BOM y el fin de línea de la copia de trabajo; el contenido del índice de
  git queda en LF, igual que el original.

**Alternativas rechazadas:**

- *Crear el archivo nuevo copiando el contenido y `git rm` del original:* el resultado en disco es el mismo, pero se pierde la
  detección de renombrado y `git log --follow` deja de mostrar la historia del documento.
- *Adoptar la convención de las semillas de `product/` (`created`/`updated`, `status: IN-PROGRESS`, `substatus: TODO`):* reescribe
  metadatos que describen el estado real del mapa (completado el 2026-04-20) y contradice el Non-Goal "con su fecha original".
- *Limpiar también `related: project-plan` y `[[PROJ-01-agile-sddf]]`:* Non-Goal explícito; además el wikilink es parte del cuerpo
  (CNF-1).

### D-2 — Diagrama de contexto: borrar la copia duplicada // satisface: AC-2

- Precondición verificable: `git diff --no-index --quiet docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml docs/architecture/c4/context-diagram.puml`
  → exit 0. Si falla, la implementación se detiene (F-3).
- Operación: `git rm docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml`.
- `docs/architecture/c4/` no se toca: ni `.puml` ni `.png`, ni el `README.md` de `architecture/`.

**Alternativas rechazadas:**

- *Mover la copia a `docs/architecture/context-diagram.puml` (destino literal de EPIC-21):* duplicaría el diagrama fuera de `c4/` y
  violaría la convención de `architecture/README.md` y el `Pero` de AC-2.
- *Sobrescribir `c4/context-diagram.puml` con la copia de `PROJ-01`:* no aporta nada (son idénticos) y arriesga cambiar el `.puml` sin
  regenerar el `.png`.

### D-3 — `docs/index.md`: reubicar la entrada `[[story-map]]` a mano // satisface: AC-3

- Se elimina la línea
  `- [[story-map]] — [story-map.md](specs/01-projects/PROJ-01-agile-sddf/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)`
  (hoy línea 78, bajo `### L3 — Proyecto`).
- En `### Producto (product/)` se inserta
  `- [[story-map]] — [story-map.md](product/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)`
  inmediatamente después de la entrada `[[stakeholders]]` y antes de `[[vision]]` (orden alfabético por nombre de archivo, el que ya
  sigue la sección tras el README).
- Ambas ediciones se localizan **por contenido**, no por número de línea: STORY-104/105/106 pueden haber movido líneas antes.
- Si la entrada `[[story-map]]` con ruta `product/story-map.md` ya existe (p. ej. porque STORY-105 regeneró el índice), no se duplica.
- No se toca ninguna otra línea del índice.

**Alternativas rechazadas:**

- *Regenerar con `memory-system index`:* arrastra cambios ajenos a esta historia (ya documentado en los diseños de STORY-104/106).
- *Cambiar solo la ruta del enlace y dejar la entrada bajo `L3 — Proyecto`:* mentiría sobre la capa del documento.

### D-4 — Alinear EPIC-21 con `c4/` // satisface: AC-2

En `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sustitución **de subcadena**:

| Ubicación | Subcadena antes | Subcadena después |
|---|---|---|
| Línea de STORY-107 en `## Historias` | `` `context-diagram.puml` a `docs/architecture/context-diagram.puml` `` | `` `context-diagram.puml` a `docs/architecture/c4/context-diagram.puml` `` |
| `## Criterios de salida` | `` `docs/architecture/` contiene `context-diagram.puml`. `` | `` `docs/architecture/c4/` contiene `context-diagram.puml` y su render `context-diagram.png`. `` |

- El título de la historia en esa línea (`Migrar story-map.md y context-diagram.puml`) y el resto de la épica no cambian; tampoco el
  `status` ni el `updated` del frontmatter.
- La casilla `- [ ]` del criterio de salida no se marca: el criterio se cumple en todo EPIC-21, no solo aquí.

**Alternativas rechazadas:**

- *Dejar la épica como está:* el criterio de salida quedaría incumplible sin violar AC-2 (o cumplible solo creando la copia prohibida).
- *Editar la épica durante el planning:* la fase PLAN solo produce artefactos de la historia; el cambio se ejecuta en IMPLEMENT.

### D-5 — Orden de la operación y criterio de "sin wikilinks rotos" // satisface: AC-3

Orden: (1) línea base de `check` → (2) verificar que los `.puml` son idénticos → (3) mover y editar el story map (D-1) →
(4) reubicar la entrada del índice (D-3) → (5) borrar la copia del diagrama (D-2) → (6) alinear EPIC-21 (D-4) → (7) verificar.
No hay estado intermedio con contenido solo en una copia sin versionar: el story map se renombra, no se recrea.

"`memory-system check` no reporta wikilinks rotos" se verifica como **delta** respecto de la línea base (ver CR-002):

- ninguna línea `[broken-wikilink]`, `[orphan]` ni `[invalid-frontmatter]` menciona `story-map`, `product/story-map.md`, `index.md` ni
  `01-projects/PROJ-01-agile-sddf/project.md`;
- `problemas` y `broken-wikilink` no superan los valores de `check-before.txt` (hoy 55 y 49).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Story map del producto | mover + modificar 1 línea | `docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md` → `docs/product/story-map.md` | AC-1, AC-3, CNF-1, CNF-2 |
| Copia del diagrama de contexto en PROJ-01 | eliminar | `docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml` | AC-2 |
| Diagrama de contexto C4 L1 | sin cambios | `docs/architecture/c4/context-diagram.puml` · `context-diagram.png` | AC-2 |
| Índice de documentación | modificar (−1 / +1 línea) | `docs/index.md` | AC-3, CNF-2 |
| Épica EPIC-21 | modificar (2 subcadenas) | `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md` | AC-2, CNF-2 |

No se crean componentes ejecutables. Se reutilizan `git mv`/`git rm`, `memory-system.js check` y `scripts/check-doc-links.js` (P3).
`docs/product/README.md` y `docs/architecture/README.md` no cambian.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Slug `story-map` | Único slug del story map; declarado solo en `docs/product/story-map.md`. `[[story-map]]` en `project.md` sigue resolviendo sin editarlo. | AC-1, AC-3 |
| Ruta canónica del diagrama de contexto | `docs/architecture/c4/context-diagram.puml` (+ `.png`). Contrato para STORY-112 (`project-context-diagram`). | AC-2 |
| Ruta canónica del story map | `docs/product/story-map.md`. Contrato para STORY-112 (`project-story-mapping`). | AC-1 |
| Entrada del índice | `- [[story-map]] — [story-map.md](product/story-map.md) — <title>` bajo `### Producto (product/)`. | AC-3 |
| `memory-system check --root docs` | Verificador de solo lectura; criterio por delta (D-5). | AC-3 |
| `scripts/check-doc-links.js` | Valida que el enlace de la entrada del índice resuelve. | AC-3 |

## Esquema de datos

Frontmatter de `docs/product/story-map.md` (YAML):

| Clave | Antes | Después |
|---|---|---|
| `type` | `wiki` | `product` |
| `slug` | `story-map` | `story-map` |
| `title` | `"Story Map — Agile SDDF (Spec-Driven Development Framework)"` | igual |
| `date` | `2026-04-20` | igual |
| `status` / `substatus` | `COMPLETED` / `READY` | igual |
| `parent` | `null` | igual |
| `related` | `[project-plan]` | igual (Non-Goal) |

## Flujos clave

### F-1 — Migración (AC-1, AC-2, AC-3)

1. Guardar la línea base de `check` en `.tmp/story-implement/STORY-107/check-before.txt`.
2. Confirmar que los dos `.puml` son idénticos (D-2).
3. `git mv` del story map y cambio de `type` (D-1).
4. Reubicar la entrada `[[story-map]]` en `docs/index.md` (D-3).
5. `git rm` de la copia del diagrama (D-2).
6. Alinear EPIC-21 (D-4).
7. Verificar los contratos #1–#11; el contenido se compara contra `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md`.

### F-2 — Consulta posterior

El mantenedor llega al story map desde `docs/index.md` (`### Producto`) o desde `[[story-map]]` en `project.md`, y al diagrama desde
`docs/architecture/README.md`. Cada artefacto existe una sola vez.

### F-3 — Degradación (P7)

- Si los dos `.puml` difieren al implementar (alguien editó uno), no se borra nada: se registra la diferencia en `implement-report.md`
  y se pide al mantenedor decidir cuál prevalece, porque AC-2 parte de que son idénticos.
- Si `docs/product/story-map.md` ya existe al implementar, no se sobrescribe: se compara con el original y se registra.
- `project-story-mapping` y `project-context-diagram` siguen escribiendo en `specs/01-projects/` hasta STORY-112. Si alguien los
  ejecuta antes, recrearían una copia en `PROJ-01`: aceptado, se corrige en STORY-112. No se deja stub ni enlace simbólico.
- Si STORY-104/105/106 se implementan antes, las ediciones por contenido (D-3, D-4) siguen aplicando; si la línea ya no existe porque
  otra historia la cambió, se aplica la sustitución equivalente sobre el texto vigente y se anota.

## Decisiones de complejidad justificada

- **`git mv` + edición en dos pasos** en vez de escribir el archivo nuevo de una vez: es igual de simple y conserva el historial del
  documento; la transformación queda reducida a una línea, fácil de verificar con `diff`.
- **Edición manual de un índice generado:** contradice la nota de cabecera de `index.md`, pero la regeneración arrastra cambios ajenos;
  las dos líneas tocadas son las que el motor emitiría para el archivo movido.
- **Sin comparador en `.tmp/`:** a diferencia de STORY-106, el cuerpo no cambia; un `diff` del cuerpo contra `git show HEAD:` basta.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Story map en `product/` con frontmatter correcto | `test -f docs/product/story-map.md`; `grep -E "^(type: product\|slug: story-map)$"` (tras quitar `\r`) → 2 líneas | AC-1 |
| 2 | Cuerpo literal | El contenido de `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md` y de `docs/product/story-map.md`, con fin de línea normalizado a LF, difiere solo en la línea `type:` (`diff` → un único cambio `type: wiki` → `type: product`) | AC-1, CNF-1 |
| 3 | Original eliminado | `test ! -e docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md`; `git status` lo muestra como renombrado | AC-1 |
| 4 | Copia del diagrama eliminada | `test ! -e docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml` | AC-2 |
| 5 | `c4/` intacto | `git diff --quiet HEAD -- docs/architecture/c4/` y `git status --porcelain docs/architecture/c4/` vacío | AC-2 |
| 6 | Sin diagrama fuera de `c4/` | `test ! -e docs/architecture/context-diagram.puml` | AC-2 |
| 7 | Slug único | `grep -rln "^slug: story-map" docs` (excluido `03-stories/`) → solo `docs/product/story-map.md` | AC-3 |
| 8 | Entrada del índice | `docs/index.md` contiene exactamente una línea con `[[story-map]]`, con enlace `(product/story-map.md)` y dentro de `### Producto (product/)`; `grep -c "specs/01-projects/PROJ-01-agile-sddf/story-map.md" docs/index.md` → `0` | AC-3 |
| 9 | Sin wikilinks rotos nuevos | `memory-system check --root docs` cumple D-5 frente a `check-before.txt`; `node scripts/check-doc-links.js` → `[OK]` | AC-3 |
| 10 | EPIC-21 alineado | `grep -c "docs/architecture/context-diagram.puml" docs/specs/02-epics/EPIC-21-*/epic.md` → `0`; `grep -c "docs/architecture/c4/" …/epic.md` → `2` | AC-2 |
| 11 | Encoding | Los primeros 3 bytes de `docs/product/story-map.md`, `docs/index.md` y `epic.md` ≠ `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre ellos → vacío | CNF-2 |

## Risks / Trade-offs

- [`project-story-mapping`/`project-context-diagram` recrean archivos en `PROJ-01` antes de STORY-112] → Aceptado (F-3); el contrato de
  rutas queda fijado aquí para STORY-112.
- [Conflicto de edición en `docs/index.md` con STORY-104/105/106] → Ediciones por contenido (D-3); quien implemente segundo reaplica.
- [`related: project-plan` queda colgando si STORY-106 se implementa antes] → `check` no valida `related:`; el reemplazo es Non-Goal.
- [`[[PROJ-01-agile-sddf]]` del story map se romperá cuando se elimine `project.md`] → Lo resuelve la historia que elimine
  `project.md`; hoy resuelve.
- [El editor cambia el fin de línea o añade BOM al editar `type:`] → Contratos #2 y #11.

## Open Questions

Ninguna. Las ambigüedades detectadas se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: EPIC-21 fija `docs/architecture/context-diagram.puml` como destino (línea de STORY-107 y criterio de salida), pero
  AC-2 prohíbe crear el diagrama fuera de `c4/`. La historia lo anticipa en sus notas, sin un AC que lo cubra.
- **Documento afectado**: epic.md (EPIC-21)
- **Acción requerida**: la implementación aplica D-4 (2 subcadenas). Opcional: añadir a `story.md` una línea en el `Entonces` de AC-2
  ("y EPIC-21 nombra `docs/architecture/c4/context-diagram.puml`").

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-3 exige que "`memory-system check` no reporta wikilinks rotos", pero la línea base ya tiene 49
  `broken-wikilink` ajenos a esta historia (dos de ellos en el propio `story.md`: `[[ADR-0013-eliminar-specs-01-projects]]`). Leído
  literal, el AC es incumplible sin salir del alcance.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño verifica por delta (D-5). Opcional: precisar AC-3 como "no reporta wikilinks rotos nuevos ni
  referidos a `story-map`" y corregir el wikilink del ADR en `story.md` a `[[eliminar-specs-01-projects]]`.
