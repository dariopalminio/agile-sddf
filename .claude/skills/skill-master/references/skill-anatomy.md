# Skill Anatomy, Progressive Disclosure & Multi-Client Design

## Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic/repetitive tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons, fonts), document templates for document structures with placeholders to complete
```

## Progressive Disclosure

Skills use a three-level loading system:
1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - In context whenever skill triggers (<500 lines ideal)
3. **Bundled resources** - As needed (unlimited, scripts can execute without loading)

These word counts are approximate and you can feel free to go longer if needed.

**Key patterns:**
- Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of hierarchy along with clear pointers about where the model using the skill should go next to follow up.
- Reference files clearly from SKILL.md with guidance on when to read them
- For large reference files (>300 lines), include a table of contents

**Domain organization**: When a skill supports multiple domains/frameworks, organize by variant:
```
cloud-deploy/
├── SKILL.md (workflow + selection)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```
Claude reads only the relevant reference file.

## Templates & Multi-Client Design

If your skill uses templates (document structures the model fills in at runtime), apply these rules to ensure the skill works across all runtimes — Claude Code, GitHub Copilot, OpenCode, Google Gemini, Atlassian Rovo — without modifying SKILL.md:

**Templates are a source of truth**: The skill MUST always dynamically complete the template structure used at runtime, inferring the information, to ensure flexibility in the face of future changes in the template structure.

**Templates are read-only runtime contracts.** A template defines structure (sections, order, prompts via `<!-- -->` comments). The skill reads it at runtime and derives behavior from it — never hardcode section names in the skill body. If the template changes, the skill changes automatically.

**Always use relative paths.** Reference templates as `assets/<file-template>.md` — a path relative to the skill's own directory. Never use absolute paths or client-specific paths like `my-skill/assets/`. Absolute paths break portability the moment the skill is installed in a different location.

**Standard fallback chain.** The runtime may install the skill in different directories depending on the client. When the primary relative path fails, resolve in this order:

1. `assets/<template>.md` — relative to the active skill directory (primary)
2. Search for the template filename inside an `assets/` folder using runtime context (e.g., sibling directories, known skill roots)
3. Generate a minimal valid structure from the prose instructions in SKILL.md

Use this exact chain in every skill that reads a template — it's the established project pattern. **The skill-master itself applies this chain** when reading `assets/skill-template.md` to author new SKILL.md files (see "Write the SKILL.md" section above).

**Multi-client principle.** A skill is multi-client when it works identically in any AI runtime without modifying its SKILL.md. Achieving this requires: (1) relative template paths + fallback chain, (2) no hardcoded client-specific directories, (3) instructions that don't assume a specific tool or UI (e.g., don't assume `AskUserQuestion` is always available — the runtime may not support it).

When building a new skill, ask: *"Would this skill work if copied unchanged into a GitHub Copilot instructions file?"* If the answer is no, find the path or assumption that breaks it and fix it.

## Principle of Lack of Surprise

This goes without saying, but skills must not contain malware, exploit code, or any content that could compromise system security. A skill's contents should not surprise the user in their intent if described. Don't go along with requests to create misleading skills or skills designed to facilitate unauthorized access, data exfiltration, or other malicious activities. Things like a "roleplay as an XYZ" are OK though.
