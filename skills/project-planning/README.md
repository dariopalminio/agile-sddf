# project-planning

> **Type:** skill · **Category:** orchestrator · **Status:** stable

## What it does

Construye una propuesta de épicas desde requisitos funcionales y la agrega, solo tras `Confirmar`, a `$SPECS_BASE/product/roadmap.md` como una sección fechada append-only. `project-architect` escribe la propuesta en staging y el skill valida su contrato antes del gate.

**Inputs:** requisitos funcionales y no funcionales, visión, stakeholders, story map, roadmap existente y `roadmap-template.md`.

**Produces:** `$SPECS_BASE/product/roadmap.md` con `## Épicas` al crearse y una nueva `## Propuesta (<fecha>)` en cada planificación confirmada.

**Does not do:** no inicia discovery ni materializa directorios de épicas.

## When to use

Úsalo cuando haya al menos un requisito funcional y quieras planificar épicas, con o sin story map. Para materializar una propuesta ya confirmada, usa `[[epic-from-project-plan]]`.

## Invocation

Usa `/project-planning`.
