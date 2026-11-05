---
type: validate-report
id: EPIC-26
slug: EPIC-26-layout-y-flow-forward-mejorado
title: "Validate Report: layout-y-flow-forward-mejorado"
epic: EPIC-26
date: 2026-10-25
mode: manual
verdict: APPROVED
created: 2026-10-25
updated: 2026-10-25
---


# Validate Report: layout-y-flow-forward-mejorado

**Date**: 2026-10-25
**Epic**: EPIC-26
**Mode**: manual
**Veredicto**: ✅ APPROVED

## Sign-off

- [x] Condición 1 — Todas las historias hijas están `COMPLETED`, `DELIVER/DONE` o `VERIFY/DONE`
- [x] Condición 2 — `epic-analyze-report.md` con Veredicto APPROVED
- [x] Condición 3 — Los criterios de salida (CS-1…CS-14) y los smoke tests (SMOKE-1…SMOKE-6) pasan

## Condición 1 — Historias hijas en estado terminal o verificado

Se buscaron en `specs/` (incluido `specs/flow/archive/`) los `story.md` que declaran `parent: EPIC-26-layout-y-flow-forward-mejorado`:

| Historia | status | substatus | Estado |
|---|---|---|---|
| STORY-147 — ADR del layout fijo de tres raíces | VERIFY | DONE | ✓ |
| STORY-148 — Contrato de rutas fijas y gate determinista | VERIFY | DONE | ✓ |
| STORY-149 — sddf-init crea el nuevo layout | VERIFY | DONE | ✓ |
| STORY-150 — Migrar los skills de especificación a specs/flow | VERIFY | DONE | ✓ |
| STORY-151 — Migrar los skills de épica a specs/flow | VERIFY | DONE | ✓ |
| STORY-152 — Migrar los skills de proyecto y transversales | VERIFY | DONE | ✓ |
| STORY-153 — Migrar y archivar los work items a specs/flow | VERIFY | DONE | ✓ |
| STORY-154 — Documentar el nuevo layout | VERIFY | DONE | ✓ |
| STORY-155 — Migrar los skills de planning a specs/flow | VERIFY | DONE | ✓ |
| STORY-156 — Migrar los skills de implementación a specs/flow | VERIFY | DONE | ✓ |
| STORY-157 — Reparar enlaces y validar el gate tras la migración | VERIFY | DONE | ✓ |
| STORY-158 — Migrar los skills de revisión, verificación y aceptación | VERIFY | DONE | ✓ |

Coinciden con el índice `## Historias` de `epic.md` (12/12). No hay historias huérfanas ni archivadas.

✅ PASS

## Condición 2 — epic-analyze-report.md

- `epic-analyze-report.md` existe en la carpeta de la épica (2026-10-22).
- Frontmatter `verdict: APPROVED`; `## Veredicto` → **`APPROVED`**, 0 ERROR y 0 WARNING (umbral: 3).
- `## Resumen`: contrato de salida 20/20 cubierto (14 CS + 6 SMOKE) y madurez de historias hijas 12/12.

✅ PASS (ver Observación 1)

## Condición 3 — Criterios de salida y smoke tests

### Criterios de salida

