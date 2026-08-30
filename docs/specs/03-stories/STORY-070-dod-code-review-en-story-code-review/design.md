---
alwaysApply: false
type: design
id: STORY-070
slug: dod-code-review-en-story-code-review-design
title: "Design: DoD CODE-REVIEW en story-code-review"
story: STORY-070
created: 2026-05-14
updated: 2026-05-14
related:
  - dod-code-review-en-story-code-review
---

<!-- Referencias -->
[[dod-code-review-en-story-code-review]]

## Context

El skill `story-code-review` (`.claude/skills/story-code-review/SKILL.md`) ejecuta una revisión multi-agente del código: lanza tres subagentes en paralelo (Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer), consolida sus hallazgos y calcula `review-status` (approved/needs-changes) según la severidad máxima de los hallazgos.

STORY-070 agrega **validación de Definition of Done para la fase CODE-REVIEW**: después de consolidar los hallazgos de los tres agentes y antes de derivar el `review-status` definitivo, el skill extrae dinámicamente la sección "CODE-REVIEW" de `$SPECS_BASE/policies/definition-of-done-story.md`, evalúa cada criterio contra el estado del código revisado, y si hay criterios no cumplidos con severidad HIGH o MEDIUM los incorpora como hallazgos adicionales — ajustando `review-status` a `needs-changes` si correspondiera.

Este diseño sigue el patrón establecido por STORY-068 (DoD PLAN en story-analyze) y STORY-069 (DoD IMPLEMENT en story-implement), adaptándolo a la lógica de consolidación multi-agente de story-code-review.

**Diferencias clave respecto a STORY-068/069:**
1. Los hallazgos DoD se incorporan a la **tabla consolidada de hallazgos** junto a los hallazgos de los agentes, no en una sección separada
2. El `review-status` final considera la severidad máxima entre hallazgos de agentes **y** hallazgos DoD
3. Los hallazgos DoD entran en `fix-directives.md` con `Dimensión: DoD-CODE-REVIEW` siguiendo el mismo formato que los hallazgos de agentes

**Artefactos afectados:**
- `.claude/skills/story-code-review/SKILL.md` — Paso 2d (extracción sección CODE-REVIEW), nuevo Paso 4c.1 (evaluación DoD), Paso 4f (hallazgos DoD en fix-directives), Paso 5b (sección DoD en report), Paso 7 (línea DoD en resumen)
- `.claude/skills/story-code-review/assets/code-review-report-template.md` — nueva sección "Cumplimiento DoD — Fase CODE-REVIEW"

**Restricción detectada:** La sección "CODE-REVIEW" puede no existir en el DoD. La degradación elegante es obligatoria. Ver CR-001.

## Goals / Non-Goals

**Goals:**
- Ampliar Paso 2d: extraer sección "CODE-REVIEW" del DoD, registrar como `$DOD_CODE_REVIEW_CRITERIA` o `[]` con ⚠️ si no encontrado. // satisface: AC-3
- Agregar sub-paso `4c.1` entre los actuales `4c` y `4d`: evaluar cada criterio DoD semánticamente, asignar severidad (HIGH/MEDIUM/LOW), incorporar hallazgos ❌/⚠️ a la tabla consolidada y ajustar `$REVIEW_STATUS` si la nueva severidad máxima es HIGH/MEDIUM. // satisface: AC-1, AC-2
- Ampliar Paso 4f: incluir en `fix-directives.md` las filas de hallazgos DoD con `Dimensión: DoD-CODE-REVIEW`, `Archivo:Línea` apuntando a la línea del criterio en `definition-of-done-story.md`. // satisface: AC-1 (NFR compatibilidad)
- Ampliar Paso 5b: incluir sección "Cumplimiento DoD — Fase CODE-REVIEW" en `code-review-report.md` con tabla de criterio / estado / severidad / evidencia. // satisface: AC-1, AC-2
- Ampliar Paso 7: mostrar línea `DoD CODE-REVIEW: N/Total criterios ✓` en el resumen final. // satisface: AC-1, AC-2
- Los cambios respetan los patrones de `skill-structural-pattern.md`: sub-paso `4c.1` numerado secuencialmente dentro del Paso 4, sin renumerar los sub-pasos existentes (4d–4h permanecen). // satisface: Req-Struct
- Actualizar `.claude/skills/story-code-review/assets/code-review-report-template.md` para incluir la sección DoD. // satisface: AC-1 (estructura del reporte)

**Non-Goals:**
- Modificar la lógica de los tres subagentes revisores ni sus prompts
- Agregar la sección "CODE-REVIEW" al DoD si no existe (tarea externa, ver CR-001)
- Crear un subagente evaluador separado para el DoD
- Modificar el flujo de consolidación de hallazgos de agentes (pasos 4a, 4b, 4c sin cambios)
- Modificar el ciclo de vida de estados más allá de lo especificado en la historia

