<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]

## ADDED Requirements

### Requirement: skill-master lee assets/skill-template.md en runtime al crear un skill nuevo
Cuando el skill-master genera el SKILL.md de un skill nuevo, SHALL leer `assets/skill-template.md` antes de escribir cualquier contenido. El modelo SHALL extraer las secciones del template dinámicamente y completarlas con la información del skill en lugar de generar estructura hardcodeada. No SHALL hardcodear nombres de secciones del SKILL.md de output en el prose de SKILL.md del skill-master.

#### Scenario: Template disponible — nuevo SKILL.md sigue su estructura
- **WHEN** el usuario solicita crear un nuevo skill y `assets/skill-template.md` está disponible
- **THEN** el SKILL.md generado contiene las mismas secciones de alto nivel que el template, completadas con la información específica del skill

#### Scenario: Template no disponible — fallback a estructura mínima
- **WHEN** `assets/skill-template.md` no puede ser localizado mediante el fallback chain
- **THEN** el modelo genera igualmente un SKILL.md válido usando las instrucciones en prosa del SKILL.md como guía estructural

#### Scenario: Template evoluciona — skill-master se adapta automáticamente
- **WHEN** se añade o elimina una sección en `assets/skill-template.md`
- **THEN** el próximo skill creado refleja esa nueva estructura sin modificar el SKILL.md del skill-master

### Requirement: skill-template.md incluye frontmatter YAML estándar SDDF
El template `assets/skill-template.md` SHALL incluir un bloque frontmatter YAML al inicio con al menos los campos `name`, `description` y `triggers` como placeholders listos para completar.

#### Scenario: Template contiene frontmatter YAML con campos requeridos
- **WHEN** se lee `assets/skill-template.md`
- **THEN** el archivo comienza con un bloque delimitado por `---` que incluye los campos `name`, `description` y `triggers`

#### Scenario: SKILL.md generado incluye frontmatter YAML completo
- **WHEN** el modelo completa el template para crear un nuevo SKILL.md
- **THEN** el archivo resultante contiene un bloque frontmatter YAML con `name` y `description` poblados con valores específicos del skill

### Requirement: Rutas relativas con fallback chain para localizar el template
El skill-master SHALL referenciar `assets/skill-template.md` usando una ruta relativa al directorio del skill, aplicando el fallback chain estándar del proyecto. No SHALL usar rutas absolutas ni paths con prefijo de cliente (`.claude/`, `.opencode/`, `.github/`).

#### Scenario: Template localizado en cualquier runtime cliente
- **WHEN** el skill-master se ejecuta en Claude Code, OpenCode o GitHub Copilot
- **THEN** `assets/skill-template.md` es localizado correctamente sin rutas absolutas ni prefijos de cliente hardcodeados

#### Scenario: Ninguna ruta absoluta en las instrucciones de lectura del template
- **WHEN** se revisa el SKILL.md del skill-master
- **THEN** la referencia a `skill-template.md` usa únicamente la forma `assets/skill-template.md` o el patrón de fallback chain relativo
