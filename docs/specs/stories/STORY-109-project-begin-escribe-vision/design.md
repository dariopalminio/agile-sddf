---
type: design
id: STORY-109
slug: STORY-109-project-begin-escribe-vision-design
title: "Design: project-begin escribe la intención en product/vision.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-109
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-109-project-begin-escribe-vision
  - STORY-104-migrar-project-intent-a-vision
  - eliminar-specs-01-projects
  - vision
---

<!-- Referencias -->
[[STORY-109-project-begin-escribe-vision]] · [[STORY-104-migrar-project-intent-a-vision]] · [[eliminar-specs-01-projects]] · [[vision]]

# Diseño técnico: `project-begin` escribe la intención en `product/vision.md`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) mueve `project-intent.md` a `docs/product/vision.md`. STORY-104 migra el contenido
de este repositorio; esta historia cambia el **escritor**: `/project-begin` y su agente `project-pm`.

Estado actual (medido el 2026-10-07):

| Pieza | Estado |
|---|---|
| `skills/project-begin/SKILL.md` | Resuelve un `PROJ_DIR` en `$SPECS_BASE/specs/01-projects/` (WIP=1 por `substatus: IN-PROGRESS`, o deriva `PROJ-NN-<kebab>` del título), lee `project-intent-template.md` (central → seed) y delega en `project-pm`, que escribe `01-projects/$PROJ_DIR/project-intent.md`. El Paso 5 solo comprueba que el archivo existe: nadie lleva el documento a `DONE` (el README lo promete; solo el gate de `project-flow` lo hace). |
| `skills/project-begin/README.md` | Documenta como salida `01-projects/PROJ-ID-nombre/project-intent.md`. |
| `skills/project-begin/assets/project-intent-template.md` | Seed del template: 6 secciones `##` (`Definición del Problema`, `Visión (elevator pitch)`, `Beneficios Clave`, `Criterios de Éxito`, `Restricciones`, `Fuera de alcance (Non-Goals)`), placeholders `[...]` y frontmatter `type: project`, `id: <PROJ-NN>`, `status: BEGINNING`. Idéntico byte a byte a `docs/templates/project-intent-template.md`. |
| `skills/project-begin/evals/` | No existe. `config/eval-exemptions.json` exime a `project-begin` ("pendiente de fixtures deterministas"). `scripts/verify-eval-inventory.js` falla si un skill tiene `evals.json` **y** sigue exento. |
| `agents/project-pm.agent.md` | 12 referencias a `01-projects`. Estado *Begin Intention* con rutas de entrada/salida fijas a `01-projects/project-intent.md` (incoherentes con las que inyecta el skill: sin `$PROJ_DIR`). Estado *Discovery* con rutas fijas a `01-projects/project-intent.md` y `01-projects/project.md`. Escribe `date:` en el frontmatter. |
| `docs/product/vision.md` | Semilla de `memory-system`: `type: product`, `slug: vision`, `status: IN-PROGRESS`, `substatus: TODO`; 3 secciones (`Problema que resolvemos`, `Propuesta de valor`, `Alcance y límites`) con marcadores `[Por completar: …]`. |
| Estructura destino de la visión | Fijada por STORY-104 (design D-1, ya planificado): `## Problema que resolvemos` · `## Propuesta de valor` (`### Visión (elevator pitch)`, `### Beneficios clave`) · `## Criterios de éxito` · `## Alcance y límites` (`### Restricciones`, `### Fuera de alcance (Non-Goals)`). |

Registros que enumeran el template por nombre (consumidores del renombrado, `grep -rn project-intent-template`):

