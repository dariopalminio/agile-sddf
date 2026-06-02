## 1. Crear agentes role-based

- [x] 1.1 Crear `.claude/agents/product-manager-agent.md` con frontmatter YAML (name, description, tools, model) e instrucciones consolidadas de funnel-agent, draft-agent, discovery-agent y approval-agent
- [x] 1.2 Crear `.claude/agents/architect-agent.md` con frontmatter YAML e instrucciones consolidadas de SPECIFY-agent y planning-agent
- [x] 1.3 Crear `.claude/agents/ux-designer-agent.md` con frontmatter YAML e instrucciones para flujos de usuario y usabilidad en discovery y SPECIFY

## 2. Actualizar skills para referenciar nuevos agentes

- [x] 2.1 Actualizar `.claude/skills/ps-funnel/SKILL.md` — cambiar referencia de `funnel-agent` a `product-manager-agent`
- [x] 2.2 Actualizar `.claude/skills/ps-draft/SKILL.md` — cambiar referencia de `draft-agent` a `product-manager-agent`
- [x] 2.3 Actualizar `.claude/skills/ps-discovery/SKILL.md` — cambiar referencia de `discovery-agent` a `product-manager-agent` (agente principal) y `ux-designer-agent` (agente secundario)
- [x] 2.4 Actualizar `.claude/skills/ps-SPECIFY/SKILL.md` — cambiar referencia de `SPECIFY-agent` a `architect-agent` (principal) y `product-manager-agent` (secundario)
- [x] 2.5 Actualizar `.claude/skills/ps-approval/SKILL.md` (si existe) — cambiar referencia de `approval-agent` a `product-manager-agent`
- [x] 2.6 Actualizar `.claude/skills/ps-planning/SKILL.md` — cambiar referencia de `planning-agent` a `architect-agent`

## 3. Eliminar agentes task-based

- [x] 3.1 Eliminar `.claude/agents/funnel-agent.md`
- [x] 3.2 Eliminar `.claude/agents/draft-agent.md`
- [x] 3.3 Eliminar `.claude/agents/discovery-agent.md`
- [x] 3.4 Eliminar `.claude/agents/SPECIFY-agent.md`
- [x] 3.5 Eliminar `.claude/agents/approval-agent.md`
- [x] 3.6 Eliminar `.claude/agents/planning-agent.md`

## 4. Actualizar documentación

- [x] 4.1 Actualizar `CLAUDE.md` — sección de estructura de agentes con los 3 nuevos agentes role-based y el mapeo a estados del workflow
- [x] 4.2 Verificar que no quedan referencias a agentes task-based en ningún archivo `.claude/skills/*/SKILL.md` ni en `CLAUDE.md`
