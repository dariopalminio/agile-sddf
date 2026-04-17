## Why

El nombre `arch-reverse-engineer` mezcla el dominio funcional ("arch") con el proceso ("reverse-engineer"), generando ambigüedad sobre si el agente es un arquitecto o un proceso de ingeniería inversa. Renombrarlo a `reverse-engineer-architect` alinea su identidad con el patrón `<rol>-<especialización>` usado en los demás agentes del proyecto y clarifica que es el arquitecto especializado dentro del workflow de ingeniería inversa.

## What Changes

- Renombrar archivo `.claude/agents/arch-reverse-engineer.agent.md` → `.claude/agents/reverse-engineer-architect.agent.md`
- Actualizar el campo `name:` en el frontmatter del archivo de `arch-reverse-engineer` a `reverse-engineer-architect`
- Actualizar las referencias al agente en `requirements-synthesizer.agent.md`
- Actualizar referencias en `reverse-engineering/SKILL.md` (dos ocurrencias: diagrama de plan y nombre de sección)

## Capabilities

### New Capabilities
<!-- Ninguna — es un rename de identidad -->

### Modified Capabilities
<!-- Ninguna — el comportamiento del agente no cambia -->

## Impact

- `.claude/agents/arch-reverse-engineer.agent.md` → renombrado
- `.claude/agents/arch-reverse-engineer.agent.md` → campo `name` y `**Generado por**` actualizados
- `.claude/agents/requirements-synthesizer.agent.md` → referencia al agente actualizada
- `.claude/skills/reverse-engineering/SKILL.md` → diagrama de plan y nombre de sección actualizados
