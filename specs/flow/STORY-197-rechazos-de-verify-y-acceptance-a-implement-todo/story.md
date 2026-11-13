---
alwaysApply: false
type: story
id: STORY-197
kind: feat
slug: STORY-197-rechazos-de-verify-y-acceptance-a-implement-todo
title: "Los rechazos de verify y acceptance vuelven a IMPLEMENT/TODO"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-rework-de-revision-a-implement-todo
  - STORY-190-directivas-de-correccion-desde-acceptance
  - STORY-191-valor-legado-en-los-gates-de-entrada
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Los rechazos de verify y acceptance vuelven a IMPLEMENT/TODO

**Como** Solo Builder que corrige una historia rechazada por la verificación o la aceptación  
**Quiero** que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma  
**Para** que un rechazo después de implementar no sugiera replanificar la historia y sepa con qué comando seguir

## ✅ Criterios de aceptación

### AC-1 — Escenario principal (con datos) – Destino de NEEDS-CHANGES en verify y acceptance
```gherkin
Escenario: Rechazo de un gate posterior a la revisión
  Dado una historia STORY-NNN en "<estado de entrada>"
  Cuando "<gate> STORY-NNN" emite "NEEDS-CHANGES"
  Entonces "story.md" queda en "IMPLEMENT/TODO"
    Y el resumen del gate nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
Ejemplos:
  | gate              | estado de entrada |
  | /story-verify     | CODE-REVIEW/DONE  |
  | /story-acceptance | VERIFY/DONE       |
```

### AC-2 — Escenario alternativo – El estado no activa el modo rework
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/TODO" sin "fix-directives.md"
  Y "verify-report.md" con "verdict: NEEDS-CHANGES"
Cuando el usuario ejecuta "/story-implement-tasks STORY-NNN"
Entonces acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
  Pero su resumen no anuncia correcciones ni ronda de rework
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `IMPLEMENT/TODO` se escriben en `evals/evals.json` de `story-verify`, `story-acceptance` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — Los demás veredictos no cambian:** `APPROVED`, `BLOCKED` y, en `/story-acceptance`, `PENDING` conservan su destino actual.

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-code-review` escriba `IMPLEMENT/TODO` y que los ejecutores acepten ese estado: STORY-189.
- Que `/story-verify` y `/story-acceptance` escriban `fix-directives.md`, la plantilla común, la numeración de `round` entre gates y el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- La clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.

## 📎 Notas / contexto adicional

- Cubre la parte de verify y acceptance del criterio de salida **CS-2** de EPIC-029 y la parte de **CS-7** que corresponde a los `evals.json` de `story-verify` y `story-acceptance` en los estados nuevos (los casos de `fix-directives.md` son de STORY-190).
- Puntos de cambio (2026-11-13): `skills/story-verify/SKILL.md` (líneas 31, 549, 588 y 601); `skills/story-acceptance/SKILL.md` (líneas 35, 454, 458, 488, 495, 496, 512, 533 y el Caso 2 de la línea 534). Incluye los README de esos skills. Hoy los resúmenes de NEEDS-CHANGES de ambos gates no nombran al ejecutor.
- Mientras STORY-190 no esté hecha, un rechazo de verify o acceptance deja `IMPLEMENT/TODO` sin `fix-directives.md` (AC-2), igual que hoy con `READY-FOR-IMPLEMENT/DONE`. STORY-190 añade después, en ese mismo caso, el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`. AC-2 sigue valiendo: el modo rework lo activa solo `fix-directives.md`.
- Dividida de la STORY-189 original (`el-rework-vuelve-a-implement-todo`) por tamaño (FINVEST S = 1).
- Depende de STORY-189, que abre la entrada `IMPLEMENT/TODO` en los ejecutores. Sin ella, una historia rechazada quedaría sin ejecutor. Va antes de STORY-190.
