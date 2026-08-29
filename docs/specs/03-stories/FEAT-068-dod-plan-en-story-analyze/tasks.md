---
alwaysApply: false
type: tasks
id: FEAT-068
slug: dod-plan-en-story-analyze-tasks
title: "Tasks: DoD PLAN en story-analyze"
story: FEAT-068
design: FEAT-068
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-plan-en-story-analyze
---

<!-- Referencias -->
[[dod-plan-en-story-analyze]]

## 1. Actualizar template de reporte analyze

- [x] 1.1 [P] Añadir fila `| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |` en la tabla Resumen Ejecutivo de `.claude/skills/story-analyze/assets/analyze-report-template.md`
- [x] 1.2 [P] Añadir sección `## Cumplimiento DoD — Fase PLAN` al final de `analyze-report-template.md` con tabla `| Criterio DoD | Estado | Severidad | Evidencia |` y comentario condicional: mostrar `⚠️ DoD PLAN no encontrado — se omitió la validación` si la lista de criterios estaba vacía

## 2. Modificar story-analyze/SKILL.md — sub-paso 1g (carga DoD)

- [x] 2.1 Agregar sub-paso `1g` al Step 1 de `.claude/skills/story-analyze/SKILL.md` con las instrucciones: (a) intentar localizar `$SPECS_BASE/policies/definition-of-done-story.md`; (b) si no existe emitir `⚠️ definition-of-done-story.md no encontrado — se omitirá la validación DoD PLAN` y continuar con lista vacía; (c) si existe, buscar primer encabezado h3 cuyo texto contenga (case-insensitive) `PLAN`, `PLANNING` o `PLANIFICACIÓN`; (d) si no hay coincidencia emitir `⚠️ Sección PLAN no encontrada en DoD — se omitirá la validación DoD PLAN` y continuar con lista vacía; (e) si se encontró la sección, extraer todas las líneas `- [ ]` y `- [x]` como lista de criterios y registrar internamente
- [x] 2.2 Verificar conformidad con `skill-structural-pattern.md` (Req4): confirmar que (a) el sub-paso `1g` sigue la numeración alfabética del Step 1 existente, (b) los mensajes `⚠️` usan el mismo formato que los otros warnings del skill, (c) todas las rutas usan `$SPECS_BASE` sin hardcodear prefijos de cliente

## 3. Modificar story-analyze/SKILL.md — Correlación 5 (evaluación DoD)

- [x] 3.1 Agregar `### Correlación 5 — Cumplimiento DoD PLAN` al Step 6 de `story-analyze/SKILL.md`: si la lista de criterios del sub-paso 1g está vacía, marcar esta correlación como `⚠️ No evaluada — DoD PLAN no disponible`; en caso contrario, para cada criterio DoD evaluar semánticamente contra el contenido de story.md, design.md y tasks.md, produciendo resultado `✓` (evidencia clara de cumplimiento), `❌` (evidencia clara de incumplimiento) o `⚠️` (evidencia insuficiente), clasificar `❌` como ERROR y `⚠️` como WARNING, y construir tabla interna `criterio | resultado | severidad | evidencia`
- [x] 3.2 Actualizar la tabla de clasificación de severidad en Step 6 de `story-analyze/SKILL.md` para incluir el nuevo tipo: `| E | Criterio DoD PLAN no cumplido | ERROR |`

## 4. Modificar story-analyze/SKILL.md — Step 8 (sección DoD en reporte)

- [x] 4.1 Modificar Step 8 de `story-analyze/SKILL.md` para incluir instrucciones de completado de la nueva sección "Cumplimiento DoD — Fase PLAN": si la lista de criterios estaba vacía mostrar mensaje `⚠️ DoD PLAN no encontrado — se omitió la validación`; si hay criterios, completar tabla con resultados de Correlación 5

## 5. Modificar story-analyze/SKILL.md — Step 9 (guardia de transición)

- [x] 5.1 Modificar Step 9a de `story-analyze/SKILL.md` para añadir la condición: si existe al menos un criterio DoD con resultado `❌` (ERROR) en Correlación 5, NO actualizar frontmatter de story.md a `READY-FOR-IMPLEMENT`; incluir en el registro interno: `DoD PLAN: N criterios ❌ — transición bloqueada`

## 6. Modificar story-analyze/SKILL.md — Step 10 (resumen interactivo)

- [x] 6.1 Modificar Step 10 de `story-analyze/SKILL.md` para añadir la línea `DoD PLAN: {N}/{Total} criterios ✓` en el bloque de resumen mostrado al usuario; si el DoD no fue cargado mostrar `DoD PLAN: ⚠️ no evaluado (sección no encontrada)`

## 7. Actualizar ejemplo de output

- [x] 7.1 Actualizar `.claude/skills/story-analyze/examples/output/analyze.md` para incluir la sección "Cumplimiento DoD — Fase PLAN" con al menos dos filas de ejemplo (un criterio ✓ y uno ❌), representando el output esperado tras los cambios

## 8. Setup de verificación — agregar sección PLAN al DoD (resuelve CR-001)

- [x] 8.1 Agregar sección `### Definition of Done para el estado PLAN` a `docs/policies/definition-of-done-story.md` con al menos 3 criterios de calidad para los artefactos de planning: p.ej. `- [ ] story.md tiene criterios de aceptación en formato Gherkin`, `- [ ] design.md existe y cubre todos los ACs de story.md`, `- [ ] tasks.md existe con tareas atómicas ordenadas por dependencia`

## 9. Verificación de criterios de aceptación

- [x] 9.1 [P] Verificar AC-1 y solapamiento: revisar manualmente que, con sección PLAN presente en el DoD, story-analyze genera `analyze.md` con sección "Cumplimiento DoD — Fase PLAN" que contiene tabla con cada criterio y estado ✓/❌/⚠️, y que el Resumen Ejecutivo incluye la fila DoD. **Escenario de solapamiento:** preparar una historia donde el mismo AC falle tanto en Correlación 1 (sin cobertura en design.md) como en Correlación 5 (criterio DoD ❌); confirmar que analyze.md muestra ambas secciones de forma independiente con conteos separados — la fila de Correlación 1 y la fila de Cumplimiento DoD no se fusionan ni deduplication
- [x] 9.2 [P] Verificar AC-2: revisar manualmente que cuando Correlación 5 reporta al menos un criterio `❌`, story.md NO se actualiza a `READY-FOR-IMPLEMENT` y analyze.md documenta los criterios fallidos
- [x] 9.3 Verificar AC-3: revisar manualmente que cuando `definition-of-done-story.md` no existe o no tiene sección PLAN, story-analyze emite `⚠️`, continúa la ejecución, genera `analyze.md` sin error fatal y no bloquea la transición por esta causa

- [x] Implementar fix-directives.md
