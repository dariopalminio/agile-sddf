---
type: implement-report
id: STORY-092
story: STORY-092
slug: STORY-092-reglas-robustez-modo-rework-implement-report
created: 2026-09-12
updated: 2026-09-12
parent: EPIC-19-framework-consistency
related:
  - STORY-092-reglas-robustez-modo-rework
  - STORY-091-story-implement-modo-rework
---

<!-- Referencias -->
[[STORY-092-reglas-robustez-modo-rework]]

# Implement Report: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí |
| Fase GREEN confirmada | sí (13/13 evals nuevos PASS) |
| Fase REFACTOR confirmada | sí (3/3 regresión PASS, 0 literales perdidos) |
| Archivos de prueba generados | 0 nuevos / 1 modificado (`skills/story-implement/evals/evals.json`: TC-023..TC-035, version 1.1.0 → 1.2.0) |
| Archivos de producción generados | 0 nuevos / 3 modificados (`skills/story-implement/SKILL.md`, `skills/story-implement/README.md`, `CHANGELOG.md`) |
| Modo de ejecución | interactive (sin `--auto`); modo rework: no (sin `fix-directives.md`) |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` → `skill-test-evals` añadió 13 casos (EV-001..EV-013 de `testcases.md` → TC-023..TC-035). `unit`/`e2e` omitidos (`skill: none`, omisión válida). Rojo confirmado: `npm run test:eval` no existe (exit 1) y ninguno de los literales esperados existía en `SKILL.md` (grep = 0). |
| GREEN | ✅ | Capa `monolithic` → `skill-master` editó `skills/story-implement/SKILL.md` (1031 → 1227 líneas): Procedimiento "Consolidación de alcance (solo rework)", Paso 6b "Gate de evidencia en rework", Pasos 4/6/7/9/10/11b/11e, 7 filas en "Manejo de errores", contrato `results.json`, "Salida". Evals ejecutados según protocolo E3 de `skill-test-evals` (un run simulado por TC, calificación por `contains`/`not_contains`/`output_contains`): **13/13 PASS**. |
| REFACTOR | ✅ | Pulido de "Qué hace / Qué NO hace", "Reglas", intro del Paso 6b y Paso 10 (solo prosa, 6 hunks); README.md (Modo rework + tabla de artefactos); CHANGELOG.md. No-regresión: 3 casos representativos re-ejecutados (TC-023, TC-029, TC-031) → 3/3 PASS; 0 literales de TC-001..TC-035 perdidos; `diff -rq skills/story-implement .claude/skills/story-implement` sin diferencias. |

### Ajustes a los evals durante GREEN (defectos del test, no del skill)

- TC-023, TC-027, TC-028, TC-029: `IMPLEMENT/DONE` en `not_contains` coincidía por subcadena con `READY-FOR-IMPLEMENT/DONE` del bloque de arranque (STORY-091) → sustituido por `Ciclo TDD completado`.
- TC-033: `rework_round: null` en `contains` es una línea del bloque de contexto al subagente (no se imprime en consola); el dato ya se verifica en `output_contains` como `"rework_round": null` → retirado de `contains`.

### Verificaciones IT con el fixture real STORY-090 (tarea 5.3)

| Caso | Resultado |
|---|---|
| IT-003 `Rutas permitidas` | 9 viñetas en la lista blanca de `STORY-090/fix-directives.md`; 1 anotada `**solo lectura**` (`docs/policies/dod-story.md`) excluida → **8 rutas permitidas** ✓ |
| IT-004 `Lectura de dimensiones` | `{code-quality, integration-architecture, DoD-CODE-REVIEW}`; `requirements-coverage` ausente ⇒ con 0 tests el gate resolvería `warning` ✓ |
| IT-001 | `grep` de `files_modified`, `rework_evidence`, `Archivos fuera de lista blanca`, `solo lectura`, `WHITELIST_PATHS`, `Consolidación de alcance` ≥ 1 cada uno; `Salida esperada en results.json` = 3 ✓ |
| IT-002 | Nombres de STORY-091 (`Paso 0c`, `$REWORK_MODE`, `$REWORK_FINDINGS`, `$WHITELIST`, `rework_round`, `Ciclo de corrección — ronda`) presentes y coincidentes con `design.md › Interfaces` ✓ (CR-001 sin divergencias) |
| IT-005 | Orden en el reporte simulado (TC-031): `## Ciclo TDD` → `## Ciclo de corrección — ronda 1` → `### Archivos fuera de lista blanca` → `## DoD IMPLEMENT` ✓ |
| IT-006 | Copia instalada sincronizada ✓ |
| IT-007 | Humo `--auto` sobre STORY-090 — **no ejecutado** (tarea 5.5 pendiente; requiere una ejecución real de `/story-implement STORY-090 --auto`) |

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | E2E-001..005 cubiertos por TC-023..TC-026 (dimensión `requirements-coverage` → error; `code-quality`/`integration-architecture`/`security`/`DoD-CODE-REVIEW`/desconocida → advertencia); E2E-006/007 por TC-029..TC-031. Todos PASS en ejecución simulada. |
| Criterios no funcionales verificados | ✓ | NFR-1 determinismo (IT-003/IT-004 aplicados mecánicamente sobre el fixture real); NFR-3 sin prompt en `--auto` (TC-031, TC-034, TC-035); NFR-2 contrato de la subsección fijado (D7) — su consumo por `story-code-review` queda como CR-002. |
| El comportamiento coincide con `design.md` | ✓ | D1–D8 implementadas; literales de Interfaces copiados tal cual. |
| No hay regresiones | ✓ | TC-001..TC-035: 0 literales perdidos; TC-033 (`sin-rework-reglas-inactivas`) PASS; regresión post-refactor 3/3. |
| Convenciones de `constitution.md` | ✓ | §6 (orquestador sin lógica de negocio: reglas declarativas en SKILL.md), §12 (fuente en `skills/`, copia instalada refrescada), principio 11 (evals primero). |
| Sin código comentado ni `TODO` | ✓ | `grep TODO` sin ocurrencias nuevas. |
| Sin variables/imports sin usar | ✓ | N/A (SKILL.md en Markdown); variables nuevas (`$OUT_OF_SCOPE_LOG`, `$NEW_FILES_LOG`, `$WHITELIST_PATHS`, `$RED_FILES_MODIFIED`) todas consumidas. |
| Linter/formateador | ⚠️ | No hay linter configurado para Markdown/JSON en el repo; `evals.json` validado con `JSON.parse`. |
| Sin dependencias nuevas | ✓ | Ninguna. |
| Se usó `skill-master` | ✓ | GREEN y REFACTOR delegados a `skill-master` (capa `monolithic`). |
| Skill nuevo en `files` de `package.json` | ✓ | N/A — no se crea skill nuevo. |
| Checklist de Seguridad de IA / Código / Creación de Skills | ⚠️ | No evaluados explícitamente en este ciclo; sin superficie nueva de entrada externa (el skill solo lee `fix-directives.md` y `git status`). Revisar en `story-code-review`. |
| Skills críticos con `evals/evals.json` | ✓ | `story-implement` pasa de 22 a 35 casos. |
| Casos ejecutados y evaluados automáticamente | ✓ | 13 runs (protocolo E3) + 3 de regresión; informe en este reporte. Ejecución completa de los 35 casos con `/skill-test-evals evals story-implement` pendiente (tarea 5.4). |
| `tasks.md` con todas las tareas `[x]` | ⚠️ | 28/30 marcadas. Pendientes: 5.4 (suite completa de 35 evals) y 5.5 (humo `--auto` sobre STORY-090). |
| README/docs actualizados | ✓ | `skills/story-implement/README.md` (Modo rework, tabla de artefactos con `results.json`, `rework_evidence`, `out_of_scope_files`). |
| Decisiones no previstas documentadas en `design.md` | ✓ | Ninguna decisión nueva; los dos ajustes de evals son correcciones de test (documentados arriba). |
| CHANGELOG actualizado | ✓ | Entrada bajo `[Unreleased] › Changed`. |
| Build de CI pasa | ⚠️ | No hay CI configurado para evals; `npm run test:eval` no existe en `package.json`. |
| Sin secrets expuestos | ✓ | Ninguno. |
| Variables de entorno documentadas | ✓ | Ninguna nueva. |
| Despliegue reversible | ✓ | Cambios en archivos versionados; `git checkout` revierte. |

> Los tests deben ejecutarse manualmente para confirmar el resultado final: `/skill-test-evals evals story-implement` (35 casos) y, opcionalmente, `/story-implement STORY-090 --auto` como humo del modo rework (revertir con `git checkout` si no se conserva).

## Registro de cambios (CR) heredados

- **CR-001** (dependencia STORY-091): verificada — nombres coincidentes, sin divergencias.
- **CR-002** (consumo de la subsección por `story-code-review`): sigue abierto; historia de seguimiento pendiente en EPIC-19.
