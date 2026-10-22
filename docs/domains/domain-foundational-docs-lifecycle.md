---
type: domain
slug: domain-foundational-docs-lifecycle
title: "Documentación del Dominio: Ciclo de Vida de la Documentación Fundacional (Foundational Docs Lifecycle)"
status: active
supersedes: domain-project-lifecycle
---

# Documentación del Dominio: Ciclo de Vida de la Documentación Fundacional (Foundational Docs Lifecycle)

> **Bounded Context:** Foundational Docs Lifecycle  
> **Nivel:** Estratégico — documentación, no work item  
> **Dominio transversal:** [[domain-state-management]]  
> **Fuente canónica:** [[state-machine]]

## 1. Visión General

Este dominio gobierna la producción de visión, stakeholders, requisitos y roadmap mediante etapas con gate humano. Sus actores son PO/PM, equipo y `/project-flow`, que compone las etapas sin convertirse en escritor de estados.

## 2. Lenguaje Ubicuo (Glosario)

- **Documento fundacional:** archivo vivo de `product/` o `requirements/`.
- **Etapa:** `Begin`, `Discovery` o `Planning`.
- **Visión cerrada:** `product/vision.md` con `substatus: DONE`.
- **Requisito:** `FR-NNN` o `NFR-NNN`.
- **Roadmap planificado:** `product/roadmap.md` con una `## Propuesta (` o una línea `EPIC-NN` en `## Épicas`.
- **Propuesta:** sección fechada append-only del roadmap.

## 3. Modelo Táctico

No existe un agregado Project ni una identidad `PROJ-NN`. `FoundationalDocument` se identifica por su ruta; `Requirement` por `FR-NNN` o `NFR-NNN`; `StageSignal` es un objeto de valor. No hay `status` de pipeline ni WIP para esta documentación.

## 4. Pipeline de Etapas

```mermaid
flowchart LR
  Begin --> Discovery --> Planning
```

Cada etapa tiene un gate humano en su skill correspondiente.

## 5. Tabla de Fases y Documentos

| Etapa | Skill | Entrada | Salida |
|---|---|---|---|
| Begin | `/project-begin` | conversación con el usuario | `product/vision.md` |
| Discovery | `/project-discovery` (o `/reverse-engineering`) | `product/vision.md` en `DONE` (no aplica a `/reverse-engineering`) | `product/stakeholders.md` y `requirements/` (un `FR-NNN-*.md`/`NFR-NNN-*.md` por requisito) |
| Planning | `/project-planning` | ≥ 1 FR en `requirements/` | `product/roadmap.md` (propuesta fechada) |

## 6. Señales de Avance

La primera condición pendiente gana: visión ausente o no `DONE` → Begin; `FR_COUNT = 0` → Discovery; roadmap no planificado → Planning; en otro caso el flujo está completo. `vision.md` usa `TODO`/`IN-PROGRESS`/`DONE`; stakeholders y roadmap conservan el substatus de su template, sin gobernar el pipeline; los requisitos usan `status: active`.

## 7. Invariantes

1. Una raíz `docs/` representa un producto; el caso multi-proyecto queda fuera de alcance.
2. `/project-discovery` exige visión `DONE`.
3. `/project-planning` exige al menos un FR.
4. Nada se sobrescribe sin staging y confirmación.
5. Los IDs de requisito no se reutilizan y las propuestas del roadmap no se editan.
6. `/project-flow` compone las etapas y no escribe `substatus`.

## 8. Gates de Calidad

| Gate | Responsable | Evidencia |
|---|---|---|
| Visión | `/project-begin` | visión confirmada |
| Requisitos | `/project-discovery` | confirmación o cancelación |
| Propuesta | `/project-planning` | propuesta fechada aprobada |
| Avance | `/project-flow` | `Continuar con` o `Detener aquí` |

## 9. Trazabilidad y Persistencia

Las historias declaran `implements: [FR-NNN]`; el roadmap vincula las épicas al nivel estratégico y `/epic-from-project-plan` lee su última propuesta.

## 10. Fuentes de Verdad

- [[state-machine]]
- `header-aggregation/SKILL.md`
- [[asegurar-dos-niveles-de-flujo-epics-stories]]

## 11. Referencias Cruzadas

- [[domain-work-item-hierarchy]]
- [[domain-epic-lifecycle]]
- [[domain-project-lifecycle]] — predecesor histórico
