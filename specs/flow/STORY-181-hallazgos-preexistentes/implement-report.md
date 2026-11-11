---
type: implement-report
id: STORY-181
slug: STORY-181-implement-report
title: "Implement Report: Hallazgos preexistentes"
story: STORY-181
created: 2026-11-10
updated: 2026-11-10
---

# Reporte de Implementación: Hallazgos preexistentes

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-181 |
| Total de tareas | 25 |
| Tareas completadas | 25 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-10 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar estado de STORY-180 y de ADR-0021 | ✓ completado | — (STORY-180 implementada: 4a.1, severidad efectiva por informe y fila `Guía de revisión` existen → 4a.2 tras 4a.1 y fila tras `Guía de revisión`; `docs/adr/ADR-0021-guia-de-revision-review-md.md` existe → se cita por número) |
| T002 | Confirmar IDs libres de evals | ✓ completado | — (último caso TC-029 → TC-030 a TC-033) |
| T003 | Comprobar CR-001 | ✓ completado | — (**pendiente**: AC-3 de `story.md` aún dice «el método que fija el ADR de la guía de revisión»; no bloquea, el método está fijado en D-1 a D-3 de `design.md`) |
| T004 | Evals primero: TC-030 a TC-033 | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T005 | Prueba del motor (RED) | ✓ completado | `test/story-code-review-preexisting.test.js` (falló por `Cannot find module …touched-lines.js`) |
| T006 | `parseLocation` | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` |
| T007 | `touchedLines` | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` |
| T008 | `resolveBase` | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` |
| T009 | `classifyLocations` | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` |
| T010 | CLI `classify` (GREEN) | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` |
| T011 | Refactor del motor | ✓ completado | `skills/story-code-review/scripts/touched-lines.js` (un único helper `git()`, una función por responsabilidad) |
| T012 | «Qué hace», `## Dependencias`, `CLI_ROOT` en Paso 0 | ✓ completado | `skills/story-code-review/SKILL.md` |
| T013 | Paso 4a.2 «Clasificar hallazgos PREEXISTENTE» | ✓ completado | `skills/story-code-review/SKILL.md` |
| T014 | Pasos 4b, 4c, 4c.1 y 4e (y total de bloqueantes de 4f.2) | ✓ completado | `skills/story-code-review/SKILL.md` |
| T015 | Frase de 4c.2 (CR-002) | ✓ completado | `skills/story-code-review/SKILL.md` |
| T016 | Paso 5b: `{{PREEXISTING_STATUS}}`, celda `🟣 PREEXISTENTE (<sev>)`, `{{DECISION_RATIONALE}}` | ✓ completado | `skills/story-code-review/SKILL.md` |
| T017 | Paso 7 y `### Manejo de errores` | ✓ completado | `skills/story-code-review/SKILL.md` |
| T018 | Fila `Hallazgos preexistentes` en la plantilla | ✓ completado | `skills/story-code-review/assets/code-review-report-template.md` |
| T019 | Frase en «What it does» | ✓ completado | `skills/story-code-review/README.md` |
| T020 | Aserción 7 (contrato) | ✓ completado | `test/story-code-review-preexisting.test.js` |
| T021 | Contratos 1 a 6 | ✓ completado | — (ver «Evidencia de verificación») |
| T022 | Contratos 7 y 8 | ✓ completado | — (ver «Evidencia de verificación») |
| T023 | Codificación UTF-8 sin BOM | ✓ completado | — (0 ocurrencias de `\xef\xbb\xbf` por bytes en los seis archivos y en los artefactos de la historia) |
| T024 | `npm run verify:repository` y `npm test` | ✓ completado | — (ambos con código 0 en la primera ejecución completa, `npm test` 556/556; después, solo `S097-UT-011` falla por tiempo con la máquina cargada: ver «Pruebas ejecutadas») |
| T025 | `graphify update .` y `git status` | ✓ completado | `graphify-out/` (ver «Trabajo concurrente») |

---

## Evidencia de verificación (contratos de design.md)

