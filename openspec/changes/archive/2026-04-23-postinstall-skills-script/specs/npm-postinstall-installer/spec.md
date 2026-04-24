## ADDED Requirements

### Requirement: Copia automática de skills y agentes tras instalación global
Tras ejecutar `npm install -g agile-sddf`, el script `postinstall.js` SHALL copiar automáticamente el contenido de `.claude/skills/` a `~/.claude/skills/` y `.claude/agents/` a `~/.claude/agents/` en el sistema del usuario.

#### Scenario: Instalación limpia en macOS/Linux
- **WHEN** el usuario ejecuta `npm install -g agile-sddf` en un sistema sin skills SDDF previos
- **THEN** el script postinstall se ejecuta automáticamente al finalizar la instalación
- **THEN** todos los subdirectorios de `.claude/skills/` quedan copiados en `~/.claude/skills/`
- **THEN** todos los subdirectorios de `.claude/agents/` quedan copiados en `~/.claude/agents/`
- **THEN** el script imprime por consola la lista de skills y agentes instalados

#### Scenario: Instalación en Windows
- **WHEN** el usuario ejecuta `npm install -g agile-sddf` en Windows
- **THEN** el script resuelve el destino como `%USERPROFILE%\.claude\skills\` y `%USERPROFILE%\.claude\agents\`
- **THEN** los archivos se copian correctamente sin requerir herramientas de shell nativas del SO

### Requirement: Creación de directorios destino si no existen
El script SHALL crear los directorios `~/.claude/skills/` y `~/.claude/agents/` si no existen antes de copiar.

#### Scenario: Directorio destino inexistente
- **WHEN** el usuario no tiene `~/.claude/` creado (primera instalación de Claude Code o entorno limpio)
- **THEN** el script crea la estructura de directorios necesaria
- **THEN** los skills y agentes se copian sin errores

### Requirement: Protección de archivos existentes (no sobrescritura)
El script SHALL omitir la copia de cualquier subdirectorio de skill o agente que ya exista en el destino, sin error y sin sobrescribir.

#### Scenario: Skill ya instalado previamente
- **WHEN** el usuario ya tiene `~/.claude/skills/story-creation/` en su sistema
- **WHEN** ejecuta `npm install -g agile-sddf` sin flag de fuerza
- **THEN** el script omite ese directorio
- **THEN** imprime un aviso: `Skipped (already exists): ~/.claude/skills/story-creation/`
- **THEN** continúa instalando los demás skills sin interrumpir el proceso

### Requirement: Mensajes de progreso en consola
El script SHALL imprimir mensajes por stdout para cada skill/agente instalado u omitido, y un resumen final.

#### Scenario: Instalación con mezcla de nuevos y existentes
- **WHEN** el usuario tiene algunos skills ya instalados y otros no
- **THEN** el script imprime `Installed: ~/.claude/skills/<name>/` para cada skill nuevo
- **THEN** el script imprime `Skipped (already exists): ~/.claude/skills/<name>/` para cada skill omitido
- **THEN** al finalizar imprime un resumen: `SDDF installed: X skills, Y agents (Z skipped)`
