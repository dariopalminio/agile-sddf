---
type: adr
id: ADR-0008
slug: rework-sin-estado-propio
title: "Rework sin estado propio: la señal es el artefacto de fallo"
status: ACCEPTED
date: 2026-09-11
supersedes: null
superseded-by: null
---

<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]
[[STORY-091-story-implement-modo-rework]]
[[STORY-092-reglas-robustez-modo-rework]]
[[ADR-0003-workflow-canonico-story-y-epic]]
[[domain-story-lifecycle]]

# ADR-0008: Rework sin estado propio: la señal es el artefacto de fallo

## Contexto y problema

Un veredicto `needs-changes` de `story-code-review` devolvía la historia a `READY-FOR-IMPLEMENT/DONE`, pero el framework no decía con claridad **cómo se reconoce** que esa historia está en ciclo de corrección ni **quién** ejecuta las correcciones. Tres documentos daban tres respuestas distintas:

1. **[[EPIC-19-framework-consistency]], Escenario 3**, proponía un estado nuevo `NEEDS-CHANGES` como destino del rechazo, con su propio skill de entrada y de salida.
2. **`domain-state-management.md` §5.3** afirmaba que el skill de implementación detecta el rework "por el subestado `REWORK` o por la existencia de un reporte de fallo". `REWORK` no pertenece al conjunto cerrado de substatus (`TODO`, `IN-PROGRESS`, `DONE`, `BLOCKED`) que la invariante 2 de ese mismo documento declara.
3. **`story-code-review`** escribía la tarea `- [ ] Implementar fix-directives.md` al final de `tasks.md` *si el archivo existía*, y `story-implement-tasks` disparaba las correcciones solo al encontrar ese literal. El rework quedaba acoplado a un artefacto opcional (`tasks.md` solo existe si se ejecutó `story-tasking`): sin él no había camino de corrección, y cada ronda añadía una línea más.

La decisión afecta a tres skills (`story-code-review`, `story-implement-tasks` y, vía [[STORY-091-story-implement-modo-rework]], `story-implement`) y restringe cómo se diseñan los ejecutores de rework; la constitución (§16) exige registrarla como ADR.

## Decisión

**No existe estado ni substatus de rework.** El rechazo de `story-code-review` devuelve la historia a `READY-FOR-IMPLEMENT/DONE`, como fija la invariante 6 de [[domain-story-lifecycle]] ("todos los retrocesos apuntan a `READY-FOR-IMPLEMENT/DONE`"), y **la señal de que una historia está en rework es la presencia del artefacto de fallo en su directorio**: `fix-directives.md`, creado o sobreescrito únicamente en `needs-changes` y eliminado únicamente en `approved`.

`fix-directives.md` lleva en su frontmatter el campo `round: N` (ejecuciones de `story-code-review` cerradas en `needs-changes`; ronda previa + 1 si el archivo existe, `1` si no). Su escritor único es `story-code-review`. Los ejecutores de correcciones (`story-implement`, `story-implement-tasks`) detectan el rework **por la existencia del archivo**, no por un estado, un substatus, un campo en `story.md` ni una tarea en `tasks.md`. `story-code-review` deja de escribir en `tasks.md` y nombra al ejecutor en su mensaje de cierre (`/story-implement`; `/story-implement-tasks` como alternativa solo si existe `tasks.md`).

Este ADR **no supersede** a [[ADR-0003-workflow-canonico-story-y-epic]] ni a ADR-0006: el workflow canónico de story conserva los mismos estados y las mismas transiciones. Solo restringe cómo se señala el rework dentro de ese workflow.

## Rationale

Los argumentos contra un estado de corrección, registrados en las notas de [[STORY-089-rechazo-nombra-ejecutor-correcciones]]:

1. **Corregir no es una actividad distinta de implementar.** Cambia el motivo del trabajo (un hallazgo en vez de un criterio de aceptación), no el trabajo: leer, escribir tests, escribir código, ejecutar el DoD.
2. **Un estado propio duplicaría `story-implement`.** Necesitaría su propio skill de entrada con el mismo ciclo TDD, el mismo bundle y el mismo reporte.
3. **Fragmenta el lead time.** El tiempo en corrección es tiempo de implementación; un estado aparte lo saca de la métrica que interesa medir.
4. **Colisiona con `kind: fix`.** "Fix" ya significa *bug fix* en el vocabulario del framework (ADR-0005); un estado `FIX`/`NEEDS-CHANGES` obligaría a explicar dos sentidos del mismo término.
5. **En Trunk-Based Development el rework son commits adicionales en la misma rama.** No hay rama, PR ni etapa nueva que justifique un estado nuevo.
6. **Cada estado añade transiciones, reglas y documentación.** Máquina de estados, DoD, gates, templates, guías y dominios tendrían que incorporarlo; el coste es permanente y el beneficio, nulo.

Y a favor de mantener `READY-FOR-IMPLEMENT/DONE` como destino y del artefacto como señal:

