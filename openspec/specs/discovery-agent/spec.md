## ADDED Requirements

### Requirement: Agente discovery-agent existe con frontmatter correcto
El sistema SHALL proveer un archivo `.claude/agents/discovery-agent.md` con frontmatter YAML válido que incluya `name`, `description`, `tools` y `model`.

#### Scenario: Agente registrado con herramientas correctas
- **WHEN** Claude Code carga `.claude/agents/discovery-agent.md`
- **THEN** el agente tiene acceso a `Read`, `Write`, `Edit` y `AskUserQuestion`

### Requirement: Lectura del contexto previo
El agente SHALL leer `docs/specs/project-intent.md` y el template `discovery-template.md` al inicio de su ejecución.

#### Scenario: Lectura exitosa del input anterior
- **WHEN** el agente inicia su ejecución
- **THEN** lee `docs/specs/project-intent.md` para obtener contexto del proyecto antes de formular preguntas

### Requirement: Extracción de secciones del template en runtime
El agente SHALL extraer los headers `##` y los comentarios `<!-- -->` del template para derivar las preguntas de entrevista dinámicamente, sin preguntas hardcodeadas.

#### Scenario: Nuevas secciones en el template
- **WHEN** el template contiene una sección `##` con comentario `<!-- -->` que no existía antes
- **THEN** el agente incorpora esa sección en su entrevista automáticamente sin modificación al código del agente

#### Scenario: Sección eliminada del template
- **WHEN** una sección `##` es removida del template
- **THEN** el agente no pregunta sobre esa sección en la siguiente ejecución

### Requirement: Entrevista por secciones con agrupación
El agente SHALL conducir la entrevista sección por sección del template, agrupando máx 3-4 preguntas por ronda usando `AskUserQuestion`.

#### Scenario: Agrupación de preguntas
- **WHEN** el template tiene más de 4 secciones por cubrir
- **THEN** el agente hace las primeras 3-4 preguntas, espera la respuesta del usuario, y continúa con las siguientes en la próxima ronda

#### Scenario: Pre-relleno desde project-intent.md
- **WHEN** la información para una sección ya está disponible en `project-intent.md`
- **THEN** el agente pre-rellena esa sección sin hacer preguntas redundantes al usuario

### Requirement: Inferencia marcada con [inferido]
Cuando el usuario no provee suficiente detalle para una sección, el agente SHALL inferir el contenido usando su pericia de PM y marcarlo con `[inferido]`.

#### Scenario: Usuario omite detalles de una sección
- **WHEN** el usuario no responde con suficiente detalle para completar una sección
- **THEN** el agente infiere el contenido razonable y añade `[inferido]` al final de cada ítem inferido

### Requirement: Escritura de docs/specs/discovery.md
Al finalizar la entrevista, el agente SHALL escribir `docs/specs/discovery.md` usando el template como estructura base.

#### Scenario: Documento generado con metadatos
- **WHEN** el agente completa la entrevista y escribe el output
- **THEN** `docs/specs/discovery.md` contiene metadatos al inicio: `**Versión**`, `**Estado**: Doing`, `**Fecha**` (YYYY-MM-DD), `**Generado por**: discovery-agent`

#### Scenario: Comentarios HTML excluidos del output
- **WHEN** el agente escribe el documento final
- **THEN** los comentarios `<!-- -->` del template no aparecen en `docs/specs/discovery.md`

### Requirement: Propuesta de revisión al finalizar
Al completar la escritura, el agente SHALL proponer al usuario que revise el output y mencionar la siguiente fase.

#### Scenario: Mensaje de cierre del agente
- **WHEN** el agente termina de escribir `docs/specs/discovery.md`
- **THEN** informa la ruta del archivo generado, invita al usuario a revisar y editar si es necesario, y menciona que el siguiente paso es `/ps-specify`
