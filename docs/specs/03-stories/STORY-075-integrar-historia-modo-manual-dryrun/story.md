---
alwaysApply: false
type: story
id: STORY-075
kind: feat
slug: STORY-075-integrar-historia-modo-manual-dryrun
title: "story-integrate: Modos de ejecuciÃ³n manual y dry-run"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: null
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-074
  - STORY-076
---
<!-- Historia adicional resultante del split de STORY-074 -->
[[STORY-074-integrar-historia-batch-configurable]]

# ðŸ“– Historia: story-integrate â€” Modos de ejecuciÃ³n manual y dry-run

**Como** desarrollador que necesita controlar o verificar el proceso de integraciÃ³n antes de ejecutarlo  
**Quiero** ejecutar story-integrate en modo manual (con guÃ­a paso a paso y confirmaciÃ³n explÃ­cita) o en modo simulaciÃ³n sin efectos reales  
**Para** tener control total sobre cada paso de la integraciÃ³n o verificar el comportamiento del skill sin riesgo de cambios irreversibles en el repositorio

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Modo manual con guÃ­a interactiva

```gherkin
Dado que ejecuto story-integrate con el flag de modo manual para la historia "STORY-042"
Cuando el skill inicia en modo manual
Entonces presenta al usuario las opciones de modelo de entrega disponibles
  Y solicita confirmaciÃ³n de la versiÃ³n del release antes de continuar
  Y muestra la rama objetivo calculada antes de ejecutar cualquier acciÃ³n
  Y espera confirmaciÃ³n explÃ­cita del usuario antes de crear el PR
  Y el usuario puede cancelar en cualquier punto sin que se produzcan cambios en el repositorio
```

### Escenario alternativo â€“ SimulaciÃ³n en modo dry-run

```gherkin
Dado que ejecuto story-integrate con el flag de simulaciÃ³n para la historia "STORY-042"
Cuando el skill procesa la integraciÃ³n en modo simulaciÃ³n
Entonces muestra cada paso que ejecutarÃ­a (rama origen, rama destino, acciÃ³n a realizar)
  Y no crea ni fusiona ningÃºn PR
  Y no modifica story.md
  Y finaliza indicando que la simulaciÃ³n completÃ³ sin efectos reales
```

## âš™ï¸ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.
* **UX:** en modo manual el skill muestra el progreso paso a paso con indicadores visuales del estado de cada acciÃ³n; en modo dry-run genera un listado de pasos planificados. La secuencia de confirmaciones en el escenario principal (opciones â†’ versiÃ³n â†’ rama â†’ PR â†’ cancelaciÃ³n) es un requerimiento UX deliberado para garantizar informaciÃ³n progresiva antes de cada decisiÃ³n irreversible; el equipo puede negociar la granularidad de los pasos pero no omitirlos.
* **Seguridad:** en modo manual el usuario aprueba explÃ­citamente cada acciÃ³n irreversible (crear PR, fusionar, eliminar rama) antes de ejecutarla

## ðŸ“Ž Notas / contexto adicional

Historia adicional resultante del split de STORY-074 (Ã©pica original).

**Contrato mÃ­nimo de integraciÃ³n (STORY-074):** STORY-075 puede desarrollarse y probarse independientemente usando un stub del contrato que STORY-074 expondrÃ¡. El flujo de integraciÃ³n base comprende los pasos: `resolver-versiÃ³n â†’ resolver-rama â†’ ejecutar-git â†’ crear-pr â†’ modificar-story`. El modo manual intercepta en los pasos `ejecutar-git` y `crear-pr` para solicitar confirmaciÃ³n explÃ­cita; el modo dry-run simula todos los pasos sin ejecutar ninguno. Contrato mÃ­nimo esperado:

```typescript
ejecutarIntegraciÃ³n(historyId: string, opciones: { dryRun?: boolean }): Promise<IntegrationPlan>
// IntegrationPlan: { pasos: { tipo: string; descripcion: string; ejecutado: boolean }[]; completado: boolean }
```

Con este contrato definido, STORY-075 puede implementarse con un stub de `ejecutarIntegraciÃ³n` que retorne un `IntegrationPlan` predefinido, sin depender de la implementaciÃ³n real de STORY-074. Una vez que STORY-074 publique su contrato de ejecuciÃ³n, actualizar esta referencia para afinar la estimaciÃ³n.

Historias hermanas: STORY-074 (batch configurable â€” core), STORY-076 (multi-modelo de entrega).
