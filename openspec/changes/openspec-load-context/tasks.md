## 1. Crear estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/openspec-load-context/`
- [x] 1.2 Crear archivo `.claude/skills/openspec-load-context/SKILL.md` con frontmatter y las instrucciones del skill

## 2. Implementar instrucciones del skill

- [x] 2.1 Escribir la instrucción de lectura exhaustiva: README.md, AGENTS.md (si existe), CLAUDE.md (si existe) y archivos relevantes del proyecto
- [x] 2.2 Escribir la instrucción de escritura del campo `context:` en `openspec/config.yaml` siguiendo el template del archivo
- [x] 2.3 Verificar que la instrucción preserva el campo `schema:` y `rules:` del config.yaml

## 3. Validación

- [x] 3.1 Verificar que el skill aparece en la lista de skills disponibles al invocar `/openspec-load-context`
- [x] 3.2 Ejecutar el skill en el proyecto actual y validar que `openspec/config.yaml` se actualiza con el contexto correcto del proyecto SDDF
