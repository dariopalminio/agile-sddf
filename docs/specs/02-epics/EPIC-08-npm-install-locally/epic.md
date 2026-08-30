---
type: epic
id: EPIC-08
slug: EPIC-08-npm-install-locally
title: "Release 08 — Npm Install locally"
date: 2026-04-20
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 08 — Npm Install locally

## Descripción
Permitir instalación de agile-sddf localmente desde npm, con npm install agile-sddf en el proyecto, copiando los skills y agentes a `./.claude/` para uso en proyectos específicos sin afectar la instalación global. Esto permitirá a los desarrolladores usar el framework en proyectos específicos sin necesidad de instalarlo globalmente, facilitando la gestión de dependencias y evitando conflictos entre proyectos.

## Historias
- [x] **STORY-041: Npm Install locally** — Permitir instalación local del framework con npm install @sddf/core, copiando los skills y agentes a `./.claude/` para uso en proyectos específicos sin afectar la instalación global. _(deps: STORY-039, STORY-040)_
- [x] **STORY-041: Exclude openspec files** — Excluir archivos de especificación abierta (openspec) de la instalación local para evitar conflictos y mantener la instalación limpia. _(deps: STORY-039, STORY-040)_





