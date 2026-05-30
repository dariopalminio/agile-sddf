## ADDED Requirements

### Requirement: Generación de documentos de políticas desde templates
El skill `project-policies-generation` SHALL leer los templates `$SPECS_BASE/specs/templates/project-constitution-template.md` y `$SPECS_BASE/specs/templates/definition-of-done-story-template.md` en tiempo de ejecución, y crear los archivos `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md` con el contenido inicial derivado de dichos templates.

#### Scenario: Generación exitosa cuando los archivos no existen
- **WHEN** el usuario ejecuta el skill `project-policies-generation` y los archivos `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md` NO existen
- **THEN** el skill crea ambos archivos a partir de sus templates correspondientes, con un frontmatter válido que incluye `type`, `created` y `updated`

#### Scenario: Error cuando el template de constitución no existe
- **WHEN** el usuario ejecuta el skill y el archivo `$SPECS_BASE/specs/templates/project-constitution-template.md` no existe
- **THEN** el skill muestra un mensaje de error indicando la ruta del template faltante, no crea ningún archivo y sugiere ejecutar `sddf-init`

### Requirement: Modo edición cuando los archivos de políticas ya existen
El skill SHALL detectar si `$SPECS_BASE/policies/constitution.md` o `$SPECS_BASE/policies/definition-of-done-story.md` ya existen y, en ese caso, MUST presentar las opciones de editar el archivo existente o sobreescribirlo previa confirmación del usuario.

#### Scenario: Archivos de políticas ya existen
- **WHEN** el usuario ejecuta el skill y ambos archivos de políticas ya existen
- **THEN** el skill muestra un mensaje indicando que los archivos existen y pregunta si desea editarlos o sobreescribirlos, sin modificar nada hasta recibir confirmación

#### Scenario: Usuario confirma sobreescritura
- **WHEN** el usuario responde afirmativamente a la pregunta de sobreescritura
- **THEN** el skill sobreescribe los archivos existentes con el contenido del template y muestra un mensaje de éxito

### Requirement: Registro de referencias en CLAUDE.md / AGENTS.md
El skill SHALL agregar referencias `@` a los archivos de políticas en `CLAUDE.md` o `AGENTS.md` del repositorio, usando la sintaxis compatible con el cliente IA activo, ONLY IF las referencias no están presentes ya en el archivo.

#### Scenario: Referencias no presentes en CLAUDE.md
- **WHEN** el skill genera los archivos de políticas y CLAUDE.md no contiene referencias a `docs/policies/constitution.md`
- **THEN** el skill agrega las líneas `@docs/policies/constitution.md` y `@docs/policies/definition-of-done-story.md` al final de la sección de contexto de CLAUDE.md

#### Scenario: Referencias ya presentes en CLAUDE.md
- **WHEN** CLAUDE.md ya contiene referencias a los archivos de políticas
- **THEN** el skill no modifica CLAUDE.md y notifica al usuario que las referencias ya están configuradas

#### Scenario: CLAUDE.md con formato no estándar
- **WHEN** el skill no puede determinar la sección correcta donde insertar las referencias
- **THEN** el skill muestra las líneas a agregar manualmente sin modificar el archivo

### Requirement: Cumplimiento de Skill Structural Patterns
El skill `project-policies-generation` MUST seguir los lineamientos estructurales definidos en `docs/knowledge/guides/skill-structural-pattern.md` y MUST ser construido usando el skill `skill-master`.

#### Scenario: Estructura de directorios correcta
- **WHEN** se inspecciona el directorio `.claude/skills/project-policies-generation/`
- **THEN** contiene al menos `SKILL.md` con las instrucciones del skill, un directorio `assets/` con los templates y un directorio `examples/` con ejemplos de uso

### Requirement: Validación de entorno con skill-preflight
El skill SHALL invocar `skill-preflight` como Paso 0 antes de cualquier operación con archivos. Si el entorno es inválido, MUST detener la ejecución inmediatamente.

#### Scenario: Entorno válido
- **WHEN** el skill invoca skill-preflight y el entorno es correcto
- **THEN** el skill continúa con la generación de archivos

#### Scenario: Entorno inválido
- **WHEN** skill-preflight retorna error bloqueante
- **THEN** el skill detiene la ejecución y muestra el reporte de preflight sin crear ningún archivo

### Requirement: Integración con sddf-init como paso opcional de onboarding
El skill `project-policies-generation` SHALL poder ser invocado desde `sddf-init` como Paso 5 opcional durante la inicialización del entorno SDDF.

#### Scenario: Usuario acepta inicializar políticas desde sddf-init
- **WHEN** sddf-init pregunta al usuario si desea inicializar las políticas y el usuario responde afirmativamente
- **THEN** sddf-init invoca `project-policies-generation` y espera a que complete antes de mostrar el informe final

#### Scenario: Usuario omite la inicialización de políticas desde sddf-init
- **WHEN** sddf-init pregunta al usuario y el usuario responde negativamente
- **THEN** sddf-init registra `[OMITIDO] project-policies-generation` en el informe final sin invocar el skill