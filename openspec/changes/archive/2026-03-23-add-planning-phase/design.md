## Context

The Planning phase is the 6th step in the pipeline (Funnel → Draft → Discovery → SPECIFY → Approval → **Planning** → Finished). It is the final generative step before the project is archived.

Currently `.claude/skills/ps-plan/SKILL.md` exists as a stub with no agent and no template. The pipeline cannot complete without a proper Planning implementation.

All prior phases follow the same pattern: an orchestrator skill validates prerequisites, delegates to a specialized agent, and confirms output. The agent reads a template at runtime and writes the output document. This change adopts the same pattern.

## Goals / Non-Goals

**Goals:**
- Add `planning-agent.md` that extracts atomic features from all prior documents, prioritizes them, groups them into releases, and writes `project-plan.md`
- Replace the stub `ps-plan/SKILL.md` with a full orchestrator skill
- Add `project-plan-template.md` defining the minimal output structure
- Output path: `$SPECS_BASE/specs/projects/project-plan.md`

**Non-Goals:**
- No task-level breakdown (features only, not subtasks)
- No effort estimates in story points or hours
- No Jira/Linear/GitHub Issues integration
- No backlog.md as a separate file (single unified `project-plan.md`)
- No interactive interview (unlike Approval phase — Planning is analytical, not interview-driven)

## Decisions

### 1. Single output file (`project-plan.md`) instead of two (`plan.md` + `backlog.md`)

The stub skill mentioned two files. A single `project-plan.md` is simpler, sufficient for PM use, and consistent with the minimal philosophy.

**Alternatives considered:** Two files (plan.md for phases, backlog.md for stories) — rejected as over-engineering for the target audience (PM Engineer using local Markdown files).

### 2. Feature-level granularity (FEAT-XXX), not task or epic level

Features are units of user/business value. They are coarser than developer tasks and finer than epics. This matches the PM audience and the Planning phase purpose.

**Alternatives considered:** User stories (Como/Quiero/Para) — rejected because the approval-agent already clarifies requirements; Planning should produce a prioritized backlog ready for sprint planning, not re-specify behavior.

### 3. No interactive interview in planning-agent

The Approval phase already resolves ambiguities. The planning-agent operates analytically: read all documents, reason, produce output. The agent may ask one clarifying question if a critical ambiguity remains, but the workflow is not interview-driven.

**Alternatives considered:** Full interview loop like approval-agent — rejected because Planning already has `clarifications.md` as resolved input.

### 4. Template read at runtime (same pattern as other agents)

The planning-agent reads `.claude/skills/ps-plan/templates/project-plan-template.md` at runtime to derive output structure. This makes the template the single source of truth for format, and changes to the template automatically affect future runs.

### 5. Estado field lifecycle

- `project-plan.md` is written with `**substatus**: IN‑PROGRESS`
- The agent does not self-promote to `DONE` — the user reviews and updates
- This matches the human-in-the-loop principle of the pipeline

## Risks / Trade-offs

- **Feature atomicity**: The agent may produce features that are too coarse (epic-level) or too fine (task-level). Mitigation: the template and agent instructions explicitly define "feature = unit of user/business value, testable independently."
- **Feature count**: For large projects, the backlog may be long. Mitigation: agent caps MVP at ~5 features and total releases at 3 unless the project clearly warrants more.
- **Idempotence**: Re-running `/ps-plan` overwrites `project-plan.md`. Mitigation: consistent with all other phases — re-execution overwrites, which is the expected behavior.
