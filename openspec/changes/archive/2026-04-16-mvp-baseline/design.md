## Context

The project has the three core skills created under `.claude/skills/` (`story-creation`, `story-split`, `finvest-evaluation`) and an implemented flow across them. This design captures that existing behavior as a baseline contract in OpenSpec.

## Goals / Non-Goals

**Goals:**
- Define a single baseline capability for the implemented end-to-end story workflow.
- Ensure each stage has explicit input and output expectations as currently implemented.
- Represent deterministic evaluation outcomes using implemented terminology (APROBADA, REFINAR, RECHAZAR).
- Produce requirements directly traceable to existing skill behavior.

**Non-Goals:**
- Introduce new scoring models beyond current FINVEST dimensions.
- Redesign agent orchestration architecture.
- Add persistence, telemetry, or external service integrations.
- Specify UI-level interactions.

## Decisions

1. Capability-first specification
- Decision: Model MVP as one capability (`story-workflow-mvp`) rather than multiple micro-capabilities.
- Rationale: Keeps initial implementation cohesive and reduces coordination overhead.
- Alternative considered: Separate capabilities per skill (`story-creation`, `story-split`, `finvest-evaluation`); rejected for MVP because it increases artifact and dependency complexity before baseline behavior is stable.

2. Canonical template as normative contract
- Decision: Treat the story-gherkin structure (Como/Quiero/Para + acceptance scenarios) as required output for story generation and split outputs.
- Rationale: Existing repository materials already align to this format; using it as the baseline avoids format drift.
- Alternative considered: Allow multiple output formats; rejected for MVP to preserve evaluability and consistency.

3. Deterministic evaluation decision thresholds
- Decision: Require explicit mapping from dimension/global scores to one of three outcomes: Ready, Refinar, Rechazar.
- Rationale: Predictable outcomes are necessary to automate workflow transitions.
- Alternative considered: Free-text recommendation only; rejected because it is harder to test and automate.

4. Explicit rework loop on non-ready outcomes
- Decision: Define mandatory next actions for Refinar and Rechazar outcomes.
- Rationale: Ensures the workflow remains actionable, not only diagnostic.
- Alternative considered: Leave next steps optional; rejected due to ambiguity and inconsistent usage.

## Risks / Trade-offs

- [Risk] Single MVP capability may hide sub-domain complexity. -> Mitigation: Keep requirements modular and split into multiple capabilities in follow-up changes if needed.
- [Risk] Threshold definitions may be interpreted differently across skills. -> Mitigation: Require explicit threshold rules in implementation and acceptance tests.
- [Risk] Existing examples may not fully satisfy new strict requirements. -> Mitigation: Add migration tasks to reconcile templates/examples with MVP contract.
- [Trade-off] Strict canonical formatting limits flexibility. -> Mitigation: Document extension points as non-goals for this MVP.

## Migration Plan

- No migration required for baseline capture.
- Future changes should start from this baseline and be proposed as incremental OpenSpec changes.

## Open Questions

- None for baseline capture.
