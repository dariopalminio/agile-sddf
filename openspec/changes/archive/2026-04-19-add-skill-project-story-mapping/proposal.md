## Why

The SDDF framework needs a structured skill for conducting User Story Mapping sessions at the project level, integrated with the existing project pipeline (project-pm, project-architect agents). The current `user-story-mapping` skill in `.agents/skills/` lacks integration with the project agents and pipeline, making it hard to use within the SDDF workflow.

## What Changes

- Add new skill `.claude/skills/project-story-mapping/` with a `SKILL.md` that orchestrates the story mapping process
- Add new agent `.claude/agents/project-story-mapper.agent.md` specialized in Jeff Patton's User Story Mapping technique, integrated with SDDF project context
- The skill delegates to the `project-story-mapper` agent to conduct the mapping session interactively and produce a story map document

## Capabilities

### New Capabilities

- `project-story-mapping`: A skill that uses `project-story-mapper.agent.md` to produce a User Story Map document (`docs/specs/project/story-map.md`) from the project context, following Jeff Patton's technique — identifying backbone activities, walking skeleton, and release slices.

### Modified Capabilities

## Impact

- New files: `.claude/skills/project-story-mapping/SKILL.md`, `.claude/agents/project-story-mapper.agent.md`
- Output document: `docs/specs/project/story-map.md`
- Integrates with existing project documents: `project-intent.md`, `requirement-spec.md` (reads them as context when available)
- No breaking changes to existing skills or agents
