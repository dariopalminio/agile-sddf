---
type: release
id: EPIC-13
slug: quality-gates-con-dod-en-story-workflow
title: "Quality Gates con DoD en Story Workflow"
status: DEFINITION
substatus: IN-PROGRESS
parent: null
created: 2026-05-13
updated: 2026-05-13
---

# Release/Epic: Quality Gates con DoD en Story Workflow

## Descripción
Integra la lectura y validación del Definition of Done en los tres skills del pipeline de historias SDD. Cada skill leerá su sección correspondiente del archivo `$SPECS_BASE/policies/definition-of-done-story.md` (PLAN, IMPLEMENTING, CODE-REVIEW) y validará que los criterios de esa fase estén cumplidos antes de avanzar al siguiente estado. Convierte el DoD en un quality gate ejecutable dentro del flujo automatizado.

## Features
- [x] Mejorar skill-master con dynamic-template skill-master lee assets/skill-template.md en runtime al crear un skill nuevo. Cuando el skill-master genera el SKILL.md de un skill nuevo, SHALL leer `assets/skill-template.md` antes de escribir cualquier contenido. El modelo SHALL extraer las secciones del template dinámicamente y completarlas con la información del skill en lugar de generar estructura hardcodeada.
- [x] FEAT-068 - **DoD PLAN en story-analyze:** Leer sección PLAN del DoD y validar criterios antes de avanzar a READY-FOR-IMPLEMENT
- [x] FEAT-069 - **DoD IMPLEMENTING en story-implement:** Leer sección IMPLEMENTING del DoD y validar criterios antes de avanzar a READY-FOR-CODE-REVIEW
- [x] FEAT-070 - **DoD CODE-REVIEW en story-code-review:** Leer sección CODE-REVIEW del DoD y validar criterios, influyendo en `review-status`
- [x] FEAT-071 - **VERIFY con story-verify:** un SKILL que se encargue de la etapa de pruebas llamada VERIFY que implica implica la ejecución de los casos de prueba en el entorno de pruebas (pruebas automáticas, e2e, integración, regresión, etc.), la documentación de los resultados para su análisis y la identificación, detección y registro de los defectos. Lo ideal es que el SKIL sea o refleje el proceso genérico de pruebas que se quiera implementar, y que se pueda configurar para cada proyecto o equipo. Este SKILL se integraría al pipeline después de CODE-REVIEW y antes de ACCEPTANCE, como un quality gate adicional basado en la validación de los criterios de prueba definidos en el DoD.
- [x] FEAT-072 - **ACCEPTANCE en story-acceptance:** Validación final por un "humano" de criterios de aceptación definidos en el DoD, asegurando que la historia cumple con los requisitos funcionales y de calidad antes de marcarla INTEGRATION.
- [x] FEAT-073 - **Construir skill `security-audit` para auditoría automática condicional de seguridad**. El security-audit ejecuta un análisis estático de seguridad. El skill story-code-review debe invocar al security-audit para analizar los cambios de la story foco. Si el security-audit reporta hallazgos de seguridad con severidad HIGH o MEDIUM, story-code-review debe indicar el `review-status` del reporte a `needs-changes` y los hallazgos se documentan en fix-directives.md como parte de las directivas de corrección para el desarrollador.
- [x] FEAT-077 - **story-improve:** Mejora automática de historia desde reporte FINVEST.

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: story-analyze detecta criterio DoD PLAN no cumplido
**DADO** una historia con `status: PLANNING/IN-PROGRESS` y los artefactos story.md, design.md y tasks.md presentes  
**CUANDO** se ejecuta `/story-analyze` y existe `$SPECS_BASE/policies/definition-of-done-story.md` con sección PLAN  
**ENTONCES** analyze.md incluye una sección "Cumplimiento DoD — Fase PLAN" con el estado de cada criterio, y si hay ERRORs la historia no avanza a READY-FOR-IMPLEMENT

### Escenario 2: story-implement bloquea transición por DoD IMPLEMENTING no cumplido
**DADO** una historia en `status: IMPLEMENTING/IN-PROGRESS` con todas las tareas completadas  
**CUANDO** se ejecuta `/story-implement` y el DoD tiene criterios IMPLEMENTING no cumplidos con severidad ERROR  
**ENTONCES** implement-report.md incluye sección de validación DoD y story.md no avanza a READY-FOR-CODE-REVIEW/DONE

### Escenario 3: story-code-review cambia review-status por DoD CODE-REVIEW no cumplido
**DADO** una historia en `status: READY-FOR-CODE-REVIEW/DONE` donde los tres agentes revisores retornan `approved`  
**CUANDO** se ejecuta `/story-code-review` y hay criterios CODE-REVIEW del DoD no cumplidos de severidad HIGH o MEDIUM  
**ENTONCES** `review-status` se actualiza a `needs-changes` y los criterios DoD aparecen como hallazgos en fix-directives.md

## Requerimiento
El DoD debe leerse en runtime desde el archivo real (`$SPECS_BASE/policies/definition-of-done-story.md`); si el archivo o la sección cambia, el skill se adapta automáticamente sin modificar su código. Nunca hardcodear los criterios del DoD dentro de los skills.

## Impacto en Procesos Claves
- **story-analyze:** La salida del análisis incluye ahora una sección de cumplimiento DoD; el gate de READY-FOR-IMPLEMENT queda condicionado al resultado
- **story-implement:** El reporte de implementación incluye validación DoD; la transición a READY-FOR-CODE-REVIEW queda bloqueada si hay DoD-ERRORs
- **story-code-review:** El `review-status` puede cambiar de `approved` a `needs-changes` si los criterios DoD CODE-REVIEW no están cumplidos
- **definition-of-done-story.md:** Pasa de ser documentación pasiva a un artefacto activo del pipeline, leído y ejecutado por los tres skills

## Dependencias Críticas (si las hay)
- **El archivo `$SPECS_BASE/policies/definition-of-done-story.md` debe existir con secciones PLAN, IMPLEMENTING y CODE-REVIEW**  
  *Dueño:* Equipo del proyecto  
  *Fecha compromiso:* Disponible antes de ejecutar las historias de este release

## Riesgos
- **DoD con criterios ambiguos:** Los criterios del DoD podrían no tener evidencia objetiva verificable en los artefactos, generando falsos negativos – **Mitigación:** Los criterios del DoD deben redactarse de forma verificable (con referencia a artefactos concretos: story.md, design.md, tasks.md, código generado)
- **Sección del DoD ausente:** El archivo puede existir pero no tener la sección esperada (PLAN/IMPLEMENTING/CODE-REVIEW) – **Mitigación:** Degradación elegante — si la sección no existe, el skill emite un `⚠️` y continúa sin bloquear

**Criterios de éxito:**
- [ ] story-analyze genera sección "Cumplimiento DoD — Fase PLAN" en analyze.md con tabla de criterios ✓/❌
- [ ] story-implement no avanza a DONE si hay criterios DoD con severidad ERROR
- [ ] story-code-review cambia `review-status` a `needs-changes` cuando hay criterios DoD CODE-REVIEW no cumplidos de severidad HIGH/MEDIUM
- [ ] Los tres skills muestran `⚠️` y continúan sin bloquear si `definition-of-done-story.md` no existe o la sección no se encuentra

## Notas adicionales
El archivo de Definition of Done vive en `$SPECS_BASE/policies/definition-of-done-story.md` y es la fuente de verdad única para todos los quality gates del pipeline de historias. Cada skill lee su sección específica en runtime; cambiar el DoD no requiere modificar ningún skill.
