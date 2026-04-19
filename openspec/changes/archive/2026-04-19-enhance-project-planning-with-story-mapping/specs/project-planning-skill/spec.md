## ADDED Requirements

### Requirement: project-planning offers story mapping phase before planning
The skill SHALL check whether `docs/specs/project/story-map.md` exists after validating prerequisites, and offer to run the `project-story-mapping` skill to generate it if absent.

#### Scenario: Story map does not exist — user accepts
- **WHEN** `story-map.md` does not exist and the user chooses to run story mapping
- **THEN** the skill invokes the `project-story-mapping` skill, waits for it to produce `story-map.md`, and then continues to the architect delegation step

#### Scenario: Story map does not exist — user skips
- **WHEN** `story-map.md` does not exist and the user chooses to skip story mapping
- **THEN** the skill continues to the architect delegation step without `story-map.md`, behaving as in the previous version

#### Scenario: Story map already exists
- **WHEN** `story-map.md` exists
- **THEN** the skill reads it and informs the user it will be used to enrich the plan, then continues to the architect delegation step without asking

## MODIFIED Requirements

### Requirement: project-planning delegates to project-architect
The skill SHALL invoke the `project-architect` with an instruction to read the requirement spec, read the template, and produce `docs/specs/project/project-plan.md`. When `docs/specs/project/story-map.md` exists, the architect MUST also read it and use its backbone activities and release slices as structural guidance for feature grouping and release definition in the plan.

#### Scenario: Delegation to agent without story map
- **WHEN** prerequisites are validated and `story-map.md` does not exist
- **THEN** the skill invokes project-architect with the full context of input documents and template path (identical to previous behavior)

#### Scenario: Delegation to agent with story map
- **WHEN** prerequisites are validated and `story-map.md` exists
- **THEN** the skill invokes project-architect with input documents, template path, AND `story-map.md`, instructing it to use the backbone as a guide for feature grouping and the release slices as a guide for release structure
