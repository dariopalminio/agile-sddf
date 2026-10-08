---
type: analyze
id: STORY-120
slug: STORY-120-analyze-report
title: "Analyze: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo"
story: STORY-120
design: STORY-120
tasks: STORY-120
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-120-epic-analyze-integridad-historias
---

<!-- Referencias -->
[[STORY-120-epic-analyze-integridad-historias]] · [[STORY-120-epic-analyze-integridad-historias-design]] · [[STORY-120-epic-analyze-integridad-historias-tasks]] · [[EPIC-19-framework-consistency]]

# Reporte de Coherencia: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos (7 componentes + 6 interfaces) con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ✓ | La historia sí figura en la sección "Historias" de `epic.md` |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR · 3 WARNING) — sin inconsistencias bloqueantes.

Hallazgos no bloqueantes adicionales que no constituyen inconsistencia tipificada se recogen en "Observaciones" al final de "Recomendaciones".

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Índice consistente → `epic-analyze-report.md` con `APPROVED`, 0 ERROR, fuentes sin cambios | ✓ | Goals (l. 54), D-1, D-3, D-4, D-5, D-6, D-7, D-9 (escritura única), Flujo F-1, Contratos #1–#2, componente `skills/epic-analyze/SKILL.md` |
| AC-2 | Desajustes del índice (faltante, huérfana, duplicada, 1 y 4 F1) → severidad, elemento y veredicto | ✓ | D-4 (Vía A), D-5 (Vía B), D-6 (INT-01…INT-05, "un hallazgo por línea"), D-7 (función de veredicto), Esquema de datos (cruce), Flujo F-2, Contratos #3 y #5 |
| AC-3 | Épica no resuelta → mensaje con ruta buscada y sin reporte | ✓ | D-2 (tabla de resultados, 0 coincidencias), Interfaz I-3 (`FAIL` + `MOTIVO`), Flujo F-3, Contrato #4 |

