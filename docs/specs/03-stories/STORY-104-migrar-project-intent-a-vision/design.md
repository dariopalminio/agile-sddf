---
type: design
id: STORY-104
slug: STORY-104-migrar-project-intent-a-vision-design
title: "Design: Migrar project-intent.md a product/vision.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-104
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-104-migrar-project-intent-a-vision
  - eliminar-specs-01-projects
  - vision
---

<!-- Referencias -->
[[STORY-104-migrar-project-intent-a-vision]] · [[eliminar-specs-01-projects]] · [[vision]]

# Diseño técnico: migrar `project-intent.md` a `product/vision.md`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) decide que `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md`
pasa a vivir en `docs/product/vision.md`. Hoy conviven dos documentos con el mismo propósito:

| Documento | Estado actual |
|---|---|
| `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` | Fuente real: seis secciones `##` completas (`Definición del Problema`, `Visión (elevator pitch)`, `Beneficios Clave`, `Criterios de Éxito`, `Restricciones`, `Fuera de alcance (Non-Goals)`). Frontmatter `slug: PROJ-01-agile-sddf-project-intent`, `status: COMPLETED`. |
| `docs/product/vision.md` | Semilla del scaffold de `memory-system`: tres secciones (`Problema que resolvemos`, `Propuesta de valor`, `Alcance y límites`) con marcadores `[Por completar: …]`. Frontmatter `type: product`, `slug: vision`. UTF-8 sin BOM. |

Referencias vivas al nodo que desaparece (medidas con `grep -rn "PROJ-01-agile-sddf-project-intent" docs`):

| Archivo | Línea | Forma |
|---|---|---|
| `docs/index.md` | 75 | Entrada wikilink del índice, bajo `### L3 — Proyecto (specs/01-projects/)` |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 12 | Slug en `related:` del frontmatter |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 18 | Wikilink en la línea `<!-- Referencias -->` |
| `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | 1105 | Wikilink en `## 11. Referencias` |
| `docs/specs/03-stories/STORY-086-…/plan-06-update-project.md` | 90 | Texto plano (no wikilink) en un historial de `03-stories/` — fuera de alcance |

Fuera de `docs/`, `AGENTS.md:13` afirma que "La visión de producto completa vive en
`docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md`". Tras borrar el original esa frase describe algo que no existe,
lo que viola la regla de veracidad del propio `AGENTS.md` (ver D-5 y CR-003).

**Línea base de `memory-system check`** (`node skills/memory-system/scripts/memory-system.js check --root docs`, 2026-10-07):
exit 1, `problemas: 55 (orphan 6 · broken-wikilink 49)`. Ninguno de esos problemas involucra a `project-intent.md`,
`vision.md`, `index.md` ni `project.md`. La mayoría proviene de historias de EPIC-21 que enlazan
`[[ADR-0013-eliminar-specs-01-projects]]`, mientras que el slug real del ADR es `eliminar-specs-01-projects`.

`index.md` está desactualizado respecto del motor: una regeneración de prueba sobre una copia de `docs/` (`memory-system index
--root <copia>`) produce 44 líneas de diff ajenas a esta historia (entradas de EPIC-21 y STORY-102…118, cambio del enlace a Foam
y una entrada inválida derivada de `STORY-103-…/epic-template.md`, cuyo `slug` es un placeholder con comentario YAML).

Stack aplicable (constitución + `package.json`): solo Markdown versionado. No hay código ejecutable que cambiar; las verificaciones
usan scripts ya existentes (`memory-system.js check`, `scripts/check-doc-links.js`, `grep`).

## Goals / Non-Goals

**Goals:**

- `docs/product/vision.md` contiene íntegro el contenido de las seis secciones de `project-intent.md`, sin marcadores
  `[Por completar` y conservando `type: product` y `slug: vision`. // satisface: AC-1
- `Criterios de Éxito` aparece en una sección propia de `vision.md`; ningún ítem de criterios, restricciones ni non-goals se
  resume ni se omite. // satisface: AC-2
