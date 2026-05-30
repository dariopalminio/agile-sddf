## Context

SDDF already produces structured Markdown artifacts at known paths (docs/specs/projects/, docs/specs/releases/, docs/specs/stories/). Users reach the end of a spec cycle with a well-documented project but no README.md. Writing one manually is repetitive and prone to drifting from the specs. A `readme-builder` skill fits naturally into the existing skill-as-orchestrator pattern: one SKILL.md entry point, no external dependencies, pure Markdown I/O.

Existing inspiration: `readme-creator` (skills.sh) and `readme-blueprint-generator` (awesome-copilot). Both confirm a template-driven approach outperforms ad-hoc generation.

## Goals / Non-Goals

**Goals:**
- Generate a complete README.md from available SDDF artifacts or project code (fallback).
- Use a Markdown template as the single structural source-of-truth; the generated output mirrors the template's sections exactly.
- Protect existing README.md: never overwrite without explicit user confirmation.
- Work in all three discovery modes: formal artifacts present, only LLM-context files present, neither (reverse-engineering fallback).

**Non-Goals:**
- Updating README.md incrementally / patching individual sections.
- Generating README for sub-packages or monorepo workspaces.
- Hosting, publishing, or committing the generated file.

## Decisions

### Decision 1: Template as runtime source-of-truth (not hardcoded sections)

The skill reads `.claude/skills/readme-builder/templates/readme-template.md` at invocation time. It extracts `##` / `###` headers and the `<!-- -->` comment immediately following each header to derive both the section name and the generation prompt for that section.

**Why over hardcoding sections:** The story requirement states "if the template changes, the README changes automatically." Hardcoding sections breaks this guarantee the moment someone adds a new section to the template. Dynamic extraction respects the template-as-truth contract at zero implementation cost.

**Alternatives considered:**
- Hardcode section list in SKILL.md → rejected: couples skill logic to template structure.
- Use a YAML config instead of comment-hints → rejected: adds a second source-of-truth.

### Decision 2: Three-tier artifact discovery

Discovery order (stop at first tier that yields content):
1. **Formal spec artifacts**: `$SPECS_BASE/specs/projects/project-intent.md`, `requirement-spec.md`, `project-plan.md`.
2. **LLM-context files**: `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`.
3. **Reverse-engineering fallback**: scan source tree, read key files, extract information.

**Why:** The story explicitly requires this degradation sequence. Attempting reverse engineering only when no other context exists avoids expensive full-repo reads on well-documented projects.

### Decision 3: Write guard with three explicit options

When `README.md` already exists, the skill:
1. Informs the user a README exists.
2. Shows a preview of the current content (first 10 lines).
3. Offers three choices via AskUserQuestion: **overwrite**, **save as README-new.md**, **cancel**.

**Why:** The story requires "no overwrite without explicit confirmation." A silent flag or prompt-less overwrite violates this. The AskUserQuestion tool matches the existing skill UX pattern in SDDF.

### Decision 4: Skill-only architecture (no subagents)

The skill orchestrates all steps inline without spawning subagents. Content generation, template reading, artifact discovery, and file writing all happen within the single skill invocation.

**Why:** The task has no parallelism opportunity (steps are sequential) and the output is a single file. Adding subagents would introduce coordination overhead without benefit. The skill-master guide confirms subagents are optional and should be omitted when sequential work suffices.

## Risks / Trade-offs

- **[Risk] Template drift** — If the readme-template.md is heavily modified, the skill may generate content that doesn't map well to new sections. → Mitigation: Template comments serve as prompts; the skill generates "best effort" content for any section, even unfamiliar ones.
- **[Risk] Reverse-engineering quality** — When no artifacts exist, the README depends on the LLM's ability to infer project purpose from code. Quality varies. → Mitigation: The story accepts this ("generates README.md with the extracted information even if formal artifacts are not found") and the skill communicates uncertainty to the user.
- **[Risk] Large repos in fallback mode** — Scanning the entire repo may be slow or hit context limits. → Mitigation: Limit reverse-engineering to key entry points (package.json, main/index files, top-level directories) rather than full traversal.
