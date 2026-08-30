---
alwaysApply: false
type: project
id: <PROJ-NN>
slug: < nombre-del-directorio-del-proyecto-project-plan >
title: "<primer # heading del documento>"
status: PLANNING
substatus: IN-PROGRESS
parent: null
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:                              
  - <nombre-del-directorio-del-proyecto-project o slug de project-plan relacionado (si existe)>
---
<!-- Referencias -->
[[nombre-del-directorio-del-proyecto-project o slug de project-plan relacionado (si existe)]]

## Objetivo

<!-- Una línea que resume qué buscamos lograr con este proyecto. Tómalo directamente de project-intent.md. -->

---

## Backlog de Historias

<!-- Lista priorizada de features atómicas. El orden define la prioridad (arriba = mayor prioridad).
     Cada feature es una unidad de valor para el usuario o negocio, independientemente desarrollable y testeable.
     No incluir tareas técnicas internas.
     Criterios de priorización: valor de negocio (alto→bajo), dependencias (bloqueantes primero), riesgo técnico.
     Formato de cada línea:
       - [ ] **STORY-NNN: Nombre** — Descripción concisa en una oración. _(deps: STORY-XXX o —)_ -->

- [ ] **STORY-001: [Nombre]** — [Descripción en una oración.] _(deps: —)_
- [ ] **STORY-002: [Nombre]** — [Descripción en una oración.] _(deps: STORY-001)_
- [ ] **STORY-003: [Nombre]** — [Descripción en una oración.] _(deps: —)_

---

## Propuesta de Épicas

<!-- Agrupa las features del backlog en épicas incrementales. Cada épica debe ser desplegable y testeable.
     La Épica 1 SIEMPRE es el MVP: mínimo conjunto de features que resuelve el problema central
     identificado en project-intent.md y puede ser entregado a usuarios reales para obtener feedback.
     Las épicas posteriores agregan valor incremental sobre el MVP. -->

### Épica Walking Skeleton: MVP

**Objetivo:** [Qué valor entrega esta épica — qué problema central resuelve.]

- [ ] STORY-001 - **[Nombre feature 1]:** [Breve descripción de la feature]
- [ ] STORY-002 - **[Nombre feature 2]:** [Breve descripción de la feature]
- [ ] STORY-003 - **[Nombre feature 3]:** [Breve descripción de la feature]

**Criterios de éxito:**
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]

---

### Épica 1: [Nombre descriptivo]

**Objetivo:** [Qué valor incremental agrega sobre el Walking Skeleton (MVP).]

- [ ] STORY-003 - **[Nombre feature 3]:** [Breve descripción de la feature]

**Criterios de éxito:**
- [ ] [Criterio medible 1]

---

<!-- Agrega más épicas (Épica 2, Épica 3, Futuro, etc.) si el proyecto lo justifica. Mantén el documento minimalista:
     sin descripciones redundantes, sin texto innecesario, solo backlog y épicas. -->

## Resumen

<!-- Tabla de métricas derivada del backlog y las épicas. Calcula los valores reales. -->

| Métrica | Valor |
|---------|-------|
| Total Features | N |
| Features en MVP | N |
| Épicas planificadas | N |
