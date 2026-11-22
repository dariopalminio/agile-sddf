---
type: analyze
id: STORY-091
slug: STORY-091-analyze-report
title: "Analyze: story-implement toma de la cola una historia rechazada y corrige en modo rework"
story: STORY-091
design: STORY-091
testcases: STORY-091
tasks: STORY-091
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-091-story-implement-modo-rework
---

<!-- Referencias -->
[[STORY-091-story-implement-modo-rework]]

# Reporte de Coherencia: story-implement toma de la cola una historia rechazada y corrige en modo rework

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 6/6 criterios cubiertos (+ 4/4 NFR) |
| Cobertura de ACs en testcases.md | ✓ | 6/6 ACs con caso de prueba (26 casos: E2E 4 · EV 14 · IT 8) |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 10/10 componentes y 10/10 interfaces con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Objetivo alineado (Escenario 3 y criterio de éxito 4), pero la historia **no está listada** en `epic.md` (hermana creada por el split de STORY-089 el 2026-09-11) |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR · 3 WARNING)

> Fuentes: `story.md` (3 escenarios Gherkin + 3 requerimientos + 4 NFR, numerados AC-1…AC-6 / NFR-1…NFR-4 en `design.md` › Context), `design.md` (D1–D8, 10 componentes, 10 interfaces, 11 contratos de verificación, CR-001/CR-002), `tasks.md` (5 grupos, 24 tareas, formato `N.M`), `testcases.md` (26 casos), `docs/policies/dod-story.md` (sección PLAN), `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Rework desde la cola: `IMPLEMENT/IN-PROGRESS` al arrancar, anuncio `🔁 Modo rework (ronda N)`, RED/GREEN/REFACTOR sobre hallazgos y lista blanca, sección "Ciclo de corrección — ronda N", `IMPLEMENT/DONE` + sugerencia `/story-code-review` | ✓ | D1, D2, D3, D4, D5, D6; componentes Paso 0c, Pasos 3/4, 6, 9/10, 11b/11e; interfaces "Gate de estado", "Lectura de fix-directives.md", "Bundle RED", "Bundle GREEN/REFACTOR", "implement-report.md", "Resumen final"; Flujo 1 |
| AC-2 | Ejecución inicial sin `fix-directives.md`: ciclo como hoy, sin anuncio ni sección | ✓ | D3 (campos `null`), D4, D5 (sección condicional), D7 (eval); Flujo 2 |
| AC-3 | Estado no admitido: detener con estado actual y admitidos, sin modificar archivos | ✓ | D1; interfaz "Gate de estado"; componente "Manejo de errores"; Flujo 3 |
| AC-4 | Precondición `READY-FOR-IMPLEMENT/DONE` ∨ `IMPLEMENT/IN-PROGRESS` (espejo 1d); modo por presencia del archivo | ✓ | D1, D2, D8; interfaz "Gate de estado"; Flujo 4 |
| AC-5 | Ciclo completo sin edición manual (Escenario 3 de EPIC-19) | ✓ | D6; interfaces "Resumen final", "Coexistencia con story-implement-tasks"; Flujo 5 |
| AC-6 | Solo `fix-directives.md` como señal | ✓ | D2 (alternativa rechazada explícita); interfaz "Señal de rework"; componente Objetivo › "Qué NO hace" |
| NFR-1 | Coherencia documental (l. 49 del posicionamiento) | ✓ | D7; componentes Posicionamiento y README |
| NFR-2 | Idempotencia de la re-ejecución | ✓ | D5, D8; contrato V-6 |
| NFR-3 | Compatibilidad con STORY-090 (sin `round`) | ✓ | D2 (`round` ausente ⇒ 1, sin escribir); contrato V-5 |
| NFR-4 | `tasks.md` no guía el pipeline | ✓ | D4; contrato V-9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 | Eval `rework-desde-cola…` | D1, D2, D3, D5, D6, V-1 | ✓ |
| 1.2 | Eval `ejecucion-inicial-sin-fix-directives…` | D3, D5, V-2 | ✓ |
| 1.3 | Eval `estado-no-admitido…` | D1, V-3 | ✓ |
| 1.4 | Eval `reanudacion-in-progress…` | D1, D8, V-4 | ✓ |
| 1.5 | Eval `fix-directives-sin-round…` | D2, V-5 | ✓ |
| 1.6 | Eval `reejecucion-con-correcciones-aplicadas…` | D5, D8, V-6 | ✓ |
| 1.7 | Evals previos + sugerencia de code review | D6, D7 | ✓ |
| 2.1 | Paso 0c.1–0c.2 (directorio + gate) | D1; interfaz "Gate de estado" | ✓ |
| 2.2 | Paso 0c.3 (detección, `round`, hallazgos, lista blanca) | D2; interfaz "Lectura de fix-directives.md" | ✓ |
| 2.3 | Paso 0c.4 (escritura `IMPLEMENT/IN-PROGRESS`, bloque de inicio) | D1, CR-001 | ✓ |
| 2.4 | Paso 3 (bundle base + nota) | D3, D4; interfaz "Bundle RED" | ✓ |
| 3.1 | Paso 4 (contexto RED + "Instrucción de rework") | D3, D4; interfaz "Bundle RED" | ✓ |
| 3.2 | Pasos 5–6 (`rework_round` en `red-phase-status.json`) | D4; interfaz "red-phase-status.json / cycle-status.json" | ✓ |
| 3.3 | Pasos 9–10 (bundles GREEN/REFACTOR) | D3; interfaz "Bundle GREEN/REFACTOR" | ✓ |
| 3.4 | 11b (sección "Ciclo de corrección — ronda N") | D5; interfaz "implement-report.md" | ✓ |
| 3.5 | 11e (`rework_round`, línea 🔁, pie de sugerencia) | D5, D6; interfaz "Resumen final" | ✓ |
| 4.1 | Posicionamiento | D7, CR-001; componente Objetivo/Posicionamiento | ✓ |
| 4.2 | Objetivo (Qué hace / Qué NO hace) | D7; componente Objetivo | ✓ |
| 4.3 | Manejo de errores, Arquitectura de delegación, Salida | D7; componente "Manejo de errores…" | ✓ |
| 4.4 | README del skill | D7; componente README | ✓ |
| 5.1 | Refrescar `.claude/skills/` | Componente "Copia instalada" | ✓ |
| 5.2 | `/skill-test-evals story-implement` | V-1…V-6, V-11 | ✓ |
| 5.3 | Inspección estática `grep` | V-7, V-8, V-9 | ✓ |
| 5.4 | Fixture STORY-090 (`/story-implement`) | Flujo 5, V-5, V-10, CR-002 | ✓ |
| 5.5 | Fixture STORY-090 (`/story-code-review`) | Flujo 5, V-10, CR-002 | ✓ |
| 5.6 | DoD IMPLEMENT/CODE-REVIEW + checkbox en `epic.md` | DoD; interfaz "Coexistencia…" (11d) | ✓ |

Sin tareas de TIPO B.

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Objetivo, Qué NO hace, Posicionamiento | Componentes afectados (fila 1) | 4.1, 4.2 | ✓ |
| Paso 0c (gate, detección, arranque) | Componentes afectados (fila 2) | 2.1, 2.2, 2.3 | ✓ |
| Paso 3 y Paso 4 | Componentes afectados (fila 3) | 2.4, 3.1 | ✓ |
| Paso 6 (`red-phase-status.json`) | Componentes afectados (fila 4) | 3.2 | ✓ |
| Pasos 9 y 10 | Componentes afectados (fila 5) | 3.3 | ✓ |
| 11b, 11e | Componentes afectados (fila 6) | 3.4, 3.5 | ✓ |
| Manejo de errores, Arquitectura de delegación, Salida | Componentes afectados (fila 7) | 4.3 | ✓ |
| Evals de `story-implement` | Componentes afectados (fila 8) | 1.1–1.7, 5.2 | ✓ |
| README de `story-implement` | Componentes afectados (fila 9) | 4.4 | ✓ |
| Copia instalada de skills | Componentes afectados (fila 10) | 5.1 | ✓ |
| Interfaz "Gate de estado (Paso 0c)" | Interfaces / contratos | 2.1, 2.3, 1.3, 1.4 | ✓ |
| Interfaz "Señal de rework" | Interfaces / contratos | 2.2, 4.2 | ✓ |
| Interfaz "Lectura de fix-directives.md" | Interfaces / contratos | 2.2, 1.5 | ✓ |
| Interfaz "Bundle RED" | Interfaces / contratos | 2.4, 3.1 | ✓ |
| Interfaz "Bundle GREEN/REFACTOR" | Interfaces / contratos | 3.3 | ✓ |
| Interfaz "red-phase-status.json / cycle-status.json" | Interfaces / contratos | 3.2, 3.5 | ✓ |
| Interfaz "implement-report.md" | Interfaces / contratos | 3.4 | ✓ |
| Interfaz "Resumen final (11e)" | Interfaces / contratos | 3.5, 1.7 | ✓ |
| Interfaz "Contrato hacia STORY-092" | Interfaces / contratos | 2.2, 3.3 (variables y consolidación que STORY-092 consume) | ✓ |
| Interfaz "Coexistencia con story-implement-tasks" | Interfaces / contratos | 5.4, 5.5 (verificación); documentación en 4.1 | ✓ |

Sin elementos de TIPO C.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Rework desde la cola | ✓ | E2E-001, EV-001, EV-009, IT-002, IT-003, IT-005 |
| AC-2 | Ejecución inicial sin rework | ✓ | E2E-002, EV-002, IT-003, IT-005 |
| AC-3 | Estado no admitido | ✓ | E2E-003, EV-003, EV-004, IT-001 |
| AC-4 | Precondición y reanudación | ✓ | EV-004, EV-005, EV-006, EV-013, IT-001 |
| AC-5 | Ciclo completo sin edición manual | ✓ | E2E-004 |
| AC-6 | Solo `fix-directives.md` | ✓ | E2E-004, EV-007, EV-012, IT-007 |
| NFR-1 | Coherencia documental | ✓ | IT-006 |
| NFR-2 | Idempotencia | ✓ | EV-011 |
| NFR-3 | Compatibilidad STORY-090 | ✓ | E2E-004, EV-007 |
| NFR-4 | `tasks.md` fuera del pipeline | ✓ | IT-007 |

Los tres escenarios Gherkin tienen E2E 1-a-1 (E2E-001…E2E-003); E2E-004 deriva del requerimiento AC-5 y del Flujo 5 de `design.md` sobre el fixture STORY-090, declarado en Notas de cobertura.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-091` |
| tasks.md | ✓ | `/story-implement-tasks STORY-091` |

