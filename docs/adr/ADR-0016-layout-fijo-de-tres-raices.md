---
type: adr
id: ADR-0016
slug: layout-fijo-de-tres-raices
title: "Layout fijo de tres raíces: docs/, specs/ y workflow/"
status: ACCEPTED
date: 2026-10-23
supersedes: ADR-0010
superseded-by: null
---

# ADR-0016: Layout fijo de tres raíces: docs/, specs/ y workflow/

## Contexto y problema

SDDF guarda bajo una única raíz configurable (`SDDF_ROOT`, la clave `root` de `sddf.config.yaml` o, por defecto,
`docs`) dos cosas de naturaleza distinta: el **conocimiento** del proyecto (`product/`, `requirements/`, `domains/`,
`architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/`, `templates/`), que cambia poco, y el
**estado** del flujo (épicas e historias en `specs/`), que cambia en cada historia. Esa mezcla la fijó
[ADR-0010](ADR-0010-specs-dentro-de-docs.md), aplicado de hecho (`root: docs`, `docs/specs/`) aunque nunca pasó a
`ACCEPTED`.

La raíz configurable obliga a cada skill a cargar el bloque `SDDF-ROOT-RESOLUTION: v1` y a construir todas sus rutas
sobre `$SPECS_BASE`, y deja sin lugar propio a dos capas que el roadmap ya anticipa: el proceso (épica de Workflow) y
la especificación viva (épica de Living Spec).

Origen: EPIC-26 (Layout y flow-forward mejorado), a partir de las propuestas mejora-012 y mejora-013
(refactor for living spec). Las historias STORY-148 a STORY-158 aplican esta decisión.

## Decisión

El repositorio usa un **layout fijo de tres raíces hermanas** en la raíz del repo: `docs/` (conocimiento), `specs/`
(estado) y `workflow/` (proceso).

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
- El layout **no es configurable**: se retiran `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y la variable
  `SPECS_BASE`. Los skills solo resuelven `REPO_ROOT` y usan rutas fijas (`specs/flow/…`, `docs/templates/`,
  `docs/guardrails/`).
- `docs/requirements/` no se mueve en esta decisión; su destino es `specs/living/` en la épica de Living Spec.
- **Archivo:** `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` recibe solo las stories con `status: COMPLETED`;
  `<YYYY-MM-DD>` es el `updated:` del frontmatter de la story y, si falta, su `created:`. Las stories `CANCELED` y las
  de cualquier otro estado quedan en `specs/flow/`; las épicas se aplanan en `specs/flow/` pero no se archivan.
- **Nombre de directorio:** los directorios de `specs/flow/` conservan el slug: `STORY-NNN-<slug>/` y
  `EPIC-NN-<slug>/`, como en ADR-0004; el criterio `specs/flow/STORY-001/story.md` se lee como
  `specs/flow/STORY-001-<slug>/story.md`. Es consistente con SMOKE-1 (`specs/flow/STORY-001-<slug>/story.md`) y
  SMOKE-2 (`specs/flow/EPIC-01-<slug>/epic.md`) de EPIC-26.

## Rationale

1. **Separar conocimiento, estado y proceso.** `docs/` cambia poco y se lee como contexto; `specs/` cambia en cada
   historia; `workflow/` describirá el proceso. Cada raíz tiene una sola razón de cambio.
2. **Rutas fijas antes que resolución de raíz (KISS).** Se elimina el bloque `SDDF-ROOT-RESOLUTION: v1` de cada skill y
   la variable `SPECS_BASE` de sus rutas: menos instrucciones por skill y menos errores de resolución.
3. **Respuesta a los argumentos de ADR-0010.** El modelo de capas se conserva como la separación conocimiento vs
   estado, y el punto de entrada único sigue siendo `AGENTS.md → docs/index.md`. La segunda raíz que ADR-0010 quería
   evitar no se configura: es una ruta fija conocida por todos los skills.

## Alternativas consideradas

- **Mantener ADR-0010 (`docs/specs/`):** descartada porque mezcla conocimiento y estado bajo una raíz configurable y
  obliga a cada skill a cargar el bloque `SDDF-ROOT-RESOLUTION`.
- **`root: .` (mantener la clave apuntando a la raíz del repo):** descartada porque conserva un mecanismo de
  configuración que no aporta.
- **Fase de compatibilidad con un resolver `specs_root` → `root` → `docs` (mejora-013):** descartada porque reintroduce
  la configuración que se retira; la mitigación adoptada es detectar sin escribir (ver Consecuencias).
- **Directorio sin slug (`specs/flow/STORY-001/`):** descartada porque contradice SMOKE-1 y SMOKE-2, rompe los globs
  `STORY-NNN-*` de los skills y los slugs `STORY-NNN-<slug>` con los que se resuelven los wikilinks.

## Consecuencias

**Positivas:**
- Los skills dejan de resolver raíz: solo `REPO_ROOT` y rutas fijas.
- El layout queda preparado para las épicas de Workflow (`workflow/`, archivado) y Living Spec (`specs/living/`).
- El archivo de stories `COMPLETED` es determinista (la fecha sale del frontmatter, no del momento de migrar).

**Negativas / trade-offs:**
- Cambio incompatible para proyectos con `root: docs` o `docs/specs/`: exige versión mayor y una guía de migración
  (STORY-154).
- Posible convivencia con Spec Kit en `specs/` de la raíz: SDDF usa solo `specs/flow/` y `specs/living/`.
- Mitigación «detectar sin escribir»: `/sddf-init` avisa y no crea un layout paralelo si encuentra `docs/specs/`, y
  `skill-preflight` diagnostica el layout legado; la migración no se ejecuta sola en proyectos instalados.
- Aplicación incremental: hasta cerrar EPIC-26 este repositorio conserva `root: docs` y `docs/specs/`; las historias
  STORY-148 a STORY-158 migran skills, `sddf-init`, documentación y work items.
- Las menciones a `$SPECS_BASE`/`SDDF_ROOT` en ADRs vigentes (ADR-0002, ADR-0007, ADR-0012, ADR-0013) se leen como
  `docs/` para capas de conocimiento y `specs/flow/` para work items. La decisión de ADR-0007 (templates como capa
  propia, fuera de la capa de work items) sigue vigente; su ubicación pasa a ser literal: `docs/templates/`.

## Referencias

- [[specs-dentro-de-docs]] — ADR-0010, decisión reemplazada
- [[nivel-l2-epic-y-directorios-numerados]] — ADR-0004, convención `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/`
- [[templates-como-capa-propia]] — ADR-0007, templates como capa propia
- [[EPIC-26-layout-y-flow-forward-mejorado]] — épica que origina y aplica esta decisión
