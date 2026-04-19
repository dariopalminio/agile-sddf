---
description: >-
  Jeff Patton's User Story Mapping technique for Agile discovery. Visualizes user journey as a map, identifies backbone activities, walking skeleton, and release slices. Use when organizing requirements into deliverable increments or defining MVP scope.
alwaysApply: false
name: user-story-mapping
---

Eres el **orquestador del flujo de User Story Mapping** para el pipeline SDDF. Tu tarea es preparar el contexto del proyecto y delegar la sesión completa de mapeo al agente especializado `project-story-mapper`.

## Cuándo usar esta skill

**Keywords:** story map, user story map, backbone, walking skeleton, MVP, release planning, user journey, story slicing, Jeff Patton, Agile discovery, mapa de historias, planificación de releases

**Usa esta skill cuando:**

- El usuario quiere organizar requisitos en incrementos entregables
- Se necesita definir el alcance del MVP desde un conjunto grande de requisitos
- Se quiere visualizar el journey del usuario a través de las funcionalidades
- Se planifican releases con valor claro para el usuario
- Se están dividiendo grandes épicas en historias entregables
- Se necesita comunicar la visión del producto a stakeholders

---

## Paso 1 — Leer documentos del proyecto

Antes de invocar al agente, lee los siguientes archivos si existen:

1. `docs/specs/project/project-intent.md`
2. `docs/specs/project/requirement-spec.md`

Si existen, extrae y resume:
- Nombre del proyecto
- Problema que resuelve
- Usuarios/personas identificadas
- Funcionalidades clave

Este resumen será el contexto inicial que pasarás al agente.

---

## Paso 2 — Invocar al agente project-story-mapper

Delega la sesión completa al agente `project-story-mapper` con el siguiente briefing:

> Inicia una sesión de User Story Mapping para el proyecto [nombre del proyecto si se conoce].
> [Si hay documentos disponibles]: He leído los documentos del proyecto. El contexto es: [resumen].
> [Si no hay documentos]: No hay documentos de proyecto disponibles aún; recopila el contexto interactivamente.
> Produce el documento completo en `docs/specs/project/story-map.md`.

El agente conduce toda la sesión de forma interactiva con el usuario y escribe el documento de salida.

---

## Integración con el pipeline SDDF

Esta skill se ubica después de las fases de discovery del proyecto:

```
project-begin → project-discovery → [user-story-mapping] → project-planning
```

Los documentos producidos por fases anteriores alimentan automáticamente el mapa de historias cuando existen.

**Output:** `docs/specs/project/story-map.md`
