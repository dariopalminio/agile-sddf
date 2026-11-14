---
type: adr
id: ADR-0022
slug: workflows-sin-estados-buffer
title: "Workflows de Story y Epic sin estados buffer"
status: ACCEPTED
date: 2026-11-14
supersedes: [ADR-0006, ADR-0008]
superseded-by: null
---

<!-- Referencias -->
[[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[migracion-retroactiva-de-estados-de-epica]] · [[rework-sin-estado-propio]] · [[workflow-canonico-story-y-epic]] · [[guia-de-revision-review-md]] · [[NFR-006-control-de-ciclo-de-vida-con-status-substatus]]

# ADR-0022: Workflows de Story y Epic sin estados buffer

## Contexto y problema

[[migracion-retroactiva-de-estados-de-epica]] (ADR-0006) fija dos workflows con un estado buffer cada uno:

- **Historia:** `SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → …`. `READY-FOR-IMPLEMENT/DONE` dice lo mismo que
  `PLAN/DONE`: la planificación terminó y la historia espera a que alguien empiece a implementarla. Lo escribe
  `story-analyze` con `APPROVED` y lo lee `story-implement`, mientras `dod-story-plan.md` ya cierra la etapa en
  `PLAN/DONE` y `skills/memory-system/scripts/dod-story.js` ya omite el buffer.
- **Épica:** `DEFINE → PLAN → READY-FOR-DEV → DEVELOP → …`. `READY-FOR-DEV` nunca se usó: ningún archivo del historial
  de git tuvo `status: READY-FOR-DEV` y ningún skill lo escribe.

Los dos buffers mezclan la etapa con el progreso, que [[NFR-006-control-de-ciclo-de-vida-con-status-substatus]]
separa: `status` expresa la etapa y `substatus` el progreso. Su volumen es alto para lo que aportan: el 2026-11-07
había 290 ocurrencias en 68 archivos (96 en los `evals.json` de 8 skills y 24 en registros históricos), y la cola de
`READY-FOR-IMPLEMENT` llegó a 21 historias sin límite, porque la constitución (§9) solo limita `IN-PROGRESS`.

[[rework-sin-estado-propio]] (ADR-0008) fija que no hay estado ni substatus de rework, que la señal es
`fix-directives.md` y que todos los retrocesos van a `READY-FOR-IMPLEMENT/DONE`. También registra una deuda: los
rechazos de `story-verify` y `story-acceptance` no producen un artefacto que el ejecutor reconozca como señal de
rework, así que la historia vuelve a la cola sin decir qué hay que corregir.

[[EPIC-029-eliminar-estados-buffer]] retira los dos buffers, lleva el rework de los tres gates a un solo destino y
cierra esa deuda. La decisión afecta a los skills de planificación, a los tres gates, a los dos ejecutores, a
`skill-preflight` y a los skills de épica, y restringe a STORY-187 a STORY-193. Por eso, según la regla 16 de la
constitución, se registra en un ADR. La épica deja abiertas cuatro decisiones que este ADR cierra:

1. **La duración de la ventana de transición** del valor legado `READY-FOR-IMPLEMENT/DONE`.
2. **De dónde lee cada gate la ronda anterior**, porque `story-code-review` borra `fix-directives.md` al aprobar y
   `cycle-status.json` vive en `.tmp/`, que no se versiona.
3. **El nombre de la dimensión de verify** en `fix-directives.md`.
4. **La lista blanca de un rechazo de aceptación**, que no tiene archivo de origen.

## Decisión

agile-sddf retira los estados `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`. La salida aprobada de la planificación es
`PLAN/DONE`, en la historia y en la épica. Todo rework, venga del gate que venga, vuelve a `IMPLEMENT/TODO` con un
`fix-directives.md` que dice qué corregir. **No existe estado ni substatus de rework.**

### Workflows

**Historia:**

```
SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED
```

- `story-analyze` con `APPROVED` escribe `PLAN/DONE`.
- `story-implement` y `story-implement-tasks` aceptan como entrada `PLAN/DONE` (ejecución inicial), `IMPLEMENT/TODO`
  (rework) e `IMPLEMENT/IN-PROGRESS` (reanudación).

**Épica:**

```
DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED
```

- La aprobación del PO es `PLAN/DONE` y se escribe a mano: ningún skill la escribe.

**Reglas comunes:**

- `status` expresa la etapa y `substatus` el progreso (NFR-006).
- `TODO` significa «pendiente de iniciar» en cualquier estado activo, no solo en el primero.
- No hay WIP limit de cola. El WIP de la constitución (§9) solo limita `IN-PROGRESS`. La cola de trabajo listo es una
  consulta: primero `IMPLEMENT/TODO`, después `PLAN/DONE`.
- Los conjuntos cerrados de `status` y `substatus` solo pierden valores: este ADR no añade ninguno.

### Rework

- `story-code-review`, `story-verify` y `story-acceptance` con `NEEDS-CHANGES` escriben `status: IMPLEMENT` y
  `substatus: TODO` en `story.md`, y escriben `fix-directives.md` en el directorio de la historia.
- Se conserva la decisión de ADR-0008: **la única señal de rework es la presencia de `fix-directives.md`**. Los
  ejecutores entran en modo rework por la existencia del archivo, no por el estado, un substatus, un campo de
  `story.md` ni una tarea de `tasks.md`. `IMPLEMENT/TODO` dice que la historia está pendiente de iniciar en
  `IMPLEMENT`, no que esté en rework.

### Contrato de `fix-directives.md` con tres escritores

`fix-directives.md` pasa de un escritor (`story-code-review`) a tres, uno por gate. Los tres escriben el mismo
contrato: frontmatter `type: fix-directives`, `story`, `title`, `date`, `max-severity`, `round` y `based-on`; la
tabla `| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |`; la lista blanca de archivos
permitidos para modificar; y el ciclo de corrección. Lo que cambia por gate:

| Gate | `based-on` | Filas que entran | `Dimensión` | `Archivo:Línea` | `Severidad` | Lista blanca |
|---|---|---|---|---|---|---|
| `story-code-review` | `code-review-report.md` | los hallazgos bloqueantes, sin los `PREEXISTENTE` ni los `no verificado`; un hallazgo fusionado entra una vez, con `Reportado por:` (ADR-0021) | la del revisor (`code-quality`, `requirements-coverage`, `integration-architecture`, `security`) o `DoD-CODE-REVIEW` | la del hallazgo | la del hallazgo | los archivos de las filas que entran |
| `story-verify` | `verify-report.md` | cada defecto `CRITICAL` o `HIGH` abierto de `## Findings` y cada criterio del DoD VERIFY con `❌` | `verify-defect` | el `Location` del defecto, o `<ruta del DoD>:<línea>` del criterio | la del defecto, o `HIGH` en un criterio del DoD | las rutas del repositorio citadas en el `Location` de las filas que entran |
| `story-acceptance` | `acceptance-report.md` | cada criterio `REJECTED` | `requirements-coverage` | `story.md:<línea del encabezado del AC>` | `HIGH` | vacía, sin error |

- **Dimensión de verify, `verify-defect`.** No es `requirements-coverage`, así que la regla de evidencia de
  `story-implement` (Paso 6b) da una advertencia y no exige un test nuevo: un defecto de verify suele venir de un test
  que ya existe y falla. La regla ya trata cualquier dimensión distinta de `requirements-coverage` como advertencia,
  así que `verify-defect` no exige ningún cambio en el ejecutor.
- **Dimensión de aceptación, `requirements-coverage`.** Un criterio rechazado es un requisito no cubierto, así que
  `story-implement` exige el test del criterio antes de corregir el código.
- **Lista blanca de aceptación, vacía.** El rechazo no tiene archivo de origen. Una lista vacía no es un error: el
  ejecutor, en modo interactivo, pide confirmar en cada fase los archivos existentes que modifica y, con `--auto`, los
  registra en `### Archivos fuera de lista blanca` de `implement-report.md`.
- **Ciclo de corrección común.** Todo rework vuelve a pasar por `/story-code-review`, que es el único que borra
  `fix-directives.md`, y solo al aprobar. `story-verify` y `story-acceptance` nunca lo borran. Tras la revisión, la
  historia vuelve a recorrer el pipeline hasta el gate que la rechazó.
- **Plantilla común.** El contrato vive en `docs/templates/fix-directives-template.md`, con `based-on` como
  placeholder. La crea STORY-190 a partir de `skills/story-code-review/assets/fix-directives-template.md`.

### Ronda de rework

`round` cuenta todas las rondas de rework de la historia, venga del gate que venga, y no vuelve a 1 cuando
`story-code-review` aprueba. Los tres gates la calculan igual:

- `round = ronda previa + 1`.
- La ronda previa es el **máximo** entero ≥ 1 entre dos fuentes versionadas del directorio de la historia:
  1. el `round` del frontmatter de `fix-directives.md`, si el archivo existe;
  2. los `N` de los encabezados de nivel 2 de `implement-report.md` con la forma `## Ciclo de corrección — ronda N`
     (`story-implement`) o `## Correcciones de fix-directives.md (ronda N)` (`story-implement-tasks`).
- Sin ningún valor válido, la ronda previa es `0` y `round` es `1`, sin error.

Ejemplo: `story-code-review` aprueba la ronda 1 y borra `fix-directives.md`, pero `implement-report.md` conserva
`## Ciclo de corrección — ronda 1`. Si después `story-verify` rechaza, `round` es máx(—, 1) + 1 = 2. Si un gate
rechaza dos veces sin una implementación entre medias, cuenta el `round` de `fix-directives.md` (N) y da N + 1.

### Valor legado y ventana de transición

- En un proyecto en 6.x, una historia con `status: READY-FOR-IMPLEMENT` y `substatus: DONE` se trata como
  `IMPLEMENT/TODO` si existe `implement-report.md` en su directorio, y como `PLAN/DONE` si no existe.
- La regla mapea el valor legado a dos estados que ya existen: no define ningún estado ni substatus de rework.
- `story-implement` y `story-implement-tasks` aceptan el valor legado con un aviso. `skill-preflight` informa con un
  `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` con un `status` legado y el estado al que editarlo, sin
  modificar ningún archivo.
- La migración es una edición manual del frontmatter. No hay `memory-system migrate` para este cambio.
- `READY-FOR-DEV` no tiene tratamiento en ejecución, porque ningún archivo lo usó nunca: solo lo avisa
  `skill-preflight`.
- **La ventana se abre en 6.0.0 y termina en 7.0.0**, que retira el alias de los ejecutores y los avisos de
  `skill-preflight`.

## Rationale

1. **Simplicidad y coherencia con NFR-006.** Los buffers se retiran porque mezclan la etapa con el progreso y
   duplican `PLAN/DONE`, no por el argumento Lean: quitar el estado no elimina la espera, que nace de planificar
   épicas enteras por adelantado. Con `status` como etapa y `substatus` como progreso, `PLAN/DONE` ya dice «planificada
   y lista para empezar».
2. **Se conserva la señal de ADR-0008 y se cierra su deuda.** Siguen valiendo sus argumentos 1 a 6 contra un estado de
   rework: corregir no es una actividad distinta de implementar, un estado propio duplicaría `story-implement` y cada
   estado añade transiciones, reglas y documentación. Que `story-verify` y `story-acceptance` escriban
   `fix-directives.md` lleva lo que rechazó el gate al ejecutor, en el formato que ya sabe leer, sin un artefacto nuevo.
3. **`IMPLEMENT/TODO` y no `PLAN/DONE` como destino del rework.** El rework es trabajo de implementación pendiente de
   iniciar. Devolver la historia a `PLAN/DONE` tras un rechazo de VERIFY o ACCEPTANCE sugiere que hay que replanificar
   y mezcla la cola de historias listas para empezar con la de historias devueltas. El argumento 9 de ADR-0008 se
   mantiene: los tres gates retroceden al mismo destino.
4. **Dos fuentes versionadas para la ronda.** Una sola no basta: `fix-directives.md` se borra al aprobar y
   `implement-report.md` solo existe tras implementar. El máximo de las dos se calcula con dos lecturas, sin campos
   nuevos en `story.md` ni escritores nuevos, y sigue el principio de ADR-0008 de que el dato de rework vive en los
   artefactos que lo originan.
5. **Una ventana de una versión mayor.** Retirar un valor aceptado es un cambio BREAKING según el versionado
   semántico. Abrir la ventana en 6.0.0 y cerrarla en 7.0.0 da un ciclo mayor completo para migrar y deja la fecha de
   cierre escrita, para que el alias no quede de forma permanente.
6. **`implement-report.md` y no `fix-directives.md` para clasificar el valor legado.** Antes de 6.0.0 solo
   `story-code-review` escribía `fix-directives.md`, así que una historia legada rechazada en VERIFY o ACCEPTANCE no lo
   tiene. `implement-report.md` existe en toda historia que pasó por la implementación.

## Alternativas consideradas

**Destino y señal del rework:**

- **Rework en `PLAN/DONE`:** es el renombrado más barato, porque solo cambia el destino de los retrocesos — descartada
  porque, tras un rechazo de VERIFY o ACCEPTANCE, sugiere que hay que replanificar, y mezcla la cola de historias
  listas para empezar con la de historias devueltas.
- **Que los ejecutores lean `verify-report.md` y `acceptance-report.md`:** sin artefacto nuevo para verify y
  acceptance — descartada porque los ejecutores tendrían que leer tres formatos distintos, y los reportes conservan
  `NEEDS-CHANGES` después de corregir, hasta que el gate vuelve a ejecutarse.
- **Usar el estado como señal de rework:** que `IMPLEMENT/TODO` active el modo rework — descartada porque la señal se
  pierde al reanudar en `IMPLEMENT/IN-PROGRESS` y el estado no dice qué hay que corregir.
- **Estado `NEEDS-CHANGES` o substatus `REWORK`:** descartada por los motivos de ADR-0008, que se mantienen: duplica
  `story-implement` y abre el conjunto cerrado de substatus.

**Valor legado y ventana:**

- **Clasificar el valor legado por la presencia de `fix-directives.md`:** la regla de la propuesta original —
  descartada porque clasificaba como `PLAN/DONE` los rechazos de verify y acceptance, que antes de 6.0.0 no escribían
  ese archivo.
- **Conservar `READY-FOR-IMPLEMENT` como alias permanente de `PLAN/DONE`:** descartada porque duplica la semántica y
  mantiene las ocurrencias que la épica retira.
- **Una ventana sin versión de cierre:** descartada porque el alias quedaría de forma permanente.
- **Una ventana hasta una versión menor (6.1.0):** descartada porque retiraría un valor aceptado sin una versión mayor.
- **Migración automática con `memory-system migrate`:** descartada en la épica: el cambio es una edición de una línea
  por archivo y el aviso de `skill-preflight` basta para encontrarlos.

**Ronda de rework:**

- **Campo `round` (o `rework`) en el frontmatter de `story.md`:** descartada porque cambia el esquema de historia y
  añade un escritor, lo que ADR-0008 ya rechazó.
- **Leer la ronda de `cycle-status.json`:** descartada porque vive en `.tmp/`, que no se versiona.
- **Leer la ronda solo de `fix-directives.md`:** descartada porque `story-code-review` lo borra al aprobar y la
  numeración volvería a 1 en el siguiente rechazo de verify o acceptance.

**Dimensión de verify y lista blanca de aceptación:**

- **`requirements-coverage` como dimensión de verify:** descartada porque exigiría un test nuevo aunque el test que
  falla ya sea la evidencia.
- **`DoD-VERIFY` como dimensión de verify:** descartada porque los defectos de una prueba manual no son criterios del
  DoD.
- **`test-failure` como dimensión de verify:** descartada porque un defecto encontrado en una prueba manual no es un
  test fallido.
- **Lista blanca de aceptación con los archivos que tocó la implementación:** descartada porque no tiene fuente
  versionada: `cycle-status.json` vive en `.tmp/` e `implement-report.md` solo lista archivos en modo rework.
- **Inferir la lista blanca de aceptación de git:** descartada porque no es determinista.

## Consecuencias

**Positivas:**

- Un solo destino de rework para los tres gates, visible en el frontmatter: `IMPLEMENT/TODO`.
- Se cierra la deuda de ADR-0008: lo que rechazan verify y acceptance llega al ejecutor como una corrección concreta.
- Sin cambio de esquema en `story.md`: la ronda y la señal de rework viven en artefactos que ya existen.
- Los conjuntos cerrados de `status` y `substatus` solo pierden valores, y `status` vuelve a expresar solo la etapa.
- STORY-187 a STORY-193 aplican una sola decisión y no reabren el destino del rework, el contrato de directivas ni la
  regla del valor legado en su `design.md`.

**Negativas / trade-offs:**

- **Cambio BREAKING (6.0.0):** los proyectos consumidores editan a mano los `status` legados durante la ventana, con
  el aviso de `skill-preflight`. Tras 7.0.0, una historia sin migrar queda sin ejecutor que la acepte.
- La lista blanca vacía de un rechazo de aceptación hace que el ejecutor interactivo pida más confirmaciones.
- La regla de ronda depende de dos encabezados distintos de `implement-report.md`, uno por ejecutor. Si se unifican,
  hace falta un ADR nuevo que reemplace «Ronda de rework», o que el encabezado nuevo conserve una de las dos formas.
- La espera del rework deja de medirse como tiempo de cola (argumentos 7 y 8 de ADR-0008). `TODO` sigue siendo
  «pendiente de iniciar», y la cola pasa a ser una consulta sobre `IMPLEMENT/TODO` y `PLAN/DONE`.
- `fix-directives.md` pasa de un escritor a tres: el principio de escritor único se cumple por gate, no por archivo.

## Referencias

- [[workflow-canonico-story-y-epic]] — ADR-0003, registro histórico de los workflows con buffers; no cambia
- [[migracion-retroactiva-de-estados-de-epica]] — ADR-0006, reemplazado por este ADR
- [[rework-sin-estado-propio]] — ADR-0008, reemplazado por este ADR; su señal de rework se conserva
- [[guia-de-revision-review-md]] — ADR-0021, qué hallazgos de `story-code-review` entran en `fix-directives.md`
- [[NFR-006-control-de-ciclo-de-vida-con-status-substatus]] — `status` como etapa y `substatus` como progreso
- [[EPIC-029-eliminar-estados-buffer]] — épica que origina la decisión
- [[STORY-186-adr-de-workflows-sin-estados-buffer]] — historia que registra este ADR
- [[STORY-187-dominio-y-requisitos-sin-buffers]], [[STORY-188-la-planificacion-termina-en-plan-done]],
  [[STORY-189-el-rework-vuelve-a-implement-todo]], [[STORY-190-directivas-de-correccion-desde-verify-y-acceptance]],
  [[STORY-191-valor-legado-durante-la-ventana-de-transicion]], [[STORY-192-epica-sin-ready-for-dev]],
  [[STORY-193-guias-readme-y-ejemplos-sin-buffers]] — historias que aplican este ADR
- `skills/story-code-review/assets/fix-directives-template.md` — contrato de `fix-directives.md` del que parte la
  plantilla común
