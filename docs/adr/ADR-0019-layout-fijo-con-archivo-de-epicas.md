---
type: adr
id: ADR-0019
slug: layout-fijo-con-archivo-de-epicas
title: "Layout fijo de tres raíces con archivo de historias y épicas cerradas"
status: ACCEPTED
date: 2026-10-30
supersedes: ADR-0017
superseded-by: null
---

# ADR-0019: Layout fijo de tres raíces con archivo de historias y épicas cerradas

## Contexto y problema

[ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) mantiene el layout fijo de tres raíces
(`docs/`, `specs/` y `workflow/`) y admite en `specs/flow/archive/` solo las historias `COMPLETED` y `CANCELED`. Su
viñeta de archivo dice que «las épicas y las stories en cualquier otro estado quedan en `specs/flow/`»: una épica
cerrada se queda para siempre mezclada con el trabajo activo.

EPIC-23 (Completar el flujo de épica) entrega el skill `epic-complete`, que lleva una épica de `SHIP/DONE` a
`COMPLETED/DONE` y la archiva (STORY-171), y que también archiva las épicas `CANCELED/DONE` (STORY-172). La regla de
ADR-0017 lo impide y, por ser un ADR aceptado, no se edita in place.

Archivar épicas tiene además un efecto sobre la numeración: los skills que crean épicas (`epic-creation` y
`epic-from-project-plan`) calculan el siguiente `EPIC-NN` mirando solo `specs/flow/EPIC-*/`. Sin cambio, una épica
archivada liberaría su número y una épica nueva lo reutilizaría, rompiendo el `parent` y los wikilinks de sus
historias.

Origen: EPIC-23, STORY-175 (split de STORY-171).

## Decisión

El repositorio mantiene **sin cambios** el layout fijo de tres raíces hermanas de ADR-0017 y amplía la regla de
archivo a las épicas `COMPLETED` y `CANCELED`.

```
<REPO_ROOT>/
├── docs/                  conocimiento: product/, requirements/, domains/, architecture/, adr/,
│                          policies/, guardrails/, guides/, runbooks/, templates/, constitution.md, index.md
├── specs/                 estado
│   ├── flow/              work items planos: EPIC-NN-<slug>/, STORY-NNN-<slug>/ (sin epics/ ni stories/)
│   │   └── archive/       stories y épicas COMPLETED o CANCELED: <YYYY-MM-DD>-STORY-NNN-<slug>/,
│   │                      <YYYY-MM-DD>-EPIC-NN-<slug>/
│   └── living/            reservado (épica de Living Spec)
└── workflow/              proceso, reservado (épica de Workflow)
```

