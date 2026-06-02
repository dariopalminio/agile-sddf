<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: story-plan sets PLAN/IN‑PROGRESS at the start of the pipeline
The system SHALL update `status: PLANNING` and `substatus: IN‑PROGRESS` in `story.md` frontmatter when `story-plan` begins the orchestrated pipeline, before invoking `story-design`.

#### Scenario: Status updated before pipeline starts
- **WHEN** `/story-plan` resolves the story directory and verifies `story.md` exists
- **THEN** `story.md` frontmatter MUST be updated to `status: PLANNING` and `substatus: IN‑PROGRESS` before any sub-skill (`story-design`, `story-tasking`, `story-analyze`) is invoked

#### Scenario: Status set regardless of previous state
- **WHEN** `/story-plan` is invoked on a story in any state (BACKLOG, READY-FOR-PLAN, READY-FOR-IMPLEMENT, etc.)
- **THEN** the skill sets `status: PLANNING` / `substatus: IN‑PROGRESS` unconditionally, allowing re-execution for artifact regeneration

#### Scenario: Status update reported in pipeline summary
- **WHEN** the pipeline completes or fails
- **THEN** the final summary MUST indicate whether the story status was successfully updated to `PLAN/IN‑PROGRESS` at the start
