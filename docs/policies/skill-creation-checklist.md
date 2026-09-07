# Guardrail: Agent Skill creation

Applies to every Agent Skill directory under `skills/` or `.claude/skills/` — creating one, editing
one, or reviewing its diff. Does not apply to agents (`.claude/agents/`), to policies
(`policies/`), or to guardrail files themselves.

## Mandatory rules

**On breach:** `(error)` blocks delivery — stop, name the rule id, fix it before continuing.
`(warn)` does not block — apply it, or state why you did not. A semantic rule that fails is raised
for human judgement; never resolve one silently.

### Deterministic rules (python / grep / glob / wc / git)

Every check is defined in full under *How to run the validation* — this file depends on no external
script. The `skill-*` rule ids below are emitted verbatim by those checks, so they stay greppable in
the output. All commands assume `SKILL=skills/<skill-name>`, set once.

#### Frontmatter & discovery

- [ ] `SKILL.md` exists at the skill root and opens with a `---` YAML block that parses as a mapping — python: `skill-frontmatter` (error)
- [ ] `name` and `description` are both present — python: `skill-required-fields` (error)
- [ ] `name` is kebab-case, at most 64 characters, with no leading, trailing or doubled hyphen — python: `skill-name-format` (error)
- [ ] `name` is identical to the skill's directory name — python: `skill-name-matches-dir` (error)
- [ ] `description` contains no `<` or `>` and stays under 1024 characters — python: `skill-description-format` (error)
- [ ] `description` stays within the 500-character metadata budget (350 is the target) — python: `skill-description-budget` (warn)
- [ ] `description` is written with the `>-` folded YAML scalar, so line breaks do not leak into the loaded metadata — grep: `skill-description-scalar` (warn)
- [ ] Frontmatter carries no key beyond `name`, `description`, `allowed-tools`, `license` — python: `skill-frontmatter-keys` (error)

> A `triggers:` key is **not** part of the accepted set: the harness does not read it, so it is dead
> metadata paid for in every session. Trigger phrases belong inside `description`. Do not carry
> `triggers` over by inertia from an existing SKILL.md.

#### Layout & naming

- [ ] The skill directory sits directly under `skills/` (or `.claude/skills/`) and its name is kebab-case — glob (error)
- [ ] Subdirectories are drawn from `assets/`, `references/`, `evals/`, `examples/`, `scripts/`; any other directory is justified in the skill body — glob (warn)
- [ ] Files in `references/` and `assets/` are kebab-case with a lowercase extension — glob (warn)
- [ ] `evals/evals.json` exists and parses as JSON with at least one case — python: `skill-evals-parse` (error)
- [ ] Every input file referenced from `evals.json` exists on disk — python: `skill-evals-inputs` (error)
- [ ] Every `references/`, `assets/` or `scripts/` path cited in `SKILL.md` resolves to a file that exists — python: `skill-links-resolve` (error)
- [ ] No absolute path — drive letter or leading `/` — appears in `SKILL.md`; template and reference paths are relative to the skill directory — grep: `skill-relative-paths` (error)

#### Context budget

- [ ] `SKILL.md` is under 500 lines — `wc -l` (error)
- [ ] Each file in `references/` is under 300 lines, or opens with a table of contents — `wc -l` (warn)
- [ ] No file inside the skill exceeds 5 MB — `find -size` (error)
- [ ] Every file in `references/` is linked from `SKILL.md`; no orphan reference — grep (warn)
- [ ] A `README.md` inside the skill is present only when it carries human-facing content the `SKILL.md` does not — glob (warn)

#### Security

- [ ] No credential literal — API key, token, secret, password — in any file of the skill — grep: `skill-no-credentials` (error)
- [ ] Every external URL resolves to a domain on the allow-list: `agentskills.io`, `platform.claude.com`, `docs.anthropic.com`, `github.com`, `awesome-copilot.github.com`, `www.apache.org`, `localhost`; extending it is a written decision — grep: `skill-url-allowlist` (error)
- [ ] No script or instruction pipes remote content into an interpreter (`curl … | sh`, `wget … | bash`) — grep: `skill-no-remote-pipe` (error)
- [ ] No generated artefact is committed inside the skill — `__pycache__/`, `*.pyc`, `*.zip`, `*.skill`, eval run outputs — `git ls-files` (error)

