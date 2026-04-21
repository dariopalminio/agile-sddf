## 📖 Historia: Validación de formato de Release

**Como** desarrollador o PM que trabaja con releases en el framework SDDF
**Quiero** ejecutar el skill `release-format-validation` sobre un archivo de release para saber si cumple la estructura obligatoria del template
**Para** asegurarme de que el archivo está listo antes de usarlo en el pipeline de generación de stories

## ✅ Criterios de aceptación

### Escenario principal – Release válido recibe resultado APROBADO
```gherkin
Dado que existe el archivo "docs/specs/releases/release-06-release-and-story-generator.md"
  Y el archivo contiene todas las secciones obligatorias según "docs/specs/templates/release-spec-template.md"
Cuando ejecuto el skill release-format-validation con ese archivo
Entonces el resultado es "APROBADO"
  Y se muestra el mensaje "APROBADO: el archivo cumple la estructura obligatoria del template release-spec-template.md"
```

### Escenario alternativo / error – Release incompleto recibe resultado REFINAR
```gherkin
Dado que existe el archivo "docs/specs/releases/release-incompleto.md"
  Y el archivo no contiene la sección "Flujos Críticos / Smoke Tests"
Cuando ejecuto el skill release-format-validation con ese archivo
Entonces el resultado es "REFINAR"
  Y se lista la sección faltante "Flujos Críticos / Smoke Tests"
  Pero no se modifica el contenido del archivo original
```

### Escenario principal – Resolución exitosa de input a ruta de archivo
```gherkin
Escenario: Resolución de distintos formatos de input
  Dado que el directorio "docs/specs/releases/" contiene archivos de release
  Cuando el usuario proporciona el input "<input>"
  Entonces el skill resuelve el archivo "<archivo_resuelto>"
Ejemplos:
  | input                                                          | archivo_resuelto                                                |
  | release-06-release-and-story-generator                        | docs/specs/releases/release-06-release-and-story-generator.md  |
  | docs/specs/releases/release-06-release-and-story-generator.md | docs/specs/releases/release-06-release-and-story-generator.md  |
```

### Escenario alternativo / error – Archivo no encontrado
```gherkin
Dado que proporciono la ruta "docs/specs/releases/release-inexistente.md"
Cuando el skill intenta resolver el archivo
Entonces muestra el error "Archivo no encontrado: docs/specs/releases/release-inexistente.md"
  Y no continúa con la validación
```

### Requerimiento: Validación de estructura basada en template
Las secciones obligatorias se identifican dinámicamente desde el template `docs/specs/templates/release-spec-template.md` por el comentario `<!-- sección obligatoria -->`. El frontmatter (Título, Versión, Estado, Fecha) también es obligatorio. Las secciones opcionales no afectan el resultado.

### Requerimiento: Resolución de input con múltiples coincidencias
Si el nombre proporcionado (sin extensión ni ruta) coincide con más de un archivo en `docs/specs/releases/`, el skill debe mostrar la lista de coincidencias y pedir al usuario que elija antes de continuar.

## ⚙️ Criterios no funcionales

* Rendimiento: la validación se completa en menos de 3 segundos
* UX: el reporte REFINAR lista cada sección faltante con el nombre exacto del encabezado esperado

## 📎 Notas / contexto adicional

El skill acepta nombre corto, nombre con extensión o ruta relativa completa del archivo. La lógica de resolución de input está cubierta en `story-resolver-input-archivo-release.md`. El skill no genera ni corrige contenido — solo valida presencia de secciones.
El skill busca archivos únicamente en `docs/specs/releases/`. Una vez resuelto el archivo, el flujo continúa con la validación de estructura descrita en `story-validar-estructura-release.md`.
