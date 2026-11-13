---
type: epic-analyze
id: EPIC-029
slug: EPIC-029-eliminar-estados-buffer-analyze-report
title: "Epic analyze: Eliminar estados buffer"
epic: EPIC-029
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
---
<!-- Referencias -->
[[EPIC-029-eliminar-estados-buffer]]

# Análisis de épica: Eliminar estados buffer

## Veredicto
**Veredicto:** `APPROVED` — sin hallazgos ERROR y 0 WARNING (umbral: 3)
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-029 (`specs/flow/EPIC-029-eliminar-estados-buffer/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 11/11 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 14/14 listas |
| Fecha | 2026-11-13 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-186 | 29 | sí | `specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-187 | 30 | sí | `specs/flow/STORY-187-dominio-sin-estados-buffer/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-188 | 31 | sí | `specs/flow/STORY-188-la-planificacion-termina-en-plan-done/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-189 | 32 | sí | `specs/flow/STORY-189-rework-de-revision-a-implement-todo/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-190 | 33 | sí | `specs/flow/STORY-190-directivas-de-correccion-desde-acceptance/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-191 | 34 | sí | `specs/flow/STORY-191-valor-legado-en-los-gates-de-entrada/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-192 | 35 | sí | `specs/flow/STORY-192-epica-sin-ready-for-dev/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-193 | 36 | sí | `specs/flow/STORY-193-aviso-de-estados-legados-en-skill-preflight/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-194 | 37 | sí | `specs/flow/STORY-194-guias-readme-y-ejemplos-sin-buffers/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-195 | 38 | sí | `specs/flow/STORY-195-requisitos-sin-estados-buffer/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-196 | 39 | sí | `specs/flow/STORY-196-story-plan-protege-plan-done/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-197 | 40 | sí | `specs/flow/STORY-197-rechazos-de-verify-y-acceptance-a-implement-todo/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-198 | 41 | sí | `specs/flow/STORY-198-directivas-de-correccion-desde-verify/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-199 | 42 | sí | `specs/flow/STORY-199-origen-del-rework-en-los-ejecutores/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` Un ADR nuevo, registrado en `docs/adr/README.md`, reemplaza a ADR-0006 y ADR-0008 (ambos con `status: SUPERSEDED` y `superseded-by` apuntando al ADR nuevo) y fija los workflows sin buffers, el rework en `IMPLEMENT/TODO`, el contrato de `fix-directives.md` con tres escritores, la aprobación de épica en `PLAN/DONE`, la regla del valor legado (`implement-report.md`) y la duración de la ventana de transición. `` | 46 | STORY-186 | STORY-186: mención · story.md:80 `- Cubre el criterio de salida **CS-1** de EPIC-029.` | ✓ |
| CS-2 | `` `/story-analyze` con `APPROVED` escribe `PLAN/DONE`; `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO`; `/story-implement` y `/story-implement-tasks` aceptan `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`, y solo `fix-directives.md` activa el modo rework. `` | 47 | STORY-188<br>STORY-189<br>STORY-197 | STORY-188: mención · story.md:70 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde al `evals.json` de `story-analyze`. ``<br>STORY-189: mención · story.md:76 `` - Cubre la parte de revisión del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`. ``<br>STORY-197: mención · story.md:68 `` - Cubre la parte de verify y acceptance del criterio de salida **CS-2** de EPIC-029 y la parte de **CS-7** que corresponde a los `evals.json` de `story-verify` y `story-acceptance` en los estados nuevos (los casos de `fix-directives.md` son de STORY-190). `` | ✓ |
| CS-3 | `` `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `fix-directives.md` desde `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte; en los tres gates, `round` continúa la numeración de rondas de la historia aunque `story-code-review` haya aprobado entre medias; las filas de un rechazo de aceptación usan la dimensión `requirements-coverage`, de modo que `/story-implement` exige un test del criterio rechazado; y `/story-implement` y `/story-implement-tasks` avisan si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`. `` | 48 | STORY-190<br>STORY-198<br>STORY-199 | STORY-190: mención · story.md:78 `` - Cubre el **SMOKE-4** de EPIC-029, y la parte de **CS-3** y **CS-7** que corresponde a la plantilla común, a `round` y a `story-acceptance`. ``<br>STORY-198: mención · story.md:75 `` - Derivada del split de STORY-190 (2026-11-13, patrón 4). Cubre la parte de **CS-3** y **CS-7** que corresponde a `story-verify`. ``<br>STORY-199: mención · story.md:71 `` - Derivada del split de STORY-190 (2026-11-13, patrón 4). Cubre la parte de **CS-3** que pide el aviso ante `IMPLEMENT/TODO` sin `fix-directives.md`. `` | ✓ |
| CS-4 | `` Ante una historia en `READY-FOR-IMPLEMENT/DONE`, `/story-implement` y `/story-implement-tasks` avisan del valor legado y la tratan como `IMPLEMENT/TODO` si existe `implement-report.md` y como `PLAN/DONE` si no, `/epic-analyze` no emite MAD-03 por ese valor y `/skill-preflight` la informa con un `[WARNING]` sin modificar archivos. `` | 49 | STORY-191<br>STORY-192<br>STORY-193 | STORY-191: mención · story.md:84 `` - Cubre la parte de los ejecutores del criterio de salida **CS-4** de EPIC-029, la parte del ejecutor del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement` y `story-implement-tasks`. ``<br>STORY-192: mención · story.md:80 `` - Cubre la parte de `epic-analyze` del criterio de salida **CS-4** de EPIC-029 (no emite MAD-03 por el valor legado) y la parte de **CS-6** que corresponde a los skills de épica. ``<br>STORY-193: mención · story.md:79 `` - Cubre la parte de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, la parte de preflight del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `skill-preflight`. `` | ✓ |
| CS-5 | `` `domain-state-management`, `domain-story-lifecycle` y `domain-epic-lifecycle` declaran los workflows sin buffers; ninguna invariante, gate ni objeto de valor define un WIP limit de cola, y `TODO` aplica a cualquier estado activo. `` | 50 | STORY-187<br>STORY-195 | STORY-187: mención · story.md:71 `` - Cubre el criterio de salida **CS-5** de EPIC-029 en lo que toca a `docs/domains/`, y la parte de **CS-6** de los cuatro documentos de dominio. El resto de CS-5 y CS-6 lo cubre STORY-195. ``<br>STORY-195: mención · story.md:75 `` - Cubre la parte del criterio de salida **CS-5** de EPIC-029 que toca a `docs/architecture/state-machine.md`, `domain-skills-map.md` y `docs/requirements/`, y la parte de **CS-6** de esos documentos. El dominio lo cubre STORY-187. `` | ✓ |
| CS-6 | `` `grep -rnE "READY-FOR-(IMPLEMENT\|DEV)" skills docs README.md` solo devuelve los registros históricos (ADR-0003, ADR-0006, ADR-0008 y las propuestas fechadas de `docs/product/roadmap.md`), el ADR nuevo y las menciones del valor legado en la ventana de transición (gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals). `` | 51 | STORY-187<br>STORY-191<br>STORY-192<br>STORY-194<br>STORY-195 | STORY-187: mención · story.md:58 `` - **CNF-2 — Sin valor legado en el dominio:** los cuatro documentos no mencionan `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV`; la ventana de transición se describe en el ADR y en los skills que la aplican (CS-6). ``<br>STORY-191: mención · story.md:68 `` - **CNF-1 — Mención acotada:** en los `SKILL.md` de `story-implement` y `story-implement-tasks`, `READY-FOR-IMPLEMENT` solo aparece en el gate de entrada y su aviso, marcado como valor legado de la ventana de transición (CS-6). El resto del skill usa los estados nuevos. ``<br>STORY-192: mención · story.md:64 `` - **CNF-1 — Mención acotada:** en `epic-analyze`, `READY-FOR-IMPLEMENT` solo aparece en la regla del valor legado y sus evals (CS-6). `epic-refine`, `sal-corrections.md` y `epic-generate-all-stories` no nombran ningún buffer. ``<br>STORY-194: mención · story.md:85 `` - Cierra el criterio de salida **CS-6** de EPIC-029 y cubre la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`. Va al final de la épica, porque el `grep` de AC-1 depende de las demás historias. ``<br>STORY-195: mención · story.md:62 `` - **CNF-2 — Requisitos sin ventana de transición:** FR-043/044/045 y NFR-006 describen el comportamiento destino; la compatibilidad con `READY-FOR-IMPLEMENT/DONE` vive en el ADR y en los skills que la aplican (CS-6). `` | ✓ |
| CS-7 | `` Los `evals.json` de los 8 skills que hoy nombran los buffers (`story-analyze`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `story-fix-plan`) usan los estados nuevos; los de `story-verify` y `story-acceptance` incluyen casos de `fix-directives.md`; los de `story-implement`, `story-implement-tasks` y `skill-preflight` incluyen casos del valor legado; y `npm run verify:repository` y `npm test` pasan sin errores. `` | 52 | STORY-188<br>STORY-189<br>STORY-190<br>STORY-191<br>STORY-193<br>STORY-194<br>STORY-196<br>STORY-197<br>STORY-198 | STORY-188: mención · story.md:70 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde al `evals.json` de `story-analyze`. ``<br>STORY-189: mención · story.md:76 `` - Cubre la parte de revisión del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`. ``<br>STORY-190: mención · story.md:59 `` - **CNF-4 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-acceptance` (parte de CS-7), y los del `round` continuo en los de `story-code-review`, antes de cambiar sus `SKILL.md` (principio 11 de la constitución). ``<br>STORY-191: mención · story.md:70 `` - **CNF-2 — Evals primero:** los casos del valor legado (con y sin `implement-report.md`) se escriben en `evals/evals.json` de `story-implement` y `story-implement-tasks` antes de cambiar los `SKILL.md` (CS-7, principio 11 de la constitución). ``<br>STORY-193: mención · story.md:67 `` - **CNF-3 — Evals primero:** los casos de status legado (historia con y sin `implement-report.md`, épica y archivo) se escriben en `skills/skill-preflight/evals/evals.json` antes de cambiar el `SKILL.md` (CS-7, principio 11 de la constitución). ``<br>STORY-194: mención · story.md:85 `` - Cierra el criterio de salida **CS-6** de EPIC-029 y cubre la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`. Va al final de la épica, porque el `grep` de AC-1 depende de las demás historias. ``<br>STORY-196: mención · story.md:68 `` - Derivada del split de STORY-188 del 2026-11-13 (Patrón 4, complejidad de criterios). Cubre la parte de **CS-7** de EPIC-029 que corresponde al `evals.json` de `story-plan`. ``<br>STORY-197: mención · story.md:68 `` - Cubre la parte de verify y acceptance del criterio de salida **CS-2** de EPIC-029 y la parte de **CS-7** que corresponde a los `evals.json` de `story-verify` y `story-acceptance` en los estados nuevos (los casos de `fix-directives.md` son de STORY-190). ``<br>STORY-198: mención · story.md:59 `` - **CNF-3 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-verify` (parte de CS-7) antes de cambiar su `SKILL.md` (principio 11 de la constitución). `` | ✓ |
| SMOKE-1 | `Planificación aprobada sin buffer` | 56 | STORY-188 | STORY-188: mención · story.md:70 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde al `evals.json` de `story-analyze`. `` | ✓ |
| SMOKE-2 | `Rework por revisión en IMPLEMENT/TODO` | 64 | STORY-189 | STORY-189: mención · story.md:76 `` - Cubre la parte de revisión del criterio de salida **CS-2** de EPIC-029, el **SMOKE-2** completo y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`. `` | ✓ |
| SMOKE-3 | `Historia legada durante la ventana de transición` | 72 | STORY-191<br>STORY-193 | STORY-191: mención · story.md:84 `` - Cubre la parte de los ejecutores del criterio de salida **CS-4** de EPIC-029, la parte del ejecutor del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement` y `story-implement-tasks`. ``<br>STORY-193: mención · story.md:79 `` - Cubre la parte de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, la parte de preflight del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `skill-preflight`. `` | ✓ |
| SMOKE-4 | `Rework por aceptación con directivas` | 80 | STORY-190 | STORY-190: mención · story.md:78 `` - Cubre el **SMOKE-4** de EPIC-029, y la parte de **CS-3** y **CS-7** que corresponde a la plantilla común, a `round` y a `story-acceptance`. `` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

Sin notas.
