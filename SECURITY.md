# Security Policy

## Scope

This repository ships **instructions that AI agents execute** — the skills under `skills/`, the
subagents under `agents/`, the policies and guardrails an agent reads under `docs/policies/`, and
four Node helper scripts under `scripts/` (`cli.js`, `install.js`, `postinstall.js`,
`normalize-preflight-paso0.js`, about 310 lines in total). It is consumed by installing those files
into someone else's working directory, where an agent then acts on them.

So a vulnerability here is not a crash or a memory bug. **It is anything in these files that makes an
agent following them act against the person running it**: reading what it was not asked to read,
sending data somewhere it should not, running something destructive without asking, or quietly
ignoring a control the user relies on.

Out of scope:

- The applications an agent builds by *using* these skills. Their runtime, infrastructure and
  pipelines are governed by the security policy of that project — the boundary already stated at the
  top of [docs/policies/references/code-security-checklist.md](docs/policies/references/code-security-checklist.md).
- Model, training-data, vector-store and inference concerns. This repository hosts none of them.
- Vulnerabilities in third-party tools this repository invokes or documents — Skill Shielder, Trivy,
  `fs-extra`. Report those upstream.

## Supported versions

| Line | Status |
|------|--------|
| `main` | Supported. Fixes land here. |
| `2.x` on npm | Supported. Fixes ship as a new patch release. |
| `1.x` and earlier tags | Not supported. `2.0.0` changed the `docs/specs/` layout and the artefact names with no backward-compatible aliases. |

