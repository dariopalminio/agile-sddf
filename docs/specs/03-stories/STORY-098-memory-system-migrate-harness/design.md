---
alwaysApply: false
type: design
id: STORY-098
slug: STORY-098-memory-system-migrate-harness-design
title: "Design: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate"
date: 2026-09-21
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-098
related:
  - STORY-098-memory-system-migrate-harness
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-097-memory-system-check-ci
  - memory-system
---

<!-- Referencias -->
[[STORY-098-memory-system-migrate-harness]]
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-097-memory-system-check-ci]]
[[memory-system]]

# Diseño técnico: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate

## Context

STORY-095 deja en el motor `scripts/memory-system.js` la detección de harness (`detect`,
precedencia `--harness` > `sddf.config.yaml` > `.specify/` > `openspec/` > `generic`) y una
tabla `HARNESS_PROFILES` con `externalRoots` rellenos (raíces que `index` escanea en solo
lectura) y las claves `skipLayers` y `mappings` **vacías**, reservadas para esta historia.
STORY-096 deja el subcomando `scaffold` (copia-si-falta del árbol semilla) y los modos
`ensure`/`rebuild`, con el informe `creados · sobrescritos · preservados · omitidos por harness`
donde la última cifra es siempre 0.

Esta historia rellena esas claves y añade el modo `migrate`. Su valor es que un proyecto
Speckit u OpenSpec adopte la memoria SDDF sin que `memory-system` cree conceptos que el
harness ya modela (`specs/`) ni toque sus directorios.

Contexto técnico relevante (verificado en el repositorio y en la documentación pública de
ambos harness):

- **Speckit** (`github/spec-kit`): `.specify/memory/constitution.md` es su constitución;
  las features viven en `specs/<NNN-nombre>/{spec.md, plan.md, tasks.md}` en la raíz del
  repositorio. No existe `docs/` por convención.
- **OpenSpec**: `openspec/specs/<capability>/spec.md` (specs vigentes) y
  `openspec/changes/<change>/{proposal.md, design.md, tasks.md}` (cambios en curso). Este
  repositorio tiene `skills/openspec-*` que operan sobre ese layout y `.gitignore` no lo
  excluye.
- El motor ya deriva slug = directorio contenedor para `spec.md`, `proposal.md`, `plan.md`
  (D-3 de STORY-095), de modo que los artefactos externos tienen slug estable (`auth`,
  `add-login`, `001-login`).
- `SKILL.md` ya soporta `--yes` como modo automático sin preguntas (STORY-096, `migrate` lo
  hereda) y `--dry-run` en `scaffold` (imprime `[CREARÍA]` sin escribir).
- Principio "no-eliminación" y "no escribir fuera de `SPECS_BASE`" (STORY-095 D-2,
  STORY-096 D-4).

Numeración de criterios usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `migrate` en un proyecto con `.specify/` sin `sddf.config.yaml`: detecta `speckit`, propone sin escribir (capas a crear, archivos a preservar, mapeos como `constitution.md` → `.specify/memory/constitution.md`), pide confirmación y al confirmar ejecuta `scaffold` adaptado. |
| AC-2 | `ensure --harness openspec`: crea capas bajo `docs/` sin modificar `openspec/`, no crea `docs/specs/`, y `docs/index.md` enlaza specs y changes de OpenSpec en una sección de artefactos externos. |
| AC-3 | Perfiles de harness: `sddf`/`generic` once capas; `speckit`/`openspec` omiten `docs/specs/` y enlazan `specs/*/{spec,plan}.md` o `openspec/specs/**/spec.md` + `openspec/changes/*/proposal.md`; directorios del harness solo lectura. |
| AC-4 | `migrate` solo hace scaffolding adaptado tras confirmación; no transforma ni mueve artefactos; `--yes` asume la confirmación. |

NFR-1 seguridad (nada fuera de `docs/`; `openspec/`, `.specify/`, `specs/` intactos) ·
NFR-2 idempotencia (`migrate` confirmado dos veces no crea nada la segunda) · NFR-3
trazabilidad (plan e informe distinguen creados, preservados, mapeados, omitidos) · NFR-4
documentación (`memory-system.md`, `README.md`).

## Goals / Non-Goals

**Goals:**

