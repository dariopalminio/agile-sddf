---
type: expected-output
story: FEAT-000
scenario: missing-artifacts
---

# Output esperado: Artefactos faltantes

Cuando se ejecuta `/story-code-review FEAT-000` con solo `story.md` presente
(faltan `design.md` e `implement-report.md`), el skill debe emitir **exactamente**:

```
❌ Artefactos requeridos no encontrados en: docs/specs/stories/FEAT-000-missing-artifacts/

   Faltantes:
   · design.md
   · implement-report.md

Completa los artefactos faltantes y vuelve a ejecutar /story-code-review FEAT-000.
```

## Condiciones de validación

- El mensaje de error es una **única** salida (no mensajes separados por cada faltante)
- El frontmatter de `story.md` **no se modifica** (permanece `IMPLEMENT/DONE`)
- No se genera ningún archivo de output: ni `code-review-report.md`, ni `fix-directives.md`
- No se crea el directorio `.tmp/story-code-review/`
- No se lanzan agentes revisores
