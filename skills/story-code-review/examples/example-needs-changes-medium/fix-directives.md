---
type: fix-directives
story: FEAT-000
title: "Fix Directives: FEAT-000 (MEDIUM)"
review-status: needs-changes
date: 2026-05-09
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: FEAT-000

## Resumen de bloqueantes

- **Story:** FEAT-000 — Ejemplo de historia con hallazgo de severidad MEDIUM
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | src/users.ts:28 | code-quality | MEDIUM | Función `getUserById` tiene más de 3 responsabilidades | Extraer en funciones separadas: `validateUserId`, `fetchUserFromDb`, `formatUserResponse` |
| 2 | docs/policies/definition-of-done-story.md:42 | DoD-CODE-REVIEW | MEDIUM | No hay código comentado ni `TODO` sin issue asociado — se detectaron TODOs en el código sin referencia a issue | Eliminar los comentarios TODO o asociarlos a un issue en el tracker del proyecto |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:
- `src/users.ts` (hallazgo #1)
- `docs/policies/definition-of-done-story.md` (hallazgo #2 — referencia de trazabilidad; el cambio real es en el código)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-000`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.

---
> Nota: Este ejemplo cubre el Scenario Outline AC-2 de FEAT-065: severidad MEDIUM → needs-changes + fix-directives.md.
