## ADDED Requirements

### Requirement: Skill openspec-generate-baseline disponible como comando
El sistema SHALL proveer un skill invocable como `/openspec-generate-baseline` ubicado en `.claude/skills/openspec-generate-baseline/SKILL.md`, siguiendo las convenciones de skills del proyecto SDDF.

#### Scenario: Skill existe y es invocable
- **WHEN** el usuario ejecuta `/openspec-generate-baseline`
- **THEN** el sistema carga y ejecuta el skill desde `.claude/skills/openspec-generate-baseline/SKILL.md`

### Requirement: Verificación del directorio de código fuente
El skill SHALL verificar que existe un directorio `src/` antes de proceder con la ingeniería inversa.

#### Scenario: Directorio src/ existe
- **WHEN** el skill se ejecuta y existe `src/` en la raíz del proyecto
- **THEN** el skill continúa el análisis usando `src/` como fuente principal

#### Scenario: Directorio src/ no existe
- **WHEN** el skill se ejecuta y no existe `src/` en la raíz del proyecto
- **THEN** el skill lista los directorios disponibles en la raíz
- **AND** pide al usuario que indique cuál contiene el código fuente antes de continuar

### Requirement: Generación del change baseline mediante ingeniería inversa
El skill SHALL invocar `/opsx:propose` con el nombre `baseline` y una instrucción de ingeniería inversa que lea exhaustivamente `src/`, `README.md` y `AGENTS.md` (si existe) para generar los artefactos (proposal, design, specs, tasks) que describan el comportamiento actual, reglas de negocio y flujos principales del código existente.

#### Scenario: Change baseline generado exitosamente
- **WHEN** el skill invoca `/opsx:propose baseline` con la instrucción de reverse engineering
- **THEN** se crean los artefactos proposal.md, design.md, specs/ y tasks.md en `openspec/changes/baseline/`
- **AND** los artefactos describen el comportamiento actual inferido del código fuente

#### Scenario: Change baseline ya existe
- **WHEN** ya existe un change llamado `baseline` en `openspec/changes/`
- **THEN** el skill pregunta al usuario si desea sobreescribirlo o crear uno con sufijo de fecha (ej. `baseline-2026-04-23`)

### Requirement: Archivado directo sin fase de apply
El skill SHALL invocar `/opsx:archive` inmediatamente después de que todos los artefactos del change `baseline` estén completos, sin ejecutar `/opsx:apply`.

#### Scenario: Archivado exitoso del baseline
- **WHEN** los artefactos del change `baseline` están completos
- **THEN** el skill invoca `/opsx:archive` para archivar el change
- **AND** el change queda en `openspec/changes/archive/` como punto de referencia histórico

#### Scenario: Confirmación del resultado al usuario
- **WHEN** el archivado se completa
- **THEN** el skill informa al usuario que la línea base fue generada y archivada
- **AND** indica la ruta del change archivado y los specs generados en `openspec/specs/`
