---
alwaysApply: false
type: design
id: STORY-147
slug: STORY-147-adr-del-layout-fijo-de-tres-raices-design
title: "Design: ADR del layout fijo de tres raíces"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-147
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[EPIC-26-layout-y-flow-forward-mejorado]] · [[specs-dentro-de-docs]]

## Context

La historia es un `chore` documental: registra la decisión de layout de EPIC-26 como un ADR nuevo que reemplaza a ADR-0010. No toca skills, scripts ni work items (Non-Goals; STORY-148 a STORY-158).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `docs/adr/` | Último ADR: `ADR-0015-contrato-de-validacion.md`. El siguiente número libre es **ADR-0016**. |
| `docs/adr/ADR-0010-specs-dentro-de-docs.md` | Frontmatter `status: PROPOSED` (no `ACCEPTED`, como asume la historia), `supersedes: ADR-0009`, `superseded-by: null`. Secciones: Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias, Referencias. Ver CR-001. |
| `docs/adr/README.md` | Convención de inmutabilidad: al reemplazar, «se actualizan `status` y `superseded-by` del antiguo y se añade una nota visible de reemplazo bajo su título (únicos cambios permitidos)». Índice con la fila ADR-0010 `PROPOSED`. Ver CR-002. |
| `docs/adr/adr-template.md` | Secciones obligatorias y frontmatter (`type`, `id`, `slug`, `title`, `status`, `date`, `supersedes`, `superseded-by`). Los ADR existentes (ADR-0013, ADR-0015) no conservan los comentarios `# escritor:` del template. |
| Precedente de reemplazo | `ADR-0004` → `status: SUPERSEDED`, `superseded-by: ADR-0013`, blockquote `> **Superado … por [ADR-0013](…) (fecha):** …` bajo el título; fila del índice `SUPERSEDED → [ADR-0013](…)`. |
| ADRs vigentes que citan la raíz configurable | `ADR-0002` (1), `ADR-0007` (3), `ADR-0012` (2), `ADR-0013` (1) mencionan `$SPECS_BASE`, `SDDF_ROOT` o `root:`. `ADR-0007` descartó explícitamente «ruta literal `docs/templates/`» por compatibilidad con `SDDF_ROOT`. Ver D-8. |
| `scripts/check-doc-links.js` | `docs/adr` está en `HISTORICAL_EXCLUSIONS`; `docs/index.md` es raíz activa y sus wikilinks se resuelven por `slug:` del frontmatter. |
| `docs/index.md` | Sección `### Decisiones de arquitectura (adr/)` lista ADR-0001 a ADR-0015 con el formato `- [[<slug>]] — [<archivo>](adr/<archivo>) — <título>`. |
| `sddf.config.yaml` | Declara `root: docs`; el repo aplica hoy ADR-0010 (`docs/specs/`). |
| EPIC-26 | Fija el layout, los Non-Goals (Workflow, Living Spec, Enforcement), la fecha del prefijo de archivo (`updated:` y, si falta, `created:`), que solo se archivan stories `COMPLETED` y que se conserva `STORY-NNN-<slug>/` / `EPIC-NN-<slug>/` (Notas). |

Stakeholders: el mantenedor que ejecuta STORY-148 a STORY-158, que citarán ADR-0016 en lugar de reinterpretar la épica.

## Goals / Non-Goals

