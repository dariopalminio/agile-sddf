---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: VERIFY/IN-PROGRESS
to: VERIFY/DONE
applies-to: story
slug: dod-story-verify
title: "DoD VERIFY — Story (transition guardrail)"
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# DoD VERIFY — Story

- [ ] Las pruebas pasan exitosamente
- [ ] No hay errores críticos ni bloqueantes
- [ ] El comportamiento coincide con lo especificado en `design.md` y `story.md`
- [ ] No fix que resolver
