---
type: story
id: FEAT-008
slug: FEAT-008-control-wip
title: "Control WIP=1 � Detecci�n de proyecto activo"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## ?? Historia: Control WIP=1 � Detecci�n de proyecto activo

**Como** developer que usa el framework SDDF para gestionar proyectos de software
**Quiero** que el framework detecte autom�ticamente si ya existe un proyecto en estado IN‑PROGRESS antes de iniciar uno nuevo
**Para** evitar tener m�ltiples proyectos activos simult�neos y mantener el foco en un �nico proyecto a la vez

## ? Criterios de aceptaci�n

### Escenario principal � Bloqueo al intentar iniciar un segundo proyecto activo
```gherkin
Dado que existe "docs/specs/projects/project-intent.md" con Estado: IN‑PROGRESS
Cuando el desarrollador ejecuta el skill "project-begin" para iniciar un nuevo proyecto
Entonces el skill detecta el Estado: IN‑PROGRESS en el archivo existente
  Y muestra el mensaje de conflicto WIP indicando que ya hay un proyecto activo
  Pero no sobrescribe ni modifica el proyecto existente
```

### Escenario alternativo / error � No hay proyecto activo
```gherkin
Dado que no existe ning�n archivo con Estado: IN‑PROGRESS en "docspecs/projects/t/"
Cuando el desarrollador ejecuta el skill "project-begin"
Entonces el skill procede normalmente sin mostrar advertencia de WIP
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-02-project-spec-builder.md
Feature origen: FEAT-008 � Control WIP=1
