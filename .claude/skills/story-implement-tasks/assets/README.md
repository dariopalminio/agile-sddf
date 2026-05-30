# story-implement-tasks

Skill que implementa el código de una historia SDD tarea por tarea siguiendo TDD.

## Posicionamiento en el Flujo SDD

```
/story-refine                          [story.md: SPECIFYING/IN‑PROGRESS → READY-FOR-PLAN/DONE]
    ├── /story-creation   → Crea story.md
    ├── /story-evaluation → Evalúa con FINVEST
    └── /story-split      → Divide historias grandes
    ↓ [story.md: READY-FOR-PLAN/DONE]
/story-plan                            [story.md: → PLANNING/IN‑PROGRESS al inicio]
    ├── /story-design   → Genera design.md
    ├── /story-tasking  → Genera tasks.md
    └── /story-analyze  → Genera analyze.md [story.md: → READY-FOR-IMPLEMENT/DONE si sin ERROREs]
    ↓ [story.md: READY-FOR-IMPLEMENT/DONE]
/story-implement-tasks                       [story.md: → IMPLEMENTING/IN‑PROGRESS → IMPLEMENTING/DONE]
    → Implementa código tarea por tarea con TDD  ← aquí
    → Genera implement-report.md al finalizar
    → Actualiza checklist en release.md padre
```

## Precondiciones

El skill requiere que los tres artefactos de planning existan **y** que la historia esté en estado `READY-FOR-IMPLEMENT/DONE`:

| Precondición | Descripción |
|---|---|
| `story.md` presente | Criterios de aceptación (AC-1…N) |
| `design.md` presente | Componentes, interfaces, decisiones técnicas |
| `tasks.md` presente | Tareas atómicas con IDs T001, T002… |
| `status: READY-FOR-IMPLEMENT` + `substatus: DONE` | Planning completo y sin ERROREs |

Si algún artefacto falta o la historia no está en `READY-FOR-IMPLEMENT/DONE`, el skill detiene la ejecución con un mensaje descriptivo y sugiere `/story-plan`.

## Transiciones de estado

| Evento | status | substatus |
|--------|--------|-----------|
| Antes de la primera tarea | `IMPLEMENTING` | `IN‑PROGRESS` |
| Después de generar `implement-report.md` | `IMPLEMENTING` | `DONE` |

Al alcanzar `IMPLEMENTING/DONE`, el skill también actualiza el checklist en el `release.md` padre (campo `parent` del frontmatter de `story.md`).

## Artefacto generado

`implement-report.md` — Reporte de implementación con:
- Tabla de estado por tarea (ID, descripción, estado, archivos generados)
- Lista de tareas bloqueadas (si las hay) con razón y acción recomendada
- Nota sobre la ejecución manual de tests

## Uso

```
/story-implement-tasks FEAT-059
/story-implement-tasks FEAT-059 --path docs/specs/stories/FEAT-059-mi-historia/
```

## Contenido de este directorio

Este directorio (`assets/`) contiene templates y recursos usados por el skill en runtime.
Actualmente el skill no requiere templates externos — usa su estructura de reporte interna.
