---
alwaysApply: false
type: story
id: FEAT-081
slug: FEAT-081-implement-tdd-fase-green-refactor
title: "story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078
  - FEAT-082
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar

**Como** practitioner de SDDF que tiene los tests en estado rojo (Fase RED completada con FEAT-078),  
**Quiero** que story-implement invoque el skill de coding declarado en sddf-config.yaml para implementar el código mínimo que hace pasar los tests (Fase GREEN) y luego refactorice el código manteniendo los tests en verde (Fase REFACTOR),  
**Para** obtener código implementado y refactorizado con todos los tests en verde, sin tener que invocar manualmente el skill de coding específico del stack del proyecto.

## ✅ Criterios de aceptación

### Escenario principal – GREEN exitoso y REFACTOR con tests en verde, historia actualizada a CODE-REVIEW
```gherkin
Dado que los tests están en estado rojo (Fase RED completada)
  Y sddf-config.yaml declara el skill de coding bajo implementing.code_generator
  Y el skill de coding declarado existe en .claude/skills/
Cuando story-implement ejecuta la Fase GREEN
Entonces el skill invoca el code-generator para escribir el código mínimo que hace pasar los tests
  Y los tests pasan (estado verde)
  Y el skill invoca el code-generator para la Fase REFACTOR
  Y los tests siguen en verde después del refactor
  Y actualiza story.md a status: CODE-REVIEW / substatus: IN-PROGRESS
```

### Escenario alternativo – Fase GREEN falla: detiene el ciclo sin ejecutar REFACTOR
```gherkin
Dado que el skill de coding retorna error durante la Fase GREEN
Cuando story-implement ejecuta el code-generator
Entonces el skill detiene el ciclo sin invocar la Fase REFACTOR
  Y emite ❌ "Fase GREEN fallida: el skill '<nombre>' retornó error"
  Y reporta el detalle del fallo con sugerencia de acción correctiva
  Pero no modifica el estado de story.md
```

### Escenario alternativo – REFACTOR introduce regresiones: emite advertencia con detalle
```gherkin
Dado que la Fase GREEN fue exitosa (tests en verde)
  Pero la Fase REFACTOR produce cambios que rompen tests previamente en verde
Cuando story-implement ejecuta los tests tras el refactor
Entonces el skill emite ⚠️ "Fase REFACTOR introdujo regresiones: <N> tests que pasaban ahora fallan"
  Y lista los tests que regresaron
  Y no actualiza el estado de story.md
```

### Requerimiento: configurabilidad del skill de coding en sddf-config.yaml

El skill determina qué skill de coding invocar leyendo `implementing.code_generator` en sddf-config.yaml. Cambiar el stack (de Node.js a Python, de React a Vue) solo requiere actualizar sddf-config.yaml; story-implement no necesita modificarse.

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operación. Si retorna `✗ Entorno inválido`, detener inmediatamente.

## ⚙️ Criterios no funcionales

* **Agnósticidad de stack:** el skill de coding se resuelve dinámicamente desde sddf-config.yaml; no se hardcodea ningún lenguaje ni framework
* **Trazabilidad:** al completar esta fase, story.md refleja el estado CODE-REVIEW para habilitar la siguiente etapa del pipeline

## 📎 Notas / contexto adicional

- **Posición en el pipeline:** story-implement (Fase RED, FEAT-078) → **story-implement (GREEN+REFACTOR)** → story-code-review
- **Precondición de ejecución:** requiere que la Fase RED (FEAT-078) haya generado los archivos de prueba y confirmado el estado rojo
- **Historias hermanas:** FEAT-078 (Fase RED), FEAT-082 (modos de ejecución)
- **Configuración esperada en sddf-config.yaml:** sección `implementing.code_generator` con `{skill, required}`.
