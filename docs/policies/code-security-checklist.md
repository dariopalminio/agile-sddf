# Guardrail: Code security check

Applies to every file this repository commits — the scripts under `skills/*/scripts/`, the code
templates under `assets/`, `references/` and `examples/`, and every Markdown document. Does not apply
to the applications an agent builds by *using* these skills: their runtime, their infrastructure and
their pipelines are governed by the security policy of the target project. Nor to what a skill tells
an agent to do — that is
[guardrails/ai-security-checklist.md](ai-security-checklist.md).

## Mandatory rules

**On breach:** `(error)` blocks delivery — stop, name the rule id, fix it before continuing.
`(warn)` does not block — apply it, or state why you did not. A semantic rule that fails is raised
for human judgement; never resolve one silently.

### Deterministic rules (grep / git ls-files / git check-ignore)

Every check is defined in full under *How to run the validation* — this file depends on no external
scanner and no CI service. The `sec-*` rule ids below are the labels those checks print, so they
stay greppable in the output.

#### Secrets and personal data

- [ ] No credential is assigned a literal value of 20 characters or more in any tracked file — grep: `sec-no-credential-literal` (error)
- [ ] No private key or certificate block is tracked — grep: `sec-no-private-key` (error)
- [ ] No provider token pattern (AWS access key, GitHub token, OpenAI-style key, Slack token) appears in a tracked file — grep: `sec-no-provider-token` (error)
- [ ] No credential-bearing file is tracked — `.env`, `*.pem`, `*.p12`, `*.pfx`, `*.key`, `id_rsa` — `git ls-files`: `sec-no-credential-file` (error)
- [ ] E-mail addresses in docs, evals and fixtures use a reserved example domain (`example.com`, `example.org`, `test.com`, `.test`, `.invalid`) — grep: `sec-no-personal-data` (warn)
- [ ] `.gitignore` covers the paths that hold local credentials and agent state: `.env`, `.claude`, `.agents`, `.temp`, `__pycache__`, `node_modules` — `git check-ignore`: `sec-gitignore-coverage` (error)

#### Executable code (Python, Node, TypeScript)

- [ ] Scripts invoke subprocesses with an argument list; no `shell=True`, `os.system(`, `child_process.exec(` — grep: `sec-no-shell-injection` (error)
- [ ] Scripts evaluate no dynamically built code — no `eval(`, `exec(`, `new Function(`, `pickle.load` — grep: `sec-no-dynamic-eval` (error)
- [ ] YAML is parsed with `yaml.safe_load` or an explicit `SafeLoader` — grep: `sec-no-unsafe-yaml` (error)
- [ ] Scripts keep transport verification on — no `verify=False`, `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED` — grep: `sec-no-disabled-tls` (error)
- [ ] Every path a script touches is relative to the repository or to a caller-supplied root; no drive letter and no `/home`, `/Users`, `/root`, `/etc` literal — grep: `sec-no-absolute-path` (error)

#### Tracked artefacts and documented commands

- [ ] No documented or scripted command redirects package resolution to an alternative index, registry or mirror — grep: `sec-no-custom-registry` (error)
- [ ] No documented or scripted command escalates privileges (`sudo`, `runas`) — grep: `sec-no-privilege-escalation` (error)
- [ ] No generated artefact is tracked — `__pycache__/`, `*.pyc`, `*.log` — `git ls-files`: `sec-no-generated-artefact` (error)
- [ ] No binary or archive artefact is tracked — `*.exe`, `*.dll`, `*.so`, `*.zip`, `*.jar`, `*.skill` — `git ls-files`: `sec-no-binary-artefact` (error)

> Piping remote content into an interpreter is checked in the AI guardrail, under third-party
> executed content. Do not duplicate `ai-no-remote-pipe` here.

---

### Semantic rules (AI / human review)

- [ ] Every script validates its external inputs — CLI arguments, environment variables, and the JSON, YAML or Markdown it parses — by type, shape and range before using them.
- [ ] A path derived from an argument is resolved and confined to the repository or to a caller-supplied root, so no input can traverse outside it.
- [ ] Script output and error messages diagnose the problem without echoing a token, a full environment, or an absolute host path.
- [ ] Examples, evals and fixtures use synthetic data; no real user, customer, host name or internal URL is used to make an example look realistic.
- [ ] Credential values that appear in teaching material are obviously fake, and the surrounding text shows the value being read from a secret manager or environment variable rather than hardcoded.
- [ ] Cryptography shown in a skill or template uses current algorithms and libraries; MD5 and SHA-1 are never presented as an example for passwords or signatures.
- [ ] A new third-party dependency introduced by a script has a technical reason, and its licence, maintenance status and known vulnerabilities were checked before it was added.
- [ ] A change that relaxes any control in this file states why, who decided it, and what compensating control applies.
- [ ] The change considers the OWASP Top 10 risks that apply both to the code it introduces and to the code the skill teaches an agent to generate.

