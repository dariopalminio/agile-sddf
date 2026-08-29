---
type: story
id: FEAT-003
slug: FEAT-003-project-discovery
title: "project-discovery � Discovery de usuarios y especificaci�n de requisitos"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## ?? Historia: project-discovery � Discovery de usuarios y especificaci�n de requisitos

**Como** developer que tiene `project-intent.md` aprobado y necesita detallar los requisitos del sistema
**Quiero** ejecutar el skill `project-discovery` para completar la entrevista de especificaci�n con el agente architect
**Para** obtener `$SPECS_BASE/specs/projects/project.md` con usuarios, flujos, requisitos funcionales y no funcionales documentados, listo para la fase de planning

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n exitosa de requirement-spec.md
```gherkin
Dado que existe "docs/specs/projects/project-intent.md" con Estado: Ready
Cuando el desarrollador ejecuta el skill "project-discovery"
Entonces el agente conduce la entrevista de discovery secci�n por secci�n usando project-intent.md como contexto
  Y genera "docs/specs/projects/project.md" con Estado: Ready tras confirmaci�n del usuario
  Y el documento incluye perfiles de usuario, flujos principales, requisitos funcionales (FR) y no funcionales (NFR)
```

### Escenario alternativo / error � project-intent.md no existe
```gherkin
Dado que "docs/specs/projects/project-intent.md" no existe
Cuando el desarrollador ejecuta el skill "project-discovery"
Entonces el skill muestra "No se encontr� project-intent.md. Ejecuta /project-begin primero."
  Pero no genera ning�n documento de requisitos
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-02-project-spec-builder.md
Feature origen: FEAT-003 � project-discovery
