---
alwaysApply: false
---
**Título**: Npm Install locally
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-23
**FINVEST Score:** —
**FINVEST Decisión:** —
---

## 📖 Historia: Npm Install locally

**Como** desarrollador que trabaja en un proyecto específico que usa Claude Code
**Quiero** instalar `agile-sddf` localmente con `npm install agile-sddf` y que los skills se copien al `.claude/` del proyecto
**Para** tener los skills del framework disponibles solo en ese proyecto sin afectar ni depender de mi configuración global `~/.claude/`

## ✅ Criterios de aceptación

### Escenario principal – Instalación local copia al directorio del proyecto
```gherkin
Dado que el usuario está en el directorio raíz de un proyecto con `package.json`
  Y no existe previamente `.claude/skills/` en ese directorio
Cuando ejecuta "npm install agile-sddf"
Entonces el script postinstall detecta que es una instalación local
  Y copia el contenido de `.claude/skills/` del paquete a `./.claude/skills/` del proyecto
  Y copia el contenido de `.claude/agents/` del paquete a `./.claude/agents/` del proyecto
  Y no modifica ningún archivo en "~/.claude/"
  Y muestra el resumen: "SDDF installed (local): X skills, Y agents (Z skipped)"
```

### Escenario alternativo – La instalación global sigue copiando a ~/.claude/
```gherkin
Dado que el usuario ejecuta "npm install -g agile-sddf"
Cuando el script postinstall se ejecuta
Entonces detecta que es una instalación global (`npm_config_global === 'true'`)
  Y copia los skills y agentes a "~/.claude/skills/" y "~/.claude/agents/"
  Y no modifica ningún archivo en el directorio de trabajo actual
```

### Escenario alternativo / error – Skill ya existe en el destino local
```gherkin
Dado que el directorio ".claude/skills/story-creation/" ya existe en el proyecto
Cuando el usuario ejecuta "npm install agile-sddf" sin flag de fuerza
Entonces el script omite ese directorio sin sobrescribirlo
  Y muestra el aviso: "Skipped (already exists): .claude/skills/story-creation/"
  Pero continúa instalando los demás skills sin interrumpir el proceso
```

### Escenario alternativo / error – `.claude` existe pero no es un directorio
```gherkin
Dado que existe un archivo llamado ".claude" (no directorio) en la raíz del proyecto
Cuando el script postinstall intenta copiar los skills
Entonces muestra el error: "SDDF error: .claude exists but is not a directory"
  Y termina con exit code 1
  Pero no modifica el archivo existente
```

### Requerimiento
El script SHALL detectar el modo de instalación mediante la variable de entorno estándar de npm: `process.env.npm_config_global !== 'true'` indica instalación local. No se deben usar heurísticas de paths ni flags propios.

## ⚙️ Criterios no funcionales

* Compatibilidad: debe funcionar en macOS, Linux y Windows usando `process.cwd()` para resolver el directorio del proyecto
* Rendimiento: la detección del modo de instalación no debe agregar latencia perceptible al proceso de instalación
* Sin efectos secundarios: una instalación local no debe nunca escribir en `~/.claude/`

## 📎 Notas / contexto adicional

La detección del modo se basa en `process.env.npm_config_global` (variable estándar que npm inyecta en scripts). Cuando es `'true'`, la instalación es global; en cualquier otro caso, se trata como local.

El directorio destino en instalación local es `path.join(process.cwd(), '.claude')`. En instalación global es `path.join(os.homedir(), '.claude')`.

El flag `--force` para sobrescritura queda fuera del scope de esta historia. La instalación con `pnpm` o `yarn` queda fuera del scope de esta historia (requiere validación de las variables de entorno equivalentes).

Depende de: `story-FEAT-040-instalar-skills-via-postinstall.md` (script postinstall base).
