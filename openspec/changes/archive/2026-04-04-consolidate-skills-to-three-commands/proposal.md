## Why

El pipeline actual expone 7 comandos al usuario (ps-funnel, ps-draft, ps-discovery, ps-SPECIFY, ps-approval, ps-planning, ps-finish), lo que genera fricción innecesaria y una curva de aprendizaje alta para una herramienta que debe ser minimalista. Consolidar en 3 comandos simplifica el flujo y alinea la interfaz con los 3 documentos de salida clave del proyecto.

## What Changes

- **BREAKING** Eliminar skills: `ps-funnel`, `ps-draft`, `ps-discovery`, `ps-SPECIFY`, `ps-approval`, `ps-finish`
- Crear skill `/ps-begin-intention` — fusiona Funnel + Draft: entrevista al usuario y genera `$SPECS_BASE/specs/projects/project-intent.md`
- Crear skill `/ps-project-spec` — fusiona Discovery + SPECIFY: conduce discovery de usuarios y especificación de requisitos, genera `$SPECS_BASE/specs/projects/project.md`
- Mantener skill `/ps-planning` — sin cambios de interfaz, genera `$SPECS_BASE/specs/projects/project-plan.md`
- Actualizar `CLAUDE.md` con los 3 comandos finales y el nuevo workflow simplificado

**Non-goals:**
- No cambiar los agentes role-based (`product-manager-agent`, `architect-agent`, `ux-designer-agent`)
- No cambiar los documentos de salida ni su estructura interna
- No cambiar los templates existentes (se reutilizan en los nuevos skills)

## Capabilities

### New Capabilities
- `ps-begin-intention-skill`: Skill que fusiona Funnel + Draft en un único comando interactivo que produce `project-intent.md`
- `ps-project-spec-skill`: Skill que fusiona Discovery + SPECIFY en un único comando interactivo que produce `requirement-spec.md`

### Modified Capabilities
- `ps-planning-skill`: Sin cambios de requisitos (el skill se mantiene igual, solo se actualizan referencias)

## Impact

- `.claude/skills/` — eliminar 6 directorios de skills, crear 2 nuevos, mantener 1
- `CLAUDE.md` — actualizar lista de comandos y workflow
- Sin impacto en `.claude/agents/` ni en documentos generados
