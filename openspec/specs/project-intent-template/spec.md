## ADDED Requirements

### Requirement: Template project-intent-template existe en el directorio del skill
El sistema SHALL proveer el archivo `.claude/skills/ps-draft/templates/project-intent-template.md` con la estructura de secciones que guían la elaboración del project-intent. El skill es autónomo — el template vive dentro de su propio directorio y no depende de `docs/templates/`.

#### Scenario: Archivo disponible
- **WHEN** el skill `/ps-draft` es ejecutado
- **THEN** el archivo `.claude/skills/ps-draft/templates/project-intent-template.md` existe y es legible

---

### Requirement: Template contiene las secciones requeridas del project-intent
El template SHALL incluir como mínimo las siguientes secciones: Problem Statement, Vision (elevator pitch con formato For/Who/The/Is a/That/Unlike/Our product), Success Criteria, Constraints, Non-Goals.

#### Scenario: Secciones presentes
- **WHEN** se lee `.claude/skills/ps-draft/templates/project-intent-template.md`
- **THEN** el archivo contiene headers para cada sección requerida con comentarios HTML de guía para el agente

#### Scenario: Vision en formato elevator pitch
- **WHEN** se lee la sección Vision del template
- **THEN** contiene el formato estructurado: For / who / the / is a / that / Unlike / our product

---

### Requirement: Template es de solo lectura durante la ejecución
El template SHALL no ser modificado durante la ejecución del skill. El output siempre se escribe en `docs/specs/project-intent.md`.

#### Scenario: Template intacto después de ejecución
- **WHEN** el skill `/ps-draft` se ejecuta y completa
- **THEN** `.claude/skills/ps-draft/templates/project-intent-template.md` tiene el mismo contenido que antes de la ejecución
