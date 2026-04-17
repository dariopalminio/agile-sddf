## Why

El nombre `product-discovery` es ambiguo: describe una práctica ágil genérica, no indica que este agente pertenece al workflow de ingeniería inversa. Renombrarlo a `reverse-engineer-product-discovery` completa la nomenclatura coherente bajo el patrón `<proceso>-<rol>` adoptado para todos los agentes del sistema (`reverse-engineer-architect`, `reverse-engineer-business-analyst`, `reverse-engineer-ux-flow-mapper`).

## What Changes

- Renombrar archivo `.claude/agents/product-discovery.agent.md` → `.claude/agents/reverse-engineer-product-discovery.agent.md`
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

- `.claude/agents/product-discovery.agent.md` → renombrado
- `.claude/agents/reverse-engineer-product-discovery.agent.md` → campos `name` y `**Generado por**` actualizados
- `.claude/agents/requirements-synthesizer.agent.md` → referencia actualizada
- `.claude/skills/reverse-engineering/SKILL.md` → diagrama de plan y nombre de sección actualizados
