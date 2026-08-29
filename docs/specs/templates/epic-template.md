---
alwaysApply: false
type: epic
id: <EPIC-NN>
slug: <nombre-del-directorio-de-la-epica>
title: "<primer # heading del documento>"
status: <ESTADO_INICIAL>
substatus: IN‑PROGRESS
parent: null
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <slug de project relacionado (si existe)> <!-- Colocar referencias solo si existe proyecto relacionado -->
---
<!-- Referencias: colocar referencias solo si existe proyecto relacionado -->
[[<slug de project relacionado (si existe)>]]

# Épica: [Nombre de la Épica] <!-- nombre obligatorio -->

## Descripción <!-- sección obligatoria-->
[Explica el valor de negocio, qué problema resuelve y el contexto necesario. Máximo 3-4 líneas.]

## Features <!-- sección obligatoria-->
- [ ] FEAT-[INDEX] - **[Nombre feature 1]:** [Breve descripción de la feature]
- [ ] FEAT-[INDEX] - **[Nombre feature 2]:** [Breve descripción de la feature]
- [ ] FEAT-[INDEX] - **[Nombre feature 3]:** [Breve descripción de la feature]

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
