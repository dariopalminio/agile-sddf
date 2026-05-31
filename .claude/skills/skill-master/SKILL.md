---
name: skill-master
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
---

# Skill Master

A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it
- Write a draft of the skill
- Create a few test prompts and run claude-with-access-to-the-skill on them
- Help the user evaluate the results both qualitatively and quantitatively
  - While the runs happen in the background, draft some quantitative evals if there aren't any (if there are some, you can either use as is or modify if you feel something needs to change about them). Then explain them to the user (or if they already existed, explain the ones that already exist)
  - Use the `eval-viewer/generate_review.py` script to show the user the results for them to look at, and also let them look at the quantitative metrics
- Rewrite the skill based on feedback from the user's evaluation of the results (and also if there are any glaring flaws that become apparent from the quantitative benchmarks)
- Repeat until you're satisfied
- Expand the test set and try again at larger scale

Your job when using this skill is to figure out where the user is in this process and then jump in and help them progress through these stages. So for instance, maybe they're like "I want to make a skill for X". You can help narrow down what they mean, write a draft, write the test cases, figure out how they want to evaluate, run all the prompts, and repeat.

On the other hand, maybe they already have a draft of the skill. In this case you can go straight to the eval/iterate part of the loop.

Of course, you should always be flexible and if the user is like "I don't need to run a bunch of evaluations, just vibe with me", you can do that instead.

Then after the skill is done (but again, the order is flexible), you can also run the skill description improver, which we have a whole separate script for, to optimize the triggering of the skill.

Cool? Cool.

---

## Intent detection (language-first)

Before applying any mode, analyze the user's natural language to determine intent.
This allows users to skip explicit flags and just say what they want.

| User says (examples) | Inferred mode | Action |
|----------------------|---------------|--------|
| "crear pruebas de...", "create tests for...", "escribe los evals para un skill que...", "genera los casos de prueba para...", "write evals for a skill that..." | **plan** | Generate `evals/evals.json` from the description |
| "create skill...", "construye un skill...", "implementa el skill...", "build the skill", "haz que pase las pruebas", "make it pass the tests" | **build** | Use existing `evals/evals.json` to produce `SKILL.md` via TDD |
| "mejora este skill", "optimiza la descripción", "ejecuta el benchmark", "run evals on..." | **improve** | Run evaluation/benchmark loop on existing skill |
| "ejecutar evals de...", "validar skill...", "verificar que el skill funciona", "correr los tests del skill", "comprobar el skill", "/skill-master evals" | **evals** | Delegate to `skill-test-evals` (evals mode) to execute TC-NNN cases |
| Ambiguous (e.g., just "skill-master" or "quiero un skill") | **full-flow** | Fall back to full interactive flow below |

**Mapping rule:**
- Intent = **plan** → act as `/skill-master plan --manual`
  - If the user provided a description in the same message: treat it as `--source "<description>"` and proceed directly (no Capture Intent questions)
  - If no description: ask one focused question — "¿Qué debe hacer el skill?" — then proceed with `plan`
- Intent = **build** → act as `/skill-master build --manual`
  - Verify `evals/evals.json` exists; if not, inform user and offer to run `plan` first
- Intent = **improve** → go directly to "Running and evaluating test cases" in Full Flow
- Intent = **evals** → act as `/skill-test-evals evals <skill-name>`; invoke `skill-test-evals` directly
- Add `--auto` behavior when the user's message includes phrases like "automáticamente", "sin pausas", "sin interacción", "just do it", "go ahead"

### Example

**User:** *"skill-master quiero crear un skill para redactar formatos de email, escribe los tests evals"*

**Agent** (detects plan intent, source = "redactar formatos de email"):
- Infers skill name: `email-formatter`
- Creates `skills/email-formatter/evals/`
- Generates `evals.json` with 3–5 cases (formatting, edge cases, error handling)
- Responds: ✅ "He generado los evals para `email-formatter` con N casos. Puedes ejecutar `/skill-master build` para implementar el skill con TDD."

---

## Modes of Operation

skill-master can be invoked in three ways:

**`/skill-master plan [--source <file|text>] [--auto]`**
Generates `evals/evals.json` from an input source (story.md, testcases.md, free text, or interactive questions). Does NOT write SKILL.md yet.
> **Language triggers:** "crear pruebas de...", "escribe los evals para un skill que...", "genera casos de prueba para...", "create tests for a skill that...", "write evals for..."

**`/skill-master build [--skill-dir <path>] [--auto]`**
Takes an existing `evals/evals.json` and produces SKILL.md via RED → GREEN → REFACTOR. Requires evals to exist first.
> **Language triggers:** "build skill", "implementa el skill", "haz que pase los tests", "construye el skill a partir de las pruebas", "create skill", "make it pass the evals"

**`/skill-master evals <skill-name>`**
Delegates to `skill-test-evals` (evals mode) — runs all TC-NNN cases in `evals/evals.json` and returns a pass/fail report.
> **Language triggers:** "ejecutar evals de...", "validar skill...", "comprobar que el skill funciona", "verificar skill", "correr los tests del skill"

**`/skill-master` (no flags — default)**
Full interactive flow. Detects where the user is and jumps in at the right stage.
> **Language triggers:** ambiguous or open-ended requests ("quiero un skill", "ayúdame con un skill", "skill-master")

**Interaction flags (apply to `plan` and `build`):**
- `--manual` (default): pauses at each checkpoint for user review and confirmation
- `--auto`: runs end-to-end without human interaction; proceeds when pass_rate ≥ 0.95

---

## Communicating with the user

The skill creator is liable to be used by people across a wide range of familiarity with coding jargon. If you haven't heard (and how could you, it's only very recently that it started), there's a trend now where the power of Claude is inspiring plumbers to open up their terminals, parents and grandparents to google "how to install npm". On the other hand, the bulk of users are probably fairly computer-literate.

So please pay attention to context cues to understand how to phrase your communication! In the default case, just to give you some idea:

- "evaluation" and "benchmark" are borderline, but OK
- for "JSON" and "assertion" you want to see serious cues from the user that they know what those things are before using them without explaining them

It's OK to briefly explain terms if you're in doubt, and feel free to clarify terms with a short definition if you're unsure if the user will get it.

---

## Mode: plan — Generate evals from inputs

This mode delegates to `skill-test-evals`. Invoke it directly for the full documented flow:

> `/skill-test-evals [--source <file|text>] [--skill-name <name>] [--auto]`

`skill-test-evals` handles: reading the source, extracting intent, generating cases, checkpoint, and writing `evals/evals.json`.

### Inline fallback (only if skill-test-evals is unavailable)

**Step 1:** Read `--source` (file or text). If none and `--auto`: error. If none and `--manual`: ask "¿Qué debe hacer el skill?".

**Step 2:** Extract purpose, triggers, I/O contracts, success criteria from the source.

**Step 3:** Generate 3–5 cases — at least 1 happy-path, 1 fail-fast, 1 edge-case. Prompts must be realistic, grounded in the spec.

**Step 4 (--manual):** Show proposed cases and wait for confirmation before writing.

**Step 5:** Write `evals/evals.json` using the schema in `references/schemas.md`. Save to the skill's target directory.

**Step 6:** Report path and case count. Suggest `/skill-master build` as next step.

---

## Mode: build — Build SKILL.md from evals via TDD

**Goal:** Produce a working SKILL.md by iterating RED → GREEN → REFACTOR against existing evals.

**Precondition:** `evals/evals.json` must exist. If it doesn't, stop and tell the user: "No evals found. Run `/skill-master plan` first to generate them."

### Setup

Define WORKSPACE once and reuse it for all paths:

```bash
WORKSPACE=".tmp/skills-workspace/<skill-name>-workspace"
```

If `--skill-dir` is provided, use it as the target for SKILL.md. Otherwise use the current skill directory.

### RED: Establish baseline

- If `--manual`: tell the user "Running baseline (without skill) to confirm evals fail before we write the skill."
- Spawn subagent runs for each eval WITHOUT the skill. Save to `$WORKSPACE/iteration-1/<eval-name>/without_skill/outputs/`.
- Expected result: most or all evals fail. If they already pass without a skill, warn the user — the evals may be too easy.

