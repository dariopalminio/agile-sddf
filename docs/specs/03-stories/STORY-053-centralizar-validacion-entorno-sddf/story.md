---
alwaysApply: false
type: story
id: STORY-053
kind: feat
slug: STORY-053-centralizar-validacion-entorno-sddf
title: "Centralizar la validaciÃ³n de entorno SDDF con skill-preflight"
status: COMPLETED
substatus: DONE
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-02
updated: 2026-05-02
---
<!-- Referencias -->
[[skill-preflight]]


# ðŸ“– Historia: Centralizar la validaciÃ³n de entorno SDDF con skill-preflight

**Como** desarrollador que crea o mantiene skills en el framework SDDF  
**Quiero** invocar `skill-preflight` en el Paso 0 de mis skills en lugar de duplicar la lÃ³gica de validaciÃ³n de `SDDF_ROOT`, directorios de specs y config  
**Para** eliminar la duplicaciÃ³n en ~20 archivos y garantizar que un cambio en las convenciones de entorno solo requiere modificar un Ãºnico lugar

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Entorno vÃ¡lido, skill continÃºa normalmente
```gherkin
Dado que un skill SDDF tiene en su Paso 0 la instrucciÃ³n "Invocar skill-preflight"
  Y la variable SDDF_ROOT apunta a un directorio existente (ej. "docs")
  Y los subdirectorios docs/specs/releases/ y docs/specs/stories/ existen
  Y openspec/config.yaml tiene contenido
Cuando el skill ejecuta el Paso 0
Entonces skill-preflight emite "[OK]  SDDF_ROOT = docs"
  Y skill-preflight emite "[OK]" para cada subdirectorio verificado
  Y skill-preflight emite "âœ“ Entorno OK â€” listo para continuar"
  Y el skill invocador recibe SPECS_BASE = "docs" y prosigue su ejecuciÃ³n
```

### Escenario alternativo / error â€“ SDDF_ROOT no definida, fallback silencioso
```gherkin
Dado que SDDF_ROOT no estÃ¡ definida en el entorno
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[WARNING] SDDF_ROOT no definida â†’ Se usarÃ¡ 'docs' como valor por defecto"
  Y skill-preflight establece SPECS_BASE = "docs"
  Y skill-preflight emite "âœ“ Entorno OK â€” listo para continuar"
  Pero el skill invocador no se detiene
```

### Escenario alternativo / error â€“ SDDF_ROOT apunta a ruta inexistente
```gherkin
Dado que SDDF_ROOT estÃ¡ definida como ".docs"
  Y el directorio ".docs" no existe en el sistema de archivos
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[ERROR]  SDDF_ROOT apunta a ruta inexistente: .docs â†’ Crear el directorio o corregir la variable"
  Y skill-preflight emite "âœ— Entorno invÃ¡lido â€” corregir los errores antes de continuar"
  Pero el skill invocador no ejecuta ningÃºn paso adicional
```

### Escenario alternativo / error â€“ Template requerido faltante
```gherkin
Dado que el skill invocador declara que requiere "assets/mi-template.md"
  Y el archivo ".claude/skills/<skill-name>/assets/mi-template.md" no existe
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[ERROR]  Template faltante: assets/mi-template.md â†’ Verificar que el archivo existe en assets/"
  Y skill-preflight detiene la ejecuciÃ³n del skill invocador
```

### Requirement: Un solo punto de mantenimiento para las convenciones de entorno
Cualquier cambio en las convenciones de rutas del framework SDDF (ej. renombrar `specs/projects/` a `specs/projects/`) SHALL requerir modificar Ãºnicamente `skill-preflight/SKILL.md` para que todos los skills queden alineados, sin necesidad de editar los demÃ¡s SKILL.md.

## âš™ï¸ Criterios no funcionales

* Compatibilidad: skill-preflight debe funcionar en Claude Code, OpenCode y GitHub Copilot sin dependencias externas mÃ¡s allÃ¡ de Markdown
* Transparencia: el informe de preflight debe ser legible directamente en la sesiÃ³n de chat (formato `[OK]/[WARNING]/[ERROR]`)

## ðŸ“Ž Notas / contexto adicional

La lÃ³gica original (4 pasos de validaciÃ³n de SDDF_ROOT) se migrÃ³ desde ~15 skills que la duplicaban. Los skills `readme-builder`, `docs-wiki-builder`, `skill-master` y los openspec-* no requerÃ­an el bloque (sin SDDF_ROOT â†’ no migrados). La migraciÃ³n completa se realizÃ³ en el change `skill-preflight` del pipeline OpenSpec. El skill `story-evaluation` tampoco requiere preflight (no escribe artefactos a disco).
