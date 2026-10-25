---
type: analyze
id: STORY-101
slug: STORY-101-analyze-report
title: "Analyze: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill"
story: STORY-101
design: STORY-101
testcases: STORY-101
tasks: STORY-101
created: 2026-09-24
updated: 2026-09-24
related:
  - STORY-101-dod-story-por-etapa
---

<!-- Referencias -->
[[STORY-101-dod-story-por-etapa]]

# Reporte de Coherencia: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 8/8 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 8/8 ACs con caso de prueba (E2E 1-a-1 + UT/IT/EV) |
| Alineación tareas → diseño | ✓ | 60/60 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 13/13 componentes con tarea; 1 elemento sin caso de prueba automático (INC-005) |
| Alineación con la épica EPIC-20-memory-system | ⚠️ | Historia listada; 3 tensiones con requerimientos y riesgos de la épica (INC-001…INC-003) |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias — 0 ERROR · 7 WARNING

Fuente DoD: `docs/guardrails/dod-story-checklist.md`, sección `### Definition of Done para el estado PLAN`
(la ruta `policies/definition-of-done-story.md` de la copia instalada de `story-analyze` no existe en
este repo; se usó la ruta vigente de la fuente `skills/story-analyze/SKILL.md`).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | División en un archivo por etapa con frontmatter enriquecido | ✓ | D-1 (`DOD_STAGES`), D-4 (transformación), Esquema de datos, `planDodMigration` |
| AC-2 | Cada skill referencia su DoD en `## DoD aplicable`; ninguno cita el monolítico | ✓ | D-8 (bloque estándar, 9 skills), D-6 R6/R7; alcance ajustado por CR-001/CR-003 |
| AC-3 | Mapeo `guardrails.dod.story` con fallback a convención | ✓ | D-7 (`readDodMapping`, precedencia), D-9 (plantillas de `sddf-init`), F-4 |
| AC-4 | Orden corregido CODE-REVIEW → VERIFY | ✓ | D-1 (cadena `from`/`to`), D-6 R2; cadena termina en ACCEPTANCE por CR-002 |
| AC-5 | Checklist de release en `dod-story-release.md` (`kind: content`, `applies-to: release`) | ✓ | D-1 fila `release`, D-4, D-6 R3 |
| AC-6 | Enlaces `gr-*.md` → wikilinks | ✓ | D-4 paso 4 (regla y ejemplo literal del AC) |
| AC-7 | Monolítico como índice deprecado una minor; CHANGELOG | ✓ | D-5 (esquema del índice), D-10 (CHANGELOG `Deprecated`, eliminación `4.0.0`) |
| AC-8 | `migrate --from=dod-monolithic` idempotente, sin sobrescribir sin `--force` | ✓ | D-3, D-5, F-2; formato de resumen ajustado por CR-008 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001–T002 | Líneas base de `check` y de referencias | CR-004, CR-007 | ✓ |
| T003 | Fixtures `monolith.md` / `monolith-custom.md` | D-4, F-5 | ✓ |
| T004–T005 | Tests e implementación de `DOD_STAGES` | D-1, Interfaces `DOD_STAGES` | ✓ |
| T006–T012 | Tests e implementación de `planDodMigration` e índice deprecado; CNF-01 | D-4, D-5, Interfaces `planDodMigration`, CR-006 | ✓ |
| T013–T014 | `readDodMapping` | D-7 | ✓ |
| T015–T017 | Evaluador `dodGuardrails` (R1–R7, aplicabilidad) | D-6 | ✓ |
| T018–T023 | Motor: `parseArgs`, `runMigrate`, integración en `check`, tests | D-3, D-6, CR-010 | ✓ |
| T024–T026 | Migración real del repo y re-ejecución | F-1, F-2 | ✓ |
| T027–T028 | Mapeo en `sddf.config.yaml` y plantillas de `sddf-init` | D-7, D-9 | ✓ |
| T029–T040 | Sección `## DoD aplicable` en 9 skills, agentes, recursos y evals | D-8, Componentes afectados | ✓ |
| T041–T043 | `project-policies-generation` y `sddf-init` | D-9 | ✓ |
| T044–T046 | `memory-system` SKILL.md, `memory-rules.md`, evals | D-3, D-6, D-10 | ✓ |
| T047–T054 | Documentación, CHANGELOG, índice | D-10 | ✓ |
| T055–T060 | Verificación | Contratos de verificación 1–13 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Módulo `dod-story.js` | Componentes afectados, D-2 | T005, T010, T011, T014, T017 | ✓ |
| Motor `memory-system.js` | D-3, D-6 | T019, T021, T022 | ✓ |
| DoD por etapa (7) + índice deprecado | D-1, D-5 | T024–T026 | ✓ |
| Mapeo de config | D-7 | T027, T028 | ✓ |
| Skills consumidores (9) | D-8 | T029–T038 | ✓ |
| Agentes de code review | D-8 | T032 | ✓ |
| Recursos auxiliares de skills | Componentes afectados | T032, T035, T039 | ✓ |
| Evals afectados | Componentes afectados | T040 | ✓ |
| Evals de memory-system | Componentes afectados | T046 | ✓ |
| Generador de políticas | D-9 | T041, T042 | ✓ |
| Inicializador `sddf-init` | D-9 | T028, T043 | ✓ |
| Tests | Contratos de verificación | T004–T020 | ✓ |
| Documentación | D-10 | T044, T045, T047–T054 | ✓ |
| Paso de verificación DoD SPECIFY en `story-specify` | D-8 | T038 (sin caso EV) | ⚠️ INC-005 |