**Goals:**
- Crear `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` con `status: ACCEPTED` y `supersedes: ADR-0010` // satisface: AC-1
- Fijar en el ADR las cinco raíces/subraíces literales, el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE` y la convención de `specs/flow/archive/` // satisface: AC-1
- Decidir explícitamente que `specs/flow/` conserva el slug // satisface: AC-3
- Marcar ADR-0010 como reemplazado tocando solo sus metadatos de reemplazo // satisface: AC-1, AC-2, CNF-1
- Listar ADR-0016 en `docs/adr/README.md` (y en `docs/index.md`) // satisface: AC-1, CNF-2

**Non-Goals:**
- Modificar skills, `sddf-init`, `sddf.config.yaml`, `AGENTS.md`, guías o mover work items (STORY-148 a STORY-158)
- Decidir el archivado de épicas o de stories `CANCELED` (épica de Workflow)
- Reemplazar o editar otros ADRs vigentes que citan `$SPECS_BASE` (D-8)
- Corregir la anomalía `supersedes: ADR-0009` de ADR-0010 (sería editar contenido; ver Risks)

## Decisions

### D-1 — ADR nuevo `ADR-0016`, aceptado al crearse // satisface: AC-1, CNF-1

| Campo | Valor |
|---|---|
| Archivo | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| `type` | `adr` |
| `id` | `ADR-0016` |
| `slug` | `layout-fijo-de-tres-raices` (único en `docs/`: verificado sin coincidencias) |
| `title` | `"Layout fijo de tres raíces: docs/, specs/ y workflow/"` |
| `status` | `ACCEPTED` |
| `date` | fecha de implementación (`YYYY-MM-DD`) |
| `supersedes` | `ADR-0010` |
| `superseded-by` | `null` |

Cuerpo: las seis secciones de `adr-template.md` en su orden, sin comentarios `escritor:` (convención de ADR-0013/ADR-0015), sin `[Por completar]`.

**Alternativas rechazadas:**
- **Editar ADR-0010 para cambiar su decisión:** viola la regla de inmutabilidad de `AGENTS.md` y CNF-1; además borra el registro de por qué se eligió `docs/specs/`.
- **Crear ADR-0016 `PROPOSED` y aceptarlo después:** CS-1 exige `ACCEPTED`, y STORY-148 a STORY-158 necesitan una decisión vinculante al empezar; la decisión ya está tomada en la épica (`DEFINE/DONE`).

### D-2 — Contenido de `## Decisión`: tres raíces hermanas y rutas fijas // satisface: AC-1

La sección declara, con estas cadenas literales:

```
<REPO_ROOT>/
├── docs/                  conocimiento: product/, requirements/, domains/, architecture/, adr/,
│                          policies/, guardrails/, guides/, runbooks/, templates/, constitution.md, index.md
├── specs/                 estado
│   ├── flow/              work items planos: EPIC-NN-<slug>/, STORY-NNN-<slug>/ (sin epics/ ni stories/)
│   │   └── archive/       stories COMPLETED: <YYYY-MM-DD>-STORY-NNN-<slug>/
│   └── living/            reservado (épica de Living Spec)
└── workflow/              proceso, reservado (épica de Workflow)
```

