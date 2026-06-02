## Why

Los agentes actuales están organizados por tarea/estado del workflow (funnel-agent, draft-agent, discovery-agent, etc.), lo que dificulta la reutilización de expertise entre estados y no refleja los roles reales de un equipo de producto. Reorganizar por rol permite que cada agente acumule contexto de su especialidad a lo largo de todo el pipeline.

## What Changes

- Eliminar agentes task-based: `funnel-agent.md`, `draft-agent.md`, `discovery-agent.md`, `SPECIFY-agent.md`, `approval-agent.md`, `planning-agent.md`
- Crear agentes role-based en `.claude/agents/`:
  - `product-manager-agent.md` — orquesta el pipeline completo, conduce entrevistas, genera docs de intención y discovery
  - `architect-agent.md` — define arquitectura técnica, valida specs de requisitos, genera architecture-spec
  - `ux-designer-agent.md` — define flujos de usuario, valida usabilidad, apoya en discovery y SPECIFY
- Actualizar todos los skills que referencian agentes task-based para usar los nuevos agentes por rol
- Actualizar CLAUDE.md con la nueva estructura de agentes

## Capabilities

### New Capabilities
- `role-based-agents`: Agentes especializados por rol (PM, Architect, UX) que pueden actuar en múltiples estados del workflow en lugar de estar atados a un único estado

### Modified Capabilities
- `ps-funnel-skill`: Cambia referencia de `funnel-agent` a `product-manager-agent`
- `ps-draft-skill`: Cambia referencia de `draft-agent` a `product-manager-agent`
- `ps-discovery-skill`: Cambia referencia de `discovery-agent` a `product-manager-agent`
- `ps-SPECIFY-skill`: Cambia referencia de `SPECIFY-agent` a `architect-agent` + `product-manager-agent`
- `ps-planning-skill`: Cambia referencia de `planning-agent` a `architect-agent`

## Impact

- `.claude/agents/` — eliminar 6 archivos task-based, crear 3 archivos role-based
- `.claude/skills/*/SKILL.md` — actualizar referencias de agentes en cada skill
- `CLAUDE.md` — actualizar sección de estructura de agentes
- Sin cambios en documentos generados ni en el workflow secuencial
- Sin breaking changes en los comandos disponibles (`/ps-funnel`, `/ps-draft`, etc.)
