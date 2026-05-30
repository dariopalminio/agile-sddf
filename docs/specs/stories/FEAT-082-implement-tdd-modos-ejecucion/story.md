---
alwaysApply: false
type: story
id: FEAT-082
slug: FEAT-082-implement-tdd-modos-ejecucion
title: "story-implement — modos interactivo y automático de ejecución del ciclo TDD"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078
  - FEAT-081
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: story-implement — modos interactivo y automático de ejecución del ciclo TDD

**Como** practitioner de SDDF que usa story-implement en diferentes contextos de trabajo,  
**Quiero** poder elegir entre modo interactivo (el skill pausa al finalizar cada fase para pedir confirmación antes de continuar) y modo automático (ejecuta todas las fases sin pausas, deteniéndose solo ante errores),  
**Para** adaptar el flujo TDD a mi contexto: revisión manual paso a paso cuando trabajo de forma colaborativa, o ejecución continua sin interrupciones cuando ejecuto en pipelines de CI.

## ✅ Criterios de aceptación

### Escenario principal – Modo interactivo: el skill pausa entre fases y espera confirmación
```gherkin
Dado que el practitioner invoca story-implement sin el flag --auto
Cuando el skill completa la Fase RED
Entonces muestra el resumen de la fase completada
  Y pregunta "¿Continuar con la Fase GREEN? (s/n)"
  Y espera confirmación antes de invocar el skill de coding
  Y repite el mismo comportamiento al finalizar la Fase GREEN antes de ejecutar el REFACTOR
```

### Escenario alternativo – Modo automático: el skill ejecuta todas las fases sin pausas
```gherkin
Dado que el practitioner invoca story-implement con el flag --auto
Cuando el skill ejecuta el ciclo TDD completo
Entonces ejecuta la Fase RED sin pausa
  Y ejecuta la Fase GREEN inmediatamente después
  Y ejecuta el REFACTOR inmediatamente después
  Y muestra un resumen de las tres fases al finalizar el ciclo
```

### Escenario alternativo – Modo automático con error: detiene sin pedir confirmación
```gherkin
Dado que el practitioner invocó story-implement con el flag --auto
Cuando ocurre un error en cualquier fase del ciclo TDD
Entonces el skill detiene la ejecución inmediatamente
  Y reporta el error con el detalle de la fase fallida
  Pero no solicita confirmación al usuario ni espera input
```

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operación. Si retorna `✗ Entorno inválido`, detener inmediatamente.

## ⚙️ Criterios no funcionales

* **Modo predeterminado:** interactivo — si no se especifica flag, el skill asume modo interactivo
* **Flag:** `--auto` activa el modo automático para integración en CI o flujos sin supervisión

## 📎 Notas / contexto adicional

- **Posición en el pipeline:** los modos aplican a todo el ciclo TDD (FEAT-078 + FEAT-081 implementados)
- **Historias hermanas:** FEAT-078 (Fase RED), FEAT-081 (Fases GREEN y REFACTOR)
- **Orden de implementación sugerido:** FEAT-078 → FEAT-081 → FEAT-082 (los modos son una mejora sobre el ciclo ya funcional)
- **CI use case:** modo automático es el principal caso de uso para pipelines de integración continua; el modo interactivo es para trabajo manual supervisado.