| Archivo | Uso |
|---|---|
| `skills/memory-system/scripts/memory-system.js:126` | `SHARED_TEMPLATES` (`{ name, owner: 'project-begin' }`), copiados por `scaffold` |
| `test/memory-system.test.js:319` | `NINE_TEMPLATES`: el árbol que `scaffold` debe garantizar (usa `CLI_ROOT = REPO_ROOT`, es decir, los seeds reales) |
| `skills/memory-system/references/memory-rules.md:172` | Tabla de archivos gestionados del scaffold |
| `skills/memory-system/assets/scaffold/templates/README.md:18` | Semilla del README de la capa `templates/` |
| `skills/memory-system/evals/evals.json` (TC-007) | Texto de `description` (no es una aserción) |
| `skills/sddf-init/SKILL.md:111,200,258` | Tabla del Paso 2b y dos ejemplos de salida |
| `skills/skill-preflight/SKILL.md:107` | Verificación 3 — conjunto fijo de templates centrales |
| `docs/templates/README.md:6` | Índice de la capa en este repo |
| `skills/project-flow/SKILL.md:90,96` | Resolución del template de su etapa Begin (fuera de alcance: STORY-113, ver CR-002) |
| `docs/architecture/memory-system.md:127,329` | Documentación canónica (fuera de alcance: STORY-116, ver CR-003) |

Stack aplicable (constitución + `package.json`): Markdown para skills/agentes/templates; Node.js solo en `memory-system.js` y
en los tests (`node --test`). `docs/templates/` está excluido del índice de `memory-system` (`EXCLUDED_DIRS`), así que el
`slug: vision` del template no colisiona con el nodo real `vision`. Los espejos `.claude/skills/` y `.agents/skills/` son
salida de instalación ignorada por git: no se tocan.

## Goals / Non-Goals

**Goals:**

- `/project-begin` escribe `$SPECS_BASE/product/vision.md` con todas las secciones del template de visión y, tras la
  confirmación del desarrollador, `substatus: DONE`; nunca crea `specs/01-projects/` ni `PROJ-*`. // satisface: AC-1
- El comportamiento depende del `substatus` de `vision.md`: `TODO` → entrevista completa; `IN-PROGRESS` → solo secciones
  pendientes; `DONE` → `Actualizar` / `Cancelar` sin tocar el archivo hasta la elección. // satisface: AC-2
- `skills/project-begin/` y `agents/project-pm.agent.md` no contienen `01-projects`, `project-intent` ni `PROJ-`, y
  `project-begin` tiene evals que pasan con `npm run test:eval`. // satisface: AC-3
- Las preguntas se derivan en runtime de un template de visión que reemplaza a `project-intent-template.md`. // satisface: CNF-1
- `vision.md` se escribe en UTF-8 sin BOM. // satisface: CNF-2

**Non-Goals:**

- Cambiar `project-discovery` (STORY-110) o `project-flow` (STORY-113), incluida la línea de `project-flow` que resuelve el
  template de su etapa Begin (CR-002).
- Cambiar la semilla `skills/memory-system/assets/scaffold/product/vision.md` (CR-001).
- Migrar el `project-intent.md` existente (STORY-104).
- Actualizar `docs/architecture/memory-system.md`, `docs/constitution.md` (§7 y §13 aún citan `PROJ-NN` y `01-projects`) o
  `scripts/check-doc-links.js` (CR-003).
- Rediseñar el estado *Discovery* de `project-pm` más allá de retirar sus rutas fijas (D-6).

## Decisions

### D-1 — Nombre y ubicación del template: `vision-template.md` // satisface: CNF-1, AC-3

| Copia | Antes | Después |
|---|---|---|
| Seed (dueño) | `skills/project-begin/assets/project-intent-template.md` | `skills/project-begin/assets/vision-template.md` |
| Central de este repo | `docs/templates/project-intent-template.md` | `docs/templates/vision-template.md` |

Ambas copias se renombran con `git mv` y se reescriben con el mismo contenido (byte a byte, como hoy). El dueño sigue
siendo `project-begin` (ADR-0001). El nombre sigue la convención de los demás templates: `<archivo canónico>-template.md`
(`story-template.md` → `story.md`, `epic-template.md` → `epic.md`).

**Alternativas rechazadas:**

- *Conservar el nombre `project-intent-template.md` con contenido nuevo:* `SKILL.md` seguiría nombrándolo y AC-3 exige que
  `project-intent` no aparezca en `skills/project-begin/`; además el nombre mentiría sobre su salida.
