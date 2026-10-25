---
type: testcases
id: STORY-117
slug: STORY-117-verificar-cierre-epic-21-testcases
title: "Casos de prueba: Verificar cierre de EPIC-21"
story: STORY-117
created: 2026-10-12
updated: 2026-10-12
related:
  - STORY-117-verificar-cierre-epic-21
  - STORY-117-verificar-cierre-epic-21-design
---

<!-- Referencias -->
[[STORY-117-verificar-cierre-epic-21]] · [[STORY-117-verificar-cierre-epic-21-design]]

# Casos de prueba: Verificar cierre de EPIC-21

## Resumen de cobertura

| Tipo | Cantidad |
|---|---:|
| UT | 0 |
| CT | 0 |
| IT | 4 |
| API | 0 |
| E2E | 7 |
| EV | 0 |

## Condiciones de ejecución

- P-0 es una compuerta: si alguna STORY-104…STORY-116 no está en `ACCEPTANCE/DONE`, `DELIVER`, `COMPLETED` o `CANCELED` justificado, solo se registra P-0 `FAIL`; no se ejecutan V-01…V-17.
- V-01…V-12 se ejecutan en `REPO_ROOT@<SHA>` con `node skills/memory-system/scripts/memory-system.js`.
- V-13…V-17 se ejecutan en temporales nuevos creados con `mktemp -d`, usando exclusivamente el tarball de `npm pack`, el motor instalado en `.claude/skills/` y las fixtures de `node_modules/agile-sddf/`; nunca `REPO_ROOT/docs`.
- La evidencia final se registra en `verify-report.md`; la salida completa queda en `.tmp/story-verify/STORY-117/evidence/`.

## Guion fijo para V-16 y V-17

| Dato | Valor |
|---|---|
| Producto | `todo-cli`, una CLI Node.js de tareas |
| Visión | Permitir registrar y consultar tareas pendientes rápidamente desde terminal. |
| Stakeholder | Persona usuaria que gestiona tareas personales desde la línea de comandos. |
| FR-1 | Agregar una tarea. |
| FR-2 | Listar tareas. |
| NFR-1 | Responder en menos de 1 s con 1 000 tareas. |
| Épica e historia | Una épica y la historia «agregar tarea». |

