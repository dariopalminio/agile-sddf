---
alwaysApply: false
type: story
id: STORY-197
kind: chore
slug: STORY-197-skills-de-especificacion-y-epica
title: "Skills de especificación y épica sobre changes/"
status: DELIVER
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-18
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Skills de especificación y épica sobre changes/

**Como** Solo Builder que especifica historias y gestiona épicas  
**Quiero** que los skills de especificación (`story-creation`, `story-evaluation`, `story-split`, `story-refine`, `story-specify`, `story-improve`) y de épica (`epic-*`), sus evals y sus fixtures usen `changes/` y `changes/archive/`  
**Para** crear, numerar, analizar, validar y cerrar work items en la raíz nueva

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – numeración con archivo
```gherkin
Dado una épica activa en "changes/EPIC-029-x/" y otra archivada en "changes/archive/2026-10-01-EPIC-030-y/"
Cuando el usuario crea una épica nueva
Entonces la épica nueva recibe "EPIC-031" y se crea en "changes/"
```

## 📎 Notas / contexto adicional

- Cubre parte de **CS-2** de EPIC-030.
- Los fixtures con un directorio físico `specs/flow/` se renombraron a `changes/` con `git mv`.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
