# story-workflow-mvp Specification

## Purpose
TBD - created by archiving change mvp-baseline. Update Purpose after archive.
## Requirements
### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the three MVP workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, and `finvest-evaluation`.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, and `.claude/skills/finvest-evaluation/` exist and include a `SKILL.md`

### Requirement: Story Creation Produces Canonical Story-Gherkin Output
The system SHALL generate a user story in canonical story-gherkin format from a natural-language need, including role, goal, measurable benefit, and at least one main acceptance scenario.

#### Scenario: Creation from natural-language need
- **WHEN** a user provides a feature need in natural language to story creation
- **THEN** the output includes Como/Quiero/Para fields and at least one acceptance scenario with Dado/Cuando/Entonces structure

### Requirement: Story Split Produces Independent Child Stories
The system SHALL split an oversized story into smaller, independently deliverable stories, and each resulting story MUST preserve canonical story-gherkin structure.

#### Scenario: Split oversized story
- **WHEN** a story is identified as too large for direct planning
- **THEN** the system returns two or more smaller stories that each include complete Como/Quiero/Para and acceptance scenarios

### Requirement: FINVEST Evaluation Returns Dimension Scores and Decision
The system SHALL evaluate a story using FINVEST dimensions on a Likert 1-5 scale and MUST produce a global score with one decision: APROBADA, REFINAR, or RECHAZAR.

#### Scenario: Evaluate valid canonical story
- **WHEN** a canonical story is submitted to FINVEST evaluation
- **THEN** the result includes score per FINVEST dimension, global score, decision status, and actionable recommendations

### Requirement: Non-Ready Decisions Define Next Action
The system SHALL define mandatory follow-up actions for non-ready decisions to keep the workflow executable.

#### Scenario: Decision is Refinar
- **WHEN** evaluation outcome is Refinar
- **THEN** the output instructs refinement of the current story with concrete improvement actions and re-evaluation

#### Scenario: Decision is RECHAZAR
- **WHEN** evaluation outcome is RECHAZAR
- **THEN** the output instructs either full rewrite via story creation or decomposition via story split before re-evaluation

### Requirement: Evaluation Decision Uses Deterministic Threshold Rules
The system SHALL apply explicit and deterministic threshold rules to map evaluation scores into APROBADA, REFINAR, or RECHAZAR decisions.

#### Scenario: Threshold mapping is applied
- **WHEN** dimension and global scores are computed
- **THEN** the system determines the decision using documented threshold rules rather than ad-hoc judgment

