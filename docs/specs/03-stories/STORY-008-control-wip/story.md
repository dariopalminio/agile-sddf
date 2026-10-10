---
type: story
id: STORY-008
kind: feat
slug: STORY-008-control-wip
title: "Control WIP=1 ï¿½ Detecciï¿½n de proyecto activo"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## ?? Historia: Control WIP=1 ï¿½ Detecciï¿½n de proyecto activo

**Como** developer que usa el framework SDDF para gestionar proyectos de software
**Quiero** que el framework detecte automï¿½ticamente si ya existe un proyecto en estado INâ€‘PROGRESS antes de iniciar uno nuevo
**Para** evitar tener mï¿½ltiples proyectos activos simultï¿½neos y mantener el foco en un ï¿½nico proyecto a la vez

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Bloqueo al intentar iniciar un segundo proyecto activo
```gherkin
Dado que existe "docs/specs/projects/project-intent.md" con Estado: INâ€‘PROGRESS
Cuando el desarrollador ejecuta el skill "project-begin" para iniciar un nuevo proyecto
Entonces el skill detecta el Estado: INâ€‘PROGRESS en el archivo existente
  Y muestra el mensaje de conflicto WIP indicando que ya hay un proyecto activo
  Pero no sobrescribe ni modifica el proyecto existente
```

### Escenario alternativo / error ï¿½ No hay proyecto activo
```gherkin
Dado que no existe ningï¿½n archivo con Estado: INâ€‘PROGRESS en "docspecs/projects/t/"
Cuando el desarrollador ejecuta el skill "project-begin"
Entonces el skill procede normalmente sin mostrar advertencia de WIP
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-02-project-spec-builder.md
Feature origen: STORY-008 ï¿½ Control WIP=1
