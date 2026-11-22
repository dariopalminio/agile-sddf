---
type: implement-report
id: STORY-189
slug: STORY-189-implement-report
title: "Implement Report: El rework de los tres gates vuelve a IMPLEMENT/TODO"
story: STORY-189
created: 2026-11-14
updated: 2026-11-14
related:
  - STORY-189-el-rework-vuelve-a-implement-todo
---

<!-- Referencias -->
[[STORY-189-el-rework-vuelve-a-implement-todo]]

# Reporte de Implementación: El rework de los tres gates vuelve a IMPLEMENT/TODO

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-189 |
| Total de tareas | 19 |
| Tareas completadas | 19 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa

Qué cambia: `story-code-review`, `story-verify` y `story-acceptance` con `NEEDS-CHANGES` escriben `IMPLEMENT/TODO` (antes `READY-FOR-IMPLEMENT/DONE`). Los tres nombran a `/story-implement` como ejecutor, y a `/story-implement-tasks` como alternativa solo si existe `tasks.md`; verify y acceptance no lo hacían antes. `story-implement` y `story-implement-tasks` aceptan `IMPLEMENT/TODO`, lo pasan a `IMPLEMENT/IN-PROGRESS` con una regla por exclusión (`$ENTRADA_SUBSTATUS` nuevo) y siguen decidiendo el modo rework solo por `fix-directives.md`. En `story-implement-tasks`, `IMPLEMENT/TODO` sin tareas pendientes ni `fix-directives.md` ya no sale por el gate anticipado: llega al Paso 4 y deja la historia en `IMPLEMENT/DONE`. `READY-FOR-IMPLEMENT/DONE` se sigue aceptando sin aviso (STORY-191).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados / modificados |
|---|---|---|---|
| T001 | Estado de partida y línea base | ✓ completado | — (ADR-0022 `ACCEPTED`; STORY-188 ya implementada: gates con `PLAN/DONE`, `story-implement` evals 1.4.0 hasta TC-046, `story-implement-tasks` 1.1.0 hasta TC-008; últimos casos: code-review TC-046, verify TC-007, acceptance TC-015; `verify:repository` y `npm test` en verde antes del cambio, 584/584) |
| T002 | Evals de `story-implement` | ✓ completado | `skills/story-implement/evals/evals.json` (1.4.0 → 1.5.0; 17 casos de rework migrados a `IMPLEMENT/TODO`; TC-047 nuevo de legado) |
| T003 | Evals de `story-implement-tasks` | ✓ completado | `skills/story-implement-tasks/evals/evals.json` (1.1.0 → 1.2.0; TC-001, TC-005 y TC-006 migrados; TC-009 nuevo) |
| T004 | `story-implement` acepta `IMPLEMENT/TODO` | ✓ completado | `skills/story-implement/SKILL.md` (0c.2, 0c.4, bloque de inicio, resumen y posicionamiento) |
| T005 | `story-implement-tasks` acepta `IMPLEMENT/TODO` | ✓ completado | `skills/story-implement-tasks/SKILL.md` (1d, 2c, 2e, Paso 4, tablas de precondición y ciclo de vida, regla del gate, «Manejo de errores») |
| T006 | Evals de `story-code-review` | ✓ completado | `skills/story-code-review/evals/evals.json` (1.1.0 → 1.2.0; TC-016 renombrado) |
| T007 | Evals de `story-verify` | ✓ completado | `skills/story-verify/evals/evals.json` (1.1.0 → 1.2.0; TC-004 y TC-005 migrados; TC-008 nuevo) |
| T008 | Evals de `story-acceptance` | ✓ completado | `skills/story-acceptance/evals/evals.json` (1.1.0 → 1.2.0; TC-001, TC-002, TC-006 y TC-009 migrados; TC-016 nuevo) |
| T009 | `story-code-review` escribe `IMPLEMENT/TODO` | ✓ completado | `skills/story-code-review/SKILL.md` (objetivo, posicionamiento, ciclo de vida, 4g, Paso 6, Paso 7, tabla de errores, Salida) |
| T010 | `story-verify` escribe `IMPLEMENT/TODO` y nombra al ejecutor | ✓ completado | `skills/story-verify/SKILL.md` (posicionamiento, 7a con `$TASKS_EXISTS`, 7b, Salida) |
| T011 | `story-acceptance` escribe `IMPLEMENT/TODO` y nombra al ejecutor | ✓ completado | `skills/story-acceptance/SKILL.md` (posicionamiento, 8a con `$TASKS_EXISTS`, 8b, Salida, Caso 2) |
| T012 | README de verify y acceptance | ✓ completado | `skills/story-verify/README.md`, `skills/story-acceptance/README.md` |
| T013 | README de los ejecutores | ✓ completado | `skills/story-implement/README.md`, `skills/story-implement-tasks/README.md` |
| T014 | Ocurrencias de `READY-FOR-IMPLEMENT` y contrato de EPIC-28 | ✓ completado | — (ver sección siguiente) |
| T015 | Recorrido de F-1, F-2 y F-3 | ✓ completado | — (ver «Trazabilidad») |
| T016 | JSON válido e inventario de evals | ✓ completado | — |
| T017 | Archivos sin BOM ni U+FEFF | ✓ completado | — |
| T018 | Gate (`verify:repository`, `npm test`) | ✓ completado | — (ver «Pruebas ejecutadas») |
| T019 | Pendientes manuales anotados | ✓ completado | este reporte |

