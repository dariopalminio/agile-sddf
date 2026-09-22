---
type: wiki
slug: specs-index
title: "Especificaciones"
status: IN-PROGRESS
substatus: TODO
parent: null
created: {date}
updated: {date}
---

# Especificaciones (`specs/`)

**Propósito:** construcción por incremento — responde *¿cómo lo construimos ahora?* Vive días o
semanas y la usan el equipo y los agentes IA.

**Convención de nombres:** tres niveles con prefijo numérico que refleja el orden L3 → L2 → L1:

```
specs/
├── 01-projects/PROJ-NN-<slug>/project.md     # L3 — documentación fundacional
├── 02-epics/EPIC-NN-<slug>/epic.md           # L2 — entregables
└── 03-stories/STORY-NNN-<slug>/story.md      # L1 — historias atómicas
```

Cada directorio de historia puede contener además sus derivados (`design.md`, `tasks.md`,
`testcases.md`, `analyze.md`, `*-report.md`); el índice solo enumera el nodo principal.
`specs/.cache/` es caché regenerable y no se versiona.

Volver al mapa: [[index]].
