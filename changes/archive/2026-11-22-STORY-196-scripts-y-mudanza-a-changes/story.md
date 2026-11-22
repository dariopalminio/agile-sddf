---
alwaysApply: false
type: story
id: STORY-196
kind: chore
slug: STORY-196-scripts-y-mudanza-a-changes
title: "Scripts deterministas y mudanza a changes/"
status: COMPLETED
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-22
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Scripts deterministas y mudanza a changes/

**Como** mantenedor de agile-sddf  
**Quiero** que `story-complete.js`, `epic-complete.js`, `epic-improve.js`, `memory-system.js`, `check-doc-links.js` y `run-evals.js` usen `changes/`, que los work items de este repositorio se muevan con `git mv specs/flow changes` y que se retire `scripts/migrate-specs-to-flow.js`  
**Para** que el gate siga verde tras la mudanza y el historial de cada work item se conserve

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – archivo en changes/archive/
```gherkin
Dado una historia en "changes/STORY-NNN-<slug>/" en "DELIVER/DONE"
Cuando se ejecuta "story-complete.js apply" con su ID
Entonces el directorio queda en "changes/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/"
  Y las referencias "changes/STORY-NNN-<slug>" de la documentación activa apuntan a la ruta archivada
```

### AC-2 — Escenario con datos – conteo y capas tras la mudanza
```gherkin
Dado el archivo con 30 épicas, 183 historias y 3 bugs en "specs/flow/archive/"
Cuando se ejecuta "git mv specs/flow changes" y "/memory-system index"
Entonces "changes/archive/" contiene los mismos 216 directorios
  Y "docs/index.md" los lista en la capa "changes-archive"
```

## 📎 Notas / contexto adicional

- Cubre **CS-3**, **CS-4**, **CS-5** y **CS-7** de EPIC-030.
- `check-doc-links.js` pasa a revisar `specs/` como raíz activa y excluye `changes/` como registro histórico; `story-complete` y `epic-complete` reescriben enlaces en las mismas raíces.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