- `project-intent.md` se elimina y ningún archivo de `docs/` fuera de `docs/specs/03-stories/` conserva
  `[[PROJ-01-agile-sddf-project-intent]]`; las referencias pasan a `[[vision]]` sin introducir wikilinks rotos. // satisface: AC-3
- `vision.md` declara su origen (ADR-0013) y queda en UTF-8 sin BOM. // satisface: CNF-1, CNF-2

**Non-Goals:**

- Cambiar skills, agentes o templates que generan o leen `project-intent.md` (historia de skills de EPIC-21).
- Automatizar la migración para otros repos (`memory-system migrate --from=specs-3-levels`, STORY-114).
- Migrar `project.md`, `project-plan.md`, `story-map.md` o `context-diagram.puml`, o borrar la carpeta `01-projects/`.
- Reescribir menciones textuales a `project-intent.md` en `02-epics/`, `03-stories/`, `architecture/`, `domains/`, `guides/`,
  `README.md` o `CHANGELOG.md`; tampoco las de `project-plan.md` y `story-map.md` (se migran en sus historias).
- Corregir los 55 problemas preexistentes de `memory-system check` ni regenerar `docs/index.md` completo.
- Rellenar `docs/product/objectives.md` (su sección `Métricas de éxito` sigue con marcador; no es parte de esta historia).

## Decisions

### D-1 — Estructura de destino de `vision.md` y correspondencia de secciones // satisface: AC-1, AC-2

`vision.md` conserva las tres secciones `##` del scaffold (mismo título y orden de lectura) y suma una cuarta, `## Criterios de
éxito`, entre `Propuesta de valor` y `Alcance y límites` (primero qué valor se entrega, luego cómo se mide, luego qué límites
tiene). Las secciones de origen que comparten destino se conservan como subsecciones `###` con su título original, de modo que
cada sección de origen sigue siendo localizable por su nombre.

| Sección de origen (`project-intent.md`) | Destino en `vision.md` | Forma |
|---|---|---|
| `Definición del Problema` | `## Problema que resolvemos` | Los dos párrafos, literales |
| `Visión (elevator pitch)` | `## Propuesta de valor` → `### Visión (elevator pitch)` | Los siete ítems `Para / Quiénes / Nuestro producto / Es un / Que provee / A diferencia de / Nuestro producto`, literales |
| `Beneficios Clave` | `## Propuesta de valor` → `### Beneficios clave` | Los cuatro ítems, literales |
| `Criterios de Éxito` | `## Criterios de éxito` (sección nueva) | Los tres ítems, literales, conservando la casilla `- [ ]` |
| `Restricciones` | `## Alcance y límites` → `### Restricciones` | Los tres ítems `Technical / Time / Resources`, literales |
| `Fuera de alcance (Non-Goals)` | `## Alcance y límites` → `### Fuera de alcance (Non-Goals)` | Los seis ítems, literales, conservando la marca `[inferido]` |

Regla de copia: el texto de los ítems se traslada **sin parafrasear, resumir ni reordenar**. Solo cambian los encabezados
(adaptados al título de destino del scaffold); el contenido es un movimiento, no una reescritura.

**Alternativas rechazadas:**

- *Reemplazar las secciones del scaffold por las seis de origen tal cual:* rompe el contrato de las semillas de `memory-system`
  (los títulos `Problema que resolvemos` / `Propuesta de valor` / `Alcance y límites` son los que esperan los futuros escritores
  de STORY-109) y deja `vision.md` con una forma distinta a la de cualquier otro repo inicializado.
- *Fusionar el contenido en prosa dentro de las tres secciones existentes:* obliga a resumir o reescribir, lo que AC-2 prohíbe, y
  pierde la localización por nombre de `Criterios de Éxito`.
- *Mover `Criterios de Éxito` a `docs/product/objectives.md › Métricas de éxito`:* contradice AC-2 (pide una sección propia en
  `vision.md`) y abre una segunda migración que la historia no cubre.

