---
type: wiki
slug: changes-index
title: "Flujo de cambios"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-11-18
updated: 2026-11-18
---

# Flujo de cambios (`changes/`)

**Propósito:** trabajo de cambio — responde *¿qué estamos cambiando ahora?* Es una de las cuatro raíces
hermanas del layout fijo (ADR-0023), junto a `docs/` (conocimiento), `specs/` (especificación viva) y
`workflow/` (proceso).

**Convención de nombres:** dos niveles de work item, épicas (L2) e historias (L1), como hermanos, sin
contenedores por tipo.

```
changes/
├── EPIC-NNN-<slug>/epic.md                       # L2 — entregables
├── STORY-NNN-<slug>/story.md                     # L1 — historias atómicas
└── archive/
    ├── <YYYY-MM-DD>-EPIC-NNN-<slug>/             # épicas COMPLETED o CANCELED
    └── <YYYY-MM-DD>-STORY-NNN-<slug>/            # historias COMPLETED o CANCELED
```

Cada directorio de historia puede contener además sus derivados (`design.md`, `tasks.md`,
`testcases.md`, `analyze.md`, `*-report.md`); el índice solo enumera el nodo principal.

**Archivo:** recibe historias y épicas con `status: COMPLETED` o `CANCELED`, siempre con
`substatus: DONE`, conservando su status y su slug; el directorio solo antepone la fecha, que es el
`updated:`, o si no es válido el `created:`, o si faltan ambas claves el `date:`. Las historias las
archiva `/story-complete` y las épicas `/epic-complete`, con confirmación humana. El archivo conserva el
historial, pero no sustituye a la especificación viva de `specs/`.

**Numeración:** el siguiente número de cada nivel es el máximo de los ítems activos de `changes/` y de
los archivados de `changes/archive/`, más uno. Ningún identificador archivado se reutiliza.

Volver al mapa: [[index]].