Recomendación: `/story-implement-tasks STORY-091`. El sujeto del cambio es el propio `skills/story-implement/SKILL.md`; implementarlo con `/story-implement` ejecutaría la versión instalada del skill que se está modificando (copia en `.claude/skills/`), lo que mezcla el pipeline con el objeto de prueba. `tasks.md` ya lleva el orden evals → SKILL.md → docs → verificación.

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `epic.md` › "Historias" (l. 22–27) lista STORY-086…STORY-090; STORY-091 y STORY-092 (hermanas del split de STORY-089, creadas 2026-09-11) no aparecen. `git status` las muestra como directorios no rastreados |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (cerrar `needs-changes → approved` sin editar el frontmatter y sin `tasks.md`) es literalmente el Escenario 3 (l. 42–45) y el criterio de éxito 4 (l. 110) de la épica; la descripción (l. 20) pide que "el ciclo de corrección tiene dueño" |
| Restricciones de la épica respetadas | ⚠️ | Escenario 3 (l. 45) aún exige el estado `NEEDS-CHANGES`, que STORY-089 (NFR-3, T-6.3) descarta y esta historia no implementa; ADR-0008 (creado por STORY-089) es la decisión vinculante. La contradicción se resuelve al ejecutar STORY-089 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** STORY-091 no está listada en la sección "Historias" de `epic.md` (l. 22–27) ni referenciada en "Flujos Críticos" o "Criterios de éxito", aunque implementa el Escenario 3 y el criterio de éxito 4. La tarea 6.3 de STORY-089 realinea el bullet de STORY-089 pero **no añade** los bullets de STORY-091 ni STORY-092. Consecuencia práctica: el 11d de `story-implement` ("marcar `[x]` la línea que contenga el id") no encontrará línea y emitirá `epic.md … omitiendo actualización`.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias"
- **Acción requerida:** añadir `- [ ] **STORY-091 — story-implement toma de la cola una historia rechazada y corrige en modo rework:** … — [[STORY-091-story-implement-modo-rework]]` y el bullet equivalente de STORY-092 debajo de STORY-089, y ampliar el Escenario 3 con la frase "las correcciones se aplican con `/story-implement` en modo rework (STORY-091)". Recomendado: hacerlo dentro de la tarea 6.3 de STORY-089 (mismo archivo, mismo pase); alternativa: `/epic-creation`/edición manual antes de implementar STORY-091.

