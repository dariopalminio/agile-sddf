---
type: implement-report
id: STORY-187
slug: STORY-187-implement-report
title: "Implement Report: Dominio, requisitos y máquina de estados sin buffers"
story: STORY-187
created: 2026-11-14
updated: 2026-11-14
---

# Reporte de Implementación: Dominio, requisitos y máquina de estados sin buffers

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-187 |
| Total de tareas | 25 |
| Tareas completadas | 0 (rework: solo correcciones de `fix-directives.md`) |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 25 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa

La historia es documental (`kind: chore`): no hay ciclo TDD ni tests nuevos. La evidencia son los contratos de búsqueda V-1 a V-15 de `design.md` y el gate. Esta ejecución es la ronda 1 de rework tras el `NEEDS-CHANGES` de `story-code-review`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos modificados |
|---|---|---|---|
| T001 | Precondición: ADR-0022 `ACCEPTED`, conteos de partida, constitución y línea base | ✓ completado (ejecución anterior) | — |
| T002 | Glosario de §2 (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T003 | Modelo táctico de §3 (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T004 | Invariantes 2 y 5 (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T005 | Fila `BUFFER` de «Fases compartidas» (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T006 | §5.3 rework (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T007 | §5.5 cola de listos (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T008 | Gate de capacidad, §8 y §9 (C-3) | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T009 | §2 y §3 (C-1) | ✓ completado (ejecución anterior) | `docs/domains/domain-story-lifecycle.md` |
| T010 | §4 pipeline y diagrama (C-1) | ✓ completado (ejecución anterior) | `docs/domains/domain-story-lifecycle.md` |
| T011 | §5 a §8, §10 y §11 (C-1) | ✓ completado (ejecución anterior) | `docs/domains/domain-story-lifecycle.md` |
| T012 | §2 a §4 (C-2) | ✓ completado (ejecución anterior) | `docs/domains/domain-epic-lifecycle.md` |
| T013 | §5 a §8, §10 y §11 (C-2); §9 sin cambios | ✓ completado (ejecución anterior) | `docs/domains/domain-epic-lifecycle.md` |
| T014 | Nivel STORY (C-4) | ✓ completado (ejecución anterior) | `docs/architecture/state-machine.md` |
| T015 | Nivel ÉPICA y «Fuentes de verdad» (C-4) | ✓ completado (ejecución anterior) | `docs/architecture/state-machine.md` |
| T016 | Dominio raíz (C-5) | ✓ completado (ejecución anterior) | `docs/domains/domain.md` |
| T017 | Mapa de skills, sección `## Historia (L1)` (C-6) | ✓ completado (ejecución anterior) | `docs/domains/domain-skills-map.md` |
| T018 | NFR-006 (C-7) | ✓ completado (ejecución anterior) | `docs/requirements/non-functional/NFR-006-control-de-ciclo-de-vida-con-status-substatus.md` |
| T019 | FR-043 (C-8) | ✓ completado (ejecución anterior) | `docs/requirements/functional/FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md` |
| T020 | FR-044 (C-9) | ✓ completado (ejecución anterior) | `docs/requirements/functional/FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md` |
| T021 | FR-045 (C-10) | ✓ completado (ejecución anterior) | `docs/requirements/functional/FR-045-aceptacion-humana-final-fase-acceptance.md` |
| T022 | Contratos de búsqueda V-2, V-3, V-4, V-11, V-12 | ✓ completado (ejecución anterior) | — |
| T023 | Lectura de AC-1 a AC-3 y CNF-1 | ✓ completado (ejecución anterior) | — |
| T024 | Bytes y alcance | ✓ completado (ejecución anterior) | — |
| T025 | Gate | ✓ completado (ejecución anterior, con observación; ver «Pruebas ejecutadas») | — |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | docs/domains/domain-epic-lifecycle.md:38 | MEDIUM | 💻 corregido: docs/domains/domain-epic-lifecycle.md |

La viñeta «Pipeline Epic» termina ahora en `).` y `* **Historia:** Unidad de trabajo atómica que compone la épica (`STORY-NNN`).` vuelve a su propia línea (39). Comprobaciones tras el cambio:

- Sin BOM al inicio (`2d 2d 2d`) y 0 U+FEFF en el cuerpo; finales de línea LF, como antes.
- `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0.
- `node scripts/check-doc-links.js` termina con exit 0.
- Búsqueda del mismo defecto (una viñeta `* **Término:**` pegada al final de otra línea) en los 10 documentos C-1 a C-10: ninguna coincidencia.

**Archivos corregidos:** `docs/domains/domain-epic-lifecycle.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

---

## Línea base (T001)

- `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED` (V-1).
- Conteos de `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` antes del cambio: `domain-story-lifecycle.md` 14, `domain-epic-lifecycle.md` 11, `state-machine.md` 11, `domain.md` 3, `domain-state-management.md` 2, NFR-006 2, `domain-skills-map.md` 1, FR-043/044/045 1 cada uno. Coinciden con la tabla de Context de `design.md`; sin diferencias.
- `grep -n "WIP\|READY-FOR" docs/constitution.md` → solo las líneas 201 y 203 de §9, que limitan `IN-PROGRESS` y no nombran buffers: la constitución no necesita cambios (V-13).
- Línea base del gate: `npm test` 583/584; falla `S097-UT-011` (`memory-system check` sobre `docs/` en menos de 5 s: 10 075 ms). La ejecución empezó tras el cambio de estado de `story.md` y la primera edición de `domain-state-management.md`, así que no es una línea base pura, pero el test mide tiempo y no lee el contenido de los documentos editados.

---

## Contratos de búsqueda (T022, T024)

| Documento | `READY-FOR-*` (V-2) | Citas al ADR (V-4) | `buffer` fuera del slug (V-11) | `RFI`/`RFD` (V-12) | BOM / U+FEFF (V-14) |
|---|---|---|---|---|---|
| `domain-story-lifecycle.md` | 0 | 6 | 0 | 0 | no / 0 |
| `domain-epic-lifecycle.md` | 0 | 4 | 0 | 0 | no / 0 |
| `state-machine.md` | 0 | 4 | 0 | 0 | no / 0 |
| `domain.md` | 0 | 1 | 2 (pregunta cerrada y fila del changelog) | 0 | no / 0 |
| `domain-state-management.md` | 0 | 4 | 0 | 0 | no / 0 |
| NFR-006 | 0 | 1 | 1 (frase obligatoria «no existen estados buffer ni de cola», D-08) | 0 | no / 0 |
| `domain-skills-map.md` | 0 | 1 | 0 | 0 | no / 0 |
| FR-043 | 0 | 1 | 0 | 0 | no / 0 |
| FR-044 | 0 | 1 | 0 | 0 | no / 0 |
| FR-045 | 0 | 1 | 0 | 0 | no / 0 |

**V-3 (workflows literales):** el literal de historia aparece en `domain.md` (1), `domain-story-lifecycle.md` (3) y `state-machine.md` (1); el de épica, en `domain.md` (1), `domain-epic-lifecycle.md` (3) y `state-machine.md` (1).

**Nota sobre V-11:** `design.md` pide `grep -in "buffer"` = 0 en C-1, C-2 y C-3, pero V-4 exige citar `[[workflows-sin-estados-buffer]]`, cuyo slug contiene «buffer». El conteo se hace excluyendo las líneas del slug. En NFR-006 la palabra aparece por la frase que exige D-08.

**Alcance (T024):** `git status` muestra solo los 10 documentos C-1 a C-10, los artefactos de la historia y el checklist de `EPIC-029/epic.md`. La ronda 1 de rework solo tocó `domain-epic-lifecycle.md` (lista blanca de `fix-directives.md`).

---

## Evidencia de los criterios de aceptación (T023)

| Criterio | Evidencia |
|---|---|
| AC-1 — workflow de historia | `domain.md:107`, `domain-story-lifecycle.md` §2, §4.1 y §4.3, `state-machine.md` happy path de STORY |
| AC-1 — workflow de épica | `domain.md:106`, `domain-epic-lifecycle.md` §2 (línea 38), §4.1 y §4.3, `state-machine.md` happy path de ÉPICA |
| AC-1 — cita del ADR | `domain.md:108`; `domain-story-lifecycle.md` §4.1 y §10; `domain-epic-lifecycle.md` §4.1 y §10; `state-machine.md` (bajo cada happy path y en «Fuentes de verdad») |
| AC-2 fila 1 — C-1 y C-3 | `domain-story-lifecycle.md:39` (glosario «Rework») y `:166` (invariante 6); `domain-state-management.md:131-135` (§5.3, «No existe estado ni substatus de rework») |
| AC-2 fila 2 — `state-machine.md` | diagrama (`NEEDS-CHANGES (IMPLEMENT/TODO)` desde `CR`, `VERIFY` y `ACCEPTANCE`) y tabla de transiciones, líneas 102-104 |
| AC-2 fila 3 — FR-043/044/045 | FR-043:24, FR-044:20-22 (`based-on: verify-report.md`), FR-045:20-22 (`based-on: acceptance-report.md`), todos con `IMPLEMENT/TODO` y `fix-directives.md` |
| AC-2 fila 4 — NFR-006 | NFR-006:19-21, «`status` expresa solo la etapa y `substatus` el progreso: no existen estados buffer ni de cola» |
| AC-2 fila 5 — mapa de skills | `domain-skills-map.md` `## Historia (L1)`: `story-analyze` → `PLAN/DONE`; los tres gates → `IMPLEMENT/TODO` |
| AC-3 | `domain-state-management.md` §5.5 «Flujo de la cola de listos (consulta, no estado)»: consulta «primero `IMPLEMENT/TODO`, después `PLAN/DONE`», «no un estado, un gate ni un límite WIP» y `TODO` como «pendiente de iniciar» en cualquier estado activo; invariante 2 |
| CNF-1 | Cada frase nueva sale de ADR-0022 («Workflows», «Reglas comunes», «Rework», tabla de `fix-directives.md` y «Ronda de rework»). El rework de épica (`VALIDATE → DEVELOP`) no cambia. No se repite el número de WIP de la constitución |
| CNF-2 / CNF-3 | 0 menciones de `READY-FOR-IMPLEMENT` y `READY-FOR-DEV` en los 10 documentos; no se describe la ventana de transición |

---

## Pruebas ejecutadas

Ejecución anterior (implementación de T001 a T025):

| Comando | Resultado |
|---|---|
| `node --test test/epic-validate-gateway.test.js` | ✔ 1/1, la línea del gateway de `state-machine.md` no cambió |
| `npm test` | ✖ 583/584. Falla `S097-UT-011` (`memory-system check` sobre `docs/` en menos de 5 s: 7 910 ms) |
| `node --test --test-name-pattern="S097-UT-011" test/memory-system.test.js` | ✔ aislado pasa en 2 022 ms |
| `npm run verify:repository` | ✖ se detiene en el primer paso (`pruebas deterministas`) por el mismo test |
| Pasos restantes de `verify:repository`, uno a uno | ✔ los 13 con exit 0: `verify-syntax`, `verify-fixed-layout`, `verify-profiles`, `verify-runtime-documentation`, `verify-config-contract`, `verify-eval-inventory`, `verify-validation-contract`, `check-doc-links` (resuelve los wikilinks al ADR), `verify-supply-chain`, `verify-skill-security-workflow`, `verify-release`, `npm pack --dry-run` y `smoke-package-install` |

Ronda 1 de rework:

| Comando | Resultado |
|---|---|
| `node scripts/check-doc-links.js` | ✔ exit 0 tras la corrección |
| `npm test` | ✖ 583/584. Falla solo `S097-UT-011` (8 544 ms y 8 809 ms en dos corridas) |
| `node --test --test-name-pattern="S097-UT-011" test/memory-system.test.js` | ✔ aislado pasa (1/1, ~2,1 s) |

`S097-UT-011` es un test de tiempo: falló igual en la línea base, pasa aislado y no depende del contenido de los documentos editados. Bajo la carga de la suite completa en este equipo Windows supera el umbral. CNF-4 queda **pendiente de confirmar**: hay que repetir `npm test` con la máquina descargada o en CI.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1 a AC-3 comprobados por lectura y `grep` (T022, T023); ver «Evidencia de los criterios de aceptación» |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1 a CNF-3 ✓; CNF-4 pendiente por el test de tiempo `S097-UT-011` |
| 3 | El comportamiento coincide con `design.md` | ✓ | C-1 a C-10 editados según D-01 a D-11; la única desviación es el conteo de V-11 (nota en «Contratos de búsqueda»). El glosario de C-2 vuelve a listar «Historia» como término propio (ronda 1) |
| 4 | Sin regresiones | ⚠️ | Requiere ejecución de tests: 583/584, y el único fallo es de tiempo y preexistente |
| 5 | Convenciones de `constitution.md` | ✓ | Español, wikilinks como en el resto de documentos de dominio, guion ASCII |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Sin código; `TODO` solo aparece como valor de `substatus` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: sin código |
| 8 | Linter y formateador sin errores | ✓ | `verify-syntax` y `check-doc-links` pasan; sin viñetas fusionadas en los 10 documentos |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nuevo en `files` | ✓ | No aplica |
| 12 | [[gr-ai-security-checklist]] | ✓ | No aplica: solo documentación de autoridad, sin prompts ni agentes |
| 13 | [[gr-code-security-checklist]] | ✓ | No aplica: sin código |
| 14 | [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crean skills |
| 15 | Skills críticos con `evals.json` | ✓ | No aplica: no se modifican skills |
| 16 | Casos de prueba de `skill-master` ejecutados | ✓ | No aplica: no se modifican skills |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 25/25 |
| 18 | Docs actualizados si cambian contratos | ✓ | Los documentos editados son los contratos de autoridad del ciclo de vida |
| 19 | Decisiones no previstas documentadas | ✓ | Ninguna decisión nueva; la nota de V-11 queda en este reporte |
| 20 | CHANGELOG si aplica | ✓ | No aplica en la historia: el bloque de la épica lo escribe `epic-ship` |
| 21 | Build de CI sin errores | ⚠️ | Requiere ejecución de tests: `verify:repository` se detiene en `S097-UT-011`; los otros 13 pasos pasan |
| 22 | Sin secretos ni credenciales | ✓ | Solo texto de documentación |
| 23 | Variables de entorno documentadas | ✓ | No aplica |
| 24 | El despliegue puede revertirse | ✓ | Cambio documental, reversible con `git revert` |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

Checklist de épica: ✓ `**STORY-187**` ya figura `[x]` en `specs/flow/EPIC-029-eliminar-estados-buffer/epic.md`.

## Nota sobre los Tests Generados

La historia no genera tests. Los tests existentes deben ejecutarse manualmente con el runner del proyecto (`npm test`, `npm run verify:repository`).