### D-2 — Frontmatter y nota de trazabilidad de `vision.md` // satisface: AC-1, CNF-1

- Se conservan sin cambios `type: product`, `slug: vision`, `title`, `status`, `substatus`, `parent` y `created`.
  Solo cambia `updated` a la fecha de la implementación. No se agregan claves nuevas al frontmatter.
- Inmediatamente después del título `# Visión del producto` se agrega una nota de cita:
  `> Consolidada desde project-intent.md (PROJ-01, eliminado) por [[eliminar-specs-01-projects]].` — el nombre del archivo
  original va como texto en código, no como wikilink, porque su slug deja de existir.
- El wikilink al ADR usa el slug real `eliminar-specs-01-projects` (frontmatter del ADR), **no** `ADR-0013-eliminar-specs-01-projects`
  (forma usada en `story.md`), porque esta última no resuelve en `memory-system check` (ver CR-002).
- Se conserva el pie `Volver al mapa: [[index]].`

**Alternativas rechazadas:**

- *Marcar `substatus` como `DONE`:* la capa `product/` no es un work item con transiciones gobernadas; cambiar el estado del
  scaffold es una decisión de convención que no pide la historia (YAGNI).
- *Declarar el origen en un campo `related:` o `source:` del frontmatter:* CNF-1 pide que **un lector** sepa de dónde viene la
  visión; una nota visible cumple eso sin añadir claves que ningún consumidor lee.
- *Usar `[[ADR-0013-eliminar-specs-01-projects]]` como en la historia:* añadiría un `broken-wikilink` nuevo a `check`.

### D-3 — `docs/index.md`: retirar la entrada a mano, sin regenerar // satisface: AC-3

Se elimina únicamente la línea 75 (`- [[PROJ-01-agile-sddf-project-intent]] — [project-intent.md](…) — Project Intent: …`).
La visión ya está indexada en `### Producto (product/)` como `- [[vision]] — [vision.md](product/vision.md) — Visión del producto`
(línea 61): tras el cambio, la única entrada del índice que representa la intención del proyecto apunta a `[[vision]]`.
No se toca ninguna otra línea (ni el `updated` del frontmatter ni la tabla `Estado del grafo`, que ya estaba desactualizada).

**Alternativas rechazadas:**

- *Regenerar con `memory-system index`:* es lo que recomienda la cabecera del índice, pero hoy produce 44 líneas de diff ajenas a
  la historia, incluida una entrada inválida derivada de `STORY-103-…/epic-template.md`; mezclarlas en este cambio dificulta la
  revisión y publicaría un defecto ajeno.
- *Reescribir la línea 75 como `[[vision]]` bajo `L3 — Proyecto`:* duplicaría la entrada de `vision` en una sección que lista
  `specs/01-projects/`, mintiendo sobre su ubicación.

### D-4 — `project.md`: redirigir las tres referencias a `vision` // satisface: AC-3

En `docs/specs/01-projects/PROJ-01-agile-sddf/project.md`:

| Línea | Antes | Después |
|---|---|---|
| 12 (`related:`) | `- PROJ-01-agile-sddf-project-intent` | `- vision` |
| 18 (`<!-- Referencias -->`) | `[[PROJ-01-agile-sddf-project-intent]] · [[project-plan]] · [[story-map]]` | `[[vision]] · [[project-plan]] · [[story-map]]` |
| 1105 (`## 11. Referencias`) | `- [[PROJ-01-agile-sddf-project-intent]] — intención inicial del proyecto` | `- [[vision]] — visión del producto (antes project-intent.md)` |

No se modifica ninguna otra parte de `project.md` (su migración es otra historia). La línea 12 no es un wikilink, pero es una
referencia por slug al nodo eliminado y quedaría colgando; se actualiza por coherencia con la misma regla.

**Alternativas rechazadas:**

- *Cambiar solo los dos wikilinks:* deja `related:` apuntando a un slug inexistente.
- *Eliminar las referencias en lugar de redirigirlas:* AC-3 exige que "esas referencias apunten a `[[vision]]`".