### INC-002 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** el Escenario 3 de `epic.md` (l. 45) sigue diciendo "la historia queda en `NEEDS-CHANGES`", estado que esta historia no reconoce (el gate 0c solo admite `READY-FOR-IMPLEMENT/DONE` e `IMPLEMENT/IN-PROGRESS`). Es la misma desalineación registrada como INC-001 en el `analyze.md` de STORY-089, cuya tarea 6.3 la corrige.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — "Escenario 3", "Dependencias Críticas", "Riesgos"
- **Acción requerida:** ninguna adicional en STORY-091; depende de la ejecución de STORY-089 (orden declarado 089 → 091 → 092).

### INC-003 [WARNING]

- **Tipo:** — (observación de proceso; no corresponde a A–F)
- **Descripción:** la historia entró al pipeline en `SPECIFY/TODO`, sin `finvest-evaluation-report.md` propio (el split de STORY-089 la generó sin re-evaluación). `story-plan` aplicó `PLAN/IN-PROGRESS` incondicionalmente. Además, el DoD del proyecto vive en `docs/policies/dod-story.md` mientras `story-analyze` busca `definition-of-done-story.md` (mismo hallazgo INC-003 de STORY-089); la validación DoD PLAN de este reporte leyó `dod-story.md` directamente.
- **Archivo afectado:** `story.md` — frontmatter; `skills/story-analyze/SKILL.md`, `skills/story-design/SKILL.md`, `skills/story-plan/SKILL.md` (ruta del DoD)
- **Acción requerida:** opcional: `/story-evaluation STORY-091` para registrar APROBADA (la historia cumple el DoD SPECIFY por inspección: título, Como/Quiero/Para, 3 Gherkin, INVEST, `parent`, `related` a las hermanas). La ruta del DoD en los skills de planning queda como deuda ya registrada en STORY-089 › analyze.md › INC-003.

