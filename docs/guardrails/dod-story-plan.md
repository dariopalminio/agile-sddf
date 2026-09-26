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
- [ ] Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`)
- [ ] No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR
- [ ] DEBE existir tasks.md o testcases.md o ambos (serán input para la planificación)
- [ ] Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md
- [ ] Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md

