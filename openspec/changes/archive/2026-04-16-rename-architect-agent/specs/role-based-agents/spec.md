## RENAMED Requirements

### Requirement: Architect Agent exists as role-based agent
FROM: Architect Agent exists as role-based agent
TO: Project-Architect Agent exists as role-based agent

## MODIFIED Requirements

### Requirement: Project-Architect Agent exists as role-based agent
El sistema SHALL incluir un agente `project-architect` en `.claude/agents/project-architect.agent.md` con frontmatter YAML válido (name: project-architect, description, tools, model) que lo describa como arquitecto técnico especializado en especificaciones de software y planificación técnica.

#### Scenario: Architect agent handles SPECIFY and planning states
- **WHEN** los skills project-discovery o project-planning invocan al agente
- **THEN** el `project-architect` DEBE ejecutar la tarea correspondiente con enfoque técnico
