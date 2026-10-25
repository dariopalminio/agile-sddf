---
type: implement-report
id: STORY-153
slug: STORY-153-implement-report
title: "Implement Report: Migrar y archivar los work items a specs/flow"
story: STORY-153
created: 2026-10-24
updated: 2026-10-24
---

# Reporte de Implementación: Migrar y archivar los work items a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-153 |
| Total de tareas | 21 |
| Tareas completadas | 0 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 21 |
| Fecha de implementación | 2026-10-24 |

**Estado:** ✅ Implementación completa — rework de code review (ronda 1) aplicado

La migración se ejecutó sobre este repositorio en la ejecución anterior; sus 177 movimientos se commitearon como renombres en `8df4b11`. Esta ejecución (2026-10-24) solo aplica las correcciones de `fix-directives.md` (ronda 1).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar precondiciones (STORY-149…152, 155, 156, 158; grep v1 vacío; ADR-0016 ACCEPTED) | ✓ completado (ejecución anterior) | — |
| T002 | Línea base de tests, recuentos, status y `git status` | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/baseline.txt` |
| T003 | Aplicar CR-001 (`date:` como tercer nivel) en story.md AC-1 y epic.md | ✓ completado (ejecución anterior) | `specs/flow/STORY-153-…/story.md`, `specs/flow/EPIC-26-…/epic.md` |
| T004 | Helper de fixture en repos git temporales | ✓ completado (ejecución anterior) | `test/migrate-specs-to-flow.test.js` |
| T005 | Casos de AC-1 (destinos, renombres `R`, sin artefactos extra) | ✓ completado (ejecución anterior) | `test/migrate-specs-to-flow.test.js` |
| T006 | Casos de fecha (`archiveDate` y bloqueo sin fecha) | ✓ completado (ejecución anterior) | `test/migrate-specs-to-flow.test.js` |
| T007 | Casos de AC-2 (dry-run, segunda pasada, sin `specs/` creado) | ✓ completado (ejecución anterior) | `test/migrate-specs-to-flow.test.js` |
| T008 | Casos de guardias y aviso | ✓ completado (ejecución anterior) | `test/migrate-specs-to-flow.test.js` |
| T009 | RED: el test falla por módulo inexistente | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/red.txt` |
| T010 | Esqueleto del script (D-1) | ✓ completado (ejecución anterior) | `scripts/migrate-specs-to-flow.js` |
| T011 | Frontmatter y `archiveDate` | ✓ completado (ejecución anterior) | `scripts/migrate-specs-to-flow.js` |
| T012 | `planMigration` | ✓ completado (ejecución anterior) | `scripts/migrate-specs-to-flow.js` |
| T013 | `runMigration` | ✓ completado (ejecución anterior) | `scripts/migrate-specs-to-flow.js` |
| T014 | GREEN: 14/14 casos | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/green.txt` |
| T015 | REFACTOR/revisión: solo `fs`, `path`, `child_process`; sin `process.cwd/env`; sin `rm -r`; `git diff package.json` vacío | ✓ completado (ejecución anterior) | — |
| T016 | `npm test` (304/304) y `verify:syntax` (44 archivos) en verde | ✓ completado (ejecución anterior) | — |
| T017 | Dry-run sobre el repo | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/dry-run.txt` |
| T018 | Ejecución real sobre el repo | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/run.txt` |
| T019 | Segunda ejecución sin cambios | ✓ completado (ejecución anterior) | `.tmp/story-implement/STORY-153/second-run.txt` |
| T020 | Reinstalación de runtime (`node scripts/cli.js install --force`) | ✓ completado (ejecución anterior) | `.claude/` (no versionado) |
| T021 | Artefactos en `specs/flow/STORY-153-…/` y `docs/specs/` no recreado | ✓ completado (ejecución anterior) | este reporte |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | scripts/migrate-specs-to-flow.js:64 | MEDIUM | 💻 corregido: scripts/migrate-specs-to-flow.js — BOM U+FEFF literal sustituido por el escape `\uFEFF` (`.replace(/^\uFEFF/, '')`) |
| 2 | docs/guardrails/dod-story-code-review.md:21 | MEDIUM | Sin edición (así lo indica la directiva): se resuelve con #1 |
| 3 | docs/guardrails/dod-story-code-review.md:25 | MEDIUM | Sin edición (así lo indica la directiva): requiere re-ejecutar `/story-code-review STORY-153` |

**Archivos corregidos:** `scripts/migrate-specs-to-flow.js`
**Hallazgos omitidos por archivo inexistente:** ninguno

Verificación:

- `grep -c $'\xEF\xBB\xBF' scripts/migrate-specs-to-flow.js` → `0`.
- `node --test test/migrate-specs-to-flow.test.js` → 14/14; `npm test` → 304/304; `npm run verify:syntax` → OK (44 archivos).
- El test no tiene un caso específico de BOM (la directiva lo daba por existente). Se comprobó a mano con un fixture git temporal: una story `COMPLETED` con BOM y CRLF se planifica hacia `specs/flow/archive/2026-05-10-STORY-001-x` (dry-run, exit 0). El comportamiento no cambia: `lines[0].trim()` ya descartaba el BOM de la línea `---`.
- Los hallazgos LOW del review (parseo de renombres en `:174`, ruta absoluta en `:110`, `mkdirSync` incondicional, traspasos CR-001/002/003) no forman parte de la directiva y no se tocaron.

---

## Migración del repositorio (D-11)

| Paso | Resultado |
|---|---|
| Línea base (T002) | 27 épicas, 149 stories (98 `COMPLETED`, 11 `CANCELED`, 40 en otros estados) |
| Dry-run (T017) | exit 0, 177 `[MOVERÍA]`, 0 bloqueos; `git status --porcelain` idéntico antes y después |
| Ejecución (T018) | exit 0, 177 `[MOVIDO]`; épicas 27, activas 51, archivadas 98, total previo 149 (51 + 98 = 149) |
| Comprobaciones (T018) | `docs/specs/` no existe; `specs/README.md`, `specs/flow/EPIC-26-…/` y `specs/flow/STORY-153-…/` existen; `git status`: 714 `R` y 3 `RM` (los 717 archivos versionados de `docs/specs/`) más el script y el test nuevos; `git status --porcelain -- docs/requirements` vacío |
| Segunda ejecución (T019) | `[SIN CAMBIOS] docs/specs/ no existe: nada que migrar`, exit 0, `git status --porcelain` idéntico (719 líneas) |
| Runtime (T020) | 35 skills reinstalados; `.claude/skills/story-implement-tasks/SKILL.md` sin `SDDF-ROOT-RESOLUTION: v1` y con rutas `specs/flow/` |
| Post-corte (T021) | `test ! -e docs/specs` ✓ tras escribir este reporte y marcar `tasks.md` |

Avisos del plan (esperados): EPIC-26 (1 archivo) y STORY-153 (2 archivos) se movieron con cambios locales sin commitear; los cambios eran los de esta propia implementación (T001–T017 en `tasks.md`, estado y AC-1 en `story.md`, nota de fecha en `epic.md`).

### Decisiones de implementación menores (dentro del design)

- `archiveDate` aplica D-4 de forma literal: `date:` solo se consulta si **no existen** las claves `updated:` ni `created:`; si existen con formato inválido devuelve `null` (bloqueo).
- La guardia «origen versionado» usa una sola llamada `git ls-files -z -- docs/specs` agrupada por directorio de primer nivel, en lugar de una llamada por directorio; el resultado es equivalente y evita 177 procesos.
- El resumen añade la línea `Preexistentes:` solo cuando es mayor que 0 (0 en este repo).

---

## Estado conocido del gate y traspaso

- **`npm run verify:repository` falla (esperado, STORY-157):** el paso «enlaces activos» reporta 444 enlaces y wikilinks rotos, todos en `docs/index.md`, por las rutas movidas de `docs/specs/`. Todos los pasos anteriores pasan (tests, sintaxis, layout fijo, perfiles, runtimes, configuración, evals, contrato de validación) y los posteriores, ejecutados por separado, también (`verify-supply-chain`, `verify-skill-security-workflow`, `verify-release`, `npm pack --dry-run`, smoke del tarball con 4 runtimes). Salida en `.tmp/story-implement/STORY-153/verify-repository.txt`.
- **CR-001 / ADR-0016 (pendiente):** ADR-0016 (aceptado, inmutable) solo fija `updated:` → `created:` para la fecha del archivo; no recoge el tercer nivel `date:` aplicado a las 37 stories `COMPLETED` antiguas (STORY-001…049 y STORY-087). Si se quiere reflejar en la decisión, requiere un ADR nuevo que la complemente o reemplace; story.md (AC-1) y epic.md ya están actualizados.
- **CR-002 → STORY-154:** `docs/specs/README.md` se movió a `specs/README.md`; su contenido sigue describiendo el layout retirado (`specs/epics/`, `specs/stories/`) y debe reescribirse al layout fijo. El enlace de `docs/index.md` se repara en STORY-157.
- **CR-003 → STORY-157:** `sddf.config.yaml` conserva `root: docs` (no se toca en esta historia); su retiro se asigna a STORY-157 al cerrar CS-3.
- **Precondición STORY-151:** está implementada (24/24 tareas) pero tiene un rework abierto de code review (`fix-directives.md`, ronda 2, solo sobre el cierre de su T022 por el gate). No afecta a la migración; ahora vive en `specs/flow/STORY-151-…/`.
- **Commit:** los renombres se commitearon en `8df4b11` (714 R100 y 3 con cambios, según el code review); la verificación con `git log --follow` es de STORY-157.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1 y AC-2: 14/14 casos en fixtures (`green.txt`) y verificación sobre el repo real (T017–T019) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: sin logs ni eventos (test «solo existen los destinos del plan»); CNF-2: solo módulos de Node, `package.json` sin cambios, `CANCELED` queda activa; CNF-3: 714 `R` + 3 `RM` en el índice; CNF-4: `docs/requirements` sin cambios |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-11 implementados; desvíos menores documentados arriba |
| 4 | No hay regresiones | ⚠️ | `npm test` 304/304; `verify:links` falla por 444 enlaces de `docs/index.md`, consecuencia prevista de la historia y resuelta en STORY-157 |
| 5 | Convenciones de `constitution.md` | ✓ | CommonJS, shebang, JSDoc de cabecera, mensajes en español, patrón de `migrate-finvest-field.js` y `check-doc-links.js` |
| 6 | Sin código comentado ni `TODO` | ✓ | Revisión de `scripts/migrate-specs-to-flow.js` y del test |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisión en T015 |
| 8 | Linter y formateador sin errores | ✓ | El repo no define linter; `verify:syntax` OK (44 archivos) |
| 9 | Sin dependencias nuevas | ✓ | `git diff package.json` vacío |
| 10 | Uso de `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills (CNF-1) |
| 11 | Skill nuevo incluido en `files` | ✓ | No aplica: no hay skill nuevo; `scripts/` ya está en `files` |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Sin prompts ni datos sensibles; script local de un solo uso; `ai-no-hidden-characters`: BOM literal sustituido por `\uFEFF` (fix-directives ronda 1), 0 bytes `EF BB BF` en el script |
| 13 | Se cumple gr-code-security-checklist | ✓ | `spawnSync` con argumentos en arreglo y sin shell; sin `rm -r`; raíz derivada de `__dirname` |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | No aplica: no se crean ni modifican skills |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: no se modifican skills |
| 16 | Casos de prueba ejecutados según skill-master | ✓ | No aplica a skills; la prueba del script se ejecutó (14/14, re-ejecutada tras la ronda 1) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 21/21 |
| 18 | README/docs actualizados si cambian contratos | ⚠️ | El layout cambia; la documentación (`AGENTS.md`, arquitectura, guías, `specs/README.md`) es alcance de STORY-154 |
| 19 | Decisiones no previstas documentadas | ✓ | Sección «Decisiones de implementación menores» |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | El CHANGELOG del cambio incompatible es de STORY-154 |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; localmente `verify:repository` falla solo en «enlaces activos» (STORY-157) |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno en el script ni en el test |
| 23 | Variables de entorno documentadas | ✓ | No aplica: el script no lee variables de entorno |
| 24 | Despliegue reversible sin pérdida | ✓ | Movimientos commiteados como renombres (`8df4b11`, revertible con `git revert`); `git mv` conserva el contenido y nunca se usó `rm -r` |

**Resumen:** 20/24 criterios ✓ (4 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests se ejecutaron durante la implementación (`node --test test/migrate-specs-to-flow.test.js`: 14/14; `npm test`: 304/304). Pasos recomendados:

1. Ejecutar el suite de tests del proyecto tras el commit de los renombres.
2. Ejecutar STORY-157 para reparar los enlaces y dejar `npm run verify:repository` en verde.
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas.
