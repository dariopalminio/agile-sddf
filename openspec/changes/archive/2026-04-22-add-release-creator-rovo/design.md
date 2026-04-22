## Context

El pipeline SDDF requiere que los releases sigan el template canónico definido en `docs/specs/templates/release-spec-template.md`. Actualmente los PMs crean Epics manualmente, lo que produce releases con estructura inconsistente antes de que el validador (`release-validator-agent.md`, FEAT-032) los rechace por secciones faltantes.

El agente creador (`release-creator-agent.md`) completa el flujo de Rovo para releases: creación guiada → validación de formato. Sigue la misma convención de agentes Rovo que `story-creator-agent.md`: archivo Markdown con secciones Nombre / Descripción / Comportamiento / Instrucciones, desplegado en el runtime Rovo de Atlassian Jira.

A diferencia de un script o CLI, el agente Rovo es conversacional: puede solicitar datos faltantes al usuario de forma interactiva antes de generar el output final.

## Goals / Non-Goals

**Goals:**
- Crear `rovo/release-creator-agent.md` siguiendo la convención de agentes Rovo existentes
- El agente guía al usuario mediante preguntas iterativas para recopilar los datos mínimos requeridos (nombre, descripción, al menos un feature)
- El agente genera la descripción completa del Epic con todas las secciones obligatorias y campos de frontmatter
- El output es texto Markdown listo para pegar en la descripción del Epic en Jira
- El template canónico queda incrustado en las instrucciones (sin referencias a archivos externos)

**Non-Goals:**
- Crear el workitem Epic directamente en Jira via API
- Redactar el contenido de negocio por el usuario (el agente genera estructura con placeholders orientativos)
- Modificar el agente validador (`release-validator-agent.md`)
- Validar el release generado (esa responsabilidad es del agente FEAT-032)

## Decisions

### D1: Flujo conversacional iterativo (no one-shot)

**Decisión:** El agente puede hacer preguntas al usuario para completar secciones faltantes, en lugar de generar un output parcial con placeholders vacíos.

**Alternativa considerada:** Generar siempre el output completo con placeholders marcados como `[REQUERIDO: completar]`. Descartada porque produce un documento con huecos que el PM debe rellenar manualmente, sin guía contextual.

**Rationale:** El flujo conversacional es consistente con cómo los agentes Rovo como `story-creator-agent.md` operan. Además, el usuario ya está en un contexto de chat; preguntas iterativas se perciben como asistencia, no como fricción.

### D2: Template canónico incrustado en las instrucciones

**Decisión:** El template completo de release se incrusta en la sección `## Template canónico (fuente de verdad)` dentro de las instrucciones del agente.

**Rationale:** El agente Rovo no tiene acceso al sistema de archivos. Esta decisión es idéntica a la tomada para `release-validator-agent.md` (FEAT-032), manteniendo consistencia entre los dos agentes del flujo de releases.

**Trade-off:** Los cambios al template deben propagarse manualmente al agente. Mitigación: documentar la versión/fecha del template incrustado en el propio archivo del agente.

### D3: Output como bloque de texto Markdown (no acción directa en Jira)

**Decisión:** El agente produce el texto de la descripción del Epic como bloque de texto que el PM copia y pega en Jira.

**Rationale:** Evita dependencias en la API de Jira y permisos adicionales. El flujo manual de copiar/pegar es aceptable dado que la creación de Epics es un evento puntual, no de alta frecuencia.

## Risks / Trade-offs

- **Desincronización de template** → Si el `release-spec-template.md` evoluciona, el agente puede quedar desfasado. Mitigación: documentar la versión del template incrustado y revisar en cada release del framework.
- **Calidad del contenido generado** → El agente genera estructura con placeholders; el PM debe completar el contenido de negocio. Mitigación: las instrucciones del agente guían explícitamente al usuario sobre qué información aportar antes de generar el output.
