# epic-from-project-plan

> **Type:** skill · **Category:** orchestrator · **Status:** stable

## What it does

Lee la última `## Propuesta (...)` de `$SPECS_BASE/product/roadmap.md` y materializa una especificación `epic.md` por cada épica. Numera desde el mayor ID existente, comprueba colisiones por slug y valida cada resultado.

**Produces:** directorios `$SPECS_BASE/specs/epics/EPIC-NN-nombre/` (o la ruta de épicas vigente) y sus `epic.md` validados.

**Does not do:** no crea ni modifica `roadmap.md`.

## When to use

Úsalo cuando el roadmap tenga una propuesta confirmada que necesite convertirse en épicas. Para crear una sola épica manualmente, usa `[[epic-creation]]`.

## Invocation

Usa `/epic-from-project-plan`.
