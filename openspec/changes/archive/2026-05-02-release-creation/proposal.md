<!-- Referencias -->
[[FEAT-051-crear-release-por-preguntas-guiadas]]

## Why

El pipeline SDDF tiene un skill `release-format-validation` que valida si un release ya creado cumple la estructura del template, pero no existe una forma guiada de *crear* ese release en primer lugar. Los usuarios deben construir manualmente el archivo o usar `releases-from-project-plan` (que requiere un `project-plan.md` previo). Se necesita un skill independiente que conduzca al usuario a través del template en tiempo de ejecución mediante preguntas, produciendo un archivo `release.md` válido y listo para pasar la validación.

## What Changes

- **Nuevo skill `release-creation`** en `.claude/skills/release-creation/SKILL.md`: orquestador interactivo que extrae dinámicamente las secciones del template `assets/release-spec-template.md` y formula preguntas al usuario para completar cada campo, produciendo un archivo `release.md` en `$SPECS_BASE/specs/releases/<slug>/`.
- El skill reutiliza el mismo `assets/release-spec-template.md` ya existente en `release-format-validation` (copia local en el nuevo skill para mantener encapsulamiento del skill).
- Se crea usando el skill `skill-master` como metodología de diseño y validación.

## Capabilities

### New Capabilities

- `release-creation`: Skill interactivo que genera un archivo `release.md` completo preguntando al usuario por cada sección del template en tiempo de ejecución. Extrae la estructura del template dinámicamente (igual que lo hace `release-format-validation`), formula preguntas claras, consolida respuestas y escribe el archivo final.

### Modified Capabilities

<!-- Sin cambios en capabilities existentes -->

## Impact

- **Archivos nuevos:** `.claude/skills/release-creation/SKILL.md`, `.claude/skills/release-creation/assets/release-spec-template.md` (copia del template compartido)
- **Sin cambios en código existente:** `release-format-validation` y `releases-from-project-plan` no se modifican
- **Pipeline SDDF L2:** `release-creation` pasa a ser el punto de entrada canónico para la creación manual de releases, complementando `releases-from-project-plan` para flujos sin `project-plan.md`
