---
alwaysApply: false
type: story
id: STORY-076
kind: feat
slug: STORY-076-integrar-historia-multi-modelo-entrega
title: "story-integrate: Soporte multi-modelo de entrega (batch y continuous)"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: null
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-074
  - STORY-075
---
<!-- Historia adicional resultante del split de STORY-074 -->
[[STORY-074-integrar-historia-batch-configurable]]

# ðŸ“– Historia: story-integrate â€” Soporte multi-modelo de entrega

**Como** desarrollador o technical lead que trabaja con diferentes modelos de entrega en el mismo proyecto o en proyectos distintos  
**Quiero** que story-integrate determine automÃ¡ticamente la rama objetivo correcta segÃºn el modelo de entrega configurado en el proyecto  
**Para** integrar historias hacia la rama adecuada sin reconfigurar el skill al cambiar entre proyectos o modelos de entrega

## âœ… Criterios de aceptaciÃ³n

### Escenario con datos â€“ Rama objetivo segÃºn modelo de entrega configurado

```gherkin
Escenario: IntegraciÃ³n segÃºn modelo de entrega configurado
  Dado que la historia "STORY-042" estÃ¡ lista para integrar
    Y el modelo de entrega configurado en el proyecto es "<modelo>"
  Cuando ejecuto story-integrate para la historia "STORY-042"
  Entonces la rama objetivo determinada es "<rama>"
    Y el reporte de integraciÃ³n registra el modelo de entrega utilizado "<modelo>"
Ejemplos:
  | modelo      | rama              |
  | batch       | release/v1.2.0    |
  | continuous  | main              |
```

### Escenario alternativo â€“ Modelo de entrega no reconocido

```gherkin
Dado que el archivo de configuraciÃ³n del proyecto define el modelo "<modelo-desconocido>"
Cuando ejecuto story-integrate para la historia "STORY-042"
Entonces el skill informa que el modelo de entrega "<modelo-desconocido>" no estÃ¡ configurado
  Y muestra los modelos disponibles en la configuraciÃ³n
  Y no ejecuta ninguna acciÃ³n de integraciÃ³n
```

## âš™ï¸ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.
* **Extensibilidad:** el mecanismo de resoluciÃ³n de rama admite nuevos modelos futuros (ej. `canary`, `feature-flag`) sin cambios en el skill, solo actualizando la configuraciÃ³n del proyecto
* **Configurabilidad:** la asociaciÃ³n modelo â†’ rama se define exclusivamente en la configuraciÃ³n del proyecto, no en el skill

## ðŸ“Ž Notas / contexto adicional

Historia adicional resultante del split de STORY-074 (Ã©pica original).
PrecondiciÃ³n de implementaciÃ³n: STORY-074 (integraciÃ³n batch core) debe estar completa para extender con nuevos modelos.
Historias hermanas: STORY-074 (batch configurable â€” core), STORY-075 (modos de ejecuciÃ³n).
