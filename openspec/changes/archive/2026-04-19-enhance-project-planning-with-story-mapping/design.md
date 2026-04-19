## Context

The `project-planning` skill (`SKILL.md`) currently follows a 5-step flow:
1. Verify `requirement-spec.md` exists and is `Ready`
2. Check output state of `project-plan.md`
3. Verify template exists
4. Delegate to `project-architect` (reads `project-intent.md` + `requirement-spec.md`)
5. Confirm output

The `project-story-mapping` skill and `project-story-mapper` agent were added in the previous change. They produce `docs/specs/project/story-map.md` with backbone, walking skeleton, and release slices — exactly the structure a planner needs to organize features into releases.

## Goals / Non-Goals

**Goals:**
- Insert a Story Mapping gate (Phase 0) into `project-planning/SKILL.md` before the architect delegation
- If `story-map.md` doesn't exist: offer to run story mapping now (invoke `project-story-mapping` skill) or skip
- If `story-map.md` exists: read it and pass it as additional context to `project-architect`
- Update the architect delegation prompt to use the story map's backbone and release slices as structural input for feature grouping and release planning

**Non-Goals:**
- Changing the `project-story-mapping` skill or `project-story-mapper` agent
- Making story mapping mandatory (it remains opt-in)
- Modifying the `project-plan-template.md`
- Changing the architect's output format

## Decisions

### Decision 1: Story mapping as opt-in gate, not mandatory prerequisite

The skill checks for `story-map.md` and offers to run it, but does not block if the user declines.

**Rationale:** The existing planning flow is valid without a story map. Forcing it would break teams already using `project-planning` without story mapping. An opt-in gate adds value without removing existing paths.

**Alternatives considered:** Making `story-map.md` a hard prerequisite (like `requirement-spec.md`) — rejected because it's a new dependency that would break existing workflows.

### Decision 2: Invoke `project-story-mapping` skill (not agent directly)

When story mapping is needed, the skill invokes the `project-story-mapping` skill rather than calling the `project-story-mapper` agent directly.

**Rationale:** `project-story-mapping` is the established entry point for this capability; it handles context loading, preconditions, and agent delegation. Calling the agent directly would bypass that coordination logic and violate the single-level delegation pattern.

### Decision 3: Pass story map as enriched context, not as a template constraint

The architect delegation prompt is updated to read `story-map.md` and use its backbone as _suggested_ structure for feature grouping — not as a rigid template.

**Rationale:** The architect may need to deviate from the story map structure (e.g., cross-cutting features, technical dependencies). Treating the story map as a suggestion keeps the architect's judgment intact while improving alignment with the user journey.

## Risks / Trade-offs

- [Risk] User declines story mapping but later wants the plan to reflect the user journey → Mitigation: They can re-run `/project-planning` after running `/project-story-mapping` separately; the skill will pick up `story-map.md` on the second run.
- [Risk] Skill invocation of `project-story-mapping` mid-flow creates a long session → Mitigation: The story mapping phase is clearly announced; user can choose to skip it and run separately.
- [Trade-off] Adding a new interactive phase makes the skill longer → Acceptable: planning is already an interactive session; adding one more step is proportionate.
