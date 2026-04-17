## 1. Renombrar directorio del skill

- [x] 1.1 Renombrar `.claude/skills/requirement-from-code/` a `.claude/skills/reverse-engineering/`

## 2. Actualizar SKILL.md

- [x] 2.1 Cambiar `name: requirement-from-code` a `name: reverse-engineering` en el frontmatter
- [x] 2.2 Actualizar el campo `description:` para reemplazar `/requirement-from-code` por `/reverse-engineering`
- [x] 2.3 Reemplazar referencias internas al path `..\skills\requirement-from-code\templates` por `..\skills\reverse-engineering\templates`
- [x] 2.4 Reemplazar referencias internas a `.agents\skills\requirement-from-code` por `.agents\skills\reverse-engineering`
- [x] 2.5 Reemplazar el texto del comando `/requirement-from-code` en el cuerpo del SKILL.md por `/reverse-engineering`

## 3. Actualizar agentes que referencian el skill

- [x] 3.1 Actualizar `arch-reverse-engineer.agent.md`: reemplazar `requirement-from-code` por `reverse-engineering`
- [x] 3.2 Actualizar `business-rules-analyst.agent.md`: reemplazar `requirement-from-code` por `reverse-engineering`
- [x] 3.3 Actualizar `product-discovery.agent.md`: reemplazar `requirement-from-code` por `reverse-engineering`
- [x] 3.4 Actualizar `requirements-synthesizer.agent.md`: reemplazar `requirement-from-code` por `reverse-engineering`
- [x] 3.5 Actualizar `ux-flow-mapper.agent.md`: reemplazar `requirement-from-code` por `reverse-engineering`

## 4. Verificar

- [x] 4.1 Confirmar que no quedan referencias a `requirement-from-code` en `.claude/` con `grep -r "requirement-from-code" .claude/`
- [x] 4.2 Verificar que el skill aparece correctamente listado como `reverse-engineering` en Claude Code
