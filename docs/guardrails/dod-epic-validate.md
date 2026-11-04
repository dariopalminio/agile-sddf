---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: VALIDATE/IN-PROGRESS
to: VALIDATE/DONE
applies-to: epic
slug: dod-epic-validate
title: "DoD VALIDATE — Epic (transition guardrail)"
created: 2026-11-04
updated: 2026-11-04
---

# DoD VALIDATE — Epic

- [ ] El gate determinista del repositorio pasa: `npm run verify:repository`
- [ ] Cada smoke test que ningún eval cubre de punta a punta se recorrió a mano y su resultado quedó registrado
- [ ] Los criterios de salida (CS-N) de la épica se cumplen en su totalidad (donde N es el número de criterio de salida)




