---
alwaysApply: false
type: story
id: FEAT-066
slug: FEAT-066-revision-validacion-precondiciones
title: "Skill story-code-review: validación de artefactos requeridos antes de revisar"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - FEAT-064
  - FEAT-063
---
**FINVEST Score:** [FINVEST Score]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[FEAT-064-revision-codigo-multi-agente]]
[[FEAT-063-reutilizar-directorio-como-historia-core]]

# 📖 Historia: Skill story-code-review — validación de artefactos requeridos antes de revisar

**Como** desarrollador que intenta ejecutar `/story-code-review` sobre una historia  
**Quiero** que el skill verifique que los artefactos requeridos existen antes de iniciar la revisión  
**Para** recibir un error claro con la lista de archivos faltantes en lugar de un fallo parcial o silencioso

## ✅ Criterios de aceptación

### Escenario principal – Artefactos presentes, revisión procede normalmente
```gherkin
Dado que existen "story.md", "design.md" e "implement-report.md" en "docs/specs/stories/FEAT-NNN/"
Cuando ejecuto "/story-code-review FEAT-NNN"
Entonces el skill supera la validación de precondiciones y procede con la revisión
```

### Escenario alternativo / error – Artefactos ausentes, error explícito sin output parcial
```gherkin
Dado que falta al menos uno de los artefactos requeridos en "docs/specs/stories/FEAT-NNN/"
Cuando ejecuto "/story-code-review FEAT-NNN"
Entonces el skill muestra "❌ Artefactos requeridos no encontrados: [lista de archivos faltantes]"
  Y detiene la ejecución sin generar ningún output parcial (ni code-review-report.md ni fix-directives.md)
```

## ⚙️ Criterios no funcionales

* El mensaje de error debe listar todos los archivos faltantes en una sola llamada, no uno por uno en llamadas sucesivas

## 📎 Notas / contexto adicional

Artefactos requeridos: `story.md`, `design.md`, `implement-report.md`. El archivo `tasks.md` y `constitution.md` son opcionales para la validación de precondiciones (el skill los carga si existen).

Esta validación actúa como Paso 0 del skill, antes de lanzar los agentes revisores. Si falla, ningún agente se invoca.
