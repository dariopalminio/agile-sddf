## 1. Renombrar archivo del agente

- [x] 1.1 Renombrar `.claude/agents/requirements-synthesizer.agent.md` a `.claude/agents/reverse-engineer-synthesizer.agent.md`

## 2. Actualizar frontmatter y cuerpo del agente

- [x] 2.1 Cambiar `name: requirements-synthesizer` a `name: reverse-engineer-synthesizer` en el frontmatter
- [x] 2.2 Reemplazar `**Generado por**: requirements-synthesizer` por `**Generado por**: reverse-engineer-synthesizer` en el cuerpo

## 3. Actualizar referencias en agentes de análisis paralelo

- [x] 3.1 Actualizar `reverse-engineer-architect.agent.md`: reemplazar todas las ocurrencias de `requirements-synthesizer` por `reverse-engineer-synthesizer`
- [x] 3.2 Actualizar `reverse-engineer-business-analyst.agent.md`: reemplazar todas las ocurrencias de `requirements-synthesizer` por `reverse-engineer-synthesizer`
- [x] 3.3 Actualizar `reverse-engineer-product-discovery.agent.md`: reemplazar todas las ocurrencias de `requirements-synthesizer` por `reverse-engineer-synthesizer`
- [x] 3.4 Actualizar `reverse-engineer-ux-flow-mapper.agent.md`: reemplazar todas las ocurrencias de `requirements-synthesizer` por `reverse-engineer-synthesizer`

## 4. Actualizar el skill

- [x] 4.1 Actualizar `reverse-engineering/SKILL.md`: reemplazar `requirements-synthesizer` por `reverse-engineer-synthesizer` (diagrama de plan y nombre de sección)

## 5. Verificar

- [x] 5.1 Confirmar que no quedan referencias a `requirements-synthesizer` en `.claude/` con `grep -r "requirements-synthesizer" .claude/`
