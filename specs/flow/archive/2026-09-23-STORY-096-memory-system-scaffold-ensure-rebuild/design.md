---
alwaysApply: false
type: design
id: STORY-096
slug: STORY-096-memory-system-scaffold-ensure-rebuild-design
title: "Design: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-096
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-095-memory-system-index-alias
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - STORY-099-sddf-init-level-full
  - STORY-043-header-aggregation
  - memory-system
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-095-memory-system-index-alias]]
[[STORY-097-memory-system-check-ci]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-099-sddf-init-level-full]]
[[STORY-043-header-aggregation]]
[[memory-system]]

# Diseño técnico: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

## Context

`docs/architecture/memory-system.md` (ARCH-MEMORY) define once capas más `constitution.md`,
pero ningún skill las materializa: `sddf-init` crea solo `specs/01..03` y `templates/` (con
cinco templates copiados de sus skills dueños), y este mismo repositorio carece de
`docs/product/` y tiene `docs/requirements/` vacío. Tampoco existe un modo de regeneración
controlada: la única forma de "empezar de cero" es borrar a mano.

Esta historia añade al skill `memory-system` (creado en STORY-095 con el motor
`scripts/memory-system.js`, el subcomando `index` y la tabla `HARNESS_PROFILES`) los modos
que escriben la estructura: `scaffold` (crear lo faltante), `ensure` (scaffold + index, modo
por defecto) y `rebuild` (regenerar con `--force`). Sustituye la rama informativa de AC-7 de
STORY-095 ("modo `ensure` aún no disponible").

Contexto técnico relevante (ya extraído en STORY-095; se repite lo que este diseño usa):

- Motor Node ≥ 18 solo con módulos `node:`; `SKILL.md` invoca
  `node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js <sub> --root <SPECS_BASE>`.
- Regla de idempotencia declarada de la constitución (patrón 11): los skills de
  inicialización no sobrescriben archivos existentes.
- Tabla de templates compartidos y regla `[WARNING] template no copiado: <nombre> (skill
  <dueño> no instalado)` del Paso 2b de `sddf-init` (ADR-0001: un dueño por template).
- `docs/adr/adr-template.md` existe hoy en `docs/adr/`, no en `docs/templates/`.
- `header-aggregation` en modo batch sobre un directorio ofrece la estrategia "saltar todos
  los conflictos" (procesa solo archivos sin frontmatter).
- Principio 13 de la constitución: todo campo declarado en un template de `docs/templates/`
  nombra a su escritor (`escritor:`); `requirement-template.md` no tiene escritor → no se crea.

Numeración de criterios usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `ensure` (default): detecta capas faltantes entre las 11, crea solo lo faltante, regenera `index.md`, no sobrescribe, reporta `creados N · preservados M · índice regenerado S/N`. |
| AC-2 | `scaffold`: crea `constitution.md`, `product/{vision,stakeholders,objectives}.md`, un `README.md` por capa faltante y 6 plantillas; no regenera `index.md`. |
| AC-3 | `rebuild` sin `--force`: mensaje literal y ningún archivo modificado. |
| AC-4 | `rebuild --force`: regenera capas gestionadas por el scaffold e `index.md`, advierte pérdida, conserva artefactos de autor. |
| AC-5 | Once capas + `constitution.md` en la raíz de `docs/`. |
| AC-6 | Seis plantillas: cinco copiadas del skill dueño (regla no bloqueante de `sddf-init`) + `adr-template.md`. |
| AC-7 | Idempotencia y preservación: dos ejecuciones = mismo resultado; solo `rebuild --force` sobrescribe, y solo archivos semilla. |
| AC-8 | `ensure --fix-frontmatter` invoca `header-aggregation` batch sin diálogos de merge; sin flag no se invoca; `header-aggregation` no cambia. |

NFR-1 idempotencia · NFR-2 preservación · NFR-3 trazabilidad del informe · NFR-4
independencia de stack · NFR-5 portabilidad · NFR-6 documentación (`memory-system.md`,
`sddf-commands-pipeline.md`).

## Goals / Non-Goals

**Goals:**

- Que cualquier proyecto obtenga la estructura completa de memoria con un comando, sin
  riesgo para lo existente.
- Que la regeneración destructiva exija confirmación y esté acotada a lo que el scaffold
  posee.