- `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` son raíces hermanas en la raíz del repo.
- El layout **no es configurable**: se retiran `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y la variable `SPECS_BASE`. Los skills solo resuelven `REPO_ROOT` y usan rutas fijas (`specs/flow/…`, `docs/templates/`, `docs/guardrails/`).
- `docs/requirements/` no se mueve en esta decisión; su destino es `specs/living/` en la épica de Living Spec.

**Alternativas rechazadas:**
- **`root: .` (mantener la clave apuntando a la raíz):** conserva un mecanismo de configuración que no aporta (Notas de EPIC-26).
- **Fase de compatibilidad con resolver `specs_root` → `root` → `docs` (mejora-013):** reintroduce la configuración que se retira; la mitigación es detectar sin escribir (D-6).
- **Mantener ADR-0010 (`docs/specs/`):** mezcla conocimiento y estado bajo una raíz configurable y obliga a cada skill a cargar el bloque `SDDF-ROOT-RESOLUTION`.

### D-3 — Convención de `specs/flow/archive/` // satisface: AC-1

El ADR fija `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` con:
- Solo stories con `status: COMPLETED`; `CANCELED` y el resto quedan en `specs/flow/` (las épicas se aplanan pero no se archivan).
- `<YYYY-MM-DD>` = `updated:` del frontmatter de la story; si falta, `created:` (determinista, independiente del momento de migrar).

**Alternativas rechazadas:**
- **Fecha de ejecución de la migración:** no reproducible (CS-7 exige idempotencia).
- **`archive/STORY-NNN-<slug>/` sin fecha:** pierde el orden cronológico que motiva el prefijo en la épica.

### D-4 — Los directorios de `specs/flow/` conservan el slug // satisface: AC-3

El ADR declara en una frase explícita: «Los directorios de `specs/flow/` conservan el slug: `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/`, como en ADR-0004; el criterio `specs/flow/STORY-001/story.md` se lee como `specs/flow/STORY-001-<slug>/story.md`». Coincide con SMOKE-1 (`specs/flow/STORY-001-<slug>/story.md`) y SMOKE-2 (`specs/flow/EPIC-01-<slug>/epic.md`).

**Alternativas rechazadas:**
- **Directorio sin slug (`STORY-001/`):** contradice SMOKE-1/SMOKE-2, rompe los globs `STORY-NNN-*` de todos los skills y los slugs `STORY-NNN-<slug>` que resuelven los wikilinks.
- **Slug solo en `archive/`:** dos convenciones para el mismo work item según su estado.

### D-5 — Marcado de ADR-0010 sin editar su contenido // satisface: AC-1, AC-2, CNF-1

Cambios permitidos en `docs/adr/ADR-0010-specs-dentro-de-docs.md`, y solo estos:

| Ubicación | Antes | Después |
|---|---|---|
| frontmatter `status` | `PROPOSED` | `SUPERSEDED` |
| frontmatter `superseded-by` | `null` | `ADR-0016` |
| línea nueva tras `# ADR-0010: …` | — | `> **Superado por [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md) (<fecha>):** \`specs/\` sale de \`docs/\` y el layout deja de ser configurable.` |

Quedan byte a byte iguales: `type`, `id`, `slug`, `title`, `date`, `supersedes` y las secciones Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias y Referencias.

La nota visible aplica la convención vigente de `docs/adr/README.md` y el precedente ADR-0004; se trata como metadato de reemplazo, no como contenido (ver CR-002).

**Alternativas rechazadas:**
- **Solo frontmatter, sin nota:** incumple la convención de `docs/adr/README.md` («se añade una nota visible»); un lector del cuerpo no sabría que la decisión dejó de regir.
- **Nota al final o en `## Consecuencias`:** edita una sección de contenido (AC-2).

### D-6 — ADR-0010 pasa de `PROPOSED` a `SUPERSEDED` con la disciplina de un ADR aceptado // satisface: AC-1, AC-2, CNF-1

ADR-0010 está `PROPOSED` en su frontmatter y en el índice, pero es la decisión vigente de hecho (`root: docs`, `docs/specs/`). Se marca `SUPERSEDED` directamente y se le aplica la misma restricción que a un ADR aceptado (D-5). ADR-0016 lo explica en `## Contexto y problema` («ADR-0010, aplicado de hecho aunque nunca pasó a `ACCEPTED`»).

**Alternativas rechazadas:**
- **Aceptar ADR-0010 retroactivamente y luego reemplazarlo:** fabrica un registro de aceptación que no ocurrió.
- **Marcarlo `REJECTED`/`DEPRECATED`:** falso; la decisión rigió y se reemplaza por otra (`SUPERSEDED` es el estado del README para ese caso).

### D-7 — Índices: `docs/adr/README.md` y `docs/index.md` // satisface: AC-1, CNF-2

`docs/adr/README.md`, tabla `## Índice de ADRs`:
- Fila ADR-0010: estado `PROPOSED` → `SUPERSEDED → [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md)` (resto igual).
- Fila nueva al final: `| [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md) | <title> | ACCEPTED | <date> |`.

