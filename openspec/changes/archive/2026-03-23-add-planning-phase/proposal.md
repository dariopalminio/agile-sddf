## Why

The Planning phase (`/ps-plan`) exists only as a stub skill with no agent or template. Without a proper `planning-agent`, structured skill, and `project-plan-template`, the pipeline cannot produce the final deliverable: a prioritized feature backlog with release proposals that PMs can act on.

## What Changes

- Add `.claude/agents/planning-agent.md` — new specialized agent that reads all prior phase documents, extracts atomic features, prioritizes them, groups them into releases (MVP first), and writes `project-plan.md`
- Replace `.claude/skills/ps-plan/SKILL.md` — upgrade the stub skill into a full orchestrator that validates prerequisites, delegates to `planning-agent`, and confirms output
- Add `.claude/skills/ps-plan/templates/project-plan-template.md` — minimal template defining the structure of `project-plan.md` (objective, feature backlog, release proposal, summary)

## Capabilities

### New Capabilities

- `planning-agent`: Specialized agent that transforms specification documents into a prioritized feature backlog and release proposal, outputting `$SPECS_BASE/specs/projects/project-plan.md`
- `ps-planning-skill`: Orchestrator skill for the Planning phase — validates `clarifications.md` exists, delegates to `planning-agent`, confirms output
- `project-plan-template`: Minimal Markdown template defining the output structure for `project-plan.md`

### Modified Capabilities

- `ps-plan-skill`: The existing stub at `.claude/skills/ps-plan/SKILL.md` will be replaced with the full orchestrator (same file path, new content)

## Impact

- Completes the pipeline: Funnel → Draft → Discovery → SPECIFY → Approval → **Planning** → Finished
- No external dependencies — pure Markdown files
- Input: `$SPECS_BASE/specs/projects/clarifications.md` (and all prior phase docs)
- Output: `$SPECS_BASE/specs/projects/project-plan.md`
- Non-goals: No Jira/Linear integration, no task-level breakdown (only feature-level), no effort estimates in story points
