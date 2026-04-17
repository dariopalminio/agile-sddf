## 1. Renombrar archivo del agente

- [x] 1.1 Renombrar `.claude/agents/product-discovery.agent.md` a `.claude/agents/reverse-engineer-product-discovery.agent.md`

## 2. Actualizar frontmatter y cuerpo del agente

- [x] 2.1 Cambiar `name: product-discovery` a `name: reverse-engineer-product-discovery` en el frontmatter
- [x] 2.2 Reemplazar `**Generado por**: product-discovery` por `**Generado por**: reverse-engineer-product-discovery` en el cuerpo

## 3. Actualizar referencias en otros archivos

- [x] 3.1 Actualizar `requirements-synthesizer.agent.md`: reemplazar `product-discovery` por `reverse-engineer-product-discovery`
- [x] 3.2 Actualizar `reverse-engineering/SKILL.md`: reemplazar `product-discovery` por `reverse-engineer-product-discovery` (diagrama de plan y nombre de sección)

## 4. Verificar

- [x] 4.1 Confirmar que no quedan referencias a `product-discovery` en `.claude/` con `grep -r "product-discovery" .claude/`
