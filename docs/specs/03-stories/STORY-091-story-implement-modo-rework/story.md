---
alwaysApply: false
type: story
id: STORY-091
kind: feat
slug: STORY-091-story-implement-modo-rework
title: "story-implement toma de la cola una historia rechazada y corrige en modo rework"
status: IMPLEMENT
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-11
updated: 2026-09-12
related:
  - EPIC-19-framework-consistency
  - STORY-089-rechazo-nombra-ejecutor-correcciones
  - STORY-092-reglas-robustez-modo-rework
  - STORY-067-story-implement-continuar-parcial
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]
[[STORY-092-reglas-robustez-modo-rework]]

# ðŸ“– Historia: story-implement toma de la cola una historia rechazada y corrige en modo rework

**Como** desarrollador que ejecuta `/story-implement` sobre una historia devuelta a la cola por un code review rechazado  
**Quiero** que el skill reconozca por sÃ­ solo que estÃ¡ en un ciclo de correcciÃ³n, aplique un ciclo TDD acotado a los hallazgos de `fix-directives.md` y deje la historia lista para una nueva revisiÃ³n  
**Para** cerrar el ciclo `needs-changes â†’ approved` sin editar el frontmatter a mano y sin que la historia necesite `tasks.md`

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ story-implement toma la historia de la cola en modo rework
```gherkin
Dado que "story.md" tiene status: READY-FOR-IMPLEMENT y substatus: DONE
  Y existe "fix-directives.md" con round: N en el directorio de la historia
  Y NO existe "tasks.md"
Cuando ejecuto "/story-implement STORY-NNN"
Entonces "story.md" pasa a status: IMPLEMENT y substatus: IN-PROGRESS al arrancar
  Y el skill anuncia "ðŸ” Modo rework (ronda N)" antes de la Fase RED
  Y las fases RED, GREEN y REFACTOR trabajan sobre los hallazgos y la lista blanca de "fix-directives.md"
  Y "implement-report.md" incluye una secciÃ³n "Ciclo de correcciÃ³n â€” ronda N"
  Y "story.md" termina en status: IMPLEMENT y substatus: DONE con la sugerencia de ejecutar "/story-code-review STORY-NNN"
```

### Escenario alternativo â€“ EjecuciÃ³n inicial sin fix-directives.md
```gherkin
Dado que "story.md" tiene status: READY-FOR-IMPLEMENT y substatus: DONE
  Y NO existe "fix-directives.md" en el directorio de la historia
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el ciclo TDD completo se ejecuta tal como lo hace hoy
  Pero no se anuncia modo rework ni se aÃ±ade la secciÃ³n "Ciclo de correcciÃ³n" a "implement-report.md"
```

### Escenario alternativo â€“ Estado no admitido
```gherkin
Dado que "story.md" tiene status: CODE-REVIEW y substatus: DONE
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el skill se detiene indicando el estado actual y los estados admitidos
  Pero no modifica ningÃºn archivo
```

### Requerimiento: PrecondiciÃ³n de estado y reanudaciÃ³n
- Estados admitidos: `READY-FOR-IMPLEMENT/DONE` (ejecuciÃ³n inicial o rework encolado) e `IMPLEMENT/IN-PROGRESS` (reanudaciÃ³n tras ciclo interrumpido o DoD con âŒ). Cualquier otro estado detiene la ejecuciÃ³n sin modificar archivos, en espejo del gate 1d de `story-implement-tasks`.
- En reanudaciÃ³n, el modo (rework o normal) lo decide Ãºnicamente la presencia de `fix-directives.md`, no el estado.

### Requerimiento: Ciclo completo sin ediciÃ³n manual del frontmatter
- La secuencia `IMPLEMENT/DONE â†’ needs-changes â†’ READY-FOR-IMPLEMENT/DONE â†’ /story-implement â†’ IMPLEMENT/DONE â†’ /story-code-review â†’ approved â†’ CODE-REVIEW/DONE` se completa sin que nadie edite el frontmatter a mano (Escenario 3 de EPIC-19).

### Requerimiento: Alcance del modo rework
- El modo rework reconoce **solo** `fix-directives.md` (rechazos de `story-code-review`). Los rechazos de `story-verify` y `story-acceptance` no se reconocen en esta historia.

## âš™ï¸ Criterios no funcionales

* Coherencia documental: la lÃ­nea del posicionamiento de `story-implement` que afirma que `IMPLEMENT/IN-PROGRESS` "viene de story-code-review needs-changes" se corrige â€” el rework llega desde `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md`; la reanudaciÃ³n desde `IMPLEMENT/IN-PROGRESS` corresponde a ciclos interrumpidos o DoD pendiente.
* Idempotencia: re-ejecutar `/story-implement` con las correcciones ya aplicadas no produce cambios en cÃ³digo ni en `story.md`.
* Compatibilidad: una historia que ya estÃ© en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (caso vivo: STORY-090) entra en modo rework sin migraciÃ³n previa.
* `tasks.md` sigue sin guiar el pipeline de `story-implement`.

## Fuera de alcance (Non-Goals)

- QuÃ© ocurre cuando la Fase RED no genera tests nuevos, y quÃ© ocurre con archivos fuera de la lista blanca: [[STORY-092-reglas-robustez-modo-rework]].
- Cambios en `story-code-review` (mensaje, `round`, `tasks.md`): [[STORY-089-rechazo-nombra-ejecutor-correcciones]].
- Reconocer reportes de fallo de `story-verify` o `story-acceptance`.

## ðŸ“Ž Notas / contexto adicional

- Depende de [[STORY-089-rechazo-nombra-ejecutor-correcciones]] solo para el campo `round` del anuncio y del reporte; la detecciÃ³n por presencia del archivo funciona con los `fix-directives.md` existentes.
- Contexto ya acordado para PLAN: los test_generators y code_generators reciben en su bloque de contexto la ruta de `fix-directives.md` y la lista blanca (ambos `null` fuera del modo rework). Los nombres exactos de los campos se deciden en `design.md`.
- Fixture de verificaciÃ³n: `/story-implement STORY-090` debe anunciar `ðŸ” Modo rework` sin ningÃºn paso previo.
- Tercera historia del split: [[STORY-092-reglas-robustez-modo-rework]]. Orden de implementaciÃ³n: 089 â†’ 091 â†’ 092.
