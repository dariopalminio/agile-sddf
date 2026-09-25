---
alwaysApply: false
type: guardrail
kind: index
status: deprecated
slug: dod-story-checklist
title: "DoD Story (deprecado)"
superseded-by:
  - dod-story-specify
  - dod-story-plan
  - dod-story-implement
  - dod-story-code-review
  - dod-story-verify
  - dod-story-acceptance
  - dod-story-deliver
removal: 4.0.0
created: 2026-09-24
updated: 2026-09-24
---

# DoD Story (deprecado) — ver [[dod-story-specify]], [[dod-story-plan]], [[dod-story-implement]], [[dod-story-code-review]], [[dod-story-verify]], [[dod-story-acceptance]], [[dod-story-deliver]]

El Definition of Done de historia se dividió en un guardrail por etapa: cada skill del pipeline
carga solo el de su etapa (sección `## DoD aplicable` de su `SKILL.md`). Este índice se conserva
durante la minor 3.3.x y se elimina en 4.0.0.

Para dividir un DoD monolítico propio: `/memory-system migrate --from=dod-monolithic`.
