---
type: story
id: STORY-004
kind: feat
slug: STORY-004-project-planning
title: "project-planning — Planificación de releases y backlog"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## 📖 Historia: project-planning — Planificación de releases y backlog

**Como** developer que tiene `requirement-spec.md` aprobado y necesita organizar el trabajo en releases
**Quiero** ejecutar el skill `project-planning` para que el agente architect extraiga features, las priorice y las agrupe en releases incrementales
**Para** obtener `$SPECS_BASE/specs/projects/project-plan.md` con el backlog organizado en releases STORY-NNN, listo para comenzar el desarrollo sprint a sprint

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de project-plan.md
```gherkin
Dado que existe "docs/specs/projects/project.md" con Estado: Ready
Cuando el desarrollador ejecuta el skill "project-planning"
Entonces el agente extrae features STORY-NNN de los requisitos y las agrupa en releases incrementales
  Y genera "docs/specs/projects/project-plan.md" con Estado: Ready tras confirmación del usuario
  Y el documento incluye la sección "## Propuesta de Releases" con bloques "### Release NN — Nombre"
```

### Escenario alternativo / error – requirement-spec.md no existe
```gherkin
Dado que "docs/specs/projects/project.md" no existe
Cuando el desarrollador ejecuta el skill "project-planning"
Entonces el skill muestra "No se encontró requirement-spec.md. Ejecuta /project-discovery primero."
  Pero no genera ningún plan de proyecto
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-02-project-spec-builder.md
Feature origen: STORY-004 — project-planning
