---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: SHIP/IN-PROGRESS
to: SHIP/DONE
applies-to: epic
slug: dod-epic-ship
title: "DoD SHIP — Epic (transition guardrail)"
created: 2026-11-04
updated: 2026-11-04
---

# DoD SHIP — Epic

- [ ] El árbol de trabajo está revisado y la versión objetivo sigue SemVer.
- [ ] `CHANGELOG.md` contiene una sola sección `## [<versión>] — <YYYY-MM-DD>` para la versión objetivo.
- [ ] Las verificaciones deterministas pasan sin ejecutar lifecycle scripts ni evaluaciones LLM: “npm ci --ignore-scripts”, “npm run verify:repository” y “npm pack --dry-run”.
- [ ] El `npm pack --dry-run` contiene solo la allowlist esperada: skills, agentes, configuración, scripts y documentación de distribución. No debe contener secretos, `.env`, `.tmp` ni artefactos locales.
- [ ] Las versiones en `package.json` y `package-lock.json` coherentes.
- [ ] Confirma que el tag apunta al commit validado y que la release usa la misma versión del changelog.