- Reutilizar el motor, el catálogo de capas y el informe de STORY-095; dejar el scaffold
  preparado para que STORY-098 omita capas o mapee archivos por harness y STORY-099 lo
  invoque desde `sddf-init`.

**Non-Goals:**

- Adaptación por harness (`skipLayers`, `mappings`) → STORY-098; aquí `scaffold` aplica el
  layout completo para todo harness.
- Modo `check` → STORY-097. Integración con `sddf-init` → STORY-099.
- Cambios funcionales en `header-aggregation`.
- Capa `rfcs/` y `requirement-template.md`.
- Borrar archivos: ningún modo elimina nada, ni siquiera `rebuild --force`.

## Decisions

### D-1 — `scaffold` es un subcomando del motor que copia un árbol semilla si falta

// satisface: AC-2, AC-5, AC-7, NFR-1, NFR-2, NFR-3, NFR-4

Se añade el subcomando `scaffold` a `scripts/memory-system.js`. Su fuente es
`skills/memory-system/assets/scaffold/`, un árbol que refleja el destino:

```
assets/scaffold/
├── constitution.md
├── product/{README.md, vision.md, stakeholders.md, objectives.md}
├── requirements/README.md
├── specs/README.md            (+ 01-projects/, 02-epics/, 03-stories/ vacíos con .gitkeep)
├── domains/README.md
├── architecture/README.md
├── adr/README.md
├── policies/README.md
├── guardrails/README.md
├── guides/README.md
├── runbooks/README.md
└── templates/{README.md, adr-template.md}
```

El motor recorre el árbol y, por cada archivo, crea el destino solo si no existe
(`[CREADO]`), o lo deja intacto (`[PRESERVADO]`). Los directorios se crean según haga falta.
El catálogo `LAYERS` (once capas + raíz) que STORY-095 declara para el índice es el mismo
que `scaffold` usa para saber qué es "capa faltante"; no hay una segunda lista.

Las semillas llevan frontmatter conforme al esquema canónico de `header-aggregation`
(`type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`); el motor
sustituye `{date}` por la fecha de ejecución al copiar. Ninguna semilla declara campos con
`escritor:` (no son templates de generación, son documentos iniciales).

Con `--dry-run` el subcomando imprime el plan (`[CREARÍA]`/`[PRESERVARÍA]`) sin escribir.

Última línea del informe: `creados: N · preservados: M · omitidos por harness: 0`
(la tercera cifra queda en 0 hasta STORY-098, que rellena `skipLayers`).

Alternativas rechazadas: (a) generar las semillas con el LLM — no idempotente ni verificable;
(b) una lista de rutas en el código con contenido inline — separa estructura de contenido y
dificulta editar las semillas.

### D-2 — Las nueve plantillas: cinco del skill dueño + cuatro de autoría manual en la semilla

// satisface: AC-6, AC-7

> **Ampliado por CR-004** (de seis a nueve). Las cuatro de autoría manual —`adr-template.md`,
> `domain-template.md`, `guardrail-template.md`, `policy-template.md`— no tienen skill dueño y
> viajan en el árbol semilla, anotadas con `escritor: autoría manual` conforme a ADR-0012. La tabla
> de abajo cubre las cinco compartidas, que sí se copian en runtime desde su dueño.

Tras copiar el árbol semilla, `scaffold` aplica la misma tabla de templates compartidos y la
misma regla que el Paso 2b de `sddf-init`:

| Template | Origen |
|---|---|
| `story-template.md` | `$CLI_ROOT/skills/story-creation/assets/` |
| `epic-template.md` | `$CLI_ROOT/skills/epic-creation/assets/` |
| `project-template.md` | `$CLI_ROOT/skills/project-discovery/assets/` |
| `project-intent-template.md` | `$CLI_ROOT/skills/project-begin/assets/` |
| `project-plan-template.md` | `$CLI_ROOT/skills/project-planning/assets/` |
| `adr-template.md` | `assets/scaffold/templates/adr-template.md` (semilla propia, contenido de `docs/adr/adr-template.md`) |

Destino existente → `[PRESERVADO]`; origen ausente → `[WARNING] template no copiado: <nombre>
(skill <dueño> no instalado)` y continuar. El motor recibe `--cli-root <CLI_ROOT>` desde el
`SKILL.md` para localizar a los dueños; sin él, solo copia `adr-template.md` y avisa.

