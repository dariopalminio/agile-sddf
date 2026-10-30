# epic-improve

> **Type:** skill · **Category:** worker  
> **Location:** `skills/epic-improve/SKILL.md`  
> **Status:** beta

---

## What it does

Corrige un `epic.md` que `/epic-format-validation` dejó en `NEEDS-REFINEMENT`. Lee la tabla `## Defectos` de `epic-format-validation-report.md`, propone en un único plan las correcciones de frontmatter, secciones obligatorias, líneas de historias (F1/F2/F3) y smoke tests (`SMOKE-N` + `gherkin`), y completa un objetivo vacío o unos criterios de salida ausentes solo cuando el propio `epic.md` da la evidencia. Aplica el plan tras la confirmación del usuario y cierra el bucle `epic-format-validation ⇄ epic-improve` de `DEFINE`.

**Produces:**

- `epic.md` corregido: solo cambian las líneas del plan y `updated:`; `status` y `substatus` quedan intactos.
- `epic.md.bak` con el contenido previo, creado antes de escribir.
- En consola: el plan (`C-NN` con la fuente de cada contenido nuevo), la lista de lo que «requiere decisión del PO» y el siguiente paso `/epic-format-validation <EPIC-NN>`.

**Does not do:**

- No diagnostica la épica ni vuelve a validarla: el diagnóstico es de `/epic-format-validation`.
- No inventa contenido: lo que no puede citar del `epic.md` queda como decisión del PO, sin escribirse.
- No cambia el estado de la épica ni crea o modifica historias.
- No escribe nada si el plan se rechaza o si la épica ya está `APPROVED`.

---

## When to use

**Use it when:**

- `/epic-format-validation` declaró `NEEDS-REFINEMENT` y quieres corregir la épica sin editarla a mano.
- The user mentions: `"epic-improve"`, `"corregir épica"`, `"mejorar épica"`.

**Do NOT use it when:**

- Debas corregir la consistencia entre la épica y sus historias en `PLAN` → corresponde a `epic-refine` (STORY-165).
- La épica se creó con una versión anterior del template → usa `[[memory-system]]` (`migrate --from=epic-template-v1`).
- Todavía no existe el reporte de formato → ejecuta antes `[[epic-format-validation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-improve <EPIC-NN | ruta-a-epic.md>`.
