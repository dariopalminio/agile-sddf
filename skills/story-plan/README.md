# story-plan

Skill orquestador que ejecuta el pipeline completo de planning de una historia SDD con un solo comando: `story-design → story-tasking → story-testcases → story-analyze`.

## Posicionamiento en el flujo SDD

```
/story-specify                         [story.md: SPECIFY/IN-PROGRESS → READY-FOR-PLAN/DONE]
    ├── /story-creation   → Crea story.md
    ├── /story-evaluation → Evalúa con FINVEST
    └── /story-split      → Divide historias grandes
    ↓ [story.md: READY-FOR-PLAN/DONE]
/story-plan                            [story.md: → PLANNING/IN-PROGRESS al inicio]  ← aquí
    ├── /story-design     → Genera design.md
    ├── /story-tasking    → Genera tasks.md       (omitido con --only-testcases)
    ├── /story-testcases  → Genera testcases.md   (omitido con --only-tasks)
    └── /story-analyze    → Genera analyze.md     [story.md: → READY-FOR-IMPLEMENT/DONE si sin ERROREs]
    ↓ [story.md: READY-FOR-IMPLEMENT/DONE]
/story-implement-tasks                 [story.md: → IMPLEMENT/IN-PROGRESS → IMPLEMENT/DONE]
```

## Precondiciones

| Precondición | Descripción |
|---|---|
| `story.md` presente | Historia con criterios de aceptación en formato Gherkin |
| Directorio bajo `$SPECS_BASE/specs/03-stories/` | Resuelto por `skill-preflight` |
| `skill-preflight` retorna OK | Entorno válido (SDDF_ROOT, subdirectorios de specs) |

## Modos de ejecución

| Modo | Flag | Pipeline | Pasos |
|---|---|---|---|
| **Default** | *(ninguno)* | design → tasking → testcases → analyze | 4 |
| Solo tareas | `--only-tasks` | design → tasking → analyze | 3 |
| Solo testcases | `--only-testcases` | design → testcases → analyze | 3 |

En cualquier modo, `--skip-analyze` elimina el paso `story-analyze` y reduce el total en 1.

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | requerido | Identificador de la historia (ej. `STORY-057`) |
| `{story_path}` | opcional | Ruta explícita al directorio; sobreescribe la resolución por glob |
| `--only-tasks` | opcional | Ejecuta solo design → tasking → analyze; no genera `testcases.md` |
| `--only-testcases` | opcional | Ejecuta solo design → testcases → analyze; no genera `tasks.md` |
| `--skip-analyze` | opcional | Omite `story-analyze` en cualquier modo |

> `--only-tasks` y `--only-testcases` son mutuamente excluyentes. Usarlos juntos produce un error inmediato sin invocar ningún sub-skill.

## Artefactos generados

| Artefacto | Generado por | Presente en |
|---|---|---|
| `design.md` | `story-design` | Todos los modos |
| `tasks.md` | `story-tasking` | Default y `--only-tasks` |
| `testcases.md` | `story-testcases` | Default y `--only-testcases` |
| `analyze.md` | `story-analyze` | Todos los modos (salvo `--skip-analyze`) |

## Transiciones de estado

| Evento | status | substatus |
|---|---|---|
| Inicio del pipeline (incondicional) | `PLANNING` | `IN-PROGRESS` |
| `story-analyze` finaliza sin ERROREs | `READY-FOR-IMPLEMENT` | `DONE` |
| Fallo en cualquier paso bloqueante | `PLANNING` | `IN-PROGRESS` (sin cambio) |

## Uso

```bash
# Default: genera design.md + tasks.md + testcases.md + analyze.md
/story-plan STORY-057

# Solo tareas (comportamiento previo): design.md + tasks.md + analyze.md
/story-plan STORY-057 --only-tasks

# Solo casos de prueba: design.md + testcases.md + analyze.md
/story-plan STORY-057 --only-testcases

# Default sin analyze: design.md + tasks.md + testcases.md
/story-plan STORY-057 --skip-analyze

# Solo tareas sin analyze: design.md + tasks.md
/story-plan STORY-057 --only-tasks --skip-analyze

# Ruta explícita al directorio de la historia
/story-plan STORY-057 docs/specs/03-stories/STORY-057-mi-historia/
```
