---
alwaysApply: false
type: story
id: STORY-188
kind: feat
slug: STORY-188-la-planificacion-termina-en-plan-done
title: "La planificación termina en PLAN/DONE"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: La planificación termina en PLAN/DONE

**Como** Solo Builder que planifica una historia y la pasa a implementación  
**Quiero** que una planificación aprobada por `/story-analyze` termine en `PLAN/DONE`, que los ejecutores acepten ese estado como entrada y que `/story-plan` devuelva a `PLAN/IN-PROGRESS` una historia que encuentre en `PLAN/DONE` sin un `analyze.md` aprobado  
**Para** pasar de la planificación a la implementación sin el estado buffer `READY-FOR-IMPLEMENT`, en el mismo estado de cierre que ya declaran `dod-story-plan.md` y `dod-story.js`, y sin que una historia llegue a los ejecutores con la planificación cerrada sin un análisis aprobado

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Planificación aprobada sin buffer
```gherkin
Escenario: Del análisis aprobado al ejecutor
  Dado una historia STORY-NNN en "PLAN/IN-PROGRESS" con "design.md", "tasks.md" y "testcases.md" coherentes con "story.md"
  Cuando el usuario ejecuta "/story-analyze STORY-NNN" y luego "<ejecutor> STORY-NNN"
  Entonces "/story-analyze" deja "story.md" en "PLAN/DONE" con "verdict: APPROVED" en "analyze.md"
    Y "<ejecutor>" acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
Ejemplos:
  | ejecutor               |
  | /story-implement       |
  | /story-implement-tasks |
```

### AC-2 — Escenario alternativo / error – Análisis con NEEDS-CHANGES
```gherkin
Dado una historia STORY-NNN en "PLAN/IN-PROGRESS" cuyo "design.md" contradice un criterio de aceptación de "story.md"
Cuando el usuario ejecuta "/story-analyze STORY-NNN"
Entonces "analyze.md" tiene "verdict: NEEDS-CHANGES" y "story.md" sigue en "PLAN/IN-PROGRESS"
  Pero "/story-implement STORY-NNN" rechaza la entrada y lista los estados que acepta
```

### AC-3 — Escenario con datos – /story-plan protege PLAN/DONE
```gherkin
Escenario: Guardia de /story-plan ante PLAN/DONE
  Dado una historia STORY-NNN en "PLAN/DONE"
    Y "analyze.md" en el estado "<analyze.md>"
  Cuando "/story-plan STORY-NNN" llega al resumen
  Entonces "story.md" queda en "<estado final>"
    Y el resumen <aviso>
Ejemplos:
  | analyze.md             | estado final     | aviso                                                          |
  | verdict: APPROVED      | PLAN/DONE        | no emite el aviso de restauración                              |
  | verdict: NEEDS-CHANGES | PLAN/IN-PROGRESS | emite el aviso de restauración por "PLAN/DONE" sin "APPROVED"  |
  | no existe              | PLAN/IN-PROGRESS | emite el aviso de restauración por "PLAN/DONE" sin "APPROVED"  |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `PLAN/DONE` se escriben en el `evals/evals.json` de `story-analyze`, `story-plan`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — DoD sin cambios:** `docs/guardrails/dod-story-plan.md` y `skills/memory-system/scripts/dod-story.js` ya cierran la etapa en `PLAN/DONE` y no se modifican.

- **CNF-3 — Sin escritura de PLAN/DONE en /story-plan:** `/story-plan` nunca escribe `PLAN/DONE`; ese estado lo escribe solo `/story-analyze`.

- **CNF-4 — Entrada anterior conservada:** los ejecutores siguen aceptando `READY-FOR-IMPLEMENT/DONE` además de `PLAN/DONE`, y `/story-plan` conserva su guardia ante `READY-FOR-IMPLEMENT` sin `APPROVED`; STORY-191 convierte el valor en alias con aviso. Los evals de los dos ejecutores incluyen un caso con esa entrada. Ningún estado intermedio deja historias sin ejecutor.

- **CNF-5 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- El destino del rework de los tres gates: STORY-189.
- El aviso y la clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- Las guías, `README.md` raíz y los ejemplos de otros skills: STORY-194.

## 📎 Notas / contexto adicional

- Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y el **SMOKE-1**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-analyze` y `story-plan`.
- **Reagrupación del 2026-11-13:** absorbe a STORY-196 (guardia de `/story-plan`), que se había separado de esta por complejidad de criterios (Patrón 4). Se vuelven a unir porque la guardia y la salida de `/story-analyze` describen el mismo estado de cierre, y los textos de `story-plan` que describen ese estado dependían de esta historia.
- Puntos de cambio (verificados el 2026-11-13): `skills/story-analyze/SKILL.md` (líneas 36, 54, 62, 123, 139, 500, 552, 558 y 583); la guardia de `skills/story-plan/SKILL.md` (línea 319) y los textos que describen el estado de salida de la planificación (líneas 47, 49, 63, 117, 379, 437 y 439); el gate de entrada del Paso 0c de `skills/story-implement/SKILL.md` (líneas 271-334) y el de `skills/story-implement-tasks/SKILL.md` (líneas 236-266 y 370).
- Según la épica, cada historia actualiza el `SKILL.md`, el README, los ejemplos y los evals de los skills que toca. Aquí entran `skills/story-analyze/README.md` y `examples/input/story.md`; `skills/story-plan/README.md`, `assets/README.md` y `examples/output/plan-summary.md`; y la entrada inicial descrita en `skills/story-implement/README.md` y `skills/story-implement-tasks/README.md`.
- Depende de STORY-186. STORY-189 también edita los gates de entrada de los ejecutores: si se implementan seguidas, integrar las dos entradas nuevas (`PLAN/DONE` e `IMPLEMENT/TODO`) en la misma lista.
