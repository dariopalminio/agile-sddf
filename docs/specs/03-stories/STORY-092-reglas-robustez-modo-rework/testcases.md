---
type: testcases
id: STORY-092
slug: STORY-092-reglas-robustez-modo-rework-testcases
title: "Test Cases: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro"
story: STORY-092
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-092-reglas-robustez-modo-rework
---

<!-- Referencias -->
[[STORY-092-reglas-robustez-modo-rework]]

# Casos de Prueba: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 7 |
| API  | 0 |
| E2E  | 7 |
| EV   | 13 |

> Sujeto bajo prueba: (a) el skill `story-implement` como sujeto de validación (EV, ejecutables con `/skill-test-evals story-implement` sobre `skills/story-implement/evals/evals.json`; el "código de producción" es `SKILL.md` — sin funciones ni UI, por eso UT/CT/API = 0); (b) la coherencia entre `SKILL.md`, README, el contrato `results.json`, el artefacto `fix-directives.md` (STORY-089) y el modo rework de STORY-091 (IT, verificables por lectura/`grep`/`diff` y con el fixture real STORY-090); (c) las filas de los dos Scenario Outline de `story.md` (E2E, una por fila de ejemplos). Refs: `AC-n` = `story.md` (numeración de `design.md` › Context), `D-n` = decisiones de `design.md`, `V-n` = contratos de verificación de `design.md`, `CR-n` = registro de cambios de `design.md`, `T-x.y` = `tasks.md`.

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | RED en rework sin tests nuevos — dimensión `requirements-coverage` | `/story-implement` en modo rework; `fix-directives.md` con un hallazgo bloqueante cuya `Dimensión` es `requirements-coverage` | La Fase RED termina con 0 archivos de prueba generados o modificados | El skill muestra `❌ Rework sin evidencia…` y se detiene antes de la Fase GREEN (sin `[GREEN/`, sin Pause-1); `red-phase-status.json` tiene `rework_evidence: "error"`; `story.md` sin escrituras adicionales | AC-1, V-1 |
| E2E-002 | End-to-End | RED en rework sin tests nuevos — dimensión `code-quality` | Rework; `fix-directives.md` con hallazgo bloqueante `code-quality` (sin `requirements-coverage`) | RED termina con 0 archivos de prueba | `⚠️ Rework sin tests nuevos… dimensiones presentes: code-quality — continuando con la Fase GREEN`; la Fase GREEN se ejecuta; `rework_evidence: "warning"` | AC-2, V-2 |
| E2E-003 | End-to-End | RED en rework sin tests nuevos — dimensión `integration-architecture` | Rework; hallazgo bloqueante `integration-architecture` | RED termina con 0 archivos de prueba | Advertencia y continúa con GREEN; `rework_evidence: "warning"` | AC-2, V-2 |
| E2E-004 | End-to-End | RED en rework sin tests nuevos — dimensión `security` | Rework; hallazgo bloqueante `security` | RED termina con 0 archivos de prueba | Advertencia y continúa con GREEN; `rework_evidence: "warning"` | AC-2, V-2 |
| E2E-005 | End-to-End | RED en rework sin tests nuevos — dimensión `DoD-CODE-REVIEW` | Rework; hallazgo bloqueante `DoD-CODE-REVIEW` | RED termina con 0 archivos de prueba | Advertencia y continúa con GREEN; `rework_evidence: "warning"` | AC-2, V-2 |
| E2E-006 | End-to-End | Corrección fuera de la lista blanca — modo interactivo | Rework con `$EXEC_MODE = interactive`; un generator reporta (o `git status` detecta) un archivo existente modificado que no está en la lista blanca de `fix-directives.md` | El skill consolida los resultados de la fase | Muestra `⚠️ Archivos modificados fuera de la lista blanca ({fase}):` con el archivo y su origen, y pregunta `¿Aceptar estos cambios fuera de la lista blanca? (s/n)`; con `n` emite `🛑 Ciclo TDD detenido en Fase {fase}: cambios fuera de la lista blanca rechazados por el usuario`, termina sin error y `story.md` no cambia (`git diff -- story.md` vacío respecto al arranque) | AC-3, V-4 |
| E2E-007 | End-to-End | Corrección fuera de la lista blanca — modo `--auto` | Rework con `--auto`; un generator modifica un archivo fuera de la lista blanca | El skill consolida los resultados de la fase | No aparece ningún `(s/n)`; se emite `[WARN] N archivo(s) fuera de la lista blanca en Fase {fase} — registrados en implement-report.md`; el ciclo continúa; `implement-report.md` contiene `### Archivos fuera de lista blanca` con la fila `| {fase} | {archivo} | {origen} | registrado (--auto) |` | AC-4, NFR-3, V-6 |
| EV-001 | Eval | Gate de evidencia: 0 tests + `requirements-coverage` ⇒ error (fail-fast) | Caso `rework-red-sin-tests-requirements-coverage-detiene`: rework, tabla con filas `requirements-coverage` y `code-quality`; test_generator `eval` en `status: ok` con `files_generated: []` y `files_modified: []` | Se ejecuta el skill | Output contiene `❌ Rework sin evidencia` y `requirements-coverage`; no contiene `[GREEN/` ni `¿Continuar con la Fase GREEN?`; `red-phase-status.json` contiene `"rework_evidence": "error"` | AC-1, D-1, D-2, V-1, T-1.2 |
| EV-002 | Eval | Gate de evidencia: 0 tests + otras dimensiones ⇒ advertencia y continúa (happy-path) | Caso `rework-red-sin-tests-otras-dimensiones-advierte-y-continua`: `input.dimensiones = [code-quality, integration-architecture, security, DoD-CODE-REVIEW]`; RED sin archivos | Se ejecuta el skill | Output contiene `⚠️ Rework sin tests nuevos` y `[GREEN/`; no contiene `❌ Rework sin evidencia`; `"rework_evidence": "warning"` | AC-2, D-1, D-2, V-2, T-1.3 |
| EV-003 | Eval | Un test existente modificado cuenta como evidencia | Caso `rework-red-con-test-modificado-cuenta-como-evidencia`: `requirements-coverage` en la tabla; RED con `files_generated: []` y `files_modified: ["skills/story-implement/evals/evals.json"]` | Se ejecuta el skill | Sin `❌ Rework sin evidencia` ni `⚠️ Rework sin tests nuevos`; `"rework_evidence": "ok"` | AC-1, D-1, V-3, T-1.4 |
| EV-004 | Eval | Dimensión desconocida se trata como advertencia, no como error | Rework; tabla con una única fila cuya `Dimensión` es un valor no listado (p. ej. `performance`); RED sin archivos | Se ejecuta el skill | `⚠️ Rework sin tests nuevos… dimensiones presentes: performance`; continúa con GREEN; `"rework_evidence": "warning"` | AC-5, D-2 |
| EV-005 | Eval | Tabla "Instrucciones de corrección" ilegible ⇒ error cerrado (fail-fast) | Rework; `fix-directives.md` sin el encabezado `## Instrucciones de corrección` o sin columna `Dimensión`; RED sin archivos | Se ejecuta el skill | Output contiene `❌ fix-directives.md sin tabla "Instrucciones de corrección" legible`; no contiene `[GREEN/`; `"rework_evidence": "error"` | D-2 |
| EV-006 | Eval | Precondición GREEN rechaza `rework_evidence: error` en reanudación | `red-phase-status.json` previo con `"rework_evidence": "error"` | Se intenta la Fase GREEN (Paso 7) | `❌ Precondición RED no cumplida: rework_evidence es error en red-phase-status.json`; no se invoca ningún code_generator | AC-1, D-1, T-2.5 |
| EV-007 | Eval | Interactivo: archivo fuera de lista + `n` ⇒ detiene sin tocar story.md (fail-fast) | Caso `rework-interactivo-fuera-de-lista-n-detiene`: `whitelist = [{path: skills/story-implement/SKILL.md}]`; GREEN `monolithic` con `files_modified: [skills/story-implement/SKILL.md, README.md]`; `user_input: "n"` | Se ejecuta el skill | Output contiene `Archivos modificados fuera de la lista blanca (GREEN)`, `README.md`, `¿Aceptar estos cambios fuera de la lista blanca? (s/n)`, `🛑 Ciclo TDD detenido en Fase GREEN`, `git checkout -- README.md`; no contiene `[REFACTOR/` ni lista `SKILL.md` como fuera de lista; `story.md` sin cambios | AC-3, D-3, D-4, D-6, V-4, T-1.5 |
| EV-008 | Eval | Interactivo: archivo fuera de lista + `s` ⇒ continúa y registra `confirmado (interactivo)` | Caso `rework-interactivo-fuera-de-lista-s-continua-y-registra`: mismo input con `user_input: "s"` | Se ejecuta el skill | Output contiene `[REFACTOR/` e `IMPLEMENT/DONE`; `implement-report.md` contiene `### Archivos fuera de lista blanca` y `| GREEN | README.md | skill-master/monolithic | confirmado (interactivo) |` | AC-3, NFR-2, D-6, D-7, V-5, T-1.6 |
| EV-009 | Eval | `--auto`: archivo fuera de lista ⇒ `[WARN]`, sin prompt, registrado en el reporte | Caso `rework-auto-fuera-de-lista-registra-sin-confirmar`: mismo input con `exec_mode: auto` | Se ejecuta el skill | Output contiene `[WARN] 1 archivo(s) fuera de la lista blanca en Fase GREEN — registrados en implement-report.md` e `IMPLEMENT/DONE`; no contiene `(s/n)`; reporte con `| GREEN | README.md | skill-master/monolithic | registrado (--auto) |` | AC-4, NFR-3, D-6, D-7, V-6, T-1.7 |
| EV-010 | Eval | Rework sin desvíos ⇒ subsección presente con `Ninguno` y archivos nuevos listados | Caso `rework-sin-desvios-subseccion-ninguno`: `files_modified` ⊆ whitelist en GREEN/REFACTOR; RED con `files_generated: [skills/story-implement/evals/evals.json]` | Se ejecuta el skill | `implement-report.md` contiene `### Archivos fuera de lista blanca`, `Ninguno`, `**Archivos nuevos:**` y `- skills/story-implement/evals/evals.json (RED, skill-test-evals)`; output sin `(s/n)` ni `[WARN]` | AC-4, D-4, D-7, V-7, T-1.8 |
| EV-011 | Eval | Fuera de rework las reglas están inactivas (no regresión) | Caso `sin-rework-reglas-inactivas`: sin `fix-directives.md`; RED con `files_generated: []` | Se ejecuta el skill | Output no contiene `⚠️ Rework`, `❌ Rework`, `Archivos fuera de lista blanca` ni `git status`; `"rework_evidence": "n/a"`; el resto del ciclo se comporta como los evals previos | D-1, V-8, T-1.9 |
| EV-012 | Eval | Entrada de lista blanca anotada `solo lectura` no autoriza modificaciones | Caso `rework-lista-blanca-solo-lectura-excluida`: `whitelist = [{path: docs/policies/dod-story.md, note: "hallazgos #3 · **solo lectura**"}, {path: scripts/x.js, note: "hallazgo #1"}]`; `--auto`; GREEN con `files_modified: [docs/policies/dod-story.md]` | Se ejecuta el skill | Output contiene `[WARN] 1 archivo(s) fuera de la lista blanca`; reporte con `| GREEN | docs/policies/dod-story.md |` | AC-6, D-5, V-9, T-1.10 |
| EV-013 | Eval | Sin repositorio git el alcance se evalúa solo con el autoinforme | Rework `--auto` en un directorio sin `.git` (o `git` no disponible); GREEN con `files_modified: [README.md]` fuera de lista | Se ejecuta el skill | Output contiene `[WARN] Sin control de versiones — el alcance se evalúa solo con el autoinforme de los generators` y `[WARN] 1 archivo(s) fuera de la lista blanca`; el ciclo no se detiene | D-3 |
| IT-001 | Integration | `SKILL.md` documenta ambas reglas y el contrato ampliado | `skills/story-implement/SKILL.md` tras implementar | `grep -n "files_modified\|rework_evidence\|Archivos fuera de lista blanca\|solo lectura\|WHITELIST_PATHS\|Consolidación de alcance"` y `grep -c "Salida esperada en results.json"` | ≥1 línea por término; el conteo de `Salida esperada en results.json` es 3 (Pasos 4, 9 y 10) | V-11, T-5.2 |
| IT-002 | Integration | Los nombres consumidos coinciden con los que implementa STORY-091 | STORY-091 en `IMPLEMENT/DONE` o posterior | `grep -n "Paso 0c\|REWORK_MODE\|REWORK_FINDINGS\|WHITELIST\|rework_round\|Ciclo de corrección — ronda" skills/story-implement/SKILL.md` | Cada término aparece; los nombres coinciden con `design.md` › Interfaces ("Entradas provistas por STORY-091"); si no, CR-001 registra la diferencia antes de implementar | CR-001, T-1.1 |
| IT-003 | Integration | `Rutas permitidas` sobre el fixture real STORY-090 | `$WHITELIST` producido por el Paso 0c.3 sobre `docs/specs/03-stories/STORY-090-*/fix-directives.md` | Se aplica `Rutas permitidas` (D5) | 8 rutas: los 2 `evals/*.evals.json` de la historia, `scripts/migrate-finvest-field.js` y las 5 de "Destino de las acciones requeridas"; `docs/policies/dod-story.md` excluida | AC-6, D-5, V-9, T-5.3 |
| IT-004 | Integration | `Lectura de dimensiones` sobre el fixture real STORY-090 | `$REWORK_FINDINGS` parseado del mismo `fix-directives.md` | Se aplica `Lectura de dimensiones` (D2) | Conjunto `{code-quality, integration-architecture, DoD-CODE-REVIEW}`; `requirements-coverage` ausente ⇒ con 0 tests el gate resolvería `warning` | AC-5, D-2, V-10, T-5.3 |
| IT-005 | Integration | La subsección se anida bajo la sección de STORY-091 en el orden esperado | `implement-report.md` generado en rework | Se inspecciona el orden de encabezados | `## Ciclo TDD` → `## Ciclo de corrección — ronda N` (tabla de hallazgos, lista blanca recibida) → `### Archivos fuera de lista blanca` → `## DoD IMPLEMENT`; fuera de rework ninguna de las dos secciones existe | NFR-2, D-7, T-3.3 |
| IT-006 | Integration | Copia instalada sincronizada con la fuente | `skills/story-implement/` editado | `node scripts/install.js` y `diff -r skills/story-implement .claude/skills/story-implement` | Sin diferencias | T-5.1 |
| IT-007 | Integration | Humo `--auto` sobre el fixture real STORY-090 | STORY-091 entregada; STORY-090 en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` | `/story-implement STORY-090 --auto` | Output con `🔁 Modo rework (ronda 1)`; `⚠️ Rework sin tests nuevos` o `rework_evidence: ok` según lo que genere `skill-test-evals`; sin `(s/n)`; `implement-report.md` con `### Archivos fuera de lista blanca`; la prueba se revierte con `git checkout` si no se conserva | AC-2, AC-4, NFR-3, T-5.5 |

