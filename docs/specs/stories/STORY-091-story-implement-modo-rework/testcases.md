---
type: testcases
id: STORY-091
slug: STORY-091-story-implement-modo-rework-testcases
title: "Test Cases: story-implement toma de la cola una historia rechazada y corrige en modo rework"
story: STORY-091
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-091-story-implement-modo-rework
---

<!-- Referencias -->
[[STORY-091-story-implement-modo-rework]]

# Casos de Prueba: story-implement toma de la cola una historia rechazada y corrige en modo rework

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 8 |
| API  | 0 |
| E2E  | 4 |
| EV   | 14 |

> Sujeto bajo prueba: (a) el skill `story-implement` como sujeto de validación (EV, ejecutables con `/skill-test-evals story-implement` sobre `skills/story-implement/evals/evals.json`; el "código de producción" es `SKILL.md` — sin funciones ni UI, por eso UT/CT/API = 0); (b) la coherencia entre `SKILL.md`, README, contratos de `fix-directives.md` (STORY-089) y los skills vecinos (IT, verificables por lectura/`grep`/`diff`); (c) los escenarios Gherkin de `story.md` y el ciclo de la épica sobre el fixture real STORY-090 (E2E). Refs: `AC-n` = `story.md` (numeración de `design.md` › Context), `D-n` = decisiones de `design.md`, `V-n` = contratos de verificación de `design.md`, `CR-n` = registro de cambios de `design.md`, `T-x.y` = `tasks.md`.

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | story-implement toma la historia de la cola en modo rework | `story.md` de STORY-NNN en `READY-FOR-IMPLEMENT/DONE`; `fix-directives.md` con `round: N` en el directorio; sin `tasks.md` | Se ejecuta `/story-implement STORY-NNN` | `story.md` pasa a `IMPLEMENT/IN-PROGRESS` antes de la Fase RED; se muestra `🔁 Modo rework (ronda N)` antes de RED; RED, GREEN y REFACTOR reciben `fix_directives_path` y `whitelist` no nulos; `implement-report.md` contiene `## Ciclo de corrección — ronda N`; `story.md` termina en `IMPLEMENT/DONE`; el resumen final contiene `→ Ejecuta /story-code-review STORY-NNN` | AC-1, V-1 |
| E2E-002 | End-to-End | Ejecución inicial sin fix-directives.md | `story.md` en `READY-FOR-IMPLEMENT/DONE`; sin `fix-directives.md` | Se ejecuta `/story-implement STORY-NNN` | El ciclo RED → GREEN → REFACTOR se ejecuta como hoy (mismas invocaciones, mismos artefactos `.tmp/`); no aparece `Modo rework`; `implement-report.md` no contiene `Ciclo de corrección`; `rework_round: null` en `red-phase-status.json` y `cycle-status.json` | AC-2, V-2 |
| E2E-003 | End-to-End | Estado no admitido | `story.md` en `CODE-REVIEW/DONE` | Se ejecuta `/story-implement STORY-NNN` | El skill se detiene mostrando `Estado actual: status: CODE-REVIEW / substatus: DONE` y los admitidos `READY-FOR-IMPLEMENT/DONE` e `IMPLEMENT/IN-PROGRESS`; `git status` no muestra cambios en `story.md`, ni archivos nuevos en `.tmp/story-implement/STORY-NNN/` ni en el código | AC-3, V-3 |
| E2E-004 | End-to-End | Ciclo completo sin edición manual del frontmatter (Escenario 3 de EPIC-19, fixture STORY-090) | STORY-090 en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` (sin `round`), STORY-089 entregada | Se ejecuta `/story-implement STORY-090` y después `/story-code-review STORY-090` | Tras el primero: `🔁 Modo rework (ronda 1)`, `IMPLEMENT/DONE`, `fix-directives.md` sin cambios (`git diff` vacío); tras el segundo: `approved` (archivo eliminado, `CODE-REVIEW/DONE`) o `needs-changes` (`round` incrementado, `READY-FOR-IMPLEMENT/DONE`); en ningún punto se editó `story.md` a mano | AC-5, AC-6, NFR-3, V-5, V-10, T-5.4, T-5.5 |
| EV-001 | Eval | Rework desde la cola: gate, anuncio, bundles, reporte y sugerencia | Caso `rework-desde-cola-con-fix-directives-anuncia-ronda-y-reporta`: `READY-FOR-IMPLEMENT/DONE`, artefactos `story.md`, `design.md`, `testcases.md`, `fix-directives.md` (`round: 2`), sin `tasks.md`; generators `eval` y `monolithic` en `status: ok` | Se ejecuta el skill | Output contiene `IMPLEMENT/IN-PROGRESS`, `🔁 Modo rework (ronda 2)`, `rework_round: 2`, `fix_directives_path`, `whitelist`, `Ciclo de corrección — ronda 2`, `IMPLEMENT/DONE`, `Ejecuta /story-code-review`; no contiene `no está en un estado válido` | AC-1, D-1, D-2, D-3, D-5, D-6, V-1, T-1.1 |
| EV-002 | Eval | Ejecución inicial: sin anuncio, sin sección, campos null | Caso `ejecucion-inicial-sin-fix-directives-sin-anuncio-rework`: `READY-FOR-IMPLEMENT/DONE` sin `fix-directives.md` | Se ejecuta el skill | Output contiene `IMPLEMENT/IN-PROGRESS`, `rework_round: null`, `IMPLEMENT/DONE`, `Ejecuta /story-code-review`; no contiene `Modo rework`, `Ciclo de corrección`, `Instrucción de rework` | AC-2, D-3, D-5, V-2, T-1.2 |
| EV-003 | Eval | Estado no admitido detiene sin modificar (fail-fast) | Caso `estado-no-admitido-detiene-sin-modificar`: `CODE-REVIEW/DONE` | Se ejecuta el skill | Output contiene `no está en un estado válido para implementar`, `CODE-REVIEW / substatus: DONE`, `READY-FOR-IMPLEMENT/DONE`, `IMPLEMENT/IN-PROGRESS`, `/story-plan`; no contiene `invocando`, `red-phase-status.json`, `Modo rework`; `story.md` sin cambios | AC-3, D-1, V-3, T-1.3 |
| EV-004 | Eval | Frontmatter sin `status`/`substatus` se trata como `SPECIFY/TODO` | `story.md` sin los campos `status`/`substatus` | Se ejecuta el skill | Mismo error de gate que EV-003 con `Estado actual: status: SPECIFY / substatus: TODO`; sin escrituras | AC-3, AC-4, D-1 |
| EV-005 | Eval | Reanudación desde IMPLEMENT/IN-PROGRESS con fix-directives.md ⇒ rework | Caso `reanudacion-in-progress-modo-por-presencia-de-fix-directives` variante (a): `IMPLEMENT/IN-PROGRESS` + `fix-directives.md` | Se ejecuta el skill | Gate OK con `Estado: IMPLEMENT/IN-PROGRESS ✓`; output contiene `Modo rework`; en 0c solo cambia `updated` en `story.md` | AC-4, D-1, D-8, V-4, T-1.4 |
| EV-006 | Eval | Reanudación desde IMPLEMENT/IN-PROGRESS sin fix-directives.md ⇒ normal | Misma variante (b): `IMPLEMENT/IN-PROGRESS` sin archivo | Se ejecuta el skill | Gate OK; output no contiene `Modo rework`; ciclo completo (no se salta RED aunque exista `red-phase-status.json` previo) | AC-4, D-8, V-4, T-1.4 |
| EV-007 | Eval | `fix-directives.md` sin `round` ⇒ ronda 1, sin escribir el archivo | Caso `fix-directives-sin-round-usa-ronda-1`: `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` legado (frontmatter sin `round`, lista blanca con sublista "Destino de las acciones requeridas" y una entrada "solo lectura") | Se ejecuta el skill | Output contiene `🔁 Modo rework (ronda 1)` y `archivo(s) en lista blanca`; `fix-directives.md` no se modifica (escritor único `story-code-review`) | NFR-3, AC-6, D-2, V-5, T-1.5 |
| EV-008 | Eval | `round` ilegible ⇒ ronda 1 | `fix-directives.md` con `round: abc` | Se ejecuta el skill | `🔁 Modo rework (ronda 1)`; sin error ni escritura | D-2 |
| EV-009 | Eval | Lista blanca con texto libre se parsea sin fallar | `fix-directives.md` cuya sección de lista blanca tiene 10 viñetas con rutas entre acentos graves seguidas de `— hallazgo #N`, una con `**solo lectura**` y una sublista introducida por un párrafo | Se ejecuta 0c.3 | `$WHITELIST` tiene 10 entradas `{path, note}`; la entrada "solo lectura" conserva la nota; el anuncio dice `10 archivo(s) en lista blanca`; ningún `[WARN]` | D-2, T-2.2 |
| EV-010 | Eval | Sin sección de lista blanca ⇒ `[WARN]` y lista vacía, sin detener | `fix-directives.md` sin `## Lista blanca de archivos permitidos para modificar` | Se ejecuta 0c.3 | Output contiene `[WARN] fix-directives.md sin lista blanca — los generators recibirán whitelist vacía`; `whitelist: []` en los bundles; el ciclo continúa | D-2, T-2.2, T-4.3 |
| EV-011 | Eval | Re-ejecución con correcciones ya aplicadas no cambia código ni `story.md` | Caso `reejecucion-con-correcciones-aplicadas-no-cambia-story`: rework donde GREEN/REFACTOR devuelven `files_generated: []`, `files_modified: []` | Se ejecuta el skill | Output contiene `IMPLEMENT/DONE`; la sección de rework marca los hallazgos `⚠️ sin evidencia`; `story.md` idéntico salvo `updated` | NFR-2, D-5, D-8, V-6, T-1.6 |
| EV-012 | Eval | `verify-report.md` fallido sin `fix-directives.md` no activa rework | `READY-FOR-IMPLEMENT/DONE` con `verify-report.md` que reporta criterios fallidos y `acceptance-report.md` con `REJECTED`, sin `fix-directives.md` | Se ejecuta el skill | Modo normal: no aparece `Modo rework`; 0c solo consultó `fix-directives.md` | AC-6, D-2, V-7 |
| EV-013 | Eval | Detención por configuración inválida tras 0c deja `IMPLEMENT/IN-PROGRESS` admisible | `READY-FOR-IMPLEMENT/DONE`; `sddf.config.yaml` con un test_generator `required: true` cuyo skill no existe | Se ejecuta el skill dos veces | Primera ejecución: 0c escribe `IMPLEMENT/IN-PROGRESS`, Paso 2 detiene con `❌ Skill … no encontrado`; segunda ejecución: el gate acepta `IMPLEMENT/IN-PROGRESS` (`Estado: IMPLEMENT/IN-PROGRESS ✓`) | AC-4, D-1, T-2.3, riesgo "detención posterior" |
| EV-014 | Eval | Evals previos siguen en verde y añaden la sugerencia de code review | Los 9 casos existentes de `evals.json` (RED, fail-fast, fallback, GREEN/REFACTOR, pausas, `--auto`) | Se ejecuta `/skill-test-evals story-implement` | Los 9 pasan; los que llegan a `IMPLEMENT/DONE` contienen `Ejecuta /story-code-review`; total 15/15 | D-6, D-7, V-11, T-1.7, T-5.2 |
| IT-001 | Integration | Gate 0c ↔ gate 1d de `story-implement-tasks` (espejo) | Ambos `SKILL.md` editados | Se comparan los estados admitidos, el tratamiento de campos ausentes y el formato del mensaje de error | Mismos dos estados admitidos; ausentes ⇒ `SPECIFY/TODO`; mensaje con estado actual, admitidos y `/story-plan`; ambos detienen sin escrituras | AC-3, AC-4, D-1, T-2.1 |
| IT-002 | Integration | Contrato de `fix-directives.md` (STORY-089) ↔ lectura en 0c.3 | `fix-directives-template.md` (con `round`, tabla "Instrucciones de corrección", sección de lista blanca) y 0c.3 | Se cruzan los nombres de sección y columnas que 0c.3 lee con los del template | `round` en frontmatter; `## Instrucciones de corrección` con columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`; `## Lista blanca de archivos permitidos para modificar`; 0c.3 no depende de ninguna otra sección | AC-1, D-2, T-2.2 |
| IT-003 | Integration | Bundles RED y GREEN/REFACTOR ↔ "Arquitectura de delegación" | Pasos 3/4, 9, 10 y la sección "Arquitectura de delegación" editados | Se comparan las claves del JSON, del bloque "Contexto de invocación" y de la sección de arquitectura | Las tres claves `rework_round`, `fix_directives_path`, `whitelist` aparecen en los cuatro lugares con los mismos nombres; el párrafo "Instrucción de rework" solo se emite si `$REWORK_MODE`; fuera de rework los valores son `null` (nunca ausentes) | AC-1, AC-2, D-3, T-2.4, T-3.1, T-3.3, T-4.3 |
| IT-004 | Integration | `red-phase-status.json` ↔ precondición del Paso 7 | Paso 6 escribe `rework_round`; Paso 7 lee el archivo | Se ejecuta GREEN tras RED en rework y en normal | Paso 7 sigue validando solo `red_confirmed`; el campo `rework_round` no rompe la precondición; `cycle-status.json` repite el mismo valor | AC-1, D-4, D-5, T-3.2, T-3.5 |
| IT-005 | Integration | `implement-report.md` ↔ Entrada opcional de `story-code-review` | Reporte con la sección `## Ciclo de corrección — ronda N` entre "## Ciclo TDD" y "## DoD IMPLEMENT" | `story-code-review` lee `implement-report.md` como evidencia de implementación | La sección es Markdown válido (tabla de 6 columnas), no altera las secciones existentes que el revisor consume (`## Resumen`, `## Ciclo TDD`, `## DoD IMPLEMENT`) y solo existe en rework | AC-1, AC-2, D-5, T-3.4 |
| IT-006 | Integration | Posicionamiento, README y tabla de errores ↔ comportamiento real | `SKILL.md` (Objetivo, Posicionamiento, Manejo de errores, Salida) y `README.md` editados | `grep -n "needs-changes" skills/story-implement/SKILL.md skills/story-implement/README.md`; lectura de la tabla de errores | Ninguna línea asocia `IMPLEMENT/IN-PROGRESS` a "viene de story-code-review needs-changes"; "Al iniciar: story.md → IMPLEMENT/IN-PROGRESS" ahora tiene un paso que lo ejecuta (0c.4); la tabla de errores tiene las filas de estado no admitido, historia no encontrada y lista blanca ausente | NFR-1, D-7, V-8, T-4.1, T-4.3, T-4.4, T-5.3 |
| IT-007 | Integration | `tasks.md` sigue fuera del pipeline; `verify`/`acceptance` fuera del alcance | `SKILL.md` editado | `grep -n "tasks.md" skills/story-implement/SKILL.md`; `grep -n "verify-report\|acceptance-report" skills/story-implement/SKILL.md` | Solo las notas "no guía el pipeline" para `tasks.md`; `verify-report`/`acceptance-report` aparecen únicamente en "Qué NO hace" | NFR-4, AC-6, V-9, T-5.3 |
| IT-008 | Integration | Copia instalada ↔ fuente | `skills/story-implement/` editado y `scripts/install.js` ejecutado | `diff -r skills/story-implement .claude/skills/story-implement` | Sin diferencias; `/skill-test-evals` ejecuta la versión editada | V-11, T-5.1 |

