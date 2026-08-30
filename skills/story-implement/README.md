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
| Skills declarados en `sddf.config.yaml` existen en `$CLI_ROOT/skills/` | Verificación fail-fast en Paso 2 |

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
| `{story_id}` | requerido | Identificador de la historia (ej. `STORY-059`) |
| `--auto` | opcional | Ejecuta el ciclo TDD completo sin pausas de confirmación |

## Artefactos generados

| Artefacto | Ruta | Descripción |
|---|---|---|
| Archivos de prueba | según skill generador | Tests en Fase RED (deben fallar) |
| Archivos de producción | según skill generador | Código generado en Fases GREEN y REFACTOR |
| `implement-report.md` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>/implement-report.md` | Ciclo TDD, DoD IMPLEMENT, estado por fase |
| `story.md` (actualizado) | mismo directorio | Frontmatter actualizado (ver transiciones de estado) |
| `epic.md` (actualizado) | `$SPECS_BASE/specs/02-epics/<parent>/epic.md` | Checklist con `[x]` para la historia completada |
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

## Configurar code_generators por capas (frontend / backend)

`implement.code_generators` en `sddf.config.yaml` es una **lista** de entradas `{layer, skill, required}`, una por cada capa de tu arquitectura. El orquestador recorre la lista en orden e invoca el skill de cada capa en las Fases GREEN y REFACTOR — no necesita conocer el stack, solo que cada skill cumple el contrato de entrada/salida.

```yaml
implement:
  code_generators:
    - layer: frontend
      skill: code-frontend-library-react   # skill especializado en la capa frontend
      required: true
    - layer: backend
      skill: code-backend-nodejs           # skill especializado en la capa backend (créalo con skill-master si no existe)
      required: true
    - layer: database
      skill: none                          # capa deshabilitada
      required: false
```

| Campo | Descripción |
|---|---|
| `layer` | Nombre de la capa (`frontend`, `backend`, `database`, o cualquier nombre que use tu arquitectura). Se pasa como `layer` en el bundle de invocación y determina la ruta de resultados `.tmp/story-implement/{phase}/{layer}/results.json`. |
| `skill` | Nombre del skill en `$CLI_ROOT/skills/{skill}/SKILL.md` que genera/refactoriza el código de esa capa. Usa `none` para omitir la capa. |
| `required` | Solo controla qué pasa si el skill declarado **no existe**: si `true`, el ciclo se detiene (fail-fast, Paso 8 de `SKILL.md`); si `false`, la capa se omite con `[WARN]` y el ciclo continúa. **No desactiva una capa cuyo skill sí existe** — para deshabilitar una capa explícitamente usa `skill: none`. |

### Cómo usar un skill específico por capa

1. **Identifica o crea el skill de cada capa.** `code-frontend-library-react` ya existe en `$CLI_ROOT/skills/` para proyectos React. Para backend o base de datos, usa el skill de tu stack (ej. `code-backend-nodejs`, `code-database-prisma`) o créalo con `skill-master` siguiendo el patrón de `code-frontend-library-react/SKILL.md` (estructura, `evals/evals.json`, etc.) — la constitución exige usar `skill-master` para crear skills nuevos.
2. **Declara la capa en `sddf.config.yaml`** bajo `implement.code_generators`, en el orden en que quieres que se invoquen.
3. **Asegúrate de que el skill respeta el contrato de invocación** (ADR-0002, ver "Arquitectura de delegación" arriba): recibe el bundle `{story_id, phase, layer, test_files, story_path, design_path}` y escribe su resultado en `.tmp/story-implement/{phase}/{layer}/results.json`.
4. **Cada capa se invoca de forma independiente**, en el orden declarado en el YAML, tanto en GREEN como en REFACTOR.

> **Nota:** `code_generators` siempre se declara como lista, incluso para proyectos de una sola capa — no existe una forma simplificada de objeto único (el Paso 8 de `SKILL.md` extrae `implement.code_generators` como lista; un objeto suelto no es un contrato soportado). Este propio repositorio (`agile-sddf`) genera skills, no código de aplicación, así que su `sddf.config.yaml` raíz usa una lista de un solo elemento con `layer: monolithic` y `skill: skill-master` (las capas `frontend`/`backend`/`database` quedan con `skill: none`). Úsalo como ejemplo canónico de proyecto monocapa. Para proyectos que generan código de aplicación real (frontend/backend), usa el formato de lista multi-capa mostrado arriba — ver la plantilla completa en `$CLI_ROOT/skills/sddf-init/assets/sddf.config.yaml.template`.

## Uso

```bash
# Ciclo TDD completo en modo interactivo (con pausas)
/story-implement STORY-059

# Ciclo TDD completo en modo automático (sin pausas, ideal para CI)
/story-implement STORY-059 --auto
```
