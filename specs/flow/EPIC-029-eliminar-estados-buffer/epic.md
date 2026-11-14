---
type: epic
id: EPIC-029
slug: EPIC-029-eliminar-estados-buffer
title: "Eliminar estados buffer"
status: PLAN
substatus: IN-PROGRESS
parent: null
created: 2026-11-07
updated: 2026-11-14
related: []
---

# Épica: Eliminar estados buffer

## Objetivo

Simplificar el modelo de estados y volverlo coherente retirando los dos únicos estados buffer del framework, `READY-FOR-IMPLEMENT` (dice lo mismo que `PLAN/DONE`) y `READY-FOR-DEV` (nunca se usó), para que `status` exprese solo la etapa y `substatus` el progreso, como define NFR-006, y que todo rework, venga del gate que venga, se vea en el estado y llegue al ejecutor con lo que hay que corregir.

## Alcance

- Un ADR nuevo que reemplaza a ADR-0006 y ADR-0008: workflow de historia `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, workflow de épica `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`, rework en `IMPLEMENT/TODO` sin estado ni substatus propios y una ventana de compatibilidad para el valor legado.
- Pipeline de historia: `story-analyze` con `APPROVED` escribe `PLAN/DONE`; `story-code-review`, `story-verify` y `story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO` y `fix-directives.md` desde una plantilla común; `story-implement` y `story-implement-tasks` aceptan `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`, detectan el rework de los tres gates y, durante la ventana, aceptan también `READY-FOR-IMPLEMENT/DONE` con un aviso.
- Épica: `epic-analyze`, `epic-refine` y `epic-generate-all-stories` sin buffers; la aprobación del PO pasa a ser `PLAN/DONE`, escrita a mano.
- Documentos de dominio, `state-machine.md`, requisitos (NFR-006, FR-043/044/045), guías, README y ejemplos sin buffers; `skill-preflight` avisa de los `status` legados que queden en `specs/flow/`.

## Historias

- [x] **STORY-186** — ADR de workflows sin estados buffer: Como mantenedor de agile-sddf que va a implementar las historias de EPIC-029, quiero un ADR aceptado que reemplace a ADR-0006 y ADR-0008 y fije los workflows sin buffers, `PLAN/DONE` como salida aprobada de la planificación de historia y de épica, el rework en `IMPLEMENT/TODO` sin estado ni substatus propios, el contrato de `fix-directives.md` con tres escritores y la ventana de compatibilidad de `READY-FOR-IMPLEMENT/DONE`, para que las demás historias de la épica implementen una sola decisión y ninguna tenga que reabrir el destino del rework, el contrato de directivas o la regla del valor legado en su `design.md`
- [ ] **STORY-187** — Dominio, requisitos y máquina de estados sin buffers: Como Solo Builder que consulta el dominio, la máquina de estados y los requisitos para entender el ciclo de vida de historias y épicas, quiero que `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md`, `domain-epic-lifecycle.md`, `domain-skills-map.md`, `state-machine.md`, NFR-006 y FR-043/044/045 describan los workflows sin buffers del ADR, con el rework de los tres gates en `IMPLEMENT/TODO`, sin WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo, para que el ciclo de vida que aprendo en la documentación de autoridad sea el mismo que escriben los skills en el frontmatter
- [ ] **STORY-188** — La planificación termina en PLAN/DONE: Como Solo Builder que planifica una historia y la pasa a implementación, quiero que una planificación aprobada por `/story-analyze` termine en `PLAN/DONE`, que los ejecutores acepten ese estado como entrada y que `/story-plan` devuelva a `PLAN/IN-PROGRESS` una historia que encuentre en `PLAN/DONE` sin un `analyze.md` aprobado, para pasar de la planificación a la implementación sin el estado buffer `READY-FOR-IMPLEMENT` y sin que una historia llegue a los ejecutores con la planificación cerrada sin un análisis aprobado
- [ ] **STORY-189** — El rework de los tres gates vuelve a IMPLEMENT/TODO: Como Solo Builder que corrige una historia rechazada por la revisión de código, la verificación o la aceptación, quiero que `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` devuelvan la historia a `IMPLEMENT/TODO` y nombren al ejecutor que la retoma, y que `/story-implement` y `/story-implement-tasks` acepten ese estado, con el modo rework activado, como hoy, solo por `fix-directives.md`, para que el rework se vea en el frontmatter y un rechazo después de implementar no sugiera replanificar la historia
- [ ] **STORY-190** — Directivas de corrección desde verify y acceptance: Como Solo Builder que corrige una historia rechazada en VERIFY o en ACCEPTANCE, quiero que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriban `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte y un `round` que continúe las rondas de rework de la historia, y que los ejecutores anuncien qué gate abrió el rework y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`, para que lo que rechazó el gate llegue al ejecutor como una corrección concreta y se cierre la deuda que registró ADR-0008
- [ ] **STORY-191** — Valor legado durante la ventana de transición: Como Solo Builder que actualiza agile-sddf a 6.0.0 con historias ya planificadas, quiero que `/story-implement` y `/story-implement-tasks` acepten `READY-FOR-IMPLEMENT/DONE` con un aviso y la traten como `IMPLEMENT/TODO` si existe `implement-report.md` o como `PLAN/DONE` si no, y que `/skill-preflight` informe con un `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` con un `status` legado y el estado al que editarlo a mano, sin modificar ningún archivo, para no bloquear el trabajo planificado antes de actualizar y cerrar la ventana sabiendo qué falta migrar
- [ ] **STORY-192** — Épica sin READY-FOR-DEV: Como Solo Builder que planifica, refina y analiza una épica antes de que el PO la apruebe, quiero que los skills de épica dejen de nombrar los estados buffer y que `/epic-analyze` acepte, con un aviso, una historia hija que conserva el valor legado `READY-FOR-IMPLEMENT`, para que `/epic-analyze` me indique el paso real de aprobación (`PLAN/DONE`, editado a mano) y no marque como no clasificables las historias planificadas antes de 6.0.0
- [ ] **STORY-193** — Guías, README y ejemplos sin buffers: Como Solo Builder que aprende agile-sddf con sus guías, su README y los ejemplos de los skills, quiero que las guías de `docs/guides/`, `docs/architecture/sdcl-sddf.md`, el diagrama de relaciones del flujo de story, `README.md`, el indicador de `docs/product/objectives.md` y los ejemplos y fixtures de `memory-system`, `story-design`, `story-tasking` y `story-fix-plan` (este último también en su `evals.json`) muestren los workflows sin buffers, para no aprender un estado que el framework ya no escribe

## Criterios de salida

- [ ] **CS-1** — Un ADR nuevo, registrado en `docs/adr/README.md`, reemplaza a ADR-0006 y ADR-0008 (ambos con `status: SUPERSEDED` y `superseded-by` apuntando al ADR nuevo) y fija los workflows sin buffers, el rework en `IMPLEMENT/TODO`, el contrato de `fix-directives.md` con tres escritores, la aprobación de épica en `PLAN/DONE`, la regla del valor legado (`implement-report.md`) y la duración de la ventana de transición.
- [ ] **CS-2** — `/story-analyze` con `APPROVED` escribe `PLAN/DONE`; `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO`; `/story-implement` y `/story-implement-tasks` aceptan `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`, y solo `fix-directives.md` activa el modo rework.
- [ ] **CS-3** — `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `fix-directives.md` desde `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte; en los tres gates, `round` continúa la numeración de rondas de la historia aunque `story-code-review` haya aprobado entre medias; las filas de un rechazo de aceptación usan la dimensión `requirements-coverage`, de modo que `/story-implement` exige un test del criterio rechazado; y `/story-implement` y `/story-implement-tasks` avisan si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`.
- [ ] **CS-4** — Ante una historia en `READY-FOR-IMPLEMENT/DONE`, `/story-implement` y `/story-implement-tasks` avisan del valor legado y la tratan como `IMPLEMENT/TODO` si existe `implement-report.md` y como `PLAN/DONE` si no, `/epic-analyze` no emite MAD-03 por ese valor y `/skill-preflight` la informa con un `[WARNING]` sin modificar archivos.
- [ ] **CS-5** — `domain-state-management`, `domain-story-lifecycle` y `domain-epic-lifecycle` declaran los workflows sin buffers; ninguna invariante, gate ni objeto de valor define un WIP limit de cola, y `TODO` aplica a cualquier estado activo.
- [ ] **CS-6** — `grep -rnE "READY-FOR-(IMPLEMENT|DEV)" skills docs README.md` solo devuelve los registros históricos (ADR-0003, ADR-0006, ADR-0008 y las propuestas fechadas de `docs/product/roadmap.md`), el ADR nuevo y las menciones del valor legado en la ventana de transición (gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals).
- [ ] **CS-7** — Los `evals.json` de los 8 skills que hoy nombran los buffers (`story-analyze`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `story-fix-plan`) usan los estados nuevos; los de `story-verify` y `story-acceptance` incluyen casos de `fix-directives.md`; los de `story-implement`, `story-implement-tasks` y `skill-preflight` incluyen casos del valor legado; y `npm run verify:repository` y `npm test` pasan sin errores.

