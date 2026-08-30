---
alwaysApply: false
type: design
id: STORY-069
slug: dod-IMPLEMENT-en-story-implement-design
title: "Design: DoD IMPLEMENT en story-implement"
story: STORY-069
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-IMPLEMENT-en-story-implement
---

<!-- Referencias -->
[[dod-IMPLEMENT-en-story-implement]]

## Context

El skill `story-implement` (`.claude/skills/story-implement/SKILL.md`) implementa el código de una historia SDD tarea por tarea en ciclo TDD. Al finalizar todas las tareas, genera `implement-report.md` y transiciona `story.md` a `READY-FOR-CODE-REVIEW/DONE`.

STORY-069 agrega **validación de Definition of Done para la fase IMPLEMENT**: antes de cerrar la historia, el skill lee dinámicamente los criterios DoD de la sección "IMPLEMENT" de `$SPECS_BASE/policies/definition-of-done-story.md`, evalúa cada criterio contra la evidencia generada durante la implementación, e incluye los resultados en `implement-report.md`. Si hay DoD-ERRORs (criterios ❌), la transición a `READY-FOR-CODE-REVIEW/DONE` se bloquea.

Este diseño sigue el mismo patrón establecido por STORY-068 (DoD PLAN en story-analyze), aplicándolo al skill story-implement y a la fase IMPLEMENT.

**Artefactos afectados:**
- `.claude/skills/story-implement/SKILL.md` — sub-paso `2f` (carga DoD), sub-paso `4g` (evaluación DoD), paso `4a` (sección DoD en reporte), paso `4b` (condición de transición), Resumen Final

**Restricción detectada:** El DoD puede no tener sección con término "IMPLEMENT" (por cambio de nombre o ausencia). La degradación elegante es obligatoria: si la sección no se encuentra, emitir ⚠️ y continuar sin validar. Ver CR-001.

**Restricción adicional:** Story-implement genera código y tests, pero no los **ejecuta**. Los criterios DoD que requieren ejecución (ej. "tests pasan", "CI pasa") no pueden evaluarse de forma concluyente — deben clasificarse como ⚠️ (evidencia insuficiente), no como ❌.

## Goals / Non-Goals

**Goals:**
- Agregar sub-paso `2f` en Step 2: localizar y cargar `definition-of-done-story.md`, extraer sección del estado IMPLEMENT, registrar criterios como `$DOD_IMPLEMENT_CRITERIA` o emitir ⚠️ si no encontrado. // satisface: AC-3
- Agregar sub-paso `4g` en Step 4 (antes de `4b`): evaluar cada criterio DoD IMPLEMENT contra evidencia del implement-report y código generado, clasificar `✓`/`❌`/`⚠️`. // satisface: AC-1, AC-2
- Modificar paso `4a`: incluir sección "Cumplimiento DoD — Fase IMPLEMENT" en `implement-report.md` con tabla de criterio / estado / evidencia. // satisface: AC-1
- Modificar paso `4b`: condicionar la transición a `READY-FOR-CODE-REVIEW/DONE` al resultado del sub-paso `4g` (no transicionar si hay DoD-ERRORs). // satisface: AC-2
- Agregar línea `DoD IMPLEMENT: N/Total criterios ✓` al resumen final mostrado al usuario. // satisface: AC-1
- Los cambios respetan los patrones de `skill-structural-pattern.md`: sub-paso `2f` numerado alfabéticamente dentro de Step 2, sub-paso `4g` insertado entre `4a` y `4b` sin renumerar los pasos existentes (4b–4f permanecen inalterados). // satisface: Req-Struct
- Actualizar `.claude/skills/story-implement/examples/output/implement-report.md` para incluir la sección "Cumplimiento DoD — Fase IMPLEMENT" con al menos una fila `✓` y una fila `⚠️` (requiere ejecución externa), reflejando el output esperado tras los cambios. // satisface: Req-SC (artefactos de ejemplo actualizados)

**Non-Goals:**
- Modificar la lógica TDD del Paso 3 (ciclo test → código → refactor)
- Agregar la sección "IMPLEMENT" al DoD si no existe (tarea externa, ver CR-001)
- Ejecutar tests ni verificar que los tests generados pasan
- Crear un subagente evaluador para el DoD (el LLM evalúa semánticamente con el contexto disponible)
- Modificar el ciclo de vida de estados más allá de lo especificado en la historia

## Decisions

### D1 — Estrategia de extracción de la sección "IMPLEMENT" del DoD // satisface: AC-3

El DoD puede evolucionar (secciones renombradas, añadidas, eliminadas). El skill no debe hardcodear el nombre exacto de la sección.

