## Context

El paquete npm `agile-sddf` empaqueta `.claude/skills/` y `.claude/agents/` pero tras `npm install -g`, esos archivos quedan dentro del directorio global de node_modules (ej. `/usr/local/lib/node_modules/agile-sddf/`). Claude Code solo detecta skills en `~/.claude/` (global) o en `.claude/` del proyecto activo. Sin un mecanismo de copia, el paquete es instalable pero no funcional.

El hook `postinstall` de npm es el mecanismo estándar para ejecutar código inmediatamente después de la instalación. Se ejecuta automáticamente sin acción del usuario tanto en instalaciones globales (`-g`) como locales.

## Goals / Non-Goals

**Goals:**
- `npm install -g agile-sddf` copia `.claude/skills/` → `~/.claude/skills/` y `.claude/agents/` → `~/.claude/agents/` automáticamente
- Compatible con macOS, Linux y Windows sin herramientas externas
- No sobrescribe skills o agentes que el usuario ya tenga instalados (protección por defecto)
- Muestra mensajes claros de progreso y omisiones en consola

**Non-Goals:**
- Flag `--force` para sobrescritura (fuera de scope de esta historia)
- Soporte para GitHub Copilot (`.github/`) o cualquier otro destino que no sea `~/.claude/`
- Verificación de que Claude Code está instalado en el sistema
- Desinstalación o limpieza al hacer `npm uninstall`

## Decisions

### Usar `fs-extra` en lugar de `fs` nativo
**Decisión**: Dependencia de `fs-extra` para las operaciones de copia.
**Alternativa**: `fs.cpSync` (Node.js ≥ 16.7) sin dependencias externas.
**Rationale**: `fs-extra` provee `copy()` con opción `overwrite: false` que maneja directorios recursivamente y filtra archivos existentes de forma elegante. `fs.cpSync` existe pero su API de filtrado es más verbosa y su comportamiento en Windows con paths que contienen espacios es menos predecible. El story explícitamente requiere `fs-extra`.

### Destino basado en `os.homedir()` + `.claude/`
**Decisión**: Usar `path.join(os.homedir(), '.claude')` como destino base.
**Alternativa**: Variable de entorno `CLAUDE_HOME` configurable.
**Rationale**: Claude Code usa `~/.claude` como directorio global estándar en todos los SO. `os.homedir()` resuelve correctamente en macOS (`/Users/<user>`), Linux (`/home/<user>`) y Windows (`C:\Users\<user>`). La variable de entorno añade complejidad sin caso de uso real documentado.

### Un script único (`scripts/postinstall.js`)
**Decisión**: Un único archivo CommonJS sin transpilación.
**Alternativa**: Script separado por SO o ESM con transpilación.
**Rationale**: El script es simple (copiar dos directorios con lógica de skip). Un archivo CJS es compatible con cualquier versión de Node.js ≥ 14 sin configuración adicional. Mantiene el repo minimalista.

### Copiar por directorio, skip a nivel de subdirectorio (skill/agente completo)
**Decisión**: Si un subdirectorio de skill ya existe en destino, se omite todo el skill.
**Alternativa**: Skip a nivel de archivo individual.
**Rationale**: Un skill es una unidad atómica (carpeta con SKILL.md + templates). Mezclar versiones de un skill (algunos archivos nuevos, otros viejos) podría romper su comportamiento. Skip a nivel de carpeta es más predecible para el usuario.

## Risks / Trade-offs

- **[Riesgo] Permisos en instalaciones globales**: `npm install -g` puede requerir `sudo` en algunos sistemas Linux sin nvm. El postinstall hereda los permisos del proceso npm — si npm tiene acceso a `~/.claude/`, el script también. Si no, fallará con un error claro de permisos (no silencioso).
- **[Riesgo] `~/.claude/` no existe antes de instalar Claude Code**: El script debe crear los directorios destino si no existen (`fs-extra` lo hace automáticamente con `ensureDir`).
- **[Trade-off] Skip a nivel de carpeta puede dejar skills desactualizados**: Si el usuario ya tiene `story-creation/` de una versión anterior, no recibirá actualizaciones automáticas. Aceptable: el usuario debe actualizar manualmente o usar `--force` en una versión futura.
- **[Riesgo] El script falla si `fs-extra` no está instalado**: Como es `dependency` (no `devDependency`), npm lo instala junto con el paquete. Sin embargo, en entornos con `--ignore-scripts` el postinstall no se ejecuta — documentar en README.
