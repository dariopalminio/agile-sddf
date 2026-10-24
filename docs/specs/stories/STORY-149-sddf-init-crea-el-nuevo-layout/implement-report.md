---
type: implement-report
id: STORY-149
slug: STORY-149-implement-report
title: "Implement Report: sddf-init crea el nuevo layout"
story: STORY-149
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: sddf-init crea el nuevo layout

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-149 |
| Total de tareas | 27 |
| Tareas completadas | 27 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición CR-001 | ✓ completado | — (ver «Registro T027») |
| T002 | Línea base | ✓ completado | `.tmp/story-implement/STORY-149/baseline.txt`, `baseline-failures.txt` |
| T003–T005 | Prueba determinista | ✓ completado | `test/sddf-init-layout.test.js` |
| T006 | RED | ✓ completado | `.tmp/story-implement/STORY-149/red.txt` |
| T007–T014 | Protocolo de `sddf-init` (Pasos 1, 1b, 2, 2b, 3, 4, 5, 5b, 6, reglas, descripción) | ✓ completado | `skills/sddf-init/SKILL.md` |
| T015–T016 | Assets sin `root` | ✓ completado | `skills/sddf-init/assets/sddf.config.yaml.template`, `.example` |
| T017 | README | ✓ completado | `skills/sddf-init/README.md` |
| T018 | Evals v3.0.0 | ✓ completado | `skills/sddf-init/evals/evals.json` |
| T019 | Salida de `PENDING_MIGRATION` | ✓ completado | `scripts/verify-fixed-layout.js` |
| T020–T021 | GREEN y grep de AC-4 | ✓ completado | — |
| T022–T024 | AC-1, AC-3, AC-2/CNF-1 en sandbox | ✓ completado | `.tmp/story-implement/STORY-149/ac1/`, `ac2/` |
| T025 | Regresión | ✓ completado con salvedad | ver «Verificación» |
| T026 | Alcance y encoding | ✓ completado | — |
| T027 | Registro | ✓ completado | este reporte |

---

## Verificación

- `node --test test/sddf-init-layout.test.js`: 6/6 en verde (RED inicial: 6/6 en rojo).
- `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/sddf-init/` y `grep -nE "^root:" skills/sddf-init/assets/*`: sin coincidencias (AC-4).
- `node scripts/verify-fixed-layout.js`: exit 0; `sddf-init` ya no figura entre los 35 pendientes.
- Pasos de `verify:repository` ejecutados uno a uno (sintaxis, contrato de layout, perfiles, runtimes, configuración, inventario de evals, contrato de validación, enlaces): exit 0.
- Sandboxes AC-1, AC-3 y AC-2 aplicando a mano el protocolo del `SKILL.md` (el skill es Markdown ejecutado por un LLM; no hay motor determinista): layout con `.gitkeep`, `sddf.config.yaml` sin `root`, sin `docs/specs/`; re-ejecución sin cambios en `specs/` ni `workflow/`; layout legado sin escrituras y `docs/specs/` idéntico por hash.
- Archivos tocados en UTF-8 sin BOM ni mojibake. `git diff` limita los cambios de la historia a los 7 archivos de «Componentes afectados» más sus artefactos.

### Salvedad — fallos preexistentes

`npm test` y, por tanto, `npm run verify:repository` (que se detiene en el paso «pruebas deterministas») terminan con exit 1 por **15 fallos que ya existían antes de esta historia** (línea base en `.tmp/story-implement/STORY-149/baseline-failures.txt`; el conjunto de fallos es idéntico antes y después): pruebas de `epic-template` / migración de épicas (UT-001, UT-003, UT-005…UT-012, UT-014, UT-016, UT-019, UT-020, IT-001). No están relacionadas con `sddf-init`. Con la historia, la suite pasa de 277 a 283 pruebas (+6 nuevas, todas en verde).

---

## Registro T027

- **CR-001:** cumplida. `scripts/audit-root-resolution.js` no existe, `scripts/verify-fixed-layout.js` exporta `checkSkillLayout` y `PENDING_MIGRATION`, y `scripts/verify-repository.js` declara el paso «contrato de layout fijo». Estos cambios de STORY-148 están aún sin commitear en el working tree.
- **CR-002:** vigente. El scaffold de `memory-system` (`--level full`) sigue creando `docs/specs/epics/` y `docs/specs/stories/` hasta STORY-152; el estado mixto de `sddf-init` mantiene la re-ejecución funcional. AC-1 (nivel por defecto) no se ve afectado.
- **Evals:** `npm run test:eval -- sddf-init` **no se ejecutó**; queda a criterio humano (TC-001–TC-004 cubren AC-1 a AC-3).
- **Observación (RED):** en la verificación RED, el caso «Evals cubren AC-1 y AC-2» falló por un error de acceso en la propia prueba (estructura `cases` mal supuesta) y no por el estado del skill; se corrigió y el caso pasa por la razón correcta.
- **Observación (evals.json):** al reescribirse con `JSON.stringify` los arreglos `contains`/`not_contains` quedaron en varias líneas, no inline como antes; es solo formato.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Escenarios Gherkin de `story.md` pasan | ⚠️ | AC-4 verificado de forma determinista; AC-1 a AC-3 solo en sandbox manual y evals no ejecutados |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (sandbox legado), CNF-2 (prueba de evals), CNF-3 (gate) |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1 a D-11 aplicados; textos literales de D-5 y D-6 |
| 4 | Sin regresiones | ⚠️ | Mismos 15 fallos preexistentes antes y después; sin regresiones nuevas |
| 5 | Convenciones de `constitution.md` | ✓ | Español, `node:test`, patrón de pruebas existente |
| 6 | Sin código comentado ni `TODO` | ✓ | — |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | — |
| 8 | Linter y formateador | ⚠️ | Requiere ejecución externa; el proyecto no define linter |
| 9 | Sin dependencias nuevas | ✓ | — |
| 10 | `skill-master` para skills nuevos | ✓ | No se crea ningún skill nuevo |
| 11 | Ruta en `files` de `package.json` | ✓ | No se añade skill nuevo |
| 12–14 | Checklists de seguridad y de creación de skills | ⚠️ | Sin superficie nueva de seguridad; el checklist no se recorrió ítem por ítem |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/sddf-init/evals/evals.json` v3.0.0 |
| 16 | Casos de prueba ejecutados y evaluados | ⚠️ | Requiere ejecución de evals — no ejecutada (criterio humano) |
| 17 | `tasks.md` todo `[x]` | ✓ | 27/27 |
| 18 | README/docs actualizados | ✓ | `skills/sddf-init/README.md`; la guía de migración es de STORY-154 |
| 19 | Decisiones nuevas documentadas en `design.md` | ✓ | Sin decisiones nuevas |
| 20 | CHANGELOG | ⚠️ | No evaluable desde los artefactos; a criterio del release |
| 21 | Build de CI | ⚠️ | Requiere CI — no evaluable por story-implement; ver salvedad |
| 22 | Sin secretos | ✓ | — |
| 23 | Variables de entorno documentadas | ✓ | `.env.template` neutral (D-6) |
| 24 | Despliegue reversible | ✓ | Cambios solo en archivos versionados |

**Resumen:** 15/24 criterios ✓ · 9 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen en CI.
