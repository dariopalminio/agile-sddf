---
alwaysApply: false
type: story
id: FEAT-075
slug: FEAT-075-integrar-historia-modo-manual-dryrun
title: "story-integrate: Modos de ejecución manual y dry-run"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: <nombre-del-release-padre>
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-074
  - FEAT-076
---
**FINVEST Score:** [pendiente — ejecutar `/story-evaluation`]
**FINVEST Decisión:** [pendiente]
---
<!-- Historia adicional resultante del split de FEAT-074 -->
[[FEAT-074-integrar-historia-batch-configurable]]

# 📖 Historia: story-integrate — Modos de ejecución manual y dry-run

**Como** desarrollador que necesita controlar o verificar el proceso de integración antes de ejecutarlo  
**Quiero** ejecutar story-integrate en modo manual (con guía paso a paso y confirmación explícita) o en modo simulación sin efectos reales  
**Para** tener control total sobre cada paso de la integración o verificar el comportamiento del skill sin riesgo de cambios irreversibles en el repositorio

## ✅ Criterios de aceptación

### Escenario principal – Modo manual con guía interactiva

```gherkin
Dado que ejecuto story-integrate con el flag de modo manual para la historia "FEAT-042"
Cuando el skill inicia en modo manual
Entonces presenta al usuario las opciones de modelo de entrega disponibles
  Y solicita confirmación de la versión del release antes de continuar
  Y muestra la rama objetivo calculada antes de ejecutar cualquier acción
  Y espera confirmación explícita del usuario antes de crear el PR
  Y el usuario puede cancelar en cualquier punto sin que se produzcan cambios en el repositorio
```

### Escenario alternativo – Simulación en modo dry-run

```gherkin
Dado que ejecuto story-integrate con el flag de simulación para la historia "FEAT-042"
Cuando el skill procesa la integración en modo simulación
Entonces muestra cada paso que ejecutaría (rama origen, rama destino, acción a realizar)
  Y no crea ni fusiona ningún PR
  Y no modifica story.md
  Y finaliza indicando que la simulación completó sin efectos reales
```

## ⚙️ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-creator:** Seguir lineamientos de skill-creator
Se debe seguir y respetar los lineamientos del skill `skill-creator` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-creator\assets\skill-template.md`.
* **UX:** en modo manual el skill muestra el progreso paso a paso con indicadores visuales del estado de cada acción; en modo dry-run genera un listado de pasos planificados. La secuencia de confirmaciones en el escenario principal (opciones → versión → rama → PR → cancelación) es un requerimiento UX deliberado para garantizar información progresiva antes de cada decisión irreversible; el equipo puede negociar la granularidad de los pasos pero no omitirlos.
* **Seguridad:** en modo manual el usuario aprueba explícitamente cada acción irreversible (crear PR, fusionar, eliminar rama) antes de ejecutarla

## 📎 Notas / contexto adicional

Historia adicional resultante del split de FEAT-074 (épica original).

**Contrato mínimo de integración (FEAT-074):** FEAT-075 puede desarrollarse y probarse independientemente usando un stub del contrato que FEAT-074 expondrá. El flujo de integración base comprende los pasos: `resolver-versión → resolver-rama → ejecutar-git → crear-pr → modificar-story`. El modo manual intercepta en los pasos `ejecutar-git` y `crear-pr` para solicitar confirmación explícita; el modo dry-run simula todos los pasos sin ejecutar ninguno. Contrato mínimo esperado:

```typescript
ejecutarIntegración(historyId: string, opciones: { dryRun?: boolean }): Promise<IntegrationPlan>
// IntegrationPlan: { pasos: { tipo: string; descripcion: string; ejecutado: boolean }[]; completado: boolean }
```

Con este contrato definido, FEAT-075 puede implementarse con un stub de `ejecutarIntegración` que retorne un `IntegrationPlan` predefinido, sin depender de la implementación real de FEAT-074. Una vez que FEAT-074 publique su contrato de ejecución, actualizar esta referencia para afinar la estimación.

Historias hermanas: FEAT-074 (batch configurable — core), FEAT-076 (multi-modelo de entrega).