- *`product-vision-template.md`:* rompe la convención `<canónico>-template.md`; el prefijo de capa no lo usa ningún otro template.
- *Mantener ambos templates durante una transición:* reintroduce dos estructuras de visión, justo lo que la historia prohíbe.

### D-2 — Estructura del template de visión // satisface: CNF-1, AC-1, AC-2

El template reproduce la estructura destino de STORY-104 (D-1) para que un `vision.md` migrado y uno escrito por
`/project-begin` tengan la misma forma. Contenido por sección: un comentario guía `<!-- … -->` (de donde `project-pm`
deriva la pregunta, como hoy) y marcadores `[Por completar: …]`, la misma convención de la semilla de `memory-system`.
Las guías se trasladan de las secciones equivalentes de `project-intent-template.md` (la lista de categorías de software del
elevator pitch, las preguntas sugeridas), adaptadas solo en los encabezados.

| Encabezado | Nivel | Contenido placeholder | Origen de la guía |
|---|---|---|---|
| `# Visión del producto` | título | — | — |
| `Problema que resolvemos` | `##` | 1 marcador de párrafo | `Definición del Problema` |
| `Propuesta de valor` | `##` | — (contenedor) | — |
| `Visión (elevator pitch)` | `###` | 7 ítems `- **Para:**` · `**Quiénes:**` · `**Nuestro producto:**` · `**Es un:**` · `**Que provee:**` · `**A diferencia de:**` · `**Nuestro producto:**`, cada uno con marcador | `Visión (elevator pitch)` |
| `Beneficios clave` | `###` | 3 ítems con marcador | `Beneficios Clave` |
| `Criterios de éxito` | `##` | 3 ítems `- [ ]` con marcador | `Criterios de Éxito` |
| `Alcance y límites` | `##` | — (contenedor) | — |
| `Restricciones` | `###` | 3 ítems `**Technical**` · `**Time**` · `**Resources**` con marcador | `Restricciones` |
| `Fuera de alcance (Non-Goals)` | `###` | 2 ítems con marcador | `Fuera de alcance (Non-Goals)` |
| pie `Volver al mapa: [[index]].` | — | literal | semilla `memory-system` |

Frontmatter del template (claves de la semilla; comentarios `# escritor:` como en `epic-template.md`):

| Clave | Valor en el template | Escritor |
|---|---|---|
| `type` | `product` | `project-begin` (`project-pm`), valor fijo |
| `slug` | `vision` | valor fijo |
| `title` | `"Visión del producto"` | valor fijo |
| `status` | `IN-PROGRESS` | valor de la semilla; se conserva el del archivo existente |
| `substatus` | `TODO` | `project-pm`: `IN-PROGRESS` al escribir · `project-begin`: `DONE` tras la confirmación (D-5) |
| `parent` | `null` | valor fijo |
| `created` | `<YYYY-MM-DD>` | se conserva el del archivo existente; si no existe, la fecha actual |
| `updated` | `<YYYY-MM-DD>` | todo skill que edite el archivo |

Desaparecen `id`, `alwaysApply` y `related` del frontmatter de intención: la capa `product/` no es un work item
(ADR-0013) y su semilla no los tiene.

**Alternativas rechazadas:**

- *Template con las tres secciones de la semilla actual:* pierde `Criterios de éxito` y el elevator pitch, que STORY-104
  conserva; habría dos formas de visión.
- *Template con las seis secciones planas de `project-intent-template.md`:* contradice la estructura que STORY-104 deja en
  `vision.md`.
- *Placeholders `[...]` del template antiguo:* dos convenciones de marcador para el mismo documento (semilla vs. template).

### D-3 — Resolución del estado por `substatus` de `vision.md` // satisface: AC-1, AC-2

El Paso 0b (`PROJ_DIR`) y el Paso 1 (WIP=1 sobre `01-projects/`) se eliminan. Con un solo proyecto por raíz `docs/`,
el `substatus` de `$VISION_PATH = $SPECS_BASE/product/vision.md` decide el modo:

