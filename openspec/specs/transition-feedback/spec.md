## ADDED Requirements

### Requirement: Skill confirms output with path and next command
Al finalizar exitosamente, cada skill SHALL confirmar al usuario con el path absoluto del documento generado y el siguiente comando del workflow a ejecutar.

#### Scenario: Successful phase completion feedback
- **WHEN** el agente delegado completa su ejecucion y el documento de output existe
- **THEN** el skill MUST mostrar al usuario: (1) confirmacion de exito, (2) path del documento generado, (3) el siguiente comando del workflow

#### Scenario: Failed phase completion feedback
- **WHEN** el agente delegado completa su ejecucion pero el documento de output no existe
- **THEN** el skill MUST mostrar al usuario un mensaje de error y el comando a ejecutar para reintentar

#### Scenario: Next command is accurately specified
- **WHEN** el skill `ps-begin-intention` confirma exito
- **THEN** el siguiente comando indicado MUST ser `/ps-discovery`

#### Scenario: Next command for last phase
- **WHEN** el skill `ps-planning` confirma exito
- **THEN** el skill MUST indicar al usuario que el workflow esta completo y el documento esta listo para ser revisado