## Smoke tests

### SMOKE-1 — Planificación aprobada sin buffer
```gherkin
Escenario: Planificación aprobada sin buffer
  Dado una historia STORY-NNN en PLAN/IN-PROGRESS con design.md, tasks.md y testcases.md coherentes con story.md
  Cuando el usuario ejecuta /story-analyze STORY-NNN y luego /story-implement STORY-NNN
  Entonces story-analyze emite APPROVED y deja story.md en PLAN/DONE, y story-implement la acepta y la pasa a IMPLEMENT/IN-PROGRESS
```

### SMOKE-2 — Rework por revisión en IMPLEMENT/TODO
```gherkin
Escenario: Rework por revisión en IMPLEMENT/TODO
  Dado una historia STORY-NNN en IMPLEMENT/DONE con un defecto bloqueante de severidad HIGH
  Cuando el usuario ejecuta /story-code-review STORY-NNN y luego /story-implement STORY-NNN
  Entonces story-code-review deja story.md en IMPLEMENT/TODO junto a fix-directives.md, y story-implement la acepta en modo rework
```

### SMOKE-3 — Historia legada durante la ventana de transición
```gherkin
Escenario: Historia legada durante la ventana de transición
  Dado un proyecto actualizado a 6.0.0 con una historia STORY-NNN en READY-FOR-IMPLEMENT/DONE, sin implement-report.md ni fix-directives.md
  Cuando el usuario ejecuta /skill-preflight y luego /story-implement STORY-NNN
  Entonces skill-preflight informa el status legado con un [WARNING] sin modificar archivos, y story-implement avisa del valor legado, la trata como PLAN/DONE y la pasa a IMPLEMENT/IN-PROGRESS
```

