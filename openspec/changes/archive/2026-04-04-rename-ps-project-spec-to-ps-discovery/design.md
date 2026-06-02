## Context

El skill `ps-project-spec` fue creado en el cambio anterior como fusión de Discovery + SPECIFY. El nombre elegido priorizó el artefacto de salida (`requirement-spec`) sobre la acción que conduce el skill. El nombre `ps-discovery` es más intuitivo para el usuario y es consistente con el vocabulario del workflow (`begin-intention → discovery → planning`).

El cambio es puramente de renaming — no hay modificaciones de comportamiento, lógica ni templates.

**Archivos afectados:**
- `.claude/skills/ps-project-spec/` → `.claude/skills/ps-discovery/` (directorio completo)
- `.claude/skills/ps-discovery/SKILL.md` — frontmatter `name:` y rutas de template
- `CLAUDE.md` — lista de comandos, tabla de documentos, estructura de directorios
- `.claude/skills/ps-planning/SKILL.md` — mensaje de error con referencia al predecesor

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill y actualizar todas las referencias internas
- Que el usuario invoque `/ps-discovery` para el paso de discovery + especificación
- Que todas las referencias en documentación apunten al nombre correcto

**Non-Goals:**
- No modificar el comportamiento del SKILL.md (lógica de orquestación, pasos, agentes invocados)
- No modificar el template `project-template.md`
- No cambiar los documentos de salida (`requirement-spec.md`)
- No cambiar los agentes role-based

## Decisions

### D1: Renombrar directorio completo (no crear alias)

**Decisión:** Mover `.claude/skills/ps-project-spec/` → `.claude/skills/ps-discovery/` en lugar de mantener el directorio original con un alias o symlink.

**Rationale:** El proyecto es minimalista — no tiene runtime de resolución de aliases. Claude Code carga skills por nombre de directorio, por lo que el cambio de nombre debe ser directo. Mantener el directorio viejo crearía confusión.

**Alternativa descartada:** Crear `.claude/skills/ps-discovery/SKILL.md` que simplemente llame a `ps-project-spec` — agrega indirección sin valor.

### D2: Actualizar referencias en todos los archivos afectados en el mismo cambio

**Decisión:** Actualizar CLAUDE.md y ps-planning/SKILL.md en la misma operación de rename, no en un cambio separado.

**Rationale:** Un rename parcial dejaría el sistema en estado inconsistente. El usuario vería `/ps-project-spec` en algunos lugares y `/ps-discovery` en otros.

## Risks / Trade-offs

- **[Riesgo] CLAUDE.md desactualizado**: Si se olvida actualizar alguna referencia, el usuario verá comandos que no existen. → Mitigation: la tarea de verificación (task final) revisa todas las referencias.
- **[Trade-off] Breaking change**: Cualquier documentación externa o historial que mencione `/ps-project-spec` quedará desactualizado. → Aceptable: el proyecto no tiene docs externos y el historial git conserva la historia.
