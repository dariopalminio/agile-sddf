---
type: implement-report
id: STORY-186
slug: STORY-186-implement-report
title: "Implement Report: ADR de workflows sin estados buffer"
story: STORY-186
created: 2026-11-14
updated: 2026-11-14
---

# Reporte de Implementación: ADR de workflows sin estados buffer

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-186 |
| Total de tareas | 20 |
| Tareas completadas | 20 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa

La historia es `kind: chore` documental: no añade código ni pruebas automáticas. El ciclo TDD se sustituye por los contratos de verificación V-1 a V-11 de `design.md`, ejecutados como comprobaciones sobre los archivos (sección «Pruebas ejecutadas»).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar el estado de partida y la línea base del gate | ✓ completado | — |
| T002 | Crear ADR-0022 desde `adr-template.md` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T003 | `## Contexto y problema` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T004 | `## Decisión` — workflows | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T005 | `## Decisión` — rework y contrato de `fix-directives.md` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T006 | `## Decisión` — valor legado y ventana | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T007 | `## Rationale` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T008 | `## Alternativas consideradas` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T009 | `## Consecuencias` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T010 | `## Referencias` | ✓ completado | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` |
| T011 | ADR-0006: `status` y `superseded-by` | ✓ completado | `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md` |
| T012 | ADR-0008: `status` y `superseded-by` | ✓ completado | `docs/adr/ADR-0008-rework-sin-estado-propio.md` |
| T013 | Índice de ADRs | ✓ completado | `docs/adr/README.md` |
| T014 | Índice wiki | ✓ completado | `docs/index.md` |
| T015 | Verificar AC-1 y CNF-3 (V-1 a V-6) | ✓ completado | — |
| T016 | Verificar AC-2 y AC-3 (V-7, V-8) | ✓ completado | — |
| T017 | Verificar CNF-1 y CNF-2 (V-9) | ✓ completado | — |
| T018 | Verificar encoding (V-11) | ✓ completado | — |
| T019 | Gate (`verify:repository`, `npm test`) | ✓ completado (con la salvedad de `S097-UT-011`, ver abajo) | — |
| T020 | `graphify update .` y `git status` | ✓ completado | — |

---

## Archivos modificados

- `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` (nuevo)
- `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md` (2 líneas del frontmatter)
- `docs/adr/ADR-0008-rework-sin-estado-propio.md` (2 líneas del frontmatter)
- `docs/adr/README.md` (fila nueva y dos celdas `Estado`)
- `docs/index.md` (una línea)

Ningún archivo fuera del alcance aparece en `git status` (además de los artefactos de la propia historia).

---

## Desviaciones respecto de design.md

- **Número de encabezados de la plantilla:** `design.md` (Context, V-2) y `tasks.md` (T002) hablan de 7 encabezados `##` en `adr-template.md`, pero la plantilla tiene 6 (`Contexto y problema`, `Decisión`, `Rationale`, `Alternativas consideradas`, `Consecuencias`, `Referencias`). ADR-0022 reproduce los 6, en el mismo orden. Es un error de conteo del diseño, no una decisión: no cambia ningún contrato.
- **Alternativas adicionales:** además de las de D-08, `## Alternativas consideradas` registra «Estado `NEEDS-CHANGES` o substatus `REWORK`» (D-03), `DoD-VERIFY` y `test-failure` como dimensión de verify (D-04) e inferir la lista blanca de git (D-04), todas descartadas en `design.md`.
- **Consecuencia adicional:** «`fix-directives.md` pasa de un escritor a tres: el principio de escritor único se cumple por gate, no por archivo». Es un trade-off implícito en D-04 que el ADR hace explícito.

---

## Pruebas ejecutadas

