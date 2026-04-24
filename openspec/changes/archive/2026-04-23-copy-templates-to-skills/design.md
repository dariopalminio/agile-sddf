## Context

El framework SDDF acumula templates de estructura en `docs/specs/templates/`. Este directorio fue pensado solo para salidas generadas (historias, releases, planes), pero actualmente mezcla esos documentos con los templates que los skills necesitan como entrada. Los skills que los usan referencian rutas absolutas o relativas a `docs/specs/templates/`, creando un acoplamiento entre skill y directorio de salida.

Skills ya migrados con templates locales: `project-begin` (`project-intent-template.md`), `project-planning` (`project-plan-template.md`). El patrón existe; hay que aplicarlo sistemáticamente al resto.

La práctica recomendada por Claude Code: un skill lleva consigo todo lo que necesita para funcionar (instrucciones, templates, ejemplos).

## Goals / Non-Goals

**Goals:**
- Cada skill afectado tiene su propio directorio `templates/` con los templates que necesita
- Ningún `SKILL.md` ni agente activo referencia `docs/specs/templates/`
- El directorio `docs/specs/templates/` conserva sus archivos como referencia histórica (no se borra)

**Non-Goals:**
- No se tocan `project-begin` ni `project-planning` (ya migrados)
- No se mueven los templates de `docs/specs/templates/others_references/` (openspec-*.md)
- No se cambia la lógica ni el comportamiento de ningún skill
- No se normaliza el contenido de los templates; se copian tal cual

## Decisions

### Copiar en lugar de mover
**Decisión**: Copiar templates a cada skill; conservar los originales en `docs/specs/templates/`.
**Alternativa**: Mover y eliminar → ruptura de cualquier referencia externa o histórica no identificada.
**Rationale**: La copia es reversible. El directorio `docs/specs/templates/` puede borrarse en una iteración futura cuando se confirme que ningún flujo externo lo usa.

### Duplicar templates cuando un template lo usan varios skills
**Decisión**: Cada skill recibe su propia copia del template aunque sea idéntica a la de otro skill.
**Alternativa**: Un directorio compartido tipo `.claude/shared/templates/` → sigue siendo un acoplamiento, pero más explícito.
**Rationale**: La autonomía del skill tiene más valor que el principio DRY para archivos de plantilla. Los templates evolucionan por skill; una copia local evita regresiones cruzadas.

### Actualizar referencias con rutas relativas al skill
**Decisión**: En cada `SKILL.md`, la referencia al template pasa de `docs/specs/templates/<template>.md` a `.claude/skills/<skill>/templates/<template>.md`.
**Rationale**: Las rutas absolutas relativas al repo son las más claras para Claude Code. No se usa `./templates/` (ruta relativa al archivo) para evitar ambigüedad cuando el skill se ejecuta desde distinto CWD.

## Risks / Trade-offs

- **Referencias no identificadas en agentes** → Buscar exhaustivamente con `grep -r "docs/specs/templates"` en `.claude/agents/` y `.claude/skills/` antes de marcar la tarea completa.
- **Templates con contenido desactualizado** → Los templates en `docs/specs/templates/` se copian tal cual; si ya divergieron de la práctica actual, esa deuda queda visible por skill (es una ventaja: cada equipo puede actualizar su copia).
- **Duplicación de mantenimiento futuro** → Aceptado. Si el contenido debe sincronizarse entre skills, es una señal de que el template debe refactorizarse como spec, no como archivo compartido.