`npx agile-sddf install` and `npm install agile-sddf` resolve the latest published version, so there
is effectively one supported line and updating means re-installing. The installer **copies** skills
and agents into `.claude/`, `.agents/` or `.github/`; it does not link them, so an installed tree
keeps the version it was installed from until you re-run the installer. Moving from 1.x is a manual
migration — see [Upgrading desde 1.x](README.md#upgrading-desde-1x) in the README.

## Threat model

What this repository defends against, and the rule that gates each one. Rule ids come from the two
guardrails linked below, and the checks print them verbatim.

| Threat | Gated by |
|--------|----------|
| Indirect prompt injection — text in a skill or reference that redirects a later agent away from the user's task | `ai-no-prompt-override` |
| Exfiltration — instructions that make an agent read, copy or transmit anything outside the directory the user opened | `ai-no-home-path`, plus the AI guardrail's semantic review |
| Unsafe action — a documented command that is destructive or outward-facing with no confirmation step in front of it | `ai-confirm-before-irreversible` |
| Permission escalation — wording whose purpose is to skip the agent's approval prompt or widen privileges | `ai-no-safety-bypass`, `sec-no-privilege-escalation` |
| Remote code execution — downloaded content piped into an interpreter, or package resolution pointed at another registry | `ai-no-remote-pipe`, `sec-no-custom-registry` |
| Hidden text — invisible or bidirectional characters carrying instructions a reviewer cannot see (ASCII smuggling, Trojan Source) | `ai-no-hidden-characters`, `ai-no-opaque-blob` |
| Leaked secrets and personal data committed into skills, fixtures or docs | `sec-no-credential-literal`, `sec-no-provider-token`, `sec-no-personal-data` |
| Install-time integrity — the installer writing outside the directory the user chose | review of `scripts/install.js`, `sec-no-absolute-path` |

Prompt injection is the one worth stating plainly: because the product is text an agent obeys, a
malicious edit to a Markdown file is a code-execution primitive here, not a documentation typo.

Two surfaces are specific to shipping this as an npm package:

**Install-time execution (OWASP A08 — software and data integrity).** `npm install agile-sddf` runs
[scripts/postinstall.js](scripts/postinstall.js), which calls
`installSDDF({ folder: process.env.SDDF_TARGET || '.claude' })` in
[scripts/install.js](scripts/install.js) and copies `skills/` and `agents/` into that folder — under
the project directory, or under the user's home directory for a global install. That is code running
on the installing machine before anyone has read anything, so `scripts/` is held to the code
guardrail and every change there is read line by line. Anyone who would rather not run it can install
with `npm install agile-sddf --ignore-scripts` and then run `npx agile-sddf install` deliberately.

**Dependencies (OWASP A06 — vulnerable and outdated components).** The runtime tree is one direct
dependency, `fs-extra`, with `engines: node >= 18`. A new dependency needs a technical reason, a
compatible licence, and its maintenance status and known vulnerabilities checked before it is added —
the semantic rule already written in the code guardrail.

## Prohibited patterns

A contribution must not contain, in any file:

1. **Instruction override** — text addressed to a future agent telling it to set aside its own rules,
   its guardrails, or the user's request.
2. **Exfiltration** — steps that gather shell history, credential stores, environment dumps, or the
   contents of sibling repositories, or that send repository content to an external endpoint.
3. **Permission escalation** — flags, settings or wording whose purpose is to skip the agent's
   approval prompt, widen file permissions, or run a step with elevated privileges.
4. **Credential harvesting** — steps that ask the user for a token or key, or that read one out of a
   secret store, for any purpose other than the task the user asked for.
5. **Remote code execution** — a documented command that downloads content and feeds it straight to
   an interpreter, or that redirects package resolution to a non-official index or mirror.
6. **Opaque content** — encoded blobs, or invisible and bidirectional characters, that a reviewer
   cannot read and audit as plain text.

The guardrails themselves, the `security-audit` skill's rule checklist, and the scratch directory
`.tmp/` quote several of these patterns as sample content — that is why the automated checks skip
`.tmp/` and any file whose name ends in `checklist.md`. Treat that exclusion as a reviewing
convention, never as a place to park a live directive: content in those paths is read by a human
precisely because a grep will not read it.

## How this repository is validated

Two guardrails carry every rule, each classified by how it is verified — deterministically by a named
command, or semantically by review:

- [docs/policies/references/code-security-checklist.md](docs/policies/references/code-security-checklist.md)
  — secrets, executable scripts, tracked artefacts and documented commands.
- [docs/policies/references/ai-security-checklist.md](docs/policies/references/ai-security-checklist.md)
  — agent-facing instructions, untrusted input and irreversible actions.

Each file defines its checks in full, so they run with `git`, GNU `grep` and Python 3, with no
external scanner. To run one:

```bash
sed -n '/^```bash$/,/^```$/p' docs/policies/references/ai-security-checklist.md | sed '1d;$d' > run-guardrail.sh
bash run-guardrail.sh
```

What is automated, and what is not:

| Control | Where it runs | Status |
|---------|---------------|--------|
| Trivy — `.github/workflows/docker-security.yml` | CI, on changes to `Dockerfile*` or `docker-compose*.yml` | Active. |
| Skill Shielder — `.github/workflows/skill-security-audit.yml` | CI, filtered on `.claude/skills/**` | **Does not cover the real source.** `.claude/` is gitignored and holds no tracked files, while the skills live in `skills/`. Known limitation. |
| The two guardrails above | A maintainer's machine | Manual. No CI job enforces them today. |
| The repository's own `security-audit` skill | A maintainer's machine | Manual, dogfooding. This is how the absence of this policy was found. |

Findings are triaged under each guardrail's on-breach rule: an `(error)` blocks the change, a
`(warn)` is fixed or justified in the pull request. Open findings are tracked in this repository's
issues rather than listed here.

Changes that add or edit a skill also get a human read. An automated pattern match catches known
phrasings; it does not catch a well-written instruction that happens to be malicious.

## Reporting a vulnerability

**Please do not open a public issue.**

Use GitHub's private reporting: go to the
[Security tab](https://github.com/dariopalminio/agile-sddf/security/advisories) of
`dariopalminio/agile-sddf` and choose *Report a vulnerability*. That opens a private thread with the
maintainer.

Include, as far as you can:

- the affected file, skill, agent or script;
- the agent behaviour it induces — what an agent following it would do that the user did not ask for;
- steps to reproduce, ideally the prompt and the observed action;
- your assessment of the impact.

This is a personally maintained project, so no response deadline is promised. Reports are
acknowledged as soon as the maintainer is able to, and you will be told what is happening rather than
left waiting.

## Coordinated disclosure

The fix lands first. A public advisory, a [CHANGELOG.md](CHANGELOG.md) entry and the npm version that
carries the fix follow it, so people who installed from the package know what to update to — and
people who installed into `.claude/` know they need to re-run the installer. Reporters are credited by
name or handle unless they ask not to be. There is no bug bounty.

If you are unsure whether what you found is a vulnerability or just a rough edge, report it privately
anyway — deciding that is the maintainer's job, not yours.