| Estado de `vision.md` | Modo (`$MODE`) | Comportamiento del skill |
|---|---|---|
| No existe | `full` | Crea `$SPECS_BASE/product/` si falta y delega la entrevista completa |
| `substatus: TODO` | `full` | Delega la entrevista completa (el contenido no marcador existente se ofrece como pre-relleno) |
| `substatus: IN-PROGRESS` | `resume` | Calcula `$PENDING_SECTIONS` (D-4); si está vacío, salta directo al gate (D-5); si no, delega solo esas secciones |
| `substatus: DONE` | — | `AskUserQuestion` con `Actualizar` / `Cancelar`. `Cancelar` → termina sin escribir. `Actualizar` → `$MODE = full` |
| `substatus` ausente o con otro valor | `full` | Emite `⚠️ substatus no reconocido en vision.md: <valor>; se trata como TODO` |

El archivo no se lee ni se escribe en ningún otro lugar antes de esta decisión, de modo que en `DONE` no hay escritura
hasta la elección (AC-2).

**Alternativas rechazadas:**

- *Conservar WIP=1 y las opciones `Sobrescribir` / `Retomar`:* con un solo documento no hay "otro proyecto activo";
  `Sobrescribir` en `IN-PROGRESS` contradice AC-2 (solo secciones pendientes).
- *Que `project-pm` lea el `substatus` y decida:* el agente se acopla a la regla de estados; la constitución (§6) pone la
  orquestación en el skill y los criterios en el agente.

### D-4 — Regla de sección pendiente // satisface: AC-2

Unidad: **sección hoja** del template (un `##` sin `###` hijos, o un `###`). Una sección hoja está pendiente si:

1. no existe en `vision.md` con el mismo encabezado, o
2. su cuerpo contiene `[Por completar`, o
3. su cuerpo conserva alguna línea idéntica a la línea placeholder del template (placeholder sin reemplazar).

El skill calcula la lista en orden del template y la pasa como `$PENDING_SECTIONS`. La regla 1 cubre la semilla de
`memory-system`, que no tiene `Criterios de éxito` ni las subsecciones: esas secciones se tratan como pendientes y se
escriben en la posición que dicta el template (AC-1: "completas todas las secciones del template").

**Alternativas rechazadas:**

- *Solo el marcador `[Por completar`:* AC-2 nombra también "un placeholder"; un ítem copiado del template sin editar pasaría
  por completo.
- *Granularidad por `##`:* una sección contenedor con una subsección completa y otra pendiente obligaría a repreguntar la
  completa.

### D-5 — Reparto de responsabilidades y gate de confirmación // satisface: AC-1, AC-2

| Responsable | Hace |
|---|---|
| `project-begin` (skill) | Resuelve raíz, `$VISION_PATH`, `$TEMPLATE_PATH`, `$MODE`, `$PENDING_SECTIONS`; delega; tras el agente muestra el resumen y pregunta `Confirmar` / `Dejar en revisión`; con `Confirmar` edita solo `substatus: DONE` y `updated` |
| `project-pm` (agente) | Conduce la entrevista (fases de captura y refinamiento, sin cambios de método) y escribe `vision.md` completo con `substatus: IN-PROGRESS` |

`Dejar en revisión` termina con `vision.md` en `IN-PROGRESS`: el siguiente `/project-begin` entra en `resume`, y si no
quedan secciones pendientes va directo al gate. Mensaje final con `Confirmar`:
`✅ Visión del producto completa: $VISION_PATH · Siguiente comando: /project-discovery`.

**Alternativas rechazadas:**

- *Que `project-pm` escriba `DONE` directamente:* sin gate humano, AC-1 ("confirma el resultado") no se cumple y se rompe el
  patrón de gates de `project-flow`.
- *Dejar `IN-PROGRESS` y que solo `project-flow` lo cierre (comportamiento actual):* `/project-begin` aislado nunca
  alcanzaría `DONE` y `project-discovery` (STORY-110 AC-3) se bloquearía.

### D-6 — Contrato de `project-pm` independiente de rutas // satisface: AC-3

