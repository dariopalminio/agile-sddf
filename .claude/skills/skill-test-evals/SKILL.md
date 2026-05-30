---
name: skill-test-evals
description: >
  Generates evals/evals.json test cases for a skill from a description, spec file, or free text.
  Use when you need to create test cases for a skill, write evals before implementing a skill (TDD RED phase),
  generate evals.json from a story.md or testcases.md, or produce the RED phase input for skill-master build.
  Also use to generate evals for an existing skill that has no evals yet: pass the skill directory with
  --from-skill and it will read SKILL.md, interpret the skill, and generate evals.json automatically.
  Invoke when users say "crear pruebas de...", "write evals for...", "escribe los casos de prueba para...",
  "genera evals para un skill que...", "create tests for a skill that...", "quiero los evals de...",
  "genera evals para este skill", "add tests to this existing skill", "este skill no tiene pruebas, créalas",
  or "reverse-engineer evals from SKILL.md".
triggers:
  - "crear pruebas de"
  - "escribe los evals"
  - "genera los casos de prueba"
  - "write evals for"
  - "create tests for a skill"
  - "evals.json"
  - "quiero los evals de"
  - "genera evals para este skill"
  - "add tests to this skill"
  - "este skill no tiene pruebas"
---

# skill-test-evals

Generates `evals/evals.json` for a skill from any input source. This is the RED phase of TDD for skills — evals must exist before writing SKILL.md.

**What this skill does:**
- Reads an input source (spec file, free text, or interactive Q&A)
- Extracts skill intent, I/O contracts, and success criteria
- Generates 3–5 realistic test cases
- Writes `<skill-name>/evals/evals.json`

**What this skill does NOT do:**
- Write SKILL.md (use `skill-master build` for that)
- Run the evals (use `skill-master` for that)
- Grade outputs or generate benchmarks

---

## Parameters

- `--source <file|text>` — input file path (story.md, testcases.md, design.md) or inline description
- `--from-skill <path>` — reads an existing SKILL.md at `<path>`, interprets the skill, and generates evals in `<path>/evals/evals.json`; input and output both point to the same skill directory
- `--skill-name <name>` — target skill name in kebab-case; determines output path
- `--skill-dir <path>` — explicit output directory (overrides --skill-name path resolution)
- `--auto` — no checkpoints, write evals directly
- `--manual` (default) — pause for user confirmation before writing

---

## Step 1: Determine the input source

- If `--from-skill <path>`:
  - Verify `<path>/SKILL.md` exists. If not: stop — "No SKILL.md found at `<path>`. Provide a valid skill directory."
  - Check if `<path>/evals/evals.json` already exists:
    - If yes and `--auto`: overwrite silently
    - If yes and `--manual`: warn — "`evals/evals.json` already exists at `<path>`. Overwrite? (y/n)"
  - Set output path to `<path>/evals/evals.json`
  - Read `<path>/SKILL.md` → proceed to "Interpreting a SKILL.md source" in Step 3
- Auto-detect: if `--source` points to a file named `SKILL.md`, or to a directory that contains a `SKILL.md` file → treat as `--from-skill <that directory>`
- If `--source` is any other file path: read it (story.md, testcases.md, design.md, or any spec file)
- If `--source` is free text: use it directly
- If no `--source` and `--auto`: error — "skill-test-evals requires --source or --from-skill in auto mode."
- If no `--source` and `--manual` (default): ask one focused question:
  > "¿Qué debe hacer el skill? Describe su propósito, cuándo se activa y qué produce. (O pasa --from-skill <path> para leer un skill existente.)"
  Wait for the answer, then proceed.

---

## Step 2: Determine the output path

- If `--from-skill <path>`: output to `<path>/evals/evals.json` (co-located with the skill)
- If `--skill-dir`: output to `<skill-dir>/evals/evals.json`
- If `--skill-name`: output to `.claude/skills/<skill-name>/evals/evals.json`
- If none of the above: infer the skill name from the source description (e.g., "formatea commits de git" → `commit-formatter`). Confirm with user in `--manual` mode.

---

## Step 3: Extract intent from the source

From the input, identify:
- **Purpose**: what the skill enables Claude to do — one clear sentence
- **Triggers**: phrases/contexts that should invoke it (3–5 examples)
- **Input**: what files, text, or context the skill receives
- **Output**: what the skill produces (file, text, structured output)
- **Success criteria**: what "done" looks like — concrete, checkable

