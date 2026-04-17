## Context

El agente `ux-flow-mapper` está en `.claude/agents/ux-flow-mapper.agent.md`. Es referenciado en `requirements-synthesizer.agent.md` y en `reverse-engineering/SKILL.md` (diagrama de plan: `→ ux-flow-mapper` y sección `### Agente ux-flow-mapper`). El campo `**Generado por**` en el cuerpo también usa el nombre actual.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente
- Actualizar frontmatter (`name`) y `**Generado por**` internos
- Actualizar las referencias en los 2 archivos externos

**Non-Goals:**
- Cambiar lógica o comportamiento del agente
- Crear alias para el nombre anterior

## Decisions

**Decisión — Nuevo nombre: `reverse-engineer-ux-flow-mapper`**  
Continúa el patrón `<proceso>-<rol>` establecido con `reverse-engineer-architect` y `reverse-engineer-business-analyst`. El rol es "ux-flow-mapper" (reconstruye flujos de usuario) dentro del proceso de "reverse engineering".

## Risks / Trade-offs

- **Ruptura de invocaciones por nombre antiguo** → El agente solo es invocado desde el skill `reverse-engineering`, que también se actualiza en este change. Riesgo bajo.
