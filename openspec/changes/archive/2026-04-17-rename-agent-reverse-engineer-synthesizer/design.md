## Context

El agente `requirements-synthesizer` está en `.claude/agents/requirements-synthesizer.agent.md`. A diferencia de los agentes de análisis paralelo (que solo lo referenciaban en 1-2 lugares), este agente es referenciado desde 6 archivos distintos: su propio archivo, los 4 agentes de análisis paralelo (en sus descripciones y/o cuerpos) y el skill `reverse-engineering/SKILL.md`.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente
- Actualizar frontmatter (`name`) y `**Generado por**` internos
- Actualizar todas las referencias en los 6 archivos externos

**Non-Goals:**
- Cambiar lógica o comportamiento del agente
- Crear alias para el nombre anterior

## Decisions

**Decisión — Nuevo nombre: `reverse-engineer-synthesizer`**  
Completa el patrón `<proceso>-<rol>` del sistema. El rol es "synthesizer" (fusiona outputs de los 4 agentes de análisis) dentro del proceso de "reverse engineering". Se acorta "requirements-synthesizer" a "synthesizer" para mantener la consistencia con los demás agentes que usan roles cortos.

## Risks / Trade-offs

- **Mayor blast radius que renames anteriores** → Este agente es referenciado por 4 archivos adicionales (los agentes de análisis). El `sed -i` global sobre `.claude/` garantiza que no queden referencias huérfanas.
- **Ruptura de invocaciones externas** → Solo el skill `reverse-engineering` invoca a este agente; se actualiza en este mismo change. Riesgo bajo.