El agente deja de nombrar rutas: todas le llegan resueltas por el orquestador, como ya ocurre con `$TEMPLATE_PATH`.

| Estado | Entradas inyectadas | Salida |
|---|---|---|
| *Begin Intention* (renombrado *Visión*) | `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE` (`full` \| `resume`), `$PENDING_SECTIONS` (solo `resume`) | escribe `$VISION_PATH` |
| *Discovery* | `$VISION_PATH` (documento de visión/intención de entrada), `$TEMPLATE_PATH` (estructura objetivo), `$OUTPUT_PATH` | escribe `$OUTPUT_PATH` |

Reglas de escritura del estado *Visión*:

- Conserva encabezados, niveles y orden del template; omite los comentarios `<!-- -->` y los `# escritor:` del frontmatter.
- Si `vision.md` existe, conserva `type`, `slug`, `status`, `parent` y `created`; actualiza `updated`; escribe
  `substatus: IN-PROGRESS`. No escribe `date:` ni `id:`.
- En `resume` no repregunta ni modifica secciones fuera de `$PENDING_SECTIONS`.
- Contenido inferido → `[inferido]`; sin respuesta → Protocolo de Resiliencia vigente (`[inferido: sin respuesta del usuario]`
  y `## Inferencias aplicadas`).
- UTF-8 sin BOM (regla explícita, como en los demás artefactos).

En *Discovery* solo se sustituyen las rutas fijas por las variables y las menciones a `project-intent`/`project-intent-template`
por "documento de visión" (`$VISION_PATH`); el método de discovery no cambia. `project-discovery` y `project-flow` ya pasan
rutas explícitas en su instrucción al agente, así que siguen funcionando hasta STORY-110/113.

**Alternativas rechazadas:**

- *Cambiar las rutas fijas del agente a `docs/product/vision.md`:* acopla el agente a la raíz `docs` (ignora `SDDF_ROOT`) y
  rompe a `project-discovery`, que todavía lee `project-intent.md`.
- *Dejar intacto el estado Discovery:* AC-3 busca en todo `agents/project-pm.agent.md`.
- *Partir `project-pm` en dos agentes:* cambio estructural sin necesidad actual (YAGNI).

### D-7 — Registro del template renombrado // satisface: CNF-1, AC-3

ADR-0001 exige una tabla de templates compartidos coherente en todos sus consumidores; STORY-115 deja explícitamente a
STORY-109 la siembra del template de visión. Se sustituye `project-intent-template.md` por `vision-template.md` en:

| Archivo | Cambio |
|---|---|
| `skills/memory-system/scripts/memory-system.js` | entrada de `SHARED_TEMPLATES` (`owner: 'project-begin'`) |
| `test/memory-system.test.js` | `NINE_TEMPLATES` |
| `skills/memory-system/references/memory-rules.md` | fila `templates/…` de la tabla de archivos gestionados |
| `skills/memory-system/assets/scaffold/templates/README.md` | lista de templates con dueño |
| `skills/memory-system/evals/evals.json` | texto de `description` de TC-007 |
| `skills/sddf-init/SKILL.md` | tabla del Paso 2b y los dos ejemplos de salida |
| `skills/skill-preflight/SKILL.md` | Verificación 3 |
| `docs/templates/README.md` | lista de la capa |

No hay migración de proyectos ya inicializados: un `docs/templates/project-intent-template.md` existente queda como archivo
del usuario (copia-si-falta nunca borra) y el siguiente `scaffold`/`sddf-init` crea `vision-template.md` (P7). Se documenta
en el CHANGELOG.

**Alternativas rechazadas:**

- *Actualizar solo `skills/project-begin/`:* `memory-system scaffold` seguiría copiando un seed inexistente
  (`[WARNING]`) y `test/memory-system.test.js` fallaría.
- *Alias `project-intent-template.md` → `vision-template.md` en el motor:* maquinaria de compatibilidad para un template que
  desaparece; ADR-0013 ya declara el cambio como breaking.

### D-8 — Evals de `project-begin` // satisface: AC-3

