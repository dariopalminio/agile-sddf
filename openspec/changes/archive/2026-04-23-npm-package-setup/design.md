## Context

El repositorio contiene el framework SDDF completo en `.claude/skills/` y `.claude/agents/`, pero no tiene `package.json`. La distribución actual requiere clonar el repositorio o copiar manualmente los archivos. El objetivo es preparar la configuración mínima necesaria para que `npm publish --access public` funcione correctamente y el paquete sea instalable.

El repositorio ya tiene `LICENSE` y `README.md`. Existe `skills-lock.json` (lockfile del propio sistema de skills de Claude Code) que debe excluirse del paquete.

## Goals / Non-Goals

**Goals:**
- El repositorio tiene un `package.json` válido con nombre, versión, descripción y `files`
- El paquete publicado contiene `.claude/` (skills + agents), `README.md` y `LICENSE`
- El paquete no contiene archivos de desarrollo ni de especificación interna
- `npm publish --access public` funciona sin errores

**Non-Goals:**
- Script de instalación automática `postinstall` (Historia 2)
- Automatización CI/CD con GitHub Actions (Historia 3)
- Configuración de symlinks para GitHub Copilot
- Subir el paquete a ningún registry privado

## Decisions

### Nombre del paquete: `agile-sddf` en lugar de `@sddf/core`
**Decisión**: Usar `agile-sddf` (sin scope de organización).
**Alternativa**: `@sddf/core` requiere crear y verificar la organización `@sddf` en npm, que puede estar ocupada o requerir tiempo de aprobación.
**Rationale**: `agile-sddf` está disponible con alta probabilidad, es descriptivo y no bloquea la publicación. El nombre puede migrarse a un scope en una versión futura.

### Campo `files` en lugar de `.npmignore`
**Decisión**: Usar el campo `files` en `package.json` para un allowlist explícito de lo que se incluye.
**Alternativa**: `.npmignore` como blocklist — más frágil porque un archivo nuevo en el repo queda incluido por defecto.
**Rationale**: El allowlist explícito es más seguro: solo se publica lo declarado. Si se añaden directorios nuevos al repo (ej. `rovo/`, `gem/`), no se incluyen accidentalmente.

### Versión inicial: `1.0.0`
**Decisión**: Empezar en `1.0.0` siguiendo semver, alineado con el changelog del proyecto.
**Alternativa**: `0.x.y` (indicaría API inestable) — no aplica porque el framework ya tiene releases estables documentados.

## Risks / Trade-offs

- **[Riesgo] `@sddf/core` ya ocupado en npm** → Usar `agile-sddf` como fallback; verificar disponibilidad antes de publicar con `npm show agile-sddf`
- **[Riesgo] `.claude/` contiene archivos binarios o de caché** → Revisar el contenido antes de publicar con `npm pack --dry-run`
- **[Trade-off] `files` allowlist requiere actualización manual al agregar nuevos directorios a `.claude/`** → Aceptable; es un cambio intencional que merece una versión bump
- **[Riesgo] `skills-lock.json` puede confundir a usuarios** → Excluir del paquete; es metadata interna del entorno del mantenedor
