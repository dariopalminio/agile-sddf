## Context

Actualmente `.claude/agents/` contiene 6 agentes organizados por estado del workflow: `funnel-agent`, `draft-agent`, `discovery-agent`, `SPECIFY-agent`, `approval-agent`, `planning-agent`. Cada agente está especializado en un único paso, lo que genera duplicación de instrucciones relacionadas al mismo rol (e.g., el PM conduce entrevistas tanto en Funnel como en Draft y Discovery).

Claude Code carga agentes via frontmatter YAML con campos: `name`, `description`, `tools`, `model`. Los skills en `.claude/skills/*/SKILL.md` invocan agentes por nombre.

## Goals / Non-Goals

**Goals:**
- Consolidar agentes task-based en 3 agentes role-based: `product-manager-agent`, `architect-agent`, `ux-designer-agent`
- Cada agente role-based tiene expertise amplio que aplica en múltiples estados del workflow
- Actualizar skills para referenciar los nuevos agentes por rol
- Mantener los comandos disponibles sin cambio externo (`/ps-funnel`, `/ps-draft`, etc.)

**Non-Goals:**
- Cambiar el workflow secuencial (Funnel → Draft → Discovery → SPECIFY → Approval → Planning)
- Modificar los documentos generados por cada estado
- Introducir nuevos comandos o skills
- Migrar `.claude/commands/` (legacy, se deja como está)

## Decisions

### D1: 3 roles en lugar de 1 agente orquestador

**Decisión:** Crear 3 agentes especializados (PM, Architect, UX) en lugar de un único agente generalista.

**Rationale:** Cada rol aporta perspectiva distinta. El PM conduce entrevistas y genera documentos de intención; el Architect valida viabilidad técnica y genera specs de arquitectura; el UX valida flujos y usabilidad. Un agente único pierde la especialización.

**Alternativa descartada:** Un solo `orchestrator-agent.md` que delegue a subagentes — demasiado complejo para el principio de minimalismo.

### D2: Mapeo de roles a estados del workflow

| Estado      | Agente principal          | Agente secundario     |
|-------------|---------------------------|-----------------------|
| Funnel      | product-manager-agent     | —                     |
| Draft       | product-manager-agent     | —                     |
| Discovery   | product-manager-agent     | ux-designer-agent     |
| SPECIFY  | architect-agent           | product-manager-agent |
| Approval    | product-manager-agent     | architect-agent       |
| Planning    | architect-agent           | —                     |

### D3: Frontmatter de los nuevos agentes

```yaml
# product-manager-agent.md
---
name: product-manager-agent
description: PM especializado en entrevistas de discovery, intención de producto y gestión del pipeline de especificación
tools: Read, Write, Edit, AskUserQuestion
model: claude-sonnet-4-6
---

# architect-agent.md
---
name: architect-agent
description: Arquitecto técnico especializado en especificaciones de software, validación de requisitos y planificación técnica
tools: Read, Write, Edit, AskUserQuestion
model: claude-sonnet-4-6
---

# ux-designer-agent.md
---
name: ux-designer-agent
description: UX Designer especializado en flujos de usuario, usabilidad y validación de experiencia en discovery y SPECIFY
tools: Read, Write, Edit, AskUserQuestion
model: claude-sonnet-4-6
---
```

### D4: Eliminación de agentes task-based

Los 6 archivos task-based se eliminan. No se crean aliases ni redirecciones — los skills se actualizan directamente para referenciar los nuevos agentes.

## Risks / Trade-offs

- **[Riesgo] Pérdida de instrucciones específicas de cada estado** → Mitigation: El contenido de cada agente task-based se consolida en el agente role-based correspondiente, preservando instrucciones relevantes.
- **[Riesgo] Skills que referencian agentes eliminados quedan rotos** → Mitigation: Todos los SKILL.md se actualizan en la misma operación antes de eliminar los agentes task-based.
- **[Trade-off] Agentes más grandes** → Los agentes role-based tendrán más instrucciones al cubrir múltiples estados. Aceptable dado que Claude Code carga el agente completo por sesión.