| # | Criterio | Evidencia | Estado |
|---|---|---|---|
| CS-1 | ADR nuevo `ACCEPTED` y ADR-0010 reemplazado sin editar su contenido | `ADR-0016-layout-fijo-de-tres-raices.md`: `status: ACCEPTED`, `supersedes: ADR-0010`. `ADR-0010`: `status: SUPERSEDED`, `superseded-by: ADR-0016` (commit `2c09bcf` de STORY-147, solo frontmatter). | ✓ |
| CS-2 | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` vacío salvo diagnóstico en `skill-preflight` | Fuera de `skills/skill-preflight/` no hay coincidencias. Hay 8 en `skill-preflight`, que son las menciones de diagnóstico del layout legado. | ✓ |
| CS-3 | Ningún skill lee la clave `root` de `sddf.config.yaml` y `sddf-init` no la escribe | No hay lecturas de `root` desde `sddf.config.yaml` en `skills/`. Los `root` de `memory-system` son el argumento CLI `--root <DOCS_DIR>` y la clave `root` de su salida de `check`, no la clave de configuración. `sddf.config.yaml` no declara `root`. El eval TC-001 de `sddf-init` exige `not_contains: "root: docs"`. | ✓ |
| CS-4 | `docs/specs/` no existe; `specs/flow/` plano, sin `epics/` ni `stories/` | `docs/specs/`, `specs/flow/epics/` y `specs/flow/stories/` no existen. `specs/flow/` solo contiene `EPIC-NN-<slug>/`, `STORY-NNN-<slug>/` y `archive/`. | ✓ |
| CS-5 | `archive/` contiene exactamente las stories `COMPLETED` previas, como `<YYYY-MM-DD>-STORY-NNN-<slug>/`; total igual al previo | Antes de migrar (`8df4b11^`) había 149 stories (98 `COMPLETED`) y 27 épicas. Ahora hay 98 en `archive/`, todas `COMPLETED` y con el patrón de nombre, más 51 activas, ninguna `COMPLETED`: 149 en total. Las 27 épicas siguen en `specs/flow/`. | ✓ |
| CS-6 | Migración con `git mv`: `git log --follow` conserva el historial | `git log --follow -- specs/flow/archive/2026-04-22-STORY-001-project-begin/story.md` muestra commits previos a la migración (`8635beb`, `f00e529`, `841ae0d`). | ✓ |
| CS-7 | El script admite `--dry-run` y es idempotente | `node scripts/migrate-specs-to-flow.js --dry-run` → `[SIN CAMBIOS] docs/specs/ no existe: nada que migrar` (exit 0). `test/migrate-specs-to-flow.test.js` cubre `--dry-run` y la segunda ejecución sin cambios (AC-2). | ✓ |
| CS-8 | `/sddf-init` en repo limpio crea `specs/flow/`, `archive/`, `living/` y `workflow/` con `.gitkeep`, sin `docs/specs/` | SMOKE-3 (eval TC-001) PASS. `test/sddf-init-layout.test.js` en verde. | ✓ |
| CS-9 | `AGENTS.md` documenta layout fijo, convención de `archive/` y destino de `docs/requirements/` | `AGENTS.md:10` (regla "Layout fijo (ADR-0016)") recoge los tres puntos. | ✓ |
| CS-10 | `docs/requirements/` sin cambios de ubicación ni contenido | No hubo movimientos. Desde que se creó la épica, el único cambio es `85d9229` (2026-10-22), que renombra un wikilink de ADR-0013 en `README.md`. No tiene relación con el layout (ver Observación 2). | ✓ |
| CS-11 | Ningún skill o script de archivado reutilizable; solo la migración de un uso | El único script de movimiento que agregó la épica es `scripts/migrate-specs-to-flow.js` (`8df4b11`). `migrate-finvest-field.js` es de STORY-090 y no mueve archivos. No existe ningún skill de archivado. | ✓ |
| CS-12 | `npm test` y `npm run verify:repository` (con enlaces) en verde | Ver "Validaciones deterministas": 309/309 tests y gate aprobado, con `[OK] Checked 49 active Markdown files; local links and anchors resolve.` | ✓ |
| CS-13 | `/sddf-init` con `docs/specs/` avisa, no crea `specs/flow/` ni modifica `docs/specs/` | SMOKE-6 (eval TC-003) PASS. | ✓ |
| CS-14 | Guía con sección de migración al layout fijo, enlazada desde el CHANGELOG como cambio incompatible | `docs/guides/artifact-directory-migration.md` tiene `## Migración a 5.0.0 — layout fijo de tres raíces`. `CHANGELOG.md` → `[Unreleased]` → `### BREAKING — layout fijo de tres raíces (EPIC-26, requiere 5.0.0)`, que enlaza a esa sección (el gate de enlaces resuelve el ancla). | ✓ |

### Smoke tests

