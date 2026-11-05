---
type: epic-analyze
id: EPIC-23
slug: EPIC-23-completar-flujo-de-epic-analyze-report
title: "Epic analyze: Completar flujo de epic"
epic: EPIC-23
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-28
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
---
<!-- Referencias -->
[[EPIC-23-completar-flujo-de-epic]]

# Análisis de épica: Completar flujo de epic

## Veredicto
**Veredicto:** `APPROVED` — sin hallazgos ERROR y 0 WARNING (umbral: 3)
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-23 (`specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 29/29 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 17/17 listas |
| Fecha | 2026-10-29 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-124 | 53 | sí | `specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-125 | 54 | sí | `specs/flow/STORY-125-validar-evidencia-operativa-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-126 | 55 | sí | `specs/flow/STORY-126-operar-validacion-epica-segura/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-127 | 56 | sí | `specs/flow/STORY-127-integrar-adoptar-gateway-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-128 | 57 | sí | `specs/flow/STORY-128-evaluar-validacion-epica-repetible/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-137 | 58 | sí | `specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-165 | 45 | sí | `specs/flow/STORY-165-corregir-indice-y-enlaces-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-166 | 39 | sí | `specs/flow/STORY-166-veredicto-de-epic-format-validation/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-167 | 42 | sí | `specs/flow/STORY-167-skill-epic-improve/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-168 | 50 | sí | `specs/flow/STORY-168-skill-epic-track-progress/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-169 | 59 | sí | `specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-170 | 62 | sí | `specs/flow/STORY-170-skill-epic-ship/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-171 | 66 | sí | `specs/flow/STORY-171-completar-archivar-epica-liberada/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-172 | 67 | sí | `specs/flow/STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-173 | 46 | sí | `specs/flow/STORY-173-cubrir-criterios-salida-epica/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-174 | 47 | sí | `specs/flow/STORY-174-corregir-referencias-obsoletas-tras-split/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |
| STORY-175 | 65 | sí | `specs/flow/STORY-175-admitir-epicas-archivadas-en-layout/story.md` | `EPIC-23-completar-flujo-de-epic` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` **CS-1** — `skills/epic-validate/SKILL.md` existe, resuelve solo `REPO_ROOT` y declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` (ADR-0017). `` | 72 | STORY-124 | mención · story.md:69 `` - Cubre el criterio de salida de EPIC-23: **CS-1** — `skills/epic-validate/SKILL.md` existe, resuelve solo `REPO_ROOT` y declara `<!-- SDDF-… `` | ✓ |
| CS-2 | `` **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título. `` | 73 | STORY-124 | mención · story.md:70 `` - Cubre el criterio de salida de EPIC-23: **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada … `` | ✓ |
| CS-3 | `**CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.` | 74 | STORY-124 | mención · story.md:71 `- Cubre el criterio de salida de EPIC-23: **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis d…` | ✓ |
| CS-4 | `` **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista. `` | 75 | STORY-125 | mención · story.md:87 `` - Cubre el criterio de salida de EPIC-23: **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista. `` | ✓ |
| CS-5 | `` **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`. `` | 76 | STORY-124 | mención · story.md:72 `- Cubre el criterio de salida de EPIC-23: **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredic…` | ✓ |
| CS-6 | `**CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.` | 77 | STORY-124 | mención · story.md:73 `- Cubre el criterio de salida de EPIC-23: **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.` | ✓ |
| CS-7 | `` **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos. `` | 78 | STORY-126 | mención · story.md:87 `` - Cubre el criterio de salida de EPIC-23: **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros d… `` | ✓ |
| CS-8 | `` **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`. `` | 79 | STORY-127 | mención · story.md:75 `` - Cubre el criterio de salida de EPIC-23: **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`. `` | ✓ |
| CS-9 | `` **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED, una inconsistente que resulte NEEDS-CHANGES y una cuya evidencia no se puede obtener que resulte BLOCKED. `` | 80 | STORY-128 | mención · story.md:77 `` - Cubre el criterio de salida de EPIC-23: **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resu… `` | ✓ |
| CS-10 | `` **CS-10** — Se reconocen y manejan correctamente los flags `--mode manual`, `--mode auto`, `--dry-run` y `--verbose`. `` | 81 | STORY-137 | mención · story.md:73 `` - Cubre el criterio de salida de EPIC-23: **CS-10** — Se reconocen y manejan correctamente los flags `--mode manual`, `--mode auto`, `--dry-… `` | ✓ |
| CS-11 | `` **CS-11** — En `--mode auto`, `epic-validate` ejecuta las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa) y registra el resultado de cada una en el reporte; una suite que falla produce `NEEDS-CHANGES` y una que no se puede ejecutar, `BLOCKED`. `` | 82 | STORY-169 | mención · story.md:111 `` - Cubre el criterio de salida de EPIC-23: **CS-11** — En `--mode auto`, `epic-validate` ejecuta las suites de nivel épica declaradas en `ver… `` | ✓ |
| CS-12 | `` **CS-12** — `skills/<skill>/SKILL.md` existe para `epic-improve`, `epic-refine`, `epic-track-progress`, `epic-ship` y `epic-complete`; cada uno declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, figura en el arreglo `files` de `package.json` y tiene `evals/evals.json`. `` | 85 | STORY-171 | mención · story.md:81 `` - Cubre el criterio de salida de EPIC-23: **CS-12** — `skills/<skill>/SKILL.md` existe para `epic-improve`, `epic-refine`, `epic-track-progr… `` | ✓ |
| CS-13 | `` **CS-13** — `epic-format-validation` declara un veredicto canónico: un `epic.md` conforme obtiene `APPROVED` y uno con faltantes o formato inválido obtiene `NEEDS-REFINEMENT`, con el diagnóstico de cada defecto. `` | 86 | STORY-166 | mención · story.md:82 `` - Cubre el criterio de salida de EPIC-23: **CS-13** — `epic-format-validation` declara un veredicto canónico: un `epic.md` conforme obtiene … `` | ✓ |
| CS-14 | `` **CS-14** — `epic-improve` crea `epic.md.bak` antes de escribir, solo modifica `epic.md`, no cambia `status` ni `substatus` y, tras aplicar sus correcciones, `/epic-format-validation` devuelve `APPROVED` para los defectos corregidos; lo que requiere decisión del PO queda listado sin modificarse. `` | 87 | STORY-167 | mención · story.md:89 `` - Cubre el criterio de salida de EPIC-23: **CS-14** — `epic-improve` crea `epic.md.bak` antes de escribir, solo modifica `epic.md`, no cambi… `` | ✓ |
| CS-15 | `` **CS-15** — `epic-refine` aplica los hallazgos de `epic-analyze-report.md` con backup de cada archivo modificado, escribe `epic-refine-report.md` y no cambia `status` ni `substatus`; con `verdict: APPROVED` no modifica ningún archivo. `` | 88 | STORY-165 | mención · story.md:89 `` - Cubre el criterio de salida de EPIC-23: **CS-15** — `epic-refine` aplica los hallazgos de `epic-analyze-report.md` con backup de cada arch… `` | ✓ |
| CS-16 | `` **CS-16** — `epic-track-progress` lista el status y substatus de cada historia hija, incluidas las archivadas, responde si todas están terminadas y no escribe ningún archivo. `` | 89 | STORY-168 | mención · story.md:84 `` - Cubre el criterio de salida de EPIC-23: **CS-16** — `epic-track-progress` lista el status y substatus de cada historia hija, incluidas las… `` | ✓ |
| CS-17 | `` **CS-17** — `epic-ship` genera, a partir de las historias de la épica, la entrada de `CHANGELOG.md` y las notas de versión para stakeholders en `release-notes.md` del directorio de la épica. `` | 90 | STORY-170 | AC-1 · story.md:31 `Entonces CHANGELOG.md tiene una entrada nueva con las historias de la épica` · story.md:32 `Y existe release-notes.md en el directorio de la épica` | ✓ |
| CS-18 | `` **CS-18** — `epic-ship` no ejecuta ninguna operación de git (commit, tag, merge ni push) ni dispara releases o despliegues; muestra los pasos de liberación manuales y escribe `SHIP/DONE` en la épica solo cuando el humano confirma que los completó. `` | 91 | STORY-170 | mención · story.md:86 `` - Cubre el criterio de salida de EPIC-23: **CS-18** — `epic-ship` no ejecuta ninguna operación de git (commit, tag, merge ni push) ni dispar… `` | ✓ |
| CS-19 | `` **CS-19** — `epic-complete` rechaza una épica que no esté en `SHIP/DONE`, `COMPLETED/DONE` ni `CANCELED/DONE` y archiva las que sí lo están en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` conservando su historial de git: las `SHIP` pasan a `status: COMPLETED` y las `CANCELED` conservan su status. `` | 92 | STORY-172 | mención · story.md:73 `` - Cubre el criterio de salida de EPIC-23: **CS-19** — `epic-complete` rechaza una épica que no esté en `SHIP/DONE`, `COMPLETED/DONE` ni `CAN… `` | ✓ |
| CS-20 | `` **CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir épicas en `specs/flow/archive/`; `domain-epic-lifecycle`, `domain-state-management` y `docs/architecture/state-machine.md` documentan que `epic-ship` y `epic-complete` escriben `SHIP` y `COMPLETED` de épica con confirmación humana, `domain-epic-lifecycle` nombra `epic-validate-report.md` como reporte de `VALIDATE`, y `validation-contract-policy` registra los gates del flujo de épica de forma coherente con su flowchart. `` | 93 | STORY-175 | mención · story.md:101 `` - Cubre el criterio de salida de EPIC-23: **CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir épicas en `specs/flow/archive/`; `domai… `` | ✓ |
| CS-21 | `` **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. `` | 94 | STORY-124, STORY-125, STORY-126, STORY-127, STORY-128, STORY-137, STORY-165, STORY-166, STORY-167, STORY-168, STORY-169, STORY-170, STORY-171, STORY-172, STORY-173, STORY-174, STORY-175 | STORY-124 mención · story.md:75 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-125 mención · story.md:89 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-126 mención · story.md:89 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-127 mención · story.md:76 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-128 mención · story.md:78 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-137 mención · story.md:74 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-165 mención · story.md:92 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-166 mención · story.md:83 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-167 mención · story.md:90 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-168 mención · story.md:85 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-169 mención · story.md:112 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-170 mención · story.md:87 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-171 mención · story.md:82 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-172 mención · story.md:74 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-173 mención · story.md:68 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-174 mención · story.md:75 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. ``; STORY-175 mención · story.md:102 `` - Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores. `` | ✓ |
| SMOKE-1 | `Épica consistente obtiene APPROVED` | 98 | STORY-125 | mención · story.md:88 `- Cubre SMOKE-1 de EPIC-23 (AC-1).` | ✓ |
| SMOKE-2 | `Épica inexistente no escribe reporte` | 108 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |
| SMOKE-3 | `Historia no terminal rechaza la épica` | 116 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |
| SMOKE-4 | `Bucle de DEFINE: épica con formato inválido se corrige` | 124 | STORY-166, STORY-167 | STORY-166 mención · story.md:79 `` - **Criterios de salida que cubre:** CS-13 y la parte de CS-20 que registra en `validation-contract-policy` el gate de `DEFINE` de forma coh… ``; STORY-167 mención · story.md:85 `` - **Criterios de salida que cubre:** CS-14 y CS-12 para `epic-improve` (`SKILL.md`, marcador de layout, `files` de `package.json` y `evals/e… `` | ✓ |
| SMOKE-5 | `Bucle de PLAN: historia huérfana entra al índice` | 134 | STORY-165 | mención · story.md:90 `- Cubre el smoke test de EPIC-23: **SMOKE-5** — Bucle de PLAN: historia huérfana entra al índice.` | ✓ |
| SMOKE-6 | `Gate de DEVELOP: historia pendiente impide avanzar` | 143 | STORY-168 | mención · story.md:80 `` - **Criterios de salida que cubre:** CS-16 y CS-12 para `epic-track-progress`. Dueña de SMOKE-6. `` | ✓ |
| SMOKE-7 | `SHIP prepara la versión sin operaciones de git` | 152 | STORY-170 | mención · story.md:81 `` - **Criterios de salida que cubre:** CS-17, CS-18, CS-12 para `epic-ship` y la parte de CS-20 que documenta en `domain-epic-lifecycle` y `do… `` | ✓ |
| SMOKE-8 | `Cierre y archivado de una épica liberada` | 163 | STORY-171 | mención · story.md:78 `` - **Criterios de salida que cubre:** CS-19 (épicas `SHIP/DONE` y `COMPLETED/DONE`) y CS-12 para `epic-complete`. Dueña de SMOKE-8. `` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- `epic.md:200` declara la historia dueña de cada criterio y smoke test; no cuenta como evidencia. La cobertura se evaluó solo con citas de los `story.md` (E1 por el texto completo normalizado del criterio o el token `SMOKE-N`; E2 por un AC que afirme el resultado completo).
- CS-20 queda cubierto por la mención completa de `specs/flow/STORY-175-admitir-epicas-archivadas-en-layout/story.md:101`, que declara que lo completa junto con STORY-166 (`validation-contract-policy`, `specs/flow/STORY-166-veredicto-de-epic-format-validation/story.md:79`) y STORY-170 (`SHIP` de épica, `specs/flow/STORY-170-skill-epic-ship/story.md:81`). Resuelve el SAL-01 del análisis anterior.
- CS-17 no tiene mención E1 en ninguna historia; queda cubierto por E2: `specs/flow/STORY-170-skill-epic-ship/story.md` › AC-1 afirma la entrada nueva de `CHANGELOG.md` con las historias de la épica y `release-notes.md` en su directorio.
- CS-12 queda cubierto por la mención completa de `specs/flow/STORY-171-completar-archivar-epica-liberada/story.md:81`; STORY-165, STORY-167, STORY-168 y STORY-170 citan solo la parte de su skill.
- CS-10 queda cubierto por la mención completa de `specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/story.md:73`; STORY-126 (`story.md:88`) contribuye con `--mode` y `--dry-run`.
- CS-21 es transversal: las 17 historias lo citan como requisito previo a su entrega.
- Las secciones `🚫 Fuera de alcance`, `🚫 Fuera de alcance (Non-Goals)` y `Fuera de alcance (Non-Goals)` se trataron como secciones de exclusión (se ignora el emoji inicial del título); no contienen menciones de `CS-N` ni `SMOKE-N`.
- Las referencias `related` de las 17 historias resuelven por ID (incluidas `STORY-138`, archivada en `specs/flow/archive/2026-10-18-STORY-138-contrato-de-validacion/`, y `EPIC-25-unificar-contrato-de-validaciones-en-skills`). Slugs desactualizados que resuelven por ID: `specs/flow/STORY-170-skill-epic-ship/story.md:15` y `specs/flow/STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md:15` citan `STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada`, cuyo directorio actual es `STORY-171-completar-archivar-epica-liberada` (alcance de STORY-174).
- Madurez: 16 historias están en `READY-FOR-IMPLEMENT/DONE` y STORY-127 en `PLAN/IN-PROGRESS`; todas son posteriores a `SPECIFY`.
- No hay líneas del índice no reconocidas, historias huérfanas, IDs duplicados, historias canceladas ni ilegibles, ni textos con forma de instrucción dirigidos al agente.
