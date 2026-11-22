---
alwaysApply: false
type: story
id: STORY-198
kind: chore
slug: STORY-198-skills-de-planning-a-entrega
title: "Skills de planning a entrega sobre changes/"
status: COMPLETED
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-22
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Skills de planning a entrega sobre changes/

**Como** Solo Builder que planifica, implementa, revisa, verifica, acepta y entrega una historia  
**Quiero** que `story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-fix-plan`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `story-delivery` y `story-complete`, con sus evals, usen `changes/`  
**Para** recorrer el pipeline de historia sin rutas viejas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – el pipeline resuelve la historia en changes/
```gherkin
Dado una historia en "changes/STORY-NNN-<slug>/story.md"
Cuando el usuario ejecuta cualquier skill del pipeline de historia con "STORY-NNN"
Entonces el skill resuelve la historia en "changes/STORY-NNN-<slug>/" y escribe sus derivados en ese directorio
```

## 📎 Notas / contexto adicional

- Cubre parte de **CS-2** de EPIC-030.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
