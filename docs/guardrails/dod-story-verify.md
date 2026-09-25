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
created: 2026-09-24
updated: 2026-09-24
---

# DoD VERIFY — Story

- [ ] Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0)
- [ ] La suite completa `npm test` pasa sin fallos
- [ ] Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa; un fallo solo se acepta como flaky si pasa al reejecutarlo y queda registrado en `verify-report.md`
- [ ] Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre
- [ ] Sin defectos CRITICAL o HIGH abiertos en `verify-report.md`
