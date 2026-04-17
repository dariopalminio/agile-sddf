## Why

El nombre `requirement-from-code` describe el mecanismo interno (extraer requisitos desde código), pero no refleja la capacidad conceptual que ofrece al usuario: **ingeniería inversa** de un proyecto existente. Renombrarlo a `reverse-engineering` alinea el identificador del skill con el vocabulario técnico estándar y mejora la discoverability para quienes buscan esta capacidad.

## What Changes

- Renombrar directorio `.claude/skills/requirement-from-code/` → `.claude/skills/reverse-engineering/`
- Actualizar el campo `name:` en el frontmatter de `SKILL.md` de `requirement-from-code` a `reverse-engineering`
- Actualizar el campo `description:` del frontmatter para reflejar el nuevo nombre de activación (`/reverse-engineering`)
- Actualizar referencias internas al skill dentro de `SKILL.md` (rutas de template, comandos de activación)
- Actualizar `skills-lock.json` si contiene el nombre del skill

## Capabilities

### New Capabilities
<!-- Ninguna — es un refactor de identidad, sin nuevas capacidades -->

### Modified Capabilities
<!-- Ninguna — el comportamiento del skill no cambia, solo su nombre e identificador -->

## Impact

- `.claude/skills/requirement-from-code/` → directorio renombrado
- `.claude/skills/requirement-from-code/SKILL.md` → campos `name` y `description` actualizados
- `skills-lock.json` → entrada del skill actualizada si existe
- Usuarios que invocaban `/requirement-from-code` deberán usar `/reverse-engineering`