Se crea `skills/project-begin/evals/evals.json` (formato `skill`/`version`/`description`/`cases`, IDs `TC-NNN`,
`expected.contains`/`not_contains`, `threshold`) y se retira la entrada `project-begin` de `config/eval-exemptions.json`
(obligatorio: `verify-eval-inventory.js` rechaza un skill con evals que sigue exento). Los casos describen el entorno en
`input.context`, como el resto de skills interactivos (el runner ejecuta `claude -p` en solo lectura; la entrevista cae en
el nivel de inferencia del Protocolo de Resiliencia). Cobertura mínima:

| Caso | Escenario | Aserciones clave |
|---|---|---|
| Visión semilla, sin `01-projects/` | AC-1 | contiene `product/vision.md`, `Criterios de éxito`, `DONE`, `/project-discovery`; no contiene `01-projects`, `PROJ-`, `project-intent` |
| `substatus: TODO` | AC-2 | entrevista completa sobre todas las secciones |
| `substatus: IN-PROGRESS` con 2 secciones pendientes | AC-2 | nombra solo las secciones pendientes |
| `substatus: DONE` | AC-2 | contiene `Actualizar` y `Cancelar`; no anuncia escritura |
| Sin template central | CNF-1 | usa el seed `vision-template.md` con `⚠️` |
| Sin template central ni seed | CNF-1 | `❌` y no escribe |

### D-9 — Superficie de `skills/project-begin/` // satisface: AC-3

`SKILL.md` (frontmatter `description`, objetivo, entrada, precondiciones, dependencias, modos, reglas, flujo y salida),
`README.md` (`Produces`) y `assets/` quedan sin `01-projects`, `project-intent` ni `PROJ-`. El flujo resultante:
Paso 0 (raíz, sin cambios) → Paso 1 (template: central → seed, D-1) → Paso 2 (estado y modo, D-3/D-4) →
Paso 3 (delegar a `project-pm`, D-6) → Paso 4 (gate de confirmación, D-5).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Template de visión (seed) | renombrar + reescribir | `skills/project-begin/assets/vision-template.md` | CNF-1, AC-1, AC-3 |
| Template de visión (central) | renombrar + reescribir | `docs/templates/vision-template.md` | CNF-1 |
| Skill `project-begin` | modificar | `skills/project-begin/SKILL.md` | AC-1, AC-2, AC-3 |
| README de `project-begin` | modificar | `skills/project-begin/README.md` | AC-3 |
| Evals de `project-begin` | crear | `skills/project-begin/evals/evals.json` | AC-3 |
| Inventario de excepciones de evals | modificar (quitar 1 entrada) | `config/eval-exemptions.json` | AC-3 |
| Agente `project-pm` | modificar | `agents/project-pm.agent.md` | AC-1, AC-2, AC-3, CNF-2 |
| Registros del template compartido | modificar | los 8 archivos de D-7 | CNF-1 |
| CHANGELOG | modificar (`[Unreleased]`) | `CHANGELOG.md` | — (trazabilidad de release; breaking) |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación `project-begin` → `project-pm` | Instrucción con `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE`, `$PENDING_SECTIONS` ya sustituidos; el agente no resuelve rutas | AC-1, AC-2, AC-3 |
| Salida de `project-pm` (Visión) | `$VISION_PATH` con estructura del template, `substatus: IN-PROGRESS`, UTF-8 sin BOM | AC-1, CNF-2 |
| Gate de `project-begin` | `AskUserQuestion`: `Confirmar` (→ `substatus: DONE`) · `Dejar en revisión` (sin cambios) | AC-1 |
| Gate de visión cerrada | `AskUserQuestion`: `Actualizar` (→ `$MODE = full`) · `Cancelar` (sin escritura) | AC-2 |
| Template compartido | `vision-template.md`, dueño `project-begin`, resolución central → seed | CNF-1 |
| Precondición para STORY-110 | `vision.md` con `substatus: DONE` es la señal de "Begin terminado" | AC-1 |

## Esquema de datos

