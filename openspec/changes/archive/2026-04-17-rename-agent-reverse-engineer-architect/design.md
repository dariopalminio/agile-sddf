## Context

El agente `arch-reverse-engineer` está definido en `.claude/agents/arch-reverse-engineer.agent.md`. Es referenciado por nombre en dos lugares adicionales: `requirements-synthesizer.agent.md` (descripción del agente) y `reverse-engineering/SKILL.md` (diagrama de plan y nombre de sección `### Agente arch-reverse-engineer`). El campo `**Generado por**` en el cuerpo del agente también usa el nombre actual.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente
- Actualizar el frontmatter (`name`) y el campo `**Generado por**` internos
- Actualizar todas las referencias en los 2 archivos que mencionan el agente

**Non-Goals:**
- Cambiar la lógica, instrucciones o comportamiento del agente
- Crear alias o soporte para el nombre anterior
- Actualizar docs externos al repositorio

## Decisions

**Decisión — Nuevo nombre: `reverse-engineer-architect`**  
Alternativas consideradas: `architecture-analyst`, `tech-stack-analyzer`, `arch-analyst`. Se elige `reverse-engineer-architect` porque sigue el patrón `<proceso>-<rol>` coherente con los demás agentes del workflow (`reverse-engineering` es el proceso, `architect` es el rol) y es inequívoco sobre su función.

## Risks / Trade-offs

- **Ruptura de invocaciones directas por nombre** → Si algún prompt externo invoca al agente por nombre `arch-reverse-engineer`, dejará de funcionar. Mitigación: el agente solo es invocado internamente desde el skill `reverse-engineering`, que también se actualiza en este change.
