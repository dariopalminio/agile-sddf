---
alwaysApply: false
type: story
id: STORY-074
kind: feat
slug: STORY-074-integrar-historia-batch-configurable
title: "story-integrate: IntegraciÃ³n batch configurable de historias"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: null
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-075
  - STORY-076
---
<!-- Historias resultante del split de STORY-074 -->
[[STORY-075-integrar-historia-modo-manual-dryrun]]
[[STORY-076-integrar-historia-multi-modelo-entrega]]

# ðŸ“– Historia: story-integrate â€” IntegraciÃ³n batch configurable de historias

**Como** desarrollador o technical lead que gestiona el pipeline de integraciÃ³n de historias  
**Quiero** integrar una historia hacia la rama de release correspondiente leyendo los comandos desde la configuraciÃ³n del proyecto, sin ejecutar comandos Git codificados en el skill  
**Para** cambiar el esquema de branching del proyecto sin modificar el skill ni interrumpir el flujo de integraciÃ³n

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ IntegraciÃ³n batch exitosa con versiÃ³n desde archivo

```gherkin
Dado que existe una historia con id "STORY-042" en estado "READY-FOR-INTEGRATE"
  Y el modelo de entrega configurado es "batch"
  Y el archivo ".release-version" contiene "v1.2.0"
  Y existe un archivo de configuraciÃ³n de integraciÃ³n con los comandos para el modelo "batch"
  Y no existe un PR abierto desde "feat/STORY-042"
Cuando ejecuto `/story-integrate --story-id STORY-042`
Entonces el skill lee la versiÃ³n del release desde ".release-version"
  Y determina la rama objetivo "release/v1.2.0" segÃºn la configuraciÃ³n
  Y crea un PR desde "feat/STORY-042" hacia "release/v1.2.0"
  Y fusiona el PR exitosamente
  Y actualiza story.md con los metadatos de integraciÃ³n (rama objetivo, nÃºmero de PR, commit hash, fecha)
  Y el status de la historia pasa a "INTEGRATED"
```

### Escenario alternativo â€“ PR ya existe (idempotencia)

```gherkin
Dado que existe un PR abierto desde "feat/STORY-042" hacia "release/v1.2.0"
  Y el modelo de entrega configurado es "batch"
Cuando ejecuto `/story-integrate --story-id STORY-042`
Entonces el skill detecta el PR existente sin crear uno nuevo
  Y muestra el nÃºmero y URL del PR existente
  Y continÃºa con el flujo de fusiÃ³n sobre el PR existente
  Y el status de la historia pasa a "INTEGRATED"
```

### Requerimiento: ConfiguraciÃ³n externa de comandos de integraciÃ³n

El skill no debe contener comandos Git hardcodeados. Debe leer un archivo de configuraciÃ³n
del proyecto (por ejemplo `integration-config.yaml` o la secciÃ³n `scripts` de `package.json`)
que defina quÃ© comandos ejecutar para el modelo "batch". Si la configuraciÃ³n no existe, el
skill muestra un error orientativo y detiene la ejecuciÃ³n.

## âš™ï¸ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.
* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.
* **Seguridad:** el skill solo ejecuta comandos definidos en archivos de configuraciÃ³n versionados por el equipo; no permite inyecciÃ³n de comandos desde parÃ¡metros externos
* **Idempotencia:** si ya existe un PR abierto, no se crea otro; la detecciÃ³n compara rama origen/destino antes de crear
* **Configurabilidad:** soporta cualquier esquema de branching mediante configuraciÃ³n externa sin cambios en el skill

## ðŸ“Ž Notas / contexto adicional

La versiÃ³n del release se resuelve en este orden de prioridad:
1. Archivo `.release-version` en la raÃ­z del proyecto
2. ConfiguraciÃ³n en el archivo de integraciÃ³n del proyecto

Historia core resultante del split de STORY-074 (Ã©pica original).
Historias hermanas: STORY-075 (modos de ejecuciÃ³n), STORY-076 (multi-modelo de entrega).
