---
alwaysApply: false
type: story
id: FEAT-054
slug: FEAT-054-inicializar-entorno-sddf
title: "Inicializar entorno SDDF con sddf-init"
status: BACKLOG
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-02
updated: 2026-05-02
---
**FINVEST Score:** -
**FINVEST Decisión:** -
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]


# 📖 Historia: Inicializar entorno SDDF con sddf-init

**Como** desarrollador que configura SDDF en un proyecto nuevo  
**Quiero** ejecutar el skill `sddf-init` para crear la estructura base del entorno SDDF  
**Para** poder usar cualquier skill SDDF sin errores de entorno desde el primer uso, sin tener que crear directorios ni archivos de config manualmente

## ✅ Criterios de aceptación

### Escenario principal – Inicialización exitosa en proyecto nuevo
```gherkin
Dado que estoy en un repositorio git sin estructura SDDF previa
  Y no tengo definida la variable de entorno SDDF_ROOT
Cuando ejecuto el skill sddf-init
Entonces se crean los directorios "docs/specs/projects/", "docs/specs/releases/" y "docs/specs/stories/"
  Y se genera el archivo "openspec/config.yaml" con valores por defecto desde el template
  Y se genera el archivo ".env.template" documentando la variable SDDF_ROOT
  Y se muestra el mensaje "✓ Entorno SDDF inicializado correctamente en docs/"
```

### Escenario alternativo – Inicialización con SDDF_ROOT personalizado
```gherkin
Dado que tengo definida la variable de entorno SDDF_ROOT="custom/specs"
  Y el directorio "custom/specs" existe
Cuando ejecuto el skill sddf-init
Entonces se crean los directorios bajo "custom/specs/projects/", "custom/specs/releases/" y "custom/specs/stories/"
  Y se muestra el mensaje "✓ Entorno SDDF inicializado correctamente en custom/specs/"
```

### Escenario alternativo – Entorno ya inicializado (idempotencia)
```gherkin
Dado que el entorno SDDF ya fue inicializado previamente
  Y los directorios "docs/specs/projects/", "docs/specs/releases/" y "docs/specs/stories/" ya existen
Cuando ejecuto el skill sddf-init nuevamente
Entonces los directorios existentes no son modificados ni eliminados
  Y se muestra el mensaje "✓ Entorno ya inicializado — sin cambios necesarios"
```

### Escenario alternativo / error – openspec/config.yaml ya existe con contenido
```gherkin
Dado que "openspec/config.yaml" ya existe con configuración personalizada del usuario
Cuando ejecuto el skill sddf-init
Entonces "openspec/config.yaml" NO es sobrescrito
  Pero se muestra el mensaje "[INFO] openspec/config.yaml ya existe — se mantiene sin cambios"
```

### Escenario alternativo / error – SDDF_ROOT apunta a ruta inexistente
```gherkin
Dado que tengo definida SDDF_ROOT=".docs"
  Y el directorio ".docs" no existe
Cuando ejecuto el skill sddf-init
Entonces se muestra el mensaje "[ERROR] SDDF_ROOT apunta a ruta inexistente: .docs"
  Y se muestra la sugerencia "Corrige SDDF_ROOT o elimina la variable para usar docs/ como valor por defecto"
  Pero no se crea ningún directorio ni archivo
```

### Requirement: Idempotencia garantizada
El skill sddf-init puede ejecutarse múltiples veces sobre el mismo proyecto sin producir efectos destructivos. Los directorios y archivos existentes nunca son sobrescritos ni eliminados.

## ⚙️ Criterios no funcionales

* Seguridad: el skill no sobrescribe archivos existentes que tengan contenido
* UX: el informe de resultado distingue claramente entre "recién creado" vs "ya existía" para cada artefacto generado

## 📎 Notas / contexto adicional

`sddf-init` es el predecesor de `skill-preflight` en el flujo de onboarding: primero se inicializa el entorno (write), luego se valida antes de cada skill (read-only). El flujo recomendado es:

```
sddf-init → skill-preflight → [cualquier skill SDDF]
```

El skill genera `.env.template` con la documentación de `SDDF_ROOT`, pero no exporta la variable al shell del usuario — eso requiere intervención manual o un script de shell externo.

**Fuera de scope:**
- Instalación de dependencias npm
- Configuración automática de hooks de Claude Code
- Inicialización de repositorio git
