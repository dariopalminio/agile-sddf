## Context

The SDDF framework uses a single-level delegation pattern: skills act as entry points/coordinators that invoke specialized agents. The existing `user-story-mapping` skill lives in `.agents/skills/` and is not integrated with the SDDF project pipeline (project-pm, project-architect). The new `project-story-mapping` skill follows the established `.claude/skills/` convention and delegates to a dedicated `project-story-mapper` agent.

Existing project documents (`project-intent.md`, `requirement-spec.md`) provide input context when available.

## Goals / Non-Goals

**Goals:**
- Create a skill `project-story-mapping` following SDDF conventions (SKILL.md in `.claude/skills/project-story-mapping/`)
- Create a `project-story-mapper.agent.md` in `.claude/agents/` that applies Jeff Patton's User Story Mapping technique
- The skill reads available project documents as context and delegates the full mapping session to the agent
- Output: `docs/specs/project/story-map.md` with backbone, walking skeleton, release slices, and ASCII/Mermaid diagram

**Non-Goals:**
- Replacing or modifying the existing `user-story-mapping` skill in `.agents/skills/`
- Automating the entire mapping without human interaction (the agent is interactive)
- Integrating with external tools or visualizers

## Decisions

### Decision 1: Single agent delegation (not inline logic in SKILL.md)

The skill delegates entirely to `project-story-mapper.agent.md` rather than embedding mapping logic in SKILL.md.

**Rationale:** Follows SDDF's established pattern (skill = coordinator, agent = specialist). Keeps SKILL.md minimal and lets the agent maintain full mapping context across a multi-turn session.

**Alternatives considered:** Embedding all logic in SKILL.md — rejected because it violates the single-level delegation pattern and makes the skill harder to maintain.

### Decision 2: Read project context documents if they exist

The agent is instructed to read `docs/specs/project/project-intent.md` and `docs/specs/project/requirement-spec.md` at session start if they exist, to ground the story map in the project's actual requirements.

**Rationale:** Avoids asking the user to repeat context already captured in prior pipeline stages.

### Decision 3: Output format — Markdown with ASCII map + structured sections

The story map document uses a combination of ASCII table map and structured Markdown sections (backbone, walking skeleton, release table).

**Rationale:** Mermaid diagrams can be hard to read for large maps; ASCII is universally readable in any Markdown renderer. Structured sections allow downstream tools to parse releases and stories.

## Risks / Trade-offs

- [Risk] Agent may produce inconsistent maps if project documents are absent → Mitigation: Agent asks the user for project context via interactive questions before proceeding.
- [Risk] Story map document becomes stale as requirements evolve → Mitigation: Skill can be re-run; output is overwritten with a new map.
- [Trade-off] ASCII map is less visually rich than a Mermaid diagram → Agent can optionally append a Mermaid diagram section if the user requests it.
