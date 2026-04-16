## ADDED Requirements

### Requirement: ps-discovery skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-discovery/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/ps-discovery`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-discovery`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-discovery/SKILL.md`

### Requirement: ps-discovery reads existing document state
El skill SHALL leer el campo `**Estado**:` de `docs/specs/project/requirement-spec.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in Doing state
- **WHEN** `requirement-spec.md` existe con `Estado: Doing`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: ps-discovery requires project-intent.md as input
El skill `/ps-discovery` SHALL verificar que `docs/specs/project/project-intent.md` existe y tiene `Estado: Ready` antes de proceder.

#### Scenario: Input present and Ready
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill continua al siguiente paso sin interrumpir al usuario

#### Scenario: Input missing or Doing
- **WHEN** `project-intent.md` no existe o tiene `Estado: Doing`
- **THEN** el sistema MUST informar al usuario que debe ejecutar `/ps-begin-intention` primero y detener la ejecucion

### Requirement: ps-discovery produces requirement-spec.md
El skill `/ps-discovery` SHALL producir `docs/specs/project/requirement-spec.md` como unico documento de salida, en una sola sesion que combina discovery de usuarios y especificacion de requisitos.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la sesion guiada por `/ps-discovery`
- **THEN** el sistema MUST crear `docs/specs/project/requirement-spec.md` usando el template `ps-discovery/templates/requirement-spec-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/ps-discovery` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `discovery.md` o `clarifications.md`

### Requirement: ps-discovery uses architect-agent as primary agent
El skill `/ps-discovery` SHALL delegar la especificacion al `architect-agent` como agente principal, con soporte del `product-manager-agent` para el discovery y del `ux-designer-agent` para flujos de usuario.

#### Scenario: Architect agent produces the spec
- **WHEN** el skill ejecuta la fase de especificacion
- **THEN** el sistema MUST invocar `architect-agent` para generar `requirement-spec.md`

### Requirement: ps-discovery template exists
El directorio `.claude/skills/ps-discovery/templates/` SHALL contener `requirement-spec-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `architect-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/ps-discovery/templates/requirement-spec-template.md`

### Requirement: ps-discovery confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `requirement-spec.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/ps-planning`
