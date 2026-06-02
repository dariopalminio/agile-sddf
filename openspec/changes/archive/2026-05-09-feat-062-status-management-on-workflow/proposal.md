<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## Why

Los skills del flujo SDD generan artefactos pero no actualizan el estado de la historia en `story.md`, dejando el frontmatter (`status`/`substatus`) siempre estático y sin reflejo del progreso real. Esto impide detectar en qué etapa se encuentra una historia, fuerza al desarrollador a inferirlo manualmente revisando qué archivos existen, y no permite que los skills apliquen precondiciones basadas en estado.

## What Changes

- **`story-creation` / `story-refine`**: Actualiza `status: SPECIFY / substatus: IN‑PROGRESS` al iniciar y `status: READY-FOR-PLAN / substatus: DONE` al finalizar la especificación.
- **`story-plan`**: Actualiza `status: PLANNING / substatus: IN‑PROGRESS` al comenzar el pipeline de planning.
- **`story-analyze`**: Actualiza `status: READY-FOR-IMPLEMENT / substatus: DONE` al concluir el análisis de coherencia (último paso del pipeline de planning).
- **`story-implement`**: Agrega precondición — solo puede ejecutarse si `status: READY-FOR-IMPLEMENT` y `substatus: DONE`. Actualiza `status: IMPLEMENTING / substatus: IN‑PROGRESS` al iniciar y `status: READY-FOR-CODE-REVIEW / substatus: DONE` al finalizar.
- **Release checklist**: Al alcanzar `READY-FOR-CODE-REVIEW / DONE`, el skill actualiza `- [ ]` → `- [x]` en el `release.md` padre para la historia correspondiente.
- **Máquina de estados**: El ciclo completo queda definido formalmente como: `SPECIFY/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLAN/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENTING/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`.

## Capabilities

### New Capabilities

- `story-lifecycle-states`: Define la máquina de estados del ciclo de vida de una historia SDD: estados válidos, transiciones permitidas, reglas de precondición por skill y convención de actualización del frontmatter. Es la fuente de verdad para todos los skills que leen o escriben `status`/`substatus`.

### Modified Capabilities

- `story-refine-skill`: Agrega transiciones de estado al inicio (`SPECIFY/IN‑PROGRESS`) y al finalizar (`READY-FOR-PLAN/DONE`).
- `story-plan-skill`: Agrega transición de estado al inicio del pipeline (`PLAN/IN‑PROGRESS`). Delega la transición de cierre (`READY-FOR-IMPLEMENT/DONE`) a `story-analyze`.
- `story-analyze-skill`: Agrega actualización de estado al finalizar (`READY-FOR-IMPLEMENT/DONE`).
- `story-implement-skill`: Agrega precondición de estado (`READY-FOR-IMPLEMENT/DONE` requerido), transición al inicio (`IMPLEMENTING/IN‑PROGRESS`), transición al finalizar (`READY-FOR-CODE-REVIEW/DONE`) y actualización del checklist en `release.md`.
- `story-workflow-mvp`: Actualiza el workflow canónico para reflejar los estados visibles entre cada skill.

## Impact

- **Artefactos modificados en runtime**: `story.md` (frontmatter `status`/`substatus`) y, al completar la implementación, `release.md` del release padre.
- **Sin cambios en templates**: Los templates de `story.md` y `release.md` ya incluyen campos `status` y `substatus` — solo se escribe en campos existentes.
- **Backwards compatibility**: Historias sin `status` en frontmatter se tratan como `BACKLOG/TODO` (comportamiento actual implícito); los skills añaden el campo al actualizarlo por primera vez.
- **Skills NO afectados** (no tienen transiciones de estado propias): `story-design`, `story-tasking`, `story-split`, `story-evaluation` — sus transiciones son gestionadas por sus orquestadores (`story-refine` y `story-plan`).
