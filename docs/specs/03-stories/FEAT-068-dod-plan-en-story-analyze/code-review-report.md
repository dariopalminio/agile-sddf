---
type: code-review-report
story: FEAT-068
title: "Code Review Report: DoD PLAN en story-analyze"
review-status: needs-changes
date: 2026-05-14
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
---

# Code Review Report: FEAT-068

## Resumen

| Campo | Valor |
|---|---|
| Historia | FEAT-068 — DoD PLAN en story-analyze |
| Review status | needs-changes |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer |
| Fecha | 2026-05-14 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**max-severity: MEDIUM — 7 hallazgos (2 MEDIUM, 5 LOW)**

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| 1 | `SKILL.md:39` | Calidad estructural | LOW | Typo en tabla de estados: `PLANN` en lugar de `PLANNING` | Corregir `PLANN` → `PLANNING` |
| 2 | `SKILL.md:146` | Path conventions | MEDIUM | `$SPECS_BASE/policies/` no está documentado como subdirectorio verificado por preflight. Mitiga la degradación elegante pero la convención de ruta canónica no está formalmente documentada | Documentar `$SPECS_BASE/policies/` como ruta canónica en la constitución o en skill-preflight Verificación 2 |
| 3 | `SKILL.md:155` | Redundancia/claridad | LOW | El log de progreso del paso 1g usa `⚠️` (símbolo de advertencia) para una operación informativa | Cambiar símbolo del log informativo de `⚠️` a `🔍` o `ℹ️` |
| 4 | `SKILL.md:395` | Consistencia interna | MEDIUM | El bloque `⛔` de Paso 10 (modo interactivo) no incluye línea específica para DoD-ERRORs. El Paso 9a registra internamente `DoD PLAN: N criterios ❌` pero el usuario no lo ve en el resumen interactivo | Añadir en el bloque `⛔` de Paso 10: `DoD PLAN: <$DOD_ERROR_COUNT> criterios ❌ — revisar artefactos` (solo cuando `$DOD_ERROR_COUNT > 0`) |
| 5 | `SKILL.md:467-530` | Alineación con template | MEDIUM | Template de Fallback interno no incluye fila DoD en Resumen Ejecutivo ni sección `## Cumplimiento DoD — Fase PLAN`. Si se usa el fallback, los resultados de Correlación 5 no aparecen en el output — regresión silenciosa | Actualizar el Template de Fallback para incluir fila DoD y sección DoD idénticas al template externo |
| 6 | `assets/analyze-report-template.md:81` | Alineación con template | LOW | Sección `## Inconsistencias Detectadas` del template no lista el tipo E en la enumeración de tipos (sí lo usa el ejemplo correctamente) | Agregar `/ E: criterio DoD PLAN no cumplido` a la lista de tipos del campo `Tipo` |
| 7 | `examples/output/analyze.md:27` | Calidad del ejemplo | LOW | Ejemplo muestra evaluación de 3 criterios DoD; el DoD real del proyecto tiene 5 criterios. Sin comentario aclaratorio sobre el DoD ficticio | Añadir comentario que el DoD ficticio de FEAT-099 tiene 3 criterios (representativo), o ampliar a 5 |

**Hallazgo crítico (H5):** El Template de Fallback no actualizado es el riesgo funcional más relevante: la Correlación 5 calcula resultados DoD correctamente, pero si el fallback se activa, el output silenciosamente no los incluye — no hay aviso al usuario.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**max-severity: MEDIUM — 1 hallazgo MEDIUM, ACs AC-1 y AC-2 cubiertos completamente**

| AC | Escenario | Estado | Evidencia en implementación |
|---|---|---|---|
| AC-1 | Escenario principal | ✓ | Paso 1g carga criterios DoD en `$DOD_PLAN_CRITERIA`; Correlación 5 evalúa y construye tabla interna; Paso 8 completa sección en reporte; template y ejemplo demuestran el output esperado |
| AC-2 | Bloqueo DoD | ✓ | Correlación 5 clasifica ❌ como TIPO E; Paso 9a incluye rama explícita de bloqueo por TIPO A, B o E; `$DOD_ERROR_COUNT` registrado; ejemplo FEAT-099 ilustra el caso |
| AC-3 | Degradación elegante | ⚠️ | Paso 1g cubre ambos sub-casos correctamente; sin embargo el Template de Fallback interno no incluye sección DoD (ver H-001) |

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| H-001 | `SKILL.md:444-530` | Completitud del output | MEDIUM | Template de Fallback carece de fila y sección DoD. Si el template externo no está disponible, el report omite validación DoD por completo, incluso cuando `$DOD_PLAN_CRITERIA` tiene criterios cargados | Agregar al Template de Fallback: (a) fila DoD en Resumen Ejecutivo, (b) sección `## Cumplimiento DoD — Fase PLAN` con tabla y mensaje de aviso |

