---
type: story
id: FEAT-004
slug: FEAT-004-project-planning
title: "project-planning � Planificaci�n de releases y backlog"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## ?? Historia: project-planning � Planificaci�n de releases y backlog

**Como** developer que tiene `requirement-spec.md` aprobado y necesita organizar el trabajo en releases
**Quiero** ejecutar el skill `project-planning` para que el agente architect extraiga features, las priorice y las agrupe en releases incrementales
**Para** obtener `$SPECS_BASE/specs/projects/project-plan.md` con el backlog organizado en releases FEAT-NNN, listo para comenzar el desarrollo sprint a sprint

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n exitosa de project-plan.md
```gherkin
Dado que existe "docs/specs/projects/project.md" con Estado: Ready
Cuando el desarrollador ejecuta el skill "project-planning"
Entonces el agente extrae features FEAT-NNN de los requisitos y las agrupa en releases incrementales
  Y genera "docs/specs/projects/project-plan.md" con Estado: Ready tras confirmaci�n del usuario
  Y el documento incluye la secci�n "## Propuesta de Releases" con bloques "### Release NN � Nombre"
```

### Escenario alternativo / error � requirement-spec.md no existe
```gherkin
Dado que "docs/specs/projects/project.md" no existe
Cuando el desarrollador ejecuta el skill "project-planning"
Entonces el skill muestra "No se encontr� requirement-spec.md. Ejecuta /project-discovery primero."
  Pero no genera ning�n plan de proyecto
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-02-project-spec-builder.md
Feature origen: FEAT-004 � project-planning