Alternativa rechazada: duplicar las cinco plantillas en `assets/scaffold/templates/` — rompe
ADR-0001 y obliga a mantener dos copias.

### D-3 — `ensure` es la composición `scaffold → [header-aggregation] → index` y pasa a ser el modo por defecto

// satisface: AC-1, AC-7, AC-8, NFR-3

En `SKILL.md`, la rama sin modo deja de mostrar el aviso de STORY-095 y ejecuta `ensure`:

1. `detect` (motor) → harness.
2. `scaffold` (motor) → informe `creados/preservados/omitidos`.
3. Solo con `--fix-frontmatter`: invocar el skill `header-aggregation` con el directorio
   `SPECS_BASE` como input y la estrategia batch "saltar todos los conflictos", de modo que
   solo se procesan archivos sin frontmatter y no se abre ningún diálogo de merge.
   `header-aggregation` no se modifica; la selección de estrategia la hace `memory-system`
   al invocarlo (D-6).
4. `index` (motor) → regenera `index.md`.
5. Informe final: `creados N · preservados M · índice regenerado: sí`.

Si el subcomando `index` no existe todavía (STORY-095 no implementada), el paso 4 se omite
con `⚠️ modo index no disponible — índice no regenerado` y el informe dice `índice
regenerado: no`. Si `node` no está en PATH, `SKILL.md` ejecuta scaffold e index inline con
las reglas de `references/memory-rules.md` y lo avisa.

Alternativa rechazada: que `ensure` normalice frontmatter siempre — contradice "no sobrescribe
ningún archivo existente" (AC-1) y mete interacción en el modo por defecto.

### D-4 — `rebuild` = gate `--force` + `scaffold --force` + `index`; sobrescribe solo semillas, nunca borra

// satisface: AC-3, AC-4, AC-7, NFR-2

`SKILL.md`, modo `rebuild`:

1. Sin `--force`: mostrar exactamente
   `❌ rebuild es destructivo. Añade --force para confirmar.` y terminar sin invocar el motor.
2. Con `--force`: mostrar
   `⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán.`,
   invocar `scaffold --force` y luego `index`.

`scaffold --force` en el motor sobrescribe **únicamente** los archivos que existen en
`assets/scaffold/` (constitución, `product/*.md`, `README.md` de cada capa,
`templates/README.md`, `adr-template.md`) y las cinco plantillas compartidas; los marca
`[SOBRESCRITO]`. No toca ningún otro archivo (ADRs, historias, guías, runbooks, policies
concretas) y no elimina nada. Informe: `creados: N · sobrescritos: S · preservados: 0 ·
omitidos por harness: 0`.

Alternativas rechazadas: (a) borrar `docs/` y recrear — destruye specs e historial, viola
"no-eliminación" heredada de `docs-wiki-builder`; (b) `rebuild` con confirmación interactiva
en lugar de flag — no sirve para automatización y la historia fija `--force`.

### D-5 — Diseño de las semillas: contenido mínimo que explica la capa y enlaza la arquitectura

// satisface: AC-2, AC-5

Cada `README.md` de capa contiene: título, propósito de la capa (una frase tomada de la tabla
§2 de `memory-system.md`), convención de nombres de sus artefactos y un wikilink
`[[memory-system]]`. `constitution.md` semilla reproduce las secciones del
`constitution.md` de este repositorio con los valores en blanco (`[Por completar]`).
`product/vision.md`, `stakeholders.md` y `objectives.md` tienen frontmatter `type: product`
y tres encabezados guía cada uno. `templates/README.md` explica que `docs/templates/` es la
capa de meta-artefactos (ADR-0007).

