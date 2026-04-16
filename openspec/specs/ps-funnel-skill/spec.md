## ADDED Requirements

### Requirement: Skill ps-funnel existe y es invocable for Funnel phase
El sistema SHALL proveer un skill `/ps-funnel` definido en `.claude/skills/ps-funnel/SKILL.md` que sea reconocido por Claude Code como un slash command ejecutable.

#### Scenario: Invocación del comando
- **WHEN** el usuario ejecuta `/ps-funnel` en Claude Code
- **THEN** el sistema carga y ejecuta el contenido de `.claude/skills/ps-funnel/SKILL.md`

---

### Requirement: Skill lee el template de initial-prompt
El skill SHALL leer `/ps-funnel/templates/initial-prompt-template.md` al inicio de su ejecución para conocer las secciones que debe completar.

#### Scenario: Template disponible
- **WHEN** se ejecuta `/ps-funnel`
- **THEN** el skill accede a `/ps-funnel/templates/initial-prompt-template.md` y extrae sus secciones principales (headers H2/H3)

#### Scenario: Template no encontrado
- **WHEN** se ejecuta `/ps-funnel` y `/ps-funnel/templates/initial-prompt-template.md` no existe
- **THEN** el skill informa al usuario que el template es requerido y detiene la ejecución

---

### Requirement: Skill delega la entrevista al agente PM
El skill SHALL invocar al agente `pm-agent` (definido en `.claude/agents/pm-agent.md`) para conducir la entrevista con el usuario y completar el documento.

#### Scenario: Delegación al agente
- **WHEN** el skill tiene el template cargado
- **THEN** transfiere el control al agente PM con el contenido del template como contexto

---

### Requirement: Skill produce initial-prompt.md como output
El skill SHALL resultar en la creación o sobrescritura de `docs/specs/initial-prompt.md` con el contenido completado por el agente PM.

#### Scenario: Output generado correctamente
- **WHEN** el agente PM completa la entrevista
- **THEN** el archivo `docs/specs/initial-prompt.md` existe y contiene todas las secciones del template completadas

#### Scenario: Idempotencia
- **WHEN** el usuario ejecuta `/ps-funnel` más de una vez
- **THEN** el archivo `docs/specs/initial-prompt.md` es sobrescrito con el nuevo contenido sin duplicaciones

#### Scenario: Template referenciado en skill
- **WHEN** se ejecuta `/ps-funnel`
- **THEN** el skill referencia el template `/ps-funnel/templates/initial-prompt-template.md` con ruta relativa dentro de `SKILL.md`

