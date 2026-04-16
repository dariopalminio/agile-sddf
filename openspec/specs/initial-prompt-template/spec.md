## ADDED Requirements

### Requirement: Template existe en la ruta correcta
El sistema SHALL proveer el archivo template `initial-prompt-template.md` (ver ejemplo en `docs/templates/) con la estructura de secciones que guían la captura de idea inicial del proyecto. Cada skill es autónomo. Si un skill necesita un template, ese template vive en templates/ dentro del mismo directorio del skill.
- Archivo guía de referencia para crear el template: `docs/templates/initial-prompt-template.md`

#### Scenario: Archivo disponible
- **WHEN** el skill `/ps-funnel` es ejecutado
- **THEN** el archivo `/ps-funnel/templates/initial-prompt-template.md` existe y es legible

---

### Requirement: Template contiene secciones de captura de intención de proyecto
El template SHALL incluir como mínimo las siguientes secciones H2: Nombre del Proyecto, Problema / Oportunidad, Objetivos, Usuarios / Stakeholders, Alcance Inicial, Restricciones y Supuestos, Criterios de Éxito.

#### Scenario: Secciones presentes
- **WHEN** se lee `/ps-funnel/templates/initial-prompt-template.md`
- **THEN** el archivo contiene headers H2 para cada una de las secciones requeridas

#### Scenario: Comentarios de guía en cada sección
- **WHEN** se lee cada sección del template
- **THEN** cada sección incluye un comentario HTML `<!-- -->` que describe qué información capturar en ese campo, orientando al agente PM sobre cómo formular las preguntas

---

### Requirement: Template es reutilizable e idempotente
El template SHALL ser un archivo de solo lectura que no se modifica durante la ejecución del skill. El output siempre se escribe en `docs/specs/initial-prompt.md`, nunca sobre el template.

#### Scenario: Template intacto después de ejecución
- **WHEN** el skill `/ps-funnel` se ejecuta y completa
- **THEN** `/ps-funnel/templates/initial-prompt-template.md` tiene el mismo contenido que antes de la ejecución
