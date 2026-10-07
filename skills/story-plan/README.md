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

## Modo de ejecución: subagentes o inline

Cada paso se ejecuta en un **subagente aislado** cuando la sesión dispone de una herramienta para lanzarlos (en Claude Code, `Agent`). El subagente recibe solo la ruta del `SKILL.md` del worker y el contexto resuelto (`REPO_ROOT`, `SPECS_BASE`, `ROOT_SOURCE`, historia, flag de sobrescritura), lee sus insumos del disco y devuelve un estado breve. Así el hilo principal termina el plan liviano.

| Situación | Ejecución | Banner |
|---|---|---|
| Runtime con subagentes | un subagente por paso | `Ejecución: subagentes (un contexto aislado por paso)` |
| Runtime sin subagentes (p. ej. `codex`) | composición inline en la sesión principal | `Ejecución: inline (el runtime no admite subagentes)` |
| `--inline` | composición inline forzada | `Ejecución: inline (--inline)` |

Los artefactos, los mensajes de progreso y el resumen son iguales en ambos modos. Ningún subagente lanza otro subagente.

### Archivos de resultado

Cada paso deja `.tmp/story-plan/<STORY-ID>/<paso>.result.md` (`design`, `tasking`, `testcases`, `analyze`): primera línea `STATUS: OK`, `STATUS: WARN` o `STATUS: FAIL` y como máximo 5 líneas de resumen. El fail-fast y el resumen final se deciden leyendo solo esos archivos; un archivo ausente o ilegible cuenta como `FAIL`. El directorio se recrea en cada corrida y no se versiona.

### Artefactos existentes: una sola pregunta

Si alguno de los artefactos del modo ya existe, `story-plan` pregunta **una vez**, antes de escribir nada:

| Respuesta | Efecto |
|---|---|
| `(t)` Regenerar todos | todos los workers reciben `--force` |
| `(f)` Solo los que faltan | los workers de artefactos existentes reciben `--skip-existing`; el resto, `--force` |
| `(c)` Cancelar | no se lanza ningún paso y ningún archivo cambia |

Los workers (`story-design`, `story-tasking`, `story-testcases`, `story-analyze`) aceptan `--force` y `--skip-existing` también por separado; sin flags conservan su pregunta `(r) Regenerar / (n) No modificar`.

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | requerido | Identificador de la historia (ej. `STORY-057`) |
| `{story_path}` | opcional | Ruta explícita al directorio; sobreescribe la resolución por glob |
| `--only-tasks` | opcional | Ejecuta solo design → tasking → analyze; no genera `testcases.md` |
| `--only-testcases` | opcional | Ejecuta solo design → testcases → analyze; no genera `tasks.md` |
| `--skip-analyze` | opcional | Omite `story-analyze` en cualquier modo |
| `--inline` | opcional | Fuerza la composición inline de los workers aunque el runtime admita subagentes |

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

# Forzar ejecución inline (sin subagentes), p. ej. para comparar consumo de tokens
/story-plan STORY-057 --inline

# Ruta explícita al directorio de la historia
/story-plan STORY-057 docs/specs/03-stories/STORY-057-mi-historia/
```
