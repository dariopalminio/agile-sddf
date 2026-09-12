---
type: analyze
id: STORY-092
slug: STORY-092-analyze-report
title: "Analyze: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro"
story: STORY-092
design: STORY-092
testcases: STORY-092
tasks: STORY-092
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-092-reglas-robustez-modo-rework
---

<!-- Referencias -->
[[STORY-092-reglas-robustez-modo-rework]]

# Reporte de Coherencia: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 6/6 criterios cubiertos (+ 3/3 NFR) |
| Cobertura de ACs en testcases.md | ✓ | 6/6 ACs con caso de prueba (27 casos: E2E 7 · EV 13 · IT 7) |
| Alineación tareas → diseño | ✓ | 30/30 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 5/5 componentes y 8/8 interfaces con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Objetivo alineado; historia no listada; Escenario 3 cita `NEEDS-CHANGES` (descartado por STORY-089/ADR-0008) |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR · 4 WARNING)

> DoD cargado desde `docs/policies/dod-story.md` (el skill busca `definition-of-done-story.md`; el archivo fue renombrado en el commit `fcc96ed` — ver INC-004). Sección `### Definition of Done para el estado PLAN`: 5 criterios.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | RED en rework con 0 archivos de prueba + hallazgo `requirements-coverage` ⇒ error antes de GREEN | ✓ | D1 (Paso 6b), D2, interfaces "Gate de evidencia en rework" y "`red-phase-status.json`" (`rework_evidence`), flujo F1, V-1, V-3 |
| AC-2 | Misma condición con `code-quality` / `integration-architecture` / `security` / `DoD-CODE-REVIEW` ⇒ advertencia y continúa | ✓ | D1, D2 (valores ≠ `requirements-coverage` ⇒ advertencia; desconocidos también), flujo F1, V-2 |
| AC-3 | Interactivo: archivo modificado fuera de la lista blanca ⇒ mostrar + confirmar; `n` detiene sin modificar `story.md` | ✓ | D3 (snapshot git ∪ autoinforme), D4 (solo modificados), D6 (patrón Pause-1, `🛑 …`, sin escrituras en `story.md`), interfaz "Consolidación de alcance", flujo F2, V-4, V-5 |
| AC-4 | `--auto`: permite y registra bajo "Archivos fuera de lista blanca" en `implement-report.md` | ✓ | D6 (rama `auto`), D7 (subsección con tabla `Fase/Archivo/Origen/Resolución`), interfaz "Subsección de `implement-report.md`", flujo F3, V-6, V-7 |
| AC-5 | La regla de RED lee solo la columna `Dimensión` | ✓ | D2 (`Lectura de dimensiones` por nombre de encabezado; alternativa "inferir de `Hallazgo`" rechazada), interfaz "`Lectura de dimensiones`", V-10 |
| AC-6 | Lista blanca derivada de la sección "Lista blanca…"; barrera, no bloqueo absoluto | ✓ | D4 (barrera = confirmar/registrar), D5 (`Rutas permitidas` sobre `$WHITELIST` de STORY-091, exclusión `solo lectura`, "Destino de las acciones requeridas" incluido), V-9 |
| NFR-1 | Determinismo (comparación de columna / comparación de rutas) | ✓ | D2, D3, D5 (normalización e igualdad exacta), Goals |
| NFR-2 | La subsección es la entrada de `story-code-review` en la ronda siguiente | ✓ (con reserva) | D7 (contrato de forma estable, escrita siempre en rework); consumo no implementado → CR-002 (INC-003) |
| NFR-3 | En `--auto` ninguna regla pide confirmación | ✓ | D6 (rama `auto` sin prompt; alternativa "timeout" rechazada), V-6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 | Verificar STORY-091 implementada y nombres alineados | CR-001, interfaz "Entradas provistas por STORY-091" | ✓ |
| 1.2 | Eval `rework-red-sin-tests-requirements-coverage-detiene` | D8, V-1 (D1, D2) | ✓ |
| 1.3 | Eval `rework-red-sin-tests-otras-dimensiones-advierte-y-continua` | D8, V-2 | ✓ |
| 1.4 | Eval `rework-red-con-test-modificado-cuenta-como-evidencia` | D8, V-3 | ✓ |
| 1.5 | Eval `rework-interactivo-fuera-de-lista-n-detiene` | D8, V-4 (D3, D4, D6) | ✓ |
| 1.6 | Eval `rework-interactivo-fuera-de-lista-s-continua-y-registra` | D8, V-5 (D6, D7) | ✓ |
| 1.7 | Eval `rework-auto-fuera-de-lista-registra-sin-confirmar` | D8, V-6 | ✓ |
| 1.8 | Eval `rework-sin-desvios-subseccion-ninguno` | D8, V-7 (D4, D7) | ✓ |
| 1.9 | Eval `sin-rework-reglas-inactivas` | D8, V-8 | ✓ |
| 1.10 | Eval `rework-lista-blanca-solo-lectura-excluida` | D8, V-9 (D5) | ✓ |
| 1.11 | `version`/`description` de `evals.json`, IDs sin colisión | D8, componente "Evals de `story-implement`" | ✓ |
| 2.1 | Procedimiento reutilizable "Consolidación de alcance" | Interfaz "Consolidación de alcance", D3, D4, D5, D6 | ✓ |
| 2.2 | Paso 4: snapshot, línea de salida esperada, `files_modified`, consolidación RED | D3 (puntos 1–4), interfaz "Contrato `results.json`" | ✓ |
| 2.3 | Paso 6: `files_modified` y `rework_evidence` iniciales | Interfaz "`red-phase-status.json`", D1 | ✓ |
| 2.4 | Nuevo Paso 6b — gate de evidencia | D1, D2, interfaz "Gate de evidencia en rework", flujo F1 | ✓ |
| 2.5 | Paso 7: precondición `rework_evidence: error` | Interfaz "`red-phase-status.json`" (Paso 7), D1 | ✓ |
| 3.1 | Paso 9: snapshot, línea de salida, consolidación GREEN | D3, D6, flujo F2 | ✓ |
| 3.2 | Paso 10: ídem REFACTOR | D3, D6, interfaz "Consolidación de alcance" (Pasos 4, 9, 10) | ✓ |
| 3.3 | 11b: subsección "Archivos fuera de lista blanca" | D7, interfaz "Subsección de `implement-report.md`", flujo F3 | ✓ |
| 3.4 | 11e: `out_of_scope_files` y línea de resumen | D7 (trazabilidad NFR-2) — extensión menor no explicitada en design.md, coherente con "Salida" del componente `SKILL.md` | ✓ |
| 4.1 | "Qué hace / Qué NO hace" | Componente `SKILL.md` ("Qué hace este skill"), D2, D6 | ✓ |
| 4.2 | Sección "Reglas" | Componente `SKILL.md` ("Reglas"), NFR-1, NFR-3 | ✓ |
| 4.3 | Manejo de errores, Arquitectura de delegación, Salida | Componente `SKILL.md` (tabla "Manejo de errores", "Arquitectura de delegación", "Salida"), interfaz "Contrato `results.json`" | ✓ |
| 4.4 | README de `story-implement` | Componente "README de `story-implement`" | ✓ |
| 4.5 | CHANGELOG | Componente "CHANGELOG" | ✓ |
| 5.1 | Refrescar copia instalada | Componente "Copia instalada de skills" | ✓ |
| 5.2 | Inspección `grep` | V-11 | ✓ |
| 5.3 | Fixture STORY-090: `Rutas permitidas` y `Lectura de dimensiones` | V-9, V-10 | ✓ |
| 5.4 | `/skill-test-evals story-implement` | V-12 | ✓ |
| 5.5 | Humo `--auto` sobre STORY-090 | Risks ("proyecto sin test_generators…"), NFR-3; contrato V implícito (no numerado) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `story-implement` — `SKILL.md` (Pasos 4, 6, 6b, 7, 9, 10, 11b, docs) | Componentes afectados | 2.1–2.5, 3.1–3.4, 4.1–4.3 | ✓ |
| Evals de `story-implement` | Componentes afectados | 1.2–1.11, 5.4 | ✓ |
| README de `story-implement` | Componentes afectados | 4.4 | ✓ |
| CHANGELOG | Componentes afectados | 4.5 | ✓ |
| Copia instalada de skills | Componentes afectados | 5.1 | ✓ |
| Entradas provistas por STORY-091 | Interfaces / contratos | 1.1 (verificación de nombres) | ✓ |
| `Lectura de dimensiones` | Interfaces / contratos | 2.4, 5.3 | ✓ |
| `Rutas permitidas` | Interfaces / contratos | 2.1 (c), 5.3 | ✓ |
| Gate de evidencia en rework (Paso 6b) | Interfaces / contratos | 2.4 | ✓ |
| Contrato `results.json` de subagentes (ampliado) | Interfaces / contratos | 2.2 (b, c), 3.1 (b), 3.2, 4.3 | ✓ |
| `Consolidación de alcance` | Interfaces / contratos | 2.1, 2.2 (d), 3.1 (c), 3.2 | ✓ |
| `red-phase-status.json` (ampliado) | Interfaces / contratos | 2.3, 2.4, 2.5 | ✓ |
| Subsección de `implement-report.md` | Interfaces / contratos | 3.3, 3.4 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `epic.md` › "Historias" (l. 21–27) lista STORY-086…STORY-090; STORY-091 y STORY-092 (split de STORY-089, commit `1949e87`) no aparecen. El bullet de STORY-089 aún enlaza al slug antiguo `STORY-089-story-fix-post-code-review` |
| Objetivo de la historia alineado con la épica | ✓ | "Para que la siguiente ronda de `/story-code-review` no apruebe una corrección sin evidencia ni pase por alto cambios que nadie pidió" refuerza el Escenario 3 ("un nuevo `/story-code-review` puede emitir `approved` sin ediciones manuales") y el principio 3 de la constitución (verificación) |
| Restricciones de la épica respetadas | ⚠️ | Escenario 3 (l. 42–45) y "Dependencias Críticas" (l. 96) exigen el estado `NEEDS-CHANGES`, descartado por STORY-089 (D8, ADR-0008) — la historia sigue el ADR, no la épica. La corrección de `epic.md` es NFR-3 de STORY-089 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** STORY-092 (y STORY-091) no figuran en la lista "Historias" de la épica padre; el bullet de STORY-089 usa un wikilink a un slug inexistente.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias" (l. 21–27)
- **Acción requerida:** añadir los bullets `- [ ] **STORY-091 — …** — [[STORY-091-story-implement-modo-rework]]` y `- [ ] **STORY-092 — …** — [[STORY-092-reglas-robustez-modo-rework]]` y corregir el wikilink de STORY-089. STORY-089 NFR-3 ya prevé tocar este archivo; conviene hacerlo en esa entrega.

