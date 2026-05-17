---
alwaysApply: false
type: story
id: FEAT-074
slug: FEAT-074-integrar-historia-rama-modelo-configurable
title: "story-integrate: Integración multi-estrategia configurable de historias"
status: SPECIFYING
substatus: IN-PROGRESS
parent: <nombre-del-release-padre>
created: 2026-05-17
updated: 2026-05-17
related: []
---
**FINVEST Score:** [pendiente — ejecutar `/story-evaluation`]
**FINVEST Decisión:** [pendiente]
---

# 📖 Historia: story-integrate — Integración multi-estrategia configurable de historias

**Como** desarrollador o technical lead que gestiona el pipeline de integración de historias  
**Quiero** un skill que ejecute la integración de una historia hacia la rama correspondiente según el modelo de entrega y el esquema de branching definidos en la configuración del proyecto, sin codificar comandos Git dentro del skill  
**Para** estandarizar y facilitar el proceso de integración del pipeline de historias, permitiendo que el equipo cambie su flujo de branching sin modificar el skill

## ✅ Criterios de aceptación

### Escenario principal – Integración batch exitosa con versión desde archivo

```gherkin
Dado que existe una historia con id "FEAT-042" en estado "READY-FOR-INTEGRATE"
  Y el modelo de entrega configurado es "batch"
  Y el archivo ".release-version" contiene "v1.2.0"
  Y existe un archivo de configuración de integración con los comandos para el modelo "batch"
  Y no existe un PR abierto desde "feat/FEAT-042"
Cuando ejecuto `/story-integrate --story-id FEAT-042`
Entonces el skill lee la versión del release desde ".release-version"
  Y determina la rama objetivo "release/v1.2.0" según la configuración
  Y crea un PR desde "feat/FEAT-042" hacia "release/v1.2.0"
  Y fusiona el PR exitosamente
  Y actualiza story.md con los metadatos de integración (rama objetivo, número de PR, commit hash, fecha)
  Y el status de la historia pasa a "INTEGRATED"
```

### Escenario alternativo – PR ya existe (idempotencia)

```gherkin
Dado que existe un PR abierto desde "feat/FEAT-042" hacia "release/v1.2.0"
  Y el modelo de entrega configurado es "batch"
Cuando ejecuto `/story-integrate --story-id FEAT-042`
Entonces el skill detecta el PR existente usando `gh pr list`
  Y no crea un nuevo PR duplicado
  Y muestra el número y URL del PR existente
  Y continúa con el flujo de fusión sobre el PR existente
```

### Escenario alternativo – Modo manual con guía interactiva

```gherkin
Dado que ejecuto `/story-integrate --story-id FEAT-042 --mode manual`
Cuando el skill inicia en modo manual
Entonces presenta al usuario las opciones de modelo de entrega disponibles
  Y solicita confirmación de la versión del release (o permite ingresarla manualmente)
  Y muestra la rama objetivo calculada antes de ejecutar
  Y espera confirmación explícita del usuario antes de crear el PR
  Y el usuario puede cancelar en cualquier punto sin efectos reales
```

### Escenario alternativo – Simulación en modo dry-run

```gherkin
Dado que ejecuto `/story-integrate --story-id FEAT-042 --dry-run`
Cuando el skill procesa la integración en modo simulación
Entonces muestra cada paso que ejecutaría (rama origen, rama destino, comandos a ejecutar)
  Y no crea ni fusiona ningún PR
  Y no modifica story.md
  Y finaliza con el mensaje "Simulación completada — sin efectos reales"
```

### Escenario con datos – Multi-modelo de entrega

```gherkin
Escenario: Integración según modelo de entrega configurado
  Dado que la historia "FEAT-042" está lista para integrar
    Y el modelo de entrega es "<modelo>"
  Cuando ejecuto `/story-integrate --story-id FEAT-042`
  Entonces la rama objetivo es "<rama>"
    Y el reporte de integración incluye el modelo usado "<modelo>"
Ejemplos:
  | modelo      | rama              |
  | batch       | release/v1.2.0    |
  | continuous  | main              |
```

### Requerimiento: Configuración externa de comandos de integración

El skill no debe contener comandos Git hardcodeados. Debe leer una configuración del proyecto
(por ejemplo `integration-config.yaml` o la sección `scripts` de `package.json`) que defina
qué comandos ejecutar para cada modelo de entrega y esquema de branching. Si la configuración
no existe, el skill muestra un error orientativo y detiene la ejecución.

## ⚙️ Criterios no funcionales

* **Seguridad:** el skill solo ejecuta comandos definidos en archivos de configuración versionados por el equipo; no permite inyección de comandos desde parámetros externos
* **Idempotencia:** si ya existe un PR abierto, no se crea otro; la detección se realiza con `gh pr list --head <rama>`
* **Configurabilidad:** soporta cualquier esquema de branching (sddf, gitflow, github flow, gitlab flow) mediante configuración externa sin cambios en el skill
* **UX:** en modo automático genera un reporte `integration-report.md` con el resultado; en modo manual muestra progreso paso a paso con emojis indicativos
* **Testeable:** el flag `--dry-run` permite verificar el comportamiento sin efectos reales en el repositorio

## 📎 Notas / contexto adicional

La versión del release se resuelve en este orden de prioridad:
1. Archivo `.release-version` en la raíz del proyecto
2. Configuración en el archivo de integración del proyecto
3. Pregunta interactiva al usuario (solo en modo manual)

La eliminación de la rama feature (`feat/FEAT-NNN`) tras la fusión es opcional y requiere
confirmación explícita del usuario en modo manual, o se omite por defecto en modo automático.

**Nota INVEST — dimensión S:** Esta historia incluye 5 escenarios que cubren el scope completo
del skill. Si el equipo la estima como demasiado grande, se puede dividir en:
- FEAT-001a: Integración batch con configuración externa (happy path + idempotencia)
- FEAT-001b: Modo manual interactivo y dry-run
- FEAT-001c: Soporte multi-modelo con Scenario Outline

Ejecutar `/story-split` si se decide dividir.