7. **`READY-FOR-IMPLEMENT` es una cola real.** Tras el rechazo nadie está trabajando la historia; encolarla respeta el **WIP limit** del buffer (invariante 7 de [[domain-story-lifecycle]]) en lugar de esconder trabajo pendiente en un estado que no cuenta.
8. **Mide la espera del rework como tiempo de cola**, que es lo que es.
9. **Mantiene coherentes los tres gates.** `story-code-review`, `story-verify` y `story-acceptance` retroceden al mismo destino; un estado exclusivo del code review rompería esa simetría.
10. **Cero cambios de esquema.** `fix-directives.md` ya se creaba en `needs-changes` y se eliminaba en `approved`; convertir esa presencia en la señal no toca `story.md`, `story-template.md` ni los conjuntos cerrados de `status`/`substatus` (principio 8 de la constitución). Añadir `round` a un artefacto que ya tiene escritor único cumple el principio 13 sin anotar escritores nuevos en ningún template central.

## Alternativas consideradas

- **Estado `NEEDS-CHANGES` (propuesta original de EPIC-19, Escenario 3):** la historia sale de `IMPLEMENT` hacia un estado propio con skill de entrada y salida — descartada por los argumentos 1–6: duplica `story-implement`, fragmenta el lead time, colisiona con `kind: fix`, no encaja en TBD y añade transiciones, reglas y documentación a todo el pipeline; además rompe la invariante 6 y la simetría de los tres gates.
- **Substatus `REWORK` (mencionado en `domain-state-management.md` §5.3):** conservar `READY-FOR-IMPLEMENT` y marcar el rework en `substatus` — descartada porque abre el conjunto cerrado de substatus (invariante 2 de gestión de estados), obliga a que `story-code-review` escriba un valor que ningún otro gate escribe y duplica la información que el artefacto ya aporta.
- **Campo `rework:` (o `round:`) en el frontmatter de `story.md`:** — descartada porque cambia el esquema del frontmatter de historia, exige un escritor nuevo en `story-template.md` y vuelve a poner en `story.md` un dato que vive naturalmente en el artefacto que lo origina.
- **Skill `story-fix` dedicado a las correcciones:** — descartada porque duplicaría `story-implement` (argumento 2); el ejecutor de correcciones es el mismo skill de implementación en modo rework (STORY-091).
- **Tarea `- [ ] Implementar fix-directives.md` en `tasks.md` (as-is):** — descartada porque acopla el rework a un artefacto opcional, deja sin camino de corrección a las historias sin `tasks.md`, no es idempotente (cada ronda añade una línea) y convierte a `story-code-review` en escritor de un archivo que pertenece a `story-tasking`.

## Consecuencias

**Positivas:**
- Ningún cambio en los conjuntos cerrados de `status`/`substatus`, en `story-template.md` ni en la máquina de estados; la invariante 6 se mantiene literal.
- Un único contrato de señal para todos los ejecutores: existe `fix-directives.md` ⇔ hay correcciones pendientes de un `needs-changes`. STORY-091 y STORY-092 se construyen sobre él sin decisiones adicionales.
- `tasks.md` vuelve a tener escritores claros (`story-tasking` para el contenido, los skills de implementación para las marcas); el rechazo funciona igual con o sin `tasks.md`.
- Re-ejecutar `story-code-review` es idempotente: sobreescribe `fix-directives.md` e incrementa `round`; ninguna otra escritura se repite.
- El desarrollador sabe siempre el siguiente paso: el mensaje de rechazo nombra al ejecutor.

**Negativas / trade-offs:**
- **Deuda registrada:** los rechazos de `story-verify` y `story-acceptance` siguen encolando la historia en `READY-FOR-IMPLEMENT/DONE`, pero sus artefactos de fallo (`verify-report.md`, `acceptance-report.md`) aún no son reconocidos como señal de rework por los ejecutores; queda para una historia posterior extender el contrato a esos gates.
- El archivado de rondas anteriores de `fix-directives.md` y `code-review-report.md` queda fuera de alcance: cada ronda sobreescribe la anterior y el histórico vive en git.
- Un `fix-directives.md` editado a mano con un `round` no entero reinicia la cuenta en `1`; se pierde el número pero no se bloquea el pipeline.
- La señal es implícita (presencia de un archivo) en lugar de un valor legible en `story.md`; quien inspeccione solo el frontmatter no verá que la historia está en rework.

## Referencias

- [[EPIC-19-framework-consistency]] — Escenario 3, origen de la propuesta `NEEDS-CHANGES` descartada por este ADR
- [[STORY-089-rechazo-nombra-ejecutor-correcciones]] — historia que implementa la decisión (emisor del rechazo, `round`, ejecutor nombrado)
- [[STORY-091-story-implement-modo-rework]] — `story-implement` en modo rework, consumidor del contrato de señal
- [[STORY-092-reglas-robustez-modo-rework]] — reglas de robustez del modo rework
- [[ADR-0003-workflow-canonico-story-y-epic]] — workflow canónico de story; **no queda superado** por este ADR
- [[domain-story-lifecycle]] — glosario "Rework" e invariante 6 (destino de los retrocesos)
- `docs/domains/domain-state-management.md` — §5.3 transiciones de retroceso
- `skills/story-code-review/SKILL.md` — Pasos 4f, 4g y 7 (escritor de `fix-directives.md` y de `round`)
- `skills/story-implement-tasks/SKILL.md` — pre-paso 2f (correcciones por presencia del artefacto)
