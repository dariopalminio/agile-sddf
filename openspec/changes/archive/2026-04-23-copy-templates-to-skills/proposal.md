## Why

Los templates en `docs/specs/templates/` mezclan artefactos de entrada (plantillas estructurales) con artefactos de salida (documentos generados), violando la separación de responsabilidades del directorio `docs/specs/`. Mover los templates a cada skill que los usa los hace autónomos, portables y fáciles de encontrar sin navegar fuera del skill.

## What Changes

- Copiar `story-gherkin-template.md` al directorio `templates/` de los skills: `story-creation`, `story-evaluation`, `story-split`, `release-generate-all-stories`
- Copiar `evaluation-output-template.md` al directorio `templates/` del skill `story-evaluation`
- Copiar `requirement-spec-template.md` al directorio `templates/` del skill `project-discovery`
- Copiar `release-spec-template.md` al directorio `templates/` de los skills: `releases-from-project-plan`, `release-generate-stories`, `release-format-validation`, `release-generate-all-stories`
- Actualizar todas las referencias a `docs/specs/templates/` en los archivos `SKILL.md` de cada skill afectado
- Actualizar las referencias en los agentes de `.claude/agents/` que usen rutas de `docs/specs/templates/`
- Los templates originales en `docs/specs/templates/` se conservan como referencia histórica; no se eliminan

## Capabilities

### New Capabilities
- `skill-template-autonomy`: Cada skill contiene sus propios templates en `.claude/skills/<skill>/templates/`, haciéndolos autónomos y portables. Las rutas de referencia en SKILL.md apuntan a rutas locales relativas al skill.

### Modified Capabilities
- `story-workflow-mvp`: Las referencias a templates del flujo de historia (story-gherkin, evaluation-output) pasan de `docs/specs/templates/` a rutas locales dentro de cada skill.
- `release-generate-stories`: La referencia a `release-spec-template.md` pasa a la ruta local del skill.

## Impact

- **Archivos modificados**: `SKILL.md` de `story-creation`, `story-evaluation`, `story-split`, `release-generate-all-stories`, `project-discovery`, `releases-from-project-plan`, `release-generate-stories`, `release-format-validation`
- **Archivos nuevos**: un archivo `templates/<template>.md` por cada skill afectado
- **Agentes**: archivos en `.claude/agents/` que referencien `docs/specs/templates/`
- **Sin breaking changes**: los skills ya migrados (`project-begin`, `project-planning`) no se tocan; `docs/specs/templates/` se conserva como referencia