### D-5 — `AGENTS.md`: corregir el puntero a la visión // satisface: AC-3 (consecuencia), CNF-1

En `AGENTS.md:13` se reemplaza solo el fragmento ``La visión de producto completa vive en `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` ``
por ``La visión de producto completa vive en `docs/product/vision.md` ``. El resto del párrafo (incluida la referencia a
`docs/specs/01-projects/PROJ-01-agile-sddf/`, que sigue existiendo) no cambia.

**Alternativas rechazadas:**

- *Dejarlo para la historia de documentación canónica (STORY-116):* hasta entonces, cada sesión de agente leería en sus
  instrucciones raíz una ruta inexistente; es un efecto directo del borrado de esta historia.
- *Quitar la frase:* pierde el puntero que orienta a humanos y agentes hacia la visión.

### D-6 — Orden de la operación y criterio de "sin wikilinks rotos" // satisface: AC-3

Orden obligatorio: (1) consolidar `vision.md` → (2) redirigir referencias (`index.md`, `project.md`, `AGENTS.md`) →
(3) borrar `project-intent.md` con `git rm` → (4) verificar. Borrar al final garantiza que en ningún estado intermedio exista
un wikilink apuntando a un nodo ausente y que el contenido nunca exista solo en una copia no versionada.

"`memory-system check` no reporta wikilinks rotos" se verifica como **delta respecto de la línea base** (ver CR-002):

- ninguna línea `[broken-wikilink]` menciona `PROJ-01-agile-sddf-project-intent`, `product/vision.md`, `index.md` ni
  `01-projects/PROJ-01-agile-sddf/project.md`;
- el total `problemas:` es ≤ 55 y el conteo `broken-wikilink` es ≤ 49.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Visión del producto | modificar | `docs/product/vision.md` | AC-1, AC-2, CNF-1, CNF-2 |
| Intención del proyecto (PROJ-01) | eliminar | `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` | AC-3 |
| Índice de documentación | modificar (1 línea) | `docs/index.md` | AC-3 |
| Especificación de requisitos PROJ-01 | modificar (3 líneas) | `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | AC-3 |
| Instrucciones raíz del repo | modificar (1 fragmento) | `AGENTS.md` | AC-3 (consecuencia) |

No se crean archivos nuevos ni componentes ejecutables. Se reutilizan el motor `memory-system.js check` y
`scripts/check-doc-links.js` como verificadores (P3).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Slug `vision` | Único slug por el que otros nodos referencian la visión del producto: `[[vision]]`. No cambia. | AC-1, AC-3 |
| Secciones `##` de `vision.md` | `Problema que resolvemos`, `Propuesta de valor`, `Criterios de éxito`, `Alcance y límites`, en ese orden. Las tres del scaffold mantienen su título literal para los escritores futuros (STORY-109). | AC-1, AC-2 |
| Wikilink de trazabilidad | `[[eliminar-specs-01-projects]]` (slug real de ADR-0013). | CNF-1 |
| `memory-system check --root docs` | Verificador de solo lectura; criterio de aceptación por delta (D-6). | AC-3 |

## Esquema de datos

Frontmatter resultante de `docs/product/vision.md` (solo `updated` cambia):

| Clave | Valor |
|---|---|
| `type` | `product` |
| `slug` | `vision` |
| `title` | `"Visión del producto"` |
| `status` | `IN-PROGRESS` |
| `substatus` | `TODO` |
| `parent` | `null` |
| `created` | `2026-09-22` |
| `updated` | fecha de implementación (`YYYY-MM-DD`) |

Esqueleto del cuerpo:

