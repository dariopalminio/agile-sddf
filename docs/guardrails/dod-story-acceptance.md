---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: ACCEPTANCE/IN-PROGRESS
to: ACCEPTANCE/DONE
applies-to: story
slug: dod-story-acceptance
title: "DoD ACCEPTANCE — Story (transition guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# DoD ACCEPTANCE — Story

## ✅ Criterios de Aceptación Funcional

- [ ] Todos los escenarios Gherkin de `story.md` han sido ejecutados manualmente y verificados
- [ ] Los criterios no funcionales de `story.md` (performance, UX, accesibilidad) han sido validados
- [ ] El comportamiento observado coincide con el valor de negocio descrito en la historia
- [ ] No se detectaron defectos bloqueantes durante la validación manual

## ✅ Criterios de Documentación y Trazabilidad

- [ ] `acceptance-report.md` generado con resultado final `ACCEPTANCE-APPROVED`
- [ ] Todos los criterios del reporte tienen resultado registrado (APPROVED/REJECTED/BLOCKED) con observaciones
- [ ] `story.md` actualizado con `status: ACCEPTANCE / substatus: DONE`
- [ ] El validador humano ha confirmado explícitamente la aprobación de la historia
