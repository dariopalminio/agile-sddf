---
alwaysApply: false   # escritor: epic-creation · epic-from-project-plan (valor fijo)
type: epic   # escritor: epic-creation · epic-from-project-plan (valor fijo)
id: <EPIC-NN>   # escritor: epic-creation · epic-from-project-plan
slug: <nombre-del-directorio-de-la-epica>   # escritor: epic-creation · epic-from-project-plan
title: "<primer # heading del documento>"   # escritor: epic-creation · epic-from-project-plan
status: <ESTADO_INICIAL>   # escritor: epic-creation · epic-from-project-plan (inicial; ningún skill lo transiciona hoy)
substatus: IN-PROGRESS   # escritor: epic-creation · epic-from-project-plan (inicial; ningún skill lo transiciona hoy)
parent: null   # escritor: epic-creation · epic-from-project-plan
created: <YYYY-MM-DD>   # escritor: epic-creation · epic-from-project-plan
updated: <YYYY-MM-DD>   # escritor: epic-creation · epic-from-project-plan (inicial) · todo skill que edite el archivo (epic-generate-stories, epic-generate-all-stories, story-implement, story-implement-tasks)
related:   # escritor: epic-creation · epic-from-project-plan
  - <slug de project relacionado (si existe)> <!-- Colocar referencias solo si existe proyecto relacionado -->
---
<!-- escritor del cuerpo: epic-creation · epic-from-project-plan — salvo anotación distinta junto a la sección -->
<!-- Referencias: colocar referencias solo si existe proyecto relacionado -->
[[<slug de project relacionado (si existe)>]]

# Épica: [Nombre de la Épica] <!-- nombre obligatorio -->

## Descripción <!-- sección obligatoria-->
[Explica el valor de negocio, qué problema resuelve y el contexto necesario. Máximo 3-4 líneas.]

## Historias <!-- sección obligatoria · escritor: epic-creation · epic-from-project-plan (inicial) · epic-generate-stories · epic-generate-all-stories (asignan STORY-NNN a cada línea) · story-implement · story-implement-tasks (marcan [x] al completar) -->
- [ ] **[Nombre feature 1]:** [Breve descripción de la feature]
- [ ] **[Nombre feature 2]:** [Breve descripción de la feature]
- [ ] **[Nombre feature 3]:** [Breve descripción de la feature]

## Flujos Críticos / Smoke Tests <!-- sección obligatoria, al menos un escenario -->
*Si alguno de estos falla,  se debe detener el despliegue (o  se debe hacer rollback automático).*

### Escenario 1: [Nombre descriptivo del escenario]
**DADO** [contexto inicial / precondición]  
**CUANDO** [acción que desencadena el flujo]  
**ENTONCES** [resultado esperado que determina éxito o fracaso crítico]

### Escenario 2: [Nombre descriptivo del escenario]
**DADO** [contexto inicial]  
**CUANDO** [acción]  
**ENTONCES** [resultado esperado]

### Escenario 3: [Nombre descriptivo del escenario]
**DADO** [contexto inicial]  
**CUANDO** [acción]  
**ENTONCES** [resultado esperado]

## Requerimiento  <!-- sección opcional-->
[Requerimiento específico (como regla de negocio) relacionado con la épica, si aplica]

## Impacto en Procesos Claves  <!-- sección opcional-->
- **[Proceso A]:** [Cómo se ve afectado este proceso por la épica]
- **[Proceso B]:** [Cómo se ve afectado este proceso por la épica]
- **[Proceso C]:** [Cómo se ve afectado este proceso por la épica]

## Dependencias Críticas (si las hay) <!-- sección opcional-->
- **[Descripción de la dependencia]**  
  *Dueño:* [Responsable dueño de la dependencia]  
  *Fecha compromiso:* [fecha]

  ## Riesgos (opcional) <!-- sección opcional-->
- **[Riesgo 1]:** [Descripción] – **Mitigación:** [qué hacer para evitarlo o reducir su impacto]
- **[Riesgo 2]:** [Descripción] – **Mitigación:** [acción propuesta]

**Criterios de éxito:** <!-- sección opcional-->
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]

## Notas adicionales  <!-- sección opcional-->
[Cualquier otro comentario relevante para el equipo de desarrollo o stakeholders]
