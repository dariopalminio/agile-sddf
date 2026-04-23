---
alwaysApply: false
---
**Título**: Release 06 — Release & Story Generator
**Versión**: 1.0
**Estado**: Completed
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
- [x] **FEAT-028 — Generar releases desde project-plan:** Skill `releases-from-project-plan` crea `release-[ID]-[Nombre].md` usando template release-spec-template.md.
- [x] **FEAT-029 — Generar stories desde archivo de release:** Skill `release-generate-stories` crea `story-[ID]-[Nombre-kebab].md` desde el archivo de release indicado y usando template story-gherkin-template.md se deben crear las historias en el directorio de historias docs\specs\stories. El usuario puede introducir como input el nombre del archivo de release o la ruta relativa del archivo release (docs\specs\releases\nombre-de-archivo-release.md).
- [x] **FEAT-035: Generar todas las stories desde todos los archivo de release**: Skill `release-generate-all-stories` que itera sobre todos los archivos de release en `docs/specs/releases/` y genera las stories correspondientes para cada uno, siguiendo el mismo proceso que `release-generate-stories`.
- [x] **FEAT-036: Skill openspec-init-config** Skill `openspec-init-config` para cargar el contexto del proyecto para openspec en el archivo openspec\config.yaml.
- [ ] **FEAT-037: Skill openspec-generate-baseline** Skill `openspec-generate-baseline` para que haciendo ingeniería inversa genere una línea base del proyecto como propuesta y luego lo archive para que quede una lìnea base especificada.
