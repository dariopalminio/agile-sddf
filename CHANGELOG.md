# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.3] — 2026-04-18

### Changed
- Clarified automatic rejection rule in `story-evaluation` to explicitly scope `INVE-T` as all INVEST dimensions except `S` (Small)
- Strengthened `story-product-owner` guidance with stricter story-writing checks:
  - Added explicit guardrails for a real, concrete user role in `Como`
  - Added explicit clarity criteria for `Quiero`
  - Expanded refinement guidance to include `DIVIDIR` decisions and separate weak cohesion from pure size issues

### Added
- Archived OpenSpec change `add-skill-story-refine` under `openspec/changes/archive/2026-04-18-add-skill-story-refine/` with full proposal/design/spec/tasks artifacts
- Promoted capability spec to `openspec/specs/story-refine-skill/spec.md`

---

## [1.3.2] — 2026-04-18

### Added
- Skill `/project-flow` as a single entry-point orchestrator for the full ProjectSpecFactory pipeline (`project-begin` → `project-discovery` → `project-planning`) in one interactive session
- Review gates between phases to enforce explicit confirmation and transition each output document from `**Estado**: Doing` to `**Estado**: Ready`
- Startup state detection logic in `project-flow` to resume from the appropriate phase based on existing outputs in `docs/specs/project/`
- Main OpenSpec capability spec for `project-flow-skill` at `openspec/specs/project-flow-skill/spec.md`

---

## [1.3.1] — 2026-04-17

### Changed
- Renamed skill `finvest-evaluation` → `story-finvest-evaluation` for consistency with the `story-` prefix convention used by sibling skills (`story-creation`, `story-split`)
  - Renamed directories in `.claude/skills/`, `.agents/skills/`, `.github/skills/`
  - Updated `name:` and heading in all three copies of `SKILL.md`
  - Updated all references in `story-creation`, `story-split`, `rovo/` agents, and `README.md`

### Added
- **Restricciones de entrada** section in `story-finvest-evaluation/SKILL.md`: el skill ahora ignora adjuntos de imagen (wireframes, screenshots) y evalúa únicamente el texto Markdown de la historia de usuario

---

## [1.3.0] — 2026-04-17 — Reverse Engineering

### Added
- Skill `reverse-engineering` (invocation: `/reverse-engineering`)
- Reverse-engineering agents to follow `reverse-engineer-<rol>` convention:
  - `reverse-engineer-architect.agent.md`
  - `reverse-engineer-business-analyst.agent.md`
  - `reverse-engineer-ux-flow-mapper.agent.md`
  - `reverse-engineer-product-discovery.agent.md`
  - `reverse-engineer-synthesizer.agent.md`

---

## [1.2.1]

### Changed
- Renamed agent files to follow `project-` prefix convention:
  - `architect.agent.md` → `project-architect.agent.md` (`name: project-architect`)
  - `product-manager.agent.md` → `project-pm.agent.md` (`name: project-pm`)
  - `ux-designer.agent.md` → `project-ux.agent.md` (`name: project-ux`)
- Renamed skill directories and commands to follow `project-` prefix convention:
  - `/ps-begin-intention` → `/project-begin-intention`
  - `/ps-discovery` → `/project-discovery`
  - `/ps-planning` → `/project-planning`
- Updated all skill invocations, agent cross-references, specs, and documentation to reflect new names

---

## [1.2.0] — 2026-04-16 — ProjectSpecFactory CLI

### Added
- **ProjectSpecFactory CLI pipeline** — three-skill workflow for project specification:
  - `/ps-begin-intention` — captures project intent and produces `docs/specs/project/project-intent.md`
  - `/ps-discovery` — conducts user discovery and produces `docs/specs/project/requirement-spec.md`
  - `/ps-planning` — generates prioritized release backlog and produces `docs/specs/project/project-plan.md`
- **Role-based agents** — three specialized agents replacing task-based agents:
  - `architect.agent.md` — technical architect for Specifying and Planning phases
  - `product-manager.agent.md` — PM for Begin Intention and Discovery phases
  - `ux-designer.agent.md` — UX Designer supporting Discovery phase
- **Skill templates** — `project-intent-template.md`, `requirement-spec-template.md`, `project-plan-template.md`
- **Gem prompts** — standalone prompt files for `ps-begin-intention`, `ps-discovery`, `ps-planning`
- **OpenSpec workflow** — `opsx:propose`, `opsx:apply`, `opsx:archive`, `opsx:explore` skills and commands
- **OpenSpec specs** — baseline specifications for all pipeline capabilities
- **Sample output documents** — `project-intent.md`, `requirement-spec.md`, `project-plan.md` for ProjectSpecFactory itself

---

## [1.1.0] — 2026-04-09 — Features-spec-builder

### Added
- **`/story-creation`** — creates a user story in story-gherkin format (Como/Quiero/Para + Gherkin) applying Mike Cohn, 3 C's, and INVEST principles
- **`/story-split`** — splits a large story into smaller independent stories using 8 splitting patterns
- **`/finvest-evaluation`** — evaluates story quality with the FINVEST rubric (Formato + INVEST) on a Likert 1–5 scale; produces per-dimension scores, global score, and Ready / Refine / Reject decision
- **`story-gherkin-template.md`** — canonical template shared across story skills
- **`output-template.md`** — evaluation output template for finvest-evaluation
- **Examples** — `example-ready.md`, `example-refinar.md`, `example-rechazar.md` for finvest-evaluation
- **Dockerization** — Docker support for local development
- **`CLAUDE.md`** — global project instructions
- **`skills-lock.json`** — skill dependency lock file
