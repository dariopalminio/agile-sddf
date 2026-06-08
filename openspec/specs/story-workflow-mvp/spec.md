# story-workflow-mvp Specification

## Purpose
TBD - created by archiving change mvp-baseline. Update Purpose after archive.
## Requirements
### Requirement: story-analyze skill exists as part of the story workflow
The system SHALL provide the `story-analyze` skill as a coherence audit step in the story SDD workflow, positioned after `story-tasking` and before implementation.

#### Scenario: story-analyze skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-059 is READY-FOR-CODE-REVIEW
- **THEN** `.claude/skills/story-analyze/SKILL.md` exists alongside `story-design` and `story-tasking` skills, completing the four-artifact story workflow

### Requirement: story-plan skill provides single-command planning entry point
The system SHALL provide the `story-plan` skill as a pipeline orchestrator that executes the complete planning flow (`story-design → story-tasking → story-analyze`) with a single command.

#### Scenario: story-plan skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-060 is READY-FOR-CODE-REVIEW
- **THEN** `.claude/skills/story-plan/SKILL.md` exists and can be invoked as an alternative to running `story-design`, `story-tasking`, and `story-analyze` individually

### Requirement: story-implement skill provides single-command implementation entry point
The system SHALL provide the `story-implement` skill as the code generation step of the SDD workflow, consuming `story.md`, `design.md`, and `tasks.md` to produce code following TDD methodology.

#### Scenario: story-implement skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-061 is READY-FOR-CODE-REVIEW
- **THEN** `.claude/skills/story-implement/SKILL.md` exists and can be invoked after `story-plan` to complete the full SDD cycle from specification to code

### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the six story workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, `finvest-evaluation`, `story-analyze`, `story-plan`, and `story-implement`. Each skill SHALL manage `status`/`substatus` transitions in `story.md` frontmatter according to the `story-lifecycle-states` capability.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, `.claude/skills/finvest-evaluation/`, `.claude/skills/story-analyze/`, `.claude/skills/story-plan/`, and `.claude/skills/story-implement/` exist and each includes a `SKILL.md`

#### Scenario: Full workflow produces observable status progression
- **WHEN** a story goes through the complete workflow: `story-creation` → `story-plan` → `story-implement`
- **THEN** the `status`/`substatus` sequence in `story.md` follows: `SPECIFY/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLAN/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENT/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`

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

### Requirement: Story lifecycle states are visible between workflow steps
The system SHALL expose the `status` and `substatus` fields of `story.md` as observable markers at each transition point of the SDD workflow, so the current lifecycle phase is always readable without inspecting artifact files.

#### Scenario: Status visible after each major workflow step
- **WHEN** a developer reads `story.md` after running any story workflow skill
- **THEN** the `status` and `substatus` fields in the frontmatter reflect the last completed lifecycle transition

