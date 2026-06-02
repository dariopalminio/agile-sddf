## Context

El pipeline actual tiene 7 skills expuestos al usuario final distribuidos en directorios independientes bajo `.claude/skills/`. Cada skill tiene su propio template y SKILL.md. Los skills a consolidar son:

- `ps-funnel/` + `ps-draft/` → nuevo `ps-begin-intention/`
- `ps-discovery/` + `ps-SPECIFY/` → nuevo `ps-project-spec/`
- `ps-planning/` → se mantiene con ajustes menores
- `ps-approval/` + `ps-finish/` → se eliminan sin reemplazo

Templates existentes relevantes:
- `ps-funnel/templates/initial-prompt-template.md` — ya no se necesita (el output intermedio desaparece)
- `ps-draft/templates/project-intent-template.md` → mueve a `ps-begin-intention/templates/`
- `ps-discovery/templates/discovery-template.md` — ya no se necesita (output intermedio desaparece)
- `ps-SPECIFY/templates/project-template.md` → mueve a `ps-project-spec/templates/`
- `ps-planning/templates/project-plan-template.md` → se mantiene en su lugar

## Goals / Non-Goals

**Goals:**
- Crear `ps-begin-intention/SKILL.md` que en una sola sesión capture la intención del usuario y produzca `project-intent.md`
- Crear `ps-project-spec/SKILL.md` que conduzca discovery + especificación y produzca `requirement-spec.md`
- Eliminar los 6 skills obsoletos y sus directorios completos
- El usuario solo necesita conocer 3 comandos

**Non-Goals:**
- Modificar los agentes role-based
- Cambiar el contenido ni la estructura de los documentos de salida
- Modificar `ps-planning/SKILL.md` (solo se actualiza si referencia skills eliminados)

## Decisions

### D1: Eliminar documentos intermedios (initial-prompt.md, discovery.md, clarifications.md)

**Decisión:** Los nuevos skills no generan `initial-prompt.md` ni `discovery.md` como archivos persistentes intermedios. La información se captura en memoria durante la sesión y el agente produce directamente el documento de salida final.

**Rationale:** Reducir la cantidad de archivos en `$SPECS_BASE/specs/projects/` simplifica el workspace. Los documentos intermedios eran útiles en el pipeline de 7 pasos pero son overhead en el pipeline de 3 pasos.

**Alternativa descartada:** Mantener los intermedios como "borradores" internos — agrega complejidad sin valor visible al usuario.

### D2: ps-begin-intention usa product-manager-agent en modo continuo

**Decisión:** `ps-begin-intention/SKILL.md` invoca al `product-manager-agent` con instrucciones para hacer dos cosas en secuencia en la misma sesión:
1. Capturar la intención inicial del proyecto (lo que hacía Funnel)
2. Refinar y producir `project-intent.md` (lo que hacía Draft)

El agente usa el template `project-intent-template.md` como única referencia de estructura.

### D3: ps-project-spec usa product-manager-agent + architect-agent en secuencia

**Decisión:** `ps-project-spec/SKILL.md` invoca primero al `product-manager-agent` para el discovery de usuarios y contexto, luego al `architect-agent` para la especificación de requisitos. El output final es `requirement-spec.md`.

El agente usa `project-template.md` como estructura de output. El `ux-designer-agent` puede ser invocado como apoyo en la sección de flujos de usuario.

### D4: Templates a preservar y reubicar

| Template original | Nueva ubicación |
|---|---|
| `ps-draft/templates/project-intent-template.md` | `ps-begin-intention/templates/project-intent-template.md` |
| `ps-SPECIFY/templates/project-template.md` | `ps-project-spec/templates/project-template.md` |
| `ps-planning/templates/project-plan-template.md` | Sin cambios |

Templates eliminados (documentos intermedios que desaparecen):
- `ps-funnel/templates/initial-prompt-template.md`
- `ps-discovery/templates/discovery-template.md`
- `ps-approval/templates/clarifications-template.md` (si existe)

## Risks / Trade-offs

- **[Riesgo] Pérdida de granularidad**: Los usuarios no pueden pausar entre Funnel y Draft, ni entre Discovery y SPECIFY. → Mitigation: Los nuevos skills son re-ejecutables (idempotencia); si el usuario quiere pausar, puede simplemente interrumpir y re-ejecutar.
- **[Trade-off] Sessions más largas**: Los nuevos skills tienen más pasos en una sola sesión. → Aceptable dado que el principio de minimalismo prioriza la simplicidad de interfaz sobre la granularidad de control.
- **[Riesgo] CLAUDE.md stale**: El workflow documentado en CLAUDE.md debe actualizarse. → Mitigation: incluido en las tareas de implementación.
