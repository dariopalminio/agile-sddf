# story-implement-tasks

Skill que implementa el código de una historia SDD tarea por tarea siguiendo TDD.

## Posicionamiento en el Flujo SDD

```
/story-specify                         [story.md: SPECIFY/IN-PROGRESS → READY-FOR-PLAN/DONE]
    ├── /story-creation   → Crea story.md
    ├── /story-evaluation → Evalúa con FINVEST
    └── /story-split      → Divide historias grandes
    ↓ [story.md: READY-FOR-PLAN/DONE]
/story-plan                            [story.md: → PLAN/IN-PROGRESS al inicio]
    ├── /story-design   → Genera design.md
    ├── /story-tasking  → Genera tasks.md
    └── /story-analyze  → Genera analyze.md [story.md: → PLAN/DONE si verdict APPROVED]
    ↓ [story.md: PLAN/DONE]
/story-implement-tasks                       [story.md: → IMPLEMENT/IN-PROGRESS → IMPLEMENT/DONE]
    → Implementa código tarea por tarea con TDD  ← aquí
    → Genera implement-report.md al finalizar
    → Actualiza checklist en epic.md padre
```

## Precondiciones

El skill requiere que los tres artefactos de planning existan **y** que la historia esté en un estado de entrada admitido:

| Precondición | Descripción |
|---|---|
| `story.md` presente | Criterios de aceptación (AC-1…N) |
| `design.md` presente | Componentes, interfaces, decisiones técnicas |
| `tasks.md` presente | Tareas atómicas con IDs T001, T002… |
| `status: PLAN` + `substatus: DONE` | Ejecución inicial: planificación aprobada por `story-analyze` |
| `status: IMPLEMENT` + `substatus: TODO` | Rework devuelto por `story-code-review`, `story-verify` o `story-acceptance` (las correcciones las dispara solo `fix-directives.md`, que anuncia el gate de origen con `Origen:` desde su `based-on`; sin él, el skill avisa con `[WARN]` y continúa sin correcciones; sin tareas pendientes no sale por el gate anticipado) |
| `status: IMPLEMENT` + `substatus: IN-PROGRESS` | Reanudación tras DoD-ERRORs o ciclo interrumpido |
| `status: READY-FOR-IMPLEMENT` + `substatus: DONE` | Valor legado de la ventana de transición (ADR-0022), aceptado con aviso hasta 7.0.0: se trata como `IMPLEMENT/TODO` si existe `implement-report.md` y como `PLAN/DONE` si no |

Si algún artefacto falta o la historia no está en uno de esos estados, el skill detiene la ejecución con un mensaje descriptivo y sugiere `/story-plan`.

## Transiciones de estado

| Evento | status | substatus |
|--------|--------|-----------|
| Antes de la primera tarea | `IMPLEMENT` | `IN-PROGRESS` |
| Después de generar `implement-report.md` | `IMPLEMENT` | `DONE` |

Al alcanzar `IMPLEMENT/DONE`, el skill también actualiza el checklist en el `epic.md` padre (campo `parent` del frontmatter de `story.md`).

## Artefacto generado

`implement-report.md` — Reporte de implementación con:
- Tabla de estado por tarea (ID, descripción, estado, archivos generados)
- Lista de tareas bloqueadas (si las hay) con razón y acción recomendada
- Nota sobre la ejecución manual de tests

## Uso

```
/story-implement-tasks STORY-059
/story-implement-tasks STORY-059 --path specs/flow/STORY-059-mi-historia/
```

## Contenido de este directorio

Este directorio (`assets/`) contiene templates y recursos usados por el skill en runtime.
Actualmente el skill no requiere templates externos — usa su estructura de reporte interna.
