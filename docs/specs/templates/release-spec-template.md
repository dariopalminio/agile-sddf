---
alwaysApply: false
---
**Título**: [Nombre del release]
**Versión**: 1.0
**Estado**: [Doing | Ready]
**Fecha**: [Fecha de generación]
---

# Release/Epic: [Nombre de la Épica/Release] <!-- nombre obligatorio -->

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
[Requerimiento específico (como regla de negocio) relacionado con el release, si aplica]

## Impacto en Procesos Claves  <!-- sección opcional-->
- **[Proceso A]:** [Cómo se ve afectado este proceso por el release (o épica)]
- **[Proceso B]:** [Cómo se ve afectado este proceso por el release (o épica)]
- **[Proceso C]:** [Cómo se ve afectado este proceso por el release (o épica)]

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
