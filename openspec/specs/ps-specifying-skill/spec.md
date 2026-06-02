## ADDED Requirements

### Requirement: Skill ps-SPECIFY orquesta el estado SPECIFY
El sistema SHALL proveer un skill `ps-SPECIFY` en `.claude/skills/ps-SPECIFY/SKILL.md` que actúa como orquestador del estado SPECIFY del pipeline de ProjectSpecFactory.

#### Scenario: Archivo discovery.md no existe
- **WHEN** el usuario ejecuta `/ps-SPECIFY` y `$SPECS_BASE/specs/projects/discovery.md` no existe
- **THEN** el skill informa al usuario que debe completar primero la fase Discovery y detiene la ejecución

#### Scenario: Template no existe
- **WHEN** el usuario ejecuta `/ps-SPECIFY` y `.claude/skills/ps-SPECIFY/templates/project-template.md` no existe
- **THEN** el skill informa al usuario que el template requerido no existe y detiene la ejecución

#### Scenario: Precondiciones satisfechas
- **WHEN** el usuario ejecuta `/ps-SPECIFY`, `discovery.md` existe y el template existe
- **THEN** el skill delega la ejecución al `SPECIFY-agent` con instrucciones para leer `discovery.md` y el template, conducir la entrevista y escribir `$SPECS_BASE/specs/projects/project.md`

#### Scenario: Output generado exitosamente
- **WHEN** el `SPECIFY-agent` finaliza su ejecución
- **THEN** el skill verifica que `$SPECS_BASE/specs/projects/project.md` existe y confirma al usuario con el mensaje de éxito y el siguiente paso (`/ps-approve`)

#### Scenario: Output no generado
- **WHEN** el `SPECIFY-agent` finaliza pero `$SPECS_BASE/specs/projects/project.md` no existe
- **THEN** el skill informa al usuario que algo salió mal y sugiere ejecutar `/ps-SPECIFY` nuevamente
