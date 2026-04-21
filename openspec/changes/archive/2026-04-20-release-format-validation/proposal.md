## Why

El pipeline SDDF genera stories desde archivos de release, pero no hay forma de verificar que un archivo de release esté bien formado antes de usarlo. Un release con secciones faltantes produce stories incompletas o errores downstream silenciosos. Se necesita un skill de validación que actúe como gate de calidad antes de ejecutar `generate-stories`.

## What Changes

- **Nuevo skill** `release-format-validation` en `.claude/skills/release-format-validation/`
- El skill recibe como input el nombre o ruta relativa de un archivo de release en `docs/specs/releases/`
- El skill lee el archivo y verifica la presencia de todas las secciones marcadas como `<!-- sección obligatoria -->` en `docs/specs/templates/release-spec-template.md`, más el frontmatter (Título, Versión, Estado, Fecha)
- Devuelve **APROBADO** si todas las secciones obligatorias están presentes, o **REFINAR** con la lista de secciones faltantes si alguna falta
- Si el archivo no existe, reporta error y termina con resultado **RECHAZADO**

## Capabilities

### New Capabilities

- `release-format-validation`: Skill que valida la estructura de un archivo de release contra el template canónico `release-spec-template.md` y produce un resultado APROBADO / REFINAR / RECHAZADO con detalle de secciones faltantes.

### Modified Capabilities

## Impact

- Nuevo directorio `.claude/skills/release-format-validation/` con `SKILL.md`
- Lectura del archivo tempate desde `docs/specs/templates/release-spec-template.md` para extraer secciones obligatorias en tiempo de ejecución
- Sin cambios en skills existentes ni en el template `release-spec-template.md`
- Prerrequisito natural para el skill `generate-stories` (Release 06)