## Notas de cobertura

- `tasks.md` fue usado como fuente de enriquecimiento: cada caso EV/IT referencia la tarea `T-x.y` que lo crea o verifica; las tareas 1.2–1.10 producen los 9 casos de `evals.json` (EV-001, EV-002, EV-003, EV-007…EV-012); EV-004, EV-005, EV-006 y EV-013 se derivan de las ramas de degradación de `design.md` (D-1, D-2, D-3) y quedan como casos adicionales recomendados para `evals.json` si se quiere cobertura completa del gate.
- Los dos Scenario Outline de `story.md` se expanden fila a fila: E2E-001..E2E-005 (5 dimensiones) y E2E-006..E2E-007 (2 modos). Los AC-5 y AC-6 (requerimientos, sin Gherkin) se cubren por IT-003, IT-004, EV-004 y EV-012; NFR-1 (determinismo) queda implícito en que todos los casos comparan literales de salida.
- Gap conocido: NFR-2 afirma que `story-code-review` consumirá la subsección en la ronda siguiente, pero ningún skill la lee todavía (CR-002). IT-005 verifica solo el contrato de forma (anidamiento y columnas), no su consumo.
- Precondición de toda la tabla: STORY-091 implementada (IT-002). Hasta entonces, los casos EV no son ejecutables sobre `skills/story-implement/SKILL.md`.
- No se generan casos PT/CON/ST: la historia no define carga, contratos entre sistemas ni store.

