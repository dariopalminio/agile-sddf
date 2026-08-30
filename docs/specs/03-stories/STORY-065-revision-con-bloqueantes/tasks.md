---
alwaysApply: false
type: tasks
id: STORY-065
slug: STORY-065-revision-con-bloqueantes-tasks
title: "Tasks: Skill story-code-review — instrucciones de corrección cuando la revisión detecta bloqueantes"
story: STORY-065
design: STORY-065
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - STORY-065-revision-con-bloqueantes
  - STORY-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[STORY-065-revision-con-bloqueantes]]
[[STORY-064-revision-codigo-multi-agente]]

## 1. Asset — Template de fix-directives

- [x] 1.1 Escribir `.claude/skills/story-code-review/assets/fix-directives-template.md` con la estructura definida en design.md D-2: frontmatter (type, story, review-status, date, max-severity, based-on), sección "Resumen de bloqueantes", tabla "Instrucciones de corrección" con columnas #/Archivo:Línea/Dimensión/Severidad/Hallazgo/Acción requerida, sección "Lista blanca de archivos permitidos para modificar" y sección "Ciclo de corrección"

## 2. Core — Extensión del árbitro en SKILL.md

- [x] 2.1 Localizar en `.claude/skills/story-code-review/SKILL.md` el bloque del árbitro (post-consolidación de informes) y agregar la bifurcación explícita: si `review-status = needs-changes` → ejecutar los pasos 2.2–2.4; si `review-status = approved` → ejecutar paso 2.5 y continuar con el flujo de STORY-064
- [x] 2.2 Implementar en el bloque needs-changes el algoritmo de construcción de lista blanca (design.md D-3): iterar los tres informes parciales de `.tmp/story-code-review/`, filtrar filas de la tabla de hallazgos con Severidad ∈ {HIGH, MEDIUM}, extraer la parte de archivo (antes de `:`) de la columna Archivo:Línea, deduplicar las rutas y anotar qué hallazgos (#N) referencian cada archivo
- [x] 2.3 Implementar en el bloque needs-changes la generación de `fix-directives.md` (design.md D-2): leer `assets/fix-directives-template.md` en runtime, completar frontmatter y tabla de instrucciones con los hallazgos HIGH/MEDIUM consolidados y la lista blanca del paso 2.2, guardar sobreescribiendo en `$STORY_DIR/fix-directives.md`
- [x] 2.4 Agregar en el bloque needs-changes la instrucción explícita de NO actualizar `story.md` (design.md D-4) y mostrar el aviso de salida: `⚠️ Review: needs-changes — story.md permanece en IMPLEMENT/IN-PROGRESS → Revisa: docs/specs/stories/STORY-NNN/fix-directives.md`
- [x] 2.5 En el bloque approved del árbitro (flujo STORY-064), agregar: antes de escribir `code-review-report.md`, verificar si existe `$STORY_DIR/fix-directives.md`; si existe, eliminarlo (design.md Risks, D-5)

## 3. Ejemplos

- [x] 3.1 Completar `examples/example-needs-changes/` (fixture creado en STORY-064 T5.2) añadiendo el artefacto de salida esperado: `fix-directives.md` con la instrucción correspondiente al hallazgo HIGH de `tech-lead-report.md`, la lista blanca del archivo afectado y las secciones "Ciclo de corrección" completas
- [x] 3.2 [P] Crear `examples/example-needs-changes-medium/` con: `tech-lead-report.md` (o `product-owner-report.md`) con un hallazgo de severidad MEDIUM, los otros dos informes con `max-severity: ninguna`, y el `fix-directives.md` esperado — cubre el Scenario Outline del AC-2

## 4. Verificación

- [x] 4.1 Usando el fixture `docs/specs/stories/STORY-000-test/` de STORY-064, colocar un `tech-lead-report.md` con hallazgo HIGH en `.tmp/story-code-review/`; ejecutar el árbitro y confirmar que `fix-directives.md` se genera en `$STORY_DIR` (AC-1)
- [x] 4.2 Verificar que `fix-directives.md` contiene en la tabla de instrucciones la referencia exacta al hallazgo: columnas Archivo:Línea y Dimensión completas (NF-1 trazabilidad)
- [x] 4.3 Verificar que la sección "Lista blanca de archivos permitidos" en `fix-directives.md` incluye únicamente el archivo del hallazgo HIGH y anota el número de hallazgo referenciado (design.md D-3)
- [x] 4.4 Verificar que el frontmatter de `story.md` del fixture permanece en `status: CODE-REVIEW / substatus: DONE` después del review con needs-changes (AC-1, design.md D-4)
- [x] 4.5 Ejecutar el árbitro dos veces consecutivas sobre los mismos informes parciales sin cambios → comparar byte a byte ambos `fix-directives.md` generados → confirmar que son idénticos (NF-2 idempotencia)
- [x] 4.6 Repetir 4.1–4.4 con un hallazgo de severidad MEDIUM en lugar de HIGH → confirmar que el comportamiento es idéntico: needs-changes, fix-directives.md generado, story.md sin avanzar (AC-2 Scenario Outline)
- [x] 4.7 Re-ejecutar `/story-code-review` sobre el fixture con los hallazgos corregidos (sin HIGH/MEDIUM) → confirmar que review-status = approved, `fix-directives.md` es eliminado de `$STORY_DIR`, y `code-review-report.md` se escribe correctamente (design.md D-5, Risks)
- [x] 4.8 Simular un informe parcial con un hallazgo HIGH cuya columna `Archivo:Línea` está vacía o ausente → ejecutar el árbitro → verificar que `fix-directives.md` incluye `[archivo no especificado]` en la tabla de instrucciones y que la lista blanca no falla ni lanza error (design.md Risks, D-3)