CNF-1…CNF-8 también tienen elemento de diseño: CNF-1 → D-7; CNF-2 → D-9/D-10; CNF-3 → D-6 (orden determinista)/D-9; CNF-4 → D-8; CNF-5 → D-11; CNF-6 → D-1/D-13/D-14; CNF-7 → D-10; CNF-8 → D-14 (con CR-002 y CR-003).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (tests, inventario de evals, enlaces, estado de `domain-skills-map.md`, clave `historias`) | Contratos #9, #11; D-3; D-14; CR-002/CR-003 | ✓ |
| T002 | `evals.json` con TC-001…TC-006 | D-13; componente "Casos de eval" | ✓ |
| T003 | `evals.json` con TC-007…TC-010 y `not_contains` de FILE | D-13; CNF-2 | ✓ |
| T004 | Validar JSON, `--dry-run`, commit solo de evals (RED) | D-13 | ✓ |
| T005 | Template seed `assets/epic-analyze-report-template.md` | D-8, D-9, I-4; componente "Template seed del reporte" | ✓ |
| T006 | `SKILL.md`: frontmatter y secciones de cabecera | D-1, D-10, D-11, D-12; componente "Contrato del skill" | ✓ |
| T007 | Cláusula `ai-untrusted-content-clause` | D-10 | ✓ |
| T008 | Paso 0 (raíz) y Paso 1 (resolver épica) | D-2, F-3, F-4 | ✓ |
| T009 | Paso 2: sección de historias por clave | D-3 | ✓ |
| T010 | Paso 3: Vía A | D-4 | ✓ |
| T011 | Paso 4: Vía B | D-5 | ✓ |
| T012 | Paso 5: comprobaciones INT y orden determinista | D-6, I-5, I-6 | ✓ |
| T013 | Paso 6: veredicto | D-7 | ✓ |
| T014 | Paso 7: template del reporte | D-8, I-4 | ✓ |
| T015 | Pasos 8–9: escritura y salida por modo | D-9, D-11, I-3 | ✓ |
| T016 | Revisión integral de `SKILL.md` | D-1, D-12; CNF-4 | ✓ |
| T017 | `docs/domains/domain-skills-map.md` | D-14; CR-003; componente "Mapa de skills" | ✓ |
| T018 | `docs/domains/domain-epic-lifecycle.md` §8, §9 | D-14; componente "Ciclo de vida de épica" | ✓ |
| T019 | `docs/guides/sddf-commands-pipeline.md` §2 | D-14; componente "Guía de pipeline" | ✓ |
| T020 | `CHANGELOG.md` `[Unreleased] › Added` | D-14; componente "Changelog" | ✓ |
| T021 | Contrato #9 (checklist de skills, inventario, raíz, orden git) | Contratos #9; D-13 | ✓ |
| T022 | Contratos #7 y #10 (sin estructura embebida, cláusula IA) | Contratos #7, #10; D-8, D-10 | ✓ |
| T023 | Contrato #11 (`npm pack`, docs, enlaces) | Contrato #11; D-14; CR-002 | ✓ |
| T024 | `npm run test:eval -- epic-analyze` | Contratos #1, #3–#6, #8 | ✓ |
| T025 | Ejecución real sobre EPIC-19 (`--auto`), idempotencia | Contrato #2; D-9; Risks (EPIC-19 → `BLOCKED`) | ✓ |
| T026 | Regresión final y encoding UTF-8 sin BOM | Contratos #9, #11 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Contrato del skill `skills/epic-analyze/SKILL.md` | Componentes afectados (l. 321) | T006–T016 | ✓ |
| Template seed `assets/epic-analyze-report-template.md` | Componentes afectados (l. 322); D-8 | T005 | ✓ |
| Casos de eval `evals/evals.json` | Componentes afectados (l. 323); D-13 | T002–T004 | ✓ |
| Mapa de skills `docs/domains/domain-skills-map.md` | Componentes afectados (l. 324); D-14 | T017 | ✓ |
| Ciclo de vida de épica `docs/domains/domain-epic-lifecycle.md` | Componentes afectados (l. 325); D-14 | T018 | ✓ |
| Guía de pipeline `docs/guides/sddf-commands-pipeline.md` | Componentes afectados (l. 326); D-14 | T019 | ✓ |
| `CHANGELOG.md` | Componentes afectados (l. 327); D-14 | T020 | ✓ |
| I-1 Invocación | Interfaces (l. 336) | T006 (Parámetros), T008 | ✓ |
| I-2 Lectura de la épica | Interfaces (l. 337) | T009, T010 | ✓ |
| I-3 Retorno en modo Agent | Interfaces (l. 338) | T015 (verificado en T003/TC-010 y T025) | ✓ |
| I-4 Template del reporte | Interfaces (l. 339) | T005, T014 | ✓ |
| I-5 Hallazgo | Interfaces (l. 340) | T012 | ✓ |
| I-6 Extensión por familias | Interfaces (l. 341) | T012 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Nota informativa: `design.md` D-13 y `tasks.md` T002–T003 definen TC-001…TC-010 en `skills/epic-analyze/evals/evals.json`, con trazabilidad AC-1 → TC-001, AC-2 → TC-002…TC-006, AC-3 → TC-007.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-120` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-120` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency (`docs/specs/02-epics/EPIC-19-framework-consistency/epic.md`, `status: DEVELOP/IN-PROGRESS`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | Si lista STORY-120 y sus hermanas STORY-121/STORY-122 |
| Objetivo de la historia alineado con la épica | ⚠️ | EPIC-21-colapsar-specs-dos-niveles (`docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`) aborda la reorganización de la estructura de `specs/` a dos niveles, mientras que STORY-120 se centra en la integridad del índice de historias de una épica. No está del todo alineado aunque se quiere liberar en el mismo release. |
| Restricciones de la épica respetadas | ✓ | La épica no declara restricciones que la historia contradiga; el diseño no modifica `epic.md` ni `story.md` (D-9, D-10). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E — criterio DoD PLAN no plenamente evidenciado (regla de duda → ⚠️)
- **Descripción:** El criterio "Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`)" se cumple de forma parcial: D-8 (`// satisface: CNF-4, CNF-3`), D-10 (`CNF-2, CNF-7`), D-11 (`CNF-5`) y D-14 (`CNF-8, CNF-6`) trazan solo a CNF, y las filas "Mapa de skills", "Ciclo de vida de épica", "Guía de pipeline" y "Changelog" de la tabla de componentes (l. 324–327) citan `CNF-8` sin anotación `// satisface: AC-N`. La trazabilidad existe (a requisitos no funcionales de la historia), pero no a un AC.
- **Archivo afectado:** `design.md` — sección "Decisions" (D-8 l. 195, D-10 l. 253, D-11 l. 263, D-14 l. 302) y "Componentes afectados" (l. 324–327)
- **Acción requerida:** Aceptar la traza a CNF como suficiente (los CNF son requisitos de la historia) o añadir la anotación `// satisface: CNF-N` también en las filas de documentación de la tabla de componentes para que la trazabilidad sea uniforme.

---

## Recomendaciones


**Observaciones (no tipificadas, no cuentan como hallazgo):**

- `design.md` CR-001 sigue pendiente de confirmación del Product Owner (severidad ERROR de INT-04 e INT-06, que AC-2 no ejemplifica). `tasks.md` T003 deja **opcionales** los casos de eval para INT-04 e INT-06, por lo que esas dos comprobaciones podrían quedar sin prueba; se recomienda volverlos obligatorios en T003 si el PO confirma CR-001.
- `design.md` D-13, TC-001, admite `ERROR: 0` "o conteo equivalente del template": al escribir T002 conviene fijar el fragmento exacto que produce el template seed de T005 para que la aserción no sea ambigua.
- `epic.md` de EPIC-19 › Notas (l. 79) afirma que el directorio es `EPIC-19/` sin slug, pero el directorio real ya es `EPIC-19-framework-consistency/`; nota obsoleta ajena a esta historia.

---

## Cumplimiento DoD — Fase PLAN

DoD resuelto: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo con `Ejemplos`), AC-3 (error), todos en bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-1/D-9/F-1; AC-2 → D-4…D-7/F-2; AC-3 → D-2/F-3 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-8, D-10, D-11, D-14 y 4 filas de componentes trazan solo a CNF (ver INC-003) |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: Ninguna" (l. 429); ambigüedades registradas como CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (26 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T010–T013/T015/T024/T025; AC-2 → T010–T013/T024; AC-3 → T008/T024; cada tarea apunta a un archivo y un paso concretos |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` ausente (condición no activada) |