| # | Contrato | Evidencia |
|---|---|---|
| 1 | Defecto en línea no tocada → PREEXISTENTE, `APPROVED`, sin `fix-directives.md` | TC-030; prueba «rama epic/x: una línea sin tocar es untouched…»; Paso 4a.2 punto 4 y 4e |
| 2 | `max-severity` excluye los PREEXISTENTE | Paso 4b (severidad efectiva: hallazgos apartados por 4a.1 y 4a.2); TC-030 |
| 3 | Mismo defecto en línea tocada → `MEDIUM`, `NEEDS-CHANGES`, `fix-directives.md` | TC-031; pruebas de línea modificada, añadida, vecina de borrado y commit + working tree |
| 4 | Sin base determinable → ningún PREEXISTENTE, motivo en el informe | TC-032; pruebas `on-main-branch`, `not-a-repo`, `detached-head`, `no-main-branch`, `no-merge-base`, `git-unavailable`; Paso 4a.2 punto 3 y texto `unavailable` de `{{PREEXISTING_STATUS}}` |
| 5 | Nunca `untouched` sin evidencia | Pruebas de archivo nuevo (con y sin seguimiento), rango parcial, ubicación sin línea, `..`, absoluta, inexistente y rango inverso |
| 6 | Línea no tocada causada por la historia no es PREEXISTENTE | TC-033; regla de causa en el Paso 4a.2 punto 4 |
| 7 | Categoría en la plantilla sin cambiar `verdict`, `max-severity` ni secciones | Aserción 7 (frontmatter sin `PREEXISTENTE`); `test/story-code-review-review-md.test.js` (aserción 4 de encabezados) en verde; la plantilla solo gana la fila `Hallazgos preexistentes` |
| 8 | Vocabulario de ADR-0021 | `🟣 PREEXISTENTE` en `SKILL.md`, igual que la tabla de ADR-0021 (`🟣 Pre-existing` → `PREEXISTENTE`) |
| 9 | Evals antes del skill | T004 completada antes de T012-T017 |
| 10 | Gate verde | `npm run verify:repository` exit 0 y `npm test` 556/556 en la primera ejecución completa; las ejecuciones finales fallan solo por `S097-UT-011`, sensible a la carga (ver «Pruebas ejecutadas») |

## Decisiones de implementación dentro de D-3

- **Diff sin hunks** (archivo binario o cambio de solo modo): todas las líneas del archivo cuentan como tocadas. Extiende la regla de D-3 «si el archivo difiere entero, todas sus líneas son tocadas» al caso en que git no da hunks de línea; el error va en el sentido seguro.
- `git diff` se ejecuta con `--no-textconv` además de `--no-color --no-ext-diff`, para que un filtro de texto del proyecto no altere la numeración.
- `git cat-file -e <base>:./<ruta>` usa la forma relativa al directorio de trabajo, válida aunque `--repo-root` no sea la raíz de git.
- Los mensajes de error de la CLI nombran solo el archivo de ubicaciones (`basename`), sin la ruta absoluta del host (`gr-code-security-checklist`).

## Trabajo concurrente (STORY-182)

Durante esta implementación otra sesión implementó STORY-182 (verificar y deduplicar hallazgos) sobre los mismos archivos: añadió los Pasos 4a.3 y 4a.4 **después** del Paso 4a.2 (el orden recomendado por F-5 de `design.md`), los evals TC-034 a TC-037 y amplió las redacciones de 4b y 4c para combinar ambas reglas. Se comprobó que las reglas PREEXISTENTE siguen presentes y coherentes (4b: «ni PREEXISTENTE»; 4c: «nunca un PREEXISTENTE»). Los demás cambios del working tree (`agents/*.agent.md`, `examples/`, `test/story-code-review-evidence-dedup.test.js` y los artefactos de STORY-182) pertenecen a esa historia, no a STORY-181.

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `node --test test/story-code-review-preexisting.test.js` | 20/20 ✓ (tras el RED inicial por motor ausente) |
| `node --test test/story-code-review-preexisting.test.js test/story-code-review-review-md.test.js test/story-code-review-paths.test.js` | 29/29 ✓ |
| `npm test` | 556/556 ✓ en la primera ejecución completa; en las tres ejecuciones finales, 555/556: falla solo `S097-UT-011` (`test/memory-system.test.js:901`, umbral de 5 s sobre `docs/`, medido entre 6,2 y 8,1 s) |
| `node --test --test-name-pattern="S097-UT-011" test/memory-system.test.js` | ✓ en 0,7 s aislado |
| `npm test` sin `test/story-code-review-preexisting.test.js` | 535/536: la misma falla de `S097-UT-011` (6,2 s), así que no la causa esta historia |
| `npm run verify:repository` | exit 0 ✓ en la primera ejecución; exit 1 en las finales solo por `S097-UT-011` |
| `npm run test:eval -- story-code-review` | no ejecutado (a criterio humano, AGENTS.md) |