### GREEN: Write minimal SKILL.md

Before writing anything, read:
- `assets/skill-template.md` (fallback chain: if not found, search nearby `assets/` folders; if still missing, use minimum valid YAML + body)
- `references/skill-anatomy.md`
- `references/writing-guide.md`
- `references/tdd-workflow.md`

Write the minimum SKILL.md that should satisfy the evals. Don't add polish yet — just make it pass.

Then spawn runs WITH the skill. Save to `$WORKSPACE/iteration-1/<eval-name>/with_skill/outputs/`.

Grade outputs using `agents/grader.md`. Aggregate:

```bash
python -m scripts.aggregate_benchmark $WORKSPACE/iteration-1 --skill-name <name>
```

- If `--manual`: show results to user (launch viewer if available, print summary if not). Ask for feedback before proceeding.
- If `--auto`: check pass_rate. If ≥ 0.95, move to REFACTOR. If < 0.95, iterate (up to 3 iterations).

### REFACTOR: Improve until stable

Apply improvements from feedback (manual) or from benchmark analysis (auto):

1. Edit SKILL.md
2. Rerun evals into `$WORKSPACE/iteration-<N+1>/`
3. Launch viewer with `--previous-workspace $WORKSPACE/iteration-<N>`
   - In headless/no-browser environments, use `--static <output_path>` instead

Repeat until:
- `--manual`: user confirms satisfaction
- `--auto`: pass_rate ≥ 0.95 for 2 consecutive iterations, or max 5 iterations reached

### Final checkpoint

- If `--manual`: show SKILL.md to user and ask for explicit approval before declaring done.
- If `--auto`: print `[build] SKILL.md written. Pass rate: X%. Iterations: N.` and exit.

---

## Full Flow (no explicit mode)

When invoked without `plan` or `build`, detect where the user is and jump in:

| State | Entry point |
|-------|-------------|
| No skill, no evals | Start from Capture Intent |
| No skill, has evals | Skip to GREEN in build mode |
| Has skill, no evals | Start from Test Cases |
| Has skill and evals, no runs | Start from Running and evaluating |
| Has runs | Start from Improving |

---

### Creating a skill

#### Capture Intent (fallback only)

> Use this section only when the user's intent is not clearly `plan` or `build` from natural language. If the user says something like "crear pruebas de..." or "build the skill", skip directly to the corresponding mode section above.

Start by understanding the user's intent. The current conversation might already contain a workflow the user wants to capture (e.g., they say "turn this into a skill"). If so, extract answers from the conversation history first — the tools used, the sequence of steps, corrections the user made, input/output formats observed. The user may need to fill the gaps, and should confirm before proceeding to the next step.

1. What should this skill enable Claude to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?
4. Should we set up test cases to verify the skill works? Skills with objectively verifiable outputs (file transforms, data extraction, code generation, fixed workflow steps) benefit from test cases. Skills with subjective outputs (writing style, art) often don't need them. Suggest the appropriate default based on the skill type, but let the user decide.

#### Interview and Research

Proactively ask questions about edge cases, input/output formats, example files, success criteria, and dependencies. Wait to write test prompts until you've got this part ironed out.

Check available MCPs - if useful for research (searching docs, finding similar skills, looking up best practices), research in parallel via subagents if available, otherwise inline. Come prepared with context to reduce burden on the user.

#### Write the SKILL.md

**Before writing anything**, read `assets/skill-template.md` to get the canonical structure. Use the template's sections as the contract for the output — don't hardcode section names from memory. If the template evolves, the skill you produce will follow automatically.

**Fallback chain** if the file can't be found:
1. `assets/skill-template.md` — relative path from the skill's own directory (primary)
2. Search for `skill-template.md` inside an `assets/` folder near the active skill-master directory using available context
3. If still unavailable, generate a SKILL.md with the minimum valid structure: YAML frontmatter (`name`, `description`, `triggers`) + body sections inferred from the interview

**How to complete the template sections:**

