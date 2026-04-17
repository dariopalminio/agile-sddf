## Why

El nombre `ux-flow-mapper` describe solo la técnica de análisis sin comunicar que pertenece al workflow de ingeniería inversa. Renombrarlo a `reverse-engineer-ux-flow-mapper` sigue el patrón `<proceso>-<rol>` adoptado para `reverse-engineer-architect` y `reverse-engineer-business-analyst`, completando la nomenclatura coherente de todos los agentes del sistema.

## What Changes

- Renombrar archivo `.claude/agents/ux-flow-mapper.agent.md` → `.claude/agents/reverse-engineer-ux-flow-mapper.agent.md`
- Actualizar el campo `name:` en el frontmatter del archivo
- Actualizar el campo `**Generado por**` en el cuerpo del agente
- Actualizar la referencia en `requirements-synthesizer.agent.md`
- Actualizar las dos referencias en `reverse-engineering/SKILL.md` (diagrama de plan y nombre de sección)

## Capabilities

### New Capabilities
<!-- Ninguna — rename de identidad -->

### Modified Capabilities
<!-- Ninguna — el comportamiento del agente no cambia -->

## Impact

- `.claude/agents/ux-flow-mapper.agent.md` → renombrado
- `.claude/agents/reverse-engineer-ux-flow-mapper.agent.md` → campos `name` y `**Generado por**` actualizados
- `.claude/agents/requirements-synthesizer.agent.md` → referencia actualizada
- `.claude/skills/reverse-engineering/SKILL.md` → diagrama de plan y nombre de sección actualizados
