---
alwaysApply: false   # escritor: epic-creation · epic-from-project-plan (valor fijo)
type: epic           # escritor: epic-creation · epic-from-project-plan (valor fijo)
id: <EPIC-NN>        # escritor: epic-creation · epic-from-project-plan
slug: <nombre-del-directorio-de-la-epica>
title: "<primer # heading del documento>"
status: DEFINE       # escritor: epic-creation · epic-from-project-plan (inicial)
substatus: IN-PROGRESS
parent: null
deliveryModel: batch # escritor: epic-creation · epic-from-project-plan
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
children: []         # escritor: epic-creation · epic-generate-stories (añade STORY-NNN)
related: []
---

# Épica: [Nombre]

## Alcance
<!-- Output-oriented: qué entrega esta épica desde el punto de vista de implementación. 
     Sin justificación de negocio. -->

[Qué se construye. 2-4 líneas.]

## Historias
<!-- Documento vivo: se añaden/editan a medida que se refinan las historias.
     Estados de vinculación:
     · [ ] [Nombre]: [desc]        → planificada, aún sin ID
     · [ ] **STORY-NNN** — [Nombre]: [desc]  → creada, con ID
     · [x] **STORY-NNN** — [Nombre]: [desc]  → completada -->

- [ ] [Nombre feature 1]: [descripción breve]
- [ ] [Nombre feature 2]: [descripción breve]
- [ ] [Nombre feature 3]: [descripción breve]

## Criterios de salida
<!-- Cuándo la épica está terminada desde el punto de vista de implementación. 
     No confundir con criterios de éxito de negocio. -->

- [ ] [Criterio técnico verificable 1]
- [ ] [Criterio técnico verificable 2]

## Smoke tests
<!-- Si alguno falla, se detiene el despliegue o se hace rollback automático. 
     Numeración: SMOKE-N. No renumerar al insertar/eliminar. -->

### SMOKE-[N] — [Título descriptivo]

```gherkin
Escenario: [Nombre descriptivo]
  Dado [contexto inicial]
  Cuando [acción]
  Entonces [resultado esperado]
```


