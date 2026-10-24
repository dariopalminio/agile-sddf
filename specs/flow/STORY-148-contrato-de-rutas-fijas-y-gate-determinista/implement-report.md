---
type: implement-report
id: STORY-148
slug: STORY-148-implement-report
title: "Implement Report: Contrato de rutas fijas y gate determinista"
story: STORY-148
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Contrato de rutas fijas y gate determinista

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-148 |
| Total de tareas | 26 |
| Tareas completadas | 26 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

> **Línea base no verde (preexistente):** antes de cualquier cambio, `npm test` ya tenía **15 fallos** (259 pruebas, 244 OK), todos en las pruebas de migración del template de épica (`UT-001`, `UT-003`, `UT-005…UT-012`, `UT-010`, `UT-011`, `UT-012`, `UT-014`, `UT-016`, `UT-019`, `UT-020`, `IT-001`). Coinciden con el cambio de `docs/templates/epic-template.md` del commit `1429229` y quedan fuera del alcance de STORY-148. Tras la implementación: 277 pruebas, 262 OK y los **mismos 15 fallos**, sin fallos nuevos. Evidencia: `.tmp/story-implement/STORY-148/baseline.txt`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición ADR-0016 `ACCEPTED` y contenido de `## Decisión` | ✓ completado | — |
| T002 | Línea base (`npm test`, `verify:repository`, `ls skills/`, referencias al script legado) | ✓ completado | `.tmp/story-implement/STORY-148/baseline.txt` |
| T003 | Esqueleto de pruebas con fixtures temporales | ✓ completado | `test/verify-fixed-layout.test.js` |
| T004 | Casos R1–R4 de `checkSkillLayout` | ✓ completado | `test/verify-fixed-layout.test.js` |
| T005 | Casos de la región `SDDF-LEGACY-DIAGNOSTIC` | ✓ completado | `test/verify-fixed-layout.test.js` |
| T006 | Casos de `verifyFixedLayout` (lista transitoria, determinismo) | ✓ completado | `test/verify-fixed-layout.test.js` |
| T007 | RED: falla por módulo inexistente | ✓ completado | `.tmp/story-implement/STORY-148/red.txt` |
| T008 | Constantes exportadas y `PENDING_MIGRATION` (36 skills) | ✓ completado | `scripts/verify-fixed-layout.js` |
| T009 | `checkSkillLayout` puro (R1–R4 y región D-3) | ✓ completado | `scripts/verify-fixed-layout.js` |
| T010 | Traslado de chequeos heredados (D-5) | ✓ completado | `scripts/verify-fixed-layout.js` |
| T011 | `verifyFixedLayout` con higiene de la lista | ✓ completado | `scripts/verify-fixed-layout.js` |
| T012 | CLI `--quiet` / `--json` y exportaciones | ✓ completado | `scripts/verify-fixed-layout.js` |
| T013 | GREEN: 18/18; CLI en el repo real → exit 0, 36 pendientes | ✓ completado | — |
| T014 | Paso del gate `contrato de layout fijo` (3.º) | ✓ completado | `scripts/verify-repository.js` |
| T015 | Label esperado en la prueba del gate | ✓ completado | `test/verify-repository.test.js` |
| T016 | `verify.integration.command` | ✓ completado | `sddf.config.yaml` |
| T017 | Verificación del stack `sddf-authoring` | ✓ completado | `config/profiles.json` |
| T018 | Ruta del fixture de perfiles | ✓ completado | `test/profile-contract.test.js` |
| T019 | Alias `verify:layout` | ✓ completado | `package.json` |
| T020 | Eliminar `scripts/audit-root-resolution.js`; `git grep` vacío | ✓ completado | `scripts/audit-root-resolution.js` (eliminado) |
| T021 | AC-1: `npm test` y gate | ✓ completado (con la salvedad de la línea base) | — |
| T022 | AC-2 en copia temporal (`story-plan` fuera de la lista) | ✓ completado | `.tmp/story-implement/STORY-148/ac2.txt` |
| T023 | CNF-1 y CNF-2 | ✓ completado | — |
| T024 | Perfiles y alcance | ✓ completado | — |
| T025 | Encoding UTF-8 sin BOM y `graphify update .` | ✓ completado | — |
| T026 | Registro de CR-001 y CR-002 | ✓ completado | `docs/guides/skill-structural-pattern.md`, este reporte |

---

## Evidencia de verificación

