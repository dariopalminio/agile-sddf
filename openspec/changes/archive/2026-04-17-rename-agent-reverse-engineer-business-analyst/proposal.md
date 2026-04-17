## Why

El nombre `business-rules-analyst` describe la técnica de análisis pero no comunica que este agente pertenece al workflow de ingeniería inversa. Renombrarlo a `reverse-engineer-business-analyst` sigue el mismo patrón `<proceso>-<rol>` adoptado para `reverse-engineer-architect`, haciendo coherente la nomenclatura de todos los agentes del sistema.

## What Changes

- Renombrar archivo `.claude/agents/business-rules-analyst.agent.md` → `.claude/agents/reverse-engineer-business-analyst.agent.md`
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

- `.claude/agents/business-rules-analyst.agent.md` → renombrado
- `.claude/agents/reverse-engineer-business-analyst.agent.md` → campos `name` y `**Generado por**` actualizados
- `.claude/agents/requirements-synthesizer.agent.md` → referencia actualizada
- `.claude/skills/reverse-engineering/SKILL.md` → diagrama de plan y nombre de sección actualizados
