## ADDED Requirements

### Requirement: Agent identifier
The agent SHALL be identified and invocable as `reverse-engineer-synthesizer` across all references in the system.

#### Scenario: Skill invokes agent by new name
- **WHEN** the `reverse-engineering` skill executes its synthesis phase
- **THEN** the agent SHALL be referenced as `reverse-engineer-synthesizer` in the plan diagram and section heading

#### Scenario: Analysis agents reference synthesizer by new name
- **WHEN** any of the four parallel analysis agents (`reverse-engineer-architect`, `reverse-engineer-business-analyst`, `reverse-engineer-product-discovery`, `reverse-engineer-ux-flow-mapper`) describe their output consumer
- **THEN** they SHALL reference `reverse-engineer-synthesizer` (not `requirements-synthesizer`)