Regla: las semillas no contienen wikilinks a nodos que el scaffold no crea (evita "nodos
pendientes" recién scaffoldeado); `[[memory-system]]` solo se incluye en el README de
`architecture/` cuando ese archivo no forma parte del scaffold — por tanto no se incluye;
las semillas enlazan a `[[index]]`.

### D-6 — `header-aggregation` no cambia; `memory-system` elige la estrategia batch al invocarlo

// satisface: AC-8

La invocación desde `ensure --fix-frontmatter` pasa a `header-aggregation` el directorio
`SPECS_BASE` (activa su Paso 4, modo batch) y responde a sus dos preguntas con "Saltar todos
los conflictos" y "Sí" a la confirmación global, de forma que ningún archivo con frontmatter
se toca. La nota añadida en STORY-095 al `SKILL.md` de `header-aggregation` se amplía con
una línea: "invocado por `memory-system ensure --fix-frontmatter` en batch con estrategia
'saltar conflictos'".

### D-7 — Documentación

// satisface: NFR-6

- `docs/architecture/memory-system.md` §10 (creada en STORY-095): añadir los modos `scaffold`,
  `ensure`, `rebuild`, el árbol semilla, la lista de plantillas —nueve tras CR-004— (alinear §3 del árbol,
  que hoy lista `requirement-template.md` y no `project-intent`/`project-plan`), el alcance
  de `rebuild --force` y `rfcs/` como capa opcional no gestionada.
- `docs/guides/sddf-commands-pipeline.md` §0: `/memory-system` (ensure) como comando
  recomendado tras `sddf-init`.
- `README.md` y `CHANGELOG.md` 3.3.0: Added modos scaffold/ensure/rebuild.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Subcomando `scaffold` del motor | modificar (añadir) | `skills/memory-system/scripts/memory-system.js` | AC-2, AC-4, AC-5, AC-6, AC-7 |
| Árbol semilla | crear | `skills/memory-system/assets/scaffold/**` | AC-2, AC-5 |
| Plantilla ADR semilla | crear | `skills/memory-system/assets/scaffold/templates/adr-template.md` | AC-6 |
| Modos `ensure`, `scaffold`, `rebuild` en el skill | modificar | `skills/memory-system/SKILL.md` | AC-1, AC-3, AC-4, AC-8 |
| Reglas de memoria | modificar | `skills/memory-system/references/memory-rules.md` (sección "Scaffold y archivos gestionados") | AC-7 |
| Evals del skill | modificar (añadir casos) | `skills/memory-system/evals/evals.json` | AC-1, AC-3 |
| Fixtures | crear | `skills/memory-system/examples/sddf-partial/`, `examples/empty/` | AC-1, AC-2 |
| Tests del motor | modificar (añadir) | `test/memory-system.test.js` | AC-2, AC-4, AC-7 |
| `header-aggregation` (nota) | modificar | `skills/header-aggregation/SKILL.md` | AC-8 |
| Documentación | modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | NFR-6 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/memory-system [ensure] [--fix-frontmatter] [--harness h]` | Default. Secuencia D-3; informe `creados N · preservados M · índice regenerado sí/no`. | AC-1, AC-8 |
| `/memory-system scaffold [--dry-run] [--harness h]` | Solo `detect` + `scaffold`; no toca `index.md`. | AC-2 |
| `/memory-system rebuild [--force]` | Sin `--force`: mensaje literal y fin sin escrituras. Con `--force`: advertencia literal, `scaffold --force`, `index`. | AC-3, AC-4 |
| `node scripts/memory-system.js scaffold --root <SPECS_BASE> [--cli-root <CLI_ROOT>] [--dry-run] [--force]` | Imprime `[CREADO]/[PRESERVADO]/[SOBRESCRITO]/[CREARÍA]` por archivo y `[WARNING] template no copiado…`; última línea `creados: N · sobrescritos: S · preservados: M · omitidos por harness: K`; exit 0; exit 2 si la raíz o `assets/scaffold/` no existen. | AC-2, AC-4, AC-6, AC-7 |
| `assets/scaffold/**` | Árbol espejo del destino; `{date}` como único placeholder. | AC-2, AC-5 |
| `/header-aggregation <SPECS_BASE>` (batch, "saltar todos los conflictos") | Invocación existente sin cambios. | AC-8 |

## Esquema de datos

- **Entrada del scaffold**: `{ relPath, kind: seed | shared-template, owner?: string }` por
  archivo; las `shared-template` provienen de la tabla de D-2.
- **Resultado por archivo**: `{ relPath, action: created | preserved | overwritten | skipped | would-create, reason? }`.
- **Informe**: `{ created, overwritten, preserved, skippedByHarness, warnings[] }`.
- **Catálogo `LAYERS`**: compartido con `index` (STORY-095); `scaffold` lo usa para
  `missingLayers` en el informe de `ensure`.

## Flujos clave

### F-1 — `/memory-system` (ensure) en un proyecto parcial (AC-1, AC-7)

1. Resolver raíz y `CLI_ROOT`; `detect` → `sddf`.
2. `scaffold`: crea `product/*` y `requirements/README.md`; preserva 14; `[WARNING]` si un
   dueño de template falta.
3. Sin `--fix-frontmatter`: no se invoca `header-aggregation`.
4. `index`: regenera `index.md`.
5. Informe `creados 5 · preservados 14 · índice regenerado: sí`. Segunda ejecución:
   `creados 0 · preservados 19 · índice regenerado: sí`.

### F-2 — `/memory-system scaffold` en proyecto vacío (AC-2, AC-5, AC-6)

1. `detect` → `generic`.
2. `scaffold` crea `constitution.md`, 11 capas con README, `product/*`, 6 plantillas.
3. `index.md` no existe y sigue sin existir.

### F-3 — `rebuild` (AC-3, AC-4)

1. Sin `--force`: mensaje `❌ …`; hashes intactos.
2. Con `--force`: advertencia; `scaffold --force` sobrescribe semillas y plantillas; `index`
   regenera; `ADR-0001-*.md` y `STORY-*` intactos.

### F-4 — `ensure --fix-frontmatter` (AC-8)

1. Pasos 1–2 de F-1.
2. Invocar `header-aggregation docs/` en batch con "saltar todos los conflictos" y
   confirmación global; procesa solo archivos sin frontmatter.
3. `index` y el informe.

## Decisiones de complejidad justificada

- **Árbol semilla en `assets/` en lugar de una lista en código**: el contenido de once README
  y cuatro documentos es material editorial que debe poder revisarse sin tocar el motor.
- **`--cli-root` como parámetro del motor**: el motor no puede resolver `CLI_ROOT` por sí
  mismo (contrato v1 lo reserva al skill); pasarlo explícito evita duplicar la detección.
- **`rebuild` como composición y no como subcomando**: el gate `--force` es interacción, y la
  interacción vive en el `SKILL.md`; el motor solo conoce `scaffold --force`.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `ensure` ×2 sobre `examples/sddf-partial/`: segunda corrida `creados 0`, sin errores, índice regenerado | eval + test del motor | AC-1, AC-7 |
| 2 | `scaffold` en `examples/empty/` crea `constitution.md`, `product/{vision,stakeholders,objectives}.md`, 11 README, 6 plantillas; no crea `index.md` | test del motor (listado) | AC-2, AC-5, AC-6 |
| 3 | `scaffold --dry-run` no escribe y lista `[CREARÍA]` | test del motor | AC-2 |
| 4 | `rebuild` sin `--force`: mensaje literal y hashes intactos | eval + test | AC-3 |
| 5 | `rebuild --force`: semillas y plantillas restauradas, `ADR-*`/`STORY-*` intactos, índice regenerado, advertencia literal | test del motor (hashes) | AC-4, AC-7 |
| 6 | Dueño de template ausente → `[WARNING]` y exit 0 | test del motor con `--cli-root` vacío | AC-6 |
| 7 | `ensure --fix-frontmatter` procesa solo archivos sin frontmatter; sin flag no invoca `header-aggregation` | eval del skill | AC-8 |
| 8 | Ningún modo elimina archivos (conteo antes/después) | test del motor | AC-7 |
| 9 | `memory-system.md` y `sddf-commands-pipeline.md` documentan los tres modos; `verify:links` verde | grep + comando | NFR-6 |
| 10 | Guardrail `gr-skill-creation-checklist` verde (assets kebab-case, `SKILL.md` < 500 líneas) | comandos del guardrail | — |

## Risks / Trade-offs

- [`SKILL.md` crece con tres modos más y puede superar 500 líneas] → las secuencias se
  describen en tablas compactas; las reglas de archivos gestionados van a
  `references/memory-rules.md`.
- [Semillas con nombres no kebab-case (`README.md`)] → el guardrail solo exige kebab-case a
  profundidad 1 de `assets/`; los README viven en subdirectorios. Se documenta.
- [`rebuild --force` restaura `constitution.md` a plantilla en un proyecto real] → es el
  comportamiento pedido; la advertencia literal y la documentación lo dejan claro; el usuario
  recupera desde git.
- [STORY-095 no implementada al ejecutar esta] → degradación de D-3 (`índice regenerado: no`).
- [`header-aggregation` cambia su diálogo batch en el futuro] → la invocación de D-6 depende
  de los literales de sus preguntas; se registra como acoplamiento conocido en la nota.

## Open Questions

Sin preguntas abiertas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `scaffold` necesita `CLI_ROOT` para localizar los skills dueños de las cinco plantillas; el motor lo recibe como `--cli-root` desde el `SKILL.md`. La historia no lo menciona.
- **Documento afectado**: story.md
- **Acción requerida**: anotar que la copia de las cinco plantillas compartidas requiere los skills dueños instalados en `CLI_ROOT`; en su ausencia se emite `[WARNING]` y se continúa.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: "regenera todas las capas desde cero" (AC-4) se interpreta como sobrescribir los archivos semilla y las plantillas, sin eliminar nada. La historia ya lo acota en el `Pero` del escenario; el diseño lo fija en D-4.
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: documentar la lista de "archivos gestionados por el scaffold" como definición de lo que `rebuild --force` puede sobrescribir.

### CR-003
- **Tipo**: inviabilidad
- **Descripción**: `memory-system.md` §3 lista `requirement-template.md` en `templates/`; ningún skill escribe ese template (principio 13), por lo que el scaffold no lo crea y la lista del árbol de arquitectura queda desalineada con las seis plantillas.
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: sustituir `requirement-template.md` por `project-intent-template.md` y `project-plan-template.md` en el árbol §3 (tarea de documentación de esta historia).

### CR-004
- **Tipo**: ampliación de alcance
- **Descripción**: el árbol semilla contiene **nueve** plantillas, no las seis que fijan D-1 y D-2. Las tres adicionales —`templates/{domain,guardrail,policy}-template.md`— las añadió el autor a mano en el commit `911a188` y quedaron sin documentar, lo que las dejaba fuera de las cuatro listas de archivos gestionados pese a que `listSeeds()` recorre el árbol sin filtro y `scaffold` las copia a todo proyecto consumidor. Detectado en la segunda ronda de code review, de forma independiente, por el Tech-Lead-Reviewer y el Integration-Reviewer.
- **Rationale del autor**: las tres son **parte del estándar que todo proyecto SDDF debe recibir**, no material de un consumidor concreto. Es coherente con el modelo de capas: `domains/`, `guardrails/` y `policies/` son tres de las once capas de memoria, y hasta ahora eran las únicas capas de autoría humana que el scaffold creaba **sin** una plantilla con la que empezar a escribir. Un proyecto recibía el `README.md` de la capa pero ninguna guía de estructura para su primer artefacto.
- **Decisión tomada**: D-1 y D-2 se amplían de seis a nueve plantillas, repartidas en dos grupos por origen:
  - **Cinco compartidas**, copiadas en runtime desde el `assets/` de su skill dueño (`story`, `epic`, `project`, `project-intent`, `project-plan`), conforme a ADR-0007 —que conserva la regla de propiedad de ADR-0001 y solo cambia la ubicación—.
  - **Cuatro de autoría manual**, que viajan en la semilla porque **no tienen skill dueño**: `adr`, `domain`, `guardrail` y `policy`. Las cuatro anotan `escritor: autoría manual` conforme a [[ADR-0012-escritor-en-templates-de-autoria-manual]], cuya decisión ya preveía este caso al declarar `adr-template.md` "el **primer** template bajo esta regla".

  No hay conflicto con ADR-0001: su regla aplica a los templates **compartidos cross-skill**, que son los cinco del primer grupo. Una versión anterior del `fix-directives.md` afirmó lo contrario y se retiró.
- **Documento afectado**: design.md (D-1, D-2), `skills/memory-system/references/memory-rules.md` §5, `skills/memory-system/SKILL.md`, `docs/architecture/memory-system.md`, `skills/memory-system/assets/scaffold/templates/README.md`, `skills/memory-system/evals/evals.json`, `CHANGELOG.md`, `docs/templates/`
- **Acción requerida**: ninguna; aplicado y registrado. La regresión que lo hizo posible —`SIX_TEMPLATES` comprobaba presencia y no exhaustividad— queda cubierta por `S096-UT-001c`, que compara el conjunto exacto del árbol semilla contra la lista declarada.