If the source is a `story.md`, extract from the acceptance criteria (Gherkin or plain).
If the source is free text, infer from the description.
If the source is a `SKILL.md`, use the sub-section below.

### Interpreting a SKILL.md source

When the source is a SKILL.md file, extract in this order:

1. **From frontmatter:**
   - `name:` → `skill_name` for evals.json
   - `description:` → primary source of purpose, trigger contexts, and what the skill produces
   - `triggers:` list → exact phrases users say to invoke the skill

2. **From body:**
   - "What this skill does" / "Objetivo" / overview paragraphs → purpose
   - "Parameters" / "Parámetros" section → what inputs the skill accepts (flags, files, text)
   - "Output" / "Salida" section → what the skill produces (file name, format, location)
   - "Flujo de ejecución" / flow steps → what steps run; which ones can fail → source for fail-fast and error-handling cases

3. **Generate prompts by inverting the triggers:**
   - For each trigger phrase, construct a realistic user prompt that would invoke the skill with enough context
   - Example: trigger `"crear pruebas de"` → prompt `"crea las pruebas de un skill que formatea commits de git en mi repo, el skill está en .claude/skills/commit-formatter"`
   - Add concrete details: file paths, domain context, realistic user scenario — not abstract requests

4. **Derive expectations from the output section:**
   - If the skill writes a specific file → `"The file <output-path> is created"`
   - If the skill produces structured output → `"The output contains the sections: X, Y, Z"`
   - If the skill has explicit error conditions or preconditions → derive fail-fast cases from them

---

## Step 4: Generate test cases

Create 3–5 cases covering:

| Required | Type | When to use |
|----------|------|-------------|
| ✅ min 1 | `happy-path` | Valid input → skill produces correct output |
| ✅ min 1 | `fail-fast` | Invalid/empty input → skill detects error and reports clearly |
| ✅ min 1 | `edge-case` | Unusual but valid input → skill handles correctly |
| optional | `error-handling` | Environmental failure (missing file, bad path) → graceful degradation |

**Quality rules for prompts:**
- Write prompts as a real user would say them — concrete, with context, not abstract
- Bad: `"Format this data"` / `"Create a skill for X"`
- Good: `"I have a story.md in docs/specs/stories/FEAT-042 and I want you to generate the evals for it"`
- Each prompt must be independently executable — no shared state between cases

**Quality rules for expectations:**
- Must be objectively verifiable without running the skill
- Ground them in the spec, not in implementation guesses
- Avoid generic expectations that any output would pass ("output is not empty")

---

## Step 5: Checkpoint

- If `--manual`: show the proposed cases to the user:
  > "Here are the N test cases I'll write to `evals/evals.json`. Do these cover the right scenarios?"
  Wait for confirmation. Accept additions or changes before writing.
- If `--auto`: proceed directly to writing.

---

## Step 6: Write evals/evals.json

Create the `evals/` directory if it doesn't exist. Write using this schema:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "Realistic user prompt — concrete, with context",
      "expected_output": "Description of what the skill should produce",
      "files": [],
      "expectations": [
        "The output contains X",
        "The output does not contain Y",
        "A file named Z is created"
      ]
    }
  ]
}
```

For skills with structured file outputs, also read `../skill-master/references/skill-evals-format.md` for the TC-NNN format with `contains`/`not_contains`/`threshold`. Use whichever format fits the skill's output type.

**Fallback schema** (if `../skill-master/references/schemas.md` is unavailable): use the schema above as-is — it is the canonical minimum.

---

## Step 7: Report

Tell the user:

```
✅ evals/evals.json written to <output-path>
   N cases: X happy-path, Y fail-fast, Z edge-case

Next step: run `/skill-master build` to implement the skill using these evals (TDD GREEN phase).
```

In `--auto` mode, print one line: `[skill-test-evals] <output-path>: N cases written.`

---

## Reference files

For extended guidance, read from skill-master if available:

| File | Content |
|------|---------|
| `../skill-master/references/skill-evals-format.md` | TC-NNN format with contains/not_contains/threshold |
| `../skill-master/references/schemas.md` | Full JSON schemas for evals, grading, benchmark |
| `../skill-master/references/tdd-workflow.md` | RED/GREEN/REFACTOR cycle rationale |
