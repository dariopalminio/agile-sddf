---
type: fix-directives
story: STORY-000
title: "Fix Directives: STORY-000 (MEDIUM)"
review-status: needs-changes
date: 2026-05-09
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-000

## Resumen de bloqueantes

- **Story:** STORY-000 — Ejemplo de historia con hallazgo de severidad MEDIUM
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 2
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | src/users.ts:28 | code-quality | MEDIUM | Función `getUserById` tiene más de 3 responsabilidades | Extraer en funciones separadas: `validateUserId`, `fetchUserFromDb`, `formatUserResponse` |
| 2 | docs/guardrails/dod-story-checklist.md:42 | DoD-CODE-REVIEW | MEDIUM | No hay código comentado ni `TODO` sin issue asociado — se detectaron TODOs en el código sin referencia a issue | Eliminar los comentarios TODO o asociarlos a un issue en el tracker del proyecto |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:
- `src/users.ts` (hallazgo #1)
- `docs/guardrails/dod-story-checklist.md` (hallazgo #2 — referencia de trazabilidad; el cambio real es en el código)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-000` (o `/story-implement-tasks STORY-000` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-000`.
4. Si el resultado es `approved`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.

---
> Nota: Este ejemplo cubre el Scenario Outline AC-2 de STORY-065: severidad MEDIUM → needs-changes + fix-directives.md.