## Notas de cobertura

- `tasks.md` fue usado como fuente de enriquecimiento: cada caso EV/IT referencia la tarea `T-x.y` que lo hace pasar; el grupo 1 de `tasks.md` (evals) es el espejo ejecutable de EV-001…EV-003, EV-005…EV-007, EV-011 y EV-014.
- Los tres escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001…E2E-003). E2E-004 no proviene de un Gherkin propio sino del requerimiento "Ciclo completo sin edición manual" (AC-5) y del Flujo 5 de `design.md`; se ejecuta sobre el fixture real STORY-090 y depende de que STORY-089 esté entregada para observar `round`; si no lo está, la ronda anunciada es siempre 1 (riesgo 3 de `design.md`).
- AC-4 (precondición y reanudación) y AC-6 (alcance) no tienen Gherkin propio: se cubren con EV-004…EV-006, EV-012, EV-013 e IT-001, IT-007.
- EV-004, EV-008, EV-009, EV-010, EV-012 y EV-013 no tienen caso en `evals.json` en `tasks.md` (el grupo 1 crea los seis mínimos de D-7). Se especifican aquí para que la implementación los añada si el presupuesto lo permite; EV-013 documenta un comportamiento aceptado (riesgo "detención posterior") y conviene tenerlo en `evals.json` para que no se "corrija" por accidente.
- La interpretación de `fix_directives_path`/`whitelist` por los generators instalados (`skill-test-evals`, `skill-master`) no es verificable con evals de este repo (CR-002): E2E-004 la observa manualmente sobre STORY-090 y la sección de rework del reporte deja evidencia (`✓ aplicado` / `⚠️ sin evidencia`).
- Fuera de alcance (por `story.md` › Non-Goals): reglas de RED sin tests nuevos y archivos fuera de la lista blanca (STORY-092), cambios en `story-code-review` (STORY-089), señales de `story-verify`/`story-acceptance`.

