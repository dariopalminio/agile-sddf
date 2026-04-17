## 1. Renombrar archivo del agente

- [x] 1.1 Renombrar `.claude/agents/arch-reverse-engineer.agent.md` a `.claude/agents/reverse-engineer-architect.agent.md`

## 2. Actualizar frontmatter y cuerpo del agente

- [x] 2.1 Cambiar `name: arch-reverse-engineer` a `name: reverse-engineer-architect` en el frontmatter
- [x] 2.2 Reemplazar `**Generado por**: arch-reverse-engineer` por `**Generado por**: reverse-engineer-architect` en el cuerpo

## 3. Actualizar referencias en otros archivos

- [x] 3.1 Actualizar `requirements-synthesizer.agent.md`: reemplazar `arch-reverse-engineer` por `reverse-engineer-architect`
- [x] 3.2 Actualizar `reverse-engineering/SKILL.md`: reemplazar `arch-reverse-engineer` por `reverse-engineer-architect` (diagrama de plan y nombre de sección)

## 4. Verificar

- [x] 4.1 Confirmar que no quedan referencias a `arch-reverse-engineer` en `.claude/` con `grep -r "arch-reverse-engineer" .claude/`
