# readme-builder Specification

## Purpose
TBD - created by archiving change readme-builder-skill. Update Purpose after archive.
## Requirements
### Requirement: Generate README from formal spec artifacts
The skill SHALL generate a README.md in the project root when at least one of the following artifacts exists: `$SPECS_BASE/specs/projects/project-intent.md`, `$SPECS_BASE/specs/projects/project.md`, or `$SPECS_BASE/specs/projects/project-plan.md`. Content for each README section SHALL be derived from the available artifacts using the readme-template.md as the structural source-of-truth.

#### Scenario: All three spec artifacts present
- **WHEN** the user invokes the `readme-builder` skill and all three spec artifacts exist
- **THEN** the skill reads all three artifacts and uses their combined content to populate the README sections

#### Scenario: Only one spec artifact present
- **WHEN** the user invokes the `readme-builder` skill and only one spec artifact exists
- **THEN** the skill uses the available artifact to populate all README sections it can, leaving minimal stubs for sections without coverage

### Requirement: Runtime template extraction
The skill SHALL read `.claude/skills/readme-builder/templates/readme-template.md` at invocation time. It SHALL extract each `##` and `###` header as a target section name, and the `<!-- -->` comment immediately following each header as the content generation prompt for that section. The skill SHALL never hardcode section names or structure.

#### Scenario: Template has a new section added by the user
- **WHEN** the template gains a new `##` section with a `<!-- -->` comment
- **THEN** the skill generates content for that section on the next invocation without any code change

#### Scenario: Template has no comment for a section
- **WHEN** a template section has no `<!-- -->` comment
- **THEN** the skill generates best-effort content for that section based on its header name and available artifacts

### Requirement: Write guard for existing README
The skill SHALL detect whether a `README.md` already exists in the project root before writing. If one exists, the skill SHALL NOT overwrite it without explicit user confirmation. The skill SHALL offer the user three options: overwrite the existing README, save the new content as `README-new.md`, or cancel the operation.

#### Scenario: README.md already exists — user chooses overwrite
- **WHEN** README.md exists and the user selects "overwrite"
- **THEN** the skill replaces the existing README.md with the generated content

#### Scenario: README.md already exists — user chooses save as new file
- **WHEN** README.md exists and the user selects "save as README-new.md"
- **THEN** the skill writes the generated content to README-new.md without touching README.md

#### Scenario: README.md already exists — user cancels
- **WHEN** README.md exists and the user selects "cancel"
- **THEN** the skill exits without writing any file

### Requirement: Fallback to LLM-context files
When no formal spec artifacts are found, the skill SHALL search for LLM-context files: `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`. If any of these files exist, the skill SHALL use their content to generate the README.

#### Scenario: No spec artifacts but CLAUDE.md exists
- **WHEN** no formal spec artifacts are found AND `CLAUDE.md` exists
- **THEN** the skill uses CLAUDE.md content to generate the README without error

### Requirement: Reverse-engineering fallback
When neither formal spec artifacts nor LLM-context files are found, the skill SHALL perform reverse-engineering of the project to extract information for README generation. Reverse-engineering SHALL focus on entry points (package.json, main/index files, top-level directories, README fragments in subdirectories) rather than full traversal.

#### Scenario: No artifacts of any kind — reverse-engineering succeeds
- **WHEN** no spec artifacts or LLM-context files are found AND the project contains recognizable code
- **THEN** the skill generates a README.md using information inferred from the code structure

#### Scenario: Absolutely no information available
- **WHEN** no spec artifacts, no LLM-context files, and no recognizable project structure are found
- **THEN** the skill displays the message "No se encontraron artefactos de especificación para generar el README" and suggests running `/project-discovery` first

### Requirement: Template is read-only source-of-truth
The skill SHALL never modify the template file at `.claude/skills/readme-builder/templates/readme-template.md` during execution. All write operations SHALL target `README.md` (or `README-new.md`) in the project root.

#### Scenario: Skill invocation with existing template
- **WHEN** the skill runs
- **THEN** the template file remains byte-for-byte identical after execution

### Requirement: Output written to project root
The skill SHALL always write the generated README to the project root directory. The output path SHALL be `README.md` (default) or `README-new.md` (when user selects the alternative option), never any subdirectory or the template path.

#### Scenario: Successful generation writes to project root
- **WHEN** the skill generates a README successfully
- **THEN** the file appears at `<project-root>/README.md`

### Requirement: inspiración para estructura del skill
Para planificar e idear el skill puedes inspirarte en los siguientes skills: `/readme-creator` (https://skills.sh/mblode/agent-skills/readme-creator), `readme-blueprint-generator` (https://skills.sh/github/awesome-copilot/readme-blueprint-generator).

### Requirement: Asistente para la creación del skill y mejores prácticas
Puedes apoyarte en el skill creator (`skill-master`), .claude\skills\skill-master,  para planificar y crear el skill, siguiendo las mejores prácticas.

