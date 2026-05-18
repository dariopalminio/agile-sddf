---
alwaysApply: false
type: story
id: FEAT-076
slug: FEAT-076-integrar-historia-multi-modelo-entrega
title: "story-integrate: Soporte multi-modelo de entrega (batch y continuous)"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: <nombre-del-release-padre>
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-074
  - FEAT-075
---
**FINVEST Score:** [pendiente — ejecutar `/story-evaluation`]
**FINVEST Decisión:** [pendiente]
---
<!-- Historia adicional resultante del split de FEAT-074 -->
[[FEAT-074-integrar-historia-batch-configurable]]

# 📖 Historia: story-integrate — Soporte multi-modelo de entrega

**Como** desarrollador o technical lead que trabaja con diferentes modelos de entrega en el mismo proyecto o en proyectos distintos  
**Quiero** que story-integrate determine automáticamente la rama objetivo correcta según el modelo de entrega configurado en el proyecto  
**Para** integrar historias hacia la rama adecuada sin reconfigurar el skill al cambiar entre proyectos o modelos de entrega

## ✅ Criterios de aceptación

### Escenario con datos – Rama objetivo según modelo de entrega configurado

```gherkin
Escenario: Integración según modelo de entrega configurado
  Dado que la historia "FEAT-042" está lista para integrar
    Y el modelo de entrega configurado en el proyecto es "<modelo>"
  Cuando ejecuto story-integrate para la historia "FEAT-042"
  Entonces la rama objetivo determinada es "<rama>"
    Y el reporte de integración registra el modelo de entrega utilizado "<modelo>"
Ejemplos:
  | modelo      | rama              |
  | batch       | release/v1.2.0    |
  | continuous  | main              |
```

### Escenario alternativo – Modelo de entrega no reconocido

```gherkin
Dado que el archivo de configuración del proyecto define el modelo "<modelo-desconocido>"
Cuando ejecuto story-integrate para la historia "FEAT-042"
Entonces el skill informa que el modelo de entrega "<modelo-desconocido>" no está configurado
  Y muestra los modelos disponibles en la configuración
  Y no ejecuta ninguna acción de integración
```

## ⚙️ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-creator:** Seguir lineamientos de skill-creator
Se debe seguir y respetar los lineamientos del skill `skill-creator` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-creator\assets\skill-template.md`.
* **Extensibilidad:** el mecanismo de resolución de rama admite nuevos modelos futuros (ej. `canary`, `feature-flag`) sin cambios en el skill, solo actualizando la configuración del proyecto
* **Configurabilidad:** la asociación modelo → rama se define exclusivamente en la configuración del proyecto, no en el skill

## 📎 Notas / contexto adicional

Historia adicional resultante del split de FEAT-074 (épica original).
Precondición de implementación: FEAT-074 (integración batch core) debe estar completa para extender con nuevos modelos.
Historias hermanas: FEAT-074 (batch configurable — core), FEAT-075 (modos de ejecución).
