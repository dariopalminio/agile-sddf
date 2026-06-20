# story-plan — Assets

Este directorio contiene recursos de referencia para el skill `story-plan`.

## Posicionamiento en el flujo SDD

```
                  ┌──────────────────────────────────────┐
                  │          /story-plan                 │
                  │   (orquestador — punto de entrada)   │
                  └──────────┬───────────────────────────┘
                             │
              ┌──────────────┼──────────────────┐
              ▼              ▼                  ▼
       /story-design   /story-tasking    /story-analyze
       (design.md)     (tasks.md)        (analyze.md)
```

## Artefactos producidos

| Artefacto   | Producido por   | Descripción                                         |
|-------------|-----------------|-----------------------------------------------------|
| design.md   | story-design    | Diseño técnico: componentes, interfaces, decisiones |
| tasks.md    | story-tasking   | Plan de implementación con tareas atómicas          |
| analyze.md  | story-analyze   | Reporte de coherencia entre los tres artefactos     |

## Precondiciones

- El directorio de la historia debe existir bajo `$SPECS_BASE/specs/stories/`
- El archivo `story.md` debe estar presente en el directorio de la historia
- Los skills `story-design`, `story-tasking` y `story-analyze` deben estar disponibles en `.claude/skills/`

## Transiciones de estado

| Evento | status | substatus |
|--------|--------|-----------|
| Al iniciar el pipeline (incondicional) | `PLAN` | `IN‑PROGRESS` |
| Cuando `story-analyze` finaliza sin ERROREs | `READY-FOR-IMPLEMENT` | `DONE` (gestionado por `story-analyze`) |

La transición a `PLAN/IN‑PROGRESS` se aplica siempre al inicio, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado.

## Comportamiento de idempotencia

Si los artefactos ya existen, cada sub-skill preguntará individualmente al usuario si desea sobreescribirlos. `story-plan` no implementa lógica de sobreescritura propia — delega esta decisión a cada sub-skill.

## Flags opcionales

| Flag            | Efecto                                             |
|-----------------|----------------------------------------------------|
| `--skip-analyze`| Omite el paso `story-analyze`, solo genera design.md + tasks.md |
