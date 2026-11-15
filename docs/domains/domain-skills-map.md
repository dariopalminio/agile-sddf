---
type: domain
slug: domain-skills-map
title: "Mapa de skills por nivel del pipeline"
created: 2026-10-08
updated: 2026-11-14
---

# Mapa de skills por nivel del pipeline

> Documento operativo: indica **quién** lee, escribe o cambia el estado de cada artefacto. El ciclo de vida de cada
> nivel vive en [[domain-epic-lifecycle]] y [[domain-story-lifecycle]]. Este mapa se completa de forma incremental:
> hoy solo cubre las entradas añadidas por historias que lo actualizaron.

## Épica (L2)

| Skill | Momento | Lee | Escribe | Cambia estado |
|---|---|---|---|---|
| `epic-analyze` | `PLAN`, después de `epic-generate-stories` / `epic-generate-all-stories` y antes de la aprobación del PO (`PLAN/DONE`, escrita a mano) | `epic.md` (sección con clave `historias`), `parent` de los `story.md`, template de épica y `epic-analyze-report-template.md` | `<EPIC_DIR>/epic-analyze-report.md` | — (veredicto informativo `APPROVED` / `NEEDS-REFINEMENT`) |
| `epic-track-progress` | `DEVELOP`, antes de `/epic-validate` y tras un `NEEDS-CHANGES` de este | `epic.md` (sección con clave `historias`) y el frontmatter (`parent`, `status`, `substatus`) de los `story.md` activos y archivados | — (solo chat) | — |
| `epic-validate` | `VALIDATE`, tras `epic-track-progress` con todas las historias terminadas | `epic.md` (secciones con clave `historias` y `smoke-tests`), el frontmatter (`parent`, `status`, `substatus`) de los `story.md` activos y archivados y la mención `SMOKE-N` en su cuerpo, `verdict` de `epic-analyze-report.md`, `sddf.config.yaml` (`verify.e2e-smoke`), `package.json` (`verify:release`), `docs/guardrails/dod-epic-validate.md`, `verdict` de los `acceptance-report.md`/`verify-report.md` de las historias dueñas (`--mode manual`) y `epic-validate-report-template.md` | `<EPIC_DIR>/epic-validate-report.md` y `epic.md` (solo `status`, `substatus` y `updated`, gateway) | `VALIDATE → VALIDATE/DONE` (`APPROVED`) · `VALIDATE → DEVELOP/IN-PROGRESS` (otro veredicto) |
| `epic-ship` | `SHIP`, tras el `APPROVED` de `/epic-validate` y antes de `/epic-complete` | `verdict` de `epic-validate-report.md`, `epic.md` (`title`, `status`, `substatus`, primera frase de `## Objetivo`), el frontmatter (`id`, `title`, `kind`, `parent`, `status`, `substatus`) de los `story.md` hijos activos y archivados, `CHANGELOG.md`, `substatus` de las demás épicas activas y `docs/guardrails/dod-epic-ship.md` | Bloque delimitado de la épica en `CHANGELOG.md` si no está al día y `epic.md` (solo `status`, `substatus` y `updated`) | `VALIDATE/DONE → SHIP/IN-PROGRESS` tras los gates · `→ SHIP/DONE` solo sin bloqueos del DoD y con confirmación humana; nunca ejecuta commit, tag, merge, push ni despliegue |
| `epic-complete` | `SHIP/DONE → COMPLETED`, tras `/epic-ship` | `epic.md` (frontmatter) y `CHANGELOG.md` (encabezado `## [x.y.z]` del bloque de `epic-ship`, solo sin `--version`) | `epic.md` (solo `status`, `updated`, `completed` y, si se conoce, `version`, desde `SHIP/DONE`) y mueve `<EPIC_DIR>/` a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NNN-<slug>/`; nunca hace commit | `SHIP/DONE → COMPLETED/DONE` solo con confirmación humana; `COMPLETED/DONE` y `CANCELED/DONE` se archivan sin cambio de status |

## Historia (L1)

Transiciones de la planificación y de los tres gates según ADR-0022 ([[workflows-sin-estados-buffer]]).

| Skill | Momento | Lee | Escribe | Cambia estado |
|---|---|---|---|---|
| `story-analyze` | `PLAN`, invocado por `story-plan` tras `story-design` y `story-tasking`/`story-testcases` | `story.md`, `design.md`, `testcases.md` y/o `tasks.md`, `docs/guardrails/dod-story-plan.md`, `epic.md` padre | `analyze.md` y `story.md` (solo `status`/`substatus`) | `PLAN/IN-PROGRESS → PLAN/DONE` (`APPROVED`) · sin cambio (`NEEDS-CHANGES`) |
| `story-code-review` | `IMPLEMENT/DONE`, antes de `story-verify` | `story.md`, `design.md`, `implement-report.md`, `testcases.md`, `tasks.md`, `constitution.md`, `dod-story-code-review.md`, `REVIEW.md` | `code-review-report.md`; `fix-directives.md` con `NEEDS-CHANGES` (lo borra con `APPROVED`) | `→ CODE-REVIEW/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ IMPLEMENT/DONE` (`BLOCKED`) |
| `story-verify` | `CODE-REVIEW/DONE`, antes de `story-acceptance` | `story.md`, `dod-story-verify.md`, `sddf.config.yaml` | `verify-report.md`; `fix-directives.md` (`based-on: verify-report.md`) con `NEEDS-CHANGES` | `→ VERIFY/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ VERIFY/BLOCKED` (`BLOCKED`) |
| `story-acceptance` | `VERIFY/DONE`, antes de `story-delivery` | `story.md`, `dod-story-acceptance.md`, `acceptance-report.md` previo | `acceptance-report.md`; `fix-directives.md` (`based-on: acceptance-report.md`) con `NEEDS-CHANGES` | `→ ACCEPTANCE/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ ACCEPTANCE/BLOCKED` (`BLOCKED`) |