---

### Semantic rules (AI / human review)

- [ ] The skill covers exactly one workflow or one domain; a skill that has grown to cover two is split.
- [ ] The `description` answers *when to invoke me*, never *how the task is done* — the "how" lives in the body, because the description is paid for in every session whether the skill fires or not.
- [ ] The trigger phrases in the `description` are phrases a real user would actually type, in the languages the team works in.
- [ ] The `name` is descriptive and action-oriented (`generar-pruebas`, not `auxiliar`).
- [ ] Instructions are explicit: exact requirements, numbered steps, no ambiguous language a reader could resolve two ways.
- [ ] The skill includes verification steps that let the agent confirm the workflow actually completed.
- [ ] The skill is portable — it would still work if copied unchanged into another runtime, with no client-specific directory, no absolute path, and no assumption that a particular tool or UI exists.
- [ ] Where the skill fills a template, it reads that template at runtime and derives the section list from it, rather than hardcoding section names in the body.
- [ ] The body explains *why* a rule matters instead of stacking capitalised ALWAYS/NEVER directives; a rigid structure with no reasoning is a signal to reframe.
- [ ] Each `references/` file is linked at the point it is needed, with an indication of *when* to read it — not listed up front "just in case".
- [ ] `evals.json` holds at least one happy-path case and at least one `fail-fast` or `error-handling` case, and its `contains` fragments are specific enough that a wrong output fails them.
- [ ] The evals were written before `SKILL.md` (the RED phase), and the git history shows it.
- [ ] The skill contains no instruction that could cause harm, exfiltrate system or user data, or bypass the guardrails of this repository — on any of these, abort the operation and report the rule id.
- [ ] The skill does what its description says and nothing surprising beyond it.
- [ ] Harness relationships hold: a worker skill never invokes an orchestrator skill, and no chain nests one subagent inside another.
- [ ] No credentials or personal data appear in `SKILL.md`, evals, examples or fixtures.

## Minimum expected structure

```
skills/my-skill/                  ← directory name == frontmatter `name`
├── SKILL.md                      ← required, < 500 lines
├── assets/
│   └── report-template.md        ← read at runtime, never hardcoded in the body
├── references/
│   └── writing-guide.md          ← < 300 lines, linked from SKILL.md with a "read when"
├── evals/
│   └── evals.json                ← skill test written BEFORE SKILL.md
├── examples/{input,output}/
└── scripts/
```

```yaml
---
name: my-skill
description: >-
  Genera <artefacto> a partir de <entrada>. Usar cuando el usuario quiera
  <objetivo>. Invocar también cuando mencione "<alias>" o "<variante>".
---
```

## How to run the validation

