---
type: fix-directives
story: STORY-096
title: "Fix Directives: STORY-096"
review-status: needs-changes
date: 2026-09-22
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: STORY-096

## Resumen de bloqueantes

- **Story:** STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 5 (1 de agentes + 4 de DoD CODE-REVIEW, de los cuales 2 se cierran por derivación)

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/memory-system/assets/scaffold/templates/adr-template.md:1 | integration-architecture | MEDIUM | La semilla `adr-template.md` se distribuye a `$SPECS_BASE/templates/` sin una sola anotación `escritor:` (0 ocurrencias), contra el principio 13 de `constitution.md` ("todo campo declarado nombra a su escritor"). Las otras cinco plantillas distribuidas sí las llevan (`story-template.md` 16, `epic-template.md` 12). El propio `design.md` invocó ese principio para excluir `requirement-template.md`, y D-1 generalizó la exención a un archivo que sí es plantilla de generación. La semilla se replica en todos los proyectos scaffoldeados. | Anotar `escritor:` en los campos y secciones de la semilla con el skill que los escribirá (o el previsto), **o** registrar la exención explícita de `adr-template.md` en un ADR bajo `docs/adr/` y en `skills/memory-system/references/memory-rules.md` §5 antes de distribuirla. |
| 2 | docs/guardrails/dod-story-checklist.md:135 | DoD-CODE-REVIEW | MEDIUM | Criterio "Se cumplen los estándares del proyecto (`constitution.md`)" no cumplido: el principio 13 se incumple en la semilla `adr-template.md` (mismo origen que el hallazgo #1). | Resolver el hallazgo #1. Este criterio se cierra automáticamente al hacerlo. |
| 3 | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/tasks.md:33 | DoD-CODE-REVIEW | MEDIUM | Criterio "Sin tareas pendientes en `tasks.md`" no cumplido: las 20 tareas T001…T020 siguen marcadas `- [ ]` pese a que `implement-report.md` declara la implementación completa (evals 10/10, `npm test` 106/106). La trazabilidad tarea → evidencia queda rota. | Marcar `- [x]` cada tarea efectivamente completada en `tasks.md`, dejando `- [ ]` únicamente las que sigan pendientes de VERIFY (p. ej. T019 verificación manual en directorio temporal) y anotando en ellas el motivo. |
| 4 | docs/guardrails/dod-story-checklist.md:138 | DoD-CODE-REVIEW | MEDIUM | Criterio "Sin hallazgo bloqueante de severidad HIGH o MEDIUM" no cumplido: esta revisión registra 1 hallazgo MEDIUM de agente (#1). | Derivado. Resolver los hallazgos #1 y #3; se cierra automáticamente en la siguiente ejecución de `/story-code-review`. |
| 5 | docs/guardrails/dod-story-checklist.md:142 | DoD-CODE-REVIEW | MEDIUM | Criterio "Revisión de código aprobada (Review status approved)" no cumplido: `code-review-report.md` de esta ejecución cierra con `review-status: needs-changes`. | Derivado. Resolver los hallazgos #1 y #3 y re-ejecutar `/story-code-review STORY-096`; se cierra automáticamente. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/memory-system/assets/scaffold/templates/adr-template.md` — hallazgo #1, #2
- `skills/memory-system/references/memory-rules.md` — hallazgo #1 (solo si se opta por la vía de la exención documentada)
- `docs/adr/` — hallazgo #1 (solo si se opta por registrar la exención como ADR nuevo)
- `docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/tasks.md` — hallazgo #3

> Los hallazgos #4 y #5 son derivados del estado de esta revisión y apuntan a `docs/guardrails/dod-story-checklist.md`, que es la **fuente** de los criterios y **no debe editarse** para satisfacerlos. Por eso ese archivo queda fuera de la lista blanca.

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-096`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.

## Anexo — hallazgos LOW (no bloqueantes, informativos)

No requieren acción para superar este gate; se listan para que el autor decida. Detalle completo en `code-review-report.md`.

| Dimensión | Nº de hallazgos LOW | Temas |
|---|---|---|
| Calidad de código | 8 | Exports sin consumidor; frontmatter semilla fuera del esquema canónico de `header-aggregation`; CRLF en las plantillas compartidas en Windows; mensaje de error de `--root` no-directorio; deriva entre `adr-template.md` semilla y `docs/adr/adr-template.md`; entrada de CHANGELOG bajo `[3.2.1]` frente a "desde 3.3.0"; rama muerta del modo `index` en `SKILL.md:199`; `rebuild --force` sin `--backup`. |
| Cobertura de requisitos | 8 | Aserciones débiles en TC-005/TC-008/TC-009 y mitad negativa de AC-8 sin asertar; 8 entradas `[ ]` en "Test Cases Progress"; literales desfasados de E2E-001 (`creados 5 · preservados 14`) y UT-006 (`sobrescritos: 3`). |
| Integración y arquitectura | 6 | `assets/index-template.md` fuera de "Componentes afectados"; bootstrap de la raíz no declarado como desviación; CHANGELOG bajo `[3.2.1]`; commit `f9ed79c` mezcla mantenimiento de CI; fixture `examples/no-frontmatter/` sin documentar; literales de E2E-001 y UT-006. |
| Seguridad | 3 | Confinamiento explícito de `--root` en `REPO_ROOT`; escritura que no siga symlinks en `placeFile`; filtrado de Unicode invisible en los títulos interpolados en `index.md`. |