---

## Trazabilidad AC → skill → eval

| Escenario | Paso del skill que lo produce | Caso de eval que lo espera |
|---|---|---|
| AC-1: code-review deja `IMPLEMENT/TODO` + `fix-directives.md` y nombra al ejecutor | `story-code-review` 4f (sin cambios) + 4g | code-review TC-002, TC-009, TC-010 (sin `tasks.md`), TC-014 |
| AC-1: `/story-implement` acepta `IMPLEMENT/TODO`, modo rework, `IMPLEMENT/IN-PROGRESS` | `story-implement` 0c.2, 0c.3, 0c.4 | story-implement TC-010 (`IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS`) |
| AC-2 fila `/story-verify` | `story-verify` 7a y 7b | verify TC-004 (sin `tasks.md`), TC-008 (con alternativa) |
| AC-2 fila `/story-acceptance` | `story-acceptance` 8a y 8b | acceptance TC-002, TC-009, TC-016 (con alternativa) |
| AC-3 fila 1: con `fix-directives.md` aplica la ronda 1 | `story-implement-tasks` 1d, 2c, 2e, 2f | story-implement-tasks TC-001 |
| AC-3 fila 2: sin `fix-directives.md` no anuncia rework | `story-implement-tasks` 2c (excepción `IMPLEMENT/TODO`), 2e, Paso 4 | story-implement-tasks TC-009; story-implement TC-021 |
| CNF-2: `BLOCKED` y `PENDING` sin cambio | líneas sin tocar | code-review TC-017, TC-021; verify TC-005; acceptance TC-001, TC-006 |
| CNF-3: `READY-FOR-IMPLEMENT/DONE` sigue admitido | 0c.2 y 1d | story-implement TC-011, TC-022, TC-033, TC-047; story-implement-tasks TC-002 a TC-004 |

---

## Ocurrencias restantes de `READY-FOR-IMPLEMENT` (T014)

- `skills/story-code-review`, `skills/story-verify` y `skills/story-acceptance`: **0** en `SKILL.md`, README y `evals.json` (V-2).
- `skills/story-implement` y `skills/story-implement-tasks`: todas son la **entrada anterior admitida** (posicionamiento, gate, mensaje de rechazo, línea `Estado`, transición por exclusión, tablas y README) o **casos de eval de legado** (story-implement TC-011, TC-022, TC-033, TC-047, y las listas de admitidos de TC-012, TC-013 y TC-046; story-implement-tasks TC-002 a TC-004 y la lista de TC-008). Ninguna describe el destino del rework.
- `git diff` no toca el Paso 4f de `story-code-review` ni `skills/story-code-review/assets/fix-directives-template.md` (CNF-4), ni las líneas de `BLOCKED` y `PENDING` (CNF-2).

---

## Decisiones no previstas

Registradas en `design.md` › CR-002: versiones e ID nuevos calculados sobre STORY-188 ya implementada, el renombrado de TC-010 de `story-implement` (el nombre hablaba de la «cola»), la retirada de la cadena suelta `DONE` en TC-002 y TC-009 de `story-acceptance`, `artifacts_absent: ["tasks.md"]` en TC-004 de `story-verify` y la regla «Gate de tareas completadas» de `story-implement-tasks`. Ninguna cambia el comportamiento especificado.

Observación fuera de alcance: el cuerpo de `story.md` de esta historia está guardado con texto mal codificado («revisiÃ³n», «ðŸ“–») desde el commit 73dd556c. Solo se tocó su frontmatter. Conviene corregirlo aparte.