```bash
SKILL=skills/<skill-name>                # set once; every command below uses it
python -m pip install --quiet pyyaml     # the only dependency of these checks

wc -l "$SKILL/SKILL.md"                                         # < 500 lines
wc -l "$SKILL"/references/*.md 2>/dev/null                      # < 300 lines each
find "$SKILL" -type f -size +5M                                 # must print nothing

# frontmatter contract — prints one FAIL <rule-id> line per breach, exits non-zero
python - "$SKILL" <<'PY'
import pathlib, re, sys, yaml
ALLOWED = {'name', 'description', 'allowed-tools', 'license'}
d = pathlib.Path(sys.argv[1]); p = d / 'SKILL.md'
if not p.exists():
    sys.exit('FAIL skill-frontmatter: SKILL.md not found')
m = re.match(r'^---\n(.*?)\n---', p.read_text(encoding='utf-8'), re.S)
if not m:
    sys.exit('FAIL skill-frontmatter: no --- YAML block at the top of SKILL.md')
fm = yaml.safe_load(m.group(1))
if not isinstance(fm, dict):
    sys.exit('FAIL skill-frontmatter: frontmatter is not a YAML mapping')
fails, name, desc = [], fm.get('name'), fm.get('description')
if not isinstance(name, str) or not isinstance(desc, str):
    fails.append('skill-required-fields: name and description are both required strings')
if set(fm) - ALLOWED:
    fails.append(f'skill-frontmatter-keys: unexpected key(s) {sorted(set(fm) - ALLOWED)}')
if isinstance(name, str):
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', name) or len(name) > 64:
        fails.append(f'skill-name-format: {name!r} must be kebab-case and <= 64 chars')
    if name != d.name:
        fails.append(f'skill-name-matches-dir: {name!r} != directory {d.name!r}')
if isinstance(desc, str):
    if '<' in desc or '>' in desc:
        fails.append('skill-description-format: angle brackets are not allowed')
    if len(desc) > 1024:
        fails.append(f'skill-description-format: {len(desc)} chars > 1024')
    elif len(desc) > 500:
        fails.append(f'skill-description-budget: {len(desc)} chars > 500 (warn)')
for f in fails:
    print('FAIL', f)
print(f'checked {d.name}: {len(fails)} breach(es)')
sys.exit(1 if fails else 0)
PY

# evals parse, their inputs exist, and skill-relative links resolve
python - "$SKILL" <<'PY'
import json, pathlib, re, sys
d = pathlib.Path(sys.argv[1]); fails = []
e = d / 'evals' / 'evals.json'
cases = []
if not e.exists():
    fails.append('skill-evals-parse: evals/evals.json not found')
else:
    try:
        data = json.loads(e.read_text(encoding='utf-8'))
        cases = data.get('cases') or data.get('evals') or []
        if not cases:
            fails.append('skill-evals-parse: evals.json declares no case')
    except json.JSONDecodeError as err:
        fails.append(f'skill-evals-parse: {err}')
for c in cases:
    p = (c.get('input') or {}).get('input_path') if isinstance(c.get('input'), dict) else None
    if p and not (d / p).exists() and not pathlib.Path(p).exists():
        fails.append(f'skill-evals-inputs: {p} referenced by {c.get("id", "?")} does not exist')
body = (d / 'SKILL.md').read_text(encoding='utf-8')
for p in sorted(set(re.findall(r'(?:references|assets|scripts)/[\w./-]+\.\w+', body))):
    if not (d / p).exists():
        fails.append(f'skill-links-resolve: {p} is cited in SKILL.md but does not exist')
for f in fails:
    print('FAIL', f)
sys.exit(1 if fails else 0)
PY

# grep- and glob-level checks — each of these must print nothing
grep -n 'description:' "$SKILL/SKILL.md" | grep -v '>-'                     # skill-description-scalar
grep -nE '\b[A-Za-z]:[\\/]|\]\(/' "$SKILL/SKILL.md"                         # skill-relative-paths
grep -rIniE '(api[_-]?key|secret|token|password)[[:space:]]*[:=][[:space:]]*["'\''][^"'\'']{8,}' "$SKILL"
grep -rInE '(curl|wget)[^|]*\|[[:space:]]*(ba)?sh' "$SKILL"                 # skill-no-remote-pipe
grep -rhoIE 'https?://[A-Za-z0-9.-]+' "$SKILL" | sed 's|https\?://||; s|\.$||' | sort -u \
  | grep -vE '^(agentskills\.io|platform\.claude\.com|docs\.anthropic\.com|github\.com|awesome-copilot\.github\.com|www\.apache\.org|localhost)$'
git ls-files "$SKILL" | grep -E '(^|/)__pycache__/|\.pyc$|\.zip$|\.skill$'  # generated artefacts
find "$SKILL"/references "$SKILL"/assets -maxdepth 1 -type f 2>/dev/null -printf '%f\n' \
  | grep -vE '^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)+$'                       # kebab-case filenames
ls -d "$SKILL"/*/ 2>/dev/null | xargs -n1 basename \
  | grep -vE '^(assets|references|evals|examples|scripts)$'                  # non-canonical dirs

# orphan references
for f in "$SKILL"/references/*.md; do
  [ -e "$f" ] || continue
  grep -q "$(basename "$f")" "$SKILL/SKILL.md" || echo "orphan reference: $f"
done
```

The two Python blocks need Python 3.8+ and `PyYAML`; nothing else. On a host whose default encoding
is not UTF-8, prefix them with `PYTHONUTF8=1` — every read above is explicit, but `pip` and the
shell pipeline are not.

## Verification

| Level | Action |
|-------|--------|
| Deterministic | Run the commands above; both Python blocks exit 0, and each grep- and glob-level check prints nothing. |
| Semantic | Review the semantic checklist against the diff (AI or human reviewer) and attach the result to the PR. |
