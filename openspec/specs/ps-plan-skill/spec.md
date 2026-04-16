## MODIFIED Requirements

### Requirement: ps-plan skill is a full orchestrator (not a stub)
The `/ps-plan` skill SHALL implement the full Planning phase orchestration: validate prerequisites (`clarifications.md` and template), delegate to `planning-agent`, and confirm output — replacing the previous stub implementation that listed steps without a proper agent delegation pattern.

#### Scenario: Full orchestration flow
- **WHEN** the user runs `/ps-plan`
- **THEN** the skill validates `clarifications.md` exists, validates the template exists, invokes `planning-agent`, verifies `project-plan.md` was created, and reports success to the user

#### Scenario: Output path updated
- **WHEN** the skill produces output
- **THEN** the output is written to `docs/specs/project/project-plan.md` (not `docs/specs/plan.md` as previously implied by the stub)
