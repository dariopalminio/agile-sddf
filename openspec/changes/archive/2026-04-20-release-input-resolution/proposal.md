## Why

El skill `release-format-validation` requiere que el usuario recuerde la ruta exacta del archivo de release para invocarlo, lo que genera fricción innecesaria. Formalizar la resolución de input como comportamiento explícito garantiza que el skill sea usable con nombre corto, nombre con extensión o ruta relativa, y que los casos de error (archivo no encontrado, múltiples coincidencias) estén correctamente especificados.

## What Changes

- Se formaliza y especifica el comportamiento de resolución de input del skill `release-format-validation` (actualmente implementado en Fase 0 del SKILL.md sin spec dedicada)
- Se define explícitamente el algoritmo de búsqueda en `docs/specs/releases/`, incluyendo manejo de múltiples coincidencias y archivo no encontrado
- El resultado de la resolución es el prerequisito para la fase de validación de estructura

## Capabilities

### New Capabilities

- `release-input-resolution`: Capacidad del skill `release-format-validation` para aceptar nombre corto (con o sin `.md`) o ruta relativa completa y resolver el archivo de release concreto antes de iniciar la validación.

### Modified Capabilities

## Impact

- Afecta únicamente `.claude/skills/release-format-validation/SKILL.md` (Fase 0)
- Sin cambios en otros skills ni en templates
- Comportamiento ya parcialmente implementado; este change lo formaliza con spec y cobertura de casos borde
