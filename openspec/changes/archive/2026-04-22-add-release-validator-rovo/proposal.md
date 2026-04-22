## Why

El pipeline SDDF requiere que los releases cumplan un formato estructurado antes de avanzar. Actualmente esta validación solo existe como skill de Claude Code (`/release-format-validation`), pero los PMs y Tech Leads que trabajan en Jira necesitan ejecutarla directamente desde Rovo sin salir del contexto de Jira ni requerir acceso al CLI.

## What Changes

- Se agrega el archivo `rovo/release-validator-agent.md` con el agente Rovo que valida el formato de la descripción de un Epic tipo release en Jira
- El agente acepta como input: nombre parcial de Epic, Key de workitem Jira, o texto libre de descripción de release
- El agente produce tres estados de salida: **APROBADO**, **REFINAR** (con lista de secciones faltantes) o **RECHAZADO** (input inválido o no encontrado)
- El template canónico de release queda incrustado en las instrucciones del agente (sin referencias a archivos externos, ya que el agente vive dentro del alcance de Jira)

## Capabilities

### New Capabilities

- `release-validator-rovo`: Agente Rovo que valida que la descripción de un Epic tipo release en Jira contiene las secciones obligatorias del template canónico (Título, Versión, Estado, Fecha, Descripción, Features, Flujos Críticos / Smoke Tests)

### Modified Capabilities

_(ninguna — este cambio es puramente aditivo)_

## Impact

- **Nuevo archivo:** `rovo/release-validator-agent.md`
- **Sin impacto en código existente:** el agente es un documento Markdown desplegado en Rovo; no modifica skills, agentes de Claude Code ni lógica del pipeline SDDF
- **Consistencia con skill existente:** la lógica del agente replica las fases del skill `.claude/skills/release-format-validation` adaptada al runtime Rovo (sin acceso a sistema de archivos, sin referencias externas)