| Smoke | Escenario | Ejecución | Resultado |
|---|---|---|---|
| SMOKE-1 | `story-specify` escribe en `specs/flow/STORY-001-<slug>/story.md` en un repo limpio | `npm run test:eval -- story-specify` TC-003 `layout-fijo-repo-limpio-escribe-en-specs-flow` (claude/sonnet, 2026-10-25) → [report-SMOKE-1-20261025.md](report-SMOKE-1-20261025.md) | ✅ PASS (1/1) |
| SMOKE-2 | `epic-creation` escribe en `specs/flow/EPIC-01-<slug>/epic.md` en un repo limpio | `epic-creation` TC-007 `repo-limpio-escribe-en-specs-flow` (claude/sonnet, 2026-10-25) → [report-SMOKE-2-20261025.md](report-SMOKE-2-20261025.md) | ✅ PASS (1/1) |
| SMOKE-3 | `/sddf-init` crea el layout de tres raíces sin clave `root` | `sddf-init` TC-001 `bootstrap-limpio-crea-layout-fijo` (claude/sonnet, 2026-10-25) → [report-SMOKE-3-20261025.md](report-SMOKE-3-20261025.md) | ✅ PASS (1/1) |
| SMOKE-4 | La migración archiva las `COMPLETED`, deja el resto en `specs/flow/` y elimina `docs/specs/` | `node --test test/migrate-specs-to-flow.test.js` (fixture con `docs/specs/` mixto, test "AC-1: épicas, stories activas y COMPLETED archivadas con fecha; docs/specs/ deja de existir"): 20/20 junto con `sddf-init-layout`. El resultado real en este repo es el que figura en CS-4, CS-5 y CS-6. | ✅ PASS |
| SMOKE-5 | `npm run verify:repository` termina sin errores ni enlaces rotos | Ejecutado el 2026-10-25: `[OK] Verificación determinista del repositorio aprobada.` | ✅ PASS |
| SMOKE-6 | `/sddf-init` con layout legado avisa y no duplica | `sddf-init` TC-003 `layout-legado-avisa-sin-escribir` (claude/sonnet, 2026-10-25) → [report-SMOKE-6-20261025.md](report-SMOKE-6-20261025.md) | ✅ PASS (1/1) |

✅ PASS

### Validaciones deterministas (2026-10-25)

```
npm run verify:repository
[VERIFY] pruebas deterministas        # tests 309 · pass 309 · fail 0
[OK] Sintaxis válida en 44 archivos JavaScript.
[OK] Contrato de layout fijo verificado en 35 skill(s); 0 pendiente(s) de migración.
[OK] Perfiles verificados: core, dogfood
[OK] Contrato de configuración válido.
[OK] Inventario de evals válido: 35 skills; 1 excepción(es) explícita(s).
[OK] Checked 49 active Markdown files; local links and anchors resolve.
[OK] Release gate válido para 4.1.0.
[OK] Smoke del tarball aprobó 4 runtime(s) declarados.
[OK] Verificación determinista del repositorio aprobada.
```

`verify:repository` ejecuta `node --test test` como primer paso, así que cubre `npm test`.

## Observaciones (no bloqueantes)

1. **Ubicación del veredicto en `epic-analyze-report.md`.** El veredicto `APPROVED` está en el frontmatter y en `## Veredicto`, no dentro de `## Resumen`, que es donde lo ubica la condición 2. El informe también es anterior a la migración (2026-10-22): cita rutas `docs/specs/...` y es previo a la última edición de `epic.md` (2026-10-24). Sus conteos (12 historias, 20 elementos de contrato) siguen coincidiendo con la épica actual. Para dejar la evidencia alineada con el layout nuevo, conviene volver a ejecutar `/epic-analyze`.
2. **CS-10.** `85d9229` cambió una línea de `docs/requirements/README.md` (wikilink `[[eliminar-specs-01-projects]]` → `[[asegurar-dos-niveles-de-flujo-epics-stories]]`) por el renombre de ADR-0013. No es un cambio de ubicación ni lo produjo esta épica.
3. **Versión.** El CHANGELOG declara el cambio como BREAKING y dice que "requiere 5.0.0", pero `package.json` sigue en `4.1.0` y la entrada está en `[Unreleased]`. Hay que subir a la versión mayor en el SHIP.
4. **Estado de la épica y de las historias.** `epic.md` sigue en `status: DEFINE` / `substatus: DONE` y con los CS-1…CS-14 sin marcar (`[ ]`). Las 12 historias están en `VERIFY/DONE`: todavía falta pasarlas a `COMPLETED` y, después, archivarlas en `specs/flow/archive/`. Los cambios de los `story.md` (STORY-147…158) y los cuatro `report-SMOKE-*-20261025.md` están en la copia de trabajo sin commit.
5. **Dogfooding del layout.** Este repositorio no tiene `specs/living/` ni `workflow/`. Ningún CS lo exige (CS-8 se refiere a `/sddf-init` en un repo limpio), pero el layout de ADR-0016 los declara como raíces reservadas.
6. Los evals con LLM de los SMOKE-1, 2, 3 y 6 no se volvieron a ejecutar en esta validación. Se tomaron como evidencia los informes del 2026-10-25, para no gastar cuota (AGENTS.md).