- Rellenar `HARNESS_PROFILES` con `skipLayers` y `mappings` para `speckit` y `openspec`, sin
  cambiar la forma de la tabla ni el escáner.
- Que `scaffold` respete el perfil: omite capas, no crea archivos mapeados, informa cada
  decisión.
- Un modo `migrate` = plan (`scaffold --dry-run`) → confirmación → `scaffold`, sin lógica
  propia más allá de la interacción.
- Que el índice muestre los artefactos del harness como nodos externos enlazables.

**Non-Goals:**

- Convertir, mover o reescribir artefactos del harness. Soportar otros harness. Crear
  `sddf.config.yaml` en un proyecto no SDDF (eso es `sddf-init`).
- Cambiar la detección de harness (STORY-095) ni el árbol semilla (STORY-096).
- Bidireccionalidad entre nodos externos y nodos de `docs/`.

## Decisions

### D-1 — Los perfiles de harness se completan como datos: `skipLayers`, `mappings`, `externalRoots`

// satisface: AC-2, AC-3, NFR-1

Se rellenan las claves reservadas de `HARNESS_PROFILES` en `scripts/memory-system.js`:

| Harness | `skipLayers` | `mappings` (archivo semilla → equivalente del harness, si existe) | `externalRoots` (solo lectura, relativas a `REPO_ROOT`) |
|---|---|---|---|
| `sddf` | `[]` | `{}` | `[]` |
| `generic` | `[]` | `{}` | `[]` |
| `speckit` | `['specs']` | `{ 'constitution.md': '.specify/memory/constitution.md' }` | `['specs/*/spec.md', 'specs/*/plan.md']` |
| `openspec` | `['specs']` | `{}` | `['openspec/specs/**/spec.md', 'openspec/changes/*/proposal.md']` |

Semántica:

- `skipLayers`: `scaffold` no crea esa capa ni sus semillas; `check` (STORY-097) no la reporta
  como faltante; `index` no tiene placeholder que rellenar para ella (queda
  `_(gestionado por el harness)_`).
- `mappings`: si el equivalente del harness **existe**, `scaffold` no crea la semilla y
  registra `[MAPEADO] constitution.md → .specify/memory/constitution.md`; `index` enlaza el
  equivalente como nodo externo con el slug de la semilla (`constitution`). Si no existe, se
  crea la semilla normalmente.
- `externalRoots`: ya definidas en STORY-095; aquí solo se confirma que `scaffold` y
  `migrate` nunca escriben bajo ellas (guardia en el motor: cualquier ruta destino fuera de
  `SPECS_BASE` aborta con exit 2 antes de escribir).

Alternativas rechazadas: (a) omitir también `requirements/` en OpenSpec (sus specs son
"requisitos vigentes") — la capa `requirements/` de SDDF admite NFR y catálogo propio que
OpenSpec no modela; se mantiene y el índice enlaza ambas; (b) mapear `docs/` completo a un
directorio del harness — Speckit y OpenSpec no tienen equivalente de la memoria SDDF.

### D-2 — `scaffold` aplica el perfil y reporta `omitidos por harness` y `mapeados`

// satisface: AC-2, AC-3, NFR-3

El subcomando `scaffold` (STORY-096) recibe el harness de `detect` y:

1. Filtra el árbol semilla: entradas cuya primera carpeta está en `skipLayers` → acción
   `skipped` (`[OMITIDO] specs/ — gestionado por el harness speckit`).
2. Para cada clave de `mappings` con equivalente existente → acción `mapped`
   (`[MAPEADO] …`), sin crear ni tocar nada.
3. Resto: copia-si-falta como hasta ahora.

Última línea del informe: `creados: N · sobrescritos: S · preservados: M · mapeados: X ·
omitidos por harness: K`. `--dry-run` produce las mismas líneas con `[CREARÍA]`,
`[MAPEARÍA]`, `[OMITIRÍA]`; ese texto es el **plan** que `migrate` muestra.

Alternativa rechazada: que `migrate` construya su propio plan — duplicaría la lógica de
`scaffold --dry-run` y podría divergir del scaffolding real.

### D-3 — `migrate` es una secuencia del `SKILL.md`: detect → plan → confirmación → scaffold

// satisface: AC-1, AC-4, NFR-2

Modo `migrate [--harness h] [--yes]` en `SKILL.md`:

