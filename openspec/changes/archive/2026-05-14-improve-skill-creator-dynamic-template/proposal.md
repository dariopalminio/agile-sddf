<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]

## Why

El skill `skill-master` hardcodea los componentes del SKILL.md (listando `name`, `description`, `compatibility` como ítems fijos) en lugar de leer el template en `assets/skill-template.md` en runtime. Esto viola el principio "Template como fuente de verdad dinámica" de la constitución del proyecto y provoca que los skills creados puedan no respetar la estructura canónica definida en el template, especialmente cuando ese template evoluciona.

## What Changes

- **`skill-master` SKILL.md — sección "Write the SKILL.md"**: reemplazar la lista hardcodeada de componentes por instrucciones que lean `assets/skill-template.md` en runtime y lo completen dinámicamente, extrayendo secciones y campos del template tal como están definidos.
- **`assets/skill-template.md`**: actualizar el template para incluir frontmatter YAML estándar (name, description, triggers) y una estructura de cuerpo completa alineada con las convenciones SDDF (flujo, restricciones, salida), de forma que sirva como contrato estructural listo para completar.
- **Fallback chain**: aplicar el patrón de resolución de rutas relativas ya documentado en el propio `skill-master` para localizar `assets/skill-template.md` en cualquier runtime cliente.

## Capabilities

### New Capabilities

- `skill-master-template-driven-authoring`: el skill-master lee `assets/skill-template.md` en runtime, extrae sus secciones y guías dinámicamente, y usa ese contenido como el contrato estructural para cualquier SKILL.md nuevo. Si el template evoluciona, el skill-master se adapta automáticamente sin modificar su SKILL.md.

### Modified Capabilities

<!-- No hay cambios en specs existentes de nivel de requisito. La spec skill-template-autonomy no cambia: sigue requiriendo que los templates vivan en assets/ del skill. -->

## Impact

- **`.claude/skills/skill-master/SKILL.md`**: modificación en la sección "Write the SKILL.md" (eliminar lista hardcodeada, agregar instrucción de lectura dinámica del template con fallback chain).
- **`.claude/skills/skill-master/assets/skill-template.md`**: actualización del template para incluir frontmatter YAML y estructura completa SDDF.
- **Sin cambios de API ni breaking changes**: los skills existentes no se ven afectados; solo cambia el proceso de creación de nuevos skills.
