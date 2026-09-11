---
alwaysApply: false
type: story
id: STORY-089
kind: feat
slug: STORY-089-story-fix-post-code-review
title: "Ciclo de corrección con dueño tras un rechazo del pipeline"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-10
updated: 2026-09-10
related:
  - EPIC-19-framework-consistency
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]

# 📖 Historia: Ciclo de corrección con dueño tras un rechazo del pipeline

**Como** desarrollador que recibe un veredicto `needs-changes` de `/story-code-review`
**Quiero** que el rechazo deje la historia en un estado propio de corrección (`FIX`) y con un ejecutor de correcciones al que el propio mensaje me remita
**Para** aplicar los hallazgos y volver a revisión sin editar el frontmatter a mano ni depender de que la historia tenga `tasks.md`

## ✅ Criterios de aceptación

### Escenario principal – El rechazo deja una entrega accionable e inequívoca
```gherkin
Dado una historia en estado CODE-REVIEW/IN-PROGRESS con al menos un hallazgo bloqueante
Cuando /story-code-review cierra la revisión con review-status "needs-changes"
Entonces genera fix-directives.md en el directorio de la historia
  Y deja story.md en estado FIX con substatus TODO
  Y su mensaje final indica ejecutar "/story-fix <story_id>" como paso siguiente
  Y no menciona reejecutar /story-code-review como acción inmediata
```

### Escenario alternativo – Corrección aplicada en una historia planificada sin tasks.md
```gherkin
Dado una historia en estado FIX/TODO con fix-directives.md presente
  Y el directorio de la historia contiene testcases.md pero no contiene tasks.md
Cuando ejecuto /story-fix sobre esa historia
Entonces story.md pasa a FIX/IN-PROGRESS antes de modificar cualquier otro archivo
  Y se aplican las correcciones de cada fila de fix-directives.md sobre los archivos indicados
  Y se genera fix-report.md con el resultado por hallazgo (aplicado / omitido y motivo)
  Y story.md queda en estado FIX con substatus DONE
  Y /story-code-review acepta FIX/DONE como precondición de entrada, sin ninguna edición manual de frontmatter
```

### Escenario de error – Invocación fuera de las precondiciones
```gherkin
Dado que invoco /story-fix sobre una historia que no está en FIX/TODO
  O que sí está en ese estado pero no tiene fix-directives.md
Cuando el skill valida sus precondiciones
Entonces se detiene con un mensaje que nombra la precondición incumplida y el estado real encontrado
  Y no modifica ningún archivo de la historia ni del código fuente
  Pero indica el skill que corresponde ejecutar en su lugar
```

### Requerimiento: Estado `FIX` como punto único de reentrada
Todo rechazo del pipeline converge en un único status de primer nivel, `FIX`, cuyo ciclo interno es `TODO` (rechazada, pendiente de corrección) → `IN-PROGRESS` (corrigiéndose) → `DONE` (corregida, lista para volver a revisión). `story-fix` es su única salida y, como todo skill del pipeline, cierra su propio status en `DONE`; es `story-code-review` quien mueve la historia a `CODE-REVIEW/IN-PROGRESS` al arrancar. La corrección vuelve a atravesar todos los gates (code review → verify → acceptance), sea cual sea el gate que rechazó.

En esta historia el único productor de `FIX/TODO` es `story-code-review`. El estado queda definido en el documento canónico de la máquina de estados como destino común de los tres gates (`CODE-REVIEW`, `VERIFY`, `ACCEPTANCE`); conectar `story-verify` y `story-acceptance` es una historia hermana (ver Notas).

### Requerimiento: Independencia del método de planificación
El ejecutor de correcciones debe operar únicamente a partir de `fix-directives.md` y el frontmatter de `story.md`. No puede exigir `tasks.md` como artefacto obligatorio, porque `/story-plan --only-testcases` es una vía de planificación soportada por el framework.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definidos en `docs/guides/skill-structural-pattern.md`. El skill se crea en `skills/story-fix/` (fuente única de skills según `AGENTS.md`), no en el directorio de instalación `.claude/skills/`.

### Requerimiento: Seguir lineamientos de skill-master y del checklist de creación de skills
Se debe seguir y respetar los lineamientos del skill `skill-master` y de `docs/policies/skill-creation-checklist.md` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. En particular, las frases gatillo van dentro de `description` (el checklist rechaza la clave `triggers:` en el frontmatter).

## ⚙️ Criterios no funcionales

