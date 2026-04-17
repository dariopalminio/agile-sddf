## 1. Renombrar archivo del agente

- [x] 1.1 Renombrar `.claude/agents/business-rules-analyst.agent.md` a `.claude/agents/reverse-engineer-business-analyst.agent.md`

## 2. Actualizar frontmatter y cuerpo del agente

- [x] 2.1 Cambiar `name: business-rules-analyst` a `name: reverse-engineer-business-analyst` en el frontmatter
- [x] 2.2 Reemplazar `**Generado por**: business-rules-analyst` por `**Generado por**: reverse-engineer-business-analyst` en el cuerpo

## 3. Actualizar referencias en otros archivos

- [x] 3.1 Actualizar `requirements-synthesizer.agent.md`: reemplazar `business-rules-analyst` por `reverse-engineer-business-analyst`
- [x] 3.2 Actualizar `reverse-engineering/SKILL.md`: reemplazar `business-rules-analyst` por `reverse-engineer-business-analyst` (diagrama de plan y nombre de sección)

## 4. Verificar

- [x] 4.1 Confirmar que no quedan referencias a `business-rules-analyst` en `.claude/` con `grep -r "business-rules-analyst" .claude/`
