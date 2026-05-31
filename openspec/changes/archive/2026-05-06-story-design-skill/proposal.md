<!-- Referencias -->
[[FEAT-057-skill-para-diseno]]

## Why

El workflow SDD (Story-Driven Development) en SDDF carece de un paso formal entre la historia de usuario (`story.md`) y la implementación: el diseño técnico. Sin un skill `story-design`, los desarrolladores y agentes pasan directamente de la especificación funcional al código, perdiendo trazabilidad sobre las decisiones técnicas y cómo los criterios de aceptación se traducen en soluciones concretas.

## What Changes

- **Nuevo skill `story-design`** en `.claude/skills/story-design/`: skill orquestador que lee `story.md` y genera `design.md` en el mismo directorio de la historia.
- **Nuevo template `story-design-template.md`** en `docs/specs/templates/`: define la estructura canónica de `design.md` (investigación de alternativas, decisión técnica, plan de implementación).
- El skill sigue los patrones estructurales de SDDF: preflight como Paso 0, template como fuente de verdad dinámica, un solo nivel de delegación.
- El skill debe crearse usando `skill-master` para garantizar conformidad con los estándares del framework.

## Capabilities

### New Capabilities

- `story-design-skill`: Skill que genera `design.md` a partir de `story.md`, siguiendo el template de diseño y respetando las políticas del proyecto (`constitution.md`). Incluye una fase de investigación de alternativas técnicas documentada.

### Modified Capabilities

<!-- Sin cambios a capabilities existentes -->

## Impact

- **Nuevo directorio:** `.claude/skills/story-design/` con `SKILL.md`, `assets/`, `examples/`
- **Nuevo template:** `docs/specs/templates/story-design-template.md`
- **Artefacto generado:** `docs/specs/stories/<FEAT-NNN>-<slug>/design.md` por cada historia procesada
- **Dependencias:** requiere `story.md` válido + template de diseño + políticas en `$SPECS_BASE/policies/`
- **Sin cambios a APIs ni dependencias externas**
