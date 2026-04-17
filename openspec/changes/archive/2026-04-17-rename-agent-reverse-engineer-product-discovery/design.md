## Context

El agente `product-discovery` está en `.claude/agents/product-discovery.agent.md`. Es referenciado en `requirements-synthesizer.agent.md` y en `reverse-engineering/SKILL.md` (diagrama: `→ product-discovery` y sección `### Agente product-discovery`). El campo `**Generado por**` en el cuerpo también usa el nombre actual.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente
- Actualizar frontmatter (`name`) y `**Generado por**` internos
- Actualizar las referencias en los 2 archivos externos

**Non-Goals:**
- Cambiar lógica o comportamiento del agente
- Crear alias para el nombre anterior

## Decisions

**Decisión — Nuevo nombre: `reverse-engineer-product-discovery`**  
Completa el patrón `<proceso>-<rol>` establecido con los tres agentes ya renombrados. El rol es "product-discovery" (extrae features desde la perspectiva del usuario) dentro del proceso de "reverse engineering".

## Risks / Trade-offs

- **Ruptura de invocaciones por nombre antiguo** → El agente solo es invocado desde el skill `reverse-engineering`, que también se actualiza en este change. Riesgo bajo.
