## 1. Renombrar archivo del agente

- [x] 1.1 Renombrar `.claude/agents/ux-flow-mapper.agent.md` a `.claude/agents/reverse-engineer-ux-flow-mapper.agent.md`

## 2. Actualizar frontmatter y cuerpo del agente

- [x] 2.1 Cambiar `name: ux-flow-mapper` a `name: reverse-engineer-ux-flow-mapper` en el frontmatter
- [x] 2.2 Reemplazar `**Generado por**: ux-flow-mapper` por `**Generado por**: reverse-engineer-ux-flow-mapper` en el cuerpo

## 3. Actualizar referencias en otros archivos

- [x] 3.1 Actualizar `requirements-synthesizer.agent.md`: reemplazar `ux-flow-mapper` por `reverse-engineer-ux-flow-mapper`
- [x] 3.2 Actualizar `reverse-engineering/SKILL.md`: reemplazar `ux-flow-mapper` por `reverse-engineer-ux-flow-mapper` (diagrama de plan y nombre de sección)

## 4. Verificar

- [x] 4.1 Confirmar que no quedan referencias a `ux-flow-mapper` en `.claude/` con `grep -r "ux-flow-mapper" .claude/`
