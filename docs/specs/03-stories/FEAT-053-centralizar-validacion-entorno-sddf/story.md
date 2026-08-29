---
alwaysApply: false
type: story
id: FEAT-053
slug: FEAT-053-centralizar-validacion-entorno-sddf
title: "Centralizar la validación de entorno SDDF con skill-preflight"
status: COMPLETED
substatus: DONE
parent: <nombre-del-directorio-de-release>
created: 2026-05-02
updated: 2026-05-02
---
**FINVEST Score:** [pendiente]
**FINVEST Decisión:** [pendiente]
---
<!-- Referencias -->
[[skill-preflight]]


# 📖 Historia: Centralizar la validación de entorno SDDF con skill-preflight

**Como** desarrollador que crea o mantiene skills en el framework SDDF  
**Quiero** invocar `skill-preflight` en el Paso 0 de mis skills en lugar de duplicar la lógica de validación de `SDDF_ROOT`, directorios de specs y config  
**Para** eliminar la duplicación en ~20 archivos y garantizar que un cambio en las convenciones de entorno solo requiere modificar un único lugar

## ✅ Criterios de aceptación

### Escenario principal – Entorno válido, skill continúa normalmente
```gherkin
Dado que un skill SDDF tiene en su Paso 0 la instrucción "Invocar skill-preflight"
  Y la variable SDDF_ROOT apunta a un directorio existente (ej. "docs")
  Y los subdirectorios docs/specs/releases/ y docs/specs/stories/ existen
  Y openspec/config.yaml tiene contenido
Cuando el skill ejecuta el Paso 0
Entonces skill-preflight emite "[OK]  SDDF_ROOT = docs"
  Y skill-preflight emite "[OK]" para cada subdirectorio verificado
  Y skill-preflight emite "✓ Entorno OK — listo para continuar"
  Y el skill invocador recibe SPECS_BASE = "docs" y prosigue su ejecución
```

### Escenario alternativo / error – SDDF_ROOT no definida, fallback silencioso
```gherkin
Dado que SDDF_ROOT no está definida en el entorno
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[WARNING] SDDF_ROOT no definida → Se usará 'docs' como valor por defecto"
  Y skill-preflight establece SPECS_BASE = "docs"
  Y skill-preflight emite "✓ Entorno OK — listo para continuar"
  Pero el skill invocador no se detiene
```

### Escenario alternativo / error – SDDF_ROOT apunta a ruta inexistente
```gherkin
Dado que SDDF_ROOT está definida como ".docs"
  Y el directorio ".docs" no existe en el sistema de archivos
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[ERROR]  SDDF_ROOT apunta a ruta inexistente: .docs → Crear el directorio o corregir la variable"
  Y skill-preflight emite "✗ Entorno inválido — corregir los errores antes de continuar"
  Pero el skill invocador no ejecuta ningún paso adicional
```

### Escenario alternativo / error – Template requerido faltante
```gherkin
Dado que el skill invocador declara que requiere "assets/mi-template.md"
  Y el archivo ".claude/skills/<skill-name>/assets/mi-template.md" no existe
Cuando el skill ejecuta el Paso 0 invocando skill-preflight
Entonces skill-preflight emite "[ERROR]  Template faltante: assets/mi-template.md → Verificar que el archivo existe en assets/"
  Y skill-preflight detiene la ejecución del skill invocador
```

### Requirement: Un solo punto de mantenimiento para las convenciones de entorno
Cualquier cambio en las convenciones de rutas del framework SDDF (ej. renombrar `specs/projects/` a `specs/projects/`) SHALL requerir modificar únicamente `skill-preflight/SKILL.md` para que todos los skills queden alineados, sin necesidad de editar los demás SKILL.md.

## ⚙️ Criterios no funcionales

* Compatibilidad: skill-preflight debe funcionar en Claude Code, OpenCode y GitHub Copilot sin dependencias externas más allá de Markdown
* Transparencia: el informe de preflight debe ser legible directamente en la sesión de chat (formato `[OK]/[WARNING]/[ERROR]`)

## 📎 Notas / contexto adicional

La lógica original (4 pasos de validación de SDDF_ROOT) se migró desde ~15 skills que la duplicaban. Los skills `readme-builder`, `docs-wiki-builder`, `skill-master` y los openspec-* no requerían el bloque (sin SDDF_ROOT → no migrados). La migración completa se realizó en el change `skill-preflight` del pipeline OpenSpec. El skill `story-evaluation` tampoco requiere preflight (no escribe artefactos a disco).
