---
alwaysApply: false
type: story
id: STORY-128
kind: feat
slug: STORY-128-evaluar-validacion-epica-repetible
title: "Evaluar la validación de épicas de forma repetible"
status: SPECIFY
substatus: READY
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-12
related:
  - EPIC-23-skill-epic-validate
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-127
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Evaluar la validación de épicas de forma repetible

**Como** mantenedor de Agile-SDDF que evoluciona el gateway de calidad  
**Quiero** contar con casos de evaluación que demuestren sus veredictos aprobados y bloqueados  
**Para** detectar regresiones antes de distribuir cambios del gateway

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Épica consistente
```gherkin
Dado una épica de evaluación con toda la evidencia requerida aprobada
Cuando se ejecuta la evaluación del gateway
Entonces el resultado esperado y observado es READY-TO-SHIP
```

### AC-2 — Escenario alternativo — Épica inconsistente
```gherkin
Dado una épica de evaluación con al menos un impedimento verificable
Cuando se ejecuta la evaluación del gateway
Entonces el resultado esperado y observado es BLOCKED e identifica el impedimento
```

### AC-3 — Escenario de regresión — Resultados repetibles
```gherkin
Dado los mismos artefactos de evaluación
Cuando se ejecutan nuevamente los casos
Entonces conservan el veredicto esperado sin requerir intervención manual
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Cobertura mínima:** los casos cubren al menos un resultado READY-TO-SHIP y uno BLOCKED.
- **CNF-2 — Determinismo:** los resultados no dependen de servicios externos no controlados por el caso de evaluación.

## 🚫 Fuera de alcance

- Diseñar nuevas condiciones para el gateway.
- Integrar el gateway con la transición de estados.
- Cambiar la documentación o el empaquetado.

## 📎 Notas / contexto adicional

- Esta historia verifica el comportamiento entregado por sus hermanas sin reabrir su alcance funcional.