---

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `npm run verify:repository` (línea base) | ✅ salida 0 |
| `npm test` (línea base) | ✅ salida 0 — 584 pruebas, 0 fallos |
| `node -e "JSON.parse(...)"` sobre los 5 `evals.json` | ✅ válidos; 46 / 8 / 16 / 47 / 9 casos (code-review / verify / acceptance / implement / implement-tasks), sin ID duplicados |
| `npm run verify:eval-inventory` | ✅ `Inventario de evals válido: 43 skills` |
| Búsqueda de bytes `EF BB BF` y de U+FEFF en los 16 archivos tocados (grep y node) | ✅ 0 en todos |
| `npm run verify:repository` (tras el cambio) | ✅ salida 0 — `Verificación determinista del repositorio aprobada` |
| `npm test` (tras el cambio, 1.ª ejecución) | ❌ 583/584 — un fallo intermitente que no se pudo identificar: la salida no se guardó y no se repitió |
| `npm test` (tras el cambio, 2.ª ejecución) | ✅ salida 0 — 584 pruebas, 0 fallos |

El cambio solo toca Markdown y JSON que ninguna prueba de `test/` lee por su contenido de estado (T001: ningún archivo de `test/` ni de `scripts/` nombra `READY-FOR-IMPLEMENT`). Por eso el fallo de la 1.ª ejecución se toma como intermitente. En STORY-188 ocurrió lo mismo con el límite de tiempo de `memory-system check`.

### Pendiente de ejecución manual

Según AGENTS.md, los evals se ejecutan a mano a criterio humano (CNF-1):

```bash
npm run test:eval -- story-code-review
npm run test:eval -- story-verify
npm run test:eval -- story-acceptance
npm run test:eval -- story-implement
npm run test:eval -- story-implement-tasks
```

**Orden de commits (V-11, nota de orden interno):** los ejecutores deben aceptar `IMPLEMENT/TODO` antes de que los gates lo escriban. Si se versiona en varios commits: primero evals y `SKILL.md` de los ejecutores (T002–T005), después evals y `SKILL.md` de los gates (T006–T011), y al final los README (T012–T013). En un solo commit el orden no importa. La implementación siguió ese orden.

Opcional: `npx agile-sddf install` para reinstalar los destinos de runtime (`.claude/skills/`, no versionados). Hasta entonces, la sesión de dogfooding sigue ejecutando la versión anterior: los gates instalados escriben `READY-FOR-IMPLEMENT/DONE`, que los ejecutores siguen aceptando.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (evals manuales). Cada escenario tiene paso del skill y caso de eval (ver Trazabilidad) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: evals antes que `SKILL.md` en cada skill y ejecutores antes que gates; CNF-2: líneas de `BLOCKED`/`PENDING` sin tocar; CNF-3: `READY-FOR-IMPLEMENT/DONE` conservado; CNF-4: 4f y plantilla sin diff; CNF-5: gate verde |
| 3 | El comportamiento coincide con `design.md` | ✓ | Interfaces aplicadas: escritura de los gates, bloque de ejecutor, líneas de estado, precondición, `$ENTRADA_SUBSTATUS`, transición por exclusión, gate anticipado (T015); desvíos menores en CR-002 |
| 4 | Sin regresiones | ✓ | `verify:repository` en verde y `npm test` 584/584 (2.ª ejecución); casos de legado conservados |
| 5 | Convenciones de `constitution.md` | ✓ | Markdown y JSON en español, sin código nuevo |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Ningún `TODO` añadido |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: sin código JS |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` con salida 0 |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crean skills |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Sin superficie nueva de prompts ni herramientas; solo cambian estados, mensajes y casos de eval |
| 13 | Se cumple gr-code-security-checklist | ✓ | Sin código ejecutable modificado |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | `SKILL.md`, README y evals de los cinco skills actualizados juntos; `verify:repository` valida su forma |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los cinco skills tienen evals, con casos nuevos para `IMPLEMENT/TODO` |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests — `npm run test:eval` lo ejecuta una persona (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 19/19 |
| 18 | README o docs relevantes actualizados | ✓ | T012–T013 (C-11); `skills/story-code-review/README.md` no nombraba el estado |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-002 |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica a nivel de historia: el bloque de la épica lo escribe `epic-ship` |
| 21 | Build de CI sin errores | ✓ | `verify:repository` es el mismo gate que `quality.yml`; salida 0 |
| 22 | Sin secrets ni credenciales | ✓ | Ningún secreto en los archivos tocados |
| 23 | Variables de entorno documentadas | ✓ | No aplica: ninguna nueva |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios solo en Markdown y JSON versionados; reversibles con git |

**Resumen:** 22/24 criterios ✓ (2 ⚠️ por ejecución manual de evals, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto (`npm run test:eval -- <skill>` para los cinco skills)
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