- `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` son raíces hermanas en la raíz del repo.
- El layout **no es configurable**: siguen retirados `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y la variable
  `SPECS_BASE`. Los skills solo resuelven `REPO_ROOT` y usan rutas fijas (`specs/flow/…`, `docs/templates/`,
  `docs/guardrails/`).
- `docs/requirements/` no se mueve en esta decisión; su destino es `specs/living/` en la épica de Living Spec.
- **Archivo:** `specs/flow/archive/` es plano y recibe las stories (`<YYYY-MM-DD>-STORY-NNN-<slug>/`) y las épicas
  (`<YYYY-MM-DD>-EPIC-NN-<slug>/`) con `status: COMPLETED` o `status: CANCELED`, siempre con `substatus: DONE`; el
  status se conserva al archivar y es lo que distingue un work item entregado de uno cancelado. `<YYYY-MM-DD>` es el
  `updated:`; si no es válido, el `created:`; si el frontmatter no tiene ninguna de esas dos claves, el `date:`. Un
  work item sin fecha válida no se archiva. Las épicas y las stories en cualquier otro estado quedan en `specs/flow/`.
- **Escritores del archivo:** las historias las archiva `story-complete` y las épicas `epic-complete`, siempre con
  confirmación humana explícita. `epic-complete` escribe `COMPLETED` de épica desde `SHIP/DONE` y archiva sin cambiar
  el status las épicas que ya están en `COMPLETED/DONE` o `CANCELED/DONE`.
- **Numeración de épicas:** el siguiente `EPIC-NN` es el máximo `NN` de la unión de `specs/flow/EPIC-*/epic.md` y
  `specs/flow/archive/*-EPIC-*/epic.md` más uno; en las archivadas, el `NN` es el del `EPIC-NN` que sigue al prefijo
  `<YYYY-MM-DD>-`. Si `specs/flow/archive/` no existe, se omite. Un número de épica archivada nunca se reutiliza, igual
  que los de las historias.
- **Resolución de épicas:** los skills que trabajan sobre una épica activa (por ejemplo, los gates de `PLAN`) solo
  resuelven épicas de `specs/flow/EPIC-*/`; una épica archivada es terminal y no se reabre ni se analiza.
- **Nombre de directorio:** los directorios de `specs/flow/` conservan el slug: `STORY-NNN-<slug>/` y
  `EPIC-NN-<slug>/`, como en ADR-0004 y ADR-0017; el archivo solo les antepone la fecha.

## Rationale

1. **Mismo layout, una sola regla de archivo.** Re-enunciar el layout de ADR-0017 deja un único ADR vigente que lo
   describe entero; solo cambian la viñeta de archivo y las que se derivan de ella (escritores, numeración y
   resolución).
2. **El prefijo distingue el tipo, el status distingue el cierre.** Historias y épicas conviven en un archivo plano:
   `STORY-` o `EPIC-` tras la fecha dice qué es, y el `status` del frontmatter, que no cambia al archivar, dice si se
   entregó o se canceló (KISS).
3. **Un único criterio de fecha.** La cadena `updated:` → `created:` → `date:` es la misma para historias y épicas.
4. **La numeración se deriva del filesystem.** Contar activas y archivadas reutiliza el patrón con el que
   `epic-generate-stories` ya numera las historias, sin estado nuevo que pueda divergir.

## Alternativas consideradas

- **Editar la viñeta de archivo de ADR-0017 in place:** descartada porque viola la inmutabilidad de los ADR aceptados.
- **ADR nuevo que solo trate el archivo de épicas y deje ADR-0017 `ACCEPTED`:** descartada porque dos ADR vigentes se
  contradirían («las épicas quedan en `specs/flow/`»).
- **ADR nuevo solo con el archivo de épicas y ADR-0017 `SUPERSEDED`:** descartada porque el layout de tres raíces
  quedaría sin ADR vigente que lo enuncie.
- **Subdirectorio `specs/flow/archive/epics/` o sufijo/prefijo por tipo:** descartada porque contradice «sin
  subniveles» y cambia el formato de directorio con el que se resuelven los globs y los wikilinks `EPIC-NN-<slug>`; el
  prefijo `EPIC-`/`STORY-` ya distingue el tipo.
- **Contador persistente de épicas en un archivo:** descartada porque introduce estado nuevo que puede divergir del
  filesystem.
- **Numerar solo sobre las épicas activas:** descartada porque reutilizaría el número de una épica archivada y
  rompería el `parent` y los wikilinks de sus historias.

## Consecuencias

**Positivas:**
- `specs/flow/` puede quedar solo con el trabajo activo: `epic-complete` archiva las épicas cerradas, siempre con
  confirmación humana.
- Historias y épicas archivadas siguen la misma regla de fecha y de nombre de directorio.
- Los números de épica son únicos en todo el historial del repositorio.

**Negativas / trade-offs:**
- Los skills que crean épicas consultan también `specs/flow/archive/` para numerar.
- Un lector del archivo debe mirar el `status` de cada work item para saber si se entregó o se canceló; el índice
  `docs/index.md` no lo muestra.
- Las menciones «(ADR-0016)» y «(ADR-0017)» de skills y documentos que describen el layout o el archivo de historias
  siguen siendo válidas; la nota de reemplazo de ADR-0017 remite a este ADR.
- Las épicas `COMPLETED` o `CANCELED` que ya existan en `specs/flow/` no se mueven automáticamente: archivarlas es una
  decisión del usuario con `epic-complete`.

## Referencias

- [[layout-fijo-con-archivo-de-historias-canceladas]] — ADR-0017, decisión reemplazada
- [[nivel-l2-epic-y-directorios-numerados]] — ADR-0004, convención `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/`
- [[EPIC-23-completar-flujo-de-epic]] — épica que origina esta decisión
- [[STORY-175-admitir-epicas-archivadas-en-layout]] — historia que la aplica
