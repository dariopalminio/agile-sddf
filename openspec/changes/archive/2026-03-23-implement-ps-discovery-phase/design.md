## Context

ProjectSpecFactory tiene implementados los estados Funnel y Draft. El estado Discovery es el siguiente en el workflow (`Funnel → Draft → **Discovery** → SPECIFY → ...`) pero carece de implementación. El sistema ya define `/ps-discover` como comando en CLAUDE.md pero sin skill, agente ni template de soporte.

El estado Draft produce `$SPECS_BASE/specs/project-intent.md` como input de Discovery. El estado Discovery debe producir `$SPECS_BASE/specs/discovery.md` que capture: visión del producto, usuarios clave, user journey map, preguntas de discovery e hipótesis de validación.

El patrón establecido por Draft (skill orchestrator + agente especializado + template junto al skill) es el modelo a replicar.

## Goals / Non-Goals

**Goals:**
- Implementar skill `ps-discovery` como orchestrator del estado Discovery
- Implementar agente `discovery-agent` que conduce la entrevista de discovery
- Proveer template `discovery-template.md` colocado junto al skill (autónomo)
- El agente extrae secciones y guías del template en runtime (no hardcodea preguntas)
- El agente lee `project-intent.md` de la fase anterior y construye sobre ese contexto
- El output final es `$SPECS_BASE/specs/discovery.md` con metadatos de generación

**Non-Goals:**
- No modificar el template de referencia en `docs/templates/discovery.md`
- No integrar con herramientas externas (Jira, Miro, etc.)
- No automatizar la validación de hipótesis
- No implementar otros estados del pipeline (SPECIFY, Approval, Planning)

## Decisions

### D1: Template junto al skill (no centralizado)

**Decisión**: El template `discovery-template.md` vive en `.claude/skills/ps-discovery/templates/` en lugar de en `docs/templates/`.

**Rationale**: El principio de autonomía del skill requiere que cada skill sea autónomo. El template en `docs/templates/discovery.md` existe como referencia/ejemplo pero no debe modificarse. Al tener su propio template, el skill puede evolucionar independientemente.

**Alternativa descartada**: Template centralizado en `docs/templates/` — crea acoplamiento entre skills y un directorio compartido; violaría el principio de skill autónomo.

### D2: Agente extrae preguntas del template en runtime

**Decisión**: El `discovery-agent` lee los headers `##` y comentarios `<!-- -->` del template para derivar las preguntas de entrevista, en lugar de tener preguntas hardcodeadas.

**Rationale**: Hace el agente adaptativo: si el template cambia (secciones nuevas, renombradas), el comportamiento del agente se actualiza automáticamente sin tocar el código del agente. Este patrón ya existe en `draft-agent`.

**Alternativa descartada**: Preguntas hardcodeadas — rompe la extensibilidad; cada cambio al template requiere actualizar el agente.

### D3: Skill como orchestrator liviano

**Decisión**: El skill `ps-discovery` solo verifica precondiciones (input existe, template existe), delega al agente y confirma el output. Toda la lógica de entrevista vive en el agente.

**Rationale**: Separación de responsabilidades. El skill es el punto de entrada del usuario; el agente es el especialista. Replicar el patrón del par `ps-draft` / `draft-agent`.

### D4: Frontmatter del agente

El `discovery-agent` tendrá:
```yaml
name: discovery-agent
description: Agente PM especializado en la fase Discovery. Lee project-intent.md, conduce entrevista sección por sección del template discovery-template.md y produce docs/specs/discovery.md.
tools:
  - Read
  - Write
  - Edit
  - AskUserQuestion
model: sonnet
```

## Risks / Trade-offs

- **Template fuera de sincronía** → Si el template en `docs/templates/discovery.md` evoluciona pero el del skill no, pueden divergir. Mitigación: documentar en el skill que su template es la fuente de verdad operacional.
- **Entrevista larga** → Discovery tiene más secciones que Draft; riesgo de fatiga. Mitigación: agente agrupa máx 3-4 preguntas por ronda, igual que `draft-agent`.
- **Inferencias incorrectas** → El agente puede inferir mal el contexto si `project-intent.md` es escueto. Mitigación: marcar con `[inferido]` y proponer al usuario revisar el output antes de avanzar.
