## Why

The repository already implements the core workflow for creating, splitting, and evaluating user stories through skills in `.claude/skills/`. This baseline captures the current implemented behavior in OpenSpec so documentation and future changes start from an accurate state.

## What Changes

- Document the implemented MVP workflow from input need to evaluation outcome.
- Capture actual input/output behavior of story creation, story splitting, and FINVEST evaluation.
- Align decision vocabulary to what is currently implemented in evaluator outputs.
- Record the existing core skills under `.claude/skills/` as the baseline capability.

## Capabilities

### New Capabilities
- `story-workflow-mvp`: Current implemented behavior for creating, splitting, and evaluating user stories using canonical templates and deterministic decision criteria.

### Modified Capabilities
- None.

## Impact

- Affected areas: OpenSpec change artifacts and documentation alignment with already-implemented skill behavior.
- Existing implemented skills: `.claude/skills/finvest-evaluation/`, `.claude/skills/story-creation/`, and `.claude/skills/story-split/`.
- Baseline source files: skill instructions/templates under `.claude/skills/`, plus related project docs in `README.md` and `CLAUDE.md`.
