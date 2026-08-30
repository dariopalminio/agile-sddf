---
alwaysApply: false
type: tasks
id: STORY-069
slug: dod-IMPLEMENT-en-story-implement-tasks
title: "Tasks: DoD IMPLEMENT en story-implement"
story: STORY-069
design: STORY-069
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-IMPLEMENT-en-story-implement
---

<!-- Referencias -->
[[dod-IMPLEMENT-en-story-implement]]

## 1. Modificar story-implement/SKILL.md — sub-paso 2f (carga DoD)

- [x] T001 Agregar sub-paso `2f` al Step 2 de `.claude/skills/story-implement/SKILL.md` con instrucciones: (a) intentar localizar `$SPECS_BASE/policies/definition-of-done-story.md`; (b) si no existe emitir `⚠️ definition-of-done-story.md no encontrado — se omitirá la validación DoD IMPLEMENT` y registrar `$DOD_IMPLEMENT_CRITERIA = []`; (c) si existe, buscar primer encabezado h3 cuyo texto contenga (case-insensitive) `IMPLEMENT`, `IMPLEMENTANDO` o `IMPLEMENTACIÓN`; (d) si no hay coincidencia emitir `⚠️ Sección IMPLEMENT no encontrada en DoD — se omitirá la validación DoD IMPLEMENT` y registrar `$DOD_IMPLEMENT_CRITERIA = []`; (e) si se encontró la sección, extraer todas las líneas `- [ ]` y `- [x]` como lista de criterios planos y registrar internamente como `$DOD_IMPLEMENT_CRITERIA`
- [x] T002 Verificar que el sub-paso `2f` sigue la numeración alfabética del Step 2 existente (2a–2e) y que los mensajes `⚠️` usan el mismo formato que los otros warnings del skill; confirmar que todas las rutas usan `$SPECS_BASE` sin hardcodear prefijos de cliente

## 2. Modificar story-implement/SKILL.md — sub-paso 4g (evaluación DoD)

- [x] T003 Agregar sub-paso `4g` en el Paso 4 de `.claude/skills/story-implement/SKILL.md`, posicionado entre `4a` (generar reporte) y `4b` (transición de estado), con instrucciones: si `$DOD_IMPLEMENT_CRITERIA` está vacío, marcar la evaluación DoD como `⚠️ No evaluada — DoD IMPLEMENT no disponible` y registrar `$DOD_RESULT = []`; en caso contrario, para cada criterio evaluar semánticamente contra el contenido de `tasks.md` (tareas completadas), tabla de estado en `implement-report.md` y código generado, produciendo resultado `✓` (evidencia clara de cumplimiento), `❌` (evidencia clara de incumplimiento) o `⚠️` (evidencia insuficiente o requiere ejecución externa); aplicar regla de duda obligatoria: ante incertidumbre usar `⚠️` en lugar de `❌`; criterios de ejecución de tests o CI siempre clasificar como `⚠️ Requiere ejecución de tests — no evaluable por story-implement`; construir tabla interna `criterio | resultado | severidad | evidencia` y registrar como `$DOD_RESULT`
- [x] T004 Verificar que sub-paso `4g` se ubica claramente entre `4a` y `4b` en el SKILL.md, con encabezado `### 4g. Evaluar criterios DoD IMPLEMENT` o equivalente que siga la convención de encabezados del Step 4 existente

## 3. Modificar story-implement/SKILL.md — Paso 4a (sección DoD en implement-report.md)

- [x] T005 Modificar el bloque de estructura del reporte en el Paso 4a de `.claude/skills/story-implement/SKILL.md` para incluir la sección `## Cumplimiento DoD — Fase IMPLEMENT` con tabla `| # | Criterio | Estado | Evidencia / Justificación |` y fila de resumen `**Resumen: N/Total criterios ✓**`
- [x] T006 Agregar instrucción condicional en Paso 4a: si `$DOD_IMPLEMENT_CRITERIA` estaba vacío, mostrar en la sección `⚠️ DoD IMPLEMENT no encontrado — se omitió la validación. Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene la sección "IMPLEMENT".`; si hay criterios, completar tabla con resultados del sub-paso `4g`

## 4. Modificar story-implement/SKILL.md — Paso 4b (transición condicional)

- [x] T007 Modificar el Paso 4b de `.claude/skills/story-implement/SKILL.md` para condicionar la transición a `READY-FOR-CODE-REVIEW/DONE`: si `$DOD_RESULT` contiene al menos un criterio con resultado `❌`, NO actualizar frontmatter de `story.md` a `READY-FOR-CODE-REVIEW/DONE`; mantener en `IMPLEMENT/IN-PROGRESS`; incluir en el resumen final `DoD IMPLEMENT: N criterios ❌ — transición bloqueada`
- [x] T008 Agregar instrucción en Paso 4b para el caso bloqueado: mostrar al usuario los criterios DoD fallidos con la evidencia registrada en `$DOD_RESULT` e indicar que debe resolverlos antes de avanzar a code review

## 5. Modificar story-implement/SKILL.md — Resumen Final (línea DoD)

- [x] T009 Modificar el bloque "Resumen Final" de `.claude/skills/story-implement/SKILL.md` para añadir la línea `DoD IMPLEMENT: {N}/{Total} criterios ✓` en la sección de estado mostrada al usuario; si el DoD no fue cargado mostrar `DoD IMPLEMENT: ⚠️ no evaluado (sección no encontrada)`; si hay DoD-ERRORs, el estado final del resumen cambia a `⚠️ Implementación completada con DoD-ERRORs pendientes` en lugar de `✅ Implementación completa`

## 6. Actualizar ejemplo de output

- [x] T010 Actualizar `.claude/skills/story-implement/examples/output/implement-report.md` para incluir la sección "Cumplimiento DoD — Fase IMPLEMENT" con al menos dos filas de ejemplo: un criterio `✓`, un criterio `⚠️` (requiere ejecución), representando el output esperado tras los cambios

## 7. Verificación de criterios de aceptación

- [x] T011 [P] Verificar AC-1: revisar manualmente que, con sección IMPLEMENT presente en el DoD, story-implement genera `implement-report.md` con sección "Cumplimiento DoD — Fase IMPLEMENT" que contiene tabla con cada criterio y estado ✓/❌/⚠️, que el Resumen Final incluye la línea DoD, y que cuando no hay DoD-ERRORs story.md avanza a READY-FOR-CODE-REVIEW/DONE
- [x] T012 [P] Verificar AC-2: revisar manualmente que cuando el sub-paso 4g reporta al menos un criterio `❌`, story.md NO se actualiza a READY-FOR-CODE-REVIEW/DONE, permanece en IMPLEMENT/IN-PROGRESS, y implement-report.md documenta los criterios fallidos con evidencia esperada
- [x] T013 Verificar AC-3: revisar manualmente que cuando `definition-of-done-story.md` no existe o no contiene la sección IMPLEMENT, story-implement emite `⚠️`, continúa la ejecución, genera `implement-report.md` con sección DoD de aviso sin error fatal, y no bloquea la transición por esta causa