* Trazabilidad: el estado `FIX` (con su ciclo `TODO → IN-PROGRESS → DONE`) debe quedar reflejado en el documento canónico de la máquina de estados (`docs/domain/state-machine.md`) y en la descripción narrativa del workflow (`docs/domain/specs_and_workflows.md`), junto con su skill de entrada (`story-code-review`) y su skill de salida (`story-fix`). El nuevo status se añade al enum canónico de frontmatter (`docs/guides/skill-structural-pattern.md` §8, `skills/header-aggregation/SKILL.md`) y la decisión se registra en un ADR que extiende ADR-0006.
* Degradación controlada: un hallazgo cuyo archivo no exista se reporta como omitido y no aborta las correcciones restantes
* Idempotencia: reejecutar `/story-fix` sobre una historia ya corregida (`FIX/DONE`) no debe reaplicar cambios ni degradar el estado alcanzado

## 📎 Notas / contexto adicional

**Origen.** Auditoría del ciclo de corrección post-rechazo. El ciclo está cortado en tres puntos independientes verificados en el código: la línea `- [ ] Implementar fix-directives.md` que escribe `story-code-review` no coincide con el patrón de recolección `- [ ] T\d+` de `story-implement-tasks`; el rechazo deja la historia en `READY-FOR-IMPLEMENT/DONE` mientras el review exige `IMPLEMENT/DONE` para correr; y sin `tasks.md` el rechazo no deja rastro accionable alguno.

**Alternativas evaluadas.** Se optó por un skill propio `/story-fix` más un status propio de primer nivel `FIX`, sink común de los tres gates de rechazo. Se descartaron:
- Reparar el parser dentro de `story-implement-tasks`: obligaría a hacer `tasks.md` obligatorio, rompiendo la promesa de `/story-plan --only-testcases`.
- Extender `story-implement`: contradice el contrato que ese skill declara sobre sí mismo.
- Devolver la historia a `READY-FOR-IMPLEMENT` con una etiqueta de rechazo: sobrecarga la semántica del buffer ("planificada, esperando capacidad"), obliga a que cada lector de ese estado (`story-implement`, `story-implement-tasks`) bifurque por la etiqueta, y pierde la métrica de retrabajo; además la etiqueta sería un substatus o un campo nuevo, con el mismo coste de enum que un status.
- Un substatus local dentro de `CODE-REVIEW` (`NEEDS-CHANGES`): no sirve como destino común de `VERIFY` y `ACCEPTANCE`.
- Salir de `story-fix` a `IMPLEMENT/DONE`: ningún skill del pipeline escribe el `DONE` de un status ajeno; la salida canónica es `FIX/DONE` y `story-code-review` acepta ambas entradas (`IMPLEMENT/DONE | FIX/DONE`), con precedente en `story-implement`, que ya acepta dos precondiciones.

**Nomenclatura.** `FIX` respeta la convención de ADR-0003/0006 (estados nombrados por la acción que toca hacer) y coincide con el skill `story-fix` y el artefacto `fix-directives.md`.

**Fuera de alcance de esta historia** (candidatas a historias hermanas):
- Conectar `story-verify` (DoD ✗) y `story-acceptance` (≥1 REJECTED) al estado `FIX`: cambiar su retroceso de `READY-FOR-IMPLEMENT/DONE` a `FIX/TODO` y generar `fix-directives.md` (con `origin: verify | acceptance`) a partir de `verify-report.md` / `acceptance-report.md`. Esta historia deja definido el estado y el contrato del artefacto; la hermana conecta los dos productores restantes.
- Reanudación de `/story-fix` desde `FIX/IN-PROGRESS` (ejecución interrumpida) sin duplicar correcciones ya registradas en `fix-report.md`. En esta historia `story-fix` acepta solo `FIX/TODO`; una interrupción se resuelve reponiendo `substatus: TODO`.
- Aceptar `FIX/TODO` como precondición de `story-implement` (rework completo con TDD en lugar de corrección dirigida).
- Retirar el sub-flujo de corrección alojado hoy dentro de `story-implement-tasks` para que el comportamiento tenga un solo dueño. `/story-fix` puede convivir con ese sub-flujo sin romper nada, porque el estado `FIX` hace que la vía antigua deje de ser alcanzable por sí sola.
- Los estados huérfanos sin skill de salida: `CODE-REVIEW/IN-PROGRESS`, `VERIFY/IN-PROGRESS`, `ACCEPTANCE/BLOCKED`.
- La aplicación efectiva de la lista blanca de archivos permitidos, que hoy se declara vinculante y ningún skill lee ni hace cumplir. Es el candidato natural a residir en `/story-fix`, pero se especifica aparte para no comprometer el tamaño de esta historia.
