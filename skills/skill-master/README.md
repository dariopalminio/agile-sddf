# skill-master

Meta-skill para crear, mejorar y evaluar otros skills mediante un ciclo TDD (RED → GREEN → REFACTOR). Orquesta el proceso completo: generación de evals, escritura del SKILL.md, benchmark visual y optimización de la descripción de activación.

## Cuándo usar

| Situación | Modo recomendado |
|---|---|
| Quieres crear un skill desde cero y no tienes nada | Full flow (sin flags) |
| Quieres generar los casos de prueba antes de escribir el skill | `plan` |
| Tienes `evals/evals.json` y quieres implementar el skill | `build` |
| Quieres verificar que un skill existente pasa sus casos de prueba | `evals` |
| Quieres optimizar la descripción de un skill para mejor activación | Full flow → descripción |

## Modos de invocación

| Modo | Comando | Triggers de lenguaje natural |
|---|---|---|
| **plan** | `/skill-master plan` | "crear pruebas de...", "escribe los evals para un skill que...", "genera los casos de prueba para...", "write evals for a skill that..." |
| **build** | `/skill-master build` | "crea el skill", "implementa el skill", "haz que pase los tests", "construye el skill a partir de las pruebas", "build skill" |
| **evals** | `/skill-master evals <skill-name>` | "ejecutar evals de...", "validar skill...", "comprobar que el skill funciona", "correr los tests del skill" |
| **full-flow** | `/skill-master` | Petición ambigua o abierta ("quiero un skill", "ayúdame con un skill") |

El skill detecta la intención por lenguaje natural. Los flags son opcionales.

## Flags

| Flag | Aplica a | Descripción |
|---|---|---|
| `--source <file\|text>` | `plan` | Fuente para generar evals: ruta a un archivo (`story.md`, `testcases.md`) o texto libre |
| `--skill-dir <path>` | `build` | Directorio donde escribir el SKILL.md resultante (por defecto: directorio activo del skill) |
| `--manual` | `plan`, `build` | **(Por defecto)** Pausa en cada checkpoint para revisión y confirmación del usuario |
| `--auto` | `plan`, `build` | Ejecución sin interacción; avanza cuando `pass_rate ≥ 0.95` (máx. 5 iteraciones) |

## Ciclo TDD

```
plan                          build                              evals
──────────────────────────    ──────────────────────────────     ─────────────────────────
Leer fuente (--source o       RED: correr evals SIN skill        Delegar a skill-test-evals
interactivo)                  → confirmar que fallan             → ejecutar todos los TC-NNN
    ↓                             ↓                              → reporte pass/fail
Extraer intención,            GREEN: escribir SKILL.md mínimo
I/O, criterios                    ↓
    ↓                         Correr evals CON skill
Generar 3–5 casos             Grader → benchmark.json
(happy-path, fail-fast,           ↓
edge-case)                    REFACTOR: mejorar SKILL.md
    ↓                         + rerun hasta pass_rate ≥ 0.95
Escribir evals/evals.json     o usuario conforme
```

El workspace de eval se guarda en `.tmp/skills-workspace/<skill-name>-workspace/iteration-N/`.

## Artefactos

| Artefacto | Generado en | Descripción |
|---|---|---|
| `evals/evals.json` | `plan` | Casos de prueba TC-NNN (prompt, expected_output, assertions) |
| `SKILL.md` | `build` | El skill implementado (frontmatter YAML + cuerpo) |
| `benchmark.json` / `benchmark.md` | `build` (REFACTOR) | Pass rate, tiempo y tokens por configuración |
| `grading.json` | `build` (cada run) | Evaluación assertion-por-assertion por caso de prueba |
| `timing.json` | `build` (cada run) | Duración y tokens del subagente de ejecución |
| `feedback.json` | `build` (viewer) | Feedback cualitativo del usuario desde el eval-viewer |

### Artefactos de optimización de descripción (avanzado)

Después de construir el skill, `/skill-master` ofrece optimizar la descripción de activación con `scripts/run_loop`. Esto genera un trigger-eval set y busca la descripción que maximiza la tasa de activación correcta en un held-out test set.

## Uso

```bash
# Crear evals para un skill nuevo (interactivo)
/skill-master plan

# Crear evals a partir de una descripción en texto
/skill-master plan --source "skill que reformatea emails en formato corporativo"

# Crear evals desde un archivo existente
/skill-master plan --source docs/specs/stories/FEAT-042-mi-skill/story.md

# Implementar el skill desde evals ya existentes (interactivo)
/skill-master build

# Implementar el skill en modo automático hasta pass_rate ≥ 0.95
/skill-master build --auto

# Implementar el skill en un directorio específico
/skill-master build --skill-dir .claude/skills/email-formatter/

# Ejecutar los casos de prueba de un skill existente
/skill-master evals email-formatter

# Flujo completo interactivo (el skill detecta dónde estás)
/skill-master
```

## Flujo típico de primer uso

```
/skill-master plan  → genera evals/evals.json
/skill-master build → RED → GREEN → REFACTOR → SKILL.md listo
/skill-master evals <nombre> → verificación final de todos los TC-NNN
```
