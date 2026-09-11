---
alwaysApply: false
type: story
id: STORY-089
kind: feat
slug: STORY-089-rechazo-nombra-ejecutor-correcciones
title: "Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
created: 2026-09-10
updated: 2026-09-11
related:
  - EPIC-19-framework-consistency
  - STORY-091-story-implement-modo-rework
  - STORY-092-reglas-robustez-modo-rework
  - STORY-090-campos-declarados-nombran-su-escritor
  - STORY-067-story-implement-continuar-parcial
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-091-story-implement-modo-rework]]
[[STORY-092-reglas-robustez-modo-rework]]

# 📖 Historia: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md

**Como** desarrollador que recibe un veredicto `needs-changes` de `/story-code-review`  
**Quiero** que el rechazo devuelva la historia a la cola `READY-FOR-IMPLEMENT/DONE`, deje `fix-directives.md` como única señal de rework (con su número de ronda) y me indique en el propio mensaje qué skill ejecutar para corregir  
**Para** saber siempre cuál es el siguiente paso tras un rechazo, sin crear un estado nuevo, sin editar el frontmatter a mano y sin que el flujo dependa de que exista `tasks.md`

## ✅ Criterios de aceptación

### Escenario principal – El rechazo encola la historia y nombra al ejecutor de correcciones
```gherkin
Dado que "story.md" de STORY-NNN tiene status: IMPLEMENT y substatus: DONE
  Y "/story-code-review STORY-NNN" consolida al menos un hallazgo de severidad HIGH o MEDIUM
Cuando el review cierra con review-status: needs-changes
Entonces "story.md" queda en status: READY-FOR-IMPLEMENT y substatus: DONE
  Y existe "fix-directives.md" en el directorio de la historia con el campo round: 1 en su frontmatter
  Y no se añade ninguna tarea a "tasks.md"
  Y el mensaje final indica "→ Ejecuta /story-implement STORY-NNN"
```

### Escenario alternativo – Segunda ronda de rechazo
```gherkin
Dado que existe "fix-directives.md" con round: 1 en el directorio de la historia
  Y "story.md" tiene status: IMPLEMENT y substatus: DONE
Cuando "/story-code-review STORY-NNN" vuelve a cerrar con review-status: needs-changes
Entonces "fix-directives.md" se sobreescribe con round: 2
  Y el mensaje final menciona "/story-implement-tasks STORY-NNN" como alternativa solo si existe "tasks.md"
```

### Escenario alternativo – La aprobación limpia la señal de rework
```gherkin
Dado que existe "fix-directives.md" de una ronda anterior
  Y "story.md" tiene status: IMPLEMENT y substatus: DONE
Cuando "/story-code-review STORY-NNN" cierra con review-status: approved
Entonces "fix-directives.md" se elimina del directorio de la historia
  Y "story.md" queda en status: CODE-REVIEW y substatus: DONE
```

### Requerimiento: La señal de rework es el artefacto, no el estado
- Ningún estado ni substatus nuevo (`NEEDS-CHANGES`, `FIX`, `REWORK`) ni campo `rework:` en `story.md`. La única señal de que una historia está en ciclo de corrección es la presencia de `fix-directives.md` en su directorio.
- El destino del rechazo sigue siendo `READY-FOR-IMPLEMENT/DONE`: es una cola real (nadie está trabajando tras el rechazo), respeta el WIP limit del buffer, mide la espera del rework como tiempo de cola y mantiene coherentes los tres gates (`story-code-review`, `story-verify`, `story-acceptance`) con la invariante 6 de `domain-story-lifecycle.md`.

### Requerimiento: Número de ronda
- `round` en el frontmatter de `fix-directives.md` cuenta las ejecuciones de `story-code-review` que han cerrado en `needs-changes` para la historia: ronda previa + 1 si el archivo existe; `1` si no. Escritor único: `story-code-review`.

