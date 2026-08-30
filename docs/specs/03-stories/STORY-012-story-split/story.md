---
type: story
id: STORY-012
kind: feat
slug: STORY-012-story-split
title: "story-split ó Dividir ópicas en historias pequeóas"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: story-split ó Dividir ópicas en historias pequeóas

**Como** desarrollador o PM que tiene una historia de usuario demasiado grande para estimar o entregar en un sprint
**Quiero** ejecutar el skill `story-split` sobre esa historia para obtener historias mós pequeóas e independientes
**Para** conseguir unidades de trabajo estimables, entregables de forma incremental y que cumplan el criterio S (Small) de INVEST

## ? Criterios de aceptación

### Escenario principal: División exitosa usando el patrón de pasos de flujo
```gherkin
Dado que "docs/specs/stories/story-gestion-completa-pedidos.md" cubre creación, edición y cancelación de pedidos
Cuando el desarrollador ejecuta el skill "story-split" sobre esa historia
Entonces el skill identifica el patrón de splitting mós adecuado (pasos de flujo)
  Y genera tres historias independientes: crear pedido, editar pedido, cancelar pedido
  Y cada historia resultante sigue el template story-template.md con sus propios escenarios Gherkin
```

### Escenario alternativo / error ó Historia ya suficientemente pequeóa
```gherkin
Dado que la historia indicada tiene un solo escenario principal y alcance acotado
Cuando el skill evalóa si necesita división
Entonces el skill informa que la historia ya cumple el criterio S de INVEST
  Pero no genera historias derivadas sin confirmación del usuario
```

### Requerimiento: finvest-evaluation-report.md como input
El skill busca finvest-evaluation-report.md en el mismo directorio de la story y lo usa como input. Busca finvest-evaluation-report.md en el directorio de la historia, verifica decision: DIVIDIR en el frontmatter, extrae la tabla de la sección "Plan de división sugerido" y la guarda como plan_finvest. El plan FINVEST actúa como guía principal y los 8 patrones de Richard Lawrence se ejecutan siempre — para validar la agrupación propuesta y cubrir cualquier elemento que el plan no haya definido explícitamente (escenarios ambiguos, criterios no funcionales sin historia asignada, requerimientos sueltos).

### Requerimiento: historias hijas son nuevas historias a nivel de hermanas (las hijas son hermanas)
Usar $SPECS_BASE/specs/stories/STORY-*/story.md como patrón Glob + fallback Bash. Cuando genere nuevas historias hijas, debe crear nuevos directorios de historias bajo el mismo directorio padre de la historia original, siguiendo la estructura de carpetas actual. Por ejemplo, si la historia original está en `docs/specs/stories/STORY-012-story-split/story.md`, las historias hijas se crearán en `docs/specs/stories/STORY-012-story-split/story.md`, `docs/specs/stories/STORY-013-story-hija/story.md`, etc.

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automóticamente desde el release: release-01-features-spec-builder.md
Feature origen: STORY-012 ó story-split