## Test Cases Progress for STORY-092

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: RED en rework sin tests nuevos — dimensión `requirements-coverage`
- [ ] E2E-002: RED en rework sin tests nuevos — dimensión `code-quality`
- [ ] E2E-003: RED en rework sin tests nuevos — dimensión `integration-architecture`
- [ ] E2E-004: RED en rework sin tests nuevos — dimensión `security`
- [ ] E2E-005: RED en rework sin tests nuevos — dimensión `DoD-CODE-REVIEW`
- [ ] E2E-006: Corrección fuera de la lista blanca — modo interactivo
- [ ] E2E-007: Corrección fuera de la lista blanca — modo `--auto`
- [x] EV-001: Gate de evidencia: 0 tests + `requirements-coverage` ⇒ error (fail-fast)
- [x] EV-002: Gate de evidencia: 0 tests + otras dimensiones ⇒ advertencia y continúa (happy-path)
- [x] EV-003: Un test existente modificado cuenta como evidencia
- [x] EV-004: Dimensión desconocida se trata como advertencia, no como error
- [x] EV-005: Tabla "Instrucciones de corrección" ilegible ⇒ error cerrado (fail-fast)
- [x] EV-006: Precondición GREEN rechaza `rework_evidence: error` en reanudación
- [x] EV-007: Interactivo: archivo fuera de lista + `n` ⇒ detiene sin tocar story.md (fail-fast)
- [x] EV-008: Interactivo: archivo fuera de lista + `s` ⇒ continúa y registra `confirmado (interactivo)`
- [x] EV-009: `--auto`: archivo fuera de lista ⇒ `[WARN]`, sin prompt, registrado en el reporte
- [x] EV-010: Rework sin desvíos ⇒ subsección presente con `Ninguno` y archivos nuevos listados
- [x] EV-011: Fuera de rework las reglas están inactivas (no regresión)
- [x] EV-012: Entrada de lista blanca anotada `solo lectura` no autoriza modificaciones
- [x] EV-013: Sin repositorio git el alcance se evalúa solo con el autoinforme
- [ ] IT-001: `SKILL.md` documenta ambas reglas y el contrato ampliado
- [ ] IT-002: Los nombres consumidos coinciden con los que implementa STORY-091
- [ ] IT-003: `Rutas permitidas` sobre el fixture real STORY-090
- [ ] IT-004: `Lectura de dimensiones` sobre el fixture real STORY-090
- [ ] IT-005: La subsección se anida bajo la sección de STORY-091 en el orden esperado
- [ ] IT-006: Copia instalada sincronizada con la fuente
- [ ] IT-007: Humo `--auto` sobre el fixture real STORY-090