| Contrato (design.md) | Resultado |
|---|---|
| #1 Skill conforme sin errores | `node --test test/verify-fixed-layout.test.js` → 18 pass, 0 fail |
| #2 Gate verde con el árbol actual | Paso «contrato de layout fijo» → exit 0 (`[OK] … 36 skill(s); 36 pendiente(s)`). Los otros 13 pasos del gate se ejecutaron uno a uno: 12 OK; «pruebas deterministas» falla solo por los 15 fallos preexistentes (ver Resumen) |
| #3/#4 Referencia legada con skill y línea; gate rojo | Copia temporal sin `story-plan` en la lista → exit 1, 15 `[ERROR]`, p. ej. `skills/story-plan/SKILL.md:89: referencia legada \`SPECS_BASE\`` |
| #5 Excepción de `skill-preflight` | Casos «Excepción», «Fuera de la región», «Región en otro skill», «sin cerrar», «sin abrir» en verde |
| #6 Determinismo | Caso «Determinismo» en verde; `process.env` y `sddf.config.yaml` solo aparecen en el comentario de cabecera y en el literal de R4 |
| #7 Sin dependencias nuevas | `git diff package.json` → solo `+ "verify:layout"` |
| #8 `npm test` incluye las pruebas | 277 pruebas (259 + 18 nuevas) |
| #9 Script legado eliminado | `test ! -e` OK; `git grep` filtrado vacío (solo quedan menciones en `.temp/`, excluido) |
| #10 Perfiles | `verify:profiles` exit 0; `test/profile-contract.test.js` 4/4 |
| #11 Alcance | 9 archivos de «Componentes afectados» + `docs/guides/skill-structural-pattern.md` (rama CR-001) + artefactos de la historia; ningún `SKILL.md` |

## Registro de CR

- **CR-001 — rama de respaldo aplicada.** ADR-0016 está `ACCEPTED` (2026-10-23), pero su `## Decisión` solo fija las rutas fijas y el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE`. No incluye el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, el texto canónico del bloque ni la región `SDDF-LEGACY-DIAGNOSTIC`. Se documentaron en `docs/guides/skill-structural-pattern.md` §3.1. El ADR aceptado no se editó: es inmutable. Si se quiere elevarlos a decisión arquitectónica, hace falta un ADR nuevo.
- **CR-002 — resuelto en código.** `config/profiles.json` y `test/verify-repository.test.js` se actualizaron (T015, T017). Falta retroalimentar `story.md › Notas › Alcance mínimo del contrato`, que todavía nombra solo tres referencias. No se editó aquí porque este skill no corrige artefactos de planning.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin pasan | ⚠️ | AC-1: el paso de layout pasa y las pruebas del caso conforme están en verde, pero el gate completo sigue rojo por 15 fallos preexistentes ajenos. AC-2: verificado (T022). Requiere ejecución de tests, no evaluable por story-implement |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (caso Determinismo, grep), CNF-2 (sin dependencias), CNF-3 (18 pruebas en `npm test`) |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1 a D-7 implementados con los mensajes y las firmas del diseño |
| 4 | Sin regresiones | ⚠️ | Mismos 15 fallos que la línea base y ninguno nuevo. Requiere ejecución de tests, no evaluable por story-implement |
| 5 | Convenciones de `constitution.md` | ✓ | CommonJS `'use strict'`, `node:` built-ins, `module.exports` y CLI bajo `require.main`, igual que `verify-*.js` |
| 6 | Sin código comentado ni `TODO` | ✓ | Solo hay comentarios explicativos |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisado en el script y en la prueba |
| 8 | Linter y formateador sin errores | ⚠️ | El repo no tiene linter; `verify-syntax.js` → exit 0 |
| 9 | Sin dependencias nuevas | ✓ | `dependencies` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se creó ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica; `scripts/` ya se publica entero |
| 12 | [[gr-ai-security-checklist]] | ✓ | Sin superficie LLM: validador determinista |
| 13 | [[gr-code-security-checklist]] | ✓ | Solo lectura de archivos del repo; sin red, shell ni secretos |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se creó ni modificó ningún skill |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: ningún skill modificado |
| 16 | Casos de prueba ejecutados según `skill-master` | ✓ | No aplica a skills; las pruebas unitarias del script se ejecutaron |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 26/26 |
| 18 | README/docs actualizados si cambia un contrato | ✓ | `docs/guides/skill-structural-pattern.md` §3.1 |
| 19 | Decisiones no previstas documentadas | ✓ | Rama CR-001 registrada en este reporte y en la guía |
| 20 | CHANGELOG si aplica | ✓ | No aplica: es Non-Goal del diseño (la entrada se escribe al publicar) |
| 21 | Build de CI pasa | ⚠️ | `verify:repository` sigue rojo solo por los 15 fallos preexistentes de la línea base. Requiere ejecución de CI, no evaluable por story-implement |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ✓ | No se añade ninguna; el validador no lee el entorno |
| 24 | Despliegue reversible | ✓ | Cambio de código puro, reversible con `git revert` |

**Resumen:** 20/24 criterios ✓ (4 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

1. `npm test`: corrige antes los 15 fallos preexistentes de la migración del template de épica, ajenos a esta historia, para que `verify:repository` vuelva a verde.
2. `npm run verify:layout`: paso nuevo del gate.
3. Contrasta con `design.md` (D-1 a D-7) si cambia algún mensaje o regla.
