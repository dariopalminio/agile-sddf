---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: PLAN/IN-PROGRESS
to: PLAN/DONE
applies-to: story
slug: dod-story-plan
title: "DoD PLAN — Story (transition guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# DoD PLAN — Story

## ✅ Criterios de Artefactos de Planning

- [ ] story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales
- [ ] design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio
- [ ] tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación)
- [ ] Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`)
- [ ] No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR
