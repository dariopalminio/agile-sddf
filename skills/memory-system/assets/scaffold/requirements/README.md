---
type: wiki
slug: requirements-index
title: "Requisitos"
status: IN-PROGRESS
substatus: DONE
parent: null
created: {date}
updated: {date}
---

# Requisitos (`requirements/`)

Un requisito describe comportamiento del producto; una historia declara `implements: [FR-NNN]`.
Los IDs `FR-NNN` y `NFR-NNN` son únicos, no se renumeran ni se reutilizan.

## Documento único primero, fragmentación cuando duela

| Disposición | Estructura | Cuándo |
| --- | --- | --- |
| SRS único (predeterminada) | `srs-<project-slug>.md` | Hasta 15 requisitos y 500 líneas |
| Fragmentada | `functional/FR-NNN-<slug>.md` + `non-functional/NFR-NNN-<slug>.md` | Más de 15 requisitos **o** más de 500 líneas |

El umbral es una recomendación: conflictos frecuentes de merge también justifican fragmentar.

## Resolver de requisitos

Para `[[FR-NNN]]` e `implements: [FR-NNN]`, `memory-system` resuelve en este orden: archivo
fragmentado, sección `### FR-NNN` de un `srs-*.md` y, por último, un error accionable.

## Migración y scaffold

- Antes de cambiar de disposición, ejecuta `/memory-system migrate --from=srs-single --dry-run`.
- Para volver opcionalmente a un SRS, ejecuta `/memory-system migrate --from=requirements-fragmented --dry-run`.
- `memory-system scaffold` crea el SRS solo si `requirements/` no tiene ninguna disposición; nunca
  crea directorios `functional/` o `non-functional/` vacíos ni sobrescribe un SRS existente.
- En disposición fragmentada, `requirements/index.md` es un catálogo generado por `memory-system index`.

Volver al mapa: [[index]].
