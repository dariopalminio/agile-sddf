## ADDED Requirements

### Requirement: Planning agent reads all prior phase documents
The planning-agent SHALL read `docs/specs/project/initial-prompt.md`, `docs/specs/project/project-intent.md`, `docs/specs/project/discovery.md`, `docs/specs/project/requirement-spec.md`, and `docs/specs/project/clarifications.md` before generating output.

#### Scenario: All documents present
- **WHEN** all five input documents exist
- **THEN** the agent reads them all and proceeds to feature extraction

#### Scenario: Some documents missing
- **WHEN** one or more input documents are absent
- **THEN** the agent notes missing files and continues with available documents

### Requirement: Planning agent extracts atomic features
The agent SHALL identify features as units of business or user value — independently developable and testable — assigning each a unique ID in the format `FEAT-NNN` (zero-padded to three digits).

#### Scenario: Feature extraction from requirements
- **WHEN** the agent analyzes `requirement-spec.md` and `clarifications.md`
- **THEN** each distinct user-facing capability becomes a separate FEAT entry with a clear name and one-sentence description

#### Scenario: No task-level items
- **WHEN** a candidate item is a developer task (e.g., "configure CI pipeline") rather than a user-facing feature
- **THEN** the agent excludes it from the feature backlog

### Requirement: Planning agent analyzes dependencies between features
The agent SHALL identify which features block or depend on other features and document this explicitly in the backlog.

#### Scenario: Dependency detected
- **WHEN** FEAT-002 cannot be built or tested without FEAT-001 being complete
- **THEN** FEAT-002 lists "FEAT-001" in its Dependencies field

#### Scenario: No dependencies
- **WHEN** a feature has no prerequisites
- **THEN** its Dependencies field shows "—"

### Requirement: Planning agent prioritizes features
The agent SHALL order features by: (1) business value — high to low, (2) dependency order — blocking features ranked higher, (3) technical risk — higher-risk features placed earlier in releases for fast feedback.

#### Scenario: Prioritized backlog
- **WHEN** the agent produces the backlog
- **THEN** features are listed in descending priority order (1 = highest)

### Requirement: Planning agent proposes releases with MVP
The agent SHALL group features into at least two releases. Release 1 MUST be labeled "MVP" and contain the minimum set of features that solve the core problem identified in `project-intent.md`, can be deployed to real users, and enables early feedback.

#### Scenario: MVP definition
- **WHEN** the agent defines Release 1 (MVP)
- **THEN** it includes only features essential to core value delivery, with no more than ~5 features unless the project requires more

#### Scenario: Subsequent releases
- **WHEN** the agent defines Release 2+
- **THEN** each release has a descriptive name and adds incremental value beyond the MVP

### Requirement: Planning agent reads template at runtime
The agent SHALL read `.claude/skills/ps-plan/templates/project-plan-template.md` to derive the output structure dynamically, using each `##` header as a section and `<!-- -->` comments as guidance.

#### Scenario: Template-driven output
- **WHEN** the template is read
- **THEN** the agent produces `project-plan.md` with sections matching the template headers, without copying HTML comments into the output

### Requirement: Planning agent writes project-plan.md with metadata
The agent SHALL write `docs/specs/project/project-plan.md` including: project name, document version, Estado: Doing, generation date (YYYY-MM-DD), and Generado por: planning-agent.

#### Scenario: Output written
- **WHEN** the agent completes analysis
- **THEN** `docs/specs/project/project-plan.md` is created with correct metadata and full backlog content

### Requirement: Planning agent uses check-list format for features
Every feature in the backlog and in release tables SHALL begin with `- [ ]` (empty checkbox) to enable manual progress tracking.

#### Scenario: Checkbox format
- **WHEN** a feature appears in the backlog or release table
- **THEN** it is prefixed with `- [ ]`