```
# Visión del producto
> Consolidada desde `project-intent.md` (PROJ-01, eliminado) por [[eliminar-specs-01-projects]].
## Problema que resolvemos            ← Definición del Problema
## Propuesta de valor
### Visión (elevator pitch)           ← Visión (elevator pitch)
### Beneficios clave                  ← Beneficios Clave
## Criterios de éxito                 ← Criterios de Éxito
## Alcance y límites
### Restricciones                     ← Restricciones
### Fuera de alcance (Non-Goals)      ← Fuera de alcance (Non-Goals)
Volver al mapa: [[index]].
```

## Flujos clave

### F-1 — Consolidar y retirar el original (AC-1, AC-2, AC-3)

1. El mantenedor lee `project-intent.md` y escribe `vision.md` según D-1/D-2 (UTF-8 sin BOM).
2. Verifica AC-1/AC-2: ningún `[Por completar`, seis bloques de origen presentes, conteo de ítems igual al de origen (2 párrafos,
   7 + 4 + 3 + 3 + 6 ítems).
3. Aplica D-3, D-4 y D-5.
4. Ejecuta `git rm docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md`.
5. Verifica AC-3 con `grep` y `memory-system check` (D-6) y `node scripts/check-doc-links.js` (sigue en `[OK]`).

### F-2 — Lectura posterior por humano o agente

Quien busque la visión desde `docs/index.md` o desde `AGENTS.md` llega a `docs/product/vision.md`; desde `project.md`, el
wikilink `[[vision]]` resuelve al mismo nodo. No existe ya una segunda copia que pueda divergir.

### F-3 — Degradación: `project-discovery` en este repo (P7)

Tras el borrado, `project-discovery` / `project-flow` no encontrarán `project-intent.md` en este repo. Es aceptado por la
historia (PROJ-01 está `COMPLETED`); la ruta la corrige la historia de skills de EPIC-21. No se agrega ningún mecanismo de
compatibilidad (enlace simbólico, archivo stub) porque reintroduciría la doble fuente de verdad que ADR-0013 elimina.

## Decisiones de complejidad justificada

- **Subsecciones `###` dentro de `Propuesta de valor` y `Alcance y límites`.** Lo más simple sería concatenar los ítems bajo cada
  `##`, pero se perdería la frontera entre "visión" y "beneficios" o entre "restricciones" y "non-goals", que son conceptos
  distintos y que AC-2 exige preservar completos. Dos niveles de encabezado son el mínimo que conserva esa frontera.
- **Edición manual de una línea en un índice generado.** Contradice la nota "no edites las entradas a mano", pero la alternativa
  (regenerar) arrastra 44 líneas ajenas y un defecto de otra historia. La línea retirada es exactamente la que el motor dejaría de
  emitir al no existir el nodo, así que la próxima regeneración no la revierte.
- **Tocar `AGENTS.md` fuera de `docs/`.** No lo pide ningún AC literalmente; se incluye porque el borrado de esta historia es lo
  que vuelve falsa esa frase (CR-003).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `vision.md` no contiene marcadores | `grep -c "\[Por completar" docs/product/vision.md` → `0` | AC-1 |
