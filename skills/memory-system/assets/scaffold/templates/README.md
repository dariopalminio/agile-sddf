---
type: wiki
slug: templates-index
title: "Plantillas"
status: IN-PROGRESS
substatus: TODO
parent: null
created: {date}
updated: {date}
---

# Plantillas (`templates/`)

**Propósito:** capa de meta-artefactos — plantillas con las que se generan los demás artefactos
de la memoria (ADR-0007). Vida muy larga.

**Convención de nombres:** `<tipo>-template.md` en kebab-case. Las nueve plantillas base son
`story-template.md`, `epic-template.md`, `project-template.md`, `project-intent-template.md` y
`project-plan-template.md` (copiadas desde el skill dueño de cada una), más `adr-template.md`,
`domain-template.md`, `guardrail-template.md` y `policy-template.md`, que no tienen skill dueño
y se distribuyen desde la semilla.

**Regla:** los wikilinks de una plantilla son placeholders; por eso `templates/` no se indexa.
Todo campo declarado en una plantilla nombra al skill que lo escribe; las de autoría manual
anotan `escritor: autoría manual` (ADR-0012).

Volver al mapa: [[index]].