---

## Alineación con la Épica

**Épica padre:** EPIC-20-memory-system

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 37 lista STORY-101 con el mismo alcance |
| Objetivo alineado | ✓ | Refuerza guardrails como capa de memoria y amplía `migrate`/`check` del skill `memory-system` |
| Restricciones respetadas | ⚠️ | Tensión con "Preservación", con "`migrate` solo hace scaffolding" y con el riesgo de tamaño de `SKILL.md`/`references` (INC-001…INC-003) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** el requerimiento **Preservación** de la épica dice que ningún modo sobrescribe archivos salvo `rebuild --force` y que *ningún modo elimina archivos*. D-5 de `design.md` (1) reemplaza el contenido del monolítico por el índice sin `--force` (lo exige AC-7 de la historia) y (2) **elimina** `policies/dod-story.md` cuando ese es el origen (CR-011 / IT-005). El punto (2) no lo pide la historia.
- **Archivo afectado:** `design.md` — sección "D-5", viñeta 3; `testcases.md` — IT-005; `epic.md` — sección "Requerimiento", viñeta "Preservación"
- **Acción requerida:** decidir explícitamente la excepción para el índice (y registrarla en la épica) y no eliminar el origen heredado: dejar `policies/dod-story.md` intacto y avisar, o convertirlo también en índice.

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** la épica declara que "`migrate` solo hace scaffolding" y deja fuera de alcance la migración automática de contenido. `migrate --from=dod-monolithic` transforma contenido. No es una migración entre harness, pero contradice la definición del modo en la épica.
- **Archivo afectado:** `epic.md` — sección "Requerimiento", párrafo "Fuera de alcance"; `design.md` — sección "D-3"
- **Acción requerida:** acotar en `epic.md` que la restricción aplica a la migración de harness, o registrar la nueva variante de `migrate` como alcance añadido por STORY-101.

### INC-003 [WARNING]

- **Tipo:** D
- **Descripción:** el riesgo de la épica sobre el tamaño de `memory-system` no está mitigado en el diseño. `skills/memory-system/SKILL.md` ya tiene 460 líneas y T044 añade parámetros, una familia y una rama de `migrate`. `gr-skill-creation-checklist.md` l. 56 exige `SKILL.md` < 500 (**error**). `references/memory-rules.md` ya tiene 327 líneas (> 300, **warn**) y T045 le añade una sección con R1–R7.
- **Archivo afectado:** `design.md` — secciones "D-10" y "Risks / Trade-offs"; `tasks.md` — T044, T045
- **Acción requerida:** poner las reglas del DoD en un archivo de referencia propio (p. ej. `references/dod-rules.md`, enlazado con "leer cuando") y añadir una tarea de verificación `wc -l` para `SKILL.md` < 500.

### INC-004 [WARNING]

- **Tipo:** D
- **Descripción:** `story.md` no refleja las decisiones del diseño. Los CR-001…CR-010 marcan `story.md` como documento afectado (9 skills en vez de 7, cadena sin `RELEASE`, rutas `skills/` en vez de `.claude/skills/`, Verificación 5 inalcanzable, CF-01 "7+1", medición de CNF-01, formato del resumen, aviso en vez de error). Si se implementa contra el texto literal de la historia, la aceptación chocará con el diseño.
- **Archivo afectado:** `story.md` — escenarios "Cada skill referencia…", "Orden del pipeline corregido", CF-01, CF-04, CNF-01, "Verificación" 2, 3 y 5
- **Acción requerida:** incorporar los CR a `story.md` antes de implementar (manualmente o con `/story-improve`).

