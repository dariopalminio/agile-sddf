---
alwaysApply: false
type: story
id: STORY-089
kind: feat
slug: STORY-089-story-fix-post-code-review
title: "Ciclo de corrección con dueño tras un code review rechazado"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-10
updated: 2026-09-10
related:
  - EPIC-19-framework-consistency
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]

# 📖 Historia: Ciclo de corrección con dueño tras un code review rechazado

**Como** desarrollador que recibe un veredicto `needs-changes` de `/story-code-review`
**Quiero** que el rechazo deje la historia en un estado propio y con un ejecutor de correcciones al que el propio mensaje me remita
**Para** aplicar los hallazgos y volver a revisión sin editar el frontmatter a mano ni depender de que la historia tenga `tasks.md`

## ✅ Criterios de aceptación

### Escenario principal – El rechazo deja una entrega accionable e inequívoca
```gherkin
Dado una historia en estado CODE-REVIEW/IN-PROGRESS con al menos un hallazgo bloqueante
Cuando /story-code-review cierra la revisión con review-status "needs-changes"
Entonces genera fix-directives.md en el directorio de la historia
  Y deja story.md en estado CODE-REVIEW con substatus NEEDS-CHANGES
  Y su mensaje final indica ejecutar "/story-fix <story_id>" como paso siguiente
  Y no menciona reejecutar /story-code-review como acción inmediata
```

### Escenario alternativo – Corrección aplicada en una historia planificada sin tasks.md
```gherkin
Dado una historia en estado CODE-REVIEW/NEEDS-CHANGES con fix-directives.md presente
  Y el directorio de la historia contiene testcases.md pero no contiene tasks.md
Cuando ejecuto /story-fix sobre esa historia
Entonces se aplican las correcciones de cada fila de fix-directives.md sobre los archivos indicados
  Y se genera fix-report.md con el resultado por hallazgo (aplicado / omitido y motivo)
  Y story.md queda en estado IMPLEMENT con substatus DONE
  Y /story-code-review puede reejecutarse sin ninguna edición manual de frontmatter
```

### Escenario de error – Invocación fuera de las precondiciones
```gherkin
Dado que invoco /story-fix sobre una historia que no está en CODE-REVIEW/NEEDS-CHANGES
  O que sí está en ese estado pero no tiene fix-directives.md
Cuando el skill valida sus precondiciones
Entonces se detiene con un mensaje que nombra la precondición incumplida y el estado real encontrado
  Y no modifica ningún archivo de la historia ni del código fuente
  Pero indica el skill que corresponde ejecutar en su lugar
```

### Requerimiento: Independencia del método de planificación
El ejecutor de correcciones debe operar únicamente a partir de `fix-directives.md` y el frontmatter de `story.md`. No puede exigir `tasks.md` como artefacto obligatorio, porque `/story-plan --only-testcases` es una vía de planificación soportada por el framework.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definidos en `docs/knowledge/guides/skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos.

## ⚙️ Criterios no funcionales

* Trazabilidad: el estado `NEEDS-CHANGES` debe quedar reflejado en el documento canónico de la máquina de estados (`docs/knowledge/guides/state-machine.md`) junto con su skill de entrada y su skill de salida
* Degradación controlada: un hallazgo cuyo archivo no exista se reporta como omitido y no aborta las correcciones restantes
* Idempotencia: reejecutar `/story-fix` sobre una historia ya corregida no debe reaplicar cambios ni degradar el estado alcanzado

## 📎 Notas / contexto adicional

**Origen.** Auditoría del ciclo de corrección post-rechazo. El ciclo está cortado en tres puntos independientes verificados en el código: la línea `- [ ] Implementar fix-directives.md` que escribe `story-code-review` no coincide con el patrón de recolección `- [ ] T\d+` de `story-implement-tasks`; el rechazo deja la historia en `READY-FOR-IMPLEMENT/DONE` mientras el review exige `IMPLEMENT/DONE` para correr; y sin `tasks.md` el rechazo no deja rastro accionable alguno.

**Alternativas evaluadas.** Se optó por el enfoque A + D (skill propio `/story-fix` + estado propio `CODE-REVIEW/NEEDS-CHANGES`). Se descartó reparar el parser dentro de `story-implement-tasks` porque obligaría a hacer `tasks.md` obligatorio, rompiendo la promesa de `/story-plan --only-testcases`; y se descartó extender `story-implement` porque contradice el contrato que ese skill declara sobre sí mismo.

**Fuera de alcance de esta historia** (candidatas a historias hermanas dentro de EPIC-17):
- Retirar el sub-flujo de corrección alojado hoy dentro de `story-implement-tasks` para que el comportamiento tenga un solo dueño. Se excluye deliberadamente: `/story-fix` puede convivir con ese sub-flujo sin romper nada, porque el estado `CODE-REVIEW/NEEDS-CHANGES` hace que la vía antigua deje de ser alcanzable por sí sola. Retirarlo es un refactor de un skill existente, con su propio alcance y sus propias pruebas
- El estado inexistente `READY-FOR-VERIFY` prometido en el template de code review (el real es `CODE-REVIEW/DONE`)
- La ausencia de validación de precondición de estado en `story-implement`
- Los estados huérfanos sin skill de salida: `CODE-REVIEW/IN-PROGRESS`, `VERIFY/IN-PROGRESS`, `ACCEPTANCE/BLOCKED`
- La aplicación efectiva de la lista blanca de archivos permitidos, que hoy se declara vinculante y ningún skill lee ni hace cumplir. Es el candidato natural a residir en `/story-fix`, pero se especifica aparte para no comprometer el tamaño de esta historia
