<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: Story lifecycle states are visible between workflow steps
The system SHALL expose the `status` and `substatus` fields of `story.md` as observable markers at each transition point of the SDD workflow, so the current lifecycle phase is always readable without inspecting artifact files.

#### Scenario: Status visible after each major workflow step
- **WHEN** a developer reads `story.md` after running any story workflow skill
- **THEN** the `status` and `substatus` fields in the frontmatter reflect the last completed lifecycle transition

## MODIFIED Requirements

### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the six story workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, `finvest-evaluation`, `story-analyze`, `story-plan`, and `story-implement`. Each skill SHALL manage `status`/`substatus` transitions in `story.md` frontmatter according to the `story-lifecycle-states` capability.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, `.claude/skills/finvest-evaluation/`, `.claude/skills/story-analyze/`, `.claude/skills/story-plan/`, and `.claude/skills/story-implement/` exist and each includes a `SKILL.md`

#### Scenario: Full workflow produces observable status progression
- **WHEN** a story goes through the complete workflow: `story-creation` → `story-plan` → `story-implement`
- **THEN** the `status`/`substatus` sequence in `story.md` follows: `SPECIFY/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLAN/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENTING/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`
