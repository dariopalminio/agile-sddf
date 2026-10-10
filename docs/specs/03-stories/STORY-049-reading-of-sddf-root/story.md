---
alwaysApply: false
type: story
id: STORY-049
kind: feat
slug: STORY-049-reading-of-sddf-root
title: "Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF"
date: 2026-05-01
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# ðŸ“– Historia: Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF

**Como** desarrollador o equipo que usa el framework SDDF en un proyecto con estructura de directorios personalizada
**Quiero** poder definir la variable de entorno `SDDF_ROOT` para indicar el directorio raÃ­z de artefactos
**Para** adaptar el framework a distintas estructuras de proyecto sin modificar ningÃºn archivo del framework

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ SDDF_ROOT definida y ruta existente

```gherkin
Dado que el desarrollador tiene definida la variable de entorno SDDF_ROOT="/custom/specs"
  Y la ruta "/custom/specs" existe en el sistema de archivos
Cuando ejecuta cualquier skill SDDF que accede a artefactos (ej. /story-creation, /project-begin)
Entonces el skill usa "/custom/specs" como directorio raÃ­z para leer y escribir artefactos
  Y no accede a la ruta "docs/" por defecto
```

### Escenario alternativo / error â€“ SDDF_ROOT no definida (fallback a docs)

```gherkin
Dado que el desarrollador no tiene definida la variable de entorno SDDF_ROOT
Cuando ejecuta cualquier skill SDDF que accede a artefactos
Entonces el skill usa "docs" como directorio raÃ­z por defecto
  Y el comportamiento es idÃ©ntico al existente antes de este cambio
```

### Escenario alternativo / error â€“ SDDF_ROOT apunta a ruta inexistente

```gherkin
Dado que el desarrollador tiene definida la variable de entorno SDDF_ROOT="/ruta/que/no/existe"
  Y la ruta "/ruta/que/no/existe" no existe en el sistema de archivos
Cuando ejecuta cualquier skill SDDF que accede a artefactos
Entonces el skill muestra "âš ï¸ La ruta definida en SDDF_ROOT no existe. Se usarÃ¡ el valor por defecto: docs"
  Y el skill continÃºa usando "docs" como directorio raÃ­z
```

### Escenario con datos (Scenario Outline) â€“ ResoluciÃ³n de SPECS_BASE segÃºn estado de SDDF_ROOT

```gherkin
Escenario: ResoluciÃ³n de SPECS_BASE segÃºn estado de SDDF_ROOT
  Dado que la variable SDDF_ROOT tiene el valor "<valor_sddf_root>"
  Y la ruta existe en el sistema: "<ruta_existe>"
  Cuando el skill resuelve SPECS_BASE
  Entonces SPECS_BASE toma el valor "<specs_base_resultante>"
  Y el skill muestra advertencia: "<muestra_advertencia>"
Ejemplos:
  | valor_sddf_root    | ruta_existe | specs_base_resultante | muestra_advertencia |
  | /custom/specs      | sÃ­          | /custom/specs         | no                  |
  | (no definida)      | N/A         | docs                  | no                  |
  | /ruta/inexistente  | no          | docs                  | sÃ­                  |
```

### Requirement: ConvenciÃ³n estÃ¡ndar de resoluciÃ³n de SPECS_BASE

Cada skill afectado debe resolver `SPECS_BASE` siguiendo exactamente este orden de precedencia al inicio de su ejecuciÃ³n:

1. Si `SDDF_ROOT` estÃ¡ definida y la ruta existe â†’ `SPECS_BASE = $SDDF_ROOT`
2. Si `SDDF_ROOT` estÃ¡ definida pero la ruta no existe â†’ advertencia + `SPECS_BASE = docs`
3. Si `SDDF_ROOT` no estÃ¡ definida â†’ `SPECS_BASE = docs`

Skills afectados: `project-begin`, `project-discovery`, `project-planning`, `story-creation`, `story-split`, `story-evaluation`, `release-generate-all-stories`, `release-generate-stories`, `releases-from-project-plan`, `project-story-mapping`, `reverse-engineering`, `header-aggregation`.

## âš™ï¸ Criterios no funcionales

* Retrocompatibilidad: sin `SDDF_ROOT` definida, el comportamiento es **idÃ©ntico** al actual â€” sin breaking changes ni cambios en contratos de skills.
* Portabilidad: la convenciÃ³n debe funcionar en entornos Unix y Windows (paths absolutos o relativos vÃ¡lidos).
* DocumentaciÃ³n: el `README.md` debe incluir una secciÃ³n dedicada con propÃ³sito, valores vÃ¡lidos y cÃ³mo definir `SDDF_ROOT`.

## ðŸ“Ž Notas / contexto adicional

El cambio es puramente aditivo: se introduce la lectura de `SDDF_ROOT` en los `SKILL.md` afectados sin alterar lÃ³gica de negocio ni contratos existentes.

Fuera de scope: creaciÃ³n automÃ¡tica de la ruta si no existe, soporte para mÃºltiples variables alternativas, integraciÃ³n con archivos `.env`.
