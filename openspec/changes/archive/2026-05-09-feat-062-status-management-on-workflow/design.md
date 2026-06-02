## Context

Los skills del flujo SDD (`story-creation`, `story-plan`, `story-analyze`, `story-implement`) operan sobre `story.md` pero ninguno actualiza los campos `status` y `substatus` del frontmatter. Estos campos existen en el template y en todas las historias generadas, pero quedan estáticos en `BACKLOG/TODO` durante todo el ciclo de vida.

Sin estado actualizado en `story.md`:
- No hay visibilidad del progreso sin revisar manualmente qué artefactos existen
- Los skills no pueden aplicar precondiciones (ej. `story-implement` no puede verificar que el planning esté completo)
- El checklist del `release.md` padre no refleja qué historias han sido implementadas

El frontmatter actual de `story.md` ya tiene los campos; solo falta que los skills los lean y actualicen.

## Goals / Non-Goals

**Goals:**
- Definir una máquina de estados finita para el ciclo de vida de una historia SDD
- Hacer que cada skill responsable de una transición actualice el frontmatter de `story.md` al inicio y/o al finalizar
- Agregar precondición en `story-implement`: solo ejecutable si `status: READY-FOR-IMPLEMENT` + `substatus: DONE`
- Actualizar `- [ ]` → `- [x]` en `release.md` padre al alcanzar `READY-FOR-CODE-REVIEW/DONE`
- Diseñar la actualización como una operación de escritura directa sobre el frontmatter YAML del archivo

**Non-Goals:**
- Crear un sistema externo de tracking o base de datos de estados
- Agregar validaciones de estado en `story-design` o `story-tasking` (son subskills invocados por `story-plan`; el estado lo gestiona el orquestador)
- Retroactivamente actualizar estados de historias existentes
- Implementar rollback de estado si un skill falla a mitad de ejecución

## Decisions

### Decisión 1: Actualización directa del frontmatter YAML, sin capa de abstracción

**Elegida:** Cada skill actualiza directamente los campos `status` y `substatus` del frontmatter de `story.md` mediante lectura y escritura del archivo. El LLM escribe el archivo con los campos actualizados inline — sin script externo, sin librería de parsing YAML.

Esto es coherente con el principio KISS del proyecto: los skills son instrucciones Markdown y el LLM es quien ejecuta la acción de escritura.

Alternativa descartada: un script `update-story-status.ts` auxiliar. Añade complejidad de infraestructura para un cambio puntual de dos campos.

### Decisión 2: Máquina de estados lineal con estados MAYÚSCULAS

**Elegida:** Los estados válidos son:
```
BACKLOG/TODO  (default implícito — sin transición explícita)
  ↓
SPECIFY/IN‑PROGRESS  → seteado por story-creation/story-refine al inicio
READY-FOR-PLAN/DONE    → seteado por story-creation/story-refine al finalizar
  ↓
PLAN/IN‑PROGRESS    → seteado por story-plan al inicio del pipeline
READY-FOR-IMPLEMENT/DONE      → seteado por story-analyze al finalizar (último paso del pipeline)
  ↓
IMPLEMENTING/IN‑PROGRESS → seteado por story-implement al inicio
READY-FOR-CODE-REVIEW/DONE   → seteado por story-implement al finalizar
```

Convención: `status` en MAYÚSCULAS (READY-FOR-PLAN, PLANNING…), `substatus` en MAYÚSCULAS (IN‑PROGRESS, DONE).

Alternativa descartada: estados en minúsculas o kebab-case. El frontmatter existente ya usa MAYÚSCULAS en las historias de ejemplo del proyecto (`status: BACKLOG`, `substatus: TODO`).

### Decisión 3: story-plan gestiona la transición inicial; story-analyze gestiona el cierre

**Elegida:** `story-plan` (el orquestador) es el responsable de poner `PLAN/IN‑PROGRESS` al inicio porque tiene el contexto del pipeline completo. `story-analyze` (el último sub-skill del pipeline) pone `READY-FOR-IMPLEMENT/DONE` al concluir porque es el punto de cierre natural.

`story-design` y `story-tasking` no gestionan estado — son subskills y su estado está implícito en el pipeline de `story-plan`.

Alternativa descartada: que `story-plan` gestione ambas transiciones. Requiere esperar a que los tres sub-skills terminen para actualizar, lo que complica el fail-fast (si `story-design` falla, `PLAN/IN‑PROGRESS` quedaría sin cierre).

### Decisión 4: Precondición en story-implement — no en story-plan

**Elegida:** Solo `story-implement` verifica el estado antes de ejecutar (`READY-FOR-IMPLEMENT/DONE` requerido). `story-plan` no verifica el estado previo (puede ejecutarse sobre historias en cualquier estado para regenerar artefactos).

Esto permite que `story-plan` sea idempotente y re-ejecutable, mientras que `story-implement` es el gate que protege la fase de implementación.

### Decisión 5: Release checklist actualizado por story-implement al alcanzar READY-FOR-CODE-REVIEW/DONE

**Elegida:** Solo `story-implement` actualiza el checklist del `release.md` padre. Busca la historia por `story_id` en el archivo del release y cambia `- [ ] FEAT-NNN` → `- [x] FEAT-NNN`.

Si no encuentra el `release.md` o la historia no está listada en el checklist, emite un warning y continúa (no bloquea la finalización de la implementación).

Alternativa descartada: un evento/hook externo. Los skills son Markdown puro; añadir hooks requiere infraestructura de eventos fuera del alcance de este feature.

## Risks / Trade-offs

- **Historias sin `status` en frontmatter** → El LLM agrega el campo al escribirlo por primera vez. Sin efecto en historias existentes hasta que se ejecute el skill correspondiente. Trade-off aceptado: no hay migración masiva.
- **story-analyze en modo Agent (invocado por story-plan)** → Debe detectar que está en modo Agent y aún así actualizar el estado. Si `story-analyze` falla técnicamente antes de actualizar, el estado queda en `PLAN/IN‑PROGRESS`. Mitigación: `story-plan` registra en su resumen final si el estado fue actualizado correctamente.
- **Múltiples ejecuciones de story-plan** → Si se ejecuta `story-plan` dos veces sobre la misma historia (ej. para regenerar design.md), el estado vuelve a `PLAN/IN‑PROGRESS`. Esto es intencional: la re-ejecución indica que el planning está en curso de nuevo. Trade-off aceptado.
- **Release parent no encontrado** → `story-implement` emite warning y continúa. No es bloqueante. Documentado en `implement-report.md`.
