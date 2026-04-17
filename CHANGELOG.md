# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

## [1.1.0] — 2026-04-09 — features-spec-builder

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
