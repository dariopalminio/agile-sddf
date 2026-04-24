## ADDED Requirements

### Requirement: Cada skill contiene sus propios templates
Cada skill en `.claude/skills/` que requiera un template para operar SHALL tener ese template en su propio directorio `.claude/skills/<skill>/templates/`. No SHALL depender de templates en `docs/specs/templates/` para funcionar.

#### Scenario: Skill usa template local
- **WHEN** un skill necesita un template para generar su output
- **THEN** el template existe en `.claude/skills/<skill>/templates/<template>.md`

#### Scenario: Skill no referencia directorio compartido
- **WHEN** se lee el archivo `SKILL.md` de cualquier skill activo
- **THEN** no contiene referencias a rutas bajo `docs/specs/templates/`

### Requirement: Templates duplicados por skill cuando son compartidos
Cuando un mismo template es necesario en múltiples skills, cada skill SHALL tener su propia copia local del template en su directorio `templates/`.

#### Scenario: Mismo template usado por dos skills distintos
- **WHEN** dos skills (`story-creation` y `story-evaluation`) requieren el mismo template `story-gherkin-template.md`
- **THEN** cada uno tiene una copia en `.claude/skills/story-creation/templates/story-gherkin-template.md` y `.claude/skills/story-evaluation/templates/story-gherkin-template.md` respectivamente

### Requirement: Referencias actualizadas en SKILL.md y agentes
Todos los archivos `SKILL.md` y los archivos de agentes en `.claude/agents/` SHALL referenciar templates usando rutas locales (`.claude/skills/<skill>/templates/<template>.md`) en lugar de `docs/specs/templates/<template>.md`.

#### Scenario: SKILL.md referencia template con ruta local
- **WHEN** un SKILL.md menciona un template
- **THEN** la ruta apunta a `.claude/skills/<skill>/templates/<nombre>.md`

#### Scenario: Ningún agente referencia el directorio compartido antiguo
- **WHEN** se hace búsqueda de `docs/specs/templates/` en `.claude/agents/`
- **THEN** no hay resultados en archivos activos
