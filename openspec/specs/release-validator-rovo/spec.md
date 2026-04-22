## ADDED Requirements

### Requirement: El agente acepta múltiples formas de input
El agente SHALL aceptar cualquiera de estas formas de input sin requerir un formato específico:
- Nombre completo o parcial de un Epic en Jira
- Key de workitem Jira (ej. `PROJ-123`)
- Texto libre con la descripción del release

#### Scenario: Input como nombre parcial de Epic
- **WHEN** el usuario proporciona un término que coincide con el nombre de un Epic
- **THEN** el agente usa la descripción de ese Epic como contenido a validar

#### Scenario: Input como Key de Jira
- **WHEN** el usuario proporciona una Key en formato `PROYECTO-NNN`
- **THEN** el agente usa la descripción del workitem con esa Key como contenido a validar

#### Scenario: Input como texto libre de descripción
- **WHEN** el usuario pega directamente el texto de descripción de un release
- **THEN** el agente valida ese texto contra el template canónico

#### Scenario: Input inválido o workitem no es Epic
- **WHEN** el usuario proporciona un nombre o Key que no corresponde a ningún Epic tipo release
- **THEN** el agente responde con estado RECHAZADO indicando la causa

### Requirement: El agente valida las secciones obligatorias del template canónico
El agente SHALL verificar que la descripción del release contenga al menos los siguientes campos y secciones obligatorias:
- Frontmatter: `**Título**`, `**Versión**`, `**Estado**`, `**Fecha**`
- Sección `## Descripción`
- Sección `## Features`
- Sección `## Flujos Críticos / Smoke Tests`

La validación MUST basarse en presencia de encabezados `##` y campos de frontmatter; no valida contenido semántico.

#### Scenario: Todas las secciones obligatorias presentes
- **WHEN** la descripción contiene todos los campos de frontmatter y las tres secciones obligatorias
- **THEN** el agente responde con estado APROBADO y confirma el contenido validado

#### Scenario: Una o más secciones faltantes
- **WHEN** la descripción no contiene al menos una sección u campo obligatorio
- **THEN** el agente responde con estado REFINAR
- **THEN** lista exactamente los campos y secciones faltantes por nombre
- **THEN** no genera ni corrige contenido del release

### Requirement: El agente produce exactamente uno de tres estados de salida
El agente SHALL responder siempre con uno de estos estados: APROBADO, REFINAR, o RECHAZADO.

#### Scenario: Validación exitosa
- **WHEN** el contenido cumple todas las secciones obligatorias
- **THEN** el agente responde `APROBADO` con confirmación del contenido validado

#### Scenario: Secciones faltantes detectadas
- **WHEN** faltan una o más secciones obligatorias
- **THEN** el agente responde `REFINAR` con la lista de secciones/campos faltantes

#### Scenario: Input no resoluble
- **WHEN** el agente no puede localizar ni interpretar el input como contenido de release válido
- **THEN** el agente responde `RECHAZADO` con explicación del motivo

### Requirement: El template canónico está incrustado en las instrucciones del agente
El agente SHALL incluir el template canónico completo dentro de su sección de instrucciones, sin referenciar archivos externos, ya que el agente opera exclusivamente dentro del runtime de Jira/Rovo.

#### Scenario: Validación sin dependencias externas
- **WHEN** el agente es invocado en el runtime Rovo
- **THEN** puede ejecutar la validación completa usando únicamente el conocimiento incrustado en su prompt de instrucciones