## Minimum expected structure

```gitignore
# .gitignore — the minimum that must be ignored
.env
.env.*
.claude
.agents
.temp
__pycache__/
*.pyc
node_modules/
```

```python
# skills/<skill>/scripts/<script>.py — the shape the deterministic rules expect
import subprocess, sys, pathlib, yaml
root = pathlib.Path(sys.argv[1]).resolve()                                  # sec-no-absolute-path
if not root.is_relative_to(pathlib.Path.cwd()):
    sys.exit("path escapes the repository")                                 # confine to the caller's tree
config = yaml.safe_load((root / "config.yml").read_text(encoding="utf-8"))  # sec-no-unsafe-yaml
subprocess.run(["git", "ls-files", str(root)], check=True)                  # argument list, no shell
```

## How to run the validation

```bash
cd "$(git rev-parse --show-toplevel)"
present() { for f in "$@"; do [ -f "$f" ] && printf '%s\n' "$f"; done; }   # skip tracked-but-deleted paths
ALL=$(present $(git ls-files '*.md' '*.py' '*.mjs' '*.js' '*.ts' '*.json' '*.html' '*.feature' '*.txt' '*.yml'))
CODE=$(present $(git ls-files '*.py' '*.mjs' '*.js' '*.ts'))
SCAN=$(printf '%s\n' "$ALL" | grep -vE '^(guardrails|\.tmp)/|checklist\.md$')  # these quote the patterns by design

# secrets and personal data — every command must print nothing
grep -rInE '(api[_-]?key|secret|token|password|passwd)[[:space:]]*[:=][[:space:]]*["'\''][^"'\'']{20,}["'\'']' $ALL   # sec-no-credential-literal
grep -rIn 'BEGIN [A-Z ]*PRIVATE KEY' $ALL                                                    # sec-no-private-key
grep -rInE '(AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})' $ALL   # sec-no-provider-token
git ls-files | grep -E '(^|/)\.env|\.pem$|\.p12$|\.pfx$|\.key$|id_rsa'                       # sec-no-credential-file
grep -rhoIE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' $ALL | sort -u \
  | grep -vE '@(example\.(com|org|net)|test\.com|localhost|.*\.(test|invalid|local))$'       # sec-no-personal-data (warn)
for p in .env .claude .agents .temp __pycache__ node_modules; do
  git check-ignore -q "$p" || echo "FAIL sec-gitignore-coverage: $p is not ignored"
done

# executable code
grep -rInE 'shell=True|os\.system\(|child_process\.(exec|execSync)\(' $CODE                  # sec-no-shell-injection
grep -rInE '(^|[^._[:alnum:]])(eval|exec)\(|new Function\(|pickle\.loads?\(' $CODE           # sec-no-dynamic-eval
grep -rIn 'yaml\.load(' $CODE | grep -v 'SafeLoader'                                         # sec-no-unsafe-yaml
grep -rInE -e 'verify=False' -e 'rejectUnauthorized' -e 'NODE_TLS_REJECT_UNAUTHORIZED' $CODE # sec-no-disabled-tls
grep -rInE '\b[A-Za-z]:[\\/]|(^|[^:[:alnum:]"])/(home|Users|root|etc)/' $CODE                # sec-no-absolute-path

# tracked artefacts and documented commands
grep -rInE -e '--index-url' -e '--registry' -e 'PIP_INDEX_URL' -e 'NPM_CONFIG_REGISTRY' $SCAN # sec-no-custom-registry
grep -rInE '(^|[^[:alnum:]])(sudo|runas)[[:space:]]' $SCAN                                   # sec-no-privilege-escalation
git ls-files | grep -E '(^|/)__pycache__/|\.pyc$|\.log$'                                     # sec-no-generated-artefact
git ls-files | grep -E '\.(exe|dll|so|zip|jar|skill)$'                                       # sec-no-binary-artefact
```

Every command above needs only `git` and GNU `grep`; no package is installed. Run them from Git Bash
on Windows or any POSIX shell. A check that prints nothing passes; a check that prints a line names
the file and the breach.

## Verification

| Level | Action |
|-------|--------|
| Deterministic | Run the commands above; every `(error)` check prints nothing, and each `(warn)` line is triaged and either fixed or justified in the PR. |
| Semantic | Review the semantic checklist against the diff (AI or human reviewer) and attach the result to the PR. |

## Source of truth

This guardrail **summarises** the secure-development practice that applies to the content this
repository commits. The authoritative expansion — threat modelling, runtime and IaC scanning,
pipeline gates, SBOM and vulnerability SLAs — lives in the OWASP Top 10 and the
[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/). Where this file and the security
policy of the project being built disagree, that project's policy prevails.

See also: [guardrails/ai-security-checklist.md](ai-security-checklist.md) — the other half of this
repository's security surface: what a skill instructs an agent to read, run and trust.