---

## Recomendaciones

1. **INC-001 —** antes de implementar STORY-091, añadir los bullets de STORY-091 y STORY-092 a `epic.md` (idealmente en la tarea 6.3 de STORY-089, que ya edita esa sección). Sin esto, 11d no marcará la historia y la épica no reflejará su avance (constitución › "epic.md debe mantenerse actualizado").
2. **INC-002 —** respetar el orden 089 → 091 → 092: STORY-089 entrega ADR-0008, el `round` en `fix-directives.md` y la realineación de la épica de la que esta historia depende para observar `🔁 Modo rework (ronda N)` con N > 1 y para que el Escenario 3 de la épica describa el comportamiento real.
3. **INC-003 —** opcional `/story-evaluation STORY-091`; no bloquea.
4. **Vía de implementación —** usar `/story-implement-tasks STORY-091` (no `/story-implement`): el skill bajo edición es `story-implement`; ejecutarlo para implementarse a sí mismo desde la copia instalada mezcla pipeline y objeto de prueba (ver "Vía de Implementación Disponible").
5. **Fixture STORY-090 (5.4–5.5) —** modifica el estado real de STORY-090 (`IMPLEMENT/DONE`, correcciones aplicadas, posible `round`). Confirmar con el usuario o ejecutar en rama; si STORY-089 no está entregada, aceptar que la ronda anunciada será 1 y que `story-code-review` no incrementará `round`.
6. **CR-002 —** los generators instalados (`skill-test-evals`, `skill-master`) no interpretan los campos de rework; la sección "Ciclo de corrección" del reporte (`✓ aplicado` / `⚠️ sin evidencia`) es la evidencia hasta que STORY-092 añada la verificación dura. Registrar el resultado observado en el `implement-report.md` de STORY-091 (tarea 5.5).

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/policies/dod-story.md` › "Definition of Done para el estado PLAN" (5 criterios). Ver INC-003 sobre el nombre del archivo.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | `story.md` › "Criterios de aceptación": Escenario principal + 2 alternativos en bloques ```gherkin; 3 requerimientos explícitos (precondición, ciclo completo, alcance) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | `design.md` › Context (tabla AC-1…AC-6, NFR-1…NFR-4), Goals con `// satisface`, D1–D8, tabla de componentes e interfaces con columna de AC; ver "Cobertura de Criterios de Aceptación": 6/6 + 4/4 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | `tasks.md`: grupo 1 evals (setup) → 2–3 `SKILL.md` en orden de pasos (componente central) → 4 documentación del skill (soporte) → 5 verificación; 24 tareas con archivo, paso y línea concretos; 5 `[P]` |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals (5 anotaciones), D1–D8 (8 anotaciones `// satisface`), tablas "Componentes afectados" (10 filas) e "Interfaces / contratos" (10 filas) con columna "AC que satisface"; "Contratos de verificación" con "AC origen" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | `design.md` › "Open Questions: Ninguna" (los nombres de campos pendientes en `story.md` quedan fijados en D3); CR-001 (escritura de `IMPLEMENT/IN-PROGRESS` inexistente hoy) y CR-002 (generators fuera del repo) con acción asignada (2.3, 5.5) |

**DoD PLAN:** 5/5 criterios ✓ — 0 ERROR.
