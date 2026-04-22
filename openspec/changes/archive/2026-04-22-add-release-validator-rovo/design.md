## Context

El pipeline SDDF cuenta con el skill `/release-format-validation` para Claude Code, que valida que un archivo de release cumpla el template obligatorio. Sin embargo, los PMs y Tech Leads que trabajan en Jira no tienen acceso al CLI de Claude Code; necesitan una herramienta equivalente dentro del ecosistema Atlassian.

Los agentes Rovo existentes en `rovo/` (`story-creator-agent.md`, `story-evaluator-agent.md`, `story-splitter-agent.md`) demuestran el patrón establecido: archivos Markdown con secciones **Nombre**, **Descripción**, **Comportamiento** e **Instrucciones** que Rovo interpreta como prompts de sistema para un agente conversacional.

A diferencia del skill de Claude Code, el agente Rovo no puede leer archivos del sistema de archivos ni referenciar paths externos. Todo el conocimiento necesario (template canónico, reglas de validación) debe estar incrustado en el documento del agente.

## Goals / Non-Goals

**Goals:**
- Crear `rovo/release-validator-agent.md` siguiendo la convención de agentes Rovo existentes
- El agente acepta tres formas de input: nombre/Key de Epic en Jira, o texto libre de descripción de release
- El agente valida presencia de las secciones obligatorias: Título, Versión, Estado, Fecha, Descripción, Features, Flujos Críticos / Smoke Tests
- El agente produce exactamente uno de tres estados: APROBADO, REFINAR (con lista de faltantes), RECHAZADO

**Non-Goals:**
- Integración con Jira API para buscar Epics automáticamente (Rovo maneja esto via contexto de conversación)
- Generación o corrección de contenido del release
- Validación semántica del contenido (solo se valida presencia de secciones)
- Modificación del skill `/release-format-validation` existente en Claude Code

## Decisions

### D1: Template canónico incrustado en las instrucciones

**Decisión:** El template de release se incrusta íntegramente dentro de la sección `## Instrucciones` del agente Rovo bajo el encabezado `## Template canónico (fuente de verdad)`.

**Alternativa considerada:** Referenciar el template externo en `docs/specs/templates/release-spec-template.md`. Descartada porque el agente Rovo no tiene acceso al sistema de archivos; cualquier referencia externa sería inaccesible en runtime.

**Rationale:** Al incrustar el template, el agente es completamente autónomo dentro del contexto de Jira. El costo es que los cambios al template deben propagarse manualmente al agente Rovo, pero dado que el template es estable, este es un trade-off aceptable.

### D2: Tres estados de salida idénticos al skill de Claude Code

**Decisión:** Mantener el mismo vocabulario de estados: APROBADO / REFINAR / RECHAZADO.

**Rationale:** Consistencia con el pipeline SDDF. PMs que usen ambas herramientas recibirán la misma semántica de respuesta sin necesidad de reaprender.

### D3: Input flexible (nombre, Key, texto libre)

**Decisión:** El agente acepta el input que el usuario proporcione en la conversación Rovo, sin forzar un formato específico.

**Alternativa considerada:** Requerir siempre la Key de Jira. Descartada porque limita la usabilidad cuando el usuario tiene el texto de descripción a mano pero no la Key exacta.

**Rationale:** Flexibilidad de input es consistente con cómo los agentes Rovo existentes manejan input (el evaluador de historias acepta el texto directamente).

## Risks / Trade-offs

- **Desincronización de template** → Si el `release-spec-template.md` evoluciona, el agente Rovo puede quedar desfasado. Mitigación: documentar en el archivo del agente la versión/fecha del template incrustado y revisar en cada release del framework.
- **Dependencia de contexto conversacional** → El agente no puede consultar Jira directamente; depende de que el usuario le pegue el contenido del Epic o que Rovo lo inyecte via contexto. Mitigación: las instrucciones del agente guían al usuario sobre qué pegar si el contexto no está disponible.
