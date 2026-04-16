# Spec: Role-Based Agents

## Requirements

### Requirement: Product Manager Agent exists as role-based agent
El sistema SHALL incluir un agente `product-manager-agent` en `.claude/agents/product-manager-agent.md` con frontmatter YAML válido (name, description, tools, model) que lo describa como PM especializado en entrevistas, discovery e intención de producto.

#### Scenario: Agent file exists with valid frontmatter
- **WHEN** se ejecuta cualquier skill del pipeline (ps-funnel, ps-draft, ps-discovery, ps-approval)
- **THEN** el sistema DEBE poder invocar `product-manager-agent` como subagente desde el SKILL.md correspondiente

#### Scenario: PM agent handles multiple pipeline states
- **WHEN** un skill de los estados Funnel, Draft, Discovery o Approval invoca al agente
- **THEN** el `product-manager-agent` DEBE ejecutar la tarea correspondiente a ese estado sin errores

### Requirement: Architect Agent exists as role-based agent
El sistema SHALL incluir un agente `architect-agent` en `.claude/agents/architect-agent.md` con frontmatter YAML válido que lo describa como arquitecto técnico especializado en especificaciones de software y planificación técnica.

#### Scenario: Architect agent handles specifying and planning states
- **WHEN** los skills ps-specifying o ps-planning invocan al agente
- **THEN** el `architect-agent` DEBE ejecutar la tarea correspondiente con enfoque técnico

### Requirement: UX Designer Agent exists as role-based agent
El sistema SHALL incluir un agente `ux-designer-agent` en `.claude/agents/ux-designer-agent.md` con frontmatter YAML válido que lo describa como UX Designer especializado en flujos de usuario y usabilidad.

#### Scenario: UX agent supports discovery state
- **WHEN** el skill ps-discovery invoca al agente UX como agente secundario
- **THEN** el `ux-designer-agent` DEBE aportar perspectiva de usabilidad al documento de discovery generado

### Requirement: Task-based agents are removed
El sistema NO SHALL contener agentes task-based (`funnel-agent`, `draft-agent`, `discovery-agent`, `specifying-agent`, `approval-agent`, `planning-agent`) en `.claude/agents/` tras la migración.

#### Scenario: No task-based agent files remain
- **WHEN** se lista el directorio `.claude/agents/`
- **THEN** MUST NOT existir ningún archivo con los nombres: funnel-agent.md, draft-agent.md, discovery-agent.md, specifying-agent.md, approval-agent.md, planning-agent.md

### Requirement: Skills reference role-based agents
Todos los SKILL.md que previamente referenciaban agentes task-based SHALL actualizarse para referenciar los agentes role-based correspondientes según el mapeo definido en design.md.

#### Scenario: ps-funnel skill uses product-manager-agent
- **WHEN** el usuario ejecuta `/ps-funnel`
- **THEN** el skill MUST invocar `product-manager-agent` (no `funnel-agent`)

#### Scenario: ps-specifying skill uses architect-agent
- **WHEN** el usuario ejecuta `/ps-specifying`
- **THEN** el skill MUST invocar `architect-agent` como agente principal