1. `detect` → harness. Si es `sddf`, informar `ℹ️ El proyecto ya es SDDF; usa
   /memory-system ensure.` y terminar sin escribir (migrar un proyecto SDDF no tiene sentido).
2. `scaffold --dry-run --harness <h>` → plan. Mostrarlo con el encabezado
   `📋 Plan de migración (<h>)` y el resumen de D-2.
3. Preguntar `¿Confirmas el plan de migración? (sí/no)`. Con `--yes`, asumir `sí`. Con `no`,
   terminar sin escribir: `Migración cancelada — no se escribió ningún archivo.`
4. `scaffold --harness <h>` → informe real. No se invoca `index`: `migrate` es solo
   scaffolding (AC-4); el `SKILL.md` sugiere `/memory-system index` como siguiente paso.

Idempotencia (NFR-2): la segunda ejecución produce un plan con todo `[PRESERVARÍA]`/
`[MAPEARÍA]` y, confirmada, `creados: 0`.

Alternativas rechazadas: (a) `migrate` = `ensure` con confirmación — la historia acota
`migrate` a scaffolding y `ensure` ya existe para lo demás; (b) confirmación interactiva en
el motor — la interacción vive en el `SKILL.md`; el motor solo conoce `--dry-run`.

### D-4 — Nodos externos y mapeados en el índice

// satisface: AC-2, AC-3

`index` (STORY-095) ya escanea `externalRoots` y los coloca en `{layer:external}`. Esta
historia fija dos detalles:

- La sección "Artefactos externos" del template lleva un subtítulo por harness
  (`### OpenSpec — specs` / `### OpenSpec — changes` / `### Speckit — features`), derivado del
  patrón de `externalRoots` que originó cada nodo (el motor anota `node.externalGroup`).
- Los archivos de `mappings` existentes se indexan como nodos externos con el slug de la
  semilla mapeada (`[[constitution]] — [.specify/memory/constitution.md](../.specify/memory/constitution.md)`),
  de modo que los wikilinks internos a `[[constitution]]` resuelven y `check` no los reporta.

Alternativa rechazada: copiar `.specify/memory/constitution.md` a `docs/constitution.md` —
duplica la fuente de verdad del harness y viola "no convertir artefactos" (AC-4).

### D-5 — Guardia de escritura: el motor rechaza cualquier destino fuera de `SPECS_BASE`

// satisface: AC-2, AC-3, NFR-1

Antes de escribir, `scaffold` (y `index`) normalizan la ruta destino y comprueban que está
bajo `SPECS_BASE`; si no, abortan con exit 2 y `destino fuera de la raíz: <ruta>` sin haber
escrito nada. Los `externalRoots` y los `mappings` son entradas de solo lectura por
construcción: ninguna acción del motor les asigna un destino de escritura. El test de la
historia lo verifica por hashes sobre `openspec/`, `.specify/` y `specs/`.

### D-6 — Documentación

// satisface: NFR-4

- `docs/architecture/memory-system.md` §10: tabla de perfiles de harness (D-1), semántica de
  `skipLayers`/`mappings`/`externalRoots`, modo `migrate` y la regla "los directorios del
  harness son de solo lectura".
- `README.md`: párrafo "Compatibilidad con OpenSpec y Speckit" con los dos comandos de la
  verificación sugerida.
