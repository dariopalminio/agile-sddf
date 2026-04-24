## 📖 Historia: Instalar skills via postinstall (script)

**Como** desarrollador que adopta el framework SDDF
**Quiero** que al ejecutar `npm install -g @sddf/core` los skills y agentes se copien automáticamente a `~/.claude/`
**Para** tener el pipeline SDDF disponible en Claude Code sin pasos de configuración manual adicionales

## ✅ Criterios de aceptación

### Escenario principal – Instalación limpia en macOS/Linux
```gherkin
Dado que el usuario tiene Node.js y npm instalados
  Y no existe previamente ningún skill de SDDF en "~/.claude/skills/"
Cuando ejecuta "npm install -g @sddf/core"
Entonces el script "postinstall" se ejecuta automáticamente
  Y todos los skills de ".claude/skills/" se copian a "~/.claude/skills/"
  Y todos los agentes de ".claude/agents/" se copian a "~/.claude/agents/"
```

### Escenario principal – Instalación limpia en Windows
```gherkin
Dado que el usuario tiene Node.js y npm instalados en Windows
  Y no existe previamente ningún skill de SDDF en "%USERPROFILE%\.claude\skills\"
Cuando ejecuta "npm install -g @sddf/core"
Entonces el script "postinstall" se ejecuta automáticamente
  Y los skills y agentes se copian a "%USERPROFILE%\.claude\skills\" y "%USERPROFILE%\.claude\agents\"
```

### Escenario alternativo / error – Archivo de skill ya existe (protección contra sobrescritura)
```gherkin
Dado que el usuario ya tiene un skill propio en "~/.claude/skills/story-creation/SKILL.md"
Cuando ejecuta "npm install -g @sddf/core" sin flag "--force"
Entonces el script omite el archivo existente sin sobreescribirlo
  Y muestra un aviso: "Skipped (already exists): ~/.claude/skills/story-creation/"
  Pero continúa instalando los demás skills sin errores
```

### Requerimiento
El script `postinstall` no debe usar comandos de shell nativos del SO directamente. Debe usar `fs-extra` para compatibilidad cross-platform. El comportamiento `--force` (sobrescritura) queda fuera del scope de esta historia.

## ⚙️ Criterios no funcionales

* El script debe completar la instalación en menos de 10 segundos en una máquina estándar
* No debe requerir permisos de administrador/root adicionales a los que ya otorga `npm install -g`

## 📎 Notas / contexto adicional

**Prerequisito técnico (TAD):** antes de implementar, verificar que Claude Code carga skills desde `~/.claude/skills/` globalmente (no solo desde el directorio del proyecto activo). Si esto no aplica, el mecanismo de instalación central debe rediseñarse.

La opción de instalar en `.github/` para GitHub Copilot queda fuera del scope de esta historia.

Depende de: `story-publicar-framework-en-npm.md` (el paquete debe existir en npm para ser instalable).
