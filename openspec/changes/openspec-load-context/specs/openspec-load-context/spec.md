## ADDED Requirements

### Requirement: Skill openspec-init-config disponible como comando
El sistema SHALL proveer un skill invocable como `/openspec-init-config` ubicado en `.claude/skills/openspec-init-config/SKILL.md`, siguiendo las convenciones de skills del proyecto SDDF (frontmatter YAML + instrucciones Markdown).

#### Scenario: Skill existe y es invocable
- **WHEN** el usuario ejecuta `/openspec-init-config`
- **THEN** el sistema carga y ejecuta el skill desde `.claude/skills/openspec-init-config/SKILL.md`

### Requirement: Lectura exhaustiva de documentación del proyecto
El skill SHALL instruir al modelo a leer los archivos README.md, AGENTS.md (si existe) y CLAUDE.md (si existe), así como otros archivos relevantes del proyecto, antes de escribir el contexto.

#### Scenario: Archivos de documentación presentes
- **WHEN** el skill es ejecutado y existen README.md, CLAUDE.md y AGENTS.md en el proyecto
- **THEN** el modelo lee los tres archivos para construir el contexto

#### Scenario: Archivos opcionales ausentes
- **WHEN** el skill es ejecutado y AGENTS.md o CLAUDE.md no existen
- **THEN** el modelo lee solo los archivos disponibles y continúa sin error

### Requirement: Escritura del contexto en openspec/config.yaml
El skill SHALL instruir al modelo a escribir el campo `context:` en `openspec/config.yaml` siguiendo el template del archivo, preservando el resto del contenido (schema, rules).

#### Scenario: config.yaml existe con template
- **WHEN** el skill es ejecutado y `openspec/config.yaml` existe
- **THEN** el modelo actualiza únicamente el campo `context:` con el contexto inferido del proyecto

#### Scenario: Contenido del contexto refleja el proyecto
- **WHEN** el skill escribe el contexto
- **THEN** el campo `context:` incluye stack tecnológico, convenciones y dominio del proyecto inferidos de la documentación leída
