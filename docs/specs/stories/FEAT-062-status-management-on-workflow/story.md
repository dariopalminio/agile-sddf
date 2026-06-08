---
alwaysApply: false
type: story
id: FEAT-062
slug: FEAT-062-status-management-on-workflow
title: "Status Management on Workflow"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]

# 📖 Historia: Status Management on Workflow

**Como** developer que usa el flujo SDD con múltiples historias en progreso simultáneo  
**Quiero** que los skills del workflow (`story-refine`, `story-plan`, `story-analyze`, `story-implement`) actualicen automáticamente los campos `status` y `substatus` del frontmatter de `story.md` al inicio y al final de cada fase, y que `story-implement` marque la historia como completada en el checklist del `release.md` padre  
**Para** conocer en qué etapa del ciclo de vida se encuentra cada historia sin tener que revisar manualmente qué artefactos existen en el directorio

## ✅ Criterios de aceptación

### Escenario principal – Flujo completo de estados desde refinamiento hasta implementación

```gherkin
Dado que existe una historia "FEAT-062/story.md" con status: BACKLOG / substatus: TODO
Cuando ejecuto "/story-refine" sobre esa historia
Entonces "story.md" tiene status: SPECIFY / substatus: IN-PROGRESS
  Y al aprobar FINVEST "story.md" tiene status: READY-FOR-PLAN / substatus: DONE
Cuando ejecuto "/story-plan FEAT-062"
Entonces "story.md" tiene status: PLANNING / substatus: IN-PROGRESS
  Y al finalizar "story-analyze" sin ERROREs "story.md" tiene status: READY-FOR-IMPLEMENT / substatus: DONE
Cuando ejecuto "/story-implement FEAT-062"
Entonces "story.md" tiene status: IMPLEMENT / substatus: IN-PROGRESS antes de la primera tarea
  Y al finalizar todas las tareas "story.md" tiene status: READY-FOR-CODE-REVIEW / substatus: DONE
```

### Escenario alternativo / error – story-implement bloqueado si el planning no está completo

```gherkin
Dado que "FEAT-062/story.md" tiene status: PLANNING / substatus: IN-PROGRESS
  Y "story-analyze" reportó al menos un ERROR en el análisis
Cuando ejecuto "/story-implement FEAT-062"
Entonces veo el mensaje "❌ La historia FEAT-062 no está en estado READY-FOR-IMPLEMENT/DONE"
  Y el mensaje incluye el estado actual y sugiere ejecutar "/story-plan"
  Pero no se implementa ninguna tarea
```

### Escenario alternativo / error – story-analyze con ERROREs no avanza el estado

```gherkin
Dado que "FEAT-062/story.md" tiene status: PLANNING / substatus: IN-PROGRESS
Cuando ejecuto "/story-analyze FEAT-062"
  Y el análisis detecta inconsistencias de tipo ERROR (TIPO A o TIPO B)
Entonces "story.md" permanece en status: PLANNING / substatus: IN-PROGRESS
  Y "analyze.md" es generado con las inconsistencias documentadas
  Pero no se actualiza el estado a READY-FOR-IMPLEMENT/DONE
```

### Escenario principal – Actualización del checklist en release.md al completar implementación

```gherkin
Dado que "FEAT-062/story.md" tiene parent: EPIC-12-story-sdd-workflow
  Y "release.md" de EPIC-12 contiene "- [ ] FEAT-062"
Cuando "/story-implement" finaliza todas las tareas
  Y "story.md" se actualiza a status: READY-FOR-CODE-REVIEW / substatus: DONE
Entonces "release.md" de EPIC-12 contiene "- [x] FEAT-062"
```

### Escenario alternativo / error – release.md no encontrado, implementación no se bloquea

```gherkin
Dado que "FEAT-062/story.md" tiene parent: EPIC-99-inexistente
Cuando "/story-implement" finaliza todas las tareas
  Y "story.md" se actualiza a status: READY-FOR-CODE-REVIEW / substatus: DONE
Entonces se emite el mensaje "⚠️ No se pudo actualizar el release checklist"
  Y "implement-report.md" registra el WARNING con la razón
  Pero la transición a READY-FOR-CODE-REVIEW/DONE se aplica correctamente
```

### Scenario Outline – Transiciones de estado por skill del workflow

```gherkin
Escenario: Transición de estado al iniciar cada skill
  Dado que "story.md" está en "<estado_previo>"
  Cuando ejecuto "<skill>"
  Entonces "story.md" cambia a "<estado_resultante>"
Ejemplos:
  | skill            | estado_previo          | estado_resultante        |
  | /story-refine    | BACKLOG/TODO           | SPECIFY/IN-PROGRESS   |
  | /story-refine    | SPECIFY/IN-PROGRESS | SPECIFY/IN-PROGRESS   |
  | /story-plan      | READY-FOR-PLAN/DONE         | PLANNING/IN-PROGRESS     |
  | /story-plan      | READY-FOR-IMPLEMENT/DONE           | PLANNING/IN-PROGRESS     |
  | /story-implement | READY-FOR-IMPLEMENT/DONE           | IMPLEMENT/IN-PROGRESS |
```

## ⚙️ Criterios no funcionales

* **Atomicidad:** la actualización de estado ocurre en el mismo paso en que el skill escribe o verifica el archivo; no en batch al final
* **Backwards compatibility:** historias existentes sin `status` en frontmatter son tratadas como `BACKLOG/TODO`; el campo se agrega al actualizarse por primera vez
* **Sin bloqueo por release.md:** la ausencia o desalineación del `release.md` padre emite un WARNING pero no impide la transición a `READY-FOR-CODE-REVIEW/DONE`

## 📎 Notas / contexto adicional

La máquina de estados canónica es:
```
BACKLOG/TODO → SPECIFY/IN-PROGRESS → READY-FOR-PLAN/DONE
             → PLANNING/IN-PROGRESS → READY-FOR-IMPLEMENT/DONE
             → IMPLEMENT/IN-PROGRESS → READY-FOR-CODE-REVIEW/DONE
```

Skills NO afectados por transiciones de estado propias: `story-design`, `story-tasking`, `story-split`, `story-evaluation` — sus transiciones son gestionadas por sus orquestadores (`story-refine` y `story-plan`).

La actualización `PLANNING/IN-PROGRESS` de `story-plan` es incondicional: se aplica al iniciar el pipeline independientemente del estado previo de la historia, permitiendo re-ejecuciones sin fricción.