### INC-002 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** el Escenario 3 de la épica describe el resultado como "la historia queda en `NEEDS-CHANGES`", mientras que la cadena 089 → 091 → 092 implementa el rework sin estado propio (señal = `fix-directives.md`, destino `READY-FOR-IMPLEMENT/DONE`, ADR-0008). El diseño de esta historia es coherente con el ADR, no con la épica.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — "Escenario 3" (l. 42–45), "Dependencias Críticas" (l. 96), "Riesgos" (l. 104)
- **Acción requerida:** ninguna en esta historia; la realineación del Escenario 3 está asignada a STORY-089 (NFR-3). Verificar que se cerró antes de entregar STORY-092.

### INC-003 [WARNING]

- **Tipo:** — (observación de alcance; no corresponde a A–F)
- **Descripción:** NFR-2 de `story.md` declara que la subsección "Archivos fuera de lista blanca" "es la entrada que `story-code-review` usa en la ronda siguiente", pero modificar `story-code-review` es Non-Goal explícito y ninguna de las tres historias del split implementa esa lectura. `design.md` lo registra como CR-002 y fija el contrato de forma (D7) para que un consumidor futuro no lo cambie; `testcases.md` IT-005 verifica solo la forma.
- **Archivo afectado:** `story.md` — "Criterios no funcionales" (NFR-2); `design.md` — "Registro de Cambios (CR)" › CR-002
- **Acción requerida:** decidir en refinamiento de EPIC-19: (a) crear una historia de seguimiento "`story-code-review` revisa los archivos fuera de lista blanca de la ronda anterior", o (b) reformular NFR-2 como "entrada disponible para la ronda siguiente". No bloquea la implementación.

