---
type: epic-analyze
id: EPIC-23
slug: EPIC-23-completar-flujo-de-epic-analyze-report
title: "Epic analyze: Completar flujo de epic"
epic: EPIC-23
verdict: NEEDS-REFINEMENT
errors: 0
warnings: 8
created: 2026-10-28
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
---
<!-- Referencias -->
[[EPIC-23-completar-flujo-de-epic]]

# Análisis de épica: Completar flujo de epic

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 8 hallazgos WARNING, por encima del umbral de 3
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-23 (`specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 8 |
| Contrato de salida | Contrato de salida: 28/29 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 7/14 listas |
| Fecha | 2026-10-28 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-124 | 51 | sí | `specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-125 | 52 | sí | `specs/flow/STORY-125-validar-evidencia-operativa-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-126 | 53 | sí | `specs/flow/STORY-126-operar-validacion-epica-segura/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-127 | 54 | sí | `specs/flow/STORY-127-integrar-adoptar-gateway-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-128 | 55 | sí | `specs/flow/STORY-128-evaluar-validacion-epica-repetible/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-137 | 56 | sí | `specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-165 | 45 | sí | `specs/flow/STORY-165-epic-refine/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-166 | 39 | sí | `specs/flow/STORY-166-veredicto-de-epic-format-validation/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-167 | 42 | sí | `specs/flow/STORY-167-skill-epic-improve/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-168 | 48 | sí | `specs/flow/STORY-168-skill-epic-track-progress/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-169 | 57 | sí | `specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-170 | 60 | sí | `specs/flow/STORY-170-skill-epic-ship/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-171 | 63 | sí | `specs/flow/STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-172 | 64 | sí | `specs/flow/STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `**CS-1** — skills/epic-validate/SKILL.md existe, resuelve solo REPO_ROOT y declara <!-- SDDF-FIXED-LAYOUT: v1 --> (ADR-0017).` | 69 | STORY-124 | mención · story.md:69 `- Cubre el criterio de salida de EPIC-23: **CS-1** — skills/epic-validate/SKILL.md existe, resuelve solo …` | ✓ |
| CS-2 | `**CS-2** — skills/epic-validate/assets/epic-validate-report-template.md existe, declara en cada sección su marcador sección obligatoria · clave · escritor y tiene ## Veredicto como primera sección tras el título.` | 70 | STORY-124 | mención · story.md:70 `- Cubre el criterio de salida de EPIC-23: **CS-2** — skills/epic-validate/assets/epic-validate-report-template.md existe, declara en cada sección su marcador …` | ✓ |
| CS-3 | `**CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.` | 71 | STORY-124 | mención · story.md:71 `- Cubre el criterio de salida de EPIC-23: **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.` | ✓ |
| CS-4 | `**CS-4** — Se verifican los smoke tests, verify:release y el DoD de épica cuando exista.` | 72 | STORY-125 | mención · story.md:87 `- Cubre el criterio de salida de EPIC-23: **CS-4** — Se verifican los smoke tests, verify:release y el DoD de épica cuando exista.` | ✓ |
| CS-5 | `**CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo verdict del frontmatter con el vocabulario único APPROVED, NEEDS-CHANGES o BLOCKED.` | 73 | STORY-124 | mención · story.md:72 `- Cubre el criterio de salida de EPIC-23: **CS-5** — El reporte se genera desde su plantilla sin …` | ✓ |
| CS-6 | `**CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.` | 74 | STORY-124 | mención · story.md:73 `- Cubre el criterio de salida de EPIC-23: **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.` | ✓ |
| CS-7 | `**CS-7** — El skill solo escribe epic-validate-report.md; no modifica código, fuentes ni otros documentos.` | 75 | STORY-126 | mención · story.md:87 `- Cubre el criterio de salida de EPIC-23: **CS-7** — El skill solo escribe epic-validate-report.md; no modifica código, fuentes ni otros documentos.` | ✓ |
| CS-8 | `**CS-8** — skills/epic-validate/ figura en el arreglo files de package.json.` | 76 | STORY-127 | mención · story.md:75 `- Cubre el criterio de salida de EPIC-23: **CS-8** — skills/epic-validate/ figura en el arreglo files de package.json.` | ✓ |
| CS-9 | `**CS-9** — skills/epic-validate/evals/evals.json incluye al menos una épica consistente que resulte APPROVED, una inconsistente que resulte NEEDS-CHANGES y una cuya evidencia no se puede obtener que resulte BLOCKED.` | 77 | STORY-128 | mención · story.md:77 `- Cubre el criterio de salida de EPIC-23: **CS-9** — skills/epic-validate/evals/evals.json incluye al menos una épica consistente …` | ✓ |
| CS-10 | `**CS-10** — Se reconocen y manejan correctamente los flags --mode manual, --mode auto, --dry-run y --verbose.` | 78 | STORY-137 | mención · story.md:73 `- Cubre el criterio de salida de EPIC-23: **CS-10** — Se reconocen y manejan correctamente los flags --mode manual, --mode auto, --dry-run y --verbose. Lo completa junto con STORY-126 …` | ✓ |
| CS-11 | `**CS-11** — En --mode auto, epic-validate ejecuta las suites de nivel épica declaradas en verify de sddf.config.yaml (integración, E2E y regresión completa) y registra el resultado de cada una en el reporte; una suite que falla produce NEEDS-CHANGES y una que no se puede ejecutar, BLOCKED.` | 79 | STORY-169 | mención · story.md:82 `- Cubre el criterio de salida de EPIC-23: **CS-11** — En --mode auto, epic-validate ejecuta las suites …` | ✓ |
| CS-12 | `**CS-12** — skills/<skill>/SKILL.md existe para epic-improve, epic-refine, epic-track-progress, epic-ship y epic-complete; cada uno declara <!-- SDDF-FIXED-LAYOUT: v1 -->, figura en el arreglo files de package.json y tiene evals/evals.json.` | 82 | STORY-171 | mención · story.md:85 `- Cubre el criterio de salida de EPIC-23: **CS-12** — skills/<skill>/SKILL.md existe para …` | ✓ |
| CS-13 | `**CS-13** — epic-format-validation declara un veredicto canónico: un epic.md conforme obtiene APPROVED y uno con faltantes o formato inválido obtiene NEEDS-REFINEMENT, con el diagnóstico de cada defecto.` | 83 | STORY-166 | mención · story.md:80 `- Cubre el criterio de salida de EPIC-23: **CS-13** — epic-format-validation declara un veredicto …` | ✓ |
| CS-14 | `**CS-14** — epic-improve crea epic.md.bak antes de escribir, solo modifica epic.md, no cambia status ni substatus y, tras aplicar sus correcciones, /epic-format-validation devuelve APPROVED para los defectos corregidos; lo que requiere decisión del PO queda listado sin modificarse.` | 84 | STORY-167 | mención · story.md:87 `- Cubre el criterio de salida de EPIC-23: **CS-14** — epic-improve crea epic.md.bak antes de escribir, …` | ✓ |
| CS-15 | `**CS-15** — epic-refine aplica los hallazgos de epic-analyze-report.md con backup de cada archivo modificado, escribe epic-refine-report.md y no cambia status ni substatus; con verdict: APPROVED no modifica ningún archivo.` | 85 | STORY-165 | mención · story.md:94 `- Cubre el criterio de salida de EPIC-23: **CS-15** — epic-refine aplica los hallazgos de …` | ✓ |
| CS-16 | `**CS-16** — epic-track-progress lista el status y substatus de cada historia hija, incluidas las archivadas, responde si todas están terminadas y no escribe ningún archivo.` | 86 | STORY-168 | mención · story.md:82 `- Cubre el criterio de salida de EPIC-23: **CS-16** — epic-track-progress lista el status y substatus de …` | ✓ |
| CS-17 | `**CS-17** — epic-ship genera, a partir de las historias de la épica, la entrada de CHANGELOG.md y las notas de versión para stakeholders en release-notes.md del directorio de la épica.` | 87 | STORY-170 | AC-1 · story.md:31 `Entonces CHANGELOG.md tiene una entrada nueva con las historias de la épica` · story.md:32 `Y existe release-notes.md en el directorio de la épica` | ✓ |
| CS-18 | `**CS-18** — epic-ship no ejecuta ninguna operación de git (commit, tag, merge ni push) ni dispara releases o despliegues; muestra los pasos de liberación manuales y escribe SHIP/DONE en la épica solo cuando el humano confirma que los completó.` | 88 | STORY-170 | mención · story.md:84 `- Cubre el criterio de salida de EPIC-23: **CS-18** — epic-ship no ejecuta ninguna operación de git …` | ✓ |
| CS-19 | `**CS-19** — epic-complete rechaza una épica que no esté en SHIP/DONE, COMPLETED/DONE ni CANCELED/DONE y archiva las que sí lo están en specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/ conservando su historial de git: las SHIP pasan a status: COMPLETED y las CANCELED conservan su status.` | 89 | STORY-172 | mención · story.md:71 `- Cubre el criterio de salida de EPIC-23: **CS-19** — epic-complete rechaza una épica que no esté en …` | ✓ |
| CS-20 | `**CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir épicas en specs/flow/archive/; domain-epic-lifecycle y domain-state-management documentan que epic-ship y epic-complete escriben SHIP y COMPLETED de épica con confirmación humana, y validation-contract-policy registra los gates del flujo de épica de forma coherente con su flowchart.` | 90 | STORY-171 | mención · story.md:86 `- Cubre el criterio de salida de EPIC-23: **CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir …` | ✓ |
| CS-21 | `**CS-21** — npm run verify:repository y npm test pasan sin errores.` | 91 | STORY-124, STORY-125, STORY-126, STORY-127, STORY-128, STORY-137, STORY-165, STORY-166, STORY-167, STORY-168, STORY-169, STORY-170, STORY-171, STORY-172 | STORY-124 mención · story.md:75; STORY-125 mención · story.md:89; STORY-126 mención · story.md:89; STORY-127 mención · story.md:76; STORY-128 mención · story.md:78; STORY-137 mención · story.md:74; STORY-165 mención · story.md:95; STORY-166 mención · story.md:81; STORY-167 mención · story.md:88; STORY-168 mención · story.md:83; STORY-169 mención · story.md:83; STORY-170 mención · story.md:85; STORY-171 mención · story.md:87; STORY-172 mención · story.md:72 `- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — …` | ✓ |
| SMOKE-1 | `Épica consistente obtiene APPROVED` | 95 | STORY-125 | mención · story.md:88 `- Cubre SMOKE-1 de EPIC-23 (AC-1).` | ✓ |
| SMOKE-2 | `Épica inexistente no escribe reporte` | 105 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |
| SMOKE-3 | `Historia no terminal rechaza la épica` | 113 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |
| SMOKE-4 | `Bucle de DEFINE: épica con formato inválido se corrige` | 121 | STORY-166, STORY-167 | STORY-166 mención · story.md:77 `… Participa en SMOKE-4 (primera y segunda validación).`; STORY-167 mención · story.md:83 `… Dueña de SMOKE-4.` | ✓ |
| SMOKE-5 | `Bucle de PLAN: historia huérfana entra al índice` | 131 | — | STORY-165 parcial · AC-1 · story.md:32 `Y añade la línea F2 de la historia huérfana en la sección de historias de "epic.md"` | SAL-02 |
| SMOKE-6 | `Gate de DEVELOP: historia pendiente impide avanzar` | 140 | STORY-168 | mención · story.md:78 `… Dueña de SMOKE-6.` | ✓ |
| SMOKE-7 | `SHIP prepara la versión sin operaciones de git` | 149 | STORY-170 | mención · story.md:79 `… Dueña de SMOKE-7.` | ✓ |
| SMOKE-8 | `Cierre y archivado de una épica liberada` | 160 | STORY-171 | mención · story.md:81 `… Dueña de SMOKE-8.` | ✓ |

## Hallazgos

### H-001 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-166` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-166-veredicto-de-epic-format-validation/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-002 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-167` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-167-skill-epic-improve/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-003 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-168` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-168-skill-epic-track-progress/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-004 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-169` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-005 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-170` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-170-skill-epic-ship/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-006 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-171` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-007 [WARNING] — MAD-01: Historia sin especificación terminada

- **Elemento:** `STORY-172` · `SPECIFY/IN-PROGRESS`
- **Evidencia:** `specs/flow/STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md:8`
- **Acción sugerida:** completar su especificación con /story-specify

### H-008 [WARNING] — SAL-02: Smoke test sin cobertura

- **Elemento:** `SMOKE-5` — `Bucle de PLAN: historia huérfana entra al índice`
- **Evidencia:** `epic.md:131` · parcial: `STORY-165 › AC-1 · story.md:32`
- **Acción sugerida:** crear o ajustar una historia que lo verifique; si una historia ya lo cubre, citar `SMOKE-5` en su `story.md`; o retirar el smoke test si es obsoleto

## Notas del análisis

- `epic.md:197` declara qué historia es dueña de cada criterio y smoke test; no cuenta como evidencia. La cobertura se evaluó solo con citas de los `story.md` (E1 por texto completo del criterio o token `SMOKE-N`; E2 por un AC que afirme el resultado completo).
- CS-10, CS-12, CS-19 y CS-20 están cubiertos por una mención completa en una sola historia que declara completarlos junto con otras (`STORY-137/story.md:73`, `STORY-171/story.md:85`, `STORY-172/story.md:71` y `STORY-171/story.md:86`).
- CS-21 es transversal: las 14 historias lo citan como requisito previo a su entrega.
- STORY-124 cita CS-1 y CS-5 con su texto vigente, pero `STORY-124/story.md:55` (CNF-1) todavía describe la resolución con la precedencia anterior y `STORY-124/story.md:43` (AC-2) declara `BLOCKED` donde EPIC-23 define `NEEDS-CHANGES`; coincide con la alineación pendiente que `epic.md:192-195` ya registra.
- Las referencias `related` de las 14 historias resuelven (incluida `STORY-138`, archivada en `specs/flow/archive/2026-10-18-STORY-138-contrato-de-validacion/`).
- No hay líneas del índice no reconocidas, historias huérfanas, canceladas ni ilegibles, ni textos con forma de instrucción dirigidos al agente.
