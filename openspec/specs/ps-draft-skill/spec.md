## ADDED Requirements

### Requirement: Skill ps-draft verifica existencia de initial-prompt.md
El skill SHALL verificar que `docs/specs/initial-prompt.md` existe antes de invocar al agente. Si no existe, detiene la ejecución con un mensaje de error claro.

#### Scenario: Input presente
- **WHEN** se ejecuta `/ps-draft` y `docs/specs/initial-prompt.md` existe
- **THEN** el skill continúa al siguiente paso

#### Scenario: Input ausente
- **WHEN** se ejecuta `/ps-draft` y `docs/specs/initial-prompt.md` no existe
- **THEN** el skill informa al usuario que debe completar primero el estado Funnel ejecutando `/ps-funnel` y detiene la ejecución

---

### Requirement: Skill ps-draft verifica existencia del template
El skill SHALL verificar que `.claude/skills/ps-draft/templates/project-intent-template.md` existe antes de invocar al agente.

#### Scenario: Template presente
- **WHEN** se ejecuta `/ps-draft` y el template existe
- **THEN** el skill continúa al siguiente paso

#### Scenario: Template ausente
- **WHEN** se ejecuta `/ps-draft` y el template no existe
- **THEN** el skill informa al usuario que el template es requerido y detiene la ejecución

---

### Requirement: Skill delega la elaboración al draft-agent
El skill SHALL invocar al agente `draft-agent` pasándole como contexto la ruta de `initial-prompt.md` y del template.

#### Scenario: Delegación al agente
- **WHEN** ambas verificaciones previas son exitosas
- **THEN** el skill transfiere el control al `draft-agent` con las instrucciones de ejecutar la entrevista de refinamiento

---

### Requirement: Skill confirma la generación del output
El skill SHALL verificar que `docs/specs/project-intent.md` existe al finalizar y confirmar al usuario.

#### Scenario: Output generado
- **WHEN** el draft-agent completa su trabajo
- **THEN** el skill verifica la existencia de `docs/specs/project-intent.md` y confirma al usuario que puede continuar con `/ps-discover`

#### Scenario: Output no generado
- **WHEN** el draft-agent finaliza pero `docs/specs/project-intent.md` no existe
- **THEN** el skill informa al usuario que algo salió mal y sugiere ejecutar `/ps-draft` nuevamente