`docs/index.md`, sección `### Decisiones de arquitectura (adr/)`, línea nueva tras ADR-0015 con el formato existente: `- [[layout-fijo-de-tres-raices]] — [ADR-0016-layout-fijo-de-tres-raices.md](adr/ADR-0016-layout-fijo-de-tres-raices.md) — <title>`. El wikilink se resuelve por el `slug` de D-1 (`check-doc-links.js › slugIndex`).

**Alternativas rechazadas:**
- **Regenerar `docs/index.md` con `/memory-system index`:** diff amplio sobre todo el índice para un cambio de una línea.
- **No tocar `docs/index.md`:** deja el ADR vigente fuera del punto de entrada wiki (`AGENTS.md › docs/index.md`).

### D-8 — Relación con ADRs vigentes que citan la raíz configurable // satisface: AC-1, CNF-1

ADR-0016 no reemplaza a ADR-0002, ADR-0007, ADR-0012 ni ADR-0013. En `## Consecuencias` declara: «Las menciones a `$SPECS_BASE`/`SDDF_ROOT` en ADRs vigentes se leen como `docs/` para capas de conocimiento y `specs/flow/` para work items. La decisión de ADR-0007 (templates como capa propia, fuera de la capa de work items) sigue vigente; su ubicación pasa a ser literal: `docs/templates/`».

**Alternativas rechazadas:**
- **Reemplazar también ADR-0007:** su decisión no cambia, solo la forma de resolver la ruta; ampliaría el alcance sin AC que lo pida.
- **Editar las menciones en esos ADRs:** viola la inmutabilidad (CNF-1).

### D-9 — Contenido de `## Rationale`, `## Alternativas consideradas`, `## Consecuencias` y `## Referencias` // satisface: AC-1

