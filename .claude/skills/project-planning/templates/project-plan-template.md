---
alwaysApply: false
---
**Nombre del Sistema**: [Nombre del Proyecto]
**Título del Documento**: Project Plan
**Versión**: [versión]
**Estado**: [Doing | Ready]
**Fecha**: [Fecha]
**Generado por**: [agente]

---

## Objetivo

<!-- Una línea que resume qué buscamos lograr con este proyecto. Tómalo directamente de project-intent.md. -->

---

## Backlog de Features

<!-- Lista priorizada de features atómicas. El orden define la prioridad (arriba = mayor prioridad).
     Cada feature es una unidad de valor para el usuario o negocio, independientemente desarrollable y testeable.
     No incluir tareas técnicas internas.
     Criterios de priorización: valor de negocio (alto→bajo), dependencias (bloqueantes primero), riesgo técnico.
     Formato de cada línea:
       - [ ] **FEAT-NNN: Nombre** — Descripción concisa en una oración. _(deps: FEAT-XXX o —)_ -->

- [ ] **FEAT-001: [Nombre]** — [Descripción en una oración.] _(deps: —)_
- [ ] **FEAT-002: [Nombre]** — [Descripción en una oración.] _(deps: FEAT-001)_
- [ ] **FEAT-003: [Nombre]** — [Descripción en una oración.] _(deps: —)_

---

## Propuesta de Releases

<!-- Agrupa las features del backlog en releases incrementales. Cada release debe ser desplegable y testeable.
     Release 1 SIEMPRE es el MVP: mínimo conjunto de features que resuelve el problema central
     identificado en project-intent.md y puede ser entregado a usuarios reales para obtener feedback.
     Releases posteriores agregan valor incremental sobre el MVP. -->

### Release Walking Skeleton: MVP

**Objetivo:** [Qué valor entrega este release — qué problema central resuelve.]

- [ ] FEAT-001 - **[Nombre feature 1]:** [Breve descripción de la feature]
- [ ] FEAT-002 - **[Nombre feature 2]:** [Breve descripción de la feature]
- [ ] FEAT-003 - **[Nombre feature 3]:** [Breve descripción de la feature]

**Criterios de éxito:**
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]

---

### Release 1: [Nombre descriptivo]

**Objetivo:** [Qué valor incremental agrega sobre el Walking Skeleton (MVP).]

- [ ] FEAT-003 - **[Nombre feature 3]:** [Breve descripción de la feature]

**Criterios de éxito:**
- [ ] [Criterio medible 1]

---

<!-- Agrega más releases (Release 2, Release 3, Futuro, etc.) si el proyecto lo justifica. Mantén el documento minimalista:
     sin descripciones redundantes, sin texto innecesario, solo backlog y releases. -->

## Resumen

<!-- Tabla de métricas derivada del backlog y los releases. Calcula los valores reales. -->

| Métrica | Valor |
|---------|-------|
| Total Features | N |
| Features en MVP | N |
| Releases planificados | N |
