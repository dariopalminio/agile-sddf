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
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# DoD CODE-REVIEW — Story

- [ ] Se cumplen los estándares del proyecto (`constitution.md`)
- [ ] Cada escenario Gherkin tiene correspondencia en el código
- [ ] Los componentes respetan la arquitectura de `design.md`
- [ ] Sin tareas pendientes en `tasks.md` (si existe el archivo)
- [ ] Metadatos frontmatter de `story.md` están completos y correctos
