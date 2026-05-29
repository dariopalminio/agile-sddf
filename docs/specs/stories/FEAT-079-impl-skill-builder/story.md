---
alwaysApply: false
type: story
id: FEAT-079
slug: impl-skill-builder
title: "impl-skill-builder"
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
created: 2026-05-28
updated: 2026-05-28
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078-design-skill-arch
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]
[[FEAT-078-design-skill-arch]]

# 📖 Historia: impl-skill-builder

**Como** desarrollador de skills SDDF que ya tiene un diseño aprobado  
**Quiero** ejecutar el skill impl-skill-builder con el design.md y tasks.md como entrada  
**Para** obtener un SKILL.md funcional y sus evals.json construidos mediante el ciclo TDD (RED → GREEN → REFACTOR) con pressure scenarios verificados

## ✅ Criterios de aceptación

### Escenario principal – Ciclo TDD completo RED-GREEN-REFACTOR
```gherkin
Dado que existen design.md y tasks.md válidos generados por design-skill-arch
  Y el entorno SDDF supera el preflight sin errores
Cuando el usuario invoca el skill impl-skill-builder apuntando al directorio de la historia
Entonces el skill ejecuta la fase RED: lanza un subagente pressure scenario sin el SKILL.md y verifica que falla
  Y el skill ejecuta la fase GREEN: escribe el SKILL.md mínimo para que el pressure scenario pase
  Y el skill ejecuta la fase REFACTOR: mejora el SKILL.md manteniendo el pressure scenario en verde
  Y al finalizar, el directorio del skill contiene SKILL.md, evals/evals.json y los scripts declarados en design.md
  Y el informe de implementación indica qué pressure scenario se usó y cuál fue el resultado en cada fase
```

### Escenario alternativo – Fase RED no falla (skill ya implementado o trivial)
```gherkin
Dado design.md y tasks.md válidos
  Y un SKILL.md ya existe en el directorio de destino
Cuando el skill ejecuta la fase RED del ciclo TDD
Entonces el skill detecta que el pressure scenario pasa aunque no debería (skip incorrecto)
  Y muestra una advertencia: "El pressure scenario pasó en RED — el SKILL.md existente puede estar resolviendo el caso; revisar manualmente"
  Y solicita confirmación al usuario antes de proceder con GREEN y REFACTOR
```

### Escenario alternativo – design.md faltante o incompleto
```gherkin
Dado un directorio de historia sin design.md o con design.md vacío
Cuando el usuario invoca el skill impl-skill-builder
Entonces el skill muestra el mensaje "design.md no encontrado o incompleto — ejecuta design-skill-arch primero"
  Y detiene la ejecución sin generar ningún archivo
```

### Escenario alternativo – Pressure scenario falla en GREEN tras 3 intentos
```gherkin
Dado design.md y tasks.md válidos
Cuando el skill no logra que el pressure scenario pase tras 3 iteraciones de escritura en fase GREEN
Entonces el skill muestra un informe de fallo indicando el pressure scenario, el error observado y las iteraciones intentadas
  Y detiene la ejecución para revisión humana sin ejecutar la fase REFACTOR
```

## ⚙️ Criterios no funcionales

* TDD obligatorio: el ciclo RED-GREEN-REFACTOR no puede saltarse ni reordenarse; el skill debe verificar la fase RED antes de escribir código
* Trazabilidad: cada elemento del SKILL.md generado debe tener correspondencia con una tarea en tasks.md
* Idempotencia: si el skill ya fue ejecutado parcialmente, debe detectar el estado (qué fases completaron) y ofrecer continuar desde donde se dejó
* Tokens: el skill debe minimizar el contexto pasado a subagentes — usar el patrón `.tmp/impl-skill-builder/` para archivos intermedios

## 📎 Notas / contexto adicional

- **Entrada obligatoria:** design.md + tasks.md de `design-skill-arch` (FEAT-078).
- **Salida:** SKILL.md, evals/evals.json y scripts declarados en design.md.
- El pressure scenario es un subagente que intenta resolver una tarea concreta con y sin el SKILL.md — inspirado en el ciclo de `Superpowers writing-skills`.
- Integración opcional con `skill-creator` para evaluaciones intermedias entre fases.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-079 — impl-skill-builder
