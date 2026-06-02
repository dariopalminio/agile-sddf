<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: Story lifecycle defines a linear state machine with six states
The system SHALL define the story lifecycle as a linear state machine with the following valid states and substates in `story.md` frontmatter:

| State | Substatus | Set by | Meaning |
|---|---|---|---|
| `SPECIFY` | `IN‑PROGRESS` | `story-creation` / `story-refine` | La historia está siendo especificada |
| `READY-FOR-PLAN` | `DONE` | `story-creation` / `story-refine` | Especificación aprobada (FINVEST APROBADA) |
| `PLAN` | `IN‑PROGRESS` | `story-plan` | El pipeline de planning está en curso |
| `READY-FOR-IMPLEMENT` | `DONE` | `story-analyze` | Planning completo y artefactos coherentes |
| `IMPLEMENTING` | `IN‑PROGRESS` | `story-implement` | Implementación en curso |
| `READY-FOR-CODE-REVIEW` | `DONE` | `story-implement` | Historia completamente implementada |

#### Scenario: State machine defines valid transitions
- **WHEN** a skill updates the story status
- **THEN** the transition MUST follow the sequence: `SPECIFY/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLAN/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENTING/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`

### Requirement: Stories without explicit status are treated as BACKLOG/TODO
The system SHALL treat any `story.md` without a `status` field (or with `status: BACKLOG`) as being in the initial `BACKLOG/TODO` state, allowing all skills to operate on it without precondition failures.

#### Scenario: Story with no status field
- **WHEN** a skill reads `story.md` and the frontmatter contains no `status` field or `status: BACKLOG`
- **THEN** the skill treats the story as eligible for the first applicable transition (e.g., `story-creation` can set `SPECIFY/IN‑PROGRESS`)

### Requirement: Skills update story.md frontmatter status fields directly
The system SHALL update `status` and `substatus` fields in the frontmatter YAML of `story.md` by rewriting the file inline, without external scripts or tools. The LLM executing the skill is responsible for writing the updated frontmatter.

#### Scenario: Status update on transition
- **WHEN** a skill reaches a state transition point (start or end of execution)
- **THEN** the skill rewrites the `status` and `substatus` fields in `story.md` frontmatter to the new values before proceeding

### Requirement: Story status is observable via the frontmatter at any point
The system SHALL maintain `status` and `substatus` as the authoritative record of where a story is in its lifecycle, readable by any skill, agent, or developer.

#### Scenario: Status reflects current lifecycle phase
- **WHEN** a developer reads `story.md`
- **THEN** the `status` and `substatus` fields in the frontmatter accurately reflect the last completed lifecycle transition
