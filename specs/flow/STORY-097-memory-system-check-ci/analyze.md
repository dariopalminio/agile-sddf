---
type: analyze
id: STORY-097
slug: STORY-097-analyze-report
title: "Analyze: Verificar la consistencia de la memoria con un modo check apto para CI"
story: STORY-097
design: STORY-097
testcases: STORY-097
tasks: STORY-097
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-097-memory-system-check-ci
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]

# Reporte de Coherencia: Verificar la consistencia de la memoria con un modo check apto para CI

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 4/4 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 8/8 componentes y 5/5 interfaces con tarea |
| Alineación con la épica EPIC-20-memory-system | ✓ | Listada, objetivo alineado, restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ✓ Coherente

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `check` reporta sin escribir; exit 1/0 | ✓ | D-1 (evaluadores), D-4 (salida y exit codes), D-5; F-1; Interfaz `node … check` |
| AC-2 | `check --json` con harness, raíz, `ok`, resumen y problemas; re-chequeo | ✓ | D-4; F-2; Interfaz "Objeto JSON de check"; Esquema "Resultado de check" |
| AC-3 | Cuatro familias con reglas fijas; wikilinks en código y `templates/` ignorados | ✓ | D-1 (tabla de evaluadores), D-2 (extracción), D-3 (`REQUIRED_FIELDS`) |
| AC-4 | Solo lectura; exit 0/1/2 | ✓ | D-1 (evaluadores puros), D-4 (exit 2 y stderr); F-3 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Casos de evals | Componente "Evals del skill"; D-4, D-5; V-11 | ✓ |
| T002 | Fixture broken/ con falsos positivos | Componente "Fixtures"; D-2, D-3 | ✓ |
| T003 | Tests del motor | Componente "Tests del motor"; V-1…V-10 | ✓ |
| T004 | `REQUIRED_FIELDS` + extracción de wikilinks | Componentes "Subcomando check", "Extracción de wikilinks"; D-2, D-3; CR-002 | ✓ |
| T005 | Cuatro evaluadores puros | D-1; Interfaz "Evaluador"; Esquema "Problem" | ✓ |
| T006 | Subcomando check (texto/JSON/exit codes) | D-4; Interfaz `node … check`; Interfaz "Objeto JSON" | ✓ |
| T007 | GREEN + medición < 5 s | NFR-2; V-10 | ✓ |
| T008 | Modo check en SKILL.md | Componente "Modo check del skill"; D-5; F-4 | ✓ |
| T009 | references/memory-rules.md sección Check | Componente "Extracción de wikilinks" (referencia); D-2, D-3, D-4 | ✓ |
| T010 | Evals en verde | V-11 | ✓ |
| T011 | memory-system.md §10 y §7 | Componente "Documentación"; D-6; CR-001 | ✓ |
| T012 | Guía CI, README, CHANGELOG | Componente "Documentación"; D-5, D-6; CR-003 | ✓ |
| T013 | check sobre el repo + correcciones acotadas | Componente "Memoria de este repositorio"; D-6 | ✓ |
| T014 | Guardrail de skills | V-12 | ✓ |
| T015 | Verificación sugerida de story.md | V-1, V-4 | ✓ |
| T016 | verify:* y npm test | V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Subcomando `check` + evaluadores + `REQUIRED_FIELDS` | Componentes; D-1, D-3, D-4 | T004, T005, T006, T007 | ✓ |
| Extracción de wikilinks (compartida con `index`) | Componentes; D-2 | T004, T009 | ✓ |
| Modo `check` del skill | Componentes; D-5 | T008, T010 | ✓ |
| Evals del skill | Componentes | T001, T010 | ✓ |
| Fixtures `examples/broken/` | Componentes | T002 | ✓ |
| Tests del motor | Componentes | T003, T007 | ✓ |
| Documentación | Componentes; D-6 | T011, T012 | ✓ |
| Memoria de este repositorio | Componentes; D-6 | T013 | ✓ |
| Interfaz `/memory-system check [--json]` | Interfaces | T008 | ✓ |
| Interfaz `node … check --root --harness --json` | Interfaces | T006 | ✓ |
| Interfaz "Objeto JSON de check" | Interfaces | T006, T003 | ✓ |
| Interfaz `REQUIRED_FIELDS` | Interfaces | T004, T009 | ✓ |
| Interfaz "Evaluador" | Interfaces | T005 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-20-memory-system

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 33: `STORY-097 — Verificar la consistencia de la memoria con un modo check apto para CI` con wikilink `[[STORY-097-memory-system-check-ci]]` |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (bloquear en CI los cambios que dejan la memoria inconsistente) materializa el Escenario 3 de los smoke tests de la épica y el requerimiento "`check` apto para CI" (exit 0/1/2, `--json`) |
| Restricciones de la épica respetadas | ✓ | Solo lectura, sin escribir fuera de `docs/`, once capas según `memory-system.md`, independencia de stack con degradación sin Node: todas recogidas en D-1, D-3, D-5 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. **`story.md` — nota de dependencia:** el diseño registra en CR-002 que `check` reutiliza el escáner de STORY-095 y que, si se implementa antes, el escáner nace aquí; la historia ya lo prevé en sus notas, no requiere cambio.
2. **`memory-system.md` §7 invariante 2 (CR-001):** hacerlo en T011, antes de ejecutar `check` sobre el repositorio (T013), para que el conjunto de campos documentado coincida con el verificado.
3. **T013 — alcance de las correcciones:** el primer `check` sobre `docs/` de este repositorio probablemente reporte decenas de frontmatters sin `slug` o `title` (guías y runbooks antiguos). Mantener la regla de D-6: corregir solo lo evidente y registrar el resto como deuda en `implement-report.md`; si el volumen es alto, considerar `ensure --fix-frontmatter` (STORY-096) como vía de corrección masiva.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | `check` determinista, exit 1/0 | ✓ | E2E-001, IT-001, EV-001, EV-003 |
| AC-2 | `--json` y re-chequeo | ✓ | E2E-002, UT-008, IT-001, EV-002 |
| AC-3 | Familias y exclusiones | ✓ | UT-001…UT-007 |
| AC-4 | Solo lectura y exit 2 | ✓ | E2E-001, UT-009, UT-010, EV-004 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-097` |
| tasks.md | ✓ | `/story-implement-tasks STORY-097` |

Ambas vías disponibles. `tasks.md` (16 tareas) ordena RED → GREEN; `/story-implement-tasks`
es la vía con menor fricción y no supera el umbral de confirmación.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 2 bloques `gherkin` (Dado/Cuando/Entonces): informe con exit code y salida JSON con re-chequeo |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 4/4 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 5 grupos: evals/fixtures → motor → SKILL.md/referencias → documentación y memoria → verificación; 16 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-6 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; CR-001…CR-003 con acción requerida |