### SMOKE-4 — Rework por aceptación con directivas
```gherkin
Escenario: Rework por aceptación con directivas
  Dado una historia STORY-NNN en VERIFY/DONE
  Cuando el validador rechaza un criterio con una observación en /story-acceptance STORY-NNN y luego se ejecuta /story-implement STORY-NNN
  Entonces story.md queda en IMPLEMENT/TODO junto a fix-directives.md con based-on acceptance-report.md, y story-implement entra en modo rework y exige un test del criterio rechazado antes de corregir el código
```

## Notas

- **Fuente:** `.temp/propuestas-de-mejoras/mejora-016-eliminar-buffers.md` (2026-11-07), veredicto del análisis de mejora-012. Los buffers se retiran por simplicidad y coherencia, no por el argumento Lean: quitar el estado no elimina la espera, que nace de planificar épicas enteras por adelantado.
- **Evidencia:** ningún archivo del historial de git tuvo nunca `status: READY-FOR-DEV` (`git log -G`) y ningún skill lo escribe (`skills/epic-analyze/SKILL.md:77`). `READY-FOR-IMPLEMENT` lo escribe `story-analyze` y lo lee `story-implement`, mientras `dod-story-plan.md` cierra la etapa en `PLAN/DONE` y `skills/memory-system/scripts/dod-story.js:22` ya omite el buffer. Según la propuesta, la cola llegó a 21 historias sin límite: la constitución §9 solo limita `IN-PROGRESS`.
- **Volumen (2026-11-07):** 290 ocurrencias en 68 archivos, sin contar `specs/flow/archive/` ni los destinos de runtime; de ellas, 96 en los `evals.json` de 8 skills y 24 en registros históricos, y 10 `SKILL.md` las contienen. Ningún `story.md` ni `epic.md` de este repo tiene `READY-FOR-*` en el frontmatter. Cada historia actualiza el `SKILL.md`, el README, los ejemplos y los evals de los skills que toca; la de guías cubre el resto (incluido `skills/story-specify/README.md`).
- **Decisiones tomadas (2026-11-07):** el rework vuelve a `IMPLEMENT/TODO`, no a `PLAN/DONE` (renombrado más barato, pero sugiere replanificar tras un rechazo de VERIFY); los proyectos consumidores migran con el aviso de `skill-preflight` y edición manual, sin `memory-system migrate`; una historia legada en `READY-FOR-IMPLEMENT/DONE` es rework si tiene `implement-report.md` (la regla de la propuesta, basada en `fix-directives.md`, clasificaba como `PLAN/DONE` los rechazos de verify y acceptance); es un cambio BREAKING que lleva a 6.0.0 (hoy 5.1.1).
- **Rework de los tres gates:** `story-verify` y `story-acceptance` escriben `fix-directives.md`, que sigue siendo la única señal de rework, y así se cierra la deuda de ADR-0008. Se descartó que los ejecutores lean `verify-report.md` y `acceptance-report.md` (tres formatos, y conservan `NEEDS-CHANGES` después de corregir hasta que el gate vuelve a ejecutarse) y usar el estado como señal (se pierde al reanudar en `IMPLEMENT/IN-PROGRESS` y no dice qué corregir). `story-code-review` sigue borrando el archivo al aprobar, porque todo rework vuelve a pasar por la revisión. `round` cuenta todas las rondas de rework de la historia, venga del gate que venga, y no vuelve a 1 cuando `story-code-review` aprueba.
- **Decisiones para el ADR:** la duración de la ventana de transición (por ejemplo, hasta 7.0.0); de dónde lee cada gate la ronda anterior, porque `story-code-review` borra `fix-directives.md` al aprobar y `cycle-status.json` vive en `.tmp/`, que no se versiona (por ejemplo, la sección `## Ciclo de corrección — ronda N` de `implement-report.md`, que conserva la última ronda, o un campo nuevo en el frontmatter de `story.md`); el nombre de la dimensión de verify; y la lista blanca de un rechazo de aceptación, que no tiene archivo de origen (vacía no es error, pero en modo interactivo el ejecutor pide confirmar en cada fase los archivos existentes que modifica; una opción es usar los que tocó la implementación).
- **Registros históricos que no se editan:** ADR-0003, ADR-0006 y ADR-0008 (salvo `status` y `superseded-by` de los dos últimos), `CHANGELOG.md`, las propuestas fechadas de `docs/product/roadmap.md` y `specs/flow/archive/`.
- **Indicador de producto:** `docs/product/objectives.md:112` mide un "WIP configurable" de los buffers; su nueva redacción la confirma el PO. La cola de listos pasa a ser una consulta: primero `IMPLEMENT/TODO`, después `PLAN/DONE`.
- **Reagrupación (2026-11-13):** la especificación dejó 14 historias tras varios `/story-split` (STORY-187/195, 188/196, 189/197 y 190/198/199), y varias tocaban el mismo `SKILL.md` (`story-implement` y `story-implement-tasks`, cuatro historias; los tres gates, cuatro). Como cada historia paga un ciclo completo de planificación, revisión, verify y aceptación, se reagruparon en 8 por superficie de cambio: STORY-187 absorbe a STORY-195; STORY-188, a STORY-196; STORY-189, a STORY-197; STORY-190, a STORY-198 y STORY-199; STORY-191, a STORY-193. Las absorbidas quedan en `CANCELED/DONE` con `parent: null` y una nota que remite a la que las absorbe; las fusionadas vuelven a `SPECIFY/TODO` para reevaluarse con `/story-evaluation`. STORY-192 se mantiene entera para que `epic-analyze` y `epic-refine` los cambie una sola historia. Fuente: `.temp/propuestas-de-mejoras/mejora-021-desglose-de-epica.md`.
- **Orden y coordinación:** STORY-186 va primero; STORY-187 y STORY-192 pueden avanzar en cualquier orden tras ella. La cadena de los ejecutores es STORY-188 → STORY-189 → STORY-190 → STORY-191 (la parte de `skill-preflight` de STORY-191 solo depende del ADR), y STORY-193 cierra la épica porque su `grep` depende de las demás. Las historias de planificación y de rework añaden las entradas nuevas sin retirar `READY-FOR-IMPLEMENT/DONE`, y la del valor legado lo convierte en alias con aviso, para que ningún estado intermedio deje historias sin ejecutor. EPIC-28 también modifica `skills/story-code-review/SKILL.md`, su `evals.json` y qué hallazgos entran en `fix-directives.md`: con WIP=1 de épica no avanzan en paralelo, pero la segunda parte del estado que deje la primera, y la plantilla común de `fix-directives.md` debe recoger lo que cambie EPIC-28.
- **Release y evals:** `/epic-ship` escribe el bloque BREAKING de `CHANGELOG.md` con la ventana de transición y cómo editar los status legados; el bump a 6.0.0 es un paso humano. Cada historia que cambie un skill escribe primero sus casos en `evals/evals.json` (principio 11 de la constitución); `npm run test:eval` de los skills afectados se ejecuta a mano.
- **Fuera de alcance:** el substatus `HUMAN-REVIEW` (abre el conjunto cerrado de substatus, lo que ADR-0008 rechazó para `REWORK`; va en una propuesta aparte), un WIP configurable o un aviso de inventario para `PLAN/DONE`, y una política de planificación justo a tiempo, que es lo que de verdad reduce la espera.
