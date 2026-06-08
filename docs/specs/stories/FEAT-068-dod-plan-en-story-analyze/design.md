---
alwaysApply: false
type: design
id: FEAT-068
slug: dod-plan-en-story-analyze-design
title: "Design: DoD PLAN en story-analyze"
story: FEAT-068
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-plan-en-story-analyze
---

<!-- Referencias -->
[[dod-plan-en-story-analyze]]

## Context

El skill `story-analyze` (`.claude/skills/story-analyze/SKILL.md`) audita la coherencia entre `story.md`, `design.md` y `tasks.md` antes de pasar a implementación. Ejecuta 4 correlaciones (cobertura de ACs en diseño, tareas sin diseño, diseño sin tarea, alineación con release) y actualiza `story.md` a `READY-FOR-IMPLEMENT` si no hay inconsistencias de tipo ERROR.

FEAT-068 agrega un **quinto eje de validación**: verificar que los artefactos de la fase PLAN cumplen los criterios definidos en `$SPECS_BASE/policies/definition-of-done-story.md`. Esta validación debe ser completamente dinámica — el skill lee los criterios del DoD en runtime, sin hardcodearlos.

**Artefactos afectados:**
- `.claude/skills/story-analyze/SKILL.md` — pasos 1, 6, 9, 10
- `.claude/skills/story-analyze/assets/analyze-report-template.md` — nuevas filas/sección DoD

**Restricción detectada:** `docs/policies/definition-of-done-story.md` contiene secciones para SPECIFY, IMPLEMENT y CODE-REVIEW, pero no una sección con término "PLAN". La degradación elegante es obligatoria. Ver CR-001.

## Goals / Non-Goals

**Goals:**
- Agregar sub-paso `1g` en Step 1: localizar y cargar `definition-of-done-story.md`, extraer sección del estado PLAN. // satisface: AC-3, AC-4-NFR
- Agregar Correlación 5 en Step 6: evaluar cada criterio DoD PLAN contra evidencia en los tres artefactos. // satisface: AC-1, AC-2
- Actualizar `analyze-report-template.md` con fila DoD en Resumen Ejecutivo y nueva sección "Cumplimiento DoD — Fase PLAN". // satisface: AC-1
- Hacer que los DoD-ERRORs (criterios ❌) bloqueen la transición a `READY-FOR-IMPLEMENT` en Step 9. // satisface: AC-2
- Agregar línea `DoD PLAN: N/Total criterios ✓` al resumen interactivo de Step 10. // satisface: AC-1

- Los cambios al SKILL.md respetan los patrones de `skill-structural-pattern.md`: sub-paso `1g` numerado alfabéticamente dentro de Step 1, Correlación 5 numerada secuencialmente dentro de Step 6, template leído desde `assets/` con fallback chain sin hardcodear secciones. // satisface: Req4

**Non-Goals:**
- Agregar la sección "PLAN" al archivo `definition-of-done-story.md` (tarea externa, ver CR-001)
- Modificar las correlaciones 1–4 ni su lógica de severidad existente
- Crear un nuevo skill o subagente; todos los cambios van en archivos existentes de `story-analyze/`

## Decisions

### D1 — Estrategia de extracción de la sección "PLAN" del DoD // satisface: AC-3, AC-4-NFR

El DoD puede evolucionar (secciones renombradas, añadidas). El skill no debe hardcodear un nombre exacto de sección.

**Opción elegida:** Búsqueda por coincidencia flexible — localizar el primer encabezado h3 (`###`) cuyo texto contenga, case-insensitive, alguno de los términos: `["PLAN", "PLANNING", "PLANIFICACIÓN"]`. Registrar en el log qué encabezado fue encontrado. Extraer todas las líneas de checkbox (`- [ ] <texto>` y `- [x] <texto>`) dentro de esa sección como lista de criterios.

**Alternativas rechazadas:**
- *Match exacto al string "PLAN"*: frágil; si el DoD titula la sección "PLANIFICACIÓN" o "PLANNING", falla. Rechazado.
- *Mapping fijo "PLAN" → "SPECIFY"*: hardcodea equivalencia que contradice P6 (diseño para el cambio). Si el DoD añade una sección PLAN real, el mapping quedaría obsoleto. Rechazado.

### D2 — Estrategia de evaluación de cada criterio DoD // satisface: AC-1, AC-2

Cada criterio es una cadena de texto libre. La evaluación requiere razonar sobre evidencia en los artefactos.

**Opción elegida:** Evaluación semántica en contexto del LLM — para cada criterio, el modelo lee el texto del criterio y el contenido relevante de los tres artefactos, y decide:
- `✓` — evidencia clara de cumplimiento presente
- `❌` — evidencia clara de incumplimiento presente
- `⚠️` — evidencia insuficiente o criterio no evaluable desde los artefactos disponibles

