# Spec: release-input-resolution

## Requirement: Resolver input de nombre corto a ruta de archivo
El skill SHALL aceptar como input el nombre del archivo de release con o sin extensión `.md` y resolver la ruta completa buscando en `docs/specs/releases/` por coincidencia de substring (case-insensitive).

### Scenario: Resolución por nombre corto sin extensión
- **WHEN** el usuario proporciona el input "release-06-release-and-story-generator"
- **THEN** el skill resuelve la ruta a "docs/specs/releases/release-06-release-and-story-generator.md" y continúa la ejecución

### Scenario: Resolución por nombre con extensión .md
- **WHEN** el usuario proporciona el input "release-06-release-and-story-generator.md"
- **THEN** el skill resuelve la ruta a "docs/specs/releases/release-06-release-and-story-generator.md" y continúa la ejecución

## Requirement: Usar ruta relativa completa directamente
El skill SHALL aceptar como input una ruta relativa completa que contenga separadores de directorio (`/` o `\`) y usarla directamente sin búsqueda adicional.

### Scenario: Input como ruta relativa completa
- **WHEN** el usuario proporciona "docs/specs/releases/release-06-release-and-story-generator.md"
- **THEN** el skill usa esa ruta directamente sin buscar en el directorio

## Requirement: Manejar múltiples coincidencias con prompt de selección
El skill SHALL detectar cuando un nombre corto coincide con más de un archivo en `docs/specs/releases/` y SHALL solicitar al usuario que elija antes de continuar.

### Scenario: Múltiples archivos coinciden con el término de búsqueda
- **WHEN** el nombre corto proporcionado coincide con más de un archivo en `docs/specs/releases/`
- **THEN** el skill muestra la lista completa de archivos coincidentes y solicita al usuario que especifique cuál usar

## Requirement: Manejar archivo no encontrado con resultado RECHAZADO
El skill SHALL terminar con resultado RECHAZADO cuando el input no corresponde a ningún archivo existente en `docs/specs/releases/`.

### Scenario: Nombre corto sin coincidencias
- **WHEN** el término de búsqueda no coincide con ningún archivo en `docs/specs/releases/`
- **THEN** el skill muestra el mensaje "Archivo no encontrado: <término>" y termina con resultado RECHAZADO sin continuar la validación

### Scenario: Ruta relativa completa inexistente
- **WHEN** el usuario proporciona la ruta "docs/specs/releases/release-inexistente.md" y el archivo no existe
- **THEN** el skill muestra el mensaje "Archivo no encontrado: docs/specs/releases/release-inexistente.md" y termina con resultado RECHAZADO
