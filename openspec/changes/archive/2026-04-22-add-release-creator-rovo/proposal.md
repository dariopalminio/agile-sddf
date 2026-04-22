## Why

Los PMs y Tech Leads que gestionan releases en Jira necesitan crear Epics tipo release con una estructura consistente y completa. Actualmente deben copiar el template manualmente desde fuentes externas, lo que genera releases incompletos o con formato inconsistente. Un agente Rovo que genere la descripción del Epic guiado por el template canónico elimina este trabajo manual y garantiza la estructura desde el momento de creación.

## What Changes

- Se agrega el archivo `rovo/release-creator-agent.md` con el agente Rovo que genera la descripción de un nuevo Epic tipo release siguiendo el template canónico
- El agente acepta como input: nombre del release, descripción de negocio, lista de features y datos de frontmatter (versión, estado)
- El agente puede hacer preguntas iterativas para completar secciones faltantes antes de generar el output final
- El output es texto listo para pegar en la descripción del Epic en Jira; el agente no crea el workitem directamente
- El template canónico queda incrustado en las instrucciones del agente (sin referencias a archivos externos)

## Capabilities

### New Capabilities

- `release-creator-rovo`: Agente Rovo que genera la descripción completa de un Epic tipo release siguiendo el template canónico, con todas las secciones obligatorias (Título, Versión, Estado, Fecha, Descripción, Features, Flujos Críticos / Smoke Tests) y capacidad de solicitar datos faltantes al usuario

### Modified Capabilities

_(ninguna — este cambio es puramente aditivo)_

## Impact

- **Nuevo archivo:** `rovo/release-creator-agent.md`
- **Sin impacto en código existente:** el agente es un documento Markdown desplegado en Rovo; no modifica skills, agentes de Claude Code ni lógica del pipeline SDDF
- **Complementario a FEAT-032:** el agente creador (`release-creator-agent.md`) y el agente validador (`release-validator-agent.md`) forman un par: creación seguida de validación de formato
