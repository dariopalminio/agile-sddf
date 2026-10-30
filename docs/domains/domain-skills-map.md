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
| `epic-validate` | `VALIDATE`, tras `epic-track-progress` con todas las historias terminadas | `epic.md` (secciones con clave `historias` y `smoke-tests`), el frontmatter (`parent`, `status`, `substatus`) de los `story.md` activos y archivados y la mención `SMOKE-N` en su cuerpo, `verdict` de `epic-analyze-report.md`, `sddf.config.yaml` (`verify.e2e-smoke`), `package.json` (`verify:release`), `docs/guardrails/dod-epic-validate.md`, `verdict` de los `acceptance-report.md`/`verify-report.md` de las historias dueñas (`--mode manual`) y `epic-validate-report-template.md` | `<EPIC_DIR>/epic-validate-report.md` y `epic.md` (solo `status`, `substatus` y `updated`, gateway) | `VALIDATE → VALIDATE/DONE` (`APPROVED`) · `VALIDATE → DEVELOP/IN-PROGRESS` (otro veredicto) |
| `epic-ship` | `SHIP`, tras el `APPROVED` de `/epic-validate` y antes de `/epic-complete` | `verdict` de `epic-validate-report.md`, `epic.md` (`title`, `status`, `substatus`, primera frase de `## Objetivo`), el frontmatter (`id`, `title`, `kind`, `parent`, `status`, `substatus`) y la línea `**Para**` de los `story.md` hijos activos y archivados, `CHANGELOG.md` | Bloque delimitado de la épica en `CHANGELOG.md`, `<EPIC_DIR>/release-notes.md` y `epic.md` (solo `status`, `substatus` y `updated`, tras confirmación) | `→ SHIP/DONE` solo con confirmación humana de que se completaron los pasos de liberación manuales; nunca ejecuta commit, tag, merge, push ni despliegue |
| `epic-complete` | `SHIP/DONE → COMPLETED`, tras `/epic-ship` y la verificación post-despliegue de la versión liberada | `epic.md` (frontmatter) y `CHANGELOG.md` (encabezado `## [x.y.z]` del bloque de `epic-ship`, solo sin `--version`) | `epic.md` (solo `status`, `updated`, `completed` y `version`, desde `SHIP/DONE`) y mueve `<EPIC_DIR>/` a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`; nunca hace commit | `SHIP/DONE → COMPLETED/DONE` solo con confirmación humana; `COMPLETED/DONE` y `CANCELED/DONE` se archivan sin cambio de status |
