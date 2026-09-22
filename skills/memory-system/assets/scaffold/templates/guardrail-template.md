<!-- ------------------------------------------------------------------ -->
<!-- GUARDRAIL TEMPLATE                                                 -->
<!--                                                                    -->
<!-- How to use:                                                        -->
<!-- 1. Copy this file to guardrails/<domain>-checklist.md (kebab-case). -->
<!-- 2. Fill in the [placeholders]. Delete sections that do not apply.   -->
<!-- 3. Delete ALL of these comments before publishing.                  -->
<!--                                                                    -->
<!-- A guardrail is neither a skill nor a policy:                        -->
<!--   skill     = teaches how to BUILD. Thousands of lines, loaded      -->
<!--               on demand.                                            -->
<!--   policy    = governance. Version, status, owner, change history.   -->
<!--   guardrail = one file, one pass, rules already classified by       -->
<!--               HOW THEY ARE VERIFIED. Target: ~200 lines.            -->
<!--                                                                    -->
<!-- Keep the section headings exactly as written below: they are the    -->
<!-- contract every guardrail in this repo shares. English only — see    -->
<!-- the Language section of AGENTS.md.                                  -->
<!-- ------------------------------------------------------------------ -->

# Guardrail: [Domain or standard] [version, if any]

<!-- One or two lines: what it applies to and, where it prevents misuse, -->
<!-- what it does NOT apply to. No introduction paragraph: the reader is  -->
<!-- here for the rules.                                                 -->

Applies to [concrete scope]. Does not apply to [exclusion that prevents misuse].

<!-- Keep this line, with [PREFIX] resolved. Every rule in this file —     -->
<!-- deterministic AND semantic — carries an id <PREFIX>-NN:               -->
<!--   PREFIX = upper-case, one or two segments of 2-6 letters joined by   -->
<!--            "-", and it must NAME THE DOMAIN without opening the file  -->
<!--            (SEC, HEX-BE, HEX-FE — never CHK1 or X). It must not be   -->
<!--            in use by any sibling guardrail in the same folder.       -->
<!--   NN     = two digits, fixed width (01…99). One sequence per prefix, -->
<!--            document order on first write. A FAMILY (one base plus   -->
<!--            stack extensions sharing the prefix) uses three digits    -->
<!--            and partitions by hundreds: base 001…099, each extension  -->
<!--            a block of one hundred; state the allocation below.       -->
<!-- Ids are IMMUTABLE once published: never renumber, never insert in   -->
<!-- the middle, never reuse a retired number.                            -->

Rule IDs: `[PREFIX]-NN` — unique across this project's guardrails, immutable once published:
never renumbered, never reused.

## Mandatory rules

<!-- Keep this paragraph verbatim. Severity alone is linter vocabulary — -->
<!-- an agent reading "(error)" does not know whether to stop the task or -->
<!-- merely note it. This line is what turns a severity marker into an    -->
<!-- instruction, and it is the one thing a governance policy does better -->
<!-- than a bare rule list. Without it the document is a checklist, not a -->
<!-- guardrail.                                                          -->

**On breach:** `(error)` blocks delivery — stop, name the rule id, fix it before continuing.
`(warn)` does not block — apply it, or state why you did not. A semantic rule that fails is raised
for human judgement; never resolve one silently.

<!-- OPTIONAL, only under --update: numbers whose rule was deleted. They  -->
<!-- are retired for good so nobody reassigns them. Delete this line on   -->
<!-- a first write.                                                       -->

Retired IDs: [none | [PREFIX]-04, [PREFIX]-09]

<!-- ================================================================== -->
<!-- THE AXIS IS VERIFIABILITY, NOT SEVERITY.                           -->
<!--                                                                    -->
<!--   Deterministic = a tool returns a binary, reproducible verdict.    -->
<!--                   Runs in CI.                                       -->
<!--   Semantic      = requires judgement about meaning. No tool can     -->
<!--                   decide it. Reviewed on the PR.                    -->
<!--                                                                    -->
<!-- TEST FOR CLASSIFYING a new rule:                                    -->
<!--   Can you name the command that fails when it is broken?            -->
<!--     Yes -> deterministic, and CITE that command.                    -->
<!--     No  -> semantic.                                                -->
<!--                                                                    -->
<!-- error/warn exists ONLY in the deterministic layer: it is the        -->
<!-- reporting tool's vocabulary, NOT a ranking of importance. The most  -->
<!-- serious rule in the document may well be a semantic one.            -->
<!--                                                                    -->
<!-- DO NOT INVENT RULES. Every rule must come from an authoritative     -->
<!-- source (the skill, a standard, a written team decision). If you     -->
<!-- cannot cite where it comes from, it is not a rule — it is an        -->
<!-- opinion.                                                            -->
<!-- ================================================================== -->

### Deterministic rules ([tools — e.g. Spectral / ESLint / tsc])

<!-- MANDATORY line formats. The id is bold and is the first token after  -->
<!-- the checkbox; the severity is the last token.                       -->
<!--                                                                    -->
<!--   Check you define yourself (grep, find, a dependency-cruiser rule, -->
<!--   a no-restricted-syntax entry, a script in this file):             -->
<!--   - [ ] **<PREFIX>-NN** <rule> — <tool> (error|warn)                -->
<!--   …and the check PRINTS <PREFIX>-NN verbatim: the guardrail id IS   -->
<!--   the tool's label, so one grep on the CI output finds the rule.    -->
<!--                                                                    -->
<!--   Published rule of a third-party tool (you cannot rename it):     -->
<!--   - [ ] **<PREFIX>-NN** <rule> — <tool>: `<published-rule-id>` (error|warn) -->
<!--                                                                    -->
<!-- Group rules into themed subsections of 4-8. If a group grows past   -->
<!-- ~10, it is probably two groups.                                     -->