## Test Cases Progress for STORY-091

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: story-implement toma la historia de la cola en modo rework
- [ ] E2E-002: Ejecución inicial sin fix-directives.md
- [ ] E2E-003: Estado no admitido
- [ ] E2E-004: Ciclo completo sin edición manual del frontmatter (Escenario 3 de EPIC-19, fixture STORY-090)
- [ ] EV-001: Rework desde la cola: gate, anuncio, bundles, reporte y sugerencia
- [ ] EV-002: Ejecución inicial: sin anuncio, sin sección, campos null
- [ ] EV-003: Estado no admitido detiene sin modificar (fail-fast)
- [ ] EV-004: Frontmatter sin `status`/`substatus` se trata como `SPECIFY/TODO`
- [ ] EV-005: Reanudación desde IMPLEMENT/IN-PROGRESS con fix-directives.md ⇒ rework
- [ ] EV-006: Reanudación desde IMPLEMENT/IN-PROGRESS sin fix-directives.md ⇒ normal
- [ ] EV-007: `fix-directives.md` sin `round` ⇒ ronda 1, sin escribir el archivo
- [ ] EV-008: `round` ilegible ⇒ ronda 1
- [ ] EV-009: Lista blanca con texto libre se parsea sin fallar
- [ ] EV-010: Sin sección de lista blanca ⇒ `[WARN]` y lista vacía, sin detener
- [ ] EV-011: Re-ejecución con correcciones ya aplicadas no cambia código ni `story.md`
- [ ] EV-012: `verify-report.md` fallido sin `fix-directives.md` no activa rework
- [ ] EV-013: Detención por configuración inválida tras 0c deja `IMPLEMENT/IN-PROGRESS` admisible
- [ ] EV-014: Evals previos siguen en verde y añaden la sugerencia de code review
- [ ] IT-001: Gate 0c ↔ gate 1d de `story-implement-tasks` (espejo)
- [ ] IT-002: Contrato de `fix-directives.md` (STORY-089) ↔ lectura en 0c.3
- [ ] IT-003: Bundles RED y GREEN/REFACTOR ↔ "Arquitectura de delegación"
- [ ] IT-004: `red-phase-status.json` ↔ precondición del Paso 7
- [ ] IT-005: `implement-report.md` ↔ Entrada opcional de `story-code-review`
- [ ] IT-006: Posicionamiento, README y tabla de errores ↔ comportamiento real
- [ ] IT-007: `tasks.md` sigue fuera del pipeline; `verify`/`acceptance` fuera del alcance
- [ ] IT-008: Copia instalada ↔ fuente
