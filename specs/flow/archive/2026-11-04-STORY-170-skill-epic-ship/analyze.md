---
type: analyze
id: STORY-170
slug: STORY-170-analyze-report
title: "Analyze: Skill epic-ship"
story: STORY-170
design: STORY-170
tasks: STORY-170
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-170-skill-epic-ship
---

<!-- Referencias -->
[[STORY-170-skill-epic-ship]]

# Reporte de Coherencia: Skill epic-ship

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (y CNF-1…CNF-6) |
| Alineación tareas → diseño | ✓ | 32/32 tareas con diseño o regla del proyecto |
| Cobertura diseño → tareas | ✓ | 20/20 componentes e interfaces con tarea; Contratos de verificación 1-10 con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada, objetivo alineado y restricciones respetadas; CS-20 ya incluye `state-machine.md` y el nombre `epic-validate-report.md` |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

Esta es una reejecución tras `/story-fix-plan` (`fix-plan-report.md`, 2026-10-29): INC-001 (tipo C) e INC-002 (tipo D) del análisis anterior quedan resueltos (ver «Hallazgos previos»).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Preparar la versión y confirmar la liberación: entrada en `CHANGELOG.md`, `release-notes.md`, pasos manuales y `SHIP/DONE` tras confirmar | ✓ | Componentes (`SKILL.md`, `references/release-content.md`, `assets/release-notes-template.md`); Interfaces «Escritura de `CHANGELOG.md`», «Escritura de `release-notes.md`», «Pasos manuales», «Confirmación», «Escritura de `epic.md`»; Esquema de datos; Flujo F1; D-2, D-5, D-6; Contrato 1 |
| AC-2 | Sin confirmación: documentos escritos, status sin cambio | ✓ | Interfaz «Confirmación»; Flujo F2; D-5, D-8; Contrato 2 |
| AC-3 | Épica sin validación aprobada: remite a `/epic-validate` y no escribe nada | ✓ | Interfaces «Resolución de épica», «Gate de validación», «Gate de status»; Flujo F3; D-7; Degradación (reporte ausente o ilegible); Contrato 3 |
| AC-4 | Sin commit, tag, merge, push, release ni despliegue | ✓ | Goals; bloque «Pasos de liberación manuales» («epic-ship no ejecuta ninguno»); D-8; Contrato 4 |

