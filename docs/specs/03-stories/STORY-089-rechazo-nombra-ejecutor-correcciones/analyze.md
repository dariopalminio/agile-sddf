---
type: analyze
id: STORY-089
slug: STORY-089-analyze-report
title: "Analyze: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md"
story: STORY-089
design: STORY-089
testcases: STORY-089
tasks: STORY-089
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-089-rechazo-nombra-ejecutor-correcciones
---

<!-- Referencias -->
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]

# Reporte de Coherencia: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 6/6 criterios cubiertos (+ 4/4 NFR) |
| Cobertura de ACs en testcases.md | ✓ | 6/6 ACs con caso de prueba (29 casos: E2E 4 · EV 15 · IT 10) |
| Alineación tareas → diseño | ✓ | 31/31 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 componentes y 8/8 interfaces con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Historia listada y objetivo alineado; el texto de la épica aún describe la solución descartada (`NEEDS-CHANGES`, "estado propio") y enlaza al slug antiguo — corrección prevista en la propia historia (NFR-3, T-6.3) |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR · 3 WARNING)

> Fuentes: `story.md` (3 escenarios Gherkin + 3 requerimientos + 4 NFR, numerados AC-1…AC-6 / NFR-1…NFR-4 en `design.md` › Context), `design.md` (D1–D8, 15 componentes, 8 interfaces, 12 contratos de verificación, CR-001/CR-002), `tasks.md` (7 grupos, 31 tareas, formato `N.M` del template), `testcases.md` (29 casos), `docs/policies/dod-story.md` (sección PLAN), `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Rechazo encola la historia (`READY-FOR-IMPLEMENT/DONE`), `fix-directives.md` con `round: 1`, sin tarea en `tasks.md`, mensaje `→ Ejecuta /story-implement` | ✓ | D2, D3, D4, D6, D7; componentes `story-code-review/SKILL.md`, `fix-directives-template.md`, `evals.json`; interfaces "Mensaje de cierre", "Escritura en tasks.md"; Flujo 1 |
| AC-2 | Segunda ronda: `round: 2`; `/story-implement-tasks` solo si existe `tasks.md` | ✓ | D2, D3, D7; interfaces "Cálculo de ronda", "Mensaje de cierre"; Flujo 1 |
| AC-3 | `approved` elimina `fix-directives.md` y deja `CODE-REVIEW/DONE` | ✓ | D6, D7; interfaz "Señal de rework"; Flujo 2 (comportamiento existente 4h, cubierto con eval nuevo) |
| AC-4 | Señal de rework = artefacto; sin estado/substatus/campo nuevo; destino `READY-FOR-IMPLEMENT/DONE` | ✓ | D1, D8; interfaces "Señal de rework", "Contrato hacia STORY-091"; componentes dominios |
| AC-5 | `round` = ronda previa + 1 (1 si no existe); escritor único `story-code-review` | ✓ | D1, D2, D6; interfaces "Frontmatter de fix-directives.md", "Cálculo de ronda" |
| AC-6 | `story-implement-tasks` aplica correcciones por presencia del archivo, sin literal de tarea | ✓ | D4, D5, D7; componentes `story-implement-tasks/SKILL.md`, `story-implement-tasks/evals/evals.json`; interfaces "Pre-paso 2f", "Gate 2c"; Flujo 3 |
| NFR-1 | Documentación (template, dominios, guía, README, CHANGELOG) | ✓ | D6, D8; componentes de documentación |
| NFR-2 | ADR-0008, no supersede ADR-0003 | ✓ | D8; componentes ADR-0008 y `docs/adr/README.md` |
| NFR-3 | `epic.md` sin `NEEDS-CHANGES` ni ruta inexistente | ✓ | D8; componente Épica EPIC-19 |
| NFR-4 | Idempotencia de la re-ejecución en `needs-changes` | ✓ | D2, D4; contrato de verificación V-11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 | Actualizar eval `needs-changes-hallazgo-high-genera-fix-directives` | D7, V-1 | ✓ |
| 1.2 | Eval nuevo `needs-changes-segunda-ronda-incrementa-round` | D2, D3, D7, V-2 | ✓ |
| 1.3 | Eval nuevo `needs-changes-sin-tasks-md-no-menciona-implement-tasks` | D3, D7, V-3 | ✓ |
| 1.4 | Eval nuevo `approved-elimina-fix-directives-previo` | D7, V-4 | ✓ |
| 1.5 | Crear `story-implement-tasks/evals/evals.json` (caso presencia sin literal) | D5, D7, V-6, CR-002 | ✓ |
| 1.6 | Eval `tasks-md-legado-con-literal-no-reaplica` | D5, V-7 | ✓ |
| 2.1 | `story-code-review` Objetivo | D4; componente SKILL.md | ✓ |
| 2.2 | `story-code-review` Posicionamiento | D1; componente SKILL.md | ✓ |
| 2.3 | `story-code-review` Paso 4f (cálculo de ronda, escritor único) | D1, D2; interfaces "Cálculo de ronda", "Frontmatter" | ✓ |
| 2.4 | `story-code-review` Paso 4g (eliminar 4g.1, `$TASKS_EXISTS`, mensaje) | D3, D4; interfaz "Mensaje de cierre" | ✓ |
| 2.5 | `story-code-review` Paso 7 | D3; interfaz "Mensaje de cierre" | ✓ |
| 2.6 | `story-code-review` Salida + verificación `grep` | D4; interfaz "Escritura en tasks.md"; V-8 | ✓ |
| 3.1 | Template `fix-directives-template.md` | D6; componente template | ✓ |
| 3.2 | Ejemplo `example-needs-changes/fix-directives.md` | D6; componente ejemplos | ✓ |
| 3.3 | Ejemplo `example-needs-changes-medium/fix-directives.md` | D6; componente ejemplos | ✓ |
| 4.1 | `story-implement-tasks` gate 2c | D5.2; interfaz "Gate 2c" | ✓ |
| 4.2 | `story-implement-tasks` pre-paso 2f | D5.1; interfaz "Pre-paso 2f" | ✓ |
| 4.3 | `story-implement-tasks` Paso 3c (literal legado) | D5.3 | ✓ |
| 4.4 | `story-implement-tasks` nota D-3 | D5.3 | ✓ |
| 4.5 | `story-implement-tasks` Paso 4 (sección de reporte, sugerencia) | D5; interfaz "Pre-paso 2f" (salida) | ✓ |
| 4.6 | `story-implement-tasks` Posicionamiento, 1d, Entrada | D5; interfaz "Contrato hacia STORY-091" (precondiciones) | ✓ |
| 5.1 | Crear ADR-0008 | D8; componente ADR-0008 | ✓ |
| 5.2 | Fila en `docs/adr/README.md` | D8; componente índice de ADRs | ✓ |
| 6.1 | `domain-story-lifecycle.md` glosario | D8; componente dominio ciclo de vida | ✓ |
| 6.2 | `domain-state-management.md` §5.3 | D8; componente dominio gestión de estados | ✓ |
| 6.3 | `epic.md` EPIC-19 | D8; componente Épica | ✓ |
| 6.4 | `sddf-commands-pipeline.md` sección 4 | D8; componente guía | ✓ |
| 6.5 | `README.md` + `docs/domains/README.md` | D8, CR-001; componente READMEs | ✓ |
| 6.6 | `CHANGELOG.md` | D8; componente CHANGELOG | ✓ |
| 7.1 | Refrescar `.claude/skills/` | Componente "Copia instalada"; riesgo asociado | ✓ |
| 7.2 | `/skill-test-evals story-code-review` | V-1…V-4, V-12 | ✓ |
| 7.3 | `/skill-test-evals story-implement-tasks` | V-6, V-7, V-12 | ✓ |
| 7.4 | Inspección estática `grep` | V-8, V-9, CR-001 | ✓ |
| 7.5 | Fixture STORY-090 parte 1 (`story-implement-tasks`) | Flujo 3, V-6, V-7 | ✓ |
| 7.6 | Fixture STORY-090 parte 2 (`story-code-review`) | Flujo 1/2, V-5, V-11 | ✓ |
| 7.7 | DoD IMPLEMENT/CODE-REVIEW + checkbox en `epic.md` | NFR-3; DoD `dod-story.md` | ✓ |

Sin tareas de TIPO B. La tarea 7.7 no implementa un componente sino el cierre de la épica; se acepta como tarea de verificación trazada a NFR-3.

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `story-code-review` — Objetivo, Posicionamiento, 4f, 4g, 7, Salida | Componentes afectados (fila 1) | 2.1–2.6 | ✓ |
| Template `fix-directives-template.md` | Componentes afectados (fila 2) | 3.1 | ✓ |
| Ejemplos `fix-directives.md` (2) | Componentes afectados (fila 3) | 3.2, 3.3 | ✓ |
| Evals de `story-code-review` | Componentes afectados (fila 4) | 1.1–1.4, 7.2 | ✓ |
| Skill `story-implement-tasks` — 2c, 2f, 3c, D-3, Posicionamiento | Componentes afectados (fila 5) | 4.1–4.6 | ✓ |
| Evals de `story-implement-tasks` | Componentes afectados (fila 6) | 1.5, 1.6, 7.3 | ✓ |
| ADR-0008 | Componentes afectados (fila 7) | 5.1 | ✓ |
| Índice de ADRs | Componentes afectados (fila 8) | 5.2 | ✓ |
| Dominio ciclo de vida — glosario "Rework" | Componentes afectados (fila 9) | 6.1 | ✓ |
| Dominio gestión de estados — §5.3 | Componentes afectados (fila 10) | 6.2 | ✓ |
| Épica EPIC-19 | Componentes afectados (fila 11) | 6.3, 7.7 | ✓ |
| Guía de pipeline — sección 4 | Componentes afectados (fila 12) | 6.4 | ✓ |
| README raíz y README de dominios | Componentes afectados (fila 13) | 6.5 | ✓ |
| CHANGELOG | Componentes afectados (fila 14) | 6.6 | ✓ |
| Copia instalada de skills | Componentes afectados (fila 15) | 7.1 | ✓ |
| Interfaz "Señal de rework" | Interfaces / contratos | 2.1, 2.2, 4.6 (documentación del contrato) + 1.4 (eval AC-3) | ✓ |
| Interfaz "Frontmatter de fix-directives.md" | Interfaces / contratos | 2.3, 3.1 | ✓ |
| Interfaz "Cálculo de ronda" | Interfaces / contratos | 2.3, 1.2 | ✓ |
| Interfaz "Mensaje de cierre en needs-changes" | Interfaces / contratos | 2.4, 2.5, 1.1–1.3 | ✓ |
| Interfaz "Escritura en tasks.md" | Interfaces / contratos | 2.4, 2.6 | ✓ |
| Interfaz "Pre-paso 2f" | Interfaces / contratos | 4.2, 4.5 | ✓ |
| Interfaz "Gate 2c" | Interfaces / contratos | 4.1 | ✓ |
| Interfaz "Contrato hacia STORY-091" | Interfaces / contratos | 4.6 (precondiciones), 5.1 (ADR lo fija); implementación en STORY-091 | ✓ |

Sin elementos de TIPO C.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Rechazo encola y nombra ejecutor | ✓ | E2E-001, EV-001, EV-007, IT-003 |
| AC-2 | Segunda ronda / alternativa condicionada a `tasks.md` | ✓ | E2E-002, EV-002, EV-003 |
| AC-3 | Aprobación limpia la señal | ✓ | E2E-003, EV-004, E2E-004 |
| AC-4 | Señal = artefacto, sin estado nuevo | ✓ | E2E-003, EV-009, IT-004, IT-006 |
| AC-5 | `round` previa + 1, escritor único | ✓ | E2E-001, EV-001, EV-002, EV-005, EV-006, EV-015, IT-001 |
| AC-6 | `story-implement-tasks` por presencia | ✓ | E2E-004, EV-010, EV-011, EV-012, EV-013 |
| NFR-1 | Documentación | ✓ | IT-001, IT-002, IT-006, IT-009, IT-010 |
| NFR-2 | ADR-0008 | ✓ | IT-008 |
| NFR-3 | Épica alineada | ✓ | IT-007 |
| NFR-4 | Idempotencia | ✓ | E2E-002, EV-007, EV-008 |

Los tres escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001…E2E-003). E2E-004 (fixture STORY-090) no deriva de un Gherkin propio sino del Flujo 4 de `design.md` y del criterio de éxito 4 de EPIC-19; `testcases.md` lo declara explícitamente en Notas de cobertura.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-089` |
| tasks.md | ✓ | `/story-implement-tasks STORY-089` |

