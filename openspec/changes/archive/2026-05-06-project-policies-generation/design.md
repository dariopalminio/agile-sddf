## Context

El framework SDDF utiliza agentes IA que operan en el contexto del repositorio. Para que los agentes tomen decisiones coherentes con el proyecto (stack tecnológico, convenciones, criterios de aceptación), necesitan acceder a documentos de políticas versionados dentro del propio repositorio. Actualmente no existe ningún skill que inicialice estos documentos, lo que provoca que cada equipo los cree manualmente o los omita por completo.

El skill `project-policies-generation` resuelve este gap creando `constitution.md` y `definition-of-done-story.md` desde templates Markdown y registrando las referencias en `CLAUDE.md` / `AGENTS.md`.

## Goals / Non-Goals

**Goals:**
- Crear el skill `project-policies-generation` siguiendo los Skill Structural Patterns de SDDF.
- Leer templates en tiempo de ejecución desde `$SPECS_BASE/specs/templates/` (template autonomy pattern).
- Crear los archivos `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md` si no existen, o abrirlos para edición si ya existen.
- Agregar referencias `@` a los archivos de políticas en `CLAUDE.md` / `AGENTS.md`.
- Construir el skill usando `skill-master` para garantizar estructura, documentación y ejemplos estándar.

**Non-Goals:**
- Validar el contenido semántico de las políticas generadas (no es auditor de calidad).
- Dictar tecnologías, patrones o decisiones de arquitectura en el template de constitución.
- Modificar skills existentes.

## Decisions

### Decisión 1: Almacenamiento en `$SPECS_BASE/policies/` (no en `$SPECS_BASE/specs/`)

Los documentos de políticas son de naturaleza operacional (guían el comportamiento de los agentes en runtime), no son especificaciones de features. Colocarlos en un directorio `policies/` separado los distingue semánticamente de los specs de historias y releases.

**Alternativa considerada:** `$SPECS_BASE/docs/policies/` → descartada porque aumenta la profundidad de ruta sin beneficio.

### Decisión 2: Template autonomy — la estructura la define el template, no el skill

El skill lee el template en tiempo de ejecución (`$SPECS_BASE/specs/templates/project-constitution-template.md`) y lo usa como base. Si el template cambia, el output cambia automáticamente. Esto es coherente con el principio de template autonomy ya establecido en otros skills SDDF (e.g., `release-generate-stories`, `story-design`).

**Alternativa considerada:** hardcodear la estructura en el skill → descartada porque acopla el skill al formato y dificulta la evolución.

### Decisión 3: Construir con `skill-master`

El skill se crea usando el skill `skill-master` para garantizar consistencia con los Skill Structural Patterns: directorio `SKILL.md`, `assets/`, `examples/`. Esto también asegura que el skill sea multicliente (Claude, OpenCode, Cursor).

### Decisión 4: Modificación conservadora de CLAUDE.md / AGENTS.md

El skill agrega las referencias `@` solo si no están presentes ya, usando inserción al final de la sección de contexto existente. Nunca sobreescribe el archivo completo.

## Risks / Trade-offs

- **[Riesgo] CLAUDE.md con formato no estándar** → Mitigación: el skill detecta si el archivo ya contiene las referencias `@` antes de modificarlo y, si el formato es desconocido, muestra las líneas a agregar manualmente sin modificar el archivo.
- **[Riesgo] Template no existe al ejecutar el skill** → Mitigación: verificación explícita en Paso 0 (skill-preflight extendido); si falta el template, el skill termina con mensaje claro y sugiere `sddf-init`.
- **[Trade-off] Separación de templates** → El skill necesita dos templates nuevos en `$SPECS_BASE/specs/templates/`. Esto amplía el conjunto de templates requeridos por el skill, pero mantiene coherencia con el pattern de un template por tipo de documento.
