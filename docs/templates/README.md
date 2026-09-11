## Convención de nomenclatura de templates

Los archivos de plantilla usan el sufijo `-template.md`:

- `story-template.md`
- `project-intent-template.md`
- `epic-template.md`

Esta convención aplica tanto a `*/templates/<name>-template.md` como a `*/SKILL/<skill>/assets/<name>-template.md`.

Excepción: `README.md` en la carpeta de templates no lleva sufijo (es documentación, no plantilla).

---

Esta capa es hermana de `specs/`, no un subdirectorio suyo: los templates son meta-artefactos que
definen la estructura de otros artefactos, no especificaciones de work items. Ver
[ADR-0007](../adr/ADR-0007-templates-como-capa-propia.md).
