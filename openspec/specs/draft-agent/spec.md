## ADDED Requirements

### Requirement: Agente draft-agent definido con frontmatter válido
El sistema SHALL proveer un agente Draft en `.claude/agents/draft-agent.md` con frontmatter YAML válido que incluya `name`, `description`, `tools` y `model`.

#### Scenario: Frontmatter correcto
- **WHEN** Claude Code carga `.claude/agents/draft-agent.md`
- **THEN** el agente es reconocido con name=`draft-agent`, tools mínimos=[`Read`, `Write`, `Edit`, `AskUserQuestion`], y un modelo Claude válido

---

### Requirement: Agente valida el Estado del initial-prompt
El agente SHALL leer `docs/specs/initial-prompt.md` y verificar que el campo `**Estado**` tiene el valor `Ready`. Si el valor es `Doing`, debe preguntar al usuario si confirma avanzar.

#### Scenario: Estado es Ready
- **WHEN** el agente lee `initial-prompt.md` y el campo `**Estado**` contiene `Ready`
- **THEN** el agente continúa con la entrevista de refinamiento sin interrupciones

#### Scenario: Estado es Doing — usuario confirma
- **WHEN** el agente lee `initial-prompt.md` y el campo `**Estado**` contiene `Doing`
- **THEN** el agente pregunta al usuario si considera que el Funnel está completo y si desea avanzar; si el usuario confirma, el agente actualiza el campo `**Estado**` a `Ready` en el archivo usando `Edit` y continúa

#### Scenario: Estado es Doing — usuario rechaza
- **WHEN** el agente lee `initial-prompt.md`, el campo `**Estado**` es `Doing`, y el usuario indica que aún no está listo
- **THEN** el agente informa al usuario que debe completar el Funnel primero (`/ps-funnel`) y detiene su ejecución

---

### Requirement: Agente conduce entrevista de refinamiento por secciones del template
El agente SHALL leer el template `.claude/skills/ps-draft/templates/project-intent-template.md`, extraer sus secciones, y hacer preguntas al usuario alineadas con cada sección, usando el contenido de `initial-prompt.md` como contexto base. Máximo 3-4 preguntas por ronda.

#### Scenario: Preguntas basadas en contexto previo
- **WHEN** el agente conduce la entrevista
- **THEN** pre-rellena cada sección con información relevante ya capturada en `initial-prompt.md` y solo hace preguntas para las secciones que requieren información adicional o refinamiento

#### Scenario: Preguntas de seguimiento
- **WHEN** una respuesta del usuario es insuficiente para completar una sección del template
- **THEN** el agente hace una pregunta de seguimiento antes de avanzar a la siguiente sección

---

### Requirement: Agente completa secciones con pericia de PM
El agente SHALL usar su conocimiento de gestión de productos para inferir y completar partes del documento cuando el usuario no proporciona detalle suficiente, marcando el contenido inferido.

#### Scenario: Inferencia de contenido
- **WHEN** el usuario proporciona una respuesta parcial o el contenido de `initial-prompt.md` es insuficiente para una sección
- **THEN** el agente completa la sección con inferencias de PM marcadas con `[inferido]`

---

### Requirement: Agente escribe docs/specs/project-intent.md
El agente SHALL escribir el documento `docs/specs/project-intent.md` al finalizar la entrevista, usando el template como estructura y el contenido recopilado como contenido.

#### Scenario: Escritura del documento final
- **WHEN** el agente ha completado todas las secciones del template
- **THEN** usa `Write` para crear `docs/specs/project-intent.md` con todas las secciones completadas y metadatos (fecha, agente, estado=`Doing`)