CNF-1 (D-8, F2) · CNF-2 (D-4, F4, Contrato 5) · CNF-3 (Interfaces de escritura, Contrato 6) · CNF-4 (Contrato 7) · CNF-5/CNF-6 (D-1, D-3, «Decisiones de complejidad justificada», Contrato 8): cubiertos.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Scaffolding con `skill-master` | Componentes (estructura de `skills/epic-ship/`), D-1 | ✓ |
| T002 | Frontmatter de `SKILL.md` | Interfaz «Frontmatter de `SKILL.md`» | ✓ |
| T003 | Objetivo, Qué hace/no hace, regla de repositorio | Goals/Non-Goals, D-8 | ✓ |
| T004 | Regla de contenido untrusted | D-10, Interfaz «Lectura de `story.md`» | ✓ |
| T005 | Paso 0 con marcador de layout fijo | Contrato 7 (CNF-4) | ✓ |
| T006 | Paso 1: resolver épica | Interfaces «Invocación», «Resolución de épica» | ✓ |
| T007 | Paso 2: gates de validación y status | Interfaces «Gate de validación», «Gate de status»; F3; D-7 | ✓ |
| T008 | Paso 3: inventario y caso sin historias liberadas | Esquema «Historia liberada»; Degradación | ✓ |
| T009 | Paso 4: bloque de `CHANGELOG.md` y delimitador incompleto | Interfaz «Escritura de `CHANGELOG.md`»; D-2, D-4; Degradación | ✓ |
| T010 | Paso 5: `release-notes.md` y template ausente | Interfaz «Escritura de `release-notes.md`»; F4; Degradación | ✓ |
| T011 | Paso 6: resumen y pasos manuales con versión sugerida | «Pasos de liberación manuales»; D-6 | ✓ |
| T012 | Paso 7: confirmación y escritura de `SHIP/DONE` | Interfaces «Confirmación», «Escritura de `epic.md`»; F1, F2, F4 | ✓ |
| T013 | Modos de ejecución | D-8 | ✓ |
| T014 | Sección Salida y encoding | Interfaces de escritura (CNF-3) | ✓ |
| T015 | `references/release-content.md` | Componente «Reglas de contenido»; Esquema de datos; D-2, D-3, D-4 | ✓ |
| T016 | `assets/release-notes-template.md` | Componente «Template de notas»; Esquema `release-notes.md` | ✓ |
| T017 | `evals/evals.json` TC-001…TC-005 | Componente «Evals»; Contratos 1-5 | ✓ |
| T018 | Casos de borde en inputs de TC-001 | Esquema «Historia liberada» (prefijo `EPIC-NN`, `CANCELED/DONE`) | ✓ |
| T019 | Invariante 6 de `domain-state-management` | Componente «Invariante 6»; D-9; CR-002 | ✓ |
| T020 | `domain-epic-lifecycle` §5, §7, §8, §9 (incluye `validate-report.md` → `epic-validate-report.md`) | Componente «Ciclo de vida de épica»; D-9; CR-001 | ✓ |
| T021 | Nota de `state-machine.md` | Componente «Máquina de estados»; D-9; CR-002 | ✓ |
| T022 | Fila en `domain-skills-map.md` | Componente «Mapa de skills» | ✓ |
| T023 | Fila en `sddf-commands-pipeline.md` | Componente «Pipeline de comandos» | ✓ |
| T024 | Aplicar CR-001 y CR-002 en `story.md` | Registro de Cambios (CR-001, CR-002) | ✓ |
| T025 | Presupuesto de líneas y `description` | Contrato 8 | ✓ |
| T026 | Grep de operaciones de repositorio | Contrato 4 | ✓ |
| T027 | Orden gate → escritura → confirmación | Contratos 2-3; F1-F3 | ✓ |
| T028 | UTF-8 sin BOM en `skills/epic-ship/` | CNF-3 (regla del proyecto) | ✓ |
| T029 | `verify-fixed-layout`, `verify:eval-inventory`, `verify:links` | Contratos 7 y 9 | ✓ |
| T030 | `npm test` y `npm run verify:repository` | Contrato 10 | ✓ |
| T031 | `graphify update .` | Regla de `AGENTS.md` (sección graphify), no un elemento de design.md | ✓ |
| T032 | Evals y SMOKE-7 como ejecución manual, con `head -c3` sobre los archivos escritos | Contratos 1-6, regla de `AGENTS.md` sobre `npm run test:eval` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `epic-ship` (`SKILL.md`) | Decisions › Componentes | T001-T014 | ✓ |
| Reglas de contenido (`references/release-content.md`) | Decisions › Componentes | T015 | ✓ |
| Template de notas (`assets/release-notes-template.md`) | Decisions › Componentes | T016 | ✓ |
| Evals | Decisions › Componentes | T017, T018 | ✓ |
| Invariante 6 | Decisions › Componentes | T019 | ✓ |
| Ciclo de vida de épica | Decisions › Componentes | T020 | ✓ |
| Máquina de estados | Decisions › Componentes | T021 | ✓ |
| Mapa de skills | Decisions › Componentes | T022 | ✓ |
| Pipeline de comandos | Decisions › Componentes | T023 | ✓ |
| Invocación | Decisions › Interfaces | T006 | ✓ |
| Frontmatter de `SKILL.md` | Decisions › Interfaces | T002 | ✓ |
| Resolución de épica | Decisions › Interfaces | T006 | ✓ |
| Gate de validación | Decisions › Interfaces | T007 | ✓ |
| Gate de status | Decisions › Interfaces | T007 | ✓ |
| Lectura de `story.md` | Decisions › Interfaces | T004, T015 | ✓ |
| Escritura de `CHANGELOG.md` | Decisions › Interfaces | T009, T015 | ✓ |
| Escritura de `release-notes.md` | Decisions › Interfaces | T010, T016 | ✓ |
| Pasos manuales | Decisions › Interfaces | T011 | ✓ |
| Confirmación | Decisions › Interfaces | T012 | ✓ |
| Escritura de `epic.md` | Decisions › Interfaces | T012 | ✓ |

