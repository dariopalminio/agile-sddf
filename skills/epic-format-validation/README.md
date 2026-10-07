# epic-format-validation

> **Type:** skill · **Category:** utility  
> **Location:** `skills/epic-format-validation/SKILL.md`  
> **Status:** stable

---

## What it does

Valida que una especificación de épica cumple el contrato estructural del template `epic-template.md`, incluidos el frontmatter, las secciones obligatorias y la forma de las dos secciones que leen otros skills: las historias (formatos F1/F2/F3) y los smoke tests (`### SMOKE-N — nombre` + bloque `gherkin`). Las secciones se localizan por su `clave:` en el template, así que renombrar o reordenar secciones no exige tocar el skill. Informa una decisión `APROBADO`, `REFINAR` o `RECHAZADO`.

**Produces:**

- Un diagnóstico de validez de la épica solicitada.
- Cuando la decisión es `REFINAR`: la lista de campos o secciones faltantes, el bloque `Formato inválido:` (línea, texto y forma esperada) y, si faltan secciones, el comando de migración `/memory-system migrate --from=epic-template-v1`.

**Does not do:**

- No crea ni modifica el archivo `epic.md` validado.

---

## When to use

**Use it when:**

- Necesites comprobar una épica antes de seguir con la generación de historias.
- Quieras conocer exactamente qué parte del template falta en una épica.
- El usuario mencione: `"epic-format-validation"`, `"validar épica"`, `"estructura de épica"`.

**Do NOT use it when:**

- Debas redactar una épica nueva → usa `[[epic-creation]]`.
- Debas generar las épicas a partir de un plan → usa `[[epic-from-project-plan]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-format-validation <ruta-o-nombre-de-épica>`.