### Requerimiento: story-implement-tasks deja de depender del literal de tarea
- `story-implement-tasks` aplica las correcciones cuando `fix-directives.md` está presente, sin necesidad de que `tasks.md` contenga la tarea `"Implementar fix-directives.md"`. Este cambio es condición para que `story-code-review` deje de escribir esa tarea.

## ⚙️ Criterios no funcionales

* Documentación: `fix-directives-template.md` nombra al ejecutor y corrige el estado inexistente `READY-FOR-VERIFY`; `domain-story-lifecycle.md` (glosario "Rework") y `domain-state-management.md` §5.3 indican que la señal de rework es el artefacto de fallo (se retira la mención al substatus `REWORK`); `sddf-commands-pipeline.md`, `README.md` y `CHANGELOG.md` reflejan el flujo post-review.
* Decisión registrada: nuevo ADR (`ADR-0008-rework-sin-estado-propio.md`) que cita que `NEEDS-CHANGES` era la propuesta de EPIC-19 (Escenario 3) y queda descartada. No supersede ADR-0003.
* Épica alineada: `epic.md` de EPIC-19 (Escenario 3, dependencia crítica y riesgo) deja de citar `NEEDS-CHANGES` y la ruta inexistente `docs/knowledge/guides/state-machine.md`.
* Idempotencia: re-ejecutar `/story-code-review` en `needs-changes` sobreescribe `fix-directives.md` e incrementa `round`; ninguna otra escritura se repite.

## Fuera de alcance (Non-Goals)

- El modo rework de `story-implement` (gate de estado, detección, bundle, reporte): [[STORY-091-story-implement-modo-rework]].
- Las reglas de RED sin tests nuevos y de archivos fuera de la lista blanca: [[STORY-092-reglas-robustez-modo-rework]].
- Rechazos de `story-verify` y `story-acceptance`: siguen encolando la historia pero sin ejecutor automático; su señal se define en una historia posterior.
- Archivar rondas anteriores de `fix-directives.md` y `code-review-report.md` en lugar de sobreescribir.

## 📎 Notas / contexto adicional

### Por qué no existe un estado de corrección

EPIC-19 preveía un estado `NEEDS-CHANGES`. Se descarta porque: (1) corregir no es una actividad distinta de implementar — cambia el motivo, no el trabajo; (2) un estado propio duplicaría `story-implement`; (3) fragmenta el lead time; (4) colisiona con "bug fix" (`kind: fix` ya ocupa ese significado); (5) en Trunk-Based Development el rework son commits adicionales en la misma rama; (6) cada estado añade transiciones, reglas y documentación. De las tres estrategias evaluadas para señalar el rework (substatus `REWORK`, campo `rework:` en el frontmatter, detección por artefacto) se elige la detección por artefacto: cero cambios de esquema, y `fix-directives.md` ya se crea en `needs-changes` y se elimina en `approved`.

### Historias hermanas del split

Esta historia es la core de un split por pasos del flujo (patrón 1): emisor del rechazo (esta) → ejecutor de correcciones ([[STORY-091-story-implement-modo-rework]]) → endurecimiento del ejecutor ([[STORY-092-reglas-robustez-modo-rework]]). Orden de implementación: 089 → 091 → 092.

### Fixture de verificación

STORY-090 está hoy en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (5 hallazgos MEDIUM) y sin `round`. Tras esta historia, un nuevo `/story-code-review STORY-090` en `needs-changes` debe escribir `round: 1` y nombrar a `/story-implement`.

### Desalineaciones detectadas en el repo

- `story-code-review` (paso 4g.1) escribe la tarea `"Implementar fix-directives.md"` en `tasks.md` solo si el archivo existe; sin `tasks.md` no hay camino de corrección.
- `fix-directives-template.md` cita `READY-FOR-VERIFY`, estado que no existe en el pipeline.
- `domain-state-management.md` §5.3 menciona un substatus `REWORK` ajeno al conjunto cerrado de la invariante 2.
- `epic.md` de EPIC-19 referencia `docs/knowledge/guides/state-machine.md`, ruta inexistente.
