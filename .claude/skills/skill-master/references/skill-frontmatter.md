# Convenciones de Frontmatter YAML en SKILL.md

## Plantilla canónica

```yaml
---
name: nombre-del-skill
description: >-
  Descripción de una o dos líneas. Incluir frases clave que disparan el skill
  automáticamente y verbos de acción que describan qué hace.
triggers:
  - "frase disparadora 1"
  - "frase disparadora 2"
---
```

---

## Campos y sus reglas

### `name` (OBLIGATORIO)
- DEBE coincidir exactamente con el nombre del directorio del skill (kebab-case)
- NO DEBE contener espacios ni caracteres especiales
- Ejemplo: `pdf-summarizer`, `commit-formatter`

### `description` (OBLIGATORIO)
- DEBE usar el bloque `>-` para evitar saltos de línea inesperados en YAML
- DEBE incluir las frases clave que el sistema usa para decidir si el skill se activa
- DEBE responder a: "¿Cuándo debo usar este skill?"
- DEBE incluir verbos de acción: "Genera", "Evalúa", "Crea", "Implementa"
- PUEDE incluir sinónimos y frases alternativas que un usuario podría escribir
- NO DEBE superar 3 líneas (el sistema trunca descripciones largas)

**Ejemplo correcto:**
```yaml
description: >-
  Genera un resumen estructurado de documentos PDF con key findings y recommendations.
  Usar siempre que el usuario quiera resumir, analizar o extraer puntos clave de un PDF,
  incluso si no menciona explícitamente "PDF" o "resumen".
```

**Ejemplo incorrecto:**
```yaml
description: "Este skill hace cosas con PDFs"  # demasiado vago, no hay frases clave
```

### `triggers` (RECOMENDADO)
- Lista de frases literales que activan el skill cuando el usuario las escribe
- DEBE incluir el nombre exacto del skill como frase
- DEBE incluir variantes en lenguaje natural que un usuario usaría
- Ejemplo:
```yaml
triggers:
  - "resumir PDF"
  - "analizar documento"
  - "extraer puntos clave"
  - "pdf-summarizer"
```

### `allowed-tools` (OPCIONAL — procesado por Claude Code)
- Restringe las herramientas disponibles durante la ejecución del skill
- SOLO usar cuando el skill debe limitar explícitamente el acceso a herramientas
- Ejemplo:
```yaml
allowed-tools: Read, Grep, Glob, Write, Edit
```

---

## Campos eliminados del canon

Los siguientes campos se usaron históricamente pero **no son procesados por el harness de Claude Code** y generan metadata muerta. No incluirlos en skills nuevos ni existentes:

| Campo | Motivo de eliminación |
|-------|----------------------|
| `version` | No procesado por el harness. El ciclo de vida se gestiona con git. |
| `type` | No procesado. `delegate` es el comportamiento por defecto siempre. |
| `input` / `output` / `outputs` | No procesados. Documentar en el body del skill si es necesario. |
| `invocable` | No procesado. Todo skill es invocable por defecto. |
| `alwaysApply` | Solo aplica a **agentes** (`.claude/agents/`), no a skills. En skills es no-op. |
| `license` | No procesado por el harness. Usar solo en skills publicados en npm. |
| `metadata` | Bloque anidado no procesado. Cualquier metadato relevante va en el body. |
| `compatibility` | No procesado. Documentar precondiciones en la sección "Precondiciones". |
| `author`, `version`, `tags`, `category`, `models`, `mcp`, `capabilities`, `languages`, `department` | Metadata de origen externo. Sin efecto en el harness. |

---

## Nota sobre `alwaysApply`

`alwaysApply: true` es un campo de **agentes** (archivos `.agent.md` en `.claude/agents/`), no de skills. En agents, indica que el agente se inyecta en el system prompt de toda sesión. En skills, este campo no tiene efecto. No usarlo en SKILL.md.
