---
type: wiki
slug: specs-index
title: "Especificaciones"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-09-22
---

# Especificaciones (`specs/`)

**Propósito:** construcción por incremento — responde *¿cómo lo construimos ahora?* Vive días o
semanas y la usan el equipo y los agentes IA.

**Convención de nombres:** dos niveles: épicas (L2) e historias (L1).

```
specs/
├── epics/EPIC-NN-<slug>/epic.md           # L2 — entregables
└── stories/STORY-NNN-<slug>/story.md      # L1 — historias atómicas
```

Cada directorio de historia puede contener además sus derivados (`design.md`, `tasks.md`,
`testcases.md`, `analyze.md`, `*-report.md`); el índice solo enumera el nodo principal.
`specs/.cache/` es caché regenerable y no se versiona.

La visión, stakeholders, objetivos y roadmap viven en `product/`; los requisitos viven en `requirements/`.

Volver al mapa: [[index]].
