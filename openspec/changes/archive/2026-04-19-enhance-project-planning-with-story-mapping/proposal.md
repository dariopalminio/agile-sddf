## Why

The `project-planning` skill currently jumps from `requirement-spec.md` directly to feature extraction and release planning, skipping a user journey visualization step. Adding a story mapping phase before planning grounds the release plan in the actual user flow, producing a more coherent and user-centric `project-plan.md`.

## What Changes

- Add a **new phase 0** to `.claude/skills/project-planning/SKILL.md`: before delegating to `project-architect`, check if `docs/specs/project/story-map.md` exists; if not, invoke the `project-story-mapping` skill (which delegates to `project-story-mapper` agent) to generate it interactively.
- Update the **delegation instruction to `project-architect`** (step 4) to also read `docs/specs/project/story-map.md` when it exists, using the backbone activities and release slices as structure for the plan's feature grouping and release definition.
- The story mapping phase is **optional but recommended**: if `story-map.md` already exists, skip the mapping session and use it directly.

## Capabilities

### New Capabilities

*(none — no new standalone capability)*

### Modified Capabilities

- `project-planning-skill`: The `project-planning` skill gains a pre-planning story mapping phase and enriches the architect delegation prompt to consume `story-map.md`.

## Impact

- Modified file: `.claude/skills/project-planning/SKILL.md`
- New input document consumed: `docs/specs/project/story-map.md` (produced by `project-story-mapping` skill)
- No breaking changes: if story mapping is skipped or `story-map.md` is absent, the skill falls back to current behavior
- Depends on: `project-story-mapping` skill and `project-story-mapper` agent (already implemented)