**NFR verificados:** Lectura en runtime ✓ | Degradación elegante ✓ (modulo fallback template)

---

### Integración y Arquitectura (Integration-Reviewer)

**max-severity: LOW — todos los puntos de integración del diseño correctamente implementados**

| Componente | Diseño (design.md) | Estado |
|---|---|---|
| Sub-paso 1g — Extracción flexible PLAN section | D1: primer h3 con PLAN/PLANNING/PLANIFICACIÓN case-insensitive | ✓ |
| Correlación 5 — Evaluación semántica ✓/❌/⚠️ | D2+D3: semántica LLM, regla de duda → ⚠️, ❌→ERROR | ✓ |
| Template fila DoD en Resumen Ejecutivo | D5: nueva fila `{dod_status}` y `{dod_n}/{dod_total}` | ✓ |
| Template sección "Cumplimiento DoD — Fase PLAN" | D5: tabla criterio/estado/severidad/evidencia + aviso degradación | ✓ |
| Paso 8 — Completar template con Correlación 5 | D4: instrucciones condicionales según `$DOD_PLAN_CRITERIA` | ✓ |
| Paso 9 — Guardia de transición TIPO E | D3: TIPO E añadido a condición de bloqueo | ✓ |
| Paso 10 — Línea resumen DoD | D4: `DoD PLAN: N/Total criterios ✓` con variante degradada | ✓ |
| definition-of-done-story.md (CR-001) | CR-001 resuelto: sección PLAN presente en línea 31 | ⚠️ (LOW) |
| Fallback template interno | D5: template como fuente de verdad | ⚠️ (LOW) |

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| INT-001 | `docs/policies/definition-of-done-story.md:31` | Consistencia documental | LOW | CR-001 en design.md documenta que la sección PLAN no existe, pero ya existe (línea 31, 5 criterios). Inconsistencia documental únicamente | Actualizar texto de CR-001 en design.md para reflejar que fue cerrado |
| INT-002 | `SKILL.md:444-530` | Coherencia template fallback | LOW | Fallback interno no incluye fila ni sección DoD (ver hallazgo coincidente de tech-lead y PO con MEDIUM) | Ver acción requerida del hallazgo #5 (Tech-Lead) / H-001 (PO) |

---

## Decisión final

**review-status: needs-changes**

La implementación central de FEAT-068 es sólida: la carga dinámica del DoD en runtime (sub-paso 1g), la evaluación semántica (Correlación 5), la guardia de transición (Paso 9a), el output del reporte (Paso 8) y el template externo (`analyze-report-template.md`) están correctamente implementados y alineados con el diseño. Los cinco criterios de aceptación se satisfacen en el flujo principal.

Los dos hallazgos MEDIUM comparten la misma causa raíz: el **Template de Fallback interno** (al final de SKILL.md, sección `## Template de Fallback`) no fue actualizado para incluir la funcionalidad DoD introducida por esta historia. Esto significa que:

1. Si un usuario ejecuta el skill sin el template externo disponible, el output no incluirá ninguna referencia a DoD — incumplimiento silencioso de AC-1 en ese escenario.
2. El bloque interactivo `⛔` de Paso 10 no comunica al usuario cuántos criterios DoD fallaron, reduciendo la usabilidad cuando hay DoD-ERRORs.

Ambas correcciones son quirúrgicas y se limitan al archivo `SKILL.md`.

---

## Siguiente acción

Aplicar las dos correcciones de `fix-directives.md` en `.claude/skills/story-analyze/SKILL.md`:
1. Actualizar el Template de Fallback (líneas ~444-530) para incluir fila DoD en Resumen Ejecutivo y sección `## Cumplimiento DoD — Fase PLAN`.
2. Actualizar el bloque `⛔` de Paso 10 para mostrar `DoD PLAN: <$DOD_ERROR_COUNT> criterios ❌` cuando aplica.

Luego re-ejecutar `/story-code-review FEAT-068`.