| Contrato | Comprobación | Resultado |
|---|---|---|
| V-1 | frontmatter de ADR-0022 | ✓ `status: ACCEPTED`, `date: 2026-11-14`, `supersedes: [ADR-0006, ADR-0008]` |
| V-2 | `diff` de los `## ` de `adr-template.md` y ADR-0022 | ✓ idénticos (6 encabezados, mismo orden) |
| V-3 | grep de los dos workflows literales y de la aprobación manual del PO | ✓ 1 coincidencia de cada workflow; «La aprobación del PO es `PLAN/DONE` y se escribe a mano» |
| V-4 | `git diff` de ADR-0006 y ADR-0008 | ✓ exactamente 2 líneas `-` y 2 `+` por archivo (`status`, `superseded-by`) |
| V-5 | `git diff --quiet -- docs/adr/ADR-0003-*` | ✓ exit 0 |
| V-6 | grep de ADR-0022 en `docs/adr/README.md` | ✓ fila con el mismo título, `ACCEPTED` y `2026-11-14`; ADR-0006 y ADR-0008 como `SUPERSEDED → [ADR-0022](…)` |
| V-7 | tabla de gates en `## Decisión` | ✓ 3 filas con `based-on`, dimensiones `DoD-CODE-REVIEW` (o la del revisor), `verify-defect`, `requirements-coverage`; destino `IMPLEMENT/TODO`; regla de ronda continua |
| V-8 | grep de `implement-report.md`, `7.0.0` y la negación del estado de rework | ✓ regla del valor legado por `implement-report.md`; «La ventana se abre en 6.0.0 y termina en 7.0.0»; «no define ningún estado ni substatus de rework» |
| V-9 | lectura de `## Alternativas consideradas` | ✓ 4/4 obligatorias de CNF-2 con su motivo |
| V-10 | gate | ⚠️ ver abajo |
| V-11 | primeros bytes y búsqueda de U+FEFF, U+200B–U+200F, U+2060 y U+00A0 en los 5 archivos | ✓ ninguno empieza por `EF BB BF`; 0 caracteres invisibles |

**Gate (V-10, CNF-4):**

- `npm test`: 583/584. Falla `S097-UT-011 check: docs/ de este repositorio en menos de 5 s (V-10)` (8,5–9,1 s). Es **preexistente**: falló igual en la línea base de T001, antes de cualquier cambio (7,8 s), y pasa aislado tras el cambio (`node --test --test-name-pattern="S097-UT-011"`, 1,5 s). Es una prueba de tiempo sensible a la carga de la máquina, no una regresión de esta historia.
- `npm run verify:repository` se detiene en su primer paso (las pruebas deterministas) por la misma prueba. Los otros 13 pasos, ejecutados uno a uno, salen con 0: `verify-syntax`, `verify-fixed-layout`, `verify-profiles`, `verify-runtime-documentation`, `verify-config-contract`, `verify-eval-inventory`, `verify-validation-contract`, `check-doc-links`, `verify-supply-chain`, `verify-skill-security-workflow`, `verify-release`, `npm pack --dry-run --ignore-scripts` y `smoke-package-install`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1 (V-1 a V-6), AC-2 (V-7) y AC-3 (V-8) verificados sobre los archivos |
| 2 | Los criterios no funcionales están verificados | ⚠️ | CNF-1, CNF-2 y CNF-3 ✓; CNF-4 con la salvedad de `S097-UT-011` (preexistente) |
| 3 | El comportamiento coincide con `design.md` | ✓ | C-1 a C-5 e interfaces aplicadas literalmente; desviación de conteo de encabezados documentada |
| 4 | No hay regresiones | ✓ | Mismo resultado de `npm test` que la línea base (583/584, mismo fallo preexistente) |
| 5 | Convenciones de `constitution.md` | ✓ | Documento en español, desde `adr-template.md`, frontmatter de autoría manual |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No hay código; el ADR no contiene `TODO` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: sin código |
| 8 | Linter y formateador sin errores | ✓ | No hay linter de Markdown; `check-doc-links` y `verify-syntax` salen con 0 |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica |
| 12 | [[gr-ai-security-checklist]] | ✓ | Sin código, prompts ejecutables ni secretos |
| 13 | [[gr-code-security-checklist]] | ✓ | Sin código |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crean ni modifican skills |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: ningún skill cambia |
| 16 | Casos de prueba ejecutados según `skill-master` | ✓ | No aplica: ningún skill cambia |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 20/20 |
| 18 | README o docs actualizados si cambian contratos | ✓ | `docs/adr/README.md` y `docs/index.md` actualizados |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Ninguna decisión nueva; las desviaciones menores se documentan en este reporte |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica: el bloque BREAKING lo escribe `/epic-ship` (fuera de alcance de la historia) |
| 21 | El build de CI pasa | ⚠️ | `verify:repository` sale con 1 por `S097-UT-011` (preexistente, de tiempo); los demás 13 pasos salen con 0 |
| 22 | Sin secretos ni credenciales | ✓ | Solo Markdown documental |
| 23 | Variables de entorno documentadas | ✓ | No aplica: no se añaden |
| 24 | Despliegue reversible | ✓ | Cambio documental, reversible con git |

**Resumen:** 22/24 criterios ✓ · 2 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

La historia no genera tests: es documental (`kind: chore`). Las comprobaciones de la tabla «Pruebas ejecutadas» se ejecutaron durante la implementación. Antes de `/story-code-review`, conviene volver a ejecutar `npm test` con la máquina descargada para confirmar que `S097-UT-011` pasa.
