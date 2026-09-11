---
alwaysApply: false
type: story
id: STORY-092
kind: feat
slug: STORY-092-reglas-robustez-modo-rework
title: "El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro"
status: SPECIFY
substatus: TODO
parent: EPIC-19-framework-consistency
created: 2026-09-11
updated: 2026-09-11
related:
  - EPIC-19-framework-consistency
  - STORY-089-rechazo-nombra-ejecutor-correcciones
  - STORY-091-story-implement-modo-rework
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]
[[STORY-091-story-implement-modo-rework]]

# 📖 Historia: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro

**Como** revisor que recibe una historia corregida por `/story-implement` en modo rework  
**Quiero** que el ciclo de corrección exija tests nuevos cuando un hallazgo es de cobertura de requisitos, y que cualquier cambio fuera de la lista blanca de `fix-directives.md` quede confirmado o registrado  
**Para** que la siguiente ronda de `/story-code-review` no apruebe una corrección sin evidencia ni pase por alto cambios que nadie pidió

## ✅ Criterios de aceptación

### Escenario principal – RED en rework sin tests nuevos (Scenario Outline)
```gherkin
Escenario: La Fase RED termina con 0 archivos de prueba generados o modificados
  Dado que "/story-implement" está en modo rework
    Y "fix-directives.md" contiene un hallazgo bloqueante con Dimensión "<dimension>"
  Cuando la Fase RED termina con 0 archivos de prueba generados o modificados
  Entonces el skill "<resultado>"
Ejemplos:
  | dimension                | resultado                                              |
  | requirements-coverage    | se detiene con error antes de la Fase GREEN            |
  | code-quality             | emite advertencia y continúa con la Fase GREEN         |
  | integration-architecture | emite advertencia y continúa con la Fase GREEN         |
  | security                 | emite advertencia y continúa con la Fase GREEN         |
  | DoD-CODE-REVIEW          | emite advertencia y continúa con la Fase GREEN         |
```

### Escenario alternativo – Corrección fuera de la lista blanca (Scenario Outline)
```gherkin
Escenario: Un generator modifica un archivo ausente de la lista blanca
  Dado que "/story-implement" está en modo rework con modo de ejecución "<modo>"
    Y un generator reporta un archivo modificado que no está en la lista blanca de "fix-directives.md"
  Cuando el skill consolida los resultados de la fase
  Entonces "<comportamiento>"
Ejemplos:
  | modo        | comportamiento                                                                                          |
  | interactivo | muestra los archivos fuera de lista y pide confirmación; con "n" se detiene sin modificar "story.md"    |
  | --auto      | permite el cambio y lo registra en "implement-report.md" bajo "Archivos fuera de lista blanca"          |
```

### Requerimiento: La regla de RED usa solo la columna Dimensión
- Un criterio de aceptación no cubierto (`requirements-coverage`) siempre es testeable; por eso 0 tests nuevos es error. Para las demás dimensiones puede no haber test que escribir (renombrados, comentarios, dependencias), por eso es advertencia.
- La regla lee únicamente la columna `Dimensión` de la tabla "Instrucciones de corrección" de `fix-directives.md`; no interpreta el texto del hallazgo.

### Requerimiento: La lista blanca es una barrera de alcance, no un bloqueo absoluto
- La lista blanca se deriva de la sección "Lista blanca de archivos permitidos para modificar" de `fix-directives.md`. En la práctica una corrección puede necesitar archivos no previstos (el `fix-directives.md` de STORY-090 ya añade "Destino de las acciones requeridas" fuera de la lista derivada); por eso se confirma en interactivo y se registra en `--auto`, para que la siguiente ronda de `story-code-review` lo revise.

## ⚙️ Criterios no funcionales

* Determinismo: ambas reglas son evaluables sin juicio del LLM — una compara valores de la columna `Dimensión`; la otra compara rutas contra una lista.
* Trazabilidad: la subsección "Archivos fuera de lista blanca" de `implement-report.md` es la entrada que `story-code-review` usa en la ronda siguiente.
* En modo `--auto` ninguna de las dos reglas pide confirmación.

## Fuera de alcance (Non-Goals)

- La detección del modo rework, el gate de estado y el bundle de contexto: [[STORY-091-story-implement-modo-rework]].
- Cambios en `story-code-review`: [[STORY-089-rechazo-nombra-ejecutor-correcciones]].
- Ampliar la lista blanca automáticamente o regenerar `fix-directives.md` desde `story-implement`.

## 📎 Notas / contexto adicional

- Depende de [[STORY-091-story-implement-modo-rework]]: las reglas se aplican dentro del modo rework que esa historia introduce. Orden de implementación: 089 → 091 → 092.
- Las cinco dimensiones de la tabla de ejemplos son las que hoy escribe `story-code-review` en `fix-directives.md` (cuatro agentes revisores + `DoD-CODE-REVIEW`).
