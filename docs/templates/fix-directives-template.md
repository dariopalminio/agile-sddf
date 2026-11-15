---
# Escriben este archivo story-code-review, story-verify y story-acceptance cuando su veredicto es NEEDS-CHANGES (ADR-0022).
# Los ejecutores (story-implement, story-implement-tasks) solo lo leen; story-code-review lo elimina al aprobar.
# Las anotaciones `escritor:` van en línea completa (como en adr-template.md) y no se copian a fix-directives.md.
# escritor: story-code-review · story-verify · story-acceptance (valor fijo)
type: fix-directives
# escritor: story-code-review · story-verify · story-acceptance
story: {{STORY_ID}}
# escritor: story-code-review · story-verify · story-acceptance
title: "Fix Directives: {{STORY_ID}}"
# escritor: story-code-review · story-verify · story-acceptance (fecha de la ejecución del gate)
date: {{DATE}}
# escritor: story-code-review · story-verify · story-acceptance (mayor severidad de las filas)
max-severity: {{MAX_SEVERITY}}
# escritor: story-code-review · story-verify · story-acceptance (regla de ronda común de ADR-0022)
round: {{ROUND}}
# escritor: story-code-review · story-verify · story-acceptance (nombre del reporte del propio gate)
based-on: {{BASED_ON}}
---

# Fix Directives: {{STORY_ID}}

## Resumen de bloqueantes

<!-- escritor: story-code-review · story-verify · story-acceptance -->

- **Story:** {{STORY_ID}} — {{STORY_TITLE}}
- **Veredicto de origen:** `NEEDS-CHANGES` (`{{BASED_ON}}`)
- **Severidad máxima:** {{MAX_SEVERITY}}
- **Total de hallazgos bloqueantes:** {{TOTAL_BLOCKING}}
- **Ronda:** {{ROUND}}

## Instrucciones de corrección

<!-- escritor: story-code-review (4f.2) · story-verify (6h.2) · story-acceptance (7f.2) -->

Una fila por bloqueante que cuenta para el veredicto del gate de origen; un mismo defecto aparece una sola vez.

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
{{INSTRUCTIONS_TABLE}}

## Lista blanca de archivos permitidos para modificar

<!-- escritor: story-code-review (4e) · story-verify (6h.2) · story-acceptance (7f.2) -->

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

{{WHITELIST}}

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

<!-- escritor: story-code-review · story-verify · story-acceptance (texto fijo de la plantilla) -->

1. Ejecuta `/story-implement {{STORY_ID}}` (o `/story-implement-tasks {{STORY_ID}}` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review {{STORY_ID}}`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
5. Continúa el pipeline (`/story-verify`, `/story-acceptance`) hasta volver a pasar el gate que generó `{{BASED_ON}}`.
