## Why

El nombre `requirements-synthesizer` describe el output del agente ("sintetiza requisitos") pero no comunica que pertenece al workflow de ingeniería inversa. Renombrarlo a `reverse-engineer-synthesizer` completa la nomenclatura coherente bajo el patrón `<proceso>-<rol>` adoptado para todos los agentes del sistema, haciendo el conjunto más legible y consistente.

## What Changes

- Renombrar archivo `.claude/agents/requirements-synthesizer.agent.md` → `.claude/agents/reverse-engineer-synthesizer.agent.md`
- Actualizar el campo `name:` en el frontmatter del archivo
- Actualizar el campo `**Generado por**` en el cuerpo del agente
- Actualizar referencias en los 4 agentes de análisis paralelo que mencionan `requirements-synthesizer` en sus descripciones y cuerpos
- Actualizar las 2 referencias en `reverse-engineering/SKILL.md` (diagrama de plan y nombre de sección)

## Capabilities

### New Capabilities
<!-- Ninguna — rename de identidad -->

### Modified Capabilities
<!-- Ninguna — el comportamiento del agente no cambia -->

## Impact

- `.claude/agents/requirements-synthesizer.agent.md` → renombrado
- `.claude/agents/reverse-engineer-synthesizer.agent.md` → campos `name` y `**Generado por**` actualizados
- `.claude/agents/reverse-engineer-architect.agent.md` → 2 referencias actualizadas (description + body)
- `.claude/agents/reverse-engineer-business-analyst.agent.md` → 2 referencias actualizadas (description + body)
- `.claude/agents/reverse-engineer-product-discovery.agent.md` → 1 referencia actualizada (description)
- `.claude/agents/reverse-engineer-ux-flow-mapper.agent.md` → 1 referencia actualizada (description)
- `.claude/skills/reverse-engineering/SKILL.md` → diagrama de plan y nombre de sección actualizados
