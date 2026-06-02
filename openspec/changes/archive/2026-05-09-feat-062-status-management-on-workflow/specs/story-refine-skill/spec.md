<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: story-refine sets SPECIFY/IN‑PROGRESS at the start of refinement
The system SHALL update `status: SPECIFY` and `substatus: IN‑PROGRESS` in `story.md` frontmatter when `story-refine` (or `story-creation` as the entry point) begins processing a story.

#### Scenario: Status updated at refinement start
- **WHEN** `/story-refine` (or `/story-creation`) begins a new or existing story
- **THEN** `story.md` frontmatter MUST be updated to `status: SPECIFY` and `substatus: IN‑PROGRESS` before any sub-skill is invoked

### Requirement: story-refine sets READY-FOR-PLAN/DONE when FINVEST approves
The system SHALL update `status: READY-FOR-PLAN` and `substatus: DONE` in `story.md` frontmatter when `story-evaluation` returns `APROBADA`.

#### Scenario: Status updated on FINVEST approval
- **WHEN** `story-evaluation` returns decision `APROBADA` during the `story-refine` flow
- **THEN** `story.md` frontmatter MUST be updated to `status: READY-FOR-PLAN` and `substatus: DONE` before the skill terminates

#### Scenario: Status remains SPECIFY/IN‑PROGRESS on non-approved evaluation
- **WHEN** `story-evaluation` returns `REFINAR` or `RECHAZAR`
- **THEN** `story.md` frontmatter MUST remain at `status: SPECIFY` and `substatus: IN‑PROGRESS` to signal that refinement is still in progress

## MODIFIED Requirements

### Requirement: story files maintain explicit state transitions
Cada historia en refinamiento SHALL mantener los campos `status` y `substatus` en el frontmatter YAML de `story.md`, y el orquestador SHALL gestionar la transición según el resultado de `story-evaluation` y las decisiones del usuario.

Los valores válidos para el ciclo de refinement son:
- `status: SPECIFY` / `substatus: IN‑PROGRESS` — mientras el refinamiento está activo
- `status: READY-FOR-PLAN` / `substatus: DONE` — cuando `story-evaluation` retorna `APROBADA`

#### Scenario: Story remains SPECIFY/IN‑PROGRESS during active refinement
- **WHEN** una historia aún no cumple criterios de cierre (evaluación no aprobada)
- **THEN** su `story.md` MUST tener `status: SPECIFY` y `substatus: IN‑PROGRESS`

#### Scenario: Story becomes READY-FOR-PLAN/DONE when FINVEST is approved
- **WHEN** `story-evaluation` retorna decisión `APROBADA`
- **THEN** el orquestador MUST actualizar `story.md` a `status: READY-FOR-PLAN` y `substatus: DONE`

#### Scenario: User decides to pause refinement
- **WHEN** la decisión FINVEST es `REFINAR` o `RECHAZAR` y el usuario elige pausar
- **THEN** el orquestador MUST permitir finalizar la sesión dejando la historia en `status: SPECIFY` / `substatus: IN‑PROGRESS`
