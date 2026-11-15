---
type: architecture
slug: sdcl-sddf
title: "Correspondencia SDLC clásico ↔ SDDF"
---

<!-- Referencias -->
[[state-machine]]

# Correspondencia SDLC clásico ↔ SDDF

> **La máquina de estados canónica vive en [[state-machine]]**: allí están el modelo de `status` + `substatus`, los diagramas por nivel (story, project, épica), la tabla de estados y la tabla de transiciones por skill. Este documento cubre solo una cosa que aquel no: cómo se mapean las fases del SDLC clásico sobre los estados de SDDF.

Un equipo que llega desde un proceso SDLC tradicional reconoce sus seis fases; SDDF las descompone en estados más finos para que cada uno tenga un gate y un dueño explícitos.

| Fase SDLC clásico | Estado(s) SDDF | Por qué se descompone |
|---|---|---|
| Requirement | `SPECIFY` | — |
| Design | `PLAN` | Agrupa diseño técnico, casos de prueba y tasking en un solo estado con tres artefactos. |
| Development | `IMPLEMENT` + `CODE-REVIEW` | La revisión es un gate independiente con su propio retroceso, no el final de la codificación. |
| Verification & Validation | `VERIFY` + `ACCEPTANCE` | Separa lo que verifica una máquina (pruebas automáticas) de lo que valida una persona (criterios de aceptación). |
| Deploy | `DELIVER` | — |
| Done / Maintenance | `COMPLETED` | — |

`CANCELED` no tiene equivalente en el SDLC clásico: es el terminal de una historia abandonada sin entregar. Entre el diseño y la codificación no hay un estado de cola. `PLAN/DONE` significa lista para implementar, y la cola de listos es una consulta ([[workflows-sin-estados-buffer]], ADR-0022).

Para el detalle de cada estado, sus actores y sus transiciones, ver [[state-machine]].
