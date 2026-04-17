## Context

El agente `business-rules-analyst` está en `.claude/agents/business-rules-analyst.agent.md`. Es referenciado en `requirements-synthesizer.agent.md` y en `reverse-engineering/SKILL.md` (diagrama de plan y sección `### Agente business-rules-analyst`). El campo `**Generado por**` en el cuerpo también usa el nombre actual.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente
- Actualizar frontmatter (`name`) y `**Generado por**` internos
- Actualizar las referencias en los 2 archivos externos

**Non-Goals:**
- Cambiar lógica o comportamiento del agente
- Crear alias para el nombre anterior

## Decisions

**Decisión — Nuevo nombre: `reverse-engineer-business-analyst`**  
Sigue el patrón `<proceso>-<rol>` establecido con `reverse-engineer-architect`. El rol es "business-analyst" (extrae reglas de negocio) dentro del proceso de "reverse engineering".

## Risks / Trade-offs

- **Ruptura de invocaciones por nombre antiguo** → El agente solo es invocado desde el skill `reverse-engineering`, que también se actualiza en este change. Riesgo bajo.
