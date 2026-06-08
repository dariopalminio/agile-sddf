<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: story-implement requires READY-FOR-IMPLEMENT/DONE status as precondition
The system SHALL verify that `story.md` has `status: READY-FOR-IMPLEMENT` and `substatus: DONE` before executing any implementation task. If the precondition is not met, the skill SHALL halt with a descriptive error.

#### Scenario: Precondition satisfied — READY-FOR-IMPLEMENT/DONE
- **WHEN** `/story-implement` is invoked and `story.md` has `status: READY-FOR-IMPLEMENT` and `substatus: DONE`
- **THEN** the skill proceeds with implementation normally

#### Scenario: Precondition not met — story not READY-FOR-IMPLEMENT
- **WHEN** `/story-implement` is invoked and `story.md` has any status other than `READY-FOR-IMPLEMENT/DONE` (e.g., `BACKLOG`, `SPECIFY`, `PLAN`)
- **THEN** the skill halts immediately with an error message indicating the current status and suggests running `/story-plan` first

#### Scenario: Precondition not met — story has no status field
- **WHEN** `/story-implement` is invoked and `story.md` has no `status` field or `status: BACKLOG`
- **THEN** the skill halts with an error suggesting running `/story-plan` to complete the planning pipeline

### Requirement: story-implement sets IMPLEMENT/IN‑PROGRESS at the start of implementation
The system SHALL update `status: IMPLEMENT` and `substatus: IN‑PROGRESS` in `story.md` frontmatter after verifying preconditions and before processing the first task.

#### Scenario: Status set before first task
- **WHEN** all preconditions are met and the skill is about to start the TDD loop
- **THEN** `story.md` frontmatter MUST be updated to `status: IMPLEMENT` and `substatus: IN‑PROGRESS` before `[T001] → implementando…` is displayed

### Requirement: story-implement sets READY-FOR-CODE-REVIEW/DONE upon completion
The system SHALL update `status: READY-FOR-CODE-REVIEW` and `substatus: DONE` in `story.md` frontmatter after all tasks have been processed (completed and/or blocked) and `implement-report.md` has been generated.

#### Scenario: Status set after all tasks processed
- **WHEN** all tasks in `tasks.md` have been processed (completed `[x]` or blocked `[~]`) and `implement-report.md` is written
- **THEN** `story.md` frontmatter MUST be updated to `status: READY-FOR-CODE-REVIEW` and `substatus: DONE`

#### Scenario: READY-FOR-CODE-REVIEW/DONE set even with blocked tasks
- **WHEN** some tasks are blocked (`[~]`) but all tasks have been evaluated and `implement-report.md` lists all blockers
- **THEN** `story.md` frontmatter MUST still be updated to `status: READY-FOR-CODE-REVIEW` and `substatus: DONE` (blocked tasks are documented, not a reason to leave the story in IMPLEMENT)

### Requirement: story-implement updates the parent release checklist on READY-FOR-CODE-REVIEW/DONE
The system SHALL locate the parent `release.md` (via `parent` field in `story.md` frontmatter) and update the story's checklist entry from `- [ ]` to `- [x]` when the story reaches `READY-FOR-CODE-REVIEW/DONE`.

#### Scenario: Release checklist updated on completion
- **WHEN** `story.md` is updated to `status: READY-FOR-CODE-REVIEW` / `substatus: DONE`
- **THEN** the skill locates `$SPECS_BASE/specs/releases/<parent>/release.md`, finds the line matching the story ID (e.g., `FEAT-NNN`), and changes `- [ ]` to `- [x]` for that entry

#### Scenario: Release parent not found — warning only
- **WHEN** the `parent` field in `story.md` is absent, or the corresponding `release.md` cannot be located
- **THEN** the skill emits a WARNING in the output and in `implement-report.md`, but does NOT block setting `READY-FOR-CODE-REVIEW/DONE` on `story.md`

#### Scenario: Story not listed in release checklist — warning only
- **WHEN** the `release.md` is found but the story ID does not appear in the checklist
- **THEN** the skill emits a WARNING and does NOT modify `release.md`, documenting the discrepancy in `implement-report.md`
