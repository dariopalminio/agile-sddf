### Requirement: Skill entry point for project story mapping
The system SHALL provide a skill at `.claude/skills/project-story-mapping/SKILL.md` that acts as the entry point and coordinator for the User Story Mapping process within the SDDF project pipeline.

#### Scenario: Skill is invoked
- **WHEN** the user invokes the `user-story-mapping` skill
- **THEN** the skill reads available project documents (`project-intent.md`, `requirement-spec.md`) and delegates the full mapping session to the `project-story-mapper` agent

#### Scenario: Project documents are absent
- **WHEN** the skill is invoked and no project documents exist
- **THEN** the agent asks the user interactively for project context before proceeding with the mapping

### Requirement: Dedicated story mapper agent
The system SHALL provide an agent at `.claude/agents/project-story-mapper.agent.md` that conducts the User Story Mapping session following Jeff Patton's technique.

#### Scenario: Agent produces a story map document
- **WHEN** the agent completes the mapping session
- **THEN** it writes `docs/specs/project/story-map.md` containing backbone activities, walking skeleton, user tasks, and release slices

#### Scenario: Agent generates an ASCII map
- **WHEN** the story map document is created
- **THEN** the document includes an ASCII table showing the backbone, walking skeleton, and at least one release slice

### Requirement: Story map document structure
The output document `docs/specs/project/story-map.md` SHALL follow a defined structure.

#### Scenario: Document contains required sections
- **WHEN** the story map document is generated
- **THEN** it contains sections for: Project context summary, Personas, Backbone (activities in sequence), Walking Skeleton, User Tasks per activity, and Release Slices

#### Scenario: Document is overwritable
- **WHEN** the skill is run again on the same project
- **THEN** the existing `story-map.md` is overwritten with the new map
