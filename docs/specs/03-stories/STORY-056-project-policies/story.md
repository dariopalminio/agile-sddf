---
alwaysApply: false
type: story
id: STORY-056
kind: feat
slug: STORY-056-project-policies
title: "Project policies"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-06
updated: 2026-05-06
related:
  - EPIC-12-story-sdd-workflow
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]


# ðŸ“– Historia: Project policies

**Como** Tech Lead o desarrollador que configura un proyecto SDDF  
**Quiero** ejecutar un skill `project-policies-generation` que genere los documentos de polÃ­ticas y constituciÃ³n del proyecto (`constitution.md` y `dod-story.md`)  
**Para** centralizar en el repositorio las reglas tÃ©cnicas y acuerdos de equipo que guiarÃ¡n el diseÃ±o e implementaciÃ³n de todas las historias

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GeneraciÃ³n de documentos de polÃ­ticas cuando no existen
```gherkin
Dado que estoy en la raÃ­z de un proyecto SDDF
  Y los archivos $SPECS_BASE/policies/constitution.md y $SPECS_BASE/policies/dod-story.md NO existen
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill crea $SPECS_BASE/policies/constitution.md a partir del template $SPECS_BASE/specs/templates/project-constitution-template.md
  Y crea $SPECS_BASE/policies/dod-story.md con la estructura definida en el template correspondiente
  Y ambos archivos contienen un frontmatter vÃ¡lido con los campos requeridos para el workflow de story
```

### Escenario alternativo / error â€“ Los archivos de polÃ­ticas ya existen
```gherkin
Dado que $SPECS_BASE/policies/constitution.md y $SPECS_BASE/policies/dod-story.md ya existen
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill abre los archivos existentes para ediciÃ³n en lugar de crearlos desde cero
  Pero no sobreescribe el contenido existente sin confirmaciÃ³n del usuario
```

### Escenario alternativo / error â€“ Template de constituciÃ³n no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/project-constitution-template.md no existe
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill muestra un mensaje de error indicando que el template no fue encontrado
  Y no crea ningÃºn archivo de polÃ­tica
  Pero sugiere ejecutar `sddf-init` para inicializar la estructura base
```

### Requirement: IntegraciÃ³n con CLAUDE.md / AGENTS.md
Los archivos de polÃ­ticas deben referenciarse desde `CLAUDE.md` o `AGENTS.md` usando la sintaxis `@` para que los agentes IA los lean automÃ¡ticamente antes de cualquier acciÃ³n en el proyecto.

### Requirement: Nombre del skill
El skill debe llamarse `project-policies-generation` para reflejar claramente su funciÃ³n de generar las polÃ­ticas del proyecto.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## Requerimiento: Inicializar polÃ­ticas del proyecto
Agregar un paso de "Inicializar polÃ­ticas del proyecto (opcional)" en skills/sddf-init/SKILL.md.  Inicializar polÃ­ticas del proyecto: pregunta (s/n) al usuario y, si acepta, invoca project-policies-generation antes de continuar. Si rechaza, registra [OMITIDO] en el informe. Paso 5 â†’ Paso 6 (Informe final): renumerado; el ejemplo de informe ahora incluye las entradas de constitution.md y dod-story.md.

## âš™ï¸ Criterios no funcionales

* Coherencia: los archivos generados deben estar versionados en el repositorio (no en .gitignore)
* Portabilidad: el skill debe funcionar con cualquier cliente IA compatible con SDDF (Claude, Cursor, Codex)
* Mantenibilidad: la estructura del documento la define el template en tiempo de ejecuciÃ³n, no el skill

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-056 â€” Project policies

El principio guÃ­a es "el repositorio como sistema": las polÃ­ticas estÃ¡n dentro del repo, versionadas y accesibles para todos los agentes. Todo lo que un agente necesita para entender "cÃ³mo trabajamos" debe estar en `policies/`.