- **Rationale:** (1) separar conocimiento (`docs/`, cambia poco) de estado (`specs/`, cambia en cada historia) y de proceso (`workflow/`); (2) rutas fijas son más simples que la resolución de raíz (KISS): se elimina el bloque `SDDF-ROOT-RESOLUTION: v1` de cada skill; (3) respuesta a los argumentos de ADR-0010: el «modelo de tres capas» se conserva como conocimiento vs estado, y el punto de entrada único sigue siendo `AGENTS.md → docs/index.md`.
- **Alternativas consideradas:** las de D-2 (mantener ADR-0010, `root: .`, fase de compatibilidad) y D-4 (directorio sin slug).
- **Consecuencias positivas:** skills sin resolución de raíz; layout preparado para las épicas de Workflow y Living Spec.
- **Consecuencias negativas / trade-offs:** cambio incompatible para proyectos con `root: docs` o `docs/specs/` → versión mayor y guía de migración (STORY-154); posible convivencia con Spec Kit en `specs/` raíz (SDDF usa solo `specs/flow/` y `specs/living/`); mitigación «detectar sin escribir»: `/sddf-init` avisa y no crea layout paralelo, `skill-preflight` diagnostica el legado; aplicación incremental: hasta cerrar EPIC-26 el repo conserva `root: docs` y `docs/specs/`.
- **Referencias:** `[[specs-dentro-de-docs]]`, `[[nivel-l2-epic-y-directorios-numerados]]`, `[[templates-como-capa-propia]]`, `[[EPIC-26-layout-y-flow-forward-mejorado]]`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| ADR del layout fijo | crear | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` | AC-1, AC-3 |
| ADR-0010 | modificar (solo `status`, `superseded-by`, nota de reemplazo) | `docs/adr/ADR-0010-specs-dentro-de-docs.md` | AC-1, AC-2 |
| Índice de ADRs | modificar (fila ADR-0010, fila ADR-0016) | `docs/adr/README.md` | AC-1 |
| Índice wiki | modificar (una línea) | `docs/index.md` | AC-1, CNF-2 |

No se modifica ningún otro archivo (Non-Goals).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Frontmatter de ADR | campos de `adr-template.md`; `status ∈ {PROPOSED, ACCEPTED, DEPRECATED, SUPERSEDED}` (README) | AC-1, AC-2 |
| Reemplazo entre ADRs | `nuevo.supersedes = ADR-0010` ⇔ `ADR-0010.superseded-by = ADR-0016`, y `ADR-0010.status = SUPERSEDED` | AC-1 |
| Fila de índice | `\| [ADR-NNNN](<archivo>) \| <title> \| <estado> \| <date> \|`; estado reemplazado `SUPERSEDED → [ADR-NNNN](<archivo>)` | AC-1 |
| Wikilink en `docs/index.md` | `[[<slug>]]` resuelto por `slug:` del frontmatter (`check-doc-links.js`) | CNF-2 |

## Esquema de datos // satisface: AC-1

Frontmatter de ADR-0016:

```yaml
type: adr
id: ADR-0016
slug: layout-fijo-de-tres-raices
title: "Layout fijo de tres raíces: docs/, specs/ y workflow/"
status: ACCEPTED
date: <YYYY-MM-DD>
supersedes: ADR-0010
superseded-by: null
```

Diff de frontmatter de ADR-0010: `status: PROPOSED` → `status: SUPERSEDED`; `superseded-by: null` → `superseded-by: ADR-0016`.

## Flujos clave

### F-1 — Registro del ADR (escenario principal) // AC-1, AC-3
1. Crear ADR-0016 (D-1) con Decisión (D-2, D-3, D-4) y demás secciones (D-8, D-9).
2. Marcar ADR-0010 (D-5, D-6).
3. Actualizar `docs/adr/README.md` y `docs/index.md` (D-7).
4. Ejecutar `npm run verify:repository` (CNF-2).

### F-2 — Reemplazo sin edición in place // AC-2
`git diff -- docs/adr/ADR-0010-specs-dentro-de-docs.md` muestra solo las dos líneas de frontmatter y la línea de nota; ninguna línea de las secciones de contenido.

### F-3 — Degradación // P7
- Si `verify:repository` falla por un enlace o wikilink de `docs/index.md`: corregir la ruta o el slug; nunca relajar el checker.
- Si al implementar ya existe `ADR-0016-*` (otro trabajo en paralelo): usar el siguiente número libre y propagarlo a D-5/D-7; registrarlo en `implement-report.md`.

### F-4 — Puntos de cambio // P6
- La épica de Workflow puede añadir archivado de épicas o de `CANCELED`: ADR nuevo que reemplace la convención de D-3, sin tocar ADR-0016.
- La épica de Living Spec define el contenido de `specs/living/`: D-2 lo deja reservado y no lo restringe.

## Decisiones de complejidad justificada

- **Nota visible en ADR-0010 (D-5):** añade una línea frente a «solo frontmatter»; la exige la convención del README y evita que un lector del cuerpo crea vigente la decisión.
- **Línea en `docs/index.md` (D-7):** no la pide ningún AC, pero el índice wiki ya lista todos los ADR y un hueco rompería su completitud; es una línea, sin regenerar el índice.
- No se crea script, test ni eval: es un `chore` documental, y el gate existente (`verify:repository`) cubre CNF-2.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existe ADR-0016 `ACCEPTED` que reemplaza a ADR-0010 | Leer frontmatter: `status: ACCEPTED`, `supersedes: ADR-0010` | AC-1 |
| 2 | Declara las raíces hermanas | `grep -F` en ADR-0016 de `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` dentro de `## Decisión` | AC-1 |
| 3 | Declara el retiro | `grep -F` de `SDDF_ROOT`, `root`, `SPECS_BASE` en `## Decisión` | AC-1 |
| 4 | Convención de archive | `grep -F '<YYYY-MM-DD>-STORY-NNN-<slug>/'` en ADR-0016 | AC-1 |
| 5 | ADR-0010 reemplazado | Frontmatter de ADR-0010: `status: SUPERSEDED`, `superseded-by: ADR-0016` | AC-1 |
| 6 | README lista ADR-0016 | `grep -F 'ADR-0016-layout-fijo-de-tres-raices.md' docs/adr/README.md` | AC-1 |
| 7 | Contenido de ADR-0010 intacto | `git diff` de ADR-0010: solo `status`, `superseded-by` y la línea de nota; secciones sin cambios | AC-2, CNF-1 |
| 8 | Decisión explícita sobre el slug | ADR-0016 contiene `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/` en `## Decisión` y cita SMOKE-1/SMOKE-2 | AC-3 |
| 9 | Gate verde | `npm run verify:repository` termina con código 0 | CNF-2 |
| 10 | Alcance acotado | `git diff --stat` solo muestra los 4 archivos de «Componentes afectados» (más artefactos de la historia) | Non-Goals |