`$PENDING_SECTIONS`: lista ordenada de encabezados de secciones hoja tal como aparecen en el template
(p. ej. `Criterios de éxito`, `Restricciones`).

Esqueleto de `vision.md` producido (frontmatter sin comentarios):

```
---
type: product
slug: vision
title: "Visión del producto"
status: <conservado | IN-PROGRESS>
substatus: IN-PROGRESS → DONE (gate)
parent: null
created: <conservado | hoy>
updated: <hoy>
---
# Visión del producto
## Problema que resolvemos
## Propuesta de valor
### Visión (elevator pitch)
### Beneficios clave
## Criterios de éxito
## Alcance y límites
### Restricciones
### Fuera de alcance (Non-Goals)
Volver al mapa: [[index]].
```

Si `vision.md` contenía otros bloques (p. ej. la nota de origen que agrega STORY-104 bajo el título), se conservan en su
posición; el agente solo reescribe secciones del template.

## Flujos clave

### F-1 — Primera ejecución sobre la semilla (AC-1)

1. Paso 0 resuelve `SPECS_BASE`. Paso 1 resuelve `$TEMPLATE_PATH`.
2. Paso 2 lee `vision.md`: `substatus: TODO` → `$MODE = full`.
3. Paso 3 delega; `project-pm` entrevista (captura + refinamiento) y escribe las 6 secciones hoja con `substatus: IN-PROGRESS`.
4. Paso 4 muestra el resumen; el desarrollador elige `Confirmar` → `substatus: DONE`. Ningún paso referencia `specs/`.

### F-2 — Retoma (AC-2, `IN-PROGRESS`)

1. Paso 2 calcula `$PENDING_SECTIONS` con D-4.
2. Vacío → Paso 4 directo. No vacío → Paso 3 con `$MODE = resume`; el agente pregunta solo esas secciones y conserva el resto.

### F-3 — Visión cerrada (AC-2, `DONE`)

1. Paso 2 pregunta `Actualizar` / `Cancelar` antes de cualquier escritura.
2. `Cancelar` → fin, archivo intacto. `Actualizar` → F-1 desde el paso 3 con el contenido actual como pre-relleno.

### F-4 — Degradación (P7)

- Template central ausente → seed con `⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo`.
  Ambos ausentes → `❌ Template vision-template.md no encontrado` y fin sin escribir.
- `product/` ausente → se crea al escribir.
- Sin respuesta del usuario → Protocolo de Resiliencia del agente; el gate no se da por confirmado: `vision.md` queda en
  `IN-PROGRESS`.
- El agente falla o no escribe → el skill informa y sugiere re-ejecutar `/project-begin`; el estado previo del archivo se
  conserva (el agente escribe una sola vez, al final).

## Decisiones de complejidad justificada

- **Regla de sección pendiente con tres condiciones (D-4).** Con solo el marcador `[Por completar` bastaría para el template
  nuevo, pero la semilla de `memory-system` no tiene todas las secciones (condición 1) y AC-2 nombra explícitamente los
  placeholders (condición 3).
- **Gate en el skill en vez de en el agente (D-5).** Añade un paso al skill, pero es el único modo de que `/project-begin`
  aislado deje `DONE` respetando el gate humano que ya aplica `project-flow`.
- **Tocar el estado Discovery de `project-pm` (D-6).** Lo exige AC-3; se limita a parametrizar rutas, sin cambiar el método,
  para no invadir STORY-110.
- **Ocho registros fuera de `project-begin` (D-7).** El renombrado del template es la consecuencia directa de CNF-1; dejar
  los registros con el nombre viejo rompe `npm test` y el scaffold.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin rastro del modelo de proyectos | `grep -rnE "01-projects\|project-intent\|PROJ-" skills/project-begin agents/project-pm.agent.md` → vacío | AC-3 |
