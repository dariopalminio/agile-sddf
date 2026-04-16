## ADDED Requirements

### Requirement: project-plan-template defines minimal output structure
The template at `.claude/skills/ps-plan/templates/project-plan-template.md` SHALL define the following top-level sections via `##` headers, in order: metadata block, Objetivo, Backlog de Features, Propuesta de Releases, and Resumen. HTML comments SHALL provide generation guidance without appearing in final output.

#### Scenario: Template sections present
- **WHEN** the planning-agent reads the template
- **THEN** it finds all required sections and uses them as the structure for `project-plan.md`

### Requirement: Backlog section uses tabular format with priority, feature, and dependencies
The Backlog de Features section SHALL use a Markdown table with columns: Prioridad (numeric), Feature (FEAT-ID + name + one-sentence description with checkbox prefix), and Dependencias.

#### Scenario: Backlog table rendered
- **WHEN** the agent fills the Backlog section
- **THEN** each row contains a priority number, a checked-list feature entry, and explicit dependency IDs or "—"

### Requirement: Releases section groups features with success criteria
The Propuesta de Releases section SHALL contain at minimum: Release 1 labeled as MVP with an objective and success criteria checklist, and Release 2 with an objective. Additional releases are optional.

#### Scenario: MVP release defined
- **WHEN** the agent fills the Releases section
- **THEN** Release 1 is labeled "MVP", contains a feature table, and lists at least two measurable success criteria

### Requirement: Summary section provides metrics table
The Resumen section SHALL contain a Markdown table with: Total Features, Features en MVP, and Releases planificados.

#### Scenario: Summary table populated
- **WHEN** the agent completes the document
- **THEN** the Resumen table shows accurate counts derived from the backlog and release sections