#### [Group 1 — e.g. Base structure]

- [ ] **[PREFIX]-01** [Verifiable rule, stated positively] — [Tool]: `[published-rule-id]` (error)
- [ ] **[PREFIX]-02** [Verifiable rule] — [Tool]: `[published-rule-id]` (warn)

#### [Group 2 — e.g. Configuration & secrets]

- [ ] **[PREFIX]-03** [Verifiable rule] — grep (error)
- [ ] **[PREFIX]-04** [Generated artefacts and credentials are git-ignored] — `git check-ignore` (error)

<!-- OPTIONAL clarifying note. Use it when a sibling guardrail holds the  -->
<!-- opposite rule, so nobody carries it over by inertia.                -->
<!-- Real example from the Cypress guardrail:                            -->
<!--   > Arrow functions ARE correct in Cypress step definitions: there  -->
<!--   > is no this-bound World. Do not carry over the opposite rule.    -->

---

### Semantic rules (AI / human review)

<!-- Prose with an id and NO severity: the id lets a reviewer cite the   -->
<!-- rule ("fails <PREFIX>-17"); a severity would be a lie, since no tool -->
<!-- reports it. The sequence continues from the deterministic layer.    -->
<!--                                                                    -->
<!-- MANDATORY line format:                                              -->
<!--   - [ ] **<PREFIX>-NN** <rule requiring judgement>.                 -->
<!--                                                                    -->
<!-- This is where intent, domain language, coverage, meaning-based       -->
<!-- naming and sensitive data belong.                                   -->
<!--                                                                    -->
<!-- DESIGN TRICK: one concern usually splits across both layers.        -->
<!-- PRESENCE is deterministic, CORRECTNESS is semantic.                 -->
<!--   deterministic: "every scenario carries a run-level tag" (grep)    -->
<!--   semantic:      "the tag matches the scenario's real scope"        -->

- [ ] **[PREFIX]-05** [Rule requiring judgement about meaning].
- [ ] **[PREFIX]-06** [Rule about coverage or intent].
- [ ] **[PREFIX]-07** [No credentials or personal data are committed in [artefacts]].

## Minimum expected structure

<!-- The minimum that must exist to comply: a tree and at most 2-3 SHORT -->
<!-- snippets chosen by error density — the fragment where the most      -->
<!-- breaches concentrate.                                               -->
<!--                                                                    -->
<!-- Do NOT include full templates, CI pipelines or advanced cases: that -->
<!-- lives in the skill, and their absence is what keeps the guardrail    -->
<!-- light.                                                              -->

```[yaml|typescript|json]
[minimum structure or canonical snippet]
```

## How to run the validation

<!-- Commands that run as written, copyable without editing.             -->
<!--                                                                    -->
<!-- If a published ruleset exists, cite and link it.                    -->
<!-- If it does NOT exist, DEFINE it here (the full config block): it is  -->
<!-- the only thing that makes the deterministic layer operational.      -->
<!--                                                                    -->
<!-- Every check you define prints the rule id VERBATIM on failure       -->
<!-- (`FAIL <PREFIX>-03: …`, `name: '<PREFIX>-01'` in a dependency-      -->
<!-- cruiser rule, the message prefix of a no-restricted-syntax entry).  -->
<!-- That is what keeps the output greppable by id.                      -->

```bash
[command 1]            # [PREFIX]-01 … [PREFIX]-02 — what it checks
[command 2]

# grep-level checks — each prints its rule id on failure
[grep / git check-ignore / node -e "…"]   # [PREFIX]-03
```

<!-- ================================================================== -->
<!-- BEFORE PUBLISHING, VERIFY FOR REAL — not by inspection:            -->
<!--                                                                    -->
<!-- 1. Do the published rules you cite EXIST in the current version of  -->
<!--    the plugin/ruleset? Check it, do not recall it.                  -->
<!-- 2. If you cite a preset, does it actually enable the rules you      -->
<!--    require? A "recommended" preset usually enables far less than    -->
<!--    its name suggests. Declare whatever it leaves out explicitly.    -->
<!-- 3. Run the config against TWO fixtures:                             -->
<!--      - one with a violation per rule -> all of them must fire;      -->
<!--      - the canonical snippet from THIS document -> must report 0.   -->
<!--    If the canonical one fails, two of your rules contradict.        -->
<!-- 4. Check the tool's minimum version and state it.                   -->
<!-- ================================================================== -->

## Verification

| Level | Action |
|-------|--------|
| Deterministic | [The commands above finish with zero errors and print no `[PREFIX]-NN` id.] |
| Semantic | [Review the semantic checklist against the diff (AI or human) and attach the result to the PR.] |

## Source of truth

<!-- A guardrail SUMMARISES. Name the authoritative source and say which -->
<!-- one wins on disagreement. If this guardrail IS the norm itself and   -->
<!-- summarises nothing, delete the whole section rather than inventing   -->
<!-- a source.                                                           -->

This guardrail **summarises** [scope]. The authoritative expansion — [what is left
out: setup, templates, CI, advanced cases] — lives in [path or URL]. Where this
file and [source] disagree, [source] prevails.

<!-- Optional, when the guardrail belongs to a family:                   -->
<!-- See also: [guardrails/[family]/README.md](README.md) — two-layer     -->
<!-- validation model.                                                   -->
