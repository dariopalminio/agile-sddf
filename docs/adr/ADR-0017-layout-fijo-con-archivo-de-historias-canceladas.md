---
type: adr
id: ADR-0017
slug: layout-fijo-con-archivo-de-historias-canceladas
title: "Layout fijo de tres raíces con archivo de historias completadas y canceladas"
status: SUPERSEDED
date: 2026-10-25
supersedes: ADR-0016
superseded-by: ADR-0019
---

# ADR-0017: Layout fijo de tres raíces con archivo de historias completadas y canceladas

> **Superado por [ADR-0019](ADR-0019-layout-fijo-con-archivo-de-epicas.md) (2026-10-30):** el layout de tres raíces se mantiene; el archivo admite también las épicas `COMPLETED` y `CANCELED`.

## Contexto y problema

[ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md) fijó el layout de tres raíces (`docs/`, `specs/` y `workflow/`) y
una regla de archivo que admite en `specs/flow/archive/` **solo** las historias `COMPLETED`, con la fecha de `updated:`
o, si falta, de `created:`. Las historias `CANCELED` quedan para siempre en `specs/flow/`, mezcladas con el trabajo
activo, aunque nunca se vayan a retomar.

EPIC-27 (Completar el flujo de story) entrega el skill `story-complete`, que archiva las historias cerradas. STORY-164
necesita que ese skill saque también de `specs/flow/` las historias canceladas, sin que una historia cancelada se
confunda con una entregada en el registro histórico. La regla de ADR-0016 lo impide y, por ser un ADR aceptado, no se
edita in place.

Además, el archivo existente (98 historias) se generó con `scripts/migrate-specs-to-flow.js`, cuya cadena de fecha ya
recurre a `date:` cuando el frontmatter no tiene `updated:` ni `created:`; ADR-0016 no recogía ese respaldo.

Origen: EPIC-27, STORY-164 (split de STORY-160).

## Decisión

El repositorio mantiene **sin cambios** el layout fijo de tres raíces hermanas de ADR-0016 y amplía la regla de
archivo a las historias `CANCELED`.

```
<REPO_ROOT>/
├── docs/                  conocimiento: product/, requirements/, domains/, architecture/, adr/,
│                          policies/, guardrails/, guides/, runbooks/, templates/, constitution.md, index.md
├── specs/                 estado
│   ├── flow/              work items planos: EPIC-NN-<slug>/, STORY-NNN-<slug>/ (sin epics/ ni stories/)
│   │   └── archive/       stories COMPLETED o CANCELED: <YYYY-MM-DD>-STORY-NNN-<slug>/
│   └── living/            reservado (épica de Living Spec)
└── workflow/              proceso, reservado (épica de Workflow)
```

- `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` son raíces hermanas en la raíz del repo.
- El layout **no es configurable**: siguen retirados `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y la variable
  `SPECS_BASE`. Los skills solo resuelven `REPO_ROOT` y usan rutas fijas (`specs/flow/…`, `docs/templates/`,
  `docs/guardrails/`).
- `docs/requirements/` no se mueve en esta decisión; su destino es `specs/living/` en la épica de Living Spec.
- **Archivo:** `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` recibe las stories con `status: COMPLETED` o
  `status: CANCELED` (ambas con `substatus: DONE`); el status se conserva al archivar y es lo que distingue una
  historia entregada de una cancelada. `<YYYY-MM-DD>` es el `updated:`; si no es válido, el `created:`; si el
  frontmatter no tiene ninguna de esas dos claves, el `date:`. Una story sin fecha válida no se archiva. Las épicas y
  las stories en cualquier otro estado quedan en `specs/flow/`.
- **Nombre de directorio:** los directorios de `specs/flow/` conservan el slug: `STORY-NNN-<slug>/` y
  `EPIC-NN-<slug>/`, como en ADR-0004 y ADR-0016.

## Rationale

1. **Mismo layout, una sola regla de archivo.** Re-enunciar el layout de ADR-0016 deja un único ADR vigente que lo
   describe entero; solo cambia la viñeta de archivo.
2. **El status distingue, no la ruta.** Canceladas y completadas conviven en un archivo plano; el `status` del
   frontmatter, que no cambia al archivar, basta para distinguirlas sin subniveles ni sufijos (KISS).
3. **Un único criterio de fecha.** La cadena `updated:` → `created:` → `date:` es la misma con la que se generó el
   archivo actual: todas las fechas del archivo siguen la misma regla.

## Alternativas consideradas

- **Editar la viñeta de archivo de ADR-0016 in place:** descartada porque viola la inmutabilidad de los ADR aceptados.
- **ADR nuevo que solo trate el archivo y deje ADR-0016 `ACCEPTED`:** descartada porque dos ADR vigentes se
  contradirían en la viñeta de archivo.
- **ADR nuevo solo con el archivo y ADR-0016 `SUPERSEDED`:** descartada porque el layout de tres raíces quedaría sin
  ADR vigente que lo enuncie.
- **Subdirectorio `specs/flow/archive/canceled/` o sufijo `-canceled`:** descartada porque contradice «sin subniveles»
  y cambia el formato de directorio con el que se resuelven los globs y los wikilinks `STORY-NNN-<slug>`.
- **Reescribir las referencias «(ADR-0016)» de los skills a «(ADR-0017)»:** descartada porque toca más de veinte
  skills sin cambio de comportamiento; la nota de reemplazo de ADR-0016 remite a este ADR.

## Consecuencias

**Positivas:**
- `specs/flow/` puede quedar solo con el trabajo activo: `story-complete` archiva también las historias
  `CANCELED/DONE`, sin cambiar su status y siempre con confirmación humana.
- La fecha de archivo sigue una única regla para todas las historias archivadas.

**Negativas / trade-offs:**
- Un lector del archivo debe mirar el `status` de cada historia para saber si se entregó o se canceló; el índice
  `docs/index.md` no lo muestra.
- Las menciones «(ADR-0016)» de skills y documentos que se refieren al layout siguen siendo válidas (el layout no
  cambia); las que describen la regla de archivo se actualizan a este ADR.
- Las historias `CANCELED` que ya existen en `specs/flow/` no se mueven automáticamente: archivarlas es una decisión
  del usuario con `/story-complete`.

## Referencias

- [[layout-fijo-de-tres-raices]] — ADR-0016, decisión reemplazada
- [[nivel-l2-epic-y-directorios-numerados]] — ADR-0004, convención `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/`
- [[EPIC-27-completar-flujo-de-story]] — épica que origina esta decisión
- [[STORY-164-archivar-historias-canceladas]] — historia que la aplica
