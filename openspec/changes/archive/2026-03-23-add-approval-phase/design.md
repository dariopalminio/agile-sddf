## Context

The ProjectSpecFactory pipeline has a placeholder `ps-approve` skill with no agent, no template, and no implementation. The Approval phase sits between SPECIFY and Planning and is responsible for surfacing ambiguities, contradictions, and open questions across all prior documents before committing to planning. Without it, the pipeline moves from specification to planning without structured validation.

Existing reference implementations to follow: `ps-SPECIFY` (skill + SPECIFY-agent + template), `ps-discovery` (skill + discovery-agent + template).

## Goals / Non-Goals

**Goals:**
- Create `clarifications-template.md` at `.claude/skills/ps-approval/templates/` following the same co-location pattern as other skills
- Create `approval-agent.md` that performs multi-lens (PM, Architect, UX) analysis and interviews the user to produce `$SPECS_BASE/specs/projects/clarifications.md`
- Create `ps-approval` skill that validates `requirement-spec.md` state, delegates to `approval-agent`, and confirms output
- The agent reads all 4 prior documents (`initial-prompt.md`, `project-intent.md`, `discovery.md`, `requirement-spec.md`)
- Follow the existing pattern: skill orchestrates, agent interviews, template drives structure

**Non-Goals:**
- Modifying or replacing other pipeline phases
- Automatically resolving ambiguities (the agent asks, the human answers)
- Integration with external tools (Jira, Linear, Slack)
- Removing the legacy `ps-approve` stub (left as-is to avoid breaking references)

## Decisions

### Decision 1: Multi-lens analysis pattern
**Choice**: The `approval-agent` analyzes documents from three separate perspectives (PM, Architect, UX) before formulating questions.
**Why**: A single-perspective review misses category-specific issues. PM catches scope/business gaps; Architect catches technical/feasibility gaps; UX catches usability/user-journey gaps. Three lenses produce more actionable clarifications than one.
**Alternative considered**: Single-pass linear review — rejected because it produces fewer, less categorized findings.

### Decision 2: Template-driven questions (same as SPECIFY-agent)
**Choice**: The `approval-agent` derives its section structure from `##` headers and `<!-- -->` comments in `clarifications-template.md` at runtime, not from hardcoded logic.
**Why**: Consistent with the established pattern in `SPECIFY-agent` and `discovery-agent`. If the template changes, agent behavior adapts automatically without code changes.
**Alternative considered**: Hardcoded sections in the agent — rejected because it violates the idempotence/extensibility principles.

### Decision 3: Skill named `ps-approval` (not modifying `ps-approve`)
**Choice**: Create a new `.claude/skills/ps-approval/SKILL.md` rather than overwriting `ps-approve`.
**Why**: The existing `ps-approve` stub may be referenced by the CLAUDE.md command list. Creating `ps-approval` as the canonical implementation leaves the legacy stub intact and avoids breaking references. Both can coexist; `ps-approve` can be updated separately to forward to `ps-approval`.
**Alternative considered**: Replace `ps-approve` in-place — rejected to avoid unintended side effects.

### Decision 4: State validation mirrors SPECIFY-agent pattern
**Choice**: The skill reads `requirement-spec.md` and checks `substatus`; if `IN‑PROGRESS`, asks the user to confirm before proceeding.
**Why**: Consistent with how `ps-SPECIFY` validates `discovery.md` state. The pattern is already proven in the pipeline.

## Risks / Trade-offs

- **Risk**: Three-lens analysis may generate too many questions → **Mitigation**: Agent groups by theme and limits to max 3-4 questions per round; prioritizes by impact/risk.
- **Risk**: `approval-agent` may ask redundant questions already answered in prior docs → **Mitigation**: Agent reads all 4 input documents and pre-fills answers where already covered; only asks for genuinely missing/ambiguous information.
- **Risk**: `clarifications.md` may become very long → **Mitigation**: Template includes a "Resueltas" vs "Pendientes" classification; agent marks resolved questions so Planning can focus on what remains open.
