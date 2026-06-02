## 1. Crear skill ps-begin-intention

- [x] 1.1 Crear directorio `.claude/skills/ps-begin-intention/templates/`
- [x] 1.2 Copiar `.claude/skills/ps-draft/templates/project-intent-template.md` → `.claude/skills/ps-begin-intention/templates/project-intent-template.md`
- [x] 1.3 Crear `.claude/skills/ps-begin-intention/SKILL.md` — orquestador que invoca `product-manager-agent` para capturar intención + refinar, produciendo `$SPECS_BASE/specs/projects/project-intent.md` en una sola sesión

## 2. Crear skill ps-project-spec

- [x] 2.1 Crear directorio `.claude/skills/ps-project-spec/templates/`
- [x] 2.2 Copiar `.claude/skills/ps-SPECIFY/templates/project-template.md` → `.claude/skills/ps-project-spec/templates/project-template.md`
- [x] 2.3 Crear `.claude/skills/ps-project-spec/SKILL.md` — orquestador que verifica que existe `project-intent.md`, invoca `product-manager-agent` para discovery y `architect-agent` para especificación, produciendo `$SPECS_BASE/specs/projects/project.md`

## 3. Eliminar skills obsoletos

- [x] 3.1 Eliminar directorio `.claude/skills/ps-funnel/` (incluye templates/)
- [x] 3.2 Eliminar directorio `.claude/skills/ps-draft/` (incluye templates/)
- [x] 3.3 Eliminar directorio `.claude/skills/ps-discovery/` (incluye templates/)
- [x] 3.4 Eliminar directorio `.claude/skills/ps-SPECIFY/` (incluye templates/)
- [x] 3.5 Eliminar directorio `.claude/skills/ps-approval/` (incluye templates/)
- [x] 3.6 Eliminar directorio `.claude/skills/ps-finish/`

## 4. Actualizar documentación

- [x] 4.1 Actualizar `CLAUDE.md` — verificar que la sección de Comandos Disponibles lista solo los 3 comandos finales y que el workflow refleja el pipeline simplificado
- [x] 4.2 Verificar que no quedan referencias a skills eliminados en `CLAUDE.md` ni en ningún SKILL.md activo