**Opción elegida:** Búsqueda por coincidencia flexible — localizar el primer encabezado h3 (`###`) cuyo texto contenga, case-insensitive, alguno de los términos: `["IMPLEMENT", "IMPLEMENTANDO", "IMPLEMENTACIÓN"]`. Registrar en el log qué encabezado fue encontrado. Extraer todas las líneas de checkbox (`- [ ] <texto>` y `- [x] <texto>`) dentro de esa sección como lista de criterios planos.

Resultado: lista `$DOD_IMPLEMENT_CRITERIA` = lista de strings, una por criterio.

**Alternativas rechazadas:**
- *Match exacto al string "IMPLEMENT"*: frágil; si el DoD titula la sección "IMPLEMENTACIÓN" o "IMPLEMENTANDO", falla sin degradación. Rechazado.
- *Hardcodear los criterios del DoD en el skill*: viola P6 (diseño para el cambio) y el principio 5 del framework (template como fuente de verdad). Si el DoD evoluciona, el skill queda desactualizado. Rechazado.
- *Leer todo el DoD y enviar al LLM a extraer*: innecesariamente costoso en contexto; la extracción por encabezado es suficiente y predecible. Rechazado.

### D2 — Estrategia de evaluación de cada criterio DoD contra evidencia de implementación // satisface: AC-1, AC-2

Cada criterio DoD es texto libre. La evaluación requiere razonar sobre la evidencia disponible: contenido de `tasks.md` (tareas completadas), archivos generados listados en la tabla de estado, y descripciones del código producido.

**Limitación crítica (D6):** story-implement no ejecuta tests ni CI. Los criterios que requieren ejecución (ej. "tests pasan", "CI pasa sin errores") no tienen evidencia evaluable en los artefactos disponibles.

**Opción elegida:** Evaluación semántica en contexto del LLM con regla de duda:
- `✓` — evidencia clara de cumplimiento presente en los artefactos
- `❌` — evidencia clara de incumplimiento presente (ej. tarea de código ignorada, criterio explícitamente violado)
- `⚠️` — evidencia insuficiente, criterio requiere ejecución externa, o criterio no evaluable desde los artefactos disponibles

**Regla de duda obligatoria:** ante incertidumbre, usar `⚠️` (WARNING) en lugar de `❌` (ERROR) para no bloquear indebidamente. Los criterios de ejecución (tests, CI) son siempre `⚠️` porque story-implement no puede verificarlos.

**Alternativas rechazadas:**
- *Evaluación rule-based (parseo de estructura)*: frágil ante criterios nuevos o reformulados; requiere mapear cada criterio a una regla específica. Viola P6. Rechazado.
- *Subagente evaluador*: introduce nivel de delegación innecesario cuando el LLM ya tiene el contexto completo en sesión. Contradice P12 (KISS) y la arquitectura de un solo nivel de delegación. Rechazado.

### D3 — Severidad de los resultados DoD // satisface: AC-2

**Opción elegida:** `❌` → ERROR (bloquea transición a READY-FOR-CODE-REVIEW); `⚠️` → WARNING (registra pero no bloquea); `✓` → sin hallazgo. El bloqueo en paso `4b` ocurre si existe al menos un criterio DoD con resultado `❌`.

**Alternativas rechazadas:**
- *Todos como WARNING*: no satisface AC-2, que exige bloqueo ante DoD-ERRORs.
- *Severidad configurable mediante etiquetas en el DoD*: añade complejidad de formato al DoD sin requerimiento actual. YAGNI. Rechazado.

### D4 — Puntos de integración en story-implement/SKILL.md // satisface: AC-1, AC-2

Integrar en los pasos existentes siguiendo la numeración del SKILL.md sin crear pasos nuevos que rompan la estructura:

| Punto de integración | Acción | Paso actual |
|---|---|---|
| Sub-paso `2f` | Localizar DoD, extraer sección IMPLEMENT, registrar `$DOD_IMPLEMENT_CRITERIA` o emitir ⚠️ | Step 2 |
| Sub-paso `4g` (nuevo, antes de `4b`) | Evaluar cada criterio semánticamente, clasificar ✓/❌/⚠️, registrar `$DOD_RESULT` | Step 4 |
| Sección DoD en `4a` | Completar sección "Cumplimiento DoD — Fase IMPLEMENT" en implement-report.md | Step 4 |
| Guardia de transición DoD en `4b` | `status: READY-FOR-CODE-REVIEW` solo si `$DOD_RESULT` no contiene ❌ | Step 4 |
| Línea resumen DoD | `DoD IMPLEMENT: N/Total criterios ✓` en Resumen Final | Resumen Final |

