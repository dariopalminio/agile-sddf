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
version: "1.0.0"
type: delegate
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

### `version` (OBLIGATORIO)
- DEBE seguir SemVer: `"MAJOR.MINOR.PATCH"`
- Incrementar `PATCH` para correcciones sin cambio de comportamiento
- Incrementar `MINOR` para nuevas capacidades backwards-compatible
- Incrementar `MAJOR` para cambios que rompen el contrato del skill
- Ejemplo: `"1.0.0"` → `"1.0.1"` (fix) → `"1.1.0"` (nueva sección) → `"2.0.0"` (nuevo formato de output)

### `type` (RECOMENDADO)
- `delegate`: el skill toma control y genera un artefacto específico
- `reference`: el skill aporta guías de referencia que el orquestador carga en contexto
- Si se omite, el skill se trata como `delegate` por defecto

---

## Campos adicionales para skills `type: reference`

```yaml
---
name: my-reference-skill
type: reference
references_path: "skills/my-reference-skill/references"
version: "1.0.0"
---
```

| Campo | Descripción |
|-------|-------------|
| `references_path` | Ruta al directorio que contiene los archivos `.md` de referencia |

---

## Campos adicionales para skills `type: delegate`

```yaml
---
name: doc-generator
type: delegate
input: "spec.md"
output: "report.md"
version: "1.0.0"
---
```

| Campo | Descripción |
|-------|-------------|
| `input` | Artefacto de entrada que el skill necesita |
| `output` | Artefacto que el skill produce |

---

## Cuándo usar `alwaysApply: true`

- DEBE usarse solo cuando el skill DEBE ejecutarse en TODA invocación del orquestador, sin excepción
- Ejemplo: un `setup-validator` que siempre verifica el entorno antes de cualquier skill
- NO DEBE usarse en skills opcionales o contextuales (como los declarados en el archivo de configuración del proyecto)

```yaml
alwaysApply: true   # solo para skills de infraestructura obligatoria
```

## Cuándo usar `invocable: true`

- DEBE usarse cuando el skill puede ser invocado directamente por el usuario con `/nombre-skill`
- Si es `false` (por defecto), el skill solo se activa como subagente de otro skill
- Ejemplo: `pdf-summarizer` es invocable por el usuario; un `setup-validator` puede ser no invocable (solo infraestructura)

```yaml
invocable: true   # el usuario puede invocar /pdf-summarizer directamente
```
