---
type: epic-analyze
id: EPIC-029
slug: EPIC-029-eliminar-estados-buffer-analyze-report
title: "Epic analyze: Eliminar estados buffer"
epic: EPIC-029
verdict: NEEDS-REFINEMENT
errors: 0
warnings: 9
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
---
<!-- Referencias -->
[[EPIC-029-eliminar-estados-buffer]]

# Análisis de épica: Eliminar estados buffer

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 9 hallazgos WARNING, por encima del umbral de 3
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-029 (`specs/flow/EPIC-029-eliminar-estados-buffer/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 9 |
| Contrato de salida | Contrato de salida: 11/11 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 0/9 listas |
| Fecha | 2026-11-13 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-186 | 29 | sí | `specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-187 | 30 | sí | `specs/flow/STORY-187-dominio-y-requisitos-sin-buffers/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-188 | 31 | sí | `specs/flow/STORY-188-la-planificacion-termina-en-plan-done/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-189 | 32 | sí | `specs/flow/STORY-189-el-rework-vuelve-a-implement-todo/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-190 | 33 | sí | `specs/flow/STORY-190-directivas-de-correccion-desde-verify-y-acceptance/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-191 | 34 | sí | `specs/flow/STORY-191-valor-legado-en-los-gates-de-entrada/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-192 | 35 | sí | `specs/flow/STORY-192-epica-sin-ready-for-dev/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-193 | 36 | sí | `specs/flow/STORY-193-aviso-de-estados-legados-en-skill-preflight/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |
| STORY-194 | 37 | sí | `specs/flow/STORY-194-guias-readme-y-ejemplos-sin-buffers/story.md` | `EPIC-029-eliminar-estados-buffer` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` Un ADR nuevo, registrado en `docs/adr/README.md`, reemplaza a ADR-0006 y ADR-0008 (ambos con `status: SUPERSEDED` y `superseded-by` apuntando al ADR nuevo) y fija los workflows sin buffers, el rework en `IMPLEMENT/TODO`, el contrato de `fix-directives.md` con tres escritores, la aprobación de épica en `PLAN/DONE`, la regla del valor legado (`implement-report.md`) y la duración de la ventana de transición. `` | 41 | STORY-186 | STORY-186: mención · story.md:80 `- Cubre el criterio de salida **CS-1** de EPIC-029.` | ✓ |
| CS-2 | `` `/story-analyze` con `APPROVED` escribe `PLAN/DONE`; `/story-code-review`, `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO`; `/story-implement` y `/story-implement-tasks` aceptan `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`, y solo `fix-directives.md` activa el modo rework. `` | 42 | STORY-188<br>STORY-189 | STORY-188: mención · story.md:93 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-analyze` y `story-plan`. ``<br>STORY-189: mención · story.md:90 `` - Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029 y el **SMOKE-2**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance`. `` | ✓ |
| CS-3 | `` `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriben `fix-directives.md` desde `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte; en los tres gates, `round` continúa la numeración de rondas de la historia aunque `story-code-review` haya aprobado entre medias; las filas de un rechazo de aceptación usan la dimensión `requirements-coverage`, de modo que `/story-implement` exige un test del criterio rechazado; y `/story-implement` y `/story-implement-tasks` avisan si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`. `` | 43 | STORY-190 | STORY-190: mención · story.md:97 `` - Cubre el criterio de salida **CS-3** de EPIC-029, el **SMOKE-4** y la parte de **CS-7** que pide casos de `fix-directives.md` en los evals de `story-verify` y `story-acceptance`. `` | ✓ |
| CS-4 | `` Ante una historia en `READY-FOR-IMPLEMENT/DONE`, `/story-implement` y `/story-implement-tasks` avisan del valor legado y la tratan como `IMPLEMENT/TODO` si existe `implement-report.md` y como `PLAN/DONE` si no, `/epic-analyze` no emite MAD-03 por ese valor y `/skill-preflight` la informa con un `[WARNING]` sin modificar archivos. `` | 44 | STORY-191<br>STORY-192<br>STORY-193 | STORY-191: mención · story.md:83 `` - Cubre la parte de los ejecutores del criterio de salida **CS-4** de EPIC-029, la parte del ejecutor del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement` y `story-implement-tasks`. ``<br>STORY-192: mención · story.md:81 `` - Cubre la parte de `epic-analyze` del criterio de salida **CS-4** de EPIC-029 (no emite MAD-03 por el valor legado) y la parte de **CS-6** que corresponde a los skills de épica. ``<br>STORY-193: mención · story.md:79 `` - Cubre la parte de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, la parte de preflight del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `skill-preflight`. `` | ✓ |
| CS-5 | `` `domain-state-management`, `domain-story-lifecycle` y `domain-epic-lifecycle` declaran los workflows sin buffers; ninguna invariante, gate ni objeto de valor define un WIP limit de cola, y `TODO` aplica a cualquier estado activo. `` | 45 | STORY-187 | STORY-187: mención · story.md:81 `` - Cubre el criterio de salida **CS-5** de EPIC-029 y la parte de **CS-6** que corresponde a `docs/domains/`, `docs/architecture/state-machine.md` y `docs/requirements/`. `` | ✓ |
| CS-6 | `` `grep -rnE "READY-FOR-(IMPLEMENT\|DEV)" skills docs README.md` solo devuelve los registros históricos (ADR-0003, ADR-0006, ADR-0008 y las propuestas fechadas de `docs/product/roadmap.md`), el ADR nuevo y las menciones del valor legado en la ventana de transición (gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals). `` | 46 | STORY-187<br>STORY-191<br>STORY-192<br>STORY-194 | STORY-187: mención · story.md:69 `` - **CNF-2 — Sin valor legado en la autoridad:** los documentos de dominio y de requisitos no mencionan `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV`; la ventana de transición se describe en el ADR y en los skills que la aplican (CS-6). ``<br>STORY-191: mención · story.md:67 `` - **CNF-1 — Mención acotada:** en los `SKILL.md` de `story-implement` y `story-implement-tasks`, `READY-FOR-IMPLEMENT` solo aparece en el gate de entrada y su aviso, marcado como valor legado de la ventana de transición (CS-6). El resto del skill usa los estados nuevos. ``<br>STORY-192: mención · story.md:65 `` - **CNF-1 — Mención acotada:** en `epic-analyze`, `READY-FOR-IMPLEMENT` solo aparece en la regla del valor legado y sus evals (CS-6). `epic-refine`, `sal-corrections.md` y `epic-generate-all-stories` no nombran ningún buffer. ``<br>STORY-194: mención · story.md:85 `` - Cierra el criterio de salida **CS-6** de EPIC-029 y cubre la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`. Va al final de la épica, porque el `grep` de AC-1 depende de las demás historias. `` | ✓ |
| CS-7 | `` Los `evals.json` de los 8 skills que hoy nombran los buffers (`story-analyze`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `story-fix-plan`) usan los estados nuevos; los de `story-verify` y `story-acceptance` incluyen casos de `fix-directives.md`; los de `story-implement`, `story-implement-tasks` y `skill-preflight` incluyen casos del valor legado; y `npm run verify:repository` y `npm test` pasan sin errores. `` | 47 | STORY-188<br>STORY-189<br>STORY-190<br>STORY-191<br>STORY-193<br>STORY-194 | STORY-188: mención · story.md:93 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-analyze` y `story-plan`. ``<br>STORY-189: mención · story.md:90 `` - Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029 y el **SMOKE-2**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance`. ``<br>STORY-190: mención · story.md:81 `` - **CNF-2 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-verify` y `story-acceptance` (CS-7), y los del origen del rework y del aviso en los de `story-implement` y `story-implement-tasks`, antes de cambiar los `SKILL.md` (principio 11 de la constitución). ``<br>STORY-191: mención · story.md:69 `` - **CNF-2 — Evals primero:** los casos del valor legado (con y sin `implement-report.md`) se escriben en `evals/evals.json` de `story-implement` y `story-implement-tasks` antes de cambiar los `SKILL.md` (CS-7, principio 11 de la constitución). ``<br>STORY-193: mención · story.md:67 `` - **CNF-3 — Evals primero:** los casos de status legado (historia con y sin `implement-report.md`, épica y archivo) se escriben en `skills/skill-preflight/evals/evals.json` antes de cambiar el `SKILL.md` (CS-7, principio 11 de la constitución). ``<br>STORY-194: mención · story.md:85 `` - Cierra el criterio de salida **CS-6** de EPIC-029 y cubre la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`. Va al final de la épica, porque el `grep` de AC-1 depende de las demás historias. `` | ✓ |
| SMOKE-1 | `Planificación aprobada sin buffer` | 51 | STORY-188 | STORY-188: mención · story.md:93 `` - Cubre la parte de planificación del criterio de salida **CS-2** de EPIC-029 y del **SMOKE-1**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-analyze` y `story-plan`. `` | ✓ |
| SMOKE-2 | `Rework por revisión en IMPLEMENT/TODO` | 59 | STORY-189 | STORY-189: mención · story.md:90 `` - Cubre la parte de rework del criterio de salida **CS-2** de EPIC-029 y el **SMOKE-2**, y la parte de **CS-7** que corresponde a los `evals.json` de `story-code-review`, `story-verify` y `story-acceptance`. `` | ✓ |
| SMOKE-3 | `Historia legada durante la ventana de transición` | 67 | STORY-191<br>STORY-193 | STORY-191: mención · story.md:83 `` - Cubre la parte de los ejecutores del criterio de salida **CS-4** de EPIC-029, la parte del ejecutor del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement` y `story-implement-tasks`. ``<br>STORY-193: mención · story.md:79 `` - Cubre la parte de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, la parte de preflight del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `skill-preflight`. `` | ✓ |
| SMOKE-4 | `Rework por aceptación con directivas` | 75 | STORY-190 | STORY-190: mención · story.md:97 `` - Cubre el criterio de salida **CS-3** de EPIC-029, el **SMOKE-4** y la parte de **CS-7** que pide casos de `fix-directives.md` en los evals de `story-verify` y `story-acceptance`. `` | ✓ |

## Hallazgos

### H-001 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-186` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-002 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-187` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-187-dominio-y-requisitos-sin-buffers/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-003 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-188` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-188-la-planificacion-termina-en-plan-done/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-004 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-189` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-189-el-rework-vuelve-a-implement-todo/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-005 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-190` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-190-directivas-de-correccion-desde-verify-y-acceptance/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-006 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-191` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-191-valor-legado-en-los-gates-de-entrada/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-007 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-192` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-192-epica-sin-ready-for-dev/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-008 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-193` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-193-aviso-de-estados-legados-en-skill-preflight/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

### H-009 [WARNING] — MAD-01: Historia hija sin especificación terminada

- **Elemento:** `STORY-194` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-194-guias-readme-y-ejemplos-sin-buffers/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

## Notas del análisis

Sin notas.
