## ADDED Requirements

### Requirement: project-planning reads existing document state
El skill SHALL leer el campo `**Estado**:` de `docs/specs/project/project-plan.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in Doing state
- **WHEN** `project-plan.md` existe con `Estado: Doing`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-plan.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: project-planning validates requirement-spec.md is Ready
El skill SHALL verificar que `docs/specs/project/requirement-spec.md` existe y tiene `Estado: Ready` antes de delegar al agente.

#### Scenario: Input present and Ready
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill continua al siguiente paso

#### Scenario: Input missing or Doing
- **WHEN** `requirement-spec.md` no existe o tiene `Estado: Doing`
- **THEN** el skill informa al usuario que debe completar la fase Discovery primero y detiene la ejecucion

### Requirement: project-planning validates template exists
The skill SHALL verify that `.claude/skills/project-planning/templates/project-plan-template.md` exists before delegating to the agent.

#### Scenario: Template present
- **WHEN** the template file exists
- **THEN** the skill proceeds to delegate to project-architect

#### Scenario: Template absent
- **WHEN** the template file does not exist
- **THEN** the skill displays an error message and halts execution

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

### Requirement: project-planning delegates to project-architect
The skill SHALL invoke the `project-architect` with an instruction to read the requirement spec, read the template, and produce `docs/specs/project/project-plan.md`. When `docs/specs/project/story-map.md` exists, the architect MUST also read it and use its backbone activities and release slices as structural guidance for feature grouping and release definition in the plan.

#### Scenario: Delegation to agent without story map
- **WHEN** prerequisites are validated and `story-map.md` does not exist
- **THEN** the skill invokes project-architect with the full context of input documents and template path (identical to previous behavior)

#### Scenario: Delegation to agent with story map
- **WHEN** prerequisites are validated and `story-map.md` exists
- **THEN** the skill invokes project-architect with input documents, template path, AND `story-map.md`, instructing it to use the backbone as a guide for feature grouping and the release slices as a guide for release structure

### Requirement: project-planning confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-plan.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento e indicar que el workflow esta completo y el documento esta listo para revision

#### Scenario: Output missing after agent run
- **WHEN** project-architect completes but `project-plan.md` does not exist
- **THEN** the skill informs the user that something went wrong and suggests re-running `/project-planning`
