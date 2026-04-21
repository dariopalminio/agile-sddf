## ADDED Requirements

### Requirement: Validar estructura obligatoria de un archivo de release
El skill release-format-validation SHALL leer el archivo de release especificado por el usuario y verificar que contiene todas las secciones marcadas como `<!-- sección obligatoria -->` en `docs/specs/templates/release-spec-template.md`, más el frontmatter completo (Título, Versión, Estado, Fecha). El resultado SHALL ser APROBADO si todas las secciones están presentes, o REFINAR si alguna falta.

#### Scenario: Release con todas las secciones obligatorias presentes
- **WHEN** el usuario ejecuta el skill con un archivo que contiene todas las secciones obligatorias y el frontmatter completo
- **THEN** el skill produce el resultado "APROBADO" con el mensaje "APROBADO: el archivo cumple la estructura obligatoria del template release-spec-template.md"

#### Scenario: Release con secciones obligatorias faltantes
- **WHEN** el usuario ejecuta el skill con un archivo al que le faltan una o más secciones obligatorias
- **THEN** el skill produce el resultado "REFINAR" y lista cada sección faltante con el nombre exacto del encabezado esperado

#### Scenario: Frontmatter incompleto
- **WHEN** el archivo de release no contiene uno o más campos del frontmatter (Título, Versión, Estado, Fecha)
- **THEN** el skill produce el resultado "REFINAR" e indica los campos de frontmatter ausentes

### Requirement: Resolver input por nombre corto o ruta relativa
El skill SHALL aceptar como input el nombre del archivo con o sin extensión `.md`, o la ruta relativa completa desde la raíz del proyecto. El skill SHALL buscar coincidencias en `docs/specs/releases/`.

#### Scenario: Input como nombre corto sin extensión
- **WHEN** el usuario proporciona el nombre "release-06-release-and-story-generator"
- **THEN** el skill resuelve el archivo a "docs/specs/releases/release-06-release-and-story-generator.md"

#### Scenario: Input como ruta relativa completa
- **WHEN** el usuario proporciona "docs/specs/releases/release-06-release-and-story-generator.md"
- **THEN** el skill usa esa ruta directamente sin búsqueda adicional

#### Scenario: Archivo no encontrado
- **WHEN** el input proporcionado no corresponde a ningún archivo existente en `docs/specs/releases/`
- **THEN** el skill muestra el error "Archivo no encontrado: <ruta>" y termina con resultado RECHAZADO sin continuar la validación

#### Scenario: Múltiples coincidencias para un nombre corto
- **WHEN** el nombre corto proporcionado coincide con más de un archivo en `docs/specs/releases/`
- **THEN** el skill muestra la lista de archivos coincidentes y solicita al usuario que elija antes de continuar

### Requirement: Extraer secciones obligatorias del template en tiempo de ejecución
El skill SHALL leer `docs/specs/templates/release-spec-template.md` y extraer dinámicamente los encabezados de secciones marcadas con el comentario `<!-- sección obligatoria -->` para construir la lista de secciones a validar.

#### Scenario: Template actualizado con nueva sección obligatoria
- **WHEN** se agrega una nueva sección con `<!-- sección obligatoria -->` al template
- **THEN** el skill detecta automáticamente la nueva sección como obligatoria sin modificación del SKILL.md
