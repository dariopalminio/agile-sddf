---
type: requirement
kind: non-functional
id: NFR-006
slug: NFR-006-control-de-ciclo-de-vida-con-status-substatus
title: "Control de ciclo de vida con `status` + `substatus`"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-006 — Control de ciclo de vida con `status` + `substatus`

## Descripción

El ciclo de vida de un artefacto SHALL trazarse con dos ejes ortogonales en el
frontmatter —`status` (etapa del pipeline) y `substatus` (progreso dentro de la etapa:
`TODO` | `IN-PROGRESS` | `DONE` | `BLOCKED`)— y nunca con versiones numéricas. Los estados
canónicos por nivel están definidos en `[[state-machine]]`: story
(`SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE →
DELIVER → COMPLETED`), épica (`DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP →
COMPLETED`) y proyecto (solo `substatus`).

## Criterios de verificación

Todo `story.md` y `epic.md` declara `status` y `substatus` con
valores pertenecientes a la máquina de estados de su nivel.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.4 Máquina de estados y control de flujo