## Decisions

### D1 — Estrategia de extracción de la sección "CODE-REVIEW" del DoD // satisface: AC-3

El DoD puede evolucionar (secciones renombradas, añadidas, eliminadas). Dado que Paso 2d ya localiza `$DOD_PATH`, se extiende ese paso para extraer la sección.

**Opción elegida:** Búsqueda por coincidencia flexible en el archivo ya localizado — identificar el primer encabezado h3 (`###`) cuyo texto contenga, case-insensitive, alguno de los términos: `["CODE-REVIEW", "CODE REVIEW", "REVISIÓN DE CÓDIGO", "REVISION DE CODIGO"]`. Extraer todas las líneas de checkbox (`- [ ] <texto>` y `- [x] <texto>`) como lista de criterios planos con su número de línea. Registrar como `$DOD_CODE_REVIEW_CRITERIA`.

Si no se encuentra → emitir `⚠️ Sección CODE-REVIEW no encontrada en DoD` y registrar `$DOD_CODE_REVIEW_CRITERIA = []`.

**Alternativas rechazadas:**
- *Match exacto*: frágil ante variaciones de nombre (CODE REVIEW vs CODE-REVIEW). Rechazado.
- *Hardcodear criterios*: viola el requerimiento de lectura en runtime del release EPIC-13. Rechazado.

### D2 — Estrategia de evaluación de cada criterio DoD y asignación de severidad // satisface: AC-1, AC-2

Los criterios DoD CODE-REVIEW son texto libre. La evaluación requiere razonar sobre evidencia disponible: código implementado (inferido del implement-report), informes de agentes y story.md.

**Opción elegida:** Evaluación semántica en contexto del LLM:
- `✓` — evidencia clara de cumplimiento en los artefactos revisados
- `❌ + severidad` — criterio claramente no cumplido; el LLM asigna severidad (HIGH/MEDIUM/LOW) según impacto:
  - HIGH: criterios funcionales y de regresión (ej. "Gherkin pasan", "no hay regresiones")
  - MEDIUM: criterios de calidad de código (ej. "pasa el linter", "sin código comentado")
  - LOW: criterios de documentación opcionales o de despliegue futuro
- `⚠️` — evidencia insuficiente o criterio no evaluable desde los artefactos disponibles (no bloquea)

**Regla de duda obligatoria:** ante incertidumbre, usar `⚠️` (no añade a hallazgos bloqueantes).

**Alternativas rechazadas:**
- *Todos los fallos como HIGH*: sobrebloquea ante criterios cosméticos. Rechazado.
- *Severidad fija por sección de DoD*: rigidez ante nuevos criterios en el DoD. Rechazado.

### D3 — Integración de hallazgos DoD con hallazgos de agentes // satisface: AC-1

Los hallazgos DoD deben aparecer junto a los hallazgos de agentes en la tabla consolidada y en fix-directives.md.

**Opción elegida:** Los hallazgos DoD ❌ se añaden a la tabla consolidada interna al finalizar el sub-paso 4c.1, antes de re-calcular `$MAX_SEVERITY`. Se tratan exactamente igual que los hallazgos de agentes:
- Columna `Dimensión`: `DoD-CODE-REVIEW`
- Columna `Archivo:Línea`: `docs/policies/definition-of-done-story.md:<número_de_línea>` (del criterio en el DoD)
- Columna `Severidad`: valor asignado en D2
- Columna `Hallazgo`: texto del criterio DoD
- Columna `Acción requerida`: acción concreta derivada semánticamente del criterio

Luego se recalcula `$MAX_SEVERITY` considerando todos los hallazgos (agentes + DoD).

**Alternativas rechazadas:**
- *Tabla separada de hallazgos DoD*: rompe la uniformidad con fix-directives.md; el formato de la historia exige misma estructura. Rechazado.
- *DoD decide por separado sin afectar max_severity*: no satisface AC-1 (review-status debe cambiar). Rechazado.

### D4 — Puntos de integración en story-code-review/SKILL.md // satisface: AC-1, AC-2

