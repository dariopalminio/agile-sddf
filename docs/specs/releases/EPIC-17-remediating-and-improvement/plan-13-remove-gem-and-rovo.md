# Plan: Eliminar gem/ y rovo/

## Contexto

`gem/`, `rovo/`, `openspec-init-config/` y `openspec-generate-baseline/` son utilidades accesorias legacy que contienen prompts divergentes del framework (no se sincronizan desde `.claude/`, se mantienen manualmente). El EPIC-17 plan-08 ya las reclasificó como "accesorias, no runtime" en README.md y CLAUDE.md. El siguiente paso natural es eliminarlas completamente: no están en el paquete npm (`package.json` usa whitelist `files`), no tienen dependencias internas en scripts ni skills, y mantenerlas en git solo genera confusión sobre el alcance real del framework.

**Item de referencia:** `release.md` línea 53 — `- [ ] Eliminar gem y rovo porque son prompts legacy divergentes…`

---

## Inventario a eliminar

| Directorio | Archivos |
|---|---|
| `gem/` | `README.md`, `prompts/prompt-project-begin-intention.md`, `prompts/prompt-project-discovery.md`, `prompts/prompt-project-planning.md` |
| `rovo/` | `README.md`, `release-creator-agent.md`, `release-validator-agent.md`, `release-reverse-generator.md`, `story-creator-agent.md`, `story-evaluator-agent.md`, `story-splitter-agent.md` |

---

## Implementación

### Paso 1 — Eliminar los directorios

```bash
rm -rf gem/ rovo/
```

### Paso 2 — Limpiar referencias en README.md

Dos menciones a actualizar:

- **Línea 46** — quitar el punto de bullet que menciona `gem/` y `rovo/` como "Utilidades accesorias"
- **Línea 136** — quitar la línea que lista "Jira con Rovo (`rovo/`), Google Gemini Gems (`gem/`)"

Si la sección de utilidades accesorias queda vacía, eliminar también el encabezado.

### Paso 3 — Limpiar referencia en CLAUDE.md

Una mención: la frase "Los directorios `gem/` (Google Gemini Gems) y `rovo/` (Atlassian Rovo) son utilidades accesorias, no runtimes del framework" en la sección de plataformas soportadas. Eliminar esa frase (o el párrafo completo si queda vacío).

### Paso 4 — Marcar ítem en release.md

Cambiar `- [ ] Eliminar gem y rovo…` → `- [x] Eliminar gem y rovo…` con nota de resolución.

### Paso 5 - Eliminar skills de openspec no parte del framework
Aunque `openspec-init-config/` y `openspec-generate-baseline/` no son parte del framework, sí son parte de la suite de utilidades de Agile SDDF y su mantenimiento es un overhead innecesario. No tienen dependencias internas ni referencias externas, por lo que se pueden eliminar sin impacto. Eliminar Eliminar  `openspec-init-config/` y `openspec-generate-baseline/` de package.json

---

## Archivos NO modificados

- `CHANGELOG.md` — registro histórico, se deja intacto
- `docs/specs/` — contexto histórico de releases pasados, no se toca
- `package.json` — ya excluye ambos directorios; no requiere cambio

---

## Verificación

1. `ls gem/ rovo/` → error "No such file or directory" (directorios eliminados)
2. `grep -r "gem/" README.md CLAUDE.md` → 0 resultados
3. `grep -r "rovo/" README.md CLAUDE.md` → 0 resultados
4. `node scripts/install.js --dry-run` (si existe esa flag) o revisar que el script no hace `cp gem/` o `cp rovo/` a ningún lado
