## ADDED Requirements

### Requirement: El agente recopila los datos necesarios antes de generar el output
El agente SHALL solicitar al usuario los datos mínimos requeridos si no fueron proporcionados en el input inicial. Los datos mínimos son: nombre del release, descripción de negocio y al menos un feature. El agente MUST NOT generar contenido inventado para campos vacíos.

#### Scenario: Input completo provisto de una vez
- **WHEN** el usuario proporciona nombre del release, descripción y al menos un feature en el mensaje inicial
- **THEN** el agente genera el output directamente sin hacer preguntas adicionales

#### Scenario: Input incompleto — el agente solicita datos faltantes
- **WHEN** el usuario invoca al agente sin proporcionar el nombre del release o los features
- **THEN** el agente identifica los datos mínimos faltantes
- **THEN** el agente hace preguntas específicas para obtener cada dato faltante
- **THEN** el agente espera la respuesta del usuario antes de generar el output

#### Scenario: El agente no inventa contenido faltante
- **WHEN** el usuario no proporciona el contenido para una sección obligatoria
- **THEN** el agente solicita esa información
- **THEN** el agente usa placeholders orientativos solo para secciones opcionales que el usuario no quiso completar

### Requirement: El agente genera la descripción completa del Epic siguiendo el template canónico
El agente SHALL producir un bloque de texto Markdown que cumpla la estructura del template canónico con todas las secciones obligatorias y campos de frontmatter completos.

#### Scenario: Output incluye frontmatter obligatorio
- **WHEN** el agente genera la descripción del Epic
- **THEN** el output incluye los campos `**Título**:`, `**Versión**:`, `**Estado**:` y `**Fecha**:` en el frontmatter

#### Scenario: Output incluye secciones obligatorias
- **WHEN** el agente genera la descripción del Epic
- **THEN** el output incluye las secciones `## Descripción`, `## Features` y `## Flujos Críticos / Smoke Tests`

#### Scenario: Output listo para pegar en Jira
- **WHEN** el agente genera el output final
- **THEN** el output es texto Markdown válido que el PM puede copiar y pegar directamente en la descripción del Epic en Jira

### Requirement: El template canónico está incrustado en las instrucciones del agente
El agente SHALL incluir el template canónico completo dentro de su sección de instrucciones bajo el encabezado `## Template canónico (fuente de verdad)`, sin referenciar archivos externos.

#### Scenario: El agente opera sin dependencias externas
- **WHEN** el agente es invocado en el runtime Rovo
- **THEN** puede generar el output completo usando únicamente el conocimiento incrustado en su prompt de instrucciones

### Requirement: El agente sigue la convención de estructura de agentes Rovo
El agente SHALL seguir la misma estructura de secciones que los agentes Rovo existentes: `# Nombre`, `# Descripción`, `# Comportamiento`, `# Instrucciones`.

#### Scenario: Estructura compatible con el runtime Rovo
- **WHEN** el archivo `rovo/release-creator-agent.md` es cargado en Rovo
- **THEN** Rovo interpreta correctamente las secciones Nombre, Descripción, Comportamiento e Instrucciones como configuración del agente
