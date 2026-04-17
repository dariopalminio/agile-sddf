## ADDED Requirements

### Requirement: Agent identifier
The agent SHALL be identified and invocable as `reverse-engineer-business-analyst` across all references in the system.

#### Scenario: Skill invokes agent by new name
- **WHEN** the `reverse-engineering` skill executes its parallel analysis phase
- **THEN** the agent SHALL be referenced as `reverse-engineer-business-analyst` in the plan diagram and section heading

#### Scenario: Synthesizer references agent by new name
- **WHEN** the `requirements-synthesizer` agent lists its input agents
- **THEN** it SHALL reference `reverse-engineer-business-analyst` (not `business-rules-analyst`)