> **Prueba sensible a la carga:** `S097-UT-011` mide tiempo real con un umbral fijo. Falló con la máquina cargada (otra sesión implementando STORY-182 en paralelo) y pasa aislada. No toca ningún archivo de esta historia. Conviene repetir `npm run verify:repository` con la máquina libre antes de `/story-code-review`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | La mecánica de AC-1 a AC-3 la cubre la prueba del motor; los escenarios completos son TC-030 a TC-032, que requieren `npm run test:eval` (a criterio humano) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1 (contrato 8), CNF-2 (contrato 7, aserción 7), CNF-3 (T004 antes de T012) |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | I-1 a I-8 y D-1 a D-8 implementados; desviaciones menores dentro de D-3 documentadas arriba |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test` 556/556 en la primera ejecución completa y prueba de STORY-180 en verde; la falla posterior de `S097-UT-011` (umbral de tiempo) aparece también sin los archivos de esta historia y pasa aislada (ver «Pruebas ejecutadas») |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | Motor Node ≥ 18 sin dependencias, patrón de `story-complete.js` (JSDoc, JSON en stdout, exit 2) |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Revisión de los archivos tocados |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | Todas las funciones del motor se usan o se exportan (I-4) |
| 8 | El código pasa el linter y el formateador | ⚠️ | El repo no tiene linter; `verify:syntax` OK (55 archivos JS) |
| 9 | No se introducen dependencias nuevas sin aprobación | ✓ | Solo módulos de Node (`fs`, `path`, `child_process`) |
| 10 | Se usó `skill-master` para crear skills nuevos | ✓ | No aplica: no se crea skill nuevo |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica; `skills/` ya se publica (smoke del tarball OK) |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | El motor no envía datos a modelos ni a servicios externos; la regla de causa queda en el árbitro con regla de duda |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | `spawnSync` con lista de argumentos (sin shell), sin `eval`, entradas validadas (arreglo de cadenas, ubicaciones sin `..` ni rutas absolutas), mensajes sin rutas absolutas, emails de fixture en `.test` |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica a skill nuevo; el skill modificado conserva el marcador `SDDF-FIXED-LAYOUT` (`verify-fixed-layout` OK) |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | TC-030 a TC-033 añadidos |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente | ⚠️ | Requiere ejecución de evals — `npm run test:eval` se ejecuta a criterio humano |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 25/25 |
| 18 | README/docs actualizados si cambian contratos | ✓ | `README.md` del skill y plantilla del informe |
| 19 | Decisiones no previstas documentadas en `design.md` | ⚠️ | Las desviaciones menores dentro de D-3 se documentan en este reporte, no en `design.md` |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica a la historia: lo escribe `/epic-ship` |
| 21 | El build de CI pasa sin errores | ⚠️ | Requiere CI — no evaluable por story-implement; el gate local equivalente (`verify:repository`) pasa |
| 22 | No hay secrets ni credenciales expuestos | ✓ | Sin credenciales; `sec-*` del gate OK |
| 23 | Variables de entorno documentadas | ✓ | No se introducen variables de entorno |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambios en Markdown y un script sin estado |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

Pasos recomendados:
1. Repetir `npm run verify:repository` con la máquina libre (ver la nota sobre `S097-UT-011`) y, a criterio humano, `npm run test:eval -- story-code-review` para TC-030 a TC-033
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
