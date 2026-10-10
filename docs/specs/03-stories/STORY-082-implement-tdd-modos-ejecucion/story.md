---
alwaysApply: false
type: story
id: STORY-082
kind: feat
slug: STORY-082-implement-tdd-modos-ejecucion
title: "story-implement â€” modos interactivo y automÃ¡tico de ejecuciÃ³n del ciclo TDD"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - STORY-078
  - STORY-081
---
[[fabrica-de-skills]]

# ðŸ“– Historia: story-implement â€” modos interactivo y automÃ¡tico de ejecuciÃ³n del ciclo TDD

**Como** practitioner de SDDF que usa story-implement en diferentes contextos de trabajo,  
**Quiero** poder elegir entre modo interactivo (el skill pausa al finalizar cada fase para pedir confirmaciÃ³n antes de continuar) y modo automÃ¡tico (ejecuta todas las fases sin pausas, deteniÃ©ndose solo ante errores),  
**Para** adaptar el flujo TDD a mi contexto: revisiÃ³n manual paso a paso cuando trabajo de forma colaborativa, o ejecuciÃ³n continua sin interrupciones cuando ejecuto en pipelines de CI.

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Modo interactivo: el skill pausa entre fases y espera confirmaciÃ³n
```gherkin
Dado que el practitioner invoca story-implement sin el flag --auto
Cuando el skill completa la Fase RED
Entonces muestra el resumen de la fase completada
  Y pregunta "Â¿Continuar con la Fase GREEN? (s/n)"
  Y espera confirmaciÃ³n antes de invocar el skill de coding
  Y repite el mismo comportamiento al finalizar la Fase GREEN antes de ejecutar el REFACTOR
```

### Escenario alternativo â€“ Modo automÃ¡tico: el skill ejecuta todas las fases sin pausas
```gherkin
Dado que el practitioner invoca story-implement con el flag --auto
Cuando el skill ejecuta el ciclo TDD completo
Entonces ejecuta la Fase RED sin pausa
  Y ejecuta la Fase GREEN inmediatamente despuÃ©s
  Y ejecuta el REFACTOR inmediatamente despuÃ©s
  Y muestra un resumen de las tres fases al finalizar el ciclo
```

### Escenario alternativo â€“ Modo automÃ¡tico con error: detiene sin pedir confirmaciÃ³n
```gherkin
Dado que el practitioner invocÃ³ story-implement con el flag --auto
Cuando ocurre un error en cualquier fase del ciclo TDD
Entonces el skill detiene la ejecuciÃ³n inmediatamente
  Y reporta el error con el detalle de la fase fallida
  Pero no solicita confirmaciÃ³n al usuario ni espera input
```

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operaciÃ³n. Si retorna `âœ— Entorno invÃ¡lido`, detener inmediatamente.

## âš™ï¸ Criterios no funcionales

* **Modo predeterminado:** interactivo â€” si no se especifica flag, el skill asume modo interactivo
* **Flag:** `--auto` activa el modo automÃ¡tico para integraciÃ³n en CI o flujos sin supervisiÃ³n

## ðŸ“Ž Notas / contexto adicional

- **PosiciÃ³n en el pipeline:** los modos aplican a todo el ciclo TDD (STORY-078 + STORY-081 implementados)
- **Historias hermanas:** STORY-078 (Fase RED), STORY-081 (Fases GREEN y REFACTOR)
- **Orden de implementaciÃ³n sugerido:** STORY-078 â†’ STORY-081 â†’ STORY-082 (los modos son una mejora sobre el ciclo ya funcional)
- **CI use case:** modo automÃ¡tico es el principal caso de uso para pipelines de integraciÃ³n continua; el modo interactivo es para trabajo manual supervisado.
