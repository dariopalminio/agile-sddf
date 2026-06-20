---
type: fix-directives
story: FEAT-000
title: "Fix Directives: FEAT-000"
review-status: needs-changes
date: 2026-05-09
max-severity: HIGH
based-on: code-review-report.md
---

# Fix Directives: FEAT-000

## Resumen de bloqueantes

- **Story:** FEAT-000 — Ejemplo de historia con hallazgos bloqueantes
- **Review status:** needs-changes
- **Severidad máxima:** HIGH
- **Total de hallazgos bloqueantes:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | src/users.ts:15 | code-quality | HIGH | API key hardcodeada: `const API_KEY = "sk-prod-abc123"` | Mover a variable de entorno (`process.env.API_KEY`); eliminar el valor hardcodeado del código fuente |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:
- `src/users.ts` (hallazgo #1)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-000`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