Recomendación: `/story-implement-tasks STORY-089` — las 31 tareas ya llevan el orden evals → skills → assets → docs → verificación que exige el principio 11 (evals antes del `SKILL.md`), y los sujetos de prueba son skills Markdown cuyo ciclo RED/GREEN se ejecuta con `skill-test-evals` (generator `eval` en `sddf.config.yaml`).

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ⚠️ | Listada (`epic.md` l. 26, `[ ]`) pero con el título anterior ("Ciclo de corrección con dueño…"), el texto "deja la historia en un estado propio" y el wikilink al slug antiguo `[[STORY-089-story-fix-post-code-review]]` (directorio eliminado en el working tree; el actual es `STORY-089-rechazo-nombra-ejecutor-correcciones`) |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" de la historia (saber el siguiente paso tras un rechazo, sin estado nuevo, sin editar el frontmatter, sin depender de `tasks.md`) cumple el objetivo de la épica "el ciclo de corrección tiene dueño" (l. 20) y el criterio de éxito 4 (l. 110: `needs-changes` → `approved` sin edición manual del frontmatter), que ya está formulado sin estado nuevo |
| Restricciones de la épica respetadas | ⚠️ | Escenario 3 (l. 45), dependencia crítica (l. 96) y riesgo (l. 104) exigen el estado `NEEDS-CHANGES` y la ruta `docs/knowledge/guides/state-machine.md`; la historia descarta ese estado con argumentación explícita (Notas › "Por qué no existe un estado de corrección") y la ruta no existe. La contradicción es conocida y su resolución forma parte del alcance de la historia (NFR-3, D8, T-6.3, IT-007) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** `epic.md` describe para STORY-089 la solución que la historia descarta: "estado propio" (l. 26), `NEEDS-CHANGES` (l. 45, l. 96, l. 104) y la ruta inexistente `docs/knowledge/guides/state-machine.md` (l. 96, l. 104). El wikilink de la historia (l. 26) apunta al slug antiguo `STORY-089-story-fix-post-code-review`.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — secciones "Historias", "Escenario 3", "Dependencias Críticas", "Riesgos"
- **Acción requerida:** ninguna adicional en planning — la historia ya lo cubre (NFR-3 en `story.md`; D8 en `design.md`; tarea 6.3 en `tasks.md`; IT-007 en `testcases.md`). Ejecutar 6.3 durante IMPLEMENT.

