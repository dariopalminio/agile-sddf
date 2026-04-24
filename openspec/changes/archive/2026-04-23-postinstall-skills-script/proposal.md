## Why

Al instalar `agile-sddf` globalmente con npm, los archivos de `.claude/` quedan en el directorio global de node_modules pero no llegan a `~/.claude/`, por lo que Claude Code no los detecta. El postinstall script resuelve este problema copiando automáticamente skills y agentes al destino correcto sin pasos manuales.

## What Changes

- Agregar `scripts/postinstall.js` — script Node.js que copia `.claude/skills/` y `.claude/agents/` a `~/.claude/skills/` y `~/.claude/agents/` usando `fs-extra`
- Agregar `fs-extra` como dependencia en `package.json`
- Registrar `"postinstall": "node scripts/postinstall.js"` en la sección `scripts` de `package.json`
- Agregar `"scripts/"` al campo `files` de `package.json` para que el script se incluya en el paquete publicado
- El script omite archivos que ya existen (sin sobrescribir) y muestra mensajes de progreso por consola

## Capabilities

### New Capabilities
- `npm-postinstall-installer`: Script Node.js que se ejecuta automáticamente tras `npm install -g agile-sddf` para copiar skills y agentes a `~/.claude/`. Soporta macOS, Linux y Windows. Respeta archivos existentes (no sobrescribe sin flag explícito).

### Modified Capabilities
_(ninguna — cambio aditivo; no modifica comportamiento de skills ni agentes existentes)_

## Impact

- **Archivos nuevos**: `scripts/postinstall.js`
- **Archivos modificados**: `package.json` (agregar `scripts.postinstall`, campo `fs-extra` en `dependencies`, `"scripts/"` en `files`)
- **Dependencias externas nuevas**: `fs-extra` (npm, sin dependencias nativas — compatible con todos los SO)
- **Sin cambios en `.claude/`**: los skills y agentes no se modifican; solo se copian en destino
