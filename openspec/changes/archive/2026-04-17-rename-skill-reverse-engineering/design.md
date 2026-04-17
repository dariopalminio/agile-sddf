## Context

El skill `requirement-from-code` existe en `.claude/skills/requirement-from-code/` con un `SKILL.md` que define su nombre, descripción y lógica de orquestación. Cinco agentes en `.claude/agents/` hacen referencia a este skill en sus descripciones. El `skills-lock.json` no contiene entradas del skill, por lo que no requiere actualización.

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill de `requirement-from-code` a `reverse-engineering`
- Actualizar el frontmatter (`name`, `description`) y las referencias internas en `SKILL.md`
- Actualizar las referencias al nombre del skill en los 5 archivos de agentes afectados

**Non-Goals:**
- Cambiar la lógica de orquestación del skill (fases, agentes, output)
- Actualizar documentación general del proyecto (README, CHANGELOG) — fuera de scope de este refactor
- Crear alias o redirección del comando `/requirement-from-code` anterior

## Decisions

**Decisión 1 — Nuevo nombre: `reverse-engineering`**
Alternativas consideradas: `reverse-spec`, `code-to-spec`, `infer-requirements`. Se elige `reverse-engineering` porque es el término técnico estándar para el proceso de derivar especificaciones desde un sistema existente, y es el que el usuario ya usa para describir la capacidad.

**Decisión 2 — No crear alias del comando antiguo**
Agregar compatibilidad hacia atrás (`/requirement-from-code` → `/reverse-engineering`) requeriría lógica adicional en el skill o un skill proxy. Para un proyecto interno sin contratos de API externos, el rename directo es más limpio.

**Decisión 3 — Actualizar agentes que referencian el skill**
Los 5 agentes de análisis paralelo mencionan `requirement-from-code` en su descripción. Estas referencias son informativas (no invocaciones), pero mantenerlas actualizadas preserva la coherencia del sistema.

## Risks / Trade-offs

- **Ruptura de invocaciones existentes** → Cualquier usuario que llame `/requirement-from-code` dejará de encontrar el skill. Mitigación: comunicar el cambio en CHANGELOG.
- **Referencias desactualizadas en docs externos** → Si hay notas, wikis o prompts fuera del repo que citen el nombre antiguo, quedarán desactualizados. Mitigación: fuera del scope de este change; es responsabilidad del equipo actualizar docs externos.
