## RENAMED Requirements

### Requirement: Skill invocation command
FROM: `/requirement-from-code`
TO: `/reverse-engineering`

The skill SHALL be invocable via the command `/reverse-engineering` (with optional flags `--focus <path>`, `--update`, `--verbose`).

#### Scenario: User invokes renamed skill
- **WHEN** the user runs `/reverse-engineering`
- **THEN** the system SHALL execute the reverse engineering workflow (phases 0–3 as defined in SKILL.md)

#### Scenario: User invokes old command
- **WHEN** the user runs `/requirement-from-code`
- **THEN** the system SHALL NOT find the skill (no alias provided)
