---
alwaysApply: false
type: story
id: STORY-189
kind: feat
slug: STORY-189-el-rework-vuelve-a-implement-todo
title: "El rework de los tres gates vuelve a IMPLEMENT/TODO"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: El rework de los tres gates vuelve a IMPLEMENT/TODO

**Como** Solo Builder que corrige una historia rechazada por la revisión de código, la verificación o la aceptación  
**Quiero** que `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma, y que `/story-implement` y `/story-implement-tasks` acepten ese estado, con el modo rework activado, como hoy, solo por `fix-directives.md`  
**Para** que el rework se vea en el frontmatter, que un rechazo después de implementar no sugiera replanificar la historia y que sepa con qué comando seguir

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por revisión en IMPLEMENT/TODO
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE" con un defecto bloqueante de severidad HIGH
Cuando el usuario ejecuta "/story-code-review STORY-NNN" y luego "/story-implement STORY-NNN"
Entonces "/story-code-review" deja "story.md" en "IMPLEMENT/TODO" junto a "fix-directives.md"
  Y su resumen nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
  Y "/story-implement" acepta "IMPLEMENT/TODO", entra en modo rework y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 — Escenario con datos – Destino de NEEDS-CHANGES en verify y acceptance
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

### AC-3 — Escenario con datos – Solo fix-directives.md activa el modo rework
```gherkin
Escenario: El ejecutor por tareas ante IMPLEMENT/TODO
  Dado una historia STORY-NNN en "IMPLEMENT/TODO" con "tasks.md" con todas sus tareas completadas
    Y <directivas>
  Cuando el usuario ejecuta "/story-implement-tasks STORY-NNN"
  Entonces acepta la entrada y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
    Y <modo>
Ejemplos:
  | directivas                                                          | modo                                                         |
  | "fix-directives.md" de ronda 1                                       | aplica las correcciones de la ronda 1                        |
  | sin "fix-directives.md" y "verify-report.md" con "verdict: NEEDS-CHANGES" | su resumen no anuncia correcciones ni ronda de rework   |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `IMPLEMENT/TODO` se escriben en `evals/evals.json` de `story-code-review`, `story-verify`, `story-acceptance`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — Los demás veredictos no cambian:** `APPROVED`, `BLOCKED` y, en `/story-acceptance`, `PENDING` conservan su destino actual. En particular, un `BLOCKED` de `/story-code-review` (un revisor no entrega un informe válido) deja `story.md` en `IMPLEMENT/DONE` y no genera `fix-directives.md`.

- **CNF-3 — Coordinación con el valor legado:** los gates de entrada de los ejecutores añaden `IMPLEMENT/TODO` sin retirar `READY-FOR-IMPLEMENT/DONE`; STORY-191 lo convierte en alias con aviso.

- **CNF-4 — Contrato de EPIC-28 intacto:** qué hallazgos entran en `fix-directives.md` (sin PREEXISTENTE ni `no verificado`, un fusionado una vez) y el cálculo de `round` de `story-code-review` no cambian en esta historia.

- **CNF-5 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-verify` y `/story-acceptance` escriban `fix-directives.md`, la plantilla común, la numeración de `round` entre gates, el anuncio del origen del rework y el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- La clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- La salida aprobada de la planificación en `PLAN/DONE`: STORY-188.

## 📎 Notas / contexto adicional

- Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance` en los estados nuevos (los casos de `fix-directives.md` de verify y acceptance son de STORY-190).
- **Reagrupación del 2026-11-13:** absorbe a STORY-197 (rechazos de verify y acceptance), que se había separado de esta por tamaño (FINVEST S = 1). Se vuelven a unir porque el cambio es el mismo destino en los tres gates y la misma entrada en los dos ejecutores; separados, la entrada `IMPLEMENT/TODO` de los ejecutores se diseñaba, probaba y revisaba dos veces. Los escenarios de verify y acceptance se expresan como ejemplos de un mismo esquema (AC-2) para mantener el tamaño acotado.
- Puntos de cambio (2026-11-13): `skills/story-code-review/SKILL.md:32` y los Pasos 4g, 6 y 7 (líneas 51, 148, 707, 714, 720, 814, 873, 897 y 934); `skills/story-verify/SKILL.md` (líneas 31, 549, 588 y 601); `skills/story-acceptance/SKILL.md` (líneas 35, 454, 458, 488, 495, 496, 512, 533 y el Caso 2 de la línea 534); los gates de entrada de `skills/story-implement/SKILL.md` (líneas 54 y 271-331) y de `skills/story-implement-tasks/SKILL.md` (líneas 42, 91, 139 y 236-266). Incluye los README de esos skills. Hoy los resúmenes de NEEDS-CHANGES de verify y acceptance no nombran al ejecutor.
- Decisión de la épica: el rework vuelve a `IMPLEMENT/TODO` y no a `PLAN/DONE`. `PLAN/DONE` era el renombrado más barato, pero sugiere replanificar tras un rechazo.
- Orden interno: los ejecutores aceptan `IMPLEMENT/TODO` antes de que los gates lo escriban, para que en ningún commit intermedio quede una historia rechazada sin ejecutor. STORY-188 y STORY-191 tocan los mismos gates de entrada.
- Mientras STORY-190 no esté hecha, un rechazo de verify o acceptance deja `IMPLEMENT/TODO` sin `fix-directives.md` (fila 2 de AC-3), igual que hoy con `READY-FOR-IMPLEMENT/DONE`. STORY-190 añade después, en ese caso, el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`; la fila sigue valiendo, porque el modo rework lo activa solo `fix-directives.md`.
- Depende de STORY-186.