### INC-002 [WARNING]

- **Tipo:** — (observación de proceso; no corresponde a A–F)
- **Descripción:** `story.md` entró al pipeline en `SPECIFY/IN-PROGRESS`, no en `SPECIFY/DONE`. El `finvest-evaluation-report.md` del directorio (evaluado 2026-09-11, score 4.17) tiene `decision: DIVIDIR`; el split se ejecutó (STORY-091, STORY-092) y la historia core fue reescrita, pero no consta una re-evaluación posterior que la lleve a `SPECIFY/DONE`. `story-plan` aplicó `PLAN/IN-PROGRESS` incondicionalmente, como especifica.
- **Archivo afectado:** `story.md` — frontmatter; `finvest-evaluation-report.md` — frontmatter
- **Acción requerida:** opcional: ejecutar `/story-evaluation STORY-089` sobre la versión post-split para dejar constancia de APROBADA en el reporte (la señal `SPECIFY/DONE` ya quedó superada por la transición de planning). No bloquea la implementación: la historia cumple el DoD de SPECIFY por inspección (título, Como/Quiero/Para, 3 Gherkin, INVEST, frontmatter con `parent` y `related` a las hermanas del split).

### INC-003 [WARNING]

- **Tipo:** — (observación sobre el entorno de planning; no corresponde a A–F)
- **Descripción:** el DoD del proyecto vive en `docs/policies/dod-story.md` (renombrado en el commit `fcc96ed`, y así lo referencia `constitution.md`), pero `story-analyze` y `story-design` buscan `$SPECS_BASE/policies/definition-of-done-story.md`. La validación DoD PLAN de este reporte se hizo leyendo `dod-story.md` directamente. `story-code-review` sí usa `dod-story.md`.
- **Archivo afectado:** `skills/story-analyze/SKILL.md` (l. 74, 172, 175), `skills/story-design/SKILL.md` (Entrada / Paso 3), `skills/story-plan/SKILL.md` (mensaje de error)
- **Acción requerida:** fuera del alcance de STORY-089. Registrar como deuda en EPIC-19 (encaja en "el framework sea coherente consigo mismo") o como historia `chore` propia: alinear las rutas del DoD en los skills de planning con `dod-story.md`.

