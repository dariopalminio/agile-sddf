---
type: epic
id: EPIC-04
slug: EPIC-04-refactor-features-spec-builder
title: "Release 04 — Refactor Features Spec Builder (Consolidación y calidad)"
created: 2026-04-17
updated: 2026-04-17
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 04 — Refactor Features Spec Builder (Consolidación y calidad)

## Alcance

Release de consolidación y calidad. Se renombran skills para mayor consistencia semántica, se refuerza el skill de evaluación con restricciones de input más precisas, se mejoran los ejemplos de referencia (few-shot) y se añade soporte para el runtime Atlassian Rovo. Los cambios no agregan funcionalidad nueva sino que afilan las herramientas existentes para producir evaluaciones más precisas y reducir errores de uso.

## Historias
- [x] **STORY-007** — Renombrado `story-finvest-evaluation` → `story-evaluation` (mejora): Nombre más corto y descriptivo, alineado con la rúbrica FINVEST que ya documenta la dimensión F (Formato).
- [x] **STORY-007** — Restricciones de input en story-evaluation (mejora): Se añade gate explícito para imágenes adjuntas — el skill las ignora y solicita el texto de la historia en su lugar.
- [x] **STORY-007** — Mejora de ejemplos few-shot (mejora): `example-refinar.md` actualizado para representar con mayor fidelidad el caso de historia con formato parcial pero INVEST aceptable.
- [x] **STORY-030** — Soporte Atlassian Rovo expandido: Agente `story-creator-agent.md` actualizado para operar con el conjunto completo de skills (creation, evaluation, split) en el runtime Rovo.
- [x] **STORY-006** — Sincronización multi-runtime (mejora, junto con STORY-012): Skills de `story-creation` y `story-split` sincronizados entre `.claude/skills/`, `.agents/skills/` y `.github/skills/` para garantizar paridad entre runtimes.

## Criterios de salida
- [ ] [Por completar]

## Smoke tests
### SMOKE-1 — [Por completar]
```gherkin
Escenario: [Por completar]
  Dado [Por completar]
  Cuando [Por completar]
  Entonces [Por completar]
```

## Notas
### Ítems completados sin ID de historia

- [x] **Documentación actualizada**: README y CLAUDE.md revisados para reflejar la arquitectura definitiva del módulo de gestión de historias.
