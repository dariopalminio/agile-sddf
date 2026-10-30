---
type: domain
slug: domain-skills-map
title: "Mapa de skills por nivel del pipeline"
created: 2026-10-08
updated: 2026-10-08
---

# Mapa de skills por nivel del pipeline

> Documento operativo: indica **quién** lee, escribe o cambia el estado de cada artefacto. El ciclo de vida de cada
> nivel vive en [[domain-epic-lifecycle]] y [[domain-story-lifecycle]]. Este mapa se completa de forma incremental:
> hoy solo cubre las entradas añadidas por historias que lo actualizaron.

## Épica (L2)

| Skill | Momento | Lee | Escribe | Cambia estado |
|---|---|---|---|---|
| `epic-analyze` | `PLAN`, después de `epic-generate-stories` / `epic-generate-all-stories` y antes de aprobar `READY-FOR-DEV` | `epic.md` (sección con clave `historias`), `parent` de los `story.md`, template de épica y `epic-analyze-report-template.md` | `<EPIC_DIR>/epic-analyze-report.md` | — (veredicto informativo `APPROVED` / `NEEDS-REFINEMENT`) |
| `epic-track-progress` | `DEVELOP`, antes de `/epic-validate` y tras un `NEEDS-CHANGES` de este | `epic.md` (sección con clave `historias`) y el frontmatter (`parent`, `status`, `substatus`) de los `story.md` activos y archivados | — (solo chat) | — |
| `epic-validate` | `VALIDATE`, tras `epic-track-progress` con todas las historias terminadas | `epic.md` (sección con clave `historias`), el frontmatter (`parent`, `status`, `substatus`) de los `story.md` activos y archivados, `verdict` de `epic-analyze-report.md` y `epic-validate-report-template.md` | `<EPIC_DIR>/epic-validate-report.md` | — (veredicto `APPROVED` / `NEEDS-CHANGES` / `BLOCKED`) |
