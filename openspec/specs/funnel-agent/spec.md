## ADDED Requirements

### Requirement: Agente PM definido con frontmatter válido for Funnel phase
El sistema SHALL proveer un agente Product Manager en `.claude/agents/pm-agent.md` con frontmatter YAML válido que incluya `name`, `description`, `tools` y `model`.

#### Scenario: Frontmatter correcto
- **WHEN** Claude Code carga `.claude/agents/pm-agent.md`
- **THEN** el agente es reconocido con name=`pm-agent`, tools mínimos=[`Read`, `Write`, `AskUserQuestion`], y un modelo Claude válido

---

### Requirement: Agente conduce entrevista sección por sección
El agente PM SHALL hacer preguntas al usuario alineadas con cada sección del template `initial-prompt-template.md`, en secuencia lógica, agrupando máximo 3-4 preguntas por ronda.

#### Scenario: Preguntas estructuradas por sección
- **WHEN** el agente PM recibe el template como contexto
- **THEN** genera preguntas específicas para cada sección H2/H3 del template, usando `AskUserQuestion` para recopilar respuestas

#### Scenario: Preguntas de seguimiento
- **WHEN** una respuesta del usuario es ambigua o insuficiente para completar una sección
- **THEN** el agente hace una pregunta de seguimiento antes de continuar con la siguiente sección

---

### Requirement: Agente completa secciones con pericia de PM
El agente PM SHALL usar su conocimiento de gestión de productos para inferir y completar partes del documento cuando el usuario no proporciona suficiente detalle, marcando el contenido inferido.

#### Scenario: Inferencia de contenido
- **WHEN** el usuario proporciona una respuesta parcial para una sección
- **THEN** el agente completa la sección combinando la respuesta del usuario con inferencias de PM, marcando el texto inferido con `[inferido]`

---

### Requirement: Agente escribe el documento final
El agente PM SHALL escribir `docs/specs/initial-prompt.md` usando el template como estructura y las respuestas del usuario como contenido, al finalizar la entrevista.

#### Scenario: Escritura del documento
- **WHEN** el agente PM ha recopilado respuestas para todas las secciones
- **THEN** usa la herramienta `Write` para crear `docs/specs/initial-prompt.md` con todas las secciones completadas y metadatos de generación (fecha, agente)
