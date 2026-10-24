---
type: story
id: STORY-001
kind: feat
slug: STORY-001-project-begin
title: "project-begin — Captura de intención inicial del proyecto"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## 📖 Historia: project-begin — Captura de intención inicial del proyecto

**Como** developer o emprendedor que quiere especificar un nuevo proyecto de software con el framework SDDF
**Quiero** ejecutar el skill `project-begin` para responder una entrevista interactiva sobre mi proyecto
**Para** obtener `$SPECS_BASE/specs/projects/project-intent.md` con el problema, visión, beneficios, criterios de éxito, restricciones y non-goals documentados, como punto de partida para el pipeline de especificación

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de project-intent.md
```gherkin
Dado que no existe "docs/specs/projects/project-intent.md" y no hay ningún proyecto en estado IN‑PROGRESS
Cuando el desarrollador ejecuta el skill "project-begin"
Entonces el agente project-pm conduce una entrevista interactiva con preguntas contextuales
  Y al finalizar genera "docs/specs/projects/project-intent.md" con Estado: Ready
  Y el documento incluye las secciones: problema, visión, beneficios, criterios de éxito, restricciones y non-goals
```

### Escenario alternativo / error – Proyecto ya en estado IN‑PROGRESS (WIP=1)
```gherkin
Dado que ya existe un archivo con Estado: IN‑PROGRESS en "docs/specs/projects/"
Cuando el desarrollador ejecuta el skill "project-begin"
Entonces el skill muestra el mensaje de conflicto WIP y no inicia una nueva sesión
  Pero sugiere completar el proyecto activo antes de iniciar uno nuevo
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-02-project-spec-builder.md
Feature origen: STORY-001 — project-begin-intention (luego renombrado a project-begin)
