---
type: story
id: STORY-012
kind: feat
slug: STORY-012-story-split
title: "story-split Ã³ Dividir Ã³picas en historias pequeÃ³as"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: story-split Ã³ Dividir Ã³picas en historias pequeÃ³as

**Como** desarrollador o PM que tiene una historia de usuario demasiado grande para estimar o entregar en un sprint
**Quiero** ejecutar el skill `story-split` sobre esa historia para obtener historias mÃ³s pequeÃ³as e independientes
**Para** conseguir unidades de trabajo estimables, entregables de forma incremental y que cumplan el criterio S (Small) de INVEST

## ? Criterios de aceptaciÃ³n

### Escenario principal: DivisiÃ³n exitosa usando el patrÃ³n de pasos de flujo
```gherkin
Dado que "docs/specs/stories/story-gestion-completa-pedidos.md" cubre creaciÃ³n, ediciÃ³n y cancelaciÃ³n de pedidos
Cuando el desarrollador ejecuta el skill "story-split" sobre esa historia
Entonces el skill identifica el patrÃ³n de splitting mÃ³s adecuado (pasos de flujo)
  Y genera tres historias independientes: crear pedido, editar pedido, cancelar pedido
  Y cada historia resultante sigue el template story-template.md con sus propios escenarios Gherkin
```

### Escenario alternativo / error Ã³ Historia ya suficientemente pequeÃ³a
```gherkin
Dado que la historia indicada tiene un solo escenario principal y alcance acotado
Cuando el skill evalÃ³a si necesita divisiÃ³n
Entonces el skill informa que la historia ya cumple el criterio S de INVEST
  Pero no genera historias derivadas sin confirmaciÃ³n del usuario
```

### Requerimiento: finvest-evaluation-report.md como input
El skill busca finvest-evaluation-report.md en el mismo directorio de la story y lo usa como input. Busca finvest-evaluation-report.md en el directorio de la historia, verifica decision: DIVIDIR en el frontmatter, extrae la tabla de la secciÃ³n "Plan de divisiÃ³n sugerido" y la guarda como plan_finvest. El plan FINVEST actÃºa como guÃ­a principal y los 8 patrones de Richard Lawrence se ejecutan siempre â€” para validar la agrupaciÃ³n propuesta y cubrir cualquier elemento que el plan no haya definido explÃ­citamente (escenarios ambiguos, criterios no funcionales sin historia asignada, requerimientos sueltos).

### Requerimiento: historias hijas son nuevas historias a nivel de hermanas (las hijas son hermanas)
Usar $SPECS_BASE/specs/stories/STORY-*/story.md como patrÃ³n Glob + fallback Bash. Cuando genere nuevas historias hijas, debe crear nuevos directorios de historias bajo el mismo directorio padre de la historia original, siguiendo la estructura de carpetas actual. Por ejemplo, si la historia original estÃ¡ en `docs/specs/stories/STORY-012-story-split/story.md`, las historias hijas se crearÃ¡n en `docs/specs/stories/STORY-012-story-split/story.md`, `docs/specs/stories/STORY-013-story-hija/story.md`, etc.

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automÃ³ticamente desde el release: release-01-features-spec-builder.md
Feature origen: STORY-012 Ã³ story-split