### INC-004 [WARNING]

- **Tipo:** — (observación de proceso; no corresponde a A–F)
- **Descripción:** (a) Toda la implementación depende de que STORY-091 esté entregada (`READY-FOR-IMPLEMENT/DONE` hoy, sin código): los nombres consumidos (`$REWORK_MODE`, `$REWORK_FINDINGS`, `$WHITELIST = [{path, note}]`, `rework_round`, sección `## Ciclo de corrección — ronda N`) están alineados con `STORY-091/design.md` pero no existen aún en `skills/story-implement/SKILL.md`; `tasks.md` 1.1 y `testcases.md` IT-002 lo verifican antes de empezar (CR-001). (b) El skill `story-analyze` busca `$SPECS_BASE/policies/definition-of-done-story.md`, renombrado a `dod-story.md` en el commit `fcc96ed`; la validación DoD de este reporte se hizo sobre `dod-story.md`.
- **Archivo afectado:** `design.md` › CR-001; `skills/story-analyze/SKILL.md` (ruta del DoD) y `skills/story-design/SKILL.md` (misma ruta)
- **Acción requerida:** (a) no iniciar `story-implement-tasks STORY-092` hasta que STORY-091 esté en `IMPLEMENT/DONE` o posterior. (b) Fuera del alcance de esta historia: actualizar la ruta del DoD en los skills que la referencian (`story-analyze`, `story-design`) o dejar un alias; candidata a tarea `chore` en EPIC-19.