Ante duda, el criterio se clasifica `⚠️` en lugar de `❌` para no bloquear indebidamente.

**Alternativas rechazadas:**
- *Evaluación rule-based (parseo de estructura)*: frágil ante criterios nuevos o reformulados; requiere mapear cada criterio a una regla concreta. Viola P6. Rechazado.
- *Subagente evaluador especializado*: introduce un nivel de delegación adicional innecesario cuando el LLM ya tiene todos los artefactos en contexto. Contradice P12 (KISS). Rechazado.

### D3 — Severidad de los resultados DoD // satisface: AC-2

**Opción elegida:** `❌` → ERROR (bloquea transición); `⚠️` → WARNING (no bloquea); `✓` → sin hallazgo. El bloqueo en Step 9 ocurre si existe al menos un criterio DoD con resultado `❌`.

**Alternativas rechazadas:**
- *Todos como WARNING*: no satisface AC-2, que exige bloqueo ante DoD-ERRORs.
- *Severidad configurable en el DoD (parseo de etiquetas)*: añade complejidad de formato al DoD sin que sea requerido hoy. YAGNI. Rechazado.

### D4 — Puntos de integración en story-analyze/SKILL.md // satisface: AC-1, AC-2

Integrar en los pasos existentes siguiendo las notas de la historia, sin crear pasos nuevos que rompan la numeración:

| Punto de integración | Acción | Paso actual |
|---|---|---|
| Sub-paso `1g` | Localizar DoD, extraer sección PLAN, registrar criterios o emitir ⚠️ | Step 1 |
| Correlación 5 | Evaluar cada criterio DoD semánticamente, clasificar ✓/❌/⚠️ | Step 6 |
| Fila + sección DoD en report | Completar template con resultados de Correlación 5 | Step 8 |
| Guardia de transición DoD | `status: READY-FOR-IMPLEMENT` solo si no hay DoD-ERRORs | Step 9 |
| Línea de resumen DoD | `DoD PLAN: N/Total criterios ✓` en confirmación interactiva | Step 10 |

**Alternativa rechazada:** Paso dedicado entre Step 6 y Step 7. Rompe la numeración establecida y el contrato de los pasos existentes sin aportar valor estructural. Rechazado.

### D5 — Actualización de analyze-report-template.md // satisface: AC-1

El template actual no tiene fila DoD en el Resumen Ejecutivo ni sección "Cumplimiento DoD — Fase PLAN". El principio P5 (template como fuente de verdad) exige que la estructura del report esté en el template.

**Cambios al template:**
1. Nueva fila en tabla Resumen Ejecutivo: `| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |`
2. Nueva sección al final: `## Cumplimiento DoD — Fase PLAN` con tabla de criterio / estado / severidad / evidencia, y comentario condicional para cuando el DoD no fue encontrado.

**Alternativa rechazada:** El skill añade la sección al report dinámicamente en Step 8 sin modificar el template. Contradice P5 (template como fuente de verdad) — el report tendría secciones no visibles en el template. Rechazado.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| DoD no tiene sección "PLAN" (CR-001) | AC-3 exige degradación: emitir ⚠️ y continuar sin validar DoD. La sección DoD queda marcada como "⚠️ no encontrado" en el report |
| Evaluación semántica produce resultado inconsistente en re-ejecuciones | Documentar en SKILL.md que ante duda se use `⚠️` y no `❌`; la ambigüedad no bloquea |
| Solapamiento entre Correlación 5 (DoD) y Correlaciones 1–4 | Los conteos son independientes y se reportan por separado; el usuario ve ambas perspectivas sin deduplicación |
| Criterio DoD evalúa algo fuera del trío story/design/tasks | Clasificar como `⚠️` (indeterminable); no bloquear |

## Open Questions

- **CR-001**: ¿Qué story en EPIC-13 agrega la sección "PLAN" al DoD? Hasta que exista, FEAT-068 siempre emitirá el ⚠️ de degradación.
- Si el DoD no fue encontrado, ¿debe la sección "Cumplimiento DoD" aparecer en el report con mensaje de aviso, o omitirse? Propuesta: mostrar sección con texto `⚠️ DoD PLAN no encontrado — se omitió la validación` para dar visibilidad al issue.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `docs/policies/definition-of-done-story.md` no contiene ninguna sección h3 con término "PLAN", "PLANNING" ni "PLANIFICACIÓN". Sub-paso 1g siempre emitirá ⚠️ y retornará lista vacía de criterios, haciendo que Correlación 5 no valide nada hasta que la sección exista.
- **Documento afectado**: `docs/policies/definition-of-done-story.md`
- **Acción requerida**: Agregar sección `### Definition of Done para el estado PLAN` con criterios de calidad para los artefactos story.md, design.md y tasks.md. Esta tarea es candidata a un story independiente dentro de EPIC-13 o puede ejecutarse junto con la implementación de FEAT-068.