| Punto de integración | Acción | Paso actual |
|---|---|---|
| Paso 2d (ampliado) | Extraer sección CODE-REVIEW del DoD, registrar `$DOD_CODE_REVIEW_CRITERIA` | Paso 2 |
| Sub-paso `4c.1` (nuevo, entre 4c y 4d) | Evaluar DoD, asignar severidades, añadir hallazgos a tabla consolidada, recalcular `$MAX_SEVERITY` y `$REVIEW_STATUS` | Paso 4 |
| Paso 4f (ampliado) | Incluir filas DoD en fix-directives.md con `Dimensión: DoD-CODE-REVIEW` | Paso 4 |
| Paso 5b (ampliado) | Completar sección "Cumplimiento DoD — Fase CODE-REVIEW" en code-review-report.md | Paso 5 |
| Paso 7 (ampliado) | Añadir línea `DoD CODE-REVIEW: N/Total criterios ✓` al resumen | Paso 7 |

**Alternativa rechazada:** Nuevo paso entre Paso 4 y Paso 5. Rompe la numeración de los pasos existentes sin aportar valor estructural. Rechazado.

### D5 — Actualización de code-review-report-template.md // satisface: AC-1

El template actual no tiene sección DoD. El principio P5 (template como fuente de verdad) exige que la estructura del report esté en el template.

**Cambios al template:**
- Nueva sección al final del template: `## Cumplimiento DoD — Fase CODE-REVIEW` con tabla `| # | Criterio | Estado | Severidad | Evidencia |` y fallback `⚠️ DoD CODE-REVIEW no encontrado — se omitió la validación`.

**Alternativa rechazada:** El skill añade la sección dinámicamente sin modificar el template. Contradice P5. Rechazado.

### D6 — Criterios DoD no evaluables en el contexto de code-review // satisface: AC-3, NFR

Algunos criterios DoD CODE-REVIEW requieren acceso al entorno de CI/CD o al historial de ejecución de tests que no están disponibles en los artefactos Markdown del skill.

**Opción elegida:** Criterios cuya evaluación requiere estado externo (CI, deploys, ejecuciones anteriores) se clasifican como `⚠️` con evidencia `"Requiere acceso a CI/CD — no evaluable desde artefactos disponibles"`. Nunca se clasifican como `❌` (no bloquean).

**Alternativa rechazada:** Clasificar como `❌ HIGH` para ser conservadores. Bloquearía siempre ante criterios de CI/CD. Rechazado.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| DoD no tiene sección "CODE-REVIEW" (CR-001) | AC-3 exige degradación: `$DOD_CODE_REVIEW_CRITERIA = []`, ⚠️ y continuar |
| Hallazgos DoD inflados por criterios CI/CD | D6: criterios de entorno externo → `⚠️`, nunca `❌` |
| Sub-paso 4c.1 recalcula review-status después de 4c | Orden garantizado: 4c calcula status basado en agentes → 4c.1 ajusta con DoD → 4d bifurca según status final. Sin ambigüedad. |
| Template modificado puede romper examples existentes | Actualizar examples/example-approved/code-review-report.md para incluir la nueva sección DoD |
| Número de línea del criterio DoD en Archivo:Línea | Usar número de línea aproximado (primera ocurrencia del texto del criterio en el archivo DoD). Suficiente para trazabilidad. |

## Open Questions

- **CR-001**: ¿Existe ya la sección "CODE-REVIEW" en `definition-of-done-story.md`? Revisión del archivo muestra que sí existe: `### Definition of Done para el estado CODE-REVIEW`. Sub-paso 4c.1 debería encontrarla exitosamente.
- ¿El `review-status` en la tabla de resumen (Paso 7) debe mostrar la contribución de DoD por separado (ej. "agents: approved + DoD: needs-changes → needs-changes") o solo el resultado final? Propuesta: mostrar solo el resultado final en la tabla y agregar la línea DoD como dato adicional.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia (resuelta)
- **Descripción**: `docs/policies/definition-of-done-story.md` SÍ contiene la sección `### Definition of Done para el estado CODE-REVIEW` con criterios verificables. Sub-paso 4c.1 podrá extraerlos. No hay bloqueo.
- **Documento afectado**: ninguno
- **Acción requerida**: ninguna

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: La historia indica "Nuevo Paso 4c.1 (entre 4c y 4d)". En el SKILL.md actual, el sub-paso 4c es `### 4c. Derivar review-status` y el 4d es `### 4d. Bifurcación post-árbitro`. El nuevo sub-paso 4c.1 debe insertarse entre ellos: primero se calcula el status basado en agentes (4c), luego se ajusta con DoD (4c.1), luego se bifurca (4d). La bifurcación en 4d lee el `$REVIEW_STATUS` ya ajustado por 4c.1.
- **Documento afectado**: design.md (resuelto aquí), SKILL.md (a respetar en implementación)
- **Acción requerida**: Implementar en orden: 4c → 4c.1 → 4d. El 4d ya existente funciona correctamente porque lee `$REVIEW_STATUS` sin asumir cómo fue calculado.
