## Context

ProjectSpecFactory es un pipeline de agentes Claude Code que transforma la intención de un proyecto en documentación estructurada. El cuarto estado del workflow (SPECIFY) carece de implementación. Los estados anteriores (Funnel, Draft, Discovery) ya están implementados con el patrón: skill orquestador → agente especializado → documento de output. Este estado debe seguir exactamente el mismo patrón.

El estado actual del pipeline es:
- Input disponible: `$SPECS_BASE/specs/projects/discovery.md` (generado por Discovery)
- Output requerido: `$SPECS_BASE/specs/projects/project.md`
- Template de referencia: `docs/templates/requirements-spec-template.md` (existente, NO se modifica)

## Goals / Non-Goals

**Goals:**
- Implementar el estado SPECIFY con el patrón establecido: skill + agente + template
- El skill orquesta (valida precondiciones, delega, confirma output)
- El agente entrevista al usuario sección por sección del template en runtime
- El template vive junto al skill que lo usa (`templates/` dentro del skill)
- Validar el campo `**Estado**` en `discovery.md` antes de proceder
- El template existente en `docs/templates/` sirve solo como referencia de estructura

**Non-Goals:**
- Modificar el template en `docs/templates/requirements-spec-template.md`
- Modificar skills o agentes existentes
- Generar `architecture-spec.md` (eso pertenece a otro estado o iteración futura)
- Integración con Jira/Linear o cualquier herramienta externa

## Decisions

### Decisión 1: Patrón skill + agente (igual que Discovery)

**Elección**: Replicar el patrón de ps-discovery/discovery-agent.

**Rationale**: El patrón ya está probado y los usuarios lo conocen. Consistencia sobre originalidad. Un skill orquestador delega a un agente especializado que tiene tools limitados (Read, Write, Edit, AskUserQuestion).

**Alternativa descartada**: Poner toda la lógica en el skill. Descartado porque los skills no tienen memoria de conversación entre pasos y el agente mantiene mejor el contexto de la entrevista.

### Decisión 2: Template copiado junto al skill

**Elección**: Crear `project-template.md` en `.claude/skills/ps-SPECIFY/templates/` copiando la estructura de `docs/templates/requirements-spec-template.md`.

**Rationale**: Principio del repo — "el template vive junto al skill que lo usa". El template en `docs/templates/` es legacy/referencia y no se toca. El agente referencia su template con ruta relativa desde el skill.

**Alternativa descartada**: Que el agente lea directamente `docs/templates/`. Descartado porque acoplaría el agente a rutas fuera de su directorio y rompería la autonomía del skill.

### Decisión 3: Agente nombrado `SPECIFY-agent`

**Elección**: `.claude/agents/SPECIFY-agent.md` con frontmatter `name: SPECIFY-agent`.

**Rationale**: Convención de nombres del proyecto: `<estado>-agent`. Consistente con `funnel-agent`, `draft-agent`, `discovery-agent`.

### Decisión 4: Validación de Estado en discovery.md

**Elección**: El `SPECIFY-agent` valida el campo `**Estado**` en `discovery.md` y pide confirmación si está en `IN‑PROGRESS`.

**Rationale**: El mismo patrón existe en `discovery-agent` para `project-intent.md`. Mantiene consistencia y previene avanzar con outputs incompletos.

## Risks / Trade-offs

- **[Riesgo] Template duplicado** → El template en `.claude/skills/ps-SPECIFY/templates/` puede divergir del de `docs/templates/` si alguien edita solo uno. Mitigación: el de `docs/templates/` es solo referencia; el canónico para el agente es el del skill.
- **[Riesgo] El agente infiere demasiado** → Si el discovery.md está incompleto, el agente puede rellenar con `[inferido]` datos incorrectos. Mitigación: el agente propone revisión al usuario al finalizar.
- **[Trade-off] Un solo agente para toda la entrevista** → Podría necesitar muchas interacciones para proyectos complejos. Aceptable para MVP; en el futuro podría dividirse por sección.