- **`name`**: Skill identifier in kebab-case.
- **`description`**: When to trigger and what it does — this is the primary triggering mechanism. Include specific phrases/contexts that should invoke the skill. Make it slightly "pushy": instead of *"How to build a dashboard"*, write *"How to build a dashboard. Use this whenever the user mentions dashboards, data visualization, or internal metrics, even if they don't say 'dashboard' explicitly."* All "when to use" logic goes here, not in the body.
- **`triggers`**: List of key phrases that reliably signal this skill (used for description optimization).
- **Body sections**: Fill each section from the template with information gathered during the interview. Adapt or omit sections that don't apply to the skill's domain — the template is a starting point, not a rigid checklist.

#### Skill Writing Guide

For detailed guidance on structure, patterns, and principles, read these references before writing:

- `references/skill-anatomy.md` — anatomy, progressive disclosure, multi-client design, principle of lack of surprise
- `references/writing-guide.md` — writing style, output format patterns, how to think about improvements
- `references/skill-structure.md` — canonical folder structure and rules per directory
- `references/skill-frontmatter.md` — frontmatter YAML conventions (type, triggers, version, alwaysApply)
- `references/tdd-workflow.md` — RED/GREEN/REFACTOR cycle: evals BEFORE SKILL.md
- `references/skill-evals-format.md` — TC-NNN format with contains/not_contains/threshold
- `references/skill-tasks-template.md` — tasks template with TDD phases annotated

#### Test Cases

