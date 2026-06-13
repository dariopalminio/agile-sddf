# .github/ — Integración GitHub Copilot y CI

Este directorio combina dos tipos de contenido:

## Archivos puntero (integración GitHub Copilot)

- `agents` — archivo de texto que apunta a `.claude/agents`
- `skills` — archivo de texto que apunta a `.claude/skills`

No contienen los skills ni los agentes en sí. El contenido real se instala con:

```bash
npx agile-sddf install --target .github
```

El instalador copia los 47 skills y 10 agentes desde `.claude/` — la **fuente única de verdad** del framework. Ver `scripts/install.js`.

## Contenido propio (no son copias)

- `prompts/` — 4 prompts de integración OpenSpec para GitHub Copilot (`opsx-apply`, `opsx-archive`, `opsx-explore`, `opsx-propose`)
- `workflows/` — GitHub Actions del repositorio (`docker-security.yml`, `skill-security-audit.yml`)

> **Plataformas soportadas:** Claude Code, OpenCode y GitHub Copilot. Ver CLAUDE.md y README.md raíz.
