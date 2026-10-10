---
alwaysApply: false
type: story
id: STORY-054
kind: feat
slug: STORY-054-inicializar-entorno-sddf
title: "Inicializar entorno SDDF con sddf-init"
status: BACKLOG
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-02
updated: 2026-05-02
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]


# ðŸ“– Historia: Inicializar entorno SDDF con sddf-init

**Como** desarrollador que configura SDDF en un proyecto nuevo  
**Quiero** ejecutar el skill `sddf-init` para crear la estructura base del entorno SDDF  
**Para** poder usar cualquier skill SDDF sin errores de entorno desde el primer uso, sin tener que crear directorios ni archivos de config manualmente

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ InicializaciÃ³n exitosa en proyecto nuevo
```gherkin
Dado que estoy en un repositorio git sin estructura SDDF previa
  Y no tengo definida la variable de entorno SDDF_ROOT
Cuando ejecuto el skill sddf-init
Entonces se crean los directorios "docs/specs/projects/", "docs/specs/releases/" y "docs/specs/stories/"
  Y se genera el archivo "openspec/config.yaml" con valores por defecto desde el template
  Y se genera el archivo ".env.template" documentando la variable SDDF_ROOT
  Y se muestra el mensaje "âœ“ Entorno SDDF inicializado correctamente en docs/"
```

### Escenario alternativo â€“ InicializaciÃ³n con SDDF_ROOT personalizado
```gherkin
Dado que tengo definida la variable de entorno SDDF_ROOT="custom/specs"
  Y el directorio "custom/specs" existe
Cuando ejecuto el skill sddf-init
Entonces se crean los directorios bajo "custom/specs/projects/", "custom/specs/releases/" y "custom/specs/stories/"
  Y se muestra el mensaje "âœ“ Entorno SDDF inicializado correctamente en custom/specs/"
```

### Escenario alternativo â€“ Entorno ya inicializado (idempotencia)
```gherkin
Dado que el entorno SDDF ya fue inicializado previamente
  Y los directorios "docs/specs/projects/", "docs/specs/releases/" y "docs/specs/stories/" ya existen
Cuando ejecuto el skill sddf-init nuevamente
Entonces los directorios existentes no son modificados ni eliminados
  Y se muestra el mensaje "âœ“ Entorno ya inicializado â€” sin cambios necesarios"
```

### Escenario alternativo / error â€“ openspec/config.yaml ya existe con contenido
```gherkin
Dado que "openspec/config.yaml" ya existe con configuraciÃ³n personalizada del usuario
Cuando ejecuto el skill sddf-init
Entonces "openspec/config.yaml" NO es sobrescrito
  Pero se muestra el mensaje "[INFO] openspec/config.yaml ya existe â€” se mantiene sin cambios"
```

### Escenario alternativo / error â€“ SDDF_ROOT apunta a ruta inexistente
```gherkin
Dado que tengo definida SDDF_ROOT=".docs"
  Y el directorio ".docs" no existe
Cuando ejecuto el skill sddf-init
Entonces se muestra el mensaje "[ERROR] SDDF_ROOT apunta a ruta inexistente: .docs"
  Y se muestra la sugerencia "Corrige SDDF_ROOT o elimina la variable para usar docs/ como valor por defecto"
  Pero no se crea ningÃºn directorio ni archivo
```

### Requirement: Idempotencia garantizada
El skill sddf-init puede ejecutarse mÃºltiples veces sobre el mismo proyecto sin producir efectos destructivos. Los directorios y archivos existentes nunca son sobrescritos ni eliminados.

## âš™ï¸ Criterios no funcionales

* Seguridad: el skill no sobrescribe archivos existentes que tengan contenido
* UX: el informe de resultado distingue claramente entre "reciÃ©n creado" vs "ya existÃ­a" para cada artefacto generado

## ðŸ“Ž Notas / contexto adicional

`sddf-init` es el predecesor de `skill-preflight` en el flujo de onboarding: primero se inicializa el entorno (write), luego se valida antes de cada skill (read-only). El flujo recomendado es:

```
sddf-init â†’ skill-preflight â†’ [cualquier skill SDDF]
```

El skill genera `.env.template` con la documentaciÃ³n de `SDDF_ROOT`, pero no exporta la variable al shell del usuario â€” eso requiere intervenciÃ³n manual o un script de shell externo.

**Fuera de scope:**
- InstalaciÃ³n de dependencias npm
- ConfiguraciÃ³n automÃ¡tica de hooks de Claude Code
- InicializaciÃ³n de repositorio git
