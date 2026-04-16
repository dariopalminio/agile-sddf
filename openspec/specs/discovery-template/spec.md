## ADDED Requirements

### Requirement: Template discovery-template.md existe junto al skill
El sistema SHALL proveer `.claude/skills/ps-discovery/templates/discovery-template.md` como template operacional de la fase Discovery, colocado junto al skill que lo usa.

#### Scenario: Template en ruta relativa al skill
- **WHEN** el skill `ps-discovery` necesita el template
- **THEN** lo encuentra en `.claude/skills/ps-discovery/templates/discovery-template.md` sin depender de rutas fuera del directorio del skill

### Requirement: Template contiene secciones con headers ## y comentarios <!-- -->
El template SHALL estructurar cada sección con un header `##` y un comentario `<!-- -->` que guíe al agente sobre qué información capturar en esa sección.

#### Scenario: Agente puede extraer guías en runtime
- **WHEN** el `discovery-agent` lee el template
- **THEN** puede extraer cada `##` como nombre de sección y cada `<!-- -->` como guía de pregunta para esa sección

### Requirement: Template cubre las secciones canónicas de discovery
El template SHALL incluir al menos las siguientes secciones: Visión del Producto, Usuarios o Clientes Clave, User Journey Map, Preguntas de Descubrimiento e Hipótesis y Experimentos.

#### Scenario: Secciones canónicas presentes
- **WHEN** se abre `discovery-template.md`
- **THEN** contiene headers `##` para Visión del Producto, Usuarios o Clientes Clave, User Journey Map, Preguntas de Descubrimiento, e Hipótesis y Experimentos

### Requirement: El template nunca se modifica durante la ejecución del agente
El `discovery-agent` SHALL solo leer el template; nunca escribir sobre él.

#### Scenario: Ejecución del agente no altera el template
- **WHEN** el agente completa la entrevista y escribe el output en `docs/specs/discovery.md`
- **THEN** el contenido de `.claude/skills/ps-discovery/templates/discovery-template.md` permanece idéntico al estado previo a la ejecución

### Requirement: Template de referencia en docs/templates no se modifica
El archivo `docs/templates/discovery.md` SHALL mantenerse como referencia de ejemplo y no ser modificado por ningún agente ni skill del pipeline.

#### Scenario: Archivo de referencia intacto tras ejecución del pipeline
- **WHEN** el usuario ejecuta `/ps-discovery` y completa el flujo
- **THEN** `docs/templates/discovery.md` no ha sido modificado
