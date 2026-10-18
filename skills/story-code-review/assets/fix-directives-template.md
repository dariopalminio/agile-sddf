---
type: fix-directives
story: {{STORY_ID}}
title: "Fix Directives: {{STORY_ID}}"
date: {{DATE}}
max-severity: {{MAX_SEVERITY}}
round: {{ROUND}}
based-on: code-review-report.md
---

# Fix Directives: {{STORY_ID}}

## Resumen de bloqueantes

- **Story:** {{STORY_ID}} — {{STORY_TITLE}}
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** {{MAX_SEVERITY}}
- **Total de hallazgos bloqueantes:** {{TOTAL_BLOCKING}}
- **Ronda:** {{ROUND}}

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
{{INSTRUCTIONS_TABLE}}

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

{{WHITELIST}}

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement {{STORY_ID}}` (o `/story-implement-tasks {{STORY_ID}}` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review {{STORY_ID}}`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
