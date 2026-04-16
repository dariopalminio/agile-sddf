## REMOVED Requirements

### Requirement: ps-project-spec skill exists and is invocable
**Reason**: Skill renombrado a `ps-discovery-skill`. El directorio `.claude/skills/ps-project-spec/` y el comando `/ps-project-spec` ya no existen.
**Migration**: Usar `/ps-discovery` en lugar de `/ps-project-spec`.

### Requirement: ps-project-spec requires project-intent.md as input
**Reason**: Reemplazado por `ps-discovery-skill` con comportamiento equivalente.
**Migration**: Ver requisito equivalente en `ps-discovery-skill`.

### Requirement: ps-project-spec produces requirement-spec.md
**Reason**: Reemplazado por `ps-discovery-skill` con el mismo documento de salida.
**Migration**: Ver requisito equivalente en `ps-discovery-skill`.

### Requirement: ps-project-spec uses architect-agent as primary agent
**Reason**: Reemplazado por `ps-discovery-skill` con los mismos agentes.
**Migration**: Ver requisito equivalente en `ps-discovery-skill`.

### Requirement: ps-project-spec template exists
**Reason**: Template movido a `.claude/skills/ps-discovery/templates/requirement-spec-template.md`.
**Migration**: Ver requisito equivalente en `ps-discovery-skill`.
