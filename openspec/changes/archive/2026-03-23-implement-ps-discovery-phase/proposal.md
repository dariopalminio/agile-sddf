## Why

El pipeline de ProjectSpecFactory carece de la fase Discovery, el tercer paso del workflow que transforma la intención validada (`project-intent.md`) en un mapa estructurado de usuarios, journeys e hipótesis (`discovery.md`). Sin esta fase, el sistema no puede guiar al PM desde el "qué queremos construir" hacia el "para quién y cómo validarlo".

## What Changes

- **Nuevo skill** `ps-discovery` (`.claude/skills/ps-discovery/SKILL.md`) — orchestrator que valida el input, invoca al agente y confirma el output
- **Nuevo agente** `discovery-agent` (`.claude/agents/discovery-agent.md`) — conduce la entrevista de discovery sección por sección derivando preguntas del template en runtime
- **Nuevo template** `discovery-template.md` (`.claude/skills/ps-discovery/templates/discovery-template.md`) — estructura del documento con headers `##` y comentarios `<!-- -->` que guían la captura; el template original en `docs/templates/discovery.md` nunca se modifica

## Capabilities

### New Capabilities

- `ps-discovery-skill`: Skill autónomo que orquesta la fase Discovery del pipeline. Verifica que `project-intent.md` exista, delega al `discovery-agent` y confirma que `$SPECS_BASE/specs/discovery.md` se generó correctamente.
- `discovery-agent`: Agente especializado que lee `project-intent.md`, extrae headers y comentarios del template en runtime, conduce la entrevista por secciones (máx 3-4 preguntas por ronda), infiere contenido faltante marcándolo `[inferido]` y escribe `$SPECS_BASE/specs/discovery.md`.
- `discovery-template`: Template con secciones Product Vision, Usuarios Clave, User Journey Map, Discovery Questions e Hipótesis/Experimentos. Vive junto al skill; nunca se modifica.

### Modified Capabilities

_(ninguna — no cambian specs existentes)_

## Impact

- Completa el tercer eslabón del workflow `Funnel → Draft → Discovery → SPECIFY → Approval → Planning → Finished`
- Archivos nuevos: `.claude/agents/discovery-agent.md`, `.claude/skills/ps-discovery/SKILL.md`, `.claude/skills/ps-discovery/templates/discovery-template.md`
- Documento de salida: `$SPECS_BASE/specs/discovery.md`
- Sin dependencias externas; sin cambios al filesystem de otros estados
- El comando `/ps-discover` ya existe en CLAUDE.md como placeholder; este cambio lo implementa
