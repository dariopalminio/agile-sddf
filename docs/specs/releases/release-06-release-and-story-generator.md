---
alwaysApply: false
---
**Título**: Release 06 — Release & Story Generator
**Versión**: 1.0
**Estado**: Ready
**Fecha**: 2026-04-20
---

# Release 06 — Release & Story Generator & Soporte Atlassian Rovo

## Descripción
Automatiza la creación de dos artefactos clave después del planning: el documento de release (a partir de `project-plan.md`) y las stories derivadas (a partir del release generado).

## Features
- [x] **FEAT-027 — Validación de formato de Release:** Crear un skill de validación del formato de una especificación de Release basado en release-spec-template.md, llamado release-format-validation.
- [x] **FEAT-032: Soporte Atlassian Rovo para Validar Release** — Agente `release-validator-agent.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)_
- [x] **FEAT-033: Soporte Atlassian Rovo para crear Epic Release** — Agente `release-creator-agent.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)_
- [x] **FEAT-034: Rovo Agent: Release Reverse Generator from children** — Agente `release-reverse-generator.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)
- [ ] **FEAT-028 — Generar releases:** Skill `releases-from-project-plan` crea `release-[ID]-[Nombre].md` usando template release-spec-template.md.
- [ ] **FEAT-029 — Generar stories:** Skill `release-generate-stories` crea `story-[ID]-[Nombre].md` desde el archivo de release y usando template story-gherkin-template.md.
