## Why

El pipeline de ProjectSpecFactory carece del estado **SPECIFY**, el cuarto paso entre Discovery y Approval. Sin él, el PM no puede transformar el `discovery.md` en requisitos estructurados (`requirement-spec.md`) que guíen el desarrollo. Se necesita ahora para completar el flujo end-to-end del MVP v1.0.

## What Changes

- **Nuevo template** `project-template.md` en `.claude/skills/ps-SPECIFY/templates/` que define la estructura del documento de especificación de requisitos (funcionales, no-funcionales, usuarios, contexto).
- **Nuevo agente** `SPECIFY-agent.md` (`.claude/agents/`) especializado en entrevistar al usuario sección por sección del template y producir `$SPECS_BASE/specs/projects/project.md`.
- **Nuevo skill** `ps-SPECIFY` (`.claude/skills/ps-SPECIFY/SKILL.md`) que orquesta el estado SPECIFY: valida el `discovery.md`, delega al `SPECIFY-agent` y confirma el output.

## Capabilities

### New Capabilities

- `ps-SPECIFY-skill`: Skill orquestador del estado SPECIFY que valida precondiciones, delega al agente y confirma el output en `$SPECS_BASE/specs/projects/project.md`.
- `SPECIFY-agent`: Agente PM especializado que lee `discovery.md`, extrae headers y comentarios del template en runtime, entrevista al usuario por secciones y produce `requirement-spec.md`.
- `project-template`: Template Markdown con estructura de secciones (descripción general, contexto, usuarios, requisitos funcionales, no funcionales, referencias) que guía la captura de intención del proyecto.

### Modified Capabilities

## Impact

- Nuevo archivo: `.claude/agents/SPECIFY-agent.md`
- Nuevo directorio: `.claude/skills/ps-SPECIFY/` con `SKILL.md` y `templates/project-template.md`
- El template existente en `docs/templates/requirements-spec-template.md` sirve como referencia de estructura pero NO se modifica
- El output del agente se escribe en `$SPECS_BASE/specs/projects/project.md`
- No se modifican skills ni agentes existentes
