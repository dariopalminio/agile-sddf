---
alwaysApply: false
type: story
id: STORY-091
kind: feat
slug: STORY-091-story-implement-modo-rework
title: "story-implement toma de la cola una historia rechazada y corrige en modo rework"
status: SPECIFY
substatus: TODO
parent: EPIC-19-framework-consistency
created: 2026-09-11
updated: 2026-09-11
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

# 📖 Historia: story-implement toma de la cola una historia rechazada y corrige en modo rework

**Como** desarrollador que ejecuta `/story-implement` sobre una historia devuelta a la cola por un code review rechazado  
**Quiero** que el skill reconozca por sí solo que está en un ciclo de corrección, aplique un ciclo TDD acotado a los hallazgos de `fix-directives.md` y deje la historia lista para una nueva revisión  
**Para** cerrar el ciclo `needs-changes → approved` sin editar el frontmatter a mano y sin que la historia necesite `tasks.md`

## ✅ Criterios de aceptación

### Escenario principal – story-implement toma la historia de la cola en modo rework
```gherkin
Dado que "story.md" tiene status: READY-FOR-IMPLEMENT y substatus: DONE
  Y existe "fix-directives.md" con round: N en el directorio de la historia
  Y NO existe "tasks.md"
Cuando ejecuto "/story-implement STORY-NNN"
Entonces "story.md" pasa a status: IMPLEMENT y substatus: IN-PROGRESS al arrancar
  Y el skill anuncia "🔁 Modo rework (ronda N)" antes de la Fase RED
  Y las fases RED, GREEN y REFACTOR trabajan sobre los hallazgos y la lista blanca de "fix-directives.md"
  Y "implement-report.md" incluye una sección "Ciclo de corrección — ronda N"
  Y "story.md" termina en status: IMPLEMENT y substatus: DONE con la sugerencia de ejecutar "/story-code-review STORY-NNN"
```

### Escenario alternativo – Ejecución inicial sin fix-directives.md
```gherkin
Dado que "story.md" tiene status: READY-FOR-IMPLEMENT y substatus: DONE
  Y NO existe "fix-directives.md" en el directorio de la historia
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el ciclo TDD completo se ejecuta tal como lo hace hoy
  Pero no se anuncia modo rework ni se añade la sección "Ciclo de corrección" a "implement-report.md"
```

### Escenario alternativo – Estado no admitido
```gherkin
Dado que "story.md" tiene status: CODE-REVIEW y substatus: DONE
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el skill se detiene indicando el estado actual y los estados admitidos
  Pero no modifica ningún archivo
```

### Requerimiento: Precondición de estado y reanudación
- Estados admitidos: `READY-FOR-IMPLEMENT/DONE` (ejecución inicial o rework encolado) e `IMPLEMENT/IN-PROGRESS` (reanudación tras ciclo interrumpido o DoD con ❌). Cualquier otro estado detiene la ejecución sin modificar archivos, en espejo del gate 1d de `story-implement-tasks`.
- En reanudación, el modo (rework o normal) lo decide únicamente la presencia de `fix-directives.md`, no el estado.

### Requerimiento: Ciclo completo sin edición manual del frontmatter
- La secuencia `IMPLEMENT/DONE → needs-changes → READY-FOR-IMPLEMENT/DONE → /story-implement → IMPLEMENT/DONE → /story-code-review → approved → CODE-REVIEW/DONE` se completa sin que nadie edite el frontmatter a mano (Escenario 3 de EPIC-19).

### Requerimiento: Alcance del modo rework
- El modo rework reconoce **solo** `fix-directives.md` (rechazos de `story-code-review`). Los rechazos de `story-verify` y `story-acceptance` no se reconocen en esta historia.

## ⚙️ Criterios no funcionales

* Coherencia documental: la línea del posicionamiento de `story-implement` que afirma que `IMPLEMENT/IN-PROGRESS` "viene de story-code-review needs-changes" se corrige — el rework llega desde `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md`; la reanudación desde `IMPLEMENT/IN-PROGRESS` corresponde a ciclos interrumpidos o DoD pendiente.
* Idempotencia: re-ejecutar `/story-implement` con las correcciones ya aplicadas no produce cambios en código ni en `story.md`.
* Compatibilidad: una historia que ya esté en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (caso vivo: STORY-090) entra en modo rework sin migración previa.
* `tasks.md` sigue sin guiar el pipeline de `story-implement`.

## Fuera de alcance (Non-Goals)

- Qué ocurre cuando la Fase RED no genera tests nuevos, y qué ocurre con archivos fuera de la lista blanca: [[STORY-092-reglas-robustez-modo-rework]].
- Cambios en `story-code-review` (mensaje, `round`, `tasks.md`): [[STORY-089-rechazo-nombra-ejecutor-correcciones]].
- Reconocer reportes de fallo de `story-verify` o `story-acceptance`.

## 📎 Notas / contexto adicional

- Depende de [[STORY-089-rechazo-nombra-ejecutor-correcciones]] solo para el campo `round` del anuncio y del reporte; la detección por presencia del archivo funciona con los `fix-directives.md` existentes.
- Contexto ya acordado para PLAN: los test_generators y code_generators reciben en su bloque de contexto la ruta de `fix-directives.md` y la lista blanca (ambos `null` fuera del modo rework). Los nombres exactos de los campos se deciden en `design.md`.
- Fixture de verificación: `/story-implement STORY-090` debe anunciar `🔁 Modo rework` sin ningún paso previo.
- Tercera historia del split: [[STORY-092-reglas-robustez-modo-rework]]. Orden de implementación: 089 → 091 → 092.
