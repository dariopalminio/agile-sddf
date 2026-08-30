---
alwaysApply: false
type: story
id: STORY-074
kind: feat
slug: STORY-074-integrar-historia-batch-configurable
title: "story-integrate: Integración batch configurable de historias"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: null
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-075
  - STORY-076
---
**FINVEST Score:** [pendiente — ejecutar `/story-evaluation`]
**FINVEST Decisión:** [pendiente]
---
<!-- Historias resultante del split de STORY-074 -->
[[STORY-075-integrar-historia-modo-manual-dryrun]]
[[STORY-076-integrar-historia-multi-modelo-entrega]]

# 📖 Historia: story-integrate — Integración batch configurable de historias

**Como** desarrollador o technical lead que gestiona el pipeline de integración de historias  
**Quiero** integrar una historia hacia la rama de release correspondiente leyendo los comandos desde la configuración del proyecto, sin ejecutar comandos Git codificados en el skill  
**Para** cambiar el esquema de branching del proyecto sin modificar el skill ni interrumpir el flujo de integración

## ✅ Criterios de aceptación

### Escenario principal – Integración batch exitosa con versión desde archivo

```gherkin
Dado que existe una historia con id "STORY-042" en estado "READY-FOR-INTEGRATE"
  Y el modelo de entrega configurado es "batch"
  Y el archivo ".release-version" contiene "v1.2.0"
  Y existe un archivo de configuración de integración con los comandos para el modelo "batch"
  Y no existe un PR abierto desde "feat/STORY-042"
Cuando ejecuto `/story-integrate --story-id STORY-042`
Entonces el skill lee la versión del release desde ".release-version"
  Y determina la rama objetivo "release/v1.2.0" según la configuración
  Y crea un PR desde "feat/STORY-042" hacia "release/v1.2.0"
  Y fusiona el PR exitosamente
  Y actualiza story.md con los metadatos de integración (rama objetivo, número de PR, commit hash, fecha)
  Y el status de la historia pasa a "INTEGRATED"
```

### Escenario alternativo – PR ya existe (idempotencia)

```gherkin
Dado que existe un PR abierto desde "feat/STORY-042" hacia "release/v1.2.0"
  Y el modelo de entrega configurado es "batch"
Cuando ejecuto `/story-integrate --story-id STORY-042`
Entonces el skill detecta el PR existente sin crear uno nuevo
  Y muestra el número y URL del PR existente
  Y continúa con el flujo de fusión sobre el PR existente
  Y el status de la historia pasa a "INTEGRATED"
```

### Requerimiento: Configuración externa de comandos de integración

El skill no debe contener comandos Git hardcodeados. Debe leer un archivo de configuración
del proyecto (por ejemplo `integration-config.yaml` o la sección `scripts` de `package.json`)
que defina qué comandos ejecutar para el modelo "batch". Si la configuración no existe, el
skill muestra un error orientativo y detiene la ejecución.

## ⚙️ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.
* **Seguridad:** el skill solo ejecuta comandos definidos en archivos de configuración versionados por el equipo; no permite inyección de comandos desde parámetros externos
* **Idempotencia:** si ya existe un PR abierto, no se crea otro; la detección compara rama origen/destino antes de crear
* **Configurabilidad:** soporta cualquier esquema de branching mediante configuración externa sin cambios en el skill

## 📎 Notas / contexto adicional

La versión del release se resuelve en este orden de prioridad:
1. Archivo `.release-version` en la raíz del proyecto
2. Configuración en el archivo de integración del proyecto

Historia core resultante del split de STORY-074 (épica original).
Historias hermanas: STORY-075 (modos de ejecución), STORY-076 (multi-modelo de entrega).
