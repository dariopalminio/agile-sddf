---
type: epic-analyze
id: EPIC-26
slug: EPIC-26-layout-y-flow-forward-mejorado-analyze-report
title: "Epic analyze: Layout y flow-forward mejorado"
epic: EPIC-26
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-22
updated: 2026-10-22
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
<!-- Referencias -->
[[EPIC-26-layout-y-flow-forward-mejorado]]

# Análisis de épica: Layout y flow-forward mejorado

## Veredicto
**Veredicto:** `APPROVED` — sin hallazgos ERROR y 0 WARNING (umbral: 3)
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-26 (`docs/specs/epics/EPIC-26-layout-y-flow-forward-mejorado/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 20/20 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 12/12 listas |
| Fecha | 2026-10-22 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-147 | 22 | sí | `docs/specs/stories/STORY-147-adr-del-layout-fijo-de-tres-raices/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-148 | 23 | sí | `docs/specs/stories/STORY-148-contrato-de-rutas-fijas-y-gate-determinista/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-149 | 24 | sí | `docs/specs/stories/STORY-149-sddf-init-crea-el-nuevo-layout/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-150 | 25 | sí | `docs/specs/stories/STORY-150-migrar-skills-especificacion-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-151 | 26 | sí | `docs/specs/stories/STORY-151-migrar-los-skills-de-epica-a-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-152 | 27 | sí | `docs/specs/stories/STORY-152-migrar-los-skills-de-proyecto-y-transversales/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-153 | 28 | sí | `docs/specs/stories/STORY-153-migrar-work-items-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-154 | 29 | sí | `docs/specs/stories/STORY-154-documentar-el-nuevo-layout/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-155 | 30 | sí | `docs/specs/stories/STORY-155-migrar-skills-planning-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-156 | 31 | sí | `docs/specs/stories/STORY-156-migrar-skills-implementacion-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-157 | 32 | sí | `docs/specs/stories/STORY-157-reparar-enlaces-tras-migracion/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |
| STORY-158 | 33 | sí | `docs/specs/stories/STORY-158-migrar-skills-verificacion-specs-flow/story.md` | `EPIC-26-layout-y-flow-forward-mejorado` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | ``**CS-1** — Existe un ADR nuevo `ACCEPTED` del layout fijo y ADR-0010 queda reemplazado (`superseded-by`) sin editarse su contenido.`` | 37 | STORY-147 | mención · story.md:72 ``- **CS-1** — Existe un ADR nuevo `ACCEPTED` del layout fijo y ADR-0010 queda reemplazado (`superseded-by`) sin editarse su contenido.`` | ✓ |
| CS-2 | ``**CS-2** — `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` no devuelve coincidencias, salvo las menciones de diagnóstico del layout legado en `skill-preflight`.`` | 38 | STORY-157 (parcial: STORY-149, STORY-150, STORY-151, STORY-155) | STORY-149 · AC-4 · story.md:57 `Entonces no hay coincidencias` — parcial: solo `skills/sddf-init/`<br>STORY-150 · AC-3 · story.md:50 `Entonces no hay coincidencias` — parcial: solo skills de especificación<br>STORY-151 · AC-4 · story.md:54 `Entonces no hay coincidencias` — parcial: solo `skills/epic-*`<br>STORY-155 · AC-3 · story.md:60 `Entonces no hay coincidencias` — parcial: solo skills de planning<br>STORY-157 · mención · story.md:71 ``- **CS-2** — `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` no devuelve coincidencias, salvo las menciones de diagnóstico del layout legado en `skill-preflight`.`` | ✓ |
| CS-3 | ``**CS-3** — Ningún skill lee la clave `root` de `sddf.config.yaml`, y `sddf-init` ya no la escribe.`` | 39 | STORY-157 (parcial: STORY-149) | STORY-149 · AC-1 · story.md:32 `Y "sddf.config.yaml" no declara la clave "root"` — parcial: solo la parte de `sddf-init`<br>STORY-157 · mención · story.md:72 ``- **CS-3** — Ningún skill lee la clave `root` de `sddf.config.yaml`, y `sddf-init` ya no la escribe.`` | ✓ |
| CS-4 | ``**CS-4** — `docs/specs/` no existe; `specs/flow/` contiene todas las épicas (`EPIC-NN-<slug>/`) y las stories no `COMPLETED` (`STORY-NNN-<slug>/`), sin subniveles `epics/` ni `stories/`.`` | 40 | STORY-153 | AC-1 · story.md:31, 33, 34 `Entonces cada épica queda en "specs/flow/EPIC-NN-<slug>/"` · `Y cada story en otro estado queda en "specs/flow/STORY-NNN-<slug>/"` · `Y "docs/specs/" deja de existir` | ✓ |
| CS-5 | ``**CS-5** — `specs/flow/archive/` contiene exactamente las stories que tenían `status: COMPLETED` antes de migrar, cada una como `<YYYY-MM-DD>-STORY-NNN-<slug>/`; el total de stories (activas + archivadas) es igual al previo a la migración.`` | 41 | STORY-153 | AC-1 · story.md:32, 35 `Y cada story COMPLETED queda en "specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/" con la fecha de su "updated:" (o "created:" si falta)` · `Y el total de stories activas + archivadas es igual al previo a la migración` | ✓ |
| CS-6 | ``**CS-6** — La migración se hizo con `git mv`: `git log --follow` sobre un `story.md` archivado muestra su historial previo.`` | 42 | STORY-157 | AC-2 · story.md:39 `Entonces muestra su historial previo a la migración` | ✓ |
| CS-7 | ``**CS-7** — El script de migración admite `--dry-run` y es idempotente: ejecutarlo de nuevo sobre el repo migrado no produce cambios.`` | 43 | STORY-153 | AC-2 · story.md:43, 44 `Pero no se mueve ni modifica ningún archivo` · `Y al ejecutar el script de nuevo sobre el repositorio ya migrado no se produce ningún cambio en el árbol de trabajo` | ✓ |
| CS-8 | ``**CS-8** — `/sddf-init` en un repo limpio crea `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` en la raíz (con `.gitkeep` para que git los versione), y no crea `docs/specs/`.`` | 44 | STORY-149 | AC-1 · story.md:30, 33 `Entonces existen "specs/flow/", "specs/flow/archive/", "specs/living/" y "workflow/" en la raíz, cada uno con ".gitkeep"` · `Y no existe "docs/specs/"` | ✓ |
| CS-9 | ``**CS-9** — `AGENTS.md` documenta el layout fijo, la convención `<YYYY-MM-DD>-STORY-NNN-<slug>/` de `archive/` y el destino final de `docs/requirements/` en `specs/living/`.`` | 45 | STORY-154 | AC-1 · story.md:30, 31 `Entonces "AGENTS.md" documenta las raíces "docs/", "specs/" y "workflow/" y la convención "<YYYY-MM-DD>-STORY-NNN-<slug>/" de "specs/flow/archive/"` · `Y "AGENTS.md" indica que "docs/requirements/" migrará a "specs/living/" en la épica de Living Spec` | ✓ |
| CS-10 | ``**CS-10** — `docs/requirements/` permanece sin cambios de ubicación ni contenido.`` | 46 | STORY-157 | AC-2 · story.md:40 `Pero "docs/requirements/" no cambia de ubicación ni de contenido` | ✓ |
| CS-11 | `**CS-11** — No se crea ningún skill ni script de archivado reutilizable; el único script nuevo de movimiento es la migración de un solo uso.` | 47 | STORY-153 | mención · story.md:68 `- **CS-11** — No se crea ningún skill ni script de archivado reutilizable; el único script nuevo de movimiento es la migración de un solo uso.` | ✓ |
| CS-12 | ``**CS-12** — `npm test` y `npm run verify:repository` (incluido el chequeo de enlaces) terminan en verde.`` | 48 | STORY-157 (parcial: STORY-148, STORY-150, STORY-154, STORY-155) | STORY-148 · AC-1 · story.md:32 `Y el gate termina en verde` — parcial<br>STORY-150 · AC-3 · story.md:51 `Y "npm run verify:repository" termina en verde` — parcial<br>STORY-154 · AC-3 · story.md:48 `Entonces el chequeo de enlaces termina sin errores` — parcial<br>STORY-155 · AC-3 · story.md:62 `Entonces termina en verde` — parcial<br>STORY-157 · mención · story.md:73 ``- **CS-12** — `npm test` y `npm run verify:repository` (incluido el chequeo de enlaces) terminan en verde.`` | ✓ |
| CS-13 | ``**CS-13** — `/sddf-init` sobre un repo con `docs/specs/` emite un aviso de deprecación que remite a la guía de migración, no crea `specs/flow/` y no modifica `docs/specs/`.`` | 49 | STORY-149 | AC-2 · story.md:40, 41, 42 `Entonces se emite un aviso de deprecación con la ruta de "docs/guides/artifact-directory-migration.md"` · `Y no se crea "specs/flow/"` · `Y "docs/specs/" queda sin cambios` | ✓ |
| CS-14 | ``**CS-14** — `docs/guides/artifact-directory-migration.md` incluye una sección de migración al layout fijo (de `docs/specs/` a `specs/flow/` y retiro de `root`), y el CHANGELOG la enlaza como cambio incompatible.`` | 50 | STORY-154 | AC-2 · story.md:40, 41 `Entonces encuentra una sección que explica el paso de "docs/specs/" a "specs/flow/" y el retiro de "root"` · `Y el CHANGELOG registra el cambio como incompatible (versión mayor) y enlaza esa sección` | ✓ |
| SMOKE-1 | `story-specify escribe en specs/flow` | 54 | STORY-147, STORY-150, STORY-155, STORY-156, STORY-158 | STORY-147 · mención · story.md:51 `Y la decisión es consistente con SMOKE-1 y SMOKE-2 de la épica`<br>STORY-150 · mención · story.md:70 ``Historia core del split. Alcance: `story-creation`, `story-evaluation`, `story-refine`, `story-improve`, `story-split` y `story-specify`, más sus `assets/agents/` y `evals/evals.json`. Cubre la parte de especificación de CS-2 y SMOKE-1. Depende de STORY-148.``<br>STORY-155 · mención · story.md:81 ``Alcance: los seis skills `story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-fix-plan` y `story-plan`, más sus `assets/agents/` y `evals/evals.json`. Cubre la parte de planning de CS-2 y SMOKE-1.``<br>STORY-156 · mención · story.md:69 ``Alcance: `story-implement` y `story-implement-tasks`, más sus `evals/evals.json`, `README.md` y ejemplos. Cubre la parte de implementación de CS-2 y SMOKE-1.``<br>STORY-158 · mención · story.md:68 ``Historia hermana del split de STORY-156 «Migrar los skills de implementación y verificación a specs/flow» (`/story-split`, patrón 1 — pasos del flujo de trabajo). La core, STORY-156, migra los skills de implementación. Cubre la parte de revisión, verificación y aceptación de CS-2 y SMOKE-1.`` | ✓ |
| SMOKE-2 | `epic-creation escribe en specs/flow` | 63 | STORY-147, STORY-151 | STORY-147 · mención · story.md:51 `Y la decisión es consistente con SMOKE-1 y SMOKE-2 de la épica`<br>STORY-151 · mención · story.md:71 `Cubre parte de CS-2 y SMOKE-2. Depende de STORY-148.` | ✓ |
| SMOKE-3 | `sddf-init crea el layout de tres raíces` | 72 | STORY-149 | mención · story.md:77 ``Cubre CS-3 (parte de `sddf-init`), la parte de `sddf-init` de CS-2, CS-8, CS-13 y SMOKE-3, SMOKE-6. La guía de migración a la que remite el aviso la completa STORY-154.`` | ✓ |
| SMOKE-4 | `Migración archiva las stories completadas` | 81 | STORY-153 | mención · story.md:64 `Cubre CS-4, CS-5, CS-6, CS-7, CS-10, CS-11 y SMOKE-4.` | ✓ |
| SMOKE-5 | `El gate determinista sigue verde` | 91 | STORY-157 | mención · story.md:67 `Cubre CS-6, CS-10 y SMOKE-5; complementa CS-4 y CS-5 de STORY-153.` | ✓ |
| SMOKE-6 | `sddf-init no duplica el layout en un proyecto sin migrar` | 99 | STORY-149 | mención · story.md:77 ``Cubre CS-3 (parte de `sddf-init`), la parte de `sddf-init` de CS-2, CS-8, CS-13 y SMOKE-3, SMOKE-6. La guía de migración a la que remite el aviso la completa STORY-154.`` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- CS-2, CS-3 y CS-12 son criterios globales: cada historia de migración aporta evidencia parcial de su parte y la cobertura completa la aporta STORY-157 (mención E1 en story.md:71-73, respaldada por su AC-3 · story.md:47-50, que comprueba el conjunto al cierre de la épica). Por eso STORY-157 debe ser la última historia en entregarse.
- CS-1 y CS-11 se cubren por mención literal (E1): CS-1 en `STORY-147` story.md:72 (AC-1 y AC-2 lo verifican juntos) y CS-11 en `STORY-153` story.md:68 (decisión de diseño fijada en su CNF-1).
- `skills/sddf-init/` contiene hoy referencias a `SPECS_BASE`/`SDDF_ROOT` (5 archivos); queda en el alcance de `STORY-149` (AC-4).
