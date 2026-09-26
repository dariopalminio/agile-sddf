---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: CODE-REVIEW/IN-PROGRESS
to: CODE-REVIEW/DONE
applies-to: story
slug: dod-story-code-review
title: "DoD CODE-REVIEW — Story (transition guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# DoD CODE-REVIEW — Story

- [ ] Se cumple [[dod-story-implement]]
- [ ] Se cumplen los estándares del proyecto (`constitution.md`)
- [ ] Cada escenario Gherkin tiene correspondencia en el código
- [ ] Los componentes respetan la arquitectura de `design.md`
- [ ] Sin hallazgo bloqueante de severidad HIGH o MEDIUM
- [ ] Sin tareas pendientes en `tasks.md` (si existe el archivo)
- [ ] Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados
- [ ] El reporte de revisión de código (`code-review-report.md`) está creado o actualizado
- [ ] Revisión de código aprobada (Review status approved en `code-review-report.md`)
