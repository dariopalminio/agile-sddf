---
type: analyze
id: {story_id}
slug: {story_id}-analyze-report
title: "Analyze: {story_title}"
story: {story_id}
design: {story_id}
tasks: {story_id}
created: {date}
updated: {date}
---

<!-- Referencias -->
[[{story_id}]]

# Reporte de Coherencia: {story_title}

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | {ac_coverage_status} | {ac_coverage_n}/{ac_total} criterios cubiertos |
| Alineación tareas → diseño | {tasks_alignment_status} | {tasks_aligned_n}/{tasks_total} tareas con diseño |
| Cobertura diseño → tareas | {design_coverage_status} | {design_covered_n}/{design_total} elementos con tarea |
| Alineación con release {parent} | {release_status} | {release_detail} |
| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |

**Estado general:** {overall_status}
<!-- overall_status: ✓ Coherente | ⚠️ Advertencias | ❌ Inconsistencias bloqueantes -->

---

## Cobertura de Criterios de Aceptación

<!-- Para cada AC de story.md, indicar si está cubierto en design.md y por qué elemento. -->

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | {ac_1_desc} | ✓ / ❌ | {design_element_or_section} |

---

## Alineación Tareas ↔ Diseño

<!-- Para cada tarea de tasks.md, indicar si tiene un elemento de diseño que la justifique. -->

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | {task_desc} | {design_element} | ✓ / ❌ |

---

## Cobertura Diseño → Tareas

<!-- Para cada componente e interfaz de design.md, indicar si existe una tarea que lo implemente. -->

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| {component} | {section} | {task_id} | ✓ / ⚠️ sin tarea |

---

## Alineación con Release

**Release padre:** {parent}

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ / ❌ | {detail} |
| Objetivo de la historia alineado con release | ✓ / ❌ | {detail} |
| Restricciones del release respetadas | ✓ / ❌ | {detail} |

---

## Inconsistencias Detectadas

<!-- Completar solo si se encontraron inconsistencias. Si no hay, escribir: Sin inconsistencias detectadas. -->

### INC-001 [{ERROR / WARNING}]

- **Tipo:** {A: AC sin cobertura / B: tarea sin diseño / C: diseño sin tarea / D: desalineación release}
- **Descripción:** {descripción_concreta}
- **Archivo afectado:** {filename} — sección "{section_name}"
- **Acción requerida:** {accion_concreta}

---

## Recomendaciones

<!-- Para cada inconsistencia, una acción concreta indicando el archivo y sección a modificar. -->

1. {recomendacion_1}

---

## Cumplimiento DoD — Fase PLAN

<!-- Si $DOD_PLAN_CRITERIA estuvo vacío al ejecutar Correlación 5, mostrar el texto de aviso a continuación y omitir la tabla. -->
<!-- ⚠️ DoD PLAN no encontrado — se omitió la validación. Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene una sección con el término "PLAN". -->

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| {criterio_dod_1} | ✓ / ❌ / ⚠️ | ERROR / WARNING / — | {evidencia_breve} |
