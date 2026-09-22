---
type: wiki
slug: guardrails-index
title: "Guardrails"
status: IN-PROGRESS
substatus: TODO
parent: null
created: {date}
updated: {date}
---

# Guardrails (`guardrails/`)

**Propósito:** restricciones verificables — checklists con severidad (`error` bloquea, `warn`
avisa) que hacen comprobable la constitución y las policies. Vida larga.

**Convención de nombres:** `<nombre>-checklist.md` para guardrails de contenido y
`dod-<nivel>-checklist.md` para guardrails de transición (por ejemplo la Definition of Done de una
historia).

**Regla:** todo guardrail declara la policy o el principio del que se origina (`originates-from`)
o justifica su ausencia; un guardrail con `enforcement: error` debe ser verificable de forma
determinista.

Volver al mapa: [[index]].
