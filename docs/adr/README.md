---
type: wiki
slug: adr-index
title: "Índice de Architecture Decision Records (ADRs)"
date: 2026-06-12
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
---

# 📐 Architecture Decision Records (ADRs)

> Registro de decisiones transversales de arquitectura y diseño del proyecto.
> Complementa los otros dos niveles de registro de decisiones del framework:
> decisiones de **historia** viven en el `design.md` de la historia (`docs/specs/03-stories/STORY-NNN-<slug>/design.md`),
> y decisiones de **cambio OpenSpec** en el `design.md` del change (`openspec/changes/`).

---

## ¿Cuándo escribir un ADR?

Escribe un ADR cuando la decisión:

- Afecta a **más de un skill o módulo** del framework
- **Restringe decisiones futuras** (establece un patrón, convención o contrato que otros deben seguir)
- Resuelve un trade-off arquitectónico con alternativas reales descartadas

Si la decisión afecta a una sola historia, regístrala en la sección `## Decisions` de su `design.md` — no crees un ADR.

---

## Convención

- **Nombre de archivo:** `ADR-NNNN-slug-kebab.md` (numeración secuencial de 4 dígitos)
- **Template:** [adr-template.md](adr-template.md) — copiarlo y completar todas las secciones
- **Inmutabilidad:** un ADR `ACCEPTED` no se edita. Si la decisión cambia, se crea un ADR nuevo que lo reemplaza y se actualiza el campo `superseded-by` del antiguo (único cambio permitido).
- **Estados:**

| Estado | Significado |
|--------|-------------|
| `PROPOSED` | En discusión, aún no vinculante |
| `ACCEPTED` | Vigente — los agentes y el equipo deben respetarla |
| `DEPRECATED` | Ya no aplica (el contexto desapareció), sin reemplazo |
| `SUPERSEDED` | Reemplazada por otro ADR (ver `superseded-by`) |

---

## Índice de ADRs

| ID | Título | Estado | Fecha |
|----|--------|--------|-------|
| [ADR-0001](ADR-0001-centralizar-templates-compartidos.md) | Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` | ACCEPTED | 2026-06-12 |
| [ADR-0002](ADR-0002-invocacion-agentes-locales-de-skill.md) | Contrato de invocación de agentes locales de skill | ACCEPTED | 2026-06-12 |
| [ADR-0003](ADR-0003-workflow-canonico-story-y-epic.md) | Workflows canónicos de Story y Epic en el pipeline SDDF | ACCEPTED | 2026-06-14 |
| [ADR-0004](ADR-0004-nivel-l2-epic-y-directorios-numerados.md) | El nivel L2 es una épica, y los niveles viven en directorios numerados | ACCEPTED | 2026-08-29 |
| [ADR-0005](ADR-0005-prefijo-story-para-el-nivel-l1.md) | El ID del nivel L1 se prefija con `STORY`; el tipo de trabajo vive en el campo `kind` | ACCEPTED | 2026-08-29 |
