## Why

Los proyectos que usan OpenSpec requieren configurar manualmente `openspec/config.yaml` con el contexto del proyecto, lo que es tedioso y propenso a omisiones. Un skill automatizado que lea los archivos de documentación existentes (README.md, CLAUDE.md, AGENTS.md) y genere el config con contexto real acelera el onboarding de nuevos proyectos y mantiene la configuración alineada con la realidad del proyecto.

## What Changes

- Se introduce el skill `openspec-init-config` que automatiza la carga del contexto del proyecto en `openspec/config.yaml`
- El skill instruye al modelo a leer exhaustivamente README.md, AGENTS.md (si existe), CLAUDE.md (si existe) y los archivos del proyecto
- El skill genera/actualiza `openspec/config.yaml` siguiendo el template existente del archivo
- El skill se ubica en `.claude/skills/openspec-init-config/` siguiendo las convenciones del proyecto

## Capabilities

### New Capabilities

- `openspec-init-config`: Skill que lee la documentación del proyecto y escribe el contexto en `openspec/config.yaml` siguiendo su template

### Modified Capabilities

<!-- No hay capabilities existentes cuyo comportamiento cambie -->

## Impact

- Nuevo archivo `.claude/skills/openspec-init-config/SKILL.md`
- Ningún cambio a código existente ni breaking changes
- Depende de que exista `openspec/config.yaml` con un template (ya presente en el proyecto)
