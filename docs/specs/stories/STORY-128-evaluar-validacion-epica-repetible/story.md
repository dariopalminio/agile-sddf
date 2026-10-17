---
alwaysApply: false
type: story
id: STORY-128
kind: feat
slug: STORY-128-evaluar-validacion-epica-repetible
title: "Evaluar la validación de épicas de forma repetible"
status: SPECIFY
substatus: DONE
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-17
related:
  - EPIC-23-skill-epic-validate
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-127
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Evaluar la validación de épicas de forma repetible

**Como** Solo Builder y mantenedor de Agile-SDDF que evoluciona el gateway de calidad  
**Quiero** contar con casos de evaluación que demuestren sus veredictos aprobados y bloqueados  
**Para** detectar regresiones antes de distribuir cambios del gateway

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Épica consistente
```gherkin
Dado una épica de evaluación con toda la evidencia requerida aprobada
Cuando se ejecuta la evaluación del gateway
Entonces el resultado esperado y observado es APPROVED
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
Entonces skills/epic-validate/evals/evals.json conserva al menos un caso APPROVED y uno BLOCKED
  Y cada caso obtiene su veredicto esperado sin requerir intervención manual
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Cobertura mínima:** los casos cubren al menos un resultado APPROVED y uno BLOCKED.
- **CNF-2 — Determinismo:** los resultados no dependen de servicios externos no controlados por el caso de evaluación.

## 🚫 Fuera de alcance

- Diseñar nuevas condiciones para el gateway.
- Integrar el gateway con la transición de estados.
- Cambiar la documentación o el empaquetado.

## 📎 Notas / contexto adicional

- Esta historia verifica el comportamiento entregado por sus hermanas sin reabrir su alcance funcional.
- Cubre el criterio de salida de EPIC-23: **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED y una inconsistente que resulte BLOCKED.
