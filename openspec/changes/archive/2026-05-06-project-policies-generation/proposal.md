<!-- Referencias -->
[[FEAT-056-project-policies]]

## Why

El flujo SDD (Story SDD Workflow, EPIC-12) exige que los agentes IA conozcan las reglas técnicas y acuerdos del proyecto antes de diseñar o implementar cualquier historia. Hoy no existe ningún skill que inicialice estos documentos, por lo que cada equipo los crea ad-hoc o los omite, generando inconsistencias entre agentes y falta de trazabilidad.

## What Changes

- **Nuevo skill** `project-policies-generation` en `.claude/skills/project-policies-generation/`.
- El skill genera `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md` desde templates Markdown ubicados en `$SPECS_BASE/specs/templates/`.
- Si los archivos ya existen, los abre para edición en lugar de sobreescribirlos.
- Agrega referencias a los documentos generados en `CLAUDE.md` / `AGENTS.md` usando sintaxis `@` para que los agentes los lean automáticamente.
- El skill sigue los Skill Structural Patterns definidos en `docs/knowledge/guides/skill-structural-pattern.md` y se construye con el skill `skill-master`.

## Capabilities

### New Capabilities

- `project-policies-generation`: Skill que inicializa y/o actualiza los documentos de políticas y constitución del proyecto (constitution.md, definition-of-done-story.md) a partir de templates Markdown, y registra las referencias en el punto de entrada del agente IA (CLAUDE.md/AGENTS.md).

### Modified Capabilities

<!-- No hay capabilities existentes cuyo contrato de requisitos cambie. -->

## Impact

- **Nuevo directorio**: `.claude/skills/project-policies-generation/` con `SKILL.md`, `assets/` (templates de constitución y DoD), `examples/`.
- **Nuevos templates**: `$SPECS_BASE/specs/templates/project-constitution-template.md` y `$SPECS_BASE/specs/templates/definition-of-done-story-template.md`.
- **CLAUDE.md / AGENTS.md**: se actualizarán con referencias `@` a los documentos de políticas generados.
- **Sin breaking changes**: el skill es aditivo; no modifica skills existentes ni rompe el flujo actual.