Ante una pregunta de los skills, se responde con este dato o con la opción por defecto. V-16 ejecuta `/sddf-init --level full` → `/project-flow` → `/epic-from-project-plan` → `/story-specify <EPIC-ID>`; V-17 continúa sobre ese mismo temporal con `/story-plan <STORY-ID>` → `/story-implement <STORY-ID> --auto` → `index` → `check`.

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|---|---|---|---|---|---|---|
| E2E-001 | End-to-End | Criterios de salida del repositorio | P-0 aprobada y el SHA registrado | Se ejecutan V-01…V-12 en `REPO_ROOT` | Cada fila queda `PASS` con comando, exit y extracto; V-12 termina con exit 1 sin coincidencias de niveles numerados | AC-1, D-4…D-6, T007…T015 |
| E2E-002 | End-to-End | SMOKE-1 sobre instalación empaquetada | Temporal nuevo sin `docs/` y paquete instalado | Se ejecuta V-13 `scaffold --root docs` | Solo existen `specs/epics` y `specs/stories`; no hay carpetas `0[123]-*`; existen producto y requisitos semilla | AC-2, CNF-1, D-7, D-8, T016…T018 |
| E2E-003 | End-to-End | SMOKE-2 migra tres niveles sin perder artefactos | Temporal nuevo con la fixture instalada `specs-3-levels` e inventario previo | Se ejecuta V-14 `migrate --from specs-3-levels`, el seco y `check --json` | No quedan niveles heredados, las rutas de épicas e historias se conservan, no hay `[NO MIGRADO]`, `broken-wikilink` es 0 y el seco informa `cambios pendientes: 0` | AC-2, CNF-1, D-7, D-8, T019 |
| E2E-004 | End-to-End | SMOKE-3 conserva navegación tras migración e índice | Temporal nuevo con la fixture instalada y `parent`/`related` capturados | Se ejecutan V-15 `migrate`, `index` y `check --json` | `index.md` contiene todos los wikilinks de épicas e historias; no quedan enlaces rotos EPIC/STORY y el frontmatter solo cambia según el mapa admitido | AC-2, CNF-1, D-8, T020 |
| E2E-005 | End-to-End | Flujo Spec-First en estructura de dos niveles | Temporal nuevo con paquete instalado y el guion fijo | Se ejecuta V-16 | Existen producto, requisitos, una épica y una historia bajo las rutas de dos niveles; no se crea ningún `*0[123]-*` ni artefacto fuera de las rutas admitidas | AC-2, CNF-1, D-7, D-9, T021 |
| E2E-006 | End-to-End | Flujo Spec-Anchored conserva la historia indexada | V-16 terminó `PASS` en el temporal compartido | Se ejecuta V-17 | La historia queda después de `READY-FOR-IMPLEMENT`, aparece en `index.md` y `check` termina con exit 0 | AC-2, D-9, T022 |
| E2E-007 | End-to-End | Fallo queda atribuido y bloquea ACCEPTANCE | Una verificación requerida devuelve un resultado distinto del esperado | Se consolida `verify-report.md` y se aplica la transición | La fila queda `FAIL` con evidencia, responsable y área; existe un finding `CRITICAL`, las `PASS` no se repiten salvo cambio de área y la historia no pasa a ACCEPTANCE | AC-3, CNF-2, D-2, D-3, D-12, T024…T028 |
| IT-001 | Integration | Compuerta P-0 detiene verificaciones posteriores | Rama, árbol y estados de STORY-104…116 disponibles | P-0 falla por rama, árbol o estado no admitido | El reporte registra P-0 `FAIL`, atribuye las historias pendientes y no se ejecutan V-01…V-17 | AC-1, AC-3, D-4, T002…T004 |
| IT-002 | Integration | Aislamiento de paquete e instalación | Se creó un `$TGZ` con `npm pack` | Cada V-13…V-17 prepara su temporal | El motor se invoca desde `.claude/skills/memory-system/`, las fixtures desde `node_modules/` y el log registra temporal, `$TGZ` y SHA | AC-2, CNF-1, D-7, T016…T017 |
| IT-003 | Integration | Matriz estándar conserva evidencia decisiva | V-01…V-17 o sus estados permitidos ya fueron obtenidos | `/story-verify STORY-117 --mode manual` escribe el reporte | `Coverage Analysis` contiene P-0, V-01…V-17 y V-11c con estado, comando, exit, extracto, responsable, área y SHA; V-11 solo es `PASS` si V-16 y V-17 lo son | AC-1, AC-2, AC-3, CNF-2, D-3, D-10, T023…T024 |
| IT-004 | Integration | Reverificación selectiva | Hay una ejecución anterior y un diff desde su SHA | Se aplica T026 | Se repiten los `FAIL`/`NO EJECUTADA` y las `PASS` cuya área intersecta el diff; las demás quedan arrastradas con su SHA original | AC-3, D-12, T026, T028 |

## Notas de cobertura

- La historia no introduce un módulo, endpoint, UI ni un skill nuevo: UT, CT, API y EV no aplican. No se crea una suite o script versionado, conforme a D-1.
- Los siete E2E cubren uno a uno AC-1, los cinco ejemplos de AC-2 y AC-3. Los IT verifican la compuerta, el aislamiento reproducible, el formato de evidencia y la repetición selectiva.
- V-17 es `NO EJECUTADA (depende de V-16)` si V-16 no pasa; ese estado no cuenta como `PASS`.
- V-11c (Spec-as-Source) es `N/A`: no existe un flujo que regenere código desde una especificación; V-06 aporta la evidencia estructural disponible.

## Test Cases Progress for STORY-117

<!-- Generado para la fase RED. Actualizado durante VERIFY.
     [x] = pasó | [ ] = pendiente | [!] = falló | [-] = no ejecutada -->
- [ ] E2E-001: Criterios de salida del repositorio
- [ ] E2E-002: SMOKE-1 sobre instalación empaquetada
- [ ] E2E-003: SMOKE-2 migra tres niveles sin perder artefactos
- [ ] E2E-004: SMOKE-3 conserva navegación tras migración e índice
- [ ] E2E-005: Flujo Spec-First en estructura de dos niveles
- [ ] E2E-006: Flujo Spec-Anchored conserva la historia indexada
- [ ] E2E-007: Fallo queda atribuido y bloquea ACCEPTANCE
- [ ] IT-001: Compuerta P-0 detiene verificaciones posteriores
- [ ] IT-002: Aislamiento de paquete e instalación
- [ ] IT-003: Matriz estándar conserva evidencia decisiva
- [ ] IT-004: Reverificación selectiva
