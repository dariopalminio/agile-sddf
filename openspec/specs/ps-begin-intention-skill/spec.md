## ADDED Requirements

### Requirement: ps-begin-intention skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-begin-intention/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/ps-begin-intention`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-begin-intention`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-begin-intention/SKILL.md`

### Requirement: ps-begin-intention checks WIP conflict before starting
Al inicio, el skill SHALL verificar si existe un proyecto activo con `Estado: Doing` antes de comenzar la entrevista, aplicando la logica de `wip-conflict-detection`.

#### Scenario: No WIP conflict
- **WHEN** no existe ningun documento en `docs/specs/project/` con `Estado: Doing`
- **THEN** el skill MUST continuar directamente a verificar precondiciones del template

#### Scenario: WIP conflict detected
- **WHEN** existe al menos un documento con `Estado: Doing`
- **THEN** el skill MUST notificar y ofrecer las opciones definidas en `wip-conflict-detection`

### Requirement: ps-begin-intention reads existing document state
El skill SHALL leer el campo `**Estado**:` de `docs/specs/project/project-intent.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in Doing state
- **WHEN** `project-intent.md` existe con `Estado: Doing`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: ps-begin-intention produces project-intent.md
El skill `/ps-begin-intention` SHALL producir `docs/specs/project/project-intent.md` como unico documento de salida, en una sola sesion interactiva que combina la captura de intencion inicial y su refinamiento.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/ps-begin-intention`
- **THEN** el sistema MUST crear `docs/specs/project/project-intent.md` usando el template `ps-begin-intention/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/ps-begin-intention` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `initial-prompt.md`

### Requirement: ps-begin-intention uses product-manager-agent
El skill `/ps-begin-intention` SHALL delegar la entrevista y la generacion del documento al `product-manager-agent`.

#### Scenario: Agent is invoked correctly
- **WHEN** el skill ejecuta el paso de entrevista
- **THEN** el sistema MUST invocar `product-manager-agent` como subagente

### Requirement: ps-begin-intention template exists
El directorio `.claude/skills/ps-begin-intention/templates/` SHALL contener `project-intent-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `product-manager-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/ps-begin-intention/templates/project-intent-template.md`

### Requirement: ps-begin-intention confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-intent.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/ps-discovery`
