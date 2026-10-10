---
alwaysApply: false
type: story
id: STORY-081
kind: feat
slug: STORY-081-implement-tdd-fase-green-refactor
title: "story-implement â€” Fases GREEN y REFACTOR: implementar cÃ³digo y refactorizar"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - STORY-078
  - STORY-082
---
[[fabrica-de-skills]]

# ðŸ“– Historia: story-implement â€” Fases GREEN y REFACTOR: implementar cÃ³digo y refactorizar

**Como** practitioner de SDDF que tiene los tests en estado rojo (Fase RED completada con STORY-078),  
**Quiero** que story-implement invoque el skill de coding declarado en sddf-config.yaml para implementar el cÃ³digo mÃ­nimo que hace pasar los tests (Fase GREEN) y luego refactorice el cÃ³digo manteniendo los tests en verde (Fase REFACTOR),  
**Para** obtener cÃ³digo implementado y refactorizado con todos los tests en verde, sin tener que invocar manualmente el skill de coding especÃ­fico del stack del proyecto.

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GREEN exitoso y REFACTOR con tests en verde, historia actualizada a CODE-REVIEW
```gherkin
Dado que los tests estÃ¡n en estado rojo (Fase RED completada)
  Y sddf-config.yaml declara el skill de coding bajo IMPLEMENT.code_generator
  Y el skill de coding declarado existe en .claude/skills/
Cuando story-implement ejecuta la Fase GREEN
Entonces el skill invoca el code-generator para escribir el cÃ³digo mÃ­nimo que hace pasar los tests
  Y los tests pasan (estado verde)
  Y el skill invoca el code-generator para la Fase REFACTOR
  Y los tests siguen en verde despuÃ©s del refactor
  Y actualiza story.md a status: CODE-REVIEW / substatus: IN-PROGRESS
```

### Escenario alternativo â€“ Fase GREEN falla: detiene el ciclo sin ejecutar REFACTOR
```gherkin
Dado que el skill de coding retorna error durante la Fase GREEN
Cuando story-implement ejecuta el code-generator
Entonces el skill detiene el ciclo sin invocar la Fase REFACTOR
  Y emite âŒ "Fase GREEN fallida: el skill '<nombre>' retornÃ³ error"
  Y reporta el detalle del fallo con sugerencia de acciÃ³n correctiva
  Pero no modifica el estado de story.md
```

### Escenario alternativo â€“ REFACTOR introduce regresiones: emite advertencia con detalle
```gherkin
Dado que la Fase GREEN fue exitosa (tests en verde)
  Pero la Fase REFACTOR produce cambios que rompen tests previamente en verde
Cuando story-implement ejecuta los tests tras el refactor
Entonces el skill emite âš ï¸ "Fase REFACTOR introdujo regresiones: <N> tests que pasaban ahora fallan"
  Y lista los tests que regresaron
  Y no actualiza el estado de story.md
```

### Requerimiento: configurabilidad del skill de coding en sddf-config.yaml

El skill determina quÃ© skill de coding invocar leyendo `IMPLEMENT.code_generator` en sddf-config.yaml. Cambiar el stack (de Node.js a Python, de React a Vue) solo requiere actualizar sddf-config.yaml; story-implement no necesita modificarse.

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operaciÃ³n. Si retorna `âœ— Entorno invÃ¡lido`, detener inmediatamente.

## Requerimiento:
El archivo testcases.md incluye una secciÃ³n de progreso con checkboxes, y `/story-implement` debe actualizarla automÃ¡ticamente al validar cada tipo de test en la Fase GREEN.

## âš™ï¸ Criterios no funcionales

* **AgnÃ³sticidad de stack:** el skill de coding se resuelve dinÃ¡micamente desde sddf-config.yaml; no se hardcodea ningÃºn lenguaje ni framework
* **Trazabilidad:** al completar esta fase, story.md refleja el estado CODE-REVIEW para habilitar la siguiente etapa del pipeline

## ðŸ“Ž Notas / contexto adicional

- **PosiciÃ³n en el pipeline:** story-implement (Fase RED, STORY-078) â†’ **story-implement (GREEN+REFACTOR)** â†’ story-code-review
- **PrecondiciÃ³n de ejecuciÃ³n:** requiere que la Fase RED (STORY-078) haya generado los archivos de prueba y confirmado el estado rojo
- **Historias hermanas:** STORY-078 (Fase RED), STORY-082 (modos de ejecuciÃ³n)
- **ConfiguraciÃ³n esperada en sddf-config.yaml:** secciÃ³n `IMPLEMENT.code_generator` con `{skill, required}`.