After writing the skill draft, come up with 2-3 realistic test prompts — the kind of thing a real user would actually say. Share them with the user: [you don't have to use this exact language] "Here are a few test cases I'd like to try. Do these look right, or do you want to add more?" Then run them.

Save test cases to `evals/evals.json`. Don't write assertions yet — just the prompts. You'll draft assertions in the next step while the runs are in progress.

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

See `references/schemas.md` for the full schema (including the `assertions` field, which you'll add later).

---

### Running and evaluating test cases

This section is one continuous sequence — don't stop partway through. Do NOT use `/skill-test` or any other testing skill.

**Workspace location:** Define `WORKSPACE` once at the start of each eval session and reuse it for every path below:

```bash
WORKSPACE=".tmp/skills-workspace/<skill-name>-workspace"
```

To store results elsewhere, change only this definition. Organize results within `$WORKSPACE` by iteration (`iteration-1/`, `iteration-2/`, etc.) and within that, each test case gets a directory with a descriptive name. Don't create all of this upfront — just create directories as you go.

#### Step 1: Spawn all runs (with-skill AND baseline) in the same turn

For each test case, spawn two subagents in the same turn — one with the skill, one without. This is important: don't spawn the with-skill runs first and then come back for baselines later. Launch everything at once so it all finishes around the same time.

**With-skill run:**

```
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files if any, or "none">
- Save outputs to: $WORKSPACE/iteration-<N>/eval-<ID>/with_skill/outputs/
- Outputs to save: <what the user cares about — e.g., "the .docx file", "the final CSV">
```

**Baseline run** (same prompt, but the baseline depends on context):
- **Creating a new skill**: no skill at all. Same prompt, no skill path, save to `$WORKSPACE/iteration-<N>/eval-<ID>/without_skill/outputs/`.
- **Improving an existing skill**: the old version. Before editing, snapshot the skill (`cp -r <skill-path> $WORKSPACE/skill-snapshot/`), then point the baseline subagent at the snapshot. Save to `$WORKSPACE/iteration-<N>/eval-<ID>/old_skill/outputs/`.

Write an `eval_metadata.json` for each test case (assertions can be empty for now). Give each eval a descriptive name based on what it's testing — not just "eval-0". Use this name for the directory too. If this iteration uses new or modified eval prompts, create these files for each new eval directory — don't assume they carry over from previous iterations.

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": []
}
```

#### Step 2: While runs are in progress, draft assertions

Don't just wait for the runs to finish — you can use this time productively. Draft quantitative assertions for each test case and explain them to the user. If assertions already exist in `evals/evals.json`, review them and explain what they check.

Good assertions are objectively verifiable and have descriptive names — they should read clearly in the benchmark viewer so someone glancing at the results immediately understands what each one checks. Subjective skills (writing style, design quality) are better evaluated qualitatively — don't force assertions onto things that need human judgment.

Update the `eval_metadata.json` files and `evals/evals.json` with the assertions once drafted. Also explain to the user what they'll see in the viewer — both the qualitative outputs and the quantitative benchmark.

#### Step 3: As runs complete, capture timing data

When each subagent task completes, you receive a notification containing `total_tokens` and `duration_ms`. Save this data immediately to `timing.json` in the run directory:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

This is the only opportunity to capture this data — it comes through the task notification and isn't persisted elsewhere. Process each notification as it arrives rather than trying to batch them.

#### Step 4: Grade, aggregate, and launch the viewer

Once all runs are done:

1. **Grade each run** — spawn a grader subagent (or grade inline) that reads `agents/grader.md` and evaluates each assertion against the outputs. Save results to `grading.json` in each run directory. The grading.json expectations array must use the fields `text`, `passed`, and `evidence` (not `name`/`met`/`details` or other variants) — the viewer depends on these exact field names. For assertions that can be checked programmatically, write and run a script rather than eyeballing it — scripts are faster, more reliable, and can be reused across iterations.

2. **Aggregate into benchmark** — run the aggregation script from the skill-master directory:
   ```bash
   python -m scripts.aggregate_benchmark $WORKSPACE/iteration-N --skill-name <name>
   ```
   This produces `benchmark.json` and `benchmark.md` with pass_rate, time, and tokens for each configuration, with mean ± stddev and the delta. If generating benchmark.json manually, see `references/schemas.md` for the exact schema the viewer expects.
Put each with_skill version before its baseline counterpart.

3. **Do an analyst pass** — read the benchmark data and surface patterns the aggregate stats might hide. See `agents/analyzer.md` (the "Analyzing Benchmark Results" section) for what to look for — things like assertions that always pass regardless of skill (non-discriminating), high-variance evals (possibly flaky), and time/token tradeoffs.

4. **Launch the viewer** with both qualitative outputs and quantitative data:
   ```bash
   nohup python <skill-master-path>/eval-viewer/generate_review.py \
     $WORKSPACE/iteration-N \
     --skill-name "my-skill" \
     --benchmark $WORKSPACE/iteration-N/benchmark.json \
     > /dev/null 2>&1 &
   VIEWER_PID=$!
   ```
   For iteration 2+, also pass `--previous-workspace $WORKSPACE/iteration-<N-1>`.

   **Cowork / headless environments:** If `webbrowser.open()` is not available or the environment has no display, use `--static <output_path>` to write a standalone HTML file instead of starting a server. Feedback will be downloaded as a `feedback.json` file when the user clicks "Submit All Reviews". After download, copy `feedback.json` into `$WORKSPACE/iteration-N/` for the next iteration to pick up.

   Note: please use generate_review.py to create the viewer; there's no need to write custom HTML.

5. **Tell the user** something like: "I've opened the results in your browser. There are two tabs — 'Outputs' lets you click through each test case and leave feedback, 'Benchmark' shows the quantitative comparison. When you're done, come back here and let me know."

#### What the user sees in the viewer

The "Outputs" tab shows one test case at a time:
- **Prompt**: the task that was given
- **Output**: the files the skill produced, rendered inline where possible
- **Previous Output** (iteration 2+): collapsed section showing last iteration's output
- **Formal Grades** (if grading was run): collapsed section showing assertion pass/fail
- **Feedback**: a textbox that auto-saves as they type
- **Previous Feedback** (iteration 2+): their comments from last time, shown below the textbox

The "Benchmark" tab shows the stats summary: pass rates, timing, and token usage for each configuration, with per-eval breakdowns and analyst observations.

Navigation is via prev/next buttons or arrow keys. When done, they click "Submit All Reviews" which saves all feedback to `feedback.json`.

#### Step 5: Read the feedback

When the user tells you they're done, read `feedback.json`:

```json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "the chart is missing axis labels", "timestamp": "..."},
    {"run_id": "eval-1-with_skill", "feedback": "", "timestamp": "..."},
    {"run_id": "eval-2-with_skill", "feedback": "perfect, love this", "timestamp": "..."}
  ],
  "status": "complete"
}
```

Empty feedback means the user thought it was fine. Focus your improvements on the test cases where the user had specific complaints.

Kill the viewer server when you're done with it:

```bash
kill $VIEWER_PID 2>/dev/null
```

---

### Improving the skill

This is the heart of the loop. You've run the test cases, the user has reviewed the results, and now you need to make the skill better based on their feedback.

Read `references/writing-guide.md` for detailed guidance on how to think about improvements (generalizing from feedback, keeping the prompt lean, explaining the why, bundling repeated work into scripts).

#### The iteration loop

After improving the skill:

1. Apply your improvements to the skill
2. Rerun all test cases into a new `iteration-<N+1>/` directory, including baseline runs. If you're creating a new skill, the baseline is always `without_skill` (no skill) — that stays the same across iterations. If you're improving an existing skill, use your judgment on what makes sense as the baseline: the original version the user came in with, or the previous iteration.
3. Launch the reviewer with `--previous-workspace` pointing at the previous iteration
4. Wait for the user to review and tell you they're done
5. Read the new feedback, improve again, repeat

Keep going until:
- The user says they're happy
- The feedback is all empty (everything looks good)
- You're not making meaningful progress

---

## Advanced: Blind comparison

For situations where you want a more rigorous comparison between two versions of a skill (e.g., the user asks "is the new version actually better?"), there's a blind comparison system. Read `agents/comparator.md` and `agents/analyzer.md` for the details. The basic idea is: give two outputs to an independent agent without telling it which is which, and let it judge quality. Then analyze why the winner won.

This is optional, requires subagents, and most users won't need it. The human review loop is usually sufficient.

---

## Description Optimization

The description field in SKILL.md frontmatter is the primary mechanism that determines whether Claude invokes a skill. After creating or improving a skill, offer to optimize the description for better triggering accuracy.

### Step 1: Generate trigger eval queries

Create 20 eval queries — a mix of should-trigger and should-not-trigger. Save as JSON:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

The queries must be realistic and something a Claude Code or Claude.ai user would actually type. Not abstract requests, but requests that are concrete and specific and have a good amount of detail. For instance, file paths, personal context about the user's job or situation, column names and values, company names, URLs. A little bit of backstory. Some might be in lowercase or contain abbreviations or typos or casual speech. Use a mix of different lengths, and focus on edge cases rather than making them clear-cut (the user will get a chance to sign off on them).

Bad: `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

