---
alwaysApply: false
type: story
id: STORY-189
kind: feat
slug: STORY-189-rework-de-revision-a-implement-todo
title: "El rework de la revisión vuelve a IMPLEMENT/TODO"
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
  - STORY-191-valor-legado-en-los-gates-de-entrada
  - STORY-197-rechazos-de-verify-y-acceptance-a-implement-todo
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: El rework de la revisión vuelve a IMPLEMENT/TODO

**Como** Solo Builder que corrige una historia rechazada por la revisión de código  
**Quiero** que `/story-code-review` con `NEEDS-CHANGES` devuelva la historia a `IMPLEMENT/TODO` y que `/story-implement` y `/story-implement-tasks` la acepten, con el modo rework activado, como hoy, solo por `fix-directives.md`  
**Para** que el rework se vea en el frontmatter y una implementación rechazada en revisión no parezca pendiente de planificar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por revisión en IMPLEMENT/TODO
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE" con un defecto bloqueante de severidad HIGH
Cuando el usuario ejecuta "/story-code-review STORY-NNN" y luego "/story-implement STORY-NNN"
Entonces "/story-code-review" deja "story.md" en "IMPLEMENT/TODO" junto a "fix-directives.md"
  Y su resumen nombra "/story-implement" como ejecutor, y "/story-implement-tasks" como alternativa si existe "tasks.md"
  Y "/story-implement" acepta "IMPLEMENT/TODO", entra en modo rework y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 — Escenario alternativo – El ejecutor por tareas acepta el rework
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/TODO" con "fix-directives.md" de ronda 1
  Y "tasks.md" con todas sus tareas completadas
Cuando el usuario ejecuta "/story-implement-tasks STORY-NNN"
Entonces acepta la entrada, aplica las correcciones de la ronda 1 y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-3 — Escenario de error – BLOCKED de la revisión no cambia de destino
```gherkin
Dado una historia STORY-NNN en "IMPLEMENT/DONE"
  Y un revisor de "/story-code-review" que no entrega un informe válido
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el veredicto es "BLOCKED" y "story.md" queda en "IMPLEMENT/DONE"
  Pero no se genera "fix-directives.md"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals primero:** los casos de `IMPLEMENT/TODO` se escriben en `evals/evals.json` de `story-code-review`, `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución). `npm run test:eval` de esos skills se ejecuta a mano.

- **CNF-2 — Coordinación con el valor legado:** los gates de entrada de los ejecutores añaden `IMPLEMENT/TODO` sin retirar `READY-FOR-IMPLEMENT/DONE`; STORY-191 lo convierte en alias con aviso.

- **CNF-3 — Contrato de EPIC-28 intacto:** qué hallazgos entran en `fix-directives.md` (sin PREEXISTENTE ni `no verificado`, un fusionado una vez) y el cálculo de `round` de `story-code-review` no cambian en esta historia.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriban `IMPLEMENT/TODO`: STORY-197.
- Que `/story-verify` y `/story-acceptance` escriban `fix-directives.md`, la plantilla común, la numeración de `round` entre gates y el aviso por `IMPLEMENT/TODO` sin `fix-directives.md`: STORY-190.
- La clasificación del valor legado `READY-FOR-IMPLEMENT/DONE`: STORY-191.
- La salida aprobada de la planificación en `PLAN/DONE`: STORY-188.

## 📎 Notas / contexto adicional

- Cubre la parte de revisión del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`.
- Puntos de cambio (2026-11-13): `skills/story-code-review/SKILL.md:32` y los Pasos 4g, 6 y 7 (líneas 51, 148, 707, 714, 720, 814, 873, 897 y 934); los gates de entrada de `skills/story-implement/SKILL.md` (líneas 54 y 271-331) y de `skills/story-implement-tasks/SKILL.md` (líneas 42, 91, 139 y 236-266). Incluye los README de esos skills.
- Decisión de la épica: el rework vuelve a `IMPLEMENT/TODO` y no a `PLAN/DONE`. `PLAN/DONE` era el renombrado más barato, pero sugiere replanificar tras un rechazo.
- Orden: esta historia abre la entrada `IMPLEMENT/TODO` de los ejecutores, y STORY-197 la usa para verify y acceptance. Dentro de esta historia, los ejecutores aceptan `IMPLEMENT/TODO` antes de que `/story-code-review` lo escriba, para que en ningún commit intermedio quede una historia rechazada sin ejecutor. STORY-188 y STORY-191 tocan los mismos gates de entrada.
- Dividida de la STORY-189 original (`el-rework-vuelve-a-implement-todo`) por tamaño (FINVEST S = 1): la parte de verify y acceptance pasó a STORY-197.
- Depende de STORY-186.
