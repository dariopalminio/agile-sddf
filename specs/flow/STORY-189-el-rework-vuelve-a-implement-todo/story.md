---
alwaysApply: false
type: story
id: STORY-189
kind: feat
slug: STORY-189-el-rework-vuelve-a-implement-todo
title: "El rework vuelve a IMPLEMENT/TODO"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
  - STORY-191-valor-legado-en-los-gates-de-entrada
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: El rework vuelve a IMPLEMENT/TODO

**Como** Solo Builder que corrige una historia rechazada por un gate  
**Quiero** que `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y que `/story-implement` y `/story-implement-tasks` la acepten, con el modo rework activado, como hoy, solo por `fix-directives.md`  
**Para** que el rework se vea en el frontmatter y una implementación rechazada no parezca pendiente de planificar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por revisión en IMPLEMENT/TODO
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE" con un defecto bloqueante de severidad HIGH
Cuando el usuario ejecuta "/story-code-review STORY-NNN" y luego "/story-implement STORY-NNN"
Entonces "/story-code-review" deja "story.md" en "IMPLEMENT/TODO" junto a "fix-directives.md"
  Y "/story-implement" acepta "IMPLEMENT/TODO", entra en modo rework y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 — Escenario con datos – Destino de NEEDS-CHANGES en los tres gates
```gherkin
Escenario: Rechazo de un gate
  Dado una historia STORY-NNN en "<estado de entrada>"
  Cuando "<gate> STORY-NNN" emite "NEEDS-CHANGES"
  Entonces "story.md" queda en "IMPLEMENT/TODO"
    Y el resumen del gate nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
Ejemplos:
  | gate               | estado de entrada |
  | /story-code-review | IMPLEMENT/DONE    |
  | /story-verify      | CODE-REVIEW/DONE  |
  | /story-acceptance  | VERIFY/DONE       |
```

### AC-3 — Escenario alternativo – El estado no activa el modo rework
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/TODO" sin "fix-directives.md"
  Y "verify-report.md" con "verdict: NEEDS-CHANGES"
Cuando el usuario ejecuta "/story-implement-tasks STORY-NNN"
Entonces acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
  Y ejecuta sin modo rework
  Pero no lee "verify-report.md" ni "acceptance-report.md" para decidir el modo
```

### AC-4 — Escenario alternativo – BLOCKED de la revisión no cambia de destino
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE"
  Y un revisor de "/story-code-review" que no entrega un informe válido
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el veredicto es "BLOCKED"
  Y "story.md" queda en "IMPLEMENT/DONE"
  Pero no se genera "fix-directives.md"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `IMPLEMENT/TODO` se escriben en `evals/evals.json` de `story-code-review`, `story-verify`, `story-acceptance`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — Coordinación con el valor legado:** los gates de entrada de los ejecutores añaden `IMPLEMENT/TODO` sin retirar `READY-FOR-IMPLEMENT/DONE`; STORY-191 lo convierte en alias con aviso.

- **CNF-3 — Contrato de EPIC-28 intacto:** qué hallazgos entran en `fix-directives.md` (sin PREEXISTENTE ni `no verificado`, un fusionado una vez) y el cálculo de `round` de `story-code-review` no cambian en esta historia.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-verify` y `/story-acceptance` escriban `fix-directives.md`, la plantilla común, la numeración de `round` entre gates y el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- La clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- La salida aprobada de la planificación en `PLAN/DONE`: STORY-188.

## 📎 Notas / contexto adicional

- Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029 y el **SMOKE-2**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance`.
- Puntos de cambio (2026-11-13): `skills/story-code-review/SKILL.md:32` y el Paso 6; `skills/story-verify/SKILL.md` (líneas 31, 549, 588 y 601); `skills/story-acceptance/SKILL.md` (líneas 35, 454, 458, 488, 495, 496, 512, 533 y el Caso 2 de la línea 534); los gates de entrada de `skills/story-implement/SKILL.md` (líneas 54 y 271-331) y de `skills/story-implement-tasks/SKILL.md` (líneas 42, 91, 139 y 236-266). Incluye los README de esos skills.
- Decisión de la épica: el rework vuelve a `IMPLEMENT/TODO` y no a `PLAN/DONE`. `PLAN/DONE` era el renombrado más barato, pero sugiere replanificar tras un rechazo de VERIFY.
- Mientras STORY-190 no esté hecha, un rechazo de verify o acceptance deja `IMPLEMENT/TODO` sin `fix-directives.md` (AC-3), igual que hoy con `READY-FOR-IMPLEMENT/DONE`. La épica fija ese orden: la de directivas va después de esta.
- Depende de STORY-186.