## Risks / Trade-offs

- **[Riesgo] AC-1/AC-2 parten de «ADR-0010 está ACCEPTED», que es falso** → D-6 aplica la disciplina más estricta; CR-001 propone corregir la premisa.
- **[Riesgo] La nota visible podría leerse como edición de contenido (AC-2 literal)** → D-5 la limita a una línea bajo el título, como exige el README; CR-002.
- **[Trade-off] Estado transitorio contradictorio:** ADR-0016 vigente mientras `AGENTS.md`, `sddf.config.yaml` y los skills siguen con `root: docs` → ADR-0016 lo declara como aplicación incremental en EPIC-26 (STORY-148 a STORY-158).
- **[Limitación] ADR-0010 conserva `supersedes: ADR-0009`** (anomalía: ADR-0009 sigue `ACCEPTED` y trata otro tema) → no se corrige por inmutabilidad; queda fuera de alcance.
- **[Limitación] `check-doc-links.js` excluye `docs/adr`** → los enlaces dentro de ADR-0016 y la nota de ADR-0010 no los valida el gate; verificar a mano que apuntan a archivos existentes.

## Open Questions

Ninguna: la ambigüedad del estado de ADR-0010 se resuelve en D-6 y la de la nota en D-5; ambas quedan registradas como CR para retroalimentar `story.md`.

## Autoevaluación (P9, P10)

- **Omisiones:** los 3 ACs y los 2 CNF tienen decisión y contrato de verificación (AC-1: D-1–D-3, D-5–D-8; AC-2: D-5, D-6; AC-3: D-4; CNF-1: D-1, D-5, D-8; CNF-2: D-7).
- **Ambigüedad:** estado de ADR-0010 y nota de reemplazo resueltos (D-5, D-6, CR-001, CR-002).
- **Nombres:** «layout fijo de tres raíces», «raíces hermanas», «reemplazo/`superseded-by`» se usan igual que en la historia y la épica.
- **Estructura:** cuatro archivos sin dependencias cíclicas; cada uno con una sola razón de cambio; sin código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 y AC-2 dicen «Dado que ADR-0010 está ACCEPTED», pero su frontmatter y el índice `docs/adr/README.md` lo registran como `PROPOSED`. La decisión rige de hecho (`root: docs`, `docs/specs/`).
- **Documento afectado**: story.md
- **Acción requerida**: cambiar la premisa a «ADR-0010 está PROPOSED y vigente de hecho». Mientras tanto, el diseño marca ADR-0010 `SUPERSEDED` y le aplica la restricción de un ADR aceptado (D-6), lo que satisface la intención de AC-2 y CNF-1.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-2 dice «solo cambian sus metadatos de reemplazo ("status" y "superseded-by")», mientras `docs/adr/README.md` exige además «una nota visible de reemplazo bajo su título» (precedente ADR-0004).
- **Documento afectado**: story.md
- **Acción requerida**: alinear AC-2 con el README («solo cambian `status`, `superseded-by` y la nota visible de reemplazo bajo el título»). El diseño aplica el README (D-5) y conserva intacto lo que AC-2 protege: contexto, decisión y consecuencias.