| 2 | Frontmatter conserva tipo y slug | `grep -E "^(type: product\|slug: vision)$" docs/product/vision.md` → 2 líneas | AC-1 |
| 3 | Las seis secciones de origen están presentes | `vision.md` contiene los encabezados `## Problema que resolvemos`, `### Visión (elevator pitch)`, `### Beneficios clave`, `## Criterios de éxito`, `### Restricciones`, `### Fuera de alcance (Non-Goals)` | AC-1 |
| 4 | Contenido íntegro, sin resumir | Cada línea de ítem/párrafo de las seis secciones de `project-intent.md` (tomado de `git show HEAD:<ruta>` tras el borrado) aparece literal en `vision.md`: 2 párrafos + 7 + 4 + 3 + 3 + 6 ítems | AC-1, AC-2 |
| 5 | Criterios de éxito en sección propia | `## Criterios de éxito` existe y contiene exactamente los 3 ítems originales | AC-2 |
| 6 | Original eliminado | `test ! -e docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` | AC-3 |
| 7 | Sin wikilinks al nodo eliminado fuera de `03-stories/` | `grep -rn "\[\[PROJ-01-agile-sddf-project-intent\]\]" docs \| grep -v "docs/specs/03-stories/"` → vacío | AC-3 |
| 8 | Referencias redirigidas | `project.md` contiene `[[vision]]` en líneas de referencias (2 apariciones) y `- vision` en `related:`; `index.md` conserva la entrada `[[vision]]` | AC-3 |
| 9 | Sin wikilinks rotos nuevos | `memory-system check --root docs`: ninguna línea `[broken-wikilink]` sobre los archivos tocados o el slug eliminado; `problemas` ≤ 55, `broken-wikilink` ≤ 49 | AC-3 |
| 10 | Enlaces de documentación activa | `node scripts/check-doc-links.js` → `[OK]` | AC-3 |
| 11 | Trazabilidad visible | `vision.md` contiene `[[eliminar-specs-01-projects]]` y la mención `project-intent.md` en la nota de origen | CNF-1 |
| 12 | Encoding | primeros 3 bytes de `vision.md` ≠ `EF BB BF`; `grep -cE "Ã|ðŸ" docs/product/vision.md` → `0` | CNF-2 |
| 13 | Puntero raíz actualizado | `grep -n "project-intent.md" AGENTS.md` → vacío; `AGENTS.md` menciona `docs/product/vision.md` | AC-3 (consecuencia) |

## Risks / Trade-offs

- [El `index.md` sigue desactualizado en conteos y entradas de EPIC-21] → Fuera de alcance; se deja constancia y no se empeora.
  La próxima regeneración completa debería resolverse junto con el defecto del slug placeholder de STORY-103.
- [`substatus: TODO` en `vision.md` pese a estar completa] → Se mantiene la convención del scaffold; si la capa `product/` adopta
  estados significativos, lo decidirá otra historia.
- [Menciones textuales a `project-intent.md` en `project-plan.md`, `story-map.md`, `README.md`, `CHANGELOG.md` y skills] →
  Fuera de alcance explícito (sus propias historias de EPIC-21); no son wikilinks y no afectan a `check`.
- [`project-discovery` no encuentra `project-intent.md` en este repo] → Aceptado por la historia (F-3).
- [Error de copia al trasladar texto] → Mitigado por el contrato #4 contra `git show HEAD:` del original.

## Open Questions

Ninguna. Las ambigüedades detectadas se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-3 pide que "esas referencias apuntan a `[[vision]]`" también para `docs/index.md`, pero la entrada del
  índice describe un archivo de `specs/01-projects/` y la visión ya tiene su propia entrada `[[vision]]` en `### Producto`.
  Redirigir la línea crearía una entrada duplicada y mal ubicada.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño interpreta AC-3 para `index.md` como "se retira la entrada del nodo eliminado y la entrada
  `[[vision]]` existente es la referencia vigente" (D-3). Opcional: precisar el `Entonces` de AC-3 en `story.md`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: "`memory-system check` no reporta wikilinks rotos" no es alcanzable en términos absolutos: la línea base ya
  tiene 49 `broken-wikilink` ajenos a la historia (casi todos `[[ADR-0013-eliminar-specs-01-projects]]`, que no coincide con el
  slug real `eliminar-specs-01-projects` del ADR). La propia `story.md` usa esa forma rota.
- **Documento afectado**: story.md / design.md
- **Acción requerida**: el diseño verifica por delta (D-6, contrato #9) y usa el slug real en `vision.md` (D-2). Recomendado:
  corregir el wikilink al ADR en las historias de EPIC-21 (o el slug del ADR) en una historia aparte.

### CR-003
- **Tipo**: dependencia
- **Descripción**: `AGENTS.md:13` apunta a `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` como ubicación de la
  visión. La historia no lo menciona, pero el borrado lo vuelve falso.
- **Documento afectado**: story.md
- **Acción requerida**: incluido en el diseño (D-5, contrato #13). Opcional: añadir la mención a `story.md` (Notas).