Good: `"ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"`

For the **should-trigger** queries (8-10), think about coverage. You want different phrasings of the same intent — some formal, some casual. Include cases where the user doesn't explicitly name the skill or file type but clearly needs it. Throw in some uncommon use cases and cases where this skill competes with another but should win.

For the **should-not-trigger** queries (8-10), the most valuable ones are the near-misses — queries that share keywords or concepts with the skill but actually need something different. Think adjacent domains, ambiguous phrasing where a naive keyword match would trigger but shouldn't, and cases where the query touches on something the skill does but in a context where another tool is more appropriate.

The key thing to avoid: don't make should-not-trigger queries obviously irrelevant. "Write a fibonacci function" as a negative test for a PDF skill is too easy — it doesn't test anything. The negative cases should be genuinely tricky.

### Step 2: Review with user

Present the eval set to the user for review using the HTML template:

1. Read the template from `assets/eval_review.html`
2. Replace the placeholders:
   - `__EVAL_DATA_PLACEHOLDER__` → the JSON array of eval items (no quotes around it — it's a JS variable assignment)
   - `__SKILL_NAME_PLACEHOLDER__` → the skill's name
   - `__SKILL_DESCRIPTION_PLACEHOLDER__` → the skill's current description
3. Write to a temp file (e.g., `/tmp/eval_review_<skill-name>.html`) and open it: `open /tmp/eval_review_<skill-name>.html`
4. The user can edit queries, toggle should-trigger, add/remove entries, then click "Export Eval Set"
5. The file downloads to `~/Downloads/eval_set.json` — check the Downloads folder for the most recent version in case there are multiple (e.g., `eval_set (1).json`)

This step matters — bad eval queries lead to bad descriptions.

### Step 3: Run the optimization loop

Tell the user: "This will take some time — I'll run the optimization loop in the background and check on it periodically."

Save the eval set to the workspace, then run in the background:

```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-powering-this-session> \
  --max-iterations 5 \
  --verbose
```

Use the model ID from your system prompt (the one powering the current session) so the triggering test matches what the user actually experiences.

While it runs, periodically tail the output to give the user updates on which iteration it's on and what the scores look like.

This handles the full optimization loop automatically. It splits the eval set into 60% train and 40% held-out test, evaluates the current description (running each query 3 times to get a reliable trigger rate), then calls Claude to propose improvements based on what failed. It re-evaluates each new description on both train and test, iterating up to 5 times. When it's done, it opens an HTML report in the browser showing the results per iteration and returns JSON with `best_description` — selected by test score rather than train score to avoid overfitting.

### How skill triggering works

Understanding the triggering mechanism helps design better eval queries. Skills appear in Claude's `available_skills` list with their name + description, and Claude decides whether to consult a skill based on that description. The important thing to know is that Claude only consults skills for tasks it can't easily handle on its own — simple, one-step queries like "read this PDF" may not trigger a skill even if the description matches perfectly, because Claude can handle them directly with basic tools. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

This means your eval queries should be substantive enough that Claude would actually benefit from consulting a skill. Simple queries like "read file X" are poor test cases — they won't trigger skills regardless of description quality.

### Step 4: Apply the result

Take `best_description` from the JSON output and update the skill's SKILL.md frontmatter. Show the user before/after and report the scores.

---

### Package and Present (only if `present_files` tool is available)

Check whether you have access to the `present_files` tool. If you don't, skip this step. If you do, package the skill and present the .skill file to the user:

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

After packaging, direct the user to the resulting `.skill` file path so they can install it.

---

## Platform-Specific Instructions

Read `references/platform-guides.md` for instructions specific to your runtime environment. Key differences:
- **Claude.ai**: no subagents → run tests sequentially; skip benchmarking and description optimization; skip blind comparison
- **Cowork**: has subagents but no browser → use `--static` flag for viewer; feedback downloads as file

---

## Reference Files

The `agents/` directory contains instructions for specialized subagents. Read them when you need to spawn the relevant subagent.

- `agents/grader.md` — How to evaluate assertions against outputs
- `agents/comparator.md` — How to do blind A/B comparison between two outputs
- `agents/analyzer.md` — How to analyze why one version beat another

The `references/` directory contains detailed guides and schemas:

| File | Content |
|------|---------|
| `references/schemas.md` | JSON schemas for the skill-master benchmarking system (evals.json, grading.json, benchmark.json) |
| `references/skill-anatomy.md` | Anatomy, progressive disclosure, multi-client design, principle of surprise |
| `references/writing-guide.md` | Writing style, output format patterns, improvement thinking |
| `references/platform-guides.md` | Claude.ai and Cowork specific instructions |
| `references/skill-structure.md` | Canonical folder structure and per-directory rules |
| `references/skill-frontmatter.md` | Frontmatter YAML conventions (type, triggers, version, alwaysApply) |
| `references/tdd-workflow.md` | RED/GREEN/REFACTOR cycle with pressure scenarios |
| `references/skill-tasks-template.md` | Tasks template with TDD phases annotated [Pre-RED/RED/GREEN/REFACTOR] |
| `references/skill-evals-format.md` | Eval format TC-NNN with contains/not_contains/threshold |

---

Repeating one more time the core loop here for emphasis:

- Figure out what the skill is about
- Draft or edit the skill
- Run claude-with-access-to-the-skill on test prompts
- With the user, evaluate the outputs:
  - Create benchmark.json and run `eval-viewer/generate_review.py` to help the user review them
  - Run quantitative evals
- Repeat until you and the user are satisfied
- Package the final skill and return it to the user.

Please add steps to your TodoList, if you have such a thing, to make sure you don't forget. If you're in Cowork, please specifically put "Create evals JSON and run `eval-viewer/generate_review.py` so human can review test cases" in your TodoList to make sure it happens.

Good luck!