### INC-005 [WARNING]

- **Tipo:** C
- **Descripción:** el paso nuevo de verificación del DoD SPECIFY en `story-specify` (D-8, T038) no tiene caso EV, aunque `skills/story-specify/evals/evals.json` existe. `testcases.md` lo reconoce como gap y lo condiciona a que existan evals; existen.
- **Archivo afectado:** `testcases.md` — "Notas de cobertura"; `tasks.md` — T038
- **Acción requerida:** añadir un EV (happy path con `enforcement: warn` que no bloquea `SPECIFY/DONE` + caso de DoD ausente) y la tarea correspondiente.

### INC-006 [WARNING]

- **Tipo:** D
- **Descripción:** la historia entró al pipeline de planning desde `SPECIFY/IN-PROGRESS`, no desde `SPECIFY/DONE` (precondición de `story-plan` según [[state-machine]]), y no tiene `finvest-evaluation-report.md`. Además hay tres historias con `substatus: IN-PROGRESS` a la vez (STORY-093, STORY-094, STORY-101), contra la regla WIP = 1 de `AGENTS.md`.
- **Archivo afectado:** `story.md` — frontmatter; `AGENTS.md` — "WIP = 1 por nivel de pipeline"
- **Acción requerida:** confirmar que la historia se da por especificada (o pasar `/story-evaluation`) y cerrar o bloquear las historias en curso anteriores.

### INC-007 [WARNING]

- **Tipo:** C
- **Descripción:** T041 genera las plantillas de `project-policies-generation` ejecutando la migración. Esa migración escribe `created`/`updated` con la fecha real (D-4 paso 1), mientras que la plantilla monolítica actual usa `<YYYY-MM-DD>`. Copiar el resultado "sin editarlo a mano" dejaría fechas fijas en plantillas.
- **Archivo afectado:** `tasks.md` — T041; `design.md` — D-4 paso 1, D-9
- **Acción requerida:** conservar los placeholders de fecha cuando el origen los trae, o permitir en T041 restaurar `<YYYY-MM-DD>` como única edición.

---

## Recomendaciones

1. **INC-001:** en `design.md` D-5, sustituir "el heredado se elimina" por "el heredado se conserva y se informa `[PRESERVADO]` con aviso", ajustar IT-005 en `testcases.md` y registrar en `epic.md` (Requerimiento › Preservación) la excepción del índice deprecado.
2. **INC-002:** añadir en `epic.md` (Fuera de alcance) que la restricción de `migrate` se refiere a la migración de harness y que `--from=dod-monolithic` es una variante introducida por STORY-101.
3. **INC-003:** en `design.md` D-10 y en `tasks.md` T045, mover `DOD_STAGES`/R1–R7 a `skills/memory-system/references/dod-rules.md`; añadir a la sección 11 de `tasks.md` una tarea `wc -l skills/memory-system/SKILL.md` < 500.
4. **INC-004:** actualizar `story.md` con CR-001…CR-010 antes de `/story-implement`.
5. **INC-005:** añadir `EV-007` en `testcases.md` para `story-specify` y la tarea de evals correspondiente en `tasks.md` (grupo 7).
6. **INC-006:** confirmar el estado de especificación de la historia y resolver la violación de WIP con STORY-093/STORY-094.
7. **INC-007:** precisar en T041 que se conservan los placeholders `<YYYY-MM-DD>`.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | División por etapa | ✓ | E2E-001, UT-005…UT-008, IT-002 |
| AC-2 | Referencia explícita por skill | ✓ | E2E-002, UT-023 |
| AC-3 | Mapeo en config | ✓ | E2E-003, UT-019, UT-020, IT-009 |
| AC-4 | Orden corregido | ✓ | E2E-004, UT-002, UT-022 |
| AC-5 | Release en archivo propio | ✓ | E2E-005, UT-003, UT-007, UT-009 |
| AC-6 | Wikilinks | ✓ | E2E-006, UT-010 |
| AC-7 | Compatibilidad temporal | ✓ | E2E-007, UT-017 |
| AC-8 | Idempotencia | ✓ | E2E-008, UT-014…UT-016, IT-003, IT-004 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-101` |
| tasks.md | ✓ | `/story-implement-tasks STORY-101` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | 8 escenarios Gherkin en `story.md` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: 8/8 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 60 tareas en 11 grupos, de "Setup y línea base" a "Verificación" |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | `// satisface:` en Goals y en cada D-n; columna "AC que satisface" en Componentes e Interfaces |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: ninguna bloqueante"; 11 CR registrados |
