---
type: wiki
slug: specs-index
title: "Especificaciones"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-10-24
---

# Especificaciones (`specs/`)

**Propósito:** estado del trabajo — responde *¿qué estamos construyendo ahora?* Es una de las tres
raíces hermanas del layout fijo (ADR-0016), junto a `docs/` (conocimiento) y `workflow/` (proceso).

**Convención de nombres:** dos niveles de work item, épicas (L2) e historias (L1), como hermanos en
`flow/`, sin subniveles por tipo.

```
specs/
├── flow/
│   ├── EPIC-NN-<slug>/epic.md                    # L2 — entregables
│   ├── STORY-NNN-<slug>/story.md                 # L1 — historias atómicas
│   └── archive/<YYYY-MM-DD>-STORY-NNN-<slug>/    # historias COMPLETED archivadas
└── living/                                       # reservado: especificación viva
```

Cada directorio de historia puede contener además sus derivados (`design.md`, `tasks.md`,
`testcases.md`, `analyze.md`, `*-report.md`); el índice solo enumera el nodo principal. La fecha del
prefijo de archivo es el `updated:` de la historia o, si falta, su `created:`. Las épicas y las
historias `CANCELED` no se archivan.

La visión, stakeholders, objetivos y roadmap viven en `docs/product/`; los requisitos viven en
`docs/requirements/`.

Volver al mapa: [[index]].