**Alternativa rechazada:** Paso dedicado (ej. "Paso 4.5") entre Step 4 y el resumen. Rompe la numeración establecida sin aportar valor estructural. Rechazado.

### D5 — Estructura de la sección DoD en implement-report.md // satisface: AC-1

El formato del reporte actual (definido inline en el SKILL.md del Paso 4a) no incluye sección DoD. Se debe agregar al template de estructura del reporte.

**Cambios al formato del reporte en SKILL.md paso 4a:**

Nueva sección al final del reporte (antes del bloque "Nota sobre los Tests"):

```
## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | <criterio del DoD> | ✓ / ❌ / ⚠️ | <descripción breve de la evidencia> |
...

**Resumen:** N/Total criterios ✓
```

Si el DoD no fue encontrado (AC-3), mostrar sección con texto:
```
⚠️ DoD IMPLEMENT no encontrado — se omitió la validación.
   Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene la sección "IMPLEMENT".
```

**Alternativa rechazada:** Omitir la sección si el DoD no se encontró. Da menos visibilidad al usuario sobre el estado de la validación. Rechazado.

### D6 — Clasificación de criterios no evaluables (ejecución externa) // satisface: AC-3, NFR

Story-implement genera código pero no lo ejecuta. Criterios como "todos los tests pasan", "CI pasa", "cobertura no disminuye" requieren ejecución externa.

**Opción elegida:** Todos los criterios que requieren ejecución de tests o CI se clasifican automáticamente como `⚠️` con evidencia `"Requiere ejecución de tests — no evaluable por story-implement"`. Nunca se clasifican como `❌`.

**Alternativa rechazada:** Clasificar como `❌` los criterios de ejecución. Bloquearía siempre la transición (porque los tests nunca se ejecutan en este skill), haciendo que el DoD sea inútil en la práctica. Rechazado.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| DoD no tiene sección "IMPLEMENT" (CR-001) | AC-3 exige degradación: emitir ⚠️ y continuar. La sección DoD en el reporte muestra el aviso |
| Evaluación semántica produce resultado inconsistente en re-ejecuciones | Ante duda usar `⚠️` no `❌`; la ambigüedad no bloquea |
| Criterios de ejecución (tests, CI) nunca pueden ser ✓ | D6: clasificar como ⚠️ explícito con razón "requiere ejecución externa" |
| Sub-paso 4g agrega latencia al cierre | La evaluación ocurre solo una vez al final; no afecta el ciclo TDD por tarea |
| Insertar 4g antes de 4b podría romper la numeración existente | 4g se inserta entre 4a y 4b; los pasos 4c–4f se mantienen sin cambio de letra |

## Open Questions

- **CR-001**: La sección "IMPLEMENT" de `definition-of-done-story.md` existe y tiene contenido (verificado en Paso 3). A diferencia de STORY-068 (donde "PLAN" no existía), aquí el DoD sí tiene la sección requerida. El sub-paso 2f debería encontrarla exitosamente.
- ¿Debe el Resumen Final cambiar su estado final (`✅`/`⚠️`) según el resultado del DoD, o solo mostrar la línea de conteo? Propuesta: si hay DoD-ERRORs, el estado mostrado cambia a `⚠️ Implementación completada con DoD-ERRORs pendientes` en lugar de `✅ Implementación completa`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia (resuelta)
- **Descripción**: `docs/policies/definition-of-done-story.md` SÍ contiene la sección `### Definition of Done para el estado IMPLEMENT` con criterios de aceptación, código, tests, documentación e integración. Sub-paso 2f podrá extraerlos exitosamente. No hay bloqueo.
- **Documento afectado**: ninguno — condición favorable
- **Acción requerida**: ninguna

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: El SKILL.md actual define el Paso 4 con sub-pasos 4a–4f. La historia indica "sub-paso 4g en Paso 4 (antes de actualizar el estado)". El "estado" se actualiza en 4b. Por tanto, 4g se inserta entre 4a y 4b. Los pasos 4b–4f no se renombran.
- **Documento afectado**: story.md (nota adicional)
- **Acción requerida**: Confirmar en implementación que el orden es: 4a (generar reporte con sección DoD) → 4g (evaluar DoD) → 4b (transición condicional). La sección DoD del reporte debe estar ya escrita antes de que 4g evalúe, porque 4g lee los resultados y ajusta la tabla.
- **Resolución**: Reordenar como 4a (generar reporte base) → 4g (evaluar DoD y completar sección DoD en reporte) → 4b (transición condicional). 4g puede escribir o completar la tabla directamente en implement-report.md.
