---
type: wiki
slug: specs-index
title: "Especificación viva"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-11-18
---

# Especificación viva (`specs/`)

**Propósito:** fuente de verdad vigente del sistema — responde *¿qué comportamiento está en vigor?*
Es una de las cuatro raíces hermanas del layout fijo (ADR-0023), junto a `docs/` (conocimiento),
`changes/` (flujo de cambios) y `workflow/` (proceso).

`specs/` no contiene work items: las épicas, las historias y su archivo viven en `changes/`. Consultar
una historia, incluso completada, no equivale a consultar la especificación viva.

**Estado:** ADR-0023 fija la ubicación, pero no el formato de la especificación viva ni la
consolidación desde las historias. Las propuestas ADR-0018 (Gherkin en archivos `.feature`) y
ADR-0020 (contratos OpenAPI/AsyncAPI) siguen en discusión. Hasta que se decida, este directorio solo
contiene este índice.

La visión, stakeholders, objetivos y roadmap viven en `docs/product/`; los requisitos, en
`docs/requirements/`, que no se mueve: si migra a la especificación viva, su destino será `specs/`.

Volver al mapa: [[index]].
