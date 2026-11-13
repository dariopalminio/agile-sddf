---
alwaysApply: false
type: story
id: STORY-196
kind: feat
slug: STORY-196-story-plan-protege-plan-done
title: "/story-plan protege PLAN/DONE sin APPROVED"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-191-valor-legado-en-los-gates-de-entrada
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: /story-plan protege PLAN/DONE sin APPROVED

**Como** Solo Builder que planifica una historia con `/story-plan`  
**Quiero** que `/story-plan`, al llegar al resumen, devuelva a `PLAN/IN-PROGRESS` una historia que encuentre en `PLAN/DONE` sin un `analyze.md` con `verdict: APPROVED`, y me avise  
**Para** que ninguna historia llegue a los ejecutores con la planificación cerrada sin un análisis aprobado

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – PLAN/DONE con análisis aprobado
```gherkin
Dado una historia STORY-NNN en "PLAN/DONE" con "analyze.md" en "verdict: APPROVED"
Cuando "/story-plan STORY-NNN" llega al resumen
Entonces "story.md" sigue en "PLAN/DONE"
  Y el resumen no emite el aviso de restauración
```

### AC-2 — Escenario alternativo / error – PLAN/DONE sin análisis aprobado
```gherkin
Escenario: Restauración ante PLAN/DONE sin APPROVED
  Dado una historia STORY-NNN en "PLAN/DONE"
    Y "analyze.md" en el estado "<analyze.md>"
  Cuando "/story-plan STORY-NNN" llega al resumen
  Entonces "story.md" queda en "PLAN/IN-PROGRESS"
    Y el resumen emite el aviso de restauración por "PLAN/DONE" sin "APPROVED"
Ejemplos:
  | analyze.md             |
  | verdict: NEEDS-CHANGES |
  | no existe              |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de la guardia ante `PLAN/DONE` se escriben en `skills/story-plan/evals/evals.json` antes de cambiar su `SKILL.md` (principio 11 de la constitución). `npm run test:eval -- story-plan` se ejecuta a mano.

- **CNF-2 — Guardia anterior conservada:** la guardia ante `READY-FOR-IMPLEMENT` sin `APPROVED` se mantiene. Su retiro o conversión en alias corresponde a STORY-191.

- **CNF-3 — Sin escritura de PLAN/DONE:** `/story-plan` nunca escribe `PLAN/DONE`; ese estado lo escribe solo `/story-analyze`.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-analyze` escriba `PLAN/DONE` y que los ejecutores lo acepten: STORY-188.
- El aviso y la clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- Las guías, `README.md` raíz y los ejemplos de otros skills: STORY-194.

## 📎 Notas / contexto adicional

- Derivada del split de STORY-188 del 2026-11-13 (Patrón 4, complejidad de criterios). Cubre la parte de **CS-7** de EPIC-029 que corresponde al `evals.json` de `story-plan`.
- Puntos de cambio (verificados el 2026-11-13): la guardia de `skills/story-plan/SKILL.md` (línea 319) y los textos que describen el estado de salida de la planificación (líneas 47, 49, 63, 117, 379, 437 y 439).
- Según la épica, cada historia actualiza el `SKILL.md`, el README, los ejemplos y los evals de los skills que toca. Aquí entran `skills/story-plan/README.md`, `assets/README.md` y `examples/output/plan-summary.md`.
- Orden sugerido: después de STORY-188. La guardia no depende de ella, porque `PLAN/DONE` ya lo declara el DoD de PLAN. Pero los textos de `story-plan` describen el estado que escribe `/story-analyze`, y antes de STORY-188 ese estado todavía es `READY-FOR-IMPLEMENT/DONE`.
