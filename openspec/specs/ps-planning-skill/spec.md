## ADDED Requirements

### Requirement: ps-planning reads existing document state
El skill SHALL leer el campo `**Estado**:` de `docs/specs/project/project-plan.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in Doing state
- **WHEN** `project-plan.md` existe con `Estado: Doing`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-plan.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: ps-planning validates requirement-spec.md is Ready
El skill SHALL verificar que `docs/specs/project/requirement-spec.md` existe y tiene `Estado: Ready` antes de delegar al agente.

#### Scenario: Input present and Ready
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill continua al siguiente paso

#### Scenario: Input missing or Doing
- **WHEN** `requirement-spec.md` no existe o tiene `Estado: Doing`
- **THEN** el skill informa al usuario que debe completar la fase Discovery primero y detiene la ejecucion

### Requirement: ps-planning validates template exists
The skill SHALL verify that `.claude/skills/ps-planning/templates/project-plan-template.md` exists before delegating to the agent.

#### Scenario: Template present
- **WHEN** the template file exists
- **THEN** the skill proceeds to delegate to architect-agent

#### Scenario: Template absent
- **WHEN** the template file does not exist
- **THEN** the skill displays an error message and halts execution

### Requirement: ps-planning delegates to architect-agent
The skill SHALL invoke the `architect-agent` with an instruction to read the requirement spec, read the template, and produce `docs/specs/project/project-plan.md`.

#### Scenario: Delegation to agent
- **WHEN** prerequisites are validated
- **THEN** the skill invokes architect-agent with the full context of input documents and template path

### Requirement: ps-planning confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-plan.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento e indicar que el workflow esta completo y el documento esta listo para revision

#### Scenario: Output missing after agent run
- **WHEN** architect-agent completes but `project-plan.md` does not exist
- **THEN** the skill informs the user that something went wrong and suggests re-running `/ps-planning`
