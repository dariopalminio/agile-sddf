---
alwaysApply: false
type: story
id: STORY-189
kind: feat
slug: STORY-189-el-rework-vuelve-a-implement-todo
title: "El rework de los tres gates vuelve a IMPLEMENT/TODO"
status: READY-FOR-IMPLEMENT
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

# ðŸ“– Historia: El rework de los tres gates vuelve a IMPLEMENT/TODO

**Como** Solo Builder que corrige una historia rechazada por la revisiÃ³n de cÃ³digo, la verificaciÃ³n o la aceptaciÃ³n  
**Quiero** que `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma, y que `/story-implement` y `/story-implement-tasks` acepten ese estado, con el modo rework activado, como hoy, solo por `fix-directives.md`  
**Para** que el rework se vea en el frontmatter, que un rechazo despuÃ©s de implementar no sugiera replanificar la historia y que sepa con quÃ© comando seguir

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Rework por revisiÃ³n en IMPLEMENT/TODO
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE" con un defecto bloqueante de severidad HIGH
Cuando el usuario ejecuta "/story-code-review STORY-NNN" y luego "/story-implement STORY-NNN"
Entonces "/story-code-review" deja "story.md" en "IMPLEMENT/TODO" junto a "fix-directives.md"
  Y su resumen nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
  Y "/story-implement" acepta "IMPLEMENT/TODO", entra en modo rework y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 â€” Escenario con datos â€“ Destino de NEEDS-CHANGES en verify y acceptance
```gherkin
Escenario: Rechazo de un gate posterior a la revisiÃ³n
  Dado una historia STORY-NNN en "<estado de entrada>"
  Cuando "<gate> STORY-NNN" emite "NEEDS-CHANGES"
  Entonces "story.md" queda en "IMPLEMENT/TODO"
    Y el resumen del gate nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
Ejemplos:
  | gate              | estado de entrada |
  | /story-verify     | CODE-REVIEW/DONE  |
  | /story-acceptance | VERIFY/DONE       |
```

### AC-3 â€” Escenario con datos â€“ Solo fix-directives.md activa el modo rework
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

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Evals primero:** los casos de `IMPLEMENT/TODO` se escriben en `evals/evals.json` de `story-code-review`, `story-verify`, `story-acceptance`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constituciÃ³n). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 â€” Los demÃ¡s veredictos no cambian:** `APPROVED`, `BLOCKED` y, en `/story-acceptance`, `PENDING` conservan su destino actual. En particular, un `BLOCKED` de `/story-code-review` (un revisor no entrega un informe vÃ¡lido) deja `story.md` en `IMPLEMENT/DONE` y no genera `fix-directives.md`.

- **CNF-3 â€” CoordinaciÃ³n con el valor legado:** los gates de entrada de los ejecutores aÃ±aden `IMPLEMENT/TODO` sin retirar `READY-FOR-IMPLEMENT/DONE`; STORY-191 lo convierte en alias con aviso.

- **CNF-4 â€” Contrato de EPIC-28 intacto:** quÃ© hallazgos entran en `fix-directives.md` (sin PREEXISTENTE ni `no verificado`, un fusionado una vez) y el cÃ¡lculo de `round` de `story-code-review` no cambian en esta historia.

- **CNF-5 â€” Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-verify` y `/story-acceptance` escriban `fix-directives.md`, la plantilla comÃºn, la numeraciÃ³n de `round` entre gates, el anuncio del origen del rework y el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- La clasificaciÃ³n del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- La salida aprobada de la planificaciÃ³n en `PLAN/DONE`: STORY-188.

## ðŸ“Ž Notas / contexto adicional

- Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance` en los estados nuevos (los casos de `fix-directives.md` de verify y acceptance son de STORY-190).
- **ReagrupaciÃ³n del 2026-11-13:** absorbe a STORY-197 (rechazos de verify y acceptance), que se habÃ­a separado de esta por tamaÃ±o (FINVEST S = 1). Se vuelven a unir porque el cambio es el mismo destino en los tres gates y la misma entrada en los dos ejecutores; separados, la entrada `IMPLEMENT/TODO` de los ejecutores se diseÃ±aba, probaba y revisaba dos veces. Los escenarios de verify y acceptance se expresan como ejemplos de un mismo esquema (AC-2) para mantener el tamaÃ±o acotado.
- Puntos de cambio (2026-11-13): `skills/story-code-review/SKILL.md:32` y los Pasos 4g, 6 y 7 (lÃ­neas 51, 148, 707, 714, 720, 814, 873, 897 y 934); `skills/story-verify/SKILL.md` (lÃ­neas 31, 549, 588 y 601); `skills/story-acceptance/SKILL.md` (lÃ­neas 35, 454, 458, 488, 495, 496, 512, 533 y el Caso 2 de la lÃ­nea 534); los gates de entrada de `skills/story-implement/SKILL.md` (lÃ­neas 54 y 271-331) y de `skills/story-implement-tasks/SKILL.md` (lÃ­neas 42, 91, 139 y 236-266). Incluye los README de esos skills. Hoy los resÃºmenes de NEEDS-CHANGES de verify y acceptance no nombran al ejecutor.
- DecisiÃ³n de la Ã©pica: el rework vuelve a `IMPLEMENT/TODO` y no a `PLAN/DONE`. `PLAN/DONE` era el renombrado mÃ¡s barato, pero sugiere replanificar tras un rechazo.
- Orden interno: los ejecutores aceptan `IMPLEMENT/TODO` antes de que los gates lo escriban, para que en ningÃºn commit intermedio quede una historia rechazada sin ejecutor. STORY-188 y STORY-191 tocan los mismos gates de entrada.
- Mientras STORY-190 no estÃ© hecha, un rechazo de verify o acceptance deja `IMPLEMENT/TODO` sin `fix-directives.md` (fila 2 de AC-3), igual que hoy con `READY-FOR-IMPLEMENT/DONE`. STORY-190 aÃ±ade despuÃ©s, en ese caso, el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`; la fila sigue valiendo, porque el modo rework lo activa solo `fix-directives.md`.
- Depende de STORY-186.
