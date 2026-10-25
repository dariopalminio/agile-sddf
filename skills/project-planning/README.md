# project-planning

> **Type:** skill · **Category:** orchestrator · **Status:** stable

## What it does

Construye una propuesta de épicas desde requisitos funcionales y la agrega, solo tras `Confirmar`, a `docs/product/roadmap.md` como una sección fechada append-only. La sesión del skill escribe la propuesta en staging con su rol local `planning` y el skill valida su contrato antes del gate.

**Inputs:** requisitos funcionales y no funcionales, visión, stakeholders, story map, roadmap existente y `roadmap-template.md`.

**Produces:** `docs/product/roadmap.md` con `## Épicas` al crearse y una nueva `## Propuesta (<fecha>)` en cada planificación confirmada.

**Does not do:** no inicia discovery ni materializa directorios de épicas.

## When to use

Úsalo cuando haya al menos un requisito funcional y quieras planificar épicas, con o sin story map. Para materializar una propuesta ya confirmada, usa `[[epic-from-project-plan]]`.

## Invocation

Usa `/project-planning`.
