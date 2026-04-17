## RENAMED Requirements

### Requirement: Agent identifier
FROM: `product-discovery`
TO: `reverse-engineer-product-discovery`

The agent SHALL be identified and invocable as `reverse-engineer-product-discovery` across all references in the system.

#### Scenario: Skill invokes agent by new name
- **WHEN** the `reverse-engineering` skill executes its parallel analysis phase
- **THEN** the agent SHALL be referenced as `reverse-engineer-product-discovery` in the plan diagram and section heading

#### Scenario: Synthesizer references agent by new name
- **WHEN** the `requirements-synthesizer` agent lists its input agents
- **THEN** it SHALL reference `reverse-engineer-product-discovery` (not `product-discovery`)
