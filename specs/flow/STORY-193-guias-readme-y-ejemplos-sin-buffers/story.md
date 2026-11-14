---
alwaysApply: false
type: story
id: STORY-193
kind: chore
slug: STORY-193-guias-readme-y-ejemplos-sin-buffers
title: "Guías, README y ejemplos sin buffers"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-14
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-187-dominio-y-requisitos-sin-buffers
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Guías, README y ejemplos sin buffers

**Como** Solo Builder que aprende agile-sddf con sus guías, su README y los ejemplos de los skills  
**Quiero** que las guías de `docs/guides/`, `docs/architecture/sdcl-sddf.md`, el diagrama de relaciones del flujo de story, `README.md`, el indicador de `docs/product/objectives.md` y los ejemplos y fixtures de `memory-system`, `story-design`, `story-tasking` y `story-fix-plan` (este último también en su `evals.json`) muestren los workflows sin buffers  
**Para** no aprender un estado que el framework ya no escribe

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Solo quedan las menciones permitidas
```gherkin
Dado que STORY-186 a STORY-192 están completadas
Cuando se ejecuta grep -rnE "READY-FOR-(IMPLEMENT|DEV)" skills docs README.md
Entonces solo devuelve los registros históricos (ADR-0003, ADR-0006, ADR-0008 y las propuestas fechadas de "docs/product/roadmap.md")
  Y el ADR nuevo
  Y las menciones del valor legado de la ventana de transición en los gates de entrada de los ejecutores, "epic-analyze", "skill-preflight" y sus evals
```

### AC-2 — Escenario con datos – Cada artefacto muestra el workflow del ADR
```gherkin
Escenario: Artefacto sin buffers
  Dado el artefacto "<artefacto>"
  Cuando el lector sigue el flujo de una historia
  Entonces ve "<flujo>"
Ejemplos:
  | artefacto                                                                    | flujo                                                                 |
  | docs/guides/process-for-story-implement.md                                   | PLAN/DONE como entrada y IMPLEMENT/TODO como destino del rework        |
  | docs/guides/sddf-commands-pipeline.md                                        | story-analyze → PLAN/DONE → story-implement, sin estado intermedio      |
  | docs/guides/process-for-epic-development.md                                  | la aprobación del PO como PLAN/DONE de la épica                        |
  | docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid | los tres gates vuelven a IMPLEMENT/TODO                               |
  | README.md                                                                    | el workflow de historia del ADR                                       |
```

### AC-3 — Escenario alternativo – Fixtures y evals siguen pasando
```gherkin
Dado los fixtures de "skills/memory-system/examples/" y los ejemplos de "story-design", "story-tasking" y "story-fix-plan" con "READY-FOR-IMPLEMENT"
  Y los casos de "skills/story-fix-plan/evals/evals.json" que lo nombran
Cuando se reemplazan por los estados del ADR
Entonces "npm test" y "npm run verify:repository" pasan sin errores
  Pero ningún caso de prueba pierde la condición que verificaba
```

### AC-4 — Escenario alternativo – Indicador de producto confirmado por el PO
```gherkin
Dado el indicador de "docs/product/objectives.md" que mide un "WIP configurable" de los buffers
Cuando se reescribe sin buffers
Entonces mide la cola de listos como consulta (primero IMPLEMENT/TODO, después PLAN/DONE) o la redacción que confirme el PO
  Pero la historia no se cierra sin la confirmación del PO
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Registros históricos intactos:** `CHANGELOG.md`, ADR-0003, ADR-0006, ADR-0008, las propuestas fechadas de `docs/product/roadmap.md` y `specs/flow/archive/` no se editan.

- **CNF-2 — Diagrama válido:** el `.mermaid` editado sigue renderizando sin errores de sintaxis.

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Los documentos de dominio, `state-machine.md` y los requisitos: STORY-187.
- Los `SKILL.md`, README, ejemplos y evals de los skills que cambian de comportamiento (`story-analyze`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `epic-analyze`, `epic-refine`, `epic-generate-all-stories`, `skill-preflight`): los actualiza la historia que cambia cada skill.
- Los destinos de runtime (`.agents/skills/`, `.claude/skills/`), que se regeneran desde `skills/`.

## 📎 Notas / contexto adicional

- Cierra el criterio de salida **CS-6** de EPIC-029 y cubre la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`. Va al final de la épica, porque el `grep` de AC-1 depende de las demás historias.
- Archivos afectados (2026-11-13): `docs/guides/process-for-epic-development.md`, `process-for-story-implement.md`, `sddf-commands-pipeline.md` y `specs-and-workflows.md`; `docs/architecture/sdcl-sddf.md`; `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid`; `README.md`; `docs/product/objectives.md:112`; `skills/story-specify/README.md`; los once `story.md` de `skills/memory-system/examples/`; `skills/story-design/examples/input/story.md`; `skills/story-tasking/examples/input/story.md`; `skills/story-fix-plan/examples/example-coherente/design.md` y `tasks.md`; `skills/story-fix-plan/evals/evals.json`.
- La épica atribuye a esta historia todo lo que no toque otra historia, incluido `skills/story-specify/README.md`. Al implementarla, repetir el `grep` para encontrar las menciones que queden.
- El fixture `specs-3-levels` de `memory-system` usa el layout anterior (`docs/specs/03-stories/`): solo cambia su `status`, no su layout.