- `docs/guides/sddf-commands-pipeline.md` §0: `migrate` como entrada para proyectos no SDDF.
- `CHANGELOG.md` 3.3.0: Added `migrate`, perfiles de harness.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `HARNESS_PROFILES` (rellenar `skipLayers`, `mappings`) | modificar | `skills/memory-system/scripts/memory-system.js` | AC-2, AC-3 |
| Subcomando `scaffold` (filtro por perfil, `mapped`/`skipped`, informe) | modificar | `skills/memory-system/scripts/memory-system.js` | AC-2, AC-3 |
| Guardia de escritura fuera de `SPECS_BASE` | modificar (añadir) | `skills/memory-system/scripts/memory-system.js` | AC-2, AC-3 |
| Subcomando `index` (`externalGroup`, nodos mapeados) | modificar | `skills/memory-system/scripts/memory-system.js`, `skills/memory-system/assets/index-template.md` | AC-2 |
| Modo `migrate` del skill | modificar (añadir) | `skills/memory-system/SKILL.md` | AC-1, AC-4 |
| Reglas de memoria (sección "Harness") | modificar | `skills/memory-system/references/memory-rules.md` | AC-3 |
| Evals del skill | modificar (añadir casos) | `skills/memory-system/evals/evals.json` | AC-1, AC-2 |
| Fixtures | modificar / crear | `skills/memory-system/examples/speckit/` (añadir `.specify/memory/constitution.md`), `examples/openspec/` | AC-1, AC-2 |
| Tests del motor | modificar (añadir) | `test/memory-system.test.js` | AC-2, AC-3, NFR-1, NFR-2 |
| Documentación | modificar | `docs/architecture/memory-system.md`, `README.md`, `docs/guides/sddf-commands-pipeline.md`, `CHANGELOG.md` | NFR-4 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/memory-system migrate [--harness h] [--yes]` | Secuencia de D-3; muestra el plan; sin confirmación no escribe; con `sddf` detectado informa y termina. | AC-1, AC-4 |
| `node scripts/memory-system.js scaffold --root <SPECS_BASE> --harness <h> [--dry-run] [--force] [--cli-root]` | Aplica `skipLayers`/`mappings`; acciones `[OMITIDO]`/`[MAPEADO]` (o `[OMITIRÍA]`/`[MAPEARÍA]`); última línea `creados · sobrescritos · preservados · mapeados · omitidos por harness`; exit 2 si un destino cae fuera de la raíz. | AC-2, AC-3 |
| `HARNESS_PROFILES[h]` | `{ marker, skipLayers: string[], mappings: Record<seedRelPath, harnessRelPath>, externalRoots: string[] }`. | AC-3 |
| `{layer:external}` en `assets/index-template.md` | Se rellena con subtítulos por `externalGroup` y los nodos mapeados; `_(sin artefactos externos)_` si vacío. | AC-2 |
| Plan de migración (texto) | Es la salida de `scaffold --dry-run` sin transformación; el `SKILL.md` solo le antepone el encabezado. | AC-1, NFR-3 |

## Esquema de datos

- **Perfil de harness**: tabla de D-1.
- **Acción de scaffold**: `created | overwritten | preserved | mapped | skipped | would-create | would-map | would-skip`.
- **Nodo externo**: nodo indexable con `externalGroup ∈ { 'openspec-specs', 'openspec-changes', 'speckit-features', 'mapped' }` y `relPath` relativa a `REPO_ROOT` (enlace `../…` desde `docs/`).
- **Informe de scaffold**: `{ created, overwritten, preserved, mapped, skippedByHarness, warnings[] }`.

## Flujos clave

### F-1 — `migrate` en un proyecto Speckit (AC-1, AC-4)

1. `detect` → `speckit` (`.specify/` presente, sin `sddf.config.yaml`).
2. `scaffold --dry-run --harness speckit` → plan: `[OMITIRÍA] specs/`,
   `[MAPEARÍA] constitution.md → .specify/memory/constitution.md`, `[CREARÍA]` × N.
3. Pregunta; `--yes` la asume.
4. `scaffold --harness speckit` → `creados: N · … · mapeados: 1 · omitidos por harness: 1`;
   `docs/specs/` no existe; `.specify/` y `specs/` intactos.
5. Sugerencia: `/memory-system index`.

### F-2 — `ensure --harness openspec` (AC-2, AC-3)

1. `scaffold --harness openspec`: omite `specs/`, crea el resto bajo `docs/`.
2. `index`: nodos externos de `openspec/specs/**/spec.md` y `openspec/changes/*/proposal.md`
   bajo "Artefactos externos" con subtítulos; `docs/index.md` contiene `[[auth]]` y
   `[[add-login]]`.
3. Hashes bajo `openspec/` iguales antes y después.

### F-3 — `migrate` en un proyecto SDDF

1. `detect` → `sddf` → mensaje informativo y fin sin escrituras.

### F-4 — Intento de escritura fuera de la raíz (D-5)

1. Un perfil o semilla mal configurado produce un destino fuera de `SPECS_BASE` →
   exit 2 antes de la primera escritura.

## Decisiones de complejidad justificada

- **`mappings` como tabla en lugar de un caso especial para `constitution.md`**: hoy solo
  Speckit mapea un archivo, pero la clave ya existía reservada y evita un `if` de harness en
  el scaffold.
- **Guardia de escritura genérica (D-5)**: es una comprobación de una línea que convierte
  "no tocar el harness" de una promesa documental en un invariante verificable.
- **`migrate` sin `index`**: mantenerlo a scaffolding puro respeta AC-4 y evita que un
  proyecto recién migrado obtenga un índice antes de revisar el plan.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `migrate` sobre `examples/speckit/` sin `--yes`: plan mostrado, pregunta emitida, ningún archivo creado | eval del skill | AC-1, AC-4 |
| 2 | `migrate --yes` sobre `examples/speckit/`: `docs/` sin `specs/`, `constitution.md` no creado y `[MAPEADO]`, `.specify/` y `specs/` con hashes intactos | eval + test del motor | AC-1, AC-3, NFR-1 |
| 3 | `migrate --yes` ×2: segunda corrida `creados: 0` | test del motor | NFR-2 |
| 4 | `ensure --harness openspec` sobre `examples/openspec/`: sin `docs/specs/`, hashes de `openspec/` intactos, `index.md` con `[[auth]]` y `[[add-login]]` bajo subtítulos OpenSpec | test del motor | AC-2, AC-3 |
| 5 | `scaffold --harness speckit` sin `.specify/memory/constitution.md` → crea la semilla `constitution.md` | test del motor | AC-3 |
| 6 | Informe de `scaffold` incluye `mapeados: X · omitidos por harness: K` con valores correctos | test del motor | NFR-3 |
| 7 | `check --harness openspec` no reporta `specs/` como `missing-layer` | test del motor (con STORY-097) | AC-3 |
| 8 | Destino fuera de `SPECS_BASE` → exit 2 sin escrituras | test del motor con perfil de prueba | NFR-1 |
| 9 | `migrate` en proyecto `sddf` → mensaje informativo, sin escrituras | eval del skill | AC-4 |
| 10 | `memory-system.md`, `README.md`, guía y CHANGELOG documentan perfiles y `migrate`; `verify:links` verde | grep + comando | NFR-4 |

## Risks / Trade-offs

- [Layouts de Speckit u OpenSpec cambian en versiones futuras] → los patrones viven en
  `HARNESS_PROFILES` (datos) y en `memory-rules.md`; actualizar es editar una fila.
- [Speckit sin `.specify/memory/constitution.md` en proyectos antiguos] → `mappings` solo
  aplica si el archivo existe; si no, se crea la semilla (V-5).
- [Un proyecto con `openspec/` **y** `sddf.config.yaml`] → `detect` devuelve `sddf` (precedencia
  de STORY-095); `--harness openspec` fuerza el perfil si el usuario lo prefiere.
- [Nodos externos con slugs que colisionan con nodos de `docs/`] → el slug del externo es el
  directorio contenedor; ante colisión, `index` conserva el nodo de `docs/` y marca el externo
  con sufijo `-external` y aviso; se documenta.
- [STORY-096 no implementada al ejecutar esta] → `migrate` depende de `scaffold`; el diseño
  no contempla degradación: la historia declara la dependencia y el orden 095 → 096 → 098.

## Open Questions

Sin preguntas abiertas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: la historia no define qué ocurre con `migrate` en un proyecto ya SDDF. Se decide informar y terminar sin escribir (D-3, F-3).
- **Documento afectado**: story.md
- **Acción requerida**: añadir al requerimiento "`migrate` no convierte artefactos" que en un proyecto `sddf` el modo informa y remite a `ensure`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: colisión de slug entre un nodo externo (p. ej. `openspec/specs/auth/spec.md` → `auth`) y un nodo de `docs/` con el mismo slug. Se decide que gana el nodo de `docs/` y el externo recibe sufijo `-external` con aviso.
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: documentar la regla de colisión en §10 y en `memory-rules.md`.

### CR-003
- **Tipo**: dependencia
- **Descripción**: `migrate` no tiene sentido sin `scaffold` (STORY-096) ni `index` externo (STORY-095); a diferencia de las otras hermanas, esta historia no define degradación.
- **Documento afectado**: story.md
- **Acción requerida**: ninguna nueva — la historia ya declara el orden 095 → 096 → 098; se registra para el `analyze`.
