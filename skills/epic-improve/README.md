# epic-improve

> **Type:** skill · **Category:** utility  
> **Location:** `skills/epic-improve/SKILL.md`  
> **Status:** stable

---

## What it does

Corrige un `epic.md` que `/epic-format-validation` dejó en `NEEDS-REFINEMENT` aplicando la tabla `## Defectos` de su `epic-format-validation-report.md`, sin reanalizar: conversiones de historias a F1/F2/F3, secciones faltantes con contenido citado a `Objetivo`, `Alcance` o `Historias` del propio `epic.md`, y las mejoras `M-objetivo` / `M-criterios` (§6 del catálogo). Lo que no puede citarse a una frase concreta no se escribe: queda como **requiere decisión del PO** con su pregunta. Decide por el `verdict` del frontmatter del reporte; si es `APPROVED`, no modifica ni crea nada.

**Produces:**

- `epic.md.bak` con el contenido previo y `epic.md` corregido, solo cuando hay correcciones aplicables (un único write, con relectura y restauración ante fallo).
- Un resumen en consola: el plan (`C-NN` por defecto, con `fuente:` cuando aplica), las decisiones del PO, `✓ Backup creado: …` y `Siguiente paso: /epic-format-validation <EPIC-NN>`.
- Con `APPROVED`, sin reporte o con épica inexistente: un mensaje de fin cerrado, sin escribir ni crear archivos.

**Does not do:**

- No escribe `status` ni `substatus`, ni inventa contenido sin fuente (lo deja como decisión del PO).
- No consulta `specs/flow/archive/` ni directorios `STORY-*`.
- No modifica el `epic.md` validado cuando el veredicto es `APPROVED`.

---

## When to use

**Use it when:**

- `/epic-format-validation` deja una épica en `NEEDS-REFINEMENT` y quieres aplicarle las correcciones sin reanalizar.
- Quieres que las historias queden en F1/F2/F3 y aparezcan los criterios de salida citados, o saber qué requiere decisión del PO.
- El usuario mencione: `"epic-improve"`, `"corregir épica"`, `"mejorar épica"`.

**Do NOT use it when:**

- Debas redactar una épica nueva → usa `[[epic-creation]]`.
- Debas validar la estructura → usa `[[epic-format-validation]]`.
- Debas corregir la consistencia épica ↔ historias → usa `[[epic-refine]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-improve <EPIC-NN | ruta>`. El flujo se ejecuta con el motor determinista `scripts/epic-improve.js` (subcomandos `plan` solo-lectura y `apply`), verificado por `test/epic-improve.test.js`.
