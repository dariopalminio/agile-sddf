---
type: requirement
kind: functional
id: FR-046
slug: FR-046-gestion-de-estados-a-lo-largo-del-workflow
title: "Gestión de estados a lo largo del workflow"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-046 — Gestión de estados a lo largo del workflow

## Descripción

Cada skill del workflow SHALL actualizar los campos `status` y `substatus` del
frontmatter de `story.md` al iniciar y al terminar, conforme a la máquina de estados canónica.
Los sub-skills invocados por un orquestador (`story-design`, `story-tasking`,
`story-testcases`) NO SHALL modificar `story.md`: solo producen su artefacto. Las transiciones
a `DELIVER` y `COMPLETED` SHALL ser manuales o disparadas por CI/CD, nunca escritas por un skill.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-006
- **Fuente**: STORY-062, STORY-069 · EPIC-12, EPIC-13 · ADR-0003
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