---

## Recomendaciones

1. **INC-001 —** ejecutar la tarea 6.3 de `tasks.md` tal como está especificada (bullet STORY-089 con slug nuevo, Escenario 3, dependencia crítica, riesgo, `updated`). Verificar con IT-007 (`grep -n "NEEDS-CHANGES\|knowledge/guides/state-machine\|STORY-089-story-fix-post-code-review" …/epic.md` = 0). Mantener `[ ]` en la lista de historias hasta 7.7.
2. **INC-002 —** si se quiere el registro formal, ejecutar `/story-evaluation STORY-089` antes de implementar; de lo contrario, continuar — el DoD SPECIFY se cumple por inspección y el estado ya avanzó a planning.
3. **INC-003 —** abrir una historia `chore` en EPIC-19 (o anotarla en "Notas adicionales" de la épica) para unificar la ruta del DoD en `story-analyze`, `story-design` y `story-plan` con `docs/policies/dod-story.md`. No tocar esos skills dentro de STORY-089.
4. **Orden de ejecución —** respetar el orden de `tasks.md` (grupo 1 antes que 2 y 4): el principio 11 de la constitución exige los `evals.json` antes de editar los `SKILL.md`; 7.1 (refrescar `.claude/skills/`) debe preceder a 7.2/7.3 para que `skill-test-evals` ejecute la versión editada.
5. **Fixture STORY-090 —** las tareas 7.5 y 7.6 modifican el estado real de STORY-090 (`IMPLEMENT/DONE`, correcciones aplicadas, `round`). Confirmar con el usuario antes de ejecutarlas, o ejecutarlas en una rama; el resultado observado se registra en el `implement-report.md` de STORY-089 como pide 7.6.

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/policies/dod-story.md` › "Definition of Done para el estado PLAN" (5 criterios). Ver INC-003 sobre el nombre del archivo.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | `story.md` › "Criterios de aceptación": Escenario principal + 2 alternativos en bloques ```gherkin con Dado/Cuando/Entonces; 3 requerimientos adicionales explícitos |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | `design.md` › Context (tabla AC-1…AC-6, NFR-1…NFR-4), Goals con `// satisface`, D1–D8 y tabla de componentes con columna "AC que satisface"; ver "Cobertura de Criterios de Aceptación" arriba: 6/6 + 4/4 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | `tasks.md`: grupo 1 Setup/evals → 2 y 4 componentes centrales (skills) → 3 soporte (template/ejemplos) → 5–6 documentación → 7 verificación; 31 tareas con archivo y línea concretos; 12 marcadas `[P]` |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals (5 anotaciones), D1–D8 (8 anotaciones `// satisface`), tablas "Componentes afectados" e "Interfaces / contratos" con columna de AC en las 23 filas; "Contratos de verificación" con columna "AC origen" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | `design.md` › "Open Questions: Ninguna"; dos hallazgos registrados como CR-001 (enlaces rotos a `state-machine.md`) y CR-002 (`evals.json` inexistente en `story-implement-tasks`), ambos con acción asignada en `tasks.md` (6.5, 1.5) |

**DoD PLAN:** 5/5 criterios ✓ — 0 ERROR.
