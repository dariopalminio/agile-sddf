---
alwaysApply: false
type: tasks
id: FEAT-070
slug: dod-code-review-en-story-code-review-tasks
title: "Tasks: DoD CODE-REVIEW en story-code-review"
story: FEAT-070
design: FEAT-070
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-code-review-en-story-code-review
---

<!-- Referencias -->
[[dod-code-review-en-story-code-review]]

## 1. Modificar story-code-review/SKILL.md — Paso 2d (extracción sección DoD)

- [x] T001 Ampliar el Paso 2d de `.claude/skills/story-code-review/SKILL.md` para, tras localizar `$DOD_PATH`, extraer la sección CODE-REVIEW: (a) si `$DOD_PATH` está vacío o el archivo no existe, registrar `$DOD_CODE_REVIEW_CRITERIA = []` y emitir `⚠️ definition-of-done-story.md no encontrado — se omitirá la validación DoD CODE-REVIEW`; (b) si existe, buscar primer encabezado h3 cuyo texto contenga (case-insensitive) `CODE-REVIEW`, `CODE REVIEW`, `REVISIÓN DE CÓDIGO` o `REVISION DE CODIGO`; (c) si no hay coincidencia, registrar `$DOD_CODE_REVIEW_CRITERIA = []` y emitir `⚠️ Sección CODE-REVIEW no encontrada en DoD — se omitirá la validación`; (d) si se encontró, extraer todas las líneas `- [ ]` y `- [x]` con su número de línea como lista de criterios y registrar como `$DOD_CODE_REVIEW_CRITERIA`
- [x] T002 Ampliar el bloque de resumen de carga del Paso 2d para incluir la línea: `DoD CODE-REVIEW: <N criterios cargados | ⚠️ no encontrado>`

## 2. Modificar story-code-review/SKILL.md — sub-paso 4c.1 (evaluación DoD)

- [x] T003 Agregar sub-paso `4c.1` en el Paso 4 de `.claude/skills/story-code-review/SKILL.md`, posicionado entre el actual `4c` (derivar review-status de agentes) y `4d` (bifurcación post-árbitro), con instrucciones: (a) si `$DOD_CODE_REVIEW_CRITERIA` está vacío, registrar evaluación DoD como `⚠️ No evaluada — DoD CODE-REVIEW no disponible` y continuar sin modificar `$MAX_SEVERITY` ni `$REVIEW_STATUS`; (b) en caso contrario, para cada criterio evaluar semánticamente contra el código revisado (inferido del implement-report) e informes de agentes, asignando severidad HIGH (criterios funcionales y de regresión), MEDIUM (calidad de código) o LOW (documentación/depliegue), con `⚠️` ante evidencia insuficiente o criterio dependiente de CI/CD externo; (c) añadir hallazgos ❌ a la tabla consolidada interna con `Dimensión: DoD-CODE-REVIEW`, `Archivo:Línea: docs/policies/definition-of-done-story.md:<línea>`, `Severidad` y `Acción requerida` derivada del criterio; (d) recalcular `$MAX_SEVERITY` considerando todos los hallazgos (agentes + DoD) y actualizar `$REVIEW_STATUS` si corresponde
- [x] T004 Verificar que sub-paso `4c.1` se ubica claramente entre `4c` y `4d` en el SKILL.md, con encabezado `### 4c.1. Evaluar criterios DoD CODE-REVIEW` siguiendo la convención de numeración del Paso 4 existente

## 3. Modificar story-code-review/SKILL.md — Paso 4f (hallazgos DoD en fix-directives)

- [x] T005 Ampliar el Paso 4f de `.claude/skills/story-code-review/SKILL.md` para incluir en `fix-directives.md` las filas de hallazgos DoD que tienen severidad HIGH o MEDIUM, usando el mismo formato de tabla que los hallazgos de agentes: `| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |` con `Dimensión: DoD-CODE-REVIEW`
- [x] T006 Verificar que los hallazgos DoD en fix-directives.md se numeran correlativamente con los hallazgos de agentes (sin colisión de IDs) y se colocan en la tabla "Instrucciones de corrección" existente, no en una tabla nueva

## 4. Modificar story-code-review/SKILL.md — Paso 5b (sección DoD en code-review-report)

- [x] T007 Ampliar el Paso 5b de `.claude/skills/story-code-review/SKILL.md` para incluir instrucciones de completado de la nueva sección "Cumplimiento DoD — Fase CODE-REVIEW" del template: si `$DOD_CODE_REVIEW_CRITERIA` estaba vacío, mostrar `⚠️ DoD CODE-REVIEW no encontrado — se omitió la validación`; si hay criterios, completar tabla `| # | Criterio | Estado | Severidad | Evidencia |` con resultados del sub-paso `4c.1`

## 5. Actualizar code-review-report-template.md (nueva sección DoD)

- [x] T008 Añadir sección `## Cumplimiento DoD — Fase CODE-REVIEW` al final de `.claude/skills/story-code-review/assets/code-review-report-template.md` con tabla `| # | Criterio | Estado | Severidad | Evidencia |` y comentario condicional: mostrar `⚠️ DoD CODE-REVIEW no encontrado — se omitió la validación` si `$DOD_CODE_REVIEW_CRITERIA` estaba vacío

## 6. Modificar story-code-review/SKILL.md — Paso 7 (línea DoD en resumen)

- [x] T009 Ampliar el Paso 7 de `.claude/skills/story-code-review/SKILL.md` para añadir la línea `DoD CODE-REVIEW: {N}/{Total} criterios ✓` en el bloque de resumen mostrado al usuario; si el DoD no fue cargado mostrar `DoD CODE-REVIEW: ⚠️ no evaluado (sección no encontrada)`

## 7. Actualizar ejemplo de output

- [x] T010 [P] Actualizar `.claude/skills/story-code-review/examples/example-approved/code-review-report.md` para incluir la sección "Cumplimiento DoD — Fase CODE-REVIEW" con criterios ✓, representando el output esperado cuando la revisión es aprobada y el DoD está cumplido
- [x] T011 [P] Actualizar o crear `.claude/skills/story-code-review/examples/example-needs-changes-medium/fix-directives.md` para incluir al menos una fila con `Dimensión: DoD-CODE-REVIEW`, representando el output cuando el DoD genera hallazgos bloqueantes

## 8. Verificación de criterios de aceptación

- [x] T012 [P] Verificar AC-1: revisar manualmente que cuando agentes retornan max-severity LOW/ninguna pero hay criterios DoD CODE-REVIEW no cumplidos con severidad HIGH o MEDIUM, `review-status` cambia a `needs-changes`; `code-review-report.md` incluye sección "Cumplimiento DoD — Fase CODE-REVIEW"; y `fix-directives.md` contiene los criterios DoD con `Dimensión: DoD-CODE-REVIEW`
- [x] T013 [P] Verificar AC-2: revisar manualmente que cuando agentes retornan approved y todos los criterios DoD CODE-REVIEW están ✓, `review-status` permanece `approved`, `code-review-report.md` muestra todos los criterios DoD en ✓ y `story.md` avanza a READY-FOR-VERIFY/DONE
- [x] T014 Verificar AC-3: revisar manualmente que cuando `definition-of-done-story.md` no existe o no contiene la sección CODE-REVIEW, el skill registra `$DOD_CODE_REVIEW_CRITERIA = []`, emite ⚠️ en el resumen de carga, continúa sin validar DoD y no bloquea el review por esta causa