---

## Recomendaciones

1. **EPIC-19 › `epic.md` (INC-001, INC-002):** al entregar STORY-089 (NFR-3), añadir STORY-091 y STORY-092 a "Historias", corregir el wikilink de STORY-089 y reescribir el Escenario 3 sin `NEEDS-CHANGES` (señal `fix-directives.md`, destino `READY-FOR-IMPLEMENT/DONE`).
2. **`story.md` NFR-2 / backlog (INC-003):** decidir entre historia de seguimiento para `story-code-review` o reformular NFR-2; en cualquier caso mantener el contrato de D7 (`### Archivos fuera de lista blanca` con columnas `Fase | Archivo | Origen | Resolución` y lista `**Archivos nuevos:**`).
3. **Orden de implementación (INC-004a):** ejecutar `/story-implement-tasks STORY-089` → `STORY-091` → `STORY-092`; la tarea 1.1 de `tasks.md` es el gate de entrada y debe fallar si los nombres no coinciden.
4. **Ruta del DoD en skills (INC-004b):** abrir un `chore` para reemplazar `definition-of-done-story.md` por `dod-story.md` en `story-analyze` y `story-design` (o restaurar un alias), de modo que la validación DoD no dependa de la intervención del ejecutor.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | RED sin tests + `requirements-coverage` ⇒ error | ✓ | E2E-001, EV-001, EV-003, EV-006 |
| AC-2 | RED sin tests + otras dimensiones ⇒ advertencia y continúa | ✓ | E2E-002…E2E-005 (una por dimensión), EV-002, IT-007 |
| AC-3 | Interactivo: confirmación; `n` detiene sin tocar `story.md` | ✓ | E2E-006, EV-007, EV-008 |
| AC-4 | `--auto`: registra en "Archivos fuera de lista blanca" | ✓ | E2E-007, EV-009, EV-010, IT-007 |
| AC-5 | Solo la columna `Dimensión` | ✓ | EV-004, IT-004 |
| AC-6 | Lista blanca derivada de la sección; barrera, no bloqueo | ✓ | EV-012, IT-003 |
| NFR-1 | Determinismo | ✓ (implícito) | Todos los EV comparan literales; IT-003/IT-004 sobre fixture real |
| NFR-2 | Trazabilidad para la ronda siguiente | ✓ (forma) | EV-008, IT-005 — consumo no cubierto (INC-003) |
| NFR-3 | Sin confirmación en `--auto` | ✓ | E2E-007, EV-009, EV-013, IT-007 |

Casos adicionales derivados de ramas de degradación de `design.md` (no exigidos por `story.md`): EV-005 (tabla ilegible ⇒ error cerrado, D2), EV-006 (precondición GREEN, D1), EV-013 (sin git, D3). `tasks.md` 1.2–1.10 crea 9 casos en `evals.json`; EV-004, EV-005, EV-006 y EV-013 quedan como recomendados — si se quiere que `skill-test-evals` los ejecute, añadirlos en la tarea 1.11.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-092` — **no antes de que STORY-091 esté entregada** (INC-004a); en este repo el ciclo TDD usa `skill-test-evals` (RED) y `skill-master` (GREEN/REFACTOR, capa `monolithic`) según `sddf.config.yaml` |
| tasks.md | ✓ | `/story-implement-tasks STORY-092` — vía recomendada: la tarea 1.1 actúa como gate de dependencia y las tareas siguen el orden de los pasos de `SKILL.md` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | Dos Scenario Outline con tablas de ejemplos (5 dimensiones; 2 modos) más dos requerimientos explícitos (AC-5, AC-6) y 3 NFR |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación" de este reporte: 6/6 ACs y 3/3 NFR con decisión, interfaz y flujo |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 5 grupos: 1 Setup/evals (11) → 2–3 `SKILL.md` en orden de pasos (9) → 4 documentación (5, `[P]`) → 5 verificación (5); 30 tareas con descripción verificable |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | 18 anotaciones `// satisface:` (Goals, D1–D8, flujos F1–F3); columnas "AC que satisface" en Componentes e Interfaces; Contratos de verificación con "AC origen" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna que bloquee"; las dos dependencias externas están registradas como CR-001 y CR-002 con acción requerida |