| 2 | Evals de `project-begin` pasan | `npm run test:eval -- project-begin` → exit 0 | AC-3 |
| 3 | Inventario de evals coherente | `npm run verify:eval-inventory` → `[OK]` | AC-3 |
| 4 | Template renombrado en sus dos copias e idéntico | existen `skills/project-begin/assets/vision-template.md` y `docs/templates/vision-template.md`, `diff` vacío; no existe ningún `project-intent-template.md` en `skills/` ni `docs/templates/` | CNF-1 |
| 5 | Estructura del template = STORY-104 | encabezados del template, en orden: los 4 `##` y 4 `###` de D-2 | CNF-1, AC-1 |
| 6 | Registros actualizados | `grep -rn "project-intent-template" skills test docs/templates` → solo `skills/project-flow/SKILL.md` (CR-002) | CNF-1 |
| 7 | Scaffold y tests | `npm test` → exit 0 (incluye `NINE_TEMPLATES` con `vision-template.md`) | CNF-1 |
| 8 | El flujo no referencia `specs/` | `SKILL.md` no contiene `specs/` en su flujo; la única ruta de salida es `$SPECS_BASE/product/vision.md` | AC-1 |
| 9 | Modos por `substatus` | `SKILL.md` Paso 2 contiene la tabla de D-3 (`TODO`, `IN-PROGRESS`, `DONE`, ausente) y la regla de D-4 | AC-2 |
| 10 | Gate de confirmación | `SKILL.md` Paso 4 escribe `substatus: DONE` solo tras `Confirmar` | AC-1 |
| 11 | Encoding | `project-pm` declara UTF-8 sin BOM; los archivos tocados no empiezan con `EF BB BF` ni contienen `Ã` / `ðŸ` | CNF-2 |
| 12 | Enlaces de documentación | `npm run verify:links` → `[OK]` | — |

## Risks / Trade-offs

- [`project-flow` (etapa Begin) busca `project-intent-template.md` y se detiene si no existe] → Aceptado hasta STORY-113
  (CR-002). Las historias se integran en la rama de la épica; no se publica en medio.
- [La semilla de `memory-system` crea `vision.md` con 3 secciones] → D-4 trata las faltantes como pendientes; la forma
  final siempre es la del template. Divergencia de semilla registrada en CR-001.
- [En este repo, tras STORY-104, `vision.md` queda completo pero con `substatus: TODO`] → `/project-begin` haría una entrevista
  completa con todo pre-rellenado; el gate impide cerrarlo sin revisión. Ajustar el `substatus` es decisión de STORY-104.
- [Proyectos ya inicializados conservan `docs/templates/project-intent-template.md` huérfano] → Copia-si-falta no borra;
  se documenta en el CHANGELOG como breaking change con el paso manual.
- [Evals de un skill interactivo en modo no interactivo] → Los casos verifican decisiones de flujo (modo, rutas, mensajes),
  no el contenido de la entrevista.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en el diseño y las dependencias quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la historia exige que el template coincida "con la semilla de `memory-system`", pero la semilla
  `skills/memory-system/assets/scaffold/product/vision.md` tiene solo 3 secciones y su actualización es un Non-Goal. Ninguna
  historia de EPIC-21 la cubre explícitamente (STORY-115 no menciona `vision.md`).
- **Documento afectado**: story.md (STORY-115)
- **Acción requerida**: el diseño garantiza la forma final por D-4. Recomendado: añadir a STORY-115 que la semilla de
  `vision.md` adopte los encabezados de `vision-template.md`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `skills/project-flow/SKILL.md:90,96` resuelve `project-intent-template.md` (central y seed de
  `project-begin`). Tras el renombrado, su etapa Begin se detiene con "template no encontrado".
- **Documento afectado**: story.md (STORY-113)
- **Acción requerida**: STORY-113 debe incluir el cambio a `vision-template.md` (o delegar la etapa Begin en `/project-begin`).

### CR-003
- **Tipo**: dependencia
- **Descripción**: `docs/architecture/memory-system.md` (§3 y tabla de dueños), `docs/constitution.md` (§7 `PROJ-NN`, §13
  `01-projects`) y la expresión de `scripts/check-doc-links.js:172` siguen nombrando el modelo de proyectos.
- **Documento afectado**: story.md (STORY-116)
- **Acción requerida**: incluirlos en la actualización de documentación canónica.
