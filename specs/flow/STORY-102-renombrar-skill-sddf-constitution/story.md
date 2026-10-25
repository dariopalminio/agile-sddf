---
alwaysApply: false
type: story
id: STORY-102
kind: chore
slug: STORY-102-renombrar-skill-sddf-constitution
title: "Renombrar el skill project-policies-generation como sddf-constitution"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-09-26
updated: 2026-09-26
related:
  - EPIC-12-story-sdd-workflow
  - STORY-056-project-policies
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-056-project-policies]]

# 📖 Historia: Renombrar el skill project-policies-generation como sddf-constitution

**Como** mantenedor del framework Agile SDDF que configura la gobernanza de nuevos proyectos  
**Quiero** encontrar e invocar el skill de bootstrap de constitución como `sddf-constitution`  
**Para** identificar inequívocamente la herramienta responsable de establecer la constitución, las políticas derivadas y los guardrails del proyecto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El skill adopta su identidad de constitución

```gherkin
Dado que el repositorio contiene el skill de bootstrap de gobernanza en `skills/project-policies-generation/`
Cuando se aplica el renombre solicitado
Entonces el catálogo fuente contiene `skills/sddf-constitution/` como única ubicación canónica
  Y su nombre e invocación pública son `sddf-constitution` y `/sddf-constitution`
  Y conserva la capacidad de preparar o actualizar la constitución, las políticas derivadas y los guardrails DoD del proyecto
```

### AC-2 — Escenario alternativo / error – Las integraciones no ofrecen el nombre retirado

```gherkin
Dado que los flujos activos de inicialización, diseño y documentación recomiendan el skill de gobernanza
Cuando una persona mantenedora consulta esas referencias después del renombre
Entonces todas orientan a `sddf-constitution`
  Y `project-policies-generation` no se ofrece como skill activo ni como alias compatible
  Pero las historias y entradas de changelog cerradas conservan la denominación histórica cuando documenta decisiones pasadas
```

## ⚙️ Criterios no funcionales específicos

- **CNF-01 — Trazabilidad:** las referencias operativas se actualizan de manera consistente; los documentos históricos no se reescriben solo por este renombre.

- **CNF-02 — Integridad funcional:** el renombre no elimina los templates, ejemplos ni protecciones de escritura que ya ofrece el skill.

## Fuera de alcance (Non-Goals)

- Mantener `/project-policies-generation` como alias o skill duplicado.
- Reescribir el historial cerrado de specs y CHANGELOG.
- Limpiar automáticamente copias previamente instaladas en runtimes externos; esas copias se gestionan mediante una instalación explícita.

## 📎 Notas / contexto adicional

La historia original [[STORY-056-project-policies]] creó el skill con el nombre anterior dentro de [[EPIC-12-story-sdd-workflow]]. El nuevo nombre debe reflejar que su responsabilidad principal es establecer la constitución como fuente suprema de gobernanza, de la cual derivan las políticas y los guardrails.

El directorio `skills/` es la fuente de verdad. Las referencias activas que orientan a la persona mantenedora deben adoptar el nuevo identificador, mientras que las referencias históricas permanecen como evidencia de la evolución del framework.
