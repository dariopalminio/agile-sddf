---
type: analyze
id: STORY-173
slug: STORY-173-analyze-report
title: "Analyze: Skill epic-refine: asignar la cobertura de criterios de salida"
story: STORY-173
design: STORY-173
tasks: STORY-173
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-173-cubrir-criterios-salida-epica
---

<!-- Referencias -->
[[STORY-173-cubrir-criterios-salida-epica]]

# Reporte de Coherencia: Skill epic-refine: asignar la cobertura de criterios de salida

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 23/23 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos con tarea (el componente «sin cambios» `skills/epic-analyze/` no requiere tarea) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en «Fase PLAN — skill nuevo `epic-refine`»; objetivo dentro del alcance PLAN y de CS-15 |
| Cumplimiento DoD — Fase PLAN | ✓ | 6/7 criterios ✓ (1 N/A: testcases.md no existe) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Asignar la cobertura de `CS-1` solo a STORY-302 (única candidata sin dependientes) y registrar `SAL-01 · CS-1 → STORY-302` | ✓ | D-2 (candidatas desde `parcial:`), D-3 (regla de cierre con `depends-on:`), D-5 (AC de cierre + cita E1 solo en la historia de cierre), D-6 (Elemento `SAL-01 · CS-1 → STORY-302`), F-1, V-1, TC-009 |
| AC-2 | Criterio sin evidencia parcial → `SAL-01 · CS-2` fuera de alcance con responsable `PO`, sin citas | ✓ | D-4 (caso «sin evidencia parcial»), D-6 (fila fuera de alcance, cambios `—`), F-2, V-2, TC-010 |
| CNF-1 | `story.md.bak` antes de cada escritura | ✓ | D-5 (un `.bak` por archivo, D-7 de STORY-165), V-3 |
| CNF-2 | No falsificación de cobertura | ✓ | D-3 (sin desempate), D-4 (casos al PO, historias implementadas), D-5 (AC + E1 siempre juntos, una sola historia), V-4 |
| CNF-3 | UTF-8 sin BOM | ✓ | D-5 (encoding heredado de D-7 de STORY-165), V-5 |
| CNF-4 | Detalle SAL en `references/`, `SKILL.md` < 500 líneas | ✓ | D-1 (`references/sal-corrections.md`, carga por familia), V-6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-165 está implementada | CR-005, Risks | ✓ |
| T002 | `sal-corrections.md`: extracción y revalidación | D-2 | ✓ |
| T003 | `sal-corrections.md`: regla de la historia de cierre | D-3, CR-001, CR-002 | ✓ |
| T004 | `sal-corrections.md`: casos fuera de alcance y estados admitidos | D-4, CR-003 | ✓ |
| T005 | `sal-corrections.md`: forma del AC de cierre y de la cita E1 | D-5 | ✓ |
| T006 | `sal-corrections.md`: filas de plan/reporte y relectura | D-5, D-6 | ✓ |
| T007 | `SKILL.md`: fila de enrutamiento SAL y error de catálogo ausente | D-1, F-5 | ✓ |
| T008 | `SKILL.md`: restricción CNF-2, `Replanifica:`, `description` | D-1, D-4, D-5 | ✓ |
| T009 | Template del reporte: forma de Elemento SAL | D-6 | ✓ |
| T010 | README del skill | D-1 | ✓ |
| T011 | Fixture `cobertura-cierre/` | D-8 | ✓ |
| T012 | Fixture `cobertura-sin-parcial/` | D-8 | ✓ |
| T013 | Fixture `cobertura-empate/` | D-8 | ✓ |
| T014 | Fixture `cobertura-reejecucion/` | D-8, F-4 | ✓ |
| T015 | Fixture `cobertura-smoke-implementada/` | D-8 | ✓ |
| T016 | Evals TC-009…TC-013, versión `1.1.0` | D-8 | ✓ |
| T017 | Escritores del template de historia (central + seed) | D-7, CR-004 | ✓ |
| T018 | Guía de pipeline §2 | D-7 | ✓ |
| T019 | Verificar tamaño de `SKILL.md` y carga del catálogo | V-6 | ✓ |
| T020 | Verificar UTF-8 sin BOM y central = seed | V-5, V-7 | ✓ |
| T021 | `npm test` y `npm run verify:repository` | V-8 | ✓ |
| T022 | `graphify update .` | AGENTS.md (grafo tras modificar código) | ✓ |
| T023 | Registrar evals manuales y recorrido de cobertura | V-1…V-4 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| `skills/epic-refine/SKILL.md` (enrutamiento, restricción, `description`) | Componentes afectados, D-1 | T007, T008 | ✓ |
| `skills/epic-refine/references/sal-corrections.md` | Componentes afectados, D-1…D-6 | T002–T006 | ✓ |
| `skills/epic-refine/assets/epic-refine-report-template.md` | Componentes afectados, D-6 | T009 | ✓ |
| `skills/epic-refine/README.md` | Componentes afectados, D-1 | T010 | ✓ |
| Evals y fixtures SAL | Componentes afectados, D-8 | T011–T016 | ✓ |
| Template de historia (central + seed) | Componentes afectados, D-7 | T017 | ✓ |
| `docs/guides/sddf-commands-pipeline.md` §2 | Componentes afectados, D-7 | T018 | ✓ |
| `skills/epic-analyze/` (sin cambios, consumido) | Componentes afectados | — (no requiere cambio) | ✓ |
| Interfaz reporte de análisis → `epic-refine` (SAL) | Interfaces y contratos | T002 | ✓ |
| Interfaz `story.md` → regla de cierre (`depends-on:`) | Interfaces y contratos | T003 | ✓ |
| Interfaz `SKILL.md` → `sal-corrections.md` | Interfaces y contratos | T007, T019 | ✓ |
| Interfaz `epic-refine` → `story.md` de cierre | Interfaces y contratos | T005, T008 | ✓ |
| Interfaz `epic-refine` → `epic-refine-report.md` | Interfaces y contratos | T006, T009 | ✓ |
| Interfaz `epic-refine` → usuario (`Replanifica:`) | Interfaces y contratos | T004, T008 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` sección «Historias», bloque «Fase PLAN — skill nuevo `epic-refine` (dividido en tres historias)»: `- [ ] **STORY-173** — Skill epic-refine: asignar la cobertura de criterios de salida` |
| Objetivo de la historia alineado con la épica | ✓ | Alcance PLAN: «`epic-refine`, que aplica a la épica y a sus historias los hallazgos de `epic-analyze-report.md`»; la historia trata SAL-01/SAL-02 |
| Restricciones de la épica respetadas | ✓ | CS-15: backup de cada archivo modificado (D-5), `epic-refine-report.md` (D-6), sin cambiar `status`/`substatus` (D-4, D-5); CS-12: el skill ya registrado por STORY-165 conserva marcador y evals (T016, T021); CS-21: T021 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Observaciones no bloqueantes:

1. **CR-001 (design.md:276):** la historia define la historia de cierre por los «dependientes en el índice de `epic.md`», pero el índice no declara dependencias; el diseño las toma de las líneas `depends-on:` de los `story.md` del índice (D-3). Conviene precisarlo en `story.md` › `## 📎 Notas` («dependientes = historias del índice que declaran `depends-on:`») para que el AC-1 y su fixture (T011) se lean igual.
2. **CR-005 / T001:** `skills/epic-refine/` aún no existe y STORY-165 está en `PLAN`. No iniciar `/story-implement-tasks STORY-173` hasta que STORY-165 esté implementada; si su contrato cambia, revisar D-1 y D-6 antes de T002.
3. **Riesgo de uso real (design.md, Risks):** las épicas actuales no usan `depends-on:`, por lo que varias candidatas sin dependientes irán al PO por empate (D-3). Es el comportamiento seguro según CNF-2; documentarlo en el README (T010) evita sorpresas.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-173` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-173` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | story.md:28 (AC-1) y :39 (AC-2), bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-2, D-3, D-5, D-6; AC-2: D-4, D-6 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Encabezados D-1…D-8 con `// satisface:`; tablas de componentes e interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas | ✓ | — | `## Open Questions`: «Ninguna»; ambigüedades registradas como CR-001…CR-005 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 23 tareas acotadas a un archivo o verificación; AC-1 (T002–T009, T011, T016), AC-2 (T004, T006, T012, T016) |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | N/A | — | testcases.md no existe (modo `--only-tasks`); los escenarios se verifican con evals TC-009…TC-013 (D-8) |
