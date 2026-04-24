## Why

El framework SDDF solo es accesible clonando el repositorio manualmente, lo que genera fricción de adopción. Publicarlo en npm permite instalar el pipeline completo con `npm install -g @sddf/core` y hace el framework descubrible en npmjs.com.

## What Changes

- Agregar `package.json` con nombre de paquete, versión semver, descripción y campo `files` que incluya `.claude/`, `README.md` y `LICENSE`
- Agregar `.npmignore` para excluir archivos de desarrollo (`openspec/`, `docs/`, `.tmp/`, `docker-compose.dev.yml`, `Dockerfile.dev`, `gem/`, `rovo/`, `assets/`)
- Verificar que el `README.md` tiene una sección de instalación útil como página principal del paquete en npmjs.com
- Publicar manualmente con `npm publish --access public` para validar la configuración

## Capabilities

### New Capabilities
- `npm-distribution`: El framework SDDF puede publicarse en el registro npm y ser instalado globalmente con `npm install -g`. Define los requisitos del `package.json`, del campo `files`, y del proceso de publicación manual.

### Modified Capabilities

_(ninguna — cambio aditivo sin modificar comportamiento existente)_

## Impact

- **Archivos nuevos**: `package.json`, `.npmignore`
- **Archivos posiblemente modificados**: `README.md` (añadir sección de instalación si no existe)
- **Dependencias externas**: cuenta de npm con organización `@sddf` o nombre alternativo `agile-sddf`
- **Sin cambios en `.claude/`**: los skills y agentes no se modifican; solo se empaquetan
