---
alwaysApply: false
type: story
id: STORY-055
kind: feat
slug: STORY-055-centralizar-templates-en-specs-templates
title: "Centralizar templates de spec en directorio compartido"
status: COMPLETED
substatus: READY
parent: EPIC-11-centralizar-templates
created: 2026-05-02
updated: 2026-05-02
related:
  - EPIC-11-centralizar-templates
  - STORY-048-refactor-migrates-templates-to-assets
---
<!-- Referencias -->
[[EPIC-11-centralizar-templates]]
[[STORY-048-refactor-migrates-templates-to-assets]]

# ðŸ“– Historia: Centralizar templates de spec en directorio compartido

**Como** maintainer del framework SDDF que evoluciona skills y templates con el tiempo  
**Quiero** centralizar los templates de spec (`story-template.md`, `release-spec-template.md`, `project-template.md`) en `$SPECS_BASE/specs/templates/` como Ãºnica fuente de verdad  
**Para** eliminar la divergencia de frontmatter entre las copias distribuidas en cada skill y garantizar que cualquier cambio en la estructura de un template se propague automÃ¡ticamente a todos los skills generadores

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ MigraciÃ³n completa sin referencias huÃ©rfanas
```gherkin
Dado que el proyecto tiene 10 copias distribuidas de templates en directorios assets/ de skills individuales
  Y existen al menos 3 inconsistencias de frontmatter detectadas (campo date vs created/updated, id ausente, type: spec no canÃ³nico)
Cuando se ejecuta la migraciÃ³n centralizando los 3 templates en docs/specs/templates/
  Y se actualizan todos los SKILL.md y archivos de agentes para referenciar $SPECS_BASE/specs/templates/<template>.md
  Y se eliminan las 10 copias distribuidas de assets/
Entonces no existe ninguna referencia a assets/(story-template|release-spec-template|project-template).md en ningÃºn archivo .md del proyecto
  Y los 3 archivos docs/specs/templates/story-template.md, release-spec-template.md y project-template.md existen y coinciden con el esquema canÃ³nico de header-aggregation
```

### Escenario alternativo / error â€“ Skill referencia template eliminado
```gherkin
Dado que un skill actualizado referencia $SPECS_BASE/specs/templates/story-template.md
  Y el template central existe en esa ruta
Cuando el skill ejecuta el Paso 0 (preflight + lectura de template)
Entonces resuelve correctamente la ruta y lee el template
  Pero si el template no existiera en docs/specs/templates/ el skill emite el error canÃ³nico y detiene la ejecuciÃ³n sin generar ningÃºn archivo
```

### Requirement: Status inicial por workflow
Cada skill generador declara explÃ­citamente en su SKILL.md el `status` inicial que debe asignar al frontmatter del artefacto generado, dado que el template centralizado usa el placeholder `<ESTADO_INICIAL>`:

| Skill generador | Status inicial |
|---|---|
| `project-discovery`, `reverse-engineering` | `DISCOVERY` |
| `release-creation`, `releases-from-project-plan` | `DEFINITION` |
| `release-generate-stories`, `release-generate-all-stories` | `READY-FOR-IMPLEMENT` |
| `story-creation`, `story-split` | `SPECIFY` |

## âš™ï¸ Criterios no funcionales

* Mantenibilidad: modificar una secciÃ³n del template central debe reflejarse en todos los skills sin editar ningÃºn SKILL.md individual
* Verificabilidad: la ausencia de referencias a `assets/<template>.md` es comprobable con un Ãºnico `grep` recursivo sobre `.claude/`
* Compatibilidad: los archivos spec ya generados en `$SPECS_BASE/specs/` no se modifican; la migraciÃ³n solo afecta templates y SKILL.md

## ðŸ“Ž Notas / contexto adicional

Esta historia resuelve la inconsistencia IC-8 (duplicaciÃ³n de templates sin control de versiÃ³n) detectada en el anÃ¡lisis de frontmatter del release EPIC-10. Las inconsistencias IC-1 (date vs created/updated), IC-2 (type: spec), IC-3 (id ausente) e IC-4 (status inicial heterogÃ©neo) quedaron tambiÃ©n corregidas como efecto de esta migraciÃ³n.

Scope out: la sincronizaciÃ³n de los templates de `$SPECS_BASE/specs/templates/` con los de `$SPECS_BASE/specs/templates/speckit/` y `$SPECS_BASE/specs/templates/openspec/` queda fuera de esta historia.
