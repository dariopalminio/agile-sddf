---
alwaysApply: false
type: story
id: STORY-188
kind: feat
slug: STORY-188-la-planificacion-termina-en-plan-done
title: "La planificación termina en PLAN/DONE"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-191-valor-legado-en-los-gates-de-entrada
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: La planificación termina en PLAN/DONE

**Como** Solo Builder que planifica una historia y la pasa a implementación  
**Quiero** que `/story-analyze` con `APPROVED` deje la historia en `PLAN/DONE` (con `NEEDS-CHANGES` sigue en `PLAN/IN-PROGRESS`), que la guardia de `/story-plan` restaure `PLAN/IN-PROGRESS` si encuentra `PLAN/DONE` sin veredicto `APPROVED` y que `/story-implement` y `/story-implement-tasks` acepten `PLAN/DONE` como entrada  
**Para** que la planificación cierre en el estado que ya declaran `dod-story-plan.md` y `dod-story.js`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Planificación aprobada sin buffer
```gherkin
Dado una historia STORY-NNN en "PLAN/IN-PROGRESS" con "design.md", "tasks.md" y "testcases.md" coherentes con "story.md"
Cuando el usuario ejecuta "/story-analyze STORY-NNN" y luego "/story-implement STORY-NNN"
Entonces "analyze.md" tiene "verdict: APPROVED"
  Y "/story-analyze" deja "story.md" en "PLAN/DONE"
  Y "/story-implement" acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 — Escenario alternativo / error – Análisis con NEEDS-CHANGES
```gherkin
Dado una historia STORY-NNN en "PLAN/IN-PROGRESS" cuyo "design.md" contradice un criterio de aceptación de "story.md"
Cuando el usuario ejecuta "/story-analyze STORY-NNN"
Entonces "analyze.md" tiene "verdict: NEEDS-CHANGES"
  Y "story.md" sigue en "PLAN/IN-PROGRESS"
  Y el resumen indica que no se actualizó a "PLAN/DONE"
  Pero "/story-implement STORY-NNN" rechaza la entrada y lista los estados que acepta
```

### AC-3 — Escenario con datos – Guardia de /story-plan
```gherkin
Escenario: Guardia ante PLAN/DONE
  Dado una historia STORY-NNN en "PLAN/DONE"
    Y "analyze.md" en el estado "<analyze.md>"
  Cuando "/story-plan STORY-NNN" llega al resumen
  Entonces "story.md" queda en "<estado final>"
    Y el resumen <aviso>
Ejemplos:
  | analyze.md             | estado final     | aviso                                                    |
  | verdict: APPROVED      | PLAN/DONE        | no emite el aviso de restauración                        |
  | verdict: NEEDS-CHANGES | PLAN/IN-PROGRESS | emite el aviso de restauración por PLAN/DONE sin APPROVED |
  | no existe              | PLAN/IN-PROGRESS | emite el aviso de restauración por PLAN/DONE sin APPROVED |
```

### AC-4 — Escenario alternativo – /story-implement-tasks acepta PLAN/DONE y conserva la entrada anterior
```gherkin
Escenario: Entrada de /story-implement-tasks
  Dado una historia STORY-NNN con "tasks.md" en "<estado de entrada>"
  Cuando el usuario ejecuta "/story-implement-tasks STORY-NNN"
  Entonces acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
Ejemplos:
  | estado de entrada        |
  | PLAN/DONE                |
  | READY-FOR-IMPLEMENT/DONE |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `PLAN/DONE` se escriben en `evals/evals.json` de `story-analyze`, `story-plan`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — DoD sin cambios:** `docs/guardrails/dod-story-plan.md` y `skills/memory-system/scripts/dod-story.js` ya cierran la etapa en `PLAN/DONE` y no se modifican.

- **CNF-3 — Coordinación con el valor legado:** esta historia añade `PLAN/DONE` sin retirar `READY-FOR-IMPLEMENT/DONE` de los gates de entrada; STORY-191 lo convierte en alias con aviso. Ningún estado intermedio deja historias sin ejecutor.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- El destino del rework de los tres gates: STORY-189.
- El aviso y la clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- Las guías, `README.md` raíz y los ejemplos de otros skills: STORY-194.

## 📎 Notas / contexto adicional

- Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-analyze` y `story-plan`.
- Puntos de cambio (2026-11-13): `skills/story-analyze/SKILL.md` (líneas 36, 54, 62, 123, 139, 500, 552 y 558), `skills/story-plan/SKILL.md` (líneas 47, 49, 63, 117, 319, 379, 437 y 439), el gate de entrada del Paso 0c de `skills/story-implement/SKILL.md` (líneas 271-331) y el de `skills/story-implement-tasks/SKILL.md` (líneas 236-266 y 370).
- Según la épica, cada historia actualiza el `SKILL.md`, el README, los ejemplos y los evals de los skills que toca. Aquí entran `skills/story-analyze/README.md` y `examples/input/story.md`, y `skills/story-plan/README.md`, `assets/README.md` y `examples/output/plan-summary.md`.
- Depende de STORY-186. STORY-189 también edita los gates de entrada de los ejecutores: si se implementan seguidas, integrar las dos entradas nuevas (`PLAN/DONE` e `IMPLEMENT/TODO`) en la misma lista.
