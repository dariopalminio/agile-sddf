## ADDED Requirements

### Requirement: Skill reads Estado field at startup
Al inicio de su ejecucion, cada skill del pipeline SHALL leer el campo `**Estado**:` del documento de output de su fase en `docs/specs/project/` antes de delegar al agente.

#### Scenario: Document does not exist
- **WHEN** el documento de output de la fase no existe en `docs/specs/project/`
- **THEN** el skill MUST continuar con el flujo normal de ejecucion (primera ejecucion)

#### Scenario: Document exists with Estado Doing
- **WHEN** el documento existe y el campo `**Estado**:` tiene valor `Doing`
- **THEN** el skill MUST activar el flujo de retoma (invocar `project-retake`)

#### Scenario: Document exists with Estado Ready
- **WHEN** el documento existe y el campo `**Estado**:` tiene valor `Ready`
- **THEN** el skill MUST activar el flujo de idempotencia: avisar al usuario y solicitar confirmacion antes de sobrescribir

#### Scenario: Confirmation to overwrite Ready document
- **WHEN** el usuario confirma que desea sobrescribir un documento en estado `Ready`
- **THEN** el skill MUST continuar con el flujo normal de ejecucion

#### Scenario: User cancels overwrite of Ready document
- **WHEN** el usuario cancela la operacion sobre un documento en estado `Ready`
- **THEN** el skill MUST detenerse sin modificar el documento existente