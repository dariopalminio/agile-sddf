## 1. Estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/release-format-validation/`

## 2. Implementación del SKILL.md

- [x] 2.1 Crear `.claude/skills/release-format-validation/SKILL.md` con la descripción del skill y cuándo usarlo
- [x] 2.2 Implementar Fase 0: resolución de input (nombre corto, nombre con extensión, ruta relativa)
- [x] 2.3 Implementar detección de múltiples coincidencias y prompt al usuario para elegir
- [x] 2.4 Implementar manejo de archivo no encontrado con resultado RECHAZADO
- [x] 2.5 Implementar lectura de `docs/specs/templates/release-spec-template.md` y extracción dinámica de secciones con `<!-- sección obligatoria -->`
- [x] 2.6 Implementar validación de frontmatter (Título, Versión, Estado, Fecha)
- [x] 2.7 Implementar validación de secciones obligatorias por encabezado `##`
- [x] 2.8 Implementar output APROBADO con mensaje de confirmación
- [x] 2.9 Implementar output REFINAR con lista de secciones faltantes (nombre exacto de encabezado)

## 3. Verificación manual

- [ ] 3.1 Ejecutar el skill con `release-06-release-and-story-generator.md` y verificar resultado APROBADO
- [ ] 3.2 Ejecutar el skill con un archivo de release con secciones faltantes y verificar resultado REFINAR con lista correcta
- [ ] 3.3 Ejecutar el skill con nombre inexistente y verificar resultado RECHAZADO con mensaje de error
- [ ] 3.4 Ejecutar el skill con nombre corto (sin extensión) y verificar resolución correcta de ruta
