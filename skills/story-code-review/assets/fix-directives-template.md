---
type: fix-directives
story: {{STORY_ID}}
title: "Fix Directives: {{STORY_ID}}"
review-status: needs-changes
date: {{DATE}}
max-severity: {{MAX_SEVERITY}}
based-on: code-review-report.md
---

# Fix Directives: {{STORY_ID}}

## Resumen de bloqueantes

- **Story:** {{STORY_ID}} — {{STORY_TITLE}}
- **Review status:** needs-changes
- **Severidad máxima:** {{MAX_SEVERITY}}
- **Total de hallazgos bloqueantes:** {{TOTAL_BLOCKING}}

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
{{INSTRUCTIONS_TABLE}}

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

{{WHITELIST}}

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review {{STORY_ID}}`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