Contratos de verificación: 1-5 → T017 (y T032 para su ejecución manual); 4 → T026; 6 → T032; 7 → T005, T029; 8 → T025; 9 → T019-T021, T029; 10 → T030. Degradación gradual (P7): cada fila tiene tarea (T007, T008, T009, T010, T015).

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › `## Historias` (línea 62): **STORY-170** — Skill epic-ship |
| Objetivo de la historia alineado con la épica | ✓ | «preparar una versión documentada … y dejar la épica en `SHIP/DONE`» coincide con el paso `SHIP` del Objetivo de la épica, con CS-17, CS-18 y con SMOKE-7 |
| Restricciones de la épica respetadas | ✓ | «SHIP simplificado» y «Operaciones de repositorio» (`## Notas`) respetadas por D-8 y AC-4. CS-20 (línea 92) ya nombra `docs/architecture/state-machine.md` y el nombre `epic-validate-report.md` en `domain-epic-lifecycle`; las Notas (línea 199) asignan a STORY-170 esa parte de CS-20, en línea con D-9, CR-001 y CR-002. CS-12: `package.json › files` publica `skills/` completo |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

### Hallazgos previos (análisis anterior, resueltos)

| Origen | Tipo | Estado | Evidencia |
|---|---|---|---|
| INC-001 | C | Resuelto | design.md › Contratos de verificación › Contrato 6 cambia el método a «Revisión manual en el recorrido SMOKE-7 (`head -c3` ≠ `EF BB BF`)»; tasks.md › T032 lo ejecuta sobre `CHANGELOG.md`, `<EPIC_DIR>/release-notes.md` y `epic.md` |
| INC-002 | D | Resuelto | `epic.md` › CS-20 añade `state-machine.md` y el nombre `epic-validate-report.md`; Notas (línea 199) lo asignan a STORY-170; design.md › CR-001 y tasks.md › T020 corrigen §9 en esta historia |

---

## Recomendaciones

Sin acciones obligatorias. Observaciones que no son hallazgos de tipo A-F:

1. **Coordinación (CR-002):** antes de T019 y T021, comprobar si STORY-175 ya editó la invariante 6 de `docs/domains/domain-state-management.md` (§4) y la nota «SHIP y COMPLETED son transiciones manuales» de `docs/architecture/state-machine.md` (línea 178), y rebasar conservando su cláusula de `COMPLETED`.
2. **story.md › frontmatter `related`:** cita `STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada`, pero el directorio existente es `specs/flow/STORY-171-completar-archivar-epica-liberada/` (el que usa design.md). Conviene corregirlo al aplicar T024, que ya edita `story.md`.
3. **story.md › Notas:** la línea de «Criterios de salida que cubre» todavía nombra solo `domain-epic-lifecycle` y `domain-state-management`; T024 la alinea con CS-20 (añade `state-machine.md` y el nombre `epic-validate-report.md`).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-170` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-170` |

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (Correlación 6 omitida).

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin` (principal, alternativo, rechazo, regla) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 4/4 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes e Interfaces, columna «AC» en Decisiones técnicas y Contratos, `// satisface:` en Goals, Esquema de datos y Flujos |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; D-1…D-10; CR-001 y CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 32 tareas atómicas; AC-1 (T009-T012, TC-001), AC-2 (T012, TC-002), AC-3 (T006-T007, TC-003/004), AC-4 (T003, T026, aserciones `not_contains` de T017) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe |
