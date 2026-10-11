---
type: story
id: STORY-005
kind: feat
slug: STORY-005-project-story-mapping
title: "project-story-mapping — User Story Mapping según Jeff Patton"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-05-enhance-project-spec
---

<!-- Referencias -->
[[EPIC-05-enhance-project-spec]]

# Historia de Usuario

## 📖 Historia: project-story-mapping — User Story Mapping según Jeff Patton

**Como** developer o PM que ha completado la especificación de requisitos y quiere visualizar el alcance del proyecto
**Quiero** ejecutar el skill `project-story-mapping` para construir un story map con backbone, walking skeleton y release slices
**Para** obtener `$SPECS_BASE/specs/projects/story-map.md` con la visualización del journey del usuario organizada en actividades, flujo mínimo y releases incrementales

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa del story map desde requirement-spec.md
```gherkin
Dado que existe "docs/specs/projects/project.md" con perfiles de usuario y requisitos funcionales
Cuando el desarrollador ejecuta el skill "project-story-mapping"
Entonces el agente project-story-mapper conduce una sesión interactiva de mapeo
  Y genera "docs/specs/projects/story-map.md" con backbone (actividades), walking skeleton y release slices
  Y el mapa puede usarse como guía de agrupación para el skill "project-planning"
```

### Escenario alternativo – Operación con input libre sin documentos previos
```gherkin
Dado que no existe ningún documento previo en "docs/specs/projects/"
Cuando el desarrollador ejecuta el skill "project-story-mapping"
Entonces el agente opera con input libre solicitando la descripción del proyecto directamente al usuario
  Y genera el story-map.md basándose en las respuestas de la sesión interactiva
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-05-enhance-project-spec.md
Feature origen: STORY-005 — project-story-mapping
