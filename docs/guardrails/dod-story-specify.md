---
alwaysApply: false
type: guardrail
kind: transition
enforcement: warn
from: SPECIFY/IN-PROGRESS
to: SPECIFY/DONE
applies-to: story
slug: dod-story-specify
title: "DoD SPECIFY — Story (transition guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# DoD SPECIFY — Story

## ✅ Criterios de Especificación

- [ ] La historia tiene un título descriptivo y claro
- [ ] La descripción de la historia es completa y comprensible
- [ ] Cumple los criterios de formato de historia de usuario (Como {rol} quiero {acción} para {beneficio}):
- [ ] Tiene criterios de aceptación en formato Gherkin (Given-When-Then) que cubren los escenarios principales
- [ ] Cumple los criterios INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- [ ] La historia tiene el frontmatter completo con metadata correcta (status, substatus, tags, etc.)
- [ ] La historia tiene el frontmatter con referencia a la épica padre si está incluida en una épica (`epic.md`)
- [ ] La historia tiene referencias a historias relacionadas cercanas (historias hermanas de división por split)
