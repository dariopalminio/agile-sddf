# story-implement

Skill orquestador que ejecuta el ciclo TDD completo (RED → GREEN → REFACTOR) para una historia SDDF, delegando la generación de pruebas y código a skills especializados declarados en `sddf.config.yaml`.

## Posicionamiento en el flujo SDD

```
/story-plan                            [story.md: PLANNING/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE]
    ├── /story-design     → Genera design.md
    ├── /story-tasking    → Genera tasks.md
    ├── /story-testcases  → Genera testcases.md
    └── /story-analyze    → Genera analyze.md
    ↓ [story.md: READY-FOR-IMPLEMENT/DONE]
/story-implement                       [story.md: → IMPLEMENT/IN‑PROGRESS → IMPLEMENT/DONE]  ← aquí
    ├── Fase RED      → invoca test_generators de sddf.config.yaml  → archivos de prueba
    ├── Fase GREEN    → invoca code_generators de sddf.config.yaml  → código de producción
    └── Fase REFACTOR → invoca code_generators con phase:REFACTOR   → código mejorado
    ↓ [story.md: IMPLEMENT/DONE]
/story-code-review                     [story.md: → CODE-REVIEW/IN‑PROGRESS]
```

## Precondiciones

| Precondición | Descripción |
|---|---|
| `story.md` presente | Historia con criterios de aceptación en formato Gherkin |
| `design.md` presente | Arquitectura, componentes e interfaces (fallback si falta `testcases.md`) |
| `testcases.md` presente *(recomendado)* | Fuente canónica de casos de prueba por tipo |
| `sddf.config.yaml` presente | Declara `implement.test_generators` y `implement.code_generators` |
| Skills declarados en `sddf.config.yaml` existen en `.claude/skills/` | Verificación fail-fast en Paso 2 |

Si `testcases.md` no existe, el skill emite una advertencia y usa `story.md` + `design.md` como fallback.
Si `sddf.config.yaml` no existe o sus secciones están vacías, la ejecución se detiene con un mensaje descriptivo.

## Modos de ejecución

| Modo | Flag | Comportamiento |
|---|---|---|
| **Interactivo** | *(ninguno, predeterminado)* | Pausa tras Fase RED (Pause-1) y tras Fase GREEN (Pause-2) para confirmación manual |
| **Automático** | `--auto` | Ciclo completo sin interrupciones; ideal para CI |

En modo interactivo, responder `n` en cualquier pausa termina el ciclo limpiamente sin error y sin invocar las fases siguientes.

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | requerido | Identificador de la historia (ej. `FEAT-059`) |
| `--auto` | opcional | Ejecuta el ciclo TDD completo sin pausas de confirmación |

## Artefactos generados

| Artefacto | Ruta | Descripción |
|---|---|---|
| Archivos de prueba | según skill generador | Tests en Fase RED (deben fallar) |
| Archivos de producción | según skill generador | Código generado en Fases GREEN y REFACTOR |
| `implement-report.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/implement-report.md` | Ciclo TDD, DoD IMPLEMENT, estado por fase |
| `story.md` (actualizado) | mismo directorio | Frontmatter actualizado (ver transiciones de estado) |
| `release.md` (actualizado) | `$SPECS_BASE/specs/releases/<parent>/release.md` | Checklist con `[x]` para la historia completada |
| `red-phase-status.json` | `.tmp/story-implement/red-phase-status.json` | Estado de Fase RED — precondición para GREEN |
| `cycle-status.json` | `.tmp/story-implement/cycle-status.json` | Estado final del ciclo TDD |
| `results.json` por tipo/capa | `.tmp/story-implement/{tipo o fase/capa}/results.json` | Output de cada subagente |

## Transiciones de estado

| Evento | status | substatus |
|--------|--------|-----------|
| Inicio del ciclo (Fase RED) | `IMPLEMENT` | `IN‑PROGRESS` |
| Ciclo completado sin DoD-ERRORs | `IMPLEMENT` | `DONE` |
| Ciclo completado con criterios DoD `❌` | `IMPLEMENT` | `IN-PROGRESS` |

## Arquitectura de delegación

```
story-implement (orquestador — Fase RED)
  └── {skill de tipo unit}    ← ej. story-test-unit-jest
  └── {skill de tipo e2e}     ← ej. story-test-e2e-playwright
  └── {skill de tipo eval}    ← ej. story-test-eval

story-implement (orquestador — Fases GREEN y REFACTOR)
  └── {skill capa frontend}   ← ej. code-frontend-library-react
  └── {skill capa backend}    ← ej. code-backend-nodejs
  └── {skill capa database}   ← ej. code-database-prisma
```

Los skills generadores se declaran en `sddf.config.yaml` bajo `implement.test_generators` (Fase RED) e `implement.code_generators` (Fases GREEN/REFACTOR). El orquestador es agnóstico al stack.

## Uso

```bash
# Ciclo TDD completo en modo interactivo (con pausas)
/story-implement FEAT-059

# Ciclo TDD completo en modo automático (sin pausas, ideal para CI)
/story-implement FEAT-059 --auto
```
