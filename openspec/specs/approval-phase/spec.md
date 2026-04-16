### Requirement: Approval phase has a clarifications template
The system SHALL provide a `clarifications-template.md` at `.claude/skills/ps-approval/templates/clarifications-template.md`. The template SHALL define the structure of the output document using `##` section headers and `<!-- -->` inline comments as guidance. The template SHALL NOT be modified by any agent at runtime.

#### Scenario: Template exists and is readable
- **WHEN** the `approval-agent` starts execution
- **THEN** it reads the template from `.claude/skills/ps-approval/templates/clarifications-template.md` without error

#### Scenario: Template drives section structure at runtime
- **WHEN** the `approval-agent` extracts sections from the template
- **THEN** it derives section names from `##` headers and question guidance from `<!-- -->` comments without using any hardcoded section names

### Requirement: ps-approval skill validates requirement-spec state
The system SHALL provide a `ps-approval` skill at `.claude/skills/ps-approval/SKILL.md`. The skill SHALL read `docs/specs/project/requirement-spec.md` and verify the `**Estado**` field before proceeding.

#### Scenario: requirement-spec.md does not exist
- **WHEN** the user runs `/ps-approval`
- **THEN** the skill informs the user that `requirement-spec.md` is missing and instructs them to run `/ps-specifying` first, then stops execution

#### Scenario: requirement-spec.md has Estado Ready
- **WHEN** `requirement-spec.md` exists and `**Estado**` equals `Ready`
- **THEN** the skill proceeds directly to delegating to `approval-agent`

#### Scenario: requirement-spec.md has Estado Doing — user confirms
- **WHEN** `requirement-spec.md` has `**Estado**: Doing` and the user confirms they want to proceed
- **THEN** the skill changes `**Estado**` from `Doing` to `Ready` using the Edit tool and then delegates to `approval-agent`

#### Scenario: requirement-spec.md has Estado Doing — user rejects
- **WHEN** `requirement-spec.md` has `**Estado**: Doing` and the user declines to proceed
- **THEN** the skill informs the user to complete the Specifying phase first and stops execution

### Requirement: approval-agent reads all prior phase documents
The `approval-agent` SHALL read `initial-prompt.md`, `project-intent.md`, `discovery.md`, and `requirement-spec.md` from `docs/specs/project/` before beginning analysis.

#### Scenario: All four input documents are available
- **WHEN** all four prior-phase documents exist
- **THEN** the agent reads all four and uses their content to pre-fill known answers and identify gaps

#### Scenario: A prior-phase document is missing
- **WHEN** one or more of the four input documents cannot be read
- **THEN** the agent notes the missing document, continues with available documents, and flags the gap in the output

### Requirement: approval-agent performs multi-lens analysis
The `approval-agent` SHALL analyze the input documents from three distinct perspectives: PM (scope, business goals, success criteria), Architect (technical feasibility, NFRs, missing constraints), and UX (user journeys, usability gaps, missing personas). Each lens SHALL produce specific findings before questions are formulated.

#### Scenario: PM lens produces scope/business findings
- **WHEN** the agent applies the PM lens
- **THEN** it identifies ambiguous acceptance criteria, undefined success metrics, and scope boundary issues

#### Scenario: Architect lens produces technical findings
- **WHEN** the agent applies the Architect lens
- **THEN** it identifies under-specified NFRs, missing integration points, and technical risk areas

#### Scenario: UX lens produces user-journey findings
- **WHEN** the agent applies the UX lens
- **THEN** it identifies missing user personas, undefined edge-case flows, and usability gaps

### Requirement: approval-agent conducts structured user interview
The `approval-agent` SHALL present findings to the user as grouped questions (max 3–4 per round), allow iterative responses, and follow up on answers to resolve critical ambiguities before writing the output document.

#### Scenario: Questions grouped by theme, max 4 per round
- **WHEN** the agent presents questions
- **THEN** questions are grouped by category (e.g., Alcance, Viabilidad Técnica, Usuarios) and no more than 4 are presented per interaction round

#### Scenario: Follow-up on critical answers
- **WHEN** a user answer introduces a new ambiguity or contradicts prior information
- **THEN** the agent generates a follow-up question before closing the interview for that topic

### Requirement: approval-agent produces clarifications.md
The `approval-agent` SHALL write `docs/specs/project/clarifications.md` using the template structure. The document SHALL include all findings, each question with its answer, a classification of resolved vs. pending items, and generation metadata.

#### Scenario: clarifications.md is written after interview completes
- **WHEN** the user has answered all questions (or explicitly indicated no more input)
- **THEN** the agent writes `docs/specs/project/clarifications.md` with `**Estado**: Doing` and `**Generado por**: approval-agent`

#### Scenario: Output uses template structure
- **WHEN** the agent writes the output file
- **THEN** all `##` sections from `clarifications-template.md` are present in the output, HTML comments are not included, and all findings are mapped to their respective sections

#### Scenario: Template is never modified
- **WHEN** the agent produces output
- **THEN** the file at `.claude/skills/ps-approval/templates/clarifications-template.md` is unchanged

### Requirement: ps-approval skill confirms output and prompts next step
After `approval-agent` completes, the `ps-approval` skill SHALL verify that `docs/specs/project/clarifications.md` exists and inform the user of the next step.

#### Scenario: clarifications.md exists after agent run
- **WHEN** `approval-agent` finishes and `clarifications.md` exists
- **THEN** the skill displays a success message and instructs the user to review/edit the file and run `/ps-plan` when ready

#### Scenario: clarifications.md missing after agent run
- **WHEN** `approval-agent` finishes but `clarifications.md` does not exist
- **THEN** the skill informs the user something went wrong and suggests re-running `/ps-approval`
