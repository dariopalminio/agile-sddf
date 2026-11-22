---
type: epic
id: <EPIC-NN>
slug: <nombre-del-directorio-de-la-epica>
title: "<título de la épica>"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related: []
---

# Épica: [Nombre]

## Alcance <!-- sección obligatoria · clave: alcance · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Output-oriented: qué se construye (2-4 líneas). El valor de negocio vive en product/vision.md o requirements/. -->

## Historias <!-- sección obligatoria · clave: historias · escritor: epic-creation (F1) · epic-from-project-plan (F1/F2/F3) · epic-generate-stories · epic-generate-all-stories (F1 → F2) · story-implement · story-implement-tasks (F2 → F3) · memory-system (migrate --from=epic-template-v1) -->
<!-- Planificada: `- [Nombre]: [desc]` · Creada: `- [ ] **STORY-NNN** — [Nombre]: [desc]` · Completada: `- [x] **STORY-NNN** — [Nombre]: [desc]`.
     epic-generate-stories asigna el ID (planificada → creada); story-implement marca [x] (creada → completada). -->
- [Nombre feature 1]: [descripción breve]
- [Nombre feature 2]: [descripción breve]

## Criterios de salida <!-- sección obligatoria · clave: criterios-salida · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Criterios técnicos verificables de "épica terminada". No son criterios de éxito de negocio. -->
- [ ] [Criterio técnico verificable]

## Smoke tests <!-- sección obligatoria · clave: smoke-tests · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Si uno falla: detener el despliegue o rollback. IDs SMOKE-N estables: no renumerar al insertar o eliminar. Con un único escenario la numeración es opcional. -->
### SMOKE-1 — [Nombre descriptivo]
```gherkin
Escenario: [Nombre descriptivo]
  Dado [contexto inicial]
  Cuando [acción]
  Entonces [resultado esperado]
```

## Notas <!-- sección obligatoria · contenido opcional · clave: notas · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Opcional: decisiones emergentes, cambios de alcance y acuerdos, a medida que aparezcan. -->
