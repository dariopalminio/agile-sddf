---
type: story
id: FEAT-015
slug: FEAT-015-project-flow
title: "project-flow � Orquestador del pipeline completo ProjectSpecFactory"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-05-enhance-project-spec
---

<!-- Referencias -->
[[EPIC-05-enhance-project-spec]]

# Historia de Usuario

## ?? Historia: project-flow � Orquestador del pipeline completo ProjectSpecFactory

**Como** developer que quiere especificar un proyecto completo de principio a fin
**Quiero** ejecutar el skill `project-flow` para que el framework ejecute autom�ticamente las tres fases (Begin ? Discovery ? Planning) en una sola sesi�n continua
**Para** obtener los tres artefactos (project-intent.md, requirement-spec.md, project-plan.md) en una sesi�n sin tener que invocar cada skill individualmente

## ? Criterios de aceptaci�n

### Escenario principal � Ejecuci�n completa del pipeline en sesi�n continua
```gherkin
Dado que no existe ning�n artefacto previo del proyecto en "docspecs/projects/t/"
Cuando el desarrollador ejecuta el skill "project-flow"
Entonces el skill ejecuta "project-begin" con gate de revisi�n humana antes de continuar
  Y ejecuta "project-discovery" usando project-intent.md con gate de revisi�n antes de continuar
  Y ejecuta "project-planning" usando requirement-spec.md con gate de revisi�n al finalizar
  Y al terminar existen los tres artefactos con Estado: Ready en "docs/specs/projects/"
```

### Escenario alternativo � Pipeline reanudado desde el estado actual
```gherkin
Dado que existe "project-intent.md" con Estado: Ready pero no existe "requirement-spec.md"
Cuando el desarrollador ejecuta el skill "project-flow"
Entonces el skill detecta el estado actual y reanuda desde la fase "project-discovery"
  Y no repite la fase "project-begin" ya completada
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-05-enhance-project-spec.md
Feature origen: FEAT-015 � project-flow
