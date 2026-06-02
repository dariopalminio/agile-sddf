---
alwaysApply: false
type: story
id: FEAT-055
slug: FEAT-055-centralizar-templates-en-specs-templates
title: "Centralizar templates de spec en directorio compartido"
status: COMPLETED
substatus: READY
parent: EPIC-11-centralizar-templates
created: 2026-05-02
updated: 2026-05-02
related:
  - EPIC-11-centralizar-templates
  - FEAT-048-refactor-migrates-templates-to-assets
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-11-centralizar-templates]]
[[FEAT-048-refactor-migrates-templates-to-assets]]

# 📖 Historia: Centralizar templates de spec en directorio compartido

**Como** maintainer del framework SDDF que evoluciona skills y templates con el tiempo  
**Quiero** centralizar los templates de spec (`story-template.md`, `release-spec-template.md`, `project-template.md`) en `$SPECS_BASE/specs/templates/` como única fuente de verdad  
**Para** eliminar la divergencia de frontmatter entre las copias distribuidas en cada skill y garantizar que cualquier cambio en la estructura de un template se propague automáticamente a todos los skills generadores

## ✅ Criterios de aceptación

### Escenario principal – Migración completa sin referencias huérfanas
```gherkin
Dado que el proyecto tiene 10 copias distribuidas de templates en directorios assets/ de skills individuales
  Y existen al menos 3 inconsistencias de frontmatter detectadas (campo date vs created/updated, id ausente, type: spec no canónico)
Cuando se ejecuta la migración centralizando los 3 templates en docs/specs/templates/
  Y se actualizan todos los SKILL.md y archivos de agentes para referenciar $SPECS_BASE/specs/templates/<template>.md
  Y se eliminan las 10 copias distribuidas de assets/
Entonces no existe ninguna referencia a assets/(story-template|release-spec-template|project-template).md en ningún archivo .md del proyecto
  Y los 3 archivos docs/specs/templates/story-template.md, release-spec-template.md y project-template.md existen y coinciden con el esquema canónico de header-aggregation
```

### Escenario alternativo / error – Skill referencia template eliminado
```gherkin
Dado que un skill actualizado referencia $SPECS_BASE/specs/templates/story-template.md
  Y el template central existe en esa ruta
Cuando el skill ejecuta el Paso 0 (preflight + lectura de template)
Entonces resuelve correctamente la ruta y lee el template
  Pero si el template no existiera en docs/specs/templates/ el skill emite el error canónico y detiene la ejecución sin generar ningún archivo
```

### Requirement: Status inicial por workflow
Cada skill generador declara explícitamente en su SKILL.md el `status` inicial que debe asignar al frontmatter del artefacto generado, dado que el template centralizado usa el placeholder `<ESTADO_INICIAL>`:

| Skill generador | Status inicial |
|---|---|
| `project-discovery`, `reverse-engineering` | `DISCOVERY` |
| `release-creation`, `releases-from-project-plan` | `DEFINITION` |
| `release-generate-stories`, `release-generate-all-stories` | `READY-FOR-IMPLEMENT` |
| `story-creation`, `story-split` | `SPECIFY` |

## ⚙️ Criterios no funcionales

* Mantenibilidad: modificar una sección del template central debe reflejarse en todos los skills sin editar ningún SKILL.md individual
* Verificabilidad: la ausencia de referencias a `assets/<template>.md` es comprobable con un único `grep` recursivo sobre `.claude/`
* Compatibilidad: los archivos spec ya generados en `$SPECS_BASE/specs/` no se modifican; la migración solo afecta templates y SKILL.md

## 📎 Notas / contexto adicional

Esta historia resuelve la inconsistencia IC-8 (duplicación de templates sin control de versión) detectada en el análisis de frontmatter del release EPIC-10. Las inconsistencias IC-1 (date vs created/updated), IC-2 (type: spec), IC-3 (id ausente) e IC-4 (status inicial heterogéneo) quedaron también corregidas como efecto de esta migración.

Scope out: la sincronización de los templates de `$SPECS_BASE/specs/templates/` con los de `$SPECS_BASE/specs/templates/speckit/` y `$SPECS_BASE/specs/templates/openspec/` queda fuera de esta historia.
