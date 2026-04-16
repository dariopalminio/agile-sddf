## ADDED Requirements

### Requirement: Template requirement-spec-template.md provee estructura de secciones
El sistema SHALL proveer un archivo template `requirement-spec-template.md` en `.claude/skills/ps-specifying/templates/` con la estructura de secciones que guían la captura de la especificación de requisitos del proyecto.

#### Scenario: Template contiene secciones requeridas
- **WHEN** el `specifying-agent` lee el template en runtime
- **THEN** el template contiene al menos las secciones: Descripción General del Sistema, Contexto del Sistema, Características de los Usuarios, Requisitos Funcionales, Requisitos No Funcionales, Referencias, Definiciones y Acrónimos

#### Scenario: Template no se modifica en runtime
- **WHEN** el `specifying-agent` produce el documento `requirement-spec.md`
- **THEN** el archivo template en `.claude/skills/ps-specifying/templates/requirement-spec-template.md` permanece sin cambios

#### Scenario: Template incluye comentarios guía
- **WHEN** se inspecciona el template
- **THEN** cada sección `##` tiene un comentario HTML `<!-- -->` que describe qué información capturar, para que el agente pueda derivar preguntas dinámicamente
