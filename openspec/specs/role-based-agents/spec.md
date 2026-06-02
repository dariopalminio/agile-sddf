# Spec: Role-Based Agents

## Requirements

### Requirement: Project-PM Agent exists as role-based agent
El sistema SHALL incluir un agente `project-pm` en `.claude/agents/project-pm.agent.md` con frontmatter YAML válido (name: project-pm, description, tools, model) que lo describa como PM especializado en entrevistas, discovery e intención de producto.

#### Scenario: Agent file exists with valid frontmatter
- **WHEN** se ejecuta cualquier skill del pipeline (project-begin, project-discovery)
- **THEN** el sistema DEBE poder invocar `project-pm` como subagente desde el SKILL.md correspondiente

#### Scenario: PM agent handles multiple pipeline states
- **WHEN** un skill de los estados Begin Intention o Discovery invoca al agente
- **THEN** el `project-pm` DEBE ejecutar la tarea correspondiente a ese estado sin errores

### Requirement: Project-Architect Agent exists as role-based agent
El sistema SHALL incluir un agente `project-architect` en `.claude/agents/project-architect.agent.md` con frontmatter YAML válido (name: project-architect, description, tools, model) que lo describa como arquitecto técnico especializado en especificaciones de software y planificación técnica.

#### Scenario: Architect agent handles SPECIFY and planning states
- **WHEN** los skills project-discovery o project-planning invocan al agente
- **THEN** el `project-architect` DEBE ejecutar la tarea correspondiente con enfoque técnico

### Requirement: Project-UX Agent exists as role-based agent
El sistema SHALL incluir un agente `project-ux` en `.claude/agents/project-ux.agent.md` con frontmatter YAML válido (name: project-ux, description, tools, model) que lo describa como UX Designer especializado en flujos de usuario y usabilidad.

#### Scenario: UX agent supports discovery state
- **WHEN** el skill project-discovery invoca al agente UX como agente secundario
- **THEN** el `project-ux` DEBE aportar perspectiva de usabilidad al documento de discovery generado

### Requirement: Task-based agents are removed
El sistema NO SHALL contener agentes task-based (`funnel-agent`, `draft-agent`, `discovery-agent`, `SPECIFY-agent`, `approval-agent`, `planning-agent`) en `.claude/agents/` tras la migración.

#### Scenario: No task-based agent files remain
- **WHEN** se lista el directorio `.claude/agents/`
- **THEN** MUST NOT existir ningún archivo con los nombres: funnel-agent.md, draft-agent.md, discovery-agent.md, SPECIFY-agent.md, approval-agent.md, planning-agent.md

### Requirement: Skills reference role-based agents
Todos los SKILL.md que previamente referenciaban agentes task-based SHALL actualizarse para referenciar los agentes role-based correspondientes según el mapeo definido en design.md.

#### Scenario: ps-funnel skill uses project-pm
- **WHEN** el usuario ejecuta `/ps-funnel`
- **THEN** el skill MUST invocar `project-pm` (no `funnel-agent`)

#### Scenario: ps-SPECIFY skill uses project-architect
- **WHEN** el usuario ejecuta `/ps-SPECIFY`
- **THEN** el skill MUST invocar `project-architect` como agente principal
