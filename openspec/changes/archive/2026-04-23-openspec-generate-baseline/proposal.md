## Why

Los proyectos existentes que adoptan OpenSpec no tienen forma automatizada de generar su línea base de especificaciones: o bien arrancan desde cero ignorando lo ya implementado, o bien documentan manualmente lo que el código ya hace. Un skill que haga ingeniería inversa del código fuente y genere automáticamente un change de OpenSpec archivado como baseline elimina esta fricción y deja el proyecto con especificaciones vivas desde el primer día.

## What Changes

- Se introduce el skill `openspec-generate-baseline` que orquesta el flujo completo de generación de línea base
- El skill ejecuta internamente `/opsx:propose` con una instrucción de ingeniería inversa: lee `src/`, `README.md` y `AGENTS.md` (si existe) para deducir el comportamiento actual, reglas de negocio y flujos principales
- El skill salta la fase de apply (no hay implementación que hacer: el código ya existe) y ejecuta directamente `/opsx:archive` para archivar el change como baseline
- El skill se ubica en `.claude/skills/openspec-generate-baseline/` siguiendo las convenciones del proyecto

## Capabilities

### New Capabilities

- `openspec-generate-baseline`: Skill que genera una línea base de especificaciones OpenSpec mediante ingeniería inversa del código fuente, propone los artefactos y los archiva directamente sin fase de apply

### Modified Capabilities

<!-- No hay capabilities existentes cuyo comportamiento cambie -->

## Impact

- Nuevo archivo `.claude/skills/openspec-generate-baseline/SKILL.md`
- Sin cambios a código existente ni breaking changes
- Depende de que existan: `openspec/config.yaml`, los skills `opsx:propose` y `opsx:archive`, y código fuente en `src/` (o equivalente)
